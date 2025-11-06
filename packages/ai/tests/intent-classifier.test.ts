/**
 * Intent Classifier 测试用例
 */

import { describe, it, expect } from 'vitest'
import { IntentClassifier } from '../src/intent-classifier.js'
import { IntentType, Language } from '../src/types.js'

describe('IntentClassifier', () => {
  let classifier: IntentClassifier

  beforeEach(() => {
    classifier = new IntentClassifier({
      language: 'zh',
      enableCache: false
    })
  })

  describe('中文意图分类', () => {
    it('应该识别创建组件意图', async () => {
      const inputs = [
        '创建一个按钮组件',
        '生成一个输入框',
        '设计一个卡片组件',
        '新建一个模态框',
        '我要一个按钮'
      ]

      for (const input of inputs) {
        const result = await classifier.classifyIntent(input, 'zh')
        expect(result.primary).toBe(IntentType.CREATE_COMPONENT)
        expect(result.confidence).toBeGreaterThan(0.5)
      }
    })

    it('应该识别修改组件意图', async () => {
      const inputs = [
        '修改按钮组件',
        '调整输入框样式',
        '更新卡片属性',
        '更改组件变体',
        '编辑按钮大小'
      ]

      for (const input of inputs) {
        const result = await classifier.classifyIntent(input, 'zh')
        expect(result.primary).toBe(IntentType.MODIFY_COMPONENT)
      }
    })

    it('应该识别添加功能意图', async () => {
      const inputs = [
        '添加点击功能',
        '增加排序特性',
        '加入过滤功能',
        '新增加载状态',
        '启用拖拽功能'
      ]

      for (const input of inputs) {
        const result = await classifier.classifyIntent(input, 'zh')
        expect(result.primary).toBe(IntentType.ADD_FEATURE)
      }
    })

    it('应该识别调试意图', async () => {
      const inputs = [
        '调试按钮错误',
        '修复输入框报错',
        '解决组件异常',
        '为什么按钮不工作',
        '怎么解决这个bug'
      ]

      for (const input of inputs) {
        const result = await classifier.classifyIntent(input, 'zh')
        expect(result.primary).toBe(IntentType.DEBUG_ERROR)
      }
    })

    it('应该识别解释代码意图', async () => {
      const inputs = [
        '解释按钮代码',
        '说明组件原理',
        '讲解输入框逻辑',
        '这个代码怎么工作',
        '帮助理解组件'
      ]

      for (const input of inputs) {
        const result = await classifier.classifyIntent(input, 'zh')
        expect(result.primary).toBe(IntentType.EXPLAIN_CODE)
      }
    })

    it('应该识别代码审查意图', async () => {
      const inputs = [
        '审查按钮代码',
        '检查代码质量',
        '评估组件实现',
        '代码审查',
        '检查代码'
      ]

      for (const input of inputs) {
        const result = await classifier.classifyIntent(input, 'zh')
        expect(result.primary).toBe(IntentType.REVIEW_CODE)
      }
    })

    it('应该识别重构意图', async () => {
      const inputs = [
        '重构按钮代码',
        '优化组件结构',
        '改进代码质量',
        '简化组件逻辑',
        '清理代码'
      ]

      for (const input of inputs) {
        const result = await classifier.classifyIntent(input, 'zh')
        expect(result.primary).toBe(IntentType.REFACTOR_CODE)
      }
    })

    it('应该识别文档生成意图', async () => {
      const inputs = [
        '生成组件文档',
        '创建API文档',
        '编写使用说明',
        '添加注释',
        '自动生成文档'
      ]

      for (const input of inputs) {
        const result = await classifier.classifyIntent(input, 'zh')
        expect(result.primary).toBe(IntentType.GENERATE_DOCS)
      })
    })
  })

  describe('英文意图分类', () => {
    it('应该识别创建组件意图', async () => {
      const inputs = [
        'Create a button component',
        'Generate an input component',
        'Build a card component',
        'I need a button',
        'Make a modal'
      ]

      for (const input of inputs) {
        const result = await classifier.classifyIntent(input, 'en')
        expect(result.primary).toBe(IntentType.CREATE_COMPONENT)
        expect(result.confidence).toBeGreaterThan(0.5)
      }
    })

    it('应该识别修改组件意图', async () => {
      const inputs = [
        'Modify the button component',
        'Update the input styles',
        'Change component props',
        'Adjust component variant',
        'Edit button size'
      ]

      for (const input of inputs) {
        const result = await classifier.classifyIntent(input, 'en')
        expect(result.primary).toBe(IntentType.MODIFY_COMPONENT)
      }
    })

    it('应该识别调试意图', async () => {
      const inputs = [
        'Debug button error',
        'Fix input issue',
        'Solve component problem',
        'Why button not working',
        'How to fix this bug'
      ]

      for (const input of inputs) {
        const result = await classifier.classifyIntent(input, 'en')
        expect(result.primary).toBe(IntentType.DEBUG_ERROR)
      }
    })

    it('应该识别解释代码意图', async () => {
      const inputs = [
        'Explain button code',
        'Describe component logic',
        'Clarify input functionality',
        'How does this code work',
        'Help understand component'
      ]

      for (const input of inputs) {
        const result = await classifier.classifyIntent(input, 'en')
        expect(result.primary).toBe(IntentType.EXPLAIN_CODE)
      }
    })

    it('应该识别审查代码意图', async () => {
      const inputs = [
        'Review button code',
        'Check code quality',
        'Audit component implementation',
        'Code review',
        'Evaluate code'
      ]

      for (const input of inputs) {
        const result = await classifier.classifyIntent(input, 'en')
        expect(result.primary).toBe(IntentType.REVIEW_CODE)
      }
    })
  })

  describe('实体抽取测试', () => {
    it('应该抽取组件实体', async () => {
      const result = await classifier.extractEntities('创建一个按钮组件', 'zh')

      const componentEntities = result.filter(e => e.type === 'component')
      expect(componentEntities.length).toBeGreaterThan(0)

      const hasButton = componentEntities.some(e => e.value === 'button')
      expect(hasButton).toBe(true)
    })

    it('应该抽取属性实体', async () => {
      const result = await classifier.extractEntities('设置按钮大小为大', 'zh')

      const propertyEntities = result.filter(e => e.type === 'property')
      expect(propertyEntities.length).toBeGreaterThan(0)

      const hasSize = propertyEntities.some(e => e.value === 'size')
      expect(hasSize).toBe(true)
    })

    it('应该抽取动作实体', async () => {
      const result = await classifier.extractEntities('点击按钮时触发事件', 'zh')

      const actionEntities = result.filter(e => e.type === 'action')
      expect(actionEntities.length).toBeGreaterThan(0)

      const hasClick = actionEntities.some(e => e.value === '点击')
      expect(hasClick).toBe(true)
    })

    it('应该抽取样式实体', async () => {
      const result = await classifier.extractEntities('使用深色主题的按钮', 'zh')

      const styleEntities = result.filter(e => e.type === 'style')
      expect(styleEntities.length).toBeGreaterThan(0)

      const hasTheme = styleEntities.some(e => e.value === 'theme')
      expect(hasTheme).toBe(true)
    })

    it('应该抽取英文实体', async () => {
      const result = await classifier.extractEntities('Create a button with dark theme', 'en')

      expect(result.length).toBeGreaterThan(0)

      const componentEntities = result.filter(e => e.type === 'component')
      expect(componentEntities.length).toBeGreaterThan(0)
    })
  })

  describe('置信度测试', () => {
    it('更具体的输入应该有更高的置信度', async () => {
      const simple = await classifier.classifyIntent('创建按钮', 'zh')
      const detailed = await classifier.classifyIntent('创建一个主要的大按钮组件，尺寸为lg', 'zh')

      expect(detailed.confidence).toBeGreaterThan(simple.confidence)
    })

    it('置信度应该在0-1之间', async () => {
      const result = await classifier.classifyIntent('创建按钮', 'zh')

      expect(result.confidence).toBeGreaterThanOrEqual(0)
      expect(result.confidence).toBeLessThanOrEqual(1)
    })

    it('应该返回次要意图', async () => {
      const result = await classifier.classifyIntent('修改按钮并添加功能', 'zh')

      expect(result.secondary).toBeDefined()
      expect(result.secondary!.length).toBeGreaterThan(0)
    })
  })

  describe('边界条件测试', () => {
    it('应该处理空字符串', async () => {
      const result = await classifier.classifyIntent('', 'zh')

      expect(result.primary).toBeDefined()
      expect(result.confidence).toBeGreaterThanOrEqual(0)
    })

    it('应该处理非常长的输入', async () => {
      const longInput = '创建 ' + '一个按钮组件'.repeat(100)
      const result = await classifier.classifyIntent(longInput, 'zh')

      expect(result.primary).toBe(IntentType.CREATE_COMPONENT)
    })

    it('应该处理特殊字符', async () => {
      const result = await classifier.classifyIntent('创建 @#$% 按钮', 'zh')

      expect(result.primary).toBeDefined()
    })

    it('应该处理混合语言', async () => {
      const result = await classifier.classifyIntent('Create 一个 button', 'zh')

      expect(result.language).toBeDefined()
    })
  })

  describe('组件识别测试', () => {
    const componentTests = [
      { input: '创建按钮', expected: 'button', lang: 'zh' as Language },
      { input: '创建输入框', expected: 'input', lang: 'zh' as Language },
      { input: '创建表格', expected: 'table', lang: 'zh' as Language },
      { input: '创建卡片', expected: 'card', lang: 'zh' as Language },
      { input: '创建模态框', expected: 'modal', lang: 'zh' as Language },
      { input: 'Create button', expected: 'button', lang: 'en' as Language },
      { input: 'Create input', expected: 'input', lang: 'en' as Language },
      { input: 'Create table', expected: 'table', lang: 'en' as Language },
      { input: 'Create card', expected: 'card', lang: 'en' as Language },
      { input: 'Create modal', expected: 'modal', lang: 'en' as Language }
    ]

    componentTests.forEach(({ input, expected, lang }) => {
      it(`应该识别组件: ${expected}`, async () => {
        const entities = await classifier.extractEntities(input, lang)

        const componentEntities = entities.filter(e => e.type === 'component')
        expect(componentEntities.length).toBeGreaterThan(0)

        const hasExpectedComponent = componentEntities.some(
          e => e.value === expected || e.value === expected
        )
        expect(hasExpectedComponent).toBe(true)
      })
    })
  })

  describe('属性识别测试', () => {
    it('应该识别尺寸属性', async () => {
      const inputs = [
        '设置大小为大',
        '配置尺寸为sm',
        '调整大小为large'
      ]

      for (const input of inputs) {
        const entities = await classifier.extractEntities(input, 'zh')
        const propertyEntities = entities.filter(e => e.type === 'property')

        expect(propertyEntities.length).toBeGreaterThan(0)
      }
    })

    it('应该识别变体属性', async () => {
      const inputs = [
        '设置变体为outline',
        '配置样式为primary',
        '调整变体为secondary'
      ]

      for (const input of inputs) {
        const entities = await classifier.extractEntities(input, 'zh')
        const propertyEntities = entities.filter(e => e.type === 'property')

        expect(propertyEntities.length).toBeGreaterThan(0)
      }
    })
  })

  describe('动作识别测试', () => {
    const actionTests = [
      { input: '点击按钮', expected: '点击', lang: 'zh' as Language },
      { input: '悬停显示', expected: '悬停', lang: 'zh' as Language },
      { input: '拖拽移动', expected: '拖拽', lang: 'zh' as Language },
      { input: 'Click button', expected: 'click', lang: 'en' as Language },
      { input: 'Hover over', expected: 'hover', lang: 'en' as Language },
      { input: 'Drag to move', expected: 'drag', lang: 'en' as Language }
    ]

    actionTests.forEach(({ input, expected, lang }) => {
      it(`应该识别动作: ${expected}`, async () => {
        const entities = await classifier.extractEntities(input, lang)

        const actionEntities = entities.filter(e => e.type === 'action')
        expect(actionEntities.length).toBeGreaterThan(0)

        const hasExpectedAction = actionEntities.some(e => e.value === expected)
        expect(hasExpectedAction).toBe(true)
      })
    })
  })

  describe('样式识别测试', () => {
    it('应该识别主题样式', async () => {
      const inputs = [
        '使用深色主题',
        '浅色主题',
        '暗色主题',
        'Auto mode',
        'Light theme',
        'Dark theme'
      ]

      for (const input of inputs) {
        const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
        const entities = await classifier.extractEntities(input, lang)

        const styleEntities = entities.filter(e => e.type === 'style')
        expect(styleEntities.length).toBeGreaterThan(0)
      }
    })

    it('应该识别圆角样式', async () => {
      const inputs = [
        '使用圆角',
        '圆形按钮',
        '圆滑边角',
        'Rounded button',
        'Circular',
        'Smooth corners'
      ]

      for (const input of inputs) {
        const lang = input.match(/[一-龯]/) ? 'zh' : 'en'
        const entities = await classifier.extractEntities(input, lang)

        const styleEntities = entities.filter(e => e.type === 'style')
        expect(styleEntities.length).toBeGreaterThan(0)
      }
    })
  })

  describe('索引位置测试', () => {
    it('实体应该包含正确的索引位置', async () => {
      const input = '创建一个按钮'
      const entities = await classifier.extractEntities(input, 'zh')

      const buttonEntity = entities.find(e => e.value === 'button')
      expect(buttonEntity).toBeDefined()
      expect(buttonEntity!.startIndex).toBeGreaterThanOrEqual(0)
      expect(buttonEntity!.endIndex).toBeGreaterThan(buttonEntity!.startIndex)
    })

    it('索引应该在输入范围内', async () => {
      const input = '创建按钮组件'
      const entities = await classifier.extractEntities(input, 'zh')

      for (const entity of entities) {
        expect(entity.startIndex).toBeGreaterThanOrEqual(0)
        expect(entity.endIndex).toBeLessThanOrEqual(input.length)
        expect(entity.endIndex).toBeGreaterThan(entity.startIndex)
      }
    })
  })

  describe('置信度评分测试', () => {
    it('不同类型的实体应该有合理的置信度', async () => {
      const entities = await classifier.extractEntities('创建一个按钮', 'zh')

      for (const entity of entities) {
        expect(entity.confidence).toBeGreaterThan(0)
        expect(entity.confidence).toBeLessThanOrEqual(1)
      }
    })

    it('组件实体的置信度应该较高', async () => {
      const entities = await classifier.extractEntities('创建按钮', 'zh')

      const componentEntities = entities.filter(e => e.type === 'component')
      if (componentEntities.length > 0) {
        expect(componentEntities[0].confidence).toBeGreaterThanOrEqual(0.8)
      }
    })
  })
})
