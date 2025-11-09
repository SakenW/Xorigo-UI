'use client'

import React, { useState } from 'react'
import { useTheme } from '@xorigo-ui/system'

// 通用渲染器，用于快速创建组件预览
export function UniversalRenderer({ componentName, ...props }: any) {
  const [localProps, setLocalProps] = useState(props)
  const { themeConfig } = useTheme()

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
                    key={`menu-item-${item}-${index}`}
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
                <React.Fragment key={`step-${step}-${index}`}>
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

      // 图表组件
      case 'BarChart':
        return (
          <div className="w-full">
            <div
              className="border rounded-lg p-6 transition-all duration-300"
              style={{
                backgroundColor: themeConfig.mode === 'dark' ? '#1f2937' : '#ffffff',
                borderColor: themeConfig.mode === 'dark' ? '#374151' : '#e5e7eb',
                boxShadow: `0 0 20px ${themeConfig.glow}20`
              }}
            >
              <div className="space-y-4">
                <div className="flex items-end space-x-2 h-32">
                  <div
                    className="flex-1 rounded-t transition-all duration-300 hover:opacity-80"
                    style={{
                      height: '80%',
                      background: `linear-gradient(to top, ${themeConfig.colors[500]}, ${themeConfig.colors[400]})`,
                      boxShadow: `0 0 10px ${themeConfig.glow}`
                    }}
                  ></div>
                  <div
                    className="flex-1 rounded-t transition-all duration-300 hover:opacity-80"
                    style={{
                      height: '60%',
                      background: `linear-gradient(to top, ${themeConfig.colors[500]}, ${themeConfig.colors[400]})`,
                      boxShadow: `0 0 10px ${themeConfig.glow}`
                    }}
                  ></div>
                  <div
                    className="flex-1 rounded-t transition-all duration-300 hover:opacity-80"
                    style={{
                      height: '90%',
                      background: `linear-gradient(to top, ${themeConfig.colors[500]}, ${themeConfig.colors[400]})`,
                      boxShadow: `0 0 10px ${themeConfig.glow}`
                    }}
                  ></div>
                  <div
                    className="flex-1 rounded-t transition-all duration-300 hover:opacity-80"
                    style={{
                      height: '40%',
                      background: `linear-gradient(to top, ${themeConfig.colors[500]}, ${themeConfig.colors[400]})`,
                      boxShadow: `0 0 10px ${themeConfig.glow}`
                    }}
                  ></div>
                  <div
                    className="flex-1 rounded-t transition-all duration-300 hover:opacity-80"
                    style={{
                      height: '70%',
                      background: `linear-gradient(to top, ${themeConfig.colors[500]}, ${themeConfig.colors[400]})`,
                      boxShadow: `0 0 10px ${themeConfig.glow}`
                    }}
                  ></div>
                </div>
                <div
                  className="flex justify-between text-xs transition-colors duration-300"
                  style={{ color: themeConfig.mode === 'dark' ? '#9ca3af' : '#6b7280' }}
                >
                  <span>Q1</span>
                  <span>Q2</span>
                  <span>Q3</span>
                  <span>Q4</span>
                  <span>Q5</span>
                </div>
              </div>
            </div>
            <div
              className="text-xs mt-2 text-center transition-colors duration-300"
              style={{ color: themeConfig.mode === 'dark' ? '#6b7280' : '#9ca3af' }}
            >
              柱状图组件
            </div>
          </div>
        )

      case 'PieChart':
        return (
          <div className="w-full">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 rounded-full" style={{
                    background: 'conic-gradient(#3B82F6 0deg 126deg, #10B981 126deg 234deg, #F59E0B 234deg 306deg, #EF4444 306deg 360deg)'
                  }}></div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>产品A (35%)</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>产品B (30%)</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span>产品C (20%)</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>产品D (15%)</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">饼图组件</div>
          </div>
        )

      case 'AreaChart':
        return (
          <div className="w-full">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="h-32 relative">
                <svg className="w-full h-full" viewBox="0 0 300 100">
                  <defs>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8"/>
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1"/>
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 80 L 50 60 L 100 40 L 150 50 L 200 30 L 250 45 L 300 20 L 300 100 L 0 100 Z"
                    fill="url(#areaGradient)"
                  />
                  <path
                    d="M 0 80 L 50 60 L 100 40 L 150 50 L 200 30 L 250 45 L 300 20"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-2">
                <span>1月</span>
                <span>2月</span>
                <span>3月</span>
                <span>4月</span>
                <span>5月</span>
                <span>6月</span>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">面积图组件</div>
          </div>
        )

      case 'ColumnChart':
        return (
          <div className="w-full">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="space-y-4">
                <div className="flex items-end space-x-4 h-32">
                  <div className="flex-1 bg-blue-500 rounded-t" style={{height: '70%'}}></div>
                  <div className="flex-1 bg-green-500 rounded-t" style={{height: '85%'}}></div>
                  <div className="flex-1 bg-yellow-500 rounded-t" style={{height: '60%'}}></div>
                  <div className="flex-1 bg-red-500 rounded-t" style={{height: '90%'}}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span>产品A</span>
                  <span>产品B</span>
                  <span>产品C</span>
                  <span>产品D</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">条形图组件</div>
          </div>
        )

      case 'DonutChart':
        return (
          <div className="w-full">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 rounded-full" style={{
                    background: 'conic-gradient(#3B82F6 0deg 108deg, #10B981 108deg 216deg, #F59E0B 216deg 288deg, #EF4444 288deg 360deg)'
                  }}></div>
                  <div className="absolute inset-4 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">100%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">环形图组件</div>
          </div>
        )

      case 'GaugeChart':
        return (
          <div className="w-full">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-16">
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-200 dark:bg-gray-700 rounded-t-full overflow-hidden">
                    <div className="absolute bottom-0 left-0 h-full bg-green-500 rounded-t-full" style={{width: '75%'}}></div>
                  </div>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-lg font-bold text-gray-900 dark:text-white">
                    75%
                  </div>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">仪表盘组件</div>
          </div>
        )

      case 'RadarChart':
        return (
          <div className="w-full">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    {[20, 40, 60, 80, 100].map((radius, index) => (
                      <polygon
                        key={index}
                        points="50,10 85,30 85,70 50,90 15,70 15,30"
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth="1"
                      />
                    ))}
                    <polygon
                      points="50,20 75,35 75,65 50,80 25,65 25,35"
                      fill="rgba(59, 130, 246, 0.3)"
                      stroke="#3B82F6"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">雷达图组件</div>
          </div>
        )

      case 'Heatmap':
        return (
          <div className="w-full">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="grid grid-cols-7 gap-1">
                {Array.from({length: 35}, (_, i) => {
                  const intensity = Math.random()
                  const bgColor = intensity > 0.8 ? 'bg-blue-600' :
                                  intensity > 0.6 ? 'bg-blue-500' :
                                  intensity > 0.4 ? 'bg-blue-400' :
                                  intensity > 0.2 ? 'bg-blue-300' : 'bg-blue-200'
                  return (
                    <div key={i} className={`w-4 h-4 rounded ${bgColor}`}></div>
                  )
                })}
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">热力图组件</div>
          </div>
        )

      case 'MiniChart':
        return (
          <div className="w-full">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center space-x-4">
                <div className="h-8 w-16">
                  <svg className="w-full h-full" viewBox="0 0 50 20">
                    <path
                      d="M 0 15 L 10 12 L 20 8 L 30 10 L 40 5 L 50 8"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">+12.5%</span>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">迷你图表组件</div>
          </div>
        )

      case 'Sparkline':
        return (
          <div className="w-full">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center space-x-4">
                <div className="h-6 w-20">
                  <svg className="w-full h-full" viewBox="0 0 60 15">
                    <path
                      d="M 0 10 L 15 8 L 30 12 L 45 3 L 60 7"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
                <span className="text-lg font-bold text-green-600">↑ 8.3%</span>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">迷你折线图组件</div>
          </div>
        )

      case 'FunnelChart':
        return (
          <div className="w-full">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="space-y-2">
                <div className="h-8 bg-blue-500 rounded flex items-center justify-center text-white text-sm font-medium">
                  访问用户: 1000
                </div>
                <div className="h-8 bg-blue-400 rounded flex items-center justify-center text-white text-sm font-medium" style={{width: '90%'}}>
                  注册用户: 900
                </div>
                <div className="h-8 bg-blue-300 rounded flex items-center justify-center text-white text-sm font-medium" style={{width: '70%'}}>
                  活跃用户: 700
                </div>
                <div className="h-8 bg-blue-200 rounded flex items-center justify-center text-white text-sm font-medium" style={{width: '40%'}}>
                  付费用户: 400
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">漏斗图组件</div>
          </div>
        )

      case 'ChartContainer':
        return (
          <div className="w-full">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                <div className="text-gray-500 dark:text-gray-400 text-sm">图表容器区域</div>
              </div>
              <div className="mt-4 flex justify-between">
                <button className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-600 rounded">导出</button>
                <button className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-600 rounded">刷新</button>
                <button className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-600 rounded">全屏</button>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">图表容器组件</div>
          </div>
        )

      case 'Legend':
        return (
          <div className="w-full">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-sm">数据系列 A</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-sm">数据系列 B</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span className="text-sm">数据系列 C</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">图例组件</div>
          </div>
        )

      case 'Axis':
        return (
          <div className="w-full">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="h-24 relative">
                <div className="absolute bottom-0 left-0 w-full h-px bg-gray-400 dark:bg-gray-600"></div>
                <div className="absolute bottom-0 left-0 w-px h-20 bg-gray-400 dark:bg-gray-600"></div>
                <div className="absolute bottom-2 left-0 flex justify-between w-full text-xs text-gray-600 dark:text-gray-400">
                  <span>0</span>
                  <span>25</span>
                  <span>50</span>
                  <span>75</span>
                  <span>100</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">坐标轴组件</div>
          </div>
        )

      case 'GridLines':
        return (
          <div className="w-full">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="h-24 relative">
                {[20, 40, 60, 80].map((y, index) => (
                  <div key={index} className="absolute w-full h-px bg-gray-200 dark:bg-gray-700" style={{top: `${y}%`}}></div>
                ))}
                {[20, 40, 60, 80].map((x, index) => (
                  <div key={index} className="absolute h-full w-px bg-gray-200 dark:bg-gray-700" style={{left: `${x}%`}}></div>
                ))}
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">网格线组件</div>
          </div>
        )

      case 'SimpleMode':
        return (
          <div className="w-full">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-center h-24">
                <div className="text-sm text-gray-600 dark:text-gray-400">简化模式图表</div>
              </div>
              <div className="flex justify-center mt-4">
                <button className="px-3 py-1 text-xs bg-blue-500 text-white rounded">切换到详细模式</button>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">简化模式组件</div>
          </div>
        )

      case 'ChartArea':
        return (
          <div className="w-full">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="h-32 bg-gradient-to-t from-blue-500/20 to-transparent rounded relative">
                <div className="absolute bottom-0 left-0 right-0 text-center text-sm text-gray-600 dark:text-gray-400 pb-2">
                  图表区域
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">图表区域组件</div>
          </div>
        )

      // 业务区块组件
      case 'FeatureSection':
        return (
          <div className="w-full">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 bg-blue-500 rounded"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">功能特性</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  提供强大的功能支持，助力业务快速发展
                </p>
                <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
                  了解更多
                </button>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">功能区块组件</div>
          </div>
        )

      case 'CallToActionSection':
        return (
          <div className="w-full">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-white">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">立即开始</h3>
                <p className="text-blue-100 text-sm mb-4">
                  加入我们，体验更好的服务
                </p>
                <button className="px-4 py-2 bg-white text-blue-600 text-sm rounded hover:bg-gray-100">
                  免费试用
                </button>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">行动召唤区块组件</div>
          </div>
        )

      case 'TestimonialSection':
        return (
          <div className="w-full">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-600 dark:text-gray-400 text-lg">👤</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm italic mb-4">
                  "这个产品完全改变了我们的工作方式，效率提升了300%！"
                </p>
                <p className="text-gray-900 dark:text-white font-medium text-sm">— 张三，产品经理</p>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">用户评价区块组件</div>
          </div>
        )

      case 'FAQSection':
        return (
          <div className="w-full">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="space-y-4">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">常见问题 1</span>
                    <span className="text-gray-400 text-sm">▼</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  这是第一个问题的答案...
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">常见问题区块组件</div>
          </div>
        )

      case 'LoginSection':
        return (
          <div className="w-full">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="用户名"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm"
                />
                <input
                  type="password"
                  placeholder="密码"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm"
                />
                <button className="w-full px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
                  登录
                </button>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">登录区块组件</div>
          </div>
        )

      case 'RegisterSection':
        return (
          <div className="w-full">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="用户名"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm"
                />
                <input
                  type="email"
                  placeholder="邮箱"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm"
                />
                <input
                  type="password"
                  placeholder="密码"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm"
                />
                <button className="w-full px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600">
                  注册
                </button>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">注册区块组件</div>
          </div>
        )

      case 'PricingSection':
        return (
          <div className="w-full">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">专业版</h3>
                <div className="text-2xl font-bold text-blue-600 mb-4">¥99/月</div>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 mb-4">
                  <li>✅ 无限使用</li>
                  <li>✅ 高级功能</li>
                  <li>✅ 优先支持</li>
                </ul>
                <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
                  立即订阅
                </button>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">价格区块组件</div>
          </div>
        )

      case 'StatsGrid':
        return (
          <div className="w-full">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">10K+</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">用户数量</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">99.9%</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">正常运行时间</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">24/7</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">客户支持</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">500+</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">企业客户</div>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">统计数据网格组件</div>
          </div>
        )

      case 'FilterBar':
        return (
          <div className="w-full">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex flex-wrap gap-2">
                <select className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded">
                  <option>全部类别</option>
                  <option>类别 A</option>
                  <option>类别 B</option>
                </select>
                <input
                  type="text"
                  placeholder="搜索..."
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded"
                />
                <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                  筛选
                </button>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">筛选栏组件</div>
          </div>
        )

      case 'ActivityFeed':
        return (
          <div className="w-full">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-900 dark:text-white">用户张三完成了订单</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">5分钟前</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-900 dark:text-white">系统更新完成</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">1小时前</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-900 dark:text-white">新用户注册</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">2小时前</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">活动信息流组件</div>
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