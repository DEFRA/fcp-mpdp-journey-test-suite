import { expect } from '@playwright/test'

export async function expectTitle (page, expectedTitle) {
  const title = await page.title()
  expect(title).toBe(expectedTitle)
}
