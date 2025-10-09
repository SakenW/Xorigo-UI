import React from 'react'
import { AnimatedCard } from '../../../src/components/AnimatedCard'
import { Card } from '../../../src/components/Card'

export default function AnimatedCardDemo() {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">🚀 高级组件 - 动画卡片</h2>
      <Card>
        <div className="space-y-6">
          {/* 基础动画卡片 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">基础样式</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <AnimatedCard variant="default" hover>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">默认卡片</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    带淡入动画的默认样式卡片
                  </p>
                </div>
              </AnimatedCard>

              <AnimatedCard variant="glass" hover>
                <div className="p-4">
                  <h4 className="font-semibold text-white mb-2">玻璃态卡片</h4>
                  <p className="text-sm text-white/80">
                    毛玻璃效果的现代风格卡片
                  </p>
                </div>
              </AnimatedCard>

              <AnimatedCard variant="gradient" hover>
                <div className="p-4">
                  <h4 className="font-semibold text-white mb-2">渐变卡片</h4>
                  <p className="text-sm text-white/80">
                    渐变背景的炫彩卡片
                  </p>
                </div>
              </AnimatedCard>

              <AnimatedCard variant="neumorphic" hover>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">新拟态卡片</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    立体阴影的新拟态风格
                  </p>
                </div>
              </AnimatedCard>
            </div>
          </div>

          {/* 交互式卡片 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">交互式卡片</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AnimatedCard
                variant="default"
                hover
                interactive
                onClick={() => alert('卡片被点击了！')}
              >
                <div className="p-6 text-center">
                  <div className="text-4xl mb-2">🎯</div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">可点击卡片</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    点击查看交互效果
                  </p>
                </div>
              </AnimatedCard>

              <AnimatedCard
                variant="glass"
                hover
                interactive
                delay={0.1}
              >
                <div className="p-6 text-center">
                  <div className="text-4xl mb-2">⚡</div>
                  <h4 className="font-semibold text-white mb-1">延迟动画</h4>
                  <p className="text-sm text-white/80">
                    0.1秒延迟进入
                  </p>
                </div>
              </AnimatedCard>

              <AnimatedCard
                variant="gradient"
                hover
                interactive
                delay={0.2}
              >
                <div className="p-6 text-center">
                  <div className="text-4xl mb-2">🌟</div>
                  <h4 className="font-semibold text-white mb-1">更长延迟</h4>
                  <p className="text-sm text-white/80">
                    0.2秒延迟进入
                  </p>
                </div>
              </AnimatedCard>
            </div>
          </div>

          {/* 悬停效果对比 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">悬停效果对比</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatedCard variant="default">
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">无悬停效果</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    这个卡片没有悬停动画效果
                  </p>
                </div>
              </AnimatedCard>

              <AnimatedCard variant="default" hover>
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">启用悬停效果</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    鼠标悬停查看上浮和缩放动画
                  </p>
                </div>
              </AnimatedCard>
            </div>
          </div>
        </div>
      </Card>
    </section>
  )
}
