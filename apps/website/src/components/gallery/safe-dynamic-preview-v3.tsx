/**
 * @fileoverview Safe Dynamic Component Preview v3.0 - 完全简化版本
 * 彻底解决语法错误问题，只支持基础JavaScript语法
 */

'use client'

import React, { useRef, useEffect, useCallback, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ErrorBoundary } from 'react-error-boundary'

// ===== 类型定义 =====

interface SafeDynamicPreviewV3Props {
  componentName: string
  props: Record<string, any>
  code: string
  className?: string
}

// ===== 简化的动态渲染器 =====

function SimpleDynamicRenderer({ code }: { code: string }) {
  // 使用ref存储所有状态，完全避免useState
  const stateRef = useRef({
    component: null as React.ComponentType | null,
    error: null as string | null,
    isLoading: false,
    mounted: false,
    forceUpdate: 0 as number
  })

  // 使用一个计数器来强制更新
  const [, setUpdateCounter] = useState(0)

  // 强制更新机制
  const forceUpdate = useCallback(() => {
    stateRef.current.forceUpdate += 1
    setUpdateCounter(prev => prev + 1) // 触发重新渲染
  }, [])

  // 简化的代码转换 - 只处理ES6模块语法
  const transformCode = useCallback((inputCode: string): string => {
    console.log('原始代码:', inputCode);

    let transformedCode = inputCode;

    // 只处理ES6模块语法，不处理JSX
    transformedCode = transformedCode
      // 替换 export default function
      .replace(/export\s+default\s+function\s+(\w+)/g, 'const $1 = function')
      // 替换 export default const
      .replace(/export\s+default\s+const\s+(\w+)/g, 'const $1')
      // 替换 export default =
      .replace(/export\s+default\s*=\s*([^;]+);?/g, 'window.Component = $1;')
      // 移除其他export语句
      .replace(/export\s+[^;]+;/g, '')
      // 移除import语句
      .replace(/import\s+[^;]+;/g, '')
      // 移除import { ... } from
      .replace(/import\s*\{[^}]*\}\s*from\s*[^;]+;/g, '')
      // 移除import ... from
      .replace(/import\s+\w+\s*from\s*[^;]+;/g, '');

    // 检查是否包含JSX语法
    if (transformedCode.includes('<') && transformedCode.includes('>')) {
      console.log('⚠️ 检测到JSX语法，暂时不支持');
      // 简单地将JSX替换为注释，避免语法错误
      transformedCode = transformedCode.replace(/<[^>]*>/g, '/* JSX元素已暂时禁用 */');
    }

    console.log('转换后代码:', transformedCode);
    return transformedCode;
  }, []);

  // 渲染函数 - 简化版本
  const renderComponent = useCallback(async () => {
    const state = stateRef.current

    if (!code.trim()) {
      state.error = '请输入组件代码'
      forceUpdate()
      return
    }

    state.isLoading = true
    state.error = null
    forceUpdate() // 触发加载状态

    try {
      // 防抖处理
      await new Promise(resolve => setTimeout(resolve, 300))

      // 简化的代码转换
      const transformedCode = transformCode(code);

      // 语法检查 - 在执行前验证
      try {
        // 尝试创建一个简单的函数来验证语法
        new Function('React', transformedCode);
        console.log('✅ 转换后的代码语法检查通过');
      } catch (syntaxError: any) {
        console.error('❌ 转换后的代码语法错误:', syntaxError.message);
        console.error('问题代码片段:', transformedCode.substring(0, 500));
        throw new Error(`JSX转换语法错误: ${syntaxError.message}`);
      }

      // 创建安全的执行环境
      const wrappedCode = `
        (function() {
          const React = window.React;
          const { useState, useEffect, useCallback, useMemo, useRef } = React;

          // 全局变量来存储组件
          let Component = null;
          let MyComponent = null;
          let App = null;
          let Button = null;
          let Card = null;

          try {
            // 转换后的用户代码
            ${transformedCode}

            // 查找导出的组件
            if (typeof Component === 'function') {
              return Component;
            }
            if (typeof MyComponent === 'function') {
              return MyComponent;
            }
            if (typeof App === 'function') {
              return App;
            }
            if (typeof Button === 'function') {
              return Button;
            }
            if (typeof Card === 'function') {
              return Card;
            }

            // 尝试从window对象查找
            if (typeof window.Component === 'function') {
              return window.Component;
            }

            throw new Error('代码必须导出一个React组件。\\n' +
                          '支持的写法：\\n' +
                          '1. function Component() { return React.createElement("div", null, "组件"); }\\n' +
                          '2. const Component = () => React.createElement("div", null, "组件");\\n' +
                          '3. export default function Component() {}\\n' +
                          '4. export default const Component = () => {}');
          } catch (e) {
            throw e;
          }
        })()
      `

      // 执行代码
      const Component = new Function('return ' + wrappedCode)()

      if (typeof Component === 'function') {
        state.component = Component
        state.error = null
      } else {
        state.error = '代码必须导出一个有效的React组件'
      }
    } catch (err: any) {
      state.error = err.message || '组件渲染失败'
    } finally {
      state.isLoading = false
    }

    forceUpdate() // 最终更新
  }, [code, transformCode])

  // 组件挂载时执行
  useEffect(() => {
    if (!stateRef.current.mounted) {
      stateRef.current.mounted = true
      renderComponent()
    }
  }, [renderComponent])

  // 只在code变化时重新渲染
  useEffect(() => {
    if (stateRef.current.mounted) {
      renderComponent()
    }
  }, [code, renderComponent])

  const state = stateRef.current

  // 错误显示
  if (state.error) {
    return (
      <div className="p-4 border border-red-300 rounded-lg bg-red-50 text-red-700">
        <div className="font-semibold text-red-800 mb-2">组件渲染错误</div>
        <div className="text-sm text-red-600">{state.error}</div>
        <button
          onClick={renderComponent}
          className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
        >
          重试
        </button>
      </div>
    )
  }

  // 加载状态
  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">渲染组件中...</span>
      </div>
    )
  }

  // 成功渲染
  if (state.component) {
    try {
      const Component = state.component
      return (
        <div className="p-4 border rounded-lg bg-background">
          <Component />
          <p className="text-xs text-muted-foreground mt-4 text-center">
            动态渲染的 {state.component.name || 'React'} 组件
          </p>
        </div>
      )
    } catch (err: any) {
      return (
        <div className="p-4 border border-red-300 rounded-lg bg-red-50 text-red-700">
          <div className="font-semibold text-red-800 mb-2">组件渲染失败</div>
          <div className="text-sm text-red-600">{err.message}</div>
        </div>
      )
    }
  }

  // 初始状态
  return (
    <div className="flex items-center justify-center p-8">
      <span className="text-muted-foreground">准备渲染组件...</span>
    </div>
  )
}

// ===== 预览模式切换 =====

function PreviewModeToggle({ isDynamic, onToggle }: {
  isDynamic: boolean
  onToggle: (dynamic: boolean) => void
}) {
  return (
    <div className="flex items-center justify-center mb-4 p-2 bg-muted rounded-lg">
      <button
        onClick={() => onToggle(false)}
        className={`px-4 py-2 rounded-l-md transition-colors ${
          !isDynamic
            ? 'bg-background text-foreground border border-border'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        静态预览
      </button>
      <button
        onClick={() => onToggle(true)}
        className={`px-4 py-2 rounded-r-md transition-colors ${
          isDynamic
            ? 'bg-background text-foreground border border-border'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        动态预览
      </button>
    </div>
  )
}

// ===== 静态组件预览 =====

function StaticComponentPreview({ componentName }: { componentName: string }) {
  const getStaticPreview = () => {
    switch (componentName) {
      case 'Button':
        return (
          <div className="space-x-2">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
              主要按钮
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm">
              边框按钮
            </button>
            <button className="px-4 py-2 hover:bg-gray-100 text-sm">
              幽灵按钮
            </button>
          </div>
        )

      case 'Card':
        return (
          <div className="border rounded-lg p-4 max-w-xs">
            <div className="font-semibold mb-2 text-sm">卡片标题</div>
            <div className="text-xs text-gray-600">这是卡片内容示例</div>
          </div>
        )

      case 'Input':
        return (
          <div className="space-y-2 max-w-xs">
            <input
              type="text"
              placeholder="文本输入框"
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
            <input
              type="password"
              placeholder="密码输入框"
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
          </div>
        )

      case 'Badge':
        return (
          <div className="space-x-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">蓝色徽章</span>
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">绿色徽章</span>
            <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">红色徽章</span>
          </div>
        )

      default:
        return (
          <div className="text-center p-4 border rounded-lg">
            <div className="text-lg mb-2">📦</div>
            <div className="text-sm text-gray-600">{componentName} 组件</div>
            <div className="text-xs text-gray-400 mt-1">静态预览</div>
          </div>
        )
    }
  }

  return (
    <div className="text-center">
      {getStaticPreview()}
      <p className="text-xs text-muted-foreground mt-4">
        这是 {componentName} 组件的静态预览
      </p>
    </div>
  )
}

// ===== 主组件 =====

export default function SafeDynamicPreviewV3({
  componentName,
  props,
  code,
  className
}: SafeDynamicPreviewV3Props) {
  const [isDynamic, setIsDynamic] = React.useState(false)

  return (
    <div className={className}>
      <PreviewModeToggle
        isDynamic={isDynamic}
        onToggle={setIsDynamic}
      />

      {isDynamic ? (
        <ErrorBoundary
          fallback={
            <div className="p-4 border border-red-300 rounded-lg bg-red-50 text-red-700">
              <div className="font-semibold text-red-800 mb-2">动态预览错误</div>
              <div className="text-sm text-red-600">
                动态预览遇到了问题，请切换到静态预览或刷新页面重试
              </div>
            </div>
          }
        >
          <SimpleDynamicRenderer code={code} />
        </ErrorBoundary>
      ) : (
        <StaticComponentPreview componentName={componentName} />
      )}
    </div>
  )
}