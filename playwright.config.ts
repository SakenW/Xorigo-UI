import { defineConfig, devices } from '@playwright/test';
import path from 'path';

// 测试配置
const config = defineConfig({
  // 全局设置
  testDir: './tests/visual',
  testMatch: '**/*.visual.test.{ts,tsx}',
  testIgnore: '**/node_modules/**',

  // 并行执行
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : 2,

  // 报告器
  reporter: [
    ['html', {
      outputFolder: './playwright-report',
      open: process.env.CI ? 'never' : 'on-failure'
    }],
    ['json', { outputFile: './playwright-report/results.json' }],
    ['junit', { outputFile: './playwright-report/results.xml' }],
    ['list'],
  ],

  // 全局设置
  use: {
    // 基础URL
    baseURL: 'http://localhost:3100',

    // 截图设置
    screenshot: {
      mode: 'only-on-failure',
      fullPage: true,
      quality: 90,
      animations: 'disabled'
    },

    // 视频录制
    video: 'retain-on-failure',

    // 追踪
    trace: 'retain-on-failure',

    // 视觉测试设置
    colorScheme: 'light',
    ignoreHTTPSErrors: true,

    // 视觉回归测试设置
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,

    // 字体渲染
    ignoreHTTPSErrors: true,

    // 等待超时
    actionTimeout: 10 * 1000,
    navigationTimeout: 30 * 1000,
  },

  // 项目配置 - 多浏览器测试
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // 轻量级截图设置
        deviceScaleFactor: 1,
        hasTouch: false,
      },
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        deviceScaleFactor: 1,
        hasTouch: false,
      },
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        deviceScaleFactor: 2,
        hasTouch: false,
      },
    },

    // 移动设备测试
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
        viewport: { width: 393, height: 851 },
      },
    },

    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 12'],
        viewport: { width: 390, height: 844 },
      },
    },

    // 平板设备测试
    {
      name: 'iPad',
      use: {
        ...devices['iPad Pro'],
        viewport: { width: 1024, height: 1366 },
      },
    },
  ],

  // 本地开发服务器
  webServer: {
    command: 'npm run docker:dev',
    url: 'http://localhost:3100',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  // 输出目录
  outputDir: './test-results/',

  // 环境变量
  globalSetup: path.resolve(__dirname, 'playwright.global-setup.ts'),
  globalTeardown: path.resolve(__dirname, 'playwright.global-teardown.ts'),
});

export default config;