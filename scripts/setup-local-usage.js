#!/usr/bin/env node

/**
 * 设置本地使用Xorigo UI
 */

import { writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

console.log('🏠 设置本地使用Xorigo UI\n')

// 创建本地使用的package.json模板
const localPackageTemplate = {
  "name": "your-project",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "@xorigo-ui/core": `file:${projectRoot}/packages/core`,
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "framer-motion": "^12.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^3.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.2.2",
    "@types/react-dom": "^19.2.1",
    "tailwindcss": "^3.4.18",
    "typescript": "~5.9.3"
  }
}

console.log('✅ 方案1: 直接引用本地包')
console.log('在您的package.json中添加:')
console.log(JSON.stringify(localPackageTemplate.dependencies, null, 2))
console.log('\n')

console.log('✅ 方案2: 使用npm link')
console.log('在Xorigo-UI目录:')
console.log('```bash')
console.log('cd packages/core')
console.log('npm link')
console.log('```')
console.log('在您的项目目录:')
console.log('```bash')
console.log('npm link @xorigo-ui/core')
console.log('```')
console.log('\n')

console.log('✅ 方案3: 直接引用dist文件')
console.log('```javascript')
console.log('import { Button, Input } from')
console.log(`  '${projectRoot}/packages/core/dist/index.mjs'`)
console.log('```')
console.log('\n')

// 检查构建状态
const distPath = join(projectRoot, 'packages/core/dist')
if (existsSync(distPath)) {
  console.log('🎯 当前状态: 核心包已构建，可直接使用')
  console.log('📁 构建文件位置:', distPath)
} else {
  console.log('❌ 核心包未构建，请先运行:')
  console.log('   cd', projectRoot, '&& pnpm build')
}

console.log('\n📖 完整指南: ./EXTERNAL_USAGE_GUIDE.md')
console.log('📁 示例项目: ./example-project/')