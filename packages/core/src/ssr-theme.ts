/**
 * SSR主题工具专用入口
 *
 * 专门为主题系统提供SSR支持的工具和组件
 */

// 主题核心工具
export {
  defaultThemeVariables,
  darkThemeVariables,
  mergeThemeVariables,
  generateCSSVariables,
  generateThemeCSS,
  applyThemeSSR,
  getThemeVariable,
  useSSRSafeTheme,
  generateThemeMetaTags,
  generateInlineThemeStyles,
  preloadThemeCSS
} from './utils/ssr-theme'

// 主题组件
export {
  ThemeProvider,
  useTheme,
  useThemeVariable,
  ThemeToggle,
  withTheme
} from './components/theme'

// 类型导出
export type {
  ThemeVariables
} from './utils/ssr-theme'

export type {
  ThemeProviderProps,
  ThemeToggleProps
} from './components/theme'