/**
 * @fileoverview 推荐引擎测试
 * @description 测试推荐引擎的核心功能
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RecommendationEngine } from '@/core/recommendation-engine';
import { SCENARIO_TEMPLATES } from '@/scenarios/templates';
import type { ComponentMetadata } from '@/types/recommendation';

describe('RecommendationEngine', () => {
  let engine: RecommendationEngine;
  let mockComponents: ComponentMetadata[];

  beforeEach(() => {
    engine = new RecommendationEngine();
    mockComponents = [
      {
        name: 'Button',
        category: 'input',
        description: '按钮组件',
        keywords: ['button', 'click', 'action'],
        dependencies: ['FormField'],
        usageStats: { count: 100, lastUsed: new Date() },
        complexity: 'low',
        accessibility: 'basic',
        themeSupport: {
          modes: ['light', 'dark', 'auto'],
          recipes: ['default'],
          customThemes: true,
        },
      },
      {
        name: 'Input',
        category: 'form',
        description: '输入框组件',
        keywords: ['input', 'text', 'field'],
        dependencies: [],
        usageStats: { count: 80, lastUsed: new Date() },
        complexity: 'low',
        accessibility: 'enhanced',
        themeSupport: {
          modes: ['light', 'dark'],
          recipes: ['default'],
          customThemes: false,
        },
      },
      {
        name: 'Card',
        category: 'layout',
        description: '卡片容器',
        keywords: ['card', 'container', 'box'],
        dependencies: [],
        usageStats: { count: 60, lastUsed: new Date() },
        complexity: 'low',
        accessibility: 'basic',
        themeSupport: {
          modes: ['light', 'dark', 'auto'],
          recipes: ['default', 'elevated'],
          customThemes: true,
        },
      },
    ];
  });

  describe('initialize', () => {
    it('应该正确初始化推荐引擎', async () => {
      await engine.initialize(mockComponents, SCENARIO_TEMPLATES);
      expect(engine).toBeDefined();
    });

    it('应该正确加载组件和场景', async () => {
      await engine.initialize(mockComponents, SCENARIO_TEMPLATES);
      const stats = engine.getRecommendationStats();
      expect(stats).toBeDefined();
    });
  });

  describe('generateRecommendation', () => {
    beforeEach(async () => {
      await engine.initialize(mockComponents, SCENARIO_TEMPLATES);
    });

    it('应该为登录场景生成推荐', async () => {
      const request = {
        userId: 'user1',
        context: {
          scenario: 'login',
          industry: 'tech',
          complexity: 'low',
        },
        limit: 3,
      };

      const result = await engine.generateRecommendation(request);

      expect(result).toBeDefined();
      expect(result.scenarios).toBeDefined();
      expect(Array.isArray(result.scenarios)).toBe(true);
      expect(result.processingTime).toBeLessThan(1000);
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    it('应该处理空上下文', async () => {
      const request = {
        userId: 'user2',
        context: {},
      };

      const result = await engine.generateRecommendation(request);

      expect(result).toBeDefined();
      expect(result.scenarios).toBeDefined();
    });

    it('应该根据当前组件推荐匹配场景', async () => {
      const request = {
        userId: 'user3',
        context: {
          currentComponents: ['Button', 'Input'],
          complexity: 'low',
        },
      };

      const result = await engine.generateRecommendation(request);

      expect(result.scenarios.length).toBeGreaterThan(0);
    });
  });

  describe('用户反馈', () => {
    beforeEach(async () => {
      await engine.initialize(mockComponents, SCENARIO_TEMPLATES);
    });

    it('应该记录用户反馈', async () => {
      const feedback = {
        accepted: true,
        selectedScenario: 'auth-login-form',
        selectedComponents: ['Button', 'Input'],
        rating: 5,
        comments: '很好的推荐',
      };

      engine.recordFeedback('user1', feedback);

      const profile = engine.exportUserProfile('user1');
      expect(profile).toBeDefined();
      expect(profile?.scenarioHistory).toContain('auth-login-form');
    });

    it('应该更新用户偏好', async () => {
      engine.updateUserPreferences('user1', {
        complexity: 'high',
      });

      const profile = engine.exportUserProfile('user1');
      expect(profile?.preferences.complexity).toBe('high');
    });
  });

  describe('性能测试', () => {
    it('应该在500ms内完成推荐', async () => {
      await engine.initialize(mockComponents, SCENARIO_TEMPLATES);

      const request = {
        userId: 'user_perf',
        context: {
          scenario: 'dashboard',
          industry: 'tech',
        },
      };

      const start = Date.now();
      const result = await engine.generateRecommendation(request);
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(500);
      expect(result.processingTime).toBeLessThan(500);
    });
  });

  describe('统计信息', () => {
    it('应该返回正确的统计信息', async () => {
      await engine.initialize(mockComponents, SCENARIO_TEMPLATES);

      const stats = engine.getRecommendationStats();

      expect(stats).toBeDefined();
      expect(typeof stats.totalRecommendations).toBe('number');
      expect(typeof stats.acceptanceRate).toBe('number');
      expect(typeof stats.averageRating).toBe('number');
      expect(Array.isArray(stats.topScenarios)).toBe(true);
      expect(typeof stats.activeUsers).toBe('number');
    });
  });
});
