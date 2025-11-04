/**
 * @fileoverview FormErrorBanner 组件测试
 * @file FormErrorBanner.test.tsx
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { FormErrorBanner } from './form-error-banner'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

// ==============================
// 测试工具函数
// ==============================

const renderFormErrorBanner = (props: any = {}) => {
  const defaultProps = {
    message: '测试错误消息',
    ...props,
  }
  return render(<FormErrorBanner {...defaultProps} />)
}

// ==============================
// 基础渲染测试
// ==============================

describe('FormErrorBanner - 基础渲染', () => {
  it('应该正确渲染错误消息', () => {
    renderFormErrorBanner({ message: '这是一个测试错误' })
    expect(screen.getByText('这是一个测试错误')).toBeInTheDocument()
  })

  it('应该正确渲染子组件内容', () => {
    render(
      <FormErrorBanner>
        <div data-testid="custom-content">自定义内容</div>
      </FormErrorBanner>
    )
    expect(screen.getByTestId('custom-content')).toBeInTheDocument()
  })

  it('当没有内容时不应该渲染', () => {
    const { container } = render(<FormErrorBanner />)
    expect(container.firstChild).toBeNull()
  })

  it('当 visible 为 false 时不应该渲染', () => {
    const { container } = render(
      <FormErrorBanner message="错误消息" visible={false} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('当 visible 变为 false 时应该隐藏组件', () => {
    const { rerender } = render(<FormErrorBanner message="错误消息" visible={true} />)
    expect(screen.getByText('错误消息')).toBeInTheDocument()

    rerender(<FormErrorBanner message="错误消息" visible={false} />)
    expect(screen.queryByText('错误消息')).not.toBeInTheDocument()
  })

  it('应该应用正确的变体样式', () => {
    const { rerender } = renderFormErrorBanner({ variant: 'warning', message: '警告消息' })
    let banner = screen.getByRole('alert')
    expect(banner).toHaveClass('border-yellow-200', 'bg-yellow-50')

    rerender(<FormErrorBanner variant="info" message="信息消息" />)
    banner = screen.getByRole('alert')
    expect(banner).toHaveClass('border-blue-200', 'bg-blue-50')

    rerender(<FormErrorBanner variant="success" message="成功消息" />)
    banner = screen.getByRole('alert')
    expect(banner).toHaveClass('border-green-200', 'bg-green-50')
  })

  it('应该应用正确的严重程度样式', () => {
    const { rerender } = renderFormErrorBanner({ severity: 'critical', message: '严重错误' })
    let banner = screen.getByRole('alert')
    expect(banner).toHaveClass('border-l-red-600')

    rerender(<FormErrorBanner severity="major" message="主要错误" />)
    banner = screen.getByRole('alert')
    expect(banner).toHaveClass('border-l-yellow-600')

    rerender(<FormErrorBanner severity="minor" message='次要错误' />)
    banner = screen.getByRole('alert')
    expect(banner).toHaveClass('border-l-blue-600')
  })

  it('应该应用正确的尺寸样式', () => {
    const { rerender } = renderFormErrorBanner({ size: 'sm', message: '小尺寸' })
    expect(screen.getByText('小尺寸')).toHaveClass('text-sm')

    rerender(<FormErrorBanner size="lg" message='大尺寸' />)
    expect(screen.getByText('大尺寸')).toHaveClass('text-base')
  })

  it('应该显示正确的图标', () => {
    const { rerender } = renderFormErrorBanner({ showIcon: true, message: '有图标的错误' })
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument()

    rerender(<FormErrorBanner showIcon={false} message: '无图标的错误' />)
    expect(screen.queryByRole('img', { hidden: true })).not.toBeInTheDocument()
  })

  it('应该根据错误类型显示不同的图标', () => {
    const { rerender } = renderFormErrorBanner({ errorType: 'network', message: '网络错误' })
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument()

    rerender(<FormErrorBanner errorType="server" message="服务器错误" />)
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument()
  })
})

// ==============================
// 交互功能测试
// ==============================

describe('FormErrorBanner - 交互功能', () => {
  it('应该在点击关闭按钮时触发 onDismiss', () => {
    const onDismiss = vi.fn()
    renderFormErrorBanner({ dismissible: true, onDismiss, message: '错误消息' })

    fireEvent.click(screen.getByLabelText('关闭'))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('应该在点击重试按钮时触发 onRetry', () => {
    const onRetry = vi.fn()
    renderFormErrorBanner({ onRetry, message: '错误消息' })

    fireEvent.click(screen.getByLabelText('重试'))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('应该在点击自定义操作按钮时触发相应的回调', () => {
    const onAction1 = vi.fn()
    const onAction2 = vi.fn()

    renderFormErrorBanner({
      actions: [
        { text: '操作1', onClick: onAction1 },
        { text: '操作2', onClick: onAction2 },
      ],
      message: '错误消息'
    })

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(3) // 重试、关闭、操作1、操作2 = 4个，但有些可能不可见

    const actionButtons = buttons.filter(btn =>
      btn.textContent === '操作1' || btn.textContent === '操作2'
    )
    expect(actionButtons).toHaveLength(2)

    fireEvent.click(actionButtons[0])
    expect(onAction1).toHaveBeenCalledTimes(1)

    fireEvent.click(actionButtons[1])
    expect(onAction2).toHaveBeenCalledTimes(1)
  })

  it('应该在点击详情按钮时切换展开状态', () => {
    const onExpandedChange = vi.fn()
    renderFormErrorBanner({
      details: '详细错误信息',
      showDetailsToggle: true,
      defaultExpanded: false,
      onExpandedChange,
      message: '错误消息'
    })

    expect(screen.queryByText('详细错误信息')).not.toBeInTheDocument()

    const detailsButton = screen.getByLabelText('显示详情')
    fireEvent.click(detailsButton)

    expect(onExpandedChange).toHaveBeenCalledWith(true)
    expect(screen.getByText('详细错误信息')).toBeInTheDocument()

    const hideButton = screen.getByLabelText('隐藏详情')
    fireEvent.click(hideButton)

    expect(onExpandedChange).toHaveBeenCalledWith(false)
    expect(screen.queryByText('详细错误信息')).not.toBeInTheDocument()
  })

  it('应该在点击复制按钮时复制错误代码', async () => {
    const onCopy = vi.fn()
    renderFormErrorBanner({
      code: 'ERROR_001',
      onCopy,
      message: '错误消息'
    })

    fireEvent.click(screen.getByLabelText('复制错误代码'))

    await waitFor(() => {
      expect(onCopy).toHaveBeenCalledWith('ERROR_001')
      expect(screen.getByText('已复制')).toBeInTheDocument()
    })
  })

  it('应该在复制后显示成功状态', async () => {
    renderFormErrorBanner({
      code: 'ERROR_001',
      message: '错误消息'
    })

    fireEvent.click(screen.getByLabelText('复制错误'))

    expect(screen.getByText('已复制')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('复制错误')).toBeInTheDocument()
    }, { timeout: 2500 })
  })
})

// ==============================
// 自动消失测试
// ==============================

describe('FormErrorBanner - 自动消失', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('应该在达到自动消失延迟时间后自动关闭', () => {
    const onDismiss = vi.fn()
    renderFormErrorBanner({
      message: '自动消失的错误',
      autoDismiss: 3000,
      onDismiss
    })

    expect(screen.getByText('自动消失的错误')).toBeInTheDocument()

    vi.advanceTimersByTime(3000)

    expect(onDismiss).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('自动消失的错误')).not.toBeInTheDocument()
  })

  it('当 autoDismiss 为 0 时不应该自动消失', () => {
    const onDismiss = vi.fn()
    renderFormErrorBanner({
      message: '不自动消失的错误',
      autoDismiss: 0,
      onDismiss
    })

    expect(screen.getByText('不自动消失的错误')).toBeInTheDocument()

    vi.advanceTimersByTime(10000)

    expect(onDismiss).not.toHaveBeenCalled()
  })

  it('当组件被手动关闭时应该清除自动消失定时器', () => {
    const onDismiss = vi.fn()
    const { unmount } = renderFormErrorBanner({
      message: '错误的',
      autoDismiss: 5000,
      onDismiss
    })

    vi.advanceTimersByTime(2000)
    fireEvent.click(screen.getByLabelText('关闭'))

    vi.advanceTimersByTime(5000)

    expect(onDismiss).toHaveBeenCalledTimes(1)

    unmount()
  })
})

// ==============================
// 状态管理测试
// ==============================

describe('FormErrorBanner - 状态管理', () => {
  it('应该在 disabled 状态下禁用所有交互', () => {
    const onDismiss = vi.fn()
    const onRetry = vi.fn()
    const onAction = vi.fn()

    renderFormErrorBanner({
      message: '错误消息',
      disabled: true,
      dismissible: true,
      onDismiss,
      onRetry,
      actions: [{ text: '操作', onClick: onAction }],
      details: '详细信息',
      showDetailsToggle: true
    })

    // 所有按钮都应该被禁用
    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button).toBeDisabled()
    })

    // 点击不应该触发回调
    fireEvent.click(buttons[0])
    expect(onDismiss).not.toHaveBeenCalled()
  })

  it('应该在动作按钮被禁用时应用禁用样式', () => {
    renderFormErrorBanner({
      actions: [
        { text: '正常操作', onClick: vi.fn() },
        { text: '禁用操作', onClick: vi.fn(), disabled: true }
      ],
      message: '错误消息'
    })

    const buttons = screen.getAllByRole('button')
    expect(buttons[0]).not.toHaveClass('opacity-50', 'cursor-not-allowed')
    expect(buttons[1]).toHaveClass('opacity-50', 'cursor-not-allowed')
  })

  it('应该正确显示错误代码', () => {
    renderFormErrorBanner({
      message: '错误消息',
      code: 'ERROR_404'
    })

    expect(screen.getByText('ERROR_404')).toBeInTheDocument()
    expect(screen.getByText('ERROR_404')).toHaveClass('font-mono')
  })

  it('应该正确显示详细错误信息', () => {
    renderFormErrorBanner({
      message: '错误消息',
      details: '详细错误信息',
      defaultExpanded: true
    })

    expect(screen.getByText('详细错误信息')).toBeInTheDocument()
  })

  it('应该正确处理复杂错误信息对象', () => {
    const complexError = {
      message: '服务器错误',
      stack: 'Error: 服务器错误\n    at ...',
      code: 'SERVER_ERROR',
      timestamp: new Date().toISOString()
    }

    renderFormErrorBanner({
      message: complexError.message,
      details: JSON.stringify(complexError, null, 2),
      defaultExpanded: true
    })

    expect(screen.getByText(complexError.message)).toBeInTheDocument()
    expect(screen.getByText('SERVER_ERROR')).toBeInTheDocument()
  })
})

// ==============================
// 可访问性测试
// ==============================

describe('FormErrorBanner - 可访问性', () => {
  it('应该设置正确的 role 属性', () => {
    renderFormErrorBanner({ message: '错误消息' })
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('应该设置正确的 aria-live 属性', () => {
    renderFormErrorBanner({ message: '错误消息' })
    const banner = screen.getByRole('alert')
    expect(banner).toHaveAttribute('aria-live', 'assertive')
  })

  it('应该设置正确的 aria-atomic 属性', () => {
    renderFormErrorBanner({ message: '错误消息' })
    const banner = screen.getByRole('alert')
    expect(banner).toHaveAttribute('aria-atomic', 'true')
  })

  it('应该在详情区域设置正确的 aria 属性', () => {
    renderFormErrorBanner({
      message: '错误消息',
      details: '详细信息',
      defaultExpanded: false
    })

    const toggleButton = screen.getByLabelText('显示详情')
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false')
    expect(toggleButton).toHaveAttribute('aria-controls')
  })

  it('应该在展开详情后更新 aria-expanded', () => {
    renderFormErrorBanner({
      message: '错误消息',
      details: '详细信息',
      defaultExpanded: false
    })

    const toggleButton = screen.getByLabelText('显示详情')
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(toggleButton)

    expect(toggleButton).toHaveAttribute('aria-expanded', 'true')
  })

  it('应该为所有交互元素设置 aria-label', () => {
    renderFormErrorBanner({
      message: '错误消息',
      dismissible: true,
      onRetry: vi.fn(),
      code: 'ERROR_001',
      details: '详细信息',
      showDetailsToggle: true
    })

    expect(screen.getByLabelText('关闭')).toBeInTheDocument()
    expect(screen.getByLabelText('重试')).toBeInTheDocument()
    expect(screen.getByLabelText('复制错误代码')).toBeInTheDocument()
    expect(screen.getByLabelText('显示详情')).toBeInTheDocument()
  })

  it('应该在固定模式下正确应用样式', () => {
    renderFormErrorBanner({
      message: '固定错误',
      fixed: true,
      position: 'top'
    })

    const banner = screen.getByRole('alert')
    expect(banner.closest('div')).toHaveClass('fixed', 'top-0')
  })

  it('应该在固定模式下设置正确的 z-index', () => {
    renderFormErrorBanner({
      message: '固定错误',
      fixed: true,
      zIndex: 100
    })

    const container = bannerContainer()
    expect(container).toHaveStyle({ '--z-index': '100' })
  })
})

// ==============================
// 错误边界测试
// ==============================

describe('FormErrorBanner - 错误处理', () => {
  it('应该在复制失败时记录错误但不崩溃', async () => {
    // 模拟 clipboard API 失败
    const originalClipboard = navigator.clipboard
    // @ts-ignore
    navigator.clipboard = undefined

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    renderFormErrorBanner({
      message: '错误消息',
      code: 'ERROR_001'
    })

    fireEvent.click(screen.getByLabelText('复制错误'))

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled()
    })

    consoleSpy.mockRestore()
    // @ts-ignore
    navigator.clipboard = originalClipboard
  })

  it('应该处理空的消息字符串', () => {
    const { container } = render(<FormErrorBanner message="" details="详细信息" />)
    // 空字符串消息，但仍显示详情
    expect(container.firstChild).toBeInTheDocument()
  })

  it('应该处理 null/undefined 的消息', () => {
    const { container } = render(<FormErrorBanner message={null} />)
    expect(container.firstChild).toBeNull()
  })
})

// ==============================
// 性能测试
// ==============================

describe('FormErrorBanner - 性能', () => {
  it('应该在快速切换时保持响应', () => {
    const { rerender } = render(<FormErrorBanner message="错误1" visible={true} />)

    rerender(<FormErrorBanner message="错误2" visible={true} />)
    expect(screen.getByText('错误2')).toBeInTheDocument()

    rerender(<FormErrorBanner message="错误3" visible={true} />)
    expect(screen.getByText('错误3')).toBeInTheDocument()
  })

  it('应该在多个错误横幅时正确渲染', () => {
    const { rerender } = render(
      <>
        <FormErrorBanner key="1" message="错误1" visible={true} />
        <FormErrorBanner key="2" message="错误2" visible={true} />
      </>
    )

    expect(screen.getByText('错误1')).toBeInTheDocument()
    expect(screen.getByText('错误2')).toBeInTheDocument()
  })
})

// ==============================
// 辅助函数
// ==============================

const bannerContainer = () => {
  return document.querySelector('.fixed.inset-x-0.top-0') as HTMLElement | null
}

// ==============================
// 快照测试
// ==============================

describe('FormErrorBanner - 快照测试', () => {
  it('基础快照', () => {
    const { container } = renderFormErrorBanner({ message: '错误消息' })
    expect(container.firstChild).toMatchSnapshot()
  })

  it('带详细信息的快照', () => {
    const { container } = renderFormErrorBanner({
      message: '错误消息',
      details: '详细信息',
      defaultExpanded: true
    })
    expect(container.firstChild).toMatchSnapshot()
  })

  it('带操作按钮的快照', () => {
    const { container } = renderFormErrorBanner({
      message: '错误消息',
      onRetry: vi.fn(),
      actions: [
        { text: '操作1', onClick: vi.fn() },
        { text: '操作2', onClick: vi.fn() }
      ]
    })
    expect(container.firstChild).toMatchSnapshot()
  })

  it('固定位置的快照', () => {
    const { container } = renderFormErrorBanner({
      message: '固定错误',
      fixed: true,
      position: 'top'
    })
    expect(container.firstChild).toMatchSnapshot()
  })
})
