import { expect } from '@playwright/test'

export async function expectRelatedContent ({ page, sectionText = 'Related Content', links = [] }) {
  const sectionHeading = page.locator('#related-content')
  await expect(sectionHeading).toHaveText(sectionText)

  for (const { selector, text } of links) {
    const link = page.locator(selector)
    await expect(link).toHaveText(text)
  }
}
