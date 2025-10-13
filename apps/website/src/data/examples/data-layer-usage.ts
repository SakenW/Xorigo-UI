/**
 * 📚 数据层使用示例
 *
 * 展示四层架构数据层的标准使用方法
 * 包含所有适配器的基本操作和最佳实践
 *
 * @author Hive Mind Coder Agent
 * @version 1.0.0
 */

import {
  // 适配器实例
  readonlyRegistry,
  readonlyTokens,
  readonlyDocs,
  readonlyRecipes,
  readonlyI18n,

  // 验证工具
  validateAllConsistency,
  printValidationReport,
  checkDataLayerHealth,
  getDataLayerStats,

  // 类型
  type Component,
  type Tokens,
  type DocContent,
  type ValidationResult,

  // 错误处理
  DataError,
  DataErrorCode
} from '../index'

// ============================================================================
// Registry 适配器使用示例
// ============================================================================

/**
 * 获取所有组件
 */
export function getAllComponents(): Component[] {
  try {
    const components = readonlyRegistry.getComponents()
    console.log(`✅ 获取到 ${components.length} 个组件`)
    return components
  } catch (error) {
    if (error instanceof DataError) {
      console.error(`❌ Registry 错误 [${error.code}]: ${error.message}`)
    }
    throw error
  }
}

/**
 * 按类别获取组件
 */
export function getComponentsByCategory(category: string): Component[] {
  const components = readonlyRegistry.getComponentsByCategory(category)
  console.log(`📦 ${category} 类别有 ${components.length} 个组件`)
  return components
}

/**
 * 搜索组件
 */
export function searchComponents(query: string): Component[] {
  const components = readonlyRegistry.searchByTags([query])
  console.log(`🔍 搜索 "${query}" 找到 ${components.length} 个组件`)
  return components
}

// ============================================================================
// Tokens 适配器使用示例
// ============================================================================

/**
 * 获取设计令牌
 */
export function getDesignTokens(): Tokens {
  try {
    const tokens = readonlyTokens.getDesignTokens()
    console.log('🎨 获取设计令牌成功')
    return tokens
  } catch (error) {
    if (error instanceof DataError) {
      console.error(`❌ Tokens 错误 [${error.code}]: ${error.message}`)
    }
    throw error
  }
}

/**
 * 获取调色板
 */
export function getPalettes() {
  const palettes = readonlyTokens.getPalettes()
  console.log(`🎨 获取到 ${Object.keys(palettes).length} 个调色板`)
  return palettes
}

/**
 * 获取主题配方
 */
export function getThemeRecipes() {
  const recipes = readonlyTokens.getRecipes()
  console.log(`🍽️ 获取到 ${Object.keys(recipes).length} 个主题配方`)
  return recipes
}

// ============================================================================
// Docs 适配器使用示例
// ============================================================================

/**
 * 获取文档索引
 */
export function getDocumentIndex() {
  try {
    const index = readonlyDocs.getDocumentIndex()
    console.log(`📚 获取到 ${index.length} 篇文档`)
    return index
  } catch (error) {
    if (error instanceof DataError) {
      console.error(`❌ Docs 错误 [${error.code}]: ${error.message}`)
    }
    throw error
  }
}

/**
 * 获取特定文档内容
 */
export function getDocumentContent(slug: string): DocContent | undefined {
  const content = readonlyDocs.getDocumentContent(slug)
  if (content) {
    console.log(`📄 获取文档内容: ${content.metadata.title}`)
  } else {
    console.warn(`⚠️ 文档不存在: ${slug}`)
  }
  return content
}

/**
 * 按分类获取文档
 */
export function getDocumentsByCategory(category: string) {
  const docs = readonlyDocs.getDocumentsByCategory(category as any)
  console.log(`📂 ${category} 分类有 ${docs.length} 篇文档`)
  return docs
}

/**
 * 搜索文档
 */
export function searchDocuments(query: string) {
  const docs = readonlyDocs.searchDocuments(query)
  console.log(`🔍 搜索 "${query}" 找到 ${docs.length} 篇文档`)
  return docs
}

// ============================================================================
// Recipes 适配器使用示例
// ============================================================================

/**
 * 获取所有配方
 */
export function getAllRecipes() {
  try {
    const recipes = readonlyRecipes.getAllRecipes()
    console.log(`🍽️ 获取到 ${recipes.length} 个配方`)
    return recipes
  } catch (error) {
    console.error(`❌ Recipes 错误:`, error)
    throw error
  }
}

/**
 * 按类别获取配方
 */
export function getRecipesByCategory(category: string) {
  const recipes = readonlyRecipes.getRecipesByCategory(category)
  console.log(`📂 ${category} 类别有 ${recipes.length} 个配方`)
  return recipes
}

// ============================================================================
// I18n 适配器使用示例
// ============================================================================

/**
 * 获取当前语言环境
 */
export function getCurrentLocale() {
  const locale = readonlyI18n.getLocale()
  console.log(`🌐 当前语言: ${locale}`)
  return locale
}

/**
 * 获取翻译
 */
export function getTranslation(key: string, params?: Record<string, any>) {
  try {
    const { t, tWithParams } = readonlyI18n
    const translation = params ? tWithParams(key, params) : t(key)
    console.log(`🈯 翻译 [${key}]: ${translation}`)
    return translation
  } catch (error) {
    console.error(`❌ I18n 错误:`, error)
    return key
  }
}

// ============================================================================
// 验证和健康检查示例
// ============================================================================

/**
 * 执行完整的数据层验证
 */
export function performFullValidation(): ValidationResult {
  console.log('🔍 开始执行完整的数据层验证...')

  const report = validateAllConsistency()
  printValidationReport(report)

  return {
    valid: report.summary.isValid,
    errors: [],
    warnings: []
  }
}

/**
 * 检查数据层健康状态
 */
export function performHealthCheck() {
  console.log('🏥 检查数据层健康状态...')

  const health = checkDataLayerHealth()

  console.log(`健康状态: ${health.healthy ? '✅ 健康' : '❌ 异常'}`)
  console.log(`错误数量: ${health.errors}`)
  console.log(`警告数量: ${health.warnings}`)
  console.log(`最后验证: ${health.lastValidated}`)

  return health
}

/**
 * 获取数据层统计信息
 */
export function getDataStatistics() {
  console.log('📊 获取数据层统计信息...')

  const stats = getDataLayerStats()

  console.log('📈 统计信息:')
  console.log(`  组件: ${stats.components.total} 个，${stats.components.categories.length} 个分类`)
  console.log(`  令牌: ${stats.tokens.palettes} 个调色板，${stats.tokens.recipes} 个配方`)
  console.log(`  文档: ${stats.docs.total} 篇，${stats.docs.categories.length} 个分类`)
  console.log(`  配方: ${stats.recipes.total} 个`)
  console.log(`  语言: ${stats.i18n.currentLocale}，支持 ${stats.i18n.supportedLocales.length} 种语言`)

  return stats
}

// ============================================================================
// 错误处理示例
// ============================================================================

/**
 * 安全的数据操作示例
 */
export function safeDataOperation() {
  console.log('🛡️ 执行安全的数据操作...')

  try {
    // 获取组件
    const components = readonlyRegistry.getComponents()
    console.log(`✅ 成功获取 ${components.length} 个组件`)

    // 获取令牌
    const tokens = readonlyTokens.getDesignTokens()
    console.log(`✅ 成功获取设计令牌`)

    // 获取文档
    const docs = readonlyDocs.getDocumentIndex()
    console.log(`✅ 成功获取 ${docs.length} 篇文档`)

    return { success: true, data: { components, tokens, docs } }
  } catch (error) {
    if (error instanceof DataError) {
      switch (error.code) {
        case DataErrorCode.NOT_FOUND:
          console.error('❌ 数据文件未找到')
          break
        case DataErrorCode.VALIDATION_ERROR:
          console.error('❌ 数据验证失败')
          break
        case DataErrorCode.PARSE_ERROR:
          console.error('❌ 数据解析错误')
          break
        case DataErrorCode.CONFIG_ERROR:
          console.error('❌ 配置错误')
          break
        default:
          console.error(`❌ 未知错误: ${error.message}`)
      }
    }

    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// ============================================================================
// 综合使用示例
// ============================================================================

/**
 * 综合示例：获取组件相关的所有信息
 */
export function getComponentCompleteInfo(componentName: string) {
  console.log(`🔍 获取组件 ${componentName} 的完整信息...`)

  try {
    // 获取组件信息
    const component = readonlyRegistry.getComponent(componentName)
    if (!component) {
      console.warn(`⚠️ 组件不存在: ${componentName}`)
      return null
    }

    // 获取相关文档
    const docs = readonlyDocs.searchDocuments(componentName)

    // 获取相关令牌
    const tokens = readonlyTokens.getDesignTokens()

    // 获取相关配方
    const recipes = readonlyRecipes.getAllRecipes()

    console.log(`✅ 成功获取组件 ${componentName} 的完整信息`)

    return {
      component,
      relatedDocs: docs,
      availableTokens: tokens,
      availableRecipes: recipes
    }
  } catch (error) {
    console.error(`❌ 获取组件信息失败:`, error)
    return null
  }
}

/**
 * 主函数 - 演示所有功能
 */
export function demonstrateDataLayerUsage() {
  console.log('🚀 开始演示数据层功能...\n')

  // 1. 基础数据获取
  console.log('=== 基础数据获取 ===')
  getAllComponents()
  getDesignTokens()
  getDocumentIndex()
  getAllRecipes()
  getCurrentLocale()

  console.log('\n=== 统计信息 ===')
  getDataStatistics()

  console.log('\n=== 健康检查 ===')
  performHealthCheck()

  console.log('\n=== 错误处理 ===')
  safeDataOperation()

  console.log('\n=== 综合示例 ===')
  getComponentCompleteInfo('button')

  console.log('\n🎉 数据层功能演示完成!')
}

// 如果直接运行此文件，执行演示
if (require.main === module) {
  demonstrateDataLayerUsage()
}