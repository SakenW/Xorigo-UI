/**
 * @fileoverview 推荐引擎核心实现
 * @description 整合协同过滤、内容过滤和混合推荐算法，提供智能组件推荐
 */

import { DependencyAnalyzer } from './dependency-analyzer';
import { ScenarioMatcher } from './scenario-matcher';
import type {
  RecommendationRequest,
  RecommendationResult,
  ScenarioRecommendation,
  ComponentMetadata,
  UserProfile,
  UserFeedback,
  RecommendationEngineConfig,
  AlternativeComponent,
} from '@/types/recommendation';

export class RecommendationEngine {
  private dependencyAnalyzer: DependencyAnalyzer;
  private scenarioMatcher: ScenarioMatcher;
  private config: RecommendationEngineConfig;
  private userProfiles: Map<string, UserProfile> = new Map();
  private usageAnalytics: Map<string, ComponentUsage[]> = new Map();
  private collaborativeFilteringCache: Map<string, Map<string, number>> = new Map();

  constructor(config?: Partial<RecommendationEngineConfig>) {
    this.dependencyAnalyzer = new DependencyAnalyzer();
    this.scenarioMatcher = new ScenarioMatcher();
    this.config = {
      weights: {
        keywordMatch: 0.35,
        dependencyAnalysis: 0.25,
        userHistory: 0.20,
        popularity: 0.15,
        complexity: 0.05,
      },
      thresholds: {
        minMatchScore: 0.3,
        minCompatibilityScore: 0.6,
        maxProcessingTime: 500,
      },
      algorithms: {
        collaborativeFiltering: true,
        contentBased: true,
        hybrid: true,
      },
      ...config,
    };
  }

  /**
   * 初始化推荐引擎
   */
  async initialize(
    components: ComponentMetadata[],
    scenarios: any[]
  ): Promise<void> {
    const startTime = Date.now();

    this.dependencyAnalyzer.initialize(components);
    this.scenarioMatcher.loadScenarios(scenarios);

    this.buildCollaborativeFilteringModel();

    console.log(`推荐引擎初始化完成，耗时 ${Date.now() - startTime}ms`);
  }

  /**
   * 生成推荐
   */
  async generateRecommendation(
    request: RecommendationRequest
  ): Promise<RecommendationResult> {
    const startTime = Date.now();

    const matchedScenarios = this.scenarioMatcher.matchScenarios(
      request,
      request.limit || 5
    );

    const recommendations: ScenarioRecommendation[] = matchedScenarios.map(match => {
      const collaborativeScore = this.calculateCollaborativeScore(
        request.userId,
        match.scenario
      );

      const dependencyScore = this.calculateDependencyScore(
        match.scenario,
        request.context
      );

      const userHistoryScore = this.calculateUserHistoryScore(
        request.userId,
        match.scenario
      );

      const finalScore =
        match.score * this.config.weights.keywordMatch +
        dependencyScore * this.config.weights.dependencyAnalysis +
        userHistoryScore * this.config.weights.userHistory +
        (match.scenario.popularity / 100) * this.config.weights.popularity +
        collaborativeScore * 0.1;

      const alternativeComponents = this.findAlternativeComponents(
        match.scenario,
        request.context.currentComponents || []
      );

      return {
        scenario: match.scenario,
        matchScore: match.score,
        reasons: match.reasons,
        alternativeComponents,
        estimatedComplexity: match.scenario.complexity,
        compatibilityScore: finalScore,
        ...(this.getUserFeedback(request.userId, match.scenario.id) && {
          userFeedback: this.getUserFeedback(request.userId, match.scenario.id),
        }),
      };
    });

    const processingTime = Date.now() - startTime;

    return {
      scenarios: recommendations.sort((a, b) => b.compatibilityScore - a.compatibilityScore),
      timestamp: new Date(),
      processingTime,
      confidence: this.calculateOverallConfidence(recommendations),
    };
  }

  /**
   * 计算协同过滤分数
   */
  private calculateCollaborativeScore(
    userId: string,
    scenario: any
  ): number {
    if (!this.config.algorithms.collaborativeFiltering) return 0;

    const userSimilarities = this.calculateUserSimilarities(userId);
    let weightedScore = 0;
    let totalWeight = 0;

    userSimilarities.forEach(({ userId: similarUserId, similarity }) => {
      const feedback = this.getUserFeedback(similarUserId, scenario.id);
      if (feedback && feedback.accepted) {
        weightedScore += feedback.rating * similarity;
        totalWeight += similarity;
      }
    });

    return totalWeight > 0 ? weightedScore / totalWeight : 0;
  }

  /**
   * 计算用户相似度
   */
  private calculateUserSimilarities(userId: string): Array<{ userId: string; similarity: number }> {
    const similarities: Array<{ userId: string; similarity: number }> = [];

    this.userProfiles.forEach((profile, otherUserId) => {
      if (otherUserId === userId) return;

      const similarity = this.calculateCosineSimilarity(
        this.getUserVector(userId),
        this.getUserVector(otherUserId)
      );

      if (similarity > 0.3) {
        similarities.push({ userId: otherUserId, similarity });
      }
    });

    return similarities.sort((a, b) => b.similarity - a.similarity).slice(0, 10);
  }

  /**
   * 计算用户向量
   */
  private getUserVector(userId: string): Map<string, number> {
    const vector = new Map<string, number>();
    const profile = this.userProfiles.get(userId);

    if (profile) {
      profile.usageHistory.forEach(usage => {
        vector.set(usage.componentName, usage.frequency);
      });
    }

    return vector;
  }

  /**
   * 计算余弦相似度
   */
  private calculateCosineSimilarity(v1: Map<string, number>, v2: Map<string, number>): number {
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    const keys = new Set([...v1.keys(), ...v2.keys()]);
    keys.forEach(key => {
      const val1 = v1.get(key) || 0;
      const val2 = v2.get(key) || 0;
      dotProduct += val1 * val2;
      norm1 += val1 * val1;
      norm2 += val2 * val2;
    });

    if (norm1 === 0 || norm2 === 0) return 0;
    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }

  /**
   * 计算依赖分析分数
   */
  private calculateDependencyScore(
    scenario: any,
    context: RecommendationRequest['context']
  ): number {
    if (!context.currentComponents?.length) return 0.5;

    const requiredComponents = scenario.components
      .filter((c: any) => c.required)
      .map((c: any) => c.name);

    const availableComponents = context.currentComponents;
    const matchCount = requiredComponents.filter((comp: string) =>
      availableComponents.includes(comp)
    ).length;

    return requiredComponents.length > 0 ? matchCount / requiredComponents.length : 1;
  }

  /**
   * 计算用户历史分数
   */
  private calculateUserHistoryScore(userId: string, scenario: any): number {
    const profile = this.userProfiles.get(userId);
    if (!profile) return 0;

    const historyScore = profile.usageHistory.reduce((score, usage) => {
      if (scenario.components.some((c: any) => c.name === usage.componentName)) {
        return score + (usage.frequency / 10) * this.getRecencyWeight(usage.lastUsed);
      }
      return score;
    }, 0);

    const scenarioHistoryScore = profile.scenarioHistory.includes(scenario.id) ? 0.5 : 0;

    return Math.min((historyScore + scenarioHistoryScore) / 2, 1);
  }

  /**
   * 获取时间衰减权重
   */
  private getRecencyWeight(lastUsed: Date): number {
    const now = new Date();
    const daysDiff = (now.getTime() - lastUsed.getTime()) / (1000 * 60 * 60 * 24);
    const halfLife = 30;

    return Math.pow(0.5, daysDiff / halfLife);
  }

  /**
   * 查找替代组件
   */
  private findAlternativeComponents(
    scenario: any,
    currentComponents: string[]
  ): AlternativeComponent[] {
    const alternatives: AlternativeComponent[] = [];

    currentComponents.forEach(componentName => {
      const hasComponent = scenario.components.some((c: any) => c.name === componentName);
      if (!hasComponent) {
        const similarComponents = this.findSimilarComponents(componentName);
        if (similarComponents.length > 0) {
          alternatives.push({
            originalComponent: componentName,
            alternatives: similarComponents.slice(0, 3),
          });
        }
      }
    });

    return alternatives;
  }

  /**
   * 查找相似组件
   */
  private findSimilarComponents(componentName: string): Array<{ name: string; reason: string; score: number }> {
    return [
      {
        name: `${componentName}Enhanced`,
        reason: '提供更多功能和更好的性能',
        score: 0.8,
      },
      {
        name: `${componentName}Minimal`,
        reason: '更轻量级，适合简单场景',
        score: 0.7,
      },
      {
        name: `${componentName}Advanced`,
        reason: '高级版本，包含更多自定义选项',
        score: 0.75,
      },
    ];
  }

  /**
   * 获取用户反馈
   */
  private getUserFeedback(userId: string, scenarioId: string): UserFeedback | undefined {
    const usage = this.usageAnalytics.get(userId);
    return usage?.find(u => u.componentName === scenarioId)?.userFeedback as any;
  }

  /**
   * 计算整体置信度
   */
  private calculateOverallConfidence(recommendations: ScenarioRecommendation[]): number {
    if (recommendations.length === 0) return 0;

    const avgConfidence = recommendations.reduce((sum, rec) => {
      const confidence = rec.reasons.reduce((rSum, reason) => rSum + reason.score, 0) / rec.reasons.length;
      return sum + confidence;
    }, 0) / recommendations.length;

    const diversityScore = this.calculateDiversityScore(recommendations);

    return (avgConfidence + diversityScore) / 2;
  }

  /**
   * 计算推荐多样性
   */
  private calculateDiversityScore(recommendations: ScenarioRecommendation[]): number {
    const categories = new Set(recommendations.map(r => r.scenario.category));
    const avgComplexity = recommendations.reduce((sum, r) => {
      const complexityMap: any = { low: 1, medium: 2, high: 3 };
      return sum + complexityMap[r.estimatedComplexity];
    }, 0) / recommendations.length;

    const categoryDiversity = categories.size / recommendations.length;
    const complexityDiversity = 1 - Math.abs(avgComplexity - 2) / 2;

    return (categoryDiversity + complexityDiversity) / 2;
  }

  /**
   * 构建协同过滤模型
   */
  private buildCollaborativeFilteringModel(): void {
    this.userProfiles.forEach((profile, userId) => {
      const userVector = this.getUserVector(userId);
      this.collaborativeFilteringCache.set(userId, userVector);
    });
  }

  /**
   * 记录用户反馈
   */
  recordFeedback(userId: string, feedback: UserFeedback): void {
    let userUsage = this.usageAnalytics.get(userId);
    if (!userUsage) {
      userUsage = [];
      this.usageAnalytics.set(userId, userUsage);
    }

    const usage: ComponentUsage = {
      componentName: feedback.selectedScenario || '',
      frequency: 1,
      lastUsed: feedback.timestamp,
      userId,
      context: 'recommendation',
    };

    userUsage.push(usage as any);

    const profile = this.userProfiles.get(userId) || {
      userId,
      preferences: {
        themes: [],
        complexity: 'medium',
        accessibility: 'basic',
      },
      usageHistory: [],
      scenarioHistory: [],
    };

    if (feedback.selectedScenario && !profile.scenarioHistory.includes(feedback.selectedScenario)) {
      profile.scenarioHistory.push(feedback.selectedScenario);
    }

    profile.usageHistory.push({
      componentName: feedback.selectedScenario || '',
      frequency: 1,
      lastUsed: feedback.timestamp,
      userId,
      context: 'recommendation',
    });

    this.userProfiles.set(userId, profile);

    this.rebuildCollaborativeFilteringModel();
  }

  /**
   * 重建协同过滤模型
   */
  private rebuildCollaborativeFilteringModel(): void {
    this.collaborativeFilteringCache.clear();
    this.buildCollaborativeFilteringModel();
  }

  /**
   * 获取推荐统计信息
   */
  getRecommendationStats(): RecommendationStats {
    const totalRecommendations = Array.from(this.usageAnalytics.values())
      .reduce((sum, usage) => sum + usage.length, 0);

    const acceptedRecommendations = Array.from(this.usageAnalytics.values())
      .flat()
      .filter(u => (u as any).userFeedback?.accepted).length;

    const averageRating = Array.from(this.usageAnalytics.values())
      .flat()
      .filter(u => (u as any).userFeedback?.rating)
      .reduce((sum, u, _, arr) => sum + (u as any).userFeedback.rating / arr.length, 0);

    const scenarioFrequency: Record<string, number> = {};
    Array.from(this.userProfiles.values()).forEach(profile => {
      profile.scenarioHistory.forEach(scenarioId => {
        scenarioFrequency[scenarioId] = (scenarioFrequency[scenarioId] || 0) + 1;
      });
    });

    return {
      totalRecommendations,
      acceptanceRate: totalRecommendations > 0 ? acceptedRecommendations / totalRecommendations : 0,
      averageRating,
      topScenarios: Object.entries(scenarioFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([scenarioId, count]) => ({ scenarioId, count })),
      activeUsers: this.userProfiles.size,
    };
  }

  /**
   * 导出用户画像
   */
  exportUserProfile(userId: string): UserProfile | null {
    return this.userProfiles.get(userId) || null;
  }

  /**
   * 更新用户偏好
   */
  updateUserPreferences(
    userId: string,
    preferences: Partial<UserProfile['preferences']>
  ): void {
    const profile = this.userProfiles.get(userId);
    if (profile) {
      profile.preferences = {
        ...profile.preferences,
        ...preferences,
      };
      this.userProfiles.set(userId, profile);
    }
  }

  /**
   * 清理过期数据
   */
  cleanupExpiredData(daysThreshold: number = 90): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysThreshold);

    this.usageAnalytics.forEach((usage, userId) => {
      const filtered = usage.filter(u => u.lastUsed > cutoffDate);
      if (filtered.length > 0) {
        this.usageAnalytics.set(userId, filtered);
      } else {
        this.usageAnalytics.delete(userId);
      }
    });
  }
}

/**
 * 类型定义
 */
interface ComponentUsage {
  componentName: string;
  frequency: number;
  lastUsed: Date;
  userId: string;
  context: string;
  userFeedback?: UserFeedback;
}

interface RecommendationStats {
  totalRecommendations: number;
  acceptanceRate: number;
  averageRating: number;
  topScenarios: Array<{ scenarioId: string; count: number }>;
  activeUsers: number;
}
