/**
 * Xorigo UI 动画系统架构 - Framer Motion 12 深度集成
 *
 * 基于七轴主题系统的完整动画解决方案
 * 支持可访问性、性能优化和主题感知动画
 */

import type {
  Variants,
  Transition,
  AnimationControls,
  TargetAndTransition,
  MotionValue,
  PanInfo,
  TransformProperties
} from 'framer-motion'
import type { ThemeRecipe } from '../system'
import { motionVariants, animationDuration, animationEasing, springConfig } from '../foundations/motion-curves'

// =============================================================================
// 动画系统核心类型定义
// =============================================================================

export interface AnimationConfig {
  // 基础动画属性
  duration?: number | string
  easing?: string
  delay?: number

  // Framer Motion 高级属性
  type?: 'tween' | 'spring' | 'keyframes' | 'inertia'
  stiffness?: number
  damping?: number
  mass?: number
  velocity?: number

  // 重复和方向
  repeat?: number | boolean
  repeatType?: 'loop' | 'reverse' | 'mirror'
  direction?: 'normal' | 'reverse' | 'alternate'

  // 性能和优化
  willChange?: boolean
  layout?: boolean
  layoutAnimation?: boolean
}

export interface MotionAxisConfig {
  // 七轴 motion 轴配置
  intensity: 'subtle' | 'standard' | 'expressive'
  complexity: 'simple' | 'moderate' | 'complex'
  responsiveness: 'immediate' | 'fast' | 'normal' | 'slow'

  // 动画策略
  strategy: 'functional' | 'decorative' | 'feedback' | 'navigation'
  priority: 'critical' | 'important' | 'normal' | 'low'

  // 可访问性
  prefersReducedMotion?: boolean
  respectMotionPreference?: boolean
  safeToAnimate?: boolean
}

export interface ThemeAwareAnimation extends AnimationConfig {
  // 主题感知动画
  themeAxis?: MotionAxisConfig
  themeRecipe?: ThemeRecipe

  // 响应式动画
  responsive?: {
    mobile?: AnimationConfig
    tablet?: AnimationConfig
    desktop?: AnimationConfig
  }

  // 状态感知动画
  stateAware?: {
    hover?: AnimationConfig
    focus?: AnimationConfig
    active?: AnimationConfig
    disabled?: AnimationConfig
  }
}

// =============================================================================
// 动画变体系统
// =============================================================================

export interface MotionVariants<T = Record<string, TargetAndTransition>> {
  // 基础状态变体
  initial?: keyof T
  animate?: keyof T
  exit?: keyof T
  whileHover?: keyof T
  whileTap?: keyof T
  whileFocus?: keyof T
  whileInView?: keyof T

  // 自定义变体
  variants?: T
}

// 预定义动画变体类型
export type PresetVariant =
  | 'fadeIn'
  | 'fadeOut'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'scaleIn'
  | 'scaleOut'
  | 'bounce'
  | 'elastic'
  | 'flip'
  | 'rotate'
  | 'stagger'
  | 'layout'
  | 'spring'
  | 'smooth'

export interface PresetAnimationConfig {
  variant: PresetVariant
  intensity?: 'subtle' | 'standard' | 'expressive'
  custom?: Partial<AnimationConfig>
}

// =============================================================================
// 动画上下文系统
// =============================================================================

export interface AnimationContext {
  // 全局动画设置
  globalConfig: {
    reducedMotion: boolean
    enableAnimations: boolean
    performanceMode: 'high' | 'balanced' | 'low'
    debugMode: boolean
  }

  // 主题感知设置
  themeAware: {
    currentMotionIntensity: MotionAxisConfig['intensity']
    respectUserPreferences: boolean
    adaptiveEasing: boolean
  }

  // 动画状态管理
  animationStates: Map<string, {
    isAnimating: boolean
    progress: MotionValue<number>
    controls: AnimationControls
  }>

  // 性能监控
  performanceMetrics: {
    frameRate: number
    animationCount: number
    memoryUsage: number
  }
}

// =============================================================================
// 动画系统核心类
// =============================================================================

export class XorigoAnimationSystem {
  private static instance: XorigoAnimationSystem
  private context: AnimationContext
  private animationRegistry: Map<string, Variants>
  private performanceObserver: PerformanceObserver | null = null

  private constructor() {
    this.context = this.initializeContext()
    this.animationRegistry = new Map()
    this.initializePerformanceObserver()
  }

  public static getInstance(): XorigoAnimationSystem {
    if (!XorigoAnimationSystem.instance) {
      XorigoAnimationSystem.instance = new XorigoAnimationSystem()
    }
    return XorigoAnimationSystem.instance
  }

  private initializeContext(): AnimationContext {
    return {
      globalConfig: {
        reducedMotion: this.checkReducedMotion(),
        enableAnimations: true,
        performanceMode: 'balanced',
        debugMode: false,
      },
      themeAware: {
        currentMotionIntensity: 'standard',
        respectUserPreferences: true,
        adaptiveEasing: true,
      },
      animationStates: new Map(),
      performanceMetrics: {
        frameRate: 60,
        animationCount: 0,
        memoryUsage: 0,
      },
    }
  }

  private initializePerformanceObserver(): void {
    if (typeof PerformanceObserver !== 'undefined') {
      this.performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach(entry => {
          if (entry.entryType === 'measure') {
            this.updatePerformanceMetrics(entry)
          }
        })
      })
      this.performanceObserver.observe({ entryTypes: ['measure'] })
    }
  }

  private checkReducedMotion(): boolean {
    if (typeof window === 'undefined') return false

    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  private updatePerformanceMetrics(entry: PerformanceEntry): void {
    // 更新性能指标
    const duration = entry.duration
    if (duration > 16) { // 超过一帧时间
      this.context.performanceMetrics.frameRate = Math.max(
        30,
        1000 / duration
      )
    }
  }

  // =============================================================================
  // 公共 API 方法
  // =============================================================================

  /**
   * 创建主题感知的动画配置
   */
  public createAnimationConfig(
    baseConfig: AnimationConfig,
    themeAxis?: MotionAxisConfig,
    themeRecipe?: ThemeRecipe
  ): ThemeAwareAnimation {
    const { intensity = 'standard' } = themeAxis || {}
    const motionVariant = motionVariants[intensity]

    // 应用主题轴配置
    const duration = baseConfig.duration ||
      this.parseDuration(motionVariant.duration.normal)
    const easing = baseConfig.easing ||
      motionVariant.easing.classic

    return {
      ...baseConfig,
      duration,
      easing,
      themeAxis,
      themeRecipe,
      willChange: baseConfig.willChange ?? false,
      layout: baseConfig.layout ?? false,
    }
  }

  /**
   * 创建预设动画变体
   */
  public createPresetVariants(
    preset: PresetVariant,
    intensity: MotionAxisConfig['intensity'] = 'standard'
  ): Variants {
    const config = this.getAnimationPreset(preset, intensity)

    switch (preset) {
      case 'fadeIn':
        return this.createFadeInVariants(config)
      case 'slideUp':
        return this.createSlideUpVariants(config)
      case 'scaleIn':
        return this.createScaleInVariants(config)
      case 'bounce':
        return this.createBounceVariants(config)
      case 'spring':
        return this.createSpringVariants(config)
      case 'stagger':
        return this.createStaggerVariants(config)
      default:
        return this.createBasicVariants(config)
    }
  }

  /**
   * 注册自定义动画变体
   */
  public registerVariants(
    name: string,
    variants: Variants,
    metadata?: {
      category?: string
      description?: string
      accessibility?: string
    }
  ): void {
    this.animationRegistry.set(name, {
      ...variants,
      // 添加元数据用于调试和文档
      _metadata: metadata
    } as any)
  }

  /**
   * 获取已注册的动画变体
   */
  public getVariants(name: string): Variants | undefined {
    return this.animationRegistry.get(name)
  }

  /**
   * 创建响应式动画配置
   */
  public createResponsiveAnimation(
    configs: {
      mobile?: AnimationConfig
      tablet?: AnimationConfig
      desktop?: AnimationConfig
    }
  ): ThemeAwareAnimation {
    const breakpoints = {
      mobile: '(max-width: 640px)',
      tablet: '(min-width: 641px) and (max-width: 1024px)',
      desktop: '(min-width: 1025px)'
    }

    return {
      responsive: configs,
      // 默认使用桌面配置
      ...configs.desktop,
    }
  }

  /**
   * 创建可访问性感知动画
   */
  public createAccessibleAnimation(
    config: AnimationConfig,
    reducedMotionConfig?: AnimationConfig
  ): ThemeAwareAnimation {
    return {
      ...config,
      themeAxis: {
        intensity: 'subtle',
        complexity: 'simple',
        responsiveness: 'fast',
        strategy: 'functional',
        priority: 'normal',
        prefersReducedMotion: this.context.globalConfig.reducedMotion,
        respectMotionPreference: true,
        safeToAnimate: true,
      }
    }
  }

  // =============================================================================
  // 预设动画变体创建器
  // =============================================================================

  private getAnimationPreset(
    preset: PresetVariant,
    intensity: MotionAxisConfig['intensity']
  ): AnimationConfig {
    const motionVariant = motionVariants[intensity]

    const basePresets: Record<PresetVariant, AnimationConfig> = {
      fadeIn: {
        duration: this.parseDuration(motionVariant.duration.fast),
        easing: motionVariant.easing.soft,
      },
      fadeOut: {
        duration: this.parseDuration(motionVariant.duration.fast),
        easing: motionVariant.easing.soft,
      },
      slideUp: {
        duration: this.parseDuration(motionVariant.duration.normal),
        easing: motionVariant.easing.classic,
      },
      slideDown: {
        duration: this.parseDuration(motionVariant.duration.normal),
        easing: motionVariant.easing.classic,
      },
      slideLeft: {
        duration: this.parseDuration(motionVariant.duration.normal),
        easing: motionVariant.easing.classic,
      },
      slideRight: {
        duration: this.parseDuration(motionVariant.duration.normal),
        easing: motionVariant.easing.classic,
      },
      scaleIn: {
        duration: this.parseDuration(motionVariant.duration.fast),
        easing: motionVariant.easing.soft,
      },
      scaleOut: {
        duration: this.parseDuration(motionVariant.duration.fast),
        easing: motionVariant.easing.soft,
      },
      bounce: {
        duration: this.parseDuration(motionVariant.duration.slow),
        type: 'spring',
        ...springConfig.bouncy,
      },
      elastic: {
        duration: this.parseDuration(motionVariant.duration.slow),
        type: 'spring',
        ...springConfig.bouncy,
      },
      flip: {
        duration: this.parseDuration(motionVariant.duration.normal),
        easing: motionVariant.easing.classic,
      },
      rotate: {
        duration: this.parseDuration(motionVariant.duration.normal),
        easing: motionVariant.easing.classic,
      },
      stagger: {
        duration: this.parseDuration(motionVariant.duration.normal),
        easing: motionVariant.easing.classic,
      },
      layout: {
        duration: this.parseDuration(motionVariant.duration.normal),
        easing: motionVariant.easing.soft,
        layout: true,
      },
      spring: {
        duration: this.parseDuration(motionVariant.duration.normal),
        type: 'spring',
        ...springConfig.gentle,
      },
      smooth: {
        duration: this.parseDuration(motionVariant.duration.normal),
        easing: motionVariant.easing.soft,
      },
    }

    return basePresets[preset]
  }

  private createFadeInVariants(config: AnimationConfig): Variants {
    return {
      hidden: {
        opacity: 0,
        transition: config
      },
      visible: {
        opacity: 1,
        transition: config
      }
    }
  }

  private createSlideUpVariants(config: AnimationConfig): Variants {
    return {
      hidden: {
        opacity: 0,
        y: 50,
        transition: config
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: config
      }
    }
  }

  private createScaleInVariants(config: AnimationConfig): Variants {
    return {
      hidden: {
        opacity: 0,
        scale: 0.8,
        transition: config
      },
      visible: {
        opacity: 1,
        scale: 1,
        transition: config
      }
    }
  }

  private createBounceVariants(config: AnimationConfig): Variants {
    return {
      hidden: {
        opacity: 0,
        scale: 0.3,
        transition: config
      },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          ...config,
          type: 'spring',
          ...springConfig.bouncy,
        }
      }
    }
  }

  private createSpringVariants(config: AnimationConfig): Variants {
    return {
      hidden: {
        opacity: 0,
        scale: 0.9,
        transition: config
      },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          ...config,
          type: 'spring',
          ...springConfig.gentle,
        }
      }
    }
  }

  private createStaggerVariants(config: AnimationConfig): Variants {
    return {
      hidden: {
        opacity: 0,
        y: 30,
        transition: config
      },
      visible: (i: number = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
          ...config,
          delay: i * 0.1,
        }
      })
    }
  }

  private createBasicVariants(config: AnimationConfig): Variants {
    return {
      hidden: {
        opacity: 0,
        transition: config
      },
      visible: {
        opacity: 1,
        transition: config
      }
    }
  }

  // =============================================================================
  // 工具方法
  // =============================================================================

  private parseDuration(duration: string): number {
    return parseInt(duration.replace('ms', ''))
  }

  /**
   * 获取动画系统上下文
   */
  public getContext(): AnimationContext {
    return { ...this.context }
  }

  /**
   * 更新全局动画配置
   */
  public updateGlobalConfig(updates: Partial<AnimationContext['globalConfig']>): void {
    this.context.globalConfig = {
      ...this.context.globalConfig,
      ...updates,
    }
  }

  /**
   * 检查是否应该启用动画
   */
  public shouldAnimate(priority?: MotionAxisConfig['priority']): boolean {
    const { globalConfig } = this.context

    if (!globalConfig.enableAnimations) return false
    if (globalConfig.reducedMotion && priority !== 'critical') return false
    if (globalConfig.performanceMode === 'low' && priority !== 'critical') return false

    return true
  }

  /**
   * 获取性能建议
   */
  public getPerformanceRecommendations(): string[] {
    const recommendations: string[] = []
    const { performanceMetrics, globalConfig } = this.context

    if (performanceMetrics.frameRate < 45) {
      recommendations.push('帧率较低，建议减少同时运行的动画数量')
    }

    if (performanceMetrics.animationCount > 10 && globalConfig.performanceMode !== 'high') {
      recommendations.push('动画数量较多，建议启用性能模式')
    }

    if (globalConfig.reducedMotion) {
      recommendations.push('用户偏好减少动画，使用简化动画')
    }

    return recommendations
  }
}

// =============================================================================
// 导出单例实例和工具函数
// =============================================================================

export const animationSystem = XorigoAnimationSystem.getInstance()

/**
 * 便捷函数：创建主题感知动画配置
 */
export function createAnimationConfig(
  baseConfig: AnimationConfig,
  themeAxis?: MotionAxisConfig,
  themeRecipe?: ThemeRecipe
): ThemeAwareAnimation {
  return animationSystem.createAnimationConfig(baseConfig, themeAxis, themeRecipe)
}

/**
 * 便捷函数：创建预设动画变体
 */
export function createPresetVariants(
  preset: PresetVariant,
  intensity: MotionAxisConfig['intensity'] = 'standard'
): Variants {
  return animationSystem.createPresetVariants(preset, intensity)
}

/**
 * 便捷函数：创建可访问性感知动画
 */
export function createAccessibleAnimation(
  config: AnimationConfig,
  reducedMotionConfig?: AnimationConfig
): ThemeAwareAnimation {
  return animationSystem.createAccessibleAnimation(config, reducedMotionConfig)
}

// =============================================================================
// 类型导出
// =============================================================================

export type {
  AnimationConfig,
  MotionAxisConfig,
  ThemeAwareAnimation,
  MotionVariants,
  PresetVariant,
  PresetAnimationConfig,
  AnimationContext
}