import { test, expect } from '@playwright/test'
import { SecurityTest } from '../security.test.js'
import { AccessibilityTest } from '../accessibility.test.js'
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

  test('Should meet WCAG 2.2 AA', async ({ page }) => {
    await AccessibilityTest(page)
  })

  test('Should meet security standards', async ({ page }) => {
    await SecurityTest(page.url())
  })
})
