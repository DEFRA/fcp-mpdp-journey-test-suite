import BrowserStackLocal from 'browserstack-local'

export default async function globalSetup () {
  const local = new BrowserStackLocal.Local()

  const options = {
    key: process.env.BROWSERSTACK_KEY,
    forceLocal: false,
    onlyAutomate: true,
    binarypath: '/root/.browserstack/BrowserStackLocal'
  }

  if (process.env.CDP_HTTP_PROXY) {
    const proxyUrl = new URL(process.env.CDP_HTTP_PROXY)
    options.proxyHost = proxyUrl.hostname
    options.proxyPort = proxyUrl.port
  }

  await new Promise((resolve, reject) => {
    local.start(options, (err) => {
      if (err) return reject(new Error(`BrowserStackLocal failed to start: ${err.message}`))
      resolve()
    })
  })

  if (!local.isRunning()) {
    throw new Error('BrowserStackLocal started but is not running')
  }

  console.log('BrowserStackLocal tunnel established')
  globalThis.__bsLocal = local
}
