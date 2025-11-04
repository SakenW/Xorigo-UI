/**
 * Legend - 图例组件
 *
 * 为图表提供图例显示，支持多种布局方式、颜色、符号等。
 * 这是图表组件库的重要组件，与 ChartContainer 配合使用。
 */

import React, { forwardRef, useId } from 'react'
import { motion, MotionProps } from 'framer-motion'
import { cn } from '../../utils/cn'

// ============================================================================
// Props Type Definitions
// ============================================================================

export interface LegendItem {
  /**
   * 图例项的唯一标识
   */
  id: string

  /**
   * 图例项的标签
   */
  label: string

  /**
   * 图例项的颜色
   */
  color: string

  /**
   * 图例项的符号类型
   */
  symbol?: 'circle' | 'square' | 'triangle' | 'diamond' | 'line'

  /**
   * 图例项是否可见
   */
  visible?: boolean

  /**
   * 图例项的选中状态
   */
  checked?: boolean

  /**
   * 自定义符号
   */
  customSymbol?: React.ReactNode
}

export interface LegendProps extends Omit<MotionProps, 'children'> {
  /**
   * 图例项列表
   */
  items: LegendItem[]

  /**
   * 图例的方向
   */
  orientation?: 'horizontal' | 'vertical'

  /**
   * 图例的对齐方式
   */
  align?: 'start' | 'center' | 'end'

  /**
   * 图例项之间的间距
   */
  gap?: number

  /**
   * 图例项的大小
   */
  itemSize?: 'sm' | 'md' | 'lg'

  /**
   * 图例的标题
   */
  title?: string

  /**
   * 图例项的点击处理函数
   */
  onItemClick?: (item: LegendItem, index: number) => void

  /**
   * 图例项的选中处理函数
   */
  onItemCheck?: (item: LegendItem, index: number, checked: boolean) => void

  /**
   * 是否显示选中状态
   */
  showCheck?: boolean

  /**
   * 是否可交互
   */
  interactive?: boolean

  /**
   * 图例的样式类名
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
 * Legend 组件
 *
 * 为图表提供统一的图例显示，包含：
 * - 多种布局方式（水平/垂直）
  * - 可配置的对齐方式和间距
  * - 自定义颜色和符号
  * - 交互式选择和点击
  * - 主题系统集成
  */
export const Legend = forwardRef<HTMLDivElement, LegendProps>(
  (
    {
      items,
      orientation = 'horizontal',
      align = 'start',
      gap = 16,
      itemSize = 'md',
      title,
      onItemClick,
      onItemCheck,
      showCheck = false,
      interactive = true,
      className,
      style,
      ...motionProps
    },
    ref
  ) => {
    const id = useId()

    // 计算图例项的大小
    const getItemSizeConfig = () => {
      switch (itemSize) {
        case 'sm':
          return { symbolSize: 12, fontSize: 12, padding: 8 }
        case 'lg':
          return { symbolSize: 20, fontSize: 14, padding: 12 }
        case 'md':
        default:
          return { symbolSize: 16, fontSize: 14, padding: 10 }
      }
    }

    const sizeConfig = getItemSizeConfig()

    // 计算对齐方式
    const getAlignmentClasses = () => {
      const baseClasses = 'flex'
      if (orientation === 'horizontal') {
        switch (align) {
          case 'center':
            return `${baseClasses} justify-center`
          case 'end':
            return `${baseClasses} justify-end`
          case 'start':
          default:
            return `${baseClasses} justify-start`
        }
      } else {
        switch (align) {
          case 'center':
            return `${baseClasses} items-center`
          case 'end':
            return `${baseClasses} items-end`
          case 'start':
          default:
            return `${baseClasses} items-start`
        }
      }
    }

    // 获取方向类
    const getOrientationClasses = () => {
      return orientation === 'horizontal' ? 'flex-row' : 'flex-col'
    }

    // 渲染符号
    const renderSymbol = (item: LegendItem) => {
      const { symbolSize } = sizeConfig
      const commonProps = {
        width: symbolSize,
        height: symbolSize,
        fill: item.color
      }

      if (item.customSymbol) {
        return <div className="flex-shrink-0">{item.customSymbol}</div>
      }

      switch (item.symbol) {
        case 'square':
          return (
            <svg width={symbolSize} height={symbolSize} viewBox="0 0 16 16">
              <rect width={symbolSize} height={symbolSize} fill={item.color} />
            </svg>
          )
        case 'triangle':
          return (
            <svg width={symbolSize} height={symbolSize} viewBox="0 0 16 16">
              <polygon points="8,2 14,14 2,14" fill={item.color} />
            </svg>
          )
        case 'diamond':
          return (
            <svg width={symbolSize} height={symbolSize} viewBox="0 0 16 16">
              <polygon points="8,2 14,8 8,14 2,8" fill={item.color} />
            </svg>
          )
        case 'line':
          return (
            <svg width={symbolSize} height={symbolSize} viewBox="0 0 16 16">
              <line x1="0" y1={symbolSize / 2} x2={symbolSize} y2={symbolSize / 2} stroke={item.color} strokeWidth={3} />
            </svg>
          )
        case 'circle':
        default:
          return (
            <svg width={symbolSize} height={symbolSize} viewBox="0 0 16 16">
              <circle cx={symbolSize / 2} cy={symbolSize / 2} r={symbolSize / 2 - 1} fill={item.color} />
            </svg>
          )
      }
    }

    // 处理图例项点击
    const handleItemClick = (item: LegendItem, index: number) => {
      if (interactive && onItemClick) {
        onItemClick(item, index)
      }
    }

    // 处理图例项选中
    const handleItemCheck = (item: LegendItem, index: number, event: React.ChangeEvent<HTMLInputElement>) => {
      if (interactive && onItemCheck) {
        onItemCheck(item, index, event.target.checked)
      }
    }

    return (
      <motion.div
        ref={ref}
        id={id}
        className={cn(
          'legend',
          'bg-[var(--color-surface)]',
          'p-3',
          'rounded-[var(--radius-md)]',
          'border border-[var(--color-border)]',
          'shadow-sm',
          className
        )}
        style={style}
        {...motionProps}
      >
        {/* 图例标题 */}
        {title && (
          <div className="mb-3 pb-2 border-b border-[var(--color-border)]">
            <h4 className="text-[var(--color-text-primary)] font-medium text-sm">
              {title}
            </h4>
          </div>
        )}

        {/* 图例项列表 */}
        <div
          className={cn(
            'flex',
            getOrientationClasses(),
            getAlignmentClasses(),
            `gap-${gap}`
          )}
        >
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              className={cn(
                'legend-item',
                'flex',
                'items-center',
                'cursor-pointer',
                interactive && 'hover:bg-[var(--color-surface-elevated)]',
                'rounded-[var(--radius-sm)]',
                'p-2',
                'transition-colors',
                'duration-200',
                !item.visible && 'opacity-50'
              )}
              style={{ padding: sizeConfig.padding }}
              onClick={() => handleItemClick(item, index)}
              whileHover={interactive ? { scale: 1.02 } : undefined}
              whileTap={interactive ? { scale: 0.98 } : undefined}
            >
              {/* 符号 */}
              <div
                className="flex-shrink-0"
                style={{ opacity: item.visible === false ? 0.3 : 1 }}
              >
                {renderSymbol(item)}
              </div>

              {/* 标签和复选框 */}
              <div className="ml-2 flex items-center">
                <span
                  className="text-[var(--color-text-primary)] text-sm"
                  style={{ fontSize: sizeConfig.fontSize }}
                >
                  {item.label}
                </span>

                {showCheck && (
                  <input
                    type="checkbox"
                    className="ml-2 h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)]"
                    checked={item.checked || false}
                    onChange={(e) => handleItemCheck(item, index, e)}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )
  }
)

Legend.displayName = 'Legend'

// ============================================================================
// Export
// ============================================================================

export type { LegendProps, LegendItem }
