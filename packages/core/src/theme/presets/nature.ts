/**
 * 🌿 自然类主题预设 - 10个自然有机主题
 *
 * 适用于健康、环保、自然类应用
 * 特点：自然、舒适、有机、环保
 */

import type { PresetTheme } from '../advanced/twenty-six-params'

// ============================================================================
// 自然有机主题定义
// ============================================================================

/**
 * 清新薄荷 - 清新自然
 */
export const FRESH_MINT: PresetTheme = {
  id: 'fresh-mint',
  name: '清新薄荷',
  description: '清新的薄荷色调，如春风拂面',
  category: '自然类',
  tags: ['fresh', 'mint', 'spring', 'clean'],
  author: 'Xorigo UI Team',
  rating: 4.7,
  downloads: 12850,
  isPopular: true,
  createdAt: new Date('2024-03-01'),
  updatedAt: new Date('2024-11-20'),

  parameters: {
    mode: { mode: 'light', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 155, secondary: 150, accent: 160 },
    saturation: { factor: 0.5, strategy: 'adaptive' },
    lightness: { factor: 1.08, contrast: 0.6 },
    density: { level: 'comfortable', customScale: 1.05 },
    roundness: { level: 0.6, radius: 10 },
    contrast: { level: 'normal', ratio: 0.55 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal', size: 16, lineHeight: 1.6 },
      secondary: { family: 'Inter, system-ui, sans-serif', weight: 500, style: 'normal' },
      mono: { family: 'JetBrains Mono, Consolas, monospace', weight: 400, style: 'normal' },
      display: { family: 'Inter, system-ui, sans-serif', weight: 600, style: 'normal' },
      code: { family: 'JetBrains Mono, Consolas, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 13, sm: 15, md: 17, lg: 19, xl: 25, '2xl': 32 },
    spacing: { space0: 0, space1: 5, space2: 10, space3: 15, space4: 20, space5: 25, space6: 30, space7: 40 }
  }
}

/**
 * 森林绿 - 天然绿意
 */
export const FOREST_GREEN: PresetTheme = {
  id: 'forest-green',
  name: '森林绿',
  description: '深沉的森林绿，带来自然宁静',
  category: '自然类',
  tags: ['forest', 'green', 'nature', 'serene'],
  author: 'Xorigo UI Team',
  rating: 4.8,
  downloads: 11240,
  isPopular: true,
  createdAt: new Date('2024-03-10'),
  updatedAt: new Date('2024-11-15'),

  parameters: {
    mode: { mode: 'light', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 135, secondary: 125, accent: 145 },
    saturation: { factor: 0.45, strategy: 'adaptive' },
    lightness: { factor: 1.02, contrast: 0.6 },
    density: { level: 'comfortable', customScale: 1.05 },
    roundness: { level: 0.55, radius: 8 },
    contrast: { level: 'normal', ratio: 0.6 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal', size: 16, lineHeight: 1.6 },
      secondary: { family: 'Inter, system-ui, sans-serif', weight: 500, style: 'normal' },
      mono: { family: 'JetBrains Mono, Consolas, monospace', weight: 400, style: 'normal' },
      display: { family: 'Inter, system-ui, sans-serif', weight: 600, style: 'normal' },
      code: { family: 'JetBrains Mono, Consolas, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 13, sm: 15, md: 17, lg: 19, xl: 25, '2xl': 32 },
    spacing: { space0: 0, space1: 5, space2: 10, space3: 15, space4: 20, space5: 25, space6: 30, space7: 40 }
  }
}

/**
 * 海洋蓝 - 宁静海洋
 */
export const OCEAN_BLUE: PresetTheme = {
  id: 'ocean-blue',
  name: '海洋蓝',
  description: '深邃的海洋蓝，宁静而广阔',
  category: '自然类',
  tags: ['ocean', 'blue', 'peaceful', 'deep'],
  author: 'Xorigo UI Team',
  rating: 4.7,
  downloads: 10420,
  createdAt: new Date('2024-03-20'),
  updatedAt: new Date('2024-11-05'),

  parameters: {
    mode: { mode: 'light', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 195, secondary: 190, accent: 200 },
    saturation: { factor: 0.5, strategy: 'adaptive' },
    lightness: { factor: 1.05, contrast: 0.6 },
    density: { level: 'comfortable', customScale: 1.05 },
    roundness: { level: 0.5, radius: 8 },
    contrast: { level: 'normal', ratio: 0.6 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal', size: 16, lineHeight: 1.6 },
      secondary: { family: 'Inter, system-ui, sans-serif', weight: 500, style: 'normal' },
      mono: { family: 'JetBrains Mono, Consolas, monospace', weight: 400, style: 'normal' },
      display: { family: 'Inter, system-ui, sans-serif', weight: 600, style: 'normal' },
      code: { family: 'JetBrains Mono, Consolas, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 13, sm: 15, md: 17, lg: 19, xl: 25, '2xl': 32 },
    spacing: { space0: 0, space1: 5, space2: 10, space3: 15, space4: 20, space5: 25, space6: 30, space7: 40 }
  }
}

/**
 * 樱花粉 - 温柔春天
 */
export const SAKURA_PINK: PresetTheme = {
  id: 'sakura-pink',
  name: '樱花粉',
  description: '温柔的樱花粉色，春天般的气息',
  category: '自然类',
  tags: ['sakura', 'pink', 'spring', 'gentle'],
  author: 'Xorigo UI Team',
  rating: 4.6,
  downloads: 9680,
  createdAt: new Date('2024-04-01'),
  updatedAt: new Date('2024-11-01'),

  parameters: {
    mode: { mode: 'light', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 340, secondary: 335, accent: 345 },
    saturation: { factor: 0.45, strategy: 'adaptive' },
    lightness: { factor: 1.08, contrast: 0.55 },
    density: { level: 'comfortable', customScale: 1.05 },
    roundness: { level: 0.7, radius: 12 },
    contrast: { level: 'normal', ratio: 0.5 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal', size: 16, lineHeight: 1.6 },
      secondary: { family: 'Inter, system-ui, sans-serif', weight: 500, style: 'normal' },
      mono: { family: 'JetBrains Mono, Consolas, monospace', weight: 400, style: 'normal' },
      display: { family: 'Inter, system-ui, sans-serif', weight: 600, style: 'normal' },
      code: { family: 'JetBrains Mono, Consolas, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 13, sm: 15, md: 17, lg: 19, xl: 25, '2xl': 32 },
    spacing: { space0: 0, space1: 5, space2: 10, space3: 15, space4: 20, space5: 25, space6: 30, space7: 40 }
  }
}

/**
 * 阳光黄 - 温暖阳光
 */
export const SUNSHINE_YELLOW: PresetTheme = {
  id: 'sunshine-yellow',
  name: '阳光黄',
  description: '温暖的阳光黄，带来活力与希望',
  category: '自然类',
  tags: ['sunshine', 'yellow', 'warm', 'energetic'],
  author: 'Xorigo UI Team',
  rating: 4.5,
  downloads: 8420,
  createdAt: new Date('2024-04-10'),
  updatedAt: new Date('2024-10-25'),

  parameters: {
    mode: { mode: 'light', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 50, secondary: 45, accent: 55 },
    saturation: { factor: 0.7, strategy: 'adaptive' },
    lightness: { factor: 1.05, contrast: 0.6 },
    density: { level: 'comfortable', customScale: 1.05 },
    roundness: { level: 0.6, radius: 10 },
    contrast: { level: 'normal', ratio: 0.6 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal', size: 16, lineHeight: 1.6 },
      secondary: { family: 'Inter, system-ui, sans-serif', weight: 500, style: 'normal' },
      mono: { family: 'JetBrains Mono, Consolas, monospace', weight: 400, style: 'normal' },
      display: { family: 'Inter, system-ui, sans-serif', weight: 600, style: 'normal' },
      code: { family: 'JetBrains Mono, Consolas, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 13, sm: 15, md: 17, lg: 19, xl: 25, '2xl': 32 },
    spacing: { space0: 0, space1: 5, space2: 10, space3: 15, space4: 20, space5: 25, space6: 30, space7: 40 }
  }
}

/**
 * 大地棕 - 自然土壤
 */
export const EARTH_BROWN: PresetTheme = {
  id: 'earth-brown',
  name: '大地棕',
  description: '温暖的大地棕色，自然朴实',
  category: '自然类',
  tags: ['earth', 'brown', 'natural', 'grounded'],
  author: 'Xorigo UI Team',
  rating: 4.4,
  downloads: 7240,
  createdAt: new Date('2024-04-20'),
  updatedAt: new Date('2024-10-20'),

  parameters: {
    mode: { mode: 'light', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 25, secondary: 30, accent: 20 },
    saturation: { factor: 0.35, strategy: 'adaptive' },
    lightness: { factor: 1.0, contrast: 0.65 },
    density: { level: 'comfortable', customScale: 1.05 },
    roundness: { level: 0.5, radius: 8 },
    contrast: { level: 'normal', ratio: 0.65 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal', size: 16, lineHeight: 1.6 },
      secondary: { family: 'Inter, system-ui, sans-serif', weight: 500, style: 'normal' },
      mono: { family: 'JetBrains Mono, Consolas, monospace', weight: 400, style: 'normal' },
      display: { family: 'Inter, system-ui, sans-serif', weight: 600, style: 'normal' },
      code: { family: 'JetBrains Mono, Consolas, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 13, sm: 15, md: 17, lg: 19, xl: 25, '2xl': 32 },
    spacing: { space0: 0, space1: 5, space2: 10, space3: 15, space4: 20, space5: 25, space6: 30, space7: 40 }
  }
}

/**
 * 草地绿 - 新鲜草地
 */
export const GRASSLAND_GREEN: PresetTheme = {
  id: 'grassland-green',
  name: '草地绿',
  description: '新鲜草地般的绿色，活力盎然',
  category: '自然类',
  tags: ['grassland', 'green', 'fresh', 'vibrant'],
  author: 'Xorigo UI Team',
  rating: 4.6,
  downloads: 8960,
  createdAt: new Date('2024-05-01'),
  updatedAt: new Date('2024-11-10'),

  parameters: {
    mode: { mode: 'light', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 120, secondary: 115, accent: 125 },
    saturation: { factor: 0.65, strategy: 'adaptive' },
    lightness: { factor: 1.05, contrast: 0.6 },
    density: { level: 'comfortable', customScale: 1.05 },
    roundness: { level: 0.6, radius: 10 },
    contrast: { level: 'normal', ratio: 0.6 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal', size: 16, lineHeight: 1.6 },
      secondary: { family: 'Inter, system-ui, sans-serif', weight: 500, style: 'normal' },
      mono: { family: 'JetBrains Mono, Consolas, monospace', weight: 400, style: 'normal' },
      display: { family: 'Inter, system-ui, sans-serif', weight: 600, style: 'normal' },
      code: { family: 'JetBrains Mono, Consolas, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 13, sm: 15, md: 17, lg: 19, xl: 25, '2xl': 32 },
    spacing: { space0: 0, space1: 5, space2: 10, space3: 15, space4: 20, space5: 25, space6: 30, space7: 40 }
  }
}

/**
 * 日落橙 - 温暖黄昏
 */
export const SUNSET_ORANGE: PresetTheme = {
  id: 'sunset-orange',
  name: '日落橙',
  description: '温暖的日落橙色，温馨而浪漫',
  category: '自然类',
  tags: ['sunset', 'orange', 'warm', 'romantic'],
  author: 'Xorigo UI Team',
  rating: 4.5,
  downloads: 7680,
  createdAt: new Date('2024-05-10'),
  updatedAt: new Date('2024-10-30'),

  parameters: {
    mode: { mode: 'light', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 20, secondary: 15, accent: 25 },
    saturation: { factor: 0.75, strategy: 'adaptive' },
    lightness: { factor: 1.03, contrast: 0.6 },
    density: { level: 'comfortable', customScale: 1.05 },
    roundness: { level: 0.65, radius: 11 },
    contrast: { level: 'normal', ratio: 0.6 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal', size: 16, lineHeight: 1.6 },
      secondary: { family: 'Inter, system-ui, sans-serif', weight: 500, style: 'normal' },
      mono: { family: 'JetBrains Mono, Consolas, monospace', weight: 400, style: 'normal' },
      display: { family: 'Inter, system-ui, sans-serif', weight: 600, style: 'normal' },
      code: { family: 'JetBrains Mono, Consolas, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 13, sm: 15, md: 17, lg: 19, xl: 25, '2xl': 32 },
    spacing: { space0: 0, space1: 5, space2: 10, space3: 15, space4: 20, space5: 25, space6: 30, space7: 40 }
  }
}

/**
 * 天空蓝 - 澄澈蓝天
 */
export const SKY_BLUE: PresetTheme = {
  id: 'sky-blue',
  name: '天空蓝',
  description: '澄澈的天空蓝，自由开阔',
  category: '自然类',
  tags: ['sky', 'blue', 'clear', 'open'],
  author: 'Xorigo UI Team',
  rating: 4.6,
  downloads: 9240,
  createdAt: new Date('2024-05-20'),
  updatedAt: new Date('2024-11-15'),

  parameters: {
    mode: { mode: 'light', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 205, secondary: 200, accent: 210 },
    saturation: { factor: 0.55, strategy: 'adaptive' },
    lightness: { factor: 1.06, contrast: 0.6 },
    density: { level: 'comfortable', customScale: 1.05 },
    roundness: { level: 0.55, radius: 9 },
    contrast: { level: 'normal', ratio: 0.6 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal', size: 16, lineHeight: 1.6 },
      secondary: { family: 'Inter, system-ui, sans-serif', weight: 500, style: 'normal' },
      mono: { family: 'JetBrains Mono, Consolas, monospace', weight: 400, style: 'normal' },
      display: { family: 'Inter, system-ui, sans-serif', weight: 600, style: 'normal' },
      code: { family: 'JetBrains Mono, Consolas, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 13, sm: 15, md: 17, lg: 19, xl: 25, '2xl': 32 },
    spacing: { space0: 0, space1: 5, space2: 10, space3: 15, space4: 20, space5: 25, space6: 30, space7: 40 }
  }
}

/**
 * 秋季棕 - 秋叶金黄
 */
export const AUTUMN_BROWN: PresetTheme = {
  id: 'autumn-brown',
  name: '秋季棕',
  description: '金秋叶落的温暖色调',
  category: '自然类',
  tags: ['autumn', 'brown', 'golden', 'cozy'],
  author: 'Xorigo UI Team',
  rating: 4.5,
  downloads: 7890,
  createdAt: new Date('2024-05-25'),
  updatedAt: new Date('2024-10-25'),

  parameters: {
    mode: { mode: 'light', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 35, secondary: 40, accent: 30 },
    saturation: { factor: 0.6, strategy: 'adaptive' },
    lightness: { factor: 1.02, contrast: 0.6 },
    density: { level: 'comfortable', customScale: 1.05 },
    roundness: { level: 0.6, radius: 10 },
    contrast: { level: 'normal', ratio: 0.6 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal', size: 16, lineHeight: 1.6 },
      secondary: { family: 'Inter, system-ui, sans-serif', weight: 500, style: 'normal' },
      mono: { family: 'JetBrains Mono, Consolas, monospace', weight: 400, style: 'normal' },
      display: { family: 'Inter, system-ui, sans-serif', weight: 600, style: 'normal' },
      code: { family: 'JetBrains Mono, Consolas, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 13, sm: 15, md: 17, lg: 19, xl: 25, '2xl': 32 },
    spacing: { space0: 0, space1: 5, space2: 10, space3: 15, space4: 20, space5: 25, space6: 30, space7: 40 }
  }
}

// ============================================================================
// 自然类主题集合
// ============================================================================

/**
 * 所有自然类主题列表
 */
export const NATURE_THEMES: PresetTheme[] = [
  FRESH_MINT,
  FOREST_GREEN,
  OCEAN_BLUE,
  SAKURA_PINK,
  SUNSHINE_YELLOW,
  EARTH_BROWN,
  GRASSLAND_GREEN,
  SUNSET_ORANGE,
  SKY_BLUE,
  AUTUMN_BROWN
]

/**
 * 获取自然类主题
 */
export function getNatureThemes(): PresetTheme[] {
  return NATURE_THEMES
}

/**
 * 根据ID获取自然类主题
 */
export function getNatureThemeById(id: string): PresetTheme | undefined {
  return NATURE_THEMES.find(theme => theme.id === id)
}
