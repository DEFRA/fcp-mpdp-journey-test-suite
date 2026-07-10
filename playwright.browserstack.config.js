import { defineConfig } from '@playwright/test'
import baseConfig from './playwright.config.js'
import { platforms } from './browserstack/platforms.js'

if (process.env.CDP_HTTP_PROXY) {
  const { ProxyAgent, setGlobalDispatcher } = await import('undici')
  const { bootstrap } = await import('global-agent')
  setGlobalDispatcher(new ProxyAgent({ uri: process.env.CDP_HTTP_PROXY }))
  bootstrap()
  globalThis.GLOBAL_AGENT.HTTP_PROXY = process.env.CDP_HTTP_PROXY
}

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
  projects: platforms.map(p => ({
    name: p.name,
    use: {
      connectOptions: {
        wsEndpoint: buildWsEndpoint(p.caps)
      }
    }
  }))
})
