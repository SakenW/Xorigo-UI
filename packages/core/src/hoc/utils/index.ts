/**
 * @fileoverview 实用工具HOC模块统一导出
 * @description 提供所有实用工具高阶组件的统一导出点
 */

export { default as withClickOutside, WithClickOutside } from './withClickOutside'
export type { ClickOutsideConfig } from './withClickOutside'

export { default as withPortal, WithPortal, withModalPortal, withTooltipPortal, withNotificationPortal } from './withPortal'
export type { PortalConfig, PortalContextValue } from './withPortal'

export { default as withResizeObserver, WithResizeObserver, withDebouncedResize, withResponsiveResize } from './withResizeObserver'
export type { ResizeObserverConfig, ResizeObserverContextValue, ResizeInfo } from './withResizeObserver'

export { default as withIntersectionObserver, WithIntersectionObserver, withLazyLoad, withVisibilityObserver, withScrollReveal } from './withIntersectionObserver'
export type { IntersectionObserverConfig, IntersectionObserverContextValue, IntersectionInfo } from './withIntersectionObserver'

export { default as withMediaQuery, WithMediaQuery, withResponsive, withMobileQuery, withTabletQuery, withDarkModeQuery, withReducedMotionQuery, BREAKPOINTS } from './withMediaQuery'
export type { MediaQueryConfig, MediaQueryContextValue, MediaQueryInfo } from './withMediaQuery'

export { default as withDebounce, WithDebounce, withQuickDebounce, withMediumDebounce, withSlowDebounce } from './withDebounce'
export type { DebounceConfig, DebounceContextValue } from './withDebounce'

export { default as withThrottle, WithThrottle, withFastThrottle, withMediumThrottle, withSlowThrottle } from './withThrottle'
export type { ThrottleConfig, ThrottleContextValue } from './withThrottle'
