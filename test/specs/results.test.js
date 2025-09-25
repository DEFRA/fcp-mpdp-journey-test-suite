import { test, expect } from '@playwright/test'
import { securityTest } from '../security.test.js'
import { accessibilityTest } from '../accessibility.test.js'
import { expectTitle } from '../expect/title.js'
import { expectHeader } from '../expect/common/header.js'
import { expectPhaseBanner } from '../expect/common/phase-banner.js'
import { expectBackLink } from '../expect/back-link.js'
import { expectHeading } from '../expect/heading.js'
import { expectSearchBox } from '../expect/search-box.js'
import { expectDownload } from '../expect/download.js'
import { expectFooter } from '../expect/common/footer.js'
import { isAndroid } from '../../utils/devices.js'

test.describe('Results page', () => {
  test.describe('With valid searchString that returns results', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/search')
      await page.fill('#search-input', 'Smith')
      await page.getByRole('button', { name: 'Search' }).click()

      await page.waitForURL(url => {
        const base = new URL(page.url()).origin
        const u = new URL(url.toString(), base)

        return u.pathname === '/results' && u.searchParams.get('searchString') === 'Smith'
      })
    })

    test('Should display the correct content', async ({ page }, testInfo) => {
      await expectTitle(page, 'Results for ‘Smith’')
      await expectHeader(page, testInfo)
      await expectPhaseBanner(page, testInfo)
      await expectHeading(page, 'Results for ‘Smith’')
      await expect(page.locator('p').nth(1)).toContainText('You can search by name and location.')
      await expectSearchBox(page, '#results-search-input', 'Smith', testInfo)
      await expectFooter(page, testInfo)
    })

    test('Should have a back link that directs to the search page', async ({ page }, testInfo) => {
      await expectBackLink(page, testInfo, { expectedPath: '/search' })
    })

    test('Download search results link should download a .CSV file', async ({ page }, testInfo) => {
      await expectDownloadResults(page, testInfo)
    })

    test.describe('Sort By dropdown functionality', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('/results?searchString=Smith&page=1&sortBy=score')
        await page.waitForSelector('#total-results')
      })

      test('Selecting "Payee name" sorts results by payee_name', async ({ page }) => {
        const sortByDropdown = page.locator('#sort-by-dropdown')
        await sortByDropdown.selectOption('payee_name')

        await page.waitForURL(url => {
          const u = new URL(url.toString())
          return u.searchParams.get('sortBy') === 'payee_name'
        })

        const currentURL = new URL(page.url())
        expect(currentURL.searchParams.get('sortBy')).toBe('payee_name')

        const payeeNames = await page.locator('h3 a').allTextContents()
        const sortedNames = [...payeeNames].sort((a, b) => a.localeCompare(b))
        expect(payeeNames).toEqual(sortedNames)
      })
    })

    test('Should meet WCAG 2.2 AA', async ({ page }) => {
      await accessibilityTest(page)
    })

    test('Should meet security standards', async ({ page }) => {
      await securityTest(page.url())
    })
  })

  test.describe('With valid searchString that returns no results', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/search')
      await page.fill('#search-input', '__INVALID_SEARCH_STRING__')
      await page.getByRole('button', { name: 'Search' }).click()

      await page.waitForURL(url => {
        const base = new URL(page.url()).origin
        const u = new URL(url.toString(), base)

        return u.pathname === '/results' && u.searchParams.get('searchString') === '__INVALID_SEARCH_STRING__'
      })
    })

    test('Should display the correct content', async ({ page }, testInfo) => {
      await expectTitle(page, 'We found no results for ‘__INVALID_SEARCH_STRING__’')
      await expectHeader(page, testInfo)
      await expectPhaseBanner(page, testInfo)
      await expectHeading(page, 'We found no results for ‘__INVALID_SEARCH_STRING__’')
      await expect(page.locator('p').nth(1)).toContainText('You can search by name and location.')
      await expect(page.locator('h2').nth(1)).toContainText('There are no matching results.')
      await expectSearchBox(page, '#results-search-input', '__INVALID_SEARCH_STRING__', testInfo)
      await expectFooter(page, testInfo)
    })

    test('Should have a back link that directs to the search page', async ({ page }, testInfo) => {
      await expectBackLink(page, testInfo, { expectedPath: '/search' })
    })

    test('Download all scheme payment data link should download a .CSV file', async ({ page }, testInfo) => {
      await expectDownloadAll(page, testInfo)
    })

    test('Should meet WCAG 2.2 AA', async ({ page }) => {
      await accessibilityTest(page)
    })
  })

  test.describe('Error on invalid search query', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/search')
      await page.getByRole('button', { name: 'Search' }).click()
      await page.locator('.govuk-error-summary').first().waitFor({ state: 'visible' })
    })

    test('Should display the correct content', async ({ page }, testInfo) => {
      const errorSummary = page.locator('.govuk-error-summary')
      await expect(errorSummary).toBeVisible()
      await expect(errorSummary.locator('h2')).toContainText('There is a problem')
      await expect(errorSummary.locator('ul li')).toContainText('Enter a name or location')

      await expectTitle(page, 'Error: Search for an agreement holder')

      if (!isAndroid(testInfo)) {
        const resultsSection = page.locator('#total-results')
        await expect(resultsSection).toHaveCount(0)
      }
    })

    test('Should display the back link that navigates to search page', async ({ page }, testInfo) => {
      await expectBackLink(page, testInfo, { expectedPath: '/search' })
    })

    test('Should meet WCAG 2.2 AA', async ({ page }) => {
      await accessibilityTest(page)
    })
  })
})

async function expectDownloadResults (page, testInfo) {
  const downloadLink = page.locator('#download-results-link')

  await expect(downloadLink).toContainText(/Download \d+ results \(\.CSV\)/)

  if (!isAndroid(testInfo)) {
    await expect(downloadLink).toHaveAttribute('href', '/results/file?searchString=Smith&sortBy=score')
  }

  await expectDownload(page, downloadLink, 'ffc-payment-results.csv', testInfo)
}

async function expectDownloadAll (page, testInfo) {
  const downloadLink = page.locator('#download-all-scheme-payment-data-link')

  await expect(downloadLink).toContainText('download all scheme payment data (4.7MB)')

  if (!isAndroid(testInfo)) {
    await expect(downloadLink).toHaveAttribute('href', '/all-scheme-payment-data/file')
  }

  await expectDownload(page, downloadLink, 'ffc-payment-data.csv', testInfo)
}
