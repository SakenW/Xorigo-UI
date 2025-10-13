/**
 * @fileoverview I18n 只读适配层 - 国际化数据访问
 * 提供对国际化翻译数据的只读访问
 * 支持嵌套键值查询和占位符替换
 */

import { readFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'
import { type ValidationResult } from './types'

/**
 * 翻译数据类型 (支持嵌套)
 */
export type TranslationValue = string | Record<string, TranslationValue>

/**
 * I18n 配置
 */
export interface I18nConfig {
  defaultLocale: string
  supportedLocales: string[]
  fallbackLocale?: string
  translationsPath?: string
}

/**
 * I18n 只读适配器类 (Singleton)
 */
class I18nReadonlyAdapter {
  private static instance: I18nReadonlyAdapter
  private translations: Map<string, Record<string, TranslationValue>> = new Map()
  private config: I18nConfig = {
    defaultLocale: 'zh-CN',
    supportedLocales: ['zh-CN', 'en-US'],
    fallbackLocale: 'zh-CN',
  }
  private validated: boolean = false

  private constructor() {}

  static getInstance(): I18nReadonlyAdapter {
    if (!I18nReadonlyAdapter.instance) {
      I18nReadonlyAdapter.instance = new I18nReadonlyAdapter()
    }
    return I18nReadonlyAdapter.instance
  }

  /**
   * 设置配置
   */
  setConfig(config: Partial<I18nConfig>): void {
    this.config = { ...this.config, ...config }
    // 重置已加载的翻译
    this.translations.clear()
    this.validated = false
  }

  /**
   * 获取配置
   */
  getConfig(): I18nConfig {
    return { ...this.config }
  }

  /**
   * 初始化翻译数据
   */
  private ensureLoaded(): void {
    if (this.translations.size > 0) {
      return
    }

    try {
      // 尝试从 packages/i18n 或自定义路径加载
      const i18nBasePath =
        this.config.translationsPath || join(process.cwd(), '../../packages/i18n/src')

      // 如果目录不存在,使用内置默认翻译
      if (!existsSync(i18nBasePath)) {
        this.loadDefaultTranslations()
        return
      }

      // 加载所有支持的语言
      this.config.supportedLocales.forEach((locale) => {
        const localePath = join(i18nBasePath, `${locale}.json`)
        if (existsSync(localePath)) {
          const content = readFileSync(localePath, 'utf-8')
          const data = JSON.parse(content)
          this.translations.set(locale, data)
        } else {
          console.warn(`Translation file not found for locale: ${locale}`)
        }
      })

      // 如果没有加载到任何翻译,使用默认翻译
      if (this.translations.size === 0) {
        this.loadDefaultTranslations()
      }
    } catch (error) {
      console.error('加载 I18n 失败:', error)
      this.loadDefaultTranslations()
    }
  }

  /**
   * 加载默认翻译 (内置 fallback)
   */
  private loadDefaultTranslations(): void {
    // 中文默认翻译
    this.translations.set('zh-CN', {
      common: {
        loading: '加载中...',
        error: '错误',
        success: '成功',
        cancel: '取消',
        confirm: '确认',
        search: '搜索',
        filter: '筛选',
      },
      components: {
        button: '按钮',
        card: '卡片',
        input: '输入框',
        modal: '对话框',
      },
    })

    // 英文默认翻译
    this.translations.set('en-US', {
      common: {
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        confirm: 'Confirm',
        search: 'Search',
        filter: 'Filter',
      },
      components: {
        button: 'Button',
        card: 'Card',
        input: 'Input',
        modal: 'Modal',
      },
    })
  }

  /**
   * 根据键获取翻译 (支持嵌套键 "common.loading")
   */
  getTranslation(key: string, locale?: string): string {
    this.ensureLoaded()

    const targetLocale = locale || this.config.defaultLocale
    const translations = this.translations.get(targetLocale)

    if (!translations) {
      // 尝试使用 fallback locale
      const fallbackTranslations = this.translations.get(
        this.config.fallbackLocale || this.config.defaultLocale,
      )
      if (!fallbackTranslations) {
        return key // 返回键本身作为 fallback
      }
      return this.getNestedValue(fallbackTranslations, key) || key
    }

    return this.getNestedValue(translations, key) || key
  }

  /**
   * 根据键获取翻译 (带占位符替换)
   */
  getTranslationWithParams(
    key: string,
    params: Record<string, string | number>,
    locale?: string,
  ): string {
    let translation = this.getTranslation(key, locale)

    // 替换占位符 {{name}}
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      translation = translation.replace(
        new RegExp(`{{${paramKey}}}`, 'g'),
        String(paramValue),
      )
    })

    return translation
  }

  /**
   * 获取嵌套对象值
   */
  private getNestedValue(obj: Record<string, any>, path: string): string | undefined {
    const keys = path.split('.')
    let current: any = obj

    for (const key of keys) {
      if (current === null || current === undefined) {
        return undefined
      }
      current = current[key]
    }

    return typeof current === 'string' ? current : undefined
  }

  /**
   * 获取指定语言的所有翻译
   */
  getAllTranslations(locale?: string): Record<string, TranslationValue> | undefined {
    this.ensureLoaded()
    const targetLocale = locale || this.config.defaultLocale
    return this.translations.get(targetLocale)
  }

  /**
   * 检查键是否存在
   */
  hasTranslation(key: string, locale?: string): boolean {
    this.ensureLoaded()
    const targetLocale = locale || this.config.defaultLocale
    const translations = this.translations.get(targetLocale)
    if (!translations) return false
    return this.getNestedValue(translations, key) !== undefined
  }

  /**
   * 获取所有支持的语言
   */
  getSupportedLocales(): string[] {
    return [...this.config.supportedLocales]
  }

  /**
   * 获取默认语言
   */
  getDefaultLocale(): string {
    return this.config.defaultLocale
  }

  /**
   * 获取 fallback 语言
   */
  getFallbackLocale(): string {
    return this.config.fallbackLocale || this.config.defaultLocale
  }

  /**
   * 获取翻译统计信息
   */
  getStatistics() {
    this.ensureLoaded()

    const stats: Record<
      string,
      {
        totalKeys: number
        categories: string[]
      }
    > = {}

    this.translations.forEach((translations, locale) => {
      stats[locale] = {
        totalKeys: this.countKeys(translations),
        categories: Object.keys(translations),
      }
    })

    return stats
  }

  /**
   * 递归计算键的数量
   */
  private countKeys(obj: Record<string, any>): number {
    let count = 0
    for (const value of Object.values(obj)) {
      if (typeof value === 'string') {
        count++
      } else if (typeof value === 'object' && value !== null) {
        count += this.countKeys(value)
      }
    }
    return count
  }

  /**
   * 验证 I18n 数据一致性
   */
  validateConsistency(): ValidationResult {
    this.ensureLoaded()

    const results: ValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
    }

    // 验证支持的语言是否都有翻译数据
    this.config.supportedLocales.forEach((locale) => {
      if (!this.translations.has(locale)) {
        results.warnings.push({
          type: 'missing-locale',
          message: `缺少语言翻译数据: ${locale}`,
        })
      }
    })

    // 验证默认语言是否存在
    if (!this.translations.has(this.config.defaultLocale)) {
      results.valid = false
      results.errors.push({
        type: 'missing-default-locale',
        message: `默认语言翻译数据不存在: ${this.config.defaultLocale}`,
      })
    }

    // 验证所有语言的键结构一致性
    if (this.translations.size > 1) {
      const baseLocale = this.config.defaultLocale
      const baseTranslations = this.translations.get(baseLocale)

      if (baseTranslations) {
        const baseKeys = this.getAllKeys(baseTranslations)

        this.translations.forEach((translations, locale) => {
          if (locale === baseLocale) return

          const localeKeys = this.getAllKeys(translations)

          // 检查缺失的键
          const missingKeys = baseKeys.filter((key) => !localeKeys.includes(key))
          if (missingKeys.length > 0) {
            results.warnings.push({
              type: 'missing-keys',
              message: `语言 ${locale} 缺少 ${missingKeys.length} 个翻译键`,
              path: `${locale}: ${missingKeys.slice(0, 3).join(', ')}${missingKeys.length > 3 ? '...' : ''}`,
            })
          }

          // 检查多余的键
          const extraKeys = localeKeys.filter((key) => !baseKeys.includes(key))
          if (extraKeys.length > 0) {
            results.warnings.push({
              type: 'extra-keys',
              message: `语言 ${locale} 有 ${extraKeys.length} 个多余的翻译键`,
              path: `${locale}: ${extraKeys.slice(0, 3).join(', ')}${extraKeys.length > 3 ? '...' : ''}`,
            })
          }
        })
      }
    }

    this.validated = true
    return results
  }

  /**
   * 递归获取所有键路径
   */
  private getAllKeys(obj: Record<string, any>, prefix = ''): string[] {
    const keys: string[] = []

    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key

      if (typeof value === 'string') {
        keys.push(fullKey)
      } else if (typeof value === 'object' && value !== null) {
        keys.push(...this.getAllKeys(value, fullKey))
      }
    }

    return keys
  }
}

// 导出单例实例
export const readonlyI18n = I18nReadonlyAdapter.getInstance()

// 导出类型
export type { I18nConfig, TranslationValue, ValidationResult }

/**
 * 构建时一致性校验
 */
export function validateI18nConsistency(): ValidationResult {
  return readonlyI18n.validateConsistency()
}

/**
 * 便捷方法: 获取翻译 (t函数)
 */
export function t(key: string, locale?: string): string {
  return readonlyI18n.getTranslation(key, locale)
}

/**
 * 便捷方法: 获取带参数的翻译
 */
export function tWithParams(
  key: string,
  params: Record<string, string | number>,
  locale?: string,
): string {
  return readonlyI18n.getTranslationWithParams(key, params, locale)
}
