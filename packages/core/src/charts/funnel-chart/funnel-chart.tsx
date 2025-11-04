/**
 * FunnelChart - 漏斗图组件
 *
 * 为图表提供漏斗图显示，支持转化漏斗、销售漏斗等多种场景。
 * 基于 ChartContainer 构建，集成七轴主题系统和 Framer Motion 动画。
 */

import React, { forwardRef, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChartContainer } from '../chart-container/chart-container'
import { Legend, type LegendItem } from '../legend/legend'
import { ChartTooltip, type TooltipData } from '../chart-tooltip/chart-tooltip'
import { cn } from '../../utils/cn'
import { useSevenAxisTheme } from '../../theme/use-theme'

// ============================================================================
// Props Type Definitions
// ============================================================================

export interface FunnelDataPoint {
  /**
   * 阶段名称
   */
  label: string

  /**
   * 阶段数值
   */
  value: number

  /**
   * 阶段颜色
   */
  color?: string

  /**
   * 阶段描述
   */
  description?: string

  /**
   * 自定义数据
   */
  [key: string]: any
}

export interface FunnelChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * 漏斗图数据
   */
  data: FunnelDataPoint[]

  /**
   * 漏斗图的方向
   */
  direction?: 'top-to-bottom' | 'bottom-to-top'

  /**
   * 是否显示百分比
   */
  showPercentage?: boolean

  /**
   * 是否显示数值
   */
  showValue?: boolean

  /**
   * 是否显示标签
   */
  showLabel?: boolean

  /**
   * 是否显示图例
   */
  showLegend?: boolean

  /**
   * 是否显示工具提示
   */
  showTooltip?: boolean

  /**
   * 工具提示的自定义渲染函数
   */
  tooltipFormatter?: (data: FunnelDataPoint, index: number) => React.ReactNode

  /**
   * 阶段点击回调
   */
  onStageClick?: (data: FunnelDataPoint, index: number) => void

  /**
   * 阶段高度
   */
  stageHeight?: number

  /**
   * 阶段之间的间距
   */
  stageGap?: number

  /**
   * 动画持续时间（秒）
   */
  animationDuration?: number

  /**
   * 漏斗图的样式变体
   */
  variant?: 'default' | 'gradient' | 'solid'

  /**
   * 是否显示描边
   */
  showStroke?: boolean

  /**
   * 自定义百分比格式化函数
   */
  formatPercentage?: (percentage: number) => string

  /**
   * 自定义数值格式化函数
   */
  formatValue?: (value: number) => string

  /**
   * 图例位置
   */
  legendPosition?: 'top' | 'right' | 'bottom' | 'left'

  /**
   * 图表的高度
   */
  height?: number | string

  /**
   * 图表的宽度
   */
  width?: number | string

  /**
   * 最大宽度（漏斗图顶部宽度）
   */
  maxWidth?: number | string

  /**
   * 最小宽度（漏斗图底部宽度）
   */
  minWidth?: number | string
}

// ============================================================================
// Utility Functions
// ============================================================================

const generateGradient = (
  color: string,
  theme: 'light' | 'dark' = 'light'
): string => {
  // 简单的颜色渐变生成
  const hex = color.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  const lighten = (c: number, amount: number) =>
    Math.round(c + (255 - c) * amount)

  const lightened = `rgba(${lighten(r, 0.3)}, ${lighten(g, 0.3)}, ${lighten(b, 0.3)}, 0.8)`
  const original = `rgba(${r}, ${g}, ${b}, 0.8)`

  return `linear-gradient(180deg, ${original} 0%, ${lightened} 100%)`
}

// ============================================================================
// Component Implementation
// ============================================================================

/**
 * FunnelChart 组件
 *
 * 为图表提供漏斗图显示，包含：
 * - 支持转化漏斗、销售漏斗等场景
 * - 可配置百分比、数值和标签显示
 * - 支持图例和工具提示
 * - 集成主题系统和动画效果
 */
export const FunnelChart = forwardRef<HTMLDivElement, FunnelChartProps>(
  (
    {
      data,
      direction = 'top-to-bottom',
      showPercentage = true,
      showValue = true,
      showLabel = true,
      showLegend = true,
      showTooltip = true,
      tooltipFormatter,
      onStageClick,
      stageHeight = 60,
      stageGap = 8,
      animationDuration = 0.8,
      variant = 'default',
      showStroke = true,
      formatPercentage,
      formatValue,
      legendPosition = 'bottom',
      height = 400,
      width = '100%',
      maxWidth = '100%',
      minWidth = 100,
      className,
      ...props
    },
    ref
  ) => {
    const { theme } = useSevenAxisTheme()
    const isDark = theme.mode === 'dark'
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    // 计算百分比和尺寸
    const processedData = useMemo(() => {
      if (!data || data.length === 0) return []

      const maxValue = Math.max(...data.map(d => d.value))
      const minValue = Math.min(...data.map(d => d.value))

      return data.map((item, index) => {
        const percentage = (item.value / maxValue) * 100
        const width = minWidth !== undefined
          ? typeof minWidth === 'number'
            ? minWidth + (percentage / 100) * (typeof maxWidth === 'number' ? (maxWidth - minWidth) : 300)
            : `${percentage}%`
          : `${percentage}%`

        return {
          ...item,
          index,
          percentage,
          width,
          originalWidth: percentage / 100
        }
      })
    }, [data, minWidth, maxWidth])

    // 生成颜色方案
    const colors = useMemo(() => {
      if (variant === 'solid') {
        return data.map(d => d.color || 'var(--color-primary)')
      }

      return data.map((d, i) => {
        if (d.color) return d.color

        // 使用主题色生成渐变色
        const baseColors = [
          'var(--color-primary)',
          'var(--color-accent)',
          '#3b82f6',
          '#8b5cf6',
          '#ec4899',
          '#f59e0b'
        ]

        return baseColors[i % baseColors.length]
      })
    }, [data, variant])

    // 生成图例项
    const legendItems: LegendItem[] = processedData.map((item, index) => ({
      id: String(index),
      label: item.label,
      color: colors[index],
      visible: true
    }))

    // 工具提示处理
    const [tooltipData, setTooltipData] = useState<TooltipData | null>(null)

    const handleMouseEnter = (event: React.MouseEvent, item: FunnelDataPoint, index: number) => {
      if (!showTooltip) return

      const rect = event.currentTarget.getBoundingClientRect()
      const tooltipContent = tooltipFormatter
        ? tooltipFormatter(item, index)
        : (
          <div>
            <p className="font-medium">{item.label}</p>
            <p>数值: {formatValue ? formatValue(item.value) : item.value}</p>
            {showPercentage && (
              <p>
                占比: {formatPercentage ? formatPercentage(processedData[index].percentage) : `${processedData[index].percentage.toFixed(1)}%`}
              </p>
            )}
            {item.description && <p>{item.description}</p>}
          </div>
        )

      setTooltipData({
        id: String(index),
        title: item.label,
        content: tooltipContent,
        x: 0,
        y: 0,
        color: colors[index]
      })
    }

    const handleMouseLeave = () => {
      setHoveredIndex(null)
      setTooltipData(null)
    }

    const handleMouseMove = (event: React.MouseEvent) => {
      if (!tooltipData) return

      const rect = event.currentTarget.getBoundingClientRect()
      setTooltipData({
        ...tooltipData,
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      })
    }

    // 计算漏斗图的总高度
    const totalHeight = data.length * stageHeight + (data.length - 1) * stageGap

    // 计算中心点
    const centerX = typeof width === 'number' ? width / 2 : 500

    return (
      <div
        ref={ref}
        className={cn('funnel-chart', className)}
        style={{ width, height, ...props.style }}
        {...props}
      >
        <ChartContainer height={height}>
          <div className="relative" style={{ width: '100%', height: '100%' }}>
            {/* 漏斗图阶段 */}
            <div
              className="relative mx-auto"
              style={{
                width: typeof maxWidth === 'number' ? maxWidth : '100%',
                height: totalHeight
              }}
              onMouseMove={handleMouseMove}
            >
              <AnimatePresence>
                {processedData.map((item, index) => {
                  const isHovered = hoveredIndex === index
                  const nextItem = processedData[index + 1]
                  const prevItem = processedData[index - 1]

                  // 计算当前阶段的宽度（用于梯形绘制）
                  const currentWidth = item.originalWidth
                  const nextWidth = nextItem ? nextItem.originalWidth : currentWidth * 0.8
                  const prevWidth = prevItem ? prevItem.originalWidth : currentWidth

                  // 计算位置
                  const top = index * (stageHeight + stageGap)
                  const gradientId = `funnel-gradient-${index}`

                  return (
                    <motion.div
                      key={index}
                      className={cn(
                        'absolute cursor-pointer group transition-all duration-200',
                        isHovered && 'z-10'
                      )}
                      style={{
                        top,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        height: stageHeight,
                        width: '100%',
                        maxWidth: maxWidth
                      }}
                      initial={{
                        opacity: 0,
                        scale: 0.9,
                        y: direction === 'top-to-bottom' ? -20 : 20
                      }}
                      animate={{
                        opacity: 1,
                        scale: isHovered ? 1.02 : 1,
                        y: 0
                      }}
                      transition={{
                        duration: animationDuration,
                        delay: index * 0.1,
                        ease: 'easeOut'
                      }}
                      onMouseEnter={(e) => {
                        setHoveredIndex(index)
                        handleMouseEnter(e, item, index)
                      }}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => onStageClick?.(item, index)}
                    >
                      {/* 梯形阶段 */}
                      <svg
                        width="100%"
                        height="100%"
                        className="overflow-visible"
                      >
                        <defs>
                          {variant === 'gradient' && (
                            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor={colors[index]} stopOpacity={0.9} />
                              <stop offset="100%" stopColor={colors[index]} stopOpacity={0.6} />
                            </linearGradient>
                          )}
                        </defs>

                        {/* 梯形路径 */}
                        <path
                          d={`
                            M ${50 - currentWidth * 50} ${0}
                            L ${50 + currentWidth * 50} ${0}
                            L ${50 + nextWidth * 50} ${stageHeight}
                            L ${50 - nextWidth * 50} ${stageHeight}
                            Z
                          `}
                          fill={
                            variant === 'gradient'
                              ? `url(#${gradientId})`
                              : colors[index]
                          }
                          fillOpacity={isHovered ? 0.9 : 0.7}
                          stroke={showStroke ? 'rgba(255, 255, 255, 0.3)' : 'none'}
                          strokeWidth={showStroke ? 2 : 0}
                          className={cn(
                            'transition-all duration-200',
                            showStroke && 'group-hover:stroke-white'
                          )}
                        />

                        {/* 阶段内容 */}
                        <foreignObject
                          x={50 - currentWidth * 50}
                          y={0}
                          width={currentWidth * 100}
                          height={stageHeight}
                          className="pointer-events-none"
                        >
                          <div
                            className={cn(
                              'flex h-full w-full items-center justify-between px-4',
                              'text-white',
                              'font-medium'
                            )}
                          >
                            {/* 左侧标签 */}
                            {showLabel && (
                              <div className="flex-1 truncate">
                                <div className="text-sm font-medium truncate">
                                  {item.label}
                                </div>
                              </div>
                            )}

                            {/* 右侧信息 */}
                            <div className="flex items-center space-x-2 text-sm">
                              {showValue && (
                                <span className="font-semibold">
                                  {formatValue ? formatValue(item.value) : item.value}
                                </span>
                              )}
                              {showPercentage && (
                                <span className="opacity-90">
                                  {formatPercentage
                                    ? formatPercentage(item.percentage)
                                    : `${item.percentage.toFixed(1)}%`
                                  }
                                </span>
                              )}
                            </div>
                          </div>
                        </foreignObject>
                      </svg>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {/* 图例 */}
            {showLegend && legendItems.length > 0 && (
              <div className={cn(
                'mt-4',
                legendPosition === 'right' && 'absolute right-0 top-0',
                legendPosition === 'left' && 'absolute left-0 top-0',
                legendPosition === 'top' && 'absolute top-0 left-0'
              )}>
                <Legend
                  items={legendItems}
                  orientation={legendPosition === 'right' || legendPosition === 'left' ? 'vertical' : 'horizontal'}
                  align="center"
                />
              </div>
            )}

            {/* 工具提示 */}
            {showTooltip && (
              <ChartTooltip
                data={tooltipData || undefined}
                visible={!!tooltipData}
                position="top"
                variant="default"
              />
            )}
          </div>
        </ChartContainer>
      </div>
    )
  }
)

FunnelChart.displayName = 'FunnelChart'

// ============================================================================
// Export
// ============================================================================

export type { FunnelChartProps, FunnelDataPoint }
