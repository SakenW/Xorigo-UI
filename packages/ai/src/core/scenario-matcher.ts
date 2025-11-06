/**
 * @fileoverview 场景匹配器
 * @description 基于关键词、上下文和历史使用模式匹配最佳场景模板
 */

import type {
  Scenario,
  ScenarioCategory,
  RecommendationRequest,
  MatchReason,
  ComponentCategory,
  ComplexityLevel,
} from '@/types/recommendation';

export class ScenarioMatcher {
  private scenarios: Scenario[] = [];
  private keywordWeights: Map<string, Map<string, number>> = new Map();
  private categoryKeywords: Map<ScenarioCategory, string[]> = new Map();

  constructor() {
    this.initializeCategoryKeywords();
  }

  /**
   * 初始化类别关键词映射
   */
  private initializeCategoryKeywords(): void {
    this.categoryKeywords.set('authentication', [
      'login', 'signin', 'signup', 'register', 'auth', 'password',
      'oauth', 'sso', 'mfa', 'verification', 'reset', 'two-factor'
    ]);

    this.categoryKeywords.set('dashboard', [
      'dashboard', 'analytics', 'metrics', 'kpi', 'chart', 'widget',
      'overview', 'summary', 'statistics', 'monitoring', 'admin'
    ]);

    this.categoryKeywords.set('ecommerce', [
      'shop', 'cart', 'checkout', 'product', 'catalog', 'inventory',
      'order', 'payment', 'shipping', 'discount', 'review', 'wishlist'
    ]);

    this.categoryKeywords.set('content-management', [
      'cms', 'content', 'article', 'blog', 'editor', 'draft',
      'publish', 'media', 'file', 'upload', 'manage', 'category'
    ]);

    this.categoryKeywords.set('social', [
      'social', 'post', 'feed', 'timeline', 'follow', 'friend',
      'message', 'chat', 'comment', 'like', 'share', 'profile'
    ]);

    this.categoryKeywords.set('analytics', [
      'analytics', 'report', 'data', 'visualization', 'graph',
      'trend', 'analysis', 'insight', 'measure', 'track', 'event'
    ]);

    this.categoryKeywords.set('communication', [
      'message', 'chat', 'email', 'notification', 'alert', 'inbox',
      'compose', 'reply', 'thread', 'conversation', 'contact'
    ]);

    this.categoryKeywords.set('productivity', [
      'task', 'todo', 'project', 'calendar', 'schedule', 'meeting',
      'deadline', 'priority', 'assign', 'track', 'collaborate'
    ]);

    this.categoryKeywords.set('education', [
      'course', 'lesson', 'student', 'teacher', 'grade', 'assignment',
      'quiz', 'syllabus', 'enroll', 'learn', 'study', 'resource'
    ]);

    this.categoryKeywords.set('entertainment', [
      'video', 'music', 'game', 'stream', 'playlist', 'player',
      'entertainment', 'fun', 'play', 'watch', 'listen', 'enjoy'
    ]);
  }

  /**
   * 加载场景数据
   */
  loadScenarios(scenarios: Scenario[]): void {
    this.scenarios = scenarios;
    this.buildKeywordIndex();
  }

  /**
   * 构建关键词索引
   */
  private buildKeywordIndex(): void {
    this.keywordWeights.clear();

    this.scenarios.forEach(scenario => {
      this.keywordWeights.set(scenario.id, new Map());

      scenario.keywords.forEach(keyword => {
        const weights = this.calculateKeywordWeights(keyword, scenario);
        Object.entries(weights).forEach(([context, weight]) => {
          this.keywordWeights.get(scenario.id)!.set(context, weight);
        });
      });
    });
  }

  /**
   * 计算关键词权重
   */
  private calculateKeywordWeights(
    keyword: string,
    scenario: Scenario
  ): Record<string, number> {
    const weights: Record<string, number> = {};

    weights[keyword.toLowerCase()] = 1.0;

    if (scenario.name.toLowerCase().includes(keyword.toLowerCase())) {
      weights[keyword.toLowerCase()] = 1.5;
    }

    if (scenario.description.toLowerCase().includes(keyword.toLowerCase())) {
      weights[keyword.toLowerCase()] = 1.3;
    }

    const category = this.categoryKeywords.get(scenario.category);
    if (category) {
      category.forEach(catKeyword => {
        if (keyword.toLowerCase().includes(catKeyword.toLowerCase()) ||
            catKeyword.toLowerCase().includes(keyword.toLowerCase())) {
          weights[catKeyword] = (weights[catKeyword] || 0) + 0.7;
        }
      });
    }

    scenario.tags.forEach(tag => {
      if (keyword.toLowerCase().includes(tag.toLowerCase()) ||
          tag.toLowerCase().includes(keyword.toLowerCase())) {
        weights[tag.toLowerCase()] = (weights[tag.toLowerCase()] || 0) + 0.8;
      }
    });

    return weights;
  }

  /**
   * 匹配场景
   */
  matchScenarios(request: RecommendationRequest, limit: number = 10): ScenarioMatch[] {
    const matches = this.scenarios.map(scenario => {
      const score = this.calculateMatchScore(scenario, request);
      const reasons = this.generateMatchReasons(scenario, request, score);
      return {
        scenario,
        score,
        reasons,
        confidence: this.calculateConfidence(scenario, request, score),
      };
    });

    return matches
      .filter(match => match.score > 0.3)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * 计算匹配分数
   */
  private calculateMatchScore(scenario: Scenario, request: RecommendationRequest): number {
    let totalScore = 0;
    let maxScore = 0;

    if (request.context.scenario) {
      const scenarioScore = this.calculateScenarioScore(scenario, request.context.scenario);
      totalScore += scenarioScore * 0.4;
      maxScore += 0.4;
    }

    if (request.context.industry) {
      const industryScore = this.calculateIndustryScore(scenario, request.context.industry);
      totalScore += industryScore * 0.2;
      maxScore += 0.2;
    }

    const componentScore = this.calculateComponentScore(scenario, request.context.currentComponents || []);
    totalScore += componentScore * 0.25;
    maxScore += 0.25;

    const complexityScore = this.calculateComplexityScore(scenario, request.context.complexity);
    totalScore += complexityScore * 0.15;
    maxScore += 0.15;

    return maxScore > 0 ? totalScore / maxScore : 0;
  }

  /**
   * 计算场景分数
   */
  private calculateScenarioScore(scenario: Scenario, query: string): number {
    const queryLower = query.toLowerCase();
    let score = 0;

    if (scenario.name.toLowerCase().includes(queryLower)) {
      score += 1.0;
    }

    if (scenario.description.toLowerCase().includes(queryLower)) {
      score += 0.8;
    }

    scenario.keywords.forEach(keyword => {
      if (keyword.toLowerCase().includes(queryLower) ||
          queryLower.includes(keyword.toLowerCase())) {
        score += 0.6;
      }
    });

    scenario.tags.forEach(tag => {
      if (tag.toLowerCase().includes(queryLower)) {
        score += 0.5;
      }
    });

    const categoryKeywords = this.categoryKeywords.get(scenario.category) || [];
    categoryKeywords.forEach(catKeyword => {
      if (queryLower.includes(catKeyword.toLowerCase())) {
        score += 0.3;
      }
    });

    return Math.min(score / (1 + scenario.keywords.length * 0.6), 1);
  }

  /**
   * 计算行业分数
   */
  private calculateIndustryScore(scenario: Scenario, industry: string): number {
    const industryLower = industry.toLowerCase();
    const industryMap: Record<string, ScenarioCategory[]> = {
      'tech': ['dashboard', 'analytics', 'productivity'],
      'ecommerce': ['ecommerce', 'communication'],
      'education': ['education', 'content-management'],
      'healthcare': ['dashboard', 'analytics', 'communication'],
      'finance': ['dashboard', 'analytics', 'authentication'],
      'social': ['social', 'communication', 'entertainment'],
      'gaming': ['entertainment', 'social', 'analytics'],
      'retail': ['ecommerce', 'dashboard', 'analytics'],
      'logistics': ['dashboard', 'analytics', 'productivity'],
    };

    const relevantCategories = industryMap[industryLower] || [];
    if (relevantCategories.includes(scenario.category)) {
      return 1.0;
    }

    if (scenario.tags.some(tag => tag.toLowerCase().includes(industryLower))) {
      return 0.7;
    }

    return 0;
  }

  /**
   * 计算组件匹配分数
   */
  private calculateComponentScore(
    scenario: Scenario,
    currentComponents: string[]
  ): number {
    if (currentComponents.length === 0) return 0.5;

    const scenarioComponentNames = scenario.components.map(c => c.name);
    const matches = currentComponents.filter(comp =>
      scenarioComponentNames.includes(comp)
    );

    const matchRatio = matches.length / currentComponents.length;
    const scenarioCoverage = matches.length / scenarioComponentNames.length;

    return (matchRatio + scenarioCoverage) / 2;
  }

  /**
   * 计算复杂度分数
   */
  private calculateComplexityScore(
    scenario: Scenario,
    targetComplexity?: ComplexityLevel
  ): number {
    if (!targetComplexity) return 0.5;

    const complexityMap: Record<ComplexityLevel, number> = {
      'low': 0,
      'medium': 1,
      'high': 2,
    };

    const scenarioLevel = complexityMap[scenario.complexity];
    const targetLevel = complexityMap[targetComplexity];

    if (scenarioLevel === targetLevel) return 1.0;
    if (Math.abs(scenarioLevel - targetLevel) === 1) return 0.7;
    return 0.3;
  }

  /**
   * 生成匹配原因
   */
  private generateMatchReasons(
    scenario: Scenario,
    request: RecommendationRequest,
    score: number
  ): MatchReason[] {
    const reasons: MatchReason[] = [];

    if (request.context.scenario && score > 0.3) {
      const scenarioScore = this.calculateScenarioScore(
        scenario,
        request.context.scenario
      );
      if (scenarioScore > 0.5) {
        reasons.push({
          type: 'scenario',
          score: scenarioScore,
          description: `场景名称和描述匹配 "${request.context.scenario}"`,
          evidence: [scenario.name],
        });
      }
    }

    if (request.context.currentComponents?.length) {
      const componentScore = this.calculateComponentScore(
        scenario,
        request.context.currentComponents
      );
      if (componentScore > 0.3) {
        const matches = request.context.currentComponents.filter(comp =>
          scenario.components.some(c => c.name === comp)
        );
        reasons.push({
          type: 'keyword',
          score: componentScore,
          description: `包含 ${matches.length} 个当前组件`,
          evidence: matches,
        });
      }
    }

    if (request.context.complexity) {
      const complexityScore = this.calculateComplexityScore(
        scenario,
        request.context.complexity
      );
      if (complexityScore > 0.7) {
        reasons.push({
          type: 'preference',
          score: complexityScore,
          description: `复杂度匹配用户偏好 (${scenario.complexity})`,
          evidence: [scenario.complexity],
        });
      }
    }

    reasons.push({
      type: 'usage',
      score: scenario.popularity / 100,
      description: `使用频率: ${scenario.popularity}%`,
      evidence: [scenario.category],
    });

    return reasons.sort((a, b) => b.score - a.score);
  }

  /**
   * 计算置信度
   */
  private calculateConfidence(
    scenario: Scenario,
    request: RecommendationRequest,
    score: number
  ): number {
    let confidence = score;

    const evidenceCount = request.context.currentComponents?.length || 0;
    if (evidenceCount > 0) {
      confidence += Math.min(evidenceCount * 0.05, 0.2);
    }

    if (request.context.scenario) {
      confidence += 0.1;
    }

    if (scenario.popularity > 50) {
      confidence += 0.1;
    }

    return Math.min(confidence, 1);
  }

  /**
   * 查找相似场景
   */
  findSimilarScenarios(scenarioId: string, limit: number = 5): ScenarioSimilarity[] {
    const scenario = this.scenarios.find(s => s.id === scenarioId);
    if (!scenario) return [];

    const similarities = this.scenarios
      .filter(s => s.id !== scenarioId)
      .map(candidate => ({
        scenario: candidate,
        similarity: this.calculateSimilarity(scenario, candidate),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);

    return similarities;
  }

  /**
   * 计算场景相似度
   */
  private calculateSimilarity(s1: Scenario, s2: Scenario): number {
    let similarity = 0;

    if (s1.category === s2.category) {
      similarity += 0.3;
    }

    const commonKeywords = s1.keywords.filter(k => s2.keywords.includes(k));
    const keywordSimilarity = commonKeywords.length / Math.max(s1.keywords.length, s2.keywords.length);
    similarity += keywordSimilarity * 0.4;

    const commonTags = s1.tags.filter(t => s2.tags.includes(t));
    const tagSimilarity = commonTags.length / Math.max(s1.tags.length, s2.tags.length);
    similarity += tagSimilarity * 0.2;

    const commonComponents = s1.components.filter(c =>
      s2.components.some(c2 => c2.name === c.name)
    ).length;
    const componentSimilarity = commonComponents / Math.max(s1.components.length, s2.components.length);
    similarity += componentSimilarity * 0.1;

    return similarity;
  }

  /**
   * 获取场景推荐理由
   */
  getRecommendationReasons(
    scenario: Scenario,
    context: RecommendationRequest['context']
  ): RecommendationReason[] {
    const reasons: RecommendationReason[] = [];

    if (context.scenario) {
      reasons.push({
        category: 'exact-match',
        title: '精确匹配',
        description: `场景 "${scenario.name}" 与您的需求 "${context.scenario}" 高度匹配`,
        confidence: 0.9,
      });
    }

    if (scenario.popularity > 70) {
      reasons.push({
        category: 'popular',
        title: '热门选择',
        description: `${scenario.popularity}% 的用户选择了此场景`,
        confidence: 0.8,
      });
    }

    if (context.complexity === scenario.complexity) {
      reasons.push({
        category: 'complexity',
        title: '复杂度匹配',
        description: `此场景的复杂度 (${scenario.complexity}) 符合您的偏好`,
        confidence: 0.7,
      });
    }

    if (context.currentComponents?.length) {
      const reuseCount = scenario.components.filter(c =>
        context.currentComponents!.includes(c.name)
      ).length;
      if (reuseCount > 0) {
        reasons.push({
          category: 'component-reuse',
          title: '组件复用',
          description: `可以复用 ${reuseCount} 个现有组件`,
          confidence: 0.75,
        });
      }
    }

    return reasons;
  }

  /**
   * 统计场景分类分布
   */
  getCategoryDistribution(): CategoryDistribution {
    const distribution: Record<string, number> = {};
    let total = 0;

    this.scenarios.forEach(scenario => {
      distribution[scenario.category] = (distribution[scenario.category] || 0) + 1;
      total++;
    });

    return {
      categories: distribution,
      total,
      distribution: Object.entries(distribution).map(([category, count]) => ({
        category: category as ScenarioCategory,
        count,
        percentage: (count / total) * 100,
      })),
    };
  }
}

/**
 * 类型定义
 */
export interface ScenarioMatch {
  scenario: Scenario;
  score: number;
  reasons: MatchReason[];
  confidence: number;
}

export interface ScenarioSimilarity {
  scenario: Scenario;
  similarity: number;
}

export interface RecommendationReason {
  category: 'exact-match' | 'popular' | 'complexity' | 'component-reuse';
  title: string;
  description: string;
  confidence: number;
}

export interface CategoryDistribution {
  categories: Record<string, number>;
  total: number;
  distribution: {
    category: ScenarioCategory;
    count: number;
    percentage: number;
  }[];
}
