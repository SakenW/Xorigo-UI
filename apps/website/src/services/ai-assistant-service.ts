import { useState, useEffect, useCallback } from 'react'

/**
 * AI 助手核心服务
 * 提供智能查询处理、组件推荐、代码分析和错误诊断功能
 */

import type {
  AIAssistantConfig,
  AIResponse,
  QueryIntent,
  AISuggestion,
  ComponentRecommendationRequest,
  ComponentRecommendation,
  CodeAnalysisRequest,
  CodeAnalysisResult,
  ErrorDiagnosisRequest,
  ErrorDiagnosisResult,
  ConversationSession,
  AIAssistantEvent,
  IAIAssistant,
  AIAssistantState,
  AIStatistics
} from '@/types/ai-assistant'

// ============================================================================
// 核心服务实现
// ============================================================================

export class AIAssistantService implements IAIAssistant {
  private config: AIAssistantConfig
  private state: AIAssistantState
  private eventListeners: Map<string, Function[]> = new Map()
  private sessions: Map<string, ConversationSession> = new Map()
  private statistics: AIStatistics

  constructor(config: Partial<AIAssistantConfig> = {}) {
    this.config = {
      enabled: true,
      provider: 'claude',
      model: 'claude-3-sonnet-20241022',
      maxTokens: 4000,
      temperature: 0.7,
      responseTimeout: 30000,
      ...config
    }

    this.state = {
      isOnline: true,
      isProcessing: false,
      errors: [],
      statistics: {
        totalQueries: 0,
        averageResponseTime: 0,
        successRate: 0,
        popularQueries: [],
        componentRecommendations: 0,
        issuesResolved: 0,
        userSatisfaction: 0
      },
      configuration: this.config
    }

    this.statistics = this.state.statistics
  }

  // ============================================================================
  // 查询处理
  // ============================================================================

  async processQuery(query: string, context?: any): Promise<AIResponse> {
    const startTime = Date.now()
    this.emit({ type: 'query-started', payload: { query } })

    try {
      this.state.isProcessing = true

      // 1. 分析查询意图
      const intent = await this.analyzeIntent(query, context)

      // 2. 根据意图生成响应
      const response = await this.generateResponse(query, intent, context)

      // 3. 生成建议
      const suggestions = await this.generateSuggestions(query, intent, context)

      const aiResponse: AIResponse = {
        id: this.generateId(),
        timestamp: new Date(),
        query,
        intent,
        response,
        suggestions,
        confidence: intent.confidence,
        processingTime: Date.now() - startTime,
        tokenUsed: this.estimateTokens(query + response)
      }

      // 更新统计信息
      this.updateStatistics(aiResponse)

      this.state.lastResponse = aiResponse
      this.emit({ type: 'query-completed', payload: { response: aiResponse } })

      return aiResponse
    } catch (error) {
      const aiError = {
        id: this.generateId(),
        type: 'api' as const,
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
        resolved: false
      }

      this.state.errors.push(aiError)
      this.emit({ type: 'error-occurred', payload: { error: aiError } })

      throw error
    } finally {
      this.state.isProcessing = false
    }
  }

  private async analyzeIntent(query: string, context?: any): Promise<QueryIntent> {
    const lowerQuery = query.toLowerCase()

    // 基于关键词的意图分析
    const intentPatterns = [
      {
        type: 'component-search' as const,
        keywords: ['组件', 'component', '用什么', '如何实现', '怎么建', 'component推荐'],
        patterns: [/推荐.*组件/, /用什么组件/, /如何实现.*组件/, /build.*component/]
      },
      {
        type: 'solution-recommendation' as const,
        keywords: ['方案', '解决方案', '如何做', '怎么实现', '最佳实践'],
        patterns: [/解决方案/, /最佳方案/, /如何实现/, /实现.*功能/]
      },
      {
        type: 'code-help' as const,
        keywords: ['代码', 'code', '编程', '实现', '优化'],
        patterns: [/代码.*优化/, /怎么写/, /编程.*帮助/, /实现.*代码/]
      },
      {
        type: 'error-fix' as const,
        keywords: ['错误', 'error', 'bug', '问题', '报错'],
        patterns: [/.*报错/, /.*错误/, /解决.*问题/, /修复.*bug/]
      },
      {
        type: 'best-practice' as const,
        keywords: ['最佳实践', '规范', '标准', '建议'],
        patterns: [/最佳实践/, /规范建议/, /标准做法/, /推荐做法/]
      }
    ]

    let detectedType: QueryIntent['type'] = 'general'
    let maxConfidence = 0.3

    for (const pattern of intentPatterns) {
      const hasKeyword = pattern.keywords.some(keyword => lowerQuery.includes(keyword))
      const hasPattern = pattern.patterns.some(p => p.test(lowerQuery))

      if (hasKeyword || hasPattern) {
        const confidence = hasKeyword && hasPattern ? 0.9 : 0.7
        if (confidence > maxConfidence) {
          detectedType = pattern.type
          maxConfidence = confidence
        }
      }
    }

    // 提取实体
    const entities = this.extractEntities(query, detectedType)

    // 分析复杂度
    const complexity = this.analyzeComplexity(query, entities)

    return {
      type: detectedType,
      confidence: maxConfidence,
      entities,
      keywords: this.extractKeywords(query),
      complexity,
      estimatedEffort: this.estimateEffort(complexity, detectedType)
    }
  }

  private extractEntities(query: string, intentType: QueryIntent['type']): QueryEntity[] {
    const entities: QueryEntity[] = []
    const lowerQuery = query.toLowerCase()

    // 组件名称实体
    const componentNames = [
      'button', 'input', 'form', 'card', 'modal', 'table', 'navigation', 'sidebar',
      '按钮', '输入框', '表单', '卡片', '对话框', '表格', '导航', '侧边栏'
    ]

    componentNames.forEach(name => {
      if (lowerQuery.includes(name)) {
        entities.push({
          type: 'component',
          value: name,
          confidence: 0.8
        })
      }
    })

    // 功能实体
    const features = [
      'login', 'register', 'search', 'filter', 'upload', 'download', 'edit', 'delete',
      '登录', '注册', '搜索', '筛选', '上传', '下载', '编辑', '删除'
    ]

    features.forEach(feature => {
      if (lowerQuery.includes(feature)) {
        entities.push({
          type: 'feature',
          value: feature,
          confidence: 0.7
        })
      }
    })

    return entities
  }

  private extractKeywords(query: string): string[] {
    // 简单的关键词提取
    const stopWords = ['的', '了', '是', '在', '有', '和', '与', '或', 'the', 'a', 'an', 'is', 'are', 'of', 'in', 'and', 'or']
    const words = query.toLowerCase()
      .replace(/[^\w\s\u4e00-\u9fa5]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 1 && !stopWords.includes(word))

    return [...new Set(words)]
  }

  private analyzeComplexity(query: string, entities: QueryEntity[]): QueryIntent['complexity'] {
    const wordCount = query.split(/\s+/).length
    const entityCount = entities.length

    if (wordCount > 20 || entityCount > 3) {
      return 'complex'
    } else if (wordCount > 10 || entityCount > 1) {
      return 'medium'
    } else {
      return 'simple'
    }
  }

  private estimateEffort(complexity: QueryIntent['complexity'], intentType: QueryIntent['type']): 'low' | 'medium' | 'high' {
    const effortMatrix: Record<QueryIntent['complexity'], Record<QueryIntent['type'], 'low' | 'medium' | 'high'>> = {
      simple: {
        'component-search': 'low',
        'solution-recommendation': 'low',
        'code-help': 'low',
        'error-fix': 'medium',
        'best-practice': 'low',
        'general': 'low'
      },
      medium: {
        'component-search': 'medium',
        'solution-recommendation': 'medium',
        'code-help': 'medium',
        'error-fix': 'high',
        'best-practice': 'medium',
        'general': 'medium'
      },
      complex: {
        'component-search': 'high',
        'solution-recommendation': 'high',
        'code-help': 'high',
        'error-fix': 'high',
        'best-practice': 'medium',
        'general': 'high'
      }
    }

    return effortMatrix[complexity][intentType]
  }

  private async generateResponse(query: string, intent: QueryIntent, context?: any): Promise<string> {
    const responses = {
      'component-search': this.generateComponentSearchResponse(query, intent, context),
      'solution-recommendation': this.generateSolutionRecommendationResponse(query, intent, context),
      'code-help': this.generateCodeHelpResponse(query, intent, context),
      'error-fix': this.generateErrorFixResponse(query, intent, context),
      'best-practice': this.generateBestPracticeResponse(query, intent, context),
      'general': this.generateGeneralResponse(query, intent, context)
    }

    return responses[intent.type]
  }

  private generateComponentSearchResponse(query: string, intent: QueryIntent, context?: any): string {
    const componentEntities = intent.entities.filter(e => e.type === 'component')
    const featureEntities = intent.entities.filter(e => e.type === 'feature')

    if (componentEntities.length > 0) {
      const components = componentEntities.map(e => e.value).join('、')
      return `基于您的需求，我为您推荐以下组件：${components}。这些组件非常适合您要实现的功能。我可以为您提供具体的配置示例和使用方法。`
    } else if (featureEntities.length > 0) {
      const features = featureEntities.map(e => e.value).join('、')
      return `对于${features}功能，我推荐使用相关的基础组件组合。让我为您分析最适合的组件方案。`
    } else {
      return `我理解您需要组件推荐。让我根据您的具体需求，为您推荐最合适的组件组合。`
    }
  }

  private generateSolutionRecommendationResponse(query: string, intent: QueryIntent, context?: any): string {
    return `基于您的需求，我可以为您提供完整的解决方案建议。让我分析您的项目需求，并推荐最佳的技术方案和组件组合。`
  }

  private generateCodeHelpResponse(query: string, intent: QueryIntent, context?: any): string {
    return `我很乐意帮助您解决代码问题。请提供具体的代码或详细描述您遇到的问题，我会为您提供优化建议和最佳实践指导。`
  }

  private generateErrorFixResponse(query: string, intent: QueryIntent, context?: any): string {
    return `我理解您遇到了错误问题。请提供具体的错误信息和相关代码，我会帮您分析问题并提供解决方案。`
  }

  private generateBestPracticeResponse(query: string, intent: QueryIntent, context?: any): string {
    return `让我为您提供相关的最佳实践建议。我会根据您的具体场景，推荐合适的开发规范和优化策略。`
  }

  private generateGeneralResponse(query: string, intent: QueryIntent, context?: any): string {
    return `我理解您的需求。作为您的AI助手，我会尽力帮助您解决问题。请让我了解更多细节，以便提供更准确的建议。`
  }

  private async generateSuggestions(query: string, intent: QueryIntent, context?: any): Promise<AISuggestion[]> {
    const suggestions: AISuggestion[] = []

    switch (intent.type) {
      case 'component-search':
        suggestions.push(...this.generateComponentSuggestions(intent))
        break
      case 'code-help':
        suggestions.push(...this.generateCodeHelpSuggestions(intent))
        break
      case 'error-fix':
        suggestions.push(...this.generateErrorFixSuggestions(intent))
        break
      case 'best-practice':
        suggestions.push(...this.generateBestPracticeSuggestions(intent))
        break
    }

    return suggestions
  }

  private generateComponentSuggestions(intent: QueryIntent): AISuggestion[] {
    return [
      {
        id: this.generateId(),
        type: 'component',
        title: '查看推荐组件',
        description: '浏览为您推荐的相关组件',
        action: {
          type: 'navigate-to',
          payload: { view: 'components', category: 'all' }
        },
        priority: 'high'
      },
      {
        id: this.generateId(),
        type: 'configuration',
        title: '查看配置示例',
        description: '查看推荐的组件配置示例',
        action: {
          type: 'show-example',
          payload: { type: 'component-configuration' }
        },
        priority: 'medium'
      }
    ]
  }

  private generateCodeHelpSuggestions(intent: QueryIntent): AISuggestion[] {
    return [
      {
        id: this.generateId(),
        type: 'code',
        title: '代码优化分析',
        description: '分析您的代码并提供优化建议',
        action: {
          type: 'open-config',
          payload: { feature: 'code-analysis' }
        },
        priority: 'high'
      }
    ]
  }

  private generateErrorFixSuggestions(intent: QueryIntent): AISuggestion[] {
    return [
      {
        id: this.generateId(),
        type: 'fix',
        title: '错误诊断工具',
        description: '使用AI错误诊断工具分析问题',
        action: {
          type: 'open-config',
          payload: { feature: 'error-diagnosis' }
        },
        priority: 'high'
      }
    ]
  }

  private generateBestPracticeSuggestions(intent: QueryIntent): AISuggestion[] {
    return [
      {
        id: this.generateId(),
        type: 'best-practice',
        title: '最佳实践指南',
        description: '查看相关的最佳实践和开发规范',
        action: {
          type: 'show-example',
          payload: { type: 'best-practices' }
        },
        priority: 'medium'
      }
    ]
  }

  // ============================================================================
  // 组件推荐
  // ============================================================================

  async recommendComponents(request: ComponentRecommendationRequest): Promise<ComponentRecommendation> {
    // 模拟组件推荐逻辑
    const recommendedComponents = [
      {
        component: { name: 'Button', category: 'base', description: '基础按钮组件' },
        relevanceScore: 0.95,
        reason: '按钮是最常用的交互组件，适合您的需求',
        usageExample: '<Button variant="primary">点击按钮</Button>',
        configuration: { variant: 'primary', size: 'md' }
      },
      {
        component: { name: 'Card', category: 'data', description: '数据展示卡片' },
        relevanceScore: 0.85,
        reason: '卡片组件适合展示结构化内容',
        usageExample: '<Card><CardContent>卡片内容</CardContent></Card>',
        configuration: { variant: 'elevated' }
      }
    ]

    const combinations = [
      {
        id: 'button-in-card',
        name: '按钮卡片组合',
        description: '在卡片中放置操作按钮',
        components: ['Button', 'Card'],
        synergy: 0.9,
        useCase: '表单提交、操作确认'
      }
    ]

    return {
      id: this.generateId(),
      components: recommendedComponents,
      combinations,
      rationale: '基于您的需求，我推荐这些常用且功能强大的组件组合',
      alternativeOptions: [
        {
          id: 'alternative-1',
          title: '简化方案',
          description: '使用更简单的组件实现',
          pros: ['简单易用', '性能好'],
          cons: ['功能有限'],
          whenToUse: '简单需求场景'
        }
      ]
    }
  }

  // ============================================================================
  // 代码分析
  // ============================================================================

  async analyzeCode(request: CodeAnalysisRequest): Promise<CodeAnalysisResult> {
    // 模拟代码分析
    return {
      id: this.generateId(),
      summary: {
        overallScore: 85,
        issuesFound: 2,
        suggestionsCount: 3,
        estimatedImprovement: '20%性能提升'
      },
      issues: [
        {
          id: 'issue-1',
          severity: 'warning',
          type: 'performance',
          title: '未优化的重渲染',
          description: '组件可能导致不必要的重渲染',
          line: 15,
          fix: {
            type: 'replace',
            description: '使用React.memo优化',
            code: 'export default React.memo(ComponentName)',
            autoApplicable: true,
            confidence: 0.9
          }
        }
      ],
      suggestions: [
        {
          id: 'suggestion-1',
          type: 'optimization',
          title: '使用useMemo优化计算',
          description: '对复杂计算使用useMemo缓存结果',
          benefit: '提升渲染性能',
          exampleBefore: 'const expensiveValue = computeExpensiveValue(data)',
          exampleAfter: 'const expensiveValue = useMemo(() => computeExpensiveValue(data), [data])',
          impact: 'medium',
          effort: 'low'
        }
      ],
      optimizedCode: '// 优化后的代码示例\nexport default React.memo(ComponentName)',
      bestPractices: [
        {
          id: 'bp-1',
          category: 'react',
          title: '使用函数组件',
          description: '推荐使用函数组件而非类组件',
          importance: 'important',
          resources: [
            {
              type: 'documentation',
              title: 'React函数组件文档',
              url: 'https://react.dev/learn'
            }
          ]
        }
      ]
    }
  }

  // ============================================================================
  // 错误诊断
  // ============================================================================

  async diagnoseError(request: ErrorDiagnosisRequest): Promise<ErrorDiagnosisResult> {
    // 模拟错误诊断
    return {
      id: this.generateId(),
      diagnosis: {
        type: 'runtime',
        severity: 'error',
        confidence: 0.95,
        explanation: '这是一个常见的React运行时错误',
        rootCause: '组件状态更新时机不当'
      },
      solutions: [
        {
          id: 'solution-1',
          type: 'fix',
          title: '修复状态更新逻辑',
          description: '调整组件状态更新的时机',
          steps: [
            '检查useEffect依赖数组',
            '确保状态更新在正确的时机执行',
            '使用回调函数处理异步状态更新'
          ],
          codeExample: 'setState(prevState => ({ ...prevState, newValue }))',
          applicability: 'immediate',
          confidence: 0.9
        }
      ],
      prevention: [
        {
          id: 'prevention-1',
          title: '代码审查检查点',
          description: '建立代码审查机制，提前发现潜在问题',
          practices: [
            '使用TypeScript严格模式',
            '添加单元测试覆盖',
            '使用ESLint规则检查'
          ]
        }
      ],
      relatedResources: [
        {
          type: 'documentation',
          title: 'React错误处理指南',
          url: 'https://react.dev/reference/react',
          description: '官方错误处理最佳实践',
          relevance: 0.95
        }
      ]
    }
  }

  // ============================================================================
  // 对话管理
  // ============================================================================

  async startSession(context?: any): Promise<string> {
    const sessionId = this.generateId()
    const session: ConversationSession = {
      id: sessionId,
      title: '新的AI助手对话',
      messages: [],
      context: {
        ...context,
        createdAt: new Date()
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {
        messagesCount: 0,
        averageResponseTime: 0,
        resolvedIssues: 0,
        suggestedComponents: 0,
        appliedSuggestions: 0
      }
    }

    this.sessions.set(sessionId, session)
    this.emit({ type: 'session-started', payload: { sessionId } })

    return sessionId
  }

  async endSession(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId)
    if (session) {
      this.sessions.delete(sessionId)
      this.emit({ type: 'session-ended', payload: { sessionId } })
    }
  }

  async sendMessage(sessionId: string, message: string): Promise<ConversationMessage> {
    const session = this.sessions.get(sessionId)
    if (!session) {
      throw new Error('Session not found')
    }

    const userMessage: ConversationMessage = {
      id: this.generateId(),
      role: 'user',
      content: message,
      timestamp: new Date()
    }

    session.messages.push(userMessage)

    // 处理AI响应
    const response = await this.processQuery(message, session.context)

    const assistantMessage: ConversationMessage = {
      id: this.generateId(),
      role: 'assistant',
      content: response.response,
      timestamp: new Date(),
      metadata: {
        intent: response.intent,
        suggestions: response.suggestions,
        processingTime: response.processingTime,
        confidence: response.confidence
      }
    }

    session.messages.push(assistantMessage)
    session.updatedAt = new Date()
    session.metadata.messagesCount = session.messages.length

    return assistantMessage
  }

  // ============================================================================
  // 配置和统计
  // ============================================================================

  async updateConfiguration(config: Partial<AIAssistantConfig>): Promise<void> {
    this.config = { ...this.config, ...config }
    this.state.configuration = this.config
  }

  async getConfiguration(): Promise<AIAssistantConfig> {
    return { ...this.config }
  }

  async getStatistics(): Promise<AIStatistics> {
    return { ...this.statistics }
  }

  // ============================================================================
  // 事件系统
  // ============================================================================

  on(event: string, handler: (event: AIAssistantEvent) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, [])
    }
    this.eventListeners.get(event)!.push(handler)
  }

  off(event: string, handler: (event: AIAssistantEvent) => void): void {
    const handlers = this.eventListeners.get(event)
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }

  private emit(event: AIAssistantEvent): void {
    const handlers = this.eventListeners.get(event.type)
    if (handlers) {
      handlers.forEach(handler => handler(event))
    }
  }

  // ============================================================================
  // 工具方法
  // ============================================================================

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private estimateTokens(text: string): number {
    // 简单的token估算（实际应该使用tokenizer）
    return Math.ceil(text.length / 4)
  }

  private updateStatistics(response: AIResponse): void {
    this.statistics.totalQueries++

    // 更新平均响应时间
    const totalResponseTime = this.statistics.averageResponseTime * (this.statistics.totalQueries - 1) + response.processingTime
    this.statistics.averageResponseTime = totalResponseTime / this.statistics.totalQueries

    // 更新成功率（模拟）
    this.statistics.successRate = 0.95

    // 更新热门查询
    const existingQuery = this.statistics.popularQueries.find(q => q.query === response.query)
    if (existingQuery) {
      existingQuery.count++
    } else {
      this.statistics.popularQueries.push({ query: response.query, count: 1 })
    }

    // 保持热门查询数量在合理范围
    this.statistics.popularQueries = this.statistics.popularQueries
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }

  // 公共方法获取当前状态
  getState(): AIAssistantState {
    return { ...this.state }
  }

  // 公共方法获取活跃会话
  getActiveSession(): ConversationSession | undefined {
    return this.sessions.get(this.state.currentSession || '')
  }
}

// ============================================================================
// 单例实例
// ============================================================================

export const aiAssistantService = new AIAssistantService()

// ============================================================================
// React Hook 集成
// ============================================================================

export function useAIAssistant() {
  const [state, setState] = useState<AIAssistantState>(aiAssistantService.getState())
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const updateState = () => setState(aiAssistantService.getState())

    aiAssistantService.on('query-started', updateState)
    aiAssistantService.on('query-completed', updateState)
    aiAssistantService.on('error-occurred', updateState)

    return () => {
      aiAssistantService.off('query-started', updateState)
      aiAssistantService.off('query-completed', updateState)
      aiAssistantService.off('error-occurred', updateState)
    }
  }, [])

  const processQuery = useCallback(async (query: string, context?: any) => {
    setIsProcessing(true)
    try {
      const response = await aiAssistantService.processQuery(query, context)
      return response
    } finally {
      setIsProcessing(false)
    }
  }, [])

  return {
    state,
    isProcessing,
    processQuery,
    service: aiAssistantService
  }
}