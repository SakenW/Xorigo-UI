/**
 * @fileoverview Safe Dynamic Component Preview - 安全的动态组件渲染
 * 解决无限循环问题，提供稳定的动态组件渲染
 */

'use client'

import React from 'react'
import { useRef, useEffect, useCallback, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useThemeState } from '@/stores/playground.store'
import { ErrorBoundary } from 'react-error-boundary'

// ===== 类型定义 =====

interface SafeDynamicPreviewProps {
  componentName: string
  props: Record<string, any>
  code: string
  className?: string
}

// ===== 错误边界组件 =====

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class DynamicPreviewErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Dynamic Component Preview Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-300 rounded-lg bg-red-50 text-red-700">
          <div className="font-semibold text-red-800 mb-2">组件预览错误</div>
          <div className="text-sm text-red-600">
            {this.state.error?.message || '未知错误'}
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-3 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
          >
            重试
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// ===== 预览模式切换组件 =====

interface PreviewModeToggleProps {
  isDynamic: boolean
  onToggle: (isDynamic: boolean) => void
}

function PreviewModeToggle({ isDynamic, onToggle }: PreviewModeToggleProps) {
  return (
    <div className="flex items-center justify-center mb-4">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex">
        <button
          onClick={() => onToggle(false)}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            !isDynamic
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          静态预览
        </button>
        <button
          onClick={() => onToggle(true)}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            isDynamic
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          动态预览
        </button>
      </div>
    </div>
  )
}

// ===== 安全的动态组件渲染器 =====

interface SafeDynamicRendererProps {
  code: string
  theme: any
  onModeChange: (isDynamic: boolean) => void
}

function SafeDynamicRenderer({ code, theme, onModeChange }: SafeDynamicRendererProps) {
  // 使用 ref 存储渲染状态，避免 useState 导致的重新渲染
  const renderRef = useRef<{
    component: React.ComponentType | null
    error: string | null
    isLoading: boolean
    lastCode?: string
  }>({
    component: null,
    error: null,
    isLoading: false,
    lastCode: ''
  })

  // 使用 state 只控制显示状态，不用于渲染逻辑
  const [isDynamic, setIsDynamic] = useState(false)
  // 移除displayError状态，避免状态更新循环

  // 防抖定时器引用
  const debounceTimerRef = useRef<NodeJS.Timeout>()

  // 安全的组件渲染函数
  const renderComponentSafely = useCallback(() => {
    const ref = renderRef.current

    // 防抖处理
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        if (!code.trim()) {
          ref.error = '请输入组件代码'
          return
        }

        ref.isLoading = true
        ref.error = null

        // 创建安全的代码执行环境
        const sandboxedCode = `
          (function(React, XorigoUI) {
            'use strict';

            // 导入必要的 React hooks
            const { useState, useEffect, useCallback, useMemo, useRef } = React;

            // Xorigo UI 组件库
            const { Button, Card, CardContent, CardHeader, Input, Badge } = XorigoUI || {};

            // 预定义的样式类名
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

              // 清理代码，移除危险的导入
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
          ref.component = Component
          ref.error = null
        } else {
          ref.error = '代码必须导出一个有效的 React 组件'
        }
      } catch (err: any) {
        ref.error = err.message || '组件渲染失败'
      } finally {
        ref.isLoading = false
      }
    }, 500) // 增加防抖时间到 500ms

    // 清理函数
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, []) // 移除code依赖，避免循环

  // 单独处理code变化，避免循环依赖
  useEffect(() => {
    const ref = renderRef.current
    if (code !== ref.lastCode) {
      ref.lastCode = code
      renderComponentSafely()
    }
  }, [code])

  // 组件清理
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  const ref = renderRef.current

  // 渲染逻辑
  const renderContent = () => {
    if (ref.isLoading) {
      return (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-sm text-muted-foreground">渲染中...</span>
        </div>
      )
    }

    if (ref.error) {
      return (
        <div className="p-4 border border-red-300 rounded-lg bg-red-50 text-red-700">
          <div className="font-semibold text-red-800 mb-2">组件渲染错误</div>
          <div className="text-sm text-red-600">{ref.error}</div>
          <button
            onClick={() => {
              renderComponentSafely()
              onModeChange(true)
            }}
            className="mt-3 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
          >
            重试
          </button>
          <button
            onClick={() => onModeChange(false)}
            className="mt-2 ml-2 px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
          >
            切换到静态
          </button>
        </div>
      )
    }

    if (!ref.component) {
      return (
        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
          <div className="mb-2">
            <svg className="w-12 h-12 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <p>等待渲染组件...</p>
        </div>
      )
    }

    try {
      const Component = ref.component
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
          <button
            onClick={() => onModeChange(false)}
            className="mt-3 px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
          >
            切换到静态
          </button>
        </div>
      )
    }
  }

  return (
    <div className="w-full">
      <PreviewModeToggle
        isDynamic={isDynamic}
        onToggle={setIsDynamic}
      />
      <DynamicPreviewErrorBoundary>
        {isDynamic ? (
          renderContent()
        ) : (
          <div className="text-center text-muted-foreground">
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="mb-2">
                <svg className="w-12 h-12 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4.95-4.95a4 4 0 00-5.656 5.656l1.414 1.414a4 4 0 005.656 0l9.9-9.9a4 4 0 00-5.656-5.656l-1.414 1.414a4 4 0 00-5.656 0z" />
                </svg>
              </div>
              <p>点击"动态预览"查看实时渲染效果</p>
            </div>
          </div>
        )}
      </DynamicPreviewErrorBoundary>
    </div>
  )
}

// ===== 主组件 =====

export function SafeDynamicPreview({
  componentName,
  props,
  code,
  className,
}: SafeDynamicPreviewProps) {
  const { themeState } = useThemeState() as { themeState: any }

  // 主题类名计算（直接计算，避免 useMemo）
  const getThemeClass = () => {
    const classes: string[] = []

    if (themeState.mode === 'dark') {
      classes.push('dark')
    }

    classes.push(`density-${themeState.density}`)
    classes.push(`surface-${themeState.surface}`)

    if (themeState.rtl) {
      classes.push('rtl')
    }

    return classes.join(' ')
  }

  return (
    <div
      className={`safe-dynamic-preview ${getThemeClass()} ${className || ''}`}
      data-theme-mode={themeState.mode}
      data-theme-density={themeState.density}
      data-theme-hue={themeState.hue}
      data-theme-surface={themeState.surface}
      dir={themeState.rtl ? 'rtl' : 'ltr'}
    >
      <Card className="w-full">
        <CardContent className="p-6 min-h-[300px]">
          <SafeDynamicRenderer
            code={code}
            theme={themeState}
            onModeChange={(isDynamic) => {
              // 可以在这里处理模式切换逻辑
              console.log('Preview mode changed to:', isDynamic ? 'dynamic' : 'static')
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}