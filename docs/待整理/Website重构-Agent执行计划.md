# 🤖 Website 重构 Agent 执行计划

**目标**：通过 `claude-flow hive-mind` 模式并行执行 Website 重构关键任务

**执行方式**：
```bash
claude-flow hive-mind --plan website-refactor-agents.yaml
```

---

## 📋 Agent 任务分组

### Group 1: 数据层基础建设（P0 - 最高优先级）

#### Agent 1.1: Data Layer Adapter Creator
**角色**: Backend Architect
**任务**: 创建只读数据适配层
```yaml
agent: data-layer-adapter
role: backend-architect
priority: P0
estimated_time: 8h
dependencies: []

tasks:
  - name: 创建 registry.readonly.ts
    file: src/data/registry.readonly.ts
    template: |
      - 实现 Singleton 模式的 ReadonlyRegistryAdapter
      - 从 @xorigo-ui/registry 读取 registry.json
      - 提供 getComponents(), getComponent(name), searchComponents(query) 方法
      - 集成 Zod Schema 验证

  - name: 创建 tokens.readonly.ts
    file: src/data/tokens.readonly.ts
    template: |
      - 实现 ReadonlyTokensAdapter
      - 从 @xorigo-ui/tokens 读取 tokens/*.json
      - 提供 getDesignTokens(), getSemanticTokens(), getStateTokens() 方法
      - 集成 DTCG Schema 验证

  - name: 创建 docs.readonly.ts
    file: src/data/docs.readonly.ts
    template: |
      - 实现 ReadonlyDocsAdapter
      - 读取 /docs/**/*.mdx
      - 提供 getDocsIndex(), getDoc(slug), searchDocs(query) 方法

  - name: 创建 i18n.readonly.ts
    file: src/data/i18n.readonly.ts
    template: |
      - 实现 ReadonlyI18nAdapter
      - 从 @xorigo-ui/i18n 读取 i18n/*.json
      - 提供 getTranslations(locale) 方法

validation:
  - 所有 adapter 使用 Singleton 模式
  - 所有数据访问带缓存（Map 或 WeakMap）
  - 所有方法返回 Promise（异步优先）
  - 完整的 TypeScript 类型定义
```

#### Agent 1.2: Schema Validator
**角色**: Quality Engineer
**任务**: 实现 Schema 验证和构建前校验
```yaml
agent: schema-validator
role: quality-engineer
priority: P0
estimated_time: 10h
dependencies: [data-layer-adapter]

tasks:
  - name: 创建 Zod Schema 定义
    file: src/schemas/registry.schema.ts
    template: |
      - 定义 ComponentSchema, RegistrySchema
      - 定义 DesignTokenSchema, SemanticTokenSchema
      - 定义 DocMetadataSchema

  - name: 实现构建前校验脚本
    file: scripts/validate-readonly-consistency.ts
    template: |
      - validateRegistryPaths(): 验证 registry.preview.module 路径存在
      - validateTokenSchema(): 验证 tokens/*.json 符合 DTCG 规范
      - validateDocsConsistency(): 验证文档链接有效性
      - 失败时 process.exit(1) 阻断构建

  - name: 配置 package.json prebuild 钩子
    file: package.json
    changes: |
      "scripts": {
        "prebuild": "tsx scripts/validate-readonly-consistency.ts",
        "build": "next build"
      }

validation:
  - 运行 npm run build 时自动触发验证
  - 验证失败时构建中断并显示详细错误
  - 提供友好的错误提示和修复建议
```

#### Agent 1.3: ESLint Rules Enforcer
**角色**: Security Engineer
**任务**: 配置 ESLint 规则强制数据入口收口
```yaml
agent: eslint-enforcer
role: security-engineer
priority: P0
estimated_time: 4h
dependencies: [data-layer-adapter]

tasks:
  - name: 配置 ESLint no-restricted-imports 规则
    file: .eslintrc.js
    changes: |
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['@xorigo-ui/registry', '@xorigo-ui/tokens', '@xorigo-ui/i18n'],
                message: '❌ 禁止直接导入上游数据包！请使用 src/data/*.readonly.ts 访问数据'
              }
            ]
          }
        ]
      }

  - name: 配置 path mapping
    file: tsconfig.json
    changes: |
      "compilerOptions": {
        "paths": {
          "@/data/*": ["./src/data/*"],
          "@/schemas/*": ["./src/schemas/*"]
        }
      }

validation:
  - 运行 npm run lint 检测违规直接导入
  - CI 集成 lint 检查并阻断违规 PR
```

---

### Group 2: 错误容忍机制（P0）

#### Agent 2.1: Error Boundary Implementer
**角色**: Frontend Architect
**任务**: 实现分层错误边界
```yaml
agent: error-boundary
role: frontend-architect
priority: P0
estimated_time: 6h
dependencies: []

tasks:
  - name: 创建 RootErrorBoundary
    file: src/components/errors/RootErrorBoundary.tsx
    template: |
      - 捕获全站级错误
      - 显示友好错误页面
      - 提供重试和返回首页按钮
      - 集成错误上报（可选）

  - name: 创建 PlaygroundErrorBoundary
    file: src/components/errors/PlaygroundErrorBoundary.tsx
    template: |
      - 隔离 Playground 错误，不影响全站
      - 显示示例加载失败提示
      - 提供重试机制
      - 记录错误日志到控制台

  - name: 创建 MDXErrorBoundary
    file: src/components/errors/MDXErrorBoundary.tsx
    template: |
      - 捕获 MDX 渲染错误
      - 显示文档加载失败提示
      - 提供降级显示（显示原始 Markdown）

  - name: 集成 ErrorBoundary 到页面
    file: src/app/layout.tsx
    changes: |
      - 在 Root Layout 包裹 RootErrorBoundary
      - 在 Playground 页面包裹 PlaygroundErrorBoundary
      - 在 Docs 页面包裹 MDXErrorBoundary

validation:
  - 模拟组件错误，验证错误边界工作
  - 验证错误不会导致全站崩溃
  - 验证用户友好的错误提示显示
```

---

### Group 3: RSC/Client 分层优化（P1）

#### Agent 3.1: RSC Page Optimizer
**角色**: Performance Engineer
**任务**: 优化 RSC 页面并移除客户端依赖
```yaml
agent: rsc-optimizer
role: performance-engineer
priority: P1
estimated_time: 12h
dependencies: [data-layer-adapter]

tasks:
  - name: 重构 /adoption 页面为 RSC
    file: src/app/adoption/page.tsx
    changes: |
      - 移除 useState/useEffect
      - 直接从 Data Layer 读取组件列表
      - 客户端筛选逻辑移至 Client Component
      - 使用 Suspense + Streaming 优化加载

  - name: 重构 /tokens 页面为 RSC
    file: src/app/tokens/page.tsx
    changes: |
      - 从 Data Layer 读取 tokens 数据
      - 服务端渲染 token 列表
      - 客户端交互（复制、切换）使用 Client Component

  - name: 重构 /themes 页面为 RSC
    file: src/app/themes/page.tsx
    changes: |
      - 服务端渲染主题预览
      - 主题切换逻辑使用 Client Component

validation:
  - 页面无 "use client" 指令（除必要交互组件）
  - 使用 React DevTools 验证 RSC 标记
  - 验证首屏加载无客户端 JavaScript 执行
```

#### Agent 3.2: Client Component Isolator
**角色**: Frontend Architect
**任务**: 隔离客户端交互组件
```yaml
agent: client-isolator
role: frontend-architect
priority: P1
estimated_time: 8h
dependencies: [rsc-optimizer]

tasks:
  - name: 创建 ComponentFilter (Client)
    file: src/components/adoption/ComponentFilter.client.tsx
    template: |
      "use client"
      - 组件筛选 UI
      - 使用 useState 管理筛选状态
      - 使用 useMemo 优化筛选性能（≤50ms）

  - name: 创建 TokenCopyButton (Client)
    file: src/components/tokens/TokenCopyButton.client.tsx
    template: |
      "use client"
      - 复制 token 值到剪贴板
      - 使用 Clipboard API
      - 显示复制成功 Toast

  - name: 创建 ThemeSwitch (Client)
    file: src/components/themes/ThemeSwitch.client.tsx
    template: |
      "use client"
      - 主题切换按钮
      - 使用 next-themes 管理主题状态
      - 持久化到 localStorage

validation:
  - 所有 Client Component 文件名以 .client.tsx 结尾
  - 所有 Client Component 顶部有 "use client" 指令
  - 最小化 Client Bundle Size
```

---

### Group 4: Playground 双模式架构（P1）

#### Agent 4.1: Playground Store Designer
**角色**: System Architect
**任务**: 设计 Playground Zustand Store
```yaml
agent: playground-store
role: system-architect
priority: P1
estimated_time: 10h
dependencies: []

tasks:
  - name: 创建 Zustand Store
    file: src/stores/playground.store.ts
    template: |
      - 定义 PlaygroundState 类型
      - 实现 Live Props 状态管理
      - 实现 Snapshot 管理（create/update/delete/list）
      - 实现 Compare Mode 状态管理
      - 集成 zustand/middleware (persist 到 localStorage)

  - name: 创建 Snapshot 类型定义
    file: src/types/playground.types.ts
    template: |
      interface Snapshot {
        id: string
        name: string
        componentName: string
        props: Record<string, any>
        timestamp: number
      }

      interface PlaygroundState {
        mode: 'live' | 'snapshot' | 'compare'
        liveProps: Record<string, any>
        snapshots: Snapshot[]
        compareIds: [string, string] | null
      }

validation:
  - Zustand Store 单元测试覆盖率 ≥ 80%
  - localStorage 持久化工作正常
  - 状态更新性能 ≤ 10ms
```

#### Agent 4.2: Playground UI Builder
**角色**: Frontend Architect
**任务**: 实现 Playground 双模式 UI
```yaml
agent: playground-ui
role: frontend-architect
priority: P1
estimated_time: 16h
dependencies: [playground-store]

tasks:
  - name: 创建 PlaygroundLiveMode
    file: src/components/playground/PlaygroundLiveMode.tsx
    template: |
      - 实时 Props 编辑器（基于组件 TypeScript 类型）
      - 组件预览区域（实时更新）
      - 代码生成区域（复制代码）
      - Token Inspector（分析使用的设计令牌）

  - name: 创建 PlaygroundSnapshotMode
    file: src/components/playground/PlaygroundSnapshotMode.tsx
    template: |
      - Snapshot 列表展示
      - 创建/更新/删除 Snapshot 按钮
      - Snapshot 预览卡片
      - 切换到 Compare Mode 按钮

  - name: 创建 PlaygroundCompareMode
    file: src/components/playground/PlaygroundCompareMode.tsx
    template: |
      - 双栏对比布局
      - 左右两个 Snapshot 预览
      - Props 差异高亮显示
      - Token 使用差异对比

validation:
  - 三种模式切换流畅无卡顿
  - Props 编辑响应时间 ≤ 100ms
  - Snapshot 操作无丢失数据
```

---

### Group 5: DX 增强层（P1）

#### Agent 5.1: CLI Tools Enhancer
**角色**: DevOps Engineer
**任务**: 增强 CLI 工具
```yaml
agent: cli-enhancer
role: devops-engineer
priority: P1
estimated_time: 12h
dependencies: [schema-validator]

tasks:
  - name: 实现 xorigo doctor 命令
    file: packages/cli/src/commands/doctor.ts
    template: |
      - 检查 Package 版本一致性
      - 检查 TypeScript 编译错误
      - 检查 ESLint 规则违规
      - 检查 Bundle Size 预算
      - 检查 Registry 一致性
      - 生成健康报告（带彩色输出）

  - name: 实现 xorigo sync docs 命令
    file: packages/cli/src/commands/sync-docs.ts
    template: |
      - 从 registry.json 读取组件列表
      - 基于 TypeScript 类型生成 Props 表
      - 生成组件示例代码
      - 更新搜索索引
      - 验证同步结果

  - name: 实现 xorigo check 命令
    file: packages/cli/src/commands/check.ts
    template: |
      - 运行 Schema 验证
      - 运行 a11y 检查
      - 运行性能检查
      - 汇总检查结果

validation:
  - 运行 npx xorigo doctor 生成完整报告
  - 运行 npx xorigo sync docs 自动更新文档
  - 运行 npx xorigo check 执行所有检查
```

#### Agent 5.2: Performance Dashboard Creator
**角色**: Performance Engineer
**任务**: 创建性能监控仪表板
```yaml
agent: perf-dashboard
role: performance-engineer
priority: P1
estimated_time: 10h
dependencies: []

tasks:
  - name: 创建 Status Dashboard 页面
    file: src/app/status/page.tsx
    template: |
      - 显示 Core Web Vitals (LCP, FID, CLS)
      - 显示 Bundle Size 预算使用情况
      - 显示 API 响应时间
      - 显示构建时间趋势

  - name: 创建 KPI Monitor 组件
    file: src/components/status/KPIMonitor.tsx
    template: |
      - 实时 Web Vitals 数据收集（next/web-vitals）
      - 性能指标可视化图表（Recharts）
      - 历史趋势分析
      - 性能预算超标告警

validation:
  - 访问 /status 页面显示完整仪表板
  - Web Vitals 数据实时更新
  - 图表渲染流畅（60fps）
```

---

### Group 6: 搜索性能优化（P1）

#### Agent 6.1: Search Index Builder
**角色**: Backend Architect
**任务**: 构建预编译搜索索引
```yaml
agent: search-indexer
role: backend-architect
priority: P1
estimated_time: 8h
dependencies: [data-layer-adapter]

tasks:
  - name: 实现构建时索引生成
    file: scripts/build-search-index.ts
    template: |
      - 从 Data Layer 读取所有可搜索内容
      - 使用 Fuse.js 构建搜索索引
      - 序列化索引到 public/search-index.json
      - 生成索引元数据（大小、项目数、构建时间）

  - name: 配置 package.json 构建钩子
    file: package.json
    changes: |
      "scripts": {
        "prebuild": "tsx scripts/build-search-index.ts && tsx scripts/validate-readonly-consistency.ts",
        "build": "next build"
      }

validation:
  - 构建后 public/search-index.json 存在
  - 索引大小 ≤ 500KB (gzip)
  - 索引包含所有组件、文档、令牌
```

#### Agent 6.2: Search UI Optimizer
**角色**: Frontend Architect
**任务**: 优化搜索 UI 性能
```yaml
agent: search-ui
role: frontend-architect
priority: P1
estimated_time: 6h
dependencies: [search-indexer]

tasks:
  - name: 创建高性能搜索组件
    file: src/components/search/SearchBox.client.tsx
    template: |
      "use client"
      - 使用 useDeferredValue 防抖搜索输入
      - 从 /search-index.json 加载预编译索引
      - 使用 useMemo 缓存搜索结果
      - 高亮匹配关键词
      - 搜索响应时间 ≤ 50ms

  - name: 创建搜索结果页面
    file: src/app/search/page.tsx
    template: |
      - 使用 Suspense 优化加载
      - 分页显示搜索结果（每页20条）
      - 按类型分组（组件/文档/令牌）
      - 高级筛选器（类型、标签、依赖）

validation:
  - 搜索 1000 项数据 ≤ 50ms
  - 搜索 UI 无卡顿
  - 搜索结果准确率 ≥ 90%
```

---

## 🎯 执行计划

### Phase 1: 基础建设（Week 1-2）
**并行执行**:
- Agent 1.1: Data Layer Adapter Creator
- Agent 1.2: Schema Validator
- Agent 1.3: ESLint Rules Enforcer
- Agent 2.1: Error Boundary Implementer

**验收标准**:
- ✅ 所有 Data Layer Adapter 创建完成并通过测试
- ✅ 构建前校验脚本工作正常
- ✅ ESLint 规则强制执行
- ✅ 分层错误边界实现并测试

### Phase 2: 页面优化（Week 3-4）
**并行执行**:
- Agent 3.1: RSC Page Optimizer
- Agent 3.2: Client Component Isolator
- Agent 6.1: Search Index Builder
- Agent 6.2: Search UI Optimizer

**验收标准**:
- ✅ /adoption, /tokens, /themes 页面重构为 RSC
- ✅ 客户端交互组件正确隔离
- ✅ 搜索索引预编译完成
- ✅ 搜索性能达标（≤50ms）

### Phase 3: DX 增强（Week 5-6）
**并行执行**:
- Agent 4.1: Playground Store Designer
- Agent 4.2: Playground UI Builder
- Agent 5.1: CLI Tools Enhancer
- Agent 5.2: Performance Dashboard Creator

**验收标准**:
- ✅ Playground 双模式完整实现
- ✅ xorigo doctor/sync/check 命令可用
- ✅ /status 性能仪表板上线

---

## 📊 执行监控

### KPI 目标

| 指标 | 当前值 | 目标值 | 验收方式 |
|------|--------|--------|----------|
| **数据入口收口** | ❌ 0/4 | ✅ 4/4 | 所有 Data Layer Adapter 存在 |
| **构建前校验** | ❌ 无 | ✅ 有 | prebuild 钩子工作 |
| **错误边界** | ❌ 0/3 | ✅ 3/3 | 3个 ErrorBoundary 实现 |
| **RSC 页面** | ⚠️ 2/5 | ✅ 5/5 | 5个页面无 "use client" |
| **搜索性能** | ⚠️ ~200ms | ✅ ≤50ms | 1000项筛选 ≤50ms |
| **Bundle Size** | ⚠️ 180KB | ✅ ≤120KB | Lighthouse 报告 |
| **Playground 模式** | ❌ 0/3 | ✅ 3/3 | Live/Snapshot/Compare 可用 |

### 风险监控

| 风险 | 缓解措施 | 负责 Agent |
|------|----------|-----------|
| **数据漂移** | 构建前校验 + ESLint 规则 | Agent 1.2, 1.3 |
| **性能退化** | Bundle Analyzer + Web Vitals 监控 | Agent 5.2 |
| **类型安全** | TypeScript 严格模式 + Zod 验证 | Agent 1.2 |
| **用户体验** | ErrorBoundary + 性能预算 | Agent 2.1, 3.1 |

---

## 🚀 快速开始

### 1. 准备环境
```bash
cd /home/saken/project/Xorigo-UI/apps/website
npm install
```

### 2. 执行 Hive-Mind
```bash
# 方式1: 执行完整计划（推荐）
claude-flow hive-mind --plan docs/待整理/Website重构-Agent执行计划.md --phase all

# 方式2: 分阶段执行
claude-flow hive-mind --plan docs/待整理/Website重构-Agent执行计划.md --phase 1
claude-flow hive-mind --plan docs/待整理/Website重构-Agent执行计划.md --phase 2
claude-flow hive-mind --plan docs/待整理/Website重构-Agent执行计划.md --phase 3

# 方式3: 执行单个 Agent
claude-flow agent --config agent-1.1-data-layer-adapter.yaml
```

### 3. 验收测试
```bash
# Phase 1 验收
npm run build          # 验证构建前校验工作
npm run lint           # 验证 ESLint 规则强制执行
npm test               # 验证单元测试通过

# Phase 2 验收
npm run build          # 验证 RSC 页面构建成功
npm run analyze        # 验证 Bundle Size 达标

# Phase 3 验收
npx xorigo doctor      # 验证健康检查命令
npx xorigo sync docs   # 验证文档同步命令
npm run dev            # 验证 Playground 双模式工作
```

---

## 📚 参考文档

- **架构设计**: `Website重构架构设计方案.md`
- **实施清单**: `Website重构实施清单.md`
- **最佳实践**: `Website重构最佳实践和规则.md`
- **快速开始**: `Website重构快速开始指南.md`
- **验收标准**: `Website-Packages 联动架构验收清单.md`

---

## 🔧 Troubleshooting

### 问题: Agent 执行失败
**解决**:
1. 检查 Agent 依赖是否已完成
2. 查看详细错误日志
3. 手动修复依赖问题后重新执行

### 问题: 构建前校验阻断
**解决**:
1. 查看校验错误详情
2. 修复 registry.json 或 tokens/*.json 问题
3. 重新运行 npm run build

### 问题: Bundle Size 超标
**解决**:
1. 运行 npm run analyze 查看体积报告
2. 使用 dynamic import 拆分大组件
3. 移除未使用的依赖

---

**最后更新**: 2025-10-13
**维护者**: Xorigo UI Architecture Team
**版本**: v1.0.0
