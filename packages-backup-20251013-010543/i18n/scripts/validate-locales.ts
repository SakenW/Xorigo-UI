#!/usr/bin/env tsx

/**
 * 语言包验证工具
 *
 * 验证所有语言包的键完整性
 * 检测缺失的翻译和未使用的翻译
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

type Namespace = 'common' | 'matrix' | 'gallery' | 'adoption' | 'playground'
type Locale = 'zh-CN' | 'zh-TW' | 'en-US' | 'ja-JP'

class LocaleValidator {
  private localesPath: string

  constructor() {
    this.localesPath = path.join(__dirname, '../src/locales')
  }

  /**
   * 验证所有语言包
   */
  async validateAll(): Promise<void> {
    console.log('🔍 开始验证语言包完整性...\n')

    const locales: Locale[] = ['zh-CN', 'zh-TW', 'en-US', 'ja-JP']
    const namespaces: Namespace[] = ['common', 'matrix', 'gallery', 'adoption', 'playground']

    // 以 zh-CN 为基准
    const baseLocale = 'zh-CN'
    const baseKeys = this.getAllKeys(baseLocale, namespaces)

    console.log(`📊 基准语言 (${baseLocale}) 共有 ${baseKeys.size} 个翻译键\n`)

    for (const locale of locales) {
      if (locale === baseLocale) continue

      console.log(`\n📋 验证 ${locale} 语言包...`)

      const localeKeys = this.getAllKeys(locale, namespaces)
      const missingKeys = this.findMissingKeys(baseKeys, localeKeys)
      const extraKeys = this.findMissingKeys(localeKeys, baseKeys)

      // 缺失的键
      if (missingKeys.length === 0) {
        console.log(`  ✅ 无缺失键`)
      } else {
        console.log(`  ❌ 缺少 ${missingKeys.length} 个键:`)
        missingKeys.slice(0, 5).forEach((key) => console.log(`     - ${key}`))
        if (missingKeys.length > 5) {
          console.log(`     ... 还有 ${missingKeys.length - 5} 个`)
        }
      }

      // 多余的键
      if (extraKeys.length > 0) {
        console.log(`  ⚠️  多余 ${extraKeys.length} 个键:`)
        extraKeys.slice(0, 5).forEach((key) => console.log(`     - ${key}`))
        if (extraKeys.length > 5) {
          console.log(`     ... 还有 ${extraKeys.length - 5} 个`)
        }
      }

      // 计算完整度
      const completeness = ((localeKeys.size / baseKeys.size) * 100).toFixed(2)
      console.log(`  📊 完整度: ${completeness}%`)
    }

    console.log('\n🎉 验证完成')
  }

  /**
   * 获取所有翻译键
   */
  private getAllKeys(locale: Locale, namespaces: Namespace[]): Set<string> {
    const keys = new Set<string>()

    for (const namespace of namespaces) {
      const filePath = path.join(this.localesPath, locale, `${namespace}.json`)

      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8')
        const messages = JSON.parse(content)
        this.extractKeys(messages, namespace, '', keys)
      }
    }

    return keys
  }

  /**
   * 递归提取键
   */
  private extractKeys(
    obj: any,
    namespace: string,
    prefix: string,
    keys: Set<string>
  ): void {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key

      if (typeof value === 'object' && value !== null) {
        this.extractKeys(value, namespace, fullKey, keys)
      } else {
        keys.add(`${namespace}:${fullKey}`)
      }
    }
  }

  /**
   * 查找缺失的键
   */
  private findMissingKeys(baseKeys: Set<string>, targetKeys: Set<string>): string[] {
    const missing: string[] = []

    for (const key of baseKeys) {
      if (!targetKeys.has(key)) {
        missing.push(key)
      }
    }

    return missing
  }

  /**
   * 验证 JSON 格式
   */
  validateJsonFormat(): void {
    console.log('🔍 验证 JSON 格式...\n')

    const locales: Locale[] = ['zh-CN', 'zh-TW', 'en-US', 'ja-JP']
    const namespaces: Namespace[] = ['common', 'matrix', 'gallery', 'adoption', 'playground']

    let hasErrors = false

    for (const locale of locales) {
      for (const namespace of namespaces) {
        const filePath = path.join(this.localesPath, locale, `${namespace}.json`)

        if (!fs.existsSync(filePath)) {
          console.log(`❌ 文件不存在: ${filePath}`)
          hasErrors = true
          continue
        }

        try {
          const content = fs.readFileSync(filePath, 'utf-8')
          JSON.parse(content)
        } catch (error) {
          console.log(`❌ JSON 格式错误: ${filePath}`)
          console.log(`   ${(error as Error).message}`)
          hasErrors = true
        }
      }
    }

    if (!hasErrors) {
      console.log('✅ 所有 JSON 文件格式正确')
    }
  }
}

/**
 * 主函数
 */
async function main() {
  const validator = new LocaleValidator()

  // 验证 JSON 格式
  validator.validateJsonFormat()

  console.log('\n' + '='.repeat(60) + '\n')

  // 验证完整性
  await validator.validateAll()
}

main().catch(console.error)
