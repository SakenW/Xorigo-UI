/**
 * 性能趋势图组件
 */

'use client'

import React, { useMemo } from 'react'

interface DataPoint {
  timestamp: number
  value: number
}

interface PerformanceChartProps {
  data: DataPoint[]
  metric: string
  thresholds: { good: number; needsImprovement: number }
  height?: number
}

export function PerformanceChart({
  data,
  metric,
  thresholds,
  height = 200
}: PerformanceChartProps) {
  const { points, maxValue, minValue } = useMemo(() => {
    if (data.length === 0) {
      return { points: [], maxValue: 0, minValue: 0 }
    }

    const values = data.map((d) => d.value)
    const max = Math.max(...values)
    const min = Math.min(...values)

    // 生成SVG路径点
    const chartWidth = 100
    const chartHeight = 100
    const stepX = chartWidth / (data.length - 1 || 1)

    const normalizedPoints = data.map((d, i) => {
      const x = i * stepX
      const normalizedValue = ((d.value - min) / (max - min || 1)) * chartHeight
      const y = chartHeight - normalizedValue

      return { x, y, value: d.value }
    })

    return {
      points: normalizedPoints,
      maxValue: max,
      minValue: min
    }
  }, [data])

  const pathD = useMemo(() => {
    if (points.length === 0) return ''

    let path = `M ${points[0].x} ${points[0].y}`
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`
    }

    return path
  }, [points])

  // 计算阈值线位置
  const goodThresholdY =
    100 - ((thresholds.good - minValue) / (maxValue - minValue || 1)) * 100
  const needsImprovementThresholdY =
    100 - ((thresholds.needsImprovement - minValue) / (maxValue - minValue || 1)) * 100

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
      <h3 className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">
        {metric} 趋势
      </h3>

      <div className="relative" style={{ height: `${height}px` }}>
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-400">
            暂无数据
          </div>
        ) : (
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="h-full w-full"
          >
            {/* 阈值线 */}
            <line
              x1="0"
              y1={goodThresholdY}
              x2="100"
              y2={goodThresholdY}
              stroke="#22c55e"
              strokeWidth="0.5"
              strokeDasharray="2,2"
              opacity="0.5"
            />
            <line
              x1="0"
              y1={needsImprovementThresholdY}
              x2="100"
              y2={needsImprovementThresholdY}
              stroke="#eab308"
              strokeWidth="0.5"
              strokeDasharray="2,2"
              opacity="0.5"
            />

            {/* 数据线 */}
            <path
              d={pathD}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />

            {/* 数据点 */}
            {points.map((point, i) => (
              <circle
                key={i}
                cx={point.x}
                cy={point.y}
                r="1.5"
                fill="#3b82f6"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>
        )}
      </div>

      {/* 图例 */}
      <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span>优秀 (&lt; {thresholds.good})</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-yellow-500" />
          <span>需改进 (&lt; {thresholds.needsImprovement})</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-red-500" />
          <span>较差</span>
        </div>
      </div>
    </div>
  )
}
