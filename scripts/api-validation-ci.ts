#!/usr/bin/env node

/**
 * Xorigo UI API 一致性验证 CI/CD 脚本
 *
 * 用于在CI/CD流水线中自动验证组件API一致性
 */

import { program } from 'commander'
import * as fs from 'fs/promises'
import * as path from 'path'
import { fileURLToPath } from 'url'

// 导入验证模块
import { ComponentScanner } from '../packages/core/src/component-scanner'
import { APIValidator } from '../packages/core/src/api-validator'
import { RegressionTestFramework } from '../packages/core/src/regression-test-framework'

// ============================================================================
// 命令行配置
// ============================================================================

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

program
  .name('api-validation-ci')
  .description('Xorigo UI API 一致性验证 CI/CD 工具')
  .version('1.0.0')

program
  .command('validate')
  .description('执行API一致性验证')
  .option('-d, --directory <dir>', '项目根目录', projectRoot)
  .option('-o, --output <file>', '输出报告文件路径', 'api-validation-report.json')
  .option('-f, --format <format>', '报告格式 (json|html|markdown)', 'json')
  .option('--fail-on-warnings', '将警告视为失败')
  .option('--include-performance', '包含性能测试')
  .option('--threads <num>', '并发线程数', '4')
  .action(async (options) => {
    try {
      await runValidation(options)
    } catch (error) {
      console.error('验证失败:', error)
      process.exit(1)
    }
  })

program
  .command('scan')
  .description('扫描项目组件')
  .option('-d, --directory <dir>', '项目根目录', projectRoot)
  .option('-o, --output <file>', '输出文件路径', 'component-scan-results.json')
  .option('--deep-analysis', '执行深度分析')
  .action(async (options) => {
    try {
      await runScan(options)
    } catch (error) {
      console.error('扫描失败:', error)
      process.exit(1)
    }
  })

program
  .command('test')
  .description('运行回归测试')
  .option('-d, --directory <dir>', '项目根目录', projectRoot)
  .option('-o, --output <file>', '输出报告文件路径', 'regression-test-report.json')
  .option('--component <name>', '指定测试的组件名称')
  .option('--category <category>', '指定测试类别')
  .option('--parallel', '并行执行测试')
  .action(async (options) => {
    try {
      await runRegressionTests(options)
    } catch (error) {
      console.error('测试失败:', error)
      process.exit(1)
    }
  })

program
  .command('watch')
  .description('监视文件变化并自动验证')
  .option('-d, --directory <dir>', '项目根目录', projectRoot)
  .option('--debounce <ms>', '防抖时间（毫秒）', '1000')
  .action(async (options) => {
    try {
      await runWatchMode(options)
    } catch (error) {
      console.error('监视模式失败:', error)
      process.exit(1)
    }
  })

// ============================================================================
// 验证逻辑
// ============================================================================

/**
 * 执行API一致性验证
 */
async function runValidation(options: any): Promise<void> {
  console.log('🔍 开始API一致性验证...')
  console.log(`📁 项目目录: ${options.directory}`)
  console.log(`📄 输出格式: ${options.format}`)

  // 1. 扫描组件
  console.log('\n📦 扫描项目组件...')
  const scanner = new ComponentScanner({
    rootDir: options.directory,
    deepAnalysis: true,
  })

  const components = await scanner.scanComponents()
  console.log(`✅ 扫描完成，发现 ${components.length} 个组件`)

  if (components.length === 0) {
    console.warn('⚠️  未发现任何组件，退出验证')
    return
  }

  // 2. 验证API一致性
  console.log('\n🔬 验证API一致性...')
  const validator = new APIValidator()
  const validationResults = validator.validateComponents(components)

  // 3. 统计结果
  const passedComponents = validationResults.filter(r => r.result.passed)
  const failedComponents = validationResults.filter(r => !r.result.passed)
  const totalErrors = validationResults.reduce((sum, r) => sum + r.result.errors.length, 0)
  const totalWarnings = validationResults.reduce((sum, r) => sum + r.result.warnings.length, 0)

  console.log(`\n📊 验证结果统计:`)
  console.log(`   总组件数: ${validationResults.length}`)
  console.log(`   ✅ 通过验证: ${passedComponents.length}`)
  console.log(`   ❌ 验证失败: ${failedComponents.length}`)
  console.log(`   🔴 错误总数: ${totalErrors}`)
  console.log(`   ⚠️  警告总数: ${totalWarnings}`)

  // 4. 生成报告
  console.log('\n📝 生成验证报告...')
  const report = generateValidationReport(validationResults, options)
  await writeReport(report, options.output, options.format)

  // 5. 显示失败详情
  if (failedComponents.length > 0) {
    console.log('\n❌ 验证失败的组件:')
    failedComponents.forEach(({ component, result }) => {
      console.log(`   🔸 ${component}:`)
      result.errors.forEach(error => {
        console.log(`      - ${error.message} (${error.code})`)
      })
      result.warnings.forEach(warning => {
        console.log(`      - ⚠️  ${warning.message} (${warning.code})`)
      })
    })
  }

  // 6. 决定退出码
  const shouldFail = failedComponents.length > 0 || (options.failOnWarnings && totalWarnings > 0)
  if (shouldFail) {
    console.log('\n❌ API一致性验证未通过')
    process.exit(1)
  } else {
    console.log('\n✅ API一致性验证通过')
  }
}

/**
 * 执行组件扫描
 */
async function runScan(options: any): Promise<void> {
  console.log('🔍 开始扫描项目组件...')
  console.log(`📁 项目目录: ${options.directory}`)

  const scanner = new ComponentScanner({
    rootDir: options.directory,
    deepAnalysis: options.deepAnalysis,
  })

  const components = await scanner.scanComponents()

  console.log(`\n📊 扫描结果:`)
  console.log(`   总组件数: ${components.length}`)

  // 按分类统计
  const categories = new Map<string, number>()
  components.forEach(component => {
    const category = component.category || 'unknown'
    categories.set(category, (categories.get(category) || 0) + 1)
  })

  console.log('\n📂 组件分类:')
  categories.forEach((count, category) => {
    console.log(`   ${category}: ${count}`)
  })

  // 统计Props
  const totalProps = components.reduce((sum, comp) => sum + Object.keys(comp.props).length, 0)
  console.log(`\n🔧 Props统计:`)
  console.log(`   总Props数: ${totalProps}`)
  console.log(`   平均Props数: ${(totalProps / components.length).toFixed(1)}`)

  // 保存结果
  const scanResults = {
    summary: {
      totalComponents: components.length,
      categories: Object.fromEntries(categories),
      totalProps,
      averageProps: totalProps / components.length,
      scannedAt: new Date().toISOString(),
    },
    components: components.map(comp => ({
      name: comp.name,
      filePath: comp.filePath,
      category: comp.category,
      propsCount: Object.keys(comp.props).length,
      isInteractive: comp.isInteractive,
      isThemed: comp.isThemed,
      hasTests: comp.hasTests,
      supportsSevenAxis: comp.supportsSevenAxis,
    })),
  }

  await fs.writeFile(options.output, JSON.stringify(scanResults, null, 2))
  console.log(`\n✅ 扫描完成，结果已保存到: ${options.output}`)
}

/**
 * 运行回归测试
 */
async function runRegressionTests(options: any): Promise<void> {
  console.log('🧪 开始运行回归测试...')
  console.log(`📁 项目目录: ${options.directory}`)

  // 1. 扫描组件
  const scanner = new ComponentScanner({
    rootDir: options.directory,
    deepAnalysis: true,
  })

  const components = await scanner.scanComponents()

  // 过滤组件
  let testComponents = components
  if (options.component) {
    testComponents = components.filter(comp => comp.name === options.component)
  }
  if (testComponents.length === 0) {
    console.warn('⚠️  没有找到符合条件的组件')
    return
  }

  console.log(`🎯 将测试 ${testComponents.length} 个组件`)

  // 2. 创建测试框架
  const testFramework = new RegressionTestFramework({
    includePerformanceTests: options.includePerformance,
    captureScreenshots: true,
    concurrency: parseInt(options.threads),
  })

  // 3. 生成测试套件
  const testSuites = testComponents.map(component => {
    const testCases = testFramework.generateTestCases(component)

    let filteredCases = testCases
    if (options.category) {
      filteredCases = testCases.filter(testCase => testCase.category === options.category)
    }

    return {
      name: `${component.name} Test Suite`,
      description: `${component.name} 组件的回归测试`,
      testCases: filteredCases,
      parallel: options.parallel,
    }
  })

  // 4. 注册测试套件
  testSuites.forEach(suite => testFramework.registerTestSuite(suite))

  // 5. 运行测试
  console.log('\n🏃 执行测试...')
  const startTime = Date.now()
  const results = await testFramework.runAllTests()
  const duration = Date.now() - startTime

  // 6. 统计结果
  const passedTests = results.filter(r => r.status === 'passed')
  const failedTests = results.filter(r => r.status === 'failed')
  const skippedTests = results.filter(r => r.status === 'skipped')

  console.log(`\n📊 测试结果统计:`)
  console.log(`   总测试数: ${results.length}`)
  console.log(`   ✅ 通过: ${passedTests.length}`)
  console.log(`   ❌ 失败: ${failedTests.length}`)
  console.log(`   ⏭️  跳过: ${skippedTests.length}`)
  console.log(`   ⏱️  耗时: ${(duration / 1000).toFixed(2)}s`)
  console.log(`   📈 通过率: ${((passedTests.length / results.length) * 100).toFixed(1)}%`)

  // 7. 生成报告
  const report = testFramework.generateReport()
  await fs.writeFile(options.output, JSON.stringify(report, null, 2))
  console.log(`\n✅ 测试完成，报告已保存到: ${options.output}`)

  // 8. 显示失败详情
  if (failedTests.length > 0) {
    console.log('\n❌ 失败的测试:')
    failedTests.forEach(result => {
      console.log(`   🔸 ${result.testCase.name}: ${result.error}`)
    })
  }

  // 9. 决定退出码
  if (failedTests.length > 0) {
    console.log('\n❌ 回归测试未通过')
    process.exit(1)
  } else {
    console.log('\n✅ 回归测试通过')
  }
}

/**
 * 运行监视模式
 */
async function runWatchMode(options: any): Promise<void> {
  console.log('👀 启动监视模式...')
  console.log(`📁 监视目录: ${options.directory}`)
  console.log(`⏱️  防抖时间: ${options.debounce}ms`)
  console.log('按 Ctrl+C 退出监视模式')

  let timeoutId: NodeJS.Timeout | null = null

  const runValidation = async () => {
    console.log('\n🔍 检测到文件变化，开始验证...')

    try {
      const scanner = new ComponentScanner({
        rootDir: options.directory,
        deepAnalysis: false, // 监视模式下使用快速分析
      })

      const components = await scanner.scanComponents()
      const validator = new APIValidator()
      const validationResults = validator.validateComponents(components)

      const failedComponents = validationResults.filter(r => !r.result.passed)
      const totalErrors = validationResults.reduce((sum, r) => sum + r.result.errors.length, 0)
      const totalWarnings = validationResults.reduce((sum, r) => sum + r.result.warnings.length, 0)

      if (failedComponents.length > 0 || totalErrors > 0) {
        console.log(`❌ 发现问题: ${failedComponents.length} 个组件验证失败，${totalErrors} 个错误`)

        failedComponents.forEach(({ component, result }) => {
          console.log(`   🔸 ${component}:`)
          result.errors.slice(0, 3).forEach(error => {
            console.log(`      - ${error.message}`)
          })
        })
      } else {
        console.log(`✅ 验证通过: ${validationResults.length} 个组件，${totalWarnings} 个警告`)
      }
    } catch (error) {
      console.error('❌ 验证失败:', error)
    }

    console.log('👀 继续监视...')
  }

  // 监视文件变化
  const chokidar = await import('chokidar')
  const watcher = chokidar.watch([
    path.join(options.directory, '**/*.tsx'),
    path.join(options.directory, '**/*.ts'),
  ], {
    ignored: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.git/**',
      '**/coverage/**',
    ],
  })

  watcher.on('change', () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(runValidation, parseInt(options.debounce))
  })

  watcher.on('add', () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(runValidation, parseInt(options.debounce))
  })

  // 初始验证
  await runValidation()

  // 保持进程运行
  process.on('SIGINT', () => {
    console.log('\n👋 退出监视模式')
    watcher.close()
    process.exit(0)
  })
}

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 生成验证报告
 */
function generateValidationReport(validationResults: any[], options: any): any {
  const passedComponents = validationResults.filter(r => r.result.passed)
  const failedComponents = validationResults.filter(r => !r.result.passed)
  const totalErrors = validationResults.reduce((sum, r) => sum + r.result.errors.length, 0)
  const totalWarnings = validationResults.reduce((sum, r) => sum + r.result.warnings.length, 0)

  const report = {
    metadata: {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      projectRoot: options.directory,
      validationTool: 'xorigo-ui-api-validator',
    },
    summary: {
      totalComponents: validationResults.length,
      passedComponents: passedComponents.length,
      failedComponents: failedComponents.length,
      totalErrors,
      totalWarnings,
      passRate: (passedComponents.length / validationResults.length) * 100,
    },
    results: validationResults.map(({ component, result }) => ({
      component,
      status: result.passed ? 'passed' : 'failed',
      errors: result.errors,
      warnings: result.warnings,
      info: result.info,
      suggestions: result.suggestions,
    })),
    failedComponents: failedComponents.map(({ component, result }) => ({
      component,
      errors: result.errors,
      warnings: result.warnings,
    })),
  }

  return report
}

/**
 * 写入报告文件
 */
async function writeReport(report: any, outputPath: string, format: string): Promise<void> {
  let content: string

  switch (format) {
    case 'json':
      content = JSON.stringify(report, null, 2)
      break

    case 'markdown':
      content = generateMarkdownReport(report)
      break

    case 'html':
      content = generateHTMLReport(report)
      break

    default:
      throw new Error(`不支持的报告格式: ${format}`)
  }

  await fs.writeFile(outputPath, content, 'utf-8')
  console.log(`📄 报告已生成: ${outputPath}`)
}

/**
 * 生成Markdown格式报告
 */
function generateMarkdownReport(report: any): string {
  const { summary, failedComponents } = report

  let markdown = '# Xorigo UI API 一致性验证报告\n\n'
  markdown += `**生成时间**: ${new Date(report.metadata.timestamp).toLocaleString()}\n\n`

  markdown += '## 📊 验证摘要\n\n'
  markdown += `- **总组件数**: ${summary.totalComponents}\n`
  markdown += `- **通过验证**: ${summary.passedComponents}\n`
  markdown += `- **验证失败**: ${summary.failedComponents}\n`
  markdown += `- **错误总数**: ${summary.totalErrors}\n`
  markdown += `- **警告总数**: ${summary.totalWarnings}\n`
  markdown += `- **通过率**: ${summary.passRate.toFixed(1)}%\n\n`

  if (failedComponents.length > 0) {
    markdown += '## ❌ 验证失败的组件\n\n'

    failedComponents.forEach(({ component, errors, warnings }) => {
      markdown += `### ${component}\n\n`

      if (errors.length > 0) {
        markdown += '**错误**:\n'
        errors.forEach((error: any) => {
          markdown += `- ${error.message} (${error.code})\n`
        })
        markdown += '\n'
      }

      if (warnings.length > 0) {
        markdown += '**警告**:\n'
        warnings.forEach((warning: any) => {
          markdown += `- ${warning.message} (${warning.code})\n`
        })
        markdown += '\n'
      }
    })
  }

  return markdown
}

/**
 * 生成HTML格式报告
 */
function generateHTMLReport(report: any): string {
  // 这里可以生成更丰富的HTML报告
  // 暂时返回简单的HTML结构
  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xorigo UI API 一致性验证报告</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 40px; }
        .header { border-bottom: 2px solid #e0e0e0; padding-bottom: 20px; margin-bottom: 30px; }
        .summary { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .failed { color: #d32f2f; }
        .passed { color: #388e3c; }
        .warning { color: #f57c00; }
        pre { background: #f8f8f8; padding: 10px; border-radius: 4px; overflow-x: auto; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔍 Xorigo UI API 一致性验证报告</h1>
        <p>生成时间: ${new Date(report.metadata.timestamp).toLocaleString()}</p>
    </div>

    <div class="summary">
        <h2>📊 验证摘要</h2>
        <ul>
            <li>总组件数: <strong>${report.summary.totalComponents}</strong></li>
            <li>通过验证: <strong class="passed">${report.summary.passedComponents}</strong></li>
            <li>验证失败: <strong class="failed">${report.summary.failedComponents}</strong></li>
            <li>错误总数: <strong class="failed">${report.summary.totalErrors}</strong></li>
            <li>警告总数: <strong class="warning">${report.summary.totalWarnings}</strong></li>
            <li>通过率: <strong>${report.summary.passRate.toFixed(1)}%</strong></li>
        </ul>
    </div>

    <pre>${JSON.stringify(report, null, 2)}</pre>
</body>
</html>
  `
}

// ============================================================================
// 主程序入口
// ============================================================================

if (import.meta.url === `file://${process.argv[1]}`) {
  program.parse()
}