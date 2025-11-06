/**
 * ☀️ 亮度滑块 - 控制颜色明暗
 */

import React from 'react'
import { motion } from 'framer-motion'
import type { LightnessConfig } from '../../twenty-six-params'
import './LightnessSlider.css'

export interface LightnessSliderProps {
  value: LightnessConfig
  onChange: (value: LightnessConfig) => void
  disabled?: boolean
  className?: string
}

export const LightnessSlider: React.FC<LightnessSliderProps> = ({
  value,
  onChange,
  disabled = false,
  className = ''
}) => {
  const handleFactorChange = (factor: number) => {
    if (disabled) return
    onChange({ ...value, factor })
  }

  const handleContrastChange = (contrast: number) => {
    if (disabled) return
    onChange({ ...value, contrast })
  }

  const generateLightnessGradient = () => {
    const steps = 10
    const colors = []
    for (let i = 0; i <= steps; i++) {
      const lightness = i / steps
      colors.push(`hsl(240, 50%, ${lightness * 100}%)`)
    }
    return `linear-gradient(to right, ${colors.join(', ')})`
  }

  const generateContrastGradient = () => {
    return `linear-gradient(to right,
      hsl(240, 50%, 30%) 0%,
      hsl(240, 50%, ${value.factor * 100}%) 50%,
      hsl(240, 50%, 70%) 100%
    )`
  }

  return (
    <div className={`lightness-slider ${className}`}>
      <div className="lightness-slider__header">
        <h4 className="lightness-slider__title">
          <span className="lightness-slider__icon">☀️</span>
          亮度控制
        </h4>
        <p className="lightness-slider__description">
          调整颜色的明暗和对比度
        </p>
      </div>

      {/* 亮度滑块 */}
      <div className="lightness-slider__control">
        <label className="lightness-slider__label">
          <span>基础亮度</span>
          <span className="lightness-slider__value">
            {Math.round(value.factor * 100)}%
          </span>
        </label>

        <div className="lightness-slider__input-group">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={value.factor}
            onChange={(e) => handleFactorChange(parseFloat(e.target.value))}
            disabled={disabled}
            className="lightness-slider__range"
            style={{ background: generateLightnessGradient() }}
          />
        </div>

        <div className="lightness-slider__preview">
          <div
            className="lightness-slider__preview-bar"
            style={{ background: generateLightnessGradient() }}
          />
          <div className="lightness-slider__preview-indicator">
            <div
              className="lightness-slider__preview-dot"
              style={{ left: `${value.factor * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 对比度滑块 */}
      <div className="lightness-slider__control">
        <label className="lightness-slider__label">
          <span>对比度</span>
          <span className="lightness-slider__value">
            {Math.round(value.contrast * 100)}%
          </span>
        </label>

        <div className="lightness-slider__input-group">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={value.contrast}
            onChange={(e) => handleContrastChange(parseFloat(e.target.value))}
            disabled={disabled}
            className="lightness-slider__range"
            style={{ background: generateContrastGradient() }}
          />
        </div>

        <div className="lightness-slider__preview">
          <div
            className="lightness-slider__preview-bar"
            style={{ background: generateContrastGradient() }}
          />
          <div className="lightness-slider__preview-indicator">
            <div
              className="lightness-slider__preview-dot"
              style={{ left: `${value.contrast * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 实时预览 */}
      <div className="lightness-slider__live-preview">
        <h5 className="lightness-slider__live-title">亮度预览</h5>
        <div className="lightness-slider__preview-colors">
          {[0, 20, 40, 60, 80, 100].map((lightness) => (
            <div
              key={lightness}
              className="lightness-slider__preview-color"
              style={{
                background: `hsl(240, 50%, ${lightness}%)`,
                opacity: 0.3 + (value.factor * 0.7)
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default LightnessSlider
