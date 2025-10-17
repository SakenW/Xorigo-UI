/**
 * SSR主题工具测试
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  defaultThemeVariables,
  darkThemeVariables,
  mergeThemeVariables,
  generateCSSVariables,
  generateThemeCSS,
  getThemeVariable,
  generateInlineThemeStyles,
  generateThemeMetaTags,
  preloadThemeCSS
} from '../utils/ssr-theme'
import { ThemeProvider, useTheme } from '../components/theme'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}

// Mock matchMedia
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

describe('SSR主题工具', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    })
  })

  describe('主题变量管理', () => {
    it('应该提供默认主题变量', () => {
      expect(defaultThemeVariables).toBeDefined()
      expect(defaultThemeVariables.colors).toBeDefined()
      expect(defaultThemeVariables.spacing).toBeDefined()
      expect(defaultThemeVariables.typography).toBeDefined()
    })

    it('应该提供深色主题变量', () => {
      expect(darkThemeVariables).toBeDefined()
      expect(darkThemeVariables.colors).toBeDefined()
    })

    it('应该正确合并主题变量', () => {
      const customTheme = {
        colors: {
          '--color-primary': '#custom-color'
        }
      }

      const merged = mergeThemeVariables(defaultThemeVariables, customTheme)
      expect(merged.colors['--color-primary']).toBe('#custom-color')
      expect(merged.colors['--color-primary-500']).toBe('#3b82f6') // 保留默认值
    })
  })

  describe('CSS生成', () => {
    it('应该生成正确的CSS变量字符串', () => {
      const variables = {
        colors: {
          '--color-primary': '#blue',
          '--color-secondary': '#red'
        }
      }

      const css = generateCSSVariables(variables)
      expect(css).toContain('--color-primary: #blue')
      expect(css).toContain('--color-secondary: #red')
    })

    it('应该生成完整的主题CSS', () => {
      const css = generateThemeCSS(defaultThemeVariables)
      expect(css).toContain(':root {')
      expect(css).toContain('--color-primary-500:')
      expect(css).toContain('}')
    })
  })

  describe('主题变量获取', () => {
    it('在服务端环境应返回默认值', () => {
      const value = getThemeVariable('--color-primary-500')
      expect(value).toBe('#3b82f6')
    })

    it('未找到变量应返回null', () => {
      const value = getThemeVariable('--non-existent-variable')
      expect(value).toBeNull()
    })
  })

  describe('内联样式生成', () => {
    it('应该生成正确的内联样式', () => {
      const styles = generateInlineThemeStyles('light')
      expect(styles).toContain(':root {')
      expect(styles).toContain('--bg-primary: #ffffff')
    })

    it('应该生成深色主题样式', () => {
      const styles = generateInlineThemeStyles('dark')
      expect(styles).toContain('--bg-primary: #111827')
    })
  })

  describe('Meta标签生成', () => {
    it('应该生成主题色meta标签', () => {
      const metaTags = generateThemeMetaTags(defaultThemeVariables)
      expect(metaTags).toContain('<meta name="theme-color" content="#3b82f6">')
      expect(metaTags).toContain('<meta name="color-scheme" content="light dark">')
    })
  })

  describe('CSS预加载', () => {
    it('应该生成预加载CSS标签', () => {
      const css = preloadThemeCSS('light')
      expect(css).toContain('<style data-theme="light">')
      expect(css).toContain('--bg-primary: #ffffff')
      expect(css).toContain('</style>')
    })
  })

  describe('ThemeProvider组件', () => {
    it('应该渲染ThemeProvider', () => {
      const TestComponent = () => {
        const { theme } = useTheme()
        return <div data-theme={theme}>Current theme: {theme}</div>
      }

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )

      expect(screen.getByText('Current theme: light')).toBeInTheDocument()
    })
  })
})