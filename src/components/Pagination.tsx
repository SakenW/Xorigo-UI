import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../utils/cn'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  pageSize?: number
  totalItems?: number
  onPageSizeChange?: (size: number) => void
  pageSizeOptions?: number[]
  showQuickJumper?: boolean
  showTotal?: boolean
  showPageSize?: boolean
  maxPageButtons?: number
  className?: string
}

export const Pagination: React.FC<PaginationProps> = ({
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
  className,
}) => {
  const [jumpValue, setJumpValue] = React.useState('')

  const handleJump = () => {
    const page = parseInt(jumpValue)
    if (page >= 1 && page <= totalPages) {
      onPageChange(page)
      setJumpValue('')
    }
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = []

    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      const leftOffset = Math.floor((maxPageButtons - 3) / 2)
      const rightOffset = maxPageButtons - 3 - leftOffset

      if (currentPage <= leftOffset + 2) {
        for (let i = 1; i <= maxPageButtons - 2; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - rightOffset - 1) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - maxPageButtons + 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - leftOffset; i <= currentPage + rightOffset; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      {/* 总数显示 */}
      {showTotal && totalItems !== undefined && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          共 {totalItems} 条
        </div>
      )}

      {/* 分页按钮 */}
      <div className="flex items-center gap-2">
        {/* 首页 */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={cn(
            'p-2 rounded-md transition-colors',
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          )}
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* 上一页 */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            'p-2 rounded-md transition-colors',
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          )}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* 页码 */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-1 text-gray-600 dark:text-gray-400"
                >
                  ...
                </span>
              )
            }

            const isActive = page === currentPage

            return (
              <motion.button
                key={page}
                onClick={() => onPageChange(page as number)}
                className={cn(
                  'min-w-[2.5rem] px-3 py-1 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
                whileHover={{ scale: isActive ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {page}
              </motion.button>
            )
          })}
        </div>

        {/* 下一页 */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            'p-2 rounded-md transition-colors',
            currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          )}
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* 末页 */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={cn(
            'p-2 rounded-md transition-colors',
            currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          )}
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        {/* 每页数量选择 */}
        {showPageSize && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">每页</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-600 dark:text-gray-400">条</span>
          </div>
        )}

        {/* 快速跳转 */}
        {showQuickJumper && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">跳至</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={jumpValue}
              onChange={(e) => setJumpValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJump()}
              className="w-16 px-2 py-1 text-sm text-center border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">页</span>
            <button
              onClick={handleJump}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              跳转
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Pagination
