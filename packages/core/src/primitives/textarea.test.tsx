/**
 * @fileoverview Textarea 组件测试
 * @description 验证 Textarea 组件的功能特性、变体、尺寸和错误状态
 *
 * @author Xorigo UI Team
 * @version 1.0.0
 * @since 2025-11-05
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Textarea } from './Textarea'
import { ThemeProvider } from '@xorigo-ui/system'

// =============================================================================
// 工具函数
// =============================================================================

const renderWithTheme = (component: React.ReactNode) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  )
}

// =============================================================================
// 基础渲染测试
// =============================================================================

describe('Textarea', () => {
  describe('基础渲染', () => {
    it('应该正确渲染默认 Textarea', () => {
      renderWithTheme(<Textarea />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toBeInTheDocument()
    })

    it('应该支持自定义 className', () => {
      renderWithTheme(<Textarea className="custom-class" />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveClass('custom-class')
    })

    it('应该支持默认值的设置', () => {
      renderWithTheme(<Textarea defaultValue="默认内容" />)
      const textarea = screen.getByDisplayValue('默认内容')
      expect(textarea).toBeInTheDocument()
    })

    it('应该支持 placeholder', () => {
      renderWithTheme(<Textarea placeholder="请输入内容" />)
      const textarea = screen.getByPlaceholderText('请输入内容')
      expect(textarea).toBeInTheDocument()
    })

    it('应该支持 rows 属性', () => {
      renderWithTheme(<Textarea rows={5} />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('rows', '5')
    })

    it('应该支持 cols 属性', () => {
      renderWithTheme(<Textarea cols={30} />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('cols', '30')
    })
  })

  // =============================================================================
  // 变体测试
  // =============================================================================

  describe('变体测试', () => {
    it('应该应用 default 变体', () => {
      renderWithTheme(<Textarea variant="default" />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveClass('border')
    })

    it('应该应用 bordered 变体', () => {
      renderWithTheme(<Textarea variant="bordered" />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveClass('border-2')
    })
  })

  // =============================================================================
  // 尺寸测试
  // =============================================================================

  describe('尺寸测试', () => {
    it('应该支持 small 尺寸', () => {
      renderWithTheme(<Textarea size="sm" />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveClass('px-3', 'py-2', 'text-sm')
    })

    it('应该支持 medium 尺寸', () => {
      renderWithTheme(<Textarea size="md" />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveClass('px-4', 'py-3', 'text-base')
    })

    it('应该支持 large 尺寸', () => {
      renderWithTheme(<Textarea size="lg" />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveClass('px-5', 'py-4', 'text-lg')
    })
  })

  // =============================================================================
  // 错误状态测试
  // =============================================================================

  describe('错误状态测试', () => {
    it('应该应用错误样式', () => {
      renderWithTheme(<Textarea error />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveClass('border-red-500')
      expect(textarea).toHaveClass('focus:border-red-500')
      expect(textarea).toHaveClass('focus:ring-red-500')
    })

    it('错误状态时应该能正常输入', () => {
      renderWithTheme(<Textarea error defaultValue="错误内容" />)
      const textarea = screen.getByDisplayValue('错误内容')
      expect(textarea).toBeInTheDocument()
      expect(textarea).toHaveAttribute('aria-invalid', 'true')
    })
  })

  // =============================================================================
  // 事件处理测试
  // =============================================================================

  describe('事件处理测试', () => {
    it('应该处理 onChange 事件', () => {
      const handleChange = vi.fn()
      renderWithTheme(<Textarea onChange={handleChange} />)

      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: '新内容' } })

      expect(handleChange).toHaveBeenCalledTimes(1)
    })

    it('应该处理 onBlur 事件', () => {
      const handleBlur = vi.fn()
      renderWithTheme(<Textarea onBlur={handleBlur} />)

      const textarea = screen.getByRole('textbox')
      fireEvent.blur(textarea)

      expect(handleBlur).toHaveBeenCalledTimes(1)
    })

    it('应该处理 onFocus 事件', () => {
      const handleFocus = vi.fn()
      renderWithTheme(<Textarea onFocus={handleFocus} />)

      const textarea = screen.getByRole('textbox')
      fireEvent.focus(textarea)

      expect(handleFocus).toHaveBeenCalledTimes(1)
    })

    it('应该处理 onKeyDown 事件', () => {
      const handleKeyDown = vi.fn()
      renderWithTheme(<Textarea onKeyDown={handleKeyDown} />)

      const textarea = screen.getByRole('textbox')
      fireEvent.keyDown(textarea, { key: 'Enter' })

      expect(handleKeyDown).toHaveBeenCalledTimes(1)
    })
  })

  // =============================================================================
  // 可访问性测试
  // =============================================================================

  describe('可访问性测试', () => {
    it('应该支持自定义 aria-label', () => {
      renderWithTheme(<Textarea aria-label="自定义标签" />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('aria-label', '自定义标签')
    })

    it('应该支持自定义 aria-describedby', () => {
      renderWithTheme(<Textarea aria-describedby="description-id" />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('aria-describedby', 'description-id')
    })

    it('错误状态时应该设置 aria-invalid', () => {
      renderWithTheme(<Textarea error />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('aria-invalid', 'true')
    })

    it('应该支持 disabled 状态', () => {
      renderWithTheme(<Textarea disabled />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toBeDisabled()
    })

    it('应该支持 required 属性', () => {
      renderWithTheme(<Textarea required />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('required')
    })

    it('应该支持 readonly 属性', () => {
      renderWithTheme(<Textarea readOnly />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('readonly')
    })
  })

  // =============================================================================
  // ref 转发测试
  // =============================================================================

  describe('Ref 转发测试', () => {
    it('应该正确转发 ref', () => {
      const ref = React.createRef<HTMLTextAreaElement>()
      renderWithTheme(<Textarea ref={ref} />)

      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
    })

    it('应该可以通过 ref 调用 focus', () => {
      const ref = React.createRef<HTMLTextAreaElement>()
      renderWithTheme(<Textarea ref={ref} />)

      ref.current?.focus()
      expect(document.activeElement).toBe(ref.current)
    })

    it('应该可以通过 ref 获取值', () => {
      const ref = React.createRef<HTMLTextAreaElement>()
      renderWithTheme(<Textarea ref={ref} defaultValue="测试值" />)

      expect(ref.current?.value).toBe('测试值')
    })
  })

  // =============================================================================
  // HTML 属性透传测试
  // =============================================================================

  describe('HTML 属性透传测试', () => {
    it('应该支持 name 属性', () => {
      renderWithTheme(<Textarea name="description" />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('name', 'description')
    })

    it('应该支持 maxLength 属性', () => {
      renderWithTheme(<Textarea maxLength={100} />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('maxlength', '100')
    })

    it('应该支持 minLength 属性', () => {
      renderWithTheme(<Textarea minLength={10} />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('minlength', '10')
    })

    it('应该支持 spellCheck 属性', () => {
      renderWithTheme(<Textarea spellCheck={false} />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('spellcheck', 'false')
    })

    it('应该支持 autoComplete 属性', () => {
      renderWithTheme(<Textarea autoComplete="off" />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('autocomplete', 'off')
    })
  })

  // =============================================================================
  // 边缘情况测试
  // =============================================================================

  describe('边缘情况测试', () => {
    it('应该处理空的 className', () => {
      renderWithTheme(<Textarea className="" />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toBeInTheDocument()
    })

    it('应该处理长的占位符文本', () => {
      const longPlaceholder = '这是一个很长的占位符文本，用来测试组件对长文本的处理能力'
      renderWithTheme(<Textarea placeholder={longPlaceholder} />)
      const textarea = screen.getByPlaceholderText(longPlaceholder)
      expect(textarea).toBeInTheDocument()
    })

    it('应该处理多行默认值', () => {
      const multilineValue = '第一行\n第二行\n第三行'
      renderWithTheme(<Textarea defaultValue={multilineValue} />)
      const textarea = screen.getByDisplayValue(multilineValue)
      expect(textarea).toBeInTheDocument()
    })

    it('应该支持组合 props', () => {
      renderWithTheme(
        <Textarea
          variant="bordered"
          size="lg"
          error
          placeholder="测试组合"
          rows={4}
        />
      )
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveClass('border-2', 'px-5', 'py-4', 'text-lg')
      expect(textarea).toHaveClass('border-red-500', 'focus:border-red-500')
      expect(textarea).toHaveAttribute('rows', '4')
    })
  })
})
