/**
 * Xorigo UI 表面材质系统 - 基于七轴主题系统 v1.4 SSOT
 *
 * 从 src-archived-20251022-023941/tokens/design-tokens.ts 迁移并适配七轴系统
 */

// =============================================================================
// 基础阴影系统
// =============================================================================

export const shadowTokens = {
  // 基础阴影等级
  none: '0 0 #0000',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',

  // 主题化阴影
  light: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
  dark: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.25)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.2)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.3)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.4)',
  },
} as const

// =============================================================================
// 模糊效果系统
// =============================================================================

export const blurTokens = {
  none: '0px',
  sm: '2px',
  md: '4px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  '3xl': '24px',
  '4xl': '32px',
  // 特殊模糊效果
  glass: '12px',
  'glass-strong': '24px',
  backdrop: '8px',
  'backdrop-strong': '16px',
} as const

// =============================================================================
// 发光效果系统
// =============================================================================

export const glowTokens = {
  none: '0 0 0 transparent',
  subtle: '0 0 8px rgb(59 130 246 / 0.1)',
  primary: '0 0 12px rgb(59 130 246 / 0.25)',
  secondary: '0 0 8px rgb(107 114 128 / 0.2)',
  success: '0 0 8px rgb(34 197 94 / 0.3)',
  warning: '0 0 8px rgb(245 158 11 / 0.3)',
  danger: '0 0 8px rgb(239 68 68 / 0.3)',
  info: '0 0 8px rgb(14 165 233 / 0.3)',

  // 动态发光
  pulse: '0 0 16px rgb(59 130 246 / 0.5)',
  neon: '0 0 24px rgb(59 130 246 / 0.8)',
  rainbow: '0 0 32px linear-gradient(45deg, #ff0080, #00ff00, #00ffff)',
} as const

// =============================================================================
// 表面轴变体 - 用于七轴 surface 轴
// =============================================================================

export const surfaceVariants = {
  // 平面 (flat) - 无阴影，纯色表面
  flat: {
    shadow: 'none',
    blur: '0px',
    glow: '0 0 0 transparent',
    border: '1px solid var(--color-border-primary)',
    background: 'var(--color-bg-primary)',
    backdrop: 'none',
  },

  // 柔和阴影 (soft-shadow) - 轻微阴影，传统界面风格
  'soft-shadow': {
    shadow: '0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1)',
    blur: '0px',
    glow: '0 0 0 transparent',
    border: '1px solid var(--color-border-secondary)',
    background: 'var(--color-bg-primary)',
    backdrop: 'none',
  },

  // 玻璃 (glass) - 半透明背景 + 模糊效果
  glass: {
    shadow: '0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
    blur: '12px',
    glow: '0 0 0 transparent',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    background: 'rgba(255, 255, 255, 0.1)',
    backdrop: 'blur(12px) saturate(180%)',
  },

  // 霓虹 (neon) - 发光效果，科技感
  neon: {
    shadow: '0 0 0 transparent',
    blur: '0px',
    glow: '0 0 24px rgb(59 130 246 / 0.8), 0 0 48px rgb(59 130 246 / 0.4)',
    border: '1px solid var(--color-primary-500)',
    background: 'var(--color-bg-primary)',
    backdrop: 'none',
  },

  // 玻璃+霓虹 (glass+neon) - 组合效果
  'glass+neon': {
    shadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    blur: '12px',
    glow: '0 0 32px rgb(59 130 246 / 0.6), 0 0 64px rgb(59 130 246 / 0.3)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    background: 'rgba(59, 130, 246, 0.05)',
    backdrop: 'blur(12px) saturate(180%)',
  },

  // 新增变体
  // 丝绸 (silk) - 高光效果，丝绸质感
  silk: {
    shadow: '0 2px 8px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    blur: '0px',
    glow: '0 0 4px rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
    backdrop: 'none',
  },

  // 磨砂 (frosted) - 磨砂玻璃效果
  frosted: {
    shadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    blur: '24px',
    glow: '0 0 0 transparent',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(255, 255, 255, 0.05)',
    backdrop: 'blur(24px) saturate(120%)',
  },

  // 金属 (metallic) - 金属反射效果
  metallic: {
    shadow: '0 1px 3px rgba(0, 0, 0, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.3)',
    blur: '0px',
    glow: '0 0 2px rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
    backdrop: 'none',
  },
} as const

// =============================================================================
// 透明度系统
// =============================================================================

export const opacityTokens = {
  0: '0',
  5: '0.05',
  10: '0.1',
  20: '0.2',
  25: '0.25',
  30: '0.3',
  40: '0.4',
  50: '0.5',
  60: '0.6',
  70: '0.7',
  75: '0.75',
  80: '0.8',
  90: '0.9',
  95: '0.95',
  100: '1',
} as const

// =============================================================================
// 表面材质生成器
// =============================================================================

export class SurfaceTokenGenerator {
  // 根据 surface 轴生成表面配置
  static generateSurfaceConfig(surface: keyof typeof surfaceVariants) {
    return surfaceVariants[surface]
  }

  // 生成主题自适应阴影
  static generateThemedShadow(
    size: keyof typeof shadowTokens.light,
    mode: 'light' | 'dark' = 'light'
  ): string {
    return shadowTokens[mode][size]
  }

  // 生成自定义发光效果
  static generateCustomGlow(
    color: string,
    intensity: number,
    size: number = 16
  ): string {
    const rgbaColor = color.replace('rgb', 'rgba').replace(')', `, ${intensity})`)
    return `0 0 ${size}px ${rgbaColor}`
  }

  // 生成玻璃效果配置
  static generateGlassConfig(
    opacity: number = 0.1,
    blur: string = '12px',
    saturation: number = 180
  ): {
    background: string
    backdrop: string
    border: string
  } {
    return {
      background: `rgba(255, 255, 255, ${opacity})`,
      backdrop: `blur(${blur}) saturate(${saturation}%)`,
      border: `1px solid rgba(255, 255, 255, ${opacity * 2})`
    }
  }

  // 生成完整的 CSS 变量定义
  static generateCSSVariables(surface: keyof typeof surfaceVariants = 'flat'): string {
    const config = surfaceVariants[surface]
    const cssVars = []

    // 生成表面配置变量
    cssVars.push(`  --surface-shadow: ${config.shadow};`)
    cssVars.push(`  --surface-blur: ${config.blur};`)
    cssVars.push(`  --surface-glow: ${config.glow};`)
    cssVars.push(`  --surface-border: ${config.border};`)
    cssVars.push(`  --surface-background: ${config.background};`)
    cssVars.push(`  --surface-backdrop: ${config.backdrop};`)

    // 生成基础阴影变量
    Object.entries(shadowTokens.light).forEach(([key, value]) => {
      if (typeof value === 'string') {
        cssVars.push(`  --shadow-light-${key}: ${value};`)
      }
    })

    Object.entries(shadowTokens.dark).forEach(([key, value]) => {
      if (typeof value === 'string') {
        cssVars.push(`  --shadow-dark-${key}: ${value};`)
      }
    })

    // 生成基础模糊变量
    Object.entries(blurTokens).forEach(([key, value]) => {
      cssVars.push(`  --blur-${key}: ${value};`)
    })

    // 生成基础发光变量
    Object.entries(glowTokens).forEach(([key, value]) => {
      cssVars.push(`  --glow-${key}: ${value};`)
    })

    // 生成透明度变量
    Object.entries(opacityTokens).forEach(([key, value]) => {
      cssVars.push(`  --opacity-${key}: ${value};`)
    })

    return `:root {\n${cssVars.join('\n')}\n}`
  }

  // 计算表面材质性能评分
  static calculateSurfacePerformance(surface: keyof typeof surfaceVariants): {
    score: number
    recommendations: string[]
  } {
    const config = surfaceVariants[surface]
    let score = 100
    const recommendations: string[] = []

    // 模糊效果评分
    if (config.blur !== '0px') {
      const blurValue = parseInt(config.blur)
      if (blurValue > 16) {
        score -= 20
        recommendations.push('模糊值较大，可能影响性能')
      } else if (blurValue > 8) {
        score -= 10
        recommendations.push('适中的模糊效果')
      }
    }

    // 发光效果评分
    if (config.glow !== '0 0 0 transparent') {
      score -= 15
      recommendations.push('发光效果会增加性能开销')
    }

    // 背景效果评分
    if (config.backdrop !== 'none') {
      score -= 25
      recommendations.push('backdrop-filter 对性能影响较大')
    }

    // 阴影评分
    if (config.shadow !== 'none') {
      const shadowCount = config.shadow.split(',').length
      if (shadowCount > 2) {
        score -= 10
        recommendations.push('多层阴影可能影响性能')
      }
    }

    if (recommendations.length === 0) {
      recommendations.push('表面材质性能优秀')
    }

    return { score: Math.max(0, score), recommendations }
  }

  // 获取表面材质的语义描述
  static getSurfaceDescription(surface: keyof typeof surfaceVariants): string {
    const descriptions = {
      flat: '平面设计，无装饰效果，适合极简风格',
      'soft-shadow': '柔和阴影，传统界面风格，适合专业应用',
      glass: '玻璃质感，现代感强，适合创意类应用',
      neon: '霓虹发光，科技感强烈，适合游戏或娱乐类应用',
      'glass+neon': '玻璃与霓虹组合，未来感强烈，视觉冲击力强',
      silk: '丝绸质感，高光效果，适合高端商务应用',
      frosted: '磨砂质感，隐私保护，适合模态框和遮罩',
      metallic: '金属反射，质感强烈，适合工业风格应用'
    }
    return descriptions[surface]
  }
}

// =============================================================================
// 类型定义
// =============================================================================

export type SurfaceVariant = typeof surfaceVariants
export type SurfaceMode = keyof typeof surfaceVariants
export type ShadowToken = typeof shadowTokens
export type BlurToken = typeof blurTokens
export type GlowToken = typeof glowTokens
export type OpacityToken = typeof opacityTokens

// 保持向后兼容的简化导出
export const surfaceTokens = {
  flat: { shadow: 'none', blur: 0, glow: 0 },
  'soft-shadow': { shadow: '0 4px 16px rgba(0,0,0,0.08)', blur: 0, glow: 0 },
  glass: { shadow: '0 8px 24px rgba(0,0,0,0.15)', blur: 12, glow: 0 },
  neon: { shadow: '0 0 0 transparent', blur: 0, glow: 1 }
} as const;

export type SurfaceTokens = keyof typeof surfaceTokens;

// =============================================================================
// 导出默认配置
// =============================================================================

export const defaultSurfaceConfig = {
  ...surfaceVariants,
  shadows: shadowTokens,
  blurs: blurTokens,
  glows: glowTokens,
  opacity: opacityTokens,
  generator: new SurfaceTokenGenerator(),
  cssVariables: SurfaceTokenGenerator.generateCSSVariables(),
}
