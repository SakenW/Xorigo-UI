# 🚀 Gallery + Playground → Workbench 迁移清单

> **版本**: 1.0
> **日期**: 2025-01-14
> **目标**: 整合 Gallery 和 Playground 到统一的 Workbench 模块
> **预计工期**: 2-3 周

---

## 📊 迁移概览

| 阶段 | 任务数 | 预计时间 | 风险等级 |
|------|--------|----------|---------|
| Phase 1: 基础架构 | 8 | 3 天 | 低 |
| Phase 2: Gallery Mode | 12 | 5 天 | 低 |
| Phase 3: Editor Mode | 15 | 6 天 | 中 |
| Phase 4: 测试与优化 | 10 | 3-4 天 | 低 |
| **总计** | **45** | **17-18 天** | **低-中** |

---

## Phase 1: 基础架构搭建（Week 1, Day 1-3）

### 1.1 创建 Workbench 目录结构
- [ ] 创建 `apps/website/app/(dashboard)/workbench/page.tsx`
- [ ] 创建 `apps/website/app/(dashboard)/workbench/layout.tsx`
- [ ] 创建 `apps/website/app/(dashboard)/workbench/loading.tsx`
- [ ] 创建 `apps/website/app/(dashboard)/workbench/error.tsx`
- [ ] 创建 `apps/website/src/components/workbench/` 目录

**架构验证**:
```typescript
// ✅ 确保所有组件从 packages 导入
import { Card, Button, Badge } from '@xorigo-ui/core'
import { ThemeProvider } from '@xorigo-ui/system'
```

### 1.2 设计模式切换系统
- [ ] 创建 `workbench-types.ts`
  ```typescript
  export type ViewMode = 'gallery' | 'editor' | 'split'
  export type WorkbenchTab = 'components' | 'recipes' | 'templates'
  ```
- [ ] 创建 `workbench-context.tsx` (状态管理)
  ```typescript
  interface WorkbenchContextType {
    mode: ViewMode
    setMode: (mode: ViewMode) => void
    selectedRecipe: Recipe | null
    setSelectedRecipe: (recipe: Recipe | null) => void
  }
  ```
- [ ] 创建 `mode-switcher.tsx` (模式切换 UI)
  ```typescript
  // ✅ 使用 @xorigo-ui/core 的 Button
  import { Button } from '@xorigo-ui/core'
  ```

### 1.3 路由系统设计
- [ ] 定义 Workbench URL 模式:
  - `/workbench` - 默认 Gallery Mode
  - `/workbench?mode=gallery` - Gallery Mode
  - `/workbench?mode=editor` - Editor Mode
  - `/workbench?mode=split` - Split Mode
  - `/workbench?recipe=<id>` - 带配方的 Editor Mode
- [ ] 实现 URL 参数解析 (useSearchParams)
- [ ] 配置路由重定向:
  - `/gallery` → `/workbench?mode=gallery`
  - `/playground` → `/workbench?mode=editor`

---

## Phase 2: Gallery Mode 迁移（Week 1 Day 4 - Week 2 Day 2）

### 2.1 迁移 Gallery 核心组件

#### 2.1.1 Server Component
- [ ] 复制 `gallery-server.tsx` → `workbench-gallery-server.tsx`
- [ ] 更新组件名称和导入路径
- [ ] 保持 RSC 优化 (数据获取在服务端)
- [ ] **验证**: 所有UI组件来自 `@xorigo-ui/core` ✅

#### 2.1.2 Client Component
- [ ] 复制 `gallery-client.tsx` → `workbench-gallery-client.tsx`
- [ ] 整合到 WorkbenchContext
- [ ] 更新状态管理 (使用 WorkbenchContext)
- [ ] 保留功能:
  - [ ] 搜索框 (Input from @xorigo-ui/core)
  - [ ] 分类过滤 (Badge from @xorigo-ui/core)
  - [ ] 配方网格 (Card from @xorigo-ui/core)
- [ ] **验证**: 所有UI组件来自 `@xorigo-ui/core` ✅

#### 2.1.3 Component Preview
- [ ] 合并 Gallery 和 Playground 的 `component-preview.tsx`
- [ ] 创建统一的 `workbench-preview.tsx`
- [ ] 支持两种模式:
  - 只读模式 (Gallery Mode)
  - 编辑模式 (Editor Mode)
- [ ] **验证**: 所有UI组件来自 `@xorigo-ui/core` ✅

#### 2.1.4 Component Card
- [ ] 迁移 `component-card.tsx` → `workbench-card.tsx`
- [ ] 增强功能:
  - [ ] 添加"进入编辑器"按钮
  - [ ] 优化配色预览
  - [ ] 保留标签系统
- [ ] **验证**: Card, Badge, Button 来自 `@xorigo-ui/core` ✅

### 2.2 Gallery Mode 布局
- [ ] 创建 `gallery-mode-layout.tsx`
- [ ] 实现响应式网格布局
- [ ] 整合搜索和过滤UI
- [ ] **验证**: 所有布局使用 `@xorigo-ui/core` 组件 ✅

### 2.3 数据集成
- [ ] 确保继续使用 `@/data/registry.readonly.ts`
- [ ] 保持 SSG/ISR 优化
- [ ] 数据结构保持不变 (Recipe, Category)

---

## Phase 3: Editor Mode 迁移（Week 2 Day 3 - Week 3 Day 2）

### 3.1 迁移 Playground 核心组件

#### 3.1.1 Server Component
- [ ] 复制 `playground-server.tsx` → `workbench-editor-server.tsx`
- [ ] 整合示例数据加载
- [ ] **验证**: 所有UI组件来自 `@xorigo-ui/core` ✅

#### 3.1.2 Client Component - 基础
- [ ] 复制 `playground-client.tsx` → `workbench-editor-client.tsx`
- [ ] 整合到 WorkbenchContext
- [ ] 保留核心功能:
  - [ ] Monaco Editor 集成
  - [ ] 代码编辑
  - [ ] 实时预览
  - [ ] 主题切换
- [ ] **验证**: Card, Button, Badge 来自 `@xorigo-ui/core` ✅

#### 3.1.3 Editor Layout
- [ ] 创建 `editor-mode-layout.tsx`
- [ ] 实现分屏布局:
  - 左侧: Monaco Editor
  - 右侧: 实时预览
- [ ] 支持 Split Mode (可选的三栏布局)
- [ ] **验证**: 所有UI组件来自 `@xorigo-ui/core` ✅

### 3.2 迁移高级功能

#### 3.2.1 Props Editor
- [ ] 迁移 `props-editor.tsx` → `workbench-props-editor.tsx`
- [ ] 整合到 Editor Mode
- [ ] **验证**: Card, Button 来自 `@xorigo-ui/core` ✅

#### 3.2.2 Theme Editor
- [ ] 迁移 `theme-editor.tsx` → `workbench-theme-editor.tsx`
- [ ] 整合主题切换逻辑
- [ ] **验证**: Card, Button 来自 `@xorigo-ui/core` ✅

#### 3.2.3 Code Viewer
- [ ] 迁移 `code-viewer.tsx` → `workbench-code-viewer.tsx`
- [ ] **验证**: Card 来自 `@xorigo-ui/core` ✅

### 3.3 工具面板迁移（可选，放入 Tools 模块）

#### 3.3.1 Token Inspector
- [ ] 评估是否迁移到 `/tools` 模块
- [ ] 如果保留，整合到 Editor Mode 的侧边栏
- [ ] **验证**: Card, Badge 来自 `@xorigo-ui/core` ✅

#### 3.3.2 Performance Panel
- [ ] 评估是否迁移到 `/tools` 模块
- [ ] 如果保留，整合到 Editor Mode 的侧边栏
- [ ] **验证**: Card 来自 `@xorigo-ui/core` ✅

#### 3.3.3 Snapshot Manager
- [ ] 评估是否保留
- [ ] 可能作为 Editor Mode 的独立功能
- [ ] **验证**: Card, Button 来自 `@xorigo-ui/core` ✅

### 3.4 XorigoUIProvider 全局化
- [ ] 从 Playground 迁移 `xorigo-ui-provider.tsx`
- [ ] 提升到 Workbench 根布局
- [ ] 确保 Gallery Mode 和 Editor Mode 都使用同一个 Provider
- [ ] **验证**: ThemeProvider 来自 `@xorigo-ui/system` ✅

---

## Phase 4: 整合与优化（Week 3 Day 3 - Week 4）

### 4.1 功能整合
- [ ] 实现 Gallery → Editor 无缝切换
  - [ ] 从 Gallery 点击"编辑"跳转到 Editor Mode
  - [ ] 自动带入选中的配方数据
- [ ] 实现 Editor → Gallery 返回
  - [ ] 保存编辑状态
  - [ ] 返回时恢复过滤器状态

### 4.2 Split Mode 实现（可选）
- [ ] 创建 `split-mode-layout.tsx`
- [ ] 左侧: 缩小的 Gallery 浏览
- [ ] 中间: Code Editor
- [ ] 右侧: Live Preview
- [ ] **验证**: 所有UI组件来自 `@xorigo-ui/core` ✅

### 4.3 路由重定向配置
- [ ] 配置 Next.js 重定向:
  ```typescript
  // next.config.ts
  async redirects() {
    return [
      {
        source: '/gallery',
        destination: '/workbench?mode=gallery',
        permanent: false
      },
      {
        source: '/gallery/:id',
        destination: '/workbench?mode=editor&recipe=:id',
        permanent: false
      },
      {
        source: '/playground',
        destination: '/workbench?mode=editor',
        permanent: false
      }
    ]
  }
  ```

### 4.4 清理旧代码
- [ ] **不要立即删除** Gallery 和 Playground 目录
- [ ] 验证 Workbench 完全正常后再删除
- [ ] 保留至少一个版本的备份

---

## Phase 5: 测试与验证

### 5.1 功能测试
- [ ] Gallery Mode 搜索过滤功能正常
- [ ] Editor Mode 代码编辑和预览正常
- [ ] Mode 切换无缝流畅
- [ ] URL 参数正确解析
- [ ] 路由重定向正确工作

### 5.2 组件源规则验证 🚨
- [ ] 运行自动化检查脚本:
  ```bash
  # 确保没有违规的 UI 组件定义
  grep -r "export.*function.*Button\|export.*function.*Card" apps/website/src/components/workbench/

  # 应该只有容器组件，无 UI 组件定义
  ```
- [ ] 验证所有导入来自 `@xorigo-ui/core`:
  ```bash
  grep -r "from '@xorigo-ui/core'" apps/website/src/components/workbench/
  ```
- [ ] 预期结果: ✅ 100% 合规

### 5.3 Architecture Validator 验证
- [ ] 运行 Architecture Validator Agent
- [ ] 确认零功能重叠
- [ ] 确认模块边界清晰
- [ ] 确认组件源规则 100% 合规

### 5.4 性能测试
- [ ] Lighthouse 评分保持或提升
- [ ] First Contentful Paint (FCP) < 1.5s
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] Time to Interactive (TTI) < 3.5s

### 5.5 可访问性测试
- [ ] WCAG AA 合规性
- [ ] 键盘导航正常
- [ ] 屏幕阅读器支持

---

## 📋 交付物检查清单

### 代码文件
- [ ] `apps/website/app/(dashboard)/workbench/page.tsx`
- [ ] `apps/website/src/components/workbench/workbench-context.tsx`
- [ ] `apps/website/src/components/workbench/gallery-mode/`
- [ ] `apps/website/src/components/workbench/editor-mode/`
- [ ] `apps/website/src/components/workbench/shared/`

### 文档
- [ ] Workbench 使用文档
- [ ] API 文档更新
- [ ] 迁移完成报告

### 测试
- [ ] 单元测试（新增 Workbench 组件）
- [ ] 集成测试（Mode 切换）
- [ ] E2E 测试（完整用户流程）

---

## ⚠️ 风险与缓解

| 风险 | 影响 | 概率 | 缓解措施 |
|------|------|------|----------|
| 功能丢失 | 高 | 低 | 详细的功能对比检查 |
| 性能下降 | 中 | 低 | 性能基准测试 |
| 组件源违规 | 高 | 极低 | 自动化检查 + Architecture Validator |
| 用户体验下降 | 中 | 低 | 用户测试和反馈 |
| 路由冲突 | 低 | 低 | 重定向测试 |

---

## 🎯 成功标准

1. ✅ **零功能重叠**：Gallery 和 Playground 功能完全整合到 Workbench
2. ✅ **组件源 100% 合规**：所有 UI 组件来自 `@xorigo-ui/core`
3. ✅ **性能保持**：Lighthouse 评分不低于当前水平
4. ✅ **无缝切换**：Gallery Mode ↔ Editor Mode 切换流畅
5. ✅ **向后兼容**：旧 URL 正确重定向到新 Workbench

---

## 📝 执行建议

### 顺序执行
1. **先基础再高级**：Phase 1 → Phase 2 → Phase 3 → Phase 4
2. **先简单再复杂**：Gallery Mode（较简单） → Editor Mode（较复杂）
3. **持续验证**：每个 Phase 完成后运行 Architecture Validator

### 并行执行（可选）
- Phase 2 (Gallery Mode) 和 Phase 3.1-3.2 (Editor Mode 基础) 可并行
- Phase 3.3 (工具面板) 可延后或并行进行

### 质量门禁
每个 Phase 完成后必须：
1. 运行组件源规则检查
2. 运行功能测试
3. 获得 Architecture Validator 批准

---

## 📊 进度跟踪

使用本清单作为 TodoWrite 的输入：
```typescript
TodoWrite({
  todos: [
    { content: "Phase 1: 基础架构搭建", status: "pending", activeForm: "正在搭建基础架构" },
    { content: "Phase 2: Gallery Mode 迁移", status: "pending", activeForm: "正在迁移 Gallery Mode" },
    { content: "Phase 3: Editor Mode 迁移", status: "pending", activeForm: "正在迁移 Editor Mode" },
    { content: "Phase 4: 整合与优化", status: "pending", activeForm: "正在整合与优化" },
    { content: "Phase 5: 测试与验证", status: "pending", activeForm: "正在测试与验证" }
  ]
})
```

---

**迁移清单版本**: 1.0
**最后更新**: 2025-01-14
**预计完成**: 2025-02-04
**负责团队**: Xorigo UI Refactor Team + Architecture Validator Agent
