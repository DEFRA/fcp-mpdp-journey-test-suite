import { expect } from '@playwright/test'

export async function expectReportAProblemSection (page) {
  const reportProblemToggle = page.locator('#report-problem')
  await reportProblemToggle.click()

  const moreActionsLinks = [
    {
      text: 'SFI pilot query form',
      selector: '#sfi-query-form',
      href: 'https://www.gov.uk/government/publications/sustainable-farming-incentive-pilot-query-form'
    },
    {
      text: 'Find out about call charges',
      selector: '#call-charges',
      href: 'https://www.gov.uk/call-charges'
    },
    {
      text: 'ruralpayments@defra.gov.uk',
      selector: '#rpa-email',
      href: 'mailto:ruralpayments@defra.gov.uk'
    }
  ]

  for (const { text, selector } of moreActionsLinks) {
    await expect(page.locator(selector)).toContainText(text)
  }

  for (const { selector, href } of moreActionsLinks) {
    const actual = await page.locator(selector).getAttribute('href')
    expect(actual).toBe(href)
  }
}
