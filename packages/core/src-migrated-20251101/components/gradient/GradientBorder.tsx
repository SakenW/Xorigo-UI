/**
 * 渐变边框组件 - 基于令牌系统
 * 使用 Xorigo UI 的设计令牌，提供语义化的渐变边框效果
 */

import React from 'react'
import { getCategoryColors, type ComponentCategory } from '@xorigo-ui/tokens'

export interface GradientBorderProps {
  children: React.ReactNode
  /** 组件分类，决定渐变配色 */
  category?: ComponentCategory | string
  /** 渐变状态：normal, hover, selected */
  state?: 'normal' | 'hover' | 'selected'
  borderWidth?: number
  className?: string
  as?: keyof JSX.IntrinsicElements
}

export const GradientBorder = React.forwardRef<HTMLDivElement, GradientBorderProps>(
  ({
    children,
    category = 'ui-basic',
    state = 'normal',
    borderWidth = 2,
    className = '',
    as: Component = 'div',
    ...props
  }, ref) => {
    // 获取分类的颜色配置
    const colors = getCategoryColors(category)

    if (!colors) {
      console.warn(`GradientBorder: 未找到分类 "${category}" 的颜色配置`)
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

    const borderStyle = {
      background: gradient,
      padding: `${borderWidth}px`,
      position: 'relative' as const
    }

    return (
      <Component
        ref={ref}
        className={className}
        style={borderStyle}
        {...props}
      >
        <div style={{ padding: `${borderWidth}px` }}>
          {children}
        </div>
      </Component>
    )
  }
)

GradientBorder.displayName = 'GradientBorder'