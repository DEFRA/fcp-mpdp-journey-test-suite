# fcp-mpdp-journey-test-suite

Playwright test suite for the Making Payment Data Public (MPDP) service.

- user acceptance tests using [Playwright](https://playwright.dev/)
- cross-browser desktop testing using native Playwright (Chromium, Firefox, WebKit)
- cross-device mobile testing using [BrowserStack](https://www.browserstack.com/) (Android, iOS)
- security testing using [ZAP](https://www.zaproxy.org/)
- accessibility testing using [axe-core](https://www.deque.com/axe/)

## Architecture

Desktop browsers (Chrome, Firefox, Safari/WebKit) are tested natively by Playwright inside the container. BrowserStack is used for real mobile devices (Android and iOS) via the `browserstack-node-sdk` which wraps Playwright and manages the remote device sessions.

The BrowserStackLocal tunnel binary is pre-installed in the Docker image to avoid runtime downloads. The SDK handles tunnel lifecycle automatically based on the YAML configuration.

## Requirements

- Node.js >= 24
- Docker (recommended, but tests can also run directly on the host)
- The MPDP frontend running on `localhost:3000`

### Test data

In order to ensure this test suite passes when running locally and via CI/CD pipelines on CDP, a known database record is used when testing journeys that require payment activity data e.g. the `/details` page. To achieve this a known database record that exists in all CDP environments (excluding production) is added to the [`seed`](https://github.com/DEFRA/fcp-mpdp-core/blob/main/data/seed.js) module on [fcp-mpdp-core](https://github.com/DEFRA/fcp-mpdp-core). The record is initially set up as an object, `testData` and this can be easily updated to reflect any of the known records that exist in the `DEV`, `TEST`, and `PERF-TEST` databases.

## Local Development

### Setup

Install dependencies and create a `.env` file:

```bash
npm install
cp .env.example .env
```

Edit `.env` with your BrowserStack credentials. `BASE_URL` is set to `http://localhost:3000` by default — Docker Compose overrides it with `http://host.docker.internal:3000` for container-to-host access.

To run tests **with Docker**, build the image:

```bash
docker compose build
```

To run tests **without Docker**, install Playwright browsers:

```bash
npx playwright install
```

ZAP security tests are skipped automatically when ZAP is not running, so no additional setup is needed outside Docker.

### Running tests

| Script | Description |
|--------|-------------|
| `npm run docker:test` | Run all desktop browser tests in Docker (Chromium, Firefox, WebKit + ZAP + axe) |
| `npm run docker:test:browserstack` | Run mobile device tests in Docker via BrowserStack |
| `npm run test` | Run all desktop browser tests directly on the host |
| `npm run test:debug` | Run tests with the Playwright inspector for step-through debugging |
| `npm run test:browserstack` | Run BrowserStack mobile tests directly on the host |
| `npm run test:all` | Run desktop + BrowserStack tests sequentially |

### Running a specific project (browser)

Playwright projects are defined in `playwright.config.js`. Pass `--project` to run a subset:

```bash
npm run test -- --project=chromium
npm run test -- --project=firefox
npm run test -- --project=webkit
npm run test -- --project="mobile:ios-safari"
npm run test -- --project="mobile:android-samsung"
npm run test -- --project="mobile:android-firefox"
```

Multiple projects can be combined:

```bash
npm run test -- --project=chromium --project=firefox
```

This also works with Docker (pass args after the service name):

```bash
docker compose run --build --rm fcp-mpdp-journey-test-suite npx playwright test --project=chromium
```

### Custom target URL

Override `BASE_URL` to test against a different environment:

```bash
BASE_URL=https://fcp-mpdp-frontend.dev.cdp-int.defra.cloud npm run test
```

Or edit `BASE_URL` in your `.env` file.

### Reporting

This test suite uses **Allure** for generating test reports that are compatible with the CDP Portal infrastructure. Allure provides:

- CDP Portal integration
- Historical test trends
- S3 publishing pipeline
- Enterprise reporting standards

The test configuration generates Allure reports in `allure-results/` (raw data) and can optionally publish to `allure-report/` (HTML report).

To publish the report run the following command after running the tests:

```bash
npm run report:publish
```

## Production

### Running the tests

Tests are run from the CDP Portal under the Test Suites section. Before any changes can be run, a new Docker image must be built — this happens automatically when a pull request is merged into `main`. You can check the progress of the build under the Actions section of this repository.

The default test run (`test:all`) executes desktop browser tests first using native Playwright, then mobile device tests via BrowserStack.

The results of the test run are made available in the portal.

### Requirements of CDP Environment Tests

1. Your service builds as a Docker container using `.github/workflows/publish.yml`. The workflow tags the Docker images allowing the CDP Portal to identify how the container should be run on the platform.

2. The Dockerfile's entrypoint script should return exit code 0 if the test suite passes or 1/>0 if it fails.

3. Test reports should be published to S3 using the script in `./bin/publish-tests.sh` in Allure format.

## Environment Variables

The test scripts load `.env` automatically via Node's `--env-file-if-exists` flag. Create a `.env` file from the example (`cp .env.example .env`) and edit as needed.

| Variable | Required | Description |
|----------|----------|-------------|
| `BASE_URL` | Yes (for host runs) | Target URL. Enables local mode (retries=0, trace=on, video=on). Set in `.env.example` by default. Docker Compose overrides with `http://host.docker.internal:3000`. |
| `BROWSERSTACK_USER` | For BrowserStack tests | BrowserStack username |
| `BROWSERSTACK_KEY` | For BrowserStack tests | BrowserStack access key |
| `BROWSERSTACK_BUILD_NAME` | No | Label shown in BrowserStack dashboard (defaults to `FCP MPDP Local`) |
| `ENVIRONMENT` | CDP only | CDP environment name (injected by platform) |
| `BROWSERSTACK_PROXY_HOST` | CDP only | Proxy host for BrowserStack tunnel (injected by platform) |
| `BROWSERSTACK_PROXY_PORT` | CDP only | Proxy port for BrowserStack tunnel (injected by platform) |
| `HTTP_PROXY` | CDP only | HTTP proxy URL for Playwright requests (injected by platform) |

## BrowserStack

BrowserStack is used exclusively for real mobile device testing. Desktop browsers are handled natively by Playwright.

The `browserstack-node-sdk` wraps the Playwright CLI and manages:
- Remote device session creation
- BrowserStackLocal tunnel lifecycle
- Platform/device allocation from the YAML config

The tunnel binary (`BrowserStackLocal`) is pre-installed in the Docker image at `/root/.browserstack/BrowserStackLocal`.

### Configuration

| File | Purpose |
|------|---------|
| [`browserstack.yml`](./browserstack.yml) | Device platforms, tunnel settings, proxy (when on CDP) |
| [`playwright.browserstack.config.js`](./playwright.browserstack.config.js) | Playwright config wrapping base config with conditional proxy support |

### GOV.UK Browser Requirements Coverage

For the complete list of browsers that GOV.UK services should support, see: [GOV.UK Service Manual - Designing for different browsers and devices](https://www.gov.uk/service-manual/technology/designing-for-different-browsers-and-devices)

| Platform | Browser | Tested | Method |
|----------|---------|--------|--------|
| **Windows** | Chrome | ✅ | Playwright desktop (Chromium) |
| **Windows** | Edge | ✅ | Playwright desktop (Chromium) |
| **Windows** | Firefox | ✅ | Playwright desktop (Firefox) |
| **macOS** | Safari | ✅ | Playwright desktop (WebKit) |
| **macOS** | Chrome | ✅ | Playwright desktop (Chromium) |
| **macOS** | Firefox | ✅ | Playwright desktop (Firefox) |
| **iOS** | Safari | ✅ | Playwright mobile emulation (WebKit + iPhone 15) |
| **iOS** | Chrome | ✅ | Playwright mobile emulation (WebKit + iPhone 15) |
| **iOS** | Edge | ✅ | Playwright mobile emulation (WebKit + iPhone 15) |
| **Android** | Chrome | ✅ | BrowserStack real device (Galaxy S25 + Tab S10 Plus) |
| **Android** | Samsung Internet | ✅ | Playwright mobile emulation (Chromium + Galaxy S24) |
| **Android** | Firefox | ✅ | Playwright mobile emulation (Firefox + Pixel 7) |

#### Testing methods

| Method | Description |
|--------|-------------|
| **Playwright desktop** | Native browser engines on desktop viewports. Runs in Docker container. |
| **Playwright mobile emulation** | Native browser engines with mobile device profiles (viewport, user agent, touch, device scale factor). Runs in Docker container. |
| **BrowserStack real device** | Real Android devices via BrowserStack Automate tunnel. |

> **Note on mobile emulation:** All iOS browsers (Safari, Chrome, Edge) use the WebKit rendering engine — which is exactly what Playwright's WebKit provides. This makes iOS emulation particularly accurate. Samsung Internet is Chromium-based, so Playwright's Chromium engine is a close match. Emulation cannot replicate hardware-specific quirks or OS-level gesture handling, but it validates rendering, layout, and functionality at mobile viewports.

## Security Testing

Security testing uses ZAP (Zed Attack Proxy) running a single spider scan from the root URL. This is implemented as a dedicated test in [`test/specs/security.test.js`](./test/specs/security.test.js) which skips gracefully when ZAP is not available.

In the Docker container, ZAP is started automatically by the [`entrypoint.sh`](./entrypoint.sh) script before tests execute.

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government licence v3
