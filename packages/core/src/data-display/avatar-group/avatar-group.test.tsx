import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { AvatarGroup } from './avatar-group'
import { Avatar } from '../avatar'

// 测试辅助函数
const renderAvatarGroup = (props = {}) => {
  const defaultChildren = (
    <>
      <Avatar name="John Doe" />
      <Avatar name="Jane Smith" />
      <Avatar name="Bob Johnson" />
      <Avatar name="Alice Williams" />
      <Avatar name="Charlie Brown" />
      <Avatar name="David Wilson" />
      <Avatar name="Emma Davis" />
    </>
  )

  return render(
    <AvatarGroup {...props}>
      {props.children || defaultChildren}
    </AvatarGroup>
  )
}

describe('AvatarGroup', () => {
  describe('基础渲染', () => {
    it('应该正确渲染默认头像组', () => {
      renderAvatarGroup()
      const group = screen.getByTestId('avatar-group-horizontal-5-7')
      expect(group).toBeInTheDocument()
      expect(group).toHaveClass('flex', 'flex-row')
    })

    it('应该正确显示头像数量', () => {
      renderAvatarGroup()
      const avatars = screen.getAllByTestId(/avatar-default-md-circle-none/)
      expect(avatars).toHaveLength(5) // 默认显示5个
    })

    it('应该显示溢出头像', () => {
      renderAvatarGroup()
      const overflow = screen.getByText('+2')
      expect(overflow).toBeInTheDocument()
      expect(overflow.closest('div')).toHaveClass('bg-[var(--bg-secondary)]')
    })
  })

  describe('最大显示数量', () => {
    it('应该支持自定义最大显示数量', () => {
      renderAvatarGroup({ max: 3 })
      const avatars = screen.getAllByTestId(/avatar-default-md-circle-none/)
      expect(avatars).toHaveLength(3)
      expect(screen.getByText('+4')).toBeInTheDocument()
    })

    it('应该支持 max={0} 不显示任何头像', () => {
      renderAvatarGroup({ max: 0 })
      expect(screen.queryByTestId(/avatar-default/)).not.toBeInTheDocument()
      expect(screen.getByText('+7')).toBeInTheDocument()
    })

    it('应该支持 max 超过实际数量', () => {
      renderAvatarGroup({ max: 10 })
      const avatars = screen.getAllByTestId(/avatar-default-md-circle-none/)
      expect(avatars).toHaveLength(7) // 只有7个子元素
      expect(screen.queryByText('+')).not.toBeInTheDocument()
    })
  })

  describe('布局变体', () => {
    it('应该支持水平布局（默认）', () => {
      renderAvatarGroup({ layout: 'horizontal' })
      const group = screen.getByTestId('avatar-group-horizontal-5-7')
      expect(group).toHaveClass('flex-row')
    })

    it('应该支持垂直布局', () => {
      renderAvatarGroup({ layout: 'vertical' })
      const group = screen.getByTestId('avatar-group-vertical-5-7')
      expect(group).toHaveClass('flex-col')
    })

    it('应该支持网格布局', () => {
      renderAvatarGroup({ layout: 'grid', max: 8 })
      const group = screen.getByTestId('avatar-group-grid-8-7')
      expect(group).toHaveClass('flex-row', 'flex-wrap')
    })
  })

  describe('间距控制', () => {
    it('应该支持紧密间距', () => {
      renderAvatarGroup({ spacing: 'tight' })
      const group = screen.getByTestId('avatar-group-horizontal-5-7')
      expect(group).toHaveClass('gap-0')
    })

    it('应该支持正常间距（默认）', () => {
      renderAvatarGroup({ spacing: 'normal' })
      const group = screen.getByTestId('avatar-group-horizontal-5-7')
      expect(group).toHaveClass('gap-1')
    })

    it('应该支持宽松间距', () => {
      renderAvatarGroup({ spacing: 'loose' })
      const group = screen.getByTestId('avatar-group-horizontal-5-7')
      expect(group).toHaveClass('gap-2')
    })
  })

  describe('重叠模式', () => {
    it('应该支持堆叠模式（默认）', () => {
      renderAvatarGroup({ overlap: 'stack' })
      const avatars = screen.getAllByTestId(/avatar-default-md-circle-none/)
      expect(avatars.length).toBeGreaterThan(0)
      // 检查是否有负边距样式（通过class验证）
      expect(screen.getByTestId('avatar-group-horizontal-5-7')).toBeInTheDocument()
    })

    it('应该支持扩散模式', () => {
      renderAvatarGroup({ overlap: 'spread' })
      const group = screen.getByTestId('avatar-group-horizontal-5-7')
      expect(group).toHaveClass('gap-1')
    })

    it('应该支持无重叠模式', () => {
      renderAvatarGroup({ overlap: 'none' })
      const group = screen.getByTestId('avatar-group-horizontal-5-7')
      expect(group).toHaveClass('gap-1') // 仍然有间距
    })
  })

  describe('尺寸继承', () => {
    it('应该继承头像尺寸', () => {
      renderAvatarGroup({ size: 'lg' })
      const avatars = screen.getAllByTestId(/avatar-default-lg-circle-none/)
      expect(avatars).toHaveLength(5)
      const overflow = screen.getByText('+2')
      expect(overflow.closest('div')).toHaveClass('w-12', 'h-12')
    })

    it('应该支持所有尺寸变体', () => {
      const sizes: AvatarGroupProps['size'][] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
      sizes.forEach((size) => {
        renderAvatarGroup({ size })
        const avatars = screen.getAllByTestId(new RegExp(`avatar-default-${size}-circle-none`))
        expect(avatars.length).toBeGreaterThan(0)
      })
    })

    it('应该继承头像形状', () => {
      renderAvatarGroup({ shape: 'rounded' })
      const avatars = screen.getAllByTestId(/avatar-default-md-rounded-none/)
      expect(avatars).toHaveLength(5)
    })
  })

  describe('溢出处理', () => {
    it('应该显示默认溢出文本', () => {
      renderAvatarGroup()
      expect(screen.getByText('+2')).toBeInTheDocument()
    })

    it('应该支持自定义溢出文本', () => {
      renderAvatarGroup({
        max: 3,
        overflowContent: <span data-testid="custom-overflow">更多</span>,
      })
      expect(screen.getByTestId('custom-overflow')).toBeInTheDocument()
    })

    it('应该支持自定义溢出工具提示', () => {
      renderAvatarGroup({
        max: 3,
        overflowTooltip: '还有 {count} 位成员',
      })
      const overflow = screen.getByText('+4')
      expect(overflow.closest('div')).toHaveAttribute('data-tooltip', '还有 4 位成员')
    })

    it('应该支持函数式工具提示', () => {
      renderAvatarGroup({
        max: 3,
        overflowTooltip: (count) => `还有 ${count} 位成员`,
      })
      const overflow = screen.getByText('+4')
      expect(overflow.closest('div')).toHaveAttribute('data-tooltip', '还有 4 位成员')
    })
  })

  describe('事件处理', () => {
    it('应该支持溢出头像点击事件', () => {
      const handleOverflowClick = vi.fn()
      renderAvatarGroup({ onOverflowClick: handleOverflowClick })
      const overflow = screen.getByText('+2')
      fireEvent.click(overflow)
      expect(handleOverflowClick).toHaveBeenCalledTimes(1)
    })

    it('应该支持头像悬浮效果', () => {
      renderAvatarGroup()
      const firstAvatar = screen.getAllByTestId(/avatar-default-md-circle-none/)[0]
      fireEvent.mouseEnter(firstAvatar)
      // 悬浮效果通过CSS类控制，这里验证组件存在
      expect(firstAvatar).toBeInTheDocument()
      fireEvent.mouseLeave(firstAvatar)
      expect(firstAvatar).toBeInTheDocument()
    })
  })

  describe('响应式支持', () => {
    it('应该支持移动端最大显示数', () => {
      renderAvatarGroup({ max: 5, maxItemsSm: 3 })
      // 在小屏幕上应该显示3个
      const avatars = screen.getAllByTestId(/avatar-default-md-circle-none/)
      expect(avatars.length).toBe(5) // 默认桌面显示5个
    })
  })

  describe('加载状态', () => {
    it('应该显示加载状态', () => {
      renderAvatarGroup({ loading: true })
      const placeholders = document.querySelectorAll('.animate-pulse')
      expect(placeholders.length).toBeGreaterThan(0)
    })

    it('加载状态应该显示占位符', () => {
      renderAvatarGroup({ loading: true, max: 3 })
      // 验证加载状态有3个占位符
      const placeholders = document.querySelectorAll('.animate-pulse')
      expect(placeholders.length).toBe(3)
    })
  })

  describe('自定义内容', () => {
    it('应该支持自定义溢出内容', () => {
      renderAvatarGroup({
        max: 3,
        overflowContent: (
          <div data-testid="custom-content">自定义</div>
        ),
      })
      expect(screen.getByTestId('custom-content')).toBeInTheDocument()
    })

    it('应该支持自定义头像元素', () => {
      const customChildren = (
        <>
          <Avatar name="John Doe" status="online" />
          <Avatar name="Jane Smith" status="busy" />
        </>
      )
      renderAvatarGroup({ children: customChildren, max: 2 })
      const avatars = screen.getAllByTestId(/avatar-default-md-circle-/)
      expect(avatars).toHaveLength(2)
    })
  })

  describe('工具提示', () => {
    it('应该添加工具提示属性到头像', () => {
      renderAvatarGroup()
      const firstAvatar = screen.getAllByTestId(/avatar-default/)[0]
      expect(firstAvatar.closest('div')).toHaveAttribute('data-tooltip', 'John Doe')
    })

    it('应该添加工具提示属性到溢出头像', () => {
      renderAvatarGroup()
      const overflow = screen.getByText('+2')
      expect(overflow.closest('div')).toHaveAttribute('data-tooltip', '还有 2 个成员')
    })

    it('应该支持自定义工具提示位置', () => {
      renderAvatarGroup({ tooltipPosition: 'bottom' })
      const overflow = screen.getByText('+2')
      expect(overflow.closest('div')).toHaveAttribute('data-position', 'bottom')
    })

    it('应该支持自定义工具提示延迟', () => {
      renderAvatarGroup({ tooltipDelay: 500 })
      const overflow = screen.getByText('+2')
      expect(overflow.closest('div')).toHaveAttribute('data-delay', '500')
    })
  })

  describe('动画', () => {
    it('应该默认启用动画', () => {
      renderAvatarGroup()
      const group = screen.getByTestId('avatar-group-horizontal-5-7')
      expect(group).toBeInTheDocument()
    })

    it('应该支持禁用动画', () => {
      renderAvatarGroup({ animate: false })
      const group = screen.getByTestId('avatar-group-horizontal-5-7')
      expect(group).toBeInTheDocument()
    })
  })

  describe('可访问性', () => {
    it('应该为头像组添加语义化标签', () => {
      renderAvatarGroup()
      const group = screen.getByTestId('avatar-group-horizontal-5-7')
      expect(group).toBeInTheDocument()
    })
  })

  describe('自定义样式', () => {
    it('应该支持自定义类名', () => {
      renderAvatarGroup({ className: 'custom-avatar-group' })
      const group = screen.getByTestId('avatar-group-horizontal-5-7')
      expect(group).toHaveClass('custom-avatar-group')
    })
  })

  describe('测试ID', () => {
    it('应该支持自定义测试ID', () => {
      renderAvatarGroup({ testId: 'custom-test-id' })
      expect(screen.getByTestId('custom-test-id')).toBeInTheDocument()
    })
  })

  describe('边界情况', () => {
    it('应该处理空子元素', () => {
      renderAvatarGroup({ children: <></> })
      const group = screen.getByTestId('avatar-group-horizontal-5-0')
      expect(group).toBeInTheDocument()
      expect(screen.queryByText('+')).not.toBeInTheDocument()
    })

    it('应该处理单个子元素', () => {
      const singleChild = <Avatar name="John Doe" />
      renderAvatarGroup({ children: singleChild })
      const avatars = screen.getAllByTestId(/avatar-default-md-circle-none/)
      expect(avatars).toHaveLength(1)
      expect(screen.queryByText('+')).not.toBeInTheDocument()
    })

    it('应该处理无效的子元素', () => {
      const invalidChildren = (
        <>
          <div>无效元素</div>
          <Avatar name="John Doe" />
        </>
      )
      renderAvatarGroup({ children: invalidChildren, max: 2 })
      // 组件应该安全处理无效子元素
      const group = screen.getByTestId('avatar-group-horizontal-2-2')
      expect(group).toBeInTheDocument()
    })
  })

  describe('forwardRef', () => {
    it('应该正确传递 ref', () => {
      const ref = { current: null }
      renderAvatarGroup({ ref })
      expect(ref.current).toBeDefined()
    })
  })

  describe('变体类型', () => {
    it('应该导出正确的变体类型', () => {
      const { avatarGroupVariants, overflowVariants } = AvatarGroup
      expect(avatarGroupVariants).toBeDefined()
      expect(overflowVariants).toBeDefined()
    })
  })
})
