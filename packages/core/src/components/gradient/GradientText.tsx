/**
 * 渐变文字组件 - 基于令牌系统
 * 使用 Xorigo UI 的设计令牌，提供语义化的渐变文字效果
 */

import React from 'react'
import { getCategoryColors, type ComponentCategory } from '@xorigo-ui/tokens'

export interface GradientTextProps {
  children: React.ReactNode
  /** 组件分类，决定渐变配色 */
  category?: ComponentCategory | string
  /** 渐变状态：normal, hover, selected */
  state?: 'normal' | 'hover' | 'selected'
  className?: string
  as?: keyof JSX.IntrinsicElements
}

export const GradientText = React.forwardRef<HTMLSpanElement, GradientTextProps>(
  ({ children, category = 'ui-basic', state = 'normal', className = '', as: Component = 'span', ...props }, ref) => {
    // 获取分类的颜色配置
    const colors = getCategoryColors(category)

    if (!colors) {
      console.warn(`GradientText: 未找到分类 "${category}" 的颜色配置`)
      return (
        <Component ref={ref} className={className} {...props}>
          {children}
        </Component>
      )
    }

    // 根据状态选择渐变
    let gradient: string
    switch (state) {
      case 'hover':
        gradient = colors.hoverGradient
        break
      case 'selected':
        gradient = colors.selectedGradient
        break
      default:
        gradient = colors.gradient
    }

    const gradientStyle = {
      background: gradient,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    }

    return (
      <Component
        ref={ref}
        className={className}
        style={gradientStyle}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

GradientText.displayName = 'GradientText'