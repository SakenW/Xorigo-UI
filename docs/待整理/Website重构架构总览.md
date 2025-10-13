# 📖 Xorigo UI Website 重构架构总览

> **版本**: v2.0.0
> **创建时间**: 2025-10-13
> **文档集合**: 架构设计 + 实施清单 + 数据流图

---

## 📚 文档导航

### 核心文档

1. **[Xorigo UI Website 架构白皮书](./Xorigo%20UI%20Website%20架构白皮书.md)** (v1.1.0)
   - 原始需求和架构定义
   - 七轴架构理念
   - P0-P2 功能规范
   - KPI 指标体系

2. **[Website 重构架构设计方案](./Website重构架构设计方案.md)** (v2.0.0) ⭐
   - **完整目录结构设计** (新建/重构/废弃路径)
   - **数据层架构** (只读适配层 + SDK 层)
   - **页面层架构** (RSC/Client 分离策略)
   - **Playground 双模式** (Live Props + Snapshot)
   - **DX 增强层** (CLI 工具 + 监控仪表板)
   - **性能优化策略** (Bundle 分析 + ISR 配置)
   - **渐进式迁移路径** (8 个 Phase，16 周)

3. **[Website 重构实施清单](./Website重构实施清单.md)** (v2.0.0) ✅
   - **Phase 1-8 详细任务** (16 周完整清单)
   - **每周执行计划** (具体任务分解)
   - **验收标准** (技术指标 + 功能完整性)
   - **进度追踪** (里程碑 + 检查点)

4. **[Website 架构数据流和交互图](./Website架构数据流和交互图.md)** (v2.0.0) 🔄
   - **完整系统数据流图** (四层架构)
   - **Playground 数据流** (双模式交互)
   - **搜索系统架构** (Fuse.js 引擎)
   - **Adoption Matrix 筛选流程** (性能优化)
   - **主题系统流程** (URL 参数化)
   - **错误处理策略** (分层错误边界)
   - **性能监控流程** (指标收集)
   - **CI/CD 流程** (构建部署)

---

## 🎯 架构核心原则

### 数据层原则

```yaml
只读数据源:
  原则: 所有内容来自 packages/ (registry/tokens/templates/docs/i18n)
  唯一入口: src/data/*.readonly.ts
  校验机制: 构建前强制校验，失败阻断

适配层设计:
  Registry 适配器: registry.readonly.ts
  Tokens 适配器: tokens.readonly.ts
  Docs 适配器: docs.readonly.ts
  一致性校验: validation.ts

SDK 协议层:
  Registry Client: registry-client.ts
  Tokens Client: tokens-client.ts
  Docs Client: docs-client.ts
  缓存策略: Map-based client cache
```

### 渲染层原则

```yaml
RSC 优先:
  适用页面: Docs/Adoption/Token/Theme
  渲染策略: RSC + ISR (10 min)
  数据访问: 直接访问 Data Layer (服务端)

Client 隔离:
  适用页面: Playground/Search
  渲染策略: Client Only + 动态导入
  数据访问: 通过 SDK 访问 API Routes (客户端)

体积预算:
  站点基础: ≤ 120KB gzip
  Playground: ≤ 150KB gzip
  单页最大: ≤ 50KB gzip
```

### DX 增强原则

```yaml
CLI 工具链:
  Doctor: 健康检查和问题诊断
  Sync: 自动同步文档到 Website
  Check: 运行所有检查 (schema/a11y/performance)

监控仪表板:
  Performance Metrics: LCP/FCP/CLS/FID
  Bundle Analyzer: 体积分析和预算对比
  A11y Report: 可访问性报告和评分
  Build Health: 构建和部署健康状态

构建校验:
  prebuild: 数据一致性校验
  postbuild: Bundle 大小检查
  失败阻断: 校验失败立即退出
```

---

## 🏗️ 四层架构设计

### Layer 4: Packages (只读源)

```
packages/
├── registry/          # 组件注册表
│   └── registry.json
├── tokens/            # 设计令牌
│   └── src/*.json
├── core/              # 组件实现
│   └── src/components/*.tsx
├── docs/              # 文档内容
│   └── *.mdx
├── cli/               # CLI 工具
│   └── templates/
└── i18n/              # 国际化
    └── *.json
```

**职责**: 提供唯一的数据源，不可写入

### Layer 3: Data Layer (适配层)

```
apps/website/src/data/
├── registry.readonly.ts    # Registry 适配器 (单例模式)
├── tokens.readonly.ts      # Tokens 适配器 (单例模式)
├── docs.readonly.ts        # Docs 适配器 (单例模式)
├── validation.ts           # 一致性校验 (构建阻断)
└── types.ts                # Zod Schema + TypeScript 类型
```

**职责**:
- 提供唯一的数据访问入口
- 执行 Schema 验证和一致性校验
- 构建前强制校验，失败阻断

### Layer 2: SDK Layer (协议层)

```
apps/website/src/lib/sdk/
├── registry-client.ts      # Registry SDK (客户端缓存)
├── tokens-client.ts        # Tokens SDK (客户端缓存)
├── docs-client.ts          # Docs SDK (客户端缓存)
├── cache.ts                # 缓存策略 (Map-based)
└── types.ts                # SDK 类型定义
```

**职责**:
- 提供统一的客户端数据访问协议
- 实现客户端缓存策略
- 类型安全的 API 接口

### Layer 1: App Layer (展示层)

```
apps/website/src/app/
├── (marketing)/            # 营销页面组 (RSC)
│   ├── page.tsx            # 首页
│   └── features/page.tsx   # 特性页
│
├── docs/                   # 文档页面 (RSC)
│   ├── [[...slug]]/page.tsx
│   └── layout.tsx
│
├── adoption/               # Adoption Matrix (RSC + Client Filter)
│   ├── page.tsx
│   ├── [component]/page.tsx
│   └── layout.tsx
│
├── playground/             # Playground (Client Only)
│   ├── [component]/page.tsx
│   └── layout.tsx
│
├── tokens/                 # Tokens Hub (RSC)
│   ├── page.tsx
│   ├── [category]/page.tsx
│   └── schema/page.tsx
│
├── themes/                 # Theme Hub (RSC + Client Preview)
│   ├── page.tsx
│   ├── [theme]/page.tsx
│   └── layout.tsx
│
├── search/                 # Search (RSC + Client Search)
│   └── page.tsx
│
├── dx/                     # DX Dashboard (RSC + Client)
│   ├── page.tsx
│   ├── performance/page.tsx
│   └── a11y/page.tsx
│
└── api/                    # API Routes
    ├── registry/route.ts
    ├── tokens/route.ts
    ├── docs/route.ts
    └── search/route.ts
```

**职责**:
- RSC 页面: 服务端渲染，直接访问 Data Layer
- Client 页面: 客户端渲染，通过 SDK 访问 API Routes
- API Routes: 提供 RESTful 接口，桥接 Data Layer 和 SDK Layer

---

## 🎮 核心功能模块

### 1. Playground 双模式

**Live Props 模式** (实时编辑):
- 实时属性编辑器 (Props Editor)
- 主题编辑器 (Theme Editor)
- 令牌检查器 (Token Inspector)
- 组件预览 (Component Preview)
- 代码查看器 (Code Viewer)

**Snapshot 模式** (快照管理):
- 快照管理器 (Snapshot Manager)
- 快照保存/加载/删除
- 对比模式 (Compare Mode)
- 差异分析 (Diff Viewer)

**状态管理** (Zustand):
```typescript
interface PlaygroundStore {
  // 主题状态
  currentTheme: string
  currentDensity: 'compact' | 'modern' | 'spacious'
  currentRtl: boolean
  themeState: ThemeState

  // 组件状态
  selectedComponent: ComponentConfig | null
  componentProps: Record<string, any>

  // 快照管理
  snapshots: ThemeSnapshot[]
  currentSnapshot: string | null

  // 历史管理
  history: ThemeSnapshot[]
  historyIndex: number

  // 编辑模式
  editMode: 'live' | 'snapshot'
  compareMode: boolean
}
```

### 2. Adoption Matrix

**功能特性**:
- 组件矩阵展示 (Component Matrix)
- 高级筛选面板 (Filter Panel)
  - 类别筛选 (Category)
  - 标签筛选 (Tags)
  - 依赖筛选 (Dependencies)
  - 特性筛选 (A11y/RTL/I18n)
- 组件卡片 (Component Card)
- 依赖关系图 (Dependency Graph)
- 令牌使用标记 (Token Usage Badge)
- 可访问性评分 (A11y Score)

**性能优化**:
- 多条件并行筛选 (≤ 50ms for 1k items)
- Memoization 结果缓存
- Virtual List 虚拟滚动

### 3. Tokens Hub

**可视化组件**:
- 颜色令牌: Color Swatch + WCAG 对比度检查
- 间距令牌: Visual Ruler + 相对比例
- 字体令牌: Typography Preview
- 阴影令牌: Shadow Preview
- 动画令牌: Motion Preview

**Schema 功能**:
- Schema Viewer (结构可视化)
- Version Governance (版本治理)
- Token Dependency Graph (依赖关系图)
- Token Usage Stats (使用统计)

### 4. Theme Hub

**功能特性**:
- Theme Switcher (主题切换器)
- Density Control (密度控制)
- Mode Control (亮暗模式)
- RTL Toggle (RTL 切换)
- Theme Preview (主题预览)

**URL 参数化**:
```
?theme=dark&density=compact&rtl=true
```
- 状态编码到 URL
- URL 状态同步
- 分享主题配置

### 5. 全局搜索

**Cmd+K 搜索面板**:
- 快捷键触发 (Cmd+K / Ctrl+K)
- 实时搜索 (Debounce 300ms)
- 搜索高亮
- 键盘导航

**搜索引擎** (Fuse.js):
- 搜索索引 (Components/Docs/Tokens)
- 搜索权重配置
- 搜索结果排序
- 性能目标: ≤ 200ms

**搜索筛选**:
- 类别筛选
- 标签筛选
- 日期筛选
- 结果限制

### 6. DX Dashboard

**监控指标**:
- Performance Metrics (LCP/FCP/CLS/FID)
- Bundle Analyzer (体积分析)
- A11y Report (可访问性报告)
- Build Health (构建健康)

**CLI 工具**:
- `npx xorigo doctor` - 健康检查
- `npx xorigo sync docs` - 文档同步
- `npx xorigo check` - 运行所有检查

---

## 📊 数据流核心模式

### RSC 页面数据流

```
Packages (registry.json)
  ↓ 构建时读取
Data Layer (registry.readonly.ts)
  ↓ Schema 验证
Data Layer (validation.ts)
  ↓ 一致性校验
RSC Page (app/docs/page.tsx)
  ↓ 服务端渲染
User (浏览器)
```

### Client 页面数据流

```
Packages (registry.json)
  ↓ 构建时读取
Data Layer (registry.readonly.ts)
  ↓ Schema 验证
API Route (/api/registry)
  ↓ API 响应
SDK Layer (registry-client.ts)
  ↓ 客户端缓存
Client Page (app/playground/page.tsx)
  ↓ 客户端渲染
User (浏览器)
```

### Playground 状态流

```
User (编辑 Props)
  ↓ 用户操作
Zustand Store (updateComponentProp)
  ↓ 状态更新
Live Props Editor
  ↓ 订阅状态
Component Preview
  ↓ 实时渲染
User (查看效果)
```

### 搜索数据流

```
User (Cmd+K)
  ↓ 快捷键
Search Input (输入关键词)
  ↓ Debounce 300ms
Search Store (searchQuery)
  ↓ 搜索请求
Search API (/api/search)
  ↓ Fuse.js 搜索
Search Results (高亮显示)
  ↓ 结果展示
User (查看结果)
```

---

## 🚀 渐进式迁移路径

### Phase 1: 数据层重构 (Week 1-2)

**目标**: 建立只读数据适配层和 SDK 层

**关键任务**:
- 创建 `src/data/*.readonly.ts` 适配器
- 实现 Schema 验证和一致性校验
- 创建 `src/lib/sdk/` 客户端协议
- 配置构建前校验脚本
- 配置 ESLint 规则禁止直接访问 packages/

**验证标准**:
- ✅ 所有数据访问通过适配层
- ✅ 构建前校验正常运行
- ✅ 一致性校验通过

### Phase 2: 页面层重构 (Week 3-4)

**目标**: 重构现有页面为 RSC/Client 分离架构

**关键任务**:
- 重构首页为 RSC
- 迁移 gallery/ → adoption/
- 迁移 matrix/ → adoption/
- 重构 playground/ 为 Client Only
- 创建错误边界组件

**验证标准**:
- ✅ RSC 页面无浏览器 API 使用
- ✅ Client 组件正确动态导入
- ✅ 性能预算达标

### Phase 3: Playground 双模式 (Week 5-6)

**目标**: 实现 Live Props + Snapshot 双模式

**关键任务**:
- 创建 Zustand Playground Store
- 实现 Live Props Editor
- 实现 Snapshot Manager
- 实现 Compare Mode
- 实现 Token Inspector

**验证标准**:
- ✅ 实时编辑器正常工作
- ✅ 快照保存/加载正常
- ✅ 对比模式正常显示

### Phase 4: DX 增强层 (Week 7-8)

**目标**: 完善 CLI 工具和监控仪表板

**关键任务**:
- 实现 Doctor 命令
- 实现 Sync 命令
- 实现 Check 命令
- 创建 DX 监控仪表板
- 配置性能监控

**验证标准**:
- ✅ CLI 工具正常工作
- ✅ 自动同步正常
- ✅ 仪表板显示正确

### Phase 5: Tokens/Theme Hub (Week 9-10)

**目标**: 完善 Tokens 和 Theme Hub 功能

**关键任务**:
- 创建 Tokens Browser
- 实现 Token Visualization
- 实现 Schema Viewer
- 创建 Theme Switcher
- 实现 URL 参数化共享

**验证标准**:
- ✅ 令牌可视化正确
- ✅ 主题切换正常
- ✅ URL 分享正常

### Phase 6: 文档和搜索 (Week 11-12)

**目标**: 完善文档渲染和全局搜索

**关键任务**:
- 重构 Docs 页面 (MDX 渲染)
- 实现 Cmd+K 搜索面板
- 实现搜索高亮
- 实现相关组件推荐
- 优化搜索性能

**验证标准**:
- ✅ 文档渲染正常
- ✅ 搜索响应时间 ≤ 200ms
- ✅ 搜索结果准确

### Phase 7: 性能优化和测试 (Week 13-14)

**目标**: 达到性能目标和测试覆盖

**关键任务**:
- Bundle 体积优化
- 图片资源优化
- ISR 配置优化
- 编写 E2E 测试
- 可访问性测试

**验证标准**:
- ✅ LCP ≤ 2.5s (3G)
- ✅ 站点 ≤ 120KB gzip
- ✅ Playground ≤ 150KB gzip
- ✅ 可访问性 WCAG 2.1 AA

### Phase 8: 部署和监控 (Week 15-16)

**目标**: 生产环境部署和监控配置

**关键任务**:
- Vercel 部署配置
- CDN 配置
- 监控告警配置
- 日志收集配置
- 文档更新

**验证标准**:
- ✅ 生产环境正常运行
- ✅ 监控数据正常
- ✅ 告警正常触发

---

## 📈 KPI 指标体系

### 性能指标

```yaml
首屏性能:
  LCP (3G): ≤ 2.5s
  FCP: ≤ 1.8s
  TTFB: ≤ 800ms
  CLS: ≤ 0.05
  FID: ≤ 100ms

交互性能:
  Adoption 筛选: ≤ 50ms (1k 项)
  搜索响应: ≤ 200ms
  Playground 渲染: ≤ 100ms
  主题切换: ≤ 50ms

体积预算:
  站点基础: ≤ 120KB gzip
  Playground: ≤ 150KB gzip
  单页最大: ≤ 50KB gzip
  图片最大: ≤ 200KB
```

### 可用性指标

```yaml
可访问性:
  WCAG 2.1 AA: 严重/中等问题 0
  键盘导航: 100% 支持
  屏幕阅读器: 100% 兼容
  焦点可见: 100% 清晰

稳定性:
  示例加载成功率: ≥ 99%
  API 可用性: ≥ 99.9%
  构建成功率: ≥ 95%
  部署成功率: ≥ 98%
```

### 内容质量指标

```yaml
文档质量:
  文档覆盖率: 100% 组件有文档
  示例完整性: 100% 组件有示例
  Props 表完整性: 100% 组件有 Props 表
  链接有效性: 100% 有效

数据一致性:
  Registry 一致性: 100%
  Tokens 一致性: 100%
  Schema 合规性: 100%
  依赖正确性: 100%
```

---

## ⚠️ 风险管理

### 风险 1: Registry/Tokens 产物与 Website 不同步

**缓解措施**:
- 构建前强制校验 (scripts/validate-readonly-consistency.ts)
- 失败阻断构建 (process.exit(1))
- 自动生成差异报告 (printValidationReport)
- 监控产物变更并自动重建

### 风险 2: RSC 水合不一致

**缓解措施**:
- ESLint 规则检查禁用项 (no-window-in-rsc)
- 禁用浏览器 API 使用 (window/document/localStorage)
- 禁用 React Hooks (useEffect/useState)
- 动态导入 Client 组件 (dynamic() + ssr: false)

### 风险 3: 体积膨胀超出预算

**缓解措施**:
- 路由级分包配置 (webpack splitChunks)
- Bundle Analyzer 监控 (@next/bundle-analyzer)
- 构建后体积检查 (scripts/check-bundle-size.ts)
- 超限阻断构建 (process.exit(1))

### 风险 4: 文档渲染错误导致页面崩溃

**缓解措施**:
- 分层错误边界 (Global/Page/Component/MDX)
- 友好错误提示 (Error Fallback UI)
- 重试机制 (Reset Error State)
- 降级显示 (Skeleton Loader)

### 风险 5: 搜索性能下降

**缓解措施**:
- 前端搜索引擎 (Fuse.js)
- 搜索索引优化 (权重配置)
- 防抖处理 (Debounce 300ms)
- 结果分页 (最大 50 条)

---

## 🛠️ 开发工具链

### CLI 工具

```bash
# 健康检查
npx xorigo doctor              # 运行所有健康检查
npx xorigo doctor --fix        # 自动修复发现的问题

# 文档同步
npx xorigo sync docs           # 同步组件文档到 Website
npx xorigo sync docs --watch   # 监听模式，自动同步

# 质量检查
npx xorigo check               # 运行所有检查 (schema/a11y/performance)

# 其他工具
npx xorigo generate props-table  # 生成组件 Props 表
npx xorigo optimize              # 性能优化建议
```

### 构建脚本

```json
{
  "scripts": {
    "prebuild": "tsx scripts/validate-readonly-consistency.ts",
    "build": "next build",
    "postbuild": "tsx scripts/check-bundle-size.ts",

    "dev": "next dev",
    "start": "next start",

    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",

    "test": "vitest",
    "test:coverage": "vitest --coverage",

    "check:all": "npm run lint && npm run type-check && npm run doctor"
  }
}
```

---

## 📝 后续规划

### 短期 (3-6 个月)

- 完成 Phase 1-8 重构 (16 周)
- 达到性能和质量目标
- 生产环境稳定运行
- 监控体系完善

### 中期 (6-12 个月)

- Algolia DocSearch 集成
- Storybook 集成
- 更多组件和示例
- 国际化完善

### 长期 (12 个月+)

- 主题编辑器
- 组件市场
- 在线协作
- 社区贡献平台

---

## 🎓 学习资源

### 推荐阅读

1. **Next.js 15 文档**
   - App Router: https://nextjs.org/docs/app
   - React Server Components: https://nextjs.org/docs/app/building-your-application/rendering/server-components
   - ISR: https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration

2. **Zustand 文档**
   - Getting Started: https://zustand-demo.pmnd.rs/
   - Persist Middleware: https://github.com/pmndrs/zustand#persist-middleware

3. **Fuse.js 文档**
   - Fuzzy Search: https://fusejs.io/
   - API Reference: https://fusejs.io/api/options.html

4. **性能优化**
   - Web Vitals: https://web.dev/vitals/
   - Bundle Analyzer: https://www.npmjs.com/package/@next/bundle-analyzer

5. **可访问性**
   - WCAG 2.1: https://www.w3.org/WAI/WCAG21/quickref/
   - axe-core: https://github.com/dequelabs/axe-core

---

## 📞 支持和反馈

### 团队联系

- **架构设计**: Xorigo UI Architecture Team
- **技术支持**: Xorigo UI Dev Team
- **问题反馈**: GitHub Issues

### 文档更新

- **版本**: v2.0.0
- **最后更新**: 2025-10-13
- **下次审查**: 2025-11-13 (每月更新)

---

**文档维护**: Xorigo UI Architecture Team
**版本**: v2.0.0
**状态**: 架构设计完成，等待实施
**预计完成**: 2026-02-13 (16 周后)
