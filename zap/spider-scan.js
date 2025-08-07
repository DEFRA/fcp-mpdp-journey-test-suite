import { zapClient } from './client.js'

export async function startSpiderScan () {
  try {
    const params = {
      url: 'http://localhost:3000',
      maxchildren: 0,
      recurse: false,
      subtreeonly: false
    }

    const response = await zapClient.spider.scan(params)
    console.log('Spider started:', response)
  } catch (error) {
    console.error('Error starting spider scan:', error)
  }
}
