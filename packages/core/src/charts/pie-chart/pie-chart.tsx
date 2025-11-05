/**
 * @fileoverview PieChart 组件 - 饼图数据可视化组件
 * @author Xorigo UI Team
 * @version 1.0.0
 */


import React, { forwardRef, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../utils/cn'

// ============================================================================
// 类型定义
// ============================================================================

export interface PieChartDataItem {
  /** 数据标签 */
  label: string
  /** 数据值 */
  value: number
  /** 自定义颜色 */
  color?: string
  /** 是否突出显示 */
  highlighted?: boolean
  /** 自定义样式类名 */
  className?: string
}

export interface PieChartProps {
  /** 数据源 */
  data: PieChartDataItem[]
  /** 组件变体 */
  variant?: 'standard' | 'donut' | 'exploded' | 'nested'
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** 饼图半径（像素） */
  radius?: number
  /** 饼图内径（环形图专用，像素） */
  innerRadius?: number
  /** 中心文本内容 */
  centerText?: React.ReactNode
  /** 是否显示百分比 */
  showPercentage?: boolean
  /** 是否显示数据标签 */
  showLabels?: boolean
  /** 是否显示图例 */
  showLegend?: boolean
  /** 图例位置 */
  legendPosition?: 'right' | 'bottom' | 'left' | 'top'
  /** 爆炸式分离距离 */
  explodeOffset?: number
  /** 是否显示工具提示 */
  showTooltip?: boolean
  /** 动画持续时间 */
  animationDuration?: number
  /** 自定义颜色主题 */
  colorTheme?: string[]
  /** 最小扇形角度（小于此角度的扇形将合并为"其他"） */
  minAngle?: number
  /** 无数据时显示的文本 */
  emptyText?: string
  /** 自定义样式类名 */
  className?: string
  /** 子组件 */
  children?: React.ReactNode
  /** 禁用状态 */
  disabled?: boolean
}

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 计算扇形路径
 */
const calculateArcPath = (
  cx: number,
  cy: number,
  radius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number,
  explodedOffset: number = 0
) => {
  const startAngleRad = (startAngle - 90) * (Math.PI / 180)
  const endAngleRad = (endAngle - 90) * (Math.PI / 180)

  const isDonut = innerRadius > 0
  const offsetX = explodedOffset * Math.cos((startAngleRad + endAngleRad) / 2)
  const offsetY = explodedOffset * Math.sin((startAngleRad + endAngleRad) / 2)

  const x1 = cx + radius * Math.cos(startAngleRad) + offsetX
  const y1 = cy + radius * Math.sin(startAngleRad) + offsetY
  const x2 = cx + radius * Math.cos(endAngleRad) + offsetX
  const y2 = cy + radius * Math.sin(endAngleRad) + offsetY
  const x3 = cx + innerRadius * Math.cos(endAngleRad) + offsetX
  const y3 = cy + innerRadius * Math.sin(endAngleRad) + offsetY
  const x4 = cx + innerRadius * Math.cos(startAngleRad) + offsetX
  const y4 = cy + innerRadius * Math.sin(startAngleRad) + offsetY

  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1

  if (isDonut) {
    return [
      'M', x1, y1,
      'A', radius, radius, 0, largeArcFlag, 1, x2, y2,
      'L', x3, y3,
      'A', innerRadius, innerRadius, 0, largeArcFlag, 0, x4, y4,
      'Z'
    ].join(' ')
  }

  return [
    'M', cx + offsetX, cy + offsetY,
    'L', x1, y1,
    'A', radius, radius, 0, largeArcFlag, 1, x2, y2,
    'Z'
  ].join(' ')
}

/**
 * 获取百分比显示的小数位数
 */
const getPercentageDecimals = (value: number): number => {
  if (value < 0.1) return 1
  if (value < 1) return 1
  return 0
}

// ============================================================================
// 尺寸配置
// ============================================================================

const sizeConfig = {
  sm: { radius: 80, innerRadius: 0, legend: 'sm', fontSize: 'text-xs' },
  md: { radius: 100, innerRadius: 0, legend: 'sm', fontSize: 'text-sm' },
  lg: { radius: 120, innerRadius: 0, legend: 'base', fontSize: 'text-base' },
  xl: { radius: 150, innerRadius: 0, legend: 'lg', fontSize: 'text-lg' }
}

// ============================================================================
// 组件实现
// ============================================================================

const PieChart = forwardRef<SVGSVGElement, PieChartProps>(({
  data,
  variant = 'standard',
  size = 'md',
  radius: customRadius,
  innerRadius: customInnerRadius,
  centerText,
  showPercentage = true,
  showLabels = true,
  showLegend = true,
  legendPosition = 'right',
  explodeOffset = 8,
  showTooltip = true,
  animationDuration = 0.5,
  colorTheme,
  minAngle = 0,
  emptyText = '暂无数据',
  className,
  children,
  disabled = false,
  ...props
}, ref) => {
  // 计算尺寸配置
  const config = sizeConfig[size]
  const radius = customRadius || config.radius
  const donutInnerRadius = variant === 'donut'
    ? (customInnerRadius || Math.floor(radius * 0.6))
    : (customInnerRadius || 0)

  // 状态管理
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [tooltip, setTooltip] = useState<{
    visible: boolean
    x: number
    y: number
    data?: PieChartDataItem
  }>({ visible: false, x: 0, y: 0 })

  // 计算数据
  const { totalValue, processedData, legendItems } = useMemo(() => {
    if (!data || data.length === 0) {
      return { totalValue: 0, processedData: [], legendItems: [] }
    }

    // 计算总值
    const total = data.reduce((sum, item) => sum + item.value, 0)

    if (total === 0) {
      return { totalValue: 0, processedData: [], legendItems: [] }
    }

    // 预处理数据，合并小扇形
    const validData = data.filter(item => item.value > 0)
    const processed: typeof processedData = []
    let otherSum = 0

    validData.forEach((item, index) => {
      const percentage = (item.value / total) * 100
      const angle = (item.value / total) * 360

      if (angle < minAngle) {
        otherSum += item.value
      } else {
        processed.push({
          ...item,
          percentage,
          angle,
          index
        })
      }
    })

    if (otherSum > 0) {
      processed.push({
        label: '其他',
        value: otherSum,
        percentage: (otherSum / total) * 100,
        angle: (otherSum / total) * 360,
        index: processed.length,
        color: '#94a3b8'
      })
    }

    // 生成图例项
    const legendItems = processed.map(item => ({
      label: item.label,
      value: item.value,
      percentage: item.percentage,
      color: item.color
    }))

    return { totalValue: total, processedData: processed, legendItems }
  }, [data, minAngle])

  // 颜色主题
  const colors = colorTheme || [
    'hsl(var(--primary))',
    'hsl(var(--secondary))',
    'hsl(var(--accent))',
    'hsl(var(--muted-foreground))',
    'hsl(var(--destructive))',
    'hsl(var(--warning))',
    'hsl(var(--success))',
    'hsl(var(--info))'
  ]

  // 事件处理
  const handleMouseEnter = (index: number, event: React.MouseEvent) => {
    if (disabled) return
    setActiveIndex(index)

    if (showTooltip) {
      const rect = (event.currentTarget as Element).getBoundingClientRect()
      setTooltip({
        visible: true,
        x: event.clientX,
        y: event.clientY,
        data: processedData[index]
      })
    }
  }

  const handleMouseLeave = () => {
    setActiveIndex(null)
    setTooltip({ visible: false, x: 0, y: 0 })
  }

  // 空状态
  if (totalValue === 0) {
    return (
      <div className={cn(
        'flex items-center justify-center p-8 text-muted-foreground',
        className
      )}>
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-sm">{emptyText}</p>
        </div>
      </div>
    )
  }

  // 计算角度
  let currentAngle = 0
  const cx = radius + 20
  const cy = radius + 20

  // 动画变体
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const sliceVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: animationDuration,
        ease: 'easeOut'
      }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  }

  return (
    <div className={cn(
      'flex gap-6',
      {
        'flex-col': legendPosition === 'top' || legendPosition === 'bottom',
        'flex-row': legendPosition === 'left' || legendPosition === 'right',
      },
      className
    )}>
      {/* 图表区域 */}
      <div className="relative flex-shrink-0">
        <svg
          ref={ref}
          width={radius * 2 + 40}
          height={radius * 2 + 40}
          className="overflow-visible"
          {...props}
        >
          <motion.g
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {processedData.map((item, index) => {
              const startAngle = currentAngle
              const endAngle = currentAngle + item.angle
              currentAngle = endAngle

              const isActive = activeIndex === index
              const isHighlighted = item.highlighted || isActive
              const offset = variant === 'exploded' && isHighlighted
                ? explodeOffset
                : 0

              const path = calculateArcPath(
                cx,
                cy,
                radius,
                donutInnerRadius,
                startAngle,
                endAngle,
                offset
              )

              const color = item.color || colors[index % colors.length]
              const decimals = getPercentageDecimals(item.percentage)

              return (
                <motion.g key={`slice-${index}`}>
                  {/* 扇形 */}
                  <motion.path
                    d={path}
                    fill={color}
                    stroke="hsl(var(--background))"
                    strokeWidth={2}
                    variants={sliceVariants}
                    whileHover="hover"
                    onMouseEnter={(e) => handleMouseEnter(index, e)}
                    onMouseLeave={handleMouseLeave}
                    className={cn(
                      'cursor-pointer transition-opacity',
                      disabled && 'cursor-not-allowed opacity-50'
                    )}
                    role="img"
                    aria-label={`${item.label}: ${item.percentage.toFixed(decimals)}%`}
                  />

                  {/* 百分比标签 */}
                  {showPercentage && item.angle > 15 && (
                    <motion.text
                      x={cx + (radius - donutInnerRadius) / 2 * Math.cos((startAngle + endAngle - 180) * Math.PI / 180)}
                      y={cy + (radius - donutInnerRadius) / 2 * Math.sin((startAngle + endAngle - 180) * Math.PI / 180)}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="hsl(var(--foreground))"
                      fontSize={size === 'sm' ? 10 : size === 'md' ? 12 : size === 'lg' ? 14 : 16}
                      fontWeight="medium"
                      pointerEvents="none"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: animationDuration + index * 0.05 }}
                    >
                      {item.percentage.toFixed(decimals)}%
                    </motion.text>
                  )}
                </motion.g>
              )
            })}
          </motion.g>

          {/* 中心文本 */}
          {variant === 'donut' && centerText && (
            <foreignObject
              x={cx - donutInnerRadius / 2}
              y={cy - donutInnerRadius / 2}
              width={donutInnerRadius}
              height={donutInnerRadius}
              className="pointer-events-none"
            >
              <div className="flex items-center justify-center h-full text-center">
                {centerText}
              </div>
            </foreignObject>
          )}
        </svg>

        {/* 工具提示 */}
        <AnimatePresence>
          {tooltip.visible && tooltip.data && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={cn(
                'absolute z-50 px-3 py-2 rounded-lg bg-popover text-popover-foreground',
                'shadow-lg border border-border pointer-events-none',
                'text-sm font-medium whitespace-nowrap'
              )}
              style={{
                left: tooltip.x,
                top: tooltip.y,
                transform: 'translate(-50%, -120%)'
              }}
              role="tooltip"
            >
              <div className="font-semibold">{tooltip.data.label}</div>
              <div className="text-muted-foreground">
                数值: {tooltip.data.value.toLocaleString()}
                ({tooltip.data.percentage.toFixed(1)}%)
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 图例 */}
      {showLegend && legendItems.length > 0 && (
        <div className={cn(
          'flex gap-4 flex-wrap',
          {
            'flex-col justify-center': legendPosition === 'right' || legendPosition === 'left',
            'flex-row justify-center': legendPosition === 'top' || legendPosition === 'bottom',
          }
        )}>
          {legendItems.map((item, index) => (
            <div
              key={`legend-${index}`}
              className={cn(
                'flex items-center gap-2',
                config.legend === 'sm' ? 'text-xs' :
                config.legend === 'base' ? 'text-sm' : 'text-base'
              )}
            >
              <span
                className="inline-block w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
                aria-hidden="true"
              />
              <span className="text-foreground">
                {item.label}
              </span>
              <span className="text-muted-foreground">
                ({item.percentage.toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 子组件插槽 */}
      {children && (
        <div className="flex-shrink-0">
          {children}
        </div>
      )}
    </div>
  )
})

PieChart.displayName = 'PieChart'

export default PieChart
export { PieChart }

// ============================================================================
// 导出类型
// ============================================================================

export type {
  PieChartDataItem,
  PieChartProps
}
