import { defineConfig } from '@playwright/test'
import baseConfig from './playwright.browserstack.config.js'

export default defineConfig({
  ...baseConfig,
  retries: 2,

  use: {
    ...baseConfig.use,
    baseURL: 'http://localhost:3000'
  }
})
