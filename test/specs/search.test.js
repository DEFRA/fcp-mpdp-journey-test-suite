import { test, expect } from '@playwright/test'
import { securityTest } from '../security.test.js'
import { accessibilityTest } from '../accessibility.test.js'
import { expectPhaseBanner } from '../expect/phase-banner.js'
import { expectRelatedContent } from '../expect/related-content.js'
import { expectTitle } from '../expect/title.js'
import { expectHeader } from '../expect/header.js'

test.describe('Search page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/search')
  })

  test('Should display the correct content', async ({ page }) => {
    await expectTitle(page, 'Search for an agreement holder - Find farm and land payment data - GOV.UK')
    await expectPhaseBanner(page)
    await expectHeader(page, 'Search for an agreement holder')

    const links = [
      { selector: '#fflm-link', text: 'Funding for farmers, growers and land managers' }
    ]

    await expectRelatedContent({ page, links })
  })

  test('Should have a back link that directs to the previous page', async ({ page }) => {
    const searchLink = 'a[href="/search"]'
    const backLink = page.locator('#back-link')
    const url = new URL('/', page.url()).href

    await page.goto('/')
    await page.click(searchLink)
    await page.waitForURL('/search')

    const currentUrl = new URL(page.url())
    expect(currentUrl.pathname).toBe('/search')

    await expect(backLink).toContainText('Back')
    await expect(backLink).toHaveAttribute('href', url)
  })

  test('Download all scheme payment data link should download a .CSV file', async ({ page }) => {
    const downloadLink = page.locator('#download-all-scheme-payment-data-link')

    await expect(downloadLink).toContainText('download all scheme payment data (4.7MB)')
    await expect(downloadLink).toHaveAttribute('href', '/all-scheme-payment-data/file')

    const downloadPromise = page.waitForEvent('download')
    await downloadLink.click()
    const download = await downloadPromise

    const filename = download.suggestedFilename()

    expect(filename).toBe('ffc-payment-data.csv')
  })

  test('Should meet WCAG 2.2 AA', async ({ page }) => {
    await accessibilityTest(page)
  })

  test('Should meet security standards', async ({ page }) => {
    await securityTest(page.url())
  })
})
