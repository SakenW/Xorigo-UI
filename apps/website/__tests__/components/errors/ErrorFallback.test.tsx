import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorFallback } from '@/components/errors/ErrorFallback'

/**
 * ErrorFallback 单元测试
 */

describe('ErrorFallback', () => {
  const mockError = new Error('测试错误消息')

  it('应该显示默认标题和描述', () => {
    render(<ErrorFallback error={mockError} />)

    expect(screen.getByText('出现错误')).toBeInTheDocument()
  })

  it('应该显示自定义标题和描述', () => {
    render(
      <ErrorFallback
        error={mockError}
        title="自定义标题"
        description="自定义描述"
      />
    )

    expect(screen.getByText('自定义标题')).toBeInTheDocument()
    expect(screen.getByText('自定义描述')).toBeInTheDocument()
  })

  it('showErrorDetails=true 时应该显示错误详情', () => {
    render(
      <ErrorFallback
        error={mockError}
        showErrorDetails={true}
      />
    )

    expect(screen.getByText('错误详情')).toBeInTheDocument()
    expect(screen.getByText('测试错误消息')).toBeInTheDocument()
  })

  it('showErrorDetails=false 时不应该显示错误详情', () => {
    render(
      <ErrorFallback
        error={mockError}
        showErrorDetails={false}
      />
    )

    expect(screen.queryByText('错误详情')).not.toBeInTheDocument()
    expect(screen.queryByText('测试错误消息')).not.toBeInTheDocument()
  })

  it('提供 onReset 时应该显示重试按钮', () => {
    const handleReset = jest.fn()

    render(
      <ErrorFallback
        error={mockError}
        onReset={handleReset}
      />
    )

    const retryButton = screen.getByText('重试')
    expect(retryButton).toBeInTheDocument()
  })

  it('点击重试按钮应该调用 onReset', () => {
    const handleReset = jest.fn()

    render(
      <ErrorFallback
        error={mockError}
        onReset={handleReset}
      />
    )

    const retryButton = screen.getByText('重试')
    fireEvent.click(retryButton)

    expect(handleReset).toHaveBeenCalledTimes(1)
  })

  it('应该渲染自定义操作按钮', () => {
    render(
      <ErrorFallback
        error={mockError}
        actions={
          <button>自定义按钮</button>
        }
      />
    )

    expect(screen.getByText('自定义按钮')).toBeInTheDocument()
  })

  it('variant=error 应该使用红色主题', () => {
    const { container } = render(
      <ErrorFallback error={mockError} variant="error" />
    )

    // 检查是否包含 red 相关的 class
    expect(container.innerHTML).toContain('from-red-500')
  })

  it('variant=warning 应该使用黄色主题', () => {
    const { container } = render(
      <ErrorFallback error={mockError} variant="warning" />
    )

    expect(container.innerHTML).toContain('from-amber-500')
  })

  it('variant=info 应该使用蓝色主题', () => {
    const { container } = render(
      <ErrorFallback error={mockError} variant="info" />
    )

    expect(container.innerHTML).toContain('from-blue-500')
  })

  it('error=null 时不应该崩溃', () => {
    expect(() => {
      render(<ErrorFallback error={null} showErrorDetails={true} />)
    }).not.toThrow()
  })

  it('应该支持组合使用多个 props', () => {
    const handleReset = jest.fn()

    render(
      <ErrorFallback
        error={mockError}
        title="组合测试"
        description="描述文本"
        showErrorDetails={true}
        onReset={handleReset}
        variant="warning"
        actions={<button>额外按钮</button>}
      />
    )

    expect(screen.getByText('组合测试')).toBeInTheDocument()
    expect(screen.getByText('描述文本')).toBeInTheDocument()
    expect(screen.getByText('错误详情')).toBeInTheDocument()
    expect(screen.getByText('重试')).toBeInTheDocument()
    expect(screen.getByText('额外按钮')).toBeInTheDocument()
  })
})
