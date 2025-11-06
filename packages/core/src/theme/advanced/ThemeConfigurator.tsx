'use client'
/**
 * 🎛️ 高级主题配置器 - 26参数精细控制系统
 *
 * 提供完整的26参数调整界面，包含：
 * - 七轴核心控制 (7个参数)
 * - 字体系统控制 (5个参数)
 * - 尺寸比例控制 (6个参数)
 * - 间距系统控制 (8个参数)
 *
 * 支持实时预览、参数验证、性能优化
 */

import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  ReactNode
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// 导入类型定义
import type {
  TwentySixParams,
  PresetTheme,
  ThemeCalculationResult
} from './twenty-six-params'

// 导入子组件
import { SevenAxisControls } from './controls/SevenAxisControls'
import { FontSystemEditor } from './controls/FontSystemEditor'
import { SizeScaleEditor } from './controls/SizeScaleEditor'
import { SpacingSystemEditor } from './controls/SpacingSystemEditor'
import { ThemePreview } from './preview/ThemePreview'
import { PresetThemeSelector } from './presets/PresetThemeSelector'
import { ThemeExporter } from './presets/ThemeExporter'

// 导入计算器
import { calculateAdvancedTheme } from './param-calculators'

// 导入工具函数
import {
  DEFAULT_TWENTY_SIX_PARAMS,
  validateTwentySixParams,
  resetToDefaults,
  getParamCounts
} from './twenty-six-params'

// 样式导入
import './ThemeConfigurator.css'

// ============================================================================
// 接口定义
// ============================================================================

/**
 * 主题配置器属性
 */
export interface ThemeConfiguratorProps {
  /** 初始参数 */
  initialParams?: Partial<TwentySixParams>
  /** 参数变化回调 */
  onParamsChange?: (params: TwentySixParams, result: ThemeCalculationResult) => void
  /** 预设主题列表 */
  presetThemes?: PresetTheme[]
  /** 是否显示预设选择器 */
  showPresets?: boolean
  /** 是否显示导出功能 */
  showExport?: boolean
  /** 自定义预览组件 */
  customPreview?: React.ComponentType<{ params: TwentySixParams }>
  /** 高度 */
  height?: string | number
  /** 自定义类名 */
  className?: string
  /** 主题变化是否带动画 */
  animated?: boolean
}

/**
 * 配置器状态
 */
interface ConfiguratorState {
  params: TwentySixParams
  calculatedResult: ThemeCalculationResult | null
  isCalculating: boolean
  activeTab: 'seven-axis' | 'fonts' | 'sizes' | 'spacing'
  showPresets: boolean
  showExport: boolean
  error: string | null
}

// ============================================================================
// 主组件
// ============================================================================

/**
 * 高级主题配置器
 */
export const ThemeConfigurator: React.FC<ThemeConfiguratorProps> = ({
  initialParams,
  onParamsChange,
  presetThemes,
  showPresets = true,
  showExport = true,
  customPreview,
  height = '100%',
  className = '',
  animated = true
}) => {
  // 状态管理
  const [state, setState] = useState<ConfiguratorState>(() => ({
    params: {
      ...DEFAULT_TWENTY_SIX_PARAMS,
      ...initialParams
    },
    calculatedResult: null,
    isCalculating: false,
    activeTab: 'seven-axis',
    showPresets: false,
    showExport: false,
    error: null
  }))

  // 防抖定时器引用
  const calculationTimerRef = useRef<NodeJS.Timeout>()
  const mountedRef = useRef(true)

  // ============================================================================
  // 参数计算
  // ============================================================================

  /**
   * 计算主题（带防抖）
   */
  const calculateTheme = useCallback(async (params: TwentySixParams, immediate = false) => {
    // 验证参数
    if (!validateTwentySixParams(params)) {
      setState(prev => ({
        ...prev,
        error: '参数验证失败，请检查参数值是否在有效范围内'
      }))
      return
    }

    setState(prev => ({ ...prev, isCalculating: true, error: null }))

    try {
      const result = await calculateAdvancedTheme(params)

      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          calculatedResult: result,
          isCalculating: false
        }))

        // 触发回调
        onParamsChange?.(params, result)
      }
    } catch (error) {
      console.error('主题计算失败:', error)
      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : '计算主题时发生未知错误',
          isCalculating: false
        }))
      }
    }
  }, [onParamsChange])

  /**
   * 更新参数
   */
  const updateParams = useCallback((
    updates: Partial<TwentySixParams> | ((prev: TwentySixParams) => TwentySixParams),
    immediate = false
  ) => {
    setState(prev => {
      const newParams = typeof updates === 'function' ? updates(prev.params) : { ...prev.params, ...updates }

      // 异步计算主题
      if (calculationTimerRef.current) {
        clearTimeout(calculationTimerRef.current)
      }

      const calculateDelay = immediate ? 0 : 150 // 150ms 防抖

      calculationTimerRef.current = setTimeout(() => {
        calculateTheme(newParams)
      }, calculateDelay)

      return {
        ...prev,
        params: newParams
      }
    })
  }, [calculateTheme])

  // 初始化时计算主题
  useEffect(() => {
    calculateTheme(state.params, true)

    return () => {
      mountedRef.current = false
      if (calculationTimerRef.current) {
        clearTimeout(calculationTimerRef.current)
      }
    }
  }, [])

  // ============================================================================
  // 事件处理
  // ============================================================================

  /**
   * 处理参数更新
   */
  const handleParamChange = useCallback((
    paramPath: string,
    value: any
  ) => {
    updateParams(prev => {
      const newParams = { ...prev }
      const parts = paramPath.split('.')
      let current: any = newParams

      // 导航到目标属性
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) {
          current[parts[i]] = {}
        }
        current = current[parts[i]]
      }

      // 设置值
      current[parts[parts.length - 1]] = value

      return newParams
    })
  }, [updateParams])

  /**
   * 切换标签页
   */
  const handleTabChange = useCallback((tab: ConfiguratorState['activeTab']) => {
    setState(prev => ({ ...prev, activeTab: tab }))
  }, [])

  /**
   * 应用预设主题
   */
  const handlePresetApply = useCallback((preset: PresetTheme) => {
    updateParams(preset.parameters, true)
    setState(prev => ({ ...prev, showPresets: false }))
  }, [updateParams])

  /**
   * 重置为默认值
   */
  const handleReset = useCallback(() => {
    updateParams(resetToDefaults(), true)
  }, [updateParams])

  /**
   * 切换预设面板
   */
  const togglePresets = useCallback(() => {
    setState(prev => ({ ...prev, showPresets: !prev.showPresets }))
  }, [])

  /**
   * 切换导出面板
   */
  const toggleExport = useCallback(() => {
    setState(prev => ({ ...prev, showExport: !prev.showExport }))
  }, [])

  // ============================================================================
  // 计算属性
  // ============================================================================

  const paramCounts = useMemo(() => getParamCounts(), [])
  const isDirty = useMemo(() => {
    // 检查是否有未保存的修改
    return JSON.stringify(state.params) !== JSON.stringify(DEFAULT_TWENTY_SIX_PARAMS)
  }, [state.params])

  // ============================================================================
  // 渲染
  // ============================================================================

  return (
    <div
      className={`theme-configurator ${className}`}
      style={{ height }}
    >
      {/* 顶部工具栏 */}
      <div className="theme-configurator__header">
        <div className="theme-configurator__header-left">
          <h2 className="theme-configurator__title">
            高级主题配置器
          </h2>
          <span className="theme-configurator__subtitle">
            {paramCounts.total} 个参数
          </span>
        </div>

        <div className="theme-configurator__header-right">
          {showPresets && (
            <button
              className="theme-configurator__btn"
              onClick={togglePresets}
              title="选择预设主题"
            >
              🎨 预设
            </button>
          )}

          {showExport && (
            <button
              className="theme-configurator__btn"
              onClick={toggleExport}
              title="导出主题"
            >
              📤 导出
            </button>
          )}

          <button
            className="theme-configurator__btn"
            onClick={handleReset}
            title="重置为默认值"
          >
            🔄 重置
          </button>

          {isDirty && (
            <span className="theme-configurator__dirty-indicator">
              有未保存的修改
            </span>
          )}
        </div>
      </div>

      {/* 错误显示 */}
      <AnimatePresence>
        {state.error && (
          <motion.div
            className="theme-configurator__error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            ⚠️ {state.error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 主内容区域 */}
      <div className="theme-configurator__content">
        {/* 左侧控制面板 */}
        <div className="theme-configurator__controls">
          {/* 标签导航 */}
          <div className="theme-configurator__tabs">
            <button
              className={`theme-configurator__tab ${
                state.activeTab === 'seven-axis' ? 'active' : ''
              }`}
              onClick={() => handleTabChange('seven-axis')}
            >
              七轴核心
              <span className="theme-configurator__tab-count">{paramCounts.sevenAxis}</span>
            </button>
            <button
              className={`theme-configurator__tab ${
                state.activeTab === 'fonts' ? 'active' : ''
              }`}
              onClick={() => handleTabChange('fonts')}
            >
              字体系统
              <span className="theme-configurator__tab-count">{paramCounts.fonts}</span>
            </button>
            <button
              className={`theme-configurator__tab ${
                state.activeTab === 'sizes' ? 'active' : ''
              }`}
              onClick={() => handleTabChange('sizes')}
            >
              尺寸比例
              <span className="theme-configurator__tab-count">{paramCounts.sizes}</span>
            </button>
            <button
              className={`theme-configurator__tab ${
                state.activeTab === 'spacing' ? 'active' : ''
              }`}
              onClick={() => handleTabChange('spacing')}
            >
              间距系统
              <span className="theme-configurator__tab-count">{paramCounts.spacing}</span>
            </button>
          </div>

          {/* 控制面板内容 */}
          <div className="theme-configurator__tab-content">
            <AnimatePresence mode="wait">
              {state.activeTab === 'seven-axis' && (
                <motion.div
                  key="seven-axis"
                  initial={animated ? { opacity: 0, x: -20 } : false}
                  animate={animated ? { opacity: 1, x: 0 } : false}
                  exit={animated ? { opacity: 0, x: 20 } : false}
                  transition={{ duration: 0.2 }}
                >
                  <SevenAxisControls
                    params={state.params}
                    onChange={handleParamChange}
                  />
                </motion.div>
              )}

              {state.activeTab === 'fonts' && (
                <motion.div
                  key="fonts"
                  initial={animated ? { opacity: 0, x: -20 } : false}
                  animate={animated ? { opacity: 1, x: 0 } : false}
                  exit={animated ? { opacity: 0, x: 20 } : false}
                  transition={{ duration: 0.2 }}
                >
                  <FontSystemEditor
                    params={state.params}
                    onChange={handleParamChange}
                  />
                </motion.div>
              )}

              {state.activeTab === 'sizes' && (
                <motion.div
                  key="sizes"
                  initial={animated ? { opacity: 0, x: -20 } : false}
                  animate={animated ? { opacity: 1, x: 0 } : false}
                  exit={animated ? { opacity: 0, x: 20 } : false}
                  transition={{ duration: 0.2 }}
                >
                  <SizeScaleEditor
                    params={state.params}
                    onChange={handleParamChange}
                  />
                </motion.div>
              )}

              {state.activeTab === 'spacing' && (
                <motion.div
                  key="spacing"
                  initial={animated ? { opacity: 0, x: -20 } : false}
                  animate={animated ? { opacity: 1, x: 0 } : false}
                  exit={animated ? { opacity: 0, x: 20 } : false}
                  transition={{ duration: 0.2 }}
                >
                  <SpacingSystemEditor
                    params={state.params}
                    onChange={handleParamChange}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 右侧预览区域 */}
        <div className="theme-configurator__preview">
          {customPreview ? (
            <customPreview params={state.params} />
          ) : (
            <ThemePreview
              params={state.params}
              calculatedResult={state.calculatedResult}
              isCalculating={state.isCalculating}
              animated={animated}
            />
          )}
        </div>
      </div>

      {/* 预设主题选择器 */}
      <AnimatePresence>
        {state.showPresets && (
          <PresetThemeSelector
            themes={presetThemes || []}
            onSelect={handlePresetApply}
            onClose={() => setState(prev => ({ ...prev, showPresets: false }))}
          />
        )}
      </AnimatePresence>

      {/* 主题导出器 */}
      <AnimatePresence>
        {state.showExport && (
          <ThemeExporter
            params={state.params}
            calculatedResult={state.calculatedResult}
            onClose={() => setState(prev => ({ ...prev, showExport: false }))}
          />
        )}
      </AnimatePresence>

      {/* 计算指示器 */}
      <AnimatePresence>
        {state.isCalculating && (
          <motion.div
            className="theme-configurator__calculating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="theme-configurator__spinner" />
            <span>正在计算主题...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// 便捷Hook
// ============================================================================

/**
 * 使用高级主题配置的Hook
 */
export function useAdvancedTheme() {
  const [params, setParams] = useState<TwentySixParams>(DEFAULT_TWENTY_SIX_PARAMS)
  const [result, setResult] = useState<ThemeCalculationResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const updateParams = useCallback((updates: Partial<TwentySixParams> | ((prev: TwentySixParams) => TwentySixParams)) => {
    setParams(prev => {
      const newParams = typeof updates === 'function' ? updates(prev) : { ...prev, ...updates }
      setIsCalculating(true)

      // 异步计算
      calculateAdvancedTheme(newParams)
        .then(setResult)
        .finally(() => setIsCalculating(false))

      return newParams
    })
  }, [])

  const reset = useCallback(() => {
    updateParams(resetToDefaults())
  }, [updateParams])

  return {
    params,
    result,
    isCalculating,
    updateParams,
    reset
  }
}

// ============================================================================
// 导出
// ============================================================================

export default {
  ThemeConfigurator,
  useAdvancedTheme
}
