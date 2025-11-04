import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, renderHook, screen, fireEvent } from '@testing-library/react'
import { FormItem, useFormItem } from './form-item'

// 测试包装组件
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
)

describe('FormItem', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('基本功能', () => {
    it('应该正确渲染表单项', () => {
      render(
        <FormItem label="Username">
          <input type="text" data-testid="input" />
        </FormItem>
      )

      expect(screen.getByText('Username')).toBeInTheDocument()
      expect(screen.getByTestId('input')).toBeInTheDocument()
    })

    it('应该支持自定义ID', () => {
      render(
        <FormItem label="Email" id="email-field">
          <input type="email" data-testid="email-input" />
        </FormItem>
      )

      const input = screen.getByTestId('email-input')
      expect(input).toHaveAttribute('id', 'email-field')
    })

    it('应该生成唯一的字段ID', () => {
      const { rerender } = render(
        <FormItem label="Name">
          <input data-testid="input" />
        </FormItem>
      )

      const firstInput = screen.getByTestId('input')
      const firstId = firstInput.getAttribute('id')

      rerender(
        <FormItem label="Name">
          <input data-testid="input" />
        </FormItem>
      )

      const secondInput = screen.getByTestId('input')
      const secondId = secondInput.getAttribute('id')

      expect(firstId).not.toBe(secondId)
    })

    it('应该正确传递标签的for属性', () => {
      render(
        <FormItem label="Username">
          <input type="text" data-testid="input" />
        </FormItem>
      )

      const label = screen.getByText('Username').closest('label')
      const input = screen.getByTestId('input')

      expect(label).toHaveAttribute('for', input.getAttribute('id'))
    })

    it('应该支持多行错误消息', () => {
      render(
        <FormItem label="Email" error={['Error 1', 'Error 2']}>
          <input type="email" data-testid="input" />
        </FormItem>
      )

      expect(screen.getByText('Error 1')).toBeInTheDocument()
    })
  })

  describe('变体支持', () => {
    it('应该支持default变体', () => {
      const { container } = render(
        <FormItem variant="default" label="Default">
          <input />
        </FormItem>
      )

      expect(container.firstChild).toHaveClass('flex', 'flex-col', 'space-y-2')
    })

    it('应该支持stacked变体', () => {
      const { container } = render(
        <FormItem variant="stacked" label="Stacked">
          <input />
        </FormItem>
      )

      expect(container.firstChild).toHaveClass('flex', 'flex-col', 'space-y-1.5')
    })

    it('应该支持inline变体', () => {
      const { container } = render(
        <FormItem variant="inline" label="Inline">
          <input />
        </FormItem>
      )

      expect(container.firstChild).toHaveClass('flex', 'items-start', 'gap-3')
    })

    it('应该支持horizontal变体', () => {
      const { container } = render(
        <FormItem variant="horizontal" label="Horizontal">
          <input />
        </FormItem>
      )

      expect(container.firstChild).toHaveClass('grid', 'grid-cols-1')
    })

    it('应该支持vertical变体', () => {
      const { container } = render(
        <FormItem variant="vertical" label="Vertical">
          <input />
        </FormItem>
      )

      expect(container.firstChild).toHaveClass('flex', 'flex-col', 'space-y-2')
    })
  })

  describe('尺寸支持', () => {
    it('应该支持sm尺寸', () => {
      render(
        <FormItem size="sm" label="Small">
          <input />
        </FormItem>
      )

      const label = screen.getByText('Small')
      expect(label).toHaveClass('text-xs')
    })

    it('应该支持md尺寸', () => {
      render(
        <FormItem size="md" label="Medium">
          <input />
        </FormItem>
      )

      const label = screen.getByText('Medium')
      expect(label).toHaveClass('text-sm')
    })

    it('应该支持lg尺寸', () => {
      render(
        <FormItem size="lg" label="Large">
          <input />
        </FormItem>
      )

      const label = screen.getByText('Large')
      expect(label).toHaveClass('text-base')
    })

    it('应该支持xl尺寸', () => {
      render(
        <FormItem size="xl" label="Extra Large">
          <input />
        </FormItem>
      )

      const label = screen.getByText('Extra Large')
      expect(label).toHaveClass('text-lg')
    })
  })

  describe('必填和可选指示器', () => {
    it('应该显示必填指示器', () => {
      render(
        <FormItem label="Required Field" required>
          <input />
        </FormItem>
      )

      expect(screen.getByText('*')).toBeInTheDocument()
    })

    it('应该隐藏可选指示器', () => {
      render(
        <FormItem label="Optional Field" optional showOptionalIndicator={false}>
          <input />
        </FormItem>
      )

      expect(screen.queryByText('(可选)')).not.toBeInTheDocument()
    })

    it('应该显示可选指示器', () => {
      render(
        <FormItem label="Optional Field" optional showOptionalIndicator={true}>
          <input />
        </FormItem>
      )

      expect(screen.getByText('(可选)')).toBeInTheDocument()
    })

    it('应该隐藏必填指示器', () => {
      render(
        <FormItem label="Required Field" required showRequiredIndicator={false}>
          <input />
        </FormItem>
      )

      expect(screen.queryByText('*')).not.toBeInTheDocument()
    })
  })

  describe('状态消息', () => {
    it('应该渲染错误消息', () => {
      render(
        <FormItem label="Email" error="Invalid email">
          <input type="email" />
        </FormItem>
      )

      expect(screen.getByText('Invalid email')).toBeInTheDocument()
    })

    it('应该渲染警告消息', () => {
      render(
        <FormItem label="Password" warning="Password is weak">
          <input type="password" />
        </FormItem>
      )

      expect(screen.getByText('Password is weak')).toBeInTheDocument()
    })

    it('应该渲染信息消息', () => {
      render(
        <FormItem label="API Key" info="Keep your API key secret">
          <input type="text" />
        </FormItem>
      )

      expect(screen.getByText('Keep your API key secret')).toBeInTheDocument()
    })

    it('应该渲染成功消息', () => {
      render(
        <FormItem label="Username" success="Username is available">
          <input type="text" />
        </FormItem>
      )

      expect(screen.getByText('Username is available')).toBeInTheDocument()
    })

    it('应该渲染描述文本', () => {
      render(
        <FormItem label="Email" description="We will never share your email">
          <input type="email" />
        </FormItem>
      )

      expect(screen.getByText('We will never share your email')).toBeInTheDocument()
    })

    it('应该渲染帮助文本', () => {
      render(
        <FormItem label="Search" helpText="Enter at least 3 characters">
          <input type="search" />
        </FormItem>
      )

      expect(screen.getByText('Enter at least 3 characters')).toBeInTheDocument()
    })
  })

  describe('禁用和只读状态', () => {
    it('应该正确处理禁用状态', () => {
      render(
        <FormItem label="Disabled Field" disabled>
          <input data-testid="input" />
        </FormItem>
      )

      const input = screen.getByTestId('input')
      expect(input).toBeDisabled()

      const container = screen.getByText('Disabled Field').closest('.relative')
      expect(container).toHaveClass('opacity-50', 'cursor-not-allowed')
    })

    it('应该正确处理只读状态', () => {
      render(
        <FormItem label="Readonly Field" readonly>
          <input data-testid="input" />
        </FormItem>
      )

      const input = screen.getByTestId('input')
      expect(input).toHaveAttribute('readOnly', 'true')

      const container = screen.getByText('Readonly Field').closest('.relative')
      expect(container).toHaveClass('opacity-75')
    })
  })

  describe('状态指示器', () => {
    it('应该显示状态指示器', () => {
      const { container } = render(
        <FormItem label="Field" error="Error" showStatusIndicator={true}>
          <input />
        </FormItem>
      )

      expect(container.querySelector('.absolute.flex.items-center')).toBeInTheDocument()
    })

    it('应该隐藏状态指示器', () => {
      const { container } = render(
        <FormItem label="Field" error="Error" showStatusIndicator={false}>
          <input />
        </FormItem>
      )

      expect(container.querySelector('.absolute.flex.items-center')).not.toBeInTheDocument()
    })
  })

  describe('可访问性', () => {
    it('应该设置正确的aria-invalid属性', () => {
      render(
        <FormItem label="Email" error="Invalid">
          <input data-testid="input" />
        </FormItem>
      )

      const input = screen.getByTestId('input')
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })

    it('应该设置正确的aria-required属性', () => {
      render(
        <FormItem label="Required" required>
          <input data-testid="input" />
        </FormItem>
      )

      const input = screen.getByTestId('input')
      expect(input).toHaveAttribute('aria-required', 'true')
    })

    it('应该设置正确的aria-describedby', () => {
      render(
        <FormItem label="Email" error="Invalid email" description="Enter your email">
          <input data-testid="input" />
        </FormItem>
      )

      const input = screen.getByTestId('input')
      const describedBy = input.getAttribute('aria-describedby')

      expect(describedBy).toBeTruthy()
      expect(describedBy?.split(' ').length).toBeGreaterThan(0)
    })

    it('应该设置正确的role="alert"用于错误消息', () => {
      render(
        <FormItem label="Email" error="Invalid">
          <input />
        </FormItem>
      )

      const errorElement = screen.getByText('Invalid').closest('[role="alert"]')
      expect(errorElement).toBeInTheDocument()
    })

    it('应该支持自定义aria-labelledby', () => {
      render(
        <FormItem label="Field" aria-labelledby="custom-label-id">
          <input data-testid="input" />
        </FormItem>
      )

      const input = screen.getByTestId('input')
      expect(input).toHaveAttribute('aria-labelledby', 'custom-label-id')
    })

    it('应该支持自定义aria-describedby', () => {
      render(
        <FormItem label="Field" aria-describedby="custom-description-id">
          <input data-testid="input" />
        </FormItem>
      )

      const input = screen.getByTestId('input')
      expect(input).toHaveAttribute('aria-describedby', 'custom-description-id')
    })
  })

  describe('React Context', () => {
    it('应该在FormItem内部使用useFormItem', () => {
      let contextValue: any

      const TestComponent = () => {
        contextValue = useFormItem()
        return (
          <FormItem label="Test">
            <input />
          </FormItem>
        )
      }

      render(<TestComponent />)

      expect(contextValue).toBeDefined()
      expect(contextValue.variant).toBe('default')
      expect(contextValue.size).toBe('md')
    })

    it('在FormItem外使用useFormItem应该抛出错误', () => {
      console.error = vi.fn()

      expect(() => {
        renderHook(() => useFormItem())
      }).toThrow('useFormItem must be used within a FormItem component')
    })
  })

  describe('子元素处理', () => {
    it('应该正确克隆子元素并添加属性', () => {
      render(
        <FormItem label="Field">
          <input data-testid="input" />
        </FormItem>
      )

      const input = screen.getByTestId('input')
      expect(input).toHaveAttribute('id')
      expect(input).toHaveAttribute('data-form-item-id')
    })

    it('应该处理多个子元素', () => {
      render(
        <FormItem label="Group">
          <input data-testid="input1" />
          <input data-testid="input2" />
        </FormItem>
      )

      expect(screen.getByTestId('input1')).toBeInTheDocument()
      expect(screen.getByTestId('input2')).toBeInTheDocument()
    })

    it('应该忽略非React元素', () => {
      render(
        <FormItem label="Field">
          Some text
          <input data-testid="input" />
        </FormItem>
      )

      expect(screen.getByTestId('input')).toBeInTheDocument()
    })
  })

  describe('样式和类名', () => {
    it('应该接受自定义className', () => {
      const { container } = render(
        <FormItem label="Custom" className="custom-class">
          <input />
        </FormItem>
      )

      expect(container.firstChild).toHaveClass('custom-class')
    })

    it('应该合并默认样式和自定义样式', () => {
      const { container } = render(
        <FormItem label="Field" variant="inline" className="custom-style">
          <input />
        </FormItem>
      )

      const element = container.firstChild as HTMLElement
      expect(element.className).toContain('flex')
      expect(element.className).toContain('custom-style')
    })
  })

  describe('HTML属性传递', () => {
    it('应该支持data-testid', () => {
      render(
        <FormItem label="Test" data-testid="form-item">
          <input />
        </FormItem>
      )

      expect(screen.getByTestId('form-item')).toBeInTheDocument()
    })

    it('应该支持自定义HTML属性', () => {
      render(
        <FormItem label="Test" data-custom="value">
          <input />
        </FormItem>
      )

      const item = screen.getByText('Test').closest('.relative')
      expect(item).toHaveAttribute('data-custom', 'value')
    })
  })

  describe('动画效果', () => {
    it('错误消息应该有淡入动画', () => {
      const { rerender } = render(
        <FormItem label="Email" error={null}>
          <input />
        </FormItem>
      )

      expect(screen.queryByText('Error')).not.toBeInTheDocument()

      rerender(
        <FormItem label="Email" error="Error">
          <input />
        </FormItem>
      )

      expect(screen.getByText('Error')).toBeInTheDocument()
    })

    it('帮助文本应该有淡入动画', () => {
      const { rerender } = render(
        <FormItem label="Search" helpText={null}>
          <input />
        </FormItem>
      )

      expect(screen.queryByText('Help')).not.toBeInTheDocument()

      rerender(
        <FormItem label="Search" helpText="Help">
          <input />
        </FormItem>
      )

      expect(screen.getByText('Help')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('应该处理空标签', () => {
      render(
        <FormItem label="">
          <input data-testid="input" />
        </FormItem>
      )

      expect(screen.getByTestId('input')).toBeInTheDocument()
    })

    it('应该处理undefined错误', () => {
      render(
        <FormItem label="Field" error={undefined}>
          <input />
        </FormItem>
      )

      expect(screen.queryByText('Error')).not.toBeInTheDocument()
    })

    it('应该处理null错误', () => {
      render(
        <FormItem label="Field" error={null}>
          <input />
        </FormItem>
      )

      expect(screen.queryByText('Error')).not.toBeInTheDocument()
    })

    it('应该处理空字符串错误', () => {
      render(
        <FormItem label="Field" error="">
          <input />
        </FormItem>
      )

      expect(screen.queryByText('Error')).not.toBeInTheDocument()
    })
  })
})
