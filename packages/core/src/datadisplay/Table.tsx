import React, { useState, useMemo } from 'react'
import { cn } from '../utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion, AnimatePresence } from 'framer-motion'

const tableVariants = cva(
  "w-full border-collapse bg-white text-sm text-gray-900 dark:bg-gray-800 dark:text-gray-100",
  {
    variants: {
      variant: {
        default: "",
        striped: "[&_tr:nth-child(even)]:bg-gray-50 [&_tr:nth-child(even)]:dark:bg-gray-700",
        bordered: "border border-gray-200 dark:border-gray-700",
      },
      size: {
        sm: "[&_td]:px-2 [&_th]:px-2 [&_td]:py-1 [&_th]:py-1 text-xs",
        md: "[&_td]:px-4 [&_th]:px-4 [&_td]:py-2 [&_th]:py-2 text-sm",
        lg: "[&_td]:px-6 [&_th]:px-6 [&_td]:py-3 [&_th]:py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface TableProps
  extends React.TableHTMLAttributes<HTMLTableElement>,
    VariantProps<typeof tableVariants> {
  data?: any[]
  columns?: TableColumn[]
  sortable?: boolean
  selectable?: boolean
  pagination?: boolean
  pageSize?: number
  onSort?: (column: string, direction: 'asc' | 'desc') => void
  onSelectionChange?: (selectedRows: any[]) => void
  emptyState?: React.ReactNode
  loading?: boolean
}

export interface TableColumn {
  key: string
  title: string
  sortable?: boolean
  width?: string
  render?: (value: any, row: any, index: number) => React.ReactNode
  align?: 'left' | 'center' | 'right'
}

export interface SortConfig {
  key: string
  direction: 'asc' | 'desc'
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({
    className,
    variant,
    size,
    data = [],
    columns,
    sortable = false,
    selectable = false,
    pagination = false,
    pageSize = 10,
    onSort,
    onSelectionChange,
    emptyState,
    loading = false,
    children,
    ...props
  }, ref) => {
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)
    const [selectedRows, setSelectedRows] = useState<any[]>([])
    const [currentPage, setCurrentPage] = useState(1)

    // 处理排序
    const handleSort = (column: TableColumn) => {
      if (!sortable || !column.sortable) return

      const direction = sortConfig?.key === column.key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
      setSortConfig({ key: column.key, direction })
      onSort?.(column.key, direction)
    }

    // 处理选择
    const handleSelectRow = (row: any, checked: boolean) => {
      const newSelection = checked
        ? [...selectedRows, row]
        : selectedRows.filter(r => r !== row)

      setSelectedRows(newSelection)
      onSelectionChange?.(newSelection)
    }

    const handleSelectAll = (checked: boolean) => {
      const newSelection = checked ? paginatedData : []
      setSelectedRows(newSelection)
      onSelectionChange?.(newSelection)
    }

    // 排序数据
    const sortedData = useMemo(() => {
      if (!sortConfig || !data) return data

      return [...data].sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]

        if (aValue === bValue) return 0

        const comparison = aValue > bValue ? 1 : -1
        return sortConfig.direction === 'asc' ? comparison : -comparison
      })
    }, [data, sortConfig])

    // 分页数据
    const paginatedData = useMemo(() => {
      if (!pagination) return sortedData

      const start = (currentPage - 1) * pageSize
      const end = start + pageSize
      return sortedData.slice(start, end)
    }, [sortedData, currentPage, pageSize, pagination])

    const totalPages = Math.ceil(sortedData.length / pageSize)

    // 渲染表格内容
    const renderTableContent = () => {
      if (children) {
        return children
      }

      if (loading) {
        return (
          <tbody>
            <tr>
              <td colSpan={columns?.length || 1} className="px-4 py-8 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                  <span>加载中...</span>
                </div>
              </td>
            </tr>
          </tbody>
        )
      }

      if (paginatedData.length === 0) {
        return (
          <tbody>
            <tr>
              <td colSpan={columns?.length || 1} className="px-4 py-8 text-center text-gray-500">
                {emptyState || "暂无数据"}
              </td>
            </tr>
          </tbody>
        )
      }

      return (
        <tbody>
          <AnimatePresence>
            {paginatedData.map((row, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={cn(
                  "hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
                  selectedRows.includes(row) && "bg-blue-50 dark:bg-blue-900/20"
                )}
              >
                {selectable && (
                  <td className="w-12 px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row)}
                      onChange={(e) => handleSelectRow(row, e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                )}
                {columns?.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      "px-4 py-2",
                      column.align === 'center' && "text-center",
                      column.align === 'right' && "text-right"
                    )}
                  >
                    {column.render ? column.render(row[column.key], row, index) : row[column.key]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      )
    }

    return (
      <div className="space-y-4">
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table
            ref={ref}
            className={tableVariants({ variant, size, className })}
            {...props}
          >
            {columns && (
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  {selectable && (
                    <th className="w-12 px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                  )}
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={cn(
                        "px-4 py-2 text-left font-medium text-gray-900 dark:text-gray-100",
                        column.align === 'center' && "text-center",
                        column.align === 'right' && "text-right",
                        sortable && column.sortable && "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}
                      style={{ width: column.width }}
                      onClick={() => handleSort(column)}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.title}</span>
                        {sortable && column.sortable && (
                          <div className="flex flex-col">
                            <svg
                              className={cn(
                                "h-3 w-3",
                                sortConfig?.key === column.key && sortConfig.direction === 'asc'
                                  ? "text-blue-600"
                                  : "text-gray-400"
                              )}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            <svg
                              className={cn(
                                "h-3 w-3 -mt-1",
                                sortConfig?.key === column.key && sortConfig.direction === 'desc'
                                  ? "text-blue-600"
                                  : "text-gray-400"
                              )}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            {renderTableContent()}
          </table>
        </div>

        {/* 分页 */}
        {pagination && totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              显示 {((currentPage - 1) * pageSize) + 1} 到 {Math.min(currentPage * pageSize, sortedData.length)} 条，
              共 {sortedData.length} 条记录
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                上一页
              </button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        "px-3 py-1 text-sm border rounded-md",
                        currentPage === page
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                      )}
                    >
                      {page}
                    </button>
                  )
                })}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }
)

Table.displayName = "Table"

export { Table, tableVariants }