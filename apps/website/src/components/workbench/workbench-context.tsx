'use client'

import React, { createContext, useContext, useReducer, useCallback, useEffect, ReactNode } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import type { WorkbenchContextType, ViewMode, Recipe, ComponentExample } from './workbench-types'

/**
 * Workbench Action 类型
 */
type WorkbenchAction =
  | { type: 'SET_MODE'; payload: ViewMode }
  | { type: 'SET_SELECTED_RECIPE'; payload: Recipe | null }
  | { type: 'SET_SELECTED_EXAMPLE'; payload: ComponentExample | null }
  | { type: 'SET_CODE'; payload: string }
  | { type: 'SET_ACTIVE_THEME'; payload: 'default' | 'dark' }
  | { type: 'SET_SELECTED_CATEGORY'; payload: string }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_STATE' }

/**
 * Workbench State 接口
 */
interface WorkbenchState {
  mode: ViewMode
  selectedRecipe: Recipe | null
  selectedExample: ComponentExample | null
  code: string
  activeTheme: 'default' | 'dark'
  selectedCategory: string
  searchTerm: string
  isLoading: boolean
  error: string | null
}

/**
 * 初始状态
 */
const initialState: WorkbenchState = {
  mode: 'gallery',
  selectedRecipe: null,
  selectedExample: null,
  code: '',
  activeTheme: 'default',
  selectedCategory: 'all',
  searchTerm: '',
  isLoading: false,
  error: null,
}

/**
 * Workbench Reducer
 */
function workbenchReducer(state: WorkbenchState, action: WorkbenchAction): WorkbenchState {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.payload }

    case 'SET_SELECTED_RECIPE':
      return {
        ...state,
        selectedRecipe: action.payload,
        error: null,
      }

    case 'SET_SELECTED_EXAMPLE':
      return {
        ...state,
        selectedExample: action.payload,
        error: null,
      }

    case 'SET_CODE':
      return {
        ...state,
        code: action.payload,
        error: null,
      }

    case 'SET_ACTIVE_THEME':
      return { ...state, activeTheme: action.payload }

    case 'SET_SELECTED_CATEGORY':
      return { ...state, selectedCategory: action.payload }

    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload }

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }

    case 'SET_ERROR':
      return { ...state, error: action.payload }

    case 'RESET_STATE':
      return initialState

    default:
      console.warn('Unknown action type:', action)
      return state
  }
}

/**
 * Workbench Context
 */
const WorkbenchContext = createContext<WorkbenchContextType | undefined>(undefined)

/**
 * Workbench Provider Props
 */
interface WorkbenchProviderProps {
  children: ReactNode
  initialMode?: ViewMode
  initialRecipeId?: string
}

/**
 * Workbench Provider 组件
 */
export function WorkbenchProvider({ children, initialMode, initialRecipeId }: WorkbenchProviderProps) {
  const [state, dispatch] = useReducer(workbenchReducer, {
    ...initialState,
    mode: initialMode || 'gallery',
  })

  const searchParams = useSearchParams()
  const router = useRouter()

  // 同步 URL 参数到状态
  useEffect(() => {
    const urlMode = searchParams.get('mode') as ViewMode
    const urlRecipeId = searchParams.get('recipe')
    const urlExampleId = searchParams.get('example')

    if (urlMode && urlMode !== state.mode) {
      dispatch({ type: 'SET_MODE', payload: urlMode })
    }

    if (urlRecipeId && urlRecipeId !== state.selectedRecipe?.id) {
      // 这里可以加载具体的配方数据
      // 暂时设为 null，让组件自己处理
      dispatch({ type: 'SET_SELECTED_RECIPE', payload: null })
    }
  }, [searchParams, state.mode, state.selectedRecipe?.id])

  // 同步状态到 URL
  const updateURL = useCallback((updates: Partial<WorkbenchState>) => {
    const params = new URLSearchParams(searchParams.toString())

    if (updates.mode && updates.mode !== 'gallery') {
      params.set('mode', updates.mode)
    } else if (updates.mode === 'gallery') {
      params.delete('mode')
    }

    if (updates.selectedRecipe?.id) {
      params.set('recipe', updates.selectedRecipe.id)
    } else {
      params.delete('recipe')
    }

    if (updates.selectedExample?.id) {
      params.set('example', updates.selectedExample.id)
    } else {
      params.delete('example')
    }

    const newURL = `/workbench${params.toString() ? `?${params.toString()}` : ''}`
    router.replace(newURL, { scroll: false })
  }, [searchParams, router])

  // Context Value
  const contextValue: WorkbenchContextType = {
    // Mode 控制
    mode: state.mode,
    setMode: useCallback((mode: ViewMode) => {
      dispatch({ type: 'SET_MODE', payload: mode })
      updateURL({ ...state, mode })
    }, [dispatch, updateURL, state]),

    // 选中内容控制
    selectedRecipe: state.selectedRecipe,
    setSelectedRecipe: useCallback((recipe: Recipe | null) => {
      dispatch({ type: 'SET_SELECTED_RECIPE', payload: recipe })
      updateURL({ ...state, selectedRecipe: recipe })
    }, [dispatch, updateURL, state]),

    selectedExample: state.selectedExample,
    setSelectedExample: useCallback((example: ComponentExample | null) => {
      dispatch({ type: 'SET_SELECTED_EXAMPLE', payload: example })
      updateURL({ ...state, selectedExample: example })
    }, [dispatch, updateURL, state]),

    // 编辑器状态
    code: state.code,
    setCode: useCallback((code: string) => {
      if (code.length > 50000) {
        dispatch({ type: 'SET_ERROR', payload: '代码长度不能超过 50KB' })
        return
      }
      dispatch({ type: 'SET_CODE', payload: code })
    }, [dispatch]),

    activeTheme: state.activeTheme,
    setActiveTheme: useCallback((theme: 'default' | 'dark') => {
      dispatch({ type: 'SET_ACTIVE_THEME', payload: theme })
    }, [dispatch]),

    // Gallery Mode 状态
    selectedCategory: state.selectedCategory,
    setSelectedCategory: useCallback((category: string) => {
      dispatch({ type: 'SET_SELECTED_CATEGORY', payload: category })
    }, [dispatch]),

    searchTerm: state.searchTerm,
    setSearchTerm: useCallback((term: string) => {
      dispatch({ type: 'SET_SEARCH_TERM', payload: term })
    }, [dispatch]),

    // UI 状态
    isLoading: state.isLoading,
    setIsLoading: useCallback((loading: boolean) => {
      dispatch({ type: 'SET_LOADING', payload: loading })
    }, [dispatch]),

    error: state.error,
    setError: useCallback((error: string | null) => {
      dispatch({ type: 'SET_ERROR', payload: error })
    }, [dispatch]),
  }

  return (
    <WorkbenchContext.Provider value={contextValue}>
      {children}
    </WorkbenchContext.Provider>
  )
}

/**
 * 使用 Workbench Context Hook
 */
export function useWorkbench(): WorkbenchContextType {
  const context = useContext(WorkbenchContext)
  if (context === undefined) {
    throw new Error('useWorkbench must be used within a WorkbenchProvider')
  }
  return context
}

/**
 * 派生 Hook: Gallery Mode 状态
 */
export function useGalleryState() {
  const {
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
    selectedRecipe,
    setSelectedRecipe,
    isLoading,
    error
  } = useWorkbench()

  return {
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
    selectedRecipe,
    setSelectedRecipe,
    isLoading,
    error,
  }
}

/**
 * 派生 Hook: Editor Mode 状态
 */
export function useEditorState() {
  const {
    code,
    setCode,
    activeTheme,
    setActiveTheme,
    selectedExample,
    setSelectedExample,
    isLoading,
    error
  } = useWorkbench()

  return {
    code,
    setCode,
    activeTheme,
    setActiveTheme,
    selectedExample,
    setSelectedExample,
    isLoading,
    error,
  }
}

/**
 * 派生 Hook: Mode Switching
 */
export function useModeSwitching() {
  const { mode, setMode, selectedRecipe, setSelectedRecipe } = useWorkbench()

  const switchToGallery = useCallback(() => {
    setMode('gallery')
  }, [setMode])

  const switchToEditor = useCallback((recipe?: Recipe) => {
    if (recipe) {
      setSelectedRecipe(recipe)
    }
    setMode('editor')
  }, [setMode, setSelectedRecipe])

  const switchToSplit = useCallback(() => {
    setMode('split')
  }, [setMode])

  return {
    mode,
    switchToGallery,
    switchToEditor,
    switchToSplit,
  }
}