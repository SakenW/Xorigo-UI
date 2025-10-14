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