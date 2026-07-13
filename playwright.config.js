import 'dotenv/config'
import { defineConfig, devices } from '@playwright/test'

const isLocal = !process.env.ENVIRONMENT

export default defineConfig({
  testDir: './test/specs',
  testMatch: '**/*.test.js',

  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: isLocal ? 0 : 2,
  workers: 1,

  reporter: [
    [
      'allure-playwright',
      {
        resultsDir: 'allure-results'
      }
    ]
  ],
  use: {
    baseURL: process.env.BASE_URL ||
      `https://fcp-mpdp-frontend.${process.env.ENVIRONMENT}.cdp-int.defra.cloud`,
    headless: true,
    trace: isLocal ? 'on' : 'on-first-retry',
    video: isLocal ? 'on' : 'off'
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome']
      }
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox']
      }
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari']
      }
    },

    {
      name: 'mobile:ios-safari',
      use: {
        ...devices['iPhone 15']
      }
    },
    {
      name: 'mobile:android-samsung',
      use: {
        ...devices['Galaxy S24']
      }
    },
    {
      name: 'mobile:android-firefox',
      use: {
        ...devices['Pixel 7'],
        browserName: 'firefox',
        isMobile: false
      }
    }
  ],

  timeout: 120000,
  expect: {
    timeout: 10000
  }
})
