# 🤖 Xorigo UI AI系统

> 智能配方推荐、生成和设计助手系统

Xorigo UI AI系统是一个基于七轴主题系统的智能设计助手，提供个性化配方推荐、智能配方生成、用户行为分析和设计建议等功能。

## ✨ 核心功能

### 🎯 智能推荐引擎
- **个性化推荐**: 基于用户行为偏好的智能配方推荐
- **上下文感知**: 考虑时间、设备、使用场景的动态推荐
- **相似度计算**: 基于七轴参数的高精度配方相似度分析
- **实时学习**: 持续学习用户偏好，优化推荐效果

### 🎨 配方生成器
- **关键词驱动**: 基于自然语言描述生成配方
- **多目标优化**: 平衡美学、可访问性、独特性和可用性
- **约束满足**: 遵循设计原则和技术约束
- **创意启发**: 提供创新的配色和设计方案

### 📊 用户行为分析
- **行为模式识别**: 分析用户的使用习惯和偏好
- **偏好建模**: 建立个性化用户偏好模型
- **实时分析**: 提供实时的用户行为洞察
- **隐私保护**: 匿名化处理，保护用户隐私

### 💡 设计助手
- **可访问性检查**: WCAG标准的可访问性验证
- **美学评估**: 基于设计原则的美学分析
- **配色和谐度**: 颜色理论和配色方案分析
- **优化建议**: 提供具体的改进建议

## 🚀 快速开始

### 基础使用

```typescript
import {
  getRecommendations,
  generateRecipes,
  getDesignSuggestions,
  assessDesign
} from '@xorigo-ui/core/ai'

// 获取个性化推荐
const recommendations = await getRecommendations('user-123', {
  timeOfDay: 'morning',
  deviceType: 'desktop',
  taskType: 'work'
})

// 生成新配方
const recipes = await generateRecipes({
  keywords: ['现代', '专业'],
  mood: ['舒适'],
  context: '办公环境'
})

// 获取设计建议
const suggestions = await getDesignSuggestions(recipe, 'user-123')

// 全面设计评估
const assessment = await assessDesign(recipe, 'user-123')
```

### React Hooks集成

```typescript
import {
  useAIRecommendations,
  useAIRecipeGenerator,
  useDesignAssistant
} from '@xorigo-ui/core/ai'

function MyComponent() {
  const {
    recommendations,
    isLoading,
    error,
    refresh,
    selectRecommendation
  } = useAIRecommendations({
    userId: 'user-123',
    context: {
      timeOfDay: 'morning',
      deviceType: 'desktop'
    },
    autoRefresh: true
  })

  const { generate, isGenerating, lastResult } = useAIRecipeGenerator({
    userId: 'user-123'
  })

  const { suggestions, analyze } = useDesignAssistant({
    recipe: currentRecipe,
    userId: 'user-123',
    autoAnalyze: true
  })

  // 组件逻辑...
}
```

## 📖 API文档

### AI推荐引擎

#### `getRecommendations(userId, context?)`

获取个性化配方推荐。

**参数:**
- `userId: string` - 用户ID
- `context?: object` - 上下文信息
  - `timeOfDay?: string` - 时段 (morning/afternoon/evening/night)
  - `deviceType?: string` - 设备类型 (mobile/tablet/desktop)
  - `taskType?: string` - 任务类型 (work/creative/learning/personal)
  - `numberOfRecommendations?: number` - 推荐数量，默认5个

**返回:** `Promise<AIServiceResult<AIRecommendationResult>>`

```typescript
const result = await getRecommendations('user-123', {
  timeOfDay: 'morning',
  deviceType: 'desktop',
  taskType: 'work',
  numberOfRecommendations: 5
})

if (result.success) {
  console.log('推荐结果:', result.data.recommendations)
  console.log('总体评分:', result.data.personalizedScore)
}
```

### 配方生成器

#### `generateRecipes(params, userId?)`

基于参数生成新配方。

**参数:**
- `params: RecipeGenerationParams` - 生成参数
  - `keywords: string[]` - 关键词列表
  - `mood: string[]` - 情绪氛围
  - `context: string` - 使用场景描述
  - `constraints?: object` - 约束条件
  - `optimizationGoals?: object` - 优化目标
- `userId?: string` - 用户ID（可选，用于个性化）

**返回:** `Promise<AIServiceResult<RecipeGenerationResult>>`

```typescript
const result = await generateRecipes({
  keywords: ['现代', '专业', '简洁'],
  mood: ['舒适', '高效'],
  context: '办公环境设计',
  constraints: {
    mode: ['light'],
    accessibility: ['aa']
  },
  optimizationGoals: {
    aesthetic: 0.8,
    accessibility: 0.9,
    uniqueness: 0.7
  }
})

if (result.success) {
  console.log('生成的配方:', result.data.recipes)
  console.log('置信度:', result.data.confidence)
}
```

### 设计助手

#### `getDesignSuggestions(recipe, userId?, focusArea?)`

获取设计改进建议。

**参数:**
- `recipe: StyleRecipe` - 要分析的配方
- `userId?: string` - 用户ID（可选）
- `focusArea?: 'accessibility' | 'aesthetics' | 'usability' | 'performance' | 'all'` - 关注领域

**返回:** `Promise<AIServiceResult<DesignAssistantSuggestion[]>>`

```typescript
const suggestions = await getDesignSuggestions(recipe, 'user-123', 'accessibility')

if (suggestions.success) {
  suggestions.data.forEach(suggestion => {
    console.log(`${suggestion.priority}: ${suggestion.title}`)
    console.log(suggestion.description)
    console.log(`解决方案: ${suggestion.action}`)
  })
}
```

#### `assessDesign(recipe, userId?, context?)`

全面评估设计方案。

**参数:**
- `recipe: StyleRecipe` - 要评估的配方
- `userId?: string` - 用户ID（可选）
- `context?: any` - 评估上下文（可选）

**返回:** `Promise<AIServiceResult<DesignAssessmentResult>>`

```typescript
const assessment = await assessDesign(recipe, 'user-123', {
  deviceType: 'desktop',
  environment: 'office'
})

if (assessment.success) {
  console.log(`总体评分: ${assessment.data.overallScore}/100`)
  console.log(`可访问性: ${assessment.data.categories.accessibility.score}/100`)
  console.log(`美学: ${assessment.data.categories.aesthetics.score}/100`)

  if (assessment.data.criticalIssues.length > 0) {
    console.log('关键问题:', assessment.data.criticalIssues)
  }
}
```

## 🎯 React Hooks

### `useAIRecommendations(options)`

使用AI推荐功能的Hook。

```typescript
const {
  recommendations,
  isLoading,
  error,
  refresh,
  selectRecommendation,
  performance
} = useAIRecommendations({
  userId: 'user-123',
  context: {
    timeOfDay: 'morning',
    deviceType: 'desktop'
  },
  autoRefresh: true,
  refreshInterval: 60000
})
```

### `useAIRecipeGenerator(options)`

使用配方生成功能的Hook。

```typescript
const {
  generate,
  isGenerating,
  error,
  lastResult,
  clearResult
} = useAIRecipeGenerator({
  userId: 'user-123',
  autoGenerate: false
})
```

### `useDesignAssistant(options)`

使用设计助手功能的Hook。

```typescript
const {
  suggestions,
  assessment,
  isAnalyzing,
  error,
  analyze,
  applySuggestion,
  dismissSuggestion
} = useDesignAssistant({
  recipe: currentRecipe,
  userId: 'user-123',
  focusArea: 'all',
  autoAnalyze: true
})
```

### `useUserBehaviorAnalysis(options)`

使用用户行为分析功能的Hook。

```typescript
const {
  analysis,
  isLoading,
  error,
  refresh,
  updatePreferences,
  preferences
} = useUserBehaviorAnalysis({
  userId: 'user-123',
  period: {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: new Date()
  },
  autoRefresh: true
})
```

## ⚙️ 配置选项

### 系统配置

```typescript
import { AISystemManager } from '@xorigo-ui/core/ai'

const aiSystem = new AISystemManager({
  recommendation: {
    maxRecommendations: 5,
    cacheEnabled: true,
    realTimeUpdates: true
  },
  generation: {
    maxGeneratedRecipes: 5,
    creativityLevel: 0.7,
    constraintStrictness: 0.8
  },
  analytics: {
    dataRetentionDays: 90,
    anonymizationEnabled: true,
    realTimeProcessing: true
  },
  designAssistant: {
    strictAccessibilityMode: false,
    enableRealTimeSuggestions: true,
    suggestionPriority: 'balanced'
  },
  performance: {
    enableCaching: true,
    maxCacheSize: 1000,
    cacheTimeout: 5 * 60 * 1000,
    enableBackgroundProcessing: true
  }
})
```

## 📊 性能指标

### 响应时间目标
- **推荐生成**: < 100ms
- **配方生成**: < 500ms
- **设计分析**: < 200ms
- **用户行为分析**: < 50ms

### 缓存策略
- **推荐结果**: 5分钟缓存
- **生成结果**: 10分钟缓存
- **设计建议**: 15分钟缓存
- **用户偏好**: 1小时缓存

### 并发支持
- **最大并发推荐请求**: 1000/秒
- **最大并发生成请求**: 100/秒
- **最大并发分析请求**: 500/秒

## 🔧 高级用法

### 自定义推荐策略

```typescript
import { aiRecommendationEngine } from '@xorigo-ui/core/ai'

// 自定义推荐权重
const customRecommendations = await aiRecommendationEngine.generateRecommendations(userId, {
  // 自定义上下文
  customWeights: {
    userPreference: 0.6,
    contextRelevance: 0.2,
    aestheticHarmony: 0.1,
    accessibilityScore: 0.1
  },
  // 过滤条件
  filters: {
    categories: ['professional', 'modern'],
    minAccessibilityScore: 0.8
  }
})
```

### 批量操作

```typescript
import { aiSystem } from '@xorigo-ui/core/ai'

// 批量获取多个用户的推荐
const userIds = ['user-1', 'user-2', 'user-3']
const batchRecommendations = await Promise.all(
  userIds.map(userId =>
    aiSystem.getRecommendations(userId, { taskType: 'work' })
  )
)

// 批量生成配方
const generationParams = [
  { keywords: ['现代'], mood: ['专业'] },
  { keywords: ['温暖'], mood: ['舒适'] },
  { keywords: ['创意'], mood: ['活力'] }
]

const batchResults = await Promise.all(
  generationParams.map(params =>
    aiSystem.generateRecipes(params)
  )
)
```

### 实时行为跟踪

```typescript
import { aiSystem } from '@xorigo-ui/core/ai'

// 记录用户行为
aiSystem.recordUserEvent('user-123', 'recipe_view', {
  recipeId: 'recipe-id',
  viewDuration: 5000,
  source: 'recommendation'
})

// 获取实时分析
const realTimeAnalysis = userBehaviorAnalyzer.getRealTimeAnalysis('user-123')
console.log('用户参与度:', realTimeAnalysis.immediateInsights.engagementLevel)
```

## 🧪 测试

### 运行测试

```bash
# 运行所有AI系统测试
npm test ai

# 运行特定模块测试
npm test ai-recommendation-engine
npm test ai-recipe-generator
npm test ai-design-assistant

# 运行性能测试
npm test ai -- --performance
```

### 测试覆盖率

```bash
# 生成测试覆盖率报告
npm run test:coverage -- ai

# 查看覆盖率报告
open coverage/lcov-report/index.html
```

## 🔍 故障排除

### 常见问题

**Q: 推荐结果为空或质量不佳**
A: 检查用户是否有足够的行为数据，尝试调用 `updateUserPreferences()` 更新偏好模型

**Q: 配方生成失败**
A: 检查关键词是否有效，确保约束条件不会导致无解

**Q: 设计建议不准确**
A: 确保配方数据完整，检查是否启用了严格可访问性模式

**Q: 性能问题**
A: 检查缓存配置，考虑增加缓存超时时间或减少缓存大小

### 调试模式

```typescript
// 启用调试日志
const aiSystem = new AISystemManager({
  performance: {
    enableCaching: true,
    debugMode: true // 启用调试模式
  }
})

// 获取详细状态
const status = aiSystem.getSystemStatus()
console.log('系统状态:', status)

// 获取性能指标
const metrics = aiRecommendationEngine.getPerformanceMetrics()
console.log('推荐引擎指标:', metrics)
```

## 📚 示例项目

查看 `examples/usage-examples.ts` 获取完整的使用示例，包括：

- 基础功能演示
- React组件集成
- 错误处理最佳实践
- 性能监控示例
- 完整的用户流程演示

## 🤝 贡献

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- 感谢所有贡献者的努力
- 基于现代AI技术构建
- 遵循WCAG可访问性标准
- 参考了设计系统最佳实践

---

**Xorigo UI AI系统** - 让设计更智能，让体验更个性化 🚀