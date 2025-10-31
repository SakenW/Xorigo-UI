// Workbench 类型定义
// 完全遵循组件源规则 - 所有UI组件来自 @xorigo-ui/core

/**
 * Workbench 视图模式
 */
export type ViewMode = 'gallery' | 'editor' | 'split'

/**
 * Workbench 工作标签页
 */
export type WorkbenchTab = 'components' | 'recipes' | 'templates'

/**
 * 配方接口 - 来自 Gallery
 */
export interface Recipe {
  id: string
  name: string
  description: string
  category: string
  colors: string[]
  tags: string[]
  image: string
}

/**
 * 分类接口 - 来自 Gallery
 */
export interface Category {
  id: string
  name: string
  icon: string
}

/**
 * 组件示例接口 - 来自 Playground
 */
export interface ComponentExample {
  id: string
  name: string
  description: string
  code: string
}

/**
 * Workbench 上下文接口
 */
export interface WorkbenchContextType {
  // 模式控制
  mode: ViewMode
  setMode: (mode: ViewMode) => void

  // 选中的内容
  selectedRecipe: Recipe | null
  setSelectedRecipe: (recipe: Recipe | null) => void
  selectedExample: ComponentExample | null
  setSelectedExample: (example: ComponentExample | null) => void

  // 编辑器状态
  code: string
  setCode: (code: string) => void
  activeTheme: 'default' | 'dark'
  setActiveTheme: (theme: 'default' | 'dark') => void

  // Gallery Mode 状态
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  searchTerm: string
  setSearchTerm: (term: string) => void

  // UI 状态
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  error: string | null
  setError: (error: string | null) => void
}

/**
 * Workbench Props 通用接口
 */
export interface WorkbenchProps {
  mode?: ViewMode
  recipeId?: string
  exampleId?: string
}

/**
 * Workbench 组件通用属性
 */
export interface WorkbenchComponentProps {
  className?: string
  children?: React.ReactNode
  'data-testid'?: string
}

/**
 * Gallery Mode 属性
 */
export interface GalleryModeProps extends WorkbenchComponentProps {
  recipes: Recipe[]
  categories: Category[]
}

/**
 * Editor Mode 属性
 */
export interface EditorModeProps extends WorkbenchComponentProps {
  examples: ComponentExample[]
  initialCode?: string
  allowEdit?: boolean
}

/**
 * Split Mode 属性
 */
export interface SplitModeProps extends WorkbenchComponentProps {
  recipes: Recipe[]
  examples: ComponentExample[]
}

/**
 * Mode Switcher 属性
 */
export interface ModeSwitcherProps extends WorkbenchComponentProps {
  currentMode: ViewMode
  availableModes: ViewMode[]
  onModeChange: (mode: ViewMode) => void
}

/**
 * URL 参数接口
 */
export interface WorkbenchSearchParams {
  mode?: ViewMode
  recipe?: string
  example?: string
  tab?: WorkbenchTab
}

/**
 * Workbench 配置
 */
export const WORKBENCH_CONFIG = {
  defaultMode: 'gallery' as ViewMode,
  defaultTheme: 'default' as const,
  maxCodeLength: 50000, // 50KB 最大代码长度
  autoSaveInterval: 30000, // 30秒自动保存
  supportedModes: ['gallery', 'editor', 'split'] as ViewMode[],
  defaultTab: 'recipes' as WorkbenchTab,
} as const

/**
 * 主题配置
 */
export const THEME_CONFIG = {
  default: {
    name: '默认主题',
    monacoTheme: 'vs-light',
    className: 'light',
  },
  dark: {
    name: '深色主题',
    monacoTheme: 'vs-dark',
    className: 'dark',
  },
} as const

// ============================================================================
// Workbench Hook 实现
// ============================================================================

'use client'

import { useState, useCallback } from 'react'

/**
 * Workbench 状态接口
 */
export interface WorkbenchState {
  code: string
  theme: string
  previewMode: 'desktop' | 'mobile' | 'tablet'
  isPanelOpen: boolean
  activeTab: string
  mode: ViewMode
  selectedRecipe: Recipe | null
  selectedExample: ComponentExample | null
  selectedCategory: string
  searchTerm: string
  isLoading: boolean
  error: string | null
}

/**
 * Workbench Hook
 * 提供完整的 Workbench 状态管理
 */
export function useWorkbench(initialState?: Partial<WorkbenchState>) {
  const [state, setState] = useState<WorkbenchState>({
    code: '// Welcome to Xorigo UI Workbench\nconsole.log("Hello, World!");',
    theme: 'vs-dark',
    previewMode: 'desktop',
    isPanelOpen: true,
    activeTab: 'recipes',
    mode: 'gallery',
    selectedRecipe: null,
    selectedExample: null,
    selectedCategory: '',
    searchTerm: '',
    isLoading: false,
    error: null,
    ...initialState
  })

  const updateCode = useCallback((code: string) => {
    setState(prev => ({ ...prev, code }))
  }, [])

  const updateTheme = useCallback((theme: string) => {
    setState(prev => ({ ...prev, theme }))
  }, [])

  const setMode = useCallback((mode: ViewMode) => {
    setState(prev => ({ ...prev, mode }))
  }, [])

  const togglePreviewMode = useCallback(() => {
    setState(prev => ({
      ...prev,
      previewMode: prev.previewMode === 'desktop'
        ? 'mobile'
        : prev.previewMode === 'mobile'
        ? 'tablet'
        : 'desktop'
    }))
  }, [])

  const togglePanel = useCallback(() => {
    setState(prev => ({ ...prev, isPanelOpen: !prev.isPanelOpen }))
  }, [])

  const setActiveTab = useCallback((activeTab: string) => {
    setState(prev => ({ ...prev, activeTab }))
  }, [])

  const setSelectedRecipe = useCallback((selectedRecipe: Recipe | null) => {
    setState(prev => ({ ...prev, selectedRecipe }))
  }, [])

  const setSelectedExample = useCallback((selectedExample: ComponentExample | null) => {
    setState(prev => ({ ...prev, selectedExample }))
  }, [])

  const setSelectedCategory = useCallback((selectedCategory: string) => {
    setState(prev => ({ ...prev, selectedCategory }))
  }, [])

  const setSearchTerm = useCallback((searchTerm: string) => {
    setState(prev => ({ ...prev, searchTerm }))
  }, [])

  const setIsLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }))
  }, [])

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }))
  }, [])

  return {
    // 状态
    ...state,

    // 操作方法
    updateCode,
    updateTheme,
    setMode,
    togglePreviewMode,
    togglePanel,
    setActiveTab,
    setSelectedRecipe,
    setSelectedExample,
    setSelectedCategory,
    setSearchTerm,
    setIsLoading,
    setError,

    // 重置方法
    reset: useCallback(() => {
      setState({
        code: '// Welcome to Xorigo UI Workbench\nconsole.log("Hello, World!");',
        theme: 'vs-dark',
        previewMode: 'desktop',
        isPanelOpen: true,
        activeTab: 'recipes',
        mode: 'gallery',
        selectedRecipe: null,
        selectedExample: null,
        selectedCategory: '',
        searchTerm: '',
        isLoading: false,
        error: null
      })
    }, [])
  }
}