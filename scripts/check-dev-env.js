#!/usr/bin/env node

/**
 * Xorigo UI 开发环境检查脚本
 * 检查本地开发环境是否满足要求
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

console.log('🔍 Xorigo UI 开发环境检查')
console.log('========================')

// 颜色输出函数
const colors = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`
}

let allChecksPassed = true

// 检查函数
function check(description, test, recommendation = '') {
  console.log(`\n${colors.blue('检查')}: ${description}`)

  try {
    const result = test()
    if (result) {
      console.log(`  ${colors.green('✅ 通过')}`)
      return true
    } else {
      console.log(`  ${colors.red('❌ 失败')}`)
      if (recommendation) {
        console.log(`  ${colors.yellow('建议')}: ${recommendation}`)
      }
      allChecksPassed = false
      return false
    }
  } catch (error) {
    console.log(`  ${colors.red('❌ 错误')}: ${error.message}`)
    if (recommendation) {
      console.log(`  ${colors.yellow('建议')}: ${recommendation}`)
    }
    allChecksPassed = false
    return false
  }
}

// 检查 Node.js 版本
check(
  'Node.js 版本 (需要 >= 22.0.0)',
  () => {
    const nodeVersion = process.version
    const requiredVersion = 'v22.0.0'
    const compareVersions = (v1, v2) => {
      const [major1, minor1, patch1] = v1.replace('v', '').split('.').map(Number)
      const [major2, minor2, patch2] = v2.replace('v', '').split('.').map(Number)

      if (major1 !== major2) return major1 - major2
      if (minor1 !== minor2) return minor1 - minor2
      return patch1 - patch2
    }

    const isValid = compareVersions(nodeVersion, requiredVersion) >= 0
    if (isValid) {
      console.log(`    当前版本: ${nodeVersion}`)
    }
    return isValid
  },
  '请升级到 Node.js 22.0.0 或更高版本: https://nodejs.org/'
)

// 检查包管理器
check(
  'pnpm 是否安装',
  () => {
    const pnpmVersion = execSync('pnpm --version', { encoding: 'utf8' }).trim()
    console.log(`    pnpm 版本: ${pnpmVersion}`)
    return true
  },
  '请安装 pnpm: npm install -g pnpm'
)

// 检查项目文件
check(
  'package.json 文件',
  () => fs.existsSync('package.json'),
  '确保在项目根目录运行此脚本'
)

check(
  'pnpm-lock.yaml 文件',
  () => fs.existsSync('pnpm-lock.yaml'),
  '运行 pnpm install 生成锁文件'
)

// 检查端口占用
const ports = [
  { port: 3000, name: '保留给其他库', should: false },
  { port: 3001, name: '核心库开发服务器', should: true },
  { port: 3002, name: '核心库预览服务器', should: false },
  { port: 3100, name: 'Website 开发服务器', should: true },
  { port: 6380, name: 'Redis 开发服务器', should: false }
]

console.log(`\n${colors.cyan('端口占用检查')}:`)

// 检查端口占用和进程信息
ports.forEach(({ port, name, should }) => {
  try {
    // 检查端口是否被占用
    const pid = execSync(`lsof -ti:${port}`, { stdio: 'ignore' }).toString().trim()
    if (pid) {
      // 获取占用端口的进程信息
      try {
        const processInfo = execSync(`ps -p ${pid} -o pid,ppid,cmd --no-headers`, { stdio: 'pipe' }).toString().trim()
        const [processId, parentPid, command] = processInfo.split(/\s+/)

        const status = should ? '✅ 正常占用' : '⚠️ 被占用'
        const color = should ? 'green' : should === false ? 'red' : 'yellow'
        console.log(`  端口 ${port}: ${colors[color](status)} (${name})`)

        if (!should) {
          console.log(`    ${colors.red('进程信息')}: PID ${processId} | 命令: ${command}`)
          console.log(`    ${colors.yellow('解决方案')}:
            1. 停止进程: kill ${pid}
            2. 或检查是否为正确的开发服务`)
        }
      } catch (cmdError) {
        console.log(`  端口 ${port}: ${colors.red('⚠️ 被占用')} (${name})`)
        console.log(`    ${colors.yellow('进程ID')}: ${pid}`)
        console.log(`    ${colors.yellow('解决方案')}: kill ${pid}`)
      }
    }
  } catch (error) {
    const status = should ? '⚠️ 未占用' : '✅ 空闲'
    const color = should ? 'yellow' : 'green'
    console.log(`  端口 ${port}: ${colors[color](status)} (${name})`)
    if (should) {
      console.log(`    ${colors.cyan('状态')}: 端口可用，可以启动相关服务`)
    } else {
      console.log(`    ${colors.green('状态')}: 端口空闲，无冲突`)
    }
  }
})

// 检查核心目录
check(
  'packages/core 目录',
  () => {
    const coreDir = path.join(process.cwd(), 'packages/core')
    const packageJson = path.join(coreDir, 'package.json')
    return fs.existsSync(coreDir) && fs.existsSync(packageJson)
  },
  '确保 packages/core 目录存在且包含 package.json'
)

check(
  'apps/website 目录',
  () => {
    const websiteDir = path.join(process.cwd(), 'apps/website')
    const packageJson = path.join(websiteDir, 'package.json')
    return fs.existsSync(websiteDir) && fs.existsSync(packageJson)
  },
  '确保 apps/website 目录存在且包含 package.json'
)

// 检查 TypeScript 配置
check(
  'TypeScript 配置',
  () => fs.existsSync('tsconfig.json'),
  '运行 npx tsc --init 创建 TypeScript 配置'
)

// 检查 Git 仓库
check(
  'Git 仓库初始化',
  () => {
    try {
      execSync('git rev-parse --git-dir', { stdio: 'ignore' })
      return true
    } catch {
      return false
    }
  },
  '运行 git init 初始化 Git 仓库'
)

// 输出检查结果
console.log(`\n${colors.blue('检查结果')}:`)

if (allChecksPassed) {
  console.log(`  ${colors.green('🎉 所有检查通过！')}`)
  console.log(`\n${colors.cyan('推荐的开发命令')}:`)
  console.log(`  ${colors.yellow('本地开发')}:   pnpm local:dev`)
  console.log(`  ${colors.yellow('Docker 开发')}: pnpm docker:dev`)
  console.log(`  ${colors.yellow('混合模式')}:   pnpm docker:dev:monorepo`)

  console.log(`\n${colors.cyan('访问地址')}:`)
  console.log(`  ${colors.yellow('核心库')}:     http://localhost:3001`)
  console.log(`  ${colors.yellow('Website')}:    http://localhost:3100`)
} else {
  console.log(`  ${colors.red('❌ 检查失败，请修复上述问题后重试')}`)
  console.log(`\n${colors.cyan('帮助命令')}:`)
  console.log(`  ${colors.yellow('安装依赖')}: pnpm install`)
  console.log(`  ${colors.yellow('环境设置')}: node scripts/setup-dev-env.js`)
  console.log(`  ${colors.yellow('查看帮助')}: pnpm dev --help`)

  process.exit(1)
}