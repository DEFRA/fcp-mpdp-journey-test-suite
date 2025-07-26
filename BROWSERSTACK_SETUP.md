# BrowserStack Local Testing Setup

This document explains how to set up and run tests using BrowserStack Local with Playwright.

## Prerequisites

1. **BrowserStack Account**: You need an active BrowserStack subscription
2. **Local Application**: Your application should be running on `http://localhost:3000`
3. **Environment Variables**: BrowserStack credentials must be set

## Quick Setup

### 1. Get your BrowserStack credentials

1. Go to [BrowserStack Account Settings](https://www.browserstack.com/accounts/settings)
2. Find your **Username** and **Access Key**

### 2. Set environment variables

```bash
# Option 1: Export for current session
export BROWSERSTACK_USER=your_browserstack_username
export BROWSERSTACK_KEY=your_browserstack_access_key

# Option 2: Create a .env file (don't commit this!)
cp .env.example .env
# Edit .env with your actual credentials
```

### 3. Start your local application

Make sure your application is running on `http://localhost:3000`:

```bash
# Example - adjust this command for your actual application
npm start  # or whatever command starts your app locally
```

### 4. Run the tests

```bash
npm run test:local:browserstack
```

## Configuration Details

The `playwright.local.browserstack.config.js` file is configured to:

- **Connect to BrowserStack**: Uses BrowserStack's cloud browsers
- **Test localhost**: Routes traffic through BrowserStack Local tunnel
- **Use Chrome on Windows 11**: Single browser configuration to avoid connection issues
- **Reduced concurrency**: Uses 1 worker to prevent connection problems
- **Extended timeouts**: Longer timeouts to account for network latency

## Working Configuration

The configuration uses the proven capability format:

```javascript
{
  browser: 'chrome',
  browser_version: 'latest',
  os: 'Windows',
  os_version: '11',
  'browserstack.username': process.env.BROWSERSTACK_USER,
  'browserstack.accessKey': process.env.BROWSERSTACK_KEY,
  'browserstack.localIdentifier': 'playwright-local-test',
  'browserstack.local': 'true', // String format is important!
  'client.playwrightVersion': clientPlaywrightVersion // Critical for compatibility
}
```

## Troubleshooting

### Common Issues

**"BrowserStack Local failed to start"**
- Check your BrowserStack credentials
- Ensure you have an active subscription
- Verify your network connection

**"Connection refused to localhost:3000"**
- Make sure your local application is running
- Verify it's accessible at `http://localhost:3000`
- Check if another application is using port 3000

**"Tests timing out"**
- BrowserStack can be slower than local testing
- The configuration already includes extended timeouts
- Check your internet connection speed

## Environment Variables

The configuration supports both naming conventions:
- `BROWSERSTACK_USER` or `BROWSERSTACK_USERNAME`
- `BROWSERSTACK_KEY` or `BROWSERSTACK_ACCESS_KEY`

## Security Notes

- Never commit your `.env` file or actual credentials
- Use environment variables or secure credential storage
- The `.env.example` file shows the required format without real values
