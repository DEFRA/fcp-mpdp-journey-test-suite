import { test, expect } from '@playwright/test'
import { securityTest } from '../security.test.js'
import { accessibilityTest } from '../accessibility.test.js'
import { expectPhaseBanner } from '../../utils/phase-banner-expect.js'
import { expectNewTab } from '../../utils/new-tab-expect.js'
import { expectRelatedContent } from '../../utils/related-content-expect.js'

test.describe('Start page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('Should display the correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Find farm and land payment data - GOV.UK')
  })

  test('Should display the service name', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Find farm and land payment data')
  })

  test('Should display the correct phase banner', async ({ page, context }) => {
    await expectPhaseBanner({ page })

    await expectNewTab(
      context,
      page.locator('.govuk-phase-banner .govuk-link'),
      'https://defragroup.eu.qualtrics.com/jfe/form/SV_1FcBVO6IMkfHmbs'
    )
  })

  test('View yearly totals link should direct to /scheme-payments-by-year route', async ({ page }) => {
    const viewYearlyTotalsLink = page.locator('#view-yearly-totals')

    await expect(viewYearlyTotalsLink).toHaveText('view yearly totals')
    await expect(viewYearlyTotalsLink).toHaveAttribute('href', '/scheme-payments-by-year')

    await viewYearlyTotalsLink.click()
    await expect(page).toHaveURL('/scheme-payments-by-year')
  })

  test('Start button should direct to the /search', async ({ page }) => {
    const startButton = page.locator('#start-button')

    await expect(startButton).toHaveAttribute('href', '/search')

    await startButton.click()
    await expect(page).toHaveURL('/search')
  })

  test('Download all scheme payment data link should download a .CSV file', async ({ page }) => {
    const downloadLink = page.locator('#download-all-link')

    await expect(downloadLink).toHaveAttribute('href', '#')

    await downloadLink.click()
    await expect(page).toHaveURL('/#')
  })

  test('Should have a UK Co-ordinating Body link that directs to the correct page', async ({ page, context }) => {
    await expectNewTab(
      context,
      page.locator('#cap-link'),
      'https://cap-payments.defra.gov.uk/Default.aspx'
    )
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
