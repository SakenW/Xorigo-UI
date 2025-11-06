/**
 * 意图分类器 - 使用规则引擎和AI辅助的方式识别用户意图
 */

import Anthropic from '@anthropic-ai/sdk'
import {
  IntentType,
  Language,
  IntentClassification,
  Entity,
  ClaudeResponse,
  ParserConfig
} from './types.js'

/**
 * 意图分类器类
 */
export class IntentClassifier {
  private claude: Anthropic | null = null
  private config: ParserConfig

  // 意图关键词映射
  private readonly INTENT_PATTERNS = {
    [IntentType.CREATE_COMPONENT]: {
      zh: [
        /创建\s*\w*组件|生成\s*\w*组件|做一个\s*\w*组件|设计\s*\w*组件|新建\s*\w*组件/,
        /我要\s*(一个\s*)?\w*组件|需要\s*\w*组件|给我\s*\w*组件|做个\s*\w*组件/,
        /添加\s*\w*组件|增加\s*\w*组件|插入\s*\w*组件|放置\s*\w*组件/
      ],
      en: [
        /create\s+\w+\s+component|generate\s+\w+\s+component|build\s+\w+\s+component/,
        /make\s+a\s+\w+\s+component|design\s+\w+\s+component|add\s+a\s+\w+\s+component/,
        /i\s+need\s+a\s+\w+\s+component|i\s+want\s+a\s+\w+\s+component|implement\s+\w+\s+component/
      ]
    },
    [IntentType.MODIFY_COMPONENT]: {
      zh: [
        /修改\s*\w*组件|调整\s*\w*组件|更新\s*\w*组件|改变\s*\w*组件|优化\s*\w*组件/,
        /编辑\s*\w*组件|重构\s*\w*组件|改进\s*\w*组件|完善\s*\w*组件/,
        /设置\s*\w*属性|配置\s*\w*属性|更改\s*\w*属性/
      ],
      en: [
        /modify\s+\w+\s+component|update\s+\w+\s+component|change\s+\w+\s+component/,
        /edit\s+\w+\s+component|refactor\s+\w+\s+component|improve\s+\w+\s+component/,
        /set\s+\w+\s+property|configure\s+\w+\s+property|adjust\s+\w+\s+property/
      ]
    },
    [IntentType.ADD_FEATURE]: {
      zh: [
        /添加功能|增加特性|加入功能|新增功能|扩展功能/,
        /添加\s*功能|支持\s*功能|启用\s*功能|开启\s*功能/
      ],
      en: [
        /add\s+feature|implement\s+feature|enable\s+feature|support\s+feature/,
        /add\s+functionality|add\s+capability|add\s+ability/
      ]
    },
    [IntentType.REVIEW_CODE]: {
      zh: [
        /审查\s*代码|检查\s*代码|审核\s*代码|评估\s*代码|代码审查/,
        /看看\s*代码|检查\s*质量|代码质量|代码审查/
      ],
      en: [
        /review\s+code|check\s+code|audit\s+code|evaluate\s+code/,
        /code\s+review|code\s+quality|code\s+analysis/
      ]
    },
    [IntentType.DEBUG_ERROR]: {
      zh: [
        /调试\s*错误|修复\s*错误|解决\s*错误|报错|异常|报错信息/,
        /出了\s*问题|有问题|错误|调试|bug|fix/,
        /为什么\s*报错|如何\s*修复|怎么\s*解决/
      ],
      en: [
        /debug\s+error|fix\s+error|solve\s+error|error|exception|bug/,
        /something\s+wrong|issue|problem|debug/,
        /why\s+error|how\s+to\s+fix|how\s+to\s+solve/
      ]
    },
    [IntentType.EXPLAIN_CODE]: {
      zh: [
        /解释\s*代码|说明\s*代码|讲解\s*代码|代码解释|理解\s*代码/,
        /这个\s*代码|为什么\s*这样|怎么\s*工作|原理是什么/,
        /帮助\s*理解|详细说明|解释一下/
      ],
      en: [
        /explain\s+code|describe\s+code|clarify\s+code|code\s+explanation/,
        /how\s+this\s+works|why\s+this\s+way|what\s+does\s+this\s+do/,
        /help\s+understand|detailed\s+explanation/
      ]
    },
    [IntentType.REFACTOR_CODE]: {
      zh: [
        /重构\s*代码|优化\s*代码|改进\s*代码|简化\s*代码|清理\s*代码/,
        /重写\s*代码|优化结构|代码优化|性能优化/
      ],
      en: [
        /refactor\s+code|optimize\s+code|clean\s+code|improve\s+code/,
        /restructure|simplify\s+code|performance\s+optimization/
      ]
    },
    [IntentType.GENERATE_DOCS]: {
      zh: [
        /生成文档|创建文档|编写文档|文档生成|自动文档/,
        /添加注释|写文档|文档说明|API文档/
      ],
      en: [
        /generate\s+docs|create\s+docs|write\s+docs|documentation/,
        /add\s+comments|api\s+docs|documentation\s+generation/
      ]
    }
  }

  constructor(config: ParserConfig) {
    this.config = config
    if (config.model) {
      this.claude = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY || ''
      })
    }
  }

  /**
   * 分类用户意图
   */
  async classifyIntent(input: string, language: Language): Promise<IntentClassification> {
    const startTime = Date.now()

    try {
      // 第一步：规则引擎快速分类
      const ruleBasedResult = this.classifyByRules(input, language)

      // 第二步：使用AI辅助分类（如果规则置信度不够高）
      if (ruleBasedResult.confidence < 0.8 && this.claude) {
        const aiResult = await this.classifyByAI(input, language, ruleBasedResult.primary)
        return aiResult
      }

      return ruleBasedResult
    } catch (error) {
      console.error('Intent classification error:', error)
      // 失败时返回默认结果
      return {
        primary: IntentType.CREATE_COMPONENT,
        confidence: 0.5
      }
    }
  }

  /**
   * 基于规则的意图分类
   */
  private classifyByRules(input: string, language: Language): IntentClassification {
    const matches: Array<{ type: IntentType; confidence: number }> = []

    for (const [intentType, patterns] of Object.entries(this.INTENT_PATTERNS)) {
      const languagePatterns = patterns[language]
      if (!languagePatterns) continue

      let maxConfidence = 0
      for (const pattern of languagePatterns) {
        const matches = input.match(pattern)
        if (matches) {
          // 根据匹配程度计算置信度
          const confidence = Math.min(0.9, 0.6 + (matches[0].length / input.length) * 0.4)
          maxConfidence = Math.max(maxConfidence, confidence)
        }
      }

      if (maxConfidence > 0) {
        matches.push({ type: intentType as IntentType, confidence: maxConfidence })
      }
    }

    // 如果没有匹配，返回默认意图
    if (matches.length === 0) {
      return {
        primary: IntentType.CREATE_COMPONENT,
        confidence: 0.5,
        secondary: []
      }
    }

    // 按置信度排序
    matches.sort((a, b) => b.confidence - a.confidence)

    // 返回主要意图和次要意图
    const primary = matches[0]
    const secondary = matches.slice(1, 3).map(m => ({
      type: m.type,
      confidence: m.confidence
    }))

    return {
      primary: primary.type,
      confidence: primary.confidence,
      secondary
    }
  }

  /**
   * 基于AI的意图分类
   */
  private async classifyByAI(
    input: string,
    language: Language,
    fallbackIntent: IntentType
  ): Promise<IntentClassification> {
    try {
      const systemPrompt = this.buildSystemPrompt(language)

      const response = await this.claude!.messages.create({
        model: this.config.model || 'claude-3-sonnet-20240229',
        max_tokens: 200,
        temperature: 0.1,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: `用户输入: ${input}\n\n请分析这个输入的意图。`
          }
        ]
      })

      // 解析AI响应
      const content = response.content[0]
      if (content.type === 'text') {
        const intentType = this.parseAIResponse(content.text, language)
        if (intentType) {
          return {
            primary: intentType,
            confidence: 0.85,
            secondary: [
              { type: fallbackIntent, confidence: 0.6 }
            ]
          }
        }
      }

      return {
        primary: fallbackIntent,
        confidence: 0.7
      }
    } catch (error) {
      console.error('AI classification error:', error)
      return {
        primary: fallbackIntent,
        confidence: 0.7
      }
    }
  }

  /**
   * 构建系统提示词
   */
  private buildSystemPrompt(language: Language): string {
    const promptZh = `
你是一个意图分类助手，专门识别用户对UI组件相关的请求意图。

任务：分析用户输入，判断其主要意图类型。

可能的意图类型：
1. create_component - 创建组件（如：创建按钮、生成表格等）
2. modify_component - 修改组件（如：修改样式、调整属性等）
3. add_feature - 添加功能（如：添加交互、扩展功能等）
4. review_code - 审查代码（如：检查代码、代码审查等）
5. debug_error - 调试错误（如：修复错误、解决bug等）
6. explain_code - 解释代码（如：说明代码、理解逻辑等）
7. refactor_code - 重构代码（如：优化代码、改进结构等）
8. generate_docs - 生成文档（如：编写文档、添加注释等）

请直接返回意图类型，不要其他内容。
`

    const promptEn = `
You are an intent classification assistant specialized in identifying user requests related to UI components.

Task: Analyze user input and determine the primary intent type.

Possible intent types:
1. create_component - Create components (e.g., create button, generate table)
2. modify_component - Modify components (e.g., modify styles, adjust props)
3. add_feature - Add features (e.g., add interactions, extend functionality)
4. review_code - Review code (e.g., check code, code review)
5. debug_error - Debug errors (e.g., fix errors, solve bugs)
6. explain_code - Explain code (e.g., describe code, clarify logic)
7. refactor_code - Refactor code (e.g., optimize code, improve structure)
8. generate_docs - Generate docs (e.g., write docs, add comments)

Please directly return the intent type without any other content.
`

    return language === 'zh' ? promptZh : promptEn
  }

  /**
   * 解析AI响应
   */
  private parseAIResponse(text: string, language: Language): IntentType | null {
    const textLower = text.toLowerCase()
    const intentTypes = Object.values(IntentType)

    for (const intent of intentTypes) {
      if (textLower.includes(intent)) {
        return intent
      }
    }

    // 尝试中文关键词匹配
    const zhMatches = {
      '创建': IntentType.CREATE_COMPONENT,
      '修改': IntentType.MODIFY_COMPONENT,
      '添加': IntentType.ADD_FEATURE,
      '审查': IntentType.REVIEW_CODE,
      '调试': IntentType.DEBUG_ERROR,
      '解释': IntentType.EXPLAIN_CODE,
      '重构': IntentType.REFACTOR_CODE,
      '文档': IntentType.GENERATE_DOCS
    }

    for (const [keyword, intent] of Object.entries(zhMatches)) {
      if (text.includes(keyword)) {
        return intent
      }
    }

    return null
  }

  /**
   * 提取实体
   */
  async extractEntities(input: string, language: Language): Promise<Entity[]> {
    const entities: Entity[] = []

    // 提取组件名称
    const componentEntities = this.extractComponentEntities(input, language)
    entities.push(...componentEntities)

    // 提取属性
    const propertyEntities = this.extractPropertyEntities(input, language)
    entities.push(...propertyEntities)

    // 提取动作
    const actionEntities = this.extractActionEntities(input, language)
    entities.push(...actionEntities)

    // 提取样式
    const styleEntities = this.extractStyleEntities(input, language)
    entities.push(...styleEntities)

    return entities
  }

  /**
   * 提取组件实体
   */
  private extractComponentEntities(input: string, language: Language): Entity[] {
    const entities: Entity[] = []
    const aliases = this.getComponentAliases(language)

    for (const [alias, componentType] of Object.entries(aliases)) {
      const regex = new RegExp(alias, 'gi')
      let match
      while ((match = regex.exec(input)) !== null) {
        entities.push({
          type: 'component',
          value: componentType,
          confidence: 0.9,
          startIndex: match.index,
          endIndex: match.index + match[0].length,
          metadata: { alias }
        })
      }
    }

    return entities
  }

  /**
   * 提取属性实体
   */
  private extractPropertyEntities(input: string, language: Language): Entity[] {
    const entities: Entity[] = []
    const propertyAliases = this.getPropertyAliases(language)

    for (const [alias, propertyName] of Object.entries(propertyAliases)) {
      const pattern = new RegExp(`(?:设置|配置|添加|enable|set|add)\\s*([\\w\\d\\s]*${alias}[\\w\\d\\s]*)`, 'gi')
      let match
      while ((match = pattern.exec(input)) !== null) {
        entities.push({
          type: 'property',
          value: propertyName,
          confidence: 0.8,
          startIndex: match.index,
          endIndex: match.index + match[0].length,
          metadata: { alias, rawValue: match[1] }
        })
      }
    }

    return entities
  }

  /**
   * 提取动作实体
   */
  private extractActionEntities(input: string, language: Language): Entity[] {
    const entities: Entity[] = []
    const actionKeywords = {
      zh: ['点击', '悬停', '拖拽', '滑动', '滚动', '聚焦', '选择', '提交'],
      en: ['click', 'hover', 'drag', 'swipe', 'scroll', 'focus', 'select', 'submit']
    }

    const keywords = actionKeywords[language] || []
    for (const keyword of keywords) {
      const regex = new RegExp(keyword, 'gi')
      const match = regex.exec(input)
      if (match) {
        entities.push({
          type: 'action',
          value: keyword,
          confidence: 0.85,
          startIndex: match.index,
          endIndex: match.index + match[0].length
        })
      }
    }

    return entities
  }

  /**
   * 提取样式实体
   */
  private extractStyleEntities(input: string, language: Language): Entity[] {
    const entities: Entity[] = []

    // 主题
    const themePatterns = {
      zh: /深色主题|浅色主题|暗色主题|明亮主题|自动模式|跟随系统/gi,
      en: /dark\s+theme|light\s+theme|auto\s+mode|system\s+default/gi
    }

    const themeMatch = themePatterns[language]?.exec(input)
    if (themeMatch) {
      entities.push({
        type: 'style',
        value: 'theme',
        confidence: 0.9,
        startIndex: themeMatch.index,
        endIndex: themeMatch.index + themeMatch[0].length,
        metadata: { theme: themeMatch[0] }
      })
    }

    // 圆角
    const roundedPatterns = {
      zh: /圆角|圆形|椭圆角/gi,
      en: /rounded|circular|fully\s+rounded/gi
    }

    const roundedMatch = roundedPatterns[language]?.exec(input)
    if (roundedMatch) {
      entities.push({
        type: 'style',
        value: 'rounded',
        confidence: 0.9,
        startIndex: roundedMatch.index,
        endIndex: roundedMatch.index + roundedMatch[0].length
      })
    }

    return entities
  }

  /**
   * 获取组件别名映射
   */
  private getComponentAliases(language: Language): Record<string, string> {
    const aliases = {
      zh: {
        '按钮': 'button',
        '输入框': 'input',
        '表格': 'table',
        '卡片': 'card',
        '模态框': 'modal',
        '弹窗': 'modal',
        '下拉框': 'dropdown',
        '复选框': 'checkbox',
        '单选框': 'radio',
        '开关': 'switch',
        '提示': 'tooltip',
        '标签页': 'tabs',
        '导航': 'navigation'
      },
      en: {
        'button': 'button',
        'input': 'input',
        'table': 'table',
        'card': 'card',
        'modal': 'modal',
        'dialog': 'modal',
        'dropdown': 'dropdown',
        'select': 'dropdown',
        'checkbox': 'checkbox',
        'radio': 'radio',
        'switch': 'switch',
        'tooltip': 'tooltip',
        'tabs': 'tabs',
        'navigation': 'navigation',
        'nav': 'navigation'
      }
    }

    return aliases[language] || {}
  }

  /**
   * 获取属性别名映射
   */
  private getPropertyAliases(language: Language): Record<string, string> {
    const aliases = {
      zh: {
        '大小': 'size',
        '尺寸': 'size',
        '变体': 'variant',
        '样式': 'variant',
        '禁用': 'disabled',
        '加载': 'loading',
        '错误': 'error',
        '成功': 'success',
        '必填': 'required',
        '只读': 'readOnly'
      },
      en: {
        'size': 'size',
        'variant': 'variant',
        'disabled': 'disabled',
        'loading': 'loading',
        'error': 'error',
        'success': 'success',
        'required': 'required',
        'readonly': 'readOnly'
      }
    }

    return aliases[language] || {}
  }
}
