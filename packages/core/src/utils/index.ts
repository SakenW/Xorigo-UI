/**
 * 工具函数导出
 */

// 核心工具函数
export * from './cn'

// 组件辅助工具
export * from './component-helpers'

// OKLCH 色彩引擎
export * from './color'

// Matrix 可访问性验证系统
export * from './matrix'

// 重新导出常用工具函数
export {
  cn,
  getSizeClasses,
  getVariantClasses,
  generateId,
  isValidChild,
  filterValidChildren,
  createCompoundComponent,
  createKeyboardHandler,
  createFocusHandler,
  debounce,
  throttle,
  isInViewport,
  scrollToElement,
  getElementBounds,
  isMobile,
  isTablet,
  isDesktop,
  getCurrentBreakpoint,
  createResponsiveStyles,
  createAsyncState,
  createStorage,
  formatFileSize,
  formatNumber,
  isValidEmail,
  isValidPhone,
  getUrlParams,
  setUrlParams
} from './component-helpers'
