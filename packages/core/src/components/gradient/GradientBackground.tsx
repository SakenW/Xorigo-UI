/**
 * 渐变背景组件 - 基于令牌系统
 * 使用 Xorigo UI 的设计令牌，提供语义化的渐变背景效果
 */

import React from 'react'
import { getCategoryColors, type ComponentCategory } from '@xorigo-ui/tokens'

export interface GradientBackgroundProps {
  children: React.ReactNode
  /** 组件分类，决定渐变配色 */
  category?: ComponentCategory | string
  /** 渐变状态：normal, hover, selected */
  state?: 'normal' | 'hover' | 'selected'
  className?: string
  as?: keyof JSX.IntrinsicElements
  animated?: boolean
  animationDuration?: number
}

export const GradientBackground = React.forwardRef<HTMLDivElement, GradientBackgroundProps>(
  ({
    children,
    category = 'ui-basic',
    state = 'normal',
    className = '',
    as: Component = 'div',
    animated = false,
    animationDuration = 3,
    ...props
  }, ref) => {
    // 获取分类的颜色配置
    const colors = getCategoryColors(category)

    if (!colors) {
      console.warn(`GradientBackground: 未找到分类 "${category}" 的颜色配置`)
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

    const baseStyle = {
      background: gradient
    }

    const animatedStyle = animated ? {
      ...baseStyle,
      backgroundSize: '200% 200%',
      animation: `gradient-flow ${animationDuration}s ease-in-out infinite`
    } : baseStyle

    // 添加动画样式
    React.useEffect(() => {
      if (animated) {
        const style = document.createElement('style')
        style.textContent = `
          @keyframes gradient-flow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `
        document.head.appendChild(style)
        return () => {
          document.head.removeChild(style)
        }
      }
    }, [animated, animationDuration])

    return (
      <Component
        ref={ref}
        className={className}
        style={animatedStyle}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

GradientBackground.displayName = 'GradientBackground'