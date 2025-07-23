import { defineConfig } from '@playwright/test'
import baseConfig from './playwright.github.config.js'

/**
 * GitHub Actions + BrowserStack configuration for Playwright
 */
export default defineConfig({
  ...baseConfig,

  /* BrowserStack configuration for CI */
  use: {
    ...baseConfig.use,
    /* Always headless for CI */
    headless: true
  }
})
