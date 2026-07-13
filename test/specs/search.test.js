import { test, expect } from '@playwright/test'
import { accessibilityTest } from '../accessibility.test.js'
import { expectTitle } from '../expect/title.js'
import { expectHeader } from '../expect/common/header.js'
import { expectPhaseBanner } from '../expect/common/phase-banner.js'
import { expectBackLink } from '../expect/back-link.js'
import { expectHeading } from '../expect/heading.js'
import { expectSearchBox } from '../expect/search-box.js'
import { expectDownload } from '../expect/download.js'
import { expectRelatedContent } from '../expect/related-content.js'
import { expectFooter } from '../expect/common/footer.js'

test.describe('Search page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/search')
  })

  test('Should display the correct content', async ({ page }, testInfo) => {
    await expectTitle(page, 'Search for an agreement holder')
    await expectHeader(page, testInfo)
    await expectPhaseBanner(page)
    await expectHeading(page, 'Search for an agreement holder')
    await expectSearchBox(page, '#search-input', '')

    const links = [
      { selector: '#fflm-link', text: 'Funding for farmers, growers and land managers' }
    ]

    await expectRelatedContent(page, links)
    await expectFooter(page, testInfo)
  })

  test('Should have a back link that directs to the previous page', async ({ page }, testInfo) => {
    await page.goto('/')
    await page.click('a[href="/search"]')
    await page.waitForURL('/search')

    await expectBackLink(page, testInfo, { expectedPath: '/' })
  })

  test('Download all scheme payment data link should download a .CSV file', async ({ page }) => {
    const downloadLink = page.locator('#download-all-scheme-payment-data-link')

    await expect(downloadLink).toContainText('download all scheme payment data')

    const href = await downloadLink.getAttribute('href')
    expect(href).toBe('/all-scheme-payment-data/file')

    await expectDownload(page, downloadLink, 'ffc-payment-data.csv')
  })

  test('Should meet WCAG 2.2 AA', async ({ page }) => {
    await accessibilityTest(page)
  })
})
