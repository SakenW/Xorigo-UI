import { render, screen, fireEvent } from '@testing-library/react'
import { PlaygroundErrorBoundary } from '@/components/errors/PlaygroundErrorBoundary'

/**
 * PlaygroundErrorBoundary 单元测试
 */

// 创建会抛出错误的测试组件
const ThrowError = ({ shouldThrow, errorMessage }: { shouldThrow: boolean; errorMessage?: string }) => {
  if (shouldThrow) {
    throw new Error(errorMessage || '测试错误')
  }
  return <div>Playground 内容</div>
}

describe('PlaygroundErrorBoundary', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    // 模拟 localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('应该正常渲染子组件', () => {
    render(
      <PlaygroundErrorBoundary>
        <ThrowError shouldThrow={false} />
      </PlaygroundErrorBoundary>
    )

    expect(screen.getByText('Playground 内容')).toBeInTheDocument()
  })

  it('应该捕获错误并显示 Playground 专用 UI', () => {
    render(
      <PlaygroundErrorBoundary>
        <ThrowError shouldThrow={true} />
      </PlaygroundErrorBoundary>
    )

    // 检查 Playground 特定的错误 UI
    expect(screen.getByText('Playground 遇到了错误')).toBeInTheDocument()
    expect(screen.getByText('不用担心，您的编辑内容已保存')).toBeInTheDocument()
  })

  it('应该显示四个操作按钮', () => {
    render(
      <PlaygroundErrorBoundary>
        <ThrowError shouldThrow={true} />
      </PlaygroundErrorBoundary>
    )

    expect(screen.getByText('重试')).toBeInTheDocument()
    expect(screen.getByText('恢复状态')).toBeInTheDocument()
    expect(screen.getByText('清除缓存')).toBeInTheDocument()
    expect(screen.getByText('返回首页')).toBeInTheDocument()
  })

  it('应该为常见错误提供修复建议', () => {
    render(
      <PlaygroundErrorBoundary>
        <ThrowError shouldThrow={true} errorMessage="Cannot read property 'foo' of undefined" />
      </PlaygroundErrorBoundary>
    )

    // 应该显示修复建议
    expect(screen.getByText('修复建议')).toBeInTheDocument()
    expect(screen.getByText(/可选链操作符/)).toBeInTheDocument()
  })

  it('应该保存错误日志到 localStorage', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')

    render(
      <PlaygroundErrorBoundary>
        <ThrowError shouldThrow={true} errorMessage="测试错误日志" />
      </PlaygroundErrorBoundary>
    )

    expect(setItemSpy).toHaveBeenCalledWith(
      'playground_last_error',
      expect.stringContaining('测试错误日志')
    )
  })

  it('点击清除缓存应该清除 playground 相关的 localStorage', () => {
    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem')
    const reloadSpy = jest.spyOn(window.location, 'reload').mockImplementation(() => {})

    // 模拟 localStorage 中有 playground 数据
    Object.defineProperty(window.localStorage, 'playground_state', {
      value: 'test',
      writable: true,
    })
    Object.defineProperty(window.localStorage, 'playground_code', {
      value: 'test',
      writable: true,
    })

    render(
      <PlaygroundErrorBoundary>
        <ThrowError shouldThrow={true} />
      </PlaygroundErrorBoundary>
    )

    const clearButton = screen.getByText('清除缓存')
    fireEvent.click(clearButton)

    // 应该清除所有 playground_ 开头的键
    expect(removeItemSpy).toHaveBeenCalled()
    expect(reloadSpy).toHaveBeenCalled()
  })

  it('undefined 错误应该显示特定建议', () => {
    render(
      <PlaygroundErrorBoundary>
        <ThrowError shouldThrow={true} errorMessage="foo is undefined" />
      </PlaygroundErrorBoundary>
    )

    expect(screen.getByText(/未定义的变量或属性/)).toBeInTheDocument()
  })

  it('is not a function 错误应该显示特定建议', () => {
    render(
      <PlaygroundErrorBoundary>
        <ThrowError shouldThrow={true} errorMessage="foo is not a function" />
      </PlaygroundErrorBoundary>
    )

    expect(screen.getByText(/尝试调用一个非函数值/)).toBeInTheDocument()
  })

  it('syntax error 应该显示特定建议', () => {
    render(
      <PlaygroundErrorBoundary>
        <ThrowError shouldThrow={true} errorMessage="Syntax error" />
      </PlaygroundErrorBoundary>
    )

    expect(screen.getByText(/代码存在语法错误/)).toBeInTheDocument()
  })

  it('开发模式下应该显示错误堆栈', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'

    render(
      <PlaygroundErrorBoundary>
        <ThrowError shouldThrow={true} />
      </PlaygroundErrorBoundary>
    )

    expect(screen.getByText('查看错误堆栈 (开发模式)')).toBeInTheDocument()

    process.env.NODE_ENV = originalEnv
  })
})
