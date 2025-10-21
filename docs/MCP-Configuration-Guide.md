# Xorigo UI MCP 配置指南

## 📋 概述

本文档详细记录了 Xorigo UI 项目中配置的 Model Context Protocol (MCP) 服务器，为项目提供强大的 AI 增强开发能力。

**配置状态**: ✅ 已完成 (9/10 服务器正常运行)
**最后更新**: 2025-10-21
**项目版本**: Xorigo UI v0.1.0

---

## 🎯 MCP 服务器总览

### ✅ 已配置服务器 (9个)

| 序号 | 服务器名称 | 功能类别 | 连接状态 | 主要用途 |
|------|------------|----------|----------|----------|
| 1 | context7 | 📡 文档查询 | ✅ 连接 | 官方技术文档查询 |
| 2 | tavily | 🔍 网络搜索 | ✅ 连接 | 实时信息检索 |
| 3 | magic | 🎨 组件生成 | ✅ 连接 | UI 组件自动生成 |
| 4 | morphllm-fast-apply | ⚡ 代码编辑 | ✅ 连接 | 批量代码处理 |
| 5 | playwright | 🎭 浏览器测试 | ✅ 连接 | E2E 测试和截图 |
| 6 | eslint | ✅ 代码质量 | ✅ 连接 | 代码规范检查 |
| 7 | filesystem | 📁 文件系统 | ✅ 连接 | 项目文件管理 |
| 8 | memory | 🧠 记忆管理 | ✅ 连接 | 会话信息持久化 |
| 9 | sequential-thinking | 🧠 推理引擎 | ✅ 连接 | 复杂问题分析 |

### ❌ 连接失败 (1个)

| 序号 | 服务器名称 | 功能类别 | 连接状态 | 失败原因 |
|------|------------|----------|----------|----------|
| 10 | brave | 🔍 网络搜索 | ❌ 失败 | HTTP 服务连接问题 |

---

## 🔧 详细配置信息

### 📡 1. Context7 MCP

**功能**: 官方库文档查询和框架模式指导

```bash
配置命令:
claude mcp add context7 --scope user --env API_KEY="71c4f017-240e-4e2f-ac28-65a97f19d658" -- npx -y @smithery/cli@latest run @upstash/context7-mcp --key 71c4f017-240e-4e2f-ac28-65a97f19d658
```

**核心能力**:
- ✅ React 19 官方文档查询
- ✅ TypeScript 5.9 特性查找
- ✅ Tailwind CSS 3 配置指南
- ✅ Framer Motion 12 API 文档
- ✅ Vite 构建工具文档

**使用示例**:
```
"查询 React 19 Hooks 的最新特性"
"查找 Tailwind CSS 3 响应式设计最佳实践"
```

### 🔍 2. Tavily MCP

**功能**: 实时网络搜索和信息检索

```bash
配置命令:
claude mcp add tavily --scope user --env TAVILY_API_KEY="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" -- npx -y tavily-mcp@0.1.2
```

**核心能力**:
- ✅ 实时技术资讯搜索
- ✅ 竞品分析和市场研究
- ✅ 学术论文和技术文档检索
- ✅ 最新前端开发趋势追踪

**使用示例**:
```
"搜索 React 19 的最新特性和最佳实践"
"查找 UI 组件库设计系统的发展趋势"
```

### 🎨 3. Magic MCP

**功能**: 21st.dev UI 组件自动生成

```bash
配置命令:
claude mcp add magic --scope user --env API_KEY="0449a560eb217fe3b41680e00ffde4081a89a396fa1c5df74dc9e44f470c0878" -- npx -y @21st-dev/magic@latest
```

**核心能力**:
- ✅ React + TypeScript 组件生成
- ✅ Tailwind CSS 样式集成
- ✅ Framer Motion 动画效果
- ✅ 可访问性支持 (ARIA)
- ✅ 响应式设计适配

**使用示例**:
```
"使用 Magic 创建一个现代化的开关组件"
"生成一个符合 Xorigo UI 设计系统的数据表格"
```

### ⚡ 4. Morphllm Fast Apply MCP

**功能**: 批量代码编辑和模式应用

```bash
配置命令:
claude mcp add morphllm-fast-apply --scope user -- npx -y @morph-llm/morph-fast-apply
```

**核心能力**:
- ✅ 多文件批量编辑
- ✅ 代码模式识别和应用
- ✅ 风格指南统一执行
- ✅ 重构操作自动化

**使用示例**:
```
"批量更新所有组件的 TypeScript 类型定义"
"统一所有组件的命名规范"
```

### 🎭 5. Playwright MCP

**功能**: 浏览器自动化和 E2E 测试

```bash
配置命令:
claude mcp add playwright --scope user -- npx -y @playwright/mcp@latest
```

**核心能力**:
- ✅ 真实浏览器交互测试
- ✅ 页面截图和视觉验证
- ✅ 表单提交和用户流程测试
- ✅ 可访问性自动化检查

**使用示例**:
```
"测试 Toggle 组件在不同浏览器中的显示效果"
"验证表单提交流程的完整性"
```

### ✅ 6. ESLint MCP

**功能**: 代码质量检查和规范执行

```bash
配置命令:
claude mcp add eslint --scope user -- npx eslint-mcp-server
```

**核心能力**:
- ✅ 实时代码质量分析
- ✅ 代码风格一致性检查
- ✅ TypeScript 类型安全验证
- ✅ 最佳实践建议提供

**使用示例**:
```
"检查所有组件的 ESLint 规范合规性"
"提供代码质量改进建议"
```

### 📁 7. Filesystem MCP

**功能**: 项目文件系统直接访问

```bash
配置命令:
claude mcp add filesystem --scope user -- npx @modelcontextprotocol/server-filesystem /home/saken/project/Xorigo-UI
```

**核心能力**:
- ✅ 项目文件批量操作
- ✅ 文件内容搜索和分析
- ✅ 目录结构检查
- ✅ 文件创建、修改、删除

**使用示例**:
```
"分析所有 UI 组件文件的结构"
"批量更新组件的导入语句"
```

### 🧠 8. Memory MCP

**功能**: 会话记忆和信息持久化

```bash
配置命令:
claude mcp add memory --scope user -- npx @modelcontextprotocol/server-memory
```

**核心能力**:
- ✅ 跨会话信息保存
- ✅ 项目配置记忆
- ✅ 重要决策记录
- ✅ 工作状态恢复

**使用示例**:
```
"记住 Xorigo UI 的设计令牌配置"
"保存组件开发的设计决策"
```

### 🧠 9. Sequential Thinking MCP

**功能**: 多步骤推理和复杂问题分析

```bash
配置命令:
claude mcp add sequential-thinking --scope user -- npx -y @modelcontextprotocol/server-sequential-thinking
```

**核心能力**:
- ✅ 复杂问题分解分析
- ✅ 多步骤推理过程
- ✅ 假设验证和测试
- ✅ 系统性解决方案设计

**使用示例**:
```
"分析 Xorigo UI 组件库的架构设计"
"设计新的组件开发流程"
```

---

## 🚀 使用指南

### 💡 最佳实践

#### 1. 组件开发工作流
```
🔍 需求分析 → Tavily 搜索行业最佳实践
🧠 方案设计 → Sequential Thinking 分析架构
🎨 组件创建 → Magic 生成基础组件
✅ 质量检查 → ESLint 验证代码规范
🎭 功能测试 → Playwright 验证交互
📁 项目集成 → Filesystem 批量更新
💾 经验积累 → Memory 保存设计模式
```

#### 2. 代码质量保障
```
✅ 开发阶段: ESLint 实时检查
⚡ 批量处理: Morphllm 统一规范
🎭 测试验证: Playwright 自动化测试
📊 质量报告: Filesystem 分析结果
```

#### 3. 文档和学习
```
📚 技术查询: Context7 官方文档
🔍 趋势研究: Tavily 实时搜索
💾 知识积累: Memory 长期记忆
🧠 深度分析: Sequential 推理解析
```

### 🎯 针对性使用场景

#### UI 组件开发
- **Magic**: 快速生成新组件
- **ESLint**: 确保代码质量
- **Playwright**: 测试交互功能
- **Filesystem**: 管理组件文件

#### 技术研究
- **Tavily**: 搜索最新技术趋势
- **Context7**: 查询官方文档
- **Sequential**: 分析复杂问题
- **Memory**: 保存重要发现

#### 项目管理
- **Filesystem**: 批量文件操作
- **Morphllm**: 代码重构和优化
- **Memory**: 项目配置管理
- **ESLint**: 代码质量监控

---

## 🔗 组合使用示例

### 示例 1: 创建新的 UI 组件

```bash
# 步骤 1: 研究最佳实践
用户: "用 Tavily 搜索现代化开关组件的设计趋势"

# 步骤 2: 生成组件
用户: "使用 Magic 创建一个符合 Xorigo UI 设计系统的开关组件"

# 步骤 3: 质量检查
用户: "用 ESLint 检查新生成的 Toggle 组件代码质量"

# 步骤 4: 功能测试
用户: "用 Playwright 测试 Toggle 组件的交互功能"

# 步骤 5: 项目集成
用户: "用 Filesystem 将 Toggle 组件添加到项目导出文件"

# 步骤 6: 经验保存
用户: "用 Memory 保存 Toggle 组件的设计模式供后续参考"
```

### 示例 2: 代码质量提升

```bash
# 全面代码检查
用户: "用 Filesystem 找到所有组件文件"
用户: "用 ESLint 检查每个组件的代码质量"
用户: "用 Morphllm 批量修复代码风格问题"
用户: "用 Playwright 验证修复后的功能正常"
用户: "用 Memory 记录这次质量改进的经验"
```

### 示例 3: 技术架构分析

```bash
# 深度技术分析
用户: "用 Sequential Thinking 分析 Xorigo UI 的组件架构"
用户: "用 Context7 查询 React 19 组件库最佳实践"
用户: "用 Tavily 搜索竞品组件库的架构设计"
用户: "用 Memory 保存分析结论和改进建议"
```

---

## 🛠️ 配置管理

### 查看当前配置
```bash
claude mcp list
```

### 添加新的 MCP 服务器
```bash
claude mcp add <name> --scope user --env KEY=value -- <command>
```

### 移除 MCP 服务器
```bash
claude mcp remove <name> --scope user
```

### 查看服务器详情
```bash
claude mcp get <name>
```

---

## ⚠️ 故障排除

### 常见问题

#### 1. MCP 服务器连接失败
**症状**: `✗ Failed to connect`
**解决方案**:
- 检查网络连接
- 验证 API Key 有效性
- 重新添加服务器配置

#### 2. 功能不正常
**症状**: 命令执行无响应
**解决方案**:
- 重启 Claude Code
- 检查 MCP 服务器版本
- 查看错误日志

#### 3. 权限问题
**症状**: 文件操作被拒绝
**解决方案**:
- 检查文件系统权限
- 确认工作目录正确
- 使用 sudo 重新配置 (如必要)

### 恢复配置

如果需要重置所有 MCP 配置:
```bash
# 备份当前配置
claude mcp list > mcp-backup.txt

# 重置配置 (谨慎使用)
claude mcp reset-project-choices
```

---

## 📊 性能监控

### 连接状态检查
建议定期运行以下命令检查所有服务器状态:
```bash
claude mcp list
```

期望输出: 9个服务器显示 `✓ Connected`

### 性能优化建议
- 定期清理不使用的 MCP 服务器
- 监控 API 使用量 (特别是 Tavily 和 Magic)
- 保持 MCP 服务器版本更新
- 合理使用 Filesystem 和 Memory 避免过度消耗

---

## 🚀 未来扩展

### 计划添加的 MCP 服务器
1. **Design Tokens MCP** - 设计令牌管理
2. **GitHub MCP** - 代码仓库集成
3. **Storybook MCP** - 文档自动生成
4. **NPM MCP** - 包管理自动化

### 集成优化
- 配置 CI/CD 自动化流程
- 集成更多开发工具
- 增强团队协作功能

---

## 📞 支持和反馈

### 配置问题
- 查看本文档的故障排除部分
- 检查官方 MCP 服务器文档
- 联系项目维护团队

### 功能建议
- 通过项目 Issue 提交建议
- 参与社区讨论
- 贡献使用案例和最佳实践

---

**文档维护**: Xorigo UI Team
**版本**: 1.0.0
**最后更新**: 2025-10-21