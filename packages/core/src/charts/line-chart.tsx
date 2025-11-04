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
  interpolatePath,
  getSteppedPath,
  createResponsiveDimensions
} from './shared/ChartUtils'
import type { ChartData, ChartSeries, ChartBaseProps } from './shared/ChartTypes'

export interface LineChartProps extends
  Omit<ChartBaseProps, 'data'>,
  Omit<VariantProps<typeof lineChartVariants>, 'size'> {
  series: ChartSeries[]
  showGrid?: boolean
  showDots?: boolean
  showTooltip?: boolean
  showLegend?: boolean
  strokeWidth?: number
  dotSize?: number
  formatXAxis?: (value: string) => string
  formatYAxis?: (value: number) => string
  animationDuration?: number
  onPointClick?: (data: ChartData, series: ChartSeries) => void
}

const lineChartVariants = cva(
  "w-full h-full",
  {
    variants: {
      variant: {
        default: "",
        smooth: "",
        stepped: ""
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

interface Point {
  x: number
  y: number
  data: ChartData
  series: ChartSeries
}

export const LineChart = React.forwardRef<HTMLDivElement, LineChartProps>(
  ({
    series,
    variant = 'default',
    size = 'md',
    width,
    height,
    margin,
    showGrid = true,
    showDots = true,
    showTooltip = true,
    showLegend = true,
    strokeWidth = 2,
    dotSize = 4,
    formatXAxis,
    formatYAxis,
    animationDuration = 1.5,
    onPointClick,
    className,
    theme = 'light',
    ...props
  }, ref) => {
    const [hoveredPoint, setHoveredPoint] = useState<Point | null>(null)
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
    const containerRef = useRef<HTMLDivElement>(null)
    const svgRef = useRef<SVGSVGElement>(null)

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

    const maxValue = getMaxValue(series)
    const minValue = getMinValue(series)
    const valueRange = maxValue - minValue || 1

    const colors = generateColors(series.length, theme)

    // 计算数据点位置
    const allPoints: Point[] = []
    const maxDataLength = Math.max(...series.map(s => s.data.length))

    series.forEach((seriesItem, seriesIndex) => {
      const xStep = chartWidth / (maxDataLength - 1 || 1)

      seriesItem.data.forEach((dataItem, dataIndex) => {
        const x = defaultMargin.left + dataIndex * xStep
        const y = defaultMargin.top + chartHeight - ((dataItem.value - minValue) / valueRange) * chartHeight

        allPoints.push({
          x,
          y,
          data: dataItem,
          series: seriesItem
        })
      })
    })

    // 生成路径
    const paths = series.map((seriesItem, seriesIndex) => {
      const xStep = chartWidth / (maxDataLength - 1 || 1)
      const points = seriesItem.data.map((dataItem, dataIndex) => ({
        x: dataIndex * xStep,
        y: chartHeight - ((dataItem.value - minValue) / valueRange) * chartHeight
      }))

      let pathData = ''
      switch (variant) {
        case 'smooth':
          pathData = interpolatePath(points, true)
          break
        case 'stepped':
          pathData = getSteppedPath(points)
          break
        default:
          pathData = interpolatePath(points, false)
      }

      return {
        pathData,
        color: seriesItem.color || colors[seriesIndex],
        series: seriesItem
      }
    })

    // 生成网格线
    const gridLines = []
    if (showGrid) {
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
        const value = maxValue - (valueRange / 5) * i
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

      // 垂直网格线
      for (let i = 0; i < maxDataLength; i++) {
        const x = defaultMargin.left + (chartWidth / (maxDataLength - 1 || 1)) * i
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
        if (series[0]?.data[i]) {
          gridLines.push(
            <text
              key={`x-label-${i}`}
              x={x}
              y={dimensions.height - 10}
              textAnchor="middle"
              className="text-xs fill-gray-500"
            >
              {formatXAxis ? formatXAxis(series[0].data[i].name) : series[0].data[i].name}
            </text>
          )
        }
      }
    }

    return (
      <ChartContainer
        ref={ref}
        size={size}
        theme={theme}
        className={cn(lineChartVariants({ variant, size, className }))}
        {...props}
      >
        <div ref={containerRef} className="relative w-full h-full">
          <svg
            ref={svgRef}
            width={dimensions.width}
            height={dimensions.height}
            className="w-full h-full"
          >
            {/* 网格线 */}
            {gridLines}

            {/* 坐标轴 */}
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

            {/* 折线路径 */}
            <AnimatePresence>
              {paths.map((path, index) => (
                <motion.path
                  key={`path-${index}`}
                  d={path.pathData}
                  fill="none"
                  stroke={path.color}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  exit={{ pathLength: 0 }}
                  transition={{
                    duration: animationDuration,
                    delay: index * 0.2,
                    ease: "easeInOut"
                  }}
                  style={{
                    transform: `translate(${defaultMargin.left}px, ${defaultMargin.top}px)`
                  }}
                />
              ))}
            </AnimatePresence>

            {/* 数据点 */}
            {showDots && allPoints.map((point, index) => (
              <motion.circle
                key={`dot-${index}`}
                cx={point.x}
                cy={point.y}
                r={hoveredPoint === point ? dotSize + 2 : dotSize}
                fill={point.series.color || colors[series.indexOf(point.series)]}
                stroke="white"
                strokeWidth="2"
                className="cursor-pointer"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onHoverStart={() => setHoveredPoint(point)}
                onHoverEnd={() => setHoveredPoint(null)}
                onClick={() => onPointClick?.(point.data, point.series)}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.3,
                  delay: animationDuration + 0.1 + index * 0.02
                }}
              />
            ))}
          </svg>

          {/* Tooltip */}
          {showTooltip && hoveredPoint && (
            <div
              className="absolute pointer-events-none"
              style={{
                left: hoveredPoint.x,
                top: hoveredPoint.y - 60,
                transform: 'translateX(-50%)'
              }}
            >
              <ChartTooltip
                active={true}
                payload={[{
                  name: hoveredPoint.series.name,
                  value: hoveredPoint.data.value,
                  color: hoveredPoint.series.color || colors[series.indexOf(hoveredPoint.series)]
                }]}
                label={hoveredPoint.data.name}
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

LineChart.displayName = "LineChart"