/**
 * @fileoverview Component Preview - 组件预览区域
 * 支持动态渲染 React 组件和主题切换
 */

'use client'

import { Suspense, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useThemeState } from '@/stores/playground.store'
import dynamic from 'next/dynamic'

// ===== 类型定义 =====

export interface ComponentPreviewProps {
  componentName: string
  props: Record<string, any>
  className?: string
}

// ===== 主组件 =====

export function ComponentPreview({
  componentName,
  props,
  className,
}: ComponentPreviewProps) {
  const { themeState } = useThemeState() as { themeState: any }

  // 暂时使用简单的组件预览，避免动态导入问题
  const DynamicComponent = useMemo(() => {
    return () => (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <div className="text-gray-500 mb-2">组件预览</div>
        <div className="text-sm text-gray-400">{componentName}</div>
        <div className="text-xs text-gray-400 mt-2">
          (动态导入已暂时禁用以解决构建问题)
        </div>
      </div>
    )
  }, [componentName])

  // 主题类名
  const themeClass = useMemo(() => {
    const classes: string[] = []

    // 亮暗模式
    if (themeState.mode === 'dark') {
      classes.push('dark')
    }

    // 密度
    classes.push(`density-${themeState.density}`)

    // 表面
    classes.push(`surface-${themeState.surface}`)

    // RTL
    if (themeState.rtl) {
      classes.push('rtl')
    }

    return classes.join(' ')
  }, [themeState])

  return (
    <div
      className={`component-preview ${themeClass} ${className || ''}`}
      data-theme-mode={themeState.mode}
      data-theme-density={themeState.density}
      data-theme-hue={themeState.hue}
      data-theme-surface={themeState.surface}
      dir={themeState.rtl ? 'rtl' : 'ltr'}
    >
      <Card className="w-full">
        <CardContent className="p-8 min-h-[300px] flex items-center justify-center">
          <Suspense fallback={<ComponentPreviewSkeleton />}>
            <div className="w-full max-w-2xl">
              <DynamicComponent {...props} />
            </div>
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}

// ===== 加载骨架屏 =====

export function ComponentPreviewSkeleton() {
  return (
    <div className="animate-pulse space-y-4 w-full">
      <div className="h-12 bg-muted rounded-md" />
      <div className="h-24 bg-muted rounded-md" />
      <div className="h-8 bg-muted rounded-md w-3/4" />
    </div>
  )
}

// ===== 错误边界组件 =====

export function ComponentPreviewErrorBoundary({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <Card className="w-full">
      <CardContent className="p-8">
        <div className="text-center space-y-4">
          <div className="text-destructive text-lg font-semibold">组件渲染错误</div>
          <p className="text-sm text-muted-foreground">{error.message}</p>
          <button
            onClick={reset}
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
          >
            重试
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
