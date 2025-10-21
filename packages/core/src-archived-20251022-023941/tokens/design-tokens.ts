/**
 * Xorigo UI 设计令牌系统 v1.1
 *
 * 统一的设计变量定义，确保所有组件的一致性
 * 支持主题切换和响应式设计
 */

// =============================================================================
// 基础设计令牌
// =============================================================================

export const designTokens = {
  // 间距系统 - 4px基准网格
  spacing: {
    // 基础间距
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
  },

  // 语义化间距
  semanticSpacing: {
    xs: '4px',    // 0.25rem - 最小间距
    sm: '8px',    // 0.5rem  - 小间距
    md: '16px',   // 1rem   - 中等间距
    lg: '24px',   // 1.5rem - 大间距
    xl: '32px',   // 2rem   - 超大间距
    '2xl': '48px', // 3rem   - 特大间距
    '3xl': '64px', // 4rem   - 最大间距
  },

  // 尺寸系统
  sizes: {
    // 组件高度
    height: {
      xs: '24px',  // 1.5rem
      sm: '32px',  // 2rem
      md: '40px',  // 2.5rem
      lg: '48px',  // 3rem
      xl: '56px',  // 3.5rem
      '2xl': '64px', // 4rem
    },
    // 组件宽度
    width: {
      auto: 'auto',
      full: '100%',
      screen: '100vw',
      min: 'min-content',
      max: 'max-content',
      fit: 'fit-content',
    },
    // 圆角
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
  },

  // 字体系统
  typography: {
    // 字体族
    fontFamily: {
      sans: [
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Oxygen',
        'Ubuntu',
        'Cantarell',
        'Fira Sans',
        'Droid Sans',
        'Helvetica Neue',
        'sans-serif',
      ],
      serif: [
        'Georgia',
        'Cambria',
        'Times New Roman',
        'Times',
        'serif',
      ],
      mono: [
        'Menlo',
        'Monaco',
        'Consolas',
        'Liberation Mono',
        'Courier New',
        'monospace',
      ],
    },
    // 字体大小
    fontSize: {
      xs: ['12px', { lineHeight: '16px' }],     // 0.75rem, 1rem
      sm: ['14px', { lineHeight: '20px' }],     // 0.875rem, 1.25rem
      base: ['16px', { lineHeight: '24px' }],   // 1rem, 1.5rem
      lg: ['18px', { lineHeight: '28px' }],     // 1.125rem, 1.75rem
      xl: ['20px', { lineHeight: '28px' }],     // 1.25rem, 1.75rem
      '2xl': ['24px', { lineHeight: '32px' }],  // 1.5rem, 2rem
      '3xl': ['30px', { lineHeight: '36px' }],  // 1.875rem, 2.25rem
      '4xl': ['36px', { lineHeight: '40px' }],  // 2.25rem, 2.5rem
      '5xl': ['48px', { lineHeight: '1' }],     // 3rem, 1
      '6xl': ['60px', { lineHeight: '1' }],     // 3.75rem, 1
      '7xl': ['72px', { lineHeight: '1' }],     // 4.5rem, 1
      '8xl': ['96px', { lineHeight: '1' }],     // 6rem, 1
      '9xl': ['128px', { lineHeight: '1' }],    // 8rem, 1
    },
    // 字重
    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
    // 行高
    lineHeight: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
    // 字母间距
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },

  // 颜色系统
  colors: {
    // 主题色
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },
    // 辅助色
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617',
    },
    // 成功色
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      950: '#052e16',
    },
    // 警告色
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      950: '#451a03',
    },
    // 危险色
    danger: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a',
    },
    // 中性色
    neutral: {
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
      950: '#09090b',
    },
    // 特殊色
    white: '#ffffff',
    black: '#000000',
    transparent: 'transparent',
    current: 'currentColor',
    inherit: 'inherit',
  },

  // 阴影系统
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: '0 0 #0000',
  },

  // 边框系统
  borders: {
    width: {
      0: '0px',
      1: '1px',
      2: '2px',
      4: '4px',
      8: '8px',
    },
    style: {
      solid: 'solid',
      dashed: 'dashed',
      dotted: 'dotted',
      double: 'double',
      groove: 'groove',
      ridge: 'ridge',
      inset: 'inset',
      outset: 'outset',
      hidden: 'hidden',
      none: 'none',
    },
  },

  // 动画系统
  animation: {
    // 动画时长
    duration: {
      75: '75ms',
      100: '100ms',
      150: '150ms',
      200: '200ms',
      300: '300ms',
      500: '500ms',
      700: '700ms',
      1000: '1000ms',
    },
    // 缓动函数
    easing: {
      linear: 'linear',
      ease: 'ease',
      'ease-in': 'ease-in',
      'ease-out': 'ease-out',
      'ease-in-out': 'ease-in-out',
      // Material Design 缓动
      'ease-quad': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      'ease-cubic': 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      'ease-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
      'ease-back': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    // 动画预设
    presets: {
      'fade-in': 'fadeIn 0.2s ease-out',
      'fade-out': 'fadeOut 0.2s ease-out',
      'slide-in-up': 'slideInUp 0.3s ease-out',
      'slide-in-down': 'slideInDown 0.3s ease-out',
      'slide-in-left': 'slideInLeft 0.3s ease-out',
      'slide-in-right': 'slideInRight 0.3s ease-out',
      'scale-in': 'scaleIn 0.2s ease-out',
      'bounce-in': 'bounceIn 0.6s ease-out',
    },
  },

  // 断点系统
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Z-index 系统
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },

  // 透明度系统
  opacity: {
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
  },
} as const

// =============================================================================
// 语义化令牌
// =============================================================================

export const semanticTokens = {
  // 文本颜色
  text: {
    primary: 'var(--color-text-primary)',
    secondary: 'var(--color-text-secondary)',
    tertiary: 'var(--color-text-tertiary)',
    inverse: 'var(--color-text-inverse)',
    disabled: 'var(--color-text-disabled)',
    placeholder: 'var(--color-text-placeholder)',
    link: 'var(--color-text-link)',
    error: 'var(--color-text-error)',
    warning: 'var(--color-text-warning)',
    success: 'var(--color-text-success)',
  },

  // 背景颜色
  background: {
    primary: 'var(--color-bg-primary)',
    secondary: 'var(--color-bg-secondary)',
    tertiary: 'var(--color-bg-tertiary)',
    inverse: 'var(--color-bg-inverse)',
    disabled: 'var(--color-bg-disabled)',
    overlay: 'var(--color-bg-overlay)',
    subtle: 'var(--color-bg-subtle)',
  },

  // 边框颜色
  border: {
    primary: 'var(--color-border-primary)',
    secondary: 'var(--color-border-secondary)',
    tertiary: 'var(--color-border-tertiary)',
    inverse: 'var(--color-border-inverse)',
    disabled: 'var(--color-border-disabled)',
    focus: 'var(--color-border-focus)',
    error: 'var(--color-border-error)',
    warning: 'var(--color-border-warning)',
    success: 'var(--color-border-success)',
  },

  // 交互状态
  interactive: {
    hover: 'var(--color-interactive-hover)',
    active: 'var(--color-interactive-active)',
    focus: 'var(--color-interactive-focus)',
    disabled: 'var(--color-interactive-disabled)',
  },
} as const

// =============================================================================
// 组件特定令牌
// =============================================================================

export const componentTokens = {
  // Button 组件令牌
  button: {
    height: {
      xs: '28px',
      sm: '32px',
      md: '40px',
      lg: '48px',
      xl: '56px',
    },
    padding: {
      xs: '0 12px',
      sm: '0 16px',
      md: '0 20px',
      lg: '0 24px',
      xl: '0 32px',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
    },
    borderRadius: {
      sm: '4px',
      md: '6px',
      lg: '8px',
    },
  },

  // Input 组件令牌
  input: {
    height: {
      sm: '32px',
      md: '40px',
      lg: '48px',
    },
    padding: {
      sm: '0 12px',
      md: '0 16px',
      lg: '0 20px',
    },
    fontSize: {
      sm: '14px',
      md: '16px',
      lg: '18px',
    },
    borderRadius: {
      sm: '4px',
      md: '6px',
      lg: '8px',
    },
  },

  // Card 组件令牌
  card: {
    padding: {
      sm: '16px',
      md: '24px',
      lg: '32px',
      xl: '40px',
    },
    borderRadius: {
      sm: '6px',
      md: '8px',
      lg: '12px',
      xl: '16px',
    },
    gap: {
      sm: '12px',
      md: '16px',
      lg: '20px',
      xl: '24px',
    },
  },

  // Modal 组件令牌
  modal: {
    width: {
      sm: '400px',
      md: '600px',
      lg: '800px',
      xl: '1000px',
      full: '100%',
    },
    borderRadius: {
      sm: '8px',
      md: '12px',
      lg: '16px',
    },
    padding: {
      sm: '20px',
      md: '24px',
      lg: '32px',
    },
  },
} as const

// =============================================================================
// 主题配置
// =============================================================================

export interface ThemeConfig {
  name: string
  colors: {
    [key: string]: string
  }
  darkMode?: boolean
}

// 默认主题
export const defaultTheme: ThemeConfig = {
  name: 'default',
  colors: {
    '--color-text-primary': '#0f172a',
    '--color-text-secondary': '#475569',
    '--color-text-tertiary': '#64748b',
    '--color-text-inverse': '#ffffff',
    '--color-text-disabled': '#94a3b8',
    '--color-text-placeholder': '#94a3b8',
    '--color-text-link': '#2563eb',
    '--color-text-error': '#dc2626',
    '--color-text-warning': '#d97706',
    '--color-text-success': '#16a34a',

    '--color-bg-primary': '#ffffff',
    '--color-bg-secondary': '#f8fafc',
    '--color-bg-tertiary': '#f1f5f9',
    '--color-bg-inverse': '#1e293b',
    '--color-bg-disabled': '#f1f5f9',
    '--color-bg-overlay': 'rgba(0, 0, 0, 0.5)',
    '--color-bg-subtle': '#f8fafc',

    '--color-border-primary': '#e2e8f0',
    '--color-border-secondary': '#cbd5e1',
    '--color-border-tertiary': '#94a3b8',
    '--color-border-inverse': '#334155',
    '--color-border-disabled': '#e2e8f0',
    '--color-border-focus': '#3b82f6',
    '--color-border-error': '#ef4444',
    '--color-border-warning': '#f59e0b',
    '--color-border-success': '#22c55e',

    '--color-interactive-hover': '#f1f5f9',
    '--color-interactive-active': '#e2e8f0',
    '--color-interactive-focus': '#dbeafe',
    '--color-interactive-disabled': '#f8fafc',
  },
  darkMode: false,
}

// 暗色主题
export const darkTheme: ThemeConfig = {
  name: 'dark',
  colors: {
    '--color-text-primary': '#f8fafc',
    '--color-text-secondary': '#cbd5e1',
    '--color-text-tertiary': '#94a3b8',
    '--color-text-inverse': '#0f172a',
    '--color-text-disabled': '#64748b',
    '--color-text-placeholder': '#64748b',
    '--color-text-link': '#60a5fa',
    '--color-text-error': '#f87171',
    '--color-text-warning': '#fbbf24',
    '--color-text-success': '#4ade80',

    '--color-bg-primary': '#0f172a',
    '--color-bg-secondary': '#1e293b',
    '--color-bg-tertiary': '#334155',
    '--color-bg-inverse': '#ffffff',
    '--color-bg-disabled': '#334155',
    '--color-bg-overlay': 'rgba(0, 0, 0, 0.7)',
    '--color-bg-subtle': '#1e293b',

    '--color-border-primary': '#334155',
    '--color-border-secondary': '#475569',
    '--color-border-tertiary': '#64748b',
    '--color-border-inverse': '#e2e8f0',
    '--color-border-disabled': '#334155',
    '--color-border-focus': '#3b82f6',
    '--color-border-error': '#ef4444',
    '--color-border-warning': '#f59e0b',
    '--color-border-success': '#22c55e',

    '--color-interactive-hover': '#334155',
    '--color-interactive-active': '#475569',
    '--color-interactive-focus': '#1e3a8a',
    '--color-interactive-disabled': '#334155',
  },
  darkMode: true,
}

// =============================================================================
// 工具函数
// =============================================================================

/**
 * 获取设计令牌值
 */
export const getToken = (path: string, fallback?: string): string => {
  // 解析路径，例如 'spacing.md' -> designTokens.spacing.md
  const keys = path.split('.')
  let value: any = designTokens

  for (const key of keys) {
    value = value?.[key]
  }

  return value || fallback || ''
}

/**
 * 获取语义令牌值
 */
export const getSemanticToken = (path: string, fallback?: string): string => {
  const keys = path.split('.')
  let value: any = semanticTokens

  for (const key of keys) {
    value = value?.[key]
  }

  return value || fallback || ''
}

/**
 * 获取组件令牌值
 */
export const getComponentToken = (component: string, path: string, fallback?: string): string => {
  const keys = path.split('.')
  let value: any = componentTokens[component]

  for (const key of keys) {
    value = value?.[key]
  }

  return value || fallback || ''
}

/**
 * 响应式令牌值
 */
export const getResponsiveToken = (breakpoint: string, value: any): string => {
  return Array.isArray(value) ? value[0] : value
}

// 导出类型
export type DesignTokens = typeof designTokens
export type SemanticTokens = typeof semanticTokens
export type ComponentTokens = typeof componentTokens
export type Theme = ThemeConfig