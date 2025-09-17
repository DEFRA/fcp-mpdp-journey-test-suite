import { test, expect } from '@playwright/test'
import { testPayment } from '../../utils/test-payment.js'
import { accessibilityTest } from '../accessibility.test.js'
import { securityTest } from '../security.test.js'
import { expectPhaseBanner } from '../../utils/phase-banner-expect.js'
import { expectNewTab } from '../../utils/new-tab-expect.js'
import { expectRelatedContent } from '../../utils/related-content-expect.js'

test.describe('Details page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/details?payeeName=Feeney%20and%20Sons&partPostcode=GO15&searchString=Sons&page=1')
  })

  test('Should display the correct title', async ({ page }) => {
    const title = await page.title()
    expect(title).toBe(`${testPayment.payeeName} - Find farm and land payment data - GOV.UK`)
  })

  test('Should display the correct heading', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText(`${testPayment.payeeName}`)
  })

  test('Should display the correct phase banner', async ({ page, context }) => {
    await expectPhaseBanner({ page })

    await expectNewTab(
      context,
      page.locator('.govuk-phase-banner .govuk-link'),
      'https://defragroup.eu.qualtrics.com/jfe/form/SV_1FcBVO6IMkfHmbs'
    )
  })

  test('Should have a back link that directs to the results page', async ({ page }) => {
    const backLink = page.locator('#back-link')
    await expect(backLink).toHaveText('Back to results')

    const href = await backLink.getAttribute('href')
    expect(href).toBe('/results?searchString=Sons&page=1')

    await backLink.click()
    const currentUrl = new URL(page.url())
    expect(currentUrl.pathname).toBe('/results')
    expect(currentUrl.searchParams.get('searchString')).toBe('Sons')
    expect(currentUrl.searchParams.get('page')).toBe('1')
  })

  test('Download details link should download a .CSV file', async ({ page }) => {
    const downloadLink = page.locator('#download-details-link')

    await expect(downloadLink).toHaveText('Download this data (.CSV)')
    await expect(downloadLink).toHaveAttribute('href', '/details/file?payeeName=Feeney%20and%20Sons&partPostcode=GO15')

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      downloadLink.click()
    ])

    const filename = download.suggestedFilename()

    expect(filename).toBe('ffc-payment-details.csv')
  })

  test('Summary panel should display correct totals', async ({ page }) => {
    const totalSchemes = await page.locator('#total-schemes').innerText()
    const totalAmount = await page.locator('#mpdp-summary-panel p.govuk-heading-m').innerText()
    const dateRange = await page.locator('#date-range').innerText()

    expect(totalSchemes).toBe('Payments from 1 schemes')
    expect(totalAmount).toBe(`£${testPayment.readableTotal}`)
    expect(dateRange).toBe(`1 April ${testPayment.startYear} to 31 March ${testPayment.endYear}`)
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

  test.describe('Report a problem', () => {
    test.beforeEach(async ({ page }) => {
      const reportProblemToggle = page.locator('#report-problem')
      await reportProblemToggle.click()
    })

    test('Report a problem section should expand and contain correct information', async ({ page }) => {
      const rpaEmailLink = page.locator('#rpa-email')
      const sfiQueryFormLink = page.locator('#sfi-query-form')
      const callChargesLink = page.locator('#call-charges')

      await expect(rpaEmailLink).toHaveAttribute('href', 'mailto:ruralpayments@defra.gov.uk')

      await expect(sfiQueryFormLink).toHaveText('SFI pilot query form')
      await expect(sfiQueryFormLink).toHaveAttribute(
        'href',
        'https://www.gov.uk/government/publications/sustainable-farming-incentive-pilot-query-form'
      )

      await expect(callChargesLink).toHaveText('Find out about call charges')
      await expect(callChargesLink).toHaveAttribute('href', 'https://www.gov.uk/call-charges')
    })

    test('SFI query form link should direct to the correct page', async ({ page, context }) => {
      await expectNewTab(
        context,
        page.locator('#sfi-query-form'),
        'https://www.gov.uk/government/publications/sustainable-farming-incentive-pilot-query-form'
      )
    })

    test('Call charges link should direct to the correct page', async ({ page, context }) => {
      await expectNewTab(
        context,
        page.locator('#call-charges'),
        'https://www.gov.uk/call-charges'
      )
    })
  })

  test('More actions links should exist and have correct targets', async ({ page }) => {
    await expect(page.locator('#new-search-link')).toHaveAttribute('href', '/search')
    await expect(page.locator('#print-link')).toHaveAttribute('href', 'javascript:window.print()')
  })

  test('Should meet WCAG 2.2 AA', async ({ page }) => {
    await accessibilityTest(page)
  })

  test('Should meet security standards', async ({ page }) => {
    await securityTest(page.url())
  })
})
