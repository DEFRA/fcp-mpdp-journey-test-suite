import { defineConfig } from '@playwright/test'
import { ProxyAgent, setGlobalDispatcher } from 'undici'
import { bootstrap } from 'global-agent'
import baseConfig from './playwright.config.js'

if (process.env.HTTP_PROXY) {
  const dispatcher = new ProxyAgent({
    uri: process.env.HTTP_PROXY
  })
  setGlobalDispatcher(dispatcher)
  bootstrap()
  global.GLOBAL_AGENT.HTTP_PROXY = process.env.HTTP_PROXY
}

/**
 * BrowserStack configuration for Playwright
 * Tests public URLs through proxy if configured
 */
export default defineConfig({
  ...baseConfig,

  /* Global test settings for BrowserStack */
  timeout: 120 * 1000, // 2 minutes for BrowserStack
  expect: { timeout: 30 * 1000 },

  /* Use BrowserStack for cross-browser testing */
  use: {
    ...baseConfig.use,
    headless: false,
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },

  projects: [
    {
      name: 'chrome-browserstack',
      use: {
        ...baseConfig.use,
        connectOptions: {
          wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify({
            browser: 'chrome',
            browser_version: 'latest',
            os: 'Windows',
            os_version: '11',
            'browserstack.username': process.env.BROWSERSTACK_USER,
            'browserstack.accessKey': process.env.BROWSERSTACK_KEY,
            build: process.env.BROWSERSTACK_BUILD_NAME || 'MPDP Journey Tests',
            name: 'Chrome Windows 11 Test',
            'browserstack.debug': true,
            'browserstack.local': false,
            'browserstack.networkLogs': true,
            'browserstack.console': 'verbose',
            'browserstack.idleTimeout': 300
          }))}`
        }
      }
    }
  ]
})
