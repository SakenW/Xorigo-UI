#!/usr/bin/env node

/**
 * 包大小分析脚本
 * 分析每个包的构建产物大小，监控包体积变化
 */

import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = dirname(__dirname)

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function analyzePackage(packagePath, packageName) {
  const distPath = join(packagePath, 'dist')

  if (!readdirSync(distPath).length) {
    return null
  }

  let totalSize = 0
  const files = []

  function analyzeDir(dirPath, relativePath = '') {
    const items = readdirSync(dirPath)

    for (const item of items) {
      const itemPath = join(dirPath, item)
      const relativeItemPath = join(relativePath, item)
      const stat = statSync(itemPath)

      if (stat.isDirectory()) {
        analyzeDir(itemPath, relativeItemPath)
      } else {
        const fileSize = stat.size
        totalSize += fileSize

        files.push({
          name: relativeItemPath,
          size: fileSize,
          sizeFormatted: formatBytes(fileSize)
        })
      }
    }
  }

  analyzeDir(distPath)

  // 按大小排序
  files.sort((a, b) => b.size - a.size)

  return {
    name: packageName,
    totalSize,
    totalSizeFormatted: formatBytes(totalSize),
    files: files.slice(0, 10) // 只显示前10个最大的文件
  }
}

function analyzeAllPackages() {
  const packagesDir = join(rootDir, 'packages')
  const packages = readdirSync(packagesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

  const results = []

  for (const packageName of packages) {
    const packagePath = join(packagesDir, packageName)
    const distPath = join(packagePath, 'dist')

    try {
      if (readdirSync(distPath).length) {
        const analysis = analyzePackage(packagePath, packageName)
        if (analysis) {
          results.push(analysis)
        }
      }
    } catch (error) {
      log(`⚠️ 跳过 ${packageName}: ${error.message}`, 'yellow')
    }
  }

  return results
}

function generateReport(results) {
  log('📦 Xorigo UI 包大小分析报告\n', 'cyan')

  let totalSize = 0

  for (const result of results) {
    totalSize += result.totalSize

    log(`📁 ${result.name}`, 'blue')
    log(`   总大小: ${result.totalSizeFormatted}`, 'green')
    log(`   最大文件:`)

    for (const file of result.files.slice(0, 5)) {
      const barLength = Math.min(50, Math.floor(file.size / 1000))
      const bar = '█'.repeat(barLength) + '░'.repeat(50 - barLength)
      log(`   ${file.sizeFormatted.padStart(8)} │${bar}│ ${file.name}`)
    }

    log('')
  }

  log(`📊 总包大小: ${formatBytes(totalSize)}`, 'magenta')

  // 生成JSON报告
  const report = {
    timestamp: new Date().toISOString(),
    totalSize,
    totalSizeFormatted: formatBytes(totalSize),
    packages: results.map(r => ({
      name: r.name,
      totalSize: r.totalSize,
      totalSizeFormatted: r.totalSizeFormatted,
      fileCount: r.files.length
    }))
  }

  return report
}

function main() {
  const results = analyzeAllPackages()
  const report = generateReport(results)

  // 保存报告到文件
  const reportPath = join(rootDir, 'bundle-analysis.json')
  require('fs').writeFileSync(reportPath, JSON.stringify(report, null, 2))

  log(`📄 详细报告已保存到: ${reportPath}`, 'cyan')

  // 检查包大小是否超过阈值
  const WARN_SIZE_MB = 5 // 5MB警告阈值
  const ERROR_SIZE_MB = 10 // 10MB错误阈值

  for (const result of results) {
    const sizeMB = result.totalSize / (1024 * 1024)

    if (sizeMB > ERROR_SIZE_MB) {
      log(`🚫 ${result.name} 包过大 (${result.totalSizeFormatted})`, 'red')
    } else if (sizeMB > WARN_SIZE_MB) {
      log(`⚠️ ${result.name} 包较大 (${result.totalSizeFormatted})`, 'yellow')
    }
  }
}

main().catch(error => {
  log(`包大小分析失败: ${error.message}`, 'red')
  process.exit(1)
})