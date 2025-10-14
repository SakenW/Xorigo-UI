import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const listVariants = cva(
  "rounded-lg border",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        outline: "border-2",
        ghost: "border-0",
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

const listItemVariants = cva(
  "flex items-center border-b last:border-b-0",
  {
    variants: {
      size: {
        sm: "px-3 py-2",
        md: "px-4 py-3",
        lg: "px-6 py-4",
      },
      hoverable: {
        true: "cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground",
        false: "",
      },
      selected: {
        true: "bg-accent text-accent-foreground",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      hoverable: false,
      selected: false,
    },
  }
)

export interface ListProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof listVariants> {
  children: React.ReactNode
}

export interface ListItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof listItemVariants> {
  leading?: React.ReactNode
  trailing?: React.ReactNode
  selected?: boolean
  hoverable?: boolean
}

const List = React.forwardRef<HTMLDivElement, ListProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <div
        className={cn(listVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

List.displayName = "List"

const ListItem = React.forwardRef<HTMLDivElement, ListItemProps>(
  ({
    className,
    size,
    hoverable,
    selected,
    leading,
    trailing,
    children,
    ...props
  }, ref) => {
    return (
      <div
        className={cn(listItemVariants({ size, hoverable, selected, className }))}
        ref={ref}
        {...props}
      >
        {leading && (
          <div className="flex items-center justify-center mr-3">
            {leading}
          </div>
        )}

        <div className="flex-1 min-w-0">
          {children}
        </div>

        {trailing && (
          <div className="flex items-center justify-center ml-3">
            {trailing}
          </div>
        )}
      </div>
    )
  }
)

ListItem.displayName = "ListItem"

// 便捷组件
export const ListHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn("px-4 py-3 border-b font-medium text-sm text-muted-foreground", className)}
    {...props}
  >
    {children}
  </div>
)

export const ListFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn("px-4 py-3 border-t text-sm text-muted-foreground", className)}
    {...props}
  >
    {children}
  </div>
)

export const ListSeparator: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn("border-b", className)}
    {...props}
  />
)

// 预设组件
export const SimpleList: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <List variant="ghost" className={cn("divide-y", className)} {...props}>
    {children}
  </List>
)

export const CardList: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <List variant="outline" className={cn("divide-y", className)} {...props}>
    {children}
  </List>
)

// 交互式列表组件
export interface InteractiveListItemProps extends Omit<ListItemProps, 'onClick'> {
  onClick?: () => void
}

export const InteractiveListItem: React.FC<InteractiveListItemProps> = ({
  onClick,
  className,
  ...props
}) => (
  <ListItem
    hoverable
    onClick={onClick}
    className={cn("cursor-pointer", className)}
    {...props}
  />
)

// 列表项类型
export interface ListDataItem {
  id: string | number
  title: string
  description?: string
  leading?: React.ReactNode
  trailing?: React.ReactNode
  disabled?: boolean
  onClick?: () => void
}

export interface ListFromDataProps extends Omit<ListProps, 'children'> {
  items: ListDataItem[]
  renderItem?: (item: ListDataItem, index: number) => React.ReactNode
}

export const ListFromData: React.FC<ListFromDataProps> = ({
  items,
  renderItem,
  className,
  size,
  variant,
  ...props
}) => {
  const defaultRenderItem = (item: ListDataItem, index: number) => (
    <InteractiveListItem
      key={item.id}
      size={size}
      leading={item.leading}
      trailing={item.trailing}
      onClick={item.disabled ? undefined : item.onClick}
      className={item.disabled ? "opacity-50 cursor-not-allowed" : ""}
    >
      <div>
        <div className="font-medium">{item.title}</div>
        {item.description && (
          <div className="text-sm text-muted-foreground">{item.description}</div>
        )}
      </div>
    </InteractiveListItem>
  )

  return (
    <List variant={variant} size={size} className={className} {...props}>
      {items.map((item, index) =>
        renderItem ? renderItem(item, index) : defaultRenderItem(item, index)
      )}
    </List>
  )
}

export { List, ListItem, listVariants as dataListVariants, listItemVariants as dataListItemVariants }