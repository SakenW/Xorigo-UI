import React from 'react'
import { ThemeToggle } from '../../../src/components/ThemeToggle'
import { Card } from '../../../src/components/Card'

export default function ThemeToggleDemo() {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">🚀 高级组件 - 主题切换</h2>
      <Card>
        <div className="space-y-6">
          {/* 基础使用 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">基础主题切换</h3>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                点击切换明暗主题
              </p>
            </div>
          </div>

          {/* 功能说明 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">功能特性</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong className="text-gray-900 dark:text-white">自动检测</strong>：
                  根据系统主题自动设置初始主题
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong className="text-gray-900 dark:text-white">持久化存储</strong>：
                  主题偏好保存在localStorage中
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong className="text-gray-900 dark:text-white">流畅动画</strong>：
                  主题切换时有平滑的过渡动画
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong className="text-gray-900 dark:text-white">辅助功能</strong>：
                  支持键盘导航和屏幕阅读器
                </p>
              </div>
            </div>
          </div>

          {/* 主题预览 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">主题效果预览</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 明亮主题预览 */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">☀️ 明亮主题</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
                    <span className="text-gray-600">背景: 白色</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-900 rounded"></div>
                    <span className="text-gray-600">文字: 深色</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-gray-600">主色: 蓝色</span>
                  </div>
                </div>
              </div>

              {/* 暗黑主题预览 */}
              <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                <h4 className="font-semibold text-white mb-2">🌙 暗黑主题</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-800 border border-gray-700 rounded"></div>
                    <span className="text-gray-300">背景: 深色</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-white rounded"></div>
                    <span className="text-gray-300">文字: 亮色</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-400 rounded"></div>
                    <span className="text-gray-300">主色: 蓝色</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 使用说明 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">集成说明</h3>
            <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                ThemeToggle组件已经内置在页面右上角，您可以随时切换主题查看所有组件在不同主题下的表现。
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                组件库支持10种配色主题，可以通过ThemeProvider进行配置。
              </p>
            </div>
          </div>
        </div>
      </Card>
    </section>
  )
}
