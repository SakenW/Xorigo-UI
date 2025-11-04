import React from 'react'
import { motion, MotionProps } from 'framer-motion'
import { useMotion, useSSRSafeAnimation } from './motion-provider'

/**
 * SSRMotionDiv 组件属性
 * 扩展自标准的div属性和Framer Motion属性
 */
export interface SSRMotionDivProps extends MotionProps {
  children: React.ReactNode
  className?: string
  /**
   * 动画未启用时的静态样式
   */
  fallbackStyle?: React.CSSProperties
  /**
   * 强制启用动画（忽略全局设置）
   */
  forceAnimation?: boolean
  /**
   * 自定义动画禁用时的最终状态
   */
  finalState?: any
}

/**
 * SSR安全的Motion Div组件
 *
 * 在SSR环境下渲染为静态div，在客户端根据MotionProvider配置启用动画
 *
 * @example
 * ```tsx
 * <SSRMotionDiv
 *   initial={{ opacity: 0, y: 20 }}
 *   animate={{ opacity: 1, y: 0 }}
 *   transition={{ duration: 0.3 }}
 *   className="card"
 * >
 *   <CardContent />
 * </SSRMotionDiv>
 * ```
 */
export const SSRMotionDiv: React.FC<SSRMotionDivProps> = ({
  children,
  className,
  fallbackStyle,
  forceAnimation = false,
  finalState,
  ...motionProps
}) => {
  const { isMotionEnabled } = useMotion()

  // 确定是否启用动画
  const shouldAnimate = forceAnimation || isMotionEnabled

  // 获取动画配置
  const animationConfig = useSSRSafeAnimation(shouldAnimate, finalState)

  // 如果禁用动画，渲染静态div
  if (!shouldAnimate) {
    return (
      <div
        className={className}
        style={{
          ...fallbackStyle,
          ...animationConfig.animate
        }}
      >
        {children}
      </div>
    )
  }

  // 启用动画时使用motion.div
  return (
    <motion.div
      className={className}
      style={fallbackStyle}
      {...motionProps}
      {...animationConfig}
    >
      {children}
    </motion.div>
  )
}

SSRMotionDiv.displayName = 'SSRMotionDiv'