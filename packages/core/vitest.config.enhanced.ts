/**
 * Vitest 增强配置
 *
 * 支持完整的测试框架，包括单元测试、集成测试、性能测试、
 * 可访问性测试、主题测试等
 */

import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import react from '@vitejs/plugin-react-swc'
import { coverageConfigDefaults } from 'vitest/config'

export default defineConfig({
  plugins: [react()],

  test: {
    // 全局设置
    globals: true,
    environment: 'jsdom',
    setupFiles: [
      './src/test/setup.ts',
      './src/test/accessibility-setup.ts',
      './src/test/theme-setup.ts',
      './src/test/performance-setup.ts'
    ],

    // 测试文件匹配
    include: [
      'src/**/*.{test,spec}.{ts,tsx}',
      'src/**/__tests__/**/*.{ts,tsx}',
      'src/**/*.unit.{ts,tsx}',
      'src/**/*.integration.{ts,tsx}',
      'src/**/*.performance.{ts,tsx}',
      'src/**/*.accessibility.{ts,tsx}',
      'src/**/*.theme.{ts,tsx}'
    ],

    // 排除文件
    exclude: [
      'node_modules',
      'dist',
      'src/**/node_modules',
      'src/**/dist',
      'src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
      'src/**/*.d.ts'
    ],

    // 覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'src/**/__tests__/**',
        'src/**/*.test.{ts,tsx}',
        'src/**/*.spec.{ts,tsx}',
        'src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
        'src/**/*.d.ts',
        'src/types/**',
        'src/test/**',
        'src/config/**',
        'src/stories/**'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 85,
          lines: 85,
          statements: 85
        },
        // 组件库特定阈值
        'packages/core/src/**/*.{ts,tsx}': {
          branches: 85,
          functions: 90,
          lines: 90,
          statements: 90
        }
      },
      all: true,
      clean: true,
      cleanOnRerun: true
    },

    // 并发配置
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        minThreads: 2,
        maxThreads: 4,
        isolate: true
      }
    },

    // 超时配置
    testTimeout: 10000,
    hookTimeout: 10000,

    // 报告器配置
    reporter: ['verbose', 'json', 'html'],
    outputFile: {
      json: './test-results/results.json',
      html: './test-results/index.html'
    },

    // 监听模式配置
    watch: false,
    watchExclude: [
      'node_modules/**',
      'dist/**',
      'coverage/**',
      'test-results/**'
    ],

    // 全局配置
    globals: true,

    // 环境变量
    env: {
      NODE_ENV: 'test',
      CI: process.env.CI || false,
      COVERAGE: process.env.COVERAGE || false
    },

    // CSS 和资源处理
    css: true,

    // 清理
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,

    // 错误处理
    onUnhandledError: 'error',

    // 序列化配置
    sequence: {
      concurrent: true,
      shuffle: false,
      seed: 42
    },

    // 类型检查
    typecheck: {
      enabled: true,
      tsconfig: './tsconfig.test.json',
      only: false,
      checker: 'tsc'
    }
  },

  // 解析配置
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/foundations': resolve(__dirname, './src/foundations'),
      '@/feedback': resolve(__dirname, './src/feedback'),
      '@/layout': resolve(__dirname, './src/layout'),
      '@/navigation': resolve(__dirname, './src/navigation'),
      '@/data-display': resolve(__dirname, './src/data-display'),
      '@/system': resolve(__dirname, './src/system'),
      '@/tokens': resolve(__dirname, './src/tokens'),
      '@/theme': resolve(__dirname, './src/theme'),
      '@/utils': resolve(__dirname, './src/utils'),
      '@/types': resolve(__dirname, './src/types'),
      '@/test': resolve(__dirname, './src/test'),
      '@/primitives': resolve(__dirname, './src/primitives'),
      '@/overlays': resolve(__dirname, './src/overlays')
    }
  },

  // 定义配置
  define: {
    __DEV__: 'true',
    __TEST__: 'true',
    __VERSION__: '"0.1.0"',
    'process.env.NODE_ENV': '"test"'
  },

  // 优化配置
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@testing-library/react',
      '@testing-library/jest-dom',
      'vitest',
      'jsdom'
    ]
  }
})