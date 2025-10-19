'use client'

import React from 'react'
import { SuperParticleSystemSimple } from '@xorigo-ui/core'

export default function TestSimpleFireflyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="relative z-10 p-8">
        <h1 className="text-4xl font-bold text-white mb-4">简化版萤火虫测试</h1>
        <p className="text-xl text-white/80 mb-4">这个页面使用简化版SuperParticleSystemSimple组件</p>
        <div className="p-4 bg-white/10 backdrop-blur rounded-lg max-w-2xl">
          <h2 className="text-2xl font-semibold text-white mb-4">调试说明</h2>
          <div className="space-y-3 text-white/80">
            <p>✅ 如果看到黄色发光的萤火虫，说明组件工作正常</p>
            <p>✅ 萤火虫会被鼠标吸引</p>
            <p>✅ 萤火虫会在屏幕边界环绕</p>
            <p>✅ 使用硬编码颜色，避免CSS变量问题</p>
            <div className="mt-4 p-3 bg-yellow-500/20 rounded border border-yellow-500/30">
              <p className="text-yellow-300">
                <strong>测试要点：</strong>
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>移动鼠标看萤火虫是否跟随</li>
                <li>检查是否有20个萤火虫</li>
                <li>观察萤火虫是否有发光效果</li>
                <li>查看浏览器控制台是否有错误</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 简化版 SuperParticleSystem 组件 */}
      <SuperParticleSystemSimple />
    </div>
  )
}