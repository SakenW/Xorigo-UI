/**
 * 🔍 对比度选择器 - 控制视觉对比度
 */

import React from 'react'
import { motion } from 'framer-motion'
import type { ContrastConfig } from '../../twenty-six-params'
import './ContrastSelector.css'

export interface ContrastSelectorProps {
  value: ContrastConfig
  onChange: (value: ContrastConfig) => void
  disabled?: boolean
  className?: string
}

const CONTRAST_OPTIONS = [
  {
    value: 'low' as const,
    label: '低对比',
    description: '柔和的视觉效果',
    ratio: 0.3
  },
  {
    value: 'normal' as const,
    label: '标准对比',
    description: '适合大多数场景',
    ratio: 0.5
  },
  {
    value: 'high' as const,
    label: '高对比',
    description: '清晰的视觉层次',
    ratio: 0.7
  },
  {
    value: 'custom' as const,
    label: '自定义',
    description: '手动调节对比度',
    ratio: value.ratio
  }
]

export const ContrastSelector: React.FC<ContrastSelectorProps> = ({
  value,
  onChange,
  disabled = false,
  className = ''
}) => {
  const handleLevelChange = (level: 'low' | 'normal' | 'high' | 'custom') => {
    if (disabled) return
    const option = CONTRAST_OPTIONS.find(opt => opt.value === level)
    onChange({
      level,
      ratio: option?.ratio || value.ratio
    })
  }

  const handleRatioChange = (ratio: number) => {
    if (disabled) return
    onChange({ ...value, ratio, level: 'custom' })
  }

  return (
    <div className={`contrast-selector ${className}`}>
      <div className="contrast-selector__header">
        <h4 className="contrast-selector__title">
          <span className="contrast-selector__icon">🔍</span>
          对比度控制
        </h4>
        <p className="contrast-selector__description">
          控制元素间的视觉对比度
        </p>
      </div>

      {/* 对比度级别选择 */}
      <div className="contrast-selector__grid">
        {CONTRAST_OPTIONS.map((option) => (
          <motion.button
            key={option.value}
            className={`contrast-selector__option ${
              value.level === option.value ? 'active' : ''
            } ${disabled ? 'disabled' : ''}`}
            onClick={() => handleLevelChange(option.value)}
            disabled={disabled}
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
          >
            <div className="contrast-selector__option-preview">
              <div
                className="contrast-selector__option-bar"
                style={{
                  background: `linear-gradient(to bottom,
                    hsl(240, 50%, ${option.ratio < 0.5 ? 80 : 20}%),
                    hsl(240, 50%, ${option.ratio < 0.5 ? 20 : 80}%))`
                }}
              />
            </div>
            <div className="contrast-selector__option-content">
              <span className="contrast-selector__option-label">
                {option.label}
              </span>
              <span className="contrast-selector__option-description">
                {option.description}
              </span>
            </div>
            {value.level === option.value && (
              <motion.div
                className="contrast-selector__option-check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                ✓
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {/* 自定义滑块 */}
      {value.level === 'custom' && (
        <motion.div
          className="contrast-selector__custom"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <label className="contrast-selector__custom-label">
            <span>对比度比率</span>
            <span className="contrast-selector__custom-value">
              {Math.round(value.ratio * 100)}%
            </span>
          </label>

          <div className="contrast-selector__custom-input">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={value.ratio}
              onChange={(e) => handleRatioChange(parseFloat(e.target.value))}
              disabled={disabled}
              className="contrast-selector__custom-range"
            />
          </div>

          <div className="contrast-selector__ticks">
            <span className="contrast-selector__tick">低 (0%)</span>
            <span className="contrast-selector__tick">中 (50%)</span>
            <span className="contrast-selector__tick">高 (100%)</span>
          </div>
        </motion.div>
      )}

      {/* WCAG 检查 */}
      <div className="contrast-selector__wcag">
        <h5 className="contrast-selector__wcag-title">可访问性检查</h5>
        <div className="contrast-selector__wcag-check">
          <div className="contrast-selector__wcag-item">
            <span className="contrast-selector__wcag-label">WCAG AA</span>
            <span className={`contrast-selector__wcag-status ${
              value.ratio >= 0.4 ? 'pass' : 'fail'
            }`}>
              {value.ratio >= 0.4 ? '✓ 通过' : '✗ 未通过'}
            </span>
          </div>
          <div className="contrast-selector__wcag-item">
            <span className="contrast-selector__wcag-label">WCAG AAA</span>
            <span className={`contrast-selector__wcag-status ${
              value.ratio >= 0.6 ? 'pass' : 'fail'
            }`}>
              {value.ratio >= 0.6 ? '✓ 通过' : '✗ 未通过'}
            </span>
          </div>
        </div>

        {/* 实时预览 */}
        <div className="contrast-selector__live-preview">
          <div
            className="contrast-selector__preview-text"
            style={{
              color: `hsl(240, 50%, ${value.ratio < 0.5 ? 90 : 10}%)`,
              background: `hsl(240, 50%, ${value.ratio < 0.5 ? 10 : 90}%)`
            }}
          >
            文本对比度示例
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContrastSelector
