#!/usr/bin/env node

/**
 * 检查是否需要更新版本号
 */

import { readFileSync, existsSync } from 'fs'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

console.log('🔍 版本更新必要性检查器\n')

// 获取当前版本
const corePackagePath = join(projectRoot, 'packages/core/package.json')
const packageJson = JSON.parse(readFileSync(corePackagePath, 'utf8'))
const currentVersion = packageJson.version

console.log(`📦 当前版本: ${currentVersion}`)

// 检查最近的提交
function getRecentCommits() {
  try {
    const commits = execSync('git log --oneline -10 --no-merges', {
      encoding: 'utf8',
      cwd: projectRoot
    }).trim().split('\n')
    return commits
  } catch (error) {
    return []
  }
}

// 检查版本相关提交
function getVersionCommits() {
  try {
    const commits = execSync('git log --oneline -20 --grep="version\\|chore.*version\\|release" --no-merges', {
      encoding: 'utf8',
      cwd: projectRoot
    }).trim().split('\n')
    return commits
  } catch (error) {
    return []
  }
}

// 分析最近提交
const recentCommits = getRecentCommits()
const versionCommits = getVersionCommits()

console.log(`📝 最近提交数: ${recentCommits.length}`)

if (versionCommits.length > 0) {
  const lastVersionCommit = versionCommits[0]
  console.log(`🏷️  最后版本提交: ${lastVersionCommit}`)

  // 计算自上次版本更新以来的提交数
  try {
    const commitsSinceVersion = execSync(`git rev-list --count ${lastVersionCommit.split(' ')[0]}..HEAD`, {
      encoding: 'utf8',
      cwd: projectRoot
    }).trim()

    console.log(`📊 自上次版本更新以来的提交数: ${commitsSinceVersion}`)

    const commitCount = parseInt(commitsSinceVersion)

    // 分析提交内容
    console.log('\n📋 最近5次提交:')
    recentCommits.slice(0, 5).forEach((commit, index) => {
      console.log(`  ${index + 1}. ${commit}`)
    })

    // 给出建议
    console.log('\n💡 建议:')

    if (commitCount < 5) {
      console.log('✅ 暂时无需更新版本号')
      console.log('   理由: 提交数量较少，继续开发')
    } else if (commitCount < 15) {
      console.log('⚠️  考虑更新版本号')
      console.log('   理由: 有一定数量的提交，可能包含重要功能')

      // 检查是否有重大变更
      const majorChanges = recentCommits.slice(0, 10).filter(commit =>
        /feat|BREAKING|major|refactor|architect/i.test(commit)
      )

      if (majorChanges.length > 0) {
        console.log('🔶 检测到可能的重大变更:')
        majorChanges.forEach(commit => console.log(`   - ${commit}`))
        console.log('   建议: 更新版本号')
      }
    } else {
      console.log('🔶 建议更新版本号')
      console.log('   理由: 提交数量较多，可能有重要功能完成')
    }

  } catch (error) {
    console.log('❌ 无法计算提交数量')
  }
} else {
  console.log('ℹ️  未找到版本相关的提交记录')
}

// 检查是否有未提交的更改
try {
  const status = execSync('git status --porcelain', {
    encoding: 'utf8',
    cwd: projectRoot
  }).trim()

  if (status) {
    console.log('\n📝 检测到未提交的更改')
    console.log('💡 建议先提交更改，再考虑版本更新')
  } else {
    console.log('\n✅ 工作目录干净')
  }
} catch (error) {
  console.log('\n❌ 无法检查Git状态')
}

// 快速更新建议
console.log('\n🚀 快速操作:')
console.log('  查看版本状态:      pnpm dev:status')
console.log('  更新到Alpha版本:    pnpm dev:stage start')
console.log('  更新到Beta版本:     pnpm dev:stage test')
console.log('  查看版本策略:      cat VERSION_STRATEGY_GUIDE.md')

// 交互式建议
if (process.argv.includes('--interactive')) {
  console.log('\n🤔 需要更新版本吗？')
  console.log('  y - 更新版本')
  console.log('  n - 保持当前版本')
  console.log('  s - 查看详细状态')
  console.log('  q - 退出')

  // 注意: 这里不实现交互式输入，仅提供指导
  console.log('\n💡 如需交互式决定，请手动运行相应命令')
}