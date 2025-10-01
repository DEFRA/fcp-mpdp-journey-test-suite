import { test, expect } from '@playwright/test'
import { testPayment } from '../../utils/test-payment.js'
import { accessibilityTest } from '../accessibility.test.js'
import { securityTest } from '../security.test.js'
import { expectTitle } from '../expect/title.js'
import { expectHeader } from '../expect/common/header.js'
import { expectPhaseBanner } from '../expect/common/phase-banner.js'
import { expectBackLink } from '../expect/back-link.js'
import { expectHeading } from '../expect/heading.js'
import { expectDownload } from '../expect/download.js'
import { expectReportAProblemSection } from '../expect/common/report-a-problem.js'
import { expectMoreActionsSection } from '../expect/common/more-actions.js'
import { expectRelatedContent } from '../expect/related-content.js'
import { expectFooter } from '../expect/common/footer.js'
import { isAndroid } from '../../utils/devices.js'

test.describe('Details page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/details?payeeName=Feeney%20and%20Sons&partPostcode=GO15&searchString=Sons&page=1')
  })

  test('Should display the correct content', async ({ page }, testInfo) => {
    await expectTitle(page, `${testPayment.payeeName}`)
    await expectHeader(page, testInfo)
    await expectPhaseBanner(page, testInfo)
    await expectHeading(page, `${testPayment.payeeName}`)
    await expectReportAProblemSection(page, testInfo)
    await expectMoreActionsSection(page, testInfo)

    const links = [
      { selector: '#fflm-link', text: 'Funding for farmers, growers and land managers' }
    ]

    await expectRelatedContent(page, links)
    await expectFooter(page, testInfo)

    const totalSchemes = await page.locator('#total-schemes').innerText()
    const totalAmount = await page.locator('#mpdp-summary-panel p.govuk-heading-m').innerText()
    const dateRange = await page.locator('#date-range').innerText()

    expect(totalSchemes).toBe('Payments from 1 schemes')
    expect(totalAmount).toBe(`£${testPayment.readableTotal}`)
    expect(dateRange).toBe(`1 April ${testPayment.startYear} to 31 March ${testPayment.endYear}`)
  })

  test('Should have a back link that directs to the results page', async ({ page }, testInfo) => {
    await expectBackLink(page, testInfo, {
      expectedPath: '/results',
      expectedSearchParams: { searchString: 'Sons', page: '1' },
      expectedText: 'Back to results'
    })
  })

  test('Download details link should download a .CSV file', async ({ page }, testInfo) => {
    const downloadLink = page.locator('#download-details-link')

    await expect(downloadLink).toContainText('Download this data (.CSV)')

    if (!isAndroid(testInfo)) {
      await expect(downloadLink).toHaveAttribute('href', '/details/file?payeeName=Feeney%20and%20Sons&partPostcode=GO15')
    }

    await expectDownload(page, downloadLink, 'ffc-payment-details.csv', testInfo)
  })

  test('Should meet WCAG 2.2 AA', async ({ page }) => {
    await accessibilityTest(page)
  })

  test('Should meet security standards', async ({ page }) => {
    await securityTest(page.url())
  })
})
