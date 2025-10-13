# 文档命名规范建立

**日期**: 2025-01-10
**任务类型**: 文档规范建立
**状态**: ✅ 完成

## 📋 任务概述

为 Xorigo UI 组件库项目建立适合的文档命名规范，参考 Xorigo UI 原点设计系统 项目的文档体系，但针对组件库开发特点进行定制化调整。

## 🎯 核心设计原则

### 与 Xorigo UI 原点设计系统 的差异对比

| 特性 | Xorigo UI 原点设计系统 (Python 后端) | Xorigo UI (React 组件库) |
|------|-------------------------|---------------------|
| **项目导向** | 系统架构开发 (Phase 1-9) | 组件库开发 (Phase 1-3) |
| **核心作用域** | Frontend, Mobile, API, Infrastructure | Component, Design System, Build, Testing |
| **命名重点** | 功能模块和系统集成 | 组件分类和设计系统 |
| **文档结构** | 领域驱动的任务分类 | 组件驱动的开发分类 |

### Xorigo UI 特有的命名体系

**四大开发导向**：
1. **项目阶段线** (`ph{N}`) - 组件库开发阶段
2. **组件开发线** (`comp-{category}`) - 组件具体开发
3. **系统构建线** (`build-{area}`) - 构建和工具链
4. **质量保证线** (`test-{type}`) - 测试和质量

## 🏗️ 规范架构

### 作用域分类

```yaml
项目阶段 (001-030):
  ph1: 项目初始化和基础设施
  ph2: 设计系统和主题
  ph3: 组件迁移和集成

组件开发 (031-150):
  comp-core: 核心组件 (Button, Input, Card)
  comp-advanced: 高级组件 (DataTable, AnimatedCard)
  comp-layout: 布局组件 (Header, Sidebar)
  comp-nav: 导航组件 (Breadcrumb, Menu)
  comp-form: 表单组件 (Form, Field)
  comp-feedback: 反馈组件 (Alert, Modal)

设计系统 (151-200):
  ds-d: 设计令牌和主题系统
  comp-planning: 组件规划文档
  comp-research: 技术研究文档

构建系统 (201-250):
  build-vite: Vite 配置和优化
  build-typescript: TypeScript 配置
  build-storybook: Storybook 集成

测试系统 (251-300):
  test-unit: 单元测试
  test-e2e: 端到端测试
  test-axe: 可访问性测试
```

### 命名示例

```bash
# 项目阶段
001-ph1-project-init.md           # Phase 1: 项目初始化
005-ph2-design-tokens.md          # Phase 2: 设计令牌系统

# 组件开发
032-comp-core-button.md           # 核心组件: Button
045-comp-advanced-datatable.md    # 高级组件: DataTable
058-comp-layout-header.md         # 布局组件: Header

# 设计系统
152-comp-planning-core.md         # 核心组件规划
160-comp-research-animations.md   # 动画系统研究

# 构建系统
202-build-vite-config.md          # Vite 构建配置
210-build-typedoc.md              # TypeScript 文档生成
```

## 🔍 关键设计决策

### 1. 作用域简化

**决策**: 从 Xorigo UI 原点设计系统 的 7 个作用域简化为 6 个，更聚焦组件库开发

**原因**: 组件库项目不需要 Mobile、API、Infrastructure 等复杂领域分类

**优势**:
- 更精确的分类
- 减少命名混乱
- 便于文档检索

### 2. 组件分类细化

**决策**: 增加组件功能分类 (core, advanced, layout, nav, form, feedback)

**原因**: 组件库的核心产出是组件，需要更细粒度的分类管理

**优势**:
- 便于组件开发跟踪
- 支持组件优先级管理
- 有助于文档维护

### 3. 阶段标记适配

**决策**: 保留 Xorigo UI 原点设计系统 的阶段标记系统，但增加组件特有的标记

**新增标记**:
- `comp-planning-{category}` - 组件规划
- `comp-research-{topic}` - 技术研究
- `comp-legacy-r{N}` - 历史组件优化

## 📁 文档组织结构

```
docs/reports/
├── 00-TIMELINE-INDEX.md          # 总时间线索引
├── phases/                       # 项目阶段文档
├── components/                   # 组件开发文档
│   ├── core/                     # 核心组件
│   ├── advanced/                 # 高级组件
│   ├── layout/                   # 布局组件
│   ├── navigation/               # 导航组件
│   ├── form/                     # 表单组件
│   └── feedback/                 # 反馈组件
├── design-system/                # 设计系统文档
├── build/                        # 构建系统文档
├── testing/                      # 测试文档
└── deployment/                   # 部署文档
```

## 🛠️ 实施工具

### 查询命令

```bash
# 查找特定类型文档
ls -1 docs/reports/ | grep -E '^[0-9]{3}-comp-core'
ls -1 docs/reports/ | grep -E '^[0-9]{3}-ph1'
ls -1 docs/reports/ | grep -E '-r[0-9]+-'

# 获取当前序号
ls -1 docs/reports/ | grep -E '^[0-9]{3}-' | tail -1 | cut -d'-' -f1
```

### 检查清单

5 步检查流程确保文档命名规范性：

1. ✅ 确定作用域和分类
2. ✅ 分配唯一序号
3. ✅ 构建标准文件名
4. ✅ 验证命名唯一性
5. ✅ 更新相关索引

## 📈 预期效果

### 短期收益
- **文档组织清晰**: 便于快速定位相关文档
- **开发流程标准化**: 统一的文档创建和管理流程
- **团队协作效率**: 减少文档查找和理解成本

### 长期价值
- **项目历史追溯**: 完整的开发过程记录
- **知识沉淀积累**: 系统化的技术决策文档
- **新成员上手**: 清晰的项目文档体系

## 🔮 后续计划

1. **索引文档建立**: 创建 00-TIMELINE-INDEX.md 总索引
2. **分类 README**: 为每个分类创建说明文档
3. **模板建立**: 创建各类文档的标准模板
4. **自动化工具**: 开发文档命名的校验工具

## 📝 相关链接

- [Xorigo UI 原点设计系统 文档命名规范](../../../th-temp/Xorigo UI 原点设计系统/CLAUDE.md#文档命名规范) - 参考源
- [Xorigo UI CLAUDE.md](../../CLAUDE.md) - 更新的项目文档
- [Atomic Design 方法论](https://bradfrost.com/blog/post/atomic-web-design/) - 组件设计理论

---

**创建者**: Claude Code
**审查者**: Xorigo UI Team
**版本**: 1.0
**状态**: ✅ 已实施