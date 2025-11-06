/**
 * @fileoverview 代码生成器测试
 * @description 测试代码生成器的各种功能
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createCodeGenerator } from '../core/code-generator'
import type { ComponentSpec } from '../types'

// 模拟Anthropic API
vi.mock('@anthropic-ai/sdk', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      messages: {
        create: vi.fn().mockResolvedValue({
          content: [
            {
              text: '```tsx\nimport React from "react"\nexport const TestComponent = () => <div>Test</div>\n```'
            }
          ]
        })
      }
    }))
  }
})

describe('CodeGenerator', () => {
  let generator: ReturnType<typeof createCodeGenerator>

  const mockSpec: ComponentSpec = {
    name: 'TestComponent',
    description: '测试组件',
    type: 'base',
    category: 'primitives',
    props: [
      {
        name: 'children',
        type: 'ReactNode',
        required: true,
        description: '组件内容'
      }
    ],
    theming: true,
    animated: false,
    accessible: true
  }

  beforeEach(() => {
    generator = createCodeGenerator({
      outputDir: './test-output',
      generateTests: false,
      generateDocs: false,
      generateStory: false,
      claudeConfig: {
        apiKey: 'test-api-key'
      }
    })
  })

  describe('generate', () => {
    it('应该成功生成基础组件', async () => {
      const result = await generator.generate(mockSpec)

      expect(result.spec.name).toBe('TestComponent')
      expect(result.files.length).toBeGreaterThan(0)
      expect(result.totalTime).toBeGreaterThan(0)
      expect(result.stats.filesGenerated).toBeGreaterThan(0)
    })

    it('应该验证组件规范', async () => {
      const invalidSpec = {
        ...mockSpec,
        name: 'invalid-name' // 包含连字符，违反PascalCase规范
      }

      await expect(generator.generate(invalidSpec as ComponentSpec)).rejects.toThrow()
    })

    it('应该生成TypeScript类型定义', async () => {
      const result = await generator.generate(mockSpec)

      const typeFiles = result.files.filter(f => f.type === 'types')
      expect(typeFiles.length).toBeGreaterThan(0)
    })

    it('应该在配置中启用时生成测试', async () => {
      const generatorWithTests = createCodeGenerator({
        outputDir: './test-output',
        generateTests: true,
        generateDocs: false,
        generateStory: false
      })

      const result = await generatorWithTests.generate(mockSpec)

      const testFiles = result.files.filter(f => f.type === 'test')
      expect(testFiles.length).toBeGreaterThan(0)
    })

    it('应该在配置中启用时生成文档', async () => {
      const generatorWithDocs = createCodeGenerator({
        outputDir: './test-output',
        generateTests: false,
        generateDocs: true,
        generateStory: false
      })

      const result = await generatorWithDocs.generate(mockSpec)

      const docsFiles = result.files.filter(f => f.type === 'docs')
      expect(docsFiles.length).toBeGreaterThan(0)
    })
  })

  describe('generateBatch', () => {
    it('应该批量生成多个组件', async () => {
      const specs = [
        mockSpec,
        { ...mockSpec, name: 'TestComponent2' },
        { ...mockSpec, name: 'TestComponent3' }
      ]

      const results = await generator.generateBatch(specs)

      expect(results).toHaveLength(3)
      expect(results[0].spec.name).toBe('TestComponent')
      expect(results[1].spec.name).toBe('TestComponent2')
      expect(results[2].spec.name).toBe('TestComponent3')
    })

    it('应该统计批量生成结果', async () => {
      const specs = [
        mockSpec,
        { ...mockSpec, name: 'TestComponent2' }
      ]

      const results = await generator.generateBatch(specs)

      const totalFiles = results.reduce((sum, r) => sum + r.stats.filesGenerated, 0)
      const totalLines = results.reduce((sum, r) => sum + r.stats.linesOfCode, 0)

      expect(totalFiles).toBeGreaterThan(0)
      expect(totalLines).toBeGreaterThan(0)
    })
  })

  describe('缓存功能', () => {
    it('应该能够清除缓存', () => {
      generator.clearCache()
      // 缓存清除不抛出错误即成功
      expect(true).toBe(true)
    })

    it('应该返回当前配置', () => {
      const config = generator.getConfig()
      expect(config.outputDir).toBe('./test-output')
    })
  })
})

describe('TypeScript生成', () => {
  it('应该生成有效的TypeScript代码', async () => {
    const generator = createCodeGenerator({
      outputDir: './test-output',
      generateTests: false,
      generateDocs: false,
      generateStory: false
    })

    const spec: ComponentSpec = {
      name: 'TypeTest',
      description: '类型测试组件',
      type: 'base',
      category: 'primitives',
      props: [
        {
          name: 'value',
          type: 'string',
          required: true,
          description: '字符串值'
        },
        {
          name: 'onChange',
          type: '(value: string) => void',
          required: false,
          description: '变化回调'
        }
      ],
      theming: true,
      animated: false,
      accessible: true
    }

    const result = await generator.generate(spec)

    // 检查是否生成了类型定义文件
    const typeFiles = result.files.filter(f => f.type === 'types')
    expect(typeFiles.length).toBeGreaterThan(0)

    // 检查类型文件中是否包含接口定义
    const typeFile = typeFiles[0]
    expect(typeFile.content).toContain('TypeTestProps')
    expect(typeFile.content).toContain('value: string')
  })
})
