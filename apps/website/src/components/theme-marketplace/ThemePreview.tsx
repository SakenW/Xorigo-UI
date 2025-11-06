'use client'

/**
 * 👁️ 主题预览组件
 */

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Check, Download, Share2 } from 'lucide-react'
import type { PresetTheme } from '../../../../packages/core/src/theme/advanced/twenty-six-params'

interface ThemePreviewProps {
  theme: PresetTheme
  onClose: () => void
  onApply: () => void
}

const ThemePreview: React.FC<ThemePreviewProps> = ({
  theme,
  onClose,
  onApply
}) => {
  const params = theme.parameters

  // 应用预览样式
  useEffect(() => {
    const root = document.documentElement

    // 应用26参数
    root.style.setProperty('--preview-hue', params.hue.primary.toString())
    root.style.setProperty('--preview-saturation', params.saturation.factor.toString())
    root.style.setProperty('--preview-lightness', params.lightness.factor.toString())
    root.style.setProperty('--preview-contrast', params.lightness.contrast.toString())
    root.style.setProperty('--preview-radius', params.roundness.radius.toString())

    return () => {
      root.style.removeProperty('--preview-hue')
      root.style.removeProperty('--preview-saturation')
      root.style.removeProperty('--preview-lightness')
      root.style.removeProperty('--preview-contrast')
      root.style.removeProperty('--preview-radius')
    }
  }, [theme])

  const primaryColor = `hsl(${params.hue.primary}, ${params.saturation.factor * 100}%, ${params.lightness.factor * 50}%)`
  const secondaryColor = `hsl(${params.hue.secondary || params.hue.primary}, ${params.saturation.factor * 100}%, ${params.lightness.factor * 60}%)`

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              {theme.name}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {theme.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 预览内容 */}
        <div className="p-6 space-y-6">
          {/* 主题色彩预览 */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              色彩预览
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div
                  className="h-20 rounded-lg shadow-inner"
                  style={{ backgroundColor: primaryColor }}
                />
                <p className="text-xs text-slate-600 dark:text-slate-400">主色调</p>
              </div>
              <div className="space-y-2">
                <div
                  className="h-20 rounded-lg shadow-inner"
                  style={{ backgroundColor: secondaryColor }}
                />
                <p className="text-xs text-slate-600 dark:text-slate-400">辅助色</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-slate-900 shadow-inner" />
                <p className="text-xs text-slate-600 dark:text-slate-400">深色背景</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-slate-50 shadow-inner" />
                <p className="text-xs text-slate-600 dark:text-slate-400">浅色背景</p>
              </div>
            </div>
          </div>

          {/* UI组件预览 */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              界面预览
            </h3>
            <div
              className="p-6 rounded-lg border-2"
              style={{
                borderColor: primaryColor,
                backgroundColor: 'rgba(255, 255, 255, 0.5)'
              }}
            >
              <div className="space-y-4">
                {/* 按钮 */}
                <div className="flex flex-wrap gap-3">
                  <button
                    className="px-4 py-2 text-white font-medium rounded-lg transition-all"
                    style={{ backgroundColor: primaryColor }}
                  >
                    主要按钮
                  </button>
                  <button
                    className="px-4 py-2 border-2 font-medium rounded-lg transition-all"
                    style={{
                      borderColor: primaryColor,
                      color: primaryColor
                    }}
                  >
                    次要按钮
                  </button>
                </div>

                {/* 输入框 */}
                <input
                  type="text"
                  placeholder="输入框示例"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none"
                  style={{ borderColor: primaryColor }}
                />

                {/* 卡片 */}
                <div
                  className="p-4 rounded-lg shadow-sm"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                >
                  <h4 className="font-medium mb-2">卡片标题</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    这是一个卡片组件的预览示例
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 主题参数 */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              主题参数
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-slate-500 dark:text-slate-500">模式</p>
                <p className="font-medium">{params.mode.mode}</p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-500">主色调</p>
                <p className="font-medium">{params.hue.primary}°</p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-500">饱和度</p>
                <p className="font-medium">{Math.round(params.saturation.factor * 100)}%</p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-500">亮度</p>
                <p className="font-medium">{Math.round(params.lightness.factor * 100)}%</p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-500">密度</p>
                <p className="font-medium">{params.density.level}</p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-500">圆度</p>
                <p className="font-medium">{params.roundness.radius}px</p>
              </div>
            </div>
          </div>
        </div>

        {/* 底部操作 */}
        <div className="sticky bottom-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center space-x-1">
              <Check className="w-4 h-4" />
              <span>实时预览</span>
            </div>
            <span>•</span>
            <span>主题 {theme.category}</span>
            <span>•</span>
            <span>评分 {theme.rating}</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {}}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              分享
            </button>
            <button
              onClick={onApply}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>应用主题</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ThemePreview
