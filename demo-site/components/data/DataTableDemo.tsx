import React from 'react'
import { Card } from '../../../src/components/Card'
import { DataTable } from '../../../src/components/DataTable'
import { useToast } from '../../../src/components/Notification'

export default function DataTableDemo() {
  const { success } = useToast()

  const tableData = [
    { id: 1, name: 'TH-UI', type: '组件库', status: 'active' },
    { id: 2, name: 'React 19', type: '框架', status: 'active' },
    { id: 3, name: 'Tailwind CSS 3', type: '样式', status: 'active' },
  ]

  const tableColumns = [
    { key: 'name', header: '名称', sortable: true },
    { key: 'type', header: '类型', sortable: true },
    { key: 'status', header: '状态', sortable: false },
  ]

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">📊 数据展示 - 表格</h2>
      <Card>
        <DataTable
          columns={tableColumns}
          data={tableData}
          selectable
          striped
          hoverable
          onRowClick={(row) => success('行点击', `点击了: ${row.name}`)}
        />
      </Card>
    </section>
  )
}
