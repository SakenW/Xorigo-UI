'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// 主题配方接口定义
interface ThemeRecipe {
  id: string
  name: string
  description: string
  axes: {
    mode: 'light' | 'dark'
    base: { neutral: string; contrast: string }
    accent: { strategy: string; hues: string[] }
    tone: string
    density: string
    motion: { pack: string; curve: string }
    surface: string[]
  }
}

interface RecipeThemeSwitcherProps {
  className?: string
}

// 完整的50个主题配方数据（与独立页面保持一致）
const themeRecipes: Record<string, ThemeRecipe> = {
  // 专业商务类
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
    description: '深蓝色专业主题，适合高端商务场景',
    axes: {
      mode: 'dark',
      base: { neutral: 'deep', contrast: 'high' },
      accent: { strategy: 'triadic', hues: ['blue'] },
      tone: 'professional',
      density: 'comfortable',
      motion: { pack: 'smooth', curve: 'ease' },
      surface: ['glass', 'solid'],
    },
  },
  'high-contrast-pro': {
    id: 'high-contrast-pro',
    name: '高对比专业',
    description: '无障碍优化的高对比度主题',
    axes: {
      mode: 'light',
      base: { neutral: 'high-contrast', contrast: 'maximum' },
      accent: { strategy: 'complementary', hues: ['blue'] },
      tone: 'accessible',
      density: 'spacious',
      motion: { pack: 'minimal', curve: 'linear' },
      surface: ['solid'],
    },
  },
  'classic-neutral': {
    id: 'classic-neutral',
    name: '经典中性',
    description: '永恒的经典中性色调设计',
    axes: {
      mode: 'light',
      base: { neutral: 'warm', contrast: 'medium' },
      accent: { strategy: 'monochromatic', hues: ['gray'] },
      tone: 'classic',
      density: 'comfortable',
      motion: { pack: 'gentle', curve: 'ease' },
      surface: ['solid', 'texture'],
    },
  },

  // 创意设计类
  'creative-purple': {
    id: 'creative-purple',
    name: '创意紫',
    description: '激发创意的紫色主题，设计感十足',
    axes: {
      mode: 'light',
      base: { neutral: 'cool', contrast: 'medium' },
      accent: { strategy: 'analogous', hues: ['purple', 'pink'] },
      tone: 'creative',
      density: 'dynamic',
      motion: { pack: 'expressive', curve: 'bounce' },
      surface: ['glass', 'gradient'],
    },
  },
  'creative-aurora-dark': {
    id: 'creative-aurora-dark',
    name: '极光之夜',
    description: '神秘的北极光配色，充满想象力',
    axes: {
      mode: 'dark',
      base: { neutral: 'deep', contrast: 'high' },
      accent: { strategy: 'triadic', hues: ['purple', 'cyan', 'magenta'] },
      tone: 'mysterious',
      density: 'dynamic',
      motion: { pack: 'expressive', curve: 'elastic' },
      surface: ['glass', 'gradient', 'glow'],
    },
  },
  'art-vibrant': {
    id: 'art-vibrant',
    name: '艺术活力',
    description: '充满活力的艺术配色，大胆而鲜明',
    axes: {
      mode: 'light',
      base: { neutral: 'vivid', contrast: 'high' },
      accent: { strategy: 'complementary', hues: ['orange', 'blue'] },
      tone: 'energetic',
      density: 'compact',
      motion: { pack: 'dynamic', curve: 'spring' },
      surface: ['gradient', 'pattern'],
    },
  },
  'art-gallery-dark': {
    id: 'art-gallery-dark',
    name: '画廊暗调',
    description: '艺术画廊般的深沉优雅配色',
    axes: {
      mode: 'dark',
      base: { neutral: 'muted', contrast: 'medium' },
      accent: { strategy: 'analogous', hues: ['burgundy', 'purple'] },
      tone: 'sophisticated',
      density: 'comfortable',
      motion: { pack: 'gentle', curve: 'ease' },
      surface: ['texture', 'solid'],
    },
  },

  // 自然风光类
  'nature-green': {
    id: 'nature-green',
    name: '自然绿',
    description: '清新的森林绿色主题',
    axes: {
      mode: 'light',
      base: { neutral: 'organic', contrast: 'medium' },
      accent: { strategy: 'analogous', hues: ['green'] },
      tone: 'natural',
      density: 'comfortable',
      motion: { pack: 'gentle', curve: 'ease' },
      surface: ['organic', 'solid'],
    },
  },
  'nature-forest-dark': {
    id: 'nature-forest-dark',
    name: '森林暗夜',
    description: '深邃的森林夜晚配色',
    axes: {
      mode: 'dark',
      base: { neutral: 'deep', contrast: 'high' },
      accent: { strategy: 'monochromatic', hues: ['green'] },
      tone: 'mysterious',
      density: 'comfortable',
      motion: { pack: 'smooth', curve: 'ease' },
      surface: ['organic', 'texture'],
    },
  },
  'ocean-blue': {
    id: 'ocean-blue',
    name: '海洋蓝',
    description: '清澈的海洋蓝色调',
    axes: {
      mode: 'light',
      base: { neutral: 'cool', contrast: 'medium' },
      accent: { strategy: 'analogous', hues: ['blue', 'cyan'] },
      tone: 'serene',
      density: 'spacious',
      motion: { pack: 'smooth', curve: 'ease' },
      surface: ['glass', 'gradient'],
    },
  },
  'ocean-deep-dark': {
    id: 'ocean-deep-dark',
    name: '深海秘境',
    description: '神秘的深海配色方案',
    axes: {
      mode: 'dark',
      base: { neutral: 'deep', contrast: 'high' },
      accent: { strategy: 'triadic', hues: ['blue', 'teal', 'purple'] },
      tone: 'mysterious',
      density: 'comfortable',
      motion: { pack: 'gentle', curve: 'ease' },
      surface: ['gradient', 'glow'],
    },
  },
  'garden-floral': {
    id: 'garden-floral',
    name: '花园芬芳',
    description: '春日花园般的温馨色彩',
    axes: {
      mode: 'light',
      base: { neutral: 'warm', contrast: 'soft' },
      accent: { strategy: 'analogous', hues: ['pink', 'coral'] },
      tone: 'romantic',
      density: 'comfortable',
      motion: { pack: 'gentle', curve: 'ease' },
      surface: ['soft', 'gradient'],
    },
  },
  'garden-midnight': {
    id: 'garden-midnight',
    name: '午夜花园',
    description: '月光下的神秘花园氛围',
    axes: {
      mode: 'dark',
      base: { neutral: 'cool', contrast: 'medium' },
      accent: { strategy: 'analogous', hues: ['purple', 'blue'] },
      tone: 'enchanting',
      density: 'comfortable',
      motion: { pack: 'smooth', curve: 'ease' },
      surface: ['glass', 'glow'],
    },
  },

  // 科技未来类
  'tech-cyan': {
    id: 'tech-cyan',
    name: '科技青',
    description: '现代科技感的青色主题',
    axes: {
      mode: 'light',
      base: { neutral: 'cool', contrast: 'high' },
      accent: { strategy: 'complementary', hues: ['cyan'] },
      tone: 'technical',
      density: 'compact',
      motion: { pack: 'precise', curve: 'ease' },
      surface: ['glass', 'metallic'],
    },
  },
  'tech-neon-dark': {
    id: 'tech-neon-dark',
    name: '霓虹之夜',
    description: '赛博朋克风格的霓虹色彩',
    axes: {
      mode: 'dark',
      base: { neutral: 'dark', contrast: 'maximum' },
      accent: { strategy: 'complementary', hues: ['neon', 'magenta'] },
      tone: 'cyberpunk',
      density: 'compact',
      motion: { pack: 'dynamic', curve: 'elastic' },
      surface: ['glow', 'glass'],
    },
  },
  'future-chrome': {
    id: 'future-chrome',
    name: '未来铬',
    description: '金属质感的未来主义设计',
    axes: {
      mode: 'light',
      base: { neutral: 'metallic', contrast: 'high' },
      accent: { strategy: 'monochromatic', hues: ['silver'] },
      tone: 'futuristic',
      density: 'compact',
      motion: { pack: 'precise', curve: 'linear' },
      surface: ['metallic', 'glass'],
    },
  },
  'future-cyber-dark': {
    id: 'future-cyber-dark',
    name: '赛博暗黑',
    description: '暗黑科技风格的界面设计',
    axes: {
      mode: 'dark',
      base: { neutral: 'industrial', contrast: 'high' },
      accent: { strategy: 'triadic', hues: ['cyan', 'magenta', 'yellow'] },
      tone: 'industrial',
      density: 'compact',
      motion: { pack: 'dynamic', curve: 'spring' },
      surface: ['metallic', 'glow'],
    },
  },
  'space-cosmos': {
    id: 'space-cosmos',
    name: '宇宙星辰',
    description: '深邃宇宙的星空配色',
    axes: {
      mode: 'dark',
      base: { neutral: 'space', contrast: 'high' },
      accent: { strategy: 'analogous', hues: ['purple', 'blue'] },
      tone: 'cosmic',
      density: 'spacious',
      motion: { pack: 'gentle', curve: 'ease' },
      surface: ['gradient', 'glow'],
    },
  },
  'planet-mars': {
    id: 'planet-mars',
    name: '火星探索',
    description: '火星表面的红色调主题',
    axes: {
      mode: 'light',
      base: { neutral: 'warm', contrast: 'medium' },
      accent: { strategy: 'analogous', hues: ['red', 'orange'] },
      tone: 'adventurous',
      density: 'comfortable',
      motion: { pack: 'dynamic', curve: 'ease' },
      surface: ['texture', 'solid'],
    },
  },

  // 生活方式类
  'minimal-white': {
    id: 'minimal-white',
    name: '极简白',
    description: '纯净的极简主义设计',
    axes: {
      mode: 'light',
      base: { neutral: 'pure', contrast: 'medium' },
      accent: { strategy: 'monochromatic', hues: ['white'] },
      tone: 'minimal',
      density: 'spacious',
      motion: { pack: 'minimal', curve: 'linear' },
      surface: ['solid'],
    },
  },
  'minimal-graphite-dark': {
    id: 'minimal-graphite-dark',
    name: '石墨深灰',
    description: '优雅的深灰极简主题',
    axes: {
      mode: 'dark',
      base: { neutral: 'graphite', contrast: 'medium' },
      accent: { strategy: 'monochromatic', hues: ['gray'] },
      tone: 'minimal',
      density: 'spacious',
      motion: { pack: 'minimal', curve: 'linear' },
      surface: ['solid'],
    },
  },
  'warm-sunset': {
    id: 'warm-sunset',
    name: '温暖日落',
    description: '温馨的夕阳余晖色彩',
    axes: {
      mode: 'light',
      base: { neutral: 'warm', contrast: 'soft' },
      accent: { strategy: 'analogous', hues: ['orange', 'yellow'] },
      tone: 'cozy',
      density: 'comfortable',
      motion: { pack: 'gentle', curve: 'ease' },
      surface: ['gradient', 'soft'],
    },
  },
  'warm-fire-dark': {
    id: 'warm-fire-dark',
    name: '温暖炉火',
    description: '壁炉旁的温暖舒适氛围',
    axes: {
      mode: 'dark',
      base: { neutral: 'warm', contrast: 'medium' },
      accent: { strategy: 'analogous', hues: ['orange', 'red'] },
      tone: 'cozy',
      density: 'comfortable',
      motion: { pack: 'gentle', curve: 'ease' },
      surface: ['warm', 'glow'],
    },
  },
  'zen-garden': {
    id: 'zen-garden',
    name: '禅意花园',
    description: '宁静致远的东方禅意设计',
    axes: {
      mode: 'light',
      base: { neutral: 'natural', contrast: 'soft' },
      accent: { strategy: 'analogous', hues: ['green', 'brown'] },
      tone: 'serene',
      density: 'spacious',
      motion: { pack: 'gentle', curve: 'ease' },
      surface: ['organic', 'texture'],
    },
  },

  // 娱乐休闲类
  'circus-festival': {
    id: 'circus-festival',
    name: '马戏团',
    description: '欢乐的马戏团节日色彩',
    axes: {
      mode: 'light',
      base: { neutral: 'vibrant', contrast: 'high' },
      accent: { strategy: 'complementary', hues: ['red', 'yellow', 'blue'] },
      tone: 'festive',
      density: 'dynamic',
      motion: { pack: 'playful', curve: 'bounce' },
      surface: ['pattern', 'gradient'],
    },
  },
  'carnival-bright': {
    id: 'carnival-bright',
    name: '狂欢节',
    description: '热情洋溢的狂欢节配色',
    axes: {
      mode: 'light',
      base: { neutral: 'bright', contrast: 'high' },
      accent: { strategy: 'triadic', hues: ['yellow', 'magenta', 'cyan'] },
      tone: 'celebratory',
      density: 'dynamic',
      motion: { pack: 'energetic', curve: 'spring' },
      surface: ['gradient', 'pattern'],
    },
  },
  'disco-neon': {
    id: 'disco-neon',
    name: '迪斯科',
    description: '复古迪斯科的霓虹灯光',
    axes: {
      mode: 'dark',
      base: { neutral: 'dark', contrast: 'maximum' },
      accent: { strategy: 'complementary', hues: ['neon', 'pink', 'blue'] },
      tone: 'energetic',
      density: 'compact',
      motion: { pack: 'dynamic', curve: 'elastic' },
      surface: ['glow', 'gradient'],
    },
  },
  'party-confetti': {
    id: 'party-confetti',
    name: '派对彩纸',
    description: '生日派对的欢乐色彩',
    axes: {
      mode: 'light',
      base: { neutral: 'festive', contrast: 'high' },
      accent: { strategy: 'tetradic', hues: ['pink', 'blue', 'yellow', 'green'] },
      tone: 'joyful',
      density: 'dynamic',
      motion: { pack: 'playful', curve: 'bounce' },
      surface: ['pattern', 'gradient'],
    },
  },

  // 美食烹饪类
  'sweet-candy': {
    id: 'sweet-candy',
    name: '糖果屋',
    description: '甜蜜的糖果色彩世界',
    axes: {
      mode: 'light',
      base: { neutral: 'sweet', contrast: 'medium' },
      accent: { strategy: 'analogous', hues: ['pink', 'purple'] },
      tone: 'sweet',
      density: 'comfortable',
      motion: { pack: 'gentle', curve: 'ease' },
      surface: ['soft', 'gradient'],
    },
  },
  'coffee-shop': {
    id: 'coffee-shop',
    name: '咖啡厅',
    description: '温馨咖啡厅的浓郁色调',
    axes: {
      mode: 'light',
      base: { neutral: 'warm', contrast: 'medium' },
      accent: { strategy: 'analogous', hues: ['brown', 'cream'] },
      tone: 'cozy',
      density: 'comfortable',
      motion: { pack: 'gentle', curve: 'ease' },
      surface: ['warm', 'texture'],
    },
  },
  'fruit-fresh': {
    id: 'fruit-fresh',
    name: '新鲜水果',
    description: '清新的水果色彩搭配',
    axes: {
      mode: 'light',
      base: { neutral: 'fresh', contrast: 'medium' },
      accent: { strategy: 'complementary', hues: ['green', 'orange'] },
      tone: 'fresh',
      density: 'spacious',
      motion: { pack: 'gentle', curve: 'ease' },
      surface: ['fresh', 'gradient'],
    },
  },

  // 运动活力类
  'sport-energy': {
    id: 'sport-energy',
    name: '运动能量',
    description: '充满活力的运动主题',
    axes: {
      mode: 'light',
      base: { neutral: 'energetic', contrast: 'high' },
      accent: { strategy: 'complementary', hues: ['red', 'blue'] },
      tone: 'energetic',
      density: 'compact',
      motion: { pack: 'dynamic', curve: 'spring' },
      surface: ['bold', 'solid'],
    },
  },
  'fitness-green': {
    id: 'fitness-green',
    name: '健身绿',
    description: '健康生活的绿色主题',
    axes: {
      mode: 'light',
      base: { neutral: 'healthy', contrast: 'medium' },
      accent: { strategy: 'analogous', hues: ['green', 'lime'] },
      tone: 'healthy',
      density: 'comfortable',
      motion: { pack: 'energetic', curve: 'ease' },
      surface: ['fresh', 'solid'],
    },
  },

  // 文学艺术类
  'vintage-brown': {
    id: 'vintage-brown',
    name: '复古书页',
    description: '古老书籍的怀旧色调',
    axes: {
      mode: 'light',
      base: { neutral: 'aged', contrast: 'medium' },
      accent: { strategy: 'analogous', hues: ['brown', 'beige'] },
      tone: 'vintage',
      density: 'comfortable',
      motion: { pack: 'gentle', curve: 'ease' },
      surface: ['texture', 'aged'],
    },
  },
  'ink-wash': {
    id: 'ink-wash',
    name: '水墨画',
    description: '传统水墨画的意境色彩',
    axes: {
      mode: 'light',
      base: { neutral: 'ink', contrast: 'high' },
      accent: { strategy: 'monochromatic', hues: ['black', 'gray'] },
      tone: 'artistic',
      density: 'spacious',
      motion: { pack: 'gentle', curve: 'ease' },
      surface: ['wash', 'texture'],
    },
  },

  // 音乐节奏类
  'jazz-blue': {
    id: 'jazz-blue',
    name: '爵士蓝调',
    description: '爵士酒吧的优雅氛围',
    axes: {
      mode: 'dark',
      base: { neutral: 'sophisticated', contrast: 'medium' },
      accent: { strategy: 'analogous', hues: ['blue', 'purple'] },
      tone: 'sophisticated',
      density: 'comfortable',
      motion: { pack: 'smooth', curve: 'ease' },
      surface: ['warm', 'texture'],
    },
  },
  'rock-red': {
    id: 'rock-red',
    name: '摇滚红',
    description: '激情摇滚的强烈色彩',
    axes: {
      mode: 'light',
      base: { neutral: 'intense', contrast: 'high' },
      accent: { strategy: 'complementary', hues: ['red', 'black'] },
      tone: 'intense',
      density: 'compact',
      motion: { pack: 'dynamic', curve: 'elastic' },
      surface: ['bold', 'solid'],
    },
  },

  // 梦幻仙境类
  'fairy-pink': {
    id: 'fairy-pink',
    name: '仙女粉',
    description: '梦幻仙境的粉色世界',
    axes: {
      mode: 'light',
      base: { neutral: 'dreamy', contrast: 'soft' },
      accent: { strategy: 'analogous', hues: ['pink', 'lavender'] },
      tone: 'dreamy',
      density: 'spacious',
      motion: { pack: 'gentle', curve: 'ease' },
      surface: ['soft', 'glow'],
    },
  },
  'unicorn-rainbow': {
    id: 'unicorn-rainbow',
    name: '独角兽',
    description: '独角兽的彩虹梦幻世界',
    axes: {
      mode: 'light',
      base: { neutral: 'magical', contrast: 'medium' },
      accent: { strategy: 'rainbow', hues: ['red', 'orange', 'yellow', 'green', 'blue', 'purple'] },
      tone: 'magical',
      density: 'dynamic',
      motion: { pack: 'playful', curve: 'bounce' },
      surface: ['rainbow', 'glow'],
    },
  },

  // 科幻奇幻类
  'magic-purple': {
    id: 'magic-purple',
    name: '魔法紫',
    description: '神秘魔法的紫色力量',
    axes: {
      mode: 'dark',
      base: { neutral: 'mystical', contrast: 'high' },
      accent: { strategy: 'analogous', hues: ['purple', 'magenta'] },
      tone: 'mystical',
      density: 'comfortable',
      motion: { pack: 'mystical', curve: 'ease' },
      surface: ['glow', 'magical'],
    },
  },
  'dragon-fire': {
    id: 'dragon-fire',
    name: '龙之火',
    description: '传说中的龙之烈焰',
    axes: {
      mode: 'dark',
      base: { neutral: 'legendary', contrast: 'maximum' },
      accent: { strategy: 'analogous', hues: ['red', 'orange', 'yellow'] },
      tone: 'legendary',
      density: 'dynamic',
      motion: { pack: 'powerful', curve: 'elastic' },
      surface: ['fire', 'glow'],
    },
  }
}

// 系统化主题分类体系 - 完整的11分类
const themeCategories = {
  all: {
    name: '全部主题',
    description: '查看所有50个主题',
    themes: Object.keys(themeRecipes),
    icon: '🌈'
  },
  professional: {
    name: '专业商务',
    description: '适用于企业环境和专业场景',
    themes: ['corporate-blue', 'corporate-navy-dark', 'high-contrast-pro', 'classic-neutral'],
    icon: '💼'
  },
  creative: {
    name: '创意设计',
    description: '激发创意和设计灵感',
    themes: ['creative-purple', 'creative-aurora-dark', 'art-vibrant', 'art-gallery-dark'],
    icon: '🎨'
  },
  nature: {
    name: '自然风光',
    description: '来自大自然的配色灵感',
    themes: ['nature-green', 'nature-forest-dark', 'ocean-blue', 'ocean-deep-dark', 'garden-floral', 'garden-midnight'],
    icon: '🌿'
  },
  technology: {
    name: '科技未来',
    description: '现代科技感和未来主义',
    themes: ['tech-cyan', 'tech-neon-dark', 'future-chrome', 'future-cyber-dark', 'space-cosmos', 'planet-mars'],
    icon: '🚀'
  },
  lifestyle: {
    name: '生活方式',
    description: '日常生活和情感体验',
    themes: ['minimal-white', 'minimal-graphite-dark', 'warm-sunset', 'warm-fire-dark', 'zen-garden'],
    icon: '🏡'
  },
  entertainment: {
    name: '娱乐休闲',
    description: '欢乐时光和娱乐活动',
    themes: ['circus-festival', 'carnival-bright', 'disco-neon', 'party-confetti'],
    icon: '🎪'
  },
  food: {
    name: '美食烹饪',
    description: '诱人的美食色彩世界',
    themes: ['sweet-candy', 'coffee-shop', 'fruit-fresh'],
    icon: '🍰'
  },
  sports: {
    name: '运动活力',
    description: '充满动感的运动主题',
    themes: ['sport-energy', 'fitness-green'],
    icon: '⚽'
  },
  literature: {
    name: '文学艺术',
    description: '文艺气息和学术氛围',
    themes: ['vintage-brown', 'ink-wash'],
    icon: '📚'
  },
  music: {
    name: '音乐节奏',
    description: '音乐世界的韵律色彩',
    themes: ['jazz-blue', 'rock-red'],
    icon: '🎵'
  },
  fantasy: {
    name: '梦幻仙境',
    description: '魔法与童话的幻想世界',
    themes: ['fairy-pink', 'unicorn-rainbow', 'magic-purple', 'dragon-fire'],
    icon: '🦄'
  }
}

// 获取分类的辅助函数
const getCategoryInfo = (category: string) => {
  return themeCategories[category as keyof typeof themeCategories] || themeCategories.all
}

// 主题管理器 - 独立实现
class SimpleThemeManager {
  private currentTheme: string = 'corporate-blue'

  applyTheme(themeId: string): boolean {
    if (!themeRecipes[themeId]) {
      console.warn(`Theme ${themeId} not found`)
      return false
    }

    try {
      // 设置CSS变量来应用主题
      const root = document.documentElement
      const theme = themeRecipes[themeId]
      const colors = this.getThemePreviewColors(themeId)

      // 应用CSS变量
      root.style.setProperty('--theme-primary', colors.primary)
      root.style.setProperty('--theme-secondary', colors.secondary)
      root.style.setProperty('--theme-accent', colors.accent)
      root.style.setProperty('--theme-background', colors.background)
      root.style.setProperty('--theme-text', theme.axes.mode === 'dark' ? '#ffffff' : '#000000')

      // 保存到localStorage
      localStorage.setItem('xorigo-theme', themeId)
      this.currentTheme = themeId

      console.log(`✅ Applied theme: ${theme.name} (${themeId})`)
      return true
    } catch (error) {
      console.error(`❌ Failed to apply theme ${themeId}:`, error)
      return false
    }
  }

  getCurrentTheme(): string {
    return this.currentTheme
  }

  getAvailableThemes(): string[] {
    return Object.keys(themeRecipes)
  }

  getThemeInfo(themeId: string): ThemeRecipe | null {
    return themeRecipes[themeId] || null
  }

  restoreFromStorage(): string {
    try {
      const saved = localStorage.getItem('xorigo-theme')
      if (saved && themeRecipes[saved]) {
        this.currentTheme = saved
        this.applyTheme(saved)
        return saved
      }
    } catch (error) {
      console.warn('Failed to restore theme from storage:', error)
    }

    // 使用默认主题
    this.applyTheme('corporate-blue')
    return 'corporate-blue'
  }

  // 获取主题的预览颜色（基于配方生成简单的预览）
  getThemePreviewColors(themeId: string): { primary: string; secondary: string; accent: string; background: string } {
    const theme = themeRecipes[themeId]
    if (!theme) {
      return {
        primary: '#3b82f6',
        secondary: '#2563eb',
        accent: '#60a5fa',
        background: '#ffffff'
      }
    }

    // 基于配方轴生成简单的预览颜色
    const { mode, accent: accentAxis } = theme.axes

    // 根据主题模式生成基础颜色
    const isDark = mode === 'dark'
    const background = isDark ? '#0f172a' : '#ffffff'

    // 根据强调色轴生成主色调
    const primaryHue = accentAxis?.hues?.[0] || 'blue'
    const hueMap: Record<string, string> = {
      blue: '#3b82f6',
      purple: '#a855f7',
      green: '#10b981',
      red: '#ef4444',
      orange: '#f97316',
      yellow: '#eab308',
      cyan: '#06b6d4',
      pink: '#ec4899',
      lime: '#84cc16',
      teal: '#14b8a6',
      magenta: '#d946ef',
      neon: '#00ff00'
    }

    const primary = hueMap[primaryHue] || '#3b82f6'
    const secondary = this.adjustColor(primary, -20)
    const accent = this.adjustColor(primary, 20)

    return { primary, secondary, accent, background }
  }

  private adjustColor(color: string, amount: number): string {
    // 简单的颜色调整函数
    const hex = color.replace('#', '')
    const num = parseInt(hex, 16)
    const r = Math.max(0, Math.min(255, (num >> 16) + amount))
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount))
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount))
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
  }
}

const themeManager = new SimpleThemeManager()

export function RecipeThemeSwitcher({ className = '' }: RecipeThemeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentTheme, setCurrentTheme] = useState('')
  const [currentCategory, setCurrentCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // 初始化主题
  useEffect(() => {
    // 从存储恢复或使用默认主题
    const savedTheme = themeManager.restoreFromStorage()
    setCurrentTheme(savedTheme)
  }, [])

  // 应用主题
  const applyTheme = (themeId: string) => {
    if (themeManager.applyTheme(themeId)) {
      setCurrentTheme(themeId)
      setIsOpen(false)
    }
  }

  // 过滤主题
  const filteredThemes = Object.keys(themeRecipes).filter(themeId => {
    const theme = themeRecipes[themeId]
    const matchesCategory = currentCategory === 'all' ||
      getCategoryInfo(currentCategory).themes.includes(themeId)
    const matchesSearch = theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      theme.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSearch
  })

  return (
    <div className={`relative ${className}`}>
      {/* 主题切换按钮 */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
      >
        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {currentTheme ? themeRecipes[currentTheme]?.name || '主题' : '选择主题'}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.button>

      {/* 主题选择面板 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-96 max-h-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-[60] overflow-hidden"
          >
            {/* 搜索框 */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="搜索主题..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* 分类过滤 */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-2">
                {Object.entries(themeCategories).map(([categoryId, category]) => (
                  <button
                    key={categoryId}
                    onClick={() => setCurrentCategory(categoryId)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors duration-200 ${
                      currentCategory === categoryId
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {category.icon} {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 主题列表 */}
            <div className="max-h-64 overflow-y-auto">
              <div className="p-2 space-y-1">
                {filteredThemes.map((themeId) => {
                  const theme = themeRecipes[themeId]
                  const colors = themeManager.getThemePreviewColors(themeId)
                  const isActive = currentTheme === themeId

                  return (
                    <motion.button
                      key={themeId}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => applyTheme(themeId)}
                      className={`w-full p-3 rounded-lg border transition-all duration-200 ${
                        isActive
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* 颜色预览 */}
                        <div className="flex gap-1">
                          <div
                            className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600"
                            style={{ backgroundColor: colors.primary }}
                          />
                          <div
                            className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600"
                            style={{ backgroundColor: colors.secondary }}
                          />
                          <div
                            className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600"
                            style={{ backgroundColor: colors.accent }}
                          />
                        </div>

                        {/* 主题信息 */}
                        <div className="flex-1 text-left">
                          <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                            {theme.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {theme.description}
                          </div>
                        </div>

                        {/* 选中状态 */}
                        {isActive && (
                          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* 底部信息 */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                {filteredThemes.length} 个主题 • 基于 Xorigo UI 令牌系统
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 点击外部关闭 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default RecipeThemeSwitcher