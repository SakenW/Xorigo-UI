import { useI18nContext } from './I18nProvider'
import type { Namespace } from '../types/core'

/**
 * useI18n Hook 选项
 */
export interface UseI18nOptions {
  /** 命名空间 */
  namespace?: Namespace
}

/**
 * useI18n Hook
 *
 * 提供完整的国际化功能：
 * - 翻译文本获取 (t)
 * - 语言切换 (changeLocale)
 * - 数字格式化 (formatNumber)
 * - 日期格式化 (formatDate)
 * - 复数处理 (pluralize)
 *
 * @example
 * ```tsx
 * function Component() {
 *   const { t, locale, changeLocale } = useI18n({ namespace: 'common' })
 *
 *   return (
 *     <div>
 *       <h1>{t('title')}</h1>
 *       <button onClick={() => changeLocale('en-US')}>
 *         Switch to English
 *       </button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useI18n(options: UseI18nOptions = {}) {
  const context = useI18nContext()
  const { namespace } = options

  // 如果指定了命名空间，创建带命名空间的翻译函数
  const t = (key: string, params?: Record<string, any>) => {
    const fullKey = namespace ? `${namespace}:${key}` : key
    return context.t(fullKey, params)
  }

  return {
    /** 当前语言 */
    locale: context.locale,
    /** 翻译函数 */
    t,
    /** 切换语言 */
    changeLocale: context.changeLocale,
    /** 数字格式化 */
    formatNumber: context.formatNumber,
    /** 日期格式化 */
    formatDate: context.formatDate,
    /** 复数处理 */
    pluralize: context.pluralize,
    /** 支持的语言列表 */
    supportedLocales: context.supportedLocales,
    /** 检查键是否存在 */
    exists: (key: string) => {
      const fullKey = namespace ? `${namespace}:${key}` : key
      return context.exists(fullKey)
    },
    /** I18n 管理器实例 */
    i18n: context.i18n,
  }
}

export default useI18n
