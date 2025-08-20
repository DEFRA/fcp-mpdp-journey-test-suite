import { startSpiderScan } from '../zap/scan'

export async function SecurityTest (url) {
  await startSpiderScan(url)
}
