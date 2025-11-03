---
name: "Xorigo UI 组件生成器"
description: "根据 Xorigo UI 三层结构 + 十一类组件架构自动生成符合规范的 React 组件模板，包含 TypeScript 类型、Tailwind CSS 样式、Framer Motion 动画和主题系统集成"
author: "Xorigo UI Team"
version: "1.5.0"
tags: ["react", "component", "typescript", "tailwind", "design-system", "xorigo-ui-v1.5.0"]
---

**📋 重要更新**: 已根据 Xorigo UI v1.5.0 **三层结构 + 十一类组件 + 稳定性标签** 架构进行完全适配，确保生成的组件结构与官方分类系统完全一致。

**🎯 架构依据**: 基于 [组件分类系统 SSOT v1.5.0](../../../docs/shared/component-taxonomy-v1.5.yaml) 的唯一事实标准

**🏗️ 分类架构**:
```
System Layer (3类): Foundations, System, Primitives
Component Layer (11类): Layout, Navigation, Inputs & Controls, Forms, Data Display, Typography & Media, Charts, Feedback & Status, Overlays, Interactive, Utilities
Composition Layer (3类): Blocks, Templates, Labs
```

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
- 🎯 **组件分类** - 基于 [组件分类系统 SSOT](../../../docs/shared/component-taxonomy-v1.5.yaml) 智能匹配17个分类
- 📁 **目录位置** - 自动放置在正确的 `packages/ui/src/{layer}/{category}/`
- 📝 **文件命名** - kebab-case 文件命名，PascalCase 组件命名
- 🔖 **稳定性标签** - 自动设置合适的 stability (stable/beta/labs)
- 📊 **组件层级** - 自动设置合适的 level (primitive/component/block)
- ⚡ **功能特性** - 根据组件类型自动推断需要的功能
- 🎨 **API设计** - 符合 Xorigo UI 标准的 Props 接口
- 🧪 **测试文件** - 完整的单元测试和 Storybook 故事
- 📦 **元数据** - 自动生成 component-metadata.yaml

### 示例演示
**请求**: "DataTable"
**自动生成**:
```
📁 分类: data-display (Component Layer)
🏷️ 名称: DataTable (data-table)
🔖 稳定性: stable
📊 层级: component
⚡ 功能: pagination, sorting, filtering, selection, variants, accessibility, forwardRef, motion
📂 位置: packages/ui/src/components/data-display/data-table/
📄 文件: 5个 (data-table.tsx, data-table.test.tsx, data-table.stories.tsx, data-table.metadata.yaml, index.ts)
```

**请求**: "ModalDialog"
**自动生成**:
```
📁 分类: overlays (Component Layer)
🏷️ 名称: ModalDialog (modal-dialog)
🔖 稳定性: stable
📊 层级: component
⚡ 功能: portal, focusTrap, escapeHandling, backdrop, size, closeButton, escapeKey
📂 位置: packages/ui/src/components/overlays/modal-dialog/
📄 文件: 5个 (modal-dialog.tsx, modal-dialog.test.tsx, modal-dialog.stories.tsx, modal-dialog.metadata.yaml, index.ts)
```

**请求**: "HeroSection"
**自动生成**:
```
📁 分类: blocks (Composition Layer)
🏷️ 名称: HeroSection (hero-section)
🔖 稳定性: beta
📊 层级: block
⚡ 功能: title, subtitle, cta, background, responsive, animations
📂 位置: packages/ui/src/blocks/marketing/hero-section/
📄 文件: 5个 (hero-section.tsx, hero-section.test.tsx, hero-section.stories.tsx, hero-section.metadata.yaml, index.ts)
```

### 高级请求 (可选)
如果需要特定功能，可以指定：
- "DataTable 带虚拟滚动"
- "ModalDialog 支持拖拽"
- "ColorPicker 支持透明度"

## 组件类型支持 (基于 v1.5.0 架构)

### 🔹 System Layer / 系统层

#### 🎨 Foundations · 设计基础
**路径**: `packages/ui/src/foundations/`
- color-system - 颜色体系
- typography-system - 排版系统
- spacing-system - 间距系统
- radius-system - 圆角系统
- shadow-system - 阴影系统
- motion-effects-tokens - 动效令牌
- z-index-system - 层级系统
- icon-system - 图标系统

#### ⚙️ System · 系统能力
**路径**: `packages/ui/src/system/`
- theming-engine - 主题引擎
- breakpoints-responsive - 响应式断点
- color-modes - 颜色模式
- accessibility-system - 可访问性系统
- internationalization - 国际化
- direction-rtl - RTL支持

#### 🔷 Primitives · 原子级组件
**路径**: `packages/ui/src/primitives/`
- box - 基础容器
- surface - 表面容器
- flex - 弹性布局
- stack - 堆叠布局
- grid - 网格布局
- text - 文本基元
- heading - 标题基元
- button-base - 按钮基元
- input-base - 输入基元
- portal - 传送门
- focus-trap - 焦点陷阱

### 🧩 Component Layer / 组件层

#### 📐 Layout · 布局
**路径**: `packages/ui/src/components/layout/`
- container - 页面容器
- simple-grid - 简单网格
- split-view - 可调面板
- resizable-panel - 可调整面板
- app-layout - 应用布局

#### 🧭 Navigation · 导航
**路径**: `packages/ui/src/components/navigation/`
- navbar - 导航栏
- sidebar - 侧边栏
- app-shell - 应用壳层
- tabs - 标签页
- segmented-control - 分段控制
- breadcrumb - 面包屑
- pagination - 分页
- stepper - 步骤导航

#### 🎛️ Inputs & Controls · 输入与控制
**路径**: `packages/ui/src/components/inputs/`
- button - 按钮
- icon-button - 图标按钮
- button-group - 按钮组
- input - 文本输入
- textarea - 多行文本
- select - 选择器
- combobox - 组合框
- checkbox - 复选框
- radio - 单选框
- switch - 开关
- slider - 滑块
- date-picker - 日期选择
- file-upload - 文件上传

#### 📝 Forms · 表单结构与校验
**路径**: `packages/ui/src/components/forms/`
- form - 表单容器
- form-provider - 表单提供者
- form-field - 表单字段
- field-label - 字段标签
- helper-text - 帮助文本
- error-message - 错误消息
- validation-summary - 校验汇总
- rhf-adapter - React Hook Form适配

#### 📊 Data Display · 数据展示
**路径**: `packages/ui/src/components/data-display/`
- card - 卡片
- statistic-card - 统计卡片
- badge - 徽章
- avatar - 头像
- list - 列表
- table - 表格
- description-list - 描述列表
- timeline - 时间线
- accordion - 手风琴

#### 📝 Typography & Media · 文本与媒体
**路径**: `packages/ui/src/components/typography-media/`
- text - 文本
- heading - 标题
- code - 代码
- image - 图片
- responsive-image - 响应式图片
- video - 视频
- video-player - 视频播放器
- icon - 图标

#### 📈 Charts · 图表（可视化）
**路径**: `packages/ui/src/components/charts/`
- chart-container - 图表容器
- line-chart - 折线图
- bar-chart - 柱状图
- pie-chart - 饼图
- radar-chart - 雷达图
- gauge-chart - 仪表图
- heatmap - 热力图

#### 💬 Feedback & Status · 反馈与状态
**路径**: `packages/ui/src/components/feedback/`
- alert - 警告
- toast - 消息提示
- notification - 通知
- result - 结果状态
- empty-state - 空状态
- skeleton - 骨架屏
- spinner - 加载指示器
- progress - 进度条
- status-dot - 状态点

#### 🎭 Overlays · 浮层
**路径**: `packages/ui/src/components/overlays/`
- modal - 模态框
- dialog - 对话框
- drawer - 抽屉
- popover - 弹出框
- tooltip - 工具提示
- context-menu - 右键菜单
- lightbox - 灯箱

#### 🎯 Interactive · 高阶交互
**路径**: `packages/ui/src/components/interactive/`
- draggable - 可拖拽
- sortable-list - 可排序列表
- virtual-list - 虚拟列表
- infinite-scroll - 无限滚动
- carousel - 轮播
- command-palette - 命令面板
- hotkeys - 快捷键
- tour - 引导

#### 🔧 Utilities · 工具性组件
**路径**: `packages/ui/src/components/utilities/`
- transition - 过渡动画
- responsive - 响应式
- hide-at - 断点隐藏
- error-boundary - 错误边界
- click-away-listener - 点击外部监听

### 📦 Composition Layer / 组合层

#### 🧱 Blocks · 组合区块
**路径**: `packages/ui/src/blocks/`
- hero-section - 英雄区块
- feature-section - 特性区块
- pricing-section - 价格区块
- testimonial-section - 证言区块
- kpi-overview - 关键指标概览
- auth-card - 认证卡片

#### 📄 Templates · 页面模板
**路径**: `packages/ui/src/templates/`
- auth-page-template - 认证页模板
- landing-page-template - 落地页模板
- dashboard-template - 后台模板
- wizard-template - 向导模板

#### 🧪 Labs · 实验组件
**路径**: `packages/ui/src/labs/`
- new-date-range-picker - 新日期范围选择器
- guided-tour - 引导导览
- ai-chat - AI聊天
- 3d-carousel - 3D轮播

**⚠️ 重要**: Workbench 组件位于 `apps/website/src/components/workbench/`，不在组件库中！

## 生成的组件结构 (v1.5.0 三层架构规范)

每个组件将按照 [组件分类系统 SSOT v1.5.0](../../../docs/shared/component-taxonomy-v1.5.yaml) 生成：

```
packages/ui/src/{layer}/{category}/
├── kebab-case-file.tsx         # 主组件文件 (kebab-case)
├── kebab-case-file.test.tsx    # 单元测试文件
├── kebab-case-file.stories.tsx # Storybook 故事文件
├── kebab-case-file.metadata.yaml # 组件元数据
└── index.ts                    # 组件导出文件

# 示例：Inputs & Controls 分类
packages/ui/src/components/inputs/
├── button.tsx                  # 按钮组件
├── button.test.tsx            # 按钮测试
├── button.stories.tsx         # 按钮故事
├── button.metadata.yaml       # 按钮元数据
├── input.tsx                  # 输入框组件
├── input.test.tsx            # 输入框测试
├── input.stories.tsx         # 输入框故事
├── input.metadata.yaml       # 输入框元数据
└── index.ts                  # 分类导出
```

**📋 组件元数据示例**:
```yaml
# button.metadata.yaml
name: "Button"
category: "inputs"
level: "component"
stability: "stable"
description: "基础按钮组件"
tags: ["primary", "secondary", "icon", "size:sm|md|lg"]
dependencies: ["primitives/button-base", "system/theme"]
```

**🏗️ v1.5.0 架构关键特点**:
- **三层结构**: System Layer → Component Layer → Composition Layer
- **17个分类**: 清晰的功能分类和职责边界
- **稳定性标签**: stable/beta/labs 横跨所有分类
- **组件层级**: primitive/component/block 明确区分
- **元数据驱动**: 每个组件都有完整的元数据定义

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

## 📝 统一文件命名最佳实践

> 📘 **参考规范**: `docs/guidelines/naming-guidelines.md` - Xorigo UI 统一命名规范

### React 组件命名标准

**✅ 推荐的命名方式** (基于 Xorigo UI v1.5.1 统一规范):

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

### 统一命名规范优势

- **一致性优先**：整个项目采用统一的命名标准，降低心智负担
- **生态对齐**：遵循 React / Node / ESLint / Storybook 等主流规范
- **可扩展性**：支持生成物、环境差异、阶段演进等多维扩展
- **最小心智负担**：一眼能分辨：组件 / 工具 / 文档 / 阶段报告 / 临时稿

> 💡 **详细规范**：完整的命名规范请参考 `docs/guidelines/naming-guidelines.md`

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