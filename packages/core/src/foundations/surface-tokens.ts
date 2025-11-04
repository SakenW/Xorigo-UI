/**
 * 🎭 表面令牌系统 - v2025.11.03
 *
 * 阴影、模糊、边框、渐变等表面效果
 * 支持七轴表面轴的动态调整
 *
 * @version 2025.11.03
 * @category Foundations
 * @layer system
 */

export const surfaceTokens = {
  // 阴影效果 - 基于高斯模糊算法
  shadows: {
    // 无阴影
    none: 'none',

    // 微妙阴影
    'shadow-xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    'shadow-sm': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',

    // 标准阴影
    'shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    'shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    'shadow-xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',

    // 大型阴影
    'shadow-2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    'shadow-3xl': '0 35px 60px -15px rgb(0 0 0 / 0.3)',

    // 内阴影
    'shadow-inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',

    // 主题轴特定阴影
    'shadow-classic': '0 2px 8px -2px rgb(0 0 0 / 0.15)',
    'shadow-soft': '0 4px 12px -4px rgb(0 0 0 / 0.1)',
    'shadow-expressive': '0 8px 24px -8px rgb(0 0 0 / 0.2)'
  },

  // 模糊效果
  blur: {
    // 无模糊
    none: 'blur(0px)',

    // 小范围模糊
    'blur-xs': 'blur(1px)',
    'blur-sm': 'blur(2px)',
    'blur-md': 'blur(4px)',
    'blur-lg': 'blur(8px)',
    'blur-xl': 'blur(12px)',
    'blur-2xl': 'blur(16px)',
    'blur-3xl': 'blur(24px)',

    // 背景模糊效果
    'backdrop-xs': 'blur(1px)',
    'backdrop-sm': 'blur(2px)',
    'backdrop-md': 'blur(4px)',
    'backdrop-lg': 'blur(8px)',
    'backdrop-xl': 'blur(12px)',
    'backdrop-2xl': 'blur(16px)',

    // 主题轴特定模糊
    'blur-classic': 'blur(6px)',
    'blur-soft': 'blur(3px)',
    'blur-expressive': 'blur(10px)'
  },

  // 边框效果
  borders: {
    // 边框宽度
    width: {
      'border-0': '0px',
      'border-1': '1px',
      'border-2': '2px',
      'border-4': '4px',
      'border-8': '8px'
    },

    // 边框样式
    style: {
      solid: 'solid',
      dashed: 'dashed',
      dotted: 'dotted',
      double: 'double',
      groove: 'groove',
      ridge: 'ridge',
      inset: 'inset',
      outset: 'outset'
    },

    // 边框颜色透明度
    opacity: {
      'border-opacity-0': '0',
      'border-opacity-10': '0.1',
      'border-opacity-20': '0.2',
      'border-opacity-30': '0.3',
      'border-opacity-40': '0.4',
      'border-opacity-50': '0.5',
      'border-opacity-60': '0.6',
      'border-opacity-70': '0.7',
      'border-opacity-80': '0.8',
      'border-opacity-90': '0.9',
      'border-opacity-100': '1'
    },

    // 圆角组合
    radius: {
      'rounded-none': '0px',
      'rounded-xs': '1px',
      'rounded-sm': '2px',
      'rounded-md': '4px',
      'rounded-lg': '6px',
      'rounded-xl': '8px',
      'rounded-2xl': '12px',
      'rounded-3xl': '16px',
      'rounded-full': '9999px',

      // 主题轴特定圆角
      'rounded-classic': '4px',
      'rounded-soft': '8px',
      'rounded-expressive': '12px'
    }
  },

  // 渐变效果
  gradients: {
    // 线性渐变
    linear: {
      'gradient-horizontal': 'linear-gradient(to right, var(--tw-gradient-stops))',
      'gradient-vertical': 'linear-gradient(to bottom, var(--tw-gradient-stops))',
      'gradient-diagonal-tl': 'linear-gradient(to top left, var(--tw-gradient-stops))',
      'gradient-diagonal-tr': 'linear-gradient(to top right, var(--tw-gradient-stops))',
      'gradient-diagonal-bl': 'linear-gradient(to bottom left, var(--tw-gradient-stops))',
      'gradient-diagonal-br': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
      'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      'gradient-radial': 'radial-gradient(circle at center, var(--tw-gradient-stops))'
    },

    // 渐变颜色预设
    presets: {
      'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'gradient-secondary': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'gradient-success': 'linear-gradient(135deg, #13ce66 0%, #00a854 100%)',
      'gradient-warning': 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
      'gradient-danger': 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
      'gradient-info': 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
      'gradient-cool': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'gradient-warm': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'gradient-ocean': 'linear-gradient(135deg, #2196f3 0%, #00bcd4 100%)',
      'gradient-sunset': 'linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%)',
      'gradient-forest': 'linear-gradient(135deg, #13ce66 0%, #8bc34a 100%)',
      'gradient-royal': 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
    },

    // 主题轴特定渐变
    'gradient-classic': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'gradient-soft': 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    'gradient-expressive': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  },

  // 表面纹理
  textures: {
    // 网格纹理
    'texture-grid': {
      background: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)',
      size: 'auto'
    },

    // 点状纹理
    'texture-dots': {
      background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
      size: '20px 20px'
    },

    // 线性纹理
    'texture-lines': {
      background: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)',
      size: 'auto'
    },

    // 噪点纹理
    'texture-noise': {
      background: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence baseFrequency="0.9" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.1"/%3E%3C/svg%3E")',
      size: '100px 100px'
    }
  },

  // 玻璃态效果
  glass: {
    // 标准玻璃态
    'glass-light': {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    },

    'glass-medium': {
      background: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(15px)',
      border: '1px solid rgba(255, 255, 255, 0.3)'
    },

    'glass-heavy': {
      background: 'rgba(255, 255, 255, 0.3)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.4)'
    },

    // 深色玻璃态
    'glass-dark-light': {
      background: 'rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },

    'glass-dark-medium': {
      background: 'rgba(0, 0, 0, 0.2)',
      backdropFilter: 'blur(15px)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    },

    'glass-dark-heavy': {
      background: 'rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.3)'
    },

    // 主题轴特定玻璃态
    'glass-classic': {
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.25)'
    },

    'glass-soft': {
      background: 'rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255, 255, 255, 0.15)'
    },

    'glass-expressive': {
      background: 'rgba(255, 255, 255, 0.25)',
      backdropFilter: 'blur(18px)',
      border: '1px solid rgba(255, 255, 255, 0.35)'
    }
  },

  // 可访问性配置
  accessibility: {
    // 高对比度阴影
    highContrast: {
      enabled: 'prefers-contrast',
      shadowMultiplier: 1.5,
      borderOpacity: 1,
      backdropBlur: 0
    },

    // 减少动画偏好
    reducedMotion: {
      enabled: 'prefers-reduced-motion',
      shadowTransition: 'none',
      blurTransition: 'none'
    },

    // 玻璃态偏好
    glassPreference: {
      enabled: 'no-preference',
      respectSystemPreferences: true
    }
  }
} as const

// 类型定义
export type SurfaceTokens = typeof surfaceTokens
export type ShadowKey = keyof typeof surfaceTokens.shadows
export type BlurKey = keyof typeof surfaceTokens.blur
export type GradientKey = keyof typeof surfaceTokens.gradients.presets
export type GlassKey = keyof typeof surfaceTokens.glass

/**
 * 表面令牌验证器
 */
export class SurfaceTokenValidator {
  static validateSurfaceTokens(): ValidationResult {
    const issues: string[] = []
    const warnings: string[] = []

    // 验证阴影配置
    Object.entries(surfaceTokens.shadows).forEach(([key, value]) => {
      if (key !== 'none' && typeof value === 'string') {
        if (!value.includes('rgb') && !value.includes('hsl') && !value.includes('none')) {
          warnings.push(`阴影配置可能格式错误: ${key}`)
        }
      }
    })

    // 验证模糊配置
    Object.entries(surfaceTokens.blur).forEach(([key, value]) => {
      if (typeof value === 'string') {
        if (!value.includes('blur(') && !value.includes('backdrop-blur(')) {
          warnings.push(`模糊配置格式错误: ${key}`)
        }
      }
    })

    // 验证渐变配置
    Object.entries(surfaceTokens.gradients.presets).forEach(([key, value]) => {
      if (typeof value === 'string') {
        if (!value.includes('gradient')) {
          warnings.push(`渐变配置格式错误: ${key}`)
        }
      }
    })

    // 验证玻璃态配置
    Object.entries(surfaceTokens.glass).forEach(([key, config]) => {
      if (typeof config === 'object' && config !== null) {
        const glassConfig = config as any
        if (!glassConfig.background || !glassConfig.backdropFilter) {
          warnings.push(`玻璃态配置缺少必要属性: ${key}`)
        }
      }
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
export const surfaceValidationResult = SurfaceTokenValidator.validateSurfaceTokens()

/**
 * 表面工具类
 */
export class SurfaceHelper {
  /**
   * 创建自定义阴影
   */
  static createShadow(
    x: number,
    y: number,
    blur: number,
    spread: number,
    color: string,
    opacity: number = 1
  ): string {
    const rgbColor = this.parseColor(color)
    return `${x}px ${y}px ${blur}px ${spread}px ${rgbColor}${opacity})`
  }

  /**
   * 创建多层阴影
   */
  static createMultiShadow(shadows: Array<{
    x: number
    y: number
    blur: number
    spread: number
    color: string
    opacity?: number
  }>): string {
    return shadows.map(shadow =>
      this.createShadow(shadow.x, shadow.y, shadow.blur, shadow.spread, shadow.color, shadow.opacity)
    ).join(', ')
  }

  /**
   * 创建渐变
   */
  static createGradient(
    type: 'linear' | 'radial' | 'conic',
    direction: string = 'to right',
    colors: Array<{ color: string; position: string }>
  ): string {
    const colorStops = colors.map(c => `${c.color} ${c.position}`).join(', ')

    if (type === 'linear') {
      return `linear-gradient(${direction}, ${colorStops})`
    } else if (type === 'radial') {
      return `radial-gradient(${colorStops})`
    } else if (type === 'conic') {
      return `conic-gradient(from ${direction}, ${colorStops})`
    }

    return ''
  }

  /**
   * 创建玻璃态效果
   */
  static createGlassEffect(
    backgroundOpacity: number = 0.1,
    blurAmount: number = 10,
    borderOpacity: number = 0.2
  ): {
    background: string
    backdropFilter: string
    border: string
  } {
    return {
      background: `rgba(255, 255, 255, ${backgroundOpacity})`,
      backdropFilter: `blur(${blurAmount}px)`,
      border: `1px solid rgba(255, 255, 255, ${borderOpacity})`
    }
  }

  /**
   * 获取可访问性感知的表面配置
   */
  static getAccessibilityAwareSurface(
    baseConfig: {
      shadow?: string
      blur?: string
      transition?: string
    }
  ): {
    shadow?: string
    blur?: string
    transition?: string
  } {
    // 检查用户偏好
    const prefersReducedMotion = typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

    const prefersHighContrast = typeof window !== 'undefined'
      ? window.matchMedia('(prefers-contrast: high)').matches
      : false

    let shadowMultiplier = 1
    let blurMultiplier = 1
    let transitionEnabled = true

    if (prefersReducedMotion) {
      blurMultiplier = 0.5
      transitionEnabled = false
    }

    if (prefersHighContrast) {
      shadowMultiplier = 1.5
    }

    return {
      shadow: baseConfig.shadow,
      blur: baseConfig.blur,
      transition: transitionEnabled ? baseConfig.transition : 'none'
    }
  }

  /**
   * 解析颜色为 RGB 格式
   */
  private static parseColor(color: string): string {
    // 简单的颜色解析，实际项目中可能需要更复杂的实现
    if (color.startsWith('#')) {
      const hex = color.slice(1)
      const r = parseInt(hex.substr(0, 2), 16)
      const g = parseInt(hex.substr(2, 2), 16)
      const b = parseInt(hex.substr(4, 2), 16)
      return `rgba(${r}, ${g}, ${b}, `
    } else if (color.startsWith('rgb')) {
      return color.replace('rgb', 'rgba').replace(')', ', ')
    }
    return `rgba(0, 0, 0, `
  }

  /**
   * 获取表面预设配置
   */
  static getSurfacePreset(preset: string) {
    // 预设配置可以在这里定义
    const presets: Record<string, any> = {
      'card': {
        shadow: surfaceTokens.shadows['shadow-md'],
        borderRadius: surfaceTokens.borders.radius['rounded-lg'],
        background: 'rgba(255, 255, 255, 1)'
      },
      'floating-button': {
        shadow: surfaceTokens.shadows['shadow-lg'],
        borderRadius: surfaceTokens.borders.radius['rounded-full'],
        background: surfaceTokens.gradients.presets['gradient-primary']
      },
      'glass-card': surfaceTokens.glass['glass-medium'],
      'modal-overlay': surfaceTokens.glass['glass-dark-heavy']
    }

    return presets[preset]
  }
}