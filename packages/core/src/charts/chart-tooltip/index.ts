/**
 * ChartTooltip - 图表提示组件
 *
 * 为图表提供统一的提示信息显示，支持多种格式和样式。
 * 这是图表组件库的重要组件，与 ChartContainer 配合使用。
 */

// Component
export { ChartTooltip } from './chart-tooltip'

// Types
export type { ChartTooltipProps, TooltipData } from './chart-tooltip'

// Constants
export const TOOLTIP_POSITION_TOP = 'top' as const
export const TOOLTIP_POSITION_BOTTOM = 'bottom' as const
export const TOOLTIP_POSITION_LEFT = 'left' as const
export const TOOLTIP_POSITION_RIGHT = 'right' as const
export const TOOLTIP_POSITION_CENTER = 'center' as const
export const TOOLTIP_VARIANT_DEFAULT = 'default' as const
export const TOOLTIP_VARIANT_CARD = 'card' as const
export const TOOLTIP_VARIANT_MINIMAL = 'minimal' as const
