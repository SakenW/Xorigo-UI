/**
 * Xorigo UI 主题转换工具
 *
 * 用于将组件中的硬编码颜色转换为主题令牌
 * 提供自动化的主题兼容性修复功能
 */

import { readFileSync, writeFileSync } from 'fs'
import { processThemeClasses, getMappingStats } from './theme-token-mapping'

// =============================================================================
// 转换配置
// =============================================================================

export interface ConversionConfig {
  /** 文件路径 */
  filePath: string
  /** 是否创建备份 */
  createBackup?: boolean
  /** 是否详细日志 */
  verbose?: boolean
  /** 自定义替换规则 */
  customRules?: Record<string, string>
  /** 忽略的文件模式 */
  ignorePatterns?: string[]
}

export interface ConversionResult {
  /** 文件路径 */
  filePath: string
  /** 是否成功 */
  success: boolean
  /** 转换前的内容 */
  originalContent: string
  /** 转换后的内容 */
  convertedContent: string
  /** 映射统计 */
  stats: {
    total: number
    themeRelated: number
    mapped: number
    unmapped: number
    mappingRate: number
    unmappedClasses: string[]
  }
  /** 错误信息 */
  error?: string
}

// =============================================================================
// 核心转换函数
// =============================================================================

/**
 * 转换单个文件中的硬编码颜色为主题令牌
 */
export function convertFileToThemeTokens(config: ConversionConfig): ConversionResult {
  const {
    filePath,
    createBackup = true,
    verbose = false,
    customRules = {},
    ignorePatterns = []
  } = config

  try {
    // 检查是否应该忽略此文件
    if (shouldIgnoreFile(filePath, ignorePatterns)) {
      return {
        filePath,
        success: true,
        originalContent: '',
        convertedContent: '',
        stats: {
          total: 0,
          themeRelated: 0,
          mapped: 0,
          unmapped: 0,
          mappingRate: 0,
          unmappedClasses: []
        }
      }
    }

    // 读取文件内容
    const originalContent = readFileSync(filePath, 'utf-8')

    // 创建备份
    if (createBackup) {
      writeFileSync(`${filePath}.backup`, originalContent, 'utf-8')
      if (verbose) {
        console.log(`📁 已创建备份文件: ${filePath}.backup`)
      }
    }

    // 转换内容
    let convertedContent = originalContent

    // 处理 className 属性
    convertedContent = convertClassNameAttributes(convertedContent, customRules)

    // 处理 CSS-in-JS 对象
    convertedContent = convertCSSObjects(convertedContent, customRules)

    // 处理内联样式
    convertedContent = convertInlineStyles(convertedContent, customRules)

    // 计算统计信息
    const originalClasses = extractAllClasses(originalContent)
    const convertedClasses = extractAllClasses(convertedContent)
    const stats = getMappingStats(originalClasses)

    // 写入转换后的内容
    if (convertedContent !== originalContent) {
      writeFileSync(filePath, convertedContent, 'utf-8')
      if (verbose) {
        console.log(`✅ 已转换文件: ${filePath}`)
        console.log(`📊 映射统计: ${stats.mapped}/${stats.themeRelated} 类已转换 (${stats.mappingRate.toFixed(1)}%)`)
      }
    } else {
      if (verbose) {
        console.log(`ℹ️  无需转换: ${filePath}`)
      }
    }

    return {
      filePath,
      success: true,
      originalContent,
      convertedContent,
      stats
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)

    if (verbose) {
      console.error(`❌ 转换失败: ${filePath} - ${errorMessage}`)
    }

    return {
      filePath,
      success: false,
      originalContent: '',
      convertedContent: '',
      stats: {
        total: 0,
        themeRelated: 0,
        mapped: 0,
        unmapped: 0,
        mappingRate: 0,
        unmappedClasses: []
      },
      error: errorMessage
    }
  }
}

/**
 * 批量转换多个文件
 */
export function convertFilesToThemeTokens(
  filePaths: string[],
  globalConfig: Partial<ConversionConfig> = {}
): ConversionResult[] {
  const results: ConversionResult[] = []

  for (const filePath of filePaths) {
    const config: ConversionConfig = {
      filePath,
      createBackup: true,
      verbose: false,
      customRules: {},
      ignorePatterns: [],
      ...globalConfig
    }

    const result = convertFileToThemeTokens(config)
    results.push(result)
  }

  return results
}

// =============================================================================
// 转换辅助函数
// =============================================================================

/**
 * 转换 className 属性
 */
function convertClassNameAttributes(content: string, customRules: Record<string, string>): string {
  // 匹配 className="..." 或 className='...' 模式
  const classNameRegex = /className\s*=\s*["']([^"']+)["']/g

  return content.replace(classNameRegex, (match, classString) => {
    // 处理模板字符串中的动态类名
    const processedClasses = processTemplateString(classString, customRules)
    return `className="${processedClasses}"`
  })
}

/**
 * 转换 CSS-in-JS 对象
 */
function convertCSSObjects(content: string, customRules: Record<string, string>): string {
  // 匹配 CSS 对象中的 backgroundColor, color, borderColor 等
  const cssPropertyRegex = /(backgroundColor|color|borderColor|borderTopColor|borderBottomColor|borderLeftColor|borderRightColor|outlineColor|textColor):\s*['"]([^'"]+)['"]/g

  return content.replace(cssPropertyRegex, (match, property, colorValue) => {
    const mappedColor = mapCSSColor(colorValue, customRules)
    return `${property}: '${mappedColor}'`
  })
}

/**
 * 转换内联样式
 */
function convertInlineStyles(content: string, customRules: Record<string, string>): string {
  // 匹配 style="..." 属性
  const styleRegex = /style\s*=\s*["']([^"']+)["']/g

  return content.replace(styleRegex, (match, styleString) => {
    const processedStyles = processCSSInlineStyles(styleString, customRules)
    return `style="${processedStyles}"`
  })
}

/**
 * 处理模板字符串中的类名
 */
function processTemplateString(classString: string, customRules: Record<string, string>): string {
  // 处理模板字符串 ${condition ? 'class1' : 'class2'}
  const templateRegex = /\$\{[^}]*\}/g

  return classString.replace(templateRegex, (templateMatch) => {
    // 提取模板字符串中的类名
    const classMatches = templateMatch.match(/['"]([^'"]+)['"]/g)
    if (!classMatches) return templateMatch

    let processedTemplate = templateMatch
    for (const classMatch of classMatches) {
      const className = classMatch.slice(1, -1) // 移除引号
      const processedClassName = processThemeClasses(className)
      processedTemplate = processedTemplate.replace(classMatch, `'${processedClassName}'`)
    }

    return processedTemplate
  })
}

/**
 * 映射 CSS 颜色值
 */
function mapCSSColor(colorValue: string, customRules: Record<string, string>): string {
  // 检查自定义规则
  if (customRules[colorValue]) {
    return customRules[colorValue]
  }

  // 映射常见的颜色值
  const cssColorMap: Record<string, string> = {
    '#3b82f6': 'var(--color-primary-500)',
    '#2563eb': 'var(--color-primary-600)',
    '#1d4ed8': 'var(--color-primary-700)',
    '#1e40af': 'var(--color-primary-800)',
    '#1e3a8a': 'var(--color-primary-900)',

    '#10b981': 'var(--color-success-500)',
    '#059669': 'var(--color-success-600)',
    '#047857': 'var(--color-success-700)',
    '#065f46': 'var(--color-success-800)',

    '#ef4444': 'var(--color-error-500)',
    '#dc2626': 'var(--color-error-600)',
    '#b91c1c': 'var(--color-error-700)',
    '#991b1b': 'var(--color-error-800)',

    '#f59e0b': 'var(--color-warning-500)',
    '#d97706': 'var(--color-warning-600)',
    '#b45309': 'var(--color-warning-700)',
    '#92400e': 'var(--color-warning-800)',

    '#6b7280': 'var(--color-text-secondary)',
    '#4b5563': 'var(--color-text-secondary)',
    '#374151': 'var(--color-text-primary)',
    '#1f2937': 'var(--color-text-primary)',
    '#111827': 'var(--color-text-primary)',

    '#f9fafb': 'var(--color-background-primary)',
    '#f3f4f6': 'var(--color-background-secondary)',
    '#e5e7eb': 'var(--color-border-base)',
    '#d1d5db': 'var(--color-border-base)',

    '#ffffff': 'var(--color-background-primary)',
    '#000000': 'var(--color-text-inverse)',
  }

  return cssColorMap[colorValue.toLowerCase()] || colorValue
}

/**
 * 处理 CSS 内联样式
 */
function processCSSInlineStyles(styleString: string, customRules: Record<string, string>): string {
  const cssDeclarations = styleString.split(';').filter(Boolean)
  const processedDeclarations = cssDeclarations.map(declaration => {
    const [property, value] = declaration.split(':').map(s => s.trim())
    if (!property || !value) return declaration

    if (property.includes('color') || property.includes('background')) {
      const mappedValue = mapCSSColor(value.replace(/['"]/g, ''), customRules)
      return `${property}: '${mappedValue}'`
    }

    return declaration
  })

  return processedDeclarations.join('; ')
}

/**
 * 提取文件中的所有类名
 */
function extractAllClasses(content: string): string[] {
  const classes: string[] = []

  // 提取 className 属性中的类名
  const classNameMatches = content.match(/className\s*=\s*["']([^"']+)["']/g)
  if (classNameMatches) {
    classNameMatches.forEach(match => {
      const classString = match.match(/["']([^"']+)["']/)?.[1]
      if (classString) {
        classes.push(...classString.split(/\s+/))
      }
    })
  }

  // 提取 cva 调用中的类名
  const cvaMatches = content.match(/cva\s*\([^)]*["']([^"']+)["']/g)
  if (cvaMatches) {
    cvaMatches.forEach(match => {
      const classString = match.match(/["']([^"']+)["']/)?.[1]
      if (classString) {
        classes.push(...classString.split(/\s+/))
      }
    })
  }

  return classes.filter(Boolean)
}

/**
 * 检查文件是否应该被忽略
 */
function shouldIgnoreFile(filePath: string, ignorePatterns: string[]): boolean {
  return ignorePatterns.some(pattern => {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'))
    return regex.test(filePath)
  })
}

// =============================================================================
// 报告生成函数
// =============================================================================

/**
 * 生成转换报告
 */
export function generateConversionReport(results: ConversionResult[]): {
  summary: {
    totalFiles: number
    successfulFiles: number
    failedFiles: number
    totalClasses: number
    totalMapped: number
    averageMappingRate: number
  }
  details: ConversionResult[]
  failures: ConversionResult[]
} {
  const successfulResults = results.filter(r => r.success)
  const failedResults = results.filter(r => !r.success)

  const totalClasses = successfulResults.reduce((sum, r) => sum + r.stats.total, 0)
  const totalMapped = successfulResults.reduce((sum, r) => sum + r.stats.mapped, 0)
  const averageMappingRate = successfulResults.length > 0
    ? successfulResults.reduce((sum, r) => sum + r.stats.mappingRate, 0) / successfulResults.length
    : 0

  return {
    summary: {
      totalFiles: results.length,
      successfulFiles: successfulResults.length,
      failedFiles: failedResults.length,
      totalClasses,
      totalMapped,
      averageMappingRate
    },
    details: results,
    failures: failedResults
  }
}

// =============================================================================
// 类型定义
// =============================================================================

export interface ConversionSummary {
  totalFiles: number
  successfulFiles: number
  failedFiles: number
  totalClasses: number
  totalMapped: number
  averageMappingRate: number
}

// =============================================================================
// 导出
// =============================================================================

export default {
  convertFileToThemeTokens,
  convertFilesToThemeTokens,
  generateConversionReport,
  processThemeClasses,
  getMappingStats
}