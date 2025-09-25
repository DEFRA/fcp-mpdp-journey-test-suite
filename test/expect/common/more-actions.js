import { expect } from '@playwright/test'
import { isAndroid } from '../../../utils/devices.js'

export async function expectMoreActionsSection (page, testInfo) {
  if (!isAndroid(testInfo)) {
    await expect(page.locator('#new-search-link')).toHaveAttribute('href', '/search')
    await expect(page.locator('#print-link')).toHaveAttribute('href', '#')
  }
}
