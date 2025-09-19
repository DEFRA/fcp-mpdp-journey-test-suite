import { expect } from '@playwright/test'

export async function expectPageUrl (page, locator, url) {
  const link = page.locator(locator)

  await link.click()
  await page.waitForURL(url)

  expect(page.url()).toBe(url)
}
