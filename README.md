# fcp-mpdp-journey-test-suite

Playwright test suite for the Making Payment Data Public (MPDP) service.

- user acceptance tests using [Playwright](https://playwright.dev/)
- cross-browser desktop testing using native Playwright (Chromium, Firefox, WebKit)
- cross-device mobile testing using [BrowserStack](https://www.browserstack.com/) (Android, iOS)
- security testing using [ZAP](https://www.zaproxy.org/)
- accessibility testing using [axe-core](https://www.deque.com/axe/)

## Architecture

Desktop browsers (Chrome, Edge, Firefox, Safari) are tested natively by Playwright inside the container — no tunnel or remote infrastructure required. BrowserStack is used only for real mobile devices (Android and iOS) via a direct WebSocket connection to `wss://cdp.browserstack.com/playwright`.

The BrowserStackLocal tunnel is managed explicitly in [`browserstack/global-setup.js`](./browserstack/global-setup.js) and [`browserstack/global-teardown.js`](./browserstack/global-teardown.js). The platform matrix is defined in [`browserstack/platforms.js`](./browserstack/platforms.js).

## Requirements

This application is intended to be run in a Docker container to ensure consistency across environments.

Docker can be installed from [Docker's official website](https://docs.docker.com/get-docker/).

### Test data

In order to ensure this test suite passes when running locally and via CI/CD pipelines on CDP, a known database record is used when testing journeys that require payment activity data e.g. the `/details` page. To achieve this a known database record that exists in all CDP environments (excluding production) is added to the [`seed`](https://github.com/DEFRA/fcp-mpdp-core/blob/main/data/seed.js) module on [fcp-mpdp-core](https://github.com/DEFRA/fcp-mpdp-core). The record is initially set up as an object, `testData` and this can be easily updated to reflect any of the known records that exist in the `DEV`, `TEST`, and `PERF-TEST` databases.

## Local Development

The MPDP service must be running on `localhost:3000` prior to the test run.

As the tests are intended to run in a container, the base URL defaults to `http://host.docker.internal:3000` to allow the container to access the host machine. If you need to run the tests against a different URL, you can set the `BASE_URL` environment variable.

### Setup

Install application dependencies:

```bash
npm install
```

Build the Docker image:

```bash
docker compose build
```

### Running local tests with Playwright

Run journey tests using Docker with the [local Playwright configuration](./playwright.local.config.js):

```bash
npm run docker:test:local
```

### Running local tests with Playwright + BrowserStack

Run journey tests using Docker with the [local BrowserStack configuration](./playwright.local.browserstack.config.js):

```bash
npm run docker:test:local:browserstack
```

### Running tests without Docker

Run desktop browser tests directly (requires Playwright browsers installed locally):

```bash
npm run test:local
```

Run with debug mode:

```bash
npm run test:local:debug
```

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

## BrowserStack

BrowserStack is used exclusively for real mobile device testing. Desktop browsers are handled natively by Playwright.

The connection is made directly via WebSocket (`wss://cdp.browserstack.com/playwright`). The tunnel binary (`BrowserStackLocal`) is pre-installed in the Docker image and managed by the global setup/teardown scripts.

### Configuration

| File | Purpose |
|------|---------|
| [`playwright.browserstack.config.js`](./playwright.browserstack.config.js) | CDP Portal BrowserStack execution (includes proxy support) |
| [`playwright.local.browserstack.config.js`](./playwright.local.browserstack.config.js) | Local BrowserStack execution (no proxy) |
| [`browserstack/platforms.js`](./browserstack/platforms.js) | Device/browser matrix |
| [`browserstack/global-setup.js`](./browserstack/global-setup.js) | Tunnel establishment |
| [`browserstack/global-teardown.js`](./browserstack/global-teardown.js) | Tunnel teardown |

### Environment Variables

Before running BrowserStack tests, add the following to a `.env` file in the root of the project:

```bash
BROWSERSTACK_USER=<your_BROWSERSTACK_USER>
BROWSERSTACK_KEY=<your_BROWSERSTACK_KEY>
```

On CDP, the `CDP_HTTP_PROXY` environment variable is automatically injected and used to route the BrowserStack tunnel through the platform proxy.

### GOV.UK Browser Requirements Coverage

For the complete list of browsers that GOV.UK services should support, see: [GOV.UK Service Manual - Designing for different browsers and devices](https://www.gov.uk/service-manual/technology/designing-for-different-browsers-and-devices)

| Platform | Browser | Tested | Method |
|----------|---------|--------|--------|
| **Windows** | Chrome | ✅ | Native Playwright (Chromium) |
| **Windows** | Edge | ✅ | Native Playwright (Chromium) |
| **Windows** | Firefox | ✅ | Native Playwright (Firefox) |
| **macOS** | Safari | ✅ | Native Playwright (WebKit) |
| **macOS** | Chrome | ✅ | Native Playwright (Chromium) |
| **macOS** | Firefox | ✅ | Native Playwright (Firefox) |
| **iOS** | Safari | ✅ | BrowserStack (iPhone 16 Pro) |
| **iOS** | Chrome | ❌ | Not supported by BrowserStack/Playwright |
| **Android** | Chrome | ✅ | BrowserStack (Galaxy S25 + Tab S10 Plus) |
| **Android** | Samsung Internet | ❌ | Not supported by BrowserStack/Playwright |

## Security Testing

Security testing uses ZAP (Zed Attack Proxy) running a single spider scan from the root URL. This is implemented as a dedicated test in [`test/specs/security.test.js`](./test/specs/security.test.js) which skips gracefully when ZAP is not available.

In the Docker container, ZAP is started automatically by the [`entrypoint.sh`](./entrypoint.sh) script before tests execute.

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government licence v3
