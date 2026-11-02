import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './lesson-tests',
  webServer: { command: 'python3 -m http.server 4323 --bind 127.0.0.1 --directory .test-fixture/dist', url: 'http://127.0.0.1:4323', reuseExistingServer: false },
  use: { baseURL: 'http://127.0.0.1:4323' },
  projects: [ { name: 'desktop', use: { ...devices['Desktop Chrome'] } }, { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } } ],
});
