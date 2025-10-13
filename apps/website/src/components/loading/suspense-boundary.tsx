'use client'

import { Suspense } from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface SuspenseBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  error?: React.ReactNode
  className?: string
}

/**
 * 通用 Suspense 边界组件
 * 提供统一的加载和错误处理
 */
export function SuspenseBoundary({
  children,
  fallback,
  error,
  className = ""
}: SuspenseBoundaryProps) {
  const defaultFallback = (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">加载中...</p>
      </div>
    </div>
  )

  const defaultError = (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-6 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold mb-2">加载失败</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          组件加载失败，请刷新页面重试
        </p>
      </CardContent>
    </Card>
  )

  return (
    <div className={className}>
      <Suspense fallback={fallback || defaultFallback}>
        {children}
      </Suspense>
    </div>
  )
}