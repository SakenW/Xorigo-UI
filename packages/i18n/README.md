# @xorigo-ui/i18n

> Xorigo UI 轻量级国际化解决方案

[![Version](https://img.shields.io/npm/v/@xorigo-ui/i18n.svg)](https://www.npmjs.com/package/@xorigo-ui/i18n)
[![License](https://img.shields.io/npm/l/@xorigo-ui/i18n.svg)](https://github.com/xorigo-ui/xorigo-ui/blob/main/LICENSE)

## ✨ 特性

- 🎯 **轻量级自实现** - 无需大型第三方库，核心功能完全自实现
- 🔐 **类型安全** - 完整的 TypeScript 类型支持，编译时类型检查
- ⚡ **高性能** - 使用 Intl API 进行格式化，支持缓存优化
- 🌐 **多语言支持** - 内置 zh-CN、zh-TW、en-US、ja-JP 四种语言
- 📦 **命名空间** - 按模块组织翻译内容，支持按需加载
- 🔄 **动态加载** - 异步语言包加载，减少初始包体积
- ⚛️ **React 集成** - 开箱即用的 React Hooks 和 Context API
- 🎨 **插值支持** - 支持 `{{variable}}` 语法的变量替换
- 🔢 **复数处理** - 基于 Intl.PluralRules 的智能复数规则
- 📅 **格式化** - 数字、日期、货币的本地化格式化
- 🌍 **SSR 友好** - 支持服务端渲染环境

## 📦 安装

```bash
npm install @xorigo-ui/i18n
```

## 🚀 快速开始

### 基础使用

```typescript
import { I18nManager } from '@xorigo-ui/i18n'

// 获取单例实例
const i18n = I18nManager.getInstance({
  defaultLocale: 'zh-CN',
  supportedLocales: ['zh-CN', 'en-US'],
  namespaces: ['common'],
})

// 初始化
await i18n.initialize()

// 翻译文本
console.log(i18n.t('common:actions.save')) // "保存"

// 插值
console.log(i18n.t('common:time.minutes_ago', { count: 5 })) // "5 分钟前"

// 切换语言
await i18n.changeLocale('en-US')
console.log(i18n.t('common:actions.save')) // "Save"
```

### React 集成

```tsx
import { I18nProvider, useI18n } from '@xorigo-ui/i18n/react'

// 1. 在应用根组件使用 Provider
function App() {
  return (
    <I18nProvider locale="zh-CN">
      <YourApp />
    </I18nProvider>
  )
}

// 2. 在组件中使用 Hook
function Component() {
  const { t, locale, changeLocale, formatDate, formatNumber } = useI18n({
    namespace: 'common',
  })

  return (
    <div>
      <h1>{t('navigation.home')}</h1>
      <p>{formatDate(new Date())}</p>
      <p>{formatNumber(1234.56, { style: 'currency', currency: 'CNY' })}</p>

      <button onClick={() => changeLocale('en-US')}>
        Switch to English
      </button>
    </div>
  )
}
```

### 语言切换器

```tsx
import { useLocale } from '@xorigo-ui/i18n/react'

function LanguageSwitcher() {
  const { locale, changeLocale, supportedLocales } = useLocale()

  return (
    <select value={locale} onChange={(e) => changeLocale(e.target.value as Locale)}>
      {supportedLocales.map((loc) => (
        <option key={loc} value={loc}>
          {loc}
        </option>
      ))}
    </select>
  )
}
```

## 📚 API 文档

### I18nManager

核心管理器类，提供国际化的所有功能。

#### 初始化

```typescript
const i18n = I18nManager.getInstance({
  defaultLocale: 'zh-CN',
  supportedLocales: ['zh-CN', 'en-US', 'zh-TW', 'ja-JP'],
  fallbackLocale: 'zh-CN',
  namespaces: ['common', 'matrix', 'gallery'],
  interpolation: {
    prefix: '{{',
    suffix: '}}',
  },
})

await i18n.initialize()
```

#### 翻译方法

```typescript
// 基础翻译
t(key: string, params?: Record<string, any>, options?: TranslationOptions): string

// 示例
i18n.t('actions.save')                           // "保存"
i18n.t('common:actions.save')                    // 带命名空间
i18n.t('time.minutes_ago', { count: 5 })        // 插值
i18n.t('title', {}, { locale: 'en-US' })        // 指定语言
```

#### 格式化方法

```typescript
// 数字格式化
formatNumber(value: number, options?: Intl.NumberFormatOptions, locale?: Locale): string

// 示例
i18n.formatNumber(1234.56)                                    // "1,234.56"
i18n.formatNumber(1234.56, { style: 'currency', currency: 'CNY' })  // "¥1,234.56"

// 日期格式化
formatDate(value: Date | number | string, options?: Intl.DateTimeFormatOptions, locale?: Locale): string

// 示例
i18n.formatDate(new Date())                                   // "2024/1/1"
i18n.formatDate(new Date(), { year: 'numeric', month: 'long' })  // "2024年1月"
```

#### 复数处理

```typescript
pluralize(key: string, count: number, params?: Record<string, any>): string

// 语言包中定义
{
  "items_one": "{{count}} item",
  "items_other": "{{count}} items"
}

// 使用
i18n.pluralize('items', 1)   // "1 item"
i18n.pluralize('items', 5)   // "5 items"
```

#### 语言切换

```typescript
// 切换语言
await changeLocale(locale: Locale): Promise<void>

// 获取当前语言
getLocale(): Locale

// 获取支持的语言列表
getSupportedLocales(): Locale[]

// 检查键是否存在
exists(key: TranslationKey, options?: TranslationOptions): boolean
```

### React Hooks

#### useI18n

完整的国际化功能 Hook。

```typescript
const {
  locale,          // 当前语言
  t,               // 翻译函数
  changeLocale,    // 切换语言
  formatNumber,    // 数字格式化
  formatDate,      // 日期格式化
  pluralize,       // 复数处理
  supportedLocales,// 支持的语言列表
  exists,          // 检查键是否存在
  i18n,            // I18nManager 实例
} = useI18n({ namespace: 'common' })
```

#### useLocale

专注于语言切换的简化 Hook。

```typescript
const {
  locale,          // 当前语言
  changeLocale,    // 切换语言
  toggleLocale,    // 切换到下一个语言
  supportedLocales,// 支持的语言列表
  isLocale,        // 检查是否为指定语言
} = useLocale()
```

## 🗂️ 语言包结构

### 命名空间

- `common` - 通用翻译（按钮、标签、消息）
- `matrix` - 可访问性矩阵翻译
- `gallery` - 配方展示馆翻译
- `adoption` - 采用矩阵翻译
- `playground` - 在线试验场翻译

### 语言包示例

```json
// src/locales/zh-CN/common.json
{
  "actions": {
    "save": "保存",
    "cancel": "取消",
    "confirm": "确认"
  },
  "status": {
    "loading": "加载中...",
    "success": "成功",
    "error": "错误"
  },
  "time": {
    "minutes_ago": "{{count}} 分钟前",
    "hours_ago": "{{count}} 小时前"
  }
}
```

### 键命名规范

- 使用点分隔的嵌套结构：`actions.save`
- 支持命名空间前缀：`common:actions.save`
- 插值变量使用双花括号：`{{variable}}`
- 复数形式使用后缀：`items_one`, `items_other`

## 🛠️ 开发工具

### 提取翻译键

```bash
npm run extract-keys
```

扫描项目源码，提取所有 `t('key')` 调用，生成翻译键报告。

### 验证语言包

```bash
npm run validate-locales
```

验证所有语言包的完整性，检测缺失的翻译和未使用的翻译。

## 🧪 测试

```bash
npm test              # 运行测试
npm run test:coverage # 测试覆盖率
```

## 🏗️ 构建

```bash
npm run build         # 构建包
npm run dev           # 开发模式（watch）
npm run type-check    # TypeScript 类型检查
```

## 📝 类型定义

```typescript
// 语言类型
type Locale = 'zh-CN' | 'zh-TW' | 'en-US' | 'ja-JP'

// 命名空间类型
type Namespace = 'common' | 'matrix' | 'gallery' | 'adoption' | 'playground'

// 翻译键类型
type TranslationKey = string

// 配置接口
interface I18nConfig {
  defaultLocale: Locale
  supportedLocales: Locale[]
  fallbackLocale: Locale
  namespaces: Namespace[]
  interpolation?: {
    prefix?: string
    suffix?: string
  }
}
```

## 🤝 贡献

欢迎贡献代码、报告问题或提出建议！

## 📄 许可证

MIT License © Xorigo UI Team

## 🔗 相关链接

- [Xorigo UI 主仓库](https://github.com/xorigo-ui/xorigo-ui)
- [文档](https://xorigo-ui.dev)
- [问题反馈](https://github.com/xorigo-ui/xorigo-ui/issues)

---

**维护**: Xorigo UI Team
**版本**: 0.1.0
**技术栈**: React 19 + TypeScript 5.9 + Intl API
