/**
 * 调试工具类型定义
 */

export interface PerformanceMetrics {
  name: string;
  startTime: number;
  duration: number;
  type: 'component' | 'render' | 'long-task' | 'effect' | 'layout';
  timestamp: number;
  componentName?: string;
  metadata?: Record<string, any>;
}

export interface DependencyNode {
  id: string;
  label: string;
  type: string;
  metadata: Record<string, any>;
}

export interface DependencyEdge {
  source: string;
  target: string;
  type: 'imports' | 'composition' | 'inheritance' | 'props';
  weight: number;
}

export interface DependencyGraph {
  nodes: DependencyNode[];
  edges: DependencyEdge[];
}

export interface ErrorReport {
  id: string;
  message: string;
  stack: string;
  timestamp: number;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: any;
  errorInfo?: any;
  count: number;
}

export interface HotReloadMetrics {
  componentName: string;
  reloadTime: number;
  timestamp: number;
  reason: string;
  type: 'component-update' | 'style-change' | 'props-change' | 'effect-update';
}

export interface DebugToolPanel {
  id: string;
  name: string;
  icon: string;
  component: React.ComponentType<any>;
  isActive: boolean;
  order: number;
}

export interface PerformanceReport {
  totalMeasures: number;
  averageRenderTime: number;
  slowComponents: Array<{
    name: string;
    duration: number;
    type: string;
  }>;
  longTasks: PerformanceMetrics[];
  timeline: Array<{
    name: string;
    duration: number;
    timestamp: number;
    type: string;
  }>;
}

export interface ErrorReportSummary {
  total: number;
  byType: Record<string, number>;
  bySeverity: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  recent: ErrorReport[];
  frequent: Array<{
    message: string;
    name: string;
    count: number;
  }>;
}

export interface HotReloadReport {
  totalReloads: number;
  averageReloadTime: number;
  mostReloadedComponents: Array<{
    name: string;
    count: number;
  }>;
  reloadFrequency: number;
  timeline: Array<{
    component: string;
    time: number;
    timestamp: number;
    reason: string;
  }>;
}

export interface DebugSession {
  id: string;
  startTime: number;
  isRecording: boolean;
  selectedComponent?: string;
  filters: {
    performanceTypes: string[];
    errorTypes: string[];
    dependencyTypes: string[];
  };
  viewMode: 'timeline' | 'hierarchy' | 'graph' | 'list';
}