import { expect } from '@playwright/test'

export async function expectBackLink (
  page,
  testInfo,
  {
    expectedPath,
    expectedSearchParams = {},
    expectedText = 'Back',
    assertRedirect = true
  }
) {
  const backLink = page.locator('#back-link')

  await expect(backLink).toContainText(expectedText)

  const href = await backLink.getAttribute('href')
  expect(href).toContain(expectedPath)

  if (assertRedirect) {
    await backLink.click()
    const currentUrl = new URL(page.url())

    expect(currentUrl.pathname).toBe(expectedPath)

    for (const [searchParams, value] of Object.entries(expectedSearchParams)) {
      expect(currentUrl.searchParams.get(searchParams)).toBe(value)
    }
  }
}
