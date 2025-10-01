import { test } from '@playwright/test'
import { securityTest } from '../security.test.js'
import { accessibilityTest } from '../accessibility.test.js'
import { expectTitle } from '../expect/title.js'
import { expectHeader } from '../expect/common/header.js'
import { expectPhaseBanner } from '../expect/common/phase-banner.js'
import { expectHeading } from '../expect/heading.js'
import { expectFooter } from '../expect/common/footer.js'

test.describe('Cookies page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cookies')
  })

  test('Should display the correct content', ({ page }, testInfo) => {
    expectTitle(page, 'Cookies')
    expectHeader(page, testInfo)
    expectPhaseBanner(page, testInfo)
    expectHeading(page, 'Cookies')
    expectFooter(page, testInfo)
  })

  test('Should meet WCAG 2.2 AA', async ({ page }) => {
    await accessibilityTest(page)
  })

  test('Should meet security standards', async ({ page }) => {
    await securityTest(page.url())
  })
})

// async function acceptCookies (page) {
//   const cookiesBanner = page.locator('.js-cookies-banner')

//   if (cookiesBanner.isVisible()) {
//     await page.getByRole('button', { name: 'Accept analytics cookies' }).click()

//     const acceptedCookiesBanner = page.locator('.js-cookies-accepted')
//     await acceptedCookiesBanner.waitFor({ state: 'visible' })

//     await acceptedCookiesBanner.getByRole('button', { name: 'Hide this message' }).click()

//     await cookiesBanner.waitFor({ state: 'hidden' })
//   }
// }
