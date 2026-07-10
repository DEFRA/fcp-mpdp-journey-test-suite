import { expect } from '@playwright/test'
import { isMobileDevice } from '../../utils/devices.js'

export async function expectDownload (page, link, expectedFilename, testInfo) {
  if (!isMobileDevice(testInfo)) {
    const downloadPromise = page.waitForEvent('download')

    await link.click()
    const download = await downloadPromise
    const filename = download.suggestedFilename()

    expect(filename).toBe(expectedFilename)
  }
}
