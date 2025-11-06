/**
 * @fileoverview withAnimate HOC - 基础动画高阶组件
 * @description 为组件提供基础动画功能，支持CSS动画和Framer Motion集成
 */

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { HOC, ComponentType } from '../types'
import { AnimationVariants, AnimationConfig } from '../types'

/**
 * 动画状态
 */
export interface AnimationState {
  isAnimating: boolean
  isVisible: boolean
  currentVariant: string
  animationProgress: number
}

/**
 * 动画上下文
 */
export interface AnimationContextValue {
  /**
   * 动画状态
   */
  animationState: AnimationState

  /**
   * 动画控制方法
   */
  animate: (variant: string, config?: AnimationConfig) => void
  enter: () => void
  exit: () => void
  toggle: () => void
  reset: () => void

  /**
   * 动画变体
   */
  variants: Record<string, AnimationVariants>

  /**
   * 获取当前变体样式
   */
  getCurrentVariant: () => AnimationVariants | undefined

  /**
   * 检查动画是否完成
   */
  isAnimationComplete: () => boolean
}

/**
 * 默认动画变体
 */
const DEFAULT_VARIANTS: Record<string, AnimationVariants> = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  enter: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -20,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
      ease: 'easeIn',
    },
  },
}

/**
 * withAnimate HOC - 提供基础动画功能
 *
 * @param config 动画配置
 * @returns HOC函数
 *
 * @example
 * ```tsx
 * const AnimatedComponent = withAnimate({
 *   variants: {
 *     hidden: { opacity: 0, y: 20 },
 *     visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
 *   },
 *   initial: 'hidden',
 *   animate: 'visible'
 * })(BaseComponent)
 * ```
 */
export function withAnimate<T extends Record<string, any> = {}>(
  config: {
    variants?: Record<string, AnimationVariants>
    initial?: string
    animate?: string
    transition?: AnimationConfig
  } = {}
): HOC<T, T & AnimationContextValue> {
  return function(Component: ComponentType<T>) {
    const {
      variants = DEFAULT_VARIANTS,
      initial = 'hidden',
      animate = 'visible',
      transition,
    } = config

    const displayName = `withAnimate(${Component.displayName || Component.name || 'Component'})`

    const AnimateComponent = React.forwardRef<any, T & AnimationContextValue>((props, ref) => {
      // 动画状态
      const [animationState, setAnimationState] = useState<AnimationState>({
        isAnimating: false,
        isVisible: animate !== 'hidden',
        currentVariant: animate,
        animationProgress: 0,
      })

      // refs
      const elementRef = useRef<HTMLElement>(null)
      const animationFrameRef = useRef<number | null>(null)

      // 动画控制方法
      const animateTo = useMemo(() => {
        return (variant: string, customTransition?: AnimationConfig) => {
          if (!variants[variant]) {
            console.warn(`Animation variant "${variant}" not found`)
            return
          }

          setAnimationState(prev => ({
            ...prev,
            isAnimating: true,
            currentVariant: variant,
          }))

          const element = elementRef.current
          if (!element) return

          // 应用CSS动画
          const animationVariant = variants[variant]
          const transitionConfig = customTransition || transition || animationVariant.transition

          // 设置CSS变量
          Object.entries(animationVariant).forEach(([key, value]) => {
            if (key !== 'transition') {
              element.style.setProperty(`--${key}`, String(value))
            }
          })

          // 应用CSS类或直接设置样式
          if (animationVariant.opacity !== undefined) {
            element.style.opacity = animationVariant.opacity
          }
          if (animationVariant.scale !== undefined) {
            element.style.transform = `scale(${animationVariant.scale})`
          }
          if (animationVariant.x !== undefined) {
            element.style.transform = `translateX(${animationVariant.x}px)`
          }
          if (animationVariant.y !== undefined) {
            element.style.transform = `translateY(${animationVariant.y}px)`
          }

          // 更新状态
          setTimeout(() => {
            setAnimationState(prev => ({
              ...prev,
              isAnimating: false,
              isVisible: variant !== 'hidden',
            }))
          }, (transitionConfig?.duration as number) || 300)
        }
      }, [variants, transition])

      // 进入动画
      const enter = useMemo(() => {
        return () => animateTo('enter')
      }, [animateTo])

      // 退出动画
      const exit = useMemo(() => {
        return () => animateTo('exit')
      }, [animateTo])

      // 切换动画
      const toggle = useMemo(() => {
        return () => {
          if (animationState.currentVariant === 'hidden') {
            enter()
          } else {
            exit()
          }
        }
      }, [animationState.currentVariant, enter, exit])

      // 重置动画
      const reset = useMemo(() => {
        return () => {
          animateTo(initial)
        }
      }, [animateTo, initial])

      // 获取当前变体
      const getCurrentVariant = useMemo(() => {
        return () => variants[animationState.currentVariant]
      }, [animationState.currentVariant, variants])

      // 检查动画是否完成
      const isAnimationComplete = useMemo(() => {
        return () => !animationState.isAnimating
      }, [animationState.isAnimating])

      // 初始化动画
      useEffect(() => {
        if (initial) {
          animateTo(initial)
        }
      }, []) // 仅在组件挂载时执行

      // 清理动画帧
      useEffect(() => {
        return () => {
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
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
        animationState,
        animate: animateTo,
        enter,
        exit,
        toggle,
        reset,
        variants,
        getCurrentVariant,
        isAnimationComplete,
      }

      return <Component {...enhancedProps} />
    })

    AnimateComponent.displayName = displayName

    return AnimateComponent
  }
}

// 便捷导出
export const WithAnimate = withAnimate()

// 预设动画配置
export const withFadeIn = (config?: { duration?: number }) =>
  withAnimate({
    variants: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: config?.duration || 0.3 } },
    },
  })

export const withSlideIn = (config?: { direction?: 'up' | 'down' | 'left' | 'right'; duration?: number }) => {
  const { direction = 'up', duration = 0.3 } = config || {}

  const transforms = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: -20 },
    right: { x: 20 },
  }

  return withAnimate({
    variants: {
      hidden: { opacity: 0, ...transforms[direction] },
      visible: { opacity: 1, x: 0, y: 0, transition: { duration } },
    },
  })
}

export const withScale = (config?: { scale?: number; duration?: number }) =>
  withAnimate({
    variants: {
      hidden: { scale: 0.8, opacity: 0 },
      visible: { scale: config?.scale || 1, opacity: 1, transition: { duration: config?.duration || 0.3 } },
      hover: { scale: (config?.scale || 1) * 1.1, transition: { duration: 0.2 } },
    },
  })

export const withBounce = () =>
  withAnimate({
    variants: {
      hidden: { scale: 0.3, opacity: 0 },
      visible: {
        scale: 1,
        opacity: 1,
        transition: {
          type: 'spring',
          stiffness: 400,
          damping: 10,
        },
      },
    },
  })

export const withSpin = () =>
  withAnimate({
    variants: {
      paused: { rotate: 0 },
      spinning: {
        rotate: 360,
        transition: {
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        },
      },
    },
  })

export default withAnimate
