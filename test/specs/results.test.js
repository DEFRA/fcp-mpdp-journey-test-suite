import { test, expect } from '@playwright/test'
import { securityTest } from '../security.test.js'
import { accessibilityTest } from '../accessibility.test.js'
import { expectPhaseBanner } from '../expect/phase-banner.js'
import { expectHeader } from '../expect/header.js'
import { expectTitle } from '../expect/title.js'

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

    test('Should display the correct content', async ({ page }) => {
      await expectTitle(page, 'Results for ‘Smith’ - Find farm and land payment data - GOV.UK')
      await expectPhaseBanner(page)
      await expectHeader(page, 'Results for ‘Smith’')
      await expect(page.locator('p').nth(1)).toHaveText('You can search by name and location.')
      await expectSearchBox(page, 'Smith')
    })

    test('Should have a back link that directs to the search page', async ({ page }) => {
      await expectBackLink(page)
    })

    test('Download search results link should download a .CSV file', async ({ page }) => {
      await expectDownloadResults(page)
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

    test('Should display the correct content', async ({ page }) => {
      await expectTitle(page, 'We found no results for ‘__INVALID_SEARCH_STRING__’ - Find farm and land payment data - GOV.UK')
      await expectPhaseBanner(page)
      await expectHeader(page, 'We found no results for ‘__INVALID_SEARCH_STRING__’')
      await expect(page.locator('p').nth(1)).toHaveText('You can search by name and location.')
      await expect(page.locator('h2').nth(1)).toHaveText('There are no matching results.')
      await expectSearchBox(page, '__INVALID_SEARCH_STRING__')
    })

    test('Should have a back link that directs to the search page', async ({ page }) => {
      await expectBackLink(page)
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

    test('Should display the correct content', async ({ page }) => {
      const errorSummary = page.locator('.govuk-error-summary')
      await expect(errorSummary).toBeVisible()
      await expect(errorSummary.locator('h2')).toHaveText('There is a problem')
      await expect(errorSummary.locator('ul li')).toHaveText('Enter a name or location')

      await expectTitle(page, 'Error: Search for an agreement holder - Find farm and land payment data - GOV.UK')

      const resultsSection = page.locator('#total-results')
      await expect(resultsSection).toHaveCount(0)
    })

    test('Should display the back link that navigates to search page', async ({ page }) => {
      await expectBackLink(page)
    })

    test('Should meet WCAG 2.2 AA', async ({ page }) => {
      await accessibilityTest(page)
    })
  })
})

async function expectSearchBox (page, placeholder) {
  const searchBox = page.locator('#results-search-input')
  const searchButton = page.locator('.govuk-button')

  await expect(searchButton).toBeVisible()
  await expect(searchBox).toBeVisible()
  await expect(searchBox).toHaveValue(placeholder)
}

async function expectBackLink (page) {
  const backLink = page.locator('#back-link')

  await expect(backLink).toHaveText('Back')
  await expect(backLink).toHaveAttribute('href', expect.stringContaining('/search'))

  await backLink.click()
  const currentUrl = new URL(page.url())
  expect(currentUrl.pathname).toBe('/search')
}

async function expectDownloadResults (page) {
  const downloadLink = page.locator('#download-results-link')

  await expect(downloadLink).toHaveText(/Download \d+ results \(\.CSV\)/)
  await expect(downloadLink).toHaveAttribute('href', '/results/file?searchString=Smith&sortBy=score')

  const downloadPromise = page.waitForEvent('download')
  await downloadLink.click()
  const download = await downloadPromise

  const filename = download.suggestedFilename()

  expect(filename).toBe('ffc-payment-results.csv')
}

async function expectDownloadAll (page) {
  const downloadLink = page.locator('#download-all-scheme-payment-data-link')

  await expect(downloadLink).toHaveText('download all scheme payment data (4.7MB)')
  await expect(downloadLink).toHaveAttribute('href', '/all-scheme-payment-data/file')

  const downloadPromise = page.waitForEvent('download')
  await downloadLink.click()
  const download = await downloadPromise

  const filename = download.suggestedFilename()

  expect(filename).toBe('ffc-payment-data.csv')
}
