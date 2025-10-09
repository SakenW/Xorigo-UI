import React, { useState } from 'react'
import {
  RippleEffect,
  PulseLoader,
  MagneticButton,
  TypewriterText,
  ScrollIndicator
} from '../../../src/components/MicroInteractions'
import { Card } from '../../../src/components/Card'
import { Button } from '../../../src/components/Button'

export default function MicroInteractionsDemo() {
  const [showTyping, setShowTyping] = useState(false)

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">🚀 高级组件 - 微交互</h2>
      <Card>
        <div className="space-y-6">
          {/* 涟漪效果 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">涟漪效果 (RippleEffect)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <RippleEffect className="p-6 bg-blue-500 rounded-lg cursor-pointer">
                <p className="text-white text-center font-medium">
                  点击查看涟漪效果
                </p>
              </RippleEffect>

              <RippleEffect
                className="p-6 bg-green-500 rounded-lg cursor-pointer"
                color="rgba(255, 255, 255, 0.7)"
              >
                <p className="text-white text-center font-medium">
                  白色涟漪
                </p>
              </RippleEffect>

              <RippleEffect
                className="p-6 bg-purple-500 rounded-lg cursor-pointer"
                duration={1000}
              >
                <p className="text-white text-center font-medium">
                  慢速涟漪
                </p>
              </RippleEffect>
            </div>
          </div>

          {/* 脉冲加载器 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">脉冲加载器 (PulseLoader)</h3>
            <div className="flex flex-wrap gap-8 items-center">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">小尺寸</p>
                <PulseLoader size="sm" />
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">中尺寸</p>
                <PulseLoader size="md" />
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">大尺寸</p>
                <PulseLoader size="lg" />
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">自定义颜色</p>
                <PulseLoader color="bg-green-500" />
              </div>
            </div>
          </div>

          {/* 磁性按钮 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">磁性按钮 (MagneticButton)</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              鼠标移动时按钮会被"吸引"跟随鼠标
            </p>
            <div className="flex flex-wrap gap-6">
              <MagneticButton className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium">
                磁性按钮
              </MagneticButton>

              <MagneticButton
                className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium"
                strength={0.5}
              >
                强磁性
              </MagneticButton>

              <MagneticButton
                className="px-6 py-3 bg-purple-500 text-white rounded-lg font-medium"
                strength={0.1}
              >
                弱磁性
              </MagneticButton>
            </div>
          </div>

          {/* 打字机效果 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">打字机效果 (TypewriterText)</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
                <TypewriterText
                  text="欢迎使用 TH-UI 组件库！这是一个打字机效果的演示。"
                  className="text-lg text-gray-900 dark:text-white"
                  speed={50}
                />
              </div>

              <div className="flex gap-4 items-center">
                <Button variant="primary" onClick={() => setShowTyping(!showTyping)}>
                  {showTyping ? '重置' : '开始打字'}
                </Button>
                {showTyping && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <TypewriterText
                      text="这是动态触发的打字机效果"
                      className="text-blue-600 dark:text-blue-400"
                      speed={80}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 滚动进度指示器 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">滚动进度指示器 (ScrollIndicator)</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              页面顶部的蓝色进度条会随着滚动进度变化
            </p>
            <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ScrollIndicator 组件已经在页面顶部激活，向下滚动页面即可看到进度条的变化。
              </p>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                提示：组件会固定在页面顶部，显示当前滚动百分比
              </div>
            </div>
          </div>

          {/* 组件说明 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">可用组件列表</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">✅ RippleEffect</h4>
                <p className="text-gray-600 dark:text-gray-400">点击时产生水波纹扩散效果</p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">✅ PulseLoader</h4>
                <p className="text-gray-600 dark:text-gray-400">脉冲动画加载指示器</p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">✅ MagneticButton</h4>
                <p className="text-gray-600 dark:text-gray-400">鼠标吸引跟随的磁性按钮</p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">✅ TypewriterText</h4>
                <p className="text-gray-600 dark:text-gray-400">逐字显示的打字机效果</p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">✅ ScrollIndicator</h4>
                <p className="text-gray-600 dark:text-gray-400">页面滚动进度指示器</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* ScrollIndicator 实例 */}
      <ScrollIndicator />
    </section>
  )
}
