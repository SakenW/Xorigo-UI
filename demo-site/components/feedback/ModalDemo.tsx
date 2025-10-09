import React, { useState } from 'react'
import { Modal } from '../../../src/components/Modal'
import { Card } from '../../../src/components/Card'
import { Button } from '../../../src/components/Button'

export default function ModalDemo() {
  const [openBasic, setOpenBasic] = useState(false)
  const [openSmall, setOpenSmall] = useState(false)
  const [openLarge, setOpenLarge] = useState(false)
  const [openDanger, setOpenDanger] = useState(false)
  const [openSuccess, setOpenSuccess] = useState(false)
  const [openWithFooter, setOpenWithFooter] = useState(false)

  return (
    <>
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">💬 反馈组件 - 模态框</h2>
        <Card>
          <div className="space-y-6">
            {/* 基础模态框 */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">基础模态框</h3>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => setOpenBasic(true)} variant="primary">
                  打开基础模态框
                </Button>
              </div>
            </div>

            {/* 不同尺寸 */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">尺寸变体</h3>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => setOpenSmall(true)} variant="secondary">
                  小尺寸 (sm)
                </Button>
                <Button onClick={() => setOpenBasic(true)} variant="secondary">
                  中尺寸 (md)
                </Button>
                <Button onClick={() => setOpenLarge(true)} variant="secondary">
                  大尺寸 (lg)
                </Button>
              </div>
            </div>

            {/* 不同类型 */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">类型变体</h3>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => setOpenSuccess(true)} variant="success">
                  成功提示
                </Button>
                <Button onClick={() => setOpenDanger(true)} variant="danger">
                  危险警告
                </Button>
              </div>
            </div>

            {/* 带Footer */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">自定义Footer</h3>
              <Button onClick={() => setOpenWithFooter(true)} variant="primary">
                打开带Footer的模态框
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* 基础模态框 */}
      <Modal
        open={openBasic}
        onClose={() => setOpenBasic(false)}
        title="基础模态框"
      >
        <p className="text-gray-600 dark:text-gray-400">
          这是一个基础的模态框组件。点击遮罩层或按ESC键可以关闭。
        </p>
      </Modal>

      {/* 小尺寸 */}
      <Modal
        open={openSmall}
        onClose={() => setOpenSmall(false)}
        title="小尺寸模态框"
        size="sm"
      >
        <p className="text-gray-600 dark:text-gray-400">
          这是一个小尺寸的模态框。
        </p>
      </Modal>

      {/* 大尺寸 */}
      <Modal
        open={openLarge}
        onClose={() => setOpenLarge(false)}
        title="大尺寸模态框"
        size="lg"
      >
        <div className="space-y-4 text-gray-600 dark:text-gray-400">
          <p>这是一个大尺寸的模态框，可以容纳更多内容。</p>
          <p>支持任意HTML内容，包括表单、列表、图片等。</p>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
            <p className="text-sm">这是一个示例内容区域</p>
          </div>
        </div>
      </Modal>

      {/* 成功提示 */}
      <Modal
        open={openSuccess}
        onClose={() => setOpenSuccess(false)}
        title="操作成功"
        variant="success"
      >
        <p className="text-gray-600 dark:text-gray-400">
          您的操作已成功完成！
        </p>
      </Modal>

      {/* 危险警告 */}
      <Modal
        open={openDanger}
        onClose={() => setOpenDanger(false)}
        title="危险操作"
        variant="danger"
        maskClosable={false}
      >
        <p className="text-gray-600 dark:text-gray-400">
          此操作无法撤销，确定要继续吗？
        </p>
      </Modal>

      {/* 带Footer */}
      <Modal
        open={openWithFooter}
        onClose={() => setOpenWithFooter(false)}
        title="确认对话框"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setOpenWithFooter(false)}>
              取消
            </Button>
            <Button variant="primary" onClick={() => setOpenWithFooter(false)}>
              确认
            </Button>
          </div>
        }
      >
        <p className="text-gray-600 dark:text-gray-400">
          这是一个带自定义Footer的模态框，可以添加操作按钮。
        </p>
      </Modal>
    </>
  )
}
