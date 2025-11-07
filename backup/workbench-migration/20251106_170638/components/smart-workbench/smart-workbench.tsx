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
import { SiteNavigation } from '@/components/shared/site-navigation'
import { SmartBreadcrumb } from '../shared/smart-breadcrumb'
import { UserPreferences } from '../shared/user-preferences'
import { SolutionPlatformHome } from '../solution-platform/solution-platform-home'
import { SolutionDetails } from '../solution-platform/solution-details'
import { ComponentLibraryHome } from '../component-library/component-library-home'
import { EnhancedComponentCard } from '../cards/enhanced-component-card'
import { getAllComponents } from '../../../data/component-classification'
import { ComponentPropertiesDrawer } from './component-properties-drawer'
import { WorkbenchLayout } from '../workbench-layout'
import { MasonryLayoutV2 } from '../shared/masonry-layout-v2'
import { ComponentPreviewRenderer } from '../component-previews/enhanced-component-previews'
import { generateComponentCodeExample } from '../component-previews/component-code-examples'
import { Input } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'
import type { BusinessScenario, SolutionTemplate } from '../solution-platform/business-scenario-card'
import { AIAssistantPanel } from '../ai-assistant'
import { DebugToolsMain } from '../debug-tools/debug-tools-main'
import PerformanceMonitoring from '../solution-platform/performance-monitoring'
import { Bot, BarChart3 } from 'lucide-react'

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
  // 核心状态管理
  const [currentView, setCurrentView] = useState<'solutions' | 'components' | 'debug-tools' | 'performance-monitoring'>('solutions')
  const [showDebugTools, setShowDebugTools] = useState(false)
      const [selectedComponent, setSelectedComponent] = useState<any>(null)
  const [selectedScenario, setSelectedScenario] = useState<BusinessScenario | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showSearchHistory, setShowSearchHistory] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [showAIAssistant, setShowAIAssistant] = useState(false)

  const searchInputRef = useRef<HTMLInputElement>(null)

  // 组件数据
  const components = useMemo(() => getAllComponents(), [])

  // 生成面包屑导航项目
  const breadcrumbItems = useMemo(() => {
    const items = []

    // 主视图
    items.push({
      id: currentView,
      label: currentView === 'solutions' ? '解决方案平台' :
             currentView === 'components' ? '组件库' :
             currentView === 'performance-monitoring' ? '性能监控' : '调试工具',
      isActive: !selectedScenario && !selectedComponent,
      icon: currentView === 'solutions' ? '🎯' :
            currentView === 'components' ? '📚' :
            currentView === 'performance-monitoring' ? '📊' : '🔧'
    })

    // 如果选择了业务场景
    if (selectedScenario) {
      items.push({
        id: selectedScenario.id,
        label: selectedScenario.title,
        isActive: true,
        icon: '🚀',
        description: selectedScenario.description
      })
    }

    // 如果选择了组件
    if (selectedComponent) {
      items.push({
        id: selectedComponent.id,
        label: selectedComponent.name,
        isActive: true,
        icon: '🧩',
        description: selectedComponent.description
      })
    }

    // 如果选择了组件分类
    if (currentView === 'components' && selectedCategory && selectedCategory !== 'all') {
      const categoryMap: Record<string, string> = {
        'base': '基础组件',
        'form': '表单组件',
        'data': '数据展示',
        'layout': '布局组件',
        'nav': '导航组件',
        'feedback': '反馈组件',
        'overlay': '覆盖层组件',
        'composite': '复合组件',
        'system': '系统组件',
        'gradient': '渐变组件',
        'viz': '可视化组件'
      }

      const categoryName = categoryMap[selectedCategory.split('-')[0]] || selectedCategory

      // 在主视图后插入分类
      if (!selectedComponent) {
        items.splice(1, 0, {
          id: selectedCategory,
          label: categoryName,
          isActive: true,
          icon: '📂',
          description: `浏览 ${categoryName} 相关组件`
        })
      }
    }

    return items
  }, [currentView, selectedScenario, selectedComponent, selectedCategory])

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

  // 挂载状态
  useEffect(() => {
    setMounted(true)
  }, [])

  // 处理业务场景选择
  const handleScenarioSelect = useCallback((scenario: BusinessScenario) => {
    setSelectedScenario(scenario)
  }, [])

  // 处理视图切换
  const handleViewChange = useCallback((view: 'solutions' | 'components') => {
    setCurrentView(view)
    setSearchTerm('')
    setSelectedCategory('all')
    setSelectedComponent(null)
    // 保持选中的业务场景，不重置
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
      console.log('Toggle sidebar')
    },
    onFocusSearch: () => {
      searchInputRef.current?.focus()
    },
    onClearSearch: handleClearSearch,
    onNextCategory: handleNextCategory,
    onPreviousCategory: handlePreviousCategory,
    onToggleTheme: () => {
      console.log('Toggle theme')
    },
    onShowHelp: () => {
      setShowHelp(true)
    },
    onToggleAIAssistant: () => {
      setShowAIAssistant(!showAIAssistant)
    }
  })

  // 智能搜索逻辑 - 支持三层导航筛选
  const filteredComponents = useMemo(() => {
    return components.filter(component => {
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
  }, [components, searchTerm, selectedCategory])

  // 搜索结果 - 转换为瀑布流所需格式
  const masonryItems = useMemo(() => {
    return filteredComponents.map((component) => ({
      id: component.name,
      content: null,
    }))
  }, [filteredComponents])

  // 获取推荐组件
  const recommendedComponents = useMemo(() => {
    return components.slice(0, 6)
  }, [components])

  // 处理分类选择
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
  }

  // 处理解决方案选择
  const handleSolutionSelect = useCallback((solution: SolutionTemplate) => {
    console.log('Selected solution:', solution)
    // 这里可以跳转到代码生成页面或者打开代码预览面板
  }, [])

  // 处理组件选择
  const handleComponentSelect = useCallback((component: any) => {
    setSelectedComponent(component)
  }, [])

  // 处理关闭解决方案详情
  const handleCloseSolutionDetails = useCallback(() => {
    setSelectedScenario(null)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <>
      {/* 统一导航栏 */}
      <SiteNavigation
        showWorkbenchNav={true}
        currentView={currentView}
        onViewChange={handleViewChange}
      />

      {/* 主要内容区域 */}
      <WorkbenchLayout
        className={className}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
        hideHeader={false}
      >
        <AnimatePresence mode="wait">
          {selectedScenario ? (
            <motion.div
              key="solution-details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SolutionDetails
                scenario={selectedScenario}
                onClose={handleCloseSolutionDetails}
                onSolutionSelect={handleSolutionSelect}
              />
            </motion.div>
          ) : currentView === 'solutions' ? (
            <motion.div
              key="solutions"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* 解决方案平台首页 */}
              <SolutionPlatformHome onScenarioSelect={handleScenarioSelect} />
            </motion.div>
          ) : currentView === 'components' ? (
            <motion.div
              key="components"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* 组件库展示页面 */}
              <ComponentLibraryHome onComponentSelect={handleComponentSelect} />
            </motion.div>
          ) : currentView === 'performance-monitoring' ? (
            <motion.div
              key="performance-monitoring"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PerformanceMonitoring />
            </motion.div>
          ) : (
            <motion.div
              key="debug-tools"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* 调试工具页面 */}
              <DebugToolsMain className="px-6 py-6" />
            </motion.div>
          )}
        </AnimatePresence>

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

        {/* 用户偏好设置面板 */}
        <UserPreferences
          isOpen={showPreferences}
          onClose={() => setShowPreferences(false)}
          onPreferencesChange={(preferences) => {
            console.log('用户偏好设置已更新:', preferences)
          }}
        />

        {/* AI 助手面板 */}
        <AnimatePresence>
          {showAIAssistant && (
            <AIAssistantPanel
              position="bottom-right"
              size="large"
              defaultTab="home"
              onComponentSelect={(component) => {
                console.log('AI推荐组件:', component)
                setSelectedComponent(component.component)
                handleViewChange('components')
              }}
              onSolutionSelect={(solution) => {
                console.log('AI解决方案:', solution)
              }}
              onClose={() => setShowAIAssistant(false)}
              showMinimizeButton={true}
              showCloseButton={true}
            />
          )}
        </AnimatePresence>

  
        {/* 调试工具面板 */}
        <AnimatePresence>
          {showDebugTools && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 z-50 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="h-full flex flex-col">
                {/* 面板头部 */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                      🔧
                    </div>
                    高级调试工具
                  </h2>
                  <button
                    onClick={() => setShowDebugTools(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* 面板内容 */}
                <div className="flex-1 overflow-auto">
                  <DebugToolsMain />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        
        {/* 调试工具遮罩 */}
        <AnimatePresence>
          {showDebugTools && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDebugTools(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            />
          )}
        </AnimatePresence>
      </WorkbenchLayout>
    </>
  )
}