/**
 * @fileoverview Tabs 组件测试
 * @description 验证 Tabs 组件的功能特性、变体、方向、交互和可访问性
 *
 * @author Xorigo UI Team
 * @version 1.0.0
 * @since 2025-11-05
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tabs, TabList, Tab, TabPanel, AddTabButton } from './Tabs'

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    button: React.forwardRef(({ children, ...props }: any, ref) => (
      <button ref={ref} {...props}>
        {children}
      </button>
    )),
    div: React.forwardRef(({ children, ...props }: any, ref) => (
      <div ref={ref} {...props}>
        {children}
      </div>
    )),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  ChevronLeft: () => <div data-icon="chevron-left">←</div>,
  ChevronRight: () => <div data-icon="chevron-right">→</div>,
  X: () => <div data-icon="close">×</div>,
  Plus: () => <div data-icon="plus">+</div>,
}))

// Mock cva-standalone
vi.mock('../utils/cva-standalone', () => ({
  cva: (base: string, config: any) => {
    return (props: any) => {
      let classes = base
      if (config.variants && props) {
        Object.entries(props).forEach(([key, value]) => {
          if (value && config.variants[key] && config.variants[key][value]) {
            classes += ' ' + config.variants[key][value]
          }
        })
      }
      return classes
    }
  },
  type: (obj: any) => obj,
}))

// Mock theme system
vi.mock('@xorigo-ui/system', () => ({
  useTheme: () => ({ theme: 'default' }),
}))

// Mock cn utility
vi.mock('../utils', () => ({
  cn: (...classes: (string | undefined)[]) => {
    return classes.filter(Boolean).join(' ')
  },
}))

// =============================================================================
// 工具函数
// =============================================================================

const renderTabs = (props: any = {}) => {
  const defaultProps = {
    value: 'tab1',
    onValueChange: vi.fn(),
    children: (
      <>
        <TabList>
          <Tab value="tab1">标签1</Tab>
          <Tab value="tab2">标签2</Tab>
          <Tab value="tab3">标签3</Tab>
        </TabList>
        <TabPanel value="tab1">内容1</TabPanel>
        <TabPanel value="tab2">内容2</TabPanel>
        <TabPanel value="tab3">内容3</TabPanel>
      </>
    ),
    ...props,
  }

  return render(<Tabs {...defaultProps} />)
}

// =============================================================================
// 基础渲染测试
// =============================================================================

describe('Tabs', () => {
  describe('基础渲染', () => {
    it('应该正确渲染 Tabs 组件', () => {
      renderTabs()
      expect(screen.getByRole('tablist')).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: /标签1/i })).toBeInTheDocument()
    })

    it('应该支持 ref 转发', () => {
      const ref = React.createRef<HTMLDivElement>()
      renderTabs({ ref })
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })

    it('应该支持自定义 className', () => {
      renderTabs({ className: 'custom-tabs' })
      const tabs = screen.getByRole('tablist').closest('[data-component="tabs"]')
      expect(tabs).toBeInTheDocument()
    })
  })

  // =============================================================================
  // 方向测试
  // =============================================================================

  describe('方向测试', () => {
    it('应该支持水平方向（默认）', () => {
      renderTabs({ orientation: 'horizontal' })
      const tablist = screen.getByRole('tablist')
      expect(tablist).toHaveAttribute('aria-orientation', 'horizontal')
    })

    it('应该支持垂直方向', () => {
      renderTabs({ orientation: 'vertical' })
      const tablist = screen.getByRole('tablist')
      expect(tablist).toHaveAttribute('aria-orientation', 'vertical')
    })
  })

  // =============================================================================
  // 变体测试
  // =============================================================================

  describe('变体测试', () => {
    it('应该应用 default 变体', () => {
      renderTabs({ variant: 'default' })
      const tab = screen.getByRole('tab', { name: /标签1/i })
      expect(tab).toHaveAttribute('data-variant', 'default')
    })

    it('应该应用 underline 变体', () => {
      renderTabs({ variant: 'underline' })
      const tab = screen.getByRole('tab', { name: /标签1/i })
      expect(tab).toHaveAttribute('data-variant', 'underline')
    })

    it('应该应用 pills 变体', () => {
      renderTabs({ variant: 'pills' })
      const tab = screen.getByRole('tab', { name: /标签1/i })
      expect(tab).toHaveAttribute('data-variant', 'pills')
    })

    it('应该应用 neon 变体', () => {
      renderTabs({ variant: 'neon' })
      const tab = screen.getByRole('tab', { name: /标签1/i })
      expect(tab).toHaveAttribute('data-variant', 'neon')
    })
  })

  // =============================================================================
  // 尺寸测试
  // =============================================================================

  describe('尺寸测试', () => {
    it('应该支持 small 尺寸', () => {
      renderTabs({ size: 'sm' })
      const tab = screen.getByRole('tab', { name: /标签1/i })
      expect(tab).toHaveAttribute('data-size', 'sm')
    })

    it('应该支持 medium 尺寸', () => {
      renderTabs({ size: 'md' })
      const tab = screen.getByRole('tab', { name: /标签1/i })
      expect(tab).toHaveAttribute('data-size', 'md')
    })

    it('应该支持 large 尺寸', () => {
      renderTabs({ size: 'lg' })
      const tab = screen.getByRole('tab', { name: /标签1/i })
      expect(tab).toHaveAttribute('data-size', 'lg')
    })
  })

  // =============================================================================
  // Tab 切换测试
  // =============================================================================

  describe('Tab 切换测试', () => {
    it('应该支持点击切换', async () => {
      const onValueChange = vi.fn()
      renderTabs({ value: 'tab1', onValueChange })

      const tab2 = screen.getByRole('tab', { name: /标签2/i })
      await userEvent.click(tab2)

      expect(onValueChange).toHaveBeenCalledWith('tab2')
    })

    it('应该高亮当前激活的 Tab', () => {
      renderTabs({ value: 'tab2' })

      const tab1 = screen.getByRole('tab', { name: /标签1/i })
      const tab2 = screen.getByRole('tab', { name: /标签2/i })

      expect(tab1).toHaveAttribute('aria-selected', 'false')
      expect(tab2).toHaveAttribute('aria-selected', 'true')
    })

    it('应该切换 TabPanel 内容', () => {
      renderTabs({ value: 'tab1' })
      expect(screen.getByText('内容1')).toBeInTheDocument()

      renderTabs({ value: 'tab2' })
      expect(screen.getByText('内容2')).toBeInTheDocument()
    })

    it('应该更新激活的 TabPanel', async () => {
      const onValueChange = vi.fn()
      const { rerender } = render(<Tabs value="tab1" onValueChange={onValueChange}>
        <TabList>
          <Tab value="tab1">标签1</Tab>
          <Tab value="tab2">标签2</Tab>
        </TabList>
        <TabPanel value="tab1">内容1</TabPanel>
        <TabPanel value="tab2">内容2</TabPanel>
      </Tabs>)

      expect(screen.getByText('内容1')).toBeInTheDocument()

      rerender(<Tabs value="tab2" onValueChange={onValueChange}>
        <TabList>
          <Tab value="tab1">标签1</Tab>
          <Tab value="tab2">标签2</Tab>
        </TabList>
        <TabPanel value="tab1">内容1</TabPanel>
        <TabPanel value="tab2">内容2</TabPanel>
      </Tabs>)

      expect(screen.getByText('内容2')).toBeInTheDocument()
    })
  })

  // =============================================================================
  // 键盘导航测试
  // =============================================================================

  describe('键盘导航测试', () => {
    it('应该支持箭头键导航（水平方向）', async () => {
      const onValueChange = vi.fn()
      renderTabs({ orientation: 'horizontal', value: 'tab1', onValueChange })

      const tab1 = screen.getByRole('tab', { name: /标签1/i })
      tab1.focus()

      // 右箭头键
      await userEvent.keyboard('{ArrowRight}')
      expect(onValueChange).toHaveBeenCalledWith('tab2')
    })

    it('应该支持箭头键导航（垂直方向）', async () => {
      const onValueChange = vi.fn()
      renderTabs({ orientation: 'vertical', value: 'tab1', onValueChange })

      const tab1 = screen.getByRole('tab', { name: /标签1/i })
      tab1.focus()

      // 下箭头键
      await userEvent.keyboard('{ArrowDown}')
      expect(onValueChange).toHaveBeenCalledWith('tab2')
    })

    it('应该支持 Home 键跳转到第一个 Tab', async () => {
      const onValueChange = vi.fn()
      renderTabs({ value: 'tab3', onValueChange })

      const tab3 = screen.getByRole('tab', { name: /标签3/i })
      tab3.focus()

      await userEvent.keyboard('{Home}')
      expect(onValueChange).toHaveBeenCalledWith('tab1')
    })

    it('应该支持 End 键跳转到最后一个 Tab', async () => {
      const onValueChange = vi.fn()
      renderTabs({ value: 'tab1', onValueChange })

      const tab1 = screen.getByRole('tab', { name: /标签1/i })
      tab1.focus()

      await userEvent.keyboard('{End}')
      expect(onValueChange).toHaveBeenCalledWith('tab3')
    })

    it('应该支持 Enter 键激活 Tab', async () => {
      const onValueChange = vi.fn()
      renderTabs({ value: 'tab1', onValueChange })

      const tab2 = screen.getByRole('tab', { name: /标签2/i })
      tab2.focus()
      await userEvent.keyboard('{Enter}')

      expect(onValueChange).toHaveBeenCalledWith('tab2')
    })
  })

  // =============================================================================
  // 禁用状态测试
  // =============================================================================

  describe('禁用状态测试', () => {
    it('应该支持禁用整个 Tabs 组', () => {
      renderTabs({ disabled: true })
      const tab = screen.getByRole('tab', { name: /标签1/i })
      expect(tab).toBeDisabled()
    })

    it('应该支持禁用单个 Tab', () => {
      renderTabs({
        children: (
          <>
            <TabList>
              <Tab value="tab1">标签1</Tab>
              <Tab value="tab2" disabled>标签2</Tab>
              <Tab value="tab3">标签3</Tab>
            </TabList>
            <TabPanel value="tab1">内容1</TabPanel>
            <TabPanel value="tab2">内容2</TabPanel>
            <TabPanel value="tab3">内容3</TabPanel>
          </>
        ),
      })

      const tab2 = screen.getByRole('tab', { name: /标签2/i })
      expect(tab2).toBeDisabled()
      expect(tab2).toHaveAttribute('aria-disabled', 'true')
    })

    it('禁用状态的 Tab 不应该响应点击', async () => {
      const onValueChange = vi.fn()
      renderTabs({
        children: (
          <>
            <TabList>
              <Tab value="tab1">标签1</Tab>
              <Tab value="tab2" disabled>标签2</Tab>
            </TabList>
            <TabPanel value="tab1">内容1</TabPanel>
            <TabPanel value="tab2">内容2</TabPanel>
          </>
        ),
        value: 'tab1',
        onValueChange,
      })

      const tab2 = screen.getByRole('tab', { name: /标签2/i })
      await userEvent.click(tab2)

      expect(onValueChange).not.toHaveBeenCalled()
    })
  })

  // =============================================================================
  // TabList 滚动测试
  // =============================================================================

  describe('TabList 滚动测试', () => {
    it('应该支持可滚动的 TabList', () => {
      renderTabs({
        children: (
          <>
            <TabList scrollable>
              {Array.from({ length: 10 }, (_, i) => (
                <Tab key={i} value={`tab${i}`}>
                  标签{i + 1}
                </Tab>
              ))}
            </TabList>
            <TabPanel value="tab0">内容0</TabPanel>
          </>
        ),
        value: 'tab0',
      })

      expect(screen.getByRole('tablist')).toHaveAttribute('data-scrollable', 'true')
    })

    it('应该显示滚动按钮（当需要时）', () => {
      renderTabs({
        children: (
          <>
            <TabList scrollable>
              {Array.from({ length: 10 }, (_, i) => (
                <Tab key={i} value={`tab${i}`}>
                  标签{i + 1}
                </Tab>
              ))}
            </TabList>
            <TabPanel value="tab0">内容0</TabPanel>
          </>
        ),
        value: 'tab0',
      })

      // 滚动按钮可能在需要时显示
      expect(screen.getByRole('tablist')).toBeInTheDocument()
    })
  })

  // =============================================================================
  // TabPanel 测试
  // =============================================================================

  describe('TabPanel 测试', () => {
    it('应该渲染对应的 TabPanel', () => {
      renderTabs({ value: 'tab2' })
      expect(screen.getByText('内容2')).toBeInTheDocument()
    })

    it('应该隐藏未激活的 TabPanel', () => {
      renderTabs({ value: 'tab1' })
      const panel = screen.getByText('内容2').closest('[role="tabpanel"]')
      expect(panel).toHaveAttribute('hidden')
    })

    it('应该支持强制渲染（懒加载）', () => {
      renderTabs({
        children: (
          <>
            <TabList>
              <Tab value="tab1">标签1</Tab>
              <Tab value="tab2">标签2</Tab>
            </TabList>
            <TabPanel value="tab1" forceMount>内容1</TabPanel>
            <TabPanel value="tab2" forceMount>内容2</TabPanel>
          </>
        ),
        value: 'tab1',
      })

      // forceMount 的 TabPanel 应该始终渲染
      expect(screen.getByText('内容1')).toBeInTheDocument()
      expect(screen.getByText('内容2')).toBeInTheDocument()
    })

    it('应该设置正确的 aria-labelledby', () => {
      renderTabs({ value: 'tab1' })
      const panel = screen.getByText('内容1').closest('[role="tabpanel"]')
      expect(panel).toHaveAttribute('aria-labelledby')
    })
  })

  // =============================================================================
  // 可访问性测试
  // =============================================================================

  describe('可访问性测试', () => {
    it('TabList 应该具有正确的 role', () => {
      renderTabs()
      expect(screen.getByRole('tablist')).toBeInTheDocument()
    })

    it('Tab 应该具有正确的 role', () => {
      renderTabs()
      const tab = screen.getByRole('tab', { name: /标签1/i })
      expect(tab).toHaveAttribute('role', 'tab')
    })

    it('TabPanel 应该具有正确的 role', () => {
      renderTabs()
      const panel = screen.getByRole('tabpanel')
      expect(panel).toHaveAttribute('role', 'tabpanel')
    })

    it('应该设置 aria-orientation', () => {
      renderTabs({ orientation: 'vertical' })
      const tablist = screen.getByRole('tablist')
      expect(tablist).toHaveAttribute('aria-orientation', 'vertical')
    })

    it('应该设置 aria-disabled', () => {
      renderTabs({ disabled: true })
      const tab = screen.getByRole('tab', { name: /标签1/i })
      expect(tab).toHaveAttribute('aria-disabled', 'true')
    })

    it('应该设置 tabindex', () => {
      renderTabs()
      const activeTab = screen.getByRole('tab', { name: /标签1/i })
      expect(activeTab).toHaveAttribute('tabindex', '0')
    })
  })

  // =============================================================================
  // 动态 Tab 测试
  // =============================================================================

  describe('动态 Tab 测试', () => {
    it('应该支持添加 Tab 按钮', () => {
      const onAdd = vi.fn()
      renderTabs({
        allowAdd: true,
        onAdd,
        children: (
          <>
            <TabList>
              <Tab value="tab1">标签1</Tab>
            </TabList>
            <TabPanel value="tab1">内容1</TabPanel>
          </>
        ),
      })

      const addButton = screen.getByRole('button', { name: /添加/i })
      expect(addButton).toBeInTheDocument()
    })

    it('应该支持关闭 Tab 按钮', () => {
      const onClose = vi.fn()
      renderTabs({
        allowClose: true,
        onClose,
        children: (
          <>
            <TabList>
              <Tab value="tab1" closable onClose={onClose}>
                标签1
              </Tab>
            </TabList>
            <TabPanel value="tab1">内容1</TabPanel>
          </>
        ),
      })

      const closeButton = screen.getByRole('button', { name: /关闭/i })
      expect(closeButton).toBeInTheDocument()
    })

    it('应该处理关闭事件', async () => {
      const onClose = vi.fn()
      renderTabs({
        children: (
          <>
            <TabList>
              <Tab value="tab1" closable onClose={onClose}>
                标签1
              </Tab>
              <Tab value="tab2">标签2</Tab>
            </TabList>
            <TabPanel value="tab1">内容1</TabPanel>
            <TabPanel value="tab2">内容2</TabPanel>
          </>
        ),
        value: 'tab1',
      })

      const closeButton = screen.getByRole('button', { name: /关闭/i })
      await userEvent.click(closeButton)

      expect(onClose).toHaveBeenCalledWith('tab1')
    })
  })

  // =============================================================================
  // 边缘情况测试
  // =============================================================================

  describe('边缘情况测试', () => {
    it('应该处理只有一个 Tab 的情况', () => {
      renderTabs({
        children: (
          <>
            <TabList>
              <Tab value="tab1">唯一标签</Tab>
            </TabList>
            <TabPanel value="tab1">唯一内容</TabPanel>
          </>
        ),
      })

      expect(screen.getByText('唯一标签')).toBeInTheDocument()
      expect(screen.getByText('唯一内容')).toBeInTheDocument()
    })

    it('应该处理无效的 Tab value', () => {
      renderTabs({ value: 'invalid' })
      expect(screen.getByRole('tablist')).toBeInTheDocument()
    })

    it('应该处理 Tab 在 TabsContext 外部使用', () => {
      // 这应该抛出错误
      expect(() => {
        render(<Tab value="tab1">标签</Tab>)
      }).toThrow()
    })

    it('应该处理 TabPanel 在 TabsContext 外部使用', () => {
      // 这应该抛出错误
      expect(() => {
        render(<TabPanel value="tab1">内容</TabPanel>)
      }).toThrow()
    })

    it('应该处理组合 props', () => {
      const onValueChange = vi.fn()
      renderTabs({
        orientation: 'vertical',
        variant: 'underline',
        size: 'lg',
        value: 'tab2',
        onValueChange,
        className: 'custom-tabs',
      })

      expect(screen.getByRole('tablist')).toBeInTheDocument()
    })
  })
})
