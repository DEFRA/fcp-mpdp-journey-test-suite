import { expect } from '@playwright/test'

export async function expectDownload (page, link, expectedFilename) {
  const href = await link.getAttribute('href')
  const response = await page.request.get(href)

  expect(response.ok()).toBe(true)

  const contentDisposition = response.headers()['content-disposition']
  expect(contentDisposition).toContain(expectedFilename)
}
