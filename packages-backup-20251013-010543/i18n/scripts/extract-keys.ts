#!/usr/bin/env tsx

/**
 * 翻译键提取工具
 *
 * 扫描 TypeScript/TSX 文件，提取 t('key') 调用
 * 生成缺失翻译报告
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

interface TranslationKey {
  key: string
  namespace: string
  file: string
  line: number
}

class KeyExtractor {
  private keys: TranslationKey[] = []

  /**
   * 从文件中提取翻译键
   */
  extractFromFile(filePath: string): void {
    const content = fs.readFileSync(filePath, 'utf-8')
    const lines = content.split('\n')

    lines.forEach((line, index) => {
      // 匹配 t('key') 或 t("key") 或 t(`key`)
      const patterns = [
        /t\(['"]([^'"]+)['"]\)/g,
        /t\(`([^`]+)`\)/g,
      ]

      patterns.forEach((pattern) => {
        let match
        while ((match = pattern.exec(line)) !== null) {
          const key = match[1]
          const namespace = this.inferNamespace(filePath, key)

          this.keys.push({
            key,
            namespace,
            file: filePath,
            line: index + 1,
          })
        }
      })
    })
  }

  /**
   * 推断命名空间
   */
  private inferNamespace(filePath: string, key: string): string {
    // 如果键包含命名空间前缀，直接使用
    if (key.includes(':')) {
      return key.split(':')[0]
    }

    // 根据文件路径推断命名空间
    if (filePath.includes('matrix')) return 'matrix'
    if (filePath.includes('gallery')) return 'gallery'
    if (filePath.includes('adoption')) return 'adoption'
    if (filePath.includes('playground')) return 'playground'

    return 'common'
  }

  /**
   * 递归扫描目录
   */
  scanDirectory(dirPath: string): void {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name)

      if (entry.isDirectory()) {
        // 跳过 node_modules 和 dist
        if (entry.name === 'node_modules' || entry.name === 'dist') {
          continue
        }
        this.scanDirectory(fullPath)
      } else if (entry.isFile()) {
        // 只处理 .ts, .tsx, .js, .jsx 文件
        if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
          this.extractFromFile(fullPath)
        }
      }
    }
  }

  /**
   * 生成报告
   */
  generateReport(): TranslationKey[] {
    return this.keys
  }

  /**
   * 检查缺失的翻译键
   */
  checkMissingKeys(locale: string): string[] {
    const missing: string[] = []
    const localePath = path.join(__dirname, `../src/locales/${locale}`)

    if (!fs.existsSync(localePath)) {
      console.error(`Locale directory not found: ${localePath}`)
      return missing
    }

    for (const { key, namespace } of this.keys) {
      const namespacePath = path.join(localePath, `${namespace}.json`)

      if (fs.existsSync(namespacePath)) {
        const messages = JSON.parse(fs.readFileSync(namespacePath, 'utf-8'))
        const cleanKey = key.includes(':') ? key.split(':')[1] : key

        if (!this.hasKey(messages, cleanKey)) {
          missing.push(`${namespace}:${cleanKey}`)
        }
      } else {
        missing.push(`${namespace}:${key} (namespace file missing)`)
      }
    }

    return [...new Set(missing)] // 去重
  }

  /**
   * 检查键是否存在
   */
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

/**
 * 主函数
 */
async function main() {
  console.log('🔍 开始提取翻译键...\n')

  const extractor = new KeyExtractor()
  const projectRoot = path.join(__dirname, '../../..')

  // 扫描项目源码
  const sourceDirs = [
    path.join(projectRoot, 'packages'),
    path.join(projectRoot, 'apps'),
    path.join(projectRoot, 'src'),
  ]

  for (const dir of sourceDirs) {
    if (fs.existsSync(dir)) {
      console.log(`📂 扫描目录: ${dir}`)
      extractor.scanDirectory(dir)
    }
  }

  const keys = extractor.generateReport()
  console.log(`\n✅ 找到 ${keys.length} 个翻译键\n`)

  // 检查每种语言的完整性
  const locales = ['zh-CN', 'zh-TW', 'en-US', 'ja-JP']

  for (const locale of locales) {
    console.log(`\n📋 检查 ${locale} 语言包...`)
    const missing = extractor.checkMissingKeys(locale)

    if (missing.length === 0) {
      console.log(`✅ ${locale} 语言包完整`)
    } else {
      console.log(`❌ ${locale} 语言包缺少 ${missing.length} 个键:`)
      missing.slice(0, 10).forEach((key) => console.log(`   - ${key}`))

      if (missing.length > 10) {
        console.log(`   ... 还有 ${missing.length - 10} 个`)
      }
    }
  }

  console.log('\n🎉 提取完成')
}

main().catch(console.error)
