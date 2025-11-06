/**
 * @fileoverview AI助手集成测试
 * @description 测试AI助手与UI组件的协作，包括智能推荐、主题适配、组件生成等功能
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'

// Mock AI助手功能
const mockAIAssistant = {
  suggestComponent: vi.fn(),
  optimizeTheme: vi.fn(),
  generateCode: vi.fn(),
  analyzePerformance: vi.fn(),
}

// 模拟AI包
vi.mock('@xorigo-ui/ai', () => ({
  AIAssistant: {
    create: () => mockAIAssistant,
  },
  ThemeOptimizer: {
    create: () => ({
      optimize: vi.fn().mockResolvedValue({ success: true }),
    }),
  },
  ComponentGenerator: {
    create: () => ({
      generate: vi.fn().mockResolvedValue({ code: 'generated code' }),
    }),
  },
}))

describe('AI助手集成测试', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('智能组件推荐', () => {
    it('应根据上下文推荐合适的组件', async () => {
      const user = userEvent.setup()
      mockAIAssistant.suggestComponent.mockResolvedValueOnce({
        component: 'Button',
        reason: '检测到表单上下文，推荐按钮组件',
        confidence: 0.95,
      })

      render(<div data-testid="form-context">Form Context</div>)

      await waitFor(() => {
        expect(mockAIAssistant.suggestComponent).toHaveBeenCalledWith({
          context: 'form',
          elements: ['input', 'label'],
        })
      })

      expect(screen.getByTestId('form-context')).toBeInTheDocument()
    })

    it('应处理组件推荐结果并渲染UI', async () => {
      const user = userEvent.setup()
      mockAIAssistant.suggestComponent.mockResolvedValueOnce({
        component: 'Modal',
        props: {
          variant: 'primary',
          size: 'lg',
        },
      })

      render(
        <div>
          <button data-testid="trigger">打开对话框</button>
          <div data-testid="modal-container" />
        </div>
      )

      await user.click(screen.getByTestId('trigger'))

      await waitFor(() => {
        expect(screen.getByTestId('modal-container')).toBeInTheDocument()
      })
    })
  })

  describe('主题智能优化', () => {
    it('应根据使用场景自动调整主题', async () => {
      mockAIAssistant.optimizeTheme.mockResolvedValueOnce({
        mode: 'dark',
        contrast: 'high',
        density: 'comfortable',
        adjustments: {
          primaryColor: '#3b82f6',
          secondaryColor: '#8b5cf6',
        },
      })

      const optimizer = mockAIAssistant.optimizeTheme

      const result = await optimizer({
        usage: 'coding',
        timeOfDay: 'night',
        preferences: { darkMode: true },
      })

      expect(result).toEqual(
        expect.objectContaining({
          mode: 'dark',
          contrast: 'high',
        })
      )
    })

    it('应应用主题优化到组件', async () => {
      mockAIAssistant.optimizeTheme.mockResolvedValueOnce({
        tokens: {
          color: {
            primary: '#3b82f6',
            secondary: '#8b5cf6',
          },
          spacing: {
            sm: '0.5rem',
            md: '1rem',
            lg: '1.5rem',
          },
        },
      })

      render(
        <div data-testid="themed-component" className="bg-primary text-primary">
          Themed Content
        </div>
      )

      await waitFor(() => {
        const component = screen.getByTestId('themed-component')
        expect(component).toHaveClass('bg-primary')
      })
    })
  })

  describe('代码生成与优化', () => {
    it('应生成符合规范的组件代码', async () => {
      mockAIAssistant.generateCode.mockResolvedValueOnce({
        code: `
          import { Button } from '@xorigo-ui/core'
          export const MyButton = () => (
            <Button variant="primary" size="lg">
              Click me
            </Button>
          )
        `,
        typeScript: true,
        tested: true,
      })

      const generator = mockAIAssistant.generateCode
      const result = await generator({
        component: 'Button',
        props: { variant: 'primary', size: 'lg' },
        framework: 'react',
        language: 'typescript',
      })

      expect(result).toMatchObject({
        code: expect.stringContaining('Button'),
        typeScript: true,
        tested: true,
      })
    })

    it('应生成可访问的组件代码', async () => {
      mockAIAssistant.generateCode.mockResolvedValueOnce({
        code: expect.stringContaining('aria-label'),
        accessibility: {
          ariaLabel: true,
          role: true,
          keyboardNav: true,
        },
      })

      const result = await mockAIAssistant.generateCode({
        component: 'Button',
        accessibility: true,
      })

      expect(result.code).toContain('aria-label')
      expect(result.accessibility).toEqual(
        expect.objectContaining({
          ariaLabel: true,
          role: true,
        })
      )
    })
  })

  describe('性能分析', () => {
    it('应分析组件性能并提供建议', async () => {
      mockAIAssistant.analyzePerformance.mockResolvedValueOnce({
        score: 92,
        metrics: {
          renderTime: 16,
          bundleSize: 245,
          memoryUsage: 12.5,
        },
        suggestions: [
          '使用React.memo优化重渲染',
          '考虑代码分割减少包大小',
        ],
      })

      const result = await mockAIAssistant.analyzePerformance({
        component: 'DataTable',
        metrics: {
          renderCount: 100,
          updateFrequency: 'high',
        },
      })

      expect(result.score).toBeGreaterThan(90)
      expect(result.suggestions).toContain(
        '使用React.memo优化重渲染'
      )
    })

    it('应生成性能优化建议', async () => {
      mockAIAssistant.analyzePerformance.mockResolvedValueOnce({
        optimizations: [
          {
            type: 'memoization',
            implementation: 'React.memo',
            impact: 'high',
          },
          {
            type: 'lazy-loading',
            implementation: 'React.lazy',
            impact: 'medium',
          },
        ],
      })

      const result = await mockAIAssistant.analyzePerformance({
        component: 'ComplexComponent',
      })

      expect(result.optimizations).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'memoization',
            impact: 'high',
          }),
        ])
      )
    })
  })

  describe('AI助手工作流集成', () => {
    it('应支持完整的开发工作流', async () => {
      // 1. 需求分析
      mockAIAssistant.suggestComponent.mockResolvedValueOnce({
        component: 'Form',
        requirements: ['validation', 'error-handling'],
      })

      // 2. 组件生成
      mockAIAssistant.generateCode.mockResolvedValueOnce({
        code: 'generated form code',
        tests: 'generated tests',
      })

      // 3. 主题适配
      mockAIAssistant.optimizeTheme.mockResolvedValueOnce({
        theme: 'light',
        tokens: {},
      })

      // 4. 性能分析
      mockAIAssistant.analyzePerformance.mockResolvedValueOnce({
        score: 95,
        passed: true,
      })

      const workflowResult = await Promise.all([
        mockAIAssistant.suggestComponent({ context: 'form' }),
        mockAIAssistant.generateCode({ component: 'Form' }),
        mockAIAssistant.optimizeTheme({ usage: 'form' }),
        mockAIAssistant.analyzePerformance({ component: 'Form' }),
      ])

      expect(workflowResult).toHaveLength(4)
      expect(workflowResult[3].score).toBeGreaterThanOrEqual(90)
    })

    it('应处理工作流错误并提供回退方案', async () => {
      mockAIAssistant.generateCode.mockRejectedValueOnce(
        new Error('API Error')
      )

      try {
        await mockAIAssistant.generateCode({ component: 'Button' })
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBe('API Error')
      }
    })
  })
})
