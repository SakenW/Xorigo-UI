/**
 * AI 助手系统核心类型定义
 * 支持 Xorigo UI Workbench 3.0 的智能功能
 */

// ============================================================================
// 核心接口定义
// ============================================================================

/**
 * AI 助手配置
 */
export interface AIAssistantConfig {
  enabled: boolean
  provider: 'claude' | 'openai' | 'local'
  model: string
  apiKey?: string
  maxTokens: number
  temperature: number
  responseTimeout: number
}

/**
 * 用户查询意图分析结果
 */
export interface QueryIntent {
  type: 'component-search' | 'solution-recommendation' | 'code-help' | 'error-fix' | 'best-practice' | 'general'
  confidence: number
  entities: QueryEntity[]
  keywords: string[]
  complexity: 'simple' | 'medium' | 'complex'
  estimatedEffort?: 'low' | 'medium' | 'high'
}

/**
 * 查询实体信息
 */
export interface QueryEntity {
  type: 'component' | 'scenario' | 'category' | 'feature' | 'problem' | 'technology'
  value: string
  confidence: number
  synonyms?: string[]
}

/**
 * AI 响应基础接口
 */
export interface AIResponse {
  id: string
  timestamp: Date
  query: string
  intent: QueryIntent
  response: string
  suggestions: AISuggestion[]
  confidence: number
  processingTime: number
  tokenUsed: number
}

/**
 * AI 建议接口
 */
export interface AISuggestion {
  id: string
  type: 'component' | 'code' | 'configuration' | 'best-practice' | 'fix'
  title: string
  description: string
  action?: SuggestionAction
  priority: 'high' | 'medium' | 'low'
  estimatedImpact?: 'high' | 'medium' | 'low'
  preview?: SuggestionPreview
}

/**
 * 建议动作
 */
export interface SuggestionAction {
  type: 'apply-component' | 'apply-code' | 'open-config' | 'navigate-to' | 'show-example'
  payload: any
  autoApply?: boolean
}

/**
 * 建议预览
 */
export interface SuggestionPreview {
  type: 'component' | 'code' | 'image' | 'layout'
  content: any
  interactive?: boolean
}

// ============================================================================
// 组件推荐系统
// ============================================================================

/**
 * 组件推荐请求
 */
export interface ComponentRecommendationRequest {
  query: string
  context?: {
    currentComponents?: string[]
    projectType?: string
    complexity?: 'simple' | 'medium' | 'complex'
    targetAudience?: 'beginner' | 'intermediate' | 'advanced'
  }
  filters?: {
    categories?: string[]
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
    estimatedTime?: string
    popularity?: number
  }
}

/**
 * 组件推荐结果
 */
export interface ComponentRecommendation {
  id: string
  components: RecommendedComponent[]
  combinations?: ComponentCombination[]
  rationale: string
  alternativeOptions?: AlternativeOption[]
}

/**
 * 推荐的组件
 */
export interface RecommendedComponent {
  component: any
  relevanceScore: number
  reason: string
  usageExample?: string
  configuration?: ComponentConfiguration
  dependencies?: string[]
}

/**
 * 组件组合
 */
export interface ComponentCombination {
  id: string
  name: string
  description: string
  components: string[]
  synergy: number
  useCase: string
  exampleCode?: string
}

/**
 * 替代选项
 */
export interface AlternativeOption {
  id: string
  title: string
  description: string
  pros: string[]
  cons: string[]
  whenToUse: string
}

/**
 * 组件配置
 */
export interface ComponentConfiguration {
  props: Record<string, any>
  variants?: string[]
  theme?: string
  customStyles?: Record<string, any>
}

// ============================================================================
// 代码助手系统
// ============================================================================

/**
 * 代码分析请求
 */
export interface CodeAnalysisRequest {
  code: string
  language: 'typescript' | 'javascript' | 'jsx' | 'tsx'
  context?: {
    framework: string
    libraries: string[]
    projectType: string
  }
  analysisType: 'optimization' | 'bug-detection' | 'best-practices' | 'performance' | 'accessibility'
}

/**
 * 代码分析结果
 */
export interface CodeAnalysisResult {
  id: string
  summary: {
    overallScore: number
    issuesFound: number
    suggestionsCount: number
    estimatedImprovement: string
  }
  issues: CodeIssue[]
  suggestions: CodeSuggestion[]
  optimizedCode?: string
  bestPractices: BestPracticeRecommendation[]
}

/**
 * 代码问题
 */
export interface CodeIssue {
  id: string
  severity: 'error' | 'warning' | 'info'
  type: 'syntax' | 'logic' | 'performance' | 'security' | 'accessibility' | 'best-practice'
  title: string
  description: string
  line?: number
  column?: number
  fix?: CodeFix
}

/**
 * 代码修复
 */
export interface CodeFix {
  type: 'replace' | 'insert' | 'delete' | 'restructure'
  description: string
  code: string
  autoApplicable: boolean
  confidence: number
}

/**
 * 代码建议
 */
export interface CodeSuggestion {
  id: string
  type: 'optimization' | 'refactoring' | 'modernization' | 'readability'
  title: string
  description: string
  benefit: string
  exampleBefore: string
  exampleAfter: string
  impact: 'high' | 'medium' | 'low'
  effort: 'low' | 'medium' | 'high'
}

/**
 * 最佳实践建议
 */
export interface BestPracticeRecommendation {
  id: string
  category: 'react' | 'typescript' | 'accessibility' | 'performance' | 'security'
  title: string
  description: string
  importance: 'critical' | 'important' | 'recommended'
  resources: BestPracticeResource[]
}

/**
 * 最佳实践资源
 */
export interface BestPracticeResource {
  type: 'documentation' | 'example' | 'tutorial' | 'tool'
  title: string
  url?: string
  content?: string
}

// ============================================================================
// 错误诊断系统
// ============================================================================

/**
 * 错误诊断请求
 */
export interface ErrorDiagnosisRequest {
  error: {
    message: string
    stack?: string
    type?: string
    code?: string
  }
  context: {
    component?: string
    props?: any
    state?: any
    environment: 'development' | 'production'
  }
  code?: string
}

/**
 * 错误诊断结果
 */
export interface ErrorDiagnosisResult {
  id: string
  diagnosis: {
    type: 'syntax' | 'runtime' | 'logic' | 'type' | 'dependency' | 'performance'
    severity: 'critical' | 'error' | 'warning'
    confidence: number
    explanation: string
    rootCause: string
  }
  solutions: ErrorSolution[]
  prevention: ErrorPrevention[]
  relatedResources: ErrorResource[]
}

/**
 * 错误解决方案
 */
export interface ErrorSolution {
  id: string
  type: 'fix' | 'workaround' | 'refactor'
  title: string
  description: string
  steps: string[]
  codeExample?: string
  applicability: 'immediate' | 'planned' | 'conditional'
  confidence: number
}

/**
 * 错误预防措施
 */
export interface ErrorPrevention {
  id: string
  title: string
  description: string
  practices: string[]
  tools?: string[]
  monitoring?: string[]
}

/**
 * 错误相关资源
 */
export interface ErrorResource {
  type: 'documentation' | 'example' | 'discussion' | 'tool'
  title: string
  url?: string
  description: string
  relevance: number
}

// ============================================================================
// 智能对话系统
// ============================================================================

/**
 * 对话消息
 */
export interface ConversationMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  attachments?: MessageAttachment[]
  metadata?: MessageMetadata
}

/**
 * 消息附件
 */
export interface MessageAttachment {
  type: 'code' | 'image' | 'component' | 'configuration'
  content: any
  metadata?: Record<string, any>
}

/**
 * 消息元数据
 */
export interface MessageMetadata {
  intent?: QueryIntent
  suggestions?: AISuggestion[]
  relatedComponents?: string[]
  processingTime?: number
  confidence?: number
}

/**
 * 对话会话
 */
export interface ConversationSession {
  id: string
  title: string
  messages: ConversationMessage[]
  context: ConversationContext
  createdAt: Date
  updatedAt: Date
  metadata: SessionMetadata
}

/**
 * 对话上下文
 */
export interface ConversationContext {
  currentProject?: string
  activeComponents?: string[]
  currentView?: string
  userPreferences?: UserPreferences
  previousQueries?: string[]
  knowledgeBase?: string[]
}

/**
 * 用户偏好
 */
export interface UserPreferences {
  expertise: 'beginner' | 'intermediate' | 'advanced'
  preferredLanguage: 'zh-CN' | 'en-US'
  communicationStyle: 'concise' | 'detailed' | 'tutorial'
  autoApplySuggestions: boolean
  showCodeExamples: boolean
  enableVoiceInput: boolean
}

/**
 * 会话元数据
 */
export interface SessionMetadata {
  messagesCount: number
  averageResponseTime: number
  userSatisfaction?: number
  resolvedIssues: number
  suggestedComponents: number
  appliedSuggestions: number
}

// ============================================================================
// 系统状态管理
// ============================================================================

/**
 * AI 助手状态
 */
export interface AIAssistantState {
  isOnline: boolean
  isProcessing: boolean
  currentSession?: string
  lastResponse?: AIResponse
  errors: AIError[]
  statistics: AIStatistics
  configuration: AIAssistantConfig
}

/**
 * AI 错误
 */
export interface AIError {
  id: string
  type: 'network' | 'api' | 'parsing' | 'timeout' | 'quota'
  message: string
  timestamp: Date
  resolved: boolean
}

/**
 * AI 统计信息
 */
export interface AIStatistics {
  totalQueries: number
  averageResponseTime: number
  successRate: number
  popularQueries: Array<{
    query: string
    count: number
  }>
  componentRecommendations: number
  issuesResolved: number
  userSatisfaction: number
}

// ============================================================================
// 事件系统
// ============================================================================

/**
 * AI 助手事件
 */
export type AIAssistantEvent =
  | { type: 'query-started'; payload: { query: string } }
  | { type: 'query-completed'; payload: { response: AIResponse } }
  | { type: 'suggestion-applied'; payload: { suggestion: AISuggestion } }
  | { type: 'error-occurred'; payload: { error: AIError } }
  | { type: 'session-started'; payload: { sessionId: string } }
  | { type: 'session-ended'; payload: { sessionId: string } }
  | { type: 'component-recommended'; payload: { recommendation: ComponentRecommendation } }
  | { type: 'code-analyzed'; payload: { analysis: CodeAnalysisResult } }
  | { type: 'error-diagnosed'; payload: { diagnosis: ErrorDiagnosisResult } }

// ============================================================================
// 工具函数类型
// ============================================================================

/**
 * AI 助手接口
 */
export interface IAIAssistant {
  // 查询处理
  processQuery(query: string, context?: any): Promise<AIResponse>

  // 组件推荐
  recommendComponents(request: ComponentRecommendationRequest): Promise<ComponentRecommendation>

  // 代码分析
  analyzeCode(request: CodeAnalysisRequest): Promise<CodeAnalysisResult>

  // 错误诊断
  diagnoseError(request: ErrorDiagnosisRequest): Promise<ErrorDiagnosisResult>

  // 对话管理
  startSession(context?: ConversationContext): Promise<string>
  endSession(sessionId: string): Promise<void>
  sendMessage(sessionId: string, message: string): Promise<ConversationMessage>

  // 配置管理
  updateConfiguration(config: Partial<AIAssistantConfig>): Promise<void>
  getConfiguration(): Promise<AIAssistantConfig>

  // 统计信息
  getStatistics(): Promise<AIStatistics>

  // 事件监听
  on(event: string, handler: (event: AIAssistantEvent) => void): void
  off(event: string, handler: (event: AIAssistantEvent) => void): void
}