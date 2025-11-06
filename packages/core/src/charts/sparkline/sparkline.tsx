'use client'
import React, { forwardRef, useMemo, useState, useRef, useEffect } from 'react'
/**
 * @file Sparkline 迷你线图组件
 * @description 轻量级数据可视化组件，用于展示小型趋势数据和变化
 * @version 1.0.0
 * @stable true
 * @category Charts
 */

import { motion, AnimatePresence } from 'framer-motion'
import type { Variant } from 'framer-motion'

// =============================================================================
// 类型定义
// =============================================================================

export interface SparklinePoint {
  value: number
  label?: string
  timestamp?: number
}

export interface SparklineProps {
  /**
   * 数据点数组
   */
  data: SparklinePoint[]

  /**
   * 图表宽度
   * @default 120
   */
  width?: number

  /**
   * 图表高度
   * @default 40
   */
  height?: number

  /**
   * 线型样式
   * @default 'linear'
   */
  variant?: 'linear' | 'curve' | 'area'

  /**
   * 是否显示数据点
   * @default true
   */
  showPoints?: boolean

  /**
   * 是否显示最高/最低点标记
   * @default false
   */
  showExtremes?: boolean

  /**
   * 是否显示阈值线
   * @default false
   */
  showThreshold?: boolean

  /**
   * 阈值线数值
   */
  thresholdValue?: number

  /**
   * 是否显示百分比变化
   * @default false
   */
  showChange?: boolean

  /**
   * 颜色变体
   * @default 'primary'
   */
  colorVariant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning'

  /**
   * 是否启用动画
   * @default true
   */
  animated?: boolean

  /**
   * 自定义类名
   */
  className?: string

  /**
   * 鼠标悬停回调
   */
  onHover?: (point: SparklinePoint | null) => void

  /**
   * 点击回调
   */
  onClick?: (point: SparklinePoint | null) => void

  /**
   * 工具提示自定义渲染
   */
  renderTooltip?: (point: SparklinePoint) => React.ReactNode

  /**
   * 区域标记配置
   */
  regions?: Array<{
    start: number
    end: number
    color?: string
    opacity?: number
  }>
}

// =============================================================================
// 主题颜色映射
// =============================================================================

const getColorClass = (variant: string, opacity?: number) => {
  const colorMap: Record<string, string> = {
    primary: 'stroke-blue-500',
    secondary: 'stroke-gray-500',
    success: 'stroke-green-500',
    danger: 'stroke-red-500',
    warning: 'stroke-yellow-500',
  }

  const fillColorMap: Record<string, string> = {
    primary: 'fill-blue-500',
    secondary: 'fill-gray-500',
    success: 'fill-green-500',
    danger: 'fill-red-500',
    warning: 'fill-yellow-500',
  }

  const baseClass = colorMap[variant] || colorMap.primary
  const fillClass = fillColorMap[variant] || fillColorMap.primary

  if (opacity !== undefined) {
    return `${baseClass}/${opacity} ${fillClass}/${opacity}`
  }

  return `${baseClass} ${fillClass}`
}

// =============================================================================
// 工具函数
// =============================================================================

/**
 * 计算路径字符串
 */
const calculatePath = (
  points: SparklinePoint[],
  width: number,
  height: number,
  variant: 'linear' | 'curve' | 'area'
): string => {
  if (points.length === 0) return ''

  const maxValue = Math.max(...points.map(p => p.value))
  const minValue = Math.min(...points.map(p => p.value))
  const range = maxValue - minValue || 1

  const stepX = width / (points.length - 1 || 1)

  // 曲线平滑处理
  const smoothPoints = points.map((point, index) => ({
    x: index * stepX,
    y: height - ((point.value - minValue) / range) * height,
  }))

  if (variant === 'curve') {
    // 使用贝塞尔曲线
    let path = `M ${smoothPoints[0].x},${smoothPoints[0].y}`

    for (let i = 1; i < smoothPoints.length; i++) {
      const prev = smoothPoints[i - 1]
      const curr = smoothPoints[i]
      const cp1x = prev.x + stepX / 2
      const cp1y = prev.y
      const cp2x = curr.x - stepX / 2
      const cp2y = curr.y

      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${curr.x},${curr.y}`
    }

    if (variant === 'area') {
      path += ` L ${smoothPoints[smoothPoints.length - 1].x},${height}`
      path += ` L 0,${height} Z`
    }

    return path
  }

  // 线性路径
  let path = `M ${smoothPoints[0].x},${smoothPoints[0].y}`

  for (let i = 1; i < smoothPoints.length; i++) {
    path += ` L ${smoothPoints[i].x},${smoothPoints[i].y}`
  }

  if (variant === 'area') {
    path += ` L ${smoothPoints[smoothPoints.length - 1].x},${height}`
    path += ` L 0,${height} Z`
  }

  return path
}

/**
 * 查找最高和最低点
 */
const findExtremes = (points: SparklinePoint[]) => {
  if (points.length === 0) return { min: null, max: null }

  let minIndex = 0
  let maxIndex = 0

  points.forEach((point, index) => {
    if (point.value < points[minIndex].value) {
      minIndex = index
    }
    if (point.value > points[maxIndex].value) {
      maxIndex = index
    }
  })

  return {
    min: { ...points[minIndex], index: minIndex },
    max: { ...points[maxIndex], index: maxIndex },
  }
}

// =============================================================================
// 动画变体
// =============================================================================

const pathVariants: Variant = {
  initial: {
    pathLength: 0,
    opacity: 0,
  },
  animate: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
}

const pointVariants: Variant = {
  initial: {
    scale: 0,
    opacity: 0,
  },
  animate: (index: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay: index * 0.05,
      duration: 0.3,
      ease: 'easeOut',
    },
  }),
}

// =============================================================================
// 主组件
// =============================================================================

/**
 * Sparkline 迷你线图组件
 *
 * 一个轻量级的数据可视化组件，用于展示小型趋势数据。支持多种线型、
 * 数据点标记、动画效果，并完全集成主题系统。
 */
export const Sparkline = forwardRef<SVGSVGElement, SparklineProps>(
  (
    {
      data,
      width = 120,
      height = 40,
      variant = 'linear',
      showPoints = true,
      showExtremes = false,
      showThreshold = false,
      thresholdValue,
      showChange = false,
      colorVariant = 'primary',
      animated = true,
      className = '',
      onHover,
      onClick,
      renderTooltip,
      regions,
    },
    ref
  ) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
    const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // 计算坐标和路径
    const { path, points, extremes } = useMemo(() => {
      const stepX = width / (data.length - 1 || 1)
      const maxValue = Math.max(...data.map(p => p.value))
      const minValue = Math.min(...data.map(p => p.value))
      const range = maxValue - minValue || 1

      const calculatedPoints = data.map((point, index) => ({
        ...point,
        x: index * stepX,
        y: height - ((point.value - minValue) / range) * height,
        index,
      }))

      const calculatedPath = calculatePath(data, width, height, variant)
      const calculatedExtremes = findExtremes(data)

      return {
        path: calculatedPath,
        points: calculatedPoints,
        extremes: calculatedExtremes,
      }
    }, [data, width, height, variant])

    // 计算百分比变化
    const change = useMemo(() => {
      if (data.length < 2) return null
      const first = data[0].value
      const last = data[data.length - 1].value
      return ((last - first) / first) * 100
    }, [data])

    // 阈值线位置
    const thresholdY = useMemo(() => {
      if (!showThreshold || thresholdValue === undefined) return null
      const maxValue = Math.max(...data.map(p => p.value))
      const minValue = Math.min(...data.map(p => p.value))
      const range = maxValue - minValue || 1
      return height - ((thresholdValue - minValue) / range) * height
    }, [showThreshold, thresholdValue, data, height])

    // 鼠标事件处理
    const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
      if (!containerRef.current || points.length === 0) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      // 找到最近的点
      const stepX = width / (points.length - 1 || 1)
      const index = Math.round(x / stepX)
      const clampedIndex = Math.max(0, Math.min(points.length - 1, index))

      setHoveredIndex(clampedIndex)
      setTooltipPos({ x: event.clientX, y: event.clientY })

      if (onHover) {
        onHover(points[clampedIndex])
      }
    }

    const handleMouseLeave = () => {
      setHoveredIndex(null)
      setTooltipPos(null)
      if (onHover) {
        onHover(null)
      }
    }

    // 渲染区域标记
    const renderRegions = () => {
      if (!regions || regions.length === 0) return null

      const maxValue = Math.max(...data.map(p => p.value))
      const minValue = Math.min(...data.map(p => p.value))
      const range = maxValue - minValue || 1

      return regions.map((region, index) => {
        const startX = (region.start / 100) * width
        const endX = (region.end / 100) * width
        const y = height - ((region.start - minValue) / range) * height

        return (
          <rect
            key={`region-${index}`}
            x={startX}
            y={0}
            width={endX - startX}
            height={height}
            fill={region.color || '#94a3b8'}
            fillOpacity={region.opacity || 0.1}
          />
        )
      })
    }

    // 工具提示组件
    const Tooltip = () => {
      if (hoveredIndex === null || !tooltipPos) return null

      const point = points[hoveredIndex]
      if (!point) return null

      return (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute z-50 pointer-events-none"
            style={{
              left: tooltipPos.x + 10,
              top: tooltipPos.y - 40,
            }}
          >
            <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md px-2 py-1 shadow-lg">
              {renderTooltip ? renderTooltip(point) : (
                <div>
                  <div className="font-medium">{point.value}</div>
                  {point.label && <div className="text-gray-300">{point.label}</div>}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )
    }

    return (
      <div
        ref={containerRef}
        className={`relative inline-block ${className}`}
        style={{ width, height }}
      >
        <svg
          ref={ref}
          width={width}
          height={height}
          className="overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={() => onClick && onClick(hoveredIndex !== null ? points[hoveredIndex] : null)}
        >
          {/* 区域标记 */}
          <g className="regions">{renderRegions()}</g>

          {/* 阈值线 */}
          {showThreshold && thresholdY !== null && (
            <line
              x1={0}
              y1={thresholdY}
              x2={width}
              y2={thresholdY}
              stroke="currentColor"
              strokeWidth={1}
              strokeDasharray="4,4"
              className="opacity-50"
            />
          )}

          {/* 路径 */}
          {variant === 'area' ? (
            <motion.path
              d={path}
              fill={`var(--color-${colorVariant}-500)`}
              fillOpacity={0.2}
              className={getColorClass(colorVariant)}
              variants={animated ? pathVariants : undefined}
              initial={animated ? 'initial' : undefined}
              animate={animated ? 'animate' : undefined}
            />
          ) : (
            <motion.path
              d={path}
              fill="none"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={getColorClass(colorVariant)}
              variants={animated ? pathVariants : undefined}
              initial={animated ? 'initial' : undefined}
              animate={animated ? 'animate' : undefined}
            />
          )}

          {/* 数据点 */}
          {showPoints && points.map((point, index) => (
            <motion.circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={hoveredIndex === index ? 4 : 3}
              fill="white"
              stroke="currentColor"
              strokeWidth={2}
              className={getColorClass(colorVariant)}
              variants={animated ? pointVariants : undefined}
              initial={animated ? 'initial' : undefined}
              animate={animated ? 'animate' : (animated === false ? undefined : 'animate')}
              custom={index}
            />
          ))}

          {/* 极值点 */}
          {showExtremes && extremes.min && extremes.max && (
            <>
              {/* 最小值 */}
              <motion.circle
                cx={extremes.min.index * (width / (points.length - 1 || 1))}
                cy={height - ((extremes.min.value - Math.min(...data.map(p => p.value))) / (Math.max(...data.map(p => p.value)) - Math.min(...data.map(p => p.value)) || 1)) * height}
                r={4}
                fill="currentColor"
                className="text-red-500"
                variants={animated ? pointVariants : undefined}
                initial={animated ? 'initial' : undefined}
                animate={animated ? 'animate' : undefined}
                custom={extremes.min.index}
              />
              {/* 最大值 */}
              <motion.circle
                cx={extremes.max.index * (width / (points.length - 1 || 1))}
                cy={height - ((extremes.max.value - Math.min(...data.map(p => p.value))) / (Math.max(...data.map(p => p.value)) - Math.min(...data.map(p => p.value)) || 1)) * height}
                r={4}
                fill="currentColor"
                className="text-green-500"
                variants={animated ? pointVariants : undefined}
                initial={animated ? 'initial' : undefined}
                animate={animated ? 'animate' : undefined}
                custom={extremes.max.index}
              />
            </>
          )}

          {/* 悬停指示线 */}
          {hoveredIndex !== null && (
            <line
              x1={points[hoveredIndex].x}
              y1={0}
              x2={points[hoveredIndex].x}
              y2={height}
              stroke="currentColor"
              strokeWidth={1}
              strokeDasharray="2,2"
              className="opacity-30"
            />
          )}
        </svg>

        {/* 百分比变化指示 */}
        {showChange && change !== null && (
          <div className="absolute -right-1 -top-1 text-xs font-medium">
            <span
              className={
                change > 0
                  ? 'text-green-500'
                  : change < 0
                  ? 'text-red-500'
                  : 'text-gray-500'
              }
            >
              {change > 0 ? '↗' : change < 0 ? '↘' : '→'}
              {Math.abs(change).toFixed(1)}%
            </span>
          </div>
        )}

        {/* 工具提示 */}
        <Tooltip />
      </div>
    )
  }
)

Sparkline.displayName = 'Sparkline'
