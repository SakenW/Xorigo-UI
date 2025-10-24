# 七轴主题系统

> Xorigo UI 的核心主题定制系统，支持 7 个维度的灵活主题配置

## 🎨 系统概述

七轴主题系统是 Xorigo UI 的核心特性，它通过 7 个独立的轴来控制界面的视觉表现，为用户提供极其灵活的主题定制能力。

### 🎯 设计理念

- **灵活性** - 每个轴都可以独立控制，支持无限组合
- **一致性** - 基于设计令牌系统，确保视觉一致性
- **可访问性** - 内置 WCAG 对比度验证，确保可访问性
- **性能** - 基于 CSS 变量，支持实时切换，性能优异

## 🌈 七个轴详解

### 1. Mode 轴 - 模式控制

控制应用的基础显示模式。

```typescript
type ModeAxis = 'light' | 'dark' | 'auto'
```

- **`light`** - 浅色模式，适合白天使用
- **`dark`** - 深色模式，适合夜间使用
- **`auto`** - 自动模式，跟随系统设置

**示例**：
```css
/* 浅色模式 */
:root {
  --color-background: #ffffff;
  --color-text: #1f2937;
}

/* 深色模式 */
:root {
  --color-background: #1f2937;
  --color-text: #f9fafb;
}
```

### 2. Hue 轴 - 色调控制

控制界面的主色调和色温。

```typescript
type HueAxis = 'neutral-warm' | 'neutral-cool' | 'blue' | 'green' | 'purple' | 'orange' | 'red'
```

- **中性色调**：
  - `neutral-warm` - 暖色调中性色
  - `neutral-cool` - 冷色调中性色
- **彩色调**：
  - `blue` - 蓝色系
  - `green` - 绿色系
  - `purple` - 紫色系
  - `orange` - 橙色系
  - `red` - 红色系

**示例**：
```css
/* 蓝色系 */
:root {
  --color-primary-50: #eff6ff;
  --color-primary-500: #3b82f6;
  --color-primary-900: #1e3a8a;
}

/* 暖色调中性 */
:root {
  --color-primary-50: #fefce8;
  --color-primary-500: #eab308;
  --color-primary-900: #713f12;
}
```

### 3. Saturation 轴 - 饱和度控制

控制色彩的鲜艳程度。

```typescript
type SaturationAxis = 'desaturated' | 'standard' | 'vivid' | 'vibrant'
```

- **`desaturated`** - 去饱和度，柔和的色调
- **`standard`** - 标准饱和度，平衡的视觉效果
- **`vivid`** - 高饱和度，鲜明的色彩
- **`vibrant`** - 极高饱和度，活泼的视觉效果

**示例**：
```css
/* 去饱和度 */
--color-primary: hsl(220, 40%, 50%);

/* 标准饱和度 */
--color-primary: hsl(220, 70%, 50%);

/* 高饱和度 */
--color-primary: hsl(220, 90%, 50%);
```

### 4. Lightness 轴 - 亮度控制

控制整体界面的明暗程度。

```typescript
type LightnessAxis = 'dark' | 'dim' | 'bright' | 'extra-bright'
```

- **`dark`** - 深色调，降低整体亮度
- **`dim`** - 柔和调，适中的亮度
- **`bright`** - 明亮调，提高整体亮度
- **`extra-bright`** - 极亮调，高亮度界面

### 5. Density 轴 - 密度控制

控制界面元素的间距和紧凑程度。

```typescript
type DensityAxis = 'compact' | 'comfortable' | 'spacious'
```

- **`compact`** - 紧凑布局，减少间距
- **`comfortable`** - 舒适布局，标准间距
- **`spacious`** - 宽松布局，增加间距

**示例**：
```css
/* 紧凑布局 */
--spacing-xs: 0.25rem;
--spacing-sm: 0.5rem;
--spacing-md: 0.75rem;

/* 舒适布局 */
--spacing-xs: 0.5rem;
--spacing-sm: 0.75rem;
--spacing-md: 1rem;

/* 宽松布局 */
--spacing-xs: 0.75rem;
--spacing-sm: 1rem;
--spacing-md: 1.5rem;
```

### 6. Roundness 轴 - 圆度控制

控制界面元素的圆角程度。

```typescript
type RoundnessAxis = 'sharp' | 'medium' | 'rounded' | 'extra-rounded'
```

- **`sharp`** - 直角设计，无圆角
- **`medium`** - 适中圆角，平衡设计
- **`rounded`** - 圆润设计，较大圆角
- **`extra-rounded`** - 极圆设计，最大圆角

**示例**：
```css
/* 直角设计 */
--border-radius-sm: 0;
--border-radius-md: 0;
--border-radius-lg: 0;

/* 适中圆角 */
--border-radius-sm: 0.25rem;
--border-radius-md: 0.375rem;
--border-radius-lg: 0.5rem;

/* 极圆设计 */
--border-radius-sm: 0.75rem;
--border-radius-md: 1rem;
--border-radius-lg: 1.5rem;
```

### 7. Contrast 轴 - 对比度控制

控制界面元素的对比度水平。

```typescript
type ContrastAxis = 'low' | 'medium' | 'high' | 'extra-high'
```

- **`low`** - 低对比度，柔和的视觉层次
- **`medium`** - 中对比度，标准的可读性
- **`high`** - 高对比度，增强的可读性
- **`extra-high`** - 极高对比度，最大化可读性

## 🎭 配方格式

完整的主题配方由 7 个轴组成，格式如下：

```
<mode>.<hue>.<saturation>.<lightness>.<density>.<roundness>.<contrast>
```

### 示例配方

```typescript
// 标准浅色主题
"light.neutral-warm.standard.bright.comfortable.medium.high"

// 深色专业主题
"dark.neutral-cool.vivid.bright.comfortable.medium.high"

// 活泼彩色主题
"light.blue.vibrant.bright.spacious.rounded.high"

// 极简主题
"light.neutral-cool.desaturated.dim.compact.sharp.medium"

// 高对比度无障碍主题
"dark.neutral-warm.standard.bright.comfortable.medium.extra-high"
```

## 🛠️ 使用方法

### 基础配置

```typescript
import { StyleRecipeProvider } from '@xorigo-ui/core'

function App() {
  return (
    <StyleRecipeProvider recipe="light.neutral-warm.standard.bright.comfortable.medium.high">
      <YourApp />
    </StyleRecipeProvider>
  )
}
```

### 动态切换

```typescript
import { useState } from 'react'
import { StyleRecipeProvider } from '@xorigo-ui/core'

function ThemedApp() {
  const [recipe, setRecipe] = useState('light.neutral-warm.standard.bright.comfortable.medium.high')

  const toggleTheme = () => {
    setRecipe(prev => prev.startsWith('light')
      ? prev.replace('light', 'dark')
      : prev.replace('dark', 'light')
    )
  }

  return (
    <StyleRecipeProvider recipe={recipe}>
      <YourApp />
      <button onClick={toggleTheme}>切换主题</button>
    </StyleRecipeProvider>
  )
}
```

### 预设配方

Xorigo UI 提供了 20+ 预设配方，详见 [主题配方文档](./recipes.md)

## 🔧 高级定制

### 自定义配方

```typescript
import { createRecipe } from '@xorigo-ui/core'

const customRecipe = createRecipe({
  mode: 'dark',
  hue: 'purple',
  saturation: 'vivid',
  lightness: 'bright',
  density: 'comfortable',
  roundness: 'rounded',
  contrast: 'high'
})
```

### 扩展令牌

```typescript
import { extendTheme } from '@xorigo-ui/core'

const customTheme = extendTheme({
  colors: {
    brand: {
      50: '#f0f9ff',
      500: '#0ea5e9',
      900: '#0c4a6e',
    }
  },
  spacing: {
    '18': '4.5rem',
    '88': '22rem',
  }
})
```

### CSS 变量访问

```css
.component {
  background-color: var(--color-background);
  color: var(--color-text);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
}
```

## 🎨 设计令牌映射

七轴系统会自动生成对应的 CSS 变量：

```css
:root {
  /* Mode 轴 */
  --color-background: #ffffff;
  --color-surface: #f8fafc;
  --color-text: #1f2937;

  /* Hue 轴 */
  --color-primary-50: #eff6ff;
  --color-primary-500: #3b82f6;
  --color-primary-900: #1e3a8a;

  /* Saturation 轴 */
  --color-secondary: #64748b;
  --color-accent: #0ea5e9;

  /* Lightness 轴 */
  --brightness-filter: brightness(1);

  /* Density 轴 */
  --spacing-xs: 0.5rem;
  --spacing-sm: 0.75rem;
  --spacing-md: 1rem;

  /* Roundness 轴 */
  --border-radius-sm: 0.375rem;
  --border-radius-md: 0.5rem;
  --border-radius-lg: 0.75rem;

  /* Contrast 轴 */
  --contrast-filter: contrast(1);
  --border-color: rgba(0, 0, 0, 0.1);
}
```

## 🧪 测试与验证

### 对比度测试

```typescript
import { validateContrast } from '@xorigo-ui/core'

const isAccessible = validateContrast('light.neutral-warm.standard.bright.comfortable.medium.high')
// 返回: { aa: true, aaa: false, ratio: 4.8 }
```

### 配方验证

```typescript
import { validateRecipe } from '@xorigo-ui/core'

const validation = validateRecipe('invalid.recipe.format')
// 返回验证错误信息
```

## 📚 相关文档

- [主题配方大全](./recipes.md) - 所有预设配方详解
- [设计令牌系统](./design-tokens.md) - DTCG 标准令牌
- [自定义主题](./custom-themes.md) - 创建自定义主题
- [CSS 变量参考](../api/css-variables.md) - 完整变量列表

---

**Xorigo UI Team** · **七轴主题系统 v1.4**