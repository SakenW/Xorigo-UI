# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 📋 项目概述

**TH-UI** 是从 Trans-Hub 项目中提取的独立 UI 设计系统和组件库。

- **项目类型**: React UI组件库 (可发布npm包)
- **技术栈**: React 19 + TypeScript 5.9 + Tailwind CSS 4 + Framer Motion 12
- **构建工具**: Vite (Library Mode)
- **组件数量**: 25+个组件 (核心、高级、导航、反馈等)
- **主题系统**: 10种配色方案,支持亮暗主题切换

## 🎯 项目状态

**当前阶段**: 规划完成,准备开始迁移

已完成:
- ✅ 源项目分析 (Trans-Hub/packages/admin/src/ui-design/)
- ✅ 目录结构规划 (见 PROJECT-STRUCTURE.md)
- ✅ 迁移计划制定 (见 MIGRATION-PLAN.md)
- ✅ 命名规范设计

待完成:
- ⏳ 项目初始化 (package.json, tsconfig.json, vite.config.ts)
- ⏳ 设计令牌系统迁移
- ⏳ 主题系统迁移
- ⏳ 组件库迁移 (21个组件文件)
- ⏳ 示例项目和文档

## 🏗️ 项目架构

### 核心目录结构
```
src/
├── tokens/          # 设计令牌 (颜色/间距/字体/阴影/动画)
├── theme/           # 主题系统 (10种配色方案)
├── components/      # 组件库 (25+个组件)
├── layouts/         # 布局模板 (4个)
├── hooks/           # 自定义钩子
├── utils/           # 工具函数
└── types/           # 全局类型定义
```

### 组件分类
- **核心组件**: Button (12变体), Card (9变体), Input (5变体), Select, Checkbox
- **高级组件**: MagneticButton, RippleEffect, AnimatedCard, ThemeToggle 等10+个
- **导航组件**: Header, Sidebar, Breadcrumb
- **反馈组件**: Alert, Loading, Notifications
- **数据组件**: DataTable
- **覆盖层**: Modal

## 📝 命名规范

### 文件命名
- **组件文件**: PascalCase (Button.tsx, DataTable.tsx)
- **类型文件**: PascalCase + .types.ts (Button.types.ts)
- **工具文件**: camelCase (cn.ts, useTheme.ts)
- **配置文件**: kebab-case (tailwind.config.ts)
- **文档文件**: kebab-case (getting-started.md)

### 组件组织
每个组件独立目录:
```
Component/
├── Component.tsx           # 实现
├── Component.types.ts      # 类型
├── Component.stories.tsx   # Storybook
├── Component.test.tsx      # 测试
└── index.ts               # 导出
```

### 导出规范
- 使用 barrel exports (index.ts)
- 按功能分组 (Navigation/, Feedback/, Advanced/)
- 支持按需导入和tree-shaking

## 🚀 开发命令 (计划)

```bash
# 开发
npm run dev              # 启动开发服务器
npm run dev:storybook    # 启动Storybook

# 构建
npm run build            # 构建库文件
npm run build:types      # 生成类型声明

# 测试
npm run test             # 运行单元测试
npm run test:e2e         # 运行E2E测试
npm run test:coverage    # 测试覆盖率

# 代码质量
npm run lint             # ESLint检查
npm run lint:fix         # 自动修复
npm run type-check       # TypeScript类型检查
npm run format           # Prettier格式化

# 文档
npm run docs:dev         # 启动文档服务器
npm run docs:build       # 构建文档
```

## 🎨 设计系统核心

### 主题系统
- **10种配色方案**: 经典(light/dark)、现代(cyber/warm)、自然(forest/ocean)、优雅(purple/minimal)、活泼(lemon/rainbow)
- **智能切换**: 支持类别切换、随机主题、搜索功能
- **持久化**: 主题选择自动保存到localStorage

### 设计令牌
- **颜色系统**: 主色、次色、语义色、中性色
- **间距系统**: 4px网格,0-128px完整体系
- **字体系统**: Inter (主字体) + JetBrains Mono (代码)
- **阴影系统**: xs到2xl层级
- **动画系统**: 基于Framer Motion的预设

### 组件变体系统
使用 class-variance-authority (CVA):
- Button: 12种变体 (primary, secondary, success, warning, danger, ghost, outline, glass, neon等)
- Card: 9种变体 (default, elevated, glass, neomorphic, gradient, neon等)
- Input: 5种变体 (default, filled, underline, ghost, neon)

## 🔧 技术栈详解

### 核心依赖
```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "framer-motion": "^12.23.5",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "tailwind-merge": "^2.6.0"
}
```

### 构建工具
- **Vite**: 快速构建,支持Library Mode
- **TypeScript**: 严格模式类型检查
- **Tailwind CSS 4**: 实用优先的CSS框架
- **PostCSS**: CSS处理

### 开发工具
- **Storybook**: 组件开发和文档
- **Vitest**: 单元测试
- **Playwright**: E2E测试
- **ESLint + Prettier**: 代码质量

## 📚 重要文档

- **MIGRATION-PLAN.md**: 详细的迁移计划和阶段划分
- **PROJECT-STRUCTURE.md**: 完整的目录结构和设计决策
- **README.md**: (待创建) 用户使用文档
- **CHANGELOG.md**: (待创建) 版本变更记录

## 🎯 开发原则

### 代码质量
1. **类型安全**: 所有组件完整TypeScript类型定义
2. **测试覆盖**: 单元测试覆盖率 >80%
3. **可访问性**: 遵循WCAG标准,ARIA标签完整
4. **性能优化**: React.memo, useMemo, useCallback合理使用

### 组件设计
1. **一致性**: 统一的API设计和变体系统
2. **可组合性**: 组件可灵活组合使用
3. **可扩展性**: 支持自定义样式和行为
4. **文档完整**: 每个组件有完整的文档和示例

### 主题系统
1. **使用令牌**: 不要硬编码颜色,使用设计令牌
2. **主题适配**: 所有组件在所有主题下正常显示
3. **动画流畅**: 主题切换带有平滑过渡动画
4. **持久化**: 用户选择自动保存

## ⚠️ 重要约束

### 迁移注意事项
1. **移除Next.js依赖**: 去除 'use client' 指令和Next.js特定API
2. **调整导入路径**: 使用相对路径或配置的别名
3. **保持功能完整**: 所有组件变体和主题配置必须完整迁移
4. **peer dependencies**: React, React-DOM, Framer Motion作为对等依赖

### 不要做的事
1. ❌ 不要修改源目录 (/home/saken/project/Trans-Hub/)
2. ❌ 不要硬编码颜色值,必须使用主题令牌
3. ❌ 不要破坏现有的10种主题配色
4. ❌ 不要跳过组件测试和文档

## 🚦 下一步行动

### 立即开始
1. 初始化项目 (package.json, tsconfig.json, vite.config.ts)
2. 安装核心依赖
3. 创建基础目录结构
4. 迁移设计令牌系统

### 后续步骤
参考 MIGRATION-PLAN.md 中的7个阶段:
1. ✅ 项目初始化
2. ⏳ 设计系统迁移
3. ⏳ 核心组件迁移
4. ⏳ 高级组件迁移
5. ⏳ 导航和反馈组件
6. ⏳ 示例和文档
7. ⏳ 构建和发布

---

**源项目**: Trans-Hub/packages/admin/src/ui-design/
**目标**: 独立、可发布的UI组件库
**维护**: TH-UI开发团队
