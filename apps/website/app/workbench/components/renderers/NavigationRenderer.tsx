'use client'

import React, { useState } from 'react'

interface NavItem {
  title: string
  href?: string
  icon?: string
  badge?: string
}

interface NavigationRendererProps {
  type?: 'menu' | 'anchor' | 'backtop'
  items?: NavItem[]
  position?: 'top' | 'bottom' | 'fixed'
  updateProp?: (prop: string, value: any) => void
}

export default function NavigationRenderer({
  type = 'menu',
  items = [
    { title: '首页', href: '#home', icon: '🏠' },
    { title: '产品', href: '#products', icon: '📦', badge: '3' },
    { title: '服务', href: '#services', icon: '⚙️' },
    { title: '关于', href: '#about', icon: 'ℹ️' },
    { title: '联系', href: '#contact', icon: '📧' }
  ],
  position = 'top',
  updateProp
}: NavigationRendererProps) {
  const [activeItem, setActiveItem] = useState(0)

  if (type === 'menu') {
    return (
      <div className="w-full">
        {/* 菜单导航 */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
          <div className="flex items-center space-x-1 p-2">
            {items.map((item, index) => (
              <button
                key={`nav-menu-${item.title}-${item.href}-${index}`}
                onClick={() => setActiveItem(index)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
                  ${activeItem === index
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                {item.icon && <span>{item.icon}</span>}
                <span>{item.title}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 配置面板 */}
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            菜单导航配置
          </h4>
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400">
            <div>当前位置: {items[activeItem]?.title}</div>
            <div>菜单项数量: {items.length}</div>
            <div>位置: {position === 'top' ? '顶部' : position === 'bottom' ? '底部' : '固定'}</div>
            <div>带徽章: {items.filter(item => item.badge).length} 个</div>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'anchor') {
    return (
      <div className="w-full">
        {/* 锚点导航 */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            页面锚点导航
          </h4>
          <div className="space-y-2">
            {items.map((item, index) => (
              <a
                key={`nav-anchor-${item.title}-${item.href}-${index}`}
                href={item.href}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors block
                  ${activeItem === index
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
                onClick={() => setActiveItem(index)}
              >
                {item.icon && <span>{item.icon}</span>}
                <span>{item.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* 配置信息 */}
        <div className="mt-4 text-xs text-gray-600 dark:text-gray-400">
          锚点导航用于页面内快速定位和跳转
        </div>
      </div>
    )
  }

  if (type === 'backtop') {
    const [isVisible, setIsVisible] = useState(true)

    return (
      <div className="w-full relative h-64">
        {/* 返回顶部按钮 */}
        <div className="h-full bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            页面内容区域（滚动查看返回顶部按钮效果）
          </p>

          {/* 返回顶部按钮 */}
          {isVisible && (
            <button
              onClick={() => {
                setIsVisible(false)
                setTimeout(() => setIsVisible(true), 1000)
              }}
              className="fixed bottom-8 right-8 w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
            >
              <svg
                className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>

        {/* 配置面板 */}
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            返回顶部配置
          </h4>
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400">
            <div>显示状态: {isVisible ? '显示' : '隐藏'}</div>
            <div>位置: 右下角固定</div>
            <div>样式: 圆形按钮</div>
            <div>颜色: 蓝色主题</div>
          </div>
        </div>
      </div>
    )
  }

  return null
}