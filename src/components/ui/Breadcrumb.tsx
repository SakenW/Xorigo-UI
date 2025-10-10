import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export interface BreadcrumbItem {
  label: string
  href?: string
  active?: boolean
  icon?: React.ReactNode
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
  className?: string
  maxItems?: number
  showHome?: boolean
}

/**
 * Breadcrumb - 面包屑导航组件
 * 用于显示当前页面在系统层级结构中的位置,并提供快速导航功能
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator,
  className = '',
  maxItems,
  showHome = true,
}) => {
  const defaultSeparator = (
    <svg
      className="shrink-0 h-5 w-5 text-gray-400 dark:text-gray-500"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  )

  const homeIcon = (
    <svg
      className="shrink-0 h-4 w-4 text-gray-500 dark:text-gray-400"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
  )

  // 处理最大显示数量
  let displayItems = items
  let hasEllipsis = false

  if (maxItems && items.length > maxItems) {
    hasEllipsis = true
    displayItems = [
      items[0],
      ...items.slice(items.length - (maxItems - 1)),
    ]
  }

  return (
    <nav className={cn('flex', className)} aria-label="面包屑导航">
      <ol className="flex items-center space-x-2">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1
          const isFirst = index === 0

          return (
            <React.Fragment key={index}>
              <motion.li
                className="flex items-center"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* 首页图标 */}
                {isFirst && showHome && (
                  <span className="mr-2">{homeIcon}</span>
                )}

                {/* 自定义图标 */}
                {item.icon && (
                  <span className="mr-2 shrink-0">{item.icon}</span>
                )}

                {/* 链接或文本 */}
                {item.href && !item.active && !isLast ? (
                  <motion.a
                    href={item.href}
                    className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.label}
                  </motion.a>
                ) : (
                  <span
                    className={cn(
                      'text-sm font-medium',
                      item.active || isLast
                        ? 'text-gray-900 dark:text-gray-100'
                        : 'text-gray-500 dark:text-gray-400'
                    )}
                  >
                    {item.label}
                  </span>
                )}
              </motion.li>

              {/* 分隔符 */}
              {!isLast && (
                <li className="flex items-center">
                  {separator || defaultSeparator}
                </li>
              )}

              {/* 省略号 */}
              {hasEllipsis && isFirst && displayItems.length > 1 && (
                <li className="flex items-center">
                  <span className="text-gray-400 dark:text-gray-500 px-2">
                    ...
                  </span>
                  <div className="flex items-center">
                    {separator || defaultSeparator}
                  </div>
                </li>
              )}
            </React.Fragment>
          )
        })}
      </ol>
    </nav>
  )
}

Breadcrumb.displayName = 'Breadcrumb'
