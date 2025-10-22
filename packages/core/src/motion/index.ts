/**
 * Xorigo UI 动画系统 - Framer Motion 12 深度集成
 *
 * 完整的动画解决方案，包含：
 * - 动画系统架构
 * - 预定义动画变体库
 * - 主题系统集成
 * - 动画组件增强
 * - 实用工具函数
 * - 可访问性支持
 */

// =============================================================================
// 核心系统导出
// =============================================================================

export * from './animation-system'
export {
  XorigoAnimationSystem,
  animationSystem,
  createAnimationConfig,
  createPresetVariants,
  createAccessibleAnimation,
} from './animation-system'

export * from './variants'
export {
  // 基础动画变体
  fadeVariants,
  slideVariants,
  scaleVariants,
  rotateVariants,
  // 弹跳和弹性动画变体
  bounceVariants,
  elasticVariants,
  flipVariants,
  // 交互状态变体
  hoverVariants,
  tapVariants,
  focusVariants,
  activeVariants,
  // 高级动画变体
  staggerVariants,
  rippleVariants,
  pulseVariants,
  swingVariants,
  floatVariants,
  // 列表和网格动画变体
  listItemVariants,
  gridItemVariants,
  // 布局动画变体
  layoutVariants,
  heightVariants,
  widthVariants,
  // 状态指示动画变体
  loadingVariants,
  successVariants,
  errorVariants,
  warningVariants,
  // 导航和菜单动画变体
  menuItemVariants,
  sidebarVariants,
  dropdownVariants,
  // 模态框和弹窗动画变体
  modalOverlayVariants,
  modalContentVariants,
  tooltipVariants,
  // 工具函数
  createThemeAwareVariants,
  mergeVariants,
  createConditionalVariants,
} from './variants'

export * from './theme-integration'
export {
  // 主题提供者
  MotionThemeProvider,
  motionThemeProvider,
  // Hook
  useMotionTheme,
  // 便捷函数
  createThemeAnimation,
  createResponsiveThemeAnimation,
  getMotionThemeConfig,
  subscribeMotionTheme,
  // 类型
  ThemeMotionConfig,
} from './theme-integration'

export * from './components'
export {
  // 动画组件
  AnimatedDiv,
  AnimatedCard,
  AnimatedButton,
  AnimatedAlert,
  AnimatedBadge,
  AnimatedList,
  AnimatedPresence,
  // 类型
  AnimatedComponentProps,
  AnimatedDivProps,
  AnimatedCardProps,
  AnimatedButtonProps,
  AnimatedAlertProps,
  AnimatedBadgeProps,
  AnimatedListProps,
  AnimatedPresenceProps,
} from './components'

export * from './utils'
export {
  // 性能监控
  AnimationPerformanceMonitor,
  useAnimationPerformance,
  // 动画 Hook
  useThemeAnimation,
  useViewportAnimation,
  useStaggerAnimation,
  useAnimationOrchestrator,
  // 工具函数
  isElementInViewport,
  getAnimationBudget,
  createAnimationThrottle,
  createAnimationDebounce,
  supportsHardwareAcceleration,
  getOptimalAnimationProperties,
  // 类型
  PerformanceMetric,
  AnimationBudget,
} from './utils'

export * from './accessibility'
export {
  // 可访问性提供者
  AccessibilityAnimationProvider,
  accessibilityAnimationProvider,
  // 可访问性变体
  safeAnimationVariants,
  riskyAnimationVariants,
  // 便捷函数
  isAnimationAccessible,
  getAccessibleAnimation,
  getAccessibilityConfig,
  subscribeAccessibility,
  generateAccessibilityReport,
  // 类型
  AccessibilityConfig,
  AccessibilityReport,
} from './accessibility'

// =============================================================================
// 重新导出常用类型和接口
// =============================================================================

export type {
  // 动画系统类型
  AnimationConfig,
  ThemeAwareAnimation,
  MotionAxisConfig,
  MotionVariants,
  PresetVariant,
  PresetAnimationConfig,
  AnimationContext,

  // 主题感知类型
  ThemeMotionConfig,

  // 可访问性类型
  AccessibilityReport,

  // 性能类型
  PerformanceMetric,
  AnimationBudget,
} from './animation-system'

// =============================================================================
// 版本信息
// =============================================================================

export const MOTION_SYSTEM_VERSION = '1.0.0'
export const FRAMER_MOTION_VERSION = '^12.0.0'

export const MOTION_SYSTEM_INFO = {
  version: MOTION_SYSTEM_VERSION,
  framerMotionVersion: FRAMER_MOTION_VERSION,
  features: [
    'Seven-axis theme integration',
    'Accessibility-first design',
    'Performance optimization',
    'Responsive animations',
    'Component enhancement',
    'Animation orchestration',
    'Developer tools',
  ],
  compatibility: {
    react: '>=18.0.0',
    typescript: '>=5.0.0',
    browsers: ['Chrome >= 94', 'Firefox >= 90', 'Safari >= 14', 'Edge >= 94'],
  },
  standards: [
    'WCAG 2.1 AA',
    'WAI-ARIA 1.2',
    'Reduced Motion',
    'High Contrast',
  ],
}

// =============================================================================
// 快速开始示例
// =============================================================================

/**
 * 快速开始示例
 *
 * ```tsx
 * import { AnimatedCard, AnimatedButton, fadeVariants } from '@xorigo-ui/core/motion'
 *
 * function MyComponent() {
 *   return (
 *     <AnimatedCard animation="fade" variants={fadeVariants}>
 *       <AnimatedButton animation="tap">
 *         点击我
 *       </AnimatedButton>
 *     </AnimatedCard>
 *   )
 * }
 * ```
 *
 * 使用主题感知动画：
 * ```tsx
 * import { createThemeAnimation } from '@xorigo-ui/core/motion'
 *
 * const customAnimation = createThemeAnimation(
 *   { duration: 300, easing: 'ease-out' },
 *   { intensity: 'standard' }
 * )
 * ```
 *
 * 可访问性感知动画：
 * ```tsx
 * import { getAccessibleAnimation, isAnimationAccessible } from '@xorigo-ui/core/motion'
 *
 * const accessibleAnimation = getAccessibleAnimation(
 *   { duration: 200, easing: 'ease-out' },
 *   { intensity: 'subtle', respectReducedMotion: true }
 * )
 * ```
 */

export default {
  version: MOTION_SYSTEM_VERSION,
  info: MOTION_SYSTEM_INFO,
  animationSystem,
  motionThemeProvider,
  accessibilityAnimationProvider,
}