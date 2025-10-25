# Xorigo UI Claude Code 配置

这个目录包含了 Xorigo UI 项目的 Claude Code 配置文件、代理和技能。

## 📁 目录结构

```
.claude/
├── agents/                     # 项目专用代理
│   ├── xorigo-ui-workflow-agent/  # 完整开发工作流Agent
│   ├── xorigo-component-master/   # 组件开发管理
│   ├── xorigo-quality-guardian/   # 质量守护
│   └── ...                        # 其他专用代理
├── skills/                     # 项目技能
├── hooks/                      # 项目钩子
├── settings.json              # Claude Code 设置
└── README.md                  # 本文件
```

## 🤖 代理 (Agents)

### xorigo-ui-workflow-agent
专门为 Xorigo UI 组件库设计的完整开发工作流智能协调 Agent。

**功能**:
- 自动化代码质量分析（技术债务评估 + AI代码审查）
- 智能重构优化（代码重构 + 上下文完整性检查）
- 全面测试生成（单元测试 + 集成测试协调）
- 完整文档生成（API文档 + 开发指南更新）

**使用方法**:
```bash
# 从项目根目录执行
python3 .claude/agents/xorigo-ui-workflow-agent/scripts/workflow_executor.py --component=Button
```

## ⚙️ 配置说明

### settings.json
Claude Code 的项目级配置，包含：
- 代理触发规则
- 工具链集成设置
- 质量标准配置
- 工作流参数

### hooks/
项目级钩子，用于：
- 代码提交前检查
- 构建后验证
- 文档更新触发
- 质量门禁执行

## 🚀 快速开始

1. **检查代理状态**:
   ```bash
   ls .claude/agents/
   ```

2. **执行工作流**:
   ```bash
   python3 .claude/agents/xorigo-ui-workflow-agent/scripts/workflow_executor.py --component=Button
   ```

3. **查看结果**:
   ```bash
   ls reports/           # 分析报告
   ls docs/generated/    # 生成的文档
   ```

## 📚 更多信息

每个代理和技能都有独立的文档文件，包含详细的使用说明和配置选项。

## 🔧 集成说明

这些配置专门针对 Xorigo UI 项目设计，与项目的技术栈和开发流程完全集成：
- React 19 + TypeScript 5.9
- Tailwind CSS 4 + Framer Motion 12
- Vite Library Mode
- 七轴主题系统
- Atomic Design 原则