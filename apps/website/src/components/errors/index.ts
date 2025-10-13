/**
 * 错误边界组件统一导出
 *
 * 三层错误边界系统:
 * 1. RootErrorBoundary - 全局错误边界 (应用级别)
 * 2. PageErrorBoundary - 页面错误边界 (页面级别)
 * 3. PlaygroundErrorBoundary - Playground专用错误边界 (功能级别)
 * 4. MDXErrorBoundary - MDX文档渲染错误边界 (功能级别)
 * 5. ErrorFallback - 通用错误回退UI组件
 */

// 核心错误边界组件
export { RootErrorBoundary } from './RootErrorBoundary'
export { PageErrorBoundary } from './PageErrorBoundary'
export { PlaygroundErrorBoundary } from './PlaygroundErrorBoundary'
export { MDXErrorBoundary } from './MDXErrorBoundary'

// 错误回退UI组件
export { ErrorFallback, type ErrorFallbackProps } from './ErrorFallback'

// 工具函数
export const createErrorBoundary = (type: 'root' | 'page' | 'playground' | 'mdx') => {
  switch (type) {
    case 'root':
      return RootErrorBoundary
    case 'page':
      return PageErrorBoundary
    case 'playground':
      return PlaygroundErrorBoundary
    case 'mdx':
      return MDXErrorBoundary
    default:
      throw new Error(`Unknown error boundary type: ${type}`)
  }
}

// 错误边界配置
export const ErrorBoundaryConfig = {
  // 默认重试次数
  maxRetries: 3,

  // 错误报告服务
  errorReporting: {
    enabled: process.env.NODE_ENV === 'production',
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
  },

  // 开发模式配置
  development: {
    showComponentStack: true,
    showErrorDetails: true,
    enableHotReload: true,
  },

  // 生产模式配置
  production: {
    showComponentStack: false,
    showErrorDetails: false,
    enableUserFeedback: true,
  },
}

// 错误分类工具
export const classifyError = (error: Error): 'critical' | 'warning' | 'info' => {
  const message = error.message.toLowerCase()

  if (message.includes('chunk') && message.includes('load')) {
    return 'warning' // 代码块加载失败 - 警告级别
  }

  if (message.includes('network') || message.includes('timeout')) {
    return 'warning' // 网络问题 - 警告级别
  }

  if (message.includes('permission') || message.includes('unauthorized')) {
    return 'warning' // 权限问题 - 警告级别
  }

  if (message.includes('hydration')) {
    return 'warning' // 水合错误 - 警告级别
  }

  return 'critical' // 其他错误 - 严重级别
}

// 默认导出所有错误边界
export default {
  RootErrorBoundary,
  PageErrorBoundary,
  PlaygroundErrorBoundary,
  MDXErrorBoundary,
  ErrorFallback,
  createErrorBoundary,
  ErrorBoundaryConfig,
  classifyError,
}
