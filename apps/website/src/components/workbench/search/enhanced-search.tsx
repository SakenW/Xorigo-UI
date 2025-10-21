'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@xorigo-ui/core'
import { cn } from '@/utils'

interface SearchHistoryProps {
  searchHistory: string[]
  onHistorySelect: (term: string) => void
  onHistoryClear: () => void
  onHistoryItemRemove: (term: string) => void
  isVisible: boolean
}

/**
 * 搜索历史组件 - 显示和管理用户的搜索历史
 */
export function SearchHistory({
  searchHistory,
  onHistorySelect,
  onHistoryClear,
  onHistoryItemRemove,
  isVisible
}: SearchHistoryProps) {
  if (!isVisible || searchHistory.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">🕐 搜索历史</span>
          <Badge variant="outline" className="text-xs">
            {searchHistory.length} 项
          </Badge>
        </div>
        <button
          onClick={onHistoryClear}
          className="text-xs text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          清除全部
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {searchHistory.map((term, index) => (
            <motion.button
              key={term}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onHistorySelect(term)}
              className="group inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <span className="truncate max-w-[120px]">{term}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onHistoryItemRemove(term)
                }}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
              >
                ✕
              </button>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

interface SearchSuggestionsProps {
  suggestions: string[]
  onSuggestionSelect: (suggestion: string) => void
  isVisible: boolean
  searchTerm: string
}

/**
 * 搜索建议组件 - 显示智能搜索建议
 */
export function SearchSuggestions({
  suggestions,
  onSuggestionSelect,
  isVisible,
  searchTerm
}: SearchSuggestionsProps) {
  if (!isVisible || suggestions.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden"
    >
      <div className="p-2">
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 py-2">
          💡 搜索建议
        </div>
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={suggestion}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSuggestionSelect(suggestion)}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 flex items-center justify-between group"
          >
            <span className="flex items-center gap-2">
              <span className="text-gray-400">🔍</span>
              <span>
                {suggestion.split(new RegExp(`(${searchTerm})`, 'gi')).map((part, i) => (
                  <span key={i}>
                    {part.toLowerCase() === searchTerm.toLowerCase() ? (
                      <span className="font-medium text-blue-600 dark:text-blue-400">{part}</span>
                    ) : (
                      part
                    )}
                  </span>
                ))}
              </span>
            </span>
            <kbd className="hidden group-hover:inline-block text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              ↑↓
            </kbd>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

// 搜索建议数据
const SEARCH_SUGGESTIONS = [
  '按钮组件',
  '表单输入',
  '数据展示',
  '导航菜单',
  '模态对话框',
  '布局容器',
  '卡片组件',
  '加载动画',
  '主题切换',
  '响应式设计',
  '无障碍支持',
  '渐变背景',
  '动画效果',
  '表格组件',
  '选择器',
  '开关组件',
  '进度条',
  '提示信息',
  '面包屑导航',
  '分页组件'
]