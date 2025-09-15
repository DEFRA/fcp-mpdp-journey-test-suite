import { test, expect } from '@playwright/test'
import { securityTest } from '../security.test.js'
import { accessibilityTest } from '../accessibility.test.js'
import { expectPhaseBanner } from '../../utils/phase-banner-expect.js'
import { expectNewTab } from '../../utils/new-tab-expect.js'
import { expectRelatedContent } from '../../utils/related-content-expect.js'

test.describe('Search page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/search')
  })

  test('Should display the correct title', async ({ page }) => {
    const title = await page.title()
    expect(title).toBe('Search for an agreement holder - Find farm and land payment data - GOV.UK')
  })

  test('Should display the correct heading', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Search for an agreement holder')
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

    await expect(backLink).toHaveText('Back')
    await expect(backLink).toHaveAttribute('href', url)
  })

  test('Should display the correct phase banner', async ({ page, context }) => {
    await expectPhaseBanner({ page })

    await expectNewTab(
      context,
      page.locator('.govuk-phase-banner .govuk-link'),
      'https://defragroup.eu.qualtrics.com/jfe/form/SV_1FcBVO6IMkfHmbs'
    )
  })

  test('Download all scheme payment data link should download a .CSV file', async ({ page }) => {
    const downloadLink = page.locator('#download-all-scheme-payment-data-link')

    await expect(downloadLink).toHaveText('download all scheme data')
    await expect(downloadLink).toHaveAttribute('href', '/all-scheme-payment-data/file')

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      downloadLink.click()
    ])

    const filename = download.suggestedFilename()

    expect(filename).toBe('ffc-payment-data.csv')
  })

  test.describe('Related Content', () => {
    test('Related Content section contains correct information', async ({ page }) => {
      const links = [
        { selector: '#fflm-link', text: 'Funding for farmers, growers and land managers' }
      ]

      await expectRelatedContent({ page, links })
    })

    test('Funding for farmers, growers and land managers directs to the correct page', async ({ page, context }) => {
      await expectNewTab(
        context,
        page.locator('#fflm-link'),
        'https://www.gov.uk/guidance/funding-for-farmers'
      )
    })
  })

  test('Should meet WCAG 2.2 AA', async ({ page }) => {
    await accessibilityTest(page)
  })

  test('Should meet security standards', async ({ page }) => {
    await securityTest(page.url())
  })
})
