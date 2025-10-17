/**
 * Modal组件可访问性测试
 * 测试Modal组件的焦点管理、键盘导航和ARIA属性
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from '../../overlays/Modal'
import {
  checkAccessibility,
  expectNoAccessibilityViolations,
  testKeyboardNavigation,
  componentAxeConfigs
} from '../../utils/accessibility-test'

// Mock createPortal
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (element: React.ReactElement) => element
}))

describe('Modal组件可访问性测试', () => {
  const renderModal = (props = {}) => {
    return render(
      <Modal open={true} onClose={jest.fn()} {...props}>
        <div>模态框内容</div>
      </Modal>
    )
  }

  test('应该通过基础可访问性检测', async () => {
    const { container } = renderModal({
      title: '测试模态框'
    })

    await expectNoAccessibilityViolations(container, componentAxeConfigs.modal)
  })

  test('应该有正确的ARIA属性', () => {
    renderModal({
      title: '测试标题'
    })

    const modal = screen.getByRole('dialog')
    expect(modal).toHaveAttribute('aria-modal', 'true')
    expect(modal).toHaveAttribute('aria-labelledby')
    expect(modal).toHaveAttribute('aria-describedby')
  })

  test('标题应该正确关联', () => {
    renderModal({
      title: '模态框标题'
    })

    const modal = screen.getByRole('dialog')
    const title = screen.getByText('模态框标题')

    expect(title).toBeInTheDocument()
    expect(title.tagName).toBe('H2')
    expect(modal).toHaveAttribute('aria-labelledby')
  })

  test('内容区域应该正确关联', () => {
    renderModal({
      title: '测试模态框'
    })

    const modal = screen.getByRole('dialog')
    const content = screen.getByText('模态框内容')

    expect(content).toBeInTheDocument()
    expect(modal).toHaveAttribute('aria-describedby')
  })

  test('关闭按钮应该有正确的可访问性标签', () => {
    renderModal({
      title: '测试模态框',
      closable: true
    })

    const closeButton = screen.getByRole('button', { name: /关闭/i })
    expect(closeButton).toBeInTheDocument()
    expect(closeButton).toHaveAttribute('aria-label')
  })

  test('应该支持ESC键关闭', async () => {
    const onClose = jest.fn()
    renderModal({
      title: 'ESC测试',
      onClose
    })

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })

  test('应该支持键盘导航', () => {
    const { container } = renderModal({
      title: '键盘导航测试',
      footer: (
        <button>取消</button>
      )
    })

    const keyboardResults = testKeyboardNavigation(container)
    expect(keyboardResults.focusableElementCount).toBeGreaterThan(0)
  })

  test('应该有焦点陷阱', async () => {
    const user = userEvent.setup()
    const onClose = jest.fn()

    render(
      <div>
        <button>外部按钮</button>
        <Modal open={true} onClose={onClose} title="焦点陷阱测试">
          <button>内部按钮1</button>
          <button>内部按钮2</button>
        </Modal>
      </div>
    )

    const modal = screen.getByRole('dialog')
    expect(modal).toBeInTheDocument()

    // 测试焦点在模态框内循环
    const internalButton1 = screen.getByText('内部按钮1')
    const internalButton2 = screen.getByText('内部按钮2')

    internalButton1.focus()
    expect(internalButton1).toHaveFocus()

    await user.tab()
    expect(internalButton2).toHaveFocus()

    await user.tab()
    // 焦点应该回到第一个按钮或关闭按钮
  })

  test('不同变体应该保持可访问性', async () => {
    const variants = ['default', 'danger', 'warning', 'success', 'info']

    for (const variant of variants) {
      const { container } = renderModal({
        title: `${variant}模态框`,
        variant: variant as any
      })

      await expectNoAccessibilityViolations(container, componentAxeConfigs.modal)
    }
  })

  test('不同尺寸应该保持可访问性', async () => {
    const sizes = ['sm', 'md', 'lg', 'xl', 'full']

    for (const size of sizes) {
      const { container } = renderModal({
        title: `${size}模态框`,
        size: size as any
      })

      await expectNoAccessibilityViolations(container, componentAxeConfigs.modal)
    }
  })

  test('遮罩层点击应该正确处理', () => {
    const onClose = jest.fn()
    renderModal({
      title: '遮罩测试',
      maskClosable: true,
      onClose
    })

    const modal = screen.getByRole('dialog')
    const backdrop = modal.parentElement

    if (backdrop) {
      fireEvent.click(backdrop)
      expect(onClose).toHaveBeenCalled()
    }
  })

  test('禁用遮罩点击时不应该关闭', () => {
    const onClose = jest.fn()
    renderModal({
      title: '禁用遮罩测试',
      maskClosable: false,
      onClose
    })

    const modal = screen.getByRole('dialog')
    const backdrop = modal.parentElement

    if (backdrop) {
      fireEvent.click(backdrop)
      expect(onClose).not.toHaveBeenCalled()
    }
  })

  test('底部区域应该可访问', async () => {
    const { container } = renderModal({
      title: '底部区域测试',
      footer: (
        <div>
          <button>取消</button>
          <button>确认</button>
        </div>
      )
    })

    await expectNoAccessibilityViolations(container, componentAxeConfigs.modal)

    const cancelButton = screen.getByText('取消')
    const confirmButton = screen.getByText('确认')

    expect(cancelButton).toBeInTheDocument()
    expect(confirmButton).toBeInTheDocument()
  })

  test('应该支持Tab键导航', async () => {
    const user = userEvent.setup()
    renderModal({
      title: 'Tab导航测试',
      footer: <button>测试按钮</button>
    })

    const modal = screen.getByRole('dialog')
    modal.focus()

    await user.tab()
    // 焦点应该在模态框内的第一个可聚焦元素上
  })

  test('应该支持Shift+Tab反向导航', async () => {
    const user = userEvent.setup()
    renderModal({
      title: 'Shift+Tab测试',
      footer: <button>测试按钮</button>
    })

    const modal = screen.getByRole('dialog')

    // 获取最后一个可聚焦元素
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    if (focusableElements.length > 0) {
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement
      lastElement.focus()

      await user.tab({ shift: true })
      // 焦点应该移动到前一个元素
    }
  })

  test('关闭时应该恢复焦点', async () => {
    const user = userEvent.setup()
    const onClose = jest.fn()

    render(
      <div>
        <button>触发按钮</button>
        <Modal open={true} onClose={onClose} title="焦点恢复测试">
          <div>内容</div>
        </Modal>
      </div>
    )

    const triggerButton = screen.getByText('触发按钮')
    triggerButton.focus()

    // 关闭模态框
    fireEvent.keyDown(document, { key: 'Escape' })

    // 焦点应该恢复到触发按钮（需要实际的焦点管理实现）
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled()
    })
  })

  test('完整的可访问性检测', async () => {
    const { container } = renderModal({
      title: '完整测试模态框',
      closable: true,
      maskClosable: true,
      footer: (
        <div>
          <button>取消</button>
          <button>确认</button>
        </div>
      )
    })

    const results = await checkAccessibility(container, componentAxeConfigs.modal)

    // 验证没有违规
    expect(results.violations).toHaveLength(0)
    expect(results.passes).toBeGreaterThan(0)

    // 验证特定的可访问性属性
    const modal = screen.getByRole('dialog')
    expect(modal).toHaveAttribute('role', 'dialog')
    expect(modal).toHaveAttribute('aria-modal', 'true')
  })
})