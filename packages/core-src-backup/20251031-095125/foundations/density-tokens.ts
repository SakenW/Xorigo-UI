/**
 * Xorigo UI 密度令牌系统 - 基于七轴主题系统 v1.4 SSOT
 *
 * 从 src-archived-20251022-023941/tokens/design-tokens.ts 迁移并适配七轴系统
 */

// =============================================================================
// 基础间距系统 - 4px基准网格
// =============================================================================

export const spacingTokens = {
  // 基础间距 (4px基准网格)
  0: '0px',
  px: '1px',    // 0.25rem
  0.5: '2px',  // 0.125rem
  1: '4px',    // 0.25rem
  1.5: '6px',  // 0.375rem
  2: '8px',    // 0.5rem
  2.5: '10px', // 0.625rem
  3: '12px',   // 0.75rem
  3.5: '14px', // 0.875rem
  4: '16px',   // 1rem
  5: '20px',   // 1.25rem
  6: '24px',   // 1.5rem
  7: '28px',   // 1.75rem
  8: '32px',   // 2rem
  9: '36px',   // 2.25rem
  10: '40px',  // 2.5rem
  11: '44px',  // 2.75rem
  12: '48px',  // 3rem
  14: '56px',  // 3.5rem
  16: '64px',  // 4rem
  20: '80px',  // 5rem
  24: '96px',  // 6rem
  28: '112px', // 7rem
  32: '128px', // 8rem
  36: '144px', // 9rem
  40: '160px', // 10rem
  44: '176px', // 11rem
  48: '192px', // 12rem
  52: '208px', // 13rem
  56: '224px', // 14rem
  60: '240px', // 15rem
  64: '256px', // 16rem
  72: '288px', // 18rem
  80: '320px', // 20rem
  96: '384px', // 24rem
} as const

// =============================================================================
// 密度轴变体 - 用于七轴 density 轴
// =============================================================================

export const densityVariants = {
  // 紧凑密度 (compact) - 高信息密度，减少留白
  compact: {
    // 紧凑间距 - 基础值的 0.75 倍
    spacing: {
      xs: '2px',    // 8px * 0.75 = 6px
      sm: '3px',    // 8px * 0.75 = 6px
      md: '4px',    // 16px * 0.75 = 12px
      lg: '6px',    // 24px * 0.75 = 18px
      xl: '8px',    // 32px * 0.75 = 24px
      '2xl': '12px', // 48px * 0.75 = 36px
      '3xl': '16px', // 64px * 0.75 = 48px
    },
    // 紧凑组件尺寸
    componentHeight: {
      xs: '20px',   // 24px * 0.83
      sm: '28px',   // 32px * 0.875
      md: '36px',   // 40px * 0.9
      lg: '44px',   // 48px * 0.917
      xl: '52px',   // 56px * 0.929
      '2xl': '60px', // 64px * 0.938
    },
    // 紧凑内边距
    padding: {
      xs: '2px 8px',
      sm: '3px 12px',
      md: '4px 16px',
      lg: '6px 20px',
      xl: '8px 24px',
      '2xl': '12px 32px',
    },
    // 紧凑字体大小
    fontSize: {
      xs: '11px',
      sm: '13px',
      md: '15px',
      lg: '17px',
      xl: '19px',
      '2xl': '21px',
    },
  },

  // 舒适密度 (comfortable) - 标准间距，平衡密度与可读性
  comfortable: {
    // 标准间距
    spacing: {
      xs: '4px',    // 8px
      sm: '8px',    // 8px
      md: '16px',   // 16px
      lg: '24px',   // 24px
      xl: '32px',   // 32px
      '2xl': '48px', // 48px
      '3xl': '64px', // 64px
    },
    // 标准组件尺寸
    componentHeight: {
      xs: '24px',
      sm: '32px',
      md: '40px',
      lg: '48px',
      xl: '56px',
      '2xl': '64px',
    },
    // 标准内边距
    padding: {
      xs: '4px 12px',
      sm: '8px 16px',
      md: '12px 20px',
      lg: '16px 24px',
      xl: '20px 32px',
      '2xl': '24px 40px',
    },
    // 标准字体大小
    fontSize: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
    },
  },

  // 宽松密度 (spacious) - 增加留白，提高可读性
  spacious: {
    // 宽松间距 - 基础值的 1.25 倍
    spacing: {
      xs: '6px',    // 8px * 1.25 = 10px
      sm: '10px',   // 8px * 1.25 = 10px
      md: '20px',   // 16px * 1.25 = 20px
      lg: '30px',   // 24px * 1.25 = 30px
      xl: '40px',   // 32px * 1.25 = 40px
      '2xl': '60px', // 48px * 1.25 = 60px
      '3xl': '80px', // 64px * 1.25 = 80px
    },
    // 宽松组件尺寸
    componentHeight: {
      xs: '28px',   // 24px * 1.17
      sm: '36px',   // 32px * 1.125
      md: '44px',   // 40px * 1.1
      lg: '52px',   // 48px * 1.083
      xl: '60px',   // 56px * 1.071
      '2xl': '68px', // 64px * 1.063
    },
    // 宽松内边距
    padding: {
      xs: '6px 16px',
      sm: '10px 20px',
      md: '16px 24px',
      lg: '20px 28px',
      xl: '24px 36px',
      '2xl': '30px 48px',
    },
    // 宽松字体大小
    fontSize: {
      xs: '13px',
      sm: '15px',
      md: '17px',
      lg: '19px',
      xl: '21px',
      '2xl': '26px',
    },
  },
} as const

// =============================================================================
// 尺寸系统
// =============================================================================

export const sizeTokens = {
  // 组件宽度
  width: {
    auto: 'auto',
    full: '100%',
    screen: '100vw',
    min: 'min-content',
    max: 'max-content',
    fit: 'fit-content',
  },
  // 圆角系统
  borderRadius: {
    none: '0px',
    sm: '2px',
    DEFAULT: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    '2xl': '16px',
    '3xl': '24px',
    full: '9999px',
  },
  // 边框宽度
  borderWidth: {
    0: '0px',
    1: '1px',
    2: '2px',
    4: '4px',
    8: '8px',
  },
} as const

// =============================================================================
// 密度令牌生成器
// =============================================================================

export class DensityTokenGenerator {
  // 根据 density 轴生成间距配置
  static generateSpacingConfig(density: 'compact' | 'comfortable' | 'spacious') {
    return densityVariants[density].spacing
  }

  // 根据 density 轴生成组件尺寸配置
  static generateComponentSizeConfig(density: 'compact' | 'comfortable' | 'spacious') {
    return densityVariants[density].componentHeight
  }

  // 根据 density 轴生成内边距配置
  static generatePaddingConfig(density: 'compact' | 'comfortable' | 'spacious') {
    return densityVariants[density].padding
  }

  // 根据 density 轴生成字体大小配置
  static generateFontSizeConfig(density: 'compact' | 'comfortable' | 'spacious') {
    return densityVariants[density].fontSize
  }

  // 生成完整的 CSS 变量定义
  static generateCSSVariables(density: 'compact' | 'comfortable' | 'spacious' = 'comfortable'): string {
    const config = densityVariants[density]
    const cssVars = []

    // 生成间距变量
    Object.entries(config.spacing).forEach(([key, value]) => {
      cssVars.push(`  --spacing-${key}: ${value};`)
    })

    // 生成组件高度变量
    Object.entries(config.componentHeight).forEach(([key, value]) => {
      cssVars.push(`  --component-height-${key}: ${value};`)
    })

    // 生成内边距变量
    Object.entries(config.padding).forEach(([key, value]) => {
      cssVars.push(`  --component-padding-${key}: ${value};`)
    })

    // 生成字体大小变量
    Object.entries(config.fontSize).forEach(([key, value]) => {
      cssVars.push(`  --font-size-${key}: ${value};`)
    })

    // 生成基础间距变量
    Object.entries(spacingTokens).forEach(([key, value]) => {
      cssVars.push(`  --spacing-base-${key}: ${value};`)
    })

    // 生成尺寸变量
    Object.entries(sizeTokens.borderRadius).forEach(([key, value]) => {
      cssVars.push(`  --radius-${key}: ${value};`)
    })

    Object.entries(sizeTokens.borderWidth).forEach(([key, value]) => {
      cssVars.push(`  --border-width-${key}: ${value};`)
    })

    return `:root {\n${cssVars.join('\n')}\n}`
  }

  // 计算密度对布局的影响
  static calculateDensityImpact(
    density: 'compact' | 'comfortable' | 'spacious',
    baseSize: number
  ): number {
    const multipliers = {
      compact: 0.85,
      comfortable: 1.0,
      spacious: 1.15
    }
    return Math.round(baseSize * multipliers[density])
  }

  // 获取密度对应的语义描述
  static getDensityDescription(density: 'compact' | 'comfortable' | 'spacious'): string {
    const descriptions = {
      compact: '高密度布局，适合数据密集型界面',
      comfortable: '标准密度布局，平衡信息密度与可读性',
      spacious: '宽松布局，强调内容呼吸感和可读性'
    }
    return descriptions[density]
  }
}

// =============================================================================
// 类型定义
// =============================================================================

export type DensityToken = typeof densityVariants
export type DensityMode = keyof typeof densityVariants
export type SpacingToken = typeof spacingTokens
export type SizeToken = typeof sizeTokens

// 保持向后兼容的简化导出
export const densityTokens = {
  spacious: { gap: '24px', padding: '24px' },
  comfortable: { gap: '16px', padding: '16px' },
  compact: { gap: '12px', padding: '12px' }
} as const;

export type DensityTokens = keyof typeof densityTokens;

// =============================================================================
// 导出默认配置
// =============================================================================

export const defaultDensityConfig = {
  ...densityVariants,
  spacing: spacingTokens,
  sizes: sizeTokens,
  generator: new DensityTokenGenerator(),
  cssVariables: DensityTokenGenerator.generateCSSVariables(),
}
