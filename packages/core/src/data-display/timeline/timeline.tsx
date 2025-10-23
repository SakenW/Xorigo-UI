/**
 * Timeline 时间线组件 - 符合七轴主题系统 v1.4 SSOT
 *
 * 数据展示组件 - 时间序列和事件展示
 */

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../foundations/utils/cn'
import { useTheme } from '../../system/theme-provider'

// =============================================================================
// 组件变体系统 - CVA (Class Variance Authority)
// =============================================================================

const timelineVariants = cva(
  // 基础样式 - 使用七轴主题系统的密度令牌
  "relative",
  {
    variants: {
      // 方向
      direction: {
        vertical: "flex flex-col space-y-8",
        horizontal: "flex flex-row space-x-8 overflow-x-auto",
        alternate: "flex flex-col space-y-8",
      },

      // 变体系统 - 使用七轴主题系统的颜色令牌
      variant: {
        default: "",
        colored: "",
        minimal: "",
        dotted: "",
      },

      // 对齐方式
      align: {
        left: "items-start",
        center: "items-center",
        right: "items-end",
      },

      // 时间线位置
      linePosition: {
        left: "left-0",
        center: "left-1/2 -translate-x-1/2",
        right: "right-0",
      },

      // 尺寸系统 - 使用七轴主题系统的密度令牌
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },

      // 连接线样式
      lineStyle: {
        solid: "",
        dashed: "border-dashed",
        dotted: "border-dotted",
        double: "border-double",
      },

      // 是否显示连接线
      showLine: {
        true: "",
        false: "",
      },
    },

    // 默认变体
    defaultVariants: {
      direction: 'vertical',
      variant: 'default',
      align: 'left',
      linePosition: 'left',
      size: 'md',
      lineStyle: 'solid',
      showLine: true,
    },
  }
)

const timelineItemVariants = cva(
  // 基础样式
  "relative flex items-start",
  {
    variants: {
      // 方向
      direction: {
        vertical: "flex-row",
        horizontal: "flex-col",
        alternate: "flex-row",
      },

      // 位置（仅用于 alternate 模式）
      position: {
        left: "flex-row",
        right: "flex-row-reverse",
      },

      // 变体
      variant: {
        default: "",
        colored: "",
        minimal: "",
        dotted: "",
      },

      // 对齐
      align: {
        left: "",
        center: "justify-center",
        right: "justify-end",
      },

      // 时间线位置
      linePosition: {
        left: "pl-8",
        center: "flex-row items-center",
        right: "pr-8",
      },

      // 尺寸
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },
    },

    defaultVariants: {
      direction: 'vertical',
      position: 'left',
      variant: 'default',
      align: 'left',
      linePosition: 'left',
      size: 'md',
    },
  }
)

// =============================================================================
// 类型定义
// =============================================================================

export interface TimelineItem {
  /**
   * 唯一标识
   */
  id: string

  /**
   * 时间
   */
  time: React.ReactNode

  /**
   * 标题
   */
  title: React.ReactNode

  /**
   * 描述内容
   */
  description?: React.ReactNode

  /**
   * 图标
   */
  icon?: React.ReactNode

  /**
   * 颜色状态
   */
  status?: 'default' | 'success' | 'warning' | 'error' | 'info'

  /**
   * 是否完成
   */
  completed?: boolean

  /**
   * 是否当前
   */
  current?: boolean

  /**
   * 自定义内容
   */
  content?: React.ReactNode

  /**
   * 附加数据
   */
  data?: any
}

export interface TimelineProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineVariants> {
  /**
   * 时间线项目列表
   */
  items?: TimelineItem[]

  /**
   * 自定义渲染函数
   */
  renderItem?: (item: TimelineItem, index: number) => React.ReactNode

  /**
   * 头部内容
   */
  header?: React.ReactNode

  /**
   * 底部内容
   */
  footer?: React.ReactNode

  /**
   * 自动交替布局（仅 vertical 方向）
   */
  alternate?: boolean

  /**
   * 连接线颜色
   */
  lineColor?: string

  /**
   * 是否显示时间
   */
  showTime?: boolean

  /**
   * 时间格式化函数
   */
  formatTime?: (time: React.ReactNode) => React.ReactNode

  /**
   * 子元素内容
   */
  children?: React.ReactNode
}

export interface TimelineItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineItemVariants> {
  /**
   * 时间线项目数据
   */
  item?: TimelineItem

  /**
   * 是否最后一个项目
   */
  isLast?: boolean

  /**
   * 连接线样式
   */
  lineStyle?: TimelineProps['lineStyle']

  /**
   * 连接线颜色
   */
  lineColor?: string

  /**
   * 子元素内容
   */
  children?: React.ReactNode
}

// =============================================================================
// Timeline 主组件实现
// =============================================================================

const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  (
    {
      direction,
      variant,
      align,
      linePosition,
      size,
      lineStyle,
      showLine = true,
      items = [],
      renderItem,
      header,
      footer,
      alternate = false,
      lineColor,
      showTime = true,
      formatTime,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme()

    // 生成主题相关的样式
    const themeStyles: React.CSSProperties = {
      '--timeline-line': lineColor || `hsl(${theme.colors.border.primary})`,
      '--timeline-dot': `hsl(${theme.colors.background})`,
      '--timeline-dot-border': `hsl(${theme.colors.border.primary})`,
      '--timeline-text': `hsl(${theme.colors.text.primary})`,
      '--timeline-muted': `hsl(${theme.colors.text.muted})`,
      // 状态颜色
      '--timeline-success': `hsl(${theme.colors.success})`,
      '--timeline-warning': `hsl(${theme.colors.warning})`,
      '--timeline-error': `hsl(${theme.colors.destructive})`,
      '--timeline-info': `hsl(${theme.colors.info})`,
      // 可根据七轴动态调整
    }

    // 处理交替布局
    const finalDirection = alternate && direction === 'vertical' ? 'alternate' : direction
    const finalAlign = alternate ? 'center' : align

    // 渲染时间线项目
    const renderTimelineItem = React.useCallback((item: TimelineItem, index: number) => {
      const isLast = index === items.length - 1
      const position = alternate && index % 2 === 1 ? 'right' : 'left'

      if (renderItem) {
        return renderItem(item, index)
      }

      return (
        <TimelineItem
          key={item.id}
          item={item}
          direction={finalDirection}
          position={position}
          variant={variant}
          align={finalAlign}
          linePosition={linePosition}
          size={size}
          isLast={isLast}
          lineStyle={lineStyle}
          lineColor={lineColor}
        />
      )
    }, [items.length, finalDirection, variant, finalAlign, linePosition, size, lineStyle, lineColor, renderItem, alternate])

    return (
      <div
        ref={ref}
        className={cn(
          timelineVariants({
            direction: finalDirection,
            variant,
            align: finalAlign,
            linePosition,
            size,
            lineStyle,
            showLine,
          }),
          className
        )}
        style={themeStyles}
        {...props}
      >
        {/* 头部 */}
        {header && (
          <div className="mb-8">
            {header}
          </div>
        )}

        {/* 时间线内容 */}
        <div className="relative">
          {/* 连接线 */}
          {showLine && items.length > 1 && (
            <div
              className={cn(
                "absolute",
                direction === 'vertical' && "left-4 top-0 bottom-0 w-0.5",
                direction === 'horizontal' && "top-4 left-0 right-0 h-0.5",
                direction === 'alternate' && "left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2"
              )}
              style={{
                backgroundColor: 'var(--timeline-line)',
                borderStyle: lineStyle === 'dashed' ? 'dashed' :
                             lineStyle === 'dotted' ? 'dotted' :
                             lineStyle === 'double' ? 'double' : 'solid',
              }}
            />
          )}

          {/* 时间线项目 */}
          {children || items.map(renderTimelineItem)}
        </div>

        {/* 底部 */}
        {footer && (
          <div className="mt-8">
            {footer}
          </div>
        )}
      </div>
    )
  }
)

// =============================================================================
// TimelineItem 组件实现
// =============================================================================

const TimelineItem = React.forwardRef<HTMLDivElement, TimelineItemProps>(
  (
    {
      item,
      direction,
      position,
      variant,
      align,
      linePosition,
      size,
      isLast = false,
      lineStyle,
      lineColor,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme()

    if (!item && !children) return null

    const itemData = item || ({} as TimelineItem)

    // 获取状态颜色
    const getStatusColor = (status?: TimelineItem['status']) => {
      switch (status) {
        case 'success': return 'var(--timeline-success)'
        case 'warning': return 'var(--timeline-warning)'
        case 'error': return 'var(--timeline-error)'
        case 'info': return 'var(--timeline-info)'
        default: return 'var(--timeline-dot-border)'
      }
    }

    const dotColor = getStatusColor(itemData.status)
    const isActive = itemData.current
    const isCompleted = itemData.completed

    return (
      <div
        ref={ref}
        className={cn(
          timelineItemVariants({
            direction,
            position,
            variant,
            align,
            linePosition,
            size,
          }),
          className
        )}
        {...props}
      >
        {/* 时间线节点 */}
        <div className={cn(
          "absolute z-10 flex items-center justify-center",
          direction === 'vertical' && "left-0 -translate-x-1/2",
          direction === 'horizontal' && "top-0 -translate-y-1/2",
          direction === 'alternate' && "left-1/2 -translate-x-1/2"
        )}>
          <div
            className={cn(
              "w-3 h-3 rounded-full border-2",
              isActive && "w-4 h-4",
              isCompleted && "bg-primary border-primary",
              !isCompleted && !isActive && "bg-background-primary",
              "transition-all duration-200"
            )}
            style={{
              backgroundColor: isCompleted ? 'var(--timeline-success)' :
                           isActive ? 'var(--timeline-primary)' :
                           'var(--timeline-dot)',
              borderColor: dotColor,
            }}
          >
            {itemData.icon && (
              <div className="w-4 h-4 flex items-center justify-center -mt-0.5 -ml-0.5">
                {itemData.icon}
              </div>
            )}
          </div>
        </div>

        {/* 内容区域 */}
        <div className={cn(
          "flex-1 min-w-0",
          direction === 'vertical' && "ml-8",
          direction === 'horizontal' && "mt-8",
          position === 'right' && "ml-8 mr-0",
          linePosition === 'center' && "mx-8"
        )}>
          {children || (
            <div className="space-y-2">
              {/* 时间 */}
              {itemData.time && (
                <div className="text-sm text-text-secondary-600" style={{ color: 'var(--timeline-muted)' }}>
                  {itemData.time}
                </div>
              )}

              {/* 标题 */}
              {itemData.title && (
                <div className="font-medium" style={{ color: 'var(--timeline-text)' }}>
                  {itemData.title}
                </div>
              )}

              {/* 描述 */}
              {itemData.description && (
                <div className="text-sm" style={{ color: 'var(--timeline-muted)' }}>
                  {itemData.description}
                </div>
              )}

              {/* 自定义内容 */}
              {itemData.content}
            </div>
          )}
        </div>
      </div>
    )
  }
)

// =============================================================================
// 专用 Timeline 组件
// =============================================================================

// TimelineDot - 时间线节点组件
export interface TimelineDotProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: TimelineItem['status']
  active?: boolean
  completed?: boolean
  icon?: React.ReactNode
}

const TimelineDot = React.forwardRef<HTMLDivElement, TimelineDotProps>(
  ({ status, active = false, completed = false, icon, className, ...props }, ref) => {
    const { theme } = useTheme()

    const getStatusColor = (status?: TimelineItem['status']) => {
      switch (status) {
        case 'success': return `hsl(${theme.colors.success})`
        case 'warning': return `hsl(${theme.colors.warning})`
        case 'error': return `hsl(${theme.colors.destructive})`
        case 'info': return `hsl(${theme.colors.info})`
        default: return `hsl(${theme.colors.border.primary})`
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          "w-3 h-3 rounded-full border-2 flex items-center justify-center",
          active && "w-4 h-4",
          completed && "bg-primary border-primary",
          !completed && !active && "bg-background-primary",
          "transition-all duration-200",
          className
        )}
        style={{
          backgroundColor: completed ? `hsl(${theme.colors.success})` :
                           active ? `hsl(${theme.colors.primary})` :
                           `hsl(${theme.colors.background})`,
          borderColor: getStatusColor(status),
        }}
        {...props}
      >
        {icon && (
          <div className="w-4 h-4 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
    )
  }
)

TimelineDot.displayName = 'TimelineDot'

// TimelineConnector - 连接器组件
export interface TimelineConnectorProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'vertical' | 'horizontal'
  style?: 'solid' | 'dashed' | 'dotted' | 'double'
  color?: string
}

const TimelineConnector = React.forwardRef<HTMLDivElement, TimelineConnectorProps>(
  ({ direction = 'vertical', style = 'solid', color, className, ...props }, ref) => {
    const { theme } = useTheme()

    return (
      <div
        ref={ref}
        className={cn(
          "absolute",
          direction === 'vertical' && "w-0.5 h-full",
          direction === 'horizontal' && "h-0.5 w-full",
          className
        )}
        style={{
          backgroundColor: color || `hsl(${theme.colors.border.primary})`,
          borderStyle: style,
        }}
        {...props}
      />
    )
  }
)

TimelineConnector.displayName = 'TimelineConnector'

// =============================================================================
// 工具函数
// =============================================================================

/**
 * 生成分组时间线数据
 */
export const generateTimelineGroups = (
  items: TimelineItem[],
  groupBy: (item: TimelineItem) => string
): { title: string; items: TimelineItem[] }[] => {
  const groups: Record<string, TimelineItem[]> = {}

  items.forEach(item => {
    const group = groupBy(item)
    if (!groups[group]) {
      groups[group] = []
    }
    groups[group].push(item)
  })

  return Object.entries(groups).map(([title, items]) => ({
    title,
    items,
  }))
}

/**
 * 格式化时间
 */
export const formatTimelineTime = (
  time: string | Date,
  format: 'short' | 'medium' | 'long' = 'medium'
): string => {
  const date = typeof time === 'string' ? new Date(time) : time

  switch (format) {
    case 'short':
      return date.toLocaleDateString('zh-CN')
    case 'medium':
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    case 'long':
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    default:
      return date.toISOString()
  }
}

// =============================================================================
// 组件元数据
// =============================================================================

Timeline.displayName = 'Timeline'
TimelineItem.displayName = 'TimelineItem'

// =============================================================================
// 导出
// =============================================================================

export { Timeline, TimelineItem, TimelineDot, TimelineConnector, timelineVariants, timelineItemVariants }
export type { TimelineProps, TimelineItemProps, TimelineDotProps, TimelineConnectorProps }