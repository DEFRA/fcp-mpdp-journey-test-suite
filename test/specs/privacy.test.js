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

test.describe('Privacy page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/privacy')
  })

  test('Should display the correct content', async ({ page }, testInfo) => {
    await expectTitle(page, 'Privacy notice')
    await expectHeader(page, testInfo)
    await expectPhaseBanner(page, testInfo)
    await expectHeading(page, 'Privacy notice')

    const links = [
      { selector: '#cookies-link', text: 'Cookies' },
      { selector: '#tc-link', text: 'Terms and conditions' }
    ]

    await expectRelatedContent(page, links)
    await expectFooter(page, testInfo)
  })

  test('Should have a back link that directs to the previous page', async ({ page }, testInfo) => {
    const privacyLink = 'a[href="/privacy"]'

    await page.goto('/')
    await page.click(privacyLink)
    await page.waitForURL('/privacy')

    await expectBackLink(page, testInfo, { expectedPath: '/' })
  })

  test('Defra helpline contact is directed to the correct email address', async ({ page }, testInfo) => {
    const defraHelplineEmailAddress = page.locator('#defra-helpline-email')

    if (!isAndroid(testInfo)) {
      await expect(defraHelplineEmailAddress).toHaveAttribute('href', 'mailto:defra.helpline@defra.gov.uk')
    }
  })

  const links = [
    { reference: 'GOV.UK homepage', selector: '#govuk-homepage-link', url: 'https://www.gov.uk/' },
    { reference: 'personal information charter', selector: '#charter-link', url: 'https://www.gov.uk/government/organisations/department-for-environment-food-rural-affairs/about/personal-information-charter' },
    { reference: 'cookies homepage', selector: '#cookies-homepage-link', url: 'https://www.gov.uk/help/cookies' },
    { reference: 'web browser', selector: '#browsers-link', url: 'https://www.gov.uk/help/browsers' },
    { reference: 'European Economic Area (EEA)', selector: '#eea-link', url: 'https://www.gov.uk/eu-eea' }
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
