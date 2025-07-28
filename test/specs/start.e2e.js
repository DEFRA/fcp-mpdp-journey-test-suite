import { test, expect } from '../utils/global-test-setup.js'
import { StartPage } from '../page-objects/start.page.js'

test.describe('Service start page', () => {
  test('Should be on the "Service start" page', async ({ page }) => {
    const startPage = new StartPage(page)
    await startPage.open()
    await expect(page).toHaveTitle('Find farm and land payment data - GOV.UK')
  })
})
