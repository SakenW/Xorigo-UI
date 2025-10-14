/**
 * Utilities 层 - 工具组件
 * 提供常用的辅助UI组件
 */

// 核心工具组件
export * from './Badge'
export * from './Avatar'
export * from './Divider'

// 技术基元（保留兼容性）
export * from './ConfigProvider'

// ============================================================================
// Portal 传送门组件
// ============================================================================
export {
  Portal,
  BodyPortal,
  ModalPortal,
  TooltipPortal,
  NotificationPortal,
  ConditionalPortal,
  DelayedPortal,
  type PortalProps,
  type BodyPortalProps,
  type ModalPortalProps,
  type TooltipPortalProps,
  type NotificationPortalProps,
  type ConditionalPortalProps,
  type DelayedPortalProps,
} from './Portal'

// ============================================================================
// FocusTrap 焦点陷阱组件
// ============================================================================
export {
  FocusTrap,
  AutoFocusTrap,
  ConditionalFocusTrap,
  type FocusTrapProps,
  type AutoFocusTrapProps,
  type ConditionalFocusTrapProps,
} from './FocusTrap'

// ============================================================================
// FocusScope 焦点范围组件
// ============================================================================
export {
  FocusScope,
  AutoFocusScope,
  LoopFocusScope,
  ControlledFocusScope,
  type FocusScopeProps,
  type AutoFocusScopeProps,
  type LoopFocusScopeProps,
  type ControlledFocusScopeProps,
} from './FocusScope'

// ============================================================================
// DismissableLayer 可关闭层组件
// ============================================================================
export {
  DismissableLayer,
  DismissableLayerGroup,
  SimpleDismissableLayer,
  ModalDismissableLayer,
  TooltipDismissableLayer,
  type DismissableLayerProps,
  type DismissableLayerGroupProps,
  type SimpleDismissableLayerProps,
  type ModalDismissableLayerProps,
  type TooltipDismissableLayerProps,
} from './DismissableLayer'

// ============================================================================
// ScrollLock 滚动锁定组件
// ============================================================================
export {
  ScrollLock,
  BodyScrollLock,
  ConditionalScrollLock,
  useScrollPositionRestore,
  type ScrollLockProps,
  type BodyScrollLockProps,
  type ConditionalScrollLockProps,
} from './ScrollLock'

// ============================================================================
// VisuallyHidden 视觉隐藏组件
// ============================================================================
export {
  VisuallyHidden,
  SkipLink,
  ScreenReaderOnly,
  FocusableHidden,
  AnimatedHidden,
  Description,
  ErrorMessage,
  StatusText,
  LiveRegion,
  type VisuallyHiddenProps,
  type SkipLinkProps,
  type ScreenReaderOnlyProps,
  type FocusableHiddenProps,
  type AnimatedHiddenProps,
  type DescriptionProps,
  type ErrorMessageProps,
  type StatusTextProps,
  type LiveRegionProps,
} from './VisuallyHidden'

// ============================================================================
// ResizeObserver 尺寸观察器组件
// ============================================================================
export {
  ResizeObserverComponent as ResizeObserver,
  useResizeObserver,
  useElementSize,
  useContainerQuery,
  useResponsive,
  AdvancedResizeObserver,
  type ResizeObserverProps,
  type AdvancedResizeObserverProps,
} from './ResizeObserver'

// ============================================================================
// IntersectionObserver 交叉观察器组件
// ============================================================================
export {
  IntersectionObserverComponent as IntersectionObserver,
  useIntersectionObserver,
  useVisibility,
  useInViewport,
  useLazyLoad,
  useInfiniteScroll,
  useViewProgress,
  AdvancedIntersectionObserver,
  type IntersectionObserverProps,
  type AdvancedIntersectionObserverProps,
} from './IntersectionObserver'

// ============================================================================
// SSRBoundary SSR边界组件
// ============================================================================
export {
  SSRBoundary,
  ClientOnly,
  ServerOnly,
  DelayRender,
  ConditionalRender,
  EnvironmentDetection,
  HydrationDetector,
  type SSRBoundaryProps,
  type ClientOnlyProps,
  type ServerOnlyProps,
  type DelayRenderProps,
  type ConditionalRenderProps,
  type EnvironmentDetectionProps,
  type HydrationDetectorProps,
} from './SSRBoundary'