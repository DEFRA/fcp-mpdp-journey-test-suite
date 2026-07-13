import { expect } from '@playwright/test'

export async function expectMoreActionsSection (page) {
  const newSearchHref = await page.locator('#new-search-link').getAttribute('href')
  expect(newSearchHref).toBe('/search')

  const printHref = await page.locator('#print-link').getAttribute('href')
  expect(printHref).toBe('#')
}
