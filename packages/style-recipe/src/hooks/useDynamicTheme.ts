'use client'

import { useState, useCallback, useEffect } from 'react'
import { useStyleRecipe } from '../index'
import type { StyleRecipeID, ModeAxis, BaseAxis, AccentAxis, ToneAxis, DensityAxis, MotionAxis, SurfaceAxis } from '../types'

// ============================================================================
// 类型定义 (Type Definitions)
// ============================================================================

interface AxisValues {
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

interface DynamicThemeOptions {
  autoApply?: boolean
  persistChanges?: boolean
  defaultValues?: Partial<AxisValues>
  onAxisChange?: (axis: keyof AxisValues, value: string) => void
  onRecipeChange?: (recipeId: StyleRecipeID, values: AxisValues) => void
}

interface UseDynamicThemeReturn {
  // 当前轴值
  values: AxisValues
  // 更新轴值
  updateAxis: (axis: keyof AxisValues, value: string) => void
  // 批量更新轴值
  updateMultipleAxes: (updates: Partial<AxisValues>) => void
  // 生成配方ID
  getRecipeId: () => StyleRecipeID
  // 应用配方
  applyRecipe: () => Promise<boolean>
  // 重置到默认值
  reset: () => void
  // 加载保存的配置
  loadSavedConfig: (name: string) => void
  // 保存当前配置
  saveConfig: (name?: string) => void
  // 获取所有保存的配置
  getSavedConfigs: () => string[]
  // 删除保存的配置
  deleteSavedConfig: (name: string) => void
}

// ============================================================================
// 动态主题 Hook (Dynamic Theme Hook)
// ============================================================================

const DEFAULT_VALUES: AxisValues = {
  mode: 'light',
  baseColor: 'neutral-true',
  contrastLevel: 'mid',
  accentStrategy: 'mono',
  accentHue: 'blue',
  tone: 'standard',
  density: 'comfortable',
  motionIntensity: 'standard',
  motionCurve: 'classic',
  surface: 'soft-shadow',
}

export function useDynamicTheme(options: DynamicThemeOptions = {}): UseDynamicThemeReturn {
  const { currentRecipeID, setRecipe } = useStyleRecipe()
  const { autoApply = true, persistChanges = true, onAxisChange, onRecipeChange } = options

  // 初始化轴值
  const [values, setValues] = useState<AxisValues>(() => {
    const defaults = { ...DEFAULT_VALUES, ...options.defaultValues }

    // 如果有当前配方，解析并同步轴值
    if (currentRecipeID) {
      try {
        return parseRecipeIdToValues(currentRecipeID, defaults)
      } catch (error) {
        console.error('Failed to parse current recipe:', error)
        return defaults
      }
    }

    // 如果启用了持久化，尝试加载保存的配置
    if (persistChanges) {
      const saved = loadSavedValues()
      if (saved) {
        return { ...defaults, ...saved }
      }
    }

    return defaults
  })

  // 从配方ID解析轴值
  function parseRecipeIdToValues(recipeId: StyleRecipeID, fallback: AxisValues): AxisValues {
    try {
      const [mode, base, accent, tone, density, motion, surface] = recipeId.split('.')

      // 解析 Base 轴
      const [baseColor, contrastLevel] = base.split('-')

      // 解析 Accent 轴
      const accentMatch = accent.match(/^(mono|analog|duo|trio|quintet)\(([^)]+)\)$/)
      const accentStrategy = accentMatch?.[1] || 'mono'
      const accentHue = accentMatch?.[2] || 'blue'

      // 解析 Motion 轴
      const [motionIntensity, motionCurve] = motion.split('.')

      return {
        ...fallback,
        mode: mode as ModeAxis,
        baseColor: baseColor || 'neutral-true',
        contrastLevel: contrastLevel || 'mid',
        accentStrategy,
        accentHue,
        tone: tone as ToneAxis,
        density: density as DensityAxis,
        motionIntensity,
        motionCurve,
        surface,
      }
    } catch (error) {
      console.error('Failed to parse recipe ID:', error)
      return fallback
    }
  }

  // 构建配方ID
  const getRecipeId = useCallback(() => {
    const base = `${values.baseColor}-${values.contrastLevel}`
    const accent = `${values.accentStrategy}(${values.accentHue})`
    const motion = `${values.motionIntensity}.${values.motionCurve}`

    return `${values.mode}.${base}.${accent}.${values.tone}.${values.density}.${motion}.${values.surface}` as StyleRecipeID
  }, [values])

  // 更新单个轴值
  const updateAxis = useCallback((axis: keyof AxisValues, value: string) => {
    setValues(prev => {
      const newValues = { ...prev, [axis]: value }

      // 触发回调
      onAxisChange?.(axis, value)

      // 自动应用新配方
      if (autoApply) {
        const recipeId = getRecipeIdFromValues(newValues)
        setRecipe(recipeId).catch(error => {
          console.error('Failed to apply recipe:', error)
        })
      }

      // 持久化更改
      if (persistChanges) {
        saveValues(newValues)
      }

      return newValues
    })
  }, [autoApply, onAxisChange, persistChanges, setRecipe])

  // 批量更新轴值
  const updateMultipleAxes = useCallback((updates: Partial<AxisValues>) => {
    setValues(prev => {
      const newValues = { ...prev, ...updates }

      // 触发回调
      Object.entries(updates).forEach(([axis, value]) => {
        onAxisChange?.(axis as keyof AxisValues, value)
      })

      // 自动应用新配方
      if (autoApply) {
        const recipeId = getRecipeIdFromValues(newValues)
        setRecipe(recipeId).catch(error => {
          console.error('Failed to apply recipe:', error)
        })
      }

      // 持久化更改
      if (persistChanges) {
        saveValues(newValues)
      }

      return newValues
    })
  }, [autoApply, onAxisChange, persistChanges, setRecipe])

  // 从值构建配方ID
  const getRecipeIdFromValues = useCallback((vals: AxisValues) => {
    const base = `${vals.baseColor}-${vals.contrastLevel}`
    const accent = `${vals.accentStrategy}(${vals.accentHue})`
    const motion = `${vals.motionIntensity}.${vals.motionCurve}`

    return `${vals.mode}.${base}.${accent}.${vals.tone}.${vals.density}.${motion}.${vals.surface}` as StyleRecipeID
  }, [])

  // 应用配方
  const applyRecipe = useCallback(async () => {
    const recipeId = getRecipeId()
    const success = await setRecipe(recipeId)

    if (success) {
      onRecipeChange?.(recipeId, values)
    }

    return success
  }, [getRecipeId, setRecipe, values, onRecipeChange])

  // 重置到默认值
  const reset = useCallback(() => {
    const newValues = { ...DEFAULT_VALUES, ...options.defaultValues }
    setValues(newValues)

    if (autoApply) {
      const recipeId = getRecipeIdFromValues(newValues)
      setRecipe(recipeId).catch(error => {
        console.error('Failed to apply recipe:', error)
      })
    }

    if (persistChanges) {
      saveValues(newValues)
    }
  }, [autoApply, options.defaultValues, setRecipe, persistChanges])

  // 持久化功能
  const saveValues = useCallback((vals: AxisValues) => {
    try {
      localStorage.setItem('th-ui-dynamic-theme-values', JSON.stringify(vals))
    } catch (error) {
      console.error('Failed to save theme values:', error)
    }
  }, [])

  const loadSavedValues = useCallback((): Partial<AxisValues> | null => {
    try {
      const saved = localStorage.getItem('th-ui-dynamic-theme-values')
      return saved ? JSON.parse(saved) : null
    } catch (error) {
      console.error('Failed to load theme values:', error)
      return null
    }
  }, [])

  const saveConfig = useCallback((name?: string) => {
    const configName = name || `custom-${Date.now()}`
    const configs = getSavedConfigs()

    if (!configs.includes(configName)) {
      configs.push(configName)
      localStorage.setItem('th-ui-saved-theme-configs', JSON.stringify(configs))
    }

    localStorage.setItem(`th-ui-theme-config-${configName}`, JSON.stringify({
      values,
      recipeId: getRecipeId(),
      createdAt: new Date().toISOString(),
      name: configName,
    }))
  }, [values, getRecipeId])

  const getSavedConfigs = useCallback((): string[] => {
    try {
      return JSON.parse(localStorage.getItem('th-ui-saved-theme-configs') || '[]')
    } catch (error) {
      console.error('Failed to load saved configs:', error)
      return []
    }
  }, [])

  const loadSavedConfig = useCallback((name: string) => {
    try {
      const configData = localStorage.getItem(`th-ui-theme-config-${name}`)
      if (configData) {
        const config = JSON.parse(configData)
        setValues(config.values)

        if (autoApply) {
          setRecipe(config.recipeId).catch(error => {
            console.error('Failed to apply saved config:', error)
          })
        }

        onRecipeChange?.(config.recipeId, config.values)
      }
    } catch (error) {
      console.error('Failed to load saved config:', error)
    }
  }, [autoApply, setRecipe, onRecipeChange])

  const deleteSavedConfig = useCallback((name: string) => {
    try {
      localStorage.removeItem(`th-ui-theme-config-${name}`)
      const configs = getSavedConfigs().filter(config => config !== name)
      localStorage.setItem('th-ui-saved-theme-configs', JSON.stringify(configs))
    } catch (error) {
      console.error('Failed to delete saved config:', error)
    }
  }, [getSavedConfigs])

  // 初始化时加载保存的配置
  useEffect(() => {
    if (persistChanges) {
      loadSavedValues()
    }
  }, [persistChanges, loadSavedValues])

  return {
    values,
    updateAxis,
    updateMultipleAxes,
    getRecipeId,
    applyRecipe,
    reset,
    loadSavedConfig,
    saveConfig,
    getSavedConfigs,
    deleteSavedConfig,
  }
}

export default useDynamicTheme