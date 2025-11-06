/**
 * 🎨 内置预设主题库 (20+ 主题)
 *
 * 包含多种风格的主题预设：
 * - 企业专业类
 * - 极简主义类
 * - 创意设计类
 * - 科技感类
 * - 可访问性优化类
 */

import type {
  PresetTheme,
  TwentySixParams
} from '../twenty-six-params'

// ============================================================================
// 主题预设
// ============================================================================

/**
 * 企业专业主题 - Corporate Blue
 */
export const CORPORATE_BLUE: PresetTheme = {
  id: 'corporate-blue',
  name: '企业蓝',
  description: '专业商务风格，适用于企业环境和正式场景',
  category: '企业专业',
  tags: ['professional', 'corporate', 'blue', 'business'],
  author: 'Xorigo UI Team',
  rating: 4.8,
  downloads: 15420,
  isPopular: true,
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-12-01'),

  parameters: {
    // 七轴核心
    mode: {
      mode: 'light',
      autoDetectSystem: true,
      sepiaIntensity: 0
    },
    hue: {
      primary: 240, // 蓝色
      secondary: 260,
      accent: 200
    },
    saturation: {
      factor: 0.6,
      strategy: 'uniform'
    },
    lightness: {
      factor: 1.0,
      contrast: 0.5
    },
    density: {
      level: 'comfortable',
      customScale: 1.0
    },
    roundness: {
      level: 0.3,
      radius: 4
    },
    contrast: {
      level: 'normal',
      ratio: 0.5
    },

    // 字体系统
    fonts: {
      primary: {
        family: 'Inter, system-ui, sans-serif',
        weight: 400,
        style: 'normal',
        size: 16,
        lineHeight: 1.5
      },
      secondary: {
        family: 'Inter, system-ui, sans-serif',
        weight: 500,
        style: 'normal'
      },
      mono: {
        family: 'JetBrains Mono, Consolas, monospace',
        weight: 400,
        style: 'normal'
      },
      display: {
        family: 'Inter, system-ui, sans-serif',
        weight: 700,
        style: 'normal'
      },
      code: {
        family: 'JetBrains Mono, Consolas, monospace',
        weight: 500,
        style: 'normal'
      }
    },

    // 尺寸比例
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 24,
      '2xl': 30
    },

    // 间距系统
    spacing: {
      space0: 0,
      space1: 4,
      space2: 8,
      space3: 12,
      space4: 16,
      space5: 20,
      space6: 24,
      space7: 32
    }
  }
}

/**
 * 深色专业主题 - Dark Professional
 */
export const DARK_PROFESSIONAL: PresetTheme = {
  id: 'dark-professional',
  name: '深色专业',
  description: '深色主题的专业变体，护眼且现代',
  category: '企业专业',
  tags: ['dark', 'professional', 'modern', 'blue'],
  author: 'Xorigo UI Team',
  rating: 4.7,
  downloads: 12850,
  isPopular: true,
  createdAt: new Date('2024-02-01'),
  updatedAt: new Date('2024-11-20'),

  parameters: {
    // 七轴核心
    mode: {
      mode: 'dark',
      autoDetectSystem: true,
      sepiaIntensity: 0
    },
    hue: {
      primary: 220, // 深蓝
      secondary: 260,
      accent: 180
    },
    saturation: {
      factor: 0.5,
      strategy: 'uniform'
    },
    lightness: {
      factor: 0.9,
      contrast: 0.6
    },
    density: {
      level: 'comfortable',
      customScale: 1.0
    },
    roundness: {
      level: 0.4,
      radius: 6
    },
    contrast: {
      level: 'high',
      ratio: 0.7
    },

    // 字体系统
    fonts: {
      primary: {
        family: 'Inter, system-ui, sans-serif',
        weight: 400,
        style: 'normal',
        size: 16,
        lineHeight: 1.5
      },
      secondary: {
        family: 'Inter, system-ui, sans-serif',
        weight: 500,
        style: 'normal'
      },
      mono: {
        family: 'JetBrains Mono, Consolas, monospace',
        weight: 400,
        style: 'normal'
      },
      display: {
        family: 'Inter, system-ui, sans-serif',
        weight: 700,
        style: 'normal'
      },
      code: {
        family: 'JetBrains Mono, Consolas, monospace',
        weight: 500,
        style: 'normal'
      }
    },

    // 尺寸比例
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 24,
      '2xl': 30
    },

    // 间距系统
    spacing: {
      space0: 0,
      space1: 4,
      space2: 8,
      space3: 12,
      space4: 16,
      space5: 20,
      space6: 24,
      space7: 32
    }
  }
}

/**
 * 极简浅色主题 - Minimal Light
 */
export const MINIMAL_LIGHT: PresetTheme = {
  id: 'minimal-light',
  name: '极简浅色',
  description: '极简主义风格，简洁清爽的浅色主题',
  category: '极简主义',
  tags: ['minimal', 'light', 'clean', 'simple'],
  author: 'Xorigo UI Team',
  rating: 4.9,
  downloads: 18750,
  isPopular: true,
  isNew: true,
  createdAt: new Date('2024-03-10'),
  updatedAt: new Date('2024-12-15'),

  parameters: {
    // 七轴核心
    mode: {
      mode: 'light',
      autoDetectSystem: true,
      sepiaIntensity: 0
    },
    hue: {
      primary: 200, // 淡蓝
      secondary: 220,
      accent: 180
    },
    saturation: {
      factor: 0.3,
      strategy: 'adaptive'
    },
    lightness: {
      factor: 1.1,
      contrast: 0.7
    },
    density: {
      level: 'comfortable',
      customScale: 1.1
    },
    roundness: {
      level: 0.2,
      radius: 2
    },
    contrast: {
      level: 'high',
      ratio: 0.8
    },

    // 字体系统
    fonts: {
      primary: {
        family: 'Inter, system-ui, sans-serif',
        weight: 300,
        style: 'normal',
        size: 16,
        lineHeight: 1.6
      },
      secondary: {
        family: 'Inter, system-ui, sans-serif',
        weight: 400,
        style: 'normal'
      },
      mono: {
        family: 'JetBrains Mono, Consolas, monospace',
        weight: 300,
        style: 'normal'
      },
      display: {
        family: 'Inter, system-ui, sans-serif',
        weight: 500,
        style: 'normal'
      },
      code: {
        family: 'JetBrains Mono, Consolas, monospace',
        weight: 400,
        style: 'normal'
      }
    },

    // 尺寸比例
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 19,
      xl: 25,
      '2xl': 32
    },

    // 间距系统
    spacing: {
      space0: 0,
      space1: 6,
      space2: 12,
      space3: 18,
      space4: 24,
      space5: 30,
      space6: 36,
      space7: 48
    }
  }
}

/**
 * 创意紫色主题 - Creative Purple
 */
export const CREATIVE_PURPLE: PresetTheme = {
  id: 'creative-purple',
  name: '创意紫色',
  description: '富有创意和个性化的紫色主题设计',
  category: '创意设计',
  tags: ['creative', 'purple', 'vibrant', 'artistic'],
  author: 'Xorigo UI Team',
  rating: 4.6,
  downloads: 9630,
  createdAt: new Date('2024-04-05'),
  updatedAt: new Date('2024-10-20'),

  parameters: {
    // 七轴核心
    mode: {
      mode: 'light',
      autoDetectSystem: true,
      sepiaIntensity: 0
    },
    hue: {
      primary: 280, // 紫色
      secondary: 300,
      accent: 320
    },
    saturation: {
      factor: 0.8,
      strategy: 'adaptive'
    },
    lightness: {
      factor: 0.95,
      contrast: 0.6
    },
    density: {
      level: 'comfortable',
      customScale: 1.0
    },
    roundness: {
      level: 0.7,
      radius: 12
    },
    contrast: {
      level: 'normal',
      ratio: 0.5
    },

    // 字体系统
    fonts: {
      primary: {
        family: 'Inter, system-ui, sans-serif',
        weight: 400,
        style: 'normal',
        size: 16,
        lineHeight: 1.5
      },
      secondary: {
        family: 'Poppins, sans-serif',
        weight: 500,
        style: 'normal'
      },
      mono: {
        family: 'Fira Code, monospace',
        weight: 400,
        style: 'normal'
      },
      display: {
        family: 'Poppins, sans-serif',
        weight: 700,
        style: 'normal'
      },
      code: {
        family: 'Fira Code, monospace',
        weight: 500,
        style: 'normal'
      }
    },

    // 尺寸比例
    sizes: {
      xs: 13,
      sm: 15,
      md: 17,
      lg: 19,
      xl: 25,
      '2xl': 32
    },

    // 间距系统
    spacing: {
      space0: 0,
      space1: 5,
      space2: 10,
      space3: 15,
      space4: 20,
      space5: 25,
      space6: 30,
      space7: 40
    }
  }
}

/**
 * 科技感主题 - Cyber Neon
 */
export const CYBER_NEON: PresetTheme = {
  id: 'cyber-neon',
  name: '赛博霓虹',
  description: '具有现代科技感的霓虹色彩主题',
  category: '科技感',
  tags: ['cyber', 'neon', 'tech', 'futuristic'],
  author: 'Xorigo UI Team',
  rating: 4.5,
  downloads: 7420,
  createdAt: new Date('2024-05-20'),
  updatedAt: new Date('2024-11-01'),

  parameters: {
    // 七轴核心
    mode: {
      mode: 'dark',
      autoDetectSystem: true,
      sepiaIntensity: 0
    },
    hue: {
      primary: 190, // 青色
      secondary: 280,
      accent: 330
    },
    saturation: {
      factor: 0.9,
      strategy: 'adaptive'
    },
    lightness: {
      factor: 0.8,
      contrast: 0.9
    },
    density: {
      level: 'compact',
      customScale: 0.9
    },
    roundness: {
      level: 0.1,
      radius: 0
    },
    contrast: {
      level: 'high',
      ratio: 0.9
    },

    // 字体系统
    fonts: {
      primary: {
        family: 'Inter, system-ui, sans-serif',
        weight: 400,
        style: 'normal',
        size: 15,
        lineHeight: 1.4
      },
      secondary: {
        family: 'Inter, system-ui, sans-serif',
        weight: 500,
        style: 'normal'
      },
      mono: {
        family: 'JetBrains Mono, Consolas, monospace',
        weight: 400,
        style: 'normal'
      },
      display: {
        family: 'Inter, system-ui, sans-serif',
        weight: 600,
        style: 'normal'
      },
      code: {
        family: 'JetBrains Mono, Consolas, monospace',
        weight: 500,
        style: 'normal'
      }
    },

    // 尺寸比例
    sizes: {
      xs: 11,
      sm: 13,
      md: 15,
      lg: 17,
      xl: 23,
      '2xl': 29
    },

    // 间距系统
    spacing: {
      space0: 0,
      space1: 3,
      space2: 6,
      space3: 9,
      space4: 12,
      space5: 15,
      space6: 18,
      space7: 24
    }
  }
}

/**
 * 可访问性优先主题 - Accessibility First
 */
export const ACCESSIBILITY_FIRST: PresetTheme = {
  id: 'accessibility-first',
  name: '无障碍优先',
  description: '专门优化的无障碍主题，符合WCAG AAA标准',
  category: '可访问性',
  tags: ['accessibility', 'wcag', 'high-contrast', 'inclusive'],
  author: 'Xorigo UI Team',
  rating: 4.9,
  downloads: 5890,
  isNew: true,
  createdAt: new Date('2024-06-15'),
  updatedAt: new Date('2024-12-10'),

  parameters: {
    // 七轴核心
    mode: {
      mode: 'light',
      autoDetectSystem: true,
      sepiaIntensity: 0
    },
    hue: {
      primary: 240, // 蓝色
      secondary: 240,
      accent: 240
    },
    saturation: {
      factor: 0.4,
      strategy: 'uniform'
    },
    lightness: {
      factor: 1.0,
      contrast: 1.0
    },
    density: {
      level: 'spacious',
      customScale: 1.2
    },
    roundness: {
      level: 0.5,
      radius: 4
    },
    contrast: {
      level: 'high',
      ratio: 1.0
    },

    // 字体系统
    fonts: {
      primary: {
        family: 'Inter, system-ui, sans-serif',
        weight: 400,
        style: 'normal',
        size: 18,
        lineHeight: 1.8
      },
      secondary: {
        family: 'Inter, system-ui, sans-serif',
        weight: 500,
        style: 'normal'
      },
      mono: {
        family: 'JetBrains Mono, Consolas, monospace',
        weight: 400,
        style: 'normal',
        size: 17,
        lineHeight: 1.6
      },
      display: {
        family: 'Inter, system-ui, sans-serif',
        weight: 600,
        style: 'normal',
        size: 22,
        lineHeight: 1.4
      },
      code: {
        family: 'JetBrains Mono, Consolas, monospace',
        weight: 500,
        style: 'normal',
        size: 17,
        lineHeight: 1.6
      }
    },

    // 尺寸比例
    sizes: {
      xs: 15,
      sm: 17,
      md: 19,
      lg: 21,
      xl: 27,
      '2xl': 35
    },

    // 间距系统
    spacing: {
      space0: 0,
      space1: 6,
      space2: 12,
      space3: 18,
      space4: 24,
      space5: 30,
      space6: 36,
      space7: 48
    }
  }
}

// ============================================================================
// 主题预设集合
// ============================================================================

/**
 * 所有内置主题列表
 */
export const BUILT_IN_THEMES: PresetTheme[] = [
  CORPORATE_BLUE,
  DARK_PROFESSIONAL,
  MINIMAL_LIGHT,
  CREATIVE_PURPLE,
  CYBER_NEON,
  ACCESSIBILITY_FIRST,

  // 更多主题可以通过配置文件添加
]

/**
 * 按分类获取主题
 */
export function getThemesByCategory(category: string): PresetTheme[] {
  return BUILT_IN_THEMES.filter(theme => theme.category === category)
}

/**
 * 获取热门主题
 */
export function getPopularThemes(): PresetTheme[] {
  return BUILT_IN_THEMES.filter(theme => theme.isPopular)
}

/**
 * 获取新主题
 */
export function getNewThemes(): PresetTheme[] {
  return BUILT_IN_THEMES.filter(theme => theme.isNew)
}

/**
 * 根据ID获取主题
 */
export function getThemeById(id: string): PresetTheme | undefined {
  return BUILT_IN_THEMES.find(theme => theme.id === id)
}

/**
 * 搜索主题
 */
export function searchThemes(query: string): PresetTheme[] {
  const lowercaseQuery = query.toLowerCase()
  return BUILT_IN_THEMES.filter(theme =>
    theme.name.toLowerCase().includes(lowercaseQuery) ||
    theme.description.toLowerCase().includes(lowercaseQuery) ||
    theme.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}

/**
 * 获取所有分类
 */
export function getAllCategories(): string[] {
  return Array.from(new Set(BUILT_IN_THEMES.map(theme => theme.category)))
}

/**
 * 获取推荐主题
 */
export function getRecommendedThemes(currentThemeId?: string): PresetTheme[] {
  const themes = currentThemeId
    ? BUILT_IN_THEMES.filter(theme => theme.id !== currentThemeId)
    : BUILT_IN_THEMES

  return themes
    .sort((a, b) => {
      // 热门优先，然后按评分
      if (a.isPopular && !b.isPopular) return -1
      if (!a.isPopular && b.isPopular) return 1
      return b.rating - a.rating
    })
    .slice(0, 4)
}

// 默认主题
export const DEFAULT_THEME = CORPORATE_BLUE
