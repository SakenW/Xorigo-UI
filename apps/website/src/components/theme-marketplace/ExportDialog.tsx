'use client'

/**
 * 💾 导出对话框组件
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Download } from 'lucide-react'
import type { PresetTheme } from '../../../../packages/core/src/theme/advanced/twenty-six-params'
import { enhancedThemeImportExport, ThemeFormat } from '../../../../packages/core/src/theme/export-import'

interface ExportDialogProps {
  themes: PresetTheme[]
  onClose: () => void
}

const ExportDialog: React.FC<ExportDialogProps> = ({ themes, onClose }) => {
  const [format, setFormat] = useState<ThemeFormat>(ThemeFormat.JSON)
  const [selectedThemes, setSelectedThemes] = useState<string[]>([])
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    setExporting(true)
    try {
      const themesToExport = themes.filter(t => selectedThemes.includes(t.id))
      const result = await enhancedThemeImportExport.exportThemes(themesToExport, {
        format,
        includeStats: true,
        includePreview: true
      })

      if (result.success && result.downloadUrl) {
        const link = document.createElement('a')
        link.href = result.downloadUrl
        link.download = result.filename
        link.click()
        onClose()
      }
    } catch (error) {
      console.error('导出失败:', error)
    } finally {
      setExporting(false)
    }
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
        className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            导出主题
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
              选择导出格式
            </p>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(ThemeFormat).map(fmt => (
                <button
                  key={fmt}
                  onClick={() => setFormat(fmt)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    format === fmt
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {fmt.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              主题数量: {themes.length}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{exporting ? '导出中...' : '导出'}</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ExportDialog
