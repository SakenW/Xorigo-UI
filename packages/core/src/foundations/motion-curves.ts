/**
 * Xorigo UI 动画曲线系统 - 基于七轴主题系统 v1.4 SSOT
 *
 * 从 src-archived-20251022-023941/tokens/design-tokens.ts 迁移并适配七轴系统
 */

// =============================================================================
// 基础动画时长系统
// =============================================================================

export const animationDuration = {
  75: '75ms',     // 瞬时响应
  100: '100ms',   // 快速反馈
  150: '150ms',   // 标准快速
  200: '200ms',   // 标准动画
  300: '300ms',   // 中等动画
  500: '500ms',   // 慢速动画
  700: '700ms',   // 较慢动画
  1000: '1000ms', // 长动画
} as const

// =============================================================================
// 基础缓动函数系统
// =============================================================================

export const animationEasing = {
  // 基础缓动
  linear: 'linear',
  ease: 'ease',
  'ease-in': 'ease-in',
  'ease-out': 'ease-out',
  'ease-in-out': 'ease-in-out',

  // Material Design 缓动曲线
  'ease-quad': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',     // 二次方缓动
  'ease-cubic': 'cubic-bezier(0.215, 0.61, 0.355, 1)',       // 立方缓动
  'ease-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',            // 指数缓动
  'ease-back': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',   // 回弹缓动

  // 自定义高级缓动
  'ease-smooth': 'cubic-bezier(0.4, 0.0, 0.2, 1)',          // 平滑缓动
  'ease-swift': 'cubic-bezier(0.4, 0.0, 0.2, 1)',            // 快速缓动
  'ease-gentle': 'cubic-bezier(0.25, 0.1, 0.25, 1)',         // 温和缓动
  'ease-bouncy': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',  // 弹跳缓动
} as const

// =============================================================================
// 动画轴变体 - 用于七轴 motion 轴
// =============================================================================

export const motionVariants = {
  // 微妙动效 (subtle) - 最小化动画干扰
  subtle: {
    // 微妙时长 - 更短的动画时间
    duration: {
      instant: '50ms',     // 瞬时
      fast: '100ms',       // 快速
      normal: '150ms',     // 正常
      slow: '200ms',       // 慢速
    },
    // 微妙缓动 - 更柔和的曲线
    easing: {
      classic: 'cubic-bezier(0.2, 0.0, 0.0, 1.0)',    // 经典线性
      soft: 'cubic-bezier(0.25, 0.1, 0.25, 1.0)',      // 温和缓动
    },
    // 微妙预设
    presets: {
      'fade-subtle': 'fadeIn 0.1s ease-out',
      'slide-subtle': 'slideInUp 0.15s ease-out',
      'scale-subtle': 'scaleIn 0.1s ease-out',
    }
  },

  // 标准动效 (standard) - 平衡的动画体验
  standard: {
    // 标准时长
    duration: {
      instant: '75ms',      // 瞬时
      fast: '150ms',        // 快速
      normal: '200ms',      // 正常
      slow: '300ms',        // 慢速
    },
    // 标准缓动
    easing: {
      classic: 'cubic-bezier(0.2, 0.0, 0.0, 1.0)',    // 经典线性
      soft: 'cubic-bezier(0.25, 0.1, 0.25, 1.0)',      // 温和缓动
    },
    // 标准预设
    presets: {
      'fade-standard': 'fadeIn 0.2s ease-out',
      'slide-standard': 'slideInUp 0.3s ease-out',
      'scale-standard': 'scaleIn 0.2s ease-out',
    }
  },

  // 表现力动效 (expressive) - 丰富的动画表现
  expressive: {
    // 表现力时长 - 更长的动画时间
    duration: {
      instant: '100ms',     // 瞬时
      fast: '200ms',       // 快速
      normal: '300ms',     // 正常
      slow: '500ms',       // 慢速
    },
    // 表现力缓动 - 更有张力的曲线
    easing: {
      classic: 'cubic-bezier(0.2, 0.0, 0.0, 1.0)',    // 经典线性
      soft: 'cubic-bezier(0.25, 0.1, 0.25, 1.0)',      // 温和缓动
    },
    // 表现力预设
    presets: {
      'fade-expressive': 'fadeIn 0.3s ease-out',
      'slide-expressive': 'slideInUp 0.5s ease-out',
      'scale-expressive': 'scaleIn 0.3s ease-out',
      'bounce-expressive': 'bounceIn 0.6s ease-out',
    }
  },
} as const

// =============================================================================
// 动画预设系统
// =============================================================================

export const animationPresets = {
  // 基础动画
  'fade-in': 'fadeIn 0.2s ease-out',
  'fade-out': 'fadeOut 0.2s ease-out',
  'slide-in-up': 'slideInUp 0.3s ease-out',
  'slide-in-down': 'slideInDown 0.3s ease-out',
  'slide-in-left': 'slideInLeft 0.3s ease-out',
  'slide-in-right': 'slideInRight 0.3s ease-out',
  'scale-in': 'scaleIn 0.2s ease-out',
  'scale-out': 'scaleOut 0.2s ease-out',

  // 高级动画
  'bounce-in': 'bounceIn 0.6s ease-out',
  'elastic-in': 'elasticIn 0.8s ease-out',
  'flip-in': 'flipIn 0.4s ease-out',
  'rotate-in': 'rotateIn 0.3s ease-out',

  // 交互反馈
  'hover-lift': 'liftUp 0.2s ease-out',
  'press-scale': 'scaleDown 0.1s ease-out',
  'focus-ring': 'focusRing 0.3s ease-out',
  'loading-spin': 'spin 1s linear infinite',
} as const

// =============================================================================
// Spring 物理动画系统
// =============================================================================

export const springConfig = {
  // Spring 预设
  gentle: {
    tension: 280,
    friction: 60,
    mass: 1,
  },
  bouncy: {
    tension: 400,
    friction: 20,
    mass: 1,
  },
  stiff: {
    tension: 600,
    friction: 80,
    mass: 1,
  },
  slow: {
    tension: 200,
    friction: 40,
    mass: 2,
  },
} as const

// =============================================================================
// 动画曲线生成器
// =============================================================================

export class MotionCurveGenerator {
  // 根据 motion 轴生成时长配置
  static generateDurationConfig(
    intensity: 'subtle' | 'standard' | 'expressive'
  ) {
    return motionVariants[intensity].duration
  }

  // 根据 motion 轴生成缓动配置
  static generateEasingConfig(
    intensity: 'subtle' | 'standard' | 'expressive'
  ) {
    return motionVariants[intensity].easing
  }

  // 生成完整的 CSS 变量定义
  static generateCSSVariables(
    intensity: 'subtle' | 'standard' | 'expressive' = 'standard',
    curve: 'classic' | 'soft' | 'spring' = 'classic'
  ): string {
    const config = motionVariants[intensity]
    const cssVars = []

    // 生成时长变量
    Object.entries(config.duration).forEach(([key, value]) => {
      cssVars.push(`  --motion-duration-${key}: ${value};`)
    })

    // 生成缓动变量
    Object.entries(config.easing).forEach(([key, value]) => {
      cssVars.push(`  --motion-easing-${key}: ${value};`)
    })

    // 生成基础时长变量
    Object.entries(animationDuration).forEach(([key, value]) => {
      cssVars.push(`  --animation-duration-${key}: ${value};`)
    })

    // 生成基础缓动变量
    Object.entries(animationEasing).forEach(([key, value]) => {
      cssVars.push(`  --animation-easing-${key}: ${value};`)
    })

    // 生成 Spring 配置变量
    Object.entries(springConfig).forEach(([key, config]) => {
      cssVars.push(`  --spring-${key}-tension: ${config.tension};`)
      cssVars.push(`  --spring-${key}-friction: ${config.friction};`)
      cssVars.push(`  --spring-${key}-mass: ${config.mass};`)
    })

    return `:root {\n${cssVars.join('\n')}\n}`
  }

  // 生成自定义 Spring 曲线
  static generateSpringCurve(
    tension: number,
    friction: number,
    mass: number = 1
  ): string {
    return `spring(${tension}, ${friction}, ${mass})`
  }

  // 根据用例推荐动画配置
  static recommendMotionConfig(
    useCase: 'feedback' | 'navigation' | 'loading' | 'decorative'
  ): {
    intensity: 'subtle' | 'standard' | 'expressive'
    duration: string
    easing: string
  } {
    const recommendations = {
      feedback: {
        intensity: 'subtle' as const,
        duration: '100ms',
        easing: 'ease-out'
      },
      navigation: {
        intensity: 'standard' as const,
        duration: '200ms',
        easing: 'ease-out'
      },
      loading: {
        intensity: 'standard' as const,
        duration: '1000ms',
        easing: 'linear'
      },
      decorative: {
        intensity: 'expressive' as const,
        duration: '300ms',
        easing: 'ease-out'
      }
    }

    return recommendations[useCase]
  }

  // 计算动画性能评分
  static calculatePerformanceScore(
    duration: string,
    easing: string,
    complexity: 'simple' | 'moderate' | 'complex'
  ): {
    score: number
    recommendation: string
  } {
    const durationMs = parseInt(duration)
    let score = 100

    // 时长评分
    if (durationMs > 500) score -= 20
    if (durationMs > 1000) score -= 30

    // 缓动评分
    if (easing.includes('cubic-bezier')) score += 10

    // 复杂度评分
    if (complexity === 'moderate') score -= 10
    if (complexity === 'complex') score -= 25

    let recommendation = '动画性能良好'
    if (score < 60) recommendation = '建议优化动画性能'
    if (score < 40) recommendation = '动画过于复杂，建议简化'

    return { score: Math.max(0, score), recommendation }
  }
}

// =============================================================================
// 类型定义
// =============================================================================

export type MotionVariant = typeof motionVariants
export type MotionIntensity = keyof typeof motionVariants
export type MotionCurve = keyof typeof motionVariants.standard.easing
export type AnimationDuration = typeof animationDuration
export type AnimationEasing = typeof animationEasing
export type AnimationPreset = keyof typeof animationPresets
export type SpringPreset = keyof typeof springConfig

// 保持向后兼容的简化导出
export const motionCurves = {
  classic: 'cubic-bezier(0.2,0.0,0.0,1.0)',
  soft: 'cubic-bezier(0.25,0.1,0.25,1.0)',
  spring: 'spring(280, 60, 1)' // 默认 gentle spring
} as const;

// =============================================================================
// 导出默认配置
// =============================================================================

export const defaultMotionConfig = {
  ...motionVariants,
  duration: animationDuration,
  easing: animationEasing,
  presets: animationPresets,
  springs: springConfig,
  generator: new MotionCurveGenerator(),
  cssVariables: MotionCurveGenerator.generateCSSVariables(),
}
