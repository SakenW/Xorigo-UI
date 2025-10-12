import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,

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
      {
        source: '/demo-site/:path*',
        destination: '/:path*',
        permanent: true,
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