import { defineConfig } from '@playwright/test'
import { ProxyAgent, setGlobalDispatcher } from 'undici'
import { bootstrap } from 'global-agent'
import baseConfig from './playwright.config.js'
import cp from 'child_process'

const clientPlaywrightVersion = cp.execSync('npx playwright --version').toString().trim().split(' ')[1]

if (process.env.HTTP_PROXY) {
  const dispatcher = new ProxyAgent({
    uri: process.env.HTTP_PROXY
  })
  setGlobalDispatcher(dispatcher)
  bootstrap()
  global.GLOBAL_AGENT.HTTP_PROXY = process.env.HTTP_PROXY
}

export default defineConfig({
  ...baseConfig,

  /* Global test settings for BrowserStack */
  timeout: 120 * 1000, // 2 minutes for BrowserStack
  expect: { timeout: 30 * 1000 },
  workers: 1, // Reduce workers for BrowserStack stability

  /* Use baseURL from environment or default */
  use: {
    headless: false,
    screenshot: 'only-on-failure',
    /* Global timeout for each action */
    actionTimeout: 15000,
    /* Global timeout for navigation */
    navigationTimeout: 45000
  },

  projects: [
    {
      name: 'windows-chrome',
      use: {
        ...baseConfig.use,
        connectOptions: {
          wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify({
            browser: 'chrome',
            browser_version: 'latest',
            os: 'Windows',
            os_version: '11',
            'browserstack.username': process.env.BROWSERSTACK_USER || process.env.BROWSERSTACK_USERNAME,
            'browserstack.accessKey': process.env.BROWSERSTACK_KEY || process.env.BROWSERSTACK_ACCESS_KEY,
            'browserstack.local': 'false',
            name: 'GOV.UK - Windows Chrome',
            build: process.env.BROWSERSTACK_BUILD_NAME || 'govuk-browser-tests',
            'client.playwrightVersion': clientPlaywrightVersion
          }))}`,
          timeout: 120000
        }
      }
    },
    {
      name: 'windows-edge',
      use: {
        ...baseConfig.use,
        connectOptions: {
          wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify({
            browser: 'edge',
            browser_version: 'latest',
            os: 'Windows',
            os_version: '11',
            'browserstack.username': process.env.BROWSERSTACK_USER || process.env.BROWSERSTACK_USERNAME,
            'browserstack.accessKey': process.env.BROWSERSTACK_KEY || process.env.BROWSERSTACK_ACCESS_KEY,
            'browserstack.local': 'false',
            name: 'GOV.UK - Windows Edge',
            build: process.env.BROWSERSTACK_BUILD_NAME || 'govuk-browser-tests',
            'client.playwrightVersion': clientPlaywrightVersion
          }))}`,
          timeout: 120000
        }
      }
    },
    {
      name: 'windows-firefox',
      use: {
        ...baseConfig.use,
        connectOptions: {
          wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify({
            browser: 'playwright-firefox',
            browser_version: 'latest',
            os: 'Windows',
            os_version: '11',
            'browserstack.username': process.env.BROWSERSTACK_USER || process.env.BROWSERSTACK_USERNAME,
            'browserstack.accessKey': process.env.BROWSERSTACK_KEY || process.env.BROWSERSTACK_ACCESS_KEY,
            'browserstack.local': 'false',
            name: 'GOV.UK - Windows Firefox',
            build: process.env.BROWSERSTACK_BUILD_NAME || 'govuk-browser-tests',
            'client.playwrightVersion': clientPlaywrightVersion
          }))}`,
          timeout: 120000
        },
        trace: 'off',
        video: 'off'
      }
    },
    {
      name: 'macos-safari',
      use: {
        ...baseConfig.use,
        connectOptions: {
          wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify({
            browser: 'playwright-webkit',
            browser_version: 'latest',
            os: 'OS X',
            os_version: 'Monterey',
            'browserstack.username': process.env.BROWSERSTACK_USER || process.env.BROWSERSTACK_USERNAME,
            'browserstack.accessKey': process.env.BROWSERSTACK_KEY || process.env.BROWSERSTACK_ACCESS_KEY,
            'browserstack.local': 'false',
            name: 'GOV.UK - macOS Safari 15.6',
            build: process.env.BROWSERSTACK_BUILD_NAME || 'govuk-browser-tests',
            'client.playwrightVersion': clientPlaywrightVersion
          }))}`,
          timeout: 120000
        },
        trace: 'off',
        video: 'off'
      }
    },
    {
      name: 'macos-chrome',
      use: {
        ...baseConfig.use,
        connectOptions: {
          wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify({
            browser: 'chrome',
            browser_version: 'latest',
            os: 'OS X',
            os_version: 'Monterey',
            'browserstack.username': process.env.BROWSERSTACK_USER || process.env.BROWSERSTACK_USERNAME,
            'browserstack.accessKey': process.env.BROWSERSTACK_KEY || process.env.BROWSERSTACK_ACCESS_KEY,
            'browserstack.local': 'false',
            name: 'GOV.UK - macOS Chrome',
            build: process.env.BROWSERSTACK_BUILD_NAME || 'govuk-browser-tests',
            'client.playwrightVersion': clientPlaywrightVersion
          }))}`,
          timeout: 120000
        }
      }
    },
    {
      name: 'macos-firefox',
      use: {
        ...baseConfig.use,
        connectOptions: {
          wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify({
            browser: 'playwright-firefox',
            browser_version: 'latest',
            os: 'OS X',
            os_version: 'Monterey',
            'browserstack.username': process.env.BROWSERSTACK_USER || process.env.BROWSERSTACK_USERNAME,
            'browserstack.accessKey': process.env.BROWSERSTACK_KEY || process.env.BROWSERSTACK_ACCESS_KEY,
            'browserstack.local': 'false',
            name: 'GOV.UK - macOS Firefox',
            build: process.env.BROWSERSTACK_BUILD_NAME || 'govuk-browser-tests',
            'client.playwrightVersion': clientPlaywrightVersion
          }))}`,
          timeout: 120000
        },
        trace: 'off',
        video: 'off'
      }
    }]
})
