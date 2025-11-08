/**
 * 🎨 反馈和动效组件预览系统
 *
 * 支持的组件：13个反馈组件
 * - Announcement, Banner, Empty, EmptyState, InlineAlert
 * - Loader, Result, Skeleton, SkeletonAvatar, SkeletonBlock
 * - SkeletonText, Snackbar（Alert, Spinner已在现有39个中）
 */

'use client'

import React from 'react'

interface FeedbackMotionPreviewProps {
  componentName: string
}

export function FeedbackMotionPreview({ componentName }: FeedbackMotionPreviewProps) {
  const renderFeedbackMotionPreview = () => {
    switch (componentName) {
      case 'Announcement':
        return (
          <div className="w-full h-32 bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
            <div className="bg-blue-100 dark:bg-blue-800 border-l-4 border-blue-600 p-3 rounded">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">!</div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-blue-800 dark:text-blue-200">重要通知</div>
                  <div className="w-full h-2 bg-blue-300 dark:bg-blue-700 rounded mt-1"></div>
                </div>
                <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">×</div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Announcement</p>
          </div>
        )

      case 'Banner':
        return (
          <div className="w-full h-32 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900 rounded-lg p-4">
            <div className="bg-yellow-200 dark:bg-yellow-800 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-600 rounded flex items-center justify-center text-white text-xs">⚠</div>
                <div className="flex-1">
                  <div className="w-full h-2 bg-yellow-400 dark:bg-yellow-600 rounded"></div>
                  <div className="w-3/4 h-2 bg-yellow-300 dark:bg-yellow-700 rounded mt-1"></div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Banner</p>
          </div>
        )

      case 'Empty':
        return (
          <div className="w-full h-32 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto flex items-center justify-center">
                <div className="w-6 h-6 bg-gray-400 dark:bg-gray-500 rounded"></div>
              </div>
              <div className="w-16 h-2 bg-gray-300 dark:bg-gray-600 rounded mx-auto"></div>
              <div className="w-20 h-1 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
              <div className="w-12 h-4 bg-blue-600 text-white rounded mx-auto text-xs">操作</div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Empty</p>
          </div>
        )

      case 'EmptyState':
        return (
          <div className="w-full h-32 bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
            <div className="text-center space-y-2">
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg mx-auto"></div>
              <div className="w-18 h-2 bg-slate-300 dark:bg-slate-600 rounded mx-auto"></div>
              <div className="w-14 h-1 bg-slate-200 dark:bg-slate-700 rounded mx-auto"></div>
              <div className="flex justify-center space-x-2">
                <div className="w-10 h-4 bg-slate-600 text-white rounded text-xs">搜索</div>
                <div className="w-10 h-4 bg-slate-300 dark:bg-slate-600 text-slate-600 dark:text-slate-300 rounded text-xs">筛选</div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">EmptyState</p>
          </div>
        )

      case 'InlineAlert':
        return (
          <div className="w-full h-32 bg-green-50 dark:bg-green-900 rounded-lg p-4 space-y-2">
            <div className="bg-green-100 dark:bg-green-800 border border-green-300 dark:border-green-600 p-2 rounded text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-600 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                <div className="w-20 h-2 bg-green-400 dark:bg-green-600 rounded"></div>
              </div>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-800 border border-yellow-300 dark:border-yellow-600 p-2 rounded text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-yellow-600 rounded-full flex items-center justify-center text-white text-xs">!</div>
                <div className="w-20 h-2 bg-yellow-400 dark:bg-yellow-600 rounded"></div>
              </div>
            </div>
            <div className="bg-red-100 dark:bg-red-800 border border-red-300 dark:border-red-600 p-2 rounded text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-600 rounded-full flex items-center justify-center text-white text-xs">×</div>
                <div className="w-20 h-2 bg-red-400 dark:bg-red-600 rounded"></div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">InlineAlert</p>
          </div>
        )

      case 'Loader':
        return (
          <div className="w-full h-32 bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
            <div className="text-center space-y-3">
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <div className="flex justify-center">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="w-16 h-2 bg-blue-200 dark:bg-blue-800 rounded mx-auto overflow-hidden">
                <div className="w-8 h-full bg-blue-600 rounded animate-pulse"></div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Loader</p>
          </div>
        )

      case 'Result':
        return (
          <div className="w-full h-32 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full mx-auto flex items-center justify-center mb-2">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs">✓</div>
              </div>
              <div className="w-16 h-2 bg-gray-300 dark:bg-gray-600 rounded mx-auto"></div>
              <div className="w-12 h-1 bg-gray-200 dark:bg-gray-700 rounded mx-auto mt-1"></div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full mx-auto flex items-center justify-center mb-2">
                <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-xs">×</div>
              </div>
              <div className="w-16 h-2 bg-gray-300 dark:bg-gray-600 rounded mx-auto"></div>
              <div className="w-12 h-1 bg-gray-200 dark:bg-gray-700 rounded mx-auto mt-1"></div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Result</p>
          </div>
        )

      case 'Skeleton':
        return (
          <div className="w-full h-32 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="space-y-2">
              <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="w-1/2 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="flex space-x-2">
                <div className="w-8 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Skeleton</p>
          </div>
        )

      case 'SkeletonAvatar':
        return (
          <div className="w-full h-32 bg-purple-50 dark:bg-purple-900 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-200 dark:bg-purple-700 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="w-16 h-3 bg-purple-200 dark:bg-purple-700 rounded animate-pulse"></div>
                  <div className="w-12 h-2 bg-purple-100 dark:bg-purple-800 rounded animate-pulse mt-1"></div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-200 dark:bg-purple-700 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="w-16 h-3 bg-purple-200 dark:bg-purple-700 rounded animate-pulse"></div>
                  <div className="w-12 h-2 bg-purple-100 dark:bg-purple-800 rounded animate-pulse mt-1"></div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">SkeletonAvatar</p>
          </div>
        )

      case 'SkeletonBlock':
        return (
          <div className="w-full h-32 bg-indigo-50 dark:bg-indigo-900 rounded-lg p-4">
            <div className="space-y-2">
              <div className="w-full h-8 bg-indigo-200 dark:bg-indigo-700 rounded animate-pulse"></div>
              <div className="w-full h-6 bg-indigo-200 dark:bg-indigo-700 rounded animate-pulse"></div>
              <div className="w-full h-6 bg-indigo-200 dark:bg-indigo-700 rounded animate-pulse"></div>
              <div className="grid grid-cols-2 gap-2">
                <div className="w-full h-12 bg-indigo-200 dark:bg-indigo-700 rounded animate-pulse"></div>
                <div className="w-full h-12 bg-indigo-200 dark:bg-indigo-700 rounded animate-pulse"></div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">SkeletonBlock</p>
          </div>
        )

      case 'SkeletonText':
        return (
          <div className="w-full h-32 bg-teal-50 dark:bg-teal-900 rounded-lg p-4">
            <div className="space-y-1">
              <div className="w-full h-3 bg-teal-200 dark:bg-teal-700 rounded animate-pulse"></div>
              <div className="w-4/5 h-3 bg-teal-200 dark:bg-teal-700 rounded animate-pulse"></div>
              <div className="w-3/4 h-3 bg-teal-200 dark:bg-teal-700 rounded animate-pulse"></div>
              <div className="w-5/6 h-3 bg-teal-200 dark:bg-teal-700 rounded animate-pulse"></div>
              <div className="w-2/3 h-3 bg-teal-200 dark:bg-teal-700 rounded animate-pulse"></div>
              <div className="w-3/5 h-3 bg-teal-200 dark:bg-teal-700 rounded animate-pulse"></div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">SkeletonText</p>
          </div>
        )

      case 'Snackbar':
        return (
          <div className="w-full h-32 bg-gray-900 rounded-lg p-4">
            <div className="space-y-2">
              <div className="bg-gray-800 text-white p-3 rounded-lg flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-xs">✓</div>
                <div className="flex-1">
                  <div className="w-20 h-2 bg-gray-600 rounded"></div>
                </div>
                <div className="w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center text-xs">×</div>
              </div>
              <div className="bg-gray-800 text-white p-3 rounded-lg flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-xs">i</div>
                <div className="flex-1">
                  <div className="w-24 h-2 bg-gray-600 rounded"></div>
                </div>
              </div>
              <div className="bg-gray-800 text-white p-3 rounded-lg flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center text-xs">!</div>
                <div className="flex-1">
                  <div className="w-16 h-2 bg-gray-600 rounded"></div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Snackbar</p>
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
      {renderFeedbackMotionPreview()}
    </div>
  )
}