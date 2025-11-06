/**
 * 💻 科技类主题预设 - 10个科技感主题
 *
 * 适用于科技公司、开发工具、应用软件等场景
 * 特点：现代感、未来感、极简主义
 */

import type { PresetTheme } from '../advanced/twenty-six-params'

// ============================================================================
// 科技感主题定义
// ============================================================================

/**
 * 赛博霓虹 - 现代科技感
 */
export const CYBER_NEON: PresetTheme = {
  id: 'cyber-neon',
  name: '赛博霓虹',
  description: '具有现代科技感的霓虹色彩主题',
  category: '科技类',
  tags: ['cyber', 'neon', 'tech', 'futuristic'],
  author: 'Xorigo UI Team',
  rating: 4.5,
  downloads: 7420,
  createdAt: new Date('2024-05-20'),
  updatedAt: new Date('2024-11-01'),

  parameters: {
    mode: { mode: 'dark', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 190, secondary: 280, accent: 330 },
    saturation: { factor: 0.9, strategy: 'adaptive' },
    lightness: { factor: 0.8, contrast: 0.9 },
    density: { level: 'compact', customScale: 0.9 },
    roundness: { level: 0.1, radius: 0 },
    contrast: { level: 'high', ratio: 0.9 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal', size: 15, lineHeight: 1.4 },
      secondary: { family: 'Inter, system-ui, sans-serif', weight: 500, style: 'normal' },
      mono: { family: 'JetBrains Mono, Consolas, monospace', weight: 400, style: 'normal' },
      display: { family: 'Inter, system-ui, sans-serif', weight: 600, style: 'normal' },
      code: { family: 'JetBrains Mono, Consolas, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 11, sm: 13, md: 15, lg: 17, xl: 23, '2xl': 29 },
    spacing: { space0: 0, space1: 3, space2: 6, space3: 9, space4: 12, space5: 15, space6: 18, space7: 24 }
  }
}

/**
 * 极简深色 - 程序员专用
 */
export const MINIMAL_DARK: PresetTheme = {
  id: 'minimal-dark',
  name: '极简深色',
  description: '程序员喜爱的极简深色主题',
  category: '科技类',
  tags: ['minimal', 'dark', 'programmer', 'clean'],
  author: 'Xorigo UI Team',
  rating: 4.8,
  downloads: 14520,
  isPopular: true,
  createdAt: new Date('2024-01-10'),
  updatedAt: new Date('2024-12-01'),

  parameters: {
    mode: { mode: 'dark', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 220, secondary: 220, accent: 220 },
    saturation: { factor: 0.0, strategy: 'uniform' },
    lightness: { factor: 0.85, contrast: 0.85 },
    density: { level: 'compact', customScale: 0.95 },
    roundness: { level: 0.2, radius: 2 },
    contrast: { level: 'high', ratio: 0.9 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal', size: 15, lineHeight: 1.5 },
      secondary: { family: 'Inter, system-ui, sans-serif', weight: 500, style: 'normal' },
      mono: { family: 'JetBrains Mono, Consolas, monospace', weight: 400, style: 'normal' },
      display: { family: 'Inter, system-ui, sans-serif', weight: 600, style: 'normal' },
      code: { family: 'JetBrains Mono, Consolas, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 12, sm: 14, md: 16, lg: 18, xl: 24, '2xl': 30 },
    spacing: { space0: 0, space1: 4, space2: 8, space3: 12, space4: 16, space5: 20, space6: 24, space7: 32 }
  }
}

/**
 * 极客蓝 - 开发者主题
 */
export const GEEK_BLUE: PresetTheme = {
  id: 'geek-blue',
  name: '极客蓝',
  description: '专为开发者设计的蓝色主题',
  category: '科技类',
  tags: ['geek', 'blue', 'developer', 'coding'],
  author: 'Xorigo UI Team',
  rating: 4.7,
  downloads: 11230,
  createdAt: new Date('2024-02-20'),
  updatedAt: new Date('2024-11-15'),

  parameters: {
    mode: { mode: 'dark', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 210, secondary: 200, accent: 220 },
    saturation: { factor: 0.4, strategy: 'uniform' },
    lightness: { factor: 0.9, contrast: 0.8 },
    density: { level: 'compact', customScale: 0.95 },
    roundness: { level: 0.15, radius: 1 },
    contrast: { level: 'high', ratio: 0.85 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal', size: 15, lineHeight: 1.5 },
      secondary: { family: 'Inter, system-ui, sans-serif', weight: 500, style: 'normal' },
      mono: { family: 'JetBrains Mono, Consolas, monospace', weight: 400, style: 'normal' },
      display: { family: 'Inter, system-ui, sans-serif', weight: 600, style: 'normal' },
      code: { family: 'JetBrains Mono, Consolas, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 11, sm: 13, md: 15, lg: 17, xl: 23, '2xl': 29 },
    spacing: { space0: 0, space1: 3, space2: 6, space3: 9, space4: 12, space5: 15, space6: 18, space7: 24 }
  }
}

/**
 * 未来绿 - 人工智能主题
 */
export const AI_GREEN: PresetTheme = {
  id: 'ai-green',
  name: '未来绿',
  description: '人工智能主题，绿色科技感',
  category: '科技类',
  tags: ['ai', 'green', 'future', 'machine-learning'],
  author: 'Xorigo UI Team',
  rating: 4.6,
  downloads: 8960,
  createdAt: new Date('2024-03-05'),
  updatedAt: new Date('2024-10-25'),

  parameters: {
    mode: { mode: 'dark', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 120, secondary: 140, accent: 100 },
    saturation: { factor: 0.8, strategy: 'adaptive' },
    lightness: { factor: 0.85, contrast: 0.85 },
    density: { level: 'compact', customScale: 0.9 },
    roundness: { level: 0.2, radius: 2 },
    contrast: { level: 'high', ratio: 0.85 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal', size: 15, lineHeight: 1.5 },
      secondary: { family: 'Inter, system-ui, sans-serif', weight: 500, style: 'normal' },
      mono: { family: 'JetBrains Mono, Consolas, monospace', weight: 400, style: 'normal' },
      display: { family: 'Inter, system-ui, sans-serif', weight: 600, style: 'normal' },
      code: { family: 'JetBrains Mono, Consolas, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 11, sm: 13, md: 15, lg: 17, xl: 23, '2xl': 29 },
    spacing: { space0: 0, space1: 3, space2: 6, space3: 9, space4: 12, space5: 15, space6: 18, space7: 24 }
  }
}

/**
 * 代码紫 - 编程专用
 */
export const CODE_PURPLE: PresetTheme = {
  id: 'code-purple',
  name: '代码紫',
  description: '专为程序员打造的紫色主题',
  category: '科技类',
  tags: ['code', 'purple', 'programming', 'developer'],
  author: 'Xorigo UI Team',
  rating: 4.4,
  downloads: 7340,
  createdAt: new Date('2024-03-15'),
  updatedAt: new Date('2024-10-20'),

  parameters: {
    mode: { mode: 'dark', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 265, secondary: 280, accent: 250 },
    saturation: { factor: 0.6, strategy: 'uniform' },
    lightness: { factor: 0.88, contrast: 0.8 },
    density: { level: 'compact', customScale: 0.95 },
    roundness: { level: 0.15, radius: 1 },
    contrast: { level: 'high', ratio: 0.8 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal', size: 15, lineHeight: 1.5 },
      secondary: { family: 'Inter, system-ui, sans-serif', weight: 500, style: 'normal' },
      mono: { family: 'JetBrains Mono, Consolas, monospace', weight: 400, style: 'normal' },
      display: { family: 'Inter, system-ui, sans-serif', weight: 600, style: 'normal' },
      code: { family: 'JetBrains Mono, Consolas, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 11, sm: 13, md: 15, lg: 17, xl: 23, '2xl': 29 },
    spacing: { space0: 0, space1: 3, space2: 6, space3: 9, space4: 12, space5: 15, space6: 18, space7: 24 }
  }
}

/**
 * 高科技红 - 创新科技
 */
export const HIGH_TECH_RED: PresetTheme = {
  id: 'high-tech-red',
  name: '高科技红',
  description: '充满未来感的高科技红色主题',
  category: '科技类',
  tags: ['high-tech', 'red', 'innovation', 'futuristic'],
  author: 'Xorigo UI Team',
  rating: 4.3,
  downloads: 5890,
  createdAt: new Date('2024-04-01'),
  updatedAt: new Date('2024-10-15'),

  parameters: {
    mode: { mode: 'dark', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 350, secondary: 10, accent: 330 },
    saturation: { factor: 0.9, strategy: 'adaptive' },
    lightness: { factor: 0.82, contrast: 0.9 },
    density: { level: 'compact', customScale: 0.9 },
    roundness: { level: 0.1, radius: 0 },
    contrast: { level: 'high', ratio: 0.9 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal', size: 15, lineHeight: 1.5 },
      secondary: { family: 'Inter, system-ui, sans-serif', weight: 500, style: 'normal' },
      mono: { family: 'JetBrains Mono, Consolas, monospace', weight: 400, style: 'normal' },
      display: { family: 'Inter, system-ui, sans-serif', weight: 600, style: 'normal' },
      code: { family: 'JetBrains Mono, Consolas, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 11, sm: 13, md: 15, lg: 17, xl: 23, '2xl': 29 },
    spacing: { space0: 0, space1: 3, space2: 6, space3: 9, space4: 12, space5: 15, space6: 18, space7: 24 }
  }
}

/**
 * 极客橙 - 开发者首选
 */
export const HACKER_ORANGE: PresetTheme = {
  id: 'hacker-orange',
  name: '极客橙',
  description: '经典程序员橙色主题',
  category: '科技类',
  tags: ['hacker', 'orange', 'classic', 'programmer'],
  author: 'Xorigo UI Team',
  rating: 4.6,
  downloads: 10240,
  createdAt: new Date('2024-04-10'),
  updatedAt: new Date('2024-11-10'),

  parameters: {
    mode: { mode: 'dark', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 25, secondary: 15, accent: 35 },
    saturation: { factor: 0.9, strategy: 'uniform' },
    lightness: { factor: 0.85, contrast: 0.85 },
    density: { level: 'compact', customScale: 0.95 },
    roundness: { level: 0.2, radius: 2 },
    contrast: { level: 'high', ratio: 0.85 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal', size: 15, lineHeight: 1.5 },
      secondary: { family: 'Inter, system-ui, sans-serif', weight: 500, style: 'normal' },
      mono: { family: 'JetBrains Mono, Consolas, monospace', weight: 400, style: 'normal' },
      display: { family: 'Inter, system-ui, sans-serif', weight: 600, style: 'normal' },
      code: { family: 'JetBrains Mono, Consolas, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 11, sm: 13, md: 15, lg: 17, xl: 23, '2xl': 29 },
    spacing: { space0: 0, space1: 3, space2: 6, space3: 9, space4: 12, space5: 15, space6: 18, space7: 24 }
  }
}

/**
 * 区块链蓝 - 区块链主题
 */
export const BLOCKCHAIN_BLUE: PresetTheme = {
  id: 'blockchain-blue',
  name: '区块链蓝',
  description: '区块链行业专用蓝色主题',
  category: '科技类',
  tags: ['blockchain', 'blue', 'crypto', 'decentralized'],
  author: 'Xorigo UI Team',
  rating: 4.5,
  downloads: 6780,
  createdAt: new Date('2024-04-20'),
  updatedAt: new Date('2024-10-28'),

  parameters: {
    mode: { mode: 'dark', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 200, secondary: 190, accent: 210 },
    saturation: { factor: 0.6, strategy: 'adaptive' },
    lightness: { factor: 0.87, contrast: 0.82 },
    density: { level: 'compact', customScale: 0.95 },
    roundness: { level: 0.15, radius: 1 },
    contrast: { level: 'high', ratio: 0.82 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal', size: 15, lineHeight: 1.5 },
      secondary: { family: 'Inter, system-ui, sans-serif', weight: 500, style: 'normal' },
      mono: { family: 'JetBrains Mono, Consolas, monospace', weight: 400, style: 'normal' },
      display: { family: 'Inter, system-ui, sans-serif', weight: 600, style: 'normal' },
      code: { family: 'JetBrains Mono, Consolas, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 11, sm: 13, md: 15, lg: 17, xl: 23, '2xl': 29 },
    spacing: { space0: 0, space1: 3, space2: 6, space3: 9, space4: 12, space5: 15, space6: 18, space7: 24 }
  }
}

/**
 * 机器人灰 - AI助手主题
 */
export const ROBOT_GRAY: PresetTheme = {
  id: 'robot-gray',
  name: '机器人灰',
  description: '人工智能机器人主题，灰色调体现理性',
  category: '科技类',
  tags: ['robot', 'gray', 'ai', '理性'],
  author: 'Xorigo UI Team',
  rating: 4.4,
  downloads: 5920,
  createdAt: new Date('2024-05-01'),
  updatedAt: new Date('2024-10-22'),

  parameters: {
    mode: { mode: 'dark', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 0, secondary: 0, accent: 0 },
    saturation: { factor: 0.0, strategy: 'uniform' },
    lightness: { factor: 0.88, contrast: 0.88 },
    density: { level: 'compact', customScale: 0.95 },
    roundness: { level: 0.1, radius: 0 },
    contrast: { level: 'high', ratio: 0.88 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal', size: 15, lineHeight: 1.5 },
      secondary: { family: 'Inter, system-ui, sans-serif', weight: 500, style: 'normal' },
      mono: { family: 'JetBrains Mono, Consolas, monospace', weight: 400, style: 'normal' },
      display: { family: 'Inter, system-ui, sans-serif', weight: 600, style: 'normal' },
      code: { family: 'JetBrains Mono, Consolas, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 11, sm: 13, md: 15, lg: 17, xl: 23, '2xl': 29 },
    spacing: { space0: 0, space1: 3, space2: 6, space3: 9, space4: 12, space5: 15, space6: 18, space7: 24 }
  }
}

/**
 * 赛博朋克 - 经典赛博朋克风格
 */
export const CYBERPUNK: PresetTheme = {
  id: 'cyberpunk',
  name: '赛博朋克',
  description: '经典赛博朋克风格主题',
  category: '科技类',
  tags: ['cyberpunk', 'neon', 'punk', 'retro-futuristic'],
  author: 'Xorigo UI Team',
  rating: 4.7,
  downloads: 9840,
  isPopular: true,
  createdAt: new Date('2024-05-15'),
  updatedAt: new Date('2024-11-20'),

  parameters: {
    mode: { mode: 'dark', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 300, secondary: 190, accent: 350 },
    saturation: { factor: 1.0, strategy: 'adaptive' },
    lightness: { factor: 0.75, contrast: 0.95 },
    density: { level: 'compact', customScale: 0.9 },
    roundness: { level: 0.05, radius: 0 },
    contrast: { level: 'high', ratio: 0.95 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal', size: 15, lineHeight: 1.4 },
      secondary: { family: 'Inter, system-ui, sans-serif', weight: 500, style: 'normal' },
      mono: { family: 'JetBrains Mono, Consolas, monospace', weight: 400, style: 'normal' },
      display: { family: 'Inter, system-ui, sans-serif', weight: 700, style: 'normal' },
      code: { family: 'JetBrains Mono, Consolas, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 10, sm: 12, md: 14, lg: 16, xl: 22, '2xl': 28 },
    spacing: { space0: 0, space1: 2, space2: 4, space3: 6, space4: 8, space5: 10, space6: 12, space7: 16 }
  }
}

// ============================================================================
// 科技类主题集合
// ============================================================================

/**
 * 所有科技类主题列表
 */
export const TECH_THEMES: PresetTheme[] = [
  CYBER_NEON,
  MINIMAL_DARK,
  GEEK_BLUE,
  AI_GREEN,
  CODE_PURPLE,
  HIGH_TECH_RED,
  HACKER_ORANGE,
  BLOCKCHAIN_BLUE,
  ROBOT_GRAY,
  CYBERPUNK
]

/**
 * 获取科技类主题
 */
export function getTechThemes(): PresetTheme[] {
  return TECH_THEMES
}

/**
 * 根据ID获取科技类主题
 */
export function getTechThemeById(id: string): PresetTheme | undefined {
  return TECH_THEMES.find(theme => theme.id === id)
}
