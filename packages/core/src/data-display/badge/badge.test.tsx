import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Badge } from './badge'
import { describe, it, expect, vi } from 'vitest'

// ============= 基础渲染测试 =============

describe('Badge 组件 - 基础渲染', () => {
  it('应该正确渲染基本徽章', () => {
    render(<Badge>基本徽章</Badge>)
    const badge = screen.getByText('基本徽章')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('inline-flex')
  })

  it('应该接受自定义className', () => {
    render(<Badge className="custom-class">测试</Badge>)
    const badge = screen.getByText('测试')
    expect(badge).toHaveClass('custom-class')
  })

  it('应该正确处理hidden属性', () => {
    render(<Badge hidden>隐藏徽章</Badge>)
    const badge = screen.queryByText('隐藏徽章')
    expect(badge).not.toBeInTheDocument()
  })

  it('应该正确处理count为0的情况', () => {
    render(<Badge count={0}>徽章</Badge>)
    const badge = screen.queryByText('徽章')
    expect(badge).not.toBeInTheDocument()
  })
})

// ============= 尺寸变体测试 =============

describe('Badge 组件 - 尺寸变体', () => {
  const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

  sizes.forEach((size) => {
    it(`应该正确渲染 ${size} 尺寸的徽章`, () => {
      render(<Badge size={size}>{size}</Badge>)
      const badge = screen.getByText(size)
      expect(badge).toBeInTheDocument()
    })
  })
})

// ============= 颜色变体测试 =============

describe('Badge 组件 - 颜色变体', () => {
  const colors = ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'gray', 'neon'] as const

  colors.forEach((color) => {
    it(`应该正确渲染 ${color} 颜色的徽章`, () => {
      render(<Badge color={color}>{color}</Badge>)
      const badge = screen.getByText(color)
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveAttribute('data-color', color)
    })
  })
})

// ============= 变体样式测试 =============

describe('Badge 组件 - 变体样式', () => {
  const variants = ['solid', 'outline', 'soft', 'ghost', 'gradient', 'glow'] as const

  variants.forEach((variant) => {
    it(`应该正确渲染 ${variant} 变体的徽章`, () => {
      render(<Badge variant={variant}>{variant}</Badge>)
      const badge = screen.getByText(variant)
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveAttribute('data-variant', variant)
    })
  })
})

// ============= 形状测试 =============

describe('Badge 组件 - 形状', () => {
  it('应该支持圆角形状', () => {
    render(<Badge shape="rounded">圆角徽章</Badge>)
    const badge = screen.getByText('圆角徽章')
    expect(badge).toHaveClass('rounded-full')
  })

  it('应该支持药丸形状', () => {
    render(<Badge shape="pill">药丸徽章</Badge>)
    const badge = screen.getByText('药丸徽章')
    expect(badge).toHaveClass('rounded-full')
  })

  it('应该支持方形形状', () => {
    render(<Badge shape="square">方形徽章</Badge>)
    const badge = screen.getByText('方形徽章')
    expect(badge).toHaveClass('rounded-md')
  })
})

// ============= 点形徽章测试 =============

describe('Badge 组件 - 点形徽章', () => {
  it('应该正确渲染点形徽章', () => {
    render(<Badge dot color="primary" />)
    const badge = screen.getByRole('presentation')
    expect(badge).toBeInTheDocument()
  })

  it('应该为点形徽章添加正确的size样式', () => {
    const { rerender } = render(<Badge dot size="sm" />)
    let badge = screen.getByRole('presentation')
    expect(badge).toHaveClass('w-2', 'h-2')

    rerender(<Badge dot size="lg" />)
    badge = screen.getByRole('presentation')
    expect(badge).toHaveClass('w-2.5', 'h-2.5')
  })
})

// ============= 数字徽章测试 =============

describe('Badge 组件 - 数字徽章', () => {
  it('应该正确显示数字', () => {
    render(<Badge count={5}>5</Badge>)
    const badge = screen.getByText('5')
    expect(badge).toBeInTheDocument()
  })

  it('应该正确处理超过max值的数字', () => {
    render(<Badge count={150} max={100}>100+</Badge>)
    const badge = screen.getByText('100+')
    expect(badge).toBeInTheDocument()
  })

  it('应该为数字徽章添加aria-label', () => {
    render(<Badge count={42} />)
    const badge = screen.getByLabelText('通知数量: 42')
    expect(badge).toBeInTheDocument()
  })
})

// ============= 可关闭徽章测试 =============

describe('Badge 组件 - 可关闭徽章', () => {
  it('应该显示关闭按钮', () => {
    const handleClose = vi.fn()
    render(<Badge closable onClose={handleClose}>可关闭徽章</Badge>)
    const closeButton = screen.getByRole('button', { name: /关闭徽章/i })
    expect(closeButton).toBeInTheDocument()
  })

  it('点击关闭按钮应该触发回调', () => {
    const handleClose = vi.fn()
    render(<Badge closable onClose={handleClose}>可关闭徽章</Badge>)
    const closeButton = screen.getByRole('button', { name: /关闭徽章/i })
    fireEvent.click(closeButton)
    expect(handleClose).toHaveBeenCalledTimes(1)
  })
})

// ============= 图标测试 =============

describe('Badge 组件 - 图标支持', () => {
  it('应该正确渲染自定义图标', () => {
    const Icon = () => (
      <svg data-testid="custom-icon" width="16" height="16">
        <circle cx="8" cy="8" r="4" />
      </svg>
    )
    render(<Badge icon={<Icon />}>带图标徽章</Badge>)
    const icon = screen.getByTestId('custom-icon')
    expect(icon).toBeInTheDocument()
  })

  it('应该仅在只有图标时显示图标', () => {
    const Icon = () => (
      <svg data-testid="custom-icon" width="16" height="16">
        <circle cx="8" cy="8" r="4" />
      </svg>
    )
    render(<Badge icon={<Icon />} />)
    const icon = screen.getByTestId('custom-icon')
    expect(icon).toBeInTheDocument()
  })
})

// ============= 悬浮提示测试 =============

describe('Badge 组件 - 悬浮提示', () => {
  it('应该正确设置title属性', () => {
    render(<Badge title="悬浮提示">提示徽章</Badge>)
    const badge = screen.getByText('提示徽章')
    expect(badge).toHaveAttribute('title', '悬浮提示')
  })
})

// ============= 状态测试 =============

describe('Badge 组件 - 状态', () => {
  const statuses = ['success', 'warning', 'error', 'info', 'neutral'] as const

  statuses.forEach((status) => {
    it(`应该为 ${status} 状态徽章添加正确的aria-label`, () => {
      render(<Badge status={status}>状态徽章</Badge>)
      const badge = screen.getByLabelText(`状态: ${status}`)
      expect(badge).toBeInTheDocument()
    })
  })
})

// ============= 动画测试 =============

describe('Badge 组件 - 动画', () => {
  it('应该在pulse属性为true时应用脉冲动画', () => {
    render(<Badge pulse>脉冲徽章</Badge>)
    const badge = screen.getByText('脉冲徽章')
    expect(badge).toHaveClass('animate-pulse')
  })
})

// ============= 阴影测试 =============

describe('Badge 组件 - 阴影', () => {
  it('应该在elevated为true时应用阴影', () => {
    render(<Badge elevated>阴影徽章</Badge>)
    const badge = screen.getByText('阴影徽章')
    expect(badge).toHaveClass('shadow-md')
  })
})

// ============= 可访问性测试 =============

describe('Badge 组件 - 可访问性', () => {
  it('应该支持点形徽章的aria-label', () => {
    render(<Badge dot />)
    const badge = screen.getByLabelText('状态指示器')
    expect(badge).toBeInTheDocument()
  })

  it('应该支持自定义的aria-label', () => {
    render(
      <Badge closable onClose={() => {}}>
        自定义标签
      </Badge>
    )
    const badge = screen.getByLabelText('可关闭的徽章')
    expect(badge).toBeInTheDocument()
  })
})

// ============= 数据属性测试 =============

describe('Badge 组件 - 数据属性', () => {
  it('应该正确设置data-component属性', () => {
    render(<Badge>徽章</Badge>)
    const badge = screen.getByText('徽章')
    expect(badge).toHaveAttribute('data-component', 'badge')
  })

  it('应该正确设置testId属性', () => {
    render(<Badge testId="custom-test-id">徽章</Badge>)
    const badge = screen.getByTestId('custom-test-id')
    expect(badge).toBeInTheDocument()
  })
})

// ============= 响应式测试 =============

describe('Badge 组件 - 响应式', () => {
  it('应该正确渲染不同尺寸的徽章', () => {
    const { rerender } = render(<Badge size="xs">小徽章</Badge>)
    let badge = screen.getByText('小徽章')
    expect(badge).toHaveClass('text-[10px]', 'min-h-[16px]')

    rerender(<Badge size="xl">大徽章</Badge>)
    badge = screen.getByText('大徽章')
    expect(badge).toHaveClass('text-base', 'min-h-[32px]')
  })
})

// ============= 组合使用测试 =============

describe('Badge 组件 - 组合使用', () => {
  it('应该同时支持图标和数字', () => {
    const Icon = () => (
      <svg data-testid="icon" width="16" height="16">
        <circle cx="8" cy="8" r="4" />
      </svg>
    )
    render(<Badge icon={<Icon />} count={10} />)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('应该同时支持变体和颜色', () => {
    render(<Badge variant="outline" color="success">组合徽章</Badge>)
    const badge = screen.getByText('组合徽章')
    expect(badge).toHaveAttribute('data-variant', 'outline')
    expect(badge).toHaveAttribute('data-color', 'success')
  })
})

// ============= 边界情况测试 =============

describe('Badge 组件 - 边界情况', () => {
  it('应该正确处理空的children', () => {
    render(<Badge>{''}</Badge>)
    const badge = screen.getByText('')
    expect(badge).toBeInTheDocument()
  })

  it('应该正确处理null和undefined的count', () => {
    const { rerender } = render(<Badge count={null}>徽章</Badge>)
    const badge1 = screen.getByText('徽章')
    expect(badge1).toBeInTheDocument()

    rerender(<Badge count={undefined}>徽章</Badge>)
    const badge2 = screen.getByText('徽章')
    expect(badge2).toBeInTheDocument()
  })

  it('应该正确处理max值为0的情况', () => {
    render(<Badge count={10} max={0}>0+</Badge>)
    const badge = screen.getByText('0+')
    expect(badge).toBeInTheDocument()
  })
})
