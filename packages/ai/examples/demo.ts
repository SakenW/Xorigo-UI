#!/usr/bin/env node
/**
 * AI助手自然语言解析器演示脚本
 *
 * 运行方式：
 * npx tsx examples/demo.ts
 */

import { createParser, formatParseResult, EXAMPLES } from '../src/index.js'

async function demo() {
  console.log('='.repeat(80))
  console.log('🤖 AI助手自然语言解析器演示')
  console.log('='.repeat(80))
  console.log()

  // 创建解析器实例（不配置API密钥，仅演示解析逻辑）
  const parser = createParser({
    language: 'zh',
    enableCache: false
  })

  // 中文示例
  console.log('📝 中文示例演示')
  console.log('-'.repeat(80))

  const zhExamples = [
    '创建一个主要的大按钮，深色主题',
    '设计一个输入框，支持错误状态和验证',
    '生成一个表格，可排序和分页'
  ]

  for (const example of zhExamples) {
    console.log(`\n输入: "${example}"`)
    console.log('-'.repeat(80))

    try {
      const result = await parser.parse(example)

      console.log('\n✅ 解析结果:')
      console.log(formatParseResult(result, 'zh'))

      console.log('\n📊 详细信息:')
      console.log(`  - 组件类型: ${result.component || '未检测到'}`)
      console.log(`  - 置信度: ${(result.confidence * 100).toFixed(1)}%`)
      console.log(`  - 检测语言: ${result.language}`)
      console.log(`  - 实体数量: ${result.entities.length}`)
      console.log(`  - 需求数量: ${result.requirements.length}`)
      console.log(`  - 约束数量: ${result.constraints.length}`)
    } catch (error) {
      console.log(`❌ 解析失败: ${error.message}`)
    }
  }

  console.log('\n\n📝 英文示例演示')
  console.log('-'.repeat(80))

  const enExamples = [
    'Create a primary button with large size',
    'Design an input with error state',
    'Generate a sortable table'
  ]

  for (const example of enExamples) {
    console.log(`\n输入: "${example}"`)
    console.log('-'.repeat(80))

    try {
      const result = await parser.parse(example)

      console.log('\n✅ 解析结果:')
      console.log(formatParseResult(result, 'en'))

      console.log('\n📊 详细信息:')
      console.log(`  - Component Type: ${result.component || 'Not detected'}`)
      console.log(`  - Confidence: ${(result.confidence * 100).toFixed(1)}%`)
      console.log(`  - Language: ${result.language}`)
      console.log(`  - Entities: ${result.entities.length}`)
      console.log(`  - Requirements: ${result.requirements.length}`)
    } catch (error) {
      console.log(`❌ Parsing failed: ${error.message}`)
    }
  }

  console.log('\n\n📊 性能指标')
  console.log('-'.repeat(80))

  const report = parser.getPerformanceReport()
  console.log(`  - 总请求数: ${report.totalRequests}`)
  console.log(`  - 平均延迟: ${report.avgLatency.toFixed(2)}ms`)
  console.log(`  - P95延迟: ${report.p95Latency.toFixed(2)}ms`)
  console.log(`  - 缓存命中率: ${(report.cacheHitRate * 100).toFixed(1)}%`)
  console.log(`  - 平均成本: $${report.avgCost.toFixed(4)}`)

  console.log('\n\n✨ 演示完成')
  console.log('='.repeat(80))
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  demo().catch(error => {
    console.error('演示运行失败:', error)
    process.exit(1)
  })
}

export { demo }
