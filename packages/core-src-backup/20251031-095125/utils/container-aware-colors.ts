/**
 * 容器感知颜色工具集
 * 用于智能检测背景色并生成适配的前景色
 */

// 颜色格式转换工具
export class ColorUtils {
  /**
   * 将 RGB 转换为 HSL
   */
  static rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }

    return { h: h * 360, s: s * 100, l: l * 100 }
  }

  /**
   * 将 HSL 转换为 RGB
   */
  static hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
    h /= 360
    s /= 100
    l /= 100

    let r, g, b

    if (s === 0) {
      r = g = b = l // achromatic
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1/6) return p + (q - p) * 6 * t
        if (t < 1/2) return q
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    }
  }

  /**
   * 解析 CSS 颜色值
   */
  static parseColor(color: string): { r: number; g: number; b: number; a?: number } | null {
    // 处理 hex 格式
    if (color.startsWith('#')) {
      const hex = color.slice(1)
      if (hex.length === 3) {
        const r = parseInt(hex[0] + hex[0], 16)
        const g = parseInt(hex[1] + hex[1], 16)
        const b = parseInt(hex[2] + hex[2], 16)
        return { r, g, b }
      } else if (hex.length === 6) {
        const r = parseInt(hex.substr(0, 2), 16)
        const g = parseInt(hex.substr(2, 2), 16)
        const b = parseInt(hex.substr(4, 2), 16)
        return { r, g, b }
      } else if (hex.length === 8) {
        const r = parseInt(hex.substr(0, 2), 16)
        const g = parseInt(hex.substr(2, 2), 16)
        const b = parseInt(hex.substr(4, 2), 16)
        const a = parseInt(hex.substr(6, 2), 16) / 255
        return { r, g, b, a }
      }
    }

    // 处理 rgb/rgba 格式
    const rgbMatch = color.match(/rgba?\(([^)]+)\)/)
    if (rgbMatch) {
      const values = rgbMatch[1].split(',').map(v => parseFloat(v.trim()))
      return {
        r: values[0],
        g: values[1],
        b: values[2],
        a: values[3] ?? 1
      }
    }

    // 处理 hsl/hsla 格式
    const hslMatch = color.match(/hsla?\(([^)]+)\)/)
    if (hslMatch) {
      const values = hslMatch[1].split(',').map(v => parseFloat(v.trim()))
      const rgb = this.hslToRgb(values[0], values[1], values[2])
      return {
        r: rgb.r,
        g: rgb.g,
        b: rgb.b,
        a: values[3] ?? 1
      }
    }

    // 处理 CSS 变量引用
    if (color.startsWith('var(')) {
      // 这里返回 null，需要外部处理 CSS 变量
      return null
    }

    return null
  }

  /**
   * 计算相对亮度 (WCAG 标准)
   */
  static getRelativeLuminance(r: number, g: number, b: number): number {
    const rsRGB = r / 255
    const gsRGB = g / 255
    const bsRGB = b / 255

    const rL = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4)
    const gL = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4)
    const bL = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4)

    return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL
  }

  /**
   * 计算对比度
   */
  static getContrastRatio(color1: { r: number; g: number; b: number }, color2: { r: number; g: number; b: number }): number {
    const l1 = this.getRelativeLuminance(color1.r, color1.g, color1.b)
    const l2 = this.getRelativeLuminance(color2.r, color2.g, color2.b)

    const lighter = Math.max(l1, l2)
    const darker = Math.min(l1, l2)

    return (lighter + 0.05) / (darker + 0.05)
  }

  /**
   * 判断颜色是浅色还是深色
   * 优化了阈值判断，更好地处理玻璃拟态背景
   */
  static isLightColor(r: number, g: number, b: number): boolean {
    const luminance = this.getRelativeLuminance(r, g, b)
    // 使用更保守的阈值，确保在玻璃背景下有足够对比度
    // 对于玻璃拟态背景，需要更强的对比度
    return luminance > 0.35
  }

  /**
   * 生成 HSL 格式的颜色字符串
   */
  static hslToString(h: number, s: number, l: number): string {
    return `hsl(${Math.round(h)}deg ${Math.round(s)}% ${Math.round(l)}%)`
  }
}

// 智能调色板生成器
export class SmartPaletteGenerator {
  /**
   * 生成与背景色对比度良好的渐变调色板
   */
  static generateAdaptivePalette(
    bgR: number,
    bgG: number,
    bgB: number,
    options: {
      vibrant?: boolean        // 是否使用鲜艳色彩
      count?: number          // 颜色数量
      minContrast?: number    // 最小对比度
    } = {}
  ): string[] {
    const { vibrant = true, count = 5, minContrast = 4.5 } = options
    const isLightBg = ColorUtils.isLightColor(bgR, bgG, bgB)

    // 使用固定的色调范围，避免随机性导致的跳变
    const hueRanges = vibrant
      ? (isLightBg ? [280, 340, 200, 180, 160] : [30, 45, 120, 200, 280])
      : (isLightBg ? [220, 200, 180, 160, 140] : [0, 20, 40, 200, 220])

    return hueRanges.slice(0, count).map((baseHue, index) => {
      // 使用固定的饱和度和亮度，减少随机性
      const saturation = vibrant ? 70 : 50
      const lightness = isLightBg ? 45 : 65

      // 只做微小的调整，避免大幅度跳变
      const smallVariation = (Math.sin(Date.now() / 1000 + index) * 0.1 + 0.5)
      const finalLightness = lightness + (smallVariation - 0.5) * 10

      return ColorUtils.hslToString(baseHue, saturation, Math.max(20, Math.min(80, finalLightness)))
    })
  }

  /**
   * 生成合适的中心点颜色
   * 针对玻璃拟态背景进行了优化
   */
  static generateCenterColor(
    bgR: number,
    bgG: number,
    bgB: number,
    paletteColors: string[]
  ): string {
    const isLightBg = ColorUtils.isLightColor(bgR, bgG, bgB)

    // 中心点颜色需要与背景形成强烈对比，同时考虑美观性
    // 使用固定的色调和饱和度，避免随机跳变
    if (isLightBg) {
      // 浅色背景使用深色中心点 - 增强对比度
      const hue = 220 // 深蓝色调
      const saturation = 50 // 提高饱和度，增强视觉效果
      const lightness = 20 // 更深一些，确保在玻璃背景下清晰可见

      return ColorUtils.hslToString(hue, saturation, lightness)
    } else {
      // 深色背景使用亮色中心点 - 增强对比度
      const hue = 200 // 浅蓝色调
      const saturation = 60 // 更鲜艳一些
      const lightness = 85 // 更亮一些，确保在深色背景下突出

      return ColorUtils.hslToString(hue, saturation, lightness)
    }
  }

  /**
   * 生成光晕渐变色
   */
  static generateHaloGradient(
    bgR: number,
    bgG: number,
    bgB: number
  ): { start: string; end: string } {
    const isLightBg = ColorUtils.isLightColor(bgR, bgG, bgB)

    if (isLightBg) {
      // 浅色背景：使用柔和的彩色光晕
      return {
        start: `hsla(${Math.random() * 60 + 240}, 70%, 60%, 0.15)`, // 蓝紫色系
        end: `hsla(${Math.random() * 60 + 180}, 60%, 50%, 0.08)`   // 青色系
      }
    } else {
      // 深色背景：使用更明亮的光晕
      return {
        start: `hsla(${Math.random() * 60 + 270}, 80%, 65%, 0.2)`,  // 紫色系
        end: `hsla(${Math.random() * 60 + 190}, 85%, 60%, 0.1)`    // 青色系
      }
    }
  }
}