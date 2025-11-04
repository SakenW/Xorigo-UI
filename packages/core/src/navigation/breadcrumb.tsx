import React, { forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from '../utils/cva-standalone'
import { useTheme } from '@xorigo-ui/system'
import { cn } from '../utils'

// 面包屑项接口
export interface BreadcrumbItem {
  /** 标签内容 */
  label: React.ReactNode
  /** 链接地址 */
  href?: string
  /** 键值 */
  key: string
  /** 是否禁用 */
  disabled?: boolean
  /** 自定义图标 */
  icon?: React.ReactNode
  /** 点击事件 */
  onClick?: (event: React.MouseEvent) => void
}

// 面包屑变体配置
const breadcrumbVariants = cva(
  // 基础样式
  'flex items-center text-sm',
  {
    variants: {
      variant: {
        default: 'text-gray-600 dark:text-gray-400',
        primary: 'text-blue-600 dark:text-blue-400',
        secondary: 'text-gray-500 dark:text-gray-500',
        muted: 'text-gray-400 dark:text-gray-600',
      },
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
      separator: {
        slash: 'before:content-["/"]',
        arrow: 'before:content-["›"]',
        dot: 'before:content-["•"]',
        chevron: 'before:content-["›"]',
        none: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      separator: 'slash',
    },
  }
)

// 面包屑项变体
const breadcrumbItemVariants = cva(
  'transition-colors duration-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded',
  {
    variants: {
      variant: {
        default: 'hover:text-gray-900 dark:hover:text-gray-100',
        primary: 'hover:text-blue-700 dark:hover:text-blue-300',
        secondary: 'hover:text-gray-700 dark:hover:text-gray-300',
        muted: 'hover:text-gray-600 dark:hover:text-gray-400',
      },
      clickable: {
        true: 'cursor-pointer',
        false: 'cursor-default',
      },
      active: {
        true: 'font-medium text-gray-900 dark:text-gray-100',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      clickable: true,
      active: false,
    },
  }
)

// 分隔符组件
const Separator: React.FC<{ separator: VariantProps<typeof breadcrumbVariants>['separator'] }> = ({
  separator
}) => {
  const separatorMap = {
    slash: '/',
    arrow: '›',
    dot: '•',
    chevron: '›',
    none: '',
  }

  if (separator === 'none') return null

  return (
    <motion.span
      className="mx-2 text-gray-400 dark:text-gray-600 select-none"
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      {separatorMap[separator]}
    </motion.span>
  )
}

// 面包屑组件属性
export interface BreadcrumbProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'children'>,
    VariantProps<typeof breadcrumbVariants> {
  /** 面包屑项列表 */
  items: BreadcrumbItem[]
  /** 最大显示数量，超出部分会折叠 */
  maxItems?: number
  /** 自定义分隔符 */
  separator?: React.ReactNode
  /** 是否显示首页图标 */
  showHomeIcon?: boolean
  /** 首页图标 */
  homeIcon?: React.ReactNode
  /** 当前激活项的键值 */
  activeKey?: string
  /** 点击事件 */
  onItemClick?: (item: BreadcrumbItem, event: React.MouseEvent) => void
  /** 自定义类名 */
  className?: string
}

// 单个面包屑项组件
const BreadcrumbItemComponent: React.FC<{
  item: BreadcrumbItem
  variant: VariantProps<typeof breadcrumbVariants>['variant']
  isActive: boolean
  onClick?: (item: BreadcrumbItem, event: React.MouseEvent) => void
}> = ({ item, variant, isActive, onClick }) => {
  const handleClick = (event: React.MouseEvent) => {
    if (item.disabled) return
    item.onClick?.(event)
    onClick?.(item, event)
  }

  const itemContent = (
    <motion.span
      className={cn(
        breadcrumbItemVariants({
          variant,
          clickable: !item.disabled && (item.href || item.onClick),
          active: isActive
        }),
        item.disabled && 'opacity-50 cursor-not-allowed'
      )}
      whileHover={!item.disabled && (item.href || item.onClick) ? { scale: 1.05 } : {}}
      whileTap={!item.disabled && (item.href || item.onClick) ? { scale: 0.95 } : {}}
      transition={{ duration: 0.2 }}
    >
      {item.icon && (
        <span className="mr-1 inline-flex items-center">
          {item.icon}
        </span>
      )}
      {item.label}
    </motion.span>
  )

  if (item.href && !item.disabled) {
    return (
      <a
        href={item.href}
        onClick={handleClick}
        className="focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
      >
        {itemContent}
      </a>
    )
  }

  return (
    <span onClick={handleClick} role={item.href ? 'link' : 'text'}>
      {itemContent}
    </span>
  )
}

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      items,
      maxItems,
      variant,
      size,
      separator,
      showHomeIcon = false,
      homeIcon,
      activeKey,
      onItemClick,
      className,
      ...props
    },
    ref
  ) => {
    const { themeConfig } = useTheme()

    // 处理最大显示数量
    const getVisibleItems = () => {
      if (!maxItems || items.length <= maxItems) {
        return items
      }

      const showEllipsis = items.length > maxItems
      const visibleCount = Math.floor((maxItems - (showEllipsis ? 1 : 0)) / 2)

      const visibleItems = [
        ...items.slice(0, visibleCount),
        ...(showEllipsis ? [{
          key: 'ellipsis',
          label: '...',
          disabled: true
        } as BreadcrumbItem] : []),
        ...items.slice(-(maxItems - visibleCount - (showEllipsis ? 1 : 0)))
      ]

      return visibleItems
    }

    const visibleItems = getVisibleItems()

    return (
      <motion.nav
        ref={ref}
        className={cn(breadcrumbVariants({ variant, size }), className)}
        aria-label="面包屑导航"
        {...props}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          <motion.ol
            className="flex items-center space-x-0"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {/* 首页图标 */}
            {showHomeIcon && (
              <motion.li
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  visible: { opacity: 1, x: 0 }
                }}
                className="flex items-center"
              >
                <BreadcrumbItemComponent
                  item={{
                    key: 'home',
                    label: '首页',
                    href: '/',
                    icon: homeIcon || (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                    )
                  }}
                  variant={variant}
                  isActive={false}
                  onClick={onItemClick}
                />
                <Separator separator={separator} />
              </motion.li>
            )}

            {/* 面包屑项 */}
            {visibleItems.map((item, index) => {
              const isActive = activeKey === item.key || index === visibleItems.length - 1
              const isLast = index === visibleItems.length - 1

              return (
                <motion.li
                  key={item.key}
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  className="flex items-center"
                >
                  <BreadcrumbItemComponent
                    item={item}
                    variant={variant}
                    isActive={isActive}
                    onClick={onItemClick}
                  />
                  {!isLast && <Separator separator={separator} />}
                </motion.li>
              )
            })}
          </motion.ol>
        </AnimatePresence>
      </motion.nav>
    )
  }
)

Breadcrumb.displayName = 'Breadcrumb'
