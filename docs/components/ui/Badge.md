# Badge

> UI 组件

## 概述

Badge 是 TH-UI 组件库的核心组件之一，提供了现代化的设计和强大的功能。

## 安装

```bash
npm install @th-ui/core
```

## 导入

```tsx
import { Badge } from '@th-ui/core'
```

## 基础用法

```tsx
function Example() {
  return (
    <Badge />
  )
}
```

## API 参考

### Props

| 属性 | 类型 | 默认值 | 必填 | 说明 |
|------|------|--------|------|------|
| `children` | `React.ReactNode` | - | 否 | - |
| `variant` | `'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'outline-solid'` | - | 否 | - |
| `size` | `'sm' | 'md' | 'lg'` | - | 否 | - |
| `rounded` | `boolean` | - | 否 | - |
| `dot` | `boolean` | - | 否 | - |
| `removable` | `boolean` | - | 否 | - |
| `onRemove` | `() => void` | - | 否 | - |
| `className` | `string` | - | 否 | - |
| `icon` | `React.ReactNode` | - | 否 | - |

## 可访问性

Badge 组件遵循 WCAG 2.1 AA 标准，支持：

- 键盘导航
- 屏幕阅读器支持
- ARIA 属性标注
- 焦点管理

## 主题支持

Badge 支持 TH-UI 的完整主题系统，包括：

- 亮色/暗色模式自动切换
- 10 种预设主题配色
- 设计令牌系统集成
- 动画效果配置

## TypeScript

Badge 提供完整的 TypeScript 类型定义：

```tsx
interface BadgeProps {
  children?: React.ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'outline-solid'
  size?: 'sm' | 'md' | 'lg'
  rounded?: boolean
  dot?: boolean
  // ... 更多属性
}
```

## 相关组件

- [Avatar](./Avatar.md)
- [Breadcrumb](./Breadcrumb.md)
- [Button](./Button.md)

---

**版本**: 0.1.0  
**最后更新**: 2025-10-11  
**组件路径**: `packages/core/src/components/ui/Badge.tsx`
