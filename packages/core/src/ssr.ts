/**
 * Xorigo UI SSR 兼容性入口
 *
 * 提供服务端渲染友好的组件和工具导出
 */

// 核心SSR工具
export {
  isBrowser,
  isServer,
  isNode,
  hasDOM,
  getEnvironment,
  useSSRSafeEffect,
  useSSRSafeLocalStorage,
  getWindow,
  getDocument,
  getNavigator,
  deferToClient,
  useAfterHydration,
  useSSRSafeMediaQuery,
  useSSRSafeIntersectionObserver,
  useSSRSafeMeasure,
  SSRSafeErrorBoundary,
  getURLParams,
  setPageTitle,
  useSSRSafeFocus
} from './utils/ssr'

// SSR友好的主题系统
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

// SSR友好的动画组件
export {
  MotionProvider,
  useMotion,
  useSSRSafeAnimation,
  SSRMotionDiv,
  SSRAnimatePresence,
  LazyMotion,
  createLazyMotionComponent
} from './components/motion'

// SSR友好的主题组件
export {
  ThemeProvider,
  useTheme,
  useThemeVariable,
  ThemeToggle,
  withTheme
} from './components/theme'

// 重新导出常用的静态组件（无需动画的版本）
export { Alert } from './feedback/Alert'
export { Loading } from './feedback/Loading'

// 类型导出
export type {
  ThemeVariables
} from './utils/ssr-theme'

export type {
  MotionProviderProps,
  SSRMotionDivProps,
  SSRAnimatePresenceProps
} from './components/motion'

export type {
  ThemeProviderProps,
  ThemeToggleProps
} from './components/theme'