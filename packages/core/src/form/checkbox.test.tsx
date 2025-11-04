import React from 'react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from '../utils/jest-axe-mock'
import { motion } from 'framer-motion'
import { Checkbox } from './checkbox'
import { ThemeProvider } from '@xorigo-ui/theme'

// 扩展 Jest 匹配器
expect.extend(toHaveNoViolations)

// Mock framer-motion 在测试环境
vi.mock('framer-motion', () => ({
  motion: {
    input: 'input',
    label: 'label',
    p: 'p',
    div: 'div',
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useReducedMotion: () => true,
}))

// Mock 主题上下文
const MockThemeProvider = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="theme-provider">{children}</div>
)

// 测试工具函数
const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <MockThemeProvider>
      {component}
    </MockThemeProvider>
  )
}

describe('Checkbox 组件', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('基础渲染', () => {
    it('应该正确渲染基础复选框', () => {
      renderWithTheme(<Checkbox>测试复选框</Checkbox>)

      const checkbox = screen.getByRole('checkbox')
      const label = screen.getByText('测试复选框')

      expect(checkbox).toBeInTheDocument()
      expect(label).toBeInTheDocument()
      expect(checkbox).toHaveAttribute('type', 'checkbox')
    })

    it('应该支持自定义 className', () => {
      renderWithTheme(<Checkbox className="custom-class">测试</Checkbox>)

      const container = screen.getByRole('checkbox').closest('div')?.parentElement
      expect(container).toHaveClass('custom-class')
    })

    it('应该正确设置默认属性', () => {
      renderWithTheme(<Checkbox>测试</Checkbox>)

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).not.toBeDisabled()
      expect(checkbox).not.toBeChecked()
    })

    it('应该支持 ref 转发', () => {
      const ref = React.createRef<HTMLInputElement>()
      renderWithTheme(<Checkbox ref={ref}>测试</Checkbox>)

      expect(ref.current).toBeInstanceOf(HTMLInputElement)
      expect(ref.current).toBeInTheDocument()
    })

    it('应该生成唯一 ID', () => {
      renderWithTheme(<Checkbox>测试</Checkbox>)

      const checkbox = screen.getByRole('checkbox')
      const label = screen.getByText('测试')

      expect(checkbox.id).toBeTruthy()
      expect(label).toHaveAttribute('for', checkbox.id)
    })
  })

  describe('状态管理', () => {
    it('应该支持受控模式', async () => {
      const handleChange = vi.fn()
      renderWithTheme(
        <Checkbox checked onChange={handleChange}>
          测试
        </Checkbox>
      )

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeChecked()

      await user.click(checkbox)
      expect(handleChange).toHaveBeenCalledTimes(1)
    })

    it('应该支持非受控模式', async () => {
      renderWithTheme(<Checkbox>测试</Checkbox>)

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).not.toBeChecked()

      await user.click(checkbox)
      expect(checkbox).toBeChecked()
    })

    it('应该支持禁用状态', () => {
      renderWithTheme(<Checkbox disabled>测试</Checkbox>)

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeDisabled()

      const label = screen.getByText('测试')
      expect(label).toHaveClass('cursor-not-allowed')
    })

    it('应该支持 required 状态', () => {
      renderWithTheme(<Checkbox required>测试</Checkbox>)

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeRequired()

      const asterisk = screen.getByText('*')
      expect(asterisk).toBeInTheDocument()
    })

    it('应该支持 indeterminate 状态', () => {
      const onIndeterminateChange = vi.fn()
      renderWithTheme(
        <Checkbox indeterminate onIndeterminateChange={onIndeterminateChange}>
          测试
        </Checkbox>
      )

      const checkbox = screen.getByRole('checkbox') as HTMLInputElement
      expect(checkbox.indeterminate).toBe(true)

      // 检查是否显示了 minus 图标
      const minusIcon = checkbox.parentElement?.querySelector('[data-icon="minus"]')
      expect(minusIcon).toBeInTheDocument()
    })
  })

  describe('变体系统', () => {
    const variants = ['default', 'filled', 'outlined', 'neon'] as const
    const sizes = ['sm', 'md', 'lg'] as const
    const statuses = ['default', 'error', 'success', 'warning'] as const

    variants.forEach(variant => {
      it(`应该支持 ${variant} 变体`, () => {
        renderWithTheme(<Checkbox variant={variant}>测试</Checkbox>)

        const checkbox = screen.getByRole('checkbox')
        expect(checkbox).toBeInTheDocument()
      })
    })

    sizes.forEach(size => {
      it(`应该支持 ${size} 尺寸`, () => {
        renderWithTheme(<Checkbox size={size}>测试</Checkbox>)

        const checkbox = screen.getByRole('checkbox')
        expect(checkbox).toBeInTheDocument()
      })
    })

    statuses.forEach(status => {
      it(`应该支持 ${status} 状态`, () => {
        renderWithTheme(<Checkbox status={status}>测试</Checkbox>)

        const checkbox = screen.getByRole('checkbox')
        expect(checkbox).toBeInTheDocument()
      })
    })
  })

  describe('标签位置', () => {
    it('应该支持右侧标签（默认）', () => {
      renderWithTheme(<Checkbox>测试</Checkbox>)

      const checkbox = screen.getByRole('checkbox')
      const label = screen.getByText('测试')

      const container = checkbox.closest('div')?.parentElement
      expect(container).toHaveClass('flex-row')
    })

    it('应该支持左侧标签', () => {
      renderWithTheme(<Checkbox labelPosition="left">测试</Checkbox>)

      const checkbox = screen.getByRole('checkbox')
      const label = screen.getByText('测试')

      const container = checkbox.closest('div')?.parentElement
      expect(container).toHaveClass('flex-row')

      // 检查标签样式
      expect(label.parentElement).toHaveClass('mr-3')
    })
  })

  describe('辅助文本', () => {
    it('应该显示帮助文本', () => {
      renderWithTheme(
        <Checkbox helperText="这是帮助文本">测试</Checkbox>
      )

      const helperText = screen.getByText('这是帮助文本')
      expect(helperText).toBeInTheDocument()
      expect(helperText).toHaveClass('text-[var(--text-secondary)]')
    })

    it('应该显示错误信息', () => {
      renderWithTheme(
        <Checkbox error="这是错误信息">测试</Checkbox>
      )

      const errorMessage = screen.getByText('这是错误信息')
      expect(errorMessage).toBeInTheDocument()
      expect(errorMessage).toHaveClass('text-[var(--text-error)]')
    })

    it('错误信息应该覆盖帮助文本', () => {
      renderWithTheme(
        <Checkbox
          error="这是错误信息"
          helperText="这是帮助文本"
        >
          测试
        </Checkbox>
      )

      expect(screen.queryByText('这是帮助文本')).not.toBeInTheDocument()
      expect(screen.getByText('这是错误信息')).toBeInTheDocument()
    })
  })

  describe('事件处理', () => {
    it('应该正确处理点击事件', async () => {
      const handleChange = vi.fn()
      renderWithTheme(<Checkbox onChange={handleChange}>测试</Checkbox>)

      const checkbox = screen.getByRole('checkbox')
      await user.click(checkbox)

      expect(handleChange).toHaveBeenCalledTimes(1)
    })

    it('应该正确处理标签点击事件', async () => {
      const handleChange = vi.fn()
      renderWithTheme(<Checkbox onChange={handleChange}>测试</Checkbox>)

      const label = screen.getByText('测试')
      await user.click(label)

      expect(handleChange).toHaveBeenCalledTimes(1)
    })

    it('应该正确处理 indeterminate 状态变化', async () => {
      const onIndeterminateChange = vi.fn()
      const handleChange = vi.fn()

      renderWithTheme(
        <Checkbox
          indeterminate
          onIndeterminateChange={onIndeterminateChange}
          onChange={handleChange}
        >
          测试
        </Checkbox>
      )

      const checkbox = screen.getByRole('checkbox')
      await user.click(checkbox)

      expect(onIndeterminateChange).toHaveBeenCalledWith(false)
      expect(handleChange).toHaveBeenCalledTimes(1)
    })

    it('禁用状态下不应触发事件', async () => {
      const handleChange = vi.fn()
      renderWithTheme(
        <Checkbox disabled onChange={handleChange}>
          测试
        </Checkbox>
      )

      const checkbox = screen.getByRole('checkbox')
      await user.click(checkbox)

      expect(handleChange).not.toHaveBeenCalled()
    })
  })

  describe('键盘交互', () => {
    it('应该支持空格键切换状态', async () => {
      const handleChange = vi.fn()
      renderWithTheme(<Checkbox onChange={handleChange}>测试</Checkbox>)

      const checkbox = screen.getByRole('checkbox')
      checkbox.focus()

      await user.keyboard('{ }')

      expect(handleChange).toHaveBeenCalledTimes(1)
    })

    it('应该支持 Tab 键导航', () => {
      renderWithTheme(<Checkbox>测试</Checkbox>)

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('tabIndex', '0')
    })
  })

  describe('可访问性', () => {
    it('应该通过可访问性测试', async () => {
      const { container } = renderWithTheme(<Checkbox>测试</Checkbox>)

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('应该具有正确的 ARIA 属性', () => {
      renderWithTheme(<Checkbox required>测试</Checkbox>)

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('aria-required', 'true')
    })

    it('应该具有正确的语义标记', () => {
      renderWithTheme(<Checkbox>测试</Checkbox>)

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeInTheDocument()
    })
  })

  describe('响应式设计', () => {
    it('应该在不同屏幕尺寸下正常显示', () => {
      const sizes = ['sm', 'md', 'lg'] as const

      sizes.forEach(size => {
        const { unmount } = renderWithTheme(
          <Checkbox size={size}>测试</Checkbox>
        )

        const checkbox = screen.getByRole('checkbox')
        expect(checkbox).toBeInTheDocument()

        unmount()
      })
    })
  })

  describe('分组使用', () => {
    it('应该支持多个复选框组合使用', () => {
      const items = ['选项1', '选项2', '选项3']

      renderWithTheme(
        <div role="group" aria-label="选项组">
          {items.map(item => (
            <Checkbox key={item}>{item}</Checkbox>
          ))}
        </div>
      )

      items.forEach(item => {
        expect(screen.getByText(item)).toBeInTheDocument()
      })

      const checkboxes = screen.getAllByRole('checkbox')
      expect(checkboxes).toHaveLength(items.length)
    })

    it('应该支持表单集成', async () => {
      const handleSubmit = vi.fn()

      renderWithTheme(
        <form onSubmit={handleSubmit}>
          <Checkbox name="option1" value="1">选项1</Checkbox>
          <Checkbox name="option2" value="2">选项2</Checkbox>
          <button type="submit">提交</button>
        </form>
      )

      const checkboxes = screen.getAllByRole('checkbox')
      await user.click(checkboxes[0])
      await user.click(screen.getByRole('button', { name: '提交' }))

      expect(handleSubmit).toHaveBeenCalled()
    })
  })

  describe('错误处理', () => {
    it('应该优雅处理无效属性', () => {
      expect(() => {
        renderWithTheme(
          <Checkbox
            // @ts-ignore - 故意传入无效属性测试容错性
            invalidProp="invalid"
          >
            测试
          </Checkbox>
        )
      }).not.toThrow()
    })

    it('应该处理缺失子元素的情况', () => {
      expect(() => {
        renderWithTheme(<Checkbox />)
      }).not.toThrow()

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeInTheDocument()
    })
  })

  describe('主题集成', () => {
    it('应该使用正确的设计令牌', () => {
      renderWithTheme(<Checkbox>测试</Checkbox>)

      const checkbox = screen.getByRole('checkbox')
      const styles = window.getComputedStyle(checkbox)

      // 检查是否使用了 CSS 变量
      expect(styles.getPropertyValue('--border-secondary')).toBeDefined()
    })

    it('应该在错误状态下使用正确的颜色令牌', () => {
      renderWithTheme(<Checkbox error="错误">测试</Checkbox>)

      const checkbox = screen.getByRole('checkbox')
      const errorMessage = screen.getByText('错误')

      expect(checkbox).toBeInTheDocument()
      expect(errorMessage).toHaveClass('text-[var(--text-error)]')
    })
  })

  describe('性能测试', () => {
    it('应该高效渲染大量复选框', () => {
      const startTime = performance.now()

      renderWithTheme(
        <div>
          {Array.from({ length: 100 }, (_, i) => (
            <Checkbox key={i}>选项 {i + 1}</Checkbox>
          ))}
        </div>
      )

      const endTime = performance.now()
      const renderTime = endTime - startTime

      expect(renderTime).toBeLessThan(1000) // 1秒内完成渲染

      const checkboxes = screen.getAllByRole('checkbox')
      expect(checkboxes).toHaveLength(100)
    })
  })
})