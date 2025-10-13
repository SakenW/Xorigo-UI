'use client'

import { useEffect } from 'react'
import { ErrorFallback } from '@/components/errors'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // 记录错误到错误报告服务
    console.error('应用级错误:', error)

    // 上报到 Sentry (如果已配置)
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(error, {
        tags: {
          errorBoundary: 'nextjs-app',
          area: 'application-level',
        },
        extra: {
          digest: error.digest,
        },
      })
    }
  }, [error])

  const handleReset = () => {
    reset()
  }

  const handleGoHome = () => {
    window.location.href = '/'
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <ErrorFallback
      error={error}
      title="应用遇到严重错误"
      description="这是一个应用级别的错误，我们已经记录了这个问题"
      showErrorDetails={process.env.NODE_ENV === 'development'}
      onReset={handleReset}
      actions={
        <>
          <button
            onClick={handleRefresh}
            className="flex-1 px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            刷新页面
          </button>
          <button
            onClick={handleGoHome}
            className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            返回首页
          </button>
        </>
      }
      variant="error"
    />
  )
}