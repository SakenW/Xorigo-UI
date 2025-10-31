/**
 * Xorigo UI API 质量保证系统使用示例
 *
 * 展示如何使用API质量保证系统的各种功能
 */

import {
  XorigoUIQualitySystem,
  validateXorigoUIProject,
  validateXorigoUIComponent,
  runXorigoUITests,
  generateXorigoUIQualityReport,
  ComponentScanner,
  APIValidator,
  QualityMonitor,
  IDEIntegrationService,
  createRegressionTestFramework,
  type ComponentAnalysis,
  type ValidationResult,
  type ComponentQualityReport,
} from '../api-quality-system'

// ============================================================================
// 基础使用示例
// ============================================================================

/**
 * 示例1: 验证整个项目
 */
export async function example1_ValidateProject() {
  console.log('=== 示例1: 验证整个项目 ===')

  // 使用全局函数
  const result = await validateXorigoUIProject('./my-xorigo-project')

  if (result.success) {
    console.log('✅ 项目验证通过!')
    console.log(`📊 通过率: ${result.summary.passRate.toFixed(1)}%`)
    console.log(`⏱️  耗时: ${result.summary.duration}ms`)
  } else {
    console.log('❌ 项目验证失败!')
    console.log(`🔴 错误组件: ${result.summary.failedComponents}`)
    console.log(`📝 错误信息: ${result.message}`)
  }

  // 也可以使用类实例
  const qualitySystem = new XorigoUIQualitySystem()
  const result2 = await qualitySystem.validateProject()
  console.log('项目验证结果:', result2.summary)
}

/**
 * 示例2: 验证单个组件
 */
export async function example2_ValidateComponent() {
  console.log('\n=== 示例2: 验证单个组件 ===')

  const componentPath = './packages/core/src/components/Button/Button.tsx'

  // 使用全局函数
  const result = await validateXorigoUIComponent(componentPath)

  if (result.success) {
    console.log(`✅ 组件 ${result.component} 验证通过!`)
    if (result.qualityReport) {
      console.log(`📊 质量等级: ${result.qualityReport.grade}`)
      console.log(`🎯 总体得分: ${result.qualityReport.metrics.overallScore}`)
    }
  } else {
    console.log(`❌ 组件验证失败: ${result.message}`)
    if (result.validationResult) {
      console.log('错误详情:')
      result.validationResult.errors.forEach(error => {
        console.log(`  - ${error.message} (${error.code})`)
      })
    }
  }
}

/**
 * 示例3: 运行回归测试
 */
export async function example3_RunRegressionTests() {
  console.log('\n=== 示例3: 运行回归测试 ===')

  // 测试所有组件
  const allTestsResult = await runXorigoUITests()

  console.log(`📊 测试摘要:`)
  console.log(`   总测试数: ${allTestsResult.summary.totalTests}`)
  console.log(`   通过测试: ${allTestsResult.summary.passedTests}`)
  console.log(`   失败测试: ${allTestsResult.summary.failedTests}`)
  console.log(`   通过率: ${allTestsResult.summary.passRate.toFixed(1)}%`)

  // 测试指定组件
  const specificTestsResult = await runXorigoUITests([
    './packages/core/src/components/Button/Button.tsx',
    './packages/core/src/components/Input/Input.tsx',
  ])

  console.log(`\n🎯 指定组件测试结果:`)
  console.log(`   通过率: ${specificTestsResult.summary.passRate.toFixed(1)}%`)
}

// ============================================================================
// 高级使用示例
// ============================================================================

/**
 * 示例4: 自定义组件扫描
 */
export async function example4_CustomComponentScanning() {
  console.log('\n=== 示例4: 自定义组件扫描 ===')

  // 创建自定义配置的扫描器
  const scanner = new ComponentScanner({
    rootDir: './packages',
    componentPattern: ['**/*.tsx', '**/*.ts'],
    excludeDirs: ['node_modules', 'dist', 'archived'],
    deepAnalysis: true,
  })

  // 扫描组件
  const components = await scanner.scanComponents()

  console.log(`📦 发现 ${components.length} 个组件:`)

  // 按分类统计
  const categories = new Map<string, number>()
  components.forEach(component => {
    const category = component.category || 'unknown'
    categories.set(category, (categories.get(category) || 0) + 1)
  })

  categories.forEach((count, category) => {
    console.log(`   ${category}: ${count} 个组件`)
  })

  // 分析特定组件
  const buttonComponent = components.find(c => c.name === 'Button')
  if (buttonComponent) {
    console.log(`\n🔍 Button 组件分析:`)
    console.log(`   Props数量: ${Object.keys(buttonComponent.props).length}`)
    console.log(`   是否可交互: ${buttonComponent.isInteractive}`)
    console.log(`   是否支持主题: ${buttonComponent.isThemed}`)
    console.log(`   是否有测试: ${buttonComponent.hasTests}`)
    console.log(`   测试覆盖率: ${buttonComponent.testCoverage || 0}%`)
  }
}

/**
 * 示例5: 自定义API验证
 */
export async function example5_CustomAPIValidation() {
  console.log('\n=== 示例5: 自定义API验证 ===')

  // 创建自定义验证器
  const validator = new APIValidator()

  // 添加自定义验证规则
  validator.addRule({
    name: 'custom-prop-naming',
    description: '检查Props命名是否符合项目规范',
    level: 'warning',
    validate: (component) => {
      const errors = []
      const warnings = []

      // 检查是否使用项目特定的命名约定
      Object.keys(component.props || {}).forEach(propName => {
        if (propName.startsWith('data-') && !propName.startsWith('data-testid')) {
          warnings.push({
            message: `建议使用 data-testid 而不是 ${propName}`,
            location: `${component.name}.props.${propName}`,
            code: 'PREFER_DATA_TESTID',
          })
        }
      })

      return {
        passed: warnings.length === 0,
        errors,
        warnings,
        info: [],
        suggestions: ['使用 data-testid 属性进行测试标识'],
      }
    },
  })

  // 扫描并验证组件
  const scanner = new ComponentScanner()
  const components = await scanner.scanComponents()

  for (const component of components.slice(0, 3)) { // 只验证前3个组件作为示例
    const result = validator.validateComponent(component)
    console.log(`\n🔍 验证组件: ${component.name}`)
    console.log(`   通过验证: ${result.passed ? '✅' : '❌'}`)
    console.log(`   错误数: ${result.errors.length}`)
    console.log(`   警告数: ${result.warnings.length}`)

    if (result.warnings.length > 0) {
      console.log('   警告详情:')
      result.warnings.slice(0, 2).forEach(warning => {
        console.log(`     - ${warning.message}`)
      })
    }
  }
}

/**
 * 示例6: 质量监控和报告
 */
export async function example6_QualityMonitoring() {
  console.log('\n=== 示例6: 质量监控和报告 ===')

  // 创建质量监控器
  const monitor = new QualityMonitor({
    thresholds: {
      excellent: 95,
      good: 85,
      acceptable: 75,
      poor: 65,
    },
  })

  // 扫描组件
  const scanner = new ComponentScanner()
  const components = await scanner.scanComponents()

  // 分析组件质量
  const qualityReports: ComponentQualityReport[] = []

  for (const component of components.slice(0, 5)) { // 分析前5个组件
    const apiValidator = new APIValidator()
    const validationResult = apiValidator.validateComponent(component)

    const qualityReport = monitor.analyzeComponentQuality(
      component.name,
      component,
      validationResult
    )

    qualityReports.push(qualityReport)

    console.log(`\n📊 ${component.name} 质量报告:`)
    console.log(`   质量等级: ${qualityReport.grade}`)
    console.log(`   总体得分: ${qualityReport.metrics.overallScore}`)
    console.log(`   API一致性: ${qualityReport.metrics.apiConsistencyScore}`)
    console.log(`   测试覆盖率: ${qualityReport.metrics.testCoverageScore}`)
    console.log(`   文档完整性: ${qualityReport.metrics.documentationScore}`)

    if (qualityReport.issues.length > 0) {
      console.log(`   问题数量: ${qualityReport.issues.length}`)
      qualityReport.issues.slice(0, 2).forEach(issue => {
        console.log(`     - ${issue.title} (${issue.severity})`)
      })
    }

    if (qualityReport.recommendations.length > 0) {
      console.log(`   改进建议: ${qualityReport.recommendations.length} 个`)
      qualityReport.recommendations.slice(0, 2).forEach(rec => {
        console.log(`     - ${rec.title} (${rec.priority})`)
      })
    }
  }

  // 生成项目质量报告
  const projectReport = monitor.generateProjectQualityReport('Xorigo UI', qualityReports)

  console.log(`\n📈 项目质量报告:`)
  console.log(`   总体得分: ${projectReport.overallMetrics.overallScore}`)
  console.log(`   质量等级分布:`)
  Object.entries(projectReport.gradeDistribution).forEach(([grade, count]) => {
    if (count > 0) {
      console.log(`     ${grade}级: ${count} 个组件`)
    }
  })
}

/**
 * 示例7: IDE集成
 */
export async function example7_IDEIntegration() {
  console.log('\n=== 示例7: IDE集成 ===')

  // 创建IDE集成服务
  const ideService = new IDEIntegrationService({
    enableRealTimeValidation: true,
    enableCodeCompletion: true,
    enableQuickFixes: true,
    validationDelay: 100,
  })

  // 模拟文件内容
  const fileContent = `
import React from 'react'

/**
 * 按钮组件示例
 */
export const ExampleButton = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  children
}) => {
  return (
    <button
      className={\`btn btn-\${variant} btn-\${size}\`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
`

  const fileUri = 'file:///example/Button.tsx'
  const position = { line: 10, character: 10 }

  // 1. 获取诊断信息
  console.log('🔍 获取IDE诊断信息...')
  const diagnostics = await ideService.getIDEFileDiagnostics(fileUri, fileContent)
  console.log(`   发现 ${diagnostics.length} 个诊断信息:`)
  diagnostics.slice(0, 3).forEach(diagnostic => {
    console.log(`     - ${diagnostic.message} (${diagnostic.severity})`)
  })

  // 2. 获取代码完成
  console.log('\n💡 获取代码完成建议...')
  const completions = await ideService.getIDECodeCompletions(fileUri, fileContent, position)
  console.log(`   提供 ${completions.length} 个完成建议:`)
  completions.slice(0, 5).forEach(completion => {
    console.log(`     - ${completion.label}: ${completion.detail}`)
  })

  // 3. 获取悬停信息
  console.log('\n📖 获取悬停信息...')
  const hoverInfo = await ideService.getIDEHoverInfo(fileUri, fileContent, position)
  if (hoverInfo) {
    console.log(`   悬停信息类型: markdown`)
    console.log(`   内容长度: ${hoverInfo.contents.value.length} 字符`)
  } else {
    console.log('   无悬停信息')
  }
}

/**
 * 示例8: 批量处理和报告生成
 */
export async function example8_BatchProcessingAndReporting() {
  console.log('\n=== 示例8: 批量处理和报告生成 ===')

  // 使用质量系统进行完整的批量处理
  const qualitySystem = new XorigoUIQualitySystem()

  // 1. 验证项目
  console.log('🚀 开始批量验证...')
  const validationResult = await qualitySystem.validateProject()

  if (validationResult.success) {
    console.log('✅ 项目验证通过!')
  } else {
    console.log(`❌ 发现问题: ${validationResult.message}`)
  }

  // 2. 运行回归测试
  console.log('\n🧪 运行回归测试...')
  const testResult = await qualitySystem.runRegressionTests()

  console.log(`📊 测试结果: ${testResult.summary.passedTests}/${testResult.summary.totalTests} 通过`)

  // 3. 生成质量报告
  console.log('\n📄 生成质量报告...')
  const reportResult = await qualitySystem.generateQualityReport()

  console.log(`📁 报告已生成: ${reportResult.reportPath}`)
  console.log(`⏰ 生成时间: ${reportResult.generatedAt.toLocaleString()}`)

  // 4. 生成API文档
  if (validationResult.validationResults) {
    const components = validationResult.validationResults.map(r => ({
      name: r.component,
      filePath: '',
      props: {},
      exportedTypes: [],
      isInteractive: false,
      isThemed: false,
      usesThemeTokens: false,
      supportsSevenAxis: false,
      hasJSDoc: false,
      hasExamples: false,
      hasTests: false,
      supportsKeyboardNavigation: false,
      usesGenerics: false,
      category: 'display',
      sourceCode: '',
    }))

    const apiDoc = qualitySystem.generateAPIDocumentation(components)
    console.log(`📚 API文档已生成: ${apiDoc.documentation.components.length} 个组件`)
  }

  // 5. 生成汇总报告
  console.log('\n📋 生成汇总报告...')
  const summary = {
    validation: validationResult.summary,
    testing: testResult.summary,
    generatedAt: new Date(),
    status: validationResult.success && testResult.success ? 'PASSED' : 'FAILED',
  }

  console.log('📈 汇总报告:')
  console.log(`   验证状态: ${summary.status}`)
  console.log(`   组件验证: ${summary.validation.passedComponents}/${summary.validation.totalComponents} 通过`)
  console.log(`   回归测试: ${summary.testing.passedTests}/${summary.testing.totalTests} 通过`)
  console.log(`   总体通过率: ${((summary.validation.passRate + summary.testing.passRate) / 2).toFixed(1)}%`)
}

// ============================================================================
// 运行所有示例
// ============================================================================

/**
 * 运行所有示例
 */
export async function runAllExamples() {
  console.log('🚀 开始运行 Xorigo UI API 质量保证系统示例\n')

  try {
    await example1_ValidateProject()
    await example2_ValidateComponent()
    await example3_RunRegressionTests()
    await example4_CustomComponentScanning()
    await example5_CustomAPIValidation()
    await example6_QualityMonitoring()
    await example7_IDEIntegration()
    await example8_BatchProcessingAndReporting()

    console.log('\n✅ 所有示例运行完成!')
  } catch (error) {
    console.error('\n❌ 示例运行失败:', error)
  }
}

// 如果直接运行此文件，则执行所有示例
if (require.main === module) {
  runAllExamples()
}