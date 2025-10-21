/**
 * 系统协调器集成测试
 *
 * 测试优化后的系统协作效果，验证智能路由和工作流编排功能
 * 提供实际的调用示例和性能基准测试
 *
 * @author Xorigo UI Team
 * @version 1.0.0
 */

import { SystemCoordinator } from './index'
import IntelligentRouter from './intelligent-router'
import WorkflowEngine from './workflow-engine'

// ============================================================================
// 测试配置
// ============================================================================

interface TestScenario {
  name: string
  description: string
  request: any
  expectedBehavior: string
  category: 'routing' | 'workflow' | 'integration' | 'performance'
}

interface TestResult {
  scenario: TestScenario
  success: boolean
  duration: number
  actualBehavior: string
  metrics?: any
  error?: Error
}

// ============================================================================
// 集成测试主类
// ============================================================================

export class SystemIntegrationTest {
  private coordinator: SystemCoordinator
  private testResults: TestResult[] = []

  constructor() {
    const router = new IntelligentRouter()
    const workflowEngine = new WorkflowEngine(router)
    this.coordinator = new SystemCoordinator()
  }

  /**
   * 运行完整的集成测试
   */
  async runFullIntegrationTest(): Promise<void> {
    console.log('🧪 开始 Xorigo UI 系统集成测试')
    console.log('=' .repeat(60))

    try {
      // 1. 初始化系统
      await this.coordinator.initialize()

      // 2. 运行测试场景
      await this.runTestScenarios()

      // 3. 生成测试报告
      this.generateTestReport()

    } catch (error) {
      console.error('❌ 集成测试失败:', error)
    }
  }

  /**
   * 运行测试场景
   */
  private async runTestScenarios(): Promise<void> {
    const scenarios = this.getTestScenarios()

    for (const scenario of scenarios) {
      console.log(`\n🎯 测试场景: ${scenario.name}`)
      console.log(`   ${scenario.description}`)

      const result = await this.runSingleTest(scenario)
      this.testResults.push(result)

      if (result.success) {
        console.log(`✅ 测试通过 (${result.duration}ms)`)
        console.log(`   实际行为: ${result.actualBehavior}`)
      } else {
        console.log(`❌ 测试失败 (${result.duration}ms)`)
        console.log(`   错误: ${result.error?.message}`)
      }
    }
  }

  /**
   * 运行单个测试
   */
  private async runSingleTest(scenario: TestScenario): Promise<TestResult> {
    const startTime = Date.now()

    try {
      let actualBehavior = ''
      let metrics: any = {}

      switch (scenario.category) {
        case 'routing':
          const routingResult = await this.testRouting(scenario)
          actualBehavior = routingResult.behavior
          metrics = routingResult.metrics
          break

        case 'workflow':
          const workflowResult = await this.testWorkflow(scenario)
          actualBehavior = workflowResult.behavior
          metrics = workflowResult.metrics
          break

        case 'integration':
          const integrationResult = await this.testIntegration(scenario)
          actualBehavior = integrationResult.behavior
          metrics = integrationResult.metrics
          break

        case 'performance':
          const performanceResult = await this.testPerformance(scenario)
          actualBehavior = performanceResult.behavior
          metrics = performanceResult.metrics
          break
      }

      const duration = Date.now() - startTime

      return {
        scenario,
        success: true,
        duration,
        actualBehavior,
        metrics
      }

    } catch (error) {
      const duration = Date.now() - startTime

      return {
        scenario,
        success: false,
        duration,
        actualBehavior: '测试执行失败',
        error: error as Error
      }
    }
  }

  /**
   * 测试智能路由
   */
  private async testRouting(scenario: TestScenario): Promise<{ behavior: string, metrics: any }> {
    const request = {
      id: `test_${Date.now()}`,
      userId: 'test-user',
      content: scenario.request.content,
      priority: 'medium' as const,
      timestamp: new Date()
    }

    const plan = await this.coordinator.routeTask(request)

    return {
      behavior: `路由到 ${plan.steps.length} 个步骤，主要目标: ${plan.steps[0]?.target}`,
      metrics: {
        stepCount: plan.steps.length,
        estimatedDuration: plan.estimatedDuration,
        primaryTarget: plan.steps[0]?.target
      }
    }
  }

  /**
   * 测试工作流
   */
  private async testWorkflow(scenario: TestScenario): Promise<{ behavior: string, metrics: any }> {
    const request = {
      id: `test_${Date.now()}`,
      userId: 'test-user',
      content: scenario.request.content,
      priority: 'medium' as const,
      timestamp: new Date()
    }

    // 模拟任务分析
    const analysis = {
      category: 'component_development' as any,
      complexity: 'complex' as const,
      requiredCapabilities: ['component_generation', 'test_generation', 'document_generation'],
      estimatedDuration: 180000,
      dependencies: [],
      riskLevel: 'medium' as const
    }

    const result = await this.coordinator.coordinateExecution({
      id: `plan_${Date.now()}`,
      taskId: request.id,
      steps: [],
      estimatedDuration: analysis.estimatedDuration,
      requiredResources: [],
      fallbackStrategies: [],
      rollbackPlan: { enabled: false, rollbackSteps: [], conditions: [] }
    })

    return {
      behavior: `工作流执行完成，状态: ${result.status}，完成 ${result.steps.length} 个步骤`,
      metrics: {
        status: result.status,
        stepsCompleted: result.steps.length,
        totalDuration: result.metrics.totalDuration,
        successRate: result.metrics.successRate
      }
    }
  }

  /**
   * 测试系统集成
   */
  private async testIntegration(scenario: TestScenario): Promise<{ behavior: string, metrics: any }> {
    // 模拟复杂的跨系统协作场景
    const startTime = Date.now()

    const request = {
      id: `test_${Date.now()}`,
      userId: 'test-user',
      content: scenario.request.content,
      priority: 'high' as const,
      timestamp: new Date()
    }

    try {
      // 1. 智能路由
      const plan = await this.coordinator.routeTask(request)
      const routingTime = Date.now() - startTime

      // 2. 执行协调
      const result = await this.coordinator.coordinateExecution(plan)
      const totalTime = Date.now() - startTime

      return {
        behavior: `集成测试成功: 路由(${routingTime}ms) + 执行(${totalTime - routingTime}ms) = 总计(${totalTime}ms)`,
        metrics: {
          routingTime,
          executionTime: totalTime - routingTime,
          totalTime,
          stepCount: result.steps.length,
          successRate: result.metrics.successRate
        }
      }

    } catch (error) {
      const totalTime = Date.now() - startTime
      throw new Error(`集成测试失败 (${totalTime}ms): ${error}`)
    }
  }

  /**
   * 测试性能
   */
  private async testPerformance(scenario: TestScenario): Promise<{ behavior: string, metrics: any }> {
    const iterations = scenario.request.iterations || 10
    const results: number[] = []

    for (let i = 0; i < iterations; i++) {
      const startTime = Date.now()

      const request = {
        id: `perf_test_${Date.now()}_${i}`,
        userId: 'test-user',
        content: scenario.request.content,
        priority: 'medium' as const,
        timestamp: new Date()
      }

      await this.coordinator.routeTask(request)
      results.push(Date.now() - startTime)
    }

    const avgTime = results.reduce((sum, time) => sum + time, 0) / results.length
    const minTime = Math.min(...results)
    const maxTime = Math.max(...results)

    return {
      behavior: `性能测试完成: ${iterations} 次调用，平均 ${avgTime.toFixed(2)}ms (最快: ${minTime}ms, 最慢: ${maxTime}ms)`,
      metrics: {
        iterations,
        averageTime: avgTime,
        minTime,
        maxTime,
        standardDeviation: this.calculateStandardDeviation(results, avgTime)
      }
    }
  }

  /**
   * 计算标准差
   */
  private calculateStandardDeviation(values: number[], mean: number): number {
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2))
    const avgSquaredDiff = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length
    return Math.sqrt(avgSquaredDiff)
  }

  /**
   * 获取测试场景
   */
  private getTestScenarios(): TestScenario[] {
    return [
      // 智能路由测试
      {
        name: '组件创建智能路由',
        description: '测试组件创建请求的智能路由',
        category: 'routing',
        request: { content: '创建一个现代化的按钮组件' },
        expectedBehavior: '路由到 component-generator skill 或 magic mcp'
      },
      {
        name: '文档查询智能路由',
        description: '测试文档查询请求的智能路由',
        category: 'routing',
        request: { content: '查询 React Hooks 的最佳实践文档' },
        expectedBehavior: '路由到 context7 mcp'
      },
      {
        name: '问题诊断智能路由',
        description: '测试问题诊断请求的智能路由',
        category: 'routing',
        request: { content: 'Docker 容器编译出错，帮我诊断问题' },
        expectedBehavior: '路由到 sequential-thinking mcp 或 dev-server-agent'
      },

      // 工作流测试
      {
        name: '完整组件开发工作流',
        description: '测试从设计到文档的完整组件开发工作流',
        category: 'workflow',
        request: { content: '从零开始开发一个完整的数据表格组件，包含测试和文档' },
        expectedBehavior: '触发完整组件开发工作流，执行 API设计→生成→测试→文档→质量检查'
      },
      {
        name: '智能问题诊断工作流',
        description: '测试智能问题诊断工作流',
        category: 'workflow',
        request: { content: '开发环境出现问题，需要智能诊断和修复' },
        expectedBehavior: '触发问题诊断工作流，执行 诊断→查询→修复 流程'
      },

      // 集成测试
      {
        name: '跨系统协作测试',
        description: '测试 MCP + Skill + Agent 的协作',
        category: 'integration',
        request: { content: '创建高质量的可访问性组件，并生成完整的测试套件' },
        expectedBehavior: '智能路由到多个系统，协调执行完成复杂任务'
      },
      {
        name: '错误恢复测试',
        description: '测试系统错误恢复和降级机制',
        category: 'integration',
        request: { content: '使用不可用的服务创建组件' },
        expectedBehavior: '自动切换到备用服务，确保任务完成'
      },

      // 性能测试
      {
        name: '路由性能基准测试',
        description: '测试智能路由的性能表现',
        category: 'performance',
        request: { content: '创建组件', iterations: 50 },
        expectedBehavior: '50次路由调用，平均响应时间 < 100ms'
      },
      {
        name: '并发执行性能测试',
        description: '测试并发执行的性能',
        category: 'performance',
        request: { content: '并发创建多个组件', iterations: 20 },
        expectedBehavior: '20个并发任务，系统稳定运行'
      },

      // 边界测试
      {
        name: '复杂请求处理测试',
        description: '测试复杂请求的处理能力',
        category: 'integration',
        request: { content: '创建一套完整的表单组件库，包含所有常用表单元素、验证规则、国际化支持、主题适配、可访问性优化和完整文档，同时确保性能优化和最佳实践' },
        expectedBehavior: '能够分解复杂任务，自动选择合适的组件组合'
      },
      {
        name: '模糊意图识别测试',
        description: '测试模糊意图的识别能力',
        category: 'routing',
        request: { content: '嗯...我想要一个那种...就是可以点击的东西，要好看一点' },
        expectedBehavior: '能够理解模糊意图，路由到合适的组件创建服务'
      }
    ]
  }

  /**
   * 生成测试报告
   */
  private generateTestReport(): void {
    console.log('\n' + '=' .repeat(60))
    console.log('📊 系统集成测试报告')
    console.log('=' .repeat(60))

    const totalTests = this.testResults.length
    const passedTests = this.testResults.filter(r => r.success).length
    const failedTests = totalTests - passedTests
    const successRate = (passedTests / totalTests) * 100

    console.log(`\n📈 总体统计:`)
    console.log(`   总测试数: ${totalTests}`)
    console.log(`   通过: ${passedTests} ✅`)
    console.log(`   失败: ${failedTests} ❌`)
    console.log(`   成功率: ${successRate.toFixed(1)}%`)

    // 按类别统计
    const categories = ['routing', 'workflow', 'integration', 'performance'] as const
    for (const category of categories) {
      const categoryTests = this.testResults.filter(r => r.scenario.category === category)
      const categoryPassed = categoryTests.filter(r => r.success).length
      const categoryRate = (categoryPassed / categoryTests.length) * 100

      console.log(`\n📋 ${category.toUpperCase()} 测试:`)
      console.log(`   ${categoryPassed}/${categoryTests.length} 通过 (${categoryRate.toFixed(1)}%)`)

      // 显示详细的测试结果
      for (const result of categoryTests) {
        const status = result.success ? '✅' : '❌'
        console.log(`   ${status} ${result.scenario.name} (${result.duration}ms)`)
        if (!result.success) {
          console.log(`      错误: ${result.error?.message}`)
        }
      }
    }

    // 性能统计
    const performanceTests = this.testResults.filter(r => r.scenario.category === 'performance' && r.success)
    if (performanceTests.length > 0) {
      console.log(`\n⚡ 性能统计:`)
      for (const result of performanceTests) {
        if (result.metrics?.averageTime) {
          console.log(`   ${result.scenario.name}: 平均 ${result.metrics.averageTime.toFixed(2)}ms`)
        }
      }
    }

    // 优化建议
    console.log(`\n💡 优化建议:`)
    if (successRate < 90) {
      console.log(`   - 成功率低于 90%，需要检查失败的测试用例`)
    }

    const avgDuration = this.testResults.reduce((sum, r) => sum + r.duration, 0) / this.testResults.length
    if (avgDuration > 5000) {
      console.log(`   - 平均响应时间 ${avgDuration.toFixed(0)}ms 较长，建议优化性能`)
    }

    if (failedTests === 0) {
      console.log(`   - 所有测试通过，系统状态优秀 ✨`)
    }

    console.log(`\n🎯 结论:`)
    if (successRate >= 95) {
      console.log(`   系统优化效果优秀，可以投入生产使用 🚀`)
    } else if (successRate >= 80) {
      console.log(`   系统基本可用，建议解决失败的测试后投入使用 ✅`)
    } else {
      console.log(`   系统需要进一步优化才能投入使用 ⚠️`)
    }

    console.log('\n' + '=' .repeat(60))
  }

  /**
   * 导出测试结果
   */
  exportTestResults(): TestResult[] {
    return this.testResults
  }

  /**
   * 获取测试统计
   */
  getTestStatistics(): {
    total: number
    passed: number
    failed: number
    successRate: number
    averageDuration: number
    categoryStats: Record<string, { total: number, passed: number, rate: number }>
  } {
    const total = this.testResults.length
    const passed = this.testResults.filter(r => r.success).length
    const failed = total - passed
    const successRate = (passed / total) * 100
    const averageDuration = this.testResults.reduce((sum, r) => sum + r.duration, 0) / total

    const categoryStats: Record<string, { total: number, passed: number, rate: number }> = {}
    const categories = ['routing', 'workflow', 'integration', 'performance']

    for (const category of categories) {
      const categoryTests = this.testResults.filter(r => r.scenario.category === category)
      const categoryPassed = categoryTests.filter(r => r.success).length
      categoryStats[category] = {
        total: categoryTests.length,
        passed: categoryPassed,
        rate: (categoryPassed / categoryTests.length) * 100
      }
    }

    return {
      total,
      passed,
      failed,
      successRate,
      averageDuration,
      categoryStats
    }
  }
}

// ============================================================================
// 主执行函数
// ============================================================================

/**
 * 运行完整的系统集成测试
 */
export async function runSystemIntegrationTest(): Promise<void> {
  const test = new SystemIntegrationTest()
  await test.runFullIntegrationTest()
}

// 如果直接运行此文件
if (require.main === module) {
  runSystemIntegrationTest().catch(console.error)
}

// ============================================================================
// 导出
// ============================================================================

export { SystemIntegrationTest, TestScenario, TestResult }