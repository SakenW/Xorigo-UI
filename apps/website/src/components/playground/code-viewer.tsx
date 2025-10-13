/**
 * @fileoverview Code Viewer - 代码查看器
 * 支持代码高亮、复制和导出
 */

'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'

// ===== 类型定义 =====

export interface CodeViewerProps {
  componentName: string
  props: Record<string, any>
  language?: 'tsx' | 'jsx' | 'html'
}

// ===== 主组件 =====

export function CodeViewer({
  componentName,
  props,
  language = 'tsx',
}: CodeViewerProps) {
  const [copied, setCopied] = useState(false)
  const [format, setFormat] = useState<'component' | 'standalone'>('component')

  // 生成代码
  const code = useMemo(() => {
    return generateComponentCode(componentName, props, format, language)
  }, [componentName, props, format, language])

  // 复制代码
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  // 下载代码
  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${componentName}.${language}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* 头部 */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-lg">代码查看</h3>
            <Badge variant="outline" className="text-xs">
              {language.toUpperCase()}
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              {copied ? (
                <>
                  <CheckIcon className="w-4 h-4 mr-1" />
                  已复制
                </>
              ) : (
                <>
                  <CopyIcon className="w-4 h-4 mr-1" />
                  复制
                </>
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDownload}>
              <DownloadIcon className="w-4 h-4 mr-1" />
              下载
            </Button>
          </div>
        </div>

        {/* 格式切换 */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFormat('component')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              format === 'component'
                ? 'bg-primary-500 text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            组件模式
          </button>
          <button
            onClick={() => setFormat('standalone')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              format === 'standalone'
                ? 'bg-primary-500 text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            独立模式
          </button>
        </div>
      </div>

      {/* 代码区域 */}
      <div className="flex-1 overflow-auto p-4">
        <Card>
          <CardContent className="p-0">
            <pre className="p-4 text-sm font-mono overflow-x-auto bg-muted">
              <code>{code}</code>
            </pre>
          </CardContent>
        </Card>
      </div>

      {/* 底部信息 */}
      <div className="p-3 border-t border-border bg-muted">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>行数: {code.split('\n').length}</span>
          <span>字符数: {code.length}</span>
        </div>
      </div>
    </div>
  )
}

// ===== 工具函数 =====

function generateComponentCode(
  componentName: string,
  props: Record<string, any>,
  format: 'component' | 'standalone',
  language: 'tsx' | 'jsx' | 'html'
): string {
  if (language === 'html') {
    return generateHTMLCode(componentName, props)
  }

  if (format === 'standalone') {
    return generateStandaloneCode(componentName, props, language)
  }

  return generateComponentOnlyCode(componentName, props, language)
}

function generateComponentOnlyCode(
  componentName: string,
  props: Record<string, any>,
  language: 'tsx' | 'jsx'
): string {
  const propsString = Object.entries(props)
    .map(([key, value]) => {
      if (typeof value === 'string') {
        return `  ${key}="${value}"`
      } else if (typeof value === 'boolean') {
        return value ? `  ${key}` : ''
      } else {
        return `  ${key}={${JSON.stringify(value)}}`
      }
    })
    .filter(Boolean)
    .join('\n')

  return `<${componentName}
${propsString}
>
  {/* 组件内容 */}
</${componentName}>`
}

function generateStandaloneCode(
  componentName: string,
  props: Record<string, any>,
  language: 'tsx' | 'jsx'
): string {
  const ext = language === 'tsx' ? 'tsx' : 'jsx'
  const propsString = generateComponentOnlyCode(componentName, props, language)

  return `import { ${componentName} } from '@xorigo-ui/core'

export default function Example() {
  return (
    ${propsString}
  )
}`
}

function generateHTMLCode(
  componentName: string,
  props: Record<string, any>
): string {
  const attributesString = Object.entries(props)
    .map(([key, value]) => {
      if (typeof value === 'string') {
        return `${key}="${value}"`
      } else if (typeof value === 'boolean') {
        return value ? key : ''
      } else {
        return `data-${key}='${JSON.stringify(value)}'`
      }
    })
    .filter(Boolean)
    .join(' ')

  return `<div class="xorigo-${componentName.toLowerCase()}" ${attributesString}>
  <!-- 组件内容 -->
</div>`
}

// ===== 图标组件 =====

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}
