/**
 * 智能推荐系统类型定义
 */

export interface UserBehavior {
  /** 用户ID */
  userId?: string
  /** 会话ID */
  sessionId: string
  /** 行为类型 */
  type: 'search' | 'view' | 'copy' | 'edit' | 'favorite' | 'share' | 'download'
  /** 目标组件 */
  componentId: string
  /** 搜索查询（搜索行为） */
  query?: string
  /** 时间戳 */
  timestamp: Date
  /** 持续时间（查看行为） */
  duration?: number
  /** 上下文信息 */
  context?: {
    category?: string
    filters?: string[]
    source?: string
    referrer?: string
  }
  /** 评分 */
  rating?: number
  /** 反馈 */
  feedback?: 'positive' | 'negative' | 'neutral'
}

export interface UserProfile {
  /** 用户ID */
  userId?: string
  /** 兴趣分类 */
  interests: Record<string, number>
  /** 技能水平 */
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  /** 偏好的组件复杂度 */
  preferredComplexity: Record<string, number>
  /** 常用的组件 */
  frequentlyUsed: Array<{
    componentId: string
    frequency: number
    lastUsed: Date
  }>
  /** 搜索模式 */
  searchPatterns: {
    commonQueries: string[]
    preferredCategories: string[]
    averageSessionDuration: number
  }
  /** 创建时间 */
  createdAt: Date
  /** 最后更新时间 */
  updatedAt: Date
}

export interface RecommendationStrategy {
  /** 策略ID */
  id: string
  /** 策略名称 */
  name: string
  /** 策略描述 */
  description: string
  /** 权重 */
  weight: number
  /** 是否启用 */
  enabled: boolean
  /** 推荐逻辑 */
  recommend: (
    userProfile: UserProfile,
    behaviors: UserBehavior[],
    components: any[],
    context?: any
  ) => RecommendationResult[]
}

export interface RecommendationResult {
  /** 组件ID */
  componentId: string
  /** 组件对象 */
  component: any
  /** 推荐分数 */
  score: number
  /** 推荐原因 */
  reasons: string[]
  /** 推荐策略 */
  strategy: string
  /** 置信度 */
  confidence: number
  /** 预期的用户行为 */
  expectedAction?: 'view' | 'copy' | 'edit' | 'favorite'
  /** 推荐时间 */
  timestamp: Date
  /** 附加信息 */
  metadata?: Record<string, any>
}

export interface RecommendationContext {
  /** 当前页面 */
  page: string
  /** 当前搜索查询 */
  currentQuery?: string
  /** 当前组件 */
  currentComponent?: string
  /** 会话信息 */
  session: {
    duration: number
    interactions: number
    bounceRate: number
  }
  /** 设备信息 */
  device: {
    type: 'desktop' | 'tablet' | 'mobile'
    screenResolution: string
  }
  /** 时间信息 */
  time: {
    hour: number
    dayOfWeek: number
    isWeekend: boolean
  }
}

export interface RecommendationConfig {
  /** 最大推荐数量 */
  maxRecommendations: number
  /** 最小推荐分数 */
  minScore: number
  /** 是否启用实时更新 */
  enableRealTimeUpdates: boolean
  /** 缓存过期时间(分钟) */
  cacheExpiration: number
  /** 是否启用学习模式 */
  enableLearning: boolean
  /** 推荐策略配置 */
  strategies: {
    collaborative: { enabled: boolean; weight: number }
    contentBased: { enabled: boolean; weight: number }
    popularity: { enabled: boolean; weight: number }
    contextual: { enabled: boolean; weight: number }
    trending: { enabled: boolean; weight: number }
  }
}

export interface RecommendationEngine {
  /** 记录用户行为 */
  trackBehavior(behavior: UserBehavior): void
  /** 获取推荐 */
  getRecommendations(
    userProfile: UserProfile,
    context?: RecommendationContext
  ): Promise<RecommendationResult[]>
  /** 获取相似组件 */
  getSimilarComponents(componentId: string, limit?: number): Promise<RecommendationResult[]>
  /** 获取热门组件 */
  getTrendingComponents(timeWindow?: number): Promise<RecommendationResult[]>
  /** 更新用户反馈 */
  updateFeedback(
    componentId: string,
    feedback: 'positive' | 'negative',
    context?: any
  ): void
  /** 训练模型 */
  trainModel?: () => Promise<void>
  /** 获取推荐解释 */
  getExplanation(recommendation: RecommendationResult): string
}