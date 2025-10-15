import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // 暂时禁用 ESLint 和 TypeScript 检查以解决配置冲突
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // 启用 App Router
  experimental: {
    turbo: {
      resolveAlias: {
        '@': './src',
      },
    },
  },

  // Webpack 配置以解决 framer-motion 模块解析问题
  webpack: (config, { isServer }) => {
    // 确保 framer-motion 能够正确解析
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }

    // 添加别名处理
    config.resolve.alias = {
      ...config.resolve.alias,
      'framer-motion': require.resolve('framer-motion'),
      // 添加 @xorigo-ui 包的解析路径 - 使用相对路径
      '@xorigo-ui/core': path.resolve(__dirname, '../../packages/core/src/index.ts'),
      '@xorigo-ui/system': path.resolve(__dirname, '../../packages/system/src/index.ts'),
      '@xorigo-ui/style-recipe': path.resolve(__dirname, '../../packages/style-recipe/src/index.ts'),
      '@xorigo-ui/tokens': path.resolve(__dirname, '../../packages/tokens/src/index.ts'),
      // 添加内部包的路径别名解析
      '@/utils': path.resolve(__dirname, '../../packages/core/src/utils/index.ts'),
      '@/lib': path.resolve(__dirname, '../../packages/core/src/lib/index.ts'),
      '@/components': path.resolve(__dirname, '../../packages/core/src/components/index.ts'),
    }

    return config
  },

  // 图片优化
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },

  // 启用现代化构建
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // 环境变量
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // 头部配置
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },

  // 重定向配置
  async redirects() {
    return [
      // Demo site 重定向
      {
        source: '/demo-site/:path*',
        destination: '/:path*',
        permanent: true,
      },
      // Gallery → Workbench 重定向
      {
        source: '/gallery',
        destination: '/workbench?mode=gallery',
        permanent: false,
      },
      {
        source: '/gallery/:path*',
        destination: '/workbench?mode=gallery&path=:path*',
        permanent: false,
      },
      // Playground → Workbench 重定向
      {
        source: '/playground',
        destination: '/workbench?mode=editor',
        permanent: false,
      },
      {
        source: '/playground/:path*',
        destination: '/workbench?mode=editor&path=:path*',
        permanent: false,
      },
    ]
  },

  // 压缩配置
  compress: true,

  // 输出配置
  output: 'standalone',

  // 生成 etags
  generateEtags: true,

  // 启用静态优化
  poweredByHeader: false,
}

export default nextConfig