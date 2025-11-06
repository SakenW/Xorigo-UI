/**
 * ⭕ 圆度滑块 - 控制边角圆润度
 */

import React from 'react'
import { motion } from 'framer-motion'
import type { RoundnessConfig } from '../../twenty-six-params'
import './RoundnessSlider.css'

export interface RoundnessSliderProps {
  value: RoundnessConfig
  onChange: (value: RoundnessConfig) => void
  disabled?: boolean
  className?: string
}

export const RoundnessSlider: React.FC<RoundnessSliderProps> = ({
  value,
  onChange,
  disabled = false,
  className = ''
}) => {
  const handleLevelChange = (level: number) => {
    if (disabled) return
    onChange({ ...value, level })
  }

  const handleRadiusChange = (radius: number) => {
    if (disabled) return
    onChange({ ...value, radius })
  }

  const getPreviewRadius = () => {
    return value.radius * value.level
  }

  return (
    <div className={`roundness-slider ${className}`}>
      <div className="roundness-slider__header">
        <h4 className="roundness-slider__title">
          <span className="roundness-slider__icon">⭕</span>
          圆度控制
        </h4>
        <p className="roundness-slider__description">
          控制边角的圆润程度
        </p>
      </div>

      {/* 圆度级别滑块 */}
      <div className="roundness-slider__control">
        <label className="roundness-slider__label">
          <span>圆度级别</span>
          <span className="roundness-slider__value">
            {Math.round(value.level * 100)}%
          </span>
        </label>

        <div className="roundness-slider__input-group">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={value.level}
            onChange={(e) => handleLevelChange(parseFloat(e.target.value))}
            disabled={disabled}
            className="roundness-slider__range"
          />
        </div>

        <div className="roundness-slider__presets">
          {[0, 0.25, 0.5, 0.75, 1].map((preset) => (
            <motion.button
              key={preset}
              className={`roundness-slider__preset ${
                Math.abs(value.level - preset) < 0.01 ? 'active' : ''
              }`}
              onClick={() => handleLevelChange(preset)}
              disabled={disabled}
              whileHover={!disabled ? { scale: 1.1 } : {}}
              whileTap={!disabled ? { scale: 0.9 } : {}}
            >
              {Math.round(preset * 100)}%
            </motion.button>
          ))}
        </div>
      </div>

      {/* 基础圆角半径滑块 */}
      <div className="roundness-slider__control">
        <label className="roundness-slider__label">
          <span>基础圆角 (px)</span>
          <span className="roundness-slider__value">
            {value.radius}px
          </span>
        </label>

        <div className="roundness-slider__input-group">
          <input
            type="range"
            min="0"
            max="32"
            step="1"
            value={value.radius}
            onChange={(e) => handleRadiusChange(parseInt(e.target.value))}
            disabled={disabled}
            className="roundness-slider__range"
          />
        </div>

        <div className="roundness-slider__ticks">
          <span className="roundness-slider__tick">0px</span>
          <span className="roundness-slider__tick">16px</span>
          <span className="roundness-slider__tick">32px</span>
        </div>
      </div>

      {/* 实时预览 */}
      <div className="roundness-slider__preview">
        <h5 className="roundness-slider__preview-title">圆角预览</h5>
        <div className="roundness-slider__preview-grid">
          {[0.25, 0.5, 0.75, 1].map((level) => (
            <div
              key={level}
              className="roundness-slider__preview-item"
              style={{
                borderRadius: `${getPreviewRadius() * level}px`
              }}
            >
              <span className="roundness-slider__preview-label">
                {Math.round(level * 100)}%
              </span>
            </div>
          ))}
        </div>

        {/* 当前设置预览 */}
        <div className="roundness-slider__current">
          <div
            className="roundness-slider__current-box"
            style={{
              borderRadius: `${getPreviewRadius()}px`
            }}
          />
          <div className="roundness-slider__current-info">
            <span className="roundness-slider__current-radius">
              圆角: {getPreviewRadius().toFixed(1)}px
            </span>
            <span className="roundness-slider__current-level">
              级别: {Math.round(value.level * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoundnessSlider
