/**
 * @fileoverview Simple Mode Utilities - Utilities for converting simple mode props to advanced mode
 * @version 1.0.0
 * @author Xorigo UI Team
 */

// ============================================================================
// Types
// ============================================================================

export type SimpleTheme = 'business' | 'minimal' | 'dashboard' | 'presentation'

export interface SimpleDataPoint {
  x: string | number
  y: number
}

export interface SimpleDataSeries {
  label: string
  value: number
}

// ============================================================================
// Preset Configurations
// ============================================================================

export const SIMPLE_PRESETS: Record<SimpleTheme, any> = {
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
    tooltip: {
      enabled: true,
      followCursor: false,
      showValue: true,
      showSeries: true
    },
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
      opacity: 0.3,
      x: { enabled: true },
      y: { enabled: true }
    },
    axis: {
      x: { enabled: true, tickCount: 6 },
      y: { enabled: true, tickCount: 4 }
    },
    legend: { enabled: false },
    tooltip: { enabled: true, showValue: true },
    animate: true,
    animationDuration: 600
  },

  presentation: {
    grid: { enabled: true, opacity: 0.2 },
    axis: {
      x: { enabled: true, tickCount: 8 },
      y: { enabled: true, tickCount: 6 }
    },
    legend: { enabled: true, position: 'bottom', align: 'center' },
    tooltip: {
      enabled: true,
      showValue: true,
      showSeries: true
    },
    animate: true,
    animationDuration: 1500
  }
}

// ============================================================================
// Data Transformation Utilities
// ============================================================================

/**
 * Transform simple data format to advanced DataSeries format
 * @param data - Simple data format: [[x, y], [x, y]] or [{ x, y }, { x, y }]
 * @param name - Series name
 * @param color - Optional color
 * @returns DataSeries array
 */
export function transformSimpleLineData(
  data: Array<[string | number, number]> | Array<SimpleDataPoint>,
  name: string,
  color?: string
): Array<{
  id: string
  name: string
  data: SimpleDataPoint[]
  color?: string
  smooth?: boolean
  area?: { enabled: boolean; fillOpacity?: number }
  points?: { enabled: boolean; radius?: number; hoverRadius?: number }
}> {
  const normalizedData = Array.isArray(data[0])
    ? (data as Array<[string | number, number]>).map(([x, y]) => ({ x, y }))
    : (data as Array<SimpleDataPoint>)

  return [{
    id: 'series-1',
    name,
    data: normalizedData,
    color
  }]
}

/**
 * Transform simple data format to advanced BarChart data format
 * @param data - Simple data format: [[label, value], [label, value]] or [{ label, value }, { label, value }]
 * @param name - Series name
 * @param color - Optional color
 * @returns DataSeries array
 */
export function transformSimpleBarData(
  data: Array<[string | number, number]> | Array<SimpleDataSeries>,
  name: string,
  color?: string
): Array<{
  id: string
  name: string
  data: Array<{ x: string | number; y: number }>
  color?: string
}> {
  const normalizedData = Array.isArray(data[0])
    ? (data as Array<[string | number, number]>)
        .map(([label, value]) => ({ label, value }))
    : (data as Array<SimpleDataSeries>)

  return [{
    id: 'series-1',
    name,
    data: normalizedData.map(({ label, value }) => ({ x: label, y: value })),
    color
  }]
}

/**
 * Validate simple mode props for BarChart
 * @param props - Component props
 */
export function validateBarChartSimpleModeProps(props: any): void {
  if (!props.simpleData) {
    throw new Error('BarChart simple mode requires "simpleData" property')
  }
  if (props.data) {
    throw new Error('BarChart simple mode cannot use "data" property. Use "simpleData" for simple mode.')
  }
}

/**
 * Validate advanced mode props for BarChart
 * @param props - Component props
 */
export function validateBarChartAdvancedModeProps(props: any): void {
  if (!props.data) {
    throw new Error('BarChart advanced mode requires "data" property')
  }
  if (props.simpleData) {
    throw new Error('BarChart advanced mode cannot use "simpleData" property. Use "data" for advanced mode.')
  }
}

/**
 * Transform simple data format to advanced PieChart data format
 * @param data - Simple data format: [{ name, value }, { name, value }]
 * @returns Data with percentage
 */
export function transformSimplePieData(
  data: Array<{ name: string; value: number }>
): Array<{ name: string; value: number; percentage: number }> {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return data.map(item => ({
    ...item,
    percentage: (item.value / total) * 100
  }))
}

// ============================================================================
// Mode Detection Utilities
// ============================================================================

/**
 * Detect if props are in simple mode
 * @param props - Component props
 * @returns boolean
 */
export function isSimpleMode(props: any): boolean {
  return !!(props.data && !props.series)
}

/**
 * Detect if props are in advanced mode
 * @param props - Component props
 * @returns boolean
 */
export function isAdvancedMode(props: any): boolean {
  return !!(props.series && !props.data)
}

// ============================================================================
// Validation Utilities
// ============================================================================

/**
 * Validate simple mode props
 * @param props - Component props
 */
export function validateSimpleModeProps(props: any): void {
  if (!props.data) {
    throw new Error('Simple mode requires "data" property')
  }
  if (props.series) {
    throw new Error('Simple mode cannot use "series" property. Use either "data" or "series", not both.')
  }
}

/**
 * Validate advanced mode props
 * @param props - Component props
 */
export function validateAdvancedModeProps(props: any): void {
  if (!props.series) {
    throw new Error('Advanced mode requires "series" property')
  }
  if (props.data) {
    throw new Error('Advanced mode cannot use "data" property. Use either "data" or "series", not both.')
  }
}
