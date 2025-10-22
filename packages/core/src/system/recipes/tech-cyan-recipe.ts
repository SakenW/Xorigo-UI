/**
 * 科技青主题配方
 *
 * ID: tech-cyan
 * 适用场景：科技产品、开发工具、数据可视化
 * 特点：现代、清爽、科技感
 */

import type { ThemeRecipe } from '../theme-axis-controller'

export const techCyanRecipe: ThemeRecipe = {
  id: 'tech-cyan',
  name: 'Tech Cyan',
  axes: {
    mode: 'dark',
    base: 'neutral-cool-mid',
    accent: 'mono(cyan)',
    tone: 'standard',
    density: 'comfortable',
    motion: 'subtle.classic',
    surface: 'glass'
  },
  tokens: {
    // 基础颜色 - 深色科技风格
    '--xor-bg-primary': '#0d1b2a',
    '--xor-bg-secondary': '#1b263b',
    '--xor-bg-tertiary': '#415a77',

    // 文字颜色
    '--xor-text-primary': '#e0fbfc',
    '--xor-text-secondary': '#98c1d9',
    '--xor-text-tertiary': '#778da9',

    // 强调色 - 青色系
    '--xor-accent-primary': '#00bcd4',
    '--xor-accent-secondary': '#26c6da',
    '--xor-accent-tertiary': '#4dd0e1',

    // 功能色 - 调整适配深色背景
    '--xor-success': '#00e676',
    '--xor-warning': '#ffab00',
    '--xor-error': '#ff5252',
    '--xor-info': '#00e5ff',

    // 边框
    '--xor-border-primary': '#415a77',
    '--xor-border-secondary': '#778da9',
    '--xor-border-tertiary': '#98c1d9',

    // 表面材质 - 玻璃效果
    '--xor-surface-bg': 'rgba(13, 27, 42, 0.7)',
    '--xor-surface-border': 'rgba(0, 188, 212, 0.3)',
    '--xor-surface-shadow': '0 8px 32px rgba(0, 188, 212, 0.15)',

    // 动效
    '--xor-motion-duration': '300ms',
    '--xor-motion-easing': 'cubic-bezier(0.4, 0, 0.2, 1)',
    '--xor-motion-scale': '1.05',

    // 密度
    '--xor-density-scale': '1',

    // 圆角 - 更现代的圆角
    '--xor-radius-sm': '0.5rem',
    '--xor-radius-md': '0.75rem',
    '--xor-radius-lg': '1rem',
    '--xor-radius-xl': '1.5rem',

    // 阴影 - 科技感阴影
    '--xor-shadow-sm': '0 2px 8px rgba(0, 188, 212, 0.1)',
    '--xor-shadow-md': '0 8px 24px rgba(0, 188, 212, 0.15)',
    '--xor-shadow-lg': '0 16px 48px rgba(0, 188, 212, 0.2)',
    '--xor-shadow-xl': '0 24px 64px rgba(0, 188, 212, 0.25)',

    // 间距
    '--xor-spacing-xs': '0.5rem',
    '--xor-spacing-sm': '0.75rem',
    '--xor-spacing-md': '1.5rem',
    '--xor-spacing-lg': '2rem',
    '--xor-spacing-xl': '3rem',
    '--xor-spacing-2xl': '4rem',

    // 特殊效果 - 科技光晕
    '--xor-glow-primary': '0 0 20px rgba(0, 188, 212, 0.6)',
    '--xor-glow-secondary': '0 0 15px rgba(0, 188, 212, 0.4)',
    '--xor-glow-tertiary': '0 0 10px rgba(0, 188, 212, 0.2)',
  }
}

// 霓虹版本
export const techCyanNeonRecipe: ThemeRecipe = {
  id: 'tech-cyan-neon',
  name: 'Tech Cyan Neon',
  axes: {
    mode: 'dark',
    base: 'neutral-true-high',
    accent: 'mono(cyan)',
    tone: 'vivid',
    density: 'compact',
    motion: 'expressive.spring',
    surface: 'glass+neon'
  },
  tokens: {
    // 更深的背景配合霓虹效果
    '--xor-bg-primary': '#000814',
    '--xor-bg-secondary': '#001d3d',
    '--xor-bg-tertiary': '#003566',

    // 更亮的文字
    '--xor-text-primary': '#ffffff',
    '--xor-text-secondary': '#90e0ef',
    '--xor-text-tertiary': '#48cae4',

    // 更鲜艳的青色
    '--xor-accent-primary': '#00f5ff',
    '--xor-accent-secondary': '#00b4d8',
    '--xor-accent-tertiary': '#0077b6',

    // 功能色 - 霓虹风格
    '--xor-success': '#00ff88',
    '--xor-warning': '#ffaa00',
    '--xor-error': '#ff006e',
    '--xor-info': '#00ffff',

    // 边框 - 霓虹效果
    '--xor-border-primary': '#00f5ff',
    '--xor-border-secondary': '#48cae4',
    '--xor-border-tertiary': '#90e0ef',

    // 表面材质 - 玻璃+霓虹
    '--xor-surface-bg': 'rgba(0, 8, 20, 0.8)',
    '--xor-surface-border': 'rgba(0, 245, 255, 0.5)',
    '--xor-surface-shadow': '0 0 30px rgba(0, 245, 255, 0.6), 0 8px 32px rgba(0, 8, 20, 0.9)',

    // 动效 - 更活跃
    '--xor-motion-duration': '400ms',
    '--xor-motion-easing': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    '--xor-motion-scale': '1.1',

    // 密度 - 紧凑
    '--xor-density-scale': '0.75',

    // 圆角 - 更锐利
    '--xor-radius-sm': '0.25rem',
    '--xor-radius-md': '0.375rem',
    '--xor-radius-lg': '0.5rem',
    '--xor-radius-xl': '0.75rem',

    // 阴影 - 霓虹光晕
    '--xor-shadow-sm': '0 0 10px rgba(0, 245, 255, 0.8)',
    '--xor-shadow-md': '0 0 20px rgba(0, 245, 255, 0.6)',
    '--xor-shadow-lg': '0 0 30px rgba(0, 245, 255, 0.4)',
    '--xor-shadow-xl': '0 0 40px rgba(0, 245, 255, 0.3)',

    // 间距 - 紧凑
    '--xor-spacing-xs': '0.25rem',
    '--xor-spacing-sm': '0.5rem',
    '--xor-spacing-md': '1rem',
    '--xor-spacing-lg': '1.5rem',
    '--xor-spacing-xl': '2rem',
    '--xor-spacing-2xl': '3rem',

    // 霓虹效果增强
    '--xor-glow-primary': '0 0 40px rgba(0, 245, 255, 0.8)',
    '--xor-glow-secondary': '0 0 30px rgba(0, 245, 255, 0.6)',
    '--xor-glow-tertiary': '0 0 20px rgba(0, 245, 255, 0.4)',
  }
}