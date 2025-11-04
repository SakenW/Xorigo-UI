/**
 * 🎭 动画令牌系统 - v2025.11.03
 *
 * 缓动函数、持续时间、延迟配置
 * 支持七轴动画轴的动态调整
 *
 * @version 2025.11.03
 * @category Foundations
 * @layer system
 */

export const motionTokens = {
  // 缓动函数 - 标准 Bezier 曲线
  easing: {
    // 标准 CSS 缓动
    linear: 'linear',
    ease: 'ease',
    'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
    'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
    'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',

    // 主题轴特定缓动 - 支持七轴动画轴
    'ease-classic': 'cubic-bezier(0.4, 0, 0.2, 1)',
    'ease-soft': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    'ease-spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',

    // 弹性缓动函数
    'ease-bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    'ease-elastic': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    'ease-back': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',

    // 自然缓动函数
    'ease-natural': 'cubic-bezier(0.4, 0, 0.6, 1)',
    'ease-smooth': 'cubic-bezier(0.3, 0, 0.7, 1)',
    'ease-gentle': 'cubic-bezier(0.2, 0, 0.8, 1)',

    // 高对比度缓动
    'ease-accessible': 'cubic-bezier(0.2, 0, 0, 1)',
    'ease-reduced': 'cubic-bezier(0, 0, 0, 1)'
  },

  // 持续时间 - 微秒级
  duration: {
    // 即时效果
    instant: '0ms',
    'transition-instant': '50ms',

    // 快速动画
    fast: '150ms',
    'transition-fast': '150ms',
    'animation-fast': '200ms',

    // 标准动画
    normal: '250ms',
    'transition-normal': '250ms',
    'animation-normal': '300ms',

    // 慢速动画
    slow: '400ms',
    'transition-slow': '400ms',
    'animation-slow': '500ms',

    // 非常慢速动画
    slower: '600ms',
    'transition-slower': '600ms',
    'animation-slower': '700ms',

    // 主题轴特定持续时间
    'duration-classic': '300ms',
    'duration-soft': '400ms',
    'duration-expressive': '500ms'
  },

  // 延迟时间 - 微秒级
  delay: {
    // 无延迟
    none: '0ms',
    immediate: '0ms',

    // 短延迟
    short: '100ms',
    'transition-short': '100ms',
    'animation-short': '150ms',

    // 标准延迟
    normal: '200ms',
    'transition-normal': '200ms',
    'animation-normal': '250ms',

    // 长延迟
    long: '400ms',
    'transition-long': '400ms',
    'animation-long': '500ms',

    // 非常长延迟
    longer: '600ms',
    'transition-longer': '600ms',
    'animation-longer': '800ms',

    // 交错动画延迟
    'stagger-1': '50ms',
    'stagger-2': '100ms',
    'stagger-3': '150ms',
    'stagger-4': '200ms',
    'stagger-5': '250ms',
    'stagger-6': '300ms',
    'stagger-8': '400ms',
    'stagger-10': '500ms',

    // 主题轴特定延迟
    'delay-classic': '150ms',
    'delay-soft': '200ms',
    'delay-expressive': '250ms'
  },

  // 动画预设
  presets: {
    // 按钮动画
    button: {
      enter: {
        duration: '150ms',
        easing: 'ease-out',
        delay: '0ms'
      },
      exit: {
        duration: '100ms',
        easing: 'ease-in',
        delay: '0ms'
      },
      hover: {
        duration: '200ms',
        easing: 'ease-out',
        delay: '0ms'
      },
      active: {
        duration: '150ms',
        easing: 'ease-out',
        delay: '0ms'
      }
    },

    // 模态框动画
    modal: {
      overlay: {
        duration: '300ms',
        easing: 'ease-out',
        delay: '0ms'
      },
      content: {
        duration: '250ms',
        easing: 'ease-out',
        delay: '100ms'
      },
      exit: {
        duration: '200ms',
        easing: 'ease-in',
        delay: '0ms'
      }
    },

    // 抽屉动画
    drawer: {
      overlay: {
        duration: '300ms',
        easing: 'ease-out',
        delay: '0ms'
      },
      content: {
        duration: '300ms',
        easing: 'ease-out',
        delay: '0ms'
      },
      exit: {
        duration: '250ms',
        easing: 'ease-in',
        delay: '0ms'
      }
    },

    // 弹出层动画
    popover: {
      overlay: {
        duration: '150ms',
        easing: 'ease-out',
        delay: '0ms'
      },
      content: {
        duration: '200ms',
        easing: 'ease-out',
        delay: '50ms'
      },
      exit: {
        duration: '100ms',
        easing: 'ease-in',
        delay: '0ms'
      }
    },

    // Toast 通知动画
    toast: {
      enter: {
        duration: '300ms',
        easing: 'ease-out',
        delay: '0ms'
      },
      exit: {
        duration: '250ms',
        easing: 'ease-in',
        delay: '0ms'
      }
    },

    // 切换动画
    switch: {
      enter: {
        duration: '200ms',
        easing: 'ease-out',
        delay: '0ms'
      },
      exit: {
        duration: '150ms',
        easing: 'ease-in',
        delay: '0ms'
      }
    },

    // 标签页动画
    tabs: {
      tab: {
        duration: '200ms',
        easing: 'ease-out',
        delay: '0ms'
      },
      panel: {
        duration: '300ms',
        easing: 'ease-out',
        delay: '50ms'
      }
    },

    // 手风琴动画
    accordion: {
      header: {
        duration: '150ms',
        easing: 'ease-out',
        delay: '0ms'
      },
      content: {
        duration: '300ms',
        easing: 'ease-out',
        delay: '0ms'
      },
      exit: {
        duration: '200ms',
        easing: 'ease-in',
        delay: '0ms'
      }
    },

    // 下拉菜单动画
    dropdown: {
      trigger: {
        duration: '150ms',
        easing: 'ease-out',
        delay: '0ms'
      },
      content: {
        duration: '200ms',
        easing: 'ease-out',
        delay: '50ms'
      },
      exit: {
        duration: '150ms',
        easing: 'ease-in',
        delay: '0ms'
      }
    },

    // 工具提示动画
    tooltip: {
      enter: {
        duration: '150ms',
        easing: 'ease-out',
        delay: '100ms'
      },
      exit: {
        duration: '100ms',
        easing: 'ease-in',
        delay: '0ms'
      }
    }
  },

  // 物理属性 - 支持七轴表面轴
  physics: {
    // 减震系数
    damping: {
      light: 0.15,
      normal: 0.25,
      heavy: 0.35,
      bouncy: 0.4
    },

    // 刚度系数
    stiffness: {
      soft: 100,
      normal: 150,
      firm: 200,
      stiff: 300
    },

    // 质量
    mass: {
      light: 0.5,
      normal: 1,
      heavy: 2
    },

    // 速度阈值
    velocity: {
      slow: 0.5,
      normal: 1,
      fast: 2
    },

    // 角度阈值
    angle: {
      gentle: 0.5,
      normal: 1,
      sharp: 2
    }
  },

  // 可访问性配置
  accessibility: {
    // 减少动画偏好设置
    reducedMotion: {
      enabled: 'prefers-reduced-motion',
      durationMultiplier: 0.5,
      easingFunction: 'ease-out'
    },

    // 高对比度偏好设置
    highContrast: {
      enabled: 'prefers-contrast',
      durationMultiplier: 1.2,
      easingFunction: 'ease-out'
    },

    // 动画偏好设置
    custom: {
      enabled: 'no-preference',
      respectSystemPreferences: true
    }
  }
} as const

// 类型定义
export type MotionTokens = typeof motionTokens
export type EasingKey = keyof typeof motionTokens.easing
export type DurationKey = keyof typeof motionTokens.duration
export type DelayKey = keyof typeof motionTokens.delay
export type PresetKey = keyof typeof motionTokens.presets

/**
 * 动画令牌验证器
 */
export class MotionTokenValidator {
  static validateMotionTokens(): ValidationResult {
    const issues: string[] = []
    const warnings: string[] = []

    // 验证持续时间合理性
    const durations = Object.values(motionTokens.duration).filter(v => typeof v === 'string')
    durations.forEach(duration => {
      const ms = parseInt(duration)
      if (ms > 3000) {
        warnings.push(`动画持续时间过长: ${duration}`)
      }
      if (ms < 0) {
        issues.push(`动画持续时间不能为负数: ${duration}`)
      }
    })

    // 预设验证
    Object.entries(motionTokens.presets).forEach(([preset, config]) => {
      Object.entries(config).forEach(([state, animation]) => {
        if (typeof animation === 'object' && animation !== null) {
          const anim = animation as any
          const duration = parseInt(anim.duration)
          const delay = parseInt(anim.delay)

          if (duration > 1000) {
            warnings.push(`${preset} ${state} 动画持续时间过长: ${anim.duration}`)
          }
          if (delay > 500) {
            warnings.push(`${preset} ${state} 动画延迟过长: ${anim.delay}`)
          }
        }
      })
    })

    return {
      valid: issues.length === 0,
      issues,
      warnings
    }
  }
}

interface ValidationResult {
  valid: boolean
  issues: string[]
  warnings: string[]
}

// 导出验证结果
export const motionValidationResult = MotionTokenValidator.validateMotionTokens()

/**
 * 动画工具类
 */
export class AnimationHelper {
  /**
   * 创建 CSS 动画
   */
  static createAnimation(
    properties: string[],
    duration: string,
    easing: string,
    delay?: string
  ): string {
    const delayPart = delay ? ` ${delay}` : ''
    return `${properties.join(' ')} ${duration} ${motionTokens.easing[easing as EasingKey]}${delayPart}`
  }

  /**
   * 创建关键帧动画
   */
  static createKeyframes(
    keyframes: Record<string, Record<string, string>>,
    duration: string,
    easing: string
  ): string {
    const keyframeEntries = Object.entries(keyframes).map(([percentage, styles]) => {
      const styleEntries = Object.entries(styles).map(([property, value]) => {
        return `${property}: ${value}`
      })
      return `${percentage} { ${styleEntries.join('; ')} }`
    })

    return `@keyframes ${this.createAnimation([''], duration, easing)} {${keyframeEntries.join('\n')}}`
  }

  /**
   * 获取可访问性感知的动画配置
   */
  static getAccessibilityAwareAnimation(
    baseAnimation: {
      duration: string
      easing: string
      delay?: string
    }
  ): {
    duration: string
    easing: string
    delay?: string
  } {
    // 检查用户偏好
    const prefersReducedMotion = typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

    const prefersHighContrast = typeof window !== 'undefined'
      ? window.matchMedia('(prefers-contrast: high)').matches
      : false

    let durationMultiplier = 1
    let easingFunction = baseAnimation.easing

    if (prefersReducedMotion) {
      durationMultiplier = motionTokens.accessibility.reducedMotion.durationMultiplier
      easingFunction = motionTokens.accessibility.reducedMotion.easingFunction as EasingKey
    } else if (prefersHighContrast) {
      durationMultiplier = motionTokens.accessibility.highContrast.durationMultiplier
      easingFunction = motionTokens.accessibility.highContrast.easingFunction as EasingKey
    }

    return {
      duration: this.adjustDuration(baseAnimation.duration, durationMultiplier),
      easing: easingFunction,
      delay: baseAnimation.delay
    }
  }

  /**
   * 调整持续时间
   */
  private static adjustDuration(baseDuration: string, multiplier: number): string {
    const baseMs = parseInt(baseDuration)
    const adjustedMs = Math.round(baseMs * multiplier)
    return `${adjustedMs}ms`
  }

  /**
   * 创建交错动画延迟数组
   */
  static createStaggerDelays(count: number, baseDelay: number = 50): string[] {
    return Array.from({ length: count }, (_, index) => `${baseDelay * index}ms`)
  }

  /**
   * 获取动画预设配置
   */
  static getAnimationPreset(preset: PresetKey, state: string) {
    const presetConfig = motionTokens.presets[preset]
    return presetConfig?.[state as keyof typeof presetConfig]
  }
}