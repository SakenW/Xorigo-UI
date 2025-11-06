/**
 * @fileoverview HOC系统主测试文件
 * @description 测试HOC系统的整体功能和集成
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { createFormComponent, createButtonComponent } from '../../src/hoc'

// 模拟基础组件
const MockComponent = ({ children, ...props }: any) => (
  <div data-testid="mock-component" {...props}>
    {children}
  </div>
)

const MockButton = ({ children, isLoading, ...props }: any) => (
  <button data-testid="mock-button" {...props} disabled={isLoading}>
    {isLoading ? 'Loading...' : children}
  </button>
)

const MockInput = ({ value, onChange, onBlur, error, ...props }: any) => (
  <div>
    <input
      data-testid="mock-input"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      aria-invalid={!!error}
      {...props}
    />
    {error && <span data-testid="mock-error">{error}</span>}
  </div>
)

const MockForm = ({ children, handleSubmit, isSubmitting, ...props }: any) => (
  <form data-testid="mock-form" onSubmit={handleSubmit} {...props}>
    {children}
    <button type="submit" disabled={isSubmitting} data-testid="submit-button">
      {isSubmitting ? 'Submitting...' : 'Submit'}
    </button>
  </form>
)

describe('HOC System Integration', () => {
  describe('createFormComponent', () => {
    it('should create a form component with all HOCs applied', async () => {
      const FormComponent = createFormComponent(MockForm)

      render(<FormComponent />)

      expect(screen.getByTestId('mock-form')).toBeInTheDocument()
    })

    it('should handle form submission', async () => {
      const onSubmit = vi.fn()
      const FormComponent = createFormComponent(MockForm)

      render(<FormComponent onSubmit={onSubmit} />)

      fireEvent.click(screen.getByTestId('submit-button'))

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalled()
      })
    })

    it('should handle validation', async () => {
      const FormComponent = createFormComponent(MockForm)

      render(
        <FormComponent
          initialValues={{ name: '' }}
          validate={(values: any) => {
            const errors: any = {}
            if (!values.name) errors.name = 'Required'
            return errors
          }}
        />
      )

      fireEvent.click(screen.getByTestId('submit-button'))

      await waitFor(() => {
        expect(screen.queryByText('Required')).toBeInTheDocument()
      })
    })
  })

  describe('createButtonComponent', () => {
    it('should create a button component with all HOCs applied', () => {
      const ButtonComponent = createButtonComponent(MockButton)

      render(<ButtonComponent>Click me</ButtonComponent>)

      expect(screen.getByText('Click me')).toBeInTheDocument()
    })

    it('should handle loading state', () => {
      const ButtonComponent = createButtonComponent(MockButton)

      render(
        <ButtonComponent isLoading>
          Click me
        </ButtonComponent>
      )

      expect(screen.getByText('Loading...')).toBeInTheDocument()
      expect(screen.getByTestId('mock-button')).toBeDisabled()
    })
  })
})
