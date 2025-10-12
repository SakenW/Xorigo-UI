import { describe, it, expect, beforeEach } from 'vitest'
import { I18nManager } from '../../src/core/I18nManager'

describe('I18nManager', () => {
  let i18n: I18nManager

  beforeEach(() => {
    i18n = I18nManager.getInstance({
      defaultLocale: 'zh-CN',
      supportedLocales: ['zh-CN', 'en-US'],
      namespaces: ['common'],
    })
  })

  describe('单例模式', () => {
    it('应该返回同一个实例', () => {
      const instance1 = I18nManager.getInstance()
      const instance2 = I18nManager.getInstance()
      expect(instance1).toBe(instance2)
    })
  })

  describe('语言检测', () => {
    it('应该检测默认语言', () => {
      const locale = i18n.detectLocale()
      expect(['zh-CN', 'en-US']).toContain(locale)
    })

    it('应该返回当前语言', () => {
      const locale = i18n.getLocale()
      expect(locale).toBe('zh-CN')
    })
  })

  describe('翻译功能', () => {
    it('应该返回翻译文本', async () => {
      await i18n.initialize('zh-CN')
      const text = i18n.t('actions.save', undefined, { namespace: 'common' })
      expect(text).toBe('保存')
    })

    it('应该处理插值', async () => {
      await i18n.initialize('zh-CN')
      const text = i18n.t('time.minutes_ago', { count: 5 })
      expect(text).toBe('5 分钟前')
    })

    it('应该返回键名当翻译不存在时', async () => {
      await i18n.initialize('zh-CN')
      const text = i18n.t('nonexistent.key')
      expect(text).toBe('nonexistent.key')
    })
  })

  describe('数字格式化', () => {
    it('应该格式化数字', () => {
      const formatted = i18n.formatNumber(1234.56)
      expect(formatted).toContain('1')
      expect(formatted).toContain('234')
    })

    it('应该格式化货币', () => {
      const formatted = i18n.formatNumber(1234.56, {
        style: 'currency',
        currency: 'CNY',
      })
      expect(formatted).toContain('1,234.56')
    })
  })

  describe('日期格式化', () => {
    it('应该格式化日期', () => {
      const date = new Date('2024-01-01')
      const formatted = i18n.formatDate(date)
      expect(formatted).toContain('2024')
    })

    it('应该支持不同的日期格式选项', () => {
      const date = new Date('2024-01-01')
      const formatted = i18n.formatDate(date, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      expect(formatted.length).toBeGreaterThan(0)
    })
  })

  describe('复数处理', () => {
    it('应该处理复数规则', async () => {
      await i18n.initialize('zh-CN')
      // 中文没有复数变化
      const text = i18n.pluralize('items', 1)
      expect(text).toBeDefined()
    })
  })

  describe('命名空间', () => {
    it('应该支持命名空间前缀', async () => {
      await i18n.initialize('zh-CN')
      const text = i18n.t('common:actions.save')
      expect(text).toBe('保存')
    })

    it('应该检查键是否存在', async () => {
      await i18n.initialize('zh-CN')
      const exists = i18n.exists('actions.save', { namespace: 'common' })
      expect(exists).toBe(true)
    })
  })
})
