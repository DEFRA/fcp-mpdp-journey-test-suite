import { test } from '@playwright/test'
import { startSpiderScan, ZAP_BASE_URL } from '../../zap/scan.js'

async function isZapReachable () {
  try {
    const res = await fetch(`${ZAP_BASE_URL}/JSON/core/view/version/`, { signal: AbortSignal.timeout(2000) })
    return res.ok
  } catch {
    return false
  }
}

test.describe('Security', () => {
  test('Site should pass ZAP spider scan', async ({ baseURL }) => {
    const zapAvailable = await isZapReachable()
    if (!zapAvailable) {
      test.skip(true, 'ZAP proxy not available')
      return
    }
    await startSpiderScan(baseURL)
  })
})
