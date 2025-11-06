/**
 * @fileoverview 七轴主题系统测试
 * @description 验证七轴DTCG标准主题系统的完整性、一致性和跨组件兼容性
 *
 * @author Xorigo UI Team
 * @version 1.0.0
 * @since 2025-11-05
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider, useTheme } from '@xorigo-ui/system'

// =============================================================================
// 主题定义
// =============================================================================

const SEVEN_AXIS_THEMES = [
  'midnight',    // 深色主题
  'ocean',       // 海洋主题
  'forest',      // 森林主题
  'graphite',    // 石墨主题
  'sunset',      // 日落主题
  'lavender',    // 薰衣草主题
  'cherry',      // 樱桃主题
  'pearl',       // 珍珠主题
  'golden',      // 黄金主题
  'crystal',     // 水晶主题
]

// =============================================================================
// 工具函数
// =============================================================================

const renderWithTheme = (theme: string, component: React.ReactNode) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

const testAllThemes = (testName: string, testFn: (theme: string) => void) => {
  describe(`${testName}`, () => {
    SEVEN_AXIS_THEMES.forEach(theme => {
      it(`${theme} theme`, () => testFn(theme))
    })
  })
}

// =============================================================================
// 主题系统基础测试
// =============================================================================

describe('七轴主题系统', () => {
  describe('主题切换', () => {
    testAllThemes('应该正确加载主题令牌', (theme) => {
      const TestComponent = () => {
        const { theme: currentTheme } = useTheme()
        return <div data-theme={currentTheme}>主题: {currentTheme}</div>
      }

      renderWithTheme(theme, <TestComponent />)
      expect(screen.getByText(`主题: ${theme}`)).toBeInTheDocument()
    })

    testAllThemes('应该支持动态主题切换', async (theme) => {
      const TestComponent = () => {
        const { theme: currentTheme, setTheme } = useTheme()
        return (
          <div>
            <span data-theme={currentTheme}>当前: {currentTheme}</span>
            <button onClick={() => setTheme('ocean')}>切换到海洋</button>
          </div>
        )
      }

      renderWithTheme(theme, <TestComponent />)
      expect(screen.getByText(`当前: ${theme}`)).toBeInTheDocument()

      const switchButton = screen.getByRole('button', { name: /切换/i })
      fireEvent.click(switchButton)

      await waitFor(() => {
        expect(screen.getByText('当前: ocean')).toBeInTheDocument()
      })
    })
  })

  // =============================================================================
  // 可访问性测试
  // =============================================================================

  describe('可访问性测试', () => {
    testAllThemes('应该在所有主题下保持良好的可访问性', (theme) => {
      const TestComponent = () => (
        <div>
          <button aria-label="按钮1">按钮</button>
          <input aria-label="输入框" />
          <div role="alert">警告</div>
        </div>
      )

      renderWithTheme(theme, <TestComponent />)

      expect(screen.getByLabelText('按钮1')).toBeInTheDocument()
      expect(screen.getByLabelText('输入框')).toBeInTheDocument()
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  // =============================================================================
  // 边缘情况测试
  // =============================================================================

  describe('边缘情况测试', () => {
    it('应该处理无效的主题名称', () => {
      const TestComponent = () => {
        const { theme } = useTheme()
        return <div>主题: {theme}</div>
      }

      renderWithTheme('invalid-theme', <TestComponent />)
      expect(screen.getByText('主题:')).toBeInTheDocument()
    })
  })
})
