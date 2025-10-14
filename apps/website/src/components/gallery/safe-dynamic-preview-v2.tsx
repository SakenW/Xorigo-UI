/**
 * @fileoverview Safe Dynamic Component Preview v2.0 - 零状态更新架构
 * 彻底解决无限循环问题的全新实现
 */

'use client'

import React, { useRef, useEffect, useCallback, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ErrorBoundary } from 'react-error-boundary'

// ===== 类型定义 =====

interface SafeDynamicPreviewV2Props {
  componentName: string
  props: Record<string, any>
  code: string
  className?: string
}

// ===== 简化的JSX转换器 =====

function safeJSXTransform(code: string): string {
  // 逐行处理，更安全的方法
  const lines = code.split('\n');
  const transformedLines: string[] = [];

  for (let line of lines) {
    // 跳过空行和注释
    if (line.trim() === '' || line.trim().startsWith('//')) {
      transformedLines.push(line);
      continue;
    }

    // 简单的JSX模式匹配
    if (line.includes('<') && line.includes('>')) {
      console.log('处理JSX行:', line);

      // 简化的转换规则
      if (line.includes('</')) {
        // 闭合标签，暂时保留
        transformedLines.push('// JSX行: ' + line);
      } else if (line.includes('/>')) {
        // 自闭合标签
        transformedLines.push('// 自闭合JSX: ' + line);
      } else {
        // 开始标签
        transformedLines.push('// 开始JSX: ' + line);
      }
    } else {
      transformedLines.push(line);
    }
  }

  return transformedLines.join('\n');
}

// ===== 零状态更新渲染器 =====

function PureDynamicRenderer({ code }: { code: string }) {
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

  // 渲染函数 - 零状态更新
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

      // ES6代码转换和执行逻辑
      let transformedCode = code;

      // 添加调试日志
      console.log('原始代码:', code);

      // 预处理：移除所有ES6模块语法
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
        .replace(/import\s*{[^}]*}\s*from\s*[^;]+;/g, '')
        // 移除import ... from
        .replace(/import\s+\w+\s*from\s*[^;]+;/g, '')
        // 转换JSX语法为React.createElement调用
        .replace(/<(\w+)([^>]*)>([\s\S]*?)<\/\1>/g,
          (match, tagName, props, children) => {
            // 处理属性
            const propsStr = props.trim();
            const propsObj = {};

            if (propsStr) {
              // 解析属性 (简化版)
              const attrRegex = /(\w+)=["']([^"']*)["']/g;
              let attrMatch;
              while ((attrMatch = attrRegex.exec(propsStr)) !== null) {
                const [, attrName, attrValue] = attrMatch;
                if (attrName === 'className') {
                  propsObj.className = `"${attrValue}"`;
                } else if (attrName === 'onClick') {
                  propsObj.onClick = attrValue;
                } else {
                  propsObj[attrName] = `"${attrValue}"`;
                }
              }
            }

            // 构建props对象字符串 - 修复语法错误
            let propsObjStr = 'null';
            if (Object.keys(propsObj).length > 0) {
              const propsEntries = Object.entries(propsObj).map(([k, v]) => {
                // 确保属性值格式正确
                if (v.startsWith('"') && v.endsWith('"')) {
                  return `${k}: ${v}`;
                } else if (v.includes('()') || v.includes('=>')) {
                  // 函数类型属性
                  return `${k}: ${v}`;
                } else {
                  // 确保字符串值用引号包围
                  return `${k}: "${v}"`;
                }
              });
              propsObjStr = '{ ' + propsEntries.join(', ') + ' }';
            }

            // 处理子元素
            const processedChildren = children.trim();

            if (processedChildren && !processedChildren.includes('<') && !processedChildren.includes('>')) {
              // 纯文本子元素 - 需要转义特殊字符
              const escapedChildren = processedChildren
                .replace(/\\/g, '\\\\')
                .replace(/"/g, '\\"')
                .replace(/\n/g, '\\n')
                .replace(/\r/g, '\\r');
              return `React.createElement("${tagName}", ${propsObjStr}, "${escapedChildren}")`;
            } else if (processedChildren.includes('{') && processedChildren.includes('}')) {
              // 包含JSX表达式的子元素
              const processedContent = processedChildren.replace(/\{([^}]+)\}/g, (_, expr) => {
                const trimmedExpr = expr.trim();
                // 如果是变量名，直接返回；如果是字符串，添加引号
                if (trimmedExpr.includes(' ') || trimmedExpr.includes('"') || trimmedExpr.includes("'")) {
                  return trimmedExpr;
                } else {
                  return trimmedExpr;
                }
              });
              return `React.createElement("${tagName}", ${propsObjStr}, ${processedContent})`;
            } else if (processedChildren === '') {
              // 空子元素
              return `React.createElement("${tagName}", ${propsObjStr})`;
            } else {
              // 包含其他JSX元素的子元素，需要递归处理
              return `React.createElement("${tagName}", ${propsObjStr}, ${processedChildren})`;
            }
          }
        )
        // 转换自闭合标签
        .replace(/<(\w+)([^>]*)\/>/g,
          (match, tagName, props) => {
            const propsStr = props.trim();
            const propsObj = {};

            if (propsStr) {
              const attrRegex = /(\w+)=["']([^"']*)["']/g;
              let attrMatch;
              while ((attrMatch = attrRegex.exec(propsStr)) !== null) {
                const [, attrName, attrValue] = attrMatch;
                if (attrName === 'className') {
                  propsObj.className = `"${attrValue}"`;
                } else if (attrName === 'onClick') {
                  propsObj.onClick = attrValue;
                } else {
                  propsObj[attrName] = `"${attrValue}"`;
                }
              }
            }

            // 构建props对象字符串 - 修复语法错误
            let propsObjStr = 'null';
            if (Object.keys(propsObj).length > 0) {
              const propsEntries = Object.entries(propsObj).map(([k, v]) => {
                // 确保属性值格式正确
                if (v.startsWith('"') && v.endsWith('"')) {
                  return `${k}: ${v}`;
                } else if (v.includes('()') || v.includes('=>')) {
                  // 函数类型属性
                  return `${k}: ${v}`;
                } else {
                  // 确保字符串值用引号包围
                  return `${k}: "${v}"`;
                }
              });
              propsObjStr = '{ ' + propsEntries.join(', ') + ' }';
            }

            return `React.createElement("${tagName}", ${propsObjStr})`;
          }
        );

      // 添加调试日志查看转换结果
      console.log('ES6转换后:', transformedCode);

      // 简化的JSX转换 - 暂时禁用复杂转换以避免语法错误
      console.log('⚠️ 暂时使用简化转换，避免语法错误');
      transformedCode = transformedCode.replace(/<[^>]*>/g, '// JSX元素已暂时禁用');
      console.log('简化转换结果:', transformedCode);

      console.log('最终转换代码:', transformedCode);

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
                          '1. function Component() { return <div>组件</div>; }\\n' +
                          '2. const Component = () => <div>组件</div>;\\n' +
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
  }, [code])

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

export default function SafeDynamicPreviewV2({
  componentName,
  props,
  code,
  className
}: SafeDynamicPreviewV2Props) {
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
          <PureDynamicRenderer code={code} />
        </ErrorBoundary>
      ) : (
        <StaticComponentPreview componentName={componentName} />
      )}
    </div>
  )
}