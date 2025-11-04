import React from 'react'
import { cva, type VariantProps } from '../../utils/cva-standalone'
import { cn } from '../../utils/cn'

const timelineVariants = cva(
  "relative",
  {
    variants: {
      orientation: {
        vertical: "flex flex-col space-y-6",
        horizontal: "flex flex-row space-x-6",
      },
      variant: {
        default: "",
        simple: "",
        filled: "timeline-filled",
        bordered: "timeline-bordered",
      },
      density: {
        compact: "space-y-3",
        normal: "space-y-6",
        loose: "space-y-8",
      },
    },
    defaultVariants: {
      orientation: "vertical",
      variant: "default",
      density: "normal",
    },
  }
)

const timelineItemVariants = cva(
  "relative flex",
  {
    variants: {
      orientation: {
        vertical: "items-start",
        horizontal: "items-center",
      },
      align: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        alternate: "justify-start even:justify-end md:justify-center",
      },
      spacing: {
        compact: "",
        normal: "",
        loose: "",
      },
    },
    defaultVariants: {
      orientation: "vertical",
      align: "start",
      spacing: "normal",
    },
  }
)

const timelineMarkerVariants = cva(
  "flex-shrink-0 flex items-center justify-center border-2 rounded-full",
  {
    variants: {
      size: {
        sm: "w-6 h-6",
        md: "w-8 h-8",
        lg: "w-10 h-10",
      },
      variant: {
        default: "border-primary bg-background",
        primary: "border-primary bg-primary text-primary-foreground",
        success: "border-green-500 bg-green-500 text-white",
        warning: "border-yellow-500 bg-yellow-500 text-white",
        error: "border-red-500 bg-red-500 text-white",
        info: "border-blue-500 bg-blue-500 text-white",
        neutral: "border-gray-400 bg-gray-400 text-white",
      },
      dot: {
        true: "bg-current",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
      dot: false,
    },
  }
)

const timelineConnectorVariants = cva(
  "absolute",
  {
    variants: {
      orientation: {
        vertical: "left-1/2 top-8 -translate-x-1/2 w-0.5 h-[calc(100%-2rem)]",
        horizontal: "top-1/2 left-8 -translate-y-1/2 h-0.5 w-[calc(100%-2rem)]",
      },
      variant: {
        default: "bg-border",
        primary: "bg-primary/30",
        solid: "bg-primary",
      },
    },
    defaultVariants: {
      orientation: "vertical",
      variant: "default",
    },
  }
)

const timelineContentVariants = cva(
  "flex-1 min-w-0",
  {
    variants: {
      orientation: {
        vertical: "pl-6 pb-4",
        horizontal: "pt-6 pb-2",
      },
      align: {
        start: "text-left",
        center: "text-center",
        end: "text-right",
        alternate: "text-left even:text-right",
      },
      spacing: {
        compact: "pl-4 pt-2",
        normal: "pl-6 pt-4",
        loose: "pl-8 pt-6",
      },
    },
    defaultVariants: {
      orientation: "vertical",
      align: "start",
      spacing: "normal",
    },
  }
)

export interface TimelineProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineVariants> {
  children: React.ReactNode
}

export interface TimelineItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineItemVariants> {
  children: React.ReactNode
  isLast?: boolean
}

export interface TimelineMarkerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineMarkerVariants> {
  children?: React.ReactNode
  icon?: React.ReactNode
}

export interface TimelineConnectorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineConnectorVariants> {
  isLast?: boolean
  hidden?: boolean
}

export interface TimelineContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineContentVariants> {
  children: React.ReactNode
}

export interface TimelineHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export interface TimelineBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export interface TimelineDateProps extends React.HTMLAttributes<HTMLTimeElement> {
  children: React.ReactNode
}

export interface TimelineItemData {
  id: string | number
  date: string | Date
  title: string
  description?: string
  icon?: React.ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'
  dot?: boolean
  collapsible?: boolean
  collapsed?: boolean
  children?: TimelineItemData[]
}

export interface TimelineFromDataProps
  extends Omit<TimelineProps, 'children'> {
  items: TimelineItemData[]
  renderItem?: (item: TimelineItemData, index: number) => React.ReactNode
}

const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  ({ className, orientation, variant, density, children, ...props }, ref) => {
    return (
      <div
        className={cn(timelineVariants({ orientation, variant, density, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Timeline.displayName = "Timeline"

const TimelineItem = React.forwardRef<HTMLDivElement, TimelineItemProps>(
  ({ className, orientation, align, spacing, children, isLast, ...props }, ref) => {
    return (
      <div
        className={cn(timelineItemVariants({ orientation, align, spacing, className }))}
        ref={ref}
        {...props}
      >
        {children}
        {!isLast && <TimelineConnector orientation={orientation} />}
      </div>
    )
  }
)

TimelineItem.displayName = "TimelineItem"

const TimelineMarker = React.forwardRef<HTMLDivElement, TimelineMarkerProps>(
  ({ className, size, variant, dot, children, icon, ...props }, ref) => {
    return (
      <div
        className={cn(timelineMarkerVariants({ size, variant, dot, className }))}
        ref={ref}
        {...props}
      >
        {dot ? null : icon || children}
      </div>
    )
  }
)

TimelineMarker.displayName = "TimelineMarker"

const TimelineConnector = React.forwardRef<HTMLDivElement, TimelineConnectorProps>(
  ({ className, orientation, variant, isLast, hidden, ...props }, ref) => {
    if (isLast || hidden) {
      return null
    }

    return (
      <div
        className={cn(timelineConnectorVariants({ orientation, variant, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

TimelineConnector.displayName = "TimelineConnector"

const TimelineContent = React.forwardRef<HTMLDivElement, TimelineContentProps>(
  ({ className, orientation, align, spacing, children, ...props }, ref) => {
    return (
      <div
        className={cn(timelineContentVariants({ orientation, align, spacing, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

TimelineContent.displayName = "TimelineContent"

const TimelineHeader = React.forwardRef<HTMLDivElement, TimelineHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn("font-semibold text-foreground", className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

TimelineHeader.displayName = "TimelineHeader"

const TimelineBody = React.forwardRef<HTMLDivElement, TimelineBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn("text-sm text-muted-foreground mt-1", className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

TimelineBody.displayName = "TimelineBody"

const TimelineDate = React.forwardRef<HTMLTimeElement, TimelineDateProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <time
        className={cn("text-xs font-medium text-muted-foreground", className)}
        ref={ref as any}
        {...props}
      >
        {children}
      </time>
    )
  }
)

TimelineDate.displayName = "TimelineDate"

// 便捷组件
const TimelineTitle: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn("text-sm font-semibold text-foreground", className)}
    {...props}
  >
    {children}
  </div>
)

const TimelineDescription: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn("text-sm text-muted-foreground mt-1", className)}
    {...props}
  >
    {children}
  </div>
)

// 折叠支持的时间线项组件
const CollapsibleTimelineItem: React.FC<TimelineItemProps & {
  title: React.ReactNode
  defaultCollapsed?: boolean
}> = ({
  title,
  defaultCollapsed = false,
  children,
  ...props
}) => {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed)

  return (
    <TimelineItem {...props}>
      <TimelineMarker>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-2 h-2 rounded-full bg-current"
        />
      </TimelineMarker>
      <TimelineContent>
        <div className="cursor-pointer" onClick={() => setCollapsed(!collapsed)}>
          {title}
        </div>
        {!collapsed && <div className="mt-2">{children}</div>}
      </TimelineContent>
    </TimelineItem>
  )
}

// 从数据生成时间线
const TimelineFromData: React.FC<TimelineFromDataProps> = ({
  items,
  renderItem,
  className,
  orientation,
  variant,
  density,
  ...props
}) => {
  const defaultRenderItem = (item: TimelineItemData, index: number) => (
    <TimelineItem key={item.id} orientation={orientation} align="alternate">
      <TimelineMarker variant={item.variant} dot={item.dot}>
        {item.icon}
      </TimelineMarker>
      <TimelineContent>
        <TimelineDate>
          {typeof item.date === 'string' ? item.date : item.date.toLocaleDateString()}
        </TimelineDate>
        <TimelineTitle>{item.title}</TimelineTitle>
        {item.description && (
          <TimelineDescription>{item.description}</TimelineDescription>
        )}
        {item.collapsible && (
          <CollapsibleTimelineItem
            title={<TimelineTitle>{item.title}</TimelineTitle>}
            defaultCollapsed={item.collapsed}
          >
            {item.children?.map((child) => (
              <div key={child.id} className="mt-2">
                <TimelineDate>
                  {typeof child.date === 'string' ? child.date : child.date.toLocaleDateString()}
                </TimelineDate>
                <TimelineTitle>{child.title}</TimelineTitle>
                {child.description && (
                  <TimelineDescription>{child.description}</TimelineDescription>
                )}
              </div>
            ))}
          </CollapsibleTimelineItem>
        )}
      </TimelineContent>
    </TimelineItem>
  )

  return (
    <Timeline
      orientation={orientation}
      variant={variant}
      density={density}
      className={className}
      {...props}
    >
      {items.map((item, index) =>
        renderItem ? renderItem(item, index) : defaultRenderItem(item, index)
      )}
    </Timeline>
  )
}

// 加载状态
export const TimelineSkeleton: React.FC<Omit<TimelineProps, 'children'>> = ({
  orientation = 'vertical',
  density = 'normal',
  className,
  ...props
}) => {
  return (
    <Timeline orientation={orientation} density={density} className={className} {...props}>
      {Array.from({ length: 3 }).map((_, i) => (
        <TimelineItem key={i} orientation={orientation}>
          <TimelineMarker>
            <div className="w-3 h-3 rounded-full bg-muted-foreground/20 animate-pulse" />
          </TimelineMarker>
          <TimelineContent>
            <div className="h-4 bg-muted-foreground/20 rounded animate-pulse w-1/3 mb-2" />
            <div className="h-3 bg-muted-foreground/20 rounded animate-pulse w-2/3" />
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}

// 空状态
export const TimelineEmpty: React.FC<Omit<TimelineProps, 'children'> & {
  message?: string
}> = ({
  message = "暂无时间线数据",
  className,
  ...props
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)} {...props}>
      <div className="text-muted-foreground text-sm">{message}</div>
    </div>
  )
}

export {
  Timeline,
  TimelineItem,
  TimelineMarker,
  TimelineConnector,
  TimelineContent,
  TimelineHeader,
  TimelineBody,
  TimelineDate,
  TimelineTitle,
  TimelineDescription,
  TimelineFromData,
  CollapsibleTimelineItem,
  timelineVariants,
  timelineItemVariants,
  timelineMarkerVariants,
  timelineConnectorVariants,
  timelineContentVariants,
}
