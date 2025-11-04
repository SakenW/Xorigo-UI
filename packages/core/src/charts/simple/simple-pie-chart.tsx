/**
 * @fileoverview SimplePieChart - Easy-to-use pie chart with configuration-style API
 * @version 1.0.0
 * @author Xorigo UI Team
 */

import React, { useMemo, FC } from 'react'
import { PieChart } from '../pie-chart'
import { cn } from '../../utils/cva-standalone'

// ============================================================================
// Preset Configurations
// ============================================================================

const PRESETS = {
  business: {
    innerRadius: 0,
    padAngle: 0.02,
    cornerRadius: 4,
    legend: { enabled: true, position: 'right' },
    tooltip: { enabled: true, showValue: true, showPercentage: true },
    animate: true,
    animationDuration: 1000
  },
  minimal: {
    innerRadius: 0,
    padAngle: 0.01,
    cornerRadius: 2,
    legend: { enabled: false },
    tooltip: { enabled: true, showValue: true },
    animate: true,
    animationDuration: 800
  },
  donut: {
    innerRadius: 60,
    padAngle: 0.02,
    cornerRadius: 8,
    legend: { enabled: true, position: 'bottom' },
    tooltip: { enabled: true, showValue: true, showPercentage: true },
    animate: true,
    animationDuration: 1200
  },
  dashboard: {
    innerRadius: 0,
    padAngle: 0.03,
    cornerRadius: 6,
    legend: { enabled: false },
    tooltip: { enabled: true, showValue: true, showPercentage: true },
    animate: true,
    animationDuration: 600
  }
}

// ============================================================================
// Types
// ============================================================================

export interface SimplePieChartProps {
  /**
   * Simplified data format
   * @example
   * [
   *   { name: 'Category A', value: 4000 },
   *   { name: 'Category B', value: 3000 },
   *   { name: 'Category C', value: 2000 }
   * ]
   */
  data: Array<{ name: string, value: number }>

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
   * Chart size in pixels
   * @default 400
   */
  size?: number

  /**
   * Whether to show as donut chart (hole in center)
   * @default false
   */
  donut?: boolean

  /**
   * Inner radius for donut chart
   * @default 60
   */
  innerRadius?: number

  /**
   * Additional CSS class name
   */
  className?: string

  /**
   * Custom colors for slices
   */
  colors?: string[]

  /**
   * Event handler for slice clicks
   */
  onSliceClick?: (data: { name: string, value: number, percentage: number }) => void
}

// ============================================================================
// Component
// ============================================================================

const SimplePieChart: FC<SimplePieChartProps> = ({
  data,
  theme = 'business',
  title,
  size = 400,
  donut = false,
  innerRadius: customInnerRadius,
  className,
  colors,
  onSliceClick
) => {
  // Get preset configuration
  const preset = PRESETS[donut ? 'donut' : theme] || PRESETS.business

  // Convert data to full format
  const config = useMemo((): Parameters<typeof PieChart>[0] => {
    // Calculate total for percentages
    const total = data.reduce((sum, item) => sum + item.value, 0)

    // Add percentage to data
    const dataWithPercentage = data.map(item => ({
      ...item,
      percentage: (item.value / total) * 100
    }))

    return {
      data: dataWithPercentage,
      size,
      innerRadius: customInnerRadius !== undefined
        ? customInnerRadius
        : preset.innerRadius,
      padAngle: preset.padAngle,
      cornerRadius: preset.cornerRadius,
      colors,
      legend: preset.legend,
      tooltip: preset.tooltip,
      animate: preset.animate,
      animationDuration: preset.animationDuration,
      onSliceClick: onSliceClick
        ? (slice) => {
            const item = dataWithPercentage[slice.index]
            onSliceClick({
              name: item.name,
              value: item.value,
              percentage: item.percentage
            })
          }
        : undefined
    }
  }, [
    data,
    theme,
    donut,
    size,
    customInnerRadius,
    colors,
    onSliceClick,
    preset
  ])

  return (
    <div className={cn('simple-pie-chart', className)}>
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-foreground">
          {title}
        </h3>
      )}
      <PieChart {...config} />
    </div>
  )
}

SimplePieChart.displayName = 'SimplePieChart'

// ============================================================================
// Export
// ============================================================================

export default SimplePieChart

export type { SimplePieChartProps }
