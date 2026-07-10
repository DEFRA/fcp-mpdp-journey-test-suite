export default async function globalTeardown () {
  if (globalThis.__bsLocal) {
    await new Promise((resolve) => {
      globalThis.__bsLocal.stop(resolve)
    })
    console.log('BrowserStackLocal tunnel closed')
  }
}
