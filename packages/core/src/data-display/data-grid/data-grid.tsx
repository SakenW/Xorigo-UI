'use client'
/**
 * @fileoverview DataGrid 组件 - 高级数据表格组件
 * @description 功能完整的数据表格组件，支持排序、过滤、分页、选择等高级功能
 *
 * @author Xorigo UI Team
 * @version 1.0.0
 * @since 2025-11-04
 */

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { cn } from '../../utils/cn'
import { cva, type VariantProps } from '../../utils/cva-standalone'
import { motion, AnimatePresence } from 'framer-motion'

// =============================================================================
// 变体系统
// =============================================================================

const dataGridVariants = cva(
  "w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden",
  {
    variants: {
      variant: {
        default: "",
        striped: "[&_tbody_tr:nth-child(even)]:bg-gray-50 [&_tbody_tr:nth-child(even)]:dark:bg-gray-800",
        bordered: "border-2",
        minimal: "border-0 shadow-none",
      },
      size: {
        sm: "[&_th]:px-3 [&_th]:py-2 [&_td]:px-3 [&_td]:py-2 text-xs",
        md: "[&_th]:px-4 [&_th]:py-3 [&_td]:px-4 [&_td]:py-3 text-sm",
        lg: "[&_th]:px-6 [&_th]:py-4 [&_td]:px-6 [&_td]:py-4 text-base",
      },
      density: {
        compact: " [&_th]:py-1 [&_td]:py-1",
        normal: " [&_th]:py-3 [&_td]:py-3",
        comfortable: " [&_th]:py-4 [&_td]:py-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      density: "normal",
    },
  }
)

// =============================================================================
// 类型定义
// =============================================================================

export interface DataGridColumn<T = any> {
  key: string
  title: string
  width?: string | number
  minWidth?: string | number
  maxWidth?: string | number
  sortable?: boolean
  filterable?: boolean
  resizable?: boolean
  fixed?: 'left' | 'right' | false
  align?: 'left' | 'center' | 'right'
  ellipsis?: boolean
  render?: (value: any, row: T, index: number) => React.ReactNode
  editor?: React.ReactNode
  className?: string
  headerClassName?: string
}

export interface SortConfig {
  key: string
  direction: 'asc' | 'desc'
  priority?: number
}

export interface FilterConfig {
  key: string
  value: any
  operator?: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'in'
}

export interface SelectionConfig {
  mode: 'single' | 'multiple'
  keyField?: string
}

export interface PaginationConfig {
  enabled: boolean
  pageSize: number
  pageIndex: number
  total: number
}

export interface VirtualizationConfig {
  enabled: boolean
  rowHeight: number
  overscan?: number
}

export interface DataGridProps<T = any>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof dataGridVariants> {
  // 数据相关
  data: T[]
  columns: DataGridColumn<T>[]

  // 功能配置
  sortable?: boolean
  filterable?: boolean
  selectable?: SelectionConfig | false
  pagination?: PaginationConfig | boolean
  virtualized?: VirtualizationConfig | boolean
  editable?: boolean
  exportable?: boolean

  // 回调函数
  onSort?: (config: SortConfig[]) => void
  onFilter?: (filters: FilterConfig[]) => void
  onSelectionChange?: (selectedRows: T[], selectedKeys: (string | number)[]) => void
  onPageChange?: (pageIndex: number, pageSize: number) => void
  onCellEdit?: (row: T, column: DataGridColumn<T>, value: any) => void
  onExport?: (format: 'csv' | 'xlsx' | 'json') => void

  // 状态
  loading?: boolean
  emptyText?: string
  emptyComponent?: React.ReactNode
  selectedRowKeys?: (string | number)[]

  // 固定列
  stickyHeader?: boolean
  stickyFirstColumn?: boolean
  stickyLastColumn?: boolean

  // 自定义渲染
  rowClassName?: string | ((row: T, index: number) => string)
  rowKey?: string | ((row: T, index: number) => string | number)

  // 工具提示
  showTooltip?: boolean

  // 类名
  className?: string

  // 测试属性
  testId?: string
}

export type DataGridRef = {
  export: (format: 'csv' | 'xlsx' | 'json') => void
  clearSelection: () => void
  selectAll: () => void
}

// =============================================================================
// 工具函数
// =============================================================================

const uid = () => Math.random().toString(36).substring(2)

// =============================================================================
// 主组件
// =============================================================================

const DataGrid = React.forwardRef<DataGridRef, DataGridProps>(
  (
    {
      className,
      variant,
      size,
      density,
      data = [],
      columns = [],
      sortable = true,
      filterable = false,
      selectable = { mode: 'multiple' },
      pagination = false,
      virtualized = false,
      editable = false,
      exportable = false,
      onSort,
      onFilter,
      onSelectionChange,
      onPageChange,
      onCellEdit,
      onExport,
      loading = false,
      emptyText = "暂无数据",
      emptyComponent,
      selectedRowKeys = [],
      stickyHeader = true,
      stickyFirstColumn = false,
      stickyLastColumn = false,
      rowClassName,
      rowKey,
      showTooltip = true,
      testId,
      ...props
    },
    ref
  ) => {
    // =============================================================================
    // 状态管理
    // =============================================================================

    const [sortConfig, setSortConfig] = useState<SortConfig[]>([])
    const [filters, setFilters] = useState<FilterConfig[]>([])
    const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>(selectedRowKeys)
    const [currentPage, setCurrentPage] = useState(1)
    const [editingCell, setEditingCell] = useState<{ rowIndex: number; columnKey: string } | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // 解析配置
    const paginationConfig = useMemo(() => {
      if (typeof pagination === 'boolean') {
        return pagination
          ? { enabled: true, pageSize: 10, pageIndex: 1, total: data.length }
          : { enabled: false, pageSize: 10, pageIndex: 1, total: 0 }
      }
      return { ...pagination, enabled: true }
    }, [pagination, data.length])

    const virtualizationConfig = useMemo(() => {
      if (typeof virtualized === 'boolean') {
        return virtualized
          ? { enabled: true, rowHeight: 50, overscan: 5 }
          : { enabled: false, rowHeight: 50, overscan: 5 }
      }
      return { ...virtualized, enabled: true }
    }, [virtualized])

    // =============================================================================
    // 数据处理
    // =============================================================================

    const getRowKey = useCallback(
      (row: any, index: number) => {
        if (typeof rowKey === 'function') {
          return rowKey(row, index)
        }
        if (typeof rowKey === 'string') {
          return row[rowKey]
        }
        return row.id || row.key || index
      },
      [rowKey]
    )

    const getRowClassName = useCallback(
      (row: any, index: number) => {
        if (typeof rowClassName === 'function') {
          return rowClassName(row, index)
        }
        return rowClassName || ''
      },
      [rowClassName]
    )

    const filteredData = useMemo(() => {
      if (!filterable || filters.length === 0) return data

      return data.filter((row) => {
        return filters.every((filter) => {
          const value = row[filter.key]
          const filterValue = filter.value

          switch (filter.operator) {
            case 'equals':
              return value === filterValue
            case 'contains':
              return String(value).toLowerCase().includes(String(filterValue).toLowerCase())
            case 'startsWith':
              return String(value).toLowerCase().startsWith(String(filterValue).toLowerCase())
            case 'endsWith':
              return String(value).toLowerCase().endsWith(String(filterValue).toLowerCase())
            case 'greaterThan':
              return value > filterValue
            case 'lessThan':
              return value < filterValue
            case 'in':
              return Array.isArray(filterValue) && filterValue.includes(value)
            default:
              return true
          }
        })
      })
    }, [data, filters, filterable])

    const sortedData = useMemo(() => {
      if (!sortable || sortConfig.length === 0) return filteredData

      return [...filteredData].sort((a, b) => {
        for (const sort of sortConfig) {
          const aValue = a[sort.key]
          const bValue = b[sort.key]

          if (aValue === bValue) continue

          const comparison = aValue > bValue ? 1 : -1
          if (sort.direction === 'asc') {
            return comparison
          } else {
            return -comparison
          }
        }
        return 0
      })
    }, [filteredData, sortConfig, sortable])

    const paginatedData = useMemo(() => {
      if (!paginationConfig.enabled) return sortedData

      const start = (paginationConfig.pageIndex - 1) * paginationConfig.pageSize
      const end = start + paginationConfig.pageSize
      return sortedData.slice(start, end)
    }, [sortedData, paginationConfig])

    // =============================================================================
    // 事件处理
    // =============================================================================

    const handleSort = useCallback(
      (column: DataGridColumn) => {
        if (!sortable || !column.sortable) return

        setSortConfig((prev) => {
          const existing = prev.find((s) => s.key === column.key)
          let newConfig: SortConfig[]

          if (existing) {
            if (existing.direction === 'asc') {
              newConfig = prev
                .map((s) => (s.key === column.key ? { ...s, direction: 'desc' as const } : s))
                .sort((a, b) => (a.priority || 0) - (b.priority || 0))
            } else {
              newConfig = prev.filter((s) => s.key !== column.key)
            }
          } else {
            newConfig = [...prev, { key: column.key, direction: 'asc' as const, priority: prev.length }]
          }

          onSort?.(newConfig)
          return newConfig
        })
      },
      [sortable, onSort]
    )

    const handleFilter = useCallback(
      (column: DataGridColumn, value: any) => {
        if (!filterable || !column.filterable) return

        setFilters((prev) => {
          const existing = prev.find((f) => f.key === column.key)
          let newFilters

          if (existing) {
            if (value === undefined || value === '') {
              newFilters = prev.filter((f) => f.key !== column.key)
            } else {
              newFilters = prev.map((f) => (f.key === column.key ? { ...f, value } : f))
            }
          } else {
            newFilters = [...prev, { key: column.key, value }]
          }

          onFilter?.(newFilters)
          return newFilters
        })
      },
      [filterable, onFilter]
    )

    const handleSelectRow = useCallback(
      (row: any, checked: boolean) => {
        const key = getRowKey(row, 0)
        const newSelectedKeys = checked
          ? [...selectedKeys, key]
          : selectedKeys.filter((k) => k !== key)

        setSelectedKeys(newSelectedKeys)
        onSelectionChange?.(
          data.filter((r) => newSelectedKeys.includes(getRowKey(r, 0))),
          newSelectedKeys
        )
      },
      [selectedKeys, data, getRowKey, onSelectionChange]
    )

    const handleSelectAll = useCallback(
      (checked: boolean) => {
        const newSelectedKeys = checked ? paginatedData.map((row, i) => getRowKey(row, i)) : []
        setSelectedKeys(newSelectedKeys)
        onSelectionChange?.(
          data.filter((r) => newSelectedKeys.includes(getRowKey(r, 0))),
          newSelectedKeys
        )
      },
      [paginatedData, getRowKey, onSelectionChange]
    )

    const handlePageChange = useCallback(
      (pageIndex: number) => {
        setCurrentPage(pageIndex)
        onPageChange?.(pageIndex, paginationConfig.pageSize)
      },
      [onPageChange, paginationConfig.pageSize]
    )

    const handleCellEdit = useCallback(
      (row: any, column: DataGridColumn, value: any) => {
        onCellEdit?.(row, column, value)
        setEditingCell(null)
      },
      [onCellEdit]
    )

    // =============================================================================
    // 导出功能
    // =============================================================================

    React.useImperativeHandle(ref, () => ({
      export: (format: 'csv' | 'xlsx' | 'json') => {
        onExport?.(format)
      },
      clearSelection: () => {
        setSelectedKeys([])
      },
      selectAll: () => {
        const allKeys = paginatedData.map((row, i) => getRowKey(row, i))
        setSelectedKeys(allKeys)
      },
    }))

    // =============================================================================
    // 渲染
    // =============================================================================

    const renderTableHeader = () => (
      <thead className="bg-gray-50 dark:bg-gray-800">
        <tr>
          {selectable && (
            <th className="w-12 px-4 py-3 text-left">
              {selectable.mode === 'multiple' && (
                <input
                  type="checkbox"
                  checked={
                    paginatedData.length > 0 &&
                    paginatedData.every((row) => selectedKeys.includes(getRowKey(row, 0)))
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              )}
            </th>
          )}
          {columns.map((column) => (
            <th
              key={column.key}
              className={cn(
                "px-4 py-3 text-left font-medium text-gray-900 dark:text-gray-100",
                column.align === 'center' && "text-center",
                column.align === 'right' && "text-right",
                sortable && column.sortable && "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700",
                column.fixed === 'left' && "sticky left-0 z-20 bg-gray-50 dark:bg-gray-800",
                column.fixed === 'right' && "sticky right-0 z-20 bg-gray-50 dark:bg-gray-800",
                column.headerClassName
              )}
              style={{
                width: column.width,
                minWidth: column.minWidth,
                maxWidth: column.maxWidth,
              }}
              onClick={() => handleSort(column)}
            >
              <div className="flex items-center space-x-1">
                <span>{column.title}</span>
                {sortable && column.sortable && (
                  <div className="flex flex-col">
                    <svg
                      className={cn(
                        "h-3 w-3",
                        sortConfig.find((s) => s.key === column.key && s.direction === 'asc')
                          ? "text-blue-600"
                          : "text-gray-400"
                      )}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <svg
                      className={cn(
                        "h-3 w-3 -mt-1",
                        sortConfig.find((s) => s.key === column.key && s.direction === 'desc')
                          ? "text-blue-600"
                          : "text-gray-400"
                      )}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </th>
          ))}
        </tr>
      </thead>
    )

    const renderTableBody = () => {
      if (loading) {
        return (
          <tbody>
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-8 text-center">
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
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-8 text-center text-gray-500">
                {emptyComponent || emptyText}
              </td>
            </tr>
          </tbody>
        )
      }

      return (
        <tbody>
          <AnimatePresence>
            {paginatedData.map((row, rowIndex) => (
              <motion.tr
                key={getRowKey(row, rowIndex)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={cn(
                  "hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                  selectedKeys.includes(getRowKey(row, rowIndex)) && "bg-blue-50 dark:bg-blue-900/20",
                  getRowClassName(row, rowIndex)
                )}
              >
                {selectable && (
                  <td className="w-12 px-4 py-3">
                    <input
                      type={selectable.mode === 'single' ? 'radio' : 'checkbox'}
                      checked={selectedKeys.includes(getRowKey(row, rowIndex))}
                      onChange={(e) => handleSelectRow(row, e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      "px-4 py-3",
                      column.align === 'center' && "text-center",
                      column.align === 'right' && "text-right",
                      column.ellipsis && "max-w-xs overflow-hidden text-ellipsis whitespace-nowrap",
                      column.fixed === 'left' && "sticky left-0 z-10 bg-white dark:bg-gray-900",
                      column.fixed === 'right' && "sticky right-0 z-10 bg-white dark:bg-gray-900",
                      column.className
                    )}
                    style={{
                      width: column.width,
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth,
                    }}
                    title={column.ellipsis && showTooltip ? String(row[column.key]) : undefined}
                  >
                    {editable && editingCell?.rowIndex === rowIndex && editingCell?.columnKey === column.key ? (
                      <input
                        autoFocus
                        defaultValue={row[column.key]}
                        onBlur={(e) => handleCellEdit(row, column, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleCellEdit(row, column, (e.target as HTMLInputElement).value)
                          }
                          if (e.key === 'Escape') {
                            setEditingCell(null)
                          }
                        }}
                        className="w-full px-2 py-1 border rounded"
                      />
                    ) : column.render ? (
                      column.render(row[column.key], row, rowIndex)
                    ) : (
                      <span
                        onDoubleClick={() => editable && setEditingCell({ rowIndex, columnKey: column.key })}
                        className={editable ? "cursor-text" : ""}
                      >
                        {row[column.key]}
                      </span>
                    )}
                  </td>
                ))}
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      )
    }

    const renderPagination = () => {
      if (!paginationConfig.enabled) return null

      const totalPages = Math.ceil(sortedData.length / paginationConfig.pageSize)

      return (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            显示 {((paginationConfig.pageIndex - 1) * paginationConfig.pageSize) + 1} 到{' '}
            {Math.min(paginationConfig.pageIndex * paginationConfig.pageSize, sortedData.length)} 条，
            共 {sortedData.length} 条记录
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(paginationConfig.pageIndex - 1)}
              disabled={paginationConfig.pageIndex === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              上一页
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={cn(
                    "px-3 py-1 text-sm border rounded-md",
                    paginationConfig.pageIndex === page
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                  )}
                >
                  {page}
                </button>
              )
            })}
            <button
              onClick={() => handlePageChange(paginationConfig.pageIndex + 1)}
              disabled={paginationConfig.pageIndex === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              下一页
            </button>
          </div>
        </div>
      )
    }

    return (
      <div
        ref={containerRef}
        className={cn("space-y-4", className)}
        data-testid={testId}
        data-component="data-grid"
        {...props}
      >
        {/* 工具栏 */}
        {(exportable || filterable) && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {filterable && (
                <div className="flex items-center space-x-2">
                  {columns
                    .filter((col) => col.filterable)
                    .map((column) => (
                      <input
                        key={column.key}
                        type="text"
                        placeholder={`过滤 ${column.title}...`}
                        onChange={(e) => handleFilter(column, e.target.value)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600"
                      />
                    ))}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {exportable && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onExport?.('csv')}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    导出 CSV
                  </button>
                  <button
                    onClick={() => onExport?.('xlsx')}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    导出 Excel
                  </button>
                  <button
                    onClick={() => onExport?.('json')}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    导出 JSON
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 表格容器 */}
        <div className="overflow-auto border border-gray-200 dark:border-gray-700 rounded-lg">
          <table className={dataGridVariants({ variant, size, density })}>
            {renderTableHeader()}
            {renderTableBody()}
          </table>
        </div>

        {/* 分页 */}
        {renderPagination()}
      </div>
    )
  }
)

DataGrid.displayName = "DataGrid"

export { DataGrid, dataGridVariants }
export type {
  DataGridProps,
  DataGridColumn,
  SortConfig,
  FilterConfig,
  SelectionConfig,
  PaginationConfig,
  VirtualizationConfig,
  DataGridRef,
}
