/**
 * AI Assistant 模块导出
 */

export { NaturalLanguageQuery } from './natural-language-query'
export { ComponentRecommendationEngine } from './component-recommendation-engine'
export { SmartCodeAssistant } from './smart-code-assistant'
export { ErrorDiagnosisSystem } from './error-diagnosis-system'
export { AIAssistantPanel } from './ai-assistant-panel'
export { FloatingAIButton, QuickTip, KeyboardHint } from './floating-ai-button'

// 类型导出
export type {
  AIAssistantConfig,
  AIResponse,
  QueryIntent,
  AISuggestion,
  ComponentRecommendationRequest,
  ComponentRecommendation,
  RecommendedComponent,
  ComponentCombination,
  CodeAnalysisRequest,
  CodeAnalysisResult,
  ErrorDiagnosisRequest,
  ErrorDiagnosisResult,
  ConversationMessage,
  AIAssistantState
} from '@/types/ai-assistant'

// 服务导出
export { aiAssistantService, useAIAssistant } from '@/services/ai-assistant-service'