/**
 * @fileoverview 推荐引擎基本使用示例
 */

import { RecommendationEngine, SCENARIO_TEMPLATES } from '@xorigo-ui/ai';

interface MockComponent {
  name: string;
  category: string;
  description: string;
  keywords: string[];
  dependencies: string[];
  usageStats: { count: number; lastUsed: Date };
  complexity: 'low' | 'medium' | 'high';
  accessibility: 'basic' | 'enhanced' | 'complete';
  themeSupport: {
    modes: string[];
    recipes: string[];
    customThemes: boolean;
  };
}

async function main() {
  console.log('=== Xorigo UI AI 推荐引擎示例 ===\n');

  // 1. 创建模拟组件数据
  const mockComponents: MockComponent[] = [
    {
      name: 'Button',
      category: 'input',
      description: '按钮组件',
      keywords: ['button', 'click', 'action', 'submit'],
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
      keywords: ['input', 'text', 'field', 'form'],
      dependencies: ['FormField'],
      usageStats: { count: 95, lastUsed: new Date() },
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
      keywords: ['card', 'container', 'box', 'layout'],
      dependencies: [],
      usageStats: { count: 85, lastUsed: new Date() },
      complexity: 'low',
      accessibility: 'basic',
      themeSupport: {
        modes: ['light', 'dark', 'auto'],
        recipes: ['default', 'elevated'],
        customThemes: true,
      },
    },
    {
      name: 'FormField',
      category: 'form',
      description: '表单字段基类',
      keywords: ['form', 'field', 'label', 'validation'],
      dependencies: [],
      usageStats: { count: 70, lastUsed: new Date() },
      complexity: 'medium',
      accessibility: 'complete',
      themeSupport: {
        modes: ['light', 'dark'],
        recipes: ['default'],
        customThemes: true,
      },
    },
    {
      name: 'Modal',
      category: 'overlay',
      description: '模态框组件',
      keywords: ['modal', 'dialog', 'popup', 'overlay'],
      dependencies: [],
      usageStats: { count: 60, lastUsed: new Date() },
      complexity: 'medium',
      accessibility: 'enhanced',
      themeSupport: {
        modes: ['light', 'dark'],
        recipes: ['default'],
        customThemes: true,
      },
    },
  ];

  // 2. 创建推荐引擎
  const engine = new RecommendationEngine({
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
  });

  // 3. 初始化引擎
  console.log('🔄 初始化推荐引擎...');
  await engine.initialize(mockComponents as any, SCENARIO_TEMPLATES);
  console.log('✅ 引擎初始化完成\n');

  // 4. 示例 1: 登录场景推荐
  console.log('📝 示例 1: 电商登录场景推荐');
  console.log('='.repeat(50));
  const loginRecommendation = await engine.generateRecommendation({
    userId: 'user_ecommerce_001',
    context: {
      scenario: 'login',
      industry: 'ecommerce',
      complexity: 'low',
    },
    limit: 3,
  });

  console.log(`处理时间: ${loginRecommendation.processingTime}ms`);
  console.log(`置信度: ${(loginRecommendation.confidence * 100).toFixed(1)}%`);
  console.log('\n推荐场景:');
  loginRecommendation.scenarios.forEach((rec, index) => {
    console.log(`\n${index + 1}. ${rec.scenario.name}`);
    console.log(`   场景ID: ${rec.scenario.id}`);
    console.log(`   描述: ${rec.scenario.description}`);
    console.log(`   匹配分数: ${(rec.matchScore * 100).toFixed(1)}%`);
    console.log(`   兼容性分数: ${(rec.compatibilityScore * 100).toFixed(1)}%`);
    console.log(`   复杂度: ${rec.estimatedComplexity}`);
    console.log(`   包含组件: ${rec.scenario.components.map(c => c.name).join(', ')}`);
  });

  // 5. 示例 2: 数据分析仪表板推荐
  console.log('\n\n📊 示例 2: 技术公司数据分析仪表板');
  console.log('='.repeat(50));
  const dashboardRecommendation = await engine.generateRecommendation({
    userId: 'user_tech_002',
    context: {
      scenario: 'dashboard',
      industry: 'tech',
      currentComponents: ['Card', 'Chart'],
      complexity: 'high',
    },
    limit: 3,
  });

  console.log(`处理时间: ${dashboardRecommendation.processingTime}ms`);
  console.log(`置信度: ${(dashboardRecommendation.confidence * 100).toFixed(1)}%`);
  console.log('\n推荐场景:');
  dashboardRecommendation.scenarios.forEach((rec, index) => {
    console.log(`\n${index + 1}. ${rec.scenario.name}`);
    console.log(`   描述: ${rec.scenario.description}`);
    console.log(`   匹配分数: ${(rec.matchScore * 100).toFixed(1)}%`);
    console.log(`   推荐理由:`);
    rec.reasons.forEach(reason => {
      console.log(`     - ${reason.description} (${(reason.score * 100).toFixed(1)}%)`);
    });
  });

  // 6. 示例 3: 记录用户反馈
  console.log('\n\n💬 示例 3: 记录用户反馈');
  console.log('='.repeat(50));
  engine.recordFeedback('user_ecommerce_001', {
    accepted: true,
    selectedScenario: 'auth-login-form',
    selectedComponents: ['Button', 'Input', 'FormField'],
    rating: 5,
    comments: '推荐很准确，帮助我快速搭建了登录页面！',
    timestamp: new Date(),
  });

  const userProfile = engine.exportUserProfile('user_ecommerce_001');
  if (userProfile) {
    console.log('用户画像已更新:');
    console.log(`  历史场景: ${userProfile.scenarioHistory.join(', ')}`);
    console.log(`  使用历史: ${userProfile.usageHistory.length} 条记录`);
  }

  // 7. 示例 4: 获取推荐统计
  console.log('\n\n📈 示例 4: 推荐系统统计');
  console.log('='.repeat(50));
  const stats = engine.getRecommendationStats();
  console.log('推荐统计信息:');
  console.log(`  总推荐次数: ${stats.totalRecommendations}`);
  console.log(`  接受率: ${(stats.acceptanceRate * 100).toFixed(1)}%`);
  console.log(`  平均评分: ${stats.averageRating.toFixed(1)} / 5`);
  console.log(`  活跃用户数: ${stats.activeUsers}`);
  console.log(`\n  热门场景 TOP 5:`);
  stats.topScenarios.slice(0, 5).forEach((item, index) => {
    console.log(`    ${index + 1}. ${item.scenarioId}: ${item.count} 次`);
  });

  // 8. 示例 5: 性能基准测试
  console.log('\n\n⚡ 示例 5: 性能基准测试');
  console.log('='.repeat(50));
  const testCases = [
    { userId: 'user1', context: { scenario: 'login', industry: 'ecommerce' } },
    { userId: 'user2', context: { scenario: 'dashboard', industry: 'tech' } },
    { userId: 'user3', context: { scenario: 'ecommerce', industry: 'retail' } },
    { userId: 'user4', context: { scenario: 'cms', industry: 'media' } },
    { userId: 'user5', context: { scenario: 'social', industry: 'social' } },
  ];

  const benchmarkStart = Date.now();
  const benchmarkResults = await Promise.all(
    testCases.map(testCase =>
      engine.generateRecommendation({
        userId: testCase.userId,
        context: testCase.context,
      })
    )
  );
  const benchmarkEnd = Date.now();

  console.log(`完成 ${testCases.length} 个推荐请求`);
  console.log(`总耗时: ${benchmarkEnd - benchmarkStart}ms`);
  console.log(`平均耗时: ${(benchmarkResults.reduce((sum, r) => sum + r.processingTime, 0) / benchmarkResults.length).toFixed(2)}ms`);
  console.log(`最快: ${Math.min(...benchmarkResults.map(r => r.processingTime))}ms`);
  console.log(`最慢: ${Math.max(...benchmarkResults.map(r => r.processingTime))}ms`);
  console.log(`平均置信度: ${(benchmarkResults.reduce((sum, r) => sum + r.confidence, 0) / benchmarkResults.length * 100).toFixed(1)}%`);

  console.log('\n\n✅ 所有示例执行完成！');
}

main().catch(error => {
  console.error('示例执行出错:', error);
  process.exit(1);
});
