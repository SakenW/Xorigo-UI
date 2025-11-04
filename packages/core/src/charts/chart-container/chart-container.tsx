/**
 * Chart Container - 图表容器组件
 *
 * 为各种图表提供统一的容器和布局，支持响应式设计、图例位置配置等。
 * 这是图表组件库的基础组件，其他图表都会基于它来构建。
 */

import React, { forwardRef, useId } from 'react'
import { motion, MotionProps } from 'framer-motion'
import { cn } from '../../utils/cn'

// ============================================================================
// Props Type Definitions
// ============================================================================

export interface ChartContainerProps extends Omit<MotionProps, 'children'> {
  /**
   * 图表的标题或描述
   */
  title?: string

  /**
   * 图表的描述性文本（用于无障碍访问）
   */
  ariaLabel?: string

  /**
   * 图表的高度
   */
  height?: number | string

  /**
   * 图表的宽高比（仅在未设置高度时生效）
   */
  aspectRatio?: number | string

  /**
   * 容器的内边距
   */
  padding?: number | string

  /**
   * 容器的外边距
   */
  margin?: number | string

  /**
   * 图例的位置
   */
  legendPosition?: 'top' | 'bottom' | 'left' | 'right' | 'none'

  /**
   * 是否显示网格线
   */
  showGrid?: boolean

  /**
   * 容器的样式类名
   */
  className?: string

  /**
   * 图表内容
   */
  children: React.ReactNode

  /**
   * 自定义样式
   */
  style?: React.CSSProperties
}

// ============================================================================
// Component Implementation
// ============================================================================

/**
 * ChartContainer 组件
 *
 * 为图表提供统一的容器，包含：
 * - 响应式布局支持
 * - 可配置的内边距和外边距
 * - 宽高比控制
 * - 图例位置配置
 * - 无障碍访问支持
 * - 主题系统集成
 */
export const ChartContainer = forwardRef<HTMLDivElement, ChartContainerProps>(
  (
    {
      title,
      ariaLabel,
      height = 300,
      aspectRatio,
      padding = 20,
      margin,
      legendPosition = 'top',
      showGrid = true,
      className,
      children,
      style,
      ...motionProps
    },
    ref
  ) => {
    const id = useId()

    // 容器样式
    const containerStyles: React.CSSProperties = {
      width: '100%',
      height: typeof height === 'number' ? `${height}px` : height,
      padding: typeof padding === 'number' ? `${padding}px` : padding,
      margin,
      position: 'relative',
      ...style
    }

    // 图表区域样式
    const chartAreaStyles: React.CSSProperties = {
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }

    // 计算图例位置样式
    const getLegendStyles = () => {
      const styles: React.CSSProperties = {}

      switch (legendPosition) {
        case 'top':
          styles.borderBottom = '1px solid var(--color-border)'
          styles.paddingBottom = '10px'
          styles.marginBottom = '10px'
          break
        case 'bottom':
          styles.borderTop = '1px solid var(--color-border)'
          styles.paddingTop = '10px'
          styles.marginTop = '10px'
          break
        case 'left':
          styles.borderRight = '1px solid var(--color-border)'
          styles.paddingRight = '10px'
          styles.marginRight = '10px'
          break
        case 'right':
          styles.borderLeft = '1px solid var(--color-border)'
          styles.paddingLeft = '10px'
          styles.marginLeft = '10px'
          break
      }

      return styles
    }

    return (
      <motion.div
        ref={ref}
        id={id}
        className={cn(
          'chart-container',
          'bg-[var(--color-surface)]',
          'border border-[var(--color-border)]',
          'rounded-[var(--radius-md)]',
          'p-4',
          'shadow-sm',
          'hover:shadow-md',
          'transition-shadow',
          'duration-200',
          className
        )}
        style={containerStyles}
        aria-label={ariaLabel}
        role="img"
        {...motionProps}
      >
        {title && (
          <div className="mb-4">
            <h3 className="text-[var(--color-text-primary)] font-medium text-sm">
              {title}
            </h3>
          </div>
        )}

        <div style={chartAreaStyles}>
          {legendPosition !== 'none' && (
            <div
              className="legend-container"
              style={{
                flexShrink: 0,
                ...getLegendStyles()
              }}
            >
              {/* 图例内容 */}
            </div>
          )}

          <div
            className="chart-content"
            style={{
              flex: 1,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {children}
          </div>

          {showGrid && (
            <div
              className="chart-grid"
              style={{
                position: 'absolute',
                top: legendPosition === 'top' ? '60px' : '0',
                left: legendPosition === 'left' ? '100px' : '0',
                right: legendPosition === 'right' ? '100px' : '0',
                bottom: legendPosition === 'bottom' ? '60px' : '0',
                pointerEvents: 'none'
              }}
            >
              {/* 网格线内容 */}
            </div>
          )}
        </div>
      </motion.div>
    )
  }
)

ChartContainer.displayName = 'ChartContainer'

// ============================================================================
// Export
// ============================================================================

export type { ChartContainerProps }
