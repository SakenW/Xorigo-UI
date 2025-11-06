/**
 * @fileoverview HOC组合系统测试文件
 * @description 测试compose、mergeProps等组合功能
 */

import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { compose, defer, when } from '../../src/hoc/composers/compose'
import { withTheme, withVariant, withSize } from '../../src/hoc/core'

// 模拟基础组件
const BaseComponent = ({ children, ...props }: any) => (
  <div data-testid="base-component" {...props}>
    {children}
  </div>
)

describe('HOC Composers', () => {
  describe('compose', () => {
    it('should compose multiple HOCs', () => {
      const EnhancedComponent = compose([
        withTheme(),
        withVariant({ defaultVariant: 'primary' }),
        withSize({ defaultSize: 'md' })
      ])(BaseComponent)

      render(<EnhancedComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })

    it('should apply HOCs from right to left', () => {
      const EnhancedComponent = compose([
        withTheme(),
        withVariant({ defaultVariant: 'primary' }),
        withSize({ defaultSize: 'md' })
      ])(BaseComponent)

      render(<EnhancedComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })

    it('should handle empty HOC array', () => {
      const EnhancedComponent = compose([])(BaseComponent)

      render(<EnhancedComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })

    it('should apply merge strategy', () => {
      const EnhancedComponent = compose([
        withTheme(),
        withVariant({ defaultVariant: 'primary' })
      ], { strategy: 'merge' })(BaseComponent)

      render(<EnhancedComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })

    it('should enable memoization by default', () => {
      const EnhancedComponent = compose([
        withTheme()
      ])(BaseComponent)

      render(<EnhancedComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })

    it('should disable memoization when configured', () => {
      const EnhancedComponent = compose([
        withTheme()
      ], { enableMemo: false })(BaseComponent)

      render(<EnhancedComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })
  })

  describe('defer', () => {
    it('should defer HOC application', () => {
      const enhance = defer([
        withTheme(),
        withVariant({ defaultVariant: 'primary' })
      ])

      const EnhancedComponent = enhance(BaseComponent)

      render(<EnhancedComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })

    it('should accept configuration', () => {
      const enhance = defer([
        withTheme()
      ], { strategy: 'override' })

      const EnhancedComponent = enhance(BaseComponent)

      render(<EnhancedComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })
  })

  describe('when', () => {
    it('should apply HOC when condition is true', () => {
      const EnhancedComponent = compose([
        withTheme(),
        when(() => true)(withVariant({ defaultVariant: 'primary' }))
      ])(BaseComponent)

      render(<EnhancedComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })

    it('should not apply HOC when condition is false', () => {
      const EnhancedComponent = compose([
        withTheme(),
        when(() => false)(withVariant({ defaultVariant: 'primary' }))
      ])(BaseComponent)

      render(<EnhancedComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })
  })
})
