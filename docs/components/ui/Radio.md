# Radio

> UI 组件

## 概述

Radio 是 TH-UI 组件库的核心组件之一，提供了现代化的设计和强大的功能。

## 安装

```bash
npm install @th-ui/core
```

## 导入

```tsx
import { Radio } from '@th-ui/core'
```

## 基础用法

```tsx
function Example() {
  return (
    <Radio />
  )
}
```

## API 参考

### Props

| 属性 | 类型 | 默认值 | 必填 | 说明 |
|------|------|--------|------|------|
| `value` | `string` | 必填 | 是 | - |
| `label` | `React.ReactNode` | - | 否 | - |
| `description` | `string` | - | 否 | - |
| `disabled` | `boolean` | - | 否 | - |
| `className` | `string` | - | 否 | - |

## 可访问性

Radio 组件遵循 WCAG 2.1 AA 标准，支持：

- 键盘导航
- 屏幕阅读器支持
- ARIA 属性标注
- 焦点管理

## 主题支持

Radio 支持 TH-UI 的完整主题系统，包括：

- 亮色/暗色模式自动切换
- 10 种预设主题配色
- 设计令牌系统集成
- 动画效果配置

## TypeScript

Radio 提供完整的 TypeScript 类型定义：

```tsx
interface RadioProps {
  value: string
  label?: React.ReactNode
  description?: string
  disabled?: boolean
  className?: string
}
```

## 相关组件

- [Avatar](./Avatar.md)
- [Badge](./Badge.md)
- [Breadcrumb](./Breadcrumb.md)

---

**版本**: 0.1.0  
**最后更新**: 2025-10-11  
**组件路径**: `packages/core/src/components/ui/Radio.tsx`
