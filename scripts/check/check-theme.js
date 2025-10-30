#!/usr/bin/env node

/**
 * 主题系统问题检查脚本
 *
 * 检查组件中的主题访问是否存在潜在的空指针问题
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 组件文件模式
const componentPatterns = [
  'packages/core/src/**/*.tsx',
  'apps/website/src/components/**/*.tsx'
]

// 检查问题模式
const issuePatterns = [
  // 直接访问 theme.colors 而没有检查
  /theme\.colors\./g,
  // 使用 useTheme() 而没有安全检查
  /const\s+\w+\s*=\s*useTheme\(\)/g,
  // 可能的空指针访问模式
  /theme\?\.\w+\s*\|\|\s*['"`][^'"`]*['"`]/g
]

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const issues = []

  // 检查直接访问 theme.colors 的情况
  const themeColorsMatches = content.match(/theme\.colors\.\w+(\.\w+)?/g)
  if (themeColorsMatches) {
    // 检查是否使用了 useThemeSafe
    const hasUseThemeSafe = content.includes('useThemeSafe')
    const hasThemeNullCheck = content.includes('theme') && (
      content.includes('theme &&') ||
      content.includes('theme ?') ||
      content.includes('theme?.') ||
      content.includes('theme ||')
    )

    if (!hasUseThemeSafe && !hasThemeNullCheck) {
      issues.push({
        type: 'UNSAFE_THEME_ACCESS',
        line: getLineNumber(content, 'theme.colors.'),
        message: `直接访问 theme.colors 而没有安全检查`,
        matches: themeColorsMatches
      })
    }
  }

  // 检查 useTheme() 使用情况
  const useThemeMatches = content.match(/const\s+\w+\s*=\s*useTheme\(\)/g)
  if (useThemeMatches) {
    issues.push({
      type: 'USE_THEME_WITHOUT_SAFE',
      line: getLineNumber(content, 'useTheme()'),
      message: `使用 useTheme() 而不是 useThemeSafe()，可能导致运行时错误`,
      matches: useThemeMatches
    })
  }

  // 检查直接使用 theme 而没有安全检查
  const directThemeMatches = content.match(/theme\.\w+/g)
  if (directThemeMatches) {
    const hasThemeNullCheck = content.includes('theme') && (
      content.includes('theme &&') ||
      content.includes('theme ?') ||
      content.includes('theme?.') ||
      content.includes('theme ||') ||
      content.includes('theme !== null') ||
      content.includes('theme !== undefined')
    )

    if (!hasThemeNullCheck) {
      issues.push({
        type: 'DIRECT_THEME_ACCESS',
        line: getLineNumber(content, 'theme.'),
        message: `直接访问 theme 对象而没有安全检查`,
        matches: directThemeMatches
      })
    }
  }

  return issues
}

function getLineNumber(content, pattern) {
  const lines = content.split('\n')
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(pattern)) {
      return i + 1
    }
  }
  return 0
}

// 简单的 glob 实现
function globPattern(pattern, root = process.cwd()) {
  const parts = pattern.split('/')
  const results = []

  function walkDir(currentPath, remainingParts) {
    if (remainingParts.length === 0) {
      if (currentPath.endsWith('.tsx')) {
        results.push(path.relative(root, currentPath))
      }
      return
    }

    const part = remainingParts[0]
    const nextParts = remainingParts.slice(1)

    if (part === '**') {
      // 递归搜索
      try {
        const entries = fs.readdirSync(currentPath, { withFileTypes: true })
        entries.forEach(entry => {
          const fullPath = path.join(currentPath, entry.name)
          if (entry.isDirectory()) {
            walkDir(fullPath, nextParts)
          } else if (entry.isFile() && nextParts.length === 0 && entry.name.endsWith('.tsx')) {
            results.push(path.relative(root, fullPath))
          }
        })
      } catch (err) {
        // 忽略权限错误等
      }
    } else {
      // 处理通配符
      try {
        const entries = fs.readdirSync(currentPath, { withFileTypes: true })
        entries.forEach(entry => {
          if (entry.isDirectory() && !part.includes('.')) {
            const fullPath = path.join(currentPath, entry.name)
            if (entry.name.startsWith(part.replace('*', '')) || part === '*') {
              walkDir(fullPath, nextParts)
            }
          } else if (entry.isFile() && part.includes('.tsx')) {
            const fullPath = path.join(currentPath, entry.name)
            if (entry.name.endsWith('.tsx')) {
              walkDir(fullPath, nextParts)
            }
          }
        })
      } catch (err) {
        // 忽略权限错误等
      }
    }
  }

  const absolutePattern = path.resolve(root, pattern)
  walkDir(root, pattern.split('/'))
  return results
}

function main() {
  console.log('🔍 检查 Xorigo UI 主题系统问题...\n')

  const allIssues = []

  componentPatterns.forEach(pattern => {
    const files = globPattern(pattern)

    files.forEach(filePath => {
      const fullPath = path.resolve(filePath)
      const issues = checkFile(fullPath)
      if (issues.length > 0) {
        allIssues.push({
          file: filePath,
          issues: issues
        })
      }
    })
  })

  // 输出结果
  if (allIssues.length === 0) {
    console.log('✅ 未发现主题系统问题')
  } else {
    console.log(`⚠️  发现 ${allIssues.length} 个文件存在主题系统问题:\n`)

    allIssues.forEach(({ file, issues }) => {
      console.log(`📁 ${file}`)
      issues.forEach(issue => {
        console.log(`   第${issue.line}行: ${issue.message}`)
        if (issue.matches) {
          console.log(`   匹配: ${issue.matches.join(', ')}`)
        }
      })
      console.log('')
    })

    console.log(`📊 总计: ${allIssues.reduce((sum, { issues }) => sum + issues.length, 0)} 个问题`)

    console.log('\n💡 建议修复方案:')
    console.log('1. 使用 useThemeSafe() 替代 useTheme()')
    console.log('2. 使用 theme?.colors.property 或提供默认值')
    console.log('3. 导入 theme-safe-access 工具函数')
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { checkFile, main }