/**
 * 自然语言解析器 - 核心解析引擎
 * 将用户描述转换为组件代码需求
 */

import Anthropic from '@anthropic-ai/sdk'
import { IntentClassifier } from './intent-classifier.js'
import { PropExtractor } from './prop-extractor.js'
import {
  ParseResult,
  IntentType,
  ComponentType,
  ComponentProps,
  StyleAttributes,
  Language,
  ParserConfig,
  PerformanceMetrics,
  ParseError,
  Entity
} from './types.js'

/**
 * 自然语言解析器类
 */
export class NLPParser {
  private claude: Anthropic | null = null
  private intentClassifier: IntentClassifier
  private propExtractor: PropExtractor
  private config: ParserConfig

  // 缓存机制
  private cache = new Map<string, { result: ParseResult; timestamp: number }>()
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5分钟

  // 性能监控
  private metrics: PerformanceMetrics[] = []

  constructor(config: ParserConfig) {
    this.config = {
      language: 'zh',
      temperature: 0.1,
      maxTokens: 4000,
      timeout: 10000,
      enableCache: true,
      cacheTTL: 5 * 60 * 1000,
      maxRetries: 3,
      ...config
    }

    // 初始化Claude API
    if (this.config.model) {
      this.claude = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY || '',
        timeout: this.config.timeout
      })
    }

    // 初始化组件
    this.intentClassifier = new IntentClassifier(this.config)
    this.propExtractor = new PropExtractor(this.config)
  }

  /**
   * 解析用户输入
   */
  async parse(input: string): Promise<ParseResult> {
    const startTime = Date.now()
    const language = this.detectLanguage(input)

    try {
      // 检查缓存
      if (this.config.enableCache) {
        const cached = this.getFromCache(input, language)
        if (cached) {
          return {
            ...cached,
            context: { ...cached.context, cacheHit: true }
          }
        }
      }

      // 1. 意图分类
      const intent = await this.intentClassifier.classifyIntent(input, language)

      // 2. 实体抽取
      const entities = await this.intentClassifier.extractEntities(input, language)

      // 3. 组件类型检测
      const componentType = this.detectComponentType(input, language, entities)

      // 4. 属性提取
      const props = await this.propExtractor.extractProps(input, language, entities)

      // 5. 样式提取
      const style = await this.propExtractor.extractStyles(input, language, entities)

      // 6. 需求和约束提取
      const { requirements, constraints } = this.extractRequirements(input, language)

      // 7. 建议生成
      const suggestions = this.generateSuggestions(input, language, componentType, props)

      // 8. 计算置信度
      const confidence = this.calculateConfidence(intent, entities, componentType)

      // 构建结果
      const result: ParseResult = {
        intent,
        component: componentType,
        props,
        style,
        entities,
        requirements,
        constraints,
        language,
        confidence,
        suggestions,
        context: {
          timestamp: Date.now(),
          inputLength: input.length
        }
      }

      // 缓存结果
      if (this.config.enableCache) {
        this.addToCache(input, language, result)
      }

      // 记录性能指标
      const latency = Date.now() - startTime
      this.recordMetrics({
        latency,
        tokenCount: this.estimateTokenCount(input),
        cost: this.estimateCost(input),
        cacheHit: false,
        retries: 0
      })

      // 检查性能目标
      if (latency > 2000) {
        console.warn(`Parsing took ${latency}ms, exceeding target of 2000ms`)
      }

      return result
    } catch (error) {
      const latency = Date.now() - startTime
      console.error('Parsing error:', error)

      // 返回错误结果
      const errorResult: ParseResult = {
        intent: {
          primary: IntentType.CREATE_COMPONENT,
          confidence: 0.5
        },
        props: {},
        style: {},
        entities: [],
        requirements: [],
        constraints: [],
        language,
        confidence: 0,
        suggestions: ['解析过程中出现错误，请尝试简化描述']
      }

      // 记录错误指标
      this.recordMetrics({
        latency,
        tokenCount: this.estimateTokenCount(input),
        cost: 0,
        cacheHit: false,
        retries: 0
      })

      return errorResult
    }
  }

  /**
   * 检测语言
   */
  private detectLanguage(input: string): Language {
    // 检查中文字符
    const chinesePattern = /[\u4e00-\u9fa5]/
    if (chinesePattern.test(input)) {
      return 'zh'
    }

    // 检查常见中文词汇
    const chineseWords = ['组件', '创建', '生成', '按钮', '输入', '表格', '卡片', '模态', '弹窗']
    if (chineseWords.some(word => input.includes(word))) {
      return 'zh'
    }

    return 'en'
  }

  /**
   * 检测组件类型
   */
  private detectComponentType(input: string, language: Language, entities: Entity[]): ComponentType | undefined {
    // 从实体中查找组件
    const componentEntity = entities.find(e => e.type === 'component')
    if (componentEntity) {
      return componentEntity.value as ComponentType
    }

    // 关键词匹配
    const componentKeywords = {
      zh: {
        '按钮': ComponentType.BUTTON,
        '输入': ComponentType.INPUT,
        '表格': ComponentType.TABLE,
        '数据表': ComponentType.TABLE,
        '卡片': ComponentType.CARD,
        '模态': ComponentType.MODAL,
        '弹窗': ComponentType.MODAL,
        '对话框': ComponentType.MODAL,
        '下拉': ComponentType.DROPDOWN,
        '选择器': ComponentType.DROPDOWN,
        '复选': ComponentType.CHECKBOX,
        '单选': ComponentType.RADIO,
        '开关': ComponentType.SWITCH,
        '提示': ComponentType.TOOLTIP,
        '标签页': ComponentType.TABS,
        '导航': ComponentType.NAVIGATION,
        '表单': ComponentType.FORM,
        '容器': ComponentType.CONTAINER,
        '布局': ComponentType.LAYOUT
      },
      en: {
        'button': ComponentType.BUTTON,
        'input': ComponentType.INPUT,
        'table': ComponentType.TABLE,
        'data table': ComponentType.TABLE,
        'card': ComponentType.CARD,
        'modal': ComponentType.MODAL,
        'dialog': ComponentType.MODAL,
        'popup': ComponentType.MODAL,
        'dropdown': ComponentType.DROPDOWN,
        'select': ComponentType.DROPDOWN,
        'combobox': ComponentType.DROPDOWN,
        'checkbox': ComponentType.CHECKBOX,
        'radio': ComponentType.RADIO,
        'switch': ComponentType.SWITCH,
        'toggle': ComponentType.SWITCH,
        'tooltip': ComponentType.TOOLTIP,
        'hint': ComponentType.TOOLTIP,
        'tabs': ComponentType.TABS,
        'tab': ComponentType.TABS,
        'navigation': ComponentType.NAVIGATION,
        'nav': ComponentType.NAVIGATION,
        'menu': ComponentType.NAVIGATION,
        'form': ComponentType.FORM,
        'container': ComponentType.CONTAINER,
        'wrapper': ComponentType.CONTAINER,
        'layout': ComponentType.LAYOUT
      }
    }

    const keywords = componentKeywords[language] || componentKeywords.zh
    const lowerInput = input.toLowerCase()

    for (const [keyword, componentType] of Object.entries(keywords)) {
      if (lowerInput.includes(keyword.toLowerCase())) {
        return componentType
      }
    }

    // 默认返回按钮（最常用的组件）
    return undefined
  }

  /**
   * 提取需求和约束
   */
  private extractRequirements(input: string, language: Language): { requirements: string[]; constraints: string[] } {
    const requirements: string[] = []
    const constraints: string[] = []

    // 需求关键词
    const requirementPatterns = {
      zh: [
        /需要(.*?)[，。]/g,
        /要求(.*?)[，。]/g,
        /支持(.*?)[，。]/g,
        /包含(.*?)[，。]/g
      ],
      en: [
        /need(.*?)[,\.]/g,
        /require(.*?)[,\.]/g,
        /support(.*?)[,\.]/g,
        /include(.*?)[,\.]/g
      ]
    }

    const patterns = requirementPatterns[language] || requirementPatterns.zh
    for (const pattern of patterns) {
      let match
      while ((match = pattern.exec(input)) !== null) {
        requirements.push(match[1].trim())
      }
    }

    // 约束关键词
    const constraintPatterns = {
      zh: [
        /不要(.*?)[，。]/g,
        /禁止(.*?)[，。]/g,
        /避免(.*?)[，。]/g,
        /不能(.*?)[，。]/g
      ],
      en: [
        /avoid(.*?)[,\.]/g,
        /cannot(.*?)[,\.]/g,
        /must not(.*?)[,\.]/g,
        /don't(.*?)[,\.]/g
      ]
    }

    const constraintPats = constraintPatterns[language] || constraintPatterns.zh
    for (const pattern of constraintPats) {
      let match
      while ((match = pattern.exec(input)) !== null) {
        constraints.push(match[1].trim())
      }
    }

    // 如果没有提取到，直接返回输入作为需求
    if (requirements.length === 0) {
      requirements.push(input)
    }

    return { requirements, constraints }
  }

  /**
   * 生成建议
   */
  private generateSuggestions(
    input: string,
    language: Language,
    componentType?: ComponentType,
    props: ComponentProps = {}
  ): string[] {
    const suggestions: string[] = []

    // 基于组件类型的建议
    if (componentType) {
      const componentSuggestions = {
        zh: {
          [ComponentType.BUTTON]: [
            '添加图标可以增强视觉效果',
            '考虑添加loading状态',
            '使用不同变体区分操作优先级'
          ],
          [ComponentType.INPUT]: [
            '添加标签提高可访问性',
            '考虑添加验证提示',
            '使用占位符指导用户输入'
          ],
          [ComponentType.TABLE]: [
            '建议添加分页以提升性能',
            '考虑添加排序功能',
            '响应式设计需要特殊处理'
          ]
        },
        en: {
          [ComponentType.BUTTON]: [
            'Adding icons can enhance visual appeal',
            'Consider adding loading state',
            'Use different variants to distinguish operation priority'
          ],
          [ComponentType.INPUT]: [
            'Add labels for better accessibility',
            'Consider adding validation hints',
            'Use placeholders to guide user input'
          ],
          [ComponentType.TABLE]: [
            'Pagination is recommended for better performance',
            'Consider adding sort functionality',
            'Responsive design requires special handling'
          ]
        }
      }

      const langSuggestions = componentSuggestions[language] || componentSuggestions.zh
      const componentSpecific = langSuggestions[componentType as keyof typeof langSuggestions]
      if (componentSpecific) {
        suggestions.push(...componentSpecific)
      }
    }

    // 基于属性的建议
    if (!props.disabled && props.variant === 'primary') {
      suggestions.push(
        language === 'zh'
          ? '建议为主要操作按钮添加loading状态'
          : 'Consider adding loading state for primary action buttons'
      )
    }

    if (props.error && props.variant !== 'outline') {
      suggestions.push(
        language === 'zh'
          ? '错误状态建议使用outline变体'
          : 'Error state is recommended with outline variant'
      )
    }

    return suggestions
  }

  /**
   * 计算置信度
   */
  private calculateConfidence(
    intent: { confidence: number },
    entities: Entity[],
    componentType?: ComponentType
  ): number {
    let confidence = intent.confidence

    // 实体数量加成
    if (entities.length > 0) {
      confidence += Math.min(0.2, entities.length * 0.05)
    }

    // 组件类型加成
    if (componentType) {
      confidence += 0.15
    }

    // 归一化到[0, 1]
    return Math.min(1, Math.max(0, confidence))
  }

  /**
   * 缓存机制
   */
  private getCacheKey(input: string, language: Language): string {
    return `${language}:${input.toLowerCase().trim()}`
  }

  private getFromCache(input: string, language: Language): ParseResult | null {
    const key = this.getCacheKey(input, language)
    const cached = this.cache.get(key)

    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.result
    }

    return null
  }

  private addToCache(input: string, language: Language, result: ParseResult): void {
    const key = this.getCacheKey(input, language)
    this.cache.set(key, {
      result,
      timestamp: Date.now()
    })
  }

  /**
   * 估算token数量
   */
  private estimateTokenCount(input: string): number {
    // 简单的token估算：中文约1 token/字，英文约1 token/4字符
    const chineseChars = (input.match(/[\u4e00-\u9fa5]/g) || []).length
    const otherChars = input.length - chineseChars
    return chineseChars + Math.ceil(otherChars / 4)
  }

  /**
   * 估算成本
   */
  private estimateCost(input: string): number {
    const tokenCount = this.estimateTokenCount(input)
    const costPer1MTokens = 3 // Claude 4 Sonnet
    return (tokenCount / 1000000) * costPer1MTokens
  }

  /**
   * 记录性能指标
   */
  private recordMetrics(metrics: PerformanceMetrics): void {
    this.metrics.push(metrics)

    // 只保留最近的1000条记录
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000)
    }
  }

  /**
   * 获取性能报告
   */
  getPerformanceReport(): {
    avgLatency: number
    p95Latency: number
    avgCost: number
    totalRequests: number
    cacheHitRate: number
  } {
    if (this.metrics.length === 0) {
      return {
        avgLatency: 0,
        p95Latency: 0,
        avgCost: 0,
        totalRequests: 0,
        cacheHitRate: 0
      }
    }

    const latencies = this.metrics.map(m => m.latency).sort((a, b) => a - b)
    const costs = this.metrics.map(m => m.cost)
    const cacheHits = this.metrics.filter(m => m.cacheHit).length

    return {
      avgLatency: latencies.reduce((a, b) => a + b, 0) / latencies.length,
      p95Latency: latencies[Math.floor(latencies.length * 0.95)],
      avgCost: costs.reduce((a, b) => a + b, 0) / costs.length,
      totalRequests: this.metrics.length,
      cacheHitRate: cacheHits / this.metrics.length
    }
  }

  /**
   * 清空缓存
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * 重置指标
   */
  resetMetrics(): void {
    this.metrics = []
  }
}
