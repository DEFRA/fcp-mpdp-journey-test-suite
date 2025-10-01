import { test, expect } from '@playwright/test'
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
  })

  test('Should display the correct content', async ({ page }, testInfo) => {
    await expectTitle(page, 'Page not found')
    await expectHeader(page, testInfo)
    await expectPhaseBanner(page, testInfo)
    await expectHeading(page, 'Page not found')
    await expect(page.getByText('If you typed the web address, check it is correct.')).toBeVisible()
    await expect(page.getByText('If you pasted the web address, check you copied the entire address.')).toBeVisible()
    await expectFooter(page, testInfo)
  })

  test('Should meet WCAG 2.2 AA', async ({ page }) => {
    await accessibilityTest(page)
  })

  test('Should meet security standards', async ({ page }) => {
    await securityTest(page.url())
  })
})
