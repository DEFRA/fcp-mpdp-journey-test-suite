import { expect } from '@playwright/test'

export async function expectHeader (page, expectedHeader) {
  await expect(page.locator('h1')).toHaveText(expectedHeader)
}
