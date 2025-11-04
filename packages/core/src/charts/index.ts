// ============================================================================
// Charts - 图表组件 (v1.5.1 分类)
// ============================================================================

// 图表容器组件
export { ChartContainer } from './chart-container/chart-container'
export type { ChartContainerProps } from './chart-container/chart-container'

// 图表区域组件
export { ChartArea } from './chart-area/chart-area'
export type { ChartAreaProps, AreaDataPoint, AreaSeries, ThresholdLine } from './chart-area/chart-area'

// 图表辅助组件
export { Axis } from './axis/axis'
export type { AxisProps, AxisConfig } from './axis/axis'

export { Legend } from './legend/legend'
export type { LegendProps, LegendItem } from './legend/legend'

export { ChartTooltip } from './chart-tooltip/chart-tooltip'
export type { ChartTooltipProps, TooltipData } from './chart-tooltip/chart-tooltip'

export { GridLines } from './grid-lines/grid-lines'
export type { GridLinesProps } from './grid-lines/grid-lines'

// 图表可视化组件
export { AreaChart } from './area-chart/area-chart'
export type { AreaChartProps, AreaDataPoint, AreaSeries } from './area-chart/area-chart'

export { ColumnChart } from './column-chart/column-chart'
export type { ColumnChartProps } from './column-chart/column-chart'

export { DonutChart } from './donut-chart/donut-chart'
export type { DonutChartProps, DonutDataPoint } from './donut-chart/donut-chart'

export { Heatmap } from './heatmap/heatmap'
export type { HeatmapProps, HeatmapDataPoint, HeatmapSeries } from './heatmap/heatmap'

export { RadarChart } from './radar-chart/radar-chart'
export type { RadarChartProps, RadarDataPoint, RadarSeries } from './radar-chart/radar-chart'

export { FunnelChart } from './funnel-chart/funnel-chart'
export type { FunnelChartProps, FunnelDataPoint } from './funnel-chart/funnel-chart'

export { MiniChart } from './mini-chart/mini-chart'
export type { MiniChartProps, MiniChartDataPoint, MiniChartTrend } from './mini-chart/mini-chart'

// PieChart 组件导出 (v1.0.0)
export { PieChart } from './pie-chart/pie-chart'
export type { PieChartProps, PieChartDataItem } from './pie-chart/pie-chart'

// TODO: 修复 shared 依赖后重新启用这些组件
// export { BarChart } from './bar-chart'
// export type { BarChartProps } from './bar-chart'

// export { LineChart } from './line-chart'
// export type { LineChartProps } from './line-chart'

// export { Gauge } from './gauge'
// export type { GaugeProps } from './gauge'
