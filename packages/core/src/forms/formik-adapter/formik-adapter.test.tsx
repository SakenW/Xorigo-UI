import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { FormikAdapter, useFormikAdapter, useFormikField } from './formik-adapter'
import { Button } from '../../primitives'

// Mock Formik
vi.mock('formik', () => ({
  Formik: ({ children, ...props }: any) => {
    const mockFormikProps = {
      values: props.initialValues || {},
      errors: {},
      touched: {},
      isSubmitting: false,
      isValidating: false,
      isValid: true,
      dirty: false,
      getFieldProps: (name: string) => ({
        name,
        value: props.initialValues?.[name] || '',
        onChange: vi.fn(),
        onBlur: vi.fn(),
      }),
      getFieldMeta: (name: string) => ({
        value: props.initialValues?.[name] || '',
        error: null,
        touched: false,
      }),
      getFieldHelpers: (name: string) => ({
        setValue: vi.fn(),
        setError: vi.fn(),
        setTouched: vi.fn(),
      }),
      handleSubmit: vi.fn(),
      handleChange: vi.fn(),
      handleBlur: vi.fn(),
      resetForm: vi.fn(),
      validateForm: vi.fn().mockResolvedValue({}),
      validateField: vi.fn().mockResolvedValue(undefined),
      setFieldValue: vi.fn(),
      setFieldError: vi.fn(),
      setFieldTouched: vi.fn(),
      setValues: vi.fn(),
      setErrors: vi.fn(),
      setTouched: vi.fn(),
      submitForm: vi.fn(),
      ...props,
    }

    if (typeof children === 'function') {
      return <div data-testid="formik-wrapper">{children(mockFormikProps)}</div>
    }
    return <div data-testid="formik-wrapper">{children}</div>
  },
}))

describe('FormikAdapter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('基本功能', () => {
    it('应该正确渲染基本表单', () => {
      const TestForm = () => {
        const formik = useFormikAdapter()
        return (
          <div>
            <input data-testid="email" name="email" {...formik.getFieldProps('email')} />
            <div data-testid="is-submitting">{formik.isSubmitting.toString()}</div>
          </div>
        )
      }

      render(
        <FormikAdapter initialValues={{ email: '' }}>
          <TestForm />
        </FormikAdapter>
      )

      expect(screen.getByTestId('email')).toBeInTheDocument()
      expect(screen.getByTestId('is-submitting')).toHaveTextContent('false')
    })

    it('应该接受初始值', () => {
      const TestForm = () => {
        const formik = useFormikAdapter()
        return (
          <input data-testid="username" {...formik.getFieldProps('username')} />
        )
      }

      render(
        <FormikAdapter initialValues={{ username: 'testuser' }}>
          <TestForm />
        </FormikAdapter>
      )

      const input = screen.getByTestId('username') as HTMLInputElement
      expect(input.value).toBe('testuser')
    })

    it('应该支持自定义提交处理', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined)
      const TestForm = () => {
        const formik = useFormikAdapter()
        return (
          <button
            data-testid="submit-button"
            onClick={() => formik.handleSubmit()}
          >
            提交
          </button>
        )
      }

      render(
        <FormikAdapter
          initialValues={{ email: '' }}
          onSubmit={onSubmit}
        >
          <TestForm />
        </FormikAdapter>
      )

      fireEvent.click(screen.getByTestId('submit-button'))

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalled()
      })
    })

    it('应该支持表单重置', () => {
      const TestForm = () => {
        const formik = useFormikAdapter()
        return (
          <>
            <input data-testid="email" {...formik.getFieldProps('email')} />
            <button
              data-testid="reset-button"
              onClick={() => formik.resetForm()}
            >
              重置
            </button>
          </>
        )
      }

      render(
        <FormikAdapter initialValues={{ email: 'test@example.com' }}>
          <TestForm />
        </FormikAdapter>
      )

      const input = screen.getByTestId('email') as HTMLInputElement
      expect(input.value).toBe('test@example.com')

      fireEvent.click(screen.getByTestId('reset-button'))
      expect(formikResetForm).toHaveBeenCalled()
    })
  })

  describe('变体和尺寸', () => {
    it('应该支持 default 变体', () => {
      const TestForm = () => <div>Form Content</div>
      const { container } = render(
        <FormikAdapter variant="default">
          <TestForm />
        </FormikAdapter>
      )
      expect(container.firstChild).toHaveClass('bg-background')
    })

    it('应该支持 minimal 变体', () => {
      const TestForm = () => <div>Form Content</div>
      const { container } = render(
        <FormikAdapter variant="minimal">
          <TestForm />
        </FormikAdapter>
      )
      expect(container.firstChild).toHaveClass('bg-transparent')
    })

    it('应该支持 bordered 变体', () => {
      const TestForm = () => <div>Form Content</div>
      const { container } = render(
        <FormikAdapter variant="bordered">
          <TestForm />
        </FormikAdapter>
      )
      expect(container.firstChild).toHaveClass('border', 'border-border', 'rounded-lg')
    })

    it('应该支持不同尺寸', () => {
      const TestForm = () => <div>Form Content</div>
      const { container: smContainer } = render(
        <FormikAdapter size="sm">
          <TestForm />
        </FormikAdapter>
      )
      expect(smContainer.firstChild).toHaveClass('text-sm')

      const { container: lgContainer } = render(
        <FormikAdapter size="lg">
          <TestForm />
        </FormikAdapter>
      )
      expect(lgContainer.firstChild).toHaveClass('text-lg')
    })
  })

  describe('按钮配置', () => {
    it('应该显示默认提交按钮', () => {
      const TestForm = () => <div>Form Content</div>
      render(
        <FormikAdapter>
          <TestForm />
        </FormikAdapter>
      )

      const submitButton = screen.getByRole('button', { name: /提交/ })
      expect(submitButton).toBeInTheDocument()
    })

    it('应该支持自定义提交按钮文本', () => {
      const TestForm = () => <div>Form Content</div>
      render(
        <FormikAdapter submitButtonLabel="保存">
          <TestForm />
        </FormikAdapter>
      )

      expect(screen.getByRole('button', { name: /保存/ })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /提交/ })).not.toBeInTheDocument()
    })

    it('应该允许隐藏提交按钮', () => {
      const TestForm = () => <div>Form Content</div>
      render(
        <FormikAdapter showSubmitButton={false}>
          <TestForm />
        </FormikAdapter>
      )

      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('应该显示重置按钮', () => {
      const TestForm = () => <div>Form Content</div>
      render(
        <FormikAdapter showResetButton={true}>
          <TestForm />
        </FormikAdapter>
      )

      expect(screen.getByRole('button', { name: /重置/ })).toBeInTheDocument()
    })

    it('应该支持自定义重置按钮文本', () => {
      const TestForm = () => <div>Form Content</div>
      render(
        <FormikAdapter showResetButton={true} resetButtonLabel="清空">
          <TestForm />
        </FormikAdapter>
      )

      expect(screen.getByRole('button', { name: /清空/ })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /重置/ })).not.toBeInTheDocument()
    })
  })

  describe('状态管理', () => {
    it('应该正确显示提交状态', () => {
      const TestForm = () => {
        const formik = useFormikAdapter()
        return (
          <button data-testid="submit-btn" onClick={() => formik.handleSubmit()}>
            {formik.isSubmitting ? '提交中...' : '提交'}
          </button>
        )
      }

      render(
        <FormikAdapter initialValues={{ email: '' }}>
          <TestForm />
        </FormikAdapter>
      )

      const button = screen.getByTestId('submit-btn')
      expect(button).toHaveTextContent('提交')

      fireEvent.click(button)
      expect(button).toHaveTextContent('提交中...')
    })

    it('应该在禁用状态下禁用提交按钮', () => {
      const TestForm = () => {
        const formik = useFormikAdapter()
        return (
          <button data-testid="submit-btn" onClick={() => formik.handleSubmit()}>
            提交
          </button>
        )
      }

      render(
        <FormikAdapter disabled={true}>
          <TestForm />
        </FormikAdapter>
      )

      const submitButton = screen.getByRole('button', { name: /提交/ })
      expect(submitButton).toBeDisabled()
    })

    it('应该在只读状态下禁用提交按钮', () => {
      const TestForm = () => {
        const formik = useFormikAdapter()
        return (
          <button data-testid="submit-btn" onClick={() => formik.handleSubmit()}>
            提交
          </button>
        )
      }

      render(
        <FormikAdapter adapterReadonly={true}>
          <TestForm />
        </FormikAdapter>
      )

      const submitButton = screen.getByRole('button', { name: /提交/ })
      expect(submitButton).toBeDisabled()
    })
  })

  describe('Hook 功能', () => {
    it('useFormikField 应该返回字段属性', () => {
      const TestForm = () => {
        const { field, meta, helpers } = useFormikField('email')
        return (
          <div>
            <input data-testid="email-input" {...field} />
            <div data-testid="meta-value">{meta.value}</div>
            <div data-testid="meta-error">{meta.error || 'no-error'}</div>
          </div>
        )
      }

      render(
        <FormikAdapter initialValues={{ email: 'test@example.com' }}>
          <TestForm />
        </FormikAdapter>
      )

      expect(screen.getByTestId('email-input')).toBeInTheDocument()
      expect(screen.getByTestId('meta-value')).toHaveTextContent('test@example.com')
      expect(screen.getByTestId('meta-error')).toHaveTextContent('no-error')
    })

    it('useFormikForm 应该返回表单状态', () => {
      const TestForm = () => {
        const form = useFormikForm()
        return (
          <div>
            <div data-testid="is-valid">{form.isValid.toString()}</div>
            <div data-testid="is-dirty">{form.dirty.toString()}</div>
            <div data-testid="values-count">{Object.keys(form.values).length}</div>
          </div>
        )
      }

      render(
        <FormikAdapter initialValues={{ name: 'John', email: 'john@example.com' }}>
          <TestForm />
        </FormikAdapter>
      )

      expect(screen.getByTestId('is-valid')).toHaveTextContent('true')
      expect(screen.getByTestId('is-dirty')).toHaveTextContent('false')
      expect(screen.getByTestId('values-count')).toHaveTextContent('2')
    })
  })

  describe('可访问性', () => {
    it('应该设置正确的 ARIA 属性', () => {
      const TestForm = () => <div>Form Content</div>
      render(
        <FormikAdapter initialValues={{ email: '' }}>
          <TestForm />
        </FormikAdapter>
      )

      const formElement = screen.getByRole('form')
      expect(formElement).toBeInTheDocument()
      expect(formElement).toHaveAttribute('aria-busy', 'false')
    })

    it('应该在有错误时设置 aria-invalid', () => {
      const TestForm = () => <div>Form Content</div>
      render(
        <FormikAdapter initialValues={{ email: '' }}>
          <TestForm />
        </FormikAdapter>
      )

      const formElement = screen.getByRole('form')
      expect(formElement).toHaveAttribute('aria-invalid', 'false')
    })

    it('应该支持禁用状态的可访问性', () => {
      const TestForm = () => <div>Form Content</div>
      render(
        <FormikAdapter disabled={true}>
          <TestForm />
        </FormikAdapter>
      )

      const formElement = screen.getByRole('form')
      expect(formElement).toHaveClass('opacity-50', 'cursor-not-allowed')
    })
  })

  describe('错误处理', () => {
    it('应该在上下文外部抛出错误', () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const ConsoleError = console.error
      console.error = vi.fn()

      expect(() => {
        render(<FormikAdapterComponent />)
      }).toThrow('useFormikAdapter must be used within a FormikAdapter component')

      console.error = ConsoleError
    })

    it('应该正确处理验证错误', () => {
      const TestForm = () => {
        const formik = useFormikAdapter()
        return (
          <div>
            {Object.keys(formik.errors).length > 0 && (
              <div data-testid="error-summary" role="alert">
                {Object.entries(formik.errors).map(([field, error]) => (
                  <div key={field}>{error}</div>
                ))}
              </div>
            )}
          </div>
        )
      }

      render(
        <FormikAdapter initialValues={{ email: 'invalid-email' }}>
          <TestForm />
        </FormikAdapter>
      )
    })
  })

  describe('类型安全', () => {
    it('应该支持泛型类型', () => {
      interface UserForm {
        name: string
        email: string
        age: number
      }

      const TestForm = () => {
        const formik = useFormikAdapter<UserForm>()
        return (
          <div>
            <input data-testid="name" {...formik.getFieldProps('name')} />
            <input data-testid="email" type="email" {...formik.getFieldProps('email')} />
            <input data-testid="age" type="number" {...formik.getFieldProps('age')} />
          </div>
        )
      }

      render(
        <FormikAdapter<UserForm>
          initialValues={{
            name: 'John',
            email: 'john@example.com',
            age: 30,
          }}
        >
          <TestForm />
        </FormikAdapter>
      )

      expect(screen.getByTestId('name')).toBeInTheDocument()
      expect(screen.getByTestId('email')).toBeInTheDocument()
      expect(screen.getByTestId('age')).toBeInTheDocument()
    })
  })
})

// 辅助组件
const FormikAdapterComponent = () => {
  try {
    useFormikAdapter()
    return <div>Should not render</div>
  } catch {
    return <div>Error caught</div>
  }
}
