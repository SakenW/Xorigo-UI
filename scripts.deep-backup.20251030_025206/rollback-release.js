#!/usr/bin/env node

/**
 * 发布回滚脚本
 * 紧急回滚已发布的包版本
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

async function getPackageVersions(packageName) {
  try {
    const response = await fetch(`https://registry.npmjs.org/${packageName}`)
    const data = await response.json()

    return {
      current: data['dist-tags']?.latest,
      previous: data['dist-tags']?.previous || Object.keys(data.versions).slice(-2)[0],
      allVersions: Object.keys(data.versions)
    }
  } catch (error) {
    log(`❌ 获取版本信息失败: ${error.message}`, 'red')
    return null
  }
}

async function unpublishVersion(packageName, version) {
  try {
    log(`🗑️ 取消发布 ${packageName}@${version}...`, 'yellow')

    // 使用npm unpublish命令
    execSync(`npm unpublish ${packageName}@${version} --force`, {
      stdio: 'pipe',
      cwd: rootDir
    })

    log(`✅ 成功取消发布 ${packageName}@${version}`, 'green')
    return true
  } catch (error) {
    log(`❌ 取消发布失败: ${error.message}`, 'red')
    return false
  }
}

async function setPreviousVersion(packageName, previousVersion) {
  try {
    log(`🔄 设置 ${packageName} 为 ${previousVersion}...`, 'yellow')

    // 使用npm dist-tag命令设置previous版本为latest
    execSync(`npm dist-tag add ${packageName}@${previousVersion} latest`, {
      stdio: 'pipe',
      cwd: rootDir
    })

    log(`✅ 成功设置 ${packageName}@${previousVersion} 为最新版本`, 'green')
    return true
  } catch (error) {
    log(`❌ 设置版本失败: ${error.message}`, 'red')
    return false
  }
}

function createRollbackReport(packageName, fromVersion, toVersion, reason) {
  const report = {
    timestamp: new Date().toISOString(),
    action: 'rollback',
    package: packageName,
    fromVersion,
    toVersion,
    reason,
    performedBy: process.env.USER || 'unknown'
  }

  const reportPath = join(rootDir, 'rollback-reports')
  const filename = `${packageName}-${fromVersion}-to-${toVersion}-${Date.now()}.json`

  try {
    require('fs').mkdirSync(reportPath, { recursive: true })
    writeFileSync(join(reportPath, filename), JSON.stringify(report, null, 2))
    log(`📄 回滚报告已保存: ${join(reportPath, filename)}`, 'cyan')
  } catch (error) {
    log(`⚠️ 保存回滚报告失败: ${error.message}`, 'yellow')
  }

  return report
}

async function emergencyRollback(packageName, reason) {
  log(`🚨 紧急回滚 ${packageName}`, 'red')
  log(`原因: ${reason}`, 'yellow')

  const versions = await getPackageVersions(packageName)
  if (!versions) {
    return false
  }

  log(`当前版本: ${versions.current}`, 'blue')
  log(`回滚到: ${versions.previous}`, 'blue')

  // 确认回滚
  const confirm = process.argv.includes('--force') ||
    process.env.NODE_ENV === 'production' ||
    await new Promise(resolve => {
      process.stdin.resume()
      process.stdout.write('确认回滚? (y/N): ')
      process.stdin.on('data', data => {
        resolve(data.toString().trim().toLowerCase() === 'y')
        process.stdin.pause()
      })
    })

  if (!confirm) {
    log('❌ 回滚已取消', 'red')
    return false
  }

  // 执行回滚
  const success = await setPreviousVersion(packageName, versions.previous)

  if (success) {
    createRollbackReport(packageName, versions.current, versions.previous, reason)

    // 通知相关团队
    log('📢 发送回滚通知...', 'yellow')
    // TODO: 集成Slack/邮件通知

    log('✅ 紧急回滚完成！', 'green')
    return true
  }

  return false
}

async function rollbackAllPackages(reason) {
  log('🚨 紧急回滚所有包', 'red')

  const packages = [
    '@xorigo-ui/core',
    '@xorigo-ui/tokens',
    '@xorigo-ui/system',
    '@xorigo-ui/style-recipe'
  ]

  const results = []

  for (const packageName of packages) {
    log(`\n🔄 处理 ${packageName}...`, 'blue')
    const success = await emergencyRollback(packageName, reason)
    results.push({ package: packageName, success })
  }

  // 输出结果
  log('\n📊 回滚结果:', 'cyan')
  for (const result of results) {
    const status = result.success ? '✅' : '❌'
    log(`  ${status} ${result.package}`, result.success ? 'green' : 'red')
  }

  const allSuccess = results.every(r => r.success)
  if (allSuccess) {
    log('\n🎉 所有包回滚成功！', 'green')
  } else {
    log('\n⚠️ 部分包回滚失败，请手动检查', 'yellow')
  }

  return allSuccess
}

function checkGitStatus() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' })
    if (status.trim()) {
      log('⚠️ Git工作目录不干净', 'yellow')
      log('建议在回滚前提交或暂存更改', 'yellow')
      return false
    }
    return true
  } catch {
    return false
  }
}

async function main() {
  const command = process.argv[2]
  const packageName = process.argv[3]
  const reason = process.argv[4] || '紧急回滚'

  log('⚠️ 警告: 这是紧急回滚工具', 'red')
  log('⚠️ 将影响已发布的包版本', 'red')
  log('⚠️ 请确认你了解后果', 'red')
  log('')

  if (!checkGitStatus()) {
    log('❌ Git状态检查失败，建议先处理Git状态', 'red')
    process.exit(1)
  }

  switch (command) {
    case 'package':
      if (!packageName) {
        log('❌ 请指定包名', 'red')
        log('用法: node scripts/rollback-release.js package <package-name> [reason]', 'white')
        process.exit(1)
      }
      await emergencyRollback(packageName, reason)
      break

    case 'all':
      await rollbackAllPackages(reason)
      break

    case 'check':
      log('🔍 检查包版本状态...', 'blue')
      const packages = ['@xorigo-ui/core', '@xorigo-ui/tokens', '@xorigo-ui/system', '@xorigo-ui/style-recipe']

      for (const pkg of packages) {
        const versions = await getPackageVersions(pkg)
        if (versions) {
          log(`📦 ${pkg}:`, 'cyan')
          log(`  当前: ${versions.current}`, 'green')
          log(`  上一版: ${versions.previous}`, 'yellow')
          log(`  总版本数: ${versions.allVersions.length}`, 'blue')
        }
      }
      break

    default:
      log('用法:', 'cyan')
      log('  node scripts/rollback-release.js package <package-name> [reason]', 'white')
      log('  node scripts/rollback-release.js all [reason]', 'white')
      log('  node scripts/rollback-release.js check', 'white')
      log('')
      log('示例:', 'cyan')
      log('  node scripts/rollback-release.js package @xorigo-ui/core "修复严重bug"', 'white')
      log('  node scripts/rollback-release.js all "兼容性问题"', 'white')
      log('  node scripts/rollback-release.js check', 'white')
      log('')
      log('选项:', 'cyan')
      log('  --force  跳过确认步骤', 'white')
  }
}

main().catch(error => {
  log(`回滚脚本执行失败: ${error.message}`, 'red')
  process.exit(1)
})