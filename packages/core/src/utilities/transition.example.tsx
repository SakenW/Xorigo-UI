// Transition 组件使用示例
// 这个文件展示了如何使用 Transition 组件

import React, { useState } from 'react'
import Transition, { transitionPresets, createTransition } from './transition'

export const TransitionExamples = () => {
  const [show, setShow] = useState(true)

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Transition 组件示例</h1>

      {/* 控制按钮 */}
      <div className="flex gap-2">
        <button
          onClick={() => setShow(!show)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {show ? '隐藏' : '显示'}
        </button>
      </div>

      {/* 基础淡入淡出 */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">基础淡入淡出</h2>
        <Transition
          show={show}
          config={transitionPresets.fadeIn}
          className="p-4 bg-gray-100 rounded"
        >
          <div>这是一个基础的淡入淡出动画</div>
        </Transition>
      </div>

      {/* 滑动动画 */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">滑动动画</h2>
        <Transition
          show={show}
          config={transitionPresets.slideUp}
          className="p-4 bg-green-100 rounded"
        >
          <div>这是向上滑入的动画效果</div>
        </Transition>
      </div>

      {/* 弹性动画 */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">弹性动画</h2>
        <Transition
          show={show}
          config={transitionPresets.bounceIn}
          className="p-4 bg-yellow-100 rounded"
        >
          <div>这是弹性进入动画效果</div>
        </Transition>
      </div>

      {/* 自定义配置 */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">自定义配置</h2>
        <Transition
          show={show}
          config={createTransition({
            type: 'slide',
            direction: 'left',
            duration: 0.6,
            easing: 'backOut'
          })}
          className="p-4 bg-purple-100 rounded"
        >
          <div>这是自定义的滑动动画（从左侧滑入）</div>
        </Transition>
      </div>

      {/* 子元素动画 */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">子元素动画</h2>
        <Transition
          show={show}
          animateChildren={true}
          staggerDelay={0.1}
          config={transitionPresets.fadeIn}
          className="p-4 bg-pink-100 rounded"
        >
          <div className="space-y-2">
            <div className="p-2 bg-white rounded">第一项</div>
            <div className="p-2 bg-white rounded">第二项</div>
            <div className="p-2 bg-white rounded">第三项</div>
          </div>
        </Transition>
      </div>
    </div>
  )
}

export default TransitionExamples