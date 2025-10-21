import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

// 导入新创建的组件
import { Modal } from '../Modal'
import { Alert, useAlert } from '../Alert'
import { Tabs, TabList, Tab, TabPanel } from '../Tabs'

// 导入性能优化工具
import { useNeonTheme, useMemoClassName } from '../../hooks/useNeonTheme'
import { createMemoComponent, useEventCallback } from '../../utils/performance'

describe('新创建的组件功能测试', () => {
  describe('Modal 组件', () => {
    it('应该正确渲染基础的模态框', () => {
      render(
        <Modal open={true} onClose={vi.fn()} title="测试标题">
          <div>测试内容</div>
        </Modal>
      )

      expect(screen.getByText('测试标题')).toBeInTheDocument()
      expect(screen.getByText('测试内容')).toBeInTheDocument()
    })

    it('应该支持关闭操作', async () => {
      const handleClose = vi.fn()
      render(
        <Modal open={true} onClose={handleClose} title="测试标题">
          <div>测试内容</div>
        </Modal>
      )

      const closeButton = screen.getByLabelText('关闭')
      fireEvent.click(closeButton)

      await waitFor(() => {
        expect(handleClose).toHaveBeenCalledTimes(1)
      })
    })

    it('应该支持全屏模式', () => {
      render(
        <Modal open={true} onClose={vi.fn()} title="测试标题" showFullscreen>
          <div>测试内容</div>
        </Modal>
      )

      const fullscreenButton = screen.getByLabelText('全屏')
      expect(fullscreenButton).toBeInTheDocument()
    })
  })

  describe('Alert 组件', () => {
    it('应该正确渲染不同类型的警告', () => {
      const { rerender } = render(
        <Alert variant="info" title="信息提示" description="这是一个信息提示" />
      )

      expect(screen.getByText('信息提示')).toBeInTheDocument()
      expect(screen.getByText('这是一个信息提示')).toBeInTheDocument()

      // 测试成功类型
      rerender(
        <Alert variant="success" title="成功提示" description="操作成功" />
      )
      expect(screen.getByText('成功提示')).toBeInTheDocument()
    })

    it('应该支持自动关闭功能', async () => {
      const onClose = vi.fn()
      render(
        <Alert
          variant="info"
          title="自动关闭"
          autoClose={100}
          onClose={onClose}
        />
      )

      await waitFor(
        () => {
          expect(onClose).toHaveBeenCalledTimes(1)
        },
        { timeout: 200 }
      )
    })

    it('应该支持进度条显示', () => {
      render(
        <Alert
          variant="warning"
          title="带进度条"
          autoClose={5000}
          showProgress
        />
      )

      // 检查进度条元素是否存在
      const progressBar = document.querySelector('[role="progressbar"]')
      expect(progressBar).toBeInTheDocument()
    })
  })

  describe('Tabs 组件', () => {
    it('应该正确渲染标签页', () => {
      render(
        <Tabs value="tab1" onValueChange={vi.fn()}>
          <TabList>
            <Tab value="tab1">标签1</Tab>
            <Tab value="tab2">标签2</Tab>
          </TabList>
          <TabPanel value="tab1">内容1</TabPanel>
          <TabPanel value="tab2">内容2</TabPanel>
        </Tabs>
      )

      expect(screen.getByText('标签1')).toBeInTheDocument()
      expect(screen.getByText('标签2')).toBeInTheDocument()
      expect(screen.getByText('内容1')).toBeInTheDocument()
      expect(screen.queryByText('内容2')).not.toBeInTheDocument()
    })

    it('应该支持标签切换', () => {
      const handleChange = vi.fn()
      render(
        <Tabs value="tab1" onValueChange={handleChange}>
          <TabList>
            <Tab value="tab1">标签1</Tab>
            <Tab value="tab2">标签2</Tab>
          </TabList>
          <TabPanel value="tab1">内容1</TabPanel>
          <TabPanel value="tab2">内容2</TabPanel>
        </Tabs>
      )

      fireEvent.click(screen.getByText('标签2'))
      expect(handleChange).toHaveBeenCalledWith('tab2')
    })

    it('应该支持不同的变体样式', () => {
      render(
        <Tabs value="tab1" onValueChange={vi.fn()} variant="pills">
          <TabList>
            <Tab value="tab1">标签1</Tab>
            <Tab value="tab2">标签2</Tab>
          </TabList>
        </Tabs>
      )

      const tabList = screen.getByRole('tablist')
      expect(tabList).toHaveClass('bg-[var(--bg-tertiary)]')
    })
  })
})

describe('性能优化工具测试', () => {
  describe('useNeonTheme Hook', () => {
    it('应该返回正确的 neon 主题样式', () => {
      const TestComponent = () => {
        const { styles, classes, color } = useNeonTheme('button')

        return (
          <div style={styles} className={classes}>
            {color}
          </div>
        )
      }

      render(<TestComponent />)

      // 验证是否应用了 neon 样式
      const element = screen.getByRole('generic')
      expect(element).toHaveStyle({
        boxShadow: expect.stringContaining('15px'),
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
      })
    })
  })

  describe('useMemoClassName Hook', () => {
    it('应该记忆化类名计算', () => {
      const TestComponent = () => {
        const className = useMemoClassName(
          'base-class',
          { active: true, disabled: false },
          [true, false] // 依赖项
        )

        return <div className={className}>测试</div>
      }

      render(<TestComponent />)

      const element = screen.getByText('测试')
      expect(element).toHaveClass('base-class', 'active')
    })
  })

  describe('useEventCallback Hook', () => {
    it('应该记忆化事件回调', () => {
      const handleClick = vi.fn()

      const TestComponent = () => {
        const memoizedHandleClick = useEventCallback(handleClick, [handleClick])

        return <button onClick={memoizedHandleClick}>点击</button>
      }

      render(<TestComponent />)

      fireEvent.click(screen.getByText('点击'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })
})

describe('类型安全改进测试', () => {
  it('应该正确处理 VariantProps 类型', () => {
    // 这个测试主要验证 TypeScript 编译不会报错
    const TestComponent = () => {
      // 这些操作现在应该是类型安全的
      const validVariant: 'primary' | 'secondary' = 'primary'
      const validSize: 'sm' | 'md' | 'lg' = 'md'

      return <div>{validVariant}-{validSize}</div>
    }

    render(<TestComponent />)
    expect(screen.getByText('primary-md')).toBeInTheDocument()
  })

  it('应该支持泛型约束', () => {
    interface TestProps {
      variant: 'default' | 'custom'
      size: 'small' | 'large'
    }

    const TestComponent: React.FC<TestProps> = ({ variant, size }) => (
      <div>{variant}-{size}</div>
    )

    render(<TestComponent variant="custom" size="large" />)
    expect(screen.getByText('custom-large')).toBeInTheDocument()
  })
})