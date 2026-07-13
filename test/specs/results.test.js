import { test, expect } from '@playwright/test'
import { accessibilityTest } from '../accessibility.test.js'
import { expectTitle } from '../expect/title.js'
import { expectHeader } from '../expect/common/header.js'
import { expectPhaseBanner } from '../expect/common/phase-banner.js'
import { expectBackLink } from '../expect/back-link.js'
import { expectHeading } from '../expect/heading.js'
import { expectSearchBox } from '../expect/search-box.js'
import { expectDownload } from '../expect/download.js'
import { expectFooter } from '../expect/common/footer.js'

test.describe('Results page', () => {
  test.describe('With valid searchString that returns results', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/search')
      await page.fill('#search-input', 'Sons')
      await page.getByRole('button', { name: 'Search' }).click()

      await page.waitForURL(url => {
        const base = new URL(page.url()).origin
        const u = new URL(url.toString(), base)

        return u.pathname === '/results' && u.searchParams.get('searchString') === 'Sons'
      })
    })

    test('Should display the correct content', async ({ page }, testInfo) => {
      await expectTitle(page, 'Results for ‘Sons’')
      await expectHeader(page, testInfo)
      await expectPhaseBanner(page)
      await expectHeading(page, 'Results for ‘Sons’')
      await expect(page.getByText('You can search by name and location.')).toBeVisible()
      await expectSearchBox(page, '#results-search-input', 'Sons')
      await expectFooter(page, testInfo)
    })

    test('Should have a back link that directs to the search page', async ({ page }, testInfo) => {
      await expectBackLink(page, testInfo, { expectedPath: '/search' })
    })

    test('Download search results link should download a .CSV file', async ({ page }) => {
      await expectDownloadResults(page)
    })

    test.describe('Sort By dropdown functionality', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('/results?searchString=Sons&page=1&sortBy=score')
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
        const sortedNames = [...payeeNames].sort((a, b) => (a > b ? 1 : -1))
        expect(payeeNames).toEqual(sortedNames)
      })
    })

    test('Should meet WCAG 2.2 AA', async ({ page }) => {
      await accessibilityTest(page)
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
      await expectPhaseBanner(page)
      await expectHeading(page, 'We found no results for ‘__INVALID_SEARCH_STRING__’')
      await expect(page.getByText('You can search by name and location.')).toBeVisible()
      await expect(page.getByRole('heading', { level: 2, name: 'There are no matching results.' })).toBeVisible()
      await expectSearchBox(page, '#results-search-input', '__INVALID_SEARCH_STRING__')
      await expectFooter(page, testInfo)
    })

    test('Should have a back link that directs to the search page', async ({ page }, testInfo) => {
      await expectBackLink(page, testInfo, { expectedPath: '/search' })
    })

    test('Download all scheme payment data link should download a .CSV file', async ({ page }) => {
      await expectDownloadAll(page)
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

      await expectTitle(page, 'Search for an agreement holder')

      const resultsCount = await page.locator('#total-results').count()
      expect(resultsCount).toBe(0)
    })

    test('Should display the back link that navigates to the previous page', async ({ page }, testInfo) => {
      await expectBackLink(page, testInfo, { expectedPath: '/' })
    })

    test('Should meet WCAG 2.2 AA', async ({ page }) => {
      await accessibilityTest(page)
    })
  })
})

async function expectDownloadResults (page) {
  const downloadLink = page.locator('#download-results-link')

  await expect(downloadLink).toContainText(/Download \d+ results \(\.CSV\)/)

  const href = await downloadLink.getAttribute('href')
  expect(href).toBe('/results/file?searchString=Sons&sortBy=score')

  await expectDownload(page, downloadLink, 'ffc-payment-results.csv')
}

async function expectDownloadAll (page) {
  const downloadLink = page.locator('#download-all-scheme-payment-data-link')

  await expect(downloadLink).toContainText('download all scheme payment data')

  const href = await downloadLink.getAttribute('href')
  expect(href).toBe('/all-scheme-payment-data/file')

  await expectDownload(page, downloadLink, 'ffc-payment-data.csv')
}
