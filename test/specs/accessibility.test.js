import { test, expect } from '@playwright/test'
import { securityTest } from '../security.test.js'
import { accessibilityTest } from '../accessibility.test.js'
import { expectPhaseBanner } from '../expect/phase-banner.js'
import { expectNewTab } from '../expect/new-tab.js'
import { expectRelatedContent } from '../expect/related-content.js'
import { expectTitle } from '../expect/title.js'
import { expectHeader } from '../expect/header.js'
import { isAndroid } from '../../utils/devices.js'

test.describe('Accessibility page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/accessibility')
  })

  test('Should display the correct content', async ({ page }, testInfo) => {
    await expectTitle(page, 'Accessibility statement for Find farm and land payment data - Find farm and land payment data - GOV.UK')
    await expectPhaseBanner(page, testInfo)
    await expectHeader(page, 'Accessibility statement for Find farm and land payment data')

    const links = [
      { selector: '#tc-link', text: 'Terms and conditions' },
      { selector: '#about-govuk-link', text: 'About GOV.UK' }
    ]

    await expectRelatedContent(page, links)
  })

  test('Should have a back link that directs to the previous page', async ({ page }, testInfo) => {
    const accessibilityLink = 'a[href="/accessibility"]'
    const backLink = page.locator('#back-link')
    const url = new URL('/', page.url()).href

    await page.goto('/')
    await page.click(accessibilityLink)
    await page.waitForURL('/accessibility')

    const currentUrl = new URL(page.url())
    expect(currentUrl.pathname).toBe('/accessibility')

    await expect(backLink).toContainText('Back')

    if (!isAndroid(testInfo)) {
      await expect(backLink).toHaveAttribute('href', url)
    }
  })

  test('Internal accessibility contact is directed to the correct email address', async ({ page }, testInfo) => {
    const accessibilityContactEmailAddress = page.locator('#accessibility-contact-email')

    if (!isAndroid(testInfo)) {
      await expect(accessibilityContactEmailAddress).toHaveAttribute('href', 'mailto:morgan.dirodi@defra.gov.uk')
    }
  })

  test('Equality Advisory and Support Service link directs to the correct page', async ({ page, context }) => {
    await expectNewTab(
      context,
      page.locator('#eass-link'),
      'https://www.equalityadvisoryservice.com'
    )
  })

  test('Web Content Accessibility Guidelines link directs to the correct page', async ({ page, context }) => {
    await expectNewTab(
      context,
      page.locator('#wcag-link'),
      'https://www.w3.org/TR/WCAG21/'
    )
  })

  test('Terms and conditions link directs to the correct page', async ({ context, page }) => {
    await expectNewTab(
      context,
      page.locator('#tc-link'),
      'https://www.gov.uk/help/terms-conditions'
    )
  })

  test('About GOV.UK link directs to the correct page', async ({ context, page }) => {
    await expectNewTab(
      context,
      page.locator('#about-govuk-link'),
      'https://www.gov.uk/help/about-govuk'
    )
  })

  test('Should meet WCAG 2.2 AA', async ({ page }) => {
    await accessibilityTest(page)
  })

  test('Should meet security standards', async ({ page }) => {
    await securityTest(page.url())
  })
})
