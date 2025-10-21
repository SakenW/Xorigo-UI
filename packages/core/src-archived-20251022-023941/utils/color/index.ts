/**
 * OKLCH 色彩引擎模块
 * 提供完整的 OKLCH 色彩空间操作功能
 *
 * @example
 * ```ts
 * // 函数式 API
 * import { toOKLCH, formatColor, interpolateColor, adjustColor } from '@th-ui/core/utils/color'
 *
 * const oklch = toOKLCH('#ff0000')
 * const hex = formatColor(oklch, 'hex')
 * const mixed = interpolateColor(['red', 'blue'], 0.5)
 * const lighter = adjustColor(oklch, { lightness: 0.2 })
 *
 * // 面向对象 API
 * import { OKLCHColor } from '@th-ui/core/utils/color'
 *
 * const color = new OKLCHColor('#ff0000')
 * const adjusted = color
 *   .lighten(0.1)
 *   .saturate(0.05)
 *   .rotate(30)
 *
 * console.log(adjusted.toHex())    // '#ff5533'
 * console.log(adjusted.toRgb())    // 'rgb(255, 85, 51)'
 * console.log(adjusted.toCss())    // 'oklch(0.65 0.20 30)'
 * ```
 */

// 类型定义
export type {
  OKLCHColor as OKLCHColorType,
  RGBColor,
  ColorInput,
  ColorFormat,
  ColorAdjustmentOptions,
  InterpolationOptions,
  ColorComparison,
} from './types'
export { ColorConversionError } from './types'

// 核心转换函数
export {
  toOKLCH,
  toRGB,
  formatColor,
} from './oklch'

// 色彩插值
export {
  interpolateColor,
  generateColorScale,
} from './oklch'

// 色彩调整函数
export {
  adjustColor,
  setLightness,
  setChroma,
  setHue,
  setAlpha,
} from './oklch'

// 色彩比较
export {
  compareColors,
} from './oklch'

// 工具类
export { OKLCHColor } from './OKLCHColor'

/**
 * 预定义的色彩操作快捷函数
 */

/**
 * 将颜色转换为十六进制字符串
 * @param color - 颜色输入
 * @returns 十六进制颜色字符串
 */
export { formatColor as toHex } from './oklch'

/**
 * 将颜色转换为 RGB 字符串
 * @param color - 颜色输入
 * @returns RGB 颜色字符串
 */
export { formatColor as toRgbString } from './oklch'

/**
 * 将颜色转换为 CSS oklch() 函数字符串
 * @param color - 颜色输入
 * @returns OKLCH 颜色字符串
 */
export { formatColor as toOklchString } from './oklch'
