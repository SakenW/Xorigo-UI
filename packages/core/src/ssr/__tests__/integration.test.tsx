/**
 * SSR集成测试
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider, useTheme, ThemeToggle } from '../components/theme'
import { MotionProvider, SSRMotionDiv, SSRAnimatePresence } from '../components/motion'
import { Alert } from '../../feedback/Alert'
import { Loading } from '../../feedback/Loading'

// Mock环境
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  },
  writable: true
})

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

describe('SSR集成测试', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('完整组件集成', () => {
    it('应该渲染包含动画和主题的复杂组件', () => {
      const TestApp = () => {
        const { theme } = useTheme()
        const [visible, setVisible] = React.useState(true)

        return (
          <div data-testid="app" data-theme={theme}>
            <button onClick={() => setVisible(false)} data-testid="hide-alert">
              Hide Alert
            </button>

            <SSRAnimatePresence>
              {visible && (
                <Alert
                  message="Test Alert Message"
                  variant="info"
                  closable
                  onClose={() => setVisible(false)}
                  data-testid="alert"
                />
              )}
            </SSRAnimatePresence>

            <Loading text="Loading..." data-testid="loading" />
          </div>
        )
      }

      render(
        <ThemeProvider>
          <MotionProvider enableOnHydrate={false}>
            <TestApp />
          </MotionProvider>
        </ThemeProvider>
      )

      // 验证组件渲染
      expect(screen.getByTestId('app')).toBeInTheDocument()
      expect(screen.getByTestId('alert')).toBeInTheDocument()
      expect(screen.getByTestId('loading')).toBeInTheDocument()
      expect(screen.getByText('Test Alert Message')).toBeInTheDocument()
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('应该正确处理主题切换', () => {
      const TestApp = () => {
        const { theme, toggleTheme } = useTheme()

        return (
          <div data-testid="app" data-theme={theme}>
            <p data-testid="current-theme">Current theme: {theme}</p>
            <ThemeToggle data-testid="theme-toggle" />
            <button onClick={toggleTheme} data-testid="custom-toggle">
              Custom Toggle
            </button>
          </div>
        )
      }

      render(
        <ThemeProvider>
          <TestApp />
        </ThemeProvider>
      )

      expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: light')

      // 测试主题切换
      fireEvent.click(screen.getByTestId('custom-toggle'))
      expect(screen.getByTestId('current-theme')).toHaveTextContent('Current theme: dark')
    })

    it('应该处理Alert组件的关闭功能', () => {
      const TestApp = () => {
        const [visible, setVisible] = React.useState(true)

        return (
          <div>
            <Alert
              visible={visible}
              message="Closable Alert"
              variant="warning"
              closable
              onClose={() => setVisible(false)}
              data-testid="alert"
            />
            <p data-testid="alert-status">Alert visible: {visible.toString()}</p>
          </div>
        )
      }

      render(
        <ThemeProvider>
          <MotionProvider enableOnHydrate={false}>
            <TestApp />
          </MotionProvider>
        </ThemeProvider>
      )

      expect(screen.getByTestId('alert-status')).toHaveTextContent('Alert visible: true')
      expect(screen.getByText('Closable Alert')).toBeInTheDocument()

      // 点击关闭按钮
      const closeButton = screen.getByLabelText('关闭')
      fireEvent.click(closeButton)

      expect(screen.getByTestId('alert-status')).toHaveTextContent('Alert visible: false')
    })

    it('应该正确应用CSS变量', () => {
      const TestComponent = () => {
        const { themeVariables } = useTheme()

        return (
          <div
            data-testid="styled-div"
            style={{
              backgroundColor: themeVariables.colors['--bg-primary'],
              color: themeVariables.colors['--text-primary']
            }}
          >
            Styled content
          </div>
        )
      }

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )

      const styledDiv = screen.getByTestId('styled-div')
      expect(styledDiv).toHaveStyle({
        backgroundColor: '#ffffff',
        color: '#111827'
      })
    })
  })

  describe('服务端渲染模拟', () => {
    it('应该在无window环境下正常工作', () => {
      // 临时移除window对象
      const originalWindow = global.window
      delete (global as any).window

      expect(() => {
        render(
          <ThemeProvider>
            <MotionProvider enableOnHydrate={false}>
              <div>Test content</div>
            </MotionProvider>
          </ThemeProvider>
        )
      }).not.toThrow()

      // 恢复window对象
      global.window = originalWindow
    })

    it('应该生成正确的SSR标记', () => {
      const TestApp = () => {
        return (
          <div data-testid="ssr-app">
            <h1>SSR Test App</h1>
            <Alert message="SSR Alert" variant="success" data-testid="ssr-alert" />
            <Loading text="SSR Loading" data-testid="ssr-loading" />
          </div>
        )
      }

      render(
        <ThemeProvider>
          <MotionProvider enableOnHydrate={false}>
            <TestApp />
          </MotionProvider>
        </ThemeProvider>
      )

      expect(screen.getByTestId('ssr-app')).toBeInTheDocument()
      expect(screen.getByTestId('ssr-alert')).toBeInTheDocument()
      expect(screen.getByTestId('ssr-loading')).toBeInTheDocument()
      expect(screen.getByText('SSR Test App')).toBeInTheDocument()
      expect(screen.getByText('SSR Alert')).toBeInTheDocument()
      expect(screen.getByText('SSR Loading')).toBeInTheDocument()
    })
  })
})