/**
 * AreaChart - 面积图组件
 *
 * 为图表提供面积图显示，支持堆叠、百分比、渐变填充等特性。
 * 这是图表组件库的核心组件，基于 ChartContainer 构建。
 */

// Component
export { AreaChart } from './area-chart'

// Types
export type { AreaChartProps, AreaDataPoint, AreaSeries } from './area-chart'

// Constants
export const AREA_CHART_TYPE_DEFAULT = 'default' as const
export const AREA_CHART_TYPE_STACKED = 'stacked' as const
export const AREA_CHART_TYPE_PERCENT = 'percent' as const
export const AREA_CHART_DEFAULT_HEIGHT = 300
export const AREA_CHART_DEFAULT_FILL_OPACITY = 0.6
