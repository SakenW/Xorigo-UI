'use client'

import React from 'react'

interface CardRendererProps {
  title?: string
  subtitle?: string
  content?: string
  showAvatar?: boolean
  showActions?: boolean
  showImage?: boolean
  size?: 'small' | 'medium' | 'large'
  variant?: 'default' | 'outlined' | 'elevated'
  updateProp?: (prop: string, value: any) => void
}

export default function CardRenderer({
  title = '卡片标题',
  subtitle = '卡片副标题',
  content = '这是一个卡片组件的示例内容。卡片可以用来展示相关的信息，支持多种布局和样式选项。',
  showAvatar = true,
  showActions = true,
  showImage = false,
  size = 'medium',
  variant = 'elevated',
  updateProp
}: CardRendererProps) {
  const getSizeClasses = () => {
    const sizeClasses = {
      small: 'p-4',
      medium: 'p-6',
      large: 'p-8'
    }
    return sizeClasses[size]
  }

  const getVariantClasses = () => {
    const variantClasses = {
      default: 'border border-gray-200 dark:border-gray-700',
      outlined: 'border-2 border-gray-300 dark:border-gray-600',
      elevated: 'shadow-lg hover:shadow-xl transition-shadow'
    }
    return variantClasses[variant]
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* 卡片主体 */}
      <div className={`bg-white dark:bg-gray-800 rounded-lg ${getVariantClasses()} ${getSizeClasses()}`}>
        {/* 图片区域 */}
        {showImage && (
          <div className="relative -mx-6 -mt-6 mb-4">
            <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg flex items-center justify-center">
              <span className="text-white text-lg font-medium">卡片图片</span>
            </div>
          </div>
        )}

        {/* 头部区域 */}
        <div className="flex items-start space-x-4">
          {/* 头像 */}
          {showAvatar && (
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              A
            </div>
          )}

          {/* 标题信息 */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* 内容区域 */}
        <div className="mt-4">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {content}
          </p>
        </div>

        {/* 标签 */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full">
            标签1
          </span>
          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs rounded-full">
            标签2
          </span>
          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs rounded-full">
            标签3
          </span>
        </div>

        {/* 操作按钮 */}
        {showActions && (
          <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <button className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                </svg>
              </button>
              <button className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                </svg>
              </button>
              <button className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
                </svg>
              </button>
            </div>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
              查看详情 →
            </button>
          </div>
        )}
      </div>

      {/* 配置面板 */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          卡片配置
        </h4>

        <div className="grid grid-cols-2 gap-4">
          {/* 尺寸 */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              尺寸
            </label>
            <select
              value={size}
              onChange={(e) => updateProp && updateProp('size', e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
            >
              <option value="small">小</option>
              <option value="medium">中</option>
              <option value="large">大</option>
            </select>
          </div>

          {/* 变体 */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              样式变体
            </label>
            <select
              value={variant}
              onChange={(e) => updateProp && updateProp('variant', e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
            >
              <option value="default">默认</option>
              <option value="outlined">边框</option>
              <option value="elevated">阴影</option>
            </select>
          </div>
        </div>

        {/* 显示选项 */}
        <div className="mt-4 space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showAvatar}
              onChange={(e) => updateProp && updateProp('showAvatar', e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">显示头像</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showImage}
              onChange={(e) => updateProp && updateProp('showImage', e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">显示图片</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showActions}
              onChange={(e) => updateProp && updateProp('showActions', e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">显示操作按钮</span>
          </label>
        </div>
      </div>
    </div>
  )
}