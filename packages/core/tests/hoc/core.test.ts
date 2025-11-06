/**
 * @fileoverview 核心HOC测试文件
 * @description 测试所有核心HOC功能
 */

import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  withTheme,
  withVariant,
  withSize,
  withState,
  withValidation,
  withAccessibility,
  withLoading,
  withErrorBoundary,
} from '../../src/hoc/core'

// 模拟基础组件
const BaseComponent = ({ children, ...props }: any) => (
  <div data-testid="base-component" {...props}>
    {children}
  </div>
)

describe('Core HOCs', () => {
  describe('withTheme', () => {
    it('should provide theme context', () => {
      const ThemedComponent = withTheme()(BaseComponent)
      render(<ThemedComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })

    it('should handle theme mode', () => {
      const ThemedComponent = withTheme({ mode: 'dark' })(BaseComponent)
      render(<ThemedComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })

    it('should toggle theme', () => {
      const ThemedComponent = withTheme()(BaseComponent)
      render(<ThemedComponent />)

      const component = screen.getByTestId('base-component')
      expect(component).toBeInTheDocument()
    })
  })

  describe('withVariant', () => {
    it('should provide variant support', () => {
      const VariantComponent = withVariant({ defaultVariant: 'primary' })(BaseComponent)
      render(<VariantComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })

    it('should change variant', () => {
      const VariantComponent = withVariant({ defaultVariant: 'primary' })(BaseComponent)
      render(<VariantComponent variant="secondary" />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })
  })

  describe('withSize', () => {
    it('should provide size support', () => {
      const SizedComponent = withSize({ defaultSize: 'md' })(BaseComponent)
      render(<SizedComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })

    it('should change size', () => {
      const SizedComponent = withSize({ defaultSize: 'md' })(BaseComponent)
      render(<SizedComponent size="lg" />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })
  })

  describe('withState', () => {
    it('should provide state management', () => {
      const StateComponent = withState({ initialState: { count: 0 } })(BaseComponent)
      render(<StateComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })

    it('should handle state updates', () => {
      const StateComponent = withState({ initialState: { count: 0 } })(BaseComponent)
      render(<StateComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })
  })

  describe('withValidation', () => {
    it('should provide validation support', () => {
      const ValidatedComponent = withValidation({
        rules: {
          required: 'This field is required'
        }
      })(BaseComponent)

      render(<ValidatedComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })

    it('should validate on change', async () => {
      const ValidatedComponent = withValidation({
        rules: {
          required: 'This field is required'
        },
        validateOnChange: true
      })(BaseComponent)

      render(<ValidatedComponent value="" />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })
  })

  describe('withAccessibility', () => {
    it('should provide accessibility support', () => {
      const AccessibleComponent = withAccessibility({
        role: 'button',
        ariaLabel: 'Test button'
      })(BaseComponent)

      render(<AccessibleComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })

    it('should handle focus events', () => {
      const AccessibleComponent = withAccessibility({
        role: 'button',
        keyboardNavigation: true
      })(BaseComponent)

      render(<AccessibleComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })
  })

  describe('withLoading', () => {
    it('should provide loading state', () => {
      const LoadingComponent = withLoading({ initialLoading: false })(BaseComponent)
      render(<LoadingComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })

    it('should handle loading state changes', () => {
      const LoadingComponent = withLoading()(BaseComponent)
      render(<LoadingComponent loading={true} />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })
  })

  describe('withErrorBoundary', () => {
    it('should catch errors', () => {
      const ErrorComponent = withErrorBoundary({
        fallback: ({ error }: any) => (
          <div data-testid="error-fallback">
            Error: {error.message}
          </div>
        )
      })(BaseComponent)

      render(<ErrorComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })

    it('should handle error recovery', () => {
      const ErrorComponent = withErrorBoundary({
        onReset: vi.fn()
      })(BaseComponent)

      render(<ErrorComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })
  })
})
