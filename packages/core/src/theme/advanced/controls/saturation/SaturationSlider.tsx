'use client'
/**
 * 🌈 饱和度滑块 - 控制颜色鲜艳度
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import type { SaturationConfig } from '../../twenty-six-params'
import './SaturationSlider.css'

// ============================================================================
// 接口定义
// ============================================================================

export interface SaturationSliderProps {
  /** 当前值 */
  value: SaturationConfig
  /** 变化回调 */
  onChange: (value: SaturationConfig) => void
  /** 是否禁用 */
  disabled?: boolean
  /** 自定义类名 */
  className?: string
}

// ============================================================================
// 策略选项
// ============================================================================

const STRATEGY_OPTIONS = [
  {
    value: 'uniform' as const,
    label: '统一',
    description: '所有颜色使用相同饱和度'
  },
  {
    value: 'adaptive' as const,
    label: '自适应',
    description: '根据色相智能调整'
  },
  {
    value: 'manual' as const,
    label: '手动',
    description: '每个颜色独立设置'
  }
]

// ============================================================================
// 主组件
// ============================================================================

export const SaturationSlider: React.FC<SaturationSliderProps> = ({
  value,
  onChange,
  disabled = false,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false)

  const handleFactorChange = (factor: number) => {
    if (disabled) return
    onChange({ ...value, factor })
  }

  const handleStrategyChange = (strategy: 'uniform' | 'adaptive' | 'manual') => {
    if (disabled) return
    onChange({ ...value, strategy })
  }

  // 生成渐变预览
  const generateGradient = () => {
    const steps = 10
    const colors = []
    for (let i = 0; i <= steps; i++) {
      const saturation = (i / steps) * value.factor
      colors.push(`hsl(240, ${saturation * 100}%, 50%)`)
    }
    return `linear-gradient(to right, ${colors.join(', ')})`
  }

  return (
    <div className={`saturation-slider ${className}`}>
      <div className="saturation-slider__header">
        <h4 className="saturation-slider__title">
          <span className="saturation-slider__icon">🌈</span>
          饱和度控制
        </h4>
        <p className="saturation-slider__description">
          调整颜色的鲜艳程度
        </p>
      </div>

      {/* 策略选择 */}
      <div className="saturation-slider__strategies">
        {STRATEGY_OPTIONS.map((option) => (
          <motion.button
            key={option.value}
            className={`saturation-slider__strategy ${
              value.strategy === option.value ? 'active' : ''
            } ${disabled ? 'disabled' : ''}`}
            onClick={() => handleStrategyChange(option.value)}
            disabled={disabled}
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
          >
            <span className="saturation-slider__strategy-label">{option.label}</span>
            <span className="saturation-slider__strategy-description">
              {option.description}
            </span>
            {value.strategy === option.value && (
              <motion.div
                className="saturation-slider__strategy-check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                ✓
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {/* 饱和度滑块 */}
      <div className="saturation-slider__control">
        <label className="saturation-slider__label">
          <span>饱和度强度</span>
          <span className="saturation-slider__value">
            {Math.round(value.factor * 100)}%
          </span>
        </label>

        <div className="saturation-slider__input-group">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={value.factor}
            onChange={(e) => handleFactorChange(parseFloat(e.target.value))}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            disabled={disabled}
            className="saturation-slider__range"
            style={{ background: generateGradient() }}
          />

          <div className="saturation-slider__ticks">
            <span className="saturation-slider__tick">0%</span>
            <span className="saturation-slider__tick">50%</span>
            <span className="saturation-slider__tick">100%</span>
          </div>
        </div>

        {/* 预览条 */}
        <div className="saturation-slider__preview">
          <div
            className="saturation-slider__preview-bar"
            style={{ background: generateGradient() }}
          />
          <div className="saturation-slider__preview-indicator">
            <div
              className="saturation-slider__preview-dot"
              style={{ left: `${value.factor * 100}%` }}
            />
          </div>
        </div>

        {/* 预设值 */}
        <div className="saturation-slider__presets">
          {[0, 0.3, 0.5, 0.7, 1].map((preset) => (
            <motion.button
              key={preset}
              className={`saturation-slider__preset ${
                Math.abs(value.factor - preset) < 0.01 ? 'active' : ''
              }`}
              onClick={() => handleFactorChange(preset)}
              disabled={disabled}
              whileHover={!disabled ? { scale: 1.1 } : {}}
              whileTap={!disabled ? { scale: 0.9 } : {}}
            >
              {Math.round(preset * 100)}%
            </motion.button>
          ))}
        </div>
      </div>

      {/* 实时预览 */}
      <div className="saturation-slider__live-preview">
        <h5 className="saturation-slider__live-title">实时预览</h5>
        <div className="saturation-slider__preview-colors">
          {['red', 'blue', 'green', 'yellow', 'purple'].map((colorName, index) => {
            const hue = index * 72 // 均匀分布色相
            const color = `hsl(${hue}, ${value.factor * 100}%, 50%)`
            return (
              <div
                key={colorName}
                className="saturation-slider__preview-color"
                style={{ background: color }}
                title={`${colorName}: ${color}`}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default SaturationSlider
