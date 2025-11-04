/**
 * BarChart - 柱状图组件
 *
 * 为数据可视化提供强大的柱状图展示功能，支持多种图表类型和配置选项。
 * 这是图表组件库的核心组件，基于现代 React 和 SVG 技术构建。
 */

// Component
export { BarChart } from './bar-chart'

// Types
export type {
  BarChartProps,
  DataPoint,
  DataSeries,
  GridConfig,
  AxisConfig,
  LegendConfig,
  TooltipConfig,
} from './bar-chart'

// Constants
export const BAR_CHART_DIRECTION_VERTICAL = 'vertical' as const
export const BAR_CHART_DIRECTION_HORIZONTAL = 'horizontal' as const
export const BAR_CHART_VARIANT_DEFAULT = 'default' as const
export const BAR_CHART_VARIANT_GROUPED = 'grouped' as const
export const BAR_CHART_VARIANT_STACKED = 'stacked' as const
export const BAR_CHART_VARIANT_PERCENTAGE = 'percentage' as const
export const BAR_CHART_DEFAULT_WIDTH = 800
export const BAR_CHART_DEFAULT_HEIGHT = 400
export const BAR_CHART_DEFAULT_ANIMATION_DURATION = 1000
export const BAR_CHART_DEFAULT_BAR_GAP = 4
export const BAR_CHART_DEFAULT_BAR_CATEGORY_GAP = 20
