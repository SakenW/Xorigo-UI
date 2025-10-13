# 048 - Next.js 15 + React 19 集成指南

**日期**: 2025-10-10
**状态**: 📚 指南文档
**优先级**: 高
**类型**: 集成文档

---

## 📋 概述

本文档提供 Xorigo UI 组件库与 Next.js 15 (App Router) + React 19 的完整集成指南，包括 Hydration 安全、Server Components 兼容性、以及最佳实践。

**适用场景**：
- ✅ 新建 Next.js 15 项目
- ✅ 迁移现有 Next.js 项目到 v15
- ✅ 在 demo-site 中集成 Next.js

---

## 🎯 技术栈要求

### 核心依赖

```json
{
  "dependencies": {
    "next": "^15.5.4",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "@xorigo-ui/core": "^0.1.0",
    "tailwindcss": "^4.1.14"
  }
}
```

### 可选依赖（按需安装）

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^5.0.0",
    "react-hook-form": "^7.0.0",
    "zod": "^4.0.0",
    "@tiptap/react": "^2.0.0",
    "recharts": "^3.0.0",
    "next-themes": "^0.4.0"
  }
}
```

---

## 🚀 快速开始

### 1. 创建 Next.js 15 项目

```bash
# 使用 create-next-app 创建项目
npx create-next-app@latest my-app

# 选择以下选项：
# ✅ TypeScript
# ✅ Tailwind CSS
# ✅ App Router
# ✅ src/ directory (推荐)
# ✅ import alias (@/*)

cd my-app
```

### 2. 安装 Xorigo UI 组件库

```bash
npm install @xorigo-ui/core framer-motion
```

### 3. 升级 Tailwind CSS 到 v4

```bash
# 使用官方迁移工具
npx @tailwindcss/upgrade

# 或手动升级
npm install tailwindcss@^4.1.14 @tailwindcss/postcss@^4.1.14
```

### 4. 配置 Tailwind CSS

#### A. `postcss.config.js`
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

#### B. `app/globals.css`
```css
@import 'tailwindcss';

@theme {
  --font-sans: Inter, system-ui, sans-serif;
  --font-mono: JetBrains Mono, monospace;
}
```

### 5. 配置 Next.js

#### `next.config.js`
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // React 19 + Next.js 15 配置
  reactStrictMode: true,

  // 优化 Xorigo UI 组件库
  transpilePackages: ['@xorigo-ui/core'],

  // Turbopack (可选，实验性)
  // 注意：Tailwind v4 与 Turbopack 兼容性好
  experimental: {
    turbo: {
      // Turbopack 配置
    },
  },
}

module.exports = nextConfig
```

---

## 🎨 组件使用

### Server Components (默认)

大多数 Xorigo UI 组件是 **Client Components**，需要在 Server Components 中导入时注意。

#### ✅ 正确方式 1: 使用 'use client' 包装

```tsx
// app/components/MyClientComponent.tsx
'use client'

import { Button, Card } from '@xorigo-ui/core'

export function MyClientComponent() {
  return (
    <Card>
      <Button onClick={() => console.log('Clicked!')}>
        Click me
      </Button>
    </Card>
  )
}
```

```tsx
// app/page.tsx (Server Component)
import { MyClientComponent } from './components/MyClientComponent'

export default function Page() {
  return (
    <div>
      <h1>Server Component</h1>
      <MyClientComponent />
    </div>
  )
}
```

#### ✅ 正确方式 2: 使用 dynamic import (推荐复杂组件)

```tsx
// app/page.tsx (Server Component)
import dynamic from 'next/dynamic'

const DataTable = dynamic(
  () => import('@xorigo-ui/core').then((mod) => mod.DataTable),
  { ssr: false }
)

export default function Page() {
  return (
    <div>
      <h1>Server Component</h1>
      <DataTable data={[]} columns={[]} />
    </div>
  )
}
```

### ThemeProvider 集成

#### ✅ 方式 1: Xorigo UI ThemeProvider (独立主题系统)

```tsx
// app/providers.tsx
'use client'

import { ThemeProvider } from '@xorigo-ui/core'
import { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light">
      {children}
    </ThemeProvider>
  )
}
```

```tsx
// app/layout.tsx (Root Layout)
import { Providers } from './providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

#### ✅ 方式 2: next-themes (Next.js 推荐)

```bash
npm install next-themes
```

```tsx
// app/providers.tsx
'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
```

---

## ⚠️ Hydration 安全指南

### 常见 Hydration Mismatch 问题

#### 问题 1: 客户端专属值 (Date, Random)

❌ **错误方式**：
```tsx
'use client'

export function BadExample() {
  const timestamp = Date.now() // ❌ Hydration mismatch
  const random = Math.random()  // ❌ Hydration mismatch

  return <div>Timestamp: {timestamp}</div>
}
```

✅ **正确方式**：
```tsx
'use client'

import { useState, useEffect } from 'react'

export function GoodExample() {
  const [timestamp, setTimestamp] = useState<number | null>(null)

  useEffect(() => {
    setTimestamp(Date.now()) // ✅ 只在客户端运行
  }, [])

  if (timestamp === null) {
    return <div>Loading...</div> // ✅ SSR 渲染
  }

  return <div>Timestamp: {timestamp}</div>
}
```

#### 问题 2: window/localStorage 访问

❌ **错误方式**：
```tsx
'use client'

export function BadExample() {
  const theme = localStorage.getItem('theme') // ❌ SSR 会报错

  return <div>Theme: {theme}</div>
}
```

✅ **正确方式**：
```tsx
'use client'

import { useState, useEffect } from 'react'

export function GoodExample() {
  const [theme, setTheme] = useState<string | null>(null)

  useEffect(() => {
    setTheme(localStorage.getItem('theme')) // ✅ 只在客户端运行
  }, [])

  return <div>Theme: {theme || 'default'}</div>
}
```

#### 问题 3: 第三方库 (TipTap, Recharts)

❌ **错误方式**：
```tsx
// app/page.tsx
import { Editor } from '@tiptap/react' // ❌ SSR 不兼容

export default function Page() {
  return <Editor /> // ❌ Hydration mismatch
}
```

✅ **正确方式**：
```tsx
// app/page.tsx
import dynamic from 'next/dynamic'

const Editor = dynamic(
  () => import('@tiptap/react').then((mod) => mod.Editor),
  {
    ssr: false, // ✅ 禁用 SSR
    loading: () => <div>Loading editor...</div>
  }
)

export default function Page() {
  return <Editor />
}
```

### Xorigo UI 组件 Hydration 安全性

| 组件 | SSR 安全 | 建议 |
|------|---------|------|
| Button | ✅ | 直接使用 |
| Card | ✅ | 直接使用 |
| Input | ✅ | 直接使用 |
| Modal | ⚠️ | 需要 'use client' |
| DataTable | ⚠️ | 推荐 dynamic import |
| AnimatedCard | ❌ | 必须 ssr: false |
| ThemeProvider | ❌ | 必须 'use client' |

---

## 🏗️ 项目结构推荐

### App Router 结构

```
app/
├── layout.tsx              # Root Layout (Server Component)
├── page.tsx                # Home Page (Server Component)
├── providers.tsx           # Client Providers ('use client')
├── globals.css             # Tailwind CSS v4
│
├── (marketing)/            # 路由组
│   ├── layout.tsx
│   ├── page.tsx
│   └── about/
│       └── page.tsx
│
├── dashboard/
│   ├── layout.tsx
│   ├── page.tsx
│   └── settings/
│       └── page.tsx
│
└── components/             # 共享组件
    ├── ui/                 # Xorigo UI 包装组件
    │   ├── button.tsx      # 二次封装 Xorigo UI Button
    │   └── card.tsx        # 二次封装 Xorigo UI Card
    │
    └── shared/             # 业务组件
        ├── header.tsx
        └── footer.tsx
```

### 组件组织策略

#### 1. 直接使用 Xorigo UI 组件

```tsx
// app/page.tsx
'use client'

import { Button } from '@xorigo-ui/core'

export default function Page() {
  return <Button>Click me</Button>
}
```

#### 2. 二次封装 Xorigo UI 组件 (推荐)

```tsx
// app/components/ui/button.tsx
'use client'

import { Button as THButton, ButtonProps } from '@xorigo-ui/core'
import { forwardRef } from 'react'

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    return <THButton ref={ref} {...props} />
  }
)

Button.displayName = 'Button'
```

```tsx
// app/page.tsx
'use client'

import { Button } from './components/ui/button'

export default function Page() {
  return <Button>Click me</Button>
}
```

**优势**：
- ✅ 统一项目样式
- ✅ 更容易升级 Xorigo UI
- ✅ 避免"手改组件后难以合并"

---

## 🎯 状态管理集成

### TanStack Query (Server State)

```bash
npm install @tanstack/react-query
```

#### Provider 配置

```tsx
// app/providers.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

#### 使用示例

```tsx
// app/dashboard/page.tsx
'use client'

import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@xorigo-ui/core'

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch('/api/users')
      return res.json()
    },
  })

  if (isLoading) return <div>Loading...</div>

  return <DataTable data={data} columns={[]} />
}
```

### Zustand (Client State)

```bash
npm install zustand
```

#### Store 创建

```tsx
// lib/store.ts
import { create } from 'zustand'

interface SidebarStore {
  isOpen: boolean
  toggle: () => void
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  isOpen: true,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}))
```

#### 使用示例

```tsx
// app/components/sidebar.tsx
'use client'

import { useSidebarStore } from '@/lib/store'
import { Button } from '@xorigo-ui/core'

export function Sidebar() {
  const { isOpen, toggle } = useSidebarStore()

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <Button onClick={toggle}>Toggle</Button>
    </div>
  )
}
```

---

## 📝 表单与校验

### React Hook Form + Zod

```bash
npm install react-hook-form zod @hookform/resolvers
```

#### 表单组件

```tsx
// app/components/forms/user-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input, Button } from '@xorigo-ui/core'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
})

type FormData = z.infer<typeof schema>

export function UserForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: FormData) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register('email')}
        placeholder="Email"
        error={errors.email?.message}
      />
      <Input
        {...register('password')}
        type="password"
        placeholder="Password"
        error={errors.password?.message}
      />
      <Button type="submit">Submit</Button>
    </form>
  )
}
```

---

## 🎨 富文本编辑器 (TipTap)

### 安装与配置

```bash
npm install @tiptap/react @tiptap/starter-kit
```

### 组件封装 (Hydration 安全)

```tsx
// app/components/editor/tiptap-editor.tsx
'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'

interface EditorProps {
  content?: string
  onChange?: (html: string) => void
}

export function TipTapEditor({ content, onChange }: EditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  return <EditorContent editor={editor} />
}
```

### 在页面中使用 (Dynamic Import)

```tsx
// app/blog/edit/page.tsx
import dynamic from 'next/dynamic'

const TipTapEditor = dynamic(
  () => import('@/components/editor/tiptap-editor').then(mod => mod.TipTapEditor),
  {
    ssr: false,
    loading: () => <div>Loading editor...</div>
  }
)

export default function EditPage() {
  return (
    <div>
      <h1>Edit Post</h1>
      <TipTapEditor />
    </div>
  )
}
```

---

## 📊 数据可视化 (Recharts)

### 安装与配置

```bash
npm install recharts
```

### 组件封装 (Hydration 安全)

```tsx
// app/components/charts/bar-chart.tsx
'use client'

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

interface BarChartProps {
  data: Array<{ name: string; value: number }>
}

export function BarChart({ data }: BarChartProps) {
  return (
    <RechartsBarChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="value" fill="var(--color-primary-500)" />
    </RechartsBarChart>
  )
}
```

### 在页面中使用 (Dynamic Import)

```tsx
// app/dashboard/analytics/page.tsx
import dynamic from 'next/dynamic'

const BarChart = dynamic(
  () => import('@/components/charts/bar-chart').then(mod => mod.BarChart),
  {
    ssr: false,
    loading: () => <div>Loading chart...</div>
  }
)

export default function AnalyticsPage() {
  const data = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
  ]

  return (
    <div>
      <h1>Analytics</h1>
      <BarChart data={data} />
    </div>
  )
}
```

---

## ⚡ 性能优化

### 1. Code Splitting (自动)

Next.js 15 自动进行代码分割，无需手动配置。

### 2. Dynamic Import (手动优化)

```tsx
// 懒加载复杂组件
const DataTable = dynamic(() => import('@xorigo-ui/core').then(m => m.DataTable))
const AnimatedCard = dynamic(() => import('@xorigo-ui/core').then(m => m.AnimatedCard), { ssr: false })
```

### 3. Server Components 优先

```tsx
// app/page.tsx (Server Component)
import { fetchData } from '@/lib/api'

export default async function Page() {
  const data = await fetchData() // ✅ 服务端获取数据

  return (
    <div>
      <h1>{data.title}</h1>
      <ClientComponent data={data} />
    </div>
  )
}
```

### 4. Tailwind CSS v4 优化

```css
/* globals.css */
@import 'tailwindcss';

/* 使用 CSS 变量减少重复 */
@theme {
  --color-brand: #3b82f6;
  --spacing-section: 4rem;
}
```

---

## 🔍 调试技巧

### 1. Hydration Mismatch 调试

```tsx
// 启用 React Strict Mode
// next.config.js
const nextConfig = {
  reactStrictMode: true,
}
```

### 2. Server/Client 边界检查

```tsx
// 使用 console.log 检查执行环境
'use client'

export function MyComponent() {
  console.log('Client:', typeof window !== 'undefined')
  // ...
}
```

### 3. Next.js DevTools

```bash
# 启用 Next.js 调试模式
NODE_OPTIONS='--inspect' npm run dev
```

---

## 📚 完整示例项目

### 项目结构

```
examples/nextjs-app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── providers.tsx
│   ├── globals.css
│   │
│   ├── components/
│   │   ├── ui/              # Xorigo UI 包装组件
│   │   ├── forms/           # 表单组件
│   │   ├── charts/          # 图表组件
│   │   └── editor/          # 编辑器组件
│   │
│   └── dashboard/
│       ├── layout.tsx
│       ├── page.tsx
│       ├── analytics/
│       └── settings/
│
├── lib/
│   ├── store.ts             # Zustand stores
│   └── api.ts               # API 工具
│
├── public/
├── next.config.js
├── postcss.config.js
└── package.json
```

### 快速启动

```bash
# 克隆示例项目
git clone https://github.com/your-org/xorigo-ui-nextjs-example.git
cd xorigo-ui-nextjs-example

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

---

## ✅ 检查清单

### 项目初始化

- [ ] 使用 create-next-app@latest 创建项目
- [ ] 选择 TypeScript + Tailwind + App Router
- [ ] 升级 Tailwind CSS 到 v4.1.14
- [ ] 配置 PostCSS 使用 @tailwindcss/postcss

### Xorigo UI 集成

- [ ] 安装 @xorigo-ui/core 和 framer-motion
- [ ] 配置 transpilePackages
- [ ] 创建 Providers 组件
- [ ] 在 Root Layout 中使用 Providers

### Hydration 安全

- [ ] 所有 Xorigo UI 组件标记 'use client'
- [ ] 复杂组件使用 dynamic import
- [ ] 避免在组件顶层使用 Date.now()/Math.random()
- [ ] localStorage/window 访问在 useEffect 中

### 可选依赖

- [ ] 按需安装 TanStack Query / Zustand
- [ ] 按需安装 React Hook Form + Zod
- [ ] TipTap/Recharts 使用 dynamic import

### 测试

- [ ] npm run build 成功
- [ ] npm run dev 正常运行
- [ ] 无 Hydration mismatch 警告
- [ ] 所有组件正常渲染

---

## 📖 参考资源

### 官方文档
- [Next.js 15 Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Xorigo UI Docs](https://xorigo-ui.dev/)

### 集成指南
- [TanStack Query with Next.js](https://tanstack.com/query/latest/docs/framework/react/guides/ssr)
- [Zustand with Next.js](https://docs.pmnd.rs/zustand/integrations/persisting-store-data)
- [next-themes Setup](https://github.com/pacocoursey/next-themes)

---

**生成时间**: 2025-10-10
**下次审查**: 2025-10-17
**文档版本**: 1.0.0

**维护者**: Xorigo UI Team
