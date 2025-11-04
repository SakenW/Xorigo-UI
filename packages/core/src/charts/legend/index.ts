/**
 * Legend - 图例组件
 *
 * 为图表提供图例显示，支持多种布局方式、颜色、符号等。
 * 这是图表组件库的重要组件，与 ChartContainer 配合使用。
 */

// Component
export { Legend } from './legend'

// Types
export type { LegendProps, LegendItem } from './legend'

// Constants
export const LEGEND_ORIENTATION_HORIZONTAL = 'horizontal' as const
export const LEGEND_ORIENTATION_VERTICAL = 'vertical' as const
export const LEGEND_ALIGN_START = 'start' as const
export const LEGEND_ALIGN_CENTER = 'center' as const
export const LEGEND_ALIGN_END = 'end' as const
export const LEGEND_SIZE_SM = 'sm' as const
export const LEGEND_SIZE_MD = 'md' as const
export const LEGEND_SIZE_LG = 'lg' as const
export const LEGEND_SYMBOL_CIRCLE = 'circle' as const
export const LEGEND_SYMBOL_SQUARE = 'square' as const
export const LEGEND_SYMBOL_TRIANGLE = 'triangle' as const
export const LEGEND_SYMBOL_DIAMOND = 'diamond' as const
export const LEGEND_SYMBOL_LINE = 'line' as const
