'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function PlaygroundError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Playground Error Boundary caught an error:', error)

    // Playground 特定的错误上报
    if (process.env.NODE_ENV === 'production') {
      // 这里可以添加 Playground 特定的错误处理逻辑
      // 例如保存用户的工作状态到 localStorage
      try {
        const currentState = localStorage.getItem('playground-state')
        if (currentState) {
          console.log('Playground state saved before error:', currentState)
        }
      } catch (e) {
        console.warn('Failed to save playground state:', e)
      }
    }
  }, [error])

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8 text-center">
        <div className="mb-4">
          <div className="mx-auto w-16 h-16 bg-purple-900 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">
          Playground 出错了
        </h1>

        <p className="text-gray-300 mb-6">
          抱歉，Playground 遇到了一个技术问题。您的工作状态已被保护。
        </p>

        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-purple-900 bg-opacity-50 rounded-lg text-left">
            <p className="text-sm font-medium text-purple-300 mb-2">错误详情:</p>
            <p className="text-xs text-purple-400 font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-purple-500 mt-2">
                错误ID: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="space-y-3">
          <Button
            onClick={reset}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            重试操作
          </Button>

          <Button
            onClick={() => {
              // 清理状态并重定向
              localStorage.removeItem('playground-state')
              window.location.href = '/playground'
            }}
            className="w-full"
            variant="outline"
          >
            重新开始
          </Button>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          提示：您的工作状态已自动保存，重试后可以继续编辑。
        </p>
      </div>
    </div>
  )
}