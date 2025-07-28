import { defineConfig } from '@playwright/test'
import baseConfig from './playwright.browserstack.config.js'

// Local testing with BrowserStack SDK will use browserstack.yml configuration
// and enable local tunnel automatically
export default defineConfig({
  ...baseConfig,
  retries: 0,

  use: {
    ...baseConfig.use,
    // Override baseURL for local testing
    baseURL: 'http://localhost:3000'
  }
})
