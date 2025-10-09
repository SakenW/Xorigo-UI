import React from 'react'
import { Alert } from '../../../src/components/Alert'

export default function AlertDemo() {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">💬 反馈组件 - 警告提示</h2>
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
  )
}
