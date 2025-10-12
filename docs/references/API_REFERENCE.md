# 📘 Xorigo UI API 参考文档

> **完整的 StyleRecipe 系统 API 文档**

---

## 📦 核心模块

### style-recipe

```typescript
import {
  // Provider
  StyleRecipeProvider,
  useStyleRecipe,
  useStyleRecipeCSS,
  useResponseLevel,
  useAxisLock,

  // Types
  StyleRecipe,
  StyleRecipeID,
  ModeAxis,
  BaseAxis,
  AccentAxis,
  ToneAxis,
  DensityAxis,
  MotionAxis,
  SurfaceAxis,

  // Recipes
  unifiedRecipes,
  getRecipe,
  searchRecipes,
  filterRecipes,

  // Engine
  StyleRecipeEngine,
  parseRecipe,
  validateRecipe,

  // Constants
  DEFAULT_RECIPE,
  RECIPE_CATEGORIES,
} from '@xorigo-ui/core/style-recipe'
```

---

## 🎨 StyleRecipeProvider

### 组件 API

```typescript
interface StyleRecipeProviderProps {
  children: React.ReactNode
  initialRecipe?: StyleRecipeID
  onRecipeChange?: (recipe: StyleRecipe) => void
  enablePersistence?: boolean
  storageKey?: string
}

const StyleRecipeProvider: React.FC<StyleRecipeProviderProps>
```

### Props 说明

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `children` | `ReactNode` | - | 子组件 |
| `initialRecipe` | `StyleRecipeID` | `DEFAULT_RECIPE` | 初始配方 ID |
| `onRecipeChange` | `(recipe: StyleRecipe) => void` | - | 配方变化回调 |
| `enablePersistence` | `boolean` | `false` | 是否持久化到 localStorage |
| `storageKey` | `string` | `'xorigo-ui-recipe'` | localStorage 键名 |

### 使用示例

```typescript
import { StyleRecipeProvider } from '@xorigo-ui/core/style-recipe'

function App() {
  const handleRecipeChange = (recipe: StyleRecipe) => {
    console.log('配方已切换:', recipe.name)
  }

  return (
    <StyleRecipeProvider
      initialRecipe="dark.neutral-cool-mid.analog(purple).vivid.comfortable.expressive.glass"
      onRecipeChange={handleRecipeChange}
      enablePersistence={true}
    >
      <YourApp />
    </StyleRecipeProvider>
  )
}
```

---

## 🪝 Hooks

### useStyleRecipe

获取当前配方和切换方法。

```typescript
interface UseStyleRecipeReturn {
  currentRecipe: StyleRecipe | null
  currentRecipeId: string
  setRecipe: (recipeId: StyleRecipeID) => void
  applyRecipe: (recipe: StyleRecipe) => void
  cssVariables: Record<string, string>
}

function useStyleRecipe(): UseStyleRecipeReturn
```

**返回值**：

| 属性 | 类型 | 说明 |
|------|------|------|
| `currentRecipe` | `StyleRecipe \| null` | 当前配方对象 |
| `currentRecipeId` | `string` | 当前配方 ID |
| `setRecipe` | `(id: StyleRecipeID) => void` | 切换配方（通过 ID） |
| `applyRecipe` | `(recipe: StyleRecipe) => void` | 应用配方（通过对象） |
| `cssVariables` | `Record<string, string>` | 生成的 CSS 变量映射 |

**示例**：

```typescript
import { useStyleRecipe } from '@xorigo-ui/core/style-recipe'

function ThemeSwitcher() {
  const { currentRecipe, setRecipe } = useStyleRecipe()

  return (
    <div>
      <p>当前配方: {currentRecipe?.name}</p>
      <button onClick={() => setRecipe('light.neutral-true-mid.mono(blue).standard.comfortable.standard.soft-shadow')}>
        切换到 Corporate Blue
      </button>
    </div>
  )
}
```

### useStyleRecipeCSS

获取特定 CSS 变量的值。

```typescript
function useStyleRecipeCSS(variableName: string): string
```

**参数**：
- `variableName`: CSS 变量名（例如 `--color-primary-500`）

**返回值**：CSS 变量值（例如 `#3b82f6`）

**示例**：

```typescript
import { useStyleRecipeCSS } from '@xorigo-ui/core/style-recipe'

function ColorDisplay() {
  const primaryColor = useStyleRecipeCSS('--color-primary-500')
  const shadowValue = useStyleRecipeCSS('--surface-shadow')

  return (
    <div>
      <p>主色: {primaryColor}</p>
      <p>阴影: {shadowValue}</p>
    </div>
  )
}
```

### useResponseLevel

获取和设置响应级别（L0-L3）。

```typescript
type ResponseLevel = 'L0' | 'L1' | 'L2' | 'L3'

interface UseResponseLevelReturn {
  level: ResponseLevel
  setLevel: (level: ResponseLevel) => void
  config: ResponseLevelConfig
}

function useResponseLevel(): UseResponseLevelReturn
```

**示例**：

```typescript
import { useResponseLevel } from '@xorigo-ui/core/style-recipe'

function ResponsiveControl() {
  const { level, setLevel, config } = useResponseLevel()

  return (
    <div>
      <p>当前响应级别: {level}</p>
      <p>轴锁: {config.axisLocks.join(', ')}</p>
      <button onClick={() => setLevel('L0')}>基础模式</button>
      <button onClick={() => setLevel('L3')}>完全响应</button>
    </div>
  )
}
```

### useAxisLock

管理轴锁规则。

```typescript
interface AxisLock {
  axis: keyof StyleRecipe
  value: any
  reason: string
}

interface UseAxisLockReturn {
  locks: AxisLock[]
  addLock: (lock: AxisLock) => void
  removeLock: (axis: keyof StyleRecipe) => void
  clearLocks: () => void
}

function useAxisLock(): UseAxisLockReturn
```

**示例**：

```typescript
import { useAxisLock } from '@xorigo-ui/core/style-recipe'

function AxisLockManager() {
  const { locks, addLock, removeLock } = useAxisLock()

  const lockMotion = () => {
    addLock({
      axis: 'motion',
      value: 'subtle.classic',
      reason: '减少动效以提升性能'
    })
  }

  return (
    <div>
      <p>活动轴锁: {locks.length}</p>
      <button onClick={lockMotion}>锁定动效轴</button>
      <button onClick={() => removeLock('motion')}>解锁动效轴</button>
    </div>
  )
}
```

---

## 📋 类型定义

### StyleRecipe

配方完整定义。

```typescript
interface StyleRecipe {
  // 标识
  id: StyleRecipeID
  name: string
  description: string
  category: 'corporate' | 'minimal' | 'tech' | 'creative' | 'classic'

  // 七轴参数
  mode: ModeAxis
  base: BaseAxis
  accent: AccentAxis
  tone: ToneAxis
  density: DensityAxis
  motion: MotionAxis
  surface: SurfaceAxis

  // 元数据
  tags: string[]
  accessibility: {
    contrastLevel: 'AA' | 'AAA'
    cvdFriendly: boolean
    motionSafe: boolean
  }
}
```

### StyleRecipeID

配方 ID 格式（模板字面量类型）。

```typescript
type StyleRecipeID = `${ModeAxis}.${BaseAxis}.${AccentAxis}.${ToneAxis}.${DensityAxis}.${MotionAxis}.${SurfaceAxis}`

// 示例
const id: StyleRecipeID = 'dark.neutral-cool-mid.analog(purple).vivid.comfortable.expressive.glass'
```

### 轴类型

```typescript
// 模式轴
type ModeAxis = 'light' | 'dark' | 'hc'

// 基础轴
type BaseAxis =
  | 'neutral-warm-low' | 'neutral-warm-mid' | 'neutral-warm-high'
  | 'neutral-cool-low' | 'neutral-cool-mid' | 'neutral-cool-high'
  | 'neutral-true-low' | 'neutral-true-mid' | 'neutral-true-high'

// 强调轴
type AccentAxis =
  | `mono(${Color})`
  | `analog(${Color})`
  | `duo(${Color},${Color})`
  | `triadic(${Color})`

type Color = 'red' | 'orange' | 'yellow' | 'green' | 'cyan' | 'blue' | 'purple' | 'magenta'

// 色调轴
type ToneAxis = 'calm' | 'standard' | 'vivid' | 'vibrant'

// 密度轴
type DensityAxis = 'spacious' | 'comfortable' | 'compact'

// 动效轴
type MotionAxis =
  | 'subtle.classic' | 'subtle.spring'
  | 'standard.classic' | 'standard.spring'
  | 'expressive.classic' | 'expressive.spring'

// 表面轴
type SurfaceAxis = 'flat' | 'soft-shadow' | 'elevated' | 'glass' | 'glass+neon'
```

### ColorScale

色阶定义。

```typescript
interface ColorScale {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
  950: string
}
```

---

## ⚙️ 配方查询 API

### getRecipe

根据 ID 获取配方。

```typescript
function getRecipe(id: StyleRecipeID): StyleRecipe | undefined
```

**示例**：

```typescript
import { getRecipe } from '@xorigo-ui/core/style-recipe'

const recipe = getRecipe('dark.neutral-cool-mid.analog(purple).vivid.comfortable.expressive.glass')
console.log(recipe?.name) // "赛博蓝紫"
```

### searchRecipes

搜索配方（按名称、描述、标签）。

```typescript
function searchRecipes(query: string): StyleRecipe[]
```

**示例**：

```typescript
import { searchRecipes } from '@xorigo-ui/core/style-recipe'

const results = searchRecipes('蓝色')
// 返回所有包含"蓝色"的配方
```

### filterRecipes

多维度过滤配方。

```typescript
interface RecipeFilterOptions {
  mode?: ModeAxis
  category?: string
  tone?: ToneAxis
  tags?: string[]
  accessibility?: {
    minContrast?: 'AA' | 'AAA'
    cvdFriendly?: boolean
    motionSafe?: boolean
  }
}

function filterRecipes(options: RecipeFilterOptions): StyleRecipe[]
```

**示例**：

```typescript
import { filterRecipes } from '@xorigo-ui/core/style-recipe'

// 查找所有暗色、高对比度、色弱友好的配方
const darkAccessibleRecipes = filterRecipes({
  mode: 'dark',
  accessibility: {
    minContrast: 'AAA',
    cvdFriendly: true,
  }
})
```

### getRecipesByCategory

按类别获取配方。

```typescript
function getRecipesByCategory(category: string): StyleRecipe[]
```

**示例**：

```typescript
import { getRecipesByCategory } from '@xorigo-ui/core/style-recipe'

const corporateRecipes = getRecipesByCategory('corporate')
const creativeRecipes = getRecipesByCategory('creative')
```

---

## 🔧 配方引擎 API

### StyleRecipeEngine

配方引擎类。

```typescript
class StyleRecipeEngine {
  /**
   * 从配方生成 CSS 变量
   */
  generateCSSVariables(recipe: StyleRecipe): Record<string, string>

  /**
   * 解析配方 ID
   */
  parseRecipeID(id: StyleRecipeID): ParsedRecipe

  /**
   * 验证配方
   */
  validateRecipe(recipe: StyleRecipe): RecipeValidationResult

  /**
   * 生成色板
   */
  generateColorPalette(recipe: StyleRecipe): {
    primary: ColorScale
    neutral: ColorScale
    success: ColorScale
    warning: ColorScale
    error: ColorScale
    info: ColorScale
  }
}
```

**使用示例**：

```typescript
import { StyleRecipeEngine } from '@xorigo-ui/core/style-recipe'

const engine = new StyleRecipeEngine()

// 生成 CSS 变量
const recipe = getRecipe('light.neutral-true-mid.mono(blue).standard.comfortable.standard.soft-shadow')
const variables = engine.generateCSSVariables(recipe!)

console.log(variables['--color-primary-500']) // "#3b82f6"
console.log(variables['--spacing-md']) // "16px"

// 生成色板
const palette = engine.generateColorPalette(recipe!)
console.log(palette.primary[500]) // "#3b82f6"
```

### parseRecipe

解析配方 ID 为七轴参数。

```typescript
interface ParsedRecipe {
  mode: ModeAxis
  base: BaseAxis
  accent: AccentAxis
  tone: ToneAxis
  density: DensityAxis
  motion: MotionAxis
  surface: SurfaceAxis
}

function parseRecipe(id: StyleRecipeID): ParsedRecipe
```

**示例**：

```typescript
import { parseRecipe } from '@xorigo-ui/core/style-recipe'

const parsed = parseRecipe('dark.neutral-cool-mid.analog(purple).vivid.comfortable.expressive.glass')

console.log(parsed.mode)    // "dark"
console.log(parsed.accent)  // "analog(purple)"
console.log(parsed.surface) // "glass"
```

### validateRecipe

验证配方完整性和可访问性。

```typescript
interface RecipeValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  accessibility: {
    contrastValid: boolean
    motionSafe: boolean
    cvdFriendly: boolean
  }
}

function validateRecipe(recipe: StyleRecipe): RecipeValidationResult
```

**示例**：

```typescript
import { validateRecipe } from '@xorigo-ui/core/style-recipe'

const result = validateRecipe(recipe)

if (!result.valid) {
  console.error('配方验证失败:', result.errors)
}

if (result.warnings.length > 0) {
  console.warn('配方警告:', result.warnings)
}
```

---

## 🎨 CSS 变量命名规范

### 颜色变量

```
--color-{palette}-{step}
```

**示例**：
- `--color-primary-500`
- `--color-neutral-200`
- `--color-success-600`

### 间距变量

```
--spacing-{size}
```

**可用值**：`xs`, `sm`, `md`, `lg`, `xl`, `2xl`

### 动效变量

```
--motion-duration-{speed}
--motion-easing
```

**示例**：
- `--motion-duration-fast` → `150ms`
- `--motion-duration-base` → `200ms`
- `--motion-easing` → `cubic-bezier(0.4, 0, 0.2, 1)`

### 表面变量

```
--surface-{property}
```

**示例**：
- `--surface-shadow`
- `--surface-backdrop-blur`
- `--surface-background`
- `--surface-border`

### 字体变量

```
--font-size-{size}
```

**可用值**：`xs`, `sm`, `base`, `lg`, `xl`, `2xl`

---

## 📊 常量

### DEFAULT_RECIPE

```typescript
const DEFAULT_RECIPE: StyleRecipeID =
  'light.neutral-true-mid.mono(gray).standard.comfortable.standard.soft-shadow'
```

### RECIPE_CATEGORIES

```typescript
const RECIPE_CATEGORIES = [
  'corporate',
  'minimal',
  'tech',
  'creative',
  'classic',
] as const
```

### RESPONSE_LEVELS

```typescript
const RESPONSE_LEVELS = ['L0', 'L1', 'L2', 'L3'] as const
```

### STYLE_AXES

```typescript
const STYLE_AXES = {
  MODE: ['light', 'dark', 'hc'],
  BASE: ['neutral-warm', 'neutral-cool', 'neutral-true'],
  TONE: ['calm', 'standard', 'vivid'],
  DENSITY: ['spacious', 'comfortable', 'compact'],
  MOTION: ['subtle', 'standard', 'expressive'],
  SURFACE: ['flat', 'soft-shadow', 'glass', 'neon'],
} as const
```

---

## 🔗 集成示例

### 完整应用示例

```typescript
import React, { useState } from 'react'
import {
  StyleRecipeProvider,
  useStyleRecipe,
  unifiedRecipes,
} from '@xorigo-ui/core/style-recipe'
import { Button, Card } from '@xorigo-ui/core'

function RecipeSwitcher() {
  const { currentRecipe, setRecipe } = useStyleRecipe()

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">配方切换器</h2>
      <p>当前: {currentRecipe?.name}</p>

      <div className="grid grid-cols-3 gap-2">
        {unifiedRecipes.map(recipe => (
          <Button
            key={recipe.id}
            variant={currentRecipe?.id === recipe.id ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setRecipe(recipe.id)}
          >
            {recipe.name}
          </Button>
        ))}
      </div>
    </div>
  )
}

function App() {
  return (
    <StyleRecipeProvider
      initialRecipe="dark.neutral-cool-mid.analog(purple).vivid.comfortable.expressive.glass"
      enablePersistence={true}
    >
      <div className="min-h-screen bg-[var(--color-neutral-50)] dark:bg-[var(--color-neutral-950)]">
        <RecipeSwitcher />

        <div className="p-8">
          <Card>
            <h1 className="text-2xl font-bold mb-4">欢迎使用 Xorigo UI</h1>
            <p className="mb-4">所有组件自动响应配方切换</p>
            <Button variant="primary">主要按钮</Button>
            <Button variant="secondary" className="ml-2">次要按钮</Button>
          </Card>
        </div>
      </div>
    </StyleRecipeProvider>
  )
}

export default App
```

---

## 📚 相关文档

- [完整新系统架构](./NEW_SYSTEM_COMPLETE_GUIDE.md)
- [OKLCH 色彩系统](./OKLCH_COLOR_SYSTEM.md)
- [组件迁移指南](./COMPONENT_MIGRATION_GUIDE.md)
- [Next.js 网站架构](./NEXTJS_GALLERY_ADOPTION_ARCHITECTURE.md)

---

**创建时间**: 2025-01-13
**最后更新**: 2025-01-13
**状态**: 📘 API 参考
**负责人**: Xorigo UI Team
