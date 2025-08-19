import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

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

  test('should display the correct phase banner', async ({ page }) => {
    await expect(page.locator('.govuk-phase-banner')).toHaveCount(1)
    await expect(page.locator('.govuk-phase-banner__content__tag')).toHaveText('Beta')
    await expect(page.locator('.govuk-phase-banner__text')).toHaveText('This is a new service. Help us improve it and give your feedback (opens in new tab).')
    await expect(page.locator('.govuk-phase-banner .govuk-link')).toHaveAttribute('href', 'https://defragroup.eu.qualtrics.com/jfe/form/SV_1FcBVO6IMkfHmbs')
  })

  test('Should meet WCAG 2.2 AA', async ({ page }) => {
    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations).toHaveLength(0)
  })
})
