import { test, expect } from '@playwright/test'
import { accessibilityTest } from '../accessibility.test.js'
import { expectTitle } from '../expect/title.js'
import { expectHeader } from '../expect/common/header.js'
import { expectPhaseBanner } from '../expect/common/phase-banner.js'
import { expectHeading } from '../expect/heading.js'
import { expectPageUrl } from '../expect/page-url.js'
import { expectDownload } from '../expect/download.js'
import { expectRelatedContent } from '../expect/related-content.js'
import { expectFooter } from '../expect/common/footer.js'

test.describe('Start page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('Should display the correct content', async ({ page }, testInfo) => {
    await expectTitle(page)
    await expectHeader(page, testInfo)
    await expectPhaseBanner(page)
    await expectHeading(page, 'Find farm and land payment data')

    const links = [
      { selector: '#fflm-link', text: 'Funding for farmers, growers and land managers' }
    ]

    await expectRelatedContent(page, links)
    await expectFooter(page, testInfo)
  })

  test('View yearly totals link should direct to /scheme-payments-by-year route', async ({ page }) => {
    const viewYearlyTotalsLink = page.locator('#view-yearly-totals')

    await expect(viewYearlyTotalsLink).toContainText('view yearly totals')

    const href = await viewYearlyTotalsLink.getAttribute('href')
    expect(href).toBe('/scheme-payments-by-year')

    await viewYearlyTotalsLink.click()
    const currentUrl = new URL(page.url())
    expect(currentUrl.pathname).toBe('/scheme-payments-by-year')
  })

  test('Start button should direct to the /search', async ({ page }) => {
    const startButton = page.locator('#start-button')

    const href = await startButton.getAttribute('href')
    expect(href).toBe('/search')

    await startButton.click()
    const currentUrl = new URL(page.url())
    expect(currentUrl.pathname).toBe('/search')
  })

  test('Download all scheme payment data link should download a .CSV file', async ({ page }, testInfo) => {
    const downloadLink = page.locator('#download-all-scheme-payment-data-link')

    await expect(downloadLink).toContainText('download all scheme payment data')

    const href = await downloadLink.getAttribute('href')
    expect(href).toBe('/all-scheme-payment-data/file')

    await expectDownload(page, downloadLink, 'ffc-payment-data.csv', testInfo)
  })

  test('Should have a UK Co-ordinating Body link that directs to the correct page', async ({ page }) => {
    await expectPageUrl(
      page,
      '#cap-link',
      'https://cap-payments.defra.gov.uk/Default.aspx'
    )
  })

  test('Funding for farmers, growers and land managers directs to the correct page', async ({ page }) => {
    await expectPageUrl(
      page,
      '#fflm-link',
      'https://www.gov.uk/guidance/funding-for-farmers'
    )
  })

  test('Should meet WCAG 2.2 AA', async ({ page }) => {
    await accessibilityTest(page)
  })
})
