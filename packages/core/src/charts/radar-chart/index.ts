/**
 * RadarChart - 雷达图组件
 *
 * 为图表提供雷达图显示，支持多维度数据对比、面积填充、网格线等特性。
 * 这是图表组件库的核心组件，基于 ChartContainer 构建。
 *
 * @version 1.0.0
 * @category Charts
 * @layer Component
 * @stability stable
 */

// ============================================================================
// Component
// ============================================================================

export { RadarChart } from './radar-chart'

// ============================================================================
// Types
// ============================================================================

export type {
  RadarChartProps,
  RadarDataPoint,
  RadarSeries
} from './radar-chart'

// ============================================================================
// Constants
// ============================================================================

export const RADAR_CHART_DEFAULT_RADIUS = 120
export const RADAR_CHART_DEFAULT_START_ANGLE = -90
export const RADAR_CHART_DEFAULT_GRID_LEVELS = 5
export const RADAR_CHART_DEFAULT_CENTER_POINT_SIZE = 4
export const RADAR_CHART_DEFAULT_LABEL_FONT_SIZE = 12
export const RADAR_CHART_MIN_DIMENSIONS = 3
export const RADAR_CHART_MAX_DIMENSIONS = 12
