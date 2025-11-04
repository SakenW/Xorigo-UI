/**
 * RadarChart - 雷达图组件
 *
 * 为图表提供雷达图显示，支持多维度数据对比、面积填充、网格线等特性。
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

export interface RadarDataPoint {
  /**
   * 维度名称
   */
  dimension: string

  /**
   * 维度值
   */
  value: number

  /**
   * 自定义数据
   */
  [key: string]: any
}

export interface RadarSeries {
  /**
   * 系列名称
   */
  name: string

  /**
   * 系列数据
   */
  data: RadarDataPoint[]

  /**
   * 系列颜色
   */
  color: string

  /**
   * 系列是否可见
   */
  visible?: boolean

  /**
   * 填充透明度
   */
  fillOpacity?: number

  /**
   * 是否显示边界线
   */
  showStroke?: boolean
}

export interface RadarChartProps extends Omit<MotionProps, 'children'> {
  /**
   * 雷达图数据系列
   */
  data: RadarSeries[]

  /**
   * 是否显示网格线
   */
  showGrid?: boolean

  /**
   * 是否显示网格标签
   */
  showGridLabels?: boolean

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
  tooltipFormatter?: (data: RadarDataPoint, series: RadarSeries) => React.ReactNode

  /**
   * 雷达图的半径
   */
  radius?: number

  /**
   * 雷达图的起始角度（度数）
   */
  startAngle?: number

  /**
   * 雷达图的样式类名
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
   * 是否显示中心点
   */
  showCenterPoint?: boolean

  /**
   * 中心点的大小
   */
  centerPointSize?: number

  /**
   * 网格线的数量
   */
  gridLevels?: number

  /**
   * 是否填充区域
   */
  fillArea?: boolean

  /**
   * 是否启用交互
   */
  interactive?: boolean

  /**
   * 网格线的样式
   */
  gridLineStyle?: 'circle' | 'polygon'

  /**
   * 网格线的颜色
   */
  gridLineColor?: string

  /**
   * 维度标签的字体大小
   */
  labelFontSize?: number

  /**
   * 维度标签的颜色
   */
  labelColor?: string
}

// ============================================================================
// Component Implementation
// ============================================================================

/**
 * RadarChart 组件
 *
 * 为图表提供雷达图显示，包含：
 * - 多维度数据对比
 * - 可配置的颜色和透明度
 * - 网格线和标签支持
 * - 图例和工具提示支持
 * - 主题系统集成
 */
export const RadarChart = forwardRef<HTMLDivElement, RadarChartProps>(
  (
    {
      data,
      showGrid = true,
      showGridLabels = true,
      showLegend = true,
      showTooltip = true,
      tooltipFormatter,
      radius = 120,
      startAngle = -90,
      className,
      style,
      height = 400,
      width = '100%',
      showCenterPoint = true,
      centerPointSize = 4,
      gridLevels = 5,
      fillArea = true,
      interactive = true,
      gridLineStyle = 'circle',
      gridLineColor,
      labelFontSize = 12,
      labelColor,
      ...motionProps
    },
    ref
  ) => {
    const id = useId()

    // 计算图表的尺寸
    const chartSize = Math.min(
      typeof width === 'number' ? width : 500,
      typeof height === 'number' ? height : 400
    )
    const centerX = chartSize / 2
    const centerY = chartSize / 2
    const actualRadius = Math.min(radius, (chartSize / 2) - 60)

    // 获取所有可见的系列
    const visibleSeries = useMemo(() => {
      return data.filter(series => series.visible !== false)
    }, [data])

    // 获取所有维度
    const allDimensions = useMemo(() => {
      if (visibleSeries.length === 0) return []

      const dimensionSet = new Set<string>()
      visibleSeries.forEach(series => {
        series.data.forEach(point => {
          dimensionSet.add(point.dimension)
        })
      })

      return Array.from(dimensionSet)
    }, [visibleSeries])

    // 计算维度角度
    const getDimensionAngles = () => {
      if (allDimensions.length === 0) return []

      const angleStep = 360 / allDimensions.length

      return allDimensions.map((_, index) => {
        return startAngle + (index * angleStep)
      })
    }

    const dimensionAngles = getDimensionAngles()

    // 计算每个维度的最大值
    const getMaxValue = () => {
      if (visibleSeries.length === 0) return 0

      let max = 0
      visibleSeries.forEach(series => {
        series.data.forEach(point => {
          max = Math.max(max, point.value)
        })
      })

      return max
    }

    const maxValue = getMaxValue()

    // 极坐标转笛卡尔坐标
    const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
      const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
      return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
      }
    }

    // 计算系列路径
    const calculateSeriesPath = (series: RadarSeries) => {
      if (allDimensions.length === 0) return ''

      const pathData = allDimensions.map((dimension, index) => {
        // 找到该维度在系列中的数据点
        const dataPoint = series.data.find(point => point.dimension === dimension)
        const value = dataPoint ? dataPoint.value : 0

        // 计算归一化值
        const normalizedValue = maxValue > 0 ? value / maxValue : 0

        // 计算该维度在雷达图上的半径
        const r = actualRadius * normalizedValue

        // 计算角度
        const angle = dimensionAngles[index]

        // 转换为笛卡尔坐标
        const point = polarToCartesian(centerX, centerY, r, angle)

        return point
      })

      // 创建路径字符串
      if (pathData.length === 0) return ''

      let pathString = `M ${pathData[0].x},${pathData[0].y}`
      pathData.slice(1).forEach(point => {
        pathString += ` L ${point.x},${point.y}`
      })

      // 闭合路径
      if (fillArea) {
        pathString += ' Z'
      }

      return pathString
    }

    // 计算中心点标记的路径
    const calculateCenterPointsPath = (series: RadarSeries) => {
      if (!showCenterPoint || allDimensions.length === 0) return []

      return allDimensions.map((dimension, index) => {
        // 找到该维度在系列中的数据点
        const dataPoint = series.data.find(point => point.dimension === dimension)
        const value = dataPoint ? dataPoint.value : 0

        // 计算归一化值
        const normalizedValue = maxValue > 0 ? value / maxValue : 0

        // 计算该维度在雷达图上的半径
        const r = actualRadius * normalizedValue

        // 计算角度
        const angle = dimensionAngles[index]

        // 转换为笛卡尔坐标
        const point = polarToCartesian(centerX, centerY, r, angle)

        return {
          ...point,
          dimension,
          value,
          dataPoint
        }
      })
    }

    // 计算网格线路径
    const calculateGridPaths = () => {
      if (!showGrid) return []

      const paths = []

      // 创建同心多边形网格
      for (let level = 1; level <= gridLevels; level++) {
        const levelRadius = (actualRadius / gridLevels) * level
        const points = allDimensions.map((_, index) => {
          const angle = dimensionAngles[index]
          return polarToCartesian(centerX, centerY, levelRadius, angle)
        })

        if (points.length === 0) continue

        let pathString = `M ${points[0].x},${points[0].y}`
        points.slice(1).forEach(point => {
          pathString += ` L ${point.x},${point.y}`
        })

        // 闭合路径
        if (gridLineStyle === 'polygon') {
          pathString += ' Z'
        }

        paths.push({
          path: pathString,
          level,
          radius: levelRadius
        })
      }

      // 创建径向网格线
      allDimensions.forEach((dimension, index) => {
        const angle = dimensionAngles[index]
        const endPoint = polarToCartesian(centerX, centerY, actualRadius, angle)

        paths.push({
          path: `M ${centerX},${centerY} L ${endPoint.x},${endPoint.y}`,
          isRadial: true,
          angle,
          dimension
        })
      })

      return paths
    }

    const gridPaths = calculateGridPaths()

    // 计算维度标签位置
    const calculateLabelPositions = () => {
      return allDimensions.map((dimension, index) => {
        const angle = dimensionAngles[index]
        const labelRadius = actualRadius + 30
        const position = polarToCartesian(centerX, centerY, labelRadius, angle)

        return {
          dimension,
          x: position.x,
          y: position.y,
          angle
        }
      })
    }

    const labelPositions = calculateLabelPositions()

    // 计算图例项
    const legendItems: LegendItem[] = visibleSeries.map((series, index) => ({
      id: String(index),
      label: series.name,
      color: series.color,
      visible: series.visible !== false,
      symbol: 'circle'
    }))

    // 工具提示处理
    const [tooltipData, setTooltipData] = React.useState<TooltipData | null>(null)

    const handleMouseEnter = (dataPoint: any, series: RadarSeries, event: React.MouseEvent<SVGElement>) => {
      if (!showTooltip) return

      const rect = event.currentTarget.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      const tooltipContent = tooltipFormatter
        ? tooltipFormatter(dataPoint.dataPoint, series)
        : `${series.name}: ${dataPoint.value}`

      setTooltipData({
        id: String(series.name),
        title: dataPoint.dimension,
        content: tooltipContent,
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        color: series.color
      })
    }

    const handleMouseLeave = () => {
      setTooltipData(null)
    }

    // 默认网格线颜色
    const defaultGridColor = gridLineColor || 'var(--color-border)'
    const defaultLabelColor = labelColor || 'var(--color-text-secondary)'

    return (
      <div
        ref={ref}
        id={id}
        className={cn('radar-chart', className)}
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
              {/* 网格线 */}
              {showGrid && (
                <>
                  {gridPaths.map((gridPath, index) => (
                    <path
                      key={`grid-${index}`}
                      d={gridPath.path}
                      fill={gridPath.isRadial ? 'none' : 'none'}
                      stroke={defaultGridColor}
                      strokeWidth={gridPath.isRadial ? 1 : 0.5}
                      opacity={gridPath.isRadial ? 0.3 : 0.2}
                    />
                  ))}
                </>
              )}

              {/* 网格标签 */}
              {showGridLabels && !showGrid && (
                <>
                  {labelPositions.map((label, index) => (
                    <text
                      key={`label-${index}`}
                      x={label.x}
                      y={label.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={defaultLabelColor}
                      fontSize={labelFontSize}
                    >
                      {label.dimension}
                    </text>
                  ))}
                </>
              )}

              {/* 数据系列 */}
              {visibleSeries.map((series, seriesIndex) => {
                const pathData = calculateSeriesPath(series)
                const centerPoints = calculateCenterPointsPath(series)
                const seriesOpacity = series.fillOpacity !== undefined ? series.fillOpacity : 0.3

                if (!pathData) return null

                return (
                  <g key={seriesIndex}>
                    {/* 填充区域 */}
                    {fillArea && (
                      <motion.path
                        d={pathData}
                        fill={series.color}
                        fillOpacity={seriesOpacity}
                        stroke={series.showStroke !== false ? series.color : 'none'}
                        strokeWidth={series.showStroke !== false ? 2 : 0}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.8, delay: seriesIndex * 0.1 }}
                        className={cn(
                          interactive && 'cursor-pointer',
                          'transition-opacity duration-200',
                          'hover:opacity-80'
                        )}
                      />
                    )}

                    {/* 中心点标记 */}
                    {showCenterPoint && centerPoints.map((point, pointIndex) => (
                      <motion.circle
                        key={pointIndex}
                        cx={point.x}
                        cy={point.y}
                        r={centerPointSize}
                        fill={series.color}
                        stroke="var(--color-surface)"
                        strokeWidth={2}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, delay: (seriesIndex * 0.1) + (pointIndex * 0.05) }}
                        onMouseEnter={(e) => handleMouseEnter(point, series, e)}
                        onMouseLeave={handleMouseLeave}
                        className={cn(
                          interactive && 'cursor-pointer',
                          'hover:stroke-2'
                        )}
                      />
                    ))}

                    {/* 维度标签 */}
                    {showGridLabels && labelPositions.map((label, labelIndex) => (
                      <text
                        key={`label-${seriesIndex}-${labelIndex}`}
                        x={label.x}
                        y={label.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={defaultLabelColor}
                        fontSize={labelFontSize}
                        className="pointer-events-none"
                      >
                        {label.dimension}
                      </text>
                    ))}
                  </g>
                )
              })}
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

RadarChart.displayName = 'RadarChart'

// ============================================================================
// Export
// ============================================================================

export type { RadarChartProps, RadarDataPoint, RadarSeries }
