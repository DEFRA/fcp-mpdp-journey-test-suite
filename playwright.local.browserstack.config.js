import { defineConfig } from '@playwright/test'
import cp from 'child_process'

const clientPlaywrightVersion = cp.execSync('npx playwright --version').toString().trim().split(' ')[1]

/**
 * BrowserStack Local configuration for Playwright
 * Tests localhost:3000 through BrowserStack Local tunnel
 * Covers all GOV.UK required browsers and devices (September 2024)
 * Automatically starts and stops BrowserStack Local
 */
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
    trace: 'off', // Disable tracing for mobile compatibility
    video: 'off', // Disable video for mobile compatibility
    screenshot: 'only-on-failure',
    /* Global timeout for each action */
    actionTimeout: 15000,
    /* Global timeout for navigation */
    navigationTimeout: 45000
  },

  projects: [
    // Windows Browsers (GOV.UK Required)
    {
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
            build: 'govuk-local-browser-tests',
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
            build: 'govuk-local-browser-tests',
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
            build: 'govuk-local-browser-tests',
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
    // macOS Browsers (GOV.UK Required)
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
            build: 'govuk-local-browser-tests',
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
            build: 'govuk-local-browser-tests',
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
            build: 'govuk-local-browser-tests',
            'client.playwrightVersion': clientPlaywrightVersion
          }))}`,
          timeout: 120000
        },
        actionTimeout: 20000,
        navigationTimeout: 60000,
        trace: 'off',
        video: 'off'
      }
    }
    // Note: iOS browsers temporarily disabled due to BrowserStack Local connectivity issues
    // Playwright 1.50.0 adds iOS support, but BrowserStack Local tunnel has network routing problems
    // iOS configurations available but commented out until BrowserStack resolves connectivity
    // Desktop browsers provide comprehensive cross-browser coverage for GOV.UK testing

    /* iOS Browsers - Ready for Playwright 1.50.0 when BrowserStack fixes connectivity
    {
      name: 'ios-safari',
      use: {
        baseURL: 'http://localhost:3000',
        connectOptions: {
          wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify({
            browser: 'playwright-webkit',
            device: 'iPhone 14',
            os_version: '16',
            'browserstack.username': process.env.BROWSERSTACK_USER || process.env.BROWSERSTACK_USERNAME,
            'browserstack.accessKey': process.env.BROWSERSTACK_KEY || process.env.BROWSERSTACK_ACCESS_KEY,
            'browserstack.localIdentifier': 'playwright-local-test',
            'browserstack.local': 'true',
            name: 'GOV.UK Local - iOS Safari 16',
            build: 'govuk-local-browser-tests',
            'client.playwrightVersion': clientPlaywrightVersion
          }))}`,
          timeout: 120000
        },
        actionTimeout: 30000,
        navigationTimeout: 90000,
        trace: 'off',
        video: 'off',
        screenshot: 'only-on-failure'
      }
    },
    {
      name: 'ios-chrome',
      use: {
        baseURL: 'http://localhost:3000',
        connectOptions: {
          wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify({
            browser: 'playwright-chromium',
            device: 'iPhone 14',
            os_version: '16',
            'browserstack.username': process.env.BROWSERSTACK_USER || process.env.BROWSERSTACK_USERNAME,
            'browserstack.accessKey': process.env.BROWSERSTACK_KEY || process.env.BROWSERSTACK_ACCESS_KEY,
            'browserstack.localIdentifier': 'playwright-local-test',
            'browserstack.local': 'true',
            name: 'GOV.UK Local - iOS Chrome',
            build: 'govuk-local-browser-tests',
            'client.playwrightVersion': clientPlaywrightVersion
          }))}`,
          timeout: 120000
        },
        actionTimeout: 30000,
        navigationTimeout: 90000,
        trace: 'off',
        video: 'off',
        screenshot: 'only-on-failure'
      }
    }
    */
  ]
})
