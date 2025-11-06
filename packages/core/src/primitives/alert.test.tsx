/**
 * @fileoverview Alert 组件测试
 * @description 验证 Alert 组件的功能特性、变体、状态和可访问性
 *
 * @author Xorigo UI Team
 * @version 1.0.0
 * @since 2025-11-05
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Alert } from './alert'

// =============================================================================
// 工具函数
// =============================================================================

const renderAlert = (props: any = {}) => {
  return render(
    <Alert {...props}>
      {props.children || '这是一个 Alert'}
    </Alert>
  )
}

// =============================================================================
// 基础渲染测试
// =============================================================================

describe('Alert', () => {
  describe('基础渲染', () => {
    it('应该正确渲染默认 Alert', () => {
      renderAlert()
      const alert = screen.getByRole('alert')
      expect(alert).toBeInTheDocument()
      expect(screen.getByText('这是一个 Alert')).toBeInTheDocument()
    })

    it('应该支持自定义 className', () => {
      renderAlert({ className: 'custom-class' })
      const alert = screen.getByRole('alert')
      expect(alert).toHaveClass('custom-class')
    })

    it('应该支持标题和内容', () => {
      renderAlert({
        title: 'Alert 标题',
        children: 'Alert 内容'
      })
      expect(screen.getByText('Alert 标题')).toBeInTheDocument()
      expect(screen.getByText('Alert 内容')).toBeInTheDocument()
    })
  })

  // =============================================================================
  // 变体测试
  // =============================================================================

  describe('变体测试', () => {
    it('应该应用 info 变体', () => {
      renderAlert({ variant: 'info' })
      const alert = screen.getByRole('alert')
      expect(alert).toHaveAttribute('data-variant', 'info')
    })

    it('应该应用 success 变体', () => {
      renderAlert({ variant: 'success' })
      const alert = screen.getByRole('alert')
      expect(alert).toHaveAttribute('data-variant', 'success')
    })

    it('应该应用 warning 变体', () => {
      renderAlert({ variant: 'warning' })
      const alert = screen.getByRole('alert')
      expect(alert).toHaveAttribute('data-variant', 'warning')
    })

    it('应该应用 error 变体', () => {
      renderAlert({ variant: 'error' })
      const alert = screen.getByRole('alert')
      expect(alert).toHaveAttribute('data-variant', 'error')
    })
  })

  // =============================================================================
  // 状态测试
  // =============================================================================

  describe('状态测试', () => {
    it('应该支持可关闭状态', () => {
      const onClose = vi.fn()
      renderAlert({ closable: true, onClose })

      const closeButton = screen.getByRole('button', { name: /关闭/i })
      expect(closeButton).toBeInTheDocument()

      fireEvent.click(closeButton)
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('应该支持可展开状态', () => {
      renderAlert({ expandable: true })
      const alert = screen.getByRole('alert')
      expect(alert).toHaveAttribute('data-expandable', 'true')
    })

    it('应该支持手动控制展开状态', () => {
      const onExpand = vi.fn()
      renderAlert({ expandable: true, expanded: false, onExpand })

      const alert = screen.getByRole('alert')
      expect(alert).toHaveAttribute('data-expanded', 'false')
    })
  })

  // =============================================================================
  // 动作测试
  // =============================================================================

  describe('动作测试', () => {
    it('应该渲染主要动作按钮', () => {
      renderAlert({
        primaryAction: {
          label: '主要动作',
          onClick: vi.fn()
        }
      })

      const primaryButton = screen.getByRole('button', { name: '主要动作' })
      expect(primaryButton).toBeInTheDocument()
    })

    it('应该渲染次要动作按钮', () => {
      renderAlert({
        secondaryAction: {
          label: '次要动作',
          onClick: vi.fn()
        }
      })

      const secondaryButton = screen.getByRole('button', { name: '次要动作' })
      expect(secondaryButton).toBeInTheDocument()
    })

    it('应该处理主要动作点击', () => {
      const handleClick = vi.fn()
      renderAlert({
        primaryAction: {
          label: '主要动作',
          onClick: handleClick
        }
      })

      const primaryButton = screen.getByRole('button', { name: '主要动作' })
      fireEvent.click(primaryButton)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  // =============================================================================
  // 图标测试
  // =============================================================================

  describe('图标测试', () => {
    it('应该显示适当的图标', () => {
      renderAlert({ variant: 'info' })
      const alert = screen.getByRole('alert')
      expect(alert).toHaveAttribute('data-has-icon', 'true')
    })

    it('应该支持自定义图标', () => {
      const CustomIcon = () => <div data-testid="custom-icon">自定义图标</div>
      renderAlert({ icon: <CustomIcon /> })

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
    })
  })

  // =============================================================================
  // 可访问性测试
  // =============================================================================

  describe('可访问性测试', () => {
    it('应该具有 alert role', () => {
      renderAlert()
      const alert = screen.getByRole('alert')
      expect(alert).toBeInTheDocument()
    })

    it('应该支持 aria-label', () => {
      renderAlert({ 'aria-label': '自定义标签' })
      const alert = screen.getByRole('alert')
      expect(alert).toHaveAttribute('aria-label', '自定义标签')
    })

    it('应该支持 aria-live', () => {
      renderAlert({ 'aria-live': 'polite' })
      const alert = screen.getByRole('alert')
      expect(alert).toHaveAttribute('aria-live', 'polite')
    })

    it('可关闭的 Alert 应该支持 aria-controls', () => {
      renderAlert({ closable: true })
      const alert = screen.getByRole('alert')
      expect(alert).toHaveAttribute('aria-controls')
    })
  })

  // =============================================================================
  // 过渡动画测试
  // =============================================================================

  describe('过渡动画测试', () => {
    it('应该应用进入动画', () => {
      renderAlert({ animated: true })
      const alert = screen.getByRole('alert')
      expect(alert).toHaveAttribute('data-animated', 'true')
    })

    it('应该支持自定义动画持续时间', () => {
      renderAlert({ animationDuration: 500 })
      const alert = screen.getByRole('alert')
      expect(alert).toHaveAttribute('data-animation-duration', '500')
    })
  })

  // =============================================================================
  // 样式变体测试
  // =============================================================================

  describe('样式变体测试', () => {
    it('应该支持实心样式', () => {
      renderAlert({ variant: 'solid' })
      const alert = screen.getByRole('alert')
      expect(alert).toHaveAttribute('data-style', 'solid')
    })

    it('应该支持边框样式', () => {
      renderAlert({ variant: 'outline' })
      const alert = screen.getByRole('alert')
      expect(alert).toHaveAttribute('data-style', 'outline')
    })

    it('应该支持轻量样式', () => {
      renderAlert({ variant: 'light' })
      const alert = screen.getByRole('alert')
      expect(alert).toHaveAttribute('data-style', 'light')
    })
  })

  // =============================================================================
  // 位置测试
  // =============================================================================

  describe('位置测试', () => {
    it('应该支持顶部位置', () => {
      renderAlert({ position: 'top' })
      const alert = screen.getByRole('alert')
      expect(alert).toHaveAttribute('data-position', 'top')
    })

    it('应该支持底部位置', () => {
      renderAlert({ position: 'bottom' })
      const alert = screen.getByRole('alert')
      expect(alert).toHaveAttribute('data-position', 'bottom')
    })

    it('应该支持页面级别位置', () => {
      renderAlert({ position: 'page' })
      const alert = screen.getByRole('alert')
      expect(alert).toHaveAttribute('data-position', 'page')
    })
  })

  // =============================================================================
  // 关闭行为测试
  // =============================================================================

  describe('关闭行为测试', () => {
    it('应该支持自动关闭', () => {
      const onCloseAuto = vi.fn()
      renderAlert({ autoClose: true, autoCloseDelay: 3000, onCloseAuto })

      setTimeout(() => {
        expect(onCloseAuto).toHaveBeenCalledTimes(1)
      }, 3100)
    })

    it('应该支持点击外部关闭', () => {
      const onClose = vi.fn()
      renderAlert({ closeOnClickOutside: true, onClose })

      const alert = screen.getByRole('alert')
      fireEvent.mouseDown(alert)

      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  // =============================================================================
  // 进度指示器测试
  // =============================================================================

  describe('进度指示器测试', () => {
    it('应该显示进度条（定时关闭时）', () => {
      renderAlert({
        autoClose: true,
        showProgress: true,
        autoCloseDelay: 3000
      })

      const alert = screen.getByRole('alert')
      expect(alert).toHaveAttribute('data-show-progress', 'true')
    })

    it('应该支持自定义进度条颜色', () => {
      renderAlert({
        autoClose: true,
        showProgress: true,
        progressColor: 'success'
      })

      const alert = screen.getByRole('alert')
      expect(alert).toHaveAttribute('data-progress-color', 'success')
    })
  })

  // =============================================================================
  // 边缘情况测试
  // =============================================================================

  describe('边缘情况测试', () => {
    it('应该处理无子元素的情况', () => {
      renderAlert({ children: '' })
      const alert = screen.getByRole('alert')
      expect(alert).toBeInTheDocument()
    })

    it('应该处理复杂内容', () => {
      renderAlert({
        children: (
          <div>
            <strong>粗体文本</strong>
            <p>段落内容</p>
            <a href="#">链接</a>
          </div>
        )
      })

      expect(screen.getByText('粗体文本')).toBeInTheDocument()
      expect(screen.getByText('段落内容')).toBeInTheDocument()
      expect(screen.getByRole('link')).toBeInTheDocument()
    })

    it('应该支持多个动作按钮', () => {
      renderAlert({
        actions: [
          { label: '动作1', onClick: vi.fn() },
          { label: '动作2', onClick: vi.fn() }
        ]
      })

      expect(screen.getByText('动作1')).toBeInTheDocument()
      expect(screen.getByText('动作2')).toBeInTheDocument()
    })

    it('应该处理组合 props', () => {
      const onClose = vi.fn()
      renderAlert({
        variant: 'error',
        closable: true,
        onClose,
        title: '重要提示',
        primaryAction: {
          label: '确定',
          onClick: vi.fn()
        }
      })

      expect(screen.getByText('重要提示')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '确定' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /关闭/i })).toBeInTheDocument()
    })
  })
})
