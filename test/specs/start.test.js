import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { expectPhaseBanner } from '../../utils/phase-banner-expect.js'
import { expectNewPageLink } from '../../utils/new-page-link-expect.js'

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

    await expectNewPageLink(
      context,
      page.locator('.govuk-phase-banner .govuk-link'),
      'https://defragroup.eu.qualtrics.com/jfe/form/SV_1FcBVO6IMkfHmbs'
    )
  })

  test('View yearly totals link should direct to /scheme-payments-by-year route', async ({ page }) => {
    const viewYearlyTotalsLink = page.locator('#view-yearly-totals')

    await expect(viewYearlyTotalsLink).toHaveText('view yearly totals')
    await expect(viewYearlyTotalsLink).toHaveAttribute('href', '#')

    await viewYearlyTotalsLink.click()
    await expect(page).toHaveURL('/#')
  })

  test('Start button should direct to the /search', async ({ page }) => {
    const startButton = page.locator('#start-button')

    await expect(startButton).toHaveAttribute('href', '#')

    await startButton.click()
    await expect(page).toHaveURL('/#')
  })

  test('Download all scheme payment data link should download a .CSV file', async ({ page }) => {
    const downloadLink = page.locator('#download-all-link')

    await expect(downloadLink).toHaveAttribute('href', '#')

    await downloadLink.click()
    await expect(page).toHaveURL('/#')
  })

  test('Should have a UK Co-ordinating Body link that directs to the correct page', async ({ page, context }) => {
    await expectNewPageLink(
      context,
      page.locator('#cap-link'),
      'https://cap-payments.defra.gov.uk/Default.aspx'
    )
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

  test('Should meet WCAG 2.2 AA', async ({ page }) => {
    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations).toHaveLength(0)
  })
})
