# I18N 国际化包设计

## 概述

设计一个**渐进式、可扩展的国际化架构**，将 i18n 功能抽离为独立的 `@th-ui/i18n` 包，提供通用的国际化能力，支持所有 TH-UI 子系统（Matrix、Gallery、Adoption Matrix、Playground 等）的多语言需求。

### 设计原则

1. **渐进式架构**：从轻量级自实现开始，可平滑过渡到成熟方案
2. **统一接口**：无论底层实现如何，提供一致的API体验
3. **类型安全**：充分利用TypeScript类型系统，提供编译时检查
4. **性能优先**：支持代码分割、懒加载和缓存优化
5. **框架无关**：核心功能不依赖特定框架，提供适配器层

## 渐进式架构设计

### 分层架构

```
┌─────────────────────────────────────────────────────────────┐
│                    应用层 (apps/website)                     │
│  ┌─────────────────┐    ┌─────────────────────────────────┐ │
│  │   轻量级实现     │    │        成熟方案集成              │ │
│  │ (默认开箱即用)   │    │      (next-intl等)             │ │
│  └─────────────────┘    └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│               i18n中间层 (@th-ui/i18n)                      │
│  ┌─────────────────┐    ┌─────────────────────────────────┐ │
│  │   核心抽象层     │    │         适配器层                 │ │
│  │ (轻量级自实现)   │    │   (桥接第三方库)                │ │
│  └─────────────────┘    └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│              组件库层 (@th-ui/core)                         │
│                    (无框架依赖)                              │
└─────────────────────────────────────────────────────────────┘
```

### 包结构

```
@th-ui/i18n/
├── src/
│   ├── core/                           # 核心实现层
│   │   ├── I18nManager.ts             # 核心 i18n 管理器
│   │   ├── LocaleDetector.ts          # 语言检测器
│   │   ├── Formatter.ts               # 文本格式化器
│   │   └── ResourceManager.ts         # 资源管理器
│   ├── adapters/                      # 适配器层
│   │   ├── base.ts                    # 基础适配器接口
│   │   ├── next-intl.ts               # next-intl适配器
│   │   └── react-intl.ts              # react-intl适配器(未来)
│   ├── react/                         # React集成层
│   │   ├── I18nProvider.tsx           # React 19 Context Provider
│   │   ├── useI18n.ts                 # 基础翻译Hook
│   │   ├── useLocale.ts               # 语言切换Hook
│   │   └── useFormatter.ts            # 格式化Hook
│   ├── locales/                       # 语言资源
│   │   ├── zh-CN/
│   │   │   ├── common.json            # 通用文本
│   │   │   ├── matrix.json            # Matrix 验证相关
│   │   │   ├── gallery.json           # Gallery 展示相关
│   │   │   ├── adoption.json          # Adoption Matrix 相关
│   │   │   └── playground.json        # Playground 相关
│   │   ├── zh-TW/                     # 繁体中文 (未来)
│   │   ├── en-US/                     # 英文 (未来)
│   │   └── ja-JP/                     # 日文 (未来)
│   ├── types/                         # 类型定义
│   │   ├── core.ts                    # 核心类型定义
│   │   ├── locales.ts                 # 语言包类型
│   │   ├── namespaces.ts              # 命名空间类型
│   │   └── adapters.ts                # 适配器类型
│   ├── utils/                         # 工具函数
│   │   ├── interpolation.ts           # 插值处理
│   │   ├── pluralization.ts           # 复数处理
│   │   ├── datetime.ts                # 日期时间格式化
│   │   └── cache.ts                   # 缓存管理
│   ├── index.ts                       # 主入口
│   └── config.ts                      # 默认配置
├── scripts/                           # 开发工具
│   ├── extract-keys.ts                # 提取翻译键
│   ├── validate-locales.ts            # 验证语言包完整性
│   ├── generate-types.ts              # 生成类型定义
│   └── migrate-to-next-intl.ts        # 迁移到next-intl工具
├── tests/
│   ├── core/
│   ├── adapters/
│   ├── react/
│   └── utils/
└── package.json
```

## 核心 API 设计

### 适配器接口设计

```typescript
// 基础适配器接口
interface I18nAdapter {
  // 初始化适配器
  initialize(config: AdapterConfig): Promise<void>;

  // 获取翻译文本
  t(key: string, options?: TranslationOptions): string;

  // 切换语言
  changeLocale(locale: string): Promise<void>;

  // 获取当前语言
  getLocale(): string;

  // 格式化日期
  formatDate(date: Date | number, options?: Intl.DateTimeFormatOptions): string;

  // 格式化数字
  formatNumber(number: number, options?: Intl.NumberFormatOptions): string;

  // 格式化货币
  formatCurrency(amount: number, currency: string, options?: Intl.NumberFormatOptions): string;
}

// 轻量级实现适配器
interface LightweightAdapter extends I18nAdapter {
  // 加载语言资源
  loadNamespace(namespace: string, locale?: string): Promise<void>;

  // 检测用户语言偏好
  detectLocale(): string;
}

// Next-intl适配器接口
interface NextIntlAdapter extends I18nAdapter {
  // next-intl特定配置
  configureNextIntl(config: NextIntlConfig): void;
}
```

### I18nManager 类 (轻量级实现)

```typescript
// src/core/I18nManager.ts
import type { Locale, LocaleMessages, Namespace, TranslationKey } from '../types'

export interface I18nConfig {
  defaultLocale: Locale
  supportedLocales: Locale[]
  fallbackLocale: Locale
  namespaces: Namespace[]
  interpolation?: {
    prefix?: string
    suffix?: string
  }
}

export class I18nManager implements LightweightAdapter {
  private static instance: I18nManager
  private currentLocale: Locale
  private config: I18nConfig
  private resources: Map<Locale, Map<Namespace, LocaleMessages>>
  private formatters: Map<string, Intl.NumberFormat | Intl.DateTimeFormat>

  constructor(config: Partial<I18nConfig> = {}) {
    this.config = {
      defaultLocale: 'zh-CN',
      supportedLocales: ['zh-CN'],
      fallbackLocale: 'zh-CN',
      namespaces: ['common'],
      interpolation: {
        prefix: '{{',
        suffix: '}}'
      },
      ...config
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
    this.currentLocale = locale || this.detectLocale()

    // 加载默认命名空间
    for (const namespace of this.config.namespaces) {
      await this.loadNamespace(this.currentLocale, namespace)
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
   */
  detectLocale(): Locale {
    if (typeof window === 'undefined') {
      return this.config.defaultLocale
    }

    // 1. 检查 localStorage
    const stored = localStorage.getItem('th-ui-locale')
    if (stored && this.isSupported(stored)) {
      return stored
    }

    // 2. 检查浏览器语言
    const browserLang = navigator.language
    const normalizedLang = this.normalizeLocale(browserLang)
    if (this.isSupported(normalizedLang)) {
      return normalizedLang
    }

    // 3. 回退到默认语言
    return this.config.defaultLocale
  }

  /**
   * 标准化语言代码
   */
  private normalizeLocale(locale: string): Locale {
    return locale.replace('_', '-') as Locale
  }

  /**
   * 检查语言是否支持
   */
  private isSupported(locale: string): boolean {
    return this.config.supportedLocales.includes(locale as Locale)
  }

  /**
   * 加载命名空间资源
   */
  async loadNamespace(locale: Locale, namespace: Namespace): Promise<void> {
    if (!this.resources.has(locale)) {
      this.resources.set(locale, new Map())
    }

    try {
      const messages = await import(`../locales/${locale}/${namespace}.json`)
      this.resources.get(locale)!.set(namespace, messages.default)
    } catch (error) {
      console.warn(`Failed to load namespace ${namespace} for locale ${locale}:`, error)
    }
  }

  /**
   * 设置当前语言
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
   */
  t(key: TranslationKey, params?: Record<string, any>, options?: {
    locale?: Locale
    namespace?: Namespace
  }): string {
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
   * 获取消息
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
   */
  private interpolate(message: string, params: Record<string, any>): string {
    const { prefix = '{{', suffix = '}}' } = this.config.interpolation!

    return message.replace(
      new RegExp(`${prefix}(\\w+)${suffix}`, 'g'),
      (match, key) => {
        return params[key]?.toString() || match
      }
    )
  }

  /**
   * 数字格式化
   */
  formatNumber(value: number, options?: Intl.NumberFormatOptions, locale?: Locale): string {
    const targetLocale = locale || this.currentLocale
    const cacheKey = `${targetLocale}-${JSON.stringify(options)}`

    let formatter = this.formatters.get(cacheKey) as Intl.NumberFormat
    if (!formatter) {
      formatter = new Intl.NumberFormat(targetLocale, options)
      this.formatters.set(cacheKey, formatter)
    }

    return formatter.format(value)
  }

  /**
   * 日期格式化
   */
  formatDate(value: Date | number | string, options?: Intl.DateTimeFormatOptions, locale?: Locale): string {
    const targetLocale = locale || this.currentLocale
    const date = typeof value === 'number' || typeof value === 'string' ? new Date(value) : value
    const cacheKey = `${targetLocale}-${JSON.stringify(options)}`

    let formatter = this.formatters.get(cacheKey) as Intl.DateTimeFormat
    if (!formatter) {
      formatter = new Intl.DateTimeFormat(targetLocale, options)
      this.formatters.set(cacheKey, formatter)
    }

    return formatter.format(date)
  }

  /**
   * 复数处理
   */
  pluralize(key: string, count: number, params?: Record<string, any>): string {
    const pluralKey = `${key}_${this.getPluralRule(count)}`
    return this.t(pluralKey, { ...params, count })
  }

  /**
   * 获取复数规则
   */
  private getPluralRule(count: number): string {
    // 简化的复数规则，可根据语言扩展
    const locale = this.currentLocale
    if (locale === 'zh-CN' || locale === 'zh-TW' || locale === 'ja-JP') {
      return 'other' // 中文、日文没有复数变化
    }
    if (count === 1) return 'one'
    return 'other'
  }

  /**
   * 批量翻译
   */
  batchTranslate(keys: TranslationKey[], params?: Record<string, any>, options?: {
    locale?: Locale
    namespace?: Namespace
  }): Record<string, string> {
    const result: Record<string, string> = {}

    for (const key of keys) {
      result[key] = this.t(key, params, options)
    }

    return result
  }

  /**
   * 添加资源
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

  /**
   * 获取支持的语言列表
   */
  getSupportedLocales(): Locale[] {
    return [...this.config.supportedLocales]
  }

  /**
   * 检查键是否存在
   */
  exists(key: TranslationKey, options?: { locale?: Locale; namespace?: Namespace }): boolean {
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
      window.dispatchEvent(new CustomEvent('th-ui-locale-change', {
        detail: { locale }
      }))
    }
  }

  /**
   * 监听语言变更
   */
  onLocaleChange(callback: (locale: Locale) => void): () => void {
    const handler = (event: CustomEvent) => callback(event.detail.locale)

    if (typeof window !== 'undefined') {
      window.addEventListener('th-ui-locale-change', handler as EventListener)
      return () => window.removeEventListener('th-ui-locale-change', handler as EventListener)
    }

    return () => {} // SSR 环境下返回空函数
  }
}

interface TranslationOptions {
  ns?: string;           // 命名空间
  count?: number;        // 复数形式
  context?: string;      // 上下文
  defaultValue?: string; // 默认值
  replace?: Record<string, any>; // 替换变量
}
```

### 适配器工厂

```typescript
// 适配器类型
type AdapterType = 'lightweight' | 'next-intl' | 'react-intl';

// 适配器工厂
class AdapterFactory {
  static create(type: AdapterType, config?: any): I18nAdapter {
    switch (type) {
      case 'lightweight':
        return new I18nManager(config);
      case 'next-intl':
        return new NextIntlAdapter(config);
      case 'react-intl':
        return new ReactIntlAdapter(config);
      default:
        return new I18nManager(config);
    }
  }
}
```

## React 集成

### 适配器感知的 I18nProvider 组件

```typescript
interface I18nProviderProps {
  children: React.ReactNode;
  adapter?: AdapterType;
  adapterConfig?: any;
  locale?: string;
  fallback?: string;
  onLocaleChange?: (locale: string) => void;
}

const I18nProvider: React.FC<I18nProviderProps> = ({
  children,
  adapter = 'lightweight',
  adapterConfig,
  locale,
  fallback = 'zh-CN',
  onLocaleChange
}) => {
  const [currentLocale, setCurrentLocale] = useState(locale || fallback);
  const i18nAdapter = useMemo(() =>
    AdapterFactory.create(adapter, adapterConfig),
    [adapter, adapterConfig]
  );

  useEffect(() => {
    i18nAdapter.initialize({
      defaultLocale: fallback,
      fallbackLocale: fallback
    });
  }, [i18nAdapter, fallback]);

  const handleLocaleChange = useCallback((newLocale: string) => {
    setCurrentLocale(newLocale);
    onLocaleChange?.(newLocale);
  }, [onLocaleChange]);

  const value = useMemo(() => ({
    locale: currentLocale,
    t: i18nAdapter.t.bind(i18nAdapter),
    setLocale: handleLocaleChange,
    formatDate: i18nAdapter.formatDate.bind(i18nAdapter),
    formatNumber: i18nAdapter.formatNumber.bind(i18nAdapter),
    formatCurrency: i18nAdapter.formatCurrency.bind(i18nAdapter),
    adapterType: adapter
  }), [currentLocale, i18nAdapter, handleLocaleChange, adapter]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};
```

### useI18n Hook

```typescript
interface I18nContextValue {
  locale: string;
  t: (key: string, options?: TranslationOptions) => string;
  setLocale: (locale: string) => void;
  formatDate: (date: Date | number, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (number: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (amount: number, currency: string, options?: Intl.NumberFormatOptions) => string;
  adapterType: AdapterType;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const useI18n = (): I18nContextValue => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
```

### React Hooks

```typescript
// src/hooks/useI18n.ts
import { useEffect, useState, useMemo } from 'react'
import { I18nManager } from '../core/I18nManager'
import type { Locale, TranslationKey } from '../types'

export interface UseI18nOptions {
  locale?: Locale
  namespace?: string
}

export function useI18n(options: UseI18nOptions = {}) {
  const [currentLocale, setCurrentLocale] = useState<Locale>()

  const i18n = useMemo(() => {
    return I18nManager.getInstance()
  }, [])

  // 初始化
  useEffect(() => {
    i18n.initialize(options.locale).then(() => {
      setCurrentLocale(i18n.getLocale())
    })
  }, [i18n, options.locale])

  // 监听语言变更
  useEffect(() => {
    const unsubscribe = i18n.onLocaleChange((locale) => {
      setCurrentLocale(locale)
    })

    return unsubscribe
  }, [i18n])

  const t = (key: TranslationKey, params?: Record<string, any>) => {
    return i18n.t(key, params, { namespace: options.namespace })
  }

  const changeLocale = async (locale: Locale) => {
    await i18n.setLocale(locale)
  }

  const formatNumber = (value: number, options?: Intl.NumberFormatOptions) => {
    return i18n.formatNumber(value, options)
  }

  const formatDate = (value: Date | number | string, options?: Intl.DateTimeFormatOptions) => {
    return i18n.formatDate(value, options)
  }

  const pluralize = (key: string, count: number, params?: Record<string, any>) => {
    return i18n.pluralize(key, count, params)
  }

  return {
    locale: currentLocale,
    t,
    changeLocale,
    formatNumber,
    formatDate,
    pluralize,
    supportedLocales: i18n.getSupportedLocales(),
    exists: i18n.exists.bind(i18n)
  }
}
```

```typescript
// src/hooks/useLocale.ts
import { useI18n } from './useI18n'

export function useLocale() {
  const { locale, changeLocale, supportedLocales } = useI18n()

  const isLocale = (targetLocale: string) => {
    return locale === targetLocale
  }

  const toggleLocale = async () => {
    const currentIndex = supportedLocales.indexOf(locale!)
    const nextIndex = (currentIndex + 1) % supportedLocales.length
    await changeLocale(supportedLocales[nextIndex])
  }

  return {
    locale,
    changeLocale,
    toggleLocale,
    supportedLocales,
    isLocale
  }
}
```

### 使用示例

```typescript
// 轻量级实现 - 默认开箱即用
function AppWithLightweight() {
  return (
    <I18nProvider locale="zh-CN" fallback="zh-CN">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/matrix" element={<MatrixPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/adoption" element={<AdoptionPage />} />
          <Route path="/playground" element={<PlaygroundPage />} />
        </Routes>
      </Router>
    </I18nProvider>
  );
}

// Next-intl集成 - 成熟方案
function AppWithNextIntl() {
  const nextIntlConfig = {
    // next-intl特定配置
    locales: ['zh-CN', 'en-US'],
    defaultLocale: 'zh-CN'
  };

  return (
    <I18nProvider
      adapter="next-intl"
      adapterConfig={nextIntlConfig}
      locale="zh-CN"
      fallback="zh-CN"
    >
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/matrix" element={<MatrixPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/adoption" element={<AdoptionPage />} />
          <Route path="/playground" element={<PlaygroundPage />} />
        </Routes>
      </Router>
    </I18nProvider>
  );
}

// 在组件中使用 - 两种方式API一致
function HomePage() {
  const { t, locale, setLocale, adapterType } = useI18n();

  return (
    <div>
      <h1>{t('common:title')}</h1>
      <p>{t('common:description')}</p>
      <button onClick={() => setLocale(locale === 'zh-CN' ? 'en-US' : 'zh-CN')}>
        {t('common:toggleLanguage')}
      </button>
      <p>当前使用: {adapterType === 'lightweight' ? '轻量级实现' : 'Next-intl'}</p>
    </div>
  );
}
```

### 迁移工具

```typescript
// 迁移辅助函数
export function createMigrationHelper(from: AdapterType, to: AdapterType) {
  return {
    // 检查兼容性
    checkCompatibility: (): boolean => {
      // 检查两种适配器之间的兼容性
      return true;
    },

    // 迁移配置
    migrateConfig: (fromConfig: any): any => {
      // 将一种适配器的配置转换为另一种
      return fromConfig;
    },

    // 迁移语言资源
    migrateResources: async (fromResources: any): Promise<any> => {
      // 转换语言资源格式
      return fromResources;
    }
  };
}
```

### 语言包结构

```json
// src/locales/zh-CN/common.json
{
  "actions": {
    "save": "保存",
    "cancel": "取消",
    "confirm": "确认",
    "delete": "删除",
    "edit": "编辑",
    "view": "查看",
    "copy": "复制",
    "export": "导出",
    "import": "导入",
    "search": "搜索",
    "filter": "筛选",
    "reset": "重置",
    "refresh": "刷新"
  },
  "status": {
    "loading": "加载中...",
    "success": "成功",
    "error": "错误",
    "warning": "警告",
    "info": "信息",
    "disabled": "已禁用",
    "enabled": "已启用"
  },
  "time": {
    "now": "刚刚",
    "minutes_ago": "{{count}} 分钟前",
    "hours_ago": "{{count}} 小时前",
    "days_ago": "{{count}} 天前",
    "today": "今天",
    "yesterday": "昨天"
  },
  "validation": {
    "required": "此字段为必填项",
    "invalid_format": "格式不正确",
    "min_length": "最少需要 {{min}} 个字符",
    "max_length": "最多 {{max}} 个字符"
  },
  "navigation": {
    "home": "首页",
    "components": "组件",
    "themes": "主题",
    "docs": "文档",
    "playground": "试验场",
    "gallery": "展示馆",
    "adoption": "采用矩阵"
  }
}
```

```json
// src/locales/zh-CN/style-recipe.json
{
  "recipes": {
    "professional_blue": {
      "name": "专业蓝",
      "description": "适合企业应用的专业蓝色主题，沉稳可信"
    },
    "modern_minimal": {
      "name": "现代极简",
      "description": "简洁现代的设计风格，注重内容展示"
    },
    "warm_creative": {
      "name": "温暖创意",
      "description": "温暖活泼的配色方案，激发创意灵感"
    },
    "dark_night": {
      "name": "暗夜模式",
      "description": "深色主题，减少眼部疲劳，适合夜间使用"
    },
    "nature_fresh": {
      "name": "自然清新",
      "description": "源自大自然的配色，清新自然"
    }
  },
  "axes": {
    "mode": "模式",
    "base": "基础",
    "accent": "强调色",
    "tone": "色调",
    "density": "密度",
    "motion": "动效",
    "surface": "表面"
  },
  "colors": {
    "semantic": {
      "primary": "主色",
      "secondary": "次要色",
      "success": "成功色",
      "warning": "警告色",
      "error": "错误色",
      "info": "信息色"
    },
    "neutral": {
      "lightest": "最浅灰",
      "lighter": "浅灰",
      "base": "中灰",
      "darker": "深灰",
      "darkest": "最深灰"
    },
    "interactive": {
      "default": "默认状态",
      "hover": "悬停状态",
      "active": "激活状态",
      "disabled": "禁用状态",
      "focus": "焦点状态"
    }
  },
  "sizes": {
    "xs": "极小",
    "sm": "小",
    "md": "中",
    "lg": "大",
    "xl": "极大"
  },
  "fontSizes": {
    "xs": "极小字体",
    "sm": "小字体",
    "base": "基础字体",
    "lg": "大字体",
    "xl": "极大字体"
  },
  "spacing": {
    "xs": "极小间距",
    "sm": "小间距",
    "md": "中间距",
    "lg": "大间距",
    "xl": "极大间距"
  },
  "motion": {
    "duration": {
      "fast": "快速动画",
      "normal": "标准动画",
      "slow": "慢速动画"
    },
    "ease": {
      "linear": "线性缓动",
      "in": "缓入",
      "out": "缓出",
      "inOut": "缓入缓出"
    },
    "type": {
      "none": "无动画",
      "subtle": "微妙动画",
      "smooth": "流畅动画",
      "bouncy": "弹性动画"
    }
  }
}
```

```json
// src/locales/zh-CN/gallery.json
{
  "title": "TH-UI 展示馆",
  "subtitle": "探索组件库的无限可能",
  "theme_selector": {
    "title": "选择主题",
    "description": "浏览不同的视觉风格",
    "search_placeholder": "搜索主题..."
  },
  "themes": {
    "professional_blue": {
      "name": "专业蓝",
      "description": "适合企业应用的专业蓝色主题"
    },
    "modern_minimal": {
      "name": "现代极简",
      "description": "简洁现代的设计风格"
    },
    "warm_creative": {
      "name": "温暖创意",
      "description": "温暖活泼的配色方案"
    }
  },
  "categories": {
    "business": "商务",
    "minimal": "极简",
    "creative": "创意",
    "dark": "暗色",
    "nature": "自然"
  },
  "components": {
    "showcase": {
      "title": "组件展示",
      "description": "查看所有组件在不同主题下的效果",
      "all_variants": "所有变体",
      "interactive_states": "交互状态"
    },
    "preview": {
      "title": "预览",
      "code_view": "代码视图",
      "fullscreen": "全屏",
      "copy_code": "复制代码"
    }
  },
  "filters": {
    "all_components": "所有组件",
    "by_category": "按分类",
    "by_status": "按状态",
    "by_complexity": "按复杂度"
  }
}
```

```json
// src/locales/zh-CN/adoption.json
{
  "title": "采用矩阵",
  "subtitle": "快速集成 TH-UI 到你的项目中",
  "code": {
    "install": {
      "package_manager": "# 使用 npm",
      "command": "npm install @th-ui/core@{{recipe}}"
    },
    "usage": {
      "imports": "import { {{component}} } from '@th-ui/core'",
      "comments": "// 在你的应用中使用",
      "component": "<{{component}} {{variant}}>按钮</{{component}}>"
    },
    "config": {
      "comments": "// 配置主题提供者",
      "provider": "<StyleRecipeProvider recipe=\"{{recipe}}\">",
      "theme_setup": "  <App />\n</StyleRecipeProvider>"
    }
  },
  "matrix": {
    "title": "配置矩阵",
    "description": "选择组件和变体生成配置代码",
    "select_component": "选择组件",
    "select_variant": "选择变体",
    "generate_code": "生成代码",
    "copy_all": "复制全部",
    "export_config": "导出配置"
  },
  "installation": {
    "title": "安装指南",
    "step_1": "安装包",
    "step_2": "配置提供者",
    "step_3": "使用组件",
    "troubleshooting": "问题排查"
  }
}
```

```json
// src/locales/zh-CN/playground.json
{
  "title": "TH-UI 试验场",
  "subtitle": "实时预览和测试组件",
  "editor": {
    "title": "代码编辑器",
    "settings": "设置",
    "theme": "编辑器主题",
    "font_size": "字体大小",
    "word_wrap": "自动换行",
    "line_numbers": "行号",
    "minimap": "小地图"
  },
  "preview": {
    "title": "实时预览",
    "responsive": "响应式预览",
    "device_sizes": {
      "mobile": "手机",
      "tablet": "平板",
      "desktop": "桌面"
    }
  },
  "properties": {
    "title": "属性配置",
    "button": {
      "variant": {
        "label": "变体",
        "description": "按钮的视觉样式",
        "options": {
          "primary": "主要",
          "secondary": "次要",
          "outline": "轮廓",
          "ghost": "幽灵"
        }
      },
      "size": {
        "label": "尺寸",
        "description": "按钮的大小",
        "options": {
          "sm": "小",
          "md": "中",
          "lg": "大"
        }
      },
      "disabled": {
        "label": "禁用",
        "description": "是否禁用按钮"
      },
      "loading": {
        "label": "加载中",
        "description": "是否显示加载状态"
      }
    },
    "input": {
      "placeholder": {
        "label": "占位符",
        "description": "输入提示文本"
      },
      "type": {
        "label": "类型",
        "description": "输入框类型",
        "options": {
          "text": "文本",
          "email": "邮箱",
          "password": "密码",
          "number": "数字"
        }
      },
      "error": {
        "label": "错误状态",
        "description": "是否显示错误状态"
      }
    }
  },
  "actions": {
    "reset": "重置属性",
    "copy_code": "复制代码",
    "export_component": "导出组件",
    "share": "分享"
  },
  "templates": {
    "title": "模板",
    "basic_forms": "基础表单",
    "navigation": "导航组件",
    "cards": "卡片布局",
    "modals": "模态框"
  }
}
```

```json
// src/locales/zh-CN/matrix.json
{
  "title": "可访问性矩阵",
  "legend": {
    "excellent": "优秀 (90-100)",
    "good": "良好 (70-89)",
    "fair": "一般 (50-69)",
    "poor": "较差 (0-49)"
  },
  "validation": {
    "contrast": {
      "fail": {
        "title": "对比度不足",
        "description": "当前对比度 {{actual}}:1 低于 {{required}}:1 的要求",
        "suggestion_high": "需要显著调整前景色或背景色",
        "suggestion_medium": "建议调整前景色亮度",
        "suggestion_low": "微调颜色即可达到要求"
      },
      "pass": {
        "title": "对比度合格",
        "description_aa": "符合 WCAG AA 标准",
        "description_aaa": "符合 WCAG AAA 标准"
      }
    },
    "semantic": {
      "disabled_focus": {
        "title": "语义冲突",
        "description": "禁用元素不应该具有焦点状态",
        "reason": "禁用元素按定义不可获得焦点",
        "suggestion": "从禁用状态中移除焦点样式"
      },
      "ghost_disabled": {
        "title": "可见性问题",
        "description": "幽灵变体的禁用状态可能不可见",
        "suggestion": "添加背景色或提高文本对比度"
      }
    }
  },
  "components": {
    "Button": "按钮",
    "Input": "输入框",
    "Card": "卡片",
    "Modal": "模态框",
    "Alert": "提示框",
    "Badge": "徽章",
    "Avatar": "头像",
    "Switch": "开关",
    "Checkbox": "复选框",
    "Radio": "单选框"
  },
  "states": {
    "default": "默认状态",
    "hover": "悬停状态",
    "focus": "焦点状态",
    "active": "激活状态",
    "disabled": "禁用状态",
    "loading": "加载状态",
    "error": "错误状态"
  },
  "variants": {
    "primary": "主要样式",
    "secondary": "次要样式",
    "outline": "轮廓样式",
    "ghost": "幽灵样式",
    "link": "链接样式",
    "destructive": "危险样式"
  }
}
```

### 类型定义

```typescript
// src/types/core.ts
export type Locale = 'zh-CN' | 'zh-TW' | 'en-US' | 'ja-JP'

export type TranslationKey = string

export type LocaleMessages = Record<string, any>

export type Namespace =
  | 'common'
  | 'matrix'
  | 'gallery'
  | 'adoption'
  | 'playground'

export interface TranslationOptions {
  locale?: Locale
  namespace?: Namespace
  params?: Record<string, any>
}
```

## 使用示例

### Matrix 系统集成

```typescript
// @th-ui/matrix/src/MatrixGenerator.ts
import { I18nManager } from '@th-ui/i18n'

export class MatrixGenerator {
  private i18n: I18nManager

  constructor(locale: Locale = 'zh-CN') {
    this.i18n = I18nManager.getInstance()
    this.i18n.setLocale(locale)
  }

  generateLocalizedViolation(violation: any) {
    return {
      ...violation,
      title: this.i18n.t('matrix:validation.semantic.disabled_focus.title'),
      description: this.i18n.t('matrix:validation.semantic.disabled_focus.description'),
      suggestion: this.i18n.t('matrix:validation.semantic.disabled_focus.suggestion')
    }
  }
}
```

### 样式配方系统集成

```typescript
// @th-ui/style-recipe/src/StyleRecipeProvider.tsx
import { I18nManager } from '@th-ui/i18n'
import { useI18n } from '@th-ui/i18n/hooks'

interface StyleRecipeProviderProps {
  children: React.ReactNode
  locale?: Locale
  recipe?: string
}

export const StyleRecipeProvider: React.FC<StyleRecipeProviderProps> = ({
  children,
  locale = 'zh-CN',
  recipe
}) => {
  const { t, changeLocale } = useI18n({
    namespace: 'style-recipe',
    locale
  })

  // 样式配方名称本地化
  const getLocalizedRecipeName = (recipeId: string): string => {
    return t(`recipes.${recipeId}.name`, {}, { fallback: recipeId })
  }

  // 样式配方描述本地化
  const getLocalizedRecipeDescription = (recipeId: string): string => {
    return t(`recipes.${recipeId}.description`)
  }

  // 轴名称本地化
  const getLocalizedAxisName = (axis: string): string => {
    return t(`axes.${axis}`)
  }

  // 颜色语义本地化
  const getLocalizedColorSemantic = (semantic: string): string => {
    return t(`colors.semantic.${semantic}`)
  }

  return (
    <I18nContext.Provider value={{
      locale,
      changeLocale,
      t,
      getLocalizedRecipeName,
      getLocalizedRecipeDescription,
      getLocalizedAxisName,
      getLocalizedColorSemantic
    }}>
      <StyleRecipeContextProvider recipe={recipe}>
        {children}
      </StyleRecipeContextProvider>
    </I18nContext.Provider>
  )
}
```

### 样式令牌国际化

```typescript
// @th-ui/style-recipe/src/tokens/LocalizedTokens.ts
import { I18nManager } from '@th-ui/i18n'

export class LocalizedTokenGenerator {
  private i18n: I18nManager

  constructor(locale: Locale = 'zh-CN') {
    this.i18n = I18nManager.getInstance()
    this.i18n.setLocale(locale)
  }

  /**
   * 生成本地化的颜色令牌
   */
  generateLocalizedColorTokens(recipe: StyleRecipe): ColorTokens {
    return {
      // 语义化颜色名称
      'color-primary': this.i18n.t('style-recipe:colors.primary'),
      'color-secondary': this.i18n.t('style-recipe:colors.secondary'),
      'color-success': this.i18n.t('style-recipe:colors.success'),
      'color-warning': this.i18n.t('style-recipe:colors.warning'),
      'color-error': this.i18n.t('style-recipe:colors.error'),
      'color-info': this.i18n.t('style-recipe:colors.info'),

      // 中性颜色
      'color-neutral-50': this.i18n.t('style-recipe:colors.neutral.lightest'),
      'color-neutral-100': this.i18n.t('style-recipe:colors.neutral.lighter'),
      'color-neutral-500': this.i18n.t('style-recipe:colors.neutral.base'),
      'color-neutral-900': this.i18n.t('style-recipe:colors.neutral.darkest'),

      // 交互状态
      'color-interactive-default': this.i18n.t('style-recipe:colors.interactive.default'),
      'color-interactive-hover': this.i18n.t('style-recipe:colors.interactive.hover'),
      'color-interactive-active': this.i18n.t('style-recipe:colors.interactive.active'),
      'color-interactive-disabled': this.i18n.t('style-recipe:colors.interactive.disabled')
    }
  }

  /**
   * 生成本地化的尺寸令牌
   */
  generateLocalizedSizeTokens(): SizeTokens {
    return {
      'size-xs': this.i18n.t('style-recipe:sizes.xs'),
      'size-sm': this.i18n.t('style-recipe:sizes.sm'),
      'size-md': this.i18n.t('style-recipe:sizes.md'),
      'size-lg': this.i18n.t('style-recipe:sizes.lg'),
      'size-xl': this.i18n.t('style-recipe:sizes.xl'),

      'font-size-xs': this.i18n.t('style-recipe:fontSizes.xs'),
      'font-size-sm': this.i18n.t('style-recipe:fontSizes.sm'),
      'font-size-base': this.i18n.t('style-recipe:fontSizes.base'),
      'font-size-lg': this.i18n.t('style-recipe:fontSizes.lg'),
      'font-size-xl': this.i18n.t('style-recipe:fontSizes.xl'),

      'spacing-xs': this.i18n.t('style-recipe:spacing.xs'),
      'spacing-sm': this.i18n.t('style-recipe:spacing.sm'),
      'spacing-md': this.i18n.t('style-recipe:spacing.md'),
      'spacing-lg': this.i18n.t('style-recipe:spacing.lg'),
      'spacing-xl': this.i18n.t('style-recipe:spacing.xl')
    }
  }

  /**
   * 生成本地化的动画令牌
   */
  generateLocalizedMotionTokens(): MotionTokens {
    return {
      'duration-fast': this.i18n.t('style-recipe:motion.duration.fast'),
      'duration-normal': this.i18n.t('style-recipe:motion.duration.normal'),
      'duration-slow': this.i18n.t('style-recipe:motion.duration.slow'),

      'ease-linear': this.i18n.t('style-recipe:motion.ease.linear'),
      'ease-in': this.i18n.t('style-recipe:motion.ease.in'),
      'ease-out': this.i18n.t('style-recipe:motion.ease.out'),
      'ease-in-out': this.i18n.t('style-recipe:motion.ease.inOut')
    }
  }
}
```

### Gallery 主题选择器国际化

```typescript
// apps/gallery/src/components/ThemeSelector.tsx
import { useI18n } from '@th-ui/i18n/hooks'

export const ThemeSelector: React.FC = () => {
  const { t, locale, changeLocale } = useI18n({ namespace: 'gallery' })

  const themes = [
    {
      id: 'professional-blue',
      name: t('themes.professional_blue.name'),
      description: t('themes.professional_blue.description'),
      category: t('themes.categories.business')
    },
    {
      id: 'modern-minimal',
      name: t('themes.modern_minimal.name'),
      description: t('themes.modern_minimal.description'),
      category: t('themes.categories.minimal')
    },
    {
      id: 'warm-creative',
      name: t('themes.warm_creative.name'),
      description: t('themes.warm_creative.description'),
      category: t('themes.categories.creative')
    }
  ]

  return (
    <div className="theme-selector">
      <div className="language-switcher">
        <select value={locale} onChange={(e) => changeLocale(e.target.value as Locale)}>
          <option value="zh-CN">中文</option>
          <option value="en-US">English</option>
        </select>
      </div>

      <h2>{t('theme_selector.title')}</h2>

      <div className="theme-grid">
        {themes.map(theme => (
          <div key={theme.id} className="theme-card">
            <h3>{theme.name}</h3>
            <p>{theme.description}</p>
            <span className="theme-category">{theme.category}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Adoption Matrix 代码生成国际化

```typescript
// apps/adoption-matrix/src/hooks/useLocalizedCode.ts
import { useI18n } from '@th-ui/i18n/hooks'

export function useLocalizedCode() {
  const { t, locale } = useI18n({ namespace: 'adoption' })

  /**
   * 生成本地化的安装代码
   */
  const generateInstallCode = (recipe: string): string => {
    const packageManager = t('code.install.package_manager')
    const command = t('code.install.command', { recipe })

    return `${packageManager}\n${command}`
  }

  /**
   * 生成本地化的使用代码
   */
  const generateUsageCode = (component: string, variant: string): string => {
    const imports = t('code.usage.imports', { component })
    const componentUsage = t('code.usage.component', { variant })
    const comments = t('code.usage.comments')

    return `${imports}\n\n${comments}\n${componentUsage}`
  }

  /**
   * 生成本地化的配置代码
   */
  const generateConfigCode = (recipe: string): string => {
    const configComments = t('code.config.comments')
    const providerCode = t('code.config.provider', { recipe })
    const themeSetup = t('code.config.theme_setup')

    return `${configComments}\n${providerCode}\n${themeSetup}`
  }

  return {
    generateInstallCode,
    generateUsageCode,
    generateConfigCode,
    locale
  }
}
```

### Playground 组件属性面板国际化

```typescript
// apps/playground/src/components/PropertyPanel.tsx
import { useI18n } from '@th-ui/i18n/hooks'

interface PropertyPanelProps {
  component: string
  properties: Record<string, any>
  onChange: (key: string, value: any) => void
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  component,
  properties,
  onChange
}) => {
  const { t } = useI18n({ namespace: 'playground' })

  const getPropertyLabel = (key: string): string => {
    return t(`properties.${component}.${key}.label`)
  }

  const getPropertyDescription = (key: string): string => {
    return t(`properties.${component}.${key}.description`)
  }

  const getPropertyOptions = (key: string): Array<{ label: string; value: any }> => {
    const optionsKey = `properties.${component}.${key}.options`
    return [
      { label: t(`${optionsKey}.primary`), value: 'primary' },
      { label: t(`${optionsKey}.secondary`), value: 'secondary' },
      { label: t(`${optionsKey}.outline`), value: 'outline' },
      { label: t(`${optionsKey}.ghost`), value: 'ghost' }
    ]
  }

  return (
    <div className="property-panel">
      <h3>{t('panel.title', { component })}</h3>

      {Object.entries(properties).map(([key, value]) => (
        <div key={key} className="property-item">
          <label>
            {getPropertyLabel(key)}
            <span className="property-description">
              {getPropertyDescription(key)}
            </span>
          </label>

          {key === 'variant' && (
            <select
              value={value}
              onChange={(e) => onChange(key, e.target.value)}
            >
              {getPropertyOptions(key).map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}

          {key === 'size' && (
            <select
              value={value}
              onChange={(e) => onChange(key, e.target.value)}
            >
              <option value="sm">{t('properties.size.options.sm')}</option>
              <option value="md">{t('properties.size.options.md')}</option>
              <option value="lg">{t('properties.size.options.lg')}</option>
            </select>
          )}

          {typeof value === 'boolean' && (
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => onChange(key, e.target.checked)}
            />
          )}
        </div>
      ))}
    </div>
  )
}
```

### React 组件集成

```typescript
// apps/gallery/src/components/MatrixHeatmap.tsx
import { useI18n } from '@th-ui/i18n/hooks'

export const MatrixHeatmap = () => {
  const { t, locale, changeLocale } = useI18n({ namespace: 'matrix' })

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <select value={locale} onChange={(e) => changeLocale(e.target.value)}>
          <option value="zh-CN">中文</option>
          <option value="en-US">English</option>
        </select>
      </CardHeader>
      <CardContent>
        <div className="heatmap-legend">
          <div className="legend-item">
            <div className="legend-color excellent"></div>
            <span>{t('legend.excellent')}</span>
          </div>
          {/* ... */}
        </div>
      </CardContent>
    </Card>
  )
}
```

## 工具脚本

### 提取翻译键

```typescript
// scripts/extract-keys.ts
import * as fs from 'fs'
import * as path from 'path'

interface TranslationKey {
  key: string
  namespace: string
  file: string
  line: number
}

export class KeyExtractor {
  private keys: TranslationKey[] = []

  extractFromFile(filePath: string): void {
    const content = fs.readFileSync(filePath, 'utf-8')
    const lines = content.split('\n')

    lines.forEach((line, index) => {
      // 匹配 t('key') 或 t("key")
      const match = line.match(/t\(['"]([^'"]+)['"]\)/)
      if (match) {
        const namespace = this.inferNamespace(filePath)
        this.keys.push({
          key: match[1],
          namespace,
          file: filePath,
          line: index + 1
        })
      }
    })
  }

  private inferNamespace(filePath: string): string {
    if (filePath.includes('matrix')) return 'matrix'
    if (filePath.includes('gallery')) return 'gallery'
    if (filePath.includes('adoption')) return 'adoption'
    if (filePath.includes('playground')) return 'playground'
    return 'common'
  }

  generateReport(): TranslationKey[] {
    return this.keys
  }

  checkMissingKeys(locale: string): string[] {
    const missing: string[] = []
    const localePath = path.join(__dirname, `../src/locales/${locale}`)

    for (const { key, namespace } of this.keys) {
      const namespacePath = path.join(localePath, `${namespace}.json`)
      if (fs.existsSync(namespacePath)) {
        const messages = JSON.parse(fs.readFileSync(namespacePath, 'utf-8'))
        if (!this.hasKey(messages, key)) {
          missing.push(`${namespace}:${key}`)
        }
      }
    }

    return missing
  }

  private hasKey(obj: any, key: string): boolean {
    const keys = key.split('.')
    let current = obj

    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k]
      } else {
        return false
      }
    }

    return true
  }
}
```

### 验证语言包完整性

```typescript
// scripts/validate-locales.ts
import { KeyExtractor } from './extract-keys'
import * as path from 'path'

export class LocaleValidator {
  private extractor: KeyExtractor

  constructor() {
    this.extractor = new KeyExtractor()
  }

  async validateAll(): Promise<void> {
    console.log('🔍 开始验证语言包完整性...')

    // 1. 提取所有翻译键
    await this.extractKeysFromSource()

    // 2. 验证每种语言的完整性
    const locales = ['zh-CN', 'zh-TW', 'en-US', 'ja-JP']
    for (const locale of locales) {
      console.log(`\n📋 验证 ${locale} 语言包...`)
      const missing = this.extractor.checkMissingKeys(locale)

      if (missing.length === 0) {
        console.log(`✅ ${locale} 语言包完整`)
      } else {
        console.log(`❌ ${locale} 语言包缺少 ${missing.length} 个键:`)
        missing.forEach(key => console.log(`   - ${key}`))
      }
    }

    console.log('\n🎉 验证完成')
  }

  private async extractKeysFromSource(): Promise<void> {
    const sourceDirs = [
      'packages/*/src',
      'apps/*/src'
    ]

    // 遍历所有源文件并提取键
    for (const dir of sourceDirs) {
      // 实现文件遍历逻辑
    }
  }
}
```

## 包配置

```json
// package.json
{
  "name": "@th-ui/i18n",
  "version": "1.0.0",
  "description": "TH-UI 国际化解决方案",
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist",
    "src/locales"
  ],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "extract-keys": "tsx scripts/extract-keys.ts",
    "validate-locales": "tsx scripts/validate-locales.ts",
    "generate-types": "tsx scripts/generate-types.ts",
    "test": "vitest"
  },
  "peerDependencies": {
    "react": ">=18.0.0"
  },
  "dependencies": {},
  "devDependencies": {
    "tsup": "^8.0.0",
    "typescript": "^5.0.0",
    "vitest": "^1.0.0"
  }
}
```

## 使用方式

```bash
# 安装
npm install @th-ui/i18n

# 初始化
import { I18nManager } from '@th-ui/i18n'

const i18n = I18nManager.getInstance({
  defaultLocale: 'zh-CN',
  supportedLocales: ['zh-CN', 'en-US'],
  namespaces: ['common', 'matrix']
})

await i18n.initialize()

# React 中使用
import { useI18n } from '@th-ui/i18n/hooks'

function Component() {
  const { t, locale, changeLocale } = useI18n({ namespace: 'matrix' })

  return (
    <div>
      <h1>{t('title')}</h1>
      <button onClick={() => changeLocale('en-US')}>
        Switch to English
      </button>
    </div>
  )
}
```

## 实现路线图

### 阶段1: 核心功能实现
- I18nManager 类实现
- 基础语言包加载
- React Hooks 集成
- 基础格式化功能
- 适配器接口设计

### 阶段2: 适配器层实现
- 轻量级适配器实现
- Next-intl适配器实现
- 适配器工厂模式
- 迁移工具开发

### 阶段3: 高级特性
- 命名空间支持
- 复数规则处理
- 插值和变量替换
- 语言检测和自动切换

### 阶段4: 性能优化
- 语言包代码分割
- 缓存机制
- 懒加载优化
- SSR 支持

### 阶段5: 开发工具
- 翻译键提取工具
- 语言包验证工具
- 类型生成工具
- 开发者调试工具
- 适配器迁移工具

### 阶段6: 扩展功能
- 多语言回退机制
- 动态语言包加载
- 翻译记忆功能
- 协作翻译工具
- 更多适配器支持(react-intl等)

---

## 总结

这个渐进式、可扩展的 i18n 包提供了：

1. **分层架构设计** - 轻量级实现与成熟方案共存
2. **统一接口体验** - 无论底层实现如何，API保持一致
3. **灵活的适配器系统** - 支持自实现和第三方库集成
4. **完全解耦的设计** - 可被任何 TH-UI 子系统使用
5. **灵活的命名空间** - 支持按模块组织翻译内容
6. **强大的类型支持** - 完整的 TypeScript 类型定义
7. **自动化工具链** - 键提取、完整性验证、迁移工具
8. **React 集成** - 开箱即用的 React Hooks
9. **SSR 友好** - 支持服务端渲染
10. **性能优化** - 缓存、懒加载等优化措施

各个子系统可以根据需要选择命名空间，实现真正的模块化国际化。同时，开发者可以根据项目需求选择使用轻量级自实现方案或集成成熟的第三方库，实现渐进式升级。
