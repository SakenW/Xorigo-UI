/**
 * SSR友好的主题系统工具
 *
 * 处理CSS变量和主题在服务端渲染环境下的兼容性问题
 */

import React from 'react'
import { isBrowser, isServer } from './ssr'

/**
 * 主题变量接口
 */
export interface ThemeVariables {
  colors: Record<string, string>
  spacing: Record<string, string>
  typography: Record<string, string>
  shadows: Record<string, string>
  transitions: Record<string, string>
  breakpoints: Record<string, string>
}

/**
 * 默认主题变量
 */
export const defaultThemeVariables: Partial<ThemeVariables> = {
  colors: {
    // 主色调
    '--color-primary-50': '#eff6ff',
    '--color-primary-500': '#3b82f6',
    '--color-primary-600': '#2563eb',
    '--color-primary-900': '#1e3a8a',

    // 中性色
    '--color-gray-50': '#f9fafb',
    '--color-gray-500': '#6b7280',
    '--color-gray-900': '#111827',

    // 语义化颜色
    '--color-success': '#10b981',
    '--color-warning': '#f59e0b',
    '--color-error': '#ef4444',
    '--color-info': '#3b82f6',

    // 背景色
    '--bg-primary': '#ffffff',
    '--bg-secondary': '#f3f4f6',
    '--bg-tertiary': '#e5e7eb',

    // 文本色
    '--text-primary': '#111827',
    '--text-secondary': '#6b7280',
    '--text-tertiary': '#9ca3af',

    // 边框色
    '--border-primary': '#e5e7eb',
    '--border-secondary': '#d1d5db',

    // 状态色背景
    '--bg-info': '#dbeafe',
    '--bg-success': '#d1fae5',
    '--bg-warning': '#fef3c7',
    '--bg-error': '#fee2e2',

    // 状态色文本
    '--text-info': '#1e40af',
    '--text-success': '#065f46',
    '--text-warning': '#92400e',
    '--text-error': '#991b1b',

    // 状态色边框
    '--border-info': '#3b82f6',
    '--border-success': '#10b981',
    '--border-warning': '#f59e0b',
    '--border-error': '#ef4444',
  },
  spacing: {
    '--spacing-xs': '0.25rem',
    '--spacing-sm': '0.5rem',
    '--spacing-md': '1rem',
    '--spacing-lg': '1.5rem',
    '--spacing-xl': '2rem',
    '--spacing-2xl': '3rem',
  },
  typography: {
    '--font-size-xs': '0.75rem',
    '--font-size-sm': '0.875rem',
    '--font-size-base': '1rem',
    '--font-size-lg': '1.125rem',
    '--font-size-xl': '1.25rem',
    '--font-size-2xl': '1.5rem',
    '--font-size-3xl': '1.875rem',

    '--font-weight-normal': '400',
    '--font-weight-medium': '500',
    '--font-weight-semibold': '600',
    '--font-weight-bold': '700',

    '--line-height-tight': '1.25',
    '--line-height-normal': '1.5',
    '--line-height-relaxed': '1.75',
  },
  shadows: {
    '--shadow-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    '--shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    '--shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    '--shadow-xl': '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },
  transitions: {
    '--transition-fast': '150ms ease-in-out',
    '--transition-normal': '300ms ease-in-out',
    '--transition-slow': '500ms ease-in-out',
  },
  breakpoints: {
    '--breakpoint-sm': '640px',
    '--breakpoint-md': '768px',
    '--breakpoint-lg': '1024px',
    '--breakpoint-xl': '1280px',
  }
}

/**
 * 深色主题变量
 */
export const darkThemeVariables: Partial<ThemeVariables> = {
  colors: {
    '--bg-primary': '#111827',
    '--bg-secondary': '#1f2937',
    '--bg-tertiary': '#374151',

    '--text-primary': '#f9fafb',
    '--text-secondary': '#d1d5db',
    '--text-tertiary': '#9ca3af',

    '--border-primary': '#374151',
    '--border-secondary': '#4b5563',

    '--bg-info': '#1e3a8a',
    '--bg-success': '#064e3b',
    '--bg-warning': '#78350f',
    '--bg-error': '#7f1d1d',

    '--text-info': '#dbeafe',
    '--text-success': '#d1fae5',
    '--text-warning': '#fef3c7',
    '--text-error': '#fee2e2',
  }
}

/**
 * 合并主题变量
 */
export const mergeThemeVariables = (
  base: Partial<ThemeVariables>,
  override: Partial<ThemeVariables>
): ThemeVariables => {
  const result: ThemeVariables = {
    colors: { ...base.colors, ...override.colors },
    spacing: { ...base.spacing, ...override.spacing },
    typography: { ...base.typography, ...override.typography },
    shadows: { ...base.shadows, ...override.shadows },
    transitions: { ...base.transitions, ...override.transitions },
    breakpoints: { ...base.breakpoints, ...override.breakpoints },
  }
  return result
}

/**
 * 生成CSS变量字符串
 */
export const generateCSSVariables = (variables: Partial<ThemeVariables>): string => {
  const cssVars: string[] = []

  Object.entries(variables).forEach(([category, vars]) => {
    if (vars && typeof vars === 'object') {
      Object.entries(vars).forEach(([key, value]) => {
        cssVars.push(`${key}: ${value}`)
      })
    }
  })

  return cssVars.join(';\n')
}

/**
 * 生成CSS样式字符串
 */
export const generateThemeCSS = (variables: Partial<ThemeVariables>): string => {
  const cssVars = generateCSSVariables(variables)
  return `:root {\n  ${cssVars};\n}`
}

/**
 * SSR安全的主题应用函数
 */
export const applyThemeSSR = (theme: Partial<ThemeVariables>) => {
  if (isServer) {
    // 服务端环境下，返回CSS字符串而不是直接操作DOM
    return generateThemeCSS(theme)
  }

  // 客户端环境下，直接应用CSS变量
  const root = document.documentElement
  Object.entries(theme).forEach(([category, vars]) => {
    if (vars && typeof vars === 'object') {
      Object.entries(vars).forEach(([key, value]) => {
        root.style.setProperty(key, value)
      })
    }
  })

  return null
}

/**
 * 获取当前主题变量值
 */
export const getThemeVariable = (variableName: string): string | null => {
  if (isServer) {
    // 服务端环境下，从默认主题中获取
    const allVars = mergeThemeVariables(defaultThemeVariables, {})
    const category = variableName.split('-')[1]?.split('-')[0] as keyof ThemeVariables

    if (category && allVars[category]) {
      return allVars[category][variableName] || null
    }

    return null
  }

  // 客户端环境下，从计算样式中获取
  const root = document.documentElement
  return getComputedStyle(root).getPropertyValue(variableName).trim() || null
}

/**
 * SSR安全的主题切换Hook
 */
export const useSSRSafeTheme = (defaultTheme: 'light' | 'dark' = 'light') => {
  const [theme, setTheme] = React.useState<'light' | 'dark'>(defaultTheme)
  const [isReady, setIsReady] = React.useState(false)

  React.useEffect(() => {
    setIsReady(true)

    // 从localStorage恢复主题设置
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      // 检测系统主题偏好
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    }
  }, [])

  React.useEffect(() => {
    if (!isReady) return

    const themeVariables = theme === 'dark'
      ? mergeThemeVariables(defaultThemeVariables, darkThemeVariables)
      : defaultThemeVariables

    applyThemeSSR(themeVariables)
    localStorage.setItem('theme', theme)
  }, [theme, isReady])

  return { theme, setTheme, isReady }
}

/**
 * 生成主题元标签（用于SSR）
 */
export const generateThemeMetaTags = (theme: Partial<ThemeVariables>): string[] => {
  const metaTags: string[] = []

  // 生成主题色meta标签
  if (theme.colors?.['--color-primary-500']) {
    metaTags.push(`<meta name="theme-color" content="${theme.colors['--color-primary-500']}">`)
  }

  // 生成其他必要的meta标签
  metaTags.push('<meta name="color-scheme" content="light dark">')

  return metaTags
}

/**
 * 生成内联CSS样式（用于SSR）
 */
export const generateInlineThemeStyles = (theme: 'light' | 'dark' = 'light'): string => {
  const themeVariables = theme === 'dark'
    ? mergeThemeVariables(defaultThemeVariables, darkThemeVariables)
    : defaultThemeVariables

  return generateThemeCSS(themeVariables)
}

/**
 * 主题预加载函数（用于SSR）
 */
export const preloadThemeCSS = (theme: 'light' | 'dark'): string => {
  const css = generateInlineThemeStyles(theme)
  return `<style data-theme="${theme}">${css}</style>`
}