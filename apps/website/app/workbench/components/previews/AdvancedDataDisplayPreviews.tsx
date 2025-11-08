/**
 * 🔧 高级数据展示组件预览系统
 *
 * 支持的组件：15个高级数据展示组件
 * - Avatar, AvatarGroup, ChipDisplay, StatisticCard, DataGrid
 * - DescriptionList, KeyValueList, ListItem, InfoTooltip
 * - Steps, Timeline（Badge, Card, Collapse, Tag已在现有39个中）
 */

'use client'

import React from 'react'

interface AdvancedDataDisplayPreviewProps {
  componentName: string
}

export function AdvancedDataDisplayPreview({ componentName }: AdvancedDataDisplayPreviewProps) {
  const renderAdvancedDataDisplayPreview = () => {
    switch (componentName) {
      case 'Avatar':
        return (
          <div className="w-full h-32 bg-blue-50 dark:bg-blue-900 rounded-lg flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="flex justify-center space-x-2">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">A</div>
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">B</div>
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">C</div>
              </div>
              <div className="flex justify-center space-x-1">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
                <div className="w-8 h-8 bg-gray-500 rounded-full"></div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Avatar</p>
            </div>
          </div>
        )

      case 'AvatarGroup':
        return (
          <div className="w-full h-32 bg-indigo-50 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="flex justify-center -space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">A</div>
                <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">B</div>
                <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">C</div>
                <div className="w-8 h-8 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">D</div>
                <div className="w-8 h-8 bg-gray-400 rounded-full border-2 border-white flex items-center justify-center text-white text-xs">+5</div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">AvatarGroup</p>
            </div>
          </div>
        )

      case 'ChipDisplay':
        return (
          <div className="w-full h-32 bg-purple-50 dark:bg-purple-900 rounded-lg flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="flex flex-wrap justify-center gap-2">
                <div className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs">标签1</div>
                <div className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs">标签2</div>
                <div className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full text-xs">标签3</div>
                <div className="px-2 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded-full text-xs">标签4</div>
              </div>
              <div className="flex justify-center gap-2">
                <div className="px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full text-xs">可关闭×</div>
                <div className="px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full text-xs">可关闭×</div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">ChipDisplay</p>
            </div>
          </div>
        )

      case 'StatisticCard':
        return (
          <div className="w-full h-32 bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900 dark:to-teal-800 rounded-lg p-4">
            <div className="space-y-2">
              <div className="text-sm text-gray-600 dark:text-gray-400">总用户数</div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">12,345</div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-4 bg-green-200 dark:bg-green-800 rounded"></div>
                <div className="text-xs text-green-600 dark:text-green-400">↑ 12.5%</div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">StatisticCard</p>
          </div>
        )

      case 'DataGrid':
        return (
          <div className="w-full h-32 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <div className="space-y-1">
              <div className="grid grid-cols-3 gap-1 text-xs font-semibold text-gray-700 dark:text-gray-300">
                <div>姓名</div>
                <div>年龄</div>
                <div>城市</div>
              </div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="grid grid-cols-3 gap-1 text-xs text-gray-600 dark:text-gray-400">
                  <div>用户{i + 1}</div>
                  <div>{20 + i * 5}</div>
                  <div>北京</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">DataGrid</p>
          </div>
        )

      case 'DescriptionList':
        return (
          <div className="w-full h-32 bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="font-semibold text-gray-700 dark:text-gray-300">姓名:</div>
                <div className="text-gray-600 dark:text-gray-400">张三</div>

                <div className="font-semibold text-gray-700 dark:text-gray-300">邮箱:</div>
                <div className="text-gray-600 dark:text-gray-400">zhang@example.com</div>

                <div className="font-semibold text-gray-700 dark:text-gray-300">部门:</div>
                <div className="text-gray-600 dark:text-gray-400">技术部</div>

                <div className="font-semibold text-gray-700 dark:text-gray-300">状态:</div>
                <div className="text-green-600 dark:text-green-400">活跃</div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">DescriptionList</p>
          </div>
        )

      case 'KeyValueList':
        return (
          <div className="w-full h-32 bg-purple-50 dark:bg-purple-900 rounded-lg p-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-12 h-4 bg-purple-200 dark:bg-purple-700 rounded text-xs">CPU</div>
                <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded text-xs">45%</div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-12 h-4 bg-purple-200 dark:bg-purple-700 rounded text-xs">内存</div>
                <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded text-xs">2.1GB</div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-12 h-4 bg-purple-200 dark:bg-purple-700 rounded text-xs">磁盘</div>
                <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded text-xs">128GB</div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-12 h-4 bg-purple-200 dark:bg-purple-700 rounded text-xs">网络</div>
                <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded text-xs">1.2Mb/s</div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">KeyValueList</p>
          </div>
        )

      case 'ListItem':
        return (
          <div className="w-full h-32 bg-green-50 dark:bg-green-900 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 p-2 bg-white dark:bg-gray-800 rounded">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <div className="w-16 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="w-8 h-3 bg-green-500 rounded"></div>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-white dark:bg-gray-800 rounded">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <div className="w-16 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="w-8 h-3 bg-yellow-500 rounded"></div>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-white dark:bg-gray-800 rounded">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <div className="w-16 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="w-8 h-3 bg-gray-500 rounded"></div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">ListItem</p>
          </div>
        )

      case 'InfoTooltip':
        return (
          <div className="w-full h-32 bg-yellow-50 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="relative inline-block">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold">?</div>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  这是提示信息
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-gray-800 rotate-45"></div>
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">InfoTooltip</p>
            </div>
          </div>
        )

      case 'Steps':
        return (
          <div className="w-full h-32 bg-indigo-50 dark:bg-indigo-900 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">✓</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">步骤1</div>
                </div>
                <div className="flex-1 h-px bg-green-500 mx-2"></div>
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">2</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">步骤2</div>
                </div>
                <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600 mx-2"></div>
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-xs">3</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">步骤3</div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Steps</p>
          </div>
        )

      case 'Timeline':
        return (
          <div className="w-full h-32 bg-teal-50 dark:bg-teal-900 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <div className="w-3 h-3 bg-teal-500 rounded-full mt-1"></div>
                <div className="flex-1">
                  <div className="w-16 h-2 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <div className="w-20 h-1 bg-gray-200 dark:bg-gray-700 rounded mt-1"></div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full mt-1"></div>
                <div className="flex-1">
                  <div className="w-18 h-2 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded mt-1"></div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full mt-1"></div>
                <div className="flex-1">
                  <div className="w-14 h-2 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <div className="w-18 h-1 bg-gray-200 dark:bg-gray-700 rounded mt-1"></div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Timeline</p>
          </div>
        )

      default:
        return (
          <div className="w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">{componentName}</p>
          </div>
        )
    }
  }

  return (
    <div className="flex items-center justify-center">
      {renderAdvancedDataDisplayPreview()}
    </div>
  )
}