import { test, expect } from '@playwright/test'
import { expectPhaseBanner } from '../expect/phase-banner.js'
import { expectNewTab } from '../expect/new-tab.js'
import { accessibilityTest } from '../accessibility.test.js'
import { securityTest } from '../security.test.js'
import { expectRelatedContent } from '../expect/related-content.js'
import { expectTitle } from '../expect/title.js'
import { expectHeader } from '../expect/header.js'
import { isAndroid } from '../../utils/devices.js'
import { expectDownload } from '../expect/download.js'

test.describe('Scheme payments by year page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/scheme-payments-by-year')
  })

  test('Should display the correct content', async ({ page }, testInfo) => {
    await expectTitle(page, 'Scheme payments by year - Find farm and land payment data - GOV.UK')
    await expectPhaseBanner(page, testInfo)
    await expectHeader(page, 'Scheme payments by year')
    await expect(page.locator('#subtitle')).toContainText('We publish some scheme payments as a total for each financial year.')

    const links = [
      { selector: '#fflm-link', text: 'Funding for farmers, growers and land managers' }
    ]

    await expectRelatedContent(page, links)
  })

  test('Should have a back link that directs to the start page', async ({ page }, testInfo) => {
    const backLink = page.locator('#back-link')

    await expect(backLink).toContainText('Back')

    if (!isAndroid(testInfo)) {
      await expect(backLink).toHaveAttribute('href', '/')
    }

    await backLink.click()
    const currentUrl = new URL(page.url())
    expect(currentUrl.pathname).toBe('/')
  })

  test('Download scheme payments by year link should download a .CSV file', async ({ page }, testInfo) => {
    const downloadLink = page.locator('#download-scheme-payments-by-year-link')

    await expect(downloadLink).toContainText('Download this data (.CSV)')

    if (!isAndroid(testInfo)) {
      await expect(downloadLink).toHaveAttribute('href', '/scheme-payments-by-year/file')
    }

    await expectDownload(page, downloadLink, 'ffc-payments-by-year.csv', testInfo)
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

  test('More actions links should exist and have correct targets', async ({ page }, testInfo) => {
    if (!isAndroid(testInfo)) {
      await expect(page.locator('#new-search-link')).toHaveAttribute('href', '/search')
      await expect(page.locator('#print-link')).toHaveAttribute('href', 'javascript:window.print()')
    }
  })

  test('Should meet WCAG 2.2 AA', async ({ page }) => {
    await accessibilityTest(page)
  })

  test('Should meet security standards', async ({ page }) => {
    await securityTest(page.url())
  })
})
