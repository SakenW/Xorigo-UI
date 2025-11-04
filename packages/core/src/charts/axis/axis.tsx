/**
 * Axis - 坐标轴组件
 *
 * 为图表提供 X 轴和 Y 轴，支持标签、刻度、网格线等。
 * 这是图表组件库的核心组件，与 ChartContainer 配合使用。
 */

import React, { forwardRef, useId } from 'react'
import { motion, MotionProps } from 'framer-motion'
import { cn } from '../../utils/cn'

// ============================================================================
// Props Type Definitions
// ============================================================================

export interface AxisProps extends Omit<MotionProps, 'children'> {
  /**
   * 坐标轴类型
   */
  type: 'x' | 'y'

  /**
   * 坐标轴的位置
   */
  position?: 'top' | 'bottom' | 'left' | 'right'

  /**
   * 坐标轴的标签
   */
  label?: string

  /**
   * 坐标轴的刻度值
   */
  ticks?: Array<{
    value: number | string
    label?: string
    position?: number
  }>

  /**
   * 是否显示网格线
   */
  showGrid?: boolean

  /**
   * 是否显示刻度标签
   */
  showTickLabels?: boolean

  /**
   * 刻度标签的旋转角度
   */
  tickLabelRotation?: number

  /**
   * 网格线的颜色
   */
  gridColor?: string

  /**
   * 坐标轴的颜色
   */
  axisColor?: string

  /**
   * 坐标轴的样式类名
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
 * Axis 组件
 *
 * 为图表提供统一的坐标轴，包含：
 * - X 轴和 Y 轴支持
 * - 可配置的位置和样式
 * - 刻度值和标签支持
 * - 网格线显示
 * - 自定义颜色和样式
 * - 主题系统集成
 */
export const Axis = forwardRef<SVGGElement, AxisProps>(
  (
    {
      type = 'x',
      position = type === 'x' ? 'bottom' : 'left',
      label,
      ticks = [],
      showGrid = true,
      showTickLabels = true,
      tickLabelRotation = 0,
      gridColor = 'var(--color-border)',
      axisColor = 'var(--color-text-primary)',
      className,
      style,
      ...motionProps
    },
    ref
  ) => {
    const id = useId()

    // 计算坐标轴的基本属性
    const getAxisConfig = () => {
      const isHorizontal = type === 'x'
      const isVertical = type === 'y'

      return {
        isHorizontal,
        isVertical,
        // 坐标轴线的位置
        axisLine: {
          x1: isHorizontal ? 0 : 0,
          y1: isHorizontal ? 0 : 0,
          x2: isHorizontal ? 100 : 0,
          y2: isHorizontal ? 0 : 100
        },
        // 刻度点的位置
        tickPosition: (index: number) => ({
          x: isHorizontal ? (100 / (ticks.length - 1)) * index : 0,
          y: isHorizontal ? 0 : (100 / (ticks.length - 1)) * index
        }),
        // 网格线的位置
        gridLinePosition: (index: number) => ({
          x1: isHorizontal ? (100 / (ticks.length - 1)) * index : 0,
          y1: isHorizontal ? 0 : (100 / (ticks.length - 1)) * index,
          x2: isHorizontal ? (100 / (ticks.length - 1)) * index : 100,
          y2: isHorizontal ? 100 : (100 / (ticks.length - 1)) * index
        })
      }
    }

    const config = getAxisConfig()

    return (
      <motion.g
        ref={ref}
        id={id}
        className={cn('axis', `axis-${type}`, className)}
        style={style}
        {...motionProps}
      >
        {/* 坐标轴线 */}
        <line
          x1={config.axisLine.x1}
          y1={config.axisLine.y1}
          x2={config.axisLine.x2}
          y2={config.axisLine.y2}
          stroke={axisColor}
          strokeWidth={1}
        />

        {/* 网格线 */}
        {showGrid && ticks.map((tick, index) => {
          const gridPos = config.gridLinePosition(index)
          return (
            <line
              key={`grid-${index}`}
              x1={gridPos.x1}
              y1={gridPos.y1}
              x2={gridPos.x2}
              y2={gridPos.y2}
              stroke={gridColor}
              strokeWidth={0.5}
              opacity={0.3}
            />
          )
        })}

        {/* 刻度线和标签 */}
        {ticks.map((tick, index) => {
          const tickPos = config.tickPosition(index)
          const isHorizontal = config.isHorizontal

          return (
            <g key={`tick-${index}`}>
              {/* 刻度线 */}
              <line
                x1={tickPos.x}
                y1={tickPos.y}
                x2={tickPos.x + (isHorizontal ? 0 : 6)}
                y2={tickPos.y + (isHorizontal ? 6 : 0)}
                stroke={axisColor}
                strokeWidth={1}
              />

              {/* 刻度标签 */}
              {showTickLabels && (
                <text
                  x={tickPos.x + (isHorizontal ? 0 : 8)}
                  y={tickPos.y + (isHorizontal ? 18 : 4)}
                  fill={axisColor}
                  fontSize={12}
                  textAnchor={isHorizontal ? 'middle' : 'start'}
                  transform={
                    isHorizontal && tickLabelRotation !== 0
                      ? `rotate(${tickLabelRotation}, ${tickPos.x}, ${tickPos.y + 18})`
                      : undefined
                  }
                >
                  {tick.label || tick.value}
                </text>
              )}
            </g>
          )
        })}

        {/* 坐标轴标签 */}
        {label && (
          <text
            x={config.isHorizontal ? 50 : -40}
            y={config.isHorizontal ? 115 : 50}
            fill={axisColor}
            fontSize={14}
            fontWeight="medium"
            textAnchor="middle"
            transform={config.isHorizontal ? undefined : 'rotate(-90)'}
          >
            {label}
          </text>
        )}
      </motion.g>
    )
  }
)

Axis.displayName = 'Axis'

// ============================================================================
// Export
// ============================================================================

export type { AxisProps }
