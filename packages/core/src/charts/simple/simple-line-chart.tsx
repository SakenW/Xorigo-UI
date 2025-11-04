/**
 * @fileoverview SimpleLineChart - Easy-to-use line chart with configuration-style API
 * @version 1.0.0
 * @author Xorigo UI Team
 */

import React, { useMemo, FC } from 'react'
import { LineChart } from '../line-chart'
import { DataSeries } from '../line-chart'
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
      x: { enabled: false },
      y: { enabled: true, tickCount: 4 }
    },
    legend: { enabled: false },
    tooltip: { enabled: true, showValue: true },
    animate: true,
    animationDuration: 600
  },
  presentation: {
    grid: { enabled: true, opacity: 0.2 },
    axis: { x: { enabled: true, tickCount: 8 }, y: { enabled: true, tickCount: 6 } },
    legend: { enabled: true, position: 'bottom', align: 'center' },
    tooltip: { enabled: true, showValue: true, showSeries: true },
    animate: true,
    animationDuration: 1500
  }
}

// ============================================================================
// Types
// ============================================================================

export interface SimpleLineChartProps {
  /**
   * Simplified data format - can be array of [x, y] or objects
   * @example
   * [['Jan', 4000], ['Feb', 3000]]
   * or
   * [{ x: 'Jan', y: 4000 }, { x: 'Feb', y: 3000 }]
   */
  data: Array<[string | number, number]> | Array<{ x: string | number, y: number }>

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
   * Whether to show smooth curves
   * @default false
   */
  smooth?: boolean

  /**
   * Whether to show area fill under the line
   * @default false
   */
  showArea?: boolean

  /**
   * Whether to show data points
   * @default true
   */
  showPoints?: boolean

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
   * Color of the line (overrides theme colors)
   */
  color?: string

  /**
   * Event handler for data point clicks
   */
  onPointClick?: (data: { x: string | number, y: number }) => void
}

// ============================================================================
// Component
// ============================================================================

const SimpleLineChart: FC<SimpleLineChartProps> = ({
  data,
  theme = 'business',
  title,
  xAxis,
  yAxis,
  smooth = false,
  showArea = false,
  showPoints = true,
  height = 400,
  width = 800,
  className,
  color,
  onPointClick
}) => {
  // Get preset configuration
  const preset = PRESETS[theme] || PRESETS.business

  // Convert data to full format
  const config = useMemo((): Parameters<typeof LineChart>[0] => {
    // Normalize data format
    const normalizedData = Array.isArray(data[0])
      ? (data as Array<[string | number, number]>)
          .map(([x, y]) => ({ x, y }))
      : (data as Array<{ x: string | number, y: number }>)

    // Create data series
    const series: DataSeries[] = [{
      id: 'series-1',
      name: title || yAxis || 'Data',
      data: normalizedData,
      smooth,
      area: showArea ? { enabled: true, fillOpacity: 0.3 } : undefined,
      points: showPoints
        ? { enabled: true, radius: 4, hoverRadius: 6 }
        : { enabled: false },
      color
    }]

    // Merge with preset
    return {
      series,
      width,
      height,
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
      onDataPointClick: onPointClick
        ? (data) => onPointClick({ x: data.point.x, y: data.point.y })
        : undefined
    }
  }, [
    data,
    theme,
    title,
    xAxis,
    yAxis,
    smooth,
    showArea,
    showPoints,
    width,
    height,
    color,
    onPointClick,
    preset
  ])

  return (
    <div className={cn('simple-line-chart', className)}>
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-foreground">
          {title}
        </h3>
      )}
      <LineChart {...config} />
    </div>
  )
}

SimpleLineChart.displayName = 'SimpleLineChart'

// ============================================================================
// Export
// ============================================================================

export default SimpleLineChart
export { SimpleLineChart }

export type { SimpleLineChartProps }
