import { defineConfig } from '@playwright/test'
import { ProxyAgent, setGlobalDispatcher } from 'undici'
import { bootstrap } from 'global-agent'
import baseConfig from './playwright.config.js'

const proxyUrl = process.env.HTTP_PROXY
if (proxyUrl) {
  setGlobalDispatcher(new ProxyAgent({ uri: proxyUrl }))
  bootstrap()
  globalThis.GLOBAL_AGENT.HTTP_PROXY = proxyUrl
}

export default defineConfig({
  ...baseConfig,
  use: {
    ...baseConfig.use,
    // required to test Android downloads routed through the CDP proxy above, which the real device browser (acceptSslCerts) doesn't cover
    ignoreHTTPSErrors: true
  },
  globalTimeout: 2_700_000
})
