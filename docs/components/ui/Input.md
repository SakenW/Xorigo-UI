# Input

> UI 组件

## 概述

Input 是 Xorigo UI 组件库的核心组件之一，提供了现代化的设计和强大的功能。

## 安装

```bash
npm install @xorigo-ui/core
```

## 导入

```tsx
import { Input } from '@xorigo-ui/core'
```

## 基础用法

```tsx
function Example() {
  return (
    <Input placeholder="请输入..." />
  )
}
```

## API 参考

### Props

| 属性 | 类型 | 默认值 | 必填 | 说明 |
|------|------|--------|------|------|
| `label` | `string` | - | 否 | - |
| `error` | `string` | - | 否 | - |
| `helperText` | `string` | - | 否 | - |
| `leftIcon` | `React.ReactNode` | - | 否 | - |
| `rightIcon` | `React.ReactNode` | - | 否 | - |
| `prefix` | `string` | - | 否 | - |
| `suffix` | `string` | - | 否 | - |
| `clearable` | `boolean` | - | 否 | - |
| `onClear` | `() => void` | - | 否 | - |
| `inputSize` | `'sm' | 'md' | 'lg'` | - | 否 | - |
| `variant` | `'default' | 'filled' | 'outlined' | 'underlined' | 'ghost' | 'neon'` | - | 否 | - |
| `floatingLabel` | `boolean` | - | 否 | - |
| `showPasswordToggle` | `boolean` | - | 否 | - |
| `loading` | `boolean` | - | 否 | - |
| `status` | `'default' | 'success' | 'error' | 'warning'` | - | 否 | - |
| `validationState` | `'success' | 'error' | 'warning'` | - | 否 | - |
| `showCharCount` | `boolean` | - | 否 | - |
| `onValidationChange` | `(isValid: boolean) => void` | - | 否 | - |

## 可访问性

Input 组件遵循 WCAG 2.1 AA 标准，支持：

- 键盘导航
- 屏幕阅读器支持
- ARIA 属性标注
- 焦点管理

## 主题支持

Input 支持 Xorigo UI 的完整主题系统，包括：

- 亮色/暗色模式自动切换
- 10 种预设主题配色
- 设计令牌系统集成
- 动画效果配置

## TypeScript

Input 提供完整的 TypeScript 类型定义：

```tsx
interface InputProps {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  // ... 更多属性
}
```

## 相关组件

- [Avatar](./Avatar.md)
- [Badge](./Badge.md)
- [Breadcrumb](./Breadcrumb.md)

---

**版本**: 0.1.0  
**最后更新**: 2025-10-11  
**组件路径**: `packages/core/src/components/ui/Input.tsx`
