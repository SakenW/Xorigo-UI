'use client'

import React from 'react'
import { SuperParticleSystem } from '@xorigo-ui/core'

export default function TestFireflyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
      <div className="relative z-10 p-8">
        <h1 className="text-4xl font-bold text-white mb-4">萤火虫测试页面</h1>
        <p className="text-xl text-white/80">这个页面用于测试SuperParticleSystem组件</p>
        <div className="mt-8 p-4 bg-white/10 backdrop-blur rounded-lg">
          <h2 className="text-2xl font-semibold text-white mb-2">测试说明</h2>
          <ul className="text-white/80 space-y-1">
            <li>✅ 页面应该显示渐变背景</li>
            <li>✅ 页面上应该有萤火虫在飞舞</li>
            <li>✅ 鼠标移动时萤火虫会被吸引</li>
            <li>✅ 鼠标停止时萤火虫会环绕鼠标</li>
          </ul>
        </div>
      </div>

      {/* SuperParticleSystem组件 */}
      <SuperParticleSystem />
    </div>
  )
}