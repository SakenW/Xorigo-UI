/**
 * 调试工具核心引擎
 * 提供性能监控、依赖分析、错误检测等核心功能
 */

import { PerformanceMetrics, DependencyGraph, ErrorReport, HotReloadMetrics } from '../types/debug';

// 性能监控器
export class PerformanceProfiler {
  private observers: PerformanceObserver[] = [];
  private metrics: PerformanceMetrics[] = [];
  private componentMetrics: Map<string, PerformanceMetrics> = new Map();

  constructor() {
    this.setupObservers();
  }

  private setupObservers() {
    // 监控渲染性能
    const renderObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'measure') {
          this.recordMetric({
            name: entry.name,
            startTime: entry.startTime,
            duration: entry.duration,
            type: 'render',
            timestamp: Date.now()
          });
        }
      });
    });

    renderObserver.observe({ entryTypes: ['measure'] });
    this.observers.push(renderObserver);

    // 监控长任务
    const longTaskObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.recordMetric({
          name: 'long-task',
          startTime: entry.startTime,
          duration: entry.duration,
          type: 'long-task',
          timestamp: Date.now()
        });
      });
    });

    try {
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.push(longTaskObserver);
    } catch (e) {
      console.warn('Long task observation not supported');
    }
  }

  public startMeasure(name: string) {
    performance.mark(`${name}-start`);
  }

  public endMeasure(name: string, componentName?: string) {
    try {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);

      const measure = performance.getEntriesByName(name, 'measure')[0];
      if (measure) {
        const metric: PerformanceMetrics = {
          name,
          startTime: measure.startTime,
          duration: measure.duration,
          type: 'component',
          timestamp: Date.now(),
          componentName
        };

        this.recordMetric(metric);
        if (componentName) {
          this.componentMetrics.set(componentName, metric);
        }
      }
    } catch (e) {
      console.warn(`Failed to measure ${name}:`, e);
    }
  }

  private recordMetric(metric: PerformanceMetrics) {
    this.metrics.push(metric);
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-500); // 保留最近500条记录
    }
  }

  public getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  public getComponentMetrics(componentName: string): PerformanceMetrics | undefined {
    return this.componentMetrics.get(componentName);
  }

  public getPerformanceReport() {
    const report = {
      totalMeasures: this.metrics.length,
      averageRenderTime: 0,
      slowComponents: [] as Array<{ name: string; duration: number; type: string }>,
      longTasks: this.metrics.filter(m => m.type === 'long-task'),
      timeline: this.metrics.map(m => ({
        name: m.name,
        duration: m.duration,
        timestamp: m.timestamp,
        type: m.type
      }))
    };

    const componentMetrics = this.metrics.filter(m => m.type === 'component');
    if (componentMetrics.length > 0) {
      report.averageRenderTime = componentMetrics.reduce((sum, m) => sum + m.duration, 0) / componentMetrics.length;

      // 找出慢组件
      const threshold = report.averageRenderTime * 2;
      report.slowComponents = componentMetrics
        .filter(m => m.duration > threshold)
        .map(m => ({
          name: m.componentName || m.name,
          duration: m.duration,
          type: m.name
        }))
        .sort((a, b) => b.duration - a.duration);
    }

    return report;
  }

  public destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics = [];
    this.componentMetrics.clear();
  }
}

// 依赖关系分析器
export class DependencyAnalyzer {
  private dependencyGraph: DependencyGraph = {
    nodes: [],
    edges: []
  };

  public analyzeDependencies(components: any[]): DependencyGraph {
    this.dependencyGraph = {
      nodes: [],
      edges: []
    };

    // 分析每个组件的依赖
    components.forEach(component => {
      this.addNode(component.name, component.type || 'component');

      if (component.dependencies) {
        component.dependencies.forEach((dep: string) => {
          this.addEdge(component.name, dep, 'imports');
        });
      }

      if (component.children) {
        component.children.forEach((child: string) => {
          this.addEdge(component.name, child, 'composition');
        });
      }
    });

    return this.dependencyGraph;
  }

  private addNode(name: string, type: string) {
    if (!this.dependencyGraph.nodes.find(n => n.id === name)) {
      this.dependencyGraph.nodes.push({
        id: name,
        label: name,
        type,
        metadata: {}
      });
    }
  }

  private addEdge(from: string, to: string, type: string) {
    this.addNode(to, 'component');

    const existingEdge = this.dependencyGraph.edges.find(
      e => e.source === from && e.target === to
    );

    if (!existingEdge) {
      this.dependencyGraph.edges.push({
        source: from,
        target: to,
        type,
        weight: 1
      });
    }
  }

  public detectCircularDependencies(): string[][] {
    const cycles: string[][] = [];
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const path: string[] = [];

    const dfs = (nodeId: string): boolean => {
      if (recursionStack.has(nodeId)) {
        // 找到循环
        const cycleStart = path.indexOf(nodeId);
        cycles.push([...path.slice(cycleStart), nodeId]);
        return true;
      }

      if (visited.has(nodeId)) return false;

      visited.add(nodeId);
      recursionStack.add(nodeId);
      path.push(nodeId);

      const edges = this.dependencyGraph.edges.filter(e => e.source === nodeId);
      for (const edge of edges) {
        if (dfs(edge.target)) return true;
      }

      recursionStack.delete(nodeId);
      path.pop();
      return false;
    };

    this.dependencyGraph.nodes.forEach(node => {
      if (!visited.has(node.id)) {
        dfs(node.id);
      }
    });

    return cycles;
  }

  public getDependencyTree(root: string): any {
    const visited = new Set<string>();

    const buildTree = (nodeId: string): any => {
      if (visited.has(nodeId)) return { id: nodeId, circular: true };
      visited.add(nodeId);

      const children = this.dependencyGraph.edges
        .filter(e => e.source === nodeId)
        .map(e => buildTree(e.target));

      return {
        id: nodeId,
        children,
        dependencyCount: children.length
      };
    };

    return buildTree(root);
  }

  public getGraph(): DependencyGraph {
    return { ...this.dependencyGraph };
  }
}

// 错误边界检测器
export class ErrorBoundaryDetector {
  private errors: ErrorReport[] = [];
  private errorCounts: Map<string, number> = new Map();

  public captureError(error: Error, errorInfo?: any, context?: any): ErrorReport {
    const errorReport: ErrorReport = {
      id: this.generateErrorId(),
      message: error.message,
      stack: error.stack || '',
      timestamp: Date.now(),
      type: this.categorizeError(error),
      severity: this.determineSeverity(error),
      context,
      errorInfo,
      count: 1
    };

    // 更新错误计数
    const key = `${error.message}:${error.name}`;
    const currentCount = this.errorCounts.get(key) || 0;
    this.errorCounts.set(key, currentCount + 1);
    errorReport.count = currentCount + 1;

    this.errors.push(errorReport);
    if (this.errors.length > 100) {
      this.errors = this.errors.slice(-50); // 保留最近50个错误
    }

    return errorReport;
  }

  private generateErrorId(): string {
    return `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private categorizeError(error: Error): string {
    if (error instanceof TypeError) return 'TypeError';
    if (error instanceof ReferenceError) return 'ReferenceError';
    if (error instanceof SyntaxError) return 'SyntaxError';
    if (error instanceof RangeError) return 'RangeError';
    if (error.message.includes('Network')) return 'NetworkError';
    if (error.message.includes('Render')) return 'RenderError';
    return 'UnknownError';
  }

  private determineSeverity(error: Error): 'low' | 'medium' | 'high' | 'critical' {
    if (error instanceof SyntaxError) return 'critical';
    if (error instanceof TypeError && error.message.includes('Cannot read')) return 'high';
    if (error.message.includes('Network')) return 'medium';
    return 'low';
  }

  public getErrorReport() {
    const errorStats = {
      total: this.errors.length,
      byType: {} as Record<string, number>,
      bySeverity: { low: 0, medium: 0, high: 0, critical: 0 },
      recent: this.errors.slice(0, 10),
      frequent: Array.from(this.errorCounts.entries())
        .filter(([, count]) => count > 1)
        .map(([key, count]) => {
          const [message, name] = key.split(':');
          return { message, name, count };
        })
        .sort((a, b) => b.count - a.count)
    };

    this.errors.forEach(error => {
      errorStats.byType[error.type] = (errorStats.byType[error.type] || 0) + 1;
      errorStats.bySeverity[error.severity]++;
    });

    return errorStats;
  }

  public clearErrors() {
    this.errors = [];
    this.errorCounts.clear();
  }

  public getErrors(): ErrorReport[] {
    return [...this.errors];
  }
}

// 热重载监控器
export class HotReloadMonitor {
  private metrics: HotReloadMetrics[] = [];
  private startTime: number = Date.now();

  public recordReload(componentName: string, reloadTime: number, reason: string = 'hot-reload') {
    const metric: HotReloadMetrics = {
      componentName,
      reloadTime,
      timestamp: Date.now(),
      reason,
      type: 'component-update'
    };

    this.metrics.push(metric);
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-50);
    }
  }

  public getHotReloadReport() {
    if (this.metrics.length === 0) {
      return {
        totalReloads: 0,
        averageReloadTime: 0,
        mostReloadedComponents: [],
        reloadFrequency: 0
      };
    }

    const componentReloads = new Map<string, number>();
    let totalTime = 0;

    this.metrics.forEach(metric => {
      componentReloads.set(
        metric.componentName,
        (componentReloads.get(metric.componentName) || 0) + 1
      );
      totalTime += metric.reloadTime;
    });

    const mostReloadedComponents = Array.from(componentReloads.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const sessionDuration = Date.now() - this.startTime;

    return {
      totalReloads: this.metrics.length,
      averageReloadTime: totalTime / this.metrics.length,
      mostReloadedComponents,
      reloadFrequency: (this.metrics.length / sessionDuration) * 1000 * 60, // 每分钟重载次数
      timeline: this.metrics.map(m => ({
        component: m.componentName,
        time: m.reloadTime,
        timestamp: m.timestamp,
        reason: m.reason
      }))
    };
  }

  public clearMetrics() {
    this.metrics = [];
    this.startTime = Date.now();
  }
}

// 导出所有工具类
export const DebugTools = {
  PerformanceProfiler,
  DependencyAnalyzer,
  ErrorBoundaryDetector,
  HotReloadMonitor
};

// 全局调试实例
export const globalProfiler = new PerformanceProfiler();
export const globalDependencyAnalyzer = new DependencyAnalyzer();
export const globalErrorDetector = new ErrorBoundaryDetector();
export const globalHotReloadMonitor = new HotReloadMonitor();