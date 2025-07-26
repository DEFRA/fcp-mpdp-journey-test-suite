import { defineConfig } from '@playwright/test'
import cp from 'child_process'

const clientPlaywrightVersion = cp.execSync('npx playwright --version').toString().trim().split(' ')[1]

/**
 * BrowserStack Local configuration for Playwright
 * Tests localhost:3000 through BrowserStack Local tunnel
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
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    /* Global timeout for each action */
    actionTimeout: 15000,
    /* Global timeout for navigation */
    navigationTimeout: 45000
  },

  projects: [
    {
      name: 'chrome-browserstack-local',
      use: {
        // Override baseURL to use localhost
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
            name: 'MPDP Journey Local Tests - Chrome Windows 11',
            build: 'playwright-build-local',
            'client.playwrightVersion': clientPlaywrightVersion
          }))}`,
          timeout: 120000 // 2 minutes timeout for initial connection
        },
        // Additional timeouts for BrowserStack
        actionTimeout: 20000, // Increased from 15000
        navigationTimeout: 60000 // Increased from 45000
      }
    }
  ]
})
