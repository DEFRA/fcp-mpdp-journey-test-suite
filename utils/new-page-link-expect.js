import { expect } from '@playwright/test'

export async function expectNewPageLink (context, link, expectedUrl) {
  const pagePromise = context.waitForEvent('page')

  await link.click()

  const newPage = await pagePromise
  await newPage.waitForLoadState()

  expect(newPage.url()).toBe(expectedUrl)

  await newPage.close()
}
