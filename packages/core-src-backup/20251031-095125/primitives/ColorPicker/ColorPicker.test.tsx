import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ColorPicker } from './ColorPicker'

describe('ColorPicker', () => {
  it('renders correctly', () => {
    render(<ColorPicker />)
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Select color')
  })

  it('displays default color', () => {
    render(<ColorPicker defaultValue="#FF0000" />)
    const picker = screen.getByRole('button')
    const colorDisplay = picker.querySelector('div[style*="background-color"]')
    expect(colorDisplay).toHaveStyle('background-color: rgb(255, 0, 0)')
  })

  it('opens color picker panel on click', async () => {
    const user = userEvent.setup()
    render(<ColorPicker />)

    const picker = screen.getByRole('button')
    await user.click(picker)

    expect(screen.getByText('预设颜色')).toBeInTheDocument()
    expect(screen.getByText('自定义颜色')).toBeInTheDocument()
  })

  it('selects preset color', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()

    render(<ColorPicker onChange={handleChange} />)

    // 打开颜色选择器
    const picker = screen.getByRole('button')
    await user.click(picker)

    // 选择预设颜色
    const presetColors = screen.getAllByRole('button').filter(
      button => button.getAttribute('aria-label')?.startsWith('选择颜色')
    )
    await user.click(presetColors[3]) // 蓝色

    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(handleChange).toHaveBeenCalledWith('#0000FF')
  })

  it('handles custom color input', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()

    render(<ColorPicker onChange={handleChange} />)

    // 打开颜色选择器
    const picker = screen.getByRole('button')
    await user.click(picker)

    // 展开自定义颜色选择器
    const showCustomButton = screen.getByText('显示')
    await user.click(showCustomButton)

    // 输入自定义颜色
    const colorInput = screen.getByPlaceholderText('#000000')
    await user.clear(colorInput)
    await user.type(colorInput, '#FF6600')

    expect(handleChange).toHaveBeenCalledWith('#FF6600')
  })

  it('handles disabled state', () => {
    render(<ColorPicker disabled />)
    const picker = screen.getByRole('button')
    expect(picker).toBeDisabled()
    expect(picker).toHaveClass('disabled:opacity-50')
  })

  it('closes panel when clicking outside', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <div>
        <ColorPicker />
        <div data-testid="outside">Outside element</div>
      </div>
    )

    // 打开颜色选择器
    const picker = screen.getByRole('button')
    await user.click(picker)

    expect(screen.getByText('预设颜色')).toBeInTheDocument()

    // 点击外部区域
    await user.click(screen.getByTestId('outside'))

    await waitFor(() => {
      expect(screen.queryByText('预设颜色')).not.toBeInTheDocument()
    })
  })

  it('applies variant styles correctly', () => {
    const { rerender } = render(<ColorPicker variant="minimal" />)
    expect(screen.getByRole('button')).toHaveClass('bg-transparent')

    rerender(<ColorPicker variant="elevated" />)
    expect(screen.getByRole('button')).toHaveClass('shadow-md')
  })

  it('applies size styles correctly', () => {
    const { rerender } = render(<ColorPicker size="sm" />)
    expect(screen.getByRole('button')).toHaveClass('w-8 h-8')

    rerender(<ColorPicker size="lg" />)
    expect(screen.getByRole('button')).toHaveClass('w-12 h-12')
  })

  it('shows alpha channel control when enabled', async () => {
    const user = userEvent.setup()
    render(<ColorPicker showAlpha />)

    // 打开颜色选择器
    const picker = screen.getByRole('button')
    await user.click(picker)

    // 展开自定义颜色选择器
    const showCustomButton = screen.getByText('显示')
    await user.click(showCustomButton)

    expect(screen.getByText('透明度:')).toBeInTheDocument()
    expect(screen.getByLabelText('透明度控制')).toBeInTheDocument()
  })

  it('is accessible with proper ARIA attributes', () => {
    render(<ColorPicker ariaLabel="选择主题颜色" />)
    const picker = screen.getByRole('button')
    expect(picker).toHaveAttribute('aria-label', '选择主题颜色')
    expect(picker).toHaveAttribute('aria-haspopup', 'listbox')
  })

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<ColorPicker />)

    const picker = screen.getByRole('button')
    picker.focus()

    // 按回车键应该打开面板
    await user.keyboard('{Enter}')
    expect(screen.getByText('预设颜色')).toBeInTheDocument()

    // 按 ESC 键应该关闭面板
    await user.keyboard('{Escape}')
    await waitFor(() => {
      expect(screen.queryByText('预设颜色')).not.toBeInTheDocument()
    })
  })
})