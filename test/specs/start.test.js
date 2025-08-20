import { test, expect } from '@playwright/test'
import { SecurityTest } from '../security.test.js'
import { AccessibilityTest } from '../accessibility.test.js'

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

  test('Should meet WCAG 2.2 AA', async ({ page }) => {
    await AccessibilityTest(page)
  })

  test('Should meet security standards', async ({ page }) => {
    await SecurityTest(page.url())
  })
})
