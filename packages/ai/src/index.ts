/**
 * @fileoverview Xorigo UI AI助手自然语言解析器
 * @description 自然语言转组件代码需求的AI解析引擎
 */

export { NLPParser } from './nlp-parser.js'
export { IntentClassifier } from './intent-classifier.js'
export { PropExtractor } from './prop-extractor.js'

export type {
  ParseResult,
  IntentClassification,
  ComponentProps,
  StyleAttributes,
  Entity,
  ParserConfig,
  PerformanceMetrics,
  ParseError,
  Language
} from './types.js'

export {
  IntentType,
  ComponentType,
  ComponentVariant,
  ComponentSize,
  ComponentTheme,
  ComponentDensity,
  ComponentMotion
} from './types.js'

/**
 * 创建解析器的便捷函数
 */
export function createParser(config: {
  language?: 'zh' | 'en'
  model?: 'claude-3-sonnet-20240229' | 'claude-3-opus-20240229' | 'claude-3-haiku-20240307'
  temperature?: number
  maxTokens?: number
  timeout?: number
  enableCache?: boolean
  cacheTTL?: number
  maxRetries?: number
}): NLPParser {
  return new NLPParser({
    language: config.language || 'zh',
    model: config.model,
    temperature: config.temperature || 0.1,
    maxTokens: config.maxTokens || 4000,
    timeout: config.timeout || 10000,
    enableCache: config.enableCache !== false,
    cacheTTL: config.cacheTTL || 5 * 60 * 1000,
    maxRetries: config.maxRetries || 3
  })
}

/**
 * 快速解析函数
 */
export async function quickParse(
  input: string,
  options?: {
    language?: 'zh' | 'en'
    model?: string
    timeout?: number
  }
): Promise<ParseResult> {
  const parser = createParser({
    language: options?.language,
    model: options?.model as any,
    timeout: options?.timeout
  })

  return parser.parse(input)
}

/**
 * 批量解析函数
 */
export async function batchParse(
  inputs: string[],
  options?: {
    language?: 'zh' | 'en'
    model?: string
    concurrency?: number
  }
): Promise<ParseResult[]> {
  const concurrency = options?.concurrency || 5
  const parser = createParser(options)

  const results: ParseResult[] = []
  const chunks: string[][] = []

  // 将输入分块
  for (let i = 0; i < inputs.length; i += concurrency) {
    chunks.push(inputs.slice(i, i + concurrency))
  }

  // 并发处理
  for (const chunk of chunks) {
    const chunkResults = await Promise.all(
      chunk.map(input => parser.parse(input))
    )
    results.push(...chunkResults)
  }

  return results
}

/**
 * 语言检测函数
 */
export function detectLanguage(text: string): 'zh' | 'en' {
  const chinesePattern = /[\u4e00-\u9fa5]/
  if (chinesePattern.test(text)) {
    return 'zh'
  }

  const chineseWords = ['组件', '创建', '生成', '按钮', '输入', '表格', '卡片', '模态', '弹窗']
  if (chineseWords.some(word => text.includes(word))) {
    return 'zh'
  }

  return 'en'
}

/**
 * 验证解析结果
 */
export function validateParseResult(result: ParseResult): {
  valid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  // 检查置信度
  if (result.confidence < 0.5) {
    warnings.push('置信度较低，建议提供更清晰的描述')
  }

  // 检查组件类型
  if (!result.component && result.intent.primary === 'create_component') {
    warnings.push('未检测到明确的组件类型，可能需要手动指定')
  }

  // 检查属性一致性
  if (result.props.error && result.props.variant === 'primary') {
    warnings.push('错误状态与主要变体同时存在，可能需要调整')
  }

  // 检查语言一致性
  if (result.language === 'zh') {
    if (result.style.theme === 'dark') {
      // 深色主题与中文的兼容性
    }
  }

  // 检查性能
  const report = (result.context as any)?.performanceReport
  if (report?.avgLatency > 2000) {
    warnings.push('解析耗时较长，可能影响用户体验')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * 格式化解析结果
 */
export function formatParseResult(result: ParseResult, language?: 'zh' | 'en'): string {
  const lang = language || result.language
  const separator = '='.repeat(50)

  let output = `${separator}\n`

  // 意图
  output += lang === 'zh' ? '🎯 意图：' : '🎯 Intent: '
  output += `${result.intent.primary} (${(result.confidence * 100).toFixed(0)}%)\n\n`

  // 组件类型
  if (result.component) {
    output += lang === 'zh' ? '🧩 组件：' : '🧩 Component: '
    output += `${result.component}\n\n`
  }

  // 属性
  if (Object.keys(result.props).length > 0) {
    output += lang === 'zh' ? '⚙️ 属性：' : '⚙️ Props:\n'
    for (const [key, value] of Object.entries(result.props)) {
      output += `  - ${key}: ${value}\n`
    }
    output += '\n'
  }

  // 样式
  if (Object.keys(result.style).length > 0) {
    output += lang === 'zh' ? '🎨 样式：' : '🎨 Styles:\n'
    for (const [key, value] of Object.entries(result.style)) {
      output += `  - ${key}: ${value}\n`
    }
    output += '\n'
  }

  // 需求
  if (result.requirements.length > 0) {
    output += lang === 'zh' ? '📝 需求：' : '📝 Requirements:\n'
    for (const req of result.requirements) {
      output += `  - ${req}\n`
    }
    output += '\n'
  }

  // 建议
  if (result.suggestions && result.suggestions.length > 0) {
    output += lang === 'zh' ? '💡 建议：' : '💡 Suggestions:\n'
    for (const suggestion of result.suggestions) {
      output += `  - ${suggestion}\n`
    }
    output += '\n'
  }

  output += separator

  return output
}

/**
 * 示例用法
 */
export const EXAMPLES = {
  zh: [
    '创建一个主要按钮组件，尺寸为大，添加加载状态',
    '设计一个输入框组件，支持错误状态和验证提示',
    '生成一个表格组件，可排序和分页，支持虚拟滚动',
    '制作一个卡片组件，有圆角和阴影，使用深色主题',
    '创建一个模态框组件，支持拖拽和调整大小'
  ],
  en: [
    'Create a primary button component with large size and loading state',
    'Design an input component with error state and validation hints',
    'Generate a table component with sorting and pagination, supporting virtual scroll',
    'Make a card component with rounded corners and shadow, using dark theme',
    'Create a modal component with drag and resize support'
  ]
}

/**
 * 性能基准测试
 */
export async function benchmark(
  parser: NLPParser,
  inputs: string[],
  iterations: number = 10
): Promise<{
  avgLatency: number
  p50Latency: number
  p95Latency: number
  p99Latency: number
  minLatency: number
  maxLatency: number
  totalRequests: number
  successRate: number
}> {
  const results: number[] = []
  let successCount = 0

  for (let i = 0; i < iterations; i++) {
    for (const input of inputs) {
      const start = Date.now()
      try {
        await parser.parse(input)
        successCount++
      } catch (error) {
        console.error('Benchmark error:', error)
      }
      results.push(Date.now() - start)
    }
  }

  results.sort((a, b) => a - b)

  return {
    avgLatency: results.reduce((a, b) => a + b, 0) / results.length,
    p50Latency: results[Math.floor(results.length * 0.5)],
    p95Latency: results[Math.floor(results.length * 0.95)],
    p99Latency: results[Math.floor(results.length * 0.99)],
    minLatency: results[0],
    maxLatency: results[results.length - 1],
    totalRequests: results.length,
    successRate: successCount / results.length
  }
}
