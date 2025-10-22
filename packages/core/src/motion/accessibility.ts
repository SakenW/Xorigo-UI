/**
 * Xorigo UI 动画可访问性支持
 *
 * 确保动画对所有用户都是可访问和友好的
 * 遵循 WCAG 2.1 指南和最佳实践
 */

import type { AnimationConfig, ThemeAwareAnimation } from './animation-system'
import { animationSystem } from './animation-system'

// =============================================================================
// 可访问性配置接口
// =============================================================================

export interface AccessibilityConfig {
  // 用户偏好设置
  userPreferences: {
    prefersReducedMotion: boolean
    prefersDarkMode: boolean
    prefersHighContrast: boolean
    prefersNoPrefersColorScheme: boolean
  }

  // 动画可访问性设置
  animationAccessibility: {
    safeAnimations: string[]
    riskyAnimations: string[]
    disabledAnimations: string[]
    maxAnimationDuration: number // 毫秒
    maxParallaxIntensity: number
    respectUserPreferences: boolean
  }

  // 辅助功能设置
  assistiveTechnology: {
    screenReaderActive: boolean
    voiceControlActive: boolean
    switchNavigationActive: boolean
    keyboardNavigationActive: boolean
  }

  // 紧急设置
  emergencySettings: {
    disableAllAnimations: boolean
    highContrastMode: boolean
    reducedMotionMode: boolean
    focusVisibleOnly: boolean
  }
}

// =============================================================================
// 可访问性动画变体
// =============================================================================

/**
 * 安全的动画变体 - 对所有用户都友好
 */
export const safeAnimationVariants = {
  // 基础安全动画
  fade: {
    duration: 200,
    easing: 'ease-out',
    properties: ['opacity'],
    description: '简单的透明度变化，对动效敏感用户友好'
  },

  subtleSlide: {
    duration: 150,
    easing: 'ease-out',
    properties: ['transform'],
    maxDistance: 10,
    description: '微小的滑动，距离和强度都很低'
  },

  gentleScale: {
    duration: 150,
    easing: 'ease-out',
    properties: ['transform'],
    maxScale: 1.05,
    description: '温和的缩放，变化范围很小'
  },

  // 状态指示动画
  successPulse: {
    duration: 300,
    easing: 'ease-out',
    properties: ['transform', 'opacity'],
    repeatCount: 1,
    description: '成功状态的单次脉冲'
  },

  errorShake: {
    duration: 200,
    easing: 'ease-out',
    properties: ['transform'],
    maxDistance: 4,
    description: '错误状态的轻微摇摆'
  },

  warningFlash: {
    duration: 200,
    easing: 'ease-out',
    properties: ['opacity'],
    repeatCount: 1,
    description: '警告状态的闪烁提醒'
  },
}

/**
 * 有风险的动画变体 - 需要谨慎使用
 */
export const riskyAnimationVariants = {
  // 复杂动画
  bounce: {
    duration: 600,
    easing: 'ease-out',
    properties: ['transform'],
    description: '弹跳动画，可能引起晕动',
    warnings: ['可能引起不适', '建议提供关闭选项']
  },

  elastic: {
    duration: 800,
    easing: 'ease-out',
    properties: ['transform'],
    description: '弹性动画，变化幅度较大',
    warnings: ['可能引起不适', '建议提供关闭选项']
  },

  flip: {
    duration: 400,
    easing: 'ease-in-out',
    properties: ['transform'],
    description: '翻转动画，3D 变化',
    warnings: ['3D 动画可能引起不适', '不适合动效敏感用户']
  },

  rotate: {
    duration: 300,
    easing: 'ease-in-out',
    properties: ['transform'],
    description: '旋转动画，可能引起方向感混乱',
    warnings: ['可能引起方向感混乱', '需要谨慎使用']
  },

  // 大幅度动画
  largeSlide: {
    duration: 500,
    easing: 'ease-out',
    properties: ['transform'],
    minDistance: 50,
    description: '大幅度的滑动，距离较大',
    warnings: ['大幅运动可能引起不适', '建议使用较小的距离']
  },

  // 重复动画
  pulse: {
    duration: 1000,
    easing: 'ease-in-out',
    properties: ['transform', 'opacity'],
    repeatCount: Infinity,
    description: '重复的脉冲动画',
    warnings: ['重复动画可能分散注意力', '建议限制使用场景']
  },
}

// =============================================================================
// 可访问性动画提供者
// =============================================================================

export class AccessibilityAnimationProvider {
  private static instance: AccessibilityAnimationProvider
  private config: AccessibilityConfig
  private observers: Set<(config: AccessibilityConfig) => void> = new Set()

  private constructor() {
    this.config = this.initializeConfig()
    this.setupSystemListeners()
  }

  public static getInstance(): AccessibilityAnimationProvider {
    if (!AccessibilityAnimationProvider.instance) {
      AccessibilityAnimationProvider.instance = new AccessibilityAnimationProvider()
    }
    return AccessibilityAnimationProvider.instance
  }

  private initializeConfig(): AccessibilityConfig {
    return {
      userPreferences: {
        prefersReducedMotion: this.checkReducedMotion(),
        prefersDarkMode: this.checkDarkMode(),
        prefersHighContrast: this.checkHighContrast(),
        prefersNoPrefersColorScheme: this.checkNoPrefersColorScheme(),
      },

      animationAccessibility: {
        safeAnimations: ['fade', 'subtleSlide', 'gentleScale', 'successPulse', 'errorShake', 'warningFlash'],
        riskyAnimations: ['bounce', 'elastic', 'flip', 'rotate', 'largeSlide', 'pulse'],
        disabledAnimations: [],
        maxAnimationDuration: 500,
        maxParallaxIntensity: 0.1,
        respectUserPreferences: true,
      },

      assistiveTechnology: {
        screenReaderActive: this.checkScreenReader(),
        voiceControlActive: false,
        switchNavigationActive: false,
        keyboardNavigationActive: this.checkKeyboardNavigation(),
      },

      emergencySettings: {
        disableAllAnimations: false,
        highContrastMode: false,
        reducedMotionMode: false,
        focusVisibleOnly: false,
      },
    }
  }

  private setupSystemListeners(): void {
    if (typeof window === 'undefined') return

    // 监听减少动画偏好
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotionQuery.addEventListener('change', (e) => {
      this.updateUserPreference('prefersReducedMotion', e.matches)
      if (e.matches) {
        this.updateEmergencySetting('reducedMotionMode', true)
      }
    })

    // 监听高对比度偏好
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)')
    highContrastQuery.addEventListener('change', (e) => {
      this.updateUserPreference('prefersHighContrast', e.matches)
      if (e.matches) {
        this.updateEmergencySetting('highContrastMode', true)
      }
    })

    // 监听屏幕阅读器（通过 aria-live 和其他线索）
    this.setupScreenReaderDetection()

    // 监听键盘导航
    this.setupKeyboardNavigationDetection()
  }

  private setupScreenReaderDetection(): void {
    // 检测屏幕阅读器的各种线索
    const screenReaderIndicators = [
      () => window.navigator.userAgent.includes('JAWS'),
      () => window.navigator.userAgent.includes('NVDA'),
      () => window.speechSynthesis !== undefined,
      () => window.getComputedStyle(document.body).position === 'fixed',
      () => document.body.getAttribute('aria-live') !== null,
    ]

    const isActive = screenReaderIndicators.some(check => check())
    this.updateAssistiveTechnology('screenReaderActive', isActive)
  }

  private setupKeyboardNavigationDetection(): void {
    let lastInteractionTime = Date.now()
    let keyboardOnlyNavigation = true

    const handleInteraction = (event: Event) => {
      const now = Date.now()
      const timeSinceLastInteraction = now - lastInteractionTime

      // 如果是键盘事件，更新键盘导航状态
      if (event instanceof KeyboardEvent) {
        keyboardOnlyNavigation = true
        lastInteractionTime = now
      }
      // 如果是鼠标事件，更新键盘导航状态
      else if (event instanceof MouseEvent) {
        keyboardOnlyNavigation = false
        lastInteractionTime = now
      }

      // 5秒后重置为键盘导航
      setTimeout(() => {
        if (Date.now() - lastInteractionTime >= 5000) {
          keyboardOnlyNavigation = true
          this.updateAssistiveTechnology('keyboardNavigationActive', true)
        }
      }, 5000)

      this.updateAssistiveTechnology('keyboardNavigationActive', keyboardOnlyNavigation)
    }

    document.addEventListener('keydown', handleInteraction)
    document.addEventListener('mousedown', handleInteraction)
    document.addEventListener('touchstart', handleInteraction)
  }

  private checkReducedMotion(): boolean {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  private checkDarkMode(): boolean {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  private checkHighContrast(): boolean {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-contrast: high)').matches
  }

  private checkNoPrefersColorScheme(): boolean {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-color-scheme: no-preference)').matches
  }

  private checkScreenReader(): boolean {
    // 这里可以实现更复杂的屏幕阅读器检测逻辑
    return false
  }

  private checkKeyboardNavigation(): boolean {
    return false
  }

  // =============================================================================
  // 公共 API
  // =============================================================================

  public getConfig(): AccessibilityConfig {
    return { ...this.config }
  }

  public updateUserPreference<K extends keyof AccessibilityConfig['userPreferences']>(
    key: K,
    value: AccessibilityConfig['userPreferences'][K]
  ): void {
    this.config.userPreferences[key] = value
    this.notifyObservers()
  }

  public updateAnimationAccessibility<K extends keyof AccessibilityConfig['animationAccessibility']>(
    key: K,
    value: AccessibilityConfig['animationAccessibility'][K]
  ): void {
    this.config.animationAccessibility[key] = value
    this.notifyObservers()
  }

  public updateAssistiveTechnology<K extends keyof AccessibilityConfig['assistiveTechnology']>(
    key: K,
    value: AccessibilityConfig['assistiveTechnology'][K]
  ): void {
    this.config.assistiveTechnology[key] = value
    this.notifyObservers()
  }

  public updateEmergencySetting<K extends keyof AccessibilityConfig['emergencySettings']>(
    key: K,
    value: AccessibilityConfig['emergencySettings'][K]
  ): void {
    this.config.emergencySettings[key] = value
    this.notifyObservers()
  }

  /**
   * 检查动画是否可访问
   */
  public isAnimationAccessible(
    animation: AnimationConfig | ThemeAwareAnimation,
    context?: {
      isImportant?: boolean
      isUserTriggered?: boolean
      isContent?: boolean
    }
  ): {
    accessible: boolean
    reason?: string
    recommendations?: string[]
  } {
    const {
      isImportant = false,
      isUserTriggered = false,
      isContent = true,
    } = context || {}

    const { config } = this

    // 紧急设置检查
    if (config.emergencySettings.disableAllAnimations) {
      return {
        accessible: false,
        reason: '所有动画已被禁用',
        recommendations: ['检查紧急设置']
      }
    }

    // 用户偏好检查
    if (config.animationAccessibility.respectUserPreferences) {
      // 减少动画偏好
      if (config.userPreferences.prefersReducedMotion) {
        if (!isImportant && !isUserTriggered) {
          return {
            accessible: false,
            reason: '用户偏好减少动画',
            recommendations: ['提供动画开关', '使用静态替代方案']
          }
        }
      }

      // 高对比度模式
      if (config.userPreferences.prefersHighContrast) {
        // 在高对比度模式下，只允许简单的透明度变化
        const hasComplexProperties = ['transform', 'scale', 'rotate'].some(
          prop => animation.type?.includes(prop) || animation.transition?.includes(prop)
        )

        if (hasComplexProperties) {
          return {
            accessible: false,
            reason: '高对比度模式下不允许复杂动画',
            recommendations: ['使用简单的透明度动画']
          }
        }
      }
    }

    // 辅助技术检查
    if (config.assistiveTechnology.screenReaderActive) {
      // 屏幕阅读器用户通常不喜欢动画
      if (!isUserTriggered) {
        return {
          accessible: false,
          reason: '屏幕阅读器检测到非用户触发的动画',
          recommendations: ['确保动画是用户触发的', '提供无动画替代方案']
        }
      }
    }

    // 动画参数检查
    const duration = typeof animation.duration === 'number' ?
      animation.duration : parseInt(animation.duration?.toString() || '200')

    if (duration > config.animationAccessibility.maxAnimationDuration) {
      return {
        accessible: false,
        reason: `动画时长 ${duration}ms 超过最大允许 ${config.animationAccessibility.maxAnimationDuration}ms`,
        recommendations: ['减少动画时长', '分步骤执行动画']
      }
    }

    // 动画类型检查
    const animationType = this.getAnimationType(animation)
    if (config.animationAccessibility.riskyAnimations.includes(animationType)) {
      if (!isImportant && !isUserTriggered) {
        return {
          accessible: false,
          reason: `动画类型 '${animationType}' 属于有风险动画`,
          recommendations: ['提供动画开关', '使用安全的替代动画']
        }
      }
    }

    return { accessible: true }
  }

  /**
   * 获取可访问的动画配置
   */
  public getAccessibleAnimation(
    baseAnimation: AnimationConfig,
    context?: {
      intensity?: 'subtle' | 'standard' | 'expressive'
      isImportant?: boolean
      isUserTriggered?: boolean
    }
  ): ThemeAwareAnimation {
    const { intensity = 'standard', isImportant = false, isUserTriggered = false } = context || {}
    const { config } = this

    // 选择安全的动画变体
    let animationConfig: AnimationConfig = { ...baseAnimation }

    // 根据上下文调整配置
    if (config.userPreferences.prefersReducedMotion && !isImportant && !isUserTriggered) {
      // 使用极简动画
      animationConfig = {
        ...animationConfig,
        duration: 100,
        easing: 'linear',
      }
    } else if (intensity === 'subtle') {
      // 使用微妙动画
      animationConfig = {
        ...animationConfig,
        duration: Math.min(animationConfig.duration as number || 200, 150),
        easing: 'ease-out',
      }
    }

    // 应用可访问性约束
    if (animationConfig.duration && animationConfig.duration > config.animationAccessibility.maxAnimationDuration) {
      animationConfig.duration = config.animationAccessibility.maxAnimationDuration
    }

    return {
      ...animationConfig,
      themeAxis: {
        intensity: intensity,
        complexity: 'simple',
        responsiveness: 'fast',
        strategy: 'functional',
        priority: isImportant ? 'critical' : 'normal',
        prefersReducedMotion: config.userPreferences.prefersReducedMotion,
        respectMotionPreference: config.animationAccessibility.respectUserPreferences,
        safeToAnimate: true,
      }
    }
  }

  /**
   * 生成可访问性报告
   */
  public generateAccessibilityReport(): AccessibilityReport {
    const { config } = this

    const report: AccessibilityReport = {
      timestamp: new Date().toISOString(),
      userPreferences: { ...config.userPreferences },
      currentSettings: {
        animationsEnabled: !config.emergencySettings.disableAllAnimations,
        reducedMotionActive: config.emergencySettings.reducedMotionMode || config.userPreferences.prefersReducedMotion,
        highContrastActive: config.emergencySettings.highContrastMode || config.userPreferences.prefersHighContrast,
        assistiveTechnologyActive: Object.values(config.assistiveTechnology).some(Boolean),
      },
      recommendations: [],
      warnings: [],
      safeAnimations: config.animationAccessibility.safeAnimations,
      riskyAnimations: config.animationAccessibility.riskyAnimations,
      disabledAnimations: config.animationAccessibility.disabledAnimations,
      accessibilityScore: this.calculateAccessibilityScore(),
    }

    // 生成建议
    if (config.userPreferences.prefersReducedMotion) {
      report.recommendations.push('尊重用户的减少动画偏好')
    }

    if (config.assistiveTechnology.screenReaderActive) {
      report.recommendations.push('为屏幕阅读器用户提供替代方案')
    }

    if (config.assistiveTechnology.keyboardNavigationActive) {
      report.recommendations.push('确保所有交互元素都可通过键盘访问')
    }

    // 生成警告
    if (config.animationAccessibility.maxAnimationDuration > 300) {
      report.warnings.push('最大动画时长设置过长，可能影响用户体验')
    }

    return report
  }

  /**
   * 注册配置变化观察者
   */
  public subscribe(observer: (config: AccessibilityConfig) => void): () => void {
    this.observers.add(observer)
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

  private getAnimationType(animation: AnimationConfig | ThemeAwareAnimation): string {
    // 简单的动画类型检测
    const animationString = JSON.stringify(animation)

    if (animationString.includes('bounce')) return 'bounce'
    if (animationString.includes('elastic')) return 'elastic'
    if (animationString.includes('flip')) return 'flip'
    if (animationString.includes('rotate')) return 'rotate'
    if (animationString.includes('scale') && animationString.includes('scale3d')) return 'flip'
    if (animationString.includes('translate3d')) return 'slide'
    if (animationString.includes('scale')) return 'scale'
    if (animationString.includes('translate')) return 'slide'
    if (animationString.includes('opacity')) return 'fade'

    return 'unknown'
  }

  private calculateAccessibilityScore(): number {
    const { config } = this
    let score = 100

    // 用户偏好尊重
    if (config.animationAccessibility.respectUserPreferences) score += 20
    else score -= 20

    // 安全动画列表
    if (config.animationAccessibility.safeAnimations.length > 0) score += 15
    if (config.animationAccessibility.riskyAnimations.length === 0) score += 10

    // 时长限制
    if (config.animationAccessibility.maxAnimationDuration <= 300) score += 10
    else if (config.animationAccessibility.maxAnimationDuration > 500) score -= 10

    // 辅助技术支持
    if (Object.values(config.assistiveTechnology).some(Boolean)) score += 10

    return Math.max(0, Math.min(100, score))
  }
}

// =============================================================================
// 类型定义
// =============================================================================

export interface AccessibilityReport {
  timestamp: string
  userPreferences: AccessibilityConfig['userPreferences']
  currentSettings: {
    animationsEnabled: boolean
    reducedMotionActive: boolean
    highContrastActive: boolean
    assistiveTechnologyActive: boolean
  }
  recommendations: string[]
  warnings: string[]
  safeAnimations: string[]
  riskyAnimations: string[]
  disabledAnimations: string[]
  accessibilityScore: number
}

// =============================================================================
// 全局可访问性动画提供者实例
// =============================================================================

export const accessibilityAnimationProvider = AccessibilityAnimationProvider.getInstance()

// =============================================================================
// 便捷函数
// =============================================================================

/**
 * 检查动画是否可访问
 */
export function isAnimationAccessible(
  animation: AnimationConfig | ThemeAwareAnimation,
  context?: {
    isImportant?: boolean
    isUserTriggered?: boolean
    isContent?: boolean
  }
): boolean {
  const result = accessibilityAnimationProvider.isAnimationAccessible(animation, context)
  return result.accessible
}

/**
 * 获取可访问的动画配置
 */
export function getAccessibleAnimation(
  baseAnimation: AnimationConfig,
  context?: {
    intensity?: 'subtle' | 'standard' | 'expressive'
    isImportant?: boolean
    isUserTriggered?: boolean
  }
): ThemeAwareAnimation {
  return accessibilityAnimationProvider.getAccessibleAnimation(baseAnimation, context)
}

/**
 * 获取可访问性配置
 */
export function getAccessibilityConfig(): AccessibilityConfig {
  return accessibilityAnimationProvider.getConfig()
}

/**
 * 订阅可访问性配置变化
 */
export function subscribeAccessibility(
  observer: (config: AccessibilityConfig) => void
): () => void {
  return accessibilityAnimationProvider.subscribe(observer)
}

/**
 * 生成可访问性报告
 */
export function generateAccessibilityReport(): AccessibilityReport {
  return accessibilityAnimationProvider.generateAccessibilityReport()
}