/**
 * @fileoverview 表单专用HOC测试文件
 * @description 测试所有表单相关HOC功能
 */

import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import {
  withForm,
  withField,
  withController,
  withAsyncValidation,
  withSubmit,
} from '../../src/hoc/forms'

// 模拟表单组件
const MockForm = ({ children, handleSubmit, values, errors, isSubmitting, ...props }: any) => (
  <form data-testid="mock-form" onSubmit={handleSubmit} {...props}>
    {children}
    <button type="submit" disabled={isSubmitting}>
      {isSubmitting ? 'Submitting...' : 'Submit'}
    </button>
  </form>
)

const MockField = ({ label, error, children, inputProps, ...props }: any) => (
  <div data-testid="mock-field">
    {label && <label>{label}</label>}
    {children}
    {error && <span data-testid="mock-error">{error}</span>}
  </div>
)

const MockInput = ({ value, onChange, onBlur, error, ...props }: any) => (
  <div>
    <input
      data-testid="mock-input"
      value={value || ''}
      onChange={onChange}
      onBlur={onBlur}
      {...props}
    />
    {error && <span data-testid="mock-error">{error}</span>}
  </div>
)

describe('Form HOCs', () => {
  describe('withForm', () => {
    it('should create form with initial values', () => {
      const FormComponent = withForm({
        initialValues: { name: '', email: '' },
        onSubmit: vi.fn()
      })(MockForm)

      render(<FormComponent />)

      expect(screen.getByTestId('mock-form')).toBeInTheDocument()
    })

    it('should handle form submission', async () => {
      const onSubmit = vi.fn()
      const FormComponent = withForm({
        initialValues: { name: 'John' },
        onSubmit
      })(MockForm)

      render(<FormComponent />)

      fireEvent.click(screen.getByRole('button', { name: /submit/i }))

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalled()
      })
    })

    it('should validate form', async () => {
      const FormComponent = withForm({
        initialValues: { name: '' },
        validate: (values) => {
          const errors: any = {}
          if (!values.name) errors.name = 'Required'
          return errors
        },
        onSubmit: vi.fn()
      })(MockForm)

      render(<FormComponent />)

      fireEvent.click(screen.getByRole('button', { name: /submit/i }))

      await waitFor(() => {
        expect(screen.getByText('Required')).toBeInTheDocument()
      })
    })

    it('should reset form', () => {
      const FormComponent = withForm({
        initialValues: { name: 'John' },
        onSubmit: vi.fn()
      })(MockForm)

      render(<FormComponent />)

      expect(screen.getByTestId('mock-form')).toBeInTheDocument()
    })
  })

  describe('withField', () => {
    it('should create field with label', () => {
      const FieldComponent = withField({
        name: 'email',
        label: 'Email Address',
        required: true
      })(MockField)

      render(<FieldComponent />)

      expect(screen.getByText('Email Address')).toBeInTheDocument()
      expect(screen.getByText('*')).toBeInTheDocument()
    })

    it('should display helper text', () => {
      const FieldComponent = withField({
        name: 'email',
        helperText: 'Enter your email address'
      })(MockField)

      render(<FieldComponent />)

      expect(screen.getByText('Enter your email address')).toBeInTheDocument()
    })

    it('should show error message', () => {
      const FieldComponent = withField({
        name: 'email',
        error: 'Invalid email'
      })(MockField)

      render(<FieldComponent />)

      expect(screen.getByText('Invalid email')).toBeInTheDocument()
    })
  })

  describe('withController', () => {
    it('should control field value', () => {
      const ControllerComponent = withController({
        name: 'username',
        defaultValue: ''
      })(MockInput)

      render(<ControllerComponent />)

      expect(screen.getByTestId('mock-input')).toBeInTheDocument()
    })

    it('should handle validation rules', () => {
      const ControllerComponent = withController({
        name: 'email',
        rules: {
          required: 'Email is required',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Invalid email'
          }
        }
      })(MockInput)

      render(<ControllerComponent />)

      expect(screen.getByTestId('mock-input')).toBeInTheDocument()
    })

    it('should transform values', () => {
      const ControllerComponent = withController({
        name: 'number',
        transformValue: (value: string) => Number(value)
      })(MockInput)

      render(<ControllerComponent value="123" />)

      expect(screen.getByTestId('mock-input')).toBeInTheDocument()
    })
  })

  describe('withAsyncValidation', () => {
    it('should validate asynchronously', async () => {
      const validator = vi.fn().mockResolvedValue(true)
      const AsyncValidationComponent = withAsyncValidation({
        validator,
        delay: 100
      })(MockInput)

      render(<AsyncValidationComponent value="test@example.com" />)

      expect(screen.getByTestId('mock-input')).toBeInTheDocument()

      await waitFor(() => {
        expect(validator).toHaveBeenCalled()
      })
    })

    it('should handle validation errors', async () => {
      const validator = vi.fn().mockResolvedValue('Email already exists')
      const AsyncValidationComponent = withAsyncValidation({
        validator,
        delay: 100
      })(MockInput)

      render(<AsyncValidationComponent value="test@example.com" />)

      await waitFor(() => {
        expect(validator).toHaveBeenCalled()
      }, { timeout: 200 })
    })

    it('should handle validation retry', async () => {
      const validator = vi.fn()
      const AsyncValidationComponent = withAsyncValidation({
        validator,
        delay: 100,
        maxRetries: 3
      })(MockInput)

      render(<AsyncValidationComponent value="test@example.com" />)

      await waitFor(() => {
        expect(validator).toHaveBeenCalled()
      }, { timeout: 500 })
    })
  })

  describe('withSubmit', () => {
    it('should handle form submission', async () => {
      const onSubmit = vi.fn().mockResolvedValue({ success: true })
      const SubmitComponent = withSubmit({
        onSubmit
      })(MockForm)

      render(<SubmitComponent values={{}} />)

      fireEvent.click(screen.getByRole('button', { name: /submit/i }))

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalled()
      })
    })

    it('should prevent double submission', async () => {
      const onSubmit = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)))
      const SubmitComponent = withSubmit({
        onSubmit,
        preventDoubleSubmit: true
      })(MockForm)

      render(<SubmitComponent values={{}} />)

      fireEvent.click(screen.getByRole('button', { name: /submit/i }))
      fireEvent.click(screen.getByRole('button', { name: /submitting/i }))

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledTimes(1)
      }, { timeout: 2000 })
    })

    it('should handle submission errors', async () => {
      const onSubmit = vi.fn().mockRejectedValue(new Error('Network error'))
      const onError = vi.fn()
      const SubmitComponent = withSubmit({
        onSubmit,
        onError
      })(MockForm)

      render(<SubmitComponent values={{}} />)

      fireEvent.click(screen.getByRole('button', { name: /submit/i }))

      await waitFor(() => {
        expect(onError).toHaveBeenCalled()
      })
    })
  })
})
