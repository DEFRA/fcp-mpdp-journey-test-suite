import { test, expect } from '@playwright/test'
import { securityTest } from '../security.test.js'
import { accessibilityTest } from '../accessibility.test.js'
import { expectTitle } from '../expect/title.js'
import { expectHeader } from '../expect/common/header.js'
import { expectPhaseBanner } from '../expect/common/phase-banner.js'
import { expectHeading } from '../expect/heading.js'
import { expectFooter } from '../expect/common/footer.js'
import { isAndroid } from '../../utils/devices.js'

test.describe('Cookies page and banner', () => {
  test.describe('Cookies page renders expected content', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/cookies')
    })

    test('Should display the correct content', async ({ page }, testInfo) => {
      await expectTitle(page, 'Cookies')
      await expectHeader(page, testInfo)
      await expectPhaseBanner(page, testInfo)
      await expectHeading(page, 'Cookies')
      await expectFooter(page, testInfo)
    })

    test('Should successfully change cookie settings to "Yes" via radio buttons on cookies page', async ({ page }) => {
      await expectUpdatedCookiePreferences(page, 'Yes')
    })

    test('Should successfully change cookie settings to "No" via radio buttons on cookies page', async ({ page }) => {
      await expectUpdatedCookiePreferences(page, 'No')
    })

    test('Should meet WCAG 2.2 AA', async ({ page }) => {
      await accessibilityTest(page)
    })

    test('Should meet security standards', async ({ page }) => {
      await securityTest(page.url())
    })
  })

  test.describe('Cookies banner behaves as expected', () => {
    test.beforeEach(async ({ page }) => {
      await page.context().clearCookies()
      await page.goto('/cookies')
    })

    test('Cookies banner displays correct message and is hidden after accepting analytics cookies', async ({ page }, testInfo) => {
      const cookiesBanner = page.locator('.js-cookies-banner')
      await acceptCookies(page, cookiesBanner)

      if (!isAndroid(testInfo)) {
        await expect(cookiesBanner).toBeHidden()
      }
    })

    test('Cookies banner displays the correct message and is hidden after rejecting analytics cookies', async ({ page }, testInfo) => {
      const cookiesBanner = page.locator('.js-cookies-banner')
      await rejectCookies(page, cookiesBanner)

      if (!isAndroid(testInfo)) {
        await expect(cookiesBanner).toBeHidden()
      }
    })
  })
})

async function acceptCookies (page, cookiesBanner) {
  if (await cookiesBanner.isVisible()) {
    await page.getByRole('button', { name: 'Accept analytics cookies' }).click()

    const acceptedCookiesBanner = page.locator('.js-cookies-accepted')
    await acceptedCookiesBanner.waitFor({ state: 'visible' })

    await acceptedCookiesBanner.getByRole('button', { name: 'Hide this message' }).click()

    await cookiesBanner.waitFor({ state: 'hidden' })
  }
}

async function rejectCookies (page, cookiesBanner) {
  if (await cookiesBanner.isVisible()) {
    await page.getByRole('button', { name: 'Reject analytics cookies' }).click()

    const rejectedCookiesBanner = page.locator('.js-cookies-rejected')
    await rejectedCookiesBanner.waitFor({ state: 'visible' })

    await rejectedCookiesBanner.getByRole('button', { name: 'Hide this message' }).click()

    await cookiesBanner.waitFor({ state: 'hidden' })
  }
}

async function expectUpdatedCookiePreferences (page, choice) {
  await page.getByLabel(choice).check()

  await page.getByRole('button', { name: 'Save cookie settings' }).click()

  await expect(page.locator('.govuk-notification-banner')).toBeVisible()
  await expect(page.locator('.govuk-notification-banner__heading')).toContainText('You\'ve set your cookie preferences.')

  const cookies = await page.context().cookies()
  const analyticsCookies = cookies.find(c => c.name === 'fcp_mpdp_cookie_policy')

  expect(analyticsCookies).toBeDefined()
}
