import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { axe, toHaveNoViolations } from '../utils/jest-axe-mock'
import Transition from './transition'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

describe('Transition', () => {
  const mockOnAnimationStart = vi.fn()
  const mockOnAnimationComplete = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  describe('基础渲染', () => {
    it('应该正确渲染子元素', () => {
      render(
        <Transition data-testid="transition">
          <div>Test Content</div>
        </Transition>
      )

      expect(screen.getByTestId('transition')).toBeInTheDocument()
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('应该支持自定义组件类型', () => {
      render(
        <Transition as="section" data-testid="transition">
          <div>Test Content</div>
        </Transition>
      )

      const element = screen.getByTestId('transition')
      expect(element.tagName).toBe('SECTION')
    })

    it('应该支持自定义className', () => {
      render(
        <Transition className="custom-class" data-testid="transition">
          <div>Test Content</div>
        </Transition>
      )

      const element = screen.getByTestId('transition')
      expect(element).toHaveClass('custom-class')
    })

    it('应该传递其他HTML属性', () => {
      render(
        <Transition
          data-testid="transition"
          role="dialog"
          aria-label="Test Dialog"
        >
          <div>Test Content</div>
        </Transition>
      )

      const element = screen.getByTestId('transition')
      expect(element).toHaveAttribute('role', 'dialog')
      expect(element).toHaveAttribute('aria-label', 'Test Dialog')
    })
  })

  describe('显示/隐藏控制', () => {
    it('默认应该显示内容', () => {
      render(
        <Transition data-testid="transition">
          <div>Test Content</div>
        </Transition>
      )

      expect(screen.getByTestId('transition')).toBeInTheDocument()
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('show=false 时应该隐藏内容', () => {
      render(
        <Transition show={false} data-testid="transition">
          <div>Test Content</div>
        </Transition>
      )

      expect(screen.queryByTestId('transition')).not.toBeInTheDocument()
    })

    it('动态切换show状态', async () => {
      const { rerender } = render(
        <Transition show={true} data-testid="transition">
          <div>Test Content</div>
        </Transition>
      )

      expect(screen.getByTestId('transition')).toBeInTheDocument()

      rerender(
        <Transition show={false} data-testid="transition">
          <div>Test Content</div>
        </Transition>
      )

      await waitFor(() => {
        expect(screen.queryByTestId('transition')).not.toBeInTheDocument()
      })
    })
  })

  describe('动画配置', () => {
    it('应该支持fade过渡类型', () => {
      render(
        <Transition
          config={{ type: 'fade', duration: 0.1 }}
          data-testid="transition"
        >
          <div>Test Content</div>
        </Transition>
      )

      expect(screen.getByTestId('transition')).toBeInTheDocument()
    })

    it('应该支持slide过渡类型', () => {
      render(
        <Transition
          config={{ type: 'slide', direction: 'up', duration: 0.1 }}
          data-testid="transition"
        >
          <div>Test Content</div>
        </Transition>
      )

      expect(screen.getByTestId('transition')).toBeInTheDocument()
    })

    it('应该支持scale过渡类型', () => {
      render(
        <Transition
          config={{ type: 'scale', scale: 0.8, duration: 0.1 }}
          data-testid="transition"
        >
          <div>Test Content</div>
        </Transition>
      )

      expect(screen.getByTestId('transition')).toBeInTheDocument()
    })

    it('应该支持spring过渡类型', () => {
      render(
        <Transition
          config={{
            type: 'spring',
            stiffness: 200,
            damping: 20,
            duration: 0.1
          }}
          data-testid="transition"
        >
          <div>Test Content</div>
        </Transition>
      )

      expect(screen.getByTestId('transition')).toBeInTheDocument()
    })

    it('应该支持自定义transition配置', () => {
      const customTransition = {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }

      render(
        <Transition
          transition={customTransition}
          data-testid="transition"
        >
          <div>Test Content</div>
        </Transition>
      )

      expect(screen.getByTestId('transition')).toBeInTheDocument()
    })

    it('应该支持自定义variants', () => {
      const customVariants = {
        hidden: { opacity: 0, scale: 0.5 },
        visible: { opacity: 1, scale: 1 }
      }

      render(
        <Transition
          variants={customVariants}
          data-testid="transition"
        >
          <div>Test Content</div>
        </Transition>
      )

      expect(screen.getByTestId('transition')).toBeInTheDocument()
    })
  })

  describe('事件回调', () => {
    it('应该调用onAnimationStart回调', () => {
      render(
        <Transition
          onAnimationStart={mockOnAnimationStart}
          config={{ duration: 0.1 }}
          data-testid="transition"
        >
          <div>Test Content</div>
        </Transition>
      )

      // 动画开始时应该被调用
      expect(mockOnAnimationStart).toHaveBeenCalled()
    })

    it('应该调用onAnimationComplete回调', async () => {
      render(
        <Transition
          onAnimationComplete={mockOnAnimationComplete}
          config={{ duration: 0.1 }}
          data-testid="transition"
        >
          <div>Test Content</div>
        </Transition>
      )

      // 等待动画完成
      await waitFor(() => {
        expect(mockOnAnimationComplete).toHaveBeenCalled()
      }, { timeout: 1000 })
    })
  })

  describe('children动画', () => {
    it('应该支持animateChildren', () => {
      render(
        <Transition
          animateChildren={true}
          staggerDelay={0.1}
          config={{ duration: 0.1 }}
          data-testid="transition"
        >
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </Transition>
      )

      expect(screen.getByText('Child 1')).toBeInTheDocument()
      expect(screen.getByText('Child 2')).toBeInTheDocument()
      expect(screen.getByText('Child 3')).toBeInTheDocument()
    })

    it('应该处理复杂的children结构', () => {
      render(
        <Transition
          animateChildren={true}
          config={{ duration: 0.1 }}
          data-testid="transition"
        >
          <div>
            <span>Nested Content</span>
          </div>
          <button>Button</button>
          <p>Paragraph</p>
        </Transition>
      )

      expect(screen.getByText('Nested Content')).toBeInTheDocument()
      expect(screen.getByText('Button')).toBeInTheDocument()
      expect(screen.getByText('Paragraph')).toBeInTheDocument()
    })
  })

  describe('AnimatePresence', () => {
    it('应该支持animatePresence=true', async () => {
      const { rerender } = render(
        <Transition
          animatePresence={true}
          config={{ duration: 0.1 }}
          data-testid="transition"
        >
          <div>Test Content</div>
        </Transition>
      )

      expect(screen.getByTestId('transition')).toBeInTheDocument()

      rerender(
        <Transition
          animatePresence={true}
          show={false}
          config={{ duration: 0.1 }}
          data-testid="transition"
        >
          <div>Test Content</div>
        </Transition>
      )

      await waitFor(() => {
        expect(screen.queryByTestId('transition')).not.toBeInTheDocument()
      }, { timeout: 1000 })
    })

    it('应该支持animatePresence=false', () => {
      render(
        <Transition
          animatePresence={false}
          show={false}
          data-testid="transition"
        >
          <div>Test Content</div>
        </Transition>
      )

      expect(screen.queryByTestId('transition')).not.toBeInTheDocument()
    })
  })

  describe('过渡预设', () => {
    it('应该使用fadeIn预设', () => {
      const { transitionPresets } = require('./transition')

      render(
        <Transition
          config={transitionPresets.fadeIn}
          data-testid="transition"
        >
          <div>Test Content</div>
        </Transition>
      )

      expect(screen.getByTestId('transition')).toBeInTheDocument()
    })

    it('应该使用slideUp预设', () => {
      const { transitionPresets } = require('./transition')

      render(
        <Transition
          config={transitionPresets.slideUp}
          data-testid="transition"
        >
          <div>Test Content</div>
        </Transition>
      )

      expect(screen.getByTestId('transition')).toBeInTheDocument()
    })

    it('应该使用bounceIn预设', () => {
      const { transitionPresets } = require('./transition')

      render(
        <Transition
          config={transitionPresets.bounceIn}
          data-testid="transition"
        >
          <div>Test Content</div>
        </Transition>
      )

      expect(screen.getByTestId('transition')).toBeInTheDocument()
    })
  })

  describe('辅助函数', () => {
    it('createTransition应该创建自定义配置', () => {
      const { createTransition } = require('./transition')

      const customConfig = createTransition({
        type: 'fade',
        duration: 0.5,
        easing: 'easeInOut'
      })

      expect(customConfig).toEqual({
        type: 'fade',
        opacity: true,
        duration: 0.5,
        easing: 'easeInOut'
      })
    })
  })

  describe('可访问性', () => {
    it('应该通过axe可访问性测试', async () => {
      const { container } = render(
        <Transition
          role="dialog"
          aria-label="Test Dialog"
          data-testid="transition"
        >
          <div>Test Content</div>
        </Transition>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('应该支持键盘导航属性', () => {
      render(
        <Transition
          role="button"
          tabIndex={0}
          aria-expanded={true}
          data-testid="transition"
        >
          <div>Test Content</div>
        </Transition>
      )

      const element = screen.getByTestId('transition')
      expect(element).toHaveAttribute('role', 'button')
      expect(element).toHaveAttribute('tabIndex', '0')
      expect(element).toHaveAttribute('aria-expanded', 'true')
    })
  })

  describe('错误处理', () => {
    it('应该处理空的children', () => {
      expect(() => {
        render(
          <Transition data-testid="transition">
            {null}
          </Transition>
        )
      }).not.toThrow()
    })

    it('应该处理无效的transition配置', () => {
      expect(() => {
        render(
          <Transition
            config={{
              type: 'invalid' as any,
              duration: -1
            }}
            data-testid="transition"
          >
            <div>Test Content</div>
          </Transition>
        )
      }).not.toThrow()
    })
  })

  describe('边界情况', () => {
    it('应该处理非常快的动画', () => {
      render(
        <Transition
          config={{ duration: 0.001 }}
          data-testid="transition"
        >
          <div>Test Content</div>
        </Transition>
      )

      expect(screen.getByTestId('transition')).toBeInTheDocument()
    })

    it('应该处理非常慢的动画', () => {
      render(
        <Transition
          config={{ duration: 10 }}
          data-testid="transition"
        >
          <div>Test Content</div>
        </Transition>
      )

      expect(screen.getByTestId('transition')).toBeInTheDocument()
    })

    it('应该处理很大的staggerDelay', () => {
      render(
        <Transition
          animateChildren={true}
          staggerDelay={5}
          config={{ duration: 0.1 }}
          data-testid="transition"
        >
          <div>Child 1</div>
          <div>Child 2</div>
        </Transition>
      )

      expect(screen.getByText('Child 1')).toBeInTheDocument()
      expect(screen.getByText('Child 2')).toBeInTheDocument()
    })
  })

  describe('主题系统集成', () => {
    it('应该支持主题相关的样式类', () => {
      render(
        <Transition
          className="bg-primary text-primary-foreground"
          data-testid="transition"
        >
          <div>Test Content</div>
        </Transition>
      )

      const element = screen.getByTestId('transition')
      expect(element).toHaveClass('bg-primary', 'text-primary-foreground')
    })
  })
})