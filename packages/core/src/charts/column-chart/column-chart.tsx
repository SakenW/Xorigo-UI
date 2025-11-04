/**
 * ColumnChart - 条形图组件
 *
 * 为图表提供条形图显示，支持垂直条形图、分组、堆叠等特性。
 * 这是图表组件库的核心组件，基于 ChartContainer 构建。
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

export interface ColumnDataPoint {
  /**
   * X 轴值（分类）
   */
  x: number | string

  /**
   * Y 轴值
   */
  y: number

  /**
   * 系列名称
   */
  category?: string

  /**
   * 自定义数据
   */
  [key: string]: any
}

export interface ColumnSeries {
  /**
   * 系列名称
   */
  name: string

  /**
   * 系列数据
   */
  data: ColumnDataPoint[]

  /**
   * 系列颜色
   */
  color: string

  /**
   * 系列是否可见
   */
  visible?: boolean
}

export interface ColumnChartProps extends Omit<MotionProps, 'children'> {
  /**
   * 图表数据系列
   */
  data: ColumnSeries[]

  /**
   * 条形图的类型
   */
  type?: 'default' | 'grouped' | 'stacked'

  /**
   * 条形的宽度
   */
  barWidth?: number

  /**
   * 条形之间的间距
   */
  barGap?: number

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
  tooltipFormatter?: (data: ColumnDataPoint, series: ColumnSeries) => React.ReactNode

  /**
   * X 轴的标签
   */
  xAxisLabel?: string

  /**
   * Y 轴的标签
   */
  yAxisLabel?: string

  /**
   * 是否显示边框
   */
  showBorder?: boolean

  /**
   * 条形图的样式类名
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
   * X 轴的配置
   */
  xAxisConfig?: {
    ticks?: Array<{ value: number | string; label?: string }>
    tickFormatter?: (value: number | string) => string
  }

  /**
   * Y 轴的配置
   */
  yAxisConfig?: {
    ticks?: Array<{ value: number; label?: string }>
    tickFormatter?: (value: number) => string
    min?: number
    max?: number
  }
}

// ============================================================================
// Component Implementation
// ============================================================================

/**
 * ColumnChart 组件
 *
 * 为图表提供条形图显示，包含：
 * - 多种条形图类型（默认、分组、堆叠）
  * - 支持多个数据系列
  * - 可配置的条形宽度和间距
  * - 网格线、图例、工具提示支持
  * - 主题系统集成
  */
export const ColumnChart = forwardRef<HTMLDivElement, ColumnChartProps>(
  (
    {
      data,
      type = 'default',
      barWidth = 40,
      barGap = 2,
      showGrid = true,
      showLegend = true,
      showAxis = true,
      showTooltip = true,
      tooltipFormatter,
      xAxisLabel,
      yAxisLabel,
      showBorder = true,
      className,
      style,
      height = 300,
      width = '100%',
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

      // 从数据中提取 X 轴刻度
      const xValues = data[0]?.data.map(d => d.x) || []
      return xValues.map((value, index) => ({
        value,
        label: xAxisConfig?.tickFormatter ? xAxisConfig.tickFormatter(value) : String(value)
      }))
    }, [data, xAxisConfig])

    const yAxisTicks = useMemo(() => {
      if (yAxisConfig?.ticks) {
        return yAxisConfig.ticks
      }

      // 计算 Y 轴的范围
      const allValues = data.flatMap(series => series.data.map(d => d.y))
      const maxValue = Math.max(...allValues)
      const minValue = Math.min(...allValues)
      const range = maxValue - minValue
      const step = range / 5

      return Array.from({ length: 6 }, (_, index) => {
        const value = minValue + step * index
        return {
          value,
          label: yAxisConfig?.tickFormatter ? yAxisConfig.tickFormatter(value) : value.toFixed(0)
        }
      })
    }, [data, yAxisConfig])

    // 计算图例项
    const legendItems: LegendItem[] = data.map((series, index) => ({
      id: String(index),
      label: series.name,
      color: series.color,
      visible: series.visible !== false
    }))

    // 计算条形的位置和尺寸
    const calculateBars = () => {
      const visibleSeries = data.filter(series => series.visible !== false)
      const categoryCount = xAxisTicks.length
      const groupWidth = categoryCount * (visibleSeries.length * barWidth + (visibleSeries.length - 1) * barGap)
      const maxY = Math.max(...yAxisTicks.map(t => t.value))
      const minY = Math.min(...yAxisTicks.map(t => t.value))

      return data.map((series, seriesIndex) => {
        if (!series.visible) return null

        return series.data.map((point, pointIndex) => {
          const x = pointIndex * (visibleSeries.length * barWidth + (visibleSeries.length - 1) * barGap) + seriesIndex * (barWidth + barGap) + 50
          const normalizedY = (point.y - minY) / (maxY - minY)
          const barHeight = normalizedY * (chartHeight - 100)
          const y = chartHeight - 50 - barHeight

          return {
            series,
            point,
            x,
            y,
            width: barWidth,
            height: barHeight
          }
        }).filter(Boolean)
      }).flat()
    }

    const bars = calculateBars()

    // 工具提示处理
    const [tooltipData, setTooltipData] = React.useState<TooltipData | null>(null)

    const handleMouseEnter = (bar: any, event: React.MouseEvent<SVGElement>) => {
      if (!showTooltip) return

      const rect = event.currentTarget.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top

      const tooltipContent = tooltipFormatter
        ? tooltipFormatter(bar.point, bar.series)
        : `${bar.series.name}: ${bar.point.y}`

      setTooltipData({
        id: '1',
        title: String(bar.point.x),
        content: tooltipContent,
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        color: bar.series.color
      })
    }

    const handleMouseLeave = () => {
      setTooltipData(null)
    }

    return (
      <div
        ref={ref}
        id={id}
        className={cn('column-chart', className)}
        style={{ width, ...style }}
        {...motionProps}
      >
        <ChartContainer height={height}>
          <svg
            width={chartWidth}
            height={chartHeight}
            className="overflow-visible"
          >
            {/* 网格线 */}
            {showGrid && (
              <>
                {/* Y 轴网格线 */}
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

            {/* 条形 */}
            {bars.map((bar, index) => {
              if (!bar) return null

              return (
                <motion.rect
                  key={index}
                  x={bar.x}
                  y={bar.y}
                  width={bar.width}
                  height={bar.height}
                  fill={bar.series.color}
                  stroke={showBorder ? bar.series.color : 'none'}
                  strokeWidth={showBorder ? 1 : 0}
                  rx={4}
                  initial={{ y: chartHeight - 50, height: 0 }}
                  animate={{ y: bar.y, height: bar.height }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  onMouseEnter={(e) => handleMouseEnter(bar, e)}
                  onMouseLeave={handleMouseLeave}
                  className="cursor-pointer"
                />
              )
            })}

            {/* 坐标轴 */}
            {showAxis && (
              <>
                <Axis
                  type="x"
                  label={xAxisLabel}
                  ticks={xAxisTicks}
                  showGrid={false}
                  showTickLabels={true}
                />
                <Axis
                  type="y"
                  label={yAxisLabel}
                  ticks={yAxisTicks}
                  showGrid={false}
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

ColumnChart.displayName = 'ColumnChart'

// ============================================================================
// Export
// ============================================================================

export type { ColumnChartProps, ColumnDataPoint, ColumnSeries }
