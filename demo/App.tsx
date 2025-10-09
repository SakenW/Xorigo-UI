import React, { useState } from 'react'
import { Button } from '../src/components/Button'
import { Card } from '../src/components/Card'
import { Input } from '../src/components/Input'
import { ThemeToggle } from '../src/components/ThemeToggle'
import { Modal } from '../src/components/Modal'
import { Alert } from '../src/components/Alert'
import { DataTable } from '../src/components/DataTable'
import { useToast, ToastProvider } from '../src/components/Notification'

function DemoContent() {
  const [modalOpen, setModalOpen] = useState(false)
  const { success, error } = useToast()

  const tableData = [
    { id: 1, name: 'TH-UI', type: '组件库', status: 'active' },
    { id: 2, name: 'React 19', type: '框架', status: 'active' },
    { id: 3, name: 'Tailwind CSS 4', type: '样式', status: 'active' },
  ]

  const tableColumns = [
    { key: 'name', header: '名称', sortable: true },
    { key: 'type', header: '类型', sortable: true },
    { key: 'status', header: '状态', sortable: false },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                TH-UI 组件库
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                基于 React 19 + TypeScript + Tailwind CSS 4 + Framer Motion 12
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Alerts Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">警告提示</h2>
          <div className="space-y-4">
            <Alert variant="info" title="信息提示">
              这是一个信息提示组件,用于向用户展示一般性信息。
            </Alert>
            <Alert variant="success" title="成功提示">
              操作已成功完成!所有组件都已成功迁移。
            </Alert>
            <Alert variant="warning" title="警告提示" closable>
              请注意:TypeScript严格模式已临时禁用,建议后续修复类型错误。
            </Alert>
            <Alert variant="error" title="错误提示" closable>
              这是一个错误提示,通常用于显示操作失败或异常情况。
            </Alert>
          </div>
        </section>

        {/* Buttons Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">按钮组件</h2>
          <Card>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" size="sm">Primary Small</Button>
                <Button variant="secondary" size="md">Secondary Medium</Button>
                <Button variant="success" size="lg">Success Large</Button>
                <Button variant="warning">Warning</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" loading>Loading...</Button>
                <Button variant="primary" disabled>Disabled</Button>
                <Button
                  variant="primary"
                  icon={<span>🚀</span>}
                  iconPosition="left"
                >
                  With Icon
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setModalOpen(true)
                    success('按钮点击', '成功打开模态框!')
                  }}
                >
                  打开模态框
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Forms Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">表单组件</h2>
          <Card>
            <div className="space-y-4 max-w-md">
              <Input
                label="用户名"
                placeholder="请输入用户名"
                variant="default"
              />
              <Input
                label="邮箱"
                type="email"
                placeholder="example@email.com"
                variant="outlined"
                floatingLabel
              />
              <Input
                label="密码"
                type="password"
                placeholder="请输入密码"
                variant="filled"
                showPasswordToggle
              />
              <Input
                label="备注"
                placeholder="最多100字"
                maxLength={100}
                showCount
                error="这是一个错误提示示例"
              />
            </div>
          </Card>
        </section>

        {/* Data Table Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">数据表格</h2>
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

        {/* Theme Info */}
        <section className="mb-8">
          <Card variant="gradient" hover glow>
            <div className="text-center py-8">
              <h3 className="text-2xl font-bold mb-2 text-white">🎨 主题系统</h3>
              <p className="text-white/90">
                支持10种精美主题配色,点击右上角切换主题按钮体验
              </p>
              <div className="mt-6 text-white">
                经典系列 • 现代系列 • 自然系列 • 优雅系列 • 活力系列
              </div>
            </div>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="container mx-auto px-6 py-6 text-center text-gray-600 dark:text-gray-400">
          <p className="text-sm">
            TH-UI v0.1.0 | 基于 Trans-Hub 设计系统 |
            <span className="mx-2">•</span>
            17个组件已迁移
          </p>
        </div>
      </footer>

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} size="md">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">模态框标题</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            这是一个模态框组件示例。支持不同尺寸、ESC键关闭、背景点击关闭等功能。
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              取消
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setModalOpen(false)
                success('操作成功', '模态框已确认!')
              }}
            >
              确认
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <DemoContent />
    </ToastProvider>
  )
}
