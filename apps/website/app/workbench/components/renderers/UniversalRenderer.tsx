'use client'

import React, { useState } from 'react'

// 通用渲染器，用于快速创建组件预览
export function UniversalRenderer({ componentName, ...props }: any) {
  const [localProps, setLocalProps] = useState(props)

  const renderComponent = () => {
    switch (componentName) {
      // 导航组件
      case 'Menu':
        return (
          <div className="w-full">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2">
              <div className="space-y-1">
                {['首页', '产品', '关于我们', '联系方式'].map((item, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">导航菜单组件</div>
          </div>
        )

      case 'Breadcrumb':
        return (
          <div className="w-full">
            <nav className="flex items-center space-x-2 text-sm">
              <a href="#" className="text-gray-500 hover:text-gray-700">首页</a>
              <span className="text-gray-400">/</span>
              <a href="#" className="text-gray-500 hover:text-gray-700">产品</a>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 dark:text-white">详情</span>
            </nav>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">面包屑导航</div>
          </div>
        )

      case 'Pagination':
        return (
          <div className="w-full">
            <div className="flex items-center justify-center space-x-2">
              <button className="px-3 py-1 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-700">上一页</button>
              {[1, 2, 3, 4, 5].map(page => (
                <button
                  key={page}
                  className={`px-3 py-1 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    page === 3 ? 'bg-blue-500 text-white' : ''
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="px-3 py-1 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-700">下一页</button>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">分页组件</div>
          </div>
        )

      case 'Steps':
        return (
          <div className="w-full">
            <div className="flex items-center justify-between">
              {['步骤1', '步骤2', '步骤3', '步骤4'].map((step, index) => (
                <React.Fragment key={index}>
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index <= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="text-xs mt-1 text-gray-600 dark:text-gray-400">{step}</div>
                  </div>
                  {index < 3 && (
                    <div className={`flex-1 h-px mx-2 ${
                      index < 1 ? 'bg-blue-500' : 'bg-gray-300'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">步骤条组件</div>
          </div>
        )

      // 布局组件
      case 'Row':
        return (
          <div className="w-full">
            <div className="flex space-x-4 p-4 bg-gray-100 dark:bg-gray-800 rounded">
              <div className="flex-1 h-12 bg-blue-200 dark:bg-blue-800 rounded flex items-center justify-center text-sm">Col 1</div>
              <div className="flex-1 h-12 bg-blue-200 dark:bg-blue-800 rounded flex items-center justify-center text-sm">Col 2</div>
              <div className="flex-1 h-12 bg-blue-200 dark:bg-blue-800 rounded flex items-center justify-center text-sm">Col 3</div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">行布局组件</div>
          </div>
        )

      case 'Col':
        return (
          <div className="w-full">
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded">
              <div className="h-12 bg-green-200 dark:bg-green-800 rounded flex items-center justify-center text-sm">列 1</div>
              <div className="h-12 bg-green-200 dark:bg-green-800 rounded flex items-center justify-center text-sm">列 2</div>
              <div className="h-12 bg-green-200 dark:bg-green-800 rounded flex items-center justify-center text-sm">列 3</div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">列布局组件</div>
          </div>
        )

      case 'Card':
        return (
          <div className="w-full">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">卡片标题</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">这是卡片的内容区域，可以放置各种信息。</p>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">操作按钮</button>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">卡片组件</div>
          </div>
        )

      case 'Collapse':
        return (
          <div className="w-full">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="font-medium">折叠面板 1</span>
                  <span className="text-gray-400">▼</span>
                </div>
              </div>
              <div className="p-4 text-gray-600 dark:text-gray-400">
                这是第一个面板的内容。
              </div>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="font-medium">折叠面板 2</span>
                  <span className="text-gray-400">▶</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">折叠面板组件</div>
          </div>
        )

      // 数据展示组件
      case 'Table':
        return (
          <div className="w-full">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">姓名</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">年龄</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">城市</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">张三</td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">28</td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">北京</td>
                  </tr>
                  <tr className="border-t border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">李四</td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">32</td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">上海</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">表格组件</div>
          </div>
        )

      case 'List':
        return (
          <div className="w-full">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
              <div className="p-4">
                <div className="font-medium text-gray-900 dark:text-white">列表项 1</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">这是第一个列表项的描述</div>
              </div>
              <div className="p-4">
                <div className="font-medium text-gray-900 dark:text-white">列表项 2</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">这是第二个列表项的描述</div>
              </div>
              <div className="p-4">
                <div className="font-medium text-gray-900 dark:text-white">列表项 3</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">这是第三个列表项的描述</div>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">列表组件</div>
          </div>
        )

      case 'Tree':
        return (
          <div className="w-full">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="space-y-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span>▶</span>
                    <span className="font-medium">根节点</span>
                  </div>
                  <div className="ml-6 mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span>▶</span>
                      <span>子节点 1</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>▶</span>
                      <span>子节点 2</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>▶</span>
                      <span>子节点 3</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">树形组件</div>
          </div>
        )

      case 'Timeline':
        return (
          <div className="w-full">
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">1</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">2024-01-01</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">项目启动</div>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">2</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">2024-02-01</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">第一阶段完成</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">时间轴组件</div>
          </div>
        )

      // 其他组件
      case 'Anchor':
        return (
          <div className="w-full">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="space-y-2">
                <a href="#section1" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">章节 1</a>
                <a href="#section2" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">章节 2</a>
                <a href="#section3" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">章节 3</a>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">锚点组件</div>
          </div>
        )

      case 'BackTop':
        return (
          <div className="w-full">
            <div className="flex justify-center p-8">
              <button className="w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">回到顶部组件</div>
          </div>
        )

      case 'Empty':
        return (
          <div className="w-full">
            <div className="text-center py-8">
              <div className="text-gray-400 dark:text-gray-600 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <div className="text-gray-500 dark:text-gray-400 mb-2">暂无数据</div>
              <div className="text-sm text-gray-400 dark:text-gray-500">这里还没有任何内容</div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">空状态组件</div>
          </div>
        )

      // 输入增强组件
      case 'DatePicker':
        return (
          <div className="w-full">
            <div className="relative">
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                defaultValue="2024-01-01"
              />
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">日期选择器组件</div>
          </div>
        )

      case 'ColorPicker':
        return (
          <div className="w-full">
            <div className="flex items-center space-x-2">
              <input
                type="color"
                className="w-16 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                defaultValue="#3B82F6"
              />
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                defaultValue="#3B82F6"
                placeholder="#000000"
              />
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">颜色选择器组件</div>
          </div>
        )

      case 'Upload':
        return (
          <div className="w-full">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
              <div className="text-gray-400 dark:text-gray-600 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                点击或拖拽文件到此区域上传
              </div>
              <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
                选择文件
              </button>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">文件上传组件</div>
          </div>
        )

      case 'Editor':
        return (
          <div className="w-full">
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600 p-2">
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-600">B</button>
                  <button className="px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-600 italic">I</button>
                  <button className="px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-600 underline">U</button>
                </div>
              </div>
              <div className="p-4 min-h-[100px] bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                在这里输入内容...
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">富文本编辑器组件</div>
          </div>
        )

      default:
        return (
          <div className="w-full p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
            <div className="text-gray-600 dark:text-gray-400">
              {componentName} 组件预览
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              该组件暂无预览实现
            </div>
          </div>
        )
    }
  }

  return <>{renderComponent()}</>
}