import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Slider } from './slider'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    label: 'label',
    p: 'p',
  },
  useAnimation: () => ({
    start: vi.fn(),
  }),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}))

describe('Slider', () => {
  const defaultProps = {
    min: 0,
    max: 100,
    step: 1,
  }

  beforeEach(() => {
    // 添加必要的 CSS 变量到 document.documentElement
    Object.defineProperties(document.documentElement.style, {
      '--color-primary-500': { value: '#3b82f6', writable: true },
      '--color-primary-600': { value: '#2563eb', writable: true },
      '--color-primary-700': { value: '#1d4ed8', writable: true },
      '--color-primary-200': { value: '#dbeafe', writable: true },
      '--color-secondary-500': { value: '#6b7280', writable: true },
      '--color-secondary-600': { value: '#4b5563', writable: true },
      '--color-secondary-700': { value: '#374151', writable: true },
      '--color-secondary-200': { value: '#e5e7eb', writable: true },
      '--color-success-500': { value: '#10b981', writable: true },
      '--color-success-600': { value: '#059669', writable: true },
      '--color-success-700': { value: '#047857', writable: true },
      '--color-success-200': { value: '#d1fae5', writable: true },
      '--color-warning-500': { value: '#f59e0b', writable: true },
      '--color-warning-600': { value: '#d97706', writable: true },
      '--color-warning-700': { value: '#b45309', writable: true },
      '--color-warning-200': { value: '#fed7aa', writable: true },
      '--color-error-500': { value: '#ef4444', writable: true },
      '--color-error-600': { value: '#dc2626', writable: true },
      '--color-error-700': { value: '#b91c1c', writable: true },
      '--color-error-200': { value: '#fecaca', writable: true },
      '--color-text-primary': { value: '#111827', writable: true },
      '--color-text-secondary': { value: '#6b7280', writable: true },
      '--color-surface': { value: '#ffffff', writable: true },
      '--color-border': { value: '#e5e7eb', writable: true },
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('基础渲染', () => {
    it('应该正确渲染单值滑块', () => {
      render(<Slider {...defaultProps} value={50} />)

      const slider = screen.getByRole('group')
      expect(slider).toBeInTheDocument()
      expect(slider).toHaveAttribute('aria-disabled', 'false')
    })

    it('应该正确渲染范围滑块', () => {
      render(<Slider {...defaultProps} value={[25, 75]} />)

      const slider = screen.getByRole('group')
      expect(slider).toBeInTheDocument()
    })

    it('应该正确渲染垂直滑块', () => {
      render(<Slider {...defaultProps} value={50} orientation="vertical" />)

      const slider = screen.getByRole('group')
      expect(slider).toBeInTheDocument()
    })
  })

  describe('标签和帮助文本', () => {
    it('应该显示标签文本', () => {
      render(<Slider {...defaultProps} value={50} label="音量控制" />)

      expect(screen.getByText('音量控制')).toBeInTheDocument()
    })

    it('应该显示帮助文本', () => {
      render(<Slider {...defaultProps} value={50} helperText="拖动滑块调整音量" />)

      expect(screen.getByText('拖动滑块调整音量')).toBeInTheDocument()
    })

    it('应该显示错误信息', () => {
      render(<Slider {...defaultProps} value={50} error="音量超出范围" />)

      expect(screen.getByText('音量超出范围')).toBeInTheDocument()
    })

    it('应该优先显示错误信息而不是帮助文本', () => {
      render(
        <Slider
          {...defaultProps}
          value={50}
          helperText="拖动滑块调整音量"
          error="音量超出范围"
        />
      )

      expect(screen.queryByText('拖动滑块调整音量')).not.toBeInTheDocument()
      expect(screen.getByText('音量超出范围')).toBeInTheDocument()
    })
  })

  describe('数值显示', () => {
    it('应该显示单值', () => {
      render(<Slider {...defaultProps} value={50} showLabel />)

      expect(screen.getByText('50')).toBeInTheDocument()
    })

    it('应该显示范围值', () => {
      render(<Slider {...defaultProps} value={[25, 75]} showLabel />)

      expect(screen.getByText('25')).toBeInTheDocument()
      expect(screen.getByText('-')).toBeInTheDocument()
      expect(screen.getByText('75')).toBeInTheDocument()
    })

    it('应该显示输入框', () => {
      render(<Slider {...defaultProps} value={50} showInput />)

      const input = screen.getByDisplayValue('50')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('type', 'number')
    })

    it('应该显示范围输入框', () => {
      render(<Slider {...defaultProps} value={[25, 75]} showInput />)

      const inputs = screen.getAllByDisplayValue(/25|75/)
      expect(inputs).toHaveLength(2)
    })

    it('应该使用自定义格式化函数', () => {
      const formatValue = (val: number) => `${val}%`
      render(<Slider {...defaultProps} value={50} showLabel formatValue={formatValue} />)

      expect(screen.getByText('50%')).toBeInTheDocument()
    })
  })

  describe('标记点', () => {
    const marks = [
      { value: 0, label: '最小' },
      { value: 50, label: '中间' },
      { value: 100, label: '最大' }
    ]

    it('应该显示标记点', () => {
      render(<Slider {...defaultProps} value={50} showMarks marks={marks} />)

      expect(screen.getByText('最小')).toBeInTheDocument()
      expect(screen.getByText('中间')).toBeInTheDocument()
      expect(screen.getByText('最大')).toBeInTheDocument()
    })

    it('应该不显示标签为空的标记点', () => {
      const marksWithoutLabels = [
        { value: 25 },
        { value: 75 }
      ]

      render(<Slider {...defaultProps} value={50} showMarks marks={marksWithoutLabels} />)

      // 标记点圆点应该存在，但不应该有任何文本标签
      expect(screen.queryByText(/25|75/)).not.toBeInTheDocument()
    })
  })

  describe('交互行为', () => {
    it('应该处理点击轨道事件', async () => {
      const onValueChange = vi.fn()
      const user = userEvent.setup()

      render(<Slider {...defaultProps} value={50} onValueChange={onValueChange} />)

      const track = screen.getByRole('group').querySelector('[ref]')
      await user.click(track!)

      expect(onValueChange).toHaveBeenCalled()
    })

    it('应该处理输入框变化', async () => {
      const onValueChange = vi.fn()
      const user = userEvent.setup()

      render(<Slider {...defaultProps} value={50} showInput onValueChange={onValueChange} />)

      const input = screen.getByDisplayValue('50')
      await user.clear(input)
      await user.type(input, '75')

      await waitFor(() => {
        expect(onValueChange).toHaveBeenCalledWith(75)
      })
    })

    it('应该处理范围输入框变化', async () => {
      const onValueChange = vi.fn()
      const user = userEvent.setup()

      render(<Slider {...defaultProps} value={[25, 75]} showInput onValueChange={onValueChange} />)

      const inputs = screen.getAllByDisplayValue(/25|75/)
      await user.clear(inputs[0])
      await user.type(inputs[0], '30')

      await waitFor(() => {
        expect(onValueChange).toHaveBeenCalledWith([30, 75])
      })
    })

    it('应该验证输入值范围', async () => {
      const onValueChange = vi.fn()
      const user = userEvent.setup()

      render(<Slider {...defaultProps} min={0} max={100} value={50} showInput onValueChange={onValueChange} />)

      const input = screen.getByDisplayValue('50')
      await user.clear(input)
      await user.type(input, '150') // 超出最大值

      await waitFor(() => {
        expect(onValueChange).toHaveBeenCalledWith(100) // 应该被限制为最大值
      })
    })

    it('应该处理无效输入', async () => {
      const onValueChange = vi.fn()
      const user = userEvent.setup()

      render(<Slider {...defaultProps} value={50} showInput onValueChange={onValueChange} />)

      const input = screen.getByDisplayValue('50')
      await user.clear(input)
      await user.type(input, 'abc')

      // 无效输入不应该触发 onValueChange
      expect(onValueChange).not.toHaveBeenCalled()
    })
  })

  describe('可访问性', () => {
    it('应该正确设置 disabled 属性', () => {
      render(<Slider {...defaultProps} value={50} disabled />)

      const slider = screen.getByRole('group')
      expect(slider).toHaveAttribute('aria-disabled', 'true')
      expect(slider).toHaveClass('opacity-50', 'cursor-not-allowed')
    })

    it('应该支持键盘导航', async () => {
      const user = userEvent.setup()

      render(<Slider {...defaultProps} value={50} />)

      const thumb = screen.getByRole('group').querySelector('[tabIndex="0"]') as HTMLElement
      expect(thumb).toBeInTheDocument()

      thumb?.focus()
      expect(thumb).toHaveFocus()
    })
  })

  describe('样式变体', () => {
    it('应该应用不同的尺寸', () => {
      const { rerender } = render(<Slider {...defaultProps} value={50} size="sm" />)
      let slider = screen.getByRole('group')
      expect(slider).toBeInTheDocument()

      rerender(<Slider {...defaultProps} value={50} size="lg" />)
      slider = screen.getByRole('group')
      expect(slider).toBeInTheDocument()
    })

    it('应该应用不同的颜色主题', () => {
      const { rerender } = render(<Slider {...defaultProps} value={50} color="primary" />)
      let slider = screen.getByRole('group')
      expect(slider).toBeInTheDocument()

      rerender(<Slider {...defaultProps} value={50} color="success" />)
      slider = screen.getByRole('group')
      expect(slider).toBeInTheDocument()

      rerender(<Slider {...defaultProps} value={50} color="error" />)
      slider = screen.getByRole('group')
      expect(slider).toBeInTheDocument()
    })

    it('应该应用不同的动画变体', () => {
      const { rerender } = render(<Slider {...defaultProps} value={50} variant="default" />)
      let slider = screen.getByRole('group')
      expect(slider).toBeInTheDocument()

      rerender(<Slider {...defaultProps} value={50} variant="smooth" />)
      slider = screen.getByRole('group')
      expect(slider).toBeInTheDocument()

      rerender(<Slider {...defaultProps} value={50} variant="bounce" />)
      slider = screen.getByRole('group')
      expect(slider).toBeInTheDocument()
    })
  })

  describe('受控和非受控模式', () => {
    it('应该在受控模式下使用外部值', () => {
      const onValueChange = vi.fn()
      render(<Slider {...defaultProps} value={30} onValueChange={onValueChange} />)

      expect(screen.getByText('30')).toBeInTheDocument()
    })

    it('应该在非受控模式下使用默认值', () => {
      render(<Slider {...defaultProps} defaultValue={70} showLabel />)

      expect(screen.getByText('70')).toBeInTheDocument()
    })

    it('应该在受控模式下不改变内部状态', () => {
      const onValueChange = vi.fn()
      const { rerender } = render(<Slider {...defaultProps} value={30} onValueChange={onValueChange} showInput />)

      // 触发值变化但重新渲染时仍然使用外部值
      rerender(<Slider {...defaultProps} value={30} onValueChange={onValueChange} showInput />)

      expect(screen.getByDisplayValue('30')).toBeInTheDocument()
    })
  })

  describe('自定义样式', () => {
    it('应该应用自定义轨道样式', () => {
      render(<Slider {...defaultProps} value={50} trackClassName="custom-track" />)

      const track = screen.getByRole('group').querySelector('.custom-track')
      expect(track).toBeInTheDocument()
    })

    it('应该应用自定义滑块样式', () => {
      render(<Slider {...defaultProps} value={50} thumbClassName="custom-thumb" />)

      const thumb = screen.getByRole('group').querySelector('.custom-thumb')
      expect(thumb).toBeInTheDocument()
    })

    it('应该应用自定义标记点样式', () => {
      const marks = [{ value: 50, label: '中间' }]
      render(<Slider {...defaultProps} value={50} showMarks marks={marks} markClassName="custom-mark" />)

      const mark = screen.getByRole('group').querySelector('.custom-mark')
      expect(mark).toBeInTheDocument()
    })
  })

  describe('边界情况', () => {
    it('应该处理空标记点数组', () => {
      render(<Slider {...defaultProps} value={50} showMarks marks={[]} />)

      const slider = screen.getByRole('group')
      expect(slider).toBeInTheDocument()
    })

    it('应该处理最小值等于最大值', () => {
      render(<Slider min={50} max={50} value={50} />)

      const slider = screen.getByRole('group')
      expect(slider).toBeInTheDocument()
    })

    it('应该处理小数步长', () => {
      render(<Slider {...defaultProps} value={50.5} step={0.1} showLabel />)

      expect(screen.getByText('50.5')).toBeInTheDocument()
    })

    it('应该处理负数范围', () => {
      render(<Slider min={-100} max={0} value={-50} showLabel />)

      expect(screen.getByText('-50')).toBeInTheDocument()
    })
  })
})