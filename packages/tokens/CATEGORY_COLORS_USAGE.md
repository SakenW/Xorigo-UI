# 🎨 组件分类颜色令牌使用指南

## 概述

组件分类颜色令牌为 Xorigo-UI 的不同组件分类提供了专属的配色方案。该系统包含10个精选分类，每个分类都有完整的颜色配置，包括主色调、渐变色、悬停状态等。

## 特性

- ✅ **10个精选分类**：覆盖所有主要组件类型
- ✅ **完整的颜色配置**：每个分类包含7种颜色状态
- ✅ **TypeScript 类型安全**：完整的类型定义和类型守卫
- ✅ **便捷的API**：提供多种访问方式
- ✅ **渐变系统**：支持多种渐变效果

## 分类列表

| 分类ID | 中文名称 | 描述 | 配色主题 |
|--------|----------|------|----------|
| `ui-basic` | UI 基础组件 | Button, Card, Typography | 优雅的靛蓝渐变 |
| `inputs` | 输入控件 | Input, Checkbox, Select | 温暖的珊瑚渐变 |
| `navigation` | 导航结构 | Navbar, Breadcrumb, Menu | 清新的天蓝渐变 |
| `feedback` | 反馈状态 | Alert, Loading, Spinner | 自然的翠绿渐变 |
| `overlays` | 弹层遮罩 | Modal, Dialog, Drawer | 热情的橙红渐变 |
| `data-display` | 数据展示 | Table, Code, Charts | 深邃的宝蓝渐变 |
| `layout` | 布局分区 | Container, Flex, Grid | 优雅的粉紫渐变 |
| `charts` | 图表组件 | Chart, BarChart, LineChart | 温柔的粉橙渐变 |
| `forms` | 表单容器 | Form, FormField, Fieldset | 优雅的玫瑰渐变 |
| `utilities` | 工具类 | CopyButton, ScrollArea, Portal | 活力的琥珀渐变 |

## 基本使用

### 1. 导入

```typescript
import {
  componentCategoryColors,
  getCategoryColors,
  getPrimaryColor,
  getGradientColor,
  uiBasicColors,
  type ComponentCategoryColors
} from '@xorigo-ui/tokens'
```

### 2. 获取分类颜色配置

```typescript
// 获取完整的颜色配置
const uiBasicColors = getCategoryColors('ui-basic')
if (uiBasicColors) {
  console.log(uiBasicColors.primary)     // #6366f1
  console.log(uiBasicColors.gradient)    // linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)
}
```

### 3. 使用便捷访问器

```typescript
// 获取主色调
const primaryColor = getPrimaryColor('inputs')  // #f43f5e

// 获取渐变色
const gradientColor = getGradientColor('navigation')  // linear-gradient(135deg, #0ea5e9 0%, #38bdf8 50%, #7dd3fc 100%)

// 获取悬停渐变
const hoverGradient = getHoverGradient('feedback')  // linear-gradient(135deg, #34d399 0%, #6ee7b7 50%, #a7f3d0 100%)
```

### 4. 直接使用预定义颜色

```typescript
// 直接使用预定义的颜色常量
const buttonStyle = {
  backgroundColor: uiBasicColors.primary,
  backgroundImage: uiBasicColors.gradient,
  boxShadow: `0 4px 6px ${uiBasicColors.glow}`
}
```

## React 组件示例

```typescript
import React from 'react'
import { getCategoryColors, getPrimaryColor } from '@xorigo-ui/tokens'

interface CategoryCardProps {
  categoryId: string
  title: string
  description: string
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ categoryId, title, description }) => {
  const colors = getCategoryColors(categoryId)

  if (!colors) {
    return null
  }

  return (
    <div
      className="category-card"
      style={{
        background: colors.gradient,
        boxShadow: `0 8px 16px ${colors.glow}`,
        border: `1px solid ${colors.secondary}`
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = colors.hoverGradient
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = colors.gradient
      }}
    >
      <h3 style={{ color: 'white' }}>{title}</h3>
      <p style={{ color: colors.accent }}>{description}</p>
    </div>
  )
}
```

## 高级用法

### 1. 类型检查

```typescript
import { isValidComponentCategoryColors, type ComponentCategoryColors } from '@xorigo-ui/tokens'

function validateColors(colors: unknown): colors is ComponentCategoryColors {
  return isValidComponentCategoryColors(colors)
}

// 使用
const someColors = getColorsFromAPI() // 假设从API获取
if (validateColors(someColors)) {
  // TypeScript 现在知道 someColors 是 ComponentCategoryColors 类型
  console.log(someColors.primary)
}
```

### 2. 动态主题切换

```typescript
import { getCategoryIds, getCategoryColors } from '@xorigo-ui/tkins'

function CategorySelector() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ui-basic')

  const colors = getCategoryColors(selectedCategory)

  return (
    <div>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        {getCategoryIds().map(id => (
          <option key={id} value={id}>{id}</option>
        ))}
      </select>

      {colors && (
        <div style={{ background: colors.gradient, padding: '16px' }}>
          <h3 style={{ color: 'white' }}>当前主题: {selectedCategory}</h3>
        </div>
      )}
    </div>
  )
}
```

### 3. CSS-in-JS 集成

```typescript
import styled from 'styled-components'
import { getPrimaryColor, getGradientColor } from '@xorigo-ui/tokens'

const StyledButton = styled.button<{ categoryId: string }>`
  background: ${props => getGradientColor(props.categoryId) || 'gray'};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    filter: brightness(1.1);
  }

  &:active {
    transform: translateY(1px);
  }
`

// 使用
<StyledButton categoryId="ui-basic">UI基础按钮</StyledButton>
<StyledButton categoryId="inputs">输入控件按钮</StyledButton>
```

## API 参考

### 类型定义

```typescript
interface ComponentCategoryColors {
  primary: string        // 主色调
  secondary: string      // 次要色调
  accent: string         // 强调色
  glow: string          // 发光效果
  gradient: string       // 渐变色
  hoverGradient: string  // 悬停渐变
  selectedGradient: string // 选中渐变
}
```

### 主要函数

- `getCategoryColors(categoryId: string): ComponentCategoryColors | null`
- `getCategoryIds(): string[]`
- `hasCategoryColors(categoryId: string): boolean`
- `getPrimaryColor(categoryId: string): string | null`
- `getGradientColor(categoryId: string): string | null`
- `getHoverGradient(categoryId: string): string | null`

### 预定义颜色常量

- `uiBasicColors`
- `inputsColors`
- `navigationColors`
- `feedbackColors`
- `overlaysColors`
- `dataDisplayColors`
- `layoutColors`
- `chartsColors`
- `formsColors`
- `utilitiesColors`

## 最佳实践

1. **使用类型安全的API**：优先使用提供的函数而不是直接访问对象
2. **检查空值**：使用 `getCategoryColors()` 时总是检查返回值
3. **使用便捷函数**：对于简单的颜色需求，使用 `getPrimaryColor()` 等便捷函数
4. **保持一致性**：在同一个组件中使用同一分类的颜色配置
5. **性能考虑**：预定义的颜色常量比函数调用更高效

## 注意事项

- 所有颜色值都是字符串格式
- 渐变色使用CSS linear-gradient语法
- 发光效果使用rgba格式，包含透明度
- 建议在悬停状态时使用hoverGradient
- 在选中/激活状态时使用selectedGradient