import BrowserStackLocal from 'browserstack-local'

// Global variable to store the BrowserStack Local instance
global.bsLocal = null

async function globalSetup () {
  const localIdentifier = 'playwright-local-test'
  const accessKey = process.env.BROWSERSTACK_KEY

  if (!accessKey) {
    throw new Error('BROWSERSTACK_KEY environment variable is required')
  }

  console.log('Starting BrowserStack Local...')
  console.log(`Using local identifier: ${localIdentifier}`)

  global.bsLocal = new BrowserStackLocal.Local()
  global.localIdentifier = localIdentifier

  return new Promise((resolve, reject) => {
    global.bsLocal.start({
      key: accessKey,
      localIdentifier,
      forceLocal: true,
      verbose: true
    }, (error) => {
      if (error) {
        console.error('ERROR starting BrowserStack Local:', error)
        reject(error)
      } else {
        console.log('BrowserStack Local started successfully!')
        // Set environment variable for tests
        process.env.BROWSERSTACK_LOCAL_IDENTIFIER = localIdentifier
        // Wait a bit more to ensure tunnel is fully established
        console.log('Waiting for tunnel to be fully ready...')
        setTimeout(() => {
          console.log('Tunnel should be ready now')
          resolve()
        }, 10000) // Wait 10 seconds
      }
    })
  })
}

export default globalSetup
