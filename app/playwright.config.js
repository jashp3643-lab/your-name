// E2E_TARGET=preview (default): static esbuild preview on :4173 (hash routes)
// E2E_TARGET=next: `next dev`/`next start` on :3000 (path routes)
const { defineConfig } = require('@playwright/test');
const fs = require('fs');

const target = process.env.E2E_TARGET || 'preview';
const baseURL = target === 'next' ? 'http://localhost:3000' : 'http://localhost:4173';
const sandboxChromium = '/opt/pw-browsers/chromium';

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['json', { outputFile: 'test-results/results.json' }]],
  use: {
    baseURL,
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 2,
    launchOptions: fs.existsSync(sandboxChromium) ? { executablePath: sandboxChromium } : {},
  },
  webServer:
    target === 'next'
      ? { command: 'npm run dev', url: baseURL, reuseExistingServer: true, timeout: 120000 }
      : { command: 'npm run preview:build && npm run preview:serve', url: baseURL, reuseExistingServer: true, timeout: 60000 },
});
