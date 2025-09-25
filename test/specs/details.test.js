import { test, expect } from '@playwright/test'
import { testPayment } from '../../utils/test-payment.js'
import { accessibilityTest } from '../accessibility.test.js'
import { securityTest } from '../security.test.js'
import { expectPhaseBanner } from '../expect/phase-banner.js'
import { expectPageUrl } from '../expect/page-url.js'
import { expectRelatedContent } from '../expect/related-content.js'
import { expectTitle } from '../expect/title.js'
import { expectHeader } from '../expect/header.js'
import { expectDownload } from '../expect/download.js'
import { expectMoreActionsSection } from '../expect/more-actions.js'
import { isAndroid } from '../../utils/devices.js'

test.describe('Details page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/details?payeeName=Feeney%20and%20Sons&partPostcode=GO15&searchString=Sons&page=1')
  })

  test('Should display the correct content', async ({ page }, testInfo) => {
    await expectTitle(page, `${testPayment.payeeName} - Find farm and land payment data - GOV.UK`)
    await expectPhaseBanner(page, testInfo)
    await expectTitle(page, `${testPayment.payeeName} - Find farm and land payment data - GOV.UK`)
    await expectHeader(page, `${testPayment.payeeName}`)
    await expectMoreActionsSection(page, testInfo)

    const links = [
      { selector: '#fflm-link', text: 'Funding for farmers, growers and land managers' }
    ]
    await expectRelatedContent(page, links)

    const totalSchemes = await page.locator('#total-schemes').innerText()
    const totalAmount = await page.locator('#mpdp-summary-panel p.govuk-heading-m').innerText()
    const dateRange = await page.locator('#date-range').innerText()

    expect(totalSchemes).toBe('Payments from 1 schemes')
    expect(totalAmount).toBe(`£${testPayment.readableTotal}`)
    expect(dateRange).toBe(`1 April ${testPayment.startYear} to 31 March ${testPayment.endYear}`)
  })

  test('Should have a back link that directs to the results page', async ({ page }) => {
    const backLink = page.locator('#back-link')
    await expect(backLink).toContainText('Back to results')

    const href = await backLink.getAttribute('href')
    expect(href).toBe('/results?searchString=Sons&page=1')

    await backLink.click()
    const currentUrl = new URL(page.url())
    expect(currentUrl.pathname).toBe('/results')
    expect(currentUrl.searchParams.get('searchString')).toBe('Sons')
    expect(currentUrl.searchParams.get('page')).toBe('1')
  })

  test('Download details link should download a .CSV file', async ({ page }, testInfo) => {
    const downloadLink = page.locator('#download-details-link')

    await expect(downloadLink).toContainText('Download this data (.CSV)')

    if (!isAndroid(testInfo)) {
      await expect(downloadLink).toHaveAttribute('href', '/details/file?payeeName=Feeney%20and%20Sons&partPostcode=GO15')
    }

    await expectDownload(page, downloadLink, 'ffc-payment-details.csv', testInfo)
  })

  test.describe('Report a problem', () => {
    test.beforeEach(async ({ page }) => {
      const reportProblemToggle = page.locator('#report-problem')
      await reportProblemToggle.click()
    })

    test('Report a problem section should expand and contain correct information', async ({ page }, testInfo) => {
      const rpaEmailLink = page.locator('#rpa-email')
      const sfiQueryFormLink = page.locator('#sfi-query-form')
      const callChargesLink = page.locator('#call-charges')

      await expect(sfiQueryFormLink).toContainText('SFI pilot query form')
      await expect(callChargesLink).toContainText('Find out about call charges')

      if (!isAndroid(testInfo)) {
        await expect(rpaEmailLink).toHaveAttribute('href', 'mailto:ruralpayments@defra.gov.uk')
        await expect(sfiQueryFormLink).toHaveAttribute(
          'href',
          'https://www.gov.uk/government/publications/sustainable-farming-incentive-pilot-query-form'
        )
        await expect(callChargesLink).toHaveAttribute('href', 'https://www.gov.uk/call-charges')
      }
    })

    test('SFI query form link should direct to the correct page', async ({ page }) => {
      await expectPageUrl(
        page,
        '#sfi-query-form',
        'https://www.gov.uk/government/publications/sustainable-farming-incentive-pilot-query-form'
      )
    })

    test('Call charges link should direct to the correct page', async ({ page }) => {
      await expectPageUrl(
        page,
        '#call-charges',
        'https://www.gov.uk/call-charges'
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
