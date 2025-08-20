import { expect } from '@playwright/test'

export async function expectRelatedContent ({ page }) {
  const sectionHeading = page.locator('#related-content')
  const fundingLink = page.locator('#fflm-link')

  await expect(sectionHeading).toHaveText('Related Content')
  await expect(fundingLink).toHaveText('Funding for farmers, growers and land managers')
}
