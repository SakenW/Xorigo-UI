'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@xorigo-ui/core'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    console.error('Root Error Boundary caught an error:', error)

    // 错误上报逻辑
    if (process.env.NODE_ENV === 'production') {
      // 这里可以集成 Sentry 或其他错误上报服务
      // Sentry.captureException(error)
    }
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          页面出错了
        </h1>

        <p className="text-gray-600 mb-6">
          抱歉，页面遇到了一个错误。我们已经记录了这个问题。
        </p>

        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg text-left">
            <p className="text-sm font-medium text-red-800 mb-2">错误详情:</p>
            <p className="text-xs text-red-600 font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-500 mt-2">
                错误ID: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="space-y-3">
          <Button
            onClick={reset}
            className="w-full"
            variant="outline"
          >
            重试
          </Button>

          <Button
            onClick={() => router.push('/')}
            className="w-full"
          >
            返回首页
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          如果问题持续存在，请联系技术支持。
        </p>
      </div>
    </div>
  )
}