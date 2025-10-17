#!/usr/bin/env node

/**
 * 发布监控脚本
 * 监控包发布状态和下载统计
 */

import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = dirname(__dirname)

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

async function fetchPackageStats(packageName) {
  try {
    // 使用NPM API获取包信息
    const response = await fetch(`https://registry.npmjs.org/${packageName}`)
    const data = await response.json()

    const latestVersion = data['dist-tags']?.latest
    const publishDate = data.time?.[latestVersion]
    const downloads = data.downloads || {}

    return {
      name: packageName,
      version: latestVersion,
      publishDate,
      weeklyDownloads: downloads.weekly || 0,
      monthlyDownloads: downloads.monthly || 0,
      yearlyDownloads: downloads.yearly || 0
    }
  } catch (error) {
    log(`❌ 获取 ${packageName} 统计信息失败: ${error.message}`, 'red')
    return null
  }
}

async function checkPackageHealth(packageName) {
  try {
    const stats = await fetchPackageStats(packageName)
    if (!stats) return null

    // 健康检查
    const health = {
      package: packageName,
      version: stats.version,
      isLatest: true, // TODO: 比较本地版本
      publishAge: stats.publishDate ?
        Math.floor((Date.now() - new Date(stats.publishDate)) / (1000 * 60 * 60 * 24)) : null,
      downloads: {
        weekly: stats.weeklyDownloads,
        monthly: stats.monthlyDownloads,
        yearly: stats.yearlyDownloads
      },
      status: 'healthy'
    }

    // 检查潜在问题
    if (health.publishAge > 365) {
      health.status = 'warning'
      health.issues = ['包超过一年未更新']
    }

    if (health.downloads.weekly < 100) {
      health.status = health.status === 'warning' ? 'warning' : 'info'
      health.issues = health.issues || []
      health.issues.push('周下载量较低')
    }

    return health
  } catch (error) {
    log(`❌ 健康检查失败 ${packageName}: ${error.message}`, 'red')
    return null
  }
}

async function generateMonitorReport() {
  log('📊 Xorigo UI 包发布监控报告\n', 'cyan')

  const packages = [
    '@xorigo-ui/core',
    '@xorigo-ui/tokens',
    '@xorigo-ui/system',
    '@xorigo-ui/style-recipe'
  ]

  const results = []

  for (const packageName of packages) {
    log(`🔍 检查 ${packageName}...`, 'blue')
    const health = await checkPackageHealth(packageName)
    if (health) {
      results.push(health)

      log(`  📦 版本: ${health.version}`, health.status === 'healthy' ? 'green' : 'yellow')
      log(`  📅 发布: ${health.publishAge ? `${health.publishAge}天前` : '未知'}`, health.status === 'healthy' ? 'green' : 'yellow')
      log(`  📈 周下载: ${health.downloads.weekly.toLocaleString()}`, health.status === 'healthy' ? 'green' : 'yellow')

      if (health.issues) {
        for (const issue of health.issues) {
          log(`  ⚠️ ${issue}`, 'yellow')
        }
      }
      log('')
    }
  }

  // 生成报告
  const report = {
    timestamp: new Date().toISOString(),
    packages: results,
    summary: {
      total: results.length,
      healthy: results.filter(r => r.status === 'healthy').length,
      warning: results.filter(r => r.status === 'warning').length,
      info: results.filter(r => r.status === 'info').length
    }
  }

  // 保存报告
  const reportPath = join(rootDir, 'publish-monitor-report.json')
  writeFileSync(reportPath, JSON.stringify(report, null, 2))

  // 输出摘要
  log('📋 摘要:', 'magenta')
  log(`  总包数: ${report.summary.total}`, 'cyan')
  log(`  健康: ${report.summary.healthy}`, 'green')
  log(`  警告: ${report.summary.warning}`, 'yellow')
  log(`  信息: ${report.summary.info}`, 'blue')
  log(`\n📄 详细报告: ${reportPath}`, 'cyan')

  return report
}

function checkReleaseReadiness() {
  log('🚀 检查发布准备状态\n', 'cyan')

  const checks = [
    {
      name: 'Git工作目录清洁',
      check: () => {
        try {
          const status = execSync('git status --porcelain', { encoding: 'utf8' })
          return !status.trim()
        } catch {
          return false
        }
      }
    },
    {
      name: 'Changesets存在',
      check: () => {
        try {
          const result = execSync('npx changeset status --output=json', { encoding: 'utf8' })
          return JSON.parse(result).length > 0
        } catch {
          return false
        }
      }
    },
    {
      name: '测试通过',
      check: () => {
        try {
          execSync('npm test', { stdio: 'pipe' })
          return true
        } catch {
          return false
        }
      }
    },
    {
      name: '构建成功',
      check: () => {
        try {
          execSync('npm run build:all', { stdio: 'pipe' })
          return true
        } catch {
          return false
        }
      }
    },
    {
      name: '类型检查通过',
      check: () => {
        try {
          execSync('npm run type-check', { stdio: 'pipe' })
          return true
        } catch {
          return false
        }
      }
    }
  ]

  let passed = 0
  let failed = 0

  for (const check of checks) {
    const ready = check.check()
    if (ready) {
      log(`✅ ${check.name}`, 'green')
      passed++
    } else {
      log(`❌ ${check.name}`, 'red')
      failed++
    }
  }

  log(`\n📊 结果: ${passed} 通过, ${failed} 失败`, failed > 0 ? 'red' : 'green')

  if (failed === 0) {
    log('🎉 准备就绪，可以发布！', 'green')
  } else {
    log('⚠️ 请解决上述问题后再发布', 'yellow')
  }

  return failed === 0
}

async function main() {
  const command = process.argv[2]

  switch (command) {
    case 'health':
      await generateMonitorReport()
      break
    case 'ready':
      checkReleaseReadiness()
      break
    case 'all':
      await generateMonitorReport()
      log('\n' + '='.repeat(50) + '\n', 'cyan')
      checkReleaseReadiness()
      break
    default:
      log('用法:', 'cyan')
      log('  node scripts/publish-monitor.js health   # 检查包健康状态', 'white')
      log('  node scripts/publish-monitor.js ready   # 检查发布准备状态', 'white')
      log('  node scripts/publish-monitor.js all     # 运行所有检查', 'white')
  }
}

main().catch(error => {
  log(`监控脚本执行失败: ${error.message}`, 'red')
  process.exit(1)
})