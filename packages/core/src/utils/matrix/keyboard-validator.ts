// @ts-nocheck
/**
 * Matrix 键盘导航验证器
 * 验证元素的键盘可访问性
 */

import type { MatrixConfig, ValidationIssue } from './config'

/**
 * 元素 ARIA 属性接口
 */
export interface AriaAttributes {
  /** 元素角色 */
  role?: string
  /** aria-label */
  ariaLabel?: string
  /** aria-labelledby */
  ariaLabelledby?: string
  /** aria-describedby */
  ariaDescribedby?: string
  /** aria-hidden */
  ariaHidden?: boolean
  /** tabIndex */
  tabIndex?: number
}

/**
 * 交互元素类型
 */
export type InteractiveElement =
  | 'button'
  | 'link'
  | 'input'
  | 'select'
  | 'textarea'
  | 'checkbox'
  | 'radio'
  | 'switch'
  | 'custom'

/**
 * 元素可访问性接口
 */
export interface ElementAccessibility {
  /** 元素类型 */
  type: InteractiveElement
  /** ARIA 属性 */
  aria: AriaAttributes
  /** 是否有文本内容 */
  hasTextContent?: boolean
  /** 是否有图标 */
  hasIcon?: boolean
}

/**
 * 推荐的 ARIA 角色映射
 */
const RECOMMENDED_ROLES: Record<InteractiveElement, string[]> = {
  button: ['button'],
  link: ['link'],
  input: ['textbox', 'searchbox', 'spinbutton'],
  select: ['combobox', 'listbox'],
  textarea: ['textbox'],
  checkbox: ['checkbox'],
  radio: ['radio'],
  switch: ['switch'],
  custom: [], // 自定义元素需要显式指定角色
}

/**
 * 验证 tabIndex 设置
 * @param element 元素可访问性信息
 * @param config Matrix 配置
 * @returns 验证问题列表
 */
export function validateTabIndex(
  element: ElementAccessibility,
  config: MatrixConfig
): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const { tabIndex } = element.aria

  // 交互元素应该是可聚焦的
  if (tabIndex === undefined) {
    // 原生交互元素默认可聚焦，无需 tabIndex
    if (element.type === 'custom') {
      issues.push({
        type: 'tabindex',
        severity: 'error',
        message: '自定义交互元素缺少 tabIndex 属性',
        suggestion: '添加 tabIndex={0} 使元素可通过键盘聚焦',
      })
    }
  } else if (tabIndex < -1) {
    issues.push({
      type: 'tabindex',
      severity: 'error',
      message: `tabIndex 值不合法 (${tabIndex})`,
      actual: tabIndex,
      suggestion: 'tabIndex 应为 -1、0 或正整数',
    })
  } else if (tabIndex > 0) {
    issues.push({
      type: 'tabindex',
      severity: 'warning',
      message: `使用正数 tabIndex (${tabIndex}) 可能破坏键盘导航顺序`,
      actual: tabIndex,
      suggestion: '建议使用 tabIndex={0} 或依赖 DOM 顺序',
    })
  }

  return issues
}

/**
 * 验证 ARIA 角色
 * @param element 元素可访问性信息
 * @param config Matrix 配置
 * @returns 验证问题列表
 */
export function validateRole(
  element: ElementAccessibility,
  config: MatrixConfig
): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const { role } = element.aria
  const { type } = element

  // 自定义元素必须有 role
  if (type === 'custom' && !role) {
    issues.push({
      type: 'role',
      severity: 'error',
      message: '自定义交互元素缺少 role 属性',
      suggestion: `为元素添加适当的 role 属性 (如 button、link 等)`,
    })
    return issues
  }

  // 检查角色是否合适
  const recommendedRoles = RECOMMENDED_ROLES[type]
  if (role && recommendedRoles.length > 0 && !recommendedRoles.includes(role)) {
    issues.push({
      type: 'role',
      severity: 'warning',
      message: `元素角色 "${role}" 可能不适合 ${type} 类型`,
      actual: role,
      expected: recommendedRoles.join(' 或 '),
      suggestion: `建议使用 ${recommendedRoles.join(' 或 ')} 角色`,
    })
  }

  return issues
}

/**
 * 验证可访问标签
 * @param element 元素可访问性信息
 * @param config Matrix 配置
 * @returns 验证问题列表
 */
export function validateAccessibleLabel(
  element: ElementAccessibility,
  config: MatrixConfig
): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const { ariaLabel, ariaLabelledby } = element.aria
  const { hasTextContent, hasIcon } = element

  // 如果有文本内容，通常不需要额外标签
  if (hasTextContent) {
    return issues
  }

  // 如果只有图标，必须有可访问标签
  if (hasIcon && !ariaLabel && !ariaLabelledby) {
    issues.push({
      type: 'accessible-label',
      severity: 'error',
      message: '图标按钮缺少可访问标签',
      suggestion: '添加 aria-label 或 aria-labelledby 属性',
    })
  }

  // 交互元素应该有标签
  if (!hasTextContent && !hasIcon && !ariaLabel && !ariaLabelledby) {
    issues.push({
      type: 'accessible-label',
      severity: 'error',
      message: '交互元素缺少可访问标签',
      suggestion: '添加文本内容、aria-label 或 aria-labelledby 属性',
    })
  }

  return issues
}

/**
 * 验证 aria-hidden
 * @param element 元素可访问性信息
 * @param config Matrix 配置
 * @returns 验证问题列表
 */
export function validateAriaHidden(
  element: ElementAccessibility,
  config: MatrixConfig
): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const { ariaHidden, tabIndex } = element.aria

  // aria-hidden 和可聚焦元素不应同时存在
  if (ariaHidden && (tabIndex === undefined || tabIndex >= 0)) {
    issues.push({
      type: 'aria-hidden',
      severity: 'error',
      message: '可聚焦元素不应使用 aria-hidden="true"',
      suggestion: '移除 aria-hidden 或将 tabIndex 设为 -1',
    })
  }

  return issues
}

/**
 * 综合验证键盘导航
 * @param element 元素可访问性信息
 * @param config Matrix 配置
 * @returns 验证问题列表
 */
export function validateKeyboardAccessibility(
  element: ElementAccessibility,
  config: MatrixConfig
): ValidationIssue[] {
  return [
    ...validateTabIndex(element, config),
    ...validateRole(element, config),
    ...validateAccessibleLabel(element, config),
    ...validateAriaHidden(element, config),
  ]
}

/**
 * 批量验证键盘导航
 * @param elements 元素数组
 * @param config Matrix 配置
 * @returns 验证问题列表
 */
export function validateKeyboardAccessibilityBatch(
  elements: Array<{ label: string; element: ElementAccessibility }>,
  config: MatrixConfig
): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  for (const { label, element } of elements) {
    const elementIssues = validateKeyboardAccessibility(element, config)

    // 为每个问题添加标签前缀
    for (const issue of elementIssues) {
      issues.push({
        ...issue,
        message: `${label}: ${issue.message}`,
      })
    }
  }

  return issues
}
