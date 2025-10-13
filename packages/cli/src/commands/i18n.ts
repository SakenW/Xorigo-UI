/**
 * i18n:extract 命令实现 - 国际化字符串提取
 *
 * 功能：
 * - 扫描组件中的文本字符串
 * - 提取需要翻译的文本
 * - 生成翻译文件模板
 * - 支持多语言配置
 */

import fs from 'fs/promises'
import path from 'path'
import chalk from 'chalk'
import ora from 'ora'

export interface I18nExtractOptions {
  locales: string[]
  source?: string
  output?: string
  overwrite?: boolean
}

// 翻译条目接口
interface TranslationEntry {
  key: string
  defaultMessage: string
  description?: string
  filePath: string
  lineNumber: number
}

// 语言文件结构
interface LocaleFile {
  locale: string
  messages: Record<string, string>
  meta: {
    version: string
    lastUpdated: string
    coverage: number
  }
}

/**
 * 扫描文件中的国际化字符串
 * 支持以下模式：
 * - useTranslation('key')
 * - t('key')
 * - <Trans i18nKey="key">
 */
async function scanI18nStrings(filePath: string): Promise<TranslationEntry[]> {
  const content = await fs.readFile(filePath, 'utf-8')
  const entries: TranslationEntry[] = []

  // 匹配 useTranslation 和 t() 调用
  const patterns = [
    // useTranslation('key', 'default message')
    /useTranslation\s*\(\s*['"]([^'"]+)['"]\s*(?:,\s*['"]([^'"]+)['"]\s*)?\)/g,
    // t('key', 'default message')
    /\bt\s*\(\s*['"]([^'"]+)['"]\s*(?:,\s*['"]([^'"]+)['"]\s*)?\)/g,
    // <Trans i18nKey="key">default message</Trans>
    /<Trans\s+i18nKey=['"]([^'"]+)['"]\s*>([^<]*)<\/Trans>/g,
  ]

  const lines = content.split('\n')

  patterns.forEach((pattern) => {
    let match
    while ((match = pattern.exec(content)) !== null) {
      const [fullMatch, key, defaultMessage] = match
      const lineNumber = content.substring(0, match.index).split('\n').length

      if (key) {
        entries.push({
          key,
          defaultMessage: defaultMessage || key,
          filePath,
          lineNumber,
        })
      }
    }
  })

  return entries
}

/**
 * 递归扫描目录
 */
async function scanDirectory(dir: string): Promise<TranslationEntry[]> {
  const entries: TranslationEntry[] = []
  const items = await fs.readdir(dir, { withFileTypes: true })

  for (const item of items) {
    const fullPath = path.join(dir, item.name)

    if (item.isDirectory()) {
      // 递归扫描子目录
      const subEntries = await scanDirectory(fullPath)
      entries.push(...subEntries)
    } else if (item.isFile() && /\.(tsx?|jsx?)$/.test(item.name)) {
      // 扫描 TypeScript/JavaScript 文件
      const fileEntries = await scanI18nStrings(fullPath)
      entries.push(...fileEntries)
    }
  }

  return entries
}

/**
 * 生成语言文件
 */
function generateLocaleFile(
  locale: string,
  entries: TranslationEntry[],
  existingMessages?: Record<string, string>
): LocaleFile {
  const messages: Record<string, string> = {}

  // 保留已有翻译
  if (existingMessages) {
    Object.assign(messages, existingMessages)
  }

  // 添加新发现的 key（仅当不存在时）
  entries.forEach((entry) => {
    if (!messages[entry.key]) {
      // 对于非默认语言，使用 key 作为占位符
      messages[entry.key] = locale === 'en' ? entry.defaultMessage : `[${locale}] ${entry.key}`
    }
  })

  return {
    locale,
    messages,
    meta: {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      coverage: Object.keys(messages).length / entries.length,
    },
  }
}

/**
 * 加载已有的语言文件
 */
async function loadExistingLocaleFile(filePath: string): Promise<Record<string, string> | null> {
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    const localeFile: LocaleFile = JSON.parse(content)
    return localeFile.messages
  } catch (error) {
    return null
  }
}

/**
 * 生成翻译统计报告
 */
function generateReport(entries: TranslationEntry[], locales: string[]): string {
  const report = [
    chalk.bold('\n📊 国际化字符串提取报告'),
    chalk.gray('━'.repeat(50)),
    '',
    `总计发现 ${chalk.cyan(entries.length)} 个翻译条目`,
    `目标语言: ${chalk.cyan(locales.join(', '))}`,
    '',
    chalk.bold('按文件分布：'),
  ]

  // 统计每个文件的条目数
  const fileStats = entries.reduce(
    (acc, entry) => {
      acc[entry.filePath] = (acc[entry.filePath] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  Object.entries(fileStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .forEach(([file, count]) => {
      const relativePath = path.relative(process.cwd(), file)
      report.push(`  ${chalk.yellow(count.toString().padStart(3))} - ${relativePath}`)
    })

  if (Object.keys(fileStats).length > 10) {
    report.push(`  ${chalk.gray('... 和其他 ' + (Object.keys(fileStats).length - 10) + ' 个文件')}`)
  }

  report.push('')
  return report.join('\n')
}

/**
 * 执行 i18n:extract 命令
 */
export async function executeI18nExtractCommand(options: I18nExtractOptions): Promise<void> {
  const spinner = ora('扫描国际化字符串...').start()

  try {
    // 确定源目录和输出目录
    const sourceDir = options.source || path.join(process.cwd(), 'packages/core/src')
    const outputDir = options.output || path.join(process.cwd(), 'packages/i18n/locales')

    spinner.text = `扫描目录: ${sourceDir}`

    // 扫描所有翻译条目
    const entries = await scanDirectory(sourceDir)

    if (entries.length === 0) {
      spinner.warn(chalk.yellow('未找到任何国际化字符串'))
      return
    }

    spinner.text = '生成语言文件...'

    // 确保输出目录存在
    await fs.mkdir(outputDir, { recursive: true })

    // 为每种语言生成文件
    for (const locale of options.locales) {
      const outputPath = path.join(outputDir, `${locale}.json`)

      // 加载已有翻译（如果存在）
      let existingMessages: Record<string, string> | null = null
      if (!options.overwrite) {
        existingMessages = await loadExistingLocaleFile(outputPath)
      }

      // 生成语言文件
      const localeFile = generateLocaleFile(locale, entries, existingMessages || undefined)

      // 写入文件
      await fs.writeFile(outputPath, JSON.stringify(localeFile, null, 2), 'utf-8')

      spinner.text = `已生成 ${locale}.json...`
    }

    spinner.succeed(chalk.green('✨ 国际化字符串提取成功！'))

    // 输出统计报告
    console.log(generateReport(entries, options.locales))

    // 输出文件路径
    console.log(chalk.bold('生成的文件：'))
    options.locales.forEach((locale) => {
      console.log(chalk.cyan(`  🌐 ${locale}: ${path.join(outputDir, `${locale}.json`)}`))
    })

    console.log(chalk.gray('\n下一步：'))
    console.log(chalk.yellow('  1. 检查生成的语言文件'))
    console.log(chalk.yellow('  2. 翻译非默认语言的字符串'))
    console.log(chalk.yellow('  3. 在应用中加载语言文件'))
  } catch (error) {
    spinner.fail(chalk.red('国际化字符串提取失败'))
    throw error
  }
}
