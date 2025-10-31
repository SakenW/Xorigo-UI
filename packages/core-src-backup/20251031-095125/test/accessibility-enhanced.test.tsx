/**
 * 增强可访问性测试套件
 *
 * 全面测试组件的可访问性，包括WCAG 2.1 AA合规、键盘导航、
 * 屏幕阅读器支持、颜色对比度和ARIA属性
 */

import React from 'react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import '@testing-library/jest-dom'

// 导入组件
import { Button } from '../primitives/button/button'
import { Input } from '../primitives/input/input'
import { Card } from '../data-display/card/card'
import { Modal } from '../overlays/modal/modal'
import { Alert } from '../feedback/alert/alert'
import { Badge } from '../feedback/badge/badge'
import { Tooltip } from '../feedback/tooltip/tooltip'

// 导入主题系统
import { ThemeProvider } from '../system/theme-provider'

// 扩展 Jest 匹配器
expect.extend(toHaveNoViolations)

// 可访问性测试配置
const A11Y_CONFIG = {
  timeout: 1000,
  rules: {
    // 自定义axe规则
    'color-contrast': { enabled: true },
    'keyboard-navigation': { enabled: true },
    'aria-labels': { enabled: true },
    'focus-management': { enabled: true }
  }
}

// 模拟屏幕阅读器环境
const mockScreenReader = () => {
  // 模拟屏幕阅读器API
  Object.defineProperty(window, 'speechSynthesis', {
    value: {
      speak: vi.fn(),
      cancel: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
      getVoices: vi.fn(() => [])
    },
    writable: true
  })

  // 模拟ARIA live region
  Object.defineProperty(window, 'AccessibilityNodeList', {
    value: vi.fn(),
    writable: true
  })
}

// 键盘导航测试辅助函数
const testKeyboardNavigation = async (element: HTMLElement, keys: string[]) => {
  for (const key of keys) {
    fireEvent.keyDown(element, { key })
    await waitFor(() => {}, { timeout: 50 })
  }
}

// 颜色对比度测试辅助函数
const checkColorContrast = (element: HTMLElement): ContrastResult => {
  const styles = window.getComputedStyle(element)
  const foregroundColor = styles.color
  const backgroundColor = styles.backgroundColor

  // 简化的对比度计算（实际应该使用专业库）
  const getLuminance = (color: string): number => {
    // 简化的亮度计算
    const rgb = color.match(/\d+/g)
    if (!rgb) return 0
    const [r, g, b] = rgb.map(Number)
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255
  }

  const fgLuminance = getLuminance(foregroundColor)
  const bgLuminance = getLuminance(backgroundColor)

  const ratio = (Math.max(fgLuminance, bgLuminance) + 0.05) /
               (Math.min(fgLuminance, bgLuminance) + 0.05)

  return {
    ratio,
    foregroundColor,
    backgroundColor,
    wcagAA: ratio >= 4.5,
    wcagAAA: ratio >= 7,
    recommendation: ratio < 4.5 ? '增加颜色对比度' : undefined
  }
}

// 类型定义
interface ContrastResult {
  ratio: number
  foregroundColor: string
  backgroundColor: string
  wcagAA: boolean
  wcagAAA: boolean
  recommendation?: string
}

interface A11yTestResult {
  component: string
  wcagCompliant: boolean
  issues: A11yIssue[]
  score: number
}

interface A11yIssue {
  type: 'error' | 'warning' | 'info'
  category: 'keyboard' | 'aria' | 'contrast' | 'focus' | 'semantic'
  message: string
  element: string
  recommendation: string
}

// 增强可访问性测试套件
describe('增强可访问性测试套件', () => {
  beforeEach(() => {
    mockScreenReader()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // =============================================================================
  // 1. WCAG合规性测试
  // =============================================================================
  describe('WCAG 2.1 AA合规性测试', () => {
    const themes = [
      { name: 'Light', mode: 'light' },
      { name: 'Dark', mode: 'dark' },
      { name: 'High Contrast', mode: 'hc' }
    ]

    themes.forEach(theme => {
      describe(`${theme.name}主题下的WCAG合规性`, () => {
        it('Button组件应该通过axe-core检查', async () => {
          const { container } = render(
            <ThemeProvider initialAxes={{ mode: theme.mode as any }}>
              <div>
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="destructive">Destructive Button</Button>
                <Button disabled>Disabled Button</Button>
              </div>
            </ThemeProvider>
          )

          const results = await axe(container, A11Y_CONFIG)
          expect(results).toHaveNoViolations()
        })

        it('Input组件应该通过axe-core检查', async () => {
          const { container } = render(
            <ThemeProvider initialAxes={{ mode: theme.mode as any }}>
              <div>
                <Input placeholder="输入框" />
                <Input placeholder="必填输入框" required />
                <Input placeholder="禁用输入框" disabled />
                <Input placeholder="错误输入框" aria-invalid="true" />
              </div>
            </ThemeProvider>
          )

          const results = await axe(container, A11Y_CONFIG)
          expect(results).toHaveNoViolations()
        })

        it('Card组件应该通过axe-core检查', async () => {
          const { container } = render(
            <ThemeProvider initialAxes={{ mode: theme.mode as any }}>
              <Card>
                <Card.Header>
                  <Card.Title>卡片标题</Card.Title>
                </Card.Header>
                <Card.Content>
                  <p>这是卡片内容</p>
                </Card.Content>
                <Card.Footer>
                  <Button>操作</Button>
                </Card.Footer>
              </Card>
            </ThemeProvider>
          )

          const results = await axe(container, A11Y_CONFIG)
          expect(results).toHaveNoViolations()
        })

        it('Modal组件应该通过axe-core检查', async () => {
          const { container } = render(
            <ThemeProvider initialAxes={{ mode: theme.mode as any }}>
              <Modal isOpen={true} onClose={() => {}}>
                <Modal.Header>
                  <Modal.Title>模态框标题</Modal.Title>
                </Modal.Header>
                <Modal.Content>
                  <p>模态框内容</p>
                  <Input placeholder="输入框" />
                </Modal.Content>
                <Modal.Footer>
                  <Button>确认</Button>
                  <Button variant="secondary">取消</Button>
                </Modal.Footer>
              </Modal>
            </ThemeProvider>
          )

          const results = await axe(container, A11Y_CONFIG)
          expect(results).toHaveNoViolations()
        })

        it('Alert组件应该通过axe-core检查', async () => {
          const { container } = render(
            <ThemeProvider initialAxes={{ mode: theme.mode as any }}>
              <div>
                <Alert variant="success">成功消息</Alert>
                <Alert variant="warning">警告消息</Alert>
                <Alert variant="error">错误消息</Alert>
                <Alert variant="info">信息消息</Alert>
              </div>
            </ThemeProvider>
          )

          const results = await axe(container, A11Y_CONFIG)
          expect(results).toHaveNoViolations()
        })
      })
    })
  })

  // =============================================================================
  // 2. 键盘导航测试
  // =============================================================================
  describe('键盘导航测试', () => {
    it('Button组件应该支持键盘操作', async () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>键盘测试按钮</Button>)

      const button = screen.getByRole('button')

      // Tab键聚焦
      fireEvent.tab()
      expect(button).toHaveFocus()

      // Enter键激活
      fireEvent.keyDown(button, { key: 'Enter' })
      expect(handleClick).toHaveBeenCalledTimes(1)

      // Space键激活
      fireEvent.keyDown(button, { key: ' ' })
      expect(handleClick).toHaveBeenCalledTimes(2)

      // Esc键应该不会触发
      fireEvent.keyDown(button, { key: 'Escape' })
      expect(handleClick).toHaveBeenCalledTimes(2)
    })

    it('Input组件应该支持键盘操作', async () => {
      render(<Input placeholder="键盘测试输入框" />)

      const input = screen.getByRole('textbox')

      // Tab键聚焦
      fireEvent.tab()
      expect(input).toHaveFocus()

      // 输入测试
      fireEvent.change(input, { target: { value: '测试输入' } })
      expect(input).toHaveValue('测试输入')

      // 方向键导航
      fireEvent.keyDown(input, { key: 'ArrowLeft' })
      fireEvent.keyDown(input, { key: 'ArrowRight' })

      // Home/End键
      fireEvent.keyDown(input, { key: 'Home' })
      fireEvent.keyDown(input, { key: 'End' })
    })

    it('Modal组件应该正确管理焦点', async () => {
      const handleClose = vi.fn()
      render(
        <Modal isOpen={true} onClose={handleClose}>
          <Modal.Header>
            <Modal.Title>焦点测试模态框</Modal.Title>
          </Modal.Header>
          <Modal.Content>
            <Input placeholder="第一个输入框" />
            <Input placeholder="第二个输入框" />
          </Modal.Content>
          <Modal.Footer>
            <Button>确认</Button>
            <Button variant="secondary">取消</Button>
          </Modal.Footer>
        </Modal>
      )

      // 模态框打开时，焦点应该在第一个可交互元素上
      const firstInput = screen.getAllByRole('textbox')[0]
      expect(firstInput).toHaveFocus()

      // Tab键应该在模态框内循环
      fireEvent.tab()
      expect(screen.getAllByRole('textbox')[1]).toHaveFocus()

      fireEvent.tab()
      expect(screen.getByText('确认')).toHaveFocus()

      fireEvent.tab()
      expect(screen.getByText('取消')).toHaveFocus()

      fireEvent.tab()
      // 应该回到第一个输入框
      expect(firstInput).toHaveFocus()

      // Esc键应该关闭模态框
      fireEvent.keyDown(document.activeElement!, { key: 'Escape' })
      expect(handleClose).toHaveBeenCalledTimes(1)
    })

    it('应该支持Tab键顺序导航', () => {
      render(
        <div>
          <Button>第一个按钮</Button>
          <Input placeholder="中间输入框" />
          <Button>第二个按钮</Button>
          <Input placeholder="最后输入框" disabled />
        </div>
      )

      const elements = [
        screen.getByText('第一个按钮'),
        screen.getByPlaceholderText('中间输入框'),
        screen.getByText('第二个按钮')
        // 注意：禁用的输入框不应该被包含在Tab顺序中
      ]

      // 测试Tab顺序
      elements.forEach((element, index) => {
        fireEvent.tab()
        expect(element).toHaveFocus()
      })
    })
  })

  // =============================================================================
  // 3. 屏幕阅读器支持测试
  // =============================================================================
  describe('屏幕阅读器支持测试', () => {
    beforeEach(() => {
      mockScreenReader()
    })

    it('应该正确提供ARIA标签', () => {
      render(
        <div>
          <Button aria-label="删除项目">删除</Button>
          <Input aria-label="用户名" placeholder="请输入用户名" />
          <Alert role="alert">重要通知</Alert>
        </div>
      )

      const button = screen.getByLabelText('删除项目')
      expect(button).toBeInTheDocument()
      expect(button).toHaveAttribute('aria-label', '删除项目')

      const input = screen.getByLabelText('用户名')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('aria-label', '用户名')

      const alert = screen.getByRole('alert')
      expect(alert).toBeInTheDocument()
    })

    it('应该正确处理动态内容更新', async () => {
      const DynamicContent = () => {
        const [message, setMessage] = React.useState('初始消息')
        const [count, setCount] = React.useState(0)

        const updateMessage = () => {
          setCount(prev => prev + 1)
          setMessage(`消息已更新 ${count + 1} 次`)
        }

        return (
          <div>
            <div role="status" aria-live="polite">
              {message}
            </div>
            <Button onClick={updateMessage}>更新消息</Button>
          </div>
        )
      }

      render(<DynamicContent />)

      const statusRegion = screen.getByRole('status')
      expect(statusRegion).toHaveTextContent('初始消息')

      const updateButton = screen.getByText('更新消息')
      fireEvent.click(updateButton)

      await waitFor(() => {
        expect(statusRegion).toHaveTextContent('消息已更新 1 次')
      })
    })

    it('应该提供适当的语义标记', () => {
      render(
        <main>
          <header>
            <h1>页面标题</h1>
            <nav aria-label="主导航">
              <Button>首页</Button>
              <Button>关于</Button>
            </nav>
          </header>
          <section aria-labelledby="section1-title">
            <h2 id="section1-title">章节标题</h2>
            <p>章节内容</p>
          </section>
          <footer>
            <p>页脚内容</p>
          </footer>
        </main>
      )

      expect(screen.getByRole('main')).toBeInTheDocument()
      expect(screen.getByRole('banner')).toBeInTheDocument()
      expect(screen.getByRole('navigation')).toBeInTheDocument()
      expect(screen.getByRole('contentinfo')).toBeInTheDocument()

      // 标题层级检查
      const headings = screen.getAllByRole('heading')
      expect(headings[0]).toHaveTextContent('页面标题')
      expect(headings[1]).toHaveTextContent('章节标题')
    })
  })

  // =============================================================================
  // 4. 颜色对比度测试
  // =============================================================================
  describe('颜色对比度测试', () => {
    it('所有主题下的文本对比度应该符合WCAG AA标准', () => {
      const themes = [
        { mode: 'light', base: 'neutral-cool-mid' },
        { mode: 'dark', base: 'neutral-true-mid' },
        { mode: 'hc', base: 'neutral-cool-high' }
      ]

      themes.forEach(theme => {
        const { container } = render(
          <ThemeProvider initialAxes={theme as any}>
            <div>
              <Button variant="primary">Primary Text</Button>
              <Button variant="secondary">Secondary Text</Button>
              <Card>Card Text</Card>
              <Alert variant="success">Success Text</Alert>
              <Badge variant="warning">Warning Text</Badge>
            </div>
          </ThemeProvider>
        )

        // 检查文本元素的对比度
        const textElements = container.querySelectorAll('button, p, span')
        textElements.forEach(element => {
          if (element.textContent && element.textContent.trim()) {
            const contrastResult = checkColorContrast(element as HTMLElement)
            expect(contrastResult.wcagAA).toBe(true)
          }
        })
      })
    })

    it('按钮在不同状态下的对比度应该达标', () => {
      const { container } = render(
        <ThemeProvider>
          <div>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button disabled>Disabled</Button>
          </div>
        </ThemeProvider>
      )

      const buttons = container.querySelectorAll('button')
      buttons.forEach(button => {
        const contrastResult = checkColorContrast(button as HTMLElement)
        expect(contrastResult.wcagAA).toBe(true)
      })
    })

    it('应该检测对比度问题并提供修复建议', () => {
      // 创建一个对比度不足的元素
      const { container } = render(
        <div style={{ color: '#cccccc', backgroundColor: '#eeeeee' }}>
          低对比度文本
        </div>
      )

      const lowContrastElement = container.querySelector('div')!
      const contrastResult = checkColorContrast(lowContrastElement)

      expect(contrastResult.wcagAA).toBe(false)
      expect(contrastResult.recommendation).toBe('增加颜色对比度')
      expect(contrastResult.ratio).toBeLessThan(4.5)
    })
  })

  // =============================================================================
  // 5. 焦点管理测试
  // =============================================================================
  describe('焦点管理测试', () => {
    it('应该有可见的焦点指示器', () => {
      render(
        <div>
          <Button>焦点测试按钮</Button>
          <Input placeholder="焦点测试输入框" />
        </div>
      )

      const button = screen.getByRole('button')
      const input = screen.getByRole('textbox')

      // 测试按钮焦点
      button.focus()
      const buttonStyles = window.getComputedStyle(button, ':focus')
      expect(buttonStyles.outline).not.toBe('none')

      // 测试输入框焦点
      input.focus()
      const inputStyles = window.getComputedStyle(input, ':focus')
      expect(inputStyles.outline).not.toBe('none')
    })

    it('跳过链接应该正常工作', () => {
      render(
        <div>
          <a href="#main" className="skip-link">
            跳到主要内容
          </a>
          <header>头部内容</header>
          <main id="main">
            <h1>主要内容</h1>
            <p>这是主要内容区域</p>
          </main>
        </div>
      )

      const skipLink = screen.getByText('跳到主要内容')
      expect(skipLink).toBeInTheDocument()
      expect(skipLink).toHaveAttribute('href', '#main')
    })

    it('焦点陷阱应该在模态框中正确工作', () => {
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <Modal.Content>
            <Input placeholder="模态框输入框1" />
            <Input placeholder="模态框输入框2" />
            <Button>模态框按钮</Button>
          </Modal.Content>
        </Modal>
      )

      // 创建模态框外的元素
      const outsideButton = document.createElement('button')
      outsideButton.textContent = '外部按钮'
      document.body.appendChild(outsideButton)

      const modalInputs = screen.getAllByRole('textbox')
      const modalButton = screen.getByRole('button', { name: '模态框按钮' })

      // 焦点应该在模态框内循环
      modalInputs[0].focus()
      expect(modalInputs[0]).toHaveFocus()

      fireEvent.tab()
      expect(modalInputs[1]).toHaveFocus()

      fireEvent.tab()
      expect(modalButton).toHaveFocus()

      fireEvent.tab()
      // 应该回到第一个输入框，而不是跳到外部按钮
      expect(modalInputs[0]).toHaveFocus()
      expect(outsideButton).not.toHaveFocus()

      // 清理
      document.body.removeChild(outsideButton)
    })
  })

  // =============================================================================
  // 6. 语义化HTML测试
  // =============================================================================
  describe('语义化HTML测试', () => {
    it('应该使用正确的语义标签', () => {
      render(
        <article>
          <header>
            <h1>文章标题</h1>
            <time dateTime="2023-01-01">2023年1月1日</time>
          </header>
          <section>
            <h2>章节标题</h2>
            <p>文章内容段落</p>
            <figure>
              <img src="/image.jpg" alt="图片描述" />
              <figcaption>图片说明</figcaption>
            </figure>
          </section>
          <footer>
            <p>文章作者</p>
          </footer>
        </article>
      )

      expect(screen.getByRole('article')).toBeInTheDocument()
      expect(screen.getByRole('banner')).toBeInTheDocument()
      expect(screen.getByRole('img')).toBeInTheDocument()
      expect(screen.getByRole('img')).toHaveAttribute('alt', '图片描述')
    })

    it('表单元素应该有正确的标签关联', () => {
      render(
        <form>
          <fieldset>
            <legend>个人信息</legend>
            <div>
              <label htmlFor="name">姓名</label>
              <Input id="name" />
            </div>
            <div>
              <label htmlFor="email">邮箱</label>
              <Input id="email" type="email" required />
            </div>
            <Button type="submit">提交</Button>
          </fieldset>
        </form>
      )

      expect(screen.getByLabelText('姓名')).toBeInTheDocument()
      expect(screen.getByLabelText('邮箱')).toBeInTheDocument()
      expect(screen.getByRole('group')).toBeInTheDocument()
      expect(screen.getByRole('group')).toHaveAttribute('aria-labelledby')
    })

    it('列表元素应该正确嵌套', () => {
      render(
        <nav aria-label="导航菜单">
          <ul>
            <li><a href="/">首页</a></li>
            <li>
              <span>产品</span>
              <ul>
                <li><a href="/product1">产品1</a></li>
                <li><a href="/product2">产品2</a></li>
              </ul>
            </li>
            <li><a href="/about">关于</a></li>
          </ul>
        </nav>
      )

      expect(screen.getByRole('list')).toBeInTheDocument()
      expect(screen.getAllByRole('listitem')).toHaveLength(5)
      expect(screen.getAllByRole('link')).toHaveLength(4)
    })
  })

  // =============================================================================
  // 7. 动态内容可访问性测试
  // =============================================================================
  describe('动态内容可访问性测试', () => {
    it('自动更新的内容应该有适当的ARIA属性', async () => {
      const AutoUpdater = () => {
        const [time, setTime] = React.useState(new Date().toLocaleTimeString())

        React.useEffect(() => {
          const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString())
          }, 1000)

          return () => clearInterval(timer)
        }, [])

        return (
          <div>
            <span aria-live="polite" aria-atomic="true">
              当前时间: {time}
            </span>
          </div>
        )
      }

      render(<AutoUpdater />)

      const timeDisplay = screen.getByText(/当前时间:/)
      expect(timeDisplay).toHaveAttribute('aria-live', 'polite')
      expect(timeDisplay).toHaveAttribute('aria-atomic', 'true')
    })

    it('进度条应该有可访问的描述', () => {
      const { container } = render(
        <div>
          <div role="progressbar" aria-valuenow={75} aria-valuemin={0} aria-valuemax={100} aria-label="下载进度">
            75%
          </div>
        </div>
      )

      const progressbar = container.querySelector('[role="progressbar"]')
      expect(progressbar).toBeInTheDocument()
      expect(progressbar).toHaveAttribute('aria-valuenow', '75')
      expect(progressbar).toHaveAttribute('aria-valuemin', '0')
      expect(progressbar).toHaveAttribute('aria-valuemax', '100')
      expect(progressbar).toHaveAttribute('aria-label', '下载进度')
    })

    it('工具提示应该可访问', async () => {
      render(
        <Tooltip content="这是提示内容">
          <Button>悬停显示提示</Button>
        </Tooltip>
      )

      const button = screen.getByText('悬停显示提示')

      // 键盘聚焦应该显示提示
      button.focus()

      await waitFor(() => {
        expect(screen.getByText('这是提示内容')).toBeInTheDocument()
      })
    })
  })

  // =============================================================================
  // 8. 可访问性评分系统
  // =============================================================================
  describe('可访问性评分系统', () => {
    it('应该为组件生成可访问性评分', async () => {
      const testComponents = [
        { name: 'Button', element: <Button>测试按钮</Button> },
        { name: 'Input', element: <Input placeholder="测试输入框" /> },
        { name: 'Card', element: <Card>测试卡片</Card> }
      ]

      const results: A11yTestResult[] = []

      for (const component of testComponents) {
        const { container } = render(component.element)
        const axeResults = await axe(container)

        const issues: A11yIssue[] = axeResults.violations.map(violation => ({
          type: 'error' as const,
          category: violation.impact || 'error',
          message: violation.description,
          element: violation.target[0] || '',
          recommendation: violation.help
        }))

        const score = Math.max(0, 100 - (issues.length * 10))

        results.push({
          component: component.name,
          wcagCompliant: issues.length === 0,
          issues,
          score
        })
      }

      // 验证评分系统
      results.forEach(result => {
        expect(result.component).toBeTruthy()
        expect(result.score).toBeGreaterThanOrEqual(0)
        expect(result.score).toBeLessThanOrEqual(100)
        expect(result.issues).toBeInstanceOf(Array)
      })

      // 计算总体评分
      const overallScore = results.reduce((sum, r) => sum + r.score, 0) / results.length
      expect(overallScore).toBeGreaterThanOrEqual(80) // 期望80%以上的可访问性评分
    })
  })
})