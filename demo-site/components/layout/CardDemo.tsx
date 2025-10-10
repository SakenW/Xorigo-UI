import React from "react"
import { Card } from "../../../src/components/ui/Card"

export default function CardDemo() {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">📐 布局组件 - 基础卡片</h2>
      <div className="space-y-6">
        {/* 基础变体 */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">基础样式变体</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card variant="default">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">默认卡片</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                基础的卡片样式
              </p>
            </Card>

            <Card variant="elevated">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">提升卡片</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                更明显的阴影效果
              </p>
            </Card>

            <Card variant="outlined">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">描边卡片</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                透明背景带边框
              </p>
            </Card>

            <Card variant="interactive" hover>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">交互卡片</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                可点击的卡片样式
              </p>
            </Card>
          </div>
        </div>

        {/* 特殊效果变体 */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">特殊效果</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card variant="glass" hover>
              <h4 className="font-semibold text-white mb-2">玻璃态</h4>
              <p className="text-sm text-white/80">
                毛玻璃效果卡片
              </p>
            </Card>

            <Card variant="gradient" hover>
              <h4 className="font-semibold text-white mb-2">渐变</h4>
              <p className="text-sm text-white/90">
                渐变背景卡片
              </p>
            </Card>

            <Card variant="neon" hover>
              <h4 className="font-semibold mb-2">霓虹</h4>
              <p className="text-sm text-cyan-300">
                霓虹发光效果
              </p>
            </Card>
          </div>
        </div>

        {/* 新拟态 */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">新拟态风格</h3>
          <Card variant="neumorphic" size="lg">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">新拟态卡片</h4>
            <p className="text-gray-600 dark:text-gray-400">
              这是一个新拟态风格的卡片，具有立体浮雕效果的阴影设计。
            </p>
          </Card>
        </div>

        {/* 不同尺寸 */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">尺寸变体</h3>
          <div className="space-y-4">
            <Card variant="default" size="sm">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                小尺寸卡片 (sm) - 紧凑的内边距
              </p>
            </Card>

            <Card variant="default" size="md">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                中尺寸卡片 (md) - 默认内边距
              </p>
            </Card>

            <Card variant="default" size="lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                大尺寸卡片 (lg) - 宽松的内边距
              </p>
            </Card>

            <Card variant="default" size="xl">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                超大尺寸卡片 (xl) - 最宽松的内边距
              </p>
            </Card>
          </div>
        </div>

        {/* 动画效果 */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">动画效果</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card variant="default" hover animated>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">悬停动画</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                鼠标悬停时有过渡动画效果
              </p>
            </Card>

            <Card variant="interactive" hover click animated>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">点击反馈</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                点击时有缩放反馈效果
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
