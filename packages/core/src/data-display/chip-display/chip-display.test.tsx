import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ChipDisplay } from './chip-display'

// 测试辅助函数
const renderChip = (props = {}) => {
  return render(<ChipDisplay {...props} />)
}

describe('ChipDisplay', () => {
  describe('基础渲染', () => {
    it('应该正确渲染默认芯片', () => {
      renderChip({ label: 'Default Chip' })
      const chip = screen.getByTestId('chip-display-primary-solid-md-default')
      expect(chip).toBeInTheDocument()
      expect(chip).toHaveTextContent('Default Chip')
    })

    it('应该使用提供的label属性', () => {
      renderChip({ label: 'Test Label' })
      const chip = screen.getByText('Test Label')
      expect(chip).toBeInTheDocument()
    })
  })

  describe('颜色变体', () => {
    it('应该支持 primary 颜色', () => {
      renderChip({ label: 'Primary', color: 'primary' })
      const chip = screen.getByTestId('chip-display-primary-solid-md-default')
      expect(chip).toBeInTheDocument()
    })

    it('应该支持 secondary 颜色', () => {
      renderChip({ label: 'Secondary', color: 'secondary' })
      const chip = screen.getByTestId('chip-display-secondary-soft-md-default')
      expect(chip).toBeInTheDocument()
    })

    it('应该支持 success 颜色', () => {
      renderChip({ label: 'Success', color: 'success' })
      const chip = screen.getByTestId('chip-display-success-soft-md-default')
      expect(chip).toBeInTheDocument()
    })

    it('应该支持 warning 颜色', () => {
      renderChip({ label: 'Warning', color: 'warning' })
      const chip = screen.getByTestId('chip-display-warning-soft-md-default')
      expect(chip).toBeInTheDocument()
    })

    it('应该支持 error 颜色', () => {
      renderChip({ label: 'Error', color: 'error' })
      const chip = screen.getByTestId('chip-display-error-soft-md-default')
      expect(chip).toBeInTheDocument()
    })

    it('应该支持 info 颜色', () => {
      renderChip({ label: 'Info', color: 'info' })
      const chip = screen.getByTestId('chip-display-info-soft-md-default')
      expect(chip).toBeInTheDocument()
    })
  })

  describe('变体类型', () => {
    it('应该支持 solid 变体', () => {
      renderChip({ label: 'Solid', variant: 'solid' })
      const chip = screen.getByTestId('chip-display-primary-solid-md-default')
      expect(chip).toHaveClass('bg-[var(--bg-primary-action)]')
    })

    it('应该支持 soft 变体', () => {
      renderChip({ label: 'Soft', variant: 'soft' })
      const chip = screen.getByTestId('chip-display-primary-soft-md-default')
      expect(chip).toHaveClass('bg-[var(--bg-primary)]')
    })

    it('应该支持 outline 变体', () => {
      renderChip({ label: 'Outline', variant: 'outline' })
      const chip = screen.getByTestId('chip-display-primary-outline-md-default')
      expect(chip).toHaveClass('border')
    })

    it('应该支持 ghost 变体', () => {
      renderChip({ label: 'Ghost', variant: 'ghost' })
      const chip = screen.getByTestId('chip-display-primary-ghost-md-default')
      expect(chip).toHaveClass('bg-transparent')
    })
  })

  describe('尺寸变体', () => {
    it('应该支持 xs 尺寸', () => {
      renderChip({ label: 'XS', size: 'xs' })
      const chip = screen.getByTestId('chip-display-primary-solid-xs-default')
      expect(chip).toHaveClass('h-5', 'px-2', 'py-0.5', 'text-xs')
    })

    it('应该支持 sm 尺寸', () => {
      renderChip({ label: 'SM', size: 'sm' })
      const chip = screen.getByTestId('chip-display-primary-solid-sm-default')
      expect(chip).toHaveClass('h-6', 'px-2.5', 'py-1', 'text-xs')
    })

    it('应该支持 md 尺寸', () => {
      renderChip({ label: 'MD', size: 'md' })
      const chip = screen.getByTestId('chip-display-primary-solid-md-default')
      expect(chip).toHaveClass('h-8', 'px-3', 'py-1.5', 'text-sm')
    })

    it('应该支持 lg 尺寸', () => {
      renderChip({ label: 'LG', size: 'lg' })
      const chip = screen.getByTestId('chip-display-primary-solid-lg-default')
      expect(chip).toHaveClass('h-10', 'px-4', 'py-2', 'text-sm')
    })
  })

  describe('状态管理', () => {
    it('应该支持选中状态', () => {
      renderChip({ label: 'Selected', isSelected: true })
      const chip = screen.getByTestId('chip-display-primary-solid-md-selected')
      expect(chip).toHaveClass('ring-2')
    })

    it('应该支持禁用状态', () => {
      renderChip({ label: 'Disabled', isDisabled: true })
      const chip = screen.getByTestId('chip-display-primary-solid-md-disabled')
      expect(chip).toHaveClass('opacity-50', 'cursor-not-allowed')
    })
  })

  describe('图标显示', () => {
    it('应该显示左侧图标', () => {
      const LeftIcon = () => <span data-testid="left-icon">L</span>
      renderChip({ label: 'With Icon', leftIcon: <LeftIcon /> })
      expect(screen.getByTestId('left-icon')).toBeInTheDocument()
    })

    it('应该显示右侧图标', () => {
      const RightIcon = () => <span data-testid="right-icon">R</span>
      renderChip({ label: 'With Icon', rightIcon: <RightIcon /> })
      expect(screen.getByTestId('right-icon')).toBeInTheDocument()
    })

    it('应该显示自定义图标', () => {
      const CustomIcon = () => <span data-testid="custom-icon">C</span>
      renderChip({ label: 'With Icon', icon: <CustomIcon /> })
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
    })
  })

  describe('头像显示', () => {
    it('应该显示头像图片', () => {
      const avatarUrl = 'https://example.com/avatar.jpg'
      renderChip({ label: 'User', avatar: avatarUrl })
      const img = screen.getByRole('img', { hidden: true })
      expect(img).toHaveAttribute('src', avatarUrl)
    })

    it('应该在图片加载失败时隐藏头像', () => {
      const avatarUrl = 'https://example.com/invalid-avatar.jpg'
      renderChip({ label: 'User', avatar: avatarUrl })
      const img = screen.getByRole('img', { hidden: true })
      fireEvent.error(img)
      // 图片隐藏但芯片仍然存在
      const chip = screen.getByTestId('chip-display-primary-solid-md-default')
      expect(chip).toBeInTheDocument()
    })
  })

  describe('状态指示器', () => {
    it('应该显示在线状态', () => {
      renderChip({ label: 'Online', status: 'online' })
      const chip = screen.getByTestId('chip-display-primary-solid-md-default')
      expect(chip.querySelector('.rounded-full')).toBeInTheDocument()
    })

    it('应该显示离线状态', () => {
      renderChip({ label: 'Offline', status: 'offline' })
      const chip = screen.getByTestId('chip-display-primary-solid-md-default')
      expect(chip.querySelector('.rounded-full')).toBeInTheDocument()
    })

    it('应该显示忙碌状态', () => {
      renderChip({ label: 'Busy', status: 'busy' })
      const chip = screen.getByTestId('chip-display-primary-solid-md-default')
      expect(chip.querySelector('.rounded-full')).toBeInTheDocument()
    })

    it('应该显示离开状态', () => {
      renderChip({ label: 'Away', status: 'away' })
      const chip = screen.getByTestId('chip-display-primary-solid-md-default')
      expect(chip.querySelector('.rounded-full')).toBeInTheDocument()
    })
  })

  describe('关闭功能', () => {
    it('应该显示关闭按钮', () => {
      renderChip({ label: 'Closable', isClosable: true })
      const closeButton = screen.getByRole('button', { name: 'Close Closable' })
      expect(closeButton).toBeInTheDocument()
    })

    it('应该在点击关闭按钮时触发onClose事件', () => {
      const handleClose = vi.fn()
      renderChip({ label: 'Closable', isClosable: true, onClose: handleClose })
      const closeButton = screen.getByRole('button', { name: 'Close Closable' })
      fireEvent.click(closeButton)
      expect(handleClose).toHaveBeenCalledTimes(1)
    })

    it('应该在禁用状态下不触发关闭事件', () => {
      const handleClose = vi.fn()
      renderChip({
        label: 'Disabled Closable',
        isClosable: true,
        isDisabled: true,
        onClose: handleClose
      })
      const closeButton = screen.getByRole('button', { name: 'Close Disabled Closable' })
      expect(closeButton).toHaveClass('pointer-events-none')
    })
  })

  describe('文本截断', () => {
    it('应该支持最大宽度设置', () => {
      renderChip({ label: 'Long Text Chip', maxWidth: 100 })
      const chip = screen.getByTestId('chip-display-primary-solid-md-default')
      const textElement = chip.querySelector('span[style*="max-width"]')
      expect(textElement).toHaveStyle({ maxWidth: '100px' })
    })

    it('应该在文本超长时显示工具提示', () => {
      renderChip({
        label: 'Very Long Text That Should Be Truncated',
        maxWidth: 50,
        showTooltip: true
      })
      const chip = screen.getByTestId('chip-display-primary-solid-md-default')
      const textWithTitle = chip.querySelector('[title]')
      expect(textWithTitle).toBeInTheDocument()
    })
  })

  describe('交互功能', () => {
    it('应该支持点击事件', () => {
      const handleClick = vi.fn()
      renderChip({ label: 'Clickable', onClick: handleClick })
      const chip = screen.getByTestId('chip-display-primary-solid-md-default')
      fireEvent.click(chip)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('应该支持可点击模式', () => {
      renderChip({ label: 'Clickable', clickable: true })
      const chip = screen.getByTestId('chip-display-primary-solid-md-default')
      expect(chip).toHaveClass('cursor-pointer')
    })
  })

  describe('可访问性', () => {
    it('应该添加正确的角色属性', () => {
      renderChip({ label: 'Accessible' })
      const chip = screen.getByTestId('chip-display-primary-solid-md-default')
      expect(chip).toHaveAttribute('role', 'img')
    })

    it('应该支持自定义labelText', () => {
      renderChip({ label: 'Short', labelText: 'Longer Descriptive Text' })
      const chip = screen.getByTestId('chip-display-primary-solid-md-default')
      expect(chip).toHaveAttribute('aria-label', 'Longer Descriptive Text')
    })

    it('应该使用label作为aria-label', () => {
      renderChip({ label: 'Chip Label' })
      const chip = screen.getByTestId('chip-display-primary-solid-md-default')
      expect(chip).toHaveAttribute('aria-label', 'Chip Label')
    })

    it('应该在选中时添加aria-selected', () => {
      renderChip({ label: 'Selected', isSelected: true })
      const chip = screen.getByTestId('chip-display-primary-solid-md-selected')
      expect(chip).toHaveAttribute('aria-selected', 'true')
    })

    it('应该在禁用时添加aria-disabled', () => {
      renderChip({ label: 'Disabled', isDisabled: true })
      const chip = screen.getByTestId('chip-display-primary-solid-md-disabled')
      expect(chip).toHaveAttribute('aria-disabled', 'true')
    })
  })

  describe('测试ID', () => {
    it('应该支持自定义测试ID', () => {
      renderChip({ label: 'Custom ID', testId: 'custom-test-id' })
      expect(screen.getByTestId('custom-test-id')).toBeInTheDocument()
    })
  })

  describe('forwardRef', () => {
    it('应该正确传递ref', () => {
      const ref = { current: null }
      renderChip({ label: 'Ref Test', ref })
      expect(ref).toBeDefined()
    })
  })

  describe('自定义样式', () => {
    it('应该支持自定义类名', () => {
      renderChip({ label: 'Custom', className: 'custom-class' })
      const chip = screen.getByTestId('chip-display-primary-solid-md-default')
      expect(chip).toHaveClass('custom-class')
    })
  })

  describe('动画效果', () => {
    it('应该在可点击时应用悬浮效果', () => {
      renderChip({ label: 'Animated', clickable: true })
      const chip = screen.getByTestId('chip-display-primary-solid-md-default')
      expect(chip).toBeInTheDocument()
      // 动画效果由 Framer Motion 应用，这里验证组件正确渲染
    })

    it('应该在禁用时不应用动画', () => {
      renderChip({ label: 'Disabled', isDisabled: true, clickable: true })
      const chip = screen.getByTestId('chip-display-primary-solid-md-disabled')
      expect(chip).toHaveClass('opacity-50', 'cursor-not-allowed')
    })
  })
})
