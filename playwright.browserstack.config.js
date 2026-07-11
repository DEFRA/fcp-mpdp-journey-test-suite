import { defineConfig } from '@playwright/test'
import baseConfig from './playwright.config.js'

if (process.env.BROWSERSTACK_PROXY_HOST) {
  const proxyUrl = `http://${process.env.BROWSERSTACK_PROXY_HOST}:${process.env.BROWSERSTACK_PROXY_PORT}`
  const { ProxyAgent, setGlobalDispatcher } = await import('undici')
  const { bootstrap } = await import('global-agent')
  setGlobalDispatcher(new ProxyAgent({ uri: proxyUrl }))
  bootstrap()
  globalThis.GLOBAL_AGENT.HTTP_PROXY = proxyUrl
}

export default defineConfig({
  ...baseConfig
})
