/**
 * GridLines 组件
 *
 * 用于在图表中显示网格线和坐标轴的可复用组件。
 * 支持水平和垂直方向配置，集成七轴主题系统，
 * 具有丰富的自定义选项和 Framer Motion 动画支持。
 *
 * @version 1.0.0
 * @author Xorigo UI Team
 */

export { GridLines } from './grid-lines'
export { gridLineVariants, type GridLineVariants } from './grid-lines'

// 类型导出
export type {
  GridLinesProps,
  ChartMargin,
  GridLineDirection,
  GridLineConfig
} from './grid-lines'

// 默认配置导出
export { default as gridLineConfig } from './grid-lines.config'
