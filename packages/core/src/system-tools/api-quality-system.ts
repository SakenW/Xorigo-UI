/**
 * Xorigo UI API 质量保证系统 - 统一导出
 *
 * 这是API一致性验证系统的主入口点，提供所有核心功能的统一访问
 */

// ============================================================================
// 核心模块导出
// ============================================================================

// API规范和标准
export * from './api-standards'

// API验证器
export * from './api-validator'

// 组件扫描器
export * from './component-scanner'

// 回归测试框架
export * from './regression-test-framework'

// 质量监控器
export * from './quality-monitor'

// IDE集成服务
export * from './ide-integration'

// ============================================================================
// 统一API入口
// ============================================================================

import { ComponentScanner, type ComponentAnalysis } from './component-scanner'
import { APIValidator, apiValidator, type ValidationResult } from './api-validator'
import { RegressionTestFramework, type TestResult } from './regression-test-framework'
import { QualityMonitor, type ComponentQualityReport, type ProjectQualityReport } from './quality-monitor'
import { IDEIntegrationService, type IDEDiagnostic, type IDECompletionItem } from './ide-integration'

/**
 * Xorigo UI API质量保证系统
 *
 * 提供完整的API一致性验证、质量监控和开发工具集成
 */
export class XorigoUIQualitySystem {
  private componentScanner: ComponentScanner
  private apiValidator: APIValidator
  private testFramework: RegressionTestFramework
  private qualityMonitor: QualityMonitor
  private ideService: IDEIntegrationService

  constructor() {
    this.componentScanner = new ComponentScanner({ deepAnalysis: true })
    this.apiValidator = apiValidator
    this.testFramework = new RegressionTestFramework({
      includePerformanceTests: true,
      captureScreenshots: true,
      concurrency: 4,
    })
    this.qualityMonitor = new QualityMonitor()
    this.ideService = new IDEIntegrationService({
      enableRealTimeValidation: true,
      enableCodeCompletion: true,
      enableQuickFixes: true,
      enableHover: true,
      validationDelay: 500,
    })
  }

  // ============================================================================
  // 快速验证方法
  // ============================================================================

  /**
   * 快速验证整个项目
   */
  async validateProject(projectRoot?: string): Promise<ProjectValidationResult> {
    console.log('🚀 开始验证Xorigo UI项目质量...')

    const startTime = Date.now()
    const root = projectRoot || process.cwd()

    try {
      // 1. 扫描所有组件
      console.log('📦 扫描项目组件...')
      const components = await this.componentScanner.scanComponents()
      console.log(`✅ 发现 ${components.length} 个组件`)

      if (components.length === 0) {
        return {
          success: true,
          message: '未发现任何组件',
          summary: {
            totalComponents: 0,
            passedComponents: 0,
            failedComponents: 0,
            totalErrors: 0,
            totalWarnings: 0,
            passRate: 100,
            duration: Date.now() - startTime,
          },
          componentReports: [],
          projectReport: null,
        }
      }

      // 2. 执行API验证
      console.log('🔬 执行API一致性验证...')
      const validationResults = this.apiValidator.validateComponents(components)

      // 3. 生成质量报告
      console.log('📊 生成质量报告...')
      const componentReports: ComponentQualityReport[] = []

      for (const component of components) {
        const validationResult = validationResults.find(r => r.component === component.name)?.result
        if (validationResult) {
          const qualityReport = this.qualityMonitor.analyzeComponentQuality(
            component.name,
            component,
            validationResult
          )
          componentReports.push(qualityReport)
        }
      }

      // 4. 生成项目质量报告
      const projectReport = this.qualityMonitor.generateProjectQualityReport(
        'Xorigo UI',
        componentReports
      )

      // 5. 统计结果
      const passedComponents = validationResults.filter(r => r.result.passed)
      const failedComponents = validationResults.filter(r => !r.result.passed)
      const totalErrors = validationResults.reduce((sum, r) => sum + r.result.errors.length, 0)
      const totalWarnings = validationResults.reduce((sum, r) => sum + r.result.warnings.length, 0)
      const duration = Date.now() - startTime

      const summary = {
        totalComponents: components.length,
        passedComponents: passedComponents.length,
        failedComponents: failedComponents.length,
        totalErrors,
        totalWarnings,
        passRate: components.length > 0 ? (passedComponents.length / components.length) * 100 : 100,
        duration,
      }

      console.log(`\n📈 验证完成！`)
      console.log(`   总组件数: ${summary.totalComponents}`)
      console.log(`   通过验证: ${summary.passedComponents}`)
      console.log(`   验证失败: ${summary.failedComponents}`)
      console.log(`   错误总数: ${summary.totalErrors}`)
      console.log(`   警告总数: ${summary.totalWarnings}`)
      console.log(`   通过率: ${summary.passRate.toFixed(1)}%`)
      console.log(`   耗时: ${(duration / 1000).toFixed(2)}s`)

      return {
        success: failedComponents.length === 0,
        message: failedComponents.length === 0
          ? '项目验证通过'
          : `发现 ${failedComponents.length} 个组件验证失败`,
        summary,
        componentReports,
        projectReport,
        validationResults,
      }

    } catch (error) {
      return {
        success: false,
        message: `验证失败: ${error instanceof Error ? error.message : String(error)}`,
        summary: {
          totalComponents: 0,
          passedComponents: 0,
          failedComponents: 0,
          totalErrors: 1,
          totalWarnings: 0,
          passRate: 0,
          duration: Date.now() - startTime,
        },
        componentReports: [],
        projectReport: null,
      }
    }
  }

  /**
   * 验证单个组件
   */
  async validateComponent(componentPath: string): Promise<ComponentValidationResult> {
    try {
      console.log(`🔍 验证组件: ${componentPath}`)

      // 1. 分析组件
      const analysis = await this.componentScanner.analyzeComponent(componentPath)

      // 2. API验证
      const validationResult = this.apiValidator.validateComponent(analysis)

      // 3. 质量分析
      const qualityReport = this.qualityMonitor.analyzeComponentQuality(
        analysis.name,
        analysis,
        validationResult
      )

      return {
        success: validationResult.passed,
        component: analysis.name,
        analysis,
        validationResult,
        qualityReport,
        message: validationResult.passed
          ? '组件验证通过'
          : `发现 ${validationResult.errors.length} 个错误`,
      }

    } catch (error) {
      return {
        success: false,
        component: 'unknown',
        message: `组件验证失败: ${error instanceof Error ? error.message : String(error)}`,
      }
    }
  }

  /**
   * 运行回归测试
   */
  async runRegressionTests(componentPaths?: string[]): Promise<RegressionTestResult> {
    console.log('🧪 开始运行回归测试...')

    const startTime = Date.now()

    try {
      let components: ComponentAnalysis[] = []

      if (componentPaths && componentPaths.length > 0) {
        // 验证指定组件
        for (const path of componentPaths) {
          const analysis = await this.componentScanner.analyzeComponent(path)
          components.push(analysis)
        }
      } else {
        // 验证所有组件
        components = await this.componentScanner.scanComponents()
      }

      if (components.length === 0) {
        return {
          success: true,
          message: '没有找到需要测试的组件',
          summary: {
            totalTests: 0,
            passedTests: 0,
            failedTests: 0,
            skippedTests: 0,
            passRate: 100,
            duration: Date.now() - startTime,
          },
          testResults: [],
        }
      }

      // 生成并运行测试
      const testSuites = components.map(component => {
        const testCases = this.testFramework.generateTestCases(component)
        return {
          name: `${component.name} Test Suite`,
          description: `${component.name} 组件的回归测试`,
          testCases,
          parallel: true,
        }
      })

      testSuites.forEach(suite => this.testFramework.registerTestSuite(suite))

      console.log(`🎯 准备运行 ${components.length} 个组件的测试...`)

      // 执行测试
      const results = await this.testFramework.runAllTests()
      const duration = Date.now() - startTime

      // 统计结果
      const passedTests = results.filter(r => r.status === 'passed')
      const failedTests = results.filter(r => r.status === 'failed')
      const skippedTests = results.filter(r => r.status === 'skipped')

      const summary = {
        totalTests: results.length,
        passedTests: passedTests.length,
        failedTests: failedTests.length,
        skippedTests: skippedTests.length,
        passRate: results.length > 0 ? (passedTests.length / results.length) * 100 : 100,
        duration,
      }

      console.log(`\n📊 测试完成！`)
      console.log(`   总测试数: ${summary.totalTests}`)
      console.log(`   通过测试: ${summary.passedTests}`)
      console.log(`   失败测试: ${summary.failedTests}`)
      console.log(`   跳过测试: ${summary.skippedTests}`)
      console.log(`   通过率: ${summary.passRate.toFixed(1)}%`)
      console.log(`   耗时: ${(duration / 1000).toFixed(2)}s`)

      return {
        success: failedTests.length === 0,
        message: failedTests.length === 0
          ? '所有回归测试通过'
          : `${failedTests.length} 个测试失败`,
        summary,
        testResults: results,
        testReport: this.testFramework.generateReport(),
      }

    } catch (error) {
      return {
        success: false,
        message: `回归测试失败: ${error instanceof Error ? error.message : String(error)}`,
        summary: {
          totalTests: 0,
          passedTests: 0,
          failedTests: 0,
          skippedTests: 0,
          passRate: 0,
          duration: Date.now() - startTime,
        },
        testResults: [],
      }
    }
  }

  // ============================================================================
  // IDE集成方法
  // ============================================================================

  /**
   * 为IDE提供诊断信息
   */
  async getIDEFileDiagnostics(uri: string, content: string): Promise<IDEDiagnostic[]> {
    return this.ideService.analyzeFile(uri, content)
  }

  /**
   * 为IDE提供代码完成
   */
  async getIDECodeCompletions(
    uri: string,
    content: string,
    position: { line: number; character: number }
  ): Promise<IDECompletionItem[]> {
    return this.ideService.provideCompletions(uri, content, position)
  }

  /**
   * 为IDE提供悬停信息
   */
  async getIDEHoverInfo(
    uri: string,
    content: string,
    position: { line: number; character: number }
  ) {
    return this.ideService.provideHover(uri, content, position)
  }

  // ============================================================================
  // 报告生成方法
  // ============================================================================

  /**
   * 生成质量报告
   */
  async generateQualityReport(projectRoot?: string): Promise<QualityReportResult> {
    const validation = await this.validateProject(projectRoot)

    return {
      validation,
      generatedAt: new Date(),
      reportPath: `xorigo-ui-quality-report-${Date.now()}.json`,
    }
  }

  /**
   * 生成API规范文档
   */
  generateAPIDocumentation(components: ComponentAnalysis[]): APIDocumentationResult {
    const documentation = {
      title: 'Xorigo UI API 规范文档',
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      components: components.map(component => ({
        name: component.name,
        category: component.category,
        description: `${component.name} 组件的API规范`,
        props: Object.entries(component.props).map(([name, prop]) => ({
          name,
          type: prop.type,
          required: prop.required,
          description: prop.description,
          defaultValue: prop.defaultValue,
        })),
        examples: [], // 可以从示例文件中提取
        accessibility: {
          isInteractive: component.isInteractive,
          supportsKeyboardNavigation: component.supportsKeyboardNavigation,
        },
        theming: {
          isThemed: component.isThemed,
          usesThemeTokens: component.usesThemeTokens,
          supportsSevenAxis: component.supportsSevenAxis,
        },
        testing: {
          hasTests: component.hasTests,
          testCoverage: component.testCoverage,
        },
      })),
    }

    return {
      documentation,
      generatedAt: new Date(),
      format: 'json',
    }
  }
}

// ============================================================================
// 结果接口定义
// ============================================================================

/**
 * 项目验证结果
 */
export interface ProjectValidationResult {
  /** 是否成功 */
  success: boolean
  /** 结果消息 */
  message: string
  /** 验证摘要 */
  summary: ValidationSummary
  /** 组件质量报告 */
  componentReports: ComponentQualityReport[]
  /** 项目质量报告 */
  projectReport: ProjectQualityReport | null
  /** 验证结果详情 */
  validationResults?: { component: string; result: ValidationResult }[]
}

/**
 * 组件验证结果
 */
export interface ComponentValidationResult {
  /** 是否成功 */
  success: boolean
  /** 组件名称 */
  component: string
  /** 结果消息 */
  message: string
  /** 组件分析 */
  analysis?: ComponentAnalysis
  /** 验证结果 */
  validationResult?: ValidationResult
  /** 质量报告 */
  qualityReport?: ComponentQualityReport
}

/**
 * 回归测试结果
 */
export interface RegressionTestResult {
  /** 是否成功 */
  success: boolean
  /** 结果消息 */
  message: string
  /** 测试摘要 */
  summary: TestSummary
  /** 测试结果 */
  testResults: TestResult[]
  /** 测试报告 */
  testReport?: any
}

/**
 * 质量报告结果
 */
export interface QualityReportResult {
  /** 验证结果 */
  validation: ProjectValidationResult
  /** 生成时间 */
  generatedAt: Date
  /** 报告路径 */
  reportPath: string
}

/**
 * API文档结果
 */
export interface APIDocumentationResult {
  /** 文档内容 */
  documentation: any
  /** 生成时间 */
  generatedAt: Date
  /** 文档格式 */
  format: string
}

/**
 * 验证摘要
 */
export interface ValidationSummary {
  /** 总组件数 */
  totalComponents: number
  /** 通过组件数 */
  passedComponents: number
  /** 失败组件数 */
  failedComponents: number
  /** 错误总数 */
  totalErrors: number
  /** 警告总数 */
  totalWarnings: number
  /** 通过率 */
  passRate: number
  /** 耗时（毫秒） */
  duration: number
}

/**
 * 测试摘要
 */
export interface TestSummary {
  /** 总测试数 */
  totalTests: number
  /** 通过测试数 */
  passedTests: number
  /** 失败测试数 */
  failedTests: number
  /** 跳过测试数 */
  skippedTests: number
  /** 通过率 */
  passRate: number
  /** 耗时（毫秒） */
  duration: number
}

// ============================================================================
// 全局实例和快捷函数
// ============================================================================

/**
 * 全局质量系统实例
 */
export const xorigoUIQualitySystem = new XorigoUIQualitySystem()

/**
 * 快速验证整个项目
 */
export async function validateXorigoUIProject(projectRoot?: string): Promise<ProjectValidationResult> {
  return xorigoUIQualitySystem.validateProject(projectRoot)
}

/**
 * 快速验证组件
 */
export async function validateXorigoUIComponent(componentPath: string): Promise<ComponentValidationResult> {
  return xorigoUIQualitySystem.validateComponent(componentPath)
}

/**
 * 快速运行回归测试
 */
export async function runXorigoUITests(componentPaths?: string[]): Promise<RegressionTestResult> {
  return xorigoUIQualitySystem.runRegressionTests(componentPaths)
}

/**
 * 生成质量报告
 */
export async function generateXorigoUIQualityReport(projectRoot?: string): Promise<QualityReportResult> {
  return xorigoUIQualitySystem.generateQualityReport(projectRoot)
}

// ============================================================================
// 默认导出
// ============================================================================

export default XorigoUIQualitySystem