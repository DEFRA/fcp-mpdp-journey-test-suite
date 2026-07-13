import { defineConfig } from '@playwright/test'
import { ProxyAgent, setGlobalDispatcher } from 'undici'
import { bootstrap } from 'global-agent'
import baseConfig from './playwright.config.js'

if (process.env.CDP_HTTP_PROXY) {
  const proxyUrl = process.env.CDP_HTTP_PROXY
  setGlobalDispatcher(new ProxyAgent({ uri: proxyUrl }))
  bootstrap()
  globalThis.GLOBAL_AGENT.HTTP_PROXY = proxyUrl
}

export default defineConfig({
  ...baseConfig
})
