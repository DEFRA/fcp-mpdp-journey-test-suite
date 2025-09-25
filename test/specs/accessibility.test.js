import { test, expect } from '@playwright/test'
import { securityTest } from '../security.test.js'
import { accessibilityTest } from '../accessibility.test.js'
import { expectTitle } from '../expect/title.js'
import { expectHeader } from '../expect/common/header.js'
import { expectPhaseBanner } from '../expect/common/phase-banner.js'
import { expectBackLink } from '../expect/back-link.js'
import { expectHeading } from '../expect/heading.js'
import { expectPageUrl } from '../expect/page-url.js'
import { expectRelatedContent } from '../expect/related-content.js'
import { expectFooter } from '../expect/common/footer.js'
import { isAndroid } from '../../utils/devices.js'

test.describe('Accessibility page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/accessibility')
  })

  test('Should display the correct content', async ({ page }, testInfo) => {
    await expectTitle(page, 'Accessibility statement for Find farm and land payment data')
    await expectHeader(page, testInfo)
    await expectPhaseBanner(page, testInfo)
    await expectHeading(page, 'Accessibility statement for Find farm and land payment data')

    const links = [
      { selector: '#tc-link', text: 'Terms and conditions' },
      { selector: '#about-govuk-link', text: 'About GOV.UK' }
    ]

    await expectRelatedContent(page, links)
    await expectFooter(page, testInfo)
  })

  test('Should have a back link that directs to the previous page', async ({ page }, testInfo) => {
    const accessibilityLink = 'a[href="/accessibility"]'

    await page.goto('/')
    await page.click(accessibilityLink)
    await page.waitForURL('/accessibility')

    await expectBackLink(page, testInfo, { expectedPath: '/' })
  })

  test('Internal accessibility contact is directed to the correct email address', async ({ page }, testInfo) => {
    const accessibilityContactEmailAddress = page.locator('#accessibility-contact-email')

    if (!isAndroid(testInfo)) {
      await expect(accessibilityContactEmailAddress).toHaveAttribute('href', 'mailto:morgan.dirodi@defra.gov.uk')
    }
  })

  const links = [
    { reference: 'Equality Advisory and Support Service (EASS)', selector: '#eass-link', url: 'https://www.equalityadvisoryservice.com/' },
    { reference: 'Web Content Accessibility Guidelines (WCAG)', selector: '#wcag-link', url: 'https://www.w3.org/TR/WCAG21/' },
    { reference: 'Terms and conditions', selector: '#tc-link', url: 'https://www.gov.uk/help/terms-conditions' },
    { reference: 'About GOV.UK', selector: '#about-govuk-link', url: 'https://www.gov.uk/help/about-govuk' }
  ]

  for (const { reference, selector, url } of links) {
    test(`${reference} link directs to the correct page`, async ({ page }) => {
      await expectPageUrl(
        page,
        selector,
        url
      )
    })
  }

  test('Should meet WCAG 2.2 AA', async ({ page }) => {
    await accessibilityTest(page)
  })

  test('Should meet security standards', async ({ page }) => {
    await securityTest(page.url())
  })
})
