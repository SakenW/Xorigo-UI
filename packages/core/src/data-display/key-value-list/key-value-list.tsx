'use client'
/**
 * 📋 Key Value List · 键值列表组件 - v2025.11.04
 *
 * 用于展示键值对信息的组件，支持多种布局和交互功能
 *
 * @version 2025.11.04
 * @category Data Display
 * @layer component
 * @stability stable
 */

import React, { useState, useCallback, useMemo, forwardRef, isValidElement } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../utils/cn'
import { cva, type VariantProps } from '../../utils/cva-standalone'

// ===== 变体系统 =====
const keyValueListVariants = cva(
  "rounded-lg border",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border-border",
        outline: "border-2 border-border",
        ghost: "border-0",
        bordered: "border-2 border-border rounded-xl",
        filled: "bg-muted/30 border-border",
      },
      layout: {
        vertical: "space-y-1",
        horizontal: "grid grid-cols-2 gap-2",
        twoColumn: "grid grid-cols-2 gap-4",
        auto: "",
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },
      density: {
        compact: "py-1 px-2",
        normal: "py-2 px-3",
        spacious: "py-3 px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      layout: "vertical",
      size: "md",
      density: "normal",
    },
  }
)

const keyVariants = cva(
  "font-medium shrink-0",
  {
    variants: {
      size: {
        sm: "text-sm",
        md: "text-sm",
        lg: "text-base",
      },
      color: {
        default: "text-muted-foreground",
        muted: "text-muted-foreground/80",
        primary: "text-primary",
        success: "text-green-600",
        warning: "text-yellow-600",
        error: "text-red-600",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
    },
    defaultVariants: {
      size: "md",
      color: "default",
      align: "left",
    },
  }
)

const valueVariants = cva(
  "font-normal break-words",
  {
    variants: {
      size: {
        sm: "text-sm",
        md: "text-sm",
        lg: "text-base",
      },
      color: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        primary: "text-primary",
        success: "text-green-600",
        warning: "text-yellow-600",
        error: "text-red-600",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
    },
    defaultVariants: {
      size: "md",
      color: "default",
      align: "left",
    },
  }
)

const groupVariants = cva(
  "p-3",
  {
    variants: {
      variant: {
        default: "bg-muted/20 rounded-lg",
        outlined: "bg-transparent border border-border rounded-lg",
        none: "",
      },
      size: {
        sm: "p-2",
        md: "p-3",
        lg: "p-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

// ===== 类型定义 =====
export interface KeyValueItem {
  key: string
  value: string | number | React.ReactNode
  label?: string
  icon?: React.ReactNode
  copyable?: boolean
  editable?: boolean
  onEdit?: (value: string | number) => void
  onCopy?: (value: string | number) => void
  disabled?: boolean
  color?: 'default' | 'muted' | 'primary' | 'success' | 'warning' | 'error'
  hideWhenEmpty?: boolean
}

export interface KeyValueGroup {
  title?: string
  items: KeyValueItem[]
  collapsible?: boolean
  defaultExpanded?: boolean
  icon?: React.ReactNode
}

export interface KeyValueListProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof keyValueListVariants> {
  items?: KeyValueItem[]
  groups?: KeyValueGroup[]
  emptyText?: string
  loading?: boolean
  showDivider?: boolean
  alignItems?: 'flex-start' | 'center' | 'flex-end'
  valueAlign?: 'left' | 'center' | 'right'
  keyAlign?: 'left' | 'center' | 'right'
  copyable?: boolean
  copyAnimation?: boolean
  collapsibleGroups?: boolean
  allowEdit?: boolean
  onItemEdit?: (item: KeyValueItem, value: string | number) => void
  onItemCopy?: (item: KeyValueItem) => void
  className?: string
  children?: React.ReactNode
}

export interface KeyValueItemProps
  extends Omit<KeyValueItem, 'onEdit' | 'onCopy'>,
    VariantProps<typeof keyVariants>,
    VariantProps<typeof valueVariants> {
  alignItems?: 'flex-start' | 'center' | 'flex-end'
  showDivider?: boolean
  copyable?: boolean
  copyAnimation?: boolean
  onEdit?: (value: string | number) => void
  onCopy?: (value: string | number) => void
  isEditing?: boolean
  onSubmitEdit?: (value: string | number) => void
  onCancelEdit?: () => void
  layout?: 'vertical' | 'horizontal' | 'twoColumn' | 'auto'
  density?: 'compact' | 'normal' | 'spacious'
  className?: string
}

// ===== 内部组件 =====
const KeyValueItem = forwardRef<HTMLDivElement, KeyValueItemProps>(
  ({
    key: itemKey,
    value,
    label,
    icon,
    copyable = false,
    editable = false,
    disabled = false,
    color = 'default',
    hideWhenEmpty = false,
    size = 'md',
    keyAlign = 'left',
    valueAlign = 'left',
    alignItems = 'center',
    showDivider = true,
    copyAnimation = true,
    onEdit,
    onCopy,
    isEditing = false,
    onSubmitEdit,
    onCancelEdit,
    layout = 'vertical',
    density = 'normal',
    className,
    ...props
  }, ref) => {
    const [copied, setCopied] = useState(false)
    const [editValue, setEditValue] = useState(value.toString())
    const [isHovered, setIsHovered] = useState(false)

    // 检查是否应该隐藏
    const isEmpty = value === undefined || value === null || value === '' ||
                    (typeof value === 'number' && (isNaN(value) || value === 0))
    if (hideWhenEmpty && isEmpty) {
      return null
    }

    const displayValue = value?.toString() || ''

    const handleCopy = useCallback(async () => {
      if (!copyable || disabled) return

      try {
        await navigator.clipboard.writeText(displayValue)
        onCopy?.(value)
        setCopied(true)
        setTimeout(() => setCopied(false), copyAnimation ? 1000 : 0)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }, [copyable, disabled, displayValue, value, onCopy, copyAnimation])

    const handleEditSubmit = useCallback(() => {
      if (onSubmitEdit) {
        onSubmitEdit(editValue)
      } else {
        onEdit?.(editValue as any)
      }
    }, [editValue, onSubmitEdit, onEdit])

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleEditSubmit()
      } else if (e.key === 'Escape') {
        onCancelEdit?.()
        setEditValue(value.toString())
      }
    }, [handleEditSubmit, onCancelEdit, value])

    // 计算item样式
    const getItemStyles = useMemo(() => {
      const baseStyles = {
        vertical: 'flex flex-col space-y-1',
        horizontal: 'grid grid-cols-2 gap-2',
        twoColumn: 'grid grid-cols-2 gap-4',
        auto: 'flex',
      }
      return baseStyles[layout]
    }, [layout])

    // 计算align样式
    const getAlignStyles = useMemo(() => {
      const styles = {
        'flex-start': 'items-start',
        'center': 'items-center',
        'flex-end': 'items-end',
      }
      return styles[alignItems]
    }, [alignItems])

    // 渲染复制按钮
    const renderCopyButton = () => {
      if (!copyable) return null

      return (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isHovered || copied ? 1 : 0,
            scale: copied ? 1.1 : 1
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          disabled={disabled}
          className={cn(
            "p-1 rounded hover:bg-accent transition-colors",
            copied ? "text-green-600" : "text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary/20"
          )}
          aria-label="复制"
        >
          {copied ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
        </motion.button>
      )
    }

    // 渲染编辑按钮
    const renderEditButton = () => {
      if (!editable || disabled) return null

      return (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isHovered && !isEditing ? 1 : 0,
            scale: 1
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsHovered(false)}
          className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
          aria-label="编辑"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </motion.button>
      )
    }

    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "group relative",
          density === 'compact' && "py-1",
          density === 'normal' && "py-2",
          density === 'spacious' && "py-3",
          getItemStyles,
          getAlignStyles,
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {/* 键 */}
        <div className={cn(
          keyVariants({ size, color: 'default', align: keyAlign }),
          "flex items-center gap-2"
        )}>
          {icon && <span className="text-muted-foreground">{icon}</span>}
          <span className="truncate">{label || itemKey}</span>
        </div>

        {/* 值或编辑器 */}
        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex-1 flex items-center gap-2">
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleEditSubmit}
                autoFocus
                className={cn(
                  "flex-1 px-2 py-1 border border-border rounded",
                  "focus:outline-none focus:ring-2 focus:ring-primary/20",
                  "bg-background text-foreground"
                )}
                disabled={disabled}
              />
              <button
                onClick={handleEditSubmit}
                className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                aria-label="确认"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </button>
              <button
                onClick={() => {
                  onCancelEdit?.()
                  setEditValue(value.toString())
                }}
                className="p-1 text-muted-foreground hover:bg-accent rounded transition-colors"
                aria-label="取消"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ) : (
            <div className={cn(
              valueVariants({ size, color, align: valueAlign }),
              "flex-1 flex items-center gap-2 min-h-[1.5rem]"
            )}>
              {isValidElement(value) ? value : <span className="truncate">{value}</span>}
              {renderCopyButton()}
              {renderEditButton()}
            </div>
          )}
        </div>

        {/* 分隔线 */}
        {showDivider && (
          <div className="absolute bottom-0 left-0 right-0 h-px bg-border/50 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </motion.div>
    )
  }
)

KeyValueItem.displayName = "KeyValueItem"

const KeyValueGroup = forwardRef<HTMLDivElement, KeyValueGroupProps>(
  ({ title, items, collapsible = false, defaultExpanded = true, icon }, ref) => {
    const [expanded, setExpanded] = useState(defaultExpanded)
    const [visibleItems, setVisibleItems] = useState<KeyValueItem[]>([])

    React.useEffect(() => {
      const filtered = items.filter(item => {
        const isEmpty = item.value === undefined || item.value === null || item.value === '' ||
                       (typeof item.value === 'number' && (isNaN(item.value) || item.value === 0))
        return !item.hideWhenEmpty || !isEmpty
      })
      setVisibleItems(filtered)
    }, [items])

    return (
      <div ref={ref} className={cn(groupVariants({ variant: 'default', size: 'md' }))}>
        {(title || icon) && collapsible && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 w-full p-2 -m-2 rounded hover:bg-accent/50 transition-colors"
            aria-expanded={expanded}
          >
            {icon && <span className="text-muted-foreground">{icon}</span>}
            <h3 className="flex-1 text-left font-medium text-foreground">{title}</h3>
            <motion.svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              animate={{ rotate: expanded ? 180 : 0 }}
              className="text-muted-foreground"
            >
              <polyline points="6 9 12 15 18 9" />
            </motion.svg>
          </button>
        )}

        <AnimatePresence initial={false}>
          {(!collapsible || expanded) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-2 space-y-1">
                {visibleItems.map((item, index) => (
                  <KeyValueItem key={`${item.key}-${index}`} {...item} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

KeyValueGroup.displayName = "KeyValueGroup"

// ===== 主组件 =====
const KeyValueList = forwardRef<HTMLDivElement, KeyValueListProps>(
  ({
    items,
    groups,
    emptyText = "暂无数据",
    loading = false,
    showDivider = false,
    alignItems = 'center',
    valueAlign = 'left',
    keyAlign = 'left',
    copyable: globalCopyable = false,
    copyAnimation = true,
    collapsibleGroups = false,
    allowEdit = false,
    onItemEdit,
    onItemCopy,
    variant = 'default',
    layout = 'vertical',
    size = 'md',
    density = 'normal',
    className,
    children,
    ...props
  }, ref) => {
    const [editingItem, setEditingItem] = useState<string | null>(null)

    // 渲染加载状态
    if (loading) {
      return (
        <div
          ref={ref}
          className={cn(keyValueListVariants({ variant, layout, size, density, className }))}
          {...props}
        >
          <div className="space-y-3 p-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                <div className="h-5 bg-muted rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    // 渲染空状态
    const hasContent = (items && items.length > 0) || (groups && groups.length > 0) || React.Children.count(children) > 0
    if (!hasContent) {
      return (
        <div
          ref={ref}
          className={cn(keyValueListVariants({ variant, layout, size, density, className }))}
          {...props}
        >
          <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-2 opacity-50">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 3v18" />
            </svg>
            <p className="text-sm">{emptyText}</p>
          </div>
        </div>
      )
    }

    const handleItemEdit = useCallback((item: KeyValueItem, newValue: string | number) => {
      onItemEdit?.(item, newValue)
    }, [onItemEdit])

    const handleItemCopy = useCallback((item: KeyValueItem) => {
      onItemCopy?.(item)
    }, [onItemCopy])

    const handleStartEdit = useCallback((item: KeyValueItem) => {
      setEditingItem(item.key)
    }, [])

    const handleSubmitEdit = useCallback((item: KeyValueItem, newValue: string | number) => {
      handleItemEdit(item, newValue)
      setEditingItem(null)
    }, [handleItemEdit])

    const handleCancelEdit = useCallback(() => {
      setEditingItem(null)
    }, [])

    return (
      <div
        ref={ref}
        className={cn(keyValueListVariants({ variant, layout, size, density, className }))}
        role="list"
        {...props}
      >
        <div className="space-y-2">
          {/* 直接的子组件 */}
          {children}

          {/* 渲染组 */}
          {groups && groups.map((group, index) => (
            <KeyValueGroup
              key={`group-${index}`}
              {...group}
              collapsible={collapsibleGroups || group.collapsible}
            />
          ))}

          {/* 渲染项 */}
          {items && items.map((item, index) => (
            <KeyValueItem
              key={`${item.key}-${index}`}
              {...item}
              copyable={item.copyable ?? globalCopyable}
              editable={item.editable ?? allowEdit}
              onEdit={(value) => handleItemEdit(item, value)}
              onCopy={(value) => handleItemCopy(item)}
              isEditing={editingItem === item.key}
              onSubmitEdit={(value) => handleSubmitEdit(item, value)}
              onCancelEdit={handleCancelEdit}
              alignItems={alignItems}
              valueAlign={valueAlign}
              keyAlign={keyAlign}
              showDivider={showDivider}
              copyAnimation={copyAnimation}
            />
          ))}
        </div>
      </div>
    )
  }
)

KeyValueList.displayName = "KeyValueList"

// ===== 便捷组件 =====
const KeyValueListHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn("px-4 py-3 border-b border-border font-medium text-sm text-muted-foreground", className)}
    {...props}
  >
    {children}
  </div>
)

const KeyValueListFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn("px-4 py-3 border-t border-border text-sm text-muted-foreground", className)}
    {...props}
  >
    {children}
  </div>
)

const KeyValueListItem: React.FC<KeyValueItemProps> = (props) => (
  <KeyValueItem {...props} />
)

const KeyValueListGroup: React.FC<KeyValueGroupProps> = (props) => (
  <KeyValueGroup {...props} />
)

// ===== 预设样式组件 =====
const SimpleKeyValueList: React.FC<Omit<KeyValueListProps, 'variant'>> = (props) => (
  <KeyValueList variant="ghost" {...props} />
)

const CardKeyValueList: React.FC<Omit<KeyValueListProps, 'variant'>> = (props) => (
  <KeyValueList variant="outlined" {...props} />
)

const BorderedKeyValueList: React.FC<Omit<KeyValueListProps, 'variant'>> = (props) => (
  <KeyValueList variant="bordered" {...props} />
)

const FilledKeyValueList: React.FC<Omit<KeyValueListProps, 'variant'>> = (props) => (
  <KeyValueList variant="filled" {...props} />
)

export {
  KeyValueList,
  KeyValueItem,
  KeyValueGroup,
  KeyValueListHeader,
  KeyValueListFooter,
  SimpleKeyValueList,
  CardKeyValueList,
  BorderedKeyValueList,
  FilledKeyValueList,
  keyValueListVariants,
  keyVariants,
  valueVariants,
  groupVariants,
}

export type {
  KeyValueListProps,
  KeyValueItemProps,
  KeyValueGroupProps,
  KeyValueItem,
  KeyValueGroup,
}
