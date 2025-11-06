/**
 * @fileoverview 动画HOC测试文件
 * @description 测试所有动画相关HOC功能
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import {
  withAnimate,
  withTransition,
  withGestures,
  withPageTransition,
} from '../../src/hoc/animations'

// 模拟基础组件
const BaseComponent = ({ children, ...props }: any) => (
  <div data-testid="base-component" {...props}>
    {children}
  </div>
)

describe('Animation HOCs', () => {
  describe('withAnimate', () => {
    it('should provide animation support', () => {
      const AnimatedComponent = withAnimate({
        variants: {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.3 } }
        }
      })(BaseComponent)

      render(<AnimatedComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })

    it('should handle enter animation', () => {
      const AnimatedComponent = withAnimate()(BaseComponent)

      render(<AnimatedComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })

    it('should handle exit animation', () => {
      const AnimatedComponent = withAnimate()(BaseComponent)

      render(<AnimatedComponent />)

      const component = screen.getByTestId('base-component')
      component.exit()

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })

    it('should toggle animation', () => {
      const AnimatedComponent = withAnimate()(BaseComponent)

      render(<AnimatedComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })

    it('should reset animation', () => {
      const AnimatedComponent = withAnimate()(BaseComponent)

      render(<AnimatedComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })
  })

  describe('withTransition', () => {
    it('should provide transition support', () => {
      const TransitionComponent = withTransition({
        initial: { opacity: 0, scale: 0.9 },
        enter: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
        animateOnMount: true
      })(BaseComponent)

      render(<TransitionComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })

    it('should handle enter transition', () => {
      const TransitionComponent = withTransition({
        animateOnMount: false
      })(BaseComponent)

      render(<TransitionComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })

    it('should handle exit transition', () => {
      const TransitionComponent = withTransition({
        animateOnMount: true
      })(BaseComponent)

      render(<TransitionComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })

    it('should toggle transitions', () => {
      const TransitionComponent = withTransition()(BaseComponent)

      render(<TransitionComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })
  })

  describe('withGestures', () => {
    beforeEach(() => {
      // Mock window.matchMedia
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      })
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should provide gesture support', () => {
      const GestureComponent = withGestures({
        drag: true
      })(BaseComponent)

      render(<GestureComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })

    it('should handle drag gestures', () => {
      const GestureComponent = withGestures({
        drag: true,
        onDrag: vi.fn()
      })(BaseComponent)

      render(<GestureComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })

    it('should handle swipe gestures', () => {
      const GestureComponent = withGestures({
        swipe: true,
        swipeThreshold: 50,
        onSwipeLeft: vi.fn(),
        onSwipeRight: vi.fn()
      })(BaseComponent)

      render(<GestureComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })

    it('should handle pinch gestures', () => {
      const GestureComponent = withGestures({
        pinch: true,
        pinchThreshold: 50,
        onPinchStart: vi.fn(),
        onPinchEnd: vi.fn()
      })(BaseComponent)

      render(<GestureComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })

    it('should handle rotate gestures', () => {
      const GestureComponent = withGestures({
        rotate: true,
        rotateThreshold: 30,
        onRotateStart: vi.fn(),
        onRotateEnd: vi.fn()
      })(BaseComponent)

      render(<GestureComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })

    it('should reset position', () => {
      const GestureComponent = withGestures({
        drag: true
      })(BaseComponent)

      render(<GestureComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })
  })

  describe('withPageTransition', () => {
    it('should provide page transition support', () => {
      const PageTransitionComponent = withPageTransition({
        initial: { opacity: 0, x: '100%' },
        enter: { opacity: 1, x: '0%', transition: { duration: 0.5 } },
        exit: { opacity: 0, x: '-100%', transition: { duration: 0.3 } },
        skipInitial: true
      })(BaseComponent)

      render(<PageTransitionComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })

    it('should handle enter transition', () => {
      const PageTransitionComponent = withPageTransition({
        skipInitial: false
      })(BaseComponent)

      render(<PageTransitionComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })

    it('should handle exit transition', () => {
      const PageTransitionComponent = withPageTransition({
        animateOnMount: true
      })(BaseComponent)

      render(<PageTransitionComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })

    it('should toggle page transitions', () => {
      const PageTransitionComponent = withPageTransition()(BaseComponent)

      render(<PageTransitionComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })

    it('should force enter animation', () => {
      const PageTransitionComponent = withPageTransition()(BaseComponent)

      render(<PageTransitionComponent />)

      expect(screen.getByTestId('base-component')).toBeInTheDocument()
    })
  })
})
