/**
 * Xorigo UI 颜色令牌系统 - 基于七轴主题系统 v1.4 SSOT
 *
 * 从 src-archived-20251022-023941/tokens/design-tokens.ts 迁移并适配七轴系统
 */

// =============================================================================
// 基础 HSL/LAB 色板与中性色曲线
// =============================================================================

export const colorTokens = {
  // 中性色系 - 完整 950-50 色阶 (HSL 格式，便于主题切换)
  neutral: {
    50: { h: 220, s: 40, l: 98 },   // 浅灰白色
    100: { h: 220, s: 35, l: 95 },  // 浅灰色
    200: { h: 220, s: 30, l: 90 },  // 浅灰
    300: { h: 220, s: 25, l: 80 },  // 中浅灰
    400: { h: 220, s: 20, l: 70 },  // 中灰色
    500: { h: 220, s: 15, l: 50 },  // 基准中性色
    600: { h: 220, s: 18, l: 40 },  // 中深灰
    700: { h: 220, s: 22, l: 30 },  // 深灰
    800: { h: 220, s: 28, l: 20 },  // 深灰
    900: { h: 220, s: 35, l: 10 },  // 深灰色
    950: { h: 220, s: 40, l: 5 }    // 最深灰
  },

  // 色温变体 - 用于七轴 base 轴
  'neutral-warm': {
    50: { h: 30, s: 40, l: 98 },    // 暖调浅白
    100: { h: 25, s: 35, l: 95 },  // 暖调浅灰
    200: { h: 20, s: 30, l: 90 },  // 暖调浅灰
    300: { h: 15, s: 25, l: 80 },  // 暖调中浅
    400: { h: 10, s: 20, l: 70 },  // 暖调中灰
    500: { h: 5, s: 15, l: 50 },   // 暖调基准色
    600: { h: 8, s: 18, l: 40 },   // 暖调中深
    700: { h: 12, s: 22, l: 30 },   // 暖调深灰
    800: { h: 15, s: 28, l: 20 },  // 暖调深灰
    900: { h: 18, s: 35, l: 10 },  // 暖调深灰
    950: { h: 20, s: 40, l: 5 }    // 暖调最深
  },

  'neutral-cool': {
    50: { h: 210, s: 40, l: 98 },   // 冷调浅白
    100: { h: 215, s: 35, l: 95 }, // 冷调浅灰
    200: { h: 220, s: 30, l: 90 }, // 冷调浅灰
    300: { h: 225, s: 25, l: 80 }, // 冷调中浅
    400: { h: 230, s: 20, l: 70 }, // 冷调中灰
    500: { h: 235, s: 15, l: 50 }, // 冷调基准色
    600: { h: 232, s: 18, l: 40 }, // 冷调中深
    700: { h: 228, s: 22, l: 30 }, // 冷调深灰
    800: { h: 225, s: 28, l: 20 }, // 冷调深灰
    900: { h: 220, s: 35, l: 10 }, // 冷调深灰
    950: { h: 215, s: 40, l: 5 }    // 冷调最深
  },

  'neutral-true': {
    50: { h: 0, s: 0, l: 98 },     // 纯中性浅白
    100: { h: 0, s: 0, l: 95 },     // 纯中性浅灰
    200: { h: 0, s: 0, l: 90 },     // 纯中性浅灰
    300: { h: 0, s: 0, l: 80 },     // 纯中性中浅
    400: { h: 0, s: 0, l: 70 },     // 纯中性中灰
    500: { h: 0, s: 0, l: 50 },     // 纯中性基准色
    600: { h: 0, s: 0, l: 40 },     // 纯中性中深
    700: { h: 0, s: 0, l: 30 },     // 纯中性深灰
    800: { h: 0, s: 0, l: 20 },     // 纯中性深灰
    900: { h: 0, s: 0, l: 10 },     // 纯中性深灰
    950: { h: 0, s: 0, l: 5 }      // 纯中性最深
  },

  // 主色系统 - 完整色阶
  primary: {
    50: { h: 211, s: 100, l: 97 },  // 主色极浅
    100: { h: 211, s: 100, l: 94 }, // 主色浅
    200: { h: 211, s: 100, l: 89 }, // 主色浅中
    300: { h: 211, s: 100, l: 80 }, // 主色中浅
    400: { h: 211, s: 100, l: 73 }, // 主色中
    500: { h: 211, s: 100, l: 50 }, // 主色基准
    600: { h: 211, s: 100, l: 40 }, // 主色中深
    700: { h: 211, s: 100, l: 33 }, // 主色深
    800: { h: 211, s: 100, l: 26 }, // 主色深暗
    900: { h: 211, s: 100, l: 17 }, // 主色极深
    950: { h: 211, s: 100, l: 9 }   // 主色最深
  },

  // 语义化颜色 - 完整色阶
  semantic: {
    success: {
      50: { h: 142, s: 76, l: 96 },   // 成功极浅
      100: { h: 142, s: 76, l: 93 },  // 成功浅
      200: { h: 142, s: 76, l: 89 },  // 成功浅中
      300: { h: 142, s: 76, l: 79 },  // 成功中浅
      400: { h: 142, s: 76, l: 66 },  // 成功中
      500: { h: 142, s: 76, l: 58 },  // 成功基准
      600: { h: 142, s: 76, l: 50 },  // 成功中深
      700: { h: 142, s: 76, l: 42 },  // 成功深
      800: { h: 142, s: 76, l: 33 },  // 成功深暗
      900: { h: 142, s: 76, l: 26 },  // 成功极深
      950: { h: 142, s: 76, l: 15 }   // 成功最深
    },
    warning: {
      50: { h: 38, s: 92, l: 96 },   // 警告极浅
      100: { h: 38, s: 92, l: 94 },  // 警告浅
      200: { h: 38, s: 92, l: 91 },  // 警告浅中
      300: { h: 38, s: 92, l: 87 },  // 警告中浅
      400: { h: 38, s: 92, l: 83 },  // 警告中
      500: { h: 38, s: 92, l: 58 },  // 警告基准
      600: { h: 38, s: 92, l: 45 },  // 警告中深
      700: { h: 38, s: 92, l: 37 },  // 警告深
      800: { h: 38, s: 92, l: 29 },  // 警告深暗
      900: { h: 38, s: 92, l: 20 },  // 警告极深
      950: { h: 38, s: 92, l: 12 }   // 警告最深
    },
    danger: {
      50: { h: 0, s: 84, l: 97 },    // 危险极浅
      100: { h: 0, s: 84, l: 94 },    // 危险浅
      200: { h: 0, s: 84, l: 90 },    // 危险浅中
      300: { h: 0, s: 84, l: 86 },    // 危险中浅
      400: { h: 0, s: 84, l: 80 },    // 危险中
      500: { h: 0, s: 84, l: 58 },    // 危险基准
      600: { h: 0, s: 84, l: 50 },    // 危险中深
      700: { h: 0, s: 84, l: 42 },    // 危险深
      800: { h: 0, s: 84, l: 30 },    // 危险深暗
      900: { h: 0, s: 84, l: 17 },    // 危险极深
      950: { h: 0, s: 84, l: 9 }     // 危险最深
    },
    info: {
      50: { h: 199, s: 89, l: 96 },   // 信息极浅
      100: { h: 199, s: 89, l: 94 },  // 信息浅
      200: { h: 199, s: 89, l: 90 },  // 信息浅中
      300: { h: 199, s: 89, l: 86 },  // 信息中浅
      400: { h: 199, s: 89, l: 82 },  // 信息中
      500: { h: 199, s: 89, l: 48 },  // 信息基准
      600: { h: 199, s: 89, l: 42 },  // 信息中深
      700: { h: 199, s: 89, l: 35 },  // 信息深
      800: { h: 199, s: 89, l: 28 },  // 信息深暗
      900: { h: 199, s: 89, l: 17 },  // 信息极深
      950: { h: 199, s: 89, l: 12 }   // 信息最深
    }
  }
} as const

// =============================================================================
// 颜色令牌类型定义
// =============================================================================

export type ColorTokens = typeof colorTokens
export type ColorKey = keyof ColorTokens
export type ColorStep = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '950'

// =============================================================================
// 颜色令牌生成器
// =============================================================================

export class ColorTokenGenerator {
  // 生成完整的 CSS 变量定义
  static generateCSSVariables(): string {
    const cssVars = []

    // 生成中性色变量
    Object.entries(colorTokens.neutral).forEach(([step, color]) => {
      cssVars.push(`  --color-neutral-${step}: hsl(${color.h}, ${color.s}%, ${color.l}%);`)
    })

    // 生成色温变体变量
    ['warm', 'cool', 'true'].forEach(warmth => {
      const variant = colorTokens[`neutral-${warmth}` as keyof typeof colorTokens]
      if (variant) {
        Object.entries(variant).forEach(([step, color]) => {
          cssVars.push(`  --color-neutral-${warmth}-${step}: hsl(${color.h}, ${color.s}%, ${color.l}%);`)
        })
      }
    })

    // 生成主色变量
    Object.entries(colorTokens.primary).forEach(([step, color]) => {
      cssVars.push(`  --color-primary-${step}: hsl(${color.h}, ${color.s}%, ${color.l}%);`)
    })

    // 生成语义化颜色变量
    Object.entries(colorTokens.semantic).forEach(([semantic, colors]) => {
      Object.entries(colors).forEach(([step, color]) => {
        cssVars.push(`  --color-${semantic}-${step}: hsl(${color.h}, ${color.s}%, ${color.l}%);`)
      })
    })

    return `:root {\n${cssVars.join('\n')}\n}`
  }

  // 生成对比色映射
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

    // 生成主色对比色
    Object.keys(colorTokens.primary).forEach(step => {
      const lightness = colorTokens.primary[step as ColorStep].l
      contrastColors[`primary-${step}`] = {
        text: lightness > 50 ? '--color-text-on-primary' : '--color-text-primary',
        border: lightness > 50 ? '--color-primary-600' : '--color-primary-400'
      }
    })

    return contrastColors
  }

  // 生成主题配方颜色
  static generateThemeColors(axes: {
    mode: 'light' | 'dark' | 'hc'
    base: string
    accent: string
    tone: 'calm' | 'standard' | 'vivid'
  }): {
    background: string
    foreground: string
    primary: string
    secondary: string
    text: Record<string, string>
    border: Record<string, string>
  } {
    const { mode, base, accent, tone } = axes

    // 根据七轴配置生成颜色
    const baseColors = this.extractBaseColors(base)
    const accentColors = this.extractAccentColors(accent)

    // 根据色调调整饱和度
    const saturationAdjustment = tone === 'vivid' ? 1.2 : tone === 'calm' ? 0.8 : 1.0

    // 根据模式调整亮度
    const brightnessAdjustment = mode === 'dark' ? -0.2 : mode === 'hc' ? 0.1 : 0

    return {
      background: this.adjustLightness(baseColors.background, brightnessAdjustment),
      foreground: this.adjustLightness(baseColors.foreground, -brightnessAdjustment),
      primary: this.adjustSaturation(accentColors.primary, saturationAdjustment),
      secondary: this.adjustLightness(baseColors.secondary, brightnessAdjustment * 0.5),

      text: {
        primary: this.getContrastText(baseColors.foreground),
        secondary: this.getContrastText(baseColors.background, 0.7),
        tertiary: this.getContrastText(baseColors.background, 0.5),
        disabled: this.getContrastText(baseColors.background, 0.3),
        inverse: this.getContrastText(baseColors.foreground),
        success: this.getContrastText(colorTokens.semantic.success[500]),
        warning: this.getContrastText(colorTokens.semantic.warning[500]),
        danger: this.getContrastText(colorTokens.semantic.danger[500]),
        info: this.getContrastText(colorTokens.semantic.info[500])
      },

      border: {
        primary: accentColors.primary,
        secondary: this.adjustLightness(baseColors.background, 0.2),
        tertiary: this.adjustLightness(baseColors.background, 0.4),
        focus: this.adjustLightness(accentColors.primary, 0.3),
        error: colorTokens.semantic.danger[500],
        warning: colorTokens.semantic.warning[500],
        success: colorTokens.semantic.success[500]
      }
    }
  }

  private static extractBaseColors(base: string): { background: string; foreground: string } {
    const baseColors = {
      'neutral-true-low': {
        background: colorTokens.neutral[50],
        foreground: colorTokens.neutral[900]
      },
      'neutral-true-mid': {
        background: colorTokens.neutral[100],
        foreground: colorTokens.neutral[800]
      },
      'neutral-true-high': {
        background: colorTokens.neutral[200],
        foreground: colorTokens.neutral[700]
      },
      'neutral-warm-low': {
        background: colorTokens['neutral-warm'][50],
        foreground: colorTokens['neutral-warm'][900]
      },
      'neutral-warm-mid': {
        background: colorTokens['neutral-warm'][100],
        foreground: colorTokens['neutral-warm'][800]
      },
      'neutral-warm-high': {
        background: colorTokens['neutral-warm'][200],
        foreground: colorTokens['neutral-warm'][700]
      },
      'neutral-cool-low': {
        background: colorTokens['neutral-cool'][50],
        foreground: colorTokens['neutral-cool'][900]
      },
      'neutral-cool-mid': {
        background: colorTokens['neutral-cool'][100],
        foreground: colorTokens['neutral-cool'][800]
      },
      'neutral-cool-high': {
        background: colorTokens['neutral-cool'][200],
        foreground: colorTokens['neutral-cool'][700]
      }
    }

    return baseColors[base as keyof typeof baseColors] || baseColors['neutral-true-mid']
  }

  private static extractAccentColors(accent: string): { primary: string } {
    // 解析 accent 策略: mono(blue), analog(orange), duo(purple,pink)
    const match = accent.match(/^(mono|analog|duo)\(([^)]+)\)$/)
    if (!match) return { primary: colorTokens.primary[500] }

    const strategy = match[1]
    const hue = match[2]

    const hueMap: Record<string, number> = {
      'red': 0, 'orange': 30, 'yellow': 60, 'green': 120,
      'cyan': 180, 'blue': 210, 'purple': 270, 'pink': 300
    }

    const baseHue = hueMap[hue] || 210 // 默认蓝色

    if (strategy === 'mono') {
      return { primary: `hsl(${baseHue}, 100%, 50%)` }
    }

    // analog 和 duo 策略的简化实现
    return { primary: `hsl(${baseHue}, 100%, 50%)` }
  }

  private static adjustLightness(color: { h: number; s: number; l: number }, adjustment: number): string {
    const newL = Math.max(0, Math.min(100, color.l + adjustment * 100))
    return `hsl(${color.h}, ${color.s}%, ${newL}%)`
  }

  private static adjustSaturation(color: string, factor: number): string {
    const match = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/)
    if (!match) return color

    const [, h, s, l] = match
    const newS = Math.max(0, Math.min(100, parseFloat(s) * factor))
    return `hsl(${h}, ${newS}%, ${l})`
  }

  private static getContrastText(background: { h: number; s: number; l: number }, threshold?: number): string {
    const lightness = background.l
    const contrastThreshold = threshold || 0.5

    if (lightness > 50 + (contrastThreshold * 40)) {
      return '#1e293b' // 深色文本
    } else {
      return '#f8fafc' // 浅色文本
    }
  }
}

// 导出默认配置
export const defaultColorConfig = {
  ...colorTokens,
  generator: new ColorTokenGenerator(),
  cssVariables: ColorTokenGenerator.generateCSSVariables(),
  contrastColors: ColorTokenGenerator.generateContrastColors()
}