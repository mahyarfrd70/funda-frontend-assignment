import { defineConfig, devices } from '@playwright/test'

// End-to-end tests: a real browser against a real Nuxt dev server that talks to
// the real Funda Partner API. No mocking — these prove the whole path works.
// The server needs NUXT_FUNDA_API_KEY (picked up from .env by `nuxt dev`).
const PORT = 3000
const baseURL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: './e2e/web',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // the live API is the flaky part, so allow a retry even locally
  retries: process.env.CI ? 2 : 1,
  // keep concurrent load on the Funda feed modest
  workers: process.env.CI ? 1 : 2,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  timeout: 30_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'pnpm dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
