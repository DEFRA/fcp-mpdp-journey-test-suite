import { expect } from '@playwright/test'
import { isAndroid } from '../../utils/devices.js'

export async function expectDownload (page, link, expectedFilename, testInfo) {
  // Android testing on BrowserStack supports file downloads, however, there is an unresolved issue verifying the filename.
  if (!isAndroid(testInfo)) {
    const downloadPromise = page.waitForEvent('download')

    await link.click()
    const download = await downloadPromise
    const filename = download.suggestedFilename()

    expect(filename).toBe(expectedFilename)
  }
}
