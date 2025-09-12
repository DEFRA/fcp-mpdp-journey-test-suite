import { test, expect } from '@playwright/test'
import { securityTest } from '../security.test.js'
import { accessibilityTest } from '../accessibility.test.js'
import { expectPhaseBanner } from '../../utils/phase-banner-expect.js'
import { expectNewTab } from '../../utils/new-tab-expect.js'
import { expectRelatedContent } from '../../utils/related-content-expect.js'

test.describe('Accessibility page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/accessibility')
  })

  test('Should display the correct title', async ({ page }) => {
    const title = await page.title()
    expect(title).toBe('Accessibility statement for Find Farm and Land Payment Data - Find farm and land payment data - GOV.UK')
  })

  test('Should display the correct heading', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Accessibility statement for Find Farm and Land Payment Data')
  })

  test('Should have a back link that directs to the previous page', async ({ page }) => {
    const accessibilityLink = 'a[href="/accessibility"]'
    const backLink = page.locator('#back-link')
    const url = new URL('/', page.url()).href

    await page.goto('/')
    await page.click(accessibilityLink)
    await page.waitForURL('/accessibility')

    const currentUrl = new URL(page.url())
    expect(currentUrl.pathname).toBe('/accessibility')

    await expect(backLink).toHaveText('Back')
    await expect(backLink).toHaveAttribute('href', url)
  })

  test('Should display the correct phase banner', async ({ page, context }) => {
    await expectPhaseBanner({ page })

    await expectNewTab(
      context,
      page.locator('.govuk-phase-banner .govuk-link'),
      'https://defragroup.eu.qualtrics.com/jfe/form/SV_1FcBVO6IMkfHmbs'
    )
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

  test.describe('Related Content', () => {
    test('Related Content section contains correct information', async ({ page }) => {
      const links = [
        { selector: '#tc-link', text: 'Terms and conditions' },
        { selector: '#about-govuk-link', text: 'About GOV.UK' }
      ]

      await expectRelatedContent({ page, links })
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
  })

  test('Should meet WCAG 2.2 AA', async ({ page }) => {
    await accessibilityTest(page)
  })

  test('Should meet security standards', async ({ page }) => {
    await securityTest(page.url())
  })
})
