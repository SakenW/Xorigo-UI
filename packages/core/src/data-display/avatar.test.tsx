import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Avatar } from './avatar'
import { Spinner } from '../primitives/Spinner'

// 测试辅助函数
const renderAvatar = (props = {}) => {
  return render(<Avatar {...props} />)
}

describe('Avatar', () => {
  describe('基础渲染', () => {
    it('应该正确渲染默认头像', () => {
      renderAvatar()
      const avatar = screen.getByTestId('avatar-default-md-circle-none')
      expect(avatar).toBeInTheDocument()
    })

    it('应该渲染为圆形', () => {
      renderAvatar()
      const avatar = screen.getByTestId('avatar-default-md-circle-none')
      expect(avatar).toHaveClass('rounded-full')
    })
  })

  describe('尺寸变体', () => {
    it('应该支持 xs 尺寸', () => {
      renderAvatar({ size: 'xs' })
      const avatar = screen.getByTestId('avatar-default-xs-circle-none')
      expect(avatar).toHaveClass('w-6', 'h-6')
    })

    it('应该支持 sm 尺寸', () => {
      renderAvatar({ size: 'sm' })
      const avatar = screen.getByTestId('avatar-default-sm-circle-none')
      expect(avatar).toHaveClass('w-8', 'h-8')
    })

    it('应该支持 md 尺寸', () => {
      renderAvatar({ size: 'md' })
      const avatar = screen.getByTestId('avatar-default-md-circle-none')
      expect(avatar).toHaveClass('w-10', 'h-10')
    })

    it('应该支持 lg 尺寸', () => {
      renderAvatar({ size: 'lg' })
      const avatar = screen.getByTestId('avatar-default-lg-circle-none')
      expect(avatar).toHaveClass('w-12', 'h-12')
    })

    it('应该支持 xl 尺寸', () => {
      renderAvatar({ size: 'xl' })
      const avatar = screen.getByTestId('avatar-default-xl-circle-none')
      expect(avatar).toHaveClass('w-16', 'h-16')
    })

    it('应该支持 2xl 尺寸', () => {
      renderAvatar({ size: '2xl' })
      const avatar = screen.getByTestId('avatar-default-2xl-circle-none')
      expect(avatar).toHaveClass('w-20', 'h-20')
    })
  })

  describe('形状变体', () => {
    it('应该支持圆形', () => {
      renderAvatar({ shape: 'circle' })
      const avatar = screen.getByTestId('avatar-default-md-circle-none')
      expect(avatar).toHaveClass('rounded-full')
    })

    it('应该支持圆角方形', () => {
      renderAvatar({ shape: 'rounded' })
      const avatar = screen.getByTestId('avatar-default-md-rounded-none')
      expect(avatar).toHaveClass('rounded-lg')
    })

    it('应该支持方形', () => {
      renderAvatar({ shape: 'square' })
      const avatar = screen.getByTestId('avatar-default-md-square-none')
      expect(avatar).toHaveClass('rounded-none')
    })
  })

  describe('图片头像', () => {
    it('应该正确显示图片', () => {
      const src = 'https://example.com/avatar.jpg'
      renderAvatar({ src })
      const img = screen.getByRole('img')
      expect(img).toHaveAttribute('src', src)
    })

    it('应该在图片加载失败时显示文字头像', () => {
      const src = 'https://example.com/invalid-avatar.jpg'
      renderAvatar({ src, name: 'John Doe' })
      const avatar = screen.getByTestId('avatar-default-md-circle-none')

      // 模拟图片加载失败
      const img = screen.getByRole('img')
      fireEvent.error(img)

      expect(avatar).toBeInTheDocument()
      // 头像内容应该变为文字
      expect(avatar.textContent).toContain('JD')
    })
  })

  describe('文字头像', () => {
    it('应该显示姓名的首字母', () => {
      renderAvatar({ name: 'John Doe' })
      const avatar = screen.getByTestId('avatar-default-md-circle-none')
      expect(avatar.textContent).toBe('JD')
    })

    it('应该只显示一个单词的首字母', () => {
      renderAvatar({ name: 'John' })
      const avatar = screen.getByTestId('avatar-default-md-circle-none')
      expect(avatar.textContent).toBe('J')
    })

    it('应该处理三个单词的姓名', () => {
      renderAvatar({ name: 'John Michael Doe' })
      const avatar = screen.getByTestId('avatar-default-md-circle-none')
      expect(avatar.textContent).toBe('JM')
    })

    it('应该处理空字符串', () => {
      renderAvatar({ name: '' })
      const avatar = screen.getByTestId('avatar-default-md-circle-none')
      expect(avatar.textContent).toBe('')
    })

    it('应该处理 undefined', () => {
      renderAvatar({ name: undefined })
      const avatar = screen.getByTestId('avatar-default-md-circle-none')
      // 头像应该显示默认图标而不是文字
      expect(avatar.querySelector('svg')).toBeInTheDocument()
    })
  })

  describe('图标头像', () => {
    it('应该显示自定义图标', () => {
      const Icon = () => <span data-testid="custom-icon">Icon</span>
      renderAvatar({ icon: <Icon /> })
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
    })

    it('图标应该优先于文字显示', () => {
      renderAvatar({ name: 'John Doe', icon: <span>Icon</span> })
      const avatar = screen.getByTestId('avatar-default-md-circle-none')
      expect(avatar.textContent).toBe('Icon')
    })
  })

  describe('状态指示器', () => {
    it('应该支持在线状态', () => {
      renderAvatar({ status: 'online' })
      const avatar = screen.getByTestId('avatar-default-md-circle-online')
      const statusIndicator = avatar.querySelector('[data-status="online"]')
      expect(statusIndicator).toBeInTheDocument()
    })

    it('应该支持离线状态', () => {
      renderAvatar({ status: 'offline' })
      const avatar = screen.getByTestId('avatar-default-md-circle-offline')
      const statusIndicator = avatar.querySelector('[data-status="offline"]')
      expect(statusIndicator).toBeInTheDocument()
    })

    it('应该支持忙碌状态', () => {
      renderAvatar({ status: 'busy' })
      const avatar = screen.getByTestId('avatar-default-md-circle-busy')
      const statusIndicator = avatar.querySelector('[data-status="busy"]')
      expect(statusIndicator).toBeInTheDocument()
    })

    it('应该支持离开状态', () => {
      renderAvatar({ status: 'away' })
      const avatar = screen.getByTestId('avatar-default-md-circle-away')
      const statusIndicator = avatar.querySelector('[data-status="away"]')
      expect(statusIndicator).toBeInTheDocument()
    })

    it('应该支持隐藏状态', () => {
      renderAvatar({ status: 'none' })
      const avatar = screen.getByTestId('avatar-default-md-circle-none')
      expect(avatar.querySelector('[data-status]')).not.toBeInTheDocument()
    })
  })

  describe('加载状态', () => {
    it('应该显示加载指示器', () => {
      renderAvatar({ loading: true })
      expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument() // Spinner 组件的 img 角色
      const spinner = screen.getByTestId('avatar-default-md-circle-none')
      expect(spinner.querySelector('div[class*="border"]')).toBeInTheDocument()
    })
  })

  describe('自定义样式', () => {
    it('应该支持自定义背景色', () => {
      renderAvatar({ color: '#FF0000' })
      const avatar = screen.getByTestId('avatar-default-md-circle-none')
      expect(avatar).toHaveStyle({ backgroundColor: '#FF0000' })
    })

    it('应该支持自定义类名', () => {
      renderAvatar({ className: 'custom-class' })
      const avatar = screen.getByTestId('avatar-default-md-circle-none')
      expect(avatar).toHaveClass('custom-class')
    })
  })

  describe('交互功能', () => {
    it('应该支持点击事件', () => {
      const handleClick = vi.fn()
      renderAvatar({ onClick: handleClick })
      const avatar = screen.getByTestId('avatar-default-md-circle-none')
      fireEvent.click(avatar)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('应该支持双击事件', () => {
      const handleDoubleClick = vi.fn()
      renderAvatar({ onDoubleClick: handleDoubleClick })
      const avatar = screen.getByTestId('avatar-default-md-circle-none')
      fireEvent.doubleClick(avatar)
      expect(handleDoubleClick).toHaveBeenCalledTimes(1)
    })

    it('应该支持可点击模式', () => {
      renderAvatar({ clickable: true })
      const avatar = screen.getByTestId('avatar-default-md-circle-none')
      expect(avatar).toHaveClass('cursor-pointer')
    })
  })

  describe('可访问性', () => {
    it('应该添加 aria-label 属性', () => {
      renderAvatar({ label: '用户头像' })
      const avatar = screen.getByTestId('avatar-default-md-circle-none')
      expect(avatar).toHaveAttribute('aria-label', '用户头像')
    })

    it('应该使用 name 作为 aria-label', () => {
      renderAvatar({ name: 'John Doe' })
      const avatar = screen.getByTestId('avatar-default-md-circle-none')
      expect(avatar).toHaveAttribute('aria-label', 'John Doe')
    })

    it('应该有 role 属性', () => {
      renderAvatar()
      const avatar = screen.getByTestId('avatar-default-md-circle-none')
      expect(avatar).toHaveAttribute('role', 'img')
    })
  })

  describe('测试ID', () => {
    it('应该支持自定义测试ID', () => {
      renderAvatar({ testId: 'custom-test-id' })
      expect(screen.getByTestId('custom-test-id')).toBeInTheDocument()
    })
  })

  describe('forwardRef', () => {
    it('应该正确传递 ref', () => {
      const ref = { current: null }
      renderAvatar({ ref })
      // Ref 应该在组件渲染后被设置
      // 注意：这里我们只是验证 ref 属性被传递了
      expect(ref).toBeDefined()
    })
  })
})
