fcp-mpdp-journey-test-suite

The template to create a service that runs Playwright tests against an environ#### Coverage Summary
- **✅ Fully Tested**: 6/10 browser combinations (60%)
- **⚠️ Beta Testing**: 1/10 browser combinations (iOS Safari)
- **🖥️ Desktop Coverage**: 100% (6/6 desktop browsers)
- **📱 Mobile Coverage**: 10% (1/4 mobile browsers in beta)

## Requirements

### Node.js

Please install [Node.js](http://nodejs.org/) `>= v22` and [npm](https://nodejs.org/) `>= v10`. You will find it
easier to use the Node Version Manager [nvm](https://github.com/creationix/nvm)

To use the correct version of Node.js for this application, via nvm:

```bash
nvm use
```

### Test data

In order to ensure this test suite passes when running locally and via CI/CD pipelines on CDP, a known database record is used when testing journeys that require payment activity data e.g. the `/details` page. To achieve this a known database record that exists in all CDP environments (excluding production) is added to the [`seed`](https://github.com/DEFRA/fcp-mpdp-core/blob/main/data/seed.js) module on [fcp-mpdp-core](https://github.com/DEFRA/fcp-mpdp-core). The record is initially set up as an object, `testData` and this can be easily updated to reflect any of the known records that exist in the `DEV`, `TEST`, and `PERF-TEST` databases.

## Local Development

### Setup

Install application dependencies:

```bash
npm install
```

### Running local tests using Playwright

Run journey tests using [local Playwright configuration](./playwright.local.config.js).

```bash
npm run test:local
```

### Running local tests using Playwright + BrowserStack

Run journey tests using [local Playwright + BrowserStack configuration](./playwright.local.browserstack.config.js).  

```bash
npm run test:local:browserstack
```

You must have a BrowserStack account to run the journey tests locally against BrowserStack. If you are unable to obtain a BrowserStack account then please proceed to run the local journey tests using [Playwright only](#running-local-tests-using-playwright).

### Debugging local tests

```bash
npm run test:local:debug
```

### Reporting

This test suite uses **Allure** for generating test reports that are compatible with the CDP Portal infrastructure. Allure provides:

- CDP Portal integration
- Historical test trends  
- S3 publishing pipeline
- Enterprise reporting standards

The test configuration generates Allure reports in `allure-results/` (raw data) and `allure-report/` (HTML report).

## Production

### Running the tests

Tests are run from the CDP-Portal under the Test Suites section. Before any changes can be run, a new docker image must be built, this will happen automatically when a pull request is merged into the `main` branch.
You can check the progress of the build under the actions section of this repository. Builds typically take around 1-2 minutes.

The results of the test run are made available in the portal.

## Requirements of CDP Environment Tests

1. Your service builds as a docker container using the `.github/workflows/publish.yml`
   The workflow tags the docker images allowing the CDP Portal to identify how the container should be run on the platform.
   It also ensures its published to the correct docker repository.

2. The Dockerfile's entrypoint script should return exit code of 0 if the test suite passes or 1/>0 if it fails

3. Test reports should be published to S3 using the script in `./bin/publish-tests.sh` in Allure format

## BrowserStack

Two Playwright configuration files are provided to help run the tests using BrowserStack in both a GitHub workflow (`playwright.github.browserstack.config.js`) and from the CDP Portal (`playwright.browserstack.config.js`).
They can be run from npm using the `npm run test:browserstack` (for running via portal) and `npm run test:github:browserstack` (from GitHub runner).
See the CDP Documentation for more details.

BrowserStack support for Playwright page assertions such as `toHaveUrl`, `toHaveText` and `toHaveTitle` is currently inconsistent across devices.  As a workaround, these assertions have been replaced with alternative matchers.

### Environment Variables

Before running BrowserStack tests, you need to set up the following environment variables:

```bash
export BROWSERSTACK_USER=<your_browserstack_username>
export BROWSERSTACK_KEY=<your_browserstack_access_key>
```

### GOV.UK Browser Requirements Coverage

For the complete list of browsers that GOV.UK services should support, see: [GOV.UK Service Manual - Designing for different browsers and devices](https://www.gov.uk/service-manual/technology/designing-for-different-browsers-and-devices)

The table below shows which required browsers are tested by our BrowserStack configuration:

| Platform | Browser | BrowserStack Test | Notes |
|----------|---------|-------------------|-------|
| **Windows** | Chrome | ✅ |  |
| **Windows** | Edge | ✅ |  |
| **Windows** | Firefox | ✅ |  |
| **macOS** | Safari | ✅ |  |
| **macOS** | Chrome | ✅ |  |
| **macOS** | Firefox | ✅ |  |
| **iOS** | Safari | ⚠️ | In Beta |
| **iOS** | Chrome | ❌ | Not supported |
| **Android** | Chrome | ✅ | Not supported |
| **Android** | Samsung Internet | ❌ | Not supported |

### Testing Commands
```bash
# Test all working browsers against localhost
npm run test:local:browserstack

# Test all working browsers against deployed service
npm run test:browserstack
```

## Security Testing

This test suite includes ZAP (Zed Attack Proxy) security testing integration. ZAP automatically scans for security vulnerabilities and integrates results with Allure reporting.

### Requirements

For local testing, ZAP must be running before tests execute:

```bash
docker compose up -d zap
```

The local test scripts (`npm run test:local`, `npm run test:local:debug` and `npm run test:local:browserstack`) automatically start ZAP before running tests.

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government licence v3
