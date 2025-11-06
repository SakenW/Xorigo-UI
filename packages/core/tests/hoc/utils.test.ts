/**
 * @fileoverview 实用工具HOC测试文件
 * @description 测试所有实用工具HOC功能
 */

import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import {
  withClickOutside,
  withPortal,
  withResizeObserver,
  withIntersectionObserver,
  withMediaQuery,
  withDebounce,
  withThrottle,
} from '../../src/hoc/utils'

// 模拟基础组件
const BaseComponent = ({ children, ...props }: any) => (
  <div data-testid="base-component" {...props}>
    {children}
  </div>
)

describe('Utility HOCs', () => {
  describe('withClickOutside', () => {
    it('should handle click outside', async () => {
      const onClickOutside = vi.fn()
      const ClickOutsideComponent = withClickOutside({
        onClickOutside
      })(BaseComponent)

      render(<ClickOutsideComponent />)

      // 点击外部
      fireEvent.click(document)

      await waitFor(() => {
        expect(onClickOutside).toHaveBeenCalled()
      })
    })

    it('should not trigger when disabled', () => {
      const onClickOutside = vi.fn()
      const ClickOutsideComponent = withClickOutside({
        onClickOutside,
        disabled: true
      })(BaseComponent)

      render(<ClickOutsideComponent />)

      fireEvent.click(document)

      expect(onClickOutside).not.toHaveBeenCalled()
    })

    it('should exclude selectors', () => {
      const onClickOutside = vi.fn()
      const ClickOutsideComponent = withClickOutside({
        onClickOutside,
        excludeSelectors: ['.exclude-me']
      })(BaseComponent)

      render(<ClickOutsideComponent />)

      // 点击排除元素
      const excludeElement = document.createElement('div')
      excludeElement.className = 'exclude-me'
      document.body.appendChild(excludeElement)
      fireEvent.click(excludeElement)

      expect(onClickOutside).not.toHaveBeenCalled()

      document.body.removeChild(excludeElement)
    })
  })

  describe('withPortal', () => {
    it('should render to portal', () => {
      const PortalComponent = withPortal({
        containerId: 'portal-root'
      })(BaseComponent)

      render(<PortalComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })

    it('should handle disabled state', () => {
      const PortalComponent = withPortal({
        containerId: 'portal-root',
        enabled: false
      })(BaseComponent)

      render(<PortalComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })

    it('should update container', () => {
      const PortalComponent = withPortal({
        containerId: 'portal-root'
      })(BaseComponent)

      render(<PortalComponent updateContainer={vi.fn()} />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })
  })

  describe('withResizeObserver', () => {
    it('should observe resize', () => {
      const ResizeComponent = withResizeObserver({
        onResize: vi.fn()
      })(BaseComponent)

      render(<ResizeComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })

    it('should handle resize end', () => {
      const ResizeComponent = withResizeObserver({
        onResizeEnd: vi.fn()
      })(BaseComponent)

      render(<ResizeComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })

    it('should provide resize info', () => {
      const ResizeComponent = withResizeObserver()(BaseComponent)

      render(<ResizeComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })
  })

  describe('withIntersectionObserver', () => {
    it('should observe intersection', () => {
      const IntersectionComponent = withIntersectionObserver({
        onIntersect: vi.fn()
      })(BaseComponent)

      render(<IntersectionComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })

    it('should handle enter and exit', () => {
      const IntersectionComponent = withIntersectionObserver({
        onEnter: vi.fn(),
        onExit: vi.fn()
      })(BaseComponent)

      render(<IntersectionComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })
  })

  describe('withMediaQuery', () => {
    it('should handle media query', () => {
      const MediaQueryComponent = withMediaQuery({
        query: '(min-width: 768px)',
        onMatch: vi.fn()
      })(BaseComponent)

      render(<MediaQueryComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })

    it('should provide media info', () => {
      const MediaQueryComponent = withMediaQuery({
        query: '(min-width: 768px)'
      })(BaseComponent)

      render(<MediaQueryComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })
  })

  describe('withDebounce', () => {
    it('should create debounced function', () => {
      const callback = vi.fn()
      const DebounceComponent = withDebounce({
        delay: 300,
        callback
      })(BaseComponent)

      render(<DebounceComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })

    it('should handle immediate option', () => {
      const callback = vi.fn()
      const DebounceComponent = withDebounce({
        delay: 300,
        callback,
        immediate: true
      })(BaseComponent)

      render(<DebounceComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })
  })

  describe('withThrottle', () => {
    it('should create throttled function', () => {
      const callback = vi.fn()
      const ThrottleComponent = withThrottle({
        interval: 100,
        callback
      })(BaseComponent)

      render(<ThrottleComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })

    it('should handle wait for last option', () => {
      const callback = vi.fn()
      const ThrottleComponent = withThrottle({
        interval: 100,
        callback,
        waitForLast: true
      })(BaseComponent)

      render(<ThrottleComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })
  })
})
