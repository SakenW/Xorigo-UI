#!/usr/bin/env node

/**
 * 检查Xorigo UI包发布状态
 * 为外部使用提供指导
 */

import { readFileSync, existsSync, statSync } from 'fs'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

console.log('🔍 检查Xorigo UI包状态...\n')

// 1. 检查核心包是否已构建
const coreDistPath = join(projectRoot, 'packages/core/dist')
console.log('📦 核心包构建状态:')
if (existsSync(coreDistPath)) {
  console.log('✅ packages/core/dist 目录存在')

  // 检查关键文件
  const files = ['index.mjs', 'index.cjs.js', 'index.d.ts']
  files.forEach(file => {
    const filePath = join(coreDistPath, file)
    if (existsSync(filePath)) {
      const stats = statSync(filePath)
      console.log(`  ✅ ${file} (${Math.round(stats.size / 1024)}KB)`)
    } else {
      console.log(`  ❌ ${file} 缺失`)
    }
  })
} else {
  console.log('❌ packages/core/dist 目录不存在')
  console.log('💡 请运行: pnpm build')
}

// 2. 检查package.json配置
const corePackagePath = join(projectRoot, 'packages/core/package.json')
console.log('\n📋 核心包配置:')
if (existsSync(corePackagePath)) {
  const packageJson = JSON.parse(readFileSync(corePackagePath, 'utf8'))
  console.log(`  📦 包名: ${packageJson.name}`)
  console.log(`  🏷️  版本: ${packageJson.version}`)
  console.log(`  🔗 导出: ${Object.keys(packageJson.exports || {}).length} 个模块`)

  // 检查是否已发布到NPM
  try {
    const npmInfo = JSON.parse(execSync(`npm view ${packageJson.name} --json`, {
      encoding: 'utf8',
      stdio: 'pipe'
    }))
    console.log(`  🌐 已发布版本: ${npmInfo['dist-tags'].latest}`)
    console.log(`  📅 发布时间: ${npmInfo.time.modified}`)
  } catch (error) {
    console.log('  ❌ 包未发布到NPM或网络问题')
  }
} else {
  console.log('❌ 核心包package.json不存在')
}

// 3. 检查本地开发状态
console.log('\n🛠️  开发环境状态:')
try {
  const websiteStatus = execSync('pnpm dev:website --dry-run', {
    encoding: 'utf8',
    stdio: 'pipe',
    cwd: projectRoot
  })
  console.log('✅ Website开发环境正常')
} catch (error) {
  console.log('❌ Website开发环境配置问题')
}

// 4. 提供使用建议
console.log('\n📚 使用建议:')

const hasDist = existsSync(coreDistPath)
const corePackage = hasDist ? JSON.parse(readFileSync(corePackagePath, 'utf8')) : null

if (hasDist && corePackage) {
  console.log('\n🎯 方案1: NPM包安装 (推荐)')
  console.log('```bash')
  console.log(`npm install ${corePackage.name}`)
  console.log('# 安装必要依赖')
  console.log('npm install react react-dom framer-motion class-variance-authority')
  console.log('```')

  console.log('\n🔗 方案2: 本地开发链接')
  console.log('```bash')
  console.log('# 在您的项目中')
  console.log(`npm link ${join(projectRoot, 'packages/core')}`)
  console.log('```')

  console.log('\n📁 方案3: 直接引用dist文件')
  console.log('```javascript')
  console.log(`import { Button } from '${join(projectRoot, 'packages/core/dist/index.mjs')}'`)
  console.log('```')
} else {
  console.log('❌ 请先构建核心包:')
  console.log('```bash')
  console.log('cd /home/saken/project/Xorigo-UI')
  console.log('pnpm build')
  console.log('```')
}

console.log('\n📖 完整使用指南: ./EXTERNAL_USAGE_GUIDE.md')