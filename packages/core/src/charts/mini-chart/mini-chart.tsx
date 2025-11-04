/**
 * @file MiniChart 迷你图表组件
 * @description 多类型迷你数据可视化组件，支持线图、柱状图、饼图等多种图表
 * @version 1.0.0
 * @stable true
 * @category Charts
 */

import React, { forwardRef, useMemo, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Variant } from 'framer-motion'

// =============================================================================
// 类型定义
// =============================================================================

export interface MiniChartDataPoint {
  value: number
  label?: string
  color?: string
}

export interface MiniChartTrend {
  direction: 'up' | 'down' | 'neutral'
  percentage: number
}

export interface MiniChartProps {
  /**
   * 图表类型
   * @default 'line'
   */
  type?: 'line' | 'area' | 'bar' | 'pie' | 'donut'

  /**
   * 数据点数组
   */
  data: MiniChartDataPoint[]

  /**
   * 图表宽度
   * @default 120
   */
  width?: number

  /**
   * 图表高度
   * @default 60
   */
  height?: number

  /**
   * 紧凑模式（减少内边距）
   * @default false
   */
  compact?: boolean

  /**
   * 是否显示趋势指示
   * @default false
   */
  showTrend?: boolean

  /**
   * 是否显示百分比变化
   * @default false
   */
  showChange?: boolean

  /**
   * 趋势模式（仅线图和面积图有效）
   * @default 'auto'
   */
  trendMode?: 'auto' | 'up' | 'down' | 'neutral'

  /**
   * 颜色变体
   * @default 'primary'
   */
  colorVariant?: 'primary' | 'success' | 'danger' | 'warning' | 'neutral'

  /**
   * 是否启用动画
   * @default true
   */
  animated?: boolean

  /**
   * 自定义类名
   */
  className?: string

  /**
   * 鼠标悬停回调
   */
  onHover?: (point: MiniChartDataPoint | null) => void

  /**
   * 点击回调
   */
  onClick?: (point: MiniChartDataPoint | null) => void

  /**
   * 工具提示自定义渲染
   */
  renderTooltip?: (point: MiniChartDataPoint) => React.ReactNode

  /**
   * 内半径（仅 donut 图表有效）
   * @default 0.6
   */
  innerRadiusRatio?: number

  /**
   * 数据点大小（仅 line 和 area 图表有效）
   * @default 3
   */
  pointSize?: number
}

// =============================================================================
// 主题颜色映射
// =============================================================================

const getColorClasses = (
  variant: string,
  type: 'line' | 'area' | 'bar' | 'pie' | 'donut'
) => {
  const colorMap: Record<string, { stroke: string; fill: string; bg?: string }> = {
    primary: {
      stroke: 'stroke-blue-500',
      fill: 'fill-blue-500',
      bg: 'bg-blue-500',
    },
    success: {
      stroke: 'stroke-green-500',
      fill: 'fill-green-500',
      bg: 'bg-green-500',
    },
    danger: {
      stroke: 'stroke-red-500',
      fill: 'fill-red-500',
      bg: 'bg-red-500',
    },
    warning: {
      stroke: 'stroke-yellow-500',
      fill: 'fill-yellow-500',
      bg: 'bg-yellow-500',
    },
    neutral: {
      stroke: 'stroke-gray-500',
      fill: 'fill-gray-500',
      bg: 'bg-gray-500',
    },
  }

  const colors = colorMap[variant] || colorMap.primary

  // 为不同图表类型返回不同的样式组合
  if (type === 'pie' || type === 'donut') {
    return {
      stroke: colors.stroke,
      fill: colors.fill,
      bg: colors.bg,
    }
  }

  return colors
}

const getTrendColor = (direction: 'up' | 'down' | 'neutral') => {
  switch (direction) {
    case 'up':
      return 'text-green-500'
    case 'down':
      return 'text-red-500'
    default:
      return 'text-gray-500'
  }
}

const getTrendIcon = (direction: 'up' | 'down' | 'neutral') => {
  switch (direction) {
    case 'up':
      return '↑'
    case 'down':
      return '↓'
    default:
      return '→'
  }
}

// =============================================================================
// 工具函数
// =============================================================================

/**
 * 计算趋势
 */
const calculateTrend = (
  data: MiniChartDataPoint[],
  mode: 'auto' | 'up' | 'down' | 'neutral'
): MiniChartTrend => {
  if (data.length < 2) {
    return { direction: 'neutral', percentage: 0 }
  }

  if (mode !== 'auto') {
    const percentage = Math.abs(
      ((data[data.length - 1].value - data[0].value) / data[0].value) * 100
    )
    return { direction: mode, percentage: percentage }
  }

  const first = data[0].value
  const last = data[data.length - 1].value
  const percentage = ((last - first) / (first || 1)) * 100

  if (percentage > 1) {
    return { direction: 'up', percentage }
  } else if (percentage < -1) {
    return { direction: 'down', percentage: Math.abs(percentage) }
  } else {
    return { direction: 'neutral', percentage: 0 }
  }
}

/**
 * 计算线图路径
 */
const calculateLinePath = (
  points: MiniChartDataPoint[],
  width: number,
  height: number,
  variant: 'line' | 'area'
): string => {
  if (points.length === 0) return ''

  const maxValue = Math.max(...points.map(p => p.value))
  const minValue = Math.min(...points.map(p => p.value))
  const range = maxValue - minValue || 1

  const stepX = width / (points.length - 1 || 1)

  const smoothPoints = points.map((point, index) => ({
    x: index * stepX,
    y: height - ((point.value - minValue) / range) * height,
  }))

  // 构建路径
  let path = `M ${smoothPoints[0].x},${smoothPoints[0].y}`

  for (let i = 1; i < smoothPoints.length; i++) {
    path += ` L ${smoothPoints[i].x},${smoothPoints[i].y}`
  }

  if (variant === 'area') {
    path += ` L ${smoothPoints[smoothPoints.length - 1].x},${height}`
    path += ` L 0,${height} Z`
  }

  return path
}

/**
 * 计算柱状图路径
 */
const calculateBarPath = (
  points: MiniChartDataPoint[],
  width: number,
  height: number
): Array<{ x: number; y: number; w: number; h: number; color: string }> => {
  if (points.length === 0) return []

  const maxValue = Math.max(...points.map(p => p.value))
  const minValue = Math.min(...points.map(p => p.value))
  const range = maxValue - minValue || 1

  const barWidth = width / points.length * 0.7
  const barSpacing = width / points.length * 0.3

  return points.map((point, index) => {
    const barHeight = ((point.value - minValue) / range) * height
    const x = index * (barWidth + barSpacing) + barSpacing / 2
    const y = height - barHeight

    return {
      x,
      y,
      w: barWidth,
      h: barHeight,
      color: point.color || 'currentColor',
    }
  })
}

/**
 * 计算饼图路径
 */
const calculatePiePath = (
  points: MiniChartDataPoint[],
  width: number,
  height: number,
  innerRadiusRatio: number = 0
): Array<{ path: string; color: string }> => {
  if (points.length === 0) return []

  const total = points.reduce((sum, p) => sum + p.value, 0)
  const centerX = width / 2
  const centerY = height / 2
  const radius = Math.min(width, height) / 2 - 2
  const innerRadius = radius * innerRadiusRatio

  let currentAngle = -Math.PI / 2 // 从顶部开始

  return points.map((point) => {
    const angle = (point.value / total) * 2 * Math.PI
    const startAngle = currentAngle
    const endAngle = currentAngle + angle

    const x1 = centerX + radius * Math.cos(startAngle)
    const y1 = centerY + radius * Math.sin(startAngle)
    const x2 = centerX + radius * Math.cos(endAngle)
    const y2 = centerY + radius * Math.sin(endAngle)

    const largeArcFlag = angle > Math.PI ? 1 : 0

    let path = ''

    if (innerRadius > 0) {
      // 环形图
      const ix1 = centerX + innerRadius * Math.cos(endAngle)
      const iy1 = centerY + innerRadius * Math.sin(endAngle)
      const ix2 = centerX + innerRadius * Math.cos(startAngle)
      const iy2 = centerY + innerRadius * Math.sin(startAngle)

      path = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${ix2} ${iy2} Z`
    } else {
      // 饼图
      path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
    }

    currentAngle += angle

    return {
      path,
      color: point.color || 'currentColor',
    }
  })
}

// =============================================================================
// 动画变体
// =============================================================================

const chartVariants: Variant = {
  initial: {
    opacity: 0,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
}

const itemVariants: Variant = {
  initial: {
    opacity: 0,
    scale: 0,
  },
  animate: (index: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: index * 0.05,
      duration: 0.3,
      ease: 'easeOut',
    },
  }),
}

// =============================================================================
// 主组件
// =============================================================================

/**
 * MiniChart 迷你图表组件
 *
 * 一个多类型的迷你数据可视化组件，支持线图、面积图、柱状图、饼图和环形图。
 * 适用于数据密集型表格和卡片，具有紧凑的布局和趋势指示功能。
 */
export const MiniChart = forwardRef<SVGSVGElement, MiniChartProps>(
  (
    {
      type = 'line',
      data,
      width = 120,
      height = 60,
      compact = false,
      showTrend = false,
      showChange = false,
      trendMode = 'auto',
      colorVariant = 'primary',
      animated = true,
      className = '',
      onHover,
      onClick,
      renderTooltip,
      innerRadiusRatio = 0.6,
      pointSize = 3,
    },
    ref
  ) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
    const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // 计算趋势
    const trend = useMemo(() => {
      return calculateTrend(data, trendMode)
    }, [data, trendMode])

    // 根据图表类型计算渲染数据
    const renderData = useMemo(() => {
      const colors = getColorClasses(colorVariant, type)
      const padding = compact ? 2 : 4
      const chartWidth = width - padding * 2
      const chartHeight = height - padding * 2

      switch (type) {
        case 'line':
        case 'area':
          return {
            path: calculateLinePath(data, chartWidth, chartHeight, type),
            points: data.map((point, index) => {
              const maxValue = Math.max(...data.map(p => p.value))
              const minValue = Math.min(...data.map(p => p.value))
              const range = maxValue - minValue || 1
              const stepX = chartWidth / (data.length - 1 || 1)

              return {
                x: padding + index * stepX,
                y: padding + (chartHeight - ((point.value - minValue) / range) * chartHeight),
                ...point,
              }
            }),
            colors,
          }

        case 'bar':
          return {
            bars: calculateBarPath(data, chartWidth, chartHeight),
            colors,
          }

        case 'pie':
        case 'donut':
          return {
            segments: calculatePiePath(data, width, height, type === 'donut' ? innerRadiusRatio : 0),
            colors,
          }

        default:
          return null
      }
    }, [data, width, height, type, compact, colorVariant, innerRadiusRatio])

    // 鼠标事件处理
    const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
      if (!containerRef.current || data.length === 0) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = event.clientX - rect.left

      // 找到最近的点
      const stepX = width / data.length
      const index = Math.round(x / stepX)
      const clampedIndex = Math.max(0, Math.min(data.length - 1, index))

      setHoveredIndex(clampedIndex)
      setTooltipPos({ x: event.clientX, y: event.clientY })

      if (onHover) {
        onHover(data[clampedIndex])
      }
    }

    const handleMouseLeave = () => {
      setHoveredIndex(null)
      setTooltipPos(null)
      if (onHover) {
        onHover(null)
      }
    }

    // 工具提示组件
    const Tooltip = () => {
      if (hoveredIndex === null || !tooltipPos || !renderTooltip) return null

      const point = data[hoveredIndex]
      if (!point) return null

      return (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute z-50 pointer-events-none"
            style={{
              left: tooltipPos.x + 10,
              top: tooltipPos.y - 40,
            }}
          >
            <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md px-2 py-1 shadow-lg">
              {renderTooltip(point)}
            </div>
          </motion.div>
        </AnimatePresence>
      )
    }

    return (
      <div
        ref={containerRef}
        className={`relative inline-block ${className}`}
        style={{ width, height }}
      >
        <motion.svg
          ref={ref}
          width={width}
          height={height}
          className="overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={() =>
            onClick && hoveredIndex !== null ? onClick(data[hoveredIndex]) : null
          }
          variants={animated ? chartVariants : undefined}
          initial={animated ? 'initial' : undefined}
          animate={animated ? 'animate' : undefined}
        >
          {/* 渲染不同类型的图表 */}
          {type === 'line' || type === 'area' ? (
            <>
              {/* 路径 */}
              <motion.path
                d={renderData?.path || ''}
                fill={type === 'area' ? 'currentColor' : 'none'}
                className={`${renderData?.colors?.stroke} ${type === 'area' ? 'opacity-20' : ''}`}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={animated ? itemVariants : undefined}
                custom={0}
              />

              {/* 数据点 */}
              {renderData?.points?.map((point, index) => (
                <motion.circle
                  key={index}
                  cx={point.x}
                  cy={point.y}
                  r={hoveredIndex === index ? pointSize + 1 : pointSize}
                  fill="white"
                  stroke="currentColor"
                  strokeWidth={2}
                  className={renderData?.colors?.stroke}
                  variants={animated ? itemVariants : undefined}
                  custom={index + 1}
                />
              ))}
            </>
          ) : type === 'bar' ? (
            /* 柱状图 */
            <g>
              {renderData?.bars?.map((bar, index) => (
                <motion.rect
                  key={index}
                  x={bar.x}
                  y={bar.y}
                  width={bar.w}
                  height={bar.h}
                  fill={bar.color}
                  className={renderData?.colors?.fill}
                  rx={compact ? 1 : 2}
                  variants={animated ? itemVariants : undefined}
                  custom={index}
                />
              ))}
            </g>
          ) : type === 'pie' || type === 'donut' ? (
            /* 饼图/环形图 */
            <g>
              {renderData?.segments?.map((segment, index) => (
                <motion.path
                  key={index}
                  d={segment.path}
                  fill={segment.color}
                  className={hoveredIndex === index ? 'opacity-80' : 'opacity-90'}
                  variants={animated ? itemVariants : undefined}
                  custom={index}
                />
              ))}
            </g>
          ) : null}
        </motion.svg>

        {/* 趋势指示 */}
        {showTrend && (
          <div className={`absolute -right-1 -top-1 text-xs font-medium ${getTrendColor(trend.direction)}`}>
            <span>
              {getTrendIcon(trend.direction)}
              {trend.percentage.toFixed(1)}%
            </span>
          </div>
        )}

        {/* 百分比变化 */}
        {showChange && (
          <div className={`absolute -right-1 -bottom-1 text-xs font-medium ${getTrendColor(trend.direction)}`}>
            <span>
              {trend.direction === 'up' ? '↗' : trend.direction === 'down' ? '↘' : '→'}
              {Math.abs(trend.percentage).toFixed(1)}%
            </span>
          </div>
        )}

        {/* 工具提示 */}
        <Tooltip />
      </div>
    )
  }
)

MiniChart.displayName = 'MiniChart'
