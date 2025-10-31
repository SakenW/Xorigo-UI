/**
 * Xorigo UI 自动化颜色对比度验证系统
 *
 * 专门针对七轴主题系统的颜色对比度检测
 * 支持所有主题配方和状态组合的全面验证
 *
 * @version 1.0.0
 * @author Xorigo UI Team
 */

import { getContrastRatio, hexToRgb, rgbToHex } from '@xorigo/utils/container-aware-colors'

// ==================== 类型定义 ====================

export interface ColorPair {
  foreground: string
  background: string
  context: string
  element: string
  fontSize: 'normal' | 'large'
  weight: 'normal' | 'bold'
  type: 'text' | 'icon' | 'border' | 'state' | 'background'
  state?: 'default' | 'hover' | 'active' | 'focus' | 'disabled' | 'selected'
  theme: string
}

export interface ContrastValidationResult {
  pair: ColorPair
  ratio: number
  passesWCAG_A: boolean
  passesWCAG_AA: boolean
  passesWCAG_AAA: boolean
  passesEnhanced: boolean
  recommendations: string[]
  severity: 'pass' | 'warning' | 'fail' | 'critical'
  suggestedColors?: {
    foreground?: string
    background?: string
    alternative?: string[]
  }
}

export interface ThemeContrastReport {
  themeName: string
  overallScore: number
  complianceLevel: 'AAA' | 'AA' | 'A' | 'FAIL'
  totalChecks: number
  passedChecks: number
  failedChecks: number
  warnings: number
  results: ContrastValidationResult[]
  criticalIssues: ContrastValidationResult[]
  colorSystemAnalysis: ColorSystemAnalysis
  themeSpecificIssues: ThemeIssue[]
}

export interface ColorSystemAnalysis {
  primaryColors: ColorFamilyAnalysis[]
  semanticColors: ColorFamilyAnalysis[]
  neutralColors: ColorFamilyAnalysis[]
  systemColors: ColorFamilyAnalysis[]
  stateColors: ColorFamilyAnalysis[]
  accessibilityGaps: string[]
  colorNaming: ColorNamingAnalysis
}

export interface ColorFamilyAnalysis {
  familyName: string
  baseColor: string
  variations: ColorVariation[]
  contrastMatrix: ContrastMatrix
  accessibilityScore: number
  recommendations: string[]
  issues: string[]
}

export interface ColorVariation {
  name: string
  value: string
  lightness: number
  saturation: number
  intendedUse: string[]
  contrastWithWhite: number
  contrastWithBlack: number
  passesStandard: boolean
}

export interface ContrastMatrix {
  [colorName: string]: {
    [againstColorName: string]: {
      ratio: number
      passesAA: boolean
      passesAAA: boolean
      usage: string[]
    }
  }
}

export interface ColorNamingAnalysis {
  consistentNaming: boolean
  semanticClarity: number
  nameIssues: string[]
  suggestions: string[]
}

export interface ThemeIssue {
  id: string
  severity: 'critical' | 'serious' | 'moderate' | 'minor'
  category: 'contrast' | 'color' | 'naming' | 'consistency' | 'usability'
  description: string
  affectedColors: string[]
  impact: string
  recommendation: string
  priority: number
}

export interface SevenAxisThemeData {
  mode: 'light' | 'dark' | 'auto'
  hue: number
  saturation: number
  lightness: number
  density: 'compact' | 'comfortable' | 'spacious'
  roundness: 'sharp' | 'rounded' | 'circular'
  contrast: 'normal' | 'high' | 'reduced'
  customColors?: Record<string, string>
}

// ==================== 核心验证类 ====================

export class ColorContrastValidator {
  private readonly WCAG_THRESHOLDS = {
    AA_NORMAL: 4.5,
    AA_LARGE: 3.0,
    AAA_NORMAL: 7.0,
    AAA_LARGE: 4.5,
    UI_COMPONENTS: 3.0,
    GRAPHICAL_OBJECTS: 3.0
  }

  private readonly COLOR_PAIRS: Array<{
    type: ColorPair['type']
    contexts: string[]
    requiredRatio: number
    description: string
  }> = [
    {
      type: 'text',
      contexts: ['body', 'heading', 'label', 'link', 'button-text'],
      requiredRatio: this.WCAG_THRESHOLDS.AA_NORMAL,
      description: '正文文本'
    },
    {
      type: 'text',
      contexts: ['large-heading', 'large-text'],
      requiredRatio: this.WCAG_THRESHOLDS.AA_LARGE,
      description: '大号文本'
    },
    {
      type: 'icon',
      contexts: ['icon-button', 'status-icon', 'navigation-icon'],
      requiredRatio: this.WCAG_THRESHOLDS.UI_COMPONENTS,
      description: '功能性图标'
    },
    {
      type: 'border',
      contexts: ['input-border', 'button-border', 'card-border'],
      requiredRatio: this.WCAG_THRESHOLDS.UI_COMPONENTS,
      description: '交互元素边框'
    },
    {
      type: 'state',
      contexts: ['hover', 'focus', 'active', 'selected'],
      requiredRatio: this.WCAG_THRESHOLDS.UI_COMPONENTS,
      description: '状态指示器'
    },
    {
      type: 'background',
      contexts: ['code-block', 'highlight', 'badge'],
      requiredRatio: this.WCAG_THRESHOLDS.UI_COMPONENTS,
      description: '背景色块'
    }
  ]

  /**
   * 验证单个颜色对比度
   */
  validateContrast(pair: ColorPair): ContrastValidationResult {
    const ratio = getContrastRatio(pair.foreground, pair.background)

    const thresholds = this.getApplicableThresholds(pair)
    const passesWCAG_A = ratio >= this.WCAG_THRESHOLDS.AA_NORMAL
    const passesWCAG_AA = ratio >= thresholds.AA
    const passesWCAG_AAA = ratio >= thresholds.AAA
    const passesEnhanced = this.checkEnhancedContrast(pair, ratio)

    const severity = this.determineSeverity(ratio, thresholds, passesWCAG_AA)
    const recommendations = this.generateContrastRecommendations(pair, ratio, thresholds)
    const suggestedColors = this.generateColorSuggestions(pair, ratio, thresholds)

    return {
      pair,
      ratio,
      passesWCAG_A,
      passesWCAG_AA,
      passesWCAG_AAA,
      passesEnhanced,
      recommendations,
      severity,
      suggestedColors
    }
  }

  /**
   * 验证整个主题的颜色对比度
   */
  async validateThemeContrast(
    themeData: SevenAxisThemeData,
    themeColors: Record<string, string>
  ): Promise<ThemeContrastReport> {
    const colorPairs = this.extractThemeColorPairs(themeData, themeColors)
    const results: ContrastValidationResult[] = []
    let passedChecks = 0
    let warnings = 0

    // 验证每个颜色对
    for (const pair of colorPairs) {
      const result = this.validateContrast(pair)
      results.push(result)

      if (result.severity === 'pass') {
        passedChecks++
      } else if (result.severity === 'warning') {
        warnings++
      }
    }

    const overallScore = this.calculateThemeScore(results)
    const complianceLevel = this.determineComplianceLevel(overallScore)
    const criticalIssues = results.filter(r => r.severity === 'critical')

    // 分析颜色系统
    const colorSystemAnalysis = await this.analyzeColorSystem(themeColors)

    // 识别主题特定问题
    const themeSpecificIssues = this.identifyThemeIssues(results, colorSystemAnalysis, themeData)

    return {
      themeName: this.generateThemeName(themeData),
      overallScore,
      complianceLevel,
      totalChecks: results.length,
      passedChecks,
      failedChecks: results.filter(r => r.severity === 'fail' || r.severity === 'critical').length,
      warnings,
      results,
      criticalIssues,
      colorSystemAnalysis,
      themeSpecificIssues
    }
  }

  /**
   * 批量验证多个主题
   */
  async validateMultipleThemes(
    themes: Array<{
      data: SevenAxisThemeData
      colors: Record<string, string>
      name: string
    }>
  ): Promise<ThemeContrastReport[]> {
    const reports: ThemeContrastReport[] = []

    for (const theme of themes) {
      const report = await this.validateThemeContrast(theme.data, theme.colors)
      reports.push(report)
    }

    return reports.sort((a, b) => b.overallScore - a.overallScore)
  }

  /**
   * 实时颜色对比度检查
   */
  checkRealTimeContrast(
    foreground: string,
    background: string,
    context: string = 'body'
  ): {
    ratio: number
    passes: boolean
    level: 'AAA' | 'AA' | 'A' | 'FAIL'
    suggestion?: string
  } {
    const pair: ColorPair = {
      foreground,
      background,
      context,
      element: 'dynamic',
      fontSize: 'normal',
      weight: 'normal',
      type: this.inferColorType(context),
      theme: 'current'
    }

    const result = this.validateContrast(pair)

    return {
      ratio: result.ratio,
      passes: result.passesWCAG_AA,
      level: this.getComplianceLevel(result),
      suggestion: result.recommendations[0]
    }
  }

  // ==================== 私有方法 ====================

  private getApplicableThresholds(pair: ColorPair): { AA: number; AAA: number } {
    const isLargeText = pair.fontSize === 'large' || pair.weight === 'bold'

    if (pair.type === 'text') {
      return {
        AA: isLargeText ? this.WCAG_THRESHOLDS.AA_LARGE : this.WCAG_THRESHOLDS.AA_NORMAL,
        AAA: isLargeText ? this.WCAG_THRESHOLDS.AAA_LARGE : this.WCAG_THRESHOLDS.AAA_NORMAL
      }
    }

    return {
      AA: this.WCAG_THRESHOLDS.UI_COMPONENTS,
      AAA: this.WCAG_THRESHOLDS.UI_COMPONENTS
    }
  }

  private checkEnhancedContrast(pair: ColorPair, ratio: number): boolean {
    // 检查增强对比度要求（如高对比度模式、色盲友好等）
    if (pair.type === 'text' && pair.fontSize === 'normal') {
      return ratio >= 7 // AAA 标准
    }
    return ratio >= 4.5
  }

  private determineSeverity(
    ratio: number,
    thresholds: { AA: number; AAA: number },
    passesAA: boolean
  ): ContrastValidationResult['severity'] {
    if (ratio < 2) return 'critical'
    if (!passesAA) return 'fail'
    if (ratio < thresholds.AAA) return 'warning'
    return 'pass'
  }

  private generateContrastRecommendations(
    pair: ColorPair,
    ratio: number,
    thresholds: { AA: number; AAA: number }
  ): string[] {
    const recommendations: string[] = []

    if (ratio < 2) {
      recommendations.push('对比度严重不足，需要完全重新设计颜色组合')
    } else if (!this.validateContrast(pair).passesWCAG_AA) {
      const neededIncrease = thresholds.AA - ratio
      recommendations.push(`需要将对比度提高至少 ${neededIncrease.toFixed(1)}:1`)

      if (pair.type === 'text') {
        if (pair.fontSize === 'normal') {
          recommendations.push('考虑使用更大或更粗的字体来降低对比度要求')
        }
        recommendations.push('确保颜色不是唯一的传达信息的方式')
      }
    } else if (ratio < thresholds.AAA) {
      recommendations.push('当前对比度满足AA标准，但建议提升到AAA标准以获得更好的可访问性')
    }

    // 针对不同类型的特定建议
    if (pair.type === 'border') {
      recommendations.push('边框对比度建议至少3:1，确保界面元素的清晰度')
    } else if (pair.type === 'state') {
      recommendations.push('状态指示器需要有明显的视觉差异，避免依赖颜色变化')
    } else if (pair.type === 'icon') {
      recommendations.push('功能性图标需要足够的对比度，确保所有用户都能识别')
    }

    return recommendations
  }

  private generateColorSuggestions(
    pair: ColorPair,
    currentRatio: number,
    thresholds: { AA: number; AAA: number }
  ): ContrastValidationResult['suggestedColors'] {
    const suggestions: ContrastValidationResult['suggestedColors'] = {
      alternative: []
    }

    // 尝试调整前景色
    const adjustedForeground = this.adjustColorForContrast(
      pair.foreground,
      pair.background,
      thresholds.AA
    )

    if (adjustedForeground !== pair.foreground) {
      suggestions.foreground = adjustedForeground
    }

    // 尝试调整背景色
    const adjustedBackground = this.adjustColorForContrast(
      pair.background,
      pair.foreground,
      thresholds.AA
    )

    if (adjustedBackground !== pair.background) {
      suggestions.background = adjustedBackground
    }

    // 生成替代颜色方案
    suggestions.alternative = this.generateAlternativeColorPairs(
      pair.foreground,
      pair.background,
      thresholds.AA
    )

    return suggestions
  }

  private adjustColorForContrast(
    color: string,
    background: string,
    targetRatio: number
  ): string {
    const rgb = hexToRgb(color)
    const bgRgb = hexToRgb(background)

    if (!rgb || !bgRgb) return color

    let adjusted = { ...rgb }
    let attempts = 0
    const maxAttempts = 100

    while (attempts < maxAttempts) {
      const testColor = rgbToHex(adjusted)
      const ratio = getContrastRatio(testColor, background)

      if (ratio >= targetRatio) {
        return testColor
      }

      // 调整亮度
      const bgLuminance = this.calculateLuminance(bgRgb)
      const currentLuminance = this.calculateLuminance(adjusted)

      if (currentLuminance > bgLuminance) {
        // 前景色比背景色亮，需要更亮
        adjusted.r = Math.min(255, adjusted.r + 5)
        adjusted.g = Math.min(255, adjusted.g + 5)
        adjusted.b = Math.min(255, adjusted.b + 5)
      } else {
        // 前景色比背景色暗，需要更暗
        adjusted.r = Math.max(0, adjusted.r - 5)
        adjusted.g = Math.max(0, adjusted.g - 5)
        adjusted.b = Math.max(0, adjusted.b - 5)
      }

      attempts++
    }

    return color
  }

  private calculateLuminance(rgb: { r: number; g: number; b: number }): number {
    const { r, g, b } = rgb
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }

  private generateAlternativeColorPairs(
    foreground: string,
    background: string,
    targetRatio: number
  ): string[] {
    const alternatives: string[] = []

    // 尝试常见的替代颜色
    const commonForegrounds = [
      '#000000', '#1a1a1a', '#333333', '#666666', '#808080',
      '#ffffff', '#f5f5f5', '#e5e5e5', '#d5d5d5'
    ]

    for (const alt of commonForegrounds) {
      if (getContrastRatio(alt, background) >= targetRatio) {
        alternatives.push(alt)
      }
    }

    return alternatives.slice(0, 3) // 返回前3个最佳替代
  }

  private extractThemeColorPairs(
    themeData: SevenAxisThemeData,
    themeColors: Record<string, string>
  ): ColorPair[] {
    const pairs: ColorPair[] = []

    // 从主题颜色中提取所有可能的颜色组合
    const colorKeys = Object.keys(themeColors)

    for (let i = 0; i < colorKeys.length; i++) {
      for (let j = 0; j < colorKeys.length; j++) {
        if (i === j) continue

        const foregroundKey = colorKeys[i]
        const backgroundKey = colorKeys[j]

        // 确定颜色类型和上下文
        const type = this.inferColorTypeFromKey(foregroundKey, backgroundKey)
        const context = this.inferContextFromKeys(foregroundKey, backgroundKey)

        pairs.push({
          foreground: themeColors[foregroundKey],
          background: themeColors[backgroundKey],
          context,
          element: `${foregroundKey}-on-${backgroundKey}`,
          fontSize: context.includes('large') ? 'large' : 'normal',
          weight: context.includes('bold') ? 'bold' : 'normal',
          type,
          theme: this.generateThemeName(themeData)
        })
      }
    }

    return pairs
  }

  private inferColorType(context: string): ColorPair['type'] {
    if (context.includes('text') || context.includes('heading') || context.includes('label')) {
      return 'text'
    }
    if (context.includes('icon') || context.includes('symbol')) {
      return 'icon'
    }
    if (context.includes('border') || context.includes('outline')) {
      return 'border'
    }
    if (context.includes('hover') || context.includes('focus') || context.includes('active')) {
      return 'state'
    }
    return 'background'
  }

  private inferColorTypeFromKey(foreignKey: string, backgroundKey: string): ColorPair['type'] {
    const typeMap: Record<string, ColorPair['type']> = {
      'text': 'text',
      'foreground': 'text',
      'content': 'text',
      'icon': 'icon',
      'border': 'border',
      'outline': 'border',
      'background': 'background',
      'surface': 'background'
    }

    // 检查前景色类型
    for (const [key, type] of Object.entries(typeMap)) {
      if (foreignKey.includes(key)) return type
    }

    return 'text'
  }

  private inferContextFromKeys(foreignKey: string, backgroundKey: string): string {
    const contexts: string[] = []

    // 从键名推断上下文
    if (foreignKey.includes('primary')) contexts.push('primary')
    if (foreignKey.includes('secondary')) contexts.push('secondary')
    if (backgroundKey.includes('surface')) contexts.push('surface')
    if (backgroundKey.includes('background')) contexts.push('background')

    return contexts.join('-') || 'body'
  }

  private calculateThemeScore(results: ContrastValidationResult[]): number {
    if (results.length === 0) return 0

    const weights = {
      pass: 1,
      warning: 0.5,
      fail: 0,
      critical: -1
    }

    const totalScore = results.reduce((sum, result) => {
      return sum + weights[result.severity]
    }, 0)

    return Math.max(0, Math.min(100, (totalScore / results.length) * 100))
  }

  private determineComplianceLevel(score: number): ThemeContrastReport['complianceLevel'] {
    if (score >= 95) return 'AAA'
    if (score >= 85) return 'AA'
    if (score >= 70) return 'A'
    return 'FAIL'
  }

  private generateThemeName(themeData: SevenAxisThemeData): string {
    return `${themeData.mode}-${themeData.hue}-${themeData.saturation}-${themeData.lightness}-${themeData.contrast}`
  }

  private async analyzeColorSystem(
    themeColors: Record<string, string>
  ): Promise<ColorSystemAnalysis> {
    // 分析颜色系统的各个维度
    const primaryColors = this.analyzeColorFamily(themeColors, 'primary')
    const semanticColors = this.analyzeColorFamily(themeColors, 'semantic')
    const neutralColors = this.analyzeColorFamily(themeColors, 'neutral')
    const systemColors = this.analyzeColorFamily(themeColors, 'system')
    const stateColors = this.analyzeColorFamily(themeColors, 'state')

    const colorNaming = this.analyzeColorNaming(Object.keys(themeColors))
    const accessibilityGaps = this.findAccessibilityGaps(themeColors)

    return {
      primaryColors,
      semanticColors,
      neutralColors,
      systemColors,
      stateColors,
      accessibilityGaps,
      colorNaming
    }
  }

  private analyzeColorFamily(
    themeColors: Record<string, string>,
    familyName: string
  ): ColorFamilyAnalysis {
    const familyColors = Object.entries(themeColors).filter(([key]) =>
      key.toLowerCase().includes(familyName.toLowerCase())
    )

    const baseColor = familyColors[0]?.[1] || '#000000'
    const variations: ColorVariation[] = []

    for (const [name, value] of familyColors) {
      const rgb = hexToRgb(value)
      if (rgb) {
        variations.push({
          name,
          value,
          lightness: this.calculateLightness(rgb),
          saturation: this.calculateSaturation(rgb),
          intendedUse: this.inferIntendedUse(name),
          contrastWithWhite: getContrastRatio(value, '#ffffff'),
          contrastWithBlack: getContrastRatio(value, '#000000'),
          passesStandard: getContrastRatio(value, '#ffffff') >= 4.5
        })
      }
    }

    const contrastMatrix = this.buildContrastMatrix(familyColors)
    const accessibilityScore = this.calculateFamilyAccessibilityScore(variations)
    const recommendations = this.generateFamilyRecommendations(variations, contrastMatrix)
    const issues = this.identifyFamilyIssues(variations)

    return {
      familyName,
      baseColor,
      variations,
      contrastMatrix,
      accessibilityScore,
      recommendations,
      issues
    }
  }

  private calculateLightness(rgb: { r: number; g: number; b: number }): number {
    const max = Math.max(rgb.r, rgb.g, rgb.b) / 255
    const min = Math.min(rgb.r, rgb.g, rgb.b) / 255
    return ((max + min) / 2) * 100
  }

  private calculateSaturation(rgb: { r: number; g: number; b: number }): number {
    const max = Math.max(rgb.r, rgb.g, rgb.b) / 255
    const min = Math.min(rgb.r, rgb.g, rgb.b) / 255
    const lightness = (max + min) / 2

    if (max === min) return 0

    const d = max > 0.5 ? max - min : max + min
    return ((max - min) / (1 - Math.abs(2 * lightness - 1))) * 100
  }

  private inferIntendedUse(colorName: string): string[] {
    const uses: string[] = []

    if (colorName.includes('text')) uses.push('text')
    if (colorName.includes('background') || colorName.includes('surface')) uses.push('background')
    if (colorName.includes('border') || colorName.includes('outline')) uses.push('border')
    if (colorName.includes('primary')) uses.push('primary-action')
    if (colorName.includes('secondary')) uses.push('secondary-action')

    return uses.length > 0 ? uses : ['general']
  }

  private buildContrastMatrix(familyColors: [string, string][]): ContrastMatrix {
    const matrix: ContrastMatrix = {}

    for (const [name1, color1] of familyColors) {
      matrix[name1] = {}

      for (const [name2, color2] of familyColors) {
        const ratio = getContrastRatio(color1, color2)
        matrix[name1][name2] = {
          ratio,
          passesAA: ratio >= 4.5,
          passesAAA: ratio >= 7,
          usage: this.inferUsageContext(name1, name2)
        }
      }
    }

    return matrix
  }

  private inferUsageContext(color1: string, color2: string): string[] {
    const contexts: string[] = []

    if (color1.includes('text') && color2.includes('background')) {
      contexts.push('text-on-background')
    }
    if (color1.includes('border') || color2.includes('border')) {
      contexts.push('element-boundary')
    }

    return contexts
  }

  private calculateFamilyAccessibilityScore(variations: ColorVariation[]): number {
    if (variations.length === 0) return 0

    const passCount = variations.filter(v => v.passesStandard).length
    return (passCount / variations.length) * 100
  }

  private generateFamilyRecommendations(
    variations: ColorVariation[],
    matrix: ContrastMatrix
  ): string[] {
    const recommendations: string[] = []

    // 检查对比度问题
    const lowContrastVariations = variations.filter(v => !v.passesStandard)
    if (lowContrastVariations.length > 0) {
      recommendations.push(`${lowContrastVariations.length} 个颜色变体对比度不足`)
    }

    // 检查变体覆盖
    if (variations.length < 3) {
      recommendations.push('建议增加更多颜色变体以提供更丰富的视觉层次')
    }

    return recommendations
  }

  private identifyFamilyIssues(variations: ColorVariation[]): string[] {
    const issues: string[] = []

    // 检查亮度分布
    const lightnessValues = variations.map(v => v.lightness)
    const lightnessRange = Math.max(...lightnessValues) - Math.min(...lightnessValues)

    if (lightnessRange < 20) {
      issues.push('颜色变体之间亮度差异过小，可能难以区分')
    }

    // 检查饱和度一致性
    const saturationValues = variations.map(v => v.saturation)
    const avgSaturation = saturationValues.reduce((a, b) => a + b, 0) / saturationValues.length
    const inconsistentSaturation = saturationValues.some(s => Math.abs(s - avgSaturation) > 30)

    if (inconsistentSaturation) {
      issues.push('颜色变体之间饱和度差异较大，建议保持一致性')
    }

    return issues
  }

  private analyzeColorNaming(colorKeys: string[]): ColorNamingAnalysis {
    const namingIssues: string[] = []
    const suggestions: string[] = []

    // 检查命名一致性
    const hasConsistentPrefix = this.checkNamingConsistency(colorKeys)

    // 检查语义清晰度
    const semanticClarity = this.calculateSemanticClarity(colorKeys)

    if (!hasConsistentPrefix) {
      namingIssues.push('颜色命名缺乏一致性')
      suggestions.push('建议使用统一的命名前缀系统')
    }

    return {
      consistentNaming: hasConsistentPrefix,
      semanticClarity,
      nameIssues: namingIssues,
      suggestions
    }
  }

  private checkNamingConsistency(colorKeys: string[]): boolean {
    const prefixes = colorKeys.map(key => key.split('-')[0])
    const uniquePrefixes = new Set(prefixes)
    return uniquePrefixes.size <= 3 // 允许少量不同类型
  }

  private calculateSemanticClarity(colorKeys: string[]): number {
    // 计算语义清晰度分数
    const semanticKeywords = ['primary', 'secondary', 'success', 'warning', 'error', 'info']
    const semanticCount = colorKeys.filter(key =>
      semanticKeywords.some(keyword => key.toLowerCase().includes(keyword))
    ).length

    return (semanticCount / colorKeys.length) * 100
  }

  private findAccessibilityGaps(themeColors: Record<string, string>): string[] {
    const gaps: string[] = []

    // 检查是否有足够的对比度变体
    const hasHighContrast = Object.values(themeColors).some(color =>
      getContrastRatio(color, '#ffffff') >= 7 ||
      getContrastRatio(color, '#000000') >= 7
    )

    if (!hasHighContrast) {
      gaps.push('缺少高对比度颜色选项')
    }

    // 检查是否有状态颜色
    const statusColors = ['success', 'error', 'warning', 'info']
    const hasStatusColors = statusColors.some(status =>
      Object.keys(themeColors).some(key => key.toLowerCase().includes(status))
    )

    if (!hasStatusColors) {
      gaps.push('缺少状态指示颜色')
    }

    return gaps
  }

  private identifyThemeIssues(
    results: ContrastValidationResult[],
    colorSystem: ColorSystemAnalysis,
    themeData: SevenAxisThemeData
  ): ThemeIssue[] {
    const issues: ThemeIssue[] = []

    // 分析对比度问题
    const criticalContrastIssues = results.filter(r => r.severity === 'critical')
    if (criticalContrastIssues.length > 0) {
      issues.push({
        id: 'critical-contrast',
        severity: 'critical',
        category: 'contrast',
        description: '发现严重的颜色对比度问题',
        affectedColors: criticalContrastIssues.map(r => r.pair.element),
        impact: '严重影响可访问性，用户无法正常阅读内容',
        recommendation: '立即调整颜色组合以满足WCAG AA标准',
        priority: 1
      })
    }

    // 分析颜色系统问题
    if (colorSystem.accessibilityGaps.length > 0) {
      issues.push({
        id: 'color-system-gaps',
        severity: 'serious',
        category: 'consistency',
        description: '颜色系统存在可访问性缺口',
        affectedColors: colorSystem.accessibilityGaps,
        impact: '影响整体用户体验和一致性',
        recommendation: '完善颜色系统，添加缺失的颜色变体',
        priority: 2
      })
    }

    // 分析主题特定问题
    if (themeData.contrast === 'reduced' && results.some(r => r.severity === 'fail')) {
      issues.push({
        id: 'reduced-contrast-conflict',
        severity: 'moderate',
        category: 'usability',
        description: '低对比度主题与可访问性要求冲突',
        affectedColors: [],
        impact: '可能影响视觉敏感用户的体验',
        recommendation: '为低对比度模式提供替代方案或增强其他视觉提示',
        priority: 3
      })
    }

    return issues.sort((a, b) => a.priority - b.priority)
  }

  private getComplianceLevel(result: ContrastValidationResult): 'AAA' | 'AA' | 'A' | 'FAIL' {
    if (result.passesWCAG_AAA) return 'AAA'
    if (result.passesWCAG_AA) return 'AA'
    if (result.passesWCAG_A) return 'A'
    return 'FAIL'
  }
}

// ==================== 导出 ====================

export const colorContrastValidator = new ColorContrastValidator()

// 便捷方法
export async function validateThemeContrast(
  themeData: SevenAxisThemeData,
  themeColors: Record<string, string>
): Promise<ThemeContrastReport> {
  return colorContrastValidator.validateThemeContrast(themeData, themeColors)
}

export function checkRealTimeContrast(
  foreground: string,
  background: string,
  context?: string
) {
  return colorContrastValidator.checkRealTimeContrast(foreground, background, context)
}

export async function validateMultipleThemes(
  themes: Array<{
    data: SevenAxisThemeData
    colors: Record<string, string>
    name: string
  }>
): Promise<ThemeContrastReport[]> {
  return colorContrastValidator.validateMultipleThemes(themes)
}