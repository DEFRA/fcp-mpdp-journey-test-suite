import { defineConfig } from '@playwright/test'
import cp from 'child_process'

const clientPlaywrightVersion = cp.execSync('npx playwright --version').toString().trim().split(' ')[1]

export default defineConfig({
  testDir: './test/specs',
  /* Match test files */
  testMatch: '**/*.e2e.js',
  /* Reduce workers for BrowserStack to avoid connection issues */
  workers: 1,
  timeout: 120000, // Increased timeout for BrowserStack
  /* Retry failed tests */
  retries: 2,

  /* Reporter configuration */
  reporter: [
    [
      'allure-playwright',
      {
        outputFolder: 'allure-results',
        resultsDir: 'allure-results'
      }
    ]
  ],

  /* Global setup and teardown files */
  globalSetup: './global-setup.js',
  globalTeardown: './global-teardown.js',

  /* Expect timeout */
  expect: {
    timeout: 10000
  },

  /* Use localhost for local testing */
  use: {
    baseURL: 'http://localhost:3000',
    headless: false,
    screenshot: 'only-on-failure',
    /* Global timeout for each action */
    actionTimeout: 15000,
    /* Global timeout for navigation */
    navigationTimeout: 45000
  },

  projects: [{
    name: 'windows-chrome',
    use: {
      baseURL: 'http://localhost:3000',
      connectOptions: {
        wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify({
            browser: 'chrome',
            browser_version: 'latest',
            os: 'Windows',
            os_version: '11',
            'browserstack.username': process.env.BROWSERSTACK_USER || process.env.BROWSERSTACK_USERNAME,
            'browserstack.accessKey': process.env.BROWSERSTACK_KEY || process.env.BROWSERSTACK_ACCESS_KEY,
            'browserstack.localIdentifier': 'playwright-local-test',
            'browserstack.local': 'true',
            name: 'GOV.UK Local - Windows Chrome',
            build: 'FCP MPDP Local',
            'client.playwrightVersion': clientPlaywrightVersion
          }))}`,
        timeout: 120000
      },
      actionTimeout: 20000,
      navigationTimeout: 60000
    }
  },
  {
    name: 'windows-edge',
    use: {
      baseURL: 'http://localhost:3000',
      connectOptions: {
        wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify({
            browser: 'edge',
            browser_version: 'latest',
            os: 'Windows',
            os_version: '11',
            'browserstack.username': process.env.BROWSERSTACK_USER || process.env.BROWSERSTACK_USERNAME,
            'browserstack.accessKey': process.env.BROWSERSTACK_KEY || process.env.BROWSERSTACK_ACCESS_KEY,
            'browserstack.localIdentifier': 'playwright-local-test',
            'browserstack.local': 'true',
            name: 'GOV.UK Local - Windows Edge',
            build: 'FCP MPDP Local',
            'client.playwrightVersion': clientPlaywrightVersion
          }))}`,
        timeout: 120000
      },
      actionTimeout: 20000,
      navigationTimeout: 60000
    }
  },
  {
    name: 'windows-firefox',
    use: {
      baseURL: 'http://localhost:3000',
      connectOptions: {
        wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify({
            browser: 'playwright-firefox',
            browser_version: 'latest',
            os: 'Windows',
            os_version: '11',
            'browserstack.username': process.env.BROWSERSTACK_USER || process.env.BROWSERSTACK_USERNAME,
            'browserstack.accessKey': process.env.BROWSERSTACK_KEY || process.env.BROWSERSTACK_ACCESS_KEY,
            'browserstack.localIdentifier': 'playwright-local-test',
            'browserstack.local': 'true',
            name: 'GOV.UK Local - Windows Firefox',
            build: 'FCP MPDP Local',
            'client.playwrightVersion': clientPlaywrightVersion
          }))}`,
        timeout: 120000
      },
      actionTimeout: 20000,
      navigationTimeout: 60000,
      trace: 'off',
      video: 'off'
    }
  },
  {
    name: 'macos-safari',
    use: {
      baseURL: 'http://localhost:3000',
      connectOptions: {
        wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify({
            browser: 'playwright-webkit',
            browser_version: 'latest',
            os: 'OS X',
            os_version: 'Monterey',
            'browserstack.username': process.env.BROWSERSTACK_USER || process.env.BROWSERSTACK_USERNAME,
            'browserstack.accessKey': process.env.BROWSERSTACK_KEY || process.env.BROWSERSTACK_ACCESS_KEY,
            'browserstack.localIdentifier': 'playwright-local-test',
            'browserstack.local': 'true',
            name: 'GOV.UK Local - macOS Safari 15.6',
            build: 'FCP MPDP Local',
            'client.playwrightVersion': clientPlaywrightVersion
          }))}`,
        timeout: 120000
      },
      actionTimeout: 20000,
      navigationTimeout: 60000,
      trace: 'off',
      video: 'off'
    }
  },
  {
    name: 'macos-chrome',
    use: {
      baseURL: 'http://localhost:3000',
      connectOptions: {
        wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify({
            browser: 'chrome',
            browser_version: 'latest',
            os: 'OS X',
            os_version: 'Monterey',
            'browserstack.username': process.env.BROWSERSTACK_USER || process.env.BROWSERSTACK_USERNAME,
            'browserstack.accessKey': process.env.BROWSERSTACK_KEY || process.env.BROWSERSTACK_ACCESS_KEY,
            'browserstack.localIdentifier': 'playwright-local-test',
            'browserstack.local': 'true',
            name: 'GOV.UK Local - macOS Chrome',
            build: 'FCP MPDP Local',
            'client.playwrightVersion': clientPlaywrightVersion
          }))}`,
        timeout: 120000
      },
      actionTimeout: 20000,
      navigationTimeout: 60000
    }
  },
  {
    name: 'macos-firefox',
    use: {
      baseURL: 'http://localhost:3000',
      connectOptions: {
        wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify({
            browser: 'playwright-firefox',
            browser_version: 'latest',
            os: 'OS X',
            os_version: 'Monterey',
            'browserstack.username': process.env.BROWSERSTACK_USER || process.env.BROWSERSTACK_USERNAME,
            'browserstack.accessKey': process.env.BROWSERSTACK_KEY || process.env.BROWSERSTACK_ACCESS_KEY,
            'browserstack.localIdentifier': 'playwright-local-test',
            'browserstack.local': 'true',
            name: 'GOV.UK Local - macOS Firefox',
            build: 'FCP MPDP Local',
            'client.playwrightVersion': clientPlaywrightVersion
          }))}`,
        timeout: 120000
      },
      actionTimeout: 20000,
      navigationTimeout: 60000,
      trace: 'off',
      video: 'off'
    }
  }]
})
