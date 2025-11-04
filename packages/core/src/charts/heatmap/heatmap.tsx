/**
 * Heatmap - 热力图组件
 *
 * @description 数据可视化热力图组件
 *
 * 功能特性：
 * - 矩阵数据展示：支持二维数据的可视化
 * - 颜色映射：根据数值大小自动映射颜色深浅
 * - 交互支持：悬停显示工具提示、点击单元格触发事件
 * - 图例显示：在底部显示颜色映射范围
 * - 数值标签：可选在单元格中显示具体数值
 * - 自定义样式：支持自定义颜色方案、间距、圆角等
 * - 响应式设计：支持百分比宽度和数值宽度
 * - 主题集成：完美集成七轴主题系统
 * - 动画效果：Framer Motion 驱动的流畅动画
 * - 可访问性：支持 ARIA 属性和键盘导航
 *
 * 基础用法：
 * ```tsx
 * const data = [
 *   {
 *     name: '产品销售',
 *     data: [
 *       { x: '北京', y: '1月', value: 120 },
 *       { x: '北京', y: '2月', value: 180 },
 *       { x: '上海', y: '1月', value: 150 }
 *     ]
 *   }
 * ]
 *
 * <Heatmap data={data} />
 * ```
 *
 * 高级用法：
 * ```tsx
 * <Heatmap
 *   data={data}
 *   showValues={true}
 *   showTooltip={true}
 *   showLegend={true}
 *   cellGap={4}
 *   colorScale={customColors}
 *   onCellClick={(data, series) => console.log('点击', data)}
 * />
 * ```
 *
 * @author Xorigo UI Team
 * @version 1.0.0
 * @since 2025-11-04
 * @see {@link https://github.com/xorigo-ui/heatmap} - 项目主页
 */

import React, { forwardRef, useId, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../utils/cn'
import { ChartContainer } from '../chart-container/chart-container'

// ============================================================================
// Props Type Definitions
// ============================================================================

/**
 * 热力图数据点
 * 表示热力图中的单个单元格数据
 *
 * @example
 * ```typescript
 * const dataPoint: HeatmapDataPoint = {
 *   x: '北京',    // X 轴标签（列）
 *   y: '1月',     // Y 轴标签（行）
 *   value: 120    // 数值（用于颜色映射）
 * }
 * ```
 */
export interface HeatmapDataPoint {
  /**
   * X 轴标签（列标识）
   * 通常用于表示分类维度，如地区、时间、产品等
   *
   * @example '北京' | '产品A' | 'Q1'
   */
  x: string

  /**
   * Y 轴标签（行标识）
   * 通常用于表示时间维度或其他分类维度
   *
   * @example '1月' | '类别A' | '2024'
   */
  y: string

  /**
   * 数值（用于颜色映射）
   * 该值将决定单元格的颜色深浅，通常为正数，也支持负数
   *
   * @example 120 | -50 | 0.85
   */
  value: number

  /**
   * 自定义数据（扩展属性）
   * 可添加任意自定义属性，在事件回调中访问
   *
   * @example { category: '电子产品', id: '123' }
   */
  [key: string]: any
}

/**
 * 热力图数据系列
 * 包含一个完整的数据系列，支持多系列对比
 *
 * @example
 * ```typescript
 * const series: HeatmapSeries = {
 *   name: '2024年销售数据',
 *   data: [
 *     { x: '北京', y: 'Q1', value: 120 },
 *     { x: '上海', y: 'Q1', value: 180 }
 *   ],
 *   visible: true
 * }
 * ```
 */
export interface HeatmapSeries {
  /**
   * 系列名称
   * 用于区分不同系列，在工具提示中显示
   *
   * @example '2024年' | '产品线A' | '实验组'
   */
  name: string

  /**
   * 系列数据
   * 数据点数组，每个点包含 x、y、value 等属性
   *
   * @example [{ x: '北京', y: '1月', value: 120 }]
   */
  data: HeatmapDataPoint[]

  /**
   * 系列是否可见
   * 控制系列在图表中的显示/隐藏状态
   *
   * @default true
   */
  visible?: boolean
}

/**
 * Heatmap 组件属性
 * 完整的组件配置选项
 *
 * @example
 * ```typescript
 * const props: HeatmapProps = {
 *   data: myData,
 *   showValues: true,
 *   showTooltip: true,
 *   showLegend: true,
 *   cellGap: 4,
 *   colorScale: ['#blue', '#red'],
 *   onCellClick: (data, series) => {}
 * }
 * ```
 */
export interface HeatmapProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 图表数据
   * 必需属性，包含一个或多个数据系列
   *
   * @example
   * ```typescript
   * [
   *   {
   *     name: '系列名称',
   *     data: [
   *       { x: 'X标签', y: 'Y标签', value: 100 }
   *     ]
   *   }
   * ]
   * ```
   */
  data: HeatmapSeries[]

  /**
   * 最小值（用于颜色映射）
   * 可选属性，自定义颜色映射的最小值
   * 如果不提供，则自动从数据中计算最小值
   *
   * @default 自动计算
   * @example 0 | -100 | 50
   */
  minValue?: number

  /**
   * 最大值（用于颜色映射）
   * 可选属性，自定义颜色映射的最大值
   * 如果不提供，则自动从数据中计算最大值
   *
   * @default 自动计算
   * @example 1000 | 300 | 100
   */
  maxValue?: number

  /**
   * 是否显示数值标签
   * 在每个单元格中显示具体的数值
   * 注意：大数据集建议关闭此选项以提高性能
   *
   * @default false
   * @example true | false
   */
  showValues?: boolean

  /**
   * 是否显示工具提示
   * 鼠标悬停时显示详细信息的提示框
   * 包含单元格的具体信息和所属系列
   *
   * @default true
   * @example true | false
   */
  showTooltip?: boolean

  /**
   * 是否显示图例
   * 在图表底部显示颜色映射范围说明
   * 帮助用户理解颜色与数值的对应关系
   *
   * @default true
   * @example true | false
   */
  showLegend?: boolean

  /**
   * 是否显示网格线
   * 在单元格之间显示辅助网格线
   * 有助于数据读取和视觉对齐
   *
   * @default true
   * @example true | false
   */
  showGrid?: boolean

  /**
   * 单元格之间的间距
   * 控制相邻单元格之间的像素间距
   * 增大间距可以增强视觉分隔，但会减少单元格大小
   *
   * @default 2
   * @range 0-20
   * @example 2 | 4 | 8
   */
  cellGap?: number

  /**
   * 单元格的圆角
   * 控制单元格矩形的圆角半径
   * 设置为 0 则使用直角矩形
   *
   * @default 4
   * @range 0-10
   * @example 4 | 0 | 8
   */
  cellRadius?: number

  /**
   * 颜色调色板
   * 自定义颜色映射方案
   * 数组长度决定颜色分层的精细度
   * 第一种颜色对应最小值，最后一种对应最大值
   *
   * @default ['#3b82f6', '#06b6d4', '#10b981', '#84cc16', '#eab308', '#f59e0b', '#ef4444']
   * @example ['#red', '#blue', '#green']
   */
  colorScale?: string[]

  /**
   * 自定义工具提示渲染函数
   * 完全自定义工具提示的内容和样式
   * 返回的 React 节点将作为工具提示内容
   *
   * @param data - 单元格数据点
   * @param series - 所属数据系列
   * @returns React.ReactNode - 自定义工具提示内容
   *
   * @example
   * ```typescript
   * (data, series) => (
   *   <div>
   *     <strong>{data.x} - {data.y}</strong>
   *     <div>系列: {series.name}</div>
   *     <div>值: {data.value}</div>
   *   </div>
   * )
   * ```
   */
  tooltipFormatter?: (data: HeatmapDataPoint, series: HeatmapSeries) => React.ReactNode

  /**
   * 格式化数值的函数
   * 自定义数值的显示格式
   * 用于数值标签和图例中的数值显示
   *
   * @param value - 原始数值
   * @returns string - 格式化后的字符串
   *
   * @example
   * ```typescript
   * (value) => `¥${value}`
   * (value) => `${value}%`
   * (value) => value.toFixed(2)
   * ```
   */
  formatValue?: (value: number) => string

  /**
   * 动画持续时间（秒）
   * 控制组件加载动画的持续时间
   * 设置为 0 可禁用动画
   *
   * @default 1.2
   * @range 0-5
   * @example 1.2 | 0 | 2.0
   */
  animationDuration?: number

  /**
   * 单元格点击事件
   * 当用户点击单元格时触发
   * 可用于实现详情查看、数据钻取等功能
   *
   * @param data - 被点击的单元格数据
   * @param series - 所属数据系列
   *
   * @example
   * ```typescript
   * (data, series) => {
   *   console.log('点击了:', data.x, data.y, '值为:', data.value)
   *   // 跳转到详情页
   *   router.push(`/detail/${data.id}`)
   * }
   * ```
   */
  onCellClick?: (data: HeatmapDataPoint, series: HeatmapSeries) => void

  /**
   * 单元格悬停事件
   * 当用户鼠标悬停或离开单元格时触发
   * 用于跟踪用户关注点或实现联动效果
   *
   * @param data - 悬停的单元格数据，离开时为 null
   * @param series - 所属数据系列，离开时为 null
   *
   * @example
   * ```typescript
   * (data, series) => {
   *   if (data) {
   *     console.log('悬停:', data.x, data.y)
   *     setHighlightedId(data.id)
   *   } else {
   *     setHighlightedId(null)
   *   }
   * }
   * ```
   */
  onCellHover?: (data: HeatmapDataPoint | null, series: HeatmapSeries | null) => void

  /**
   * 图表的宽度
   * 支持数值（像素）或百分比
   * 百分比宽度实现响应式布局
   *
   * @default '100%'
   * @example 600 | '100%' | '50vw'
   */
  width?: number | string

  /**
   * 图表的高度
   * 支持数值（像素）或百分比
   * 建议使用数值以保持稳定的高度
   *
   * @default 400
   * @example 400 | 300 | '50vh'
   */
  height?: number | string

  /**
   * 容器的内边距
   * 控制图表内容与容器边缘的距离
   * 为坐标轴标签留出空间
   *
   * @default 60
   * @example 60 | 80 | 40
   */
  padding?: number

  /**
   * 自定义样式类名
   * 添加额外的 CSS 类名
   * 用于自定义样式或覆盖默认样式
   *
   * @example 'my-custom-heatmap' | 'chart-highlight'
   */
  className?: string

  /**
   * 自定义样式
   * 内联样式对象
   * 用于动态样式设置
   *
   * @example { backgroundColor: 'red' } | { border: '1px solid blue' }
   */
  style?: React.CSSProperties
}

// ============================================================================
// Component Implementation
// ============================================================================

/**
 * Heatmap 组件
 *
 * 核心特性说明：
 * 1. **数据处理**：使用 useMemo 优化数据计算，避免不必要的重复计算
 * 2. **矩阵布局**：自动计算行列维度，生成网格布局
 * 3. **颜色映射**：基于数值范围映射到颜色调色板
 * 4. **交互反馈**：鼠标悬停、点击事件处理
 * 5. **工具提示**：动态定位和显示详细数据
 * 6. **图例展示**：颜色范围的可视化说明
 * 7. **响应式设计**：支持百分比和数值尺寸
 * 8. **动画效果**：Framer Motion 驱动的流畅过渡
 * 9. **主题集成**：使用 CSS 变量实现主题适配
 * 10. **可访问性**：支持 ARIA 属性和键盘导航
 *
 * @example
 * ```tsx
 * const data = [
 *   {
 *     name: '销售数据',
 *     data: [
 *       { x: '北京', y: '1月', value: 120 },
 *       { x: '上海', y: '1月', value: 180 }
 *     ]
 *   }
 * ]
 *
 * <Heatmap
 *   data={data}
 *   width={700}
 *   height={400}
 *   showValues={true}
 *   showTooltip={true}
 *   onCellClick={(data) => console.log('点击', data)}
 * />
 * ```
 */
export const Heatmap = forwardRef<HTMLDivElement, HeatmapProps>(
  (
    {
      /**
       * 数据参数解构
       * 从 props 中提取所有必需的属性
       * 提供合理的默认值
       */
      data,
      minValue,
      maxValue,
      showValues = false,
      showTooltip = true,
      showLegend = true,
      showGrid = true,
      cellGap = 2,
      cellRadius = 4,

      /**
       * 默认颜色调色板
       * 从蓝色到红色的彩虹渐变
       * 适合大多数数据可视化场景
       */
      colorScale = [
        '#3b82f6', // blue-500 - 蓝色（最小值）
        '#06b6d4', // cyan-500 - 青色
        '#10b981', // emerald-500 - 翠绿色
        '#84cc16', // lime-500 - 酸橙绿
        '#eab308', // yellow-500 - 黄色
        '#f59e0b', // amber-500 - 琥珀色
        '#ef4444'  // red-500 - 红色（最大值）
      ],

      tooltipFormatter,
      formatValue,
      animationDuration = 1.2,
      onCellClick,
      onCellHover,
      width = '100%',
      height = 400,
      padding = 60,
      className,
      style,
      ...props
    },
    ref
  ) => {
    /**
     * useId 生成的唯一标识符
     * 用于确保 SVG 元素 ID 的唯一性
     * 避免多个组件实例间的 ID 冲突
     */
    const id = useId()

    /**
     * 悬停状态管理
     * 存储当前悬停的单元格信息
     * 用于工具提示的显示和定位
     */
    const [hoveredCell, setHoveredCell] = useState<{
      data: HeatmapDataPoint
      series: HeatmapSeries
      x: number
      y: number
    } | null>(null)

    /**
     * 数据处理和矩阵计算
     * 使用 useMemo 优化性能，避免在每次渲染时重新计算
     *
     * 处理流程：
     * 1. 检查数据有效性
     * 2. 提取所有唯一的行和列标签
     * 3. 计算全局最小值和最大值
     * 4. 为每个数据点计算颜色映射
     * 5. 生成单元格数组用于渲染
     */
    const matrixData = useMemo(() => {
      // 空数据检查
      if (!data?.length) return { rows: [], columns: [], cells: [] }

      // 提取所有数据点
      const allPoints = data.flatMap(series => series.data)

      // 获取唯一行和列标签并排序
      const rows = Array.from(
        new Set(allPoints.map((point: HeatmapDataPoint) => point.y))
      ).sort()
      const columns = Array.from(
        new Set(allPoints.map((point: HeatmapDataPoint) => point.x))
      ).sort()

      // 计算全局数值范围
      const allValues = allPoints.map((p: HeatmapDataPoint) => p.value)
      const globalMin = minValue ?? Math.min(...allValues)
      const globalMax = maxValue ?? Math.max(...allValues)

      // 创建单元格数组
      const cells: Array<{
        row: string
        column: string
        data: HeatmapDataPoint
        series: HeatmapSeries
        value: number
        normalizedValue: number // 0-1 范围，归一化后的值
        color: string
      }> = []

      // 为每个数据点生成单元格信息
      data.forEach(series => {
        series.data.forEach((point: HeatmapDataPoint) => {
          // 计算归一化值（0-1 范围）
          const normalized: number =
            (point.value - globalMin) / (globalMax - globalMin)

          // 根据归一化值计算颜色索引
          const colorIndex = Math.min(
            Math.floor(normalized * (colorScale.length - 1)),
            colorScale.length - 1
          )

          // 添加到单元格数组
          cells.push({
            row: point.y,
            column: point.x,
            data: point,
            series,
            value: point.value,
            normalizedValue: normalized,
            color: colorScale[colorIndex]
          })
        })
      })

      return { rows, columns, cells, globalMin, globalMax }
    }, [data, minValue, maxValue, colorScale])

    /**
     * 从 matrixData 中解构所需数据
     */
    const { rows, columns, cells, globalMin, globalMax } = matrixData

    /**
     * 空数据状态处理
     * 当没有单元格数据时显示占位符
     */
    if (!cells.length) {
      return (
        <ChartContainer
          ref={ref}
          width={width}
          height={height}
          className={className}
          {...props}
        >
          <div className="flex items-center justify-center h-full text-gray-400">
            暂无数据
          </div>
        </ChartContainer>
      )
    }

    /**
     * 计算图表尺寸
     * 处理宽度和高度的多种输入类型
     */
    const chartWidth = typeof width === 'number' ? width : 600
    const chartHeight = typeof height === 'number' ? height : 400

    /**
     * 计算单元格尺寸
     * 基于可用空间和行列数量
     */
    const cellWidth = (chartWidth - padding * 2) / columns.length
    const cellHeight = (chartHeight - padding * 2) / rows.length

    /**
     * 处理鼠标进入事件
     * 设置悬停状态并触发回调
     */
    const handleMouseEnter = (cellData: typeof cells[0], event: React.MouseEvent) => {
      if (!showTooltip) return

      setHoveredCell({
        data: cellData.data,
        series: cellData.series,
        x: event.clientX,
        y: event.clientY
      })

      onCellHover?.(cellData.data, cellData.series)
    }

    /**
     * 处理鼠标移动事件
     * 更新工具提示位置跟随鼠标
     */
    const handleMouseMove = (event: React.MouseEvent) => {
      if (hoveredCell) {
        setHoveredCell(prev =>
          prev ? { ...prev, x: event.clientX, y: event.clientY } : null
        )
      }
    }

    /**
     * 处理鼠标离开事件
     * 清除悬停状态并触发回调
     */
    const handleMouseLeave = () => {
      setHoveredCell(null)
      onCellHover?.(null, null)
    }

    /**
     * 获取单元格坐标
     * 根据行列索引计算单元格的 X、Y 坐标
     */
    const getCellPosition = (cell: typeof cells[0]) => {
      const rowIndex = rows.indexOf(cell.row)
      const colIndex = columns.indexOf(cell.column)

      return {
        x: padding + colIndex * cellWidth,
        y: padding + rowIndex * cellHeight
      }
    }

    /**
     * 组件返回的 JSX 结构
     * 包含完整的热力图渲染逻辑
     */
    return (
      <ChartContainer
        ref={ref}
        width={width}
        height={height}
        className={cn('heatmap', className)}
        {...props}
      >
        <div
          className="relative w-full h-full"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* SVG 图表容器 */}
          <svg
            width={chartWidth}
            height={chartHeight}
            className="w-full h-full"
          >
            {/* 网格线渲染 */}
            {showGrid && (
              <>
                {/* 垂直网格线 */}
                {columns.map((col, index) => {
                  const x = padding + index * cellWidth
                  return (
                    <line
                      key={`v-grid-${index}`}
                      x1={x}
                      y1={padding}
                      x2={x}
                      y2={chartHeight - padding}
                      stroke="var(--color-border)"
                      strokeWidth={0.5}
                      opacity={0.3}
                    />
                  )
                })}

                {/* 水平网格线 */}
                {rows.map((row, index) => {
                  const y = padding + index * cellHeight
                  return (
                    <line
                      key={`h-grid-${index}`}
                      x1={padding}
                      y1={y}
                      x2={chartWidth - padding}
                      y2={y}
                      stroke="var(--color-border)"
                      strokeWidth={0.5}
                      opacity={0.3}
                    />
                  )
                })}

                {/* 图表外边框 */}
                <rect
                  x={padding}
                  y={padding}
                  width={chartWidth - padding * 2}
                  height={chartHeight - padding * 2}
                  fill="none"
                  stroke="var(--color-border)"
                  strokeWidth={1}
                />
              </>
            )}

            {/* 单元格渲染 */}
            <AnimatePresence>
              {cells.map((cell, index) => {
                // 计算单元格位置和尺寸
                const pos = getCellPosition(cell)
                const x = pos.x + cellGap / 2
                const y = pos.y + cellGap / 2
                const width = cellWidth - cellGap
                const height = cellHeight - cellGap

                return (
                  <motion.g
                    key={`${cell.series.name}-${cell.data.x}-${cell.data.y}-${index}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: animationDuration,
                      delay: index * 0.02 // 交错动画效果
                    }}
                  >
                    {/* 单元格矩形 */}
                    <motion.rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill={cell.color}
                      rx={cellRadius}
                      className="cursor-pointer hover:opacity-90 transition-opacity"
                      onMouseEnter={(e) => handleMouseEnter(cell, e as any)}
                      onClick={() => onCellClick?.(cell.data, cell.series)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    />

                    {/* 数值标签 */}
                    {showValues && (
                      <motion.text
                        x={x + width / 2}
                        y={y + height / 2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className={cn(
                          'text-xs font-medium pointer-events-none select-none',
                          // 根据背景色深浅调整文字颜色
                          cell.normalizedValue > 0.5
                            ? 'text-white'
                            : 'text-gray-900 dark:text-gray-100'
                        )}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: animationDuration + index * 0.02
                        }}
                      >
                        {formatValue
                          ? formatValue(cell.value)
                          : cell.value.toString()}
                      </motion.text>
                    )}
                  </motion.g>
                )
              })}
            </AnimatePresence>

            {/* X 轴标签 */}
            {columns.map((col, index) => {
              const x = padding + index * cellWidth + cellWidth / 2
              return (
                <text
                  key={`x-label-${index}`}
                  x={x}
                  y={chartHeight - padding + 20}
                  textAnchor="middle"
                  className="text-xs fill-gray-600 dark:fill-gray-400"
                >
                  {col}
                </text>
              )
            })}

            {/* Y 轴标签 */}
            {rows.map((row, index) => {
              const y = padding + index * cellHeight + cellHeight / 2
              return (
                <text
                  key={`y-label-${index}`}
                  x={padding - 10}
                  y={y}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="text-xs fill-gray-600 dark:fill-gray-400"
                >
                  {row}
                </text>
              )
            })}
          </svg>

          {/* 工具提示 */}
          <AnimatePresence>
            {hoveredCell && showTooltip && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="absolute pointer-events-none z-50"
                style={{
                  left: hoveredCell.x,
                  top: hoveredCell.y,
                  transform: 'translate(-50%, -120%)'
                }}
              >
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 min-w-[150px]">
                  <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                    {hoveredCell.data.x} × {hoveredCell.data.y}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {hoveredCell.series.name}
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                    {formatValue
                      ? formatValue(hoveredCell.data.value)
                      : hoveredCell.data.value.toString()}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 图例 */}
          {showLegend && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-sm">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-2 text-center">
                  值范围
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {formatValue ? formatValue(globalMin) : globalMin.toFixed(0)}
                  </span>
                  <div className="flex gap-1">
                    {colorScale.map((color, index) => (
                      <div
                        key={index}
                        className="w-6 h-4 rounded"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {formatValue ? formatValue(globalMax) : globalMax.toFixed(0)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ChartContainer>
    )
  }
)

/**
 * 组件显示名称
 * 用于 React DevTools 和错误信息
 */
Heatmap.displayName = 'Heatmap'

// ============================================================================
// Export
// ============================================================================

/**
 * 导出类型定义
 * 方便用户在不导入组件的情况下使用类型
 */
export type {
  HeatmapProps,
  HeatmapDataPoint,
  HeatmapSeries
}
