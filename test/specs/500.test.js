import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('500 page', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/public/javascripts/application.js', route => {
      route.fulfill({
        status: 500,
        contentType: 'text/javascript',
        body: 'console.error("Internal Server Error")'
      })
    })
    await page.goto('/')
  })

  // test('Should display the correct title', async ({ page }) => {
  //   await expect(page).toHaveTitle('Sorry, there is a problem with the service - Find farm and land payment data - GOV.UK')
  // })

  // test('Should display the error content', async ({ page }) => {
  //   await expect(page.locator('h1')).toHaveText('Sorry, there is a problem with the service')
  //   await expect(page.locator('p')).toHaveText('Try again later.')
  // })

  test('Should meet WCAG 2.2 AA', async ({ page }) => {
    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations).toHaveLength(0)
  })
})
