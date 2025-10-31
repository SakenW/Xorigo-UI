/**
 * 临时配方导出 - 用于解决导入错误
 * TODO: 实现完整的七轴主题配方系统
 */

// 临时配方数据
export const unifiedRecipes = [
  {
    id: 'professional-dark',
    name: 'Professional Dark',
    description: '深色专业主题，适合商务环境',
    mode: 'dark',
    hue: 'blue',
    saturation: 0.8,
    lightness: 0.2,
    density: 'comfortable',
    roundness: 0.1,
    contrast: 'high',
    colors: ['#1e293b', '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0', '#f1f5f9'],
    tags: ['professional', 'dark', 'business']
  },
  {
    id: 'creative-light',
    name: 'Creative Light',
    description: '明亮创意主题，激发创造力',
    mode: 'light',
    hue: 'purple',
    saturation: 0.9,
    lightness: 0.7,
    density: 'spacious',
    roundness: 0.3,
    contrast: 'medium',
    colors: ['#faf5ff', '#f3e8ff', '#e9d5ff', '#d8b4fe', '#c084fc', '#a855f7', '#9333ea', '#7e22ce'],
    tags: ['creative', 'light', 'vibrant']
  },
  {
    id: 'minimal-light',
    name: 'Minimal Light',
    description: '极简浅色主题，专注内容',
    mode: 'light',
    hue: 'gray',
    saturation: 0.2,
    lightness: 0.9,
    density: 'compact',
    roundness: 0.0,
    contrast: 'low',
    colors: ['#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b', '#475569'],
    tags: ['minimal', 'light', 'clean']
  }
]