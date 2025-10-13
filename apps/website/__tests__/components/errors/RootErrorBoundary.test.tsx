import { render, screen, fireEvent } from '@testing-library/react'
import { RootErrorBoundary } from '@/components/errors/RootErrorBoundary'

/**
 * RootErrorBoundary 单元测试
 */

// 创建会抛出错误的测试组件
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('测试错误消息')
  }
  return <div>正常内容</div>
}

describe('RootErrorBoundary', () => {
  // 抑制 console.error 输出 (避免测试输出污染)
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('应该正常渲染子组件', () => {
    render(
      <RootErrorBoundary>
        <ThrowError shouldThrow={false} />
      </RootErrorBoundary>
    )

    expect(screen.getByText('正常内容')).toBeInTheDocument()
  })

  it('应该捕获错误并显示降级 UI', () => {
    render(
      <RootErrorBoundary>
        <ThrowError shouldThrow={true} />
      </RootErrorBoundary>
    )

    // 检查错误 UI 是否显示
    expect(screen.getByText('应用遇到了一个错误')).toBeInTheDocument()
    expect(screen.getByText(/测试错误消息/)).toBeInTheDocument()
  })

  it('应该显示重试按钮', () => {
    render(
      <RootErrorBoundary>
        <ThrowError shouldThrow={true} />
      </RootErrorBoundary>
    )

    const retryButton = screen.getByText('重试')
    expect(retryButton).toBeInTheDocument()
  })

  it('应该显示刷新页面按钮', () => {
    render(
      <RootErrorBoundary>
        <ThrowError shouldThrow={true} />
      </RootErrorBoundary>
    )

    const refreshButton = screen.getByText('刷新页面')
    expect(refreshButton).toBeInTheDocument()
  })

  it('应该显示返回首页按钮', () => {
    render(
      <RootErrorBoundary>
        <ThrowError shouldThrow={true} />
      </RootErrorBoundary>
    )

    const homeButton = screen.getByText('返回首页')
    expect(homeButton).toBeInTheDocument()
  })

  it('点击重试按钮应该重置错误状态', () => {
    const { rerender } = render(
      <RootErrorBoundary>
        <ThrowError shouldThrow={true} />
      </RootErrorBoundary>
    )

    // 点击重试按钮
    const retryButton = screen.getByText('重试')
    fireEvent.click(retryButton)

    // 重新渲染不抛错误的组件
    rerender(
      <RootErrorBoundary>
        <ThrowError shouldThrow={false} />
      </RootErrorBoundary>
    )

    // 应该恢复正常渲染
    expect(screen.getByText('正常内容')).toBeInTheDocument()
  })

  it('应该显示错误计数 (多次错误)', () => {
    const { rerender } = render(
      <RootErrorBoundary>
        <ThrowError shouldThrow={true} />
      </RootErrorBoundary>
    )

    // 第一次错误
    expect(screen.queryByText(/这个错误已经发生了/)).not.toBeInTheDocument()

    // 点击重试
    fireEvent.click(screen.getByText('重试'))

    // 再次触发错误
    rerender(
      <RootErrorBoundary>
        <ThrowError shouldThrow={true} />
      </RootErrorBoundary>
    )

    // 应该显示错误计数
    expect(screen.getByText(/这个错误已经发生了 2 次/)).toBeInTheDocument()
  })

  it('开发模式下应该显示错误堆栈', () => {
    // 模拟开发环境
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'

    render(
      <RootErrorBoundary>
        <ThrowError shouldThrow={true} />
      </RootErrorBoundary>
    )

    // 应该有错误堆栈的 details 元素
    const detailsElement = screen.getByText('错误堆栈 (仅开发模式显示)')
    expect(detailsElement).toBeInTheDocument()

    // 恢复环境变量
    process.env.NODE_ENV = originalEnv
  })

  it('生产模式下不应该显示错误堆栈', () => {
    // 模拟生产环境
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'

    render(
      <RootErrorBoundary>
        <ThrowError shouldThrow={true} />
      </RootErrorBoundary>
    )

    // 不应该有错误堆栈
    expect(screen.queryByText('错误堆栈 (仅开发模式显示)')).not.toBeInTheDocument()

    // 恢复环境变量
    process.env.NODE_ENV = originalEnv
  })
})
