/**
 * Bundle 分析工具
 * 用于分析 Next.js 构建产物大小和组成
 */

import type { BundleAnalysis } from './performance/types'

/**
 * 分析构建产物大小
 */
export async function analyzeBundleSize(): Promise<BundleAnalysis> {
  // 在生产环境中，这些数据应该从构建过程中收集
  // 这里提供一个模拟实现

  const chunks: BundleAnalysis['chunks'] = [
    {
      name: 'main',
      size: 245000,
      modules: 120
    },
    {
      name: 'vendors',
      size: 180000,
      modules: 50
    },
    {
      name: 'runtime',
      size: 25000,
      modules: 10
    }
  ]

  const largestModules: BundleAnalysis['largestModules'] = [
    {
      name: 'react-dom',
      size: 120000
    },
    {
      name: 'framer-motion',
      size: 85000
    },
    {
      name: 'next',
      size: 75000
    },
    {
      name: 'lucide-react',
      size: 45000
    },
    {
      name: '@xorigo-ui/core',
      size: 40000
    }
  ]

  const duplicates: BundleAnalysis['duplicates'] = []

  const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0)

  return {
    totalSize,
    chunks,
    largestModules,
    duplicates
  }
}

/**
 * 获取构建统计信息
 */
export async function getBuildStats() {
  try {
    // 尝试读取 Next.js 构建统计文件
    const response = await fetch('/.next/build-manifest.json')
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.warn('无法读取构建统计:', error)
  }

  return null
}

/**
 * 计算 Bundle 大小建议
 */
export function getBundleSizeRecommendations(analysis: BundleAnalysis): string[] {
  const recommendations: string[] = []

  // 检查总大小
  if (analysis.totalSize > 500000) {
    recommendations.push('📦 总 Bundle 大小超过 500KB，考虑代码分割和懒加载')
  }

  // 检查最大模块
  const largeModules = analysis.largestModules.filter((m) => m.size > 100000)
  if (largeModules.length > 0) {
    recommendations.push(
      `📊 发现 ${largeModules.length} 个超过 100KB 的大模块，考虑动态导入`
    )
  }

  // 检查重复依赖
  if (analysis.duplicates.length > 0) {
    recommendations.push(
      `🔄 发现 ${analysis.duplicates.length} 个重复依赖，优化依赖版本`
    )
  }

  // 检查 vendors chunk
  const vendorsChunk = analysis.chunks.find((c) => c.name === 'vendors')
  if (vendorsChunk && vendorsChunk.size > 200000) {
    recommendations.push('🔧 Vendors chunk 过大，考虑拆分第三方依赖')
  }

  if (recommendations.length === 0) {
    recommendations.push('✅ Bundle 大小在合理范围内')
  }

  return recommendations
}
