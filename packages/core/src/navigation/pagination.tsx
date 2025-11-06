'use client'
import React, { forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from '../utils/cva-standalone'
import { useTheme } from '@xorigo-ui/system'
import { cn } from '../utils'

// 分页变体配置
const paginationVariants = cva(
  // 基础样式
  'flex items-center justify-between w-full',
  {
    variants: {
      variant: {
        default: 'gap-4',
        compact: 'gap-2',
        simple: 'gap-4 justify-center',
      },
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
      alignment: {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end',
        between: 'justify-between',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      alignment: 'between',
    },
  }
)

// 分页按钮变体
const paginationButtonVariants = cva(
  // 基础样式
  'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default: 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',
        primary: 'text-white bg-blue-500 hover:bg-blue-600 border border-blue-500',
        ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
      },
      size: {
        sm: 'px-2 py-1 min-h-8 text-xs',
        md: 'px-3 py-2 min-h-10 text-sm',
        lg: 'px-4 py-3 min-h-12 text-base',
      },
      active: {
        true: 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      active: false,
    },
  }
)

// 图标组件
const ChevronLeftIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
)

const ChevronRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

const DoubleChevronLeftIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
  </svg>
)

const DoubleChevronRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
  </svg>
)

// 分页项接口
export interface PaginationItem {
  type: 'page' | 'ellipsis' | 'prev' | 'next' | 'first' | 'last'
  value?: number
  disabled?: boolean
  active?: boolean
}

// 分页组件属性
export interface PaginationProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof paginationVariants> {
  /** 当前页码 */
  currentPage: number
  /** 总页数 */
  totalPages: number
  /** 页码变化回调 */
  onPageChange: (page: number) => void
  /** 每页条数 */
  pageSize?: number
  /** 总条数 */
  totalItems?: number
  /** 每页条数变化回调 */
  onPageSizeChange?: (size: number) => void
  /** 每页条数选项 */
  pageSizeOptions?: number[]
  /** 是否显示快速跳转 */
  showQuickJumper?: boolean
  /** 是否显示总数 */
  showTotal?: boolean
  /** 是否显示每页条数选择 */
  showPageSize?: boolean
  /** 最大显示页码按钮数 */
  maxPageButtons?: number
  /** 简化模式，只显示上一页/下一页 */
  simple?: boolean
  /** 自定义类名 */
  className?: string
}

// 页码按钮组件
const PageButton: React.FC<{
  item: PaginationItem
  variant: VariantProps<typeof paginationButtonVariants>['variant']
  size: VariantProps<typeof paginationButtonVariants>['size']
  onClick: () => void
}> = ({ item, variant, size, onClick }) => {
  const getIcon = () => {
    switch (item.type) {
      case 'prev':
        return <ChevronLeftIcon />
      case 'next':
        return <ChevronRightIcon />
      case 'first':
        return <DoubleChevronLeftIcon />
      case 'last':
        return <DoubleChevronRightIcon />
      case 'ellipsis':
        return '...'
      default:
        return item.value
    }
  }

  const isActive = item.active && item.type === 'page'
  const isDisabled = item.disabled || (item.type === 'ellipsis')

  if (item.type === 'ellipsis') {
    return (
      <motion.span
        className="px-3 py-2 text-gray-400 dark:text-gray-600 select-none"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        ...
      </motion.span>
    )
  }

  return (
    <motion.button
      type="button"
      disabled={isDisabled}
      onClick={onClick}
      className={cn(
        paginationButtonVariants({
          variant,
          size,
          active: isActive,
        })
      )}
      whileHover={!isDisabled ? { scale: 1.05 } : {}}
      whileTap={!isDisabled ? { scale: 0.95 } : {}}
      transition={{ duration: 0.2 }}
      aria-label={`Go to ${item.type === 'page' ? `page ${item.value}` : item.type}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {getIcon()}
    </motion.button>
  )
}

export const Pagination = forwardRef<HTMLDivElement, PaginationProps>(
  (
    {
      currentPage,
      totalPages,
      onPageChange,
      pageSize = 10,
      totalItems,
      onPageSizeChange,
      pageSizeOptions = [10, 20, 50, 100],
      showQuickJumper = false,
      showTotal = true,
      showPageSize = false,
      maxPageButtons = 7,
      simple = false,
      variant,
      size,
      alignment,
      className,
      ...props
    },
    ref
  ) => {
    const { themeConfig } = useTheme()
    const [jumpValue, setJumpValue] = React.useState('')

    // 生成页码项
    const generatePageItems = (): PaginationItem[] => {
      const items: PaginationItem[] = []

      if (simple) {
        // 简化模式，只显示上一页和下一页
        items.push(
          { type: 'prev', disabled: currentPage === 1 },
          { type: 'next', disabled: currentPage === totalPages }
        )
        return items
      }

      // 首页按钮
      items.push({ type: 'first', disabled: currentPage === 1 })

      // 上一页按钮
      items.push({ type: 'prev', disabled: currentPage === 1 })

      if (totalPages <= maxPageButtons) {
        // 总页数小于最大显示数，显示所有页码
        for (let i = 1; i <= totalPages; i++) {
          items.push({
            type: 'page',
            value: i,
            active: i === currentPage,
          })
        }
      } else {
        // 智能省略页码
        const half = Math.floor((maxPageButtons - 2) / 2)

        if (currentPage <= half) {
          // 当前页靠近开始
          for (let i = 1; i <= maxPageButtons - 1; i++) {
            items.push({
              type: 'page',
              value: i,
              active: i === currentPage,
            })
          }
          items.push({ type: 'ellipsis' })
          items.push({
            type: 'page',
            value: totalPages,
          })
        } else if (currentPage >= totalPages - half) {
          // 当前页靠近结束
          items.push({ type: 'page', value: 1 })
          items.push({ type: 'ellipsis' })
          for (let i = totalPages - (maxPageButtons - 2); i <= totalPages; i++) {
            items.push({
              type: 'page',
              value: i,
              active: i === currentPage,
            })
          }
        } else {
          // 当前页在中间
          items.push({ type: 'page', value: 1 })
          items.push({ type: 'ellipsis' })
          for (let i = currentPage - half; i <= currentPage + half; i++) {
            items.push({
              type: 'page',
              value: i,
              active: i === currentPage,
            })
          }
          items.push({ type: 'ellipsis' })
          items.push({
            type: 'page',
            value: totalPages,
          })
        }
      }

      // 下一页按钮
      items.push({ type: 'next', disabled: currentPage === totalPages })

      // 末页按钮
      items.push({ type: 'last', disabled: currentPage === totalPages })

      return items
    }

    // 处理页码点击
    const handlePageClick = (item: PaginationItem) => {
      if (item.disabled || item.type === 'ellipsis') return

      let targetPage = currentPage

      switch (item.type) {
        case 'page':
          targetPage = item.value!
          break
        case 'prev':
          targetPage = Math.max(1, currentPage - 1)
          break
        case 'next':
          targetPage = Math.min(totalPages, currentPage + 1)
          break
        case 'first':
          targetPage = 1
          break
        case 'last':
          targetPage = totalPages
          break
      }

      if (targetPage !== currentPage) {
        onPageChange(targetPage)
      }
    }

    // 处理快速跳转
    const handleQuickJump = () => {
      const page = parseInt(jumpValue)
      if (page >= 1 && page <= totalPages && page !== currentPage) {
        onPageChange(page)
        setJumpValue('')
      }
    }

    // 处理每页条数变化
    const handlePageSizeChange = (newSize: number) => {
      onPageSizeChange?.(newSize)
    }

    const pageItems = generatePageItems()

    return (
      <motion.div
        ref={ref}
        className={cn(paginationVariants({ variant, size, alignment }), className)}
        role="navigation"
        aria-label="分页导航"
        {...props}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-4">
          {/* 总数显示 */}
          {showTotal && totalItems !== undefined && (
            <motion.div
              className="text-sm text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              共 {totalItems} 条，第 {currentPage} / {totalPages} 页
            </motion.div>
          )}

          {/* 分页按钮 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`pagination-${currentPage}`}
              className="flex items-center gap-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {pageItems.map((item, index) => (
                <PageButton
                  key={`${item.type}-${item.value || index}`}
                  item={item}
                  variant={variant}
                  size={size}
                  onClick={() => handlePageClick(item)}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* 右侧控制区域 */}
          <div className="flex items-center gap-4">
            {/* 每页条数选择 */}
            {showPageSize && onPageSizeChange && (
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-sm text-gray-600 dark:text-gray-400">每页</span>
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  {pageSizeOptions.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <span className="text-sm text-gray-600 dark:text-gray-400">条</span>
              </motion.div>
            )}

            {/* 快速跳转 */}
            {showQuickJumper && (
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-sm text-gray-600 dark:text-gray-400">跳至</span>
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={jumpValue}
                  onChange={(e) => setJumpValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleQuickJump()}
                  className="w-16 px-2 py-1 text-sm text-center border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  placeholder="页"
                />
                <motion.button
                  type="button"
                  onClick={handleQuickJump}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  跳转
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    )
  }
)

Pagination.displayName = 'Pagination'
