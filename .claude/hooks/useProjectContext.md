---
name: "useProjectContext"
description: "自动分析 Xorigo UI 项目的技术栈、架构模式和开发环境，提供智能化的开发建议和工具推荐"
version: "1.0.0"
tags: ["project-analysis", "tech-stack", "intelligence", "context-aware"]
---

# useProjectContext Hook

## 🎯 功能概述

`useProjectContext` 是 Xorigo UI 项目的智能上下文感知 Hook，能够自动分析项目的技术栈、架构模式和开发环境，并提供针对性的开发建议和工具推荐。

## 🔍 自动检测能力

### 技术栈分析
- **前端框架**: React 19.2.0 + TypeScript 5.9
- **样式系统**: Tailwind CSS 4.0 + Framer Motion 12.23.5
- **构建工具**: Vite (Library Mode) + Turbopack (Monorepo)
- **包管理**: npm + pnpm workspaces (Monorepo)
- **测试框架**: Vitest + Testing Library + Playwright
- **部署方式**: Docker (开发/生产环境)

### 架构模式识别
- **项目结构**: Monorepo 架构 (`packages/` + `apps/`)
- **组件库**: Atomic Design 原则 (17个核心组件)
- **设计系统**: 10种主题配色 + 七轴风格配方系统
- **开发模式**: Docker 热更新容器 (端口3100)

### 开发环境特征
- **IDE**: VS Code + 相关插件
- **代码质量**: ESLint + Prettier + TypeScript 严格模式
- **文档**: Storybook + 类型生成 (暂时禁用)
- **CI/CD**: GitHub Actions + 自动化测试

## 🚀 智能建议功能

### 工具推荐
基于项目特征，推荐最适合的开发工具：
- **React 开发**: React DevTools Profiler + React Query DevTools
- **样式调试**: Tailwind CSS IntelliSense + CSS Variable Inspector
- **性能分析**: Bundle Analyzer + Web Vitals Extension
- **可访问性**: axe DevTools + WAVE Extension

### 最佳实践建议
提供针对性的开发最佳实践：
- **组件设计**: 使用 Compound Components 模式
- **性能优化**: React.memo + useMemo + useCallback
- **类型安全**: 严格的 TypeScript 配置 + 完整类型定义
- **测试策略**: 单元测试 + 集成测试 + E2E 测试

## 📋 使用场景

### 场景 1: 新组件开发
```
用户: "我需要创建一个新的组件"

Hook 触发:
1. 分析现有组件架构和命名规范
2. 检测组件目录结构和文件组织
3. 推荐合适的组件模式和 API 设计
4. 建议测试策略和文档要求
```

### 场景 2: 性能优化
```
用户: "组件渲染有点慢"

Hook 触发:
1. 分析现有性能瓶颈 (渲染时间、Bundle 大小)
2. 检查主题切换性能
3. 推荐优化方案 (虚拟化、懒加载、Memo)
4. 建议性能监控工具
```

### 场景 3: 主题集成
```
用户: "新组件在不同主题下显示异常"

Hook 触发:
1. 分析七轴风格配方系统的集成
2. 检查设计令牌的正确使用
3. 验证 10 种主题的兼容性
4. 建议主题调试工具和方法
```

## 🔧 技术实现

### 项目扫描算法
```typescript
interface ProjectAnalysis {
  techStack: {
    frameworks: string[]
    buildTools: string[]
    testingTools: string[]
    deploymentTools: string[]
  }

  architecture: {
    structure: 'monorepo' | 'single-package'
    patterns: string[]
    conventions: Record<string, any>
  }

  quality: {
    codeQuality: number
    testCoverage: number
    documentation: number
    performance: number
  }
}
```

### 智能推荐引擎
```typescript
class RecommendationEngine {
  analyzeCodeBase(project: ProjectAnalysis): Suggestion[] {
    const suggestions: Suggestion[] = []

    // 基于项目特征生成建议
    if (project.techStack.frameworks.includes('React')) {
      suggestions.push(this.getReactOptimizations())
    }

    if (project.architecture.structure === 'monorepo') {
      suggestions.push(this.getMonorepoBestPractices())
    }

    return suggestions
  }
}
```

## 📊 输出格式

### 项目概览报告
```
📊 Xorigo UI 项目分析报告
============================
项目类型: React Component Library + Monorepo
技术栈成熟度: 95/100
架构复杂度: 中等

🛠️ 技术栈:
- 前端: React 19.2.0 + TypeScript 5.9
- 样式: Tailwind CSS 4.0 + Framer Motion 12.23.5
- 构建: Vite + Turbopack (Monorepo)
- 测试: Vitest + Playwright + Testing Library

🏗️ 架构特征:
- 结构: Monorepo (packages + apps)
- 组件: Atomic Design (17个核心组件)
- 主题: 10种配色 + 七轴风格配方
- 部署: Docker (开发/生产环境)

💡 智能建议:
1. 考虑启用 TypeScript 严格模式以提升类型安全
2. 建议添加 React Query 处理服务器状态
3. 推荐集成 Storybook 以增强组件文档
4. 建议增加组件性能监控
```

### 开发建议清单
```
✅ 已实现的最佳实践:
- 组件 API 设计一致性
- 设计令牌正确使用
- Docker 环境标准化

🔄 待改进的方面:
- TypeScript 类型声明生成 (当前禁用)
- 测试覆盖率提升 (目标 >80%)
- 组件文档完善 (当前部分缺失)

🎯 优化建议:
1. 启用 vite-plugin-dts 生成类型声明
2. 补充复杂组件的 E2E 测试
3. 完善 Storybook 故事文档
4. 增加性能基准测试
```

## 🎛️ 配置选项

### Hook 配置
```yaml
# .claude/hooks/useProjectContext.yml
config:
  scanDepth: 3                    # 扫描目录深度
  includeDevFiles: true           # 包含开发文件
  analyzeGitHistory: true        # 分析 Git 历史
  checkDependencies: true        # 检查依赖关系

recommendations:
  performance: true              # 性能优化建议
  accessibility: true            # 可访问性建议
  testing: true                 # 测试策略建议
  documentation: true           # 文档完善建议

thresholds:
    techStackMaturity: 80        # 技术栈成熟度阈值
    codeQualityScore: 85         # 代码质量阈值
    performanceScore: 90         # 性能标准阈值
```

## 🔗 与其他工具的集成

### Skills 集成
- **xorigo-component-generator**: 提供组件开发的上下文信息
- **xorigo-code-quality-guard**: 基于项目特征调整质量标准
- **xorigo-performance-optimizer**: 提供性能基线和优化目标

### Sub-agents 集成
- **xorigo-component-master**: 提供组件开发的项目标准
- **xorigo-quality-guardian**: 提供质量检查的项目基准
- **xorigo-workflow-orchestrator**: 提供工作流的项目环境配置

## 📈 性能优化

### 缓存机制
- **项目分析缓存**: 避免重复扫描项目文件
- **推荐缓存**: 缓存常见的开发建议和最佳实践
- **依赖关系缓存**: 缓存依赖图分析结果

### 增量更新
- **文件监听**: 监听项目文件变化，增量更新分析结果
- **智能检测**: 只分析变化的文件和相关部分
- **差异报告**: 提供变更影响的分析报告

## 🚀 未来扩展

### 高级功能
- **AI 驱动的代码审查**: 基于项目特征进行智能代码审查
- **自动重构建议**: 检测代码异味并提供重构方案
- **依赖关系分析**: 深度分析项目依赖和优化建议
- **性能预测**: 预测代码变更对性能的影响

### 团队协作
- **团队知识库**: 收集团队开发经验和最佳实践
- **代码评审标准**: 基于项目特征定制评审标准
- **开发流程优化**: 根据项目特点优化开发工作流

这个 Hook 将为 Xorigo UI 项目提供深度的上下文感知能力，让 Claude 能够基于项目的具体情况提供更精准、更有价值的开发建议。