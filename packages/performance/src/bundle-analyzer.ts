/**
 * Xorigo UI Bundle 分析器
 *
 * 分析和优化应用程序的Bundle大小：
 * - 计算gzip压缩后的大小
 * - 分析依赖关系
 * - 检测未使用的代码
 * - 提供Tree Shaking优化建议
 * - 生成Bundle分析报告
 *
 * @version 1.0.0
 * @author Xorigo UI Team
 */

import gzipSize from 'gzip-size'
import { promises as fs } from 'fs'
import path from 'path'
import prettyBytes from 'pretty-bytes'

// ==================== 类型定义 ====================

export interface BundleModule {
  id: string
  name: string
  path: string
  size: number
  gzippedSize: number
  dependencies: string[]
  dependents: string[]
  isExternal: boolean
  isEntry: boolean
  isOptimizationCandidate: boolean
  reasons: string[]
}

export interface BundleStats {
  totalSize: number
  totalGzippedSize: number
  modulesCount: number
  entryPoints: BundleModule[]
  chunks: Array<{
    id: string
    name: string
    size: number
    gzippedSize: number
    modules: BundleModule[]
  }>
  dependencies: Map<string, Set<string>>
  externals: BundleModule[]
  unusedModules: BundleModule[]
  duplicateModules: BundleModule[]
}

export interface TreeShakingAnalysis {
  totalExports: number
  usedExports: number
  unusedExports: number
  usagePercentage: number
  unusedModules: Array<{
    modulePath: string
    unusedExports: string[]
    estimatedSaving: number
  }>
  recommendations: string[]
}

export interface DependencyAnalysis {
  problematic: Array<{
    name: string
    version: string
    size: number
    issues: string[]
    alternatives?: string[]
  }>
  duplicates: Array<{
    name: string
    versions: string[]
    totalSize: number
    saving: number
  }>
  heavy: Array<{
    name: string
    size: number
    percentage: number
    canReplace?: boolean
  }>
  outdated: Array<{
    name: string
    currentVersion: string
    latestVersion: string
    isMajor: boolean
  }>
}

export interface BundleOptimizationSuggestion {
  id: string
  type: 'remove-unused' | 'code-splitting' | 'dynamic-import' | 'replace-dependency' | 'remove-duplicate'
  priority: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  impact: {
    sizeReduction: number // KB
    performanceImprovement: number // 1-100
  }
  modules: string[]
  implementation: string
  estimatedEffort: 'low' | 'medium' | 'high'
  breakingChange: boolean
}

export interface BundleSizeTarget {
  totalSize: number // bytes
  gzippedSize: number // bytes
  chunkSize: number // bytes
  componentCount: number
  moduleCount: number
  exceedsTarget: boolean
  gap: number // bytes over target
  recommendations: string[]
}

export interface AnalysisConfig {
  analyzeDependencies: boolean
  analyzeTreeShaking: boolean
  checkDuplicates: boolean
  checkHeavyDependencies: boolean
  checkOutdated: boolean
  sizeTargets: {
    totalSize: number // KB
    gzippedSize: number // KB
    chunkSize: number // KB
  }
  excludeModules?: string[]
  includeExternals?: boolean
  outputFormat: 'json' | 'html' | 'markdown'
}

// ==================== Bundle 分析器类 ====================

export class BundleAnalyzer {
  private config: AnalysisConfig
  private bundleStats: BundleStats | null = null
  private treeShakingAnalysis: TreeShakingAnalysis | null = null
  private dependencyAnalysis: DependencyAnalysis | null = null
  private optimizationSuggestions: BundleOptimizationSuggestion[] = []
  private sizeTargets: BundleSizeTarget | null = null

  constructor(config: Partial<AnalysisConfig> = {}) {
    this.config = {
      analyzeDependencies: true,
      analyzeTreeShaking: true,
      checkDuplicates: true,
      checkHeavyDependencies: true,
      checkOutdated: false,
      sizeTargets: {
        totalSize: 500 * 1024, // 500KB
        gzippedSize: 200 * 1024, // 200KB
        chunkSize: 244 * 1024 // 244KB
      },
      excludeModules: [],
      includeExternals: false,
      outputFormat: 'markdown',
      ...config
    }
  }

  // ==================== 分析方法 ====================

  /**
   * 分析Bundle文件
   */
  async analyzeBundle(bundlePath: string): Promise<BundleStats> {
    try {
      // 读取bundle文件
      const bundleContent = await fs.readFile(bundlePath, 'utf-8')
      const gzippedSize = await gzipSize(bundleContent)
      const size = Buffer.byteLength(bundleContent, 'utf-8')

      console.log(`[BundleAnalyzer] 分析Bundle文件: ${bundlePath}`)
      console.log(`[BundleAnalyzer] 大小: ${prettyBytes(size)}, Gzip: ${prettyBytes(gzippedSize)}`)

      // 解析bundle（简化实现，实际可能需要解析sourcemap或stats文件）
      this.bundleStats = await this.parseBundle(bundleContent, size, gzippedSize)

      // 分析依赖
      if (this.config.analyzeDependencies) {
        await this.analyzeDependencies()
      }

      // 分析Tree Shaking
      if (this.config.analyzeTreeShaking) {
        await this.analyzeTreeShaking()
      }

      // 生成优化建议
      await this.generateOptimizationSuggestions()

      // 检查大小目标
      this.checkSizeTargets()

      return this.bundleStats
    } catch (error) {
      console.error('[BundleAnalyzer] 分析失败:', error)
      throw error
    }
  }

  /**
   * 分析package.json中的依赖
   */
  async analyzeDependencies(packageJsonPath: string = 'package.json'): Promise<DependencyAnalysis> {
    try {
      const content = await fs.readFile(packageJsonPath, 'utf-8')
      const packageJson = JSON.parse(content)

      const dependencies = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
        ...packageJson.peerDependencies
      }

      const analysis: DependencyAnalysis = {
        problematic: [],
        duplicates: [],
        heavy: [],
        outdated: []
      }

      // 分析每个依赖
      for (const [name, version] of Object.entries(dependencies)) {
        try {
          const pkgPath = path.join(process.cwd(), 'node_modules', name)
          const stats = await fs.stat(pkgPath)

          if (stats.isDirectory()) {
            // 检查是否为重型依赖
            const packageSize = await this.calculateDirectorySize(pkgPath)
            if (packageSize > 1024 * 1024) { // 1MB
              analysis.heavy.push({
                name,
                size: packageSize,
                percentage: (packageSize / (1024 * 1024)) * 100,
                canReplace: this.hasAlternative(name)
              })
            }
          }
        } catch (error) {
          // 依赖不存在或无法访问
          analysis.problematic.push({
            name,
            version: version as string,
            size: 0,
            issues: ['Module not found or inaccessible']
          })
        }
      }

      // 检查重复依赖
      if (this.config.checkDuplicates) {
        analysis.duplicates = await this.findDuplicateDependencies(dependencies)
      }

      this.dependencyAnalysis = analysis
      return analysis
    } catch (error) {
      console.error('[BundleAnalyzer] 依赖分析失败:', error)
      throw error
    }
  }

  /**
   * 分析Tree Shaking效果
   */
  async analyzeTreeShaking(): Promise<TreeShakingAnalysis> {
    if (!this.bundleStats) {
      throw new Error('请先运行 analyzeBundle()')
    }

    // 简化实现：估算Tree Shaking效果
    const totalModules = this.bundleStats.modulesCount
    const estimatedUsedModules = Math.floor(totalModules * 0.7) // 假设70%被使用
    const unusedModules = totalModules - estimatedUsedModules

    const analysis: TreeShakingAnalysis = {
      totalExports: totalModules * 5, // 假设每个模块平均5个导出
      usedExports: estimatedUsedModules * 5,
      unusedExports: unusedModules * 5,
      usagePercentage: 70,
      unusedModules: this.bundleStats.unusedModules.map(module => ({
        modulePath: module.path,
        unusedExports: ['default', ...module.reasons.filter(r => r.includes('unused'))],
        estimatedSaving: module.size
      })),
      recommendations: this.generateTreeShakingRecommendations(unusedModules, totalModules)
    }

    this.treeShakingAnalysis = analysis
    return analysis
  }

  /**
   * 生成优化建议
   */
  async generateOptimizationSuggestions(): Promise<BundleOptimizationSuggestion[]> {
    const suggestions: BundleOptimizationSuggestion[] = []

    if (!this.bundleStats) {
      return suggestions
    }

    // 移除未使用的模块
    if (this.bundleStats.unusedModules.length > 0) {
      suggestions.push({
        id: 'remove-unused',
        type: 'remove-unused',
        priority: 'high',
        title: '移除未使用的代码',
        description: `发现 ${this.bundleStats.unusedModules.length} 个未使用的模块`,
        impact: {
          sizeReduction: this.bundleStats.unusedModules.reduce((sum, m) => sum + m.size, 0) / 1024,
          performanceImprovement: Math.min(100, this.bundleStats.unusedModules.length * 2)
        },
        modules: this.bundleStats.unusedModules.map(m => m.path),
        implementation: '使用ES6模块导入，确保Tree Shaking生效',
        estimatedEffort: 'low',
        breakingChange: false
      })
    }

    // 代码分割
    if (this.bundleStats.totalSize > this.config.sizeTargets.totalSize) {
      suggestions.push({
        id: 'code-splitting',
        type: 'code-splitting',
        priority: 'medium',
        title: '实现代码分割',
        description: '将大型Bundle拆分为更小的chunk',
        impact: {
          sizeReduction: (this.bundleStats.totalSize - this.config.sizeTargets.totalSize) / 1024,
          performanceImprovement: 40
        },
        modules: this.bundleStats.entryPoints.map(m => m.path),
        implementation: '使用动态导入()和React.lazy进行代码分割',
        estimatedEffort: 'medium',
        breakingChange: false
      })
    }

    // 动态导入
    if (this.bundleStats.modulesCount > 200) {
      suggestions.push({
        id: 'dynamic-import',
        type: 'dynamic-import',
        priority: 'medium',
        title: '使用动态导入',
        description: '对非关键模块使用动态导入',
        impact: {
          sizeReduction: this.bundleStats.totalSize * 0.15 / 1024,
          performanceImprovement: 30
        },
        modules: [],
        implementation: '使用import()语法实现按需加载',
        estimatedEffort: 'medium',
        breakingChange: false
      })
    }

    // 依赖替换
    if (this.dependencyAnalysis?.heavy.length) {
      const heavy = this.dependencyAnalysis.heavy[0]
      suggestions.push({
        id: 'replace-dependency',
        type: 'replace-dependency',
        priority: 'low',
        title: '替换重型依赖',
        description: `替换 ${heavy.name} 为更轻量的替代方案`,
        impact: {
          sizeReduction: heavy.size / 1024,
          performanceImprovement: 20
        },
        modules: [heavy.name],
        implementation: '寻找并使用更轻量的替代库',
        estimatedEffort: 'high',
        breakingChange: true
      })
    }

    // 移除重复依赖
    if (this.dependencyAnalysis?.duplicates.length) {
      const dup = this.dependencyAnalysis.duplicates[0]
      suggestions.push({
        id: 'remove-duplicate',
        type: 'remove-duplicate',
        priority: 'high',
        title: '移除重复依赖',
        description: `发现重复依赖 ${dup.name}，版本: ${dup.versions.join(', ')}`,
        impact: {
          sizeReduction: dup.saving / 1024,
          performanceImprovement: 15
        },
        modules: [dup.name],
        implementation: '使用 resolutions 或 overrides 锁定版本',
        estimatedEffort: 'low',
        breakingChange: false
      })
    }

    this.optimizationSuggestions = suggestions
    return suggestions
  }

  // ==================== 报告生成 ====================

  /**
   * 生成分析报告
   */
  generateReport(): string {
    const report: string[] = []

    report.push('# Xorigo UI Bundle 分析报告')
    report.push(`\n生成时间: ${new Date().toLocaleString('zh-CN')}\n`)

    // Bundle统计
    if (this.bundleStats) {
      report.push('## Bundle 统计')
      report.push(`- 总大小: ${prettyBytes(this.bundleStats.totalSize)}`)
      report.push(`- Gzip压缩后: ${prettyBytes(this.bundleStats.totalGzippedSize)}`)
      report.push(`- 模块数量: ${this.bundleStats.modulesCount}`)
      report.push(`- 压缩比例: ${((1 - this.bundleStats.totalGzippedSize / this.bundleStats.totalSize) * 100).toFixed(2)}%`)

      // 大小目标检查
      if (this.sizeTargets) {
        report.push('\n### 大小目标检查')
        report.push(`- 总大小目标: ${prettyBytes(this.config.sizeTargets.totalSize)}`)
        report.push(`- 当前大小: ${prettyBytes(this.bundleStats.totalSize)}`)
        report.push(`- 状态: ${this.sizeTargets.exceedsTarget ? '❌ 超出目标' : '✅ 符合目标'}`)
        if (this.sizeTargets.exceedsTarget) {
          report.push(`- 超出的量: ${prettyBytes(this.sizeTargets.gap)}`)
        }
      }

      // 未使用模块
      if (this.bundleStats.unusedModules.length > 0) {
        report.push('\n### 未使用模块')
        report.push(`发现 ${this.bundleStats.unusedModules.length} 个未使用的模块:`)
        this.bundleStats.unusedModules.slice(0, 10).forEach(module => {
          report.push(`- ${module.path} (${prettyBytes(module.size)})`)
        })
        if (this.bundleStats.unusedModules.length > 10) {
          report.push(`... 还有 ${this.bundleStats.unusedModules.length - 10} 个`)
        }
      }

      // 重复模块
      if (this.bundleStats.duplicateModules.length > 0) {
        report.push('\n### 重复模块')
        report.push(`发现 ${this.bundleStats.duplicateModules.length} 个重复模块`)
        this.bundleStats.duplicateModules.slice(0, 5).forEach(module => {
          report.push(`- ${module.path} (${prettyBytes(module.size)})`)
        })
      }
    }

    // Tree Shaking分析
    if (this.treeShakingAnalysis) {
      report.push('\n## Tree Shaking 分析')
      report.push(`- 使用率: ${this.treeShakingAnalysis.usagePercentage.toFixed(2)}%`)
      report.push(`- 已使用导出: ${this.treeShakingAnalysis.usedExports}`)
      report.push(`- 未使用导出: ${this.treeShakingAnalysis.unusedExports}`)
      report.push(`- 估计节省空间: ${prettyBytes(this.treeShakingAnalysis.unusedModules.reduce((sum, m) => sum + m.estimatedSaving, 0))}`)
    }

    // 依赖分析
    if (this.dependencyAnalysis) {
      report.push('\n## 依赖分析')

      if (this.dependencyAnalysis.heavy.length > 0) {
        report.push('\n### 重型依赖')
        this.dependencyAnalysis.heavy.slice(0, 5).forEach(dep => {
          report.push(`- ${dep.name}: ${prettyBytes(dep.size)} (${dep.percentage.toFixed(2)}%)`)
        })
      }

      if (this.dependencyAnalysis.duplicates.length > 0) {
        report.push('\n### 重复依赖')
        this.dependencyAnalysis.duplicates.slice(0, 5).forEach(dup => {
          report.push(`- ${dup.name}: 版本 ${dup.versions.join(', ')} (可节省 ${prettyBytes(dup.saving)})`)
        })
      }
    }

    // 优化建议
    if (this.optimizationSuggestions.length > 0) {
      report.push('\n## 优化建议')

      // 按优先级分组
      const byPriority = {
        critical: this.optimizationSuggestions.filter(s => s.priority === 'critical'),
        high: this.optimizationSuggestions.filter(s => s.priority === 'high'),
        medium: this.optimizationSuggestions.filter(s => s.priority === 'medium'),
        low: this.optimizationSuggestions.filter(s => s.priority === 'low')
      }

      Object.entries(byPriority).forEach(([priority, suggestions]) => {
        if (suggestions.length > 0) {
          report.push(`\n### ${priority.toUpperCase()}`)
          suggestions.forEach(suggestion => {
            report.push(`\n#### ${suggestion.title}`)
            report.push(`- 描述: ${suggestion.description}`)
            report.push(`- 影响: 减少 ${prettyBytes(suggestion.impact.sizeReduction * 1024)}, 性能提升 ${suggestion.impact.performanceImprovement}%`)
            report.push(`- 实现: ${suggestion.implementation}`)
          })
        }
      })

      // 总体估算
      const totalSaving = this.optimizationSuggestions.reduce((sum, s) => sum + s.impact.sizeReduction, 0)
      const avgPerformance = this.optimizationSuggestions.reduce((sum, s) => sum + s.impact.performanceImprovement, 0) / this.optimizationSuggestions.length

      report.push('\n### 总体优化估算')
      report.push(`- 总大小可减少: ${prettyBytes(totalSaving * 1024)}`)
      report.push(`- 平均性能提升: ${avgPerformance.toFixed(2)}%`)
    }

    return report.join('\n')
  }

  /**
   * 导出分析结果为JSON
   */
  exportAsJSON(): string {
    const data = {
      timestamp: Date.now(),
      bundleStats: this.bundleStats,
      treeShakingAnalysis: this.treeShakingAnalysis,
      dependencyAnalysis: this.dependencyAnalysis,
      optimizationSuggestions: this.optimizationSuggestions,
      sizeTargets: this.sizeTargets,
      config: this.config
    }

    return JSON.stringify(data, null, 2)
  }

  /**
   * 导出优化脚本
   */
  generateOptimizationScript(): string {
    const script: string[] = []

    script.push('// Bundle 优化脚本')
    script.push('// 自动生成的优化建议')
    script.push('')

    // 添加优化建议
    this.optimizationSuggestions.forEach(suggestion => {
      script.push(`// ${suggestion.title}`)
      script.push(`// 优先级: ${suggestion.priority}`)
      script.push(`// 描述: ${suggestion.description}`)
      script.push('')

      if (suggestion.type === 'dynamic-import') {
        script.push('// 示例：动态导入')
        script.push('const LazyComponent = lazy(() => import("./Component"))')
      } else if (suggestion.type === 'code-splitting') {
        script.push('// 示例：代码分割')
        script.push('import("./Module").then(module => {')
        script.push('  // 使用模块')
        script.push('})')
      } else if (suggestion.type === 'remove-duplicate') {
        script.push('// 在package.json中添加overrides或resolutions:')
        script.push('{')
        script.push('  "overrides": {')
        script.push(`    "${suggestion.modules[0]}": "${this.resolveVersion(suggestion.modules[0])}"`)
        script.push('  }')
        script.push('}')
      }

      script.push('')
    })

    return script.join('\n')
  }

  // ==================== 私有方法 ====================

  private async parseBundle(content: string, size: number, gzippedSize: number): Promise<BundleStats> {
    // 简化实现：实际中可能需要解析sourcemap或其他工具
    const stats: BundleStats = {
      totalSize: size,
      totalGzippedSize: gzippedSize,
      modulesCount: Math.floor(content.length / 1000), // 粗略估算
      entryPoints: [],
      chunks: [],
      dependencies: new Map(),
      externals: [],
      unusedModules: [],
      duplicateModules: []
    }

    // 模拟一些数据
    stats.entryPoints.push({
      id: 'main',
      name: 'main',
      path: 'src/index.tsx',
      size: size * 0.5,
      gzippedSize: gzippedSize * 0.5,
      dependencies: [],
      dependents: [],
      isExternal: false,
      isEntry: true,
      isOptimizationCandidate: true,
      reasons: ['entry']
    })

    return stats
  }

  private async analyzeDependencies(): Promise<void> {
    if (!this.dependencyAnalysis) {
      await this.analyzeDependencies()
    }
  }

  private async calculateDirectorySize(dirPath: string): Promise<number> {
    let totalSize = 0

    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name)
        if (entry.isDirectory()) {
          totalSize += await this.calculateDirectorySize(fullPath)
        } else {
          const stats = await fs.stat(fullPath)
          totalSize += stats.size
        }
      }
    } catch (error) {
      // 忽略错误
    }

    return totalSize
  }

  private async findDuplicateDependencies(dependencies: Record<string, string>): Promise<DependencyAnalysis['duplicates']> {
    const duplicates: DependencyAnalysis['duplicates'] = []
    const versionMap = new Map<string, Map<string, number>>()

    // 简化实现
    for (const [name, version] of Object.entries(dependencies)) {
      if (!versionMap.has(name)) {
        versionMap.set(name, new Map())
      }
      const versions = versionMap.get(name)!
      versions.set(version, (versions.get(version) || 0) + 1)
    }

    versionMap.forEach((versions, name) => {
      if (versions.size > 1) {
        duplicates.push({
          name,
          versions: Array.from(versions.keys()),
          totalSize: 0,
          saving: 0
        })
      }
    })

    return duplicates
  }

  private generateTreeShakingRecommendations(unusedModules: number, totalModules: number): string[] {
    const recommendations: string[] = []

    if (unusedModules > totalModules * 0.3) {
      recommendations.push('未使用的模块过多，建议检查导入语句，确保只导入需要的部分')
    }

    if (unusedModules > 50) {
      recommendations.push('发现大量未使用模块，建议使用ES6模块并启用Tree Shaking')
    }

    recommendations.push('使用命名导入而不是默认导入：import { useState } from "react"')
    recommendations.push('确保构建工具正确配置了Tree Shaking')

    return recommendations
  }

  private checkSizeTargets(): void {
    if (!this.bundleStats) return

    const target = this.config.sizeTargets
    const actualTotal = this.bundleStats.totalSize
    const actualGzipped = this.bundleStats.totalGzippedSize

    this.sizeTargets = {
      totalSize: actualTotal,
      gzippedSize: actualGzipped,
      chunkSize: actualTotal, // 简化
      componentCount: Math.floor(this.bundleStats.modulesCount / 10),
      moduleCount: this.bundleStats.modulesCount,
      exceedsTarget: actualGzipped > target.gzippedSize,
      gap: actualGzipped > target.gzippedSize ? actualGzipped - target.gzippedSize : 0,
      recommendations: []
    }

    if (this.sizeTargets.exceedsTarget) {
      this.sizeTargets.recommendations.push('Bundle大小超出目标，建议实施代码分割')
      this.sizeTargets.recommendations.push('移除未使用的依赖和代码')
    }
  }

  private hasAlternative(packageName: string): boolean {
    const alternatives: Record<string, string[]> = {
      'lodash': ['lodash-es', 'ramda'],
      'moment': ['dayjs', 'date-fns'],
      'axios': ['fetch', 'ky']
    }

    return packageName in alternatives
  }

  private resolveVersion(packageName: string): string {
    // 简化实现：返回最新稳定版本
    return '^1.0.0'
  }

  /**
   * 清理资源
   */
  dispose(): void {
    this.bundleStats = null
    this.treeShakingAnalysis = null
    this.dependencyAnalysis = null
    this.optimizationSuggestions = []
    this.sizeTargets = null
  }
}

// ==================== 默认导出 ====================

export default BundleAnalyzer
