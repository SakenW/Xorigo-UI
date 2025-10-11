/**
 * 📖 配方页面使用指南
 */

import React from 'react'

export function RecipeGuide() {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
        📍 在哪里能看到配色变化？
      </h3>
      <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
        <li>• <strong>整个页面背景色</strong>会立即改变</li>
        <li>• <strong>卡片组件的颜色</strong>会切换到新的配色方案</li>
        <li>• <strong>按钮、输入框、文本</strong>的颜色都会相应变化</li>
        <li>• <strong>右侧预览面板</strong>会展示新配色的UI组件效果</li>
        <li>• <strong>选中的配方卡片</strong>会有明显的边框和勾选标记</li>
      </ul>
      <p className="text-xs text-blue-700 dark:text-blue-300 mt-3">
        💡 提示：点击不同的配色方案，观察整个界面的颜色变化！
      </p>
    </div>
  )
}