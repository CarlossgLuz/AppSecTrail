import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  webServer: { command: 'python3 -m http.server 4322 --bind 127.0.0.1 --directory dist', url: 'http://127.0.0.1:4322', reuseExistingServer: false },
  use: { baseURL: 'http://127.0.0.1:4322' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
  ],
});
