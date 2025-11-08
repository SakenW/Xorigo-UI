/**
 * 🧩 其他专业组件预览系统
 *
 * 支持的组件：19个其他专业组件
 * - 布局组件：AppLayout, Divider, Gap, PageContainer, Space, Wrap
 * - 导航组件：AppShell, ContextualMenu, Link, NavLink, NavMenu,
 *   SegmentedControl, Sidenav, SkipNav, Stepper, Topbar
 * - 浮层组件：ConfirmDialog, ImagePreview, SidePanel
 */

'use client'

import React from 'react'

interface OtherComponentsPreviewProps {
  componentName: string
}

export function OtherComponentsPreview({ componentName }: OtherComponentsPreviewProps) {
  const renderOtherComponentsPreview = () => {
    switch (componentName) {
      // 布局组件
      case 'AppLayout':
        return (
          <div className="w-full h-32 bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
            <div className="h-full border border-gray-300 dark:border-gray-600 rounded">
              <div className="h-4 bg-blue-600 dark:bg-blue-500 rounded-t"></div>
              <div className="flex h-20">
                <div className="w-4 bg-gray-300 dark:bg-gray-600"></div>
                <div className="flex-1 p-1">
                  <div className="h-full bg-gray-100 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">AppLayout</p>
          </div>
        )

      case 'Gap':
        return (
          <div className="w-full h-32 bg-purple-50 dark:bg-purple-900 rounded-lg p-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-3 bg-purple-400 dark:bg-purple-600 rounded"></div>
                <div className="w-6 h-3 bg-purple-400 dark:bg-purple-600 rounded"></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="w-8 h-4 bg-purple-300 dark:bg-purple-700 rounded"></div>
                <div className="w-8 h-4 bg-purple-300 dark:bg-purple-700 rounded"></div>
                <div className="w-8 h-4 bg-purple-300 dark:bg-purple-700 rounded"></div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Gap</p>
          </div>
        )

      case 'PageContainer':
        return (
          <div className="w-full h-32 bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
            <div className="h-full border border-gray-300 dark:border-gray-600 rounded p-2">
              <div className="h-full bg-white dark:bg-gray-700 rounded flex items-center justify-center">
                <div className="text-center space-y-1">
                  <div className="w-12 h-2 bg-gray-300 dark:bg-gray-600 rounded mx-auto"></div>
                  <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">PageContainer</p>
          </div>
        )

      case 'Space':
        return (
          <div className="w-full h-32 bg-indigo-50 dark:bg-indigo-900 rounded-lg p-4">
            <div className="space-y-2">
              <div className="space-x-2 flex items-center">
                <div className="w-4 h-4 bg-indigo-400 dark:bg-indigo-600 rounded"></div>
                <div className="w-4 h-4 bg-indigo-400 dark:bg-indigo-600 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-2 bg-indigo-300 dark:bg-indigo-700 rounded"></div>
                <div className="w-10 h-2 bg-indigo-300 dark:bg-indigo-700 rounded"></div>
              </div>
              <div className="space-x-1 flex">
                <div className="w-3 h-3 bg-indigo-400 dark:bg-indigo-600 rounded"></div>
                <div className="w-3 h-3 bg-indigo-400 dark:bg-indigo-600 rounded"></div>
                <div className="w-3 h-3 bg-indigo-400 dark:bg-indigo-600 rounded"></div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Space</p>
          </div>
        )

      case 'Wrap':
        return (
          <div className="w-full h-32 bg-teal-50 dark:bg-teal-900 rounded-lg p-4">
            <div className="flex flex-wrap gap-2">
              <div className="px-2 py-1 bg-teal-200 dark:bg-teal-700 rounded text-xs">标签1</div>
              <div className="px-2 py-1 bg-teal-200 dark:bg-teal-700 rounded text-xs">标签2</div>
              <div className="px-2 py-1 bg-teal-200 dark:bg-teal-700 rounded text-xs">标签3</div>
              <div className="px-2 py-1 bg-teal-200 dark:bg-teal-700 rounded text-xs">标签4</div>
              <div className="px-2 py-1 bg-teal-200 dark:bg-teal-700 rounded text-xs">标签5</div>
              <div className="px-2 py-1 bg-teal-200 dark:bg-teal-700 rounded text-xs">标签6</div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Wrap</p>
          </div>
        )

      // 导航组件
      case 'AppShell':
        return (
          <div className="w-full h-32 bg-blue-50 dark:bg-blue-900 rounded-lg p-2">
            <div className="h-full border border-blue-300 dark:border-blue-600 rounded">
              <div className="h-3 bg-blue-600 dark:bg-blue-500 rounded-t"></div>
              <div className="flex h-25">
                <div className="w-3 bg-blue-400 dark:bg-blue-600"></div>
                <div className="flex-1 p-1">
                  <div className="h-full bg-white dark:bg-gray-700 rounded flex items-center justify-center">
                    <div className="text-xs text-gray-600 dark:text-gray-400">内容</div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">AppShell</p>
          </div>
        )

      case 'ContextualMenu':
        return (
          <div className="w-full h-32 bg-orange-50 dark:bg-orange-900 rounded-lg p-4">
            <div className="relative">
              <div className="w-8 h-4 bg-orange-400 dark:bg-orange-600 rounded flex items-center justify-center text-white text-xs">菜单</div>
              <div className="absolute top-4 left-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-lg p-1">
                <div className="space-y-1">
                  <div className="px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded">选项1</div>
                  <div className="px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded">选项2</div>
                  <div className="px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded">选项3</div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">ContextualMenu</p>
          </div>
        )

      case 'Link':
        return (
          <div className="w-full h-32 bg-green-50 dark:bg-green-900 rounded-lg p-4">
            <div className="space-y-2">
              <div className="text-blue-600 dark:text-blue-400 underline text-xs">默认链接</div>
              <div className="text-blue-600 dark:text-blue-400 text-xs">无下划线链接</div>
              <div className="text-gray-500 dark:text-gray-400 text-xs">已访问链接</div>
              <div className="text-blue-600 dark:text-blue-400 text-xs font-semibold">悬停链接</div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Link</p>
          </div>
        )

      case 'NavLink':
        return (
          <div className="w-full h-32 bg-indigo-50 dark:bg-indigo-900 rounded-lg p-4">
            <div className="space-y-2">
              <div className="px-2 py-1 bg-indigo-600 text-white rounded text-xs">活动链接</div>
              <div className="px-2 py-1 bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300 rounded text-xs">普通链接</div>
              <div className="px-2 py-1 text-gray-600 dark:text-gray-400 rounded text-xs">禁用链接</div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">NavLink</p>
          </div>
        )

      case 'NavMenu':
        return (
          <div className="w-full h-32 bg-purple-50 dark:bg-purple-900 rounded-lg p-4">
            <div className="space-y-1">
              <div className="flex space-x-2">
                <div className="px-2 py-1 bg-purple-600 text-white rounded text-xs">首页</div>
                <div className="px-2 py-1 bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300 rounded text-xs">产品</div>
                <div className="px-2 py-1 bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300 rounded text-xs">服务</div>
              </div>
              <div className="flex space-x-2">
                <div className="px-2 py-1 bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300 rounded text-xs">关于</div>
                <div className="px-2 py-1 bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300 rounded text-xs">联系</div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">NavMenu</p>
          </div>
        )

      case 'SegmentedControl':
        return (
          <div className="w-full h-32 bg-cyan-50 dark:bg-cyan-900 rounded-lg p-4">
            <div className="space-y-3">
              <div className="flex space-x-1 bg-gray-200 dark:bg-gray-700 rounded p-1">
                <div className="px-3 py-1 bg-white dark:bg-gray-600 rounded text-xs">选项1</div>
                <div className="px-3 py-1 text-xs text-gray-600 dark:text-gray-400">选项2</div>
                <div className="px-3 py-1 text-xs text-gray-600 dark:text-gray-400">选项3</div>
              </div>
              <div className="flex space-x-1">
                <div className="px-2 py-1 bg-cyan-600 text-white rounded text-xs">A</div>
                <div className="px-2 py-1 bg-cyan-100 dark:bg-cyan-800 text-cyan-600 dark:text-cyan-300 rounded text-xs">B</div>
                <div className="px-2 py-1 bg-cyan-100 dark:bg-cyan-800 text-cyan-600 dark:text-cyan-300 rounded text-xs">C</div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">SegmentedControl</p>
          </div>
        )

      case 'Sidenav':
        return (
          <div className="w-full h-32 bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
            <div className="flex h-full space-x-1">
              <div className="w-8 bg-gray-300 dark:bg-gray-600 rounded p-1">
                <div className="space-y-1">
                  <div className="w-6 h-2 bg-blue-600 dark:bg-blue-500 rounded"></div>
                  <div className="w-6 h-2 bg-gray-400 dark:bg-gray-700 rounded"></div>
                  <div className="w-6 h-2 bg-gray-400 dark:bg-gray-700 rounded"></div>
                  <div className="w-6 h-2 bg-gray-400 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
              <div className="flex-1 bg-white dark:bg-gray-700 rounded flex items-center justify-center">
                <div className="text-xs text-gray-600 dark:text-gray-400">内容区</div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Sidenav</p>
          </div>
        )

      case 'SkipNav':
        return (
          <div className="w-full h-32 bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
            <div className="space-y-2">
              <div className="sr-only">跳过导航（屏幕阅读器）</div>
              <div className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-xs">跳转到内容</div>
              <div className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-xs">跳转到导航</div>
              <div className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-xs">跳转到搜索</div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">SkipNav</p>
          </div>
        )

      case 'Stepper':
        return (
          <div className="w-full h-32 bg-emerald-50 dark:bg-emerald-900 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs">1</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">开始</div>
                </div>
                <div className="flex-1 h-px bg-emerald-600 mx-1"></div>
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs">2</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">进行</div>
                </div>
                <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-xs">3</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">完成</div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Stepper</p>
          </div>
        )

      case 'Topbar':
        return (
          <div className="w-full h-32 bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
            <div className="h-6 bg-gray-800 dark:bg-gray-200 rounded-t flex items-center justify-between px-2">
              <div className="w-8 h-2 bg-white dark:bg-gray-800 rounded"></div>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white dark:bg-gray-800 rounded-full"></div>
                <div className="w-2 h-2 bg-white dark:bg-gray-800 rounded-full"></div>
                <div className="w-2 h-2 bg-white dark:bg-gray-800 rounded-full"></div>
              </div>
            </div>
            <div className="h-20 bg-white dark:bg-gray-700 rounded-b p-2">
              <div className="w-full h-full bg-gray-100 dark:bg-gray-600 rounded flex items-center justify-center">
                <div className="text-xs text-gray-600 dark:text-gray-400">页面内容</div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Topbar</p>
          </div>
        )

      // 浮层组件
      case 'ConfirmDialog':
        return (
          <div className="w-full h-32 bg-red-50 dark:bg-red-900 rounded-lg p-4">
            <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-3 shadow-lg">
              <div className="space-y-2">
                <div className="text-center font-semibold text-sm text-gray-800 dark:text-gray-200">确认操作</div>
                <div className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="flex justify-center space-x-2">
                  <div className="px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded text-xs">取消</div>
                  <div className="px-3 py-1 bg-red-600 text-white rounded text-xs">确认</div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">ConfirmDialog</p>
          </div>
        )

      case 'ImagePreview':
        return (
          <div className="w-full h-32 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="relative">
              <div className="w-20 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded flex items-center justify-center">
                <div className="text-white text-xs">图片</div>
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">ImagePreview</p>
          </div>
        )

      case 'SidePanel':
        return (
          <div className="w-full h-32 bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
            <div className="flex h-full">
              <div className="flex-1 bg-white dark:bg-gray-700 rounded flex items-center justify-center">
                <div className="text-xs text-gray-600 dark:text-gray-400">主内容</div>
              </div>
              <div className="w-12 bg-gray-200 dark:bg-gray-600 rounded-l border-l-4 border-blue-600 p-2">
                <div className="space-y-1">
                  <div className="w-8 h-2 bg-gray-400 dark:bg-gray-700 rounded"></div>
                  <div className="w-8 h-2 bg-gray-400 dark:bg-gray-700 rounded"></div>
                  <div className="w-8 h-2 bg-gray-400 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">SidePanel</p>
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
      {renderOtherComponentsPreview()}
    </div>
  )
}