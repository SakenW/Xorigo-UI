/**
 * Button组件可访问性测试
 * 测试Button组件的ARIA属性、键盘导航和屏幕阅读器支持
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../../ui/Button'
import {
  checkAccessibility,
  expectNoAccessibilityViolations,
  testKeyboardNavigation,
  testAriaLabels,
  componentAxeConfigs
} from '../../utils/accessibility-test'

describe('Button组件可访问性测试', () => {
  const renderButton = (props = {}) => {
    return render(<Button {...props}>测试按钮</Button>)
  }

  test('应该通过基础可访问性检测', async () => {
    const { container } = renderButton()

    await expectNoAccessibilityViolations(container, componentAxeConfigs.button)
  })

  test('应该有正确的ARIA属性', () => {
    renderButton({
      'aria-label': '自定义标签',
      'aria-describedby': 'description-id',
      pressed: false,
      expanded: true
    })

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', '自定义标签')
    expect(button).toHaveAttribute('aria-describedby', 'description-id')
    expect(button).toHaveAttribute('aria-pressed', 'false')
    expect(button).toHaveAttribute('aria-expanded', 'true')
  })

  test('加载状态时应该有aria-busy属性', () => {
    renderButton({ loading: true })

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-busy', 'true')
  })

  test('禁用状态时应该正确处理', () => {
    renderButton({ disabled: true })

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-disabled', 'true')
  })

  test('图标按钮应该有可访问的名称', () => {
    renderButton({
      iconOnly: true,
      'aria-label': '删除图标',
      leftIcon: <span data-testid="icon">×</span>
    })

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', '删除图标')
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  test('Toggle按钮应该正确处理pressed状态', () => {
    const { rerender } = renderButton({ pressed: false })

    let button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-pressed', 'false')

    rerender(<Button pressed={true}>切换按钮</Button>)
    button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-pressed', 'true')
  })

  test('应该支持键盘导航', () => {
    const { container } = renderButton()

    const keyboardResults = testKeyboardNavigation(container)
    expect(keyboardResults.focusableElementCount).toBeGreaterThan(0)
    expect(keyboardResults.hasTabIndexZero).toBe(true)
  })

  test('应该支持Enter和Space键激活', () => {
    const handleClick = jest.fn()
    renderButton({ onClick: handleClick })

    const button = screen.getByRole('button')

    // 测试Enter键
    fireEvent.keyDown(button, { key: 'Enter' })
    fireEvent.keyUp(button, { key: 'Enter' })
    expect(handleClick).toHaveBeenCalledTimes(1)

    // 重置mock
    handleClick.mockClear()

    // 测试Space键
    fireEvent.keyDown(button, { key: ' ' })
    fireEvent.keyUp(button, { key: ' ' })
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('应该有正确的ARIA标签', () => {
    const { container } = renderButton()

    const ariaResults = testAriaLabels(container)
    expect(ariaResults.elementsWithoutAriaLabel).toBe(0)
    expect(ariaResults.missingRequiredAria).not.toContain('button')
  })

  test('不同变体应该保持可访问性', async () => {
    const variants = ['primary', 'secondary', 'danger', 'ghost', 'link']

    for (const variant of variants) {
      const { container } = renderButton({ variant: variant as any })
      await expectNoAccessibilityViolations(container, componentAxeConfigs.button)
    }
  })

  test('不同尺寸应该保持可访问性', async () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']

    for (const size of sizes) {
      const { container } = renderButton({ size: size as any })
      await expectNoAccessibilityViolations(container, componentAxeConfigs.button)
    }
  })

  test('加载状态应该保持可访问性', async () => {
    const { container } = renderButton({
      loading: true,
      loadingText: '加载中...'
    })

    await expectNoAccessibilityViolations(container, componentAxeConfigs.button)

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(button.textContent).toContain('加载中...')
  })

  test('应该正确处理焦点管理', () => {
    const { container } = renderButton()

    const button = screen.getByRole('button')

    // 测试获取焦点
    button.focus()
    expect(button).toHaveFocus()

    // 测试失去焦点
    button.blur()
    expect(button).not.toHaveFocus()
  })

  test('应该支持Tab键导航', () => {
    const { container } = renderButton()

    // 创建一个可聚焦的元素用于测试Tab顺序
    const input = document.createElement('input')
    container.appendChild(input)

    const button = screen.getByRole('button')

    // 模拟Tab键导航
    button.focus()
    expect(button).toHaveFocus()

    fireEvent.keyDown(document.activeElement!, { key: 'Tab' })
    // 焦点应该移动到下一个元素
  })

  test('完整的可访问性检测报告', async () => {
    const { container } = renderButton({
      'aria-label': '测试按钮',
      loading: false,
      disabled: false
    })

    const results = await checkAccessibility(container, componentAxeConfigs.button)

    // 验证没有违规
    expect(results.violations).toHaveLength(0)
    expect(results.passes).toBeGreaterThan(0)
  })
})