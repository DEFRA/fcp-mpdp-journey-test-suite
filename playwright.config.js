import { defineConfig, devices } from '@playwright/test'

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './test/specs',
  /* Match test files */
  testMatch: '**/*.e2e.js',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    [
      'allure-playwright',
      {
        outputFolder: 'allure-results',
        resultsDir: 'allure-results'
      }
    ]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: `https://fcp-mpdp-frontend.${process.env.ENVIRONMENT}.cdp-int.defra.cloud`,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Take screenshot on failure */
    screenshot: 'only-on-failure',

    /* Record video on failure */
    video: 'retain-on-failure',

    /* Global timeout for each action */
    actionTimeout: 10000,

    /* Global timeout for navigation */
    navigationTimeout: 30000
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Chrome-specific options equivalent to WebDriverIO setup
        launchOptions: {
          args: [
            '--no-sandbox',
            '--disable-infobars',
            '--headless',
            '--disable-gpu',
            '--window-size=1920,1080',
            '--enable-features=NetworkService,NetworkServiceInProcess',
            '--password-store=basic',
            '--use-mock-keychain',
            '--dns-prefetch-disable',
            '--disable-background-networking',
            '--disable-remote-fonts',
            '--ignore-certificate-errors',
            '--disable-dev-shm-usage'
          ]
        }
      }
    }
  ],

  /* Global setup and teardown */
  globalSetup: undefined,
  globalTeardown: undefined,

  /* Timeout for each test */
  timeout: 60000,

  /* Expect timeout */
  expect: {
    timeout: 5000
  }
})
