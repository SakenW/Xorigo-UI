# Xorigo UI v1.4 - 现代化组件库文档体系

> 基于 React 19.2.0 + TypeScript 5.9.3 + Tailwind CSS 4.1.14 + Framer Motion 12.0.0 的现代化 UI 组件库

## 📖 文档导航

### 🚀 快速开始
- [安装指南](./guides/getting-started.md) - 如何安装和配置 Xorigo UI
- [快速上手](./guides/quick-start.md) - 5分钟集成示例
- [基础概念](./guides/fundamentals.md) - 核心概念和设计理念

### 🎨 组件库
- [组件总览](./components/README.md) - 所有组件列表和分类
- [UI 组件](./components/ui/) - 基础 UI 组件集合
- [反馈组件](./components/feedback/) - 用户反馈相关组件
- [导航组件](./components/navigation/) - 导航和布局组件
- [高级组件](./components/advanced/) - 复杂交互组件

### 🎭 主题系统
- [七轴主题系统](./theming/seven-axis-system.md) - 核心主题系统介绍
- [主题配方](./theming/recipes.md) - 20+ 预定义主题配方
- [自定义主题](./theming/custom-themes.md) - 如何创建自定义主题
- [设计令牌](./theming/design-tokens.md) - DTCG 标准令牌系统

### 🏗️ 架构设计
- [共享规范](./shared/) - UI 和 Website 架构的共用规范
  - [主题系统 SSOT v1.4](./shared/theme-system-ssot-v1.4.md) - 主题系统唯一事实文档
  - [组件分类系统](./shared/component-classification-system.md) - 组件分类体系规范
- [UI 架构](./architecture/) - UI 组件架构设计
  - [UI 架构 SSOT v1.4](./architecture/ui-architecture-ssot-v1.4.md) - UI 架构唯一事实文档
- [Website 架构](./architecture/) - Website 技术架构
  - [Website 架构 v1.4](./architecture/website-architecture-v1.4.md) - Website 技术架构文档

### 📊 项目信息
- [优化报告](./OPTIMIZATION_REPORT.md) - 文档优化工作总结
- [内容迁移分析](./CONTENT_MIGRATION_ANALYSIS.md) - 迁移内容分析报告
- [归档总结](./LEGACY_ARCHIVE_SUMMARY.md) - 历史文档归档信息
- [Atomic Design](./architecture/atomic-design.md) - 原子化设计原则
- [TypeScript 集成](./architecture/typescript.md) - 类型系统设计
- [构建系统](./architecture/build-system.md) - Vite 构建配置

### 🛠️ 开发指南
- [开发环境](./development/README.md) - 本地开发环境搭建
- [组件开发](./development/component-development.md) - 组件开发规范
- [测试策略](./development/testing.md) - 测试编写指南
- [发布流程](./development/publishing.md) - 版本发布流程

### 📚 API 参考
- [组件 API](./api/components.md) - 完整的组件 API 文档
- [Hooks API](./api/hooks.md) - 自定义 Hooks 参考
- [工具函数](./api/utils.md) - 实用工具函数
- [类型定义](./api/types.md) - TypeScript 类型系统

### 🚀 部署指南
- [Docker 部署](./deployment/docker.md) - 容器化部署方案
- [生产环境](./deployment/production.md) - 生产环境最佳实践
- [性能优化](./deployment/performance.md) - 性能优化建议

## 🆕 版本亮点

### ✨ v1.4 新特性
- 🎨 **七轴主题系统** - 支持 7 个维度的主题定制
- 📦 **改进的组件 API** - 更加一致和直观的组件接口
- 🚀 **优化的构建性能** - 更快的构建和热更新速度
- 📚 **全新的文档系统** - 基于现代最佳实践的文档架构
- 🛡️ **增强的类型安全** - 完整的 TypeScript 5.9.3 支持
- 🎭 **Framer Motion 12.0.0** - 流畅的动画系统升级

### 🔧 技术栈升级
- **React 19.2.0** - 最新的 React 特性和并发支持 (兼容 18.0.0+)
- **TypeScript 5.9.3** - 增强的类型系统和开发体验
- **Tailwind CSS 4.1.14** - 更强大的样式系统
- **Framer Motion 12.0.0** - 流畅的动画系统
- **Vite 6.x** - 极速的构建工具
- **Vitest** - 现代化的测试框架

## 🌟 为什么选择 Xorigo UI？

### 🎯 开发体验优先
- **完整的 TypeScript 支持** - 智能提示和类型安全
- **原子化设计原则** - 高度可复用的组件设计
- **一致性的 API** - 统一的组件接口模式
- **丰富的示例** - 每个组件都有完整的使用示例

### 🎨 设计系统驱动
- **七轴主题系统** - 灵活的主题定制能力
- **DTCG 标准令牌** - 行业标准的设计令牌系统
- **响应式设计** - 移动优先的响应式布局
- **可访问性优先** - 符合 WCAG 标准的无障碍设计

### 🚀 现代化工具链
- **Vite 构建系统** - 极速的开发和构建体验
- **组件驱动开发** - Storybook 集成的组件开发工作流
- **自动化测试** - 完整的单元测试和 E2E 测试覆盖
- **Docker 支持** - 容器化的开发和部署环境

## 🎨 核心概念

### 七轴风格配方体系

**七个轴**：
1. **Mode** - 模式轴：light / dark / auto
2. **Hue** - 色调轴：色相选择和温度控制
3. **Saturation** - 饱和度轴：色彩鲜艳度调节
4. **Lightness** - 亮度轴：明暗程度控制
5. **Density** - 密度轴：空间紧凑度设置
6. **Roundness** - 圆度轴：边角圆润程度
7. **Contrast** - 对比度轴：视觉对比度水平

**配方 ID 格式**：
```
<mode>.<hue>.<saturation>.<lightness>.<density>.<roundness>.<contrast>

示例:
dark.cool-blue.vivid.bright.comfortable.medium.high
```

### 原子化设计原则

- **Atoms** - 最基础的 UI 元素（Button、Input、Icon）
- **Molecules** - 简单的组件组合（SearchBox、FormField）
- **Organisms** - 复杂的 UI 区域（Header、Sidebar）
- **Templates** - 页面级布局结构
- **Pages** - 具体的页面实现

### CSS 变量系统

组件完全解耦，使用 CSS 变量：

```typescript
// ✅ 新系统
'bg-[var(--color-primary-500)]'
'px-[var(--spacing-md)]'
'duration-[var(--motion-duration-base)]'

// ❌ 旧系统
'bg-gradient-to-r from-blue-500 to-purple-600'
```

## 📂 文档结构

```
docs/
├── README.md                    # 📚 文档首页
├── guides/                      # 📖 用户指南
│   ├── getting-started.md      # 🚀 安装配置指南 (已完成)
│   ├── quick-start.md          # ⚡ 5分钟快速上手 (待创建)
│   ├── fundamentals.md         # 🎯 核心概念详解 (待创建)
│   └── migration-guide.md      # 🔄 版本迁移指南 (待创建)
├── components/                  # 🧩 组件文档
│   └── README.md               # 📋 组件总览 (已完成)
├── theming/                     # 🎨 主题系统
│   ├── seven-axis-system.md    # 🌈 七轴主题详解 (已完成)
│   ├── recipes.md              # 🍽️ 主题配方大全 (待创建)
│   ├── custom-themes.md        # 🛠️ 自定义主题 (待创建)
│   └── design-tokens.md        # 🔧 设计令牌 (待创建)
├── architecture/                # 🏗️ 架构设计
│   ├── overview.md             # 📐 架构概览 (待创建)
│   ├── atomic-design.md        # ⚛️ 原子化设计 (待创建)
│   ├── typescript.md           # 🔷 TypeScript集成 (待创建)
│   └── build-system.md         # ⚙️ 构建系统 (待创建)
├── development/                 # 🛠️ 开发指南
│   └── README.md               # 📋 开发总览 (已完成)
├── api/                         # 📚 API参考
│   ├── components.md           # 🧩 组件API (待创建)
│   ├── hooks.md                # 🎣 Hooks API (待创建)
│   ├── utils.md                # 🔧 工具函数 (待创建)
│   └── types.md                # 🔷 类型定义 (待创建)
├── deployment/                  # 🚀 部署指南
│   ├── docker.md               # 🐳 Docker部署 (待创建)
│   ├── production.md           # 🏭 生产环境 (待创建)
│   └── performance.md          # ⚡ 性能优化 (待创建)
└── archive/                     # 🗄️ 历史文档
    └── legacy-docs-20251024-013819/  # 历史文档归档
```

## 🤝 贡献指南

我们欢迎所有形式的贡献！请查看我们的 [贡献指南](./development/contributing.md) 了解详细信息。

## 📄 许可证

MIT License - 详见 [LICENSE](../LICENSE) 文件

---

**Xorigo UI Team** · **[GitHub](https://github.com/your-org/xorigo-ui)** · **[npm](https://www.npmjs.com/package/xorigo-ui)**