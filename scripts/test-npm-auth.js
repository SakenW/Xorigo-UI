#!/usr/bin/env node

/**
 * 测试 NPM 认证状态
 */

import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

try {
  const whoami = execSync('npm whoami', {
    encoding: 'utf8',
    cwd: join(projectRoot, 'packages/core')
  }).trim()

  console.log('✅ NPM 认证成功!')
  console.log(`   当前用户: ${whoami}`)
  console.log('   现在可以发布包到 NPM')

} catch (error) {
  console.log('❌ NPM 认证失败:')
  console.log(`   错误: ${error.message}`)
  console.log('   请检查 .npmrc 文件中的 Token 配置')
}