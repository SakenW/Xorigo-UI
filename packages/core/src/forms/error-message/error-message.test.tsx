/**
 * @fileoverview ErrorMessage 组件单元测试
 * @description 测试 ErrorMessage 组件的渲染、交互和可访问性
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { composeStories } from '@storybook/react'
import * as stories from './error-message.stories'

// 导入要测试的组件
import { ErrorMessage, ErrorMessageList, ErrorMessageGroup } from './error-message'

// 提取所有故事
const { Default, WithActions, Dismissible, MultipleMessages } = composeStories(stories)

describe('ErrorMessage 组件', () => {
  describe('基础渲染测试', () => {
    it('应该渲染基本的错误消息', () => {
      render(<ErrorMessage content="这是一个错误消息" />)
      expect(screen.getByText('这是一个错误消息')).toBeInTheDocument()
    })

    it('应该渲染不同状态的错误消息', () => {
      const { rerender } = render(<ErrorMessage content="默认错误" variant="default" />)
      expect(screen.getByText('默认错误')).toBeInTheDocument()

      rerender(<ErrorMessage content="破坏性错误" variant="destructive" />)
      expect(screen.getByText('破坏性错误')).toBeInTheDocument()

      rerender(<ErrorMessage content="警告消息" variant="warning" />)
      expect(screen.getByText('警告消息')).toBeInTheDocument()

      rerender(<ErrorMessage content="信息提示" variant="info" />)
      expect(screen.getByText('信息提示')).toBeInTheDocument()

      rerender(<ErrorMessage content="成功消息" variant="success" />)
      expect(screen.getByText('成功消息')).toBeInTheDocument()
    })

    it('应该渲染不同严重程度的错误', () => {
      const { rerender } = render(<ErrorMessage content="严重错误" severity="critical" />)
      expect(screen.getByText('严重错误')).toBeInTheDocument()

      rerender(<ErrorMessage content="重要错误" severity="major" />)
      expect(screen.getByText('重要错误')).toBeInTheDocument()

      rerender(<ErrorMessage content="轻微错误" severity="minor" />)
      expect(screen.getByText('轻微错误')).toBeInTheDocument()

      rerender(<ErrorMessage content="信息提示" severity="info" />)
      expect(screen.getByText('信息提示')).toBeInTheDocument()
    })

    it('应该显示错误代码', () => {
      render(<ErrorMessage content="错误消息" code="ERR_001" />)
      expect(screen.getByText('ERR_001')).toBeInTheDocument()
    })
  })

  describe('图标测试', () => {
    it('默认应该显示图标', () => {
      render(<ErrorMessage content="错误消息" />)
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.queryByRole('img', { hidden: true }) || screen.getByLabelText('')).toBeTruthy()
    })

    it('可以隐藏图标', () => {
      render(<ErrorMessage content="错误消息" showIcon={false} />)
      // 验证图标不存在（通过检查容器结构）
      const alert = screen.getByRole('alert')
      expect(alert.children.length).toBe(1) // 只有一个内容容器，没有图标
    })

    it('可以显示自定义图标', () => {
      const customIcon = <div data-testid="custom-icon">🔴</div>
      render(<ErrorMessage content="错误消息" icon={customIcon} />)
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
    })
  })

  describe('操作按钮测试', () => {
    it('应该渲染操作按钮', () => {
      const handleClick = vi.fn()
      render(
        <ErrorMessage
          content="错误消息"
          actions={[
            { text: '重试', onClick: handleClick },
          ]}
        />
      )
      expect(screen.getByText('重试')).toBeInTheDocument()

      fireEvent.click(screen.getByText('重试'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('应该禁用操作按钮当组件禁用时', () => {
      const handleClick = vi.fn()
      render(
        <ErrorMessage
          content="错误消息"
          disabled={true}
          actions={[
            { text: '重试', onClick: handleClick },
          ]}
        />
      )
      const button = screen.getByText('重试')
      expect(button).toBeDisabled()

      fireEvent.click(button)
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('应该渲染带图标的操作按钮', () => {
      const CustomIcon = () => <span data-testid="action-icon">↻</span>
      render(
        <ErrorMessage
          content="错误消息"
          actions={[
            { text: '重试', onClick: vi.fn(), icon: <CustomIcon /> },
          ]}
        />
      )
      expect(screen.getByTestId('action-icon')).toBeInTheDocument()
    })
  })

  describe('可关闭测试', () => {
    it('应该显示关闭按钮', () => {
      const handleDismiss = vi.fn()
      render(
        <ErrorMessage
          content="错误消息"
          dismissible={true}
          onDismiss={handleDismiss}
        />
      )
      expect(screen.getByLabelText('关闭错误消息')).toBeInTheDocument()
    })

    it('点击关闭按钮应该触发回调', () => {
      const handleDismiss = vi.fn()
      render(
        <ErrorMessage
          content="错误消息"
          dismissible={true}
          onDismiss={handleDismiss}
        />
      )

      fireEvent.click(screen.getByLabelText('关闭错误消息'))
      expect(handleDismiss).toHaveBeenCalledTimes(1)
    })

    it('禁用状态下不应该触发关闭', () => {
      const handleDismiss = vi.fn()
      render(
        <ErrorMessage
          content="错误消息"
          dismissible={true}
          onDismiss={handleDismiss}
          disabled={true}
        />
      )

      fireEvent.click(screen.getByLabelText('关闭错误消息'))
      expect(handleDismiss).not.toHaveBeenCalled()
    })
  })

  describe('可访问性测试', () => {
    it('应该设置正确的ARIA角色', () => {
      render(<ErrorMessage content="错误消息" />)
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('应该设置aria-live为assertive', () => {
      render(<ErrorMessage content="错误消息" />)
      const alert = screen.getByRole('alert')
      expect(alert).toHaveAttribute('aria-live', 'assertive')
    })

    it('应该正确关联字段ID', () => {
      render(
        <ErrorMessage
          content="错误消息"
          fieldId="test-field"
        />
      )
      const alert = screen.getByRole('alert')
      expect(alert).toHaveAttribute('aria-describedby', 'test-field')
    })

    it('应该支持隐藏文本（屏幕阅读器可见）', () => {
      render(
        <ErrorMessage
          content="隐藏的错误消息"
          isHidden={true}
        />
      )
      const alert = screen.getByRole('alert')
      expect(alert).toHaveAttribute('aria-hidden', 'true')
    })
  })

  describe('文本处理测试', () => {
    it('应该处理字符串内容', () => {
      render(<ErrorMessage content="字符串内容" />)
      expect(screen.getByText('字符串内容')).toBeInTheDocument()
    })

    it('应该处理React节点内容', () => {
      const reactNode = <span data-testid="react-node">React 节点</span>
      render(<ErrorMessage content={reactNode} />)
      expect(screen.getByTestId('react-node')).toBeInTheDocument()
    })

    it('应该支持HTML内容', () => {
      render(
        <ErrorMessage
          dangerouslySetInnerHTML={{ __html: '<strong>粗体文本</strong>' }}
        />
      )
      expect(screen.getByText('粗体文本')).toBeInTheDocument()
    })

    it('应该支持代码样式', () => {
      render(<ErrorMessage content="code123" showCodeStyle={true} />)
      expect(screen.getByText('code123')).toHaveClass('font-mono')
    })

    it('应该支持文本截断', () => {
      const longText = '这是一个很长的文本，用来测试截断功能是否正常工作'
      render(<ErrorMessage content={longText} truncation="single" />)
      expect(screen.getByText(longText)).toHaveClass('truncate')
    })
  })

  describe('禁用状态测试', () {
    it('禁用状态下应该添加禁用样式', () => {
      render(<ErrorMessage content="错误消息" disabled={true} />)
      const alert = screen.getByRole('alert')
      expect(alert).toHaveClass('opacity-50', 'cursor-not-allowed')
    })
  })

  describe('Storybook 故事测试', () => {
    it('Default 故事应该正确渲染', () => {
      render(<Default {...Default.args} />)
      expect(screen.getByText('请输入有效的邮箱地址')).toBeInTheDocument()
    })

    it('WithActions 故事应该显示操作按钮', () => {
      render(<WithActions {...WithActions.args} />)
      expect(screen.getByText('重新发送')).toBeInTheDocument()
      expect(screen.getByText('更改邮箱')).toBeInTheDocument()
    })

    it('Dismissible 故事应该显示关闭按钮', () => {
      render(<Dismissible {...Dismissible.args} />)
      expect(screen.getByLabelText('关闭错误消息')).toBeInTheDocument()
    })
  })

  describe('ErrorMessageList 组件测试', () => {
    it('应该渲染多个错误消息', () => {
      const items = [
        { content: '错误1', status: 'error' as const },
        { content: '错误2', status: 'error' as const },
        { content: '错误3', status: 'error' as const },
      ]
      render(<ErrorMessageList items={items} />)
      expect(screen.getByText('错误1')).toBeInTheDocument()
      expect(screen.getByText('错误2')).toBeInTheDocument()
      expect(screen.getByText('错误3')).toBeInTheDocument()
    })

    it('应该显示分组标题', () => {
      const items = [
        { content: '错误1', status: 'error' as const },
      ]
      render(<ErrorMessageList items={items} title="验证错误" />)
      expect(screen.getByText('验证错误')).toBeInTheDocument()
    })

    it('空列表不应该渲染', () => {
      const { container } = render(<ErrorMessageList items={[]} />)
      expect(container.firstChild).toBeNull()
    })
  })

  describe('ErrorMessageGroup 组件测试', () => {
    it('应该与 ErrorMessageList 渲染相同结果', () => {
      const items = [
        { content: '错误1', status: 'error' as const },
      ]
      const { unmount } = render(<ErrorMessageGroup items={items} />)
      expect(screen.getByText('错误1')).toBeInTheDocument()
      unmount()

      render(<ErrorMessageList items={items} />)
      expect(screen.getByText('错误1')).toBeInTheDocument()
    })
  })

  describe('动画测试', () => {
    it('应该支持显示/隐藏动画', async () => {
      const items = [
        { content: '错误消息', status: 'error' as const },
      ]
      const { unmount } = render(<ErrorMessageList items={items} animation={true} />)

      // 组件应该渲染（动画已添加）
      expect(screen.getByText('错误消息')).toBeInTheDocument()

      unmount()

      // 没有动画时也应该正常工作
      render(<ErrorMessageList items={items} animation={false} />)
      expect(screen.getByText('错误消息')).toBeInTheDocument()
    })
  })

  describe('边界情况测试', () => {
    it('空内容不应该渲染', () => {
      const { container } = render(<ErrorMessage content="" />)
      expect(container.firstChild).toBeNull()
    })

    it('null 内容不应该渲染', () => {
      const { container } = render(<ErrorMessage content={null} />)
      expect(container.firstChild).toBeNull()
    })

    it('undefined 内容不应该渲染', () => {
      const { container } = render(<ErrorMessage content={undefined} />)
      expect(container.firstChild).toBeNull()
    })

    it('空操作数组不应该渲染操作区域', () => {
      render(<ErrorMessage content="错误消息" actions={[]} />)
      // 应该没有额外的操作区域
      const alert = screen.getByRole('alert')
      expect(alert.children.length).toBeLessThanOrEqual(2) // 图标 + 内容
    })
  })

  describe('ref 转发测试', () => {
    it('应该转发 ref', () => {
      const ref = { current: null }
      render(<ErrorMessage content="错误消息" ref={ref} />)
      expect(ref.current).not.toBeNull()
      expect(ref.current?.tagName).toBe('DIV')
    })

    it('ErrorMessageList 应该转发 ref', () => {
      const ref = { current: null }
      render(<ErrorMessageList items={[{ content: '错误' }]} ref={ref} />)
      expect(ref.current).not.toBeNull()
      expect(ref.current?.tagName).toBe('DIV')
    })
  })
})
