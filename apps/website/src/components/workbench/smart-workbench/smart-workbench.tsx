'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'
import { useSearchHistory } from '../../../hooks/use-search-history'
import { useSearchSuggestions } from '../../../hooks/use-search-suggestions'
import { useWorkbenchShortcuts } from '../../../hooks/use-keyboard-shortcuts'
import { SearchHistory, SearchSuggestions } from '../search/enhanced-search'
import { KeyboardShortcutsHelp } from '../help/keyboard-shortcuts-help'

// 添加渐变动画样式
const gradientStyles = `
  @keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .gradient-animated {
    background-size: 200% 200%;
    animation: gradient-shift 3s ease infinite;
  }
`

// 在组件挂载时注入样式
if (typeof window !== 'undefined') {
  const styleElement = document.createElement('style')
  styleElement.textContent = gradientStyles
  document.head.appendChild(styleElement)
}
import { Input } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'
import { ComponentCard } from '@xorigo-ui/core'
import { EnhancedComponentCard } from '../cards/enhanced-component-card'
import { GradientDemonstrator } from '../gradient-demonstrator/gradient-demonstrator'
import { getAllComponents } from '../../../data/component-classification'
import { ComponentPropertiesDrawer } from './component-properties-drawer'
import { WorkbenchLayout } from '../workbench-layout'
import { MasonryLayoutV2 } from '../shared/masonry-layout-v2'
import { ComponentPreviewRenderer } from '../component-previews/enhanced-component-previews'
import { generateComponentCodeExample } from '../component-previews/component-code-examples'

/**
 * 搜索框变体配置 - 应用 ComponentCard 优雅设计
 */
const searchBoxVariants = cva(
  'relative transition-all duration-300 rounded-2xl overflow-hidden',
  {
    variants: {
      focused: {
        true: [
          'ring-1 ring-inset ring-blue-500/20',
          'shadow-[0_4px_12px_rgba(59,130,246,0.08),0_2px_4px_rgba(59,130,246,0.04)]',
          'bg-white'
        ].join(' '),
        false: [
          'ring-1 ring-inset ring-black/5',
          'shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]',
          'hover:ring-black/10',
          'hover:shadow-[0_8px_24px_rgba(0,0,0,0.12),0_2px_4px_rgba(0,0,0,0.06)]',
          'bg-white'
        ].join(' ')
      }
    }
  }
)

interface SmartWorkbenchProps {
  className?: string
}

export function SmartWorkbench({ className }: SmartWorkbenchProps) {
  const [selectedComponent, setSelectedComponent] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showSearchHistory, setShowSearchHistory] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  const searchInputRef = useRef<HTMLInputElement>(null)

  // 搜索历史管理
  const {
    searchHistory,
    addToHistory,
    removeFromHistory,
    clearHistory,
    selectHistoryItem
  } = useSearchHistory()

  // 搜索建议管理
  const {
    suggestions,
    isLoading,
    popularSuggestions,
    showSuggestions
  } = useSearchSuggestions(searchTerm)

  const components = getAllComponents()

  useEffect(() => {
    setMounted(true)
  }, [])

  // 处理搜索
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term)
    if (term.trim()) {
      addToHistory(term)
    }
    setShowSearchHistory(false)
  }, [addToHistory])

  // 处理搜索建议选择
  const handleSuggestionSelect = useCallback((suggestion: string) => {
    handleSearch(suggestion)
    searchInputRef.current?.focus()
  }, [handleSearch])

  // 处理历史记录选择
  const handleHistorySelect = useCallback((term: string) => {
    handleSearch(term)
    selectHistoryItem(term)
    searchInputRef.current?.focus()
  }, [handleSearch, selectHistoryItem])

  // 处理搜索框焦点
  const handleSearchFocus = useCallback(() => {
    setIsSearchFocused(true)
    setShowSearchHistory(searchTerm.trim() === '')
  }, [searchTerm])

  const handleSearchBlur = useCallback((e: React.FocusEvent) => {
    // 延迟失去焦点，以便点击建议项
    setTimeout(() => {
      setIsSearchFocused(false)
      setShowSearchHistory(false)
    }, 150)
  }, [])

  // 清除搜索
  const handleClearSearch = useCallback(() => {
    setSearchTerm('')
    setShowSearchHistory(true)
    searchInputRef.current?.focus()
  }, [])

  // 获取所有分类
  const categories = useMemo(() => {
    return ['all', ...Array.from(new Set(components.map(comp => comp.category)))]
  }, [components])

  // 分类导航
  const handleNextCategory = useCallback(() => {
    const currentIndex = categories.indexOf(selectedCategory)
    const nextIndex = (currentIndex + 1) % categories.length
    setSelectedCategory(categories[nextIndex])
  }, [categories, selectedCategory])

  const handlePreviousCategory = useCallback(() => {
    const currentIndex = categories.indexOf(selectedCategory)
    const prevIndex = currentIndex === 0 ? categories.length - 1 : currentIndex - 1
    setSelectedCategory(categories[prevIndex])
  }, [categories, selectedCategory])

  // 快捷键管理
  const { shortcuts } = useWorkbenchShortcuts({
    onToggleSidebar: () => {
      // 这里可以触发侧边栏切换
      console.log('Toggle sidebar')
    },
    onFocusSearch: () => {
      searchInputRef.current?.focus()
    },
    onClearSearch: handleClearSearch,
    onNextCategory: handleNextCategory,
    onPreviousCategory: handlePreviousCategory,
    onToggleTheme: () => {
      // 这里可以触发主题切换
      console.log('Toggle theme')
    },
    onShowHelp: () => {
      setShowHelp(true)
    }
  })

  // 智能搜索逻辑 - 支持三层导航筛选
  const filteredComponents = components.filter(component => {
    const matchesSearch = searchTerm === '' ||
      component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.description.toLowerCase().includes(searchTerm.toLowerCase())

    // 支持三层导航筛选
    let matchesCategory = selectedCategory === 'all'

    if (!matchesCategory) {
      if (selectedCategory.startsWith('component-')) {
        // 第三层：具体组件筛选
        const componentName = selectedCategory.replace('component-', '')
        matchesCategory = component.name === componentName
      } else if (selectedCategory.includes('-')) {
        // 第二层：子分类筛选（如 base-buttons, form-inputs）
        const categoryMap: Record<string, string[]> = {
          'base-buttons': ['Button'],
          'base-text': ['Typography', 'Kbd'],
          'base-display': ['Icon', 'Avatar', 'AvatarGroup', 'Badge'],
          'base-separator': ['Separator'],
          'form-inputs': ['Input', 'Textarea', 'SearchInput'],
          'form-selection': ['Select', 'Checkbox', 'Radio', 'Switch', 'Combobox'],
          'form-controls': ['Slider'],
          'form-containers': ['Form', 'FormField'],
          'data-cards': ['Card', 'AdvancedCard', 'Surface'],
          'data-structures': ['Table', 'List', 'Accordion', 'Carousel'],
          'data-code': ['Code'],
          'layout-containers': ['Container', 'Box', 'Panel', 'ScrollArea'],
          'layout-systems': ['Flex', 'Grid'],
          'layout-spacing': ['Spacer'],
          'nav-tabs': ['Tabs'],
          'nav-menus': ['Menu', 'Breadcrumb', 'Pagination'],
          'nav-layout': ['Navbar', 'Sidebar', 'DataTable'],
          'feedback-alerts': ['Alert', 'Toast', 'Notification'],
          'feedback-loading': ['Loading', 'Spinner', 'Progress', 'Skeleton'],
          'feedback-theme': ['ThemeToggle'],
          'overlay-modals': ['Modal', 'Dialog', 'Sheet'],
          'overlay-drawers': ['Drawer'],
          'overlay-popovers': ['Popover', 'Tooltip', 'HoverCard'],
          'overlay-special': ['Lightbox'],
          'composite-ui': ['AnimatedCard', 'ResponsiveLayout', 'BasicHeader'],
          'composite-groups': ['InputGroup', 'ButtonGroup'],
          'system-providers': ['ConfigProvider'],
          'system-portals': ['Portal'],
          'system-focus': ['FocusTrap', 'FocusScope'],
          'system-utils': ['ScrollLock', 'DismissableLayer', 'VisuallyHidden'],
          'gradient-text': ['GradientText'],
          'gradient-background': ['GradientBackground'],
          'gradient-border': ['GradientBorder'],
          'gradient-demo': ['GradientDemo'],
          'viz-charts': ['Chart', 'BarChart', 'LineChart', 'PieChart'],
          'viz-gauges': ['Gauge', 'Stat'],
        }

        const allowedComponents = categoryMap[selectedCategory] || []
        matchesCategory = allowedComponents.includes(component.name)
      } else {
        // 第一层：大分类筛选（如 base, form, layout）
        matchesCategory = component.category === selectedCategory
      }
    }

    return matchesSearch && matchesCategory
  })

  // 搜索结果 - 转换为瀑布流所需格式（简化版）
  const masonryItems = filteredComponents.map((component) => ({
    id: component.name,
    content: null, // 我们使用children render prop
  }))


  // 获取推荐组件
  const recommendedComponents = components.slice(0, 6)

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // 处理分类选择
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
  }

  return (
    <WorkbenchLayout
      className={className}
      selectedCategory={selectedCategory}
      onCategorySelect={handleCategorySelect}
      hideHeader={true} // 隐藏布局的头部，因为我们已经在外层定义了
    >
      <div className="p-6">
        {/* 增强的智能搜索区域 */}
        <div className="mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={cn(searchBoxVariants({ focused: isSearchFocused }))}
          >
            <div className="p-8">
              {/* 搜索框标题 */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  🔍 组件搜索
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  智能搜索 60+ 个 UI 组件，支持按名称、功能和描述查找
                </p>
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>按 / 聚焦搜索</span>
                  <span>•</span>
                  <span>Esc 清除搜索</span>
                  <span>•</span>
                  <span>↑↓ 切换分类</span>
                  <span>•</span>
                  <button
                    onClick={() => setShowHelp(true)}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    查看所有快捷键
                  </button>
                </div>
              </div>

              <div className="relative mb-8">
                <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                  🔍
                </div>
                <div className="relative">
                  <Input
                    ref={searchInputRef}
                    placeholder="搜索组件名称、功能或描述... (例如: 按钮、表单、导航、模态框)"
                    value={searchTerm}
                    onChange={(e) => {
                      const newTerm = e.target.value
                      setSearchTerm(newTerm)
                      if (newTerm.trim() === '') {
                        setShowSearchHistory(true)
                      }
                    }}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch(searchTerm)
                      } else if (e.key === 'Escape') {
                        setSearchTerm('')
                        setShowSearchHistory(false)
                      }
                    }}
                    className="pl-16 pr-16 h-16 text-lg border-0 bg-transparent focus:outline-none focus:ring-0 placeholder:text-gray-400"
                  />
                  {searchTerm && (
                    <button
                      onClick={handleClearSearch}
                      className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                      title="清除搜索"
                    >
                      ✕
                    </button>
                  )}

                  {/* 搜索加载状态 */}
                  {isLoading && (
                    <div className="absolute right-16 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                    </div>
                  )}

                  {/* 搜索建议下拉框 */}
                  <AnimatePresence>
                    {showSuggestions && isSearchFocused && (
                      <SearchSuggestions
                        suggestions={suggestions}
                        onSuggestionSelect={handleSuggestionSelect}
                        isVisible={showSuggestions}
                        searchTerm={searchTerm}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* 搜索历史 */}
              <SearchHistory
                searchHistory={searchHistory}
                onHistorySelect={handleHistorySelect}
                onHistoryClear={clearHistory}
                onHistoryItemRemove={removeFromHistory}
                isVisible={showSearchHistory && searchHistory.length > 0}
              />

              {/* 增强的智能推荐标签 */}
              {!searchTerm && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-medium text-gray-700 dark:text-gray-300">✨ 智能推荐</span>
                      <span className="px-2 py-1 text-xs bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200 rounded">AI 驱动</span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">点击标签快速搜索</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {[
                      { tag: '🔘 按钮组件', color: 'from-blue-50 to-blue-100', textColor: 'text-blue-700', borderColor: 'border-blue-200' },
                      { tag: '📝 表单输入', color: 'from-green-50 to-green-100', textColor: 'text-green-700', borderColor: 'border-green-200' },
                      { tag: '📊 数据展示', color: 'from-purple-50 to-purple-100', textColor: 'text-purple-700', borderColor: 'border-purple-200' },
                      { tag: '🧭 导航菜单', color: 'from-orange-50 to-orange-100', textColor: 'text-orange-700', borderColor: 'border-orange-200' },
                      { tag: '🪟 模态对话框', color: 'from-pink-50 to-pink-100', textColor: 'text-pink-700', borderColor: 'border-pink-200' },
                      { tag: '📦 布局容器', color: 'from-indigo-50 to-indigo-100', textColor: 'text-indigo-700', borderColor: 'border-indigo-200' }
                    ].map((item) => (
                      <motion.button
                        key={item.tag}
                        onClick={() => handleSearch(item.tag)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                          "px-4 py-3 text-sm font-medium rounded-xl border transition-all duration-300 hover:shadow-md active:scale-95",
                          `bg-gradient-to-r ${item.color} ${item.textColor} ${item.borderColor} hover:shadow-lg`
                        )}
                      >
                        {item.tag}
                      </motion.button>
                    ))}
                  </div>

                  {/* 热门搜索 */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">🔥 热门搜索</span>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse delay-75"></div>
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse delay-150"></div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {popularSuggestions.map((tag) => (
                        <motion.button
                          key={tag}
                          onClick={() => handleSearch(tag)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                        >
                          {tag}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 搜索结果统计 */}
              {searchTerm && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        搜索 "<span className="font-medium text-gray-900 dark:text-white">{searchTerm}</span>" 的结果
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {filteredComponents.length} 个组件
                      </span>
                      <button
                        onClick={handleClearSearch}
                        className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                      >
                        清除搜索
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* 组件分类和统计信息 */}
        <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <span>🎨</span>
                组件库
              </h1>
              <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
                探索 60+ 个高质量 UI 组件，涵盖基础、表单、布局、导航等 10 大分类
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {filteredComponents.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                个组件
              </div>
            </div>
          </div>

          {/* 增强的统计信息 */}
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              {filteredComponents.length} 个组件
            </span>
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                {selectedCategory}
              </span>
            )}
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              完整无障碍支持
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              TypeScript 类型安全
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400 border border-pink-200 dark:border-pink-800">
              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
              响应式设计
            </span>
          </div>
        </div>

        {/* 现代化瀑布流布局 - 使用简化版 */}
        <div className="relative w-full min-h-[400px]">
          <MasonryLayoutV2
            items={masonryItems}
            columns={3}
            gap={24}
            enableAnimation={true}
            itemClassName="masonry-item"
          >
            {(item) => {
              const component = filteredComponents.find(c => c.name === item.id)
              if (!component) return null

              return (
                <EnhancedComponentCard
                  key={component.name}
                  component={component}
                  variant="default"
                  density="comfortable"
                  interactive={true}
                  showcase={
                    <ComponentPreviewRenderer component={component} />
                  }
                usage={
                  <div className="p-4 bg-gray-100 rounded-lg">
                    <div className="text-sm font-medium mb-2">{component.name} 组件示例</div>
                    <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                      <code>{generateComponentCodeExample({ componentName: component.name })}</code>
                    </pre>
                  </div>
                }
              />
            )
          }}
          </MasonryLayoutV2>

          {/* 空状态处理 */}
          {masonryItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">没有找到匹配的组件</h3>
                <p className="text-gray-600 mb-6">尝试调整搜索关键词或选择不同的分类</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('all')
                  }}
                >
                  清除过滤条件
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        {/* 属性编辑器 - 抽屉式面板 */}
        <AnimatePresence>
          {selectedComponent && (
            <ComponentPropertiesDrawer
              component={selectedComponent}
              isOpen={!!selectedComponent}
              onClose={() => setSelectedComponent(null)}
            />
          )}
        </AnimatePresence>

        {/* 键盘快捷键帮助面板 */}
        <KeyboardShortcutsHelp
          isOpen={showHelp}
          onClose={() => setShowHelp(false)}
          shortcuts={shortcuts}
        />
      </div>
    </WorkbenchLayout>
  )
}