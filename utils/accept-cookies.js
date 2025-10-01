// Accept analytics cookies + hide message so cookies banner is not visible and does not interfere with journey tests
export async function acceptCookies (page) {
  const cookiesBanner = page.locator('.js-cookies-banner')

  if (cookiesBanner.isVisible()) {
    await page.getByRole('button', { name: 'Accept analytics cookies' }).click()

    const acceptedCookiesBanner = page.locator('.js-cookies-accepted')
    await acceptedCookiesBanner.waitFor({ state: 'visible' })

    await acceptedCookiesBanner.getByRole('button', { name: 'Hide this message' }).click()

    await cookiesBanner.waitFor({ state: 'hidden' })
  }
}
