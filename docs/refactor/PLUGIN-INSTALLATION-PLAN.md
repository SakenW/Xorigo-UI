# 🚀 Xorigo-UI 重构插件安装方案

**创建时间**：2025-10-16
**适用范围**：Xorigo-UI 重构项目专用
**插件市场**：claude-code-workflows 已安装

---

## 📋 插件需求分析

基于《重构与校验一体化执行手册》的6个阶段，识别出以下关键需求：

### 🎯 核心需求映射

| 重构阶段 | 技术需求 | 对应插件 | 优先级 |
|---------|---------|---------|--------|
| Phase 1: 构建优化 | Vite配置、Bundle分析 | backend-architect | P0 |
| Phase 2: 主题解耦 | CSS变量、设计令牌 | backend-architect | P0 |
| Phase 3: a11y自动化 | axe-core、Playwright | test-automator | P0 |
| Phase 4: 视觉回归 | 截图对比、Storybook | test-automator | P1 |
| Phase 5: SSR兼容 | Next.js、React 19 | backend-architect | P0 |
| Phase 6: 发版流水线 | Changesets、CI/CD | backend-architect | P1 |

---

## 🛠️ 推荐插件安装命令

### 阶段1：核心架构插件（P0）

```bash
# 后端架构师 - 处理构建优化、SSR兼容、CI/CD设计
/plugin marketplace add wshobson/agents backend-architect

# 测试自动化专家 - 处理a11y测试、视觉回归
/plugin marketplace add wshobson/agents test-automator

# 代码审查AI - 确保架构合规性
/plugin marketplace add wshobson/agents architect-review
```

### 阶段2：辅助功能插件（P1）

```bash
# 调试专家 - 处理复杂问题排查
/plugin marketplace add wshobson/agents debugger

# TDD编排器 - 确保测试驱动开发
/plugin marketplace add wshobson/agents tdd-orchestrator

# 多代理优化器 - 协调复杂任务执行
/plugin marketplace add wshobson/agents multi-agent-optimize
```

---

## 🎭 插件角色分工

### 🏗️ backend-architect
**重构职责**：
- Phase 1: Vite多入口配置优化
- Phase 2: 主题系统架构设计
- Phase 5: SSR兼容性技术方案
- Phase 6: CI/CD流水线架构

**核心技能**：
- 构建工具专家（Vite/Webpack）
- 模块化架构设计
- 性能优化策略
- DevOps最佳实践

### 🧪 test-automator
**重构职责**：
- Phase 3: a11y自动化测试集成
- Phase 4: 视觉回归测试框架
- 跨阶段测试策略制定

**核心技能**：
- Playwright测试框架
- axe-core可访问性测试
- 视觉回归测试设计
- 测试自动化流水线

### 🏛️ architect-review
**重构职责**：
- 全阶段架构合规性检查
- 设计决策质量评估
- 技术债务识别与建议

**核心技能**：
- 架构模式评估
- 代码质量分析
- 最佳实践对标
- 重构风险识别

---

## 📅 插件使用时间线

### Phase 1: 构建优化（第1-3天）
```bash
# 激活架构师模式
/agent backend-architect

任务：
1. 分析当前Vite配置
2. 设计多入口构建方案
3. 优化package.json exports
4. 验证tree-shaking效果
```

### Phase 2: 主题解耦（第4-6天）
```bash
# 继续使用架构师 + 激活审查模式
/agent backend-architect
/agent architect-review

任务：
1. 设计tokens/theme/core三层架构
2. 制定CSS变量迁移策略
3. 验证主题切换灵活性
4. 架构合规性检查
```

### Phase 3: a11y自动化（第7-10天）
```bash
# 切换到测试专家
/agent test-automator

任务：
1. 集成axe-core测试框架
2. 创建键盘矩阵测试
3. 建立a11y基线
4. 配置CI自动化检查
```

### Phase 4: 视觉回归（第11-13天）
```bash
# 继续使用测试专家
/agent test-automator

任务：
1. 配置Playwright视觉测试
2. 建立Storybook截图基线
3. 设置差异阈值
4. 集成到CI流程
```

### Phase 5: SSR兼容（第14-16天）
```bash
# 回到架构师模式
/agent backend-architect

任务：
1. 设计Motion SSR Provider
2. 优化Framer Motion兜底
3. 创建SSR演示页面
4. 验证Next.js兼容性
```

### Phase 6: 发版流水线（第17-20天）
```bash
# 架构师 + 测试专家 + 审查专家协同
/agent backend-architect
/agent test-automator
/agent architect-review

任务：
1. 设计Changesets工作流
2. 创建GitHub Actions流水线
3. 建立架构守卫机制
4. 最终质量验收
```

---

## 🔧 插件配置建议

### 自定义提示词模板

```markdown
## Xorigo-UI 重构项目上下文

你正在参与Xorigo-UI组件库的重构项目，这是一个基于React 19 + TypeScript 5.9 + Tailwind CSS 4的现代化组件库。

### 项目结构
- packages/*: 核心包（tokens、core、system等）
- apps/website: 消费型演示网站（仅导入，不创造UI）

### 重构目标
1. 构建优化：按需打包、tree-shaking
2. 主题解耦：CSS变量、三层架构
3. a11y自动化：axe-core、键盘测试
4. 视觉回归：截图对比、Storybook
5. SSR兼容：Next.js 15、React 19
6. 发版流水线：Changesets、CI/CD

### 架构原则
- Website严格消费@xorigo-ui/*包
- 无反向依赖（packages→website）
- 遵循Atomic Design原则
- TypeScript类型安全优先

### 当前阶段
{{current_phase}}

请基于你的专业能力，协助完成当前阶段的具体任务。
```

---

## 📊 预期收益

### 🚀 效率提升
- **架构设计**：backend-architect 提供专业的现代前端架构方案
- **测试自动化**：test-automator 确保a11y和视觉回归测试覆盖率
- **质量保障**：architect-review 持续监督架构合规性

### 🛡️ 风险控制
- **技术风险**：专业代理降低技术决策风险
- **进度风险**：明确的时间线和职责分工
- **质量风险**：多层次审查和验证机制

### 📈 知识沉淀
- **最佳实践**：每个阶段的技术决策记录
- **模式文档**：可复用的架构模式和测试模式
- **经验传承**：插件使用经验和优化建议

---

## 🎯 执行建议

1. **分阶段安装**：根据重构进展逐步激活相应插件
2. **上下文同步**：确保所有插件了解项目整体架构
3. **质量门禁**：使用architect-review设置阶段验收标准
4. **持续优化**：根据实际使用情况调整插件配置

---

**制定者**：Claude Code Assistant
**审核者**：Xorigo-UI Team
**版本**：v1.0（2025-10-16）