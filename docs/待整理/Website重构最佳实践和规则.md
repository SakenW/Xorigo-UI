# 📖 Xorigo UI Website 重构最佳实践和规则

> **版本**: v2.0.0
> **创建时间**: 2025-10-13
> **目标**: 确保重构过程中的代码质量和一致性

---

## 🚫 数据访问规则

### 规则 1: 禁止直接访问 Packages

**❌ 错误示例**:

```typescript
// ❌ 禁止直接 import @xorigo-ui/registry
import { registry } from '@xorigo-ui/registry'

// ❌ 禁止直接访问 packages/ 目录
import registry from '../../packages/registry/registry.json'
```

**✅ 正确示例**:

```typescript
// ✅ RSC 页面: 使用 Data Layer 适配器
import { readonlyRegistry } from '@/data/registry.readonly'

export default async function Page() {
  const components = readonlyRegistry.getComponents()
  return <div>{/* ... */}</div>
}

// ✅ Client 组件: 使用 SDK 客户端
import { registryClient } from '@/lib/sdk/registry-client'

export function ClientComponent() {
  const [components, setComponents] = useState([])

  useEffect(() => {
    registryClient.getComponents().then(setComponents)
  }, [])

  return <div>{/* ... */}</div>
}
```

### 规则 2: ESLint 配置强制检查

```javascript
// .eslintrc.js
module.exports = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@xorigo-ui/registry', '@xorigo-ui/tokens', '../../packages/*'],
            message: '❌ 禁止直接访问上游数据！请使用 src/data/*.readonly.ts 或 src/lib/sdk/* 访问数据'
          }
        ]
      }
    ]
  }
}
```

### 规则 3: 构建前强制校验

```typescript
// scripts/validate-readonly-consistency.ts
import { validateAllConsistency, printValidationReport } from '../src/data/validation'

async function main() {
  console.log('🚀 开始构建前一致性校验...\n')

  const result = await validateAllConsistency()

  printValidationReport(result)

  if (!result.valid) {
    console.error('❌ 校验失败，构建已阻断')
    process.exit(1) // 阻断构建
  }

  console.log('✅ 校验通过，继续构建')
  process.exit(0)
}

main()
```

```json
// package.json
{
  "scripts": {
    "prebuild": "tsx scripts/validate-readonly-consistency.ts"
  }
}
```

---

## 🎯 RSC/Client 分离规则

### 规则 4: RSC 页面禁止浏览器 API

**❌ 错误示例**:

```typescript
// app/docs/page.tsx (RSC)

export default async function DocsPage() {
  // ❌ RSC 中禁止使用浏览器 API
  const theme = window.localStorage.getItem('theme')
  const width = window.innerWidth
  const scroll = document.documentElement.scrollTop

  // ❌ RSC 中禁止使用 React Hooks
  const [state, setState] = useState()
  useEffect(() => {}, [])

  return <div>{/* ... */}</div>
}
```

**✅ 正确示例**:

```typescript
// app/docs/page.tsx (RSC)

import { readonlyRegistry } from '@/data/registry.readonly'
import { cookies, headers } from 'next/headers'

export default async function DocsPage() {
  // ✅ RSC 可以使用服务端 API
  const cookieStore = cookies()
  const headersList = headers()

  // ✅ RSC 可以直接访问 Data Layer
  const components = readonlyRegistry.getComponents()

  // ✅ RSC 可以进行异步数据获取
  const data = await fetch('https://api.example.com/data')

  return <div>{/* ... */}</div>
}
```

### 规则 5: Client 组件动态导入

**❌ 错误示例**:

```typescript
// app/playground/page.tsx

import { PlaygroundClient } from '@/components/playground/playground-client'

export default function PlaygroundPage() {
  // ❌ Client 组件直接导入，会包含在服务端 Bundle
  return <PlaygroundClient />
}
```

**✅ 正确示例**:

```typescript
// app/playground/page.tsx

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { PlaygroundSkeleton } from '@/components/playground/loading'

// ✅ 使用 dynamic() 动态导入，禁用 SSR
const PlaygroundClient = dynamic(
  () => import('@/components/playground/playground-client'),
  {
    loading: () => <PlaygroundSkeleton />,
    ssr: false // 禁用服务端渲染
  }
)

export default function PlaygroundPage() {
  return (
    <Suspense fallback={<PlaygroundSkeleton />}>
      <PlaygroundClient />
    </Suspense>
  )
}
```

### 规则 6: 'use client' 指令放置

**❌ 错误示例**:

```typescript
// components/playground/playground-client.tsx

import { useState } from 'react'

// ❌ 'use client' 指令必须在文件最顶部
const PlaygroundClient = () => {
  'use client' // ❌ 错误位置

  const [state, setState] = useState()
  return <div>{/* ... */}</div>
}
```

**✅ 正确示例**:

```typescript
// components/playground/playground-client.tsx

'use client' // ✅ 文件最顶部

import { useState } from 'react'

const PlaygroundClient = () => {
  const [state, setState] = useState()
  return <div>{/* ... */}</div>
}

export default PlaygroundClient
```

### 规则 7: ESLint 规则检查 RSC 约束

```javascript
// .eslintrc.js
module.exports = {
  rules: {
    // 自定义规则: RSC 页面禁止浏览器 API
    'no-restricted-globals': [
      'error',
      {
        name: 'window',
        message: '❌ RSC 页面禁止使用 window！如需使用请迁移到 Client 组件'
      },
      {
        name: 'document',
        message: '❌ RSC 页面禁止使用 document！如需使用请迁移到 Client 组件'
      },
      {
        name: 'localStorage',
        message: '❌ RSC 页面禁止使用 localStorage！如需使用请迁移到 Client 组件'
      },
      {
        name: 'sessionStorage',
        message: '❌ RSC 页面禁止使用 sessionStorage！如需使用请迁移到 Client 组件'
      }
    ]
  }
}
```

---

## 📦 性能优化规则

### 规则 8: Bundle 体积预算控制

**配置**:

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const config: NextConfig = {
  webpack: (config, { isServer }) => {
    // 路由级分包
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        // 通用依赖
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
          chunks: 'all',
        },
        // Playground 独立分包
        playground: {
          test: /[\\/]components[\\/]playground[\\/]/,
          name: 'playground',
          priority: 20,
          chunks: 'all',
          maxSize: 150 * 1024, // 150KB gzip 上限
        },
        // 站点基础分包
        common: {
          name: 'common',
          minChunks: 2,
          priority: 5,
          chunks: 'all',
          maxSize: 120 * 1024, // 120KB gzip 上限
        },
      },
    }

    return config
  },
}

export default config
```

**构建后检查**:

```typescript
// scripts/check-bundle-size.ts
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { gzip } from 'zlib'
import { promisify } from 'util'

const gzipAsync = promisify(gzip)

const BUDGETS = {
  site: 120 * 1024,        // 120KB gzip
  playground: 150 * 1024,  // 150KB gzip
  page: 50 * 1024,         // 50KB gzip
}

async function checkBundleSize() {
  const buildDir = join(process.cwd(), '.next')
  const staticDir = join(buildDir, 'static')

  // 检查所有 JS 文件
  const files = readdirSync(staticDir, { recursive: true })
    .filter(f => f.endsWith('.js'))

  let hasError = false

  for (const file of files) {
    const filePath = join(staticDir, file)
    const content = readFileSync(filePath)
    const gzipped = await gzipAsync(content)
    const size = gzipped.length

    // 检查是否超过预算
    let budget = BUDGETS.page
    if (file.includes('playground')) {
      budget = BUDGETS.playground
    } else if (file.includes('common') || file.includes('vendors')) {
      budget = BUDGETS.site
    }

    if (size > budget) {
      console.error(`❌ ${file}: ${(size / 1024).toFixed(2)}KB (超过 ${(budget / 1024).toFixed(2)}KB)`)
      hasError = true
    } else {
      console.log(`✅ ${file}: ${(size / 1024).toFixed(2)}KB`)
    }
  }

  if (hasError) {
    console.error('\n❌ Bundle 大小检查失败，构建已阻断')
    process.exit(1)
  }

  console.log('\n✅ Bundle 大小检查通过')
  process.exit(0)
}

checkBundleSize()
```

```json
// package.json
{
  "scripts": {
    "postbuild": "tsx scripts/check-bundle-size.ts"
  }
}
```

### 规则 9: 图片优化规则

**❌ 错误示例**:

```tsx
// ❌ 直接使用 <img> 标签
<img src="/logo.png" alt="Xorigo UI" />

// ❌ 未优化的图片
<Image src="/large-image.jpg" alt="Hero" width={1920} height={1080} />
```

**✅ 正确示例**:

```tsx
// ✅ 使用 Next.js Image 组件
import Image from 'next/image'

<Image
  src="/logo.png"
  alt="Xorigo UI"
  width={200}
  height={50}
  priority // 首屏图片使用 priority
/>

// ✅ 优化的图片配置
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1920}
  height={1080}
  quality={80} // 降低质量以减小文件大小
  placeholder="blur" // 模糊占位符
  blurDataURL="data:image/..." // 提供 base64 占位符
/>
```

**配置**:

```typescript
// next.config.ts
const config: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'], // 优先使用现代格式
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 天缓存
  },
}
```

### 规则 10: 字体优化规则

**❌ 错误示例**:

```tsx
// ❌ 通过 CDN 加载字体
<link href="https://fonts.googleapis.com/css2?family=Inter" rel="stylesheet" />

// ❌ 在 CSS 中加载字体
@import url('https://fonts.googleapis.com/css2?family=Inter');
```

**✅ 正确示例**:

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google'

// ✅ 使用 next/font 加载字体
const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // 使用 font-display: swap
  variable: '--font-inter',
  preload: true, // 预加载字体
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
```

---

## 🧩 状态管理规则

### 规则 11: Zustand Store 设计模式

**❌ 错误示例**:

```typescript
// ❌ 全局状态污染
const useGlobalStore = create((set) => ({
  // 所有状态混在一起
  theme: 'light',
  density: 'modern',
  selectedComponent: null,
  componentProps: {},
  snapshots: [],
  searchQuery: '',
  filters: {},
  // ...
}))
```

**✅ 正确示例**:

```typescript
// stores/playground.ts
// ✅ 按功能拆分 Store
const usePlaygroundStore = create<PlaygroundStore>()(
  persist(
    (set, get) => ({
      // 主题状态
      currentTheme: 'system',
      currentDensity: 'modern',
      currentRtl: false,

      // 组件状态
      selectedComponent: null,
      componentProps: {},

      // 快照管理
      snapshots: [],
      currentSnapshot: null,

      // Actions
      setThemeState: (theme) => set({ currentTheme: theme }),
      selectComponent: (component) => set({ selectedComponent: component }),
      // ...
    }),
    {
      name: 'xorigo-playground-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        snapshots: state.snapshots,
        currentTheme: state.currentTheme,
        currentDensity: state.currentDensity,
        currentRtl: state.currentRtl
      })
    }
  )
)

// stores/search.ts
// ✅ 搜索状态独立 Store
const useSearchStore = create<SearchStore>((set) => ({
  searchQuery: '',
  searchHistory: [],
  recentSearches: [],
  activeFilters: {},

  setSearchQuery: (query) => set({ searchQuery: query }),
  // ...
}))

// stores/filters.ts
// ✅ 筛选状态独立 Store
const useFiltersStore = create<FiltersStore>((set) => ({
  activeCategory: [],
  activeTags: [],
  activeDeps: [],
  activeFeatures: {},

  setCategory: (category) => set({ activeCategory: category }),
  // ...
}))
```

### 规则 12: Zustand Persist 最佳实践

**❌ 错误示例**:

```typescript
// ❌ 持久化所有状态 (包括不需要的)
const useStore = create(
  persist(
    (set) => ({
      theme: 'light',
      selectedComponent: null, // ❌ 不需要持久化
      componentProps: {},      // ❌ 不需要持久化
      snapshots: [],
    }),
    {
      name: 'store',
    }
  )
)
```

**✅ 正确示例**:

```typescript
// ✅ 仅持久化需要的状态
const useStore = create(
  persist(
    (set) => ({
      theme: 'light',
      selectedComponent: null,
      componentProps: {},
      snapshots: [],
    }),
    {
      name: 'xorigo-playground-store',
      storage: createJSONStorage(() => localStorage),
      // ✅ 使用 partialize 选择性持久化
      partialize: (state) => ({
        snapshots: state.snapshots,  // ✅ 持久化快照
        theme: state.theme,           // ✅ 持久化主题
      }),
      // ✅ 版本管理
      version: 1,
      // ✅ 迁移函数
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // 迁移旧版本数据
          return {
            ...persistedState,
            newField: 'defaultValue'
          }
        }
        return persistedState
      }
    }
  )
)
```

---

## 🎨 组件设计规则

### 规则 13: 组件文件结构

**❌ 错误示例**:

```
components/
├── PlaygroundClient.tsx          # ❌ 所有逻辑在一个文件
└── PlaygroundClient.module.css   # ❌ CSS Modules (不使用 Tailwind)
```

**✅ 正确示例**:

```
components/playground/
├── playground-client.tsx         # ✅ 主容器组件
├── live-props-editor.tsx         # ✅ 独立功能组件
├── snapshot-manager.tsx          # ✅ 独立功能组件
├── compare-mode.tsx              # ✅ 独立功能组件
├── theme-editor.tsx              # ✅ 独立功能组件
├── token-inspector.tsx           # ✅ 独立功能组件
├── props-editor.tsx              # ✅ 独立功能组件
├── code-viewer.tsx               # ✅ 独立功能组件
├── performance-panel.tsx         # ✅ 独立功能组件
└── loading.tsx                   # ✅ 加载状态组件
```

### 规则 14: 组件 Props 类型定义

**❌ 错误示例**:

```typescript
// ❌ 使用 any 类型
export function ComponentCard({ component }: { component: any }) {
  return <div>{component.name}</div>
}

// ❌ 内联类型定义 (难以复用)
export function ComponentCard({ component }: {
  component: {
    name: string
    category: string
    tags: string[]
  }
}) {
  return <div>{component.name}</div>
}
```

**✅ 正确示例**:

```typescript
// ✅ 定义清晰的 Props 接口
interface ComponentCardProps {
  component: Component
  variant?: 'default' | 'compact' | 'detailed'
  onClick?: (component: Component) => void
  className?: string
}

export function ComponentCard({
  component,
  variant = 'default',
  onClick,
  className
}: ComponentCardProps) {
  return (
    <div
      className={cn('component-card', className)}
      onClick={() => onClick?.(component)}
    >
      <h3>{component.name}</h3>
      <p>{component.description}</p>
    </div>
  )
}

// ✅ 导出类型供其他组件使用
export type { ComponentCardProps }
```

### 规则 15: 错误边界使用

**❌ 错误示例**:

```tsx
// ❌ 没有错误边界保护
export default function Page() {
  return (
    <div>
      <ComponentThatMightFail />
      <AnotherComponentThatMightFail />
    </div>
  )
}
```

**✅ 正确示例**:

```tsx
// ✅ 使用错误边界保护关键组件
import { ComponentErrorBoundary } from '@/components/errors/component-error-boundary'

export default function Page() {
  return (
    <div>
      <ComponentErrorBoundary>
        <ComponentThatMightFail />
      </ComponentErrorBoundary>

      <ComponentErrorBoundary>
        <AnotherComponentThatMightFail />
      </ComponentErrorBoundary>
    </div>
  )
}

// ✅ 错误边界组件实现
// components/errors/component-error-boundary.tsx
'use client'

import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ComponentErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Component Error:', error, errorInfo)
    // 发送错误到监控系统
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="border border-error-200 bg-error-50 p-6 rounded-lg">
          <h3 className="text-error-800 font-semibold mb-2">
            组件加载失败
          </h3>
          <p className="text-error-600 mb-4">
            这个组件暂时无法显示，请稍后再试。
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="bg-error-500 text-white px-4 py-2 rounded hover:bg-error-600"
          >
            重试
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
```

---

## 🔍 搜索和筛选规则

### 规则 16: 搜索防抖处理

**❌ 错误示例**:

```typescript
// ❌ 每次输入都触发搜索
export function SearchInput() {
  const [query, setQuery] = useState('')

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    // ❌ 每次输入都立即搜索
    const results = await searchComponents(value)
    setResults(results)
  }

  return <input value={query} onChange={handleChange} />
}
```

**✅ 正确示例**:

```typescript
// ✅ 使用防抖处理搜索
import { useState, useCallback } from 'react'
import { debounce } from 'lodash-es'

export function SearchInput() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  // ✅ 防抖搜索函数 (300ms)
  const debouncedSearch = useCallback(
    debounce(async (value: string) => {
      if (!value.trim()) {
        setResults([])
        return
      }

      const results = await searchComponents(value)
      setResults(results)
    }, 300),
    []
  )

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    debouncedSearch(value) // ✅ 防抖调用
  }

  return <input value={query} onChange={handleChange} />
}
```

### 规则 17: 筛选结果缓存

**❌ 错误示例**:

```typescript
// ❌ 每次渲染都重新计算筛选结果
export function ComponentMatrix() {
  const components = useComponents()
  const filters = useFilters()

  // ❌ 每次渲染都执行筛选
  const filtered = components.filter(comp => {
    return matchesCategory(comp, filters.category) &&
           matchesTags(comp, filters.tags) &&
           matchesDeps(comp, filters.deps)
  })

  return <div>{/* 渲染筛选结果 */}</div>
}
```

**✅ 正确示例**:

```typescript
// ✅ 使用 useMemo 缓存筛选结果
import { useMemo } from 'react'

export function ComponentMatrix() {
  const components = useComponents()
  const filters = useFilters()

  // ✅ 仅在依赖变化时重新计算
  const filtered = useMemo(() => {
    return components.filter(comp => {
      return matchesCategory(comp, filters.category) &&
             matchesTags(comp, filters.tags) &&
             matchesDeps(comp, filters.deps)
    })
  }, [components, filters])

  // ✅ 进一步优化: 虚拟滚动
  return (
    <VirtualList
      items={filtered}
      height={600}
      itemHeight={120}
      renderItem={(item) => <ComponentCard component={item} />}
    />
  )
}
```

---

## 🧪 测试规则

### 规则 18: 单元测试覆盖

**必须测试的内容**:

```typescript
// 1. 数据适配层测试
describe('registry.readonly', () => {
  test('getComponents should return all components', () => {
    const components = readonlyRegistry.getComponents()
    expect(components).toBeInstanceOf(Array)
    expect(components.length).toBeGreaterThan(0)
  })

  test('validateConsistency should check preview modules', () => {
    const result = readonlyRegistry.validateConsistency()
    expect(result.valid).toBe(true)
  })
})

// 2. SDK 客户端测试
describe('registry-client', () => {
  test('should cache components', async () => {
    const client = new WebsiteRegistryClient()

    const first = await client.getComponents()
    const second = await client.getComponents()

    // 第二次调用应该从缓存返回
    expect(first).toBe(second)
  })
})

// 3. Zustand Store 测试
describe('playground store', () => {
  test('setThemeState should update theme', () => {
    const { setThemeState, currentTheme } = usePlaygroundStore.getState()

    setThemeState('dark')

    expect(usePlaygroundStore.getState().currentTheme).toBe('dark')
  })
})

// 4. 组件测试
describe('ComponentCard', () => {
  test('renders component name', () => {
    const component = {
      name: 'Button',
      category: 'core',
      description: 'A button component'
    }

    render(<ComponentCard component={component} />)

    expect(screen.getByText('Button')).toBeInTheDocument()
  })

  test('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    const component = { name: 'Button', category: 'core' }

    render(<ComponentCard component={component} onClick={handleClick} />)

    fireEvent.click(screen.getByText('Button'))

    expect(handleClick).toHaveBeenCalledWith(component)
  })
})
```

### 规则 19: E2E 测试覆盖

**必须测试的流程**:

```typescript
// tests/e2e/playground.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Playground', () => {
  test('should load component preview', async ({ page }) => {
    await page.goto('/playground/button')

    // 等待组件加载
    await expect(page.getByText('Button Playground')).toBeVisible()

    // 验证预览区域存在
    await expect(page.getByTestId('component-preview')).toBeVisible()
  })

  test('should edit props and update preview', async ({ page }) => {
    await page.goto('/playground/button')

    // 编辑 variant prop
    await page.getByLabel('variant').selectOption('secondary')

    // 验证预览更新
    await expect(page.getByTestId('preview-button')).toHaveClass(/secondary/)
  })

  test('should save and load snapshot', async ({ page }) => {
    await page.goto('/playground/button')

    // 编辑状态
    await page.getByLabel('variant').selectOption('secondary')

    // 保存快照
    await page.getByRole('button', { name: '保存快照' }).click()
    await page.getByPlaceholder('输入快照名称').fill('Test Snapshot')
    await page.getByRole('button', { name: '保存' }).click()

    // 验证快照列表
    await expect(page.getByText('Test Snapshot')).toBeVisible()

    // 修改状态
    await page.getByLabel('variant').selectOption('primary')

    // 加载快照
    await page.getByRole('button', { name: '加载' }).click()

    // 验证状态恢复
    await expect(page.getByLabel('variant')).toHaveValue('secondary')
  })
})
```

---

## 📊 性能监控规则

### 规则 20: Web Vitals 监控

**实现**:

```typescript
// app/layout.tsx
import { WebVitalsReporter } from '@/components/web-vitals-reporter'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <WebVitalsReporter />
      </body>
    </html>
  )
}

// components/web-vitals-reporter.tsx
'use client'

import { useReportWebVitals } from 'next/web-vitals'
import { useEffect } from 'react'

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    // 发送到监控系统
    sendToAnalytics({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
    })

    // 检查是否超过目标
    const thresholds = {
      LCP: 2500,   // 2.5s
      FCP: 1800,   // 1.8s
      CLS: 0.05,   // 0.05
      FID: 100,    // 100ms
      TTFB: 800,   // 800ms
    }

    const threshold = thresholds[metric.name]
    if (threshold && metric.value > threshold) {
      console.warn(`⚠️ ${metric.name} 超过目标: ${metric.value} > ${threshold}`)
      // 触发告警
      sendAlert({
        type: 'performance',
        metric: metric.name,
        value: metric.value,
        threshold,
      })
    }
  })

  return null
}

function sendToAnalytics(metric: any) {
  // 发送到 Analytics (Vercel Analytics / Google Analytics)
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.value),
      metric_id: metric.id,
      metric_rating: metric.rating,
      metric_delta: metric.delta,
    })
  }
}

function sendAlert(alert: any) {
  // 发送到告警系统 (Slack / Email)
  fetch('/api/alerts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(alert)
  })
}
```

---

## 🎓 代码审查清单

### Pull Request 检查清单

**数据访问**:
- [ ] 是否使用 `src/data/*.readonly.ts` 访问数据？
- [ ] 是否避免直接 import `@xorigo-ui/registry` 或 `@xorigo-ui/tokens`？
- [ ] 是否通过 SDK 客户端访问 API Routes？

**RSC/Client 分离**:
- [ ] RSC 页面是否避免使用浏览器 API？
- [ ] RSC 页面是否避免使用 React Hooks？
- [ ] Client 组件是否使用 `dynamic()` 动态导入？
- [ ] Client 组件是否正确使用 `'use client'` 指令？

**性能优化**:
- [ ] Bundle 大小是否在预算内？
- [ ] 图片是否使用 Next.js Image 组件？
- [ ] 字体是否使用 next/font 加载？
- [ ] 是否使用 useMemo/useCallback 优化性能？

**状态管理**:
- [ ] Zustand Store 是否按功能拆分？
- [ ] 是否仅持久化需要的状态？
- [ ] 是否实现版本迁移函数？

**组件设计**:
- [ ] 组件文件结构是否清晰？
- [ ] Props 类型定义是否完整？
- [ ] 是否使用错误边界保护？
- [ ] 是否实现加载和错误状态？

**搜索和筛选**:
- [ ] 搜索是否使用防抖处理？
- [ ] 筛选结果是否使用 useMemo 缓存？
- [ ] 是否使用虚拟滚动优化长列表？

**测试覆盖**:
- [ ] 是否编写单元测试？
- [ ] 是否编写 E2E 测试？
- [ ] 测试覆盖率是否达标？

**文档更新**:
- [ ] 是否更新相关文档？
- [ ] 是否更新 CHANGELOG？
- [ ] 是否更新 README？

---

**文档维护**: Xorigo UI Architecture Team
**版本**: v2.0.0
**最后更新**: 2025-10-13
**下次审查**: 2025-11-13
