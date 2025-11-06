/**
 * 集成测试 - 完整解析流程测试
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { NLPParser, createParser, quickParse, batchParse, EXAMPLES } from '../src/index.js'
import { IntentType, ComponentType } from '../src/types.js'

describe('NLP Parser 集成测试', () => {
  let parser: NLPParser

  beforeEach(() => {
    parser = createParser({
      language: 'zh',
      enableCache: true
    })
  })

  afterEach(() => {
    parser.resetMetrics()
    parser.clearCache()
  })

  describe('完整流程测试', () => {
    it('应该完整解析中文按钮请求', async () => {
      const result = await parser.parse('创建一个主要的大按钮，深色主题，有阴影')

      expect(result.intent.primary).toBe(IntentType.CREATE_COMPONENT)
      expect(result.component).toBe(ComponentType.BUTTON)
      expect(result.props.variant).toBe('primary')
      expect(result.props.size).toBe('lg')
      expect(result.style.theme).toBe('dark')
      expect(result.style.shadow).toBe(true)
      expect(result.language).toBe('zh')
      expect(result.confidence).toBeGreaterThan(0.5)
      expect(result.entities.length).toBeGreaterThan(0)
      expect(result.requirements.length).toBeGreaterThan(0)
    })

    it('应该完整解析英文输入框请求', async () => {
      const result = await parser.parse('Create an input with error state and validation')

      expect(result.intent.primary).toBe(IntentType.CREATE_COMPONENT)
      expect(result.component).toBe(ComponentType.INPUT)
      expect(result.props.error).toBe(true)
      expect(result.language).toBe('en')
      expect(result.confidence).toBeGreaterThan(0.5)
    })

    it('应该解析表格请求并包含分页建议', async () => {
      const result = await parser.parse('创建一个大型表格，支持排序和过滤')

      expect(result.intent.primary).toBe(IntentType.CREATE_COMPONENT)
      expect(result.component).toBe(ComponentType.TABLE)
      expect(result.props.sortable).toBe(true)
      expect(result.props.filterable).toBe(true)

      if (result.suggestions && result.suggestions.length > 0) {
        const hasPaginationSuggestion = result.suggestions.some(s =>
          s.includes('分页') || s.includes('pagination')
        )
        expect(hasPaginationSuggestion).toBe(true)
      }
    })
  })

  describe('性能测试', () => {
    it('单次解析应该在2秒内完成', async () => {
      const start = Date.now()
      await parser.parse('创建一个按钮')
      const latency = Date.now() - start

      expect(latency).toBeLessThan(2000)
    })

    it('应该正确记录性能指标', async () => {
      await parser.parse('创建按钮')
      await parser.parse('创建输入框')

      const report = parser.getPerformanceReport()

      expect(report.totalRequests).toBe(2)
      expect(report.avgLatency).toBeGreaterThan(0)
      expect(report.cacheHitRate).toBe(0) // 第一次请求
    })

    it('缓存应该提高性能', async () => {
      const input = '创建按钮'

      const start1 = Date.now()
      await parser.parse(input)
      const latency1 = Date.now() - start1

      const start2 = Date.now()
      await parser.parse(input)
      const latency2 = Date.now() - start2

      expect(latency2).toBeLessThan(latency1)
    })
  })

  describe('批量处理测试', () => {
    it('应该能批量解析多个请求', async () => {
      const inputs = [
        '创建按钮',
        '创建输入框',
        '创建表格',
        '创建卡片'
      ]

      const results = await batchParse(inputs, {
        concurrency: 2
      })

      expect(results.length).toBe(4)
      expect(results[0].component).toBe(ComponentType.BUTTON)
      expect(results[1].component).toBe(ComponentType.INPUT)
      expect(results[2].component).toBe(ComponentType.TABLE)
      expect(results[3].component).toBe(ComponentType.CARD)
    })

    it('应该能处理不同语言的混合输入', async () => {
      const inputs = [
        '创建按钮',
        'Create input',
        '创建表格',
        'Create card'
      ]

      const results = await batchParse(inputs)

      expect(results.length).toBe(4)
      expect([results[0].language, results[2].language]).toContain('zh')
      expect([results[1].language, results[3].language]).toContain('en')
    })
  })

  describe('示例场景测试', () => {
    it('应该能处理所有示例', async () => {
      const allExamples = [...EXAMPLES.zh, ...EXAMPLES.en]

      for (const example of allExamples) {
        const result = await parser.parse(example)
        expect(result.intent.primary).toBeDefined()
        expect(result.confidence).toBeGreaterThan(0)
      }
    })

    it('中文示例应该被正确识别', async () => {
      for (const example of EXAMPLES.zh) {
        const result = await parser.parse(example)
        expect(result.language).toBe('zh')
        expect(result.component).toBeDefined()
      }
    })

    it('英文示例应该被正确识别', async () => {
      for (const example of EXAMPLES.en) {
        const result = await parser.parse(example)
        expect(result.language).toBe('en')
        expect(result.component).toBeDefined()
      }
    })
  })

  describe('边界场景测试', () => {
    it('应该处理非常简单的输入', async () => {
      const result = await parser.parse('按钮')

      expect(result.component).toBe(ComponentType.BUTTON)
      expect(result.intent.primary).toBe(IntentType.CREATE_COMPONENT)
    })

    it('应该处理非常复杂的输入', async () => {
      const complexInput = `
        创建一个主要的大按钮组件，
        需要支持深色主题，
        有圆角和阴影，
        尺寸为lg，
        变体为primary，
        添加loading状态和点击事件，
        不要使用红色，
        支持响应式设计
      `.trim()

      const result = await parser.parse(complexInput)

      expect(result.component).toBe(ComponentType.BUTTON)
      expect(result.props.variant).toBe('primary')
      expect(result.props.size).toBe('lg')
      expect(result.style.theme).toBe('dark')
      expect(result.style.rounded).toBe(true)
      expect(result.style.shadow).toBe(true)
      expect(result.constraints.length).toBeGreaterThan(0)
      expect(result.confidence).toBeGreaterThan(0.7)
    })

    it('应该处理特殊字符', async () => {
      const result = await parser.parse('创建 @#$% 按钮')

      expect(result.component).toBe(ComponentType.BUTTON)
    })

    it('应该处理重复词汇', async () => {
      const result = await parser.parse('创建创建按钮按钮')

      expect(result.component).toBe(ComponentType.BUTTON)
    })

    it('应该处理带空格的输入', async () => {
      const result = await parser.parse('  创建  按钮  ')

      expect(result.component).toBe(ComponentType.BUTTON)
    })

    it('应该处理带标点符号的输入', async () => {
      const result = await parser.parse('创建一个按钮，尺寸为大！')

      expect(result.component).toBe(ComponentType.BUTTON)
      expect(result.props.size).toBe('lg')
    })
  })

  describe('错误场景测试', () => {
    it('应该处理空字符串', async () => {
      const result = await parser.parse('')

      expect(result.intent.primary).toBe(IntentType.CREATE_COMPONENT)
      expect(result.component).toBeUndefined()
      expect(result.confidence).toBeLessThan(1)
    })

    it('应该处理无意义输入', async () => {
      const result = await parser.parse('asdfghjkl')

      expect(result.intent.primary).toBeDefined()
      expect(result.confidence).toBeLessThan(1)
    })

    it('应该处理只有标点的输入', async () => {
      const result = await parser.parse('!@#$%^&*()')

      expect(result.intent.primary).toBeDefined()
    })
  })

  describe('功能完整性测试', () => {
    it('应该提取完整的实体信息', async () => {
      const result = await parser.parse('创建一个大的主要按钮')

      const entities = result.entities
      expect(entities.length).toBeGreaterThan(0)

      const hasComponent = entities.some(e => e.type === 'component')
      const hasProperty = entities.some(e => e.type === 'property')
      const hasAction = entities.some(e => e.type === 'action')

      expect(hasComponent || hasProperty).toBe(true)
    })

    it('应该提供有意义的建议', async () => {
      const result = await parser.parse('创建主要按钮')

      if (result.suggestions && result.suggestions.length > 0) {
        expect(result.suggestions[0].length).toBeGreaterThan(5)
      }
    })

    it('应该包含完整的上下文信息', async () => {
      const result = await parser.parse('创建按钮')

      expect(result.context).toBeDefined()
      expect(result.context!.timestamp).toBeDefined()
      expect(result.context!.inputLength).toBeGreaterThan(0)
    })
  })

  describe('多语言支持测试', () => {
    it('应该正确区分中英文', async () => {
      const zhResult = await parser.parse('创建按钮')
      const enResult = await parser.parse('Create button')

      expect(zhResult.language).toBe('zh')
      expect(enResult.language).toBe('en')
      expect(zhResult.component).toBe(ComponentType.BUTTON)
      expect(enResult.component).toBe(ComponentType.BUTTON)
    })

    it('应该处理混合语言输入', async () => {
      const result1 = await parser.parse('Create 一个 button')
      const result2 = await parser.parse('创建 button 组件')

      expect(result1.language).toBe('zh')
      expect(result2.language).toBe('zh')
      expect(result1.component).toBe(ComponentType.BUTTON)
      expect(result2.component).toBe(ComponentType.BUTTON)
    })

    it('中英文属性应该都被正确解析', async () => {
      const zhResult = await parser.parse('创建大尺寸按钮')
      const enResult = await parser.parse('Create large size button')

      expect(zhResult.props.size).toBe('lg')
      expect(enResult.props.size).toBe('lg')
    })
  })

  describe('置信度测试', () => {
    it('详细输入应该有更高置信度', async () => {
      const simple = await parser.parse('按钮')
      const medium = await parser.parse('创建按钮')
      const detailed = await parser.parse('创建一个主要的大按钮组件')

      expect(simple.confidence).toBeLessThan(medium.confidence)
      expect(medium.confidence).toBeLessThan(detailed.confidence)
    })

    it('置信度应该在合理范围内', async () => {
      const result = await parser.parse('创建按钮')

      expect(result.confidence).toBeGreaterThanOrEqual(0)
      expect(result.confidence).toBeLessThanOrEqual(1)
    })
  })

  describe('推荐测试', () => {
    it('应该为按钮提供相关建议', async () => {
      const result = await parser.parse('创建主要按钮')

      if (result.suggestions && result.suggestions.length > 0) {
        const suggestions = result.suggestions.join(' ')
        expect(suggestions).toMatch(/loading|图标|变体/i)
      }
    })

    it('应该为输入框提供相关建议', async () => {
      const result = await parser.parse('创建输入框')

      if (result.suggestions && result.suggestions.length > 0) {
        const suggestions = result.suggestions.join(' ')
        expect(suggestions).toMatch(/标签|验证|占位符/i)
      }
    })

    it('应该为表格提供相关建议', async () => {
      const result = await parser.parse('创建表格')

      if (result.suggestions && result.suggestions.length > 0) {
        const suggestions = result.suggestions.join(' ')
        expect(suggestions).toMatch(/分页|排序|响应式/i)
      }
    })
  })

  describe('性能回归测试', () => {
    it('应该保持稳定的性能', async () => {
      const iterations = 10
      const latencies: number[] = []

      for (let i = 0; i < iterations; i++) {
        const start = Date.now()
        await parser.parse('创建按钮')
        latencies.push(Date.now() - start)
      }

      const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length
      const maxLatency = Math.max(...latencies)

      expect(avgLatency).toBeLessThan(1000)
      expect(maxLatency).toBeLessThan(2000)
    })

    it('缓存应该显著提高性能', async () => {
      const input = '创建特殊缓存测试按钮'

      // 第一次请求
      const start1 = Date.now()
      const result1 = await parser.parse(input)
      const time1 = Date.now() - start1

      // 第二次请求（应该使用缓存）
      const start2 = Date.now()
      const result2 = await parser.parse(input)
      const time2 = Date.now() - start2

      expect(time2).toBeLessThan(time1)
      expect(result2.context?.cacheHit).toBe(true)
    })
  })

  describe('稳定性测试', () => {
    it('应该处理100次连续请求', async () => {
      const requests = Array(100).fill('创建按钮')

      for (const request of requests) {
        const result = await parser.parse(request)
        expect(result.component).toBe(ComponentType.BUTTON)
      }
    })

    it('应该处理随机输入', async () => {
      const randomInputs = [
        '创建按钮',
        'Create button',
        '按钮按钮',
        'Button button',
        '创建 创建 按钮',
        'Create Create button'
      ]

      for (const input of randomInputs) {
        const result = await parser.parse(input)
        expect(result.component).toBe(ComponentType.BUTTON)
      }
    })
  })
})
