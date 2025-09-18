import { test, expect } from '@playwright/test'
import { securityTest } from '../security.test.js'
import { accessibilityTest } from '../accessibility.test.js'
import { expectPhaseBanner } from '../expect/phase-banner.js'
import { expectNewTab } from '../expect/new-tab.js'
import { expectRelatedContent } from '../expect/related-content.js'
import { expectTitle } from '../expect/title.js'
import { expectHeader } from '../expect/header.js'

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

  test('View yearly totals link should direct to /scheme-payments-by-year route', async ({ page }) => {
    const viewYearlyTotalsLink = page.locator('#view-yearly-totals')

    await expect(viewYearlyTotalsLink).toContainText('view yearly totals')
    await expect(viewYearlyTotalsLink).toHaveAttribute('href', '/scheme-payments-by-year')

    await viewYearlyTotalsLink.click()
    const currentUrl = new URL(page.url())
    expect(currentUrl.pathname).toBe('/scheme-payments-by-year')
  })

  test('Start button should direct to the /search', async ({ page }) => {
    const startButton = page.locator('#start-button')

    await expect(startButton).toHaveAttribute('href', '/search')

    await startButton.click()
    const currentUrl = new URL(page.url())
    expect(currentUrl.pathname).toBe('/search')
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

  test('Should have a UK Co-ordinating Body link that directs to the correct page', async ({ page, context }) => {
    await expectNewTab(
      context,
      page.locator('#cap-link'),
      'https://cap-payments.defra.gov.uk/Default.aspx'
    )
  })

  test('Funding for farmers, growers and land managers directs to the correct page', async ({ page, context }) => {
    await expectNewTab(
      context,
      page.locator('#fflm-link'),
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
