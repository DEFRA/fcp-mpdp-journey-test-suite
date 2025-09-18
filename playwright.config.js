import { defineConfig, devices } from '@playwright/test'

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './test/specs',
  testMatch: '**/accessibility.test.js',

  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 2,
  workers: 1,

  reporter: [
    [
      'allure-playwright',
      {
        resultsDir: 'allure-results'
      }
    ]
  ],
  use: {
    baseURL: `https://fcp-mpdp-frontend.${process.env.ENVIRONMENT}.cdp-int.defra.cloud`,
    trace: 'on-first-retry'
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      }
    }
  ],

  timeout: 600000,
  expect: {
    timeout: 30000
  }
})
