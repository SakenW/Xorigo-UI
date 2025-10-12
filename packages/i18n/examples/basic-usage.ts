/**
 * @th-ui/i18n 基础使用示例
 */

import { I18nManager } from '../src/core/I18nManager'

async function basicUsageExample() {
  console.log('=== @th-ui/i18n 基础使用示例 ===\n')

  // 1. 获取单例实例
  const i18n = I18nManager.getInstance({
    defaultLocale: 'zh-CN',
    supportedLocales: ['zh-CN', 'en-US'],
    namespaces: ['common'],
  })

  console.log('✓ I18nManager 实例创建成功')

  // 2. 初始化
  await i18n.initialize()
  console.log(`✓ 初始化完成，当前语言: ${i18n.getLocale()}\n`)

  // 3. 基础翻译
  console.log('--- 基础翻译 ---')
  console.log('t("actions.save"):', i18n.t('actions.save', undefined, { namespace: 'common' }))
  console.log('t("actions.cancel"):', i18n.t('actions.cancel', undefined, { namespace: 'common' }))
  console.log('t("common:actions.confirm"):', i18n.t('common:actions.confirm'))
  console.log()

  // 4. 插值
  console.log('--- 插值示例 ---')
  console.log('t("time.minutes_ago", { count: 5 }):', i18n.t('time.minutes_ago', { count: 5 }))
  console.log('t("validation.min_length", { min: 6 }):', i18n.t('validation.min_length', { min: 6 }))
  console.log()

  // 5. 数字格式化
  console.log('--- 数字格式化 ---')
  console.log('formatNumber(1234.56):', i18n.formatNumber(1234.56))
  console.log('formatNumber(1234.56, { style: "currency", currency: "CNY" }):',
    i18n.formatNumber(1234.56, { style: 'currency', currency: 'CNY' }))
  console.log()

  // 6. 日期格式化
  console.log('--- 日期格式化 ---')
  const date = new Date('2024-01-01')
  console.log('formatDate(date):', i18n.formatDate(date))
  console.log('formatDate(date, { year: "numeric", month: "long", day: "numeric" }):',
    i18n.formatDate(date, { year: 'numeric', month: 'long', day: 'numeric' }))
  console.log()

  // 7. 切换语言
  console.log('--- 切换到英语 ---')
  await i18n.changeLocale('en-US')
  console.log(`当前语言: ${i18n.getLocale()}`)
  console.log('t("actions.save"):', i18n.t('actions.save', undefined, { namespace: 'common' }))
  console.log('t("actions.cancel"):', i18n.t('actions.cancel', undefined, { namespace: 'common' }))
  console.log()

  // 8. 检查键是否存在
  console.log('--- 键存在性检查 ---')
  console.log('exists("actions.save"):', i18n.exists('actions.save', { namespace: 'common' }))
  console.log('exists("nonexistent.key"):', i18n.exists('nonexistent.key', { namespace: 'common' }))
  console.log()

  console.log('=== 示例完成 ===')
}

// 运行示例
basicUsageExample().catch(console.error)
