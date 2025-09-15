import { test, expect } from '@playwright/test'
import { securityTest } from '../security.test.js'
import { accessibilityTest } from '../accessibility.test.js'
import { expectPhaseBanner } from '../../utils/phase-banner-expect.js'
import { expectNewTab } from '../../utils/new-tab-expect.js'
import { expectRelatedContent } from '../../utils/related-content-expect.js'

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

    test('Should display the correct title', async ({ page }) => {
      const title = await page.title()
      expect(title).toBe('Results for ‘Smith’ - Find farm and land payment data - GOV.UK')
    })

    test('Should display the correct heading and subheading', async ({ page }) => {
      await expect(page.locator('h1')).toHaveText('Results for ‘Smith’')
      await expect(page.locator('p').nth(1)).toHaveText('You can search by name and location.')
    })

    test('Should display the correct phase banner', async ({ page, context }) => {
      await expectPhaseBanner({ page })

      await expectNewTab(
        context,
        page.locator('.govuk-phase-banner .govuk-link'),
        'https://defragroup.eu.qualtrics.com/jfe/form/SV_1FcBVO6IMkfHmbs'
      )
    })

    test('Should have a back link that directs to the search page', async ({ page }) => {
      const backLink = page.locator('#back-link')

      await expect(backLink).toHaveText('Back')
      await expect(backLink).toHaveAttribute('href', '/search')

      await backLink.click()
      const currentUrl = new URL(page.url())
      expect(currentUrl.pathname).toBe('/search')
    })

    test('Download search results link should download a .CSV file', async ({ page }) => {
      const downloadLink = page.locator('#download-results-link')

      await expect(downloadLink).toHaveAttribute('href', '#')

      await downloadLink.click()
      const currentUrl = new URL(page.url())

      expect(currentUrl.pathname).toBe('/results')
    })

    test('Should render search box', async ({ page }) => {
      const searchBox = page.locator('#results-search-input')
      const searchButton = page.locator('.govuk-button')

      await expect(searchButton).toBeVisible()
      await expect(searchBox).toBeVisible()
      await expect(searchBox).toHaveValue('Smith')
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

    test('Should display the correct title', async ({ page }) => {
      const title = await page.title()
      expect(title).toBe('We found no results for ‘__INVALID_SEARCH_STRING__’ - Find farm and land payment data - GOV.UK')
    })

    test('Should display the correct heading and subheading(s)', async ({ page }) => {
      await expect(page.locator('h1')).toHaveText('We found no results for ‘__INVALID_SEARCH_STRING__’')
      await expect(page.locator('p').nth(1)).toHaveText('You can search by name and location.')
      await expect(page.locator('h2').nth(1)).toHaveText('There are no matching results.')
    })

    test('Should display the correct phase banner', async ({ page, context }) => {
      await expectPhaseBanner({ page })

      await expectNewTab(
        context,
        page.locator('.govuk-phase-banner .govuk-link'),
        'https://defragroup.eu.qualtrics.com/jfe/form/SV_1FcBVO6IMkfHmbs'
      )
    })

    test('Should have a back link that directs to the search page', async ({ page }) => {
      const backLink = page.locator('#back-link')

      await expect(backLink).toHaveText('Back')
      await expect(backLink).toHaveAttribute('href', '/search')

      await backLink.click()
      const currentUrl = new URL(page.url())
      expect(currentUrl.pathname).toBe('/search')
    })

    test('Download all scheme payment data link should download a .CSV file', async ({ page }) => {
      const downloadLink = page.locator('#download-all-scheme-payment-data-link')

      await expect(downloadLink).toHaveText('download all scheme payment data (.CSV, 3MB)')
      await expect(downloadLink).toHaveAttribute('href', '/all-scheme-payment-data/file')

      const [download] = await Promise.all([
        page.waitForEvent('download'),
        downloadLink.click()
      ])

      const filename = download.suggestedFilename()

      expect(filename).toBe('ffc-payment-data.csv')
    })

    test('Should render search box', async ({ page }) => {
      const searchBox = page.locator('#results-search-input')
      const searchButton = page.locator('.govuk-button')

      await expect(searchButton).toBeVisible()
      await expect(searchBox).toBeVisible()
      await expect(searchBox).toHaveValue('__INVALID_SEARCH_STRING__')
    })

    test('Should meet WCAG 2.2 AA', async ({ page }) => {
      await accessibilityTest(page)
    })

    test('Should meet security standards', async ({ page }) => {
      await securityTest(page.url())
    })
  })

  test.describe('Error on invalid search query', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/search')
      await page.getByRole('button', { name: 'Search' }).click()
      await page.locator('.govuk-error-summary').first().waitFor({ state: 'visible' })
    })

    test('Should display the error summary', async ({ page }) => {
      const errorSummary = page.locator('.govuk-error-summary')
      await expect(errorSummary).toBeVisible()
      await expect(errorSummary.locator('h2')).toHaveText('There is a problem')
      await expect(errorSummary.locator('ul li')).toHaveText('Enter a name or location')
    })

    test('Should display the correct title with "Error:"', async ({ page }) => {
      const title = await page.title()
      expect(title).toBe('Error: Search for an agreement holder - Find farm and land payment data - GOV.UK')
    })

    test('Should display the back link that navigates to search page', async ({ page }) => {
      const backLink = page.locator('#back-link')
      await expect(backLink).toBeVisible()
      await expect(backLink).toHaveText('Back')

      await backLink.click()
      const currentUrl = new URL(page.url())
      expect(currentUrl.pathname).toBe('/search')
    })

    test('Should not show any results', async ({ page }) => {
      const resultsSection = page.locator('#total-results')
      await expect(resultsSection).toHaveCount(0)
    })

    test.describe('Related Content', () => {
      test('Related Content section contains correct information', async ({ page }) => {
        const links = [
          { selector: '#fflm-link', text: 'Funding for farmers, growers and land managers' }
        ]

        await expectRelatedContent({ page, links })
      })

      test('Funding for farmers, growers and land managers directs to the correct page', async ({ page, context }) => {
        await expectNewTab(
          context,
          page.locator('#fflm-link'),
          'https://www.gov.uk/guidance/funding-for-farmers'
        )
      })

      test('Should meet WCAG 2.2 AA', async ({ page }) => {
        await accessibilityTest(page)
      })

      test('Should meet security standards', async ({ page }) => {
        await securityTest(page.url())
      })
    })
  })
})
