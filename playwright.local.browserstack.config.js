import { defineConfig } from '@playwright/test'
import baseConfig from './playwright.config.js'

export default defineConfig({
  ...baseConfig,
  retries: 1,
  use: {
    ...baseConfig.use,
    baseURL: 'http://localhost:3000'
  }
})
