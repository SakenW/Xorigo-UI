/**
 * check 命令实现 - 质量和可访问性检查
 *
 * 功能：
 * - keyboard: 检查键盘导航合规性
 * - overlay: 检查弹层可访问性
 * - virtualization: 检查虚拟化性能
 */

import fs from 'fs/promises'
import path from 'path'
import chalk from 'chalk'
import ora from 'ora'

export interface CheckOptions {
  path?: string
  fix?: boolean
  verbose?: boolean
}

// 检查结果接口
interface CheckResult {
  passed: boolean
  file: string
  issues: CheckIssue[]
}

interface CheckIssue {
  severity: 'error' | 'warning' | 'info'
  message: string
  line?: number
  suggestion?: string
}

/**
 * 检查键盘导航合规性
 *
 * 验证项：
 * - 交互元素支持 Tab 键导航
 * - 支持 Enter 键触发
 * - 支持 Esc 键关闭
 * - 箭头键导航（适用于菜单、列表等）
 * - 焦点指示器可见
 */
export async function checkKeyboardNavigation(options: CheckOptions): Promise<void> {
  const spinner = ora('检查键盘导航合规性...').start()

  try {
    const sourcePath = options.path || path.join(process.cwd(), 'packages/core/src')
    const results: CheckResult[] = []

    // 递归扫描文件
    const files = await collectFiles(sourcePath, /\.(tsx?)$/)

    for (const file of files) {
      const content = await fs.readFile(file, 'utf-8')
      const issues: CheckIssue[] = []

      // 检查交互元素
      const interactivePatterns = [
        { pattern: /<button/g, name: 'button' },
        { pattern: /<a\s/g, name: 'link' },
        { pattern: /onClick/g, name: 'click handler' },
        { pattern: /role="button"/g, name: 'button role' },
      ]

      for (const { pattern, name } of interactivePatterns) {
        const matches = content.matchAll(pattern)
        for (const match of matches) {
          const lineNumber = content.substring(0, match.index).split('\n').length

          // 检查是否有 onKeyDown/onKeyPress
          const hasKeyHandler = /onKeyDown|onKeyPress/.test(content)
          if (!hasKeyHandler) {
            issues.push({
              severity: 'warning',
              message: `${name} 缺少键盘事件处理`,
              line: lineNumber,
              suggestion: '添加 onKeyDown={(e) => e.key === "Enter" && handleClick()}',
            })
          }

          // 检查是否有 tabIndex
          const contextStart = Math.max(0, (match.index || 0) - 100)
          const contextEnd = Math.min(content.length, (match.index || 0) + 200)
          const context = content.substring(contextStart, contextEnd)

          if (name === 'click handler' && !/tabIndex/.test(context)) {
            issues.push({
              severity: 'error',
              message: 'onClick 元素缺少 tabIndex 属性',
              line: lineNumber,
              suggestion: '添加 tabIndex={0} 使元素可获得焦点',
            })
          }

          // 检查焦点样式
          if (!/focus:|focus-visible:/.test(content)) {
            issues.push({
              severity: 'info',
              message: '建议添加焦点指示器样式',
              suggestion: '添加 focus:ring-2 focus:ring-primary-500 或 focus-visible:outline',
            })
            break // 每个文件只报告一次
          }
        }
      }

      if (issues.length > 0) {
        results.push({
          passed: issues.every(issue => issue.severity !== 'error'),
          file,
          issues,
        })
      }
    }

    spinner.succeed(chalk.green('✅ 键盘导航检查完成'))

    // 输出报告
    printCheckReport('键盘导航', results, options.verbose)
  } catch (error) {
    spinner.fail(chalk.red('键盘导航检查失败'))
    throw error
  }
}

/**
 * 检查弹层可访问性
 *
 * 验证项：
 * - 焦点陷阱（focus trap）
 * - Esc 键关闭
 * - ARIA 属性（role, aria-modal, aria-labelledby）
 * - 初始焦点管理
 * - 关闭后焦点恢复
 */
export async function checkOverlayAccessibility(options: CheckOptions): Promise<void> {
  const spinner = ora('检查弹层可访问性...').start()

  try {
    const sourcePath = options.path || path.join(process.cwd(), 'packages/core/src')
    const results: CheckResult[] = []

    const files = await collectFiles(sourcePath, /\.(tsx?)$/)

    for (const file of files) {
      const content = await fs.readFile(file, 'utf-8')
      const issues: CheckIssue[] = []

      // 识别弹层组件
      const isOverlayComponent =
        /Modal|Dialog|Drawer|Popover|Dropdown|Menu/i.test(content) ||
        /role="dialog"|role="alertdialog"/.test(content)

      if (!isOverlayComponent) continue

      // 检查 ARIA 属性
      if (!/aria-modal/.test(content)) {
        issues.push({
          severity: 'error',
          message: '弹层组件缺少 aria-modal 属性',
          suggestion: '添加 aria-modal={true}',
        })
      }

      if (!/aria-labelledby|aria-label/.test(content)) {
        issues.push({
          severity: 'error',
          message: '弹层组件缺少 aria-labelledby 或 aria-label',
          suggestion: '添加 aria-labelledby={titleId} 或 aria-label="弹层标题"',
        })
      }

      // 检查 Esc 键关闭
      if (!/Escape|Esc/.test(content)) {
        issues.push({
          severity: 'warning',
          message: '弹层组件可能不支持 Esc 键关闭',
          suggestion: '添加 onKeyDown={(e) => e.key === "Escape" && onClose()}',
        })
      }

      // 检查焦点管理
      if (!/useEffect.*focus|autoFocus/.test(content)) {
        issues.push({
          severity: 'warning',
          message: '弹层组件可能缺少初始焦点管理',
          suggestion: '使用 useEffect 或 autoFocus 设置初始焦点',
        })
      }

      // 检查焦点陷阱
      if (!/focus-trap|useFocusTrap/.test(content)) {
        issues.push({
          severity: 'error',
          message: '弹层组件缺少焦点陷阱',
          suggestion: '使用 focus-trap-react 或自定义 useFocusTrap hook',
        })
      }

      if (issues.length > 0) {
        results.push({
          passed: issues.every(issue => issue.severity !== 'error'),
          file,
          issues,
        })
      }
    }

    spinner.succeed(chalk.green('✅ 弹层可访问性检查完成'))

    // 输出报告
    printCheckReport('弹层可访问性', results, options.verbose)
  } catch (error) {
    spinner.fail(chalk.red('弹层可访问性检查失败'))
    throw error
  }
}

/**
 * 检查虚拟化性能
 *
 * 验证项：
 * - 大列表使用虚拟化
 * - 虚拟化配置合理
 * - 避免不必要的重渲染
 */
export async function checkVirtualization(options: CheckOptions): Promise<void> {
  const spinner = ora('检查虚拟化性能...').start()

  try {
    const sourcePath = options.path || path.join(process.cwd(), 'packages/core/src')
    const results: CheckResult[] = []

    const files = await collectFiles(sourcePath, /\.(tsx?)$/)

    for (const file of files) {
      const content = await fs.readFile(file, 'utf-8')
      const issues: CheckIssue[] = []

      // 识别列表组件
      const hasListRendering =
        /\.map\(.*=>\s*</.test(content) ||
        /Table|List|Grid/i.test(path.basename(file))

      if (!hasListRendering) continue

      // 检查是否使用虚拟化
      const usesVirtualization =
        /react-virtual|react-window|virtuoso|useVirtual/.test(content)

      // 检查列表长度阈值
      const hasLargeDataWarning =
        /length\s*>\s*\d{2,}/.test(content) || // 检查是否有长度判断
        /items\.length/.test(content)

      if (!usesVirtualization && hasLargeDataWarning) {
        issues.push({
          severity: 'warning',
          message: '大列表未使用虚拟化',
          suggestion: '考虑使用 react-virtual 或 react-window 进行虚拟化',
        })
      }

      // 检查 React.memo 优化
      if (hasListRendering && !/React\.memo|memo\(/.test(content)) {
        issues.push({
          severity: 'info',
          message: '列表项组件未使用 React.memo 优化',
          suggestion: '使用 React.memo 包裹列表项组件避免不必要的重渲染',
        })
      }

      // 检查 key 属性
      if (/\.map\(/.test(content)) {
        const mapMatches = content.matchAll(/\.map\((.*?)=>\s*<(.*?)>/gs)
        for (const match of mapMatches) {
          const element = match[2] || ''
          if (!/key=/.test(element)) {
            const lineNumber = content.substring(0, match.index).split('\n').length
            issues.push({
              severity: 'error',
              message: '列表渲染缺少 key 属性',
              line: lineNumber,
              suggestion: '添加唯一的 key 属性：key={item.id}',
            })
          }
        }
      }

      if (issues.length > 0) {
        results.push({
          passed: issues.every(issue => issue.severity !== 'error'),
          file,
          issues,
        })
      }
    }

    spinner.succeed(chalk.green('✅ 虚拟化性能检查完成'))

    // 输出报告
    printCheckReport('虚拟化性能', results, options.verbose)
  } catch (error) {
    spinner.fail(chalk.red('虚拟化性能检查失败'))
    throw error
  }
}

/**
 * 递归收集文件
 */
async function collectFiles(dir: string, pattern: RegExp): Promise<string[]> {
  const files: string[] = []

  async function scan(currentDir: string) {
    const items = await fs.readdir(currentDir, { withFileTypes: true })

    for (const item of items) {
      const fullPath = path.join(currentDir, item.name)

      if (item.isDirectory()) {
        if (!['node_modules', 'dist', '.git', 'tests'].includes(item.name)) {
          await scan(fullPath)
        }
      } else if (item.isFile() && pattern.test(item.name)) {
        files.push(fullPath)
      }
    }
  }

  await scan(dir)
  return files
}

/**
 * 打印检查报告
 */
function printCheckReport(title: string, results: CheckResult[], verbose?: boolean): void {
  console.log(chalk.bold(`\n📊 ${title} 检查报告`))
  console.log(chalk.gray('━'.repeat(50)))

  if (results.length === 0) {
    console.log(chalk.green('✅ 未发现问题'))
    return
  }

  // 统计
  const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0)
  const errors = results.reduce(
    (sum, r) => sum + r.issues.filter(i => i.severity === 'error').length,
    0
  )
  const warnings = results.reduce(
    (sum, r) => sum + r.issues.filter(i => i.severity === 'warning').length,
    0
  )
  const infos = results.reduce(
    (sum, r) => sum + r.issues.filter(i => i.severity === 'info').length,
    0
  )

  console.log(
    `\n共发现 ${chalk.cyan(totalIssues)} 个问题：` +
      ` ${chalk.red(errors)} 个错误,` +
      ` ${chalk.yellow(warnings)} 个警告,` +
      ` ${chalk.blue(infos)} 条建议`
  )
  console.log()

  // 详细报告
  for (const result of results) {
    const relativePath = path.relative(process.cwd(), result.file)
    const statusIcon = result.passed ? chalk.yellow('⚠️ ') : chalk.red('❌')

    console.log(`${statusIcon} ${chalk.cyan(relativePath)}`)

    if (verbose || !result.passed) {
      result.issues.forEach(issue => {
        const icon =
          issue.severity === 'error' ? chalk.red('  ✗') :
          issue.severity === 'warning' ? chalk.yellow('  ⚠') :
          chalk.blue('  ℹ')

        const location = issue.line ? chalk.gray(`:${issue.line}`) : ''
        console.log(`${icon} ${issue.message}${location}`)

        if (issue.suggestion && verbose) {
          console.log(chalk.gray(`    💡 ${issue.suggestion}`))
        }
      })
      console.log()
    }
  }

  // 总结
  if (errors > 0) {
    console.log(chalk.red(`\n❌ 检查失败：发现 ${errors} 个错误需要修复`))
  } else if (warnings > 0) {
    console.log(chalk.yellow(`\n⚠️  检查通过但有警告：建议修复 ${warnings} 个警告`))
  } else {
    console.log(chalk.green('\n✅ 检查通过'))
  }
}
