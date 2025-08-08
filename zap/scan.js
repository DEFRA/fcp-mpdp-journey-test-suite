import { zapClient } from './client.js'
import fs from 'fs'

export async function startSpiderScan () {
  const targetUrl = process.env.TARGET_URL || 'http://localhost:3000'

  await zapClient.spider.scan({ url: targetUrl })

  const report = await zapClient.reports.generate({
    template: 'traditional-html',
    title: 'ZAP Spider Scan Report for MPDP (fcp-mpdp)'
  })

  fs.writeFileSync('zap-report.html', JSON.stringify(report, null, 2), 'utf8')
}
