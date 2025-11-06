/**
 * 📏 密度选择器 - 控制空间紧凑度
 */

import React from 'react'
import { motion } from 'framer-motion'
import type { DensityConfig } from '../../twenty-six-params'
import './DensitySelector.css'

export interface DensitySelectorProps {
  value: DensityConfig
  onChange: (value: DensityConfig) => void
  disabled?: boolean
  className?: string
}

const DENSITY_OPTIONS = [
  {
    value: 'compact' as const,
    label: '紧凑',
    icon: '📦',
    description: '节省空间，更密实的布局',
    multiplier: 0.85
  },
  {
    value: 'comfortable' as const,
    label: '舒适',
    icon: '📐',
    description: '适中的间距和尺寸',
    multiplier: 1.0
  },
  {
    value: 'spacious' as const,
    label: '宽松',
    icon: '🏞️',
    description: '更多的留白，更易读',
    multiplier: 1.15
  }
]

export const DensitySelector: React.FC<DensitySelectorProps> = ({
  value,
  onChange,
  disabled = false,
  className = ''
}) => {
  const handleLevelChange = (level: 'compact' | 'comfortable' | 'spacious') => {
    if (disabled) return
    onChange({ ...value, level })
  }

  const handleCustomScaleChange = (customScale: number) => {
    if (disabled) return
    onChange({ ...value, customScale })
  }

  const getCurrentMultiplier = () => {
    const option = DENSITY_OPTIONS.find(opt => opt.value === value.level)
    return option ? option.multiplier : 1.0
  }

  return (
    <div className={`density-selector ${className}`}>
      <div className="density-selector__header">
        <h4 className="density-selector__title">
          <span className="density-selector__icon">📏</span>
          密度控制
        </h4>
        <p className="density-selector__description">
          控制布局的空间紧凑度
        </p>
      </div>

      {/* 密度级别选择 */}
      <div className="density-selector__grid">
        {DENSITY_OPTIONS.map((option) => (
          <motion.button
            key={option.value}
            className={`density-selector__option ${
              value.level === option.value ? 'active' : ''
            } ${disabled ? 'disabled' : ''}`}
            onClick={() => handleLevelChange(option.value)}
            disabled={disabled}
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
          >
            <div className="density-selector__option-icon">
              {option.icon}
            </div>
            <div className="density-selector__option-content">
              <span className="density-selector__option-label">
                {option.label}
              </span>
              <span className="density-selector__option-description">
                {option.description}
              </span>
              <span className="density-selector__option-multiplier">
                {Math.round(option.multiplier * 100)}%
              </span>
            </div>
            {value.level === option.value && (
              <motion.div
                className="density-selector__option-check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                ✓
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {/* 自定义比例滑块 */}
      <div className="density-selector__custom">
        <label className="density-selector__custom-label">
          <span>自定义比例</span>
          <span className="density-selector__custom-value">
            {value.customScale ? Math.round(value.customScale * 100) : Math.round(getCurrentMultiplier() * 100)}%
          </span>
        </label>

        <div className="density-selector__custom-input">
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.05"
            value={value.customScale || getCurrentMultiplier()}
            onChange={(e) => handleCustomScaleChange(parseFloat(e.target.value))}
            disabled={disabled}
            className="density-selector__custom-range"
          />

          <div className="density-selector__custom-ticks">
            <span className="density-selector__custom-tick">50%</span>
            <span className="density-selector__custom-tick">100%</span>
            <span className="density-selector__custom-tick">150%</span>
            <span className="density-selector__custom-tick">200%</span>
          </div>
        </div>

        {/* 预览框 */}
        <div className="density-selector__preview">
          <h5 className="density-selector__preview-title">布局预览</h5>
          <div
            className="density-selector__preview-box"
            style={{
              padding: `${8 * (value.customScale || getCurrentMultiplier())}px`,
              margin: `${4 * (value.customScale || getCurrentMultiplier())}px`
            }}
          >
            <div
              className="density-selector__preview-content"
              style={{
                height: `${20 * (value.customScale || getCurrentMultiplier())}px`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DensitySelector
