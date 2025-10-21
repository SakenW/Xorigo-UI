// @ts-nocheck
/**
 * Matrix 对比度验证器
 * 使用 color-contrast-checker 库进行 WCAG 标准验证
 */

import ColorContrastChecker from 'color-contrast-checker'
import type {
  MatrixConfig,
  ValidationIssue,
  SeverityLevel,
} from './config'

const ccc = new ColorContrastChecker()

/**
 * 文本类型 (用于对比度计算)
 */
export type TextType = 'normal' | 'large' | 'ui-component'

/**
 * 对比度验证结果
 */
export interface ContrastValidationResult {
  /** 是否通过 */
  passed: boolean
  /** 实际对比度比例 */
  ratio: number
  /** 要求的对比度比例 */
  requiredRatio: number
  /** 文本类型 */
  textType: TextType
  /** 验证级别 */
  level: 'AA' | 'AAA'
}

/**
 * 计算两个颜色之间的对比度比例
 * @param foreground 前景色 (如文本颜色)
 * @param background 背景色
 * @returns 对比度比例 (1:1 到 21:1)
 */
export function calculateContrastRatio(
  foreground: string,
  background: string
): number {
  // 使用 color-contrast-checker 的内部方法计算对比度
  // 该库有 getContrastRatio 方法，但可能未导出
  // 我们使用手动计算方式确保兼容性

  // 将 hex 颜色转换为 RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 }
  }

  // 计算相对亮度
  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }

  const fg = hexToRgb(foreground)
  const bg = hexToRgb(background)

  const l1 = getLuminance(fg.r, fg.g, fg.b)
  const l2 = getLuminance(bg.r, bg.g, bg.b)

  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)

  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * 验证颜色对比度是否符合 WCAG 标准
 * @param foreground 前景色
 * @param background 背景色
 * @param textType 文本类型
 * @param config Matrix 配置
 * @returns 验证结果
 */
export function validateContrast(
  foreground: string,
  background: string,
  textType: TextType,
  config: MatrixConfig
): ContrastValidationResult {
  const fontSize = textType === 'large' ? 18 : 14
  const level = config.strictness

  let requiredRatio: number
  let passed: boolean

  if (textType === 'ui-component') {
    // UI 组件对比度标准
    requiredRatio = config.contrast.uiComponentAA
    const ratio = calculateContrastRatio(foreground, background)
    passed = ratio >= requiredRatio
    return { passed, ratio, requiredRatio, textType, level }
  }

  // 文本对比度标准
  if (level === 'AA') {
    requiredRatio =
      textType === 'large'
        ? config.contrast.largeTextAA
        : config.contrast.normalTextAA
    passed = ccc.isLevelAA(foreground, background, fontSize)
  } else {
    requiredRatio =
      textType === 'large'
        ? config.contrast.largeTextAAA
        : config.contrast.normalTextAAA
    passed = ccc.isLevelAAA(foreground, background, fontSize)
  }

  const ratio = calculateContrastRatio(foreground, background)

  return {
    passed,
    ratio,
    requiredRatio,
    textType,
    level,
  }
}

/**
 * 批量验证颜色对比度
 * @param pairs 颜色对数组
 * @param config Matrix 配置
 * @returns 验证问题列表
 */
export function validateContrastBatch(
  pairs: Array<{
    foreground: string
    background: string
    textType: TextType
    label: string
  }>,
  config: MatrixConfig
): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  for (const pair of pairs) {
    const result = validateContrast(
      pair.foreground,
      pair.background,
      pair.textType,
      config
    )

    if (!result.passed) {
      const severity: SeverityLevel =
        result.ratio < result.requiredRatio * 0.8 ? 'error' : 'warning'

      issues.push({
        type: 'contrast',
        severity,
        message: `${pair.label} 对比度不足 (${result.ratio.toFixed(2)}:1)`,
        actual: result.ratio,
        expected: result.requiredRatio,
        suggestion: `增加前景色与背景色的对比度至少 ${result.requiredRatio}:1`,
      })
    }
  }

  return issues
}

/**
 * 验证主题调色板的对比度
 * @param palette 调色板对象 (key: 颜色名称, value: 颜色值)
 * @param config Matrix 配置
 * @returns 验证问题列表
 */
export function validatePaletteContrast(
  palette: Record<string, string>,
  config: MatrixConfig
): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  // 常见的前景-背景组合
  const commonPairs = [
    { fg: 'text-primary', bg: 'surface-primary', type: 'normal' as TextType },
    { fg: 'text-secondary', bg: 'surface-primary', type: 'normal' as TextType },
    { fg: 'text-on-primary', bg: 'color-primary', type: 'normal' as TextType },
    { fg: 'text-on-secondary', bg: 'color-secondary', type: 'normal' as TextType },
  ]

  for (const pair of commonPairs) {
    const fg = palette[pair.fg]
    const bg = palette[pair.bg]

    if (!fg || !bg) continue

    const result = validateContrast(fg, bg, pair.type, config)

    if (!result.passed) {
      issues.push({
        type: 'palette-contrast',
        severity: 'error',
        message: `调色板颜色对 ${pair.fg}/${pair.bg} 对比度不足`,
        actual: result.ratio,
        expected: result.requiredRatio,
        suggestion: `调整 ${pair.fg} 或 ${pair.bg} 的颜色值`,
      })
    }
  }

  return issues
}
