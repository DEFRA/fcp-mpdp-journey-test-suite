import { expect } from '@playwright/test'

export async function expectPageUrl (page, locator, url) {
  const link = page.locator(locator)

  await expect(link).toHaveAttribute('href', url)
}
