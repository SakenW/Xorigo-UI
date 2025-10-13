#!/usr/bin/env tsx
/**
 * ⚡ 搜索性能测试
 *
 * 测试搜索系统性能，确保达到 ≤ 50ms 目标
 *
 * 使用方式:
 *   npm run test:search-performance
 *   tsx scripts/test-search-performance.ts
 */

import Fuse from 'fuse.js'
import { readFileSync } from 'fs'
import { join } from 'path'

// ============================================================================
// 配置
// ============================================================================

const PERFORMANCE_TARGET_MS = 50
const TEST_ITERATIONS = 100
const SEARCH_INDEX_DIR = join(process.cwd(), 'public', 'search-index')

// 测试查询
const TEST_QUERIES = [
  'button',
  'card',
  'input',
  'modal',
  'navigation',
  'form',
  'dark',
  'light',
  'responsive',
  'accessible',
]

// ============================================================================
// 性能测试
// ============================================================================

interface PerformanceResult {
  query: string
  iterations: number
  avgTime: number
  minTime: number
  maxTime: number
  passTarget: boolean
  resultCount: number
}

async function testSearchPerformance(): Promise<PerformanceResult[]> {
  console.log('⚡ 开始搜索性能测试...\n')

  // 加载搜索索引
  console.log('📦 加载搜索索引...')
  const componentData = loadComponentIndex()
  const recipeData = loadRecipeIndex()
  console.log(`   组件: ${componentData.length} 项`)
  console.log(`   配方: ${recipeData.length} 项\n`)

  // 创建 Fuse 实例
  const componentFuse = new Fuse(componentData, {
    threshold: 0.3,
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 2,
    ignoreLocation: true,
    keys: [
      { name: 'name', weight: 2.0 },
      { name: 'description', weight: 1.0 },
      { name: 'category', weight: 0.5 },
      { name: 'tags', weight: 0.8 },
    ],
  })

  const recipeFuse = new Fuse(recipeData, {
    threshold: 0.3,
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 2,
    ignoreLocation: true,
    keys: [
      { name: 'name', weight: 2.0 },
      { name: 'description', weight: 1.0 },
      { name: 'tags', weight: 0.8 },
      { name: 'category', weight: 0.5 },
      { name: 'mode', weight: 0.4 },
      { name: 'base', weight: 0.3 },
      { name: 'accent', weight: 0.3 },
    ],
  })

  // 执行性能测试
  console.log('🏃 执行性能测试...\n')
  const results: PerformanceResult[] = []

  for (const query of TEST_QUERIES) {
    const times: number[] = []

    // 预热
    componentFuse.search(query)
    recipeFuse.search(query)

    // 测试迭代
    for (let i = 0; i < TEST_ITERATIONS; i++) {
      const startTime = performance.now()

      const componentResults = componentFuse.search(query, { limit: 20 })
      const recipeResults = recipeFuse.search(query, { limit: 20 })
      const allResults = [...componentResults, ...recipeResults]

      const endTime = performance.now()
      times.push(endTime - startTime)
    }

    // 计算统计
    const avgTime = times.reduce((sum, t) => sum + t, 0) / times.length
    const minTime = Math.min(...times)
    const maxTime = Math.max(...times)
    const passTarget = avgTime <= PERFORMANCE_TARGET_MS

    // 获取结果数量
    const componentResults = componentFuse.search(query)
    const recipeResults = recipeFuse.search(query)
    const resultCount = componentResults.length + recipeResults.length

    results.push({
      query,
      iterations: TEST_ITERATIONS,
      avgTime,
      minTime,
      maxTime,
      passTarget,
      resultCount,
    })
  }

  return results
}

// ============================================================================
// 辅助函数
// ============================================================================

function loadComponentIndex(): any[] {
  const path = join(SEARCH_INDEX_DIR, 'components.json')
  try {
    const content = readFileSync(path, 'utf-8')
    return JSON.parse(content)
  } catch {
    console.warn('⚠️  组件索引不存在，请先运行: npm run build:search-index')
    return []
  }
}

function loadRecipeIndex(): any[] {
  const path = join(SEARCH_INDEX_DIR, 'recipes.json')
  try {
    const content = readFileSync(path, 'utf-8')
    return JSON.parse(content)
  } catch {
    console.warn('⚠️  配方索引不存在，请先运行: npm run build:search-index')
    return []
  }
}

function printResults(results: PerformanceResult[]) {
  console.log('📊 性能测试结果\n')
  console.log('─'.repeat(90))
  console.log(
    '查询关键词'.padEnd(15),
    '平均耗时'.padEnd(12),
    '最小耗时'.padEnd(12),
    '最大耗时'.padEnd(12),
    '结果数量'.padEnd(12),
    '状态'
  )
  console.log('─'.repeat(90))

  let passCount = 0

  results.forEach((result) => {
    const avgStr = `${result.avgTime.toFixed(2)}ms`.padEnd(12)
    const minStr = `${result.minTime.toFixed(2)}ms`.padEnd(12)
    const maxStr = `${result.maxTime.toFixed(2)}ms`.padEnd(12)
    const countStr = `${result.resultCount}`.padEnd(12)
    const status = result.passTarget ? '✅ PASS' : '❌ FAIL'

    console.log(
      result.query.padEnd(15),
      avgStr,
      minStr,
      maxStr,
      countStr,
      status
    )

    if (result.passTarget) passCount++
  })

  console.log('─'.repeat(90))
  console.log('')

  // 总结
  console.log('📈 总结:')
  console.log(
    `   通过率: ${passCount}/${results.length} (${((passCount / results.length) * 100).toFixed(1)}%)`
  )
  console.log(`   性能目标: ≤ ${PERFORMANCE_TARGET_MS}ms`)
  console.log(`   测试迭代: ${TEST_ITERATIONS} 次\n`)

  // 统计信息
  const avgTimes = results.map((r) => r.avgTime)
  const overallAvg = avgTimes.reduce((sum, t) => sum + t, 0) / avgTimes.length
  const overallMin = Math.min(...avgTimes)
  const overallMax = Math.max(...avgTimes)

  console.log('📊 统计:')
  console.log(`   总体平均: ${overallAvg.toFixed(2)}ms`)
  console.log(`   最快查询: ${overallMin.toFixed(2)}ms`)
  console.log(`   最慢查询: ${overallMax.toFixed(2)}ms\n`)

  // 性能建议
  if (passCount < results.length) {
    console.log('💡 性能优化建议:')
    console.log('   1. 考虑减小搜索索引大小')
    console.log('   2. 调整 Fuse.js threshold 参数')
    console.log('   3. 使用 Web Worker 处理搜索')
    console.log('   4. 实现搜索结果缓存\n')
  } else {
    console.log('✨ 所有查询均通过性能目标！\n')
  }
}

// ============================================================================
// 主函数
// ============================================================================

async function main() {
  try {
    const results = await testSearchPerformance()
    printResults(results)

    // 退出码
    const allPassed = results.every((r) => r.passTarget)
    process.exit(allPassed ? 0 : 1)
  } catch (error) {
    console.error('❌ 测试失败:', error)
    process.exit(1)
  }
}

main()
