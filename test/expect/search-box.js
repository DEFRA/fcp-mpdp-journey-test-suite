import { expect } from '@playwright/test'

export async function expectSearchBox (page, selector, placeholder = 'Smith') {
  const searchBox = page.locator(selector)
  const searchButton = page.getByRole('button', { name: 'Search' })

  await expect(searchButton).toBeVisible()
  await expect(searchBox).toBeVisible()

  const value = await searchBox.inputValue()
  expect(value).toBe(placeholder)
}
