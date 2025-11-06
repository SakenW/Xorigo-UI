/**
 * @fileoverview HOC系统统一导出
 * @description Xorigo UI 高阶组件系统的统一导出入口
 * @version 1.0.0
 * @author Xorigo UI Team
 */

export * from './types'
export * from './core'
export * from './composers'
export * from './utils'
export * from './forms'
export * from './animations'

// ============================================================================
// 快捷导出
// ============================================================================

// 核心HOC快捷导入
export { withTheme as theme, WithTheme as Theme } from './core'
export { withVariant as variant, WithVariant as Variant } from './core'
export { withSize as size, WithSize as Size } from './core'
export { withState as state, WithState as State } from './core'
export { withValidation as validation, WithValidation as Validation } from './core'
export { withAccessibility as a11y, WithAccessibility as Accessibility } from './core'
export { withLoading as loading, WithLoading as Loading } from './core'
export { withErrorBoundary as errorBoundary, WithErrorBoundary as ErrorBoundary } from './core'

// 组合HOC快捷导入
export { compose as enhance } from './composers'
export { withMergeProps as mergeProps } from './composers'
export { withChain as chain } from './composers'
export { withDisplayName as displayName } from './composers'

// 实用工具快捷导入
export { withClickOutside as clickOutside } from './utils'
export { withPortal as portal } from './utils'
export { withResizeObserver as resizeObserver } from './utils'
export { withIntersectionObserver as intersectionObserver } from './utils'
export { withMediaQuery as mediaQuery } from './utils'
export { withDebounce as debounce } from './utils'
export { withThrottle as throttle } from './utils'

// 表单快捷导入
export { withForm as form } from './forms'
export { withField as field } from './forms'
export { withController as controller } from './forms'
export { withAsyncValidation as asyncValidation } from './forms'
export { withSubmit as submit } from './forms'

// 动画快捷导入
export { withAnimate as animate } from './animations'
export { withTransition as transition } from './animations'
export { withGestures as gestures } from './animations'
export { withPageTransition as pageTransition } from './animations'

// ============================================================================
// 预设组合配置
// ============================================================================

/**
 * 创建一个完整的表单组件
 * 包含：表单管理、字段增强、验证、提交处理
 */
export function createFormComponent<Props extends Record<string, any>>(
  component: React.ComponentType<Props>
) {
  return compose([
    withForm(),
    withField(),
    withValidation(),
    withSubmit(),
    withLoading(),
    withErrorBoundary(),
  ])(component)
}

/**
 * 创建一个完整的按钮组件
 * 包含：主题、变体、尺寸、状态、无障碍、加载、错误边界
 */
export function createButtonComponent<Props extends Record<string, any>>(
  component: React.ComponentType<Props>
) {
  return compose([
    withTheme(),
    withVariant(),
    withSize(),
    withState(),
    withAccessibility(),
    withLoading(),
    withErrorBoundary(),
  ])(component)
}

/**
 * 创建一个完整的输入框组件
 * 包含：表单、字段、控制器、验证、无障碍
 */
export function createInputComponent<Props extends Record<string, any>>(
  component: React.ComponentType<Props>
) {
  return compose([
    withForm(),
    withField(),
    withController(),
    withValidation(),
    withAccessibility(),
    withErrorBoundary(),
  ])(component)
}

/**
 * 创建一个动画容器组件
 * 包含：动画、转场、手势、错误边界
 */
export function createAnimatedComponent<Props extends Record<string, any>>(
  component: React.ComponentType<Props>
) {
  return compose([
    withAnimate(),
    withTransition(),
    withGestures(),
    withErrorBoundary(),
  ])(component)
}

/**
 * 创建一个响应式组件
 * 包含：媒体查询、尺寸监听、视口监听
 */
export function createResponsiveComponent<Props extends Record<string, any>>(
  component: React.ComponentType<Props>
) {
  return compose([
    withMediaQuery(),
    withResizeObserver(),
    withIntersectionObserver(),
    withErrorBoundary(),
  ])(component)
}

// ============================================================================
// 版本信息
// ============================================================================

export const HOC_SYSTEM_VERSION = '1.0.0'
export const HOC_SYSTEM_NAME = '@xorigo/hoc'

// ============================================================================
// 默认导出
// ============================================================================

const hocSystem = {
  // 核心HOC
  withTheme,
  withVariant,
  withSize,
  withState,
  withValidation,
  withAccessibility,
  withLoading,
  withErrorBoundary,

  // 组合HOC
  compose,
  withMergeProps,
  withChain,
  withDisplayName,

  // 实用工具
  withClickOutside,
  withPortal,
  withResizeObserver,
  withIntersectionObserver,
  withMediaQuery,
  withDebounce,
  withThrottle,

  // 表单
  withForm,
  withField,
  withController,
  withAsyncValidation,
  withSubmit,

  // 动画
  withAnimate,
  withTransition,
  withGestures,
  withPageTransition,

  // 快捷导出
  theme: withTheme,
  variant: withVariant,
  size: withSize,
  state: withState,
  validation: withValidation,
  a11y: withAccessibility,
  loading: withLoading,
  errorBoundary: withErrorBoundary,
  enhance: compose,
  mergeProps: withMergeProps,
  chain: withChain,
  displayName: withDisplayName,
  clickOutside: withClickOutside,
  portal: withPortal,
  resizeObserver: withResizeObserver,
  intersectionObserver: withIntersectionObserver,
  mediaQuery: withMediaQuery,
  debounce: withDebounce,
  throttle: withThrottle,
  form: withForm,
  field: withField,
  controller: withController,
  asyncValidation: withAsyncValidation,
  submit: withSubmit,
  animate: withAnimate,
  transition: withTransition,
  gestures: withGestures,
  pageTransition: withPageTransition,

  // 预设组合
  createFormComponent,
  createButtonComponent,
  createInputComponent,
  createAnimatedComponent,
  createResponsiveComponent,

  // 版本信息
  version: HOC_SYSTEM_VERSION,
  name: HOC_SYSTEM_NAME,
}

export default hocSystem
