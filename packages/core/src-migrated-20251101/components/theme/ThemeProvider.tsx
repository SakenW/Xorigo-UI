import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  defaultThemeVariables,
  darkThemeVariables,
  mergeThemeVariables,
  applyThemeSSR,
  useSSRSafeTheme,
  generateInlineThemeStyles,
  preloadThemeCSS,
  type ThemeVariables
} from '../../utils/ssr-theme'

/**
 * 主题上下文类型
 */
interface ThemeContextType {
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void
  isReady: boolean
  themeVariables: ThemeVariables
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
  isReady: false,
  themeVariables: defaultThemeVariables as ThemeVariables
})

/**
 * ThemeProvider 组件属性
 */
export interface ThemeProviderProps {
  children: React.ReactNode
  /**
   * 默认主题
   * @default 'light'
   */
  defaultTheme?: 'light' | 'dark'
  /**
   * 是否在服务端预加载主题CSS
   * @default true
   */
  preloadSSRStyles?: boolean
  /**
   * 是否启用系统主题检测
   * @default true
   */
  enableSystemTheme?: boolean
  /**
   * 自定义主题变量
   */
  customTheme?: Partial<ThemeVariables>
  /**
   * 存储主题的localStorage键名
   * @default 'theme'
   */
  storageKey?: string
}

/**
 * SSR友好的ThemeProvider组件
 *
 * 提供主题切换功能，支持SSR环境和客户端水合
 *
 * @example
 * ```tsx
 * <ThemeProvider defaultTheme="light" enableSystemTheme>
 *   <App>
 *     <Header />
 *     <Main />
 *   </App>
 * </ThemeProvider>
 * ```
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'light',
  preloadSSRStyles = true,
  enableSystemTheme = true,
  customTheme = {},
  storageKey = 'theme'
}) => {
  const { theme, setTheme, isReady } = useSSRSafeTheme(defaultTheme)
  const [themeVariables, setThemeVariables] = useState<ThemeVariables>(
    defaultThemeVariables as ThemeVariables
  )

  // 计算当前主题变量
  useEffect(() => {
    const baseTheme = theme === 'dark'
      ? mergeThemeVariables(defaultThemeVariables, darkThemeVariables)
      : defaultThemeVariables

    const finalTheme = mergeThemeVariables(baseTheme, customTheme)
    setThemeVariables(finalTheme)

    // 应用主题CSS变量
    applyThemeSSR(finalTheme)
  }, [theme, customTheme])

  // 切换主题函数
  const toggleTheme = React.useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }, [theme, setTheme])

  // 在服务端预加载CSS
  const renderSSRStyles = () => {
    if (!preloadSSRStyles || typeof window !== 'undefined') {
      return null
    }

    const lightCSS = preloadThemeCSS('light')
    const darkCSS = preloadThemeCSS('dark')

    return (
      <>
        <div dangerouslySetInnerHTML={{ __html: lightCSS }} />
        <div dangerouslySetInnerHTML={{ __html: darkCSS }} />
      </>
    )
  }

  const contextValue: ThemeContextType = {
    theme,
    setTheme,
    toggleTheme,
    isReady,
    themeVariables
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {renderSSRStyles()}
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * 使用主题的Hook
 */
export const useTheme = () => {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}

/**
 * 获取主题变量的Hook
 */
export const useThemeVariable = (variableName: string) => {
  const { themeVariables } = useTheme()

  return React.useMemo(() => {
    const category = variableName.split('-')[1]?.split('-')[0] as keyof ThemeVariables

    if (category && themeVariables[category]) {
      return themeVariables[category][variableName] || ''
    }

    return ''
  }, [variableName, themeVariables])
}

/**
 * 主题切换按钮组件
 */
export interface ThemeToggleProps {
  className?: string
  children?: React.ReactNode
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  children
}) => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={className}
      aria-label={`切换到${theme === 'light' ? '深色' : '浅色'}主题`}
    >
      {children || (
        <span>
          {theme === 'light' ? '🌙' : '☀️'}
        </span>
      )}
    </button>
  )
}

/**
 * 主题感知的组件HOC
 */
export const withTheme = <P extends object>(
  Component: React.ComponentType<P>
) => {
  const ThemedComponent = React.forwardRef<any, P>((props, ref) => {
    const { theme } = useTheme()

    return (
      <div data-theme={theme} ref={ref}>
        <Component {...props} />
      </div>
    )
  })

  ThemedComponent.displayName = `withTheme(${Component.displayName || Component.name})`

  return ThemedComponent
}