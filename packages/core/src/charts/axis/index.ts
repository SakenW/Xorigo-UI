/**
 * Axis - 坐标轴组件
 *
 * 为图表提供 X 轴和 Y 轴，支持标签、刻度、网格线等。
 * 这是图表组件库的核心组件，与 ChartContainer 配合使用。
 */

// Component
export { Axis } from './axis'

// Types
export type { AxisProps } from './axis'

// Constants
export const AXIS_TYPE_X = 'x' as const
export const AXIS_TYPE_Y = 'y' as const
export const AXIS_POSITION_TOP = 'top' as const
export const AXIS_POSITION_BOTTOM = 'bottom' as const
export const AXIS_POSITION_LEFT = 'left' as const
export const AXIS_POSITION_RIGHT = 'right' as const
