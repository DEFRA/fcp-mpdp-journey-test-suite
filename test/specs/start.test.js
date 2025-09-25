import { test, expect } from '@playwright/test'
import { securityTest } from '../security.test.js'
import { accessibilityTest } from '../accessibility.test.js'
import { expectPhaseBanner } from '../expect/phase-banner.js'
import { expectNewTab } from '../expect/new-tab.js'
import { expectPageUrl } from '../expect/page-url.js'
import { expectRelatedContent } from '../expect/related-content.js'
import { expectTitle } from '../expect/title.js'
import { expectHeader } from '../expect/header.js'
import { isAndroid } from '../../utils/devices.js'
import { expectDownload } from '../expect/download.js'

test.describe('Start page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('Should display the correct content', async ({ page }, testInfo) => {
    await expectTitle(page, 'Find farm and land payment data - GOV.UK')
    await expectPhaseBanner(page, testInfo)
    await expectHeader(page, 'Find farm and land payment data')

    const links = [
      { selector: '#fflm-link', text: 'Funding for farmers, growers and land managers' }
    ]

    await expectRelatedContent(page, links)
  })

  test('Phase banner should link to the feedback form', async ({ page, context }) => {
    await expectNewTab(
      context,
      page.locator('.govuk-phase-banner .govuk-link'),
      'https://defragroup.eu.qualtrics.com/jfe/form/SV_1FcBVO6IMkfHmbs'
    )
  })

  test('View yearly totals link should direct to /scheme-payments-by-year route', async ({ page }, testInfo) => {
    const viewYearlyTotalsLink = page.locator('#view-yearly-totals')

    await expect(viewYearlyTotalsLink).toContainText('view yearly totals')

    if (!isAndroid(testInfo)) {
      await expect(viewYearlyTotalsLink).toHaveAttribute('href', '/scheme-payments-by-year')
    }

    await viewYearlyTotalsLink.click()
    const currentUrl = new URL(page.url())
    expect(currentUrl.pathname).toBe('/scheme-payments-by-year')
  })

  test('Start button should direct to the /search', async ({ page }, testInfo) => {
    const startButton = page.locator('#start-button')

    if (!isAndroid(testInfo)) {
      await expect(startButton).toHaveAttribute('href', '/search')
    }

    await startButton.click()
    const currentUrl = new URL(page.url())
    expect(currentUrl.pathname).toBe('/search')
  })

  test('Download all scheme payment data link should download a .CSV file', async ({ page }, testInfo) => {
    const downloadLink = page.locator('#download-all-scheme-payment-data-link')

    await expect(downloadLink).toContainText('download all scheme payment data (4.7MB)')

    if (!isAndroid(testInfo)) {
      await expect(downloadLink).toHaveAttribute('href', '/all-scheme-payment-data/file')
    }

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

  test('Should meet security standards', async ({ page }) => {
    await securityTest(page.url())
  })
})
