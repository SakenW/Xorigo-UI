/**
 * Matrix 色盲模拟器 (Color Vision Deficiency Simulator)
 * 模拟不同类型的色盲对颜色的感知
 */

import type { CVDType } from './config'

/**
 * RGB 颜色接口
 */
interface RGB {
  r: number
  g: number
  b: number
}

/**
 * 解析 Hex 颜色为 RGB
 * @param hex Hex 颜色字符串 (#RRGGBB 或 #RGB)
 * @returns RGB 对象
 */
function hexToRgb(hex: string): RGB {
  // 移除 # 符号
  const cleanHex = hex.replace('#', '')

  // 处理缩写格式 (#RGB)
  const fullHex =
    cleanHex.length === 3
      ? cleanHex
          .split('')
          .map((char) => char + char)
          .join('')
      : cleanHex

  const r = parseInt(fullHex.substring(0, 2), 16)
  const g = parseInt(fullHex.substring(2, 4), 16)
  const b = parseInt(fullHex.substring(4, 6), 16)

  return { r, g, b }
}

/**
 * RGB 转换为 Hex 颜色
 * @param rgb RGB 对象
 * @returns Hex 颜色字符串
 */
function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`
}

/**
 * 色盲模拟转换矩阵
 * 基于 Brettel, Viénot and Mollon CVRL 算法
 * 参考: https://www.color-blindness.com/color-name-hue/
 */
const CVD_MATRICES: Record<CVDType, number[][]> = {
  // 红色盲 (无法感知红色)
  protanopia: [
    [0.56667, 0.43333, 0.0],
    [0.55833, 0.44167, 0.0],
    [0.0, 0.24167, 0.75833],
  ],
  // 绿色盲 (无法感知绿色)
  deuteranopia: [
    [0.625, 0.375, 0.0],
    [0.7, 0.3, 0.0],
    [0.0, 0.3, 0.7],
  ],
  // 蓝色盲 (无法感知蓝色)
  tritanopia: [
    [0.95, 0.05, 0.0],
    [0.0, 0.43333, 0.56667],
    [0.0, 0.475, 0.525],
  ],
  // 全色盲 (只能感知灰度)
  achromatopsia: [
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
  ],
}

/**
 * 应用色盲模拟矩阵转换颜色
 * @param rgb 原始 RGB 颜色
 * @param matrix 转换矩阵
 * @returns 模拟后的 RGB 颜色
 */
function applyMatrix(rgb: RGB, matrix: number[][]): RGB {
  const r = matrix[0][0] * rgb.r + matrix[0][1] * rgb.g + matrix[0][2] * rgb.b
  const g = matrix[1][0] * rgb.r + matrix[1][1] * rgb.g + matrix[1][2] * rgb.b
  const b = matrix[2][0] * rgb.r + matrix[2][1] * rgb.g + matrix[2][2] * rgb.b

  return { r, g, b }
}

/**
 * 模拟色盲对颜色的感知
 * @param color Hex 颜色字符串
 * @param cvdType 色盲类型
 * @returns 模拟后的 Hex 颜色字符串
 */
export function simulateCVD(color: string, cvdType: CVDType): string {
  const rgb = hexToRgb(color)
  const matrix = CVD_MATRICES[cvdType]
  const transformedRgb = applyMatrix(rgb, matrix)
  return rgbToHex(transformedRgb)
}

/**
 * 批量模拟色盲对颜色的感知
 * @param colors Hex 颜色字符串数组
 * @param cvdType 色盲类型
 * @returns 模拟后的 Hex 颜色字符串数组
 */
export function simulateCVDBatch(
  colors: string[],
  cvdType: CVDType
): string[] {
  return colors.map((color) => simulateCVD(color, cvdType))
}

/**
 * 检查颜色在色盲模拟下是否仍然可区分
 * @param color1 颜色 1
 * @param color2 颜色 2
 * @param cvdType 色盲类型
 * @param threshold 可区分阈值 (0-100, 默认 10)
 * @returns 是否可区分
 */
export function isDistinguishableWithCVD(
  color1: string,
  color2: string,
  cvdType: CVDType,
  threshold = 10
): boolean {
  const simulated1 = simulateCVD(color1, cvdType)
  const simulated2 = simulateCVD(color2, cvdType)

  const rgb1 = hexToRgb(simulated1)
  const rgb2 = hexToRgb(simulated2)

  // 计算欧几里得距离
  const distance = Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
      Math.pow(rgb1.g - rgb2.g, 2) +
      Math.pow(rgb1.b - rgb2.b, 2)
  )

  // 距离超过阈值则认为可区分
  return distance >= threshold
}

/**
 * 获取颜色在所有色盲类型下的模拟结果
 * @param color Hex 颜色字符串
 * @returns 所有色盲类型的模拟结果
 */
export function simulateAllCVD(
  color: string
): Record<CVDType, string> {
  return {
    protanopia: simulateCVD(color, 'protanopia'),
    deuteranopia: simulateCVD(color, 'deuteranopia'),
    tritanopia: simulateCVD(color, 'tritanopia'),
    achromatopsia: simulateCVD(color, 'achromatopsia'),
  }
}

/**
 * 验证颜色对在所有色盲类型下是否可区分
 * @param color1 颜色 1
 * @param color2 颜色 2
 * @param cvdTypes 需要验证的色盲类型
 * @param threshold 可区分阈值
 * @returns 验证结果 (key: CVDType, value: 是否可区分)
 */
export function validateCVDDistinguishability(
  color1: string,
  color2: string,
  cvdTypes: CVDType[],
  threshold = 10
): Record<CVDType, boolean> {
  const result: Partial<Record<CVDType, boolean>> = {}

  for (const cvdType of cvdTypes) {
    result[cvdType] = isDistinguishableWithCVD(
      color1,
      color2,
      cvdType,
      threshold
    )
  }

  return result as Record<CVDType, boolean>
}
