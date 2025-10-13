# ✅ Xorigo UI Website 重构实施清单

> **基于**: Website 重构架构设计方案 v2.0.0
> **创建时间**: 2025-10-13
> **实施周期**: 16 周 (4 个月)

---

## 📋 Phase 1: 数据层重构 (Week 1-2)

### Week 1: 只读数据适配层

**目标**: 建立 src/data/*.readonly.ts 唯一数据入口

- [ ] **创建数据层目录结构**
  ```bash
  mkdir -p apps/website/src/data
  ```

- [ ] **实现 Registry 只读适配器**
  - [ ] 创建 `src/data/registry.readonly.ts`
  - [ ] 实现 `RegistryReadonlyAdapter` 单例模式
  - [ ] 实现 `getComponents()`, `getComponent()`, `searchByTags()` 方法
  - [ ] 实现 `validateConsistency()` 一致性校验方法
  - [ ] 验证 preview.module 路径存在性
  - [ ] 验证组件依赖关系完整性

- [ ] **实现 Tokens 只读适配器**
  - [ ] 创建 `src/data/tokens.readonly.ts`
  - [ ] 实现 `TokensReadonlyAdapter` 单例模式
  - [ ] 实现 `getDesignTokens()`, `getSemanticTokens()` 方法
  - [ ] 实现 `getThemeTokens()`, `getThemeList()` 方法
  - [ ] 实现语义令牌引用验证

- [ ] **实现 Docs 只读适配器**
  - [ ] 创建 `src/data/docs.readonly.ts`
  - [ ] 实现文档索引读取
  - [ ] 实现文档内容读取
  - [ ] 实现文档搜索功能

- [ ] **实现统一验证层**
  - [ ] 创建 `src/data/validation.ts`
  - [ ] 实现 `validateAllConsistency()` 方法
  - [ ] 实现 `printValidationReport()` 报告输出
  - [ ] 集成所有适配器的校验方法

- [ ] **创建数据层类型定义**
  - [ ] 创建 `src/data/types.ts`
  - [ ] 定义 Zod Schema: `RegistrySchema`, `TokensSchema`
  - [ ] 定义 TypeScript 类型: `Component`, `ValidationResult`
  - [ ] 导出所有数据层类型

### Week 2: SDK 层和构建校验

**目标**: 实现 SDK 协议层和构建前校验

- [ ] **创建 Website SDK 层**
  ```bash
  mkdir -p apps/website/src/lib/sdk
  ```

- [ ] **实现 Registry Client**
  - [ ] 创建 `src/lib/sdk/registry-client.ts`
  - [ ] 实现客户端缓存策略 (Map)
  - [ ] 实现 `getComponents()`, `getComponent()` 方法
  - [ ] 实现 `searchComponents()`, `getComponentsByCategory()` 方法
  - [ ] 导出单例 `registryClient`

- [ ] **实现 Tokens Client**
  - [ ] 创建 `src/lib/sdk/tokens-client.ts`
  - [ ] 实现客户端缓存策略
  - [ ] 实现 `getDesignTokens()`, `getSemanticTokens()` 方法
  - [ ] 实现 `getThemeTokens()`, `getThemeList()` 方法
  - [ ] 导出单例 `tokensClient`

- [ ] **实现 Docs Client**
  - [ ] 创建 `src/lib/sdk/docs-client.ts`
  - [ ] 实现文档索引获取
  - [ ] 实现文档内容获取
  - [ ] 实现文档搜索功能

- [ ] **配置构建前校验**
  - [ ] 创建 `scripts/validate-readonly-consistency.ts`
  - [ ] 调用 `validateAllConsistency()` 执行校验
  - [ ] 校验失败时阻断构建 (process.exit(1))
  - [ ] 更新 package.json: `"prebuild": "tsx scripts/validate-readonly-consistency.ts"`

- [ ] **配置 ESLint 规则**
  - [ ] 更新 `.eslintrc.js`
  - [ ] 添加 `no-restricted-imports` 规则
  - [ ] 禁止直接 import `@xorigo-ui/registry`, `@xorigo-ui/tokens`
  - [ ] 强制使用 `src/data/*.readonly.ts` 访问数据

- [ ] **Phase 1 验证**
  - [ ] 运行 `npm run prebuild` 校验通过
  - [ ] 所有数据访问通过适配层
  - [ ] ESLint 规则正常工作
  - [ ] 无直接访问 packages/ 的代码

---

## 📋 Phase 2: 页面层重构 (Week 3-4)

### Week 3: RSC 页面重构

**目标**: 重构现有页面为 RSC 架构

- [ ] **创建营销页面组**
  ```bash
  mkdir -p apps/website/src/app/\(marketing\)
  ```

- [ ] **重构首页为 RSC**
  - [ ] 创建 `app/(marketing)/page.tsx`
  - [ ] 使用 `readonlyRegistry.getComponents()` 服务端获取数据
  - [ ] 创建 HeroSection 组件 (RSC)
  - [ ] 创建 FeaturesSection 组件 (RSC)
  - [ ] 创建 ComponentShowcase 组件 (RSC)
  - [ ] 验证无浏览器 API 使用

- [ ] **创建 Adoption Matrix 页面**
  ```bash
  mkdir -p apps/website/src/app/adoption
  mkdir -p apps/website/src/components/adoption
  ```
  - [ ] 创建 `app/adoption/page.tsx` (RSC + Client Filter)
  - [ ] 创建 `components/adoption/component-matrix.tsx` (Client)
  - [ ] 创建 `components/adoption/filter-panel.tsx` (Client)
  - [ ] 创建 `components/adoption/component-card.tsx`
  - [ ] 实现高级筛选功能
  - [ ] 验证筛选性能 ≤ 50ms (1k 项)

- [ ] **迁移 gallery/ 和 matrix/ 到 adoption/**
  - [ ] 迁移 gallery/page.tsx 逻辑
  - [ ] 迁移 matrix/page.tsx 逻辑
  - [ ] 合并重复功能
  - [ ] 删除旧页面: `app/gallery/`, `app/matrix/`
  - [ ] 删除旧组件: `components/gallery/`, `components/matrix/`

- [ ] **重构 Docs 页面**
  - [ ] 创建 `app/docs/[[...slug]]/page.tsx` (RSC)
  - [ ] 创建 `components/docs/mdx-components.tsx`
  - [ ] 创建 `components/docs/table-of-contents.tsx`
  - [ ] 创建 `components/docs/breadcrumb.tsx`
  - [ ] 实现 MDX 渲染 (next-mdx-remote)
  - [ ] 验证文档渲染正常

### Week 4: Client 页面和错误边界

**目标**: 重构 Playground 和实现错误边界

- [ ] **重构 Playground 为 Client Only**
  - [ ] 创建 `app/playground/[component]/page.tsx`
  - [ ] 使用 `dynamic()` 动态导入 PlaygroundClient
  - [ ] 设置 `ssr: false` 禁用 SSR
  - [ ] 创建 PlaygroundSkeleton 加载组件
  - [ ] 验证 Playground 正常加载

- [ ] **创建错误边界组件**
  ```bash
  mkdir -p apps/website/src/components/errors
  ```
  - [ ] 创建 `components/errors/global-error-boundary.tsx`
  - [ ] 创建 `components/errors/page-error-boundary.tsx`
  - [ ] 创建 `components/errors/mdx-error-boundary.tsx`
  - [ ] 创建 `components/errors/playground-error-boundary.tsx`
  - [ ] 创建 `components/errors/error-fallback.tsx`
  - [ ] 集成到各页面

- [ ] **创建布局组件**
  ```bash
  mkdir -p apps/website/src/components/layout
  ```
  - [ ] 创建 `components/layout/site-header.tsx`
  - [ ] 创建 `components/layout/site-footer.tsx`
  - [ ] 创建 `components/layout/sidebar.tsx`
  - [ ] 创建 `components/layout/mobile-nav.tsx`
  - [ ] 创建 `components/layout/skip-nav-link.tsx` (WCAG)

- [ ] **更新 Root Layout**
  - [ ] 重构 `app/layout.tsx`
  - [ ] 创建 `app/providers.tsx`
  - [ ] 集成 ThemeProvider, ConfigProvider
  - [ ] 集成 A11yProvider, ZLayerProvider
  - [ ] 添加 SkipNavLink

- [ ] **Phase 2 验证**
  - [ ] 所有 RSC 页面无浏览器 API 使用
  - [ ] Client 组件正确动态导入
  - [ ] 错误边界正常工作
  - [ ] 布局组件正常显示

---

## 📋 Phase 3: Playground 双模式 (Week 5-6)

### Week 5: Zustand Store 和 Live Props

**目标**: 实现 Playground Store 和实时编辑器

- [ ] **创建 Zustand Store**
  ```bash
  mkdir -p apps/website/src/stores
  ```

- [ ] **实现 Playground Store**
  - [ ] 创建 `stores/playground.ts`
  - [ ] 定义状态接口: `PlaygroundState`, `PlaygroundActions`
  - [ ] 实现主题操作: `setThemeState()`, `setDensity()`, `setRtl()`
  - [ ] 实现组件操作: `selectComponent()`, `updateComponentProp()`
  - [ ] 实现快照操作: `saveSnapshot()`, `loadSnapshot()`, `deleteSnapshot()`
  - [ ] 实现历史操作: `undo()`, `redo()`, `reset()`
  - [ ] 配置 Zustand Persist 中间件

- [ ] **创建 Live Props Editor**
  ```bash
  mkdir -p apps/website/src/components/playground
  ```
  - [ ] 创建 `components/playground/live-props-editor.tsx`
  - [ ] 实现 Props 编辑面板
  - [ ] 实现 Theme 编辑面板
  - [ ] 实现 Tokens 检查面板
  - [ ] 集成 Playground Store

- [ ] **实现属性编辑器**
  - [ ] 创建 `components/playground/props-editor.tsx`
  - [ ] 支持基础类型: string, number, boolean
  - [ ] 支持复杂类型: enum, array, object
  - [ ] 实现枚举值自动推断
  - [ ] 实现令牌值提示

- [ ] **实现主题编辑器**
  - [ ] 创建 `components/playground/theme-editor.tsx`
  - [ ] 实现颜色系统编辑器
  - [ ] 实现间距系统编辑器
  - [ ] 实现字体系统编辑器
  - [ ] 实现圆角/阴影/动画编辑器

- [ ] **实现 Token Inspector**
  - [ ] 创建 `components/playground/token-inspector.tsx`
  - [ ] 分析组件使用的设计令牌
  - [ ] 分析组件使用的语义令牌
  - [ ] 分析组件使用的状态令牌
  - [ ] 显示令牌依赖关系

### Week 6: Snapshot 和 Compare 模式

**目标**: 实现快照管理和对比模式

- [ ] **实现 Snapshot Manager**
  - [ ] 创建 `components/playground/snapshot-manager.tsx`
  - [ ] 实现快照保存对话框
  - [ ] 实现快照列表展示
  - [ ] 实现快照加载功能
  - [ ] 实现快照删除功能
  - [ ] 集成 Playground Store

- [ ] **实现 Compare Mode**
  - [ ] 创建 `components/playground/compare-mode.tsx`
  - [ ] 实现快照选择器 (Snapshot A/B)
  - [ ] 实现并排对比视图
  - [ ] 实现差异分析器
  - [ ] 实现差异高亮显示

- [ ] **实现 Code Viewer**
  - [ ] 创建 `components/playground/code-viewer.tsx`
  - [ ] 集成 Monaco Editor
  - [ ] 实现代码高亮
  - [ ] 实现代码复制功能
  - [ ] 实现代码格式化

- [ ] **实现 Performance Panel**
  - [ ] 创建 `components/playground/performance-panel.tsx`
  - [ ] 显示 Bundle Size (gzip/brotli)
  - [ ] 显示渲染性能 (FCP/LCP)
  - [ ] 显示内存使用情况
  - [ ] 实现性能监控图表

- [ ] **Phase 3 验证**
  - [ ] 实时编辑器正常工作
  - [ ] 快照保存/加载正常
  - [ ] 对比模式正常显示
  - [ ] Token Inspector 准确分析
  - [ ] 性能面板数据正确

---

## 📋 Phase 4: DX 增强层 (Week 7-8)

### Week 7: CLI 工具增强

**目标**: 实现 Doctor, Sync, Check 命令

- [ ] **创建 CLI 命令目录**
  ```bash
  mkdir -p packages/cli/src/commands
  ```

- [ ] **实现 Doctor 命令**
  - [ ] 创建 `cli/src/commands/doctor.ts`
  - [ ] 实现 XorigoHealthCheck 类
  - [ ] 实现包版本检查: `checkPackageVersions()`
  - [ ] 实现依赖健康检查: `checkDependencies()`
  - [ ] 实现 TypeScript 检查: `checkTypeScript()`
  - [ ] 实现 ESLint 检查: `checkESLint()`
  - [ ] 实现可访问性检查: `checkA11y()`
  - [ ] 实现 Bundle 大小检查: `checkBundleSize()`
  - [ ] 实现 Registry 一致性检查: `checkRegistryConsistency()`
  - [ ] 实现 Tokens 一致性检查: `checkTokensConsistency()`
  - [ ] 实现自动修复功能: `autoFix()`
  - [ ] 实现报告生成: `printReport()`

- [ ] **实现 Sync 命令**
  - [ ] 创建 `cli/src/commands/sync.ts`
  - [ ] 实现 DocsSyncPipeline 类
  - [ ] 实现组件文档生成: `generateComponentDocs()`
  - [ ] 实现 Props 表生成: `generatePropsTables()`
  - [ ] 实现示例代码生成: `generateExamples()`
  - [ ] 实现搜索索引更新: `updateSearchIndex()`
  - [ ] 实现监听模式: `watch()`
  - [ ] 实现 dry-run 模式

- [ ] **实现 Check 命令**
  - [ ] 创建 `cli/src/commands/check.ts`
  - [ ] 集成所有健康检查
  - [ ] 实现并行检查执行
  - [ ] 实现检查报告输出
  - [ ] 实现失败时退出码

- [ ] **更新 package.json Scripts**
  - [ ] 添加 `doctor`: CLI Doctor 命令
  - [ ] 添加 `sync:docs`: 文档同步命令
  - [ ] 添加 `sync:docs:watch`: 监听模式
  - [ ] 添加 `check:all`: 所有检查

### Week 8: DX 监控仪表板

**目标**: 实现 DX 监控仪表板和性能监控

- [ ] **创建 DX 页面**
  ```bash
  mkdir -p apps/website/src/app/dx
  mkdir -p apps/website/src/components/dx
  ```

- [ ] **实现 Status Dashboard**
  - [ ] 创建 `app/dx/page.tsx`
  - [ ] 创建 `components/dx/status-dashboard.tsx`
  - [ ] 实现仪表板主视图
  - [ ] 集成性能指标展示
  - [ ] 集成 Bundle 分析展示
  - [ ] 集成可访问性报告展示
  - [ ] 集成构建健康展示

- [ ] **实现 Performance Metrics**
  - [ ] 创建 `components/dx/performance-metrics.tsx`
  - [ ] 显示 LCP, FCP, TTFB, CLS, FID
  - [ ] 显示交互性能指标
  - [ ] 实现性能趋势图表
  - [ ] 实现性能对比功能

- [ ] **实现 Bundle Analyzer**
  - [ ] 创建 `components/dx/bundle-analyzer.tsx`
  - [ ] 显示路由级 Bundle 大小
  - [ ] 显示依赖占比分析
  - [ ] 实现体积预算对比
  - [ ] 实现超限告警

- [ ] **实现 A11y Report**
  - [ ] 创建 `components/dx/a11y-report.tsx`
  - [ ] 集成 axe-core 结果
  - [ ] 显示违规项清单
  - [ ] 显示可访问性评分
  - [ ] 提供修复建议

- [ ] **实现 Build Health**
  - [ ] 创建 `components/dx/build-health.tsx`
  - [ ] 显示构建成功率
  - [ ] 显示部署成功率
  - [ ] 显示测试覆盖率
  - [ ] 显示依赖健康状态

- [ ] **创建 API Routes**
  ```bash
  mkdir -p apps/website/src/app/api/dx
  ```
  - [ ] 创建 `/api/dx/metrics` 指标 API
  - [ ] 创建 `/api/dx/bundle` Bundle 分析 API
  - [ ] 创建 `/api/dx/a11y` 可访问性 API
  - [ ] 创建 `/api/dx/health` 健康检查 API

- [ ] **Phase 4 验证**
  - [ ] Doctor 命令正常工作
  - [ ] Sync 命令正常同步
  - [ ] Check 命令正常检查
  - [ ] DX 仪表板正常显示
  - [ ] 性能监控数据准确

---

## 📋 Phase 5: Tokens/Theme Hub (Week 9-10)

### Week 9: Tokens Browser

**目标**: 实现 Tokens 可视化和 Schema 浏览

- [ ] **创建 Tokens 页面**
  ```bash
  mkdir -p apps/website/src/app/tokens
  mkdir -p apps/website/src/components/tokens
  ```

- [ ] **实现 Tokens 总览页**
  - [ ] 创建 `app/tokens/page.tsx` (RSC)
  - [ ] 显示所有令牌类别
  - [ ] 显示令牌统计信息
  - [ ] 创建令牌导航

- [ ] **实现 Token Browser**
  - [ ] 创建 `components/tokens/token-browser.tsx`
  - [ ] 实现分类浏览功能
  - [ ] 实现令牌搜索功能
  - [ ] 实现令牌过滤功能
  - [ ] 显示令牌使用统计

- [ ] **实现 Token Visualization**
  - [ ] 创建 `components/tokens/token-visualization.tsx`
  - [ ] 实现颜色令牌可视化: Color Swatch
  - [ ] 实现间距令牌可视化: Visual Ruler
  - [ ] 实现字体令牌可视化: Typography Preview
  - [ ] 实现阴影令牌可视化: Shadow Preview
  - [ ] 实现动画令牌可视化: Motion Preview

- [ ] **实现具体可视化组件**
  - [ ] 创建 `components/tokens/color-swatch.tsx`
  - [ ] 创建 `components/tokens/spacing-ruler.tsx`
  - [ ] 创建 `components/tokens/motion-preview.tsx`
  - [ ] 实现对比度检查 (WCAG)
  - [ ] 实现令牌值复制功能

- [ ] **实现 Schema Viewer**
  - [ ] 创建 `app/tokens/schema/page.tsx`
  - [ ] 创建 `components/tokens/schema-viewer.tsx`
  - [ ] 显示 Token Schema 结构
  - [ ] 显示令牌依赖关系图
  - [ ] 实现 Schema 搜索

- [ ] **实现 Version Governance**
  - [ ] 创建 `components/tokens/version-governance.tsx`
  - [ ] 显示令牌版本历史
  - [ ] 实现版本对比功能
  - [ ] 显示迁移指南
  - [ ] 实现兼容性检查

### Week 10: Theme Hub

**目标**: 实现主题切换和 URL 参数化共享

- [ ] **创建 Theme 页面**
  ```bash
  mkdir -p apps/website/src/app/themes
  mkdir -p apps/website/src/components/theme
  ```

- [ ] **实现 Theme 总览页**
  - [ ] 创建 `app/themes/page.tsx` (RSC)
  - [ ] 显示所有主题列表
  - [ ] 显示主题预览卡片
  - [ ] 创建主题导航

- [ ] **实现 Theme Switcher**
  - [ ] 创建 `components/theme/theme-switcher.tsx`
  - [ ] 实现主题切换 UI
  - [ ] 实现密度控制 (compact/modern/spacious)
  - [ ] 实现模式控制 (light/dark/auto)
  - [ ] 实现 RTL 切换
  - [ ] 集成 Playground Store

- [ ] **实现 Theme Preview**
  - [ ] 创建 `components/theme/theme-preview.tsx`
  - [ ] 显示主题色板
  - [ ] 显示组件示例预览
  - [ ] 实现交互式预览
  - [ ] 支持实时切换

- [ ] **实现 URL 参数化共享**
  - [ ] 创建 `hooks/use-theme-sync.ts`
  - [ ] 实现主题状态 URL 编码
  - [ ] 实现 URL 状态同步
  - [ ] 实现状态变化时更新 URL
  - [ ] 实现从 URL 恢复状态
  - [ ] 支持参数: ?brand=&mode=&density=&rtl=

- [ ] **实现具体控制组件**
  - [ ] 创建 `components/theme/density-control.tsx`
  - [ ] 创建 `components/theme/mode-control.tsx`
  - [ ] 创建 `components/theme/rtl-toggle.tsx`
  - [ ] 集成 ThemeProvider

- [ ] **Phase 5 验证**
  - [ ] 令牌可视化正确显示
  - [ ] Schema Viewer 正常工作
  - [ ] 主题切换正常
  - [ ] URL 参数化共享正常
  - [ ] RTL 布局正常

---

## 📋 Phase 6: 文档和搜索 (Week 11-12)

### Week 11: 文档渲染优化

**目标**: 优化 MDX 文档渲染和导航

- [ ] **优化 Docs 页面**
  - [ ] 优化 `app/docs/[[...slug]]/page.tsx`
  - [ ] 实现 ISR 缓存策略 (10 min)
  - [ ] 实现 generateStaticParams
  - [ ] 优化 MDX 编译性能

- [ ] **实现 MDX 自定义组件**
  - [ ] 创建 `components/docs/mdx-components.tsx`
  - [ ] 自定义 Code Block 组件
  - [ ] 自定义 Callout 组件
  - [ ] 自定义 Tabs 组件
  - [ ] 自定义 Table 组件
  - [ ] 集成代码高亮 (Shiki)

- [ ] **实现代码块增强**
  - [ ] 创建 `components/docs/code-block.tsx`
  - [ ] 实现代码高亮
  - [ ] 实现代码复制功能
  - [ ] 实现代码折叠功能
  - [ ] 实现行号显示
  - [ ] 实现 diff 高亮

- [ ] **实现 Table of Contents**
  - [ ] 创建 `components/docs/table-of-contents.tsx`
  - [ ] 自动提取 Heading 生成目录
  - [ ] 实现滚动高亮
  - [ ] 实现平滑滚动
  - [ ] 适配移动端

- [ ] **实现 Breadcrumb**
  - [ ] 创建 `components/docs/breadcrumb.tsx`
  - [ ] 基于路由生成面包屑
  - [ ] 集成 Schema.org 结构化数据
  - [ ] 实现 SEO 优化

- [ ] **实现相关组件推荐**
  - [ ] 创建 `components/docs/related-components.tsx`
  - [ ] 基于标签推荐相关组件
  - [ ] 基于类别推荐相关组件
  - [ ] 显示使用频率

### Week 12: 全局搜索

**目标**: 实现 Cmd+K 搜索和搜索引擎优化

- [ ] **创建 Search 页面**
  ```bash
  mkdir -p apps/website/src/app/search
  mkdir -p apps/website/src/components/search
  ```

- [ ] **实现 Cmd+K 搜索面板**
  - [ ] 创建 `components/search/search-command.tsx`
  - [ ] 集成 cmdk 库
  - [ ] 实现快捷键触发 (Cmd+K / Ctrl+K)
  - [ ] 实现搜索输入框
  - [ ] 实现实时搜索

- [ ] **实现搜索引擎**
  - [ ] 创建 `app/api/search/route.ts`
  - [ ] 集成 Fuse.js 前端搜索
  - [ ] 构建搜索索引 (components/docs/tokens)
  - [ ] 实现搜索权重配置
  - [ ] 实现搜索结果排序

- [ ] **实现搜索结果展示**
  - [ ] 创建 `components/search/search-results.tsx`
  - [ ] 分类展示结果 (组件/文档/令牌)
  - [ ] 实现结果高亮
  - [ ] 实现键盘导航
  - [ ] 实现结果预览

- [ ] **实现搜索筛选**
  - [ ] 创建 `components/search/search-filters.tsx`
  - [ ] 实现类别筛选
  - [ ] 实现标签筛选
  - [ ] 实现日期筛选
  - [ ] 实现结果限制

- [ ] **实现搜索高亮**
  - [ ] 创建 `components/search/search-highlights.tsx`
  - [ ] 实现关键词高亮
  - [ ] 实现上下文摘要
  - [ ] 优化高亮性能

- [ ] **创建 Zustand Search Store**
  - [ ] 创建 `stores/search.ts`
  - [ ] 管理搜索状态
  - [ ] 管理搜索历史
  - [ ] 管理最近搜索

- [ ] **Phase 6 验证**
  - [ ] 文档渲染正常
  - [ ] MDX 组件正常工作
  - [ ] 搜索响应时间 ≤ 200ms
  - [ ] 搜索结果准确
  - [ ] Cmd+K 快捷键正常

---

## 📋 Phase 7: 性能优化和测试 (Week 13-14)

### Week 13: 性能优化

**目标**: 达到性能预算目标

- [ ] **Bundle 体积优化**
  - [ ] 安装 @next/bundle-analyzer
  - [ ] 分析 Bundle 组成
  - [ ] 识别大型依赖
  - [ ] 实现代码分割优化
  - [ ] 实现懒加载优化
  - [ ] 验证体积 ≤ 120KB (站点) / ≤ 150KB (Playground)

- [ ] **图片资源优化**
  - [ ] 配置 Next.js Image 优化
  - [ ] 转换图片为 WebP/AVIF
  - [ ] 配置响应式图片
  - [ ] 实现图片懒加载
  - [ ] 验证图片大小 ≤ 200KB

- [ ] **字体优化**
  - [ ] 使用 next/font 加载字体
  - [ ] 配置字体显示策略 (font-display: swap)
  - [ ] 子集化字体文件
  - [ ] 预加载关键字体

- [ ] **CSS 优化**
  - [ ] 移除未使用的 CSS
  - [ ] 压缩 CSS 文件
  - [ ] 内联关键 CSS
  - [ ] 延迟加载非关键 CSS

- [ ] **ISR 配置优化**
  - [ ] 配置 Docs 页面 ISR (10 min)
  - [ ] 配置 Adoption 页面 ISR (5 min)
  - [ ] 配置 Tokens 页面 ISR (30 min)
  - [ ] 配置 ISR 内存缓存大小

- [ ] **静态生成优化**
  - [ ] 实现 generateStaticParams
  - [ ] 预生成常用页面
  - [ ] 配置 fallback 策略

- [ ] **创建性能监控脚本**
  - [ ] 创建 `scripts/check-bundle-size.ts`
  - [ ] 实现体积检查逻辑
  - [ ] 实现超限阻断
  - [ ] 集成到 postbuild 钩子

### Week 14: 测试和可访问性

**目标**: 达到测试覆盖和可访问性目标

- [ ] **编写 E2E 测试**
  ```bash
  npm install -D @playwright/test
  ```
  - [ ] 创建 `tests/e2e/` 目录
  - [ ] 编写首页测试
  - [ ] 编写 Adoption 页面测试
  - [ ] 编写 Playground 测试
  - [ ] 编写 Docs 页面测试
  - [ ] 编写搜索功能测试

- [ ] **编写单元测试**
  - [ ] 测试数据适配层
  - [ ] 测试 SDK 客户端
  - [ ] 测试 Zustand Store
  - [ ] 测试工具函数
  - [ ] 验证测试覆盖率 > 80%

- [ ] **可访问性测试**
  - [ ] 安装 @axe-core/react
  - [ ] 集成 axe-core 到开发环境
  - [ ] 编写可访问性测试
  - [ ] 实现自动化 a11y 审计脚本
  - [ ] 创建 `scripts/run-a11y-audit.ts`
  - [ ] 验证 WCAG 2.1 AA 合规

- [ ] **键盘导航测试**
  - [ ] 测试所有交互元素可键盘访问
  - [ ] 测试焦点环清晰可见
  - [ ] 测试 Tab 顺序合理
  - [ ] 测试 Esc 关闭模态框
  - [ ] 测试 Enter/Space 激活按钮

- [ ] **屏幕阅读器测试**
  - [ ] 测试 ARIA 标签完整
  - [ ] 测试语义 HTML 正确
  - [ ] 测试 alt 文本完整
  - [ ] 测试表单标签关联

- [ ] **性能测试**
  - [ ] 使用 Lighthouse CI
  - [ ] 测试 LCP ≤ 2.5s (3G)
  - [ ] 测试 FCP ≤ 1.8s
  - [ ] 测试 CLS ≤ 0.05
  - [ ] 测试 FID ≤ 100ms

- [ ] **Phase 7 验证**
  - [ ] 所有性能指标达标
  - [ ] 所有测试通过
  - [ ] 可访问性 100% 合规
  - [ ] 无严重/中等可访问性问题

---

## 📋 Phase 8: 部署和监控 (Week 15-16)

### Week 15: 生产环境部署

**目标**: 配置生产环境和部署流程

- [ ] **Vercel 部署配置**
  - [ ] 创建 Vercel 项目
  - [ ] 配置环境变量
  - [ ] 配置构建命令
  - [ ] 配置输出目录
  - [ ] 配置域名

- [ ] **CDN 配置**
  - [ ] 配置静态资源 CDN
  - [ ] 配置图片 CDN
  - [ ] 配置缓存策略
  - [ ] 配置 HTTP/3

- [ ] **Docker 部署配置** (可选)
  - [ ] 创建 Dockerfile
  - [ ] 创建 docker-compose.yml
  - [ ] 配置多阶段构建
  - [ ] 优化镜像大小

- [ ] **CI/CD 流程配置**
  - [ ] 配置 GitHub Actions
  - [ ] 配置自动化测试
  - [ ] 配置自动化部署
  - [ ] 配置部署预览

- [ ] **环境配置**
  - [ ] 配置开发环境 (dev)
  - [ ] 配置预览环境 (staging)
  - [ ] 配置生产环境 (production)
  - [ ] 配置环境变量管理

### Week 16: 监控和文档

**目标**: 配置监控告警和完善文档

- [ ] **监控配置**
  - [ ] 配置 Vercel Analytics
  - [ ] 配置 Web Vitals 监控
  - [ ] 配置错误追踪 (Sentry)
  - [ ] 配置性能监控 (Datadog/NewRelic)

- [ ] **告警配置**
  - [ ] 配置性能告警 (LCP > 2.5s)
  - [ ] 配置错误告警 (Error Rate > 1%)
  - [ ] 配置可用性告警 (Uptime < 99%)
  - [ ] 配置 Slack/Email 通知

- [ ] **日志收集配置**
  - [ ] 配置应用日志
  - [ ] 配置访问日志
  - [ ] 配置错误日志
  - [ ] 配置性能日志

- [ ] **文档更新**
  - [ ] 更新 README.md
  - [ ] 更新开发文档
  - [ ] 更新部署文档
  - [ ] 更新故障排查文档
  - [ ] 更新 API 文档

- [ ] **培训和交接**
  - [ ] 编写架构说明文档
  - [ ] 编写开发指南
  - [ ] 编写运维指南
  - [ ] 组织团队培训

- [ ] **Phase 8 验证**
  - [ ] 生产环境正常运行
  - [ ] 监控数据正常收集
  - [ ] 告警正常触发
  - [ ] 文档完整更新
  - [ ] 团队培训完成

---

## 🎯 验收标准

### 技术指标

```yaml
性能指标:
  ✅ LCP ≤ 2.5s (3G 网络)
  ✅ FCP ≤ 1.8s
  ✅ TTFB ≤ 800ms
  ✅ CLS ≤ 0.05
  ✅ FID ≤ 100ms

体积预算:
  ✅ 站点基础 ≤ 120KB gzip
  ✅ Playground ≤ 150KB gzip
  ✅ 单页最大 ≤ 50KB gzip

交互性能:
  ✅ Adoption 筛选 ≤ 50ms (1k 项)
  ✅ 搜索响应 ≤ 200ms
  ✅ Playground 渲染 ≤ 100ms

可访问性:
  ✅ WCAG 2.1 AA 合规 (0 严重/中等问题)
  ✅ 键盘导航 100% 支持
  ✅ 屏幕阅读器 100% 兼容

质量指标:
  ✅ 文档覆盖率 100%
  ✅ 示例完整性 100%
  ✅ 测试覆盖率 > 80%
  ✅ 链接有效性 100%
```

### 功能完整性

```yaml
数据层:
  ✅ 只读适配层正常工作
  ✅ SDK 客户端正常工作
  ✅ 构建前校验正常
  ✅ 一致性校验通过

页面层:
  ✅ 所有 RSC 页面正常
  ✅ 所有 Client 页面正常
  ✅ 错误边界正常工作
  ✅ 布局组件正常显示

Playground:
  ✅ Live Props 模式正常
  ✅ Snapshot 模式正常
  ✅ Compare 模式正常
  ✅ Token Inspector 正常

DX增强:
  ✅ Doctor 命令正常
  ✅ Sync 命令正常
  ✅ Check 命令正常
  ✅ DX 仪表板正常

Tokens/Theme:
  ✅ Tokens Browser 正常
  ✅ Schema Viewer 正常
  ✅ Theme Switcher 正常
  ✅ URL 参数化正常

搜索:
  ✅ Cmd+K 面板正常
  ✅ 搜索引擎正常
  ✅ 搜索结果准确
  ✅ 搜索高亮正常
```

---

## 📊 进度追踪

### 整体进度

- [ ] Phase 1: 数据层重构 (0/2 周完成)
- [ ] Phase 2: 页面层重构 (0/2 周完成)
- [ ] Phase 3: Playground 双模式 (0/2 周完成)
- [ ] Phase 4: DX 增强层 (0/2 周完成)
- [ ] Phase 5: Tokens/Theme Hub (0/2 周完成)
- [ ] Phase 6: 文档和搜索 (0/2 周完成)
- [ ] Phase 7: 性能优化和测试 (0/2 周完成)
- [ ] Phase 8: 部署和监控 (0/2 周完成)

**总进度**: 0% (0/16 周完成)

### 里程碑

- [ ] M1: 数据层重构完成 (Week 2)
- [ ] M2: 页面层重构完成 (Week 4)
- [ ] M3: Playground 完成 (Week 6)
- [ ] M4: DX 增强完成 (Week 8)
- [ ] M5: Tokens/Theme 完成 (Week 10)
- [ ] M6: 文档搜索完成 (Week 12)
- [ ] M7: 性能测试达标 (Week 14)
- [ ] M8: 生产环境上线 (Week 16)

---

**文档维护**: Xorigo UI Team
**创建时间**: 2025-10-13
**预计完成**: 2026-02-13 (16 周后)
**状态**: 待开始
