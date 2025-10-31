# 构建系统优化技术方案 v2.0

**生成日期**: 2025-10-31
**版本**: v2.0
**架构师**: Winston (Holistic System Architect)
**文档类型**: 技术实施规范 (TDR-004)

---

## 📋 执行摘要

本文档定义了 Xorigo UI 构建系统的全面优化方案。针对现有Vite + Next.js + TypeScript构建链进行深度优化，实现构建速度提升50%+、包体积减少30%+、开发体验显著改善的目标。

### 🎯 核心优化目标

- **构建性能**: 开发构建 < 2s，生产构建 < 20s，增量构建 < 200ms
- **包体积控制**: 核心库 < 80KB (gzipped)，主题配方 < 8KB each
- **开发体验**: 热更新延迟 < 50ms，TypeScript检查 < 100ms
- **缓存效率**: 缓存命中率 > 95%，重复构建节省 > 80% 时间
- **资源优化**: 图片压缩 60%+，CSS压缩 40%+，JS压缩 35%+

---

## 🏗️ 构建系统架构分析

### 现有构建流程

```
现有构建流程 (问题分析):
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Source Code   │───▶│   Vite Build    │───▶│  Bundle Output  │
│                 │    │                 │    │                 │
│ - 150+ TypeScript│    │ - 复杂配置逻辑  │    │ - 体积过大      │
│ - 动态入口点     │    │ - 缺乏优化      │    │ - 未压缩        │
│ - 循环依赖风险   │    │ - 缓存不足      │    │ - 未分割        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                 │
                                 ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Next.js App     │───▶│  Webpack Build  │───▶│  Production     │
│                 │    │                 │    │  Deployment     │
│ - 复杂别名配置   │    │ - 配置冗余      │    │ - 构建时间长    │
│ - 重复依赖       │    │ - 优化不足      │    │ - 资源未优化    │
│ - 热更新慢       │    │ - 内存占用高    │    │ - 缓存策略差    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 优化后架构

```
优化后构建流程:
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Source Code   │───▶│  Turbo Build     │───▶│  Optimized      │
│                 │    │                 │    │  Output         │
│ - 增量分析      │    │ - 并行构建      │    │ - Tree Shaken  │
│ - 依赖图优化    │    │ - 智能缓存      │    │ - Code Split   │
│ - 类型预检查    │    │ - 压缩优化      │    │ - Minified     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                 │
                                 ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Optimized       │───▶│  Edge Runtime   │───▶│  CDN Deployment │
│ Workbench       │    │                 │    │                 │
│ - 预构建组件     │    │ - 边缘优化      │    │ - 全球分发      │
│ - 智能预加载     │    │ - 按需加载      │    │ - 缓存策略      │
│ - 实时热更新     │    │ - 性能监控      │    │ - 压缩传输      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## ⚡ Vite 构建优化

### 优化配置策略

```typescript
// vite.config.ts (优化版本)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode, command }) => {
  const isProduction = mode === 'production'
  const isDevelopment = mode === 'development'

  return {
    plugins: [
      // 优化的React插件 (SWC编译器)
      react({
        jsxImportSource: '@emotion/react',
        plugins: [
          [
            '@swc/plugin-emotion',
            {
              sourceMap: isDevelopment,
              autoLabel: 'dev-only'
            }
          ]
        ]
      }),

      // PWA支持 (Workbench离线能力)
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
        manifest: {
          name: 'Xorigo UI Workbench',
          short_name: 'Xorigo UI',
          theme_color: '#000000',
          background_color: '#ffffff'
        }
      }),

      // 构建分析 (仅开发模式)
      isDevelopment && visualizer({
        filename: 'dist/stats.html',
        open: true,
        gzipSize: true
      })
    ].filter(Boolean),

    resolve: {
      // 优化别名配置
      alias: {
        '@': resolve(__dirname, './src'),
        '@components': resolve(__dirname, './src/components'),
        '@tokens': resolve(__dirname, './src/tokens'),
        '@hooks': resolve(__dirname, './src/hooks'),
        '@utils': resolve(__dirname, './src/utils'),
        '@types': resolve(__dirname, './src/types')
      }
    },

    // 优化构建选项
    build: {
      // 目标环境
      target: ['es2020', 'chrome80', 'firefox78', 'safari13'],

      // 输出配置
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: isDevelopment,

      // 构建优化
      minify: isProduction ? 'terser' : false,
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction,
          pure_funcs: isProduction ? ['console.log'] : []
        },
        mangle: {
          safari10: true
        }
      },

      // 代码分割
      rollupOptions: {
        input: {
          // 主入口
          main: resolve(__dirname, 'src/index.ts'),

          // 主题系统入口
          themes: resolve(__dirname, 'src/themes/index.ts'),

          // 组件库入口 (按需)
          components: resolve(__dirname, 'src/components/index.ts')
        },

        output: {
          // 命名策略
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name?.split('.') || []
            const extType = info[info.length - 1]

            if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)$/.test(assetInfo.name || '')) {
              return 'media/[name]-[hash][extname]'
            }
            if (/\.(png|jpe?g|gif|svg|webp|avif)$/.test(assetInfo.name || '')) {
              return 'images/[name]-[hash][extname]'
            }
            if (/\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name || '')) {
              return 'fonts/[name]-[hash][extname]'
            }
            if (extType === 'css') {
              return 'css/[name]-[hash][extname]'
            }
            return 'assets/[name]-[hash][extname]'
          },

          // 优化输出
          manualChunks: {
            // React生态
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],

            // UI库
            'ui-vendor': [
              '@headlessui/react',
              '@radix-ui/react-accordion',
              '@radix-ui/react-dialog'
            ],

            // 动画库
            'motion-vendor': ['framer-motion', '@emotion/react'],

            // 工具库
            'utils-vendor': [
              'clsx',
              'tailwind-merge',
              'date-fns',
              'lodash-es'
            ],

            // 主题系统
            'theme-core': ['./src/themes/tokens', './src/themes/provider'],

            // 组件基础
            'component-primitives': [
              './src/components/primitives',
              './src/components/form'
            ],

            // 高级组件
            'component-advanced': [
              './src/components/overlays',
              './src/components/data-display'
            ]
          },

          // 优化导出
          exports: 'named',
          generatedCode: {
            const: 'es6',
            arrowFunctions: true
          }
        },

        // 外部依赖 (库模式)
        external: (id) => {
          // 开发时不外部化React (为了热更新)
          if (isDevelopment) return false

          // 生产时外部化主要依赖
          return [
            'react',
            'react-dom',
            'react-router-dom',
            '@emotion/react',
            '@emotion/styled'
          ].includes(id)
        }
      },

      // 压缩配置
      cssCodeSplit: true,
      cssMinify: isProduction,

      // 优化报告
      reportCompressedSize: true,
      chunkSizeWarningLimit: 1000,

      // 实验性功能
      cssTarget: 'chrome80'
    },

    // 开发服务器优化
    server: {
      port: 3001,
      strictPort: true,
      host: true,

      // 预构建优化
      preTransformRequests: true,

      // 依赖优化
      optimizeDeps: {
        include: [
          'react',
          'react-dom',
          'react-router-dom',
          '@emotion/react',
          '@emotion/styled',
          'framer-motion',
          'clsx',
          'tailwind-merge'
        ],
        exclude: [
          // 排除需要实时更新的模块
          './src/themes',
          './src/components'
        ]
      },

      // HMR优化
      hmr: {
        overlay: true,
        port: 24678
      },

      // 代理配置
      proxy: {
        '/api': {
          target: 'http://localhost:3100',
          changeOrigin: true
        }
      }
    },

    // 预览服务器
    preview: {
      port: 4173,
      strictPort: true,
      host: true
    },

    // 环境变量
    define: {
      __DEV__: isDevelopment,
      __PROD__: isProduction,
      __VERSION__: JSON.stringify(process.env.npm_package_version)
    },

    // CSS优化
    css: {
      devSourcemap: isDevelopment,
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@tokens/scss/variables.scss";`
        }
      },
      postcss: {
        plugins: [
          // 自动添加浏览器前缀
          require('autoprefixer'),
          // 压缩CSS
          isProduction && require('cssnano')({
            preset: ['default', {
              discardComments: { removeAll: true },
              normalizeWhitespace: true,
              reduceIdents: false
            }]
          }),
          // 优化@import
          require('postcss-import'),
          // CSS变量优化
          require('postcss-custom-properties')
        ].filter(Boolean)
      }
    },

    // 实验性功能
    experimental: {
      renderBuiltUrl: (filename, { hostType }) => {
        if (hostType === 'js') {
          return { js: `/${filename}` }
        } else {
          return { relative: true }
        }
      }
    }
  }
})
```

### 构建性能监控

```typescript
// scripts/build-monitor.ts
import { performance } from 'perf_hooks'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

interface BuildMetrics {
  buildTime: number
  bundleSize: number
  chunkCount: number
  dependencies: number
  cacheHitRate: number
  memoryUsage: NodeJS.MemoryUsage
}

export class BuildMonitor {
  private startTime: number = 0
  private metrics: Partial<BuildMetrics> = {}

  startBuild(): void {
    this.startTime = performance.now()
    console.log('🚀 开始构建...')
  }

  recordBuildComplete(stats: any): void {
    const endTime = performance.now()
    const buildTime = endTime - this.startTime

    this.metrics.buildTime = buildTime
    this.metrics.bundleSize = this.calculateBundleSize(stats)
    this.metrics.chunkCount = stats.assets?.length || 0
    this.metrics.dependencies = this.countDependencies(stats)
    this.metrics.memoryUsage = process.memoryUsage()

    this.displayMetrics()
    this.saveMetrics()
  }

  private calculateBundleSize(stats: any): number {
    const totalSize = stats.assets?.reduce(
      (total: number, asset: any) => total + asset.size,
      0
    ) || 0

    return Math.round(totalSize / 1024) // KB
  }

  private countDependencies(stats: any): number {
    return Object.keys(stats?.modules || {}).length
  }

  private displayMetrics(): void {
    console.log('\n📊 构建指标报告:')
    console.log('─'.repeat(50))
    console.log(`⏱️  构建时间: ${this.metrics.buildTime?.toFixed(0)}ms`)
    console.log(`📦 包大小: ${this.metrics.bundleSize}KB`)
    console.log(`🧩 模块数量: ${this.metrics.dependencies}`)
    console.log(`💾 内存使用: ${Math.round((this.metrics.memoryUsage?.heapUsed || 0) / 1024 / 1024)}MB`)

    // 性能评级
    this.displayPerformanceGrade()
  }

  private displayPerformanceGrade(): void {
    const buildTime = this.metrics.buildTime || 0
    const bundleSize = this.metrics.bundleSize || 0

    let grade = 'A'
    let color = '🟢'

    if (buildTime > 10000 || bundleSize > 500) {
      grade = 'C'
      color = '🟡'
    }

    if (buildTime > 20000 || bundleSize > 1000) {
      grade = 'D'
      color = '🔴'
    }

    console.log(`\n${color} 性能评级: ${grade}`)
    console.log('─'.repeat(50))
  }

  private async saveMetrics(): Promise<void> {
    try {
      const metricsPath = join(dirname(fileURLToPath(import.meta.url)), '../build-metrics.json')
      const fs = await import('fs/promises')

      const historicalData = await this.loadHistoricalMetrics()
      const newMetrics = {
        timestamp: new Date().toISOString(),
        ...this.metrics
      }

      historicalData.push(newMetrics)

      // 只保留最近30次构建记录
      if (historicalData.length > 30) {
        historicalData.splice(0, historicalData.length - 30)
      }

      await fs.writeFile(metricsPath, JSON.stringify(historicalData, null, 2))
      console.log(`💾 指标已保存到: ${metricsPath}`)

    } catch (error) {
      console.error('❌ 保存构建指标失败:', error)
    }
  }

  private async loadHistoricalMetrics(): Promise<any[]> {
    try {
      const metricsPath = join(dirname(fileURLToPath(import.meta.url)), '../build-metrics.json')
      const fs = await import('fs/promises')
      const data = await fs.readFile(metricsPath, 'utf-8')
      return JSON.parse(data)
    } catch {
      return []
    }
  }

  // 缓存性能分析
  analyzeCachePerformance(): void {
    console.log('\n🗄️ 缓存性能分析:')
    console.log('─'.repeat(30))

    // 分析Vite缓存
    this.analyzeViteCache()

    // 分析依赖缓存
    this.analyzeDependencyCache()
  }

  private analyzeViteCache(): void {
    const cachePath = join(dirname(fileURLToPath(import.meta.url)), '../node_modules/.vite')
    // 实现缓存分析逻辑
    console.log('Vite缓存目录:', cachePath)
  }

  private analyzeDependencyCache(): void {
    const cachePath = join(dirname(fileURLToPath(import.meta.url)), '../node_modules/.cache')
    // 实现依赖缓存分析
    console.log('依赖缓存目录:', cachePath)
  }
}

// 使用示例
const buildMonitor = new BuildMonitor()

// 在构建开始时调用
buildMonitor.startBuild()

// 在构建完成后调用 (在Vite钩子中)
// buildMonitor.recordBuildComplete(stats)
```

---

## 🚀 Next.js 构建优化

### 优化配置

```typescript
// next.config.js (优化版本)
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 实验性功能
  experimental: {
    // Turbopack (开发模式加速)
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js'
        }
      }
    },

    // App Router优化
    appDir: true,

    // 服务器组件
    serverComponentsExternalPackages: [
      '@xorigo-ui/tokens',
      '@xorigo-ui/utils'
    ],

    // 优化构建
    optimizeCss: true,
    optimizeServerReact: true,

    // 边缘运行时
    runtime: 'edge'
  },

  // 构建优化
  swcMinify: true,
  compiler: {
    // 移除console.log
    removeConsole: process.env.NODE_ENV === 'production',

    // 优化React
    reactRemoveProperties: process.env.NODE_ENV === 'production',

    // 样式组件优化
    styledComponents: true,

    // 情感CSS优化
    emotion: {
      sourceMap: process.env.NODE_ENV === 'development',
      autoLabel: 'dev-only'
    }
  },

  // 图片优化
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1年
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    loader: 'custom',
    loaderFile: './scripts/image-loader.js'
  },

  // 输出配置
  output: 'standalone',
  distDir: 'dist',

  // 压缩配置
  compress: true,

  // 生成ETag
  generateEtags: true,

  // Power by header
  poweredByHeader: false,

  // HTTP头设置
  headers: async () => [
    {
      source: '/_next/static/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable'
        }
      ]
    },
    {
      source: '/api/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-store, no-cache, must-revalidate'
        }
      ]
    }
  ],

  // 重定向配置
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true
      }
    ]
  },

  // Webpack配置
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // 开发模式优化
    if (dev) {
      // 开发时不压缩
      config.optimization.minimize = false

      // 快速刷新
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300
      }
    }

    // 生产模式优化
    if (!dev && !isServer) {
      // 代码分割
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          // React核心
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all'
          },

          // 路由
          router: {
            test: /[\\/]node_modules[\\/]react-router[\\/]/,
            name: 'router',
            chunks: 'all'
          },

          // UI库
          ui: {
            test: /[\\/]node_modules[\\/](@headlessui|@radix-ui)[\\/]/,
            name: 'ui',
            chunks: 'all'
          },

          // 工具库
          utils: {
            test: /[\\/]node_modules[\\/](lodash|date-fns|clsx)[\\/]/,
            name: 'utils',
            chunks: 'all'
          },

          // 样式相关
          styles: {
            test: /\.(css|scss|sass)$/,
            name: 'styles',
            chunks: 'all',
            enforce: true
          }
        }
      }

      // Tree shaking
      config.optimization.usedExports = true
      config.optimization.sideEffects = false
    }

    // 别名解析
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': './src',
      '@components': './src/components',
      '@tokens': './src/tokens',
      '@hooks': './src/hooks',
      '@utils': './src/utils',
      '@types': './src/types'
    }

    // TypeScript优化
    config.resolve.extensions = ['.tsx', '.ts', '.jsx', '.js']

    // 加载器优化
    config.module.rules.push({
      test: /\.(woff2?|eot|ttf|otf)$/,
      type: 'asset/resource',
      generator: {
        filename: 'fonts/[name].[hash][ext]'
      }
    })

    // SVG优化
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgo: true,
            svgoConfig: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      removeViewBox: false
                    }
                  }
                }
              ]
            }
          }
        }
      ]
    })

    return config
  },

  // 环境变量
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY
  }
}

module.exports = nextConfig
```

### Workbench特定优化

```typescript
// apps/website/next.config.workbench.js
const { withWorkbench } = require('@xorigo-ui/next-workbench')

const workbenchConfig = withWorkbench({
  // Workbench特定配置
  workbench: {
    // 组件预优化
    componentPreload: true,

    // Monaco编辑器优化
    monaco: {
      languages: ['typescript', 'javascript', 'css', 'html'],
      themes: ['vs-dark', 'vs-light'],
      features: [
        'bracketMatching',
        'colorPicker',
        'folding',
        'format',
        'hover',
        'suggest'
      ]
    },

    // 文件系统优化
    fileSystem: {
      watchFiles: ['**/*.tsx', '**/*.ts', '**/*.css'],
      ignoreFiles: ['**/node_modules/**', '**/.next/**', '**/dist/**']
    },

    // 缓存策略
    cache: {
      enabled: true,
      ttl: 3600, // 1小时
      maxSize: '100MB'
    }
  },

  // 性能优化
  performance: {
    // 启用gzip压缩
    gzip: true,

    // 启用brotli压缩
    brotli: true,

    // 资源提示
    preload: ['/monaco-editor/min/vs/editor/editor.main.js'],
    prefetch: ['/api/components', '/api/themes']
  }
})

module.exports = workbenchConfig
```

---

## 📦 包体积优化策略

### 组件库Tree Shaking

```typescript
// packages/core/src/index.ts (优化版本)
// 使用明确的导出策略，支持Tree Shaking

// 基础导出 (按需)
export { Button } from './primitives/button'
export { Card } from './primitives/card'
export { Input } from './form/input'
export { Select } from './form/select'
export { Dialog } from './overlays/dialog'
export { Table } from './data-display/table'

// 类型导出 (分离)
export type { ButtonProps } from './primitives/button'
export type { CardProps } from './primitives/card'
export type { InputProps } from './form/input'
export type { SelectProps } from './form/select'
export type { DialogProps } from './overlays/dialog'
export type { TableProps } from './data-display/table'

// 主题系统导出
export { ThemeProvider, useTheme } from './system/theme-provider'
export { ThemeRecipe, ThemeAxis } from './types/theme'

// 工具函数导出
export { cn } from './utils/cn'
export { clsx } from './utils/clsx'

// 构建时标记 (用于优化)
export const COMPONENT_LIBRARY_VERSION = '2.0.0'
export const BUILD_TIMESTAMP = new Date().toISOString()
```

### 动态导入优化

```typescript
// packages/core/src/components/lazy-components.ts
// 大型组件的懒加载

import { lazy } from 'react'

// 懒加载大型组件
export const LazyDataTable = lazy(() =>
  import('./data-display/data-table').then(module => ({
    default: module.DataTable
  }))
)

export const LazyCodeEditor = lazy(() =>
  import('./showcase/code-editor').then(module => ({
    default: module.CodeEditor
  }))
)

export const LazyColorPicker = lazy(() =>
  import('./form/color-picker').then(module => ({
    default: module.ColorPicker
  }))
)

// 条件加载 (基于环境)
export const loadDevComponents = async () => {
  if (process.env.NODE_ENV === 'development') {
    const { DevPanel } = await import('./dev/dev-panel')
    const { ComponentInspector } = await import('./dev/component-inspector')

    return { DevPanel, ComponentInspector }
  }

  return {}
}

// 特性标志加载
export const loadExperimentalComponents = async (flags: Record<string, boolean>) => {
  const components: Record<string, any> = {}

  if flags.aiAssistant) {
    const { AIAssistant } = await import('./experimental/ai-assistant')
    components.AIAssistant = AIAssistant
  }

  if.flags.realTimeCollab) {
    const { CollaborationPanel } = await import('./experimental/collaboration')
    components.CollaborationPanel = CollaborationPanel
  }

  return components
}
```

### 资源优化

```typescript
// scripts/optimize-assets.ts
import { execSync } from 'child_process'
import { readdir, writeFile } from 'fs/promises'
import { join, extname } from 'path'

interface AssetOptimizationResult {
  originalSize: number
  optimizedSize: number
  compression: number
  files: string[]
}

export class AssetOptimizer {
  private readonly imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp']
  private readonly fontExtensions = ['.woff', '.woff2', '.ttf', '.otf']

  async optimizeAssets(directory: string): Promise<AssetOptimizationResult> {
    const files = await this.scanDirectory(directory)
    const results = []

    for (const file of files) {
      const ext = extname(file).toLowerCase()

      if (this.imageExtensions.includes(ext)) {
        await this.optimizeImage(file)
      } else if (this.fontExtensions.includes(ext)) {
        await this.optimizeFont(file)
      }

      results.push(file)
    }

    return this.calculateSavings(directory, results)
  }

  private async scanDirectory(directory: string): Promise<string[]> {
    const files: string[] = []
    const entries = await readdir(directory, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(directory, entry.name)

      if (entry.isDirectory()) {
        files.push(...await this.scanDirectory(fullPath))
      } else {
        files.push(fullPath)
      }
    }

    return files.filter(file => {
      const ext = extname(file).toLowerCase()
      return [...this.imageExtensions, ...this.fontExtensions].includes(ext)
    })
  }

  private async optimizeImage(filePath: string): Promise<void> {
    const ext = extname(filePath).toLowerCase()

    switch (ext) {
      case '.png':
        await this.optimizePNG(filePath)
        break
      case '.jpg':
      case '.jpeg':
        await this.optimizeJPEG(filePath)
        break
      case '.svg':
        await this.optimizeSVG(filePath)
        break
      case '.webp':
        await this.optimizeWebP(filePath)
        break
    }
  }

  private async optimizePNG(filePath: string): Promise<void> {
    try {
      // 使用optipng优化PNG
      execSync(`optipng -o7 -strip all "${filePath}"`, { stdio: 'ignore' })

      // 使用pngquant进一步压缩
      execSync(`pngquant --quality=65-80 --output "${filePath}" --force "${filePath}"`, {
        stdio: 'ignore'
      })
    } catch (error) {
      console.warn(`PNG优化失败: ${filePath}`, error)
    }
  }

  private async optimizeJPEG(filePath: string): Promise<void> {
    try {
      // 使用mozjpeg优化JPEG
      execSync(`cjpeg -optimize -progressive -quality 80 "${filePath}" > "${filePath}.tmp"`, {
        stdio: 'ignore'
      })

      // 替换原文件
      execSync(`mv "${filePath}.tmp" "${filePath}"`, { stdio: 'ignore' })
    } catch (error) {
      console.warn(`JPEG优化失败: ${filePath}`, error)
    }
  }

  private async optimizeSVG(filePath: string): Promise<void> {
    try {
      // 使用SVGO优化SVG
      execSync(`svgo --config svgo.config.js "${filePath}"`, { stdio: 'ignore' })
    } catch (error) {
      console.warn(`SVG优化失败: ${filePath}`, error)
    }
  }

  private async optimizeWebP(filePath: string): Promise<void> {
    try {
      // WebP通常已经很优化，主要进行无损压缩
      execSync(`cwebp -quiet -q 80 "${filePath}" -o "${filePath}.tmp"`, {
        stdio: 'ignore'
      })

      execSync(`mv "${filePath}.tmp" "${filePath}"`, { stdio: 'ignore' })
    } catch (error) {
      console.warn(`WebP优化失败: ${filePath}`, error)
    }
  }

  private async optimizeFont(filePath: string): Promise<void> {
    const ext = extname(filePath).toLowerCase()

    try {
      if (ext === '.woff' || ext === '.ttf' || ext === '.otf') {
        // 转换为WOFF2 (更好的压缩)
        const woff2Path = filePath.replace(ext, '.woff2')
        execSync(`woff2_compress "${filePath}"`, { stdio: 'ignore' })

        console.log(`字体已转换为WOFF2: ${woff2Path}`)
      }
    } catch (error) {
      console.warn(`字体优化失败: ${filePath}`, error)
    }
  }

  private async calculateSavings(directory: string, files: string[]): Promise<AssetOptimizationResult> {
    // 实现大小计算逻辑
    const originalSize = 0 // 计算原始大小
    const optimizedSize = 0 // 计算优化后大小
    const compression = originalSize > 0 ? ((originalSize - optimizedSize) / originalSize) * 100 : 0

    return {
      originalSize,
      optimizedSize,
      compression,
      files
    }
  }
}

// SVGO配置文件
// svgo.config.js
export const svgoConfig = {
  plugins: [
    'removeDoctype',
    'removeXMLProcInst',
    'removeComments',
    'removeMetadata',
    'removeUselessDefs',
    'cleanupIDs',
    'minifyStyles',
    'convertPathData',
    'convertTransform',
    'removeUnknownsAndDefaults',
    'removeNonInheritableGroupAttrs',
    'removeUselessStrokeAndFill',
    'removeUnusedNS',
    'cleanupNumericValues',
    'cleanupListOfValues',
    'convertColors',
    'removeEmptyAttrs',
    'removeEmptyContainers',
    'mergePaths',
    'removeUnusedNS',
    'sortAttrs'
  ]
}
```

---

## 🚀 缓存策略优化

### 多级缓存系统

```typescript
// scripts/cache-manager.ts
import { createHash } from 'crypto'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { join } from 'path'

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
  hash: string
  version: string
}

export class CacheManager {
  private memoryCache = new Map<string, CacheEntry<any>>()
  private diskCachePath: string
  private version: string

  constructor(cachePath: string, version: string) {
    this.diskCachePath = cachePath
    this.version = version
  }

  // 内存缓存
  async get<T>(key: string): Promise<T | null> {
    // 1. 检查内存缓存
    const memoryEntry = this.memoryCache.get(key)
    if (memoryEntry && !this.isExpired(memoryEntry)) {
      return memoryEntry.data
    }

    // 2. 检查磁盘缓存
    const diskEntry = await this.getFromDisk<T>(key)
    if (diskEntry && !this.isExpired(diskEntry)) {
      // 恢复到内存缓存
      this.memoryCache.set(key, diskEntry)
      return diskEntry.data
    }

    return null
  }

  async set<T>(key: string, data: T, ttl: number = 3600): Promise<void> {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      hash: this.generateHash(data),
      version: this.version
    }

    // 设置内存缓存
    this.memoryCache.set(key, entry)

    // 异步设置磁盘缓存
    this.setToDisk(key, entry).catch(error => {
      console.warn('磁盘缓存写入失败:', error)
    })
  }

  private async getFromDisk<T>(key: string): Promise<CacheEntry<T> | null> {
    try {
      const filePath = this.getCacheFilePath(key)
      const data = await readFile(filePath, 'utf-8')
      const entry = JSON.parse(data) as CacheEntry<T>

      // 版本检查
      if (entry.version !== this.version) {
        return null // 版本不匹配，忽略缓存
      }

      return entry
    } catch {
      return null
    }
  }

  private async setToDisk<T>(key: string, entry: CacheEntry<T>): Promise<void> {
    try {
      const filePath = this.getCacheFilePath(key)
      const data = JSON.stringify(entry)

      // 确保目录存在
      await mkdir(this.diskCachePath, { recursive: true })

      await writeFile(filePath, data, 'utf-8')
    } catch (error) {
      console.error('磁盘缓存写入失败:', error)
      throw error
    }
  }

  private getCacheFilePath(key: string): string {
    const hash = createHash('md5').update(key).digest('hex')
    return join(this.diskCachePath, `${hash}.json`)
  }

  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > entry.ttl * 1000
  }

  private generateHash(data: any): string {
    return createHash('md5').update(JSON.stringify(data)).digest('hex')
  }

  // 清理过期缓存
  async cleanup(): Promise<void> {
    // 清理内存缓存
    for (const [key, entry] of this.memoryCache) {
      if (this.isExpired(entry)) {
        this.memoryCache.delete(key)
      }
    }

    // 清理磁盘缓存
    // 实现磁盘缓存清理逻辑
  }

  // 获取缓存统计
  getStats() {
    return {
      memorySize: this.memoryCache.size,
      hitRate: this.calculateHitRate(),
      memoryUsage: this.calculateMemoryUsage()
    }
  }

  private calculateHitRate(): number {
    // 实现命中率计算
    return 0.95 // 示例值
  }

  private calculateMemoryUsage(): number {
    let totalSize = 0
    for (const [key, entry] of this.memoryCache) {
      totalSize += JSON.stringify(entry).length
    }
    return totalSize
  }
}

// 构建缓存管理器
export class BuildCacheManager extends CacheManager {
  constructor() {
    super(join(process.cwd(), '.next/cache/build'), process.env.npm_package_version || '1.0.0')
  }

  // 缓存构建结果
  async cacheBuildResult(buildHash: string, result: any): Promise<void> {
    await this.set(`build:${buildHash}`, result, 86400) // 24小时
  }

  // 获取缓存的构建结果
  async getCachedBuildResult(buildHash: string): Promise<any | null> {
    return this.get(`build:${buildHash}`)
  }

  // 缓存依赖分析结果
  async cacheDependencyAnalysis(depsHash: string, analysis: any): Promise<void> {
    await this.set(`deps:${depsHash}`, analysis, 3600) // 1小时
  }

  // 获取缓存的依赖分析
  async getCachedDependencyAnalysis(depsHash: string): Promise<any | null> {
    return this.get(`deps:${depsHash}`)
  }
}
```

### CDN缓存策略

```typescript
// scripts/cdn-deploy.ts
export class CDNDeployer {
  private cdnConfig: CDNConfig

  constructor(config: CDNConfig) {
    this.cdnConfig = config
  }

  async deploy(buildPath: string): Promise<DeploymentResult> {
    const result: DeploymentResult = {
      files: [],
      totalSize: 0,
      cacheConfig: {}
    }

    // 1. 分析文件类型
    const files = await this.analyzeFiles(buildPath)

    // 2. 应用不同的缓存策略
    for (const file of files) {
      const cacheConfig = this.getCacheConfig(file)

      result.files.push({
        path: file.path,
        size: file.size,
        cacheConfig
      })

      result.totalSize += file.size
    }

    // 3. 上传到CDN
    await this.uploadToCDN(files)

    // 4. 配置缓存规则
    await this.configureCacheRules(result.files)

    return result
  }

  private async analyzeFiles(buildPath: string): Promise<FileInfo[]> {
    // 实现文件分析逻辑
    return []
  }

  private getCacheConfig(file: FileInfo): CacheConfig {
    const ext = file.path.split('.').pop()?.toLowerCase()

    switch (ext) {
      case 'js':
      case 'css':
        return {
          cacheControl: 'public, max-age=31536000, immutable',
          vary: ['Accept-Encoding']
        }

      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'webp':
      case 'svg':
        return {
          cacheControl: 'public, max-age=31536000, immutable',
          vary: ['Accept-Encoding', 'Accept']
        }

      case 'woff2':
      case 'woff':
        return {
          cacheControl: 'public, max-age=31536000, immutable',
          vary: ['Accept-Encoding']
        }

      case 'html':
        return {
          cacheControl: 'public, max-age=0, must-revalidate',
          vary: ['Accept-Encoding', 'Cookie']
        }

      default:
        return {
          cacheControl: 'public, max-age=3600'
        }
    }
  }
}

interface CDNConfig {
  provider: 'cloudflare' | 'aws' | 'vercel'
  endpoint: string
  apiKey: string
  zoneId?: string
}

interface FileInfo {
  path: string
  size: number
  hash: string
}

interface CacheConfig {
  cacheControl: string
  vary?: string[]
  edgeTTL?: number
  browserTTL?: number
}

interface DeploymentResult {
  files: Array<{
    path: string
    size: number
    cacheConfig: CacheConfig
  }>
  totalSize: number
  cacheConfig: Record<string, CacheConfig>
}
```

---

## 📊 性能监控和分析

### 构建性能分析

```typescript
// scripts/build-analyzer.ts
export class BuildAnalyzer {
  private buildMetrics: BuildMetrics[] = []

  async analyzeBuild(buildPath: string): Promise<BuildReport> {
    const report: BuildReport = {
      timestamp: new Date(),
      bundles: [],
      totalSize: 0,
      compressionRatio: 0,
      recommendations: []
    }

    // 1. 分析bundle文件
    const bundles = await this.analyzeBundles(buildPath)
    report.bundles = bundles

    // 2. 计算总大小
    report.totalSize = bundles.reduce((total, bundle) => total + bundle.size, 0)

    // 3. 计算压缩比
    report.compressionRatio = await this.calculateCompressionRatio(bundles)

    // 4. 生成优化建议
    report.recommendations = this.generateRecommendations(bundles)

    // 5. 保存分析结果
    await this.saveReport(report)

    return report
  }

  private async analyzeBundles(buildPath: string): Promise<BundleInfo[]> {
    const bundles: BundleInfo[] = []

    // 分析JavaScript文件
    const jsFiles = await this.globFiles(buildPath, '**/*.js')
    for (const file of jsFiles) {
      const analysis = await this.analyzeJavaScriptFile(file)
      bundles.push(analysis)
    }

    // 分析CSS文件
    const cssFiles = await this.globFiles(buildPath, '**/*.css')
    for (const file of cssFiles) {
      const analysis = await this.analyzeCSSFile(file)
      bundles.push(analysis)
    }

    return bundles
  }

  private async analyzeJavaScriptFile(filePath: string): Promise<BundleInfo> {
    const content = await readFile(filePath, 'utf-8')
    const stats = await stat(filePath)

    return {
      path: filePath,
      size: stats.size,
      gzippedSize: await this.calculateGzipSize(content),
      type: 'javascript',
      dependencies: await this.extractDependencies(content),
      unusedExports: await this.detectUnusedExports(content),
      optimizationScore: this.calculateOptimizationScore(content)
    }
  }

  private async analyzeCSSFile(filePath: string): Promise<BundleInfo> {
    const content = await readFile(filePath, 'utf-8')
    const stats = await stat(filePath)

    return {
      path: filePath,
      size: stats.size,
      gzippedSize: await this.calculateGzipSize(content),
      type: 'css',
      selectors: await this.extractCSSSelectors(content),
      unusedRules: await this.detectUnusedCSSRules(content),
      optimizationScore: this.calculateCSSOptimizationScore(content)
    }
  }

  private generateRecommendations(bundles: BundleInfo[]): string[] {
    const recommendations: string[] = []

    // 分析bundle大小
    const largeBundles = bundles.filter(b => b.size > 1024 * 1024) // > 1MB
    if (largeBundles.length > 0) {
      recommendations.push(`发现 ${largeBundles.length} 个过大的bundle，建议进行代码分割`)
    }

    // 分析压缩效果
    const poorlyCompressed = bundles.filter(b =>
      b.gzippedSize > b.size * 0.8
    )
    if (poorlyCompressed.length > 0) {
      recommendations.push('某些文件压缩效果不佳，建议检查压缩配置')
    }

    // 分析依赖
    const heavyDependencies = this.findHeavyDependencies(bundles)
    if (heavyDependencies.length > 0) {
      recommendations.push(`发现重型依赖: ${heavyDependencies.join(', ')}，考虑替换或按需加载`)
    }

    return recommendations
  }

  private async calculateCompressionRatio(bundles: BundleInfo[]): Promise<number> {
    const originalSize = bundles.reduce((total, b) => total + b.size, 0)
    const compressedSize = bundles.reduce((total, b) => total + b.gzippedSize, 0)

    return originalSize > 0 ? ((originalSize - compressedSize) / originalSize) * 100 : 0
  }
}

interface BuildReport {
  timestamp: Date
  bundles: BundleInfo[]
  totalSize: number
  compressionRatio: number
  recommendations: string[]
}

interface BundleInfo {
  path: string
  size: number
  gzippedSize: number
  type: 'javascript' | 'css'
  dependencies?: string[]
  unusedExports?: string[]
  selectors?: string[]
  unusedRules?: string[]
  optimizationScore: number
}
```

---

## 📋 实施清单

### Phase 1: Vite优化 (2周)

- [ ] **构建配置优化**
  - [ ] Vite配置重构
  - [ ] 代码分割策略
  - [ ] Tree Shaking优化
  - [ ] 外部依赖配置

- [ ] **开发体验优化**
  - [ ] HMR性能提升
  - [ ] 依赖预构建优化
  - [ ] TypeScript检查加速
  - [ ] 源码映射优化

- [ ] **构建性能监控**
  - [ ] 构建时间监控
  - [ ] 内存使用分析
  - [ ] 缓存效率统计
  - [ ] 性能报告生成

### Phase 2: Next.js优化 (2周)

- [ ] **生产构建优化**
  - [ ] Webpack配置优化
  - [ ] 代码分割策略
  - [ ] 图片优化配置
  - [ ] 压缩配置调优

- [ ] **Workbench专项优化**
  - [ ] Monaco Editor优化
  - [ ] 组件预加载
  - [ ] 文件系统优化
  - [ ] 实时协作优化

- [ ] **资源优化**
  - [ ] 图片压缩流程
  - [ ] 字体优化策略
  - [ ] SVG优化
  - [ ] 静态资源CDN

### Phase 3: 缓存和部署 (1周)

- [ ] **多级缓存系统**
  - [ ] 内存缓存实现
  - [ ] 磁盘缓存策略
  - [ ] CDN缓存配置
  - [ ] 缓存失效策略

- [ ] **性能分析工具**
  - [ ] Bundle分析器
  - [ ] 性能监控面板
  - [ ] 优化建议引擎
  - [ ] 回归测试

---

**文档版本**: v2.0
**最后更新**: 2025-10-31
**下次审查**: 2025-12-01
**状态**: ✅ 构建优化方案完成，准备实施