# Xorigo UI SSR 架构设计文档

## 概述

本文档详细说明了 Xorigo UI 组件库的 SSR（服务端渲染）架构设计，包括技术选型、实现原理、性能优化和扩展性考虑。

## 🎯 设计目标

### 核心目标
1. **完全 SSR 兼容** - 确保所有组件在服务端安全渲染
2. **零水合错误** - 消除客户端和服务端渲染不一致
3. **渐进式增强** - 基础功能始终可用，动画按需启用
4. **性能优先** - 优化包大小和运行时性能
5. **开发体验** - 提供直观的 API 和完善的调试工具

### 技术目标
- 支持 React 18+ 的并发特性
- 兼容主流 SSR 框架（Next.js、Remix、Gatsby）
- 保持现有 API 的向后兼容性
- 提供完整的 TypeScript 类型支持
- 支持主题系统和动画系统

## 🏗️ 架构概览

```
┌─────────────────────────────────────────────────────────────┐
│                        Xorigo UI SSR 架构                      │
├─────────────────────────────────────────────────────────────┤
│  应用层 (Application Layer)                                  │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│  │   Next.js App   │ │   Remix App     │ │   Gatsby App    │ │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  提供者层 (Provider Layer)                                   │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │           MotionProvider                                │ │
│  │  • 动画状态管理                                        │ │
│  │  • 水合检测控制                                        │ │
│  │  • 用户偏好响应                                        │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │           ThemeProvider                                 │ │
│  │  • 主题变量管理                                        │ │
│  │  • CSS 预加载                                          │ │
│  │  • 系统主题检测                                        │ │
│  └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  组件层 (Component Layer)                                    │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│  │   SSRMotionDiv  │ │   SSRAnimate    │ │   ThemeToggle   │ │
│  │   (动画包装)     │ │   Presence      │ │   (主题切换)     │ │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘ │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│  │     Alert       │ │     Loading      │ │   ThemeProvider │ │
│  │   (已重构)       │ │   (已重构)       │ │   (SSR 友好)    │ │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  工具层 (Utility Layer)                                      │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │           SSR 检测系统                                   │ │
│  │  • 环境检测                                            │ │
│  │  • API 安全访问                                        │ │
│  │  • 错误边界保护                                        │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │           主题系统工具                                   │ │
│  │  • CSS 变量管理                                        │ │
│  │  • 服务端预加载                                        │ │
│  │  • 动态主题切换                                        │ │
│  └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  构建层 (Build Layer)                                        │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│  │    Vite 配置    │ │   SSR 构建      │ │   类型生成      │ │
│  │   (优化)         │ │   (专用)        │ │   (完整)         │ │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 核心模块设计

### 1. SSR 检测系统

#### 设计原理
通过运行时环境检测，确保代码在服务端和客户端都能安全执行。

#### 核心功能
```typescript
// 环境检测
export const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'
export const isServer = !isBrowser
export const isNode = typeof process !== 'undefined' && process.versions?.node

// 安全的 API 访问
export const getWindow = () => isBrowser ? window : null
export const getDocument = () => isBrowser ? document : null
```

#### 扩展设计
```typescript
// 更精细的环境检测
export interface EnvironmentInfo {
  isBrowser: boolean
  isServer: boolean
  isNode: boolean
  hasDOM: boolean
  userAgent?: string
  platform?: string
  isSSR: boolean
  isCSR: boolean
}

// 上下文感知的检测
export const getEnvironment = (): EnvironmentInfo => {
  const isBrowser = typeof window !== 'undefined'
  const isServer = !isBrowser
  const isNode = typeof process !== 'undefined' && process.versions?.node

  return {
    isBrowser,
    isServer,
    isNode,
    hasDOM: isBrowser && typeof document !== 'undefined',
    userAgent: isBrowser ? navigator.userAgent : undefined,
    platform: isNode ? process.platform : undefined,
    isSSR: isServer,
    isCSR: isBrowser
  }
}
```

### 2. 动画系统架构

#### 问题分析
1. Framer Motion 在服务端无法正确处理动画状态
2. 水合过程产生 DOM 不一致错误
3. 动画性能在低端设备上表现不佳
4. 用户偏好设置（减少动画）未被尊重

#### 解决方案设计

##### MotionProvider 架构
```typescript
interface MotionContextType {
  isMotionEnabled: boolean    // 动画是否启用
  prefersReducedMotion: boolean // 用户是否偏好减少动画
  setMotionEnabled: (enabled: boolean) => void
}

class MotionProvider extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isMotionEnabled: false,  // 默认禁用，避免 SSR 问题
      prefersReducedMotion: false,
      isHydrated: false
    }
  }

  componentDidMount() {
    // 客户端水合后检测动画偏好
    this.detectMotionPreferences()
    this.scheduleMotionEnable()
  }

  detectMotionPreferences() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    this.setState({ prefersReducedMotion: mediaQuery.matches })

    // 监听偏好变化
    mediaQuery.addEventListener('change', this.handlePreferenceChange)
  }

  scheduleMotionEnable() {
    this.setState({ isHydrated: true })

    if (this.props.enableOnHydrate) {
      setTimeout(() => {
        this.setState({ isMotionEnabled: true })
      }, this.props.delay)
    }
  }
}
```

##### SSRMotionDiv 设计
```typescript
interface SSRMotionDivProps extends MotionProps {
  fallbackStyle?: React.CSSProperties  // 动画禁用时的静态样式
  forceAnimation?: boolean            // 强制启用动画
  finalState?: any                    // 最终状态
}

export const SSRMotionDiv: React.FC<SSRMotionDivProps> = ({
  children,
  fallbackStyle,
  forceAnimation = false,
  finalState,
  ...motionProps
}) => {
  const { isMotionEnabled } = useMotion()
  const shouldAnimate = forceAnimation || isMotionEnabled

  // 获取动画配置
  const animationConfig = useSSRSafeAnimation(shouldAnimate, finalState)

  if (!shouldAnimate) {
    // 渲染静态版本
    return (
      <div style={{ ...fallbackStyle, ...animationConfig.animate }}>
        {children}
      </div>
    )
  }

  // 渲染动画版本
  return (
    <motion.div {...motionProps} {...animationConfig}>
      {children}
    </motion.div>
  )
}
```

#### 性能优化策略
1. **懒加载**: 动画组件按需加载
2. **条件渲染**: 根据设备性能启用动画
3. **缓存机制**: 复用动画配置对象
4. **批量更新**: 减少重渲染次数

### 3. 主题系统架构

#### 设计挑战
1. CSS 变量在服务端不可用
2. 主题切换闪烁问题
3. 系统主题检测延迟
4. localStorage 在服务端不可访问

#### 架构设计

##### 主题变量管理
```typescript
interface ThemeVariables {
  colors: Record<string, string>
  spacing: Record<string, string>
  typography: Record<string, string>
  shadows: Record<string, string>
  transitions: Record<string, string>
  breakpoints: Record<string, string>
}

// 默认主题（服务端安全）
export const defaultThemeVariables: Partial<ThemeVariables> = {
  colors: {
    '--bg-primary': '#ffffff',
    '--text-primary': '#111827',
    // ... 完整的主题变量
  }
}

// 深色主题
export const darkThemeVariables: Partial<ThemeVariables> = {
  colors: {
    '--bg-primary': '#111827',
    '--text-primary': '#f9fafb',
    // ... 深色主题变量
  }
}
```

##### SSR 预加载机制
```typescript
export const generateInlineThemeStyles = (theme: 'light' | 'dark'): string => {
  const themeVariables = theme === 'dark'
    ? mergeThemeVariables(defaultThemeVariables, darkThemeVariables)
    : defaultThemeVariables

  return generateThemeCSS(themeVariables)
}

// 在 HTML 中预加载
export const preloadThemeCSS = (theme: 'light' | 'dark'): string => {
  const css = generateInlineThemeStyles(theme)
  return `<style data-theme="${theme}">${css}</style>`
}
```

##### ThemeProvider 设计
```typescript
class ThemeProvider extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      theme: this.getInitialTheme(),
      isReady: false
    }
  }

  getInitialTheme(): 'light' | 'dark' {
    if (isServer) {
      return this.props.defaultTheme || 'light'
    }

    // 客户端从 localStorage 或系统偏好获取
    return this.getClientTheme()
  }

  componentDidMount() {
    this.setState({ isReady: true })
    this.applyTheme()
  }

  applyTheme() {
    const { theme } = this.state
    const themeVariables = this.getThemeVariables(theme)
    applyThemeSSR(themeVariables)
  }

  render() {
    const contextValue = {
      theme: this.state.theme,
      setTheme: this.setTheme,
      isReady: this.state.isReady
    }

    return (
      <ThemeContext.Provider value={contextValue}>
        {this.props.preloadSSRStyles && this.renderSSRStyles()}
        {this.props.children}
      </ThemeContext.Provider>
    )
  }
}
```

## 🚀 构建系统设计

### Vite 配置优化

#### SSR 专用配置
```typescript
// vite.config.ssr.ts
export default defineConfig({
  build: {
    lib: {
      entry: entryPoints,
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        return format === 'es' ? `${entryName}.mjs` : `${entryName}.cjs.js`
      }
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'framer-motion',
        // 外部化所有运行时依赖
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'framer-motion': 'Motion'
        }
      }
    },
    target: 'node',
    minify: false // 便于调试
  },
  ssr: {
    format: 'esm',
    target: 'node',
    noExternal: [] // 全部外部化
  }
})
```

#### 构建入口管理
```typescript
// 动态生成入口点
const generateEntryPoints = async () => {
  const entryPoints = {
    // 主要入口
    index: resolve(rootDir, 'index.ts'),

    // SSR 专用入口
    ssr: resolve(rootDir, 'ssr.ts'),
    'ssr-theme': resolve(rootDir, 'ssr-theme.ts'),
    'ssr-motion': resolve(rootDir, 'ssr-motion.ts'),

    // 组件入口
    Alert: resolve(rootDir, 'feedback/Alert.tsx'),
    Loading: resolve(rootDir, 'feedback/Loading.tsx'),
    // ... 其他组件
  }

  return entryPoints
}
```

### 类型生成优化

```typescript
// dts 插件配置
dts({
  include: ['src'],
  exclude: ['**/*.test.*', '**/*.stories.*'],
  rollupTypes: false,
  insertTypesEntry: true,
  outDir: 'dist-ssr',
  compilerOptions: {
    skipLibCheck: true,
    noEmitOnError: false
  }
})
```

## 📊 性能优化策略

### 1. 包大小优化

#### 代码分割策略
```typescript
// 懒加载动画组件
export const LazyAnimatedChart = createLazyMotionComponent(
  () => import('./AnimatedChart'),
  <div>加载中...</div>
)

// 条件导入
const HeavyComponent = React.lazy(() =>
  import('./HeavyComponent').then(module => ({
    default: module.HeavyComponent
  }))
)
```

#### Tree Shaking 优化
```typescript
// 精确导出，避免无用代码
export {
  // 只导出必要的工具
  isBrowser,
  isServer,
  useSSRSafeEffect
} from './utils/ssr'

// 避免导出整个模块
// export * from './utils' // ❌ 避免
```

### 2. 运行时性能优化

#### 渲染优化
```typescript
// 使用 React.memo 优化组件
export const OptimizedAlert = React.memo(Alert, (prevProps, nextProps) => {
  return prevProps.message === nextProps.message &&
         prevProps.variant === nextProps.variant &&
         prevProps.visible === nextProps.visible
})

// 使用 useMemo 优化计算
const MemoizedAnimationConfig = React.useMemo(() => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3 }
}), [])
```

#### 内存优化
```typescript
// 对象池复用
const animationPool = new Map()

function getAnimationConfig(key) {
  if (!animationPool.has(key)) {
    animationPool.set(key, createAnimationConfig(key))
  }
  return animationPool.get(key)
}

// 清理机制
React.useEffect(() => {
  return () => {
    // 组件卸载时清理资源
    animationPool.clear()
  }
}, [])
```

### 3. 网络性能优化

#### 资源预加载
```typescript
// 预加载关键资源
export const preloadCriticalResources = () => {
  if (isBrowser) {
    // 预加载字体
    const fontLink = document.createElement('link')
    fontLink.rel = 'preload'
    fontLink.href = '/fonts/inter.woff2'
    fontLink.as = 'font'
    fontLink.type = 'font/woff2'
    document.head.appendChild(fontLink)
  }
}

// 预连接到外部资源
export const preconnectToExternal = () => {
  const domains = ['https://api.example.com']

  domains.forEach(domain => {
    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = domain
    document.head.appendChild(link)
  })
}
```

## 🧪 测试架构设计

### 1. 测试分层策略

```
测试金字塔
    /\
   /E2E\          端到端测试（少量）
  /______\
 /Integration\    集成测试（适量）
/______________\
/    Unit      \   单元测试（大量）
```

### 2. SSR 专用测试

#### 环境模拟测试
```typescript
// Mock 服务端环境
const mockSSREnvironment = () => {
  const originalWindow = global.window
  delete (global as any).window

  return () => {
    global.window = originalWindow
  }
}

describe('SSR 兼容性测试', () => {
  const restoreWindow = mockSSREnvironment()

  afterAll(restoreWindow)

  it('应该在服务端环境正常渲染', () => {
    const { container } = render(<Component />)
    expect(container.firstChild).not.toBeNull()
  })
})
```

#### 水合测试
```typescript
describe('水合测试', () => {
  it('应该避免水合不匹配', () => {
    const { container } = render(
      <SSRMotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        Content
      </SSRMotionDiv>
    )

    // 验证服务端渲染结果
    expect(container.textContent).toBe('Content')

    // 模拟客户端水合
    act(() => {
      // 触发水合
    })

    // 验证无错误
    expect(console.error).not.toHaveBeenCalled()
  })
})
```

### 3. 性能测试

#### 渲染性能测试
```typescript
describe('性能测试', () => {
  it('应该在大数量下保持性能', () => {
    const startTime = performance.now()

    const { container } = render(
      <div>
        {Array.from({ length: 1000 }).map((_, i) => (
          <SSRMotionDiv key={i}>
            Item {i}
          </SSRMotionDiv>
        ))}
      </div>
    )

    const endTime = performance.now()
    const renderTime = endTime - startTime

    expect(renderTime).toBeLessThan(100) // 100ms 内完成
    expect(container.children.length).toBe(1000)
  })
})
```

## 🔮 扩展性设计

### 1. 插件系统

```typescript
interface SSRPlugin {
  name: string
  install: (app: SSRApp) => void
  uninstall?: (app: SSRApp) => void
}

class SSRApp {
  private plugins: Map<string, SSRPlugin> = new Map()

  use(plugin: SSRPlugin) {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin ${plugin.name} already installed`)
    }

    plugin.install(this)
    this.plugins.set(plugin.name, plugin)
  }

  unuse(pluginName: string) {
    const plugin = this.plugins.get(pluginName)
    if (plugin && plugin.uninstall) {
      plugin.uninstall(this)
      this.plugins.delete(pluginName)
    }
  }
}

// 使用示例
const animationPlugin: SSRPlugin = {
  name: 'animation',
  install(app) {
    app.provide('motionConfig', defaultMotionConfig)
  }
}

const app = new SSRApp()
app.use(animationPlugin)
```

### 2. 主题扩展系统

```typescript
interface ThemeExtension {
  name: string
  variables: Partial<ThemeVariables>
  components?: Record<string, React.ComponentType>
}

class ThemeRegistry {
  private extensions: Map<string, ThemeExtension> = new Map()

  register(extension: ThemeExtension) {
    this.extensions.set(extension.name, extension)
  }

  mergeExtensions(): Partial<ThemeVariables> {
    const merged: Partial<ThemeVariables> = {}

    for (const extension of this.extensions.values()) {
      Object.entries(extension.variables).forEach(([category, vars]) => {
        if (!merged[category]) {
          merged[category] = {}
        }
        Object.assign(merged[category], vars)
      })
    }

    return merged
  }
}

// 使用示例
const brandTheme: ThemeExtension = {
  name: 'brand',
  variables: {
    colors: {
      '--brand-primary': '#6366f1',
      '--brand-secondary': '#ec4899',
    }
  }
}

const themeRegistry = new ThemeRegistry()
themeRegistry.register(brandTheme)
```

### 3. 动画预设系统

```typescript
interface AnimationPreset {
  name: string
  config: MotionProps
  description?: string
}

class AnimationRegistry {
  private presets: Map<string, AnimationPreset> = new Map()

  register(preset: AnimationPreset) {
    this.presets.set(preset.name, preset)
  }

  get(name: string): AnimationPreset | undefined {
    return this.presets.get(name)
  }

  list(): AnimationPreset[] {
    return Array.from(this.presets.values())
  }
}

// 内置预设
const fadeInPreset: AnimationPreset = {
  name: 'fadeIn',
  config: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 }
  },
  description: '淡入动画'
}

const slideUpPreset: AnimationPreset = {
  name: 'slideUp',
  config: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  },
  description: '从下往上滑入'
}

// 使用预设
const animationRegistry = new AnimationRegistry()
animationRegistry.register(fadeInPreset)
animationRegistry.register(slideUpPreset)

// 在组件中使用
const AnimatedCard = ({ children, preset = 'fadeIn' }) => {
  const animationConfig = animationRegistry.get(preset)?.config || {}

  return (
    <SSRMotionDiv {...animationConfig}>
      {children}
    </SSRMotionDiv>
  )
}
```

## 📈 监控和分析

### 1. 性能监控

```typescript
interface PerformanceMetrics {
  renderTime: number
  hydrationTime: number
  animationFrameRate: number
  bundleSize: number
  memoryUsage: number
}

class SSRPerformanceMonitor {
  private metrics: PerformanceMetrics = {
    renderTime: 0,
    hydrationTime: 0,
    animationFrameRate: 60,
    bundleSize: 0,
    memoryUsage: 0
  }

  measureRender(componentName: string) {
    const startTime = performance.now()

    return {
      end: () => {
        const endTime = performance.now()
        const renderTime = endTime - startTime

        this.metrics.renderTime = Math.max(this.metrics.renderTime, renderTime)

        // 发送到分析服务
        this.sendMetrics('render', { componentName, renderTime })
      }
    }
  }

  measureHydration() {
    if (isBrowser) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      this.metrics.hydrationTime = navigation.loadEventEnd - navigation.loadEventStart

      this.sendMetrics('hydration', {
        time: this.metrics.hydrationTime
      })
    }
  }

  measureAnimationFrameRate() {
    if (isBrowser) {
      let frameCount = 0
      let lastTime = performance.now()

      const countFrames = (currentTime: number) => {
        frameCount++

        if (currentTime - lastTime >= 1000) {
          this.metrics.animationFrameRate = frameCount
          frameCount = 0
          lastTime = currentTime

          this.sendMetrics('animation', {
            frameRate: this.metrics.animationFrameRate
          })
        }

        requestAnimationFrame(countFrames)
      }

      requestAnimationFrame(countFrames)
    }
  }

  private sendMetrics(type: string, data: any) {
    // 发送到分析服务
    if (isBrowser && navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics', JSON.stringify({
        type,
        data,
        timestamp: Date.now(),
        url: window.location.href
      }))
    }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }
}
```

### 2. 错误监控

```typescript
interface SSRError {
  type: 'hydration' | 'render' | 'animation' | 'theme'
  message: string
  stack?: string
  component?: string
  timestamp: number
  userAgent?: string
}

class SSRErrorMonitor {
  private errors: SSRError[] = []

  captureError(error: Error, type: SSRError['type'], component?: string) {
    const ssrError: SSRError = {
      type,
      message: error.message,
      stack: error.stack,
      component,
      timestamp: Date.now(),
      userAgent: isBrowser ? navigator.userAgent : undefined
    }

    this.errors.push(ssrError)

    // 发送错误报告
    this.reportError(ssrError)
  }

  private reportError(error: SSRError) {
    // 发送到错误监控服务
    if (isBrowser) {
      fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(error)
      }).catch(console.error)
    }
  }

  getErrors(): SSRError[] {
    return [...this.errors]
  }

  clearErrors() {
    this.errors = []
  }
}
```

## 🎯 路线图

### 短期目标（1-2 个月）
- [ ] 完成所有组件的 SSR 迁移
- [ ] 优化动画性能
- [ ] 完善测试覆盖率
- [ ] 发布稳定版本

### 中期目标（3-6 个月）
- [ ] 支持更多 SSR 框架
- [ ] 实现插件系统
- [ ] 添加高级主题功能
- [ ] 性能监控系统

### 长期目标（6-12 个月）
- [ ] 微前端支持
- [ ] 服务端组件（RSC）支持
- [ ] 可视化主题编辑器
- [ ] AI 辅助设计系统

## 📚 参考资料

- [React 18 SSR 文档](https://react.dev/reference/react-dom/server)
- [Next.js SSR 指南](https://nextjs.org/docs/advanced-features/server-side-rendering)
- [Framer Motion SSR 支持](https://www.framer.com/motion/guides/server-side-rendering/)
- [Web Performance 最佳实践](https://web.dev/performance/)

---

**架构版本**: 1.0.0
**最后更新**: 2025-10-16
**维护团队**: Xorigo UI Team