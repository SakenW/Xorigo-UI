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
├── [component-name].tsx          # 主组件文件 (kebab-case)
├── [component-name].test.tsx     # 单元测试 (kebab-case.test.tsx)
├── [component-name].stories.tsx  # Storybook 故事 (kebab-case.stories.tsx)
├── [component-name].variants.ts  # 样式变体定义 (kebab-case.variants.ts)
├── [component-name].types.ts     # 类型定义 (kebab-case.types.ts)
└── index.ts                      # 导出文件
```

**文件命名规范说明**：
- **使用 kebab-case** - 现代前端最佳实践，提供更好的跨平台可读性
- **组件文件**：与组件功能对应的 kebab-case 格式 (`button.tsx`, `data-table.tsx`)
- **类型文件**：以 `.types.ts` 结尾 (`button.types.ts`, `data-table.types.ts`)
- **变体文件**：以 `.variants.ts` 结尾 (`button.variants.ts`, `data-table.variants.ts`)
- **测试文件**：以 `.test.tsx` 结尾 (`button.test.tsx`, `data-table.test.tsx`)
- **Storybook 文件**：以 `.stories.tsx` 结尾 (`button.stories.tsx`, `data-table.stories.tsx`)

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

## 📝 现代文件命名最佳实践

### 为什么选择 kebab-case 文件名

**✅ 推荐的命名方式** (kebab-case 为现代前端标准):

```typescript
// 组件文件 - 使用 kebab-case
button.tsx                 // ✅ 正确
data-table.tsx             // ✅ 正确
user-profile-card.tsx      // ✅ 正确

// 复杂组件名 - 同样使用 kebab-case
color-picker.tsx           // ✅ 正确
date-range-selector.tsx    // ✅ 正确

// 工具函数文件 - kebab-case
format-date.ts             // ✅ 正确
color-utils.ts             // ✅ 正确

// 类型定义文件 - kebab-case
button.types.ts            // ✅ 正确
user-profile.types.ts      // ✅ 正确

// 配置文件 - kebab-case
theme-config.ts            // ✅ 正确
api-endpoints.ts           // ✅ 正确
```

**❌ 避免的命名方式**:

```typescript
// 避免使用 camelCase 文件名
button.tsx                 // ❌ 应该是 button.tsx
colorTokens.ts             // ❌ 应该是 color-tokens.ts
themeUtils.ts              // ❌ 应该是 theme-utils.ts

// 避免使用 PascalCase 文件名
Button.tsx                 // ❌ 应该是 button.tsx
DataTable.tsx              // ❌ 应该是 data-table.tsx
ColorPicker.tsx            // ❌ 应该是 color-picker.tsx
```

### 命名规范优势

- **跨平台兼容性**：kebab-case 在所有操作系统和网络环境下都能正常工作
- **可读性更好**：连字符比驼峰更易读，特别是长文件名
- **URL 友好**：文件名与 URL 路径、路由保持一致风格
- **SEO 优化**：搜索引擎更容易解析 kebab-case 格式的 URL
- **现代标准**：Next.js、Vite、Tailwind CSS 等现代工具都推荐 kebab-case
- **团队协作**：减少命名歧义，提高代码维护效率

## 质量保证

生成的代码包含：

- **类型检查** - 完整的 TypeScript 类型定义
- **单元测试** - Vitest + Testing Library 测试用例
- **可访问性** - axe-core 可访问性测试
- **响应式测试** - 多屏幕尺寸验证
- **主题测试** - 10 种主题下的视觉效果验证
- **文件命名规范** - 严格遵循 kebab-case 现代前端标准

## 示例请求

**简单请求**：
> "创建一个 Button 组件"

**详细请求**：
> "新建一个 Card 组件，包含 header、content、footer 三个部分，支持 shadow 和 border variant，集成 hover 动画效果"

**批量请求**：
> "生成一套表单组件：Input、Select、Checkbox、Radio，都要有 error 状态"

让我知道你需要创建什么组件，我会立即生成符合 Xorigo UI 标准的完整组件代码！