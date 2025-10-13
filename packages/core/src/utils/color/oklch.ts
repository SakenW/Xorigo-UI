// @ts-nocheck
/**
 * OKLCH 色彩引擎
 * 基于 culori 库实现的 OKLCH 色彩空间操作
 * 提供颜色转换、插值、调整等功能
 */

import {
  converter,
  interpolate,
  formatHex,
  formatRgb,
  parse,
  type Color,
  type Oklch,
} from 'culori'
import type {
  OKLCHColor,
  RGBColor,
  ColorInput,
  ColorFormat,
  ColorAdjustmentOptions,
  InterpolationOptions,
  ColorComparison,
} from './types'
import { ColorConversionError } from './types'

/**
 * culori 转换器实例
 */
const toOklch = converter('oklch')
const toRgb = converter('rgb')

/**
 * 将任意颜色输入转换为 OKLCH 颜色对象
 * @param input - 颜色输入（OKLCH 对象、RGB 对象、CSS 字符串）
 * @returns OKLCH 颜色对象
 * @throws {ColorConversionError} 当输入无效时抛出
 *
 * @example
 * ```ts
 * // 从 CSS 字符串转换
 * toOKLCH('#ff0000') // { mode: 'oklch', l: 0.62..., c: 0.25..., h: 29.2... }
 *
 * // 从 RGB 对象转换
 * toOKLCH({ mode: 'rgb', r: 1, g: 0, b: 0 })
 *
 * // 从 OKLCH 对象（返回自身）
 * toOKLCH({ mode: 'oklch', l: 0.5, c: 0.1, h: 180 })
 * ```
 */
export function toOKLCH(input: ColorInput): OKLCHColor {
  try {
    let color: Color | undefined

    if (typeof input === 'string') {
      color = parse(input)
    } else if (typeof input === 'object' && input !== null) {
      color = input as Color
    }

    if (!color) {
      throw new ColorConversionError('Invalid color input', input)
    }

    const oklch = toOklch(color) as Oklch | undefined

    if (!oklch || oklch.mode !== 'oklch') {
      throw new ColorConversionError('Failed to convert to OKLCH', input)
    }

    return {
      mode: 'oklch',
      l: oklch.l ?? 0,
      c: oklch.c ?? 0,
      h: oklch.h ?? 0,
      alpha: oklch.alpha,
    }
  } catch (error) {
    if (error instanceof ColorConversionError) {
      throw error
    }
    throw new ColorConversionError(
      `Color conversion failed: ${error instanceof Error ? error.message : String(error)}`,
      input
    )
  }
}

/**
 * 将 OKLCH 颜色转换为 RGB 颜色对象
 * @param color - OKLCH 颜色对象
 * @param clampToGamut - 是否将颜色限制在 sRGB 色域内，默认 true
 * @returns RGB 颜色对象
 *
 * @example
 * ```ts
 * const oklch = { mode: 'oklch', l: 0.5, c: 0.1, h: 180 }
 * toRGB(oklch) // { mode: 'rgb', r: 0.2..., g: 0.6..., b: 0.6... }
 * ```
 */
export function toRGB(color: OKLCHColor, clampToGamut: boolean = true): RGBColor {
  const rgb = toRgb(color as Oklch)

  if (!rgb || rgb.mode !== 'rgb') {
    throw new ColorConversionError('Failed to convert to RGB', color)
  }

  // 如果需要限制色域，将 RGB 值限制在 [0, 1] 范围内
  const r = clampToGamut ? clamp(rgb.r ?? 0, 0, 1) : (rgb.r ?? 0)
  const g = clampToGamut ? clamp(rgb.g ?? 0, 0, 1) : (rgb.g ?? 0)
  const b = clampToGamut ? clamp(rgb.b ?? 0, 0, 1) : (rgb.b ?? 0)

  return {
    mode: 'rgb',
    r,
    g,
    b,
    alpha: rgb.alpha,
  }
}

/**
 * 将颜色格式化为指定格式的字符串
 * @param color - 颜色输入
 * @param format - 输出格式
 * @returns 格式化后的颜色字符串
 *
 * @example
 * ```ts
 * const color = { mode: 'oklch', l: 0.5, c: 0.1, h: 180 }
 *
 * formatColor(color, 'hex')   // '#3ba09e'
 * formatColor(color, 'rgb')   // 'rgb(59, 160, 158)'
 * formatColor(color, 'css')   // 'oklch(0.5 0.1 180)'
 * formatColor(color, 'oklch') // 'oklch(0.5 0.1 180)'
 * ```
 */
export function formatColor(color: ColorInput, format: ColorFormat = 'hex'): string {
  const oklch = toOKLCH(color)

  switch (format) {
    case 'hex': {
      const rgb = toRGB(oklch)
      return formatHex(rgb)
    }
    case 'rgb': {
      const rgb = toRGB(oklch)
      return formatRgb(rgb)
    }
    case 'css':
    case 'oklch': {
      const { l, c, h, alpha } = oklch
      const alphaStr = alpha !== undefined && alpha < 1 ? ` / ${alpha}` : ''
      return `oklch(${l.toFixed(4)} ${c.toFixed(4)} ${h.toFixed(2)}${alphaStr})`
    }
    default:
      throw new ColorConversionError(`Unknown format: ${format}`)
  }
}

/**
 * 在 OKLCH 色彩空间中进行颜色插值
 * @param colors - 颜色数组（至少 2 个）
 * @param t - 插值参数，范围 [0, 1]
 * @param options - 插值选项
 * @returns 插值后的 OKLCH 颜色
 *
 * @example
 * ```ts
 * // 在红色和蓝色之间插值
 * interpolateColor(['#ff0000', '#0000ff'], 0.5)
 *
 * // 使用 RGB 插值（不推荐）
 * interpolateColor(['#ff0000', '#0000ff'], 0.5, { mode: 'rgb' })
 *
 * // 指定色相修复方式
 * interpolateColor(['red', 'blue'], 0.5, { hueFixup: 'longer' })
 * ```
 */
export function interpolateColor(
  colors: ColorInput[],
  t: number,
  options: InterpolationOptions = {}
): OKLCHColor {
  if (colors.length < 2) {
    throw new ColorConversionError('At least 2 colors are required for interpolation')
  }

  if (t < 0 || t > 1) {
    throw new ColorConversionError(`Invalid interpolation parameter: ${t}. Must be in [0, 1]`)
  }

  const { mode = 'oklch', hueFixup = 'shorter' } = options

  // 将所有颜色转换为 culori Color 对象
  const parsedColors = colors.map((color) => {
    if (typeof color === 'string') {
      return parse(color)
    }
    return color as Color
  })

  // 创建插值器
  const interpolator = interpolate(parsedColors, mode)

  // 执行插值
  const result = interpolator(t)

  if (!result) {
    throw new ColorConversionError('Interpolation failed')
  }

  // 转换为 OKLCH
  return toOKLCH(result)
}

/**
 * 调整颜色的明度、色度、色相或透明度
 * @param color - 输入颜色
 * @param adjustments - 调整选项
 * @returns 调整后的 OKLCH 颜色
 *
 * @example
 * ```ts
 * const color = '#ff0000'
 *
 * // 增加明度
 * adjustColor(color, { lightness: 0.2 })
 *
 * // 降低色度（饱和度）
 * adjustColor(color, { chroma: -0.05 })
 *
 * // 旋转色相
 * adjustColor(color, { hue: 30 })
 *
 * // 设置透明度
 * adjustColor(color, { alpha: 0.5 })
 *
 * // 组合调整
 * adjustColor(color, { lightness: 0.1, chroma: -0.02, hue: 15 })
 * ```
 */
export function adjustColor(
  color: ColorInput,
  adjustments: ColorAdjustmentOptions
): OKLCHColor {
  const oklch = toOKLCH(color)
  const { lightness, chroma, hue, alpha } = adjustments

  return {
    mode: 'oklch',
    l: lightness !== undefined ? clamp(oklch.l + lightness, 0, 1) : oklch.l,
    c: chroma !== undefined ? clamp(oklch.c + chroma, 0, 0.4) : oklch.c,
    h: hue !== undefined ? normalizeHue(oklch.h + hue) : oklch.h,
    alpha: alpha !== undefined ? clamp(alpha, 0, 1) : oklch.alpha,
  }
}

/**
 * 设置颜色的明度
 * @param color - 输入颜色
 * @param lightness - 新的明度值，范围 [0, 1]
 * @returns 调整后的颜色
 */
export function setLightness(color: ColorInput, lightness: number): OKLCHColor {
  const oklch = toOKLCH(color)
  return {
    ...oklch,
    l: clamp(lightness, 0, 1),
  }
}

/**
 * 设置颜色的色度（饱和度）
 * @param color - 输入颜色
 * @param chroma - 新的色度值，范围 [0, 0.4]
 * @returns 调整后的颜色
 */
export function setChroma(color: ColorInput, chroma: number): OKLCHColor {
  const oklch = toOKLCH(color)
  return {
    ...oklch,
    c: clamp(chroma, 0, 0.4),
  }
}

/**
 * 设置颜色的色相
 * @param color - 输入颜色
 * @param hue - 新的色相值，范围 [0, 360)
 * @returns 调整后的颜色
 */
export function setHue(color: ColorInput, hue: number): OKLCHColor {
  const oklch = toOKLCH(color)
  return {
    ...oklch,
    h: normalizeHue(hue),
  }
}

/**
 * 设置颜色的透明度
 * @param color - 输入颜色
 * @param alpha - 新的透明度值，范围 [0, 1]
 * @returns 调整后的颜色
 */
export function setAlpha(color: ColorInput, alpha: number): OKLCHColor {
  const oklch = toOKLCH(color)
  return {
    ...oklch,
    alpha: clamp(alpha, 0, 1),
  }
}

/**
 * 比较两个颜色的差异
 * @param color1 - 第一个颜色
 * @param color2 - 第二个颜色
 * @param threshold - 相似度阈值，默认 0.01
 * @returns 颜色比较结果
 *
 * @example
 * ```ts
 * const comparison = compareColors('#ff0000', '#ff0001')
 * console.log(comparison.isSimilar) // true
 * console.log(comparison.euclidean) // 0.0001...
 * ```
 */
export function compareColors(
  color1: ColorInput,
  color2: ColorInput,
  threshold: number = 0.01
): ColorComparison {
  const oklch1 = toOKLCH(color1)
  const oklch2 = toOKLCH(color2)

  // 计算欧几里得距离
  const euclidean = Math.sqrt(
    Math.pow(oklch1.l - oklch2.l, 2) +
      Math.pow(oklch1.c - oklch2.c, 2) +
      Math.pow(normalizeHueDifference(oklch1.h, oklch2.h) / 360, 2)
  )

  return {
    euclidean,
    isSimilar: euclidean < threshold,
  }
}

/**
 * 生成颜色刻度（色阶）
 * @param startColor - 起始颜色
 * @param endColor - 结束颜色
 * @param steps - 步数（包括起始和结束颜色）
 * @returns 颜色数组
 *
 * @example
 * ```ts
 * // 生成从红色到蓝色的 5 级色阶
 * const scale = generateColorScale('#ff0000', '#0000ff', 5)
 * // 返回 5 个颜色，包括起始和结束颜色
 * ```
 */
export function generateColorScale(
  startColor: ColorInput,
  endColor: ColorInput,
  steps: number
): OKLCHColor[] {
  if (steps < 2) {
    throw new ColorConversionError('Steps must be at least 2')
  }

  const colors: OKLCHColor[] = []

  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1)
    colors.push(interpolateColor([startColor, endColor], t))
  }

  return colors
}

/**
 * 将数值限制在指定范围内
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * 将色相值规范化到 [0, 360) 范围
 */
function normalizeHue(hue: number): number {
  return ((hue % 360) + 360) % 360
}

/**
 * 计算两个色相值之间的最短差异
 */
function normalizeHueDifference(hue1: number, hue2: number): number {
  const diff = Math.abs(hue1 - hue2)
  return diff > 180 ? 360 - diff : diff
}
