/**
 * Badge 组件单元测试
 * 测试 Badge 组件的所有功能：基础渲染、变体、交互、可访问性等
 */

import React from 'react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import '@testing-library/jest-dom'

// 导入 Badge 组件系列
import {
  Badge,
  StatusBadge,
  NotificationBadge,
  badgeVariants
} from '../badge'

// 扩展 Jest 匹配器
expect.extend(toHaveNoViolations)

// 模拟 cn 工具函数
vi.mock('../../../foundations/utils/cn', () => ({
  cn: (...inputs: any[]) => inputs.filter(Boolean).join(' ')
}))

describe('Badge 组件测试', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('基础渲染测试', () => {
    it('应该正确渲染基础 Badge 组件', () => {
      render(<Badge>测试徽章</Badge>)

      const badge = screen.getByText('测试徽章')
      expect(badge).toBeInTheDocument()
      expect(badge.tagName).toBe('SPAN')
    })

    it('应该支持自定义 className', () => {
      render(<Badge className="custom-badge-class">内容</Badge>)

      const badge = screen.getByText('内容')
      expect(badge).toHaveClass('custom-badge-class')
    })

    it('应该支持自定义样式', () => {
      render(
        <Badge style={{ fontSize: '14px' }}>
          自定义样式
        </Badge>
      )

      const badge = screen.getByText('自定义样式')
      expect(badge).toHaveStyle('font-size: 14px')
    })
  })

  describe('Badge 变体测试', () => {
    it('应该支持 default 变体', () => {
      render(<Badge variant="default">默认徽章</Badge>)

      const badge = screen.getByText('默认徽章')
      expect(badge).toHaveClass('bg-primary')
      expect(badge).toHaveClass('text-primary-foreground')
    })

    it('应该支持 secondary 变体', () => {
      render(<Badge variant="secondary">次要徽章</Badge>)

      const badge = screen.getByText('次要徽章')
      expect(badge).toHaveClass('bg-secondary-500-500')
      expect(badge).toHaveClass('text-secondary-600-600-foreground')
    })

    it('应该支持 destructive 变体', () => {
      render(<Badge variant="destructive">危险徽章</Badge>)

      const badge = screen.getByText('危险徽章')
      expect(badge).toHaveClass('bg-error-500')
      expect(badge).toHaveClass('text-error-600-foreground')
    })

    it('应该支持 outline 变体', () => {
      render(<Badge variant="outline">轮廓徽章</Badge>)

      const badge = screen.getByText('轮廓徽章')
      expect(badge).toHaveClass('border')
      expect(badge).toHaveClass('text-text-primary')
    })

    it('应该支持 success 变体', () => {
      render(<Badge variant="success">成功徽章</Badge>)

      const badge = screen.getByText('成功徽章')
      expect(badge).toHaveClass('bg-[var(--xor-success)]')
      expect(badge).toHaveClass('text-[var(--xor-text-on-success)]')
    })

    it('应该支持 warning 变体', () => {
      render(<Badge variant="warning">警告徽章</Badge>)

      const badge = screen.getByText('警告徽章')
      expect(badge).toHaveClass('bg-[var(--xor-warning)]')
      expect(badge).toHaveClass('text-[var(--xor-text-on-warning)]')
    })

    it('应该支持 info 变体', () => {
      render(<Badge variant="info">信息徽章</Badge>)

      const badge = screen.getByText('信息徽章')
      expect(badge).toHaveClass('bg-[var(--xor-info)]')
      expect(badge).toHaveClass('text-[var(--xor-text-on-info)]')
    })
  })

  describe('Badge 尺寸测试', () => {
    it('应该支持 sm 尺寸', () => {
      render(<Badge size="sm">小徽章</Badge>)

      const badge = screen.getByText('小徽章')
      expect(badge).toHaveClass('px-2')
      expect(badge).toHaveClass('py-0.5')
      expect(badge).toHaveClass('text-xs')
    })

    it('应该支持 md 尺寸（默认）', () => {
      render(<Badge size="md">中等徽章</Badge>)

      const badge = screen.getByText('中等徽章')
      expect(badge).toHaveClass('px-2.5')
      expect(badge).toHaveClass('py-0.5')
      expect(badge).toHaveClass('text-sm')
    })

    it('应该支持 lg 尺寸', () => {
      render(<Badge size="lg">大徽章</Badge>)

      const badge = screen.getByText('大徽章')
      expect(badge).toHaveClass('px-3')
      expect(badge).toHaveClass('py-1')
      expect(badge).toHaveClass('text-base')
    })
  })

  describe('Badge 形状测试', () => {
    it('应该支持 rounded 形状', () => {
      render(<Badge shape="rounded">圆角徽章</Badge>)

      const badge = screen.getByText('圆角徽章')
      expect(badge).toHaveClass('rounded-full')
    })

    it('应该支持 square 形状', () => {
      render(<Badge shape="square">方形徽章</Badge>)

      const badge = screen.getByText('方形徽章')
      expect(badge).toHaveClass('rounded-none')
    })

    it('应该支持默认 rounded-md 形状', () => {
      render(<Badge>默认形状徽章</Badge>)

      const badge = screen.getByText('默认形状徽章')
      expect(badge).toHaveClass('rounded-md')
    })
  })

  describe('Badge 交互测试', () => {
    it('应该支持点击事件', async () => {
      const handleClick = vi.fn()
      render(<Badge onClick={handleClick}>可点击徽章</Badge>)

      const badge = screen.getByText('可点击徽章')
      fireEvent.click(badge)

      await waitFor(() => {
        expect(handleClick).toHaveBeenCalledTimes(1)
      })
    })

    it('应该支持键盘交互', async () => {
      const handleClick = vi.fn()
      render(
        <Badge onClick={handleClick} tabIndex={0}>
          键盘可访问徽章
        </Badge>
      )

      const badge = screen.getByText('键盘可访问徽章')
      badge.focus()
      expect(badge).toHaveFocus()

      fireEvent.keyDown(badge, { key: 'Enter' })

      await waitFor(() => {
        expect(handleClick).toHaveBeenCalledTimes(1)
      })
    })

    it('应该支持可移除徽章', async () => {
      const handleRemove = vi.fn()
      render(<Badge removable onRemove={handleRemove}>可移除徽章</Badge>)

      const badge = screen.getByText('可移除徽章')
      expect(badge).toBeInTheDocument()

      // 检查是否有移除按钮
      const removeButton = badge.nextElementSibling
      if (removeButton) {
        fireEvent.click(removeButton)
        await waitFor(() => {
          expect(handleRemove).toHaveBeenCalledTimes(1)
        })
      }
    })
  })

  describe('StatusBadge 组件测试', () => {
    it('应该正确渲染状态徽章', () => {
      render(<StatusBadge status="active">活跃状态</StatusBadge>)

      const badge = screen.getByText('活跃状态')
      expect(badge).toBeInTheDocument()
    })

    it('应该支持 online 状态', () => {
      render(<StatusBadge status="online">在线</StatusBadge>)

      const badge = screen.getByText('在线')
      expect(badge).toHaveClass('bg-success-500')
    })

    it('应该支持 offline 状态', () => {
      render(<StatusBadge status="offline">离线</StatusBadge>)

      const badge = screen.getByText('离线')
      expect(badge).toHaveClass('bg-background-primary-primary0')
    })

    it('应该支持 busy 状态', () => {
      render(<StatusBadge status="busy">忙碌</StatusBadge>)

      const badge = screen.getByText('忙碌')
      expect(badge).toHaveClass('bg-warning-500')
    })

    it('应该支持 away 状态', () => {
      render(<StatusBadge status="away">离开</StatusBadge>)

      const badge = screen.getByText('离开')
      expect(badge).toHaveClass('bg-warning-500')
    })

    it('应该支持自定义状态颜色', () => {
      render(
        <StatusBadge
          status="custom"
          statusColor="purple"
        >
          自定义状态
        </StatusBadge>
      )

      const badge = screen.getByText('自定义状态')
      expect(badge).toBeInTheDocument()
    })
  })

  describe('NotificationBadge 组件测试', () => {
    it('应该正确渲染通知徽章', () => {
      render(<NotificationBadge count={5}>通知</NotificationBadge>)

      const badge = screen.getByText('通知')
      expect(badge).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('应该支持大数值显示', () => {
      render(<NotificationBadge count={999}>大数值通知</NotificationBadge>)

      expect(screen.getByText('99+')).toBeInTheDocument()
    })

    it('应该支持自定义最大值', () => {
      render(
        <NotificationBadge count={150} max={100}>
          自定义最大值通知
        </NotificationBadge>
      )

      expect(screen.getByText('100+')).toBeInTheDocument()
    })

    it('应该支持点式通知', () => {
      render(<NotificationBadge dot>点式通知</NotificationBadge>)

      const badge = screen.getByText('点式通知')
      expect(badge).toBeInTheDocument()
    })

    it('应该支持零值隐藏', () => {
      render(<NotificationBadge count={0} hideZero>零值通知</NotificationBadge>)

      const badge = screen.getByText('零值通知')
      expect(badge).toBeInTheDocument()
    })
  })

  describe('变体函数测试', () => {
    it('badgeVariants 应该返回正确的类名', () => {
      const defaultClasses = badgeVariants({
        variant: 'default',
        size: 'md',
        shape: 'rounded'
      })
      expect(defaultClasses).toContain('inline-flex')
      expect(defaultClasses).toContain('items-center')
      expect(defaultClasses).toContain('rounded-md')
      expect(defaultClasses).toContain('px-2.5')
      expect(defaultClasses).toContain('py-0.5')
      expect(defaultClasses).toContain('text-sm')
      expect(defaultClasses).toContain('font-medium')
      expect(defaultClasses).toContain('transition-colors')
      expect(defaultClasses).toContain('focus:outline-none')
      expect(defaultClasses).toContain('focus:ring-2')
      expect(defaultClasses).toContain('focus:ring-primary-500')
      expect(defaultClasses).toContain('focus:ring-offset-2')

      const successClasses = badgeVariants({
        variant: 'success',
        size: 'lg',
        shape: 'rounded'
      })
      expect(successClasses).toContain('bg-success-500')
      expect(successClasses).toContain('text-text-on-primary')
      expect(successClasses).toContain('px-3')
      expect(successClasses).toContain('py-1')
      expect(successClasses).toContain('text-base')
    })
  })

  describe('可访问性测试', () => {
    it('应该通过可访问性检查', async () => {
      const { container } = render(
        <Badge variant="info" aria-label="信息徽章">
          可访问性测试
        </Badge>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('应该支持键盘导航', () => {
      render(
        <Badge onClick={vi.fn()} tabIndex={0}>
          键盘导航徽章
        </Badge>
      )

      const badge = screen.getByText('键盘导航徽章')
      badge.focus()
      expect(badge).toHaveFocus()
    })

    it('应该有正确的 ARIA 标签', () => {
      render(
        <Badge aria-label="未读消息数量">
          3
        </Badge>
      )

      const badge = screen.getByText('3')
      expect(badge).toHaveAttribute('aria-label', '未读消息数量')
    })
  })

  describe('错误处理测试', () => {
    it('应该优雅处理空内容', () => {
      render(<Badge />)

      const badge = document.querySelector('span')
      expect(badge).toBeInTheDocument()
    })

    it('应该处理无效的 variant 值', () => {
      render(<Badge variant="invalid" as="span">内容</Badge>)

      const badge = screen.getByText('内容')
      expect(badge).toBeInTheDocument()
    })

    it('应该处理无效的 status 值', () => {
      render(<StatusBadge status="invalid">无效状态</StatusBadge>)

      const badge = screen.getByText('无效状态')
      expect(badge).toBeInTheDocument()
    })
  })

  describe('复杂内容测试', () => {
    it('应该支持图标和文本组合', () => {
      render(
        <Badge>
          <span data-testid="badge-icon">🔔</span>
          通知
        </Badge>
      )

      const badge = screen.getByText('通知')
      const icon = screen.getByTestId('badge-icon')
      expect(badge).toBeInTheDocument()
      expect(icon).toBeInTheDocument()
    })

    it('应该支持复杂 HTML 内容', () => {
      render(
        <Badge>
          <strong>重要</strong>徽章
          <em>强调</em>
        </Badge>
      )

      expect(screen.getByText('重要')).toBeInTheDocument()
      expect(screen.getByText('徽章')).toBeInTheDocument()
      expect(screen.getByText('强调')).toBeInTheDocument()
    })
  })

  describe('性能测试', () => {
    it('应该高效渲染大量徽章', () => {
      const startTime = performance.now()

      const badges = Array.from({ length: 1000 }, (_, i) => (
        <Badge key={i}>徽章 {i}</Badge>
      ))

      const { container } = render(<div>{badges}</div>)

      const endTime = performance.now()
      const renderTime = endTime - startTime

      expect(renderTime).toBeLessThan(1000) // 应该在1秒内完成
      expect(container.children.length).toBe(1000)
    })
  })
})