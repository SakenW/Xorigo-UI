# 📚 Xorigo UI 文档中心

> 完整的文档索引和导航指南

## 🗂️ 文档结构

```
docs/
├── 📖 README.md                           # 主页文档
├── 🚀 guides/                             # 用户指南
│   └── getting-started.md                # 快速开始指南
├── 🎨 components/                         # 组件文档
│   └── README.md                          # 组件总览
├── 🎭 theming/                            # 主题系统
│   └── seven-axis-system.md              # 七轴主题系统
├── 🛠️ development/                        # 开发指南
│   └── README.md                          # 开发环境与规范
├── 🏗️ architecture/                       # 架构文档
│   ├── ui-architecture-ssot-v1.4.md      # UI 架构 SSOT
│   ├── website-architecture-v1.4.md      # Website 架构
│   └── [archive/]                         # 历史归档
├── 🤝 shared/                             # 共享规范
│   ├── theme-system-ssot-v1.4.md         # 主题系统 SSOT
│   ├── component-classification-system.md # 组件分类系统
│   ├── component-classification.yml       # 分类配置
│   └── component-taxonomy-v1.4.yaml      # 组件分类定义
└── 📊 project-info/                       # 项目信息
    ├── OPTIMIZATION_REPORT.md            # 优化报告
    ├── CONTENT_MIGRATION_ANALYSIS.md     # 迁移分析
    └── LEGACY_ARCHIVE_SUMMARY.md         # 归档总结
```

## 🎯 文档优先级

### 🔥 核心文档（必读）
1. **[快速开始指南](./guides/getting-started.md)** - 5分钟集成 Xorigo UI
2. **[主题系统 SSOT v1.4](./shared/theme-system-ssot-v1.4.md)** - 主题系统核心规范
3. **[组件总览](./components/README.md)** - 所有可用组件

### 🏗️ 架构文档（按优先级）
1. **[组件分类系统](./shared/component-classification-system.md)** - 组件分类体系（优先级 1）
2. **[UI 架构 SSOT v1.4](./architecture/ui-architecture-ssot-v1.4.md)** - UI 组件架构（优先级 2）
3. **[Website 架构 v1.4](./architecture/website-architecture-v1.4.md)** - Website 技术架构（优先级 3）

### 🎨 主题系统
1. **[七轴主题系统](./theming/seven-axis-system.md)** - 主题使用指南
2. **[主题系统 SSOT](./shared/theme-system-ssot-v1.4.md)** - 主题系统实现规范

### 📊 项目信息
1. **[优化报告](./OPTIMIZATION_REPORT.md)** - 文档优化工作总结
2. **[内容迁移分析](./CONTENT_MIGRATION_ANALYSIS.md)** - 迁移内容分析
3. **[归档总结](./LEGACY_ARCHIVE_SUMMARY.md)** - 历史文档信息

## 🚀 快速导航

### 新用户推荐阅读路径
1. [快速开始指南](./guides/getting-started.md) → 了解如何安装和使用
2. [组件总览](./components/README.md) → 查看所有可用组件
3. [七轴主题系统](./theming/seven-axis-system.md) → 了解主题定制
4. [开发指南](./development/README.md) → 搭建开发环境

### 开发者推荐阅读路径
1. [主题系统 SSOT](./shared/theme-system-ssot-v1.4.md) → 理解核心主题机制
2. [组件分类系统](./shared/component-classification-system.md) → 了解组件分类
3. [UI 架构 SSOT](./architecture/ui-architecture-ssot-v1.4.md) → 深入 UI 架构设计
4. [开发指南](./development/README.md) → 开发规范和最佳实践

### 架构师推荐阅读路径
1. [所有共享规范](./shared/) → 理解跨模块规范
2. [UI 架构文档](./architecture/ui-architecture-ssot-v1.4.md) → UI 架构设计
3. [Website 架构文档](./architecture/website-architecture-v1.4.md) → Website 技术架构
4. [优化报告](./OPTIMIZATION_REPORT.md) → 了解优化历程

## 🔍 文档状态

| 文档类型 | 状态 | 说明 |
|---------|------|------|
| 🚀 用户指南 | ✅ 完成 | 面向用户的使用指南 |
| 🎨 组件文档 | ✅ 完成 | 组件 API 和使用示例 |
| 🎭 主题系统 | ✅ 完成 | 主题系统完整文档 |
| 🏗️ 架构文档 | ✅ 完成 | UI 和 Website 架构设计 |
| 🤝 共享规范 | ✅ 完成 | 跨模块的共用规范 |
| 📊 项目信息 | ✅ 完成 | 项目历史和分析报告 |

## 📝 文档维护

### 更新原则
- **SSOT 优先**：所有变更必须与 SSOT 文档保持一致
- **版本同步**：文档版本与代码版本保持同步
- **实时更新**：API 变更必须同步更新文档

### 贡献指南
- 新增组件需要更新组件分类系统
- 主题变更需要更新主题系统 SSOT
- 架构变更需要更新对应的架构文档

---

**文档版本**: v1.4
**最后更新**: 2025年10月24日
**维护团队**: Xorigo UI 架构团队

---

> 💡 **提示**: 建议从 [快速开始指南](./guides/getting-started.md) 开始您的 Xorigo UI 之旅！