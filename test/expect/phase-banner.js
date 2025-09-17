import { expect } from '@playwright/test'

export async function expectPhaseBanner (page) {
  const phaseBannerSelectors = {
    root: '.govuk-phase-banner',
    contentTag: '.govuk-phase-banner__content__tag',
    text: '.govuk-phase-banner__text',
    link: '.govuk-phase-banner .govuk-link'
  }

  await expect(page.locator(phaseBannerSelectors.root)).toHaveCount(1)
  await expect(page.locator(phaseBannerSelectors.contentTag)).toContainText('Beta')
  await expect(page.locator(phaseBannerSelectors.text)).toContainText('This is a new service. Help us improve it and give your feedback (opens in new tab).')
  await expect(page.locator(phaseBannerSelectors.link)).toHaveAttribute('href', 'https://defragroup.eu.qualtrics.com/jfe/form/SV_1FcBVO6IMkfHmbs')
}
