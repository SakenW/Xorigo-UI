# Avatar

> UI 组件

## 概述

Avatar 是 Xorigo UI 组件库的核心组件之一，提供了现代化的设计和强大的功能。

## 安装

```bash
npm install @xorigo-ui/core
```

## 导入

```tsx
import { Avatar } from '@xorigo-ui/core'
```

## 基础用法

```tsx
function Example() {
  return (
    <Avatar />
  )
}
```

## API 参考

### Props

| 属性 | 类型 | 默认值 | 必填 | 说明 |
|------|------|--------|------|------|
| `src` | `string` | - | 否 | - |
| `alt` | `string` | - | 否 | - |
| `fallback` | `React.ReactNode` | - | 否 | - |
| `size` | `'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'` | - | 否 | - |
| `shape` | `'circle' | 'square'` | - | 否 | - |
| `status` | `'online' | 'offline' | 'away' | 'busy'` | - | 否 | - |
| `statusPosition` | `'top-right' | 'bottom-right' | 'top-left' | 'bottom-left'` | - | 否 | - |
| `bordered` | `boolean` | - | 否 | - |
| `className` | `string` | - | 否 | - |
| `onClick` | `() => void` | - | 否 | - |

## 可访问性

Avatar 组件遵循 WCAG 2.1 AA 标准，支持：

- 键盘导航
- 屏幕阅读器支持
- ARIA 属性标注
- 焦点管理

## 主题支持

Avatar 支持 Xorigo UI 的完整主题系统，包括：

- 亮色/暗色模式自动切换
- 10 种预设主题配色
- 设计令牌系统集成
- 动画效果配置

## TypeScript

Avatar 提供完整的 TypeScript 类型定义：

```tsx
interface AvatarProps {
  src?: string
  alt?: string
  fallback?: React.ReactNode
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  shape?: 'circle' | 'square'
  // ... 更多属性
}
```

## 相关组件

- [Badge](./Badge.md)
- [Breadcrumb](./Breadcrumb.md)
- [Button](./Button.md)

---

**版本**: 0.1.0  
**最后更新**: 2025-10-11  
**组件路径**: `packages/core/src/components/ui/Avatar.tsx`
