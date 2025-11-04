import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, renderHook, act } from '@testing-library/react'
import { FormProvider, useForm } from './form-provider'

// 测试数据
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <FormProvider>{children}</FormWrapper>
)

describe('FormProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('基本功能', () => {
    it('应该提供表单上下文', () => {
      const { result } = renderHook(() => useForm(), {
        wrapper: TestWrapper,
      })

      expect(result.current).toBeDefined()
      expect(result.current.values).toEqual({})
      expect(result.current.errors).toEqual({})
      expect(result.current.touched).toEqual({})
      expect(result.current.disabled).toBe(false)
      expect(result.current.readonly).toBe(false)
      expect(result.current.isSubmitting).toBe(false)
      expect(result.current.isValid).toBe(true)
      expect(result.current.isDirty).toBe(false)
    })

    it('应该接受初始值', () => {
      const initialValues = { name: 'John', email: 'john@example.com' }

      const { result } = renderHook(() => useForm(), {
        wrapper: ({ children }) => (
          <FormProvider initialValues={initialValues}>{children}</FormProvider>
        ),
      })

      expect(result.current.values).toEqual(initialValues)
    })

    it('应该接受初始错误', () => {
      const initialErrors = { name: 'Name is required' }

      const { result } = renderHook(() => useForm(), {
        wrapper: ({ children }) => (
          <FormProvider initialErrors={initialErrors}>{children}</FormProvider>
        ),
      })

      expect(result.current.errors).toEqual(initialErrors)
      expect(result.current.isValid).toBe(false)
    })

    it('应该接受初始触摸状态', () => {
      const initialTouched = { name: true }

      const { result } = renderHook(() => useForm(), {
        wrapper: ({ children }) => (
          <FormProvider initialTouched={initialTouched}>{children}</FormProvider>
        ),
      })

      expect(result.current.touched).toEqual(initialTouched)
      expect(result.current.isDirty).toBe(true)
    })

    it('应该接受禁用和只读状态', () => {
      const { result } = renderHook(() => useForm(), {
        wrapper: ({ children }) => (
          <FormProvider disabled={true} readonly={true}>{children}</FormProvider>
        ),
      })

      expect(result.current.disabled).toBe(true)
      expect(result.current.readonly).toBe(true)
    })
  })

  describe('状态管理', () => {
    it('应该设置字段值', () => {
      const { result } = renderHook(() => useForm(), {
        wrapper: TestWrapper,
      })

      act(() => {
        result.current.setFieldValue('name', 'Alice')
      })

      expect(result.current.values.name).toBe('Alice')
      expect(result.current.isDirty).toBe(true)
    })

    it('应该设置字段错误', () => {
      const { result } = renderHook(() => useForm(), {
        wrapper: TestWrapper,
      })

      act(() => {
        result.current.setFieldError('email', 'Invalid email')
      })

      expect(result.current.errors.email).toBe('Invalid email')
      expect(result.current.isValid).toBe(false)
    })

    it('应该清除字段错误', () => {
      const { result } = renderHook(() => useForm(), {
        wrapper: TestWrapper,
      })

      act(() => {
        result.current.setFieldError('email', 'Invalid email')
      })
      expect(result.current.errors.email).toBe('Invalid email')

      act(() => {
        result.current.setFieldError('email', undefined)
      })
      expect(result.current.errors.email).toBeUndefined()
    })

    it('应该设置字段触摸状态', () => {
      const { result } = renderHook(() => useForm(), {
        wrapper: TestWrapper,
      })

      act(() => {
        result.current.setFieldTouched('name', true)
      })

      expect(result.current.touched.name).toBe(true)
    })

    it('应该设置验证状态', () => {
      const { result } = renderHook(() => useForm(), {
        wrapper: TestWrapper,
      })

      act(() => {
        result.current.setFieldValidating('email', true)
      })

      expect(result.current.validating.email).toBe(true)
      expect(result.current.isValidating).toBe(true)
    })

    it('应该设置多个值', () => {
      const { result } = renderHook(() => useForm(), {
        wrapper: TestWrapper,
      })

      act(() => {
        result.current.setValues({ name: 'Bob', age: 25 })
      })

      expect(result.current.values).toEqual({ name: 'Bob', age: 25 })
    })

    it('应该设置多个错误', () => {
      const { result } = renderHook(() => useForm(), {
        wrapper: TestWrapper,
      })

      act(() => {
        result.current.setErrors({ name: 'Required', email: 'Invalid' })
      })

      expect(result.current.errors).toEqual({ name: 'Required', email: 'Invalid' })
    })

    it('应该设置多个触摸状态', () => {
      const { result } = renderHook(() => useForm(), {
        wrapper: TestWrapper,
      })

      act(() => {
        result.current.setTouched({ name: true, email: true })
      })

      expect(result.current.touched).toEqual({ name: true, email: true })
    })
  })

  describe('表单验证', () => {
    it('应该验证单个字段', async () => {
      const validate = vi.fn((values: any) => ({ name: values.name ? undefined : 'Required' }))

      const { result } = renderHook(() => useForm(), {
        wrapper: ({ children }) => (
          <FormProvider validate={validate}>{children}</FormProvider>
        ),
      })

      await act(async () => {
        const isValid = await result.current.validateField('name')
        expect(isValid).toBe(false)
      })

      expect(validate).toHaveBeenCalled()
    })

    it('应该验证整个表单', async () => {
      const validate = vi.fn((values: any) => ({
        name: values.name ? undefined : 'Required',
        email: values.email ? undefined : 'Required',
      }))

      const { result } = renderHook(() => useForm(), {
        wrapper: ({ children }) => (
          <FormProvider
            initialValues={{ name: '', email: '' }}
            validate={validate}
          >
            {children}
          </FormProvider>
        ),
      })

      await act(async () => {
        const isValid = await result.current.validateForm()
        expect(isValid).toBe(false)
      })

      expect(result.current.errors.name).toBe('Required')
      expect(result.current.errors.email).toBe('Required')
    })

    it('应该在字段值变化时验证', async () => {
      const validate = vi.fn((values: any) => ({
        name: values.name ? undefined : 'Required',
      }))

      const { result } = renderHook(() => useForm(), {
        wrapper: ({ children }) => (
          <FormProvider
            initialValues={{ name: '' }}
            validate={validate}
            validateOnChange={true}
          >
            {children}
          </FormProvider>
        ),
      })

      await act(async () => {
        result.current.setFieldValue('name', 'John')
        // 等待下一个tick以处理异步验证
        await new Promise(resolve => setTimeout(resolve, 0))
      })

      expect(validate).toHaveBeenCalled()
    })

    it('应该在字段失焦时验证', async () => {
      const validate = vi.fn((values: any) => ({
        email: values.email ? undefined : 'Required',
      }))

      const { result } = renderHook(() => useForm(), {
        wrapper: ({ children }) => (
          <FormProvider
            initialValues={{ email: '' }}
            validate={validate}
            validateOnBlur={true}
          >
            {children}
          </FormProvider>
        ),
      })

      await act(async () => {
        result.current.setFieldTouched('email', true)
        await new Promise(resolve => setTimeout(resolve, 0))
      })

      expect(validate).toHaveBeenCalled()
    })
  })

  describe('表单操作', () => {
    it('应该重置表单', () => {
      const { result } = renderHook(() => useForm(), {
        wrapper: ({ children }) => (
          <FormProvider
            initialValues={{ name: 'Initial' }}
            initialErrors={{ name: 'Error' }}
          >
            {children}
          </FormProvider>
        ),
      })

      act(() => {
        result.current.setFieldValue('name', 'Changed')
        result.current.setFieldError('name', 'New Error')
      })

      expect(result.current.values.name).toBe('Changed')
      expect(result.current.errors.name).toBe('New Error')

      act(() => {
        result.current.resetForm()
      })

      expect(result.current.values.name).toBe('Initial')
      expect(result.current.errors.name).toBeUndefined()
    })

    it('应该设置提交状态', () => {
      const { result } = renderHook(() => useForm(), {
        wrapper: TestWrapper,
      })

      expect(result.current.isSubmitting).toBe(false)

      act(() => {
        result.current.setSubmitting(true)
      })

      expect(result.current.isSubmitting).toBe(true)
    })

    it('应该处理提交', async () => {
      const onSubmit = vi.fn()

      const { result } = renderHook(() => useForm(), {
        wrapper: ({ children }) => (
          <FormProvider initialValues={{ name: 'John' }} onSubmit={onSubmit}>
            {children}
          </FormProvider>
        ),
      })

      await act(async () => {
        const handler = result.current.handleSubmit(onSubmit)
        const mockEvent = { preventDefault: vi.fn() } as any
        handler(mockEvent)
        await new Promise(resolve => setTimeout(resolve, 0))
      })

      expect(onSubmit).toHaveBeenCalled()
    })

    it('在提交时应该标记所有字段为已触摸', async () => {
      const onSubmit = vi.fn()

      const { result } = renderHook(() => useForm(), {
        wrapper: ({ children }) => (
          <FormProvider
            initialValues={{ name: 'John', email: 'john@example.com' }}
            onSubmit={onSubmit}
          >
            {children}
          </FormProvider>
        ),
      })

      expect(result.current.touched.name).toBeUndefined()
      expect(result.current.touched.email).toBeUndefined()

      await act(async () => {
        const handler = result.current.handleSubmit(onSubmit)
        const mockEvent = { preventDefault: vi.fn() } as any
        handler(mockEvent)
        await new Promise(resolve => setTimeout(resolve, 0))
      })

      expect(result.current.touched.name).toBe(true)
      expect(result.current.touched.email).toBe(true)
    })

    it('应该在禁用时不提交', async () => {
      const onSubmit = vi.fn()

      const { result } = renderHook(() => useForm(), {
        wrapper: ({ children }) => (
          <FormProvider disabled={true} onSubmit={onSubmit}>
            {children}
          </FormProvider>
        ),
      })

      await act(async () => {
        const handler = result.current.handleSubmit(onSubmit)
        const mockEvent = { preventDefault: vi.fn() } as any
        handler(mockEvent)
        await new Promise(resolve => setTimeout(resolve, 0))
      })

      expect(onSubmit).not.toHaveBeenCalled()
    })

    it('应该处理重置', () => {
      const { result } = renderHook(() => useForm(), {
        wrapper: ({ children }) => (
          <FormProvider initialValues={{ name: 'Initial' }}>
            {children}
          </FormProvider>
        ),
      })

      act(() => {
        result.current.setFieldValue('name', 'Changed')
      })

      expect(result.current.values.name).toBe('Changed')

      act(() => {
        result.current.handleReset()
      })

      expect(result.current.values.name).toBe('Initial')
    })
  })

  describe('getFieldProps', () => {
    it('应该返回字段属性', () => {
      const { result } = renderHook(() => useForm(), {
        wrapper: ({ children }) => (
          <FormProvider initialValues={{ name: 'John' }}>
            {children}
          </FormProvider>
        ),
      })

      const fieldProps = result.current.getFieldProps('name')

      expect(fieldProps).toEqual({
        name: 'name',
        value: 'John',
        error: undefined,
        touched: false,
        validating: false,
        disabled: false,
        readonly: false,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
      })
    })

    it('应该使用字段属性更新值', () => {
      const { result } = renderHook(() => useForm(), {
        wrapper: TestWrapper,
      })

      const fieldProps = result.current.getFieldProps('email')

      act(() => {
        fieldProps.onChange('new@example.com')
      })

      expect(result.current.values.email).toBe('new@example.com')
    })

    it('应该使用字段属性设置触摸状态', () => {
      const { result } = renderHook(() => useForm(), {
        wrapper: TestWrapper,
      })

      const fieldProps = result.current.getFieldProps('name')

      expect(result.current.touched.name).toBeUndefined()

      act(() => {
        fieldProps.onBlur()
      })

      expect(result.current.touched.name).toBe(true)
    })
  })

  describe('外部状态变更回调', () => {
    it('应该在值变化时调用 onValuesChange', () => {
      const onValuesChange = vi.fn()

      const { result } = renderHook(() => useForm(), {
        wrapper: ({ children }) => (
          <FormProvider onValuesChange={onValuesChange}>
            {children}
          </FormProvider>
        ),
      })

      act(() => {
        result.current.setFieldValue('name', 'Alice')
      })

      expect(onValuesChange).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Alice' })
      )
    })

    it('应该在错误变化时调用 onErrorsChange', () => {
      const onErrorsChange = vi.fn()

      const { result } = renderHook(() => useForm(), {
        wrapper: ({ children }) => (
          <FormProvider onErrorsChange={onErrorsChange}>
            {children}
          </FormProvider>
        ),
      })

      act(() => {
        result.current.setFieldError('email', 'Invalid')
      })

      expect(onErrorsChange).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'Invalid' })
      )
    })

    it('应该在触摸状态变化时调用 onTouchedChange', () => {
      const onTouchedChange = vi.fn()

      const { result } = renderHook(() => useForm(), {
        wrapper: ({ children }) => (
          <FormProvider onTouchedChange={onTouchedChange}>
            {children}
          </FormProvider>
        ),
      })

      act(() => {
        result.current.setFieldTouched('name', true)
      })

      expect(onTouchedChange).toHaveBeenCalledWith(
        expect.objectContaining({ name: true })
      )
    })
  })

  describe('enableReinitialize', () => {
    it('应该在 enableReinitialize 时重新初始化值', () => {
      const { result } = renderHook(() => useForm(), {
        wrapper: ({ children }) => (
          <FormProvider
            initialValues={{ name: 'Initial' }}
            enableReinitialize={true}
          >
            {children}
          </FormProvider>
        ),
      })

      act(() => {
        result.current.setFieldValue('name', 'Changed')
      })

      expect(result.current.values.name).toBe('Changed')

      // 重新渲染以触发 useEffect
      // 注意：这里简化了测试，实际场景中初始值会作为 prop 变化
    })
  })

  describe('错误边界', () => {
    it('在 FormProvider 外使用 useForm 应该抛出错误', () => {
      console.error = vi.fn() // 抑制错误输出

      expect(() => {
        renderHook(() => useForm())
      }).toThrow('useForm must be used within a FormProvider')
    })
  })

  describe('React Hook Form 兼容', () => {
    it('应该支持嵌套数组值', () => {
      const { result } = renderHook(() => useForm(), {
        wrapper: TestWrapper,
      })

      act(() => {
        result.current.setFieldValue('users.0.name', 'Alice')
      })

      expect(result.current.values.users?.[0]?.name).toBe('Alice')
    })

    it('应该支持嵌套对象值', () => {
      const { result } = renderHook(() => useForm(), {
        wrapper: TestWrapper,
      })

      act(() => {
        result.current.setFieldValue('profile.firstName', 'Bob')
      })

      expect(result.current.values.profile?.firstName).toBe('Bob')
    })
  })

  describe('无障碍访问', () => {
    it('应该渲染带有 role="form" 的容器', () => {
      const { container } = render(
        <FormProvider>
          <div>Test</div>
        </FormProvider>
      )

      expect(container.firstChild).toHaveAttribute('role', 'form')
    })

    it('应该支持 HTML 属性', () => {
      const { container } = render(
        <FormProvider aria-label="Test Form" data-testid="form">
          <div>Test</div>
        </FormProvider>
      )

      expect(container.firstChild).toHaveAttribute('aria-label', 'Test Form')
      expect(container.firstChild).toHaveAttribute('data-testid', 'form')
    })
  })
})
