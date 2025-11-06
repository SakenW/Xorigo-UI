'use client'
/**
 * 🎭 主题系统引擎 - v2025.11.03
 *
 * 七轴主题系统的核心引擎
 * 支持动态主题切换、多品牌皮肤、主题配方管理
 *
 * @version 2025.11.03
 * @category System
 * @layer system
 */

import React, { createContext, useContext, useEffect, useState } from 'react'
import { colorTokens } from '../foundations/color-tokens'
import { densityTokens } from '../foundations/density-tokens'
import { motionTokens } from '../foundations/motion-curves'
import { surfaceTokens } from '../foundations/surface-tokens'

/**
 * 七轴主题配置接口
 */
export interface SevenAxisTheme {
  // 模式轴
  mode: 'light' | 'dark' | 'auto'

  // 色调轴
  hue: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'teal' | 'indigo'

  // 饱和度轴
  saturation: 'low' | 'medium' | 'high' | 'vivid'

  // 亮度轴
  lightness: 'dim' | 'normal' | 'bright'

  // 密度轴
  density: 'compact' | 'comfortable' | 'spacious'

  // 圆度轴
  roundness: 'sharp' | 'rounded' | 'circular'

  // 对比度轴
  contrast: 'normal' | 'high' | 'maximum'
}

/**
 * 主题配方接口
 */
export interface ThemeRecipe {
  id: string
  name: string
  description: string
  theme: SevenAxisTheme
  css: string
  variables: Record<string, string>
}

/**
 * 主题上下文接口
 */
export interface ThemeContextValue {
  currentTheme: SevenAxisTheme
  setTheme: (theme: Partial<SevenAxisTheme>) => void
  resetTheme: () => void
  applyRecipe: (recipe: ThemeRecipe) => void
  systemTheme: 'light' | 'dark'
  isHighContrast: boolean
  isReducedMotion: boolean
}

/**
 * 默认主题配置
 */
export const defaultTheme: SevenAxisTheme = {
  mode: 'light',
  hue: 'blue',
  saturation: 'medium',
  lightness: 'normal',
  density: 'comfortable',
  roundness: 'rounded',
  contrast: 'normal'
}

/**
 * 主题上下文
 */
export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

/**
 * 主题提供者组件
 */
export function ThemeProvider({
  children,
  defaultTheme: initialTheme = defaultTheme,
  storageKey = 'xorigo-ui-theme'
}: {
  children: React.ReactNode
  defaultTheme?: SevenAxisTheme
  storageKey?: string
}) {
  const [currentTheme, setCurrentTheme] = useState<SevenAxisTheme>(initialTheme)
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light')
  const [isHighContrast, setIsHighContrast] = useState(false)
  const [isReducedMotion, setIsReducedMotion] = useState(false)

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light')

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // 监听可访问性偏好
  useEffect(() => {
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)')
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    setIsHighContrast(highContrastQuery.matches)
    setIsReducedMotion(reducedMotionQuery.matches)

    const handleHighContrastChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches)
    }

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches)
    }

    highContrastQuery.addEventListener('change', handleHighContrastChange)
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange)

    return () => {
      highContrastQuery.removeEventListener('change', handleHighContrastChange)
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange)
    }
  }, [])

  // 从本地存储加载主题
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const parsedTheme = JSON.parse(stored)
        setCurrentTheme({ ...defaultTheme, ...parsedTheme })
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error)
    }
  }, [storageKey])

  // 保存主题到本地存储
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(currentTheme))
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error)
    }
  }, [currentTheme, storageKey])

  // 应用主题到 CSS 变量
  useEffect(() => {
    const root = document.documentElement
    const cssVariables = generateCSSVariables(currentTheme, systemTheme, isHighContrast, isReducedMotion)

    Object.entries(cssVariables).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })

    // 更新 data 属性用于 CSS 选择器
    root.setAttribute('data-theme', currentTheme.mode)
    root.setAttribute('data-hue', currentTheme.hue)
    root.setAttribute('data-saturation', currentTheme.saturation)
    root.setAttribute('data-lightness', currentTheme.lightness)
    root.setAttribute('data-density', currentTheme.density)
    root.setAttribute('data-roundness', currentTheme.roundness)
    root.setAttribute('data-contrast', currentTheme.contrast)
    root.setAttribute('data-system-theme', systemTheme)
    root.setAttribute('data-high-contrast', isHighContrast.toString())
    root.setAttribute('data-reduced-motion', isReducedMotion.toString())
  }, [currentTheme, systemTheme, isHighContrast, isReducedMotion])

  const setTheme = (themeUpdate: Partial<SevenAxisTheme>) => {
    setCurrentTheme(prev => ({ ...prev, ...themeUpdate }))
  }

  const resetTheme = () => {
    setCurrentTheme(defaultTheme)
  }

  const applyRecipe = (recipe: ThemeRecipe) => {
    setCurrentTheme(recipe.theme)
  }

  const value: ThemeContextValue = {
    currentTheme,
    setTheme,
    resetTheme,
    applyRecipe,
    systemTheme,
    isHighContrast,
    isReducedMotion
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * 使用主题的 Hook
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

/**
 * 生成 CSS 变量
 */
function generateCSSVariables(
  theme: SevenAxisTheme,
  systemTheme: 'light' | 'dark',
  isHighContrast: boolean,
  isReducedMotion: boolean
): Record<string, string> {
  const variables: Record<string, string> = {}

  // 基础主题变量
  variables['--theme-mode'] = theme.mode
  variables['--theme-hue'] = theme.hue
  variables['--theme-saturation'] = theme.saturation
  variables['--theme-lightness'] = theme.lightness
  variables['--theme-density'] = theme.density
  variables['--theme-roundness'] = theme.roundness
  variables['--theme-contrast'] = theme.contrast

  // 实际主题模式（考虑 auto）
  const actualMode = theme.mode === 'auto' ? systemTheme : theme.mode

  // 颜色变量
  const primaryHue = getHueValue(theme.hue)
  const saturationMultiplier = getSaturationMultiplier(theme.saturation)
  const lightnessMultiplier = getLightnessMultiplier(theme.lightness, actualMode)
  const contrastMultiplier = getContrastMultiplier(theme.contrast, isHighContrast)

  // 生成主要颜色
  const primaryColor = adjustColor(
    colorTokens.primary[500],
    saturationMultiplier,
    lightnessMultiplier
  )

  variables['--color-primary'] = `hsl(${primaryColor.h}, ${primaryColor.s}%, ${primaryColor.l}%)`
  variables['--color-primary-foreground'] = getContrastColor(primaryColor)

  // 生成中性颜色
  const neutralColor = adjustColor(
    actualMode === 'dark' ? colorTokens.neutral[50] : colorTokens.neutral[950],
    1,
    lightnessMultiplier
  )

  variables['--color-background'] = `hsl(${neutralColor.h}, ${neutralColor.s}%, ${neutralColor.l}%)`
  variables['--color-foreground'] = getContrastColor(neutralColor)

  // 密度变量
  const densityScale = getDensityScale(theme.density)
  variables['--spacing-scale'] = densityScale.toString()
  variables['--font-size-scale'] = densityScale.toString()

  // 圆度变量
  const borderRadius = getBorderRadiusValue(theme.roundness)
  variables['--border-radius'] = borderRadius

  // 动画变量
  if (isReducedMotion) {
    variables['--animation-duration-multiplier'] = '0.5'
    variables['--animation-easing'] = 'ease-out'
  } else {
    variables['--animation-duration-multiplier'] = '1'
    variables['--animation-easing'] = motionTokens.easing['ease-natural']
  }

  return variables
}

/**
 * 获取色调值
 */
function getHueValue(hue: SevenAxisTheme['hue']): number {
  const hueMap = {
    blue: 220,
    green: 142,
    purple: 262,
    orange: 25,
    red: 0,
    teal: 180,
    indigo: 240
  }
  return hueMap[hue]
}

/**
 * 获取饱和度倍数
 */
function getSaturationMultiplier(saturation: SevenAxisTheme['saturation']): number {
  const saturationMap = {
    low: 0.6,
    medium: 1,
    high: 1.3,
    vivid: 1.6
  }
  return saturationMap[saturation]
}

/**
 * 获取亮度倍数
 */
function getLightnessMultiplier(lightness: SevenAxisTheme['lightness'], mode: 'light' | 'dark'): number {
  if (mode === 'dark') {
    const darkMap = {
      dim: 0.8,
      normal: 1,
      bright: 1.2
    }
    return darkMap[lightness]
  } else {
    const lightMap = {
      dim: 0.9,
      normal: 1,
      bright: 1.1
    }
    return lightMap[lightness]
  }
}

/**
 * 获取对比度倍数
 */
function getContrastMultiplier(contrast: SevenAxisTheme['contrast'], isHighContrast: boolean): number {
  if (isHighContrast) return 1.5

  const contrastMap = {
    normal: 1,
    high: 1.2,
    maximum: 1.4
  }
  return contrastMap[contrast]
}

/**
 * 调整颜色
 */
function adjustColor(baseColor: { h: number; s: number; l: number }, saturationMult: number, lightnessMult: number) {
  return {
    h: baseColor.h,
    s: Math.min(100, baseColor.s * saturationMult),
    l: Math.min(100, Math.max(0, baseColor.l * lightnessMult))
  }
}

/**
 * 获取对比色
 */
function getContrastColor(color: { h: number; s: number; l: number }): string {
  // 简单的对比度计算，实际项目中可能需要更复杂的算法
  const isLight = color.l > 50
  return `hsl(${color.h}, ${color.s}%, ${isLight ? 10 : 95}%)`
}

/**
 * 获取密度缩放
 */
function getDensityScale(density: SevenAxisTheme['density']): number {
  const densityMap = {
    compact: 0.875,
    comfortable: 1,
    spacious: 1.125
  }
  return densityMap[density]
}

/**
 * 获取边框圆角值
 */
function getBorderRadiusValue(roundness: SevenAxisTheme['roundness']): string {
  const radiusMap = {
    sharp: '0px',
    rounded: '6px',
    circular: '9999px'
  }
  return radiusMap[roundness]
}

/**
 * 主题工具类
 */
export class ThemeEngine {
  /**
   * 创建主题配方
   */
  static createRecipe(config: {
    id: string
    name: string
    description: string
    theme: SevenAxisTheme
  }): ThemeRecipe {
    const css = this.generateThemeCSS(config.theme)
    const variables = this.generateCSSVariables(config.theme)

    return {
      ...config,
      css,
      variables
    }
  }

  /**
   * 生成主题 CSS
   */
  static generateThemeCSS(theme: SevenAxisTheme): string {
    const variables = this.generateCSSVariables(theme)
    const cssVars = Object.entries(variables)
      .map(([key, value]) => `  ${key}: ${value};`)
      .join('\n')

    return `:root {
${cssVars}
}`
  }

  /**
   * 生成 CSS 变量
   */
  static generateCSSVariables(theme: SevenAxisTheme): Record<string, string> {
    return generateCSSVariables(theme, 'light', false, false)
  }

  /**
   * 验证主题配置
   */
  static validateTheme(theme: Partial<SevenAxisTheme>): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (theme.mode && !['light', 'dark', 'auto'].includes(theme.mode)) {
      errors.push('Invalid mode value')
    }

    if (theme.hue && !['blue', 'green', 'purple', 'orange', 'red', 'teal', 'indigo'].includes(theme.hue)) {
      errors.push('Invalid hue value')
    }

    if (theme.saturation && !['low', 'medium', 'high', 'vivid'].includes(theme.saturation)) {
      errors.push('Invalid saturation value')
    }

    if (theme.lightness && !['dim', 'normal', 'bright'].includes(theme.lightness)) {
      errors.push('Invalid lightness value')
    }

    if (theme.density && !['compact', 'comfortable', 'spacious'].includes(theme.density)) {
      errors.push('Invalid density value')
    }

    if (theme.roundness && !['sharp', 'rounded', 'circular'].includes(theme.roundness)) {
      errors.push('Invalid roundness value')
    }

    if (theme.contrast && !['normal', 'high', 'maximum'].includes(theme.contrast)) {
      errors.push('Invalid contrast value')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }
}