/**
 * 🧪 数据层基础测试
 *
 * 验证四层架构数据层的基本功能
 * 确保所有适配器正常工作
 *
 * @author Hive Mind Coder Agent
 * @version 1.0.0
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'

import {
  // 适配器实例
  readonlyRegistry,
  readonlyTokens,
  readonlyDocs,
  readonlyRecipes,
  readonlyI18n,

  // 验证工具
  validateAllConsistency,
  checkDataLayerHealth,
  getDataLayerStats,

  // 适配器类
  RegistryReadonlyAdapter,
  TokensReadonlyAdapter,
  DocsReadonlyAdapter,

  // 类型
  type Component,
  type Tokens,
  type ValidationResult,
  type DataError,
  DataErrorCode
} from '../index'

describe('🗄️ 数据层基础测试', () => {
  beforeEach(() => {
    // 每个测试前重置适配器缓存
    // 注意：在实际应用中，这可能不需要
  })

  afterEach(() => {
    // 测试后清理
  })

  describe('📦 Registry 适配器', () => {
    it('应该能够获取单例实例', () => {
      const adapter1 = RegistryReadonlyAdapter.getInstance()
      const adapter2 = RegistryReadonlyAdapter.getInstance()
      expect(adapter1).toBe(adapter2)
    })

    it('应该能够获取组件列表', () => {
      const components = readonlyRegistry.getComponents()
      expect(Array.isArray(components)).toBe(true)
      // 组件数量应该大于0，但这里我们不做具体数量检查
      // 因为这依赖于实际的registry数据
    })

    it('应该能够获取组件分类', () => {
      const categories = readonlyRegistry.getCategories()
      expect(Array.isArray(categories)).toBe(true)
    })

    it('应该能够按分类获取组件', () => {
      const categories = readonlyRegistry.getCategories()
      if (categories.length > 0) {
        const components = readonlyRegistry.getComponentsByCategory(categories[0])
        expect(Array.isArray(components)).toBe(true)
      }
    })

    it('应该能够搜索组件', () => {
      const components = readonlyRegistry.searchByTags(['test'])
      expect(Array.isArray(components)).toBe(true)
    })

    it('应该能够获取元数据', () => {
      const metadata = readonlyRegistry.getMetadata()
      expect(metadata).toBeDefined()
      expect(typeof metadata.version).toBe('string')
    })

    it('应该能够验证一致性', () => {
      const result = readonlyRegistry.validateConsistency()
      expect(typeof result.valid).toBe('boolean')
      expect(Array.isArray(result.errors)).toBe(true)
      expect(Array.isArray(result.warnings)).toBe(true)
    })
  })

  describe('🎨 Tokens 适配器', () => {
    it('应该能够获取单例实例', () => {
      const adapter1 = TokensReadonlyAdapter.getInstance()
      const adapter2 = TokensReadonlyAdapter.getInstance()
      expect(adapter1).toBe(adapter2)
    })

    it('应该能够获取设计令牌', () => {
      const tokens = readonlyTokens.getDesignTokens()
      expect(tokens).toBeDefined()
      expect(tokens.palettes).toBeDefined()
      expect(tokens.foundations).toBeDefined()
    })

    it('应该能够获取调色板', () => {
      const palettes = readonlyTokens.getPalettes()
      expect(palettes).toBeDefined()
      expect(palettes.neutralScale).toBeDefined()
      expect(palettes.blueScale).toBeDefined()
    })

    it('应该能够获取特定调色板', () => {
      const palette = readonlyTokens.getPalette('neutralScale')
      expect(palette).toBeDefined()
    })

    it('应该能够获取基础令牌', () => {
      const foundations = readonlyTokens.getFoundations()
      expect(foundations).toBeDefined()
      expect(foundations.typography).toBeDefined()
      expect(foundations.spacing).toBeDefined()
    })

    it('应该能够获取配方', () => {
      const recipes = readonlyTokens.getRecipes()
      expect(typeof recipes).toBe('object')
    })

    it('应该能够获取密度预设', () => {
      const presets = readonlyTokens.getDensityPresets()
      expect(typeof presets).toBe('object')
    })

    it('应该能够验证一致性', () => {
      const result = readonlyTokens.validateConsistency()
      expect(typeof result.valid).toBe('boolean')
      expect(Array.isArray(result.errors)).toBe(true)
      expect(Array.isArray(result.warnings)).toBe(true)
    })
  })

  describe('📚 Docs 适配器', () => {
    it('应该能够获取单例实例', () => {
      const adapter1 = DocsReadonlyAdapter.getInstance()
      const adapter2 = DocsReadonlyAdapter.getInstance()
      expect(adapter1).toBe(adapter2)
    })

    it('应该能够获取文档索引', () => {
      const index = readonlyDocs.getDocumentIndex()
      expect(Array.isArray(index)).toBe(true)
    })

    it('应该能够获取文档分类', () => {
      const categories = readonlyDocs.getCategories()
      expect(Array.isArray(categories)).toBe(true)
    })

    it('应该能够按分类获取文档', () => {
      const categories = readonlyDocs.getCategories()
      if (categories.length > 0) {
        const docs = readonlyDocs.getDocumentsByCategory(categories[0])
        expect(Array.isArray(docs)).toBe(true)
      }
    })

    it('应该能够搜索文档', () => {
      const docs = readonlyDocs.searchDocuments('test')
      expect(Array.isArray(docs)).toBe(true)
    })

    it('应该能够验证一致性', () => {
      const result = readonlyDocs.validateConsistency()
      expect(typeof result.valid).toBe('boolean')
      expect(Array.isArray(result.errors)).toBe(true)
      expect(Array.isArray(result.warnings)).toBe(true)
    })

    it('应该能够清除缓存', () => {
      expect(() => readonlyDocs.clearCache()).not.toThrow()
    })
  })

  describe('🍽️ Recipes 适配器', () => {
    it('应该能够获取所有配方', () => {
      const recipes = readonlyRecipes.getAllRecipes()
      expect(Array.isArray(recipes)).toBe(true)
    })

    it('应该能够按分类获取配方', () => {
      const recipes = readonlyRecipes.getRecipesByCategory('test')
      expect(Array.isArray(recipes)).toBe(true)
    })

    it('应该能够搜索配方', () => {
      const recipes = readonlyRecipes.searchRecipes('test')
      expect(Array.isArray(recipes)).toBe(true)
    })

    it('应该能够验证一致性', () => {
      const result = readonlyRecipes.validateConsistency()
      expect(typeof result.valid).toBe('boolean')
      expect(Array.isArray(result.errors)).toBe(true)
      expect(Array.isArray(result.warnings)).toBe(true)
    })
  })

  describe('🌐 I18n 适配器', () => {
    it('应该能够获取当前语言环境', () => {
      const locale = readonlyI18n.getLocale()
      expect(typeof locale).toBe('string')
      expect(['zh-CN', 'en-US', 'ja-JP']).toContain(locale)
    })

    it('应该能够获取翻译', () => {
      const translation = readonlyI18n.t('test.key')
      expect(typeof translation).toBe('string')
    })

    it('应该能够获取带参数的翻译', () => {
      const translation = readonlyI18n.tWithParams('test.key', { name: 'test' })
      expect(typeof translation).toBe('string')
    })

    it('应该能够验证一致性', () => {
      const result = readonlyI18n.validateConsistency()
      expect(typeof result.valid).toBe('boolean')
      expect(Array.isArray(result.errors)).toBe(true)
      expect(Array.isArray(result.warnings)).toBe(true)
    })
  })

  describe('🔍 验证工具', () => {
    it('应该能够执行完整验证', () => {
      const report = validateAllConsistency()
      expect(report).toBeDefined()
      expect(report.timestamp).toBeDefined()
      expect(report.summary).toBeDefined()
      expect(typeof report.summary.isValid).toBe('boolean')
      expect(typeof report.summary.totalErrors).toBe('number')
      expect(typeof report.summary.totalWarnings).toBe('number')
      expect(report.performance).toBeDefined()
      expect(typeof report.performance.totalTime).toBe('number')
    })

    it('应该能够检查健康状态', () => {
      const health = checkDataLayerHealth()
      expect(health).toBeDefined()
      expect(typeof health.healthy).toBe('boolean')
      expect(typeof health.errors).toBe('number')
      expect(typeof health.warnings).toBe('number')
      expect(health.stats).toBeDefined()
      expect(health.lastValidated).toBeDefined()
      expect(health.performance).toBeDefined()
    })

    it('应该能够获取统计信息', () => {
      const stats = getDataLayerStats()
      expect(stats).toBeDefined()
      expect(stats.components).toBeDefined()
      expect(stats.tokens).toBeDefined()
      expect(stats.docs).toBeDefined()
      expect(stats.recipes).toBeDefined()
      expect(stats.i18n).toBeDefined()
    })
  })

  describe('🛡️ 错误处理', () => {
    it('应该正确处理 DataError', () => {
      const error = new DataError(DataErrorCode.NOT_FOUND, 'Test error', { details: 'test' })
      expect(error.code).toBe(DataErrorCode.NOT_FOUND)
      expect(error.message).toBe('Test error')
      expect(error.details).toEqual({ details: 'test' })
      expect(error.name).toBe('DataError')
    })

    it('应该正确定义所有错误代码', () => {
      expect(DataErrorCode.VALIDATION_ERROR).toBe('VALIDATION_ERROR')
      expect(DataErrorCode.NOT_FOUND).toBe('NOT_FOUND')
      expect(DataErrorCode.PERMISSION_DENIED).toBe('PERMISSION_DENIED')
      expect(DataErrorCode.NETWORK_ERROR).toBe('NETWORK_ERROR')
      expect(DataErrorCode.PARSE_ERROR).toBe('PARSE_ERROR')
      expect(DataErrorCode.CACHE_ERROR).toBe('CACHE_ERROR')
      expect(DataErrorCode.CONFIG_ERROR).toBe('CONFIG_ERROR')
      expect(DataErrorCode.UNKNOWN_ERROR).toBe('UNKNOWN_ERROR')
    })
  })

  describe('🔄 集成测试', () => {
    it('应该能够跨适配器操作', () => {
      // 获取组件
      const components = readonlyRegistry.getComponents()
      expect(Array.isArray(components)).toBe(true)

      // 获取令牌
      const tokens = readonlyTokens.getDesignTokens()
      expect(tokens).toBeDefined()

      // 获取文档
      const docs = readonlyDocs.getDocumentIndex()
      expect(Array.isArray(docs)).toBe(true)

      // 执行验证
      const report = validateAllConsistency()
      expect(report).toBeDefined()
    })

    it('应该保持数据一致性', () => {
      // 多次获取相同数据应该返回一致的结果
      const components1 = readonlyRegistry.getComponents()
      const components2 = readonlyRegistry.getComponents()
      expect(components1).toEqual(components2)

      const tokens1 = readonlyTokens.getDesignTokens()
      const tokens2 = readonlyTokens.getDesignTokens()
      expect(tokens1).toEqual(tokens2)
    })
  })
})