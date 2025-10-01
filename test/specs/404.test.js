import { test, expect } from '@playwright/test'
import { acceptCookies } from '../../utils/accept-cookies.js'
import { securityTest } from '../security.test.js'
import { accessibilityTest } from '../accessibility.test.js'
import { expectTitle } from '../expect/title.js'
import { expectHeader } from '../expect/common/header.js'
import { expectPhaseBanner } from '../expect/common/phase-banner.js'
import { expectHeading } from '../expect/heading.js'
import { expectFooter } from '../expect/common/footer.js'

test.describe('404 page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/does-not-exist')
    await acceptCookies(page)
  })

  test('Should display the correct content', async ({ page }, testInfo) => {
    await expectTitle(page, 'Page not found')
    await expectHeader(page, testInfo)
    await expectPhaseBanner(page, testInfo)
    await expectHeading(page, 'Page not found')
    await expect(page.locator('p:visible').nth(1)).toContainText('If you typed the web address, check it is correct.')
    await expect(page.locator('p:visible').nth(2)).toContainText('If you pasted the web address, check you copied the entire address.')
    await expectFooter(page, testInfo)
  })

  test('Should meet WCAG 2.2 AA', async ({ page }) => {
    await accessibilityTest(page)
  })

  test('Should meet security standards', async ({ page }) => {
    await securityTest(page.url())
  })
})
