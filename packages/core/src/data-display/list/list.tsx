/**
 * List 列表组件 - 符合七轴主题系统 v1.4 SSOT
 *
 * 数据展示组件 - 灵活的列表布局和交互
 */

'use client'

import React, { useState } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../foundations/utils/cn'
import { useTheme, useThemeSafe } from '../../system/theme-provider'

// =============================================================================
// 组件变体系统 - CVA (Class Variance Authority)
// =============================================================================

const listVariants = cva(
  // 基础样式 - 使用七轴主题系统的密度令牌
  "w-full",
  {
    variants: {
      // 变体系统 - 使用七轴主题系统的颜色令牌
      variant: {
        default: "divide-y divide-border",
        bordered: "border border-border-base-base rounded-lg divide-y divide-border",
        flat: "space-y-1",
        card: "space-y-2",
        grid: "grid gap-4",
      },

      // 尺寸系统 - 使用七轴主题系统的密度令牌
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },

      // 布局方式
      layout: {
        vertical: "flex flex-col",
        horizontal: "flex flex-row overflow-x-auto",
        grid: "grid grid-cols-1",
      },

      // 交互状态
      interactive: {
        true: "",
        false: "",
      },

      // 响应式网格
      responsive: {
        none: "",
        sm: "grid-cols-1 sm:grid-cols-2",
        md: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        lg: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
      },

      // 内边距
      padding: {
        none: "",
        sm: "p-2",
        md: "p-4",
        lg: "p-6",
      },

      // 选择模式
      selection: {
        none: "",
        single: "",
        multiple: "",
      },
    },

    // 默认变体
    defaultVariants: {
      variant: 'default',
      size: 'md',
      layout: 'vertical',
      interactive: false,
      responsive: 'none',
      padding: 'none',
      selection: 'none',
    },
  }
)

const listItemVariants = cva(
  // 基础样式
  "relative flex items-center",
  {
    variants: {
      variant: {
        default: "p-4 hover:bg-accent-500-500-500/50 transition-colors",
        bordered: "p-4 border-b last:border-b-0 hover:bg-accent-500-500-500/50 transition-colors",
        flat: "p-3 rounded-md hover:bg-accent-500-500-500 transition-colors",
        card: "p-4 border border-border-base-base rounded-lg hover:shadow-md transition-shadow",
        grid: "flex flex-col p-4 border border-border-base-base rounded-lg hover:shadow-md transition-shadow",
      },

      size: {
        sm: "p-2 text-sm",
        md: "p-4 text-base",
        lg: "p-6 text-lg",
      },

      selected: {
        true: "bg-accent-500-500 text-text-on-accent",
        false: "",
      },

      disabled: {
        true: "opacity-50 cursor-not-allowed",
        false: "",
      },

      interactive: {
        true: "cursor-pointer",
        false: "",
      },
    },

    defaultVariants: {
      variant: 'default',
      size: 'md',
      selected: false,
      disabled: false,
      interactive: true,
    },
  }
)

// =============================================================================
// 组件 Props 接口 - 符合组件 API 标准
// =============================================================================

export interface ListProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof listVariants> {
  /**
   * 列表数据
   */
  items?: ListItemData[]

  /**
   * 自定义渲染函数
   */
  renderItem?: (item: ListItemData, index: number) => React.ReactNode

  /**
   * 空状态展示
   */
  empty?: React.ReactNode

  /**
   * 加载状态
   */
  loading?: boolean

  /**
   * 加载展示
   */
  loadingComponent?: React.ReactNode

  /**
   * 头部内容
   */
  header?: React.ReactNode

  /**
   * 底部内容
   */
  footer?: React.ReactNode

  /**
   * 虚拟滚动
   */
  virtual?: boolean

  /**
   * 项目高度（虚拟滚动）
   */
  itemHeight?: number

  /**
   * 容器高度（虚拟滚动）
   */
  height?: number

  /**
   * 选择回调
   */
  onSelectionChange?: (selectedItems: string[] | string) => void

  /**
   * 默认选中项
   */
  defaultSelected?: string[] | string

  /**
   * 子元素内容
   */
  children?: React.ReactNode
}

export interface ListItemData {
  /**
   * 唯一标识
   */
  id: string

  /**
   * 显示内容
   */
  content: React.ReactNode

  /**
   * 标题
   */
  title?: string

  /**
   * 描述
   */
  description?: string

  /**
   * 图标
   */
  icon?: React.ReactNode

  /**
   * 右侧操作区域
   */
  actions?: React.ReactNode

  /**
   * 元数据
   */
  meta?: React.ReactNode

  /**
   * 是否禁用
   */
  disabled?: boolean

  /**
   * 附加数据
   */
  data?: any
}

export interface ListItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'>,
    VariantProps<typeof listItemVariants> {
  /**
   * 列表项数据
   */
  item?: ListItemData

  /**
   * 是否选中
   */
  selected?: boolean

  /**
   * 选中值
   */
  value?: string

  /**
   * 点击回调
   */
  onClick?: (item: ListItemData) => void

  /**
   * 子元素内容
   */
  children?: React.ReactNode
}

// =============================================================================
// List 主组件实现
// =============================================================================

const List = React.forwardRef<HTMLDivElement, ListProps>(
  (
    {
      variant,
      size,
      layout,
      interactive,
      responsive,
      padding,
      selection,
      items = [],
      renderItem,
      empty,
      loading = false,
      loadingComponent,
      header,
      footer,
      virtual = false,
      itemHeight = 60,
      height = 400,
      onSelectionChange,
      defaultSelected,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const theme = useThemeSafe()
    const [selectedItems, setSelectedItems] = useState<string[]>(
      Array.isArray(defaultSelected) ? defaultSelected :
      defaultSelected ? [defaultSelected] : []
    )

    // 处理选择变更
    const handleSelectionChange = React.useCallback((itemId: string) => {
      let newSelected: string[]

      if (selection === 'single') {
        newSelected = [itemId]
      } else if (selection === 'multiple') {
        if (selectedItems.includes(itemId)) {
          newSelected = selectedItems.filter(id => id !== itemId)
        } else {
          newSelected = [...selectedItems, itemId]
        }
      } else {
        return
      }

      setSelectedItems(newSelected)

      if (selection === 'single') {
        onSelectionChange?.(newSelected[0])
      } else {
        onSelectionChange?.(newSelected)
      }
    }, [selectedItems, selection, onSelectionChange])

    // 生成主题相关的样式
    const themeStyles: React.CSSProperties = {
      ['--list-border' as any]: `var(--xor-border-primary)`,
      ['--list-bg' as any]: `var(--xor-bg-primary)`,
      ['--list-text' as any]: `var(--xor-text-primary)`,
      ['--list-hover' as any]: `var(--xor-accent-primary)`,
      ['--list-selected' as any]: `var(--xor-accent-primary)`,
      // 可根据七轴动态调整
    }

    // 渲染列表项
    const renderListItem = React.useCallback((item: ListItemData, index: number) => {
      const isSelected = selectedItems.includes(item.id)

      if (renderItem) {
        return renderItem(item, index)
      }

      return (
        <ListItem
          key={item.id}
          item={item}
          variant={variant === 'grid' ? 'grid' : variant}
          size={size}
          selected={isSelected}
          interactive={interactive}
          onClick={() => {
            if (selection !== 'none') {
              handleSelectionChange(item.id)
            }
          }}
        />
      )
    }, [variant, size, interactive, selection, selectedItems, renderItem, handleSelectionChange])

    // 空状态
    if (!loading && items.length === 0 && !children) {
      return (
        <div
          ref={ref}
          className={cn("flex flex-col items-center justify-center py-12 text-text-secondary-600", className)}
          style={themeStyles}
          {...props}
        >
          {empty || (
            <div className="text-center">
              <div className="text-lg font-medium mb-2">暂无数据</div>
              <div className="text-sm">没有找到相关内容</div>
            </div>
          )}
        </div>
      )
    }

    // 加载状态
    if (loading) {
      return (
        <div
          ref={ref}
          className={cn("flex items-center justify-center py-12", className)}
          style={themeStyles}
          {...props}
        >
          {loadingComponent || (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span>加载中...</span>
            </div>
          )}
        </div>
      )
    }

    // 虚拟滚动（简化实现）
    if (virtual && items.length > 0) {
      return (
        <div
          ref={ref}
          className={cn("overflow-hidden", className)}
          style={{
            height: `${height}px`,
            ...themeStyles
          }}
          {...props}
        >
          <div style={{ height: `${items.length * itemHeight}px`, position: 'relative' }}>
            {items.slice(0, Math.ceil(height / itemHeight) + 1).map((item, index) => (
              <div
                key={item.id}
                style={{ position: 'absolute', top: `${index * itemHeight}px`, width: '100%' }}
              >
                {renderListItem(item, index)}
              </div>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          listVariants({
            variant,
            size,
            layout,
            interactive,
            responsive: variant === 'grid' ? responsive : 'none',
            padding,
            selection,
          }),
          className
        )}
        style={themeStyles}
        {...props}
      >
        {/* 头部 */}
        {header && (
          <div className="mb-4">
            {header}
          </div>
        )}

        {/* 列表内容 */}
        {children || (
          <div className={variant === 'grid' ? '' : 'divide-y divide-border'}>
            {items.map(renderListItem)}
          </div>
        )}

        {/* 底部 */}
        {footer && (
          <div className="mt-4">
            {footer}
          </div>
        )}
      </div>
    )
  }
)

// =============================================================================
// ListItem 组件实现
// =============================================================================

const ListItem = React.forwardRef<HTMLDivElement, ListItemProps>(
  (
    {
      item,
      variant,
      size,
      selected,
      value,
      onClick,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const theme = useThemeSafe()

    const handleClick = React.useCallback(() => {
      if (item && onClick) {
        onClick(item)
      }
    }, [item, onClick])

    const themeStyles: React.CSSProperties = {
      ['--list-item-bg' as any]: selected ? `var(--xor-accent-primary)` : 'transparent',
      ['--list-item-text' as any]: selected ? `var(--xor-accent-foreground)` : `var(--xor-text-primary)`,
      ['--list-item-border' as any]: `var(--xor-border-primary)`,
    }

    if (children) {
      return (
        <div
          ref={ref}
          className={cn(
            listItemVariants({ variant, size, selected, interactive: !!onClick }),
            className
          )}
          style={themeStyles}
          onClick={handleClick}
          {...props}
        >
          {children}
        </div>
      )
    }

    if (!item) return null

    return (
      <div
        ref={ref}
        className={cn(
          listItemVariants({
            variant: variant === 'grid' ? 'grid' : variant,
            size,
            selected,
            disabled: item.disabled,
            interactive: !item.disabled && !!onClick,
          }),
          className
        )}
        style={themeStyles}
        onClick={handleClick}
        {...props}
      >
        {/* 图标 */}
        {item.icon && (
          <div className="flex-shrink-0 mr-3">
            {item.icon}
          </div>
        )}

        {/* 主要内容 */}
        <div className="flex-1 min-w-0">
          {item.title && (
            <div className="font-medium text-text-primary truncate">
              {item.title}
            </div>
          )}
          {item.description && (
            <div className="text-sm text-text-secondary-600 truncate mt-1">
              {item.description}
            </div>
          )}
          {item.content && !item.title && !item.description && (
            <div className="text-text-primary">
              {item.content}
            </div>
          )}
        </div>

        {/* 元数据 */}
        {item.meta && (
          <div className="flex-shrink-0 mr-3 text-sm text-text-secondary-600">
            {item.meta}
          </div>
        )}

        {/* 操作区域 */}
        {item.actions && (
          <div className="flex-shrink-0">
            {item.actions}
          </div>
        )}
      </div>
    )
  }
)

// =============================================================================
// 专用 List 组件
// =============================================================================

// ListGroup - 列表分组
export interface ListGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  children: React.ReactNode
}

export const ListGroup = React.forwardRef<HTMLDivElement, ListGroupProps>(
  ({ title, children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("mb-6", className)} {...props}>
        <div className="px-4 py-2 bg-background-primary-secondary/50 border-b border-border-base-base">
          <h3 className="text-sm font-medium text-text-secondary-600">{title}</h3>
        </div>
        <div>{children}</div>
      </div>
    )
  }
)

ListGroup.displayName = 'ListGroup'

// ListSeparator - 列表分隔符
export const ListSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("h-px bg-border my-2", className)}
        role="separator"
        {...props}
      />
    )
  }
)

ListSeparator.displayName = 'ListSeparator'

// =============================================================================
// 工具函数
// =============================================================================

/**
 * 生成分组列表数据
 */
export const generateGroupedItems = (
  items: ListItemData[],
  groupBy: (item: ListItemData) => string
): { title: string; items: ListItemData[] }[] => {
  const groups: Record<string, ListItemData[]> = {}

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
 * 过滤列表数据
 */
export const filterItems = (
  items: ListItemData[],
  query: string,
  fields: (keyof ListItemData)[] = ['title', 'description']
): ListItemData[] => {
  if (!query.trim()) return items

  const lowerQuery = query.toLowerCase()
  return items.filter(item =>
    fields.some(field => {
      const value = item[field]
      return typeof value === 'string' && value.toLowerCase().includes(lowerQuery)
    })
  )
}

// =============================================================================
// 组件元数据
// =============================================================================

List.displayName = 'List'
ListItem.displayName = 'ListItem'

// =============================================================================
// 导出
// =============================================================================

export { List, ListItem, listVariants, listItemVariants }
export type { ListProps, ListItemData, ListItemProps, ListGroupProps }

