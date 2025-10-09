/**
 * ⚡ 动画令牌系统
 *
 * 基于Framer Motion的动画配置
 * 统一的动画时长、缓动函数和预设
 */

// 动画时长
export const durations = {
  instant: 0,
  fast: 100,
  normal: 200,
  slow: 300,
  pageTransition: 300,
  pageLoad: 500,
  complex: 500,
  elaborate: 800,
  quickLoop: 1000,
  slowLoop: 2000,
  micro: 150,
  hover: 200,
  tap: 100,
} as const

// 缓动函数
export const easings = {
  linear: [0, 0, 1, 1] as const,
  easeIn: [0.4, 0, 1, 1] as const,
  easeOut: [0, 0, 0.2, 1] as const,
  easeInOut: [0.4, 0, 0.2, 1] as const,
  gentle: [0.25, 0.1, 0.25, 1] as const,
  smooth: [0.25, 0.46, 0.45, 0.94] as const,
  bouncy: [0.68, -0.55, 0.265, 1.55] as const,
  springy: [0.175, 0.885, 0.32, 1.275] as const,
  anticipate: [0.6, 0.05, 0.1, 1] as const,
  bounce: [0.8, 1.5, 0.75, 0.9] as const,
  elastic: [0.68, -0.3, 0.32, 1.3] as const,
} as const

// 弹簧配置
export const springs = {
  gentle: {
    stiffness: 100,
    damping: 10,
    mass: 1,
  },
  normal: {
    stiffness: 200,
    damping: 15,
    mass: 1,
  },
  bouncy: {
    stiffness: 300,
    damping: 20,
    mass: 1,
  },
  stiff: {
    stiffness: 400,
    damping: 25,
    mass: 1,
  },
  natural: {
    stiffness: 260,
    damping: 20,
    mass: 1,
  },
} as const

// 动画预设
export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: durations.normal, ease: easings.easeOut },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: durations.normal, ease: easings.easeOut },
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: durations.normal, ease: easings.easeOut },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: durations.normal, ease: easings.easeOut },
  },
  bounceIn: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { opacity: 1, scale: 1 },
    transition: {
      duration: durations.complex,
      ease: easings.bouncy,
      type: 'spring',
      ...springs.bouncy,
    },
  },
} as const

// 统一导出
export const animationTokens = {
  durations,
  easings,
  springs,
  animations,
} as const

// 类型定义
export type Durations = typeof durations
export type Easings = typeof easings
export type Springs = typeof springs
export type Animations = typeof animations
export type AnimationTokens = typeof animationTokens
