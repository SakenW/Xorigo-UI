# 🚀 Xorigo UI Website 重构快速开始指南

> **版本**: v2.0.0
> **创建时间**: 2025-10-13
> **目标**: 帮助开发者快速上手 Website 重构架构

---

## 📖 文档体系

在开始之前，建议先阅读以下核心文档：

1. **[Website 重构架构总览](./Website重构架构总览.md)** ⭐ 推荐首读
   - 架构概览和核心原则
   - 文档导航和学习路径

2. **[Website 重构架构设计方案](./Website重构架构设计方案.md)**
   - 完整的技术设计方案
   - 详细的实现指南

3. **[Website 重构实施清单](./Website重构实施清单.md)**
   - 16 周详细任务清单
   - 进度追踪和验收标准

4. **[Website 架构数据流和交互图](./Website架构数据流和交互图.md)**
   - 可视化数据流图
   - 组件交互流程

5. **[Website 重构最佳实践和规则](./Website重构最佳实践和规则.md)**
   - 开发规则和规范
   - 代码审查清单

---

## 🎯 10 分钟快速理解架构

### 核心概念

```yaml
数据层原则:
  只读数据源: 所有内容来自 packages/ (registry/tokens/templates/docs/i18n)
  唯一入口: src/data/*.readonly.ts (适配层)
  构建校验: prebuild 强制校验，失败阻断

渲染层原则:
  RSC 优先: Docs/Adoption/Token/Theme → RSC + ISR
  Client 隔离: Playground/Search → Client + 动态导入
  体积预算: 站点 ≤120KB, Playground ≤150KB (gzip)

DX 增强:
  CLI 工具: doctor/sync/check
  监控仪表板: 性能/体积/可访问性
  自动化: 文档同步/构建校验
```

### 四层架构

```
Layer 4: Packages (只读源)
         ↓ 构建时读取
Layer 3: Data Layer (适配层) - src/data/*.readonly.ts
         ↓ Schema 验证
Layer 2: SDK Layer (协议层) - src/lib/sdk/*-client.ts
         ↓ API 调用
Layer 1: App Layer (展示层) - RSC Pages / Client Pages / API Routes
```

### 数据访问模式

```typescript
// RSC 页面: 直接访问 Data Layer (服务端)
import { readonlyRegistry } from '@/data/registry.readonly'

export default async function Page() {
  const components = readonlyRegistry.getComponents()
  return <div>{/* ... */}</div>
}

// Client 组件: 通过 SDK 访问 API Routes (客户端)
import { registryClient } from '@/lib/sdk/registry-client'

export function ClientComponent() {
  const [components, setComponents] = useState([])
  useEffect(() => {
    registryClient.getComponents().then(setComponents)
  }, [])
  return <div>{/* ... */}</div>
}
```

---

## 🛠️ 开发环境准备

### 1. 克隆项目

```bash
cd /home/saken/project/Xorigo-UI/apps/website
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问: http://localhost:3000

---

## 📝 Phase 1 快速开始 (数据层重构)

### 目标

建立只读数据适配层和 SDK 层，确保所有数据访问通过统一入口。

### Step 1: 创建数据适配层目录

```bash
mkdir -p apps/website/src/data
```

### Step 2: 实现 Registry 适配器

创建文件: `src/data/registry.readonly.ts`

```typescript
/**
 * @fileoverview Registry 只读适配器 - 唯一数据访问入口
 */

import { readFileSync } from 'fs'
import { join } from 'path'
import { RegistrySchema, type Component } from './types'

class RegistryReadonlyAdapter {
  private static instance: RegistryReadonlyAdapter
  private registry: any = null
  private validated: boolean = false

  private constructor() {}

  static getInstance(): RegistryReadonlyAdapter {
    if (!RegistryReadonlyAdapter.instance) {
      RegistryReadonlyAdapter.instance = new RegistryReadonlyAdapter()
    }
    return RegistryReadonlyAdapter.instance
  }

  getComponents(): Component[] {
    this.ensureLoaded()
    return this.registry.components
  }

  getComponent(name: string): Component | undefined {
    this.ensureLoaded()
    return this.registry.components.find((c: Component) => c.name === name)
  }

  getMetadata() {
    this.ensureLoaded()
    return this.registry.metadata
  }

  validateConsistency() {
    // 实现一致性校验逻辑
    // 详见完整设计方案
  }

  private ensureLoaded() {
    if (!this.registry) {
      this.loadRegistry()
    }
    if (!this.validated) {
      this.validateRegistry()
    }
  }

  private loadRegistry() {
    const registryPath = join(
      process.cwd(),
      '../../packages/registry/registry.json'
    )
    const content = readFileSync(registryPath, 'utf-8')
    this.registry = JSON.parse(content)
  }

  private validateRegistry() {
    RegistrySchema.parse(this.registry)
    this.validated = true
  }
}

export const readonlyRegistry = RegistryReadonlyAdapter.getInstance()
```

### Step 3: 创建类型定义

创建文件: `src/data/types.ts`

```typescript
import { z } from 'zod'

export const ComponentSchema = z.object({
  name: z.string(),
  title: z.string(),
  category: z.string(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  preview: z.object({
    module: z.string()
  }).optional(),
})

export const RegistrySchema = z.object({
  components: z.array(ComponentSchema),
  metadata: z.object({
    version: z.string(),
    updated: z.string()
  })
})

export type Component = z.infer<typeof ComponentSchema>
```

### Step 4: 配置 ESLint 规则

更新文件: `.eslintrc.js`

```javascript
module.exports = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@xorigo-ui/registry', '@xorigo-ui/tokens'],
            message: '❌ 请使用 src/data/*.readonly.ts 访问数据'
          }
        ]
      }
    ]
  }
}
```

### Step 5: 配置构建前校验

创建文件: `scripts/validate-readonly-consistency.ts`

```typescript
import { validateAllConsistency, printValidationReport } from '../src/data/validation'

async function main() {
  console.log('🚀 开始构建前一致性校验...\n')

  const result = await validateAllConsistency()
  printValidationReport(result)

  if (!result.valid) {
    console.error('❌ 校验失败，构建已阻断')
    process.exit(1)
  }

  console.log('✅ 校验通过，继续构建')
  process.exit(0)
}

main()
```

更新 `package.json`:

```json
{
  "scripts": {
    "prebuild": "tsx scripts/validate-readonly-consistency.ts",
    "build": "next build"
  }
}
```

### Step 6: 测试验证

```bash
# 测试构建校验
npm run prebuild

# 测试完整构建
npm run build

# 测试 ESLint 规则
npm run lint
```

### ✅ Phase 1 完成标准

- [ ] 所有数据访问通过 `src/data/*.readonly.ts`
- [ ] 构建前校验正常运行
- [ ] ESLint 规则正常工作
- [ ] 无直接访问 packages/ 的代码

---

## 🎮 Phase 3 快速开始 (Playground 双模式)

### 目标

实现 Playground 的 Live Props 和 Snapshot 双模式功能。

### Step 1: 安装 Zustand

```bash
npm install zustand
```

### Step 2: 创建 Playground Store

创建文件: `src/stores/playground.ts`

```typescript
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface PlaygroundState {
  currentTheme: string
  currentDensity: 'compact' | 'modern' | 'spacious'
  selectedComponent: any | null
  componentProps: Record<string, any>
  snapshots: any[]
}

interface PlaygroundActions {
  setThemeState: (theme: string) => void
  setDensity: (density: string) => void
  selectComponent: (component: any) => void
  updateComponentProp: (prop: string, value: any) => void
  saveSnapshot: (name: string) => void
  loadSnapshot: (id: string) => void
}

type PlaygroundStore = PlaygroundState & PlaygroundActions

export const usePlaygroundStore = create<PlaygroundStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      currentTheme: 'system',
      currentDensity: 'modern',
      selectedComponent: null,
      componentProps: {},
      snapshots: [],

      // Actions
      setThemeState: (theme) => set({ currentTheme: theme }),

      setDensity: (density) => set({ currentDensity: density as any }),

      selectComponent: (component) => set({
        selectedComponent: component,
        componentProps: {}
      }),

      updateComponentProp: (prop, value) => set(state => ({
        componentProps: { ...state.componentProps, [prop]: value }
      })),

      saveSnapshot: (name) => {
        const state = get()
        const snapshot = {
          id: `snapshot-${Date.now()}`,
          name,
          themeState: {
            theme: state.currentTheme,
            density: state.currentDensity
          },
          componentState: {
            component: state.selectedComponent,
            props: state.componentProps
          },
          created: new Date().toISOString()
        }
        set({ snapshots: [...state.snapshots, snapshot] })
      },

      loadSnapshot: (id) => {
        const state = get()
        const snapshot = state.snapshots.find(s => s.id === id)
        if (snapshot) {
          set({
            currentTheme: snapshot.themeState.theme,
            currentDensity: snapshot.themeState.density,
            selectedComponent: snapshot.componentState.component,
            componentProps: snapshot.componentState.props
          })
        }
      }
    }),
    {
      name: 'xorigo-playground-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        snapshots: state.snapshots,
        currentTheme: state.currentTheme,
        currentDensity: state.currentDensity
      })
    }
  )
)
```

### Step 3: 创建 Live Props Editor

创建文件: `src/components/playground/live-props-editor.tsx`

```typescript
'use client'

import { useState } from 'react'
import { usePlaygroundStore } from '@/stores/playground'

export function LivePropsEditor() {
  const {
    selectedComponent,
    componentProps,
    updateComponentProp
  } = usePlaygroundStore()

  const [activeTab, setActiveTab] = useState<'props' | 'theme'>('props')

  if (!selectedComponent) {
    return (
      <div className="p-6">
        <p className="text-gray-500">请选择一个组件</p>
      </div>
    )
  }

  return (
    <div className="live-props-editor">
      <div className="border-b">
        <div className="flex gap-4 px-6">
          <button
            className={`py-3 ${activeTab === 'props' ? 'border-b-2 border-primary-500' : ''}`}
            onClick={() => setActiveTab('props')}
          >
            组件属性
          </button>
          <button
            className={`py-3 ${activeTab === 'theme' ? 'border-b-2 border-primary-500' : ''}`}
            onClick={() => setActiveTab('theme')}
          >
            主题设置
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'props' && (
          <div className="space-y-4">
            {Object.keys(selectedComponent.props || {}).map(propName => (
              <div key={propName}>
                <label className="block text-sm font-medium mb-1">
                  {propName}
                </label>
                <input
                  type="text"
                  value={componentProps[propName] || ''}
                  onChange={(e) => updateComponentProp(propName, e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'theme' && (
          <div className="space-y-4">
            <ThemeControls />
          </div>
        )}
      </div>
    </div>
  )
}

function ThemeControls() {
  const { currentTheme, currentDensity, setThemeState, setDensity } = usePlaygroundStore()

  return (
    <>
      <div>
        <label className="block text-sm font-medium mb-1">主题</label>
        <select
          value={currentTheme}
          onChange={(e) => setThemeState(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="light">浅色</option>
          <option value="dark">深色</option>
          <option value="system">跟随系统</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">密度</label>
        <select
          value={currentDensity}
          onChange={(e) => setDensity(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="compact">紧凑</option>
          <option value="modern">现代</option>
          <option value="spacious">宽松</option>
        </select>
      </div>
    </>
  )
}
```

### Step 4: 创建 Snapshot Manager

创建文件: `src/components/playground/snapshot-manager.tsx`

```typescript
'use client'

import { useState } from 'react'
import { usePlaygroundStore } from '@/stores/playground'

export function SnapshotManager() {
  const { snapshots, saveSnapshot, loadSnapshot } = usePlaygroundStore()
  const [showDialog, setShowDialog] = useState(false)
  const [snapshotName, setSnapshotName] = useState('')

  const handleSave = () => {
    if (!snapshotName.trim()) return
    saveSnapshot(snapshotName)
    setSnapshotName('')
    setShowDialog(false)
  }

  return (
    <div className="snapshot-manager p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">快照管理</h3>
        <button
          onClick={() => setShowDialog(true)}
          className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
        >
          保存快照
        </button>
      </div>

      {showDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h4 className="text-lg font-semibold mb-4">保存快照</h4>
            <input
              type="text"
              value={snapshotName}
              onChange={(e) => setSnapshotName(e.target.value)}
              placeholder="输入快照名称"
              className="w-full px-3 py-2 border rounded mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowDialog(false)}
                className="px-4 py-2 border rounded"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary-500 text-white rounded"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {snapshots.length === 0 ? (
          <p className="text-gray-500">还没有保存的快照</p>
        ) : (
          snapshots.map(snapshot => (
            <div
              key={snapshot.id}
              className="border rounded p-4 flex items-center justify-between"
            >
              <div>
                <h4 className="font-medium">{snapshot.name}</h4>
                <p className="text-sm text-gray-500">
                  {new Date(snapshot.created).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => loadSnapshot(snapshot.id)}
                className="px-3 py-1 border rounded hover:bg-gray-50"
              >
                加载
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
```

### Step 5: 创建 Playground 主页面

创建文件: `src/app/playground/[component]/page.tsx`

```typescript
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const PlaygroundClient = dynamic(
  () => import('@/components/playground/playground-client'),
  {
    loading: () => <div>加载中...</div>,
    ssr: false
  }
)

export default function PlaygroundPage({
  params
}: {
  params: { component: string }
}) {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<div>加载中...</div>}>
        <PlaygroundClient componentName={params.component} />
      </Suspense>
    </div>
  )
}
```

创建文件: `src/components/playground/playground-client.tsx`

```typescript
'use client'

import { useEffect } from 'react'
import { usePlaygroundStore } from '@/stores/playground'
import { LivePropsEditor } from './live-props-editor'
import { SnapshotManager } from './snapshot-manager'

interface Props {
  componentName: string
}

export default function PlaygroundClient({ componentName }: Props) {
  const { selectComponent } = usePlaygroundStore()

  useEffect(() => {
    // 加载组件信息
    selectComponent({ name: componentName, props: {} })
  }, [componentName, selectComponent])

  return (
    <div className="grid grid-cols-12 gap-6 p-6">
      {/* 左侧: Props 编辑器 */}
      <div className="col-span-3 border rounded-lg">
        <LivePropsEditor />
      </div>

      {/* 中间: 预览区域 */}
      <div className="col-span-6 border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">组件预览</h2>
        <div className="border rounded p-8 bg-gray-50">
          {/* 组件预览 */}
          <p>组件预览区域</p>
        </div>
      </div>

      {/* 右侧: 快照管理 */}
      <div className="col-span-3 border rounded-lg">
        <SnapshotManager />
      </div>
    </div>
  )
}
```

### Step 6: 测试验证

访问: http://localhost:3000/playground/button

- [ ] Props 编辑器正常显示
- [ ] 主题切换正常工作
- [ ] 快照保存/加载正常

---

## 🔧 常见问题和解决方案

### Q1: 构建校验失败

**问题**: `npm run prebuild` 失败，提示 Registry 不一致

**解决方案**:

```bash
# 1. 检查 registry.json 是否存在
ls -la ../../packages/registry/registry.json

# 2. 检查 registry.json 格式是否正确
cat ../../packages/registry/registry.json | jq .

# 3. 运行详细的校验
npm run prebuild -- --verbose
```

### Q2: ESLint 规则不生效

**问题**: 直接 import `@xorigo-ui/registry` 没有报错

**解决方案**:

```bash
# 1. 清除 ESLint 缓存
rm -rf .eslintcache

# 2. 重新运行 ESLint
npm run lint

# 3. 检查 .eslintrc.js 配置
cat .eslintrc.js
```

### Q3: Zustand Store 持久化不工作

**问题**: 刷新页面后状态丢失

**解决方案**:

```typescript
// 确保正确配置 persist 中间件
import { persist, createJSONStorage } from 'zustand/middleware'

export const useStore = create(
  persist(
    (set) => ({
      // state and actions
    }),
    {
      name: 'store-name',
      storage: createJSONStorage(() => localStorage), // ✅ 必须指定 storage
    }
  )
)
```

### Q4: Dynamic import 不生效

**问题**: Client 组件仍然在服务端渲染

**解决方案**:

```typescript
// ✅ 正确配置 dynamic import
import dynamic from 'next/dynamic'

const ClientComponent = dynamic(
  () => import('@/components/client-component'),
  {
    ssr: false, // ✅ 必须设置 ssr: false
    loading: () => <div>Loading...</div>
  }
)
```

---

## 📚 学习资源

### 推荐阅读顺序

1. **架构理解** (Day 1)
   - 阅读 Website 重构架构总览
   - 理解四层架构和核心原则

2. **数据层实践** (Day 2-3)
   - 完成 Phase 1 快速开始
   - 实现数据适配层和 SDK 层

3. **页面层实践** (Day 4-5)
   - 理解 RSC/Client 分离
   - 实现 RSC 和 Client 页面

4. **状态管理** (Day 6-7)
   - 完成 Phase 3 快速开始
   - 实现 Zustand Store 和 Playground

5. **深入学习** (Week 2+)
   - 阅读完整设计方案
   - 实施完整的 16 周计划

### 官方文档

- Next.js 15: https://nextjs.org/docs
- Zustand: https://zustand-demo.pmnd.rs/
- Zod: https://zod.dev/
- Tailwind CSS: https://tailwindcss.com/docs

---

## 🎓 下一步行动

### 立即开始

1. **阅读架构总览** (10 分钟)
   → [Website 重构架构总览](./Website重构架构总览.md)

2. **完成 Phase 1** (1-2 周)
   → [Website 重构实施清单 - Phase 1](./Website重构实施清单.md#phase-1)

3. **加入开发** (持续)
   → 按照 16 周计划逐步实施

### 获取帮助

- **技术问题**: 查看最佳实践文档
- **架构疑问**: 查看设计方案文档
- **进度追踪**: 查看实施清单文档

---

**文档维护**: Xorigo UI Architecture Team
**版本**: v2.0.0
**最后更新**: 2025-10-13
**下次更新**: 根据实施进度更新
