/**
 * @fileoverview 复杂组件模板库
 * @description 提供复杂组件（如数据表、模态框等）的模板
 */

import type { ComponentTemplate } from '../types'

// ============================================================================
// 数据表格组件模板
// ============================================================================

export const dataTableTemplate: ComponentTemplate = {
  name: 'data-table',
  type: 'complex',
  description: '数据表格组件（支持排序、分页、筛选）',
  code: `import React, { useState, forwardRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@xorigo-ui/utils'

__INTERFACE_DEFINITION__

// ============================================================================
// 类型定义
// ============================================================================

export interface Column<T> {
  key: keyof T | string
  title: string
  width?: string | number
  sortable?: boolean
  render?: (value: any, record: T, index: number) => React.ReactNode
}

interface SortingState {
  key: string | null
  direction: 'asc' | 'desc'
}

// ============================================================================
// 主组件
// ============================================================================

/**
 * __COMPONENT_DESCRIPTION__
 */
export const __COMPONENT_NAME__ = forwardRef<HTMLDivElement, __COMPONENT_NAME__Props<any>>(
  <T extends Record<string, any>>(
    {
      data = [],
      columns = [],
      loading = false,
      pagination = true,
      pageSize = 10,
      selectable = false,
      className,
      ...props
    },
    ref
  ) => {
    const [sorting, setSorting] = useState<SortingState>({
      key: null,
      direction: 'asc'
    })
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())

    // 排序逻辑
    const sortedData = useMemo(() => {
      if (!sorting.key) return data

      return [...data].sort((a, b) => {
        const aVal = a[sorting.key!]
        const bVal = b[sorting.key!]

        if (aVal < bVal) return sorting.direction === 'asc' ? -1 : 1
        if (aVal > bVal) return sorting.direction === 'asc' ? 1 : -1
        return 0
      })
    }, [data, sorting])

    // 分页逻辑
    const paginatedData = useMemo(() => {
      if (!pagination) return sortedData

      const start = (currentPage - 1) * pageSize
      const end = start + pageSize
      return sortedData.slice(start, end)
    }, [sortedData, currentPage, pageSize, pagination])

    const totalPages = Math.ceil(sortedData.length / pageSize)

    // 排序处理
    const handleSort = (key: string) => {
      setSorting(prev => ({
        key,
        direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
      }))
    }

    // 行选择处理
    const handleSelectRow = (index: number) => {
      const newSelected = new Set(selectedRows)
      if (newSelected.has(index)) {
        newSelected.delete(index)
      } else {
        newSelected.add(index)
      }
      setSelectedRows(newSelected)
    }

    const handleSelectAll = () => {
      if (selectedRows.size === paginatedData.length) {
        setSelectedRows(new Set())
      } else {
        setSelectedRows(new Set(paginatedData.map((_, i) => i)))
      }
    }

    return (
      <motion.div
        ref={ref}
        className={cn('bg-white rounded-lg border border-gray-200 overflow-hidden', className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {/* 表格容器 */}
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* 表头 */}
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {selectable && (
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </th>
                )}
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={cn(
                      'px-4 py-3 text-left text-sm font-semibold text-gray-900',
                      column.sortable && 'cursor-pointer hover:bg-gray-100 select-none'
                    )}
                    style={{ width: column.width }}
                    onClick={() => column.sortable && handleSort(String(column.key))}
                  >
                    <div className="flex items-center gap-1">
                      {column.title}
                      {column.sortable && sorting.key === column.key && (
                        <span className="text-primary-600">
                          {sorting.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* 表身 */}
            <tbody className="divide-y divide-gray-200">
              <AnimatePresence>
                {loading ? (
                  <tr>
                    <td
                      colSpan={columns.length + (selectable ? 1 : 0)}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin h-5 w-5 text-primary-600 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        加载中...
                      </div>
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length + (selectable ? 1 : 0)}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      暂无数据
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((record, rowIndex) => (
                    <motion.tr
                      key={rowIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={cn(
                        'hover:bg-gray-50 transition-colors',
                        selectedRows.has(rowIndex) && 'bg-primary-50'
                      )}
                    >
                      {selectable && (
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedRows.has(rowIndex)}
                            onChange={() => handleSelectRow(rowIndex)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                        </td>
                      )}
                      {columns.map((column) => {
                        const value = record[column.key]
                        return (
                          <td key={String(column.key)} className="px-4 py-3 text-sm text-gray-900">
                            {column.render
                              ? column.render(value, record, rowIndex)
                              : value}
                          </td>
                        )
                      })}
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        {pagination && totalPages > 1 && (
          <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              显示 {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, sortedData.length)} 项，
              共 {sortedData.length} 项
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              <span className="px-3 py-1 text-sm">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </motion.div>
    )
  }
)

__COMPONENT_NAME__.displayName = '__COMPONENT_NAME__'
`,
  types: `import React from 'react'

export interface __COMPONENT_NAME__Props<T extends Record<string, any>> extends React.HTMLAttributes<HTMLDivElement> {
  /** 表格数据 */
  data: T[]
  /** 列配置 */
  columns: Array<{
    key: keyof T | string
    title: string
    width?: string | number
    sortable?: boolean
    render?: (value: any, record: T, index: number) => React.ReactNode
  }>
  /** 是否加载中 */
  loading?: boolean
  /** 是否显示分页 */
  pagination?: boolean
  /** 每页显示数量 */
  pageSize?: number
  /** 是否可选择行 */
  selectable?: boolean
}
`
}

// ============================================================================
// 模态框组件模板
// ============================================================================

export const modalTemplate: ComponentTemplate = {
  name: 'modal',
  type: 'complex',
  description: '模态框组件（支持动画、可访问性）',
  code: `import React, { useEffect, forwardRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@xorigo-ui/utils'

__INTERFACE_DEFINITION__

// ============================================================================
// 动画配置
// ============================================================================

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: {
      duration: 0.2,
    },
  },
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

// ============================================================================
// 主组件
// ============================================================================

/**
 * __COMPONENT_DESCRIPTION__
 */
export const __COMPONENT_NAME__ = forwardRef<HTMLDivElement, __COMPONENT_NAME__Props>(
  (
    {
      open,
      onClose,
      title,
      children,
      size = 'md',
      showCloseButton = true,
      closeOnOverlayClick = true,
      closeOnEscape = true,
      className,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(open)

    useEffect(() => {
      setIsOpen(open)
    }, [open])

    useEffect(() => {
      if (!isOpen || !closeOnEscape) return

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose?.()
        }
      }

      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen, closeOnEscape, onClose])

    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'unset'
      }

      return () => {
        document.body.style.overflow = 'unset'
      }
    }, [isOpen])

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget && closeOnOverlayClick) {
        onClose?.()
      }
    }

    const handleClose = () => {
      setIsOpen(false)
      onClose?.()
    }

    const sizeClasses = {
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      full: 'max-w-7xl',
    }

    return (
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* 遮罩层 */}
            <motion.div
              className="absolute inset-0 bg-black/50"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={handleOverlayClick}
            />

            {/* 模态框内容 */}
            <motion.div
              ref={ref}
              className={cn(
                'relative bg-white rounded-lg shadow-xl w-full',
                sizeClasses[size],
                className
              )}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              {...props}
            >
              {/* 头部 */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  {title && (
                    <h2 className="text-xl font-semibold text-gray-900">
                      {title}
                    </h2>
                  )}
                  {showCloseButton && (
                    <button
                      onClick={handleClose}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      aria-label="关闭模态框"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              )}

              {/* 主体 */}
              <div className="p-6">
                {children}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    )
  }
)

__COMPONENT_NAME__.displayName = '__COMPONENT_NAME__'
`,
  types: `import React from 'react'

export interface __COMPONENT_NAME__Props extends React.HTMLAttributes<HTMLDivElement> {
  /** 是否打开模态框 */
  open: boolean
  /** 关闭回调 */
  onClose?: () => void
  /** 模态框标题 */
  title?: string
  /** 模态框内容 */
  children: React.ReactNode
  /** 模态框尺寸 */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  /** 是否显示关闭按钮 */
  showCloseButton?: boolean
  /** 点击遮罩层是否关闭 */
  closeOnOverlayClick?: boolean
  /** 按ESC键是否关闭 */
  closeOnEscape?: boolean
}
`
}

// ============================================================================
// 导出所有复杂组件模板
// ============================================================================

export const complexTemplates = [
  dataTableTemplate,
  modalTemplate
]
