/**
 * 颜色对比度检查工具
 * 验证颜色组合是否符合WCAG标准
 */

import ColorContrastChecker from 'color-contrast-checker'

/**
 * WCAG对比度等级
 */
export type ContrastLevel = 'AA' | 'AAA' | 'AALarge' | 'AAALarge'

/**
 * 对比度检查结果
 */
export interface ContrastResult {
  ratio: number
  passesWCAG: {
    AA: boolean
    AAA: boolean
    AALarge: boolean
    AAALarge: boolean
  }
  level: 'FAIL' | 'AA' | 'AAA'
  recommendations?: string[]
}

/**
 * 检查两个颜色之间的对比度
 * @param foreground 前景色（十六进制）
 * @param background 背景色（十六进制）
 * @param fontSize 字体大小（像素）
 * @param fontWeight 字体粗细
 * @returns 对比度检查结果
 */
export const checkColorContrast = (
  foreground: string,
  background: string,
  fontSize: number = 16,
  fontWeight: number | string = 400
): ContrastResult => {
  const checker = new ColorContrastChecker()
  const ratio = checker.getContrast(foreground, background)

  // 判断是否为大字体
  const isLargeText = fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700)

  const passesWCAG = {
    AA: ratio >= 4.5,
    AAA: ratio >= 7,
    AALarge: isLargeText ? ratio >= 3 : false,
    AAALarge: isLargeText ? ratio >= 4.5 : false
  }

  let level: ContrastResult['level'] = 'FAIL'
  if (passesWCAG.AAA || passesWCAG.AAALarge) {
    level = 'AAA'
  } else if (passesWCAG.AA || passesWCAG.AALarge) {
    level = 'AA'
  }

  const recommendations = generateRecommendations(ratio, isLargeText)

  return {
    ratio: Math.round(ratio * 100) / 100,
    passesWCAG,
    level,
    recommendations
  }
}

/**
 * 生成改进建议
 * @param ratio 当前对比度
 * @param isLargeText 是否为大字体
 * @returns 建议列表
 */
const generateRecommendations = (
  ratio: number,
  isLargeText: boolean
): string[] => {
  const recommendations: string[] = []

  if (ratio < 3) {
    recommendations.push('对比度过低，建议完全重新设计颜色组合')
  } else if (ratio < 4.5) {
    if (isLargeText) {
      recommendations.push('当前对比度仅适合大字体文本')
      recommendations.push('考虑增加字体大小或字体粗细')
    } else {
      recommendations.push('对比度未达到WCAG AA标准')
      recommendations.push('建议增加前景色和背景色的对比度')
    }
  } else if (ratio < 7) {
    recommendations.push('对比度达到WCAG AA标准')
    recommendations.push('如需达到AAA标准，建议进一步提高对比度')
  }

  return recommendations
}

/**
 * 解析CSS颜色值
 * @param color CSS颜色值
 * @returns 标准化的十六进制颜色值
 */
export const parseColor = (color: string): string => {
  // 如果已经是十六进制，直接返回
  if (color.startsWith('#')) {
    return color
  }

  // 创建临时元素来获取计算后的颜色值
  const temp = document.createElement('div')
  temp.style.color = color
  document.body.appendChild(temp)

  const computedColor = window.getComputedStyle(temp).color
  document.body.removeChild(temp)

  // 转换RGB为十六进制
  const rgbMatch = computedColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10)
    const g = parseInt(rgbMatch[2], 10)
    const b = parseInt(rgbMatch[3], 10)
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
  }

  // 如果无法解析，返回黑色作为默认值
  return '#000000'
}

/**
 * 批量检查颜色对比度
 * @param colorPairs 颜色对数组
 * @returns 对比度检查结果数组
 */
export const batchCheckColorContrast = (
  colorPairs: Array<{
    foreground: string
    background: string
    fontSize?: number
    fontWeight?: number | string
    name?: string
  }>
): Array<ContrastResult & { name?: string }> => {
  return colorPairs.map(pair => ({
    name: pair.name,
    ...checkColorContrast(
      pair.foreground,
      pair.background,
      pair.fontSize,
      pair.fontWeight
    )
  }))
}

/**
 * 从CSS变量中提取颜色值
 * @param element DOM元素
 * @param variableName CSS变量名
 * @returns 颜色值
 */
export const getColorFromCSSVariable = (
  element: HTMLElement,
  variableName: string
): string => {
  const computedStyle = window.getComputedStyle(element)
  const colorValue = computedStyle.getPropertyValue(variableName).trim()

  return colorValue ? parseColor(colorValue) : '#000000'
}

/**
 * 检查主题的颜色对比度
 * @param themeElement 主题根元素
 * @param colorTests 要测试的颜色组合
 * @returns 对比度检查结果
 */
export const checkThemeContrast = (
  themeElement: HTMLElement,
  colorTests: Array<{
    name: string
    foregroundVar: string
    backgroundVar: string
    fontSize?: number
    fontWeight?: number | string
  }>
): Array<ContrastResult & { name: string }> => {
  return colorTests.map(test => {
    const foreground = getColorFromCSSVariable(themeElement, test.foregroundVar)
    const background = getColorFromCSSVariable(themeElement, test.backgroundVar)

    return {
      name: test.name,
      ...checkColorContrast(foreground, background, test.fontSize, test.fontWeight)
    }
  })
}

/**
 * 生成颜色对比度报告
 * @param results 对比度检查结果
 * @returns 格式化的报告字符串
 */
export const generateContrastReport = (results: Array<ContrastResult & { name?: string }>): string => {
  let report = '# 颜色对比度检查报告\n\n'

  const passCount = results.filter(r => r.level !== 'FAIL').length
  const failCount = results.filter(r => r.level === 'FAIL').length

  report += `总计: ${results.length} 个检查 | 通过: ${passCount} | 失败: ${failCount}\n\n`

  results.forEach((result, index) => {
    const name = result.name || `颜色组合 ${index + 1}`
    const status = result.level === 'FAIL' ? '❌' : result.level === 'AAA' ? '✅' : '⚠️'

    report += `## ${status} ${name}\n`
    report += `- 对比度: ${result.ratio}:1\n`
    report += `- WCAG等级: ${result.level}\n`

    const wcagResults = []
    if (result.passesWCAG.AA) wcagResults.push('AA')
    if (result.passesWCAG.AAA) wcagResults.push('AAA')
    if (result.passesWCAG.AALarge) wcagResults.push('AA (大字体)')
    if (result.passesWCAG.AAALarge) wcagResults.push('AAA (大字体)')

    report += `- 通过标准: ${wcagResults.join(', ') || '无'}\n`

    if (result.recommendations && result.recommendations.length > 0) {
      report += `- 建议:\n`
      result.recommendations.forEach(rec => {
        report += `  - ${rec}\n`
      })
    }

    report += '\n'
  })

  return report
}

/**
 * 获取最佳的颜色组合建议
 * @param baseColor 基础颜色
 * @param isLight 基础颜色是否为浅色
 * @returns 推荐的颜色组合
 */
export const getOptimalColorCombination = (
  baseColor: string,
  isLight: boolean
): {
  foreground: string
  background: string
  ratio: number
  level: ContrastResult['level']
} => {
  // 预定义的高对比度颜色组合
  const lightCombinations = [
    { bg: '#FFFFFF', fg: '#000000' }, // 黑白
    { bg: '#F8F9FA', fg: '#212529' }, // 浅灰配深灰
    { bg: '#F1F3F4', fg: '#3C4043' }, // Google浅灰主题
    { bg: '#FFFFFF', fg: '#1A1A1A' }, // 深灰白底
  ]

  const darkCombinations = [
    { bg: '#000000', fg: '#FFFFFF' }, // 白黑
    { bg: '#1A1A1A', fg: '#FFFFFF' }, // 深灰白字
    { bg: '#121212', fg: '#FFFFFF' }, // Material Design深色
    { bg: '#2D3748', fg: '#F7FAFC' }, // 深蓝灰配浅蓝
  ]

  const combinations = isLight ? lightCombinations : darkCombinations

  let best = combinations[0]
  let bestRatio = 0

  combinations.forEach(combo => {
    const ratio = new ColorContrastChecker().getContrast(combo.fg, combo.bg)
    if (ratio > bestRatio) {
      bestRatio = ratio
      best = combo
    }
  })

  const result = checkColorContrast(best.fg, best.bg)

  return {
    foreground: best.fg,
    background: best.bg,
    ratio: result.ratio,
    level: result.level
  }
}