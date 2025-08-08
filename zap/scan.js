import { zapClient } from './client.js'
import fs from 'fs'

export async function startSpiderScan () {
  await zapClient.spider.scan({ url: 'http://locahost:3000' })

  const report = await zapClient.reports.generate({
    template: 'traditional-html',
    title: 'ZAP Spider Scan Report for MPDP (fcp-mpdp)'
  })

  fs.writeFileSync('zap-report.html', JSON.stringify(report, null, 2), 'utf8')
}
