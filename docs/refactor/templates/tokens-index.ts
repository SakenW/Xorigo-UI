// 设计令牌系统模板 - 支持 CSS 变量映射和主题切换

// 基础颜色定义（OKLCH 色彩空间）
export const baseColors = {
  // 主色调
  blue: {
    50: 'oklch(0.98 0.014 238.66)',
    100: 'oklch(0.96 0.028 238.66)',
    200: 'oklch(0.93 0.056 238.66)',
    300: 'oklch(0.88 0.11 238.66)',
    400: 'oklch(0.81 0.16 238.66)',
    500: 'oklch(0.72 0.19 238.66)', // 主色
    600: 'oklch(0.61 0.16 238.66)',
    700: 'oklch(0.52 0.13 238.66)',
    800: 'oklch(0.42 0.11 238.66)',
    900: 'oklch(0.33 0.09 238.66)',
    950: 'oklch(0.24 0.07 238.66)',
  },

  // 中性色
  gray: {
    50: 'oklch(0.98 0.006 264.38)',
    100: 'oklch(0.96 0.013 264.38)',
    200: 'oklch(0.92 0.026 264.38)',
    300: 'oklch(0.84 0.039 264.38)',
    400: 'oklch(0.73 0.052 264.38)',
    500: 'oklch(0.62 0.065 264.38)',
    600: 'oklch(0.47 0.058 264.38)',
    700: 'oklch(0.36 0.052 264.38)',
    800: 'oklch(0.27 0.046 264.38)',
    900: 'oklch(0.21 0.039 264.38)',
    950: 'oklch(0.15 0.033 264.38)',
  },

  // 功能色
  red: {
    50: 'oklch(0.97 0.031 27.33)',
    100: 'oklch(0.94 0.062 27.33)',
    200: 'oklch(0.89 0.124 27.33)',
    300: 'oklch(0.81 0.186 27.33)',
    400: 'oklch(0.7 0.248 27.33)',
    500: 'oklch(0.64 0.246 27.33)', // 错误色
    600: 'oklch(0.58 0.244 27.33)',
    700: 'oklch(0.49 0.242 27.33)',
    800: 'oklch(0.4 0.24 27.33)',
    900: 'oklch(0.32 0.238 27.33)',
    950: 'oklch(0.24 0.236 27.33)',
  },

  green: {
    50: 'oklch(0.97 0.048 142.5)',
    100: 'oklch(0.94 0.096 142.5)',
    200: 'oklch(0.89 0.192 142.5)',
    300: 'oklch(0.81 0.288 142.5)',
    400: 'oklch(0.7 0.384 142.5)',
    500: 'oklch(0.64 0.336 142.5)', // 成功色
    600: 'oklch(0.58 0.288 142.5)',
    700: 'oklch(0.49 0.24 142.5)',
    800: 'oklch(0.4 0.192 142.5)',
    900: 'oklch(0.32 0.144 142.5)',
    950: 'oklch(0.24 0.096 142.5)',
  },

  yellow: {
    50: 'oklch(0.98 0.016 95.21)',
    100: 'oklch(0.96 0.032 95.21)',
    200: 'oklch(0.92 0.064 95.21)',
    300: 'oklch(0.86 0.128 95.21)',
    400: 'oklch(0.79 0.192 95.21)',
    500: 'oklch(0.72 0.176 95.21)', // 警告色
    600: 'oklch(0.65 0.16 95.21)',
    700: 'oklch(0.56 0.144 95.21)',
    800: 'oklch(0.47 0.128 95.21)',
    900: 'oklch(0.38 0.112 95.21)',
    950: 'oklch(0.28 0.096 95.21)',
  },
}

// 语义化颜色令牌
export const semanticColors = {
  // 主色调
  primary: {
    50: 'var(--color-primary-50)',
    100: 'var(--color-primary-100)',
    200: 'var(--color-primary-200)',
    300: 'var(--color-primary-300)',
    400: 'var(--color-primary-400)',
    500: 'var(--color-primary-500)', // 主色
    600: 'var(--color-primary-600)',
    700: 'var(--color-primary-700)',
    800: 'var(--color-primary-800)',
    900: 'var(--color-primary-900)',
    950: 'var(--color-primary-950)',
  },

  // 次要色
  secondary: {
    50: 'var(--color-secondary-50)',
    100: 'var(--color-secondary-100)',
    200: 'var(--color-secondary-200)',
    300: 'var(--color-secondary-300)',
    400: 'var(--color-secondary-400)',
    500: 'var(--color-secondary-500)',
    600: 'var(--color-secondary-600)',
    700: 'var(--color-secondary-700)',
    800: 'var(--color-secondary-800)',
    900: 'var(--color-secondary-900)',
    950: 'var(--color-secondary-950)',
  },

  // 功能色
  success: {
    50: 'var(--color-success-50)',
    100: 'var(--color-success-100)',
    200: 'var(--color-success-200)',
    300: 'var(--color-success-300)',
    400: 'var(--color-success-400)',
    500: 'var(--color-success-500)',
    600: 'var(--color-success-600)',
    700: 'var(--color-success-700)',
    800: 'var(--color-success-800)',
    900: 'var(--color-success-900)',
    950: 'var(--color-success-950)',
  },

  warning: {
    50: 'var(--color-warning-50)',
    100: 'var(--color-warning-100)',
    200: 'var(--color-warning-200)',
    300: 'var(--color-warning-300)',
    400: 'var(--color-warning-400)',
    500: 'var(--color-warning-500)',
    600: 'var(--color-warning-600)',
    700: 'var(--color-warning-700)',
    800: 'var(--color-warning-800)',
    900: 'var(--color-warning-900)',
    950: 'var(--color-warning-950)',
  },

  error: {
    50: 'var(--color-error-50)',
    100: 'var(--color-error-100)',
    200: 'var(--color-error-200)',
    300: 'var(--color-error-300)',
    400: 'var(--color-error-400)',
    500: 'var(--color-error-500)',
    600: 'var(--color-error-600)',
    700: 'var(--color-error-700)',
    800: 'var(--color-error-800)',
    900: 'var(--color-error-900)',
    950: 'var(--color-error-950)',
  },

  // 中性色
  gray: {
    50: 'var(--color-gray-50)',
    100: 'var(--color-gray-100)',
    200: 'var(--color-gray-200)',
    300: 'var(--color-gray-300)',
    400: 'var(--color-gray-400)',
    500: 'var(--color-gray-500)',
    600: 'var(--color-gray-600)',
    700: 'var(--color-gray-700)',
    800: 'var(--color-gray-800)',
    900: 'var(--color-gray-900)',
    950: 'var(--color-gray-950)',
  },

  // 文本色
  text: {
    primary: 'var(--color-text-primary)',
    secondary: 'var(--color-text-secondary)',
    tertiary: 'var(--color-text-tertiary)',
    inverse: 'var(--color-text-inverse)',
    onPrimary: 'var(--color-text-on-primary)',
    onSecondary: 'var(--color-text-on-secondary)',
    onSuccess: 'var(--color-text-on-success)',
    onWarning: 'var(--color-text-on-warning)',
    onError: 'var(--color-text-on-error)',
  },

  // 背景色
  background: {
    primary: 'var(--color-background-primary)',
    secondary: 'var(--color-background-secondary)',
    tertiary: 'var(--color-background-tertiary)',
    inverse: 'var(--color-background-inverse)',
    surface: 'var(--color-background-surface)',
    overlay: 'var(--color-background-overlay)',
  },

  // 边框色
  border: {
    primary: 'var(--color-border-primary)',
    secondary: 'var(--color-border-secondary)',
    tertiary: 'var(--color-border-tertiary)',
    inverse: 'var(--color-border-inverse)',
    focus: 'var(--color-border-focus)',
  },
}

// 间距令牌
export const spacing = {
  0: '0',
  1: 'var(--spacing-1)',   // 0.25rem = 4px
  2: 'var(--spacing-2)',   // 0.5rem = 8px
  3: 'var(--spacing-3)',   // 0.75rem = 12px
  4: 'var(--spacing-4)',   // 1rem = 16px
  5: 'var(--spacing-5)',   // 1.25rem = 20px
  6: 'var(--spacing-6)',   // 1.5rem = 24px
  8: 'var(--spacing-8)',   // 2rem = 32px
  10: 'var(--spacing-10)', // 2.5rem = 40px
  12: 'var(--spacing-12)', // 3rem = 48px
  16: 'var(--spacing-16)', // 4rem = 64px
  20: 'var(--spacing-20)', // 5rem = 80px
  24: 'var(--spacing-24)', // 6rem = 96px
  32: 'var(--spacing-32)', // 8rem = 128px
  40: 'var(--spacing-40)', // 10rem = 160px
  48: 'var(--spacing-48)', // 12rem = 192px
  56: 'var(--spacing-56)', // 14rem = 224px
  64: 'var(--spacing-64)', // 16rem = 256px
}

// 字体令牌
export const typography = {
  fontFamily: {
    sans: 'var(--font-family-sans)',
    serif: 'var(--font-family-serif)',
    mono: 'var(--font-family-mono)',
  },

  fontSize: {
    xs: 'var(--font-size-xs)',    // 0.75rem = 12px
    sm: 'var(--font-size-sm)',    // 0.875rem = 14px
    base: 'var(--font-size-base)', // 1rem = 16px
    lg: 'var(--font-size-lg)',    // 1.125rem = 18px
    xl: 'var(--font-size-xl)',    // 1.25rem = 20px
    '2xl': 'var(--font-size-2xl)', // 1.5rem = 24px
    '3xl': 'var(--font-size-3xl)', // 1.875rem = 30px
    '4xl': 'var(--font-size-4xl)', // 2.25rem = 36px
    '5xl': 'var(--font-size-5xl)', // 3rem = 48px
    '6xl': 'var(--font-size-6xl)', // 3.75rem = 60px
  },

  fontWeight: {
    thin: 'var(--font-weight-thin)',     // 100
    extralight: 'var(--font-weight-extralight)', // 200
    light: 'var(--font-weight-light)',       // 300
    normal: 'var(--font-weight-normal)',     // 400
    medium: 'var(--font-weight-medium)',     // 500
    semibold: 'var(--font-weight-semibold'),   // 600
    bold: 'var(--font-weight-bold)',         // 700
    extrabold: 'var(--font-weight-extrabold)', // 800
    black: 'var(--font-weight-black)',       // 900
  },

  lineHeight: {
    none: 'var(--line-height-none)',   // 1
    tight: 'var(--line-height-tight)',  // 1.25
    snug: 'var(--line-height-snug)',    // 1.375
    normal: 'var(--line-height-normal)', // 1.5
    relaxed: 'var(--line-height-relaxed)', // 1.625
    loose: 'var(--line-height-loose)',   // 2
  },

  letterSpacing: {
    tighter: 'var(--letter-spacing-tighter)', // -0.05em
    tight: 'var(--letter-spacing-tight'),     // -0.025em
    normal: 'var(--letter-spacing-normal)',   // 0
    wide: 'var(--letter-spacing-wide)',       // 0.025em
    wider: 'var(--letter-spacing-wider)',     // 0.05em
    widest: 'var(--letter-spacing-widest)',   // 0.1em
  },
}

// 圆角令牌
export const borderRadius = {
  none: 'var(--border-radius-none)',    // 0
  sm: 'var(--border-radius-sm)',        // 0.125rem = 2px
  base: 'var(--border-radius-base)',    // 0.25rem = 4px
  md: 'var(--border-radius-md)',        // 0.375rem = 6px
  lg: 'var(--border-radius-lg)',        // 0.5rem = 8px
  xl: 'var(--border-radius-xl)',        // 0.75rem = 12px
  '2xl': 'var(--border-radius-2xl)',   // 1rem = 16px
  '3xl': 'var(--border-radius-3xl)',   // 1.5rem = 24px
  full: 'var(--border-radius-full)',    // 9999px
}

// 阴影令牌
export const shadows = {
  none: 'var(--shadow-none)',
  sm: 'var(--shadow-sm)',
  base: 'var(--shadow-base)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
  xl: 'var(--shadow-xl)',
  '2xl': 'var(--shadow-2xl)',
  inner: 'var(--shadow-inner)',
}

// 动画令牌
export const animations = {
  duration: {
    fastest: 'var(--animation-duration-fastest)', // 75ms
    faster: 'var(--animation-duration-faster)',   // 100ms
    fast: 'var(--animation-duration-fast)',       // 150ms
    normal: 'var(--animation-duration-normal)',   // 200ms
    slow: 'var(--animation-duration-slow)',       // 300ms
    slower: 'var(--animation-duration-slower)',   // 500ms
    slowest: 'var(--animation-duration-slowest)', // 700ms
  },

  easing: {
    linear: 'var(--animation-easing-linear)',
    ease: 'var(--animation-easing-ease)',
    easeIn: 'var(--animation-easing-ease-in)',
    easeOut: 'var(--animation-easing-ease-out)',
    easeInOut: 'var(--animation-easing-ease-in-out)',
    bounce: 'var(--animation-easing-bounce)',
  },
}

// 完整令牌系统
export const tokens = {
  colors: semanticColors,
  spacing,
  typography,
  borderRadius,
  shadows,
  animations,
}

// 主题配方系统（七轴DTCG）
export const themeRecipes = {
  // 亮色主题
  light: {
    mode: 'light',
    hue: 'blue',
    density: 'comfortable',
    surface: 'flat',
    saturation: 'vibrant',
    brightness: 'normal',
    temperature: 'neutral',
  },

  // 暗色主题
  dark: {
    mode: 'dark',
    hue: 'blue',
    density: 'comfortable',
    surface: 'flat',
    saturation: 'muted',
    brightness: 'dim',
    temperature: 'neutral',
  },

  // 其他主题配方...
  highContrast: {
    mode: 'light',
    hue: 'blue',
    density: 'comfortable',
    surface: 'flat',
    saturation: 'high',
    brightness: 'bright',
    temperature: 'neutral',
  },
}

// 工具函数
export const utils = {
  // 获取颜色值
  getColor: (path: string): string => {
    const keys = path.split('.')
    let value: any = semanticColors

    for (const key of keys) {
      value = value[key]
      if (!value) break
    }

    return value || 'var(--color-gray-500)'
  },

  // 获取间距值
  getSpacing: (key: string): string => {
    return spacing[key as keyof typeof spacing] || spacing[4]
  },

  // 获取字体大小
  getFontSize: (key: string): string => {
    return typography.fontSize[key as keyof typeof typography.fontSize] || typography.fontSize.base
  },

  // 生成CSS变量
  generateCSSVariables: (theme: typeof themeRecipes.light): Record<string, string> => {
    // 根据主题配方生成对应的CSS变量值
    // 这里需要结合具体的主题实现逻辑
    return {}
  },
}

// 导出所有令牌
export default tokens