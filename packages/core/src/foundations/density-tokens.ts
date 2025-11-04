/**
 * 📏 密度令牌系统 - v2025.11.03
 *
 * 基于 4px 网格系统的间距、尺寸、字体标准
 * 支持七轴密度轴的动态调整
 *
 * @version 2025.11.03
 * @category Foundations
 * @layer system
 */

export const densityTokens = {
  // 基础间距系统 - 基于 4px 网格
  spacing: {
    0: '0px',
    px: '1px',
    0.5: '2px',
    1: '4px',
    1.5: '6px',
    2: '8px',
    2.5: '10px',
    3: '12px',
    3.5: '14px',
    4: '16px',
    5: '20px',
    6: '24px',
    7: '28px',
    8: '32px',
    9: '36px',
    10: '40px',
    11: '44px',
    12: '48px',
    14: '56px',
    16: '64px',
    20: '80px',
    24: '96px',
    28: '112px',
    32: '128px',
    36: '144px',
    40: '160px',
    44: '176px',
    48: '192px',
    52: '208px',
    56: '224px',
    60: '240px',
    64: '256px',
    72: '288px',
    80: '320px',
    96: '384px',
    112: '448px',
    128: '512px',
    144: '576px',
    160: '640px',
    192: '768px',
    224: '896px',
    256: '1024px'
  },

  // 密度轴变体 - 支持七轴密度轴
  'spacing-compact': {
    0: '0px',
    px: '1px',
    0.5: '1.5px',
    1: '3px',
    1.5: '4.5px',
    2: '6px',
    2.5: '7.5px',
    3: '9px',
    3.5: '10.5px',
    4: '12px',
    5: '15px',
    6: '18px',
    7: '21px',
    8: '24px',
    9: '27px',
    10: '30px',
    11: '33px',
    12: '36px',
    14: '42px',
    16: '48px',
    20: '60px',
    24: '72px',
    28: '84px',
    32: '96px',
    36: '108px',
    40: '120px',
    44: '132px',
    48: '144px',
    52: '156px',
    56: '168px',
    60: '180px',
    64: '192px',
    72: '216px',
    80: '240px',
    96: '288px'
  },

  'spacing-spacious': {
    0: '0px',
    px: '1px',
    0.5: '2.5px',
    1: '5px',
    1.5: '7.5px',
    2: '10px',
    2.5: '12.5px',
    3: '15px',
    3.5: '17.5px',
    4: '20px',
    5: '25px',
    6: '30px',
    7: '35px',
    8: '40px',
    9: '45px',
    10: '50px',
    11: '55px',
    12: '60px',
    14: '70px',
    16: '80px',
    20: '100px',
    24: '120px',
    28: '140px',
    32: '160px',
    36: '180px',
    40: '200px',
    44: '220px',
    48: '240px',
    52: '260px',
    56: '280px',
    60: '300px',
    64: '320px',
    72: '360px',
    80: '400px',
    96: '480px'
  },

  // 字号系统 - 响应式字体大小
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
    base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
    '5xl': ['3rem', { lineHeight: '1' }],         // 48px
    '6xl': ['3.75rem', { lineHeight: '1' }],      // 60px
    '7xl': ['4.5rem', { lineHeight: '1' }],       // 72px
    '8xl': ['6rem', { lineHeight: '1' }],         // 96px
    '9xl': ['8rem', { lineHeight: '1' }]          // 128px
  },

  // 字号系统 - 密度轴变体
  'fontSize-compact': {
    xs: ['0.625rem', { lineHeight: '0.875rem' }],  // 10px
    sm: ['0.75rem', { lineHeight: '1.125rem' }],   // 12px
    base: ['0.875rem', { lineHeight: '1.375rem' }], // 14px
    lg: ['1rem', { lineHeight: '1.5rem' }],        // 16px
    xl: ['1.125rem', { lineHeight: '1.625rem' }], // 18px
    '2xl': ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
    '3xl': ['1.5rem', { lineHeight: '1.875rem' }],  // 24px
    '4xl': ['1.75rem', { lineHeight: '2rem' }],   // 28px
    '5xl': ['2.25rem', { lineHeight: '1' }],       // 36px
    '6xl': ['2.75rem', { lineHeight: '1' }],      // 44px
    '7xl': ['3.25rem', { lineHeight: '1' }],      // 52px
    '8xl': ['4rem', { lineHeight: '1' }],         // 64px
    '9xl': ['5rem', { lineHeight: '1' }]          // 80px
  },

  'fontSize-spacious': {
    xs: ['0.875rem', { lineHeight: '1.125rem' }],  // 14px
    sm: ['1rem', { lineHeight: '1.375rem' }],     // 16px
    base: ['1.125rem', { lineHeight: '1.625rem' }], // 18px
    lg: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
    xl: ['1.375rem', { lineHeight: '1.875rem' }], // 22px
    '2xl': ['1.625rem', { lineHeight: '2rem' }],   // 26px
    '3xl': ['2rem', { lineHeight: '2.25rem' }],    // 32px
    '4xl': ['2.5rem', { lineHeight: '2.75rem' }], // 40px
    '5xl': ['3rem', { lineHeight: '1' }],         // 48px
    '6xl': ['3.75rem', { lineHeight: '1' }],      // 60px
    '7xl': ['4.25rem', { lineHeight: '1' }],      // 68px
    '8xl': ['5rem', { lineHeight: '1' }],         // 80px
    '9xl': ['6rem', { lineHeight: '1' }]          // 96px
  },

  // 字重系统
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900'
  },

  // 行高系统
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2'
  },

  // 字母间距
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em'
  },

  // 圆角系统 - 支持七轴圆度轴
  borderRadius: {
    none: '0px',
    sm: '2px',
    base: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    '2xl': '16px',
    '3xl': '24px',
    '4xl': '32px',
    full: '9999px'
  },

  'borderRadius-soft': {
    none: '0px',
    sm: '1px',
    base: '3px',
    md: '4px',
    lg: '6px',
    xl: '8px',
    '2xl': '12px',
    '3xl': '16px',
    '4xl': '20px',
    full: '9999px'
  },

  'borderRadius-round': {
    none: '0px',
    sm: '3px',
    base: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
    '3xl': '32px',
    '4xl': '40px',
    full: '9999px'
  },

  // 尺寸比例
  aspectRatio: {
    square: '1/1',
    video: '16/9',
    '4/3': '4/3',
    '3/2': '3/2',
    '2/1': '2/1',
    '3/4': '3/4',
    '9/16': '9/16',
    '1/2': '1/2'
  },

  // Z-index 层级系统
  zIndex: {
    hide: '-1',
    auto: 'auto',
    base: '0',
    docked: '10',
    dropdown: '1000',
    sticky: '1100',
    banner: '1200',
    overlay: '1300',
    modal: '1400',
    popover: '1500',
    skipLink: '1600',
    toast: '1700',
    tooltip: '1800'
  },

  // 图标尺寸
  iconSize: {
    xs: '12px',
    sm: '16px',
    base: '20px',
    lg: '24px',
    xl: '32px',
    '2xl': '40px',
    '3xl': '48px',
    '4xl': '56px',
    '5xl': '64px'
  },

  'iconSize-compact': {
    xs: '10px',
    sm: '12px',
    base: '16px',
    lg: '20px',
    xl: '24px',
    '2xl': '28px',
    '3xl': '32px',
    '4xl': '36px',
    '5xl': '40px'
  },

  'iconSize-spacious': {
    xs: '16px',
    sm: '20px',
    base: '24px',
    lg: '28px',
    xl: '32px',
    '2xl': '40px',
    '3xl': '48px',
    '4xl': '56px',
    '5xl': '64px',
    '6xl': '72px'
  }
} as const

// 类型定义
export type DensityTokens = typeof densityTokens
export type SpacingKey = keyof typeof densityTokens.spacing
export type FontSizeKey = keyof typeof densityTokens.fontSize
export type BorderRadiusKey = keyof typeof densityTokens.borderRadius

/**
 * 密度令牌验证器
 */
export class DensityTokenValidator {
  static validateSpacingTokens(): ValidationResult {
    const issues: string[] = []
    const warnings: string[] = []

    // 验证间距系统基于 4px 网格
    Object.entries(densityTokens.spacing).forEach(([key, value]) => {
      if (key !== '0' && key !== 'px') {
        const pixelValue = parseInt(value)
        if (pixelValue % 4 !== 0 && pixelValue !== 0) {
          warnings.push(`间距值 ${key}: ${value} 未严格遵循 4px 网格系统`)
        }
      }
    })

    // 验证字号递进关系
    const fontSizeKeys = Object.keys(densityTokens.fontSize)
    const fontSizePixels = fontSizeKeys.map(key =>
      parseInt(densityTokens.fontSize[key as FontSizeKey][0])
    )

    for (let i = 1; i < fontSizePixels.length; i++) {
      if (fontSizePixels[i] <= fontSizePixels[i - 1]) {
        warnings.push(`字号 ${fontSizeKeys[i]} 不大于 ${fontSizeKeys[i - 1]}`)
      }
    }

    // 验证圆角系统
    const borderRadiusKeys = Object.keys(densityTokens.borderRadius)
    const borderRadiusPixels = borderRadiusKeys.map(key =>
      parseInt(densityTokens.borderRadius[key as BorderRadiusKey])
    )

    for (let i = 1; i < borderRadiusPixels.length; i++) {
      if (borderRadiusPixels[i] <= borderRadiusPixels[i - 1]) {
        warnings.push(`圆角 ${borderRadiusKeys[i]} 不大于 ${borderRadiusKeys[i - 1]}`)
      }
    }

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
export const densityValidationResult = DensityTokenValidator.validateSpacingTokens()

/**
 * 密度计算工具
 */
export class DensityCalculator {
  /**
   * 根据密度轴调整间距值
   */
  static adjustSpacing(baseSpacing: number, density: 'compact' | 'comfortable' | 'spacious'): number {
    const multipliers = {
      compact: 0.85,
      comfortable: 1.0,
      spacious: 1.25
    }

    return Math.round(baseSpacing * multipliers[density])
  }

  /**
   * 根据密度轴调整字体大小
   */
  static adjustFontSize(baseFontSize: number, density: 'compact' | 'comfortable' | 'spacious'): number {
    const multipliers = {
      compact: 0.875,
      comfortable: 1.0,
      spacious: 1.125
    }

    return Math.round(baseFontSize * multipliers[density])
  }

  /**
   * 根据密度轴调整圆角
   */
  static adjustBorderRadius(baseRadius: number, density: 'flat' | 'soft' | 'round'): number {
    const multipliers = {
      flat: 0.75,
      soft: 1.0,
      round: 1.25
    }

    return Math.round(baseRadius * multipliers[density])
  }
}