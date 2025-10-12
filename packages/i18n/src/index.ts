/**
 * @th-ui/i18n - Xorigo UI 国际化解决方案
 *
 * 轻量级、类型安全的国际化库，专为 Xorigo UI 设计
 *
 * @example
 * ```tsx
 * import { I18nManager } from '@th-ui/i18n'
 *
 * const i18n = I18nManager.getInstance({
 *   defaultLocale: 'zh-CN',
 *   supportedLocales: ['zh-CN', 'en-US'],
 * })
 *
 * await i18n.initialize()
 * console.log(i18n.t('common:actions.save')) // "保存"
 * ```
 */

// 核心导出
export { I18nManager } from './core/I18nManager'
export type {
  Locale,
  Namespace,
  TranslationKey,
  LocaleMessages,
  I18nConfig,
  TranslationOptions,
  FormatOptions,
} from './types/core'

// 默认导出
export { I18nManager as default } from './core/I18nManager'
