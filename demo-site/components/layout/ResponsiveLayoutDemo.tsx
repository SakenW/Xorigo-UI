import React, { useState } from "react"
import { ResponsiveLayout, ResponsiveGrid, ResponsiveContainer, ResponsiveSpacing } from "../../../src/components/navigation/ResponsiveLayout"
import { Card } from "../../../src/components/ui/Card"

export default function ResponsiveLayoutDemo() {
  const [showLayout, setShowLayout] = useState(false)

  // 侧边栏内容
  const sidebarContent = (
    <div className="p-4 space-y-2">
      <div className="text-lg font-bold mb-4">导航菜单</div>
      <a href="#" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
        首页
      </a>
      <a href="#" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
        组件库
      </a>
      <a href="#" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
        文档
      </a>
      <a href="#" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
        关于
      </a>
    </div>
  )

  // 头部内容
  const headerContent = (
    <div className="flex items-center space-x-4">
      <h1 className="text-lg font-semibold">TH-UI 组件库</h1>
    </div>
  )

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">🎨 布局组件 - 响应式布局</h2>

      {/* 响应式网格演示 */}
      <Card className="mb-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">响应式网格 (ResponsiveGrid)</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">自动适应不同屏幕尺寸的网格布局</p>

        <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 3, xl: 4 }} gap={4}>
          <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200">卡片 1</h4>
            <p className="text-sm text-blue-600 dark:text-blue-300">响应式网格项目</p>
          </div>
          <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <h4 className="font-semibold text-green-800 dark:text-green-200">卡片 2</h4>
            <p className="text-sm text-green-600 dark:text-green-300">响应式网格项目</p>
          </div>
          <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <h4 className="font-semibold text-purple-800 dark:text-purple-200">卡片 3</h4>
            <p className="text-sm text-purple-600 dark:text-purple-300">响应式网格项目</p>
          </div>
          <div className="p-4 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
            <h4 className="font-semibold text-orange-800 dark:text-orange-200">卡片 4</h4>
            <p className="text-sm text-orange-600 dark:text-orange-300">响应式网格项目</p>
          </div>
        </ResponsiveGrid>
      </Card>

      {/* 响应式容器演示 */}
      <Card className="mb-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">响应式容器 (ResponsiveContainer)</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">控制最大宽度的响应式容器</p>

        <div className="space-y-4">
          <ResponsiveContainer size="sm">
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">小容器 (max-w-2xl)</p>
            </div>
          </ResponsiveContainer>

          <ResponsiveContainer size="md">
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">中等容器 (max-w-4xl)</p>
            </div>
          </ResponsiveContainer>

          <ResponsiveContainer size="lg">
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">大容器 (max-w-6xl)</p>
            </div>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 响应式间距演示 */}
      <Card className="mb-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">响应式间距 (ResponsiveSpacing)</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">根据屏幕尺寸自动调整间距</p>

        <ResponsiveSpacing
          size={{ y: 4 }}
          responsive={{ sm: 4, md: 6, lg: 8, xl: 10 }}
        >
          <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-center">
            <p className="text-sm text-indigo-600 dark:text-indigo-300">
              间距会根据屏幕尺寸自动调整 (sm:4 → md:6 → lg:8 → xl:10)
            </p>
          </div>
        </ResponsiveSpacing>
      </Card>

      {/* 完整布局演示 */}
      <Card>
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">完整响应式布局 (ResponsiveLayout)</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          包含侧边栏、头部和内容区域的完整响应式布局系统
        </p>

        <button
          onClick={() => setShowLayout(!showLayout)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showLayout ? '关闭布局演示' : '打开布局演示'}
        </button>

        {showLayout && (
          <div className="mt-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden" style={{ height: '500px' }}>
            <ResponsiveLayout
              sidebar={sidebarContent}
              header={headerContent}
              sidebarWidth={280}
              collapsible={true}
            >
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">欢迎使用响应式布局</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  这是一个完整的响应式布局系统，支持：
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                  <li>桌面端：可折叠的侧边栏</li>
                  <li>移动端：抽屉式侧边栏</li>
                  <li>响应式头部导航</li>
                  <li>流畅的动画过渡</li>
                  <li>深色模式支持</li>
                </ul>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">特性 1</h4>
                    <p className="text-sm text-blue-600 dark:text-blue-300">
                      自动适应屏幕尺寸
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">特性 2</h4>
                    <p className="text-sm text-green-600 dark:text-green-300">
                      流畅的动画效果
                    </p>
                  </div>
                </div>
              </div>
            </ResponsiveLayout>
          </div>
        )}
      </Card>
    </section>
  )
}
