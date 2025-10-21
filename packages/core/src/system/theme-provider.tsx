/**
 * Xorigo UI 主题 Provider - 基于 v1.4 SSOT 的完整实现
 *
 * 职责：
 * 1. 将主题令牌注入到 CSS 变量
 * 2. 提供主题上下文
 * 3. 支持动态主题切换
 * 4. 集成智能约束系统
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { ThemeRecipe, ThemeAxes } from './theme-axis-controller'
import { generateThemeTokens } from './theme-axis-controller'

// === 主题上下文 ===
interface ThemeContextValue {
  theme: ThemeRecipe
  updateTheme: (axes: Partial<ThemeAxes>) => void
  resetTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

// === 默认主题配置 ===
const DEFAULT_AXES: ThemeAxes = {
  mode: 'light',
  base: 'neutral-cool-mid',
  accent: 'mono(blue)',
  tone: 'standard',
  density: 'comfortable',
  motion: 'standard.classic',
  surface: 'flat'
}

// === 主题 Provider 组件 ===
export interface ThemeProviderProps {
  /** 初始主题轴配置，如果不提供则使用默认配置 */
  initialAxes?: Partial<ThemeAxes>
  /** 是否启用开发模式警告 */
  enableWarnings?: boolean
  /** 主题切换回调 */
  onThemeChange?: (theme: ThemeRecipe) => void
  /** 子组件 */
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  initialAxes = {},
  enableWarnings = true,
  onThemeChange,
  children
}) => {
  const [theme, setTheme] = useState<ThemeRecipe>(() => {
    const axes = { ...DEFAULT_AXES, ...initialAxes }
    return generateThemeTokens(axes)
  })

  // 应用主题到 DOM
  const applyThemeToDOM = useCallback((theme: ThemeRecipe) => {
    const root = document.documentElement

    // 应用 CSS 变量
    Object.entries(theme.tokens).forEach(([key, value]) => {
      // 确保变量名以 --xor- 开头
      const varName = key.startsWith('--xor-') ? key : `--xor-${key}`
      root.style.setProperty(varName, String(value))
    })

    // 设置数据属性用于 CSS 选择器
    root.dataset.xorMode = theme.axes.mode
    root.dataset.xorDensity = theme.axes.density
    root.dataset.xorSurface = theme.axes.surface
    root.dataset.xorMotion = theme.axes.motion
    root.dataset.xorTone = theme.axes.tone

    // 设置主题 ID 用于调试
    root.dataset.xorThemeId = theme.id
  }, [])

  // 主题更新处理
  useEffect(() => {
    applyThemeToDOM(theme)
    onThemeChange?.(theme)
  }, [theme, applyThemeToDOM, onThemeChange])

  // 动态更新主题
  const updateTheme = useCallback((axesUpdate: Partial<ThemeAxes>) => {
    setTheme(currentTheme => {
      const newAxes = { ...currentTheme.axes, ...axesUpdate }
      const newTheme = generateThemeTokens(newAxes)

      if (enableWarnings) {
        // 开发模式下输出主题变更信息
        console.group('🎨 主题更新')
        console.log('旧主题:', currentTheme.axes)
        console.log('新主题:', newAxes)
        console.log('生成主题:', newTheme)
        console.groupEnd()
      }

      return newTheme
    })
  }, [enableWarnings])

  // 重置主题到默认配置
  const resetTheme = useCallback(() => {
    const defaultTheme = generateThemeTokens(DEFAULT_AXES)
    setTheme(defaultTheme)

    if (enableWarnings) {
      console.log('🔄 主题已重置为默认配置')
    }
  }, [enableWarnings])

  const contextValue: ThemeContextValue = {
    theme,
    updateTheme,
    resetTheme
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

// === 主题 Hook ===
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}

// === 便捷 Hook ===
export function useThemeAxes(): ThemeAxes {
  const { theme } = useTheme()
  return theme.axes
}

export function useThemeTokens(): Record<string, string | number> {
  const { theme } = useTheme()
  return theme.tokens
}

// === 主题切换工具 Hook ===
export function useThemeToggle() {
  const { theme, updateTheme } = useTheme()

  const toggleMode = useCallback(() => {
    const newMode: ThemeAxes['mode'] = theme.axes.mode === 'light' ? 'dark' : 'light'
    updateTheme({ mode: newMode })
  }, [theme.axes.mode, updateTheme])

  const setDensity = useCallback((density: ThemeAxes['density']) => {
    updateTheme({ density })
  }, [updateTheme])

  const setSurface = useCallback((surface: ThemeAxes['surface']) => {
    updateTheme({ surface })
  }, [updateTheme])

  const setMotion = useCallback((motion: ThemeAxes['motion']) => {
    updateTheme({ motion })
  }, [updateTheme])

  return {
    toggleMode,
    setDensity,
    setSurface,
    setMotion,
    updateTheme
  }
}

// === 开发工具 ===
export function useThemeDevTools() {
  const { theme, updateTheme } = useTheme()

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  // 开发环境下暴露到 window 对象，便于调试
  useEffect(() => {
    (window as any).__XORIGOO_THEME_DEVTOOLS__ = {
      getCurrentTheme: () => theme,
      updateTheme,
      generateTheme: generateThemeTokens,
      DEFAULT_AXES
    }

    return () => {
      delete (window as any).__XORIGOO_THEME_DEVTOOLS__
    }
  }, [theme, updateTheme])

  return {
    exportTheme: () => JSON.stringify(theme, null, 2),
    importTheme: (jsonString: string) => {
      try {
        const imported = JSON.parse(jsonString) as ThemeRecipe
        updateTheme(imported.axes)
        return true
      } catch (error) {
        console.error('导入主题失败:', error)
        return false
      }
    }
  }
}
