# 🎨 Xorigo UI 完整七轴配方体系架构指南

> **核心理念**：纯粹的七轴风格配方体系，所有配色均为七轴参数的实例，可无限扩展。

---

## 📐 架构概览

### 系统分层

```
┌─────────────────────────────────────────────────────────────┐
│                    📱 应用层 (Application)                    │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Gallery UI  │  │ Demo Site    │  │ User Apps    │       │
│  └─────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   🎨 组件层 (Component)                       │
│  ┌──────────┐  ┌────────┐  ┌───────┐  ┌────────┐          │
│  │ Button   │  │ Card   │  │ Input │  │ ...    │          │
│  │ + CVA    │  │ + CVA  │  │ + CVA │  │ + CVA  │          │
│  └──────────┘  └────────┘  └───────┘  └────────┘          │
│       ↓              ↓          ↓           ↓               │
│  使用 CSS 变量: var(--color-primary-500)                    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                 🔌 Provider 层 (Provider)                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         StyleRecipeProvider                           │  │
│  │  - useStyleRecipe() hook                              │  │
│  │  - 注入 CSS 变量到 :root                              │  │
│  │  - 响应级别控制 (L0-L3)                               │  │
│  │  - 轴锁管理                                           │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                 ⚙️ 引擎层 (Engine)                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         StyleRecipeEngine                             │  │
│  │  ┌──────────────────────────────────────────────┐    │  │
│  │  │  parseRecipeID() → 解析七轴参数                │    │  │
│  │  │         ↓                                      │    │  │
│  │  │  OKLCHColorEngine → 动态生成色板              │    │  │
│  │  │         ↓                                      │    │  │
│  │  │  generateCSSVariables() → CSS 变量映射        │    │  │
│  │  └──────────────────────────────────────────────┘    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  💾 数据层 (Data)                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  unified-recipes.ts (SSOT - 唯一真相来源)            │  │
│  │                                                       │  │
│  │  📦 unifiedRecipes: StyleRecipe[] (当前20个)        │  │
│  │  ┌──────────────────────────────────────────┐       │  │
│  │  │  - 赛博蓝紫                               │       │  │
│  │  │  - 温暖晨曦                               │       │  │
│  │  │  - 粉彩浪漫                               │       │  │
│  │  │  - 自然森林                               │       │  │
│  │  │  - 深海秘境                               │       │  │
│  │  │  - Corporate Blue                        │       │  │
│  │  │  - Minimal White                         │       │  │
│  │  │  - Tech Cyan                             │       │  │
│  │  │  - ... (持续添加更多配方)                 │       │  │
│  │  └──────────────────────────────────────────┘       │  │
│  │                                                       │  │
│  │  所有配方 = 七轴参数 + 元数据                         │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              🌐 生态层 (Ecosystem)                           │
│  ┌──────────┐  ┌──────────┐  ┌─────────────┐  ┌────────┐  │
│  │ Registry │→ │ Gallery  │→ │ Adoption    │→ │ Matrix │  │
│  │ (CDN)    │  │ (展示)   │  │ (取用)      │  │ (规则) │  │
│  └──────────┘  └──────────┘  └─────────────┘  └────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 核心设计原则

### 1. **单一真相来源 (SSOT)**
- `unified-recipes.ts` 是唯一的配方定义文件
- 所有系统都从这里读取数据
- 不允许在其他地方重复定义主题

### 2. **动态色彩生成**
- 使用 OKLCH 色彩空间算法
- 不存储静态颜色值
- 根据七轴参数实时计算完整色板

### 3. **CSS 变量接口**
- 组件不直接依赖 tokens
- 统一使用 CSS 变量：`var(--color-primary-500)`
- 支持运行时动态切换

### 4. **七轴参数化**
- Mode (light/dark/hc)
- Base (neutral-warm/cool/true)
- Accent (mono/analog/triadic)
- Tone (calm/standard/vivid)
- Density (spacious/comfortable/compact)
- Motion (subtle/standard/expressive)
- Surface (flat/soft-shadow/elevated/glass)

---

## 💾 数据层设计

### unified-recipes.ts 结构

```typescript
// src/style-recipe/recipes/unified-recipes.ts

import type { StyleRecipe } from '../types'

/**
 * 🎨 七轴配方定义
 * 每个配方都是七轴参数的具名组合
 */

export const cyberBluePurpleRecipe: StyleRecipe = {
  id: 'dark.neutral-cool-mid.analog(purple).vivid.comfortable.expressive.glass',
  name: '赛博蓝紫',
  description: '经典赛博朋克风格，蓝紫渐变充满科技感',

  // 七轴参数
  mode: 'dark',
  base: 'neutral-cool-mid',
  accent: 'analog(purple)',
  tone: 'vivid',
  density: 'comfortable',
  motion: 'expressive.spring',
  surface: 'glass',

  // 元数据
  tags: ['科技', '未来', '赛博朋克'],
  accessibility: { contrastLevel: 'AA', cvdFriendly: true, motionSafe: false },
}

export const warmSunriseRecipe: StyleRecipe = {
  id: 'light.neutral-warm-high.analog(orange).vibrant.comfortable.standard.soft-shadow',
  name: '温暖晨曦',
  description: '温馨活力的橙色主题，如清晨的第一缕阳光',

  mode: 'light',
  base: 'neutral-warm-high',
  accent: 'analog(orange)',
  tone: 'vibrant',
  density: 'comfortable',
  motion: 'standard.spring',
  surface: 'soft-shadow',

  tags: ['温暖', '活力', '清新'],
  accessibility: { contrastLevel: 'AA', cvdFriendly: true, motionSafe: true },
}

export const corporateBlueRecipe: StyleRecipe = {
  id: 'light.neutral-cool-mid.mono(blue).standard.comfortable.standard.soft-shadow',
  name: 'Corporate Blue',
  description: '专业企业级蓝色主题，适用于SaaS控制台',

  mode: 'light',
  base: 'neutral-cool-mid',
  accent: 'mono(blue)',
  tone: 'standard',
  density: 'comfortable',
  motion: 'standard.classic',
  surface: 'soft-shadow',

  tags: ['professional', 'business', 'saas'],
  accessibility: { contrastLevel: 'AA', cvdFriendly: true, motionSafe: true },
}

// ... 其余17个配方定义

/**
 * 🌟 统一配方列表（当前20个，持续扩展中）
 *
 * 所有配方地位平等，都是七轴参数的实例
 * 未来会持续添加更多配方
 */
export const unifiedRecipes: StyleRecipe[] = [
  cyberBluePurpleRecipe,        // 1. 赛博蓝紫
  warmSunriseRecipe,            // 2. 温暖晨曦
  pinkRomanceRecipe,            // 3. 粉彩浪漫
  forestNatureRecipe,           // 4. 自然森林
  deepOceanRecipe,              // 5. 深海秘境
  royalVioletRecipe,            // 6. 高贵紫罗兰
  minimalBlackWhiteRecipe,      // 7. 极简黑白
  vibrantLemonRecipe,           // 8. 活力柠檬
  dreamyRainbowRecipe,          // 9. 梦幻彩虹
  carnivalCircusRecipe,         // 10. 嘉年华马戏团
  corporateBlueRecipe,          // 11. Corporate Blue
  corporateNavyDarkRecipe,      // 12. Corporate Navy Dark
  minimalWhiteRecipe,           // 13. Minimal White
  minimalGraphiteDarkRecipe,    // 14. Minimal Graphite Dark
  techCyanRecipe,               // 15. Tech Cyan
  techNeonDarkRecipe,           // 16. Tech Neon Dark
  creativePurpleRecipe,         // 17. Creative Purple
  creativeAuroraDarkRecipe,     // 18. Creative Aurora Dark
  classicNeutralRecipe,         // 19. Classic Neutral
  highContrastProRecipe,        // 20. High Contrast Pro
  // 未来持续添加...
]
```

### 配方查询工具

```typescript
// src/style-recipe/recipes/unified-recipes.ts

/**
 * 配方映射表 - O(1) 查询
 */
export const unifiedRecipeMap: Record<string, StyleRecipe> =
  unifiedRecipes.reduce((map, recipe) => {
    map[recipe.id] = recipe
    return map
  }, {} as Record<string, StyleRecipe>)

/**
 * 多维度过滤
 */
export function filterUnifiedRecipes(options: RecipeFilterOptions): StyleRecipe[] {
  return unifiedRecipes.filter(recipe => {
    if (options.mode && recipe.mode !== options.mode) return false
    if (options.category && recipe.category !== options.category) return false
    if (options.tone && recipe.tone !== options.tone) return false
    return true
  })
}

/**
 * 搜索配方
 */
export function searchUnifiedRecipes(query: string): StyleRecipe[] {
  const lowercaseQuery = query.toLowerCase()
  return unifiedRecipes.filter(recipe =>
    recipe.name.toLowerCase().includes(lowercaseQuery) ||
    recipe.description.toLowerCase().includes(lowercaseQuery) ||
    recipe.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}
```

---

## ⚙️ 引擎层设计

### OKLCH 色彩引擎

```typescript
// src/style-recipe/engine/oklch-color-engine.ts

/**
 * OKLCH 色彩空间参数
 */
interface OKLCHColor {
  l: number  // Lightness (0-1)
  c: number  // Chroma (0-0.4)
  h: number  // Hue (0-360)
}

/**
 * 色彩策略接口
 */
interface ColorStrategy {
  generatePalette(baseHue: number, params: StyleRecipe): ColorScale
}

/**
 * 单色策略 (mono)
 */
class MonochromaticStrategy implements ColorStrategy {
  generatePalette(baseHue: number, params: StyleRecipe): ColorScale {
    const palette: ColorScale = {}

    // 根据 tone 参数调整 chroma
    const chromaMultiplier = {
      'calm': 0.6,
      'standard': 1.0,
      'vivid': 1.4,
    }[params.tone]

    // 生成 50-950 色阶
    for (const step of [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]) {
      const lightness = this.calculateLightness(step, params.mode)
      const chroma = this.calculateChroma(step) * chromaMultiplier

      palette[step] = oklchToHex({
        l: lightness,
        c: chroma,
        h: baseHue,
      })
    }

    return palette
  }

  private calculateLightness(step: number, mode: ModeAxis): number {
    // 根据 mode 和 step 计算亮度
    const baseLightness = step / 1000

    if (mode === 'dark') {
      // 暗色模式反转亮度
      return 1 - baseLightness
    }

    return baseLightness
  }

  private calculateChroma(step: number): number {
    // 500 色阶 chroma 最高，两端降低
    const distance = Math.abs(step - 500) / 500
    return 0.15 * (1 - distance * 0.5)
  }
}

/**
 * 类似色策略 (analog)
 */
class AnalogousStrategy implements ColorStrategy {
  generatePalette(baseHue: number, params: StyleRecipe): ColorScale {
    // 提取主色调：analog(purple) → 'purple'
    const mainColor = params.accent.match(/\((\w+)\)/)?.[1] || 'blue'

    // 色相映射
    const hueMap: Record<string, number> = {
      'red': 0,
      'orange': 30,
      'yellow': 60,
      'green': 120,
      'cyan': 180,
      'blue': 240,
      'purple': 280,
      'magenta': 320,
    }

    const mainHue = hueMap[mainColor] || baseHue

    // 生成类似色（±30° 范围）
    return new MonochromaticStrategy().generatePalette(mainHue, params)
  }
}

/**
 * 三色策略 (triadic)
 */
class TriadicStrategy implements ColorStrategy {
  generatePalette(baseHue: number, params: StyleRecipe): ColorScale {
    // 三色：120° 间隔
    const mainHue = baseHue
    const secondary = (baseHue + 120) % 360
    const tertiary = (baseHue + 240) % 360

    // 生成主色板
    return new MonochromaticStrategy().generatePalette(mainHue, params)
  }
}

/**
 * OKLCH 色彩引擎
 */
export class OKLCHColorEngine {
  private strategies: Record<string, ColorStrategy> = {
    'mono': new MonochromaticStrategy(),
    'analog': new AnalogousStrategy(),
    'triadic': new TriadicStrategy(),
  }

  /**
   * 根据配方生成完整色板
   */
  generateColorPalette(recipe: StyleRecipe): {
    primary: ColorScale
    neutral: ColorScale
    success: ColorScale
    warning: ColorScale
    error: ColorScale
  } {
    // 解析 accent 策略
    const strategyType = recipe.accent.split('(')[0] as 'mono' | 'analog' | 'triadic'
    const strategy = this.strategies[strategyType]

    // 生成主色板
    const primary = strategy.generatePalette(240, recipe)

    // 生成中性色板
    const neutral = this.generateNeutralPalette(recipe.base, recipe.mode)

    // 生成状态色板
    const success = strategy.generatePalette(120, recipe) // 绿色
    const warning = strategy.generatePalette(60, recipe)  // 黄色
    const error = strategy.generatePalette(0, recipe)     // 红色

    return { primary, neutral, success, warning, error }
  }

  private generateNeutralPalette(base: BaseAxis, mode: ModeAxis): ColorScale {
    const palette: ColorScale = {}

    // 基础色温
    const warmth = base.includes('warm') ? 30 : base.includes('cool') ? 230 : 0
    const chromaLevel = base.includes('high') ? 0.02 : base.includes('mid') ? 0.01 : 0

    for (const step of [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]) {
      const lightness = mode === 'dark' ? 1 - step / 1000 : step / 1000

      palette[step] = oklchToHex({
        l: lightness,
        c: chromaLevel,
        h: warmth,
      })
    }

    return palette
  }
}

/**
 * OKLCH 转 HEX
 */
function oklchToHex(color: OKLCHColor): string {
  // 实现 OKLCH → sRGB → HEX 转换
  // 使用 culori 库或自定义算法
  // ...
  return '#000000' // 示例
}
```

### CSS 变量生成器

```typescript
// src/style-recipe/engine/css-variable-generator.ts

export class CSSVariableGenerator {
  /**
   * 从配方生成 CSS 变量映射
   */
  generateVariables(recipe: StyleRecipe): Record<string, string> {
    const colorEngine = new OKLCHColorEngine()
    const colorPalette = colorEngine.generateColorPalette(recipe)

    const variables: Record<string, string> = {}

    // 1. 颜色变量
    this.addColorVariables(variables, 'primary', colorPalette.primary)
    this.addColorVariables(variables, 'neutral', colorPalette.neutral)
    this.addColorVariables(variables, 'success', colorPalette.success)
    this.addColorVariables(variables, 'warning', colorPalette.warning)
    this.addColorVariables(variables, 'error', colorPalette.error)

    // 2. 间距变量（根据 density）
    this.addSpacingVariables(variables, recipe.density)

    // 3. 动效变量（根据 motion）
    this.addMotionVariables(variables, recipe.motion)

    // 4. 表面变量（根据 surface）
    this.addSurfaceVariables(variables, recipe.surface)

    // 5. 字体变量（根据 density）
    this.addTypographyVariables(variables, recipe.density)

    return variables
  }

  private addColorVariables(
    variables: Record<string, string>,
    name: string,
    scale: ColorScale
  ): void {
    Object.entries(scale).forEach(([step, color]) => {
      variables[`--color-${name}-${step}`] = color
    })
  }

  private addSpacingVariables(
    variables: Record<string, string>,
    density: DensityAxis
  ): void {
    const multipliers = {
      'spacious': 1.25,
      'comfortable': 1.0,
      'compact': 0.85,
    }

    const baseSpacing = {
      'xs': 4,
      'sm': 8,
      'md': 16,
      'lg': 24,
      'xl': 32,
      '2xl': 48,
    }

    const multiplier = multipliers[density]

    Object.entries(baseSpacing).forEach(([size, value]) => {
      variables[`--spacing-${size}`] = `${value * multiplier}px`
    })
  }

  private addMotionVariables(
    variables: Record<string, string>,
    motion: string
  ): void {
    const [level, curve] = motion.split('.')

    const durations = {
      'subtle': { fast: 100, base: 150, slow: 200 },
      'standard': { fast: 150, base: 200, slow: 300 },
      'expressive': { fast: 250, base: 350, slow: 500 },
    }

    const easings = {
      'classic': 'cubic-bezier(0.4, 0, 0.2, 1)',
      'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    }

    const levelDurations = durations[level as keyof typeof durations]
    Object.entries(levelDurations).forEach(([speed, value]) => {
      variables[`--motion-duration-${speed}`] = `${value}ms`
    })

    variables['--motion-easing'] = easings[curve as keyof typeof easings]
  }

  private addSurfaceVariables(
    variables: Record<string, string>,
    surface: SurfaceAxis
  ): void {
    const shadows = {
      'flat': 'none',
      'soft-shadow': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
      'elevated': '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
      'glass': '0 8px 32px rgba(0,0,0,0.1)',
    }

    const backdropBlur = {
      'flat': '0px',
      'soft-shadow': '0px',
      'elevated': '0px',
      'glass': '12px',
    }

    variables['--surface-shadow'] = shadows[surface]
    variables['--surface-backdrop-blur'] = backdropBlur[surface]

    if (surface === 'glass') {
      variables['--surface-background'] = 'rgba(255, 255, 255, 0.1)'
      variables['--surface-border'] = 'rgba(255, 255, 255, 0.2)'
    }
  }

  private addTypographyVariables(
    variables: Record<string, string>,
    density: DensityAxis
  ): void {
    const multipliers = {
      'spacious': 1.15,
      'comfortable': 1.0,
      'compact': 0.9,
    }

    const baseSizes = {
      'xs': 12,
      'sm': 14,
      'base': 16,
      'lg': 18,
      'xl': 20,
      '2xl': 24,
    }

    const multiplier = multipliers[density]

    Object.entries(baseSizes).forEach(([size, value]) => {
      variables[`--font-size-${size}`] = `${value * multiplier}px`
    })
  }
}
```

---

## 🔌 Provider 层设计

### StyleRecipeProvider 实现

```typescript
// src/style-recipe/provider/StyleRecipeProvider.tsx

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import {
  getUnifiedRecipe,
  type StyleRecipe,
  type StyleRecipeID
} from '../recipes/unified-recipes'
import { CSSVariableGenerator } from '../engine/css-variable-generator'

export interface StyleRecipeContextType {
  currentRecipe: StyleRecipe | null
  currentRecipeId: string
  setRecipe: (recipeId: StyleRecipeID) => void
  applyRecipe: (recipe: StyleRecipe) => void
  cssVariables: Record<string, string>
}

export const StyleRecipeContext = createContext<StyleRecipeContextType | undefined>(undefined)

export interface StyleRecipeProviderProps {
  children: React.ReactNode
  initialRecipe?: StyleRecipeID
  onRecipeChange?: (recipe: StyleRecipe) => void
}

export const StyleRecipeProvider: React.FC<StyleRecipeProviderProps> = ({
  children,
  initialRecipe = 'dark.neutral-cool-mid.analog(purple).vivid.comfortable.expressive.glass',
  onRecipeChange,
}) => {
  const [currentRecipeId, setCurrentRecipeId] = useState(initialRecipe)
  const [currentRecipe, setCurrentRecipe] = useState<StyleRecipe | null>(null)
  const [cssVariables, setCssVariables] = useState<Record<string, string>>({})

  const generator = new CSSVariableGenerator()

  // 应用配方
  const applyRecipe = useCallback((recipe: StyleRecipe) => {
    setCurrentRecipe(recipe)
    setCurrentRecipeId(recipe.id)

    // 生成 CSS 变量
    const variables = generator.generateVariables(recipe)
    setCssVariables(variables)

    // 注入到 DOM
    Object.entries(variables).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value)
    })

    // 添加 mode class
    document.documentElement.classList.remove('light', 'dark', 'hc')
    document.documentElement.classList.add(recipe.mode)

    // 回调
    onRecipeChange?.(recipe)
  }, [onRecipeChange])

  // 根据 ID 切换配方
  const setRecipe = useCallback((recipeId: StyleRecipeID) => {
    const recipe = getUnifiedRecipe(recipeId)
    if (recipe) {
      applyRecipe(recipe)
    }
  }, [applyRecipe])

  // 初始化
  useEffect(() => {
    setRecipe(initialRecipe)
  }, [initialRecipe, setRecipe])

  const value: StyleRecipeContextType = {
    currentRecipe,
    currentRecipeId,
    setRecipe,
    applyRecipe,
    cssVariables,
  }

  return (
    <StyleRecipeContext.Provider value={value}>
      {children}
    </StyleRecipeContext.Provider>
  )
}

/**
 * useStyleRecipe Hook
 */
export function useStyleRecipe() {
  const context = useContext(StyleRecipeContext)
  if (!context) {
    throw new Error('useStyleRecipe must be used within StyleRecipeProvider')
  }
  return context
}

/**
 * 获取 CSS 变量值
 */
export function useStyleRecipeCSS(variableName: string): string {
  const { cssVariables } = useStyleRecipe()
  return cssVariables[variableName] || ''
}
```

---

## 🎨 组件层集成

### Button 组件重构

```typescript
// src/components/ui/Button.tsx

import React, { forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../utils/cn'
import { Spinner } from './Spinner'

/**
 * ✅ 使用 CSS 变量定义样式
 * 不再直接依赖 ThemeProvider
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-hidden focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        // ✅ 使用 CSS 变量
        primary: [
          'bg-[var(--color-primary-500)]',
          'text-white',
          'shadow-[var(--surface-shadow)]',
          'hover:bg-[var(--color-primary-600)]',
          'hover:scale-105',
          'focus:ring-[var(--color-primary-400)]',
          'transition-all duration-[var(--motion-duration-base)] ease-[var(--motion-easing)]',
        ].join(' '),

        secondary: [
          'bg-[var(--color-neutral-100)]',
          'dark:bg-[var(--color-neutral-800)]',
          'text-[var(--color-neutral-900)]',
          'dark:text-[var(--color-neutral-100)]',
          'border border-[var(--color-neutral-300)]',
          'hover:bg-[var(--color-neutral-200)]',
        ].join(' '),

        ghost: [
          'text-[var(--color-neutral-700)]',
          'hover:bg-[var(--color-neutral-100)]',
          'dark:hover:bg-[var(--color-neutral-800)]',
        ].join(' '),

        glass: [
          'backdrop-blur-[var(--surface-backdrop-blur)]',
          'bg-[var(--surface-background)]',
          'border border-[var(--surface-border)]',
        ].join(' '),
      },
      size: {
        sm: 'h-[32px] px-[var(--spacing-sm)] text-[var(--font-size-sm)]',
        md: 'h-[40px] px-[var(--spacing-md)] text-[var(--font-size-base)]',
        lg: 'h-[48px] px-[var(--spacing-lg)] text-[var(--font-size-lg)]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'variant'>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || loading}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        {...props}
      >
        {loading && <Spinner size={size} className="mr-2" />}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
```

### Tailwind 配置集成

```typescript
// tailwind.config.ts

import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ✅ 映射 CSS 变量到 Tailwind
        primary: {
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
          950: 'var(--color-primary-950)',
        },
        neutral: {
          /* 同上 */
        },
      },
      spacing: {
        xs: 'var(--spacing-xs)',
        sm: 'var(--spacing-sm)',
        md: 'var(--spacing-md)',
        lg: 'var(--spacing-lg)',
        xl: 'var(--spacing-xl)',
        '2xl': 'var(--spacing-2xl)',
      },
      fontSize: {
        xs: 'var(--font-size-xs)',
        sm: 'var(--font-size-sm)',
        base: 'var(--font-size-base)',
        lg: 'var(--font-size-lg)',
        xl: 'var(--font-size-xl)',
        '2xl': 'var(--font-size-2xl)',
      },
      transitionDuration: {
        fast: 'var(--motion-duration-fast)',
        base: 'var(--motion-duration-base)',
        slow: 'var(--motion-duration-slow)',
      },
      transitionTimingFunction: {
        default: 'var(--motion-easing)',
      },
    },
  },
  plugins: [],
}

export default config
```

---

## 🌐 生态层设计

### 1. Registry（CDN 数据源）

```typescript
// src/registry/generator.ts

import { unifiedRecipes, type StyleRecipe } from '../style-recipe'
import { writeFileSync } from 'fs'
import { join } from 'path'

export interface RegistryRecipe extends StyleRecipe {
  preview: {
    thumbnail: string
    demoUrl: string
  }
  usage: {
    installations: number
    rating: number
  }
  metadata: {
    author: string
    version: string
    license: string
    createdAt: string
    updatedAt: string
  }
}

/**
 * 生成 Registry JSON
 */
export function generateRegistryJSON(): RegistryRecipe[] {
  return unifiedRecipes.map(recipe => ({
    ...recipe,
    preview: {
      thumbnail: `https://cdn.thui.dev/thumbnails/${encodeURIComponent(recipe.id)}.png`,
      demoUrl: `https://thui.dev/demo?recipe=${encodeURIComponent(recipe.id)}`,
    },
    usage: {
      installations: 0,
      rating: 0,
    },
    metadata: {
      author: 'Xorigo UI Team',
      version: '1.0.0',
      license: 'MIT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  }))
}

/**
 * 导出到文件（供 CDN 使用）
 */
export function exportToFile() {
  const registry = generateRegistryJSON()
  const outputPath = join(process.cwd(), 'public/registry/recipes.json')

  writeFileSync(outputPath, JSON.stringify(registry, null, 2))
  console.log(`✅ Registry exported to ${outputPath}`)
}

// 构建时执行
if (require.main === module) {
  exportToFile()
}
```

### 2. Gallery（展示界面）

```typescript
// demo-site/pages/Gallery.tsx

import React, { useState, useEffect } from 'react'
import { Card, Button, Input, Badge } from '@xorigo-ui/core'
import { Search, Filter } from 'lucide-react'
import type { RegistryRecipe } from '../registry/types'

export const GalleryPage: React.FC = () => {
  const [recipes, setRecipes] = useState<RegistryRecipe[]>([])
  const [filteredRecipes, setFilteredRecipes] = useState<RegistryRecipe[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMode, setSelectedMode] = useState<'all' | 'light' | 'dark'>('all')

  // 加载配方
  useEffect(() => {
    fetch('https://cdn.thui.dev/registry/recipes.json')
      .then(res => res.json())
      .then(data => {
        setRecipes(data)
        setFilteredRecipes(data)
      })
  }, [])

  // 搜索和过滤
  useEffect(() => {
    let filtered = recipes

    // 搜索
    if (searchQuery) {
      filtered = filtered.filter(recipe =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // 模式过滤
    if (selectedMode !== 'all') {
      filtered = filtered.filter(recipe => recipe.mode === selectedMode)
    }

    setFilteredRecipes(filtered)
  }, [searchQuery, selectedMode, recipes])

  return (
    <div className="gallery-page p-8">
      {/* 搜索和过滤栏 */}
      <div className="filters mb-8 flex gap-4">
        <Input
          leftIcon={<Search />}
          placeholder="搜索配方..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="mode-filters flex gap-2">
          <Button
            variant={selectedMode === 'all' ? 'primary' : 'ghost'}
            onClick={() => setSelectedMode('all')}
          >
            全部
          </Button>
          <Button
            variant={selectedMode === 'light' ? 'primary' : 'ghost'}
            onClick={() => setSelectedMode('light')}
          >
            亮色
          </Button>
          <Button
            variant={selectedMode === 'dark' ? 'primary' : 'ghost'}
            onClick={() => setSelectedMode('dark')}
          >
            暗色
          </Button>
        </div>
      </div>

      {/* 配方卡片网格 */}
      <div className="recipe-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  )
}

const RecipeCard: React.FC<{ recipe: RegistryRecipe }> = ({ recipe }) => {
  return (
    <Card className="recipe-card">
      <img
        src={recipe.preview.thumbnail}
        alt={recipe.name}
        className="w-full h-48 object-cover rounded-t-lg"
      />

      <div className="p-4">
        <h3 className="text-lg font-bold mb-2">{recipe.name}</h3>
        <p className="text-sm text-neutral-600 mb-4">{recipe.description}</p>

        <div className="tags flex flex-wrap gap-2 mb-4">
          <Badge>{recipe.mode}</Badge>
          <Badge>{recipe.tone}</Badge>
          <Badge>{recipe.density}</Badge>
        </div>

        <div className="actions flex gap-2">
          <Button size="sm" onClick={() => window.open(recipe.preview.demoUrl)}>
            预览
          </Button>
          <Button size="sm" variant="secondary" onClick={() => installRecipe(recipe)}>
            安装
          </Button>
        </div>
      </div>
    </Card>
  )
}

function installRecipe(recipe: RegistryRecipe) {
  // 生成安装代码
  const code = `
import { StyleRecipeProvider } from '@xorigo-ui/core/style-recipe'

function App() {
  return (
    <StyleRecipeProvider initialRecipe="${recipe.id}">
      {/* Your app */}
    </StyleRecipeProvider>
  )
}
  `.trim()

  // 复制到剪贴板
  navigator.clipboard.writeText(code)
  alert('安装代码已复制到剪贴板！')
}
```

### 3. Adoption Kit（深链接 + CLI）

```typescript
// src/adoption-kit/deep-link.ts

export interface DeepLinkParams {
  recipeId: string
  overrides?: Partial<StyleRecipe>
  components?: string[]
}

/**
 * 生成深链接
 * 格式: thui://recipe?id={id}&overrides={json}
 */
export function generateDeepLink(params: DeepLinkParams): string {
  const url = new URL('thui://recipe')
  url.searchParams.set('id', params.recipeId)

  if (params.overrides) {
    url.searchParams.set('overrides', JSON.stringify(params.overrides))
  }

  if (params.components) {
    url.searchParams.set('components', params.components.join(','))
  }

  return url.toString()
}

/**
 * 解析深链接
 */
export function parseDeepLink(url: string): DeepLinkParams | null {
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'thui:') return null

    const id = parsed.searchParams.get('id')
    if (!id) return null

    return {
      recipeId: id,
      overrides: JSON.parse(parsed.searchParams.get('overrides') || '{}'),
      components: parsed.searchParams.get('components')?.split(','),
    }
  } catch {
    return null
  }
}
```

### 4. Matrix（轴锁 + 变体生成）

```typescript
// src/style-recipe/matrix/axis-lock.ts

export interface AxisLockRule {
  name: string
  condition: (recipe: StyleRecipe) => boolean
  locks: Partial<StyleRecipe>
}

/**
 * 内置轴锁规则
 */
export const axisLockRules: AxisLockRule[] = [
  {
    name: 'high-contrast-lock',
    condition: (r) => r.mode === 'hc',
    locks: {
      tone: 'vivid',
      surface: 'flat',
    },
  },
  {
    name: 'glass-motion-lock',
    condition: (r) => r.surface === 'glass',
    locks: {
      motion: 'expressive.spring',
    },
  },
  {
    name: 'minimal-aesthetic-lock',
    condition: (r) => r.category === 'minimal',
    locks: {
      tone: 'calm',
      density: 'spacious',
      surface: 'flat',
    },
  },
]

/**
 * 应用轴锁规则
 */
export function applyAxisLocks(recipe: StyleRecipe): StyleRecipe {
  let lockedRecipe = { ...recipe }

  for (const rule of axisLockRules) {
    if (rule.condition(recipe)) {
      lockedRecipe = { ...lockedRecipe, ...rule.locks }
    }
  }

  return lockedRecipe
}

/**
 * 生成变体
 */
export function generateVariants(baseRecipe: StyleRecipe): StyleRecipe[] {
  const variants: StyleRecipe[] = []

  // 色调变体
  for (const tone of ['calm', 'standard', 'vivid'] as const) {
    if (tone !== baseRecipe.tone) {
      variants.push({
        ...baseRecipe,
        id: baseRecipe.id.replace(baseRecipe.tone, tone) as any,
        tone,
        name: `${baseRecipe.name} (${tone})`,
      })
    }
  }

  // 密度变体
  for (const density of ['spacious', 'comfortable', 'compact'] as const) {
    if (density !== baseRecipe.density) {
      variants.push({
        ...baseRecipe,
        id: baseRecipe.id.replace(baseRecipe.density, density) as any,
        density,
        name: `${baseRecipe.name} (${density})`,
      })
    }
  }

  return variants
}
```

---

## 📊 实施路线图

### P0 - 核心系统（2周）

**目标**：完整的七轴配方系统运行

- [ ] ✅ 完善 `unified-recipes.ts` 中的20个配方定义
- [ ] 🔄 实现 `OKLCHColorEngine` 色彩引擎
- [ ] 🔄 实现 `CSSVariableGenerator` 变量生成器
- [ ] 🔄 完善 `StyleRecipeProvider`
- [ ] 🔄 重构 Button 组件使用 CSS 变量
- [ ] 🔄 验证完整流程：配方切换 → 色彩生成 → CSS 注入 → 组件渲染

**验收标准**：
- 能够在 demo-site 中切换20个配方
- Button 组件正确响应配方变化
- 性能：配方切换 < 100ms

### P1 - 组件迁移（3周）

**目标**：所有组件使用新系统

- [ ] 📋 重构 Card 组件
- [ ] 📋 重构 Input 组件
- [ ] 📋 重构 Modal 组件
- [ ] 📋 重构其余14个组件
- [ ] 📋 删除旧的 `ThemeProvider.tsx`
- [ ] 📋 更新所有使用 `useTheme()` 的代码

**验收标准**：
- 所有组件使用 `useStyleRecipe()`
- 无组件依赖旧的 ThemeProvider
- 测试覆盖率 > 80%

### P2 - Registry + Gallery（4周）

**目标**：可视化展示和检索

- [ ] 🎨 实现 `generateRegistryJSON()`
- [ ] 🎨 配置 CDN 部署（jsDelivr/Cloudflare）
- [ ] 🎨 开发 Gallery 页面
- [ ] 🎨 实现搜索和过滤功能
- [ ] 🎨 自动生成预览缩略图

**验收标准**：
- Gallery 页面流畅展示20个配方
- 搜索响应 < 300ms
- 缩略图自动生成并上传到 CDN

### P3 - Adoption Kit（3周）

**目标**：一键安装和集成

- [ ] 🚀 深链接协议实现
- [ ] 🚀 沙盒导出功能（CodeSandbox/StackBlitz）
- [ ] 🚀 CLI 工具：`npx @xorigo-ui/cli install-recipe`
- [ ] 🚀 VS Code 扩展（可选）

**验收标准**：
- 深链接可正确解析和跳转
- CLI 工具可安装任意配方
- 沙盒导出可正常运行

### P4 - Matrix + 优化（持续）

**目标**：智能规则和性能优化

- [ ] 🔧 轴锁规则系统
- [ ] 🔧 智能变体生成
- [ ] 🔧 A11y 自动校验
- [ ] 🔧 性能优化（懒加载、缓存）
- [ ] 🔧 文档完善

---

## 🎯 成功指标

1. **性能**：配方切换 < 100ms，Gallery 加载 < 1s
2. **覆盖率**：所有组件 100% 使用新系统
3. **扩展性**：社区可贡献配方到 Registry
4. **开发体验**：组件开发时间减少 30%
5. **可维护性**：单一数据源，无重复代码

---

## 📚 相关文档

- [七轴风格配方体系指南](./SEVEN_AXIS_SYSTEM_GUIDE.md)
- [OKLCH 色彩空间详解](./OKLCH_COLOR_GUIDE.md)
- [组件开发规范](./COMPONENT_DEVELOPMENT_GUIDE.md)
- [Registry API 文档](./REGISTRY_API_REFERENCE.md)

---

**创建时间**: 2025-01-13
**最后更新**: 2025-01-13
**状态**: 🚀 待实施
**负责人**: Xorigo UI Team
