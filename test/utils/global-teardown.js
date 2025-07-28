async function globalTeardown () {
  if (global.bsLocal) {
    console.log('Stopping BrowserStack Local...')
    return new Promise((resolve) => {
      global.bsLocal.stop(() => {
        console.log('BrowserStack Local stopped successfully')
        global.bsLocal = null
        resolve()
      })
    })
  } else {
    console.log('No BrowserStack Local instance to stop')
    return Promise.resolve()
  }
}

export default globalTeardown
