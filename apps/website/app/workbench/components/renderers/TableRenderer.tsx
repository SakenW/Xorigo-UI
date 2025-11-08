'use client'

import React, { useState } from 'react'

interface TableRendererProps {
  columns?: Array<{
    title: string
    dataIndex: string
    key?: string
    width?: number
    sorter?: boolean
    filters?: Array<{ text: string; value: string }>
  }>
  dataSource?: Array<Record<string, any>>
  pagination?: boolean
  rowSelection?: boolean
  updateProp?: (prop: string, value: any) => void
}

export default function TableRenderer({
  columns = [
    { title: '姓名', dataIndex: 'name', key: 'name', sorter: true },
    { title: '年龄', dataIndex: 'age', key: 'age', sorter: true },
    { title: '城市', dataIndex: 'city', key: 'city', filters: [
      { text: '北京', value: 'beijing' },
      { text: '上海', value: 'shanghai' },
      { text: '广州', value: 'guangzhou' }
    ]},
    { title: '职业', dataIndex: 'job', key: 'job', filters: [
      { text: '工程师', value: 'engineer' },
      { text: '设计师', value: 'designer' },
      { text: '产品经理', value: 'pm' }
    ]}
  ],
  dataSource = [
    { key: '1', name: '张三', age: 28, city: 'beijing', job: 'engineer' },
    { key: '2', name: '李四', age: 32, city: 'shanghai', job: 'designer' },
    { key: '3', name: '王五', age: 25, city: 'guangzhou', job: 'pm' },
    { key: '4', name: '赵六', age: 35, city: 'beijing', job: 'engineer' },
    { key: '5', name: '钱七', age: 29, city: 'shanghai', job: 'designer' },
    { key: '6', name: '孙八', age: 31, city: 'guangzhou', job: 'pm' },
    { key: '7', name: '周九', age: 27, city: 'beijing', job: 'engineer' },
    { key: '8', name: '吴十', age: 33, city: 'shanghai', job: 'designer' },
    { key: '9', name: '郑十一', age: 26, city: 'guangzhou', job: 'pm' },
    { key: '10', name: '陈十二', age: 30, city: 'beijing', job: 'engineer' }
  ],
  pagination = true,
  rowSelection = false,
  updateProp
}: TableRendererProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [sortField, setSortField] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [filters, setFilters] = useState<Record<string, string[]>>({})

  // 确保 columns 是数组格式
  const safeColumns = Array.isArray(columns) ? columns :
    (typeof columns === 'string' ?
      (columns.startsWith('[') ? JSON.parse(columns) : []) : []
    )

  // 确保 dataSource 是数组格式
  const safeDataSource = Array.isArray(dataSource) ? dataSource :
    (typeof dataSource === 'string' ?
      (dataSource.startsWith('[') ? JSON.parse(dataSource) : []) : []
    )

  const pageSizeOptions = [5, 10, 20, 50]

  // 处理排序
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  // 排序数据
  const sortedData = [...safeDataSource].sort((a, b) => {
    if (!sortField) return 0
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (aValue === bValue) return 0
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  // 过滤数据
  const filteredData = sortedData.filter(item => {
    return Object.entries(filters).every(([field, selectedValues]) => {
      if (selectedValues.length === 0) return true
      return selectedValues.includes(item[field])
    })
  })

  // 分页数据
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedData = pagination ? filteredData.slice(startIndex, endIndex) : filteredData

  // 处理分页
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  // 处理行选择
  const handleRowSelectionChange = (selectedKeys: string[]) => {
    setSelectedRowKeys(selectedKeys)
  }

  const handleSelectAll = () => {
    const allKeys = filteredData.map(item => item.key)
    if (selectedRowKeys.length === allKeys.length) {
      setSelectedRowKeys([])
    } else {
      setSelectedRowKeys(allKeys)
    }
  }

  // 处理过滤
  const handleFilter = (field: string, value: string) => {
    const currentFilters = { ...filters }
    const fieldFilters = currentFilters[field] || []

    if (fieldFilters.includes(value)) {
      currentFilters[field] = fieldFilters.filter(f => f !== value)
    } else {
      currentFilters[field] = [...fieldFilters, value]
    }

    setFilters(currentFilters)
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(filteredData.length / pageSize)
  const allKeys = filteredData.map(item => item.key)
  const isAllSelected = allKeys.length > 0 && selectedRowKeys.length === allKeys.length

  return (
    <div className="w-full">
      {/* 表格容器 */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        {/* 表格头部 */}
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* 表头 */}
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                {/* 行选择列 */}
                {rowSelection && (
                  <th className="w-12 px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                )}

                {/* 数据列 */}
                {safeColumns.map((column) => (
                  <th
                    key={column.key || column.dataIndex}
                    className={`
                      px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider
                      ${column.sorter ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : ''}
                    `}
                    style={{ width: column.width }}
                    onClick={() => column.sorter && handleSort(column.dataIndex)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.title}</span>
                      {column.sorter && (
                        <span className="text-gray-400">
                          {sortField === column.dataIndex ? (
                            sortOrder === 'asc' ? '↑' : '↓'
                          ) : (
                            '↕'
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* 表格主体 */}
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedData.map((record, index) => (
                <tr
                  key={record.key}
                  className={`
                    hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors
                    ${selectedRowKeys.includes(record.key) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                  `}
                >
                  {/* 行选择列 */}
                  {rowSelection && (
                    <td className="w-12 px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRowKeys.includes(record.key)}
                        onChange={() => {
                          const newSelectedKeys = selectedRowKeys.includes(record.key)
                            ? selectedRowKeys.filter(key => key !== record.key)
                            : [...selectedRowKeys, record.key]
                          handleRowSelectionChange(newSelectedKeys)
                        }}
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                  )}

                  {/* 数据单元格 */}
                  {safeColumns.map((column) => (
                    <td
                      key={column.key || column.dataIndex}
                      className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100"
                      style={{ width: column.width }}
                    >
                      {record[column.dataIndex]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        {pagination && (
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              显示 {startIndex + 1}-{Math.min(endIndex, filteredData.length)} 条，
              共 {filteredData.length} 条
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  每页
                </span>
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm bg-white dark:bg-gray-700"
                >
                  {pageSizeOptions.map(size => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  上一页
                </button>

                <span className="text-sm text-gray-700 dark:text-gray-300">
                  第 {currentPage} / {totalPages} 页
                </span>

                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  下一页
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 过滤器状态 */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">表格配置</h4>
        <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400">
          <div>行选择: {rowSelection ? '启用' : '禁用'}</div>
          <div>分页: {pagination ? '启用' : '禁用'}</div>
          <div>当前页: {currentPage}</div>
          <div>每页条数: {pageSize}</div>
          <div>总数据: {safeDataSource.length}</div>
          <div>过滤后: {filteredData.length}</div>
          <div>选中行: {selectedRowKeys.length}</div>
          <div>排序: {sortField ? `${sortField} (${sortOrder})` : '无'}</div>
          <div>过滤器: {Object.keys(filters).filter(key => filters[key].length > 0).length} 个</div>
        </div>
      </div>
    </div>
  )
}