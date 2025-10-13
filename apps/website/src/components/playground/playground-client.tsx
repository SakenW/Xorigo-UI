'use client'

import { useState, useCallback } from 'react'
import { PlaygroundErrorBoundary } from '@/components/errors'
import { Card, CardContent, CardHeader } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'
import dynamic from 'next/dynamic'

// 动态导入 Monaco Editor 避免服务端渲染问题
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-muted animate-pulse">
      <div className="text-muted-foreground">编辑器加载中...</div>
    </div>
  ),
})

// 预设的组件示例
const componentExamples = [
  {
    id: 'button',
    name: '按钮组件',
    description: '基础按钮组件示例',
    code: `import { Button } from '@xorigo-ui/core'

export default function ButtonExample() {
  return (
    <div className="space-x-4">
      <Button variant="primary">主要按钮</Button>
      <Button variant="secondary">次要按钮</Button>
      <Button variant="outline">边框按钮</Button>
      <Button variant="ghost">幽灵按钮</Button>
    </div>
  )
}`,
  },
  {
    id: 'card',
    name: '卡片组件',
    description: '卡片布局示例',
    code: `import { Card, CardContent, CardHeader } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'

export default function CardExample() {
  return (
    <Card className="max-w-md">
      <img
        src="https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=200&fit=crop"
        alt="示例图片"
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <CardHeader>
        <h3 className="text-lg font-semibold">卡片标题</h3>
        <Badge variant="default">示例</Badge>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          这是一个卡片组件的示例内容，展示了卡片的完整功能。
        </p>
        <Button>查看详情</Button>
      </CardContent>
    </Card>
  )
}`,
  },
  {
    id: 'form',
    name: '表单组件',
    description: '表单输入示例',
    code: `import { Card, CardContent, CardHeader } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'
import { useState } from 'react'

export default function FormExample() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(\`提交的数据: \${email}, \${password}\`)
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <h3 className="text-lg font-semibold">登录表单</h3>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              邮箱地址
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="请输入邮箱"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="请输入密码"
            />
          </div>
          <Button type="submit" className="w-full">
            登录
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}`,
  },
]

export function PlaygroundClient() {
  const [selectedExample, setSelectedExample] = useState(componentExamples[0])
  const [code, setCode] = useState(componentExamples[0].code)
  const [activeTheme, setActiveTheme] = useState('default')

  // 选择示例
  const selectExample = useCallback((example: typeof componentExamples[0]) => {
    setSelectedExample(example)
    setCode(example.code)
  }, [])

  // 重置代码
  const resetCode = useCallback(() => {
    setCode(selectedExample.code)
  }, [selectedExample])

  // 复制代码
  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(code)
    // TODO: 添加 toast 提示
  }, [code])

  return (
    <PlaygroundErrorBoundary>
      <div className="flex h-screen bg-background">
        {/* 左侧编辑器区域 */}
        <div className="w-1/2 flex flex-col border-r border-border">
          {/* 编辑器头部 */}
          <div className="h-12 border-b border-border bg-muted px-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h3 className="font-medium">代码编辑器</h3>
              <Badge variant="default" className="text-xs">
                {selectedExample.name}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={resetCode}>
                重置
              </Button>
              <Button variant="ghost" size="sm" onClick={copyCode}>
                复制
              </Button>
            </div>
          </div>

          {/* 示例选择器 */}
          <div className="border-b border-border bg-muted px-4 py-3">
            <div className="flex space-x-2">
              {componentExamples.map((example) => (
                <button
                  key={example.id}
                  onClick={() => selectExample(example)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    selectedExample.id === example.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-background text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {example.name}
                </button>
              ))}
            </div>
          </div>

          {/* Monaco 编辑器 */}
          <div className="flex-1 relative">
            <MonacoEditor
              height="100%"
              language="typescript"
              theme={activeTheme === 'dark' ? 'vs-dark' : 'vs-light'}
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                wordWrap: 'on',
                bracketPairColorization: { enabled: true },
              }}
            />
          </div>
        </div>

        {/* 右侧预览区域 */}
        <div className="w-1/2 flex flex-col">
          {/* 预览头部 */}
          <div className="h-12 border-b border-border bg-muted px-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h3 className="font-medium">实时预览</h3>
              <Badge variant="default" className="text-xs">
                {selectedExample.description}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTheme(activeTheme === 'default' ? 'dark' : 'default')}
              >
                {activeTheme === 'default' ? '🌙' : '☀️'}
              </Button>
            </div>
          </div>

          {/* 预览内容 */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="min-h-full flex items-center justify-center">
              <Card className="w-full max-w-2xl">
                <CardHeader>
                  <h3 className="text-lg font-semibold">组件预览</h3>
                  <p className="text-sm text-muted-foreground">
                    这是在 {activeTheme === 'dark' ? '深色' : '浅色'} 主题下的预览效果
                  </p>
                </CardHeader>
                <CardContent className={`p-6 ${activeTheme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
                  <div id="preview-container">
                    {/* TODO: 动态渲染 React 组件 */}
                    <div className="p-4 border-2 border-dashed border-muted rounded-lg">
                      <p className="text-center text-muted-foreground">
                        组件预览功能开发中...
                      </p>
                      <div className="mt-4 text-sm">
                        <p>当前代码：</p>
                        <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-h-40">
                          {code}
                        </pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PlaygroundErrorBoundary>
  )
}
