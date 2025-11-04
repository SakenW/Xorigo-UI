/**
 * @fileoverview StatisticCard 组件 - 统计卡片
 * @description 高级数据统计展示组件，支持趋势图表、格式化显示、多维度对比
 *
 * @author Xorigo UI Team
 * @version 1.0.0
 * @since 2025-11-04
 */

import React, { forwardRef, useMemo } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cva, type VariantProps } from '../../utils/cva-standalone'
import { useTheme } from '@xorigo-ui/system'
import { cn } from '../../utils'
import { Skeleton } from '../../primitives/Skeleton'
import type { CompleteThemeRecipe } from '@xorigo-ui/theme'

// =============================================================================
// 变体配置
// =============================================================================

const statisticCardVariants = cva(
  // 基础样式
  'relative w-full rounded-2xl transition-all duration-300 break-inside-avoid p-6',
  {
    variants: {
      variant: {
        default: [
          'bg-[var(--bg-primary)]',
          'border border-[var(--border-primary)]',
          'shadow-[0_1px_2px_rgba(0,0,0,0.05)]',
        ].join(' '),
        elevated: [
          'bg-[var(--bg-primary)]',
          'border border-[var(--border-primary)]',
          'shadow-[0_4px_12px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.06)]',
        ].join(' '),
        filled: [
          'bg-[var(--bg-secondary)]',
          'border border-[var(--border-tertiary)]',
          'shadow-[0_1px_2px_rgba(0,0,0,0.05)]',
        ].join(' '),
        gradient: [
          'bg-gradient-to-br from-[var(--bg-primary-action)] to-[var(--bg-secondary-action)]',
          'border border-transparent',
          'text-[var(--text-inverse)]',
          'shadow-[0_4px_12px_rgba(0,0,0,0.15)]',
        ].join(' '),
        glass: [
          'bg-[var(--bg-glass)]',
          'border border-[var(--border-glass)]',
          'backdrop-blur-md',
          'shadow-[0_4px_12px_rgba(0,0,0,0.1)]',
        ].join(' '),
        success: [
          'bg-[var(--bg-success-subtle)]',
          'border border-[var(--border-success)]',
          'text-[var(--text-primary)]',
        ].join(' '),
        warning: [
          'bg-[var(--bg-warning-subtle)]',
          'border border-[var(--border-warning)]',
          'text-[var(--text-primary)]',
        ].join(' '),
        error: [
          'bg-[var(--bg-error-subtle)]',
          'border border-[var(--border-error)]',
          'text-[var(--text-primary)]',
        ].join(' '),
        info: [
          'bg-[var(--bg-info-subtle)]',
          'border border-[var(--border-info)]',
          'text-[var(--text-primary)]',
        ].join(' '),
      },
      size: {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
      trend: {
        up: 'border-l-4 border-l-[var(--border-success)]',
        down: 'border-l-4 border-l-[var(--border-error)]',
        neutral: 'border-l-4 border-l-[var(--border-tertiary)]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      trend: 'neutral',
    },
  }
)

const valueVariants = cva(
  'font-bold tracking-tight',
  {
    variants: {
      size: {
        sm: 'text-2xl',
        md: 'text-3xl',
        lg: 'text-4xl',
        xl: 'text-5xl',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

const labelVariants = cva(
  'font-medium',
  {
    variants: {
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

// =============================================================================
// 类型定义
// =============================================================================

export interface TrendData {
  value: number
  direction: 'up' | 'down' | 'neutral'
  label?: string
  period?: string
}

export interface ComparisonData {
  label: string
  value: string | number
  type?: 'increase' | 'decrease' | 'neutral'
}

export interface ChartDataPoint {
  value: number
  label?: string
  timestamp?: string
}

export interface StatisticCardProps
  extends Omit<HTMLMotionProps<'div'>, 'children'>,
    VariantProps<typeof statisticCardVariants> {
  /** 统计值标签（如：总收入、用户数） */
  label: string
  /** 统计数值 */
  value: string | number
  /** 趋势数据（上升/下降/持平） */
  trend?: TrendData
  /** 对比数据 */
  comparison?: ComparisonData
  /** 图表数据 */
  chartData?: ChartDataPoint[]
  /** 图表类型 */
  chartType?: 'line' | 'bar' | 'area'
  /** 自定义图标 */
  icon?: React.ReactNode
  /** 图标位置 */
  iconPosition?: 'left' | 'right' | 'top'
  /** 数值格式化函数 */
  formatValue?: (value: string | number) => string
  /** 数值前缀 */
  prefix?: string
  /** 数值后缀 */
  suffix?: string
  /** 颜色主题（自动根据趋势设置） */
  colorScheme?: 'primary' | 'success' | 'warning' | 'error' | 'info'
  /** 加载状态 */
  loading?: boolean
  /** 错误状态 */
  error?: boolean
  /** 错误消息 */
  errorMessage?: string
  /** 精确到小数位数 */
  precision?: number
  /** 禁用千分位分隔符 */
  noThousandSeparator?: boolean
  /** 货币符号（格式化货币时使用） */
  currency?: string
  /** 测试ID */
  testId?: string
}

// =============================================================================
// 工具函数
// =============================================================================

/**
 * 格式化数值
 */
const formatNumber = (
  value: string | number,
  options: {
    precision?: number
    noThousandSeparator?: boolean
    currency?: string
  } = {}
): string => {
  const { precision, noThousandSeparator = false, currency } = options

  let numValue = typeof value === 'string' ? parseFloat(value) : value

  if (isNaN(numValue)) return String(value)

  let formatted: string

  if (precision !== undefined) {
    numValue = Number(numValue.toFixed(precision))
  }

  if (noThousandSeparator) {
    formatted = numValue.toString()
  } else {
    formatted = numValue.toLocaleString(undefined, {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    })
  }

  if (currency) {
    return `${currency}${formatted}`
  }

  return formatted
}

/**
 * 获取趋势图标
 */
const getTrendIcon = (direction: 'up' | 'down' | 'neutral'): string => {
  switch (direction) {
    case 'up':
      return '↑'
    case 'down':
      return '↓'
    default:
      return '→'
  }
}

/**
 * 获取趋势颜色类
 */
const getTrendColorClass = (
  theme: CompleteThemeRecipe,
  direction: 'up' | 'down' | 'neutral'
): string => {
  switch (direction) {
    case 'up':
      return 'text-[var(--text-success)]'
    case 'down':
      return 'text-[var(--text-error)]'
    default:
      return 'text-[var(--text-secondary)]'
  }
}

/**
 * 渲染迷你图表
 */
const renderMiniChart = (
  data: ChartDataPoint[],
  type: 'line' | 'bar' | 'area' = 'line',
  theme: CompleteThemeRecipe
): React.ReactNode => {
  if (!data || data.length === 0) return null

  const values = data.map((d) => d.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = 100 - ((d.value - min) / range) * 100
    return `${x},${y}`
  })

  const pathData = points.join(' ')

  if (type === 'line') {
    return (
      <svg
        viewBox="0 0 100 100"
        className="w-full h-12 opacity-80"
        preserveAspectRatio="none"
      >
        <polyline
          points={pathData}
          fill="none"
          stroke="var(--text-secondary)"
          strokeWidth="0.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    )
  }

  if (type === 'bar') {
    return (
      <svg
        viewBox="0 0 100 100"
        className="w-full h-12 opacity-80"
        preserveAspectRatio="none"
      >
        {data.map((d, i) => {
          const x = (i / data.length) * 100
          const barWidth = 80 / data.length
          const height = ((d.value - min) / range) * 100
          return (
            <rect
              key={i}
              x={x}
              y={100 - height}
              width={barWidth}
              height={height}
              fill="var(--text-secondary)"
              opacity="0.6"
            />
          )
        })}
      </svg>
    )
  }

  // area
  const areaPath = `${pathData} 100,100 0,100 Z`
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-12 opacity-80"
      preserveAspectRatio="none"
    >
      <path d={areaPath} fill="var(--text-secondary)" opacity="0.2" />
      <polyline
        points={pathData}
        fill="none"
        stroke="var(--text-secondary)"
        strokeWidth="0.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

// =============================================================================
// 组件实现
// =============================================================================

export const StatisticCard = forwardRef<HTMLDivElement, StatisticCardProps>(
  (
    {
      className,
      variant,
      size,
      trend: trendProp,
      label,
      value,
      comparison,
      chartData,
      chartType = 'line',
      icon,
      iconPosition = 'left',
      formatValue,
      prefix,
      suffix,
      colorScheme,
      loading = false,
      error = false,
      errorMessage = '数据加载失败',
      precision,
      noThousandSeparator = false,
      currency,
      testId,
      ...props
    },
    ref
  ) => {
    const { themeConfig } = useTheme()

    // 格式化后的值
    const formattedValue = useMemo(() => {
      if (formatValue) {
        return formatValue(value)
      }
      return `${prefix || ''}${formatNumber(value, {
        precision,
        noThousandSeparator,
        currency,
      })}${suffix || ''}`
    }, [value, formatValue, prefix, suffix, precision, noThousandSeparator, currency])

    // 趋势数据
    const trend = useMemo(() => {
      if (trendProp?.direction) {
        return trendProp
      }
      // 如果没有趋势数据，尝试从比较数据推断
      if (comparison && typeof comparison.value === 'number') {
        const diff = Number(value) - Number(comparison.value)
        if (diff > 0) {
          return { value: diff, direction: 'up' as const }
        } else if (diff < 0) {
          return { value: Math.abs(diff), direction: 'down' as const }
        }
      }
      return { value: 0, direction: 'neutral' as const, label: '无变化' }
    }, [trendProp, value, comparison])

    // 加载状态
    if (loading) {
      return (
        <motion.div
          className={cn(
            statisticCardVariants({ variant, size, trend: 'neutral' }),
            className
          )}
          ref={ref}
          data-testid={testId || 'statistic-card-loading'}
          data-component="statistic-card"
          data-state="loading"
          {...props}
        >
          <div className="space-y-4">
            {/* 标签骨架屏 */}
            <Skeleton variant="text" width="40%" height="1rem" />

            {/* 数值骨架屏 */}
            <Skeleton variant="text" width="60%" height="2.5rem" />

            {/* 趋势骨架屏 */}
            <div className="flex items-center gap-2">
              <Skeleton variant="text" width="20%" height="1rem" />
              <Skeleton variant="rectangular" width="30%" height="1rem" className="rounded" />
            </div>

            {/* 图表骨架屏 */}
            {chartData && (
              <Skeleton variant="rectangular" width="100%" height="3rem" className="rounded" />
            )}
          </div>
        </motion.div>
      )
    }

    // 错误状态
    if (error) {
      return (
        <motion.div
          className={cn(
            statisticCardVariants({ variant: 'error', size, trend: 'down' }),
            className
          )}
          ref={ref}
          data-testid={testId || 'statistic-card-error'}
          data-component="statistic-card"
          data-state="error"
          role="alert"
          {...props}
        >
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <div className="text-[var(--text-error)] text-4xl mb-2">⚠</div>
            <p className="text-[var(--text-error)] font-medium">{errorMessage}</p>
          </div>
        </motion.div>
      )
    }

    return (
      <motion.div
        className={cn(
          statisticCardVariants({ variant, size, trend: trend.direction }),
          className
        )}
        ref={ref}
        data-testid={testId || 'statistic-card'}
        data-component="statistic-card"
        data-state="normal"
        data-trend={trend.direction}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        {...props}
      >
        {/* 图标 */}
        {icon && (
          <div
            className={cn(
              'flex-shrink-0 mb-4',
              iconPosition === 'right' && 'absolute top-4 right-4',
              iconPosition === 'top' && 'flex justify-center'
            )}
          >
            <div
              className={cn(
                'w-12 h-12 flex items-center justify-center rounded-lg',
                'bg-[var(--bg-secondary)] text-[var(--text-primary)]',
                iconPosition === 'top' && 'w-16 h-16'
              )}
            >
              {icon}
            </div>
          </div>
        )}

        {/* 主要内容 */}
        <div className={cn(icon && iconPosition === 'left' && 'ml-4', 'space-y-3')}>
          {/* 标签 */}
          <p
            className={cn(
              labelVariants({ size }),
              'text-[var(--text-secondary)]'
            )}
          >
            {label}
          </p>

          {/* 数值 */}
          <div className="flex items-baseline gap-2">
            <motion.p
              className={cn(
                valueVariants({ size }),
                'text-[var(--text-primary)]'
              )}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {formattedValue}
            </motion.p>

            {/* 趋势 */}
            {trend.value !== 0 && (
              <motion.div
                className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                  'bg-[var(--bg-secondary)]',
                  getTrendColorClass(themeConfig, trend.direction)
                )}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <span className="text-xs">{getTrendIcon(trend.direction)}</span>
                <span>{Math.abs(trend.value)}%</span>
                {trend.label && <span className="text-[var(--text-secondary)]">{trend.label}</span>}
              </motion.div>
            )}
          </div>

          {/* 对比数据 */}
          {comparison && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[var(--text-secondary)]">{comparison.label}:</span>
              <span className={cn(
                'font-medium',
                comparison.type === 'increase' && 'text-[var(--text-success)]',
                comparison.type === 'decrease' && 'text-[var(--text-error)]',
                (!comparison.type || comparison.type === 'neutral') && 'text-[var(--text-primary)]'
              )}>
                {comparison.value}
              </span>
            </div>
          )}

          {/* 图表 */}
          {chartData && (
            <motion.div
              className="mt-4 pt-4 border-t border-[var(--border-primary)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {renderMiniChart(chartData, chartType, themeConfig)}
            </motion.div>
          )}
        </div>
      </motion.div>
    )
  }
)

StatisticCard.displayName = 'StatisticCard'

// =============================================================================
// 导出变体类型
// =============================================================================

export { statisticCardVariants }
export type StatisticCardVariants = VariantProps<typeof statisticCardVariants>
