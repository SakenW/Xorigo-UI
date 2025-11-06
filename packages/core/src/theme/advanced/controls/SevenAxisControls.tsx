/**
 * 🎛️ 七轴核心控制组件
 *
 * 控制七轴主题系统的7个核心参数：
 * 1. 模式轴 (Mode)
 * 2. 色调轴 (Hue)
 * 3. 饱和度轴 (Saturation)
 * 4. 亮度轴 (Lightness)
 * 5. 密度轴 (Density)
 * 6. 圆度轴 (Roundness)
 * 7. 对比度轴 (Contrast)
 */

import React from 'react'
import { motion } from 'framer-motion'

// 导入类型
import type { TwentySixParams } from '../twenty-six-params'

// 导入子控制组件
import { ModeSelector } from './mode/ModeSelector'
import { HueSelector } from './hue/HueSelector'
import { SaturationSlider } from './saturation/SaturationSlider'
import { LightnessSlider } from './lightness/LightnessSlider'
import { DensitySelector } from './density/DensitySelector'
import { RoundnessSlider } from './roundness/RoundnessSlider'
import { ContrastSelector } from './contrast/ContrastSelector'

// 样式
import './SevenAxisControls.css'

// ============================================================================
// 接口定义
// ============================================================================

export interface SevenAxisControlsProps {
  /** 当前参数 */
  params: TwentySixParams
  /** 参数变化回调 */
  onChange: (paramPath: string, value: any) => void
  /** 是否禁用 */
  disabled?: boolean
  /** 自定义类名 */
  className?: string
}

// ============================================================================
// 主组件
// ============================================================================

/**
 * 七轴核心控制面板
 */
export const SevenAxisControls: React.FC<SevenAxisControlsProps> = ({
  params,
  onChange,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={`seven-axis-controls ${className}`}>
      <motion.div
        className="seven-axis-controls__header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="seven-axis-controls__title">
          七轴核心系统
        </h3>
        <p className="seven-axis-controls__description">
          控制主题的7个核心参数
        </p>
      </motion.div>

      <div className="seven-axis-controls__grid">
        {/* 1. 模式轴 */}
        <motion.section
          className="seven-axis-controls__section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <ModeSelector
            value={params.mode}
            onChange={(value) => onChange('mode', value)}
            disabled={disabled}
          />
        </motion.section>

        {/* 2. 色调轴 */}
        <motion.section
          className="seven-axis-controls__section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <HueSelector
            primary={params.hue.primary}
            secondary={params.hue.secondary}
            accent={params.hue.accent}
            onPrimaryChange={(value) => onChange('hue.primary', value)}
            onSecondaryChange={(value) => onChange('hue.secondary', value)}
            onAccentChange={(value) => onChange('hue.accent', value)}
            disabled={disabled}
          />
        </motion.section>

        {/* 3. 饱和度轴 */}
        <motion.section
          className="seven-axis-controls__section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <SaturationSlider
            value={params.saturation}
            onChange={(value) => onChange('saturation', value)}
            disabled={disabled}
          />
        </motion.section>

        {/* 4. 亮度轴 */}
        <motion.section
          className="seven-axis-controls__section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <LightnessSlider
            value={params.lightness}
            onChange={(value) => onChange('lightness', value)}
            disabled={disabled}
          />
        </motion.section>

        {/* 5. 密度轴 */}
        <motion.section
          className="seven-axis-controls__section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <DensitySelector
            value={params.density}
            onChange={(value) => onChange('density', value)}
            disabled={disabled}
          />
        </motion.section>

        {/* 6. 圆度轴 */}
        <motion.section
          className="seven-axis-controls__section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <RoundnessSlider
            value={params.roundness}
            onChange={(value) => onChange('roundness', value)}
            disabled={disabled}
          />
        </motion.section>

        {/* 7. 对比度轴 */}
        <motion.section
          className="seven-axis-controls__section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <ContrastSelector
            value={params.contrast}
            onChange={(value) => onChange('contrast', value)}
            disabled={disabled}
          />
        </motion.section>
      </div>

      {/* 参数概览 */}
      <motion.div
        className="seven-axis-controls__overview"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.8 }}
      >
        <h4 className="seven-axis-controls__overview-title">当前配置概览</h4>
        <div className="seven-axis-controls__overview-grid">
          <div className="overview-item">
            <span className="overview-item__label">模式</span>
            <span className="overview-item__value">{params.mode.mode}</span>
          </div>
          <div className="overview-item">
            <span className="overview-item__label">主色调</span>
            <span className="overview-item__value">{params.hue.primary}°</span>
          </div>
          <div className="overview-item">
            <span className="overview-item__label">饱和度</span>
            <span className="overview-item__value">{Math.round(params.saturation.factor * 100)}%</span>
          </div>
          <div className="overview-item">
            <span className="overview-item__label">亮度</span>
            <span className="overview-item__value">{Math.round(params.lightness.factor * 100)}%</span>
          </div>
          <div className="overview-item">
            <span className="overview-item__label">密度</span>
            <span className="overview-item__value">{params.density.level}</span>
          </div>
          <div className="overview-item">
            <span className="overview-item__label">圆度</span>
            <span className="overview-item__value">{Math.round(params.roundness.level * 100)}%</span>
          </div>
          <div className="overview-item">
            <span className="overview-item__label">对比度</span>
            <span className="overview-item__value">{params.contrast.level}</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default SevenAxisControls
