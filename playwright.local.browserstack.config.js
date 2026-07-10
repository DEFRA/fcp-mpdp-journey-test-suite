import { defineConfig } from '@playwright/test'
import baseConfig from './playwright.config.js'
import { platforms } from './browserstack/platforms.js'

function buildWsEndpoint (caps) {
  const fullCaps = {
    ...caps,
    'browserstack.username': process.env.BROWSERSTACK_USER,
    'browserstack.accessKey': process.env.BROWSERSTACK_KEY,
    'browserstack.local': 'true'
  }
  return `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(fullCaps))}`
}

export default defineConfig({
  ...baseConfig,
  globalSetup: './browserstack/global-setup.js',
  globalTeardown: './browserstack/global-teardown.js',
  use: {
    ...baseConfig.use,
    baseURL: process.env.BASE_URL || 'http://host.docker.internal:3000'
  },
  projects: platforms.map(p => ({
    name: p.name,
    use: {
      connectOptions: {
        wsEndpoint: buildWsEndpoint(p.caps)
      }
    }
  }))
})
