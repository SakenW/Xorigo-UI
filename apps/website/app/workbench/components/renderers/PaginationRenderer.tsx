'use client'

import React, { useState } from 'react'

interface PaginationRendererProps {
  current?: number
  total?: number
  pageSize?: number
  showSizeChanger?: boolean
  showQuickJumper?: boolean
  showTotal?: boolean
  updateProp?: (prop: string, value: any) => void
}

export default function PaginationRenderer({
  current = 1,
  total = 100,
  pageSize = 10,
  showSizeChanger = true,
  showQuickJumper = true,
  showTotal = true,
  updateProp
}: PaginationRendererProps) {
  const [currentPage, setCurrentPage] = useState(current)
  const [currentPageSize, setCurrentPageSize] = useState(pageSize)

  const totalPages = Math.ceil(total / currentPageSize)
  const pageSizeOptions = [10, 20, 50, 100]

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      if (updateProp) updateProp('current', page)
    }
  }

  const handlePageSizeChange = (size: number) => {
    setCurrentPageSize(size)
    setCurrentPage(1)
    if (updateProp) {
      updateProp('pageSize', size)
      updateProp('current', 1)
    }
  }

  const handleQuickJump = (value: string) => {
    const page = parseInt(value)
    if (!isNaN(page)) {
      handlePageChange(page)
    }
  }

  // 生成页码数组
  const generatePages = () => {
    const pages: Array<number | string> = []
    const showEllipsis = totalPages > 7

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1, 2, 3, '...', totalPages - 2, totalPages - 1, totalPages)
    }

    return pages
  }

  return (
    <div className="w-full">
      {/* 分页组件 */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* 总数显示 */}
        {showTotal && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            共 {total} 条记录，第 {currentPage} / {totalPages} 页
          </div>
        )}

        {/* 分页控制 */}
        <div className="flex items-center space-x-2">
          {/* 上一页 */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一页
          </button>

          {/* 页码 */}
          <div className="flex items-center space-x-1">
            {generatePages().map((page, index) =>
              page === '...' ? (
                <span key={index} className="px-2 text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  key={index}
                  onClick={() => handlePageChange(page as number)}
                  className={`px-3 py-1 text-sm border rounded transition-colors ${
                    currentPage === page
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>

          {/* 下一页 */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一页
          </button>
        </div>

        {/* 每页条数选择 */}
        {showSizeChanger && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              每页
            </span>
            <select
              value={currentPageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm bg-white dark:bg-gray-700"
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              条
            </span>
          </div>
        )}

        {/* 快速跳转 */}
        {showQuickJumper && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              跳至
            </span>
            <input
              type="number"
              min={1}
              max={totalPages}
              defaultValue={currentPage}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleQuickJump((e.target as HTMLInputElement).value)
                }
              }}
              className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-center"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              页
            </span>
          </div>
        )}
      </div>

      {/* 状态信息 */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          分页配置
        </h4>
        <div className="grid grid-cols-3 gap-4 text-xs text-gray-600 dark:text-gray-400">
          <div>当前页: {currentPage}</div>
          <div>总页数: {totalPages}</div>
          <div>每页条数: {currentPageSize}</div>
          <div>总数: {total}</div>
          <div>显示总数: {showTotal ? '是' : '否'}</div>
          <div>显示大小选择: {showSizeChanger ? '是' : '否'}</div>
          <div>显示快速跳转: {showQuickJumper ? '是' : '否'}</div>
          <div>数据范围: {(currentPage - 1) * currentPageSize + 1}-{Math.min(currentPage * currentPageSize, total)}</div>
        </div>
      </div>
    </div>
  )
}