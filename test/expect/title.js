import { expect } from '@playwright/test'

export async function expectTitle (page, expectedTitle) {
  const title = await page.title()
  const pageTitle = expectedTitle ? `${expectedTitle} - ` : ''

  expect(title).toBe(`${pageTitle}Find farm and land payment data - GOV.UK`)
}
