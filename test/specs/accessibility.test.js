import { test, expect } from '@playwright/test'
import { expectNewPageLink } from '../../utils/new-page-link-expect.js'
import { expectPhaseBanner } from '../../utils/phase-banner-expect.js'

test.describe('Accessibility page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/accessibility')
  })

  test('Should display the correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Accessibility statement for Find Farm and Land Payment Data - Find farm and land payment data - GOV.UK')
  })

  test('Should display the correct heading', async ({ page }) => {
    await expect(page.locator('h1').toHaveTest('Accessibility statement for Find Farm and Land Payment Data'))
  })

  test('Should have a back link that directs to the previous page', async ({ page }) => {
    const backLink = page.locator('#back-link')

    await expect(backLink).toHaveText('Back')
    await expect(backLink).toHaveAttribute('href', '{{ referer }}')
  })

  test('Should display the correct phase banner', async ({ page, context }) => {
    await expectPhaseBanner({ page })

    await expectNewPageLink(
      context,
      page.locator('.govuk-phase-banner .govuk-link'),
      'https://defragroup.eu.qualtrics.com/jfe/form/SV_1FcBVO6IMkfHmbs'
    )
  })
})
