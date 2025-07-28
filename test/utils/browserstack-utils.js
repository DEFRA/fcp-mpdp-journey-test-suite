import cp from 'child_process'
import baseConfig from '../../playwright.config.js'

const clientPlaywrightVersion = cp.execSync('npx playwright --version').toString().trim().split(' ')[1]

/**
 * Helper function to create BrowserStack project configuration
 * @param {Object} config - Configuration object
 * @param {string} config.name - Project name
 * @param {string} config.browser - Browser type (chrome, edge, playwright-firefox, playwright-webkit)
 * @param {string} config.os - Operating system (Windows, OS X)
 * @param {string} config.osVersion - OS version (11, Monterey, etc.)
 * @param {string} config.displayName - Display name for the project
 * @param {boolean} [config.isLocal=false] - Whether this is a local test
 * @param {string} [config.buildName='FCP MPDP'] - Build name
 * @returns {Object} BrowserStack project configuration
 */
export function createBrowserStackProject (config) {
  const {
    name,
    browser,
    os,
    osVersion,
    displayName,
    isLocal = false,
    buildName = 'FCP MPDP'
  } = config

  const projectConfig = {
    name,
    use: {
      ...baseConfig.use,
      ...(isLocal && { baseURL: 'http://localhost:3000' }),
      connectOptions: {
        wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify({
          browser,
          browser_version: 'latest',
          os,
          os_version: osVersion,
          'browserstack.username': process.env.BROWSERSTACK_USER || process.env.BROWSERSTACK_USERNAME,
          'browserstack.accessKey': process.env.BROWSERSTACK_KEY || process.env.BROWSERSTACK_ACCESS_KEY,
          ...(isLocal && { 'browserstack.localIdentifier': 'playwright-local-test' }),
          'browserstack.local': isLocal.toString(),
          name: displayName,
          build: buildName,
          'client.playwrightVersion': clientPlaywrightVersion
        }))}`,
        timeout: 120000
      }
    }
  }

  return projectConfig
}
