/**
 * @fileoverview Component Preview - 组件预览区域
 * 支持动态渲染 React 组件和主题切换
 */

'use client'

import { Suspense, useMemo, useState, useCallback, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useThemeState } from '@/stores/playground.store'
import dynamic from 'next/dynamic'
import { ErrorBoundary } from 'react-error-boundary'

// ===== 类型定义 =====

export interface ComponentPreviewProps {
  componentName: string
  props: Record<string, any>
  className?: string
  code?: string
}

// ===== 动态组件渲染器 =====

interface DynamicComponentRendererProps {
  code: string
  theme: any
}

function DynamicComponentRenderer({ code, theme }: DynamicComponentRendererProps) {
  const [component, setComponent] = useState<React.ComponentType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout>()

  const renderComponent = useCallback(async () => {
    if (!code.trim()) {
      setError('请输入组件代码')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // 创建安全的执行环境
      const sandboxedCode = `
        (function(React, XorigoUI) {
          'use strict';

          // 导入必要的 React hooks
          const { useState, useEffect, useCallback, useMemo, useRef } = React;

          // Xorigo UI 组件库
          const { Button, Card, CardContent, CardHeader, Input, Badge } = XorigoUI || {};

          // 预定义的样式类名，避免 dangerous classnames
          const safeClasses = {
            container: 'p-4 border rounded-lg',
            button: 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600',
            text: 'text-gray-700 dark:text-gray-300',
            center: 'text-center',
            mb2: 'mb-2',
            mb4: 'mb-4',
            flex: 'flex',
            gap2: 'gap-2'
          };

          try {
            // 处理用户代码
            const userCode = ${JSON.stringify(code)};

            // 移除导入语句，直接使用预定义的组件
            const cleanCode = userCode
              .replace(/import\s+.*?from\s+['"]react['"];?\s*\n?/g, '')
              .replace(/import\s+.*?from\s+['"]@xorigo-ui\/core['"];?\s*\n?/g, '')
              .replace(/export\s+default\s+/g, 'return ');

            // 验证代码安全性
            if (cleanCode.includes('eval(') ||
                cleanCode.includes('Function(') ||
                cleanCode.includes('document.') ||
                cleanCode.includes('window.') ||
                cleanCode.includes('global.') ||
                cleanCode.includes('process.') ||
                cleanCode.includes('require(')) {
              throw new Error('代码包含不安全的操作');
            }

            // 创建并返回组件
            return (cleanCode);
          } catch (err) {
            return function ErrorComponent() {
              return React.createElement('div', {
                className: 'p-4 border border-red-300 rounded-lg bg-red-50 text-red-700'
              }, '代码编译错误: ' + err.message);
            };
          }
        })(window.React, window.XorigoUI);
      `

      // 执行代码创建组件
      const componentFactory = new Function('React', 'XorigoUI', `return ${sandboxedCode}`)
      const Component = componentFactory(window.React, window.XorigoUI)

      if (typeof Component === 'function') {
        setComponent(() => Component)
      } else {
        setError('代码必须导出一个有效的 React 组件')
      }
    } catch (err: any) {
      setError(err.message || '组件渲染失败')
    } finally {
      setIsLoading(false)
    }
  }, [code])

  // 自动渲染组件 - 使用 useEffect 避免无限循环，并添加防抖
  useEffect(() => {
    // 清除之前的防抖定时器
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    // 设置新的防抖定时器
    debounceRef.current = setTimeout(() => {
      renderComponent()
    }, 300) // 300ms 防抖延迟

    // 清理函数
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [code])

  if (isLoading) {
    return <ComponentPreviewSkeleton />
  }

  if (error) {
    return (
      <div className="p-4 border border-red-300 rounded-lg bg-red-50 text-red-700">
        <div className="font-semibold text-red-800 mb-2">组件渲染错误</div>
        <div className="text-sm text-red-600">{error}</div>
        <button
          onClick={renderComponent}
          className="mt-3 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
        >
          重试
        </button>
      </div>
    )
  }

  if (!component) {
    return (
      <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
        等待渲染组件...
      </div>
    )
  }

  try {
    const Component = component
    return (
      <div className={`w-full ${theme.mode === 'dark' ? 'dark' : ''}`}>
        <Component />
      </div>
    )
  } catch (err: any) {
    return (
      <div className="p-4 border border-red-300 rounded-lg bg-red-50 text-red-700">
        <div className="font-semibold text-red-800 mb-2">组件执行错误</div>
        <div className="text-sm text-red-600">{err.message}</div>
      </div>
    )
  }
}

// ===== 安全代码包装器 =====

function createSafeComponentWrapper(code: string): string {
  // 提取默认导出的组件代码
  const componentMatch = code.match(/export\s+default\s+([\s\S]*?)(?=\nexport|\n$|$)/)
  if (componentMatch) {
    let componentCode = componentMatch[1].trim()

    // 如果是箭头函数，转换为函数声明
    if (componentCode.startsWith('function') || componentCode.includes('=>')) {
      componentCode = `return ${componentCode}`
    } else {
      // 如果是类组件或函数声明
      componentCode = componentCode.replace(/^(export\s+default\s+)?/, 'return ')
    }

    return componentCode
  }

  // 如果没有找到默认导出，尝试返回整个代码块
  return `return ${code}`
}

// ===== 主组件 =====

export function ComponentPreview({
  componentName,
  props,
  className,
  code = '',
}: ComponentPreviewProps) {
  const { themeState } = useThemeState() as { themeState: any }

  
  // 直接计算主题类名，避免依赖问题
  const getThemeClass = () => {
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
  }

  return (
    <div
      className={`component-preview ${getThemeClass()} ${className || ''}`}
      data-theme-mode={themeState.mode}
      data-theme-density={themeState.density}
      data-theme-hue={themeState.hue}
      data-theme-surface={themeState.surface}
      dir={themeState.rtl ? 'rtl' : 'ltr'}
    >
      <Card className="w-full">
        <CardContent className="p-8 min-h-[300px]">
          <ErrorBoundary
            FallbackComponent={({ error, resetErrorBoundary }) => (
              <ComponentPreviewErrorBoundary
                error={error}
                reset={resetErrorBoundary}
              />
            )}
          >
            <Suspense fallback={<ComponentPreviewSkeleton />}>
              {code ? (
                <DynamicComponentRenderer code={code} theme={themeState} />
              ) : (
                <div className="w-full max-w-2xl">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="text-gray-500 mb-2">组件预览</div>
                    <div className="text-sm text-gray-400">{componentName}</div>
                    <div className="text-xs text-gray-400 mt-2">
                      请在左侧编辑器中输入组件代码
                    </div>
                  </div>
                </div>
              )}
            </Suspense>
          </ErrorBoundary>
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
