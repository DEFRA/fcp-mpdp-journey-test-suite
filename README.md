fcp-mpdp-journey-test-suite

The template to create a service that runs Playwright tests against an environment.

- [Local](#local)
  - [Requirements](#requirements)
    - [Node.js](#nodejs)
  - [Setup](#setup)
  - [Running local tests](#running-local-tests)
  - [Debugging local tests](#debugging-local-tests)
- [Production](#production)
  - [Debugging tests](#debugging-tests)
- [Licence](#licence)
  - [About the licence](#about-the-licence)

## Local Development

### Requirements

#### Node.js

Please install [Node.js](http://nodejs.org/) `>= v22` and [npm](https://nodejs.org/) `>= v10`. You will find it
easier to use the Node Version Manager [nvm](https://github.com/creationix/nvm)

To use the correct version of Node.js for this application, via nvm:

```bash
nvm use
```

### Setup

Install application dependencies:

```bash
npm install
```

### Running local tests

Start application you are testing on the url specified in `baseUrl` [playwright.local.config.js](playwright.local.config.js)

```bash
npm run test:local
```

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

### GOV.UK Browser Requirements Coverage

The table below shows which GOV.UK required browsers and devices (as of September 2024) are tested by our BrowserStack configuration:

| Platform | Browser | Version | Device | BrowserStack Test | Status | Notes |
|----------|---------|---------|---------|-------------------|--------|-------|
| **Windows** | Chrome | Latest | Desktop | ✅ `windows-chrome` | **Tested** | Full compatibility |
| **Windows** | Edge | Latest | Desktop | ✅ `windows-edge` | **Tested** | Full compatibility |
| **Windows** | Firefox | Latest | Desktop | ✅ `windows-firefox` | **Tested** | Full compatibility |
| **macOS** | Safari | 15.6+ | Desktop | ✅ `macos-safari` | **Tested** | Uses WebKit engine |
| **macOS** | Chrome | Latest | Desktop | ✅ `macos-chrome` | **Tested** | Full compatibility |
| **macOS** | Firefox | Latest | Desktop | ✅ `macos-firefox` | **Tested** | Full compatibility |
| **iOS** | Safari | 16+ | iPhone 14 | 🔄 `ios-safari` | **Ready** | Playwright 1.50.0 support added, awaiting BrowserStack connectivity fix |
| **iOS** | Chrome | Latest | iPhone 14 | 🔄 `ios-chrome` | **Ready** | Playwright 1.50.0 support added, awaiting BrowserStack connectivity fix |
| **Android** | Chrome | Latest | Galaxy S23 | ❌ | **Not Tested** | WebSocket endpoint format issues |
| **Android** | Samsung Internet | Latest | Galaxy S23 | ❌ | **Not Tested** | Browser name mapping conflicts |

#### Coverage Summary
- **✅ Tested Platforms**: 6/10 browser combinations (60%)
- **� Ready Platforms**: 2/10 browser combinations (iOS with Playwright 1.50.0)
- **�🖥️ Desktop Coverage**: 100% (6/6 desktop browsers)
- **📱 Mobile Coverage**: 0% active, 50% ready (2/4 mobile browsers ready when BrowserStack resolves connectivity)

#### Playwright 1.50.0 Upgrade
**✅ Completed**: Upgraded from Playwright 1.46.0 to 1.50.0
- **iOS Support**: Added `playwright-webkit` and `playwright-chromium` configurations for iOS
- **Configurations Available**: iOS browser configurations ready in commented code
- **Waiting On**: BrowserStack to fix network routing for iOS devices through Local tunnel

#### Testing Commands
```bash
# Test all working browsers against localhost
npm run test:local:browserstack

# Test all working browsers against production/staging
npm run test:browserstack
```

**Note**: Desktop browser testing provides comprehensive cross-browser coverage for most GOV.UK services. Mobile browsers are excluded due to BrowserStack Playwright compatibility limitations, but desktop testing covers the core browser engines (Chromium, WebKit, Gecko) used across all platforms.

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government licence v3
