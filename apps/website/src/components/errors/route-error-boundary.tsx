'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 记录错误到报告服务
    console.error('Route error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-red-600">
            页面加载错误
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600 dark:text-gray-400">
            抱歉，加载此页面时出现了问题。
          </p>

          {process.env.NODE_ENV === 'development' && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="font-mono text-sm text-red-800 dark:text-red-200">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  错误ID: {error.digest}
                </p>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={reset}
              className="flex-1"
              variant="default"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              重试
            </Button>
            <Button
              onClick={() => window.location.href = '/'}
              className="flex-1"
              variant="outline"
            >
              <Home className="w-4 h-4 mr-2" />
              首页
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}