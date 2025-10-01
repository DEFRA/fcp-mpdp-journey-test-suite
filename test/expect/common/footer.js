import { expect } from '@playwright/test'

const expectedFooterLinks = [
  'https://www.gov.uk/help/privacy-notice',
  '/cookies',
  '/accessibility',
  'https://www.gov.uk/government/organisations/department-for-environment-food-rural-affairs',
  'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/',
  'https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/'
]

export async function expectFooter (page, testInfo) {
  const footerLinks = page.locator('.govuk-footer__link')
  const count = await footerLinks.count()

  expect(count).toBe(expectedFooterLinks.length)

  for (let i = 0; i < count; i++) {
    const href = await footerLinks.nth(i).getAttribute('href')
    expect(expectedFooterLinks).toContain(href)
  }
}
