# ErrorBoundary 容错机制使用文档

完整的错误边界实现，为 Website 应用提供全面的容错保护。

## 📋 目录

- [概述](#概述)
- [ErrorBoundary 组件](#errorboundary-组件)
- [使用示例](#使用示例)
- [错误上报配置](#错误上报配置)
- [测试指南](#测试指南)
- [最佳实践](#最佳实践)

## 概述

ErrorBoundary 是 React 的错误捕获机制，用于捕获组件树中的 JavaScript 错误，记录错误并显示降级 UI。

### 架构层次

```
RootErrorBoundary (全局)
├─ PlaygroundErrorBoundary (Playground 页面)
├─ MDXErrorBoundary (文档渲染)
└─ 其他页面级 ErrorBoundary
```

### 核心特性

- ✅ **全局错误捕获**: 捕获应用中所有未处理的错误
- ✅ **美观的错误 UI**: 用户友好的错误展示界面
- ✅ **错误上报**: 集成 Sentry/LogRocket 自动上报
- ✅ **错误恢复**: 提供重试、刷新等恢复选项
- ✅ **开发者友好**: 开发模式下显示详细错误堆栈
- ✅ **状态保留**: Playground 保留用户编辑状态
- ✅ **智能建议**: 分析错误并提供修复建议

---

## ErrorBoundary 组件

### 1. RootErrorBoundary (全局错误边界)

**位置**: `src/components/errors/RootErrorBoundary.tsx`

**用途**: 捕获应用中的所有未处理错误

**特性**:
- 全局错误捕获
- 美观的错误展示 UI (红色主题)
- 错误计数 (记录重复错误)
- 多种恢复选项: 重试、刷新页面、返回首页
- 自动上报到 Sentry

**使用方式**:

```tsx
// app/layout.tsx
import { RootErrorBoundary } from '@/components/errors'

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <RootErrorBoundary>
          {children}
        </RootErrorBoundary>
      </body>
    </html>
  )
}
```

### 2. PlaygroundErrorBoundary (Playground 专用)

**位置**: `src/components/errors/PlaygroundErrorBoundary.tsx`

**用途**: 捕获 Playground 交互编辑器中的错误

**特性**:
- 保留用户编辑状态
- 紫色主题 UI (与 Playground 匹配)
- 智能错误分析和修复建议
- 状态恢复功能
- 清除缓存选项
- localStorage 错误日志

**使用方式**:

```tsx
// app/playground/page.tsx
'use client'

import { PlaygroundErrorBoundary } from '@/components/errors'
import PlaygroundClient from '@/components/playground/playground-client'

export default function PlaygroundPage() {
  return (
    <PlaygroundErrorBoundary>
      <PlaygroundClient />
    </PlaygroundErrorBoundary>
  )
}
```

### 3. MDXErrorBoundary (MDX 文档渲染)

**位置**: `src/components/errors/MDXErrorBoundary.tsx`

**用途**: 捕获 MDX 文档渲染过程中的错误

**特性**:
- 捕获 MDX 语法错误
- 显示文件路径 (便于定位)
- 黄色主题 UI (警告色调)
- MDX 特定错误提示
- 支持自定义降级 UI
- 嵌套 ErrorBoundary 支持

**使用方式**:

```tsx
// 包裹 MDX 内容
import { MDXErrorBoundary } from '@/components/errors'

export default function DocsPage({ content }) {
  return (
    <MDXErrorBoundary filePath="/docs/getting-started.mdx">
      <MDXContent>{content}</MDXContent>
    </MDXErrorBoundary>
  )
}

// 使用自定义降级 UI
<MDXErrorBoundary
  filePath="/docs/api.mdx"
  fallback={
    <div>文档加载失败，请稍后重试</div>
  }
>
  <MDXContent />
</MDXErrorBoundary>
```

### 4. ErrorFallback (通用错误回退组件)

**位置**: `src/components/errors/ErrorFallback.tsx`

**用途**: 可复用的错误展示组件

**Props**:

```typescript
interface ErrorFallbackProps {
  error: Error | null
  title?: string
  description?: string
  showErrorDetails?: boolean
  onReset?: () => void
  actions?: ReactNode
  variant?: 'error' | 'warning' | 'info'
}
```

**使用方式**:

```tsx
import { ErrorFallback } from '@/components/errors'

<ErrorFallback
  error={error}
  title="操作失败"
  description="请检查网络连接后重试"
  variant="warning"
  showErrorDetails={process.env.NODE_ENV === 'development'}
  onReset={() => setError(null)}
  actions={
    <button onClick={handleRetry}>
      自定义操作
    </button>
  }
/>
```

---

## 使用示例

### 示例 1: 在页面中使用

```tsx
// app/page.tsx
'use client'

import { RootErrorBoundary } from '@/components/errors'
import HomePage from '@/components/home-page'

export default function Page() {
  return (
    <RootErrorBoundary>
      <HomePage />
    </RootErrorBoundary>
  )
}
```

### 示例 2: 嵌套 ErrorBoundary

```tsx
// app/complex-page/page.tsx
'use client'

import { RootErrorBoundary } from '@/components/errors'
import { MDXErrorBoundary } from '@/components/errors'
import DocsContent from './docs-content'
import Sidebar from './sidebar'

export default function ComplexPage() {
  return (
    <RootErrorBoundary>
      <div className="flex">
        {/* 侧边栏有独立的错误边界 */}
        <RootErrorBoundary>
          <Sidebar />
        </RootErrorBoundary>

        {/* 文档内容有 MDX 专用边界 */}
        <MDXErrorBoundary filePath="/docs/complex.mdx">
          <DocsContent />
        </MDXErrorBoundary>
      </div>
    </RootErrorBoundary>
  )
}
```

### 示例 3: 手动触发错误恢复

```tsx
'use client'

import { useState } from 'react'
import { PlaygroundErrorBoundary } from '@/components/errors'

function PlaygroundContainer() {
  const [key, setKey] = useState(0)

  return (
    <PlaygroundErrorBoundary key={key}>
      <Playground onError={() => setKey(k => k + 1)} />
    </PlaygroundErrorBoundary>
  )
}
```

---

## 错误上报配置

### 1. Sentry 集成

**安装依赖**:

```bash
npm install @sentry/nextjs
```

**初始化 Sentry** (`app/layout.tsx`):

```tsx
'use client'

import { useEffect } from 'react'
import { initSentry } from '@/lib/error-reporting'

export default function RootLayout({ children }) {
  useEffect(() => {
    // 初始化 Sentry
    initSentry({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN!,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    })
  }, [])

  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
```

**环境变量** (`.env.local`):

```bash
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

### 2. LogRocket 集成

**安装依赖**:

```bash
npm install logrocket
```

**初始化 LogRocket** (`app/layout.tsx`):

```tsx
'use client'

import { useEffect } from 'react'
import { initLogRocket } from '@/lib/error-reporting'

export default function RootLayout({ children }) {
  useEffect(() => {
    // 初始化 LogRocket
    initLogRocket({
      appId: process.env.NEXT_PUBLIC_LOGROCKET_APP_ID!,
      console: true,
      network: true,
      dom: true,
    })
  }, [])

  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
```

**环境变量** (`.env.local`):

```bash
NEXT_PUBLIC_LOGROCKET_APP_ID=your-app-id/your-app-name
```

### 3. 手动上报错误

```tsx
import { captureError, captureMessage, setUser, addBreadcrumb } from '@/lib/error-reporting'

// 手动捕获错误
try {
  riskyOperation()
} catch (error) {
  captureError(error as Error, {
    component: 'PlaygroundEditor',
    action: 'code-compilation',
  })
}

// 上报消息
captureMessage('用户完成了重要操作', 'info')

// 设置用户信息
setUser({
  id: 'user-123',
  email: 'user@example.com',
  username: 'john_doe',
})

// 添加用户行为追踪
addBreadcrumb({
  message: '用户点击了编译按钮',
  category: 'user-action',
  level: 'info',
  data: {
    component: 'Playground',
    codeLength: 500,
  },
})
```

---

## 测试指南

### 单元测试示例

```tsx
// __tests__/components/errors/RootErrorBoundary.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { RootErrorBoundary } from '@/components/errors'

// 创建会抛出错误的组件
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('测试错误')
  }
  return <div>正常内容</div>
}

describe('RootErrorBoundary', () => {
  // 抑制 console.error 输出
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('正常渲染子组件', () => {
    render(
      <RootErrorBoundary>
        <ThrowError shouldThrow={false} />
      </RootErrorBoundary>
    )
    expect(screen.getByText('正常内容')).toBeInTheDocument()
  })

  it('捕获错误并显示降级 UI', () => {
    render(
      <RootErrorBoundary>
        <ThrowError shouldThrow={true} />
      </RootErrorBoundary>
    )
    expect(screen.getByText('应用遇到了一个错误')).toBeInTheDocument()
    expect(screen.getByText(/测试错误/)).toBeInTheDocument()
  })

  it('点击重试按钮恢复', () => {
    const { rerender } = render(
      <RootErrorBoundary>
        <ThrowError shouldThrow={true} />
      </RootErrorBoundary>
    )

    // 点击重试
    const resetButton = screen.getByText('重试')
    fireEvent.click(resetButton)

    // 重新渲染不抛错误的组件
    rerender(
      <RootErrorBoundary>
        <ThrowError shouldThrow={false} />
      </RootErrorBoundary>
    )

    expect(screen.getByText('正常内容')).toBeInTheDocument()
  })
})
```

### 集成测试

```tsx
// __tests__/integration/error-boundaries.test.tsx
import { render, screen } from '@testing-library/react'
import { PlaygroundErrorBoundary } from '@/components/errors'
import PlaygroundClient from '@/components/playground/playground-client'

describe('PlaygroundErrorBoundary 集成测试', () => {
  it('捕获 Playground 渲染错误', () => {
    // 模拟 Playground 组件抛出错误
    jest.spyOn(PlaygroundClient.prototype, 'render').mockImplementation(() => {
      throw new Error('Playground 渲染失败')
    })

    render(
      <PlaygroundErrorBoundary>
        <PlaygroundClient />
      </PlaygroundErrorBoundary>
    )

    expect(screen.getByText('Playground 遇到了错误')).toBeInTheDocument()
    expect(screen.getByText(/Playground 渲染失败/)).toBeInTheDocument()
  })
})
```

---

## 最佳实践

### 1. 错误边界层次结构

```
✅ 推荐: 分层错误边界
RootErrorBoundary (全局)
├─ PageErrorBoundary (页面级)
│   ├─ ComponentErrorBoundary (组件级)
│   └─ MDXErrorBoundary (特殊渲染)
└─ 其他页面

❌ 避免: 单一全局边界
RootErrorBoundary
└─ 所有内容 (错误影响范围过大)
```

### 2. 错误信息展示

```tsx
// ✅ 开发模式显示详细信息
<ErrorFallback
  error={error}
  showErrorDetails={process.env.NODE_ENV === 'development'}
/>

// ❌ 生产模式暴露敏感信息
<ErrorFallback
  error={error}
  showErrorDetails={true} // 永远显示详细错误
/>
```

### 3. 错误恢复策略

```tsx
// ✅ 提供多种恢复选项
<div className="actions">
  <button onClick={handleReset}>重试</button>
  <button onClick={handleRefresh}>刷新页面</button>
  <button onClick={handleGoHome}>返回首页</button>
</div>

// ❌ 仅提供刷新页面 (用户体验差)
<button onClick={() => window.location.reload()}>
  刷新
</button>
```

### 4. 错误上报

```tsx
// ✅ 包含丰富的上下文信息
captureError(error, {
  component: 'PlaygroundEditor',
  action: 'code-compilation',
  user: userId,
  codeLength: code.length,
})

// ❌ 仅上报错误对象
captureError(error)
```

### 5. 用户状态保留

```tsx
// ✅ Playground 保存用户状态
componentDidCatch(error, errorInfo) {
  // 保存当前编辑状态
  localStorage.setItem('playground_state', JSON.stringify(this.state))
  // 上报错误
  this.logError(error, errorInfo)
}

// ❌ 丢失用户编辑内容
componentDidCatch(error, errorInfo) {
  this.setState({ hasError: true })
}
```

### 6. 错误边界粒度

```tsx
// ✅ 细粒度错误边界 (局部影响)
<Layout>
  <ErrorBoundary><Header /></ErrorBoundary>
  <ErrorBoundary><Sidebar /></ErrorBoundary>
  <ErrorBoundary><Content /></ErrorBoundary>
</Layout>

// ❌ 粗粒度错误边界 (整体崩溃)
<ErrorBoundary>
  <Layout>
    <Header />
    <Sidebar />
    <Content />
  </Layout>
</ErrorBoundary>
```

---

## 故障排查

### 常见问题

**Q: ErrorBoundary 不捕获异步错误?**

A: ErrorBoundary 只能捕获组件渲染、生命周期方法和构造函数中的同步错误。异步错误需要使用 try-catch 手动捕获:

```tsx
async function fetchData() {
  try {
    const data = await api.getData()
    return data
  } catch (error) {
    captureError(error as Error, { component: 'DataFetcher' })
    throw error // 重新抛出让 UI 处理
  }
}
```

**Q: 如何捕获事件处理器中的错误?**

A: 事件处理器中的错误不会被 ErrorBoundary 捕获，需要手动处理:

```tsx
function handleClick() {
  try {
    riskyOperation()
  } catch (error) {
    captureError(error as Error)
    setError(error)
  }
}
```

**Q: Sentry 未收到错误上报?**

A: 检查:
1. `NEXT_PUBLIC_SENTRY_DSN` 环境变量是否正确
2. Sentry 初始化是否在客户端运行 (`useEffect`)
3. 是否在生产模式下 (开发模式默认不上报)

---

## 维护说明

- **文档版本**: v1.0.0
- **创建时间**: 2025-10-13
- **维护团队**: Website 架构组
- **更新周期**: 每月或功能更新时

有问题? 查看 [GitHub Issues](https://github.com/xorigo-ui/xorigo-ui/issues) 或联系架构组。
