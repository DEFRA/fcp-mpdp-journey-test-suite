import { defineConfig } from '@playwright/test'
import baseConfig from './playwright.config.js'

export default defineConfig({
  ...baseConfig,
  workers: 1,
  retries: 0,

  use: {
    ...baseConfig.use,
    baseURL: process.env.BASE_URL || 'http://host.docker.internal:3000',
    headless: true,
    trace: 'on',
    video: 'on'
  }
})
