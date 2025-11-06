#!/usr/bin/env node

/**
 * Xorigo CLI 主入口
 * 支持组件管理、主题配置和项目脚手架功能
 */

import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 获取 CLI 源码路径
const cliPath = path.join(__dirname, '..', 'dist', 'index.js')

// 检查是否存在编译后的文件
try {
  const { stat } = await import('fs/promises')
  await stat(cliPath)

  // 使用编译后的文件
  import(cliPath).catch((error) => {
    console.error('Failed to load CLI:', error)
    process.exit(1)
  })
} catch {
  // 如果没有编译，使用 tsx 运行
  console.log('Using tsx to run CLI...')

  const tsx = spawn('tsx', [path.join(__dirname, '..', 'src', 'index.ts')], {
    stdio: 'inherit',
    env: process.env
  })

  tsx.on('exit', (code) => {
    process.exit(code || 0)
  })
}
