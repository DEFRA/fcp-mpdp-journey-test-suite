import { test, expect } from '@playwright/test'
import { securityTest } from '../security.test.js'
import { accessibilityTest } from '../accessibility.test.js'
import { expectPhaseBanner } from '../../utils/phase-banner-expect.js'
import { expectNewTab } from '../../utils/new-tab-expect.js'

test.describe('404 page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/does-not-exist')
  })

  test('Should display the correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Page not found - Find farm and land payment data - GOV.UK')
  })

  test('Should display the correct phase banner', async ({ page, context }) => {
    await expectPhaseBanner({ page })

    await expectNewTab(
      context,
      page.locator('.govuk-phase-banner .govuk-link'),
      'https://defragroup.eu.qualtrics.com/jfe/form/SV_1FcBVO6IMkfHmbs'
    )
  })

  test('Should display the not found content', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Page not found')
    await expect(page.locator('p').nth(1)).toHaveText('If you typed the web address, check it is correct.')
    await expect(page.locator('p').nth(2)).toHaveText('If you pasted the web address, check you copied the entire address.')
  })

  test('Should meet WCAG 2.2 AA', async ({ page }) => {
    await accessibilityTest(page)
  })

  test('Should meet security standards', async ({ page }) => {
    await securityTest(page.url())
  })
})
