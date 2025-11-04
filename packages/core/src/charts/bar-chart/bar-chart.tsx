/**
 * @fileoverview BarChart component - A comprehensive bar chart visualization
 * @version 1.0.0
 * @author Xorigo UI Team
 */

import React, {
  forwardRef,
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react'
import { motion, AnimatePresence, MotionProps } from 'framer-motion'
import { cn } from '../../utils/cva-standalone'

// ============================================================================
// Types
// ============================================================================

export interface DataPoint {
  x: number | string
  y: number
  label?: string
  metadata?: Record<string, any>
}

export interface DataSeries {
  id: string
  name: string
  data: DataPoint[]
  color?: string
  visible?: boolean
}

export interface GridConfig {
  enabled: boolean
  x?: {
    enabled: boolean
    tickCount?: number
  }
  y?: {
    enabled: boolean
    tickCount?: number
  }
  color?: string
  opacity?: number
}

export interface AxisConfig {
  x: {
    enabled: boolean
    tickCount?: number
    tickFormat?: (value: any) => string
    label?: string
    labelOffset?: number
  }
  y: {
    enabled: boolean
    tickCount?: number
    tickFormat?: (value: number) => string
    label?: string
    labelOffset?: number
  }
}

export interface LegendConfig {
  enabled: boolean
  position?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
}

export interface TooltipConfig {
  enabled: boolean
  followCursor?: boolean
  showValue?: boolean
  showSeries?: boolean
  offset?: number
}

export interface BarChartProps extends Omit<MotionProps, 'children'> {
  /**
   * Data series for the bar chart
   * @example
   * [
   *   {
   *     id: 'series-1',
   *     name: 'Revenue',
   *     data: [
   *       { x: 'Jan', y: 4000 },
   *       { x: 'Feb', y: 3000 },
   *       { x: 'Mar', y: 5000 }
   *     ],
   *     color: 'blue'
   *   }
   * ]
   */
  data: DataSeries[]

  /**
   * Bar chart direction
   * @default 'vertical'
   */
  direction?: 'vertical' | 'horizontal'

  /**
   * Bar chart variant type
   * @default 'default'
   */
  variant?: 'default' | 'grouped' | 'stacked' | 'percentage'

  /**
   * Chart dimensions
   */
  width?: number
  height?: number

  /**
   * Margin around the chart
   */
  margin?: {
    top?: number
    right?: number
    bottom?: number
    left?: number
  }

  /**
   * Grid configuration
   */
  grid?: GridConfig

  /**
   * Axis configuration
   */
  axis?: AxisConfig

  /**
   * Legend configuration
   */
  legend?: LegendConfig

  /**
   * Tooltip configuration
   */
  tooltip?: TooltipConfig

  /**
   * Animation configuration
   */
  animate?: boolean
  animationDuration?: number

  /**
   * Color palette override
   */
  colors?: string[]

  /**
   * Additional CSS class name
   */
  className?: string

  /**
   * Show value labels on bars
   * @default false
   */
  showValues?: boolean

  /**
   * Gap between bars in a group
   * @default 4
   */
  barGap?: number

  /**
   * Gap between bar categories
   * @default 20
   */
  barCategoryGap?: number

  /**
   * Children content (custom overlays)
   */
  children?: React.ReactNode

  /**
   * Event handlers
   */
  onBarClick?: (data: DataPoint & { seriesId: string }) => void
  onBarHover?: (data: DataPoint & { seriesId: string } | null) => void

  // Inherited from forwardRef
  ref?: React.Ref<HTMLDivElement>
}

// ============================================================================
// Constants & Utils
// ============================================================================

const DEFAULT_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

const ANIMATION_VARIANTS = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
}

const BAR_VARIANTS = {
  hidden: (bar: any) => ({
    scaleY: bar.direction === 'horizontal' ? 0 : 1,
    scaleX: bar.direction === 'vertical' ? 0 : 1,
    opacity: 0,
  }),
  visible: (bar: any) => ({
    scaleY: 1,
    scaleX: 1,
    opacity: 1,
    transition: {
      duration: bar.animationDuration || 0.5,
      ease: 'easeOut',
    },
  }),
}

// Scale utilities
const createLinearScale = (
  domain: [number, number],
  range: [number, number]
): ((value: number) => number) => {
  const [d0, d1] = domain
  const [r0, r1] = range
  const slope = (r1 - r0) / (d1 - d0 || 1)
  return (value: number) => r0 + (value - d0) * slope
}

// ============================================================================
// BarChart Component
// ============================================================================

const BarChart = forwardRef<HTMLDivElement, BarChartProps>(
  (
    {
      data,
      direction = 'vertical',
      variant = 'default',
      width = 800,
      height = 400,
      margin = { top: 20, right: 30, bottom: 40, left: 50 },
      grid = { enabled: true },
      axis = {
        x: { enabled: true, tickCount: 5 },
        y: { enabled: true, tickCount: 5 },
      },
      legend = { enabled: true, position: 'top', align: 'center' },
      tooltip = { enabled: true, followCursor: false },
      animate = true,
      animationDuration = 1000,
      colors = DEFAULT_COLORS,
      className,
      showValues = false,
      barGap = 4,
      barCategoryGap = 20,
      children,
      onBarClick,
      onBarHover,
      ...motionProps
    },
    ref
  ) => {
    // State
    const [hoveredBar, setHoveredBar] = useState<{
      seriesId: string
      point: DataPoint
      x: number
      y: number
    } | null>(null)

    const svgRef = useRef<SVGSVGElement>(null)

    // Memoized calculations
    const chartDimensions = useMemo(() => {
      const innerWidth = width - (margin.left || 0) - (margin.right || 0)
      const innerHeight = height - (margin.top || 0) - (margin.bottom || 0)
      return { innerWidth, innerHeight }
    }, [width, height, margin])

    const visibleSeries = useMemo(
      () => data.filter((s) => s.visible !== false),
      [data]
    )

    const xDomain = useMemo(() => {
      const xValues = Array.from(
        new Set(visibleSeries.flatMap((s) => s.data.map((d) => d.x)))
      )
      return [0, xValues.length - 1]
    }, [visibleSeries])

    const yDomain = useMemo(() => {
      const allValues = visibleSeries.flatMap((s) => s.data.map((d) => d.y))
      const maxValue = Math.max(...allValues)
      const minValue = Math.min(...allValues)
      const padding = (maxValue - minValue) * 0.1
      return [0, maxValue + padding]
    }, [visibleSeries])

    const scales = useMemo(() => {
      const xScale = createLinearScale(
        xDomain,
        [margin.left || 0, chartDimensions.innerWidth + (margin.left || 0)]
      )
      const yScale = createLinearScale(
        [yDomain[1], yDomain[0]],
        [margin.top || 0, chartDimensions.innerHeight + (margin.top || 0)]
      )
      return { xScale, yScale }
    }, [xDomain, yDomain, margin, chartDimensions])

    const processedBars = useMemo(() => {
      const bars: Array<{
        x: number
        y: number
        width: number
        height: number
        series: DataSeries
        point: DataPoint
        index: number
      }> = []

      const categoryNames = Array.from(
        new Set(visibleSeries.flatMap((s) => s.data.map((d) => d.x)))
      )
      const categoryCount = categoryNames.length
      const barWidth =
        direction === 'vertical'
          ? (chartDimensions.innerWidth - barCategoryGap * (categoryCount - 1)) /
            categoryCount
          : (chartDimensions.innerHeight - barCategoryGap * (categoryCount - 1)) /
            categoryCount

      categoryNames.forEach((category, categoryIndex) => {
        const categoryValue = visibleSeries[0]?.data.find(
          (d) => d.x === category
        )?.y

        if (variant === 'stacked') {
          // Stacked bar chart
          let stackHeight = 0
          visibleSeries.forEach((series, seriesIndex) => {
            const dataPoint = series.data.find((d) => d.x === category)
            if (dataPoint) {
              const barHeight = (dataPoint.y / yDomain[1]) * chartDimensions.innerHeight
              const barY =
                direction === 'vertical'
                  ? scales.yScale(0) - barHeight - stackHeight
                  : categoryIndex * (barHeight + barCategoryGap)

              bars.push({
                x: categoryIndex * (barWidth + barCategoryGap) + (margin.left || 0),
                y: barY,
                width: direction === 'vertical' ? barWidth : (dataPoint.y / yDomain[1]) * chartDimensions.innerWidth,
                height: barHeight,
                series,
                point: dataPoint,
                index: categoryIndex,
              })

              stackHeight += barHeight
            }
          })
        } else if (variant === 'grouped') {
          // Grouped bar chart
          const groupBarWidth =
            direction === 'vertical'
              ? (barWidth - barGap * (visibleSeries.length - 1)) /
                visibleSeries.length
              : (barWidth - barGap * (visibleSeries.length - 1)) /
                visibleSeries.length

          visibleSeries.forEach((series, seriesIndex) => {
            const dataPoint = series.data.find((d) => d.x === category)
            if (dataPoint) {
              const barHeight = (dataPoint.y / yDomain[1]) * chartDimensions.innerHeight
              const barY =
                direction === 'vertical'
                  ? scales.yScale(0) - barHeight
                  : categoryIndex * (barWidth + barCategoryGap) +
                    seriesIndex * (groupBarWidth + barGap)

              bars.push({
                x:
                  categoryIndex * (barWidth + barCategoryGap) +
                  (margin.left || 0) +
                  seriesIndex * (groupBarWidth + barGap),
                y: barY,
                width:
                  direction === 'vertical' ? groupBarWidth : (dataPoint.y / yDomain[1]) * chartDimensions.innerWidth,
                height: barHeight,
                series,
                point: dataPoint,
                index: categoryIndex,
              })
            }
          })
        } else {
          // Default single series
          const dataPoint = visibleSeries[0]?.data.find(
            (d) => d.x === category
          )
          if (dataPoint) {
            const barHeight = (dataPoint.y / yDomain[1]) * chartDimensions.innerHeight
            const barY =
              direction === 'vertical'
                ? scales.yScale(0) - barHeight
                : categoryIndex * (barWidth + barCategoryGap)

            bars.push({
              x: categoryIndex * (barWidth + barCategoryGap) + (margin.left || 0),
              y: barY,
              width:
                direction === 'vertical' ? barWidth : (dataPoint.y / yDomain[1]) * chartDimensions.innerWidth,
              height: barHeight,
              series: visibleSeries[0],
              point: dataPoint,
              index: categoryIndex,
            })
          }
        }
      })

      return bars
    }, [
      visibleSeries,
      direction,
      variant,
      chartDimensions,
      scales,
      margin,
      barGap,
      barCategoryGap,
      yDomain,
    ])

    // Event handlers
    const handleMouseEnter = useCallback(
      (bar: any, event: React.MouseEvent<SVGElement>) => {
        const rect = svgRef.current?.getBoundingClientRect()
        if (!rect) return

        setHoveredBar({
          seriesId: bar.series.id,
          point: bar.point,
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        })
        onBarHover?.({
          seriesId: bar.series.id,
          point: bar.point,
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        })
      },
      [onBarHover]
    )

    const handleMouseLeave = useCallback(() => {
      setHoveredBar(null)
      onBarHover?.(null)
    }, [onBarHover])

    const handleBarClick = useCallback(
      (bar: any) => {
        onBarClick?.({
          seriesId: bar.series.id,
          point: bar.point,
          x: 0,
          y: 0,
        })
      },
      [onBarClick]
    )

    // Grid ticks
    const xTicks = useMemo(() => {
      if (!axis.x.enabled || !axis.x.tickCount) return []
      const ticks: number[] = []
      const step = chartDimensions.innerWidth / (axis.x.tickCount - 1)
      for (let i = 0; i < axis.x.tickCount; i++) {
        ticks.push((margin.left || 0) + i * step)
      }
      return ticks
    }, [axis.x, chartDimensions, margin])

    const yTicks = useMemo(() => {
      if (!axis.y.enabled || !axis.y.tickCount) return []
      const ticks: number[] = []
      const step = chartDimensions.innerHeight / (axis.y.tickCount - 1)
      for (let i = 0; i < axis.y.tickCount; i++) {
        ticks.push((margin.top || 0) + i * step)
      }
      return ticks
    }, [axis.y, chartDimensions])

    const xValues = useMemo(() => {
      if (!axis.x.enabled || !axis.x.tickCount) return []
      const categoryNames = Array.from(
        new Set(visibleSeries.flatMap((s) => s.data.map((d) => d.x)))
      )
      return categoryNames
    }, [axis.x, visibleSeries])

    const yValues = useMemo(() => {
      if (!axis.y.enabled || !axis.y.tickCount) return []
      const values: number[] = []
      const step = (yDomain[1] - yDomain[0]) / (axis.y.tickCount - 1)
      for (let i = 0; i < axis.y.tickCount; i++) {
        values.push(yDomain[0] + i * step)
      }
      return values
    }, [axis.y, yDomain])

    return (
      <div
        ref={ref}
        className={cn(
          'bar-chart inline-block relative',
          className
        )}
        {...motionProps}
      >
        <svg
          ref={svgRef}
          width={width}
          height={height}
          role="img"
          aria-label="Bar chart visualization"
          className="overflow-visible"
        >
          <title>Bar Chart</title>
          <desc>
            Interactive bar chart displaying {visibleSeries.length} data series
            with {processedBars.length} total bars
          </desc>

          <defs>
            <clipPath id="chart-clip">
              <rect
                x={margin.left || 0}
                y={margin.top || 0}
                width={chartDimensions.innerWidth}
                height={chartDimensions.innerHeight}
              />
            </clipPath>
          </defs>

          {/* Grid */}
          {grid.enabled && (
            <g className="grid">
              {grid.x?.enabled &&
                xTicks.map((x, i) => (
                  <line
                    key={`x-grid-${i}`}
                    x1={x}
                    y1={margin.top || 0}
                    x2={x}
                    y2={chartDimensions.innerHeight + (margin.top || 0)}
                    stroke={grid.color || 'hsl(var(--muted))'}
                    strokeWidth="1"
                    opacity={grid.opacity || 0.1}
                  />
                ))}
              {grid.y?.enabled &&
                yTicks.map((y, i) => (
                  <line
                    key={`y-grid-${i}`}
                    x1={margin.left || 0}
                    y1={y}
                    x2={chartDimensions.innerWidth + (margin.left || 0)}
                    y2={y}
                    stroke={grid.color || 'hsl(var(--muted))'}
                    strokeWidth="1"
                    opacity={grid.opacity || 0.1}
                  />
                ))}
            </g>
          )}

          {/* Bars */}
          <g clipPath="url(#chart-clip)">
            <AnimatePresence>
              {processedBars.map((bar, index) => {
                const color = bar.series.color || colors[data.indexOf(bar.series) % colors.length]

                return (
                  <motion.rect
                    key={`${bar.series.id}-${index}`}
                    x={bar.x}
                    y={bar.y}
                    width={bar.width}
                    height={bar.height}
                    fill={color}
                    rx={4}
                    initial="hidden"
                    animate={animate ? 'visible' : 'visible'}
                    variants={BAR_VARIANTS}
                    custom={{
                      direction,
                      animationDuration: animationDuration / 1000,
                    }}
                    onMouseEnter={(e) => handleMouseEnter(bar, e)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleBarClick(bar)}
                    className="cursor-pointer transition-all duration-200 hover:opacity-80"
                  />

                )
              })}

              {/* Value labels */}
              {showValues &&
                processedBars.map((bar, index) => {
                  const color = bar.series.color || colors[data.indexOf(bar.series) % colors.length]

                  return (
                    <motion.text
                      key={`value-${bar.series.id}-${index}`}
                      x={
                        direction === 'vertical'
                          ? bar.x + bar.width / 2
                          : bar.x + bar.width + 5
                      }
                      y={
                        direction === 'vertical'
                          ? bar.y - 5
                          : bar.y + bar.height / 2
                      }
                      textAnchor={direction === 'vertical' ? 'middle' : 'start'}
                      dominantBaseline={
                        direction === 'vertical' ? 'auto' : 'middle'
                      }
                      className="text-xs font-medium fill-foreground pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        delay: animationDuration / 1000 + index * 0.05,
                      }}
                    >
                      {bar.point.y}
                    </motion.text>
                  )
                })}
            </AnimatePresence>
          </g>

          {/* Axes */}
          {axis.x.enabled && (
            <g className="x-axis">
              <line
                x1={margin.left || 0}
                y1={height - (margin.bottom || 0)}
                x2={width - (margin.right || 0)}
                y2={height - (margin.bottom || 0)}
                stroke="hsl(var(--foreground))"
                strokeWidth="1"
              />
              {xTicks.map((x, i) => (
                <text
                  key={`x-tick-${i}`}
                  x={x}
                  y={height - (margin.bottom || 0) + 20}
                  textAnchor="middle"
                  className="fill-sm text-foreground"
                  fontSize="12"
                >
                  {axis.x.tickFormat
                    ? axis.x.tickFormat(xValues[i % xValues.length])
                    : xValues[i % xValues.length]}
                </text>
              ))}
              {axis.x.label && (
                <text
                  x={width / 2}
                  y={height - 5}
                  textAnchor="middle"
                  className="fill-sm font-medium text-foreground"
                  fontSize="14"
                >
                  {axis.x.label}
                </text>
              )}
            </g>
          )}

          {axis.y.enabled && (
            <g className="y-axis">
              <line
                x1={margin.left || 0}
                y1={margin.top || 0}
                x2={margin.left || 0}
                y2={height - (margin.bottom || 0)}
                stroke="hsl(var(--foreground))"
                strokeWidth="1"
              />
              {yTicks.map((y, i) => (
                <text
                  key={`y-tick-${i}`}
                  x={(margin.left || 0) - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-sm text-foreground"
                  fontSize="12"
                >
                  {axis.y.tickFormat
                    ? axis.y.tickFormat(yValues[i])
                    : yValues[i].toFixed(0)}
                </text>
              ))}
              {axis.y.label && (
                <text
                  transform={`translate(15, ${height / 2}) rotate(-90)`}
                  textAnchor="middle"
                  className="fill-sm font-medium text-foreground"
                  fontSize="14"
                >
                  {axis.y.label}
                </text>
              )}
            </g>
          )}

          {/* Tooltip */}
          {tooltip.enabled && hoveredBar && (
            <foreignObject
              x={hoveredBar.x + (tooltip.offset || 10)}
              y={hoveredBar.y - 30}
              width="200"
              height="60"
              className="pointer-events-none"
            >
              <div
                className={cn(
                  'rounded-lg bg-popover p-3 shadow-lg border border-border',
                  'text-sm'
                )}
              >
                {tooltip.showSeries && (
                  <div className="font-medium mb-1">
                    {visibleSeries.find((s) => s.id === hoveredBar.seriesId)?.name}
                  </div>
                )}
                {tooltip.showValue !== false && (
                  <div className="text-muted-foreground">
                    Value: {hoveredBar.point.y}
                  </div>
                )}
                {hoveredBar.point.label && (
                  <div className="text-muted-foreground">
                    {hoveredBar.point.label}
                  </div>
                )}
              </div>
            </foreignObject>
          )}

          {/* Custom children overlay */}
          {children && <g className="overlay">{children}</g>}
        </svg>

        {/* Legend */}
        {legend.enabled && (
          <div
            className={cn(
              'flex gap-4 mt-4',
              legend.position === 'top' && 'justify-center',
              legend.position === 'left' && 'justify-start',
              legend.position === 'right' && 'justify-end',
              legend.position === 'bottom' && 'justify-center'
            )}
          >
            {visibleSeries.map((s) => (
              <div key={s.id} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: s.color || colors[data.indexOf(s) % colors.length] }}
                />
                <span className="text-sm text-foreground">{s.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
)

BarChart.displayName = 'BarChart'

// ============================================================================
// Default Props
// ============================================================================

BarChart.defaultProps = {
  width: 800,
  height: 400,
  margin: { top: 20, right: 30, bottom: 40, left: 50 },
  grid: { enabled: true },
  axis: {
    x: { enabled: true, tickCount: 5 },
    y: { enabled: true, tickCount: 5 },
  },
  legend: { enabled: true, position: 'top', align: 'center' },
  tooltip: { enabled: true, followCursor: false },
  animate: true,
  animationDuration: 1000,
  direction: 'vertical',
  variant: 'default',
  showValues: false,
  barGap: 4,
  barCategoryGap: 20,
}

// ============================================================================
// Export
// ============================================================================

export default BarChart

export type {
  BarChartProps,
  DataPoint,
  DataSeries,
  GridConfig,
  AxisConfig,
  LegendConfig,
  TooltipConfig,
}
