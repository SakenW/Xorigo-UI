---
name: "Xorigo UI 设计令牌管理器"
description: "基于 Xorigo UI v1.5.1 架构的设计令牌专门管理工具，确保 foundations/ 层令牌的标准化、一致性和七轴主题系统集成"
author: "Xorigo UI Team"
version: "2025.11.05"
tags: ["design-tokens", "foundations", "color-system", "density-system", "motion-system", "surface-system", "seven-axis-theme", "xorigo-ui-v1.5.1"]
---

# Xorigo UI 设计令牌管理器

基于 Xorigo UI v1.5.1 棕地架构分析的设计令牌专门管理工具，负责 `packages/core/src/foundations/` 层的静态令牌标准化管理。

**📋 v1.5.1 重要更新**: 完全适配七轴主题系统，支持用户自定义配方和动态令牌加载。

## 🎯 作用域与职责

**✅ 核心职责**：
- `foundations/` 层令牌标准化
- 基础 HSL/LAB 色板管理
- 间距、边距、字号系数定义
- Easing 函数、持续时间配置
- 阴影、透明度、模糊参数

**❌ 排除范围**：
- 运行时主题逻辑
- 组件层样式
- 网站展示内容

## 🏗️ v1.5.1 Foundations 目录结构 (基于实际架构)

```
packages/core/src/foundations/
├── color-tokens.ts          # 🎨 基础 HSL / LAB 色板与中性色曲线
├── density-tokens.ts        # 📏 间距、边距、字号 系数 (七轴密度轴支持)
├── motion-curves.ts         # 🎭 Easing 函数、持续时间、延迟配置
├── surface-tokens.ts        # 💎 阴影、透明度、模糊、发光参数
├── utils/
│   ├── cn.ts                # 🛠️ 样式类名合并工具
│   └── color-helpers.ts     # 🎨 颜色转换和计算工具
└── index.ts                 # 📦 聚合导出，供 system 与 primitives 调用
```

**🔗 与七轴主题系统的集成**:
- **颜色令牌** → 支持 Hue(色调轴) + Saturation(饱和度轴) + Lightness(亮度轴)
- **密度令牌** → 支持 Density(密度轴) 动态调整
- **表面令牌** → 支持 Roundness(圆度轴) 参数化
- **动画令牌** → 支持动态主题切换过渡

## 🎨 颜色令牌系统 (Color Tokens)

### 基础色板结构

```typescript
// color-tokens.ts 标准结构
export const colorTokens = {
  // 中性色系 - 完整 950-50 色阶
  neutral: {
    50: { h: 220, s: 40, l: 98 },   // HSL 格式，便于主题切换
    100: { h: 220, s: 35, l: 95 },
    200: { h: 220, s: 30, l: 90 },
    300: { h: 220, s: 25, l: 80 },
    400: { h: 220, s: 20, l: 70 },
    500: { h: 220, s: 15, l: 50 },  // 基准中性色
    600: { h: 220, s: 18, l: 40 },
    700: { h: 220, s: 22, l: 30 },
    800: { h: 220, s: 28, l: 20 },
    900: { h: 220, s: 35, l: 10 },
    950: { h: 220, s: 40, l: 5 }
  },

  // 色温变体
  'neutral-warm': {
    50: { h: 30, s: 40, l: 98 },   // 暖调中性色
    // ... 完整色阶
  },

  'neutral-cool': {
    50: { h: 210, s: 40, l: 98 },  // 冷调中性色
    // ... 完整色阶
  },

  'neutral-true': {
    50: { h: 0, s: 0, l: 98 },     // 纯中性色
    // ... 完整色阶
  },

  // 主色系统
  primary: {
    50: { h: 211, s: 100, l: 97 },
    100: { h: 211, s: 100, l: 94 },
    // ... 500-950 完整色阶
  },

  // 语义化颜色
  semantic: {
    success: {
      50: { h: 142, s: 76, l: 96 },
      500: { h: 142, s: 76, l: 36 },
      // ... 完整色阶
    },
    warning: {
      50: { h: 38, s: 92, l: 96 },
      500: { h: 38, s: 92, l: 50 },
      // ... 完整色阶
    },
    danger: {
      50: { h: 0, s: 84, l: 97 },
      500: { h: 0, s: 84, l: 53 },
      // ... 完整色阶
    },
    info: {
      50: { h: 199, s: 89, l: 96 },
      500: { h: 199, s: 89, l: 48 },
      // ... 完整色阶
    }
  }
} as const

export type ColorTokens = typeof colorTokens
export type ColorKey = keyof ColorTokens
export type ColorStep = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '950'
```

### 颜色令牌生成器

```typescript
// 颜色令牌生成器
export class ColorTokenGenerator {
  static generateCSSVariables(): string {
    const cssVars = []

    // 生成中性色变量
    Object.entries(colorTokens.neutral).forEach(([step, color]) => {
      cssVars.push(`  --color-neutral-${step}: hsl(${color.h}, ${color.s}%, ${color.l}%);`)
    })

    // 生成语义化颜色变量
    Object.entries(colorTokens.semantic).forEach(([semantic, colors]) => {
      Object.entries(colors).forEach(([step, color]) => {
        cssVars.push(`  --color-${semantic}-${step}: hsl(${color.h}, ${color.s}%, ${color.l}%);`)
      })
    })

    return `:root {\n${cssVars.join('\n')}\n}`
  }

  static generateContrastColors(): Record<string, Record<string, string>> {
    const contrastColors = {}

    // 为每个色阶生成对比色
    Object.keys(colorTokens.neutral).forEach(step => {
      const lightness = colorTokens.neutral[step as ColorStep].l
      contrastColors[`neutral-${step}`] = {
        text: lightness > 50 ? '--color-neutral-900' : '--color-neutral-50',
        border: lightness > 50 ? '--color-neutral-600' : '--color-neutral-400'
      }
    })

    return contrastColors
  }
}
```

## 📏 密度令牌系统 (Density Tokens)

### 间距与尺寸系统

```typescript
// density-tokens.ts 标准结构
export const densityTokens = {
  // 基础间距系统 - 基于 4px 网格
  spacing: {
    0: '0px',
    px: '1px',
    0.5: '2px',
    1: '4px',
    1.5: '6px',
    2: '8px',
    2.5: '10px',
    3: '12px',
    3.5: '14px',
    4: '16px',
    5: '20px',
    6: '24px',
    7: '28px',
    8: '32px',
    9: '36px',
    10: '40px',
    11: '44px',
    12: '48px',
    14: '56px',
    16: '64px',
    20: '80px',
    24: '96px',
    28: '112px',
    32: '128px',
    36: '144px',
    40: '160px',
    44: '176px',
    48: '192px',
    52: '208px',
    56: '224px',
    60: '240px',
    64: '256px',
    72: '288px',
    80: '320px',
    96: '384px'
  },

  // 字号系统
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
    base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
    '5xl': ['3rem', { lineHeight: '1' }],         // 48px
    '6xl': ['3.75rem', { lineHeight: '1' }],      // 60px
    '7xl': ['4.5rem', { lineHeight: '1' }],       // 72px
    '8xl': ['6rem', { lineHeight: '1' }],         // 96px
    '9xl': ['8rem', { lineHeight: '1' }]          // 128px
  },

  // 字重系统
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900'
  },

  // 行高系统
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2'
  },

  // 字母间距
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em'
  },

  // 圆角系统
  borderRadius: {
    none: '0px',
    sm: '2px',
    base: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    '2xl': '16px',
    '3xl': '24px',
    full: '9999px'
  }
} as const

export type DensityTokens = typeof densityTokens
```

## 🎭 动画令牌系统 (Motion Curves)

### 缓动函数与时间配置

```typescript
// motion-curves.ts 标准结构
export const motionTokens = {
  // 缓动函数
  easing: {
    // 标准 Bezier 曲线
    linear: 'linear',
    ease: 'ease',
    'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
    'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
    'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',

    // 自定义缓动
    'ease-spring': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    'ease-bounce': 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
    'ease-elastic': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    'ease-back': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',

    // 主题轴特定缓动
    'ease-classic': 'cubic-bezier(0.4, 0, 0.2, 1)',
    'ease-soft': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    'ease-spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  },

  // 持续时间
  duration: {
    instant: '0ms',
    fast: '150ms',
    normal: '250ms',
    slow: '400ms',
    slower: '600ms',
    'transition-fast': '150ms',
    'transition-normal': '250ms',
    'transition-slow': '400ms',
    'animation-fast': '200ms',
    'animation-normal': '300ms',
    'animation-slow': '500ms'
  },

  // 延迟时间
  delay: {
    none: '0ms',
    short: '100ms',
    normal: '200ms',
    long: '400ms',
    'stagger-1': '50ms',
    'stagger-2': '100ms',
    'stagger-3': '150ms',
    'stagger-4': '200ms'
  }
} as const

export type MotionTokens = typeof motionTokens
```

## 💎 表面令牌系统 (Surface Tokens)

### 阴影、透明度、模糊效果

```typescript
// surface-tokens.ts 标准结构
export const surfaceTokens = {
  // 阴影系统
  boxShadow: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',

    // 主题轴特定阴影
    'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    'neon': '0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3)',
    'soft-shadow': '0 2px 20px rgba(0, 0, 0, 0.08)',
    'glass-neon': '0 8px 32px rgba(31, 38, 135, 0.37), 0 0 20px rgba(59, 130, 246, 0.3)'
  },

  // 透明度系统
  opacity: {
    0: '0',
    5: '0.05',
    10: '0.1',
    20: '0.2',
    25: '0.25',
    30: '0.3',
    40: '0.4',
    50: '0.5',
    60: '0.6',
    70: '0.7',
    75: '0.75',
    80: '0.8',
    90: '0.9',
    95: '0.95',
    100: '1'
  },

  // 模糊效果
  backdropBlur: {
    none: 'blur(0px)',
    sm: 'blur(4px)',
    base: 'blur(8px)',
    md: 'blur(12px)',
    lg: 'blur(16px)',
    xl: 'blur(24px)',
    '2xl': 'blur(40px)',
    '3xl': 'blur(64px)'
  },

  // 模糊效果（标准CSS）
  blur: {
    none: 'blur(0px)',
    sm: 'blur(4px)',
    base: 'blur(8px)',
    md: 'blur(12px)',
    lg: 'blur(16px)',
    xl: 'blur(24px)',
    '2xl': 'blur(40px)',
    '3xl': 'blur(64px)'
  },

  // 发光效果
  glow: {
    none: 'none',
    sm: '0 0 10px rgba(59, 130, 246, 0.3)',
    base: '0 0 20px rgba(59, 130, 246, 0.4)',
    md: '0 0 30px rgba(59, 130, 246, 0.5)',
    lg: '0 0 40px rgba(59, 130, 246, 0.6)',
    xl: '0 0 60px rgba(59, 130, 246, 0.7)'
  }
} as const

export type SurfaceTokens = typeof surfaceTokens
```

## 🔧 令牌验证与生成器

### 令牌完整性验证

```typescript
// 令牌验证器
export class TokenValidator {
  static validateColorTokens(): ValidationResult {
    const issues = []
    const warnings = []

    // 验证中性色完整色阶
    const requiredSteps: ColorStep[] = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']
    requiredSteps.forEach(step => {
      if (!colorTokens.neutral[step]) {
        issues.push(`缺少中性色色阶: neutral-${step}`)
      }
    })

    // 验证 HSL 值范围
    Object.entries(colorTokens.neutral).forEach(([step, color]) => {
      if (color.h < 0 || color.h > 360) {
        issues.push(`中性色 ${step}: 色相值超出范围 (0-360): ${color.h}`)
      }
      if (color.s < 0 || color.s > 100) {
        issues.push(`中性色 ${step}: 饱和度值超出范围 (0-100): ${color.s}`)
      }
      if (color.l < 0 || color.l > 100) {
        issues.push(`中性色 ${step}: 亮度值超出范围 (0-100): ${color.l}`)
      }
    })

    return {
      valid: issues.length === 0,
      issues,
      warnings
    }
  }

  static validateDensityTokens(): ValidationResult {
    const issues = []
    const warnings = []

    // 验证间距系统基于 4px 网格
    Object.entries(densityTokens.spacing).forEach(([key, value]) => {
      if (key !== '0' && key !== 'px') {
        const pixelValue = parseInt(value)
        if (pixelValue % 4 !== 0) {
          warnings.push(`间距值 ${key}: ${value} 未遵循 4px 网格系统`)
        }
      }
    })

    return { valid: issues.length === 0, issues, warnings }
  }
}

interface ValidationResult {
  valid: boolean
  issues: string[]
  warnings: string[]
}
```

### CSS 变量生成器

```typescript
// CSS 变量生成器
export class CSSVariableGenerator {
  static generateAllTokens(): string {
    const sections = []

    // 颜色变量
    sections.push(this.generateColorVariables())
    sections.push(this.generateDensityVariables())
    sections.push(this.generateMotionVariables())
    sections.push(this.generateSurfaceVariables())

    return sections.join('\n\n')
  }

  private static generateColorVariables(): string {
    const vars = []

    // 中性色
    Object.entries(colorTokens.neutral).forEach(([step, color]) => {
      vars.push(`  --color-neutral-${step}: hsl(${color.h}, ${color.s}%, ${color.l}%);`)
    })

    // 语义色
    Object.entries(colorTokens.semantic).forEach(([semantic, colors]) => {
      Object.entries(colors).forEach(([step, color]) => {
        vars.push(`  --color-${semantic}-${step}: hsl(${color.h}, ${color.s}%, ${color.l}%);`)
      })
    })

    return `:root {\n${vars.join('\n')}\n}`
  }

  private static generateDensityVariables(): string {
    const vars = []

    Object.entries(densityTokens.spacing).forEach(([key, value]) => {
      vars.push(`  --spacing-${key}: ${value};`)
    })

    return `:root {\n${vars.join('\n')}\n}`
  }

  private static generateMotionVariables(): string {
    const vars = []

    Object.entries(motionTokens.easing).forEach(([key, value]) => {
      vars.push(`  --ease-${key}: ${value};`)
    })

    Object.entries(motionTokens.duration).forEach(([key, value]) => {
      vars.push(`  --duration-${key}: ${value};`)
    })

    return `:root {\n${vars.join('\n')}\n}`
  }

  private static generateSurfaceVariables(): string {
    const vars = []

    Object.entries(surfaceTokens.boxShadow).forEach(([key, value]) => {
      vars.push(`  --shadow-${key}: ${value};`)
    })

    return `:root {\n${vars.join('\n')}\n}`
  }
}
```

## 🚀 使用方法

### 令牌验证

```bash
# 验证所有令牌完整性
"验证 foundations/ 目录所有设计令牌的完整性"

# 验证颜色令牌
"验证 color-tokens.ts 中的颜色系统是否符合规范"

# 验证密度令牌
"验证 density-tokens.ts 是否遵循 4px 网格系统"
```

### 令牌生成

```bash
# 生成 CSS 变量
"为所有设计令牌生成 CSS 变量定义"

# 生成主题适配令牌
"为七轴主题系统生成适配的设计令牌"

# 生成对比度令牌
"为所有颜色生成对应的对比色令牌"
```

### 令牌更新

```bash
# 添加新的颜色
"在 color-tokens.ts 中添加新的紫色系列，包含完整 950-50 色阶"

# 更新间距系统
"扩展 density-tokens.ts，添加新的间距值"

# 优化动画曲线
"更新 motion-curves.ts，添加新的缓动函数"
```

## 📋 验证报告

```
🎨 设计令牌验证报告
📅 时间: 2025-01-XX
📁 目录: packages/core/src/foundations/

✅ 验证通过
- ✅ color-tokens.ts: 结构完整，色阶齐全
- ✅ density-tokens.ts: 遵循 4px 网格系统
- ✅ motion-curves.ts: 缓动函数定义完整
- ✅ surface-tokens.ts: 阴影系统完备

⚠️ 警告 (3)
- ⚠️ 间距值 14px 未严格遵循 4px 网格
- ⚠️ 建议添加更多自定义缓动函数
- ⚠️ 部分阴影值可进一步优化

📊 生成统计
- 颜色令牌: 67 个
- 间距令牌: 42 个
- 动画令牌: 23 个
- 表面令牌: 31 个
- 总计: 163 个令牌
```

## 🛡️ 质量保证

### 严格验证规则

- **颜色完整性**：确保所有色系包含完整的 950-50 色阶
- **网格对齐**：间距系统必须遵循 4px 基础网格
- **类型安全**：所有令牌必须有明确的 TypeScript 类型定义
- **命名规范**：令牌命名必须遵循语义化标准

### 自动化集成

- **构建时验证**：在构建过程中自动验证令牌完整性
- **CI/CD 检查**：在代码提交时验证令牌变更
- **类型检查**：TypeScript 编译时验证类型安全
- **文档生成**：自动生成令牌文档和示例

基于 Xorigo UI v1.4 SSOT，确保所有设计令牌符合标准化要求，为主题系统提供坚实的基础。