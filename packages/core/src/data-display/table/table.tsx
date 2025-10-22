/**
 * Table 表格组件 - 符合七轴主题系统 v1.4 SSOT
 *
 * 数据展示组件 - 功能完善的表格和数据处理
 */

import React, { useState, useMemo } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../foundations/utils/cn'
import { useTheme } from '../../system/theme-provider'

// =============================================================================
// 组件变体系统 - CVA (Class Variance Authority)
// =============================================================================

const tableVariants = cva(
  // 基础样式
  "w-full border-collapse",
  {
    variants: {
      variant: {
        default: "border border-border",
        striped: "border border-border",
        bordered: "border border-border",
        ghost: "",
      },

      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },

      // 布局模式
      layout: {
        auto: "table-auto",
        fixed: "table-fixed",
      },

      // 斑马纹
      striped: {
        true: "",
        false: "",
      },

      // 悬停效果
      hoverable: {
        true: "",
        false: "",
      },

      // 紧凑模式
      compact: {
        true: "",
        false: "",
      },
    },

    defaultVariants: {
      variant: 'default',
      size: 'md',
      layout: 'auto',
      striped: false,
      hoverable: true,
      compact: false,
    },
  }
)

const cellVariants = cva(
  // 基础样式
  "border-b border-border text-left",
  {
    variants: {
      variant: {
        header: "bg-muted/50 font-medium text-muted-foreground",
        data: "bg-background",
        footer: "bg-muted/30 font-medium",
      },

      size: {
        sm: "px-2 py-1",
        md: "px-4 py-2",
        lg: "px-6 py-3",
      },

      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
        justify: "text-justify",
      },

      valign: {
        top: "align-top",
        middle: "align-middle",
        bottom: "align-bottom",
        baseline: "align-baseline",
      },

      // 可选列
      optional: {
        true: "text-muted-foreground",
        false: "",
      },

      // 排序指示器
      sortable: {
        true: "cursor-pointer hover:bg-accent/50 transition-colors",
        false: "",
      },
    },

    defaultVariants: {
      variant: 'data',
      size: 'md',
      align: 'left',
      valign: 'middle',
      optional: false,
      sortable: false,
    },
  }
)

// =============================================================================
// 类型定义
// =============================================================================

export interface ColumnDef<T = any> {
  /**
   * 列标识
   */
  id: string

  /**
   * 列标题
   */
  header: React.ReactNode

  /**
   * 访问器函数
   */
  accessorKey?: keyof T

  /**
   * 自定义渲染函数
   */
  cell?: (row: T, index: number) => React.ReactNode

  /**
   * 列宽度
   */
  width?: string | number

  /**
   * 最小宽度
   */
  minWidth?: string | number

  /**
   * 最大宽度
   */
  maxWidth?: string | number

  /**
   * 对齐方式
   */
  align?: CellProps['align']

  /**
   * 垂直对齐
   */
  valign?: CellProps['valign']

  /**
   * 是否可排序
   */
  sortable?: boolean

  /**
   * 是否可选列
   */
  optional?: boolean

  /**
   * 是否固定列
   */
  fixed?: 'left' | 'right'

  /**
   * 类名
   */
  className?: string
}

export interface TableProps<T = any>
  extends React.HTMLAttributes<HTMLTableElement>,
    VariantProps<typeof tableVariants> {
  /**
   * 数据
   */
  data: T[]

  /**
   * 列定义
   */
  columns: ColumnDef<T>[]

  /**
   * 行选择回调
   */
  onRowSelectionChange?: (selectedRows: T[]) => void

  /**
   * 默认选中行
   */
  defaultSelectedRows?: T[]

  /**
   * 排序回调
   */
  onSortingChange?: (sorting: { column: string; direction: 'asc' | 'desc' }) => void

  /**
   * 默认排序
   */
  defaultSorting?: { column: string; direction: 'asc' | 'desc' }

  /**
   * 分页配置
   */
  pagination?: {
    page: number
    pageSize: number
    total: number
    onPageChange: (page: number) => void
    onPageSizeChange?: (pageSize: number) => void
  }

  /**
   * 搜索查询
   */
  searchQuery?: string

  /**
   * 空状态展示
   */
  empty?: React.ReactNode

  /**
   * 加载状态
   */
  loading?: boolean

  /**
   * 行渲染函数
   */
  renderRow?: (row: T, index: number) => React.ReactNode

  /**
   * 行键函数
   */
  getRowKey?: (row: T, index: number) => string
}

export interface CellProps
  extends Omit<React.TdHTMLAttributes<HTMLTableCellElement>, 'align'>,
    VariantProps<typeof cellVariants> {
  variant?: 'header' | 'data' | 'footer'
  children?: React.ReactNode
}

// =============================================================================
// Table 主组件实现
// =============================================================================

function TableInner<T = any>({
  variant,
  size,
  layout,
  striped,
  hoverable,
  compact,
  data,
  columns,
  onRowSelectionChange,
  defaultSelectedRows = [],
  onSortingChange,
  defaultSorting,
  pagination,
  searchQuery,
  empty,
  loading = false,
  renderRow,
  getRowKey = (_, index) => `row-${index}`,
  className,
  ...props
}: TableProps<T>) {
  const { theme } = useTheme()
  const [selectedRows, setSelectedRows] = useState<T[]>(defaultSelectedRows)
  const [sorting, setSorting] = useState<{ column: string; direction: 'asc' | 'desc' } | undefined>(
    defaultSorting
  )

  // 处理排序
  const handleSort = React.useCallback((columnId: string) => {
    const column = columns.find(col => col.id === columnId)
    if (!column?.sortable) return

    const newDirection = sorting?.column === columnId && sorting.direction === 'asc' ? 'desc' : 'asc'
    const newSorting = { column: columnId, direction: newDirection }

    setSorting(newSorting)
    onSortingChange?.(newSorting)
  }, [columns, sorting, onSortingChange])

  // 处理数据排序和过滤
  const processedData = useMemo(() => {
    let result = [...data]

    // 搜索过滤
    if (searchQuery) {
      result = result.filter(row =>
        columns.some(column => {
          const value = column.accessorKey ? row[column.accessorKey] : null
          return value && String(value).toLowerCase().includes(searchQuery.toLowerCase())
        })
      )
    }

    // 排序
    if (sorting) {
      const column = columns.find(col => col.id === sorting.column)
      if (column?.accessorKey) {
        result.sort((a, b) => {
          const aVal = a[column.accessorKey!]
          const bVal = b[column.accessorKey!]

          if (aVal < bVal) return sorting.direction === 'asc' ? -1 : 1
          if (aVal > bVal) return sorting.direction === 'asc' ? 1 : -1
          return 0
        })
      }
    }

    return result
  }, [data, columns, searchQuery, sorting])

  // 分页数据
  const paginatedData = useMemo(() => {
    if (!pagination) return processedData

    const start = (pagination.page - 1) * pagination.pageSize
    return processedData.slice(start, start + pagination.pageSize)
  }, [processedData, pagination])

  // 处理行选择
  const handleRowSelection = React.useCallback((row: T, selected: boolean) => {
    let newSelectedRows: T[]

    if (selected) {
      newSelectedRows = [...selectedRows, row]
    } else {
      newSelectedRows = selectedRows.filter(r => r !== row)
    }

    setSelectedRows(newSelectedRows)
    onRowSelectionChange?.(newSelectedRows)
  }, [selectedRows, onRowSelectionChange])

  // 生成主题样式
  const themeStyles: React.CSSProperties = {
    ['--table-border' as any]: `var(--xor-border-primary)`,
    ['--table-bg' as any]: `var(--xor-bg-primary)`,
    ['--table-header-bg' as any]: `var(--xor-muted)`,
    ['--table-text' as any]: `var(--xor-text-primary)`,
    ['--table-hover' as any]: `var(--xor-accent-primary)`,
    ['--table-striped' as any]: `var(--xor-muted)`,
  }

  // 空状态
  if (!loading && processedData.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground border border-border rounded-lg">
        {empty || (
          <div className="text-center">
            <div className="text-lg font-medium mb-2">暂无数据</div>
            <div className="text-sm">没有找到匹配的记录</div>
          </div>
        )}
      </div>
    )
  }

  // 加载状态
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 border border-border rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>加载中...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full overflow-auto border border-border rounded-lg">
      <table
        className={cn(
          tableVariants({ variant, size, layout, striped, hoverable, compact }),
          className
        )}
        style={themeStyles}
        {...props}
      >
        {/* 表头 */}
        <thead>
          <tr>
            {columns.map((column) => (
              <Cell
                key={column.id}
                variant="header"
                size={size}
                align={column.align}
                sortable={column.sortable}
                className={cn(
                  column.sortable && "cursor-pointer hover:bg-accent/50 transition-colors",
                  column.className
                )}
                onClick={() => column.sortable && handleSort(column.id)}
                style={{
                  width: column.width,
                  minWidth: column.minWidth,
                  maxWidth: column.maxWidth,
                }}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.header}</span>
                  {column.sortable && sorting?.column === column.id && (
                    <svg
                      className={cn(
                        "w-4 h-4 transition-transform",
                        sorting.direction === 'desc' && "rotate-180"
                      )}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  )}
                </div>
              </Cell>
            ))}
          </tr>
        </thead>

        {/* 表体 */}
        <tbody>
          {paginatedData.map((row, index) => {
            const isSelected = selectedRows.includes(row)
            const key = getRowKey(row, index)

            if (renderRow) {
              return (
                <tr key={key} className={cn(isSelected && "bg-accent/50")}>
                  {renderRow(row, index)}
                </tr>
              )
            }

            return (
              <tr
                key={key}
                className={cn(
                  hoverable && "hover:bg-accent/50 transition-colors",
                  striped && index % 2 === 1 && "bg-[var(--table-striped)]",
                  isSelected && "bg-accent/50"
                )}
              >
                {columns.map((column) => {
                  const content = column.cell
                    ? column.cell(row, index)
                    : column.accessorKey
                    ? (row[column.accessorKey] as React.ReactNode)
                    : null

                  return (
                    <Cell
                      key={column.id}
                      variant="data"
                      size={size}
                      align={column.align}
                      valign={column.valign}
                      optional={column.optional}
                      className={column.className}
                    >
                      {content}
                    </Cell>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* 分页 */}
      {pagination && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
          <div className="text-sm text-muted-foreground">
            显示第 {(pagination.page - 1) * pagination.pageSize + 1} 到{' '}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} 条，
            共 {pagination.total} 条记录
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="px-3 py-1 text-sm border border-border rounded hover:bg-accent/50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              上一页
            </button>
            <span className="text-sm">
              第 {pagination.page} 页，共 {Math.ceil(pagination.total / pagination.pageSize)} 页
            </span>
            <button
              className="px-3 py-1 text-sm border border-border rounded hover:bg-accent/50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// =============================================================================
// Cell 组件实现
// =============================================================================

const Cell = React.forwardRef<HTMLTableCellElement, CellProps>(
  ({ variant, size, align, valign, optional, sortable, className, children, ...props }, ref) => {
    const Component = variant === 'header' ? 'th' : 'td'

    return (
      <Component
        ref={ref}
        className={cn(
          cellVariants({ variant, size, align, valign, optional, sortable }),
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

// =============================================================================
// 导出的 Table 组件
// =============================================================================

const Table = React.forwardRef<HTMLTableElement, TableProps>((props, ref) => {
  return <TableInner {...props} ref={ref} />
})

// =============================================================================
// 工具函数
// =============================================================================

/**
 * 生成基础列定义
 */
export const createColumn = <T,>(config: Partial<ColumnDef<T>> & { id: string; header: React.ReactNode }): ColumnDef<T> => {
  return {
    accessorKey: config.id as keyof T,
    align: 'left',
    sortable: false,
    optional: false,
    ...config,
  }
}

/**
 * 生成操作列定义
 */
export const createActionColumn = <T,>(
  render: (row: T, index: number) => React.ReactNode,
  options: Partial<Omit<ColumnDef<T>, 'id' | 'header' | 'cell'>> = {}
): ColumnDef<T> => {
  return {
    id: 'actions',
    header: '操作',
    cell: render,
    align: 'center',
    sortable: false,
    width: 120,
    ...options,
  }
}

// =============================================================================
// 组件元数据
// =============================================================================

Table.displayName = 'Table'
Cell.displayName = 'Cell'

// =============================================================================
// 导出
// =============================================================================

export { Table, Cell, tableVariants, cellVariants }
export type { TableProps, ColumnDef, CellProps }