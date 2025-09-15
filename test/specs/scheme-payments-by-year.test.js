import { test, expect } from '@playwright/test'
import { expectPhaseBanner } from '../../utils/phase-banner-expect.js'
import { expectNewTab } from '../../utils/new-tab-expect.js'
import { accessibilityTest } from '../accessibility.test.js'
import { securityTest } from '../security.test.js'
import { expectRelatedContent } from '../../utils/related-content-expect.js'

test.describe('Scheme payments by year page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/scheme-payments-by-year')
  })

  test('Should display the correct title', async ({ page }) => {
    const title = await page.title()
    expect(title).toBe('Scheme payments by year - Find farm and land payment data - GOV.UK')
  })

  test('Should display the correct heading and subtitle', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Scheme payments by year')
    await expect(page.locator('#subtitle')).toHaveText('We publish some scheme payments as a total for each financial year.')
  })

  test('Should display the correct phase banner', async ({ page, context }) => {
    await expectPhaseBanner({ page })

    await expectNewTab(
      context,
      page.locator('.govuk-phase-banner .govuk-link'),
      'https://defragroup.eu.qualtrics.com/jfe/form/SV_1FcBVO6IMkfHmbs'
    )
  })

  test('Should have a back link that directs to the start page', async ({ page }) => {
    const backLink = page.locator('#back-link')

    await expect(backLink).toHaveText('Back')
    await expect(backLink).toHaveAttribute('href', '/')

    await backLink.click()
    const currentUrl = new URL(page.url())
    expect(currentUrl.pathname).toBe('/')
  })

  test('Download scheme payments by year link should download a .CSV file', async ({ page }) => {
    const downloadLink = page.locator('#download-scheme-payments-by-year-link')

    await expect(downloadLink).toHaveText('Download this data (.CSV)')
    await expect(downloadLink).toHaveAttribute('href', '/scheme-payments-by-year/file')

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      downloadLink.click()
    ])

    const filename = download.suggestedFilename()

    expect(filename).toBe('ffc-payments-by-year.csv')
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
