import React from 'react'
import { AnimatePresence as FramerAnimatePresence, AnimatePresenceProps } from 'framer-motion'
import { useMotion } from './motion-provider'

/**
 * SSR安全的AnimatePresence组件属性
 */
export interface SSRAnimatePresenceProps extends Omit<AnimatePresenceProps, 'children'> {
  children: React.ReactNode
  /**
   * 强制启用动画（忽略全局设置）
   */
  forceAnimation?: boolean
  /**
   * 动画禁用时的fallback渲染方式
   */
  fallbackMode?: 'visible' | 'hidden'
}

/**
 * SSR安全的AnimatePresence组件
 *
 * 处理组件进入/退出动画，在SSR环境下提供安全的降级方案
 *
 * @example
 * ```tsx
 * <SSRAnimatePresence>
 *   {isVisible && (
 *     <SSRMotionDiv
 *       initial={{ opacity: 0 }}
 *       animate={{ opacity: 1 }}
 *       exit={{ opacity: 0 }}
 *     >
 *       <Content />
 *     </SSRMotionDiv>
 *   )}
 * </SSRAnimatePresence>
 * ```
 */
export const SSRAnimatePresence: React.FC<SSRAnimatePresenceProps> = ({
  children,
  forceAnimation = false,
  fallbackMode = 'visible',
  ...framerProps
}) => {
  const { isMotionEnabled } = useMotion()
  const shouldAnimate = forceAnimation || isMotionEnabled

  // 如果禁用动画，直接渲染children
  if (!shouldAnimate) {
    return <>{children}</>
  }

  // 启用动画时使用AnimatePresence
  return (
    <FramerAnimatePresence {...framerProps}>
      {children}
    </FramerAnimatePresence>
  )
}

SSRAnimatePresence.displayName = 'SSRAnimatePresence'