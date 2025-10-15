/**
 * 简化的 Workbench 页面 - 服务器端组件
 * 直接导入客户端组件，不使用动态导入
 */

import { WorkbenchClient } from './workbench-client'

/**
 * Workbench 服务器端页面
 * 直接使用客户端组件
 */
export default function WorkbenchPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* 标题区域 - 服务器端渲染 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Xorigo UI Workbench
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            组件开发、测试和调试工作台
          </p>
        </div>

        {/* 客户端交互区域 */}
        <WorkbenchClient />

        {/* 底部信息 - 服务器端渲染 */}
        <div className="mt-16 text-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              开发环境信息
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p>React: 19.x | Next.js: 15.x | TypeScript: 5.9.x</p>
              <p>构建时间: {new Date().toLocaleString()}</p>
              <p>渲染模式: 服务器端 + 客户端组件</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}