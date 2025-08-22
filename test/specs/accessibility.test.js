import { test, expect } from '@playwright/test'

test.describe('Accessibility page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/accessibility')
  })

  test('Should display the correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Accessibility statement for Find Farm and Land Payment Data - Find farm and land payment data - GOV.UK')
  })
})
