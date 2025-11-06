/**
 * @fileoverview 组件依赖关系分析器
 * @description 分析组件间的依赖关系，生成依赖图，检测循环依赖和优化建议
 */

import type {
  ComponentMetadata,
  DependencyEdge,
  ComponentCategory,
} from '@/types/recommendation';

export class DependencyAnalyzer {
  private components: Map<string, ComponentMetadata> = new Map();
  private dependencyGraph: Map<string, Set<string>> = new Map();
  private reverseGraph: Map<string, Set<string>> = new Map();

  /**
   * 初始化分析器
   */
  initialize(components: ComponentMetadata[]): void {
    this.components.clear();
    this.dependencyGraph.clear();
    this.reverseGraph.clear();

    components.forEach(component => {
      this.components.set(component.name, component);
      this.dependencyGraph.set(component.name, new Set());
      this.reverseGraph.set(component.name, new Set());
    });

    this.buildDependencyGraph(components);
  }

  /**
   * 构建依赖图
   */
  private buildDependencyGraph(components: ComponentMetadata[]): void {
    components.forEach(component => {
      component.dependencies.forEach(dep => {
        if (this.components.has(dep)) {
          this.dependencyGraph.get(component.name)?.add(dep);
          this.reverseGraph.get(dep)?.add(component.name);
        }
      });
    });
  }

  /**
   * 获取组件的所有依赖（包括传递依赖）
   */
  getAllDependencies(componentName: string, visited: Set<string> = new Set()): Set<string> {
    const dependencies = new Set<string>();

    if (visited.has(componentName)) {
      return dependencies;
    }
    visited.add(componentName);

    const directDeps = this.dependencyGraph.get(componentName);
    if (!directDeps) return dependencies;

    directDeps.forEach(dep => {
      dependencies.add(dep);
      this.getAllDependencies(dep, visited).forEach(transitiveDep => {
        dependencies.add(transitiveDep);
      });
    });

    return dependencies;
  }

  /**
   * 获取依赖组件的所有使用者
   */
  getDependents(componentName: string): Set<string> {
    return this.reverseGraph.get(componentName) || new Set();
  }

  /**
   * 检测循环依赖
   */
  detectCircularDependencies(): CircularDependency[] {
    const cycles: CircularDependency[] = [];
    const visited: Set<string> = new Set();
    const recursionStack: Set<string> = new Set();
    const path: string[] = [];

    const dfs = (node: string): void => {
      if (recursionStack.has(node)) {
        const cycleStart = path.indexOf(node);
        if (cycleStart !== -1) {
          const cycle = path.slice(cycleStart);
          cycles.push({
            components: cycle,
            length: cycle.length,
            severity: cycle.length > 3 ? 'high' : 'medium',
          });
        }
        return;
      }

      if (visited.has(node)) return;

      visited.add(node);
      recursionStack.add(node);
      path.push(node);

      const dependencies = this.dependencyGraph.get(node);
      dependencies?.forEach(dep => {
        dfs(dep);
      });

      recursionStack.delete(node);
      path.pop();
    };

    this.components.forEach((_, componentName) => {
      if (!visited.has(componentName)) {
        dfs(componentName);
      }
    });

    return cycles;
  }

  /**
   * 计算组件的耦合度
   */
  calculateCoupling(componentName: string): CouplingMetrics {
    const incoming = this.getDependents(componentName).size;
    const outgoing = this.dependencyGraph.get(componentName)?.size || 0;
    const total = incoming + outgoing;

    const instability = total > 0 ? outgoing / total : 1;
    const abstractness = this.calculateAbstractness(componentName);

    return {
      component: componentName,
      incomingDependencies: incoming,
      outgoingDependencies: outgoing,
      totalDependencies: total,
      instability,
      abstractness,
      distanceFromMainSequence: Math.abs(abstractness + instability - 1),
      couplingLevel: this.getCouplingLevel(total),
    };
  }

  /**
   * 计算组件的抽象度
   */
  private calculateAbstractness(componentName: string): number {
    const component = this.components.get(componentName);
    if (!component) return 0;

    let score = 0;
    if (component.keywords.includes('abstract')) score += 0.3;
    if (component.keywords.includes('base')) score += 0.2;
    if (component.keywords.includes('interface')) score += 0.3;
    if (component.keywords.includes('utility')) score += 0.2;

    return Math.min(score, 1);
  }

  /**
   * 获取耦合度等级
   */
  private getCouplingLevel(total: number): 'low' | 'medium' | 'high' {
    if (total <= 3) return 'low';
    if (total <= 7) return 'medium';
    return 'high';
  }

  /**
   * 查找最优组件组合
   */
  findOptimalComponentSet(requiredComponents: string[], maxSize: number = 10): ComponentSetRecommendation {
    const allComponents = Array.from(this.components.keys());
    const validCombinations = this.generateCombinations(allComponents, maxSize);

    let bestScore = -1;
    let bestCombination: string[] = [];

    validCombinations.forEach(combination => {
      if (this.hasRequiredComponents(combination, requiredComponents)) {
        const score = this.evaluateComponentSet(combination);
        if (score > bestScore) {
          bestScore = score;
          bestCombination = combination;
        }
      }
    });

    return {
      components: bestCombination,
      score: bestScore,
      dependencies: this.analyzeDependencies(bestCombination),
      recommendations: this.generateRecommendations(bestCombination),
    };
  }

  /**
   * 生成组件组合
   */
  private generateCombinations(
    components: string[],
    maxSize: number,
    current: string[] = []
  ): string[][] {
    if (current.length === maxSize) return [current];

    const results: string[][] = [];
    const startIndex = components.indexOf(current[current.length - 1]) + 1;

    for (let i = startIndex; i < components.length; i++) {
      results.push(
        ...this.generateCombinations(components, maxSize, [...current, components[i]])
      );
    }

    return results;
  }

  /**
   * 检查是否包含必需组件
   */
  private hasRequiredComponents(combination: string[], required: string[]): boolean {
    return required.every(req => combination.includes(req));
  }

  /**
   * 评估组件组合
   */
  private evaluateComponentSet(components: string[]): number {
    let score = 0;

    components.forEach(componentName => {
      const metrics = this.calculateCoupling(componentName);

      score += metrics.couplingLevel === 'low' ? 30 :
               metrics.couplingLevel === 'medium' ? 20 : 5;

      const component = this.components.get(componentName);
      if (component) {
        score += component.usageStats.count * 2;
      }
    });

    const dependencies = this.calculateTotalDependencies(components);
    score -= dependencies * 5;

    return score;
  }

  /**
   * 计算总依赖数
   */
  private calculateTotalDependencies(components: string[]): number {
    let total = 0;
    components.forEach(comp => {
      total += this.dependencyGraph.get(comp)?.size || 0;
    });
    return total;
  }

  /**
   * 分析依赖关系
   */
  private analyzeDependencies(components: string[]): ComponentDependencyAnalysis {
    const internalDeps: DependencyEdge[] = [];
    const externalDeps: string[] = [];
    const criticalPath: string[] = [];

    components.forEach(comp => {
      const deps = this.dependencyGraph.get(comp) || new Set();
      deps.forEach(dep => {
        if (components.includes(dep)) {
          internalDeps.push({
            from: comp,
            to: dep,
            type: 'required',
            weight: 1,
          });
        } else {
          externalDeps.push(dep);
        }
      });
    });

    const cycles = this.detectCircularDependencies();

    return {
      internalDependencies: internalDeps,
      externalDependencies: externalDeps,
      hasCycles: cycles.length > 0,
      cycles,
      criticalPath,
      complexity: this.calculateSetComplexity(components),
    };
  }

  /**
   * 计算组件集复杂度
   */
  private calculateSetComplexity(components: string[]): 'low' | 'medium' | 'high' {
    let totalDeps = 0;
    let highCouplingCount = 0;

    components.forEach(comp => {
      const metrics = this.calculateCoupling(comp);
      totalDeps += metrics.totalDependencies;
      if (metrics.couplingLevel === 'high') {
        highCouplingCount++;
      }
    });

    const avgDeps = totalDeps / components.length;
    const highCouplingRatio = highCouplingCount / components.length;

    if (avgDeps > 5 || highCouplingRatio > 0.5) return 'high';
    if (avgDeps > 3 || highCouplingRatio > 0.3) return 'medium';
    return 'low';
  }

  /**
   * 生成优化建议
   */
  private generateRecommendations(components: string[]): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];

    const cycles = this.detectCircularDependencies();
    if (cycles.length > 0) {
      recommendations.push({
        type: 'circular-dependency',
        severity: 'high',
        message: `检测到 ${cycles.length} 个循环依赖，建议重构组件结构`,
        components: cycles.flatMap(c => c.components),
      });
    }

    components.forEach(comp => {
      const metrics = this.calculateCoupling(comp);
      if (metrics.couplingLevel === 'high') {
        recommendations.push({
          type: 'high-coupling',
          severity: 'medium',
          message: `${comp} 耦合度过高，建议拆分或抽象`,
          components: [comp],
        });
      }
    });

    const unusedComponents = this.findUnusedComponents(components);
    if (unusedComponents.length > 0) {
      recommendations.push({
        type: 'unused-component',
        severity: 'low',
        message: `存在 ${unusedComponents.length} 个未使用的组件`,
        components: unusedComponents,
      });
    }

    return recommendations;
  }

  /**
   * 查找未使用的组件
   */
  private findUnusedComponents(components: string[]): string[] {
    return components.filter(comp => {
      const dependents = this.getDependents(comp);
      return dependents.size === 0 && this.dependencyGraph.get(comp)?.size === 0;
    });
  }

  /**
   * 获取组件的依赖关系摘要
   */
  getDependencySummary(componentName: string): DependencySummary {
    const metrics = this.calculateCoupling(componentName);
    const allDeps = this.getAllDependencies(componentName);
    const dependents = this.getDependents(componentName);

    return {
      component: componentName,
      directDependencies: Array.from(this.dependencyGraph.get(componentName) || []),
      transitiveDependencies: Array.from(allDeps),
      dependents: Array.from(dependents),
      metrics,
      recommendations: this.generateRecommendations([componentName]),
    };
  }

  /**
   * 导出依赖图
   */
  exportDependencyGraph(): DependencyGraphExport {
    const nodes = Array.from(this.components.keys()).map(name => {
      const metrics = this.calculateCoupling(name);
      return {
        id: name,
        label: name,
        category: this.components.get(name)?.category || 'unknown',
        metrics,
      };
    });

    const edges: DependencyGraphEdge[] = [];
    this.dependencyGraph.forEach((deps, from) => {
      deps.forEach(to => {
        edges.push({
          from,
          to,
          weight: 1,
        });
      });
    });

    return {
      nodes,
      edges,
      statistics: {
        totalNodes: nodes.length,
        totalEdges: edges.length,
        averageDeps: edges.length / nodes.length,
        maxDeps: Math.max(...nodes.map(n => n.metrics.totalDependencies)),
      },
    };
  }
}

/**
 * 类型定义
 */
export interface CircularDependency {
  components: string[];
  length: number;
  severity: 'low' | 'medium' | 'high';
}

export interface CouplingMetrics {
  component: string;
  incomingDependencies: number;
  outgoingDependencies: number;
  totalDependencies: number;
  instability: number;
  abstractness: number;
  distanceFromMainSequence: number;
  couplingLevel: 'low' | 'medium' | 'high';
}

export interface ComponentSetRecommendation {
  components: string[];
  score: number;
  dependencies: ComponentDependencyAnalysis;
  recommendations: OptimizationRecommendation[];
}

export interface ComponentDependencyAnalysis {
  internalDependencies: DependencyEdge[];
  externalDependencies: string[];
  hasCycles: boolean;
  cycles: CircularDependency[];
  criticalPath: string[];
  complexity: 'low' | 'medium' | 'high';
}

export interface OptimizationRecommendation {
  type: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  components: string[];
}

export interface DependencySummary {
  component: string;
  directDependencies: string[];
  transitiveDependencies: string[];
  dependents: string[];
  metrics: CouplingMetrics;
  recommendations: OptimizationRecommendation[];
}

export interface DependencyGraphExport {
  nodes: DependencyGraphNode[];
  edges: DependencyGraphEdge[];
  statistics: {
    totalNodes: number;
    totalEdges: number;
    averageDeps: number;
    maxDeps: number;
  };
}

export interface DependencyGraphNode {
  id: string;
  label: string;
  category: ComponentCategory;
  metrics: CouplingMetrics;
}

export interface DependencyGraphEdge {
  from: string;
  to: string;
  weight: number;
}
