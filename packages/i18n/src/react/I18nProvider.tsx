'use client'

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { I18nManager } from '../core/I18nManager'
import type { Locale, Namespace } from '../types/core'

/**
 * I18n Context 值类型
 */
export interface I18nContextValue {
  /** 当前语言 */
  locale: Locale
  /** 翻译函数 */
  t: (key: string, params?: Record<string, any>) => string
  /** 切换语言 */
  changeLocale: (locale: Locale) => Promise<void>
  /** 数字格式化 */
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string
  /** 日期格式化 */
  formatDate: (value: Date | number | string, options?: Intl.DateTimeFormatOptions) => string
  /** 复数处理 */
  pluralize: (key: string, count: number, params?: Record<string, any>) => string
  /** 支持的语言列表 */
  supportedLocales: Locale[]
  /** 检查键是否存在 */
  exists: (key: string) => boolean
  /** I18n 管理器实例 */
  i18n: I18nManager
}

/**
 * I18n Context
 *
 * 使用 React 19 Context API 创建全局国际化上下文
 */
const I18nContext = createContext<I18nContextValue | null>(null)

/**
 * I18nProvider Props
 */
export interface I18nProviderProps {
  /** 子组件 */
  children: React.ReactNode
  /** 初始语言 */
  locale?: Locale
  /** 默认命名空间 */
  namespace?: Namespace
  /** 语言变更回调 */
  onLocaleChange?: (locale: Locale) => void
}

/**
 * I18nProvider 组件
 *
 * 提供全局国际化上下文，支持：
 * - 语言切换
 * - 翻译文本获取
 * - 数字和日期格式化
 * - 复数处理
 *
 * @example
 * ```tsx
 * <I18nProvider locale="zh-CN">
 *   <App />
 * </I18nProvider>
 * ```
 */
export const I18nProvider: React.FC<I18nProviderProps> = ({
  children,
  locale: initialLocale,
  namespace,
  onLocaleChange,
}) => {
  const [currentLocale, setCurrentLocale] = useState<Locale>(() => {
    return initialLocale || 'zh-CN'
  })

  const [isInitialized, setIsInitialized] = useState(false)

  // 获取 I18nManager 实例
  const i18n = useMemo(() => {
    return I18nManager.getInstance({
      defaultLocale: initialLocale || 'zh-CN',
      namespaces: namespace ? [namespace] : ['common'],
    })
  }, [initialLocale, namespace])

  // 初始化
  useEffect(() => {
    i18n.initialize(initialLocale).then(() => {
      setCurrentLocale(i18n.getLocale())
      setIsInitialized(true)
    })
  }, [i18n, initialLocale])

  // 监听语言变更
  useEffect(() => {
    const unsubscribe = i18n.onLocaleChange((newLocale) => {
      setCurrentLocale(newLocale)
      onLocaleChange?.(newLocale)
    })

    return unsubscribe
  }, [i18n, onLocaleChange])

  // 切换语言
  const changeLocale = useCallback(
    async (newLocale: Locale) => {
      await i18n.changeLocale(newLocale)
    },
    [i18n]
  )

  // 翻译函数
  const t = useCallback(
    (key: string, params?: Record<string, any>) => {
      return i18n.t(key, params, { namespace })
    },
    [i18n, namespace]
  )

  // 数字格式化
  const formatNumber = useCallback(
    (value: number, options?: Intl.NumberFormatOptions) => {
      return i18n.formatNumber(value, options)
    },
    [i18n]
  )

  // 日期格式化
  const formatDate = useCallback(
    (value: Date | number | string, options?: Intl.DateTimeFormatOptions) => {
      return i18n.formatDate(value, options)
    },
    [i18n]
  )

  // 复数处理
  const pluralize = useCallback(
    (key: string, count: number, params?: Record<string, any>) => {
      return i18n.pluralize(key, count, params)
    },
    [i18n]
  )

  // 检查键是否存在
  const exists = useCallback(
    (key: string) => {
      return i18n.exists(key, { namespace })
    },
    [i18n, namespace]
  )

  // Context 值
  const value = useMemo<I18nContextValue>(
    () => ({
      locale: currentLocale,
      t,
      changeLocale,
      formatNumber,
      formatDate,
      pluralize,
      supportedLocales: i18n.getSupportedLocales(),
      exists,
      i18n,
    }),
    [currentLocale, t, changeLocale, formatNumber, formatDate, pluralize, exists, i18n]
  )

  // 等待初始化完成
  if (!isInitialized) {
    return null
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

/**
 * useI18nContext Hook
 *
 * 获取 I18n Context 值
 * @throws 如果在 I18nProvider 外部使用会抛出错误
 */
export const useI18nContext = (): I18nContextValue => {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18nContext must be used within an I18nProvider')
  }
  return context
}

export default I18nProvider
