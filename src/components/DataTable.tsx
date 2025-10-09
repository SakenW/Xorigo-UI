import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../utils/cn'

// 类型定义
export interface TableColumn<T = any> {
  key: keyof T
  title: string
  width?: string
  sortable?: boolean
  render?: (value: any, record: T, index: number) => React.ReactNode
  align?: 'left' | 'center' | 'right'
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[]
  data: T[]
  loading?: boolean
  pagination?: {
    current: number
    pageSize: number
    total: number
    onChange?: (page: number, pageSize: number) => void
  }
  rowSelection?: {
    selectedRowKeys?: React.Key[]
    onChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void
  }
  size?: 'small' | 'middle' | 'large'
  bordered?: boolean
  className?: string
}

// 排序配置
interface SortConfig {
  key: string
  direction: 'asc' | 'desc'
}

// 分页组件
const Pagination: React.FC<{
  current: number
  pageSize: number
  total: number
  onChange?: (page: number, pageSize: number) => void
}> = ({ current, pageSize, total, onChange }) => {
  const totalPages = Math.ceil(total / pageSize)

  const handlePageChange = (page: number) => {
    onChange?.(page, pageSize)
  }

  return (
    <div className="flex items-center justify-between py-4 px-4">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        显示第 {(current - 1) * pageSize + 1} - {Math.min(current * pageSize, total)} 条，共 {total} 条
      </div>

      <div className="flex items-center space-x-1">
        <motion.button
          onClick={() => handlePageChange(current - 1)}
          disabled={current <= 1}
          className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
          whileHover={{ scale: current > 1 ? 1.05 : 1 }}
          whileTap={{ scale: current > 1 ? 0.95 : 1 }}
        >
          上一页
        </motion.button>

        <div className="flex space-x-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum
            if (totalPages <= 5) {
              pageNum = i + 1
            } else if (current <= 3) {
              pageNum = i + 1
            } else if (current >= totalPages - 2) {
              pageNum = totalPages - 4 + i
            } else {
              pageNum = current - 2 + i
            }

            return (
              <motion.button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={cn(
                  'px-3 py-1 rounded-md text-sm',
                  current === pageNum
                    ? 'bg-blue-500 text-white'
                    : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {pageNum}
              </motion.button>
            )
          })}
        </div>

        <motion.button
          onClick={() => handlePageChange(current + 1)}
          disabled={current >= totalPages}
          className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
          whileHover={{ scale: current < totalPages ? 1.05 : 1 }}
          whileTap={{ scale: current < totalPages ? 0.95 : 1 }}
        >
          下一页
        </motion.button>
      </div>
    </div>
  )
}

// 主表格组件
export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  pagination,
  rowSelection,
  size = 'middle',
  bordered = false,
  className = '',
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)
  const [selectedRows, setSelectedRows] = useState<React.Key[]>(
    rowSelection?.selectedRowKeys || []
  )

  // 排序处理
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  // 选择行处理
  const handleSelectRow = (key: React.Key, record: T, checked: boolean) => {
    const newSelected = checked
      ? [...selectedRows, key]
      : selectedRows.filter((k) => k !== key)
    setSelectedRows(newSelected)
    rowSelection?.onChange?.(
      newSelected,
      data.filter((item) => newSelected.includes(item.id || item.key))
    )
  }

  // 全选处理
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allKeys = data.map((item) => item.id || item.key).filter(Boolean)
      setSelectedRows(allKeys)
      rowSelection?.onChange?.(allKeys, data)
    } else {
      setSelectedRows([])
      rowSelection?.onChange?.([], [])
    }
  }

  // 排序后的数据
  const processedData = useMemo(() => {
    let result = [...data]

    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof T]
        const bValue = b[sortConfig.key as keyof T]

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }

    return result
  }, [data, sortConfig])

  const sizeClasses = {
    small: 'text-xs',
    middle: 'text-sm',
    large: 'text-base',
  }

  const isAllSelected = selectedRows.length === data.length && data.length > 0

  return (
    <motion.div
      className={cn('bg-white dark:bg-gray-800 rounded-lg shadow-sm', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 表格内容 */}
      <div className="overflow-x-auto">
        <table className={cn('w-full', sizeClasses[size])}>
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              {/* 选择列 */}
              {rowSelection && (
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500"
                  />
                </th>
              )}

              {/* 数据列 */}
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    'px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right'
                  )}
                  style={{ width: column.width }}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {column.sortable && (
                      <motion.button
                        onClick={() => handleSort(String(column.key))}
                        className="flex flex-col text-gray-400"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <span className="text-xs">
                          {sortConfig?.key === String(column.key) &&
                          sortConfig.direction === 'asc'
                            ? '▲'
                            : '△'}
                        </span>
                        <span className="text-xs -mt-1">
                          {sortConfig?.key === String(column.key) &&
                          sortConfig.direction === 'desc'
                            ? '▼'
                            : '▽'}
                        </span>
                      </motion.button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody
            className={cn(
              'divide-y divide-gray-200 dark:divide-gray-700',
              bordered && 'border border-gray-200 dark:border-gray-700'
            )}
          >
            <AnimatePresence>
              {processedData.map((record, index) => {
                const recordKey = record.id || record.key || index
                const isSelected = selectedRows.includes(recordKey)

                return (
                  <motion.tr
                    key={recordKey}
                    className={cn(
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/20'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-900'
                    )}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    {/* 选择列 */}
                    {rowSelection && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) =>
                            handleSelectRow(recordKey, record, e.target.checked)
                          }
                          className="rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500"
                        />
                      </td>
                    )}

                    {/* 数据列 */}
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className={cn(
                          'px-4 py-3',
                          column.align === 'center' && 'text-center',
                          column.align === 'right' && 'text-right'
                        )}
                      >
                        {column.render
                          ? column.render(record[column.key], record, index)
                          : record[column.key]}
                      </td>
                    ))}
                  </motion.tr>
                )
              })}
            </AnimatePresence>

            {/* 加载状态 */}
            {loading && (
              <tr>
                <td colSpan={columns.length + (rowSelection ? 1 : 0)}>
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2" />
                    <span className="text-gray-600 dark:text-gray-400">加载中...</span>
                  </div>
                </td>
              </tr>
            )}

            {/* 空数据状态 */}
            {!loading && processedData.length === 0 && (
              <tr>
                <td colSpan={columns.length + (rowSelection ? 1 : 0)}>
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    暂无数据
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      {pagination && (
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={pagination.onChange}
        />
      )}
    </motion.div>
  )
}

DataTable.displayName = 'DataTable'
