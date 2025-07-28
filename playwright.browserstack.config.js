import { defineConfig } from '@playwright/test'
import { ProxyAgent, setGlobalDispatcher } from 'undici'
import { bootstrap } from 'global-agent'
import baseConfig from './playwright.config.js'
import { createBrowserStackProject } from './test/utils/browserstack-utils.js'

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

  projects: [
    createBrowserStackProject({ name: 'windows-chrome', browser: 'chrome', os: 'Windows', osVersion: '11', displayName: 'Windows Chrome' }),
    createBrowserStackProject({ name: 'windows-edge', browser: 'edge', os: 'Windows', osVersion: '11', displayName: 'Windows Edge' }),
    createBrowserStackProject({ name: 'windows-firefox', browser: 'playwright-firefox', os: 'Windows', osVersion: '11', displayName: 'Windows Firefox' }),
    createBrowserStackProject({ name: 'macos-safari', browser: 'playwright-webkit', os: 'OS X', osVersion: 'Monterey', displayName: 'macOS Safari' }),
    createBrowserStackProject({ name: 'macos-chrome', browser: 'chrome', os: 'OS X', osVersion: 'Monterey', displayName: 'macOS Chrome' }),
    createBrowserStackProject({ name: 'macos-firefox', browser: 'playwright-firefox', os: 'OS X', osVersion: 'Monterey', displayName: 'macOS Firefox' })
  ]
})
