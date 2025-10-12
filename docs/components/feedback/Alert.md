# Alert

> 反馈组件

## 概述

Alert 是 Xorigo UI 组件库的核心组件之一，提供了现代化的设计和强大的功能。

## 安装

```bash
npm install @xorigo-ui/core
```

## 导入

```tsx
import { Alert } from '@xorigo-ui/core'
```

## 基础用法

```tsx
function Example() {
  return (
    <Alert />
  )
}
```

## API 参考

### Props

| 属性 | 类型 | 默认值 | 必填 | 说明 |
|------|------|--------|------|------|
| `title` | `string` | - | 否 | - |
| `message` | `string` | 必填 | 是 | - |
| `variant` | `'info' | 'success' | 'warning' | 'error'` | - | 否 | - |
| `closable` | `boolean` | - | 否 | - |
| `onClose` | `() => void` | - | 否 | - |
| `className` | `string` | - | 否 | - |
| `icon` | `React.ReactNode` | - | 否 | - |

## 可访问性

Alert 组件遵循 WCAG 2.1 AA 标准，支持：

- 键盘导航
- 屏幕阅读器支持
- ARIA 属性标注
- 焦点管理

## 主题支持

Alert 支持 Xorigo UI 的完整主题系统，包括：

- 亮色/暗色模式自动切换
- 10 种预设主题配色
- 设计令牌系统集成
- 动画效果配置

## TypeScript

Alert 提供完整的 TypeScript 类型定义：

```tsx
interface AlertProps {
  title?: string
  message: string
  variant?: 'info' | 'success' | 'warning' | 'error'
  closable?: boolean
  onClose?: () => void
  // ... 更多属性
}
```

## 相关组件

- [Loading](./Loading.md)
- [Modal](./Modal.md)
- [Notification](./Notification.md)

---

**版本**: 0.1.0  
**最后更新**: 2025-10-11  
**组件路径**: `packages/core/src/components/feedback/Alert.tsx`
