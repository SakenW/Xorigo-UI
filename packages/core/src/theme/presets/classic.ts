/**
 * 👑 经典款主题预设 - 10个经典优雅主题
 *
 * 适用于高端品牌、文化机构、传统企业等场景
 * 特点：经典、优雅、永恒、高端
 */

import type { PresetTheme } from '../advanced/twenty-six-params'

// ============================================================================
// 经典优雅主题定义
// ============================================================================

/**
 * 经典黑白 - 永恒经典
 */
export const CLASSIC_BLACK_WHITE: PresetTheme = {
  id: 'classic-black-white',
  name: '经典黑白',
  description: '永恒的经典黑白配色，永不过时',
  category: '经典款',
  tags: ['classic', 'black', 'white', 'timeless'],
  author: 'Xorigo UI Team',
  rating: 4.9,
  downloads: 18240,
  isPopular: true,
  isNew: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-12-01'),

  parameters: {
    mode: { mode: 'light', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 0, secondary: 0, accent: 0 },
    saturation: { factor: 0.0, strategy: 'uniform' },
    lightness: { factor: 1.1, contrast: 1.0 },
    density: { level: 'spacious', customScale: 1.15 },
    roundness: { level: 0.0, radius: 0 },
    contrast: { level: 'high', ratio: 1.0 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 300, style: 'normal', size: 17, lineHeight: 1.7 },
      secondary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal' },
      mono: { family: 'JetBrains Mono, Consolas, monospace', weight: 300, style: 'normal' },
      display: { family: 'Inter, system-ui, sans-serif', weight: 500, style: 'normal' },
      code: { family: 'JetBrains Mono, Consolas, monospace', weight: 400, style: 'normal' }
    },
    sizes: { xs: 14, sm: 16, md: 18, lg: 20, xl: 26, '2xl': 34 },
    spacing: { space0: 0, space1: 6, space2: 12, space3: 18, space4: 24, space5: 30, space6: 36, space7: 48 }
  }
}

/**
 * 优雅灰 - 低调奢华
 */
export const ELEGANT_GRAY: PresetTheme = {
  id: 'elegant-gray',
  name: '优雅灰',
  description: '低调奢华的灰色调，展现优雅气质',
  category: '经典款',
  tags: ['elegant', 'gray', 'luxury', 'sophisticated'],
  author: 'Xorigo UI Team',
  rating: 4.8,
  downloads: 14580,
  isPopular: true,
  createdAt: new Date('2024-01-20'),
  updatedAt: new Date('2024-11-20'),

  parameters: {
    mode: { mode: 'light', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 220, secondary: 220, accent: 220 },
    saturation: { factor: 0.05, strategy: 'uniform' },
    lightness: { factor: 1.08, contrast: 0.85 },
    density: { level: 'spacious', customScale: 1.1 },
    roundness: { level: 0.1, radius: 1 },
    contrast: { level: 'high', ratio: 0.85 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 300, style: 'normal', size: 17, lineHeight: 1.7 },
      secondary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal' },
      mono: { family: 'JetBrains Mono, Consolas, monospace', weight: 400, style: 'normal' },
      display: { family: 'Inter, system-ui, sans-serif', weight: 500, style: 'normal' },
      code: { family: 'JetBrains Mono, Consolas, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 14, sm: 16, md: 18, lg: 20, xl: 26, '2xl': 34 },
    spacing: { space0: 0, space1: 6, space2: 12, space3: 18, space4: 24, space5: 30, space6: 36, space7: 48 }
  }
}

/**
 * 复古蓝 - 经典海军蓝
 */
export const VINTAGE_BLUE: PresetTheme = {
  id: 'vintage-blue',
  name: '复古蓝',
  description: '经典的海军蓝，永恒的优雅',
  category: '经典款',
  tags: ['vintage', 'blue', 'navy', 'classic'],
  author: 'Xorigo UI Team',
  rating: 4.7,
  downloads: 11890,
  createdAt: new Date('2024-02-05'),
  updatedAt: new Date('2024-11-05'),

  parameters: {
    mode: { mode: 'light', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 220, secondary: 215, accent: 225 },
    saturation: { factor: 0.35, strategy: 'uniform' },
    lightness: { factor: 1.02, contrast: 0.75 },
    density: { level: 'spacious', customScale: 1.1 },
    roundness: { level: 0.15, radius: 2 },
    contrast: { level: 'high', ratio: 0.75 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 300, style: 'normal', size: 17, lineHeight: 1.7 },
      secondary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal' },
      mono: { family: 'JetBrains Mono, Consolas, monospace', weight: 400, style: 'normal' },
      display: { family: 'Inter, system-ui, sans-serif', weight: 500, style: 'normal' },
      code: { family: 'JetBrains Mono, Consolas, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 14, sm: 16, md: 18, lg: 20, xl: 26, '2xl': 34 },
    spacing: { space0: 0, space1: 6, space2: 12, space3: 18, space4: 24, space5: 30, space6: 36, space7: 48 }
  }
}

/**
 * 优雅金 - 高贵金色
 */
export const ELEGANT_GOLD: PresetTheme = {
  id: 'elegant-gold',
  name: '优雅金',
  description: '高贵的金色调，尽显奢华气质',
  category: '经典款',
  tags: ['elegant', 'gold', 'luxury', 'premium'],
  author: 'Xorigo UI Team',
  rating: 4.8,
  downloads: 13240,
  createdAt: new Date('2024-02-15'),
  updatedAt: new Date('2024-11-15'),

  parameters: {
    mode: { mode: 'light', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 45, secondary: 42, accent: 48 },
    saturation: { factor: 0.55, strategy: 'uniform' },
    lightness: { factor: 1.05, contrast: 0.75 },
    density: { level: 'spacious', customScale: 1.1 },
    roundness: { level: 0.2, radius: 3 },
    contrast: { level: 'high', ratio: 0.75 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 300, style: 'normal', size: 17, lineHeight: 1.7 },
      secondary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal' },
      mono: { family: 'JetBrains Mono, Consolas, monospace', weight: 400, style: 'normal' },
      display: { family: 'Inter, system-ui, sans-serif', weight: 500, style: 'normal' },
      code: { family: 'JetBrains Mono, Consolas, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 14, sm: 16, md: 18, lg: 20, xl: 26, '2xl': 34 },
    spacing: { space0: 0, space1: 6, space2: 12, space3: 18, space4: 24, space5: 30, space6: 36, space7: 48 }
  }
}

/**
 * 经典棕 - 复古皮革
 */
export const CLASSIC_BROWN: PresetTheme = {
  id: 'classic-brown',
  name: '经典棕',
  description: '复古皮革棕色，经典而温暖',
  category: '经典款',
  tags: ['classic', 'brown', 'leather', 'warm'],
  author: 'Xorigo UI Team',
  rating: 4.6,
  downloads: 9560,
  createdAt: new Date('2024-03-01'),
  updatedAt: new Date('2024-10-25'),

  parameters: {
    mode: { mode: 'light', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 25, secondary: 28, accent: 22 },
    saturation: { factor: 0.45, strategy: 'uniform' },
    lightness: { factor: 1.02, contrast: 0.7 },
    density: { level: 'spacious', customScale: 1.1 },
    roundness: { level: 0.25, radius: 4 },
    contrast: { level: 'normal', ratio: 0.7 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 300, style: 'normal', size: 17, lineHeight: 1.7 },
      secondary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal' },
      mono: { family: 'JetBrains Mono, Consolas, monospace', weight: 400, style: 'normal' },
      display: { family: 'Inter, system-ui, sans-serif', weight: 500, style: 'normal' },
      code: { family: 'JetBrains Mono, Consolas, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 14, sm: 16, md: 18, lg: 20, xl: 26, '2xl': 34 },
    spacing: { space0: 0, space1: 6, space2: 12, space3: 18, space4: 24, space5: 30, space6: 36, space7: 48 }
  }
}

/**
 * 永恒银 - 优雅银色
 */
export const ETERNAL_SILVER: PresetTheme = {
  id: 'eternal-silver',
  name: '永恒银',
  description: '优雅的银色调，永恒的经典',
  category: '经典款',
  tags: ['eternal', 'silver', 'elegant', 'timeless'],
  author: 'Xorigo UI Team',
  rating: 4.7,
  downloads: 10890,
  createdAt: new Date('2024-03-15'),
  updatedAt: new Date('2024-11-10'),

  parameters: {
    mode: { mode: 'light', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 210, secondary: 210, accent: 210 },
    saturation: { factor: 0.1, strategy: 'uniform' },
    lightness: { factor: 1.06, contrast: 0.8 },
    density: { level: 'spacious', customScale: 1.1 },
    roundness: { level: 0.1, radius: 1 },
    contrast: { level: 'high', ratio: 0.8 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 300, style: 'normal', size: 17, lineHeight: 1.7 },
      secondary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal' },
      mono: { family: 'JetBrains Mono, Consolas, monospace', weight: 400, style: 'normal' },
      display: { family: 'Inter, system-ui, sans-serif', weight: 500, style: 'normal' },
      code: { family: 'JetBrains Mono, Consolas, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 14, sm: 16, md: 18, lg: 20, xl: 26, '2xl': 34 },
    spacing: { space0: 0, space1: 6, space2: 12, space3: 18, space4: 24, space5: 30, space6: 36, space7: 48 }
  }
}

/**
 * 贵族紫 - 高贵紫色
 */
export const NOBLE_PURPLE: PresetTheme = {
  id: 'noble-purple',
  name: '贵族紫',
  description: '高贵的紫色调，彰显贵族气质',
  category: '经典款',
  tags: ['noble', 'purple', 'royal', 'sophisticated'],
  author: 'Xorigo UI Team',
  rating: 4.6,
  downloads: 8960,
  createdAt: new Date('2024-04-01'),
  updatedAt: new Date('2024-10-30'),

  parameters: {
    mode: { mode: 'light', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 270, secondary: 275, accent: 265 },
    saturation: { factor: 0.35, strategy: 'uniform' },
    lightness: { factor: 1.03, contrast: 0.7 },
    density: { level: 'spacious', customScale: 1.1 },
    roundness: { level: 0.2, radius: 3 },
    contrast: { level: 'high', ratio: 0.7 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 300, style: 'normal', size: 17, lineHeight: 1.7 },
      secondary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal' },
      mono: { family: 'JetBrains Mono, Consolas, monospace', weight: 400, style: 'normal' },
      display: { family: 'Inter, system-ui, sans-serif', weight: 500, style: 'normal' },
      code: { family: 'JetBrains Mono, Consolas, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 14, sm: 16, md: 18, lg: 20, xl: 26, '2xl': 34 },
    spacing: { space0: 0, space1: 6, space2: 12, space3: 18, space4: 24, space5: 30, space6: 36, space7: 48 }
  }
}

/**
 * 复古红 - 经典酒红
 */
export const VINTAGE_RED: PresetTheme = {
  id: 'vintage-red',
  name: '复古红',
  description: '经典的酒红色，深沉而优雅',
  category: '经典款',
  tags: ['vintage', 'red', 'wine', 'classic'],
  author: 'Xorigo UI Team',
  rating: 4.5,
  downloads: 7820,
  createdAt: new Date('2024-04-15'),
  updatedAt: new Date('2024-10-20'),

  parameters: {
    mode: { mode: 'light', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 350, secondary: 345, accent: 355 },
    saturation: { factor: 0.5, strategy: 'uniform' },
    lightness: { factor: 0.98, contrast: 0.75 },
    density: { level: 'spacious', customScale: 1.1 },
    roundness: { level: 0.15, radius: 2 },
    contrast: { level: 'high', ratio: 0.75 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 300, style: 'normal', size: 17, lineHeight: 1.7 },
      secondary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal' },
      mono: { family: 'JetBrains Mono, Consolas, monospace', weight: 400, style: 'normal' },
      display: { family: 'Inter, system-ui, sans-serif', weight: 500, style: 'normal' },
      code: { family: 'JetBrains Mono, Consolas, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 14, sm: 16, md: 18, lg: 20, xl: 26, '2xl': 34 },
    spacing: { space0: 0, space1: 6, space2: 12, space3: 18, space4: 24, space5: 30, space6: 36, space7: 48 }
  }
}

/**
 * 永恒绿 - 经典翡翠
 */
export const ETERNAL_GREEN: PresetTheme = {
  id: 'eternal-green',
  name: '永恒绿',
  description: '经典的翡翠绿，深沉而优雅',
  category: '经典款',
  tags: ['eternal', 'green', 'emerald', 'classic'],
  author: 'Xorigo UI Team',
  rating: 4.6,
  downloads: 8920,
  createdAt: new Date('2024-05-01'),
  updatedAt: new Date('2024-11-05'),

  parameters: {
    mode: { mode: 'light', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 145, secondary: 142, accent: 148 },
    saturation: { factor: 0.4, strategy: 'uniform' },
    lightness: { factor: 1.02, contrast: 0.72 },
    density: { level: 'spacious', customScale: 1.1 },
    roundness: { level: 0.2, radius: 3 },
    contrast: { level: 'high', ratio: 0.72 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 300, style: 'normal', size: 17, lineHeight: 1.7 },
      secondary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal' },
      mono: { family: 'JetBrains Mono, Consolas, monospace', weight: 400, style: 'normal' },
      display: { family: 'Inter, system-ui, sans-serif', weight: 500, style: 'normal' },
      code: { family: 'JetBrains Mono, Consolas, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 14, sm: 16, md: 18, lg: 20, xl: 26, '2xl': 34 },
    spacing: { space0: 0, space1: 6, space2: 12, space3: 18, space4: 24, space5: 30, space6: 36, space7: 48 }
  }
}

/**
 * 经典米白 - 优雅米色
 */
export const CLASSIC_CREAM: PresetTheme = {
  id: 'classic-cream',
  name: '经典米白',
  description: '优雅的米白色调，温暖而经典',
  category: '经典款',
  tags: ['classic', 'cream', 'warm', 'elegant'],
  author: 'Xorigo UI Team',
  rating: 4.7,
  downloads: 10240,
  createdAt: new Date('2024-05-15'),
  updatedAt: new Date('2024-11-15'),

  parameters: {
    mode: { mode: 'light', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 45, secondary: 45, accent: 45 },
    saturation: { factor: 0.15, strategy: 'uniform' },
    lightness: { factor: 1.08, contrast: 0.68 },
    density: { level: 'spacious', customScale: 1.1 },
    roundness: { level: 0.25, radius: 4 },
    contrast: { level: 'normal', ratio: 0.68 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 300, style: 'normal', size: 17, lineHeight: 1.7 },
      secondary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal' },
      mono: { family: 'JetBrains Mono, Consolas, monospace', weight: 400, style: 'normal' },
      display: { family: 'Inter, system-ui, sans-serif', weight: 500, style: 'normal' },
      code: { family: 'JetBrains Mono, Consolas, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 14, sm: 16, md: 18, lg: 20, xl: 26, '2xl': 34 },
    spacing: { space0: 0, space1: 6, space2: 12, space3: 18, space4: 24, space5: 30, space6: 36, space7: 48 }
  }
}

// ============================================================================
// 经典款主题集合
// ============================================================================

/**
 * 所有经典款主题列表
 */
export const CLASSIC_THEMES: PresetTheme[] = [
  CLASSIC_BLACK_WHITE,
  ELEGANT_GRAY,
  VINTAGE_BLUE,
  ELEGANT_GOLD,
  CLASSIC_BROWN,
  ETERNAL_SILVER,
  NOBLE_PURPLE,
  VINTAGE_RED,
  ETERNAL_GREEN,
  CLASSIC_CREAM
]

/**
 * 获取经典款主题
 */
export function getClassicThemes(): PresetTheme[] {
  return CLASSIC_THEMES
}

/**
 * 根据ID获取经典款主题
 */
export function getClassicThemeById(id: string): PresetTheme | undefined {
  return CLASSIC_THEMES.find(theme => theme.id === id)
}
