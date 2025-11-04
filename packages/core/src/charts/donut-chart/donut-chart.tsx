/**
 * DonutChart - 环形图组件
 *
 * 为图表提供环形图显示，支持中心文本、多层环形、百分比显示等特性。
 * 这是图表组件库的核心组件，基于 ChartContainer 构建。
 */

import React, { forwardRef, useId, useMemo } from 'react'
import { motion, MotionProps } from 'framer-motion'
import { ChartContainer } from '../chart-container/chart-container'
import { Legend, type LegendItem } from '../legend/legend'
import { ChartTooltip, type TooltipData } from '../chart-tooltip/chart-tooltip'
import { cn } from '../../utils/cn'

// ============================================================================
// Props Type Definitions
// ============================================================================

export interface DonutDataPoint {
  /**
   * 数据点的唯一标识
   */
  id: string | number

  /**
   * 数据点的标签
   */
  label: string

  /**
   * 数据点的值
   */
  value: number

  /**
   * 数据点的颜色
   */
  color: string

  /**
   * 数据点是否可见
   */
  visible?: boolean

  /**
   * 自定义数据
   */
  [key: string]: any
}

export interface DonutChartProps extends Omit<MotionProps, 'children'> {
  /**
   * 图表数据
   */
  data: DonutDataPoint[]

  /**
   * 环形图的内部半径比例（0-1）
   */
  innerRadius?: number

  /**
   * 是否显示中心文本
   */
  showCenterText?: boolean

  /**
   * 中心文本的内容
   */
  centerText?: string

  /**
   * 中心文本的副标题
   */
  centerSubtitle?: string

  /**
   * 是否显示百分比
   */
  showPercentage?: boolean

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
  tooltipFormatter?: (data: DonutDataPoint) => React.ReactNode

  /**
   * 是否显示连接线
   */
  showLabels?: boolean

  /**
   * 标签的位置
   */
  labelPosition?: 'inside' | 'outside'

  /**
   * 饼图的起始角度（度数）
   */
  startAngle?: number

  /**
   * 环形图的厚度
   */
  thickness?: number

  /**
   * 环形图的样式类名
   */
  className?: string

  /**
   * 自定义样式
   */
  style?: React.CSSProperties

  /**
   * 图表的高度
   */
  height?: number | string

  /**
   * 图表的宽度
   */
  width?: number | string

  /**
   * 是否启用选择模式
   */
  interactive?: boolean

  /**
   * 选中数据点的索引
   */
  selectedIndex?: number | null
}

// ============================================================================
// Component Implementation
// ============================================================================

/**
 * DonutChart 组件
 *
 * 为图表提供环形图显示，包含：
 * - 可配置的内部半径和厚度
  * - 中心文本和副标题支持
  * - 百分比显示
  * - 图例和工具提示支持
  * - 交互式选择
  * - 主题系统集成
  */
export const DonutChart = forwardRef<HTMLDivElement, DonutChartProps>(
  (
    {
      data,
      innerRadius = 0.6,
      showCenterText = true,
      centerText,
      centerSubtitle,
      showPercentage = true,
      showLegend = true,
      showTooltip = true,
      tooltipFormatter,
      showLabels = false,
      labelPosition = 'outside',
      startAngle = -90,
      thickness = 20,
      className,
      style,
      height = 300,
      width = '100%',
      interactive = true,
      selectedIndex = null,
      ...motionProps
    },
    ref
  ) => {
    const id = useId()

    // 计算图表的尺寸
    const chartSize = Math.min(
      typeof width === 'number' ? width : 500,
      typeof height === 'number' ? height : 300
    )
    const centerX = chartSize / 2
    const centerY = chartSize / 2
    const radius = (chartSize / 2) - 40
    const outerRadius = radius
    const innerR = radius * innerRadius

    // 计算总值
    const totalValue = useMemo(() => {
      return data
        .filter(item => item.visible !== false)
        .reduce((sum, item) => sum + item.value, 0)
    }, [data])

    // 过滤可见数据
    const visibleData = useMemo(() => {
      return data.filter(item => item.visible !== false)
    }, [data])

    // 计算角度
    const getAngle = (value: number, index: number) => {
      const percentage = value / totalValue
      const angle = (percentage * 360)
      const start = index === 0 ? startAngle : startAngle + visibleData.slice(0, index).reduce((sum, item) => sum + (item.value / totalValue * 360), 0)
      return { startAngle: start, endAngle: start + angle }
    }

    // 创建路径
    const createArcPath = (cx: number, cy: number, r: number, ir: number, startAngle: number, endAngle: number) => {
      const start = polarToCartesian(cx, cy, r, endAngle)
      const end = polarToCartesian(cx, cy, r, startAngle)
      const innerStart = polarToCartesian(cx, cy, ir, endAngle)
      const innerEnd = polarToCartesian(cx, cy, ir, startAngle)

      const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'

      const d = [
        'M', start.x, start.y,
        'A', r, r, 0, largeArcFlag, 0, end.x, end.y,
        'L', innerEnd.x, innerEnd.y,
        'A', ir, ir, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
        'Z'
      ].join(' ')

      return d
    }

    // 极坐标转笛卡尔坐标
    const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
      const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
      return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
      }
    }

    // 计算百分比
    const getPercentage = (value: number) => {
      return ((value / totalValue) * 100).toFixed(1)
    }

    // 计算标签位置
    const getLabelPosition = (item: DonutDataPoint, index: number) => {
      const angle = getAngle(item.value, index)
      const midAngle = (angle.startAngle + angle.endAngle) / 2
      const labelRadius = labelPosition === 'inside' ? (outerRadius + innerR) / 2 : outerRadius + 30
      const pos = polarToCartesian(centerX, centerY, labelRadius, midAngle)
      return pos
    }

    // 计算图例项
    const legendItems: LegendItem[] = visibleData.map((item, index) => ({
      id: String(item.id),
      label: item.label,
      color: item.color,
      visible: item.visible !== false
    }))

    // 工具提示处理
    const [tooltipData, setTooltipData] = React.useState<TooltipData | null>(null)

    const handleMouseEnter = (item: DonutDataPoint, index: number, event: React.MouseEvent<SVGElement>) => {
      if (!showTooltip) return

      const rect = event.currentTarget.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top

      const tooltipContent = tooltipFormatter
        ? tooltipFormatter(item)
        : `${item.label}: ${item.value} (${getPercentage(item.value)}%)`

      setTooltipData({
        id: String(item.id),
        title: item.label,
        content: tooltipContent,
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        color: item.color,
        value: item.value
      })
    }

    const handleMouseLeave = () => {
      setTooltipData(null)
    }

    // 处理点击选择
    const handleClick = (index: number) => {
      if (!interactive) return
      // 这里可以添加选择逻辑
    }

    return (
      <div
        ref={ref}
        id={id}
        className={cn('donut-chart', className)}
        style={{ width, height: typeof height === 'number' ? `${height}px` : height, ...style }}
        {...motionProps}
      >
        <ChartContainer height={height}>
          <div className="flex items-center justify-center">
            <svg
              width={chartSize}
              height={chartSize}
              className="overflow-visible"
            >
              {/* 环形段 */}
              {visibleData.map((item, index) => {
                const angle = getAngle(item.value, index)
                const pathData = createArcPath(centerX, centerY, outerRadius, innerR, angle.startAngle, angle.endAngle)
                const isSelected = selectedIndex === index

                return (
                  <motion.path
                    key={item.id}
                    d={pathData}
                    fill={item.color}
                    stroke="var(--color-surface)"
                    strokeWidth={2}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onMouseEnter={(e) => handleMouseEnter(item, index, e)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick(index)}
                    className={cn(
                      'cursor-pointer transition-all duration-200',
                      interactive && 'hover:opacity-80',
                      isSelected && 'opacity-90'
                    )}
                    style={{
                      transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                      transformOrigin: `${centerX}px ${centerY}px`
                    }}
                  />
                )
              })}

              {/* 标签线 */}
              {showLabels && (
                <>
                  {visibleData.map((item, index) => {
                    const angle = getAngle(item.value, index)
                    const midAngle = (angle.startAngle + angle.endAngle) / 2
                    const labelRadius = labelPosition === 'inside' ? (outerRadius + innerR) / 2 : outerRadius + 10
                    const labelPos = polarToCartesian(centerX, centerY, labelRadius, midAngle)
                    const lineEnd = polarToCartesian(centerX, centerY, outerRadius + 20, midAngle)

                    return (
                      <g key={`label-${item.id}`}>
                        <line
                          x1={labelPos.x}
                          y1={labelPos.y}
                          x2={lineEnd.x}
                          y2={lineEnd.y}
                          stroke="var(--color-border)"
                          strokeWidth={1}
                          opacity={0.6}
                        />
                        <text
                          x={lineEnd.x + 10}
                          y={lineEnd.y}
                          fill="var(--color-text-primary)"
                          fontSize={12}
                          dominantBaseline="middle"
                        >
                          {item.label}
                        </text>
                      </g>
                    )
                  })}
                </>
              )}

              {/* 中心文本 */}
              {showCenterText && (
                <g>
                  {centerText && (
                    <text
                      x={centerX}
                      y={centerY - 5}
                      textAnchor="middle"
                      fill="var(--color-text-primary)"
                      fontSize={20}
                      fontWeight="bold"
                    >
                      {centerText}
                    </text>
                  )}
                  {centerSubtitle && (
                    <text
                      x={centerX}
                      y={centerY + 15}
                      textAnchor="middle"
                      fill="var(--color-text-secondary)"
                      fontSize={14}
                    >
                      {centerSubtitle}
                    </text>
                  )}
                  {showPercentage && !centerText && (
                    <>
                      <text
                        x={centerX}
                        y={centerY - 5}
                        textAnchor="middle"
                        fill="var(--color-text-primary)"
                        fontSize={20}
                        fontWeight="bold"
                      >
                        {totalValue}
                      </text>
                      <text
                        x={centerX}
                        y={centerY + 15}
                        textAnchor="middle"
                        fill="var(--color-text-secondary)"
                        fontSize={14}
                      >
                        总计
                      </text>
                    </>
                  )}
                </g>
              )}
            </svg>
          </div>

          {/* 图例 */}
          {showLegend && legendItems.length > 0 && (
            <div className="mt-4">
              <Legend
                items={legendItems}
                orientation="horizontal"
                align="center"
                gap={20}
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
        </ChartContainer>
      </div>
    )
  }
)

DonutChart.displayName = 'DonutChart'

// ============================================================================
// Export
// ============================================================================

export type { DonutChartProps, DonutDataPoint }
