'use client'

import React from 'react'
import { GradientDemo } from '../../../src/components/workbench/gradient-demo/gradient-demo'

export default function GradientWorkbenchPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* 标题区域 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Xorigo UI 渐变工作台
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            令牌化渐变系统的完整演示和交互体验
          </p>
        </div>

        {/* 渐变演示内容 */}
        <GradientDemo />
      </div>
    </div>
  )
}