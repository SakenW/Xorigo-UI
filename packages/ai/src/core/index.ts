/**
 * @fileoverview 核心模块导出
 */

export { RecommendationEngine } from './recommendation-engine';
export { ScenarioMatcher } from './scenario-matcher';
export { DependencyAnalyzer } from './dependency-analyzer';

export type {
  ScenarioMatch,
  ScenarioSimilarity,
  RecommendationReason,
  CategoryDistribution,
} from './scenario-matcher';

export type {
  CircularDependency,
  CouplingMetrics,
  ComponentSetRecommendation,
  ComponentDependencyAnalysis,
  OptimizationRecommendation,
  DependencySummary,
  DependencyGraphExport,
  DependencyGraphNode,
  DependencyGraphEdge,
} from './dependency-analyzer';
