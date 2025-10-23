#!/usr/bin/env tsx

/**
 * Xorigo UI 主题令牌批量转换脚本
 *
 * 自动将所有组件中的硬编码颜色转换为主题令牌
 */

import { readdir, stat } from 'fs/promises'
import { join, extname } from 'path'
import { convertFilesToThemeTokens, generateConversionReport, ConversionConfig } from '../packages/core/src/utils/theme-converter'

// =============================================================================
// 配置
// =============================================================================

const COMPONENTS_DIR = join(__dirname, '../packages/core/src/components')
const EXAMPLES_DIR = join(__dirname, '../packages/core/src/examples')
const MOTION_DIR = join(__dirname, '../packages/core/src/motion')

const IGNORE_PATTERNS = [
  '*.backup.*',
  '*.test.*',
  '*.stories.*',
  'node_modules/*',
  'dist/*',
  '.git/*'
]

const CUSTOM_RULES = {
  // 特殊的颜色映射规则
  'bg-white': 'bg-background-primary',
  'text-black': 'text-text-primary',
  'border-black': 'border-border-emphasis',
  'ring-white': 'ring-border-emphasis',

  // 特殊的背景效果
  'bg-white/80': 'bg-surface-80',
  'bg-black/50': 'bg-surface-50',
  'bg-white/90': 'bg-surface-90',
  'bg-black/90': 'bg-surface-90',
}

// =============================================================================
// 工具函数
// =============================================================================

/**
 * 递归获取目录中的所有 TypeScript/JavaScript 文件
 */
async function getAllFiles(dir: string, extensions: string[] = ['.ts', '.tsx', '.js', '.jsx']): Promise<string[]> {
  const files: string[] = []

  try {
    const entries = await readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(dir, entry.name)

      if (entry.isDirectory()) {
        // 递归处理子目录
        const subFiles = await getAllFiles(fullPath, extensions)
        files.push(...subFiles)
      } else if (entry.isFile()) {
        // 检查文件扩展名
        const ext = extname(entry.name)
        if (extensions.includes(ext)) {
          files.push(fullPath)
        }
      }
    }
  } catch (error) {
    console.warn(`⚠️  无法读取目录: ${dir}`, error)
  }

  return files
}

/**
 * 过滤掉应该忽略的文件
 */
function filterFiles(files: string[], ignorePatterns: string[]): string[] {
  return files.filter(file => {
    return !ignorePatterns.some(pattern => {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'))
      return regex.test(file)
    })
  })
}

// =============================================================================
// 主函数
// =============================================================================

async function main() {
  console.log('🎨 Xorigo UI 主题令牌转换工具')
  console.log('=====================================\n')

  try {
    // 1. 收集所有需要转换的文件
    console.log('📁 扫描文件中...')

    const componentFiles = await getAllFiles(COMPONENTS_DIR)
    const exampleFiles = await getAllFiles(EXAMPLES_DIR)
    const motionFiles = await getAllFiles(MOTION_DIR)

    const allFiles = [...componentFiles, ...exampleFiles, ...motionFiles]
    const filteredFiles = filterFiles(allFiles, IGNORE_PATTERNS)

    console.log(`📊 发现 ${allFiles.length} 个文件，过滤后 ${filteredFiles.length} 个文件需要处理\n`)

    if (filteredFiles.length === 0) {
      console.log('✅ 没有需要转换的文件')
      return
    }

    // 2. 配置转换选项
    const conversionConfig: Partial<ConversionConfig> = {
      createBackup: true,
      verbose: true,
      customRules: CUSTOM_RULES,
      ignorePatterns: IGNORE_PATTERNS
    }

    // 3. 执行批量转换
    console.log('🔄 开始批量转换...\n')

    const results = convertFilesToThemeTokens(filteredFiles, conversionConfig)
    const report = generateConversionReport(results)

    // 4. 显示转换结果
    console.log('\n📋 转换结果报告')
    console.log('==================')

    console.log(`📁 总文件数: ${report.summary.totalFiles}`)
    console.log(`✅ 成功转换: ${report.summary.successfulFiles}`)
    console.log(`❌ 转换失败: ${report.summary.failedFiles}`)
    console.log(`🎨 总类名数: ${report.summary.totalClasses}`)
    console.log(`🔄 已映射类名: ${report.summary.totalMapped}`)
    console.log(`📊 平均映射率: ${report.summary.averageMappingRate.toFixed(1)}%\n`)

    // 5. 显示失败的文件
    if (report.failures.length > 0) {
      console.log('❌ 转换失败的文件:')
      report.failures.forEach(failure => {
        console.log(`   - ${failure.filePath}: ${failure.error}`)
      })
      console.log('')
    }

    // 6. 显示映射统计详情
    console.log('📊 详细映射统计:')
    console.log('==================')

    const successfulResults = report.details.filter(r => r.success)

    // 按映射率排序
    successfulResults.sort((a, b) => b.stats.mappingRate - a.stats.mappingRate)

    successfulResults.forEach(result => {
      const relativePath = result.filePath.replace(process.cwd(), '.')
      const { stats } = result

      if (stats.themeRelated > 0) {
        console.log(`${relativePath}:`)
        console.log(`   - 主题相关类: ${stats.themeRelated}`)
        console.log(`   - 成功映射: ${stats.mapped}`)
        console.log(`   - 未映射: ${stats.unmapped}`)
        console.log(`   - 映射率: ${stats.mappingRate.toFixed(1)}%`)

        if (stats.unmappedClasses.length > 0) {
          console.log(`   - 未映射类名: ${stats.unmappedClasses.slice(0, 5).join(', ')}${stats.unmappedClasses.length > 5 ? '...' : ''}`)
        }
        console.log('')
      }
    })

    // 7. 生成转换报告文件
    const reportContent = generateReportContent(report)
    const reportPath = join(__dirname, '../docs/reports/theme-conversion-report.md')

    try {
      await import('fs').then(fs => {
        fs.writeFileSync(reportPath, reportContent, 'utf-8')
      })
      console.log(`📄 详细报告已生成: ${reportPath}`)
    } catch (error) {
      console.warn('⚠️  无法生成报告文件:', error)
    }

    // 8. 总结和建议
    console.log('\n💡 后续建议:')
    console.log('=============')

    if (report.summary.averageMappingRate < 80) {
      console.log('🔧 仍有较多硬编码颜色未映射，建议:')
      console.log('   - 检查自定义映射规则')
      console.log('   - 手动处理特殊的颜色值')
      console.log('   - 更新主题令牌映射表')
    }

    if (report.summary.failedFiles > 0) {
      console.log('🔧 部分文件转换失败，建议:')
      console.log('   - 检查文件权限')
      console.log('   - 验证文件格式')
      console.log('   - 手动处理失败的文件')
    }

    console.log('🔧 转换完成后建议:')
    console.log('   - 运行测试确保功能正常')
    console.log('   - 检查主题切换效果')
    console.log('   - 更新组件文档')

    console.log('\n🎉 主题令牌转换完成!')

  } catch (error) {
    console.error('❌ 转换过程中发生错误:', error)
    process.exit(1)
  }
}

/**
 * 生成转换报告内容
 */
function generateReportContent(report: any): string {
  const now = new Date().toLocaleString('zh-CN')

  return `# 🎨 Xorigo UI 主题令牌转换报告

## 📋 转换概述

**转换时间**: ${now}
**转换工具**: Xorigo UI Theme Token Converter v1.0

## 📊 转换统计

| 指标 | 数值 |
|------|------|
| 总文件数 | ${report.summary.totalFiles} |
| 成功转换 | ${report.summary.successfulFiles} |
| 转换失败 | ${report.summary.failedFiles} |
| 总类名数 | ${report.summary.totalClasses} |
| 已映射类名 | ${report.summary.totalMapped} |
| 平均映射率 | ${report.summary.averageMappingRate.toFixed(1)}% |

## 📁 转换详情

### 成功转换的文件

${report.details.filter((r: any) => r.success && r.stats.themeRelated > 0).map((result: any) => {
  const relativePath = result.filePath.replace(process.cwd(), '.')
  const { stats } = result
  return `
#### ${relativePath}

- **主题相关类**: ${stats.themeRelated}
- **成功映射**: ${stats.mapped}
- **未映射**: ${stats.unmapped}
- **映射率**: ${stats.mappingRate.toFixed(1)}%
${stats.unmappedClasses.length > 0 ? `- **未映射类名**: ${stats.unmappedClasses.join(', ')}` : ''}
`
}).join('\n')}

### 转换失败的文件

${report.failures.length > 0 ? report.failures.map((failure: any) => {
  const relativePath = failure.filePath.replace(process.cwd(), '.')
  return `
#### ${relativePath}

**错误**: ${failure.error}
`
}).join('\n') : '无转换失败的文件。'}

## 🔧 自定义映射规则

本次转换使用的自定义规则:

\`\`\`typescript
${JSON.stringify(CUSTOM_RULES, null, 2)}
\`\`\`

## 💡 后续建议

### 立即处理
1. 检查转换失败的文件并手动修复
2. 验证未映射的类名是否需要添加到映射表
3. 运行组件测试确保功能正常

### 质量保证
1. 测试所有主题配方的显示效果
2. 检查深色模式下的对比度
3. 验证可访问性标准合规性

### 文档更新
1. 更新组件使用文档
2. 添加主题令牌使用指南
3. 创建主题开发最佳实践文档

---

**报告生成时间**: ${now}
**工具版本**: v1.0
`
}

// =============================================================================
// 执行脚本
// =============================================================================

if (require.main === module) {
  main().catch(console.error)
}