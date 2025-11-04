/**
 * @fileoverview Timeline 组件导出
 * @description 时间线组件的公共 API 导出
 *
 * @version 1.0.0
 * @date 2025-11-04
 * @category Data Display
 * @layer component
 * @stability stable
 */

// 主组件导出
export { Timeline } from './timeline'
export { TimelineItem } from './timeline'
export { TimelineMarker } from './timeline'
export { TimelineConnector } from './timeline'
export { TimelineContent } from './timeline'
export { TimelineHeader } from './timeline'
export { TimelineBody } from './timeline'
export { TimelineDate } from './timeline'

// 便捷组件导出
export { TimelineTitle } from './timeline'
export { TimelineDescription } from './timeline'
export { TimelineFromData } from './timeline'
export { CollapsibleTimelineItem } from './timeline'

// 状态组件导出
export { TimelineSkeleton } from './timeline'
export { TimelineEmpty } from './timeline'

// 变体函数导出
export {
  timelineVariants,
  timelineItemVariants,
  timelineMarkerVariants,
  timelineConnectorVariants,
  timelineContentVariants,
} from './timeline'

// 类型定义导出
export type {
  TimelineProps,
  TimelineItemProps,
  TimelineMarkerProps,
  TimelineConnectorProps,
  TimelineContentProps,
  TimelineHeaderProps,
  TimelineBodyProps,
  TimelineDateProps,
  TimelineItemData,
  TimelineFromDataProps,
} from './timeline'

// 重新导出便捷访问方法
export const TimelineFromData = Timeline.fromData
export const TimelineSkeleton = Timeline.skeleton
export const TimelineEmpty = Timeline.empty
