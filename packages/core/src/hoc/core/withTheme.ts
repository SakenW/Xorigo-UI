/**
 * @fileoverview withTheme HOC - 主题增强高阶组件
 * @description 为组件注入主题系统支持，包括主题模式、色彩系统和设计令牌
 */

import React, { forwardRef, useMemo } from 'react'
import { HOC, ComponentType, ThemeMode, ColorScheme } from '../types'

/**
 * 主题配置接口
 */
export interface ThemeConfig {
  mode?: ThemeMode
  colorScheme?: ColorScheme
  customTheme?: Record<string, any>
  enableSystemTheme?: boolean
}

/**
 * 主题上下文接口
 */
export interface ThemeContextValue {
  theme: Record<string, any>
  mode: ThemeMode
  colorScheme: ColorScheme
  isDarkMode: boolean
  toggleTheme: () => void
  setTheme: (mode: ThemeMode) => void
}

/**
 * 默认主题配置
 */
const DEFAULT_THEME_CONFIG: Required<ThemeConfig> = {
  mode: 'system',
  colorScheme: 'primary',
  customTheme: {},
  enableSystemTheme: true,
}

/**
 * withTheme HOC - 为组件注入主题支持
 *
 * @param config 主题配置选项
 * @returns 高阶组件函数
 *
 * @example
 * ```tsx
 * const ThemedButton = withTheme({
 *   mode: 'dark',
 *   colorScheme: 'primary'
 * })(BaseButton)
 * ```
 */
export function withTheme<T extends Record<string, any> = {}>(
  config: ThemeConfig = {}
): HOC<T, T & ThemeContextValue> {
  return function(Component: ComponentType<T>) {
    const displayName = config.displayName || `withTheme(${Component.displayName || Component.name || 'Component'})`

    const ThemedComponent = forwardRef<any, T & ThemeContextValue>((props, ref) => {
      const {
        theme: customTheme,
        mode: themeMode = DEFAULT_THEME_CONFIG.mode,
        colorScheme: activeColorScheme = DEFAULT_THEME_CONFIG.colorScheme,
        enableSystemTheme = DEFAULT_THEME_CONFIG.enableSystemTheme,
        ...componentProps
      } = props

      // 模拟主题系统（实际实现中会使用真实的主题提供者）
      const themeContext = useMemo<ThemeContextValue>(() => {
        // 检测系统主题偏好
        const getSystemMode = (): ThemeMode => {
          if (!enableSystemTheme) return themeMode
          if (typeof window === 'undefined') return themeMode

          try {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
          } catch {
            return themeMode
          }
        }

        const currentMode = themeMode === 'system' ? getSystemMode() : themeMode

        // 模拟主题令牌
        const baseTheme = {
          colors: {
            primary: {
              light: {
                50: '#f0f9ff',
                100: '#e0f2fe',
                200: '#bae6fd',
                300: '#7dd3fc',
                400: '#38bdf8',
                500: '#0ea5e9',
                600: '#0284c7',
                700: '#0369a1',
                800: '#075985',
                900: '#0c4a6e',
              },
              dark: {
                50: '#0c4a6e',
                100: '#075985',
                200: '#0369a1',
                300: '#0284c7',
                400: '#0ea5e9',
                500: '#38bdf8',
                600: '#7dd3fc',
                700: '#bae6fd',
                800: '#e0f2fe',
                900: '#f0f9ff',
              },
            },
            gray: {
              light: {
                50: '#f9fafb',
                100: '#f3f4f6',
                200: '#e5e7eb',
                300: '#d1d5db',
                400: '#9ca3af',
                500: '#6b7280',
                600: '#4b5563',
                700: '#374151',
                800: '#1f2937',
                900: '#111827',
              },
              dark: {
                50: '#111827',
                100: '#1f2937',
                200: '#374151',
                300: '#4b5563',
                400: '#6b7280',
                500: '#9ca3af',
                600: '#d1d5db',
                700: '#e5e7eb',
                800: '#f3f4f6',
                900: '#f9fafb',
              },
            },
          },
          spacing: {
            xs: '0.25rem',
            sm: '0.5rem',
            md: '1rem',
            lg: '1.5rem',
            xl: '2rem',
            '2xl': '3rem',
          },
          radii: {
            none: '0',
            sm: '0.125rem',
            md: '0.375rem',
            lg: '0.5rem',
            xl: '0.75rem',
            '2xl': '1rem',
            full: '9999px',
          },
          shadows: {
            sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
            md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
            xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
          },
          typography: {
            fontFamily: {
              sans: ['Inter', 'system-ui', 'sans-serif'],
              mono: ['Fira Code', 'monospace'],
            },
            fontSize: {
              xs: '0.75rem',
              sm: '0.875rem',
              base: '1rem',
              lg: '1.125rem',
              xl: '1.25rem',
              '2xl': '1.5rem',
              '3xl': '1.875rem',
            },
          },
        }

        // 合并自定义主题
        const mergedTheme = {
          ...baseTheme,
          ...customTheme,
        }

        return {
          theme: mergedTheme,
          mode: currentMode,
          colorScheme: activeColorScheme,
          isDarkMode: currentMode === 'dark',
          toggleTheme: () => {
            // 实际实现中会通过context更新主题
            console.log('Toggle theme from', currentMode, 'to', currentMode === 'dark' ? 'light' : 'dark')
          },
          setTheme: (newMode: ThemeMode) => {
            // 实际实现中会通过context更新主题
            console.log('Set theme to', newMode)
          },
        }
      }, [customTheme, themeMode, activeColorScheme, enableSystemTheme])

      // 传递给组件的增强props
      const enhancedProps = {
        ...componentProps,
        theme: themeContext.theme,
        mode: themeContext.mode,
        colorScheme: themeContext.colorScheme,
        isDarkMode: themeContext.isDarkMode,
        toggleTheme: themeContext.toggleTheme,
        setTheme: themeContext.setTheme,
      }

      return <Component ref={ref} {...enhancedProps} />
    })

    ThemedComponent.displayName = displayName

    return ThemedComponent
  }
}

// 便捷导出 - 无配置版本
export const WithTheme = withTheme()

// 预设主题配置
export const withLightTheme = withTheme({ mode: 'light' })
export const withDarkTheme = withTheme({ mode: 'dark' })
export const withSystemTheme = withTheme({ mode: 'system', enableSystemTheme: true })

export default withTheme
