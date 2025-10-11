# 🚀 TH-UI Next.js Gallery & Adoption Matrix 架构方案

> **核心理念**：组件库（React 19 + Vite）+ 展示网站（Next.js 15 App Router）分离架构，严格依赖组件库，完整展示组件效果。

---

## 🎯 核心架构约束

### ⚠️ 严格依赖原则
- **网站必须仅使用组件库的组件** - 禁止额外增加任何UI组件
- **缺乏组件时** - 先在组件库中设计创建，再添加到网站
- **组件完整性** - 网站必须展示组件库的所有组件及其所有效果

### 🎨 样式系统分离
- **网站样式切换** - 使用配方系统切换显示样式效果
- **组件展示** - 展示所有组件的所有维度效果，独立于配方切换
- **展示维度** - 包括变体(variant)、尺寸(size)、状态(state)等所有方面

### 📋 依赖管理策略
```typescript
// @th-ui/website/package.json - 严格依赖组件库
{
  "dependencies": {
    "@th-ui/core": "workspace:*",  // 必须使用工作区版本
    "framer-motion": "^12.23.5",    // 仅组件库已有依赖
    // 禁止添加额外的UI组件库
  },
  "devDependencies": {
    "@types/react": "^19.1.10",
    "@types/react-dom": "^19.1.7",
    "typescript": "~5.9.3",
    "next": "15.5.4"
  }
}
```

---

## 📐 整体架构

### 项目分离策略

```
TH-UI 仓库结构
├── packages/
│   ├── @th-ui/core/              # 组件库（React 19 + Vite）
│   │   ├── src/
│   │   │   ├── components/       # UI 组件
│   │   │   ├── style-recipe/     # 七轴配方系统
│   │   │   ├── tokens/           # 设计令牌
│   │   │   └── theme/            # 主题系统
│   │   ├── vite.config.ts
│   │   └── package.json          # @th-ui/core
│   │
│   └── @th-ui/website/           # 展示网站（Next.js 15）⭐️ 新增
│       ├── src/
│       │   ├── app/              # App Router
│       │   │   ├── page.tsx                 # 首页
│       │   │   ├── gallery/
│       │   │   │   ├── page.tsx             # 配方库
│       │   │   │   └── [recipeId]/
│       │   │   │       └── page.tsx         # 配方详情
│       │   │   ├── adoption/
│       │   │   │   └── page.tsx             # 取用矩阵
│       │   │   └── playground/
│       │   │       └── page.tsx             # 在线预览
│       │   ├── components/       # 网站专用组件
│       │   ├── lib/              # 工具函数
│       │   └── registry/         # Registry API
│       ├── next.config.js
│       └── package.json          # 依赖 @th-ui/core
│
└── docs/                         # 文档
```

---

## 🎯 Next.js 网站功能规划

### 1. Gallery（配方库）- `/gallery`

**核心功能**：
- ✅ 展示所有七轴配方（当前20个）
- ✅ 实时搜索和过滤
- ✅ 配方预览卡片
- ✅ 按七轴参数分组浏览
- ✅ 收藏和评分功能（localStorage）
- ✅ 深色/浅色模式切换

**技术特性**：
- **SSR/SSG**：配方列表静态生成（`generateStaticParams`）
- **ISR**：定期重新验证（支持新增配方）
- **Client Component**：搜索、过滤、收藏等交互
- **Streaming**：大量配方时渐进式渲染

### 2. Adoption Matrix（取用矩阵）- `/adoption`

**核心功能**：
- ✅ 配方选择器（支持多选）
- ✅ 组件选择器（选择需要的组件）
- ✅ 框架选择器（React/Vue/Svelte）
- ✅ 实时代码生成
- ✅ 一键复制到剪贴板
- ✅ 导出到 CodeSandbox/StackBlitz
- ✅ 生成 NPM 安装命令
- ✅ 生成配置文件（tailwind.config.ts）

**技术特性**：
- **Server Actions**：生成代码、导出沙盒
- **React Server Components**：代码模板渲染
- **Edge Runtime**：快速代码生成

### 3. Playground（在线预览）- `/playground`

**核心功能**：
- ✅ 左侧：配方选择 + 组件选择
- ✅ 中间：实时预览（iframe 隔离）
- ✅ 右侧：代码编辑器（Monaco）
- ✅ 实时热更新
- ✅ 保存和分享（URL 短链）

**技术特性**：
- **Dynamic Import**：按需加载组件
- **Web Workers**：代码编译和格式化
- **Service Worker**：离线支持

---

## 🏗️ Next.js 项目结构设计

```typescript
// packages/@th-ui/website/

src/
├── app/                                    # App Router
│   ├── layout.tsx                          # 根布局
│   ├── page.tsx                            # 首页
│   ├── globals.css                         # 全局样式
│   │
│   ├── gallery/                            # 配方库
│   │   ├── page.tsx                        # 列表页（SSG）
│   │   ├── [recipeId]/
│   │   │   ├── page.tsx                    # 详情页（SSG）
│   │   │   └── loading.tsx                 # 加载状态
│   │   └── layout.tsx                      # Gallery 布局
│   │
│   ├── adoption/                           # 取用矩阵
│   │   ├── page.tsx                        # 主页（Client）
│   │   └── actions.ts                      # Server Actions
│   │
│   ├── playground/                         # 在线预览
│   │   ├── page.tsx                        # 主页（Client）
│   │   └── api/
│   │       └── compile/
│   │           └── route.ts                # 编译 API
│   │
│   └── api/                                # API Routes
│       ├── registry/
│       │   └── route.ts                    # Registry JSON
│       └── search/
│           └── route.ts                    # 搜索 API
│
├── components/                             # 网站组件
│   ├── gallery/
│   │   ├── RecipeCard.tsx                  # 配方卡片
│   │   ├── RecipeFilters.tsx               # 过滤器
│   │   ├── RecipeSearch.tsx                # 搜索框
│   │   └── RecipePreview.tsx               # 预览模态框
│   │
│   ├── adoption/
│   │   ├── RecipeSelector.tsx              # 配方选择器
│   │   ├── ComponentSelector.tsx           # 组件选择器
│   │   ├── FrameworkSelector.tsx           # 框架选择器
│   │   ├── CodePreview.tsx                 # 代码预览
│   │   └── ExportButtons.tsx               # 导出按钮
│   │
│   ├── playground/
│   │   ├── EditorPanel.tsx                 # 编辑器面板
│   │   ├── PreviewPanel.tsx                # 预览面板
│   │   └── ConfigPanel.tsx                 # 配置面板
│   │
│   └── shared/
│       ├── Header.tsx                      # 导航栏
│       ├── Footer.tsx                      # 页脚
│       └── ThemeToggle.tsx                 # 主题切换
│
├── lib/                                    # 工具函数
│   ├── registry/
│   │   ├── generator.ts                    # Registry 生成器
│   │   ├── api.ts                          # Registry API 客户端
│   │   └── types.ts                        # 类型定义
│   │
│   ├── adoption/
│   │   ├── code-generator.ts               # 代码生成器
│   │   ├── sandbox-exporter.ts             # 沙盒导出器
│   │   └── templates.ts                    # 代码模板
│   │
│   └── utils/
│       ├── cn.ts                           # classnames 工具
│       ├── format.ts                       # 格式化工具
│       └── storage.ts                      # LocalStorage 封装
│
└── styles/                                 # 样式文件
    └── themes.css                          # 主题样式
```

---

## 📄 核心页面实现

### 1. Gallery 列表页（SSG）

```typescript
// src/app/gallery/page.tsx

import { unifiedRecipes } from '@th-ui/core/style-recipe'
import { RecipeCard } from '@/components/gallery/RecipeCard'
import { RecipeFilters } from '@/components/gallery/RecipeFilters'
import { RecipeSearch } from '@/components/gallery/RecipeSearch'

export const metadata = {
  title: 'TH-UI 配方库 - 20+ 七轴风格配方',
  description: '探索 TH-UI 的七轴风格配方系统，可无限扩展',
}

// ✅ SSG：构建时生成静态页面
export default async function GalleryPage() {
  // 服务端获取配方列表
  const recipes = unifiedRecipes

  return (
    <div className="gallery-page container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">TH-UI 配方库</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          探索 {recipes.length} 个七轴风格配方，可无限扩展
        </p>
      </header>

      {/* 搜索和过滤（Client Component） */}
      <div className="filters-section mb-8">
        <RecipeSearch />
        <RecipeFilters />
      </div>

      {/* 配方网格（Server Component） */}
      <div className="recipe-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  )
}

// ✅ ISR：每小时重新验证
export const revalidate = 3600
```

### 2. Gallery 详情页（SSG + Dynamic）

```typescript
// src/app/gallery/[recipeId]/page.tsx

import { notFound } from 'next/navigation'
import { unifiedRecipes, getUnifiedRecipe } from '@th-ui/core/style-recipe'
import { RecipePreview } from '@/components/gallery/RecipePreview'
import { CodePreview } from '@/components/adoption/CodePreview'
import { ExportButtons } from '@/components/adoption/ExportButtons'

interface PageProps {
  params: { recipeId: string }
}

// ✅ SSG：生成所有配方的静态页面
export async function generateStaticParams() {
  return unifiedRecipes.map((recipe) => ({
    recipeId: encodeURIComponent(recipe.id),
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const recipeId = decodeURIComponent(params.recipeId)
  const recipe = getUnifiedRecipe(recipeId)

  if (!recipe) return { title: '配方不存在' }

  return {
    title: `${recipe.name} - TH-UI 配方`,
    description: recipe.description,
  }
}

export default async function RecipeDetailPage({ params }: PageProps) {
  const recipeId = decodeURIComponent(params.recipeId)
  const recipe = getUnifiedRecipe(recipeId)

  if (!recipe) {
    notFound()
  }

  return (
    <div className="recipe-detail-page container mx-auto px-4 py-8">
      {/* 配方信息 */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{recipe.name}</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          {recipe.description}
        </p>

        {/* 七轴参数展示 */}
        <div className="axes-display grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
          <AxisBadge label="Mode" value={recipe.mode} />
          <AxisBadge label="Base" value={recipe.base} />
          <AxisBadge label="Accent" value={recipe.accent} />
          <AxisBadge label="Tone" value={recipe.tone} />
          <AxisBadge label="Density" value={recipe.density} />
          <AxisBadge label="Motion" value={recipe.motion} />
          <AxisBadge label="Surface" value={recipe.surface} />
        </div>
      </header>

      {/* 实时预览（Client Component） */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">实时预览</h2>
        <RecipePreview recipe={recipe} />
      </section>

      {/* 使用代码 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">使用代码</h2>
        <CodePreview recipeId={recipe.id} />
      </section>

      {/* 导出按钮 */}
      <section>
        <ExportButtons recipe={recipe} />
      </section>
    </div>
  )
}
```

### 3. Adoption Matrix 页面（Client Interactivity）

```typescript
// src/app/adoption/page.tsx

'use client'

import { useState } from 'react'
import { unifiedRecipes } from '@th-ui/core/style-recipe'
import { RecipeSelector } from '@/components/adoption/RecipeSelector'
import { ComponentSelector } from '@/components/adoption/ComponentSelector'
import { FrameworkSelector } from '@/components/adoption/FrameworkSelector'
import { CodePreview } from '@/components/adoption/CodePreview'
import { ExportButtons } from '@/components/adoption/ExportButtons'
import { generateInstallCode } from '@/lib/adoption/code-generator'

export default function AdoptionPage() {
  const [selectedRecipe, setSelectedRecipe] = useState(unifiedRecipes[0].id)
  const [selectedComponents, setSelectedComponents] = useState<string[]>(['Button', 'Card'])
  const [selectedFramework, setSelectedFramework] = useState<'react' | 'vue' | 'svelte'>('react')

  // 实时生成代码
  const generatedCode = generateInstallCode({
    recipeId: selectedRecipe,
    components: selectedComponents,
    framework: selectedFramework,
  })

  return (
    <div className="adoption-page container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">配方取用矩阵</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          选择配方和组件，一键生成安装代码
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 左侧：选择器 */}
        <div className="selectors-panel space-y-6">
          <section>
            <h2 className="text-xl font-bold mb-4">1️⃣ 选择配方</h2>
            <RecipeSelector
              recipes={unifiedRecipes}
              selected={selectedRecipe}
              onChange={setSelectedRecipe}
            />
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">2️⃣ 选择组件</h2>
            <ComponentSelector
              selected={selectedComponents}
              onChange={setSelectedComponents}
            />
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">3️⃣ 选择框架</h2>
            <FrameworkSelector
              selected={selectedFramework}
              onChange={setSelectedFramework}
            />
          </section>
        </div>

        {/* 右侧：代码预览 */}
        <div className="code-panel sticky top-8">
          <h2 className="text-xl font-bold mb-4">生成的代码</h2>
          <CodePreview code={generatedCode} language="typescript" />

          <div className="mt-6">
            <ExportButtons
              code={generatedCode}
              recipeId={selectedRecipe}
              components={selectedComponents}
              framework={selectedFramework}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
```

### 4. Playground 页面（实时预览）

```typescript
// src/app/playground/page.tsx

'use client'

import { useState } from 'react'
import { unifiedRecipes } from '@th-ui/core/style-recipe'
import { EditorPanel } from '@/components/playground/EditorPanel'
import { PreviewPanel } from '@/components/playground/PreviewPanel'
import { ConfigPanel } from '@/components/playground/ConfigPanel'

export default function PlaygroundPage() {
  const [selectedRecipe, setSelectedRecipe] = useState(unifiedRecipes[0].id)
  const [code, setCode] = useState(DEFAULT_CODE)
  const [compiledCode, setCompiledCode] = useState('')

  // 实时编译
  const handleCodeChange = async (newCode: string) => {
    setCode(newCode)

    // 调用编译 API
    const response = await fetch('/api/compile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: newCode }),
    })

    const { compiled } = await response.json()
    setCompiledCode(compiled)
  }

  return (
    <div className="playground-page h-screen flex flex-col">
      <header className="px-4 py-3 border-b">
        <h1 className="text-2xl font-bold">TH-UI Playground</h1>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* 左侧：编辑器 */}
        <div className="w-1/2 border-r">
          <EditorPanel code={code} onChange={handleCodeChange} />
        </div>

        {/* 右侧：预览 + 配置 */}
        <div className="w-1/2 flex flex-col">
          <div className="flex-1">
            <PreviewPanel
              code={compiledCode}
              recipeId={selectedRecipe}
            />
          </div>

          <div className="h-64 border-t">
            <ConfigPanel
              selectedRecipe={selectedRecipe}
              onRecipeChange={setSelectedRecipe}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const DEFAULT_CODE = `
import { Button, Card } from '@th-ui/core'

export default function Demo() {
  return (
    <Card>
      <h2>Hello TH-UI!</h2>
      <Button>Click Me</Button>
    </Card>
  )
}
`.trim()
```

---

## 🔧 核心功能实现

### 1. Registry API（Server Component）

```typescript
// src/lib/registry/generator.ts

import { unifiedRecipes } from '@th-ui/core/style-recipe'
import type { StyleRecipe } from '@th-ui/core/style-recipe'

export interface RegistryRecipe extends StyleRecipe {
  preview: {
    thumbnail: string
    demoUrl: string
  }
  usage: {
    installations: number
    rating: number
  }
  metadata: {
    author: string
    version: string
    license: string
    createdAt: string
    updatedAt: string
  }
}

/**
 * 生成 Registry JSON
 */
export function generateRegistryJSON(): RegistryRecipe[] {
  return unifiedRecipes.map((recipe) => ({
    ...recipe,
    preview: {
      thumbnail: `/thumbnails/${encodeURIComponent(recipe.id)}.png`,
      demoUrl: `/gallery/${encodeURIComponent(recipe.id)}`,
    },
    usage: {
      installations: 0,
      rating: 0,
    },
    metadata: {
      author: 'TH-UI Team',
      version: '1.0.0',
      license: 'MIT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  }))
}

/**
 * Registry API Route
 */
// src/app/api/registry/route.ts
import { NextResponse } from 'next/server'
import { generateRegistryJSON } from '@/lib/registry/generator'

export async function GET() {
  const registry = generateRegistryJSON()

  return NextResponse.json(registry, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
```

### 2. 代码生成器（Server Actions）

```typescript
// src/lib/adoption/code-generator.ts

export interface CodeGenerationOptions {
  recipeId: string
  components: string[]
  framework: 'react' | 'vue' | 'svelte'
}

/**
 * 生成安装代码
 */
export function generateInstallCode(options: CodeGenerationOptions): string {
  const { recipeId, components, framework } = options

  if (framework === 'react') {
    return `
// 1. 安装 TH-UI
npm install @th-ui/core

// 2. 在你的应用中导入
import { StyleRecipeProvider } from '@th-ui/core/style-recipe'
import { ${components.join(', ')} } from '@th-ui/core'

function App() {
  return (
    <StyleRecipeProvider initialRecipe="${recipeId}">
      {/* 你的应用 */}
    </StyleRecipeProvider>
  )
}
    `.trim()
  }

  // Vue/Svelte 实现...
  return ''
}

/**
 * 生成 Tailwind 配置
 */
export function generateTailwindConfig(recipeId: string): string {
  return `
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--color-primary-50)',
          500: 'var(--color-primary-500)',
          // ... 其他色阶
        },
      },
    },
  },
}

export default config
  `.trim()
}

/**
 * Server Action：导出到 CodeSandbox
 */
// src/app/adoption/actions.ts
'use server'

import { generateInstallCode, generateTailwindConfig } from '@/lib/adoption/code-generator'

export async function exportToCodeSandbox(options: CodeGenerationOptions) {
  const appCode = generateInstallCode(options)
  const tailwindConfig = generateTailwindConfig(options.recipeId)

  const sandbox = {
    files: {
      'package.json': {
        content: JSON.stringify({
          dependencies: {
            '@th-ui/core': 'latest',
            'react': '^19.2.0',
            'react-dom': '^19.2.0',
          },
        }, null, 2),
      },
      'src/App.tsx': {
        content: appCode,
      },
      'tailwind.config.ts': {
        content: tailwindConfig,
      },
    },
  }

  // 调用 CodeSandbox API
  const response = await fetch('https://codesandbox.io/api/v1/sandboxes/define', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sandbox),
  })

  const { sandbox_id } = await response.json()
  return `https://codesandbox.io/s/${sandbox_id}`
}
```

### 3. 搜索和过滤（Client Component）

```typescript
// src/components/gallery/RecipeSearch.tsx

'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@th-ui/core'
import { Search } from 'lucide-react'

export function RecipeSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [query, setQuery] = useState(searchParams.get('q') || '')

  const handleSearch = (value: string) => {
    setQuery(value)

    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      if (value) {
        params.set('q', value)
      } else {
        params.delete('q')
      }
      router.push(`/gallery?${params.toString()}`)
    })
  }

  return (
    <div className="relative">
      <Input
        leftIcon={<Search className="w-4 h-4" />}
        placeholder="搜索配方名称、标签..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full"
      />
      {isPending && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Spinner size="sm" />
        </div>
      )}
    </div>
  )
}
```

---

## 🚀 部署和优化

### Next.js 配置

```typescript
// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 优化配置
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // 图片优化
  images: {
    domains: ['cdn.thui.dev'],
    formats: ['image/avif', 'image/webp'],
  },

  // 实验性特性
  experimental: {
    ppr: true,  // Partial Prerendering
    serverActions: true,
  },

  // 转译 @th-ui/core
  transpilePackages: ['@th-ui/core'],
}

module.exports = nextConfig
```

### Monorepo 配置（Turborepo）

```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

---

## 📊 实施路线图

### Phase 1 - 基础架构（1周）

- [ ] 创建 `packages/@th-ui/website` 目录
- [ ] 初始化 Next.js 15 项目
- [ ] 配置 Turborepo Monorepo
- [ ] 配置 @th-ui/core 依赖
- [ ] 实现基础 Layout 和导航

### Phase 2 - Gallery 页面（1周）

- [ ] 实现 Gallery 列表页（SSG）
- [ ] 实现 Gallery 详情页（SSG + Dynamic）
- [ ] 实现搜索和过滤功能
- [ ] 实现配方预览模态框
- [ ] 生成缩略图（Playwright）

### Phase 3 - Adoption Matrix（1周）

- [ ] 实现配方选择器
- [ ] 实现组件选择器
- [ ] 实现框架选择器
- [ ] 实现代码生成器
- [ ] 实现导出功能（CodeSandbox/StackBlitz）

### Phase 4 - Playground（2周）

- [ ] 集成 Monaco Editor
- [ ] 实现实时编译（Web Worker）
- [ ] 实现预览面板（iframe 隔离）
- [ ] 实现保存和分享功能
- [ ] 优化性能和体验

### Phase 5 - 优化和部署（1周）

- [ ] 性能优化（图片、代码分割）
- [ ] SEO 优化（Metadata、Sitemap）
- [ ] 部署到 Vercel
- [ ] 配置 CDN（Cloudflare）
- [ ] 监控和分析（Vercel Analytics）

---

## 🎯 技术选型总结

| 功能 | 技术方案 | 原因 |
|------|---------|------|
| 展示网站框架 | Next.js 15 App Router | SSR/SSG、性能优化、SEO |
| 组件库 | React 19 + Vite | 保持现有技术栈 |
| 数据获取 | Server Components | 零客户端 JS，极致性能 |
| 交互功能 | Client Components | 搜索、过滤、预览 |
| 代码生成 | Server Actions | 安全、简洁的 API |
| 编辑器 | Monaco Editor | VS Code 同款，强大 |
| 状态管理 | React Context + URL | 无需额外库，简洁 |
| 样式 | Tailwind CSS + CSS Variables | 与组件库一致 |
| 部署 | Vercel | 原生支持，零配置 |

---

## 📚 相关文档

- [Next.js 15 文档](https://nextjs.org/docs)
- [App Router 指南](https://nextjs.org/docs/app)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [TH-UI 七轴配方体系](./NEW_SYSTEM_COMPLETE_GUIDE.md)
- [组件库架构](./ARCHITECTURE.md)

---

**创建时间**: 2025-01-13
**最后更新**: 2025-01-13
**状态**: 📋 设计完成，待实施
**负责人**: TH-UI Team
