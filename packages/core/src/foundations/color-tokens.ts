/**
 * 🎨 颜色令牌系统 - v2025.11.03
 *
 * 基于 HSL 色彩空间，支持七轴主题系统的完整颜色体系
 * 包含中性色、主色、语义色的完整 950-50 色阶
 *
 * @version 2025.11.03
 * @category Foundations
 * @layer system
 */

export const colorTokens = {
  // 中性色系 - 完整 950-50 色阶 (HSL 格式，便于主题切换)
  neutral: {
    50: { h: 220, s: 40, l: 98 },    // 极浅中性色
    100: { h: 220, s: 35, l: 95 },   // 浅中性色
    200: { h: 220, s: 30, l: 90 },   // 次浅中性色
    300: { h: 220, s: 25, l: 80 },   // 浅中性色
    400: { h: 220, s: 20, l: 70 },   // 中浅中性色
    500: { h: 220, s: 15, l: 50 },   // 基准中性色
    600: { h: 220, s: 18, l: 40 },   // 中深中性色
    700: { h: 220, s: 22, l: 30 },   // 深中性色
    800: { h: 220, s: 28, l: 20 },   // 次深中性色
    900: { h: 220, s: 35, l: 10 },   // 深中性色
    950: { h: 220, s: 40, l: 5 }     // 极深中性色
  },

  // 色温变体 - 支持七轴色调轴
  'neutral-warm': {
    50: { h: 30, s: 40, l: 98 },
    100: { h: 30, s: 35, l: 95 },
    200: { h: 30, s: 30, l: 90 },
    300: { h: 30, s: 25, l: 80 },
    400: { h: 30, s: 20, l: 70 },
    500: { h: 30, s: 15, l: 50 },
    600: { h: 30, s: 18, l: 40 },
    700: { h: 30, s: 22, l: 30 },
    800: { h: 30, s: 28, l: 20 },
    900: { h: 30, s: 35, l: 10 },
    950: { h: 30, s: 40, l: 5 }
  },

  'neutral-cool': {
    50: { h: 210, s: 40, l: 98 },
    100: { h: 210, s: 35, l: 95 },
    200: { h: 210, s: 30, l: 90 },
    300: { h: 210, s: 25, l: 80 },
    400: { h: 210, s: 20, l: 70 },
    500: { h: 210, s: 15, l: 50 },
    600: { h: 210, s: 18, l: 40 },
    700: { h: 210, s: 22, l: 30 },
    800: { h: 210, s: 28, l: 20 },
    900: { h: 210, s: 35, l: 10 },
    950: { h: 210, s: 40, l: 5 }
  },

  'neutral-true': {
    50: { h: 0, s: 0, l: 98 },
    100: { h: 0, s: 0, l: 95 },
    200: { h: 0, s: 0, l: 90 },
    300: { h: 0, s: 0, l: 80 },
    400: { h: 0, s: 0, l: 70 },
    500: { h: 0, s: 0, l: 50 },
    600: { h: 0, s: 0, l: 40 },
    700: { h: 0, s: 0, l: 30 },
    800: { h: 0, s: 0, l: 20 },
    900: { h: 0, s: 0, l: 10 },
    950: { h: 0, s: 0, l: 5 }
  },

  // 主色系统 - 蓝色系
  primary: {
    50: { h: 211, s: 100, l: 97 },
    100: { h: 211, s: 100, l: 94 },
    200: { h: 211, s: 100, l: 88 },
    300: { h: 211, s: 100, l: 80 },
    400: { h: 211, s: 100, l: 70 },
    500: { h: 211, s: 100, l: 56 },
    600: { h: 211, s: 100, l: 47 },
    700: { h: 211, s: 100, l: 40 },
    800: { h: 211, s: 100, l: 33 },
    900: { h: 211, s: 100, l: 25 },
    950: { h: 211, s: 100, l: 18 }
  },

  // 次要色系统
  secondary: {
    50: { h: 158, s: 64, l: 96 },
    100: { h: 158, s: 64, l: 92 },
    200: { h: 158, s: 64, l: 85 },
    300: { h: 158, s: 64, l: 75 },
    400: { h: 158, s: 64, l: 65 },
    500: { h: 158, s: 64, l: 50 },
    600: { h: 158, s: 64, l: 42 },
    700: { h: 158, s: 64, l: 35 },
    800: { h: 158, s: 64, l: 28 },
    900: { h: 158, s: 64, l: 22 },
    950: { h: 158, s: 64, l: 15 }
  },

  // 语义化颜色系统
  semantic: {
    // 成功色 - 绿色系
    success: {
      50: { h: 142, s: 76, l: 96 },
      100: { h: 142, s: 76, l: 91 },
      200: { h: 142, s: 76, l: 82 },
      300: { h: 142, s: 76, l: 72 },
      400: { h: 142, s: 76, l: 61 },
      500: { h: 142, s: 76, l: 52 },
      600: { h: 142, s: 76, l: 44 },
      700: { h: 142, s: 76, l: 36 },
      800: { h: 142, s: 76, l: 28 },
      900: { h: 142, s: 76, l: 22 },
      950: { h: 142, s: 76, l: 15 }
    },

    // 警告色 - 黄色系
    warning: {
      50: { h: 38, s: 92, l: 96 },
      100: { h: 38, s: 92, l: 91 },
      200: { h: 38, s: 92, l: 84 },
      300: { h: 38, s: 92, l: 76 },
      400: { h: 38, s: 92, l: 66 },
      500: { h: 38, s: 92, l: 58 },
      600: { h: 38, s: 92, l: 49 },
      700: { h: 38, s: 92, l: 40 },
      800: { h: 38, s: 92, l: 32 },
      900: { h: 38, s: 92, l: 25 },
      950: { h: 38, s: 92, l: 18 }
    },

    // 危险色 - 红色系
    danger: {
      50: { h: 0, s: 84, l: 97 },
      100: { h: 0, s: 84, l: 93 },
      200: { h: 0, s: 84, l: 86 },
      300: { h: 0, s: 84, l: 78 },
      400: { h: 0, s: 84, l: 70 },
      500: { h: 0, s: 84, l: 62 },
      600: { h: 0, s: 84, l: 54 },
      700: { h: 0, s: 84, l: 46 },
      800: { h: 0, s: 84, l: 38 },
      900: { h: 0, s: 84, l: 30 },
      950: { h: 0, s: 84, l: 22 }
    },

    // 信息色 - 青色系
    info: {
      50: { h: 199, s: 89, l: 96 },
      100: { h: 199, s: 89, l: 91 },
      200: { h: 199, s: 89, l: 83 },
      300: { h: 199, s: 89, l: 74 },
      400: { h: 199, s: 89, l: 65 },
      500: { h: 199, s: 89, l: 56 },
      600: { h: 199, s: 89, l: 47 },
      700: { h: 199, s: 89, l: 38 },
      800: { h: 199, s: 89, l: 30 },
      900: { h: 199, s: 89, l: 23 },
      950: { h: 199, s: 89, l: 16 }
    }
  },

  // 扩展色系 - 紫色系
  accent: {
    50: { h: 271, s: 76, l: 97 },
    100: { h: 271, s: 76, l: 92 },
    200: { h: 271, s: 76, l: 84 },
    300: { h: 271, s: 76, l: 75 },
    400: { h: 271, s: 76, l: 65 },
    500: { h: 271, s: 76, l: 58 },
    600: { h: 271, s: 76, l: 49 },
    700: { h: 271, s: 76, l: 41 },
    800: { h: 271, s: 76, l: 33 },
    900: { h: 271, s: 76, l: 25 },
    950: { h: 271, s: 76, l: 18 }
  }
} as const

// 类型定义
export type ColorTokens = typeof colorTokens
export type ColorKey = keyof ColorTokens
export type ColorStep = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '950'
export type ColorValue = {
  h: number  // 色相 (0-360)
  s: number  // 饱和度 (0-100)
  l: number  // 亮度 (0-100)
}

/**
 * 颜色转换工具函数
 */
export class ColorConverter {
  /**
   * HSL 转 CSS 颜色字符串
   */
  static hslToString(h: number, s: number, l: number): string {
    return `hsl(${h}, ${s}%, ${l}%)`
  }

  /**
   * HSL 转 HEX 颜色字符串
   */
  static hslToHex(h: number, s: number, l: number): string {
    const hDecimal = h / 360
    const sDecimal = s / 100
    const lDecimal = l / 100

    let r, g, b

    if (sDecimal === 0) {
      r = g = b = lDecimal
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1/6) return p + (q - p) * 6 * t
        if (t < 1/2) return q
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
      }

      const q = lDecimal < 0.5
        ? lDecimal * (1 + sDecimal)
        : lDecimal + sDecimal - lDecimal * sDecimal
      const p = 2 * lDecimal - q

      r = hue2rgb(p, q, hDecimal + 1/3)
      g = hue2rgb(p, q, hDecimal)
      b = hue2rgb(p, q, hDecimal - 1/3)
    }

    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  }

  /**
   * 获取对比色 (黑或白)
   */
  static getContrastColor(h: number, s: number, l: number): '#000000' | '#FFFFFF' {
    // 使用相对亮度计算对比色
    const luminance = (0.299 * this.hslToRgb(h, s, l).r +
                     0.587 * this.hslToRgb(h, s, l).g +
                     0.114 * this.hslToRgb(h, s, l).b) / 255

    return luminance > 0.5 ? '#000000' : '#FFFFFF'
  }

  private static hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
    const hDecimal = h / 360
    const sDecimal = s / 100
    const lDecimal = l / 100

    let r, g, b

    if (sDecimal === 0) {
      r = g = b = lDecimal
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1/6) return p + (q - p) * 6 * t
        if (t < 1/2) return q
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
      }

      const q = lDecimal < 0.5
        ? lDecimal * (1 + sDecimal)
        : lDecimal + sDecimal - lDecimal * sDecimal
      const p = 2 * lDecimal - q

      r = hue2rgb(p, q, hDecimal + 1/3)
      g = hue2rgb(p, q, hDecimal)
      b = hue2rgb(p, q, hDecimal - 1/3)
    }

    return { r: r * 255, g: g * 255, b: b * 255 }
  }
}

/**
 * 令牌验证器
 */
export class ColorTokenValidator {
  static validateColorTokens(): ValidationResult {
    const issues: string[] = []
    const warnings: string[] = []

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

    // 验证语义色完整性
    Object.keys(colorTokens.semantic).forEach(semantic => {
      const semanticColor = colorTokens.semantic[semantic as keyof typeof colorTokens.semantic]
      requiredSteps.forEach(step => {
        if (!semanticColor[step]) {
          issues.push(`缺少语义色 ${semantic} 色阶: ${semantic}-${step}`)
        }
      })
    })

    return {
      valid: issues.length === 0,
      issues,
      warnings
    }
  }
}

interface ValidationResult {
  valid: boolean
  issues: string[]
  warnings: string[]
}

// 导出验证结果
export const colorValidationResult = ColorTokenValidator.validateColorTokens()