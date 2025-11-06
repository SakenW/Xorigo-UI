/**
 * 🎨 色调选择器 - 360°色相环控制
 */

import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { PRESET_HUES } from '../../twenty-six-params'
import './HueSelector.css'

// ============================================================================
// 接口定义
// ============================================================================

export interface HueSelectorProps {
  /** 主色调 */
  primary: number
  /** 次色调（可选） */
  secondary?: number
  /** 强调色（可选） */
  accent?: number
  /** 主色调变化回调 */
  onPrimaryChange: (value: number) => void
  /** 次色调变化回调 */
  onSecondaryChange?: (value: number) => void
  /** 强调色变化回调 */
  onAccentChange?: (value: number) => void
  /** 是否禁用 */
  disabled?: boolean
  /** 是否显示次色调 */
  showSecondary?: boolean
  /** 是否显示强调色 */
  showAccent?: boolean
  /** 自定义类名 */
  className?: string
}

// ============================================================================
// 主组件
// ============================================================================

/**
 * 360°色相环选择器
 */
export const HueSelector: React.FC<HueSelectorProps> = ({
  primary,
  secondary,
  accent,
  onPrimaryChange,
  onSecondaryChange,
  onAccentChange,
  disabled = false,
  showSecondary = true,
  showAccent = true,
  className = ''
}) => {
  const colorWheelRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [activeChannel, setActiveChannel] = useState<'primary' | 'secondary' | 'accent'>('primary')

  // ============================================================================
  // 色相环交互
  // ============================================================================

  /**
   * 处理色相环点击
   */
  const handleWheelClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !colorWheelRef.current) return

    const rect = colorWheelRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = event.clientX - centerX
    const deltaY = event.clientY - centerY

    // 计算角度 (-180 到 180)
    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)

    // 转换为 0-360
    if (angle < 0) {
      angle += 360
    }

    // 应用到当前活动通道
    switch (activeChannel) {
      case 'primary':
        onPrimaryChange(angle)
        break
      case 'secondary':
        onSecondaryChange?.(angle)
        break
      case 'accent':
        onAccentChange?.(angle)
        break
    }
  }

  /**
   * 处理拖拽开始
   */
  const handleDragStart = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return
    setIsDragging(true)
    handleWheelClick(event)
  }

  /**
   * 处理全局鼠标移动
   */
  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (event: MouseEvent) => {
      if (!colorWheelRef.current) return

      const rect = colorWheelRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaX = event.clientX - centerX
      const deltaY = event.clientY - centerY

      let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)
      if (angle < 0) {
        angle += 360
      }

      // 限制在色相环范围内
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      const radius = rect.width / 2
      const innerRadius = radius * 0.3

      if (distance >= innerRadius && distance <= radius) {
        switch (activeChannel) {
          case 'primary':
            onPrimaryChange(angle)
            break
          case 'secondary':
            onSecondaryChange?.(angle)
            break
          case 'accent':
            onAccentChange?.(angle)
            break
        }
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, activeChannel, onPrimaryChange, onSecondaryChange, onAccentChange])

  // ============================================================================
  // 工具函数
  // ============================================================================

  /**
   * 获取色相对应的颜色
   */
  const getHueColor = (hue: number): string => {
    return `hsl(${hue}, 70%, 50%)`
  }

  /**
   * 获取指示器位置
   */
  const getIndicatorPosition = (hue: number, radius: number, innerRadius: number) => {
    const angle = (hue - 90) * (Math.PI / 180) // -90度使0度在顶部
    const distance = (radius + innerRadius) / 2
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance
    }
  }

  // ============================================================================
  // 渲染
  // ============================================================================

  const wheelSize = 240
  const radius = wheelSize / 2 - 20
  const innerRadius = radius * 0.3

  const primaryPos = getIndicatorPosition(primary, radius, innerRadius)
  const secondaryPos = secondary !== undefined ? getIndicatorPosition(secondary, radius, innerRadius) : null
  const accentPos = accent !== undefined ? getIndicatorPosition(accent, radius, innerRadius) : null

  return (
    <div className={`hue-selector ${className}`}>
      <div className="hue-selector__header">
        <h4 className="hue-selector__title">
          <span className="hue-selector__icon">🎨</span>
          色调控制
        </h4>
        <p className="hue-selector__description">
          选择主色调、次色调和强调色
        </p>
      </div>

      {/* 活动通道选择器 */}
      <div className="hue-selector__channels">
        <motion.button
          className={`hue-selector__channel ${activeChannel === 'primary' ? 'active' : ''}`}
          onClick={() => setActiveChannel('primary')}
          disabled={disabled}
          whileHover={!disabled ? { scale: 1.05 } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
        >
          <span className="hue-selector__channel-color" style={{ background: getHueColor(primary) }} />
          <span className="hue-selector__channel-label">主色调</span>
          <span className="hue-selector__channel-value">{Math.round(primary)}°</span>
        </motion.button>

        {showSecondary && onSecondaryChange && (
          <motion.button
            className={`hue-selector__channel ${activeChannel === 'secondary' ? 'active' : ''}`}
            onClick={() => setActiveChannel('secondary')}
            disabled={disabled}
            whileHover={!disabled ? { scale: 1.05 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
          >
            <span className="hue-selector__channel-color" style={{ background: getHueColor(secondary || 0) }} />
            <span className="hue-selector__channel-label">次色调</span>
            <span className="hue-selector__channel-value">
              {secondary !== undefined ? `${Math.round(secondary)}°` : '未设置'}
            </span>
          </motion.button>
        )}

        {showAccent && onAccentChange && (
          <motion.button
            className={`hue-selector__channel ${activeChannel === 'accent' ? 'active' : ''}`}
            onClick={() => setActiveChannel('accent')}
            disabled={disabled}
            whileHover={!disabled ? { scale: 1.05 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
          >
            <span className="hue-selector__channel-color" style={{ background: getHueColor(accent || 0) }} />
            <span className="hue-selector__channel-label">强调色</span>
            <span className="hue-selector__channel-value">
              {accent !== undefined ? `${Math.round(accent)}°` : '未设置'}
            </span>
          </motion.button>
        )}
      </div>

      {/* 色相环 */}
      <div className="hue-selector__wheel-container">
        <div
          ref={colorWheelRef}
          className={`hue-selector__wheel ${disabled ? 'disabled' : ''}`}
          style={{
            width: wheelSize,
            height: wheelSize
          }}
          onClick={handleWheelClick}
          onMouseDown={handleDragStart}
        >
          {/* 彩色环 */}
          <div
            className="hue-selector__wheel-bg"
            style={{
              background: `conic-gradient(
                from 0deg,
                hsl(0, 70%, 50%),
                hsl(60, 70%, 50%),
                hsl(120, 70%, 50%),
                hsl(180, 70%, 50%),
                hsl(240, 70%, 50%),
                hsl(300, 70%, 50%),
                hsl(360, 70%, 50%)
              )`
            }}
          />

          {/* 主色调指示器 */}
          <motion.div
            className="hue-selector__indicator primary"
            style={{
              left: `calc(50% + ${primaryPos.x}px - 8px)`,
              top: `calc(50% + ${primaryPos.y}px - 8px)`,
              background: getHueColor(primary)
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />

          {/* 次色调指示器 */}
          {secondaryPos && (
            <motion.div
              className="hue-selector__indicator secondary"
              style={{
                left: `calc(50% + ${secondaryPos.x}px - 6px)`,
                top: `calc(50% + ${secondaryPos.y}px - 6px)`,
                background: getHueColor(secondary!)
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30, delay: 0.1 }}
            />
          )}

          {/* 强调色指示器 */}
          {accentPos && (
            <motion.div
              className="hue-selector__indicator accent"
              style={{
                left: `calc(50% + ${accentPos.x}px - 6px)`,
                top: `calc(50% + ${accentPos.y}px - 6px)`,
                background: getHueColor(accent!)
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30, delay: 0.2 }}
            />
          )}
        </div>

        {/* 快捷预设 */}
        <div className="hue-selector__presets">
          <h5 className="hue-selector__presets-title">快捷选择</h5>
          <div className="hue-selector__presets-grid">
            {PRESET_HUES.slice(0, 8).map((preset) => (
              <motion.button
                key={preset.name}
                className="hue-selector__preset"
                onClick={() => {
                  switch (activeChannel) {
                    case 'primary':
                      onPrimaryChange(preset.value)
                      break
                    case 'secondary':
                      onSecondaryChange?.(preset.value)
                      break
                    case 'accent':
                      onAccentChange?.(preset.value)
                      break
                  }
                }}
                disabled={disabled}
                whileHover={!disabled ? { scale: 1.1 } : {}}
                whileTap={!disabled ? { scale: 0.9 } : {}}
                title={preset.name}
              >
                <div
                  className="hue-selector__preset-color"
                  style={{ background: preset.color }}
                />
                <span className="hue-selector__preset-label">{preset.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* 当前值显示 */}
      <div className="hue-selector__current">
        <div className="hue-selector__current-item">
          <span className="hue-selector__current-label">主色调</span>
          <div className="hue-selector__current-value">
            <div
              className="hue-selector__current-color"
              style={{ background: getHueColor(primary) }}
            />
            <span>{Math.round(primary)}°</span>
          </div>
        </div>

        {secondary !== undefined && (
          <div className="hue-selector__current-item">
            <span className="hue-selector__current-label">次色调</span>
            <div className="hue-selector__current-value">
              <div
                className="hue-selector__current-color"
                style={{ background: getHueColor(secondary) }}
              />
              <span>{Math.round(secondary)}°</span>
            </div>
          </div>
        )}

        {accent !== undefined && (
          <div className="hue-selector__current-item">
            <span className="hue-selector__current-label">强调色</span>
            <div className="hue-selector__current-value">
              <div
                className="hue-selector__current-color"
                style={{ background: getHueColor(accent) }}
              />
              <span>{Math.round(accent)}°</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HueSelector
