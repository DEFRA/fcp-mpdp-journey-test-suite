import { expect } from '@playwright/test'

export async function expectRelatedContent (page, links = []) {
  const sectionHeading = page.locator('#related-content')
  await expect(sectionHeading).toContainText('Related content')

  for (const { selector, text } of links) {
    const link = page.locator(selector)
    await expect(link).toContainText(text)
  }
}
