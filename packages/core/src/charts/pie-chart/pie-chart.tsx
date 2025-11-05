/**
 * @fileoverview PieChart component - A flexible, animated pie chart visualization
 * @version 1.0.0
 * @author Xorigo UI Team
 */

import React, { forwardRef, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../utils/cn'
import {
  SimpleTheme,
  transformSimplePieData,
  SIMPLE_PRESETS,
} from '../simple-mode/utils'

// ============================================================================
// Types
// ============================================================================

export interface PieChartDataItem {
  name: string
  value: number
  color?: string
  highlighted?: boolean
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
  showPercentage?: boolean
  offset?: number
}

export interface PieChartProps {
  /**
   * === Simple Mode ===
   * Simplified data format (mutually exclusive with data)
   * Format: [{ name, value }, { name, value }]
   * @example
   * [
   *   { name: 'Desktop', value: 4000 },
   *   { name: 'Mobile', value: 3000 },
   *   { name: 'Tablet', value: 2000 }
   * ]
   */
  simpleData?: Array<{ name: string, value: number }>

  /**
   * Simple mode: Chart title
   */
  title?: string

  /**
   * Simple mode: Preset theme
   * @default 'business'
   */
  theme?: SimpleTheme

  /**
   * Simple mode: Show as donut chart
   * @default false
   */
  donut?: boolean

  /**
   * Simple mode: Inner radius for donut chart
   * @default 60
   */
  innerRadius?: number

  /**
   * === Advanced Mode ===
   * Data source (mutually exclusive with simpleData)
   */
  data?: PieChartDataItem[]

  /**
   * Chart size in pixels
   * @default 400
   */
  size?: number

  /**
   * Pie chart variant type
   * @default 'standard'
   */
  variant?: 'standard' | 'donut' | 'exploded'

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
   * Children content (custom overlays)
   */
  children?: React.ReactNode

  /**
   * Event handlers
   */
  onSliceClick?: (data: { name: string, value: number, percentage: number, index: number }) => void

  // Inherited from forwardRef
  ref?: React.Ref<SVGSVGElement>
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

// Calculate arc path
const calculateArcPath = (
  cx: number,
  cy: number,
  radius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number
) => {
  const start = (startAngle - 90) * (Math.PI / 180)
  const end = (endAngle - 90) * (Math.PI / 180)

  const x1 = cx + radius * Math.cos(start)
  const y1 = cy + radius * Math.sin(start)
  const x2 = cx + radius * Math.cos(end)
  const y2 = cy + radius * Math.sin(end)

  const isDonut = innerRadius > 0

  if (isDonut) {
    const x3 = cx + innerRadius * Math.cos(end)
    const y3 = cy + innerRadius * Math.sin(end)
    const x4 = cx + innerRadius * Math.cos(start)
    const y4 = cy + innerRadius * Math.sin(start)

    const largeArc = endAngle - startAngle > 180 ? 1 : 0

    return [
      'M', x1, y1,
      'A', radius, radius, 0, largeArc, 1, x2, y2,
      'L', x3, y3,
      'A', innerRadius, innerRadius, 0, largeArc, 0, x4, y4,
      'Z'
    ].join(' ')
  }

  const largeArc = endAngle - startAngle > 180 ? 1 : 0

  return [
    'M', cx, cy,
    'L', x1, y1,
    'A', radius, radius, 0, largeArc, 1, x2, y2,
    'Z'
  ].join(' ')
}

// ============================================================================
// PieChart Component
// ============================================================================

const PieChart = forwardRef<SVGSVGElement, PieChartProps>(
  (
    {
      simpleData,
      title,
      theme = 'business',
      donut = false,
      innerRadius: customInnerRadius,
      data,
      size = 400,
      variant = 'standard',
      legend = { enabled: true, position: 'right', align: 'center' },
      tooltip = { enabled: true, showValue: true, showPercentage: true },
      animate = true,
      animationDuration = 1000,
      colors = DEFAULT_COLORS,
      className,
      children,
      onSliceClick,
    },
    ref
  ) => {
    // Auto-detect mode
    const mode = useMemo(() => {
      if (simpleData && !data) {
        return 'simple'
      }
      if (data && !simpleData) {
        return 'advanced'
      }
      throw new Error('PieChart: Must provide either "simpleData" (simple mode) or "data" (advanced mode), but not both')
    }, [simpleData, data])

    // Get preset configuration for simple mode
    const preset = useMemo(() => {
      if (mode === 'simple') {
        return SIMPLE_PRESETS[theme]
      }
      return null
    }, [mode, theme])

    // Transform simple mode props to advanced mode format
    const advancedModeProps = useMemo(() => {
      if (mode !== 'simple') return null

      // Transform data to PieChartDataItem format
      const transformedData = transformSimplePieData(simpleData!).map((item, index) => ({
        name: item.name,
        value: item.value,
        highlighted: false
      }))

      // Determine inner radius based on donut mode
      const finalInnerRadius = donut
        ? (customInnerRadius !== undefined ? customInnerRadius : 60)
        : 0

      return {
        data: transformedData,
        size,
        variant: donut ? 'donut' : 'standard',
        legend: legend || preset?.legend,
        tooltip: tooltip || preset?.tooltip,
        animate: animate !== undefined ? animate : preset?.animate,
        animationDuration: animationDuration || preset?.animationDuration || 1000,
        colors,
        className,
        children,
        onSliceClick
      }
    }, [
      mode,
      simpleData,
      theme,
      donut,
      customInnerRadius,
      size,
      legend,
      tooltip,
      animate,
      animationDuration,
      colors,
      className,
      children,
      onSliceClick,
      preset
    ])

    // Render in simple mode
    if (mode === 'simple') {
      return (
        <div className={cn('pie-chart', className)}>
          {title && (
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              {title}
            </h3>
          )}
          <AdvancedPieChart ref={ref} {...advancedModeProps!} />
        </div>
      )
    }

    // Render in advanced mode
    return (
      <AdvancedPieChart
        ref={ref}
        data={data!}
        size={size}
        variant={variant}
        legend={legend}
        tooltip={tooltip}
        animate={animate}
        animationDuration={animationDuration}
        colors={colors}
        className={className}
        children={children}
        onSliceClick={onSliceClick}
      />
    )
  }
)

// Advanced PieChart component (core implementation)
const AdvancedPieChart = forwardRef<SVGSVGElement, Omit<PieChartProps, 'simpleData' | 'title' | 'theme' | 'donut'>>(
  (
    {
      data,
      size = 400,
      variant = 'standard',
      legend = { enabled: true, position: 'right', align: 'center' },
      tooltip = { enabled: true, showValue: true, showPercentage: true },
      animate = true,
      animationDuration = 1000,
      colors = DEFAULT_COLORS,
      className,
      children,
      onSliceClick,
    },
    ref
  ) => {
    const radius = size / 2
    const innerRadius = variant === 'donut' ? radius * 0.6 : 0

    // Calculate total and percentages
    const total = useMemo(() => {
      return data.reduce((sum, item) => sum + item.value, 0)
    }, [data])

    // Calculate angles
    const processedData = useMemo(() => {
      let currentAngle = 0
      return data.map((item, index) => {
        const angle = (item.value / total) * 360
        const startAngle = currentAngle
        const endAngle = currentAngle + angle
        currentAngle += angle

        const percentage = (item.value / total) * 100

        return {
          ...item,
          percentage,
          startAngle,
          endAngle,
          color: item.color || colors[index % colors.length]
        }
      })
    }, [data, total, colors])

    const handleSliceClick = (item: any, index: number) => {
      onSliceClick?.({
        name: item.name,
        value: item.value,
        percentage: item.percentage,
        index
      })
    }

    return (
      <div className={cn('relative inline-block', className)}>
        <svg
          ref={ref}
          width={size}
          height={size}
          className="overflow-visible"
          role="img"
          aria-label="Pie chart visualization"
        >
          <title>Pie Chart</title>
          <desc>
            Pie chart displaying {data.length} categories with total value of {total}
          </desc>

          <g transform={`translate(${size / 2}, ${size / 2})`}>
            <AnimatePresence>
              {processedData.map((item, index) => {
                const path = calculateArcPath(
                  0,
                  0,
                  radius,
                  innerRadius,
                  item.startAngle,
                  item.endAngle
                )

                return (
                  <motion.path
                    key={`slice-${index}`}
                    d={path}
                    fill={item.color}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={animate ? { opacity: 1, scale: 1 } : {}}
                    transition={{
                      duration: (animationDuration / 1000),
                      delay: index * 0.1
                    }}
                    className="cursor-pointer transition-all duration-200 hover:opacity-80"
                    onClick={() => handleSliceClick(item, index)}
                  />
                )
              })}
            </AnimatePresence>
          </g>

          {/* Tooltip */}
          {tooltip.enabled && (
            <foreignObject
              x={0}
              y={0}
              width={size}
              height={size}
              className="pointer-events-none"
            >
              {/* Tooltip implementation would go here */}
            </foreignObject>
          )}

          {/* Custom children overlay */}
          {children && (
            <g className="overlay">{children}</g>
          )}
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
            {processedData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-foreground">
                  {item.name} ({item.percentage.toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
)

PieChart.displayName = 'PieChart'
AdvancedPieChart.displayName = 'AdvancedPieChart'

// ============================================================================
// Default Props
// ============================================================================

PieChart.defaultProps = {
  size: 400,
  theme: 'business',
  donut: false,
  variant: 'standard',
  animate: true
}

AdvancedPieChart.defaultProps = {
  size: 400,
  variant: 'standard',
  legend: { enabled: true, position: 'right', align: 'center' },
  tooltip: { enabled: true, showValue: true, showPercentage: true },
  animate: true,
  animationDuration: 1000
}

// ============================================================================
// Export
// ============================================================================

export default PieChart
export { PieChart, AdvancedPieChart }

export type {
  PieChartProps,
  PieChartDataItem,
  LegendConfig,
  TooltipConfig,
  SimpleTheme
}
