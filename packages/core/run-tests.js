#!/usr/bin/env node

/**
 * 🎨 七轴主题系统测试运行器
 * 简化版本，专门用于Phase 3测试
 */

const { execSync } = require('child_process')
const { writeFileSync } = require('fs')
const path = require('path')

console.log('🚀 启动Phase 3: 七轴主题系统专项测试')
console.log('=' .repeat(60))

// 测试套件配置
const TEST_SUITES = [
  {
    name: '七轴主题系统核心测试',
    description: '5,103种七轴组合的核心功能测试',
    file: 'packages/core/tests/seven-axis-theme-system.test.ts'
  },
  {
    name: 'Workbench实时预览测试',
    description: '实时预览功能和性能测试',
    file: 'packages/core/tests/workbench-realtime-preview.test.ts'
  }
]

// 性能基准
const PERFORMANCE_BENCHMARKS = {
  themeSwitch: { target: 100, acceptable: 150 }, // ms
  recipeLoad: { target: 50, acceptable: 100 },    // ms
  renderTime: { target: 16.67, acceptable: 33.33 } // ms (60fps/30fps)
}

async function runTests() {
  const startTime = Date.now()
  const results = []

  console.log('🔧 检查测试环境...')

  // 检查必要的依赖
  try {
    const npmPackages = execSync('npm list @testing-library/react @testing-library/jest-dom vitest', { encoding: 'utf8' })
    console.log('✅ 测试依赖已安装')
  } catch (error) {
    console.log('⚠️ 部分测试依赖缺失，尝试安装...')
    try {
      execSync('npm install --save-dev @testing-library/react @testing-library/jest-dom vitest @testing-library/axe jest-axe', { stdio: 'inherit' })
      console.log('✅ 测试依赖安装完成')
    } catch (installError) {
      console.log('❌ 依赖安装失败，但继续测试...')
    }
  }

  // 创建测试报告目录
  try {
    execSync('mkdir -p test-results', { stdio: 'pipe' })
  } catch (error) {
    // 目录可能已存在
  }

  console.log('\n📋 开始执行测试套件...\n')

  // 执行每个测试套件
  for (const suite of TEST_SUITES) {
    console.log(`🧪 ${suite.name}`)
    console.log(`   ${suite.description}`)
    console.log('-'.repeat(40))

    const suiteStartTime = Date.now()
    let result = {
      name: suite.name,
      file: suite.file,
      status: 'unknown',
      duration: 0,
      error: null,
      details: {}
    }

    try {
      // 尝试使用vitest运行测试
      const vitestCommand = `npx vitest run --reporter=verbose --no-coverage ${suite.file}`
      console.log(`   执行命令: ${vitestCommand}`)

      const output = execSync(vitestCommand, {
        encoding: 'utf8',
        stdio: 'pipe',
        timeout: 120000 // 2分钟超时
      })

      const suiteEndTime = Date.now()
      result.duration = suiteEndTime - suiteStartTime
      result.status = 'passed'
      result.details.output = output

      console.log(`   ✅ 测试通过 (${result.duration}ms)`)

    } catch (error) {
      const suiteEndTime = Date.now()
      result.duration = suiteEndTime - suiteStartTime

      if (error.status === 124) {
        result.status = 'timeout'
        result.error = '测试超时'
        console.log(`   ⏰ 测试超时 (${result.duration}ms)`)
      } else {
        result.status = 'failed'
        result.error = error.message
        console.log(`   ❌ 测试失败 (${result.duration}ms)`)
        if (error.stdout) {
          console.log(`   输出: ${error.stdout.slice(0, 200)}...`)
        }
      }
    }

    results.push(result)
    console.log('')
  }

  // 生成测试报告
  const endTime = Date.now()
  const totalDuration = endTime - startTime

  const report = {
    metadata: {
      version: 'Phase 3 v1.0.0',
      timestamp: new Date().toISOString(),
      duration: totalDuration,
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch
      }
    },
    summary: {
      total: results.length,
      passed: results.filter(r => r.status === 'passed').length,
      failed: results.filter(r => r.status === 'failed').length,
      skipped: results.filter(r => r.status === 'skipped').length,
      timeout: results.filter(r => r.status === 'timeout').length,
      totalDuration
    },
    results,
    benchmarks: PERFORMANCE_BENCHMARKS,
    recommendations: generateRecommendations(results),
    nextSteps: generateNextSteps(results)
  }

  // 保存报告
  saveReport(report)

  // 输出结果
  outputResults(report)

  // 设置退出码
  const successRate = report.summary.total > 0 ?
    (report.summary.passed / report.summary.total) * 100 : 0

  process.exit(successRate >= 95 ? 0 : 1)
}

function generateRecommendations(results) {
  const recommendations = []

  const failedTests = results.filter(r => r.status === 'failed')
  if (failedTests.length > 0) {
    recommendations.push(`修复 ${failedTests.length} 个失败的测试`)
  }

  const timeoutTests = results.filter(r => r.status === 'timeout')
  if (timeoutTests.length > 0) {
    recommendations.push('优化测试性能，减少执行时间')
  }

  const passedTests = results.filter(r => r.status === 'passed')
  if (passedTests.length === results.length) {
    recommendations.push('🎉 所有测试通过！系统已达到生产就绪状态')
    recommendations.push('考虑进行负载测试和用户验收测试')
  }

  return recommendations
}

function generateNextSteps(results) {
  const nextSteps = []
  const successRate = results.length > 0 ?
    (results.filter(r => r.status === 'passed').length / results.length) * 100 : 0

  if (successRate >= 95) {
    nextSteps.push('🚀 准备生产环境部署')
    nextSteps.push('📚 编写用户文档和最佳实践指南')
    nextSteps.push('🔍 进行全面的端到端测试')
  } else if (successRate >= 80) {
    nextSteps.push('🔧 修复剩余的测试失败问题')
    nextSteps.push('⚡ 优化性能瓶颈')
    nextSteps.push('📊 监控生产环境指标')
  } else {
    nextSteps.push('🚨 解决关键测试失败问题')
    nextSteps.push('🏗️ 重新评估架构设计')
    nextSteps.push('📋 制定详细的修复计划')
  }

  return nextSteps
}

function saveReport(report) {
  try {
    // 保存JSON格式报告
    const jsonReport = JSON.stringify(report, null, 2)
    writeFileSync('test-results/seven-axis-test-report.json', jsonReport)

    // 保存Markdown格式报告
    const markdownReport = generateMarkdownReport(report)
    writeFileSync('test-results/seven-axis-test-report.md', markdownReport)

    console.log('📄 测试报告已保存到 test-results/')
  } catch (error) {
    console.error('❌ 保存测试报告失败:', error.message)
  }
}

function generateMarkdownReport(report) {
  const { summary, metadata, results } = report

  return `# 🎨 七轴主题系统专项测试报告

## 📊 测试概览

- **测试版本**: ${metadata.version}
- **执行时间**: ${new Date(metadata.timestamp).toLocaleString('zh-CN')}
- **总耗时**: ${(metadata.duration / 1000).toFixed(2)} 秒
- **测试环境**: ${metadata.environment.nodeVersion} on ${metadata.environment.platform}

## 📈 测试结果总结

| 指标 | 数值 | 百分比 |
|------|------|--------|
| 总测试数 | ${summary.total} | 100% |
| 通过测试 | ${summary.passed} | ${Math.round((summary.passed / summary.total) * 100)}% |
| 失败测试 | ${summary.failed} | ${Math.round((summary.failed / summary.total) * 100)}% |
| 超时测试 | ${summary.timeout} | ${Math.round((summary.timeout / summary.total) * 100)}% |

## 📋 详细测试结果

${results.map(result => `
### ${result.name}

**文件**: \`${result.file}\`

- **状态**: ${getStatusEmoji(result.status)} ${getStatusText(result.status)}
- **耗时**: ${result.duration}ms
${result.error ? `- **错误**: \`${result.error}\`` : ''}
`).join('')}

## 💡 建议和改进

${report.recommendations.map(rec => `- ${rec}`).join('\n')}

## 🎯 下一步行动

${report.nextSteps.map(step => `- ${step}`).join('\n')}

---

*报告生成时间: ${new Date().toLocaleString('zh-CN')}*
*测试框架: Vitest + Testing Library + Axe*
*七轴组合总数: 5,103 种*
`
}

function getStatusEmoji(status) {
  switch (status) {
    case 'passed': return '✅'
    case 'failed': return '❌'
    case 'timeout': return '⏰'
    case 'skipped': return '⏭️'
    default: return '❓'
  }
}

function getStatusText(status) {
  switch (status) {
    case 'passed': return '通过'
    case 'failed': return '失败'
    case 'timeout': return '超时'
    case 'skipped': return '跳过'
    default: return '未知'
  }
}

function outputResults(report) {
  const { summary, benchmarks } = report

  console.log('='.repeat(60))
  console.log('📊 测试执行完成')
  console.log('='.repeat(60))

  console.log(`\n📈 测试结果总结:`)
  console.log(`   总计: ${summary.total} | 通过: ${summary.passed} | 失败: ${summary.failed} | 超时: ${summary.timeout}`)
  console.log(`   总耗时: ${(summary.totalDuration / 1000).toFixed(2)}s`)

  console.log(`\n⚡ 性能基准:`)
  console.log(`   主题切换: ${benchmarks.themeSwitch.target}ms (可接受: ${benchmarks.themeSwitch.acceptable}ms)`)
  console.log(`   配方加载: ${benchmarks.recipeLoad.target}ms (可接受: ${benchmarks.recipeLoad.acceptable}ms)`)
  console.log(`   渲染时间: ${benchmarks.renderTime.target}ms (可接受: ${benchmarks.renderTime.acceptable}ms)`)

  if (report.recommendations.length > 0) {
    console.log(`\n💡 主要建议:`)
    report.recommendations.slice(0, 3).forEach(rec => {
      console.log(`   • ${rec}`)
    })
  }

  const successRate = summary.total > 0 ? (summary.passed / summary.total) * 100 : 0
  const status = successRate >= 95 ? '🎉 优秀' :
                successRate >= 80 ? '✅ 良好' :
                successRate >= 60 ? '⚠️ 需要改进' : '❌ 需要重新评估'

  console.log(`\n🎯 总体状态: ${status}`)
  console.log('📄 详细报告: test-results/seven-axis-test-report.md')
}

// 主程序
if (require.main === module) {
  runTests().catch(error => {
    console.error('❌ 测试执行失败:', error)
    process.exit(1)
  })
}

module.exports = { runTests }