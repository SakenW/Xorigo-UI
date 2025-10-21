---
name: "Xorigo UI 组件生成器"
description: "根据 Xorigo UI 设计系统自动生成符合规范的 React 组件模板，包含 TypeScript 类型、Tailwind CSS 样式、Framer Motion 动画和主题系统集成"
author: "Xorigo UI Team"
version: "1.0.0"
tags: ["react", "component", "typescript", "tailwind", "design-system"]
---

# Xorigo UI 组件生成器

这个 Skill 专门为 Xorigo UI 设计系统创建符合标准的 React 组件模板。

## 功能特性

自动生成包含以下特性的组件：

- ✅ **TypeScript 类型安全** - 完整的 Props 类型定义
- ✅ **Atomic Design 原则** - 原子化组件设计
- ✅ **主题系统集成** - 使用设计令牌，支持 10 种主题
- ✅ **Tailwind CSS 4** - 响应式设计和样式系统
- ✅ **Framer Motion 12** - 标准动画变体
- ✅ **API 一致性** - 符合 Xorigo UI 组件规范
- ✅ **可访问性支持** - ARIA 属性和键盘导航
- ✅ **forwardRef 支持** - 引用传递和 DOM 操作

## 使用方法

对我说：
- "创建一个 [组件名] 组件"
- "新建一个 [组件类型] 组件，variant 包含 primary 和 secondary"
- "生成一个符合 Xorigo UI 规范的 [组件名]"

## 组件类型支持

### 核心组件 (Atoms)
- Button - 按钮组件
- Input - 输入框组件
- Card - 卡片组件
- Icon - 图标组件
- Badge - 徽章组件
- Avatar - 头像组件

### 交互组件
- Modal - 模态框组件
- Dropdown - 下拉菜单组件
- Tabs - 标签页组件
- Tooltip - 提示框组件

### 布局组件
- Header - 页头组件
- Sidebar - 侧边栏组件
- Grid - 网格组件
- Container - 容器组件

## 生成的组件结构

每个组件将包含：

```
src/components/
├── [ComponentName].tsx          # 主组件文件
├── [ComponentName].test.tsx     # 单元测试
├── [ComponentName].stories.tsx  # Storybook 故事
├── [ComponentName].variants.ts  # 样式变体定义
└── index.ts                     # 导出文件
```

## API 设计标准

生成的组件将遵循以下 API 结构：

```typescript
interface ComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children?: React.ReactNode
  disabled?: boolean
  loading?: boolean
  onClick?: (event: Event) => void
  // ... 组件特定属性
}
```

## 设计令牌集成

组件将自动使用 Xorigo UI 的设计令牌：

- 颜色：`var(--color-primary-500)`
- 间距：`var(--spacing-sm)`
- 圆角：`var(--radius-md)`
- 动画：`var(--transition-fast)`

## 主题兼容性

生成的组件在所有 10 种主题下都能正常工作：
- Midnight (午夜黑)
- Ocean (海洋蓝)
- Forest (森林绿)
- Sunset (夕阳橙)
- Lavender (薰衣草紫)
- Cherry (樱花红)
- Graphite (石墨灰)
- Pearl (珍珠白)
- Golden (金秋黄)
- Crystal (水晶青)

## 质量保证

生成的代码包含：

- **类型检查** - 完整的 TypeScript 类型定义
- **单元测试** - Vitest + Testing Library 测试用例
- **可访问性** - axe-core 可访问性测试
- **响应式测试** - 多屏幕尺寸验证
- **主题测试** - 10 种主题下的视觉效果验证

## 示例请求

**简单请求**：
> "创建一个 Button 组件"

**详细请求**：
> "新建一个 Card 组件，包含 header、content、footer 三个部分，支持 shadow 和 border variant，集成 hover 动画效果"

**批量请求**：
> "生成一套表单组件：Input、Select、Checkbox、Radio，都要有 error 状态"

让我知道你需要创建什么组件，我会立即生成符合 Xorigo UI 标准的完整组件代码！