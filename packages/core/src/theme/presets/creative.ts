/**
 * 🎨 创意类主题预设 - 10个创意设计主题
 *
 * 适用于创意工作室、设计团队、艺术应用等场景
 * 特点：个性化、富有表现力、充满活力
 */

import type { PresetTheme } from '../advanced/twenty-six-params'

// ============================================================================
// 创意设计类主题定义
// ============================================================================

/**
 * 创意紫色 - 艺术创作主题
 */
export const CREATIVE_PURPLE: PresetTheme = {
  id: 'creative-purple',
  name: '创意紫色',
  description: '富有创意和个性化的紫色主题设计',
  category: '创意类',
  tags: ['creative', 'purple', 'vibrant', 'artistic'],
  author: 'Xorigo UI Team',
  rating: 4.6,
  downloads: 9630,
  createdAt: new Date('2024-04-05'),
  updatedAt: new Date('2024-10-20'),

  parameters: {
    mode: { mode: 'light', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 280, secondary: 300, accent: 320 },
    saturation: { factor: 0.8, strategy: 'adaptive' },
    lightness: { factor: 0.95, contrast: 0.6 },
    density: { level: 'comfortable', customScale: 1.0 },
    roundness: { level: 0.7, radius: 12 },
    contrast: { level: 'normal', ratio: 0.5 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal', size: 16, lineHeight: 1.5 },
      secondary: { family: 'Poppins, sans-serif', weight: 500, style: 'normal' },
      mono: { family: 'Fira Code, monospace', weight: 400, style: 'normal' },
      display: { family: 'Poppins, sans-serif', weight: 700, style: 'normal' },
      code: { family: 'Fira Code, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 13, sm: 15, md: 17, lg: 19, xl: 25, '2xl': 32 },
    spacing: { space0: 0, space1: 5, space2: 10, space3: 15, space4: 20, space5: 25, space6: 30, space7: 40 }
  }
}

/**
 * 活力橙 - 充满活力的橙色调
 */
export const VIBRANT_ORANGE: PresetTheme = {
  id: 'vibrant-orange',
  name: '活力橙',
  description: '充满活力的橙色调，激发创造力',
  category: '创意类',
  tags: ['vibrant', 'orange', 'energetic', 'creative'],
  author: 'Xorigo UI Team',
  rating: 4.5,
  downloads: 8420,
  isNew: true,
  createdAt: new Date('2024-05-10'),
  updatedAt: new Date('2024-11-25'),

  parameters: {
    mode: { mode: 'light', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 25, secondary: 15, accent: 35 },
    saturation: { factor: 0.9, strategy: 'adaptive' },
    lightness: { factor: 1.0, contrast: 0.6 },
    density: { level: 'comfortable', customScale: 1.0 },
    roundness: { level: 0.6, radius: 10 },
    contrast: { level: 'normal', ratio: 0.55 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal', size: 16, lineHeight: 1.5 },
      secondary: { family: 'Poppins, sans-serif', weight: 500, style: 'normal' },
      mono: { family: 'Fira Code, monospace', weight: 400, style: 'normal' },
      display: { family: 'Poppins, sans-serif', weight: 700, style: 'normal' },
      code: { family: 'Fira Code, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 13, sm: 15, md: 17, lg: 19, xl: 25, '2xl': 32 },
    spacing: { space0: 0, space1: 5, space2: 10, space3: 15, space4: 20, space5: 25, space6: 30, space7: 40 }
  }
}

/**
 * 艺术粉 - 柔和艺术风格
 */
export const ARTISTIC_PINK: PresetTheme = {
  id: 'artistic-pink',
  name: '艺术粉',
  description: '柔和的粉色调，营造温馨创意氛围',
  category: '创意类',
  tags: ['artistic', 'pink', 'soft', 'gentle'],
  author: 'Xorigo UI Team',
  rating: 4.4,
  downloads: 7280,
  createdAt: new Date('2024-05-15'),
  updatedAt: new Date('2024-10-15'),

  parameters: {
    mode: { mode: 'light', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 330, secondary: 340, accent: 320 },
    saturation: { factor: 0.6, strategy: 'adaptive' },
    lightness: { factor: 1.05, contrast: 0.55 },
    density: { level: 'comfortable', customScale: 1.0 },
    roundness: { level: 0.8, radius: 16 },
    contrast: { level: 'normal', ratio: 0.5 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal', size: 16, lineHeight: 1.5 },
      secondary: { family: 'Poppins, sans-serif', weight: 400, style: 'normal' },
      mono: { family: 'Fira Code, monospace', weight: 400, style: 'normal' },
      display: { family: 'Poppins, sans-serif', weight: 600, style: 'normal' },
      code: { family: 'Fira Code, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 13, sm: 15, md: 17, lg: 19, xl: 25, '2xl': 32 },
    spacing: { space0: 0, space1: 5, space2: 10, space3: 15, space4: 20, space5: 25, space6: 30, space7: 40 }
  }
}

/**
 * 创意绿 - 自然活力
 */
export const CREATIVE_GREEN: PresetTheme = {
  id: 'creative-green',
  name: '创意绿',
  description: '清新的绿色调，激发无限创意灵感',
  category: '创意类',
  tags: ['creative', 'green', 'fresh', 'inspiration'],
  author: 'Xorigo UI Team',
  rating: 4.6,
  downloads: 7950,
  createdAt: new Date('2024-05-20'),
  updatedAt: new Date('2024-10-28'),

  parameters: {
    mode: { mode: 'light', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 140, secondary: 130, accent: 150 },
    saturation: { factor: 0.7, strategy: 'adaptive' },
    lightness: { factor: 1.0, contrast: 0.55 },
    density: { level: 'comfortable', customScale: 1.0 },
    roundness: { level: 0.65, radius: 12 },
    contrast: { level: 'normal', ratio: 0.5 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal', size: 16, lineHeight: 1.5 },
      secondary: { family: 'Poppins, sans-serif', weight: 500, style: 'normal' },
      mono: { family: 'Fira Code, monospace', weight: 400, style: 'normal' },
      display: { family: 'Poppins, sans-serif', weight: 700, style: 'normal' },
      code: { family: 'Fira Code, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 13, sm: 15, md: 17, lg: 19, xl: 25, '2xl': 32 },
    spacing: { space0: 0, space1: 5, space2: 10, space3: 15, space4: 20, space5: 25, space6: 30, space7: 40 }
  }
}

/**
 * 创意红 - 热情奔放
 */
export const CREATIVE_RED: PresetTheme = {
  id: 'creative-red',
  name: '创意红',
  description: '热情奔放的红色调，传达强烈创意表达',
  category: '创意类',
  tags: ['creative', 'red', 'passionate', 'bold'],
  author: 'Xorigo UI Team',
  rating: 4.3,
  downloads: 6840,
  createdAt: new Date('2024-05-25'),
  updatedAt: new Date('2024-10-20'),

  parameters: {
    mode: { mode: 'light', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 350, secondary: 0, accent: 10 },
    saturation: { factor: 0.85, strategy: 'adaptive' },
    lightness: { factor: 0.98, contrast: 0.6 },
    density: { level: 'comfortable', customScale: 1.0 },
    roundness: { level: 0.55, radius: 9 },
    contrast: { level: 'normal', ratio: 0.55 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal', size: 16, lineHeight: 1.5 },
      secondary: { family: 'Poppins, sans-serif', weight: 500, style: 'normal' },
      mono: { family: 'Fira Code, monospace', weight: 400, style: 'normal' },
      display: { family: 'Poppins, sans-serif', weight: 700, style: 'normal' },
      code: { family: 'Fira Code, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 13, sm: 15, md: 17, lg: 19, xl: 25, '2xl': 32 },
    spacing: { space0: 0, space1: 5, space2: 10, space3: 15, space4: 20, space5: 25, space6: 30, space7: 40 }
  }
}

/**
 * 彩虹渐变 - 多元色彩
 */
export const RAINBOW_GRADIENT: PresetTheme = {
  id: 'rainbow-gradient',
  name: '彩虹渐变',
  description: '多元色彩渐变主题，展现无限创意可能',
  category: '创意类',
  tags: ['rainbow', 'gradient', 'colorful', 'diverse'],
  author: 'Xorigo UI Team',
  rating: 4.7,
  downloads: 9120,
  isPopular: true,
  createdAt: new Date('2024-06-01'),
  updatedAt: new Date('2024-11-10'),

  parameters: {
    mode: { mode: 'light', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 300, secondary: 200, accent: 100 },
    saturation: { factor: 0.8, strategy: 'adaptive' },
    lightness: { factor: 1.0, contrast: 0.55 },
    density: { level: 'comfortable', customScale: 1.0 },
    roundness: { level: 0.75, radius: 14 },
    contrast: { level: 'normal', ratio: 0.5 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal', size: 16, lineHeight: 1.5 },
      secondary: { family: 'Poppins, sans-serif', weight: 500, style: 'normal' },
      mono: { family: 'Fira Code, monospace', weight: 400, style: 'normal' },
      display: { family: 'Poppins, sans-serif', weight: 700, style: 'normal' },
      code: { family: 'Fira Code, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 13, sm: 15, md: 17, lg: 19, xl: 25, '2xl': 32 },
    spacing: { space0: 0, space1: 5, space2: 10, space3: 15, space4: 20, space5: 25, space6: 30, space7: 40 }
  }
}

/**
 * 创意青 - 现代清新
 */
export const CREATIVE_CYAN: PresetTheme = {
  id: 'creative-cyan',
  name: '创意青',
  description: '现代清新的青色调，体现创新精神',
  category: '创意类',
  tags: ['creative', 'cyan', 'modern', 'fresh'],
  author: 'Xorigo UI Team',
  rating: 4.5,
  downloads: 7560,
  createdAt: new Date('2024-06-05'),
  updatedAt: new Date('2024-10-25'),

  parameters: {
    mode: { mode: 'light', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 180, secondary: 170, accent: 190 },
    saturation: { factor: 0.75, strategy: 'adaptive' },
    lightness: { factor: 1.02, contrast: 0.55 },
    density: { level: 'comfortable', customScale: 1.0 },
    roundness: { level: 0.7, radius: 12 },
    contrast: { level: 'normal', ratio: 0.5 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal', size: 16, lineHeight: 1.5 },
      secondary: { family: 'Poppins, sans-serif', weight: 500, style: 'normal' },
      mono: { family: 'Fira Code, monospace', weight: 400, style: 'normal' },
      display: { family: 'Poppins, sans-serif', weight: 700, style: 'normal' },
      code: { family: 'Fira Code, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 13, sm: 15, md: 17, lg: 19, xl: 25, '2xl': 32 },
    spacing: { space0: 0, space1: 5, space2: 10, space3: 15, space4: 20, space5: 25, space6: 30, space7: 40 }
  }
}

/**
 * 创意琥珀 - 温暖活力
 */
export const CREATIVE_AMBER: PresetTheme = {
  id: 'creative-amber',
  name: '创意琥珀',
  description: '温暖的琥珀色调，激发灵感与活力',
  category: '创意类',
  tags: ['creative', 'amber', 'warm', 'inspiring'],
  author: 'Xorigo UI Team',
  rating: 4.4,
  downloads: 6890,
  createdAt: new Date('2024-06-10'),
  updatedAt: new Date('2024-10-20'),

  parameters: {
    mode: { mode: 'light', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 40, secondary: 35, accent: 45 },
    saturation: { factor: 0.8, strategy: 'adaptive' },
    lightness: { factor: 1.0, contrast: 0.55 },
    density: { level: 'comfortable', customScale: 1.0 },
    roundness: { level: 0.7, radius: 12 },
    contrast: { level: 'normal', ratio: 0.5 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal', size: 16, lineHeight: 1.5 },
      secondary: { family: 'Poppins, sans-serif', weight: 500, style: 'normal' },
      mono: { family: 'Fira Code, monospace', weight: 400, style: 'normal' },
      display: { family: 'Poppins, sans-serif', weight: 700, style: 'normal' },
      code: { family: 'Fira Code, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 13, sm: 15, md: 17, lg: 19, xl: 25, '2xl': 32 },
    spacing: { space0: 0, space1: 5, space2: 10, space3: 15, space4: 20, space5: 25, space6: 30, space7: 40 }
  }
}

/**
 * 创意紫红 - 梦幻色彩
 */
export const CREATIVE_MAGENTA: PresetTheme = {
  id: 'creative-magenta',
  name: '创意紫红',
  description: '梦幻的紫红色调，创造想象空间',
  category: '创意类',
  tags: ['creative', 'magenta', 'dreamy', 'fantasy'],
  author: 'Xorigo UI Team',
  rating: 4.5,
  downloads: 7340,
  createdAt: new Date('2024-06-15'),
  updatedAt: new Date('2024-10-30'),

  parameters: {
    mode: { mode: 'light', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 310, secondary: 300, accent: 320 },
    saturation: { factor: 0.8, strategy: 'adaptive' },
    lightness: { factor: 0.98, contrast: 0.55 },
    density: { level: 'comfortable', customScale: 1.0 },
    roundness: { level: 0.75, radius: 14 },
    contrast: { level: 'normal', ratio: 0.5 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal', size: 16, lineHeight: 1.5 },
      secondary: { family: 'Poppins, sans-serif', weight: 500, style: 'normal' },
      mono: { family: 'Fira Code, monospace', weight: 400, style: 'normal' },
      display: { family: 'Poppins, sans-serif', weight: 700, style: 'normal' },
      code: { family: 'Fira Code, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 13, sm: 15, md: 17, lg: 19, xl: 25, '2xl': 32 },
    spacing: { space0: 0, space1: 5, space2: 10, space3: 15, space4: 20, space5: 25, space6: 30, space7: 40 }
  }
}

/**
 * 创意薄荷 - 清爽创意
 */
export const CREATIVE_MINT: PresetTheme = {
  id: 'creative-mint',
  name: '创意薄荷',
  description: '清爽的薄荷色调，保持清醒创意',
  category: '创意类',
  tags: ['creative', 'mint', 'fresh', 'clear'],
  author: 'Xorigo UI Team',
  rating: 4.6,
  downloads: 8120,
  createdAt: new Date('2024-06-20'),
  updatedAt: new Date('2024-11-05'),

  parameters: {
    mode: { mode: 'light', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 160, secondary: 155, accent: 165 },
    saturation: { factor: 0.5, strategy: 'adaptive' },
    lightness: { factor: 1.05, contrast: 0.55 },
    density: { level: 'comfortable', customScale: 1.0 },
    roundness: { level: 0.7, radius: 12 },
    contrast: { level: 'normal', ratio: 0.5 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal', size: 16, lineHeight: 1.5 },
      secondary: { family: 'Poppins, sans-serif', weight: 500, style: 'normal' },
      mono: { family: 'Fira Code, monospace', weight: 400, style: 'normal' },
      display: { family: 'Poppins, sans-serif', weight: 700, style: 'normal' },
      code: { family: 'Fira Code, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 13, sm: 15, md: 17, lg: 19, xl: 25, '2xl': 32 },
    spacing: { space0: 0, space1: 5, space2: 10, space3: 15, space4: 20, space5: 25, space6: 30, space7: 40 }
  }
}

// ============================================================================
// 创意类主题集合
// ============================================================================

/**
 * 所有创意类主题列表
 */
export const CREATIVE_THEMES: PresetTheme[] = [
  CREATIVE_PURPLE,
  VIBRANT_ORANGE,
  ARTISTIC_PINK,
  CREATIVE_GREEN,
  CREATIVE_RED,
  RAINBOW_GRADIENT,
  CREATIVE_CYAN,
  CREATIVE_AMBER,
  CREATIVE_MAGENTA,
  CREATIVE_MINT
]

/**
 * 获取创意类主题
 */
export function getCreativeThemes(): PresetTheme[] {
  return CREATIVE_THEMES
}

/**
 * 根据ID获取创意类主题
 */
export function getCreativeThemeById(id: string): PresetTheme | undefined {
  return CREATIVE_THEMES.find(theme => theme.id === id)
}
