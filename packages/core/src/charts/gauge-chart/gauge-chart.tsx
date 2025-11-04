/**
 * @fileoverview GaugeChart - 仪表图组件
 * @component Charts/GaugeChart
 * @stable true
 * @version 1.0.0
 */

'use client'

import * as React from 'react'
import { forwardRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../utils/cn'

// =============================================================================
// 组件变体定义
// =============================================================================

const gaugeChartVariants = cva(
  'relative inline-flex items-center justify-center',
  {
    variants: {
      variant: {
        solid: 'bg-primary-500',
        gradient: 'bg-gradient-to-r',
      },
      size: {
        sm: 'h-32 w-32',
        md: 'h-40 w-40',
        lg: 'h-48 w-48',
        xl: 'h-56 w-56',
      },
      shape: {
        'semi': 'rounded-t-full',
        'full': 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'solid',
      size: 'md',
      shape: 'semi',
    },
  }
)

// =============================================================================
// 类型定义
// =============================================================================

export interface GaugeDataPoint {
  value: number
  label?: string
  color?: string
  threshold?: number
}

export interface GaugeThresholds {
  warning: number
  danger: number
}

export interface GaugeChartProps
  extends Omit<React.SVGProps<SVGSVGElement>, 'ref'>,
    VariantProps<typeof gaugeChartVariants> {
  /** 当前数值 */
  value: number
  /** 最小值 */
  min?: number
  /** 最大值 */
  max?: number
  /** 阈值配置 */
  thresholds?: GaugeThresholds
  /** 仪表盘标签 */
  label?: string
  /** 中心显示单位 */
  unit?: string
  /** 小数位数 */
  decimals?: number
  /** 是否显示指针 */
  showPointer?: boolean
  /** 是否显示阈值线 */
  showThresholds?: boolean
  /** 是否显示动画 */
  animated?: boolean
  /** 自定义颜色 */
  color?: string
  /** 起始角度（度） */
  startAngle?: number
  /** 结束角度（度） */
  endAngle?: number
  /** 自定义类名 */
  className?: string
  /** 子组件 */
  children?: React.ReactNode
  /** ref 转发 */
  ref?: React.Ref<SVGSVGElement>
}

// =============================================================================
// 工具函数
// =============================================================================

/**
 * 将数值映射到角度
 */
function mapValueToAngle(
  value: number,
  min: number,
  max: number,
  startAngle: number,
  endAngle: number
): number {
  const normalized = (value - min) / (max - min)
  return startAngle + normalized * (endAngle - startAngle)
}

/**
 * 极坐标转笛卡尔坐标
 */
function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
): { x: number; y: number } {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians)),
  }
}

/**
 * 生成仪表盘弧路径
 */
function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(x, y, radius, endAngle)
  const end = polarToCartesian(x, y, radius, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'

  return [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(' ')
}

/**
 * 获取阈值颜色
 */
function getThresholdColor(
  value: number,
  thresholds: GaugeThresholds | undefined,
  defaultColor: string
): string {
  if (!thresholds) return defaultColor

  if (value >= thresholds.danger) return 'var(--color-danger-500)'
  if (value >= thresholds.warning) return 'var(--color-warning-500)'
  return defaultColor
}

// =============================================================================
// 主组件
// =============================================================================

const GaugeChart = forwardRef<SVGSVGElement, GaugeChartProps>(
  (
    {
      value,
      min = 0,
      max = 100,
      thresholds,
      label,
      unit = '%',
      decimals = 0,
      showPointer = true,
      showThresholds = true,
      animated = true,
      color = 'var(--color-primary-500)',
      startAngle = 180,
      endAngle = 0,
      variant,
      size,
      shape,
      className,
      children,
      ...props
    },
    ref
  ) => {
    // 尺寸配置
    const sizeMap = {
      sm: 128,
      md: 160,
      lg: 192,
      xl: 224,
    }

    const chartSize = sizeMap[size || 'md']
    const radius = chartSize / 2 - 20
    const centerX = chartSize / 2
    const centerY = chartSize / 2

    // 计算当前角度
    const currentAngle = useMemo(() => {
      return mapValueToAngle(value, min, max, startAngle, endAngle)
    }, [value, min, max, startAngle, endAngle])

    // 计算进度角度
    const progressAngle = useMemo(() => {
      return mapValueToAngle(Math.min(value, max), min, max, startAngle, endAngle)
    }, [value, min, max, startAngle, endAngle])

    // 生成仪表盘背景路径
    const backgroundPath = useMemo(() => {
      return describeArc(centerX, centerY, radius, startAngle, endAngle)
    }, [centerX, centerY, radius, startAngle, endAngle])

    // 生成进度路径
    const progressPath = useMemo(() => {
      if (progressAngle <= startAngle) return ''
      return describeArc(centerX, centerY, radius, startAngle, progressAngle)
    }, [centerX, centerY, radius, startAngle, progressAngle])

    // 计算指针位置
    const pointerPosition = useMemo(() => {
      return polarToCartesian(centerX, centerY, radius - 10, currentAngle)
    }, [centerX, centerY, radius, currentAngle])

    // 获取进度颜色
    const progressColor = useMemo(() => {
      return getThresholdColor(value, thresholds, color)
    }, [value, thresholds, color])

    // 计算阈值点
    const thresholdPoints = useMemo(() => {
      if (!thresholds || !showThresholds) return []

      return [
        {
          name: 'warning',
          value: thresholds.warning,
          angle: mapValueToAngle(thresholds.warning, min, max, startAngle, endAngle),
        },
        {
          name: 'danger',
          value: thresholds.danger,
          angle: mapValueToAngle(thresholds.danger, min, max, startAngle, endAngle),
        },
      ]
    }, [thresholds, showThresholds, min, max, startAngle, endAngle])

    // 动画配置
    const animationConfig = {
      initial: { rotate: startAngle },
      animate: { rotate: currentAngle },
      transition: animated ? { duration: 1, ease: 'easeInOut' } : { duration: 0 },
    }

    // 格式化数值显示
    const formatValue = (val: number): string => {
      return val.toFixed(decimals)
    }

    // 文本位置
    const textY = shape === 'semi' ? centerY + 15 : centerY

    return (
      <div
        className={cn(gaugeChartVariants({ variant, size, shape }), className)}
        style={{ width: chartSize, height: shape === 'semi' ? chartSize / 2 : chartSize }}
      >
        <svg
          ref={ref}
          width={chartSize}
          height={shape === 'semi' ? chartSize / 2 : chartSize}
          viewBox={`0 0 ${chartSize} ${shape === 'semi' ? chartSize / 2 : chartSize}`}
          className="overflow-visible"
          role="img"
          aria-label={label || `仪表图: ${formatValue(value)}${unit}`}
          {...props}
        >
          <title>{label || '仪表图'}</title>
          <desc>{`当前值: ${formatValue(value)}${unit}，范围: ${min} - ${max}${unit}`}</desc>

          {/* 背景弧 */}
          <path
            d={backgroundPath}
            fill="none"
            stroke="var(--color-surface-300)"
            strokeWidth="12"
            strokeLinecap="round"
            className="opacity-20"
          />

          {/* 进度弧 */}
          {progressPath && (
            <motion.path
              d={progressPath}
              fill="none"
              stroke={progressColor}
              strokeWidth="12"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={animated ? { duration: 1.5, ease: 'easeInOut' } : { duration: 0 }}
            />
          )}

          {/* 阈值线 */}
          {thresholdPoints.map((point) => {
            const position = polarToCartesian(centerX, centerY, radius, point.angle)
            return (
              <g key={point.name}>
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={position.x}
                  y2={position.y}
                  stroke={point.name === 'danger' ? 'var(--color-danger-500)' : 'var(--color-warning-500)'}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  className="opacity-60"
                />
                <circle
                  cx={position.x}
                  cy={position.y}
                  r="4"
                  fill={point.name === 'danger' ? 'var(--color-danger-500)' : 'var(--color-warning-500)'}
                  className="opacity-80"
                />
              </g>
            )
          })}

          {/* 指针 */}
          {showPointer && (
            <motion.g
              transform-origin={`${centerX} ${centerY}`}
              {...animationConfig}
            >
              <line
                x1={centerX}
                y1={centerY}
                x2={pointerPosition.x}
                y2={pointerPosition.y}
                stroke="var(--color-surface-50)"
                strokeWidth="3"
                strokeLinecap="round"
                className="drop-shadow-sm"
              />
              <circle
                cx={centerX}
                cy={centerY}
                r="8"
                fill="var(--color-surface-50)"
                className="drop-shadow-sm"
              />
              <circle
                cx={centerX}
                cy={centerY}
                r="4"
                fill={progressColor}
              />
            </motion.g>
          )}

          {/* 数值显示 */}
          <text
            x={centerX}
            y={textY - 10}
            textAnchor="middle"
            className="text-2xl font-semibold fill-surface-900 dark:fill-surface-50"
            style={{ fontSize: size === 'sm' ? '1.25rem' : size === 'lg' ? '2rem' : size === 'xl' ? '2.25rem' : '1.5rem' }}
          >
            {formatValue(value)}
          </text>

          {/* 单位 */}
          <text
            x={centerX}
            y={textY + 15}
            textAnchor="middle"
            className="text-sm fill-surface-500"
          >
            {unit}
          </text>

          {/* 标签 */}
          {label && (
            <text
              x={centerX}
              y={textY + 35}
              textAnchor="middle"
              className="text-xs fill-surface-500"
            >
              {label}
            </text>
          )}

          {/* 最小值标注 */}
          {showThresholds && (
            <text
              x={polarToCartesian(centerX, centerY, radius + 15, startAngle).x}
              y={polarToCartesian(centerX, centerY, radius + 15, startAngle).y}
              textAnchor="middle"
              className="text-xs fill-surface-500"
            >
              {min}
            </text>
          )}

          {/* 最大值标注 */}
          {showThresholds && (
            <text
              x={polarToCartesian(centerX, centerY, radius + 15, endAngle).x}
              y={polarToCartesian(centerX, centerY, radius + 15, endAngle).y}
              textAnchor="middle"
              className="text-xs fill-surface-500"
            >
              {max}
            </text>
          )}
        </svg>

        {/* 子组件插槽 */}
        {children && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-center">
            {children}
          </div>
        )}
      </div>
    )
  }
)

GaugeChart.displayName = 'GaugeChart'

// =============================================================================
// 导出
// =============================================================================

export { GaugeChart, type GaugeChartProps, type GaugeDataPoint, type GaugeThresholds }
