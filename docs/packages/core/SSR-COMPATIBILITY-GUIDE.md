# Xorigo UI SSR 兼容性指南

## 概述

Xorigo UI 组件库现已完全支持服务端渲染（SSR），包括 Next.js、Remix、Gatsby 等主流 SSR 框架。本指南将帮助您在 SSR 项目中正确使用 Xorigo UI 组件。

## 🎯 核心特性

### ✅ 完全 SSR 兼容
- 服务端安全渲染，无水合错误
- 动画系统智能降级
- CSS 变量服务端预加载
- 主题系统 SSR 支持

### 🔧 智能检测
- 自动检测渲染环境
- 浏览器 API 安全访问
- 动画偏好设置支持
- 错误边界保护

### 🎨 动画优化
- Framer Motion SSR 包装器
- 按需动画启用
- 性能优化的懒加载
- 用户偏好响应

## 📦 安装和设置

### 1. 安装依赖

```bash
npm install @xorigo-ui/core framer-motion
```

### 2. 基础设置

在您的 SSR 项目根组件中包装 `MotionProvider` 和 `ThemeProvider`：

```tsx
// app/layout.tsx (Next.js) 或 root component
import { MotionProvider, ThemeProvider } from '@xorigo-ui/core/ssr'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <ThemeProvider>
          <MotionProvider enableOnHydrate delay={100}>
            {children}
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### 3. 导入 SSR 友好的组件

```tsx
// ✅ 推荐：从 SSR 入口导入
import { Alert, Loading, Button } from '@xorigo-ui/core/ssr'

// ✅ 也可以：分别导入
import { Alert, Loading } from '@xorigo-ui/core'
import { MotionProvider } from '@xorigo-ui/core/ssr-motion'
import { ThemeProvider } from '@xorigo-ui/core/ssr-theme'
```

## 🏗️ 架构设计

### SSR 检测系统

```tsx
import { isBrowser, isServer, getEnvironment } from '@xorigo-ui/core/ssr'

if (isServer) {
  // 服务端逻辑
  console.log('Running on server')
}

if (isBrowser) {
  // 客户端逻辑
  console.log('Running in browser')
}
```

### 动画系统架构

```tsx
// 自动降级：服务端渲染为静态，客户端启用动画
<SSRMotionDiv
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  <Content />
</SSRMotionDiv>
```

### 主题系统架构

```tsx
// 服务端预加载 CSS，客户端动态切换
<ThemeProvider defaultTheme="light" enableSystemTheme>
  <App />
</ThemeProvider>
```

## 🔧 组件使用指南

### Alert 组件

```tsx
import { Alert } from '@xorigo-ui/core/ssr'

function MyComponent() {
  const [visible, setVisible] = useState(true)

  return (
    <Alert
      visible={visible}
      message="操作成功完成"
      variant="success"
      closable
      onClose={() => setVisible(false)}
    />
  )
}
```

### Loading 组件

```tsx
import { Loading } from '@xorigo-ui/core/ssr'

function DataLoader() {
  return (
    <Loading
      text="正在加载..."
      overlay={true}
      size="lg"
    />
  )
}
```

### 动画组件

```tsx
import { SSRMotionDiv, SSRAnimatePresence } from '@xorigo-ui/core/ssr'

function AnimatedModal({ isOpen, onClose }) {
  return (
    <SSRAnimatePresence>
      {isOpen && (
        <SSRMotionDiv
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <ModalContent onClose={onClose} />
        </SSRMotionDiv>
      )}
    </SSRAnimatePresence>
  )
}
```

### 主题切换

```tsx
import { ThemeProvider, useTheme, ThemeToggle } from '@xorigo-ui/core/ssr'

function ThemedComponent() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div data-theme={theme}>
      <p>当前主题: {theme}</p>
      <ThemeToggle />
      <button onClick={toggleTheme}>切换主题</button>
    </div>
  )
}
```

## 🚀 框架集成

### Next.js App Router

```tsx
// app/layout.tsx
import { MotionProvider, ThemeProvider } from '@xorigo-ui/core/ssr'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        <ThemeProvider enableSystemTheme>
          <MotionProvider enableOnHydrate delay={100}>
            {children}
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

```tsx
// app/page.tsx
import { Alert, Button } from '@xorigo-ui/core/ssr'

export default function HomePage() {
  return (
    <main>
      <Alert message="欢迎来到 Xorigo UI" variant="info" />
      <Button>点击我</Button>
    </main>
  )
}
```

### Next.js Pages Router

```tsx
// pages/_app.tsx
import { MotionProvider, ThemeProvider } from '@xorigo-ui/core/ssr'

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <MotionProvider enableOnHydrate delay={100}>
        <Component {...pageProps} />
      </MotionProvider>
    </ThemeProvider>
  )
}

export default MyApp
```

### Remix

```tsx
// app/root.tsx
import { MotionProvider, ThemeProvider } from '@xorigo-ui/core/ssr'

export default function App() {
  return (
    <html lang="zh-CN">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider>
          <MotionProvider enableOnHydrate delay={100}>
            <Outlet />
          </MotionProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
```

### Gatsby

```tsx
// gatsby-browser.js
import { MotionProvider, ThemeProvider } from '@xorigo-ui/core/ssr'

export const wrapRootElement = ({ element }) => (
  <ThemeProvider>
    <MotionProvider enableOnHydrate delay={100}>
      {element}
    </MotionProvider>
  </ThemeProvider>
)
```

```tsx
// gatsby-ssr.js
import { MotionProvider, ThemeProvider } from '@xorigo-ui/core/ssr'

export const wrapRootElement = ({ element }) => (
  <ThemeProvider enableSystemTheme>
    <MotionProvider enableOnHydrate={false}>
      {element}
    </MotionProvider>
  </ThemeProvider>
)
```

## ⚡ 性能优化

### 1. 懒加载动画组件

```tsx
import { LazyMotion, createLazyMotionComponent } from '@xorigo-ui/core/ssr'

// 创建懒加载组件
const LazyAnimatedChart = createLazyMotionComponent(
  () => import('./AnimatedChart'),
  <div>加载中...</div>
)

function Dashboard() {
  return (
    <div>
      <LazyAnimatedChart />
    </div>
  )
}
```

### 2. 条件动画启用

```tsx
function ResponsiveAnimation({ children, enableOnDesktop = true }) {
  const isDesktop = useSSRSafeMediaQuery('(min-width: 768px)')

  return (
    <SSRMotionDiv
      animate={enableOnDesktop && isDesktop ? { scale: 1.05 } : {}}
      transition={{ duration: 0.2 }}
    >
      {children}
    </SSRMotionDiv>
  )
}
```

### 3. 主题预加载

```tsx
import { preloadThemeCSS } from '@xorigo-ui/core/ssr'

// 在 HTML head 中预加载主题 CSS
export const PreloadThemes = () => {
  return (
    <>
      <div dangerouslySetInnerHTML={{
        __html: preloadThemeCSS('light')
      }} />
      <div dangerouslySetInnerHTML={{
        __html: preloadThemeCSS('dark')
      }} />
    </>
  )
}
```

## 🛠️ 高级用法

### 自定义 SSR 检测

```tsx
import { useSSRSafeEffect, useAfterHydration } from '@xorigo-ui/core/ssr'

function CustomSSRComponent() {
  const [isHydrated, setIsHydrated] = useState(false)

  useAfterHydration(() => {
    setIsHydrated(true)
    // 客户端初始化逻辑
  })

  useSSRSafeEffect(() => {
    // 只在客户端执行
    if (isHydrated) {
      // 浏览器特定逻辑
    }
  }, [isHydrated])

  return (
    <div data-hydrated={isHydrated}>
      {isHydrated ? '客户端渲染' : '服务端渲染'}
    </div>
  )
}
```

### 错误边界

```tsx
import { SSRSafeErrorBoundary } from '@xorigo-ui/core/ssr'

function SafeComponent() {
  return (
    <SSRSafeErrorBoundary fallback={<div>组件加载失败</div>}>
      <RiskyComponent />
    </SSRSafeErrorBoundary>
  )
}
```

### 自定义主题变量

```tsx
import { ThemeProvider } from '@xorigo-ui/core/ssr'

const customTheme = {
  colors: {
    '--brand-primary': '#6366f1',
    '--brand-secondary': '#ec4899',
  },
  spacing: {
    '--spacing-compact': '0.5rem',
  }
}

function App() {
  return (
    <ThemeProvider customTheme={customTheme}>
      <YourApp />
    </ThemeProvider>
  )
}
```

## 🔍 调试和测试

### SSR 环境检测

```tsx
import { getEnvironment } from '@xorigo-ui/core/ssr'

function DebugComponent() {
  const env = getEnvironment()

  return (
    <div>
      <p>环境: {env.isServer ? '服务端' : '客户端'}</p>
      <p>浏览器: {env.isBrowser ? '是' : '否'}</p>
      <p>DOM可用: {env.hasDOM ? '是' : '否'}</p>
    </div>
  )
}
```

### 测试工具

```tsx
import { render, screen } from '@testing-library/react'
import { MotionProvider, ThemeProvider } from '@xorigo-ui/core/ssr'

// 测试SSR组件
function testSSRComponent() {
  render(
    <ThemeProvider>
      <MotionProvider enableOnHydrate={false}>
        <YourComponent />
      </MotionProvider>
    </ThemeProvider>
  )

  expect(screen.getByTestId('your-component')).toBeInTheDocument()
}
```

## 📚 API 参考

### MotionProvider Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `enableOnHydrate` | boolean | true | 水合后启用动画 |
| `delay` | number | 0 | 启用动画延迟时间 |
| `force` | boolean | false | 强制启用动画 |

### ThemeProvider Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `defaultTheme` | 'light' \| 'dark' | 'light' | 默认主题 |
| `enableSystemTheme` | boolean | true | 启用系统主题检测 |
| `customTheme` | Partial\<ThemeVariables\> | {} | 自定义主题变量 |
| `storageKey` | string | 'theme' | localStorage 存储键名 |

### SSRMotionDiv Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `forceAnimation` | boolean | false | 强制启用动画 |
| `fallbackStyle` | CSSProperties | {} | 动画禁用时的样式 |
| `finalState` | any | {} | 动画禁用时的最终状态 |

## 🔧 故障排除

### 常见问题

**Q: 组件在服务端渲染后闪烁？**

A: 确保 `MotionProvider` 设置了适当的延迟：
```tsx
<MotionProvider enableOnHydrate delay={100}>
  {children}
</MotionProvider>
```

**Q: CSS 变量在服务端不生效？**

A: 检查 `ThemeProvider` 配置：
```tsx
<ThemeProvider preloadSSRStyles={true}>
  {children}
</ThemeProvider>
```

**Q: 动画在客户端不工作？**

A: 确保正确导入和配置：
```tsx
import { SSRMotionDiv } from '@xorigo-ui/core/ssr'
// 而不是直接从 framer-motion 导入
```

**Q: 主题切换不生效？**

A: 检查 localStorage 和主题设置：
```tsx
const { theme, setTheme } = useTheme()
console.log('当前主题:', theme)
```

### 调试技巧

1. 使用环境检测工具：
```tsx
import { getEnvironment } from '@xorigo-ui/core/ssr'
console.log(getEnvironment())
```

2. 启用详细日志：
```tsx
<MotionProvider enableOnHydrate delay={100}>
  {children}
</MotionProvider>
```

3. 检查水合状态：
```tsx
import { useAfterHydration } from '@xorigo-ui/core/ssr'

const isHydrated = useAfterHydration(() => {
  console.log('组件已水合')
})
```

## 🎯 最佳实践

### 1. 性能优化
- 使用懒加载减少初始包大小
- 合理设置动画延迟避免闪烁
- 启用代码分割和按需加载

### 2. 用户体验
- 尊重用户的动画偏好设置
- 提供加载状态和错误边界
- 确保键盘导航和可访问性

### 3. 开发体验
- 使用 TypeScript 类型安全
- 编写测试覆盖 SSR 场景
- 使用调试工具验证渲染行为

### 4. 部署优化
- 启用 Gzip 压缩
- 配置 CDN 缓存策略
- 监控渲染性能指标

## 📄 许可证

MIT License - 详见 LICENSE 文件

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**Xorigo UI Team** - 构建 SSR 友好的现代组件库