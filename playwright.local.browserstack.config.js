import { defineConfig } from '@playwright/test'
import baseConfig from './playwright.config.js'
import cp from 'child_process'

const clientPlaywrightVersion = cp.execSync('npx playwright --version').toString().trim().split(' ')[1]

/**
 * BrowserStack Local configuration for Playwright
 * Tests localhost:3000 through BrowserStack Local tunnel
 * Automatically starts and stops BrowserStack Local
 */
export default defineConfig({
  ...baseConfig,

  /* Global setup and teardown files */
  globalSetup: './global-setup.js',
  globalTeardown: './global-teardown.js',

  /* Use localhost for local testing */
  use: {
    baseURL: 'http://localhost:3000',
    headless: false,
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },

  projects: [
    {
      name: 'chrome-browserstack-local',
      use: {
        ...baseConfig.use,
        connectOptions: {
          wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify({
            browser: 'chrome',
            os: 'Windows',
            os_version: '11',
            'browserstack.username': process.env.BROWSERSTACK_USER,
            'browserstack.accessKey': process.env.BROWSERSTACK_KEY,
            'browserstack.localIdentifier': 'playwright-local-test',
            build: 'MPDP Journey Local Tests',
            name: 'Chrome Windows 11 Local Test',
            'browserstack.local': true,
            'client.playwrightVersion': clientPlaywrightVersion
          }))}`
        }
      }
    }
  ]
})
