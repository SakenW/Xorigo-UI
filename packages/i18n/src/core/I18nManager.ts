import type {
  Locale,
  LocaleMessages,
  Namespace,
  TranslationKey,
  I18nConfig,
  TranslationOptions,
} from '../types/core'

/**
 * I18nManager 核心类
 *
 * 基于 React 19 最佳实践实现的轻量级国际化管理器
 * - 单例模式确保全局唯一实例
 * - 支持命名空间、插值、复数规则
 * - 使用 Intl API 进行日期和数字格式化
 * - 支持异步语言包加载
 * - 支持 SSR 环境
 */
export class I18nManager {
  private static instance: I18nManager
  private currentLocale: Locale
  private config: I18nConfig
  private resources: Map<Locale, Map<Namespace, LocaleMessages>>
  private formatters: Map<string, Intl.NumberFormat | Intl.DateTimeFormat>

  constructor(config?: Partial<I18nConfig>) {
    this.config = {
      defaultLocale: 'zh-CN',
      supportedLocales: ['zh-CN', 'zh-TW', 'en-US', 'ja-JP'],
      fallbackLocale: 'zh-CN',
      namespaces: ['common'],
      interpolation: {
        prefix: '{{',
        suffix: '}}',
      },
      ...config,
    }

    this.currentLocale = this.config.defaultLocale
    this.resources = new Map()
    this.formatters = new Map()
  }

  /**
   * 获取单例实例
   */
  static getInstance(config?: Partial<I18nConfig>): I18nManager {
    if (!I18nManager.instance) {
      I18nManager.instance = new I18nManager(config)
    }
    return I18nManager.instance
  }

  /**
   * 初始化语言资源
   */
  async initialize(locale?: Locale): Promise<void> {
    const targetLocale = locale || this.detectLocale()
    this.currentLocale = targetLocale

    // 加载默认命名空间
    for (const namespace of this.config.namespaces) {
      await this.loadNamespace(targetLocale, namespace)
    }

    // 加载回退语言包
    if (this.currentLocale !== this.config.fallbackLocale) {
      for (const namespace of this.config.namespaces) {
        await this.loadNamespace(this.config.fallbackLocale, namespace)
      }
    }
  }

  /**
   * 自动检测用户语言
   *
   * 检测优先级：
   * 1. localStorage 存储的语言
   * 2. 浏览器语言设置
   * 3. 默认语言
   */
  detectLocale(): Locale {
    if (typeof window === 'undefined') {
      return this.config.defaultLocale
    }

    // 1. 检查 localStorage
    const stored = localStorage.getItem('th-ui-locale')
    if (stored && this.isSupported(stored)) {
      return stored as Locale
    }

    // 2. 检查浏览器语言
    const browserLang = navigator.language
    const normalizedLang = this.normalizeLocale(browserLang)
    if (this.isSupported(normalizedLang)) {
      return normalizedLang as Locale
    }

    // 3. 回退到默认语言
    return this.config.defaultLocale
  }

  /**
   * 标准化语言代码
   */
  private normalizeLocale(locale: string): string {
    return locale.replace('_', '-')
  }

  /**
   * 检查语言是否支持
   */
  private isSupported(locale: string): boolean {
    return this.config.supportedLocales.includes(locale as Locale)
  }

  /**
   * 加载命名空间资源
   *
   * 使用动态 import 实现异步加载
   */
  async loadNamespace(locale: Locale, namespace: Namespace): Promise<void> {
    if (!this.resources.has(locale)) {
      this.resources.set(locale, new Map())
    }

    const namespaceMap = this.resources.get(locale)!
    if (namespaceMap.has(namespace)) {
      return // 已加载，跳过
    }

    try {
      const messages = await import(`../locales/${locale}/${namespace}.json`)
      namespaceMap.set(namespace, messages.default || messages)
    } catch (error) {
      console.warn(`Failed to load namespace ${namespace} for locale ${locale}:`, error)
    }
  }

  /**
   * 切换当前语言
   */
  async changeLocale(locale: Locale): Promise<void> {
    if (!this.isSupported(locale)) {
      throw new Error(`Locale ${locale} is not supported`)
    }

    this.currentLocale = locale

    // 加载新语言资源
    for (const namespace of this.config.namespaces) {
      if (!this.hasNamespace(locale, namespace)) {
        await this.loadNamespace(locale, namespace)
      }
    }

    // 保存到 localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('th-ui-locale', locale)
    }

    // 触发语言变更事件
    this.dispatchLocaleChange(locale)
  }

  /**
   * 获取当前语言
   */
  getLocale(): Locale {
    return this.currentLocale
  }

  /**
   * 检查命名空间是否存在
   */
  private hasNamespace(locale: Locale, namespace: Namespace): boolean {
    return this.resources.get(locale)?.has(namespace) || false
  }

  /**
   * 获取翻译文本
   *
   * @param key 翻译键，支持命名空间前缀（如 'common:actions.save'）
   * @param params 插值参数
   * @param options 翻译选项
   */
  t(
    key: TranslationKey,
    params?: Record<string, any>,
    options?: TranslationOptions
  ): string {
    const targetLocale = options?.locale || this.currentLocale
    const namespace = options?.namespace || this.extractNamespace(key) || 'common'
    const cleanKey = this.removeNamespace(key)

    // 尝试从目标语言获取
    let message = this.getMessage(targetLocale, namespace, cleanKey)

    // 回退到回退语言
    if (!message && targetLocale !== this.config.fallbackLocale) {
      message = this.getMessage(this.config.fallbackLocale, namespace, cleanKey)
    }

    // 如果仍然找不到，返回 key
    if (!message) {
      console.warn(`Translation not found: ${key}`)
      return key
    }

    // 处理插值
    if (params) {
      return this.interpolate(message, params)
    }

    return message
  }

  /**
   * 提取命名空间
   */
  private extractNamespace(key: string): string | null {
    const parts = key.split(':')
    return parts.length > 1 ? parts[0] : null
  }

  /**
   * 移除命名空间前缀
   */
  private removeNamespace(key: string): string {
    const parts = key.split(':')
    return parts.length > 1 ? parts.slice(1).join(':') : key
  }

  /**
   * 获取消息（支持嵌套键）
   */
  private getMessage(locale: Locale, namespace: Namespace, key: string): string | null {
    const localeMap = this.resources.get(locale)
    if (!localeMap) return null

    const namespaceMap = localeMap.get(namespace)
    if (!namespaceMap) return null

    const keys = key.split('.')
    let value: any = namespaceMap

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return null
      }
    }

    return typeof value === 'string' ? value : null
  }

  /**
   * 插值处理
   *
   * 使用 {{ }} 语法进行变量替换
   */
  private interpolate(message: string, params: Record<string, any>): string {
    const { prefix = '{{', suffix = '}}' } = this.config.interpolation!
    const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const escapedSuffix = suffix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

    return message.replace(
      new RegExp(`${escapedPrefix}\\s*(\\w+)\\s*${escapedSuffix}`, 'g'),
      (match, key) => {
        return params[key]?.toString() || match
      }
    )
  }

  /**
   * 数字格式化
   *
   * 使用 Intl.NumberFormat API
   */
  formatNumber(
    value: number,
    options?: Intl.NumberFormatOptions,
    locale?: Locale
  ): string {
    const targetLocale = locale || this.currentLocale
    const cacheKey = `number-${targetLocale}-${JSON.stringify(options)}`

    let formatter = this.formatters.get(cacheKey) as Intl.NumberFormat
    if (!formatter) {
      formatter = new Intl.NumberFormat(targetLocale, options)
      this.formatters.set(cacheKey, formatter)
    }

    return formatter.format(value)
  }

  /**
   * 日期格式化
   *
   * 使用 Intl.DateTimeFormat API
   */
  formatDate(
    value: Date | number | string,
    options?: Intl.DateTimeFormatOptions,
    locale?: Locale
  ): string {
    const targetLocale = locale || this.currentLocale
    const date = typeof value === 'number' || typeof value === 'string' ? new Date(value) : value
    const cacheKey = `date-${targetLocale}-${JSON.stringify(options)}`

    let formatter = this.formatters.get(cacheKey) as Intl.DateTimeFormat
    if (!formatter) {
      formatter = new Intl.DateTimeFormat(targetLocale, options)
      this.formatters.set(cacheKey, formatter)
    }

    return formatter.format(date)
  }

  /**
   * 复数处理
   *
   * 使用 Intl.PluralRules API
   */
  pluralize(key: string, count: number, params?: Record<string, any>): string {
    const pluralRule = this.getPluralRule(count)
    const pluralKey = `${key}_${pluralRule}`
    return this.t(pluralKey, { ...params, count })
  }

  /**
   * 获取复数规则
   */
  private getPluralRule(count: number): string {
    const locale = this.currentLocale
    const pluralRules = new Intl.PluralRules(locale)
    return pluralRules.select(count)
  }

  /**
   * 获取支持的语言列表
   */
  getSupportedLocales(): Locale[] {
    return [...this.config.supportedLocales]
  }

  /**
   * 检查翻译键是否存在
   */
  exists(key: TranslationKey, options?: TranslationOptions): boolean {
    const targetLocale = options?.locale || this.currentLocale
    const namespace = options?.namespace || this.extractNamespace(key) || 'common'
    const cleanKey = this.removeNamespace(key)

    return this.getMessage(targetLocale, namespace, cleanKey) !== null
  }

  /**
   * 触发语言变更事件
   */
  private dispatchLocaleChange(locale: Locale): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('th-ui-locale-change', {
          detail: { locale },
        })
      )
    }
  }

  /**
   * 监听语言变更
   */
  onLocaleChange(callback: (locale: Locale) => void): () => void {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<{ locale: Locale }>
      callback(customEvent.detail.locale)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('th-ui-locale-change', handler)
      return () => window.removeEventListener('th-ui-locale-change', handler)
    }

    return () => {} // SSR 环境下返回空函数
  }

  /**
   * 添加资源（运行时动态添加）
   */
  addResource(locale: Locale, namespace: Namespace, messages: LocaleMessages): void {
    if (!this.resources.has(locale)) {
      this.resources.set(locale, new Map())
    }

    this.resources.get(locale)!.set(namespace, messages)
  }

  /**
   * 移除资源
   */
  removeResource(locale: Locale, namespace: Namespace): void {
    this.resources.get(locale)?.delete(namespace)
  }
}

export default I18nManager
