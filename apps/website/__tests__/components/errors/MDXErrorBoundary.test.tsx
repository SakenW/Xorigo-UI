import { render, screen, fireEvent } from '@testing-library/react'
import { MDXErrorBoundary } from '@/components/errors/MDXErrorBoundary'

/**
 * MDXErrorBoundary 单元测试
 */

// 创建会抛出错误的测试组件
const ThrowError = ({ shouldThrow, errorMessage }: { shouldThrow: boolean; errorMessage?: string }) => {
  if (shouldThrow) {
    throw new Error(errorMessage || 'MDX 渲染错误')
  }
  return <div>MDX 内容</div>
}

describe('MDXErrorBoundary', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('应该正常渲染子组件', () => {
    render(
      <MDXErrorBoundary>
        <ThrowError shouldThrow={false} />
      </MDXErrorBoundary>
    )

    expect(screen.getByText('MDX 内容')).toBeInTheDocument()
  })

  it('应该捕获错误并显示 MDX 专用 UI', () => {
    render(
      <MDXErrorBoundary>
        <ThrowError shouldThrow={true} />
      </MDXErrorBoundary>
    )

    expect(screen.getByText('文档渲染出错')).toBeInTheDocument()
  })

  it('应该显示文件路径', () => {
    render(
      <MDXErrorBoundary filePath="/docs/getting-started.mdx">
        <ThrowError shouldThrow={true} />
      </MDXErrorBoundary>
    )

    expect(screen.getByText(/在渲染 \/docs\/getting-started.mdx 时出现问题/)).toBeInTheDocument()
  })

  it('应该显示三个操作按钮', () => {
    render(
      <MDXErrorBoundary>
        <ThrowError shouldThrow={true} />
      </MDXErrorBoundary>
    )

    expect(screen.getByText('重试')).toBeInTheDocument()
    expect(screen.getByText('刷新页面')).toBeInTheDocument()
    expect(screen.getByText('返回文档')).toBeInTheDocument()
  })

  it('应该为 JSX 错误提供修复建议', () => {
    render(
      <MDXErrorBoundary>
        <ThrowError shouldThrow={true} errorMessage="Expected JSX closing tag" />
      </MDXErrorBoundary>
    )

    expect(screen.getByText('可能的原因')).toBeInTheDocument()
    expect(screen.getByText(/JSX 标签未正确闭合/)).toBeInTheDocument()
  })

  it('应该为未定义组件错误提供修复建议', () => {
    render(
      <MDXErrorBoundary>
        <ThrowError shouldThrow={true} errorMessage="Component not defined" />
      </MDXErrorBoundary>
    )

    expect(screen.getByText(/MDX 组件未定义/)).toBeInTheDocument()
  })

  it('应该为 frontmatter 错误提供修复建议', () => {
    render(
      <MDXErrorBoundary>
        <ThrowError shouldThrow={true} errorMessage="Frontmatter parsing error" />
      </MDXErrorBoundary>
    )

    expect(screen.getByText(/Frontmatter 解析错误/)).toBeInTheDocument()
  })

  it('应该为 unexpected token 错误提供修复建议', () => {
    render(
      <MDXErrorBoundary>
        <ThrowError shouldThrow={true} errorMessage="Unexpected token <" />
      </MDXErrorBoundary>
    )

    expect(screen.getByText(/MDX 语法错误/)).toBeInTheDocument()
  })

  it('应该为 hydration 错误提供修复建议', () => {
    render(
      <MDXErrorBoundary>
        <ThrowError shouldThrow={true} errorMessage="Hydration mismatch" />
      </MDXErrorBoundary>
    )

    expect(screen.getByText(/React 水合错误/)).toBeInTheDocument()
  })

  it('应该支持自定义降级 UI', () => {
    const fallback = <div>自定义错误 UI</div>

    render(
      <MDXErrorBoundary fallback={fallback}>
        <ThrowError shouldThrow={true} />
      </MDXErrorBoundary>
    )

    expect(screen.getByText('自定义错误 UI')).toBeInTheDocument()
    expect(screen.queryByText('文档渲染出错')).not.toBeInTheDocument()
  })

  it('点击重试按钮应该重置错误状态', () => {
    const { rerender } = render(
      <MDXErrorBoundary>
        <ThrowError shouldThrow={true} />
      </MDXErrorBoundary>
    )

    const retryButton = screen.getByText('重试')
    fireEvent.click(retryButton)

    rerender(
      <MDXErrorBoundary>
        <ThrowError shouldThrow={false} />
      </MDXErrorBoundary>
    )

    expect(screen.getByText('MDX 内容')).toBeInTheDocument()
  })

  it('点击刷新页面应该调用 window.location.reload', () => {
    const reloadSpy = jest.spyOn(window.location, 'reload').mockImplementation(() => {})

    render(
      <MDXErrorBoundary>
        <ThrowError shouldThrow={true} />
      </MDXErrorBoundary>
    )

    const refreshButton = screen.getByText('刷新页面')
    fireEvent.click(refreshButton)

    expect(reloadSpy).toHaveBeenCalled()
  })

  it('点击返回文档应该导航到 /docs', () => {
    // 模拟 window.location.href
    delete (window as any).location
    window.location = { href: '' } as any

    render(
      <MDXErrorBoundary>
        <ThrowError shouldThrow={true} />
      </MDXErrorBoundary>
    )

    const docsButton = screen.getByText('返回文档')
    fireEvent.click(docsButton)

    expect(window.location.href).toBe('/docs')
  })

  it('开发模式下应该显示错误堆栈', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'

    render(
      <MDXErrorBoundary>
        <ThrowError shouldThrow={true} />
      </MDXErrorBoundary>
    )

    expect(screen.getByText('查看详细堆栈 (开发模式)')).toBeInTheDocument()

    process.env.NODE_ENV = originalEnv
  })

  it('生产模式下不应该显示错误堆栈', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'

    render(
      <MDXErrorBoundary>
        <ThrowError shouldThrow={true} />
      </MDXErrorBoundary>
    )

    expect(screen.queryByText('查看详细堆栈 (开发模式)')).not.toBeInTheDocument()

    process.env.NODE_ENV = originalEnv
  })
})
