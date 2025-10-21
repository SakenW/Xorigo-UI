/**
 * SSR动画专用入口
 *
 * 专门为动画系统提供SSR支持的组件和工具
 */

// 动画核心工具
export {
  MotionProvider,
  useMotion,
  useSSRSafeAnimation
} from './components/motion'

// 动画组件
export {
  SSRMotionDiv,
  SSRAnimatePresence,
  LazyMotion,
  createLazyMotionComponent
} from './components/motion'

// 重新导出Framer Motion的核心功能（可选）
export { motion, AnimatePresence } from 'framer-motion'
export type { MotionProps } from 'framer-motion'

// 类型导出
export type {
  MotionProviderProps,
  SSRMotionDivProps,
  SSRAnimatePresenceProps
} from './components/motion'