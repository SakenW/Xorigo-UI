/**
 * ChartContainer - 图表容器组件
 *
 * 为各种图表提供统一的容器和布局，支持响应式设计、图例位置配置等。
 * 这是图表组件库的基础组件，其他图表都会基于它来构建。
 */

// Component
export { ChartContainer } from './chart-container'

// Types
export type { ChartContainerProps } from './chart-container'

// Constants
export const CHART_CONTAINER_DEFAULT_HEIGHT = 300
export const CHART_CONTAINER_DEFAULT_PADDING = 20
export const CHART_CONTAINER_DEFAULT_LEGEND_POSITION = 'top' as const
