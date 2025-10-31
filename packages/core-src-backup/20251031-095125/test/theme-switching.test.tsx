/**
 * 主题切换自动化测试
 *
 * 测试所有组件在不同主题下的表现和兼容性
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { ThemeProvider, useTheme } from '../../system/theme-provider'
import { generateThemeTokens } from '../../system/theme-axis-controller'

// 导入需要测试的组件
import { Button } from '../../primitives/button/button'
import { Badge } from '../../feedback/badge/badge'
import { Card } from '../../data-display/card/card'
import { Alert } from '../../feedback/alert/alert'
import { Toast } from '../../feedback/toast/toast'
import { Tooltip } from '../../feedback/tooltip/tooltip'
import { Navbar } from '../../navigation/navbar/navbar'

// 定义测试主题配置
const testThemes = [
  {
    name: 'Light Mode',
    axes: {
      mode: 'light' as const,
      base: 'neutral-cool-mid' as const,
      accent: 'mono(blue)' as const,
      tone: 'standard' as const,
      density: 'comfortable' as const,
      motion: 'standard.classic' as const,
      surface: 'flat' as const,
    }
  },
  {
    name: 'Dark Mode',
    axes: {
      mode: 'dark' as const,
      base: 'neutral-true-mid' as const,
      accent: 'mono(cyan)' as const,
      tone: 'standard' as const,
      density: 'comfortable' as const,
      motion: 'standard.classic' as const,
      surface: 'soft-shadow' as const,
    }
  },
  {
    name: 'High Contrast',
    axes: {
      mode: 'hc' as const,
      base: 'neutral-cool-high' as const,
      accent: 'mono(yellow)' as const,
      tone: 'standard' as const,
      density: 'spacious' as const,
      motion: 'subtle.classic' as const,
      surface: 'flat' as const,
    }
  },
  {
    name: 'Creative Theme',
    axes: {
      mode: 'light' as const,
      base: 'neutral-warm-mid' as const,
      accent: 'analog(purple)' as const,
      tone: 'vivid' as const,
      density: 'compact' as const,
      motion: 'expressive.spring' as const,
      surface: 'glass+neon' as const,
    }
  },
]

// 测试包装器组件
const TestWrapper: React.FC<{ children: React.ReactNode; themeAxes: any }> = ({ children, themeAxes }) => {
  const [theme, setTheme] = React.useState(() => generateThemeTokens(themeAxes))

  const updateTheme = React.useCallback((axesUpdate: any) => {
    const newTheme = generateThemeAxesUpdate(theme.axes, axesUpdate)
    setTheme(newTheme)
  }, [theme])

  return (
    <ThemeProvider initialAxes={themeAxes}>
      <div data-testid="theme-provider">
        <div data-testid="current-theme" data-theme={theme.name}>
          {children}
        </div>
      </div>
    </ThemeProvider>
  )
}

// 主题更新辅助函数
function generateThemeAxesUpdate(currentAxes: any, update: any): any {
  return generateThemeTokens({ ...currentAxes, ...update })
}

describe('主题切换自动化测试', () => {
  let originalWarn: Console['warn']
  let originalError: Console['error']

  beforeEach(() => {
    // 保存原始 console 方法
    originalWarn = console.warn
    originalError = console.error

    // 重定向 console 输出以避免测试时的噪音
    console.warn = vi.fn()
    console.error = vi.fn()
  })

  afterEach(() => {
    // 恢复原始 console 方法
    console.warn = originalWarn
    console.error = originalError
  })

  describe('Button 组件主题切换测试', () => {
    testThemes.forEach((themeConfig) => {
      it(`应该在 ${themeConfig.name} 主题下正确渲染`, () => {
        render(
          <TestWrapper themeAxes={themeConfig.axes}>
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="destructive">Destructive Button</Button>
          </TestWrapper>
        )

        // 验证按钮存在
        expect(screen.getByText('Primary Button')).toBeInTheDocument()
        expect(screen.getByText('Secondary Button')).toBeInTheDocument()
        expect(screen.getByText('Destructive Button')).toBeInTheDocument()

        // 验证主题已正确应用
        const themeElement = screen.getByTestId('current-theme')
        expect(themeElement).toHaveAttribute('data-theme', themeConfig.name)
      })

      it(`应该在 ${themeConfig.name} 主题下正确应用主题令牌`, () => {
        render(
          <TestWrapper themeAxes={themeConfig.axes}>
            <Button variant="primary">Test Button</Button>
          </TestWrapper>
        )

        const button = screen.getByText('Test Button')

        // 验证按钮有主题相关的类
        expect(button).toHaveClass('bg-[var(--xor-primary)]')
        expect(button).toHaveClass('text-[var(--xor-text-on-primary)]')
      })
    })
  })

  describe('Badge 组件主题切换测试', () => {
    testThemes.forEach((themeConfig) => {
      it(`Badge 在 ${themeConfig.name} 主题下应该正确显示变体`, () => {
        render(
          <TestWrapper themeAxes={themeConfig.axes}>
            <Badge variant="success">Success Badge</Badge>
            <Badge variant="warning">Warning Badge</Badge>
            <Badge variant="error">Error Badge</Badge>
          </TestWrapper>
        )

        // 验证徽章存在且使用了主题令牌
        expect(screen.getByText('Success Badge')).toHaveClass('bg-[var(--xor-success)]')
        expect(screen.getByText('Warning Badge')).toHaveClass('bg-[var(--xor-warning)]')
        expect(screen.getByText('Error Badge')).toHaveClass('bg-[var(--xor-error)]')
      })
    })
  })

  describe('Card 组件主题切换测试', () => {
    testThemes.forEach((themeConfig) => {
      it(`Card 在 ${themeConfig.name} 主题下应该正确应用背景色`, () => {
        render(
          <TestWrapper themeAxes={themeConfig.axes}>
            <Card>
              <h2>Card Title</h2>
              <p>Card content</p>
            </Card>
          </TestWrapper>
        )

        const card = screen.getByRole('article')
        expect(card).toBeInTheDocument()
        expect(card).toHaveClass('bg-[var(--xor-bg-primary)]')
      })
    })
  })

  describe('Alert 组件主题切换测试', () => {
    testThemes.forEach((themeConfig) => {
      it(`Alert 在 ${themeConfig.name} 主题下应该正确显示不同类型`, () => {
        render(
          <TestWrapper themeAxes={themeConfig.axes}>
            <Alert variant="success">Success Alert</Alert>
            <Alert variant="warning">Warning Alert</Alert>
            <Alert variant="error">Error Alert</Alert>
          </TestWrapper>
        )

        expect(screen.getByText('Success Alert')).toHaveClass('bg-[var(--xor-success)]')
        expect(screen.getByText('Warning Alert')).toHaveClass('bg-[var(--xor-warning)]')
        expect(screen.getByText('Error Alert')).toHaveClass('bg-[var(--xor-error)]')
      })
    })
  })

  describe('Toast 组件主题切换测试', () => {
    testThemes.forEach((themeConfig) => {
      it(`Toast 在 ${themeConfig.name} 主题下应该正确显示`, () => {
        render(
          <TestWrapper themeAxes={themeConfig.axes}>
            <Toast variant="success" closable={false}>
              Success message
            </Toast>
            <Toast variant="error" closable={false}>
              Error message
            </Toast>
          </TestWrapper>
        )

        // Toast 使用绝对定位，需要通过样式检查
        expect(screen.getByText('Success message')).toBeInTheDocument()
        expect(screen.getByText('Error message')).toBeInTheDocument()
      })
    })
  })

  describe('主题切换动态性测试', () => {
    it('应该能够动态切换主题', () => {
      const DynamicThemeTest = () => {
        const { updateTheme } = useTheme()
        const [currentThemeIndex, setCurrentThemeIndex] = React.useState(0)

        const switchTheme = () => {
          const nextIndex = (currentThemeIndex + 1) % testThemes.length
          const nextTheme = testThemes[nextIndex]
          updateTheme(nextTheme.axes)
          setCurrentThemeIndex(nextIndex)
        }

        return (
          <div>
            <Button onClick={switchTheme}>
              Switch Theme (Current: {testThemes[currentThemeIndex].name})
            </Button>
            <div data-testid="theme-display">
              <span data-testid="theme-name">{testThemes[currentThemeIndex].name}</span>
            </div>
            <Button variant="primary">Test Button</Button>
          </div>
        )
      }

      render(
        <ThemeProvider>
          <DynamicThemeTest />
        </ThemeProvider>
      )

      // 验证初始主题
      expect(screen.getByTestId('theme-name')).toHaveTextContent('Light Mode')

      // 切换主题并验证
      const switchButton = screen.getByText(/Switch Theme/)
      fireEvent.click(switchButton)

      expect(screen.getByTestId('theme-name')).toHaveTextContent('Dark Mode')
    })
  })

  describe('主题约束系统测试', () => {
    it('高对比模式下应该自动降级动效', () => {
      const hcTheme = {
        mode: 'hc' as const,
        base: 'neutral-cool-high' as const,
        accent: 'mono(expressive)' as const,
        tone: 'vivid' as const,
        density: 'compact' as const,
        motion: 'expressive.spring' as const, // 这应该被自动降级
        surface: 'glass' as const, // 这应该被自动降级为 flat
      }

      render(
        <TestWrapper themeAxes={hcTheme}>
          <Button>Test Button</Button>
        </TestWrapper>
      )

      // 验证约束系统警告被触发
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('高对比模式：动效已降级至 subtle.classic')
      )
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('高对比模式：表面已切换至 flat')
      )
    })

    it('vivid + neon 组合应该自动降低饱和度', () => {
      const vividNeonTheme = {
        mode: 'light' as const,
        base: 'neutral-cool-mid' as const,
        accent: 'mono(blue)' as const,
        tone: 'vivid' as const,
        density: 'comfortable' as const,
        motion: 'standard.classic' as const,
        surface: 'neon' as const,
      }

      render(
        <TestWrapper themeAxes={vividNeonTheme}>
          <Button>Test Button</Button>
        </TestWrapper>
      )

      // 验证饱和度调整警告
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('vivid + neon 组合：已自动降低饱和度')
      )
    })
  })

  describe('CSS 变量注入测试', () => {
    it('应该正确注入 CSS 变量到 DOM', () => {
      render(
        <TestWrapper themeAxes={testThemes[0].axes}>
          <Button>Test Button</Button>
        </TestWrapper>
      )

      // 验证 CSS 变量被注入到根元素
      const root = document.documentElement
      expect(root.style.getPropertyValue('--xor-bg-primary')).toBeTruthy()
      expect(root.style.getPropertyValue('--xor-text-primary')).toBeTruthy()
      expect(root.style.getPropertyValue('--xor-primary')).toBeTruthy()
    })

    it('主题切换时应该更新 CSS 变量', () => {
      const { rerender } = render(
        <TestWrapper themeAxes={testThemes[0].axes}>
          <Button>Test Button</Button>
        </TestWrapper>
      )

      // 记录初始变量值
      const root = document.documentElement
      const initialBgColor = root.style.getPropertyValue('--xor-bg-primary')

      // 切换到暗色主题
      rerender(
        <TestWrapper themeAxes={testThemes[1].axes}>
          <Button>Test Button</Button>
        </TestWrapper>
      )

      // 验证变量已更新
      expect(root.style.getPropertyValue('--xor-bg-primary')).not.toBe(initialBgColor)
    })
  })
})