/**
 * 📊 Data Display · 数据展示 - v2025.11.04
 *
 * 数据展示、表格、列表等可视化组件
 * 不改变数据，只负责展示当前状态
 *
 * @version 2025.11.04
 * @category Data Display
 * @layer component
 */

// 表格组件
export { Table } from './table'
export { TableHeader } from './table-header'
export { TableBody } from './table-body'
export { TableRow } from './table-row'
export { TableCell } from './table-cell'

// 数据表格组件
export { DataGrid } from './data-grid'
export type {
  DataGridProps,
  DataGridColumn,
  SortConfig,
  FilterConfig,
  SelectionConfig,
  PaginationConfig,
  VirtualizationConfig,
  DataGridRef,
} from './data-grid'

// 列表组件
export { List } from './list'
export { ListItem } from './list-item'
export type { ListItemProps } from './list-item'

// 手风琴组件
export { Accordion } from './accordion'
export { AccordionItem } from './accordion-item'
export { AccordionHeader } from './accordion-header'
export { AccordionContent } from './accordion-content'

// 折叠面板组件
export { Collapse } from './collapse'
export { CollapseHeader } from './collapse'
export { CollapseContent } from './collapse'
export { CollapseItem } from './collapse'
export { collapseVariants, headerVariants, contentVariants } from './collapse'
export type {
  CollapseProps,
  CollapseHeaderProps,
  CollapseContentProps,
  CollapseItemProps,
} from './collapse'

// 轮播组件
export { Carousel } from './carousel'
export { CarouselItem } from './carousel-item'
export { CarouselControl } from './carousel-control'

// 卡片组件
export { Card } from './card'
export { CardHeader } from './card'
export { CardBody } from './card'
export { CardFooter } from './card'
export { AdvancedCard } from './advanced-card'
export { ComponentCard } from './component-card'

// 徽章组件
export { Badge } from './badge'
export type { BadgeProps, BadgeVariants } from './badge'

// 标签组件
export { Tag, TagGroup } from './tag'
export type { TagProps, TagGroupProps, TagVariants } from './tag'

// 芯片组件
export { ChipDisplay } from './chip-display'
export type { ChipDisplayProps, ChipDisplayVariants } from './chip-display'

// 代码展示
export { CodeBlock } from './code-block'

// 统计组件
export { Stat } from './stat'
export { StatisticCard } from './statistic-card'

// 图表基础
export { Chart } from './chart'

// 头像组件
export { Avatar } from './avatar'
export type { AvatarProps, AvatarVariants } from './avatar'

// 头像组组件
export { AvatarGroup } from './avatar-group'
export type { AvatarGroupProps, AvatarGroupVariants, OverflowVariants } from './avatar-group'
export { avatarGroupVariants, overflowVariants } from './avatar-group'

// 键值列表组件
export { KeyValueList } from './key-value-list'
export { KeyValueItem } from './key-value-list'
export { KeyValueGroup } from './key-value-list'
export { KeyValueListHeader } from './key-value-list'
export { KeyValueListFooter } from './key-value-list'
export { SimpleKeyValueList } from './key-value-list'
export { CardKeyValueList } from './key-value-list'
export { BorderedKeyValueList } from './key-value-list'
export { FilledKeyValueList } from './key-value-list'
export { keyValueListVariants, keyVariants, valueVariants, groupVariants } from './key-value-list'
export type {
  KeyValueListProps,
  KeyValueItemProps,
  KeyValueGroupProps,
  KeyValueItem,
  KeyValueGroup,
} from './key-value-list'

// 时间线组件
export { Timeline } from './timeline'
export { TimelineItem } from './timeline'
export { TimelineMarker } from './timeline'
export { TimelineConnector } from './timeline'
export { TimelineContent } from './timeline'
export { TimelineHeader } from './timeline'
export { TimelineBody } from './timeline'
export { TimelineDate } from './timeline'
export { TimelineTitle } from './timeline'
export { TimelineDescription } from './timeline'
export { TimelineFromData } from './timeline'
export { CollapsibleTimelineItem } from './timeline'
export { TimelineSkeleton } from './timeline'
export { TimelineEmpty } from './timeline'
export { timelineVariants, timelineItemVariants, timelineMarkerVariants, timelineConnectorVariants, timelineContentVariants } from './timeline'
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

// 步骤指示器组件
export { Steps } from './steps'
export { stepsVariants, stepVariants, stepIndicatorVariants, stepConnectorVariants, stepContentVariants, stepTitleVariants, stepDescriptionVariants } from './steps'
export type { StepItem, StepsProps } from './steps'

// 重新导出 Card 相关类型
export type {
  CardProps,
  CardHeaderProps,
  CardBodyProps,
  CardFooterProps,
  CardVariants,
} from './card'

// 重新导出 StatisticCard 相关类型
export type {
  StatisticCardProps,
  StatisticCardVariants,
  TrendData,
  ComparisonData,
  ChartDataPoint,
} from './statistic-card'

// 重新导出 ChipDisplay 相关类型和变体
export { chipVariants, iconSizeVariants } from './chip-display'

// 信息提示组件
export { InfoTooltip } from './info-tooltip'
export type { InfoTooltipProps } from './info-tooltip'

// 重新导出 ListItem 相关类型和变体
export { listItemVariants, avatarVariants, iconVariants, badgeVariants } from './list-item'
export type {
  ListItemVariants,
  AvatarVariants,
  IconVariants,
  BadgeVariants,
} from './list-item'
