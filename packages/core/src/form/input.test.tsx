import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from './input'

describe('Input', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    // 清理 DOM
    document.body.innerHTML = ''
  })

  describe('基础渲染', () => {
    it('应该正确渲染默认输入框', () => {
      render(<Input placeholder="请输入内容" />)

      const input = screen.getByPlaceholderText('请输入内容')
      expect(input).toBeInTheDocument()
    })

    it('应该支持受控模式', () => {
      const handleChange = vi.fn()
      render(<Input value="test value" onChange={handleChange} />)

      const input = screen.getByDisplayValue('test value')
      expect(input).toBeInTheDocument()
      expect(input).toHaveValue('test value')
    })

    it('应该支持非受控模式', () => {
      render(<Input defaultValue="default value" />)

      const input = screen.getByDisplayValue('default value')
      expect(input).toBeInTheDocument()
    })

    it('应该正确设置 type 属性', () => {
      render(<Input type="email" />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'email')
    })
  })

  describe('标签和帮助文本', () => {
    it('应该显示标签', () => {
      render(<Input label="用户名" />)

      const label = screen.getByText('用户名')
      expect(label).toBeInTheDocument()
      expect(label.tagName).toBe('LABEL')
    })

    it('应该显示必填标记', () => {
      render(<Input label="邮箱" required />)

      const asterisk = screen.getByText('*')
      expect(asterisk).toBeInTheDocument()
    })

    it('应该显示帮助文本', () => {
      render(<Input helperText="请输入有效的邮箱地址" />)

      const helperText = screen.getByText('请输入有效的邮箱地址')
      expect(helperText).toBeInTheDocument()
      expect(helperText).toHaveClass('text-sm')
    })

    it('应该显示错误信息', () => {
      render(<Input error="邮箱格式不正确" />)

      const errorText = screen.getByText('邮箱格式不正确')
      expect(errorText).toBeInTheDocument()
      expect(errorText).toHaveClass('text-[var(--text-error)]')
    })

    it('错误信息应该优先于帮助文本', () => {
      render(<Input error="邮箱格式不正确" helperText="请输入有效的邮箱地址" />)

      const errorText = screen.getByText('邮箱格式不正确')
      const helperText = screen.queryByText('请输入有效的邮箱地址')

      expect(errorText).toBeInTheDocument()
      expect(helperText).not.toBeInTheDocument()
    })
  })

  describe('状态变化', () => {
    it('应该处理焦点状态', async () => {
      render(<Input />)

      const input = screen.getByRole('textbox')

      expect(input).not.toHaveFocus()

      await user.click(input)
      expect(input).toHaveFocus()
    })

    it('应该调用 onFocus 回调', async () => {
      const handleFocus = vi.fn()
      render(<Input onFocus={handleFocus} />)

      const input = screen.getByRole('textbox')
      await user.click(input)

      expect(handleFocus).toHaveBeenCalledTimes(1)
    })

    it('应该调用 onBlur 回调', async () => {
      const handleBlur = vi.fn()
      render(<Input onBlur={handleBlur} />)

      const input = screen.getByRole('textbox')
      await user.click(input)
      await user.tab() // 移出焦点

      expect(handleBlur).toHaveBeenCalledTimes(1)
    })

    it('应该调用 onChange 回调', async () => {
      const handleChange = vi.fn()
      render(<Input onChange={handleChange} />)

      const input = screen.getByRole('textbox')
      await user.type(input, 'hello')

      expect(handleChange).toHaveBeenCalledTimes(5) // 每个字符一次
    })

    it('应该处理禁用状态', () => {
      render(<Input disabled />)

      const input = screen.getByRole('textbox')
      expect(input).toBeDisabled()
      expect(input).toHaveClass('disabled:cursor-not-allowed')
    })
  })

  describe('变体样式', () => {
    const variants = ['default', 'filled', 'outlined', 'underlined', 'ghost'] as const

    variants.forEach(variant => {
      it(`应该应用 ${variant} 变体样式`, () => {
        render(<Input variant={variant} data-testid={`input-${variant}`} />)

        const input = screen.getByTestId(`input-${variant}`)
        expect(input).toBeInTheDocument()
      })
    })
  })

  describe('尺寸变化', () => {
    const sizes = ['sm', 'md', 'lg'] as const

    sizes.forEach(size => {
      it(`应该应用 ${size} 尺寸样式`, () => {
        render(<Input size={size} data-testid={`input-${size}`} />)

        const input = screen.getByTestId(`input-${size}`)
        expect(input).toBeInTheDocument()
      })
    })
  })

  describe('清除功能', () => {
    it('应该显示清除按钮', async () => {
      render(<Input clearable defaultValue="test" />)

      // 等待清除按钮出现
      await waitFor(() => {
        const clearButton = screen.getByLabelText('清除')
        expect(clearButton).toBeInTheDocument()
      })
    })

    it('应该点击清除按钮清空内容', async () => {
      const handleChange = vi.fn()
      render(<Input clearable value="test" onChange={handleChange} />)

      const clearButton = screen.getByLabelText('清除')
      await user.click(clearButton)

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({ value: '' })
        })
      )
    })

    it('禁用状态下不应显示清除按钮', () => {
      render(<Input clearable defaultValue="test" disabled />)

      const clearButton = screen.queryByLabelText('清除')
      expect(clearButton).not.toBeInTheDocument()
    })

    it('无内容时不应显示清除按钮', () => {
      render(<Input clearable />)

      const clearButton = screen.queryByLabelText('清除')
      expect(clearButton).not.toBeInTheDocument()
    })
  })

  describe('字符计数', () => {
    it('应该显示字符计数', () => {
      render(<Input showCharCount maxLength={10} defaultValue="hello" />)

      const charCount = screen.getByText('5/10')
      expect(charCount).toBeInTheDocument()
    })

    it('应该在高亮超限字符', () => {
      render(<Input showCharCount maxLength={5} defaultValue="toolong" />)

      const charCount = screen.getByText('7/5')
      expect(charCount).toBeInTheDocument()
      expect(charCount).toHaveClass('text-[var(--text-error)]')
    })
  })

  describe('键盘交互', () => {
    it('应该支持键盘输入', async () => {
      const handleChange = vi.fn()
      render(<Input onChange={handleChange} />)

      const input = screen.getByRole('textbox')
      await user.type(input, 'test input')

      expect(input).toHaveValue('test input')
      expect(handleChange).toHaveBeenCalled()
    })

    it('应该支持 Enter 键', async () => {
      const handleKeyDown = vi.fn()
      render(<Input onKeyDown={handleKeyDown} />)

      const input = screen.getByRole('textbox')
      await user.type(input, 'hello{enter}')

      expect(handleKeyDown).toHaveBeenCalledWith(
        expect.objectContaining({
          key: 'Enter'
        })
      )
    })
  })

  describe('特殊输入类型', () => {
    it('应该支持数字输入', () => {
      render(<Input type="number" />)

      const input = screen.getByRole('spinbutton')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('type', 'number')
    })

    it('应该支持搜索输入', () => {
      render(<Input type="search" />)

      const input = screen.getByRole('searchbox')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('type', 'search')
    })

    it('应该支持 URL 输入', () => {
      render(<Input type="url" />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'url')
    })

    it('应该支持电话输入', () => {
      render(<Input type="tel" />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'tel')
    })
  })
})