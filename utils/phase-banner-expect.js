import { expect } from '@playwright/test'

export async function expectPhaseBanner ({ page }) {
  const phaseBanner = '.govuk-phase-banner'

  await expect(page.locator(phaseBanner)).toHaveCount(1)
  await expect(page.locator(`${phaseBanner}__content__tag`)).toHaveText('Beta')
  await expect(page.locator(`${phaseBanner}__text`)).toHaveText('This is a new service. Help us improve it and give your feedback (opens in new tab).')
  await expect(page.locator(`${phaseBanner} .govuk-link`)).toHaveAttribute('href', 'https://defragroup.eu.qualtrics.com/jfe/form/SV_1FcBVO6IMkfHmbs')
}
