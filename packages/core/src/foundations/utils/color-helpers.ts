import { colorTokens } from '../color-tokens'

/**
 * 颜色工具函数 - v2025.11.03
 *
 * HSL颜色空间操作、颜色转换、对比度计算
 * 支持七轴主题系统的颜色操作
 *
 * @version 2025.11.03
 * @category Foundations
 * @layer system
 */

/**
 * HSL颜色接口
 */
export interface HSLColor {
  h: number    // 色相 (0-360)
  s: number    // 饱和度 (0-100)
  l: number    // 亮度 (0-100)
  a?: number   // 透明度 (0-1)
}

/**
 * RGB颜色接口
 */
export interface RGBColor {
  r: number    // 红色 (0-255)
  g: number    // 绿色 (0-255)
  b: number    // 蓝色 (0-255)
  a?: number   // 透明度 (0-1)
}

/**
 * 颜色工具类
 */
export class ColorHelper {
  /**
   * HSL转RGB
   */
  static hslToRgb(h: number, s: number, l: number): RGBColor {
    h = h / 360
    s = s / 100
    l = l / 100

    const c = (1 - Math.abs(2 * l - 1)) * s
    const x = c * (1 - Math.abs((h * 6) % 2 - 1))
    const m = l - c / 2

    let r = 0, g = 0, b = 0

    if (0 <= h && h < 1/6) {
      r = c; g = x; b = 0
    } else if (1/6 <= h && h < 2/6) {
      r = x; g = c; b = 0
    } else if (2/6 <= h && h < 3/6) {
      r = 0; g = c; b = x
    } else if (3/6 <= h && h < 4/6) {
      r = 0; g = x; b = c
    } else if (4/6 <= h < 5/6) {
      r = x; g = 0; b = c
    } else if (5/6 <= h && h < 1) {
      r = c; g = 0; b = x
    }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    }
  }

  /**
   * RGB转HSL
   */
  static rgbToHsl(r: number, g: number, b: number): HSLColor {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0, s = 0, l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
        case g: h = ((b - r) / d + 2) / 6; break
        case b: h = ((r - g) / d + 4) / 6; break
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    }
  }

  /**
   * HSL转CSS字符串
   */
  static hslToString(hsl: HSLColor): string {
    if (hsl.a !== undefined) {
      return `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${hsl.a})`
    }
    return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
  }

  /**
   * RGB转CSS字符串
   */
  static rgbToString(rgb: RGBColor): string {
    if (rgb.a !== undefined) {
      return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`
    }
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
  }

  /**
   * HEX转RGB
   */
  static hexToRgb(hex: string): RGBColor | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  /**
   * RGB转HEX
   */
  static rgbToHex(r: number, g: number, b: number): string {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  }

  /**
   * 计算相对亮度
   */
  static calculateLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }

  /**
   * 计算对比度
   */
  static calculateContrast(color1: RGBColor, color2: RGBColor): number {
    const lum1 = this.calculateLuminance(color1.r, color1.g, color1.b)
    const lum2 = this.calculateLuminance(color2.r, color2.g, color2.b)
    const brightest = Math.max(lum1, lum2)
    const darkest = Math.min(lum1, lum2)
    return (brightest + 0.05) / (darkest + 0.05)
  }

  /**
   * 检查对比度是否符合WCAG标准
   */
  static checkContrast(compliance: 'AA' | 'AAA', size: 'normal' | 'large'): (ratio: number) => boolean {
    const standards = {
      AA: { normal: 4.5, large: 3 },
      AAA: { normal: 7, large: 4.5 }
    }
    const requiredRatio = standards[compliance][size]
    return (ratio: number) => ratio >= requiredRatio
  }

  /**
   * 获取颜色令牌
   */
  static getColorToken(category: keyof typeof colorTokens, shade: number): HSLColor | null {
    const colorCategory = colorTokens[category]
    if (!colorCategory || typeof colorCategory !== 'object') return null

    // 处理语义颜色
    if (category === 'semantic') {
      const semanticCategory = colorCategory as any
      const semanticKeys = Object.keys(semanticCategory) as Array<keyof typeof semanticCategory>
      for (const semanticKey of semanticKeys) {
        const semanticShades = semanticCategory[semanticKey] as Record<number, HSLColor>
        if (semanticShades[shade]) {
          return semanticShades[shade]
        }
      }
      return null
    }

    // 处理普通颜色
    const colorShades = colorCategory as Record<number, HSLColor>
    return colorShades[shade] || null
  }

  /**
   * 生成颜色比例尺
   */
  static generateColorScale(baseHue: number, baseSaturation: number, baseLightness: number): Record<number, HSLColor> {
    const scale: Record<number, HSLColor> = {}

    // 生成950-50的颜色比例尺
    const shades = [950, 900, 800, 700, 600, 500, 400, 300, 200, 100, 50]

    shades.forEach(shade => {
      let h = baseHue
      let s = baseSaturation
      let l = baseLightness

      if (shade <= 500) {
        // 浅色系：增加亮度，适度降低饱和度
        l = baseLightness + (500 - shade) * 0.1
        s = Math.max(baseSaturation - (500 - shade) * 0.02, 10)
      } else {
        // 深色系：降低亮度，适度调整饱和度和色相
        l = Math.max(baseLightness - (shade - 500) * 0.08, 5)
        s = Math.min(baseSaturation + (shade - 500) * 0.015, 60)
        h = baseHue - (shade - 500) * 0.05 // 添加细微色相偏移
      }

      scale[shade] = {
        h: Math.round(h),
        s: Math.round(s),
        l: Math.round(l)
      }
    })

    return scale
  }

  /**
   * 调整颜色明度
   */
  static adjustLightness(hsl: HSLColor, amount: number): HSLColor {
    return {
      ...hsl,
      l: Math.max(0, Math.min(100, hsl.l + amount))
    }
  }

  /**
   * 调整颜色饱和度
   */
  static adjustSaturation(hsl: HSLColor, amount: number): HSLColor {
    return {
      ...hsl,
      s: Math.max(0, Math.min(100, hsl.s + amount))
    }
  }

  /**
   * 调整颜色色相
   */
  static adjustHue(hsl: HSLColor, amount: number): HSLColor {
    return {
      ...hsl,
      h: (hsl.h + amount + 360) % 360
    }
  }

  /**
   * 创建颜色变体
   */
  static createColorVariants(baseColor: HSLColor): {
    lighter: HSLColor
    light: HSLColor
    base: HSLColor
    dark: HSLColor
    darker: HSLColor
  } {
    return {
      lighter: this.adjustLightness(baseColor, 15),
      light: this.adjustLightness(baseColor, 8),
      base: baseColor,
      dark: this.adjustLightness(baseColor, -8),
      darker: this.adjustLightness(baseColor, -15)
    }
  }

  /**
   * 创建主题感知的颜色
   */
  static createThemeAwareColor(
    baseColor: HSLColor,
    theme: 'light' | 'dark' | 'auto'
  ): HSLColor {
    if (theme === 'auto') {
      // 自动模式下根据系统偏好调整
      if (typeof window !== 'undefined') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        theme = prefersDark ? 'dark' : 'light'
      } else {
        theme = 'light'
      }
    }

    if (theme === 'dark') {
      // 深色主题：降低亮度，增加饱和度
      return {
        ...baseColor,
        l: Math.min(baseColor.l * 1.2, 90),
        s: Math.min(baseColor.s * 1.1, 80)
      }
    } else {
      // 浅色主题：增加亮度，适度降低饱和度
      return {
        ...baseColor,
        l: Math.min(baseColor.l * 0.85 + 15, 95),
        s: baseColor.s
      }
    }
  }

  /**
   * 验证颜色令牌
   */
  static validateColorToken(color: HSLColor): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (typeof color.h !== 'number' || color.h < 0 || color.h > 360) {
      errors.push('色相必须是0-360之间的数字')
    }

    if (typeof color.s !== 'number' || color.s < 0 || color.s > 100) {
      errors.push('饱和度必须是0-100之间的数字')
    }

    if (typeof color.l !== 'number' || color.l < 0 || color.l > 100) {
      errors.push('亮度必须是0-100之间的数字')
    }

    if (color.a !== undefined) {
      if (typeof color.a !== 'number' || color.a < 0 || color.a > 1) {
        errors.push('透明度必须是0-1之间的数字')
      }
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }
}

/**
 * 便捷的颜色函数
 */
export const createColor = (h: number, s: number, l: number, a?: number): HSLColor => ({ h, s, l, a })
export const parseColor = (color: string): HSLColor | null => {
  // 尝试解析 HSL
  const hslMatch = color.match(/hsl[aa]?\((\d+),\s*(\d+)%,\s*(\d+)%/i)
  if (hslMatch) {
    return {
      h: parseInt(hslMatch[1]),
      s: parseInt(hslMatch[2]),
      l: parseInt(hslMatch[3])
    }
  }

  // 尝试解析 HEX
  const rgb = ColorHelper.hexToRgb(color)
  if (rgb) {
    return ColorHelper.rgbToHsl(rgb.r, rgb.g, rgb.b)
  }

  return null
}