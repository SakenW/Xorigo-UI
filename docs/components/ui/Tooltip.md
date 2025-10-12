# Tooltip

> UI 组件

## 概述

Tooltip 是 TH-UI 组件库的核心组件之一，提供了现代化的设计和强大的功能。

## 安装

```bash
npm install @th-ui/core
```

## 导入

```tsx
import { Tooltip } from '@th-ui/core'
```

## 基础用法

```tsx
function Example() {
  return (
    <Tooltip />
  )
}
```

## API 参考

### Props

| 属性 | 类型 | 默认值 | 必填 | 说明 |
|------|------|--------|------|------|
| `content` | `React.ReactNode` | 必填 | 是 | - |
| `children` | `React.ReactElement` | 必填 | 是 | - |
| `placement` | `'top' | 'bottom' | 'left' | 'right'` | - | 否 | - |
| `delay` | `number` | - | 否 | - |
| `offset` | `number` | - | 否 | - |
| `className` | `string` | - | 否 | - |
| `arrow` | `boolean` | - | 否 | - |
| `disabled` | `boolean` | - | 否 | - |
| `open` | `boolean` | - | 否 | - |
| `onOpenChange` | `(open: boolean) => void` | - | 否 | - |
| `maxWidth` | `number` | - | 否 | - |

## 可访问性

Tooltip 组件遵循 WCAG 2.1 AA 标准，支持：

- 键盘导航
- 屏幕阅读器支持
- ARIA 属性标注
- 焦点管理

## 主题支持

Tooltip 支持 TH-UI 的完整主题系统，包括：

- 亮色/暗色模式自动切换
- 10 种预设主题配色
- 设计令牌系统集成
- 动画效果配置

## TypeScript

Tooltip 提供完整的 TypeScript 类型定义：

```tsx
interface TooltipProps {
  content: React.ReactNode
  children: React.ReactElement
  placement?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  offset?: number
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
**组件路径**: `packages/core/src/components/ui/Tooltip.tsx`
