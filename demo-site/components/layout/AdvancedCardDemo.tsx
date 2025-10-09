import React from 'react'
import { Card } from '../../../src/components/Card'

export default function AdvancedCardDemo() {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">📐 布局组件 - 卡片</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">默认卡片</h3>
          <p className="text-gray-600 dark:text-gray-400">
            这是一个基础的卡片组件
          </p>
        </Card>

        <Card variant="gradient">
          <h3 className="text-lg font-semibold mb-2 text-white">渐变卡片</h3>
          <p className="text-white/90">
            支持渐变背景效果
          </p>
        </Card>

        <Card hover>
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">悬停效果</h3>
          <p className="text-gray-600 dark:text-gray-400">
            支持悬停高亮效果
          </p>
        </Card>
      </div>
    </section>
  )
}
