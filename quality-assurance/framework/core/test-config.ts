/**
 * 🧪 Xorigo UI 质量保证框架 - 核心测试配置
 *
 * 统一的测试配置和工具，确保整个monorepo的测试一致性
 */

import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import react from '@vitejs/plugin-react-swc'

// 测试类型定义
export interface TestEnvironment {
  unit: 'jsdom' | 'node' | 'happy-dom'
  integration: 'jsdom' | 'playwright'
  e2e: 'playwright' | 'puppeteer'
  visual: 'playwright'
}

// 质量标准配置
export const QUALITY_THRESHOLDS = {
  coverage: {
    statements: 90,
    branches: 85,
    functions: 95,
    lines: 90,
    themeCoverage: 100, // 主题测试必须100%覆盖
    apiCoverage: 95,
  },
  performance: {
    buildTime: 30000, // 30秒
    bundleSize: 200000, // 200KB gzipped
    testTimeout: 10000, // 10秒
  },
  accessibility: {
    wcagLevel: 'AA',
    minContrastRatio: 4.5,
    maxViolations: 0,
  }
}

// 七轴主题测试配置
export const SEVEN_AXIS_THEME_CONFIG = {
  axes: {
    mode: ['light', 'dark', 'auto'],
    hue: ['blue', 'green', 'purple', 'orange', 'red'],
    saturation: ['muted', 'normal', 'vibrant'],
    lightness: ['bright', 'normal', 'dim'],
    density: ['compact', 'normal', 'spacious'],
    roundness: ['sharp', 'rounded', 'circular'],
    contrast: ['low', 'normal', 'high']
  },
  testCombinations: {
    critical: [
      // 关键组合：每个轴取一个代表值
      { mode: 'light', hue: 'blue', saturation: 'normal', lightness: 'normal',
        density: 'normal', roundness: 'rounded', contrast: 'normal' },
      { mode: 'dark', hue: 'purple', saturation: 'vibrant', lightness: 'dim',
        density: 'spacious', roundness: 'circular', contrast: 'high' }
    ],
    comprehensive: 'auto', // 自动生成所有组合
    stress: 'random' // 随机压力测试
  }
}

// 基础Vitest配置
export const BASE_VITEST_CONFIG = {
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom' as const,
    setupFiles: [
      './quality-assurance/framework/setup/global-setup.ts',
      './quality-assurance/framework/setup/theme-setup.ts',
      './quality-assurance/framework/setup/accessibility-setup.ts'
    ],
    css: true,
    include: [
      'src/**/__tests__/**/*.{test,spec}.{js,ts,tsx}',
      'packages/**/src/**/__tests__/**/*.{test,spec}.{js,ts,tsx}',
      'apps/**/src/**/__tests__/**/*.{test,spec}.{js,ts,tsx}',
      'quality-assurance/test-suites/**/*.{test,spec}.{js,ts,tsx}'
    ],
    exclude: [
      'node_modules',
      'dist',
      'coverage',
      '**/*.d.ts'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        '**/test-utils/**',
        '**/__mocks__/**'
      ],
      thresholds: QUALITY_THRESHOLDS.coverage,
      all: true,
      include: [
        'src/**/*.{js,ts,tsx}',
        'packages/*/src/**/*.{js,ts,tsx}',
        'apps/*/src/**/*.{js,ts,tsx}'
      ]
    },
    testTimeout: QUALITY_THRESHOLDS.performance.testTimeout,
    hookTimeout: 15000,
    teardownTimeout: 10000,
    isolate: true,
    watchExclude: [
      'node_modules/**',
      'dist/**',
      'coverage/**'
    ],
    passWithNoTests: false,
    retry: process.env.CI ? 2 : 0,
    bail: process.env.CI ? 5 : 0,
    reporter: [
      'default',
      'json',
      'html',
      process.env.CI ? 'junit' : 'verbose'
    ],
    outputFile: {
      json: './quality-assurance/reports/test-results.json',
      html: './quality-assurance/reports/test-report.html',
      junit: './quality-assurance/reports/junit.xml'
    }
  },
  resolve: {
    alias: {
      '@': resolve(process.cwd(), './src'),
      '@/foundations': resolve(process.cwd(), './src/foundations'),
      '@/feedback': resolve(process.cwd(), './src/feedback'),
      '@/layout': resolve(process.cwd(), './src/layout'),
      '@/navigation': resolve(process.cwd(), './src/navigation'),
      '@/data-display': resolve(process.cwd(), './src/data-display'),
      '@/system': resolve(process.cwd(), './src/system'),
      '@/tokens': resolve(process.cwd(), './src/tokens'),
      '@/theme': resolve(process.cwd(), './src/theme'),
      '@/utils': resolve(process.cwd(), './src/utils'),
      '@/types': resolve(process.cwd(), './src/types'),
      '@/quality': resolve(process.cwd(), './quality-assurance'),
      '@/test-utils': resolve(process.cwd(), './quality-assurance/framework/utils')
    },
  },
  define: {
    'process.env.NODE_ENV': '"test"'
  }
}

// 单元测试配置
export const UNIT_TEST_CONFIG = defineConfig({
  ...BASE_VITEST_CONFIG,
  test: {
    ...BASE_VITEST_CONFIG.test,
    environment: 'jsdom' as const,
    include: [
      'packages/*/src/**/__tests__/**/*.{test,spec}.{js,ts,tsx}',
      'quality-assurance/test-suites/unit/**/*.{test,spec}.{js,ts,tsx}'
    ],
    coverage: {
      ...BASE_VITEST_CONFIG.test!.coverage,
      thresholds: {
        ...QUALITY_THRESHOLDS.coverage,
        functions: 95, // 单元测试函数覆盖率要求更高
        lines: 92
      }
    }
  }
})

// 集成测试配置
export const INTEGRATION_TEST_CONFIG = defineConfig({
  ...BASE_VITEST_CONFIG,
  test: {
    ...BASE_VITEST_CONFIG.test,
    environment: 'jsdom' as const,
    include: [
      'quality-assurance/test-suites/integration/**/*.{test,spec}.{js,ts,tsx}',
      'apps/*/src/**/__tests__/integration/**/*.{test,spec}.{js,ts,tsx}'
    ],
    setupFiles: [
      ...BASE_VITEST_CONFIG.test!.setupFiles!,
      './quality-assurance/framework/setup/integration-setup.ts'
    ],
    testTimeout: 20000, // 集成测试需要更长时间
    hookTimeout: 20000
  }
})

// 主题系统测试配置
export const THEME_TEST_CONFIG = defineConfig({
  ...BASE_VITEST_CONFIG,
  test: {
    ...BASE_VITEST_CONFIG.test,
    environment: 'jsdom' as const,
    include: [
      'quality-assurance/test-suites/theme-system/**/*.{test,spec}.{js,ts,tsx}',
      'packages/*/src/**/__tests__/theme/**/*.{test,spec}.{js,ts,tsx}'
    ],
    setupFiles: [
      ...BASE_VITEST_CONFIG.test!.setupFiles!,
      './quality-assurance/framework/setup/theme-test-setup.ts'
    ],
    testTimeout: 30000, // 主题测试需要更长时间
    hookTimeout: 25000,
    coverage: {
      ...BASE_VITEST_CONFIG.test!.coverage,
      thresholds: {
        ...QUALITY_THRESHOLDS.coverage,
        themeCoverage: 100 // 主题测试必须100%覆盖
      }
    }
  }
})

// API一致性测试配置
export const API_TEST_CONFIG = defineConfig({
  ...BASE_VITEST_CONFIG,
  test: {
    ...BASE_VITEST_CONFIG.test,
    environment: 'jsdom' as const,
    include: [
      'quality-assurance/test-suites/component-api/**/*.{test,spec}.{js,ts,tsx}',
      'packages/*/src/**/__tests__/api/**/*.{test,spec}.{js,ts,tsx}'
    ],
    setupFiles: [
      ...BASE_VITEST_CONFIG.test!.setupFiles!,
      './quality-assurance/framework/setup/api-test-setup.ts'
    ],
    coverage: {
      ...BASE_VITEST_CONFIG.test!.coverage,
      thresholds: {
        ...QUALITY_THRESHOLDS.coverage,
        apiCoverage: 95
      }
    }
  }
})

// 性能测试配置
export const PERFORMANCE_TEST_CONFIG = defineConfig({
  ...BASE_VITEST_CONFIG,
  test: {
    ...BASE_VITEST_CONFIG.test,
    environment: 'jsdom' as const,
    include: [
      'quality-assurance/test-suites/performance/**/*.{test,spec}.{js,ts,tsx}'
    ],
    setupFiles: [
      ...BASE_VITEST_CONFIG.test!.setupFiles!,
      './quality-assurance/framework/setup/performance-test-setup.ts'
    ],
    testTimeout: 60000, // 性能测试需要更长时间
    hookTimeout: 30000,
    coverage: {
      ...BASE_VITEST_CONFIG.test!.coverage,
      thresholds: {
        ...QUALITY_THRESHOLDS.coverage,
        statements: 80, // 性能测试覆盖率要求稍低
        lines: 75
      }
    }
  }
})

// 可访问性测试配置
export const ACCESSIBILITY_TEST_CONFIG = defineConfig({
  ...BASE_VITEST_CONFIG,
  test: {
    ...BASE_VITEST_CONFIG.test,
    environment: 'jsdom' as const,
    include: [
      'quality-assurance/test-suites/accessibility/**/*.{test,spec}.{js,ts,tsx}',
      'packages/*/src/**/__tests__/accessibility/**/*.{test,spec}.{js,ts,tsx}'
    ],
    setupFiles: [
      ...BASE_VITEST_CONFIG.test!.setupFiles!,
      './quality-assurance/framework/setup/accessibility-test-setup.ts'
    ],
    coverage: {
      ...BASE_VITEST_CONFIG.test!.coverage,
      thresholds: {
        ...QUALITY_THRESHOLDS.coverage,
        functions: 90 // 可访问性测试函数覆盖率要求高
      }
    }
  }
})

// 跨包测试配置
export const CROSS_PACKAGE_TEST_CONFIG = defineConfig({
  ...BASE_VITEST_CONFIG,
  test: {
    ...BASE_VITEST_CONFIG.test,
    environment: 'jsdom' as const,
    include: [
      'quality-assurance/test-suites/cross-package/**/*.{test,spec}.{js,ts,tsx}'
    ],
    setupFiles: [
      ...BASE_VITEST_CONFIG.test!.setupFiles!,
      './quality-assurance/framework/setup/cross-package-setup.ts'
    ],
    testTimeout: 45000,
    hookTimeout: 30000,
    coverage: {
      ...BASE_VITEST_CONFIG.test!.coverage,
      all: true, // 必须包含所有包
      include: [
        'packages/*/src/**/*.{js,ts,tsx}',
        'apps/*/src/**/*.{js,ts,tsx}'
      ]
    }
  }
})

// 导出所有配置
export const TEST_CONFIGS = {
  unit: UNIT_TEST_CONFIG,
  integration: INTEGRATION_TEST_CONFIG,
  theme: THEME_TEST_CONFIG,
  api: API_TEST_CONFIG,
  performance: PERFORMANCE_TEST_CONFIG,
  accessibility: ACCESSIBILITY_TEST_CONFIG,
  crossPackage: CROSS_PACKAGE_TEST_CONFIG,
  base: BASE_VITEST_CONFIG
} as const

// 配置映射类型
export type TestConfigType = keyof typeof TEST_CONFIGS

// 获取特定配置
export function getTestConfig(type: TestConfigType = 'base') {
  return TEST_CONFIGS[type]
}

// 为不同环境获取配置
export function getTestConfigForEnvironment(env: 'development' | 'ci' | 'production') {
  const baseConfig = getTestConfig()

  switch (env) {
    case 'ci':
      return defineConfig({
        ...baseConfig,
        test: {
          ...baseConfig.test!,
          bail: 5,
          retry: 2,
          reporter: ['default', 'json', 'junit'],
          watch: false
        }
      })
    case 'production':
      return defineConfig({
        ...baseConfig,
        test: {
          ...baseConfig.test!,
          coverage: {
            ...baseConfig.test!.coverage,
            reporter: ['json', 'lcov']
          },
          bail: 1,
          retry: 0
        }
      })
    default:
      return baseConfig
  }
}