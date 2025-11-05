// ============================================================================
// Charts - 图表组件 (v1.5.1 分类)
// ============================================================================

// Simple Mode Utilities - 简化模式工具
export * from './simple-mode'

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

// 核心图表组件 - 支持简单模式和高级模式
// ============================================================================

// LineChart - 折线图
export { LineChart, AdvancedLineChart } from './line-chart/line-chart'
export type {
  LineChartProps,
  DataPoint,
  DataSeries,
  GridConfig,
  AxisConfig,
  LegendConfig,
  TooltipConfig,
  ZoomConfig,
  SimpleTheme,
  SimpleDataPoint
} from './line-chart/line-chart'

// BarChart - 柱状图
export { BarChart, AdvancedBarChart } from './bar-chart/bar-chart'
export type {
  BarChartProps,
  DataPoint as BarDataPoint,
  DataSeries as BarDataSeries,
  GridConfig as BarGridConfig,
  AxisConfig as BarAxisConfig,
  LegendConfig as BarLegendConfig,
  TooltipConfig as BarTooltipConfig,
  SimpleTheme as BarSimpleTheme,
  SimpleDataSeries
} from './bar-chart/bar-chart'

// PieChart - 饼图
export { PieChart, AdvancedPieChart } from './pie-chart/pie-chart'
export type {
  PieChartProps,
  PieChartDataItem,
  LegendConfig as PieLegendConfig,
  TooltipConfig as PieTooltipConfig,
  SimpleTheme as PieSimpleTheme
} from './pie-chart/pie-chart'

// AreaChart - 面积图
export { AreaChart, AdvancedAreaChart } from './area-chart/area-chart'
export type {
  AreaChartProps,
  DataPoint,
  DataSeries,
  GridConfig,
  AxisConfig,
  LegendConfig,
  TooltipConfig,
  SimpleTheme,
  SimpleDataPoint
} from './area-chart/area-chart'

// ColumnChart - 柱状图
export { ColumnChart, AdvancedColumnChart } from './column-chart/column-chart'
export type {
  ColumnChartProps,
  DataPoint as ColumnDataPoint,
  DataSeries as ColumnDataSeries,
  GridConfig as ColumnGridConfig,
  AxisConfig as ColumnAxisConfig,
  LegendConfig as ColumnLegendConfig,
  TooltipConfig as ColumnTooltipConfig,
  SimpleTheme as ColumnSimpleTheme
} from './column-chart/column-chart'

// DonutChart - 环形图
export { DonutChart, AdvancedDonutChart } from './donut-chart/donut-chart'
export type {
  DonutChartProps,
  DataPoint as DonutDataPoint,
  LegendConfig as DonutLegendConfig,
  TooltipConfig as DonutTooltipConfig,
  SimpleTheme as DonutSimpleTheme
} from './donut-chart/donut-chart'

// Heatmap - 热力图
export { Heatmap, AdvancedHeatmap } from './heatmap/heatmap'
export type {
  HeatmapProps,
  HeatmapDataPoint,
  HeatmapSeries,
  DataPoint,
  DataSeries,
  GridConfig,
  AxisConfig,
  LegendConfig,
  TooltipConfig,
  SimpleTheme,
  SimpleDataPoint
} from './heatmap/heatmap'

// RadarChart - 雷达图
export { RadarChart, AdvancedRadarChart } from './radar-chart/radar-chart'
export type {
  RadarChartProps,
  DataPoint,
  DataSeries,
  GridConfig,
  AxisConfig,
  LegendConfig,
  TooltipConfig,
  SimpleTheme,
  SimpleDataPoint
} from './radar-chart/radar-chart'

// FunnelChart - 漏斗图
export { FunnelChart, AdvancedFunnelChart } from './funnel-chart/funnel-chart'
export type {
  FunnelChartProps,
  DataPoint,
  DataSeries,
  GridConfig,
  AxisConfig,
  LegendConfig,
  TooltipConfig,
  SimpleTheme,
  SimpleDataPoint
} from './funnel-chart/funnel-chart'

// GaugeChart - 仪表盘
export { GaugeChart, AdvancedGaugeChart } from './gauge-chart/gauge-chart'
export type {
  GaugeChartProps,
  GaugeDataPoint,
  GaugeThresholds,
  DataPoint as GaugeDataPoint,
  DataSeries as GaugeDataSeries,
  GridConfig as GaugeGridConfig,
  AxisConfig as GaugeAxisConfig,
  LegendConfig as GaugeLegendConfig,
  TooltipConfig as GaugeTooltipConfig,
  SimpleTheme as GaugeSimpleTheme,
  SimpleDataPoint as GaugeSimpleDataPoint
} from './gauge-chart/gauge-chart'

// MiniChart - 迷你图
export { MiniChart, AdvancedMiniChart } from './mini-chart/mini-chart'
export type {
  MiniChartProps,
  DataPoint,
  DataSeries,
  GridConfig,
  AxisConfig,
  LegendConfig,
  TooltipConfig,
  SimpleTheme,
  SimpleDataPoint
} from './mini-chart/mini-chart'

/**
 * @example
 *
 * Simple Mode Usage (快速上手):
 *
 * // LineChart
 * <LineChart
 *   simpleData={[['Jan', 4000], ['Feb', 3000], ['Mar', 5000]]}
 *   title="Monthly Revenue"
 *   theme="business"
 *   smooth={true}
 * />
 *
 * // AreaChart
 * <AreaChart
 *   simpleData={[['Jan', 4000], ['Feb', 3000], ['Mar', 5000]]}
 *   title="Monthly Growth"
 *   theme="dashboard"
 *   fill={true}
 *   showGrid={true}
 * />
 *
 * // ColumnChart
 * <ColumnChart
 *   simpleData={[['Product A', 4000], ['Product B', 3000]]}
 *   title="Product Sales"
 *   theme="dashboard"
 *   orientation="vertical"
 *   showValues={true}
 * />
 *
 * // BarChart
 * <BarChart
 *   simpleData={[['Product A', 4000], ['Product B', 3000]]}
 *   title="Product Sales"
 *   theme="dashboard"
 *   orientation="horizontal"
 *   showValues={true}
 * />
 *
 * // PieChart
 * <PieChart
 *   simpleData={[
 *     { name: 'Desktop', value: 4000 },
 *     { name: 'Mobile', value: 3000 },
 *     { name: 'Tablet', value: 2000 }
 *   ]}
 *   title="Device Usage"
 *   theme="business"
 *   donut={true}
 * />
 *
 * // DonutChart
 * <DonutChart
 *   simpleData={[
 *     { name: 'Chrome', value: 60 },
 *     { name: 'Firefox', value: 25 },
 *     { name: 'Safari', value: 15 }
 *   ]}
 *   title="Browser Market Share"
 *   theme="dashboard"
 * />
 *
 * // Heatmap
 * <Heatmap
 *   simpleData={[
 *     { name: 'Mon', value: 30 },
 *     { name: 'Tue', value: 50 },
 *     { name: 'Wed', value: 40 }
 *   ]}
 *   title="Weekly Activity"
 *   theme="business"
 * />
 *
 * // RadarChart
 * <RadarChart
 *   simpleData={[
 *     ['Skill A', 80],
 *     ['Skill B', 60],
 *     ['Skill C', 90]
 *   ]}
 *   title="Skill Assessment"
 *   theme="dashboard"
 * />
 *
 * // FunnelChart
 * <FunnelChart
 *   simpleData={[
 *     { name: '访问', value: 10000 },
 *     { name: '注册', value: 5000 },
 *     { name: '付费', value: 1000 }
 *   ]}
 *   title="Conversion Funnel"
 *   theme="business"
 * />
 *
 * // GaugeChart
 * <GaugeChart
 *   value={75}
 *   title="CPU Usage"
 *   theme="business"
 *   min={0}
 *   max={100}
 *   thresholds={{ warning: 70, danger: 90 }}
 * />
 *
 * // MiniChart
 * <MiniChart
 *   simpleData={[['Jan', 4000], ['Feb', 3000], ['Mar', 5000]]}
 *   type="line"
 *   theme="minimal"
 *   showTrend={true}
 * />
 *
 * Advanced Mode Usage (专业功能):
 *
 * // LineChart
 * <LineChart
 *   series={[
 *     {
 *       id: 'revenue',
 *       name: 'Revenue',
 *       data: monthlyData,
 *       smooth: true,
 *       area: { enabled: true }
 *     }
 *   ]}
 *   grid={{ enabled: true }}
 *   zoom={{ enabled: true }}
 * />
 *
 * // BarChart
 * <BarChart
 *   series={[
 *     {
 *       id: 'sales',
 *       name: 'Sales',
 *       data: productData
 *     }
 *   ]}
 *   direction="horizontal"
 *   variant="grouped"
 * />
 *
 * // PieChart
 * <PieChart
 *   data={deviceData}
 *   variant="donut"
 *   legend={{ enabled: true, position: 'bottom' }}
 * />
 *
 * // AreaChart
 * <AreaChart
 *   series={[
 *     {
 *       id: 'growth',
 *       name: 'Growth',
 *       data: growthData,
 *       fill: { enabled: true, opacity: 0.3 }
 *     }
 *   ]}
 *   grid={{ enabled: true }}
 *   smooth={true}
 * />
 *
 * // GaugeChart
 * <GaugeChart
 *   data={[{ x: 'CPU', y: 75, label: 'CPU Usage' }]}
 *   min={0}
 *   max={100}
 *   thresholds={{ warning: 70, danger: 90 }}
 *   showPointer={true}
 *   showThresholds={true}
 * />
 */
