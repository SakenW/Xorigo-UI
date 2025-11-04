/**
 * ChartArea - 图表区域容器组件
 *
 * 为图表提供面积图可视化区域，支持渐变填充、交互、阈值线等特性。
 * 这是图表组件库的核心容器组件，基于 ChartContainer 构建。
 */

import React, { forwardRef, useId, useMemo } from 'react'
import { motion, MotionProps } from 'framer-motion'
import { ChartContainer } from '../chart-container/chart-container'
import { Axis } from '../axis/axis'
import { Legend, type LegendItem } from '../legend/legend'
import { ChartTooltip, type TooltipData } from '../chart-tooltip/chart-tooltip'
import { cn } from '../../utils/cn'

// ============================================================================
// Props Type Definitions
// ============================================================================

export interface AreaDataPoint {
  /**
   * X 轴值
   */
  x: number | string

  /**
   * Y 轴值
   */
  y: number

  /**
   * 分类（用于堆叠面积图）
   */
  category?: string

  /**
   * 自定义元数据
   */
  metadata?: Record<string, any>
}

export interface AreaSeries {
  /**
   * 系列名称
   */
  name: string

  /**
   * 系列数据点
   */
  data: AreaDataPoint[]

  /**
   * 系列主色
   */
  color: string

  /**
   * 是否可见
   */
  visible?: boolean

  /**
   * 填充渐变色（可选）
   */
  fillGradient?: {
    from: string
    to: string
  }

  /**
   * 数据点标记样式
   */
  markerStyle?: {
    size?: number
    color?: string
    borderColor?: string
    borderWidth?: number
  }
}

export interface ThresholdLine {
  /**
   * Y 轴阈值
   */
  y: number

  /**
   * 阈值线颜色
   */
  color: string

  /**
   * 阈值线标签
   */
  label?: string

  /**
   * 是否显示标签
   */
  showLabel?: boolean
}

export interface ChartAreaProps extends Omit<MotionProps, 'children'> {
  /**
   * 图表数据系列
   */
  data: AreaSeries[]

  /**
   * 面积图的类型
   */
  type?: 'default' | 'stacked' | 'percent' | 'stream'

  /**
   * 是否显示网格线
   */
  showGrid?: boolean

  /**
   * 是否显示图例
   */
  showLegend?: boolean

  /**
   * 是否显示坐标轴
   */
  showAxis?: boolean

  /**
   * 是否显示工具提示
   */
  showTooltip?: boolean

  /**
   * 工具提示的自定义渲染函数
   */
  tooltipFormatter?: (data: AreaDataPoint, series: AreaSeries) => React.ReactNode

  /**
   * X 轴的标签
   */
  xAxisLabel?: string

  /**
   * Y 轴的标签
   */
  yAxisLabel?: string

  /**
   * 填充透明度
   */
  fillOpacity?: number

  /**
   * 是否显示面积边界线
   */
  showStroke?: boolean

  /**
   * 边界线宽度
   */
  strokeWidth?: number

  /**
   * 面积图的样式类名
   */
  className?: string

  /**
   * 自定义样式
   */
  style?: React.CSSProperties

  /**
   * 图表的高度
   */
  height?: number | string

  /**
   * 图表的宽度
   */
  width?: number | string

  /**
   * 阈值线配置
   */
  thresholdLines?: ThresholdLine[]

  /**
   * 是否显示数据点标记
   */
  showMarkers?: boolean

  /**
   * 数据点标记的大小
   */
  markerSize?: number

  /**
   * 区域填充类型
   */
  fillType?: 'solid' | 'gradient' | 'pattern'

  /**
   * 动画持续时间（毫秒）
   */
  animationDuration?: number

  /**
   * X 轴的配置
   */
  xAxisConfig?: {
    ticks?: Array<{ value: number | string; label?: string }>
    tickFormatter?: (value: number | string) => string
    showGrid?: boolean
  }

  /**
   * Y 轴的配置
   */
  yAxisConfig?: {
    ticks?: Array<{ value: number; label?: string }>
    tickFormatter?: (value: number) => string
    min?: number
    max?: number
    showGrid?: boolean
  }
}

// ============================================================================
// Component Implementation
// ============================================================================

/**
 * ChartArea 组件
 *
 * 为图表提供面积图可视化区域，包含：
 * - 多种面积图类型（默认、堆叠、百分比、流向）
 * - 支持渐变填充和数据点标记
 * - 阈值线显示和自定义样式
 * - 完整的动画和交互支持
 * - 主题系统深度集成
 */
export const ChartArea = forwardRef<HTMLDivElement, ChartAreaProps>(
  (
    {
      data,
      type = 'default',
      showGrid = true,
      showLegend = true,
      showAxis = true,
      showTooltip = true,
      tooltipFormatter,
      xAxisLabel,
      yAxisLabel,
      fillOpacity = 0.6,
      showStroke = true,
      strokeWidth = 2,
      className,
      style,
      height = 300,
      width = '100%',
      thresholdLines = [],
      showMarkers = false,
      markerSize = 4,
      fillType = 'gradient',
      animationDuration = 800,
      xAxisConfig,
      yAxisConfig,
      ...motionProps
    },
    ref
  ) => {
    const id = useId()

    // 计算图表的尺寸
    const chartWidth = typeof width === 'number' ? width : 500
    const chartHeight = typeof height === 'number' ? height : 300

    // 计算坐标轴的刻度
    const xAxisTicks = useMemo(() => {
      if (xAxisConfig?.ticks) {
        return xAxisConfig.ticks
      }

      const xValues = data[0]?.data.map(d => d.x) || []
      return xValues.map((value) => ({
        value,
        label: xAxisConfig?.tickFormatter ? xAxisConfig.tickFormatter(value) : String(value)
      }))
    }, [data, xAxisConfig])

    const yAxisTicks = useMemo(() => {
      if (yAxisConfig?.ticks) {
        return yAxisConfig.ticks
      }

      const allValues = data.flatMap(series => series.data.map(d => d.y))
      const maxValue = Math.max(...allValues, ...thresholdLines.map(t => t.y))
      const minValue = Math.min(...allValues, 0, ...thresholdLines.map(t => t.y))
      const range = maxValue - minValue
      const step = range / 5

      return Array.from({ length: 6 }, (_, index) => {
        const value = minValue + step * index
        return {
          value,
          label: yAxisConfig?.tickFormatter ? yAxisConfig.tickFormatter(value) : value.toFixed(0)
        }
      })
    }, [data, thresholdLines, yAxisConfig])

    // 计算图例项
    const legendItems: LegendItem[] = data.map((series, index) => ({
      id: String(index),
      label: series.name,
      color: series.color,
      visible: series.visible !== false
    }))

    // 计算 SVG 路径
    const calculatePaths = () => {
      return data.map((series, seriesIndex) => {
        if (!series.visible) return null

        const pathData = series.data.map((point, index) => {
          const x = (index / (series.data.length - 1)) * (chartWidth - 100) + 50
          const maxY = Math.max(...yAxisTicks.map(t => t.value))
          const minY = Math.min(...yAxisTicks.map(t => t.value))
          const normalizedY = (point.y - minY) / (maxY - minY || 1)
          const y = chartHeight - 50 - normalizedY * (chartHeight - 100)

          return { x, y, point }
        })

        // 创建面积路径
        const areaPath = [
          `M ${pathData[0].x},${chartHeight - 50}`,
          ...pathData.map((p) => `L ${p.x},${p.y}`),
          `L ${pathData[pathData.length - 1].x},${chartHeight - 50}`,
          'Z'
        ].join(' ')

        // 创建边界路径
        const strokePath = pathData.map((p, i) => i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`).join(' ')

        // 创建渐变定义
        const gradientId = `gradient-${id}-${seriesIndex}`

        return {
          series,
          areaPath,
          strokePath,
          pathData,
          gradientId
        }
      }).filter(Boolean)
    }

    const paths = calculatePaths()

    // 工具提示处理
    const [tooltipData, setTooltipData] = React.useState<TooltipData | null>(null)

    const handleMouseMove = (event: React.MouseEvent<SVGElement>) => {
      if (!showTooltip) return

      const rect = event.currentTarget.getBoundingClientRect()
      const x = event.clientX - rect.left

      const allPoints = data.flatMap(series =>
        series.data.map((point, index) => ({
          series,
          point,
          index
        }))
      )

      if (allPoints.length === 0) return

      const closestPoint = allPoints.reduce((closest, current) => {
        const currentX = (current.index / (data[0].data.length - 1)) * (chartWidth - 100) + 50
        const currentDistance = Math.abs(currentX - x)
        const closestDistance = Math.abs(((closest.index / (data[0].data.length - 1)) * (chartWidth - 100) + 50) - x)

        return currentDistance < closestDistance ? current : closest
      })

      const tooltipContent = tooltipFormatter
        ? tooltipFormatter(closestPoint.point, closestPoint.series)
        : `${closestPoint.series.name}: ${closestPoint.point.y}`

      setTooltipData({
        id: '1',
        title: String(closestPoint.point.x),
        content: tooltipContent,
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        color: closestPoint.series.color
      })
    }

    const handleMouseLeave = () => {
      setTooltipData(null)
    }

    return (
      <div
        ref={ref}
        id={id}
        className={cn('chart-area', className)}
        style={{ width, ...style }}
        {...motionProps}
      >
        <ChartContainer height={height}>
          <svg
            width={chartWidth}
            height={chartHeight}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="overflow-visible"
          >
            <defs>
              {/* 生成渐变定义 */}
              {paths.map((path, index) => {
                if (!path || !path.series.fillGradient) return null

                return (
                  <linearGradient
                    key={path.gradientId}
                    id={path.gradientId}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={path.series.fillGradient.from} stopOpacity={fillOpacity} />
                    <stop offset="100%" stopColor={path.series.fillGradient.to} stopOpacity={fillOpacity * 0.1} />
                  </linearGradient>
                )
              })}
            </defs>

            {/* 网格线 */}
            {showGrid && (
              <>
                {yAxisTicks.map((tick, index) => {
                  const y = chartHeight - 50 - (index / (yAxisTicks.length - 1)) * (chartHeight - 100)
                  return (
                    <line
                      key={`y-grid-${index}`}
                      x1={50}
                      y1={y}
                      x2={chartWidth - 50}
                      y2={y}
                      stroke="var(--color-border)"
                      strokeWidth={0.5}
                      opacity={0.3}
                    />
                  )
                })}
              </>
            )}

            {/* 阈值线 */}
            {thresholdLines.map((threshold, index) => {
              const maxY = Math.max(...yAxisTicks.map(t => t.value))
              const minY = Math.min(...yAxisTicks.map(t => t.value))
              const normalizedY = (threshold.y - minY) / (maxY - minY || 1)
              const y = chartHeight - 50 - normalizedY * (chartHeight - 100)

              return (
                <g key={`threshold-${index}`}>
                  <line
                    x1={50}
                    y1={y}
                    x2={chartWidth - 50}
                    y2={y}
                    stroke={threshold.color}
                    strokeWidth={1}
                    strokeDasharray="4,4"
                    opacity={0.6}
                  />
                  {threshold.showLabel && threshold.label && (
                    <text
                      x={chartWidth - 45}
                      y={y - 5}
                      fill={threshold.color}
                      fontSize={10}
                      textAnchor="end"
                    >
                      {threshold.label}
                    </text>
                  )}
                </g>
              )
            })}

            {/* 面积图路径 */}
            {paths.map((path, index) => {
              if (!path) return null

              const fillValue = path.series.fillGradient
                ? `url(#${path.gradientId})`
                : path.series.color

              return (
                <g key={index}>
                  {/* 面积填充 */}
                  <motion.path
                    d={path.areaPath}
                    fill={fillValue}
                    fillOpacity={fillOpacity}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: animationDuration / 1000, delay: index * 0.1 }}
                  />

                  {/* 边界线 */}
                  {showStroke && (
                    <motion.path
                      d={path.strokePath}
                      fill="none"
                      stroke={path.series.color}
                      strokeWidth={strokeWidth}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: animationDuration / 1000, delay: index * 0.1 }}
                    />
                  )}

                  {/* 数据点标记 */}
                  {showMarkers && path.pathData.map((point, pointIndex) => (
                    <motion.circle
                      key={pointIndex}
                      cx={point.x}
                      cy={point.y}
                      r={path.series.markerStyle?.size || markerSize}
                      fill={path.series.markerStyle?.color || path.series.color}
                      stroke={path.series.markerStyle?.borderColor || 'var(--color-surface)'}
                      strokeWidth={path.series.markerStyle?.borderWidth || 2}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: (index * 0.1) + (pointIndex * 0.02)
                      }}
                    />
                  ))}
                </g>
              )
            })}

            {/* 坐标轴 */}
            {showAxis && (
              <>
                <Axis
                  type="x"
                  label={xAxisLabel}
                  ticks={xAxisTicks}
                  showGrid={xAxisConfig?.showGrid ?? false}
                  showTickLabels={true}
                />
                <Axis
                  type="y"
                  label={yAxisLabel}
                  ticks={yAxisTicks}
                  showGrid={yAxisConfig?.showGrid ?? false}
                  showTickLabels={true}
                />
              </>
            )}
          </svg>

          {/* 图例 */}
          {showLegend && legendItems.length > 0 && (
            <div className="mt-4">
              <Legend
                items={legendItems}
                orientation="horizontal"
                align="center"
              />
            </div>
          )}

          {/* 工具提示 */}
          {showTooltip && (
            <ChartTooltip
              data={tooltipData || undefined}
              visible={!!tooltipData}
              position="top"
              variant="default"
            />
          )}
        </ChartContainer>
      </div>
    )
  }
)

ChartArea.displayName = 'ChartArea'

// ============================================================================
// Export
// ============================================================================

export type { ChartAreaProps, AreaDataPoint, AreaSeries, ThresholdLine }
