import { test, expect } from '@playwright/test'
import { expectPhaseBanner } from '../../utils/phase-banner-expect.js'
import { expectNewPageLink } from '../../utils/new-page-link-expect.js'
import { AccessibilityTest } from '../accessibility.test.js'
import { SecurityTest } from '../security.test.js'

test.describe('Scheme payments by year page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/scheme-payments-by-year')
  })

  test('Should display the correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Scheme payments by year - Find farm and land payment data - GOV.UK')
  })

  test('Should display the correct heading and subtitle', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Scheme payments by year')
    await expect(page.locator('#subtitle')).toHaveText('We publish some scheme payments as a total for each financial year.')
  })

  test('Should have a back link that directs to the start page', async ({ page }) => {
    const backLink = page.locator('#back-link')

    await expect(backLink).toHaveText('Back')
    await expect(backLink).toHaveAttribute('href', '/')

    await backLink.click()
    await expect(page).toHaveURL('/')
  })

  test('Should display the correct phase banner', async ({ page, context }) => {
    await expectPhaseBanner({ page })

    await expectNewPageLink(
      context,
      page.locator('.govuk-phase-banner .govuk-link'),
      'https://defragroup.eu.qualtrics.com/jfe/form/SV_1FcBVO6IMkfHmbs'
    )
  })

  test('Should have a download link', async ({ page }) => {
    const downloadLink = page.locator('#download-details-link')

    await expect(downloadLink).toHaveText('Download this data (.CSV)')
    await expect(downloadLink).toHaveAttribute('href', '#')
  })

  test.describe('Related Content', () => {
    test('Related Content section contains correct information and directs to correct pages', async ({ page, context }) => {
      const sectionHeading = page.locator('#related-content')
      const fundingLink = page.locator('#fflm-link')

      await expect(sectionHeading).toHaveText('Related Content')
      await expect(fundingLink).toHaveText('Funding for farmers, growers and land managers')
    })

    test('Funding for farmers, growers and land managers directs to the correct page', async ({ page, context }) => {
      await expectNewPageLink(
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
      // await expectNewPageLink(
      //   context,
      //   page.locator('#sfi-query-form'),
      //   'https://www.gov.uk/government/publications/sustainable-farming-incentive-pilot-query-form'
      // )
    })

    test('Call charges link should direct to the correct page', async ({ page, context }) => {
      // await expectNewPageLink(
      //   context,
      //   page.locator('#call-charges'),
      //   'https://www.gov.uk/call-charges'
      // )
    })
  })

  test('More actions links should exist and have correct targets', async ({ page }) => {
    await expect(page.locator('#new-search-link')).toHaveAttribute('href', '#')
    await expect(page.locator('#print-link')).toHaveAttribute('href', 'javascript:window.print()')
  })

  test('Should meet WCAG 2.2 AA', async ({ page }) => {
    await AccessibilityTest(page)
  })

  test('Should meet security standards', async ({ page }) => {
    await SecurityTest(page.url())
  })
})
