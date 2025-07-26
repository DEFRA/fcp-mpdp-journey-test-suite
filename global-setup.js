import BrowserStackLocal from 'browserstack-local'

// Global variable to store the BrowserStack Local instance
global.bsLocal = null

async function globalSetup () {
  const localIdentifier = 'playwright-local-test'
  const accessKey = process.env.BROWSERSTACK_KEY || process.env.BROWSERSTACK_ACCESS_KEY
  const username = process.env.BROWSERSTACK_USER || process.env.BROWSERSTACK_USERNAME

  if (!accessKey) {
    throw new Error('BROWSERSTACK_KEY or BROWSERSTACK_ACCESS_KEY environment variable is required')
  }

  if (!username) {
    throw new Error('BROWSERSTACK_USER or BROWSERSTACK_USERNAME environment variable is required')
  }

  console.log('Starting BrowserStack Local...')
  console.log(`Using local identifier: ${localIdentifier}`)
  console.log(`BrowserStack username: ${username}`)

  global.bsLocal = new BrowserStackLocal.Local()
  global.localIdentifier = localIdentifier

  return new Promise((resolve, reject) => {
    const startOptions = {
      key: accessKey,
      localIdentifier,
      forceLocal: true,
      verbose: true,
      force: true, // Force kill any existing local connections
      onlyAutomate: true, // Only allow automate traffic
      enableLoggingToFile: true,
      logFile: './local.log'
    }

    console.log('BrowserStack Local options:', { ...startOptions, key: '[HIDDEN]' })

    global.bsLocal.start(startOptions, (error) => {
      if (error) {
        console.error('ERROR starting BrowserStack Local:', error)
        const errorObj = error instanceof Error ? error : new Error(String(error))
        reject(errorObj)
      } else {
        console.log('BrowserStack Local started successfully!')

        // Check if the local connection is actually running
        if (global.bsLocal.isRunning()) {
          console.log('BrowserStack Local is confirmed running')

          // Test the connection with a longer wait time
          console.log('Waiting for tunnel to stabilize...')
          setTimeout(() => {
            // Double-check the connection is still stable
            if (global.bsLocal.isRunning()) {
              console.log('✅ BrowserStack Local tunnel is stable and ready for tests')
              resolve()
            } else {
              const errorObj = new Error('BrowserStack Local connection became unstable')
              console.error(errorObj.message)
              reject(errorObj)
            }
          }, 15000) // Increased wait time for stability
        } else {
          const errorObj = new Error('BrowserStack Local failed to start properly')
          console.error(errorObj.message)
          reject(errorObj)
        }
      }
    })
  })
}

export default globalSetup
