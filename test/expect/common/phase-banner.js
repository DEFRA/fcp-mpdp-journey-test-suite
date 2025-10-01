import { expect } from '@playwright/test'
import { isAndroid } from '../../../utils/devices.js'

export async function expectPhaseBanner (page, testInfo) {
  const phaseBannerSelectors = {
    root: '.govuk-phase-banner',
    contentTag: '.govuk-phase-banner__content__tag',
    text: '.govuk-phase-banner__text',
    link: 'aside .govuk-phase-banner .govuk-link'
  }

  const feedbackUrl = 'https://defragroup.eu.qualtrics.com/jfe/form/SV_1FcBVO6IMkfHmbs'

  await expect(page.locator(phaseBannerSelectors.root)).toHaveCount(1)
  await expect(page.locator(phaseBannerSelectors.contentTag)).toContainText('Beta')
  await expect(page.locator(phaseBannerSelectors.text)).toContainText('This is a new service. Help us improve it and give your feedback (opens in new tab).')

  // skip this check on android as the locator doesn't match correctly on Android.
  if (!isAndroid(testInfo)) {
    await expect(page.locator(phaseBannerSelectors.link)).toHaveAttribute('href', feedbackUrl)
  }

  const pagePromise = page.context().waitForEvent('page')

  await page.locator(phaseBannerSelectors.link).click()

  const newPage = await pagePromise
  const currentUrl = new URL(newPage.url())

  const normalisedCurrentUrl = currentUrl.href.replace(/\/$/, '')
  const normalisedFeedbackUrl = feedbackUrl.replace(/\/$/, '')

  expect(normalisedCurrentUrl).toBe(normalisedFeedbackUrl)
}
