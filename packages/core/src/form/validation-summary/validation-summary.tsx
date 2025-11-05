import React, { forwardRef, useId, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from '../../utils/cva-standalone'
import { cn } from '../../utils'
import {
  AlertCircle,
  XCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  X,
  ChevronDown,
  ChevronRight,
  Hash,
  ArrowRight,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react'

// ==============================
// Variants
// ==============================

const validationSummaryVariants = cva(
  // 基础样式
  "rounded-lg border p-4 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-red-200 bg-red-50 dark:border-red-800/50 dark:bg-red-900/20",
        destructive: "border-red-200 bg-red-50 dark:border-red-800/50 dark:bg-red-900/20",
        warning: "border-yellow-200 bg-yellow-50 dark:border-yellow-800/50 dark:bg-yellow-900/20",
        info: "border-blue-200 bg-blue-50 dark:border-blue-800/50 dark:bg-blue-900/20",
        success: "border-green-200 bg-green-50 dark:border-green-800/50 dark:bg-green-900/20",
      },
      size: {
        sm: "text-sm p-3",
        md: "text-sm p-4",
        lg: "text-base p-5",
      },
      severity: {
        critical: "border-l-4 border-l-red-600 dark:border-l-red-400",
        major: "border-l-4 border-l-yellow-600 dark:border-l-yellow-400",
        minor: "border-l-4 border-l-blue-600 dark:border-l-blue-400",
      },
      layout: {
        list: "space-y-2",
        grouped: "space-y-4",
        compact: "space-y-1",
      },
    },
    defaultVariants: {
      variant: "destructive",
      size: "md",
      severity: "major",
      layout: "list",
    },
  }
)

const headerIconVariants = cva(
  "flex-shrink-0",
  {
    variants: {
      variant: {
        default: "text-red-600 dark:text-red-400",
        destructive: "text-red-600 dark:text-red-400",
        warning: "text-yellow-600 dark:text-yellow-400",
        info: "text-blue-600 dark:text-blue-400",
        success: "text-green-600 dark:text-green-400",
      },
      size: {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
      },
    },
    defaultVariants: {
      variant: "destructive",
      size: "md",
    },
  }
)

const fieldItemVariants = cva(
  "flex items-start gap-2 rounded-md p-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors",
  {
    variants: {
      severity: {
        critical: "border-l-2 border-l-red-600 dark:border-l-red-400",
        major: "border-l-2 border-l-yellow-600 dark:border-l-yellow-400",
        minor: "border-l-2 border-l-blue-600 dark:border-l-blue-400",
      },
      size: {
        sm: "text-sm",
        md: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      severity: 'minor',
      size: 'md',
    },
  }
)

// ==============================
// Types
// ==============================

export interface ValidationSummaryItem {
  /** 字段唯一标识 */
  id: string
  /** 字段名称 */
  name?: string
  /** 字段标签 */
  label?: string
  /** 错误消息 */
  message: string
  /** 错误状态 */
  status?: 'error' | 'warning' | 'info'
  /** 严重程度 */
  severity?: 'critical' | 'major' | 'minor'
  /** 错误代码 */
  code?: string
  /** 分组名称 */
  group?: string
  /** 关联的输入元素ID */
  fieldId?: string
  /** 自定义图标 */
  icon?: React.ReactNode
  /** 附加数据 */
  metadata?: Record<string, any>
}

export interface ValidationSummaryProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof validationSummaryVariants> {
  /** 校验结果项目列表 */
  items?: ValidationSummaryItem[]
  /** 是否显示 */
  visible?: boolean
  /** 汇总标题 */
  title?: string
  /** 是否显示图标 */
  showIcon?: boolean
  /** 自定义图标 */
  icon?: React.ReactNode
  /** 错误计数文本模板 */
  countTemplate?: string
  /** 可关闭状态 */
  dismissible?: boolean
  /** 关闭回调 */
  onDismiss?: () => void
  /** 跳转到字段回调 */
  onNavigateToField?: (item: ValidationSummaryItem) => void
  /** 复制错误摘要回调 */
  onCopyErrors?: (text: string) => void
  /** 分组模式 */
  grouped?: boolean
  /** 展开所有分组 */
  expanded?: boolean
  /** 默认展开分组 */
  defaultExpandedGroups?: string[]
  /** 展开状态改变回调 */
  onExpandedGroupsChange?: (groups: string[]) => void
  /** 折叠图标 */
  expandIcon?: React.ReactNode
  /** 收起图标 */
  collapseIcon?: React.ReactNode
  /** 隐藏空状态 */
  hideWhenEmpty?: boolean
  /** 隐藏计数 */
  hideCount?: boolean
  /** 最大显示项目数（0表示不限制） */
  maxItems?: number
  /** 显示更多回调 */
  onShowMore?: () => void
  /** 显示更多文本 */
  showMoreText?: string
  /** 自动滚动到组件 */
  autoScroll?: boolean
  /** 滚动偏移 */
  scrollOffset?: number
  /** 复制按钮文本 */
  copyButtonText?: string
  /** 跳转到字段文本 */
  navigateButtonText?: string
  /** 禁用跳转功能 */
  disableNavigation?: boolean
  /** ID */
  id?: string
}

// ==============================
// Helper Functions
// ==============================

const getStatusIcon = (
  status?: ValidationSummaryItem['status'],
  severity?: ValidationSummaryItem['severity'],
  size: number = 16
) => {
  const iconProps = {
    size,
    className: headerIconVariants({
      variant: status === 'error' || !status ? 'destructive' : status,
      size: size <= 14 ? 'sm' : size >= 20 ? 'lg' : 'md'
    })
  }

  if (severity === 'critical') {
    return <XCircle {...iconProps} />
  }

  switch (status) {
    case 'warning':
      return <AlertTriangle {...iconProps} />
    case 'info':
      return <Info {...iconProps} />
    case 'error':
    default:
      return <AlertCircle {...iconProps} />
  }
}

const getItemIcon = (
  status?: ValidationSummaryItem['status'],
  severity?: ValidationSummaryItem['severity'],
  size: number = 14
) => {
  const iconProps = {
    size,
    className: headerIconVariants({
      variant: status === 'error' || !status ? 'destructive' : status,
      size: size <= 12 ? 'sm' : size >= 18 ? 'lg' : 'md'
    })
  }

  if (severity === 'critical') {
    return <XCircle {...iconProps} />
  }

  switch (status) {
    case 'warning':
      return <AlertTriangle {...iconProps} />
    case 'info':
      return <Info {...iconProps} />
    case 'error':
    default:
      return <AlertCircle {...iconProps} />
  }
}

const groupItemsByGroup = (items: ValidationSummaryItem[]) => {
  const grouped = new Map<string, ValidationSummaryItem[]>()

  items.forEach(item => {
    const groupKey = item.group || 'default'
    if (!grouped.has(groupKey)) {
      grouped.set(groupKey, [])
    }
    grouped.get(groupKey)!.push(item)
  })

  return grouped
}

const copyErrorsToClipboard = async (items: ValidationSummaryItem[]) => {
  const text = items
    .map(item => {
      const label = item.label || item.name || item.id
      return `${label}: ${item.message}`
    })
    .join('\n')

  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy errors:', error)
    return false
  }
}

// ==============================
// Animation Variants
// ==============================

const animationVariants = {
  enter: {
    opacity: 0,
    y: -10,
    height: 0,
  },
  center: {
    opacity: 1,
    y: 0,
    height: 'auto',
  },
  exit: {
    opacity: 0,
    y: -10,
    height: 0,
  },
}

const itemAnimationVariants = {
  enter: {
    opacity: 0,
    x: -10,
  },
  center: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: 10,
  },
}

// ==============================
// ValidationSummaryItem Component
// ==============================

const ValidationSummaryItemComponent = forwardRef<
  HTMLDivElement,
  {
    item: ValidationSummaryItem
    size: ValidationSummaryProps['size']
    severity: ValidationSummaryProps['severity']
    onNavigate?: (item: ValidationSummaryItem) => void
    disableNavigation?: boolean
  }
>(({ item, size, severity, onNavigate, disableNavigation }, ref) => {
  const canNavigate = !disableNavigation && (onNavigate || item.fieldId)
  const itemSeverity = item.severity || severity

  return (
    <motion.div
      ref={ref}
      initial="enter"
      animate="center"
      exit="exit"
      variants={itemAnimationVariants}
      transition={{ duration: 0.2 }}
      className={fieldItemVariants({
        severity: itemSeverity,
        size,
      })}
    >
      {/* 图标 */}
      {item.icon || getItemIcon(item.status, item.severity, size === 'sm' ? 12 : size === 'lg' ? 16 : 14)}

      {/* 内容 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            {/* 字段标签和错误消息 */}
            <div className="space-y-0.5">
              {(item.label || item.name) && (
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {item.label || item.name}
                </p>
              )}
              <p className="text-sm text-gray-900 dark:text-gray-100">
                {item.message}
              </p>
            </div>

            {/* 错误代码 */}
            {item.code && (
              <span className="inline-block mt-1 text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {item.code}
              </span>
            )}
          </div>

          {/* 跳转按钮 */}
          {canNavigate && (
            <button
              type="button"
              onClick={() => onNavigate?.(item)}
              className={cn(
                "flex-shrink-0 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                {
                  'cursor-not-allowed opacity-50': disableNavigation,
                }
              )}
              aria-label={`跳转到字段: ${item.label || item.name || item.id}`}
              disabled={disableNavigation}
            >
              <ArrowRight
                size={12}
                className={cn(
                  headerIconVariants({
                    variant: item.status === 'error' || !item.status ? 'destructive' : item.status,
                    size: 'sm',
                  })
                )}
              />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
})

ValidationSummaryItemComponent.displayName = 'ValidationSummaryItemComponent'

// ==============================
// ValidationSummaryGroup Component
// ==============================

const ValidationSummaryGroup = forwardRef<
  HTMLDivElement,
  {
    groupName: string
    items: ValidationSummaryItem[]
    expanded: boolean
    onToggle: () => void
    size: ValidationSummaryProps['size']
    severity: ValidationSummaryProps['severity']
    onNavigate?: (item: ValidationSummaryItem) => void
    disableNavigation?: boolean
    expandIcon?: React.ReactNode
    collapseIcon?: React.ReactNode
  }
>(({ groupName, items, expanded, onToggle, size, severity, onNavigate, disableNavigation, expandIcon, collapseIcon }, ref) => {
  const isDefaultGroup = groupName === 'default'

  return (
    <div ref={ref} className="space-y-2">
      {/* 分组标题 */}
      {!isDefaultGroup && (
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center gap-2 w-full text-left group"
        >
          <div className="flex items-center gap-2 flex-1">
            {/* 折叠/展开图标 */}
            <div className="transition-transform duration-200" style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
              {expandIcon || <ChevronRight size={14} className="text-gray-600 dark:text-gray-400" />}
            </div>
            <Hash size={14} className="text-gray-600 dark:text-gray-400" />
            <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-gray-100">
              {groupName}
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({items.length})
            </span>
          </div>
        </button>
      )}

      {/* 分组内容 */}
      <AnimatePresence>
        {(expanded || isDefaultGroup) && (
          <motion.div
            initial="enter"
            animate="center"
            exit="exit"
            variants={animationVariants}
            transition={{ duration: 0.2 }}
            className="space-y-1"
          >
            {items.map((item, index) => (
              <ValidationSummaryItemComponent
                key={item.id || index}
                item={item}
                size={size}
                severity={severity}
                onNavigate={onNavigate}
                disableNavigation={disableNavigation}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

ValidationSummaryGroup.displayName = 'ValidationSummaryGroup'

// ==============================
// ValidationSummary Component
// ==============================

export const ValidationSummary = forwardRef<HTMLDivElement, ValidationSummaryProps>(({
  className,
  variant,
  size,
  severity = 'major',
  layout = 'list',
  items = [],
  visible = true,
  title = '校验错误',
  showIcon = true,
  icon,
  countTemplate = '{count} 个错误',
  dismissible = false,
  onDismiss,
  onNavigateToField,
  onCopyErrors,
  grouped = false,
  expanded = false,
  defaultExpandedGroups,
  onExpandedGroupsChange,
  expandIcon,
  collapseIcon,
  hideWhenEmpty = true,
  hideCount = false,
  maxItems = 0,
  onShowMore,
  showMoreText = '显示更多',
  autoScroll = false,
  scrollOffset = 0,
  copyButtonText = '复制错误',
  navigateButtonText = '跳转到字段',
  disableNavigation = false,
  id,
  ...props
}, ref) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(defaultExpandedGroups || (grouped ? ['default'] : []))
  )
  const [copied, setCopied] = useState(false)
  const [isExpanded, setIsExpanded] = useState(expanded)

  const generatedId = useId()
  const componentId = id || `validation-summary-${generatedId}`

  // 计算最终显示的项目
  const displayItems = maxItems > 0 ? items.slice(0, maxItems) : items
  const remainingCount = Math.max(0, items.length - displayItems.length)

  // 分组
  const groupedItems = grouped ? groupItemsByGroup(displayItems) : null

  // 自动滚动
  useEffect(() => {
    if (autoScroll && items.length > 0 && visible) {
      const element = document.getElementById(componentId)
      if (element) {
        const offset = scrollOffset || 0
        const elementTop = element.getBoundingClientRect().top + window.pageYOffset
        window.scrollTo({
          top: elementTop - offset,
          behavior: 'smooth'
        })
      }
    }
  }, [items, visible, autoScroll, scrollOffset, componentId])

  // 处理展开/折叠
  const handleToggleGroup = (groupName: string) => {
    const newExpandedGroups = new Set(expandedGroups)
    if (newExpandedGroups.has(groupName)) {
      newExpandedGroups.delete(groupName)
    } else {
      newExpandedGroups.add(groupName)
    }
    setExpandedGroups(newExpandedGroups)
    onExpandedGroupsChange?.(Array.from(newExpandedGroups))
  }

  // 处理复制
  const handleCopy = async () => {
    const success = await copyErrorsToClipboard(displayItems)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      onCopyErrors?.('Errors copied to clipboard')
    }
  }

  // 处理跳转到字段
  const handleNavigateToField = (item: ValidationSummaryItem) => {
    if (onNavigateToField) {
      onNavigateToField(item)
    } else if (item.fieldId) {
      const element = document.getElementById(item.fieldId)
      if (element) {
        element.focus()
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }

  // 空状态
  if (!visible || (hideWhenEmpty && items.length === 0)) {
    return null
  }

  // 合并状态变体
  const finalVariant = variant || (items.some(item => item.severity === 'critical') ? 'destructive' : 'default')

  // 获取状态图标
  const statusIcon = icon || getStatusIcon('error', severity, size === 'sm' ? 16 : size === 'lg' ? 24 : 20)

  return (
    <motion.div
      ref={ref}
      id={componentId}
      role="alert"
      aria-live="polite"
      aria-label={title}
      className={cn(
        validationSummaryVariants({ variant: finalVariant, size, severity, layout }),
        className
      )}
      initial="enter"
      animate="center"
      exit="exit"
      variants={animationVariants}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {/* 头部 */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          {/* 图标 */}
          {showIcon && statusIcon && (
            <div className="mt-0.5">
              {statusIcon}
            </div>
          )}

          {/* 标题和计数 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h3>
              {!hideCount && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white/50 dark:bg-black/20 text-gray-700 dark:text-gray-300">
                  {countTemplate.replace('{count}', String(items.length))}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center gap-2">
          {/* 复制按钮 */}
          {items.length > 0 && (
            <button
              type="button"
              onClick={handleCopy}
              className={cn(
                "inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md",
                "bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-black/30",
                "text-gray-700 dark:text-gray-300",
                "transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              )}
              aria-label="复制错误消息"
            >
              {copied ? (
                <>
                  <CheckCircle2 size={12} />
                  <span>已复制</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>{copyButtonText}</span>
                </>
              )}
            </button>
          )}

          {/* 关闭按钮 */}
          {dismissible && onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className={cn(
                "inline-flex items-center justify-center w-6 h-6 rounded-md",
                "hover:bg-white/50 dark:hover:bg-black/20",
                "transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              )}
              aria-label="关闭错误汇总"
            >
              <X size={14} className="text-gray-600 dark:text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* 错误列表 */}
      {items.length > 0 && (
        <div className={cn(
          "mt-3",
          {
            'space-y-1': layout === 'list',
            'space-y-3': layout === 'grouped',
            'space-y-0.5': layout === 'compact',
          }
        )}>
          {grouped && groupedItems ? (
            // 分组模式
            Array.from(groupedItems.entries()).map(([groupName, groupItems]) => (
              <ValidationSummaryGroup
                key={groupName}
                groupName={groupName}
                items={groupItems}
                expanded={expandedGroups.has(groupName)}
                onToggle={() => handleToggleGroup(groupName)}
                size={size}
                severity={severity}
                onNavigate={handleNavigateToField}
                disableNavigation={disableNavigation}
                expandIcon={expandIcon}
                collapseIcon={collapseIcon}
              />
            ))
          ) : (
            // 列表模式
            <AnimatePresence mode="popLayout">
              {displayItems.map((item, index) => (
                <ValidationSummaryItemComponent
                  key={item.id || index}
                  item={item}
                  size={size}
                  severity={severity}
                  onNavigate={handleNavigateToField}
                  disableNavigation={disableNavigation}
                />
              ))}
            </AnimatePresence>
          )}

          {/* 显示更多按钮 */}
          {remainingCount > 0 && onShowMore && (
            <motion.button
              type="button"
              onClick={onShowMore}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn(
                "flex items-center gap-1 w-full p-2 text-sm",
                "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100",
                "hover:bg-white/30 dark:hover:bg-black/20 rounded-md transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              )}
            >
              <span>{showMoreText}</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-white/30 dark:bg-black/20">
                +{remainingCount}
              </span>
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  )
})

ValidationSummary.displayName = 'ValidationSummary'

export { validationSummaryVariants, headerIconVariants, fieldItemVariants }
