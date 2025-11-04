/**
 * @fileoverview SimpleBarChart - Easy-to-use bar chart with configuration-style API
 * @version 1.0.0
 * @author Xorigo UI Team
 */

import React, { useMemo, FC } from 'react'
import { BarChart } from '../bar-chart'
import { DataSeries } from '../bar-chart'
import { cn } from '../../utils/cva-standalone'

// ============================================================================
// Preset Configurations
// ============================================================================

const PRESETS = {
  business: {
    grid: {
      enabled: true,
      color: 'hsl(var(--muted))',
      opacity: 0.1,
      x: { enabled: true },
      y: { enabled: true }
    },
    axis: {
      x: { enabled: true, tickCount: 5 },
      y: { enabled: true, tickCount: 5 }
    },
    legend: { enabled: true, position: 'top', align: 'center' },
    tooltip: { enabled: true, followCursor: false, showValue: true, showSeries: true },
    animate: true,
    animationDuration: 1000
  },
  minimal: {
    grid: { enabled: false },
    axis: { x: { enabled: true }, y: { enabled: true } },
    legend: { enabled: false },
    tooltip: { enabled: true, showValue: true },
    animate: true,
    animationDuration: 800
  },
  dashboard: {
    grid: {
      enabled: true,
      color: 'hsl(var(--border))',
      opacity: 0.3
    },
    axis: {
      x: { enabled: true, tickCount: 6 },
      y: { enabled: true, tickCount: 4 }
    },
    legend: { enabled: false },
    tooltip: { enabled: true, showValue: true },
    animate: true,
    animationDuration: 600
  }
}

// ============================================================================
// Types
// ============================================================================

export interface SimpleBarChartProps {
  /**
   * Simplified data format - can be array of [label, value] or objects
   * @example
   * [['Product A', 4000], ['Product B', 3000]]
   * or
   * [{ label: 'Product A', value: 4000 }, { label: 'Product B', value: 3000 }]
   */
  data: Array<[string | number, number]> | Array<{ label: string | number, value: number }>

  /**
   * Preset theme for quick styling
   * @default 'business'
   */
  theme?: keyof typeof PRESETS

  /**
   * Chart title
   */
  title?: string

  /**
   * X-axis label
   */
  xAxis?: string

  /**
   * Y-axis label
   */
  yAxis?: string

  /**
   * Bar chart orientation
   * @default 'vertical'
   */
  orientation?: 'vertical' | 'horizontal'

  /**
   * Bar chart variant
   * @default 'default'
   */
  variant?: 'default' | 'grouped' | 'stacked' | 'percentage'

  /**
   * Whether to show values on bars
   * @default false
   */
  showValues?: boolean

  /**
   * Chart height in pixels
   * @default 400
   */
  height?: number

  /**
   * Chart width in pixels
   * @default 800
   */
  width?: number

  /**
   * Additional CSS class name
   */
  className?: string

  /**
   * Color of the bars (overrides theme colors)
   */
  color?: string

  /**
   * Event handler for bar clicks
   */
  onBarClick?: (data: { label: string | number, value: number }) => void
}

// ============================================================================
// Component
// ============================================================================

const SimpleBarChart: FC<SimpleBarChartProps> = ({
  data,
  theme = 'business',
  title,
  xAxis,
  yAxis,
  orientation = 'vertical',
  variant = 'default',
  showValues = false,
  height = 400,
  width = 800,
  className,
  color,
  onBarClick
) => {
  // Get preset configuration
  const preset = PRESETS[theme] || PRESETS.business

  // Convert data to full format
  const config = useMemo((): Parameters<typeof BarChart>[0] => {
    // Normalize data format
    const normalizedData = Array.isArray(data[0])
      ? (data as Array<[string | number, number]>)
          .map(([label, value]) => ({ label, value }))
      : (data as Array<{ label: string | number, value: number }>)

    // Create data series
    const series: DataSeries[] = [{
      id: 'series-1',
      name: title || yAxis || 'Data',
      data: normalizedData.map(({ label, value }) => ({ x: label, y: value })),
      color
    }]

    // Merge with preset
    return {
      data: series,
      width,
      height,
      direction: orientation,
      variant,
      showValues,
      grid: preset.grid,
      axis: {
        ...preset.axis,
        x: {
          ...preset.axis.x,
          label: xAxis
        },
        y: {
          ...preset.axis.y,
          label: yAxis
        }
      },
      legend: preset.legend,
      tooltip: preset.tooltip,
      animate: preset.animate,
      animationDuration: preset.animationDuration,
      onBarClick: onBarClick
        ? (data) => onBarClick({
            label: data.point.x,
            value: data.point.y
          })
        : undefined
    }
  }, [
    data,
    theme,
    title,
    xAxis,
    yAxis,
    orientation,
    variant,
    showValues,
    width,
    height,
    color,
    onBarClick,
    preset
  ])

  return (
    <div className={cn('simple-bar-chart', className)}>
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-foreground">
          {title}
        </h3>
      )}
      <BarChart {...config} />
    </div>
  )
}

SimpleBarChart.displayName = 'SimpleBarChart'

// ============================================================================
// Export
// ============================================================================

export default SimpleBarChart

export type { SimpleBarChartProps }
