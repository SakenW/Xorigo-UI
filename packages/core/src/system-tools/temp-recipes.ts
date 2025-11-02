/**
 * 临时配方导出 - 用于解决导入错误
 * TODO: 实现完整的七轴主题配方系统
 */

// 临时配方数据 - 匹配 StyleRecipe 类型
export const unifiedRecipes = [
  {
    id: 'professional-dark',
    name: 'Professional Dark',
    description: '深色专业主题，适合商务环境',
    mode: 'dark' as const,
    base: 'neutral-cool',
    accent: 'mono',
    tone: 'calm' as const,
    density: 'comfortable' as const,
    motion: 'subtle',
    surface: 'soft-shadow',
    category: 'professional',
    tags: ['professional', 'dark', 'business'],
    accessibility: {
      contrastLevel: 'AA' as const,
      cvdFriendly: true,
      motionSafe: true
    }
  },
  {
    id: 'creative-light',
    name: 'Creative Light',
    description: '明亮创意主题，激发创造力',
    mode: 'light' as const,
    base: 'neutral-warm',
    accent: 'analog',
    tone: 'vivid' as const,
    density: 'spacious' as const,
    motion: 'expressive',
    surface: 'elevated',
    category: 'creative',
    tags: ['creative', 'light', 'vibrant'],
    accessibility: {
      contrastLevel: 'AA' as const,
      cvdFriendly: true,
      motionSafe: false
    }
  },
  {
    id: 'minimal-light',
    name: 'Minimal Light',
    description: '极简浅色主题，专注内容',
    mode: 'light' as const,
    base: 'neutral-true',
    accent: 'mono',
    tone: 'calm' as const,
    density: 'compact' as const,
    motion: 'minimal',
    surface: 'flat',
    category: 'minimal',
    tags: ['minimal', 'light', 'clean'],
    accessibility: {
      contrastLevel: 'A' as const,
      cvdFriendly: true,
      motionSafe: true
    }
  },
  {
    id: 'ocean-deep',
    name: '深海探索',
    description: '深海蓝色主题，神秘而专业',
    mode: 'dark' as const,
    base: 'cool-ocean',
    accent: 'analog',
    tone: 'calm' as const,
    density: 'spacious' as const,
    motion: 'subtle',
    surface: 'glass',
    category: 'nature',
    tags: ['ocean', 'deep', 'blue', 'mysterious'],
    accessibility: {
      contrastLevel: 'AAA' as const,
      cvdFriendly: true,
      motionSafe: true
    }
  },
  {
    id: 'carnival-circus',
    name: '嘉年华马戏团',
    description: '充满活力的马戏团主题，色彩丰富',
    mode: 'light' as const,
    base: 'warm-sunset',
    accent: 'duo',
    tone: 'vivid' as const,
    density: 'comfortable' as const,
    motion: 'expressive',
    surface: 'neon',
    category: 'entertainment',
    tags: ['carnival', 'circus', 'colorful', 'fun'],
    accessibility: {
      contrastLevel: 'AA' as const,
      cvdFriendly: false,
      motionSafe: false
    }
  }
]

// 导出类型定义
export type StyleRecipe = typeof unifiedRecipes[0]