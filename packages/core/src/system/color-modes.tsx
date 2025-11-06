'use client'
/**
 * 🎭 颜色模式系统 - v2025.11.03
 *
 * 浅色/深色/高对比模式支持
 * 自动模式切换、主题偏好检测
 *
 * @version 2025.11.03
 * @category System
 * @layer system
 */

import React, { createContext, useContext, useEffect, useState } from 'react'

/**
 * 颜色模式类型
 */
export type ColorMode = 'light' | 'dark' | 'auto'

/**
 * 高对比度模式类型
 */
export type ContrastMode = 'normal' | 'high' | 'maximum'

/**
 * 颜色模式配置接口
 */
export interface ColorModeConfig {
  mode: ColorMode
  contrast: ContrastMode
  respectSystemPreference: boolean
  enableTransitions: boolean
}

/**
 * 颜色模式上下文接口
 */
export interface ColorModeContextValue {
  config: ColorModeConfig
  setMode: (mode: ColorMode) => void
  setContrast: (contrast: ContrastMode) => void
  toggleMode: () => void
  actualMode: 'light' | 'dark'
  systemMode: 'light' | 'dark'
  isHighContrast: boolean
  isDarkMode: boolean
  isLightMode: boolean
}

/**
 * 默认配置
 */
export const defaultColorModeConfig: ColorModeConfig = {
  mode: 'light',
  contrast: 'normal',
  respectSystemPreference: true,
  enableTransitions: true
}

/**
 * 颜色模式上下文
 */
export const ColorModeContext = createContext<ColorModeContextValue | undefined>(undefined)

/**
 * 颜色模式提供者组件
 */
export function ColorModeProvider({
  children,
  defaultConfig = defaultColorModeConfig,
  storageKey = 'xorigo-ui-color-mode'
}: {
  children: React.ReactNode
  defaultConfig?: ColorModeConfig
  storageKey?: string
}) {
  const [config, setConfig] = useState<ColorModeConfig>(defaultConfig)
  const [systemMode, setSystemMode] = useState<'light' | 'dark'>('light')
  const [isHighContrast, setIsHighContrast] = useState(false)

  // 监听系统颜色模式变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setSystemMode(mediaQuery.matches ? 'dark' : 'light')

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemMode(e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // 监听高对比度偏好
  useEffect(() => {
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)')
    const moreContrastQuery = window.matchMedia('(prefers-contrast: more)')

    const updateContrast = () => {
      const hasHighContrast = highContrastQuery.matches || moreContrastQuery.matches
      setIsHighContrast(hasHighContrast)
    }

    updateContrast()

    highContrastQuery.addEventListener('change', updateContrast)
    moreContrastQuery.addEventListener('change', updateContrast)

    return () => {
      highContrastQuery.removeEventListener('change', updateContrast)
      moreContrastQuery.removeEventListener('change', updateContrast)
    }
  }, [])

  // 从本地存储加载配置
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const parsedConfig = JSON.parse(stored)
        setConfig({ ...defaultConfig, ...parsedConfig })
      }
    } catch (error) {
      console.warn('Failed to load color mode config from localStorage:', error)
    }
  }, [storageKey, defaultConfig])

  // 保存配置到本地存储
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(config))
    } catch (error) {
      console.warn('Failed to save color mode config to localStorage:', error)
    }
  }, [config, storageKey])

  // 计算实际颜色模式
  const actualMode: 'light' | 'dark' = config.mode === 'auto' ? systemMode : config.mode

  // 应用颜色模式到 DOM
  useEffect(() => {
    const root = document.documentElement

    // 设置数据属性
    root.setAttribute('data-color-mode', config.mode)
    root.setAttribute('data-actual-color-mode', actualMode)
    root.setAttribute('data-contrast-mode', config.contrast)
    root.setAttribute('data-system-color-mode', systemMode)
    root.setAttribute('data-high-contrast', isHighContrast.toString())

    // 设置 CSS 类名
    root.classList.remove('light', 'dark', 'high-contrast', 'maximum-contrast')
    root.classList.add(actualMode)

    if (isHighContrast || config.contrast !== 'normal') {
      const contrastClass = config.contrast === 'maximum' ? 'maximum-contrast' : 'high-contrast'
      root.classList.add(contrastClass)
    }

    // 设置 CSS 变量
    const cssVariables = generateColorModeCSSVariables(config, actualMode, isHighContrast)
    Object.entries(cssVariables).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })

    // 处理过渡动画
    if (config.enableTransitions) {
      root.style.setProperty('--color-mode-transition', 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease')
    } else {
      root.style.setProperty('--color-mode-transition', 'none')
    }

  }, [config, actualMode, systemMode, isHighContrast])

  const setMode = (mode: ColorMode) => {
    setConfig(prev => ({ ...prev, mode }))
  }

  const setContrast = (contrast: ContrastMode) => {
    setConfig(prev => ({ ...prev, contrast }))
  }

  const toggleMode = () => {
    setMode(actualMode === 'light' ? 'dark' : 'light')
  }

  const value: ColorModeContextValue = {
    config,
    setMode,
    setContrast,
    toggleMode,
    actualMode,
    systemMode,
    isHighContrast: isHighContrast || config.contrast !== 'normal',
    isDarkMode: actualMode === 'dark',
    isLightMode: actualMode === 'light'
  }

  return (
    <ColorModeContext.Provider value={value}>
      {children}
    </ColorModeContext.Provider>
  )
}

/**
 * 使用颜色模式的 Hook
 */
export function useColorMode(): ColorModeContextValue {
  const context = useContext(ColorModeContext)
  if (!context) {
    throw new Error('useColorMode must be used within a ColorModeProvider')
  }
  return context
}

/**
 * 生成颜色模式 CSS 变量
 */
function generateColorModeCSSVariables(
  config: ColorModeConfig,
  actualMode: 'light' | 'dark',
  systemHighContrast: boolean
): Record<string, string> {
  const variables: Record<string, string> = {}

  // 基础颜色模式变量
  variables['--color-mode'] = config.mode
  variables['--actual-color-mode'] = actualMode
  variables['--contrast-mode'] = config.contrast

  // 根据颜色模式和对比度设置颜色值
  if (actualMode === 'dark') {
    // 深色模式颜色
    variables['--color-background'] = 'hsl(220, 40%, 8%)'
    variables['--color-foreground'] = 'hsl(220, 40%, 95%)'
    variables['--color-muted'] = 'hsl(220, 40%, 15%)'
    variables['--color-muted-foreground'] = 'hsl(220, 40%, 75%)'
    variables['--color-border'] = 'hsl(220, 40%, 20%)'
    variables['--color-input'] = 'hsl(220, 40%, 12%)'
    variables['--color-ring'] = 'hsl(220, 70%, 60%)'
  } else {
    // 浅色模式颜色
    variables['--color-background'] = 'hsl(0, 0%, 100%)'
    variables['--color-foreground'] = 'hsl(220, 20%, 10%)'
    variables['--color-muted'] = 'hsl(220, 14%, 96%)'
    variables['--color-muted-foreground'] = 'hsl(220, 9%, 46%)'
    variables['--color-border'] = 'hsl(220, 13%, 91%)'
    variables['--color-input'] = 'hsl(220, 13%, 97%)'
    variables['--color-ring'] = 'hsl(220, 70%, 50%)'
  }

  // 根据对比度调整颜色
  const contrastLevel = systemHighContrast ? 'high' : config.contrast
  if (contrastLevel !== 'normal') {
    const contrastMultiplier = contrastLevel === 'maximum' ? 2 : 1.5

    if (actualMode === 'dark') {
      // 深色高对比度
      variables['--color-background'] = 'hsl(220, 40%, 5%)'
      variables['--color-foreground'] = 'hsl(220, 40%, 98%)'
      variables['--color-border'] = 'hsl(220, 60%, 40%)'
    } else {
      // 浅色高对比度
      variables['--color-background'] = 'hsl(0, 0%, 100%)'
      variables['--color-foreground'] = 'hsl(220, 20%, 5%)'
      variables['--color-border'] = 'hsl(220, 30%, 30%)'
    }

    // 调整边框宽度以增强对比度
    variables['--border-width'] = `${Math.max(1, Math.round(1 * contrastMultiplier))}px`
  } else {
    variables['--border-width'] = '1px'
  }

  // 语义颜色调整
  const semanticColors = generateSemanticColors(actualMode, contrastLevel)
  Object.assign(variables, semanticColors)

  return variables
}

/**
 * 生成语义颜色
 */
function generateSemanticColors(mode: 'light' | 'dark', contrast: ContrastMode): Record<string, string> {
  const colors: Record<string, string> = {}

  if (mode === 'dark') {
    colors['--color-primary'] = 'hsl(220, 70%, 60%)'
    colors['--color-primary-foreground'] = 'hsl(220, 40%, 8%)'
    colors['--color-secondary'] = 'hsl(220, 30%, 20%)'
    colors['--color-secondary-foreground'] = 'hsl(220, 40%, 90%)'
    colors['--color-destructive'] = 'hsl(0, 70%, 60%)'
    colors['--color-destructive-foreground'] = 'hsl(220, 40%, 95%)'
    colors['--color-success'] = 'hsl(142, 70%, 55%)'
    colors['--color-success-foreground'] = 'hsl(220, 40%, 8%)'
    colors['--color-warning'] = 'hsl(38, 92%, 60%)'
    colors['--color-warning-foreground'] = 'hsl(220, 40%, 8%)'
  } else {
    colors['--color-primary'] = 'hsl(220, 70%, 40%)'
    colors['--color-primary-foreground'] = 'hsl(0, 0%, 100%)'
    colors['--color-secondary'] = 'hsl(220, 14%, 96%)'
    colors['--color-secondary-foreground'] = 'hsl(220, 9%, 46%)'
    colors['--color-destructive'] = 'hsl(0, 84%, 45%)'
    colors['--color-destructive-foreground'] = 'hsl(0, 0%, 100%)'
    colors['--color-success'] = 'hsl(142, 76%, 36%)'
    colors['--color-success-foreground'] = 'hsl(0, 0%, 100%)'
    colors['--color-warning'] = 'hsl(38, 92%, 50%)'
    colors['--color-warning-foreground'] = 'hsl(0, 0%, 100%)'
  }

  // 高对比度调整
  if (contrast !== 'normal') {
    const contrastMultiplier = contrast === 'maximum' ? 1.3 : 1.15

    if (mode === 'dark') {
      colors['--color-primary'] = `hsl(220, ${Math.min(100, 70 * contrastMultiplier)}%, ${Math.min(90, 60 * contrastMultiplier)}%)`
      colors['--color-destructive'] = `hsl(0, ${Math.min(100, 70 * contrastMultiplier)}%, ${Math.min(90, 60 * contrastMultiplier)}%)`
      colors['--color-success'] = `hsl(142, ${Math.min(100, 70 * contrastMultiplier)}%, ${Math.min(90, 55 * contrastMultiplier)}%)`
      colors['--color-warning'] = `hsl(38, ${Math.min(100, 92 * contrastMultiplier)}%, ${Math.min(90, 60 * contrastMultiplier)}%)`
    } else {
      colors['--color-primary'] = `hsl(220, ${Math.min(100, 70 * contrastMultiplier)}%, ${Math.max(10, 40 - (contrastMultiplier - 1) * 20)}%)`
      colors['--color-destructive'] = `hsl(0, ${Math.min(100, 84 * contrastMultiplier)}%, ${Math.max(10, 45 - (contrastMultiplier - 1) * 20)}%)`
      colors['--color-success'] = `hsl(142, ${Math.min(100, 76 * contrastMultiplier)}%, ${Math.max(10, 36 - (contrastMultiplier - 1) * 15)}%)`
      colors['--color-warning'] = `hsl(38, ${Math.min(100, 92 * contrastMultiplier)}%, ${Math.max(10, 50 - (contrastMultiplier - 1) * 20)}%)`
    }
  }

  return colors
}

/**
 * 颜色模式工具类
 */
export class ColorModeHelper {
  /**
   * 获取系统颜色模式
   */
  static getSystemColorMode(): 'light' | 'dark' {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  /**
   * 获取系统高对比度偏好
   */
  static getSystemContrastPreference(): boolean {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-contrast: high)').matches ||
           window.matchMedia('(prefers-contrast: more)').matches
  }

  /**
   * 创建媒体查询
   */
  static createColorModeMediaQuery(mode: 'light' | 'dark'): string {
    return `(prefers-color-scheme: ${mode})`
  }

  static createContrastMediaQuery(): string {
    return '(prefers-contrast: high), (prefers-contrast: more)'
  }

  /**
   * 验证颜色模式
   */
  static validateColorMode(mode: string): mode is ColorMode {
    return ['light', 'dark', 'auto'].includes(mode)
  }

  /**
   * 验证对比度模式
   */
  static validateContrastMode(contrast: string): contrast is ContrastMode {
    return ['normal', 'high', 'maximum'].includes(contrast)
  }

  /**
   * 生成颜色模式 CSS
   */
  static generateColorModeCSS(config: ColorModeConfig): string {
    const variables = generateColorModeCSSVariables(
      config,
      config.mode === 'auto' ? this.getSystemColorMode() : config.mode,
      this.getSystemContrastPreference()
    )

    const cssVars = Object.entries(variables)
      .map(([key, value]) => `  ${key}: ${value};`)
      .join('\n')

    return `:root {
${cssVars}
}`
  }

  /**
   * 切换颜色模式
   */
  static toggleColorMode(): 'light' | 'dark' {
    const currentMode = this.getSystemColorMode()
    return currentMode === 'light' ? 'dark' : 'light'
  }

  /**
   * 检测是否支持颜色模式
   */
  static supportsColorMode(): boolean {
    return typeof window !== 'undefined' && 'matchMedia' in window
  }
}