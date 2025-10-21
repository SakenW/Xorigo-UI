/**
 * Charts 数据可视化
 * 包含图表、统计仪表盘等数据可视化组件
 */

// 新增图表组件导出
export { LineChart } from './LineChart'
export type { LineChartProps } from './LineChart'

export { BarChart } from './BarChart'
export type { BarChartProps } from './BarChart'

export { PieChart } from './PieChart'
export type { PieChartProps } from './PieChart'

// 共享组件导出
export { ChartContainer } from './shared/ChartTypes'
export { ChartTooltip } from './shared/ChartTooltip'
export { ChartLegend } from './shared/ChartLegend'

// 类型导出
export type {
  ChartData,
  ChartSeries,
  ChartBaseProps,
  ChartTooltipProps,
  ChartLegendProps,
  ChartContainerProps,
  ChartVariant,
  ChartSize
} from './shared/ChartTypes'

// 工具函数导出
export {
  generateColors,
  getMaxValue,
  getMinValue,
  getTotalValue,
  formatValue,
  calculatePercentage,
  createResponsiveDimensions,
  interpolatePath,
  getSteppedPath
} from './shared/ChartUtils'

// 保留原有导出（如果存在）
// export * from './Chart'
// export * from './Stat'
// export * from './Gauge'
