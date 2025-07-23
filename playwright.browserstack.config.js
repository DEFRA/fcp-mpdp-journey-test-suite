import { defineConfig } from '@playwright/test'
import baseConfig from './playwright.config.js'

/**
 * BrowserStack configuration for Playwright
 * Note: BrowserStack support for Playwright requires additional setup
 * See: https://www.browserstack.com/docs/automate/playwright
 */
export default defineConfig({
  ...baseConfig,

  /* Use BrowserStack for cross-browser testing */
  use: {
    ...baseConfig.use,
    /* BrowserStack requires these settings */
    headless: true,
    trace: 'retain-on-failure',
    video: 'retain-on-failure'
  },

  projects: [
    {
      name: 'chrome-browserstack',
      use: {
        browserName: 'chromium'
        /* BrowserStack specific configuration would go here */
        /* You'll need to configure BrowserStack credentials and capabilities */
      }
    }
  ]
})
