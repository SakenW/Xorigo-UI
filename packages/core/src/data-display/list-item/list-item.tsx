import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from '../../utils/cva-standalone'
import { cn } from '../../utils/cn'

const listItemVariants = cva(
  "relative flex items-center gap-3 transition-all duration-200",
  {
    variants: {
      density: {
        compact: "px-3 py-2 text-sm",
        regular: "px-4 py-3 text-sm",
        spacious: "px-6 py-4 text-base",
      },
      interactive: {
        hoverable: "cursor-pointer hover:bg-accent/50 rounded-md",
        clickable: "cursor-pointer active:bg-accent/80 rounded-md",
        static: "",
      },
      selected: {
        true: "bg-accent text-accent-foreground",
        false: "",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed pointer-events-none",
        false: "",
      },
    },
    defaultVariants: {
      density: "regular",
      interactive: "static",
      selected: false,
      disabled: false,
    },
  }
)

const avatarVariants = cva(
  "flex-shrink-0 rounded-full overflow-hidden flex items-center justify-center",
  {
    variants: {
      size: {
        sm: "h-6 w-6 text-xs",
        md: "h-8 w-8 text-sm",
        lg: "h-10 w-10 text-base",
        xl: "h-12 w-12 text-lg",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

const iconVariants = cva(
  "flex-shrink-0 flex items-center justify-center",
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6",
        xl: "h-7 w-7",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

const badgeVariants = cva(
  "flex-shrink-0 flex items-center justify-center rounded-full font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        outline: "border border-input",
        destructive: "bg-destructive text-destructive-foreground",
        success: "bg-green-500 text-white",
        warning: "bg-yellow-500 text-white",
      },
      size: {
        sm: "h-4 w-4 text-xs min-w-[1rem]",
        md: "h-5 w-5 text-xs min-w-[1.25rem]",
        lg: "h-6 w-6 text-sm min-w-[1.5rem]",
        xl: "h-7 w-7 text-sm min-w-[1.75rem]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface ListItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'>,
    VariantProps<typeof listItemVariants> {
  // 头像
  avatar?: React.ReactNode
  avatarSize?: 'sm' | 'md' | 'lg' | 'xl'

  // 图标
  icon?: React.ReactNode
  iconSize?: 'sm' | 'md' | 'lg' | 'xl'

  // 徽章
  badge?: React.ReactNode
  badgeVariant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning'
  badgeSize?: 'sm' | 'md' | 'lg' | 'xl'

  // 内容区域
  title: React.ReactNode
  description?: React.ReactNode
  multiline?: boolean

  // 辅助文本
  caption?: React.ReactNode

  // 操作区域
  actions?: React.ReactNode

  // 状态指示
  indicator?: React.ReactNode

  // 拖拽支持
  draggable?: boolean
  onDragStart?: React.DragEventHandler<HTMLDivElement>
  onDragEnd?: React.DragEventHandler<HTMLDivElement>
  onDragOver?: React.DragEventHandler<HTMLDivElement>
  onDrop?: React.DragEventHandler<HTMLDivElement>

  // 交互
  onClick?: () => void
  onDoubleClick?: () => void

  // 选择相关
  selectable?: boolean
  onSelectionChange?: (selected: boolean) => void

  // 悬停内容
  hoverContent?: React.ReactNode
  showHoverContent?: boolean
}

const ListItem = React.forwardRef<HTMLDivElement, ListItemProps>(
  (
    {
      className,
      density,
      interactive,
      selected,
      disabled,
      avatar,
      avatarSize = 'md',
      icon,
      iconSize = 'md',
      badge,
      badgeVariant,
      badgeSize = 'md',
      title,
      description,
      multiline = false,
      caption,
      actions,
      indicator,
      draggable = false,
      onDragStart,
      onDragEnd,
      onDragOver,
      onDrop,
      onClick,
      onDoubleClick,
      selectable = false,
      onSelectionChange,
      hoverContent,
      showHoverContent = false,
      children,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false)
    const [isSelected, setIsSelected] = useState(false)

    const handleClick = () => {
      if (disabled) return
      if (onClick) onClick()
      if (selectable) {
        const newSelected = !isSelected
        setIsSelected(newSelected)
        onSelectionChange?.(newSelected)
      }
    }

    const handleDoubleClick = () => {
      if (disabled) return
      if (onDoubleClick) onDoubleClick()
    }

    const handleDragStart: React.DragEventHandler<HTMLDivElement> = (e) => {
      if (disabled) return
      if (draggable) {
        e.dataTransfer.effectAllowed = 'move'
      }
      onDragStart?.(e)
    }

    const handleDragEnd: React.DragEventHandler<HTMLDivElement> = (e) => {
      if (disabled) return
      onDragEnd?.(e)
    }

    const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
      if (disabled) return
      e.preventDefault()
      onDragOver?.(e)
    }

    const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
      if (disabled) return
      e.preventDefault()
      onDrop?.(e)
    }

    const shouldShowHoverContent = showHoverContent && hoverContent && isHovered

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.15 }}
        className={cn(
          listItemVariants({
            density,
            interactive: onClick || interactive === 'hoverable' || interactive === 'clickable' ? interactive : 'static',
            selected: selected || isSelected,
            disabled,
            className,
          })
        )}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        draggable={draggable}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        {...props}
      >
        {/* 状态指示器 */}
        {indicator && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r" />
        )}

        {/* 选择框 */}
        {selectable && (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => {
                const checked = e.target.checked
                setIsSelected(checked)
                onSelectionChange?.(checked)
              }}
              onClick={(e) => e.stopPropagation()}
              className="h-4 w-4 rounded border-input text-primary focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        )}

        {/* 头像或图标 */}
        <AnimatePresence mode="wait">
          {avatar ? (
            <motion.div
              key="avatar"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={avatarVariants({ size: avatarSize })}
            >
              {avatar}
            </motion.div>
          ) : icon ? (
            <motion.div
              key="icon"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={iconVariants({ size: iconSize })}
            >
              {icon}
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* 主内容区域 */}
        <div className={cn(
          "flex-1 min-w-0",
          multiline ? "block" : "flex flex-col gap-1"
        )}>
          <div className="flex items-center gap-2">
            <div className={cn(
              "font-medium truncate",
              !multiline && "text-sm",
              multiline && "text-sm"
            )}>
              {title}
            </div>

            {/* 徽章 */}
            {badge && (
              <span className={badgeVariants({ variant: badgeVariant, size: badgeSize })}>
                {badge}
              </span>
            )}
          </div>

          {/* 描述文本 */}
          {description && (
            <div className={cn(
              "text-muted-foreground truncate",
              !multiline && "text-xs",
              multiline && "text-sm"
            )}>
              {description}
            </div>
          )}

          {/* 辅助文本 */}
          {caption && (
            <div className="text-xs text-muted-foreground">
              {caption}
            </div>
          )}

          {/* 多行内容 */}
          {multiline && children && (
            <div className="text-sm text-muted-foreground">
              {children}
            </div>
          )}
        </div>

        {/* 悬停内容 */}
        <AnimatePresence>
          {shouldShowHoverContent && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
              className="flex-shrink-0"
            >
              {hoverContent}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 操作按钮 */}
        {actions && !shouldShowHoverContent && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </motion.div>
    )
  }
)

ListItem.displayName = "ListItem"

export { ListItem, listItemVariants, avatarVariants, iconVariants, badgeVariants }
