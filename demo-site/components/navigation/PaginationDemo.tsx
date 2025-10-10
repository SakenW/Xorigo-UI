import React, { useState } from "react"
import { Pagination } from "../../../src/components/ui/Pagination"

const PaginationDemo: React.FC = () => {
  const [currentPage1, setCurrentPage1] = useState(1)
  const [currentPage2, setCurrentPage2] = useState(1)
  const [currentPage3, setCurrentPage3] = useState(5)
  const [pageSize, setPageSize] = useState(10)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Pagination 分页器
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          采用分页的形式分隔长列表，每次只加载一个页面
        </p>
      </div>

      {/* 基础用法 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          基础用法
        </h3>

        <Pagination
          currentPage={currentPage1}
          totalPages={10}
          onPageChange={setCurrentPage1}
        />
      </div>

      {/* 显示总数 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          显示总数
        </h3>

        <Pagination
          currentPage={currentPage2}
          totalPages={20}
          totalItems={200}
          onPageChange={setCurrentPage2}
          showTotal
        />
      </div>

      {/* 快速跳转 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          快速跳转
        </h3>

        <Pagination
          currentPage={currentPage3}
          totalPages={50}
          totalItems={500}
          onPageChange={setCurrentPage3}
          showTotal
          showQuickJumper
        />
      </div>

      {/* 改变每页数量 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          改变每页数量
        </h3>

        <Pagination
          currentPage={currentPage1}
          totalPages={Math.ceil(200 / pageSize)}
          totalItems={200}
          pageSize={pageSize}
          onPageChange={setCurrentPage1}
          onPageSizeChange={setPageSize}
          showTotal
          showPageSize
          pageSizeOptions={[10, 20, 30, 50]}
        />
      </div>

      {/* 完整功能 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          完整功能
        </h3>

        <Pagination
          currentPage={currentPage3}
          totalPages={100}
          totalItems={1000}
          pageSize={pageSize}
          onPageChange={setCurrentPage3}
          onPageSizeChange={setPageSize}
          showTotal
          showPageSize
          showQuickJumper
          maxPageButtons={7}
        />
      </div>

      {/* 少量页面 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          少量页面
        </h3>

        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={() => {}}
        />
      </div>

      {/* 大量页面 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          大量页面
        </h3>

        <Pagination
          currentPage={45}
          totalPages={100}
          totalItems={1000}
          onPageChange={() => {}}
          showTotal
        />
      </div>
    </div>
  )
}

export default PaginationDemo
