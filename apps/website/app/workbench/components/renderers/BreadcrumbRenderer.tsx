'use client'

import React from 'react'

interface BreadcrumbItem {
  title: string
  href?: string
}

interface BreadcrumbRendererProps {
  items?: BreadcrumbItem[]
  separator?: string
  updateProp?: (prop: string, value: any) => void
}

export default function BreadcrumbRenderer({
  items = [
    { title: '首页', href: '/' },
    { title: '组件库', href: '/components' },
    { title: '表单组件', href: '/components/forms' },
    { title: '当前页面' }
  ],
  separator = '/',
  updateProp
}: BreadcrumbRendererProps) {
  return (
    <div className="w-full">
      {/* 面包屑导航 */}
      <nav className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <span className="text-gray-400 dark:text-gray-600">
                {separator}
              </span>
            )}
            {item.href ? (
              <a
                href={item.href}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                {item.title}
              </a>
            ) : (
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {item.title}
              </span>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* 状态信息 */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          面包屑导航配置
        </h4>
        <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400">
          <div>分隔符: {separator}</div>
          <div>项目数量: {items.length}</div>
          <div>当前页面: {items[items.length - 1]?.title}</div>
          <div>可点击: {items.slice(0, -1).filter(item => item.href).length}</div>
        </div>
      </div>
    </div>
  )
}