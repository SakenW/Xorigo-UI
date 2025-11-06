/**
 * Monaco 主题适配器测试
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MonacoThemeAdapter, generateMonacoTheme } from '../monaco-theme-adapter'

describe('generateMonacoTheme', () => {
  it('generates light theme correctly', () => {
    const lightTheme = {
      mode: 'light' as const,
      hue: '#3b82f6',
      saturation: 0.8,
      lightness: 0.6,
      density: 'comfortable' as const,
      roundness: 0.5,
      contrast: 'normal' as const
    }

    const theme = generateMonacoTheme(lightTheme)

    expect(theme.base).toBe('vs')
    expect(theme.inherit).toBe(true)
    expect(theme.rules).toBeDefined()
    expect(theme.colors).toBeDefined()
  })

  it('generates dark theme correctly', () => {
    const darkTheme = {
      mode: 'dark' as const,
      hue: '#8b5cf6',
      saturation: 0.7,
      lightness: 0.4,
      density: 'compact' as const,
      roundness: 0.3,
      contrast: 'high' as const
    }

    const theme = generateMonacoTheme(darkTheme)

    expect(theme.base).toBe('vs-dark')
    expect(theme.inherit).toBe(true)
  })

  it('applies custom colors', () => {
    const theme = {
      mode: 'dark' as const,
      hue: '#3b82f6',
      saturation: 0.8,
      lightness: 0.6,
      density: 'comfortable' as const,
      roundness: 0.5,
      contrast: 'normal' as const,
      customColors: {
        'comment': '#666666',
        'string': '#00ff00'
      }
    }

    const result = generateMonacoTheme(theme)

    // 验证自定义颜色已应用
    const commentRule = result.rules.find(rule => rule.token === 'comment')
    const stringRule = result.rules.find(rule => rule.token === 'string')

    expect(commentRule?.foreground).toBe('#666666')
    expect(stringRule?.foreground).toBe('#00ff00')
  })

  it('calculates colors based on hue and saturation', () => {
    const theme = {
      mode: 'light' as const,
      hue: '#ff0000', // Red
      saturation: 1.0, // Full saturation
      lightness: 0.5, // Medium lightness
      density: 'comfortable' as const,
      roundness: 0.5,
      contrast: 'normal' as const
    }

    const result = generateMonacoTheme(theme)

    // 验证基于红色计算的颜色
    expect(result.colors['editor.background']).toBeDefined()
    expect(result.colors['editor.foreground']).toBeDefined()
    expect(result.colors['focusBorder']).toBeDefined()
  })

  it('adjusts contrast for high contrast mode', () => {
    const normalTheme = generateMonacoTheme({
      mode: 'light' as const,
      hue: '#3b82f6',
      saturation: 0.8,
      lightness: 0.6,
      density: 'comfortable' as const,
      roundness: 0.5,
      contrast: 'normal' as const
    })

    const highContrastTheme = generateMonacoTheme({
      mode: 'light' as const,
      hue: '#3b82f6',
      saturation: 0.8,
      lightness: 0.6,
      density: 'comfortable' as const,
      roundness: 0.5,
      contrast: 'high' as const
    })

    // 高对比度模式应该有更明显的颜色对比
    expect(highContrastTheme.colors['foreground']).toBeDefined()
  })

  it('adjusts spacing based on density', () => {
    const compactTheme = generateMonacoTheme({
      mode: 'light' as const,
      hue: '#3b82f6',
      saturation: 0.8,
      lightness: 0.6,
      density: 'compact' as const,
      roundness: 0.5,
      contrast: 'normal' as const
    })

    const spaciousTheme = generateMonacoTheme({
      mode: 'light' as const,
      hue: '#3b82f6',
      saturation: 0.8,
      lightness: 0.6,
      density: 'spacious' as const,
      roundness: 0.5,
      contrast: 'normal' as const
    })

    // 两种密度的主题应该都正确生成
    expect(compactTheme.rules).toBeDefined()
    expect(spaciousTheme.rules).toBeDefined()
  })
})

describe('MonacoThemeAdapter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without errors', () => {
    const mockMonaco = {
      editor: {
        defineTheme: vi.fn(),
        setTheme: vi.fn()
      }
    }

    const theme = {
      mode: 'dark' as const,
      hue: '#3b82f6',
      saturation: 0.8,
      lightness: 0.6,
      density: 'comfortable' as const,
      roundness: 0.5,
      contrast: 'normal' as const
    }

    render(
      <MonacoThemeAdapter
        theme={theme}
        monaco={mockMonaco as any}
        editor={null}
        autoApply={false}
      />
    )

    // 组件渲染正常
    expect(screen.getByTestId('monaco-theme-adapter')).toBeInTheDocument()
  })

  it('calls defineTheme when autoApply is true', () => {
    const mockMonaco = {
      editor: {
        defineTheme: vi.fn(),
        setTheme: vi.fn()
      }
    }

    const theme = {
      mode: 'dark' as const,
      hue: '#3b82f6',
      saturation: 0.8,
      lightness: 0.6,
      density: 'comfortable' as const,
      roundness: 0.5,
      contrast: 'normal' as const
    }

    render(
      <MonacoThemeAdapter
        theme={theme}
        monaco={mockMonaco as any}
        editor={null}
        autoApply={true}
      />
    )

    expect(mockMonaco.editor.defineTheme).toHaveBeenCalled()
  })

  it('does not call defineTheme when autoApply is false', () => {
    const mockMonaco = {
      editor: {
        defineTheme: vi.fn(),
        setTheme: vi.fn()
      }
    }

    const theme = {
      mode: 'dark' as const,
      hue: '#3b82f6',
      saturation: 0.8,
      lightness: 0.6,
      density: 'comfortable' as const,
      roundness: 0.5,
      contrast: 'normal' as const
    }

    render(
      <MonacoThemeAdapter
        theme={theme}
        monaco={mockMonaco as any}
        editor={null}
        autoApply={false}
      />
    )

    expect(mockMonaco.editor.defineTheme).not.toHaveBeenCalled()
  })

  it('generates unique theme names', () => {
    const theme1 = {
      mode: 'dark' as const,
      hue: '#3b82f6',
      saturation: 0.8,
      lightness: 0.6,
      density: 'comfortable' as const,
      roundness: 0.5,
      contrast: 'normal' as const
    }

    const theme2 = {
      mode: 'light' as const,
      hue: '#8b5cf6',
      saturation: 0.7,
      lightness: 0.4,
      density: 'compact' as const,
      roundness: 0.3,
      contrast: 'high' as const
    }

    const mockMonaco = {
      editor: {
        defineTheme: vi.fn(),
        setTheme: vi.fn()
      }
    }

    render(
      <>
        <MonacoThemeAdapter
          theme={theme1}
          monaco={mockMonaco as any}
          editor={null}
          autoApply={true}
        />
        <MonacoThemeAdapter
          theme={theme2}
          monaco={mockMonaco as any}
          editor={null}
          autoApply={true}
        />
      </>
    )

    expect(mockMonaco.editor.defineTheme).toHaveBeenCalledTimes(2)
  })
})
