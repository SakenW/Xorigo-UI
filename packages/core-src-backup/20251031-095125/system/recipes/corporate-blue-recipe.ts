/**
 * 企业蓝调主题配方
 *
 * ID: corporate-blue
 * 适用场景：企业级应用、管理系统、B2B 产品
 * 特点：专业、稳重、可信赖
 */

import type { ThemeRecipe, ThemeAxes } from '../theme-axis-controller'

export const corporateBlueRecipe: ThemeRecipe = {
  id: 'corporate-blue',
  name: 'Corporate Blue',
  axes: {
    mode: 'light',
    base: 'neutral-cool-mid',
    accent: 'mono(blue)',
    tone: 'standard',
    density: 'comfortable',
    motion: 'subtle.classic',
    surface: 'soft-shadow'
  },
  tokens: {
    // 基础颜色
    '--xor-bg-primary': '#ffffff',
    '--xor-bg-secondary': '#f8fafc',
    '--xor-bg-tertiary': '#f1f5f9',

    // 文字颜色
    '--xor-text-primary': '#1e293b',
    '--xor-text-secondary': '#64748b',
    '--xor-text-tertiary': '#94a3b8',

    // 强调色
    '--xor-accent-primary': '#2563eb',
    '--xor-accent-secondary': '#3b82f6',
    '--xor-accent-tertiary': '#60a5fa',

    // 功能色
    '--xor-success': '#16a34a',
    '--xor-warning': '#d97706',
    '--xor-error': '#dc2626',
    '--xor-info': '#0891b2',

    // 边框
    '--xor-border-primary': '#e2e8f0',
    '--xor-border-secondary': '#cbd5e1',
    '--xor-border-tertiary': '#94a3b8',

    // 表面材质
    '--xor-surface-bg': 'rgba(255, 255, 255, 0.8)',
    '--xor-surface-border': 'rgba(37, 99, 235, 0.1)',
    '--xor-surface-shadow': '0 4px 16px rgba(0, 0, 0, 0.08)',

    // 动效
    '--xor-motion-duration': '200ms',
    '--xor-motion-easing': 'cubic-bezier(0.4, 0, 0.2, 1)',
    '--xor-motion-scale': '1.02',

    // 密度
    '--xor-density-scale': '1',

    // 圆角
    '--xor-radius-sm': '0.375rem',
    '--xor-radius-md': '0.5rem',
    '--xor-radius-lg': '0.75rem',
    '--xor-radius-xl': '1rem',

    // 阴影
    '--xor-shadow-sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
    '--xor-shadow-md': '0 4px 16px rgba(0, 0, 0, 0.08)',
    '--xor-shadow-lg': '0 10px 25px rgba(0, 0, 0, 0.12)',
    '--xor-shadow-xl': '0 20px 40px rgba(0, 0, 0, 0.16)',

    // 间距
    '--xor-spacing-xs': '0.25rem',
    '--xor-spacing-sm': '0.5rem',
    '--xor-spacing-md': '1rem',
    '--xor-spacing-lg': '1.5rem',
    '--xor-spacing-xl': '2rem',
    '--xor-spacing-2xl': '3rem',
  }
}

// 暗色版本
export const corporateBlueDarkRecipe: ThemeRecipe = {
  id: 'corporate-blue-dark',
  name: 'Corporate Blue (Dark)',
  axes: {
    mode: 'dark',
    base: 'neutral-cool-mid',
    accent: 'mono(blue)',
    tone: 'standard',
    density: 'comfortable',
    motion: 'subtle.classic',
    surface: 'soft-shadow'
  },
  tokens: {
    // 基础颜色 - 暗色模式
    '--xor-bg-primary': '#0f172a',
    '--xor-bg-secondary': '#1e293b',
    '--xor-bg-tertiary': '#334155',

    // 文字颜色 - 暗色模式
    '--xor-text-primary': '#f8fafc',
    '--xor-text-secondary': '#cbd5e1',
    '--xor-text-tertiary': '#94a3b8',

    // 强调色保持不变
    '--xor-accent-primary': '#3b82f6',
    '--xor-accent-secondary': '#60a5fa',
    '--xor-accent-tertiary': '#93c5fd',

    // 功能色
    '--xor-success': '#22c55e',
    '--xor-warning': '#f59e0b',
    '--xor-error': '#ef4444',
    '--xor-info': '#06b6d4',

    // 边框 - 暗色模式
    '--xor-border-primary': '#334155',
    '--xor-border-secondary': '#475569',
    '--xor-border-tertiary': '#64748b',

    // 表面材质 - 暗色模式
    '--xor-surface-bg': 'rgba(15, 23, 42, 0.8)',
    '--xor-surface-border': 'rgba(59, 130, 246, 0.2)',
    '--xor-surface-shadow': '0 4px 16px rgba(0, 0, 0, 0.4)',

    // 其他配置保持一致
    '--xor-motion-duration': '200ms',
    '--xor-motion-easing': 'cubic-bezier(0.4, 0, 0.2, 1)',
    '--xor-motion-scale': '1.02',
    '--xor-density-scale': '1',
    '--xor-radius-sm': '0.375rem',
    '--xor-radius-md': '0.5rem',
    '--xor-radius-lg': '0.75rem',
    '--xor-radius-xl': '1rem',
    '--xor-shadow-sm': '0 1px 2px rgba(0, 0, 0, 0.2)',
    '--xor-shadow-md': '0 4px 16px rgba(0, 0, 0, 0.4)',
    '--xor-shadow-lg': '0 10px 25px rgba(0, 0, 0, 0.6)',
    '--xor-shadow-xl': '0 20px 40px rgba(0, 0, 0, 0.8)',
    '--xor-spacing-xs': '0.25rem',
    '--xor-spacing-sm': '0.5rem',
    '--xor-spacing-md': '1rem',
    '--xor-spacing-lg': '1.5rem',
    '--xor-spacing-xl': '2rem',
    '--xor-spacing-2xl': '3rem',
  }
}