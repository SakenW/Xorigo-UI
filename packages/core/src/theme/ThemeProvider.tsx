'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { motion } from 'framer-motion'
import { getCoreTokens, type DTCGCoreTokens } from '@xorigo-ui/tokens'
import {
  colorPalettes,
  type ColorPalette,
  getPaletteById,
  getRandomPalette,
} from './palettes'

// 主题配置接口
export interface ThemeConfig {
  name: string
  colors: Record<string, Record<string, string>> // 使用通用的颜色对象类型
  gradient: string
  glow: string
  palette: ColorPalette
  category: 'classic' | 'modern' | 'nature' | 'elegant' | 'playful'
  mood: string[]
}

// 临时的颜色令牌，用于向后兼容
const colorTokens = {
  primary: { 50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 300: '#7dd3fc', 400: '#38bdf8', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a', 950: '#172554' },
  secondary: { 50: '#faf5ff', 100: '#f3e8ff', 200: '#e9d5ff', 300: '#d8b4fe', 400: '#c084fc', 500: '#a855f7', 600: '#9333ea', 700: '#7c3aed', 800: '#6b21a8', 900: '#581c87', 950: '#3b0764' },
  warning: { 50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309', 800: '#92400e', 900: '#78350f', 950: '#451a03' },
  success: { 50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d', 950: '#052e16' },
  error: { 50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5', 400: '#f87171', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c', 800: '#991b1b', 900: '#7f1d1d', 950: '#450a0a' },
  info: { 50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 300: '#7dd3fc', 400: '#38bdf8', 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1', 800: '#075985', 900: '#0c4a6e', 950: '#082f49' },
  gray: { 50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151', 800: '#1f2937', 900: '#111827', 950: '#030712' },
}

// 基于配色方案的主题配置
export const themeConfigs: Record<string, ThemeConfig> = {
  // 经典主题
  light: {
    name: '亮色主题',
    colors: colorTokens.primary,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    glow: 'rgba(14, 165, 233, 0.3)',
    palette: colorPalettes[0],
    category: 'classic',
    mood: ['清新'],
  },
  dark: {
    name: '暗色主题',
    colors: colorTokens.secondary,
    gradient: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    glow: 'rgba(168, 85, 247, 0.4)',
    palette: colorPalettes[0],
    category: 'classic',
    mood: ['专注'],
  },

  // 现代主题
  'cyber-blue-purple': {
    name: '赛博蓝紫',
    colors: colorTokens.primary,
    gradient: colorPalettes[0].gradient.primary,
    glow: colorPalettes[0].glow.primary,
    palette: colorPalettes[0],
    category: 'modern',
    mood: ['现代', '科技'],
  },
  'warm-sunrise': {
    name: '温暖晨曦',
    colors: colorTokens.warning,
    gradient: colorPalettes[1].gradient.primary,
    glow: colorPalettes[1].glow.primary,
    palette: colorPalettes[1],
    category: 'modern',
    mood: ['温暖', '活力'],
  },

  // 浪漫主题
  'pink-romance': {
    name: '粉彩浪漫',
    colors: { ...colorTokens.secondary, 500: '#ec4899' },
    gradient: colorPalettes[2].gradient.primary,
    glow: colorPalettes[2].glow.primary,
    palette: colorPalettes[2],
    category: 'playful',
    mood: ['浪漫', '温柔'],
  },

  // 自然主题
  'forest-nature': {
    name: '自然森林',
    colors: colorTokens.success,
    gradient: colorPalettes[3].gradient.primary,
    glow: colorPalettes[3].glow.primary,
    palette: colorPalettes[3],
    category: 'nature',
    mood: ['自然', '清新'],
  },
  'deep-ocean': {
    name: '深海秘境',
    colors: { ...colorTokens.primary, 500: '#0284c7' },
    gradient: colorPalettes[4].gradient.primary,
    glow: colorPalettes[4].glow.primary,
    palette: colorPalettes[4],
    category: 'nature',
    mood: ['深邃', '神秘'],
  },

  // 优雅主题
  'royal-violet': {
    name: '高贵紫罗兰',
    colors: { ...colorTokens.secondary, 500: '#7c3aed' },
    gradient: colorPalettes[5].gradient.primary,
    glow: colorPalettes[5].glow.primary,
    palette: colorPalettes[5],
    category: 'elegant',
    mood: ['高贵', '优雅'],
  },
  'minimal-black-white': {
    name: '极简黑白',
    colors: { ...colorTokens.gray, 500: '#6b7280' },
    gradient: colorPalettes[6].gradient.primary,
    glow: colorPalettes[6].glow.primary,
    palette: colorPalettes[6],
    category: 'elegant',
    mood: ['极简', '专业'],
  },

  // 活泼主题
  'vibrant-lemon': {
    name: '活力柠檬',
    colors: colorTokens.warning,
    gradient: colorPalettes[7].gradient.primary,
    glow: colorPalettes[7].glow.primary,
    palette: colorPalettes[7],
    category: 'playful',
    mood: ['活力', '创意'],
  },
  'dreamy-rainbow': {
    name: '梦幻彩虹',
    colors: { ...colorTokens.primary, 500: '#8b5cf6' },
    gradient: colorPalettes[8].gradient.primary,
    glow: colorPalettes[8].glow.primary,
    palette: colorPalettes[8],
    category: 'playful',
    mood: ['梦幻', '创意'],
  },
  'carnival-circus': {
    name: '嘉年华马戏团',
    colors: { ...colorTokens.warning, 500: '#f59e0b' },
    gradient: colorPalettes[9].gradient.primary,
    glow: colorPalettes[9].glow.primary,
    palette: colorPalettes[9],
    category: 'playful',
    mood: ['欢乐', '活泼'],
  },
}

// 主题上下文类型
export interface ThemeContextType {
  currentTheme: string
  setTheme: (theme: string) => void
  themeConfig: ThemeConfig
  isTransitioning: boolean
  availableThemes: string[]
  categories: string[]
  currentCategory: string
  setThemeByCategory: (category: string) => void
  setRandomTheme: () => void
  searchThemes: (query: string) => string[]
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// 主题切换动画
const themeTransition = {
  initial: { opacity: 0, scale: 0.95, filter: 'blur(4px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, scale: 1.05, filter: 'blur(4px)' },
  transition: {
    duration: 0.4,
    ease: [0.4, 0, 0.2, 1] as const, // 使用 as const 断言为字面量类型
  },
}

// 主题提供者组件
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState('cyber-blue-purple')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // 从localStorage读取保存的主题
    const savedTheme =
      localStorage.getItem('th-ui-theme') || 'cyber-blue-purple'
    setCurrentTheme(savedTheme)
  }, [])

  const setTheme = (theme: string) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentTheme(theme)
      localStorage.setItem('th-ui-theme', theme)
      setTimeout(() => setIsTransitioning(false), 50)
    }, 150)
  }

  // 配色方案相关功能
  const availableThemes = Object.keys(themeConfigs)
  const categories = Array.from(
    new Set(Object.values(themeConfigs).map((config) => config.category))
  )
  const currentCategory = themeConfigs[currentTheme]?.category || 'modern'

  const setThemeByCategory = (category: string) => {
    const themesInCategory = Object.entries(themeConfigs)
      .filter(([_, config]) => config.category === category)
      .map(([key]) => key)

    if (themesInCategory.length > 0) {
      const randomTheme =
        themesInCategory[Math.floor(Math.random() * themesInCategory.length)]
      setTheme(randomTheme)
    }
  }

  const setRandomTheme = () => {
    const randomTheme =
      availableThemes[Math.floor(Math.random() * availableThemes.length)]
    setTheme(randomTheme)
  }

  const searchThemes = (query: string): string[] => {
    const lowercaseQuery = query.toLowerCase()
    return Object.entries(themeConfigs)
      .filter(
        ([_, config]) =>
          config.name.toLowerCase().includes(lowercaseQuery) ||
          config.mood.some((mood) =>
            mood.toLowerCase().includes(lowercaseQuery)
          ) ||
          config.category.toLowerCase().includes(lowercaseQuery)
      )
      .map(([key]) => key)
  }

  const themeConfig =
    themeConfigs[currentTheme] || themeConfigs['cyber-blue-purple']

  if (!mounted) {
    return null // 避免SSR不匹配
  }

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme,
        themeConfig,
        isTransitioning,
        availableThemes,
        categories,
        currentCategory,
        setThemeByCategory,
        setRandomTheme,
        searchThemes,
      }}
    >
      <motion.div
        key={currentTheme}
        {...themeTransition}
        className="min-h-screen"
        style={
          {
            '--theme-primary': themeConfig.colors?.[500] || '#3b82f6',
            '--theme-secondary': themeConfig.colors?.[600] || '#2563eb',
            '--theme-accent': themeConfig.colors?.[400] || '#60a5fa',
            '--theme-gradient': themeConfig.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '--theme-glow': themeConfig.glow || 'rgba(59, 130, 246, 0.4)',
          } as React.CSSProperties
        }
      >
        {children}
      </motion.div>
    </ThemeContext.Provider>
  )
}

// 主题Hook
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// 导出类型和配置
export type { ColorPalette }
export { colorPalettes, getPaletteById, getRandomPalette }
