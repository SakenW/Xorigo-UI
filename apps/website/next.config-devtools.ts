/**
 * Next.js DevTools 增强配置
 * 添加此配置到 next.config.ts 以启用 DevTools
 */

import type { NextConfig } from 'next'

export const devToolsConfig: Partial<NextConfig> = {
  // 启用实验性功能
  experimental: {
    // 启用 Server Actions 日志
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: ['localhost:3000']
    }
  },

  // 优化配置
  compiler: {
    // 生产环境移除 console
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false
  },

  // Webpack 配置
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // 开发环境启用 source maps
      config.devtool = 'eval-source-map'

      // Bundle 分析
      if (process.env.ANALYZE === 'true') {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: './analyze/client.html',
            openAnalyzer: false
          })
        )
      }
    }

    return config
  },

  // 性能监控
  onDemandEntries: {
    // 页面缓存时间
    maxInactiveAge: 25 * 1000,
    // 同时保持的页面数
    pagesBufferLength: 5
  }
}

/**
 * 合并到现有配置
 *
 * 使用方式 (next.config.ts):
 *
 * import { devToolsConfig } from './next.config-devtools'
 *
 * const config: NextConfig = {
 *   ...existingConfig,
 *   ...devToolsConfig
 * }
 *
 * export default config
 */
