import { expect } from '@playwright/test'

export async function expectTitle (page, expectedTitle) {
  const title = await page.title()
  const _title = expectedTitle ? `${expectedTitle} - ` : ''
  expect(title).toBe(`${_title}Find farm and land payment data - GOV.UK`)
}
