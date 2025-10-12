/**
 * 支持的语言类型
 */
export type Locale = 'zh-CN' | 'zh-TW' | 'en-US' | 'ja-JP'

/**
 * 翻译键类型（支持点分隔和命名空间前缀）
 * 例如：'common:actions.save' 或 'matrix.title'
 */
export type TranslationKey = string

/**
 * 语言包消息类型（嵌套对象结构）
 */
export type LocaleMessages = Record<string, any>

/**
 * 命名空间类型
 */
export type Namespace = 'common' | 'matrix' | 'gallery' | 'adoption' | 'playground'

/**
 * 翻译选项
 */
export interface TranslationOptions {
  /** 目标语言（可选） */
  locale?: Locale
  /** 命名空间（可选） */
  namespace?: Namespace
  /** 插值参数 */
  params?: Record<string, any>
}

/**
 * I18n 配置接口
 */
export interface I18nConfig {
  /** 默认语言 */
  defaultLocale: Locale
  /** 支持的语言列表 */
  supportedLocales: Locale[]
  /** 回退语言 */
  fallbackLocale: Locale
  /** 默认命名空间列表 */
  namespaces: Namespace[]
  /** 插值配置 */
  interpolation?: {
    /** 插值前缀（默认 {{） */
    prefix?: string
    /** 插值后缀（默认 }}） */
    suffix?: string
  }
}

/**
 * 格式化选项
 */
export interface FormatOptions {
  /** 日期时间格式化选项 */
  dateTime?: Intl.DateTimeFormatOptions
  /** 数字格式化选项 */
  number?: Intl.NumberFormatOptions
}
