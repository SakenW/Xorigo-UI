/**
 * @fileoverview withTransition HOC - 过渡动画高阶组件
 * @description 为组件提供页面和元素过渡动画功能
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { HOC, ComponentType } from '../types'
import { AnimationVariants, AnimationConfig } from '../types'

/**
 * 过渡动画配置
 */
export interface TransitionConfig {
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
   * 延迟时间
   */
  delay?: number

  /**
   * 进入延迟
   */
  enterDelay?: number

  /**
   * 退出延迟
   */
  exitDelay?: number

  /**
   * 是否在组件挂载时自动进入
   */
  animateOnMount?: boolean

  /**
   * 是否在组件卸载时自动退出
   */
  animateOnUnmount?: boolean

  /**
   * 过渡完成回调
   */
  onEnterComplete?: () => void

  /**
   * 退出完成回调
   */
  onExitComplete?: () => void
}

/**
 * 过渡状态
 */
export interface TransitionState {
  isEntering: boolean
  isExiting: boolean
  isVisible: boolean
  phase: 'entering' | 'visible' | 'exiting' | 'hidden'
}

/**
 * 过渡上下文
 */
export interface TransitionContextValue {
  /**
   * 过渡状态
   */
  transitionState: TransitionState

  /**
   * 过渡控制方法
   */
  enter: () => void
  exit: () => void
  toggle: () => void

  /**
   * 检查是否在过渡中
   */
  isTransitioning: () => boolean

  /**
   * 获取过渡阶段
   */
  getPhase: () => TransitionState['phase']

  /**
   * 手动触发进入动画
   */
  triggerEnter: () => void

  /**
   * 手动触发退出动画
   */
  triggerExit: () => void
}

/**
 * 默认过渡动画配置
 */
const DEFAULT_TRANSITION_CONFIG: TransitionConfig = {
  initial: { opacity: 0, scale: 0.95 },
  enter: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: 'easeIn' } },
  animateOnMount: true,
  animateOnUnmount: true,
}

/**
 * CSS类生成器
 */
function generateTransitionStyles(variants: AnimationVariants, transition?: AnimationConfig): string {
  const styles: string[] = []
  const duration = (transition?.duration as number) || 0.3
  const easing = Array.isArray(transition?.easing)
    ? `cubic-bezier(${transition.easing.join(',')})`
    : typeof transition?.easing === 'string'
    ? transition.easing
    : 'ease'

  // 添加过渡属性
  styles.push(`transition: all ${duration}s ${easing}`)

  // 添加初始样式
  if (variants.opacity !== undefined) {
    styles.push(`opacity: ${variants.opacity}`)
  }
  if (variants.scale !== undefined) {
    styles.push(`transform: scale(${variants.scale})`)
  }
  if (variants.x !== undefined || variants.y !== undefined) {
    const x = variants.x || 0
    const y = variants.y || 0
    styles.push(`transform: translate(${x}px, ${y}px)`)
  }
  if (variants.rotate !== undefined) {
    styles.push(`transform: rotate(${variants.rotate}deg)`)
  }

  return styles.join('; ')
}

/**
 * withTransition HOC - 提供过渡动画功能
 *
 * @param config 过渡动画配置
 * @returns HOC函数
 *
 * @example
 * ```tsx
 * const Modal = withTransition({
 *   initial: { opacity: 0, scale: 0.9 },
 *   enter: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
 *   exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
 *   animateOnMount: true
 * })(BaseModal)
 * ```
 */
export function withTransition<T extends Record<string, any> = {}>(
  config: TransitionConfig = {}
): HOC<T, T & TransitionContextValue> {
  const {
    initial = DEFAULT_TRANSITION_CONFIG.initial,
    enter = DEFAULT_TRANSITION_CONFIG.enter,
    exit = DEFAULT_TRANSITION_CONFIG.exit,
    transition = DEFAULT_TRANSITION_CONFIG.transition,
    delay = 0,
    enterDelay = 0,
    exitDelay = 0,
    animateOnMount = DEFAULT_TRANSITION_CONFIG.animateOnMount,
    animateOnUnmount = DEFAULT_TRANSITION_CONFIG.animateOnUnmount,
    onEnterComplete,
    onExitComplete,
  } = config

  const displayName = `withTransition(${Component.displayName || Component.name || 'Component'})`

  const TransitionComponent = React.forwardRef<any, T & TransitionContextValue>((props, ref) => {
    // 过渡状态
    const [transitionState, setTransitionState] = useState<TransitionState>({
      isEntering: false,
      isExiting: false,
      isVisible: animateOnMount,
      phase: animateOnMount ? 'visible' : 'hidden',
    })

    // refs
    const elementRef = useRef<HTMLElement>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    // 进入动画
    const enter = useCallback(() => {
      const element = elementRef.current
      if (!element) return

      // 清除之前的定时器
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // 设置状态
      setTransitionState(prev => ({
        ...prev,
        isEntering: true,
        isVisible: true,
        phase: 'entering',
      }))

      // 应用初始样式
      const initialStyles = generateTransitionStyles(initial)
      element.style.cssText = initialStyles

      // 延迟进入
      const enterTimer = setTimeout(() => {
        // 应用进入样式
        const enterStyles = generateTransitionStyles(enter, transition)
        element.style.cssText = enterStyles

        // 触发重排以确保动画生效
        element.offsetHeight

        // 完成进入动画
        setTimeout(() => {
          setTransitionState(prev => ({
            ...prev,
            isEntering: false,
            phase: 'visible',
          }))

          if (onEnterComplete) {
            onEnterComplete()
          }
        }, (transition?.duration as number) * 1000 || 300)
      }, delay + enterDelay)

      timeoutRef.current = enterTimer
    }, [initial, enter, transition, delay, enterDelay, onEnterComplete])

    // 退出动画
    const exit = useCallback(() => {
      const element = elementRef.current
      if (!element) return

      // 清除之前的定时器
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // 设置状态
      setTransitionState(prev => ({
        ...prev,
        isExiting: true,
        phase: 'exiting',
      }))

      // 延迟退出
      const exitTimer = setTimeout(() => {
        // 应用退出样式
        const exitStyles = generateTransitionStyles(exit, transition)
        element.style.cssText = exitStyles

        // 完成退出动画
        setTimeout(() => {
          setTransitionState(prev => ({
            ...prev,
            isExiting: false,
            isVisible: false,
            phase: 'hidden',
          }))

          if (onExitComplete) {
            onExitComplete()
          }
        }, (transition?.duration as number) * 1000 || 300)
      }, exitDelay)

      timeoutRef.current = exitTimer
    }, [exit, transition, exitDelay, onExitComplete])

    // 切换动画
    const toggle = useCallback(() => {
      if (transitionState.isVisible) {
        exit()
      } else {
        enter()
      }
    }, [transitionState.isVisible, enter, exit])

    // 手动触发进入
    const triggerEnter = useCallback(() => {
      if (!transitionState.isVisible) {
        enter()
      }
    }, [transitionState.isVisible, enter])

    // 手动触发退出
    const triggerExit = useCallback(() => {
      if (transitionState.isVisible) {
        exit()
      }
    }, [transitionState.isVisible, exit])

    // 检查是否在过渡中
    const isTransitioning = useCallback(() => {
      return transitionState.isEntering || transitionState.isExiting
    }, [transitionState.isEntering, transitionState.isExiting])

    // 获取过渡阶段
    const getPhase = useCallback(() => {
      return transitionState.phase
    }, [transitionState.phase])

    // 初始化动画
    useEffect(() => {
      if (animateOnMount) {
        enter()
      }
    }, [animateOnMount, enter])

    // 组件卸载时动画
    useEffect(() => {
      return () => {
        if (animateOnUnmount) {
          exit()
        }
      }
    }, [animateOnUnmount, exit])

    // 清理资源
    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
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
      transitionState,
      enter,
      exit,
      toggle,
      isTransitioning,
      getPhase,
      triggerEnter,
      triggerExit,
      style: {
        ...props.style,
        ...(transitionState.phase === 'hidden' && { display: 'none' }),
      },
    }

    return <Component {...enhancedProps} />
  })

  TransitionComponent.displayName = displayName

  return TransitionComponent
}

// 便捷导出
export const WithTransition = withTransition

// 预设过渡配置
export const withSlideTransition = (direction: 'up' | 'down' | 'left' | 'right' = 'up') => {
  const transforms = {
    up: { y: '100%' },
    down: { y: '-100%' },
    left: { x: '-100%' },
    right: { x: '100%' },
  }

  return withTransition({
    initial: { opacity: 0, ...transforms[direction] },
    enter: { opacity: 1, x: 0, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, ...transforms[direction], transition: { duration: 0.2 } },
  })
}

export const withFadeTransition = (fadeDirection: 'in' | 'out' = 'in') =>
  withTransition({
    initial: { opacity: 0 },
    enter: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  })

export const withScaleTransition = () =>
  withTransition({
    initial: { opacity: 0, scale: 0.8 },
    enter: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  })

export default withTransition
