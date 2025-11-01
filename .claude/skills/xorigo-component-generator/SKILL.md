---
name: "Xorigo UI 组件生成器"
description: "根据 Xorigo UI 设计系统 v1.5.1 自动生成符合规范的 React 组件模板，包含 TypeScript 类型、Tailwind CSS 样式、Framer Motion 动画和主题系统集成"
author: "Xorigo UI Team"
version: "1.5.1"
tags: ["react", "component", "typescript", "tailwind", "design-system", "xorigo-ui-v1.5.1"]
---

**📋 重要更新**: 已根据 Xorigo UI 棕地架构 v1.5.1 进行完全适配，确保生成的组件结构与官方架构文档完全一致。

**🎯 当前迁移状态**: Phase 1 已完成，已成功迁移 32 个核心组件（按照棕地架构 v1.5.1）：
- ✅ **Form** (18个): input, button-group, select, checkbox, switch, radio, slider, textarea, combobox, command, input-number, search-input, password-input, form, fieldset, form-field, validation-message, input-group
- ✅ **Overlays** (8个): modal, dialog, drawer, sheet, popover, hover-card, lightbox, overlay-trigger
- ✅ **Feedback** (6个): alert, toast, notification, progress, loading, theme-toggle

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

## 🤖 智能使用方法

**只需告诉我组件名称，我会自动推断所有细节**：

### 简单请求
- "DataTable"
- "UserCard"
- "ColorPicker"
- "ModalDialog"

### 智能推断能力
我会自动推断：
- 🎯 **组件分类** - 基于名称智能匹配13个分类
- 📁 **目录位置** - 自动放置在正确的 `packages/core/src/{category}/`
- 📝 **文件命名** - PascalCase 文件和文件夹命名
- ⚡ **功能特性** - 根据组件类型自动推断需要的功能
- 🎨 **API设计** - 符合 Xorigo UI 标准的 Props 接口
- 🧪 **测试文件** - 完整的单元测试和 Storybook 故事
- 📦 **导出配置** - 自动更新分类导出文件

### 示例演示
**请求**: "DataTable"
**自动生成**:
```
📁 分类: data-display
🏷️ 名称: DataTable (data-table)
⚡ 功能: pagination, sorting, filtering, selection, variants, accessibility, forwardRef, motion
📂 位置: packages/core/src/data-display/DataTable/
📄 文件: 4个 (DataTable.tsx, DataTable.test.tsx, DataTable.stories.tsx, index.ts)
```

**请求**: "ModalDialog"
**自动生成**:
```
📁 分类: overlays
🏷️ 名称: ModalDialog (modal-dialog)
⚡ 功能: portal, focusTrap, escapeHandling, backdrop, size, closeButton, escapeKey
📂 位置: packages/core/src/overlays/ModalDialog/
```

### 高级请求 (可选)
如果需要特定功能，可以指定：
- "DataTable 带虚拟滚动"
- "ModalDialog 支持拖拽"
- "ColorPicker 支持透明度"

## 组件类型支持 (基于 v1.5.1 架构)

### 🔷 Primitives (原子组件)
**路径**: `packages/core/src/primitives/`
- Button - 按钮组件
- Card - 卡片组件
- Surface - 表面容器组件
- ThemeSwitcher - 主题切换器

### 📝 Form (表单组件)
**路径**: `packages/core/src/form/` (注意：单数命名，符合棕地架构 v1.5.1)
- Input - 基础输入框组件
- Textarea - 文本域组件
- Select - 选择器组件
- Switch - 开关组件
- Checkbox - 复选框组件
- Radio - 单选框组件
- Slider - 滑块组件
- Combobox - 组合框组件
- InputNumber - 数字输入框
- ButtonGroup - 按钮组组件
- SearchInput - 搜索输入框
- PasswordInput - 密码输入框
- Command - 命令输入框
- Form - 表单容器组件
- Fieldset - 字段集组件
- FormField - 表单字段组件
- ValidationMessage - 验证消息组件
- InputGroup - 输入组组件

### 🎭 Overlays (覆盖层组件)
**路径**: `packages/core/src/overlays/`
- Dialog - 对话框组件
- Drawer - 抽屉组件
- Popover - 气泡框组件
- Sheet - 侧边面板组件

### 📊 Data Display (数据展示组件)
**路径**: `packages/core/src/data-display/`
- Table - 表格组件
- List - 列表组件
- Card - 数据卡片组件

### 🔔 Feedback (反馈组件)
**路径**: `packages/core/src/feedback/`
- Alert - 警告提示组件
- Toast - 消息提示组件
- Notification - 通知组件
- Progress - 进度条组件
- Loading - 加载指示器组件
- ThemeToggle - 主题切换组件

### 🎨 Typography (排版组件)
**路径**: `packages/core/src/typography/`
- Heading - 标题组件
- Text - 文本组件
- Code - 代码组件

### 📐 Layout (布局组件)
**路径**: `packages/core/src/layout/`
- Grid - 网格组件
- Container - 容器组件
- Stack - 堆叠组件

### 🧭 Navigation (导航组件)
**路径**: `packages/core/src/navigation/`
- Menu - 菜单组件
- Breadcrumb - 面包屑组件
- Tabs - 标签页组件

### 🏢 Branding (品牌组件)
**路径**: `packages/core/src/branding/`
- Logo - 品牌标识组件

### 🎪 Showcase (展示组件)
**路径**: `packages/core/src/showcase/`
- CodeDemo - 代码演示组件

**⚠️ 重要**: Workbench 组件位于 `apps/website/src/components/workbench/`，不在组件库中！

## 生成的组件结构 (棕地架构 v1.5.1 规范)

每个组件将按照官方棕地架构文档生成：

```
packages/core/src/{category}/
├── kebab-case-file.tsx         # 主组件文件 (kebab-case)
├── kebab-case-file.test.tsx    # 单元测试文件 (可选)
├── kebab-case-file.stories.tsx # Storybook 故事文件 (可选)
└── index.ts                    # 分类导出文件

# 示例：已迁移的 form 分类 (包含所有表单相关组件)
packages/core/src/form/
├── input.tsx                   # 基础输入框
├── button-group.tsx            # 按钮组组件
├── search-input.tsx            # 搜索输入框
├── select.tsx                  # 选择器
├── checkbox.tsx                # 复选框
├── switch.tsx                  # 开关
├── slider.tsx                  # 滑块
├── input-number.tsx            # 数字输入
├── textarea.tsx                # 文本域
├── combobox.tsx                # 组合框
├── command.tsx                 # 命令输入
├── password-input.tsx          # 密码输入
├── radio.tsx                   # 单选框
├── form.tsx                    # 表单容器
├── fieldset.tsx                # 字段集
├── form-field.tsx              # 表单字段
├── validation-message.tsx      # 验证消息
├── input-group.tsx             # 输入组
└── index.ts                    # 分类导出
```

**🏗️ 棕地架构关键特点**:
- **扁平化结构**: 组件直接在 `src/` 分类目录下，无需 `components/` 中间层
- **单数命名**: 使用 `form` 而非 `forms`，保持命名规范统一
- **功能分组**: 相关组件归类到同一分类 (如inputs归类到form)
- **无额外嵌套**: 避免过深的目录层次结构

**📋 棕地架构 v1.5.1 文件命名规范说明**：

### React 组件文件 (kebab-case)
- **主组件文件**: `input.tsx`, `button-group.tsx`, `search-input.tsx`
- **组件名**: `Input`, `ButtonGroup`, `SearchInput` (PascalCase)
- **导入示例**: `import { Input } from '@xorigo-ui/core/form'`

### 其他文件规范
- **测试文件**: `kebab-case-name.test.tsx`
- **Storybook 文件**: `kebab-case-name.stories.tsx`
- **导出文件**: `index.ts` (分类统一导出)

### 关键原则
1. **文件名使用 kebab-case** - 现代前端标准，跨平台兼容
2. **组件名使用 PascalCase** - React 生态最佳实践
3. **扁平化结构**: 直接在 `src/` 分类目录下，无 `components/` 中间层
4. **单数命名**: 使用 `form` 而非 `forms`，符合官方架构规范
5. **功能分组**: 相关组件归类到同一分类 (如inputs归类到form)
6. **与棕地架构完全一致** - 严格按照官方文档执行

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

## 设计令牌集成 (七轴主题系统)

组件将自动使用 Xorigo UI v1.5.1 的七轴主题系统设计令牌：

### 令牌访问方式
```typescript
// ✅ 正确的令牌使用方式
className="bg-[var(--color-primary-500)] text-[var(--color-text-primary)]"
style={{ color: 'var(--color-primary-500)' }}
```

### 七轴主题支持
组件将在所有七轴主题配方下正常工作：
- **模式轴**: light/dark/auto 自动适配
- **色调轴**: 支持自定义色相
- **饱和度轴**: 可调节色彩鲜艳度
- **亮度轴**: 动态明暗程度
- **密度轴**: 空间紧凑度适配
- **圆度轴**: 边角圆润度变化
- **对比度轴**: 视觉对比度支持

### 主题配方示例
- **professional-dark**: 专业商务深色主题
- **creative-light**: 创意设计浅色主题
- **minimal**: 极简主义主题
- **seasonal**: 季节性主题 (spring, autumn等)
- **用户自定义**: 支持用户上传配方

## 正确的导入方式 (v1.4 架构)

```typescript
// ✅ 正确的组件导入方式 (通过分类导入)
import { Input, Button, Select } from '@xorigo-ui/core/inputs'
import { Form, Fieldset, ValidationMessage } from '@xorigo-ui/core/forms'
import { Modal, Dialog, Popover } from '@xorigo-ui/core/overlays'
import { Alert, Toast, Loading } from '@xorigo-ui/core/feedback'

// ✅ 也可以通过主导出导入
import { Input, Form, Modal, Alert } from '@xorigo-ui/core'

// ✅ 单独导入类型
import type { InputProps, FormProps } from '@xorigo-ui/core'

// ❌ 错误的导入方式 (避免使用深层路径)
import { Button } from '../../../packages/core/src/components/inputs/button'
```

### 新架构导出层级

```typescript
// packages/core/src/index.ts (主导出)
export * from './components'

// packages/core/src/components/index.ts (分类导出)
export * from './inputs'
export * from './forms'
export * from './overlays'
export * from './feedback'

// packages/core/src/components/inputs/index.ts (分类内导出)
export { Input } from './input'
export type { InputProps } from './input'
export { ButtonGroup } from './button-group'
// ... 其他inputs组件
```
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