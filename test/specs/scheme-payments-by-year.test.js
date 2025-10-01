import { test, expect } from '@playwright/test'
import { acceptCookies } from '../../utils/accept-cookies.js'
import { accessibilityTest } from '../accessibility.test.js'
import { securityTest } from '../security.test.js'
import { expectTitle } from '../expect/title.js'
import { expectPhaseBanner } from '../expect/common/phase-banner.js'
import { expectBackLink } from '../expect/back-link.js'
import { expectHeading } from '../expect/heading.js'
import { expectDownload } from '../expect/download.js'
import { expectReportAProblemSection } from '../expect/common/report-a-problem.js'
import { expectMoreActionsSection } from '../expect/common/more-actions.js'
import { expectRelatedContent } from '../expect/related-content.js'
import { expectFooter } from '../expect/common/footer.js'
import { isAndroid } from '../../utils/devices.js'

test.describe('Scheme payments by year page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/scheme-payments-by-year')
    await acceptCookies(page)
  })

  test('Should display the correct content', async ({ page }, testInfo) => {
    await expectTitle(page, 'Scheme payments by year')
    await expectPhaseBanner(page, testInfo)
    await expectHeading(page, 'Scheme payments by year')
    await expect(page.locator('#subtitle')).toContainText('We publish some scheme payments as a total for each financial year.')
    await expectReportAProblemSection(page, testInfo)
    await expectMoreActionsSection(page, testInfo)

    const links = [
      { selector: '#fflm-link', text: 'Funding for farmers, growers and land managers' }
    ]

    await expectRelatedContent(page, links)
    await expectFooter(page, testInfo)
  })

  test('Should have a back link that directs to the start page', async ({ page }, testInfo) => {
    await expectBackLink(page, testInfo, {
      expectedPath: '/',
    })
  })

  test('Download scheme payments by year link should download a .CSV file', async ({ page }, testInfo) => {
    const downloadLink = page.locator('#download-scheme-payments-by-year-link')

    await expect(downloadLink).toContainText('Download this data (.CSV)')

    if (!isAndroid(testInfo)) {
      await expect(downloadLink).toHaveAttribute('href', '/scheme-payments-by-year/file')
    }

    await expectDownload(page, downloadLink, 'ffc-payments-by-year.csv', testInfo)
  })

  test('Should meet WCAG 2.2 AA', async ({ page }) => {
    await accessibilityTest(page)
  })

  test('Should meet security standards', async ({ page }) => {
    await securityTest(page.url())
  })
})
