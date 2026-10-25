import { defineConfig } from '@playwright/test';

// Web checks in a real browser at the two presentations the specs define.
export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:8090',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'mobile', use: { browserName: 'chromium', viewport: { width: 390, height: 844 }, hasTouch: true } },
    { name: 'desktop', use: { browserName: 'chromium', viewport: { width: 1280, height: 900 } } },
  ],
  webServer: [
    {
      command: 'pnpm --filter @ths/mock-api start',
      url: 'http://localhost:4010/me',
      reuseExistingServer: true,
      env: { MOCK_LATENCY: 'off' },
    },
    {
      command: 'pnpm --filter @ths/expo exec expo start --web --port 8090',
      url: 'http://localhost:8090',
      reuseExistingServer: true,
      timeout: 180_000,
    },
  ],
});
