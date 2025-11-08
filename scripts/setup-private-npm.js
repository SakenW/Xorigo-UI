#!/usr/bin/env node

/**
 * 配置私有NPM仓库
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

console.log('🔐 配置私有NPM仓库选项\n')

console.log('选项1: 使用GitHub Packages (推荐)')
console.log('- 免费提供私有包')
console.log('- 与GitHub集成')
console.log('- 配置示例:')
console.log('```bash')
console.log('npm config set @xorigo-ui:registry https://npm.pkg.github.com')
console.log('npm config set //npm.pkg.github.com/:_authToken YOUR_TOKEN')
console.log('```\n')

console.log('选项2: 使用Verdaccio (本地私有仓库)')
console.log('- 完全本地控制')
console.log('- 免费开源')
console.log('- 安装配置:')
console.log('```bash')
console.log('npm install -g verdaccio')
console.log('verdaccio')
console.log('npm set registry http://localhost:4873')
console.log('```\n')

console.log('选项3: 使用GitLab Package Registry')
console.log('- GitLab集成')
console.log('- CI/CD支持')
console.log('- 免费额度')
console.log('\n')

// 检查当前配置
const corePackagePath = join(projectRoot, 'packages/core/package.json')
if (existsSync(corePackagePath)) {
  const packageJson = JSON.parse(readFileSync(corePackagePath, 'utf8'))
  console.log('当前包配置:')
  console.log(`📦 包名: ${packageJson.name}`)
  console.log(`🏷️  版本: ${packageJson.version}`)

  if (packageJson.publishConfig) {
    console.log('🔧 已配置publishConfig:')
    console.log(`   Registry: ${packageJson.publishConfig.registry || 'public'}`)
    console.log(`   Access: ${packageJson.publishConfig.access || 'public'}`)
  }
}

console.log('\n📝 推荐配置步骤:')
console.log('1. 选择私有仓库方案')
console.log('2. 配置.npmrc文件')
console.log('3. 修改package.json的publishConfig')
console.log('4. 发布测试')