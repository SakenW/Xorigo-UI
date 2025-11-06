/**
 * @fileoverview 质量门禁检查脚本
 * @description 在代码合并前进行全面的质量检查，确保所有质量标准都达标
 */

import { execSync } from 'child_process'
import { writeFileSync, existsSync } from 'fs'
import { join } from 'path'

// 类型定义
interface QualityGateConfig {
  enforceCoverage: boolean
  coverageThreshold: {
    branches: number
    functions: number
    lines: number
    statements: number
  }
  enforceTypeScript: boolean
  enforceESLint: boolean
  enforceTests: boolean
  enforceBuild: boolean
  enforceBundleSize: boolean
  maxBundleSize: number // KB
  enablePerformanceCheck: boolean
  maxBuildTime: number // seconds
  failOnWarnings: boolean
}

interface QualityGateResult {
  passed: boolean
  checks: {
    name: string
    passed: boolean
    details?: string
    metrics?: Record<string, any>
  }[]
  summary: {
    total: number
    passed: number
    failed: number
  }
}

class QualityGate {
  private config: QualityGateConfig
  private results: QualityGateResult

  constructor(config: Partial<QualityGateConfig> = {}) {
    this.config = {
      enforceCoverage: true,
      coverageThreshold: {
        branches: 90,
        functions: 90,
        lines: 90,
        statements: 90,
      },
      enforceTypeScript: true,
      enforceESLint: true,
      enforceTests: true,
      enforceBuild: true,
      enforceBundleSize: true,
      maxBundleSize: 500, // KB
      enablePerformanceCheck: true,
      maxBuildTime: 60, // seconds
      failOnWarnings: false,
      ...config,
    }

    this.results = {
      passed: true,
      checks: [],
      summary: { total: 0, passed: 0, failed: 0 },
    }
  }

  /**
   * 执行所有质量检查
   */
  async runAllChecks(): Promise<QualityGateResult> {
    console.log('🔍 开始质量门禁检查...\n')

    this.results = {
      passed: true,
      checks: [],
      summary: { total: 0, passed: 0, failed: 0 },
    }

    try {
      // 1. TypeScript类型检查
      if (this.config.enforceTypeScript) {
        await this.checkTypeScript()
      }

      // 2. ESLint代码规范检查
      if (this.config.enforceESLint) {
        await this.checkESLint()
      }

      // 3. 测试覆盖率检查
      if (this.config.enforceCoverage) {
        await this.checkTestCoverage()
      }

      // 4. 测试通过检查
      if (this.config.enforceTests) {
        await this.checkTests()
      }

      // 5. 构建检查
      if (this.config.enforceBuild) {
        await this.checkBuild()
      }

      // 6. Bundle大小检查
      if (this.config.enforceBundleSize) {
        await this.checkBundleSize()
      }

      // 7. 性能检查
      if (this.config.enablePerformanceCheck) {
        await this.checkPerformance()
      }

      // 8. 安全检查
      await this.checkSecurity()

      // 计算总体结果
      const failed = this.results.checks.filter(c => !c.passed).length
      this.results.summary = {
        total: this.results.checks.length,
        passed: this.results.checks.length - failed,
        failed,
      }
      this.results.passed = failed === 0

      // 打印结果
      this.printResults()

      // 生成报告
      this.generateReport()

      return this.results

    } catch (error) {
      console.error('\n❌ 质量检查过程中发生错误:', error)
      this.results.passed = false
      return this.results
    }
  }

  /**
   * TypeScript类型检查
   */
  private async checkTypeScript(): Promise<void> {
    console.log('📝 检查TypeScript类型...')

    const startTime = Date.now()
    try {
      execSync('pnpm --filter @xorigo-ui/core type-check', {
        stdio: 'pipe',
        encoding: 'utf-8',
      })

      const duration = Date.now() - startTime
      this.addCheckResult('TypeScript类型检查', true, `检查通过 (${(duration / 1000).toFixed(2)}s)`)

    } catch (error) {
      const output = error instanceof Error ? error.message : String(error)
      this.addCheckResult(
        'TypeScript类型检查',
        false,
        'TypeScript类型检查失败',
        { error: output }
      )
    }
  }

  /**
   * ESLint代码规范检查
   */
  private async checkESLint(): Promise<void> {
    console.log('📏 检查ESLint代码规范...')

    try {
      const output = execSync('pnpm --filter @xorigo-ui/core lint', {
        stdio: 'pipe',
        encoding: 'utf-8',
      })

      this.addCheckResult('ESLint代码规范', true, '代码规范检查通过')

    } catch (error) {
      const output = error instanceof Error ? error.message : String(error)

      // 检查是否是警告级别
      if (this.config.failOnWarnings && output.includes('warnings')) {
        this.addCheckResult(
          'ESLint代码规范',
          false,
          '代码规范检查失败 (警告级别)',
          { error: output }
        )
      } else {
        this.addCheckResult(
          'ESLint代码规范',
          false,
          '代码规范检查失败',
          { error: output }
        )
      }
    }
  }

  /**
   * 测试覆盖率检查
   */
  private async checkTestCoverage(): Promise<void> {
    console.log('📊 检查测试覆盖率...')

    try {
      const output = execSync('pnpm --filter @xorigo-ui/core test:coverage', {
        stdio: 'pipe',
        encoding: 'utf-8',
      })

      // 解析覆盖率报告
      const coverage = this.parseCoverageReport(output)

      const checks = [
        { name: '分支覆盖率', value: coverage.branches, threshold: this.config.coverageThreshold.branches },
        { name: '函数覆盖率', value: coverage.functions, threshold: this.config.coverageThreshold.functions },
        { name: '行覆盖率', value: coverage.lines, threshold: this.config.coverageThreshold.lines },
        { name: 语句覆盖率: coverage.statements, threshold: this.config.coverageThreshold.statements },
      ] as const

      const allPassed = checks.every(c => c.value >= c.threshold)

      if (allPassed) {
        const details = checks.map(c => `${c.name}: ${c.value}% (要求: ${c.threshold}%)`).join(', ')
        this.addCheckResult('测试覆盖率', true, `覆盖率达标 (${details})`, coverage)
      } else {
        const failed = checks.filter(c => c.value < c.threshold)
        const details = failed.map(c => `${c.name}: ${c.value}% (要求: ${c.threshold}%)`).join(', ')
        this.addCheckResult('测试覆盖率', false, `覆盖率不达标 (${details})`, coverage)
      }

    } catch (error) {
      this.addCheckResult('测试覆盖率', false, '无法生成覆盖率报告')
    }
  }

  /**
   * 解析覆盖率报告
   */
  private parseCoverageReport(output: string): Record<string, number> {
    // 简化实现 - 实际应解析lcov或clover格式的报告
    const lines = output.split('\n')
    const coverage: Record<string, number> = {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    }

    for (const line of lines) {
      if (line.includes('All files') || line.includes('|')) {
        const parts = line.trim().split(/\s+/)
        if (parts.length > 4) {
          coverage.branches = parseFloat(parts[1]) || 0
          coverage.functions = parseFloat(parts[2]) || 0
          coverage.lines = parseFloat(parts[3]) || 0
          coverage.statements = parseFloat(parts[4]) || 0
        }
      }
    }

    return coverage
  }

  /**
   * 测试通过检查
   */
  private async checkTests(): Promise<void> {
    console.log('🧪 检查测试通过情况...')

    const startTime = Date.now()

    const tests = [
      { name: '单元测试', cmd: 'pnpm --filter @xorigo-ui/core test:run' },
      { name: '集成测试', cmd: 'pnpm test:integration' },
      { name: 'E2E测试', cmd: 'pnpm test:e2e' },
    ]

    for (const test of tests) {
      try {
        execSync(test.cmd, { stdio: 'pipe', encoding: 'utf-8' })
      } catch (error) {
        this.addCheckResult(test.name, false, `${test.name}失败`)
        return
      }
    }

    const duration = Date.now() - startTime
    this.addCheckResult('测试通过检查', true, `所有测试通过 (${(duration / 1000).toFixed(2)}s)`)
  }

  /**
   * 构建检查
   */
  private async checkBuild(): Promise<void> {
    console.log('🔨 检查构建结果...')

    const startTime = Date.now()

    try {
      execSync('pnpm --filter @xorigo-ui/core build', {
        stdio: 'pipe',
        encoding: 'utf-8',
      })

      const duration = Date.now() - startTime

      if (duration / 1000 > this.config.maxBuildTime) {
        this.addCheckResult(
          '构建检查',
          false,
          `构建时间超标 (${(duration / 1000).toFixed(2)}s > ${this.config.maxBuildTime}s)`
        )
      } else {
        this.addCheckResult('构建检查', true, `构建成功 (${(duration / 1000).toFixed(2)}s)`)
      }

    } catch (error) {
      this.addCheckResult('构建检查', false, '构建失败')
    }
  }

  /**
   * Bundle大小检查
   */
  private async checkBundleSize(): Promise<void> {
    console.log('📦 检查Bundle大小...')

    const distPath = 'packages/core/dist'
    if (!existsSync(distPath)) {
      this.addCheckResult('Bundle大小检查', false, '未找到构建产物')
      return
    }

    try {
      const output = execSync(`du -sh ${distPath}`, {
        stdio: 'pipe',
        encoding: 'utf-0',
      }).toString()

      // 解析大小 (简化实现)
      const sizeInKB = this.parseSize(output)

      if (sizeInKB > this.config.maxBundleSize) {
        this.addCheckResult(
          'Bundle大小检查',
          false,
          `Bundle大小超标 (${sizeInKB}KB > ${this.config.maxBundleSize}KB)`
        )
      } else {
        this.addCheckResult('Bundle大小检查', true, `Bundle大小正常 (${sizeInKB}KB)`)
      }

    } catch (error) {
      this.addCheckResult('Bundle大小检查', false, '无法计算Bundle大小')
    }
  }

  /**
   * 解析大小
   */
  private parseSize(output: string): number {
    // 简化实现 - 实际应更精确
    const match = output.match(/(\d+(?:\.\d+)?)\s*([KMGT]?B)/)
    if (!match) return 0

    let size = parseFloat(match[1])
    const unit = match[2].toUpperCase()

    const multipliers: Record<string, number> = {
      B: 1,
      KB: 1024,
      MB: 1024 * 1024,
      GB: 1024 * 1024 * 1024,
      TB: 1024 * 1024 * 1024 * 1024,
    }

    return Math.floor(size * (multipliers[unit] / 1024))
  }

  /**
   * 性能检查
   */
  private async checkPerformance(): Promise<void> {
    console.log('⚡ 检查性能指标...')

    const checks: { name: string; passed: boolean; details?: string }[] = []

    // 1. 检查内存使用
    try {
      const memUsage = process.memoryUsage()
      const heapUsedMB = memUsage.heapUsed / 1024 / 1024

      if (heapUsedMB > 500) {
        checks.push({
          name: '内存使用',
          passed: false,
          details: `内存使用过高 (${heapUsedMB.toFixed(2)}MB)`,
        })
      } else {
        checks.push({
          name: '内存使用',
          passed: true,
          details: `内存使用正常 (${heapUsedMB.toFixed(2)}MB)`,
        })
      }
    } catch {
      checks.push({ name: '内存使用', passed: false, details: '无法检查内存' })
    }

    // 2. 检查循环依赖
    try {
      execSync('madge --circular packages/core/src', { stdio: 'pipe' })
      checks.push({ name: '循环依赖检查', passed: true, details: '无循环依赖' })
    } catch {
      checks.push({ name: '循环依赖检查', passed: false, details: '发现循环依赖' })
    }

    const allPassed = checks.every(c => c.passed)
    if (allPassed) {
      this.addCheckResult('性能检查', true, '所有性能指标正常', {
        checks: checks.map(c => ({ name: c.name, details: c.details })),
      })
    } else {
      const failed = checks.filter(c => !c.passed).map(c => c.name).join(', ')
      this.addCheckResult('性能检查', false, `性能问题: ${failed}`, {
        checks: checks.map(c => ({ name: c.name, details: c.details })),
      })
    }
  }

  /**
   * 安全检查
   */
  private async checkSecurity(): Promise<void> {
    console.log('🔒 检查安全漏洞...')

    try {
      const output = execSync('pnpm audit --audit-level=high', {
        stdio: 'pipe',
        encoding: 'utf-0',
      })

      this.addCheckResult('安全检查', true, '未发现高危漏洞')

    } catch (error) {
      // npm audit 在发现问题时会返回非零退出码
      this.addCheckResult('安全检查', false, '发现安全漏洞，请运行 pnpm audit fix')
    }
  }

  /**
   * 添加检查结果
   */
  private addCheckResult(
    name: string,
    passed: boolean,
    details?: string,
    metrics?: Record<string, any>
  ): void {
    this.results.checks.push({ name, passed, details, metrics })
  }

  /**
   * 打印检查结果
   */
  private printResults(): void {
    console.log('\n' + '='.repeat(60))
    console.log('📊 质量门禁检查结果')
    console.log('='.repeat(60))

    for (const check of this.results.checks) {
      const status = check.passed ? '✅' : '❌'
      console.log(`${status} ${check.name}`)
      if (check.details) {
        console.log(`   ${check.details}`)
      }
      if (check.metrics) {
        console.log(`   指标: ${JSON.stringify(check.metrics, null, 2)}`)
      }
    }

    console.log('='.repeat(60))
    console.log(
      `总计: ${this.results.summary.total} | ` +
      `通过: ${this.results.summary.passed} | ` +
      `失败: ${this.results.summary.failed}`
    )
    console.log('='.repeat(60))

    if (this.results.passed) {
      console.log('\n✅ 所有质量检查通过！\n')
    } else {
      console.log('\n❌ 有质量检查未通过！\n')
      console.log('请修复以下问题后重新提交:')
      this.results.checks
        .filter(c => !c.passed)
        .forEach(c => {
          console.log(`  - ${c.name}: ${c.details}`)
        })
      console.log()
    }
  }

  /**
   * 生成检查报告
   */
  private generateReport(): void {
    const report = {
      timestamp: new Date().toISOString(),
      passed: this.results.passed,
      summary: this.results.summary,
      checks: this.results.checks,
      config: this.config,
    }

    const reportPath = 'quality-gate-report.json'
    writeFileSync(reportPath, JSON.stringify(report, null, 2))

    console.log(`📝 报告已保存: ${reportPath}`)
  }

  /**
   * 严格模式 (所有检查都必需通过)
   */
  async runStrictMode(): Promise<void> {
    this.config.failOnWarnings = true
    this.config.coverageThreshold.branches = 95
    this.config.coverageThreshold.functions = 95
    this.config.coverageThreshold.lines = 95
    this.config.coverageThreshold.statements = 95
    this.config.maxBundleSize = 450

    await this.runAllChecks()
  }

  /**
   * 宽松模式 (允许部分检查失败)
   */
  async runLenientMode(): Promise<void> {
    this.config.enforceCoverage = false
    this.config.enforceBundleSize = false
    this.config.enablePerformanceCheck = false

    await this.runAllChecks()
  }
}

// CLI入口点
async function main() {
  const args = process.argv.slice(2)
  let mode: 'strict' | 'normal' | 'lenient' = 'normal'

  // 解析命令行参数
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    switch (arg) {
      case '--strict':
        mode = 'strict'
        break
      case '--lenient':
        mode = 'lenient'
        break
      case '--help':
        printHelp()
        process.exit(0)
    }
  }

  const qualityGate = new QualityGate()

  switch (mode) {
    case 'strict':
      console.log('🔴 严格模式 - 所有检查都必需通过\n')
      await qualityGate.runStrictMode()
      break
    case 'lenient':
      console.log('🟡 宽松模式 - 跳过部分检查\n')
      await qualityGate.runLenientMode()
      break
    default:
      console.log('🟢 正常模式 - 标准质量检查\n')
      await qualityGate.runAllChecks()
  }

  // 退出码
  const result = await qualityGate.runAllChecks()
  process.exit(result.passed ? 0 : 1)
}

function printHelp(): void {
  console.log(`
Xorigo UI 质量门禁检查脚本

用法:
  pnpm quality:gate [选项]

选项:
  --strict    严格模式 (更高的质量要求)
  --lenient   宽松模式 (跳过部分检查)
  --help      显示帮助信息

检查项目:
  ✓ TypeScript类型检查
  ✓ ESLint代码规范检查
  ✓ 测试覆盖率检查
  ✓ 测试通过检查
  ✓ 构建检查
  ✓ Bundle大小检查
  ✓ 性能检查
  ✓ 安全检查

示例:
  pnpm quality:gate
  pnpm quality:gate --strict
  pnpm quality:gate --lenient
`)
}

// 运行
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error(error)
    process.exit(1)
  })
}

export { QualityGate, QualityGateResult, QualityGateConfig }
