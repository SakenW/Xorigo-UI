import { useI18nContext } from './I18nProvider'
import type { Locale } from '../types/core'

/**
 * useLocale Hook
 *
 * 专注于语言切换功能的简化 Hook
 * 适用于只需要语言切换的场景
 *
 * @example
 * ```tsx
 * function LanguageSwitcher() {
 *   const { locale, changeLocale, toggleLocale, isLocale } = useLocale()
 *
 *   return (
 *     <select value={locale} onChange={(e) => changeLocale(e.target.value as Locale)}>
 *       <option value="zh-CN">简体中文</option>
 *       <option value="zh-TW">繁体中文</option>
 *       <option value="en-US">English</option>
 *       <option value="ja-JP">日本語</option>
 *     </select>
 *   )
 * }
 * ```
 */
export function useLocale() {
  const context = useI18nContext()

  /**
   * 检查是否为指定语言
   */
  const isLocale = (targetLocale: Locale) => {
    return context.locale === targetLocale
  }

  /**
   * 切换到下一个语言
   */
  const toggleLocale = async () => {
    const currentIndex = context.supportedLocales.indexOf(context.locale)
    const nextIndex = (currentIndex + 1) % context.supportedLocales.length
    const nextLocale = context.supportedLocales[nextIndex]
    if (nextLocale) {
      await context.changeLocale(nextLocale)
    }
  }

  return {
    /** 当前语言 */
    locale: context.locale,
    /** 切换语言 */
    changeLocale: context.changeLocale,
    /** 切换到下一个语言 */
    toggleLocale,
    /** 支持的语言列表 */
    supportedLocales: context.supportedLocales,
    /** 检查是否为指定语言 */
    isLocale,
  }
}

export default useLocale
