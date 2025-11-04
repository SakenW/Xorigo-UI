import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { axe, toHaveNoViolations } from '../utils/jest-axe-mock'
import { Select } from './select'
import type { SelectProps } from './select'

// 扩展 Jest 匹配器
expect.extend(toHaveNoViolations)

// Mock 主题系统
vi.mock('@xorigo-ui/system', () => ({
  useTheme: () => ({
    themeConfig: {
      colors: { 400: '#3b82f6' },
      glow: 'rgba(59, 130, 246, 0.5)'
    }
  })
}))

// 测试数据
const mockOptions: SelectProps['options'] = [
  { value: 'option1', label: '选项 1' },
  { value: 'option2', label: '选项 2', description: '这是选项2的描述' },
  { value: 'option3', label: '选项 3', disabled: true },
  { value: 'option4', label: '选项 4', group: '分组1' },
  { value: 'option5', label: '选项 5', group: '分组1' },
]

const mockGroupedOptions: SelectProps['options'] = [
  { value: 'fruit1', label: '苹果', group: '水果' },
  { value: 'fruit2', label: '香蕉', group: '水果' },
  { value: 'veg1', label: '胡萝卜', group: '蔬菜' },
  { value: 'veg2', label: '西红柿', group: '蔬菜' },
]

describe('Select 组件', () => {
  const defaultProps: SelectProps = {
    options: mockOptions,
    placeholder: '请选择选项',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('基础渲染', () => {
    test('应该正确渲染基础选择器', () => {
      render(<Select {...defaultProps} />)

      const select = screen.getByRole('button')
      expect(select).toBeInTheDocument()
      expect(select).toHaveAttribute('aria-expanded', 'false')

      const placeholder = screen.getByText('请选择选项')
      expect(placeholder).toBeInTheDocument()
    })

    test('应该正确渲染带标签的选择器', () => {
      render(<Select {...defaultProps} label="选择器标签" />)

      const label = screen.getByText('选择器标签')
      expect(label).toBeInTheDocument()
      expect(label).toHaveAttribute('for', expect.stringMatching(/^select-/))
    })

    test('应该正确渲染必填标记', () => {
      render(<Select {...defaultProps} label="必填字段" required />)

      const asterisk = screen.getByText('*')
      expect(asterisk).toBeInTheDocument()
      expect(asterisk).toHaveClass('text-red-500')
    })
  })

  describe('单选模式', () => {
    test('应该能选择单个选项', async () => {
      const handleChange = jest.fn()
      render(<Select {...defaultProps} onChange={handleChange} />)

      // 点击打开下拉框
      const select = screen.getByRole('button')
      fireEvent.click(select)

      // 等待下拉框打开
      await waitFor(() => {
        expect(screen.getByText('选项 1')).toBeInTheDocument()
      })

      // 选择选项
      fireEvent.click(screen.getByText('选项 1'))

      // 验证回调被调用
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: 'option1'
          })
        })
      )
    })

    test('应该显示已选择的选项', () => {
      render(<Select {...defaultProps} value="option2" />)

      const selectedText = screen.getByText('选项 2')
      expect(selectedText).toBeInTheDocument()
    })

    test('应该支持清除功能', () => {
      const handleChange = jest.fn()
      render(<Select {...defaultProps} value="option1" clearable onChange={handleChange} />)

      const clearButton = screen.getByRole('button', { name: /clear/i })
      fireEvent.click(clearButton)

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: ''
          })
        })
      )
    })
  })

  describe('多选模式', () => {
    test('应该支持多选', async () => {
      const handleChange = jest.fn()
      render(<Select {...defaultProps} multiple onChange={handleChange} />)

      const select = screen.getByRole('button')
      fireEvent.click(select)

      await waitFor(() => {
        expect(screen.getByText('选项 1')).toBeInTheDocument()
      })

      // 选择多个选项
      fireEvent.click(screen.getByText('选项 1'))
      fireEvent.click(screen.getByText('选项 2'))

      expect(handleChange).toHaveBeenCalledTimes(2)
    })

    test('应该显示多选标签', () => {
      render(
        <Select
          {...defaultProps}
          multiple
          value={['option1', 'option2']}
        />
      )

      // 检查标签是否显示
      expect(screen.getByText('选项 1')).toBeInTheDocument()
      expect(screen.getByText('选项 2')).toBeInTheDocument()
    })

    test('应该能移除已选择的选项', () => {
      const handleChange = jest.fn()
      render(
        <Select
          {...defaultProps}
          multiple
          value={['option1', 'option2']}
          onChange={handleChange}
        />
      )

      // 点击移除按钮
      const removeButtons = screen.getAllByRole('button')
      const firstRemoveButton = removeButtons.find(btn =>
        btn.querySelector('svg') && btn.getAttribute('type') === 'button'
      )

      if (firstRemoveButton) {
        fireEvent.click(firstRemoveButton)
      }

      expect(handleChange).toHaveBeenCalled()
    })
  })

  describe('搜索功能', () => {
    test('应该支持搜索过滤', async () => {
      const handleSearch = jest.fn()
      render(<Select {...defaultProps} searchable onSearch={handleSearch} />)

      const select = screen.getByRole('button')
      fireEvent.click(select)

      // 等待搜索框出现
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('搜索...')
        expect(searchInput).toBeInTheDocument()
      })

      const searchInput = screen.getByPlaceholderText('搜索...')
      fireEvent.change(searchInput, { target: { value: '选项 1' } })

      expect(handleSearch).toHaveBeenCalledWith('选项 1')

      // 验证过滤结果
      await waitFor(() => {
        expect(screen.getByText('选项 1')).toBeInTheDocument()
        expect(screen.queryByText('选项 2')).not.toBeInTheDocument()
      })
    })

    test('应该显示无结果提示', async () => {
      render(<Select {...defaultProps} searchable />)

      const select = screen.getByRole('button')
      fireEvent.click(select)

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('搜索...')
        fireEvent.change(searchInput, { target: { value: '不存在的选项' } })
      })

      await waitFor(() => {
        expect(screen.getByText('没有找到选项')).toBeInTheDocument()
      })
    })
  })

  describe('分组功能', () => {
    test('应该显示分组标题', async () => {
      render(<Select options={mockGroupedOptions} groupBy="group" />)

      const select = screen.getByRole('button')
      fireEvent.click(select)

      await waitFor(() => {
        expect(screen.getByText('水果')).toBeInTheDocument()
        expect(screen.getByText('蔬菜')).toBeInTheDocument()
      })
    })

    test('应该支持自定义分组标题渲染', async () => {
      const renderGroupHeader = jest.fn((group) => `📁 ${group}`)
      render(
        <Select
          options={mockGroupedOptions}
          groupBy="group"
          renderGroupHeader={renderGroupHeader}
        />
      )

      const select = screen.getByRole('button')
      fireEvent.click(select)

      await waitFor(() => {
        expect(screen.getByText('📁 水果')).toBeInTheDocument()
        expect(renderGroupHeader).toHaveBeenCalledWith('水果')
      })
    })
  })

  describe('自定义渲染', () => {
    test('应该支持自定义选项渲染', async () => {
      const renderOption = jest.fn((option) => (
        <div>
          <span className="text-red-500">🔴</span>
          <span>{option.label}</span>
        </div>
      ))

      render(<Select {...defaultProps} renderOption={renderOption} />)

      const select = screen.getByRole('button')
      fireEvent.click(select)

      await waitFor(() => {
        expect(screen.getByText('🔴')).toBeInTheDocument()
        expect(renderOption).toHaveBeenCalled()
      })
    })

    test('应该支持自定义值渲染', () => {
      const renderValue = jest.fn((selectedOptions) => (
        <div className="custom-value">
          已选择: {selectedOptions.map(opt => opt.label).join(', ')}
        </div>
      ))

      render(
        <Select
          {...defaultProps}
          value="option1"
          renderValue={renderValue}
        />
      )

      expect(screen.getByText('已选择: 选项 1')).toBeInTheDocument()
      expect(renderValue).toHaveBeenCalled()
    })

    test('应该支持自定义空状态渲染', async () => {
      const renderEmpty = jest.fn(() => <div>没有匹配的结果</div>)

      render(<Select {...defaultProps} searchable renderEmpty={renderEmpty} />)

      const select = screen.getByRole('button')
      fireEvent.click(select)

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('搜索...')
        fireEvent.change(searchInput, { target: { value: '无匹配项' } })
      })

      await waitFor(() => {
        expect(screen.getByText('没有匹配的结果')).toBeInTheDocument()
        expect(renderEmpty).toHaveBeenCalled()
      })
    })

    test('应该支持自定义加载状态渲染', () => {
      const renderLoading = jest.fn(() => <div>加载中请稍候...</div>)

      render(<Select {...defaultProps} loading renderLoading={renderLoading} />)

      const select = screen.getByRole('button')
      fireEvent.click(select)

      expect(screen.getByText('加载中请稍候...')).toBeInTheDocument()
      expect(renderLoading).toHaveBeenCalled()
    })
  })

  describe('状态和样式', () => {
    test('应该正确处理禁用状态', () => {
      render(<Select {...defaultProps} disabled />)

      const select = screen.getByRole('button')
      expect(select).toBeDisabled()
      expect(select).toHaveClass('disabled:cursor-not-allowed')
    })

    test('应该正确显示错误状态', () => {
      render(<Select {...defaultProps} error="这是错误信息" />)

      const errorMessage = screen.getByText('这是错误信息')
      expect(errorMessage).toBeInTheDocument()
      expect(errorMessage).toHaveClass('text-red-600')
    })

    test('应该正确显示帮助信息', () => {
      render(<Select {...defaultProps} helperText="这是帮助信息" />)

      const helperText = screen.getByText('这是帮助信息')
      expect(helperText).toBeInTheDocument()
      expect(helperText).toHaveClass('text-gray-500')
    })

    test('应该支持不同的变体样式', () => {
      const { rerender } = render(<Select {...defaultProps} variant="outlined" />)
      expect(screen.getByRole('button')).toHaveClass('border-2')

      rerender(<Select {...defaultProps} variant="filled" />)
      expect(screen.getByRole('button')).toHaveClass('border-0')

      rerender(<Select {...defaultProps} variant="underlined" />)
      expect(screen.getByRole('button')).toHaveClass('border-b-2')
    })

    test('应该支持不同尺寸', () => {
      const { rerender } = render(<Select {...defaultProps} size="sm" />)
      expect(screen.getByRole('button')).toHaveClass('text-sm', 'px-3', 'py-1.5')

      rerender(<Select {...defaultProps} size="lg" />)
      expect(screen.getByRole('button')).toHaveClass('text-base', 'px-5', 'py-3')
    })
  })

  describe('键盘交互', () => {
    test('应该支持键盘导航', async () => {
      const handleChange = jest.fn()
      render(<Select {...defaultProps} onChange={handleChange} />)

      const select = screen.getByRole('button')
      fireEvent.click(select)

      await waitFor(() => {
        expect(screen.getByText('选项 1')).toBeInTheDocument()
      })

      // 使用方向键导航
      fireEvent.keyDown(document, { key: 'ArrowDown' })
      fireEvent.keyDown(document, { key: 'Enter' })

      expect(handleChange).toHaveBeenCalled()
    })

    test('应该支持 Escape 键关闭下拉框', async () => {
      render(<Select {...defaultProps} />)

      const select = screen.getByRole('button')
      fireEvent.click(select)

      await waitFor(() => {
        expect(screen.getByText('选项 1')).toBeInTheDocument()
      })

      fireEvent.keyDown(document, { key: 'Escape' })

      await waitFor(() => {
        expect(screen.queryByText('选项 1')).not.toBeInTheDocument()
      })
    })
  })

  describe('可访问性', () => {
    test('应该通过无障碍测试', async () => {
      const { container } = render(<Select {...defaultProps} label="可访问性测试" />)

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    test('应该有正确的 ARIA 属性', () => {
      render(<Select {...defaultProps} label="ARIA 测试" />)

      const select = screen.getByRole('button')
      expect(select).toHaveAttribute('aria-expanded', 'false')
      expect(select).toHaveAttribute('aria-haspopup', 'listbox')
    })

    test('应该正确处理禁用选项', async () => {
      render(<Select {...defaultProps} />)

      const select = screen.getByRole('button')
      fireEvent.click(select)

      await waitFor(() => {
        const disabledOption = screen.getByText('选项 3')
        expect(disabledOption).toHaveClass('opacity-50', 'cursor-not-allowed')
      })
    })
  })

  describe('事件回调', () => {
    test('应该调用 onOpen 回调', () => {
      const onOpen = jest.fn()
      render(<Select {...defaultProps} onOpen={onOpen} />)

      fireEvent.click(screen.getByRole('button'))
      expect(onOpen).toHaveBeenCalled()
    })

    test('应该调用 onClose 回调', async () => {
      const onClose = jest.fn()
      render(<Select {...defaultProps} onClose={onClose} />)

      const select = screen.getByRole('button')
      fireEvent.click(select)

      // 点击外部关闭
      fireEvent.mouseDown(document.body)

      await waitFor(() => {
        expect(onClose).toHaveBeenCalled()
      })
    })

    test('应该调用 onClear 回调', () => {
      const onClear = jest.fn()
      render(<Select {...defaultProps} value="option1" clearable onClear={onClear} />)

      const clearButton = screen.getByRole('button', { name: /clear/i })
      fireEvent.click(clearButton)

      expect(onClear).toHaveBeenCalled()
    })
  })

  describe('高级功能', () => {
    test('应该支持自定义过滤函数', async () => {
      const filterOption = jest.fn((option, query) =>
        option.label.toLowerCase().includes(query.toLowerCase())
      )

      render(<Select {...defaultProps} searchable filterOption={filterOption} />)

      const select = screen.getByRole('button')
      fireEvent.click(select)

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('搜索...')
        fireEvent.change(searchInput, { target: { value: '选项' } })
      })

      expect(filterOption).toHaveBeenCalled()
    })

    test('应该支持 closeOnSelect 配置', async () => {
      const { rerender } = render(<Select {...defaultProps} closeOnSelect={false} />)

      const select = screen.getByRole('button')
      fireEvent.click(select)

      await waitFor(() => {
        fireEvent.click(screen.getByText('选项 1'))
      })

      // 下拉框应该保持打开状态
      await waitFor(() => {
        expect(screen.getByText('选项 2')).toBeInTheDocument()
      })

      // 测试 closeOnSelect=true 的行为
      rerender(<Select {...defaultProps} closeOnSelect={true} />)

      fireEvent.click(screen.getByRole('button'))
      await waitFor(() => {
        fireEvent.click(screen.getByText('选项 1'))
      })

      await waitFor(() => {
        expect(screen.queryByText('选项 2')).not.toBeInTheDocument()
      })
    })
  })

  describe('边界情况', () => {
    test('应该处理空选项数组', () => {
      render(<Select {...defaultProps} options={[]} />)

      const select = screen.getByRole('button')
      expect(select).toBeInTheDocument()
    })

    test('应该处理未定义的值', () => {
      render(<Select {...defaultProps} value={undefined} />)

      const placeholder = screen.getByText('请选择选项')
      expect(placeholder).toBeInTheDocument()
    })

    test('应该处理不存在的选中值', () => {
      render(<Select {...defaultProps} value="nonexistent" />)

      // 应该显示占位符而不是错误
      const placeholder = screen.getByText('请选择选项')
      expect(placeholder).toBeInTheDocument()
    })
  })
})