# 🎨 Xorigo UI 组件库 v1.5

> **三层结构 + 十一类组件 + 稳定性标签** · 对齐 Antd / MUI / Chakra / Mantine 行业共识

**技术栈**：React 19.2.0 + TypeScript 5.9.3 + Tailwind CSS 4.1.14 + Framer Motion 12.0.0

---

## 📋 组件分类体系

Xorigo UI v1.5 采用 **三层结构 + 十一类组件 + 稳定性标签** 的现代化架构体系，对齐行业主流组件库共识，同时保持高度的可扩展性。

### 🏗️ 三层架构体系

```
System Layer (3类)     - 基础设施层
    ↓
Component Layer (11类) - 功能组件层
    ↓
Composition Layer (3类) - 组合应用层
```

### 📊 横向维度

**稳定性标签**（横跨所有分类）：
- 🔒 **stable** - 生产就绪，API稳定，向后兼容
- 🚧 **beta** - 功能基本完成，可能有小的调整
- 🧪 **labs** - 实验性功能，API可能变化，不保证稳定性

**组件层级**：
- 🔷 **primitive** - 原子级组件基元，高复用性
- 🧩 **component** - 完整的功能组件
- 📦 **block** - 组合区块，业务场景拼装

## 📖 详细分类定义

完整的组件分类定义请参考 **单一事实源**：

👉 **[组件分类系统 SSOT v1.5.0](../shared/component-taxonomy-v2025.11.03.yaml)**

该文件包含：
- ✅ **17个完整分类**的详细定义
- ✅ **每个分类的边界和职责**
- ✅ **组件列表和功能说明**
- ✅ **元数据格式和使用规范**

## 🎯 核心优势

### ✅ 对齐行业共识
- **Layout / Navigation / Inputs / Data Display / Feedback / Overlays** - 与 Antd / MUI / Chakra / Mantine 高度对齐
- **Loading 并入 Feedback** - 符合主流组件库做法
- **Charts 独立成类** - 便于专业可视化需求

### ✅ 兼容现代组件库理念
- **Primitives 专心做「砖」** - 少而精，高复用，不强求每个组件都有 primitive 版
- **Blocks/Templates 支持搭建** - 可落地区块和页面骨架，为未来搭建器或模板市场做准备
- **Labs 变成横向维度** - 稳定性标签 + 专区展示，避免分类冲突

### ✅ 清晰的边界划分
- **每类组件有明确职责** - 避免功能重叠和分类混乱
- **依赖关系清晰** - System Layer → Component Layer → Composition Layer
- **可扩展性强** - 支持未来组件增长和新功能扩展

## 🚀 快速开始

### 安装
```bash
# npm
npm install @xorigo-ui/core

# yarn
yarn add @xorigo-ui/core

# pnpm (推荐)
pnpm add @xorigo-ui/core
```

### 基础用法
```typescript
import { Button, Card, Input } from '@xorigo-ui/core'

function MyComponent() {
  return (
    <Card className="p-4">
      <Input placeholder="输入内容..." className="mb-4" />
      <Button variant="primary">提交</Button>
    </Card>
  )
}
```

### 组件查找指南

#### 🔍 按功能需求查找
- **需要布局？** → 查看 `Layout` 分类
- **需要导航？** → 查看 `Navigation` 分类
- **需要输入控件？** → 查看 `Inputs & Controls` 分类
- **需要数据展示？** → 查看 `Data Display` 分类
- **需要反馈提示？** → 查看 `Feedback & Status` 分类

#### 🔍 按稳定性查找
- **生产环境？** → 选择 `stable` 组件
- **新功能尝试？** → 选择 `beta` 组件
- **实验性功能？** → 查看 `Labs` 专区

#### 🔍 按层级查找
- **基础组件？** → 查看 `Primitives` 分类
- **完整功能？** → 查看 `Component Layer` 各分类
- **组合区块？** → 查看 `Blocks` 分类

## 📚 相关文档

### 🎯 核心规范
- **[组件分类系统 SSOT](../shared/component-taxonomy-v2025.11.03.yaml)** - 完整分类定义（唯一事实源）
- **[组件分类系统说明](../shared/component-classification-system-v1.5.md)** - 分类设计理念和使用指南

### 🎨 主题系统
- **[七轴主题系统](../theming/seven-axis-system.md)** - 主题使用指南
- **[主题系统 SSOT](../shared/theme-system-ssot-v1.4.md)** - 主题系统核心规范

### 🛠️ 开发指南
- **[开发环境](../development/README.md)** - 本地开发环境搭建
- **[组件开发](../development/component-development.md)** - 组件开发规范
- **[测试策略](../development/testing.md)** - 测试编写指南

### 📚 API 参考
- **[组件 API](../api/components.md)** - 完整的组件 API 文档
- **[Hooks API](../api/hooks.md)** - 自定义 Hooks 参考
- **[工具函数](../api/utils.md)** - 实用工具函数
- **[类型定义](../api/types.md)** - TypeScript 类型系统

## 🔧 开发工具

### 组件元数据查询
```typescript
import { getComponentMetadata } from '@xorigo-ui/core'

// 查询 Button 组件元数据
const buttonMeta = getComponentMetadata('Button')
// 返回: { name: "Button", category: "inputs", level: "component", stability: "stable", ... }

// 按分类查询组件
const inputComponents = getComponentsByCategory('inputs')
// 返回: ["Button", "Input", "Select", "Checkbox", ...]

// 按稳定性查询组件
const betaComponents = getComponentsByStability('beta')
// 返回: ["HeroSection", "KPIOverview", ...]
```

### 目录结构导航
```bash
# 基于 component-taxonomy-v2025.11.03.yaml 自动生成的目录结构
packages/ui/src/
├── foundations/        # System Layer
├── system/            # System Layer
├── primitives/        # System Layer
├── components/        # Component Layer
│   ├── layout/
│   ├── navigation/
│   ├── inputs/
│   ├── forms/
│   ├── data-display/
│   ├── typography-media/
│   ├── charts/
│   ├── feedback/
│   ├── overlays/
│   ├── interactive/
│   └── utilities/
├── blocks/            # Composition Layer
├── templates/         # Composition Layer
└── labs/              # Composition Layer (stability dimension)
```

## 🤝 贡献指南

### 组件开发流程
1. **查看分类定义** - 参考 `component-taxonomy-v2025.11.03.yaml` 确定组件归属
2. **检查现有组件** - 避免重复开发
3. **遵循稳定性规范** - 合理设置组件稳定性标签
4. **编写完整元数据** - 包含分类、层级、稳定性等信息
5. **更新导出索引** - 确保组件能被正确导入

### 分类扩展原则
- ✅ **对齐现有分类** - 优先归入现有17个分类
- ✅ **考虑行业共识** - 参考主流组件库的分类方式
- ✅ **保持边界清晰** - 避免分类重叠和职责混乱
- ⚠️ **谨慎新增分类** - 需要充分论证和团队共识

## 🌟 线上资源

### 🎯 官方资源
- **GitHub**: [https://github.com/your-org/xorigo-ui](https://github.com/your-org/xorigo-ui)
- **npm**: [https://www.npmjs.com/package/xorigo-ui](https://www.npmjs.com/package/xorigo-ui)
- **文档站点**: [https://xorigo-ui.dev](https://xorigo-ui.dev)

### 💡 示例和模板
- **基础模板**: React + TypeScript + Vite 项目模板
- **Next.js 集成**: Next.js 13+ App Router 集成示例
- **主题定制**: 完整的主题定制示例和工具
- **组件库**: 基于 Storybook 的组件展示

---

**Xorigo UI v1.5** · **现代组件库的典范** · **为卓越用户体验而生**

> 🎨 **设计理念**: 三层结构 + 十一类组件 + 稳定性标签
> 🔧 **技术承诺**: TypeScript 优先 + 可访问性 + 性能优化
> 🚀 **开发体验**: 现代工具链 + 完整文档 + 行业对齐