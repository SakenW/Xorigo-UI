'use client'

import { useState, useEffect, useCallback } from 'react'

const SEARCH_HISTORY_KEY = 'xorigo-workbench-search-history'
const MAX_HISTORY_ITEMS = 10

/**
 * 搜索历史管理钩子
 */
export function useSearchHistory() {
  const [searchHistory, setSearchHistoryState] = useState<string[]>([])

  // 从 localStorage 加载搜索历史
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SEARCH_HISTORY_KEY)
      if (stored) {
        const history = JSON.parse(stored)
        if (Array.isArray(history)) {
          setSearchHistoryState(history.slice(0, MAX_HISTORY_ITEMS))
        }
      }
    } catch (error) {
      console.warn('Failed to load search history:', error)
    }
  }, [])

  // 保存搜索历史到 localStorage
  const saveHistory = useCallback((history: string[]) => {
    try {
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history))
    } catch (error) {
      console.warn('Failed to save search history:', error)
    }
  }, [])

  // 添加搜索项到历史记录
  const addToHistory = useCallback((term: string) => {
    if (!term || term.trim() === '') return

    const trimmedTerm = term.trim()
    setSearchHistoryState(prevHistory => {
      // 移除重复项
      const newHistory = prevHistory.filter(item => item !== trimmedTerm)
      // 添加到开头
      newHistory.unshift(trimmedTerm)
      // 限制数量
      const limitedHistory = newHistory.slice(0, MAX_HISTORY_ITEMS)

      saveHistory(limitedHistory)
      return limitedHistory
    })
  }, [saveHistory])

  // 从历史记录中移除指定项
  const removeFromHistory = useCallback((term: string) => {
    setSearchHistoryState(prevHistory => {
      const newHistory = prevHistory.filter(item => item !== term)
      saveHistory(newHistory)
      return newHistory
    })
  }, [saveHistory])

  // 清空搜索历史
  const clearHistory = useCallback(() => {
    setSearchHistoryState([])
    try {
      localStorage.removeItem(SEARCH_HISTORY_KEY)
    } catch (error) {
      console.warn('Failed to clear search history:', error)
    }
  }, [])

  // 选择历史记录项
  const selectHistoryItem = useCallback((term: string) => {
    // 将选中的项移到最前面
    setSearchHistoryState(prevHistory => {
      const newHistory = prevHistory.filter(item => item !== term)
      newHistory.unshift(term)
      const limitedHistory = newHistory.slice(0, MAX_HISTORY_ITEMS)
      saveHistory(limitedHistory)
      return limitedHistory
    })
  }, [saveHistory])

  return {
    searchHistory,
    addToHistory,
    removeFromHistory,
    clearHistory,
    selectHistoryItem
  }
}