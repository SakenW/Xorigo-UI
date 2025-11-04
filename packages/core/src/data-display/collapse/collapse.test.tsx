/**
 * Collapse 组件测试文件
 * @version 2025.11.04
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Collapse } from './collapse'

// 测试辅助函数
const renderCollapse = (props = {}) => {
  return render(
    <Collapse {...props}>
      <div>折叠内容</div>
    </Collapse>
  )
}

describe('Collapse', () => {
  describe('基础渲染', () => {
    it('应该正确渲染默认折叠面板', () => {
      renderCollapse()
      const collapse = screen.getByTestId('collapse-default-md-closed')
      expect(collapse).toBeInTheDocument()
      expect(collapse).toHaveAttribute('data-state', 'closed')
    })

    it('应该在初始状态下渲染为折叠状态', () => {
      renderCollapse()
      const header = screen.getByTestId('collapse-default-md-closed-header')
      expect(header).toBeInTheDocument()
    })
  })

  describe('控制/非控制模式', () => {
    it('应该支持非控制模式（defaultOpen）', () => {
      renderCollapse({ defaultOpen: true })
      const collapse = screen.getByTestId('collapse-default-md-open')
      expect(collapse).toHaveAttribute('data-state', 'open')
    })

    it('应该支持控制模式（open）', () => {
      const onOpenChange = vi.fn()
      renderCollapse({ open: true, onOpenChange })
      const collapse = screen.getByTestId('collapse-default-md-open')
      expect(collapse).toHaveAttribute('data-state', 'open')
    })

    it('应该在控制模式下调用 onOpenChange', () => {
      const onOpenChange = vi.fn()
      render(
        <Collapse open={true} onOpenChange={onOpenChange}>
          <div>内容</div>
        </Collapse>
      )
      const header = screen.getByTestId('collapse-default-md-open-header')

      // 点击头部切换
      fireEvent.click(header)
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })

  describe('变体样式', () => {
    it('应该支持 default 变体', () => {
      renderCollapse({ variant: 'default' })
      const collapse = screen.getByTestId('collapse-default-md-closed')
      expect(collapse).toHaveClass('border')
    })

    it('应该支持 bordered 变体', () => {
      renderCollapse({ variant: 'bordered' })
      const collapse = screen.getByTestId('collapse-bordered-md-closed')
      expect(collapse).toHaveClass('border')
    })

    it('应该支持 ghost 变体', () => {
      renderCollapse({ variant: 'ghost' })
      const collapse = screen.getByTestId('collapse-ghost-md-closed')
      expect(collapse).not.toHaveClass('bg-[var(--bg-surface)]')
    })
  })

  describe('尺寸变体', () => {
    it('应该支持 sm 尺寸', () => {
      renderCollapse({ size: 'sm' })
      const collapse = screen.getByTestId('collapse-default-sm-closed')
      expect(collapse).toBeInTheDocument()
    })

    it('应该支持 md 尺寸', () => {
      renderCollapse({ size: 'md' })
      const collapse = screen.getByTestId('collapse-default-md-closed')
      expect(collapse).toBeInTheDocument()
    })

    it('应该支持 lg 尺寸', () => {
      renderCollapse({ size: 'lg' })
      const collapse = screen.getByTestId('collapse-default-lg-closed')
      expect(collapse).toBeInTheDocument()
    })
  })

  describe('展开/折叠功能', () => {
    it('点击头部应该展开内容', () => {
      renderCollapse()
      const header = screen.getByTestId('collapse-default-md-closed-header')
      fireEvent.click(header)

      const collapse = screen.getByTestId('collapse-default-md-open')
      expect(collapse).toHaveAttribute('data-state', 'open')
    })

    it('再次点击应该折叠内容', () => {
      renderCollapse({ defaultOpen: true })
      const header = screen.getByTestId('collapse-default-md-open-header')
      fireEvent.click(header)

      const collapse = screen.getByTestId('collapse-default-md-closed')
      expect(collapse).toHaveAttribute('data-state', 'closed')
    })

    it('应该显示内容在展开状态下', () => {
      renderCollapse({ defaultOpen: true })
      const content = screen.getByTestId('collapse-default-md-open-content')
      expect(content).toBeInTheDocument()
      expect(content).toHaveTextContent('折叠内容')
    })

    it('应该隐藏内容在折叠状态下', () => {
      renderCollapse()
      const content = screen.queryByTestId('collapse-default-md-closed-content')
      // 折叠状态下内容应该被隐藏
      expect(content).not.toBeInTheDocument()
    })
  })

  describe('键盘导航', () => {
    it('应该支持 Enter 键展开', () => {
      renderCollapse()
      const header = screen.getByTestId('collapse-default-md-closed-header')
      fireEvent.keyDown(header, { key: 'Enter', code: 'Enter' })

      const collapse = screen.getByTestId('collapse-default-md-open')
      expect(collapse).toHaveAttribute('data-state', 'open')
    })

    it('应该支持空格键展开', () => {
      renderCollapse()
      const header = screen.getByTestId('collapse-default-md-closed-header')
      fireEvent.keyDown(header, { key: ' ', code: 'Space' })

      const collapse = screen.getByTestId('collapse-default-md-open')
      expect(collapse).toHaveAttribute('data-state', 'open')
    })

    it('应该在禁用状态下忽略键盘事件', () => {
      renderCollapse({ disabled: true })
      const header = screen.getByTestId('collapse-default-md-closed-header')
      fireEvent.keyDown(header, { key: 'Enter', code: 'Enter' })

      const collapse = screen.getByTestId('collapse-default-md-closed')
      expect(collapse).toHaveAttribute('data-state', 'closed')
    })
  })

  describe('自定义触发器', () => {
    it('应该支持自定义触发器', () => {
      render(
        <Collapse trigger={<button>自定义触发器</button>}>
          <div>内容</div>
        </Collapse>
      )
      expect(screen.getByText('自定义触发器')).toBeInTheDocument()
    })

    it('应该支持自定义内容', () => {
      render(
        <Collapse content={<div>自定义内容</div>}>
          <div>默认内容</div>
        </Collapse>
      )
      expect(screen.getByText('自定义内容')).toBeInTheDocument()
    })

    it('自定义内容应该覆盖 children', () => {
      render(
        <Collapse content={<div>自定义内容</div>}>
          <div>默认内容</div>
        </Collapse>
      )
      expect(screen.getByText('自定义内容')).toBeInTheDocument()
      expect(screen.queryByText('默认内容')).not.toBeInTheDocument()
    })
  })

  describe('自定义图标', () => {
    it('应该支持自定义展开图标', () => {
      const ExpandIcon = () => <span data-testid="expand-icon">展开</span>
      render(
        <Collapse expandIcon={<ExpandIcon />}>
          <div>内容</div>
        </Collapse>
      )
      expect(screen.getByTestId('expand-icon')).toBeInTheDocument()
    })

    it('应该支持自定义折叠图标', () => {
      const CollapseIcon = () => <span data-testid="collapse-icon">折叠</span>
      render(
        <Collapse collapseIcon={<CollapseIcon />} defaultOpen>
          <div>内容</div>
        </Collapse>
      )
      expect(screen.getByTestId('collapse-icon')).toBeInTheDocument()
    })
  })

  describe('懒加载', () => {
    it('应该支持懒加载模式', () => {
      render(
        <Collapse lazy>
          <div>懒加载内容</div>
        </Collapse>
      )
      // 初始状态内容不应渲染
      expect(screen.queryByText('懒加载内容')).not.toBeInTheDocument()

      // 点击展开后内容应渲染
      const header = screen.getByTestId('collapse-default-md-closed-header')
      fireEvent.click(header)
      expect(screen.getByText('懒加载内容')).toBeInTheDocument()
    })

    it('keepMounted 应该保持内容在 DOM 中', () => {
      render(
        <Collapse keepMounted={false}>
          <div>不保持的内容</div>
        </Collapse>
      )
      // 默认情况下内容应该不在 DOM 中
      expect(screen.queryByText('不保持的内容')).not.toBeInTheDocument()
    })
  })

  describe('禁用状态', () => {
    it('应该在禁用状态下不可点击', () => {
      renderCollapse({ disabled: true, defaultOpen: true })
      const header = screen.getByTestId('collapse-default-md-open-header')

      // 点击应该无效
      fireEvent.click(header)
      const collapse = screen.getByTestId('collapse-default-md-open')
      expect(collapse).toHaveAttribute('data-state', 'open')
    })

    it('应该在禁用状态下显示正确的样式', () => {
      renderCollapse({ disabled: true })
      const header = screen.getByTestId('collapse-default-md-closed-header')
      expect(header).toHaveClass('opacity-50', 'cursor-not-allowed')
    })

    it('应该在禁用状态下设置 disabled 属性', () => {
      renderCollapse({ disabled: true })
      const header = screen.getByTestId('collapse-default-md-closed-header')
      expect(header).toHaveAttribute('disabled')
    })
  })

  describe('可访问性', () => {
    it('应该添加 aria-expanded 属性', () => {
      renderCollapse({ defaultOpen: true })
      const header = screen.getByTestId('collapse-default-md-open-header')
      expect(header).toHaveAttribute('aria-expanded', 'true')
    })

    it('应该在折叠状态下设置 aria-expanded="false"', () => {
      renderCollapse()
      const header = screen.getByTestId('collapse-default-md-closed-header')
      expect(header).toHaveAttribute('aria-expanded', 'false')
    })

    it('应该添加 aria-controls 属性', () => {
      renderCollapse()
      const header = screen.getByTestId('collapse-default-md-closed-header')
      const contentId = screen.getByTestId('collapse-default-md-closed-content').id
      expect(header).toHaveAttribute('aria-controls', contentId)
    })

    it('应该支持 aria-label', () => {
      renderCollapse({ 'aria-label': '自定义标签' })
      const header = screen.getByTestId('collapse-default-md-closed-header')
      expect(header).toHaveAttribute('aria-label', '自定义标签')
    })

    it('应该支持 aria-labelledby', () => {
      renderCollapse({ 'aria-labelledby': 'title-id' })
      const header = screen.getByTestId('collapse-default-md-closed-header')
      expect(header).toHaveAttribute('aria-labelledby', 'title-id')
    })
  })

  describe('事件处理', () => {
    it('应该支持 onClick 事件', () => {
      const handleClick = vi.fn()
      renderCollapse({ onClick: handleClick as any })
      const header = screen.getByTestId('collapse-default-md-closed-header')
      fireEvent.click(header)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('应该支持 onKeyDown 事件', () => {
      const handleKeyDown = vi.fn()
      renderCollapse({ onKeyDown: handleKeyDown as any })
      const header = screen.getByTestId('collapse-default-md-closed-header')
      fireEvent.keyDown(header, { key: 'Enter' })
      expect(handleKeyDown).toHaveBeenCalledTimes(1)
    })
  })

  describe('自定义样式', () => {
    it('应该支持自定义 className', () => {
      renderCollapse({ className: 'custom-class' })
      const collapse = screen.getByTestId('collapse-default-md-closed')
      expect(collapse).toHaveClass('custom-class')
    })
  })

  describe('测试ID', () => {
    it('应该支持自定义测试ID', () => {
      renderCollapse({ 'data-testid': 'custom-test-id' })
      expect(screen.getByTestId('custom-test-id')).toBeInTheDocument()
    })
  })

  describe('嵌套使用', () => {
    it('应该支持嵌套折叠面板', () => {
      render(
        <Collapse defaultOpen>
          <div>外层内容</div>
          <Collapse defaultOpen>
            <div>内层内容</div>
          </Collapse>
        </Collapse>
      )
      expect(screen.getByText('外层内容')).toBeInTheDocument()
      expect(screen.getByText('内层内容')).toBeInTheDocument()
    })
  })

  describe('forwardRef', () => {
    it('应该正确传递 ref', () => {
      const ref = { current: null }
      renderCollapse({ ref })
      expect(ref).toBeDefined()
    })
  })

  describe('Children vs Content', () => {
    it('当提供 content 时应该使用 content', () => {
      render(
        <Collapse content={<div>内容区域</div>}>
          <div>子元素</div>
        </Collapse>
      )
      expect(screen.getByText('内容区域')).toBeInTheDocument()
      expect(screen.queryByText('子元素')).not.toBeInTheDocument()
    })

    it('当未提供 content 时应该使用 children', () => {
      render(
        <Collapse>
          <div>子元素</div>
        </Collapse>
      )
      expect(screen.getByText('子元素')).toBeInTheDocument()
    })
  })

  describe('边缘情况', () => {
    it('应该处理空的 children', () => {
      render(<Collapse>{null}</Collapse>)
      const collapse = screen.getByTestId('collapse-default-md-closed')
      expect(collapse).toBeInTheDocument()
    })

    it('应该处理未定义的 open 值', () => {
      render(<Collapse open={undefined}>内容</Collapse>)
      const collapse = screen.getByTestId('collapse-default-md-closed')
      expect(collapse).toBeInTheDocument()
    })

    it('应该在展开后保持内容可见', () => {
      renderCollapse({ defaultOpen: true })
      // 内容应该可见
      expect(screen.getByText('折叠内容')).toBeInTheDocument()
    })
  })
})
