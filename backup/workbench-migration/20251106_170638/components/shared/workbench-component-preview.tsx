/**
 * Workbench Component Preview
 * 通用的组件预览功能，支持动态代码执行和错误处理
 * 遵循组件源规则：所有UI组件来自@xorigo-ui/core
 */

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'

interface WorkbenchComponentPreviewProps {
  componentName: string
  code: string
  props?: Record<string, any>
  className?: string
}

/**
 * Workbench 组件预览
 * 安全地执行用户代码并渲染组件
 */
export function WorkbenchComponentPreview({
  componentName,
  code,
  props = {},
  className = '',
}: WorkbenchComponentPreviewProps) {
  const [component, setComponent] = useState<React.ComponentType<any> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 安全执行代码
  const executeCode = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    setComponent(null)

    try {
      // 预处理代码：移除import和export语句，因为我们已经在环境中提供了这些依赖
      const processedCode = code
        .replace(/import\s+.*?from\s+['"]@xorigo-ui\/core['"];?\s*/g, '')
        .replace(/import\s+.*?from\s+['"]react['"];?\s*/g, '')
        .replace(/import\s+{.*?}\s+from\s+['"]react['"];?\s*/g, '')
        .replace(/export\s+default\s+/g, 'const ')
        .replace(/export\s+/g, '')

      // 创建一个安全的执行环境
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor
      const safeCode = `
        ${processedCode}
        return ${componentName};
      `

      // 执行代码，提供所有必要的依赖
      const fn = new AsyncFunction(
        'React',
        'useState',
        'Button',
        'Card',
        'CardContent',
        'CardHeader',
        'Badge',
        'Input',
        safeCode
      )

      const result = fn(
        React,
        React.useState,
        Button,
        Card,
        CardContent,
        CardHeader,
        Badge,
        Input
      )

      // 如果结果是组件，则设置组件
      if (typeof result === 'function') {
        setComponent(() => result)
      } else if (result && typeof result.default === 'function') {
        setComponent(() => result.default)
      } else {
        throw new Error('代码执行结果不是有效的 React 组件')
      }
    } catch (err) {
      console.error('Component execution error:', err)
      setError(err instanceof Error ? err.message : '代码执行失败')
    } finally {
      setIsLoading(false)
    }
  }, [code, componentName])

  // 当代码变化时重新执行
  useEffect(() => {
    if (code) {
      executeCode()
    }
  }, [code, executeCode])

  // 如果正在加载
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">正在编译组件...</p>
        </div>
      </div>
    )
  }

  // 如果有错误
  if (error) {
    return (
      <div className={`p-8 ${className}`}>
        <Card className="border-destructive">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <span className="text-destructive">❌</span>
              <h3 className="text-lg font-semibold text-destructive">编译错误</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                组件 "{componentName}" 编译失败
              </p>
              <div className="bg-destructive/10 p-4 rounded-md">
                <pre className="text-xs text-destructive overflow-auto">
                  {error}
                </pre>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={executeCode}>
                  重试
                </Button>
                <Button variant="outline" size="sm">
                  查看代码
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 如果组件为空
  if (!component) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <div className="text-4xl mb-4">📦</div>
          <p className="text-muted-foreground">
            等待组件加载...
          </p>
        </div>
      </div>
    )
  }

  // 渲染组件
  try {
    const Component = component
    return (
      <div className={className}>
        <Component {...props} />
      </div>
    )
  } catch (err) {
    console.error('Component render error:', err)
    return (
      <div className={`p-8 ${className}`}>
        <Card className="border-destructive">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <span className="text-destructive">❌</span>
              <h3 className="text-lg font-semibold text-destructive">渲染错误</h3>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              组件渲染时发生错误
            </p>
            <pre className="text-xs text-muted-foreground mt-2">
              {err instanceof Error ? err.message : String(err)}
            </pre>
          </CardContent>
        </Card>
      </div>
    )
  }
}