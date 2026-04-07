---
description: "Use when writing, running, or debugging journey tests (Playwright, BrowserStack, E2E) for fcp-mpdp-journey-test-suite. Covers running tests locally and in CDP, test structure, Allure reporting, and known patterns."
---

# FCP MPDP Journey Test Suite

Playwright-based end-to-end test suite for the MPDP public frontend. Tests run against configured `BASE_URL` across local, Docker, BrowserStack, and CDP environments.

## Running Tests Locally

### Using fcp-mpdp-core (recommended — full system)
```bash
cd ../fcp-mpdp-core
./start -jt           # Start all services + run journey tests
./start -s -jt        # Start, seed database, then run journey tests
```

### Using Docker Compose (standalone)
Requires the frontend running at `http://host.docker.internal:3000`:
```bash
npm run docker:test:local                  # Playwright, headless
npm run docker:test:local:browserstack     # BrowserStack (requires .env)
```

### Without Docker
```bash
npm run test:local                         # Against http://host.docker.internal:3000
npm run test:local:debug                   # Interactive debug mode
BASE_URL=http://localhost:3000 npm run test:local   # Custom URL
```

### BrowserStack credentials (`.env` file)
Create `.env` in the repo root before running BrowserStack tests locally:
```bash
BROWSERSTACK_USER=your_username
BROWSERSTACK_KEY=your_api_key
```
Local BrowserStack uses `browserstack.local.yml` with `buildName: FCP MPDP Local` and `acceptInsecureCerts: true`.

## Running Tests in CDP

### Via CDP Portal
Tests are triggered from the **Test Suites** section of the CDP Portal. Results are published to S3 as Allure reports and are available 1–2 minutes after a main branch build.

### Via GitHub Actions
- `journey-tests.yml` — triggered manually or called by other workflows; delegates to the shared DEFRA CDP template
- `publish.yml` — builds the Docker image on push to `main`

### CDP Environment URLs
The `BASE_URL` is automatically set in CDP:
```
https://fcp-mpdp-frontend.${ENVIRONMENT}.cdp-int.defra.cloud
```
Valid `ENVIRONMENT` values: `infra-dev`, `dev`, `test`, `perf-test`, `ext-test`, `prod`.

### Entrypoint sequence (Docker)
When the container starts, `entrypoint.sh`:
1. Waits for the ZAP security proxy to be ready (30 attempts, 5s intervals)
2. Runs `npm run test:$TEST_SCRIPT`
3. Generates the Allure report (`npm run report:publish`)
4. Publishes results to `RESULTS_OUTPUT_S3_PATH`
5. Exits `0` (pass) or `1+` (fail)

## Playwright Config Files

| File | Used for | Base URL |
|---|---|---|
| `playwright.config.js` | CDP default | `https://fcp-mpdp-frontend.${ENVIRONMENT}.cdp-int.defra.cloud` |
| `playwright.local.config.js` | Local Playwright | `http://host.docker.internal:3000` |
| `playwright.browserstack.config.js` | CDP BrowserStack (with proxy) | CDP URL via local proxy |
| `playwright.local.browserstack.config.js` | Local BrowserStack | `http://host.docker.internal:3000` |

## Project Structure

```
test/
  specs/              # One file per page/feature (e.g. search.test.js)
  expect/             # Reusable assertion helpers
    common/           # Header, footer, phase-banner, etc.
utils/
  test-payment.js     # Known payment record — sync with fcp-mpdp-core/data/test-data.js
  devices.js          # Device detection (Android BrowserStack workarounds)
zap/
  scan.js             # OWASP ZAP security scanning
  zap.conf            # Alert exclusions
bin/
  publish-tests.sh    # S3 results publishing
```

## Writing Tests

### Test file structure
```javascript
import { test, expect } from '@playwright/test'
import { accessibilityTest } from '../accessibility.test.js'
import { securityTest } from '../security.test.js'

test.describe('Page Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/route')
  })

  test('Should display the correct content', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Expected Heading')
  })

  test('Should meet WCAG 2.2 AA', async ({ page }) => {
    await accessibilityTest(page)
  })

  test('Should meet security standards', async ({ page }) => {
    await securityTest(page.url())
  })
})
```

### URL verification after navigation
```javascript
await page.waitForURL(url => {
  const u = new URL(url.toString())
  return u.pathname === '/results' && u.searchParams.get('searchString') === 'Smith'
})
const currentUrl = new URL(page.url())
expect(currentUrl.pathname).toBe('/results')
```

### File download verification
```javascript
const downloadPromise = page.waitForEvent('download')
await link.click()
const download = await downloadPromise
expect(download.suggestedFilename()).toBe('ffc-payment-data.csv')
```

### Using known test data
`utils/test-payment.js` contains a specific payment record that is seeded by `fcp-mpdp-core`. Always import from here rather than hard-coding values.
```javascript
import { testPayment } from '../../utils/test-payment.js'

expect(totalAmount).toBe(`£${testPayment.readableTotal}`)
```

**Keep in sync:** if `utils/test-payment.js` changes, update `fcp-mpdp-core/data/test-data.js` (and vice versa) and re-seed the database.

### Android BrowserStack workarounds
Some `expect` assertions are flaky on Android devices in BrowserStack. Skip them with the `isAndroid` guard:
```javascript
import { isAndroid } from '../../utils/devices.js'

if (!isAndroid(testInfo)) {
  await expect(element).toHaveAttribute('href', '/path')
}
```

### Sorted results verification
```javascript
const payeeNames = await page.locator('h3 a').allTextContents()
const sortedNames = [...payeeNames].sort((a, b) => a.localeCompare(b))
expect(payeeNames).toEqual(sortedNames)
```

## Key Config Defaults

| Setting | Value |
|---|---|
| `testDir` | `./test/specs` |
| `testMatch` | `**/*.test.js` |
| `fullyParallel` | `false` |
| `workers` | `1` |
| `retries` | `2` (CDP), `0` (local) |
| `timeout` | `600000ms` |
| `expect.timeout` | `30000ms` |
| Reporter | `allure-playwright` → `allure-results/` |

## Linting
```bash
npm run lint        # Check
npm run lint:fix    # Auto-fix
```
Follows neostandard: single quotes, no semicolons, 2-space indent, trailing commas.
