import { expect } from '@playwright/test'

export async function expectHeading (page, expectedHeading) {
  await expect(page.locator('h1')).toContainText(expectedHeading)
}
