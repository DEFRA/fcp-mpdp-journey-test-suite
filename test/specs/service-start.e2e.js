import { browser, expect } from '@wdio/globals'
import ServiceStartPage from '../page-objects/service-start.page'

describe('Service start page', () => {
  it('Should be on the "Service start" page', async () => {
    await ServiceStartPage.open()
    await expect(browser).toHaveTitle(
      'Find farm and land payment data - Find farm and land payment data - GOV.UK'
    )
  })
})
