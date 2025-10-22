/**
 * Xorigo UI 动画主题系统集成
 *
 * 将七轴主题系统与 Framer Motion 深度集成
 * 提供主题感知的动画配置和自动适配
 */

import React from 'react'
import type { ThemeRecipe } from '@/system'
import type { AnimationConfig, ThemeAwareAnimation, MotionAxisConfig } from './animation-system'
import { animationSystem } from './animation-system'
import { motionVariants, animationDuration, animationEasing } from '@/foundations/motion-curves'

// =============================================================================
// 主题感知动画配置接口
// =============================================================================

export interface ThemeMotionConfig {
  // 主题轴映射
  themeAxis: {
    mode: 'light' | 'dark' | 'auto'
    intensity: MotionAxisConfig['intensity']
    complexity: MotionAxisConfig['complexity']
    responsiveness: MotionAxisConfig['responsiveness']
  }

  // 动画主题变量
  variables: {
    duration: Record<string, number>
    easing: Record<string, string>
    spring: Record<string, { tension: number; friction: number; mass: number }>
    scale: Record<string, number>
    distance: Record<string, number>
    angle: Record<string, number>
  }

  // 响应式断点
  breakpoints: {
    mobile: number
    tablet: number
    desktop: number
  }

  // 可访问性设置
  accessibility: {
    reducedMotion: boolean
    respectUserPreferences: boolean
    safeAnimations: string[]
  }
}

// =============================================================================
// 动画主题提供者
// =============================================================================

export class MotionThemeProvider {
  private static instance: MotionThemeProvider
  private config: ThemeMotionConfig
  private observers: Set<(config: ThemeMotionConfig) => void> = new Set()

  private constructor() {
    this.config = this.initializeDefaultConfig()
    this.setupSystemListeners()
  }

  public static getInstance(): MotionThemeProvider {
    if (!MotionThemeProvider.instance) {
      MotionThemeProvider.instance = new MotionThemeProvider()
    }
    return MotionThemeProvider.instance
  }

  private initializeDefaultConfig(): ThemeMotionConfig {
    return {
      themeAxis: {
        mode: 'auto',
        intensity: 'standard',
        complexity: 'moderate',
        responsiveness: 'normal'
      },
      variables: {
        duration: {
          instant: 50,
          fast: 150,
          normal: 200,
          slow: 300,
          slower: 500,
        },
        easing: {
          linear: 'linear',
          ease: 'ease',
          easeIn: 'ease-in',
          easeOut: 'ease-out',
          easeInOut: 'ease-in-out',
          soft: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
          swift: 'cubic-bezier(0.4, 0, 0.2, 1)',
          gentle: 'cubic-bezier(0.2, 0, 0, 1)',
        },
        spring: {
          gentle: { tension: 280, friction: 60, mass: 1 },
          bouncy: { tension: 400, friction: 20, mass: 1 },
          stiff: { tension: 600, friction: 80, mass: 1 },
          slow: { tension: 200, friction: 40, mass: 2 },
        },
        scale: {
          subtle: 0.95,
          normal: 1.05,
          strong: 1.2,
        },
        distance: {
          small: 10,
          medium: 20,
          large: 50,
        },
        angle: {
          small: 15,
          medium: 45,
          large: 90,
        }
      },
      breakpoints: {
        mobile: 640,
        tablet: 1024,
        desktop: 1280,
      },
      accessibility: {
        reducedMotion: false,
        respectUserPreferences: true,
        safeAnimations: ['fade', 'slide', 'scale'],
      }
    }
  }

  private setupSystemListeners(): void {
    if (typeof window !== 'undefined') {
      // 监听系统主题变化
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', (e) => {
        this.updateThemeAxis('mode', e.matches ? 'dark' : 'light')
      })

      // 监听减少动画偏好
      const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      reducedMotionQuery.addEventListener('change', (e) => {
        this.updateAccessibility('reducedMotion', e.matches)
        if (e.matches) {
          this.updateThemeAxis('intensity', 'subtle')
        }
      })

      // 监听视口大小变化
      const resizeObserver = new ResizeObserver(() => {
        this.updateResponsiveConfig()
      })
      resizeObserver.observe(document.body)
    }
  }

  // =============================================================================
  // 公共 API
  // =============================================================================

  /**
   * 获取当前动画配置
   */
  public getConfig(): ThemeMotionConfig {
    return { ...this.config }
  }

  /**
   * 更新主题轴配置
   */
  public updateThemeAxis<K extends keyof ThemeMotionConfig['themeAxis']>(
    key: K,
    value: ThemeMotionConfig['themeAxis'][K]
  ): void {
    this.config.themeAxis[key] = value
    this.notifyObservers()
  }

  /**
   * 更新动画变量
   */
  public updateVariables<K extends keyof ThemeMotionConfig['variables']>(
    key: K,
    value: ThemeMotionConfig['variables'][K]
  ): void {
    this.config.variables[key] = value
    this.notifyObservers()
  }

  /**
   * 更新可访问性设置
   */
  public updateAccessibility<K extends keyof ThemeMotionConfig['accessibility']>(
    key: K,
    value: ThemeMotionConfig['accessibility'][K]
  ): void {
    this.config.accessibility[key] = value
    this.notifyObservers()
  }

  /**
   * 创建主题感知动画配置
   */
  public createThemeAnimation(
    baseConfig: AnimationConfig,
    options?: {
      intensity?: MotionAxisConfig['intensity']
      complexity?: MotionAxisConfig['complexness']
      responsiveness?: MotionAxisConfig['responsiveness']
      respectReducedMotion?: boolean
    }
  ): ThemeAwareAnimation {
    const intensity = options?.intensity || this.config.themeAxis.intensity
    const complexity = options?.complexity || this.config.themeAxis.complexity
    const responsiveness = options?.responsiveness || this.config.themeAxis.responsiveness

    // 根据强度选择基础配置
    const motionVariant = motionVariants[intensity]

    // 生成动画配置
    const animationConfig = {
      ...baseConfig,
      duration: this.getDuration(baseConfig.duration, responsiveness),
      easing: this.getEasing(baseConfig.easing, complexity),
      delay: baseConfig.delay || this.calculateDelay(complexity),
      willChange: this.shouldWillChange(complexity),
    }

    // 添加主题轴配置
    const themeAxis: MotionAxisConfig = {
      intensity,
      complexity,
      responsiveness,
      strategy: 'functional',
      priority: 'normal',
      prefersReducedMotion: options?.respectReducedMotion
        ? this.config.accessibility.reducedMotion
        : undefined,
      respectMotionPreference: this.config.accessibility.respectUserPreferences,
      safeToAnimate: this.isSafeAnimation(baseConfig),
    }

    return {
      ...animationConfig,
      themeAxis,
    }
  }

  /**
   * 根据主题创建响应式动画
   */
  public createResponsiveAnimation(
    configs: {
      mobile?: AnimationConfig
      tablet?: AnimationConfig
      desktop?: AnimationConfig
    }
  ): ThemeAwareAnimation {
    const responsive = {}

    // 为每个断点创建主题感知配置
    for (const [breakpoint, config] of Object.entries(configs)) {
      if (config) {
        const responsiveness = breakpoint as MotionAxisConfig['responsiveness']
        responsive[breakpoint] = this.createThemeAnimation(config, {
          responsiveness,
          respectReducedMotion: true
        })
      }
    }

    return {
      responsive,
      // 默认使用桌面配置
      ...responsive.desktop,
    }
  }

  /**
   * 生成 CSS 动画变量
   */
  public generateCSSVariables(): string {
    const { variables, themeAxis } = this.config
    const cssVars: string[] = []

    // 动画时长变量
    Object.entries(variables.duration).forEach(([key, value]) => {
      cssVars.push(`  --motion-duration-${key}: ${value}ms;`)
    })

    // 动画缓动变量
    Object.entries(variables.easing).forEach(([key, value]) => {
      cssVars.push(`  --motion-easing-${key}: ${value};`)
    })

    // Spring 配置变量
    Object.entries(variables.spring).forEach(([key, config]) => {
      cssVars.push(`  --spring-${key}-tension: ${config.tension};`)
      cssVars.push(`  --spring-${key}-friction: ${config.friction};`)
      cssVars.push(`  --spring-${key}-mass: ${config.mass};`)
    })

    // 缩放变量
    Object.entries(variables.scale).forEach(([key, value]) => {
      cssVars.push(`  --motion-scale-${key}: ${value};`)
    })

    // 距离变量
    Object.entries(variables.distance).forEach(([key, value]) => {
      cssVars.push(`  --motion-distance-${key}: ${value}px;`)
    })

    // 角度变量
    Object.entries(variables.angle).forEach(([key, value]) => {
      cssVars.push(`  --motion-angle-${key}: ${value}deg;`)
    })

    // 主题轴变量
    cssVars.push(`  --motion-intensity: ${themeAxis.intensity};`)
    cssVars.push(`  --motion-complexity: ${themeAxis.complexity};`)
    cssVars.push(`  --motion-responsiveness: ${themeAxis.responsiveness};`)

    // 可访问性变量
    cssVars.push(`  --reduced-motion: ${this.config.accessibility.reducedMotion ? 'reduce' : 'no-preference'};`)

    return `:root {\n${cssVars.join('\n')}\n}`
  }

  /**
   * 注册配置变化观察者
   */
  public subscribe(observer: (config: ThemeMotionConfig) => void): () => void {
    this.observers.add(observer)

    // 返回取消订阅函数
    return () => {
      this.observers.delete(observer)
    }
  }

  // =============================================================================
  // 私有工具方法
  // =============================================================================

  private notifyObservers(): void {
    this.observers.forEach(observer => {
      observer(this.getConfig())
    })
  }

  private updateResponsiveConfig(): void {
    if (typeof window === 'undefined') return

    const width = window.innerWidth
    const { breakpoints } = this.config

    let responsiveness: MotionAxisConfig['responsiveness'] = 'normal'

    if (width < breakpoints.mobile) {
      responsiveness = 'fast'
    } else if (width < breakpoints.tablet) {
      responsiveness = 'normal'
    } else {
      responsiveness = 'slow'
    }

    this.updateThemeAxis('responsiveness', responsiveness)
  }

  private getDuration(
    baseDuration?: number | string,
    responsiveness: MotionAxisConfig['responsiveness'] = 'normal'
  ): number {
    if (baseDuration) {
      return typeof baseDuration === 'number' ? baseDuration :
        parseInt(baseDuration.replace('ms', ''))
    }

    const responsivenessMultipliers = {
      immediate: 0.5,
      fast: 0.75,
      normal: 1,
      slow: 1.25,
    }

    const baseDurationValue = this.config.variables.duration.normal
    return Math.round(baseDurationValue * responsivenessMultipliers[responsiveness])
  }

  private getEasing(
    baseEasing?: string,
    complexity: MotionAxisConfig['complexity'] = 'moderate'
  ): string {
    if (baseEasing) return baseEasing

    const complexityEasing = {
      simple: 'cubic-bezier(0.4, 0, 0.2, 1)',
      moderate: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      complex: 'cubic-bezier(0.2, 0, 0, 1)',
    }

    return complexityEasing[complexity]
  }

  private calculateDelay(complexity: MotionAxisConfig['complexity']): number {
    const delayMultipliers = {
      simple: 0,
      moderate: 50,
      complex: 100,
    }

    return delayMultipliers[complexity]
  }

  private shouldWillChange(complexity: MotionAxisConfig['complexity']): boolean {
    return complexity === 'complex'
  }

  private isSafeAnimation(config: AnimationConfig): boolean {
    // 检查动画类型是否在安全列表中
    const safeTypes = ['fade', 'slide', 'scale']

    // 简单的安全性检查
    const duration = this.getDuration(config.duration)
    const isShortDuration = duration <= 300

    return isShortDuration || safeTypes.some(type =>
      config.type?.includes(type) || config.easing?.includes(type)
    )
  }
}

// =============================================================================
// 全局动画主题提供者实例
// =============================================================================

export const motionThemeProvider = MotionThemeProvider.getInstance()

// =============================================================================
// 便捷函数
// =============================================================================

/**
 * 创建主题感知动画配置
 */
export function createThemeAnimation(
  baseConfig: AnimationConfig,
  options?: {
    intensity?: MotionAxisConfig['intensity']
    complexity?: MotionAxisConfig['complexity']
    responsiveness?: MotionAxisConfig['responsiveness']
    respectReducedMotion?: boolean
  }
): ThemeAwareAnimation {
  return motionThemeProvider.createThemeAnimation(baseConfig, options)
}

/**
 * 创建响应式主题动画
 */
export function createResponsiveThemeAnimation(
  configs: {
    mobile?: AnimationConfig
    tablet?: AnimationConfig
    desktop?: AnimationConfig
  }
): ThemeAwareAnimation {
  return motionThemeProvider.createResponsiveAnimation(configs)
}

/**
 * 获取动画主题配置
 */
export function getMotionThemeConfig(): ThemeMotionConfig {
  return motionThemeProvider.getConfig()
}

/**
 * 订阅动画主题变化
 */
export function subscribeMotionTheme(
  observer: (config: ThemeMotionConfig) => void
): () => void {
  return motionThemeProvider.subscribe(observer)
}

// =============================================================================
// React Hook
// =============================================================================

export function useMotionTheme() {
  const [config, setConfig] = React.useState(() => motionThemeProvider.getConfig())

  React.useEffect(() => {
    const unsubscribe = motionThemeProvider.subscribe(setConfig)
    return unsubscribe
  }, [])

  return {
    config,
    createAnimation: motionThemeProvider.createThemeAnimation.bind(motionThemeProvider),
    createResponsiveAnimation: motionThemeProvider.createResponsiveAnimation.bind(motionThemeProvider),
    updateThemeAxis: motionThemeProvider.updateThemeAxis.bind(motionThemeProvider),
    updateVariables: motionThemeProvider.updateVariables.bind(motionThemeProvider),
    updateAccessibility: motionThemeProvider.updateAccessibility.bind(motionThemeProvider),
  }
}

// =============================================================================
// 类型导出
// =============================================================================

export type {
  ThemeMotionConfig
}