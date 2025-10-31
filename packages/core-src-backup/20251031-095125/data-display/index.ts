/**
 * Data Display 组件导出 - 符合七轴主题系统 v1.4 SSOT
 *
 * 数据展示组件集合 - List, Table, Card, Timeline
 */

// =============================================================================
// 核心组件导出
// =============================================================================

// List 组件系列
export {
  List,
  ListItem,
  ListGroup,
  ListSeparator,
  listVariants,
  listItemVariants,
  generateGroupedItems,
  filterItems
} from './list/list'
export type {
  ListProps,
  ListItemData,
  ListItemProps,
  ListGroupProps
} from './list/list'

// Table 组件系列
export {
  Table,
  Cell,
  tableVariants,
  cellVariants,
  createColumn,
  createActionColumn
} from './table/table'
export type {
  TableProps,
  ColumnDef,
  CellProps
} from './table/table'

// Advanced Card 组件系列
export {
  AdvancedCard,
  StatCard,
  ProductCard,
  ArticleCard,
  CardGrid
} from './advanced-card/advanced-card'
export type {
  CardProps,
  StatCardProps,
  ProductCardProps,
  ArticleCardProps,
  CardGridProps
} from './advanced-card/advanced-card'

// Card 组件系列 (重命名避免冲突)
export {
  SimpleCard,
  StatsCard,
  cardVariants as dataDisplayCardVariants,
  cardContentVariants,
  createCardData,
  filterCards
} from './card/card'
export type {
  SimpleCardProps,
  StatsCardProps
} from './card/card'

// Timeline 组件系列
export {
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineConnector,
  timelineVariants,
  timelineItemVariants,
  generateTimelineGroups,
  formatTimelineTime
} from './timeline/timeline'
export type {
  TimelineProps,
  TimelineItemProps,
  TimelineDotProps,
  TimelineConnectorProps
} from './timeline/timeline'

// =============================================================================
// 导入类型用于内部使用
// =============================================================================

import type {
  ListProps,
  ListItemData
} from './list/list'
import type {
  TableProps,
  ColumnDef,
  CellProps
} from './table/table'
import type {
  CardProps
} from './card/card'
import type {
  TimelineProps,
  TimelineItem
} from './timeline/timeline'

// =============================================================================
// 类型导出
// =============================================================================

// =============================================================================
// 类型导出
// =============================================================================

/**
 * 所有数据展示组件的 Props 类型联合
 */
export type DataDisplayComponentProps =
  | ListProps
  | TableProps
  | CardProps
  | TimelineProps

/**
 * 数据展示组件变体类型
 */
export type DataDisplayVariant =
  | ListProps['variant']
  | TableProps['variant']
  | CardProps['variant']
  | TimelineProps['variant']

/**
 * 数据展示组件尺寸类型
 */
export type DataDisplaySize =
  | ListProps['size']
  | TableProps['size']
  | CardProps['size']
  | TimelineProps['size']

/**
 * 数据展示组件布局类型
 */
export type DataDisplayLayout =
  | ListProps['layout']
  | TableProps['layout']
  | TimelineProps['direction']

/**
 * 数据展示组件交互类型
 */
export type DataDisplayInteraction =
  | ListProps['interactive']
  | TableProps['hoverable']
  | CardProps['interactive']
  | CardProps['hoverable']

// =============================================================================
// 默认配置导出
// =============================================================================

/**
 * 默认的 List 配置
 */
export const defaultListConfig = {
  variant: 'default' as const,
  size: 'md' as const,
  layout: 'vertical' as const,
  interactive: true,
  selection: 'none' as const,
} as const

/**
 * 默认的 Table 配置
 */
export const defaultTableConfig = {
  variant: 'default' as const,
  size: 'md' as const,
  layout: 'auto' as const,
  hoverable: true,
  striped: false,
} as const

/**
 * 默认的 Card 配置
 */
export const defaultCardConfig = {
  variant: 'default' as const,
  size: 'md' as const,
  shadow: 'sm' as const,
  hoverable: false,
  rounded: 'lg' as const,
} as const

/**
 * 默认的 Timeline 配置
 */
export const defaultTimelineConfig = {
  direction: 'vertical' as const,
  variant: 'default' as const,
  align: 'left' as const,
  linePosition: 'left' as const,
  showLine: true,
} as const

// =============================================================================
// 工具函数导出
// =============================================================================

/**
 * 创建标准列表的便捷函数
 */
export const createStandardList = <T,>(
  items: T[],
  options: {
    getItemId: (item: T) => string
    getItemTitle: (item: T) => React.ReactNode
    getItemDescription?: (item: T) => React.ReactNode
    getItemIcon?: (item: T) => React.ReactNode
  },
  props: Partial<ListProps> = {}
) => {
  const listItems: ListItemData[] = items.map(item => {
    const title = options.getItemTitle(item);
    const description = options.getItemDescription?.(item);

    return {
      id: options.getItemId(item),
      content: title,
      title: typeof title === 'string' ? title :
             typeof title === 'number' ? String(title) : undefined,
      description: typeof description === 'string' ? description : undefined,
      icon: options.getItemIcon?.(item),
      data: item,
    };
  })

  return {
    ...defaultListConfig,
    items: listItems,
    ...props,
  }
}

/**
 * 创建标准表格的便捷函数
 */
export const createStandardTable = <T,>(
  data: T[],
  columns: Partial<ColumnDef<T>>[],
  props: Partial<TableProps> = {}
) => {
  const tableColumns: ColumnDef<T>[] = columns.map((col, index) => ({
    id: col.id || `col-${index}`,
    header: col.header || `列 ${index + 1}`,
    accessorKey: col.accessorKey || Object.keys(data[0] || {})[index] as keyof T,
    align: 'left',
    sortable: false,
    ...col,
  }))

  return {
    ...defaultTableConfig,
    data,
    columns: tableColumns,
    ...props,
  }
}

/**
 * 创建标准卡片的便捷函数
 */
export const createStandardCards = <T,>(
  items: T[],
  options: {
    getCardTitle: (item: T) => React.ReactNode
    getCardDescription?: (item: T) => React.ReactNode
    getCardContent?: (item: T) => React.ReactNode
    getCardActions?: (item: T) => React.ReactNode
  },
  props: Partial<CardProps> = {}
) => {
  return {
    ...defaultCardConfig,
    items: items.map(item => ({
      key: String(options.getCardTitle(item)),
      title: options.getCardTitle(item),
      description: options.getCardDescription?.(item),
      content: options.getCardContent?.(item),
      actions: options.getCardActions?.(item),
      data: item,
      ...props,
    })),
  }
}

/**
 * 创建标准时间线的便捷函数
 */
export const createStandardTimeline = (
  items: TimelineItem[],
  props: Partial<TimelineProps> = {}
) => {
  return {
    ...defaultTimelineConfig,
    items,
    ...props,
  }
}

// =============================================================================
// 主题集成导出
// =============================================================================

/**
 * 数据展示组件的主题 CSS 变量映射
 */
export const dataDisplayThemeVariables = {
  // List 主题变量
  '--list-border': 'hsl(var(--border))',
  '--list-bg': 'hsl(var(--background))',
  '--list-text': 'hsl(var(--foreground))',
  '--list-hover': 'hsl(var(--accent))',
  '--list-selected': 'hsl(var(--accent))',

  // Table 主题变量
  '--table-border': 'hsl(var(--border))',
  '--table-bg': 'hsl(var(--background))',
  '--table-header-bg': 'hsl(var(--muted))',
  '--table-text': 'hsl(var(--foreground))',
  '--table-hover': 'hsl(var(--accent))',
  '--table-striped': 'hsl(var(--muted) / 0.3)',

  // Card 主题变量
  '--card-bg': 'hsl(var(--card))',
  '--card-text': 'hsl(var(--card-foreground))',
  '--card-border': 'hsl(var(--border))',
  '--card-shadow': 'hsl(var(--foreground) / 0.1)',
  '--card-header-text': 'hsl(var(--card-foreground))',
  '--card-header-muted': 'hsl(var(--muted-foreground))',
  '--card-content-text': 'hsl(var(--card-foreground))',

  // Timeline 主题变量
  '--timeline-line': 'hsl(var(--border))',
  '--timeline-dot': 'hsl(var(--background))',
  '--timeline-dot-border': 'hsl(var(--border))',
  '--timeline-text': 'hsl(var(--foreground))',
  '--timeline-muted': 'hsl(var(--muted-foreground))',
  '--timeline-success': 'hsl(var(--success))',
  '--timeline-warning': 'hsl(var(--warning))',
  '--timeline-error': 'hsl(var(--destructive))',
  '--timeline-info': 'hsl(var(--info))',
} as const

/**
 * 数据展示组件的标准主题类名
 */
export const dataDisplayThemeClasses = {
  // 列表样式
  list: 'divide-y divide-border',
  listItem: 'p-4 hover:bg-accent-500-500-500/50 transition-colors',
  listGroup: 'mb-6',
  listSeparator: 'h-px bg-border my-2',

  // 表格样式
  table: 'w-full border-collapse border border-border-base-base',
  tableHeader: 'bg-background-primary-secondary/50 font-medium text-text-secondary-600',
  tableRow: 'hover:bg-accent-500-500-500/50 transition-colors',
  tableCell: 'border-b border-border-base-base px-4 py-2 text-left',

  // 卡片样式
  card: 'rounded-lg border bg-background-primary-primary text-text-primary shadow-sm',
  cardHeader: 'flex items-start justify-between p-4 pb-3',
  cardContent: 'p-4 pt-0',
  cardFooter: 'flex items-center justify-between p-4 pt-3',
  cardInteractive: 'transition-shadow hover:shadow-md cursor-pointer',

  // 时间线样式
  timeline: 'relative',
  timelineItem: 'relative flex items-start',
  timelineDot: 'w-3 h-3 rounded-full border-2',
  timelineConnector: 'absolute bg-border',
} as const

// =============================================================================
// 预设布局导出
// =============================================================================

/**
 * 数据展示布局预设
 */
export const DataDisplayLayoutPresets = {
  // 标准列表布局
  listStandard: {
    variant: 'default' as const,
    size: 'md' as const,
    layout: 'vertical' as const,
    interactive: true,
  },

  // 卡片网格布局
  cardGrid: {
    variant: 'default' as const,
    size: 'md' as const,
    shadow: 'md' as const,
    hoverable: true,
  },

  // 数据表格布局
  dataTable: {
    variant: 'default' as const,
    size: 'md' as const,
    hoverable: true,
    striped: true,
  },

  // 垂直时间线布局
  timelineVertical: {
    direction: 'vertical' as const,
    align: 'left' as const,
    showLine: true,
  },

  // 水平时间线布局
  timelineHorizontal: {
    direction: 'horizontal' as const,
    align: 'center' as const,
    showLine: true,
  },

  // 交替时间线布局
  timelineAlternate: {
    direction: 'alternate' as const,
    align: 'center' as const,
    showLine: true,
  },
} as const

/**
 * 响应式数据展示预设
 */
export const ResponsiveDataDisplayPresets = {
  // 响应式列表
  responsiveList: {
    layout: 'vertical' as const,
    responsive: 'mobile' as const,
  },

  // 响应式卡片网格
  responsiveCards: {
    layout: 'grid' as const,
    responsive: 'md' as const,
  },

  // 响应式表格
  responsiveTable: {
    size: 'sm' as const,
    compact: true,
  },

  // 响应式时间线
  responsiveTimeline: {
    direction: 'vertical' as const,
    align: 'center' as const,
  },
} as const
