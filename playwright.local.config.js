import { defineConfig } from '@playwright/test'
import baseConfig from './playwright.config.js'

/**
 * Local configuration for Playwright
 * This configuration is used for local development and testing
 */
export default defineConfig({
  ...baseConfig,

  /* Use headed mode for local testing */
  use: {
    ...baseConfig.use,
    /* Override baseURL for local development */
    baseURL: 'http://localhost:3000',
    headless: false,
    /* Slow down operations for debugging */
    slowMo: 100
  },

  /* Enable debug mode if DEBUG env var is set */
  ...(process.env.DEBUG && {
    workers: 1,
    use: {
      ...baseConfig.use,
      headless: false,
      slowMo: 500,
      /* Keep browser open on test failure */
      trace: 'on',
      video: 'on'
    }
  }),

  projects: [
    {
      name: 'chromium',
      use: {
        ...baseConfig.projects[0].use,
        launchOptions: {
          args: [
            '--no-sandbox',
            '--disable-infobars',
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
  ]
})
