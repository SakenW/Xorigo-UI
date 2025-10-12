/**
 * Matrix 文本可读性检查器
 * 验证字体大小、行高、字距等可读性指标
 */

import type { MatrixConfig, ValidationIssue, SeverityLevel } from './config'

/**
 * 文本样式接口
 */
export interface TextStyle {
  /** 字体大小 (px) */
  fontSize: number
  /** 行高 (可以是数字倍数或带单位的字符串) */
  lineHeight?: number | string
  /** 字母间距 (em) */
  letterSpacing?: number | string
  /** 行长度 (字符数) */
  lineLength?: number
  /** 字体粗细 */
  fontWeight?: number | string
}

/**
 * 解析行高为数字倍数
 * @param lineHeight 行高值
 * @param fontSize 字体大小
 * @returns 行高倍数
 */
function parseLineHeight(
  lineHeight: number | string | undefined,
  fontSize: number
): number | undefined {
  if (lineHeight === undefined) return undefined

  if (typeof lineHeight === 'number') {
    // 如果是纯数字，直接返回（认为是倍数）
    return lineHeight
  }

  // 解析字符串
  const match = lineHeight.match(/^(\d+(?:\.\d+)?)(px|em|rem|%)?$/)
  if (!match) return undefined

  const value = parseFloat(match[1])
  const unit = match[2]

  if (!unit || unit === 'em' || unit === 'rem') {
    return value
  }

  if (unit === 'px') {
    return value / fontSize
  }

  if (unit === '%') {
    return value / 100
  }

  return undefined
}

/**
 * 解析字母间距为 em 单位
 * @param letterSpacing 字母间距值
 * @returns 字母间距 (em)
 */
function parseLetterSpacing(
  letterSpacing: number | string | undefined
): number | undefined {
  if (letterSpacing === undefined) return undefined

  if (typeof letterSpacing === 'number') {
    return letterSpacing
  }

  const match = letterSpacing.match(/^(-?\d+(?:\.\d+)?)(px|em|rem)?$/)
  if (!match) return undefined

  const value = parseFloat(match[1])
  const unit = match[2]

  // 假设没有单位或 em/rem 单位直接返回
  if (!unit || unit === 'em' || unit === 'rem') {
    return value
  }

  // px 单位暂时无法准确转换，返回近似值
  if (unit === 'px') {
    return value / 16 // 假设基准字体为 16px
  }

  return undefined
}

/**
 * 验证字体大小
 * @param style 文本样式
 * @param config Matrix 配置
 * @returns 验证问题列表
 */
export function validateFontSize(
  style: TextStyle,
  config: MatrixConfig
): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const { fontSize } = style
  const { minFontSize, recommendedMinFontSize } = config.readability

  if (fontSize < minFontSize) {
    issues.push({
      type: 'font-size',
      severity: 'error',
      message: `字体大小过小 (${fontSize}px)`,
      actual: fontSize,
      expected: minFontSize,
      suggestion: `增加字体大小至至少 ${minFontSize}px`,
    })
  } else if (fontSize < recommendedMinFontSize) {
    issues.push({
      type: 'font-size',
      severity: 'warning',
      message: `字体大小低于推荐值 (${fontSize}px)`,
      actual: fontSize,
      expected: recommendedMinFontSize,
      suggestion: `建议字体大小至少 ${recommendedMinFontSize}px`,
    })
  }

  return issues
}

/**
 * 验证行高
 * @param style 文本样式
 * @param config Matrix 配置
 * @returns 验证问题列表
 */
export function validateLineHeight(
  style: TextStyle,
  config: MatrixConfig
): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const { lineHeight, fontSize } = style
  const { minLineHeight, recommendedLineHeight } = config.readability

  if (!lineHeight) {
    issues.push({
      type: 'line-height',
      severity: 'warning',
      message: '未设置行高',
      suggestion: `建议设置行高至少 ${recommendedLineHeight}`,
    })
    return issues
  }

  const lineHeightRatio = parseLineHeight(lineHeight, fontSize)

  if (lineHeightRatio === undefined) {
    issues.push({
      type: 'line-height',
      severity: 'info',
      message: '无法解析行高值',
      actual: lineHeight.toString(),
    })
    return issues
  }

  if (lineHeightRatio < minLineHeight) {
    issues.push({
      type: 'line-height',
      severity: 'error',
      message: `行高过小 (${lineHeightRatio.toFixed(2)})`,
      actual: lineHeightRatio,
      expected: minLineHeight,
      suggestion: `增加行高至至少 ${minLineHeight}`,
    })
  } else if (lineHeightRatio < recommendedLineHeight) {
    issues.push({
      type: 'line-height',
      severity: 'warning',
      message: `行高低于推荐值 (${lineHeightRatio.toFixed(2)})`,
      actual: lineHeightRatio,
      expected: recommendedLineHeight,
      suggestion: `建议行高至少 ${recommendedLineHeight}`,
    })
  }

  return issues
}

/**
 * 验证字母间距
 * @param style 文本样式
 * @param config Matrix 配置
 * @returns 验证问题列表
 */
export function validateLetterSpacing(
  style: TextStyle,
  config: MatrixConfig
): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const { letterSpacing } = style
  const { minLetterSpacing } = config.readability

  if (!letterSpacing) {
    return issues // 字母间距不是必需的
  }

  const spacing = parseLetterSpacing(letterSpacing)

  if (spacing === undefined) {
    issues.push({
      type: 'letter-spacing',
      severity: 'info',
      message: '无法解析字母间距值',
      actual: letterSpacing.toString(),
    })
    return issues
  }

  if (spacing < minLetterSpacing) {
    issues.push({
      type: 'letter-spacing',
      severity: 'warning',
      message: `字母间距过小 (${spacing.toFixed(3)}em)`,
      actual: spacing,
      expected: minLetterSpacing,
      suggestion: `建议字母间距至少 ${minLetterSpacing}em`,
    })
  }

  return issues
}

/**
 * 验证行长度
 * @param style 文本样式
 * @param config Matrix 配置
 * @returns 验证问题列表
 */
export function validateLineLength(
  style: TextStyle,
  config: MatrixConfig
): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const { lineLength } = style
  const { maxLineLength } = config.readability

  if (!lineLength) {
    return issues // 行长度不是必需的
  }

  if (lineLength > maxLineLength) {
    issues.push({
      type: 'line-length',
      severity: 'warning',
      message: `行长度过长 (${lineLength} 字符)`,
      actual: lineLength,
      expected: maxLineLength,
      suggestion: `建议行长度不超过 ${maxLineLength} 字符`,
    })
  }

  return issues
}

/**
 * 综合验证文本可读性
 * @param style 文本样式
 * @param config Matrix 配置
 * @returns 验证问题列表
 */
export function validateReadability(
  style: TextStyle,
  config: MatrixConfig
): ValidationIssue[] {
  return [
    ...validateFontSize(style, config),
    ...validateLineHeight(style, config),
    ...validateLetterSpacing(style, config),
    ...validateLineLength(style, config),
  ]
}

/**
 * 批量验证文本可读性
 * @param styles 文本样式数组
 * @param config Matrix 配置
 * @returns 验证问题列表
 */
export function validateReadabilityBatch(
  styles: Array<{ label: string; style: TextStyle }>,
  config: MatrixConfig
): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  for (const { label, style } of styles) {
    const styleIssues = validateReadability(style, config)

    // 为每个问题添加标签前缀
    for (const issue of styleIssues) {
      issues.push({
        ...issue,
        message: `${label}: ${issue.message}`,
      })
    }
  }

  return issues
}
