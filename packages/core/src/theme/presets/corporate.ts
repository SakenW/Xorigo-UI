/**
 * 🏢 企业级主题预设 - 10个专业商务主题
 *
 * 适用于企业环境、商务应用、管理后台等正式场景
 * 特点：专业、稳重、可信赖
 */

import type { PresetTheme, TwentySixParams } from '../advanced/twenty-six-params'

// ============================================================================
// 企业专业类主题定义
// ============================================================================

/**
 * 企业蓝 - 专业商务标准主题
 */
export const CORPORATE_BLUE: PresetTheme = {
  id: 'corporate-blue',
  name: '企业蓝',
  description: '专业商务风格，适用于企业环境和正式场景',
  category: '企业级',
  tags: ['professional', 'corporate', 'blue', 'business'],
  author: 'Xorigo UI Team',
  rating: 4.8,
  downloads: 15420,
  isPopular: true,
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-12-01'),

  parameters: {
    mode: { mode: 'light', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 240, secondary: 260, accent: 200 },
    saturation: { factor: 0.6, strategy: 'uniform' },
    lightness: { factor: 1.0, contrast: 0.5 },
    density: { level: 'comfortable', customScale: 1.0 },
    roundness: { level: 0.3, radius: 4 },
    contrast: { level: 'normal', ratio: 0.5 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal', size: 16, lineHeight: 1.5 },
      secondary: { family: 'Inter, system-ui, sans-serif', weight: 500, style: 'normal' },
      mono: { family: 'JetBrains Mono, Consolas, monospace', weight: 400, style: 'normal' },
      display: { family: 'Inter, system-ui, sans-serif', weight: 700, style: 'normal' },
      code: { family: 'JetBrains Mono, Consolas, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 12, sm: 14, md: 16, lg: 18, xl: 24, '2xl': 30 },
    spacing: { space0: 0, space1: 4, space2: 8, space3: 12, space4: 16, space5: 20, space6: 24, space7: 32 }
  }
}

/**
 * 深色专业 - 深色企业主题
 */
export const DARK_PROFESSIONAL: PresetTheme = {
  id: 'dark-professional',
  name: '深色专业',
  description: '深色主题的专业变体，护眼且现代',
  category: '企业级',
  tags: ['dark', 'professional', 'modern', 'blue'],
  author: 'Xorigo UI Team',
  rating: 4.7,
  downloads: 12850,
  isPopular: true,
  createdAt: new Date('2024-02-01'),
  updatedAt: new Date('2024-11-20'),

  parameters: {
    mode: { mode: 'dark', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 220, secondary: 260, accent: 180 },
    saturation: { factor: 0.5, strategy: 'uniform' },
    lightness: { factor: 0.9, contrast: 0.6 },
    density: { level: 'comfortable', customScale: 1.0 },
    roundness: { level: 0.4, radius: 6 },
    contrast: { level: 'high', ratio: 0.7 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal', size: 16, lineHeight: 1.5 },
      secondary: { family: 'Inter, system-ui, sans-serif', weight: 500, style: 'normal' },
      mono: { family: 'JetBrains Mono, Consolas, monospace', weight: 400, style: 'normal' },
      display: { family: 'Inter, system-ui, sans-serif', weight: 700, style: 'normal' },
      code: { family: 'JetBrains Mono, Consolas, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 12, sm: 14, md: 16, lg: 18, xl: 24, '2xl': 30 },
    spacing: { space0: 0, space1: 4, space2: 8, space3: 12, space4: 16, space5: 20, space6: 24, space7: 32 }
  }
}

/**
 * 企业灰 - 经典商务风格
 */
export const CORPORATE_GRAY: PresetTheme = {
  id: 'corporate-gray',
  name: '企业灰',
  description: '经典商务灰主题，简洁专业',
  category: '企业级',
  tags: ['corporate', 'gray', 'classic', 'business'],
  author: 'Xorigo UI Team',
  rating: 4.6,
  downloads: 10240,
  createdAt: new Date('2024-02-15'),
  updatedAt: new Date('2024-11-10'),

  parameters: {
    mode: { mode: 'light', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 0, secondary: 0, accent: 0 },
    saturation: { factor: 0.0, strategy: 'uniform' },
    lightness: { factor: 1.05, contrast: 0.6 },
    density: { level: 'comfortable', customScale: 1.0 },
    roundness: { level: 0.2, radius: 2 },
    contrast: { level: 'normal', ratio: 0.55 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal', size: 16, lineHeight: 1.5 },
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
 * 企业深蓝 - 稳重专业
 */
export const CORPORATE_NAVY: PresetTheme = {
  id: 'corporate-navy',
  name: '企业深蓝',
  description: '深海蓝主题，展现稳重专业形象',
  category: '企业级',
  tags: ['corporate', 'navy', 'professional', 'stable'],
  author: 'Xorigo UI Team',
  rating: 4.7,
  downloads: 8960,
  createdAt: new Date('2024-03-01'),
  updatedAt: new Date('2024-11-05'),

  parameters: {
    mode: { mode: 'light', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 220, secondary: 210, accent: 200 },
    saturation: { factor: 0.55, strategy: 'uniform' },
    lightness: { factor: 0.95, contrast: 0.6 },
    density: { level: 'comfortable', customScale: 1.0 },
    roundness: { level: 0.25, radius: 3 },
    contrast: { level: 'normal', ratio: 0.6 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal', size: 16, lineHeight: 1.5 },
      secondary: { family: 'Inter, system-ui, sans-serif', weight: 500, style: 'normal' },
      mono: { family: 'JetBrains Mono, Consolas, monospace', weight: 400, style: 'normal' },
      display: { family: 'Inter, system-ui, sans-serif', weight: 700, style: 'normal' },
      code: { family: 'JetBrains Mono, Consolas, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 12, sm: 14, md: 16, lg: 18, xl: 24, '2xl': 30 },
    spacing: { space0: 0, space1: 4, space2: 8, space3: 12, space4: 16, space5: 20, space6: 24, space7: 32 }
  }
}

/**
 * 金融绿 - 金融行业专用
 */
export const FINANCE_GREEN: PresetTheme = {
  id: 'finance-green',
  name: '金融绿',
  description: '金融行业专业主题，绿色象征稳定增长',
  category: '企业级',
  tags: ['finance', 'green', 'professional', 'banking'],
  author: 'Xorigo UI Team',
  rating: 4.6,
  downloads: 7430,
  createdAt: new Date('2024-03-10'),
  updatedAt: new Date('2024-10-28'),

  parameters: {
    mode: { mode: 'light', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 145, secondary: 140, accent: 120 },
    saturation: { factor: 0.6, strategy: 'uniform' },
    lightness: { factor: 1.0, contrast: 0.55 },
    density: { level: 'comfortable', customScale: 1.0 },
    roundness: { level: 0.3, radius: 4 },
    contrast: { level: 'normal', ratio: 0.55 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal', size: 16, lineHeight: 1.5 },
      secondary: { family: 'Inter, system-ui, sans-serif', weight: 500, style: 'normal' },
      mono: { family: 'JetBrains Mono, Consolas, monospace', weight: 400, style: 'normal' },
      display: { family: 'Inter, system-ui, sans-serif', weight: 700, style: 'normal' },
      code: { family: 'JetBrains Mono, Consolas, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 12, sm: 14, md: 16, lg: 18, xl: 24, '2xl': 30 },
    spacing: { space0: 0, space1: 4, space2: 8, space3: 12, space4: 16, space5: 20, space6: 24, space7: 32 }
  }
}

/**
 * 法律紫 - 法律行业专用
 */
export const LEGAL_PURPLE: PresetTheme = {
  id: 'legal-purple',
  name: '法律紫',
  description: '法律行业权威主题，紫色体现庄重感',
  category: '企业级',
  tags: ['legal', 'purple', 'authority', 'law'],
  author: 'Xorigo UI Team',
  rating: 4.5,
  downloads: 5890,
  createdAt: new Date('2024-03-20'),
  updatedAt: new Date('2024-10-20'),

  parameters: {
    mode: { mode: 'light', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 270, secondary: 280, accent: 290 },
    saturation: { factor: 0.55, strategy: 'uniform' },
    lightness: { factor: 0.98, contrast: 0.6 },
    density: { level: 'comfortable', customScale: 1.0 },
    roundness: { level: 0.25, radius: 3 },
    contrast: { level: 'normal', ratio: 0.6 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal', size: 16, lineHeight: 1.5 },
      secondary: { family: 'Inter, system-ui, sans-serif', weight: 500, style: 'normal' },
      mono: { family: 'JetBrains Mono, Consolas, monospace', weight: 400, style: 'normal' },
      display: { family: 'Inter, system-ui, sans-serif', weight: 700, style: 'normal' },
      code: { family: 'JetBrains Mono, Consolas, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 12, sm: 14, md: 16, lg: 18, xl: 24, '2xl': 30 },
    spacing: { space0: 0, space1: 4, space2: 8, space3: 12, space4: 16, space5: 20, space6: 24, space7: 32 }
  }
}

/**
 * 医疗蓝 - 医疗行业专用
 */
export const MEDICAL_BLUE: PresetTheme = {
  id: 'medical-blue',
  name: '医疗蓝',
  description: '医疗行业专用主题，蓝色传达专业与信任',
  category: '企业级',
  tags: ['medical', 'blue', 'healthcare', 'trust'],
  author: 'Xorigo UI Team',
  rating: 4.7,
  downloads: 6720,
  createdAt: new Date('2024-04-01'),
  updatedAt: new Date('2024-11-01'),

  parameters: {
    mode: { mode: 'light', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 195, secondary: 200, accent: 205 },
    saturation: { factor: 0.5, strategy: 'uniform' },
    lightness: { factor: 1.02, contrast: 0.55 },
    density: { level: 'comfortable', customScale: 1.0 },
    roundness: { level: 0.4, radius: 6 },
    contrast: { level: 'normal', ratio: 0.55 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal', size: 16, lineHeight: 1.5 },
      secondary: { family: 'Inter, system-ui, sans-serif', weight: 500, style: 'normal' },
      mono: { family: 'JetBrains Mono, Consolas, monospace', weight: 400, style: 'normal' },
      display: { family: 'Inter, system-ui, sans-serif', weight: 700, style: 'normal' },
      code: { family: 'JetBrains Mono, Consolas, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 12, sm: 14, md: 16, lg: 18, xl: 24, '2xl': 30 },
    spacing: { space0: 0, space1: 4, space2: 8, space3: 12, space4: 16, space5: 20, space6: 24, space7: 32 }
  }
}

/**
 * 房地产金 - 房地产行业专用
 */
export const REAL_ESTATE_GOLD: PresetTheme = {
  id: 'real-estate-gold',
  name: '房地产金',
  description: '房地产行业主题，金色彰显品质与价值',
  category: '企业级',
  tags: ['real-estate', 'gold', 'premium', 'luxury'],
  author: 'Xorigo UI Team',
  rating: 4.6,
  downloads: 5340,
  createdAt: new Date('2024-04-10'),
  updatedAt: new Date('2024-10-25'),

  parameters: {
    mode: { mode: 'light', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 45, secondary: 40, accent: 50 },
    saturation: { factor: 0.65, strategy: 'uniform' },
    lightness: { factor: 1.0, contrast: 0.6 },
    density: { level: 'comfortable', customScale: 1.0 },
    roundness: { level: 0.35, radius: 5 },
    contrast: { level: 'normal', ratio: 0.55 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal', size: 16, lineHeight: 1.5 },
      secondary: { family: 'Inter, system-ui, sans-serif', weight: 500, style: 'normal' },
      mono: { family: 'JetBrains Mono, Consolas, monospace', weight: 400, style: 'normal' },
      display: { family: 'Inter, system-ui, sans-serif', weight: 700, style: 'normal' },
      code: { family: 'JetBrains Mono, Consolas, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 12, sm: 14, md: 16, lg: 18, xl: 24, '2xl': 30 },
    spacing: { space0: 0, space1: 4, space2: 8, space3: 12, space4: 16, space5: 20, space6: 24, space7: 32 }
  }
}

/**
 * 企业深灰 - 高级商务风格
 */
export const EXECUTIVE_SLATE: PresetTheme = {
  id: 'executive-slate',
  name: '企业深灰',
  description: '高管级别主题，深灰体现权威与专业',
  category: '企业级',
  tags: ['executive', 'slate', 'authority', 'premium'],
  author: 'Xorigo UI Team',
  rating: 4.8,
  downloads: 7890,
  createdAt: new Date('2024-04-20'),
  updatedAt: new Date('2024-11-15'),

  parameters: {
    mode: { mode: 'light', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 210, secondary: 220, accent: 230 },
    saturation: { factor: 0.15, strategy: 'uniform' },
    lightness: { factor: 0.98, contrast: 0.7 },
    density: { level: 'spacious', customScale: 1.1 },
    roundness: { level: 0.2, radius: 2 },
    contrast: { level: 'high', ratio: 0.75 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 300, style: 'normal', size: 17, lineHeight: 1.6 },
      secondary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal' },
      mono: { family: 'JetBrains Mono, Consolas, monospace', weight: 400, style: 'normal' },
      display: { family: 'Inter, system-ui, sans-serif', weight: 600, style: 'normal' },
      code: { family: 'JetBrains Mono, Consolas, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 13, sm: 15, md: 17, lg: 19, xl: 25, '2xl': 32 },
    spacing: { space0: 0, space1: 5, space2: 10, space3: 15, space4: 20, space5: 25, space6: 30, space7: 40 }
  }
}

/**
 * 企业暗色 - 夜间模式专用
 */
export const CORPORATE_DARK: PresetTheme = {
  id: 'corporate-dark',
  name: '企业暗色',
  description: '企业级暗色主题，适合长时间工作',
  category: '企业级',
  tags: ['corporate', 'dark', 'night', 'productivity'],
  author: 'Xorigo UI Team',
  rating: 4.7,
  downloads: 9240,
  createdAt: new Date('2024-05-01'),
  updatedAt: new Date('2024-11-20'),

  parameters: {
    mode: { mode: 'dark', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 215, secondary: 225, accent: 235 },
    saturation: { factor: 0.25, strategy: 'uniform' },
    lightness: { factor: 0.85, contrast: 0.75 },
    density: { level: 'comfortable', customScale: 1.0 },
    roundness: { level: 0.3, radius: 4 },
    contrast: { level: 'high', ratio: 0.8 },
    fonts: {
      primary: { family: 'Inter, system-ui, sans-serif', weight: 400, style: 'normal', size: 16, lineHeight: 1.5 },
      secondary: { family: 'Inter, system-ui, sans-serif', weight: 500, style: 'normal' },
      mono: { family: 'JetBrains Mono, Consolas, monospace', weight: 400, style: 'normal' },
      display: { family: 'Inter, system-ui, sans-serif', weight: 700, style: 'normal' },
      code: { family: 'JetBrains Mono, Consolas, monospace', weight: 500, style: 'normal' }
    },
    sizes: { xs: 12, sm: 14, md: 16, lg: 18, xl: 24, '2xl': 30 },
    spacing: { space0: 0, space1: 4, space2: 8, space3: 12, space4: 16, space5: 20, space6: 24, space7: 32 }
  }
}

// ============================================================================
// 企业级主题集合
// ============================================================================

/**
 * 所有企业级主题列表
 */
export const CORPORATE_THEMES: PresetTheme[] = [
  CORPORATE_BLUE,
  DARK_PROFESSIONAL,
  CORPORATE_GRAY,
  CORPORATE_NAVY,
  FINANCE_GREEN,
  LEGAL_PURPLE,
  MEDICAL_BLUE,
  REAL_ESTATE_GOLD,
  EXECUTIVE_SLATE,
  CORPORATE_DARK
]

/**
 * 获取企业级主题
 */
export function getCorporateThemes(): PresetTheme[] {
  return CORPORATE_THEMES
}

/**
 * 根据ID获取企业级主题
 */
export function getCorporateThemeById(id: string): PresetTheme | undefined {
  return CORPORATE_THEMES.find(theme => theme.id === id)
}
