import { zapClient } from './client.js'

export async function startSpiderScan () {
  const targetUrl = process.env.TARGET_URL || 'http://localhost:3000'

  await zapClient.spider.scan({ url: targetUrl })

  await zapClient.reports.generate({
    template: 'traditional-html',
    title: 'ZAP Spider Scan Report for MPDP (fcp-mpdp)',
    reportFileName: 'zap-report.html',
    reportDir: '.',
    display: true
  })
}
