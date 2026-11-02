import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './pages-tests',
  webServer: { command: 'python3 -m http.server 4324 --bind 127.0.0.1 --directory .pages-test', url: 'http://127.0.0.1:4324/AppSecTrail/', reuseExistingServer: false },
  use: { baseURL: 'http://127.0.0.1:4324' },
  projects: [ { name: 'desktop', use: { ...devices['Desktop Chrome'] } }, { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } } ],
});
