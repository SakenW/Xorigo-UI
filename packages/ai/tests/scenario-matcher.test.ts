/**
 * @fileoverview 场景匹配器测试
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ScenarioMatcher } from '@/core/scenario-matcher';
import { SCENARIO_TEMPLATES } from '@/scenarios/templates';
import type { RecommendationRequest } from '@/types/recommendation';

describe('ScenarioMatcher', () => {
  let matcher: ScenarioMatcher;

  beforeEach(() => {
    matcher = new ScenarioMatcher();
    matcher.loadScenarios(SCENARIO_TEMPLATES);
  });

  describe('loadScenarios', () => {
    it('应该正确加载场景数据', () => {
      expect(matcher).toBeDefined();
    });
  });

  describe('matchScenarios', () => {
    it('应该匹配登录相关场景', () => {
      const request: RecommendationRequest = {
        userId: 'test-user',
        context: {
          scenario: 'login',
        },
      };

      const matches = matcher.matchScenarios(request, 5);

      expect(matches.length).toBeGreaterThan(0);
      expect(matches[0].score).toBeGreaterThan(0.3);
      expect(matches[0].confidence).toBeGreaterThanOrEqual(0);
      expect(matches[0].confidence).toBeLessThanOrEqual(1);
    });

    it('应该处理电商场景', () => {
      const request: RecommendationRequest = {
        userId: 'test-user',
        context: {
          scenario: 'product',
          industry: 'ecommerce',
        },
      };

      const matches = matcher.matchScenarios(request, 5);

      expect(matches.length).toBeGreaterThan(0);
    });

    it('应该基于复杂度筛选', () => {
      const request: RecommendationRequest = {
        userId: 'test-user',
        context: {
          complexity: 'low',
        },
      };

      const matches = matcher.matchScenarios(request, 10);

      expect(matches.length).toBeGreaterThan(0);
    });
  });

  describe('findSimilarScenarios', () => {
    it('应该找到相似场景', () => {
      const loginScenarioId = SCENARIO_TEMPLATES.find(s => s.id === 'auth-login-form')?.id;
      expect(loginScenarioId).toBeDefined();

      const similar = matcher.findSimilarScenarios(loginScenarioId!, 3);

      expect(similar.length).toBeGreaterThan(0);
      expect(similar.length).toBeLessThanOrEqual(3);
      expect(similar[0].similarity).toBeGreaterThan(0);
      expect(similar[0].similarity).toBeLessThanOrEqual(1);
    });
  });

  describe('getCategoryDistribution', () => {
    it('应该返回正确的分类分布', () => {
      const distribution = matcher.getCategoryDistribution();

      expect(distribution).toBeDefined();
      expect(distribution.total).toBe(SCENARIO_TEMPLATES.length);
      expect(distribution.categories).toBeDefined();
      expect(distribution.distribution).toBeDefined();
      expect(Array.isArray(distribution.distribution)).toBe(true);

      const totalPercentage = distribution.distribution.reduce(
        (sum, item) => sum + item.percentage,
        0
      );
      expect(Math.abs(totalPercentage - 100)).toBeLessThan(0.01);
    });
  });
});
