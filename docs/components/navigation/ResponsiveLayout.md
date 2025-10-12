# ResponsiveLayout

> 导航组件

## 概述

ResponsiveLayout 是 Xorigo UI 组件库的核心组件之一，提供了现代化的设计和强大的功能。

## 安装

```bash
npm install @xorigo-ui/core
```

## 导入

```tsx
import { ResponsiveLayout } from '@xorigo-ui/core'
```

## 基础用法

```tsx
function Example() {
  return (
    <ResponsiveLayout />
  )
}
```

## API 参考

### Props

| 属性 | 类型 | 默认值 | 必填 | 说明 |
|------|------|--------|------|------|
| `children` | `React.ReactNode` | 必填 | 是 | - |
| `sidebar` | `React.ReactNode` | - | 否 | - |
| `header` | `React.ReactNode` | - | 否 | - |
| `className` | `string` | - | 否 | - |
| `sidebarWidth` | `number` | - | 否 | - |
| `collapsible` | `boolean` | - | 否 | - |
| `defaultCollapsed` | `boolean` | - | 否 | - |

## 可访问性

ResponsiveLayout 组件遵循 WCAG 2.1 AA 标准，支持：

- 键盘导航
- 屏幕阅读器支持
- ARIA 属性标注
- 焦点管理

## 主题支持

ResponsiveLayout 支持 Xorigo UI 的完整主题系统，包括：

- 亮色/暗色模式自动切换
- 10 种预设主题配色
- 设计令牌系统集成
- 动画效果配置

## TypeScript

ResponsiveLayout 提供完整的 TypeScript 类型定义：

```tsx
interface ResponsiveLayoutProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
  header?: React.ReactNode
  className?: string
  sidebarWidth?: number
  // ... 更多属性
}
```

## 相关组件

- [BasicHeader](./BasicHeader.md)
- [DataTable](./DataTable.md)
- [Sidebar](./Sidebar.md)

---

**版本**: 0.1.0  
**最后更新**: 2025-10-11  
**组件路径**: `packages/core/src/components/navigation/ResponsiveLayout.tsx`
