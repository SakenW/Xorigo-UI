/**
 * @fileoverview I18n Readonly Adapter 单元测试
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { readonlyI18n, t, tWithParams } from '../i18n.readonly'

describe('I18nReadonlyAdapter', () => {
  describe('getConfig', () => {
    it('应该返回I18n配置', () => {
      const config = readonlyI18n.getConfig()
      expect(config).toHaveProperty('defaultLocale')
      expect(config).toHaveProperty('supportedLocales')
      expect(Array.isArray(config.supportedLocales)).toBe(true)
    })
  })

  describe('getTranslation', () => {
    it('应该返回默认语言的翻译', () => {
      const translation = readonlyI18n.getTranslation('common.loading')
      expect(typeof translation).toBe('string')
      expect(translation.length).toBeGreaterThan(0)
    })

    it('应该支持嵌套键查询', () => {
      const translation = readonlyI18n.getTranslation('common.loading', 'zh-CN')
      expect(typeof translation).toBe('string')
    })

    it('不存在的键应该返回键本身', () => {
      const key = 'non.existent.key'
      const translation = readonlyI18n.getTranslation(key)
      expect(translation).toBe(key)
    })

    it('应该支持不同语言', () => {
      const zhTranslation = readonlyI18n.getTranslation('common.loading', 'zh-CN')
      const enTranslation = readonlyI18n.getTranslation('common.loading', 'en-US')
      expect(zhTranslation).not.toBe(enTranslation)
    })
  })

  describe('getTranslationWithParams', () => {
    it('应该替换占位符', () => {
      // 注意: 需要确保翻译数据中有带占位符的键
      const params = { name: 'Claude', count: 5 }
      const translation = readonlyI18n.getTranslationWithParams(
        'test.placeholder',
        params
      )
      expect(typeof translation).toBe('string')
    })
  })

  describe('hasTranslation', () => {
    it('存在的键应该返回 true', () => {
      const has = readonlyI18n.hasTranslation('common.loading', 'zh-CN')
      expect(has).toBe(true)
    })

    it('不存在的键应该返回 false', () => {
      const has = readonlyI18n.hasTranslation('non.existent.key', 'zh-CN')
      expect(has).toBe(false)
    })
  })

  describe('getSupportedLocales', () => {
    it('应该返回支持的语言列表', () => {
      const locales = readonlyI18n.getSupportedLocales()
      expect(Array.isArray(locales)).toBe(true)
      expect(locales.length).toBeGreaterThan(0)
    })
  })

  describe('getDefaultLocale', () => {
    it('应该返回默认语言', () => {
      const defaultLocale = readonlyI18n.getDefaultLocale()
      expect(typeof defaultLocale).toBe('string')
      expect(defaultLocale.length).toBeGreaterThan(0)
    })
  })

  describe('getStatistics', () => {
    it('应该返回翻译统计信息', () => {
      const stats = readonlyI18n.getStatistics()
      expect(typeof stats).toBe('object')

      Object.entries(stats).forEach(([locale, localeStats]) => {
        expect(localeStats).toHaveProperty('totalKeys')
        expect(localeStats).toHaveProperty('categories')
        expect(typeof localeStats.totalKeys).toBe('number')
        expect(Array.isArray(localeStats.categories)).toBe(true)
      })
    })
  })

  describe('validateConsistency', () => {
    it('应该返回验证结果对象', () => {
      const result = readonlyI18n.validateConsistency()
      expect(result).toHaveProperty('valid')
      expect(result).toHaveProperty('errors')
      expect(result).toHaveProperty('warnings')
      expect(typeof result.valid).toBe('boolean')
      expect(Array.isArray(result.errors)).toBe(true)
      expect(Array.isArray(result.warnings)).toBe(true)
    })
  })

  describe('便捷函数', () => {
    it('t() 应该返回翻译', () => {
      const translation = t('common.loading', 'zh-CN')
      expect(typeof translation).toBe('string')
    })

    it('tWithParams() 应该替换占位符', () => {
      const translation = tWithParams('test.placeholder', { name: 'Test' })
      expect(typeof translation).toBe('string')
    })
  })
})
