'use client'

import { useState, useCallback, useMemo } from 'react'
import { useStyleRecipe, officialRecipes } from '../index'
import type { StyleRecipeID, ModeAxis, ToneAxis, DensityAxis, MotionAxis, SurfaceAxis } from '../types'

// ============================================================================
// 类型定义 (Type Definitions)
// ============================================================================

interface QuickConfig {
  id: string
  name: string
  description: string
  tags: string[]
  values: {
    mode?: ModeAxis
    tone?: ToneAxis
    density?: DensityAxis
    motionIntensity?: string
    motionCurve?: string
    surface?: SurfaceAxis
    // 固定某些轴的专业配置
    fixedAxes?: {
      base?: { color: string; contrast: string }
      accent?: { strategy: string; hue: string }
    }
  }
}

interface ThemeSystemOptions {
  autoApply?: boolean
  enableSmartConstraints?: boolean
}

interface UseThemeSystemReturn {
  // 预设配方
  presetRecipes: Array<{
    id: string
    name: string
    category: string
    description: string
    recipeId: StyleRecipeID
  }>

  // 快速配置
  quickConfigs: QuickConfig[]

  // 当前状态
  currentMode: 'preset' | 'quick' | 'custom'
  currentPreset?: string
  currentQuickConfig?: string

  // 应用预设
  applyPreset: (recipeId: string) => Promise<boolean>

  // 应用快速配置
  applyQuickConfig: (configId: string) => Promise<boolean>

  // 自定义编辑器
  customValues: {
    mode: ModeAxis
    baseColor: string
    contrastLevel: string
    accentStrategy: string
    accentHue: string
    tone: ToneAxis
    density: DensityAxis
    motionIntensity: string
    motionCurve: string
    surface: string
  }
  updateCustomAxis: (axis: string, value: string) => void
  applyCustomTheme: () => Promise<boolean>

  // 智能推荐
  getRecommendedPresets: (context?: {
    usage?: 'professional' | 'creative' | 'casual' | 'accessibility'
    timeOfDay?: 'day' | 'night'
    userPreference?: 'minimal' | 'colorful' | 'professional'
  }) => string[]

  // 验证和约束
  validateTheme: (values: any) => {
    isValid: boolean
    warnings: string[]
    suggestions: string[]
  }

  // 保存和加载
  saveCustomTheme: (name: string) => string
  loadCustomTheme: (id: string) => boolean
  getCustomThemes: () => Array<{ id: string; name: string; values: any; createdAt: string }>
}

// ============================================================================
// 快速配置定义 (Quick Configurations)
// ============================================================================

const QUICK_CONFIGS: QuickConfig[] = [
  // 专业场景
  {
    id: 'professional-light',
    name: '专业亮色',
    description: '适合办公和专业应用',
    tags: ['professional', 'business', 'day'],
    values: {
      mode: 'light',
      tone: 'standard',
      density: 'comfortable',
      motionIntensity: 'subtle',
      surface: 'soft-shadow',
      fixedAxes: {
        base: { color: 'neutral-cool', contrast: 'mid' },
        accent: { strategy: 'mono', hue: 'blue' }
      }
    }
  },
  {
    id: 'professional-dark',
    name: '专业暗色',
    description: '适合长时间工作',
    tags: ['professional', 'business', 'night'],
    values: {
      mode: 'dark',
      tone: 'standard',
      density: 'comfortable',
      motionIntensity: 'subtle',
      surface: 'soft-shadow',
      fixedAxes: {
        base: { color: 'neutral-cool', contrast: 'high' },
        accent: { strategy: 'mono', hue: 'blue' }
      }
    }
  },

  // 创意场景
  {
    id: 'creative-vibrant',
    name: '创意活力',
    description: '适合设计和创意工作',
    tags: ['creative', 'design', 'colorful'],
    values: {
      mode: 'light',
      tone: 'vivid',
      density: 'spacious',
      motionIntensity: 'expressive',
      surface: 'glass',
      fixedAxes: {
        accent: { strategy: 'trio', hue: 'red,yellow,blue' }
      }
    }
  },
  {
    id: 'creative-minimal',
    name: '创意极简',
    description: '极简但有活力',
    tags: ['creative', 'minimal', 'modern'],
    values: {
      mode: 'light',
      tone: 'calm',
      density: 'spacious',
      motionIntensity: 'subtle',
      surface: 'flat',
      fixedAxes: {
        base: { color: 'neutral-true', contrast: 'low' },
        accent: { strategy: 'mono', hue: 'purple' }
      }
    }
  },

  // 休闲场景
  {
    id: 'casual-warm',
    name: '休闲温暖',
    description: '轻松友好的氛围',
    tags: ['casual', 'friendly', 'warm'],
    values: {
      mode: 'light',
      tone: 'standard',
      density: 'comfortable',
      motionIntensity: 'standard',
      surface: 'soft-shadow',
      fixedAxes: {
        base: { color: 'neutral-warm', contrast: 'mid' },
        accent: { strategy: 'analog', hue: 'orange' }
      }
    }
  },

  // 无障碍场景
  {
    id: 'accessibility-high-contrast',
    name: '高对比无障碍',
    description: '为视觉障碍用户优化',
    tags: ['accessibility', 'hc', 'inclusive'],
    values: {
      mode: 'hc',
      tone: 'standard',
      density: 'comfortable',
      motionIntensity: 'subtle',
      surface: 'flat',
      fixedAxes: {
        base: { color: 'neutral-true', contrast: 'high' },
        accent: { strategy: 'mono', hue: 'blue' }
      }
    }
  },

  // 特殊场景
  {
    id: 'developer-code',
    name: '开发者编码',
    description: '为长时间编码优化',
    tags: ['developer', 'coding', 'dark'],
    values: {
      mode: 'dark',
      tone: 'calm',
      density: 'spacious',
      motionIntensity: 'subtle',
      surface: 'glass',
      fixedAxes: {
        base: { color: 'neutral-cool', contrast: 'high' },
        accent: { strategy: 'mono', hue: 'cyan' }
      }
    }
  },
  {
    id: 'presentation-neon',
    name: '演示霓虹',
    description: '吸引眼球的演示主题',
    tags: ['presentation', 'neon', 'colorful'],
    values: {
      mode: 'dark',
      tone: 'vivid',
      density: 'comfortable',
      motionIntensity: 'expressive',
      surface: 'glass+neon',
      fixedAxes: {
        accent: { strategy: 'quintet', hue: 'cyan,magenta,yellow,green,blue' }
      }
    }
  }
]

// ============================================================================
// 智能约束系统 (Smart Constraints)
// ============================================================================

const CONSTRAINTS = {
  // 暗色模式 + 霓虹效果 = 过于刺眼
  dark_mode_neon_forbidden: [
    { motion: 'expressive', surface: 'neon', mode: 'dark' },
    { tone: 'vivid', surface: 'neon', mode: 'dark' }
  ],

  // 高对比度模式 + 复杂动效 = 可访问性问题
  hc_mode_motion_constrained: [
    { mode: 'hc', motionIntensity: 'expressive' },
    { mode: 'hc', tone: 'vivid' }
  ],

  // 专业场景 + 过度动效 = 不专业
  professional_motion_constrained: [
    { density: 'compact', motionIntensity: 'expressive' },
    { motion: 'expressive.spring', tone: 'vivid' }
  ],

  // 无障碍模式限制
  accessibility_contrast_requirements: [
    { mode: 'light', contrastLevel: 'low' },
    { mode: 'dark', contrastLevel: 'low' }
  ]
}

export function useThemeSystem(options: ThemeSystemOptions = {}): UseThemeSystemReturn {
  const { currentRecipeID, setRecipe } = useStyleRecipe()
  const { autoApply = true, enableSmartConstraints = true } = options

  // 当前状态
  const [currentMode, setCurrentMode] = useState<'preset' | 'quick' | 'custom'>('preset')
  const [currentPreset, setCurrentPreset] = useState<string>()
  const [currentQuickConfig, setCurrentQuickConfig] = useState<string>()

  // 自定义轴值
  const [customValues, setCustomValues] = useState({
    mode: 'light' as ModeAxis,
    baseColor: 'neutral-true',
    contrastLevel: 'mid',
    accentStrategy: 'mono',
    accentHue: 'blue',
    tone: 'standard' as ToneAxis,
    density: 'comfortable' as DensityAxis,
    motionIntensity: 'standard',
    motionCurve: 'classic',
    surface: 'soft-shadow',
  })

  // 预设配方列表 - 使用官方配方替代
  const presetRecipes = useMemo(() => {
    if (!officialRecipes || !Array.isArray(officialRecipes)) {
      return []
    }
    return officialRecipes.map(recipe => ({
      id: recipe.id,
      name: recipe.name,
      category: recipe.category,
      description: recipe.description,
      recipeId: recipe.id
    }))
  }, [officialRecipes])

  // 快速配置列表
  const quickConfigs = useMemo(() => QUICK_CONFIGS, [])

  // 验证主题配置
  const validateTheme = useCallback((values: any) => {
    const warnings: string[] = []
    const suggestions: string[] = []
    let isValid = true

    // 检查智能约束
    if (enableSmartConstraints) {
      // 暗色模式 + 霓虹效果检查
      if (values.mode === 'dark' && values.surface === 'neon') {
        if (values.motionIntensity === 'expressive' || values.tone === 'vivid') {
          warnings.push('暗色模式下的霓虹效果可能导致视觉疲劳')
          suggestions.push('考虑降低动效强度或色调')
        }
      }

      // 高对比度模式检查
      if (values.mode === 'hc') {
        if (values.motionIntensity === 'expressive') {
          warnings.push('高对比度模式不建议使用复杂动效')
          suggestions.push('使用微妙动效以保持可访问性')
        }
      }

      // 专业场景约束
      if (values.motionIntensity === 'expressive' && values.tone === 'vivid') {
        warnings.push('过于动感的主题可能不够专业')
        suggestions.push('考虑使用标准色调和微妙动效')
      }
    }

    return { isValid, warnings, suggestions }
  }, [enableSmartConstraints])

  // 生成配方ID（用于快速配置）
  const generateRecipeIdFromQuickConfig = useCallback((config: QuickConfig): StyleRecipeID => {
    const { mode, tone, density, motionIntensity, motionCurve, surface, fixedAxes } = config.values

    const base = fixedAxes?.base
      ? `${fixedAxes.base.color}-${fixedAxes.base.contrast}`
      : 'neutral-true-mid'

    const accent = fixedAxes?.accent
      ? `${fixedAxes.accent.strategy}(${fixedAxes.accent.hue})`
      : 'mono(blue)'

    const motion = `${motionIntensity || 'standard'}.${motionCurve || 'classic'}`

    return `${mode || 'light'}.${base}.${accent}.${tone || 'standard'}.${density || 'comfortable'}.${motion}.${surface || 'soft-shadow'}` as StyleRecipeID
  }, [])

  // 生成配方ID（用于自定义）
  const generateRecipeIdFromCustom = useCallback((): StyleRecipeID => {
    const base = `${customValues.baseColor}-${customValues.contrastLevel}`
    const accent = `${customValues.accentStrategy}(${customValues.accentHue})`
    const motion = `${customValues.motionIntensity}.${customValues.motionCurve}`

    return `${customValues.mode}.${base}.${accent}.${customValues.tone}.${customValues.density}.${motion}.${customValues.surface}` as StyleRecipeID
  }, [customValues])

  // 应用预设配方
  const applyPreset = useCallback(async (recipeId: string): Promise<boolean> => {
    setCurrentMode('preset')
    setCurrentPreset(recipeId)
    setCurrentQuickConfig(undefined)

    if (autoApply) {
      return setRecipe(recipeId as StyleRecipeID)
    }
    return true
  }, [autoApply, setRecipe])

  // 应用快速配置
  const applyQuickConfig = useCallback(async (configId: string): Promise<boolean> => {
    const config = quickConfigs.find(c => c.id === configId)
    if (!config) {
      console.error(`Quick config not found: ${configId}`)
      return false
    }

    setCurrentMode('quick')
    setCurrentQuickConfig(configId)
    setCurrentPreset(undefined)

    if (autoApply) {
      const recipeId = generateRecipeIdFromQuickConfig(config)
      return setRecipe(recipeId)
    }
    return true
  }, [quickConfigs, autoApply, setRecipe, generateRecipeIdFromQuickConfig])

  // 更新自定义轴值
  const updateCustomAxis = useCallback((axis: string, value: string) => {
    setCustomValues(prev => {
      const newValues = { ...prev, [axis]: value }

      // 如果启用了自动应用，立即应用新主题
      if (autoApply) {
        const recipeId = generateRecipeIdFromCustom()
        setRecipe(recipeId).catch(error => {
          console.error('Failed to apply custom theme:', error)
        })
      }

      return newValues
    })
  }, [autoApply, setRecipe, generateRecipeIdFromCustom])

  // 应用自定义主题
  const applyCustomTheme = useCallback(async (): Promise<boolean> => {
    setCurrentMode('custom')
    setCurrentPreset(undefined)
    setCurrentQuickConfig(undefined)

    if (autoApply) {
      const recipeId = generateRecipeIdFromCustom()
      return setRecipe(recipeId)
    }
    return true
  }, [autoApply, setRecipe, generateRecipeIdFromCustom])

  // 智能推荐
  const getRecommendedPresets = useCallback((context?: {
    usage?: 'professional' | 'creative' | 'casual' | 'accessibility'
    timeOfDay?: 'day' | 'night'
    userPreference?: 'minimal' | 'colorful' | 'professional'
  }): string[] => {
    const { usage, timeOfDay, userPreference } = context || {}

    let recommendations = []

    // 基于使用场景推荐
    if (usage === 'professional') {
      recommendations = ['corporate-blue', 'minimal-white', 'professional-light']
    } else if (usage === 'creative') {
      recommendations = ['creative-purple', 'dreamy-rainbow', 'creative-aurora-dark']
    } else if (usage === 'accessibility') {
      recommendations = ['high-contrast-pro', 'minimal-graphite-dark', 'classic-neutral']
    } else {
      recommendations = ['corporate-blue', 'minimal-white', 'tech-cyan']
    }

    // 基于时间调整
    if (timeOfDay === 'night') {
      recommendations = recommendations.map(id =>
        id.includes('dark') ? id : `${id.replace(/light/g, 'dark')}` as any
      )
    }

    // 基于用户偏好调整
    if (userPreference === 'minimal') {
      recommendations = recommendations.filter(id =>
        id.includes('minimal') || id.includes('classic')
      )
    } else if (userPreference === 'colorful') {
      recommendations = recommendations.filter(id =>
        id.includes('creative') || id.includes('vibrant') || id.includes('dreamy')
      )
    }

    return recommendations
  }, [])

  // 保存自定义主题
  const saveCustomTheme = useCallback((name: string): string => {
    const themeId = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const themeData = {
      id: themeId,
      name,
      values: customValues,
      recipeId: generateRecipeIdFromCustom(),
      createdAt: new Date().toISOString(),
      mode: 'custom'
    }

    // 保存到 localStorage
    const savedThemes = JSON.parse(localStorage.getItem('th-ui-custom-themes') || '[]')
    savedThemes.push(themeData)
    localStorage.setItem('th-ui-custom-themes', JSON.stringify(savedThemes))

    return themeId
  }, [customValues, generateRecipeIdFromCustom])

  // 加载自定义主题
  const loadCustomTheme = useCallback((id: string): boolean => {
    try {
      const savedThemes = JSON.parse(localStorage.getItem('th-ui-custom-themes') || '[]')
      const theme = savedThemes.find((t: any) => t.id === id)

      if (theme) {
        setCustomValues(theme.values)
        setCurrentMode('custom')

        if (autoApply) {
          setRecipe(theme.recipeId).catch(error => {
            console.error('Failed to load custom theme:', error)
            return false
          })
        }
        return true
      }
    } catch (error) {
      console.error('Failed to load custom theme:', error)
    }
    return false
  }, [autoApply, setRecipe, setCustomValues])

  // 获取自定义主题列表
  const getCustomThemes = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem('th-ui-custom-themes') || '[]')
    } catch (error) {
      console.error('Failed to load custom themes:', error)
      return []
    }
  }, [])

  return {
    presetRecipes,
    quickConfigs,
    currentMode,
    currentPreset,
    currentQuickConfig,
    applyPreset,
    applyQuickConfig,
    customValues,
    updateCustomAxis,
    applyCustomTheme,
    getRecommendedPresets,
    validateTheme,
    saveCustomTheme,
    loadCustomTheme,
    getCustomThemes,
  }
}

export default useThemeSystem