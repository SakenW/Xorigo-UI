import React, { useState } from "react"
import { Button } from "../../../src/components/ui/Button"
import { Card } from "../../../src/components/ui/Card"
import { Modal } from "../../../src/components/feedback/Modal"
import { useToast } from "../../../src/components/feedback/Notification"

export default function ButtonDemo() {
  const [modalOpen, setModalOpen] = useState(false)
  const { success } = useToast()

  return (
    <>
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">📝 表单组件 - 按钮</h2>
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
    </>
  )
}
