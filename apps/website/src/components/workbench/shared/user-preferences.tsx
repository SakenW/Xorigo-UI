'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings,
  X,
  Save,
  RotateCcw,
  Moon,
  Sun,
  Monitor,
  Globe,
  Palette,
  Zap,
  Eye,
  EyeOff,
  History,
  Trash2,
  Download,
  Upload,
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  CheckCircle,
  AlertCircle,
  Info,
  HelpCircle,
  Star,
  Heart,
  Bookmark,
  Search,
  Filter,
  Grid,
  List
} from 'lucide-react'
import { Button } from '@xorigo-ui/core'
import { Input } from '@xorigo-ui/core'
import { cn } from '@/utils'

// 用户偏好接口（扩展版本）
interface UserPreferences {
  // 界面设置
  defaultView: 'solutions' | 'components'
  theme: 'light' | 'dark' | 'auto'
  language: 'zh-CN' | 'en-US'
  compactMode: boolean
  animationsEnabled: boolean
  showAdvanced: boolean

  // 显示设置
  pageSize: number
  viewMode: 'grid' | 'list'
  showDescriptions: boolean
  showBadges: boolean
  showPreview: boolean

  // 搜索设置
  searchHistory: string[]
  searchSuggestions: boolean
  instantSearch: boolean
  searchHistoryLimit: number

  // 通知设置
  notifications: {
    enabled: boolean
    sound: boolean
    desktop: boolean
    email: boolean
  }

  // 收藏和历史
  favoriteComponents: string[]
  favoriteSolutions: string[]
  recentlyViewed: {
    id: string
    type: 'component' | 'solution' | 'template'
    label: string
    timestamp: Date
  }[]
  historyLimit: number

  // 性能设置
  cacheEnabled: boolean
  preloadEnabled: boolean
  lazyLoading: boolean

  // 开发者设置
  debugMode: boolean
  showComponentInfo: boolean
  showPerformanceMetrics: boolean
}

interface UserPreferencesProps {
  isOpen: boolean
  onClose: () => void
  onPreferencesChange?: (preferences: UserPreferences) => void
  className?: string
}

export function UserPreferences({
  isOpen,
  onClose,
  onPreferencesChange,
  className
}: UserPreferencesProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'display' | 'search' | 'notifications' | 'data'>('general')
  const [preferences, setPreferences] = useState<UserPreferences>({
    // 界面设置
    defaultView: 'solutions',
    theme: 'auto',
    language: 'zh-CN',
    compactMode: false,
    animationsEnabled: true,
    showAdvanced: false,

    // 显示设置
    pageSize: 20,
    viewMode: 'grid',
    showDescriptions: true,
    showBadges: true,
    showPreview: true,

    // 搜索设置
    searchHistory: [],
    searchSuggestions: true,
    instantSearch: true,
    searchHistoryLimit: 50,

    // 通知设置
    notifications: {
      enabled: true,
      sound: true,
      desktop: false,
      email: false
    },

    // 收藏和历史
    favoriteComponents: [],
    favoriteSolutions: [],
    recentlyViewed: [],
    historyLimit: 100,

    // 性能设置
    cacheEnabled: true,
    preloadEnabled: true,
    lazyLoading: true,

    // 开发者设置
    debugMode: false,
    showComponentInfo: false,
    showPerformanceMetrics: false
  })

  const [hasChanges, setHasChanges] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  // 从 localStorage 加载偏好设置
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('xorigo-workbench-preferences')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setPreferences(prev => ({ ...prev, ...parsed }))
        } catch (error) {
          console.error('Failed to load preferences:', error)
        }
      }
    }
  }, [])

  // 检测系统主题
  useEffect(() => {
    if (preferences.theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => {
        document.documentElement.classList.toggle('dark', mediaQuery.matches)
      }
      handleChange()
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } else {
      document.documentElement.classList.toggle('dark', preferences.theme === 'dark')
    }
  }, [preferences.theme])

  // 保存偏好设置
  const savePreferences = () => {
    setSaveStatus('saving')
    try {
      localStorage.setItem('xorigo-workbench-preferences', JSON.stringify(preferences))
      onPreferencesChange?.(preferences)
      setHasChanges(false)
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error) {
      console.error('Failed to save preferences:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  // 重置偏好设置
  const resetPreferences = () => {
    const defaultPreferences: UserPreferences = {
      defaultView: 'solutions',
      theme: 'auto',
      language: 'zh-CN',
      compactMode: false,
      animationsEnabled: true,
      showAdvanced: false,
      pageSize: 20,
      viewMode: 'grid',
      showDescriptions: true,
      showBadges: true,
      showPreview: true,
      searchHistory: [],
      searchSuggestions: true,
      instantSearch: true,
      searchHistoryLimit: 50,
      notifications: {
        enabled: true,
        sound: true,
        desktop: false,
        email: false
      },
      favoriteComponents: [],
      favoriteSolutions: [],
      recentlyViewed: [],
      historyLimit: 100,
      cacheEnabled: true,
      preloadEnabled: true,
      lazyLoading: true,
      debugMode: false,
      showComponentInfo: false,
      showPerformanceMetrics: false
    }
    setPreferences(defaultPreferences)
    setHasChanges(true)
  }

  // 更新偏好设置
  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }))
    setHasChanges(true)
  }

  // 清除搜索历史
  const clearSearchHistory = () => {
    updatePreferences({ searchHistory: [] })
  }

  // 清除浏览历史
  const clearViewHistory = () => {
    updatePreferences({ recentlyViewed: [] })
  }

  // 导出偏好设置
  const exportPreferences = () => {
    const dataStr = JSON.stringify(preferences, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = `xorigo-preferences-${new Date().toISOString().split('T')[0]}.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  // 导入偏好设置
  const importPreferences = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string)
          setPreferences(prev => ({ ...prev, ...imported }))
          setHasChanges(true)
        } catch (error) {
          console.error('Failed to import preferences:', error)
        }
      }
      reader.readAsText(file)
    }
  }

  const tabs = [
    { id: 'general', label: '常规', icon: <Settings className="w-4 h-4" /> },
    { id: 'display', label: '显示', icon: <Eye className="w-4 h-4" /> },
    { id: 'search', label: '搜索', icon: <Search className="w-4 h-4" /> },
    { id: 'notifications', label: '通知', icon: <Bell className="w-4 h-4" /> },
    { id: 'data', label: '数据', icon: <Database className="w-4 h-4" /> }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* 设置面板 */}
          <motion.div
            initial={{ opacity: 0, x: 300, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              'fixed top-0 right-0 bottom-0 z-50 w-full max-w-2xl bg-white dark:bg-gray-900 shadow-2xl',
              'flex flex-col overflow-hidden',
              className
            )}
          >
            {/* 头部 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  用户偏好设置
                </h2>
              </div>

              <div className="flex items-center gap-2">
                {hasChanges && (
                  <Button
                    onClick={savePreferences}
                    disabled={saveStatus === 'saving'}
                    className="flex items-center gap-2"
                  >
                    {saveStatus === 'saving' ? (
                      <RotateCcw className="w-4 h-4 animate-spin" />
                    ) : saveStatus === 'saved' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : saveStatus === 'error' ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {saveStatus === 'saving' ? '保存中...' :
                     saveStatus === 'saved' ? '已保存' :
                     saveStatus === 'error' ? '保存失败' : '保存更改'}
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="p-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* 标签页 */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap',
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  )}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* 内容区域 */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* 常规设置 */}
              {activeTab === 'general' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      界面设置
                    </h3>

                    <div className="space-y-4">
                      {/* 默认视图 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          默认视图
                        </label>
                        <select
                          value={preferences.defaultView}
                          onChange={(e) => updatePreferences({ defaultView: e.target.value as any })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          <option value="solutions">解决方案平台</option>
                          <option value="components">组件库</option>
                        </select>
                      </div>

                      {/* 主题设置 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          主题
                        </label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => updatePreferences({ theme: 'light' })}
                            className={cn(
                              'flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors',
                              preferences.theme === 'light'
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                            )}
                          >
                            <Sun className="w-4 h-4" />
                            浅色
                          </button>
                          <button
                            onClick={() => updatePreferences({ theme: 'dark' })}
                            className={cn(
                              'flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors',
                              preferences.theme === 'dark'
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                            )}
                          >
                            <Moon className="w-4 h-4" />
                            深色
                          </button>
                          <button
                            onClick={() => updatePreferences({ theme: 'auto' })}
                            className={cn(
                              'flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors',
                              preferences.theme === 'auto'
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                            )}
                          >
                            <Monitor className="w-4 h-4" />
                            自动
                          </button>
                        </div>
                      </div>

                      {/* 语言设置 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          语言
                        </label>
                        <select
                          value={preferences.language}
                          onChange={(e) => updatePreferences({ language: e.target.value as any })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          <option value="zh-CN">简体中文</option>
                          <option value="en-US">English</option>
                        </select>
                      </div>

                      {/* 开关选项 */}
                      <div className="space-y-3">
                        <label className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            紧凑模式
                          </span>
                          <input
                            type="checkbox"
                            checked={preferences.compactMode}
                            onChange={(e) => updatePreferences({ compactMode: e.target.checked })}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </label>

                        <label className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            启用动画
                          </span>
                          <input
                            type="checkbox"
                            checked={preferences.animationsEnabled}
                            onChange={(e) => updatePreferences({ animationsEnabled: e.target.checked })}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </label>

                        <label className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            显示高级功能
                          </span>
                          <input
                            type="checkbox"
                            checked={preferences.showAdvanced}
                            onChange={(e) => updatePreferences({ showAdvanced: e.target.checked })}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 显示设置 */}
              {activeTab === 'display' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      显示设置
                    </h3>

                    <div className="space-y-4">
                      {/* 每页显示数量 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          每页显示数量
                        </label>
                        <Input
                          type="number"
                          min="10"
                          max="100"
                          value={preferences.pageSize}
                          onChange={(e) => updatePreferences({ pageSize: parseInt(e.target.value) || 20 })}
                        />
                      </div>

                      {/* 视图模式 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          视图模式
                        </label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => updatePreferences({ viewMode: 'grid' })}
                            className={cn(
                              'flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors',
                              preferences.viewMode === 'grid'
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                            )}
                          >
                            <Grid className="w-4 h-4" />
                            网格
                          </button>
                          <button
                            onClick={() => updatePreferences({ viewMode: 'list' })}
                            className={cn(
                              'flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors',
                              preferences.viewMode === 'list'
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                            )}
                          >
                            <List className="w-4 h-4" />
                            列表
                          </button>
                        </div>
                      </div>

                      {/* 显示选项 */}
                      <div className="space-y-3">
                        <label className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            显示描述
                          </span>
                          <input
                            type="checkbox"
                            checked={preferences.showDescriptions}
                            onChange={(e) => updatePreferences({ showDescriptions: e.target.checked })}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </label>

                        <label className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            显示徽章
                          </span>
                          <input
                            type="checkbox"
                            checked={preferences.showBadges}
                            onChange={(e) => updatePreferences({ showBadges: e.target.checked })}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </label>

                        <label className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            显示预览
                          </span>
                          <input
                            type="checkbox"
                            checked={preferences.showPreview}
                            onChange={(e) => updatePreferences({ showPreview: e.target.checked })}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 搜索设置 */}
              {activeTab === 'search' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      搜索设置
                    </h3>

                    <div className="space-y-4">
                      {/* 搜索历史限制 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          搜索历史限制
                        </label>
                        <Input
                          type="number"
                          min="10"
                          max="200"
                          value={preferences.searchHistoryLimit}
                          onChange={(e) => updatePreferences({ searchHistoryLimit: parseInt(e.target.value) || 50 })}
                        />
                      </div>

                      {/* 搜索选项 */}
                      <div className="space-y-3">
                        <label className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            搜索建议
                          </span>
                          <input
                            type="checkbox"
                            checked={preferences.searchSuggestions}
                            onChange={(e) => updatePreferences({ searchSuggestions: e.target.checked })}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </label>

                        <label className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            即时搜索
                          </span>
                          <input
                            type="checkbox"
                            checked={preferences.instantSearch}
                            onChange={(e) => updatePreferences({ instantSearch: e.target.checked })}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </label>
                      </div>

                      {/* 清除搜索历史 */}
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              搜索历史
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              当前有 {preferences.searchHistory.length} 条记录
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={clearSearchHistory}
                            className="flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            清除历史
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 通知设置 */}
              {activeTab === 'notifications' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      通知设置
                    </h3>

                    <div className="space-y-4">
                      <div className="space-y-3">
                        <label className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Bell className="w-4 h-4" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              启用通知
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={preferences.notifications.enabled}
                            onChange={(e) => updatePreferences({
                              notifications: { ...preferences.notifications, enabled: e.target.checked }
                            })}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </label>

                        <label className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Volume2 className="w-4 h-4" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              声音提醒
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={preferences.notifications.sound}
                            onChange={(e) => updatePreferences({
                              notifications: { ...preferences.notifications, sound: e.target.checked }
                            })}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </label>

                        <label className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Monitor className="w-4 h-4" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              桌面通知
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={preferences.notifications.desktop}
                            onChange={(e) => updatePreferences({
                              notifications: { ...preferences.notifications, desktop: e.target.checked }
                            })}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 数据管理 */}
              {activeTab === 'data' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      数据管理
                    </h3>

                    <div className="space-y-6">
                      {/* 统计信息 */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            收藏组件
                          </p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {preferences.favoriteComponents.length}
                          </p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            收藏方案
                          </p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {preferences.favoriteSolutions.length}
                          </p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            浏览历史
                          </p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {preferences.recentlyViewed.length}
                          </p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            搜索历史
                          </p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {preferences.searchHistory.length}
                          </p>
                        </div>
                      </div>

                      {/* 数据操作 */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              浏览历史
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              清除所有浏览记录
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={clearViewHistory}
                            className="flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            清除
                          </Button>
                        </div>
                      </div>

                      {/* 导入导出 */}
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          导入/导出设置
                        </h4>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={exportPreferences}
                            className="flex items-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            导出设置
                          </Button>
                          <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                            <Upload className="w-4 h-4" />
                            <span className="text-sm">导入设置</span>
                            <input
                              type="file"
                              accept=".json"
                              onChange={importPreferences}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>

                      {/* 重置设置 */}
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button
                          variant="outline"
                          onClick={resetPreferences}
                          className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                        >
                          <RotateCcw className="w-4 h-4" />
                          重置所有设置
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* 底部状态栏 */}
            {hasChanges && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-yellow-50 dark:bg-yellow-900/20">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm text-yellow-700 dark:text-yellow-300">
                    您有未保存的更改
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// 数据库图标的临时替代
const Database = ({ className }: { className?: string }) => (
  <div className={cn('w-4 h-4', className)}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
    </svg>
  </div>
)