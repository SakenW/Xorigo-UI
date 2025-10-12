#!/usr/bin/env node

// 修复构建后的文件中的 framer-motion 导入问题
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const distDir = path.join(__dirname, 'dist')

// 读取并修复所有 JS 文件中的 framer-motion 导入
function fixFile(filePath) {
  if (!fs.existsSync(filePath)) return

  let content = fs.readFileSync(filePath, 'utf8')

  // 将 framer-motion 导入替换为简单的 motion polyfill
  content = content.replace(
    /import\s*\{([^}]*motion[^}]*)\}\s*from\s*["']framer-motion["']/g,
    "// MOTION_EXTERNALIZED: framer-motion will be provided by consumer\nconst motion = (props) => props.children\nconst $1 = { motion }"
  )

  fs.writeFileSync(filePath, content)
  console.log(`Fixed: ${filePath}`)
}

// 修复所有 JS 文件
function fixDirectory(dir) {
  if (!fs.existsSync(dir)) return

  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      fixDirectory(filePath)
    } else if (file.endsWith('.js') || file.endsWith('.mjs')) {
      fixFile(filePath)
    }
  }
}

console.log('开始修复构建文件中的 framer-motion 导入...')
fixDirectory(distDir)
console.log('修复完成！')