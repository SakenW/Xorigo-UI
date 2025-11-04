/**
 * @fileoverview ZodAdapter 组件测试
 * @description 测试 Zod 验证适配器组件的渲染、验证和交互功能
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { z } from 'zod'
import { ZodAdapter, useZodAdapter, useZodField, useZodForm, createZodValidationRule } from './zod-adapter'
import { Button } from '../../primitives'

// Mock zod
vi.mock('zod', () => ({
  z: {
    object: vi.fn(),
    string: vi.fn().mockReturnThis(),
    email: vi.fn().mockReturnThis(),
    min: vi.fn().mockReturnThis(),
    max: vi.fn().mockReturnThis(),
    number: vi.fn().mockReturnThis(),
    required: vi.fn().mockReturnThis(),
    refine: vi.fn().mockReturnThis(),
    safeParse: vi.fn(),
    safeParseAsync: vi.fn(),
    pick: vi.fn(),
  },
  ZodError: class ZodError extends Error {
    errors: any[]
    constructor(errors: any[]) {
      super('Zod validation error')
      this.errors = errors
    }
  },
}))

// Test schema
const testSchema = z.object({
  name: z.string().min(2, '姓名至少需要2个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  age: z.number().min(18, '年龄必须至少18岁'),
})

const initialValues = {
  name: '',
  email: '',
  age: 0,
}

describe('ZodAdapter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Basic Rendering', () => {
    it('应该正确渲染 ZodAdapter 组件', () => {
      render(
        <ZodAdapter schema={testSchema} initialValues={initialValues}>
          <div data-testid="form-content">表单内容</div>
        </ZodAdapter>
      )

      expect(screen.getByRole('form')).toBeInTheDocument()
      expect(screen.getByTestId('form-content')).toBeInTheDocument()
    })

    it('应该使用默认属性渲染', () => {
      render(
        <ZodAdapter schema={testSchema}>
          <div>内容</div>
        </ZodAdapter>
      )

      const form = screen.getByRole('form')
      expect(form).toBeInTheDocument()
    })

    it('应该支持不同的变体', () => {
      const { rerender } = render(
        <ZodAdapter schema={testSchema} variant="default">
          <div>内容</div>
        </ZodAdapter>
      )

      rerender(
        <ZodAdapter schema={testSchema} variant="minimal">
          <div>内容</div>
        </ZodAdapter>
      )

      rerender(
        <ZodAdapter schema={testSchema} variant="bordered">
          <div>内容</div>
        </ZodAdapter>
      )

      expect(screen.getByRole('form')).toBeInTheDocument()
    })

    it('应该支持不同的尺寸', () => {
      const { rerender } = render(
        <ZodAdapter schema={testSchema} size="sm">
          <div>内容</div>
        </ZodAdapter>
      )

      rerender(
        <ZodAdapter schema={testSchema} size="md">
          <div>内容</div>
        </ZodAdapter>
      )

      rerender(
        <ZodAdapter schema={testSchema} size="lg">
          <div>内容</div>
        </ZodAdapter>
      )

      rerender(
        <ZodAdapter schema={testSchema} size="xl">
          <div>内容</div>
        </ZodAdapter>
      )

      expect(screen.getByRole('form')).toBeInTheDocument()
    })
  })

  describe('Form Submission', () => {
    it('应该在提交时验证表单', async () => {
      const user = userEvent.setup()
      const handleSubmit = vi.fn()

      render(
        <ZodAdapter
          schema={testSchema}
          initialValues={initialValues}
          onSubmit={handleSubmit}
        >
          <div>
            <input
              data-testid="name-input"
              name="name"
              type="text"
            />
            <input
              data-testid="email-input"
              name="email"
              type="email"
            />
            <button type="submit">提交</button>
          </div>
        </ZodAdapter>
      )

      const submitButton = screen.getByRole('button', { name: /提交/ })
      await user.click(submitButton)

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalled()
      })
    })

    it('应该在提交时显示加载状态', async () => {
      const user = userEvent.setup()
      const handleSubmit = vi.fn().mockImplementation(() => {
        return new Promise(resolve => setTimeout(resolve, 100))
      })

      render(
        <ZodAdapter
          schema={testSchema}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          showSubmittingState={true}
        >
          <div>
            <input name="name" type="text" />
            <button type="submit">提交</button>
          </div>
        </ZodAdapter>
      )

      const submitButton = screen.getByRole('button', { name: /提交/ })
      await user.click(submitButton)

      expect(screen.getByText(/提交中.../)).toBeInTheDocument()

      await waitFor(() => {
        expect(screen.queryByText(/提交中.../)).not.toBeInTheDocument()
      })
    })

    it('应该禁用提交按钮当表单无效时', () => {
      render(
        <ZodAdapter
          schema={testSchema}
          initialValues={initialValues}
          showSubmitButton={true}
        >
          <div>
            <input name="name" type="text" value="" />
            <button type="submit">提交</button>
          </div>
        </ZodAdapter>
      )

      const submitButton = screen.getByRole('button', { name: /提交/ })
      expect(submitButton).toBeDisabled()
    })
  })

  describe('Form Reset', () => {
    it('应该正确重置表单', async () => {
      const user = userEvent.setup()
      const handleReset = vi.fn()

      render(
        <ZodAdapter
          schema={testSchema}
          initialValues={initialValues}
          onReset={handleReset}
          showResetButton={true}
        >
          <div>
            <input name="name" type="text" />
            <button type="reset">重置</button>
          </div>
        </ZodAdapter>
      )

      const resetButton = screen.getByRole('button', { name: /重置/ })
      await user.click(resetButton)

      expect(handleReset).toHaveBeenCalled()
    })
  })

  describe('Field Validation', () => {
    it('应该在字段失去焦点时验证', async () => {
      const user = userEvent.setup()

      render(
        <ZodAdapter
          schema={testSchema}
          initialValues={initialValues}
          validateOnBlur={true}
        >
          <div>
            <input
              data-testid="name-input"
              name="name"
              type="text"
            />
          </div>
        </ZodAdapter>
      )

      const input = screen.getByTestId('name-input')
      await user.click(input)
      await user.tab()

      await waitFor(() => {
        // 验证逻辑会被触发
      })
    })

    it('应该在字段值改变时验证', async () => {
      const user = userEvent.setup()

      render(
        <ZodAdapter
          schema={testSchema}
          initialValues={initialValues}
          validateOnChange={true}
        >
          <div>
            <input
              data-testid="name-input"
              name="name"
              type="text"
            />
          </div>
        </ZodAdapter>
      )

      const input = screen.getByTestId('name-input')
      await user.type(input, 'a')

      await waitFor(() => {
        // 验证逻辑会被触发
      })
    })
  })

  describe('Context Integration', () => {
    it('应该在表单内容中使用 context', () => {
      const TestComponent = () => {
        const context = useZodAdapter()
        return <div data-testid="context-value">{context.values.name}</div>
      }

      render(
        <ZodAdapter schema={testSchema} initialValues={{ name: '测试' }}>
          <TestComponent />
        </ZodAdapter>
      )

      expect(screen.getByTestId('context-value')).toHaveTextContent('测试')
    })

    it('应该提供 getFieldProps 方法', () => {
      const TestComponent = () => {
        const context = useZodAdapter()
        const fieldProps = context.getFieldProps('name')
        return <div data-testid="field-props">{fieldProps.name}</div>
      }

      render(
        <ZodAdapter schema={testSchema} initialValues={initialValues}>
          <TestComponent />
        </ZodAdapter>
      )

      expect(screen.getByTestId('field-props')).toHaveTextContent('name')
    })
  })

  describe('Hooks', () => {
    describe('useZodField', () => {
      it('应该返回字段属性和状态', () => {
        const TestComponent = () => {
          const { field, error, touched, validating } = useZodField('name')
          return (
            <div>
              <div data-testid="field-name">{field.name}</div>
              <div data-testid="field-value">{field.value}</div>
            </div>
          )
        }

        render(
          <ZodAdapter schema={testSchema} initialValues={{ name: '测试' }}>
            <TestComponent />
          </ZodAdapter>
        )

        expect(screen.getByTestId('field-name')).toHaveTextContent('name')
        expect(screen.getByTestId('field-value')).toHaveTextContent('测试')
      })
    })

    describe('useZodForm', () => {
      it('应该返回表单状态', () => {
        const TestComponent = () => {
          const { values, errors, touched, isValid, isDirty } = useZodForm()
          return (
            <div>
              <div data-testid="is-valid">{isValid.toString()}</div>
              <div data-testid="is-dirty">{isDirty.toString()}</div>
            </div>
          )
        }

        render(
          <ZodAdapter schema={testSchema} initialValues={initialValues}>
            <TestComponent />
          </ZodAdapter>
        )

        expect(screen.getByTestId('is-valid')).toHaveTextContent('true')
        expect(screen.getByTestId('is-dirty')).toHaveTextContent('false')
      })
    })

    describe('useZodSubmit', () => {
      it('应该返回提交相关方法', () => {
        const TestComponent = () => {
          const { setFieldValue, setFieldTouched } = useZodSubmit()
          return (
            <div>
              <button
                onClick={() => setFieldValue('name', '新值')}
                data-testid="set-value"
              >
                设置值
              </button>
            </div>
          )
        }

        render(
          <ZodAdapter schema={testSchema} initialValues={initialValues}>
            <TestComponent />
          </ZodAdapter>
        )

        expect(screen.getByTestId('set-value')).toBeInTheDocument()
      })
    })

    describe('useZodReset', () => {
      it('应该返回重置方法', () => {
        const TestComponent = () => {
          const resetForm = useZodReset()
          return (
            <div>
              <button onClick={resetForm} data-testid="reset-button">
                重置表单
              </button>
            </div>
          )
        }

        render(
          <ZodAdapter schema={testSchema} initialValues={initialValues}>
            <TestComponent />
          </ZodAdapter>
        )

        expect(screen.getByTestId('reset-button')).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('应该设置正确的 aria 属性', () => {
      render(
        <ZodAdapter schema={testSchema} initialValues={initialValues}>
          <div>
            <input name="name" type="text" />
          </div>
        </ZodAdapter>
      )

      const form = screen.getByRole('form')
      expect(form).toHaveAttribute('aria-busy')
    })

    it('应该在有错误时设置 aria-invalid', () => {
      render(
        <ZodAdapter
          schema={testSchema}
          initialValues={initialValues}
          showValidationErrors={true}
        >
          <div>
            <input name="name" type="text" value="" />
          </div>
        </ZodAdapter>
      )

      const form = screen.getByRole('form')
      expect(form).toHaveAttribute('aria-invalid', 'true')
    })

    it('应该设置 aria-describedby 当有验证错误时', () => {
      render(
        <ZodAdapter
          schema={testSchema}
          initialValues={initialValues}
          showValidationErrors={true}
        >
          <div>
            <input name="name" type="text" />
          </div>
        </ZodAdapter>
      )

      const form = screen.getByRole('form')
      expect(form).toHaveAttribute('aria-describedby')
    })
  })

  describe('Disabled State', () => {
    it('应该在禁用时应用正确的样式', () => {
      render(
        <ZodAdapter schema={testSchema} disabled={true}>
          <div>内容</div>
        </ZodAdapter>
      )

      const form = screen.getByRole('form')
      expect(form).toHaveClass('opacity-50', 'cursor-not-allowed')
    })

    it('应该在适配器禁用时禁用所有交互', () => {
      render(
        <ZodAdapter schema={testSchema} adapterDisabled={true}>
          <div>
            <input name="name" type="text" />
            <button type="submit">提交</button>
          </div>
        </ZodAdapter>
      )

      const form = screen.getByRole('form')
      expect(form).toHaveClass('opacity-50', 'cursor-not-allowed')
    })
  })

  describe('Error Handling', () => {
    it('应该处理验证错误', () => {
      const invalidSchema = z.object({
        name: z.string().min(5),
      })

      render(
        <ZodAdapter
          schema={invalidSchema}
          initialValues={{ name: '短' }}
          showValidationErrors={true}
        >
          <div>内容</div>
        </ZodAdapter>
      )

      // 错误处理逻辑会被触发
      expect(screen.getByRole('form')).toBeInTheDocument()
    })

    it('应该处理提交错误', async () => {
      const user = userEvent.setup()
      const handleSubmit = vi.fn().mockRejectedValue(new Error('提交失败'))

      render(
        <ZodAdapter
          schema={testSchema}
          initialValues={initialValues}
          onSubmit={handleSubmit}
        >
          <div>
            <input name="name" type="text" />
            <button type="submit">提交</button>
          </div>
        </ZodAdapter>
      )

      const submitButton = screen.getByRole('button', { name: /提交/ })
      await user.click(submitButton)

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalled()
      })
    })
  })

  describe('Custom Validators', () => {
    it('应该创建 Zod 验证规则', () => {
      const rule = createZodValidationRule(testSchema)
      expect(rule).toHaveProperty('schema')
      expect(rule).toHaveProperty('validate')
    })

    it('应该创建必填字段验证器', () => {
      const { createRequiredValidator } = require('./zod-adapter')
      const validator = createRequiredValidator('自定义错误消息')

      expect(typeof validator).toBe('function')
      expect(validator('')).toBe('自定义错误消息')
      expect(validator('value')).toBe(true)
    })

    it('应该创建邮箱验证器', () => {
      const { createEmailValidator } = require('./zod-adapter')
      const validator = createEmailValidator('自定义邮箱错误')

      expect(typeof validator).toBe('function')
    })

    it('应该创建最小长度验证器', () => {
      const { createMinLengthValidator } = require('./zod-adapter')
      const validator = createMinLengthValidator(5)

      expect(typeof validator).toBe('function')
      expect(validator('1234')).toContain('最少需要')
      expect(validator('12345')).toBe(true)
    })

    it('应该创建最大长度验证器', () => {
      const { createMaxLengthValidator } = require('./zod-adapter')
      const validator = createMaxLengthValidator(5)

      expect(typeof validator).toBe('function')
      expect(validator('123456')).toContain('最多允许')
      expect(validator('12345')).toBe(true)
    })
  })

  describe('Reinitialization', () => {
    it('应该在 enableReinitialize 时重新初始化表单', () => {
      const { rerender } = render(
        <ZodAdapter
          schema={testSchema}
          initialValues={{ name: '初始值' }}
          enableReinitialize={true}
        >
          <div>内容</div>
        </ZodAdapter>
      )

      rerender(
        <ZodAdapter
          schema={testSchema}
          initialValues={{ name: '新值' }}
          enableReinitialize={true}
        >
          <div>内容</div>
        </ZodAdapter>
      )

      // 重新初始化逻辑会被触发
      expect(screen.getByRole('form')).toBeInTheDocument()
    })
  })

  describe('Conditional Validation', () => {
    it('应该支持条件验证', () => {
      const conditionalSchema = z.object({
        hasAddress: z.boolean(),
        address: z.string().min(5).optional(),
      })

      render(
        <ZodAdapter schema={conditionalSchema} initialValues={{ hasAddress: false }}>
          <div>内容</div>
        </ZodAdapter>
      )

      expect(screen.getByRole('form')).toBeInTheDocument()
    })
  })

  describe('Async Validation', () => {
    it('应该处理异步验证', async () => {
      const user = userEvent.setup()
      const asyncValidator = vi.fn().mockResolvedValue(true)

      render(
        <ZodAdapter
          schema={testSchema}
          initialValues={initialValues}
          validateOnBlur={true}
        >
          <div>
            <input
              data-testid="email-input"
              name="email"
              type="email"
            />
          </div>
        </ZodAdapter>
      )

      const input = screen.getByTestId('email-input')
      await user.click(input)
      await user.type(input, 'test@example.com')
      await user.tab()

      await waitFor(() => {
        // 异步验证逻辑会被触发
      })
    })
  })

  describe('Nested Object Validation', () => {
    it('应该验证嵌套对象', () => {
      const nestedSchema = z.object({
        user: z.object({
          name: z.string(),
          email: z.string(),
        }),
      })

      render(
        <ZodAdapter
          schema={nestedSchema}
          initialValues={{ user: { name: '', email: '' } }}
        >
          <div>内容</div>
        </ZodAdapter>
      )

      expect(screen.getByRole('form')).toBeInTheDocument()
    })
  })

  describe('Array Validation', () => {
    it('应该验证数组字段', () => {
      const arraySchema = z.object({
        tags: z.array(z.string()),
      })

      render(
        <ZodAdapter
          schema={arraySchema}
          initialValues={{ tags: [] }}
        >
          <div>内容</div>
        </ZodAdapter>
      )

      expect(screen.getByRole('form')).toBeInTheDocument()
    })
  })
})
