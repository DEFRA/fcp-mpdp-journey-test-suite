import { startSpiderScan } from '../zap/scan'

export async function securityTest (url) {
  await startSpiderScan(url)
}
