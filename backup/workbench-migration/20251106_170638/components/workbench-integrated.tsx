/**
 * Workbench 集成主组件
 * 整合所有功能：实时预览、Monaco编辑器、配方编辑、开发工具、性能优化
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'
import { WorkbenchLivePreview, ComponentPreviewConfig } from './preview/workbench-live-preview'
import { WorkbenchMonacoEditor, MonacoEditorConfig } from './editor/workbench-monaco-editor'
import { RecipeVisualEditor, SevenAxisTheme } from './recipe/recipe-visual-editor'
import { WorkbenchDevtools } from './devtools/workbench-devtools'
import { WorkbenchPerformanceOptimizer } from './performance/workbench-performance-optimizer'
import type { ComponentExample, Recipe } from './workbench-types'

/**
 * 集成Workbench配置
 */
export interface IntegratedWorkbenchConfig {
  /** 初始模式 */
  initialMode?: 'preview' | 'edit' | 'recipe' | 'devtools' | 'performance'
  /** 是否启用自动保存 */
  autoSave?: boolean
  /** 自动保存间隔（毫秒） */
  autoSaveInterval?: number
  /** 是否启用实时预览 */
  livePreview?: boolean
  /** 是否启用性能监控 */
  enablePerformanceMonitoring?: boolean
  /** 主题配置 */
  theme?: {
    mode: 'default' | 'dark' | 'auto'
    recipeSupport: boolean
  }
  /** 编辑器配置 */
  editorConfig?: MonacoEditorConfig
  /** 布局配置 */
  layout?: {
    direction: 'horizontal' | 'vertical'
    sidebarWidth?: number
    showMinimap?: boolean
  }
}

/**
 * Workbench状态
 */
interface WorkbenchState {
  /** 当前模式 */
  mode: 'preview' | 'edit' | 'recipe' | 'devtools' | 'performance'
  /** 当前代码 */
  code: string
  /** 当前组件 */
  component: ComponentExample | null
  /** 当前配方 */
  recipe: Recipe | null
  /** 当前主题 */
  theme: SevenAxisTheme
  /** 是否正在加载 */
  isLoading: boolean
  /** 错误信息 */
  error: string | null
  /** 是否已修改 */
  isModified: boolean
  /** 性能指标 */
  performance: {
    renderTime: number
    memoryUsage: number
    fps: number
  }
}

/**
 * 集成Workbench属性
 */
export interface IntegratedWorkbenchProps {
  /** 配置 */
  config?: IntegratedWorkbenchConfig
  /** 初始组件 */
  initialComponent?: ComponentExample
  /** 初始配方 */
  initialRecipe?: Recipe
  /** 组件列表 */
  components?: ComponentExample[]
  /** 配方列表 */
  recipes?: Recipe[]
  /** 状态变化回调 */
  onStateChange?: (state: WorkbenchState) => void
  /** 代码变化回调 */
  onCodeChange?: (code: string) => void
  /** 组件变化回调 */
  onComponentChange?: (component: ComponentExample) => void
  /** 配方变化回调 */
  onRecipeChange?: (recipe: Recipe) => void
  /** 保存回调 */
  onSave?: (data: {
    code: string
    component?: ComponentExample
    recipe?: Recipe
    theme?: SevenAxisTheme
  }) => void
  /** 错误回调 */
  onError?: (error: string) => void
  /** CSS类名 */
  className?: string
}

/**
 * 默认组件模板
 */
const DEFAULT_COMPONENTS: ComponentExample[] = [
  {
    id: 'basic-button',
    name: 'BasicButton',
    description: '基础按钮组件',
    code: `export function BasicButton({ variant = 'primary', size = 'md', disabled = false, onClick, children }) {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background'

  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
  }

  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 py-2 px-4',
    lg: 'h-11 px-8 text-lg',
  }

  return (
    <button
      className={\`\${baseClasses} \${variants[variant]} \${sizes[size]}\`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}`
  },
  {
    id: 'user-card',
    name: 'UserCard',
    description: '用户卡片组件',
    code: `export function UserCard({ user, onEdit, onDelete }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleEdit = useCallback(() => {
    setIsLoading(true)
    onEdit?.(user).finally(() => setIsLoading(false))
  }, [user, onEdit])

  const handleDelete = useCallback(() => {
    if (confirm('确定要删除此用户吗？')) {
      onDelete?.(user.id)
    }
  }, [user, onDelete])

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">{user.bio}</p>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={handleEdit} disabled={isLoading}>
              编辑
            </Button>
            <Button size="sm" variant="destructive" onClick={handleDelete}>
              删除
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}`
  }
]

/**
 * 默认配方模板
 */
const DEFAULT_RECIPES: Recipe[] = [
  {
    id: 'ocean-blue',
    name: '海洋蓝',
    description: '清新自然的海洋蓝色调主题',
    category: 'nature',
    colors: ['#0EA5E9', '#0284C7', '#0369A1', '#F0F9FF', '#0C4A6E', '#E0F2FE', '#BAE6FD', '#7DD3FC'],
    tags: ['blue', 'ocean', 'nature', 'fresh'],
    image: '/recipes/ocean-blue.jpg'
  },
  {
    id: 'sunset-orange',
    name: '夕阳橙',
    description: '温暖活力的夕阳橙色调主题',
    category: 'warm',
    colors: ['#FB923C', '#F97316', '#EA580C', '#FFF7ED', '#9A3412', '#FED7AA', '#FDBA74', '#FB923C'],
    tags: ['orange', 'sunset', 'warm', 'energy'],
    image: '/recipes/sunset-orange.jpg'
  }
]

/**
 * 默认主题配置
 */
const DEFAULT_THEME: SevenAxisTheme = {
  mode: 'light',
  hue: 220,
  saturation: 70,
  lightness: 50,
  density: 'comfortable',
  roundness: 8,
  contrast: 'normal'
}

/**
 * 集成Workbench组件
 */
export function IntegratedWorkbench({
  config = {},
  initialComponent,
  initialRecipe,
  components = DEFAULT_COMPONENTS,
  recipes = DEFAULT_RECIPES,
  onStateChange,
  onCodeChange,
  onComponentChange,
  onRecipeChange,
  onSave,
  onError,
  className = '',
}: IntegratedWorkbenchProps) {
  // 状态管理
  const [state, setState] = useState<WorkbenchState>({
    mode: config.initialMode || 'preview',
    code: initialComponent?.code || DEFAULT_COMPONENTS[0]?.code || '',
    component: initialComponent || DEFAULT_COMPONENTS[0] || null,
    recipe: initialRecipe || DEFAULT_RECIPES[0] || null,
    theme: DEFAULT_THEME,
    isLoading: false,
    error: null,
    isModified: false,
    performance: {
      renderTime: 0,
      memoryUsage: 0,
      fps: 60
    }
  })

  const autoSaveTimeoutRef = useRef<number>()

  /**
   * 更新状态
   */
  const updateState = useCallback((updates: Partial<WorkbenchState>) => {
    setState(prev => {
      const newState = { ...prev, ...updates }
      onStateChange?.(newState)
      return newState
    })
  }, [onStateChange])

  /**
   * 处理代码变化
   */
  const handleCodeChange = useCallback((code: string) => {
    updateState({
      code,
      isModified: true,
      error: null
    })
    onCodeChange?.(code)

    // 自动保存
    if (config.autoSave && config.autoSaveInterval) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
      autoSaveTimeoutRef.current = window.setTimeout(() => {
        handleSave()
      }, config.autoSaveInterval)
    }
  }, [updateState, onCodeChange, config.autoSave, config.autoSaveInterval])

  /**
   * 处理组件变化
   */
  const handleComponentChange = useCallback((component: ComponentExample) => {
    updateState({
      component,
      code: component.code,
      isModified: true
    })
    onComponentChange?.(component)
  }, [updateState, onComponentChange])

  /**
   * 处理配方变化
   */
  const handleRecipeChange = useCallback((recipe: Recipe) => {
    updateState({
      recipe,
      isModified: true
    })
    onRecipeChange?.(recipe)
  }, [updateState, onRecipeChange])

  /**
   * 处理主题变化
   */
  const handleThemeChange = useCallback((theme: SevenAxisTheme) => {
    updateState({ theme })
  }, [updateState])

  /**
   * 处理模式切换
   */
  const handleModeChange = useCallback((mode: WorkbenchState['mode']) => {
    updateState({ mode })
  }, [updateState])

  /**
   * 处理保存
   */
  const handleSave = useCallback(() => {
    if (!state.isModified) return

    try {
      onSave?.({
        code: state.code,
        component: state.component || undefined,
        recipe: state.recipe || undefined,
        theme: state.theme
      })
      updateState({ isModified: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '保存失败'
      handleError(errorMessage)
    }
  }, [state, onSave, updateState])

  /**
   * 处理错误
   */
  const handleError = useCallback((error: string) => {
    updateState({ error })
    onError?.(error)
  }, [updateState, onError])

  /**
   * 处理性能指标更新
   */
  const handlePerformanceUpdate = useCallback((metrics: any) => {
    updateState({
      performance: {
        renderTime: metrics.renderTime || 0,
        memoryUsage: metrics.memoryUsage || 0,
        fps: metrics.fps || 60
      }
    })
  }, [updateState])

  /**
   * 处理优化建议
   */
  const handleSuggestion = useCallback((suggestion: any) => {
    console.log('优化建议:', suggestion)
    // 这里可以实现自动应用优化建议的逻辑
  }, [])

  /**
   * 组件预览配置
   */
  const previewConfig = useMemo((): ComponentPreviewConfig => {
    return {
      componentName: state.component?.name || 'Component',
      sourceCode: state.code,
      hotReload: config.livePreview !== false,
      mode: 'preview',
      theme: config.theme?.mode || 'default'
    }
  }, [state.component?.name, state.code, config.livePreview, config.theme?.mode])

  /**
   * 渲染工具栏
   */
  const Toolbar = () => (
    <div className="flex items-center justify-between p-4 border-b bg-muted/30">
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-semibold">Workbench 集成环境</h2>

        {/* 性能指标 */}
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-muted-foreground">FPS:</span>
          <span className={state.performance.fps >= 50 ? 'text-green-600' : 'text-yellow-600'}>
            {state.performance.fps}
          </span>
          <span className="text-muted-foreground ml-2">内存:</span>
          <span className={state.performance.memoryUsage < 50 ? 'text-green-600' : 'text-yellow-600'}>
            {state.performance.memoryUsage}MB
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* 模式切换 */}
        <div className="flex space-x-1">
          {[
            { mode: 'preview' as const, label: '预览' },
            { mode: 'edit' as const, label: '编辑' },
            { mode: 'recipe' as const, label: '配方' },
            { mode: 'devtools' as const, label: '开发工具' },
            { mode: 'performance' as const, label: '性能' }
          ].map(({ mode, label }) => (
            <Button
              key={mode}
              variant={state.mode === mode ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleModeChange(mode)}
            >
              {label}
            </Button>
          ))}
        </div>

        {/* 保存按钮 */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          disabled={!state.isModified}
        >
          {state.isModified ? '保存 *' : '保存'}
        </Button>
      </div>
    </div>
  )

  /**
   * 渲染侧边栏
   */
  const Sidebar = () => (
    <div className="w-64 border-r bg-muted/20 p-4 space-y-4">
      {/* 组件选择 */}
      <div>
        <h3 className="font-medium mb-2">组件库</h3>
        <div className="space-y-1">
          {components.map(component => (
            <Button
              key={component.id}
              variant={state.component?.id === component.id ? 'default' : 'ghost'}
              size="sm"
              className="w-full justify-start"
              onClick={() => handleComponentChange(component)}
            >
              {component.name}
            </Button>
          ))}
        </div>
      </div>

      {/* 配方选择 */}
      {config.theme?.recipeSupport && (
        <div>
          <h3 className="font-medium mb-2">主题配方</h3>
          <div className="space-y-1">
            {recipes.map(recipe => (
              <Button
                key={recipe.id}
                variant={state.recipe?.id === recipe.id ? 'default' : 'ghost'}
                size="sm"
                className="w-full justify-start"
                onClick={() => handleRecipeChange(recipe)}
              >
                {recipe.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* 快速操作 */}
      <div>
        <h3 className="font-medium mb-2">快速操作</h3>
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full">
            导出代码
          </Button>
          <Button variant="outline" size="sm" className="w-full">
            分享链接
          </Button>
          <Button variant="outline" size="sm" className="w-full">
            查看文档
          </Button>
        </div>
      </div>
    </div>
  )

  /**
   * 渲染主内容区域
   */
  const MainContent = () => (
    <div className="flex-1 flex">
      {/* 根据模式渲染不同内容 */}
      {state.mode === 'preview' && (
        <div className="flex-1">
          <WorkbenchLivePreview
            config={previewConfig}
            onMetricsUpdate={handlePerformanceUpdate}
            onError={handleError}
          />
        </div>
      )}

      {state.mode === 'edit' && (
        <div className="flex-1">
          <WorkbenchMonacoEditor
            value={state.code}
            config={{
              language: 'typescript',
              theme: config.theme?.mode === 'dark' ? 'vs-dark' : 'vs-light',
              ...config.editorConfig
            }}
            events={{
              onChange: handleCodeChange,
              onSave: handleSave,
              onError: handleError
            }}
            templates={components.map(comp => ({
              name: comp.name,
              description: comp.description,
              content: comp.code
            }))}
          />
        </div>
      )}

      {state.mode === 'recipe' && state.recipe && (
        <div className="flex-1">
          <RecipeVisualEditor
            recipe={state.recipe}
            onRecipeChange={handleRecipeChange}
            theme={state.theme}
            onThemeChange={handleThemeChange}
            livePreview={config.livePreview !== false}
            showAdvanced={true}
          />
        </div>
      )}

      {state.mode === 'devtools' && (
        <div className="flex-1">
          <WorkbenchDevtools
            code={state.code}
            componentName={state.component?.name}
            performanceData={state.performance}
            onAnalysisUpdate={handlePerformanceUpdate}
            showAdvanced={true}
          />
        </div>
      )}

      {state.mode === 'performance' && (
        <div className="flex-1">
          <WorkbenchPerformanceOptimizer
            code={state.code}
            autoOptimize={true}
            onMetricsUpdate={handlePerformanceUpdate}
            onSuggestion={handleSuggestion}
            showAdvanced={true}
          />
        </div>
      )}
    </div>
  )

  /**
   * 渲染状态栏
   */
  const StatusBar = () => (
    <div className="border-t px-4 py-1 bg-muted/20">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center space-x-4">
          <span>组件: {state.component?.name || '未选择'}</span>
          <span>模式: {state.mode}</span>
          {state.isModified && <span className="text-orange-600">已修改</span>}
        </div>
        <div className="flex items-center space-x-4">
          <span>渲染: {state.performance.renderTime}ms</span>
          <span>FPS: {state.performance.fps}</span>
          <span>内存: {state.performance.memoryUsage}MB</span>
        </div>
      </div>
    </div>
  )

  // 清理自动保存定时器
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className={`integrated-workbench flex flex-col h-screen bg-background ${className}`}>
      <Toolbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <MainContent />
      </div>

      <StatusBar />

      {/* 错误提示 */}
      {state.error && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <Card className="border-destructive bg-destructive/10">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <span className="text-destructive">⚠️</span>
                <div>
                  <h4 className="font-medium text-sm text-destructive">错误</h4>
                  <p className="text-xs text-destructive/80 mt-1">{state.error}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2"
                    onClick={() => updateState({ error: null })}
                  >
                    关闭
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

/**
 * 导出默认配置
 */
export const DEFAULT_INTEGRATED_CONFIG: IntegratedWorkbenchConfig = {
  initialMode: 'preview',
  autoSave: true,
  autoSaveInterval: 30000,
  livePreview: true,
  enablePerformanceMonitoring: true,
  theme: {
    mode: 'default',
    recipeSupport: true
  },
  layout: {
    direction: 'horizontal',
    sidebarWidth: 256,
    showMinimap: true
  }
}