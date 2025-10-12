/**
 * 🎨 TH-UI 风格配方体系 - 核心令牌 (Core Tokens)
 *
 * 跨配方共享的安全资源
 * 基于 OKLCH 色彩空间和 WCAG 2.2 标准
 */

import type { CoreTokens, ColorScale, ElevationScale, MotionBase, SurfaceBase, TypographyScale, SpacingScale } from '../types'

// ============================================================================
// OKLCH 色彩空间核心色板 (OKLCH Color Space Core Palettes)
// ============================================================================

/**
 * 中性色标度 - Neutral Scale
 * 使用 OKLCH 色彩空间，C=0 (无彩度)
 */
export const neutralScale: ColorScale = {
  0: 'oklch(1 0 0)',    // 白色
  1: 'oklch(0.99 0 0)',
  2: 'oklch(0.98 0 0)',
  3: 'oklch(0.96 0 0)',
  4: 'oklch(0.94 0 0)',
  5: 'oklch(0.92 0 0)',
  6: 'oklch(0.88 0 0)',
  7: 'oklch(0.83 0 0)',
  8: 'oklch(0.77 0 0)',
  9: 'oklch(0.69 0 0)',
  10: 'oklch(0.59 0 0)',
  11: 'oklch(0.46 0 0)',
  12: 'oklch(0.31 0 0)',
  13: 'oklch(0.18 0 0)',
  14: 'oklch(0.09 0 0)',
  15: 'oklch(0 0 0)',     // 黑色
}

/**
 * 青色标度 - Cyan Scale
 */
export const cyanScale: ColorScale = {
  1: 'oklch(0.98 0.015 220)',
  2: 'oklch(0.96 0.035 220)',
  3: 'oklch(0.94 0.065 220)',
  4: 'oklch(0.91 0.095 220)',
  5: 'oklch(0.87 0.125 220)',
  6: 'oklch(0.82 0.145 220)',
  7: 'oklch(0.76 0.155 220)',
  8: 'oklch(0.69 0.165 220)',  // 基准色
  9: 'oklch(0.61 0.165 220)',
  10: 'oklch(0.53 0.155 220)',
  11: 'oklch(0.44 0.145 220)',
  12: 'oklch(0.34 0.125 220)',
  13: 'oklch(0.24 0.095 220)',
  14: 'oklch(0.16 0.065 220)',
  15: 'oklch(0.10 0.035 220)',
}

/**
 * 蓝色标度 - Blue Scale
 */
export const blueScale: ColorScale = {
  1: 'oklch(0.98 0.015 250)',
  2: 'oklch(0.96 0.035 250)',
  3: 'oklch(0.94 0.065 250)',
  4: 'oklch(0.91 0.095 250)',
  5: 'oklch(0.87 0.125 250)',
  6: 'oklch(0.82 0.145 250)',
  7: 'oklch(0.76 0.155 250)',
  8: 'oklch(0.69 0.165 250)',  // 基准色
  9: 'oklch(0.61 0.165 250)',
  10: 'oklch(0.53 0.155 250)',
  11: 'oklch(0.44 0.145 250)',
  12: 'oklch(0.34 0.125 250)',
  13: 'oklch(0.24 0.095 250)',
  14: 'oklch(0.16 0.065 250)',
  15: 'oklch(0.10 0.035 250)',
}

/**
 * 紫色标度 - Purple Scale
 */
export const purpleScale: ColorScale = {
  1: 'oklch(0.98 0.015 290)',
  2: 'oklch(0.96 0.035 290)',
  3: 'oklch(0.94 0.065 290)',
  4: 'oklch(0.91 0.095 290)',
  5: 'oklch(0.87 0.125 290)',
  6: 'oklch(0.82 0.145 290)',
  7: 'oklch(0.76 0.155 290)',
  8: 'oklch(0.69 0.165 290)',  // 基准色
  9: 'oklch(0.61 0.165 290)',
  10: 'oklch(0.53 0.155 290)',
  11: 'oklch(0.44 0.145 290)',
  12: 'oklch(0.34 0.125 290)',
  13: 'oklch(0.24 0.095 290)',
  14: 'oklch(0.16 0.065 290)',
  15: 'oklch(0.10 0.035 290)',
}

/**
 * 品红色标度 - Magenta Scale
 */
export const magentaScale: ColorScale = {
  1: 'oklch(0.98 0.015 320)',
  2: 'oklch(0.96 0.035 320)',
  3: 'oklch(0.94 0.065 320)',
  4: 'oklch(0.91 0.095 320)',
  5: 'oklch(0.87 0.125 320)',
  6: 'oklch(0.82 0.145 320)',
  7: 'oklch(0.76 0.155 320)',
  8: 'oklch(0.69 0.165 320)',  // 基准色
  9: 'oklch(0.61 0.165 320)',
  10: 'oklch(0.53 0.155 320)',
  11: 'oklch(0.44 0.145 320)',
  12: 'oklch(0.34 0.125 320)',
  13: 'oklch(0.24 0.095 320)',
  14: 'oklch(0.16 0.065 320)',
  15: 'oklch(0.10 0.035 320)',
}

/**
 * 灰色标度 - Gray Scale (用于 mono 配色)
 */
export const grayScale: ColorScale = {
  1: 'oklch(0.99 0.003 280)',
  2: 'oklch(0.97 0.006 280)',
  3: 'oklch(0.95 0.009 280)',
  4: 'oklch(0.92 0.012 280)',
  5: 'oklch(0.88 0.015 280)',
  6: 'oklch(0.83 0.018 280)',
  7: 'oklch(0.77 0.021 280)',
  8: 'oklch(0.69 0.024 280)',  // 基准色
  9: 'oklch(0.61 0.024 280)',
  10: 'oklch(0.53 0.021 280)',
  11: 'oklch(0.44 0.018 280)',
  12: 'oklch(0.34 0.015 280)',
  13: 'oklch(0.24 0.012 280)',
  14: 'oklch(0.16 0.009 280)',
  15: 'oklch(0.10 0.006 280)',
}

// ============================================================================
// 状态色标度 (State Color Scales)
// ============================================================================

/**
 * 成功色 - 绿色系
 */
export const successScale: ColorScale = {
  1: 'oklch(0.98 0.035 145)',
  2: 'oklch(0.96 0.065 145)',
  3: 'oklch(0.94 0.095 145)',
  4: 'oklch(0.91 0.125 145)',
  5: 'oklch(0.87 0.145 145)',
  6: 'oklch(0.82 0.155 145)',
  7: 'oklch(0.76 0.165 145)',
  8: 'oklch(0.69 0.175 145)',  // 基准色
  9: 'oklch(0.61 0.175 145)',
  10: 'oklch(0.53 0.165 145)',
  11: 'oklch(0.44 0.155 145)',
  12: 'oklch(0.34 0.145 145)',
  13: 'oklch(0.24 0.125 145)',
  14: 'oklch(0.16 0.095 145)',
  15: 'oklch(0.10 0.065 145)',
}

/**
 * 警告色 - 琥珀色系
 */
export const warningScale: ColorScale = {
  1: 'oklch(0.98 0.035 70)',
  2: 'oklch(0.96 0.065 70)',
  3: 'oklch(0.94 0.095 70)',
  4: 'oklch(0.91 0.125 70)',
  5: 'oklch(0.87 0.145 70)',
  6: 'oklch(0.82 0.155 70)',
  7: 'oklch(0.76 0.165 70)',
  8: 'oklch(0.69 0.175 70)',   // 基准色
  9: 'oklch(0.61 0.175 70)',
  10: 'oklch(0.53 0.165 70)',
  11: 'oklch(0.44 0.155 70)',
  12: 'oklch(0.34 0.145 70)',
  13: 'oklch(0.24 0.125 70)',
  14: 'oklch(0.16 0.095 70)',
  15: 'oklch(0.10 0.065 70)',
}

/**
 * 错误色 - 红色系
 */
export const errorScale: ColorScale = {
  1: 'oklch(0.98 0.035 20)',
  2: 'oklch(0.96 0.065 20)',
  3: 'oklch(0.94 0.095 20)',
  4: 'oklch(0.91 0.125 20)',
  5: 'oklch(0.87 0.145 20)',
  6: 'oklch(0.82 0.155 20)',
  7: 'oklch(0.76 0.165 20)',
  8: 'oklch(0.69 0.175 20)',   // 基准色
  9: 'oklch(0.61 0.175 20)',
  10: 'oklch(0.53 0.165 20)',
  11: 'oklch(0.44 0.155 20)',
  12: 'oklch(0.34 0.145 20)',
  13: 'oklch(0.24 0.125 20)',
  14: 'oklch(0.16 0.095 20)',
  15: 'oklch(0.10 0.065 20)',
}

/**
 * 信息色 - 天蓝色系
 */
export const infoScale: ColorScale = {
  1: 'oklch(0.98 0.035 200)',
  2: 'oklch(0.96 0.065 200)',
  3: 'oklch(0.94 0.095 200)',
  4: 'oklch(0.91 0.125 200)',
  5: 'oklch(0.87 0.145 200)',
  6: 'oklch(0.82 0.155 200)',
  7: 'oklch(0.76 0.165 200)',
  8: 'oklch(0.69 0.175 200)',   // 基准色
  9: 'oklch(0.61 0.175 200)',
  10: 'oklch(0.53 0.165 200)',
  11: 'oklch(0.44 0.155 200)',
  12: 'oklch(0.34 0.145 200)',
  13: 'oklch(0.24 0.125 200)',
  14: 'oklch(0.16 0.095 200)',
  15: 'oklch(0.10 0.065 200)',
}

// ============================================================================
// 高度标度 (Elevation Scale)
// ============================================================================

/**
 * 高度阴影标度
 */
export const elevationScale: ElevationScale = {
  0: {
    shadow: 'none',
    mixColor: 'transparent',
    opacity: 0,
  },
  1: {
    shadow: '0 1px 2px 0 oklch(0 0 0 / 0.05)',
    mixColor: 'oklch(0 0 0)',
    opacity: 0.05,
  },
  2: {
    shadow: '0 4px 6px -1px oklch(0 0 0 / 0.1), 0 2px 4px -2px oklch(0 0 0 / 0.1)',
    mixColor: 'oklch(0 0 0)',
    opacity: 0.1,
  },
  3: {
    shadow: '0 10px 15px -3px oklch(0 0 0 / 0.1), 0 4px 6px -4px oklch(0 0 0 / 0.1)',
    mixColor: 'oklch(0 0 0)',
    opacity: 0.15,
  },
  4: {
    shadow: '0 20px 25px -5px oklch(0 0 0 / 0.1), 0 8px 10px -6px oklch(0 0 0 / 0.1)',
    mixColor: 'oklch(0 0 0)',
    opacity: 0.2,
  },
  5: {
    shadow: '0 25px 50px -12px oklch(0 0 0 / 0.25)',
    mixColor: 'oklch(0 0 0)',
    opacity: 0.25,
  },
}

// ============================================================================
// 动效基础 (Motion Base)
// ============================================================================

/**
 * 动效时长标度
 */
export const motionDuration = {
  xs: '150ms',
  sm: '250ms',
  md: '400ms',
  lg: '600ms',
  xl: '800ms',
}

/**
 * 动效缓动函数
 */
export const motionEasing = {
  standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  decel: 'cubic-bezier(0, 0, 0.2, 1)',
  anticipate: 'cubic-bezier(0.2, 0, 0, 1)',
}

/**
 * 弹性动效参数
 */
export const motionSpring = {
  gentle: '{ tension: 280, friction: 60 }',
  bouncy: '{ tension: 420, friction: 30 }',
  brisk: '{ tension: 300, friction: 40 }',
}

/**
 * 动效基础令牌
 */
export const motionBase: MotionBase = {
  duration: motionDuration,
  easing: motionEasing,
  spring: motionSpring,
}

// ============================================================================
// 表面基础 (Surface Base)
// ============================================================================

/**
 * 阴影基础令牌
 */
export const shadowBase = {
  sm: {
    spread: '0px',
    blur: '1px',
    color: 'oklch(0 0 0 / 0.1)',
  },
  md: {
    spread: '0px',
    blur: '3px',
    color: 'oklch(0 0 0 / 0.15)',
  },
  lg: {
    spread: '0px',
    blur: '8px',
    color: 'oklch(0 0 0 / 0.2)',
  },
  xl: {
    spread: '0px',
    blur: '16px',
    color: 'oklch(0 0 0 / 0.25)',
  },
}

/**
 * 模糊效果标度
 */
export const blurScale = {
  sm: 'blur(4px)',
  md: 'blur(8px)',
  lg: 'blur(16px)',
  xl: 'blur(24px)',
}

/**
 * 光晕效果标度
 */
export const glowScale = {
  subtle: '0 0 8px oklch(var(--glow-color) / 0.3)',
  medium: '0 0 16px oklch(var(--glow-color) / 0.5)',
  strong: '0 0 24px oklch(var(--glow-color) / 0.7)',
}

/**
 * 表面基础令牌
 */
export const surfaceBase: SurfaceBase = {
  shadows: shadowBase,
  blur: blurScale,
  glow: glowScale,
}

// ============================================================================
// 基础标尺 (Foundation Scales)
// ============================================================================

/**
 * 排版标度
 */
export const typographyScale: TypographyScale = {
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },
  fontWeight: {
    thin: '100',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
}

/**
 * 间距标度
 */
export const spacingScale: SpacingScale = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  32: '8rem',       // 128px
}

// ============================================================================
// 核心令牌集合 (Core Tokens Collection)
// ============================================================================

/**
 * 核心令牌
 */
export const coreTokens: CoreTokens = {
  colors: {
    neutral: neutralScale,
    cyan: cyanScale,
    blue: blueScale,
    purple: purpleScale,
    magenta: magentaScale,
    gray: grayScale,
  },
  states: {
    success: successScale,
    warning: warningScale,
    error: errorScale,
    info: infoScale,
  },
  elevation: elevationScale,
  motion: motionBase,
  surface: surfaceBase,
  foundations: {
    typography: typographyScale,
    spacing: spacingScale,
  },
}