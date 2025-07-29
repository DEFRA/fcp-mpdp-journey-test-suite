import { defineConfig } from '@playwright/test'
import { ProxyAgent, setGlobalDispatcher } from 'undici'
import { bootstrap } from 'global-agent'
import baseConfig from './playwright.config.js'

if (process.env.HTTP_PROXY) {
  const dispatcher = new ProxyAgent({
    uri: 'http://localhost:3128'
  })
  setGlobalDispatcher(dispatcher)
  bootstrap()
  global.GLOBAL_AGENT.HTTP_PROXY = 'http://localhost:3128'
}

// BrowserStack SDK will use browserstack.yml for configuration
export default defineConfig({
  ...baseConfig,
  use: {
    ...baseConfig.use,
    proxy: {
      server: 'localhost:3128'
    }
  }
})
