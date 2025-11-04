/**
 * ColumnChart - 条形图组件
 *
 * 为图表提供条形图显示，支持垂直条形图、分组、堆叠等特性。
 * 这是图表组件库的核心组件，基于 ChartContainer 构建。
 */

// Component
export { ColumnChart } from './column-chart'

// Types
export type { ColumnChartProps, ColumnDataPoint, ColumnSeries } from './column-chart'

// Constants
export const COLUMN_CHART_TYPE_DEFAULT = 'default' as const
export const COLUMN_CHART_TYPE_GROUPED = 'grouped' as const
export const COLUMN_CHART_TYPE_STACKED = 'stacked' as const
export const COLUMN_CHART_DEFAULT_HEIGHT = 300
export const COLUMN_CHART_DEFAULT_BAR_WIDTH = 40
export const COLUMN_CHART_DEFAULT_BAR_GAP = 2
