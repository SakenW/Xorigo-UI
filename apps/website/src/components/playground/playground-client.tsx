'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Play, Download, Copy, RefreshCw, Settings } from 'lucide-react'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'

// 动态导入 Monaco Editor 以避免 SSR 问题
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <div className="h-full min-h-[600px] bg-muted animate-pulse" />
})

// 默认代码示例
const DEFAULT_CODE = `import React from 'react'
import { Button } from '@th-ui/core'
import { Card } from '@th-ui/core'

export default function Example() {
  return (
    <div className="p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>TH-UI 组件示例</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="primary" size="md">
            主要按钮
          </Button>
          <Button variant="outline-solid" size="md">
            次要按钮
          </Button>
          <Badge variant="secondary">标签组件</Badge>
        </CardContent>
      </Card>
    </div>
  )
}`

interface PlaygroundProps {}

export function PlaygroundClient({}: PlaygroundProps) {
  const [code, setCode] = useState(DEFAULT_CODE)
  const [isRunning, setIsRunning] = useState(false)
  const [previewKey, setPreviewKey] = useState(0)
  const [selectedTheme, setSelectedTheme] = useState('vs-dark')
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const { theme } = useTheme()

  // 根据系统主题调整编辑器主题
  useEffect(() => {
    setSelectedTheme(theme === 'dark' ? 'vs-dark' : 'vs-light')
  }, [theme])

  // 更新预览
  const updatePreview = useCallback(() => {
    if (!iframeRef.current) return

    const iframe = iframeRef.current
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

    if (!iframeDoc) return

    // 生成完整的 HTML 内容
    const htmlContent = generateHTML(code)

    // 写入 iframe 内容
    iframeDoc.open()
    iframeDoc.write(htmlContent)
    iframeDoc.close()

    // 触发重新渲染
    setPreviewKey(prev => prev + 1)
  }, [code])

  // 运行代码
  const handleRun = useCallback(() => {
    setIsRunning(true)
    setTimeout(() => {
      updatePreview()
      setIsRunning(false)
      toast.success('代码已执行')
    }, 100)
  }, [updatePreview])

  // 复制代码
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code)
    toast.success('代码已复制到剪贴板')
  }, [code])

  // 下载代码
  const handleDownload = useCallback(() => {
    const blob = new Blob([code], { type: 'text/typescript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'th-ui-example.tsx'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('代码已下载')
  }, [code])

  // 重置代码
  const handleReset = useCallback(() => {
    setCode(DEFAULT_CODE)
    toast.success('代码已重置')
  }, [])

  // 生成 iframe HTML 内容
  const generateHTML = (userCode: string): string => {
    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TH-UI Preview</title>
    <script crossorigin src="https://unpkg.com/react@19/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@19/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            margin: 0;
            padding: 16px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background: hsl(${theme === 'dark' ? '240 10% 3.9%' : '0 0% 100%'});
            color: hsl(${theme === 'dark' ? '0 0% 98%' : '240 10% 3.9%'});
            min-height: 100vh;
        }
        * {
            box-sizing: border-box;
        }
        .error {
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 6px;
            padding: 12px;
            color: #dc2626;
            font-family: monospace;
            font-size: 14px;
            white-space: pre-wrap;
        }
        .dark .error {
            background: #7f1d1d;
            border-color: #991b1b;
            color: #fecaca;
        }
    </style>
</head>
<body class="${theme}">
    <div id="root"></div>

    <script type="text/babel">
        const { useState, useEffect } = React;

        // 模拟 TH-UI 组件（简化版本）
        const Button = ({ variant = 'primary', size = 'md', children, ...props }) => {
            const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
            const variantClasses = {
                primary: 'bg-blue-600 text-white hover:bg-blue-700',
                'outline-solid': 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
            };
            const sizeClasses = {
                sm: 'h-9 px-3 text-sm',
                md: 'h-10 px-4 py-2',
                lg: 'h-11 px-8',
            };

            const classes = \`\${baseClasses} \${variantClasses[variant]} \${sizeClasses[size]}\`;

            return React.createElement('button', { className: classes, ...props }, children);
        };

        const Card = ({ children, ...props }) => {
            return React.createElement('div', {
                className: 'rounded-lg border bg-card text-card-foreground shadow-sm',
                ...props
            }, children);
        };

        const CardHeader = ({ children, ...props }) => {
            return React.createElement('div', {
                className: 'flex flex-col space-y-1.5 p-6',
                ...props
            }, children);
        };

        const CardContent = ({ children, ...props }) => {
            return React.createElement('div', {
                className: 'p-6 pt-0',
                ...props
            }, children);
        };

        const CardTitle = ({ children, ...props }) => {
            return React.createElement('h3', {
                className: 'text-2xl font-semibold leading-none tracking-tight',
                ...props
            }, children);
        };

        const Badge = ({ variant = 'default', children, ...props }) => {
            const baseClasses = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';
            const variantClasses = {
                default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
                secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
            };

            const classes = \`\${baseClasses} \${variantClasses[variant]}\`;

            return React.createElement('span', { className: classes, ...props }, children);
        };

        try {
            // 用户代码
            ${userCode}

            // 渲染用户组件
            const root = document.getElementById('root');
            const rootElement = React.createElement(Example);
            ReactDOM.render(rootElement, root);

        } catch (error) {
            const root = document.getElementById('root');
            root.innerHTML = \`<div class="error">错误: \${error.message}</div>\`;
            console.error('执行错误:', error);
        }
    </script>
</body>
</html>`
  }

  return (
    <div className="flex h-screen flex-col">
      {/* 顶部工具栏 */}
      <div className="h-12 border-b border-border bg-background px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-lg font-semibold">TH-UI Playground</h1>
          <Badge variant="secondary">Beta</Badge>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={isRunning}
          >
            <Copy className="h-4 w-4 mr-2" />
            复制
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={isRunning}
          >
            <Download className="h-4 w-4 mr-2" />
            下载
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={isRunning}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            重置
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={handleRun}
            disabled={isRunning}
          >
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? '运行中...' : '运行'}
          </Button>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧编辑器 */}
        <div className="w-1/2 flex flex-col border-r border-border">
          <div className="h-8 border-b border-border bg-muted px-4 flex items-center">
            <span className="text-sm font-medium">代码编辑器</span>
          </div>

          <div className="flex-1">
            <MonacoEditor
              height="100%"
              defaultLanguage="typescript"
              value={code}
              onChange={(value) => setCode(value || '')}
              theme={selectedTheme}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                automaticLayout: true,
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
                lineNumbers: 'on',
                renderLineHighlight: 'line',
                suggestOnTriggerCharacters: true,
                acceptSuggestionOnEnter: 'on',
                tabSize: 2,
                insertSpaces: true,
              }}
            />
          </div>
        </div>

        {/* 右侧预览 */}
        <div className="w-1/2 flex flex-col">
          <div className="h-8 border-b border-border bg-muted px-4 flex items-center justify-between">
            <span className="text-sm font-medium">实时预览</span>
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">主题: {theme}</span>
            </div>
          </div>

          <div className="flex-1 p-4 bg-background">
            <Card className="h-full">
              <CardContent className="p-0 h-full">
                <iframe
                  ref={iframeRef}
                  key={previewKey}
                  className="w-full h-full border-0 rounded-md"
                  sandbox="allow-scripts allow-same-origin"
                  title="TH-UI 预览"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* 底部信息栏 */}
      <div className="h-8 border-t border-border bg-muted px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <span>React 19 + TypeScript</span>
          <Separator orientation="vertical" className="h-4" />
          <span>TH-UI Components</span>
          <Separator orientation="vertical" className="h-4" />
          <span>Tailwind CSS 4</span>
        </div>

        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <span>支持 TH-UI 完整组件库</span>
          <Badge variant="outline" className="text-xs">实时预览</Badge>
        </div>
      </div>
    </div>
  )
}