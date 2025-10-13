/**
 * doctor 命令实现 - 健康检查和问题诊断
 *
 * 功能：
 * - 包版本一致性检查
 * - TypeScript 编译检查
 * - ESLint 规则检查
 * - Bundle Size 检查
 * - Registry 一致性检查
 * - 健康报告生成
 * - 自动修复功能
 */

import fs from 'fs/promises'
import path from 'path'
import { execSync } from 'child_process'
import chalk from 'chalk'
import ora from 'ora'

export interface DoctorOptions {
  path?: string
  fix?: boolean
  verbose?: boolean
  report?: string
}

// 健康检查结果接口
interface HealthResult {
  status: 'healthy' | 'warning' | 'error'
  category: string
  message: string
  details?: string
  fixAvailable?: boolean
  fixCommand?: string
}

interface HealthReport {
  overall: 'healthy' | 'warning' | 'error'
  timestamp: string
  results: HealthResult[]
  summary: {
    total: number
    errors: number
    warnings: number
    healthy: number
  }
}

/**
 * 执行完整的健康检查
 */
export async function runDoctor(options: DoctorOptions): Promise<void> {
  const spinner = ora('🔍 执行系统健康检查...').start()

  try {
    const reportPath = options.path || process.cwd()
    const results: HealthResult[] = []

    // 1. 检查 Node.js 版本
    await checkNodeVersion(results)

    // 2. 检查包版本一致性
    await checkPackageConsistency(reportPath, results)

    // 3. TypeScript 编译检查
    await checkTypeScriptCompilation(reportPath, results)

    // 4. ESLint 检查
    await checkESLintRules(reportPath, results, options.fix)

    // 5. Bundle Size 检查
    await checkBundleSize(reportPath, results)

    // 6. Registry 一致性检查
    await checkRegistryConsistency(reportPath, results)

    // 7. 依赖安全检查
    await checkDependencySecurity(reportPath, results)

    // 8. 测试覆盖率检查
    await checkTestCoverage(reportPath, results)

    spinner.succeed(chalk.green('✅ 健康检查完成'))

    // 生成报告
    const report = generateHealthReport(results)
    printHealthReport(report, options.verbose)

    // 保存报告
    if (options.report) {
      await saveHealthReport(report, options.report)
    }

    // 根据结果设置退出码
    if (report.summary.errors > 0) {
      process.exit(1)
    } else if (report.summary.warnings > 0) {
      process.exit(2)
    }

  } catch (error) {
    spinner.fail(chalk.red('❌ 健康检查失败'))
    throw error
  }
}

/**
 * 检查 Node.js 版本
 */
async function checkNodeVersion(results: HealthResult[]): Promise<void> {
  const nodeVersion = process.version
  const majorVersion = parseInt(nodeVersion?.slice(1)?.split('.')[0] || '0')

  if (majorVersion < 18) {
    results.push({
      status: 'error',
      category: 'Environment',
      message: `Node.js 版本过低: ${nodeVersion}`,
      details: 'Xorigo UI 需要 Node.js 18 或更高版本',
      fixAvailable: true,
      fixCommand: '请升级 Node.js 到 18 或更高版本'
    })
  } else {
    results.push({
      status: 'healthy',
      category: 'Environment',
      message: `Node.js 版本正常: ${nodeVersion}`
    })
  }
}

/**
 * 检查包版本一致性
 */
async function checkPackageConsistency(rootPath: string, results: HealthResult[]): Promise<void> {
  try {
    const packages = await findPackageJsonFiles(rootPath)
    const versionMap = new Map<string, Set<string>>()

    // 收集所有包的版本信息
    for (const packagePath of packages) {
      try {
        const content = await fs.readFile(packagePath, 'utf-8')
        const pkg = JSON.parse(content)

        // 检查依赖版本
        for (const [name, version] of Object.entries(pkg.dependencies || {})) {
          if (!versionMap.has(name)) {
            versionMap.set(name, new Set())
          }
          versionMap.get(name)!.add(String(version))
        }
      } catch (error) {
        // 忽略解析失败的 package.json
      }
    }

    // 检查版本不一致的包
    let inconsistencies = 0
    for (const [name, versions] of versionMap) {
      if (versions.size > 1) {
        inconsistencies++
        results.push({
          status: 'warning',
          category: 'Dependencies',
          message: `包 ${name} 版本不一致`,
          details: `发现版本: ${Array.from(versions).join(', ')}`,
          fixAvailable: true,
          fixCommand: '使用 npm workspaces 或 lerna 统一版本管理'
        })
      }
    }

    if (inconsistencies === 0) {
      results.push({
        status: 'healthy',
        category: 'Dependencies',
        message: '所有包版本保持一致'
      })
    }

  } catch (error) {
    results.push({
      status: 'error',
      category: 'Dependencies',
      message: '无法检查包版本一致性',
      details: String(error)
    })
  }
}

/**
 * 检查 TypeScript 编译
 */
async function checkTypeScriptCompilation(rootPath: string, results: HealthResult[]): Promise<void> {
  try {
    // 检查是否存在 TypeScript 配置
    const tsconfigPath = path.join(rootPath, 'tsconfig.json')
    try {
      await fs.access(tsconfigPath)
    } catch {
      results.push({
        status: 'warning',
        category: 'TypeScript',
        message: '未找到 tsconfig.json',
        details: '项目可能未配置 TypeScript'
      })
      return
    }

    // 执行 TypeScript 编译检查
    try {
      execSync('npx tsc --noEmit', {
        cwd: rootPath,
        stdio: 'pipe',
        encoding: 'utf-8'
      })

      results.push({
        status: 'healthy',
        category: 'TypeScript',
        message: 'TypeScript 编译检查通过'
      })

    } catch (error: any) {
      const output = (error.stdout as string) || (error.stderr as string) || String(error)
      results.push({
        status: 'error',
        category: 'TypeScript',
        message: 'TypeScript 编译失败',
        details: output.split('\n').slice(0, 5).join('\n'),
        fixAvailable: true,
        fixCommand: '运行 npx tsc --noEmit 查看详细错误信息'
      })
    }

  } catch (error) {
    results.push({
      status: 'error',
      category: 'TypeScript',
      message: '无法执行 TypeScript 检查',
      details: String(error)
    })
  }
}

/**
 * 检查 ESLint 规则
 */
async function checkESLintRules(rootPath: string, results: HealthResult[], autoFix?: boolean): Promise<void> {
  try {
    // 检查是否存在 ESLint 配置
    const eslintConfigs = [
      '.eslintrc.js',
      '.eslintrc.cjs',
      '.eslintrc.json',
      'eslint.config.js'
    ]

    let hasConfig = false
    for (const config of eslintConfigs) {
      try {
        await fs.access(path.join(rootPath, config))
        hasConfig = true
        break
      } catch {
        // 继续检查下一个配置文件
      }
    }

    if (!hasConfig) {
      results.push({
        status: 'warning',
        category: 'Code Quality',
        message: '未找到 ESLint 配置',
        details: '建议配置 ESLint 以保证代码质量'
      })
      return
    }

    // 执行 ESLint 检查
    const cmd = autoFix ? 'npx eslint . --fix' : 'npx eslint .'
    try {
      const output = execSync(cmd, {
        cwd: rootPath,
        stdio: 'pipe',
        encoding: 'utf-8'
      })

      if (output.trim()) {
        results.push({
          status: 'warning',
          category: 'Code Quality',
          message: autoFix ? 'ESLint 已自动修复部分问题' : 'ESLint 发现代码质量问题',
          details: output.split('\n').slice(0, 10).join('\n')
        })
      } else {
        results.push({
          status: 'healthy',
          category: 'Code Quality',
          message: 'ESLint 检查通过'
        })
      }

    } catch (error: any) {
      const output = (error.stdout as string) || (error.stderr as string) || String(error)
      results.push({
        status: 'error',
        category: 'Code Quality',
        message: 'ESLint 发现严重问题',
        details: output.split('\n').slice(0, 10).join('\n'),
        fixAvailable: true,
        fixCommand: '运行 npx eslint . --fix 自动修复'
      })
    }

  } catch (error) {
    results.push({
      status: 'error',
      category: 'Code Quality',
      message: '无法执行 ESLint 检查',
      details: String(error)
    })
  }
}

/**
 * 检查 Bundle Size
 */
async function checkBundleSize(rootPath: string, results: HealthResult[]): Promise<void> {
  try {
    const distPath = path.join(rootPath, 'dist')

    // 检查是否存在构建产物
    try {
      await fs.access(distPath)
    } catch {
      results.push({
        status: 'warning',
        category: 'Build',
        message: '未找到构建产物',
        details: '请先运行 npm run build',
        fixAvailable: true,
        fixCommand: 'npm run build'
      })
      return
    }

    // 计算 Bundle 大小
    const bundleStats = await calculateBundleSize(distPath)
    const totalSize = bundleStats.totalSize

    // 设置大小阈值 (1MB)
    const sizeThreshold = 1024 * 1024

    if (totalSize > sizeThreshold) {
      results.push({
        status: 'warning',
        category: 'Build',
        message: `Bundle 过大: ${(totalSize / 1024 / 1024).toFixed(2)} MB`,
        details: `建议控制在 1MB 以内，当前: ${bundleStats.fileCount} 个文件`,
        fixAvailable: true,
        fixCommand: '使用 webpack-bundle-analyzer 分析并优化 Bundle'
      })
    } else {
      results.push({
        status: 'healthy',
        category: 'Build',
        message: `Bundle 大小正常: ${(totalSize / 1024).toFixed(2)} KB`,
        details: `${bundleStats.fileCount} 个文件`
      })
    }

  } catch (error) {
    results.push({
      status: 'error',
      category: 'Build',
      message: '无法检查 Bundle 大小',
      details: String(error)
    })
  }
}

/**
 * 检查 Registry 一致性
 */
async function checkRegistryConsistency(rootPath: string, results: HealthResult[]): Promise<void> {
  try {
    const registryPath = path.join(rootPath, 'packages/registry/registry.json')

    try {
      await fs.access(registryPath)
    } catch {
      results.push({
        status: 'warning',
        category: 'Registry',
        message: '未找到 registry.json',
        details: '组件注册表可能未生成'
      })
      return
    }

    // 读取并验证注册表
    const registryContent = await fs.readFile(registryPath, 'utf-8')
    const registry = JSON.parse(registryContent)

    if (!registry.components || !Array.isArray(registry.components)) {
      results.push({
        status: 'error',
        category: 'Registry',
        message: 'Registry 格式无效',
        details: 'components 字段缺失或格式错误'
      })
      return
    }

    // 检查组件是否存在
    const corePath = path.join(rootPath, 'packages/core/src')
    const componentFiles = await collectComponentFiles(corePath)
    const registryComponents = registry.components.map((c: any) => c.name)

    const missingComponents = componentFiles.filter(file =>
      !registryComponents.includes(file)
    )

    const extraComponents = registryComponents.filter((name: string) =>
      !componentFiles.includes(name)
    )

    if (missingComponents.length > 0 || extraComponents.length > 0) {
      results.push({
        status: 'warning',
        category: 'Registry',
        message: 'Registry 与实际组件不一致',
        details: `缺失: ${missingComponents.join(', ')} | 多余: ${extraComponents.join(', ')}`,
        fixAvailable: true,
        fixCommand: '运行 xorigo sync 更新注册表'
      })
    } else {
      results.push({
        status: 'healthy',
        category: 'Registry',
        message: 'Registry 与组件一致',
        details: `共 ${registryComponents.length} 个组件`
      })
    }

  } catch (error) {
    results.push({
      status: 'error',
      category: 'Registry',
      message: '无法检查 Registry 一致性',
      details: String(error)
    })
  }
}

/**
 * 检查依赖安全性
 */
async function checkDependencySecurity(rootPath: string, results: HealthResult[]): Promise<void> {
  try {
    try {
      const output = execSync('npm audit --json', {
        cwd: rootPath,
        stdio: 'pipe',
        encoding: 'utf-8'
      })

      const audit = JSON.parse(output)
      const vulnerabilities = audit.metadata?.vulnerabilities || 0

      if (vulnerabilities > 0) {
        results.push({
          status: 'error',
          category: 'Security',
          message: `发现 ${vulnerabilities} 个安全漏洞`,
          details: `高危: ${audit.metadata.high}, 中危: ${audit.metadata.medium}`,
          fixAvailable: true,
          fixCommand: 'npm audit fix'
        })
      } else {
        results.push({
          status: 'healthy',
          category: 'Security',
          message: '未发现安全漏洞'
        })
      }

    } catch (error: any) {
      // npm audit 在有漏洞时会返回非零退出码
      const output = error.stdout || error.stderr || String(error)
      if (output.includes('vulnerabilities')) {
        results.push({
          status: 'warning',
          category: 'Security',
          message: '发现潜在安全漏洞',
          details: '运行 npm audit 查看详细信息',
          fixAvailable: true,
          fixCommand: 'npm audit fix'
        })
      }
    }

  } catch (error) {
    results.push({
      status: 'error',
      category: 'Security',
      message: '无法检查依赖安全性',
      details: String(error)
    })
  }
}

/**
 * 检查测试覆盖率
 */
async function checkTestCoverage(rootPath: string, results: HealthResult[]): Promise<void> {
  try {
    const packageJsonPath = path.join(rootPath, 'package.json')
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'))

    if (!packageJson.scripts?.test) {
      results.push({
        status: 'warning',
        category: 'Testing',
        message: '未配置测试脚本',
        details: '建议添加测试脚本和覆盖率检查'
      })
      return
    }

    // 尝试生成覆盖率报告
    try {
      const output = execSync('npm run test -- --coverage --watchAll=false', {
        cwd: rootPath,
        stdio: 'pipe',
        encoding: 'utf-8'
      })

      // 解析覆盖率结果
      const coverageMatch = output.match(/All files\s+\|\s+([\d.]+)/)
      const coverage = coverageMatch ? parseFloat(coverageMatch[1] || '0') : 0

      if (coverage >= 80) {
        results.push({
          status: 'healthy',
          category: 'Testing',
          message: `测试覆盖率良好: ${coverage.toFixed(1)}%`
        })
      } else if (coverage >= 60) {
        results.push({
          status: 'warning',
          category: 'Testing',
          message: `测试覆盖率偏低: ${coverage.toFixed(1)}%`,
          details: '建议达到 80% 以上的覆盖率'
        })
      } else {
        results.push({
          status: 'error',
          category: 'Testing',
          message: `测试覆盖率过低: ${coverage.toFixed(1)}%`,
          details: '建议达到 80% 以上的覆盖率'
        })
      }

    } catch (error: any) {
      results.push({
        status: 'warning',
        category: 'Testing',
        message: '无法获取测试覆盖率',
        details: '确保测试环境配置正确'
      })
    }

  } catch (error) {
    results.push({
      status: 'error',
      category: 'Testing',
      message: '无法检查测试覆盖率',
      details: String(error)
    })
  }
}

/**
 * 查找所有 package.json 文件
 */
async function findPackageJsonFiles(rootPath: string): Promise<string[]> {
  const files: string[] = []

  async function scan(dir: string) {
    const items = await fs.readdir(dir, { withFileTypes: true })

    for (const item of items) {
      const fullPath = path.join(dir, item.name)

      if (item.isDirectory() && !['node_modules', 'dist', '.git'].includes(item.name)) {
        await scan(fullPath)
      } else if (item.isFile() && item.name === 'package.json') {
        files.push(fullPath)
      }
    }
  }

  await scan(rootPath)
  return files
}

/**
 * 收集组件文件列表
 */
async function collectComponentFiles(corePath: string): Promise<string[]> {
  const components: string[] = []

  try {
    const files = await fs.readdir(corePath, { withFileTypes: true })

    for (const file of files) {
      if (file.isDirectory() && !file.name.startsWith('.')) {
        const componentPath = path.join(corePath, file.name)
        const indexFile = path.join(componentPath, 'index.ts')

        try {
          await fs.access(indexFile)
          components.push(file.name)
        } catch {
          // 没有 index.ts 的不是组件
        }
      }
    }
  } catch (error) {
    // 忽略错误
  }

  return components
}

/**
 * 计算 Bundle 大小
 */
async function calculateBundleSize(distPath: string): Promise<{ totalSize: number; fileCount: number }> {
  let totalSize = 0
  let fileCount = 0

  async function scan(dir: string) {
    const items = await fs.readdir(dir, { withFileTypes: true })

    for (const item of items) {
      const fullPath = path.join(dir, item.name)

      if (item.isDirectory()) {
        await scan(fullPath)
      } else if (item.isFile()) {
        const stats = await fs.stat(fullPath)
        totalSize += stats.size
        fileCount++
      }
    }
  }

  await scan(distPath)
  return { totalSize, fileCount }
}

/**
 * 生成健康报告
 */
function generateHealthReport(results: HealthResult[]): HealthReport {
  const summary = {
    total: results.length,
    errors: results.filter(r => r.status === 'error').length,
    warnings: results.filter(r => r.status === 'warning').length,
    healthy: results.filter(r => r.status === 'healthy').length
  }

  const overall = summary.errors > 0 ? 'error' :
                  summary.warnings > 0 ? 'warning' : 'healthy'

  return {
    overall,
    timestamp: new Date().toISOString(),
    results,
    summary
  }
}

/**
 * 打印健康报告
 */
function printHealthReport(report: HealthReport, verbose?: boolean): void {
  console.log(chalk.bold(`\n🏥 Xorigo UI 健康检查报告`))
  console.log(chalk.gray(`时间: ${new Date(report.timestamp).toLocaleString()}`))
  console.log(chalk.gray('━'.repeat(60)))

  // 总体状态
  const statusIcon = report.overall === 'healthy' ? chalk.green('✅') :
                     report.overall === 'warning' ? chalk.yellow('⚠️') :
                     chalk.red('❌')

  const statusText = report.overall === 'healthy' ? '系统健康' :
                    report.overall === 'warning' ? '需要关注' :
                    '存在问题'

  console.log(`\n${statusIcon} 总体状态: ${statusText}`)

  // 统计信息
  console.log(chalk.bold('\n📊 检查统计:'))
  console.log(`  总计: ${report.summary.total} 项检查`)
  console.log(`  ${chalk.green('✅ 正常:')} ${report.summary.healthy}`)
  console.log(`  ${chalk.yellow('⚠️ 警告:')} ${report.summary.warnings}`)
  console.log(`  ${chalk.red('❌ 错误:')} ${report.summary.errors}`)

  // 详细结果
  if (verbose || report.overall !== 'healthy') {
    console.log(chalk.bold('\n📋 详细结果:'))

    // 按类别分组
    const byCategory = new Map<string, HealthResult[]>()
    for (const result of report.results) {
      if (!byCategory.has(result.category)) {
        byCategory.set(result.category, [])
      }
      byCategory.get(result.category)!.push(result)
    }

    for (const [category, categoryResults] of byCategory) {
      console.log(chalk.bold(`\n${category}:`))

      for (const result of categoryResults) {
        const icon = result.status === 'healthy' ? chalk.green('  ✅') :
                    result.status === 'warning' ? chalk.yellow('  ⚠️') :
                    chalk.red('  ❌')

        console.log(`${icon} ${result.message}`)

        if (verbose && result.details) {
          console.log(chalk.gray(`     ${result.details}`))
        }

        if (result.fixAvailable && result.fixCommand) {
          console.log(chalk.cyan(`     💡 修复: ${result.fixCommand}`))
        }
      }
    }
  }

  // 总结建议
  if (report.summary.errors > 0) {
    console.log(chalk.red.bold(`\n❌ 发现 ${report.summary.errors} 个错误需要立即修复`))
    console.log(chalk.gray('运行 xorigo doctor --fix 尝试自动修复'))
  } else if (report.summary.warnings > 0) {
    console.log(chalk.yellow.bold(`\n⚠️  发现 ${report.summary.warnings} 个警告建议修复`))
    console.log(chalk.gray('运行 xorigo doctor --verbose 查看详细信息'))
  } else {
    console.log(chalk.green.bold('\n✅ 系统状态良好，所有检查都通过了！'))
  }
}

/**
 * 保存健康报告到文件
 */
async function saveHealthReport(report: HealthReport, reportPath: string): Promise<void> {
  try {
    const reportContent = JSON.stringify(report, null, 2)
    await fs.writeFile(reportPath, reportContent, 'utf-8')
    console.log(chalk.green(`\n📄 报告已保存到: ${reportPath}`))
  } catch (error) {
    console.error(chalk.red(`\n❌ 无法保存报告: ${error}`))
  }
}