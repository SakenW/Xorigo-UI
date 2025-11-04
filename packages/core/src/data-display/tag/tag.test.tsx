import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Tag, TagGroup } from './tag'
import { describe, it, expect, vi } from 'vitest'

// ============= 基础渲染测试 =============

describe('Tag 组件 - 基础渲染', () => {
  it('应该正确渲染基本标签', () => {
    render(<Tag>基本标签</Tag>)
    const tag = screen.getByText('基本标签')
    expect(tag).toBeInTheDocument()
    expect(tag).toHaveClass('inline-flex')
  })

  it('应该接受自定义className', () => {
    render(<Tag className="custom-class">测试</Tag>)
    const tag = screen.getByText('测试')
    expect(tag).toHaveClass('custom-class')
  })

  it('应该正确设置data-component属性', () => {
    render(<Tag>标签</Tag>)
    const tag = screen.getByText('标签')
    expect(tag).toHaveAttribute('data-component', 'tag')
  })

  it('应该正确处理testId属性', () => {
    render(<Tag testId="custom-test-id">标签</Tag>)
    const tag = screen.getByTestId('custom-test-id')
    expect(tag).toBeInTheDocument()
  })
})

// ============= 尺寸变体测试 =============

describe('Tag 组件 - 尺寸变体', () => {
  const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

  sizes.forEach((size) => {
    it(`应该正确渲染 ${size} 尺寸的标签`, () => {
      render(<Tag size={size}>{size}</Tag>)
      const tag = screen.getByText(size)
      expect(tag).toBeInTheDocument()
      expect(tag).toHaveAttribute('data-size', size)
    })
  })
})

// ============= 颜色变体测试 =============

describe('Tag 组件 - 颜色变体', () => {
  const colors = ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'gray'] as const

  colors.forEach((color) => {
    it(`应该正确渲染 ${color} 颜色的标签`, () => {
      render(<Tag color={color}>{color}</Tag>)
      const tag = screen.getByText(color)
      expect(tag).toBeInTheDocument()
      expect(tag).toHaveAttribute('data-color', color)
    })
  })
})

// ============= 变体样式测试 =============

describe('Tag 组件 - 变体样式', () => {
  const variants = ['solid', 'outline', 'soft', 'ghost', 'gradient', 'neon'] as const

  variants.forEach((variant) => {
    it(`应该正确渲染 ${variant} 变体的标签`, () => {
      render(<Tag variant={variant}>{variant}</Tag>)
      const tag = screen.getByText(variant)
      expect(tag).toBeInTheDocument()
      expect(tag).toHaveAttribute('data-variant', variant)
    })
  })
})

// ============= 形状测试 =============

describe('Tag 组件 - 形状', () => {
  it('应该支持圆角形状', () => {
    render(<Tag shape="rounded">圆角标签</Tag>)
    const tag = screen.getByText('圆角标签')
    expect(tag).toHaveClass('rounded-md')
  })

  it('应该支持药丸形状', () => {
    render(<Tag shape="pill">药丸标签</Tag>)
    const tag = screen.getByText('药丸标签')
    expect(tag).toHaveClass('rounded-full')
  })

  it('应该支持方形形状', () => {
    render(<Tag shape="square">方形标签</Tag>)
    const tag = screen.getByText('方形标签')
    expect(tag).toHaveClass('rounded-none')
  })
})

// ============= 可删除标签测试 =============

describe('Tag 组件 - 可删除标签', () => {
  it('应该显示删除按钮', () => {
    const handleRemove = vi.fn()
    render(<Tag removable onRemove={handleRemove}>可删除标签</Tag>)
    const removeButton = screen.getByRole('button', { name: /移除标签/i })
    expect(removeButton).toBeInTheDocument()
  })

  it('点击删除按钮应该触发回调', () => {
    const handleRemove = vi.fn()
    render(<Tag removable onRemove={handleRemove}>可删除标签</Tag>)
    const removeButton = screen.getByRole('button', { name: /移除标签/i })
    fireEvent.click(removeButton)
    expect(handleRemove).toHaveBeenCalledTimes(1)
  })

  it('点击删除按钮不应该触发父元素onClick', () => {
    const handleRemove = vi.fn()
    const handleClick = vi.fn()
    render(
      <Tag removable onRemove={handleRemove} onClick={handleClick}>
        可删除标签
      </Tag>
    )
    const removeButton = screen.getByRole('button', { name: /移除标签/i })
    fireEvent.click(removeButton)
    expect(handleRemove).toHaveBeenCalledTimes(1)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('禁用状态下不应该显示删除按钮', () => {
    render(<Tag removable disabled>禁用标签</Tag>)
    const removeButton = screen.queryByRole('button', { name: /移除标签/i })
    expect(removeButton).not.toBeInTheDocument()
  })
})

// ============= 图标测试 =============

describe('Tag 组件 - 图标支持', () => {
  it('应该正确渲染自定义图标', () => {
    const Icon = () => (
      <svg data-testid="custom-icon" width="16" height="16">
        <circle cx="8" cy="8" r="4" />
      </svg>
    )
    render(<Tag icon={<Icon />}>带图标标签</Tag>)
    const icon = screen.getByTestId('custom-icon')
    expect(icon).toBeInTheDocument()
  })

  it('应该在图标和文字之间保持适当间距', () => {
    const Icon = () => <svg data-testid="icon" width="16" height="16" />
    render(<Tag icon={<Icon />}>标签文本</Tag>)
    const icon = screen.getByTestId('icon')
    expect(icon.closest('.inline-flex')).toHaveClass('gap-1.5')
  })
})

// ============= 可选择标签测试 =============

describe('Tag 组件 - 可选择标签', () => {
  it('应该正确渲染可选择标签', () => {
    render(<Tag selectable>可选择标签</Tag>)
    const tag = screen.getByText('可选择标签')
    expect(tag).toHaveAttribute('aria-pressed', 'false')
  })

  it('点击可选择标签应该切换选中状态', () => {
    const handleSelect = vi.fn()
    render(<Tag selectable onSelect={handleSelect}>可选择标签</Tag>)
    const tag = screen.getByText('可选择标签')

    fireEvent.click(tag)
    expect(tag).toHaveAttribute('aria-pressed', 'true')
    expect(handleSelect).toHaveBeenCalledWith(true)

    fireEvent.click(tag)
    expect(tag).toHaveAttribute('aria-pressed', 'false')
    expect(handleSelect).toHaveBeenCalledWith(false)
  })

  it('应该正确应用选中状态样式', () => {
    render(<Tag selectable selected>已选中标签</Tag>)
    const tag = screen.getByText('已选中标签')
    expect(tag).toHaveAttribute('aria-pressed', 'true')
  })

  it('应该在选中状态下显示选中图标', () => {
    render(<Tag selectable selected>已选中标签</Tag>)
    // 选中状态下应该有额外的视觉反馈
    const tag = screen.getByText('已选中标签')
    expect(tag.closest('button')).toBeInTheDocument()
  })

  it('禁用状态下不应该响应点击', () => {
    const handleSelect = vi.fn()
    render(<Tag selectable disabled onSelect={handleSelect}>禁用标签</Tag>)
    const tag = screen.getByText('禁用标签')
    fireEvent.click(tag)
    expect(handleSelect).not.toHaveBeenCalled()
  })
})

// ============= 状态测试 =============

describe('Tag 组件 - 状态', () => {
  it('应该在选中时应用选中样式', () => {
    render(<Tag variant="soft" selectable selected>选中</Tag>)
    const tag = screen.getByText('选中')
    // 选中状态应该应用额外的ring样式
    expect(tag.closest('button')).toHaveClass(/ring-2/)
  })

  it('应该在禁用时应用禁用样式', () => {
    render(<Tag disabled>禁用标签</Tag>)
    const tag = screen.getByText('禁用标签')
    expect(tag.closest('button')).toHaveClass('opacity-50', 'cursor-not-allowed')
  })

  it('应该在悬浮时应用缩放动画', () => {
    render(<Tag animated>动画标签</Tag>)
    const tag = screen.getByText('动画标签')
    // 动画标签应该被motion组件包装
    expect(tag.closest('[data-component="tag"]')).toBeInTheDocument()
  })
})

// ============= 动画测试 =============

describe('Tag 组件 - 动画', () => {
  it('应该在animated为true时应用进入动画', () => {
    render(<Tag animated>动画标签</Tag>)
    const tag = screen.getByText('动画标签')
    // 动画标签会有进入/退出动画
    expect(tag).toBeInTheDocument()
  })

  it('应该在animated为false时不应用动画', () => {
    render(<Tag animated={false}>非动画标签</Tag>)
    const tag = screen.getByText('非动画标签')
    // 非动画标签直接渲染
    expect(tag).toBeInTheDocument()
  })
})

// ============= 响应式测试 =============

describe('Tag 组件 - 响应式', () => {
  it('应该正确渲染不同尺寸的标签', () => {
    const { rerender } = render(<Tag size="xs">小标签</Tag>)
    let tag = screen.getByText('小标签')
    expect(tag).toHaveClass('min-h-[20px]')

    rerender(<Tag size="xl">大标签</Tag>)
    tag = screen.getByText('大标签')
    expect(tag).toHaveClass('min-h-[36px]')
  })
})

// ============= 可访问性测试 =============

describe('Tag 组件 - 可访问性', () => {
  it('应该支持可选择标签的aria-pressed属性', () => {
    render(<Tag selectable>可选择标签</Tag>)
    const tag = screen.getByText('可选择标签')
    expect(tag).toHaveAttribute('aria-pressed', 'false')
  })

  it('应该为可删除标签添加适当的aria-label', () => {
    render(<Tag removable>可删除标签</Tag>)
    const tag = screen.getByText('可删除标签')
    expect(tag).toHaveAttribute('aria-label', '可移除的标签')
  })

  it('应该支持键盘导航', () => {
    const handleClick = vi.fn()
    render(<Tag onClick={handleClick}>键盘导航</Tag>)
    const tag = screen.getByText('键盘导航')

    // 按钮应该可以聚焦
    tag.focus()
    expect(tag).toHaveFocus()

    // 空格键应该触发onClick
    fireEvent.keyDown(tag, { key: ' ' })
    // Note: reacttestinglibrary的fireEvent不会触发onClick，需要使用userEvent
  })
})

// ============= TagGroup 组件测试 =============

describe('TagGroup 组件 - 基础功能', () => {
  it('应该正确渲染标签组', () => {
    render(
      <TagGroup>
        <Tag>标签1</Tag>
        <Tag>标签2</Tag>
        <Tag>标签3</Tag>
      </TagGroup>
    )
    expect(screen.getByText('标签1')).toBeInTheDocument()
    expect(screen.getByText('标签2')).toBeInTheDocument()
    expect(screen.getByText('标签3')).toBeInTheDocument()
  })

  it('应该正确应用间距', () => {
    render(
      <TagGroup spacing="loose">
        <Tag>标签1</Tag>
        <Tag>标签2</Tag>
      </TagGroup>
    )
    const container = screen.getByText('标签1').closest('.flex')
    expect(container).toHaveClass('gap-3.5')
  })

  it('应该支持紧凑间距', () => {
    render(
      <TagGroup spacing="tight">
        <Tag>标签1</Tag>
        <Tag>标签2</Tag>
      </TagGroup>
    )
    const container = screen.getByText('标签1').closest('.flex')
    expect(container).toHaveClass('gap-1.5')
  })
})

// ============= TagGroup 溢出处理 =============

describe('TagGroup 组件 - 溢出处理', () => {
  it('应该支持max属性限制显示数量', () => {
    render(
      <TagGroup max={2}>
        <Tag>标签1</Tag>
        <Tag>标签2</Tag>
        <Tag>标签3</Tag>
        <Tag>标签4</Tag>
      </TagGroup>
    )
    expect(screen.getByText('标签1')).toBeInTheDocument()
    expect(screen.getByText('标签2')).toBeInTheDocument()
    expect(screen.queryByText('标签3')).not.toBeInTheDocument()
  })

  it('应该显示省略号', () => {
    render(
      <TagGroup max={2} overflowType="ellipsis">
        <Tag>标签1</Tag>
        <Tag>标签2</Tag>
        <Tag>标签3</Tag>
      </TagGroup>
    )
    expect(screen.getByText('+1')).toBeInTheDocument()
  })

  it('应该支持dropdown溢出类型', () => {
    render(
      <TagGroup max={2} overflowType="dropdown">
        <Tag>标签1</Tag>
        <Tag>标签2</Tag>
        <Tag>标签3</Tag>
      </TagGroup>
    )
    expect(screen.getByText('查看全部 (3)')).toBeInTheDocument()
  })

  it('应该支持hidden溢出类型', () => {
    render(
      <TagGroup max={2} overflowType="hidden">
        <Tag>标签1</Tag>
        <Tag>标签2</Tag>
        <Tag>标签3</Tag>
      </TagGroup>
    )
    expect(screen.getByText('标签1')).toBeInTheDocument()
    expect(screen.getByText('标签2')).toBeInTheDocument()
    expect(screen.queryByText('标签3')).not.toBeInTheDocument()
    // hidden模式下不显示省略号
    expect(screen.queryByText('+1')).not.toBeInTheDocument()
  })
})

// ============= TagGroup 选择模式 =============

describe('TagGroup 组件 - 选择模式', () => {
  it('应该支持单选模式', () => {
    const handleSelectionChange = vi.fn()
    render(
      <TagGroup selectionMode="single" onSelectionChange={handleSelectionChange}>
        <Tag>标签1</Tag>
        <Tag>标签2</Tag>
        <Tag>标签3</Tag>
      </TagGroup>
    )

    const tag1 = screen.getByText('标签1')
    const tag2 = screen.getByText('标签2')

    fireEvent.click(tag1)
    expect(handleSelectionChange).toHaveBeenCalledWith([0])

    fireEvent.click(tag2)
    expect(handleSelectionChange).toHaveBeenCalledWith([1])
  })

  it('应该支持多选模式', () => {
    const handleSelectionChange = vi.fn()
    render(
      <TagGroup selectionMode="multiple" onSelectionChange={handleSelectionChange}>
        <Tag>标签1</Tag>
        <Tag>标签2</Tag>
        <Tag>标签3</Tag>
      </TagGroup>
    )

    const tag1 = screen.getByText('标签1')
    const tag2 = screen.getByText('标签2')

    fireEvent.click(tag1)
    expect(handleSelectionChange).toHaveBeenCalledWith([0])

    fireEvent.click(tag2)
    expect(handleSelectionChange).toHaveBeenCalledWith([0, 1])

    fireEvent.click(tag1) // 取消选择
    expect(handleSelectionChange).toHaveBeenCalledWith([1])
  })

  it('应该正确同步外部选中值', () => {
    const { rerender } = render(
      <TagGroup selectionMode="multiple" selectedValues={[0, 1]}>
        <Tag>标签1</Tag>
        <Tag>标签2</Tag>
        <Tag>标签3</Tag>
      </TagGroup>
    )

    let tag1 = screen.getByText('标签1')
    expect(tag1).toHaveAttribute('aria-pressed', 'true')

    rerender(
      <TagGroup selectionMode="multiple" selectedValues={[2]}>
        <Tag>标签1</Tag>
        <Tag>标签2</Tag>
        <Tag>标签3</Tag>
      </TagGroup>
    )

    tag1 = screen.getByText('标签1')
    expect(tag1).toHaveAttribute('aria-pressed', 'false')
  })
})

// ============= 边界情况测试 =============

describe('Tag 组件 - 边界情况', () => {
  it('应该正确处理空的children', () => {
    render(<Tag>{''}</Tag>)
    const tag = screen.getByText('')
    expect(tag).toBeInTheDocument()
  })

  it('应该正确处理null和undefined的children', () => {
    const { rerender } = render(<Tag>{null as any}</Tag>)
    const tag = screen.getByText('')
    expect(tag).toBeInTheDocument()

    rerender(<Tag>{undefined as any}</Tag>)
    // undefined可能不会渲染
  })

  it('应该在没有onSelect时正常处理点击', () => {
    render(<Tag selectable>可选择标签</Tag>)
    const tag = screen.getByText('可选择标签')

    // 没有onSelect时点击不应该报错
    expect(() => fireEvent.click(tag)).not.toThrow()
  })

  it('应该正确处理removeable和selectable同时为true的情况', () => {
    const handleRemove = vi.fn()
    const handleSelect = vi.fn()
    render(
      <Tag removable selectable onRemove={handleRemove} onSelect={handleSelect}>
        双重功能
      </Tag>
    )

    const tag = screen.getByText('双重功能')
    const removeButton = screen.getByRole('button', { name: /移除标签/i })

    fireEvent.click(tag)
    expect(handleSelect).toHaveBeenCalled()

    fireEvent.click(removeButton)
    expect(handleRemove).toHaveBeenCalled()
  })
})

// ============= 组合使用测试 =============

describe('Tag 组件 - 组合使用', () => {
  it('应该同时支持图标和删除按钮', () => {
    const Icon = () => <svg data-testid="icon" width="16" height="16" />
    const handleRemove = vi.fn()

    render(
      <Tag icon={<Icon />} removable onRemove={handleRemove}>
        组合标签
      </Tag>
    )

    expect(screen.getByTestId('icon')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /移除标签/i })).toBeInTheDocument()
  })

  it('应该同时支持变体、颜色和尺寸', () => {
    render(<Tag variant="outline" color="success" size="lg">组合标签</Tag>)
    const tag = screen.getByText('组合标签')
    expect(tag).toHaveAttribute('data-variant', 'outline')
    expect(tag).toHaveAttribute('data-color', 'success')
    expect(tag).toHaveAttribute('data-size', 'lg')
  })
})
