#!/usr/bin/env node

/**
 * 自动更新为带日期的开发版本
 * 格式: 0.1.0-dev.YYYYMMDD
 */

import { readFileSync, writeFileSync } from 'fs'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

// 获取当前日期 YYYYMMDD
function getCurrentDate() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}

// 生成开发版本号
function generateDevVersion(date = null) {
  const dateStr = date || getCurrentDate()
  return `0.1.0-dev.${dateStr}`
}

// 更新版本号
function updateDevVersion(date = null, reason = '日常开发版本更新') {
  const corePackagePath = join(projectRoot, 'packages/core/package.json')
  const packageJson = JSON.parse(readFileSync(corePackagePath, 'utf8'))
  const oldVersion = packageJson.version

  const newVersion = generateDevVersion(date)
  packageJson.version = newVersion

  writeFileSync(corePackagePath, JSON.stringify(packageJson, null, 2))

  console.log(`✅ 开发版本已更新: ${oldVersion} → ${newVersion}`)
  console.log(`   原因: ${reason}`)

  return newVersion
}

// 检查是否需要更新版本
function checkVersionUpdateNeeded() {
  const corePackagePath = join(projectRoot, 'packages/core/package.json')
  const packageJson = JSON.parse(readFileSync(corePackagePath, 'utf8'))
  const currentVersion = packageJson.version

  const currentDate = getCurrentDate()
  const expectedVersion = generateDevVersion(currentDate)

  if (currentVersion === expectedVersion) {
    console.log(`✅ 版本号已是最新: ${currentVersion}`)
    return { needed: false, currentVersion, expectedVersion }
  } else {
    console.log(`📅 当前版本: ${currentVersion}`)
    console.log(`📅 今日版本: ${expectedVersion}`)
    return { needed: true, currentVersion, expectedVersion }
  }
}

// 主程序
const command = process.argv[2]

if (!command || command === 'check') {
  console.log('📅 日常开发版本检查器\n')

  const result = checkVersionUpdateNeeded()

  if (result.needed) {
    console.log('\n💡 建议更新到今日版本')
    console.log('   运行: node scripts/update-daily-version.js update')
  } else {
    console.log('\n🎯 版本号已是最新，无需更新')
  }

  console.log('\n🚀 其他命令:')
  console.log('  update              - 更新到今日版本')
  console.log('  update <date>       - 更新到指定日期 (格式: YYYYMMDD)')
  console.log('  force <date>        - 强制更新到指定日期')
  console.log('  check               - 检查是否需要更新')

} else if (command === 'update') {
  const date = process.argv[3]
  const result = checkVersionUpdateNeeded()

  if (result.needed || date) {
    const newVersion = updateDevVersion(date, date ? `更新到指定日期版本` : `更新到今日开发版本`)

    // 尝试构建
    try {
      execSync('pnpm --filter @xorigo-ui/core build', { cwd: projectRoot })
      console.log('✅ 核心包构建成功')
    } catch (error) {
      console.log('⚠️  构建失败，请手动检查')
    }

    console.log('\n📋 后续步骤:')
    console.log('1. 提交版本更新: git add . && git commit -m "chore: 更新开发版本到 ' + newVersion + '"')
    console.log('2. 继续日常开发')

  } else {
    console.log('ℹ️  版本号已是最新，无需更新')
  }

} else if (command === 'force') {
  const date = process.argv[3]
  if (!date) {
    console.log('❌ 强制更新需要指定日期 (格式: YYYYMMDD)')
    process.exit(1)
  }

  const newVersion = updateDevVersion(date, `强制更新到指定日期版本`)
  console.log(`🔒 强制更新完成: ${newVersion}`)

} else if (command === 'auto') {
  // 自动模式：检查并更新
  console.log('🤖 自动版本更新模式')

  const result = checkVersionUpdateNeeded()

  if (result.needed) {
    console.log('🔄 检测到需要更新，自动更新版本...')
    const newVersion = updateDevVersion()

    try {
      execSync('git add packages/core/package.json', { cwd: projectRoot })
      execSync(`git commit -m "chore: 自动更新开发版本到 ${newVersion}"`, { cwd: projectRoot })
      console.log('✅ 版本更新并已提交')
    } catch (error) {
      console.log('⚠️  版本已更新，但提交失败，请手动提交')
    }
  } else {
    console.log('✅ 版本已是最新，无需操作')
  }

} else {
  // 检查是否是日期格式 YYYYMMDD
  const datePattern = /^\d{8}$/
  if (datePattern.test(command)) {
    const newVersion = updateDevVersion(command, `更新到指定日期版本: ${command}`)
    console.log(`📅 版本已更新到: ${newVersion}`)
  } else {
    console.log(`❌ 未知命令: ${command}`)
    console.log('可用命令: check, update, force, auto, 或日期格式 YYYYMMDD')
    process.exit(1)
  }
}