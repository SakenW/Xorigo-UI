import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'
import { ChartContainer } from './shared/ChartTypes'
import { ChartTooltip } from './shared/ChartTooltip'
import { ChartLegend } from './shared/ChartLegend'
import {
  generateColors,
  getTotalValue,
  calculatePercentage,
  createResponsiveDimensions
} from './shared/ChartUtils'
import type { ChartData, ChartBaseProps } from './shared/ChartTypes'

export interface PieChartProps extends
  Omit<ChartBaseProps, 'data'>,
  Omit<VariantProps<typeof pieChartVariants>, 'size'> {
  data: ChartData[]
  innerRadius?: number
  outerRadius?: number
  startAngle?: number
  endAngle?: number
  showTooltip?: boolean
  showLegend?: boolean
  showLabels?: boolean
  showPercentage?: boolean
  labelPosition?: 'inside' | 'outside'
  formatValue?: (value: number) => string
  formatPercentage?: (value: number) => string
  animationDuration?: number
  onSliceClick?: (data: ChartData) => void
  legendPosition?: 'right' | 'bottom' | 'left' | 'top'
}

const pieChartVariants = cva(
  "w-full h-full",
  {
    variants: {
      variant: {
        default: "",
        donut: "",
        "semi-circle": ""
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

interface Slice {
  startAngle: number
  endAngle: number
  innerRadius: number
  outerRadius: number
  data: ChartData
  color: string
  index: number
  path: string
  center: { x: number; y: number }
  label: { x: number; y: number }
}

export const PieChart = React.forwardRef<HTMLDivElement, PieChartProps>(
  ({
    data,
    variant = 'default',
    size = 'md',
    width,
    height,
    innerRadius: propInnerRadius,
    outerRadius: propOuterRadius,
    startAngle = 0,
    endAngle = 360,
    showTooltip = true,
    showLegend = true,
    showLabels = true,
    showPercentage = true,
    labelPosition = 'outside',
    formatValue,
    formatPercentage,
    animationDuration = 1.2,
    onSliceClick,
    legendPosition = 'right',
    className,
    theme = 'light',
    ...props
  }, ref) => {
    const [hoveredSlice, setHoveredSlice] = useState<Slice | null>(null)
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      const updateDimensions = () => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect()
          const responsive = createResponsiveDimensions(rect.width, rect.height, variant === 'semi-circle' ? 2 : 1)
          setDimensions({
            width: width || responsive.width,
            height: height || responsive.height
          })
        }
      }

      updateDimensions()
      window.addEventListener('resize', updateDimensions)
      return () => window.removeEventListener('resize', updateDimensions)
    }, [width, height, variant])

    if (!data?.length || dimensions.width === 0 || dimensions.height === 0) {
      return (
        <ChartContainer ref={ref} width={width} height={height} className={className} {...props}>
          <div className="flex items-center justify-center text-gray-400">
            暂无数据
          </div>
        </ChartContainer>
      )
    }

    const colors = generateColors(data.length, theme)
    const total = getTotalValue(data)

    // 计算半径
    const centerX = dimensions.width / 2
    const centerY = variant === 'semi-circle' ? dimensions.height * 0.75 : dimensions.height / 2
    const maxRadius = Math.min(dimensions.width, dimensions.height * (variant === 'semi-circle' ? 2 : 1)) / 2

    const outerRadius = propOuterRadius || maxRadius * 0.8
    const innerRadius = propInnerRadius || (variant === 'donut' ? outerRadius * 0.5 : 0)

    // 生成扇形路径
    const createPath = (startAngle: number, endAngle: number, innerRadius: number, outerRadius: number): string => {
      const startAngleRad = (startAngle * Math.PI) / 180
      const endAngleRad = (endAngle * Math.PI) / 180

      const x1 = centerX + outerRadius * Math.cos(startAngleRad)
      const y1 = centerY + outerRadius * Math.sin(startAngleRad)
      const x2 = centerX + outerRadius * Math.cos(endAngleRad)
      const y2 = centerY + outerRadius * Math.sin(endAngleRad)

      const x3 = centerX + innerRadius * Math.cos(endAngleRad)
      const y3 = centerY + innerRadius * Math.sin(endAngleRad)
      const x4 = centerX + innerRadius * Math.cos(startAngleRad)
      const y4 = centerY + innerRadius * Math.sin(startAngleRad)

      const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0

      if (innerRadius === 0) {
        return `M ${centerX} ${centerY} L ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
      }

      return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`
    }

    // 计算标签位置
    const getLabelPosition = (startAngle: number, endAngle: number, radius: number) => {
      const middleAngle = ((startAngle + endAngle) / 2) * Math.PI / 180
      const labelRadius = labelPosition === 'inside' ? (innerRadius + outerRadius) / 2 : outerRadius + 20

      return {
        x: centerX + labelRadius * Math.cos(middleAngle),
        y: centerY + labelRadius * Math.sin(middleAngle)
      }
    }

    // 生成扇形数据
    const slices: Slice[] = []
    let currentAngle = startAngle

    data.forEach((item, index) => {
      const percentage = calculatePercentage(item.value, total)
      const sliceAngle = (endAngle - startAngle) * percentage

      const sliceStartAngle = currentAngle
      const sliceEndAngle = currentAngle + sliceAngle

      const path = createPath(sliceStartAngle, sliceEndAngle, innerRadius, outerRadius)
      const center = getLabelPosition(sliceStartAngle, sliceEndAngle, (innerRadius + outerRadius) / 2)
      const label = getLabelPosition(sliceStartAngle, sliceEndAngle, outerRadius)

      slices.push({
        startAngle: sliceStartAngle,
        endAngle: sliceEndAngle,
        innerRadius,
        outerRadius,
        data: item,
        color: item.color || colors[index] || '#3b82f6',
        index,
        path,
        center,
        label
      })

      currentAngle = sliceEndAngle
    })

    return (
      <ChartContainer
        ref={ref}
        size={size}
        theme={theme}
        className={cn(pieChartVariants({ variant, size, className }))}
        {...props}
      >
        <div ref={containerRef} className="relative w-full h-full">
          <svg
            width={dimensions.width}
            height={dimensions.height}
            className="w-full h-full"
          >
            {/* 扇形 */}
            <AnimatePresence>
              {slices.map((slice, index) => {
                const isHovered = hoveredSlice === slice
                const scale = isHovered ? 1.05 : 1

                return (
                  <motion.g
                    key={`slice-${index}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{
                      duration: animationDuration,
                      delay: index * 0.1,
                      ease: "easeOut"
                    }}
                    style={{ transformOrigin: `${centerX}px ${centerY}px` }}
                  >
                    <motion.path
                      d={slice.path}
                      fill={slice.color}
                      stroke="white"
                      strokeWidth="2"
                      className="cursor-pointer"
                      whileHover={{ scale }}
                      whileTap={{ scale: 0.95 }}
                      onHoverStart={() => setHoveredSlice(slice)}
                      onHoverEnd={() => setHoveredSlice(null)}
                      onClick={() => onSliceClick?.(slice.data)}
                    />

                    {/* 标签 */}
                    {showLabels && (
                      <motion.text
                        x={slice.label.x}
                        y={slice.label.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-xs font-medium fill-gray-700 dark:fill-gray-300 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: animationDuration + index * 0.1 + 0.3
                        }}
                      >
                        {showPercentage && (
                          <>
                            {formatPercentage ? formatPercentage(calculatePercentage(slice.data.value, total)) : `${(calculatePercentage(slice.data.value, total) * 100).toFixed(1)}%`}
                            {labelPosition === 'outside' && slice.data.name && <tspan x={slice.label.x} dy="1.2em">{slice.data.name}</tspan>}
                          </>
                        )}
                        {!showPercentage && slice.data.name && slice.data.name}
                      </motion.text>
                    )}
                  </motion.g>
                )
              })}
            </AnimatePresence>

            {/* 中心标签（甜甜圈图表） */}
            {variant === 'donut' && (
              <motion.text
                x={centerX}
                y={centerY}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-lg font-bold fill-gray-900 dark:fill-gray-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: animationDuration }}
              >
                {formatValue ? formatValue(total) : total.toString()}
              </motion.text>
            )}
          </svg>

          {/* Tooltip */}
          {showTooltip && hoveredSlice && (
            <div
              className="absolute pointer-events-none z-50"
              style={{
                left: hoveredSlice.label.x,
                top: hoveredSlice.label.y,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <ChartTooltip
                active={true}
                payload={[{
                  name: hoveredSlice.data.name,
                  value: hoveredSlice.data.value,
                  color: hoveredSlice.color
                }]}
                label={hoveredSlice.data.name}
              />
            </div>
          )}

          {/* Legend */}
          {showLegend && (
            <div
              className={cn(
                "absolute",
                legendPosition === 'right' && "top-4 right-4",
                legendPosition === 'bottom' && "bottom-4 left-1/2 transform -translate-x-1/2",
                legendPosition === 'left' && "top-4 left-4",
                legendPosition === 'top' && "top-4 left-1/2 transform -translate-x-1/2"
              )}
            >
              <ChartLegend
                payload={data.map((item, index) => ({
                  value: item.name,
                  color: item.color || colors[index]
                }))}
                layout={legendPosition === 'top' || legendPosition === 'bottom' ? 'horizontal' : 'vertical'}
                align={legendPosition === 'top' || legendPosition === 'bottom' ? 'center' : 'left'}
              />
            </div>
          )}
        </div>
      </ChartContainer>
    )
  }
)

PieChart.displayName = "PieChart"