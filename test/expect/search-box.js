import { expect } from '@playwright/test'
import { isAndroid } from '../../utils/devices.js'

export async function expectSearchBox (page, selector, placeholder = 'Smith', testInfo) {
  const searchBox = page.locator(selector)
  const searchButton = page.getByRole('button', { name: 'Search' })

  await expect(searchButton).toBeVisible()
  await expect(searchBox).toBeVisible()

  if (!isAndroid(testInfo)) {
    await expect(searchBox).toHaveValue(placeholder)
  }
}
