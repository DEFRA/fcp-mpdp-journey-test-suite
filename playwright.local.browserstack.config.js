import { defineConfig } from '@playwright/test'
import baseConfig from './playwright.browserstack.config.js'
import { createBrowserStackProject } from './test/utils/browserstack-utils.js'

const isLocal = true
const buildName = 'FCP MPDP Local'

export default defineConfig({
  ...baseConfig,
  retries: 0,

  /* Global setup and teardown files */
  globalSetup: './test/utils/global-setup.js',
  globalTeardown: './test/utils/global-teardown.js',

  use: {
    baseURL: 'http://localhost:3000',
    headless: false
  },

  projects: [
    createBrowserStackProject({
      name: 'windows-chrome',
      browser: 'chrome',
      os: 'Windows',
      osVersion: '11',
      displayName: 'Windows Chrome',
      isLocal,
      buildName
    }),
    createBrowserStackProject({
      name: 'windows-edge',
      browser: 'edge',
      os: 'Windows',
      osVersion: '11',
      displayName: 'Windows Edge',
      isLocal,
      buildName
    }),
    createBrowserStackProject({
      name: 'windows-firefox',
      browser: 'playwright-firefox',
      os: 'Windows',
      osVersion: '11',
      displayName: 'Windows Firefox',
      isLocal,
      buildName
    }),
    createBrowserStackProject({
      name: 'macos-safari',
      browser: 'playwright-webkit',
      os: 'OS X',
      osVersion: 'Monterey',
      displayName: 'macOS Safari',
      isLocal,
      buildName
    }),
    createBrowserStackProject({
      name: 'macos-chrome',
      browser: 'chrome',
      os: 'OS X',
      osVersion: 'Monterey',
      displayName: 'macOS Chrome',
      isLocal,
      buildName
    }),
    createBrowserStackProject({
      name: 'macos-firefox',
      browser: 'playwright-firefox',
      os: 'OS X',
      osVersion: 'Monterey',
      displayName: 'macOS Firefox',
      isLocal,
      buildName
    })
  ]
})
