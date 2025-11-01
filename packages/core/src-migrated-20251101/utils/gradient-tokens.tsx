/**
 * 🎨 渐变令牌工具 - 为现有组件提供渐变增强功能
 *
 * 这个工具不创建新的组件，而是为现有组件提供渐变功能的增强
 * 基于Xorigo UI的语义化令牌系统
 */

import React from 'react'
import { semanticColors } from '@xorigo-ui/tokens'
import { cn } from './cn'

// 渐变预设配置 - 基于语义化令牌
export const gradientPresets = {
  // 品牌主色渐变
  primary: {
    background: 'linear-gradient(135deg, var(--bg-primary-action), var(--bg-secondary-action))',
    text: 'linear-gradient(135deg, var(--bg-primary-action), var(--bg-secondary-action))',
    border: 'linear-gradient(135deg, var(--border-primary-action), var(--bg-secondary-action))',
    description: '品牌主色渐变',
    usage: '主要操作，重要按钮，品牌元素'
  },

  // 成功状态渐变
  success: {
    background: 'linear-gradient(135deg, var(--bg-success), var(--bg-success-hover))',
    text: 'linear-gradient(135deg, var(--text-success), var(--bg-success))',
    border: 'linear-gradient(135deg, var(--border-success), var(--bg-success-hover))',
    description: '成功状态渐变',
    usage: '成功提示，完成状态，积极反馈'
  },

  // 警告状态渐变
  warning: {
    background: 'linear-gradient(135deg, var(--bg-warning), var(--bg-warning-hover))',
    text: 'linear-gradient(135deg, var(--text-warning), var(--bg-warning))',
    border: 'linear-gradient(135deg, var(--border-warning), var(--bg-warning-hover))',
    description: '警告状态渐变',
    usage: '警告提示，注意事项，谨慎操作'
  },

  // 错误状态渐变
  error: {
    background: 'linear-gradient(135deg, var(--bg-error), var(--bg-error-hover))',
    text: 'linear-gradient(135deg, var(--text-error), var(--bg-error))',
    border: 'linear-gradient(135deg, var(--bg-error), var(--bg-error-hover))',
    description: '错误状态渐变',
    usage: '错误提示，危险操作，失败状态'
  },

  // 信息状态渐变
  info: {
    background: 'linear-gradient(135deg, var(--bg-info), var(--bg-info-hover))',
    text: 'linear-gradient(135deg, var(--text-info), var(--bg-info))',
    border: 'linear-gradient(135deg, var(--border-info), var(--bg-info-hover))',
    description: '信息状态渐变',
    usage: '信息提示，帮助说明，指导操作'
  },

  // 玻璃效果渐变
  glass: {
    background: 'linear-gradient(135deg, var(--bg-glass), rgba(255, 255, 255, 0.1))',
    text: 'linear-gradient(135deg, var(--text-glass), rgba(0, 0, 0, 0.8))',
    border: 'linear-gradient(135deg, var(--border-glass), rgba(255, 255, 255, 0.2))',
    description: '玻璃效果渐变',
    usage: '玻璃态组件，透明层，现代UI'
  },

  // 彩虹渐变
  rainbow: {
    background: 'linear-gradient(90deg, var(--bg-primary-action), var(--bg-warning), var(--bg-secondary-action), var(--bg-info))',
    text: 'linear-gradient(90deg, var(--bg-primary-action), var(--bg-warning), var(--bg-secondary-action), var(--bg-info))',
    border: 'linear-gradient(90deg, var(--border-primary-action), var(--bg-warning), var(--bg-secondary-action), var(--bg-info))',
    description: '彩虹渐变',
    usage: '装饰效果，特殊场合，庆祝元素'
  },

  // 深色主题渐变
  dark: {
    background: 'linear-gradient(135deg, var(--bg-inverse), var(--bg-primary))',
    text: 'linear-gradient(135deg, var(--text-inverse), var(--text-primary))',
    border: 'linear-gradient(135deg, var(--border-primary), var(--bg-tertiary))',
    description: '深色主题渐变',
    usage: '深色背景，夜间模式，高端视觉效果'
  },

  // 柔和渐变
  subtle: {
    background: 'linear-gradient(135deg, var(--bg-tertiary), var(--bg-secondary))',
    text: 'linear-gradient(135deg, var(--text-secondary), var(--text-primary))',
    border: 'linear-gradient(135deg, var(--border-secondary), var(--border-primary))',
    description: '柔和渐变',
    usage: '背景装饰，分隔区域，微妙效果'
  }
}

// 渐变类型
export type GradientType = keyof typeof gradientPresets
export type GradientUsage = 'background' | 'text' | 'border'

// 渐变工具函数
export const gradientUtils = {
  /**
   * 获取渐变样式
   */
  getGradient: (preset: GradientType, usage: GradientUsage = 'background') => {
    return gradientPresets[preset]?.[usage] || gradientPresets.primary.background
  },

  /**
   * 获取渐变CSS类名（用于文字渐变）
   */
  getTextGradientClasses: (preset: GradientType) => {
    const gradient = gradientPresets[preset]?.text || gradientPresets.primary.text
    return {
      style: {
        background: gradient,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent'
      }
    }
  },

  /**
   * 获取渐变CSS类名（用于背景渐变）
   */
  getBackgroundGradientClasses: (preset: GradientType) => {
    const gradient = gradientPresets[preset]?.background || gradientPresets.primary.background
    return {
      style: {
        background: gradient
      }
    }
  },

  /**
   * 获取渐变边框CSS类名
   */
  getBorderGradientClasses: (preset: GradientType, borderWidth: number = 2) => {
    const gradient = gradientPresets[preset]?.border || gradientPresets.primary.border
    return {
      style: {
        background: gradient,
        padding: `${borderWidth}px`,
        position: 'relative' as const
      }
    }
  },

  /**
   * 创建动态渐变动画
   */
  createAnimatedGradient: (colors: string[], duration: number = 3) => {
    const colorStops = colors.map((color, index) =>
      `${color} ${(index * 100) / (colors.length - 1)}%`
    ).join(', ')

    return {
      background: `linear-gradient(90deg, ${colorStops})`,
      backgroundSize: '200% 100%',
      animation: `gradient-flow ${duration}s ease infinite`
    }
  },

  /**
   * 为任意组件添加渐变效果
   */
  applyGradient: (
    preset: GradientType,
    usage: GradientUsage,
    additionalStyles?: React.CSSProperties
  ) => {
    const baseStyle = {
      background: gradientUtils.getGradient(preset, usage)
    }

    if (usage === 'text') {
      baseStyle.WebkitBackgroundClip = 'text'
      baseStyle.backgroundClip = 'text'
      baseStyle.color = 'transparent'
    }

    return {
      style: {
        ...baseStyle,
        ...additionalStyles
      }
    }
  }
}

// 渐变CSS变量定义
export const gradientCSSVariables = {
  // 渐变动画
  '--gradient-flow': 'gradient-flow 3s ease infinite',
  '--gradient-border': 'gradient-border 4s ease infinite',
  '--gradient-pulse': 'gradient-pulse 2s ease-in-out infinite',

  // 渐变颜色
  '--gradient-primary': 'linear-gradient(135deg, var(--bg-primary-action), var(--bg-secondary-action))',
  '--gradient-success': 'linear-gradient(135deg, var(--bg-success), var(--bg-success-hover))',
  '--gradient-warning': 'linear-gradient(135deg, var(--bg-warning), var(--bg-warning-hover))',
  '--gradient-error': 'linear-gradient(135deg, var(--bg-error), var(--bg-error-hover))',
  '--gradient-info': 'linear-gradient(135deg, var(--bg-info), var(--bg-info-hover))',
  '--gradient-glass': 'linear-gradient(135deg, var(--bg-glass), rgba(255, 255, 255, 0.1))',
} as const

// 渐变工具组件 - 用于现有组件的增强
export function withGradient<P extends object>(
  Component: React.ComponentType<P>,
  gradientPreset?: GradientType,
  gradientUsage?: GradientUsage
) {
  const GradientEnhancedComponent = React.forwardRef<any, P>((props, ref) => {
    const gradientStyles = gradientPreset
      ? gradientUtils.applyGradient(gradientPreset, gradientUsage || 'background')
      : {}

    return <Component {...props} {...gradientStyles} ref={ref} />
  })

  GradientEnhancedComponent.displayName = `withGradient(${Component.displayName || Component.name})`

  return GradientEnhancedComponent
}

// React Hook for gradients
export const useGradient = (preset: GradientType, usage: GradientUsage = 'background') => {
  return gradientUtils.applyGradient(preset, usage)
}

export default {
  gradientPresets,
  gradientUtils,
  gradientCSSVariables,
  withGradient,
  useGradient
}