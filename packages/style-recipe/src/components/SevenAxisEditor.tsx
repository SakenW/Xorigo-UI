'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  useStyleRecipe,
  defaultRecipeEngine,
  parseRecipe,
  type StyleRecipeID,
  type ModeAxis,
  type BaseAxis,
  type AccentAxis,
  type ToneAxis,
  type DensityAxis,
  type MotionAxis,
  type SurfaceAxis,
} from '../index'
import { cn } from '@/utils'

// ============================================================================
// 轴配置定义 (Axis Configuration)
// ============================================================================

const MODE_OPTIONS: { value: ModeAxis; label: string; icon: string }[] = [
  { value: 'light', label: '亮色模式', icon: '☀️' },
  { value: 'dark', label: '暗色模式', icon: '🌙' },
  { value: 'hc', label: '高对比', icon: '♿️' },
]

const BASE_COLOR_OPTIONS: { value: string; label: string }[] = [
  { value: 'neutral-warm', label: '暖色中性' },
  { value: 'neutral-cool', label: '冷色中性' },
  { value: 'neutral-true', label: '真实中性' },
]

const CONTRAST_LEVEL_OPTIONS: { value: string; label: string }[] = [
  { value: 'low', label: '低对比度' },
  { value: 'mid', label: '中对比度' },
  { value: 'high', label: '高对比度' },
]

const ACCENT_STRATEGY_OPTIONS: { value: string; label: string }[] = [
  { value: 'mono', label: '单色系' },
  { value: 'analog', label: '邻近色系' },
  { value: 'duo', label: '双色系' },
  { value: 'trio', label: '三色系' },
  { value: 'quintet', label: '五色系' },
]

const ACCENT_HUE_OPTIONS: { value: string; label: string; color: string }[] = [
  { value: 'red', label: '红色', color: '#ef4444' },
  { value: 'orange', label: '橙色', color: '#f97316' },
  { value: 'yellow', label: '黄色', color: '#eab308' },
  { value: 'green', label: '绿色', color: '#22c55e' },
  { value: 'cyan', label: '青色', color: '#06b6d4' },
  { value: 'blue', label: '蓝色', color: '#3b82f6' },
  { value: 'purple', label: '紫色', color: '#a855f7' },
]

const TONE_OPTIONS: { value: ToneAxis; label: string; description: string }[] = [
  { value: 'calm', label: '平和', description: '低饱和度，优雅宁静' },
  { value: 'standard', label: '标准', description: '平衡饱和度，专业稳重' },
  { value: 'vivid', label: '鲜艳', description: '高饱和度，活力充沛' },
]

const DENSITY_OPTIONS: { value: DensityAxis; label: string; description: string }[] = [
  { value: 'spacious', label: '宽松', description: '更多留白，呼吸感强' },
  { value: 'comfortable', label: '舒适', description: '平衡密度，阅读友好' },
  { value: 'compact', label: '紧凑', description: '信息密集，空间高效' },
]

const MOTION_INTENSITY_OPTIONS: { value: string; label: string }[] = [
  { value: 'subtle', label: '微妙' },
  { value: 'standard', label: '标准' },
  { value: 'expressive', label: '表现力' },
]

const MOTION_CURVE_OPTIONS: { value: string; label: string }[] = [
  { value: 'classic', label: '经典' },
  { value: 'soft', label: '柔和' },
  { value: 'spring', label: '弹簧' },
]

const SURFACE_OPTIONS: { value: string; label: string; description: string }[] = [
  { value: 'flat', label: '扁平', description: '简洁无装饰' },
  { value: 'soft-shadow', label: '柔和阴影', description: '轻微立体感' },
  { value: 'glass', label: '玻璃', description: '透明磨砂效果' },
  { value: 'neon', label: '霓虹', description: '发光效果' },
]

// ============================================================================
// 类型定义 (Type Definitions)
// ============================================================================

interface AxisValue {
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

interface SevenAxisEditorProps {
  className?: string
  onSave?: (recipeId: StyleRecipeID, values: AxisValue) => void
  defaultValues?: Partial<AxisValue>
}

// ============================================================================
// 七轴编辑器组件 (Seven Axis Editor Component)
// ============================================================================

export function SevenAxisEditor({ className, onSave, defaultValues }: SevenAxisEditorProps) {
  const { currentRecipeID, setRecipe, availableRecipes } = useStyleRecipe()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [savedName, setSavedName] = useState('')

  // 初始化轴值
  const [axisValues, setAxisValues] = useState<AxisValue>(() => {
    const defaults: AxisValue = {
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
      ...defaultValues,
    }

    // 如果有当前配方，解析并同步轴值
    if (currentRecipeID) {
      try {
        const [mode, base, accent, tone, density, motion, surface] = currentRecipeID.split('.')

        // 解析 Base 轴
        const [baseColor, contrastLevel] = base.split('-')

        // 解析 Accent 轴
        const accentMatch = accent.match(/^(mono|analog|duo|trio|quintet)\(([^)]+)\)$/)
        const accentStrategy = accentMatch?.[1] || 'mono'
        const accentHue = accentMatch?.[2] || 'blue'

        // 解析 Motion 轴
        const [motionIntensity, motionCurve] = motion.split('.')

        return {
          ...defaults,
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
        console.error('Failed to parse current recipe:', error)
        return defaults
      }
    }

    return defaults
  })

  // 构建配方ID
  const recipeId = useMemo(() => {
    const base = `${axisValues.baseColor}-${axisValues.contrastLevel}`
    const accent = `${axisValues.accentStrategy}(${axisValues.accentHue})`
    const motion = `${axisValues.motionIntensity}.${axisValues.motionCurve}`

    return `${axisValues.mode}.${base}.${accent}.${axisValues.tone}.${axisValues.density}.${motion}.${axisValues.surface}`
  }, [axisValues])

  // 应用配方
  const applyRecipe = useCallback(async () => {
    setIsTransitioning(true)
    const success = await setRecipe(recipeId as StyleRecipeID)
    setIsTransitioning(false)

    if (!success) {
      console.error('Failed to apply recipe:', recipeId)
    }
  }, [recipeId, setRecipe])

  // 更新轴值
  const updateAxisValue = useCallback((key: keyof AxisValue, value: string) => {
    setAxisValues(prev => ({
      ...prev,
      [key]: value,
    }))
  }, [])

  // 保存自定义配方
  const saveCustomRecipe = useCallback(() => {
    if (!savedName.trim()) {
      alert('请输入配方名称')
      return
    }

    const customRecipe = {
      id: recipeId,
      name: savedName,
      description: `自定义七轴配方：${recipeId}`,
      category: 'custom' as const,
      mode: axisValues.mode,
      base: `${axisValues.baseColor}-${axisValues.contrastLevel}` as BaseAxis,
      accent: `${axisValues.accentStrategy}(${axisValues.accentHue})` as AccentAxis,
      tone: axisValues.tone,
      density: axisValues.density,
      motion: `${axisValues.motionIntensity}.${axisValues.motionCurve}` as MotionAxis,
      surface: axisValues.surface as SurfaceAxis,
      tags: ['custom', 'user-generated'],
      accessibility: {
        contrastLevel: 'AA' as const,
        cvdFriendly: true,
        motionSafe: axisValues.motionIntensity !== 'expressive',
      },
    }

    // 保存到 localStorage
    const savedRecipes = JSON.parse(localStorage.getItem('th-ui-custom-recipes') || '[]')
    savedRecipes.push(customRecipe)
    localStorage.setItem('th-ui-custom-recipes', JSON.stringify(savedRecipes))

    onSave?.(recipeId, axisValues)
    setShowSaveDialog(false)
    setSavedName('')
  }, [recipeId, axisValues, savedName, onSave])

  return (
    <div className={cn('w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg', className)}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          🎨 七轴主题编辑器
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          通过调整七个设计轴来创建独特的视觉风格
        </p>
      </div>

      {/* 当前配方预览 */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              当前配方ID
            </h3>
            <code className="text-xs text-gray-600 dark:text-gray-400 break-all">
              {recipeId}
            </code>
          </div>
          <div className="flex gap-2">
            <button
              onClick={applyRecipe}
              disabled={isTransitioning}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isTransitioning ? '应用中...' : '应用主题'}
            </button>
            <button
              onClick={() => setShowSaveDialog(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              保存配方
            </button>
          </div>
        </div>
      </div>

      {/* 轴编辑区域 */}
      <div className="space-y-6">
        {/* 第1轴：模式 */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            第1轴：模式 (Mode) - 光照与对比
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {MODE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => updateAxisValue('mode', option.value)}
                className={cn(
                  'p-3 rounded-lg border-2 transition-all',
                  axisValues.mode === option.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                )}
              >
                <div className="text-2xl mb-1">{option.icon}</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {option.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 第2轴：基础色 */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            第2轴：基础色 (Base) - 中性色谱 × 对比度
          </h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {BASE_COLOR_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => updateAxisValue('baseColor', option.value)}
                className={cn(
                  'p-3 rounded-lg border-2 transition-all',
                  axisValues.baseColor === option.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                )}
              >
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {option.label}
                </div>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {CONTRAST_LEVEL_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => updateAxisValue('contrastLevel', option.value)}
                className={cn(
                  'p-3 rounded-lg border-2 transition-all',
                  axisValues.contrastLevel === option.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                )}
              >
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {option.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 第3轴：强调色 */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            第3轴：强调色 (Accent) - 主色策略
          </h3>
          <div className="grid grid-cols-5 gap-4 mb-4">
            {ACCENT_STRATEGY_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => updateAxisValue('accentStrategy', option.value)}
                className={cn(
                  'p-3 rounded-lg border-2 transition-all',
                  axisValues.accentStrategy === option.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                )}
              >
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {option.label}
                </div>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {ACCENT_HUE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => updateAxisValue('accentHue', option.value)}
                className={cn(
                  'p-3 rounded-lg border-2 transition-all',
                  axisValues.accentHue === option.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                )}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600"
                    style={{ backgroundColor: option.color }}
                  />
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {option.label}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 第4轴：色调 */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            第4轴：色调 (Tone) - 强度与饱和度曲线
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {TONE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => updateAxisValue('tone', option.value)}
                className={cn(
                  'p-4 rounded-lg border-2 transition-all text-left',
                  axisValues.tone === option.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                )}
              >
                <div className="font-medium text-gray-900 dark:text-white mb-1">
                  {option.label}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {option.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 第5轴：密度 */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            第5轴：密度 (Density) - 信息密度与留白
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {DENSITY_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => updateAxisValue('density', option.value)}
                className={cn(
                  'p-4 rounded-lg border-2 transition-all text-left',
                  axisValues.density === option.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                )}
              >
                <div className="font-medium text-gray-900 dark:text-white mb-1">
                  {option.label}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {option.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 第6轴：动效 */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            第6轴：动效 (Motion) - 动效节奏与幅度
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                动效强度
              </label>
              <div className="grid grid-cols-3 gap-4">
                {MOTION_INTENSITY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateAxisValue('motionIntensity', option.value)}
                    className={cn(
                      'p-3 rounded-lg border-2 transition-all',
                      axisValues.motionIntensity === option.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    )}
                  >
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {option.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                动效曲线
              </label>
              <div className="grid grid-cols-3 gap-4">
                {MOTION_CURVE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateAxisValue('motionCurve', option.value)}
                    className={cn(
                      'p-3 rounded-lg border-2 transition-all',
                      axisValues.motionCurve === option.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    )}
                  >
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {option.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 第7轴：表面 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            第7轴：表面 (Surface) - 材质与表面语言
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {SURFACE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => updateAxisValue('surface', option.value)}
                className={cn(
                  'p-4 rounded-lg border-2 transition-all text-left',
                  axisValues.surface === option.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                )}
              >
                <div className="font-medium text-gray-900 dark:text-white mb-1">
                  {option.label}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {option.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 保存对话框 */}
      <AnimatePresence>
        {showSaveDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                保存自定义配方
              </h3>
              <input
                type="text"
                value={savedName}
                onChange={(e) => setSavedName(e.target.value)}
                placeholder="输入配方名称..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={saveCustomRecipe}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  保存
                </button>
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  取消
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SevenAxisEditor