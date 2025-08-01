import { defineConfig } from '@playwright/test'
import baseConfig from './playwright.config.js'

export default defineConfig({
  ...baseConfig,
  use: {
    ...baseConfig.use,
    baseURL: 'http://localhost:3000',
    headless: false
  },

  ...(process.env.DEBUG && {
    workers: 1,
    use: {
      ...baseConfig.use,
      headless: false,
      trace: 'on',
      video: 'on'
    }
  })
})
