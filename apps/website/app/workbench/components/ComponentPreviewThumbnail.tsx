'use client'

import React from 'react'

interface ComponentPreviewThumbnailProps {
  componentName: string
  className?: string
}

// 组件预览缩略图组件
export function ComponentPreviewThumbnail({ componentName, className = "" }: ComponentPreviewThumbnailProps) {
  // 根据组件类型返回不同的预览组件
  const renderPreview = () => {
    switch (componentName) {
      case 'TextInput':
        return (
          <div className="w-full max-w-xs">
            <input
              type="text"
              placeholder="请输入文本..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />
          </div>
        )

      case 'PasswordInput':
        return (
          <div className="w-full max-w-xs">
            <div className="relative">
              <input
                type="password"
                placeholder="请输入密码..."
                className="w-full px-3 py-2 pr-8 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled
              />
              <span className="absolute right-2 top-2 text-gray-400">👁</span>
            </div>
          </div>
        )

      case 'NumberInput':
        return (
          <div className="w-full max-w-xs">
            <div className="flex items-center border border-gray-300 rounded-md">
              <button className="px-2 py-1 text-gray-600 hover:bg-gray-100">-</button>
              <input
                type="number"
                value="0"
                className="w-16 text-center text-sm border-0 focus:outline-none"
                disabled
              />
              <button className="px-2 py-1 text-gray-600 hover:bg-gray-100">+</button>
            </div>
          </div>
        )

      case 'Button':
        return (
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
              主要按钮
            </button>
            <button className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
              次要按钮
            </button>
          </div>
        )

      case 'Select':
        return (
          <div className="w-full max-w-xs">
            <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" disabled>
              <option>请选择选项...</option>
              <option>选项一</option>
              <option>选项二</option>
            </select>
          </div>
        )

      case 'Checkbox':
        return (
          <div className="space-y-2">
            <label className="flex items-center text-sm">
              <input type="checkbox" className="mr-2" disabled />
              选项一
            </label>
            <label className="flex items-center text-sm">
              <input type="checkbox" className="mr-2" checked disabled />
              选项二
            </label>
          </div>
        )

      case 'Radio':
        return (
          <div className="space-y-2">
            <label className="flex items-center text-sm">
              <input type="radio" name="radio-thumb" className="mr-2" />
              选项一
            </label>
            <label className="flex items-center text-sm">
              <input type="radio" name="radio-thumb" className="mr-2" checked />
              选项二
            </label>
          </div>
        )

      case 'Switch':
        return (
          <div className="flex items-center space-x-2">
            <span className="text-sm">关闭</span>
            <button className="w-10 h-6 bg-gray-300 rounded-full relative transition-colors">
              <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></span>
            </button>
            <span className="text-sm">开启</span>
          </div>
        )

      case 'Heading':
        return (
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">一级标题</h1>
            <h2 className="text-xl font-semibold text-gray-800">二级标题</h2>
            <h3 className="text-lg font-medium text-gray-700">三级标题</h3>
          </div>
        )

      case 'Text':
        return (
          <div className="w-full max-w-xs space-y-1">
            <p className="text-sm text-gray-600">这是一段普通文本内容</p>
            <p className="text-sm font-semibold text-gray-800">这是加粗文本</p>
            <p className="text-xs text-gray-500">这是小号文本</p>
          </div>
        )

      case 'Alert':
        return (
          <div className="w-full max-w-xs space-y-2">
            <div className="p-3 bg-green-100 border border-green-400 rounded-md">
              <p className="text-sm text-green-800">✅ 成功提示信息</p>
            </div>
            <div className="p-3 bg-red-100 border border-red-400 rounded-md">
              <p className="text-sm text-red-800">❌ 错误提示信息</p>
            </div>
          </div>
        )

      case 'Badge':
        return (
          <div className="flex gap-2">
            <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded-full">新</span>
            <span className="px-2 py-1 text-xs bg-green-600 text-white rounded-full">完成</span>
            <span className="px-2 py-1 text-xs bg-gray-600 text-white rounded-full">待处理</span>
          </div>
        )

      case 'Tag':
        return (
          <div className="flex gap-2">
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md">React</span>
            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-md">JavaScript</span>
            <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-md">UI</span>
          </div>
        )

      case 'Progress':
        return (
          <div className="w-full max-w-xs space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <div className="w-full bg-green-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '50%' }}></div>
            </div>
          </div>
        )

      case 'Table':
        return (
          <div className="w-full max-w-xs">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-2 py-1">姓名</th>
                  <th className="border border-gray-300 px-2 py-1">年龄</th>
                  <th className="border border-gray-300 px-2 py-1">状态</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-2 py-1">张三</td>
                  <td className="border border-gray-300 px-2 py-1">25</td>
                  <td className="border border-gray-300 px-2 py-1">活跃</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-2 py-1">李四</td>
                  <td className="border border-gray-300 px-2 py-1">30</td>
                  <td className="border border-gray-300 px-2 py-1">离线</td>
                </tr>
              </tbody>
            </table>
          </div>
        )

      case 'Card':
        return (
          <div className="w-full max-w-xs">
            <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
              <h3 className="text-base font-semibold mb-2">卡片标题</h3>
              <p className="text-xs text-gray-600">这是卡片的内容描述部分</p>
            </div>
          </div>
        )

      default:
        // 默认显示组件名称
        return (
          <div className="w-full max-w-xs p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              {componentName}
            </p>
          </div>
        )
    }
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {renderPreview()}
    </div>
  )
}