/**
 * 🎭 国际化系统 - v2025.11.03
 *
 * 文案方向、数字/日期格式配置
 * 多语言支持、RTL/LTR 书写方向
 *
 * @version 2025.11.03
 * @category System
 * @layer system
 */

import React, { createContext, useContext, useEffect, useState } from 'react'

/**
 * 语言类型
 */
export type Language = 'zh-CN' | 'zh-TW' | 'en-US' | 'ja-JP' | 'ko-KR' | 'ar-SA' | 'he-IL' | 'de-DE' | 'fr-FR' | 'es-ES'

/**
 * 书写方向类型
 */
export type TextDirection = 'ltr' | 'rtl' | 'auto'

/**
 * 地区配置接口
 */
export interface LocaleConfig {
  language: Language
  direction: TextDirection
  dateFormat: string
  timeFormat: '12h' | '24h'
  numberFormat: {
    decimal: string
    thousands: string
    currency: string
  }
  calendar: 'gregorian' | 'islamic' | 'hebrew' | 'chinese'
}

/**
 * 国际化上下文接口
 */
export interface I18nContextValue {
  locale: LocaleConfig
  setLanguage: (language: Language) => void
  setDirection: (direction: TextDirection) => void
  t: (key: string, params?: Record<string, string | number>) => string
  formatDate: (date: Date, format?: string) => string
  formatTime: (date: Date, format?: '12h' | '24h') => string
  formatNumber: (number: number, options?: Intl.NumberFormatOptions) => string
  formatCurrency: (amount: number, currency?: string) => string
  isRTL: boolean
  getTextDirection: () => 'ltr' | 'rtl'
}

/**
 * 默认地区配置
 */
export const defaultLocaleConfig: LocaleConfig = {
  language: 'zh-CN',
  direction: 'ltr',
  dateFormat: 'YYYY-MM-DD',
  timeFormat: '24h',
  numberFormat: {
    decimal: '.',
    thousands: ',',
    currency: '¥'
  },
  calendar: 'gregorian'
}

/**
 * 地区配置映射
 */
export const localeConfigs: Record<Language, LocaleConfig> = {
  'zh-CN': {
    language: 'zh-CN',
    direction: 'ltr',
    dateFormat: 'YYYY年MM月DD日',
    timeFormat: '24h',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      currency: '¥'
    },
    calendar: 'gregorian'
  },
  'zh-TW': {
    language: 'zh-TW',
    direction: 'ltr',
    dateFormat: 'YYYY年MM月DD日',
    timeFormat: '12h',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      currency: 'NT$'
    },
    calendar: 'gregorian'
  },
  'en-US': {
    language: 'en-US',
    direction: 'ltr',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      currency: '$'
    },
    calendar: 'gregorian'
  },
  'ja-JP': {
    language: 'ja-JP',
    direction: 'ltr',
    dateFormat: 'YYYY年MM月DD日',
    timeFormat: '24h',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      currency: '¥'
    },
    calendar: 'gregorian'
  },
  'ko-KR': {
    language: 'ko-KR',
    direction: 'ltr',
    dateFormat: 'YYYY년 MM월 DD일',
    timeFormat: '24h',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      currency: '₩'
    },
    calendar: 'gregorian'
  },
  'ar-SA': {
    language: 'ar-SA',
    direction: 'rtl',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
    numberFormat: {
      decimal: '٫',
      thousands: '٬',
      currency: 'ر.س'
    },
    calendar: 'islamic'
  },
  'he-IL': {
    language: 'he-IL',
    direction: 'rtl',
    dateFormat: 'DD.MM.YYYY',
    timeFormat: '24h',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      currency: '₪'
    },
    calendar: 'hebrew'
  },
  'de-DE': {
    language: 'de-DE',
    direction: 'ltr',
    dateFormat: 'DD.MM.YYYY',
    timeFormat: '24h',
    numberFormat: {
      decimal: ',',
      thousands: '.',
      currency: '€'
    },
    calendar: 'gregorian'
  },
  'fr-FR': {
    language: 'fr-FR',
    direction: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    numberFormat: {
      decimal: ',',
      thousands: ' ',
      currency: '€'
    },
    calendar: 'gregorian'
  },
  'es-ES': {
    language: 'es-ES',
    direction: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    numberFormat: {
      decimal: ',',
      thousands: '.',
      currency: '€'
    },
    calendar: 'gregorian'
  }
}

/**
 * 国际化上下文
 */
export const I18nContext = createContext<I18nContextValue | undefined>(undefined)

/**
 * 国际化提供者组件
 */
export function I18nProvider({
  children,
  defaultLanguage = 'zh-CN',
  storageKey = 'xorigo-ui-locale',
  translations = {}
}: {
  children: React.ReactNode
  defaultLanguage?: Language
  storageKey?: string
  translations?: Record<string, Record<string, string>>
}) {
  const [locale, setLocale] = useState<LocaleConfig>(() => {
    // 从本地存储加载
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const savedLanguage = JSON.parse(stored) as Language
        return localeConfigs[savedLanguage] || localeConfigs[defaultLanguage]
      }
    } catch (error) {
      console.warn('Failed to load locale from localStorage:', error)
    }

    // 检测浏览器语言
    const browserLanguage = navigator.language as Language
    if (localeConfigs[browserLanguage]) {
      return localeConfigs[browserLanguage]
    }

    // 使用默认语言
    return localeConfigs[defaultLanguage]
  })

  // 保存到本地存储
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(locale.language))
    } catch (error) {
      console.warn('Failed to save locale to localStorage:', error)
    }
  }, [locale.language, storageKey])

  // 应用到 DOM
  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('lang', locale.language)
    root.setAttribute('dir', locale.direction)
    root.setAttribute('data-text-direction', locale.direction)
  }, [locale])

  const setLanguage = (language: Language) => {
    setLocale(localeConfigs[language])
  }

  const setDirection = (direction: TextDirection) => {
    setLocale(prev => ({ ...prev, direction }))
  }

  const t = (key: string, params?: Record<string, string | number>): string => {
    const translation = translations[locale.language]?.[key] || key

    if (!params) return translation

    // 替换参数
    return translation.replace(/\{\{(\w+)\}\}/g, (match, param) => {
      return params[param]?.toString() || match
    })
  }

  const formatDate = (date: Date, format?: string): string => {
    const formatString = format || locale.dateFormat

    try {
      const options: Intl.DateTimeFormatOptions = {}

      if (formatString.includes('YYYY')) options.year = 'numeric'
      if (formatString.includes('MM')) options.month = '2-digit'
      if (formatString.includes('DD')) options.day = '2-digit'

      return new Intl.DateTimeFormat(locale.language, options).format(date)
    } catch (error) {
      console.warn('Date formatting error:', error)
      return date.toLocaleDateString(locale.language)
    }
  }

  const formatTime = (date: Date, format?: '12h' | '24h'): string => {
    const timeFormat = format || locale.timeFormat

    try {
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: timeFormat === '12h'
      }

      return new Intl.DateTimeFormat(locale.language, options).format(date)
    } catch (error) {
      console.warn('Time formatting error:', error)
      return date.toLocaleTimeString(locale.language)
    }
  }

  const formatNumber = (number: number, options?: Intl.NumberFormatOptions): string => {
    try {
      return new Intl.NumberFormat(locale.language, options).format(number)
    } catch (error) {
      console.warn('Number formatting error:', error)
      return number.toString()
    }
  }

  const formatCurrency = (amount: number, currency?: string): string => {
    try {
      const currencyCode = currency || localeConfigs[locale.language].numberFormat.currency
      return new Intl.NumberFormat(locale.language, {
        style: 'currency',
        currency: currencyCode
      }).format(amount)
    } catch (error) {
      console.warn('Currency formatting error:', error)
      return `${locale.numberFormat.currency}${amount}`
    }
  }

  const isRTL = locale.direction === 'rtl'
  const getTextDirection = (): 'ltr' | 'rtl' => {
    if (locale.direction === 'auto') {
      // 检测文本方向（简化版）
      return localeConfigs[locale.language].direction as 'ltr' | 'rtl'
    }
    return locale.direction as 'ltr' | 'rtl'
  }

  const value: I18nContextValue = {
    locale,
    setLanguage,
    setDirection,
    t,
    formatDate,
    formatTime,
    formatNumber,
    formatCurrency,
    isRTL,
    getTextDirection
  }

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

/**
 * 使用国际化的 Hook
 */
export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

/**
 * RTL/LTR 切换组件
 */
export function DirectionToggle({
  className = ''
}: {
  className?: string
}) {
  const { locale, setDirection } = useI18n()

  const toggleDirection = () => {
    setDirection(locale.direction === 'ltr' ? 'rtl' : 'ltr')
  }

  return (
    <button
      onClick={toggleDirection}
      className={`px-3 py-1 text-sm border rounded ${className}`}
      aria-label={`切换文字方向，当前: ${locale.direction}`}
    >
      {locale.direction === 'rtl' ? 'RTL' : 'LTR'}
    </button>
  )
}

/**
 * 语言选择器组件
 */
export function LanguageSelector({
  className = ''
}: {
  className?: string
}) {
  const { locale, setLanguage } = useI18n()

  return (
    <select
      value={locale.language}
      onChange={(e) => setLanguage(e.target.value as Language)}
      className={`px-3 py-1 text-sm border rounded ${className}`}
      aria-label="选择语言"
    >
      {Object.entries(localeConfigs).map(([code, config]) => (
        <option key={code} value={code}>
          {getLanguageDisplayName(code as Language)}
        </option>
      ))}
    </select>
  )
}

/**
 * 获取语言显示名称
 */
function getLanguageDisplayName(language: Language): string {
  const displayNames: Record<Language, string> = {
    'zh-CN': '简体中文',
    'zh-TW': '繁體中文',
    'en-US': 'English',
    'ja-JP': '日本語',
    'ko-KR': '한국어',
    'ar-SA': 'العربية',
    'he-IL': 'עברית',
    'de-DE': 'Deutsch',
    'fr-FR': 'Français',
    'es-ES': 'Español'
  }

  return displayNames[language] || language
}

/**
 * 国际化工具类
 */
export class I18nHelper {
  /**
   * 检测浏览器语言
   */
  static detectBrowserLanguage(): Language | null {
    const browserLang = navigator.language as Language
    return localeConfigs[browserLang] ? browserLang : null
  }

  /**
   * 获取文字方向
   */
  static getTextDirection(language: Language): 'ltr' | 'rtl' {
    const rtlLanguages = ['ar-SA', 'he-IL', 'fa-IR', 'ur-PK']
    return rtlLanguages.includes(language) ? 'rtl' : 'ltr'
  }

  /**
   * 验证语言代码
   */
  static isValidLanguage(language: string): language is Language {
    return language in localeConfigs
  }

  /**
   * 格式化相对时间
   */
  static formatRelativeTime(
    date: Date,
    locale: Language,
    options?: Intl.RelativeTimeFormatOptions
  ): string {
    try {
      const now = new Date()
      const diffInSeconds = (date.getTime() - now.getTime()) / 1000
      const absDiff = Math.abs(diffInSeconds)

      const rtf = new Intl.RelativeTimeFormat(locale, {
        numeric: 'auto',
        ...options
      })

      if (absDiff < 60) {
        return rtf.format(Math.round(diffInSeconds), 'second')
      } else if (absDiff < 3600) {
        return rtf.format(Math.round(diffInSeconds / 60), 'minute')
      } else if (absDiff < 86400) {
        return rtf.format(Math.round(diffInSeconds / 3600), 'hour')
      } else if (absDiff < 2592000) {
        return rtf.format(Math.round(diffInSeconds / 86400), 'day')
      } else if (absDiff < 31536000) {
        return rtf.format(Math.round(diffInSeconds / 2592000), 'month')
      } else {
        return rtf.format(Math.round(diffInSeconds / 31536000), 'year')
      }
    } catch (error) {
      console.warn('Relative time formatting error:', error)
      return date.toLocaleDateString(locale)
    }
  }

  /**
   * 创建翻译函数
   */
  static createTranslator(
    translations: Record<string, Record<string, string>>,
    defaultLanguage: Language
  ) {
    return (key: string, language?: Language, params?: Record<string, string | number>): string => {
      const lang = language || defaultLanguage
      const translation = translations[lang]?.[key] || translations[defaultLanguage]?.[key] || key

      if (!params) return translation

      return translation.replace(/\{\{(\w+)\}\}/g, (match, param) => {
        return params[param]?.toString() || match
      })
    }
  }

  /**
   * 合并翻译资源
   */
  static mergeTranslations(
    ...translations: Record<string, Record<string, string>>[]
  ): Record<string, Record<string, string>> {
    return translations.reduce((merged, current) => {
      Object.entries(current).forEach(([language, resources]) => {
        if (!merged[language]) {
          merged[language] = {}
        }
        merged[language] = { ...merged[language], ...resources }
      })
      return merged
    }, {} as Record<string, Record<string, string>>)
  }

  /**
   * 获取时区信息
   */
  static getTimezone(locale: Language): string {
    try {
      return Intl.DateTimeFormat(locale).resolvedOptions().timeZone
    } catch (error) {
      return 'UTC'
    }
  }

  /**
   * 检查是否支持某种语言
   */
  static isLanguageSupported(language: string): boolean {
    try {
      return Intl.NumberFormat.supportedLocalesOf(language).length > 0 ||
             Intl.DateTimeFormat.supportedLocalesOf(language).length > 0
    } catch {
      return false
    }
  }
}