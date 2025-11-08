'use client'

import React from 'react'

interface DisplayRendererProps {
  type?: 'list' | 'timeline' | 'empty'
  data?: any[]
  showActions?: boolean
  updateProp?: (prop: string, value: any) => void
}

export default function DisplayRenderer({
  type = 'list',
  data = [],
  showActions = true,
  updateProp
}: DisplayRendererProps) {
  if (type === 'list') {
    const listData = data.length > 0 ? data : [
      { title: '项目1', description: '这是第一个项目的描述信息', status: 'active' },
      { title: '项目2', description: '这是第二个项目的描述信息', status: 'completed' },
      { title: '项目3', description: '这是第三个项目的描述信息', status: 'pending' }
    ]

    return (
      <div className="w-full">
        {/* 列表展示 */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {listData.map((item, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                      item.status === 'completed' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                      'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400'
                    }`}>
                      {item.status === 'active' ? '进行中' : item.status === 'completed' ? '已完成' : '待处理'}
                    </span>
                    {showActions && (
                      <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 配置信息 */}
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            列表配置
          </h4>
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400">
            <div>列表项数量: {listData.length}</div>
            <div>显示操作: {showActions ? '是' : '否'}</div>
            <div>悬停效果: 启用</div>
            <div>分隔线: 启用</div>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'timeline') {
    const timelineData = data.length > 0 ? data : [
      { time: '2024-01-01', title: '项目启动', description: '项目正式启动，开始需求分析', status: 'completed' },
      { time: '2024-01-15', title: '设计完成', description: 'UI/UX设计工作全部完成', status: 'completed' },
      { time: '2024-02-01', title: '开发阶段', description: '进入开发实施阶段', status: 'current' },
      { time: '2024-03-01', title: '测试阶段', description: '开始全面测试工作', status: 'pending' }
    ]

    return (
      <div className="w-full">
        {/* 时间轴 */}
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
          <div className="space-y-6">
            {timelineData.map((item, index) => (
              <div key={index} className="relative flex items-start space-x-4">
                <div className={`relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                  item.status === 'completed' ? 'bg-green-500 border-green-500' :
                  item.status === 'current' ? 'bg-blue-500 border-blue-500' :
                  'bg-gray-300 dark:bg-gray-600 border-gray-300 dark:border-gray-600'
                }`}>
                  {item.status === 'completed' && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  {item.status === 'current' && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {item.title}
                    </h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 配置信息 */}
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            时间轴配置
          </h4>
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400">
            <div>时间点数量: {timelineData.length}</div>
            <div>当前状态: {timelineData.filter(item => item.status === 'current').length} 个</div>
            <div>已完成: {timelineData.filter(item => item.status === 'completed').length} 个</div>
            <div>待处理: {timelineData.filter(item => item.status === 'pending').length} 个</div>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'empty') {
    return (
      <div className="w-full">
        {/* 空状态 */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            暂无数据
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            这里还没有任何内容，点击下方按钮开始添加
          </p>
          <div className="flex items-center justify-center space-x-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm">
              添加内容
            </button>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
              了解更多
            </button>
          </div>
        </div>

        {/* 配置信息 */}
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            空状态配置
          </h4>
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400">
            <div>图标: 📦</div>
            <div>标题: 暂无数据</div>
            <div>描述: 启用</div>
            <div>操作按钮: 启用</div>
          </div>
        </div>
      </div>
    )
  }

  return null
}