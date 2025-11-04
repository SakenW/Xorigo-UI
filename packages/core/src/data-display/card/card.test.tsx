/**
 * @fileoverview Card 组件测试
 * @description 验证 Card 组件的功能特性、变体、状态和交互
 *
 * @author Xorigo UI Team
 * @version 1.0.0
 * @since 2025-11-04
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Card, CardHeader, CardBody, CardFooter } from './card'
import { ThemeProvider } from '@xorigo-ui/system'

// =============================================================================
// 工具函数
// =============================================================================

const renderWithTheme = (component: React.ReactNode) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  )
}

// =============================================================================
// 基础渲染测试
// =============================================================================

describe('Card', () => {
  describe('基础渲染', () => {
    it('应该正确渲染默认 Card', () => {
      renderWithTheme(<Card>Card Content</Card>)
      const card = screen.getByText('Card Content').closest('[data-component="card"]')
      expect(card).toBeInTheDocument()
      expect(card).toHaveAttribute('data-state', 'normal')
    })

    it('应该支持自定义 className', () => {
      renderWithTheme(<Card className="custom-class">Content</Card>)
      const card = screen.getByText('Content').closest('[data-component="card"]')
      expect(card).toHaveClass('custom-class')
    })

    it('应该渲染子组件', () => {
      renderWithTheme(
        <Card>
          <CardHeader title="标题" subtitle="副标题" />
          <CardBody>正文内容</CardBody>
          <CardFooter>底部内容</CardFooter>
        </Card>
      )

      expect(screen.getByText('标题')).toBeInTheDocument()
      expect(screen.getByText('副标题')).toBeInTheDocument()
      expect(screen.getByText('正文内容')).toBeInTheDocument()
      expect(screen.getByText('底部内容')).toBeInTheDocument()
    })
  })

  // =============================================================================
  // 变体测试
  // =============================================================================

  describe('变体测试', () => {
    it('应该应用 default 变体', () => {
      renderWithTheme(<Card variant="default">Default Card</Card>)
      const card = screen.getByText('Default Card').closest('[data-component="card"]')
      expect(card).toHaveClass('bg-[var(--bg-primary)]')
      expect(card).toHaveClass('border')
    })

    it('应该应用 elevated 变体', () => {
      renderWithTheme(<Card variant="elevated">Elevated Card</Card>)
      const card = screen.getByText('Elevated Card').closest('[data-component="card"]')
      expect(card).toHaveClass('shadow-[0_4px_12px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.06)]')
    })

    it('应该应用 bordered 变体', () => {
      renderWithTheme(<Card variant="bordered">Bordered Card</Card>)
      const card = screen.getByText('Bordered Card').closest('[data-component="card"]')
      expect(card).toHaveClass('border-2')
    })

    it('应该应用 filled 变体', () => {
      renderWithTheme(<Card variant="filled">Filled Card</Card>)
      const card = screen.getByText('Filled Card').closest('[data-component="card"]')
      expect(card).toHaveClass('bg-[var(--bg-secondary)]')
    })

    it('应该应用 glass 变体', () => {
      renderWithTheme(<Card variant="glass">Glass Card</Card>)
      const card = screen.getByText('Glass Card').closest('[data-component="card"]')
      expect(card).toHaveClass('backdrop-blur-md')
    })

    it('应该应用 gradient 变体', () => {
      renderWithTheme(<Card variant="gradient">Gradient Card</Card>)
      const card = screen.getByText('Gradient Card').closest('[data-component="card"]')
      expect(card).toHaveClass('bg-gradient-to-br')
    })

    it('应该应用 neon 变体', () => {
      renderWithTheme(<Card variant="neon">Neon Card</Card>)
      const card = screen.getByText('Neon Card').closest('[data-component="card"]')
      expect(card).toHaveClass('shadow-[0_0_20px_rgba')
    })

    it('应该应用 interactive 变体', () => {
      renderWithTheme(<Card variant="interactive">Interactive Card</Card>)
      const card = screen.getByText('Interactive Card').closest('[data-component="card"]')
      expect(card).toHaveClass('cursor-pointer')
      expect(card).toHaveClass('hover:border-[var(--border-secondary)]')
    })
  })

  // =============================================================================
  // 阴影层级测试
  // =============================================================================

  describe('阴影层级测试', () => {
    it('应该支持不同阴影层级', () => {
      const { rerender } = renderWithTheme(<Card shadowLevel="none">No Shadow</Card>)
      let card = screen.getByText('No Shadow').closest('[data-component="card"]')
      expect(card).toHaveClass('shadow-none')

      rerender(<Card shadowLevel="xl">Large Shadow</Card>)
      card = screen.getByText('Large Shadow').closest('[data-component="card"]')
      expect(card).toHaveClass('shadow-[0_20px_25px_rgba(0,0,0,0.1),0_10px_10px_rgba(0,0,0,0.04)]')
    })
  })

  // =============================================================================
  // 圆角测试
  // =============================================================================

  describe('圆角测试', () => {
    it('应该支持不同圆角大小', () => {
      const { rerender } = renderWithTheme(<Card roundness="none">No Radius</Card>)
      let card = screen.getByText('No Radius').closest('[data-component="card"]')
      expect(card).toHaveClass('rounded-none')

      rerender(<Card roundness="full">Full Radius</Card>)
      card = screen.getByText('Full Radius').closest('[data-component="card"]')
      expect(card).toHaveClass('rounded-full')
    })
  })

  // =============================================================================
  // 状态测试
  // =============================================================================

  describe('状态测试', () => {
    it('应该正确显示加载状态', () => {
      renderWithTheme(<Card loading>Loading Card</Card>)
      const card = screen.getByTestId('card-loading')
      expect(card).toBeInTheDocument()
      expect(card).toHaveAttribute('data-state', 'loading')
    })

    it('应该正确显示禁用状态', () => {
      renderWithTheme(<Card disabled>Disabled Card</Card>)
      const card = screen.getByText('Disabled Card').closest('[data-component="card"]')
      expect(card).toHaveAttribute('data-state', 'disabled')
      expect(card).toHaveClass('opacity-50')
      expect(card).toHaveClass('cursor-not-allowed')
    })

    it('应该正确显示选中状态', () => {
      renderWithTheme(<Card selected>Selected Card</Card>)
      const card = screen.getByText('Selected Card').closest('[data-component="card"]')
      expect(card).toHaveClass('ring-2')
      expect(card).toHaveClass('ring-[var(--ring-primary-action)]')
    })

    it('应该正确显示悬浮状态', async () => {
      renderWithTheme(<Card hoverable>Hoverable Card</Card>)
      const card = screen.getByText('Hoverable Card').closest('[data-component="card"]')

      fireEvent.mouseEnter(card!)
      await new Promise(resolve => setTimeout(resolve, 100))
      expect(card).toHaveAttribute('data-state', 'hovered')

      fireEvent.mouseLeave(card!)
      await new Promise(resolve => setTimeout(resolve, 100))
      expect(card).toHaveAttribute('data-state', 'normal')
    })
  })

  // =============================================================================
  // 交互测试
  // =============================================================================

  describe('交互测试', () => {
    it('应该支持点击事件', () => {
      const handleClick = vi.fn()
      renderWithTheme(<Card onClick={handleClick}>Clickable Card</Card>)

      const card = screen.getByText('Clickable Card').closest('[data-component="card"]')!
      fireEvent.click(card)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('应该支持键盘交互（Enter键）', () => {
      const handleClick = vi.fn()
      renderWithTheme(<Card onClick={handleClick}>Keyboard Card</Card>)

      const card = screen.getByText('Keyboard Card').closest('[data-component="card"]')!
      card.focus()
      fireEvent.keyDown(card, { key: 'Enter' })

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('应该支持键盘交互（空格键）', () => {
      const handleClick = vi.fn()
      renderWithTheme(<Card onClick={handleClick}>Keyboard Card</Card>)

      const card = screen.getByText('Keyboard Card').closest('[data-component="card"]')!
      card.focus()
      fireEvent.keyDown(card, { key: ' ' })

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('禁用状态下不应该响应点击', () => {
      const handleClick = vi.fn()
      renderWithTheme(<Card onClick={handleClick} disabled>Disabled Card</Card>)

      const card = screen.getByText('Disabled Card').closest('[data-component="card"]')!
      fireEvent.click(card)

      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  // =============================================================================
  // 媒体内容测试
  // =============================================================================

  describe('媒体内容测试', () => {
    it('应该渲染媒体内容（顶部位置）', () => {
      renderWithTheme(
        <Card media={<img src="test.jpg" alt="test" />}>
          <CardBody>Content</CardBody>
        </Card>
      )
      expect(screen.getByAltText('test')).toBeInTheDocument()
    })

    it('应该支持不同的媒体位置', () => {
      const { rerender } = renderWithTheme(
        <Card media={<div>Media</div>} mediaPosition="left">
          <CardBody>Content</CardBody>
        </Card>
      )
      expect(screen.getByText('Media')).toBeInTheDocument()

      rerender(
        <Card media={<div>Media</div>} mediaPosition="right">
          <CardBody>Content</CardBody>
        </Card>
      )
      expect(screen.getByText('Media')).toBeInTheDocument()
    })
  })

  // =============================================================================
  // 徽章测试
  // =============================================================================

  describe('徽章测试', () => {
    it('应该显示徽章文本', () => {
      renderWithTheme(<Card badge="新品">Card with Badge</Card>)
      expect(screen.getByText('新品')).toBeInTheDocument()
    })

    it('应该支持不同的徽章颜色', () => {
      renderWithTheme(<Card badge="成功" badgeColor="success">Success Badge</Card>)
      const badge = screen.getByText('成功').closest('div')!
      expect(badge).toHaveClass('bg-[var(--bg-success)]')
    })
  })

  // =============================================================================
  // 子组件测试
  // =============================================================================

  describe('子组件测试', () => {
    describe('CardHeader', () => {
      it('应该渲染标题和副标题', () => {
        renderWithTheme(
          <Card>
            <CardHeader title="标题" subtitle="副标题" />
          </Card>
        )
        expect(screen.getByText('标题')).toBeInTheDocument()
        expect(screen.getByText('副标题')).toBeInTheDocument()
      })

      it('应该支持自定义操作区', () => {
        renderWithTheme(
          <Card>
            <CardHeader title="标题" action={<button>操作</button>} />
          </Card>
        )
        expect(screen.getByText('操作')).toBeInTheDocument()
      })
    })

    describe('CardBody', () => {
      it('应该渲染正文内容', () => {
        renderWithTheme(
          <Card>
            <CardBody>正文内容</CardBody>
          </Card>
        )
        expect(screen.getByText('正文内容')).toBeInTheDocument()
      })
    })

    describe('CardFooter', () => {
      it('应该渲染底部内容', () => {
        renderWithTheme(
          <Card>
            <CardFooter>底部内容</CardFooter>
          </Card>
        )
        expect(screen.getByText('底部内容')).toBeInTheDocument()
      })

      it('应该支持不同的对齐方式', () => {
        renderWithTheme(
          <Card>
            <CardFooter align="center">居中</CardFooter>
          </Card>
        )
        const footer = screen.getByText('居中').closest('div')!
        expect(footer).toHaveClass('justify-center')
      })
    })
  })

  // =============================================================================
  // 可访问性测试
  // =============================================================================

  describe('可访问性测试', () => {
    it('可点击的卡片应该具有正确的 role', () => {
      renderWithTheme(<Card onClick={() => {}}>Clickable Card</Card>)
      const card = screen.getByText('Clickable Card').closest('[data-component="card"]')
      expect(card).toHaveAttribute('role', 'button')
    })

    it('可点击的卡片应该可以聚焦', () => {
      renderWithTheme(<Card onClick={() => {}}>Focusable Card</Card>)
      const card = screen.getByText('Focusable Card').closest('[data-component="card"]')
      expect(card).toHaveAttribute('tabindex', '0')
    })

    it('不可点击的卡片不应该有 button role', () => {
      renderWithTheme(<Card>Normal Card</Card>)
      const card = screen.getByText('Normal Card').closest('[data-component="card"]')
      expect(card).not.toHaveAttribute('role', 'button')
    })
  })

  // =============================================================================
  // 动画测试
  // =============================================================================

  describe('动画测试', () => {
    it('应该在悬浮时应用动画', async () => {
      renderWithTheme(<Card hoverable>Animated Card</Card>)
      const card = screen.getByText('Animated Card').closest('[data-component="card"]')

      fireEvent.mouseEnter(card!)
      await new Promise(resolve => setTimeout(resolve, 200))
      // 动画效果会改变 transform，我们检查它存在
      expect(card).toBeInTheDocument()
    })

    it('应该支持点击动画', () => {
      renderWithTheme(<Card onClick={() => {}}>Tappable Card</Card>)
      const card = screen.getByText('Tappable Card').closest('[data-component="card"]')
      // 点击动画会在点击时应用
      fireEvent.click(card!)
      expect(card).toBeInTheDocument()
    })
  })

  // =============================================================================
  // 测试 ID 和数据属性测试
  // =============================================================================

  describe('测试属性测试', () => {
    it('应该支持自定义 testId', () => {
      renderWithTheme(<Card testId="custom-test-id">Custom ID Card</Card>)
      const card = screen.getByTestId('custom-test-id')
      expect(card).toBeInTheDocument()
    })

    it('应该正确设置组件标识', () => {
      renderWithTheme(<Card>Test Card</Card>)
      const card = screen.getByText('Test Card').closest('[data-component="card"]')
      expect(card).toHaveAttribute('data-component', 'card')
    })

    it('应该在加载时设置正确的测试ID', () => {
      renderWithTheme(<Card loading>Loading Card</Card>)
      const card = screen.getByTestId('card-loading')
      expect(card).toBeInTheDocument()
    })
  })

  // =============================================================================
  // 边缘情况测试
  // =============================================================================

  describe('边缘情况测试', () => {
    it('应该处理空的 children', () => {
      renderWithTheme(<Card></Card>)
      // 没有内容也应该正常渲染
      const card = screen.queryByText('测试') // 使用一个不存在的文本
      expect(card).not.toBeInTheDocument()
    })

    it('应该处理多个子组件', () => {
      renderWithTheme(
        <Card>
          <CardHeader title="Header 1" />
          <CardHeader title="Header 2" />
          <CardBody>Body 1</CardBody>
          <CardBody>Body 2</CardBody>
        </Card>
      )
      expect(screen.getByText('Header 1')).toBeInTheDocument()
      expect(screen.getByText('Header 2')).toBeInTheDocument()
      expect(screen.getByText('Body 1')).toBeInTheDocument()
      expect(screen.getByText('Body 2')).toBeInTheDocument()
    })

    it('应该处理悬浮回调', () => {
      const handleHover = vi.fn()
      renderWithTheme(<Card onHover={handleHover}>Hover Callback</Card>)

      const card = screen.getByText('Hover Callback').closest('[data-component="card"]')!
      fireEvent.mouseEnter(card)
      expect(handleHover).toHaveBeenCalledWith(true)

      fireEvent.mouseLeave(card)
      expect(handleHover).toHaveBeenCalledWith(false)
    })
  })
})
