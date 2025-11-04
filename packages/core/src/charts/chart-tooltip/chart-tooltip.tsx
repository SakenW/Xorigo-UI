/**
 * ChartTooltip - 图表提示组件
 *
 * 为图表提供统一的提示信息显示，支持多种格式和样式。
 * 这是图表组件库的重要组件，与 ChartContainer 配合使用。
 */

import React, { forwardRef, useId } from 'react'
import { motion, AnimatePresence, MotionProps } from 'framer-motion'
import { cn } from '../../utils/cn'

// ============================================================================
// Props Type Definitions
// ============================================================================

export interface TooltipData {
  /**
   * 提示的唯一标识
   */
  id: string

  /**
   * 提示的标题
   */
  title?: string

  /**
   * 提示的内容
   */
  content: string | React.ReactNode

  /**
   * 提示的位置坐标
   */
  x: number
  y: number

  /**
   * 提示的值（用于排序和格式化）
   */
  value?: number | string

  /**
   * 提示的颜色
   */
  color?: string

  /**
   * 自定义数据
   */
  [key: string]: any
}

export interface ChartTooltipProps extends Omit<MotionProps, 'children'> {
  /**
   * 提示数据
   */
  data?: TooltipData

  /**
   * 提示的显示状态
   */
  visible?: boolean

  /**
   * 提示的位置
   */
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center'

  /**
   * 是否显示箭头
   */
  showArrow?: boolean

  /**
   * 提示的变体
   */
  variant?: 'default' | 'card' | 'minimal'

  /**
   * 提示的最大宽度
   */
  maxWidth?: number | string

  /**
   * 提示的偏移量
   */
  offset?: number

  /**
   * 提示的延迟显示时间（毫秒）
   */
  delay?: number

  /**
   * 提示的样式类名
   */
  className?: string

  /**
   * 自定义样式
   */
  style?: React.CSSProperties
}

// ============================================================================
// Component Implementation
// ============================================================================

/**
 * ChartTooltip 组件
 *
 * 为图表提供统一的提示信息显示，包含：
 * - 多种显示位置和样式
 * - 可配置的内容格式
 * - 动画过渡效果
 * - 主题系统集成
 * - 无障碍访问支持
 */
export const ChartTooltip = forwardRef<HTMLDivElement, ChartTooltipProps>(
  (
    {
      data,
      visible = false,
      position = 'top',
      showArrow = true,
      variant = 'default',
      maxWidth = 250,
      offset = 8,
      delay = 0,
      className,
      style,
      ...motionProps
    },
    ref
  ) => {
    const id = useId()

    // 如果没有数据且不可见，则不渲染
    if (!data && !visible) {
      return null
    }

    // 计算提示的位置
    const getTooltipPosition = () => {
      if (!data) return {}

      const { x, y } = data

      switch (position) {
        case 'top':
          return {
            left: x,
            top: y - offset,
            transform: 'translate(-50%, -100%)'
          }
        case 'bottom':
          return {
            left: x,
            top: y + offset,
            transform: 'translate(-50%, 0%)'
          }
        case 'left':
          return {
            left: x - offset,
            top: y,
            transform: 'translate(-100%, -50%)'
          }
        case 'right':
          return {
            left: x + offset,
            top: y,
            transform: 'translate(0%, -50%)'
          }
        case 'center':
        default:
          return {
            left: x,
            top: y,
            transform: 'translate(-50%, -50%)'
          }
      }
    }

    // 获取箭头位置
    const getArrowPosition = () => {
      if (!showArrow) return {}

      const arrowSize = 8
      const borderWidth = 1

      switch (position) {
        case 'top':
          return {
            left: '50%',
            top: '100%',
            transform: 'translateX(-50%)',
            borderWidth: `${arrowSize}px ${arrowSize}px 0 ${arrowSize}px`,
            borderColor: `var(--color-surface-elevated) transparent transparent transparent`
          }
        case 'bottom':
          return {
            left: '50%',
            top: `-${arrowSize}px`,
            transform: 'translateX(-50%)',
            borderWidth: `0 ${arrowSize}px ${arrowSize}px ${arrowSize}px`,
            borderColor: `transparent transparent var(--color-surface-elevated) transparent`
          }
        case 'left':
          return {
            left: '100%',
            top: '50%',
            transform: 'translateY(-50%)',
            borderWidth: `${arrowSize}px 0 ${arrowSize}px ${arrowSize}px`,
            borderColor: `transparent transparent transparent var(--color-surface-elevated)`
          }
        case 'right':
          return {
            left: `-${arrowSize}px`,
            top: '50%',
            transform: 'translateY(-50%)',
            borderWidth: `${arrowSize}px ${arrowSize}px ${arrowSize}px 0`,
            borderColor: `transparent var(--color-surface-elevated) transparent transparent`
          }
        case 'center':
        default:
          return {}
      }
    }

    // 获取变体样式
    const getVariantStyles = () => {
      switch (variant) {
        case 'card':
          return {
            backgroundColor: 'var(--color-surface-elevated)',
            border: '1px solid var(--color-border)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            borderRadius: 'var(--radius-lg)',
            padding: '12px 16px'
          }
        case 'minimal':
          return {
            backgroundColor: 'var(--color-surface)',
            border: 'none',
            boxShadow: 'none',
            borderRadius: 'var(--radius-sm)',
            padding: '6px 10px'
          }
        case 'default':
        default:
          return {
            backgroundColor: 'var(--color-surface-elevated)',
            border: `1px solid var(--color-border)`,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 12px'
          }
      }
    }

    const tooltipPosition = getTooltipPosition()
    const arrowPosition = getArrowPosition()
    const variantStyles = getVariantStyles()

    // 动画变体
    const tooltipVariants = {
      hidden: {
        opacity: 0,
        scale: 0.8,
        y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0,
        x: position === 'left' ? 10 : position === 'right' ? -10 : 0
      },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        x: 0,
        transition: {
          type: 'spring',
          stiffness: 500,
          damping: 30,
          duration: 0.2
        }
      },
      exit: {
        opacity: 0,
        scale: 0.8,
        transition: {
          duration: 0.15
        }
      }
    }

    return (
      <AnimatePresence>
        {(visible || data) && (
          <motion.div
            ref={ref}
            id={id}
            className={cn(
              'chart-tooltip',
              'absolute',
              'z-50',
              'pointer-events-none',
              'select-none',
              className
            )}
            style={{
              ...tooltipPosition,
              maxWidth,
              ...variantStyles,
              ...style
            }}
            variants={tooltipVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            {...motionProps}
            role="tooltip"
            aria-hidden={!visible}
          >
            {/* 箭头 */}
            {showArrow && (
              <div
                className="absolute"
                style={{
                  width: 0,
                  height: 0,
                  ...arrowPosition
                }}
              />
            )}

            {/* 提示内容 */}
            <div className="tooltip-content">
              {data?.title && (
                <div className="tooltip-title mb-1">
                  <span className="text-[var(--color-text-primary)] font-medium text-sm">
                    {data.title}
                  </span>
                </div>
              )}

              <div className="tooltip-body">
                {typeof data?.content === 'string' ? (
                  <span className="text-[var(--color-text-secondary)] text-sm">
                    {data.content}
                  </span>
                ) : (
                  data?.content
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }
)

ChartTooltip.displayName = 'ChartTooltip'

// ============================================================================
// Export
// ============================================================================

export type { ChartTooltipProps, TooltipData }
