/**
 * @fileoverview ValidationSummary 组件单元测试
 * @author Xorigo UI Team
 * @version 0.1.0
 */

import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../../test/setup'
import { ValidationSummary, type ValidationSummaryItem } from './validation-summary'

// ==============================
// 测试数据
// ==============================

const mockItems: ValidationSummaryItem[] = [
  {
    id: 'email-error',
    name: 'email',
    label: '邮箱地址',
    message: '请输入有效的邮箱地址',
    status: 'error',
    severity: 'major',
    code: 'INVALID_EMAIL',
    group: '基本信息',
    fieldId: 'email-input'
  },
  {
    id: 'password-error',
    name: 'password',
    label: '密码',
    message: '密码至少需要 8 个字符',
    status: 'error',
    severity: 'critical',
    code: 'PASSWORD_TOO_SHORT',
    group: '基本信息',
    fieldId: 'password-input'
  },
  {
    id: 'phone-warning',
    name: 'phone',
    label: '手机号',
    message: '建议使用手机号码格式：13800138000',
    status: 'warning',
    severity: 'minor',
    group: '联系信息'
  },
  {
    id: 'address-error',
    name: 'address',
    label: '地址',
    message: '请输入完整的地址信息',
    status: 'error',
    severity: 'major',
    group: '联系信息'
  }
]

// ==============================
// 测试套件
// ==============================

describe('ValidationSummary', () => {
  // 基础渲染测试
  describe('基础渲染', () => {
    it('应该正确渲染默认状态的组件', () => {
      render(<ValidationSummary items={mockItems} />)

      expect(screen.getByText('校验错误')).toBeInTheDocument()
      expect(screen.getByText('4 个错误')).toBeInTheDocument()
    })

    it('应该正确渲染自定义标题', () => {
      render(<ValidationSummary items={mockItems} title="表单校验失败" />)

      expect(screen.getByText('表单校验失败')).toBeInTheDocument()
    })

    it('当没有错误时应该不渲染（默认）', () => {
      render(<ValidationSummary items={[]} />)

      expect(screen.queryByText('校验错误')).not.toBeInTheDocument()
    })

    it('当 hideWhenEmpty=false 时应该渲染空状态', () => {
      render(<ValidationSummary items={[]} hideWhenEmpty={false} />)

      expect(screen.getByText('校验错误')).toBeInTheDocument()
      expect(screen.getByText('0 个错误')).toBeInTheDocument()
    })

    it('应该根据严重程度显示正确的图标和样式', () => {
      const { rerender } = render(<ValidationSummary items={mockItems} severity="critical" />)
      expect(screen.getByRole('alert')).toHaveClass('border-l-red-600')

      rerender(<ValidationSummary items={mockItems} severity="major" />)
      expect(screen.getByRole('alert')).toHaveClass('border-l-yellow-600')

      rerender(<ValidationSummary items={mockItems} severity="minor" />)
      expect(screen.getByRole('alert')).toHaveClass('border-l-blue-600')
    })
  })

  // 可见性测试
  describe('可见性控制', () => {
    it('当 visible=false 时应该不渲染', () => {
      render(<ValidationSummary items={mockItems} visible={false} />)

      expect(screen.queryByText('校验错误')).not.toBeInTheDocument()
    })

    it('当 visible=true 时应该渲染', () => {
      render(<ValidationSummary items={mockItems} visible={true} />)

      expect(screen.getByText('校验错误')).toBeInTheDocument()
    })
  })

  // 错误项目测试
  describe('错误项目显示', () => {
    it('应该显示所有错误项目', () => {
      render(<ValidationSummary items={mockItems} />)

      expect(screen.getByText('请输入有效的邮箱地址')).toBeInTheDocument()
      expect(screen.getByText('密码至少需要 8 个字符')).toBeInTheDocument()
      expect(screen.getByText('建议使用手机号码格式：13800138000')).toBeInTheDocument()
      expect(screen.getByText('请输入完整的地址信息')).toBeInTheDocument()
    })

    it('应该显示字段标签', () => {
      render(<ValidationSummary items={mockItems} />)

      expect(screen.getByText('邮箱地址')).toBeInTheDocument()
      expect(screen.getByText('密码')).toBeInTheDocument()
      expect(screen.getByText('手机号')).toBeInTheDocument()
    })

    it('应该显示错误代码', () => {
      render(<ValidationSummary items={mockItems} />)

      expect(screen.getByText('INVALID_EMAIL')).toBeInTheDocument()
      expect(screen.getByText('PASSWORD_TOO_SHORT')).toBeInTheDocument()
    })

    it('应该显示最大行数限制的项目', () => {
      render(<ValidationSummary items={mockItems} maxItems={2} />)

      expect(screen.getByText('请输入有效的邮箱地址')).toBeInTheDocument()
      expect(screen.getByText('密码至少需要 8 个字符')).toBeInTheDocument()
      expect(screen.queryByText('建议使用手机号码格式')).not.toBeInTheDocument()
    })

    it('当超过最大行数时应该显示"显示更多"按钮', () => {
      render(<ValidationSummary items={mockItems} maxItems={2} onShowMore={vi.fn()} />)

      expect(screen.getByText('显示更多')).toBeInTheDocument()
      expect(screen.getByText('+2')).toBeInTheDocument()
    })
  })

  // 分组模式测试
  describe('分组模式', () => {
    it('应该正确分组错误项目', () => {
      render(<ValidationSummary items={mockItems} grouped={true} />)

      expect(screen.getByText('基本信息')).toBeInTheDocument()
      expect(screen.getByText('联系信息')).toBeInTheDocument()
      expect(screen.getByText('(2)')).toBeInTheDocument()
    })

    it('默认应该展开 default 分组', () => {
      render(<ValidationSummary items={mockItems} grouped={true} />)

      // default 分组应该展开，显示其内容
      expect(screen.getByText('请输入有效的邮箱地址')).toBeInTheDocument()
    })

    it('点击分组标题应该切换展开/折叠状态', async () => {
      render(<ValidationSummary items={mockItems} grouped={true} />)

      const groupHeader = screen.getByText('基本信息').closest('button')
      expect(groupHeader).toBeInTheDocument()

      if (groupHeader) {
        fireEvent.click(groupHeader)

        await waitFor(() => {
          // 折叠后错误应该不可见
          expect(screen.queryByText('请输入有效的邮箱地址')).not.toBeInTheDocument()
        })
      }
    })

    it('应该正确处理 defaultExpandedGroups', () => {
      render(
        <ValidationSummary
          items={mockItems}
          grouped={true}
          defaultExpandedGroups={['基本信息']}
        />
      )

      // 基本信息分组应该展开
      expect(screen.getByText('请输入有效的邮箱地址')).toBeInTheDocument()
    })
  })

  // 导航功能测试
  describe('导航功能', () => {
    it('应该为有 fieldId 的项目显示跳转按钮', () => {
      render(<ValidationSummary items={mockItems} />)

      // 邮箱和密码错误应该有跳转按钮（它们有 fieldId）
      const buttons = screen.getAllByLabelText(/跳转到字段/)
      expect(buttons.length).toBeGreaterThanOrEqual(2)
    })

    it('点击跳转按钮应该调用 onNavigateToField', async () => {
      const onNavigate = vi.fn()
      render(<ValidationSummary items={mockItems} onNavigateToField={onNavigate} />)

      const button = screen.getByLabelText('跳转到字段: 邮箱地址')
      fireEvent.click(button)

      await waitFor(() => {
        expect(onNavigate).toHaveBeenCalledWith(mockItems[0])
      })
    })

    it('当 disableNavigation=true 时不应该显示跳转按钮', () => {
      render(<ValidationSummary items={mockItems} disableNavigation={true} />)

      expect(screen.queryByLabelText(/跳转到字段/)).not.toBeInTheDocument()
    })

    it('当没有 onNavigateToField 时应该直接聚焦到 fieldId 元素', async () => {
      // 模拟 DOM 环境
      const mockFocus = vi.fn()
      const mockElement = { focus: mockFocus, scrollIntoView: vi.fn() }
      vi.spyOn(document, 'getElementById').mockReturnValue(mockElement as any)

      render(<ValidationSummary items={mockItems} />)

      const button = screen.getByLabelText('跳转到字段: 邮箱地址')
      fireEvent.click(button)

      await waitFor(() => {
        expect(document.getElementById).toHaveBeenCalledWith('email-input')
        expect(mockFocus).toHaveBeenCalled()
      })

      vi.restoreAllMocks()
    })
  })

  // 关闭功能测试
  describe('关闭功能', () => {
    it('当 dismissible=true 时应该显示关闭按钮', () => {
      render(<ValidationSummary items={mockItems} dismissible={true} />)

      expect(screen.getByLabelText('关闭错误汇总')).toBeInTheDocument()
    })

    it('点击关闭按钮应该调用 onDismiss', () => {
      const onDismiss = vi.fn()
      render(<ValidationSummary items={mockItems} dismissible={true} onDismiss={onDismiss} />)

      const button = screen.getByLabelText('关闭错误汇总')
      fireEvent.click(button)

      expect(onDismiss).toHaveBeenCalled()
    })
  })

  // 复制功能测试
  describe('复制功能', () => {
    beforeEach(() => {
      // 模拟 clipboard API
      Object.assign(navigator, {
        clipboard: {
          writeText: vi.fn().mockResolvedValue(undefined)
        }
      })
    })

    it('应该显示复制按钮', () => {
      render(<ValidationSummary items={mockItems} />)

      expect(screen.getByText('复制错误')).toBeInTheDocument()
    })

    it('点击复制按钮应该复制错误到剪贴板', async () => {
      render(<ValidationSummary items={mockItems} />)

      const button = screen.getByText('复制错误')
      fireEvent.click(button)

      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalled()
        // 检查复制的内容
        const callArgs = (navigator.clipboard.writeText as vi.MockedFunction<typeof navigator.clipboard.writeText>).mock.calls[0]
        const copiedText = callArgs[0]
        expect(copiedText).toContain('邮箱地址')
        expect(copiedText).toContain('请输入有效的邮箱地址')
      })
    })

    it('复制成功后应该显示"已复制"状态', async () => {
      render(<ValidationSummary items={mockItems} />)

      const button = screen.getByText('复制错误')
      fireEvent.click(button)

      await waitFor(() => {
        expect(screen.getByText('已复制')).toBeInTheDocument()
      })
    })
  })

  // 自动滚动测试
  describe('自动滚动', () => {
    it('当 autoScroll=true 时应该自动滚动到组件', async () => {
      const scrollToMock = vi.fn()
      window.scrollTo = scrollToMock

      const { rerender } = render(
        <ValidationSummary
          id="test-summary"
          items={[]}
          autoScroll={false}
        />
      )

      expect(scrollToMock).not.toHaveBeenCalled()

      rerender(
        <ValidationSummary
          id="test-summary"
          items={mockItems}
          autoScroll={true}
        />
      )

      await waitFor(() => {
        expect(scrollToMock).toHaveBeenCalledWith({
          top: expect.any(Number),
          behavior: 'smooth'
        })
      })

      window.scrollTo = vi.fn()
    })

    it('应该使用自定义滚动偏移', async () => {
      const scrollToMock = vi.fn()
      window.scrollTo = scrollToMock

      render(
        <ValidationSummary
          id="test-summary"
          items={mockItems}
          autoScroll={true}
          scrollOffset={100}
        />
      )

      await waitFor(() => {
        const call = scrollToMock.mock.calls[0][0]
        expect(call.top).toBeGreaterThan(0)
      })

      window.scrollTo = vi.fn()
    })
  })

  // 变体和尺寸测试
  describe('变体和尺寸', () => {
    it('应该支持不同的变体', () => {
      const { rerender } = render(<ValidationSummary items={mockItems} variant="default" />)
      expect(screen.getByRole('alert')).toHaveClass('border-red-200', 'bg-red-50')

      rerender(<ValidationSummary items={mockItems} variant="warning" />)
      expect(screen.getByRole('alert')).toHaveClass('border-yellow-200', 'bg-yellow-50')

      rerender(<ValidationSummary items={mockItems} variant="info" />)
      expect(screen.getByRole('alert')).toHaveClass('border-blue-200', 'bg-blue-50')

      rerender(<ValidationSummary items={mockItems} variant="success" />)
      expect(screen.getByRole('alert')).toHaveClass('border-green-200', 'bg-green-50')
    })

    it('应该支持不同的尺寸', () => {
      const { rerender } = render(<ValidationSummary items={mockItems} size="sm" />)
      expect(screen.getByRole('alert')).toHaveClass('text-sm', 'p-3')

      rerender(<ValidationSummary items={mockItems} size="md" />)
      expect(screen.getByRole('alert')).toHaveClass('text-sm', 'p-4')

      rerender(<ValidationSummary items={mockItems} size="lg" />)
      expect(screen.getByRole('alert')).toHaveClass('text-base', 'p-5')
    })

    it('应该支持不同的布局模式', () => {
      const { rerender } = render(<ValidationSummary items={mockItems} layout="list" />)
      expect(screen.getByRole('alert')).toHaveClass('space-y-2')

      rerender(<ValidationSummary items={mockItems} layout="grouped" />)
      expect(screen.getByRole('alert')).toHaveClass('space-y-4')

      rerender(<ValidationSummary items={mockItems} layout="compact" />)
      expect(screen.getByRole('alert')).toHaveClass('space-y-1')
    })
  })

  // 自定义图标测试
  describe('自定义图标', () => {
    it('应该支持自定义图标', () => {
      const customIcon = <span data-testid="custom-icon">🎯</span>
      render(<ValidationSummary items={mockItems} icon={customIcon} />)

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
    })

    it('应该支持为单个项目设置自定义图标', () => {
      const customItemIcon = <span data-testid="custom-item-icon">⚠️</span>
      const itemsWithCustomIcon = [
        {
          ...mockItems[0],
          icon: customItemIcon
        }
      ]

      render(<ValidationSummary items={itemsWithCustomIcon} />)

      expect(screen.getByTestId('custom-item-icon')).toBeInTheDocument()
    })
  })

  // 可访问性测试
  describe('可访问性', () => {
    it('应该具有正确的 ARIA 角色', () => {
      render(<ValidationSummary items={mockItems} />)

      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('应该具有 aria-live 属性', () => {
      render(<ValidationSummary items={mockItems} />)

      expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'polite')
    })

    it('应该具有可访问的标签', () => {
      render(<ValidationSummary items={mockItems} title="表单校验结果" />)

      const alert = screen.getByRole('alert')
      expect(alert).toHaveAttribute('aria-label', '表单校验结果')
    })

    it('跳转按钮应该具有可访问的标签', () => {
      render(<ValidationSummary items={mockItems} />)

      expect(screen.getByLabelText('跳转到字段: 邮箱地址')).toBeInTheDocument()
    })

    it('关闭按钮应该具有可访问的标签', () => {
      render(<ValidationSummary items={mockItems} dismissible={true} />)

      expect(screen.getByLabelText('关闭错误汇总')).toBeInTheDocument()
    })

    it('复制按钮应该具有可访问的标签', () => {
      render(<ValidationSummary items={mockItems} />)

      expect(screen.getByLabelText('复制错误消息')).toBeInTheDocument()
    })
  })

  // 自定义样式测试
  describe('自定义样式', () => {
    it('应该接受自定义 className', () => {
      render(<ValidationSummary items={mockItems} className="custom-class" />)

      expect(screen.getByRole('alert')).toHaveClass('custom-class')
    })

    it('应该接受自定义 ID', () => {
      render(<ValidationSummary items={mockItems} id="custom-id" />)

      expect(screen.getByRole('alert')).toHaveAttribute('id', 'custom-id')
    })
  })

  // 动画测试
  describe('动画效果', () => {
    it('应该具有进入动画', () => {
      const { container } = render(<ValidationSummary items={mockItems} />)

      const element = container.firstChild as HTMLElement
      expect(element).toHaveStyle({
        opacity: '1',
        transform: 'translateY(0px)'
      })
    })

    it('应该具有项目动画', () => {
      const { container } = render(<ValidationSummary items={mockItems} />)

      const items = container.querySelectorAll('[data-testid*="validation-summary"]')
      // 验证项目存在
      expect(items.length).toBeGreaterThan(0)
    })
  })

  // 计数显示测试
  describe('计数显示', () => {
    it('默认应该显示错误计数', () => {
      render(<ValidationSummary items={mockItems} />)

      expect(screen.getByText('4 个错误')).toBeInTheDocument()
    })

    it('应该支持自定义计数文本模板', () => {
      render(<ValidationSummary
        items={mockItems}
        countTemplate="发现 {count} 处问题"
      />)

      expect(screen.getByText('发现 4 处问题')).toBeInTheDocument()
    })

    it('当 hideCount=true 时不应该显示计数', () => {
      render(<ValidationSummary items={mockItems} hideCount={true} />)

      expect(screen.queryByText(/个错误/)).not.toBeInTheDocument()
    })
  })

  // 边界情况测试
  describe('边界情况', () => {
    it('应该处理空消息的项目', () => {
      const itemsWithEmptyMessage = [
        {
          id: 'empty-msg',
          name: 'field',
          message: ''
        }
      ]

      render(<ValidationSummary items={itemsWithEmptyMessage} />)

      // 空消息的项目不应该渲染
      expect(screen.queryByText('')).not.toBeInTheDocument()
    })

    it('应该处理没有标签的项目', () => {
      const itemsWithoutLabel = [
        {
          id: 'no-label',
          message: '这是一个错误'
        }
      ]

      render(<ValidationSummary items={itemsWithoutLabel} />)

      expect(screen.getByText('这是一个错误')).toBeInTheDocument()
    })

    it('应该处理嵌套分组', () => {
      const itemsWithNestedGroups = [
        {
          id: 'item1',
          message: '错误 1',
          group: '分组 A'
        },
        {
          id: 'item2',
          message: '错误 2',
          group: '分组 A'
        },
        {
          id: 'item3',
          message: '错误 3',
          group: '分组 B'
        }
      ]

      render(<ValidationSummary items={itemsWithNestedGroups} grouped={true} />)

      expect(screen.getByText('分组 A')).toBeInTheDocument()
      expect(screen.getByText('分组 B')).toBeInTheDocument()
    })
  })

  // 性能测试
  describe('性能优化', () => {
    it('应该使用 React.memo 优化渲染', () => {
      const ValidationSummaryComponent = ValidationSummary
      expect(ValidationSummaryComponent.displayName).toBe('ValidationSummary')
    })

    it('应该在项目数量变化时正确更新', () => {
      const { rerender } = render(<ValidationSummary items={mockItems.slice(0, 2)} />)

      expect(screen.getByText('2 个错误')).toBeInTheDocument()

      rerender(<ValidationSummary items={mockItems} />)

      expect(screen.getByText('4 个错误')).toBeInTheDocument()
    })
  })

  // 主题系统集成测试
  describe('主题系统集成', () => {
    it('应该在深色模式下正确渲染', () => {
      // 模拟深色模式
      document.documentElement.classList.add('dark')

      const { container } = render(<ValidationSummary items={mockItems} />)

      const alert = screen.getByRole('alert')
      expect(alert).toHaveClass('dark:border-red-800/50', 'dark:bg-red-900/20')

      document.documentElement.classList.remove('dark')
    })
  })
})
