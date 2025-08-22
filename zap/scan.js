import { allure } from 'allure-playwright'
import fs from 'fs/promises'
import path from 'path'

const ZAP_BASE_URL = 'http://localhost:8080'

function convertUrlForZap (url) {
  if (url.includes('localhost:3000')) {
    return url.replace('localhost:3000', 'host.docker.internal:3000')
  }
  if (url.includes('127.0.0.1:3000')) {
    return url.replace('127.0.0.1:3000', 'host.docker.internal:3000')
  }
  // Handle Playwright internal URLs by using the base application URL
  if (url.startsWith('file://') || url.startsWith('about:') || url.startsWith('data:')) {
    return 'http://host.docker.internal:3000/'
  }
  return url
}

async function isZapRunning () {
  try {
    const res = await fetch(`${ZAP_BASE_URL}/JSON/core/view/version/`)
    if (!res.ok) return false
    const data = await res.json()
    return Boolean(data && (data.version || data['core.version'] || data))
  } catch {
    return false
  }
}

async function waitForZapReady (timeoutMs = 15000, intervalMs = 500) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    if (await isZapRunning()) {
      return
    }
    await new Promise(resolve => setTimeout(resolve, intervalMs))
  }
  throw new Error(`ZAP is not reachable at ${ZAP_BASE_URL}.`)
}

async function getZapResults () {
  const [alertsResponse, sitesResponse] = await Promise.all([
    fetch(`${ZAP_BASE_URL}/JSON/core/view/alerts/`),
    fetch(`${ZAP_BASE_URL}/JSON/core/view/sites/`)
  ])

  const [alertsData, sitesData] = await Promise.all([
    alertsResponse.json(),
    sitesResponse.json()
  ])

  return {
    alerts: alertsData.alerts || [],
    sites: sitesData.sites || []
  }
}

async function loadExclusionList () {
  const exclusionPath = path.resolve(process.cwd(), 'zap', 'zap.conf')
  try {
    const exclusionContent = await fs.readFile(exclusionPath, 'utf8')
    return exclusionContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'))
      .map(line => {
        const [ruleId, title] = line.split(':')
        return { ruleId: ruleId.trim(), title: title.trim() }
      })
  } catch (e) {
    return [] // If file missing, return empty exclusion list
  }
}

async function checkForFailingAlerts (alerts) {
  const exclusionList = await loadExclusionList()

  const failingAlerts = alerts.filter(alert => {
    if (alert.risk !== 'Medium') return false
    const pluginId = String(alert.pluginId)
    const title = alert.alert
    return !exclusionList.some(ex => ex.ruleId === pluginId && ex.title === title)
  })

  if (failingAlerts.length > 0) {
    throw new Error(`ZAP found ${failingAlerts.length} Medium risk security alert(s) (not excluded)!`)
  }
}

async function waitForScanToComplete (scanId) {
  console.log(`Waiting for spider scan ${scanId} to complete...`)

  let progress = 0
  while (progress < 100) {
    try {
      const statusResponse = await fetch(`${ZAP_BASE_URL}/JSON/spider/view/status/?scanId=${scanId}`)
      const statusData = await statusResponse.json()
      progress = parseInt(statusData.status)
      console.log(`Spider scan progress: ${progress}%`)
      if (progress < 100) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    } catch (error) {
      console.error('Error checking scan status:', error.message)
      break
    }
  }
  console.log('Spider scan completed')
}

export async function startSpiderScan (url) {
  try {
    // Ensure ZAP is up before attempting any API calls
    await waitForZapReady()

    const zapAccessibleUrl = convertUrlForZap(url)
    console.log(`Converting URL for ZAP: ${url} -> ${zapAccessibleUrl}`)

    // Start spider scan
    const scanResult = await fetch(`${ZAP_BASE_URL}/JSON/spider/action/scan/?url=${encodeURIComponent(zapAccessibleUrl)}`)
    const scanData = await scanResult.json()

    if (scanData.scan === undefined) {
      throw new Error('Failed to start spider scan: ' + JSON.stringify(scanData))
    }
    let scanId = scanData.scan

    // Handle scan ID 0 issue: ZAP sometimes doesn't populate alerts for the first scan
    if (scanId === 0 || scanId === '0') {
      console.log(`Got scan ID ${scanId}, running retry to ensure proper alert detection...`)
      await waitForScanToComplete(scanId)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Brief pause

      // Start retry scan which should get a proper ID
      const retryResult = await fetch(`${ZAP_BASE_URL}/JSON/spider/action/scan/?url=${encodeURIComponent(zapAccessibleUrl)}`)
      const retryData = await retryResult.json()
      scanId = retryData.scan || scanId
      console.log(`Using retry scan with ID: ${scanId}`)
    }

    console.log(`Started ZAP spider scan with ID: ${scanId}`)

    await waitForScanToComplete(scanId)

    const { alerts } = await getZapResults()

    await attachZapResultsToAllure(scanId, zapAccessibleUrl)

    await checkForFailingAlerts(alerts)

    console.log(`Security scan completed successfully with ID: ${scanId}`)
    return scanId
  } catch (error) {
    console.error('Error starting ZAP spider scan:', error.message)
    throw error
  }
}

export async function attachZapResultsToAllure (scanId, targetUrl) {
  try {
    const results = await getZapScanResults(scanId)

    if (results.alerts && results.alerts.length > 0) {
      await allure.step(`Found ${results.alerts.length} security alerts`, async () => {
        for (const alert of results.alerts) {
          await allure.step(`${alert.risk} Risk: ${alert.alert}`, async () => {
            await allure.attachment(
              `Alert Details: ${alert.alert}`,
              JSON.stringify(alert, null, 2),
              'application/json'
            )
          })
        }
      })
    } else {
      await allure.step('No security vulnerabilities found', async () => {})
    }

    if (results.sites && results.sites.length > 0) {
      await allure.step(`Spider discovered ${results.sites.length} URLs`, async () => {
        const urlList = results.sites.map((url, index) => `${index + 1}. ${url}`).join('\n')
        await allure.attachment('Discovered URLs', urlList, 'text/plain')
      })
    }

    return results
  } catch (error) {
    await allure.step('Error retrieving ZAP scan results', async () => {
      await allure.attachment('Error Details', error.message, 'text/plain')
    })
    throw error
  }
}

async function getZapScanResults (scanId) {
  const results = {
    scanId,
    timestamp: new Date().toISOString(),
    alerts: [],
    sites: [],
    scanInfo: {}
  }

  try {
    // Get alerts
    const alertsResponse = await fetch(`${ZAP_BASE_URL}/JSON/core/view/alerts/`)
    const alertsData = await alertsResponse.json()
    results.alerts = alertsData.alerts || []

    // Get discovered sites
    const sitesResponse = await fetch(`${ZAP_BASE_URL}/JSON/core/view/sites/`)
    const sitesData = await sitesResponse.json()
    results.sites = sitesData.sites || []

    // Get scan information
    if (scanId !== undefined) {
      const scanResponse = await fetch(`${ZAP_BASE_URL}/JSON/spider/view/status/?scanId=${scanId}`)
      const scanData = await scanResponse.json()
      results.scanInfo = scanData
    }
  } catch (error) {
    console.error('Error fetching ZAP results:', error.message)
  }

  return results
}
