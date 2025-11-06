/**
 * @fileoverview 依赖分析器测试
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { DependencyAnalyzer } from '@/core/dependency-analyzer';
import type { ComponentMetadata } from '@/types/recommendation';

describe('DependencyAnalyzer', () => {
  let analyzer: DependencyAnalyzer;
  let mockComponents: ComponentMetadata[];

  beforeEach(() => {
    analyzer = new DependencyAnalyzer();
    mockComponents = [
      {
        name: 'Button',
        category: 'input',
        description: '按钮组件',
        keywords: ['button', 'click'],
        dependencies: ['FormField', 'Icon'],
        usageStats: { count: 100, lastUsed: new Date() },
        complexity: 'low',
        accessibility: 'basic',
        themeSupport: { modes: ['light'], recipes: ['default'], customThemes: false },
      },
      {
        name: 'Input',
        category: 'form',
        description: '输入框',
        keywords: ['input', 'field'],
        dependencies: ['FormField'],
        usageStats: { count: 80, lastUsed: new Date() },
        complexity: 'low',
        accessibility: 'enhanced',
        themeSupport: { modes: ['light'], recipes: ['default'], customThemes: false },
      },
      {
        name: 'FormField',
        category: 'form',
        description: '表单字段基类',
        keywords: ['form', 'field'],
        dependencies: [],
        usageStats: { count: 60, lastUsed: new Date() },
        complexity: 'medium',
        accessibility: 'complete',
        themeSupport: { modes: ['light', 'dark'], recipes: ['default'], customThemes: true },
      },
    ];
  });

  describe('initialize', () => {
    it('应该正确初始化分析器', () => {
      analyzer.initialize(mockComponents);
      expect(analyzer).toBeDefined();
    });
  });

  describe('getAllDependencies', () => {
    beforeEach(() => {
      analyzer.initialize(mockComponents);
    });

    it('应该返回所有传递依赖', () => {
      const deps = analyzer.getAllDependencies('Button');

      expect(deps.has('FormField')).toBe(true);
      expect(deps.has('Icon')).toBe(true);
    });

    it('应该处理无依赖的组件', () => {
      const deps = analyzer.getAllDependencies('FormField');

      expect(deps.size).toBe(0);
    });
  });

  describe('getDependents', () => {
    beforeEach(() => {
      analyzer.initialize(mockComponents);
    });

    it('应该返回依赖组件的所有使用者', () => {
      const dependents = analyzer.getDependents('FormField');

      expect(dependents.has('Button')).toBe(true);
      expect(dependents.has('Input')).toBe(true);
    });
  });

  describe('detectCircularDependencies', () => {
    it('应该检测到循环依赖', () => {
      const componentsWithCycle = [
        ...mockComponents,
        {
          name: 'ComponentA',
          category: 'form' as any,
          description: 'Test',
          keywords: [],
          dependencies: ['ComponentB'],
          usageStats: { count: 1, lastUsed: new Date() },
          complexity: 'low' as any,
          accessibility: 'basic' as any,
          themeSupport: { modes: ['light' as any], recipes: ['default'], customThemes: false },
        },
        {
          name: 'ComponentB',
          category: 'form' as any,
          description: 'Test',
          keywords: [],
          dependencies: ['ComponentA'],
          usageStats: { count: 1, lastUsed: new Date() },
          complexity: 'low' as any,
          accessibility: 'basic' as any,
          themeSupport: { modes: ['light' as any], recipes: ['default'], customThemes: false },
        },
      ];

      const analyzerWithCycle = new DependencyAnalyzer();
      analyzerWithCycle.initialize(componentsWithCycle);

      const cycles = analyzerWithCycle.detectCircularDependencies();

      expect(cycles.length).toBeGreaterThan(0);
    });

    it('应该正确处理无循环依赖的情况', () => {
      analyzer.initialize(mockComponents);

      const cycles = analyzer.detectCircularDependencies();

      expect(cycles.length).toBe(0);
    });
  });

  describe('calculateCoupling', () => {
    beforeEach(() => {
      analyzer.initialize(mockComponents);
    });

    it('应该计算正确的耦合度指标', () => {
      const metrics = analyzer.calculateCoupling('Button');

      expect(metrics.component).toBe('Button');
      expect(metrics.incomingDependencies).toBe(0);
      expect(metrics.outgoingDependencies).toBe(2);
      expect(metrics.totalDependencies).toBe(2);
      expect(metrics.instability).toBe(1);
      expect(['low', 'medium', 'high']).toContain(metrics.couplingLevel);
    });

    it('应该计算不稳定性和抽象度', () => {
      const metrics = analyzer.calculateCoupling('FormField');

      expect(metrics.instability).toBeGreaterThanOrEqual(0);
      expect(metrics.instability).toBeLessThanOrEqual(1);
      expect(metrics.abstractness).toBeGreaterThanOrEqual(0);
      expect(metrics.abstractness).toBeLessThanOrEqual(1);
    });
  });

  describe('findOptimalComponentSet', () => {
    beforeEach(() => {
      analyzer.initialize(mockComponents);
    });

    it('应该找到最优组件组合', () => {
      const required = ['Button', 'Input'];
      const result = analyzer.findOptimalComponentSet(required, 5);

      expect(result.components.length).toBeGreaterThan(0);
      expect(result.score).toBeGreaterThan(0);
      expect(result.recommendations).toBeDefined();
    });
  });

  describe('exportDependencyGraph', () => {
    beforeEach(() => {
      analyzer.initialize(mockComponents);
    });

    it('应该导出依赖图', () => {
      const graph = analyzer.exportDependencyGraph();

      expect(graph.nodes.length).toBe(mockComponents.length);
      expect(graph.edges.length).toBeGreaterThan(0);
      expect(graph.statistics).toBeDefined();
      expect(graph.statistics.totalNodes).toBe(mockComponents.length);
      expect(graph.statistics.totalEdges).toBe(graph.edges.length);
    });
  });

  describe('getDependencySummary', () => {
    beforeEach(() => {
      analyzer.initialize(mockComponents);
    });

    it('应该返回依赖摘要', () => {
      const summary = analyzer.getDependencySummary('Button');

      expect(summary.component).toBe('Button');
      expect(Array.isArray(summary.directDependencies)).toBe(true);
      expect(Array.isArray(summary.transitiveDependencies)).toBe(true);
      expect(summary.metrics).toBeDefined();
      expect(Array.isArray(summary.recommendations)).toBe(true);
    });
  });
});
