#!/usr/bin/env node

/**
 * Xorigo UI NPM 发布脚本
 */

import { execSync } from 'child_process'
import { readFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

function checkPrerequisites() {
  console.log('🔍 检查发布前置条件...')

  // 检查 NPM 登录
  try {
    const whoami = execSync('npm whoami', { encoding: 'utf8' }).trim()
    console.log(`✅ 已登录为: ${whoami}`)
  } catch (error) {
    console.error('❌ NPM 未登录，请先运行: npm login')
    process.exit(1)
  }

  // 检查包文件
  const corePackagePath = join(projectRoot, 'packages/core/package.json')
  if (!existsSync(corePackagePath)) {
    console.error('❌ 核心包不存在')
    process.exit(1)
  }

  const packageJson = JSON.parse(readFileSync(corePackagePath, 'utf8'))
  console.log(`📦 包信息: ${packageJson.name}@${packageJson.version}`)

  // 检查构建状态
  const distPath = join(projectRoot, 'packages/core/dist')
  if (!existsSync(distPath)) {
    console.error('❌ 构建目录不存在，请先运行: pnpm build')
    process.exit(1)
  }

  const requiredFiles = ['index.mjs', 'index.cjs.js', 'index.d.ts']
  const missingFiles = requiredFiles.filter(file =>
    !existsSync(join(distPath, file))
  )

  if (missingFiles.length > 0) {
    console.error('❌ 缺少构建文件:', missingFiles)
    process.exit(1)
  }

  console.log('✅ 构建文件完整')
}

function publishPackage(tag = 'latest') {
  try {
    console.log('\n🚀 开始发布 Xorigo UI...')

    // 检查前置条件
    checkPrerequisites()

    // 执行发布
    console.log(`📦 发布到 NPM (tag: ${tag})...`)

    execSync('npm publish --access public', {
      cwd: join(projectRoot, 'packages/core'),
      stdio: 'inherit'
    })

    console.log('\n🎉 发布成功！')
    console.log('🔗 包地址: https://www.npmjs.com/package/@xorigo-ui/core')
    console.log(`📦 版本: ${readFileSync(join(projectRoot, 'packages/core/package.json'), 'utf8').match(/"version": "([^"]+)"/)[1]}`)

  } catch (error) {
    console.error('\n❌ 发布失败:')
    console.error(error.message)
    process.exit(1)
  }
}

const tag = process.argv[2] || 'latest'

if (['latest', 'alpha', 'beta', 'rc'].includes(tag)) {
  publishPackage(tag)
} else {
  console.log('❌ 无效的 tag，可用选项: latest, alpha, beta, rc')
  process.exit(1)
}