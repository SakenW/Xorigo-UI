# 🚀 Website 架构重构 - 修正执行计划

**版本**: v2.0
**日期**: 2025-10-15
**状态**: ✅ 基于实际进度调整
**原计划**: `/docs/WEBSITE-ARCHITECTURE/REFACTOR-EXECUTION-PLAN.md`

---

## 📋 执行摘要

基于当前状态分析，发现项目实际进度**远超预期**，Workbench模块已完成90%。本计划调整为**5个Phase**，预计**1周内完成**重构。

**核心发现**:
- ✅ Workbench模块已基本完成 (Gallery+Editor+Split三种模式)
- ✅ 组件源规则100%合规
- 🔄 Gallery和Playground页面仍存在，需要重定向
- 📁 其他模块目录已创建，功能待实现

---

## 🎯 修正后的Phase计划

### Phase 1: 路由迁移 (1天)
**目标**: 消除功能重叠，统一到Workbench

**任务清单**:
```yaml
任务1: 设置Gallery重定向
  文件: apps/website/app/(dashboard)/gallery/page.tsx
  目标: 重定向到 /workbench?mode=gallery
  状态: 待执行

任务2: 设置Playground重定向
  文件: apps/website/app/(dashboard)/playground/page.tsx
  目标: 重定向到 /workbench?mode=editor
  状态: 待执行

任务3: 测试重定向功能
  验证: 所有旧URL正确重定向
  状态: 待执行

任务4: 更新导航链接
  文件: 所有包含gallery/playground链接的组件
  目标: 更新为workbench链接
  状态: 待执行
```

### Phase 2: Workbench完善 (1天)
**目标**: 完成Workbench所有功能

**任务清单**:
```yaml
任务1: 完善Split模式
  文件: apps/website/app/workbench/page.tsx
  功能: 实现左右分屏联动
  状态: 待执行

任务2: 优化Gallery模式
  组件: WorkbenchGalleryServer
  功能: 组件搜索、过滤、预览
  状态: 待执行

任务3: 优化Editor模式
  组件: WorkbenchEditorServer
  功能: 代码编辑、实时预览
  状态: 待执行

任务4: 添加快捷键支持
  功能: Ctrl+P模式切换等
  状态: 待执行
```

### Phase 3: 其他模块实现 (2天)
**目标**: 实现7个独立模块架构

**Components模块**:
```yaml
任务1: 实现展示功能
  功能: 组件分类展示、搜索过滤
  文件: apps/website/app/(dashboard)/components/page.tsx
  状态: 待执行

任务2: 实现复制功能
  功能: 一键复制代码、多种格式导出
  组件: 新建ComponentCard、CodeCopy等
  状态: 待执行

任务3: 集成组件预览
  功能: 交互式组件预览
  组件: 复用WorkbenchComponentPreview
  状态: 待执行
```

**Tools模块**:
```yaml
任务1: 实现独立工具架构
  功能: 工具目录、独立路由
  文件: apps/website/app/(dashboard)/tools/[tool]/page.tsx
  状态: 待执行

任务2: 迁移Matrix工具
  源: apps/website/app/(dashboard)/matrix/
  目标: apps/website/app/(dashboard)/tools/matrix/
  状态: 待执行

任务3: 添加工具配置
  功能: 工具元数据、独立运行
  状态: 待执行
```

**Templates模块**:
```yaml
任务1: 实现模板展示
  功能: 项目模板列表、预览
  文件: apps/website/app/(dashboard)/templates/page.tsx
  状态: 待执行

任务2: 实现下载功能
  功能: 完整项目下载、多格式支持
  状态: 待执行
```

### Phase 4: 系统测试 (1天)
**目标**: 确保功能完整性和稳定性

**测试套件**:
```yaml
单元测试:
  目标: 80%覆盖率
  重点: Workbench三种模式、组件预览
  工具: Vitest + Testing Library
  状态: 待执行

集成测试:
  目标: 模块间通信、路由系统
  重点: 重定向功能、模块边界
  工具: Playwright
  状态: 待执行

E2E测试:
  目标: 用户旅程完整流程
  重点: Gallery→Workbench迁移、模式切换
  工具: Playwright
  状态: 待执行

性能测试:
  目标: Core Web Vitals达标
  重点: 页面加载、模式切换性能
  工具: Lighthouse
  状态: 待执行
```

### Phase 5: 文档和部署 (1天)
**目标**: 完成文档更新和部署准备

**文档更新**:
```yaml
用户文档:
  文件: README.md
  内容: Workbench使用指南、模块说明
  状态: 待执行

API文档:
  工具: TypeDoc
  内容: 组件API、类型定义
  状态: 待执行

迁移指南:
  文件: MIGRATION-GUIDE.md
  内容: 从Gallery/Playground到Workbench的迁移
  状态: 待执行
```

**部署准备**:
```yaml
构建验证:
  目标: 确保生产环境构建成功
  命令: npm run build
  状态: 待执行

灰度发布:
  策略: 逐步发布、监控指标
  回滚: 保留完整回滚方案
  状态: 待执行
```

---

## 🚨 架构校验重点

### 关键校验规则

**组件源规则** (最高优先级):
```typescript
// ✅ 允许的模式
import { Button } from '@xorigo-ui/core'
import { Card } from '@/components/xorigo-ui' // 如果存在本地包装器

// ❌ 禁止的模式
export function CustomButton() { ... } // 禁止在Website创建组件
export const MyCard = () => { ... }    // 禁止在Website创建组件
```

**模块边界规则**:
```yaml
Components模块:
  允许: ['display', 'copy', 'search', 'filter']
  禁止: ['edit', 'combine', 'template']

Workbench模块:
  允许: ['edit', 'experiment', 'preview', 'customize']
  模式: ['gallery', 'editor', 'split']

Tools模块:
  允许: ['independent', 'standalone']
  禁止: ['依赖其他模块']
```

**零重叠检测**:
```yaml
检测方法:
  1. 功能重复分析
  2. 路由冲突检查
  3. 组件依赖分析

阈值: 0% (零容忍)
```

---

## 📊 进度追踪

### KPI指标

| 指标 | 当前值 | 目标值 | 状态 |
|------|--------|--------|------|
| 功能重叠度 | 30% | 0% | 🔄 Phase 1后达标 |
| Workbench完成度 | 90% | 100% | 🔄 Phase 2完成 |
| 模块实现数量 | 1/7 | 7/7 | 🔄 Phase 3完成 |
| 测试覆盖率 | 0% | 80% | ⏳ Phase 4目标 |
| 组件源规则合规 | 100% | 100% | ✅ 已达标 |

### 里程碑

**M1: 路由迁移完成** (今天)
- Gallery和Playground重定向就绪
- 用户统一使用Workbench

**M2: Workbench完善** (明天)
- 三种模式功能完整
- 交互体验优化

**M3: 模块架构完成** (3天后)
- 7个独立模块全部实现
- 模块边界清晰

**M4: 系统测试通过** (4天后)
- 所有测试套件通过
- 性能指标达标

**M5: 生产部署就绪** (5天后)
- 文档更新完成
- 部署流程验证

---

## 🛠️ Agent任务分配

### Phase 1: 路由迁移
```yaml
主要Agent: Migrator Agent
辅助Agent: Validator Agent
任务: 设置重定向、更新链接
验证: 确保无404错误
```

### Phase 2: Workbench完善
```yaml
主要Agent: Builder Agent
辅助Agent: Validator Agent
任务: 完善Split模式、优化交互
验证: 组件源规则合规
```

### Phase 3: 模块实现
```yaml
主要Agent: Builder Agent
辅助Agent: Validator Agent (实时验证)
任务: 实现Components、Tools、Templates
验证: 模块边界、零重叠
```

### Phase 4: 系统测试
```yaml
主要Agent: Tester Agent
辅助Agent: Validator Agent
任务: 单元测试、集成测试、E2E测试
验证: 功能完整性、性能达标
```

### Phase 5: 文档部署
```yaml
主要Agent: Orchestrator Agent
辅助Agent: 所有Agent
任务: 文档更新、部署准备
验证: 部署成功、回滚就绪
```

---

## ⚠️ 风险管理

### 已识别风险

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|----------|
| 路由重定向失败 | 低 | 高 | 充分测试、保留回滚方案 |
| 模块功能重叠 | 中 | 高 | Validator Agent实时监控 |
| 性能退化 | 低 | 中 | 性能基准测试 |
| 用户体验影响 | 中 | 中 | 渐进式迁移、文档引导 |

### 缓解策略

**技术措施**:
- 架构校验器实时监控
- 自动化测试覆盖
- 性能基准检测

**流程措施**:
- 分阶段实施
- 充分测试验证
- 完整回滚准备

---

## 🎯 成功标准

### 必须达成

1. **零功能重叠**: Gallery和Playground完全整合到Workbench
2. **7个独立模块**: 每个模块职责清晰，无功能重叠
3. **组件源规则**: 100%使用@xorigo-ui/core组件
4. **测试覆盖**: ≥80%代码覆盖率
5. **性能达标**: 所有Core Web Vitals指标达标

### 期望达成

1. **用户体验**: 模式切换流畅，功能完整
2. **开发体验**: 代码结构清晰，易于维护
3. **文档完整**: 用户文档和API文档齐全

---

## 📝 总结

**调整原因**: 项目实际进度远超预期，Workbench模块已基本完成

**新计划特点**:
- ✅ 更贴近实际开发进度
- ✅ 重点突出路由迁移和模块完善
- ✅ 时间缩短至1周 (原计划4周)
- ✅ 保持架构质量标准不变

**核心优势**:
- 保持重构目标不变
- 加速交付进程
- 降低实施风险
- 提升用户价值

---

**文档状态**: ✅ 已调整
**下一步**: 执行Phase 1路由迁移

---

*调整时间: 2025-10-15*
*预计完成: 2025-10-22*