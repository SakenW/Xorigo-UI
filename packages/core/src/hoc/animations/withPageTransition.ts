/**
 * @fileoverview withPageTransition HOC - 页面转场动画高阶组件
 * @description 为路由页面提供转场动画功能
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { HOC, ComponentType } from '../types'
import { AnimationVariants, AnimationConfig } from '../types'

/**
 * 页面转场配置
 */
export interface PageTransitionConfig {
  /**
   * 进入动画配置
   */
  enter?: AnimationVariants

  /**
   * 退出动画配置
   */
  exit?: AnimationVariants

  /**
   * 初始状态
   */
  initial?: AnimationVariants

  /**
   * 过渡配置
   */
  transition?: AnimationConfig

  /**
   * 转场延迟
   */
  delay?: number

  /**
   * 离开延迟
   */
  exitDelay?: number

  /**
   * 转场持续时间
   */
  duration?: number

  /**
   * 缓动函数
   */
  easing?: string | number[]

  /**
   * 是否在首次加载时跳过动画
   */
  skipInitial?: boolean

  /**
   * 转场完成回调
   */
  onTransitionComplete?: (direction: 'enter' | 'exit') => void
}

/**
 * 页面状态
 */
export interface PageState {
  isTransitioning: boolean
  direction: 'enter' | 'exit' | 'idle'
  isVisible: boolean
  phase: 'exiting' | 'entering' | 'visible' | 'hidden'
}

/**
 * 页面转场上下文
 */
export interface PageTransitionContextValue {
  /**
   * 页面状态
   */
  pageState: PageState

  /**
   * 页面转场控制方法
   */
  transitionIn: () => void
  transitionOut: () => void
  transitionBoth: () => void

  /**
   * 检查是否在转场中
   */
  isTransitioning: () => boolean

  /**
   * 获取当前转场方向
   */
  getDirection: () => PageState['direction']

  /**
   * 重置页面状态
   */
  reset: () => void

  /**
   * 强制进入动画
   */
  forceEnter: () => void
}

/**
 * 默认页面转场配置
 */
const DEFAULT_PAGE_TRANSITION: PageTransitionConfig = {
  initial: { opacity: 0, x: '100%' },
  enter: { opacity: 1, x: '0%', transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, x: '-100%', transition: { duration: 0.3, ease: 'easeIn' } },
  skipInitial: true,
}

/**
 * 生成转场样式
 */
function generateTransitionStyles(
  variants: AnimationVariants,
  config?: AnimationConfig
): React.CSSProperties {
  const styles: React.CSSProperties = {}

  // 基础属性
  if (variants.opacity !== undefined) {
    styles.opacity = variants.opacity
  }
  if (variants.scale !== undefined) {
    styles.transform = `scale(${variants.scale})`
  }
  if (variants.x !== undefined) {
    styles.transform = `translateX(${variants.x})`
  }
  if (variants.y !== undefined) {
    styles.transform = `translateY(${variants.y})`
  }
  if (variants.rotate !== undefined) {
    styles.transform = `rotate(${variants.rotate}deg)`
  }

  // 过渡配置
  if (config) {
    const duration = typeof config.duration === 'number' ? `${config.duration}s` : config.duration
    const easing = Array.isArray(config.easing)
      ? `cubic-bezier(${config.easing.join(',')})`
      : typeof config.easing === 'string'
      ? config.easing
      : 'ease'

    styles.transition = `all ${duration || '0.3s'} ${easing}`

    if (config.delay) {
      styles.transitionDelay = typeof config.delay === 'number' ? `${config.delay}s` : config.delay
    }
  }

  return styles
}

/**
 * withPageTransition HOC - 提供页面转场动画功能
 *
 * @param config 页面转场配置
 * @returns HOC函数
 *
 * @example
 * ```tsx
 * const PageComponent = withPageTransition({
 *   initial: { opacity: 0, x: '100%' },
 *   enter: { opacity: 1, x: '0%', transition: { duration: 0.5 } },
 *   exit: { opacity: 0, x: '-100%', transition: { duration: 0.3 } },
 *   skipInitial: true
 * })(BasePage)
 * ```
 */
export function withPageTransition<T extends Record<string, any> = {}>(
  config: PageTransitionConfig = {}
): HOC<T, T & PageTransitionContextValue> {
  const {
    initial = DEFAULT_PAGE_TRANSITION.initial,
    enter = DEFAULT_PAGE_TRANSITION.enter,
    exit = DEFAULT_PAGE_TRANSITION.exit,
    transition = DEFAULT_PAGE_TRANSITION.transition,
    delay = 0,
    exitDelay = 0,
    duration,
    easing,
    skipInitial = DEFAULT_PAGE_TRANSITION.skipInitial,
    onTransitionComplete,
  } = config

  const displayName = `withPageTransition(${Component.displayName || Component.name || 'Component'})`

  const PageTransitionComponent = React.forwardRef<any, T & PageTransitionContextValue>(
    (props, ref) => {
      // 页面状态
      const [pageState, setPageState] = useState<PageState>({
        isTransitioning: false,
        direction: 'idle',
        isVisible: !skipInitial,
        phase: !skipInitial ? 'visible' : 'hidden',
      })

      // refs
      const elementRef = useRef<HTMLElement>(null)
      const isMountedRef = useRef(false)

      // 合并过渡配置
      const mergedTransition = {
        ...transition,
        ...(duration && { duration }),
        ...(easing && { easing }),
      }

      // 进入动画
      const transitionIn = useCallback(() => {
        const element = elementRef.current
        if (!element) return

        setPageState(prev => ({
          ...prev,
          isTransitioning: true,
          direction: 'enter',
          phase: 'entering',
          isVisible: true,
        }))

        // 应用初始样式
        const initialStyles = generateTransitionStyles(initial, mergedTransition)
        Object.assign(element.style, initialStyles)

        // 延迟进入动画
        const enterTimer = setTimeout(() => {
          // 应用进入样式
          const enterStyles = generateTransitionStyles(enter, mergedTransition)
          Object.assign(element.style, enterStyles)

          // 触发重排以确保动画生效
          element.offsetHeight

          // 完成进入动画
          setTimeout(() => {
            setPageState(prev => ({
              ...prev,
              isTransitioning: false,
              direction: 'idle',
              phase: 'visible',
            }))

            if (onTransitionComplete) {
              onTransitionComplete('enter')
            }
          }, (mergedTransition.duration as number) * 1000 || 500)
        }, delay)

        return () => clearTimeout(enterTimer)
      }, [initial, enter, mergedTransition, delay, onTransitionComplete])

      // 退出动画
      const transitionOut = useCallback(() => {
        const element = elementRef.current
        if (!element) return

        setPageState(prev => ({
          ...prev,
          isTransitioning: true,
          direction: 'exit',
          phase: 'exiting',
        }))

        // 延迟退出动画
        const exitTimer = setTimeout(() => {
          // 应用退出样式
          const exitStyles = generateTransitionStyles(exit, mergedTransition)
          Object.assign(element.style, exitStyles)

          // 完成退出动画
          setTimeout(() => {
            setPageState(prev => ({
              ...prev,
              isTransitioning: false,
              direction: 'idle',
              phase: 'hidden',
              isVisible: false,
            }))

            if (onTransitionComplete) {
              onTransitionComplete('exit')
            }
          }, (mergedTransition.duration as number) * 1000 || 300)
        }, exitDelay)

        return () => clearTimeout(exitTimer)
      }, [exit, mergedTransition, exitDelay, onTransitionComplete])

      // 转场（进入+退出）
      const transitionBoth = useCallback(() => {
        // 先退出当前页面
        transitionOut()

        // 然后进入新页面
        setTimeout(() => {
          transitionIn()
        }, exitDelay + (mergedTransition.duration as number) * 1000 || 300)
      }, [transitionIn, transitionOut, exitDelay, mergedTransition.duration])

      // 强制进入
      const forceEnter = useCallback(() => {
        if (!pageState.isVisible) {
          transitionIn()
        }
      }, [pageState.isVisible, transitionIn])

      // 重置
      const reset = useCallback(() => {
        setPageState({
          isTransitioning: false,
          direction: 'idle',
          isVisible: !skipInitial,
          phase: !skipInitial ? 'visible' : 'hidden',
        })
      }, [skipInitial])

      // 检查是否在转场中
      const isTransitioning = useCallback(() => {
        return pageState.isTransitioning
      }, [pageState.isTransitioning])

      // 获取转场方向
      const getDirection = useCallback(() => {
        return pageState.direction
      }, [pageState.direction])

      // 初始化页面
      useEffect(() => {
        if (!isMountedRef.current) {
          isMountedRef.current = true
          if (!skipInitial) {
            transitionIn()
          }
        }
      }, [skipInitial, transitionIn])

      // 组件卸载时清理
      useEffect(() => {
        return () => {
          isMountedRef.current = false
        }
      }, [])

      // 传递给组件的增强props
      const enhancedProps = {
        ...props,
        ref: (node: HTMLElement) => {
          if (typeof ref === 'function') {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
          elementRef.current = node
        },
        pageState,
        transitionIn,
        transitionOut,
        transitionBoth,
        isTransitioning,
        getDirection,
        reset,
        forceEnter,
        style: {
          ...props.style,
          ...(pageState.phase === 'hidden' && { display: 'none' }),
        },
      }

      return <Component {...enhancedProps} />
    }
  )

  PageTransitionComponent.displayName = displayName

  return PageTransitionComponent
}

// 便捷导出
export const WithPageTransition = withPageTransition

// 预设页面转场配置
export const withSlidePageTransition = (
  direction: 'left' | 'right' | 'up' | 'down' = 'right'
) => {
  const transforms = {
    left: { x: '-100%' },
    right: { x: '100%' },
    up: { y: '100%' },
    down: { y: '100%' },
  }

  return withPageTransition({
    initial: { opacity: 0, ...transforms[direction] },
    enter: { opacity: 1, x: 0, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, ...transforms[direction], transition: { duration: 0.3 } },
  })
}

export const withFadePageTransition = () =>
  withPageTransition({
    initial: { opacity: 0 },
    enter: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  })

export const withScalePageTransition = () =>
  withPageTransition({
    initial: { opacity: 0, scale: 0.8 },
    enter: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, scale: 1.2, transition: { duration: 0.3 } },
  })

export const withRotatePageTransition = () =>
  withPageTransition({
    initial: { opacity: 0, rotateY: '-90deg' },
    enter: { opacity: 1, rotateY: '0deg', transition: { duration: 0.5 } },
    exit: { opacity: 0, rotateY: '90deg', transition: { duration: 0.3 } },
  })

export default withPageTransition
