'use client'

import { ErrorFallback } from '@/components/errors'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="zh-CN">
      <body>
        <ErrorFallback
          error={error}
          title="系统级错误"
          description="发生了系统级错误，这是最严重的错误类型"
          showErrorDetails={process.env.NODE_ENV === 'development'}
          onReset={reset}
          actions={
            <>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                强制刷新
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 px-4 py-2 border-2 border-red-300 text-red-700 font-semibold rounded-lg hover:bg-red-50 transition-colors text-sm"
              >
                安全返回首页
              </button>
            </>
          }
          variant="error"
        />
      </body>
    </html>
  )
}