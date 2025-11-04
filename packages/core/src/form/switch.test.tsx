import React from 'react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { axe, toHaveNoViolations } from '../utils/jest-axe-mock'
import { Switch } from './switch'
import type { SwitchProps } from './switch'

// 扩展 Jest 匹配器
expect.extend(toHaveNoViolations)

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    label: ({ children, ...props }: any) => <label {...props}>{children}</label>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

// Mock 主题系统
vi.mock('@xorigo-ui/system', () => ({
  useTheme: () => ({
    themeConfig: {
      colors: {
        primary: '#3b82f6',
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
        neutral: '#6b7280',
      },
      spacing: {
        3: '12px',
        1: '4px',
      },
      glow: '#3b82f6',
    },
  }),
}))

describe('Switch组件', () => {
  const defaultProps: SwitchProps = {
    'aria-label': 'Test switch',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('基础渲染', () => {
    it('应该正确渲染基础Switch组件', () => {
      render(<Switch {...defaultProps} />)

      const switchElement = screen.getByRole('switch')
      expect(switchElement).toBeInTheDocument()
      expect(switchElement).toHaveAttribute('type', 'checkbox')
      expect(switchElement).toHaveAttribute('aria-label', 'Test switch')
    })

    it('应该正确设置默认属性', () => {
      render(<Switch {...defaultProps} />)

      const switchElement = screen.getByRole('switch')
      expect(switchElement).not.toBeChecked()
      expect(switchElement).not.toBeDisabled()
    })

    it('应该支持自定义className', () => {
      render(<Switch {...defaultProps} className="custom-class" />)

      const container = screen.getByRole('group')
      expect(container).toHaveClass('custom-class')
    })
  })

  describe('属性控制', () => {
    it('应该支持checked属性', () => {
      render(<Switch {...defaultProps} checked />)

      const switchElement = screen.getByRole('switch')
      expect(switchElement).toBeChecked()
    })

    it('应该支持defaultChecked属性', () => {
      render(<Switch {...defaultProps} defaultChecked />)

      const switchElement = screen.getByRole('switch')
      expect(switchElement).toBeChecked()
    })

    it('应该支持disabled属性', () => {
      render(<Switch {...defaultProps} disabled />)

      const switchElement = screen.getByRole('switch')
      expect(switchElement).toBeDisabled()
    })

    it('应该支持loading属性', () => {
      render(<Switch {...defaultProps} loading />)

      const switchElement = screen.getByRole('switch')
      expect(switchElement).toBeDisabled()
      expect(switchElement).toHaveAttribute('aria-busy', 'true')

      // 检查加载指示器是否存在
      const spinner = document.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
    })
  })

  describe('变体系统', () => {
    const variants: SwitchProps['variant'][] = ['default', 'primary', 'success', 'danger', 'outline']

    variants.forEach(variant => {
      it(`应该支持${variant}变体`, () => {
        render(<Switch {...defaultProps} variant={variant} />)

        const switchElement = screen.getByRole('switch')
        expect(switchElement).toBeInTheDocument()
      })
    })
  })

  describe('尺寸系统', () => {
    const sizes: SwitchProps['size'][] = ['sm', 'md', 'lg']

    sizes.forEach(size => {
      it(`应该支持${size}尺寸`, () => {
        render(<Switch {...defaultProps} size={size} />)

        const switchElement = screen.getByRole('switch')
        expect(switchElement).toBeInTheDocument()
      })
    })
  })

  describe('状态系统', () => {
    const statuses: SwitchProps['status'][] = ['default', 'error', 'success', 'warning']

    statuses.forEach(status => {
      it(`应该支持${status}状态`, () => {
        render(<Switch {...defaultProps} status={status} />)

        const switchElement = screen.getByRole('switch')
        expect(switchElement).toBeInTheDocument()
      })
    })
  })

  describe('标签和描述', () => {
    it('应该支持标签显示', () => {
      render(<Switch label="Test Label" />)

      const label = screen.getByText('Test Label')
      expect(label).toBeInTheDocument()
      expect(label).toHaveAttribute('id', expect.stringMatching(/switch-.*-label/))
    })

    it('应该支持描述文本', () => {
      render(<Switch description="Test Description" />)

      const description = screen.getByText('Test Description')
      expect(description).toBeInTheDocument()
      expect(description).toHaveAttribute('id', expect.stringMatching(/switch-.*-description/))
    })

    it('应该支持标签位置调整', () => {
      const { rerender } = render(<Switch label="Test Label" labelPosition="left" />)

      // 检查左标签位置
      const label = screen.getByText('Test Label')
      expect(label).toBeInTheDocument()

      // 重新渲染为右标签位置
      rerender(<Switch label="Test Label" labelPosition="right" />)
      expect(label).toBeInTheDocument()
    })

    it('应该同时支持标签和描述', () => {
      render(<Switch label="Test Label" description="Test Description" />)

      const label = screen.getByText('Test Label')
      const description = screen.getByText('Test Description')

      expect(label).toBeInTheDocument()
      expect(description).toBeInTheDocument()

      // 检查aria关联
      const switchElement = screen.getByRole('group')
      expect(switchElement).toHaveAttribute('aria-labelledby', expect.stringMatching(/switch-.*-label/))
      expect(switchElement).toHaveAttribute('aria-describedby', expect.stringMatching(/switch-.*-description/))
    })

    it('应该支持自定义样式类名', () => {
      render(
        <Switch
          label="Test Label"
          description="Test Description"
          labelClassName="custom-label"
          descriptionClassName="custom-description"
        />
      )

      const label = screen.getByText('Test Label')
      const description = screen.getByText('Test Description')

      expect(label).toHaveClass('custom-label')
      expect(description).toHaveClass('custom-description')
    })
  })

  describe('thumb图标', () => {
    it('应该支持thumb图标', () => {
      const TestIcon = () => <div data-testid="test-icon">Icon</div>
      render(<Switch {...defaultProps} thumbIcon={<TestIcon />} />)

      const icon = screen.getByTestId('test-icon')
      expect(icon).toBeInTheDocument()
    })

    it('应该在loading状态下优先显示加载指示器', () => {
      const TestIcon = () => <div data-testid="test-icon">Icon</div>
      render(<Switch {...defaultProps} loading thumbIcon={<TestIcon />} />)

      // 应该显示加载指示器而不是图标
      const spinner = document.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()

      const icon = screen.queryByTestId('test-icon')
      expect(icon).not.toBeInTheDocument()
    })
  })

  describe('事件处理', () => {
    it('应该支持onChange事件', async () => {
      const handleChange = vi.fn()
      render(<Switch {...defaultProps} onChange={handleChange} />)

      const switchElement = screen.getByRole('switch')
      fireEvent.click(switchElement)

      expect(handleChange).toHaveBeenCalledTimes(1)
    })

    it('应该支持onCheckedChange事件', async () => {
      const handleCheckedChange = vi.fn()
      render(<Switch {...defaultProps} onCheckedChange={handleCheckedChange} />)

      const switchElement = screen.getByRole('switch')
      fireEvent.click(switchElement)

      expect(handleCheckedChange).toHaveBeenCalledWith(true)
    })

    it('应该支持同时触发onChange和onCheckedChange', async () => {
      const handleChange = vi.fn()
      const handleCheckedChange = vi.fn()

      render(
        <Switch
          {...defaultProps}
          onChange={handleChange}
          onCheckedChange={handleCheckedChange}
        />
      )

      const switchElement = screen.getByRole('switch')
      fireEvent.click(switchElement)

      expect(handleChange).toHaveBeenCalledTimes(1)
      expect(handleCheckedChange).toHaveBeenCalledWith(true)
    })

    it('应该在disabled状态下不触发事件', async () => {
      const handleChange = vi.fn()
      const handleCheckedChange = vi.fn()

      render(
        <Switch
          {...defaultProps}
          disabled
          onChange={handleChange}
          onCheckedChange={handleCheckedChange}
        />
      )

      const switchElement = screen.getByRole('switch')
      fireEvent.click(switchElement)

      expect(handleChange).not.toHaveBeenCalled()
      expect(handleCheckedChange).not.toHaveBeenCalled()
    })

    it('应该在loading状态下不触发事件', async () => {
      const handleChange = vi.fn()
      const handleCheckedChange = vi.fn()

      render(
        <Switch
          {...defaultProps}
          loading
          onChange={handleChange}
          onCheckedChange={handleCheckedChange}
        />
      )

      const switchElement = screen.getByRole('switch')
      fireEvent.click(switchElement)

      expect(handleChange).not.toHaveBeenCalled()
      expect(handleCheckedChange).not.toHaveBeenCalled()
    })
  })

  describe('键盘交互', () => {
    it('应该支持空格键切换', () => {
      const handleCheckedChange = vi.fn()
      render(<Switch {...defaultProps} onCheckedChange={handleCheckedChange} />)

      const switchElement = screen.getByRole('switch')
      switchElement.focus()

      fireEvent.keyDown(switchElement, { key: ' ' })

      expect(handleCheckedChange).toHaveBeenCalledWith(true)
    })

    it('应该支持Enter键切换', () => {
      const handleCheckedChange = vi.fn()
      render(<Switch {...defaultProps} onCheckedChange={handleCheckedChange} />)

      const switchElement = screen.getByRole('switch')
      switchElement.focus()

      fireEvent.keyDown(switchElement, { key: 'Enter' })

      expect(handleCheckedChange).toHaveBeenCalledWith(true)
    })
  })

  describe('可访问性', () => {
    it('应该通过无障碍测试', async () => {
      const { container } = render(<Switch label="Test Switch" />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('应该正确设置ARIA属性', () => {
      render(<Switch checked={true} loading={false} />)

      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('aria-checked', 'true')
      expect(switchElement).toHaveAttribute('aria-busy', 'false')
    })

    it('应该正确设置tabIndex', () => {
      render(<Switch {...defaultProps} />)

      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('tabIndex', '0')
    })

    it('应该在disabled状态下设置tabIndex为-1', () => {
      render(<Switch {...defaultProps} disabled />)

      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('tabIndex', '-1')
    })
  })

  describe('ref转发', () => {
    it('应该正确转发ref', () => {
      const ref = vi.fn()
      render(<Switch {...defaultProps} ref={ref} />)

      expect(ref).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'checkbox',
        })
      )
    })
  })

  describe('快照测试', () => {
    it('应该匹配默认快照', () => {
      const { container } = render(<Switch label="Test Switch" />)
      expect(container).toMatchSnapshot()
    })

    it('应该匹配不同变体的快照', () => {
      const variants: SwitchProps['variant'][] = ['default', 'primary', 'success', 'danger', 'outline']

      variants.forEach(variant => {
        const { container } = render(<Switch label={`Switch ${variant}`} variant={variant} />)
        expect(container).toMatchSnapshot(`switch-${variant}`)
      })
    })

    it('应该匹配不同尺寸的快照', () => {
      const sizes: SwitchProps['size'][] = ['sm', 'md', 'lg']

      sizes.forEach(size => {
        const { container } = render(<Switch label={`Switch ${size}`} size={size} />)
        expect(container).toMatchSnapshot(`switch-size-${size}`)
      })
    })

    it('应该匹配加载状态的快照', () => {
      const { container } = render(<Switch label="Loading Switch" loading />)
      expect(container).toMatchSnapshot('switch-loading')
    })

    it('应该匹配带图标的快照', () => {
      const TestIcon = () => <div data-testid="icon">🔥</div>
      const { container } = render(<Switch thumbIcon={<TestIcon />} />)
      expect(container).toMatchSnapshot('switch-with-icon')
    })
  })

  describe('边界情况', () => {
    it('应该处理空的标签和描述', () => {
      render(<Switch label="" description="" />)

      const switchElement = screen.getByRole('switch')
      expect(switchElement).toBeInTheDocument()
    })

    it('应该处理不支持的属性传递', () => {
      render(<Switch {...defaultProps} data-custom="custom-value" />)

      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('data-custom', 'custom-value')
    })

    it('应该处理同时设置checked和defaultChecked', () => {
      render(<Switch {...defaultProps} checked defaultChecked />)

      const switchElement = screen.getByRole('switch')
      expect(switchElement).toBeChecked()
    })
  })
})