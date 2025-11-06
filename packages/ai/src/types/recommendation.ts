/**
 * @fileoverview 推荐系统核心类型定义
 * @description 定义智能组件推荐引擎的所有类型接口
 */

export interface ComponentMetadata {
  name: string;
  category: ComponentCategory;
  description: string;
  keywords: string[];
  dependencies: string[];
  usageStats: {
    count: number;
    lastUsed: Date;
  };
  complexity: ComplexityLevel;
  accessibility: AccessibilityLevel;
  themeSupport: ThemeSupport;
}

export type ComponentCategory =
  | 'form'
  | 'layout'
  | 'navigation'
  | 'feedback'
  | 'data-display'
  | 'overlay'
  | 'media'
  | 'typography'
  | 'input'
  | 'display';

export type ComplexityLevel = 'low' | 'medium' | 'high';

export type AccessibilityLevel = 'basic' | 'enhanced' | 'complete';

export type ThemeSupport = {
  modes: ('light' | 'dark' | 'auto')[];
  recipes: string[];
  customThemes: boolean;
};

export interface ComponentUsage {
  componentName: string;
  frequency: number;
  lastUsed: Date;
  userId: string;
  context: string;
}

export interface UserProfile {
  userId: string;
  preferences: {
    themes: string[];
    complexity: ComplexityLevel;
    accessibility: AccessibilityLevel;
  };
  usageHistory: ComponentUsage[];
  scenarioHistory: string[];
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  category: ScenarioCategory;
  keywords: string[];
  components: ComponentTemplate[];
  dependencies: DependencyEdge[];
  complexity: ComplexityLevel;
  popularity: number;
  tags: string[];
}

export type ScenarioCategory =
  | 'authentication'
  | 'dashboard'
  | 'ecommerce'
  | 'content-management'
  | 'social'
  | 'analytics'
  | 'communication'
  | 'productivity'
  | 'education'
  | 'entertainment';

export interface ComponentTemplate {
  name: string;
  required: boolean;
  variants?: string[];
  props: Record<string, any>;
  position: {
    x: number;
    y: number;
  };
}

export interface DependencyEdge {
  from: string;
  to: string;
  type: 'required' | 'optional' | 'peer';
  weight: number;
}

export interface RecommendationRequest {
  userId: string;
  context: {
    scenario?: string;
    industry?: string;
    currentComponents?: string[];
    complexity?: ComplexityLevel;
    theme?: string;
    accessibility?: AccessibilityLevel;
  };
  preferences?: {
    excludeCategories?: ComponentCategory[];
    maxComplexity?: ComplexityLevel;
    requiredFeatures?: string[];
  };
  limit?: number;
}

export interface RecommendationResult {
  scenarios: ScenarioRecommendation[];
  timestamp: Date;
  processingTime: number;
  confidence: number;
}

export interface ScenarioRecommendation {
  scenario: Scenario;
  matchScore: number;
  reasons: MatchReason[];
  alternativeComponents: AlternativeComponent[];
  estimatedComplexity: ComplexityLevel;
  compatibilityScore: number;
  userFeedback?: UserFeedback;
}

export interface MatchReason {
  type: 'keyword' | 'dependency' | 'usage' | 'preference' | 'scenario';
  score: number;
  description: string;
  evidence: string[];
}

export interface AlternativeComponent {
  originalComponent: string;
  alternatives: {
    name: string;
    reason: string;
    score: number;
  }[];
}

export interface UserFeedback {
  accepted: boolean;
  selectedScenario?: string;
  selectedComponents: string[];
  rating: number;
  comments?: string;
  timestamp: Date;
}

export interface RecommendationEngineConfig {
  weights: {
    keywordMatch: number;
    dependencyAnalysis: number;
    userHistory: number;
    popularity: number;
    complexity: number;
  };
  thresholds: {
    minMatchScore: number;
    minCompatibilityScore: number;
    maxProcessingTime: number;
  };
  algorithms: {
    collaborativeFiltering: boolean;
    contentBased: boolean;
    hybrid: boolean;
  };
}

export interface UsageAnalytics {
  totalRecommendations: number;
  acceptanceRate: number;
  averageRating: number;
  topScenarios: {
    scenarioId: string;
    name: string;
    usageCount: number;
  }[];
  componentFrequency: {
    componentName: string;
    count: number;
  }[];
  userEngagement: {
    activeUsers: number;
    averageSessionDuration: number;
    recommendationsPerSession: number;
  };
}
