/**
 * Xorigo UI 动画变体库 - 预定义动画变体集合
 *
 * 基于七轴主题系统的完整动画变体库
 * 包含基础、交互、状态、过渡等各种动画变体
 */

import type { Variants, TargetAndTransition, Transition } from 'framer-motion'
import type { PresetVariant, MotionAxisConfig } from './animation-system'
import { animationSystem } from './animation-system'

// =============================================================================
// 基础动画变体
// =============================================================================

/**
 * 淡入淡出动画变体
 */
const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
}

/**
 * 滑动动画变体
 */
const slideVariants: Variants = {
  hidden: (direction: 'up' | 'down' | 'left' | 'right' = 'up') => {
    const directionMap = {
      up: { y: 50 },
      down: { y: -50 },
      left: { x: 50 },
      right: { x: -50 }
    }
    return {
      opacity: 0,
      ...directionMap[direction]
    }
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0
  },
  exit: (direction: 'up' | 'down' | 'left' | 'right' = 'up') => {
    const directionMap = {
      up: { y: -50 },
      down: { y: 50 },
      left: { x: -50 },
      right: { x: 50 }
    }
    return {
      opacity: 0,
      ...directionMap[direction]
    }
  }
}

/**
 * 缩放动画变体
 */
const scaleVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    scale: 1
  },
  exit: {
    opacity: 0,
    scale: 0.8
  }
}

/**
 * 旋转动画变体
 */
const rotateVariants: Variants = {
  hidden: {
    opacity: 0,
    rotate: -180
  },
  visible: {
    opacity: 1,
    rotate: 0
  },
  exit: {
    opacity: 0,
    rotate: 180
  }
}

// =============================================================================
// 弹跳和弹性动画变体
// =============================================================================

/**
 * 弹跳动画变体
 */
const bounceVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.3,
    y: 100
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 10,
      stiffness: 100,
      mass: 1
    }
  },
  exit: {
    opacity: 0,
    scale: 0.3,
    y: -100
  }
}

/**
 * 弹性动画变体
 */
const elasticVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 300,
      mass: 3
    }
  },
  exit: {
    opacity: 0,
    scale: 0
  }
}

/**
 * 翻转动画变体
 */
const flipVariants: Variants = {
  hidden: {
    opacity: 0,
    rotateY: -90,
    transformPerspective: 1000
  },
  visible: {
    opacity: 1,
    rotateY: 0,
    transformPerspective: 1000
  },
  exit: {
    opacity: 0,
    rotateY: 90,
    transformPerspective: 1000
  }
}

// =============================================================================
// 交互状态变体
// =============================================================================

/**
 * 悬停状态变体
 */
const hoverVariants: Variants = {
  rest: {
    scale: 1,
    transition: {
      duration: 0.2,
      ease: 'easeInOut'
    }
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: 'easeInOut'
    }
  }
}

/**
 * 点击状态变体
 */
const tapVariants: Variants = {
  rest: {
    scale: 1,
    transition: {
      duration: 0.1,
      ease: 'easeInOut'
    }
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
      ease: 'easeInOut'
    }
  }
}

/**
 * 焦点状态变体
 */
const focusVariants: Variants = {
  rest: {
    scale: 1,
    transition: {
      duration: 0.2,
      ease: 'easeInOut'
    }
  },
  focus: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: 'easeInOut'
    }
  }
}

/**
 * 激活状态变体
 */
const activeVariants: Variants = {
  rest: {
    scale: 1,
    transition: {
      duration: 0.1,
      ease: 'easeInOut'
    }
  },
  active: {
    scale: 0.98,
    transition: {
      duration: 0.1,
      ease: 'easeInOut'
    }
  }
}

// =============================================================================
// 高级动画变体
// =============================================================================

/**
 * 错位动画变体
 */
const staggerVariants: Variants = {
  container: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  },
  item: {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0
    }
  }
}

/**
 * 波纹动画变体
 */
const rippleVariants: Variants = {
  initial: {
    scale: 0,
    opacity: 1
  },
  animate: {
    scale: 4,
    opacity: 0
  }
}

/**
 * 脉冲动画变体
 */
const pulseVariants: Variants = {
  initial: {
    scale: 1,
    opacity: 1
  },
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}

/**
 * 摇摆动画变体
 */
const swingVariants: Variants = {
  rest: {
    rotate: 0
  },
  animate: {
    rotate: [0, 15, -15, 15, -15, 0],
    transition: {
      duration: 0.5,
      ease: 'easeInOut'
    }
  }
}

/**
 * 浮动动画变体
 */
const floatVariants: Variants = {
  initial: {
    y: 0
  },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}

// =============================================================================
// 列表和网格动画变体
// =============================================================================

/**
 * 列表项动画变体
 */
const listItemVariants: Variants = {
  hidden: (i: number) => ({
    opacity: 0,
    y: 50,
    transition: {
      delay: i * 0.1
    }
  }),
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      type: 'spring',
      damping: 25,
      stiffness: 100
    }
  })
}

/**
 * 网格项动画变体
 */
const gridItemVariants: Variants = {
  hidden: (i: number) => ({
    opacity: 0,
    scale: 0.8,
    transition: {
      delay: i * 0.05
    }
  }),
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.05,
      type: 'spring',
      damping: 20,
      stiffness: 300
    }
  })
}

// =============================================================================
// 布局动画变体
// =============================================================================

/**
 * 布局重排动画变体
 */
const layoutVariants: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      layout: true,
      duration: 0.3,
      ease: 'easeInOut'
    }
  }
}

/**
 * 高度动画变体
 */
const heightVariants: Variants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'easeInOut'
    }
  },
  expanded: {
    height: 'auto',
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeInOut'
    }
  }
}

/**
 * 宽度动画变体
 */
const widthVariants: Variants = {
  collapsed: {
    width: 0,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'easeInOut'
    }
  },
  expanded: {
    width: 'auto',
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeInOut'
    }
  }
}

// =============================================================================
// 状态指示动画变体
// =============================================================================

/**
 * 加载状态变体
 */
const loadingVariants: Variants = {
  initial: {
    rotate: 0
  },
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear'
    }
  }
}

/**
 * 成功状态变体
 */
const successVariants: Variants = {
  initial: {
    scale: 0,
    opacity: 0
  },
  animate: {
    scale: [0, 1.2, 1],
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
}

/**
 * 错误状态变体
 */
const errorVariants: Variants = {
  initial: {
    x: 0
  },
  animate: {
    x: [-10, 10, -10, 10, -10, 0],
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
}

/**
 * 警告状态变体
 */
const warningVariants: Variants = {
  initial: {
    scale: 1,
    opacity: 1
  },
  animate: {
    scale: [1, 1.1, 1],
    opacity: [1, 0.7, 1],
    transition: {
      duration: 0.8,
      repeat: 3,
      repeatDelay: 0.5
    }
  }
}

// =============================================================================
// 导航和菜单动画变体
// =============================================================================

/**
 * 菜单项动画变体
 */
const menuItemVariants: Variants = {
  initial: {
    opacity: 0,
    x: -20
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 100
    }
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.2
    }
  }
}

/**
 * 侧边栏动画变体
 */
const sidebarVariants: Variants = {
  hidden: {
    x: '-100%',
    transition: {
      duration: 0.3,
      ease: 'easeInOut'
    }
  },
  visible: {
    x: 0,
    transition: {
      duration: 0.3,
      ease: 'easeInOut'
    }
  }
}

/**
 * 下拉菜单动画变体
 */
const dropdownVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  }
}

// =============================================================================
// 模态框和弹窗动画变体
// =============================================================================

/**
 * 模态框背景动画变体
 */
const modalOverlayVariants: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  }
}

/**
 * 模态框内容动画变体
 */
const modalContentVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 50,
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  }
}

/**
 * 工具提示动画变体
 */
const tooltipVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.1,
      ease: 'easeOut'
    }
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.1,
      ease: 'easeOut'
    }
  }
}

// =============================================================================
// 变体库工具函数
// =============================================================================

/**
 * 创建主题感知变体
 */
export function createThemeAwareVariants(
  baseVariants: Variants,
  intensity: MotionAxisConfig['intensity'] = 'standard'
): Variants {
  const config = animationSystem.getAnimationPreset('fadeIn', intensity)

  // 应用主题感知的过渡配置
  const themeAwareTransition: Transition = {
    duration: config.duration as number / 1000,
    ease: config.easing,
  }

  // 递归应用主题过渡到所有状态
  const applyThemeTransition = (variants: any): Variants => {
    const result: any = {}

    for (const [key, value] of Object.entries(variants)) {
      if (typeof value === 'function') {
        result[key] = (...args: any[]) => {
          const animatedValue = value(...args)
          return {
            ...animatedValue,
            transition: themeAwareTransition
          }
        }
      } else {
        result[key] = {
          ...value,
          transition: themeAwareTransition
        }
      }
    }

    return result
  }

  return applyThemeTransition(baseVariants)
}

/**
 * 合并多个变体
 */
export function mergeVariants(...variants: Variants[]): Variants {
  return variants.reduce((merged, current) => ({
    ...merged,
    ...current
  }), {})
}

/**
 * 创建条件变体
 */
export function createConditionalVariants<T extends Record<string, any>>(
  condition: boolean,
  trueVariants: T,
  falseVariants: Partial<T> = {}
): T {
  return condition ? trueVariants : (falseVariants as T)
}

// 注册所有预设变体到动画系统
animationSystem.registerVariants('fade', fadeVariants, {
  category: 'basic',
  description: '淡入淡出动画',
  accessibility: '适合所有用户，对动效敏感用户友好'
})

animationSystem.registerVariants('slide', slideVariants, {
  category: 'basic',
  description: '滑动动画',
  accessibility: '适合所有用户，对动效敏感用户友好'
})

animationSystem.registerVariants('scale', scaleVariants, {
  category: 'basic',
  description: '缩放动画',
  accessibility: '适合所有用户，对动效敏感用户友好'
})

animationSystem.registerVariants('bounce', bounceVariants, {
  category: 'expressive',
  description: '弹跳动画',
  accessibility: '可能引起不适，建议提供关闭选项'
})

animationSystem.registerVariants('stagger', staggerVariants, {
  category: 'advanced',
  description: '错位动画',
  accessibility: '适合所有用户，可调节动画强度'
})

animationSystem.registerVariants('modal', {
  overlay: modalOverlayVariants,
  content: modalContentVariants
}, {
  category: 'modal',
  description: '模态框动画集合',
  accessibility: '提供焦点管理和键盘导航支持'
})

// =============================================================================
// 导出所有变体
// =============================================================================

export {
  fadeVariants as motionFadeVariants,
  slideVariants as motionSlideVariants,
  scaleVariants as motionScaleVariants,
  rotateVariants as motionRotateVariants,
  bounceVariants as motionBounceVariants,
  elasticVariants as motionElasticVariants,
  flipVariants as motionFlipVariants,
  hoverVariants as motionHoverVariants,
  tapVariants as motionTapVariants,
  focusVariants as motionFocusVariants,
  activeVariants as motionActiveVariants,
  staggerVariants as motionStaggerVariants,
  rippleVariants as motionRippleVariants,
  pulseVariants as motionPulseVariants,
  swingVariants as motionSwingVariants,
  floatVariants as motionFloatVariants,
  listItemVariants as motionListItemVariants,
  gridItemVariants as motionGridItemVariants,
  layoutVariants as motionLayoutVariants,
  heightVariants as motionHeightVariants,
  widthVariants as motionWidthVariants,
  loadingVariants as motionLoadingVariants,
  successVariants as motionSuccessVariants,
  errorVariants as motionErrorVariants,
  warningVariants as motionWarningVariants,
  menuItemVariants as motionMenuItemVariants,
  sidebarVariants as motionSidebarVariants,
  dropdownVariants as motionDropdownVariants,
  modalOverlayVariants as motionModalOverlayVariants,
  modalContentVariants as motionModalContentVariants,
  tooltipVariants as motionTooltipVariants
}