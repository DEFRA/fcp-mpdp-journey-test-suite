import { test, expect } from '@playwright/test'
import { securityTest } from '../security.test.js'
import { accessibilityTest } from '../accessibility.test.js'
import { expectPhaseBanner } from '../expect/phase-banner.js'
import { expectTitle } from '../expect/title.js'
import { expectHeader } from '../expect/header.js'

test.describe('404 page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/does-not-exist')
  })

  test('Should display the correct content', async ({ page }, testInfo) => {
    await expectTitle(page, 'Page not found - Find farm and land payment data - GOV.UK')
    await expectPhaseBanner(page, testInfo)
    await expectHeader(page, 'Page not found')
    await expect(page.locator('p').nth(1)).toContainText('If you typed the web address, check it is correct.')
    await expect(page.locator('p').nth(2)).toContainText('If you pasted the web address, check you copied the entire address.')
  })

  test('Should meet WCAG 2.2 AA', async ({ page }) => {
    await accessibilityTest(page)
  })

  test('Should meet security standards', async ({ page }) => {
    await securityTest(page.url())
  })
})
