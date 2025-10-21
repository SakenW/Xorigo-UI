/**
 * 智能路由系统
 *
 * 根据任务内容、类型和上下文，自动选择最优的 MCP、Skill 或 Agent
 * 提供智能的服务发现、负载均衡和降级机制
 *
 * @author Xorigo UI Team
 * @version 1.0.0
 */

import { TaskRequest, TaskAnalysis, Capability, Resource } from './index'

// ============================================================================
// 智能路由核心接口
// ============================================================================

export interface RoutingStrategy {
  name: string
  priority: number
  conditions: RoutingCondition[]
  targets: RoutingTarget[]
  fallbacks?: RoutingTarget[]
}

export interface RoutingCondition {
  field: keyof TaskRequest | keyof TaskAnalysis
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'regex' | 'in' | 'gt' | 'lt'
  value: any
  weight?: number
}

export interface RoutingTarget {
  type: 'mcp' | 'skill' | 'agent' | 'hook'
  name: string
  confidence: number
  estimatedResponseTime: number
  capabilities: Capability[]
  cost?: number
}

export interface RoutingDecision {
  selectedTarget: RoutingTarget
  alternativeTargets: RoutingTarget[]
  confidence: number
  reasoning: string[]
  estimatedDuration: number
  cost: number
}

export interface ServicePerformance {
  avgResponseTime: number
  successRate: number
  lastUsed: Date
  errorCount: number
  requestCount: number
}

export interface RoutingContext {
  userPreferences?: UserRoutingPreferences
  systemLoad: SystemLoad
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
  projectContext?: ProjectContext
}

export interface UserRoutingPreferences {
  preferredServices?: string[]
  avoidServices?: string[]
  prioritizeSpeed?: boolean
  prioritizeCost?: boolean
  prioritizeReliability?: boolean
}

export interface SystemLoad {
  cpu: number
  memory: number
  activeRequests: number
  queueLength: number
}

export interface ProjectContext {
  projectType: 'component-library' | 'application' | 'documentation' | 'research'
  currentPhase: 'development' | 'testing' | 'documentation' | 'deployment'
  teamSize: number
  deadline?: Date
}

// ============================================================================
// 智能路由器主类
// ============================================================================

export class IntelligentRouter {
  private strategies: Map<string, RoutingStrategy> = new Map()
  private servicePerformance: Map<string, ServicePerformance> = new Map()
  private routingHistory: RoutingDecision[] = []
  private learningEnabled = true

  constructor() {
    this.initializeStrategies()
  }

  /**
   * 智能路由决策
   */
  async route(request: TaskRequest, analysis: TaskAnalysis, context: RoutingContext): Promise<RoutingDecision> {
    console.log(`🎯 智能路由分析: "${request.content}"`)

    // 1. 分析请求内容和上下文
    const enhancedContext = await this.enrichContext(request, analysis, context)

    // 2. 匹配路由策略
    const candidateStrategies = this.matchStrategies(request, analysis, enhancedContext)

    // 3. 评估候选服务
    const candidates = await this.evaluateCandidates(candidateStrategies, enhancedContext)

    // 4. 选择最优目标
    const decision = await this.selectOptimalTarget(candidates, enhancedContext)

    // 5. 记录路由决策
    this.recordRoutingDecision(decision)

    console.log(`✅ 路由决策: ${decision.selectedTarget.type}/${decision.selectedTarget.name} (置信度: ${decision.confidence}%)`)

    return decision
  }

  /**
   * 初始化路由策略
   */
  private initializeStrategies(): void {
    // 组件开发策略
    this.strategies.set('component-development', {
      name: '组件开发路由',
      priority: 1,
      conditions: [
        { field: 'content', operator: 'contains', value: ['组件', 'component'], weight: 10 },
        { field: 'category', operator: 'equals', value: 'component_development', weight: 15 }
      ],
      targets: [
        {
          type: 'skill',
          name: 'xorigo-component-generator',
          confidence: 95,
          estimatedResponseTime: 30000,
          capabilities: [Capability.COMPONENT_GENERATION],
          cost: 0
        }
      ],
      fallbacks: [
        {
          type: 'mcp',
          name: 'magic',
          confidence: 85,
          estimatedResponseTime: 25000,
          capabilities: [Capability.COMPONENT_GENERATION],
          cost: 0
        }
      ]
    })

    // 文档查询策略
    this.strategies.set('documentation-query', {
      name: '文档查询路由',
      priority: 2,
      conditions: [
        { field: 'content', operator: 'contains', value: ['查询', '文档', 'document', 'docs'], weight: 10 },
        { field: 'category', operator: 'equals', value: 'research', weight: 15 },
        { field: 'requiredCapabilities', operator: 'contains', value: Capability.DOCUMENTATION_QUERY, weight: 20 }
      ],
      targets: [
        {
          type: 'mcp',
          name: 'context7',
          confidence: 90,
          estimatedResponseTime: 15000,
          capabilities: [Capability.DOCUMENTATION_QUERY],
          cost: 0
        }
      ],
      fallbacks: [
        {
          type: 'skill',
          name: 'xorigo-tech-stack-docs-querier',
          confidence: 80,
          estimatedResponseTime: 12000,
          capabilities: [Capability.DOCUMENTATION_QUERY],
          cost: 0
        },
        {
          type: 'mcp',
          name: 'tavily',
          confidence: 75,
          estimatedResponseTime: 20000,
          capabilities: [Capability.WEB_SEARCH],
          cost: 0
        }
      ]
    })

    // 网络搜索策略
    this.strategies.set('web-search', {
      name: '网络搜索路由',
      priority: 3,
      conditions: [
        { field: 'content', operator: 'contains', value: ['搜索', 'search', '最新', '趋势', 'news', 'latest'], weight: 10 },
        { field: 'requiredCapabilities', operator: 'contains', value: Capability.WEB_SEARCH, weight: 20 }
      ],
      targets: [
        {
          type: 'mcp',
          name: 'tavily',
          confidence: 92,
          estimatedResponseTime: 20000,
          capabilities: [Capability.WEB_SEARCH],
          cost: 0
        }
      ]
    })

    // 测试生成策略
    this.strategies.set('testing-generation', {
      name: '测试生成路由',
      priority: 4,
      conditions: [
        { field: 'content', operator: 'contains', value: ['测试', 'test'], weight: 10 },
        { field: 'requiredCapabilities', operator: 'contains', value: Capability.TEST_GENERATION, weight: 20 }
      ],
      targets: [
        {
          type: 'skill',
          name: 'xorigo-component-testing-generator',
          confidence: 88,
          estimatedResponseTime: 25000,
          capabilities: [Capability.TEST_GENERATION],
          cost: 0
        }
      ]
    })

    // 文档生成策略
    this.strategies.set('documentation-generation', {
      name: '文档生成路由',
      priority: 5,
      conditions: [
        { field: 'content', operator: 'contains', value: ['文档', '生成', 'generate', 'document'], weight: 10 },
        { field: 'requiredCapabilities', operator: 'contains', value: Capability.DOCUMENT_GENERATION, weight: 20 }
      ],
      targets: [
        {
          type: 'skill',
          name: 'xorigo-docs-generator',
          confidence: 90,
          estimatedResponseTime: 20000,
          capabilities: [Capability.DOCUMENT_GENERATION],
          cost: 0
        }
      ]
    })

    // Docker 管理策略
    this.strategies.set('docker-management', {
      name: 'Docker 管理路由',
      priority: 6,
      conditions: [
        { field: 'content', operator: 'contains', value: ['docker', '容器', '启动', '环境', 'dev'], weight: 10 },
        { field: 'category', operator: 'equals', value: 'environment_management', weight: 15 }
      ],
      targets: [
        {
          type: 'agent',
          name: 'dev-server-agent',
          confidence: 95,
          estimatedResponseTime: 60000,
          capabilities: [Capability.DOCKER_MANAGEMENT],
          cost: 0
        }
      ]
    })

    // 问题诊断策略
    this.strategies.set('problem-diagnosis', {
      name: '问题诊断路由',
      priority: 7,
      conditions: [
        { field: 'content', operator: 'contains', value: ['问题', '错误', '诊断', 'diagnose', 'error', 'issue'], weight: 10 },
        { field: 'category', operator: 'equals', value: 'problem_diagnosis', weight: 15 }
      ],
      targets: [
        {
          type: 'mcp',
          name: 'sequential-thinking',
          confidence: 85,
          estimatedResponseTime: 45000,
          capabilities: [Capability.ERROR_DIAGNOSIS],
          cost: 0
        }
      ],
      fallbacks: [
        {
          type: 'skill',
          name: 'xorigo-docker-unified-manager',
          confidence: 75,
          estimatedResponseTime: 30000,
          capabilities: [Capability.ERROR_DIAGNOSIS],
          cost: 0
        }
      ]
    })

    // 性能优化策略
    this.strategies.set('performance-optimization', {
      name: '性能优化路由',
      priority: 8,
      conditions: [
        { field: 'content', operator: 'contains', value: ['性能', '优化', 'performance', 'optimize'], weight: 10 },
        { field: 'category', operator: 'equals', value: 'performance_optimization', weight: 15 }
      ],
      targets: [
        {
          type: 'skill',
          name: 'xorigo-performance-optimizer',
          confidence: 88,
          estimatedResponseTime: 40000,
          capabilities: [Capability.PERFORMANCE_ANALYSIS],
          cost: 0
        }
      ]
    })

    // 代码质量策略
    this.strategies.set('code-quality', {
      name: '代码质量路由',
      priority: 9,
      conditions: [
        { field: 'content', operator: 'contains', value: ['质量', '检查', '规范', 'quality', 'check'], weight: 10 },
        { field: 'category', operator: 'equals', value: 'code_quality', weight: 15 }
      ],
      targets: [
        {
          type: 'skill',
          name: 'xorigo-code-quality-guard',
          confidence: 87,
          estimatedResponseTime: 20000,
          capabilities: [Capability.CODE_ANALYSIS],
          cost: 0
        },
        {
          type: 'mcp',
          name: 'eslint',
          confidence: 82,
          estimatedResponseTime: 15000,
          capabilities: [Capability.CODE_ANALYSIS],
          cost: 0
        }
      ]
    })

    // UI 组件生成策略 (Magic)
    this.strategies.set('ui-component-magic', {
      name: 'UI 组件生成 (Magic)',
      priority: 10,
      conditions: [
        { field: 'content', operator: 'contains', value: ['ui', '界面', '界面设计', '用户界面'], weight: 8 },
        { field: 'content', operator: 'contains', value: ['现代化', 'modern', '美观', 'beautiful'], weight: 6 }
      ],
      targets: [
        {
          type: 'mcp',
          name: 'magic',
          confidence: 85,
          estimatedResponseTime: 25000,
          capabilities: [Capability.COMPONENT_GENERATION],
          cost: 0
        }
      ],
      fallbacks: [
        {
          type: 'skill',
          name: 'xorigo-component-generator',
          confidence: 80,
          estimatedResponseTime: 30000,
          capabilities: [Capability.COMPONENT_GENERATION],
          cost: 0
        }
      ]
    })

    // 可访问性策略
    this.strategies.set('accessibility', {
      name: '可访问性路由',
      priority: 11,
      conditions: [
        { field: 'content', operator: 'contains', value: ['可访问', 'accessibility', 'a11y', '无障碍'], weight: 10 },
        { field: 'category', operator: 'equals', value: 'accessibility', weight: 15 }
      ],
      targets: [
        {
          type: 'skill',
          name: 'xorigo-accessibility-generator',
          confidence: 90,
          estimatedResponseTime: 25000,
          capabilities: [Capability.CODE_ANALYSIS],
          cost: 0
        }
      ]
    })

    console.log(`✅ 初始化 ${this.strategies.size} 个路由策略`)
  }

  /**
   * 匹配路由策略
   */
  private matchStrategies(request: TaskRequest, analysis: TaskAnalysis, context: RoutingContext): RoutingStrategy[] {
    const matches: Array<{ strategy: RoutingStrategy, score: number }> = []

    for (const strategy of this.strategies.values()) {
      let score = 0
      let maxPossibleScore = 0

      for (const condition of strategy.conditions) {
        maxPossibleScore += condition.weight || 1

        if (this.evaluateCondition(condition, request, analysis, context)) {
          score += condition.weight || 1
        }
      }

      // 如果有匹配，添加到候选列表
      if (score > 0) {
        const normalizedScore = score / maxPossibleScore
        matches.push({ strategy, score: normalizedScore })
      }
    }

    // 按分数和优先级排序
    return matches
      .sort((a, b) => {
        // 首先按优先级排序
        if (a.strategy.priority !== b.strategy.priority) {
          return a.strategy.priority - b.strategy.priority
        }
        // 然后按匹配分数排序
        return b.score - a.score
      })
      .map(match => match.strategy)
  }

  /**
   * 评估路由条件
   */
  private evaluateCondition(
    condition: RoutingCondition,
    request: TaskRequest,
    analysis: TaskAnalysis,
    context: RoutingContext
  ): boolean {
    let fieldValue: any

    // 获取字段值
    if (condition.field in request) {
      fieldValue = (request as any)[condition.field]
    } else if (condition.field in analysis) {
      fieldValue = (analysis as any)[condition.field]
    } else if (condition.field in context) {
      fieldValue = (context as any)[condition.field]
    } else {
      return false
    }

    // 根据操作符评估条件
    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value

      case 'contains':
        if (Array.isArray(condition.value)) {
          return condition.value.some(val =>
            typeof fieldValue === 'string' && fieldValue.toLowerCase().includes(val.toString().toLowerCase())
          )
        }
        return typeof fieldValue === 'string' &&
               fieldValue.toLowerCase().includes(condition.value.toString().toLowerCase())

      case 'startsWith':
        return typeof fieldValue === 'string' &&
               fieldValue.toLowerCase().startsWith(condition.value.toString().toLowerCase())

      case 'endsWith':
        return typeof fieldValue === 'string' &&
               fieldValue.toLowerCase().endsWith(condition.value.toString().toLowerCase())

      case 'regex':
        return typeof fieldValue === 'string' &&
               new RegExp(condition.value).test(fieldValue)

      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(fieldValue)

      case 'gt':
        return Number(fieldValue) > Number(condition.value)

      case 'lt':
        return Number(fieldValue) < Number(condition.value)

      default:
        return false
    }
  }

  /**
   * 评估候选服务
   */
  private async evaluateCandidates(
    strategies: RoutingStrategy[],
    context: RoutingContext
  ): Promise<RoutingTarget[]> {
    const candidates: RoutingTarget[] = []

    for (const strategy of strategies.slice(0, 3)) { // 只考虑前3个最匹配的策略
      for (const target of strategy.targets) {
        // 获取服务性能数据
        const performance = this.getServicePerformance(target.name, target.type)

        // 计算调整后的置信度
        const adjustedConfidence = this.calculateAdjustedConfidence(
          target.confidence,
          performance,
          context
        )

        candidates.push({
          ...target,
          confidence: adjustedConfidence,
          estimatedResponseTime: performance.avgResponseTime || target.estimatedResponseTime
        })
      }

      // 添加回退服务
      if (strategy.fallbacks) {
        for (const fallback of strategy.fallbacks) {
          const performance = this.getServicePerformance(fallback.name, fallback.type)
          const adjustedConfidence = this.calculateAdjustedConfidence(
            fallback.confidence,
            performance,
            context
          ) * 0.8 // 回退服务置信度降低20%

          candidates.push({
            ...fallback,
            confidence: adjustedConfidence,
            estimatedResponseTime: performance.avgResponseTime || fallback.estimatedResponseTime
          })
        }
      }
    }

    // 去重并排序
    return this.deduplicateAndSort(candidates)
  }

  /**
   * 计算调整后的置信度
   */
  private calculateAdjustedConfidence(
    baseConfidence: number,
    performance: ServicePerformance,
    context: RoutingContext
  ): number {
    let adjustedConfidence = baseConfidence

    // 基于成功率调整
    if (performance.successRate < 90) {
      adjustedConfidence -= (90 - performance.successRate) * 0.5
    }

    // 基于响应时间调整
    if (performance.avgResponseTime > 30000) { // 超过30秒
      adjustedConfidence -= (performance.avgResponseTime - 30000) / 1000
    }

    // 基于系统负载调整
    if (context.systemLoad.activeRequests > 10) {
      adjustedConfidence -= (context.systemLoad.activeRequests - 10) * 2
    }

    // 基于用户偏好调整
    if (context.userPreferences) {
      const { preferredServices, avoidServices, prioritizeSpeed, prioritizeReliability } = context.userPreferences

      if (preferredServices?.includes(`${performance.type}-${performance.name}`)) {
        adjustedConfidence += 10
      }

      if (avoidServices?.includes(`${performance.type}-${performance.name}`)) {
        adjustedConfidence -= 20
      }

      if (prioritizeSpeed && performance.avgResponseTime < 20000) {
        adjustedConfidence += 5
      }

      if (prioritizeReliability && performance.successRate > 95) {
        adjustedConfidence += 5
      }
    }

    // 确保置信度在合理范围内
    return Math.max(0, Math.min(100, adjustedConfidence))
  }

  /**
   * 获取服务性能数据
   */
  private getServicePerformance(name: string, type: string): ServicePerformance {
    const key = `${type}-${name}`
    return this.servicePerformance.get(key) || {
      avgResponseTime: 15000,
      successRate: 95,
      lastUsed: new Date(),
      errorCount: 0,
      requestCount: 0
    }
  }

  /**
   * 去重并排序候选服务
   */
  private deduplicateAndSort(candidates: RoutingTarget[]): RoutingTarget[] {
    const unique = new Map<string, RoutingTarget>()

    for (const candidate of candidates) {
      const key = `${candidate.type}-${candidate.name}`

      if (!unique.has(key) || unique.get(key)!.confidence < candidate.confidence) {
        unique.set(key, candidate)
      }
    }

    return Array.from(unique.values())
      .sort((a, b) => b.confidence - a.confidence)
  }

  /**
   * 选择最优目标
   */
  private async selectOptimalTarget(
    candidates: RoutingTarget[],
    context: RoutingContext
  ): Promise<RoutingDecision> {
    if (candidates.length === 0) {
      throw new Error('没有找到合适的路由目标')
    }

    const selectedTarget = candidates[0]
    const alternativeTargets = candidates.slice(1, 3) // 最多保留2个备选

    const reasoning = this.generateReasoning(selectedTarget, alternativeTargets, context)

    return {
      selectedTarget,
      alternativeTargets,
      confidence: selectedTarget.confidence,
      reasoning,
      estimatedDuration: selectedTarget.estimatedResponseTime,
      cost: selectedTarget.cost || 0
    }
  }

  /**
   * 生成路由决策推理
   */
  private generateReasoning(
    selected: RoutingTarget,
    alternatives: RoutingTarget[],
    context: RoutingContext
  ): string[] {
    const reasoning: string[] = []

    reasoning.push(`选择 ${selected.type}/${selected.name}，置信度 ${selected.confidence}%`)

    if (selected.confidence > 90) {
      reasoning.push('该服务高度匹配请求需求')
    } else if (selected.confidence > 75) {
      reasoning.push('该服务较好匹配请求需求')
    } else {
      reasoning.push('该服务基本匹配请求需求，但有备选方案')
    }

    if (alternatives.length > 0) {
      reasoning.push(`备选方案: ${alternatives.map(a => `${a.type}/${a.name}`).join(', ')}`)
    }

    // 基于上下文添加推理
    if (context.systemLoad.activeRequests > 5) {
      reasoning.push('当前系统负载较高，选择了响应较快的服务')
    }

    if (context.userPreferences?.prioritizeSpeed) {
      reasoning.push('用户优先考虑速度，选择了响应时间较短的服务')
    }

    return reasoning
  }

  /**
   * 丰富上下文信息
   */
  private async enrichContext(
    request: TaskRequest,
    analysis: TaskAnalysis,
    context: RoutingContext
  ): Promise<RoutingContext> {
    // 分析时间
    const hour = new Date().getHours()
    let timeOfDay: RoutingContext['timeOfDay']

    if (hour >= 6 && hour < 12) timeOfDay = 'morning'
    else if (hour >= 12 && hour < 18) timeOfDay = 'afternoon'
    else if (hour >= 18 && hour < 22) timeOfDay = 'evening'
    else timeOfDay = 'night'

    return {
      ...context,
      timeOfDay
    }
  }

  /**
   * 记录路由决策
   */
  private recordRoutingDecision(decision: RoutingDecision): void {
    this.routingHistory.push(decision)

    // 限制历史记录数量
    if (this.routingHistory.length > 1000) {
      this.routingHistory = this.routingHistory.slice(-500)
    }

    // 更新服务性能统计
    this.updateServicePerformance(decision)
  }

  /**
   * 更新服务性能统计
   */
  private updateServicePerformance(decision: RoutingDecision): void {
    const key = `${decision.selectedTarget.type}-${decision.selectedTarget.name}`
    const existing = this.servicePerformance.get(key)

    if (existing) {
      existing.requestCount++
      existing.lastUsed = new Date()
    } else {
      this.servicePerformance.set(key, {
        avgResponseTime: decision.estimatedDuration,
        successRate: 100, // 初始假设成功
        lastUsed: new Date(),
        errorCount: 0,
        requestCount: 1
      })
    }
  }

  /**
   * 学习和优化路由策略
   */
  async learnFromResults(decision: RoutingDecision, success: boolean, actualDuration: number): Promise<void> {
    if (!this.learningEnabled) {
      return
    }

    const key = `${decision.selectedTarget.type}-${decision.selectedTarget.name}`
    const performance = this.servicePerformance.get(key)

    if (performance) {
      // 更新响应时间
      performance.avgResponseTime = (performance.avgResponseTime * 0.8) + (actualDuration * 0.2)

      // 更新成功率
      if (success) {
        performance.successRate = (performance.successRate * 0.9) + (100 * 0.1)
      } else {
        performance.successRate = (performance.successRate * 0.9) + (0 * 0.1)
        performance.errorCount++
      }

      // 如果成功率显著下降，调整策略
      if (performance.successRate < 80) {
        await this.adjustStrategyForService(decision.selectedTarget)
      }
    }
  }

  /**
   * 为低质量服务调整策略
   */
  private async adjustStrategyForService(service: RoutingTarget): Promise<void> {
    console.log(`⚠️ 服务 ${service.name} 质量下降，正在调整路由策略...`)

    // 降低该服务在所有策略中的优先级
    for (const strategy of this.strategies.values()) {
      const targetIndex = strategy.targets.findIndex(t => t.name === service.name)
      if (targetIndex !== -1) {
        strategy.targets[targetIndex].confidence *= 0.9
      }

      // 如果有回退服务，提升回退服务的优先级
      if (strategy.fallbacks) {
        const fallbackIndex = strategy.fallbacks.findIndex(f => f.name === service.name)
        if (fallbackIndex !== -1) {
          strategy.fallbacks[fallbackIndex].confidence *= 0.8
        }
      }
    }
  }

  /**
   * 获取路由统计信息
   */
  getRoutingStatistics(): {
    totalRoutings: number
    averageConfidence: number
    mostUsedServices: Array<{ name: string, count: number }>
    recentDecisions: RoutingDecision[]
  } {
    const totalRoutings = this.routingHistory.length
    const averageConfidence = totalRoutings > 0
      ? this.routingHistory.reduce((sum, d) => sum + d.confidence, 0) / totalRoutings
      : 0

    const serviceUsage = new Map<string, number>()
    for (const decision of this.routingHistory) {
      const key = `${decision.selectedTarget.type}/${decision.selectedTarget.name}`
      serviceUsage.set(key, (serviceUsage.get(key) || 0) + 1)
    }

    const mostUsedServices = Array.from(serviceUsage.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }))

    return {
      totalRoutings,
      averageConfidence,
      mostUsedServices,
      recentDecisions: this.routingHistory.slice(-20)
    }
  }

  /**
   * 启用/禁用学习功能
   */
  setLearningEnabled(enabled: boolean): void {
    this.learningEnabled = enabled
    console.log(`🧠 路由学习功能${enabled ? '已启用' : '已禁用'}`)
  }
}

// ============================================================================
// 导出
// ============================================================================

export default IntelligentRouter