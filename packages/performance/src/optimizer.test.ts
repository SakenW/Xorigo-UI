/**
 * Performance Optimizer 测试
 */

import { describe, it, expect } from 'vitest'
import { PerformanceOptimizer } from './optimizer'

describe('PerformanceOptimizer', () => {
  it('should create optimizer instance', () => {
    const optimizer = new PerformanceOptimizer()
    expect(optimizer).toBeDefined()
  })

  it('should generate optimization strategies', () => {
    const optimizer = new PerformanceOptimizer()

    const strategies = optimizer.generateOptimizations([], [], [], [])
    expect(Array.isArray(strategies)).toBe(true)
  })

  it('should generate optimization report', () => {
    const optimizer = new PerformanceOptimizer()
    const report = optimizer.generateOptimizationReport()
    expect(report).toContain('Xorigo UI 性能优化报告')
  })

  it('should export optimization config', () => {
    const optimizer = new PerformanceOptimizer()
    const config = optimizer.exportOptimizationConfig()
    expect(config).toBeDefined()
    expect(typeof config).toBe('string')
  })

  it('should generate memoization suggestions', () => {
    const optimizer = new PerformanceOptimizer()

    const analysis = [{
      componentName: 'TestComponent',
      instanceId: 'instance-1',
      renderCount: 150,
      unnecessaryRenders: 50,
      renderReasons: [{ reason: 'props_change', count: 50, percentage: 33.33 }],
      wastefulRenders: [],
      suggestions: ['Use React.memo'],
      canBeOptimized: true,
      optimizationPotential: 75
    }]

    const suggestions = optimizer.generateMemoizationSuggestions(analysis)
    expect(suggestions).toHaveLength(1)
    expect(suggestions[0].componentName).toBe('TestComponent')
  })

  it('should dispose correctly', () => {
    const optimizer = new PerformanceOptimizer()
    optimizer.dispose()
    expect(optimizer).toBeDefined()
  })
})
