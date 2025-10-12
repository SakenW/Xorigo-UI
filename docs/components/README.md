# Xorigo UI 组件文档

> Xorigo UI 组件库完整 API 文档

## 组件总览

Xorigo UI 提供 **42 个**高质量 React 组件，涵盖 UI、高级、反馈、导航和 Radix 集成等多个分类。

## 统计信息

- **组件数量**: 42 / 42
- **Props 总数**: 241
- **变体总数**: 4
- **文档生成日期**: 2025/10/12

## UI 组件

| 组件 | Props 数量 | 变体数量 | 文档路径 |
|------|------------|----------|----------|
| [Avatar](./ui/Avatar.md) | 10 | 0 | `docs/components/ui/Avatar.md` |
| [Badge](./ui/Badge.md) | 9 | 0 | `docs/components/ui/Badge.md` |
| [Breadcrumb](./ui/Breadcrumb.md) | 5 | 0 | `docs/components/ui/Breadcrumb.md` |
| [Button](./ui/Button.md) | 8 | 1 | `docs/components/ui/Button.md` |
| [ButtonGroup](./ui/ButtonGroup.md) | 5 | 1 | `docs/components/ui/ButtonGroup.md` |
| [Card](./ui/Card.md) | 8 | 1 | `docs/components/ui/Card.md` |
| [Checkbox](./ui/Checkbox.md) | 5 | 0 | `docs/components/ui/Checkbox.md` |
| [Combobox](./ui/Combobox.md) | 17 | 0 | `docs/components/ui/Combobox.md` |
| [Command](./ui/Command.md) | 4 | 0 | `docs/components/ui/Command.md` |
| [Divider](./ui/Divider.md) | 6 | 0 | `docs/components/ui/Divider.md` |
| [Input](./ui/Input.md) | 18 | 0 | `docs/components/ui/Input.md` |
| [InputNumber](./ui/InputNumber.md) | 6 | 0 | `docs/components/ui/InputNumber.md` |
| [PasswordInput](./ui/PasswordInput.md) | 1 | 0 | `docs/components/ui/PasswordInput.md` |
| [Pagination](./ui/Pagination.md) | 12 | 0 | `docs/components/ui/Pagination.md` |
| [Radio](./ui/Radio.md) | 5 | 0 | `docs/components/ui/Radio.md` |
| [SearchInput](./ui/SearchInput.md) | 4 | 0 | `docs/components/ui/SearchInput.md` |
| [Select](./ui/Select.md) | 7 | 0 | `docs/components/ui/Select.md` |
| [Skeleton](./ui/Skeleton.md) | 5 | 0 | `docs/components/ui/Skeleton.md` |
| [Spinner](./ui/Spinner.md) | 2 | 1 | `docs/components/ui/Spinner.md` |
| [Switch](./ui/Switch.md) | 9 | 0 | `docs/components/ui/Switch.md` |
| [SwitchNoMotion](./ui/SwitchNoMotion.md) | 7 | 0 | `docs/components/ui/SwitchNoMotion.md` |
| [Textarea](./ui/Textarea.md) | 9 | 0 | `docs/components/ui/Textarea.md` |
| [Tooltip](./ui/Tooltip.md) | 11 | 0 | `docs/components/ui/Tooltip.md` |

## 高级组件

| 组件 | Props 数量 | 变体数量 | 文档路径 |
|------|------------|----------|----------|
| [AdvancedCard](./advanced/AdvancedCard.md) | 0 | 0 | `docs/components/advanced/AdvancedCard.md` |
| [AnimatedCard](./advanced/AnimatedCard.md) | 8 | 0 | `docs/components/advanced/AnimatedCard.md` |
| [Dialog](./advanced/Dialog.md) | 0 | 0 | `docs/components/advanced/Dialog.md` |
| [InteractionStates](./advanced/InteractionStates.md) | 0 | 0 | `docs/components/advanced/InteractionStates.md` |
| [MicroInteractions](./advanced/MicroInteractions.md) | 0 | 0 | `docs/components/advanced/MicroInteractions.md` |

## 反馈组件

| 组件 | Props 数量 | 变体数量 | 文档路径 |
|------|------------|----------|----------|
| [Alert](./feedback/Alert.md) | 7 | 0 | `docs/components/feedback/Alert.md` |
| [Loading](./feedback/Loading.md) | 4 | 0 | `docs/components/feedback/Loading.md` |
| [Modal](./feedback/Modal.md) | 13 | 0 | `docs/components/feedback/Modal.md` |
| [Notification](./feedback/Notification.md) | 0 | 0 | `docs/components/feedback/Notification.md` |
| [Progress](./feedback/Progress.md) | 9 | 0 | `docs/components/feedback/Progress.md` |
| [ThemeToggle](./feedback/ThemeToggle.md) | 4 | 0 | `docs/components/feedback/ThemeToggle.md` |
| [Toast](./feedback/Toast.md) | 0 | 0 | `docs/components/feedback/Toast.md` |

## 导航组件

| 组件 | Props 数量 | 变体数量 | 文档路径 |
|------|------------|----------|----------|
| [Breadcrumb](./navigation/Breadcrumb.md) | 5 | 0 | `docs/components/ui/Breadcrumb.md` |
| [BasicHeader](./navigation/BasicHeader.md) | 0 | 0 | `docs/components/navigation/BasicHeader.md` |
| [DataTable](./navigation/DataTable.md) | 0 | 0 | `docs/components/navigation/DataTable.md` |
| [ResponsiveLayout](./navigation/ResponsiveLayout.md) | 7 | 0 | `docs/components/navigation/ResponsiveLayout.md` |
| [Sidebar](./navigation/Sidebar.md) | 10 | 0 | `docs/components/navigation/Sidebar.md` |
| [Tabs](./navigation/Tabs.md) | 6 | 0 | `docs/components/navigation/Tabs.md` |

## Radix 组件

| 组件 | Props 数量 | 变体数量 | 文档路径 |
|------|------------|----------|----------|
| [Accordion](./radix/Accordion.md) | 0 | 0 | `docs/components/radix/Accordion.md` |
| [DropdownMenu](./radix/DropdownMenu.md) | 0 | 0 | `docs/components/radix/DropdownMenu.md` |

## 快速开始

### 安装

```bash
npm install @xorigo-ui/core
```

### 基础使用

```tsx
import { Button, Card, Input } from '@xorigo-ui/core'

function App() {
  return (
    <Card>
      <Input placeholder="输入内容" />
      <Button variant="primary">提交</Button>
    </Card>
  )
}
```

## 文档说明

每个组件文档包含：

- **概述**: 组件用途和设计理念
- **API 参考**: 完整的 Props 类型定义
- **变体展示**: 所有可用的 variants 和 sizes
- **使用示例**: 基础和高级用法代码
- **可访问性**: ARIA 属性和键盘操作说明
- **主题支持**: 主题系统集成方式
- **TypeScript**: 类型定义和使用方法

## 资源链接

- [项目主页](../../README.md)
- [设计系统](../design-system/README.md)
- [主题配置](../../packages/core/src/theme/README.md)
- [示例代码](../../examples/README.md)

---

**维护**: Xorigo UI Team  
**版本**: 0.1.0  
**技术栈**: React 19 + TypeScript 5.9 + Tailwind CSS 4 + Framer Motion 12
