import { expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

export async function AccessibilityTest (page) {
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toHaveLength(0)
}
