/**
 * Token 使用优化器
 * 根据路径和操作类型智能选择检测模块，减少不必要的 token 消耗
 */

import type { DetectionModule, DetectionContext } from './detection-core'

export interface TokenOptimizationStrategy {
  enableLightweightMode: boolean
  maxTokensPerOperation: number
  prioritizeCriticalRules: boolean
  batchSimilarOperations: boolean
}

export interface ModuleCost {
  moduleId: string
  estimatedCost: number
  priority: 'high' | 'medium' | 'low'
  categories: string[]
}

/**
 * Token 优化器
 */
export class TokenOptimizer {
  private strategy: TokenOptimizationStrategy
  private moduleCosts: Map<string, ModuleCost> = new Map()

  constructor(strategy: Partial<TokenOptimizationStrategy> = {}) {
    this.strategy = {
      enableLightweightMode: true,
      maxTokensPerOperation: 200,
      prioritizeCriticalRules: true,
      batchSimilarOperations: true,
      ...strategy
    }

    this.initializeModuleCosts()
  }

  /**
   * 初始化模块成本估算
   */
  private initializeModuleCosts(): void {
    const costs: ModuleCost[] = [
      // Packages 目录模块
      { moduleId: 'naming-package', estimatedCost: 60, priority: 'high', categories: ['naming'] },
      { moduleId: 'api-component', estimatedCost: 150, priority: 'medium', categories: ['api'] },

      // Apps 目录模块
      { moduleId: 'naming-app', estimatedCost: 50, priority: 'high', categories: ['naming'] },
      { moduleId: 'content-app', estimatedCost: 120, priority: 'medium', categories: ['content'] },

      // 通用模块
      { moduleId: 'structure-common', estimatedCost: 40, priority: 'low', categories: ['structure'] }
    ]

    costs.forEach(cost => {
      this.moduleCosts.set(cost.moduleId, cost)
    })
  }

  /**
   * 优化检测模块选择
   */
  optimizeModules(
    modules: DetectionModule[],
    context: DetectionContext
  ): DetectionModule[] {
    if (this.strategy.enableLightweightMode) {
      return this.applyLightweightMode(modules, context)
    }

    return this.applyStandardOptimization(modules, context)
  }

  /**
   * 轻量级模式优化
   */
  private applyLightweightMode(
    modules: DetectionModule[],
    context: DetectionContext
  ): DetectionModule[] {
    // 根据操作类型过滤模块
    let filteredModules = this.filterByOperationType(modules, context)

    // 根据文件大小调整
    filteredModules = this.filterByFileSize(filteredModules, context)

    // 按优先级排序
    filteredModules = this.sortByPriority(filteredModules)

    // 在 token 预算内选择模块
    return this.selectWithinTokenBudget(filteredModules)
  }

  /**
   * 标准优化模式
   */
  private applyStandardOptimization(
    modules: DetectionModule[],
    context: DetectionContext
  ): DetectionModule[] {
    // 标准模式下运行所有模块，但进行优先级排序
    return this.sortByPriority(modules)
  }

  /**
   * 根据操作类型过滤模块
   */
  private filterByOperationType(
    modules: DetectionModule[],
    context: DetectionContext
  ): DetectionModule[] {
    const { operation } = context

    // 对于删除操作，只运行结构检测
    if (operation === 'delete') {
      return modules.filter(m =>
        this.moduleCosts.get(m.id)?.categories.includes('structure') ||
        m.id === 'structure-common'
      )
    }

    // 对于创建操作，优先运行命名和结构检测
    if (operation === 'create') {
      return modules.filter(m => {
        const cost = this.moduleCosts.get(m.id)
        return cost && (cost.categories.includes('naming') || cost.categories.includes('structure'))
      })
    }

    return modules
  }

  /**
   * 根据文件大小过滤模块
   */
  private filterByFileSize(
    modules: DetectionModule[],
    context: DetectionContext
  ): DetectionModule[] {
    const { content } = context

    if (!content) {
      return modules
    }

    const fileSize = content.length

    // 大文件跳过内容检测
    if (fileSize > 20000) { // 20KB
      return modules.filter(m => {
        const cost = this.moduleCosts.get(m.id)
        return cost && !cost.categories.includes('content')
      })
    }

    return modules
  }

  /**
   * 按优先级排序
   */
  private sortByPriority(modules: DetectionModule[]): DetectionModule[] {
    const priorityOrder = { high: 0, medium: 1, low: 2 }

    return modules.sort((a, b) => {
      const costA = this.moduleCosts.get(a.id)
      const costB = this.moduleCosts.get(b.id)

      if (!costA) return 1
      if (!costB) return -1

      const priorityA = priorityOrder[costA.priority]
      const priorityB = priorityOrder[costB.priority]

      return priorityA - priorityB
    })
  }

  /**
   * 在 token 预算内选择模块
   */
  private selectWithinTokenBudget(modules: DetectionModule[]): DetectionModule[] {
    const result: DetectionModule[] = []
    let totalCost = 0

    for (const module of modules) {
      const cost = this.moduleCosts.get(module.id)?.estimatedCost || 100

      if (totalCost + cost <= this.strategy.maxTokensPerOperation) {
        result.push(module)
        totalCost += cost
      }
    }

    return result
  }

  /**
   * 估算 token 消耗
   */
  estimateTokenCost(modules: DetectionModule[]): number {
    return modules.reduce((total, module) => {
      const cost = this.moduleCosts.get(module.id)?.estimatedCost || 100
      return total + cost
    }, 0)
  }

  /**
   * 更新优化策略
   */
  updateStrategy(newStrategy: Partial<TokenOptimizationStrategy>): void {
    this.strategy = { ...this.strategy, ...newStrategy }
  }

  /**
   * 获取当前策略
   */
  getStrategy(): TokenOptimizationStrategy {
    return { ...this.strategy }
  }

  /**
   * 获取模块成本信息
   */
  getModuleCosts(): ModuleCost[] {
    return Array.from(this.moduleCosts.values())
  }
}

// 创建全局 token 优化器实例
export const globalTokenOptimizer = new TokenOptimizer()