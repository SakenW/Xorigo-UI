'use client'

import { useState } from 'react'

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = [
    {
      id: 'buttons',
      title: '按钮组件',
      emoji: '🔘',
      desc: '各种样式的按钮组件集合',
      component: <ButtonShowcase />
    },
    {
      id: 'cards',
      title: '卡片布局',
      emoji: '🃏',
      desc: '响应式卡片布局模式',
      component: <CardShowcase />
    },
    {
      id: 'forms',
      title: '表单模板',
      emoji: '📝',
      desc: '完整的表单页面模板',
      component: <FormShowcase />
    },
    {
      id: 'navigation',
      title: '导航组件',
      emoji: '🧭',
      desc: '多种导航栏组件样式',
      component: <NavigationShowcase />
    },
    {
      id: 'tables',
      title: '数据表格',
      emoji: '📊',
      desc: '功能完整的数据表格组件',
      component: <TableShowcase />
    },
    {
      id: 'modals',
      title: '模态框系统',
      emoji: '🪟',
      desc: '灵活的模态框和弹窗系统',
      component: <ModalShowcase />
    },
    {
      id: 'dashboard',
      title: '仪表板模板',
      emoji: '📈',
      desc: '管理后台仪表板模板',
      component: <DashboardShowcase />
    },
    {
      id: 'loading',
      title: '加载动画',
      emoji: '⏳',
      desc: '各种加载状态和动画效果',
      component: <LoadingShowcase />
    },
  ]

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">组件画廊</h1>
      <p className="text-lg text-gray-600 mb-8">
        探索 TH-UI 组件库的完整设计系统和界面模式
      </p>

      {selectedCategory ? (
        <div>
          <button
            onClick={() => setSelectedCategory(null)}
            className="mb-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            ← 返回分类
          </button>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">{selectedCategoryData?.emoji}</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedCategoryData?.title}</h2>
                <p className="text-gray-600">{selectedCategoryData?.desc}</p>
              </div>
            </div>

            <div className="border-t pt-6">
              {selectedCategoryData?.component}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer hover:border-blue-300"
            >
              <div className="text-4xl mb-4 text-center">{category.emoji}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{category.title}</h3>
              <p className="text-sm text-gray-600">{category.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// 组件展示区域
function ButtonShowcase() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">基础按钮</h3>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">主要按钮</button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">次要按钮</button>
          <button className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">边框按钮</button>
          <button className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">幽灵按钮</button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">按钮尺寸</h3>
        <div className="flex flex-wrap items-center gap-3">
          <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm">小按钮</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">中按钮</button>
          <button className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-lg">大按钮</button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">状态按钮</h3>
        <div className="flex flex-wrap gap-3">
          <button disabled className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed">禁用状态</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            加载中...
          </button>
        </div>
      </div>
    </div>
  )
}

function CardShowcase() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-lg font-semibold mb-2">基础卡片</div>
        <p className="text-gray-600">这是一个基础的卡片组件，包含标题和内容区域。</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border-2 border-blue-200 p-6">
        <div className="text-lg font-semibold mb-2">带边框卡片</div>
        <p className="text-gray-600">带有彩色边框的卡片样式，用于突出显示重要内容。</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-lg font-semibold mb-2">阴影卡片</div>
        <p className="text-gray-600">带有阴影效果的卡片，提供更好的视觉层次感。</p>
      </div>
    </div>
  )
}

function FormShowcase() {
  return (
    <div className="space-y-6 max-w-md">
      <div>
        <h3 className="text-lg font-semibold mb-3">输入框组件</h3>
        <div className="space-y-4">
          <input type="text" placeholder="请输入用户名" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="password" placeholder="请输入密码" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="email" placeholder="请输入邮箱" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input disabled placeholder="禁用状态" className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">表单组合</h3>
        <div className="space-y-4">
          <input type="text" placeholder="姓名" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="email" placeholder="邮箱" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">提交</button>
            <button className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">取消</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function NavigationShowcase() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">导航标签</h3>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">首页</span>
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">产品</span>
          <span className="px-3 py-1 border border-gray-300 text-gray-700 rounded-full text-sm">关于我们</span>
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">联系</span>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">按钮导航</h3>
        <div className="flex gap-3">
          <button className="px-3 py-1 text-gray-700 hover:bg-gray-100 transition-colors text-sm">首页</button>
          <button className="px-3 py-1 text-gray-700 hover:bg-gray-100 transition-colors text-sm">产品</button>
          <button className="px-3 py-1 text-gray-700 hover:bg-gray-100 transition-colors text-sm">服务</button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm">开始使用</button>
        </div>
      </div>
    </div>
  )
}

function TableShowcase() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-300 px-4 py-2 text-left">姓名</th>
            <th className="border border-gray-300 px-4 py-2 text-left">邮箱</th>
            <th className="border border-gray-300 px-4 py-2 text-left">状态</th>
            <th className="border border-gray-300 px-4 py-2 text-left">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 px-4 py-2">张三</td>
            <td className="border border-gray-300 px-4 py-2">zhang@example.com</td>
            <td className="border border-gray-300 px-4 py-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">活跃</span>
            </td>
            <td className="border border-gray-300 px-4 py-2">
              <button className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">编辑</button>
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">李四</td>
            <td className="border border-gray-300 px-4 py-2">li@example.com</td>
            <td className="border border-gray-300 px-4 py-2">
              <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">离线</span>
            </td>
            <td className="border border-gray-300 px-4 py-2">
              <button className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">编辑</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function ModalShowcase() {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-md">
        <h3 className="text-lg font-semibold mb-3">模态框示例</h3>
        <p className="text-gray-600 mb-4">这是一个模拟的模态框内容区域。在实际应用中，这会以弹窗形式显示。</p>
        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors">取消</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">确认</button>
        </div>
      </div>
    </div>
  )
}

function DashboardShowcase() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-2xl font-bold text-blue-600 mb-2">1,234</div>
        <div className="text-sm text-gray-600">总用户数</div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-2xl font-bold text-green-600 mb-2">5,678</div>
        <div className="text-sm text-gray-600">月活跃用户</div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-2xl font-bold text-purple-600 mb-2">89%</div>
        <div className="text-sm text-gray-600">满意度</div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-2xl font-bold text-orange-600 mb-2">42</div>
        <div className="text-sm text-gray-600">新订单</div>
      </div>
    </div>
  )
}

function LoadingShowcase() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">加载状态</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
            <span>脉冲动画</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-blue-600 rounded animate-spin"></div>
            <span>旋转动画</span>
          </div>

          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            加载中...
          </button>
        </div>
      </div>
    </div>
  )
}
