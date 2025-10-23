/**
 * Breadcrumb 面包屑导航组件 - 符合七轴主题系统 v1.4 SSOT
 *
 * 导航组件 - 层级导航和路径指示
 */

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../foundations/utils/cn'
import { useTheme } from '../../system/theme-provider'

// =============================================================================
// 组件变体系统 - CVA (Class Variance Authority)
// =============================================================================

const breadcrumbVariants = cva(
  // 基础样式 - 使用七轴主题系统的密度令牌
  "flex items-center space-x-1 text-sm",
  {
    variants: {
      // 变体系统 - 使用七轴主题系统的颜色令牌
      variant: {
        default: "text-text-secondary-600",
        primary: "text-primary",
        secondary: "text-secondary-600-600-foreground",
        accent: "text-text-on-accent",
      },

      // 尺寸系统 - 使用七轴主题系统的密度令牌
      size: {
        sm: "text-xs space-x-0.5",
        md: "text-sm space-x-1",
        lg: "text-base space-x-2",
        xl: "text-lg space-x-3",
      },

      // 分隔符样式
      separator: {
        slash: "",
        chevron: "",
        arrow: "",
        dot: "",
        none: "",
      },

      // 分隔符位置
      separatorPosition: {
        after: "flex-row",
        before: "flex-row-reverse",
      },

      // 对齐方式
      align: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
      },

      // 是否可点击
      clickable: {
        true: "",
        false: "",
      },

      // 最大宽度控制
      truncate: {
        true: "truncate",
        false: "",
      },

      // 垂直布局
      vertical: {
        true: "flex-col space-y-1 space-x-0",
        false: "flex-row space-x-1 space-y-0",
      },

      // 响应式行为
      responsive: {
        none: "",
        mobile: "truncate sm:truncate-none",
        desktop: "hidden md:flex",
      },
    },

    // 默认变体
    defaultVariants: {
      variant: 'default',
      size: 'md',
      separator: 'slash',
      separatorPosition: 'after',
      align: 'start',
      clickable: true,
      truncate: false,
      vertical: false,
      responsive: 'none',
    },
  }
)

// =============================================================================
// 组件 Props 接口 - 符合组件 API 标准
// =============================================================================

export interface BreadcrumbProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof breadcrumbVariants> {
  /**
   * 面包屑项目列表
   */
  items?: BreadcrumbItem[]

  /**
   * 自定义分隔符
   */
  separatorIcon?: React.ReactNode

  /**
   * 首页图标/文本
   */
  homeIcon?: React.ReactNode

  /**
   * 是否显示首页
   */
  showHome?: boolean

  /**
   * 最大显示项目数
   */
  maxItems?: number

  /**
   * 是否在超出时显示省略号
   */
  showEllipsis?: boolean

  /**
   * 省略号文本
   */
  ellipsisText?: string

  /**
   * 自定义样式类名
   */
  className?: string
}

// =============================================================================
// BreadcrumbItem 接口
// =============================================================================

export interface BreadcrumbItem {
  /**
   * 显示文本
   */
  label: string

  /**
   * 链接地址
   */
  href?: string

  /**
   * 是否为当前页面
   */
  active?: boolean

  /**
   * 是否禁用
   */
  disabled?: boolean

  /**
   * 自定义图标
   */
  icon?: React.ReactNode

  /**
   * 点击回调
   */
  onClick?: () => void

  /**
   * ARIA 标签
   */
  ariaLabel?: string
}

// =============================================================================
// Breadcrumb 主组件实现
// =============================================================================

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      variant,
      size,
      separator,
      separatorPosition,
      align,
      clickable,
      truncate,
      vertical,
      responsive,
      items = [],
      separatorIcon,
      homeIcon,
      showHome = false,
      maxItems,
      showEllipsis = true,
      ellipsisText = "...",
      className,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme()

    // 生成分隔符组件
    const renderSeparator = React.useCallback(() => {
      if (separator === 'none') return null

      if (separatorIcon) {
        return <span className="flex-shrink-0">{separatorIcon}</span>
      }

      const separatorStyles = {
        color: `hsl(${theme.colors.text.muted})`,
        opacity: 0.7,
      }

      switch (separator) {
        case 'slash':
          return (
            <span className="flex-shrink-0" style={separatorStyles}>
              /
            </span>
          )
        case 'chevron':
          return (
            <svg
              className="flex-shrink-0 w-4 h-4"
              style={separatorStyles}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          )
        case 'arrow':
          return (
            <svg
              className="flex-shrink-0 w-4 h-4"
              style={separatorStyles}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          )
        case 'dot':
          return (
            <span
              className="flex-shrink-0 inline-block w-1 h-1 rounded-full"
              style={{
                backgroundColor: `hsl(${theme.colors.text.muted})`,
                opacity: 0.7,
              }}
            />
          )
        default:
          return null
      }
    }, [separator, separatorIcon, theme])

    // 处理项目显示逻辑
    const processedItems = React.useMemo(() => {
      let finalItems = [...items]

      // 添加首页项目
      if (showHome) {
        const homeItem: BreadcrumbItem = {
          label: "首页",
          href: "/",
          icon: homeIcon || (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          ),
        }
        finalItems = [homeItem, ...finalItems]
      }

      // 处理最大项目数限制
      if (maxItems && finalItems.length > maxItems) {
        const firstItems = finalItems.slice(0, Math.max(1, Math.floor(maxItems / 2)))
        const lastItems = finalItems.slice(-Math.floor(maxItems / 2))

        if (showEllipsis) {
          const ellipsisItem: BreadcrumbItem = {
            label: ellipsisText,
            active: false,
            disabled: true,
            ariaLabel: "更多项目",
          }
          return [...firstItems, ellipsisItem, ...lastItems]
        } else {
          return [...firstItems, ...lastItems]
        }
      }

      return finalItems
    }, [items, showHome, homeIcon, maxItems, showEllipsis, ellipsisText])

    // 渲染单个面包屑项目
    const renderBreadcrumbItem = React.useCallback((item: BreadcrumbItem, index: number) => {
      const isLast = index === processedItems.length - 1
      const isActive = item.active || isLast

      const itemContent = (
        <span className="inline-flex items-center space-x-1">
          {item.icon && (
            <span className="flex-shrink-0">
              {item.icon}
            </span>
          )}
          <span className={cn(
            truncate && "truncate",
            isActive && "font-medium text-text-primary",
            !isActive && clickable && !item.disabled && "hover:text-text-primary cursor-pointer",
            item.disabled && "opacity-50 cursor-not-allowed"
          )}>
            {item.label}
          </span>
        </span>
      )

      if (item.href && !item.disabled && !isActive) {
        return (
          <a
            key={index}
            href={item.href}
            className="inline-flex items-center transition-colors"
            onClick={(e) => {
              if (item.onClick) {
                e.preventDefault()
                item.onClick()
              }
            }}
            aria-label={item.ariaLabel}
            aria-current={isActive ? 'page' : undefined}
          >
            {itemContent}
          </a>
        )
      }

      if (item.onClick && !item.disabled && !isActive) {
        return (
          <button
            key={index}
            type="button"
            className="inline-flex items-center transition-colors bg-transparent border-0 cursor-pointer"
            onClick={item.onClick}
            aria-label={item.ariaLabel}
            aria-current={isActive ? 'page' : undefined}
          >
            {itemContent}
          </button>
        )
      }

      return (
        <span
          key={index}
          className="inline-flex items-center"
          aria-label={item.ariaLabel}
          aria-current={isActive ? 'page' : undefined}
        >
          {itemContent}
        </span>
      )
    }, [processedItems.length, truncate, clickable])

    // 生成主题相关的样式
    const themeStyles: React.CSSProperties = {
      '--breadcrumb-text': `hsl(${theme.colors.text.muted})`,
      '--breadcrumb-active': `hsl(${theme.colors.text.primary})`,
      '--breadcrumb-separator': `hsl(${theme.colors.text.muted})`,
      // 可根据七轴动态调整
    }

    return (
      <nav
        ref={ref}
        className={cn(
          breadcrumbVariants({
            variant,
            size,
            separator,
            separatorPosition,
            align,
            clickable,
            truncate,
            vertical,
            responsive,
          }),
          className
        )}
        style={themeStyles}
        aria-label="面包屑导航"
        {...props}
      >
        <ol className="inline-flex items-center space-x-1">
          {processedItems.map((item, index) => (
            <li key={index} className="inline-flex items-center">
              {renderBreadcrumbItem(item, index)}
              {/* 分隔符 */}
              {index < processedItems.length - 1 && (
                <span className="mx-1 flex-shrink-0">
                  {renderSeparator()}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    )
  }
)

// =============================================================================
// 专用 Breadcrumb 组件
// =============================================================================

// BreadcrumbItem - 单个面包屑项目组件
export interface BreadcrumbItemComponentProps extends BreadcrumbItem {
  as?: 'a' | 'button' | 'span'
}

export const BreadcrumbItemComponent = React.forwardRef<
  HTMLAnchorElement | HTMLButtonElement | HTMLSpanElement,
  BreadcrumbItemComponentProps
>(
  ({
    as: Component = 'span',
    label,
    href,
    active = false,
    disabled = false,
    icon,
    onClick,
    ariaLabel,
    className,
    ...props
  }, ref) => {
    const content = (
      <span className="inline-flex items-center space-x-1">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span className={cn(
          "truncate",
          active && "font-medium text-text-primary",
          !active && !disabled && "hover:text-text-primary cursor-pointer",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}>
          {label}
        </span>
      </span>
    )

    const commonProps = {
      ref,
      'aria-label': ariaLabel,
      'aria-current': active ? 'page' : undefined,
      ...props,
    }

    if (Component === 'a' && href && !disabled && !active) {
      return (
        <a
          href={href}
          className="inline-flex items-center transition-colors"
          onClick={onClick}
          {...commonProps}
        >
          {content}
        </a>
      )
    }

    if (Component === 'button' && onClick && !disabled && !active) {
      return (
        <button
          type="button"
          className="inline-flex items-center transition-colors bg-transparent border-0 cursor-pointer"
          onClick={onClick}
          {...commonProps}
        >
          {content}
        </button>
      )
    }

    return (
      <span
        className="inline-flex items-center"
        {...commonProps}
      >
        {content}
      </span>
    )
  }
)

BreadcrumbItemComponent.displayName = 'BreadcrumbItem'

// BreadcrumbSeparator - 分隔符组件
export interface BreadcrumbSeparatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode
}

export const BreadcrumbSeparator = React.forwardRef<HTMLSpanElement, BreadcrumbSeparatorProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn("mx-1 flex-shrink-0 text-text-secondary-600", className)}
        role="presentation"
        {...props}
      >
        {children || '/'}
      </span>
    )
  }
)

BreadcrumbSeparator.displayName = 'BreadcrumbSeparator'

// BreadcrumbEllipsis - 省略号组件
export interface BreadcrumbEllipsisProps extends React.HTMLAttributes<HTMLSpanElement> {
  label?: string
}

export const BreadcrumbEllipsis = React.forwardRef<HTMLSpanElement, BreadcrumbEllipsisProps>(
  ({ label = "...", className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn("text-text-secondary-600", className)}
        role="presentation"
        {...props}
      >
        {label}
      </span>
    )
  }
)

BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis'

// =============================================================================
// 工具函数
// =============================================================================

/**
 * 从路径生成面包屑项目
 */
export const generateBreadcrumbFromPath = (
  pathname: string,
  homeLabel: string = "首页",
  homeHref: string = "/"
): BreadcrumbItem[] => {
  const paths = pathname.split('/').filter(Boolean)
  const items: BreadcrumbItem[] = []

  // 添加首页
  items.push({
    label: homeLabel,
    href: homeHref,
    active: paths.length === 0,
  })

  // 生成路径项目
  let currentPath = ""
  paths.forEach((path, index) => {
    currentPath += `/${path}`
    const isLast = index === paths.length - 1

    items.push({
      label: decodeURIComponent(path).replace(/-/g, ' '),
      href: currentPath,
      active: isLast,
    })
  })

  return items
}

/**
 * 生成面包屑Schema.org结构化数据
 */
export const generateBreadcrumbSchema = (items: BreadcrumbItem[]) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      ...(item.href && { "item": item.href }),
    })),
  }

  return JSON.stringify(schema)
}

// =============================================================================
// 组件元数据
// =============================================================================

Breadcrumb.displayName = 'Breadcrumb'

// =============================================================================
// 导出
// =============================================================================

export { Breadcrumb, breadcrumbVariants }
export type { BreadcrumbProps, BreadcrumbItem }