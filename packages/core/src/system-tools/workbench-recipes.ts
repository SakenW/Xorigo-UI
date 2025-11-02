/**
 * 🛠️ Xorigo UI Workbench 配方库
 *
 * 为Workbench集成开发环境提供的默认配方和模板数据
 * 包含组件模板、主题配方和示例代码
 */

// ============================================================================
// 核心类型定义
// ============================================================================

export interface ComponentExample {
  id: string
  name: string
  description: string
  code: string
  category?: string
  tags?: string[]
}

export interface Recipe {
  id: string
  name: string
  description: string
  category: string
  colors: string[]
  tags: string[]
  image?: string
}

export interface SevenAxisTheme {
  mode: 'light' | 'dark' | 'hc'
  hue: number
  saturation: number
  lightness: number
  density: 'compact' | 'comfortable' | 'spacious'
  roundness: number
  contrast: 'low' | 'normal' | 'high'
}

// ============================================================================
// 默认组件模板
// ============================================================================

export const DEFAULT_COMPONENTS: ComponentExample[] = [
  {
    id: 'basic-button',
    name: 'BasicButton',
    description: '基础按钮组件',
    category: 'ui',
    tags: ['button', 'interactive', 'basic'],
    code: `import React from 'react'

export interface BasicButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  children: React.ReactNode
}

export function BasicButton({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  children
}: BasicButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background'

  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
  }

  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 py-2 px-4',
    lg: 'h-11 px-8 text-lg',
  }

  return (
    <button
      className={\`\${baseClasses} \${variants[variant]} \${sizes[size]}\`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}`
  },
  {
    id: 'user-card',
    name: 'UserCard',
    description: '用户卡片组件',
    category: 'layout',
    tags: ['card', 'user', 'profile'],
    code: `import React, { useState, useCallback } from 'react'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  bio?: string
}

export interface UserCardProps {
  user: User
  onEdit?: (user: User) => Promise<void>
  onDelete?: (userId: string) => void
}

export function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleEdit = useCallback(async () => {
    if (!onEdit) return
    setIsLoading(true)
    try {
      await onEdit(user)
    } finally {
      setIsLoading(false)
    }
  }, [user, onEdit])

  const handleDelete = useCallback(() => {
    if (!onDelete) return
    if (confirm('确定要删除此用户吗？')) {
      onDelete(user.id)
    }
  }, [user, onDelete])

  return (
    <div className="w-full max-w-sm rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-12 w-12 rounded-full object-cover" />
            ) : (
              <span className="text-lg font-medium">{user.name?.[0]}</span>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        {user.bio && (
          <p className="mt-4 text-sm text-muted-foreground">{user.bio}</p>
        )}
        <div className="mt-4 flex space-x-2">
          <button
            size="sm"
            variant="outline"
            onClick={handleEdit}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
          >
            {isLoading ? '保存中...' : '编辑'}
          </button>
          <button
            size="sm"
            variant="destructive"
            onClick={handleDelete}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-9 px-3"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  )
}`
  },
  {
    id: 'theme-toggle',
    name: 'ThemeToggle',
    description: '主题切换组件',
    category: 'theme',
    tags: ['theme', 'toggle', 'dark-mode'],
    code: `import React, { useState, useEffect } from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'

export interface ThemeToggleProps {
  defaultTheme?: ThemeMode
  onThemeChange?: (theme: ThemeMode) => void
  showLabel?: boolean
}

export function ThemeToggle({
  defaultTheme = 'system',
  onThemeChange,
  showLabel = true
}: ThemeToggleProps) {
  const [theme, setTheme] = useState<ThemeMode>(defaultTheme)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme)
    onThemeChange?.(newTheme)
  }

  return (
    <div className="flex items-center space-x-2">
      {showLabel && <span className="text-sm font-medium">主题:</span>}
      <div className="flex rounded-lg border p-1">
        <button
          className={\`px-3 py-1 text-sm rounded-md transition-colors \${
            theme === 'light'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }\`}
          onClick={() => handleThemeChange('light')}
        >
          ☀️
        </button>
        <button
          className={\`px-3 py-1 text-sm rounded-md transition-colors \${
            theme === 'dark'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }\`}
          onClick={() => handleThemeChange('dark')}
        >
          🌙
        </button>
        <button
          className={\`px-3 py-1 text-sm rounded-md transition-colors \${
            theme === 'system'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }\`}
          onClick={() => handleThemeChange('system')}
        >
          💻
        </button>
      </div>
    </div>
  )
}`
  }
] as const

// ============================================================================
// 默认主题配方
// ============================================================================

export const DEFAULT_RECIPES: Recipe[] = [
  {
    id: 'ocean-blue',
    name: '海洋蓝',
    description: '清新自然的海洋蓝色调主题',
    category: 'nature',
    colors: ['#0EA5E9', '#0284C7', '#0369A1', '#F0F9FF', '#0C4A6E', '#E0F2FE', '#BAE6FD', '#7DD3FC'],
    tags: ['blue', 'ocean', 'nature', 'fresh'],
    image: '/recipes/ocean-blue.jpg'
  },
  {
    id: 'sunset-orange',
    name: '夕阳橙',
    description: '温暖活力的夕阳橙色调主题',
    category: 'warm',
    colors: ['#FB923C', '#F97316', '#EA580C', '#FFF7ED', '#9A3412', '#FED7AA', '#FDBA74', '#FB923C'],
    tags: ['orange', 'sunset', 'warm', 'energy'],
    image: '/recipes/sunset-orange.jpg'
  },
  {
    id: 'forest-green',
    name: '森林绿',
    description: '清新自然的森林绿色调主题',
    category: 'nature',
    colors: ['#10B981', '#059669', '#047857', '#F0FDF4', '#064E3B', '#D1FAE5', '#A7F3D0', '#6EE7B7'],
    tags: ['green', 'forest', 'nature', 'fresh'],
    image: '/recipes/forest-green.jpg'
  },
  {
    id: 'royal-purple',
    name: '皇室紫',
    description: '高贵典雅的紫色调主题',
    category: 'elegant',
    colors: ['#8B5CF6', '#7C3AED', '#6D28D9', '#F5F3FF', '#4C1D95', '#EDE9FE', '#DDD6FE', '#C4B5FD'],
    tags: ['purple', 'royal', 'elegant', 'luxury'],
    image: '/recipes/royal-purple.jpg'
  },
  {
    id: 'monochrome-gray',
    name: '单色灰',
    description: '极简主义灰色调主题',
    category: 'minimal',
    colors: ['#6B7280', '#4B5563', '#374151', '#F9FAFB', '#111827', '#F3F4F6', '#E5E7EB', '#D1D5DB'],
    tags: ['gray', 'monochrome', 'minimal', 'simple'],
    image: '/recipes/monochrome-gray.jpg'
  }
] as const

// ============================================================================
// 默认主题配置
// ============================================================================

export const DEFAULT_THEME: SevenAxisTheme = {
  mode: 'light',
  hue: 220,
  saturation: 70,
  lightness: 50,
  density: 'comfortable',
  roundness: 8,
  contrast: 'normal'
}

export const DEFAULT_DARK_THEME: SevenAxisTheme = {
  mode: 'dark',
  hue: 220,
  saturation: 60,
  lightness: 40,
  density: 'comfortable',
  roundness: 8,
  contrast: 'normal'
}

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 根据ID获取组件模板
 */
export function getComponentById(id: string): ComponentExample | undefined {
  return DEFAULT_COMPONENTS.find(comp => comp.id === id)
}

/**
 * 根据分类获取组件模板
 */
export function getComponentsByCategory(category: string): ComponentExample[] {
  return DEFAULT_COMPONENTS.filter(comp => comp.category === category)
}

/**
 * 搜索组件模板
 */
export function searchComponents(query: string): ComponentExample[] {
  const lowercaseQuery = query.toLowerCase()
  return DEFAULT_COMPONENTS.filter(comp =>
    comp.name.toLowerCase().includes(lowercaseQuery) ||
    comp.description.toLowerCase().includes(lowercaseQuery) ||
    comp.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}

/**
 * 根据ID获取配方
 */
export function getRecipeById(id: string): Recipe | undefined {
  return DEFAULT_RECIPES.find(recipe => recipe.id === id)
}

/**
 * 根据分类获取配方
 */
export function getRecipesByCategory(category: string): Recipe[] {
  return DEFAULT_RECIPES.filter(recipe => recipe.category === category)
}

/**
 * 搜索配方
 */
export function searchRecipes(query: string): Recipe[] {
  const lowercaseQuery = query.toLowerCase()
  return DEFAULT_RECIPES.filter(recipe =>
    recipe.name.toLowerCase().includes(lowercaseQuery) ||
    recipe.description.toLowerCase().includes(lowercaseQuery) ||
    recipe.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}

/**
 * 创建自定义主题
 */
export function createCustomTheme(overrides: Partial<SevenAxisTheme>): SevenAxisTheme {
  return {
    ...DEFAULT_THEME,
    ...overrides
  }
}

// ============================================================================
// 预设主题变体
// ============================================================================

export const THEME_PRESETS = {
  light: DEFAULT_THEME,
  dark: DEFAULT_DARK_THEME,
  highContrast: {
    ...DEFAULT_THEME,
    contrast: 'high' as const,
    saturation: 80,
    lightness: 45
  },
  lowContrast: {
    ...DEFAULT_THEME,
    contrast: 'low' as const,
    saturation: 50,
    lightness: 55
  },
  vibrant: {
    ...DEFAULT_THEME,
    saturation: 90,
    hue: 280
  },
  muted: {
    ...DEFAULT_THEME,
    saturation: 40,
    lightness: 60
  },
  compact: {
    ...DEFAULT_THEME,
    density: 'compact' as const,
    roundness: 4
  },
  spacious: {
    ...DEFAULT_THEME,
    density: 'spacious' as const,
    roundness: 12
  },
  rounded: {
    ...DEFAULT_THEME,
    roundness: 16
  },
  sharp: {
    ...DEFAULT_THEME,
    roundness: 0
  }
} as const

export type ThemePreset = keyof typeof THEME_PRESETS