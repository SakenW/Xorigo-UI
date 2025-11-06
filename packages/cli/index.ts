#!/usr/bin/env node
/**
 * Xorigo UI 组件注册系统 CLI 工具
 * 用于扫描、注册、验证和管理组件库
 */

import { Command } from 'commander'
import { ComponentScanner } from '../../../apps/website/src/components/workbench/ComponentScanner'
import { ComponentCache } from '../../../apps/website/src/components/workbench/ComponentCache'
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

const program = new Command()

// ============================================================================
// 全局选项
// ============================================================================

program
  .name('xorigo-component-registry')
  .description('Xorigo UI 组件注册系统 CLI 工具')
  .version('1.0.0')

// ============================================================================
// 扫描命令
// ============================================================================

program
  .command('scan')
  .description('扫描组件文件并生成注册表')
  .requiredOption('-p, --path <path>', '组件目录路径')
  .option('-o, --output <file>', '输出文件路径', 'component-registry.json')
  .option('--format <format>', '输出格式 (json|yaml)', 'json')
  .option('--include-test', '包含测试文件', false)
  .option('--parallel', '并行扫描', true)
  .option('--exclude <patterns>', '排除模式 (逗号分隔)')
  .action(async (options) => {
    try {
      console.log('🔍 开始扫描组件...\n')

      const scanner = new ComponentScanner({
        rootPath: options.path,
        includeTestFiles: options.includeTest,
        excludePatterns: options.exclude ? options.exclude.split(',') : undefined,
        parallel: options.parallel
      })

      const result = await scanner.scan()

      console.log(`✅ 扫描完成!\n`)
      console.log(`📊 扫描统计:`)
      console.log(`   总文件数: ${result.stats.totalFiles}`)
      console.log(`   扫描文件: ${result.stats.scannedFiles}`)
      console.log(`   有效组件: ${result.stats.validComponents}`)
      console.log(`   无效组件: ${result.stats.invalidComponents}`)
      console.log(`   跳过文件: ${result.stats.skippedFiles}`)
      console.log(`   扫描时间: ${result.stats.scanTime}ms\n`)

      if (result.errors.length > 0) {
        console.log(`⚠️  发现 ${result.errors.length} 个错误:`)
        result.errors.slice(0, 10).forEach(error => {
          console.log(`   - ${error.filePath}: ${error.message}`)
        })
        if (result.errors.length > 10) {
          console.log(`   ... 还有 ${result.errors.length - 10} 个错误`)
        }
        console.log()
      }

      // 输出结果
      if (options.output) {
        const outputPath = join(process.cwd(), options.output)
        const outputDir = outputPath.substring(0, outputPath.lastIndexOf('/'))
        if (!existsSync(outputDir)) {
          mkdirSync(outputDir, { recursive: true })
        }

        const content = options.format === 'yaml'
          ? toYAML(result.metadata)
          : JSON.stringify(result.metadata, null, 2)

        writeFileSync(outputPath, content)
        console.log(`💾 注册表已保存到: ${outputPath}\n`)
      }

      process.exit(0)
    } catch (error) {
      console.error('❌ 扫描失败:', error instanceof Error ? error.message : error)
      process.exit(1)
    }
  })

// ============================================================================
// 缓存命令
// ============================================================================

program
  .command('cache')
  .description('管理组件注册缓存')
  .requiredOption('-a, --action <action>', '操作 (get|set|clear|warmup)')
  .option('-i, --id <id>', '组件ID')
  .option('-f, --file <file>', '组件注册文件')
  .action(async (options) => {
    try {
      const cache = new ComponentCache({
        maxSize: 100 * 1024 * 1024,
        maxAge: 300000,
        compression: false,
        storageType: 'memory',
        enableMetrics: true
      })

      switch (options.action) {
        case 'get':
          if (!options.id) {
            console.error('❌ 请指定组件ID')
            process.exit(1)
          }
          const component = await cache.getComponent(options.id)
          if (component) {
            console.log(JSON.stringify(component, null, 2))
          } else {
            console.log(`未找到组件: ${options.id}`)
          }
          break

        case 'set':
          if (!options.file) {
            console.error('❌ 请指定组件注册文件')
            process.exit(1)
          }
          if (!existsSync(options.file)) {
            console.error(`❌ 文件不存在: ${options.file}`)
            process.exit(1)
          }
          const data = JSON.parse(readFileSync(options.file, 'utf-8'))
          if (Array.isArray(data)) {
            await cache.setComponents(data)
            console.log(`✅ 已缓存 ${data.length} 个组件`)
          } else {
            await cache.setComponent(data)
            console.log(`✅ 已缓存组件: ${data.id}`)
          }
          break

        case 'clear':
          await cache.clear()
          console.log('✅ 缓存已清空')
          break

        case 'warmup':
          if (!options.file) {
            console.error('❌ 请指定组件注册文件')
            process.exit(1)
          }
          const warmupData = JSON.parse(readFileSync(options.file, 'utf-8'))
          await cache.warmup(warmupData)
          console.log('✅ 缓存预热完成')
          break

        default:
          console.error(`❌ 未知操作: ${options.action}`)
          process.exit(1)
      }

      // 显示缓存指标
      const metrics = cache.getMetrics()
      console.log(`\n📊 缓存指标:`)
      console.log(`   命中率: ${metrics.hitRate.toFixed(2)}%`)
      console.log(`   总请求: ${metrics.totalRequests}`)
      console.log(`   命中: ${metrics.hits}`)
      console.log(`   未命中: ${metrics.misses}`)
      console.log(`   内存使用: ${(metrics.memoryUsage / 1024 / 1024).toFixed(2)} MB`)
      console.log(`   平均响应时间: ${metrics.averageResponseTime.toFixed(2)}ms`)

      process.exit(0)
    } catch (error) {
      console.error('❌ 操作失败:', error instanceof Error ? error.message : error)
      process.exit(1)
    }
  })

// ============================================================================
// 验证命令
// ============================================================================

program
  .command('validate')
  .description('验证组件注册表')
  .requiredOption('-f, --file <file>', '组件注册文件')
  .option('--strict', '严格模式', false)
  .action(async (options) => {
    try {
      console.log('🔍 验证组件注册表...\n')

      const data = JSON.parse(readFileSync(options.file, 'utf-8'))
      const components = Array.isArray(data) ? data : data.components || []

      let validCount = 0
      let invalidCount = 0
      const errors: string[] = []

      for (const component of components) {
        const validation = validateComponent(component, options.strict)
        if (validation.valid) {
          validCount++
        } else {
          invalidCount++
          errors.push(...validation.errors)
        }
      }

      console.log(`✅ 验证完成!\n`)
      console.log(`📊 验证结果:`)
      console.log(`   有效组件: ${validCount}`)
      console.log(`   无效组件: ${invalidCount}`)
      console.log(`   有效率: ${((validCount / (validCount + invalidCount)) * 100).toFixed(2)}%\n`)

      if (errors.length > 0) {
        console.log(`⚠️  发现 ${errors.length} 个问题:`)
        errors.slice(0, 20).forEach((error, index) => {
          console.log(`   ${index + 1}. ${error}`)
        })
        if (errors.length > 20) {
          console.log(`   ... 还有 ${errors.length - 20} 个问题`)
        }
        console.log()
      }

      process.exit(invalidCount > 0 ? 1 : 0)
    } catch (error) {
      console.error('❌ 验证失败:', error instanceof Error ? error.message : error)
      process.exit(1)
    }
  })

// ============================================================================
// 报告命令
// ============================================================================

program
  .command('report')
  .description('生成组件注册表报告')
  .requiredOption('-f, --file <file>', '组件注册文件')
  .option('-o, --output <file>', '输出文件路径', 'component-report.md')
  .action(async (options) => {
    try {
      console.log('📝 生成组件注册表报告...\n')

      const data = JSON.parse(readFileSync(options.file, 'utf-8'))
      const components = Array.isArray(data) ? data : data.components || []

      // 统计分析
      const stats = analyzeComponents(components)

      // 生成Markdown报告
      const report = generateReport(stats)

      // 写入文件
      writeFileSync(options.output, report)

      console.log(`✅ 报告已生成: ${options.output}\n`)
      console.log(`📊 报告内容:`)
      console.log(`   总组件数: ${stats.totalComponents}`)
      console.log(`   分类数量: ${Object.keys(stats.byCategory).length}`)
      console.log(`   标签数量: ${stats.totalTags}`)
      console.log(`   平均属性数: ${stats.averageProps.toFixed(2)}`)
      console.log(`   有示例组件: ${stats.componentsWithExamples}`)

      process.exit(0)
    } catch (error) {
      console.error('❌ 生成报告失败:', error instanceof Error ? error.message : error)
      process.exit(1)
    }
  })

// ============================================================================
// 导入导出命令
// ============================================================================

program
  .command('export')
  .description('导出组件注册表到指定格式')
  .requiredOption('-f, --file <file>', '组件注册文件')
  .requiredOption('-t, --to <format>', '目标格式 (json|yaml|csv)')
  .option('-o, --output <file>', '输出文件路径')
  .action(async (options) => {
    try {
      const data = JSON.parse(readFileSync(options.file, 'utf-8'))
      const components = Array.isArray(data) ? data : data.components || []

      let content = ''
      let outputPath = options.output || `components.${options.to}`

      switch (options.to) {
        case 'json':
          content = JSON.stringify(components, null, 2)
          break

        case 'yaml':
          content = toYAML(components)
          break

        case 'csv':
          content = toCSV(components)
          break

        default:
          console.error(`❌ 不支持的格式: ${options.to}`)
          process.exit(1)
      }

      writeFileSync(outputPath, content)
      console.log(`✅ 已导出 ${components.length} 个组件到 ${outputPath}`)

      process.exit(0)
    } catch (error) {
      console.error('❌ 导出失败:', error instanceof Error ? error.message : error)
      process.exit(1)
    }
  })

program
  .command('import')
  .description('导入组件注册表')
  .requiredOption('-f, --file <file>', '源文件')
  .option('-t, --to <format>', '目标格式 (json)', 'json')
  .option('-o, --output <file>', '输出文件路径', 'component-registry.json')
  .action(async (options) => {
    try {
      console.log(`📥 导入组件注册表...`)

      let content = ''

      if (options.file.endsWith('.json')) {
        content = readFileSync(options.file, 'utf-8')
      } else if (options.file.endsWith('.yaml') || options.file.endsWith('.yml')) {
        // 简化实现：需要添加 yaml 依赖
        console.error('❌ YAML 导入需要添加 yaml 依赖')
        process.exit(1)
      } else {
        console.error(`❌ 不支持的文件格式: ${options.file}`)
        process.exit(1)
      }

      writeFileSync(options.output, content)
      console.log(`✅ 已导入到 ${options.output}`)

      process.exit(0)
    } catch (error) {
      console.error('❌ 导入失败:', error instanceof Error ? error.message : error)
      process.exit(1)
    }
  })

// ============================================================================
// 工具函数
// ============================================================================

function validateComponent(component: any, strict: boolean): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!component.id) errors.push('缺少 id 字段')
  if (!component.name) errors.push('缺少 name 字段')
  if (!component.description) errors.push('缺少 description 字段')
  if (!component.category) errors.push('缺少 category 字段')
  if (!Array.isArray(component.props)) errors.push('props 必须是数组')
  if (!Array.isArray(component.tags)) errors.push('tags 必须是数组')

  if (strict) {
    if (!component.version) errors.push('缺少 version 字段')
    if (!component.filePath) errors.push('缺少 filePath 字段')
    if (component.props.length === 0) errors.push('组件至少需要定义一个属性')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

function analyzeComponents(components: any[]): any {
  const categories: Record<string, number> = {}
  const tags: Record<string, number> = {}
  let totalProps = 0
  let componentsWithExamples = 0

  components.forEach(comp => {
    categories[comp.category] = (categories[comp.category] || 0) + 1

    comp.tags?.forEach((tag: string) => {
      tags[tag] = (tags[tag] || 0) + 1
    })

    totalProps += comp.props?.length || 0

    if (comp.examples && comp.examples.length > 0) {
      componentsWithExamples++
    }
  })

  return {
    totalComponents: components.length,
    byCategory: categories,
    byTag: tags,
    totalTags: Object.keys(tags).length,
    averageProps: components.length > 0 ? totalProps / components.length : 0,
    componentsWithExamples
  }
}

function generateReport(stats: any): string {
  let report = `# 组件注册表报告\n\n`
  report += `生成时间: ${new Date().toLocaleString()}\n\n`

  report += `## 概览\n\n`
  report += `- 总组件数: **${stats.totalComponents}**\n`
  report += `- 分类数量: **${Object.keys(stats.byCategory).length}**\n`
  report += `- 标签数量: **${stats.totalTags}**\n`
  report += `- 平均属性数: **${stats.averageProps.toFixed(2)}**\n`
  report += `- 有示例组件: **${stats.componentsWithExamples}**\n\n`

  report += `## 分类分布\n\n`
  Object.entries(stats.byCategory)
    .sort((a: any, b: any) => b[1] - a[1])
    .forEach(([category, count]: any) => {
      const percentage = ((count / stats.totalComponents) * 100).toFixed(1)
      report += `- **${category}**: ${count} (${percentage}%)\n`
    })
  report += `\n`

  report += `## 热门标签 (Top 20)\n\n`
  Object.entries(stats.byTag)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 20)
    .forEach(([tag, count]: any) => {
      report += `- **${tag}**: ${count}\n`
    })
  report += `\n`

  return report
}

function toYAML(data: any[]): string {
  // 简化实现：需要添加 yaml 依赖
  return JSON.stringify(data, null, 2)
}

function toCSV(components: any[]): string {
  if (components.length === 0) return ''

  const headers = ['id', 'name', 'displayName', 'description', 'category', 'version', 'tags', 'propsCount', 'examplesCount']
  const rows = components.map(comp => [
    comp.id,
    comp.name,
    comp.displayName,
    comp.description.replace(/"/g, '""'),
    comp.category,
    comp.version,
    comp.tags.join(';'),
    comp.props?.length || 0,
    comp.examples?.length || 0
  ])

  const csv = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n')
  return csv
}

// ============================================================================
// 解析命令行参数并执行
// ============================================================================

program.parse()
