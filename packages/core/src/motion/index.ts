/**
 * SSR友好的动画组件系统
 *
 * 提供在SSR环境下安全工作的Framer Motion包装器和工具
 */

export {
  MotionProvider,
  useMotion,
  useSSRSafeAnimation
} from './motion-provider'

export {
  SSRMotionDiv
} from './ssr-motion-div'

export {
  SSRAnimatePresence
} from './ssr-animate-presence'

export {
  LazyMotion,
  createLazyMotionComponent
} from './lazy-motion'

// 重新导出Framer Motion的类型和常用工具（可选）
export type { MotionProps } from 'framer-motion'
export { motion, AnimatePresence } from 'framer-motion'