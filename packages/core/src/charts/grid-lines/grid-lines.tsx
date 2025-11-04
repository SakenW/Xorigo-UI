import React, { forwardRef, useMemo } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cva, type VariantProps } from '../../utils/cva-standalone'
import { cn } from '../../utils/cn'
import { useTheme } from '@xorigo-ui/system'

// 图表边距类型
export interface ChartMargin {
  top: number
  right: number
  bottom: number
  left: number
}

// 网格线变体配置
const gridLineVariants = cva(
  'pointer-events-none',
  {
    variants: {
      variant: {
        default: '',
        dashed: '[stroke-dasharray:4,4]',
        dotted: '[stroke-dasharray:1,4]',
        bold: '[stroke-width:2]'
      },
      opacity: {
        subtle: 'stroke-opacity-20',
        medium: 'stroke-opacity-40',
        strong: 'stroke-opacity-60'
      }
    },
    defaultVariants: {
      variant: 'default',
      opacity: 'subtle'
    }
  }
)

// 网格线方向类型
export type GridLineDirection = 'horizontal' | 'vertical' | 'both'

// 网格线配置接口
export interface GridLineConfig {
  /**
   * 网格线数量
   * @default 5
   */
  count?: number
  /**
   * 网格线颜色
   * @default 'currentColor'
   */
  color?: string
  /**
   * 网格线样式
   * @default 'default'
   */
  variant?: 'default' | 'dashed' | 'dotted' | 'bold'
  /**
   * 网格线透明度
   * @default 'subtle'
   */
  opacity?: 'subtle' | 'medium' | 'strong'
  /**
   * 是否显示标签
   * @default true
   */
  showLabels?: boolean
  /**
   * 标签格式化函数
   */
  formatLabel?: (index: number, value: number | string) => string
  /**
   * 网格线间距（像素）
   */
  spacing?: number
}

// 主组件属性接口
export interface GridLinesProps
  extends Omit<HTMLMotionProps<'g'>, 'children'> {
  /**
   * 网格线方向
   * @default 'both'
   */
  direction?: GridLineDirection
  /**
   * 水平网格线配置
   */
  horizontal?: GridLineConfig
  /**
   * 垂直网格线配置
   */
  vertical?: GridLineConfig
  /**
   * 图表尺寸
   */
  width: number
  /**
   * 图表尺寸
   */
  height: number
  /**
   * 图表边距
   */
  margin?: ChartMargin
  /**
   * 图表主题
   * @default 'light'
   */
  theme?: 'light' | 'dark'
  /**
   * 是否显示坐标轴
   * @default true
   */
  showAxes?: boolean
  /**
   * 坐标轴颜色
   * @default 'currentColor'
   */
  axisColor?: string
  /**
   * 坐标轴样式
   */
  axisStyle?: 'default' | 'bold' | 'none'
  /**
   * 动画持续时间（秒）
   * @default 0.8
   */
  animationDuration?: number
  /**
   * 动画延迟（秒）
   * @default 0
   */
  animationDelay?: number
  /**
   * 数据范围（用于计算标签值）
   */
  dataRange?: {
    min: number
    max: number
    labels?: string[]
  }
  /**
   * 自定义标签类名
   */
  labelClassName?: string
  /**
   * 是否启用动画
   * @default true
   */
  animated?: boolean
}

export const GridLines = forwardRef<SVGGElement, GridLinesProps>(
  ({
    direction = 'both',
    horizontal,
    vertical,
    width,
    height,
    margin,
    theme = 'light',
    showAxes = true,
    axisColor = 'currentColor',
    axisStyle = 'default',
    animationDuration = 0.8,
    animationDelay = 0,
    dataRange,
    labelClassName,
    animated = true,
    className,
    ...props
  }, ref) => {
    const { themeConfig } = useTheme()

    // 默认边距
    const defaultMargin = useMemo(() => ({
      top: 20,
      right: 30,
      bottom: 40,
      left: 50,
      ...margin
    }), [margin])

    // 计算图表区域
    const chartWidth = width - defaultMargin.left - defaultMargin.right
    const chartHeight = height - defaultMargin.top - defaultMargin.bottom

    // 默认配置
    const defaultHorizontalConfig: GridLineConfig = {
      count: 5,
      color: 'currentColor',
      variant: 'default',
      opacity: 'subtle',
      showLabels: true,
      spacing: chartHeight / 5,
      ...horizontal
    }

    const defaultVerticalConfig: GridLineConfig = {
      count: 6,
      color: 'currentColor',
      variant: 'default',
      opacity: 'subtle',
      showLabels: true,
      spacing: chartWidth / 6,
      ...vertical
    }

    // 生成水平网格线
    const horizontalGridLines = useMemo(() => {
      if (!['both', 'horizontal'].includes(direction) || !defaultHorizontalConfig.count) {
        return []
      }

      const lines = []
      const { count, color, variant, opacity, showLabels, formatLabel, spacing } = defaultHorizontalConfig

      for (let i = 0; i <= count; i++) {
        const y = defaultMargin.top + (spacing || chartHeight / count) * i
        const lineKey = `h-grid-${i}`

        // 网格线
        lines.push(
          <motion.line
            key={lineKey}
            x1={defaultMargin.left}
            y1={y}
            x2={defaultMargin.left + chartWidth}
            y2={y}
            stroke={color}
            strokeWidth="1"
            className={cn(
              gridLineVariants({ variant, opacity }),
              'text-gray-400 dark:text-gray-600'
            )}
            initial={animated ? { opacity: 0, pathLength: 0 } : undefined}
            animate={animated ? { opacity: 1, pathLength: 1 } : undefined}
            transition={animated ? {
              duration: animationDuration,
              delay: animationDelay + i * 0.05,
              ease: 'easeOut'
            } : undefined}
          />
        )

        // Y轴标签
        if (showLabels) {
          let labelValue: string | number = ''

          if (dataRange) {
            const value = dataRange.max - ((dataRange.max - dataRange.min) / count) * i
            labelValue = formatLabel ? formatLabel(i, value) : value.toFixed(0)
          } else {
            labelValue = formatLabel ? formatLabel(i, i) : i.toString()
          }

          lines.push(
            <motion.text
              key={`y-label-${i}`}
              x={defaultMargin.left - 10}
              y={y + 5}
              textAnchor="end"
              className={cn(
                'text-xs fill-gray-500 dark:fill-gray-400 font-medium',
                labelClassName
              )}
              initial={animated ? { opacity: 0, x: -10 } : undefined}
              animate={animated ? { opacity: 1, x: 0 } : undefined}
              transition={animated ? {
                duration: 0.3,
                delay: animationDelay + 0.3 + i * 0.05,
                ease: 'easeOut'
              } : undefined}
            >
              {labelValue}
            </motion.text>
          )
        }
      }

      return lines
    }, [direction, defaultHorizontalConfig, defaultMargin, chartWidth, dataRange, animated, animationDuration, animationDelay, labelClassName])

    // 生成垂直网格线
    const verticalGridLines = useMemo(() => {
      if (!['both', 'vertical'].includes(direction) || !defaultVerticalConfig.count) {
        return []
      }

      const lines = []
      const { count, color, variant, opacity, showLabels, formatLabel, spacing } = defaultVerticalConfig

      for (let i = 0; i < count; i++) {
        const x = defaultMargin.left + (spacing || chartWidth / count) * i
        const lineKey = `v-grid-${i}`

        // 网格线
        lines.push(
          <motion.line
            key={lineKey}
            x1={x}
            y1={defaultMargin.top}
            x2={x}
            y2={defaultMargin.top + chartHeight}
            stroke={color}
            strokeWidth="1"
            className={cn(
              gridLineVariants({ variant, opacity }),
              'text-gray-400 dark:text-gray-600'
            )}
            initial={animated ? { opacity: 0, pathLength: 0 } : undefined}
            animate={animated ? { opacity: 1, pathLength: 1 } : undefined}
            transition={animated ? {
              duration: animationDuration,
              delay: animationDelay + i * 0.05,
              ease: 'easeOut'
            } : undefined}
          />
        )

        // X轴标签
        if (showLabels) {
          let labelValue: string | number = ''

          if (dataRange?.labels && dataRange.labels[i]) {
            labelValue = dataRange.labels[i]
          } else if (dataRange) {
            labelValue = formatLabel ? formatLabel(i, i) : i.toString()
          } else {
            labelValue = formatLabel ? formatLabel(i, i) : i.toString()
          }

          lines.push(
            <motion.text
              key={`x-label-${i}`}
              x={x + (spacing || chartWidth / count) / 2}
              y={height - 10}
              textAnchor="middle"
              className={cn(
                'text-xs fill-gray-500 dark:fill-gray-400 font-medium',
                labelClassName
              )}
              initial={animated ? { opacity: 0, y: 10 } : undefined}
              animate={animated ? { opacity: 1, y: 0 } : undefined}
              transition={animated ? {
                duration: 0.3,
                delay: animationDelay + 0.3 + i * 0.05,
                ease: 'easeOut'
              } : undefined}
            >
              {labelValue}
            </motion.text>
          )
        }
      }

      return lines
    }, [direction, defaultVerticalConfig, defaultMargin, chartHeight, dataRange, width, animated, animationDuration, animationDelay, labelClassName])

    // 生成坐标轴
    const axes = useMemo(() => {
      if (!showAxes || axisStyle === 'none') {
        return []
      }

      const axisElements = []

      // Y轴
      if (axisStyle === 'bold' || axisStyle === 'default') {
        axisElements.push(
          <motion.line
            key="y-axis"
            x1={defaultMargin.left}
            y1={defaultMargin.top}
            x2={defaultMargin.left}
            y2={defaultMargin.top + chartHeight}
            stroke={axisColor}
            strokeWidth={axisStyle === 'bold' ? 3 : 2}
            className="text-gray-300 dark:text-gray-700"
            initial={animated ? { opacity: 0, pathLength: 0 } : undefined}
            animate={animated ? { opacity: 1, pathLength: 1 } : undefined}
            transition={animated ? {
              duration: animationDuration * 0.8,
              delay: animationDelay + 0.2,
              ease: 'easeOut'
            } : undefined}
          />
        )
      }

      // X轴
      if (axisStyle === 'bold' || axisStyle === 'default') {
        axisElements.push(
          <motion.line
            key="x-axis"
            x1={defaultMargin.left}
            y1={height - defaultMargin.bottom}
            x2={defaultMargin.left + chartWidth}
            y2={height - defaultMargin.bottom}
            stroke={axisColor}
            strokeWidth={axisStyle === 'bold' ? 3 : 2}
            className="text-gray-300 dark:text-gray-700"
            initial={animated ? { opacity: 0, pathLength: 0 } : undefined}
            animate={animated ? { opacity: 1, pathLength: 1 } : undefined}
            transition={animated ? {
              duration: animationDuration * 0.8,
              delay: animationDelay + 0.2,
              ease: 'easeOut'
            } : undefined}
          />
        )
      }

      return axisElements
    }, [showAxes, axisStyle, axisColor, defaultMargin, chartWidth, chartHeight, height, animated, animationDuration, animationDelay])

    return (
      <motion.g
        ref={ref}
        className={cn('grid-lines', className)}
        initial={animated ? { opacity: 0 } : undefined}
        animate={animated ? { opacity: 1 } : undefined}
        transition={animated ? {
          duration: animationDuration * 0.5,
          delay: animationDelay,
          ease: 'easeOut'
        } : undefined}
        {...props}
      >
        {/* 网格线 */}
        {horizontalGridLines}
        {verticalGridLines}

        {/* 坐标轴 */}
        {axes}
      </motion.g>
    )
  }
)

GridLines.displayName = 'GridLines'

// 导出变体类型
export { gridLineVariants }
export type GridLineVariants = VariantProps<typeof gridLineVariants>
