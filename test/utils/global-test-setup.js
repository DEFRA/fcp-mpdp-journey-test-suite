/**
 * Global test configuration that automatically handles BrowserStack status reporting
 * Import this in any test file that needs BrowserStack status reporting
 */

import { test as base } from '@playwright/test'

// Extend the base test to include BrowserStack status reporting
export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    // Use the page normally during the test
    await use(page)

    // Only update BrowserStack status if this is a BrowserStack test and page is still available
    const isBrowserStackTest = testInfo.project.use?.connectOptions?.wsEndpoint?.includes('browserstack.com')

    if (isBrowserStackTest && !page.isClosed()) {
      const status = testInfo.status === 'passed' ? 'passed' : 'failed'
      const reason = testInfo.status === 'passed'
        ? 'Test completed successfully'
        : testInfo.error?.message || 'Test failed'

      try {
        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({
          action: 'setSessionStatus',
          arguments: { status, reason }
        })}`)

        console.log(`BrowserStack status updated: ${status} - ${testInfo.title}`)
      } catch (error) {
        console.warn('Failed to update BrowserStack status:', error.message)
      }
    }
  }
})

export { expect } from '@playwright/test'
