'use client'

import { useState, useCallback, memo } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import dynamic from 'next/dynamic'
import { useCopyToClipboard } from '@/src/hooks'

interface ComponentExample {
  id: string
  name: string
  description: string
  category: string
  difficulty: string
  tags: string[]
  code: string
}

interface Category {
  id: string
  name: string
  icon: string
}

interface PlaygroundClientProps {
  examples: ComponentExample[]
  categories: Category[]
}

// 动态导入 Monaco Editor - 优化加载性能
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800 animate-pulse">
      <div className="text-gray-600 dark:text-gray-400">编辑器加载中...</div>
    </div>
  ),
})

// 代码预览组件 - 使用 memo 优化渲染
const CodePreview = memo(({ code }: { code: string }) => (
  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
    <pre className="text-sm overflow-auto max-h-40">
      <code className="text-gray-700 dark:text-gray-300">{code}</code>
    </pre>
  </div>
))
CodePreview.displayName = 'CodePreview'

/**
 * Playground 客户端组件 - 优化版本
 * 使用动态导入、memo 和其他性能优化技术
 */
export function PlaygroundClient({ examples, categories }: PlaygroundClientProps) {
  const [selectedExample, setSelectedExample] = useState(examples[0])
  const [code, setCode] = useState(examples[0].code)
  const [activeTheme, setActiveTheme] = useState('light')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const { copy, isCopied } = useCopyToClipboard()

  // 过滤示例
  const filteredExamples = examples.filter(example => {
    const matchesCategory = selectedCategory === 'all' || example.category === selectedCategory
    const matchesSearch = example.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         example.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         example.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  // 选择示例
  const selectExample = useCallback((example: ComponentExample) => {
    setSelectedExample(example)
    setCode(example.code)
  }, [])

  // 重置代码
  const resetCode = useCallback(() => {
    setCode(selectedExample.code)
  }, [selectedExample])

  // 复制代码
  const handleCopyCode = useCallback(() => {
    copy(code)
  }, [copy, code])

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      {/* 头部控制区 */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold">代码编辑器</h3>
            <Badge variant="default">
              {selectedExample.name}
            </Badge>
            <Badge variant="secondary">
              {selectedExample.difficulty}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTheme(activeTheme === 'dark' ? 'light' : 'dark')}
            >
              {activeTheme === 'dark' ? '🌙' : '☀️'}
            </Button>
            <Button variant="outline" size="sm" onClick={resetCode}>
              重置
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopyCode}>
              {isCopied ? '✅ 已复制' : '📋 复制'}
            </Button>
          </div>
        </div>
      </div>

      {/* 示例选择和搜索 */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4 space-y-4">
        {/* 搜索框 */}
        <div className="max-w-md">
          <Input
            type="text"
            placeholder="搜索示例..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* 分类过滤 */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <span className="mr-1">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* 示例列表 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {filteredExamples.map((example) => (
            <button
              key={example.id}
              onClick={() => selectExample(example)}
              className={`p-3 text-left border rounded-lg transition-colors ${
                selectedExample.id === example.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="font-medium text-sm mb-1">{example.name}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                {example.description}
              </div>
              <div className="flex flex-wrap gap-1">
                {example.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 编辑器和预览区 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 dark:divide-gray-700">
        {/* 编辑器区域 */}
        <div className="h-96 lg:h-auto min-h-[500px]">
          <div className="h-full flex flex-col">
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <h4 className="font-medium text-sm">TypeScript 代码</h4>
            </div>
            <div className="flex-1">
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
                  suggest: {
                    showKeywords: false,
                    showSnippets: true,
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* 预览区域 */}
        <div className="h-96 lg:h-auto min-h-[500px]">
          <div className="h-full flex flex-col">
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <h4 className="font-medium text-sm">实时预览</h4>
            </div>
            <div className="flex-1 p-4 overflow-auto">
              <Card>
                <CardHeader>
                  <h5 className="font-semibold">组件预览</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    在 {activeTheme === 'dark' ? '深色' : '浅色'} 主题下的效果
                  </p>
                </CardHeader>
                <CardContent>
                  {/* 预览占位符 */}
                  <div className="p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
                    <div className="text-6xl mb-4">🚧</div>
                    <h5 className="text-lg font-semibold mb-2">组件预览功能</h5>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      实时组件渲染功能正在开发中...
                    </p>
                    <CodePreview code={code} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}