import { expect } from '@playwright/test'

export async function expectNewTab (context, link, expectedUrl) {
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    link.click()
  ])

  await expect(newPage).toHaveURL(expectedUrl)
}
