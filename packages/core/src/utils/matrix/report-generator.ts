// @ts-nocheck
/**
 * Matrix 验证报告生成器
 * 生成 Markdown 和 JSON 格式的验证报告
 */

import type { ValidationResult, ValidationIssue, SeverityLevel } from './config'

/**
 * 报告统计信息
 */
export interface ReportStatistics {
  /** 总问题数 */
  totalIssues: number
  /** 错误数 */
  errors: number
  /** 警告数 */
  warnings: number
  /** 信息数 */
  infos: number
  /** 通过率 (%) */
  passRate: number
}

/**
 * 计算报告统计信息
 * @param issues 问题列表
 * @returns 统计信息
 */
function calculateStatistics(issues: ValidationIssue[]): ReportStatistics {
  const totalIssues = issues.length
  const errors = issues.filter((i) => i.severity === 'error').length
  const warnings = issues.filter((i) => i.severity === 'warning').length
  const infos = issues.filter((i) => i.severity === 'info').length

  // 计算通过率 (错误和警告都算未通过)
  const failedChecks = errors + warnings
  const totalChecks = totalIssues || 1
  const passRate = Math.max(0, ((totalChecks - failedChecks) / totalChecks) * 100)

  return {
    totalIssues,
    errors,
    warnings,
    infos,
    passRate,
  }
}

/**
 * 生成严重级别图标
 * @param severity 严重级别
 * @returns 图标
 */
function getSeverityIcon(severity: SeverityLevel): string {
  const icons: Record<SeverityLevel, string> = {
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  }
  return icons[severity]
}

/**
 * 按类型分组问题
 * @param issues 问题列表
 * @returns 分组后的问题
 */
function groupIssuesByType(
  issues: ValidationIssue[]
): Record<string, ValidationIssue[]> {
  const grouped: Record<string, ValidationIssue[]> = {}

  for (const issue of issues) {
    if (!grouped[issue.type]) {
      grouped[issue.type] = []
    }
    grouped[issue.type].push(issue)
  }

  return grouped
}

/**
 * 生成 Markdown 格式的验证报告
 * @param result 验证结果
 * @returns Markdown 报告字符串
 */
export function generateMarkdownReport(result: ValidationResult): string {
  const { passed, recipeName, issues, timestamp, config } = result
  const stats = calculateStatistics(issues)

  const lines: string[] = []

  // 标题
  lines.push('# Matrix 可访问性验证报告\n')

  // 基本信息
  if (recipeName) {
    lines.push(`**配方名称**: ${recipeName}\n`)
  }
  lines.push(`**验证时间**: ${timestamp.toLocaleString('zh-CN')}\n`)
  lines.push(`**验证级别**: WCAG ${config.strictness}\n`)
  lines.push(`**验证结果**: ${passed ? '✅ 通过' : '❌ 未通过'}\n`)

  // 统计信息
  lines.push('## 📊 统计信息\n')
  lines.push('| 指标 | 数量 |')
  lines.push('|------|------|')
  lines.push(`| 总问题数 | ${stats.totalIssues} |`)
  lines.push(`| 错误 | ${stats.errors} |`)
  lines.push(`| 警告 | ${stats.warnings} |`)
  lines.push(`| 信息 | ${stats.infos} |`)
  lines.push(`| 通过率 | ${stats.passRate.toFixed(1)}% |\n`)

  // 详细问题列表
  if (issues.length > 0) {
    lines.push('## 🔍 问题详情\n')

    const groupedIssues = groupIssuesByType(issues)

    for (const [type, typeIssues] of Object.entries(groupedIssues)) {
      lines.push(`### ${type}\n`)

      for (const issue of typeIssues) {
        const icon = getSeverityIcon(issue.severity)
        lines.push(`${icon} **${issue.message}**\n`)

        if (issue.actual !== undefined) {
          lines.push(`- 实际值: ${issue.actual}`)
        }
        if (issue.expected !== undefined) {
          lines.push(`- 期望值: ${issue.expected}`)
        }
        if (issue.suggestion) {
          lines.push(`- 💡 建议: ${issue.suggestion}`)
        }
        lines.push('')
      }
    }
  } else {
    lines.push('## ✅ 恭喜！\n')
    lines.push('所有可访问性检查均已通过。\n')
  }

  // 配置信息
  lines.push('## ⚙️ 验证配置\n')
  lines.push('```json')
  lines.push(JSON.stringify(config, null, 2))
  lines.push('```\n')

  return lines.join('\n')
}

/**
 * 生成 JSON 格式的验证报告
 * @param result 验证结果
 * @returns JSON 报告对象
 */
export function generateJSONReport(result: ValidationResult): object {
  const stats = calculateStatistics(result.issues)
  const groupedIssues = groupIssuesByType(result.issues)

  return {
    summary: {
      passed: result.passed,
      recipeName: result.recipeName,
      timestamp: result.timestamp.toISOString(),
      strictness: result.config.strictness,
    },
    statistics: stats,
    issues: result.issues,
    issuesByType: groupedIssues,
    config: result.config,
  }
}

/**
 * 生成简化的控制台报告
 * @param result 验证结果
 * @returns 控制台报告字符串
 */
export function generateConsoleReport(result: ValidationResult): string {
  const { passed, recipeName, issues } = result
  const stats = calculateStatistics(issues)

  const lines: string[] = []

  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  lines.push('  Matrix 可访问性验证')
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  if (recipeName) {
    lines.push(`配方: ${recipeName}`)
  }
  lines.push(`结果: ${passed ? '✅ 通过' : '❌ 未通过'}`)
  lines.push(`通过率: ${stats.passRate.toFixed(1)}%`)
  lines.push('')

  if (stats.errors > 0) {
    lines.push(`❌ 错误: ${stats.errors}`)
  }
  if (stats.warnings > 0) {
    lines.push(`⚠️  警告: ${stats.warnings}`)
  }
  if (stats.infos > 0) {
    lines.push(`ℹ️  信息: ${stats.infos}`)
  }

  if (issues.length > 0) {
    lines.push('')
    lines.push('主要问题:')
    // 只显示前 5 个最严重的问题
    const topIssues = issues
      .filter((i) => i.severity === 'error')
      .slice(0, 5)

    for (const issue of topIssues) {
      lines.push(`  ${getSeverityIcon(issue.severity)} ${issue.message}`)
    }

    if (issues.length > topIssues.length) {
      lines.push(`  ... 还有 ${issues.length - topIssues.length} 个问题`)
    }
  }

  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  return lines.join('\n')
}

/**
 * 保存报告到文件
 * @param report 报告内容
 * @param filePath 文件路径
 * @param format 报告格式 ('markdown' | 'json')
 */
export function saveReport(
  report: string | object,
  filePath: string,
  format: 'markdown' | 'json'
): void {
  // 注意: 这个函数在浏览器环境中不可用
  // 仅在 Node.js 环境中使用
  if (typeof window !== 'undefined') {
    console.warn('saveReport 仅在 Node.js 环境中可用')
    return
  }

  const content =
    format === 'json' && typeof report === 'object'
      ? JSON.stringify(report, null, 2)
      : String(report)

  // 在 Node.js 环境中使用 fs 模块
  try {
    const fs = require('fs')
    fs.writeFileSync(filePath, content, 'utf-8')
    console.log(`报告已保存至: ${filePath}`)
  } catch (error) {
    console.error('保存报告失败:', error)
  }
}
