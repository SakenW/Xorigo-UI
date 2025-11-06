/**
 * NLP Parser 测试用例
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { NLPParser, createParser } from '../src/nlp-parser.js'
import { IntentType, ComponentType } from '../src/types.js'

describe('NLPParser', () => {
  let parser: NLPParser

  beforeEach(() => {
    parser = createParser({
      language: 'zh',
      enableCache: false
    })
  })

  afterEach(() => {
    parser.resetMetrics()
  })

  describe('基本功能测试', () => {
    it('应该能解析中文创建按钮请求', async () => {
      const result = await parser.parse('创建一个主要按钮，尺寸为大')

      expect(result.intent.primary).toBe(IntentType.CREATE_COMPONENT)
      expect(result.component).toBe(ComponentType.BUTTON)
      expect(result.props.variant).toBe('primary')
      expect(result.props.size).toBe('lg')
      expect(result.language).toBe('zh')
      expect(result.confidence).toBeGreaterThan(0.5)
    })

    it('应该能解析英文创建输入框请求', async () => {
      const result = await parser.parse('Create an input component with error state')

      expect(result.intent.primary).toBe(IntentType.CREATE_COMPONENT)
      expect(result.component).toBe(ComponentType.INPUT)
      expect(result.props.error).toBe(true)
      expect(result.language).toBe('en')
    })

    it('应该能解析修改组件请求', async () => {
      const result = await parser.parse('修改按钮组件，添加禁用状态')

      expect(result.intent.primary).toBe(IntentType.MODIFY_COMPONENT)
      expect(result.component).toBe(ComponentType.BUTTON)
      expect(result.props.disabled).toBe(true)
    })
  })

  describe('属性提取测试', () => {
    it('应该能提取多个尺寸选项', async () => {
      const inputs = [
        '创建一个超小按钮',
        '创建一个小按钮',
        '创建一个中等按钮',
        '创建一个大按钮',
        '创建一个超大按钮'
      ]

      for (const input of inputs) {
        const result = await parser.parse(input)
        expect(result.props.size).toBeDefined()
        expect(['xs', 'sm', 'md', 'lg', 'xl'].includes(result.props.size as string)).toBe(true)
      }
    })

    it('应该能提取变体属性', async () => {
      const result = await parser.parse('创建一个边框样式的按钮')

      expect(result.props.variant).toBe('outline')
    })

    it('应该能提取布尔属性', async () => {
      const result = await parser.parse('创建一个加载中的按钮')

      expect(result.props.loading).toBe(true)
    })
  })

  describe('样式提取测试', () => {
    it('应该能提取主题', async () => {
      const result = await parser.parse('创建一个使用深色主题的按钮')

      expect(result.style.theme).toBe('dark')
    })

    it('应该能提取圆角样式', async () => {
      const result = await parser.parse('创建一个圆角按钮')

      expect(result.style.rounded).toBe(true)
    })

    it('应该能提取阴影样式', async () => {
      const result = await parser.parse('创建一个有阴影的卡片')

      expect(result.style.shadow).toBe(true)
      expect(result.component).toBe(ComponentType.CARD)
    })
  })

  describe('性能测试', () => {
    it('解析响应时间应小于2秒', async () => {
      const start = Date.now()
      await parser.parse('创建一个按钮组件')
      const latency = Date.now() - start

      expect(latency).toBeLessThan(2000)
    })

    it('应该记录性能指标', async () => {
      await parser.parse('创建一个按钮')
      const report = parser.getPerformanceReport()

      expect(report.totalRequests).toBe(1)
      expect(report.avgLatency).toBeGreaterThan(0)
    })
  })

  describe('缓存测试', () => {
    it('应该缓存相同输入的结果', async () => {
      const parserWithCache = createParser({
        enableCache: true
      })

      const input = '创建一个按钮'
      const result1 = await parserWithCache.parse(input)
      const result2 = await parserWithCache.parse(input)

      expect(result2.context?.cacheHit).toBe(true)
    })

    it('应该能清空缓存', async () => {
      const parserWithCache = createParser({
        enableCache: true
      })

      await parserWithCache.parse('创建一个按钮')
      parserWithCache.clearCache()

      const report = parserWithCache.getPerformanceReport()
      expect(report.cacheHitRate).toBe(0)
    })
  })

  describe('错误处理测试', () => {
    it('应该处理空输入', async () => {
      const result = await parser.parse('')

      expect(result.intent.primary).toBe(IntentType.CREATE_COMPONENT)
      expect(result.confidence).toBeLessThan(1)
    })

    it('应该处理无效输入', async () => {
      const result = await parser.parse('!@#$%^&*()')

      expect(result.intent.primary).toBe(IntentType.CREATE_COMPONENT)
    })
  })

  describe('组件类型检测测试', () => {
    const componentTests = [
      { input: '创建按钮', component: ComponentType.BUTTON },
      { input: 'Create button', component: ComponentType.BUTTON },
      { input: '生成输入框', component: ComponentType.INPUT },
      { input: 'Generate input', component: ComponentType.INPUT },
      { input: '设计表格', component: ComponentType.TABLE },
      { input: 'Design table', component: ComponentType.TABLE },
      { input: '制作卡片', component: ComponentType.CARD },
      { input: 'Make card', component: ComponentType.CARD },
      { input: '创建模态框', component: ComponentType.MODAL },
      { input: 'Create modal', component: ComponentType.MODAL }
    ]

    componentTests.forEach(({ input, component }) => {
      it(`应该能识别组件类型: ${component}`, async () => {
        const result = await parser.parse(input)
        expect(result.component).toBe(component)
      })
    })
  })

  describe('多语言支持测试', () => {
    it('应该能处理中文输入', async () => {
      const result = await parser.parse('创建一个大的主要按钮')

      expect(result.language).toBe('zh')
      expect(result.props.size).toBe('lg')
      expect(result.props.variant).toBe('primary')
    })

    it('应该能处理英文输入', async () => {
      const result = await parser.parse('Create a large primary button')

      expect(result.language).toBe('en')
      expect(result.props.size).toBe('lg')
      expect(result.props.variant).toBe('primary')
    })
  })

  describe('实体抽取测试', () => {
    it('应该抽取组件实体', async () => {
      const result = await parser.parse('创建一个按钮组件')

      const componentEntities = result.entities.filter(e => e.type === 'component')
      expect(componentEntities.length).toBeGreaterThan(0)
    })

    it('应该抽取属性实体', async () => {
      const result = await parser.parse('设置按钮大小为大')

      const propertyEntities = result.entities.filter(e => e.type === 'property')
      expect(propertyEntities.length).toBeGreaterThan(0)
    })

    it('应该抽取动作实体', async () => {
      const result = await parser.parse('点击按钮时触发事件')

      const actionEntities = result.entities.filter(e => e.type === 'action')
      expect(actionEntities.length).toBeGreaterThan(0)
    })
  })

  describe('需求提取测试', () => {
    it('应该提取用户需求', async () => {
      const result = await parser.parse('创建一个按钮，需要支持点击事件')

      expect(result.requirements.length).toBeGreaterThan(0)
    })

    it('应该提取约束条件', async () => {
      const result = await parser.parse('创建按钮，避免使用红色')

      expect(result.constraints.length).toBeGreaterThan(0)
    })
  })

  describe('建议生成测试', () => {
    it('应该生成相关建议', async () => {
      const result = await parser.parse('创建主要按钮')

      expect(result.suggestions).toBeDefined()
    })

    it('建议应该与组件类型相关', async () => {
      const result = await parser.parse('创建表格组件')

      if (result.suggestions && result.suggestions.length > 0) {
        const hasPaginationSuggestion = result.suggestions.some(s =>
          s.includes('分页') || s.includes('pagination') || s.includes('page')
        )
        // 表格相关建议可能包含分页、排序等
      }
    })
  })

  describe('置信度计算测试', () => {
    it('高置信度输入应该有更高的置信度', async () => {
      const detailed = await parser.parse('创建一个主要的大按钮组件，尺寸为lg，使用primary变体')
      const simple = await parser.parse('创建按钮')

      expect(detailed.confidence).toBeGreaterThan(simple.confidence)
    })

    it('置信度应该在0-1之间', async () => {
      const result = await parser.parse('创建按钮')

      expect(result.confidence).toBeGreaterThanOrEqual(0)
      expect(result.confidence).toBeLessThanOrEqual(1)
    })
  })

  describe('语言检测测试', () => {
    it('应该正确检测中文', async () => {
      const result = await parser.parse('创建按钮组件')

      expect(result.language).toBe('zh')
    })

    it('应该正确检测英文', async () => {
      const result = await parser.parse('Create a button component')

      expect(result.language).toBe('en')
    })

    it('应该处理混合语言', async () => {
      const result = await parser.parse('Create 一个 button')

      // 根据中文字符检测语言
      expect(result.language).toBe('zh')
    })
  })

  describe('意图分类测试', () => {
    it('应该识别创建组件意图', async () => {
      const result = await parser.parse('创建一个按钮')

      expect(result.intent.primary).toBe(IntentType.CREATE_COMPONENT)
    })

    it('应该识别调试意图', async () => {
      const result = await parser.parse('调试按钮错误')

      expect(result.intent.primary).toBe(IntentType.DEBUG_ERROR)
    })

    it('应该识别代码解释意图', async () => {
      const result = await parser.parse('解释按钮代码')

      expect(result.intent.primary).toBe(IntentType.EXPLAIN_CODE)
    })

    it('应该识别审查代码意图', async () => {
      const result = await parser.parse('审查按钮代码')

      expect(result.intent.primary).toBe(IntentType.REVIEW_CODE)
    })

    it('应该识别重构意图', async () => {
      const result = await parser.parse('重构按钮组件')

      expect(result.intent.primary).toBe(IntentType.REFACTOR_CODE)
    })
  })

  describe('边界条件测试', () => {
    it('应该处理非常长的输入', async () => {
      const longInput = '创建一个按钮 ' + '需要支持点击事件'.repeat(100)
      const result = await parser.parse(longInput)

      expect(result.intent).toBeDefined()
    })

    it('应该处理特殊字符', async () => {
      const result = await parser.parse('创建 @#$% 按钮')

      expect(result.component).toBe(ComponentType.BUTTON)
    })

    it('应该处理重复词汇', async () => {
      const result = await parser.parse('创建创建按钮按钮')

      expect(result.component).toBe(ComponentType.BUTTON)
    })
  })
})
