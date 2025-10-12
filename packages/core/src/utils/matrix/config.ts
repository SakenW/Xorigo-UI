/**
 * Matrix 可访问性验证系统 - 配置文件
 * 基于 WCAG 2.1 标准和 TH-UI 设计系统需求
 */

/**
 * WCAG 对比度标准
 */
export interface WCAGContrastStandards {
  /** WCAG AA 标准 - 正常文本 (< 18pt 或 < 14pt 加粗) */
  normalTextAA: number
  /** WCAG AA 标准 - 大文本 (≥ 18pt 或 ≥ 14pt 加粗) */
  largeTextAA: number
  /** WCAG AAA 标准 - 正常文本 */
  normalTextAAA: number
  /** WCAG AAA 标准 - 大文本 */
  largeTextAAA: number
  /** UI 组件对比度 (边框、图标等) */
  uiComponentAA: number
}

/**
 * 文本可读性标准
 */
export interface ReadabilityStandards {
  /** 最小字体大小 (px) */
  minFontSize: number
  /** 推荐最小字体大小 (px) */
  recommendedMinFontSize: number
  /** 最小行高倍数 */
  minLineHeight: number
  /** 推荐行高倍数 */
  recommendedLineHeight: number
  /** 最小字母间距 (em) */
  minLetterSpacing: number
  /** 最大行长度 (字符) */
  maxLineLength: number
}

/**
 * 焦点状态标准
 */
export interface FocusStandards {
  /** 焦点指示器最小对比度 */
  minContrast: number
  /** 焦点指示器最小厚度 (px) */
  minThickness: number
  /** 焦点指示器与元素的最小距离 (px) */
  minOffset: number
}

/**
 * 色盲模拟类型
 */
export type CVDType = 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'

/**
 * 验证规则严格级别
 */
export type StrictnessLevel = 'AA' | 'AAA'

/**
 * Matrix 配置接口
 */
export interface MatrixConfig {
  /** 对比度标准 */
  contrast: WCAGContrastStandards
  /** 文本可读性标准 */
  readability: ReadabilityStandards
  /** 焦点状态标准 */
  focus: FocusStandards
  /** 验证严格级别 */
  strictness: StrictnessLevel
  /** 是否启用色盲模拟验证 */
  enableCVDSimulation: boolean
  /** 需要验证的色盲类型 */
  cvdTypes: CVDType[]
}

/**
 * 默认 Matrix 配置 (WCAG AA 标准)
 */
export const DEFAULT_MATRIX_CONFIG: MatrixConfig = {
  contrast: {
    normalTextAA: 4.5,
    largeTextAA: 3.0,
    normalTextAAA: 7.0,
    largeTextAAA: 4.5,
    uiComponentAA: 3.0,
  },
  readability: {
    minFontSize: 12,
    recommendedMinFontSize: 14,
    minLineHeight: 1.2,
    recommendedLineHeight: 1.5,
    minLetterSpacing: -0.05,
    maxLineLength: 80,
  },
  focus: {
    minContrast: 3.0,
    minThickness: 2,
    minOffset: 1,
  },
  strictness: 'AA',
  enableCVDSimulation: true,
  cvdTypes: ['protanopia', 'deuteranopia', 'tritanopia'],
}

/**
 * AAA 严格配置
 */
export const STRICT_MATRIX_CONFIG: MatrixConfig = {
  ...DEFAULT_MATRIX_CONFIG,
  strictness: 'AAA',
}

/**
 * 验证结果严重级别
 */
export type SeverityLevel = 'error' | 'warning' | 'info'

/**
 * 验证问题接口
 */
export interface ValidationIssue {
  /** 问题类型 */
  type: string
  /** 严重级别 */
  severity: SeverityLevel
  /** 问题描述 */
  message: string
  /** 实际值 */
  actual?: number | string
  /** 期望值 */
  expected?: number | string
  /** 改进建议 */
  suggestion?: string
}

/**
 * 验证结果接口
 */
export interface ValidationResult {
  /** 是否通过验证 */
  passed: boolean
  /** 验证的配方名称 */
  recipeName?: string
  /** 发现的问题列表 */
  issues: ValidationIssue[]
  /** 验证时间戳 */
  timestamp: Date
  /** 验证配置 */
  config: MatrixConfig
}
