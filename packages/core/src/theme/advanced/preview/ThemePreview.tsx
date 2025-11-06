/**
 * 👁️ 主题预览组件 - 实时显示主题效果
 */

import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// 导入类型
import type { TwentySixParams, ThemeCalculationResult } from '../twenty-six-params'

// 导入预览子组件
import { ColorPalettePreview } from './ColorPalettePreview'
import { ComponentPreview } from './ComponentPreview'
import { TypographyPreview } from './TypographyPreview'
import { LayoutPreview } from './LayoutPreview'

// 样式
import './ThemePreview.css'

// ============================================================================
// 接口定义
// ============================================================================

export interface ThemePreviewProps {
  /** 当前参数 */
  params: TwentySixParams
  /** 计算结果 */
  calculatedResult: ThemeCalculationResult | null
  /** 是否正在计算 */
  isCalculating: boolean
  /** 是否显示动画 */
  animated?: boolean
  /** 自定义类名 */
  className?: string
}

// ============================================================================
// 主组件
// ============================================================================

/**
 * 主题预览组件
 */
export const ThemePreview: React.FC<ThemePreviewProps> = ({
  params,
  calculatedResult,
  isCalculating,
  animated = true,
  className = ''
}) => {
  // 生成预览用CSS变量
  const previewCSSVariables = useMemo(() => {
    if (!calculatedResult) return {}

    return calculatedResult.cssVariables
  }, [calculatedResult])

  return (
    <div className={`theme-preview ${className}`}>
      {/* 预览头部 */}
      <div className="theme-preview__header">
        <div className="theme-preview__title-section">
          <h3 className="theme-preview__title">
            实时预览
          </h3>
          <p className="theme-preview__description">
            查看26参数调整的实时效果
          </p>
        </div>

        {/* 计算状态 */}
        <AnimatePresence>
          {isCalculating && (
            <motion.div
              className="theme-preview__calculating"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="theme-preview__spinner" />
              <span>正在计算...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 应用CSS变量到预览区域 */}
      <div
        className="theme-preview__canvas"
        style={previewCSSVariables}
      >
        {/* 颜色调色板预览 */}
        <motion.section
          className="theme-preview__section"
          initial={animated ? { opacity: 0, y: 20 } : false}
          animate={animated ? { opacity: 1, y: 0 } : false}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <ColorPalettePreview
            params={params}
            calculatedResult={calculatedResult}
          />
        </motion.section>

        {/* 组件预览 */}
        <motion.section
          className="theme-preview__section"
          initial={animated ? { opacity: 0, y: 20 } : false}
          animate={animated ? { opacity: 1, y: 0 } : false}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <ComponentPreview
            params={params}
            calculatedResult={calculatedResult}
          />
        </motion.section>

        {/* 字体预览 */}
        <motion.section
          className="theme-preview__section"
          initial={animated ? { opacity: 0, y: 20 } : false}
          animate={animated ? { opacity: 1, y: 0 } : false}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <TypographyPreview
            params={params}
            calculatedResult={calculatedResult}
          />
        </motion.section>

        {/* 布局预览 */}
        <motion.section
          className="theme-preview__section"
          initial={animated ? { opacity: 0, y: 20 } : false}
          animate={animated ? { opacity: 1, y: 0 } : false}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <LayoutPreview
            params={params}
            calculatedResult={calculatedResult}
          />
        </motion.section>
      </div>

      {/* 参数概览 */}
      <motion.div
        className="theme-preview__overview"
        initial={animated ? { opacity: 0 } : false}
        animate={animated ? { opacity: 1 } : false}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <h4 className="theme-preview__overview-title">配置概览</h4>
        <div className="theme-preview__overview-grid">
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
        </div>

        {/* 性能信息 */}
        {calculatedResult && (
          <div className="theme-preview__performance">
            <span className="theme-preview__performance-label">
              计算耗时:
            </span>
            <span className="theme-preview__performance-value">
              {calculatedResult.metadata.calculationTime.toFixed(2)}ms
            </span>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default ThemePreview
