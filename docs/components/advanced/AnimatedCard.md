# AnimatedCard

> 高级组件

## 概述

AnimatedCard 是 TH-UI 组件库的核心组件之一，提供了现代化的设计和强大的功能。

## 安装

```bash
npm install @th-ui/core
```

## 导入

```tsx
import { AnimatedCard } from '@th-ui/core'
```

## 基础用法

```tsx
function Example() {
  return (
    <AnimatedCard />
  )
}
```

## API 参考

### Props

| 属性 | 类型 | 默认值 | 必填 | 说明 |
|------|------|--------|------|------|
| `children` | `React.ReactNode` | 必填 | 是 | - |
| `className` | `string` | - | 否 | - |
| `variant` | `'default' | 'glass' | 'gradient' | 'neumorphic'` | - | 否 | - |
| `hover` | `boolean` | - | 否 | - |
| `interactive` | `boolean` | - | 否 | - |
| `onClick` | `() => void` | - | 否 | - |
| `delay` | `number` | - | 否 | - |
| `duration` | `number` | - | 否 | - |

## 可访问性

AnimatedCard 组件遵循 WCAG 2.1 AA 标准，支持：

- 键盘导航
- 屏幕阅读器支持
- ARIA 属性标注
- 焦点管理

## 主题支持

AnimatedCard 支持 TH-UI 的完整主题系统，包括：

- 亮色/暗色模式自动切换
- 10 种预设主题配色
- 设计令牌系统集成
- 动画效果配置

## TypeScript

AnimatedCard 提供完整的 TypeScript 类型定义：

```tsx
interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'glass' | 'gradient' | 'neumorphic'
  hover?: boolean
  interactive?: boolean
  // ... 更多属性
}
```

## 相关组件

- [AdvancedCard](./AdvancedCard.md)
- [Dialog](./Dialog.md)
- [InteractionStates](./InteractionStates.md)

---

**版本**: 0.1.0  
**最后更新**: 2025-10-11  
**组件路径**: `packages/core/src/components/advanced/AnimatedCard.tsx`
