'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'
import { useWorkbench, useEditorState } from '../workbench-context'
import dynamic from 'next/dynamic'
import { WorkbenchPropsEditor, type PropDefinition } from './workbench-props-editor'
import { WorkbenchThemeEditor, type ThemeState } from './workbench-theme-editor'

// 动态导入 ComponentPreview 避免服务端渲染问题
const ComponentPreview = dynamic(() => import('../shared/workbench-component-preview').then(mod => ({ default: mod.WorkbenchComponentPreview })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-muted animate-pulse">
      <div className="text-muted-foreground">组件预览加载中...</div>
    </div>
  ),
})

// 动态导入 Monaco Editor 避免服务端渲染问题
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-muted animate-pulse">
      <div className="text-muted-foreground">编辑器加载中...</div>
    </div>
  ),
})

// 注意：componentExamples 将从 Server 组件获取，避免重复定义

/**
 * Workbench Editor Mode 客户端组件
 * 整合到 Workbench Context 系统，提供代码编辑和实时预览功能
 */
// 组件示例接口
interface ComponentExample {
  id: string
  name: string
  description: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  code: string
}

interface WorkbenchEditorClientProps {
  examples?: ComponentExample[]
  categories?: Array<{ id: string; name: string; icon: string }>
}

export function WorkbenchEditorClient({
  examples = [],
  categories,
}: WorkbenchEditorClientProps) {
  const searchParams = useSearchParams()
  const [showPropsEditor, setShowPropsEditor] = useState(false)
  const [showThemeEditor, setShowThemeEditor] = useState(false)
  const [componentProps, setComponentProps] = useState<Record<string, any>>({})
  const [themeState, setThemeState] = useState<ThemeState>({
    mode: 'light',
    density: 'comfortable',
    hue: 'blue',
    surface: 'flat',
    rtl: false,
  })

  const {
    code,
    setCode,
    activeTheme,
    setActiveTheme,
    selectedExample,
    setSelectedExample,
    setIsLoading,
    setError
  } = useEditorState()
  const { mode, setMode } = useWorkbench()

  // 定义组件属性配置
  const propDefinitions: PropDefinition[] = useMemo(() => {
    if (!selectedExample) return []

    // 根据不同的组件示例返回不同的属性定义
    switch (selectedExample.id) {
      case 'button':
        return [
          {
            key: 'variant',
            type: 'select' as const,
            label: '变体',
            defaultValue: 'primary',
            options: ['primary', 'secondary', 'outline', 'ghost'],
            description: '按钮的视觉变体'
          },
          {
            key: 'size',
            type: 'select' as const,
            label: '尺寸',
            defaultValue: 'md',
            options: ['sm', 'md', 'lg'],
            description: '按钮的尺寸大小'
          },
          {
            key: 'disabled',
            type: 'boolean' as const,
            label: '禁用状态',
            defaultValue: false,
            description: '是否禁用按钮'
          },
          {
            key: 'text',
            type: 'string' as const,
            label: '按钮文本',
            defaultValue: '点击按钮',
            description: '按钮上显示的文本'
          }
        ]
      case 'card':
        return [
          {
            key: 'title',
            type: 'string' as const,
            label: '卡片标题',
            defaultValue: '卡片标题',
            description: '卡片标题文本'
          },
          {
            key: 'description',
            type: 'string' as const,
            label: '卡片描述',
            defaultValue: '这是卡片的描述内容',
            description: '卡片描述文本'
          },
          {
            key: 'showAction',
            type: 'boolean' as const,
            label: '显示操作按钮',
            defaultValue: true,
            description: '是否显示操作按钮'
          }
        ]
      case 'input':
        return [
          {
            key: 'placeholder',
            type: 'string' as const,
            label: '占位符',
            defaultValue: '请输入内容',
            description: '输入框占位符文本'
          },
          {
            key: 'type',
            type: 'select' as const,
            label: '输入类型',
            defaultValue: 'text',
            options: ['text', 'password', 'email', 'number'],
            description: '输入框的类型'
          },
          {
            key: 'disabled',
            type: 'boolean' as const,
            label: '禁用状态',
            defaultValue: false,
            description: '是否禁用输入框'
          }
        ]
      default:
        return []
    }
  }, [selectedExample])

  // 处理属性变化
  const handlePropChange = useCallback((key: string, value: any) => {
    setComponentProps(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])

  // 重置属性
  const resetProps = useCallback(() => {
    const defaultProps: Record<string, any> = {}
    propDefinitions.forEach(prop => {
      defaultProps[prop.key] = prop.defaultValue
    })
    setComponentProps(defaultProps)
  }, [propDefinitions])

  // 当选中的示例改变时，重置属性
  useEffect(() => {
    resetProps()
  }, [selectedExample, resetProps])

  // 处理主题变化
  const handleThemeChange = useCallback((updates: Partial<ThemeState>) => {
    setThemeState(prev => ({
      ...prev,
      ...updates
    }))
  }, [])

  // 重置主题
  const resetTheme = useCallback(() => {
    const defaultTheme: ThemeState = {
      mode: 'light',
      density: 'comfortable',
      hue: 'blue',
      surface: 'flat',
      rtl: false,
    }
    setThemeState(defaultTheme)
  }, [])

  // 处理来自 Gallery 的 URL 参数
  useEffect(() => {
    const componentId = searchParams.get('component')
    const recipeId = searchParams.get('recipe')
    const recipeName = searchParams.get('name')

    if (componentId) {
      // 处理来自 Gallery 的组件 ID
      const matchedExample = examples.find(example => example.id === componentId)

      if (matchedExample) {
        setSelectedExample(matchedExample)
        setCode(matchedExample.code)
        setIsLoading(false)
      }
    } else if (recipeId && recipeName) {
      // 处理来自 Gallery 的配方 ID（如果存在配方系统）
      const customExample = {
        id: recipeId,
        name: decodeURIComponent(recipeName),
        description: '来自 Gallery 的组件示例',
        code: `export default function ${decodeURIComponent(recipeName).replace(/[^a-zA-Z0-9]/g, '')}Example() {
  return (
    <div className="p-6 border rounded-lg bg-card">
      <h3 className="text-lg font-semibold mb-4">
        ${decodeURIComponent(recipeName)}
      </h3>
      <p className="text-muted-foreground">
        这是一个来自 Gallery 的组件示例。
      </p>
      <div className="mt-4">
        <Button>示例按钮</Button>
      </div>
    </div>
  )
}`
      }

      setSelectedExample(customExample)
      setCode(customExample.code)
      setIsLoading(false)
    } else if (!selectedExample && examples.length > 0) {
      // 设置默认示例
      setSelectedExample(examples[0])
      setCode(examples[0].code)
      setIsLoading(false)
    }
  }, [searchParams, examples, setSelectedExample, setCode, selectedExample])

  // 选择示例
  const selectExample = useCallback((example: ComponentExample) => {
    setSelectedExample(example)
    setCode(example.code)
    setError(null)
  }, [setSelectedExample, setCode, setError])

  // 重置代码
  const resetCode = useCallback(() => {
    if (selectedExample) {
      setCode(selectedExample.code)
      setError(null)
    }
  }, [selectedExample, setCode, setError])

  // 复制代码
  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      // TODO: 添加 toast 提示
      console.log('代码已复制到剪贴板')
    } catch (err) {
      setError('复制失败，请手动复制')
      console.error('复制失败:', err)
    }
  }, [code, setError])

  // 切换到 Gallery Mode
  const switchToGallery = useCallback(() => {
    setMode('gallery')
  }, [setMode])

  // 切换到 Split Mode
  const switchToSplit = useCallback(() => {
    setMode('split')
  }, [setMode])

  // 分类过滤示例
  const filteredExamples = useMemo(() => {
    if (!selectedExample || !categories) return examples

    const categoryId = searchParams.get('category')
    if (!categoryId || categoryId === 'all') return examples

    return examples.filter(example => example.category === categoryId)
  }, [examples, categories, selectedExample, searchParams])

  return (
    <div className="flex h-screen bg-background">
      {/* 左侧编辑器区域 */}
      <div className="w-1/2 flex flex-col border-r border-border">
        {/* 编辑器头部 */}
        <div className="h-12 border-b border-border bg-muted px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="font-medium">代码编辑器</h3>
            {selectedExample && (
              <Badge variant="default" className="text-xs">
                {selectedExample.name}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={resetCode}>
              重置
            </Button>
            <Button variant="ghost" size="sm" onClick={copyCode}>
              复制
            </Button>
            <Button variant="ghost" size="sm" onClick={switchToGallery}>
              🎨
            </Button>
            <Button variant="ghost" size="sm" onClick={switchToSplit}>
              📱
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPropsEditor(!showPropsEditor)}
              className={showPropsEditor ? 'bg-muted' : ''}
            >
              ⚙️
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowThemeEditor(!showThemeEditor)}
              className={showThemeEditor ? 'bg-muted' : ''}
            >
              🎨
            </Button>
          </div>
        </div>

        {/* 示例选择器 */}
        <div className="border-b border-border bg-muted px-4 py-3">
          <div className="flex space-x-2 overflow-x-auto">
            {filteredExamples.map((example) => (
              <button
                key={example.id}
                onClick={() => selectExample(example)}
                className={`px-3 py-1 text-sm rounded-md transition-colors whitespace-nowrap ${
                  selectedExample?.id === example.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-background text-muted-foreground hover:bg-muted'
                }`}
              >
                {example.name}
                {example.difficulty === 'beginner' && (
                  <span className="ml-1 text-xs">👶</span>
                )}
                {example.difficulty === 'intermediate' && (
                  <span className="ml-1 text-xs">👨</span>
                )}
                {example.difficulty === 'advanced' && (
                  <span className="ml-1 text-xs">👨</span>
                )}
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
              fontSize: 14,
            }}
          />
        </div>

        {/* 编辑器底部状态栏 */}
        <div className="h-8 border-t border-border bg-muted px-4 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>行数: {code.split('\n').length}</span>
            <span>•</span>
            <span>字符数: {code.length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>TypeScript</span>
            <span>•</span>
            <span>{activeTheme === 'dark' ? '深色' : '浅色'} 主题</span>
          </div>
        </div>
      </div>

      {/* 右侧预览区域 */}
      <div className="w-1/2 flex flex-col">
        {/* 预览头部 */}
        <div className="h-12 border-b border-border bg-muted px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="font-medium">
              {showThemeEditor ? '主题编辑器' : showPropsEditor ? '属性编辑器' : '实时预览'}
            </h3>
            {selectedExample && (
              <Badge variant="default" className="text-xs">
                {selectedExample.description}
              </Badge>
            )}
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

        {/* 主要内容区域 */}
        <div className="flex-1 flex">
          {/* Props Editor 面板 */}
          {showPropsEditor && !showThemeEditor && (
            <div className="w-80 border-r border-border">
              <WorkbenchPropsEditor
                propDefinitions={propDefinitions}
                currentProps={componentProps}
                onPropChange={handlePropChange}
                onReset={resetProps}
                showHistory={false}
                componentId={selectedExample?.id}
              />
            </div>
          )}

          {/* Theme Editor 面板 */}
          {showThemeEditor && (
            <div className="w-80 border-r border-border">
              <WorkbenchThemeEditor
                themeState={themeState}
                onThemeChange={handleThemeChange}
                onReset={resetTheme}
              />
            </div>
          )}

          {/* 预览内容 */}
          <div className={`flex-1 p-6 overflow-auto ${showPropsEditor || showThemeEditor ? '' : 'w-full'}`}>
            <div className="min-h-full flex items-center justify-center">
              <Card className="w-full max-w-3xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">组件预览</h3>
                      <p className="text-sm text-muted-foreground">
                        这是在 {activeTheme === 'dark' ? '深色' : '浅色'} 主题下的预览效果
                        {showThemeEditor && ` • ${themeState.mode} 模式`}
                      </p>
                    </div>
                    {selectedExample && (
                      <div className="flex flex-wrap gap-1">
                        {selectedExample.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className={`p-6 ${activeTheme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
                  <div id="preview-container">
                    <ComponentPreview
                      componentName={selectedExample?.name || '未知组件'}
                      props={{
                        theme: showThemeEditor ? themeState.mode : activeTheme,
                        ...componentProps
                      }}
                      code={code}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* 预览底部状态栏 */}
        <div className="h-8 border-t border-border bg-muted px-4 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>模式: {mode}</span>
            <span>•</span>
            <span>主题: {showThemeEditor ? themeState.mode : activeTheme}</span>
            {showPropsEditor && (
              <>
                <span>•</span>
                <span>属性: {Object.keys(componentProps).length}</span>
              </>
            )}
            {showThemeEditor && (
              <>
                <span>•</span>
                <span>密度: {themeState.density}</span>
              </>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span>自动刷新</span>
            <span>•</span>
            <span>错误处理: 开启</span>
          </div>
        </div>
      </div>
    </div>
  )
}