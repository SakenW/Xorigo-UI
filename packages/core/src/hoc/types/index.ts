/**
 * @fileoverview HOC类型系统定义
 * @description 为高阶组件系统提供完整的TypeScript类型支持
 */

import { ComponentType, ReactNode } from 'react'

// ============================================================================
// 基础类型定义
// ============================================================================

/**
 * HOC基础类型
 */
export type HOC<OriginalProps = any, EnhancedProps = OriginalProps> = (
  Component: ComponentType<OriginalProps>
) => ComponentType<EnhancedProps>

/**
 * 组件属性类型
 */
export type ComponentProps<T> = T extends ComponentType<infer P> ? P : never

/**
 * HOC链类型
 */
export type HOCChain<Props> = {
  [K in keyof Props]: Props[K]
}

/**
 * 可选属性标记
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * 必选属性标记
 */
export type Required<T, K extends keyof T> = T & Pick<T, K>

// ============================================================================
// 组件变体类型
// ============================================================================

/**
 * 变体类型定义
 */
export type Variant = 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost' | 'link'

/**
 * 尺寸类型定义
 */
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

/**
 * 主题模式类型
 */
export type ThemeMode = 'light' | 'dark' | 'system'

/**
 * 颜色类型定义
 */
export type ColorScheme =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral'

// ============================================================================
// 状态管理类型
// ============================================================================

/**
 * 组件状态定义
 */
export interface ComponentState {
  isLoading?: boolean
  isDisabled?: boolean
  isError?: boolean
  isFocused?: boolean
  isHovered?: boolean
  isActive?: boolean
  [key: string]: any
}

/**
 * 状态更新函数类型
 */
export type StateUpdater<T> = (prevState: T) => T

/**
 * 状态管理接口
 */
export interface StateManager<State> {
  state: State
  setState: (updater: StateUpdater<State>) => void
  resetState: () => void
}

// ============================================================================
// 表单相关类型
// ============================================================================

/**
 * 表单字段类型
 */
export interface FormField<T = any> {
  name: string
  value: T
  error?: string
  touched?: boolean
  isValid?: boolean
}

/**
 * 表单验证规则
 */
export interface ValidationRule<T = any> {
  required?: boolean | string
  minLength?: number | { value: number; message?: string }
  maxLength?: number | { value: number; message?: string }
  pattern?: RegExp | { value: RegExp; message?: string }
  custom?: (value: T) => boolean | string
  [key: string]: any
}

/**
 * 表单错误类型
 */
export interface FormErrors<T = Record<string, any>> {
  [fieldName: string]: string | undefined
}

/**
 * 表单触摸状态
 */
export interface FormTouched<T = Record<string, any>> {
  [fieldName: string]: boolean
}

/**
 * 表单提交处理器
 */
export interface FormSubmitHandler<Values> {
  (values: Values): Promise<void> | void
}

// ============================================================================
// 事件处理类型
// ============================================================================

/**
 * 点击事件处理器
 */
export interface ClickHandler {
  (event: MouseEvent | React.MouseEvent): void
}

/**
 * 键盘事件处理器
 */
export interface KeyboardHandler {
  (event: KeyboardEvent | React.KeyboardEvent): void
}

/**
 * 焦点事件处理器
 */
export interface FocusHandler {
  (event: FocusEvent | React.FocusEvent): void
}

/**
 * 变更事件处理器
 */
export interface ChangeHandler<T = any> {
  (value: T, event: Event | React.ChangeEvent): void
}

// ============================================================================
// DOM观察者类型
// ============================================================================

/**
 * Resize观察器配置
 */
export interface ResizeObserverConfig {
  onResize?: (entry: ResizeObserverEntry) => void
  onResizeEnd?: (entry: ResizeObserverEntry) => void
  debounceMs?: number
}

/**
 * Intersection观察器配置
 */
export interface IntersectionObserverConfig {
  threshold?: number | number[]
  rootMargin?: string
  onIntersect?: (entry: IntersectionObserverEntry) => void
  onEnter?: (entry: IntersectionObserverEntry) => void
  onExit?: (entry: IntersectionObserverEntry) => void
}

// ============================================================================
// 媒体查询类型
// ============================================================================

/**
 * 媒体查询配置
 */
export interface MediaQueryConfig {
  query: string
  onMatch?: () => void
  onUnmatch?: () => void
  debounceMs?: number
}

/**
 * 断点类型
 */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

/**
 * 设备类型
 */
export type DeviceType = 'mobile' | 'tablet' | 'desktop'

// ============================================================================
// 动画类型
// ============================================================================

/**
 * 动画变体类型
 */
export interface AnimationVariants {
  [key: string]: any
}

/**
 * 动画配置
 */
export interface AnimationConfig {
  duration?: number | string
  delay?: number | string
  easing?: string | number[]
  repeat?: number | 'infinite'
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse'
}

// ============================================================================
// HOC配置选项
// ============================================================================

/**
 * HOC基础配置
 */
export interface HOCOptions {
  displayName?: string
  enableMemo?: boolean
  enableRef?: boolean
  enableCleanup?: boolean
}

/**
 * 属性合并策略
 */
export type PropsMergeStrategy = 'override' | 'merge' | 'concatenate' | 'custom'

/**
 * 生命周期钩子
 */
export interface LifecycleHooks {
  onMount?: () => void | (() => void)
  onUnmount?: () => void
  onUpdate?: (prevProps: any, nextProps: any) => void | boolean
}

// ============================================================================
// 错误处理类型
// ============================================================================

/**
 * 错误边界配置
 */
export interface ErrorBoundaryConfig {
  fallback?: ComponentType<{ error: Error; retry: () => void }>
  onError?: (error: Error, errorInfo: any) => void
  onReset?: () => void
}

/**
 * 错误信息类型
 */
export interface ErrorInfo {
  componentStack: string
}

// ============================================================================
// 导出类型
// ============================================================================

export {
  ComponentType,
  ReactNode,
}
