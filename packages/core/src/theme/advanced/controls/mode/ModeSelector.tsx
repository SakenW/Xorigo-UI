/**
 * ☀️ 模式选择器 - 亮/暗/自动/怀旧模式
 */

import React from 'react'
import { motion } from 'framer-motion'
import type { ModeConfig } from '../../twenty-six-params'
import './ModeSelector.css'

// ============================================================================
// 接口定义
// ============================================================================

export interface ModeSelectorProps {
  /** 当前值 */
  value: ModeConfig
  /** 变化回调 */
  onChange: (value: ModeConfig) => void
  /** 是否禁用 */
  disabled?: boolean
  /** 自定义类名 */
  className?: string
}

// ============================================================================
// 模式选项
// ============================================================================

const MODE_OPTIONS = [
  {
    value: 'light',
    label: '浅色模式',
    icon: '☀️',
    description: '明亮的浅色主题'
  },
  {
    value: 'dark',
    label: '深色模式',
    icon: '🌙',
    description: '护眼的深色主题'
  },
  {
    value: 'auto',
    label: '自动模式',
    icon: '🖥️',
    description: '跟随系统设置'
  },
  {
    value: 'sepia',
    label: '怀旧模式',
    icon: '📜',
    description: '温暖的复古色调'
  }
] as const

// ============================================================================
// 主组件
// ============================================================================

/**
 * 模式选择器
 */
export const ModeSelector: React.FC<ModeSelectorProps> = ({
  value,
  onChange,
  disabled = false,
  className = ''
}) => {
  const handleModeChange = (mode: 'light' | 'dark' | 'auto' | 'sepia') => {
    if (disabled) return

    onChange({
      ...value,
      mode,
      sepiaIntensity: mode === 'sepia' ? 0.3 : 0
    })
  }

  const handleSepiaIntensityChange = (intensity: number) => {
    if (disabled || value.mode !== 'sepia') return

    onChange({
      ...value,
      sepiaIntensity: intensity
    })
  }

  return (
    <div className={`mode-selector ${className}`}>
      <div className="mode-selector__header">
        <h4 className="mode-selector__title">
          <span className="mode-selector__icon">🎨</span>
          主题模式
        </h4>
        <p className="mode-selector__description">
          选择主题的基础外观
        </p>
      </div>

      <div className="mode-selector__grid">
        {MODE_OPTIONS.map((option) => (
          <motion.button
            key={option.value}
            className={`mode-selector__option ${
              value.mode === option.value ? 'active' : ''
            } ${disabled ? 'disabled' : ''}`}
            onClick={() => handleModeChange(option.value)}
            disabled={disabled}
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mode-selector__option-icon">
              {option.icon}
            </div>
            <div className="mode-selector__option-content">
              <span className="mode-selector__option-label">
                {option.label}
              </span>
              <span className="mode-selector__option-description">
                {option.description}
              </span>
            </div>
            {value.mode === option.value && (
              <motion.div
                className="mode-selector__option-check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                ✓
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {/* 怀旧模式强度滑块 */}
      {value.mode === 'sepia' && (
        <motion.div
          className="mode-selector__sepia-control"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <label className="mode-selector__sepia-label">
            <span>怀旧强度</span>
            <span className="mode-selector__sepia-value">
              {Math.round(value.sepiaIntensity * 100)}%
            </span>
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={value.sepiaIntensity}
            onChange={(e) => handleSepiaIntensityChange(parseFloat(e.target.value))}
            className="mode-selector__sepia-slider"
            disabled={disabled}
          />
          <div className="mode-selector__sepia-preview">
            <div
              className="mode-selector__sepia-color"
              style={{
                background: `linear-gradient(to right,
                  rgb(245, 245, 220) 0%,
                  rgb(210, 180, 140) ${value.sepiaIntensity * 100}%,
                  rgb(139, 115, 85) 100%)`
              }}
            />
          </div>
        </motion.div>
      )}

      {/* 系统检测状态 */}
      {value.mode === 'auto' && (
        <motion.div
          className="mode-selector__system-status"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="mode-selector__system-icon">
            {window.matchMedia('(prefers-color-scheme: dark)').matches ? '🌙' : '☀️'}
          </span>
          <span className="mode-selector__system-text">
            当前系统偏好：
            <strong>
              {window.matchMedia('(prefers-color-scheme: dark)').matches ? '深色' : '浅色'}
            </strong>
          </span>
        </motion.div>
      )}
    </div>
  )
}

export default ModeSelector
