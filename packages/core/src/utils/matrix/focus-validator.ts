// @ts-nocheck
/**
 * Matrix 焦点状态验证器
 * 验证焦点指示器的可见性和可访问性
 */

import type { MatrixConfig, ValidationIssue } from './config'
import { validateContrast, type TextType } from './contrast-validator'

/**
 * 焦点样式接口
 */
export interface FocusStyle {
  /** 焦点指示器颜色 */
  outlineColor: string
  /** 焦点指示器宽度 (px) */
  outlineWidth: number
  /** 焦点指示器偏移 (px) */
  outlineOffset?: number
  /** 焦点指示器样式 (solid, dashed, dotted) */
  outlineStyle?: string
  /** 背景色 (用于计算对比度) */
  backgroundColor: string
}

/**
 * 验证焦点指示器厚度
 * @param focusStyle 焦点样式
 * @param config Matrix 配置
 * @returns 验证问题列表
 */
export function validateFocusThickness(
  focusStyle: FocusStyle,
  config: MatrixConfig
): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const { outlineWidth } = focusStyle
  const { minThickness } = config.focus

  if (outlineWidth < minThickness) {
    issues.push({
      type: 'focus-thickness',
      severity: 'error',
      message: `焦点指示器厚度不足 (${outlineWidth}px)`,
      actual: outlineWidth,
      expected: minThickness,
      suggestion: `增加焦点指示器厚度至至少 ${minThickness}px`,
    })
  }

  return issues
}

/**
 * 验证焦点指示器偏移
 * @param focusStyle 焦点样式
 * @param config Matrix 配置
 * @returns 验证问题列表
 */
export function validateFocusOffset(
  focusStyle: FocusStyle,
  config: MatrixConfig
): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const { outlineOffset = 0 } = focusStyle
  const { minOffset } = config.focus

  if (outlineOffset < minOffset) {
    issues.push({
      type: 'focus-offset',
      severity: 'warning',
      message: `焦点指示器偏移过小 (${outlineOffset}px)`,
      actual: outlineOffset,
      expected: minOffset,
      suggestion: `建议焦点指示器偏移至少 ${minOffset}px`,
    })
  }

  return issues
}

/**
 * 验证焦点指示器对比度
 * @param focusStyle 焦点样式
 * @param config Matrix 配置
 * @returns 验证问题列表
 */
export function validateFocusContrast(
  focusStyle: FocusStyle,
  config: MatrixConfig
): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const { outlineColor, backgroundColor } = focusStyle
  const { minContrast } = config.focus

  // 使用 UI 组件对比度标准
  const result = validateContrast(
    outlineColor,
    backgroundColor,
    'ui-component',
    config
  )

  if (!result.passed || result.ratio < minContrast) {
    issues.push({
      type: 'focus-contrast',
      severity: 'error',
      message: `焦点指示器对比度不足 (${result.ratio.toFixed(2)}:1)`,
      actual: result.ratio,
      expected: minContrast,
      suggestion: `增加焦点指示器与背景的对比度至至少 ${minContrast}:1`,
    })
  }

  return issues
}

/**
 * 验证焦点指示器样式
 * @param focusStyle 焦点样式
 * @param config Matrix 配置
 * @returns 验证问题列表
 */
export function validateFocusStyle(
  focusStyle: FocusStyle,
  config: MatrixConfig
): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const { outlineStyle = 'solid' } = focusStyle

  // 验证焦点指示器样式是否为可接受的值
  const acceptableStyles = ['solid', 'dashed', 'dotted', 'double']

  if (!acceptableStyles.includes(outlineStyle)) {
    issues.push({
      type: 'focus-style',
      severity: 'warning',
      message: `焦点指示器样式可能不够明显 (${outlineStyle})`,
      actual: outlineStyle,
      suggestion: `建议使用 solid、dashed 或 dotted 样式`,
    })
  }

  return issues
}

/**
 * 综合验证焦点状态
 * @param focusStyle 焦点样式
 * @param config Matrix 配置
 * @returns 验证问题列表
 */
export function validateFocus(
  focusStyle: FocusStyle,
  config: MatrixConfig
): ValidationIssue[] {
  return [
    ...validateFocusThickness(focusStyle, config),
    ...validateFocusOffset(focusStyle, config),
    ...validateFocusContrast(focusStyle, config),
    ...validateFocusStyle(focusStyle, config),
  ]
}

/**
 * 批量验证焦点状态
 * @param focusStyles 焦点样式数组
 * @param config Matrix 配置
 * @returns 验证问题列表
 */
export function validateFocusBatch(
  focusStyles: Array<{ label: string; style: FocusStyle }>,
  config: MatrixConfig
): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  for (const { label, style } of focusStyles) {
    const styleIssues = validateFocus(style, config)

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
