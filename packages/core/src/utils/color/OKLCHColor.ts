/**
 * OKLCHColor 工具类
 * 提供面向对象的 OKLCH 色彩操作接口
 */

import type { OKLCHColor as OKLCHColorType, ColorInput, ColorFormat } from './types'
import {
  toOKLCH,
  toRGB,
  formatColor,
  adjustColor,
  setLightness,
  setChroma,
  setHue,
  setAlpha,
  compareColors,
  interpolateColor,
} from './oklch'

/**
 * OKLCH 颜色工具类
 * 提供链式调用和不可变操作
 *
 * @example
 * ```ts
 * // 创建颜色实例
 * const color = new OKLCHColor('#ff0000')
 *
 * // 链式调用
 * const adjusted = color
 *   .lighten(0.1)
 *   .saturate(0.05)
 *   .rotate(30)
 *
 * // 输出不同格式
 * adjusted.toHex()    // '#ff5533'
 * adjusted.toRgb()    // 'rgb(255, 85, 51)'
 * adjusted.toCss()    // 'oklch(0.65 0.20 30)'
 * ```
 */
export class OKLCHColor {
  private readonly _color: OKLCHColorType

  /**
   * 构造函数
   * @param input - 颜色输入（CSS 字符串、OKLCH 对象、RGB 对象）
   */
  constructor(input: ColorInput) {
    this._color = toOKLCH(input)
  }

  /**
   * 获取 OKLCH 颜色对象（只读）
   */
  get color(): Readonly<OKLCHColorType> {
    return Object.freeze({ ...this._color })
  }

  /**
   * 获取明度值
   */
  get lightness(): number {
    return this._color.l
  }

  /**
   * 获取色度值
   */
  get chroma(): number {
    return this._color.c
  }

  /**
   * 获取色相值
   */
  get hue(): number {
    return this._color.h
  }

  /**
   * 获取透明度值
   */
  get alpha(): number {
    return this._color.alpha ?? 1
  }

  /**
   * 增加明度
   * @param amount - 增加量，范围 [0, 1]
   * @returns 新的 OKLCHColor 实例
   */
  lighten(amount: number): OKLCHColor {
    return new OKLCHColor(adjustColor(this._color, { lightness: amount }))
  }

  /**
   * 降低明度
   * @param amount - 降低量，范围 [0, 1]
   * @returns 新的 OKLCHColor 实例
   */
  darken(amount: number): OKLCHColor {
    return new OKLCHColor(adjustColor(this._color, { lightness: -amount }))
  }

  /**
   * 增加色度（饱和度）
   * @param amount - 增加量，范围 [0, 0.4]
   * @returns 新的 OKLCHColor 实例
   */
  saturate(amount: number): OKLCHColor {
    return new OKLCHColor(adjustColor(this._color, { chroma: amount }))
  }

  /**
   * 降低色度（饱和度）
   * @param amount - 降低量，范围 [0, 0.4]
   * @returns 新的 OKLCHColor 实例
   */
  desaturate(amount: number): OKLCHColor {
    return new OKLCHColor(adjustColor(this._color, { chroma: -amount }))
  }

  /**
   * 旋转色相
   * @param degrees - 旋转角度（度）
   * @returns 新的 OKLCHColor 实例
   */
  rotate(degrees: number): OKLCHColor {
    return new OKLCHColor(adjustColor(this._color, { hue: degrees }))
  }

  /**
   * 设置明度
   * @param value - 明度值，范围 [0, 1]
   * @returns 新的 OKLCHColor 实例
   */
  withLightness(value: number): OKLCHColor {
    return new OKLCHColor(setLightness(this._color, value))
  }

  /**
   * 设置色度
   * @param value - 色度值，范围 [0, 0.4]
   * @returns 新的 OKLCHColor 实例
   */
  withChroma(value: number): OKLCHColor {
    return new OKLCHColor(setChroma(this._color, value))
  }

  /**
   * 设置色相
   * @param value - 色相值，范围 [0, 360)
   * @returns 新的 OKLCHColor 实例
   */
  withHue(value: number): OKLCHColor {
    return new OKLCHColor(setHue(this._color, value))
  }

  /**
   * 设置透明度
   * @param value - 透明度值，范围 [0, 1]
   * @returns 新的 OKLCHColor 实例
   */
  withAlpha(value: number): OKLCHColor {
    return new OKLCHColor(setAlpha(this._color, value))
  }

  /**
   * 混合两个颜色
   * @param other - 另一个颜色
   * @param ratio - 混合比例，范围 [0, 1]，0 表示当前颜色，1 表示另一个颜色
   * @returns 新的 OKLCHColor 实例
   */
  mix(other: ColorInput, ratio: number = 0.5): OKLCHColor {
    return new OKLCHColor(interpolateColor([this._color, other], ratio))
  }

  /**
   * 比较两个颜色是否相似
   * @param other - 另一个颜色
   * @param threshold - 相似度阈值，默认 0.01
   * @returns 是否相似
   */
  isSimilar(other: ColorInput, threshold: number = 0.01): boolean {
    return compareColors(this._color, other, threshold).isSimilar
  }

  /**
   * 计算与另一个颜色的欧几里得距离
   * @param other - 另一个颜色
   * @returns 距离值
   */
  distance(other: ColorInput): number {
    return compareColors(this._color, other).euclidean
  }

  /**
   * 转换为十六进制字符串
   * @returns 十六进制颜色字符串（如 '#ff0000'）
   */
  toHex(): string {
    return formatColor(this._color, 'hex')
  }

  /**
   * 转换为 RGB 字符串
   * @returns RGB 颜色字符串（如 'rgb(255, 0, 0)'）
   */
  toRgb(): string {
    return formatColor(this._color, 'rgb')
  }

  /**
   * 转换为 CSS oklch() 函数字符串
   * @returns OKLCH 颜色字符串（如 'oklch(0.6 0.25 29)'）
   */
  toCss(): string {
    return formatColor(this._color, 'css')
  }

  /**
   * 转换为指定格式的字符串
   * @param format - 输出格式
   * @returns 格式化后的颜色字符串
   */
  toString(format: ColorFormat = 'hex'): string {
    return formatColor(this._color, format)
  }

  /**
   * 转换为 RGB 颜色对象
   * @returns RGB 颜色对象
   */
  toRgbObject() {
    return toRGB(this._color)
  }

  /**
   * 转换为 OKLCH 颜色对象
   * @returns OKLCH 颜色对象
   */
  toOklchObject(): OKLCHColorType {
    return { ...this._color }
  }

  /**
   * 克隆当前颜色
   * @returns 新的 OKLCHColor 实例
   */
  clone(): OKLCHColor {
    return new OKLCHColor(this._color)
  }

  /**
   * 静态工厂方法：从 OKLCH 值创建颜色
   * @param l - 明度，范围 [0, 1]
   * @param c - 色度，范围 [0, 0.4]
   * @param h - 色相，范围 [0, 360)
   * @param alpha - 透明度，范围 [0, 1]，可选
   * @returns OKLCHColor 实例
   */
  static fromOklch(l: number, c: number, h: number, alpha?: number): OKLCHColor {
    return new OKLCHColor({ mode: 'oklch', l, c, h, alpha })
  }

  /**
   * 静态工厂方法：从 RGB 值创建颜色
   * @param r - 红色通道，范围 [0, 255]
   * @param g - 绿色通道，范围 [0, 255]
   * @param b - 蓝色通道，范围 [0, 255]
   * @param alpha - 透明度，范围 [0, 1]，可选
   * @returns OKLCHColor 实例
   */
  static fromRgb(r: number, g: number, b: number, alpha?: number): OKLCHColor {
    return new OKLCHColor({
      mode: 'rgb',
      r: r / 255,
      g: g / 255,
      b: b / 255,
      alpha,
    })
  }

  /**
   * 静态工厂方法：从十六进制字符串创建颜色
   * @param hex - 十六进制颜色字符串（如 '#ff0000'）
   * @returns OKLCHColor 实例
   */
  static fromHex(hex: string): OKLCHColor {
    return new OKLCHColor(hex)
  }
}
