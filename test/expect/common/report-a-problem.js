import { expect } from '@playwright/test'
import { isAndroid } from '../../../utils/devices.js'

export async function expectReportAProblemSection (page, testInfo) {
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

  if (!isAndroid(testInfo)) {
    for (const { selector, href } of moreActionsLinks) {
      await expect(page.locator(selector)).toHaveAttribute('href', href)
    }
  }
}
