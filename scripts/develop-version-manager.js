#!/usr/bin/env node

/**
 * 开发阶段版本号管理器
 * 支持多种开发版本号格式
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

console.log('🚀 开发版本管理器\n')

// 获取当前日期
function getCurrentDate() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}

// 获取当前日期时间（包含时分）
function getCurrentDateTime() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  return `${year}${month}${day}${hours}${minutes}`
}

// 开发版本号选项
const devVersionOptions = {
  'alpha': '0.1.0-alpha.0',           // Alpha版本
  'beta': '0.1.0-beta.0',             // Beta版本
  'rc': '0.1.0-rc.0',                 // Release Candidate
  'dev': `0.1.0-dev.${getCurrentDate()}`, // 开发版本(带日期)
  'date': `0.1.0.${getCurrentDate()}`,    // 日期版本
  'datetime': `0.1.0.${getCurrentDateTime()}`, // 日期时间版本(包含时分)
  'time': `0.1.0.${getCurrentDateTime()}`,  // 时间版本(包含时分)
  'snapshot': '0.1.0-SNAPSHOT',       // 快照版本
  'latest': '0.1.0-dev'              // 简单开发版本
}

console.log('📦 可用的开发版本号格式:')
Object.entries(devVersionOptions).forEach(([key, version]) => {
  console.log(`  ${key}: ${version}`)
})

console.log('\n🎯 推荐的开发阶段版本号格式:')
console.log('1. alpha版本: 0.1.0-alpha.0 (早期开发)')
console.log('2. beta版本: 0.1.0-beta.0 (功能测试)')
console.log('3. dev版本: 0.1.0-dev.YYYYMMDD (日常开发)')

// 获取当前版本
const corePackagePath = join(projectRoot, 'packages/core/package.json')
if (existsSync(corePackagePath)) {
  const packageJson = JSON.parse(readFileSync(corePackagePath, 'utf8'))
  console.log(`\n📋 当前版本: ${packageJson.version}`)

  // 分析当前版本类型
  if (packageJson.version.includes('alpha')) {
    console.log('🔶 当前处于 Alpha 开发阶段')
  } else if (packageJson.version.includes('beta')) {
    console.log('🔷 当前处于 Beta 测试阶段')
  } else if (packageJson.version.includes('rc')) {
    console.log('🔵 当前处于 Release Candidate 阶段')
  } else if (packageJson.version.includes('dev')) {
    console.log('🟢 当前处于开发阶段')
  } else {
    console.log('⚪ 当前为正式版本')
  }
}

console.log('\n💡 使用建议:')
console.log('1. 项目初期: 使用 0.1.0-alpha.0')
console.log('2. 功能开发: 使用 0.1.0-dev.20251108')
console.log('3. 内部测试: 使用 0.1.0-beta.0')
console.log('4. 发布前: 使用 0.1.0-rc.0')

// 版本更新函数
function updateVersion(newVersion) {
  const packageJson = JSON.parse(readFileSync(corePackagePath, 'utf8'))
  const oldVersion = packageJson.version

  packageJson.version = newVersion

  writeFileSync(corePackagePath, JSON.stringify(packageJson, null, 2))

  console.log(`✅ 版本已更新: ${oldVersion} → ${newVersion}`)

  // 更新其他workspace包
  try {
    execSync('pnpm --filter @xorigo-ui/core build', { cwd: projectRoot })
    console.log('✅ 核心包已重新构建')
  } catch (error) {
    console.log('⚠️  构建失败，请手动检查')
  }
}

// 导出更新函数供外部使用
if (process.argv[2]) {
  const requestedVersion = process.argv[2]
  if (devVersionOptions[requestedVersion]) {
    updateVersion(devVersionOptions[requestedVersion])
  } else {
    // 如果是完整的版本号，直接使用
    updateVersion(requestedVersion)
  }
}

export { updateVersion, devVersionOptions }