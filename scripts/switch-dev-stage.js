#!/usr/bin/env node

/**
 * 快速切换开发阶段版本号
 */

import { readFileSync, writeFileSync } from 'fs'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

// 获取当前日期
function getCurrentDate() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}

// 开发阶段映射
const stageMapping = {
  'start': '0.1.0-alpha.0',
  'dev': `0.1.0-dev.${getCurrentDate()}`,
  'date': `0.1.0.${getCurrentDate()}`,
  'test': '0.1.0-beta.0',
  'prepare': '0.1.0-rc.0',
  'snapshot': '0.1.0-SNAPSHOT'
}

function showCurrentVersion() {
  const corePackagePath = join(projectRoot, 'packages/core/package.json')
  const packageJson = JSON.parse(readFileSync(corePackagePath, 'utf8'))

  console.log('📦 当前版本信息:')
  console.log(`   版本号: ${packageJson.version}`)

  // 分析开发阶段
  const version = packageJson.version
  let stage = 'unknown'
  let emoji = '❓'

  if (version.includes('alpha')) {
    stage = 'alpha (开发初期)'
    emoji = '🔶'
  } else if (version.includes('beta')) {
    stage = 'beta (测试阶段)'
    emoji = '🔷'
  } else if (version.includes('rc')) {
    stage = 'rc (发布准备)'
    emoji = '🔵'
  } else if (version.includes('dev')) {
    stage = 'dev (日常开发)'
    emoji = '🟢'
  } else if (version.includes('SNAPSHOT')) {
    stage = 'snapshot (快照版本)'
    emoji = '📸'
  } else if (/^\d{8}$/.test(version)) {
    // 检查是否为YYYYMMDD格式
    stage = 'date (日期版本)'
    emoji = '📅'
  } else {
    stage = 'release (正式版本)'
    emoji = '✅'
  }

  console.log(`   阶段: ${emoji} ${stage}`)
}

function updateVersion(newVersion, reason = '') {
  const corePackagePath = join(projectRoot, 'packages/core/package.json')
  const packageJson = JSON.parse(readFileSync(corePackagePath, 'utf8'))
  const oldVersion = packageJson.version

  packageJson.version = newVersion
  writeFileSync(corePackagePath, JSON.stringify(packageJson, null, 2))

  console.log(`✅ 版本已更新: ${oldVersion} → ${newVersion}`)
  if (reason) {
    console.log(`   原因: ${reason}`)
  }

  try {
    execSync('pnpm --filter @xorigo-ui/core build', { cwd: projectRoot })
    console.log('✅ 核心包已重新构建')
  } catch (error) {
    console.log('⚠️  构建失败，请手动检查')
  }
}

// 主程序
const command = process.argv[2]

if (!command) {
  console.log('🚀 Xorigo UI 开发阶段版本切换器\n')
  console.log('用法:')
  console.log('  node scripts/switch-dev-stage.js <stage>')
  console.log('')
  console.log('可用阶段:')
  Object.entries(stageMapping).forEach(([stage, version]) => {
    console.log(`  ${stage.padEnd(10)} → ${version}`)
  })
  console.log('')
  console.log('示例:')
  console.log('  node scripts/switch-dev-stage.js start     # 开始开发 (alpha)')
  console.log('  node scripts/switch-dev-stage.js dev       # 日常开发 (dev)')
  console.log('  node scripts/switch-dev-stage.js test      # 测试阶段 (beta)')
  console.log('  node scripts/switch-dev-stage.js prepare   # 发布准备 (rc)')
  console.log('')

  showCurrentVersion()
  process.exit(0)
}

const stageMessages = {
  'start': '开始新的开发阶段',
  'dev': '切换到日常开发模式',
  'test': '准备内部测试',
  'prepare': '准备发布候选版本',
  'snapshot': '创建快照版本'
}

if (stageMapping[command]) {
  const newVersion = stageMapping[command]
  const reason = stageMessages[command]

  console.log(`🔄 切换到 ${command} 阶段...`)
  updateVersion(newVersion, reason)

  console.log('\n📋 后续步骤:')
  console.log('1. 运行测试: pnpm test')
  console.log('2. 检查构建: pnpm build')
  console.log('3. 开发/测试功能')

} else if (command === 'status') {
  showCurrentVersion()
} else if (command === 'list') {
  console.log('📋 可用的开发阶段:')
  Object.entries(stageMapping).forEach(([stage, version]) => {
    const message = stageMessages[stage]
    console.log(`  ${stage.padEnd(10)} → ${version} (${message})`)
  })
} else {
  console.log(`❌ 未知的阶段: ${command}`)
  console.log('可用阶段:', Object.keys(stageMapping).join(', '))
  process.exit(1)
}