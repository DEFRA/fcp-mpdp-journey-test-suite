import { defineConfig } from '@playwright/test'
import baseConfig from './playwright.config.js'

/**
 * GitHub Actions configuration for Playwright
 */
export default defineConfig({
  ...baseConfig,

  /* Use multiple workers in CI */
  workers: process.env.CI ? 2 : 1,

  /* Retry failed tests in CI */
  retries: 3,

  use: {
    ...baseConfig.use,
    /* Always run headless in CI */
    headless: true,
    /* Capture more debug info in CI */
    trace: 'retain-on-failure',
    video: 'retain-on-failure'
  }
})
