// Playwright 配置模板 - 支持 a11y 和视觉回归测试
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  // 测试目录
  testDir: './tests',

  // 全局超时设置
  timeout: 30 * 1000,

  // 测试超时设置
  expect: {
    // 截图对比阈值配置
    toHaveScreenshot: {
      maxDiffPixels: 10,          // 最大差异像素数
      maxDiffPixelRatio: 0.02,    // 最大差异像素比例
      animation: 'disabled',      // 禁用动画
      caret: 'hide',              // 隐藏光标
      scale: 'css',               // CSS 缩放
    },

    // a11y 测试配置
    toPassA11yTests: {
      rules: {
        // 自定义 a11y 规则阈值
        'color-contrast': { enabled: true },
        'keyboard-navigation': { enabled: true },
        'aria-labels': { enabled: true },
      }
    }
  },

  // 全局测试配置
  use: {
    // 基础 URL（Storybook 地址）
    baseURL: 'http://localhost:6009',

    // 截图配置
    screenshot: {
      mode: 'only-on-failure',
      fullPage: true,
    },

    // 视频配置（失败时录制）
    video: 'retain-on-failure',

    // 轨迹配置
    trace: 'on-first-retry',

    // 忽略 HTTPS 错误
    ignoreHTTPSErrors: true,

    // 用户代理
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  },

  // 项目配置
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 },
      },
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 },
      },
    },

    // 移动设备测试
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
      },
    },

    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 12'],
      },
    },
  ],

  // Web Server 配置（用于启动 Storybook）
  webServer: {
    command: 'npm run storybook',
    port: 6009,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  // 输出目录
  outputDir: 'test-results',

  // 报告器配置
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results.json' }],
    ['junit', { outputFile: 'test-results.xml' }],
  ],

  // 全局设置文件
  globalSetup: require.resolve('./tests/global-setup.ts'),

  // 全局拆卸文件
  globalTeardown: require.resolve('./tests/global-teardown.ts'),

  // 测试文件匹配模式
  testMatch: [
    '**/*.a11y.spec.ts',   // a11y 测试
    '**/*.visual.spec.ts', // 视觉回归测试
    '**/*.e2e.spec.ts',    // E2E 测试
  ],

  // 忽略测试文件
  testIgnore: [
    '**/node_modules/**',
    '**/dist/**',
  ],

  // 并行工作线程数
  workers: process.env.CI ? 2 : 4,

  // 全局环境变量
  globalSetup: './tests/global-setup.ts',

  // 依赖项目配置
  deps: {
    // 测试依赖文件
    testMatch: '**/*.test.{ts,js}',
  },

  // 元数据配置
  metadata: {
    'test-a11y': {
      'a11y-standards': ['WCAG2AA'],
      'a11y-rules': ['best-practice'],
    },
    'test-visual': {
      'viewport-sizes': ['desktop', 'mobile', 'tablet'],
      'color-schemes': ['light', 'dark'],
    },
  }
})