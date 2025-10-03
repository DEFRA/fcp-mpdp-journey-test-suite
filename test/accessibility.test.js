import { expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

export async function accessibilityTest (page) {
  const results = await new AxeBuilder({ page })
    .exclude('.govuk-skip-link')
    .analyze()
  expect(results.violations).toHaveLength(0)
}
