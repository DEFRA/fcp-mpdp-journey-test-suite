import { expect } from '@playwright/test'

export async function expectHeader (page, testInfo) {
  const serviceName = '.govuk-service-navigation__service-name'

  await expect(page.locator(serviceName)).toContainText('Find farm and land payment data')
}
