/**
 * Input组件可访问性测试
 * 测试Input组件的表单标签、错误处理和键盘导航
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '../../inputs/Input'
import {
  checkAccessibility,
  expectNoAccessibilityViolations,
  testKeyboardNavigation,
  testAriaLabels,
  componentAxeConfigs
} from '../../utils/accessibility-test'

describe('Input组件可访问性测试', () => {
  const renderInput = (props = {}) => {
    return render(<Input {...props} />)
  }

  test('应该通过基础可访问性检测', async () => {
    const { container } = renderInput({
      label: '测试输入框',
      id: 'test-input'
    })

    await expectNoAccessibilityViolations(container, componentAxeConfigs.input)
  })

  test('应该有正确的表单标签关联', () => {
    renderInput({
      label: '用户名',
      id: 'username'
    })

    const input = screen.getByRole('textbox')
    const label = screen.getByLabelText('用户名')

    expect(input).toHaveAttribute('id', 'username')
    expect(label).toBeInTheDocument()
    expect(input).toHaveAttribute('aria-labelledby')
  })

  test('浮动标签应该正确工作', () => {
    renderInput({
      label: '邮箱地址',
      floatingLabel: true,
      id: 'email'
    })

    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()

    // 测试标签的动态行为
    input.focus()
    expect(input).toHaveFocus()

    fireEvent.change(input, { target: { value: 'test@example.com' } })
    expect(input).toHaveValue('test@example.com')
  })

  test('错误状态应该有正确的ARIA属性', () => {
    renderInput({
      label: '密码',
      error: '密码长度至少为8个字符',
      id: 'password'
    })

    const input = screen.getByRole('textbox')
    const errorMessage = screen.getByText('密码长度至少为8个字符')

    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAttribute('aria-describedby')
    expect(errorMessage).toBeInTheDocument()
  })

  test('必填字段应该有正确的ARIA属性', () => {
    renderInput({
      label: '手机号',
      required: true,
      id: 'phone'
    })

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('aria-required', 'true')
  })

  test('帮助文本应该正确关联', () => {
    renderInput({
      label: '地址',
      helperText: '请输入详细地址',
      id: 'address'
    })

    const input = screen.getByRole('textbox')
    const helperText = screen.getByText('请输入详细地址')

    expect(input).toHaveAttribute('aria-describedby')
    expect(helperText).toBeInTheDocument()
  })

  test('密码显示切换应该有正确的ARIA标签', () => {
    renderInput({
      label: '密码',
      type: 'password',
      showPasswordToggle: true,
      id: 'password-input'
    })

    const toggleButton = screen.getByRole('button', { name: /显示密码|隐藏密码/ })
    expect(toggleButton).toBeInTheDocument()
    expect(toggleButton).toHaveAttribute('aria-label')
  })

  test('清除按钮应该有正确的可访问性标签', () => {
    renderInput({
      label: '搜索',
      clearable: true,
      defaultValue: 'test content',
      id: 'search'
    })

    const clearButton = screen.getByRole('button', { name: '清除' })
    expect(clearButton).toBeInTheDocument()
    expect(clearButton).toHaveAttribute('aria-label', '清除')
  })

  test('字符计数应该可访问', () => {
    renderInput({
      label: '简介',
      maxLength: 100,
      showCharCount: true,
      defaultValue: '测试内容',
      id: 'bio'
    })

    const charCount = screen.getByText(/\d+\/100/)
    expect(charCount).toBeInTheDocument()

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('maxlength', '100')
  })

  test('应该支持完整的键盘导航', () => {
    const { container } = renderInput({
      label: '测试输入',
      id: 'keyboard-test'
    })

    const keyboardResults = testKeyboardNavigation(container)
    expect(keyboardResults.focusableElementCount).toBeGreaterThan(0)
  })

  test('应该正确处理键盘输入', async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()

    renderInput({
      label: '输入测试',
      onChange,
      id: 'input-test'
    })

    const input = screen.getByRole('textbox')

    await user.type(input, 'Hello World')
    expect(input).toHaveValue('Hello World')
    expect(onChange).toHaveBeenCalled()
  })

  test('禁用状态应该正确处理', () => {
    renderInput({
      label: '禁用输入',
      disabled: true,
      id: 'disabled-input'
    })

    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
    expect(input).toHaveAttribute('aria-disabled', 'true')
  })

  test('不同变体应该保持可访问性', async () => {
    const variants = ['default', 'filled', 'outlined', 'underlined', 'ghost', 'neon']

    for (const variant of variants) {
      const { container } = renderInput({
        label: '测试输入',
        variant: variant as any,
        id: `input-${variant}`
      })

      await expectNoAccessibilityViolations(container, componentAxeConfigs.input)
    }
  })

  test('不同尺寸应该保持可访问性', async () => {
    const sizes = ['sm', 'md', 'lg']

    for (const size of sizes) {
      const { container } = renderInput({
        label: '测试输入',
        size: size as any,
        id: `input-${size}`
      })

      await expectNoAccessibilityViolations(container, componentAxeConfigs.input)
    }
  })

  test('表单验证状态应该正确反映', () => {
    renderInput({
      label: '验证测试',
      validationState: 'error',
      error: '输入有误',
      id: 'validation-test'
    })

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('aria-invalid', 'true')

    // 测试成功状态
    const { rerender } = renderInput({
      label: '验证测试',
      validationState: 'success',
      id: 'validation-test'
    })

    const successInput = screen.getByRole('textbox')
    expect(successInput).not.toHaveAttribute('aria-invalid')
  })

  test('应该有正确的ARIA标签', () => {
    const { container } = renderInput({
      label: '测试标签',
      id: 'aria-test'
    })

    const ariaResults = testAriaLabels(container)
    expect(ariaResults.elementsWithoutAriaLabel).toBe(0)
  })

  test('复合输入框应该可访问', async () => {
    const { container } = renderInput({
      label: '金额',
      prefix: '¥',
      suffix: '元',
      leftIcon: <span data-testid="currency-icon">¥</span>,
      id: 'amount'
    })

    await expectNoAccessibilityViolations(container, componentAxeConfigs.input)

    const input = screen.getByRole('textbox')
    const icon = screen.getByTestId('currency-icon')
    expect(icon).toBeInTheDocument()
    expect(input).toHaveValue('')
  })

  test('完整的可访问性检测', async () => {
    const { container } = renderInput({
      label: '完整测试',
      helperText: '这是一个帮助文本',
      required: true,
      id: 'complete-test'
    })

    const results = await checkAccessibility(container, componentAxeConfigs.input)

    // 验证没有违规
    expect(results.violations).toHaveLength(0)
    expect(results.passes).toBeGreaterThan(0)

    // 验证特定的可访问性属性
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('aria-required', 'true')
    expect(input).toHaveAttribute('aria-describedby')
  })
})