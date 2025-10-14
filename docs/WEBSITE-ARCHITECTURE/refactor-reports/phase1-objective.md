# Phase 1 重构目标 - 分析与验证

## 任务概述
分析 Xorigo UI Website 的 Gallery 和 Playground 模块，识别 70-90% 的功能重叠，为后续整合到 Workbench 做准备。

## 具体任务

### 1. 代码结构分析
扫描以下目录的所有代码：
- `apps/website/app/gallery/**/*`
- `apps/website/app/playground/**/*`
- `apps/website/src/components/gallery/**/*`
- `apps/website/src/components/playground/**/*`

### 2. 功能重叠识别
创建功能对比矩阵，识别：
- 相同功能（100%重叠）
- 相似功能（70-90%重叠）
- 独特功能（需保留）

### 3. 组件源规则验证
检查所有现有代码是否符合组件源规则：
- ✅ 正确：从 `@xorigo-ui/core` 导入组件
- ❌ 错误：在 Website 中创建 UI 组件

### 4. 依赖关系图
生成：
- 模块间依赖关系
- 组件使用关系
- 路由结构

### 5. 迁移清单
创建详细的迁移步骤清单：
- Gallery → Workbench Gallery Mode
- Playground → Workbench Editor Mode
- 路由更新计划
- 状态迁移计划

## 输出要求

### 必须生成的文件
1. `analysis-report.md` - 完整分析报告
2. `overlap-matrix.json` - 功能重叠矩阵
3. `migration-checklist.md` - 迁移清单
4. `dependency-graph.json` - 依赖关系图
5. `component-source-audit.md` - 组件源合规审计

## 质量标准
- 所有重叠功能必须识别出来
- 所有组件源违规必须标记
- 迁移清单必须可执行
- 必须通过 Architecture Validator 验证

## 关键约束
🚨 **组件源规则**：Website 必须从 packages/ 导入所有 UI 组件
🚨 **零重叠原则**：新架构必须消除所有功能重叠
🚨 **架构合规**：所有操作必须符合 v2.0 架构设计
