/**
 * OKLCH 色彩引擎类型定义
 * 基于 culori 库实现的 OKLCH 色彩空间操作
 */

/**
 * OKLCH 颜色对象
 * @property mode - 色彩空间模式，固定为 'oklch'
 * @property l - 明度 (Lightness)，范围 [0, 1]
 * @property c - 色度 (Chroma)，范围 [0, 0.4]
 * @property h - 色相 (Hue)，范围 [0, 360)
 * @property alpha - 透明度，范围 [0, 1]，可选
 */
export interface OKLCHColor {
  mode: 'oklch'
  l: number
  c: number
  h: number
  alpha?: number
}

/**
 * RGB 颜色对象
 * @property mode - 色彩空间模式，固定为 'rgb'
 * @property r - 红色通道，范围 [0, 1]
 * @property g - 绿色通道，范围 [0, 1]
 * @property b - 蓝色通道，范围 [0, 1]
 * @property alpha - 透明度，范围 [0, 1]，可选
 */
export interface RGBColor {
  mode: 'rgb'
  r: number
  g: number
  b: number
  alpha?: number
}

/**
 * 色彩输入类型
 * 支持 OKLCH 对象、RGB 对象、CSS 字符串
 */
export type ColorInput = OKLCHColor | RGBColor | string

/**
 * 色彩输出格式
 */
export type ColorFormat = 'oklch' | 'rgb' | 'hex' | 'css'

/**
 * 色彩调整选项
 */
export interface ColorAdjustmentOptions {
  /** 明度调整，范围 [-1, 1] */
  lightness?: number
  /** 色度调整，范围 [-0.4, 0.4] */
  chroma?: number
  /** 色相调整（度），范围 [0, 360] */
  hue?: number
  /** 透明度调整，范围 [0, 1] */
  alpha?: number
}

/**
 * 色彩插值选项
 */
export interface InterpolationOptions {
  /** 插值模式，默认使用 OKLCH 色彩空间 */
  mode?: 'oklch' | 'rgb'
  /** 色相修复函数，用于处理色相环绕 */
  hueFixup?: 'shorter' | 'longer' | 'increasing' | 'decreasing'
}

/**
 * 色彩比较结果
 */
export interface ColorComparison {
  /** 欧几里得距离 */
  euclidean: number
  /** 感知差异 (Delta E) */
  deltaE?: number
  /** 是否相似（基于阈值） */
  isSimilar: boolean
}

/**
 * 色彩转换错误
 */
export class ColorConversionError extends Error {
  constructor(message: string, public readonly input?: unknown) {
    super(message)
    this.name = 'ColorConversionError'
  }
}
