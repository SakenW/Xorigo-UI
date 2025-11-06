'use client'

/**
 * 📤 分享对话框组件
 */

import React from 'react'
import { motion } from 'framer-motion'
import { X, Copy, QrCode } from 'lucide-react'
import type { PresetTheme } from '../../../../packages/core/src/theme/advanced/twenty-six-params'

interface ShareDialogProps {
  theme: PresetTheme
  onClose: () => void
}

const ShareDialog: React.FC<ShareDialogProps> = ({ theme, onClose }) => {
  const shareUrl = `${window.location.origin}/theme/${theme.id}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
  }

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
        className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            分享主题
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              主题名称
            </p>
            <p className="font-medium text-slate-900 dark:text-slate-100">
              {theme.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              分享链接
            </p>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm"
              />
              <button
                onClick={copyToClipboard}
                className="p-2 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex justify-center py-4">
            <div className="w-32 h-32 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
              <QrCode className="w-16 h-16 text-slate-400" />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ShareDialog
