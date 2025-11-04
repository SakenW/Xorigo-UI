import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from '../utils/cva-standalone'
import { cn } from '../utils/cn'
import { ChartContainer } from './shared/ChartTypes'
import { ChartTooltip } from './shared/ChartTooltip'
import { ChartLegend } from './shared/ChartLegend'
import {
  generateColors,
  getMaxValue,
  getMinValue,
  getTotalValue,
  createResponsiveDimensions
} from './shared/ChartUtils'
import type { ChartData, ChartSeries, ChartBaseProps } from './shared/ChartTypes'

export interface BarChartProps extends
  Omit<ChartBaseProps, 'data'>,
  Omit<VariantProps<typeof barChartVariants>, 'size'> {
  series: ChartSeries[]
  direction?: 'vertical' | 'horizontal'
  showGrid?: boolean
  showTooltip?: boolean
  showLegend?: boolean
  showValues?: boolean
  barGap?: number
  barCategoryGap?: number
  formatValue?: (value: number) => string
  formatXAxis?: (value: string) => string
  formatYAxis?: (value: number) => string
  animationDuration?: number
  onBarClick?: (data: ChartData, series: ChartSeries) => void
}

const barChartVariants = cva(
  "w-full h-full",
  {
    variants: {
      variant: {
        default: "",
        stacked: "",
        grouped: ""
      },
      size: {
        sm: "p-2",
        md: "p-4",
        lg: "p-6",
        xl: "p-8"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
)

interface Bar {
  x: number
  y: number
  width: number
  height: number
  data: ChartData
  series: ChartSeries
  index: number
}

export const BarChart = React.forwardRef<HTMLDivElement, BarChartProps>(
  ({
    series,
    variant = 'default',
    size = 'md',
    direction = 'vertical',
    width,
    height,
    margin,
    showGrid = true,
    showTooltip = true,
    showLegend = true,
    showValues = false,
    barGap = 4,
    barCategoryGap = 20,
    formatValue,
    formatXAxis,
    formatYAxis,
    animationDuration = 1.2,
    onBarClick,
    className,
    theme = 'light',
    ...props
  }, ref) => {
    const [hoveredBar, setHoveredBar] = useState<Bar | null>(null)
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      const updateDimensions = () => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect()
          const responsive = createResponsiveDimensions(rect.width, rect.height)
          setDimensions({
            width: width || responsive.width,
            height: height || responsive.height
          })
        }
      }

      updateDimensions()
      window.addEventListener('resize', updateDimensions)
      return () => window.removeEventListener('resize', updateDimensions)
    }, [width, height])

    if (!series?.length || dimensions.width === 0 || dimensions.height === 0) {
      return (
        <ChartContainer ref={ref} width={width} height={height} className={className} {...props}>
          <div className="flex items-center justify-center text-gray-400">
            暂无数据
          </div>
        </ChartContainer>
      )
    }

    const defaultMargin = {
      top: 20,
      right: 30,
      bottom: 40,
      left: 50,
      ...margin
    }

    const chartWidth = dimensions.width - defaultMargin.left - defaultMargin.right
    const chartHeight = dimensions.height - defaultMargin.top - defaultMargin.bottom

    const colors = generateColors(series.length, theme)
    const allBars: Bar[] = []

    // 计算柱状图布局
    const categoryNames = Array.from(new Set(series.flatMap(s => s.data.map(d => d.name))))
    const categoryCount = categoryNames.length

    if (direction === 'vertical') {
      const maxValue = getMaxValue(series)
      const barWidth = (chartWidth - barCategoryGap * (categoryCount - 1)) / categoryCount

      categoryNames.forEach((category, categoryIndex) => {
        const x = defaultMargin.left + categoryIndex * (barWidth + barCategoryGap)

        if (variant === 'stacked') {
          // 堆叠柱状图
          let stackHeight = 0
          series.forEach((seriesItem, seriesIndex) => {
            const dataItem = seriesItem.data.find(d => d.name === category)
            if (dataItem) {
              const barHeight = (dataItem.value / maxValue) * chartHeight
              const y = defaultMargin.top + chartHeight - stackHeight - barHeight

              allBars.push({
                x,
                y,
                width: barWidth,
                height: barHeight,
                data: dataItem,
                series: seriesItem,
                index: seriesIndex
              })

              stackHeight += barHeight
            }
          })
        } else if (variant === 'grouped') {
          // 分组柱状图
          const groupBarWidth = (barWidth - barGap * (series.length - 1)) / series.length

          series.forEach((seriesItem, seriesIndex) => {
            const dataItem = seriesItem.data.find(d => d.name === category)
            if (dataItem) {
              const barHeight = (dataItem.value / maxValue) * chartHeight
              const y = defaultMargin.top + chartHeight - barHeight
              const barX = x + seriesIndex * (groupBarWidth + barGap)

              allBars.push({
                x: barX,
                y,
                width: groupBarWidth,
                height: barHeight,
                data: dataItem,
                series: seriesItem,
                index: seriesIndex
              })
            }
          })
        } else {
          // 默认单系列
          if (series.length === 1) {
            const dataItem = series[0].data.find(d => d.name === category)
            if (dataItem) {
              const barHeight = (dataItem.value / maxValue) * chartHeight
              const y = defaultMargin.top + chartHeight - barHeight

              allBars.push({
                x,
                y,
                width: barWidth,
                height: barHeight,
                data: dataItem,
                series: series[0],
                index: 0
              })
            }
          }
        }
      })
    } else {
      // 水平柱状图
      const maxValue = getMaxValue(series)
      const barHeight = (chartHeight - barCategoryGap * (categoryCount - 1)) / categoryCount

      categoryNames.forEach((category, categoryIndex) => {
        const y = defaultMargin.top + categoryIndex * (barHeight + barCategoryGap)

        if (variant === 'stacked') {
          let stackWidth = 0
          series.forEach((seriesItem, seriesIndex) => {
            const dataItem = seriesItem.data.find(d => d.name === category)
            if (dataItem) {
              const barWidth = (dataItem.value / maxValue) * chartWidth
              const x = defaultMargin.left + stackWidth

              allBars.push({
                x,
                y,
                width: barWidth,
                height: barHeight,
                data: dataItem,
                series: seriesItem,
                index: seriesIndex
              })

              stackWidth += barWidth
            }
          })
        } else if (variant === 'grouped') {
          const groupBarHeight = (barHeight - barGap * (series.length - 1)) / series.length

          series.forEach((seriesItem, seriesIndex) => {
            const dataItem = seriesItem.data.find(d => d.name === category)
            if (dataItem) {
              const barWidth = (dataItem.value / maxValue) * chartWidth
              const barY = y + seriesIndex * (groupBarHeight + barGap)

              allBars.push({
                x: defaultMargin.left,
                y: barY,
                width: barWidth,
                height: groupBarHeight,
                data: dataItem,
                series: seriesItem,
                index: seriesIndex
              })
            }
          })
        } else {
          // 默认单系列
          if (series.length === 1) {
            const dataItem = series[0].data.find(d => d.name === category)
            if (dataItem) {
              const barWidth = (dataItem.value / maxValue) * chartWidth

              allBars.push({
                x: defaultMargin.left,
                y,
                width: barWidth,
                height: barHeight,
                data: dataItem,
                series: series[0],
                index: 0
              })
            }
          }
        }
      })
    }

    // 生成网格线
    const gridLines = []
    if (showGrid) {
      if (direction === 'vertical') {
        // 水平网格线
        for (let i = 0; i <= 5; i++) {
          const y = defaultMargin.top + (chartHeight / 5) * i
          gridLines.push(
            <line
              key={`h-grid-${i}`}
              x1={defaultMargin.left}
              y1={y}
              x2={defaultMargin.left + chartWidth}
              y2={y}
              stroke="currentColor"
              strokeWidth="1"
              strokeOpacity="0.1"
              className="text-gray-400"
            />
          )

          // Y轴标签
          const maxValue = getMaxValue(series)
          const value = maxValue - (maxValue / 5) * i
          gridLines.push(
            <text
              key={`y-label-${i}`}
              x={defaultMargin.left - 10}
              y={y + 5}
              textAnchor="end"
              className="text-xs fill-gray-500"
            >
              {formatYAxis ? formatYAxis(value) : value.toFixed(0)}
            </text>
          )
        }

        // X轴标签
        categoryNames.forEach((category, index) => {
          const x = defaultMargin.left + index * ((chartWidth + barCategoryGap) / categoryCount) + ((chartWidth - barCategoryGap) / categoryCount) / 2
          gridLines.push(
            <text
              key={`x-label-${index}`}
              x={x}
              y={dimensions.height - 10}
              textAnchor="middle"
              className="text-xs fill-gray-500"
            >
              {formatXAxis ? formatXAxis(category) : category}
            </text>
          )
        })
      } else {
        // 垂直网格线
        for (let i = 0; i <= 5; i++) {
          const x = defaultMargin.left + (chartWidth / 5) * i
          gridLines.push(
            <line
              key={`v-grid-${i}`}
              x1={x}
              y1={defaultMargin.top}
              x2={x}
              y2={defaultMargin.top + chartHeight}
              stroke="currentColor"
              strokeWidth="1"
              strokeOpacity="0.1"
              className="text-gray-400"
            />
          )

          // X轴标签
          const maxValue = getMaxValue(series)
          const value = (maxValue / 5) * i
          gridLines.push(
            <text
              key={`x-label-${i}`}
              x={x}
              y={dimensions.height - 10}
              textAnchor="middle"
              className="text-xs fill-gray-500"
            >
              {formatYAxis ? formatYAxis(value) : value.toFixed(0)}
            </text>
          )
        }

        // Y轴标签
        categoryNames.forEach((category, index) => {
          const y = defaultMargin.top + index * ((chartHeight + barCategoryGap) / categoryCount) + ((chartHeight - barCategoryGap) / categoryCount) / 2
          gridLines.push(
            <text
              key={`y-label-${index}`}
              x={defaultMargin.left - 10}
              y={y + 5}
              textAnchor="end"
              className="text-xs fill-gray-500"
            >
              {formatXAxis ? formatXAxis(category) : category}
            </text>
          )
        })
      }
    }

    return (
      <ChartContainer
        ref={ref}
        size={size}
        theme={theme}
        className={cn(barChartVariants({ variant, size, className }))}
        {...props}
      >
        <div ref={containerRef} className="relative w-full h-full">
          <svg
            width={dimensions.width}
            height={dimensions.height}
            className="w-full h-full"
          >
            {/* 网格线 */}
            {gridLines}

            {/* 坐标轴 */}
            {direction === 'vertical' ? (
              <>
                <line
                  x1={defaultMargin.left}
                  y1={defaultMargin.top}
                  x2={defaultMargin.left}
                  y2={defaultMargin.top + chartHeight}
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-gray-300"
                />
                <line
                  x1={defaultMargin.left}
                  y1={dimensions.height - defaultMargin.bottom}
                  x2={defaultMargin.left + chartWidth}
                  y2={dimensions.height - defaultMargin.bottom}
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-gray-300"
                />
              </>
            ) : (
              <>
                <line
                  x1={defaultMargin.left}
                  y1={defaultMargin.top}
                  x2={defaultMargin.left + chartWidth}
                  y2={defaultMargin.top}
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-gray-300"
                />
                <line
                  x1={defaultMargin.left}
                  y1={defaultMargin.top}
                  x2={defaultMargin.left}
                  y2={defaultMargin.top + chartHeight}
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-gray-300"
                />
              </>
            )}

            {/* 柱状图 */}
            <AnimatePresence>
              {allBars.map((bar, index) => (
                <motion.rect
                  key={`bar-${index}`}
                  x={bar.x}
                  y={bar.y}
                  width={bar.width}
                  height={bar.height}
                  fill={bar.series.color || colors[series.indexOf(bar.series)]}
                  className="cursor-pointer"
                  whileHover={{ opacity: 0.8 }}
                  whileTap={{ scale: 0.98 }}
                  onHoverStart={() => setHoveredBar(bar)}
                  onHoverEnd={() => setHoveredBar(null)}
                  onClick={() => onBarClick?.(bar.data, bar.series)}
                  initial={
                    direction === 'vertical'
                      ? { height: 0, y: defaultMargin.top + chartHeight }
                      : { width: 0, x: defaultMargin.left }
                  }
                  animate={{ height: bar.height, y: bar.y, width: bar.width, x: bar.x }}
                  exit={{
                    height: 0,
                    y: direction === 'vertical' ? defaultMargin.top + chartHeight : bar.y,
                    width: 0,
                    x: direction === 'horizontal' ? defaultMargin.left : bar.x
                  }}
                  transition={{
                    duration: animationDuration,
                    delay: index * 0.05,
                    ease: "easeOut"
                  }}
                />
              ))}
            </AnimatePresence>

            {/* 数值标签 */}
            {showValues && allBars.map((bar, index) => (
              <motion.text
                key={`value-${index}`}
                x={direction === 'vertical' ? bar.x + bar.width / 2 : bar.x + bar.width + 5}
                y={direction === 'vertical' ? bar.y - 5 : bar.y + bar.height / 2 + 5}
                textAnchor={direction === 'vertical' ? 'middle' : 'start'}
                dominantBaseline={direction === 'vertical' ? 'auto' : 'middle'}
                className="text-xs font-medium fill-gray-700 dark:fill-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.3,
                  delay: animationDuration + index * 0.05
                }}
              >
                {formatValue ? formatValue(bar.data.value) : bar.data.value.toString()}
              </motion.text>
            ))}
          </svg>

          {/* Tooltip */}
          {showTooltip && hoveredBar && (
            <div
              className="absolute pointer-events-none z-50"
              style={{
                left: hoveredBar.x + hoveredBar.width / 2,
                top: hoveredBar.y - 10,
                transform: 'translate(-50%, -100%)'
              }}
            >
              <ChartTooltip
                active={true}
                payload={[{
                  name: hoveredBar.series.name,
                  value: hoveredBar.data.value,
                  color: hoveredBar.series.color || colors[series.indexOf(hoveredBar.series)]
                }]}
                label={hoveredBar.data.name}
              />
            </div>
          )}

          {/* Legend */}
          {showLegend && (
            <div className="absolute top-4 right-4">
              <ChartLegend
                payload={series.map((s, i) => ({
                  value: s.name,
                  color: s.color || colors[i]
                }))}
              />
            </div>
          )}
        </div>
      </ChartContainer>
    )
  }
)

BarChart.displayName = "BarChart"