/**
 * DonutChart - 环形图组件
 *
 * 为图表提供环形图显示，支持中心文本、多层环形、百分比显示等特性。
 * 这是图表组件库的核心组件，基于 ChartContainer 构建。
 */

// Component
export { DonutChart } from './donut-chart'

// Types
export type { DonutChartProps, DonutDataPoint } from './donut-chart'

// Constants
export const DONUT_CHART_DEFAULT_INNER_RADIUS = 0.6
export const DONUT_CHART_DEFAULT_THICKNESS = 20
export const DONUT_CHART_DEFAULT_START_ANGLE = -90
export const DONUT_CHART_LABEL_POSITION_INSIDE = 'inside' as const
export const DONUT_CHART_LABEL_POSITION_OUTSIDE = 'outside' as const
