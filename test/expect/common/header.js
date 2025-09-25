import { expect } from '@playwright/test'

export async function expectHeader (page, testInfo) {
  const headerSelectors = {
    title: '.govuk-header__logo a title',
    serviceName: '.govuk-header__service-name'
  }

  await expect(page.locator(headerSelectors.title)).toContainText('GOV.UK')
  await expect(page.locator(headerSelectors.serviceName)).toContainText('Find farm and land payment data')
}
