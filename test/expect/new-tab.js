import { expect } from '@playwright/test'

export async function expectNewTab (context, link, expectedUrl) {
  const pagePromise = context.waitForEvent('page')
  await link.click()
  const newPage = await pagePromise
  const currentUrl = new URL(newPage.url())
  const normalizedCurrent = currentUrl.href.replace(/\/$/, '')
  const normalizedExpected = expectedUrl.replace(/\/$/, '')
  expect(normalizedCurrent).toBe(normalizedExpected)
}
