/**
 * 主题数据
 *
 * 存储所有 Xorigo UI 主题配方信息
 */

export interface ThemeRecipe {
  id: string
  name: string
  description: string
  category: string
  axes: {
    mode?: 'light' | 'dark' | 'hc'
    base?: { neutral: string; contrast: string }
    accent?: { strategy: string; hues: string[] }
    tone?: 'calm' | 'standard' | 'vivid'
    density?: 'spacious' | 'comfortable' | 'compact'
    motion?: { pack: string; curve: string }
    surface?: string[]
  }
  variables: Record<string, string>
  a11y?: {
    text: number
    largeText: number
    nonText: number
  }
}

export class ThemeData {
  private themes: Map<string, ThemeRecipe> = new Map()
  private currentTheme: string = 'corporate-blue'
  private loaded: boolean = false

  /**
   * 加载主题数据
   */
  async loadThemes(): Promise<void> {
    if (this.loaded) {
      return
    }

    this.registerThemes()
    this.loaded = true
  }

  /**
   * 注册所有主题
   */
  private registerThemes(): void {
    // Corporate Themes
    this.registerTheme({
      id: 'corporate-blue',
      name: 'Corporate Blue',
      description: '专业的企业蓝色主题，适用于商业应用和仪表板',
      category: 'Corporate',
      axes: {
        mode: 'light',
        base: { neutral: 'standard', contrast: 'medium' },
        accent: { strategy: 'complementary', hues: ['blue'] },
        tone: 'standard',
        density: 'comfortable',
        motion: { pack: 'smooth', curve: 'ease' },
        surface: ['glass', 'solid']
      },
      variables: {
        '--color-primary-50': '#eff6ff',
        '--color-primary-100': '#dbeafe',
        '--color-primary-200': '#bfdbfe',
        '--color-primary-300': '#93c5fd',
        '--color-primary-400': '#60a5fa',
        '--color-primary-500': '#3b82f6',
        '--color-primary-600': '#2563eb',
        '--color-primary-700': '#1d4ed8',
        '--color-primary-800': '#1e40af',
        '--color-primary-900': '#1e3a8a',
        '--color-secondary-500': '#6366f1',
        '--color-secondary-600': '#4f46e5',
        '--color-text-primary': '#111827',
        '--color-text-secondary': '#6b7280',
        '--color-text-inverse': '#ffffff',
        '--color-surface-50': '#f9fafb',
        '--color-surface-100': '#f3f4f6',
        '--color-surface-200': '#e5e7eb',
        '--color-surface-300': '#d1d5db',
        '--color-bg-primary': '#ffffff',
        '--color-bg-secondary': '#f9fafb',
        '--color-border-primary': '#e5e7eb',
        '--color-border-secondary': '#d1d5db',
        '--color-border-focus': '#3b82f6'
      },
      a11y: {
        text: 4.5,
        largeText: 3,
        nonText: 3
      }
    })

    this.registerTheme({
      id: 'corporate-navy-dark',
      name: 'Corporate Navy Dark',
      description: '深色企业主题，适用于专业仪表板和开发环境',
      category: 'Corporate',
      axes: {
        mode: 'dark',
        base: { neutral: 'standard', contrast: 'high' },
        accent: { strategy: 'complementary', hues: ['blue'] },
        tone: 'standard',
        density: 'comfortable',
        motion: { pack: 'smooth', curve: 'ease' },
        surface: ['glass', 'solid']
      },
      variables: {
        '--color-primary-50': '#0f172a',
        '--color-primary-100': '#1e293b',
        '--color-primary-200': '#334155',
        '--color-primary-300': '#475569',
        '--color-primary-400': '#64748b',
        '--color-primary-500': '#3b82f6',
        '--color-primary-600': '#60a5fa',
        '--color-primary-700': '#93c5fd',
        '--color-primary-800': '#bfdbfe',
        '--color-primary-900': '#dbeafe',
        '--color-secondary-500': '#818cf8',
        '--color-secondary-600': '#a5b4fc',
        '--color-text-primary': '#f1f5f9',
        '--color-text-secondary': '#94a3b8',
        '--color-text-inverse': '#0f172a',
        '--color-surface-50': '#020617',
        '--color-surface-100': '#0f172a',
        '--color-surface-200': '#1e293b',
        '--color-surface-300': '#334155',
        '--color-bg-primary': '#0f172a',
        '--color-bg-secondary': '#020617',
        '--color-border-primary': '#334155',
        '--color-border-secondary': '#475569',
        '--color-border-focus': '#3b82f6'
      },
      a11y: {
        text: 4.5,
        largeText: 3,
        nonText: 3
      }
    })

    // Minimal Themes
    this.registerTheme({
      id: 'minimal-white',
      name: 'Minimal White',
      description: '极简白色主题，干净简约的设计风格',
      category: 'Minimal',
      axes: {
        mode: 'light',
        base: { neutral: 'gray', contrast: 'low' },
        accent: { strategy: 'monochromatic', hues: ['gray'] },
        tone: 'calm',
        density: 'spacious',
        motion: { pack: 'gentle', curve: 'ease' },
        surface: ['solid']
      },
      variables: {
        '--color-primary-50': '#f8f9fa',
        '--color-primary-100': '#f1f3f5',
        '--color-primary-200': '#e9ecef',
        '--color-primary-300': '#dee2e6',
        '--color-primary-400': '#ced4da',
        '--color-primary-500': '#6c757d',
        '--color-primary-600': '#5a6268',
        '--color-primary-700': '#495057',
        '--color-primary-800': '#343a40',
        '--color-primary-900': '#212529',
        '--color-secondary-500': '#6c757d',
        '--color-secondary-600': '#5a6268',
        '--color-text-primary': '#212529',
        '--color-text-secondary': '#6c757d',
        '--color-text-inverse': '#ffffff',
        '--color-surface-50': '#ffffff',
        '--color-surface-100': '#f8f9fa',
        '--color-surface-200': '#f1f3f5',
        '--color-surface-300': '#e9ecef',
        '--color-bg-primary': '#ffffff',
        '--color-bg-secondary': '#f8f9fa',
        '--color-border-primary': '#e9ecef',
        '--color-border-secondary': '#dee2e6',
        '--color-border-focus': '#6c757d'
      },
      a11y: {
        text: 4.5,
        largeText: 3,
        nonText: 3
      }
    })

    this.registerTheme({
      id: 'minimal-graphite-dark',
      name: 'Minimal Graphite Dark',
      description: '极简深色石墨主题，专为夜间工作优化',
      category: 'Minimal',
      axes: {
        mode: 'dark',
        base: { neutral: 'gray', contrast: 'medium' },
        accent: { strategy: 'monochromatic', hues: ['gray'] },
        tone: 'calm',
        density: 'spacious',
        motion: { pack: 'gentle', curve: 'ease' },
        surface: ['solid']
      },
      variables: {
        '--color-primary-50': '#171717',
        '--color-primary-100': '#262626',
        '--color-primary-200': '#404040',
        '--color-primary-300': '#525252',
        '--color-primary-400': '#737373',
        '--color-primary-500': '#a3a3a3',
        '--color-primary-600': '#d4d4d4',
        '--color-primary-700': '#e5e5e5',
        '--color-primary-800': '#f5f5f5',
        '--color-primary-900': '#fafafa',
        '--color-secondary-500': '#a3a3a3',
        '--color-secondary-600': '#d4d4d4',
        '--color-text-primary': '#fafafa',
        '--color-text-secondary': '#a3a3a3',
        '--color-text-inverse': '#171717',
        '--color-surface-50': '#0a0a0a',
        '--color-surface-100': '#171717',
        '--color-surface-200': '#262626',
        '--color-surface-300': '#404040',
        '--color-bg-primary': '#0a0a0a',
        '--color-bg-secondary': '#171717',
        '--color-border-primary': '#262626',
        '--color-border-secondary': '#404040',
        '--color-border-focus': '#a3a3a3'
      },
      a11y: {
        text: 4.5,
        largeText: 3,
        nonText: 3
      }
    })

    // Tech Themes
    this.registerTheme({
      id: 'tech-cyan',
      name: 'Tech Cyan',
      description: '科技青色主题，适用于技术产品和开发者工具',
      category: 'Tech',
      axes: {
        mode: 'light',
        base: { neutral: 'cool', contrast: 'high' },
        accent: { strategy: 'analogous', hues: ['cyan', 'blue'] },
        tone: 'vivid',
        density: 'compact',
        motion: { pack: 'bouncy', curve: 'spring' },
        surface: ['glass', 'solid']
      },
      variables: {
        '--color-primary-50': '#ecfeff',
        '--color-primary-100': '#cffafe',
        '--color-primary-200': '#a5f3fc',
        '--color-primary-300': '#67e8f9',
        '--color-primary-400': '#22d3ee',
        '--color-primary-500': '#06b6d4',
        '--color-primary-600': '#0891b2',
        '--color-primary-700': '#0e7490',
        '--color-primary-800': '#155e75',
        '--color-primary-900': '#164e63',
        '--color-secondary-500': '#14b8a6',
        '--color-secondary-600': '#0d9488',
        '--color-text-primary': '#0f172a',
        '--color-text-secondary': '#475569',
        '--color-text-inverse': '#ffffff',
        '--color-surface-50': '#f0f9ff',
        '--color-surface-100': '#e0f2fe',
        '--color-surface-200': '#bae6fd',
        '--color-surface-300': '#7dd3fc',
        '--color-bg-primary': '#ffffff',
        '--color-bg-secondary': '#f0f9ff',
        '--color-border-primary': '#e0f2fe',
        '--color-border-secondary': '#bae6fd',
        '--color-border-focus': '#06b6d4'
      },
      a11y: {
        text: 4.5,
        largeText: 3,
        nonText: 3
      }
    })

    this.registerTheme({
      id: 'tech-neon-dark',
      name: 'Tech Neon Dark',
      description: '赛博朋克霓虹深色主题，的未来科技风格',
      category: 'Tech',
      axes: {
        mode: 'dark',
        base: { neutral: 'cool', contrast: 'very-high' },
        accent: { strategy: 'analogous', hues: ['cyan', 'blue', 'purple'] },
        tone: 'vivid',
        density: 'compact',
        motion: { pack: 'bouncy', curve: 'spring' },
        surface: ['glass', 'neon']
      },
      variables: {
        '--color-primary-50': '#0c4a6e',
        '--color-primary-100': '#075985',
        '--color-primary-200': '#0369a1',
        '--color-primary-300': '#0284c7',
        '--color-primary-400': '#0ea5e9',
        '--color-primary-500': '#22d3ee',
        '--color-primary-600': '#67e8f9',
        '--color-primary-700': '#a5f3fc',
        '--color-primary-800': '#cffafe',
        '--color-primary-900': '#ecfeff',
        '--color-secondary-500': '#14b8a6',
        '--color-secondary-600': '#2dd4bf',
        '--color-secondary-700': '#5eead4',
        '--color-text-primary': '#f0f9ff',
        '--color-text-secondary': '#7dd3fc',
        '--color-text-inverse': '#0c4a6e',
        '--color-surface-50': '#020617',
        '--color-surface-100': '#0c4a6e',
        '--color-surface-200': '#075985',
        '--color-surface-300': '#0369a1',
        '--color-bg-primary': '#020617',
        '--color-bg-secondary': '#0c4a6e',
        '--color-border-primary': '#075985',
        '--color-border-secondary': '#0369a1',
        '--color-border-focus': '#22d3ee'
      },
      a11y: {
        text: 4.5,
        largeText: 3,
        nonText: 3
      }
    })

    // Creative Themes
    this.registerTheme({
      id: 'creative-purple',
      name: 'Creative Purple',
      description: '创意紫色主题，适合艺术和设计应用',
      category: 'Creative',
      axes: {
        mode: 'light',
        base: { neutral: 'warm', contrast: 'medium' },
        accent: { strategy: 'triadic', hues: ['purple', 'pink'] },
        tone: 'vivid',
        density: 'comfortable',
        motion: { pack: 'elastic', curve: 'ease' },
        surface: ['glass', 'gradient']
      },
      variables: {
        '--color-primary-50': '#faf5ff',
        '--color-primary-100': '#f3e8ff',
        '--color-primary-200': '#e9d5ff',
        '--color-primary-300': '#d8b4fe',
        '--color-primary-400': '#c084fc',
        '--color-primary-500': '#a855f7',
        '--color-primary-600': '#9333ea',
        '--color-primary-700': '#7e22ce',
        '--color-primary-800': '#6b21a8',
        '--color-primary-900': '#581c87',
        '--color-secondary-500': '#ec4899',
        '--color-secondary-600': '#db2777',
        '--color-text-primary': '#1f2937',
        '--color-text-secondary': '#6b7280',
        '--color-text-inverse': '#ffffff',
        '--color-surface-50': '#faf5ff',
        '--color-surface-100': '#f3e8ff',
        '--color-surface-200': '#e9d5ff',
        '--color-surface-300': '#d8b4fe',
        '--color-bg-primary': '#ffffff',
        '--color-bg-secondary': '#faf5ff',
        '--color-border-primary': '#f3e8ff',
        '--color-border-secondary': '#e9d5ff',
        '--color-border-focus': '#a855f7'
      },
      a11y: {
        text: 4.5,
        largeText: 3,
        nonText: 3
      }
    })

    this.registerTheme({
      id: 'creative-aurora-dark',
      name: 'Creative Aurora Dark',
      description: '极光深色主题，梦幻的创意设计风格',
      category: 'Creative',
      axes: {
        mode: 'dark',
        base: { neutral: 'cool', contrast: 'high' },
        accent: { strategy: 'triadic', hues: ['purple', 'cyan', 'pink'] },
        tone: 'vivid',
        density: 'comfortable',
        motion: { pack: 'elastic', curve: 'ease' },
        surface: ['glass', 'gradient']
      },
      variables: {
        '--color-primary-50': '#3b0764',
        '--color-primary-100': '#4c1d95',
        '--color-primary-200': '#5b21b6',
        '--color-primary-300': '#6d28d9',
        '--color-primary-400': '#7c3aed',
        '--color-primary-500': '#a855f7',
        '--color-primary-600': '#c084fc',
        '--color-primary-700': '#d8b4fe',
        '--color-primary-800': '#e9d5ff',
        '--color-primary-900': '#f3e8ff',
        '--color-secondary-500': '#ec4899',
        '--color-secondary-600': '#f472b6',
        '--color-secondary-700': '#f9a8d4',
        '--color-text-primary': '#faf5ff',
        '--color-text-secondary': '#d8b4fe',
        '--color-text-inverse': '#3b0764',
        '--color-surface-50': '#0c0321',
        '--color-surface-100': '#3b0764',
        '--color-surface-200': '#4c1d95',
        '--color-surface-300': '#5b21b6',
        '--color-bg-primary': '#0c0321',
        '--color-bg-secondary': '#3b0764',
        '--color-border-primary': '#4c1d95',
        '--color-border-secondary': '#5b21b6',
        '--color-border-focus': '#a855f7'
      },
      a11y: {
        text: 4.5,
        largeText: 3,
        nonText: 3
      }
    })

    // Classic Themes
    this.registerTheme({
      id: 'classic-neutral',
      name: 'Classic Neutral',
      description: '经典中性主题，永不过时的设计风格',
      category: 'Classic',
      axes: {
        mode: 'light',
        base: { neutral: 'standard', contrast: 'medium' },
        accent: { strategy: 'complementary', hues: ['blue'] },
        tone: 'standard',
        density: 'comfortable',
        motion: { pack: 'smooth', curve: 'ease' },
        surface: ['solid']
      },
      variables: {
        '--color-primary-50': '#f0f4f8',
        '--color-primary-100': '#d9e2ec',
        '--color-primary-200': '#bcccdc',
        '--color-primary-300': '#9fb3c8',
        '--color-primary-400': '#829ab1',
        '--color-primary-500': '#627d98',
        '--color-primary-600': '#486581',
        '--color-primary-700': '#334e68',
        '--color-primary-800': '#243b53',
        '--color-primary-900': '#102a43',
        '--color-secondary-500': '#829ab1',
        '--color-secondary-600': '#627d98',
        '--color-text-primary': '#243b53',
        '--color-text-secondary': '#486581',
        '--color-text-inverse': '#ffffff',
        '--color-surface-50': '#ffffff',
        '--color-surface-100': '#f0f4f8',
        '--color-surface-200': '#d9e2ec',
        '--color-surface-300': '#bcccdc',
        '--color-bg-primary': '#ffffff',
        '--color-bg-secondary': '#f0f4f8',
        '--color-border-primary': '#d9e2ec',
        '--color-border-secondary': '#bcccdc',
        '--color-border-focus': '#627d98'
      },
      a11y: {
        text: 4.5,
        largeText: 3,
        nonText: 3
      }
    })

    // High Contrast Theme
    this.registerTheme({
      id: 'high-contrast-pro',
      name: 'High Contrast Pro',
      description: '高对比度主题，专为可访问性优化',
      category: 'Accessibility',
      axes: {
        mode: 'hc',
        base: { neutral: 'standard', contrast: 'very-high' },
        accent: { strategy: 'complementary', hues: ['blue'] },
        tone: 'standard',
        density: 'comfortable',
        motion: { pack: 'smooth', curve: 'ease' },
        surface: ['solid']
      },
      variables: {
        '--color-primary-50': '#ffffff',
        '--color-primary-100': '#f0f0f0',
        '--color-primary-200': '#e0e0e0',
        '--color-primary-300': '#c2c2c2',
        '--color-primary-400': '#a3a3a3',
        '--color-primary-500': '#000000',
        '--color-primary-600': '#000000',
        '--color-primary-700': '#000000',
        '--color-primary-800': '#000000',
        '--color-primary-900': '#000000',
        '--color-secondary-500': '#000000',
        '--color-secondary-600': '#000000',
        '--color-text-primary': '#000000',
        '--color-text-secondary': '#000000',
        '--color-text-inverse': '#ffffff',
        '--color-surface-50': '#ffffff',
        '--color-surface-100': '#ffffff',
        '--color-surface-200': '#f0f0f0',
        '--color-surface-300': '#e0e0e0',
        '--color-bg-primary': '#ffffff',
        '--color-bg-secondary': '#ffffff',
        '--color-border-primary': '#000000',
        '--color-border-secondary': '#000000',
        '--color-border-focus': '#000000'
      },
      a11y: {
        text: 7,
        largeText: 4.5,
        nonText: 3
      }
    })
  }

  /**
   * 注册单个主题
   */
  private registerTheme(theme: ThemeRecipe): void {
    this.themes.set(theme.id, theme)
  }

  /**
   * 获取所有主题
   */
  getAllThemes(): ThemeRecipe[] {
    return Array.from(this.themes.values())
  }

  /**
   * 根据 ID 获取主题
   */
  getTheme(id: string): ThemeRecipe | undefined {
    return this.themes.get(id)
  }

  /**
   * 根据分类获取主题
   */
  getThemesByCategory(category: string): ThemeRecipe[] {
    return Array.from(this.themes.values()).filter(
      (theme) => theme.category === category
    )
  }

  /**
   * 搜索主题
   */
  searchThemes(query: string): ThemeRecipe[] {
    const lowerQuery = query.toLowerCase()
    return Array.from(this.themes.values()).filter(
      (theme) =>
        theme.name.toLowerCase().includes(lowerQuery) ||
        theme.description.toLowerCase().includes(lowerQuery) ||
        theme.category.toLowerCase().includes(lowerQuery)
    )
  }

  /**
   * 获取当前主题
   */
  getCurrentTheme(): string {
    return this.currentTheme
  }

  /**
   * 设置当前主题
   */
  setCurrentTheme(themeId: string): void {
    if (this.themes.has(themeId)) {
      this.currentTheme = themeId
    }
  }

  /**
   * 获取主题分类
   */
  getCategories(): string[] {
    const categories = new Set(
      Array.from(this.themes.values()).map((theme) => theme.category)
    )
    return Array.from(categories).sort()
  }
}
