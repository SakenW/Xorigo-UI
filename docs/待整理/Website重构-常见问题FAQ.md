# Website 重构常见问题 FAQ

**版本**: v1.0
**更新时间**: 2025-01-13
**适用范围**: Xorigo UI Website 架构重构项目

---

## 📋 目录

- [1. 架构设计相关](#1-架构设计相关)
- [2. 组件分类相关](#2-组件分类相关)
- [3. Playground 相关](#3-playground-相关)
- [4. 性能优化相关](#4-性能优化相关)
- [5. 开发流程相关](#5-开发流程相关)
- [6. 部署和CI/CD相关](#6-部署和cicd相关)
- [7. 故障排查相关](#7-故障排查相关)

---

## 1. 架构设计相关

### Q1.1: 为什么要引入四层架构？

**A**: 当前实现存在严重的架构问题（评分3/10）：

**问题**：
- 18个文件直接导入上游包（违反单一数据源原则）
- 缺少数据入口收口层
- 缺少SDK抽象层
- 缺少ErrorBoundary容错机制

**四层架构的价值**：
```
Packages (上游源)
  ↓ 单向依赖
Data Layer (*.readonly.ts 适配器) → 数据收口，唯一入口
  ↓ 单向依赖
SDK Layer (*-client.ts 协议) → RSC/Client 协议分离
  ↓ 单向依赖
App Layer (Pages + Components) → 业务逻辑
```

**收益**：
- ✅ 单一数据源，避免重复逻辑
- ✅ 类型安全，上游变更立即感知
- ✅ 测试友好，可 Mock Data Layer
- ✅ 性能优化，按需加载

---

### Q1.2: Data Layer 的 `*.readonly.ts` 为什么要设计成只读？

**A**: 这是**"数据读取单向流"**的核心设计原则：

**设计原则**：
```typescript
// ✅ GOOD: 单向读取流
Packages (源头) → Data Layer (适配) → SDK Layer (分发) → App Layer (消费)

// ❌ BAD: 双向流动（当前问题）
Packages ← → Components (直接依赖，18个文件)
```

**具体实现**：
```typescript
// src/data/registry.readonly.ts
import { registry } from '@xorigo-ui/registry'

export const getComponentById = (id: string) => {
  return registry.components.find(c => c.id === id)
}

export const getComponentsByCategory = (category: string) => {
  return registry.components.filter(c => c.category === category)
}

// ❌ 禁止：直接导出原始数据
// export { registry } from '@xorigo-ui/registry'
```

**好处**：
- ✅ 防止下游篡改上游数据
- ✅ 统一数据访问接口
- ✅ 便于添加缓存、验证逻辑
- ✅ 上游重构时，只需修改 Data Layer

---

### Q1.3: RSC 和 Client Component 如何协同工作？

**A**: 采用**"Server First, Client When Needed"**策略：

**场景映射**：
| 路由 | 模式 | 理由 |
|------|------|------|
| `/docs/*` | RSC | 静态文档，SEO 友好 |
| `/adoption/*` | RSC | 安装指南，无交互 |
| `/tokens/*` | RSC | 设计令牌展示 |
| `/playground/*` | Client | 实时交互，需要状态 |

**协同模式**：
```tsx
// app/docs/[category]/page.tsx (RSC)
import { getComponentDocs } from '@/sdk/docs-client'

export default async function DocsPage({ params }) {
  const docs = await getComponentDocs(params.category)

  return (
    <div>
      <DocsContent content={docs} /> {/* RSC */}
      <InteractiveDemo componentId={docs.id} /> {/* Client */}
    </div>
  )
}

// components/InteractiveDemo.tsx (Client)
'use client'
import { usePlayground } from '@/sdk/playground-client'

export function InteractiveDemo({ componentId }) {
  const { state, updateProps } = usePlayground(componentId)
  return <div>...</div>
}
```

---

## 2. 组件分类相关

### Q2.1: 10个分类是如何确定的？

**A**: 基于**Atomic Design + DTCG七轴**的映射规则：

**分类体系**：
```yaml
1. ui (14)          # 基础UI，视觉原子（Presentation轴）
2. inputs (19)      # 输入控件（Interaction轴）
3. forms (7)        # 表单容器（Structure轴）
4. navigation (13)  # 导航结构（Composition轴）
5. layout (12)      # 布局分区（Structure轴）
6. feedback (8)     # 反馈状态（Interaction轴）
7. overlays (8)     # 弹层遮罩（Composition轴）
8. datadisplay (12) # 数据展示（Presentation轴）
9. charts (12)      # 数据可视化（Presentation轴）
10. utilities (11)  # 技术基元（Logic轴）
```

**映射示例**：
```typescript
// Button: ui 分类（基础视觉）
category: 'ui'
axes: {
  presentation: 'primary',  // 主要属于 Presentation 轴
  interaction: 'secondary', // 次要涉及 Interaction 轴
}

// DataTable: datadisplay 分类（数据展示）
category: 'datadisplay'
axes: {
  presentation: 'primary',  // 表格展示
  structure: 'secondary',   // 列配置
  interaction: 'tertiary',  // 排序/筛选
}
```

---

### Q2.2: Portal 为什么必须在 utilities 分类？

**A**: 这是**治理规则 5**的强制要求：

**规则定义**：
```yaml
治理规则5: Overlay 协议唯一性
- Modal/Dialog/Popover 等 8 个 Overlay 组件必须依赖 Portal
- Portal 作为技术基元，只能存在于 utilities 分类
- 任何组件需要弹层功能，必须通过 Portal 实现
```

**技术原因**：
```typescript
// ✅ GOOD: Portal 在 utilities，Overlay 组件依赖它
// packages/core/src/components/utilities/Portal.tsx
export function Portal({ children, container }) {
  return ReactDOM.createPortal(children, container)
}

// packages/core/src/components/overlays/Modal.tsx
import { Portal } from '@xorigo-ui/core/utilities'

export function Modal({ children }) {
  return (
    <Portal>
      <div className="modal">{children}</div>
    </Portal>
  )
}

// ❌ BAD: Modal 自己实现 Portal（重复逻辑）
export function Modal({ children }) {
  return ReactDOM.createPortal(...) // 违反单一职责
}
```

**验证脚本**：
```bash
npm run check:categories
# 会检查：
# - Portal 是否只在 utilities 中
# - Overlay 组件是否依赖 Portal
```

---

### Q2.3: 如何决定新组件应该归到哪个分类？

**A**: 使用**四步决策流程**：

**Step 1: 主轴判断**
```text
问：组件的主要职责是什么？
- 视觉展示 → ui/datadisplay/charts
- 用户输入 → inputs
- 数据结构 → forms/layout
- 空间导航 → navigation
- 状态反馈 → feedback
- 弹层交互 → overlays
- 技术支撑 → utilities
```

**Step 2: 复杂度评估**
```text
问：组件的复杂度如何？
- Atom (原子) → ui/inputs/utilities
- Molecule (分子) → feedback/overlays
- Organism (生物体) → forms/navigation/layout/datadisplay/charts
```

**Step 3: 依赖检查**
```text
问：组件依赖了哪些其他组件？
- 依赖 Portal → 可能是 overlays
- 依赖 Input → 可能是 forms
- 依赖 Button → 可能是 ui/navigation
- 无依赖 → 可能是 ui/utilities
```

**Step 4: 路由映射**
```text
最终路由：/docs/components/{category}/{ComponentName}
示例：
- /docs/components/ui/Button
- /docs/components/overlays/Modal
- /docs/components/datadisplay/DataTable
```

**决策示例**：
```yaml
新组件: Tooltip
Step 1: 主轴 → 弹层交互（Overlay）
Step 2: 复杂度 → Molecule（分子）
Step 3: 依赖 → Portal（来自 utilities）
Step 4: 路由 → /docs/components/overlays/Tooltip
结论: 分类 = overlays
```

---

## 3. Playground 相关

### Q3.1: Playground 为什么需要 Zustand 状态管理？

**A**: 因为**"实时交互 + 多组件协同"**的复杂需求：

**当前问题（假设没有状态管理）**：
```tsx
// ❌ BAD: Props Drilling（属性钻取）
<PlaygroundPage>
  <PropsEditor
    props={props}
    onChange={setProps}
  />
  <ComponentPreview
    componentId={id}
    props={props}
  />
  <CodeGenerator
    componentId={id}
    props={props}
  />
  <HistoryPanel
    history={history}
    onRestore={(snapshot) => setProps(snapshot.props)}
  />
</PlaygroundPage>
// 每个组件都需要传递 props 和 onChange，难以维护
```

**Zustand 解决方案**：
```typescript
// src/stores/playground.store.ts
export const usePlaygroundStore = create<PlaygroundState>((set, get) => ({
  // State
  currentComponentId: null,
  currentProps: {},
  history: [],
  mode: 'live',

  // Actions
  setComponent: (id) => set({ currentComponentId: id }),
  updateProps: (props) => set((state) => ({
    currentProps: { ...state.currentProps, ...props },
    history: [...state.history, { props, timestamp: Date.now() }],
  })),
  restoreSnapshot: (snapshot) => set({
    currentProps: snapshot.props,
  }),
}))

// ✅ GOOD: 任何组件都可以直接访问状态
function PropsEditor() {
  const { currentProps, updateProps } = usePlaygroundStore()
  return <div>...</div>
}

function ComponentPreview() {
  const { currentComponentId, currentProps } = usePlaygroundStore()
  return <div>...</div>
}
```

**性能优化**：
```typescript
// 使用 shallow 比较，避免不必要的重渲染
const props = usePlaygroundStore(state => state.currentProps, shallow)
```

---

### Q3.2: Live Props Mode 和 Snapshot Mode 有什么区别？

**A**: 两种模式服务于**不同的使用场景**：

**Live Props Mode（实时属性模式）**：
```typescript
// 特点：实时同步，即改即见
// 适用场景：快速调试、实时预览

function LivePropsMode() {
  const { currentProps, updateProps } = usePlaygroundStore()

  return (
    <div>
      <PropsEditor
        value={currentProps}
        onChange={(key, value) => {
          updateProps({ [key]: value }) // 立即生效
        }}
      />
      <ComponentPreview
        componentId={currentComponentId}
        props={currentProps} // 实时同步
      />
    </div>
  )
}
```

**Snapshot Mode（快照模式）**：
```typescript
// 特点：批量对比，快照保存
// 适用场景：A/B测试、历史回溯

function SnapshotMode() {
  const { history, createSnapshot, compareSnapshots } = usePlaygroundStore()

  return (
    <div>
      <SnapshotList
        snapshots={history}
        onSelect={(snapshot) => {
          // 不直接应用，而是对比
          compareSnapshots(snapshot, currentSnapshot)
        }}
      />
      <CompareView
        snapshotA={selectedA}
        snapshotB={selectedB}
        // 并排展示两个配置的效果
      />
    </div>
  )
}
```

**切换方式**：
```typescript
const { mode, setMode } = usePlaygroundStore()

<Tabs value={mode} onValueChange={setMode}>
  <Tab value="live">实时模式</Tab>
  <Tab value="snapshot">快照模式</Tab>
  <Tab value="compare">对比模式</Tab>
</Tabs>
```

---

### Q3.3: Playground 的性能预算如何保证？

**A**: 采用**"懒加载 + 虚拟化 + 防抖"**三重优化：

**1. 懒加载组件**：
```typescript
// ✅ GOOD: 动态导入，按需加载
const ComponentPreview = dynamic(() =>
  import('@/components/playground/ComponentPreview'),
  { loading: () => <LoadingSkeleton /> }
)

// ❌ BAD: 全部导入
import { AllComponents } from '@xorigo-ui/core'
```

**2. 虚拟化列表**：
```typescript
// src/components/playground/ComponentList.tsx
import { useVirtualizer } from '@tanstack/react-virtual'

export function ComponentList({ components }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: components.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60, // 每行高度
  })

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(virtualRow => (
          <ComponentCard
            key={components[virtualRow.index].id}
            component={components[virtualRow.index]}
          />
        ))}
      </div>
    </div>
  )
}
```

**3. 防抖输入**：
```typescript
// src/hooks/useDebouncedProps.ts
export function useDebouncedProps(props: any, delay = 300) {
  const [debouncedProps, setDebouncedProps] = useState(props)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedProps(props)
    }, delay)

    return () => clearTimeout(timer)
  }, [props, delay])

  return debouncedProps
}

// 使用
function PropsEditor() {
  const { currentProps, updateProps } = usePlaygroundStore()
  const debouncedProps = useDebouncedProps(currentProps)

  return (
    <ComponentPreview props={debouncedProps} /> // 300ms 后才更新
  )
}
```

**性能监控**：
```typescript
// scripts/performance-check.ts
export function checkPlaygroundPerformance() {
  const metrics = {
    bundleSize: getBundleSize('playground'), // ≤ 150KB
    filterTime: measureFilterTime(), // ≤ 50ms
    lcp: measureLCP(), // ≤ 2.5s
  }

  if (metrics.bundleSize > 150 * 1024) {
    throw new Error(`Playground bundle size ${metrics.bundleSize} exceeds 150KB`)
  }
}
```

---

## 4. 性能优化相关

### Q4.1: Core Web Vitals 的目标值是如何确定的？

**A**: 基于**Google 性能标准 + 用户体验数据**：

**标准定义**：
| 指标 | 目标值 | 最大值 | 说明 |
|------|-------|-------|------|
| LCP | ≤ 2.5s | 4.0s | 最大内容绘制（首屏加载） |
| FID | ≤ 100ms | 300ms | 首次输入延迟（交互响应） |
| CLS | ≤ 0.1 | 0.25 | 累积布局偏移（视觉稳定） |

**Xorigo UI 目标**：
```yaml
Core Web Vitals:
  LCP: ≤ 2.5s  # 首屏加载
  FID: ≤ 100ms # 交互响应
  CLS: ≤ 0.1   # 布局稳定

Bundle Size:
  Site: ≤ 120KB (gzip)      # 文档站整体
  Playground: ≤ 150KB (gzip) # Playground 页面

Performance:
  筛选响应: ≤ 50ms   # 组件列表筛选
  Props更新: ≤ 100ms # Playground属性更新
```

**实现策略**：
```typescript
// 1. 图片优化（LCP）
import Image from 'next/image'

<Image
  src="/hero.png"
  width={1200}
  height={600}
  priority // 预加载首屏图片
  placeholder="blur" // 模糊占位
/>

// 2. 字体优化（CLS）
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // 避免 FOIT
  preload: true,
})

// 3. 代码分割（FID）
const Playground = dynamic(() => import('@/components/Playground'), {
  loading: () => <Skeleton />,
  ssr: false, // 客户端渲染
})
```

---

### Q4.2: Bundle Size 预算如何监控和强制？

**A**: 采用**"CI检查 + Webpack分析 + 预算门禁"**：

**CI 检查（GitHub Actions）**：
```yaml
# .github/workflows/website-refactor-check.yml
bundle-size:
  runs-on: ubuntu-latest
  steps:
    - name: Build and Analyze
      run: |
        cd apps/website
        npm run build
        npm run analyze 2>&1 | tee bundle-analysis.txt

    - name: Check Bundle Size Budget
      run: |
        cd apps/website
        node scripts/check-bundle-size.js
        # Exit 1 if exceeds budget
```

**Bundle 分析脚本**：
```typescript
// scripts/check-bundle-size.js
import { gzipSize } from 'gzip-size'
import fs from 'fs'

const BUDGETS = {
  'pages/index': 120 * 1024,        // 120KB
  'pages/playground': 150 * 1024,   // 150KB
}

async function checkBundleSizes() {
  const errors = []

  for (const [file, budget] of Object.entries(BUDGETS)) {
    const filePath = `.next/static/${file}.js`
    const content = fs.readFileSync(filePath)
    const size = await gzipSize(content)

    if (size > budget) {
      errors.push(`${file}: ${size} bytes exceeds budget ${budget} bytes`)
    }
  }

  if (errors.length > 0) {
    console.error('❌ Bundle size check failed:')
    errors.forEach(err => console.error(`  - ${err}`))
    process.exit(1)
  }

  console.log('✅ All bundles within budget')
}

checkBundleSizes()
```

**Webpack Bundle Analyzer**：
```typescript
// next.config.ts
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer({
  // ... other config
})

// 运行分析
// ANALYZE=true npm run build
```

**优化策略**：
```typescript
// 1. Tree Shaking
import { Button } from '@xorigo-ui/core' // ✅ GOOD
import * as XorigoUI from '@xorigo-ui/core' // ❌ BAD

// 2. 动态导入
const Chart = dynamic(() => import('@xorigo-ui/core').then(mod => mod.Chart))

// 3. 外部依赖
// next.config.ts
export default {
  experimental: {
    optimizePackageImports: ['@xorigo-ui/core'],
  },
}
```

---

## 5. 开发流程相关

### Q5.1: 本地开发环境如何快速搭建？

**A**: 使用**一键启动脚本**：

**快速启动**：
```bash
# Step 1: 环境检查
npm run pre-check

# Step 2: 安装依赖
npm install

# Step 3: 构建上游包
npm run build --workspace=packages/core
npm run build --workspace=packages/registry

# Step 4: 启动开发服务器
cd apps/website
npm run dev
# 访问: http://localhost:3000
```

**一键脚本**：
```bash
#!/bin/bash
# scripts/dev-setup.sh

echo "🚀 Xorigo UI Website 开发环境搭建"

# 1. 检查 Node.js 版本
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "❌ Node.js 版本过低，需要 >= 18"
  exit 1
fi

# 2. 安装依赖
echo "📦 安装依赖..."
npm install

# 3. 构建上游包
echo "🔨 构建上游包..."
npm run build --workspace=packages/core
npm run build --workspace=packages/registry

# 4. 类型检查
echo "🔍 类型检查..."
cd apps/website
npm run type-check

# 5. 启动开发服务器
echo "🎉 启动开发服务器..."
npm run dev
```

**使用方式**：
```bash
chmod +x scripts/dev-setup.sh
./scripts/dev-setup.sh
```

---

### Q5.2: 如何快速定位问题是 Data Layer、SDK Layer 还是 App Layer 的？

**A**: 使用**三层检查法**：

**检查流程**：
```text
1. 先检查 Data Layer（数据源）
   → 数据是否正确？
   → 类型是否匹配？

2. 再检查 SDK Layer（协议）
   → RSC/Client 分离正确吗？
   → 接口是否符合预期？

3. 最后检查 App Layer（业务）
   → 组件渲染正常吗？
   → 事件处理正确吗？
```

**诊断脚本**：
```bash
#!/bin/bash
# scripts/diagnose-layer.sh

echo "🔍 Xorigo UI 分层诊断工具"

# 1. 检查 Data Layer
echo "📊 检查 Data Layer..."
node -e "
const { getComponentById } = require('./src/data/registry.readonly')
const component = getComponentById('button')
console.log(component ? '✅ Data Layer OK' : '❌ Data Layer FAIL')
"

# 2. 检查 SDK Layer
echo "🔌 检查 SDK Layer..."
node -e "
const { getComponentDocs } = require('./src/sdk/docs-client')
getComponentDocs('button').then(docs => {
  console.log(docs ? '✅ SDK Layer OK' : '❌ SDK Layer FAIL')
})
"

# 3. 检查 App Layer
echo "🎨 检查 App Layer..."
npm run type-check
if [ $? -eq 0 ]; then
  echo "✅ App Layer Type Check OK"
else
  echo "❌ App Layer Type Check FAIL"
fi
```

**日志追踪**：
```typescript
// src/utils/logger.ts
export const logger = {
  data: (message: string, data?: any) => {
    console.log(`[DATA LAYER] ${message}`, data)
  },
  sdk: (message: string, data?: any) => {
    console.log(`[SDK LAYER] ${message}`, data)
  },
  app: (message: string, data?: any) => {
    console.log(`[APP LAYER] ${message}`, data)
  },
}

// 使用
import { logger } from '@/utils/logger'

// Data Layer
logger.data('Fetching component', { id: 'button' })

// SDK Layer
logger.sdk('RSC request', { category: 'ui' })

// App Layer
logger.app('Rendering component', { props })
```

---

### Q5.3: 如何确保代码符合架构规范？

**A**: 使用**ESLint + Husky + Pre-commit Hooks**：

**ESLint 规则**：
```javascript
// apps/website/.eslintrc.cjs
module.exports = {
  rules: {
    // 禁止直接导入上游包
    'no-restricted-imports': ['error', {
      patterns: [
        {
          group: ['@xorigo-ui/registry', '@xorigo-ui/tokens'],
          message: '禁止直接导入上游包，请使用 src/data/*.readonly.ts',
        },
      ],
    }],

    // 强制使用 SDK Layer
    'no-restricted-syntax': ['error', {
      selector: "ImportDeclaration[source.value=/^@\\/data/]",
      message: '禁止直接导入 Data Layer，请使用 SDK Layer',
    }],
  },
}
```

**Husky Pre-commit**：
```bash
# .husky/pre-commit
#!/bin/sh

echo "🔍 Pre-commit 检查..."

# 1. 类型检查
npm run type-check
if [ $? -ne 0 ]; then
  echo "❌ TypeScript 类型检查失败"
  exit 1
fi

# 2. ESLint 检查
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ ESLint 检查失败"
  exit 1
fi

# 3. 分类验证
npm run check:categories
if [ $? -ne 0 ]; then
  echo "❌ 组件分类验证失败"
  exit 1
fi

echo "✅ Pre-commit 检查通过"
```

**自动修复**：
```bash
# package.json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx}\"",
    "fix:all": "npm run lint:fix && npm run format"
  }
}

# 使用
npm run fix:all
```

---

## 6. 部署和CI/CD相关

### Q6.1: CI/CD 流程包含哪些关键步骤？

**A**: **11 个 Job** 组成完整的质量门禁：

**流程图**：
```
1. basic-checks (基础检查)
   ├─ TypeScript 类型检查
   ├─ ESLint 代码检查
   └─ Prettier 格式检查
   ↓
2. category-validation (分类验证)
   └─ 组件分类规范检查
   ↓
3. registry-consistency (一致性检查)
   ├─ Registry 路径验证
   ├─ Token Schema 验证
   └─ 数据入口收口检查
   ↓
4. build-test (构建测试)
   ├─ 构建 Packages
   └─ 构建 Website
   ↓
5. bundle-size (Bundle大小检查)
   └─ 强制 Bundle 预算
   ↓
6. lighthouse (性能测试)
   └─ Core Web Vitals 检查
   ↓
7. accessibility (可访问性检查)
   └─ Axe a11y 测试
   ↓
8. unit-tests (单元测试)
   └─ 测试覆盖率 ≥ 80%
   ↓
9. security-audit (安全审计)
   └─ npm audit 漏洞扫描
   ↓
10. summary (总结报告)
    └─ 生成并评论 PR
    ↓
11. auto-fix (自动修复)
    └─ 自动修复 ESLint/Prettier
```

**触发条件**：
```yaml
on:
  pull_request:
    paths:
      - 'apps/website/**'
      - 'packages/registry/**'
      - 'packages/tokens/**'
  push:
    branches:
      - main
      - website-refactor-*
```

---

### Q6.2: 如何在本地模拟 CI 环境进行测试？

**A**: 使用**Act 工具**：

**安装 Act**：
```bash
# macOS
brew install act

# Linux
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Windows
choco install act-cli
```

**运行本地 CI**：
```bash
# 运行所有 Jobs
act pull_request

# 运行特定 Job
act pull_request -j basic-checks
act pull_request -j bundle-size

# 使用自定义事件
act -e .github/workflows/test-event.json

# 查看 Job 列表
act -l
```

**测试事件文件**：
```json
// .github/workflows/test-event.json
{
  "pull_request": {
    "number": 123,
    "head": {
      "ref": "feature/playground"
    },
    "base": {
      "ref": "main"
    }
  }
}
```

**本地测试脚本**：
```bash
#!/bin/bash
# scripts/local-ci.sh

echo "🧪 本地 CI 测试"

# 1. 基础检查
echo "1️⃣ Basic Checks..."
npm run type-check && npm run lint && npm run format:check

# 2. 分类验证
echo "2️⃣ Category Validation..."
npm run check:categories

# 3. 构建测试
echo "3️⃣ Build Test..."
npm run build

# 4. Bundle 大小检查
echo "4️⃣ Bundle Size..."
node scripts/check-bundle-size.js

# 5. 单元测试
echo "5️⃣ Unit Tests..."
npm test -- --coverage

echo "✅ 本地 CI 测试完成"
```

---

## 7. 故障排查相关

### Q7.1: 遇到 "Data Layer not found" 错误怎么办？

**A**: 按**优先级排查**：

**可能原因**：
1. Data Layer 文件不存在
2. 导入路径错误
3. 上游包未构建
4. TypeScript 路径映射错误

**排查步骤**：
```bash
# 1. 检查文件是否存在
ls -la src/data/
# 应该看到:
# - registry.readonly.ts
# - tokens.readonly.ts
# - recipes.readonly.ts
# - i18n.readonly.ts

# 2. 检查上游包是否构建
ls -la packages/core/dist/
ls -la packages/registry/dist/

# 3. 重新构建上游包
npm run build --workspace=packages/core
npm run build --workspace=packages/registry

# 4. 检查 TypeScript 路径映射
cat tsconfig.json | grep -A 5 "paths"
# 应该包含:
# "@/data/*": ["src/data/*"]
```

**修复方法**：
```typescript
// ❌ 错误导入
import { registry } from '@xorigo-ui/registry'

// ✅ 正确导入
import { getComponentById } from '@/data/registry.readonly'
```

---

### Q7.2: Playground 页面加载慢怎么优化？

**A**: **四步优化法**：

**Step 1: 分析 Bundle**
```bash
cd apps/website
ANALYZE=true npm run build
# 打开 http://localhost:8888 查看 Bundle 分析
```

**Step 2: 识别大依赖**
```text
查找占用最大的依赖:
- Framer Motion (通常 100KB+)
- Zustand (通常 10KB+)
- 第三方图表库 (通常 200KB+)
```

**Step 3: 懒加载**
```typescript
// ✅ GOOD: 懒加载 Playground
const Playground = dynamic(() =>
  import('@/components/Playground'),
  {
    loading: () => <LoadingSkeleton />,
    ssr: false, // 客户端渲染
  }
)

// ✅ GOOD: 懒加载图表
const ChartPreview = dynamic(() =>
  import('@/components/ChartPreview'),
  { ssr: false }
)
```

**Step 4: Code Splitting**
```typescript
// next.config.ts
export default {
  experimental: {
    optimizePackageImports: [
      '@xorigo-ui/core',
      'framer-motion',
    ],
  },
  webpack: (config) => {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        playground: {
          test: /[\\/]components[\\/]playground/,
          name: 'playground',
          priority: 10,
        },
      },
    }
    return config
  },
}
```

---

### Q7.3: 如何快速回滚到重构前的版本？

**A**: 使用**Git标签 + 分支保护**：

**重构前打标签**：
```bash
# 重构开始前
git tag -a pre-refactor-v1 -m "重构前快照"
git push origin pre-refactor-v1
```

**回滚方法**：
```bash
# 方法 1: 回退到标签
git checkout pre-refactor-v1

# 方法 2: 创建回退分支
git checkout -b rollback/pre-refactor pre-refactor-v1

# 方法 3: 回退特定文件
git checkout pre-refactor-v1 -- apps/website/

# 方法 4: 回退并保留历史
git revert <commit-hash>..HEAD
```

**分支保护策略**：
```yaml
# .github/branch-protection.yml
branches:
  main:
    protection:
      required_status_checks:
        - basic-checks
        - category-validation
        - build-test
      required_pull_request_reviews:
        required_approving_review_count: 1
      dismiss_stale_reviews: true
```

---

## 📚 附录

### A. 相关文档索引

| 文档 | 路径 | 用途 |
|------|------|------|
| 总览 | `00-Website重构总览-开始这里.md` | 快速入口 |
| 架构白皮书 | `Xorigo UI Website 架构白皮书.md` | 架构原则 |
| 组件分类 | `Xorigo UI 组件分类体系白皮书.md` | 分类体系 |
| Agent计划 | `Website重构-Agent执行计划.md` | 执行指南 |
| 最佳实践 | `Website重构最佳实践和规则.md` | 开发规范 |
| 交付清单 | `Website重构-最终交付清单.md` | 验收标准 |

### B. 常用命令速查

```bash
# 开发环境
npm run dev                # 启动开发服务器
npm run build              # 构建生产版本
npm run type-check         # TypeScript 类型检查
npm run lint               # ESLint 检查
npm run lint:fix           # 自动修复 ESLint
npm run format             # Prettier 格式化
npm run test               # 运行测试
npm run test:coverage      # 测试覆盖率

# 架构验证
npm run check:categories   # 组件分类验证
npm run validate:paths     # Registry 路径验证
npm run validate:schema    # Token Schema 验证

# CI/CD
npm run pre-check          # 前置检查
npm run analyze            # Bundle 分析
act pull_request           # 本地 CI 测试

# 故障诊断
./scripts/diagnose-layer.sh  # 分层诊断
./scripts/local-ci.sh         # 本地 CI 测试
```

### C. 技术支持

- **文档**: `/docs/待整理/`
- **脚本**: `/scripts/`
- **CI/CD**: `/.github/workflows/`
- **Issue**: GitHub Issues
- **讨论**: GitHub Discussions

---

**版本历史**:
- v1.0 (2025-01-13): 初始版本，包含 7 个分类 38 个问题

**维护者**: Xorigo UI Team
