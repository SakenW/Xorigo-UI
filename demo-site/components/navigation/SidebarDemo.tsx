import React, { useState } from "react"
import { Sidebar } from "../../../src/components/navigation/Sidebar"
import { Card } from "../../../src/components/ui/Card"
import { Button } from "../../../src/components/ui/Button"
import { useToast } from "../../../src/components/feedback/Notification"

export default function SidebarDemo() {
  const [collapsed1, setCollapsed1] = useState(false)
  const [collapsed2, setCollapsed2] = useState(false)
  const { info } = useToast()

  const basicItems = [
    {
      id: 'dashboard',
      label: '仪表盘',
      icon: <span>📊</span>,
      href: '#dashboard',
      active: true,
    },
    {
      id: 'users',
      label: '用户管理',
      icon: <span>👥</span>,
      href: '#users',
      badge: '12',
    },
    {
      id: 'settings',
      label: '设置',
      icon: <span>⚙️</span>,
      href: '#settings',
    },
  ]

  const nestedItems = [
    {
      id: 'home',
      label: '首页',
      icon: <span>🏠</span>,
      href: '#home',
      active: true,
    },
    {
      id: 'products',
      label: '产品管理',
      icon: <span>📦</span>,
      children: [
        { id: 'products-list', label: '产品列表', href: '#products-list' },
        { id: 'products-add', label: '添加产品', href: '#products-add', badge: 'New' },
        { id: 'products-categories', label: '分类管理', href: '#categories' },
      ],
    },
    {
      id: 'orders',
      label: '订单管理',
      icon: <span>🛒</span>,
      children: [
        { id: 'orders-pending', label: '待处理', href: '#pending', badge: '5' },
        { id: 'orders-completed', label: '已完成', href: '#completed' },
      ],
    },
    {
      id: 'analytics',
      label: '数据分析',
      icon: <span>📈</span>,
      href: '#analytics',
    },
  ]

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">🧭 导航组件 - 侧边栏</h2>
      <div className="space-y-6">
        {/* 基础侧边栏 */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">基础侧边栏</h3>
          <Card>
            <div className="flex gap-4">
              <div className="shrink-0">
                <Sidebar
                  items={basicItems}
                  collapsed={collapsed1}
                  onCollapsedChange={setCollapsed1}
                  onItemClick={(item) => info('导航', `点击了: ${item.label}`)}
                />
              </div>
              <div className="flex-1 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">内容区域</h4>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setCollapsed1(!collapsed1)}
                  >
                    {collapsed1 ? '展开' : '收起'}侧边栏
                  </Button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  这是主内容区域。侧边栏支持展开/收起功能，在收起状态下只显示图标。
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* 多级菜单 */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">多级菜单侧边栏</h3>
          <Card>
            <div className="flex gap-4">
              <div className="shrink-0">
                <Sidebar
                  items={nestedItems}
                  collapsed={collapsed2}
                  onCollapsedChange={setCollapsed2}
                  logoText="TH-UI Pro"
                  logo={<span className="text-2xl">🎨</span>}
                  onItemClick={(item) => info('导航', `点击了: ${item.label}`)}
                  footer={
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        v1.0.0
                      </p>
                    </div>
                  }
                />
              </div>
              <div className="flex-1 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">高级功能演示</h4>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setCollapsed2(!collapsed2)}
                  >
                    {collapsed2 ? '展开' : '收起'}
                  </Button>
                </div>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                    <p>支持多级嵌套菜单，可以展开/收起子菜单</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                    <p>菜单项可以显示徽章（如"New"或数字）</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                    <p>支持自定义Logo和Footer区域</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                    <p>收起状态下自动隐藏文字，只显示图标</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* 使用说明 */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">特性说明</h3>
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">基础功能</h4>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                  <li>• 展开/收起切换</li>
                  <li>• 图标和文字显示</li>
                  <li>• 活动状态高亮</li>
                  <li>• 点击事件处理</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">高级功能</h4>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                  <li>• 多级嵌套菜单</li>
                  <li>• 徽章数字/文字</li>
                  <li>• 自定义Logo区域</li>
                  <li>• 自定义Footer区域</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
