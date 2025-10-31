/**
 * 📦 配方导入导出系统
 *
 * 提供完整的配方包管理功能，支持：
 * - 配方打包和解包
 * - 多种格式导出（JSON、XORIG、CSS）
 * - 批量导入和验证
 * - 依赖关系处理
 * - 压缩和优化
 */

import { DynamicRecipe, ValidationResult } from './seven-axis-recipe-engine'
import { SecurityCheckResult } from './recipe-validator'
import { RecipeHistory, RecipeVersion } from './recipe-storage-manager'

// ============================================================================
// 导入导出类型定义
// ============================================================================

/**
 * 配方包格式
 */
export enum RecipePackageFormat {
  JSON = 'json',
  XORIG = 'xorig',
  CSS = 'css',
  YAML = 'yaml',
  TOML = 'toml'
}

/**
 * 导出选项
 */
export interface ExportOptions {
  /** 导出格式 */
  format: RecipePackageFormat
  /** 是否包含历史版本 */
  includeHistory?: boolean
  /** 是否包含依赖 */
  includeDependencies?: boolean
  /** 是否压缩 */
  compress?: boolean
  /** 是否包含元数据 */
  includeMetadata?: boolean
  /** 版本范围 */
  versionRange?: {
    from?: string
    to?: string
  }
  /** 自定义模板 */
  template?: string
  /** 输出文件名 */
  filename?: string
}

/**
 * 导入选项
 */
export interface ImportOptions {
  /** 是否验证配方 */
  validate?: boolean
  /** 是否安全检查 */
  securityCheck?: boolean
  /** 是否覆盖现有配方 */
  overwrite?: boolean
  /** 是否保留版本历史 */
  preserveHistory?: boolean
  /** 是否处理依赖 */
  resolveDependencies?: boolean
  /** 目标分类 */
  targetCategory?: string
  /** 自定义映射 */
  fieldMapping?: Record<string, string>
}

/**
 * 配方包
 */
export interface RecipePackage {
  /** 包信息 */
  package: {
    name: string
    version: string
    description: string
    author: string
    license: string
    created: string
    format: RecipePackageFormat
  }
  /** 配方数据 */
  recipes: RecipePackageItem[]
  /** 依赖关系 */
  dependencies?: Record<string, string>
  /** 签名信息 */
  signature?: {
    algorithm: string
    value: string
    publicKey?: string
  }
}

/**
 * 配方包项
 */
export interface RecipePackageItem {
  /** 配方ID */
  id: string
  /** 配方数据 */
  recipe: DynamicRecipe
  /** 历史版本 */
  history?: RecipeHistory
  /** 验证结果 */
  validation?: ValidationResult
  /** 安全检查结果 */
  security?: SecurityCheckResult
}

/**
 * 导入结果
 */
export interface ImportResult {
  /** 是否成功 */
  success: boolean
  /** 导入的配方 */
  importedRecipes: string[]
  /** 跳过的配方 */
  skippedRecipes: string[]
  /** 失败的配方 */
  failedRecipes: Array<{
    id: string
    error: string
  }>
  /** 警告信息 */
  warnings: string[]
  /** 冲突信息 */
  conflicts: Array<{
    recipeId: string
    type: 'version' | 'content' | 'dependency'
    description: string
  }>
  /** 统计信息 */
  stats: {
    total: number
    imported: number
    skipped: number
    failed: number
  }
}

/**
 * 导出结果
 */
export interface ExportResult {
  /** 是否成功 */
  success: boolean
  /** 文件数据 */
  data: string | ArrayBuffer | Blob
  /** 文件名 */
  filename: string
  /** MIME类型 */
  mimeType: string
  /** 文件大小 */
  size: number
  /** 校验和 */
  checksum?: string
}

/**
 * 配方模板
 */
export interface RecipeTemplate {
  /** 模板ID */
  id: string
  /** 模板名称 */
  name: string
  /** 模板描述 */
  description: string
  /** 模板内容 */
  template: string
  /** 变量定义 */
  variables: TemplateVariable[]
  /** 示例数据 */
  example: any
}

/**
 * 模板变量
 */
export interface TemplateVariable {
  /** 变量名 */
  name: string
  /** 变量类型 */
  type: 'string' | 'number' | 'boolean' | 'object' | 'array'
  /** 默认值 */
  defaultValue: any
  /** 描述 */
  description: string
  /** 是否必需 */
  required: boolean
  /** 验证规则 */
  validation?: {
    pattern?: string
    min?: number
    max?: number
    options?: any[]
  }
}

// ============================================================================
// 配方导入导出管理器
// ============================================================================

/**
 * 配方导入导出管理器
 *
 * 提供完整的配方包管理功能：
 * - 多格式导出支持
 * - 智能导入处理
 * - 依赖关系解析
 * - 安全验证
 * - 压缩优化
 */
export class RecipeImportExportManager {
  private templates: Map<string, RecipeTemplate>
  private supportedFormats: Set<RecipePackageFormat>

  constructor() {
    this.templates = new Map()
    this.supportedFormats = new Set([
      RecipePackageFormat.JSON,
      RecipePackageFormat.XORIG,
      RecipePackageFormat.CSS,
      RecipePackageFormat.YAML,
      RecipePackageFormat.TOML
    ])

    this.initializeTemplates()
  }

  // ========================================================================
  // 导出功能
  // ========================================================================

  /**
   * 导出配方
   */
  async exportRecipes(
    recipes: (DynamicRecipe | string)[],
    options: ExportOptions
  ): Promise<ExportResult> {
    const startTime = performance.now()

    try {
      // 验证导出格式
      if (!this.supportedFormats.has(options.format)) {
        throw new Error(`不支持的导出格式: ${options.format}`)
      }

      // 收集配方数据
      const recipeItems: RecipePackageItem[] = []
      const histories: RecipeHistory[] = []

      for (const item of recipes) {
        const recipeId = typeof item === 'string' ? item : item.id
        const recipe = typeof item === 'string' ? await this.getRecipeById(recipeId) : item

        if (!recipe) {
          console.warn(`配方不存在，跳过: ${recipeId}`)
          continue
        }

        // 验证配方
        const validation = await this.validateRecipe(recipe)
        const security = await this.performSecurityCheck(recipe)

        const packageItem: RecipePackageItem = {
          id: recipeId,
          recipe,
          validation: options.includeMetadata ? validation : undefined,
          security: options.includeMetadata ? security : undefined
        }

        // 包含历史版本
        if (options.includeHistory) {
          const history = await this.getRecipeHistory(recipeId)
          if (history) {
            packageItem.history = history
            histories.push(history)
          }
        }

        recipeItems.push(packageItem)
      }

      // 构建配方包
      const recipePackage: RecipePackage = {
        package: {
          name: options.filename || 'recipe-package',
          version: '1.0.0',
          description: `导出 ${recipeItems.length} 个配方`,
          author: 'Xorigo UI',
          license: 'MIT',
          created: new Date().toISOString(),
          format: options.format
        },
        recipes: recipeItems
      }

      // 处理依赖关系
      if (options.includeDependencies) {
        recipePackage.dependencies = await this.resolveDependencies(recipeItems)
      }

      // 根据格式生成数据
      let data: string | ArrayBuffer | Blob
      let mimeType: string

      switch (options.format) {
        case RecipePackageFormat.JSON:
          data = this.exportToJSON(recipePackage, options)
          mimeType = 'application/json'
          break

        case RecipePackageFormat.XORIG:
          data = await this.exportToXORIG(recipePackage, options)
          mimeType = 'application/x-xorig'
          break

        case RecipePackageFormat.CSS:
          data = await this.exportToCSS(recipePackage, options)
          mimeType = 'text/css'
          break

        case RecipePackageFormat.YAML:
          data = this.exportToYAML(recipePackage, options)
          mimeType = 'application/x-yaml'
          break

        case RecipePackageFormat.TOML:
          data = this.exportToTOML(recipePackage, options)
          mimeType = 'application/toml'
          break

        default:
          throw new Error(`不支持的导出格式: ${options.format}`)
      }

      // 压缩处理
      if (options.compress) {
        const compressed = await this.compressData(data)
        data = compressed.data
        mimeType = compressed.mimeType
      }

      const filename = this.generateFilename(options, recipeItems.length)
      const size = this.getDataSize(data)
      const checksum = await this.calculateChecksum(data)

      const endTime = performance.now()

      console.log(`📦 配方导出完成 (${(endTime - startTime).toFixed(2)}ms) - ${filename}`)

      return {
        success: true,
        data,
        filename,
        mimeType,
        size,
        checksum
      }

    } catch (error) {
      console.error('配方导出失败:', error)
      return {
        success: false,
        data: '',
        filename: '',
        mimeType: '',
        size: 0
      }
    }
  }

  /**
   * 导出为JSON格式
   */
  private exportToJSON(packageData: RecipePackage, options: ExportOptions): string {
    const exportData = {
      ...packageData,
      exportedAt: new Date().toISOString(),
      exporter: 'Xorigo UI Theme System'
    }

    return JSON.stringify(exportData, null, options.compress ? 0 : 2)
  }

  /**
   * 导出为XORIG格式（二进制格式）
   */
  private async exportToXORIG(packageData: RecipePackage, options: ExportOptions): Promise<ArrayBuffer> {
    // 简化实现：将JSON转换为ArrayBuffer
    const jsonString = this.exportToJSON(packageData, { ...options, compress: false })
    const encoder = new TextEncoder()
    return encoder.encode(jsonString).buffer
  }

  /**
   * 导出为CSS格式
   */
  private async exportToCSS(packageData: RecipePackage, options: ExportOptions): Promise<string> {
    const cssLines: string[] = []

    // 添加文件头注释
    cssLines.push(`/* Xorigo UI Theme Package - ${packageData.package.name} */`)
    cssLines.push(`/* Generated at: ${new Date().toISOString()} */`)
    cssLines.push(`/* Recipe count: ${packageData.recipes.length} */`)
    cssLines.push('')

    // 为每个配方生成CSS变量
    for (const recipeItem of packageData.recipes) {
      const { recipe } = recipeItem
      cssLines.push(`/* Recipe: ${recipe.name} (${recipe.id}) */`)

      // 生成七轴相关的CSS变量
      if (recipe.axes) {
        cssLines.push(`:root[data-theme="${recipe.id}"] {`)

        // 模式变量
        cssLines.push(`  --xorigo-mode: ${recipe.axes.mode};`)

        // 色调变量
        cssLines.push(`  --xorigo-hue-primary: ${recipe.axes.hue.primary};`)
        if (recipe.axes.hue.secondary) {
          cssLines.push(`  --xorigo-hue-secondary: ${recipe.axes.hue.secondary};`)
        }
        if (recipe.axes.hue.accent) {
          cssLines.push(`  --xorigo-hue-accent: ${recipe.axes.hue.accent};`)
        }

        // 饱和度变量
        cssLines.push(`  --xorigo-saturation-factor: ${recipe.axes.saturation.factor};`)
        cssLines.push(`  --xorigo-saturation-strategy: ${recipe.axes.saturation.strategy};`)

        // 亮度变量
        cssLines.push(`  --xorigo-lightness-factor: ${recipe.axes.lightness.factor};`)
        cssLines.push(`  --xorigo-lightness-contrast: ${recipe.axes.lightness.contrast};`)

        // 密度变量
        cssLines.push(`  --xorigo-density-level: ${recipe.axes.density.level};`)
        cssLines.push(`  --xorigo-density-scale: ${recipe.axes.density.scaleFactor};`)

        // 圆度变量
        cssLines.push(`  --xorigo-roundness-level: ${recipe.axes.roundness.level};`)
        cssLines.push(`  --xorigo-roundness-radius: ${recipe.axes.roundness.radius};`)

        // 对比度变量
        cssLines.push(`  --xorigo-contrast-level: ${recipe.axes.contrast.level};`)
        cssLines.push(`  --xorigo-contrast-ratio: ${recipe.axes.contrast.ratio};`)

        // 自定义令牌
        if (recipe.customTokens) {
          cssLines.push('')
          cssLines.push('  /* Custom tokens */')
          Object.entries(recipe.customTokens).forEach(([key, value]) => {
            cssLines.push(`  --xorigo-${key}: ${value};`)
          })
        }

        cssLines.push('}')
        cssLines.push('')
      }
    }

    return cssLines.join('\n')
  }

  /**
   * 导出为YAML格式
   */
  private exportToYAML(packageData: RecipePackage, options: ExportOptions): string {
    // 简化实现：转换为YAML格式
    const yamlLines: string[] = []

    yamlLines.push('# Xorigo UI Theme Package')
    yamlLines.push(`name: "${packageData.package.name}"`)
    yamlLines.push(`version: "${packageData.package.version}"`)
    yamlLines.push(`description: "${packageData.package.description}"`)
    yamlLines.push(`author: "${packageData.package.author}"`)
    yamlLines.push(`license: "${packageData.package.license}"`)
    yamlLines.push(`created: "${packageData.package.created}"`)
    yamlLines.push('')

    yamlLines.push('recipes:')
    for (const recipeItem of packageData.recipes) {
      yamlLines.push(`  - id: "${recipeItem.id}"`)
      yamlLines.push(`    name: "${recipeItem.recipe.name}"`)
      yamlLines.push(`    description: "${recipeItem.recipe.description}"`)
      yamlLines.push(`    version: "${recipeItem.recipe.version}"`)
      // 添加更多字段...
    }

    return yamlLines.join('\n')
  }

  /**
   * 导出为TOML格式
   */
  private exportToTOML(packageData: RecipePackage, options: ExportOptions): string {
    // 简化实现：转换为TOML格式
    const tomlLines: string[] = []

    tomlLines.push('[package]')
    tomlLines.push(`name = "${packageData.package.name}"`)
    tomlLines.push(`version = "${packageData.package.version}"`)
    tomlLines.push(`description = "${packageData.package.description}"`)
    tomlLines.push(`author = "${packageData.package.author}"`)
    tolmLines.push(`license = "${packageData.package.license}"`)
    tolmLines.push(`created = "${packageData.package.created}"`)
    tolmLines.push('')

    tolmLines.push('[[recipes]]')
    for (const recipeItem of packageData.recipes) {
      tolmLines.push(`id = "${recipeItem.id}"`)
      tolmLines.push(`name = "${recipeItem.recipe.name}"`)
      tolmLines.push(`description = "${recipeItem.recipe.description}"`)
      tolmLines.push(`version = "${recipeItem.recipe.version}"`)
      tolmLines.push('')
    }

    return tolmLines.join('\n')
  }

  // ========================================================================
  // 导入功能
  // ========================================================================

  /**
   * 导入配方
   */
  async importRecipes(
    data: string | ArrayBuffer | Blob,
    options: ImportOptions
  ): Promise<ImportResult> {
    const startTime = performance.now()

    const result: ImportResult = {
      success: true,
      importedRecipes: [],
      skippedRecipes: [],
      failedRecipes: [],
      warnings: [],
      conflicts: [],
      stats: {
        total: 0,
        imported: 0,
        skipped: 0,
        failed: 0
      }
    }

    try {
      // 解析配方包
      let packageData: RecipePackage

      if (data instanceof Blob) {
        const text = await data.text()
        packageData = await this.parsePackageData(text)
      } else if (data instanceof ArrayBuffer) {
        const decoder = new TextDecoder()
        const text = decoder.decode(data)
        packageData = await this.parsePackageData(text)
      } else {
        packageData = await this.parsePackageData(data)
      }

      result.stats.total = packageData.recipes.length

      // 处理依赖关系
      if (options.resolveDependencies && packageData.dependencies) {
        await this.resolvePackageDependencies(packageData.dependencies, result)
      }

      // 导入每个配方
      for (const recipeItem of packageData.recipes) {
        await this.importSingleRecipe(recipeItem, options, result)
      }

      const endTime = performance.now()

      console.log(`📥 配方导入完成 (${(endTime - startTime).toFixed(2)}ms)`)
      console.log(`总计: ${result.stats.total}, 成功: ${result.stats.imported}, 跳过: ${result.stats.skipped}, 失败: ${result.stats.failed}`)

      return result

    } catch (error) {
      console.error('配方导入失败:', error)
      result.success = false
      result.failedRecipes.push({
        id: 'unknown',
        error: error instanceof Error ? error.message : '导入失败'
      })
      return result
    }
  }

  /**
   * 导入单个配方
   */
  private async importSingleRecipe(
    recipeItem: RecipePackageItem,
    options: ImportOptions,
    result: ImportResult
  ): Promise<void> {
    try {
      const { recipe, history } = recipeItem

      // 检查是否已存在
      const existingRecipe = await this.getRecipeById(recipe.id)
      if (existingRecipe && !options.overwrite) {
        result.skippedRecipes.push(recipe.id)
        result.warnings.push(`配方已存在，跳过: ${recipe.id}`)
        return
      }

      // 字段映射
      if (options.fieldMapping) {
        recipe = this.mapRecipeFields(recipe, options.fieldMapping)
      }

      // 验证配方
      if (options.validate !== false) {
        const validation = await this.validateRecipe(recipe)
        if (!validation.isValid) {
          result.failedRecipes.push({
            id: recipe.id,
            error: `验证失败: ${validation.errors.join(', ')}`
          })
          return
        }
      }

      // 安全检查
      if (options.securityCheck !== false) {
        const security = await this.performSecurityCheck(recipe)
        if (security.riskLevel === 'blocked') {
          result.failedRecipes.push({
            id: recipe.id,
            error: '安全检查失败，配方被阻止'
          })
          return
        } else if (security.riskLevel === 'danger') {
          result.warnings.push(`配方存在安全风险: ${recipe.id}`)
        }
      }

      // 设置分类
      if (options.targetCategory && recipe.metadata) {
        recipe.metadata.category = options.targetCategory
      }

      // 保存配方
      await this.saveRecipe(recipe)

      // 保存历史版本（如果需要）
      if (options.preserveHistory && history) {
        await this.saveRecipeHistory(history)
      }

      result.importedRecipes.push(recipe.id)
      result.stats.imported++

    } catch (error) {
      result.failedRecipes.push({
        id: recipeItem.id,
        error: error instanceof Error ? error.message : '导入失败'
      })
      result.stats.failed++
    }
  }

  /**
   * 解析配方包数据
   */
  private async parsePackageData(data: string): Promise<RecipePackage> {
    // 尝试检测格式并解析
    try {
      // 尝试JSON格式
      const jsonData = JSON.parse(data)
      if (jsonData.package && jsonData.recipes) {
        return jsonData as RecipePackage
      }
    } catch {
      // JSON解析失败，尝试其他格式
    }

    // 检测CSS格式
    if (data.includes('xorigo-') && data.includes(':root')) {
      return this.parseCSSPackage(data)
    }

    // 检测YAML格式
    if (data.includes('name:') && data.includes('recipes:')) {
      return this.parseYAMLPackage(data)
    }

    throw new Error('无法识别的配方包格式')
  }

  /**
   * 解析CSS包
   */
  private parseCSSPackage(cssData: string): RecipePackage {
    // 简化实现：从CSS中提取配方信息
    const recipes: RecipePackageItem[] = []

    // 使用正则表达式提取CSS变量
    const themeRegex = /:root\[data-theme="([^"]+)"\]([^}]+)/g
    let match

    while ((match = themeRegex.exec(cssData)) !== null) {
      const themeId = match[1]
      const cssContent = match[2]

      // 解析CSS变量构建配方
      const recipe: DynamicRecipe = {
        id: themeId,
        name: themeId,
        description: `从CSS导入的配方: ${themeId}`,
        version: '1.0.0',
        axes: {
          mode: 'light',
          hue: { primary: 'blue' },
          saturation: { factor: 1.0, strategy: 'standard' },
          lightness: { factor: 1.0, contrast: 'medium' },
          density: { level: 'comfortable', scaleFactor: 1.0 },
          roundness: { level: 'rounded', radius: 8 },
          contrast: { level: 'standard', ratio: 4.5 }
        },
        customTokens: {}
      }

      // 解析CSS变量
      const variableRegex = /--xorigo-([^:]+):\s*([^;]+)/g
      let variableMatch

      while ((variableMatch = variableRegex.exec(cssContent)) !== null) {
        const varName = variableMatch[1]
        const varValue = variableMatch[2].trim()

        if (varName.startsWith('mode')) {
          recipe.axes.mode = varValue as any
        } else if (varName.startsWith('hue-')) {
          // 处理色调相关变量
        } else {
          // 自定义令牌
          recipe.customTokens![varName] = varValue
        }
      }

      recipes.push({
        id: themeId,
        recipe
      })
    }

    return {
      package: {
        name: 'css-import',
        version: '1.0.0',
        description: '从CSS导入的配方包',
        author: 'Xorigo UI',
        license: 'MIT',
        created: new Date().toISOString(),
        format: RecipePackageFormat.CSS
      },
      recipes
    }
  }

  /**
   * 解析YAML包
   */
  private parseYAMLPackage(yamlData: string): RecipePackage {
    // 简化实现：手动解析YAML
    const lines = yamlData.split('\n')
    const recipes: RecipePackageItem[] = []

    let currentRecipe: any = null
    let inRecipes = false

    for (const line of lines) {
      const trimmed = line.trim()

      if (trimmed === 'recipes:') {
        inRecipes = true
        continue
      }

      if (inRecipes && trimmed.startsWith('- id:')) {
        if (currentRecipe) {
          recipes.push(currentRecipe)
        }
        currentRecipe = {
          id: trimmed.split('"')[1],
          recipe: {
            id: trimmed.split('"')[1],
            name: '',
            description: '',
            version: '1.0.0',
            axes: {
              mode: 'light',
              hue: { primary: 'blue' },
              saturation: { factor: 1.0, strategy: 'standard' },
              lightness: { factor: 1.0, contrast: 'medium' },
              density: { level: 'comfortable', scaleFactor: 1.0 },
              roundness: { level: 'rounded', radius: 8 },
              contrast: { level: 'standard', ratio: 4.5 }
            }
          }
        }
      }

      if (currentRecipe && trimmed.includes('name:')) {
        currentRecipe.recipe.name = trimmed.split('"')[1]
      }

      if (currentRecipe && trimmed.includes('description:')) {
        currentRecipe.recipe.description = trimmed.split('"')[1]
      }
    }

    if (currentRecipe) {
      recipes.push(currentRecipe)
    }

    return {
      package: {
        name: 'yaml-import',
        version: '1.0.0',
        description: '从YAML导入的配方包',
        author: 'Xorigo UI',
        license: 'MIT',
        created: new Date().toISOString(),
        format: RecipePackageFormat.YAML
      },
      recipes
    }
  }

  // ========================================================================
  // 模板系统
  // ========================================================================

  /**
   * 初始化模板
   */
  private initializeTemplates(): void {
    const defaultTemplates: RecipeTemplate[] = [
      {
        id: 'corporate',
        name: '企业专业模板',
        description: '适用于企业环境的专业配方模板',
        template: `{
  "id": "{{id}}",
  "name": "{{name}}",
  "description": "{{description}}",
  "version": "1.0.0",
  "axes": {
    "mode": "{{mode}}",
    "hue": {
      "primary": "{{primaryHue}}",
      "secondary": "{{secondaryHue}}"
    },
    "saturation": {
      "factor": {{saturationFactor}},
      "strategy": "{{saturationStrategy}}"
    },
    "lightness": {
      "factor": {{lightnessFactor}},
      "contrast": "{{contrast}}"
    },
    "density": {
      "level": "{{density}}",
      "scaleFactor": {{densityFactor}}
    },
    "roundness": {
      "level": "{{roundness}}",
      "radius": {{borderRadius}}
    },
    "contrast": {
      "level": "{{contrastLevel}}",
      "ratio": {{contrastRatio}}
    }
  }
}`,
        variables: [
          {
            name: 'id',
            type: 'string',
            defaultValue: 'my-theme',
            description: '配方ID',
            required: true,
            validation: { pattern: '^[a-z0-9-]+$' }
          },
          {
            name: 'name',
            type: 'string',
            defaultValue: 'My Theme',
            description: '配方名称',
            required: true
          },
          {
            name: 'mode',
            type: 'string',
            defaultValue: 'light',
            description: '主题模式',
            required: false,
            validation: { options: ['light', 'dark', 'auto'] }
          },
          {
            name: 'primaryHue',
            type: 'string',
            defaultValue: 'blue',
            description: '主色调',
            required: false,
            validation: { options: ['blue', 'purple', 'cyan', 'green'] }
          }
        ],
        example: {
          id: 'my-corporate-theme',
          name: 'My Corporate Theme',
          mode: 'light',
          primaryHue: 'blue'
        }
      }
    ]

    for (const template of defaultTemplates) {
      this.templates.set(template.id, template)
    }
  }

  /**
   * 使用模板创建配方
   */
  async createFromTemplate(
    templateId: string,
    variables: Record<string, any>
  ): Promise<DynamicRecipe> {
    const template = this.templates.get(templateId)
    if (!template) {
      throw new Error(`模板不存在: ${templateId}`)
    }

    // 验证变量
    await this.validateTemplateVariables(template, variables)

    // 应用变量到模板
    let recipeJson = template.template
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g')
      recipeJson = recipeJson.replace(regex, String(value))
    }

    // 解析为配方对象
    const recipe = JSON.parse(recipeJson) as DynamicRecipe

    // 验证生成的配方
    const validation = await this.validateRecipe(recipe)
    if (!validation.isValid) {
      throw new Error(`生成的配方验证失败: ${validation.errors.join(', ')}`)
    }

    return recipe
  }

  /**
   * 验证模板变量
   */
  private async validateTemplateVariables(
    template: RecipeTemplate,
    variables: Record<string, any>
  ): Promise<void> {
    for (const templateVar of template.variables) {
      const value = variables[templateVar.name]

      // 检查必需变量
      if (templateVar.required && (value === undefined || value === null)) {
        throw new Error(`缺少必需变量: ${templateVar.name}`)
      }

      // 如果没有提供值，使用默认值
      if (value === undefined || value === null) {
        variables[templateVar.name] = templateVar.defaultValue
        continue
      }

      // 类型验证
      if (!this.validateVariableType(value, templateVar.type)) {
        throw new Error(`变量类型错误: ${templateVar.name} 期望 ${templateVar.type}`)
      }

      // 自定义验证
      if (templateVar.validation) {
        this.validateVariableValue(value, templateVar)
      }
    }
  }

  /**
   * 验证变量类型
   */
  private validateVariableType(value: any, type: string): boolean {
    switch (type) {
      case 'string':
        return typeof value === 'string'
      case 'number':
        return typeof value === 'number'
      case 'boolean':
        return typeof value === 'boolean'
      case 'object':
        return typeof value === 'object' && value !== null && !Array.isArray(value)
      case 'array':
        return Array.isArray(value)
      default:
        return true
    }
  }

  /**
   * 验证变量值
   */
  private validateVariableValue(value: any, templateVar: TemplateVariable): void {
    const validation = templateVar.validation
    if (!validation) return

    // 正则表达式验证
    if (validation.pattern && typeof value === 'string') {
      const regex = new RegExp(validation.pattern)
      if (!regex.test(value)) {
        throw new Error(`变量值不符合格式要求: ${templateVar.name}`)
      }
    }

    // 数值范围验证
    if (typeof value === 'number') {
      if (validation.min !== undefined && value < validation.min) {
        throw new Error(`变量值太小: ${templateVar.name} >= ${validation.min}`)
      }
      if (validation.max !== undefined && value > validation.max) {
        throw new Error(`变量值太大: ${templateVar.name} <= ${validation.max}`)
      }
    }

    // 选项验证
    if (validation.options && !validation.options.includes(value)) {
      throw new Error(`变量值不在选项范围内: ${templateVar.name}`)
    }
  }

  // ========================================================================
  // 工具方法
  // ========================================================================

  /**
   * 解析依赖关系
   */
  private async resolveDependencies(
    recipeItems: RecipePackageItem[]
  ): Promise<Record<string, string>> {
    const dependencies: Record<string, string> = {}

    for (const item of recipeItems) {
      if (item.recipe.dependencies) {
        Object.assign(dependencies, item.recipe.dependencies)
      }
    }

    return dependencies
  }

  /**
   * 解析包依赖
   */
  private async resolvePackageDependencies(
    dependencies: Record<string, string>,
    result: ImportResult
  ): Promise<void> {
    // 简化实现：检查依赖是否存在
    for (const [depId, version] of Object.entries(dependencies)) {
      const exists = await this.getRecipeById(depId)
      if (!exists) {
        result.warnings.push(`缺少依赖: ${depId} (${version})`)
      }
    }
  }

  /**
   * 字段映射
   */
  private mapRecipeFields(recipe: DynamicRecipe, mapping: Record<string, string>): DynamicRecipe {
    const mapped = { ...recipe }

    for (const [oldField, newField] of Object.entries(mapping)) {
      if (oldField in mapped) {
        ;(mapped as any)[newField] = (mapped as any)[oldField]
        delete (mapped as any)[oldField]
      }
    }

    return mapped
  }

  /**
   * 压缩数据
   */
  private async compressData(data: string | ArrayBuffer | Blob): Promise<{
    data: ArrayBuffer | Blob
    mimeType: string
  }> {
    // 简化实现：返回原始数据
    if (typeof data === 'string') {
      const encoder = new TextEncoder()
      return {
        data: encoder.encode(data).buffer,
        mimeType: 'application/octet-stream'
      }
    }

    return {
      data,
      mimeType: 'application/octet-stream'
    }
  }

  /**
   * 生成文件名
   */
  private generateFilename(options: ExportOptions, recipeCount: number): string {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')
    const baseName = options.filename || `recipe-package-${recipeCount}`

    switch (options.format) {
      case RecipePackageFormat.JSON:
        return `${baseName}-${timestamp}.json`
      case RecipePackageFormat.XORIG:
        return `${baseName}-${timestamp}.xorig`
      case RecipePackageFormat.CSS:
        return `${baseName}-${timestamp}.css`
      case RecipePackageFormat.YAML:
        return `${baseName}-${timestamp}.yaml`
      case RecipePackageFormat.TOML:
        return `${baseName}-${timestamp}.toml`
      default:
        return `${baseName}-${timestamp}.txt`
    }
  }

  /**
   * 获取数据大小
   */
  private getDataSize(data: string | ArrayBuffer | Blob): number {
    if (typeof data === 'string') {
      return new Blob([data]).size
    }

    if (data instanceof ArrayBuffer) {
      return data.byteLength
    }

    return data.size
  }

  /**
   * 计算校验和
   */
  private async calculateChecksum(data: string | ArrayBuffer | Blob): Promise<string> {
    // 简化实现：使用字符串哈希
    let content: string

    if (typeof data === 'string') {
      content = data
    } else if (data instanceof ArrayBuffer) {
      content = new TextDecoder().decode(data)
    } else {
      content = await data.text()
    }

    // 简单的哈希函数
    let hash = 0
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // 转换为32位整数
    }

    return Math.abs(hash).toString(16)
  }

  // ========================================================================
  // 占位符方法（需要与实际系统集成）
  // ========================================================================

  private async getRecipeById(recipeId: string): Promise<DynamicRecipe | null> {
    // 需要与配方存储系统集成
    return null
  }

  private async getRecipeHistory(recipeId: string): Promise<RecipeHistory | null> {
    // 需要与配方存储系统集成
    return null
  }

  private async validateRecipe(recipe: DynamicRecipe): Promise<ValidationResult> {
    // 需要与配方验证系统集成
    return {
      isValid: true,
      errors: [],
      warnings: [],
      securityLevel: 'safe'
    }
  }

  private async performSecurityCheck(recipe: DynamicRecipe): Promise<SecurityCheckResult> {
    // 需要与配方验证系统集成
    return {
      isSecure: true,
      riskLevel: 'safe',
      issues: [],
      recommendations: [],
      checkedAt: Date.now()
    }
  }

  private async saveRecipe(recipe: DynamicRecipe): Promise<void> {
    // 需要与配方存储系统集成
  }

  private async saveRecipeHistory(history: RecipeHistory): Promise<void> {
    // 需要与配方存储系统集成
  }

  // ========================================================================
  // 公共API
  // ========================================================================

  /**
   * 获取可用模板
   */
  getAvailableTemplates(): RecipeTemplate[] {
    return Array.from(this.templates.values())
  }

  /**
   * 获取支持的格式
   */
  getSupportedFormats(): RecipePackageFormat[] {
    return Array.from(this.supportedFormats)
  }

  /**
   * 添加自定义模板
   */
  addTemplate(template: RecipeTemplate): void {
    this.templates.set(template.id, template)
  }

  /**
   * 删除模板
   */
  removeTemplate(templateId: string): boolean {
    return this.templates.delete(templateId)
  }
}

// ============================================================================
// 默认实例和便捷函数
// ============================================================================

/**
 * 默认导入导出管理器实例
 */
export const recipeImportExportManager = new RecipeImportExportManager()

/**
 * 便捷函数
 */
export const exportRecipes = (recipes: (DynamicRecipe | string)[], options: ExportOptions) =>
  recipeImportExportManager.exportRecipes(recipes, options)

export const importRecipes = (data: string | ArrayBuffer | Blob, options: ImportOptions) =>
  recipeImportExportManager.importRecipes(data, options)

export const createFromTemplate = (templateId: string, variables: Record<string, any>) =>
  recipeImportExportManager.createFromTemplate(templateId, variables)

export default {
  RecipeImportExportManager,
  recipeImportExportManager,
  exportRecipes,
  importRecipes,
  createFromTemplate
}