import { browser, expect } from '@wdio/globals'
import StartPage from '../page-objects/start.page'

describe('Service start page', () => {
  it('Should be on the "Service start" page', async () => {
    await StartPage.open()
    await expect(browser).toHaveTitle(
      'Find farm and land payment data - GOV.UK'
    )
  })
})
