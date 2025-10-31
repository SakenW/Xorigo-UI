/**
 * 🔒 配方验证和安全管理模块
 *
 * 提供严格的配方验证、安全检查和风险管理功能
 * 确保动态加载的配方安全可靠
 */

import { DynamicRecipe, ValidationResult, SevenAxisConfig } from './seven-axis-recipe-engine'

// ============================================================================
// 安全策略和规则定义
// ============================================================================

/**
 * 安全策略配置
 */
export interface SecurityPolicy {
  /** 允许的CSS属性白名单 */
  allowedCSSProperties: string[]
  /** 禁止的值模式 */
  forbiddenPatterns: RegExp[]
  /** 最大CSS变量数量 */
  maxCustomTokens: number
  /** 最大字符串长度 */
  maxStringLength: number
  /** 允许的域名白名单 */
  allowedDomains: string[]
  /** 是否允许网络请求 */
  allowNetworkRequests: boolean
  /** 是否允许文件访问 */
  allowFileSystemAccess: boolean
}

/**
 * 默认安全策略
 */
export const DEFAULT_SECURITY_POLICY: SecurityPolicy = {
  allowedCSSProperties: [
    // 颜色相关
    'color', 'background-color', 'border-color', 'outline-color',
    'opacity', 'filter', 'backdrop-filter',
    // 布局相关
    'margin', 'padding', 'width', 'height', 'max-width', 'max-height',
    'display', 'position', 'top', 'right', 'bottom', 'left',
    'flex', 'grid', 'align-items', 'justify-content',
    // 字体相关
    'font-family', 'font-size', 'font-weight', 'line-height',
    'letter-spacing', 'word-spacing', 'text-align',
    // 边框和圆角
    'border', 'border-radius', 'outline', 'box-shadow',
    // 动画相关
    'transition', 'animation', 'transform',
    // 其他安全属性
    'z-index', 'overflow', 'visibility', 'cursor'
  ],
  forbiddenPatterns: [
    // JavaScript相关
    /javascript:/i,
    /data:text\/html/i,
    /data:application\/javascript/i,
    /<script/i,
    /<\/script>/i,
    /on\w+\s*=/i,
    /eval\(/i,
    /Function\(/i,
    /setTimeout\(/i,
    /setInterval\(/i,
    // 危险CSS函数
    /expression\(/i,
    /url\(/i,
    /@import/i,
    /behavior\s*:/i,
    // 文件系统
    /file:\/\//i,
    /\.\.\/|\\\\/,
    // 网络请求
    /fetch\(/i,
    /XMLHttpRequest/i,
    /axios/i,
    /websocket/i
  ],
  maxCustomTokens: 200,
  maxStringLength: 10000,
  allowedDomains: [
    'xorigo-ui.com',
    'github.com',
    'cdn.jsdelivr.net',
    'unpkg.com'
  ],
  allowNetworkRequests: false,
  allowFileSystemAccess: false
}

/**
 * 验证规则接口
 */
export interface ValidationRule {
  name: string
  description: string
  severity: 'error' | 'warning' | 'info'
  validate: (recipe: DynamicRecipe, context: ValidationContext) => ValidationResult
}

/**
 * 验证上下文
 */
export interface ValidationContext {
  /** 当前安全策略 */
  securityPolicy: SecurityPolicy
  /** 是否为严格模式 */
  strictMode: boolean
  /** 验证时间戳 */
  timestamp: number
  /** 依赖的配方 */
  dependencies: Map<string, DynamicRecipe>
}

// ============================================================================
// 配方验证器核心类
// ============================================================================

/**
 * 高级配方验证器
 *
 * 提供全面的配方验证、安全检查和性能评估
 */
export class RecipeValidator {
  private securityPolicy: SecurityPolicy
  private validationRules: ValidationRule[]
  private dependencyGraph: Map<string, Set<string>>

  constructor(securityPolicy: SecurityPolicy = DEFAULT_SECURITY_POLICY) {
    this.securityPolicy = securityPolicy
    this.validationRules = this.initializeValidationRules()
    this.dependencyGraph = new Map()
  }

  // ========================================================================
  // 主要验证方法
  // ========================================================================

  /**
   * 全面验证配方
   */
  async validateRecipe(
    recipe: DynamicRecipe,
    options: ValidationOptions = {}
  ): Promise<ValidationResult> {
    const context: ValidationContext = {
      securityPolicy: options.securityPolicy || this.securityPolicy,
      strictMode: options.strictMode || false,
      timestamp: Date.now(),
      dependencies: new Map()
    }

    // 加载依赖配方
    if (recipe.dependencies && recipe.dependencies.length > 0) {
      await this.loadDependencies(recipe.dependencies, context.dependencies)
    }

    // 执行所有验证规则
    const results = await Promise.all(
      this.validationRules.map(rule => this.executeRule(rule, recipe, context))
    )

    // 合并验证结果
    return this.mergeValidationResults(results)
  }

  /**
   * 快速安全检查
   */
  performSecurityCheck(recipe: DynamicRecipe): SecurityCheckResult {
    const issues: SecurityIssue[] = []
    let riskLevel: SecurityRiskLevel = 'safe'

    // 1. 检查恶意代码
    const codeIssues = this.checkMaliciousCode(recipe)
    issues.push(...codeIssues)

    // 2. 检查网络请求
    const networkIssues = this.checkNetworkRequests(recipe)
    issues.push(...networkIssues)

    // 3. 检查文件系统访问
    const fsIssues = this.checkFileSystemAccess(recipe)
    issues.push(...fsIssues)

    // 4. 检查数据泄露风险
    const dataLeakIssues = this.checkDataLeakage(recipe)
    issues.push(...dataLeakIssues)

    // 5. 检查性能风险
    const performanceIssues = this.checkPerformanceRisks(recipe)
    issues.push(...performanceIssues)

    // 确定风险等级
    riskLevel = this.determineRiskLevel(issues)

    return {
      isSecure: riskLevel === 'safe',
      riskLevel,
      issues,
      recommendations: this.generateSecurityRecommendations(issues),
      checkedAt: Date.now()
    }
  }

  /**
   * 批量验证配方
   */
  async validateRecipes(
    recipes: DynamicRecipe[],
    options: BatchValidationOptions = {}
  ): Promise<BatchValidationResult> {
    const startTime = performance.now()
    const results = Map<string, ValidationResult>()
    const errors: string[] = []

    // 并发验证（限制并发数）
    const concurrency = options.maxConcurrency || 5
    const chunks = this.chunkArray(recipes, concurrency)

    for (const chunk of chunks) {
      const chunkPromises = chunk.map(async (recipe) => {
        try {
          const result = await this.validateRecipe(recipe, options.validationOptions)
          results.set(recipe.id, result)
        } catch (error) {
          errors.push(`验证配方 ${recipe.id} 失败: ${error}`)
        }
      })

      await Promise.all(chunkPromises)
    }

    const endTime = performance.now()

    return {
      results,
      errors,
      summary: this.generateValidationSummary(results),
      duration: endTime - startTime,
      validatedAt: Date.now()
    }
  }

  // ========================================================================
  // 验证规则定义
  // ========================================================================

  /**
   * 初始化验证规则
   */
  private initializeValidationRules(): ValidationRule[] {
    return [
      // 基础结构验证
      this.createBasicStructureRule(),
      // 七轴配置验证
      this.createSevenAxisRule(),
      // CSS变量验证
      this.createCSSVariablesRule(),
      // 性能验证
      this.createPerformanceRule(),
      // 兼容性验证
      this.createCompatibilityRule(),
      // 可访问性验证
      this.createAccessibilityRule(),
      // 版本兼容性验证
      this.createVersionCompatibilityRule()
    ]
  }

  /**
   * 基础结构验证规则
   */
  private createBasicStructureRule(): ValidationRule {
    return {
      name: 'basic-structure',
      description: '验证配方的基础结构和必填字段',
      severity: 'error',
      validate: (recipe, context) => {
        const errors: string[] = []
        const warnings: string[] = []

        // 必填字段检查
        if (!recipe.id || recipe.id.trim() === '') {
          errors.push('配方ID不能为空')
        } else if (!/^[a-z0-9-]+$/.test(recipe.id)) {
          errors.push('配方ID只能包含小写字母、数字和连字符')
        }

        if (!recipe.name || recipe.name.trim() === '') {
          errors.push('配方名称不能为空')
        } else if (recipe.name.length > 100) {
          warnings.push('配方名称过长，建议不超过100个字符')
        }

        if (!recipe.description || recipe.description.trim() === '') {
          warnings.push('建议提供配方描述')
        } else if (recipe.description.length > 500) {
          warnings.push('配方描述过长，建议不超过500个字符')
        }

        // 版本格式检查
        if (!recipe.version) {
          warnings.push('建议指定配方版本')
        } else if (!/^\d+\.\d+\.\d+(-[a-zA-Z0-9-]+)?$/.test(recipe.version)) {
          errors.push('版本格式无效，应使用语义化版本号 (如 1.0.0)')
        }

        // 元数据检查
        if (!recipe.metadata) {
          warnings.push('建议提供配方元数据')
        } else {
          if (!recipe.metadata.category) {
            warnings.push('建议指定配方分类')
          }
          if (!recipe.metadata.tags || recipe.metadata.tags.length === 0) {
            warnings.push('建议提供配方标签')
          }
          if (recipe.metadata.tags && recipe.metadata.tags.length > 10) {
            warnings.push('标签数量过多，建议不超过10个')
          }
        }

        return {
          isValid: errors.length === 0,
          errors,
          warnings,
          securityLevel: errors.length > 0 ? 'danger' : warnings.length > 0 ? 'warning' : 'safe'
        }
      }
    }
  }

  /**
   * 七轴配置验证规则
   */
  private createSevenAxisRule(): ValidationRule {
    return {
      name: 'seven-axis-config',
      description: '验证七轴DTCG配置的有效性和一致性',
      severity: 'error',
      validate: (recipe, context) => {
        const errors: string[] = []
        const warnings: string[] = []
        const { axes } = recipe

        if (!axes) {
          errors.push('缺少七轴配置')
          return {
            isValid: false,
            errors,
            warnings,
            securityLevel: 'danger'
          }
        }

        // 1. 模式轴验证
        const validModes = ['light', 'dark', 'auto', 'hc']
        if (!validModes.includes(axes.mode)) {
          errors.push(`无效的模式轴值: ${axes.mode}，有效值: ${validModes.join(', ')}`)
        }

        // 2. 色调轴验证
        if (!axes.hue) {
          errors.push('缺少色调轴配置')
        } else {
          const validHues = ['blue', 'purple', 'cyan', 'green', 'red', 'yellow', 'orange', 'pink', 'indigo']
          if (!validHues.includes(axes.hue.primary)) {
            errors.push(`无效的主色调: ${axes.hue.primary}，有效值: ${validHues.join(', ')}`)
          }
          if (axes.hue.secondary && !validHues.includes(axes.hue.secondary)) {
            warnings.push(`次要色调可能不受支持: ${axes.hue.secondary}`)
          }
        }

        // 3. 饱和度轴验证
        if (!axes.saturation) {
          errors.push('缺少饱和度轴配置')
        } else {
          if (axes.saturation.factor < 0.1 || axes.saturation.factor > 2.0) {
            errors.push(`饱和度因子超出合理范围 (0.1-2.0): ${axes.saturation.factor}`)
          }
          if (axes.saturation.factor < 0.5 || axes.saturation.factor > 1.5) {
            warnings.push(`饱和度因子可能影响可读性 (建议0.5-1.5): ${axes.saturation.factor}`)
          }
        }

        // 4. 亮度轴验证
        if (!axes.lightness) {
          errors.push('缺少亮度轴配置')
        } else {
          if (axes.lightness.factor < 0.5 || axes.lightness.factor > 1.5) {
            warnings.push(`亮度因子可能影响可读性 (建议0.8-1.2): ${axes.lightness.factor}`)
          }
          const validContrasts = ['low', 'medium', 'high', 'maximum']
          if (!validContrasts.includes(axes.lightness.contrast)) {
            errors.push(`无效的对比度级别: ${axes.lightness.contrast}`)
          }
        }

        // 5. 密度轴验证
        if (!axes.density) {
          errors.push('缺少密度轴配置')
        } else {
          const validLevels = ['compact', 'comfortable', 'spacious']
          if (!validLevels.includes(axes.density.level)) {
            errors.push(`无效的密度级别: ${axes.density.level}`)
          }
          if (axes.density.scaleFactor < 0.5 || axes.density.scaleFactor > 2.0) {
            warnings.push(`密度缩放因子可能影响布局 (建议0.85-1.15): ${axes.density.scaleFactor}`)
          }
        }

        // 6. 圆度轴验证
        if (!axes.roundness) {
          errors.push('缺少圆度轴配置')
        } else {
          const validLevels = ['sharp', 'rounded', 'circular']
          if (!validLevels.includes(axes.roundness.level)) {
            errors.push(`无效的圆度级别: ${axes.roundness.level}`)
          }
          if (axes.roundness.radius < 0 || axes.roundness.radius > 50) {
            warnings.push(`圆角半径可能过大 (建议0-24px): ${axes.roundness.radius}`)
          }
        }

        // 7. 对比度轴验证
        if (!axes.contrast) {
          errors.push('缺少对比度轴配置')
        } else {
          const validLevels = ['subtle', 'standard', 'strong', 'extreme']
          if (!validLevels.includes(axes.contrast.level)) {
            errors.push(`无效的对比度级别: ${axes.contrast.level}`)
          }
          if (axes.contrast.ratio < 3 || axes.contrast.ratio > 21) {
            warnings.push(`对比度比值可能不符合WCAG标准 (建议3:1-21:1): ${axes.contrast.ratio}`)
          }
        }

        // 轴间一致性检查
        this.checkAxisConsistency(axes, errors, warnings)

        return {
          isValid: errors.length === 0,
          errors,
          warnings,
          securityLevel: errors.length > 0 ? 'danger' : warnings.length > 0 ? 'warning' : 'safe'
        }
      }
    }
  }

  /**
   * CSS变量验证规则
   */
  private createCSSVariablesRule(): ValidationRule {
    return {
      name: 'css-variables',
      description: '验证自定义CSS变量的安全性和有效性',
      severity: 'warning',
      validate: (recipe, context) => {
        const errors: string[] = []
        const warnings: string[] = []
        const { securityPolicy } = context

        if (!recipe.customTokens) {
          return {
            isValid: true,
            errors,
            warnings,
            securityLevel: 'safe'
          }
        }

        // 检查变量数量
        if (Object.keys(recipe.customTokens).length > securityPolicy.maxCustomTokens) {
          errors.push(`自定义令牌数量超出限制 (${securityPolicy.maxCustomTokens})`)
        }

        // 检查每个变量
        Object.entries(recipe.customTokens).forEach(([key, value]) => {
          // 检查键名
          if (!/^[a-z0-9-_]+$/.test(key)) {
            errors.push(`无效的令牌名称: ${key}，只能包含小写字母、数字、连字符和下划线`)
          }

          // 检查值长度
          if (value.length > securityPolicy.maxStringLength) {
            errors.push(`令牌值过长: ${key} (${value.length} > ${securityPolicy.maxStringLength})`)
          }

          // 检查恶意模式
          for (const pattern of securityPolicy.forbiddenPatterns) {
            if (pattern.test(value)) {
              errors.push(`令牌 ${key} 包含不安全的内容: ${pattern}`)
              break
            }
          }

          // 检查CSS属性安全性
          if (key.includes('color') || key.includes('background')) {
            if (!this.isValidColorValue(value)) {
              warnings.push(`令牌 ${key} 的颜色值可能无效: ${value}`)
            }
          }

          // 检查URL
          if (value.includes('url(')) {
            if (!this.isValidCSSUrl(value, securityPolicy.allowedDomains)) {
              errors.push(`令牌 ${key} 包含不安全的URL: ${value}`)
            }
          }
        })

        return {
          isValid: errors.length === 0,
          errors,
          warnings,
          securityLevel: errors.length > 0 ? 'danger' : warnings.length > 0 ? 'warning' : 'safe'
        }
      }
    }
  }

  /**
   * 性能验证规则
   */
  private createPerformanceRule(): ValidationRule {
    return {
      name: 'performance',
      description: '检查配方的性能影响',
      severity: 'warning',
      validate: (recipe, context) => {
        const errors: string[] = []
        const warnings: string[] = []

        // 检查自定义令牌数量对性能的影响
        if (recipe.customTokens && Object.keys(recipe.customTokens).length > 100) {
          warnings.push('自定义令牌数量过多，可能影响CSS解析性能')
        }

        // 检查动画配置
        if (recipe.animations) {
          if (recipe.animations.duration > 2000) {
            warnings.push('动画持续时间过长，可能影响用户体验')
          }
          if (recipe.animations.duration < 100) {
            warnings.push('动画持续时间过短，用户可能无法感知')
          }
          if (recipe.animations.stagger > 500) {
            warnings.push('动画延迟时间过长，可能影响界面响应性')
          }
        }

        // 检查依赖复杂度
        if (recipe.dependencies && recipe.dependencies.length > 5) {
          warnings.push('依赖关系复杂，可能增加加载时间')
        }

        return {
          isValid: errors.length === 0,
          errors,
          warnings,
          securityLevel: 'safe'
        }
      }
    }
  }

  /**
   * 兼容性验证规则
   */
  private createCompatibilityRule(): ValidationRule {
    return {
      name: 'compatibility',
      description: '检查配方的浏览器兼容性',
      severity: 'warning',
      validate: (recipe, context) => {
        const errors: string[] = []
        const warnings: string[] = []

        // 检查CSS属性兼容性
        if (recipe.customTokens) {
          Object.entries(recipe.customTokens).forEach(([key, value]) => {
            // 检查现代CSS特性
            if (value.includes('oklch(') || value.includes('oklab(')) {
              warnings.push(`令牌 ${key} 使用了OKLCH颜色空间，可能在旧版浏览器中不支持`)
            }
            if (value.includes('color-mix(')) {
              warnings.push(`令牌 ${key} 使用了color-mix()函数，可能在旧版浏览器中不支持`)
            }
            if (value.includes('clamp(')) {
              warnings.push(`令牌 ${key} 使用了clamp()函数，可能在旧版浏览器中不支持`)
            }
          })
        }

        return {
          isValid: errors.length === 0,
          errors,
          warnings,
          securityLevel: 'safe'
        }
      }
    }
  }

  /**
   * 可访问性验证规则
   */
  private createAccessibilityRule(): ValidationRule {
    return {
      name: 'accessibility',
      description: '检查配方的可访问性合规性',
      severity: 'warning',
      validate: (recipe, context) => {
        const errors: string[] = []
        const warnings: string[] = []

        // 检查对比度
        if (recipe.axes.contrast.level === 'subtle') {
          warnings.push('对比度级别为"subtle"，可能不满足WCAG AA标准')
        }

        // 检查颜色依赖
        if (recipe.axes.mode === 'hc' && !recipe.axes.contrast.level.includes('maximum')) {
          warnings.push('高对比度模式下建议使用"maximum"对比度级别')
        }

        return {
          isValid: errors.length === 0,
          errors,
          warnings,
          securityLevel: 'safe'
        }
      }
    }
  }

  /**
   * 版本兼容性验证规则
   */
  private createVersionCompatibilityRule(): ValidationRule {
    return {
      name: 'version-compatibility',
      description: '检查配方版本兼容性',
      severity: 'info',
      validate: (recipe, context) => {
        const errors: string[] = []
        const warnings: string[] = []

        // 检查版本格式
        if (recipe.version) {
          const version = recipe.version
          const majorVersion = parseInt(version.split('.')[0])

          if (majorVersion > 2) {
            warnings.push(`配方主版本号较新 (${majorVersion})，可能存在兼容性问题`)
          }

          if (version.includes('alpha') || version.includes('beta')) {
            warnings.push('使用预发布版本，可能存在稳定性问题')
          }
        }

        return {
          isValid: errors.length === 0,
          errors,
          warnings,
          securityLevel: 'safe'
        }
      }
    }
  }

  // ========================================================================
  // 安全检查方法
  // ========================================================================

  /**
   * 检查恶意代码
   */
  private checkMaliciousCode(recipe: DynamicRecipe): SecurityIssue[] {
    const issues: SecurityIssue[] = []
    const content = JSON.stringify(recipe)

    for (const pattern of this.securityPolicy.forbiddenPatterns) {
      if (pattern.test(content)) {
        issues.push({
          type: 'malicious-code',
          severity: 'critical',
          description: `检测到潜在的恶意代码模式: ${pattern.source}`,
          pattern: pattern.source,
          recommendation: '移除不安全的代码内容'
        })
      }
    }

    return issues
  }

  /**
   * 检查网络请求
   */
  private checkNetworkRequests(recipe: DynamicRecipe): SecurityIssue[] {
    const issues: SecurityIssue[] = []

    if (!this.securityPolicy.allowNetworkRequests) {
      const content = JSON.stringify(recipe)
      const networkPatterns = [/fetch\(/i, /XMLHttpRequest/i, /axios/i, /websocket/i]

      for (const pattern of networkPatterns) {
        if (pattern.test(content)) {
          issues.push({
            type: 'network-request',
            severity: 'high',
            description: `检测到网络请求代码: ${pattern.source}`,
            pattern: pattern.source,
            recommendation: '移除网络请求代码或使用允许的域名'
          })
        }
      }
    }

    return issues
  }

  /**
   * 检查文件系统访问
   */
  private checkFileSystemAccess(recipe: DynamicRecipe): SecurityIssue[] {
    const issues: SecurityIssue[] = []

    if (!this.securityPolicy.allowFileSystemAccess) {
      const content = JSON.stringify(recipe)
      const fsPatterns = [/fs\./i, /require\(/i, /import\s+.*fs/i, /\.\./g]

      for (const pattern of fsPatterns) {
        if (pattern.test(content)) {
          issues.push({
            type: 'filesystem-access',
            severity: 'high',
            description: `检测到文件系统访问: ${pattern.source}`,
            pattern: pattern.source,
            recommendation: '移除文件系统访问代码'
          })
        }
      }
    }

    return issues
  }

  /**
   * 检查数据泄露风险
   */
  private checkDataLeakage(recipe: DynamicRecipe): SecurityIssue[] {
    const issues: SecurityIssue[] = []

    // 检查可能的敏感信息
    const sensitivePatterns = [
      /password/i,
      /token/i,
      /secret/i,
      /key/i,
      /auth/i,
      /api[-_]?key/i
    ]

    const content = JSON.stringify(recipe)
    for (const pattern of sensitivePatterns) {
      if (pattern.test(content)) {
        issues.push({
          type: 'data-leakage',
          severity: 'medium',
          description: `检测到可能的敏感信息: ${pattern.source}`,
          pattern: pattern.source,
          recommendation: '移除敏感信息或使用安全的存储方式'
        })
      }
    }

    return issues
  }

  /**
   * 检查性能风险
   */
  private checkPerformanceRisks(recipe: DynamicRecipe): SecurityIssue[] {
    const issues: SecurityIssue[] = []

    // 检查大量自定义令牌
    if (recipe.customTokens && Object.keys(recipe.customTokens).length > 200) {
      issues.push({
        type: 'performance-risk',
        severity: 'low',
        description: '自定义令牌数量过多，可能影响性能',
        recommendation: '减少自定义令牌数量或使用预设配方'
      })
    }

    // 检查复杂动画
    if (recipe.animations && recipe.animations.duration > 3000) {
      issues.push({
        type: 'performance-risk',
        severity: 'low',
        description: '动画持续时间过长，可能影响性能',
        recommendation: '减少动画持续时间或简化动画效果'
      })
    }

    return issues
  }

  // ========================================================================
  // 工具和辅助方法
  // ========================================================================

  /**
   * 执行验证规则
   */
  private async executeRule(
    rule: ValidationRule,
    recipe: DynamicRecipe,
    context: ValidationContext
  ): Promise<ValidationResult> {
    try {
      return rule.validate(recipe, context)
    } catch (error) {
      console.error(`验证规则 ${rule.name} 执行失败:`, error)
      return {
        isValid: false,
        errors: [`验证规则 ${rule.name} 执行失败: ${error}`],
        warnings: [],
        securityLevel: 'danger'
      }
    }
  }

  /**
   * 合并验证结果
   */
  private mergeValidationResults(results: ValidationResult[]): ValidationResult {
    const allErrors: string[] = []
    const allWarnings: string[] = []
    let overallSecurityLevel: 'safe' | 'warning' | 'danger' | 'blocked' = 'safe'

    for (const result of results) {
      allErrors.push(...result.errors)
      allWarnings.push(...result.warnings)

      // 更新安全等级（取最严重的）
      const levelSeverity = {
        'safe': 0,
        'warning': 1,
        'danger': 2,
        'blocked': 3
      }

      if (levelSeverity[result.securityLevel] > levelSeverity[overallSecurityLevel]) {
        overallSecurityLevel = result.securityLevel
      }
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
      securityLevel: overallSecurityLevel
    }
  }

  /**
   * 检查轴间一致性
   */
  private checkAxisConsistency(axes: SevenAxisConfig, errors: string[], warnings: string[]): void {
    // 检查模式与对比度的一致性
    if (axes.mode === 'hc' && axes.contrast.level !== 'extreme') {
      warnings.push('高对比度模式下建议使用"extreme"对比度级别')
    }

    // 检查饱和度与色调的一致性
    if (axes.saturation.strategy === 'monochrome' && axes.saturation.factor > 1.0) {
      warnings.push('单色策略下饱和度因子较高可能导致颜色失真')
    }

    // 检查密度与圆度的一致性
    if (axes.density.level === 'compact' && axes.roundness.radius > 16) {
      warnings.push('紧凑密度下建议使用较小的圆角半径')
    }
  }

  /**
   * 检查颜色值有效性
   */
  private isValidColorValue(value: string): boolean {
    const colorPatterns = [
      /^#[0-9a-fA-F]{3,8}$/,
      /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/,
      /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/,
      /^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/,
      /^hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*[\d.]+\s*\)$/,
      /^oklch\(/,
      /^oklab\(/
    ]

    return colorPatterns.some(pattern => pattern.test(value))
  }

  /**
   * 检查CSS URL有效性
   */
  private isValidCSSUrl(value: string, allowedDomains: string[]): boolean {
    const urlMatch = value.match(/url\(['"]?([^'")]+)['"]?\)/)
    if (!urlMatch) return true

    const url = urlMatch[1]

    // 允许相对路径
    if (url.startsWith('./') || url.startsWith('/') || !url.includes('://')) {
      return true
    }

    // 检查域名白名单
    try {
      const urlObj = new URL(url)
      return allowedDomains.some(domain => urlObj.hostname.includes(domain))
    } catch {
      return false
    }
  }

  /**
   * 确定风险等级
   */
  private determineRiskLevel(issues: SecurityIssue[]): SecurityRiskLevel {
    const criticalIssues = issues.filter(i => i.severity === 'critical')
    const highIssues = issues.filter(i => i.severity === 'high')
    const mediumIssues = issues.filter(i => i.severity === 'medium')

    if (criticalIssues.length > 0) return 'blocked'
    if (highIssues.length > 0) return 'danger'
    if (mediumIssues.length > 2) return 'danger'
    if (mediumIssues.length > 0) return 'warning'
    return 'safe'
  }

  /**
   * 生成安全建议
   */
  private generateSecurityRecommendations(issues: SecurityIssue[]): string[] {
    const recommendations = new Set<string>()

    issues.forEach(issue => {
      recommendations.add(issue.recommendation)
    })

    // 通用建议
    if (issues.some(i => i.type === 'malicious-code')) {
      recommendations.add('使用官方配方库或可信来源的配方')
    }
    if (issues.some(i => i.type === 'network-request')) {
      recommendations.add('如需网络资源，请使用CDN或可信域名')
    }

    return Array.from(recommendations)
  }

  /**
   * 加载依赖配方
   */
  private async loadDependencies(
    dependencies: string[],
    dependencyMap: Map<string, DynamicRecipe>
  ): Promise<void> {
    // 这里可以实现依赖配方的加载逻辑
    // 暂时跳过实际加载
  }

  /**
   * 数组分块
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  }

  /**
   * 生成验证摘要
   */
  private generateValidationSummary(results: Map<string, ValidationResult>): ValidationSummary {
    let total = results.size
    let valid = 0
    let validWithWarnings = 0
    let invalid = 0

    results.forEach(result => {
      if (result.isValid) {
        if (result.warnings.length > 0) {
          validWithWarnings++
        } else {
          valid++
        }
      } else {
        invalid++
      }
    })

    return {
      total,
      valid,
      validWithWarnings,
      invalid,
      successRate: total > 0 ? (valid / total) * 100 : 0
    }
  }
}

// ============================================================================
// 类型定义
// ============================================================================

export interface ValidationOptions {
  securityPolicy?: SecurityPolicy
  strictMode?: boolean
  skipPerformanceCheck?: boolean
}

export interface BatchValidationOptions {
  maxConcurrency?: number
  validationOptions?: ValidationOptions
  failFast?: boolean
}

export interface SecurityCheckResult {
  isSecure: boolean
  riskLevel: SecurityRiskLevel
  issues: SecurityIssue[]
  recommendations: string[]
  checkedAt: number
}

export interface SecurityIssue {
  type: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  description: string
  pattern?: string
  recommendation: string
}

export type SecurityRiskLevel = 'safe' | 'warning' | 'danger' | 'blocked'

export interface BatchValidationResult {
  results: Map<string, ValidationResult>
  errors: string[]
  summary: ValidationSummary
  duration: number
  validatedAt: number
}

export interface ValidationSummary {
  total: number
  valid: number
  validWithWarnings: number
  invalid: number
  successRate: number
}

// ============================================================================
// 默认实例和便捷函数
// ============================================================================

/**
 * 默认验证器实例
 */
export const recipeValidator = new RecipeValidator()

/**
 * 便捷函数
 */
export const validateRecipe = (recipe: DynamicRecipe, options?: ValidationOptions) =>
  recipeValidator.validateRecipe(recipe, options)

export const checkRecipeSecurity = (recipe: DynamicRecipe) =>
  recipeValidator.performSecurityCheck(recipe)

export const validateRecipes = (recipes: DynamicRecipe[], options?: BatchValidationOptions) =>
  recipeValidator.validateRecipes(recipes, options)

export default {
  RecipeValidator,
  recipeValidator,
  validateRecipe,
  checkRecipeSecurity,
  validateRecipes,
  DEFAULT_SECURITY_POLICY
}