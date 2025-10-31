/**
 * Workbench 实时预览引擎
 * 支持组件库的实时预览、热更新和性能优化
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { createPortal } from 'react-dom'
import type { ComponentExample, Recipe } from '../workbench-types'

/**
 * 组件预览配置
 */
export interface ComponentPreviewConfig {
  /** 组件名称 */
  componentName: string
  /** 源代码 */
  sourceCode: string
  /** 组件属性 */
  props?: Record<string, any>
  /** 主题配置 */
  theme?: 'default' | 'dark' | 'auto'
  /** 是否启用热更新 */
  hotReload?: boolean
  /** 预览模式 */
  mode?: 'preview' | 'edit' | 'split'
  /** 容器尺寸 */
  viewport?: { width: number; height: number }
  /** 缩放比例 */
  scale?: number
}

/**
 * 预渲染结果
 */
interface PreviewResult {
  /** 组件实例 */
  component: React.ComponentType<any> | null
  /** 编译时间 */
  compileTime: number
  /** 渲染时间 */
  renderTime: number
  /** 组件大小 */
  componentSize: number
  /** 依赖列表 */
  dependencies: string[]
}

/**
 * 预览状态
 */
interface PreviewState {
  /** 组件 */
  component: React.ComponentType<any> | null
  /** 是否加载中 */
  isLoading: boolean
  /** 错误信息 */
  error: string | null
  /** 性能指标 */
  metrics: {
    compileTime: number
    renderTime: number
    componentSize: number
    dependencyCount: number
  }
  /** 依赖分析 */
  dependencies: string[]
}

/**
 * 安全代码执行器
 */
class SafeCodeExecutor {
  private cache = new Map<string, PreviewResult>()
  private maxCacheSize = 50

  /**
   * 安全执行代码
   */
  async execute(config: ComponentPreviewConfig): Promise<PreviewResult> {
    const { componentName, sourceCode, props = {} } = config
    const cacheKey = `${componentName}-${this.hashString(sourceCode)}-${JSON.stringify(props)}`

    // 检查缓存
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!
    }

    const startTime = performance.now()

    try {
      // 预处理代码
      const processedCode = this.preprocessCode(sourceCode, componentName)

      // 创建沙箱环境
      const sandbox = this.createSandbox()

      // 执行代码
      const component = await this.executeInSandbox(processedCode, sandbox)

      const compileTime = performance.now() - startTime
      const renderStartTime = performance.now()

      // 测试渲染
      await this.testRender(component, props)

      const renderTime = performance.now() - renderStartTime
      const componentSize = new Blob([sourceCode]).size
      const dependencies = this.extractDependencies(sourceCode)

      const result: PreviewResult = {
        component,
        compileTime,
        renderTime,
        componentSize,
        dependencies
      }

      // 缓存结果
      this.addToCache(cacheKey, result)

      return result
    } catch (error) {
      throw new Error(`代码执行失败: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * 预处理代码
   */
  private preprocessCode(code: string, componentName: string): string {
    return code
      // 移除import语句（我们在沙箱中提供）
      .replace(/import\s+.*?from\s+['"][^'"]+['"];?\s*/g, '')
      // 移除export语句
      .replace(/export\s+default\s+/g, 'const ')
      .replace(/export\s+/g, '')
      // 确保组件被正确定义
      .replace(new RegExp(`const\\s+${componentName}\\s*=`), 'return ')
      // 包装为函数
      .trim()
  }

  /**
   * 创建安全沙箱
   */
  private createSandbox() {
    // 提供必要的React组件和hooks
    return {
      React,
      useState: React.useState,
      useEffect: React.useEffect,
      useCallback: React.useCallback,
      useMemo: React.useMemo,
      useRef: React.useRef,
      // 核心UI组件
      Button: this.getMockComponent('Button'),
      Card: this.getMockComponent('Card'),
      CardContent: this.getMockComponent('CardContent'),
      CardHeader: this.getMockComponent('CardHeader'),
      Badge: this.getMockComponent('Badge'),
      Input: this.getMockComponent('Input'),
      // 工具函数
      cn: (...classes: string[]) => classes.filter(Boolean).join(' '),
    }
  }

  /**
   * 获取模拟组件
   */
  private getMockComponent(name: string) {
    return (props: any) => React.createElement('div', {
      'data-mock': name,
      ...props
    }, props?.children)
  }

  /**
   * 在沙箱中执行代码
   */
  private async executeInSandbox(code: string, sandbox: any): Promise<React.ComponentType<any>> {
    const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor

    try {
      const fn = new AsyncFunction(...Object.keys(sandbox), code)
      const result = await fn(...Object.values(sandbox))

      if (typeof result === 'function') {
        return result
      } else if (result && typeof result.default === 'function') {
        return result.default
      } else {
        throw new Error('代码执行结果不是有效的 React 组件')
      }
    } catch (error) {
      throw new Error(`沙箱执行失败: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * 测试渲染
   */
  private async testRender(component: React.ComponentType<any>, props: any): Promise<void> {
    // 创建临时容器进行测试渲染
    const tempContainer = document.createElement('div')
    tempContainer.style.position = 'absolute'
    tempContainer.style.left = '-9999px'
    tempContainer.style.top = '-9999px'
    document.body.appendChild(tempContainer)

    try {
      const element = React.createElement(component, props)
      const { createRoot } = await import('react-dom/client')
      const root = createRoot(tempContainer)

      await new Promise<void>((resolve, reject) => {
        root.render(element)
        setTimeout(resolve, 100) // 等待渲染完成
      })

      root.unmount()
    } finally {
      document.body.removeChild(tempContainer)
    }
  }

  /**
   * 提取依赖
   */
  private extractDependencies(code: string): string[] {
    const dependencies = new Set<string>()

    // 提取React hooks
    const hooks = code.match(/use[A-Z]\w+/g) || []
    hooks.forEach(hook => dependencies.add(hook))

    // 提取组件引用
    const components = code.match(/[A-Z][a-zA-Z0-9]*/g) || []
    components.forEach(comp => dependencies.add(comp))

    return Array.from(dependencies)
  }

  /**
   * 字符串哈希
   */
  private hashString(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return hash.toString(36)
  }

  /**
   * 添加到缓存
   */
  private addToCache(key: string, result: PreviewResult): void {
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
    this.cache.set(key, result)
  }

  /**
   * 清空缓存
   */
  clearCache(): void {
    this.cache.clear()
  }
}

/**
 * 全局代码执行器实例
 */
const codeExecutor = new SafeCodeExecutor()

/**
 * Workbench 实时预览组件
 */
export function WorkbenchLivePreview({
  config,
  onMetricsUpdate,
  onError,
}: {
  config: ComponentPreviewConfig
  onMetricsUpdate?: (metrics: PreviewState['metrics']) => void
  onError?: (error: string) => void
}) {
  const [state, setState] = useState<PreviewState>({
    component: null,
    isLoading: false,
    error: null,
    metrics: {
      compileTime: 0,
      renderTime: 0,
      componentSize: 0,
      dependencyCount: 0,
    },
    dependencies: [],
  })

  const executionRef = useRef<number>()
  const containerRef = useRef<HTMLDivElement>(null)

  /**
   * 执行预览
   */
  const executePreview = useCallback(async () => {
    if (!config.sourceCode.trim()) {
      setState(prev => ({
        ...prev,
        component: null,
        isLoading: false,
        error: null,
      }))
      return
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const result = await codeExecutor.execute(config)

      setState({
        component: result.component,
        isLoading: false,
        error: null,
        metrics: {
          compileTime: Math.round(result.compileTime * 100) / 100,
          renderTime: Math.round(result.renderTime * 100) / 100,
          componentSize: result.componentSize,
          dependencyCount: result.dependencies.length,
        },
        dependencies: result.dependencies,
      })

      onMetricsUpdate?.(state.metrics)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      setState(prev => ({
        ...prev,
        component: null,
        isLoading: false,
        error: errorMessage,
      }))
      onError?.(errorMessage)
    }
  }, [config, onMetricsUpdate, onError, state.metrics])

  /**
   * 热更新支持
   */
  useEffect(() => {
    if (config.hotReload !== false) {
      // 防抖执行
      if (executionRef.current) {
        clearTimeout(executionRef.current)
      }

      executionRef.current = window.setTimeout(() => {
        executePreview()
      }, 300) // 300ms防抖
    }

    return () => {
      if (executionRef.current) {
        clearTimeout(executionRef.current)
      }
    }
  }, [executePreview, config.hotReload])

  /**
   * 组件卸载时清理
   */
  useEffect(() => {
    return () => {
      if (executionRef.current) {
        clearTimeout(executionRef.current)
      }
    }
  }, [])

  /**
   * 渲染加载状态
   */
  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
            <span className="text-sm text-muted-foreground">正在编译组件...</span>
          </div>
          <div className="text-xs text-muted-foreground">
            组件大小: {state.metrics.componentSize} 字节
          </div>
        </div>
      </div>
    )
  }

  /**
   * 渲染错误状态
   */
  if (state.error) {
    return (
      <div className="p-6">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <span className="text-destructive text-xl">⚠️</span>
            <div className="flex-1 space-y-2">
              <h3 className="text-sm font-semibold text-destructive">编译错误</h3>
              <p className="text-xs text-destructive/80 font-mono bg-destructive/5 p-2 rounded">
                {state.error}
              </p>
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <span>组件: {config.componentName}</span>
                <span>大小: {state.metrics.componentSize} 字节</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /**
   * 渲染空状态
   */
  if (!state.component) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-2">
          <div className="text-4xl opacity-50">📦</div>
          <p className="text-sm text-muted-foreground">等待组件加载...</p>
        </div>
      </div>
    )
  }

  /**
   * 渲染组件
   */
  const Component = state.component

  return (
    <div className="workbench-live-preview">
      {/* 性能指标 */}
      {(state.metrics.compileTime > 0 || state.metrics.renderTime > 0) && (
        <div className="border-b px-4 py-2 bg-muted/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span>编译: {state.metrics.compileTime}ms</span>
              <span>渲染: {state.metrics.renderTime}ms</span>
              <span>大小: {state.metrics.componentSize}B</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>依赖: {state.metrics.dependencyCount}</span>
              {state.dependencies.length > 0 && (
                <div className="flex items-center space-x-1">
                  {state.dependencies.slice(0, 3).map(dep => (
                    <span key={dep} className="px-1 py-0.5 bg-primary/10 rounded text-xs">
                      {dep}
                    </span>
                  ))}
                  {state.dependencies.length > 3 && (
                    <span className="text-xs">+{state.dependencies.length - 3}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 组件预览区域 */}
      <div
        ref={containerRef}
        className="relative overflow-auto"
        style={{
          width: config.viewport?.width ? `${config.viewport.width}px` : '100%',
          height: config.viewport?.height ? `${config.viewport.height}px` : 'auto',
          transform: config.scale ? `scale(${config.scale})` : undefined,
          transformOrigin: 'top left',
        }}
      >
        <div className="p-4">
          <Component {...config.props} />
        </div>
      </div>
    </div>
  )
}

/**
 * 预览组件工厂 - 创建不同类型的预览
 */
export class PreviewFactory {
  /**
   * 创建组件预览
   */
  static createComponentPreview(example: ComponentExample): ComponentPreviewConfig {
    return {
      componentName: example.name,
      sourceCode: example.code,
      hotReload: true,
      mode: 'preview',
    }
  }

  /**
   * 创建配方预览
   */
  static createRecipePreview(recipe: Recipe, theme: 'default' | 'dark' = 'default'): ComponentPreviewConfig {
    const themeCode = this.generateThemeCode(recipe, theme)

    return {
      componentName: `${recipe.name}Theme`,
      sourceCode: themeCode,
      props: { recipe },
      theme,
      hotReload: true,
      mode: 'preview',
    }
  }

  /**
   * 生成主题代码
   */
  private static generateThemeCode(recipe: Recipe, theme: 'default' | 'dark'): string {
    return `
      function ${recipe.name}Theme() {
        const themeColors = ${JSON.stringify(recipe.colors)};

        return (
          <div className="p-6 rounded-lg" style={{
            background: themeColors[0],
            color: themeColors[1],
            border: \`2px solid \${themeColors[2]}\`,
          }}>
            <h3 className="text-lg font-semibold mb-2">${recipe.name}</h3>
            <p className="text-sm opacity-80">${recipe.description}</p>
            <div className="flex space-x-2 mt-4">
              ${recipe.colors.map((color, index) => `
                <div
                  key={index}
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: "${color}" }}
                  title="${color}"
                />
              `).join('')}
            </div>
          </div>
        );
      }
    `
  }
}

/**
 * 清空预览缓存
 */
export function clearPreviewCache() {
  codeExecutor.clearCache()
}