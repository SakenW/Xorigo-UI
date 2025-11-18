/**
 * 🎨 主题配方系统
 *
 * 基于七轴DTCG配方系统，与真正令牌系统集成，支持动态主题切换
 */

import { TokenTransformer } from './token-transform'
import { colorTokens } from './colors'

// TODO: 实现主题配方JSON文件
// import corporateBlueData from './recipes/corporate-blue/meta.json'

/**
 * 主题配方类型定义
 */
export interface ThemeRecipe {
  id: string
  name: string
  description: string
  axes: {
    mode?: 'light' | 'dark' | 'hc'
    base?: { neutral: string; contrast: string }
    accent?: { strategy: string; hues: string[] }
    tone?: 'calm' | 'standard' | 'vivid'
    density?: 'spacious' | 'comfortable' | 'compact'
    motion?: { pack: string; curve: string }
    surface?: string[]
  }
  oklchTone?: Record<string, { dC: number; dL: number }>
  a11y?: {
    text: number
    largeText: number
    nonText: number
  }
  variables?: Record<string, string>
}

/**
 * 预定义主题配方 - 完整七轴配方系统
 */
export const themeRecipes: Record<string, ThemeRecipe> = {
  // 企业主题
  'corporate-blue': {
    id: 'corporate-blue',
    name: '企业蓝',
    description: '专业的企业蓝色主题，适用于商业应用',
    axes: {
      mode: 'light',
      base: { neutral: 'standard', contrast: 'medium' },
      accent: { strategy: 'complementary', hues: ['blue'] },
      tone: 'standard',
      density: 'comfortable',
      motion: { pack: 'smooth', curve: 'ease' },
      surface: ['glass', 'solid'],
    },
  },
  'corporate-navy-dark': {
    id: 'corporate-navy-dark',
    name: '企业深蓝',
    description: '深色企业主题，适用于专业仪表板',
    axes: {
      mode: 'dark',
      base: { neutral: 'standard', contrast: 'high' },
      accent: { strategy: 'complementary', hues: ['blue'] },
      tone: 'standard',
      density: 'comfortable',
      motion: { pack: 'smooth', curve: 'ease' },
      surface: ['glass', 'solid'],
    },
  },

  // 极简主题
  'minimal-white': {
    id: 'minimal-white',
    name: '极简白',
    description: '纯净极简的白色主题',
    axes: {
      mode: 'light',
      base: { neutral: 'true', contrast: 'low' },
      accent: { strategy: 'mono', hues: ['gray'] },
      tone: 'calm',
      density: 'spacious',
      motion: { pack: 'subtle', curve: 'ease' },
      surface: ['flat'],
    },
  },
  'minimal-graphite-dark': {
    id: 'minimal-graphite-dark',
    name: '极简石墨',
    description: '深色极简主题，石墨色调',
    axes: {
      mode: 'dark',
      base: { neutral: 'true', contrast: 'high' },
      accent: { strategy: 'mono', hues: ['gray'] },
      tone: 'calm',
      density: 'comfortable',
      motion: { pack: 'subtle', curve: 'ease' },
      surface: ['flat'],
    },
  },

  // 科技主题
  'tech-cyan': {
    id: 'tech-cyan',
    name: '科技青',
    description: '现代科技感的青色主题',
    axes: {
      mode: 'light',
      base: { neutral: 'cool', contrast: 'medium' },
      accent: { strategy: 'mono', hues: ['cyan'] },
      tone: 'standard',
      density: 'comfortable',
      motion: { pack: 'smooth', curve: 'ease' },
      surface: ['glass', 'solid'],
    },
  },
  'tech-neon-dark': {
    id: 'tech-neon-dark',
    name: '科技霓虹',
    description: '赛博朋克风格的霓虹深色主题',
    axes: {
      mode: 'dark',
      base: { neutral: 'cool', contrast: 'high' },
      accent: { strategy: 'duo', hues: ['cyan', 'magenta'] },
      tone: 'vivid',
      density: 'compact',
      motion: { pack: 'expressive', curve: 'spring' },
      surface: ['glass', 'neon'],
    },
  },

  // 创意主题
  'creative-purple': {
    id: 'creative-purple',
    name: '创意紫',
    description: '充满创意的紫色主题',
    axes: {
      mode: 'light',
      base: { neutral: 'true', contrast: 'medium' },
      accent: { strategy: 'analog', hues: ['purple'] },
      tone: 'standard',
      density: 'comfortable',
      motion: { pack: 'smooth', curve: 'spring' },
      surface: ['soft-shadow'],
    },
  },
  'creative-aurora-dark': {
    id: 'creative-aurora-dark',
    name: '创意极光',
    description: '梦幻极光效果的深色创意主题',
    axes: {
      mode: 'dark',
      base: { neutral: 'true', contrast: 'medium' },
      accent: { strategy: 'analog', hues: ['purple'] },
      tone: 'vivid',
      density: 'comfortable',
      motion: { pack: 'expressive', curve: 'spring' },
      surface: ['glass'],
    },
  },

  // 经典主题
  'classic-neutral': {
    id: 'classic-neutral',
    name: '经典中性',
    description: '永恒经典的灰色中性主题',
    axes: {
      mode: 'light',
      base: { neutral: 'true', contrast: 'medium' },
      accent: { strategy: 'mono', hues: ['gray'] },
      tone: 'standard',
      density: 'comfortable',
      motion: { pack: 'standard', curve: 'ease' },
      surface: ['soft-shadow'],
    },
  },

  // 专业主题
  'high-contrast-pro': {
    id: 'high-contrast-pro',
    name: '高对比专业',
    description: '无障碍专业高对比度主题',
    axes: {
      mode: 'hc',
      base: { neutral: 'true', contrast: 'high' },
      accent: { strategy: 'mono', hues: ['blue'] },
      tone: 'standard',
      density: 'comfortable',
      motion: { pack: 'subtle', curve: 'ease' },
      surface: ['flat'],
    },
  },

  // 自然主题
  'nature-green': {
    id: 'nature-green',
    name: '自然绿',
    description: '清新自然的绿色主题',
    axes: {
      mode: 'light',
      base: { neutral: 'warm', contrast: 'medium' },
      accent: { strategy: 'analog', hues: ['green'] },
      tone: 'calm',
      density: 'spacious',
      motion: { pack: 'smooth', curve: 'ease' },
      surface: ['soft-shadow'],
    },
  },
  'nature-forest-dark': {
    id: 'nature-forest-dark',
    name: '自然森林',
    description: '深色森林主题，自然宁静',
    axes: {
      mode: 'dark',
      base: { neutral: 'warm', contrast: 'medium' },
      accent: { strategy: 'analog', hues: ['green', 'brown'] },
      tone: 'calm',
      density: 'comfortable',
      motion: { pack: 'smooth', curve: 'ease' },
      surface: ['glass'],
    },
  },

  // 温暖主题
  'warm-sunset': {
    id: 'warm-sunset',
    name: '温暖夕阳',
    description: '温暖的夕阳橙色主题',
    axes: {
      mode: 'light',
      base: { neutral: 'warm', contrast: 'medium' },
      accent: { strategy: 'analog', hues: ['orange', 'red'] },
      tone: 'standard',
      density: 'comfortable',
      motion: { pack: 'smooth', curve: 'ease' },
      surface: ['soft-shadow'],
    },
  },
  'warm-fire-dark': {
    id: 'warm-fire-dark',
    name: '温暖火焰',
    description: '火焰般温暖的深色主题',
    axes: {
      mode: 'dark',
      base: { neutral: 'warm', contrast: 'high' },
      accent: { strategy: 'triad', hues: ['orange', 'red', 'yellow'] },
      tone: 'vivid',
      density: 'comfortable',
      motion: { pack: 'expressive', curve: 'spring' },
      surface: ['glass', 'neon'],
    },
  },

  // 海洋主题
  'ocean-blue': {
    id: 'ocean-blue',
    name: '海洋蓝',
    description: '清澈海洋的蓝色主题',
    axes: {
      mode: 'light',
      base: { neutral: 'cool', contrast: 'medium' },
      accent: { strategy: 'analog', hues: ['blue', 'cyan'] },
      tone: 'calm',
      density: 'spacious',
      motion: { pack: 'smooth', curve: 'ease' },
      surface: ['glass'],
    },
  },
  'ocean-deep-dark': {
    id: 'ocean-deep-dark',
    name: '海洋深海',
    description: '深海神秘感的深色主题',
    axes: {
      mode: 'dark',
      base: { neutral: 'cool', contrast: 'high' },
      accent: { strategy: 'analog', hues: ['blue', 'cyan'] },
      tone: 'calm',
      density: 'comfortable',
      motion: { pack: 'smooth', curve: 'ease' },
      surface: ['glass'],
    },
  },

  // 花园主题
  'garden-floral': {
    id: 'garden-floral',
    name: '花园花卉',
    description: '花园般的鲜花色彩主题',
    axes: {
      mode: 'light',
      base: { neutral: 'warm', contrast: 'low' },
      accent: { strategy: 'triad', hues: ['pink', 'purple', 'green'] },
      tone: 'calm',
      density: 'spacious',
      motion: { pack: 'smooth', curve: 'spring' },
      surface: ['soft-shadow'],
    },
  },
  'garden-midnight': {
    id: 'garden-midnight',
    name: '花园午夜',
    description: '午夜花园的神秘主题',
    axes: {
      mode: 'dark',
      base: { neutral: 'warm', contrast: 'medium' },
      accent: { strategy: 'analog', hues: ['purple', 'pink'] },
      tone: 'calm',
      density: 'comfortable',
      motion: { pack: 'smooth', curve: 'spring' },
      surface: ['glass'],
    },
  },

  // 都市主题
  'urban-modern': {
    id: 'urban-modern',
    name: '都市现代',
    description: '现代都市的简约主题',
    axes: {
      mode: 'light',
      base: { neutral: 'cool', contrast: 'medium' },
      accent: { strategy: 'complementary', hues: ['blue'] },
      tone: 'standard',
      density: 'compact',
      motion: { pack: 'standard', curve: 'ease' },
      surface: ['flat'],
    },
  },
  'urban-night-dark': {
    id: 'urban-night-dark',
    name: '都市夜色',
    description: '都市夜景的深色主题',
    axes: {
      mode: 'dark',
      base: { neutral: 'cool', contrast: 'high' },
      accent: { strategy: 'complementary', hues: ['blue', 'yellow'] },
      tone: 'standard',
      density: 'compact',
      motion: { pack: 'standard', curve: 'ease' },
      surface: ['glass', 'neon'],
    },
  },

  // 艺术主题
  'art-vibrant': {
    id: 'art-vibrant',
    name: '艺术活力',
    description: '充满艺术活力的多彩主题',
    axes: {
      mode: 'light',
      base: { neutral: 'true', contrast: 'medium' },
      accent: { strategy: 'compound', hues: ['red', 'yellow', 'blue'] },
      tone: 'vivid',
      density: 'comfortable',
      motion: { pack: 'expressive', curve: 'spring' },
      surface: ['soft-shadow'],
    },
  },
  'art-gallery-dark': {
    id: 'art-gallery-dark',
    name: '艺术画廊',
    description: '艺术画廊般的优雅深色主题',
    axes: {
      mode: 'dark',
      base: { neutral: 'true', contrast: 'medium' },
      accent: { strategy: 'triad', hues: ['purple', 'orange', 'green'] },
      tone: 'standard',
      density: 'spacious',
      motion: { pack: 'smooth', curve: 'ease' },
      surface: ['glass'],
    },
  },

  // 未来主题
  'future-chrome': {
    id: 'future-chrome',
    name: '未来铬金',
    description: '未来科技感的铬金主题',
    axes: {
      mode: 'light',
      base: { neutral: 'cool', contrast: 'high' },
      accent: { strategy: 'complementary', hues: ['silver', 'blue'] },
      tone: 'vivid',
      density: 'compact',
      motion: { pack: 'expressive', curve: 'spring' },
      surface: ['glass', 'neon'],
    },
  },
  'future-cyber-dark': {
    id: 'future-cyber-dark',
    name: '未来赛博',
    description: '未来赛博朋克深色主题',
    axes: {
      mode: 'dark',
      base: { neutral: 'cool', contrast: 'high' },
      accent: { strategy: 'duo', hues: ['cyan', 'magenta'] },
      tone: 'vivid',
      density: 'compact',
      motion: { pack: 'expressive', curve: 'spring' },
      surface: ['glass', 'neon'],
    },
  },
}

/**
 * 主题配方分类
 */
export const recipeCategories = {
  corporate: ['corporate-blue', 'corporate-navy-dark'],
  minimal: ['minimal-white', 'minimal-graphite-dark'],
  tech: ['tech-cyan', 'tech-neon-dark'],
  creative: ['creative-purple', 'creative-aurora-dark'],
  classic: ['classic-neutral'],
  professional: ['high-contrast-pro'],
  nature: ['nature-green', 'nature-forest-dark'],
  warm: ['warm-sunset', 'warm-fire-dark'],
  ocean: ['ocean-blue', 'ocean-deep-dark'],
  garden: ['garden-floral', 'garden-midnight'],
  urban: ['urban-modern', 'urban-night-dark'],
  art: ['art-vibrant', 'art-gallery-dark'],
  future: ['future-chrome', 'future-cyber-dark'],
} as const

/**
 * 主题配方管理器
 */
export class ThemeRecipeManager {
  private currentRecipe: string = 'corporate-blue'
  private observer: MutationObserver | null = null
  private tokenTransformer: TokenTransformer

  constructor() {
    this.tokenTransformer = new TokenTransformer()
    // 只在客户端环境初始化 DOM 相关操作
    if (typeof window !== 'undefined') {
      this.initializeObserver()
      this.initializeBaseTokens()
    }
  }

  /**
   * 初始化基础设计令牌为CSS变量
   */
  private initializeBaseTokens(): void {
    // 防御性检查：确保在浏览器环境中
    if (typeof document === 'undefined') return

    const cssVariables = this.tokenTransformer.generateCSSVariables()
    const styleElement = document.createElement('style')
    styleElement.id = 'xorigo-base-tokens'
    styleElement.textContent = `
      :root {
        ${cssVariables}
      }
    `
    document.head.appendChild(styleElement)
  }

  /**
   * 初始化观察器监听DOM变化
   */
  private initializeObserver(): void {
    if (typeof window !== 'undefined') {
      this.observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
            const newTheme = document.documentElement.getAttribute('data-theme')
            if (newTheme && newTheme !== this.currentRecipe) {
              this.currentRecipe = newTheme
              this.notifyThemeChange(newTheme)
            }
          }
        })
      })

      this.observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
      })
    }
  }

  /**
   * 应用主题配方
   */
  applyTheme(recipeId: string): boolean {
    // SSR 环境检查
    if (typeof document === 'undefined') {
      console.warn('applyTheme 只能在浏览器环境中调用')
      return false
    }

    // 优先从扩展的主题配方中查找
    const recipe = extendedThemeRecipes[recipeId] || themeRecipes[recipeId]
    if (!recipe) {
      console.warn(`主题配方 "${recipeId}" 不存在`)
      return false
    }

    try {
      // 第一步：确保基础令牌已初始化（通过 initializeBaseTokens）
      let baseTokenStyle = document.getElementById('xorigo-base-tokens')
      if (!baseTokenStyle) {
        this.initializeBaseTokens()
      }

      // 第二步：应用配方变量（这些变量会覆盖或扩展基础令牌）
      if (recipe.variables) {
        Object.entries(recipe.variables).forEach(([key, value]) => {
          document.documentElement.style.setProperty(`--${key}`, value)
        })
      }

      // 第三步：应用简化的主题颜色映射，确保有明显的视觉效果
      this.applySimpleThemeColors(recipe)

      // 第四步：应用七轴配方的主题令牌覆盖
      this.applyThemeTokenOverrides(recipe)

      // 更新主题属性
      document.documentElement.setAttribute('data-theme', recipeId)
      this.currentRecipe = recipeId

      console.log(`主题 "${recipe.name}" (${recipeId}) 已应用`)
      return true
    } catch (error) {
      console.error('应用主题配方失败:', error)
      return false
    }
  }

  /**
   * 应用简化的主题颜色映射
   */
  private applySimpleThemeColors(recipe: ThemeRecipe): void {
    // SSR 环境检查
    if (typeof document === 'undefined') return

    const themeColors: Record<string, Record<string, string>> = {
      'corporate-blue': {
        '--theme-primary': '#3b82f6',
        '--theme-secondary': '#2563eb',
        '--theme-accent': '#60a5fa',
        '--theme-gradient': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        '--theme-glow': 'rgba(59, 130, 246, 0.3)',
      },
      'minimal-white': {
        '--theme-primary': '#64748b',
        '--theme-secondary': '#475569',
        '--theme-accent': '#94a3b8',
        '--theme-gradient': 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        '--theme-glow': 'rgba(148, 163, 184, 0.2)',
      },
      'tech-cyan': {
        '--theme-primary': '#06b6d4',
        '--theme-secondary': '#0891b2',
        '--theme-accent': '#67e8f9',
        '--theme-gradient': 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
        '--theme-glow': 'rgba(6, 182, 212, 0.3)',
      },
      'creative-purple': {
        '--theme-primary': '#a855f7',
        '--theme-secondary': '#9333ea',
        '--theme-accent': '#c084fc',
        '--theme-gradient': 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
        '--theme-glow': 'rgba(168, 85, 247, 0.3)',
      },
      'nature-green': {
        '--theme-primary': '#22c55e',
        '--theme-secondary': '#16a34a',
        '--theme-accent': '#86efac',
        '--theme-gradient': 'linear-gradient(135deg, #22c55e 0%, #84cc16 100%)',
        '--theme-glow': 'rgba(34, 197, 94, 0.3)',
      },
      'warm-sunset': {
        '--theme-primary': '#f97316',
        '--theme-secondary': '#ea580c',
        '--theme-accent': '#fb923c',
        '--theme-gradient': 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
        '--theme-glow': 'rgba(249, 115, 22, 0.3)',
      },
      'ocean-blue': {
        '--theme-primary': '#0ea5e9',
        '--theme-secondary': '#0284c7',
        '--theme-accent': '#38bdf8',
        '--theme-gradient': 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
        '--theme-glow': 'rgba(14, 165, 233, 0.3)',
      },
      'garden-floral': {
        '--theme-primary': '#ec4899',
        '--theme-secondary': '#db2777',
        '--theme-accent': '#f9a8d4',
        '--theme-gradient': 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
        '--theme-glow': 'rgba(236, 72, 153, 0.3)',
      },
      'urban-modern': {
        '--theme-primary': '#6b7280',
        '--theme-secondary': '#4b5563',
        '--theme-accent': '#9ca3af',
        '--theme-gradient': 'linear-gradient(135deg, #6b7280 0%, #eab308 100%)',
        '--theme-glow': 'rgba(107, 114, 128, 0.3)',
      },
      'art-vibrant': {
        '--theme-primary': '#ef4444',
        '--theme-secondary': '#dc2626',
        '--theme-accent': '#f87171',
        '--theme-gradient': 'linear-gradient(135deg, #ef4444 0%, #eab308 0%, #3b82f6 50%)',
        '--theme-glow': 'rgba(239, 68, 68, 0.3)',
      },
      'future-chrome': {
        '--theme-primary': '#94a3b8',
        '--theme-secondary': '#64748b',
        '--theme-accent': '#cbd5e1',
        '--theme-gradient': 'linear-gradient(135deg, #94a3b8 0%, #3b82f6 100%)',
        '--theme-glow': 'rgba(192, 192, 192, 0.4)',
      },
    }

    // 为深色主题添加映射
    const darkThemes = [
      'corporate-navy-dark', 'minimal-graphite-dark', 'tech-neon-dark',
      'creative-aurora-dark', 'nature-forest-dark', 'warm-fire-dark',
      'ocean-deep-dark', 'garden-midnight', 'urban-night-dark',
      'art-gallery-dark', 'future-cyber-dark'
    ]

    if (darkThemes.includes(recipe.id)) {
      // 深色主题基础颜色
      const baseColors = themeColors[recipe.id.replace('-dark', '')] || themeColors['corporate-blue']
      if (baseColors) {
        Object.entries(baseColors).forEach(([key, value]) => {
          document.documentElement.style.setProperty(key, value)
        })
      }

      // 深色主题覆盖
      document.documentElement.style.setProperty('--theme-bg-primary', '#0f172a')
      document.documentElement.style.setProperty('--theme-bg-secondary', '#1e293b')
      document.documentElement.style.setProperty('--theme-text-primary', '#f8fafc')
      document.documentElement.style.setProperty('--theme-text-secondary', '#cbd5e1')
    } else {
      // 浅色主题
      const colors = themeColors[recipe.id] || themeColors['corporate-blue']
      if (colors) {
        Object.entries(colors).forEach(([key, value]) => {
          document.documentElement.style.setProperty(key, value)
        })
      }

      // 浅色主题基础设置
      document.documentElement.style.setProperty('--theme-bg-primary', '#ffffff')
      document.documentElement.style.setProperty('--theme-bg-secondary', '#f8fafc')
      document.documentElement.style.setProperty('--theme-text-primary', '#0f172a')
      document.documentElement.style.setProperty('--theme-text-secondary', '#475569')
    }
  }

  /**
   * 应用主题配方的令牌覆盖
   */
  private applyThemeTokenOverrides(recipe: ThemeRecipe): void {
    // SSR 环境检查
    if (typeof document === 'undefined') return

    const themeOverrides: Record<string, string> = {}

    // 根据七轴配置生成令牌覆盖
    const { mode, base, accent, tone, density } = recipe.axes

    // 模式覆盖：亮/暗/高对比度
    if (mode === 'dark') {
      themeOverrides['--color-neutral-50'] = '#0f172a'
      themeOverrides['--color-neutral-900'] = '#f8fafc'
      themeOverrides['--color-neutral-950'] = '#020617'
    } else if (mode === 'hc') {
      themeOverrides['--color-neutral-50'] = '#ffffff'
      themeOverrides['--color-neutral-900'] = '#000000'
      themeOverrides['--color-neutral-950'] = '#000000'
    }

    // 基础色覆盖
    if (base) {
      // 根据配方的基础色配置调整中性色调
      if (base.neutral !== 'standard') {
        this.adjustNeutralTones(themeOverrides, base.neutral)
      }
    }

    // 强调色覆盖
    if (accent && accent.hues.length > 0) {
      this.adjustAccentColors(themeOverrides, accent)
    }

    // 色调调整
    if (tone) {
      this.adjustToneSaturation(themeOverrides, tone)
    }

    // 应用覆盖
    Object.entries(themeOverrides).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value)
    })
  }

  /**
   * 调整中性色调
   */
  private adjustNeutralTones(overrides: Record<string, string>, neutralType: string): void {
    const adjustments: Record<string, Record<string, string>> = {
      warm: {
        '--color-neutral-100': '#fef3c7',
        '--color-neutral-200': '#fde68a',
        '--color-neutral-300': '#fcd34d',
      },
      cool: {
        '--color-neutral-100': '#e0f2fe',
        '--color-neutral-200': '#bae6fd',
        '--color-neutral-300': '#7dd3fc',
      },
      gray: {
        '--color-neutral-100': '#f3f4f6',
        '--color-neutral-200': '#e5e7eb',
        '--color-neutral-300': '#d1d5db',
      }
    }

    const adjustment = adjustments[neutralType]
    if (adjustment) {
      Object.assign(overrides, adjustment)
    }
  }

  /**
   * 调整强调色
   */
  private adjustAccentColors(overrides: Record<string, string>, accent: any): void {
    // 根据配方的强调色配置调整主色调
    const primaryHue = accent.hues[0] // 取第一个主色调

    if (primaryHue === 'purple') {
      overrides['--xorigo-color-primary-500'] = '#a855f7'
      overrides['--xorigo-color-primary-600'] = '#9333ea'
      overrides['--xorigo-color-secondary-500'] = '#ec4899'
      overrides['--xorigo-color-secondary-600'] = '#db2777'
    } else if (primaryHue === 'cyan') {
      overrides['--xorigo-color-primary-500'] = '#06b6d4'
      overrides['--xorigo-color-primary-600'] = '#0891b2'
      overrides['--xorigo-color-secondary-500'] = '#14b8a6'
      overrides['--xorigo-color-secondary-600'] = '#0d9488'
    }
    // 可以根据需要添加更多色调调整
  }

  /**
   * 调整饱和度
   */
  private adjustToneSaturation(overrides: Record<string, string>, tone: string): void {
    if (tone === 'vivid') {
      // 增加饱和度调整因子
      overrides['--color-saturation-factor'] = '1.2'
    } else if (tone === 'calm') {
      // 降低饱和度调整因子
      overrides['--color-saturation-factor'] = '0.8'
    } else {
      // 标准饱和度
      overrides['--color-saturation-factor'] = '1.0'
    }
  }

  /**
   * 获取当前主题
   */
  getCurrentTheme(): string {
    return this.currentRecipe
  }

  /**
   * 获取主题配方信息
   */
  getRecipe(recipeId: string): ThemeRecipe | null {
    return themeRecipes[recipeId] || null
  }

  /**
   * 获取所有可用配方
   */
  getAllRecipes(): Record<string, ThemeRecipe> {
    return { ...themeRecipes }
  }

  /**
   * 按分类获取配方
   */
  getRecipesByCategory(category: keyof typeof recipeCategories): ThemeRecipe[] {
    const recipeIds = recipeCategories[category] || []
    return recipeIds
      .map(id => themeRecipes[id])
      .filter((recipe): recipe is ThemeRecipe => recipe !== undefined)
  }

  /**
   * 搜索配方
   */
  searchRecipes(query: string): ThemeRecipe[] {
    const searchLower = query.toLowerCase()
    return Object.values(themeRecipes).filter(
      (recipe) =>
        recipe.name.toLowerCase().includes(searchLower) ||
        recipe.description.toLowerCase().includes(searchLower) ||
        recipe.id.toLowerCase().includes(searchLower)
    )
  }

  /**
   * 主题变化通知器
   */
  private notifyThemeChange(themeId: string): void {
    // SSR 环境检查
    if (typeof document === 'undefined') return

    // 触发自定义事件
    const event = new CustomEvent('themechange', {
      detail: { themeId, recipe: this.getRecipe(themeId) },
    })
    document.dispatchEvent(event)

    // 更新localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('xorigo-ui-theme', themeId)
    }
  }

  /**
   * 从本地存储恢复主题
   */
  restoreFromStorage(): string {
    // SSR 环境检查
    if (typeof window === 'undefined') {
      return 'corporate-blue' // 返回默认主题但不应用
    }

    if (typeof localStorage !== 'undefined') {
      const savedTheme = localStorage.getItem('xorigo-ui-theme')
      if (savedTheme && themeRecipes[savedTheme]) {
        this.applyTheme(savedTheme)
        return savedTheme
      }
    }

    // 应用默认主题
    this.applyTheme('corporate-blue')
    return 'corporate-blue'
  }

  /**
   * 清理资源
   */
  dispose(): void {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
  }
}

/**
 * 扩展的主题配方集合，包含所有24个主题
 */
const extendedThemeRecipes: Record<string, ThemeRecipe> = {
  // 原有的2个主题（从 themeRecipes 导入）
  ...themeRecipes,

  // 额外的22个主题
  'minimal-white': {
    id: 'minimal-white',
    name: '极简白',
    description: '纯净的极简白色主题，突出内容',
    axes: {
      mode: 'light',
      base: { neutral: 'minimal', contrast: 'medium' },
      accent: { strategy: 'monochromatic', hues: ['gray'] },
      tone: 'standard',
      density: 'spacious',
      motion: { pack: 'subtle', curve: 'ease' },
      surface: ['flat', 'solid'],
    },
  },
  'minimal-graphite-dark': {
    id: 'minimal-graphite-dark',
    name: '极简石墨黑',
    description: '深色极简主题，专业且优雅',
    axes: {
      mode: 'dark',
      base: { neutral: 'minimal', contrast: 'medium' },
      accent: { strategy: 'monochromatic', hues: ['gray'] },
      tone: 'standard',
      density: 'spacious',
      motion: { pack: 'subtle', curve: 'ease' },
      surface: ['flat', 'solid'],
    },
  },
  'tech-cyan': {
    id: 'tech-cyan',
    name: '科技青',
    description: '现代科技感青色主题，数字化风格',
    axes: {
      mode: 'light',
      base: { neutral: 'cool', contrast: 'high' },
      accent: { strategy: 'triadic', hues: ['cyan', 'blue'] },
      tone: 'vivid',
      density: 'compact',
      motion: { pack: 'dynamic', curve: 'spring' },
      surface: ['glass', 'gradient'],
    },
  },
  'tech-neon-dark': {
    id: 'tech-neon-dark',
    name: '科技霓虹黑',
    description: '赛博朋克风格深色主题，霓虹效果',
    axes: {
      mode: 'dark',
      base: { neutral: 'cool', contrast: 'high' },
      accent: { strategy: 'triadic', hues: ['cyan', 'magenta'] },
      tone: 'vivid',
      density: 'compact',
      motion: { pack: 'dynamic', curve: 'spring' },
      surface: ['glass', 'neon'],
    },
  },
  'creative-purple': {
    id: 'creative-purple',
    name: '创意紫',
    description: '充满创意的紫色主题，适合设计应用',
    axes: {
      mode: 'light',
      base: { neutral: 'warm', contrast: 'medium' },
      accent: { strategy: 'analogous', hues: ['purple', 'magenta'] },
      tone: 'vivid',
      density: 'comfortable',
      motion: { pack: 'expressive', curve: 'bounce' },
      surface: ['organic', 'gradient'],
    },
  },
  'creative-aurora-dark': {
    id: 'creative-aurora-dark',
    name: '创意极光黑',
    description: '神秘的极光深色主题，充满想象力',
    axes: {
      mode: 'dark',
      base: { neutral: 'warm', contrast: 'medium' },
      accent: { strategy: 'analogous', hues: ['purple', 'blue'] },
      tone: 'vivid',
      density: 'comfortable',
      motion: { pack: 'expressive', curve: 'bounce' },
      surface: ['organic', 'gradient'],
    },
  },
  'classic-neutral': {
    id: 'classic-neutral',
    name: '经典中性',
    description: '永恒的经典中性主题，适用于各种场景',
    axes: {
      mode: 'light',
      base: { neutral: 'standard', contrast: 'medium' },
      accent: { strategy: 'complementary', hues: ['brown'] },
      tone: 'standard',
      density: 'comfortable',
      motion: { pack: 'smooth', curve: 'ease' },
      surface: ['solid'],
    },
  },
  'high-contrast-pro': {
    id: 'high-contrast-pro',
    name: '高对比专业',
    description: '专业级高对比度主题，提升可访问性',
    axes: {
      mode: 'light',
      base: { neutral: 'standard', contrast: 'high' },
      accent: { strategy: 'complementary', hues: ['blue', 'orange'] },
      tone: 'standard',
      density: 'comfortable',
      motion: { pack: 'smooth', curve: 'ease' },
      surface: ['solid'],
    },
  },
  'nature-green': {
    id: 'nature-green',
    name: '自然绿',
    description: '清新的自然绿色主题，舒适护眼',
    axes: {
      mode: 'light',
      base: { neutral: 'warm', contrast: 'medium' },
      accent: { strategy: 'analogous', hues: ['green', 'yellow'] },
      tone: 'calm',
      density: 'comfortable',
      motion: { pack: 'organic', curve: 'ease-in-out' },
      surface: ['organic', 'solid'],
    },
  },
  'nature-forest-dark': {
    id: 'nature-forest-dark',
    name: '森林深绿',
    description: '深邃的森林绿色主题，宁静自然',
    axes: {
      mode: 'dark',
      base: { neutral: 'warm', contrast: 'medium' },
      accent: { strategy: 'analogous', hues: ['green', 'brown'] },
      tone: 'calm',
      density: 'comfortable',
      motion: { pack: 'organic', curve: 'ease-in-out' },
      surface: ['organic', 'solid'],
    },
  },
  'warm-sunset': {
    id: 'warm-sunset',
    name: '温暖日落',
    description: '温暖的日落色调主题，舒适宜人',
    axes: {
      mode: 'light',
      base: { neutral: 'warm', contrast: 'medium' },
      accent: { strategy: 'analogous', hues: ['orange', 'red'] },
      tone: 'standard',
      density: 'comfortable',
      motion: { pack: 'warm', curve: 'ease' },
      surface: ['warm', 'gradient'],
    },
  },
  'warm-fire-dark': {
    id: 'warm-fire-dark',
    name: '温暖火焰黑',
    description: '热情的火焰深色主题，充满活力',
    axes: {
      mode: 'dark',
      base: { neutral: 'warm', contrast: 'medium' },
      accent: { strategy: 'analogous', hues: ['orange', 'red'] },
      tone: 'standard',
      density: 'comfortable',
      motion: { pack: 'warm', curve: 'ease' },
      surface: ['warm', 'gradient'],
    },
  },
  'ocean-blue': {
    id: 'ocean-blue',
    name: '海洋蓝',
    description: '清澈的海洋蓝色主题，清新自然',
    axes: {
      mode: 'light',
      base: { neutral: 'cool', contrast: 'medium' },
      accent: { strategy: 'analogous', hues: ['blue', 'cyan'] },
      tone: 'calm',
      density: 'comfortable',
      motion: { pack: 'fluid', curve: 'ease' },
      surface: ['glass', 'solid'],
    },
  },
  'ocean-deep-dark': {
    id: 'ocean-deep-dark',
    name: '深海蓝黑',
    description: '神秘的深海蓝色主题，宁静深邃',
    axes: {
      mode: 'dark',
      base: { neutral: 'cool', contrast: 'medium' },
      accent: { strategy: 'analogous', hues: ['blue', 'cyan'] },
      tone: 'calm',
      density: 'comfortable',
      motion: { pack: 'fluid', curve: 'ease' },
      surface: ['glass', 'solid'],
    },
  },
  'garden-floral': {
    id: 'garden-floral',
    name: '花园花卉',
    description: '美丽的花园花卉主题，生机勃勃',
    axes: {
      mode: 'light',
      base: { neutral: 'warm', contrast: 'medium' },
      accent: { strategy: 'analogous', hues: ['pink', 'purple'] },
      tone: 'calm',
      density: 'comfortable',
      motion: { pack: 'organic', curve: 'ease-in-out' },
      surface: ['organic', 'gradient'],
    },
  },
  'garden-midnight': {
    id: 'garden-midnight',
    name: '午夜花园',
    description: '神秘的午夜花园主题，浪漫优雅',
    axes: {
      mode: 'dark',
      base: { neutral: 'warm', contrast: 'medium' },
      accent: { strategy: 'analogous', hues: ['pink', 'purple'] },
      tone: 'calm',
      density: 'comfortable',
      motion: { pack: 'organic', curve: 'ease-in-out' },
      surface: ['organic', 'gradient'],
    },
  },
  'urban-modern': {
    id: 'urban-modern',
    name: '都市现代',
    description: '现代都市风格主题，简约时尚',
    axes: {
      mode: 'light',
      base: { neutral: 'cool', contrast: 'medium' },
      accent: { strategy: 'complementary', hues: ['gray', 'yellow'] },
      tone: 'standard',
      density: 'compact',
      motion: { pack: 'urban', curve: 'ease' },
      surface: ['glass', 'concrete'],
    },
  },
  'urban-night-dark': {
    id: 'urban-night-dark',
    name: '都市夜景黑',
    description: '繁华的都市夜景主题，现代动感',
    axes: {
      mode: 'dark',
      base: { neutral: 'cool', contrast: 'medium' },
      accent: { strategy: 'complementary', hues: ['gray', 'yellow'] },
      tone: 'standard',
      density: 'compact',
      motion: { pack: 'urban', curve: 'ease' },
      surface: ['glass', 'concrete'],
    },
  },
  'art-vibrant': {
    id: 'art-vibrant',
    name: '艺术活力',
    description: '充满活力的艺术主题，色彩丰富',
    axes: {
      mode: 'light',
      base: { neutral: 'standard', contrast: 'high' },
      accent: { strategy: 'triadic', hues: ['red', 'yellow', 'blue'] },
      tone: 'vivid',
      density: 'comfortable',
      motion: { pack: 'expressive', curve: 'bounce' },
      surface: ['artistic', 'gradient'],
    },
  },
  'art-gallery-dark': {
    id: 'art-gallery-dark',
    name: '艺术画廊黑',
    description: '高雅的艺术画廊主题，专业精致',
    axes: {
      mode: 'dark',
      base: { neutral: 'standard', contrast: 'high' },
      accent: { strategy: 'triadic', hues: ['red', 'yellow', 'blue'] },
      tone: 'vivid',
      density: 'comfortable',
      motion: { pack: 'expressive', curve: 'bounce' },
      surface: ['artistic', 'gradient'],
    },
  },
  'future-chrome': {
    id: 'future-chrome',
    name: '未来铬金',
    description: '未来感的铬金主题，科技感十足',
    axes: {
      mode: 'light',
      base: { neutral: 'cool', contrast: 'high' },
      accent: { strategy: 'complementary', hues: ['silver', 'blue'] },
      tone: 'standard',
      density: 'compact',
      motion: { pack: 'futuristic', curve: 'spring' },
      surface: ['metallic', 'chrome'],
    },
  },
  'future-cyber-dark': {
    id: 'future-cyber-dark',
    name: '未来赛博黑',
    description: '未来赛博朋克深色主题，科技前卫',
    axes: {
      mode: 'dark',
      base: { neutral: 'cool', contrast: 'high' },
      accent: { strategy: 'duo', hues: ['cyan', 'magenta'] },
      tone: 'vivid',
      density: 'compact',
      motion: { pack: 'expressive', curve: 'spring' },
      surface: ['glass', 'neon'],
    },
  },
}

/**
 * 默认主题管理器实例（延迟初始化以支持 SSR）
 */
let themeManagerInstance: ThemeRecipeManager | null = null

export const themeManager = typeof window !== 'undefined'
  ? new ThemeRecipeManager()
  : ({
      applyTheme: () => false,
      getCurrentTheme: () => 'corporate-blue',
      getRecipe: () => null,
      getAllRecipes: () => ({}),
      getRecipesByCategory: () => [],
      searchRecipes: () => [],
      restoreFromStorage: () => 'corporate-blue',
      dispose: () => {},
    } as unknown as ThemeRecipeManager)

/**
 * 主题工具函数
 */
export const themeUtils = {
  /**
   * 应用主题配方
   */
  applyTheme: (recipeId: string): boolean => themeManager.applyTheme(recipeId),

  /**
   * 获取当前主题
   */
  getCurrentTheme: (): string => themeManager.getCurrentTheme(),

  /**
   * 获取主题信息
   */
  getThemeInfo: (recipeId: string): ThemeRecipe | null => themeManager.getRecipe(recipeId),

  /**
   * 切换到亮色主题
   */
  switchToLightTheme: (): boolean => {
    const lightRecipes = ['corporate-blue', 'minimal-white', 'tech-cyan', 'creative-purple', 'classic-neutral']
    const currentTheme = themeManager.getCurrentTheme()

    // 如果当前是暗色主题，切换到对应的亮色版本
    const lightRecipeMap: Record<string, string> = {
      'corporate-navy-dark': 'corporate-blue',
      'minimal-graphite-dark': 'minimal-white',
      'tech-neon-dark': 'tech-cyan',
      'creative-aurora-dark': 'creative-purple',
    }

    const targetRecipe = lightRecipeMap[currentTheme] || 'corporate-blue'
    return themeManager.applyTheme(targetRecipe)
  },

  /**
   * 切换到暗色主题
   */
  switchToDarkTheme: (): boolean => {
    const darkRecipes = ['corporate-navy-dark', 'minimal-graphite-dark', 'tech-neon-dark', 'creative-aurora-dark']
    const currentTheme = themeManager.getCurrentTheme()

    // 如果当前是亮色主题，切换到对应的暗色版本
    const darkRecipeMap: Record<string, string> = {
      'corporate-blue': 'corporate-navy-dark',
      'minimal-white': 'minimal-graphite-dark',
      'tech-cyan': 'tech-neon-dark',
      'creative-purple': 'creative-aurora-dark',
      'classic-neutral': 'minimal-graphite-dark',
    }

    const targetRecipe = darkRecipeMap[currentTheme] || 'corporate-navy-dark'
    return themeManager.applyTheme(targetRecipe)
  },

  /**
   * 切换主题模式
   */
  toggleThemeMode: (): boolean => {
    const currentTheme = themeManager.getCurrentTheme()
    const isDark = currentTheme.includes('dark') || currentTheme === 'high-contrast-pro'

    return isDark ? themeUtils.switchToLightTheme() : themeUtils.switchToDarkTheme()
  },
}

// 导出扩展的主题配方
export { extendedThemeRecipes as allThemeRecipes }

export default {
  themeRecipes,
  allThemeRecipes: extendedThemeRecipes,
  recipeCategories,
  ThemeRecipeManager,
  themeManager,
  themeUtils,
}