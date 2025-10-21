'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@xorigo-ui/core'
import { cn } from '@/utils'

interface KeyboardShortcutsHelpProps {
  isOpen: boolean
  onClose: () => void
  shortcuts: Array<{
    keys: string
    description: string
  }>
}

/**
 * 键盘快捷键帮助面板
 */
export function KeyboardShortcutsHelp({
  isOpen,
  onClose,
  shortcuts
}: KeyboardShortcutsHelpProps) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 头部 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400">⌨️</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  键盘快捷键
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  提高工作效率的快捷操作
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </Button>
          </div>

          {/* 快捷键列表 */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="grid gap-4">
              {shortcuts.map((shortcut, index) => (
                <motion.div
                  key={shortcut.keys}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <kbd className={cn(
                      "px-3 py-1.5 text-sm font-mono bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm",
                      "text-gray-700 dark:text-gray-300"
                    )}>
                      {shortcut.keys}
                    </kbd>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {shortcut.description}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* 提示信息 */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 text-lg">💡</span>
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                    使用提示
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    快捷键可以在页面的任何地方使用。按 Esc 键可以快速关闭对话框或清除搜索。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 底部操作 */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <Button variant="outline" onClick={onClose}>
              关闭
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

/**
 * 快捷键提示组件
 */
export function ShortcutTooltip({
  shortcut,
  children
}: {
  shortcut: string
  children: React.ReactNode
}) {
  return (
    <div className="group relative inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        {shortcut}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  )
}