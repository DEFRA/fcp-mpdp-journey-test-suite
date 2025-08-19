import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('404 page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/does-not-exist')
  })

  test('Should display the correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Page not found - Find farm and land payment data - GOV.UK')
  })

  test('should display the correct phase banner', async ({ page }) => {
    await expect(page.locator('.govuk-phase-banner')).toHaveCount(1)
    await expect(page.locator('.govuk-phase-banner__content__tag')).toHaveText('Beta')
    await expect(page.locator('.govuk-phase-banner__text')).toHaveText('This is a new service. Help us improve it and give your feedback (opens in new tab).')
    await expect(page.locator('.govuk-phase-banner .govuk-link')).toHaveAttribute('href', 'https://defragroup.eu.qualtrics.com/jfe/form/SV_1FcBVO6IMkfHmbs')
  })

  test('Should display the not found content', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Page not found')
    await expect(page.locator('p').nth(1)).toHaveText('If you typed the web address, check it is correct.')
    await expect(page.locator('p').nth(2)).toHaveText('If you pasted the web address, check you copied the entire address.')
  })

  test('Should meet WCAG 2.2 AA', async ({ page }) => {
    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations).toHaveLength(0)
  })
})
