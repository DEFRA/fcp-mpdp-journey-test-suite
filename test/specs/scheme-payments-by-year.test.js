import { test, expect } from '@playwright/test'
// import AxeBuilder from '@axe-core/playwright'

test.describe('Scheme payments by year page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/schemePaymentsByYear')
  })

  test('Should display the correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Scheme payments by year - Find farm and land payment data - GOV.UK')
  })

  test('Should display the correct heading and subtitle', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Scheme payments by year')
    await expect(page.locator('#subtitle')).toHaveText('We publish some scheme payments as a total for each financial year.')
  })

  test('Should have a back link that directs to the start page', async ({ page }) => {
    const backLink = page.locator('#back-link')

    await expect(backLink).toHaveText('Back')
    await expect(backLink).toHaveAttribute('href', '/')

    await backLink.click()
    expect(page).toHaveURL('/')
  })

  test('Should have a download link', async ({ page }) => {
    const downloadLink = page.locator('#download-details-link')

    await expect(downloadLink).toHaveText('Download this data (.CSV)')
    await expect(downloadLink).toHaveAttribute('href', '#')
  })

  // test('Should meet WCAG 2.2 AA', async ({ page }) => {
  //   const results = await new AxeBuilder({ page }).analyze()
  //   expect(results.violations).toHaveLength(0)
  // })
})
