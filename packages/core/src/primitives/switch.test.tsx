/**
 * @fileoverview Switch 组件测试
 * @description 验证 Switch 组件的功能特性、尺寸、状态和可访问性
 *
 * @author Xorigo UI Team
 * @version 1.0.0
 * @since 2025-11-05
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Switch } from './Switch'

// =============================================================================
// 基础渲染测试
// =============================================================================

describe('Switch', () => {
  describe('基础渲染', () => {
    it('应该正确渲染 Switch 组件', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('checkbox')
      expect(switchElement).toBeInTheDocument()
    })

    it('应该支持 ref 转发', () => {
      const ref = React.createRef<HTMLInputElement>()
      render(<Switch ref={ref} />)

      expect(ref.current).toBeInstanceOf(HTMLInputElement)
    })

    it('应该支持自定义 className', () => {
      render(<Switch className="custom-class" />)
      const label = screen.getByRole('checkbox').closest('label')
      expect(label).toHaveClass('custom-class')
    })
  })

  // =============================================================================
  // 受控与非受控测试
  // =============================================================================

  describe('受控与非受控测试', () => {
    it('应该支持受控模式 - 未选中', () => {
      render(<Switch checked={false} />)
      const switchElement = screen.getByRole('checkbox')
      expect(switchElement).not.toBeChecked()
    })

    it('应该支持受控模式 - 已选中', () => {
      render(<Switch checked={true} />)
      const switchElement = screen.getByRole('checkbox')
      expect(switchElement).toBeChecked()
    })

    it('应该支持非受控模式', () => {
      render(<Switch defaultChecked />)
      const switchElement = screen.getByRole('checkbox')
      expect(switchElement).toBeChecked()
    })

    it('受控模式下应该调用 onCheckedChange', async () => {
      const handleChange = vi.fn()
      render(<Switch checked={false} onCheckedChange={handleChange} />)

      const switchElement = screen.getByRole('checkbox')
      await userEvent.click(switchElement)

      expect(handleChange).toHaveBeenCalledWith(true)
    })
  })

  // =============================================================================
  // 尺寸测试
  // =============================================================================

  describe('尺寸测试', () => {
    it('应该支持 small 尺寸', () => {
      render(<Switch size="sm" />)
      const switchContainer = screen.getByRole('checkbox').nextElementSibling
      expect(switchContainer).toHaveClass('w-8', 'h-4')
    })

    it('应该支持 medium 尺寸', () => {
      render(<Switch size="md" />)
      const switchContainer = screen.getByRole('checkbox').nextElementSibling
      expect(switchContainer).toHaveClass('w-11', 'h-6')
    })

    it('应该支持 large 尺寸', () => {
      render(<Switch size="lg" />)
      const switchContainer = screen.getByRole('checkbox').nextElementSibling
      expect(switchContainer).toHaveClass('w-14', 'h-8')
    })
  })

  // =============================================================================
  // 事件处理测试
  // =============================================================================

  describe('事件处理测试', () => {
    it('应该处理 onChange 事件', async () => {
      const handleChange = vi.fn()
      render(<Switch onChange={handleChange} />)

      const switchElement = screen.getByRole('checkbox')
      await userEvent.click(switchElement)

      expect(handleChange).toHaveBeenCalledTimes(1)
    })

    it('应该处理 onCheckedChange 事件', async () => {
      const handleCheckedChange = vi.fn()
      render(<Switch onCheckedChange={handleCheckedChange} />)

      const switchElement = screen.getByRole('checkbox')
      await userEvent.click(switchElement)

      expect(handleCheckedChange).toHaveBeenCalledWith(true)
    })

    it('应该同时处理 onChange 和 onCheckedChange', async () => {
      const handleChange = vi.fn()
      const handleCheckedChange = vi.fn()
      render(<Switch onChange={handleChange} onCheckedChange={handleCheckedChange} />)

      const switchElement = screen.getByRole('checkbox')
      await userEvent.click(switchElement)

      expect(handleChange).toHaveBeenCalledTimes(1)
      expect(handleCheckedChange).toHaveBeenCalledWith(true)
    })

    it('应该处理键盘事件（Space）', async () => {
      const handleCheckedChange = vi.fn()
      render(<Switch onCheckedChange={handleCheckedChange} />)

      const switchElement = screen.getByRole('checkbox')
      switchElement.focus()
      await userEvent.keyboard(' ')

      expect(handleCheckedChange).toHaveBeenCalledWith(true)
    })

    it('应该处理键盘事件（Enter）', async () => {
      const handleCheckedChange = vi.fn()
      render(<Switch onCheckedChange={handleCheckedChange} />)

      const switchElement = screen.getByRole('checkbox')
      switchElement.focus()
      await userEvent.keyboard('{Enter}')

      expect(handleCheckedChange).toHaveBeenCalledWith(true)
    })
  })

  // =============================================================================
  // 状态测试
  // =============================================================================

  describe('状态测试', () => {
    it('应该支持 disabled 状态', () => {
      render(<Switch disabled />)
      const switchElement = screen.getByRole('checkbox')
      expect(switchElement).toBeDisabled()
    })

    it('禁用状态下不应该触发点击事件', async () => {
      const handleCheckedChange = vi.fn()
      render(<Switch disabled onCheckedChange={handleCheckedChange} />)

      const switchElement = screen.getByRole('checkbox')
      await userEvent.click(switchElement)

      expect(handleCheckedChange).not.toHaveBeenCalled()
    })

    it('禁用状态下不应该触发键盘事件', async () => {
      const handleCheckedChange = vi.fn()
      render(<Switch disabled onCheckedChange={handleCheckedChange} />)

      const switchElement = screen.getByRole('checkbox')
      switchElement.focus()
      await userEvent.keyboard(' ')

      expect(handleCheckedChange).not.toHaveBeenCalled()
    })

    it('应该支持 readonly 状态', () => {
      render(<Switch readOnly defaultChecked />)
      const switchElement = screen.getByRole('checkbox')
      expect(switchElement).toHaveAttribute('readonly')
      expect(switchElement).toBeChecked()
    })
  })

  // =============================================================================
  // 可访问性测试
  // =============================================================================

  describe('可访问性测试', () {
    it('应该具有正确的 role', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('checkbox')
      expect(switchElement).toBeInTheDocument()
    })

    it('应该支持 aria-label', () => {
      render(<Switch aria-label="自定义标签" />)
      const switchElement = screen.getByRole('checkbox')
      expect(switchElement).toHaveAttribute('aria-label', '自定义标签')
    })

    it('应该支持 aria-labelledby', () => {
      render(
        <>
          <label id="label-id">开关标签</label>
          <Switch aria-labelledby="label-id" />
        </>
      )
      const switchElement = screen.getByRole('checkbox')
      expect(switchElement).toHaveAttribute('aria-labelledby', 'label-id')
    })

    it('应该支持 aria-describedby', () => {
      render(
        <>
          <div id="description">开关描述</div>
          <Switch aria-describedby="description" />
        </>
      )
      const switchElement = screen.getByRole('checkbox')
      expect(switchElement).toHaveAttribute('aria-describedby', 'description')
    })

    it('选中状态下应该设置 aria-checked', () => {
      render(<Switch defaultChecked />)
      const switchElement = screen.getByRole('checkbox')
      expect(switchElement).toHaveAttribute('aria-checked', 'true')
    })

    it('未选中状态下应该设置 aria-checked', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('checkbox')
      expect(switchElement).toHaveAttribute('aria-checked', 'false')
    })

    it('禁用状态下应该设置 aria-disabled', () => {
      render(<Switch disabled />)
      const switchElement = screen.getByRole('checkbox')
      expect(switchElement).toHaveAttribute('aria-disabled', 'true')
    })
  })

  // =============================================================================
  // HTML 属性透传测试
  // =============================================================================

  describe('HTML 属性透传测试', () {
    it('应该支持 name 属性', () => {
      render(<Switch name="switch-name" />)
      const switchElement = screen.getByRole('checkbox')
      expect(switchElement).toHaveAttribute('name', 'switch-name')
    })

    it('应该支持 value 属性', () => {
      render(<Switch value="switch-value" />)
      const switchElement = screen.getByRole('checkbox')
      expect(switchElement).toHaveAttribute('value', 'switch-value')
    })

    it('应该支持 id 属性', () => {
      render(<Switch id="switch-id" />)
      const switchElement = screen.getByRole('checkbox')
      expect(switchElement).toHaveAttribute('id', 'switch-id')
    })

    it('应该支持 data-* 属性', () => {
      render(<Switch data-testid="custom-test-id" />)
      const switchElement = screen.getByRole('checkbox')
      expect(switchElement).toHaveAttribute('data-testid', 'custom-test-id')
    })
  })

  // =============================================================================
  // 视觉状态测试
  // =============================================================================

  describe('视觉状态测试', () => {
    it('未选中状态应该有正确的样式', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('checkbox')
      const container = switchElement.nextElementSibling
      expect(container).toHaveClass('bg-gray-200')
    })

    it('选中状态应该有正确的样式', () => {
      render(<Switch defaultChecked />)
      const switchElement = screen.getByRole('checkbox')
      const container = switchElement.nextElementSibling
      expect(container).toHaveClass('bg-blue-600')
    })

    it('应该有滑块动画效果', () => {
      render(<Switch defaultChecked />)
      const switchElement = screen.getByRole('checkbox')
      const thumb = container.querySelector('div:last-child')
      expect(thumb).toBeInTheDocument()
    })
  })

  // =============================================================================
  // 边缘情况测试
  // =============================================================================

  describe('边缘情况测试', () => {
    it('应该处理 label 作为包裹元素', () => {
      render(
        <label>
          <Switch />
          <span>开关标签</span>
        </label>
      )

      expect(screen.getByText('开关标签')).toBeInTheDocument()
    })

    it('应该处理组合 className', () => {
      render(<Switch className="class1 class2" />)
      const label = screen.getByRole('checkbox').closest('label')
      expect(label).toHaveClass('class1', 'class2')
    })

    it('应该处理快速连续点击', async () => {
      const handleCheckedChange = vi.fn()
      render(<Switch onCheckedChange={handleCheckedChange} />)

      const switchElement = screen.getByRole('checkbox')
      await userEvent.click(switchElement)
      await userEvent.click(switchElement)

      expect(handleCheckedChange).toHaveBeenCalledTimes(2)
    })

    it('应该处理受控状态下的强制更新', async () => {
      const TestComponent = () => {
        const [checked, setChecked] = React.useState(false)
        return (
          <>
            <Switch
              checked={checked}
              onCheckedChange={(c) => setChecked(c)}
            />
            <button onClick={() => setChecked(true)}>强制开启</button>
          </>
        )
      }

      render(<TestComponent />)

      const switchElement = screen.getByRole('checkbox')
      expect(switchElement).not.toBeChecked()

      const button = screen.getByRole('button', { name: '强制开启' })
      await userEvent.click(button)

      expect(switchElement).toBeChecked()
    })

    it('应该支持大小写的交替', async () => {
      const handleCheckedChange = vi.fn()
      render(<Switch onCheckedChange={handleCheckedChange} />)

      const switchElement = screen.getByRole('checkbox')

      // 第一次点击 - 开启
      await userEvent.click(switchElement)
      expect(handleCheckedChange).toHaveBeenCalledWith(true)

      // 第二次点击 - 关闭
      await userEvent.click(switchElement)
      expect(handleCheckedChange).toHaveBeenCalledWith(false)
    })
  })

  // =============================================================================
  // 性能测试
  // =============================================================================

  describe('性能测试', () => {
    it('应该支持快速渲染多个实例', () => {
      const switches = Array.from({ length: 10 }, (_, i) => (
        <Switch key={i} id={`switch-${i}`} />
      ))
      render(<div>{switches}</div>)

      for (let i = 0; i < 10; i++) {
        const switchElement = screen.getByRole('checkbox', { id: `switch-${i}` })
        expect(switchElement).toBeInTheDocument()
      }
    })
  })
})
