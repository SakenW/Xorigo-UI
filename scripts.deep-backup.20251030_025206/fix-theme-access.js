#!/usr/bin/env node

/**
 * 主题系统访问问题批量修复脚本
 *
 * 自动修复组件中的主题访问问题，添加空指针保护
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 需要修复的组件文件
const COMPONENTS_TO_FIX = [
  'packages/core/src/layout/flex/flex.tsx',
  'packages/core/src/layout/stack/stack.tsx',
  'packages/core/src/layout/container/container.tsx',
  'packages/core/src/layout/grid/grid.tsx',
  'packages/core/src/primitives/surface/surface.tsx',
  'packages/core/src/data-display/timeline/timeline.tsx',
  'packages/core/src/feedback/notification/notification.tsx',
  'packages/core/src/feedback/tooltip/tooltip.tsx',
  'packages/core/src/layout/spacer/spacer.tsx',
  'packages/core/src/navigation/breadcrumb/breadcrumb.tsx',
  'packages/core/src/navigation/navbar/navbar.tsx',
  'packages/core/src/navigation/tabs/tabs.tsx',
  'packages/core/src/feedback/alert/alert.tsx',
  'packages/core/src/feedback/loading/loading.tsx',
  'packages/core/src/feedback/progress/progress.tsx',
  'packages/core/src/feedback/badge/badge.tsx'
]

// 默认颜色值
const DEFAULT_COLORS = {
  'background.primary': '#ffffff',
  'background.secondary': '#f5f5f5',
  'background.tertiary': '#fafafa',
  'text.primary': '#000000',
  'text.secondary': '#666666',
  'text.muted': '#999999',
  'border.primary': '#e5e5e5',
  'border.secondary': '#d0d0d0',
  'border.tertiary': '#e8e8e8',
  'primary': '#2196f3',
  'secondary': '#9c27b0',
  'success': '#10b981',
  'error': '#ef4444',
  'warning': '#f59e0b',
  'info': '#3b82f6',
  'muted': '#f5f5f5',
  'popover': '#ffffff',
  'card': '#ffffff',
  'destructive': '#dc2626'
}

// 默认表面值
const DEFAULT_SURFACE = {
  'shadow': '0 4px 16px rgba(0, 0, 0, 0.1)',
  'blur': '0px',
  'glow': 'none',
  'backdrop': 'transparent'
}

function fixComponentThemeAccess(filePath) {
  console.log(`🔧 修复: ${filePath}`)

  if (!fs.existsSync(filePath)) {
    console.log(`   ⚠️  文件不存在: ${filePath}`)
    return false
  }

  let content = fs.readFileSync(filePath, 'utf8')
  let modified = false

  // 1. 修复 useTheme 导入和使用
  if (content.includes('useTheme, useThemeSafe')) {
    content = content.replace('useTheme, useThemeSafe', 'useThemeSafe')
    modified = true
    console.log('   ✓ 移除未使用的 useTheme 导入')
  }

  // 2. 修复 theme.colors.xxx 访问
  const themeColorsPattern = /theme\.colors\.([\w.]+)/g
  content = content.replace(themeColorsPattern, (match, path) => {
    modified = true
    const defaultValue = DEFAULT_COLORS[path] || '#000000'
    return `theme?.colors.${path} || '${defaultValue}'`
  })

  // 3. 修复 theme.surface.xxx 访问
  const themeSurfacePattern = /theme\.surface\.(\w+)/g
  content = content.replace(themeSurfacePattern, (match, prop) => {
    modified = true
    const defaultValue = DEFAULT_SURFACE[prop] || 'none'
    return `theme?.surface?.${prop} || '${defaultValue}'`
  })

  // 4. 修复 theme.tokens.xxx 访问
  const themeTokensPattern = /theme\.tokens\.(\w+)/g
  content = content.replace(themeTokensPattern, (match, prop) => {
    modified = true
    return `theme?.tokens?.${prop} || ''`
  })

  // 5. 修复 hsl() 包装的主题访问
  const hslPattern = /`hsl\(\$\{theme\.colors\.([\w.]+)\}\)`/g
  content = content.replace(hslPattern, (match, path) => {
    modified = true
    const defaultValue = DEFAULT_COLORS[path] || '#000000'
    return `\`hsl(\${theme?.colors.${path} || '${defaultValue}')\``
  })

  // 6. 修复直接使用 theme.xxx 的访问
  const directThemePattern = /theme\.([a-zA-Z][\w.]*)/g
  content = content.replace(directThemePattern, (match, path) => {
    // 不处理已经处理过的模式
    if (path.includes('colors.') || path.includes('surface.') || path.includes('tokens.')) {
      return match
    }
    modified = true
    return `theme?.${path}`
  })

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8')
    console.log('   ✅ 修复完成')
    return true
  } else {
    console.log('   ℹ️  无需修复')
    return false
  }
}

function main() {
  console.log('🔧 批量修复 Xorigo UI 主题系统访问问题...\n')

  let fixedCount = 0
  let totalCount = 0

  COMPONENTS_TO_FIX.forEach(filePath => {
    totalCount++
    if (fixComponentThemeAccess(filePath)) {
      fixedCount++
    }
  })

  console.log(`\n📊 修复统计:`)
  console.log(`   总文件数: ${totalCount}`)
  console.log(`   已修复: ${fixedCount}`)
  console.log(`   无需修复: ${totalCount - fixedCount}`)

  if (fixedCount > 0) {
    console.log('\n💡 建议下一步操作:')
    console.log('1. 重新启动开发服务器')
    console.log('2. 测试组件渲染是否正常')
    console.log('3. 运行 node scripts/check-theme-issues.js 验证修复效果')
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { fixComponentThemeAccess, main }