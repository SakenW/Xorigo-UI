/**
 * 性能指标卡片组件
 */

'use client'

import React from 'react'
import type { PerformanceScore } from '../../lib/performance/types'

interface MetricCardProps {
  name: string
  value: number | undefined
  unit: string
  score: PerformanceScore
  description: string
}

const scoreColors: Record<PerformanceScore, { bg: string; text: string; border: string }> = {
  good: {
    bg: 'bg-green-50 dark:bg-green-950/30',
    text: 'text-green-700 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800'
  },
  'needs-improvement': {
    bg: 'bg-yellow-50 dark:bg-yellow-950/30',
    text: 'text-yellow-700 dark:text-yellow-400',
    border: 'border-yellow-200 dark:border-yellow-800'
  },
  poor: {
    bg: 'bg-red-50 dark:bg-red-950/30',
    text: 'text-red-700 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800'
  },
  unknown: {
    bg: 'bg-gray-50 dark:bg-gray-900/30',
    text: 'text-gray-700 dark:text-gray-400',
    border: 'border-gray-200 dark:border-gray-800'
  }
}

const scoreLabels: Record<PerformanceScore, string> = {
  good: '优秀',
  'needs-improvement': '需改进',
  poor: '较差',
  unknown: '未知'
}

export function MetricCard({ name, value, unit, score, description }: MetricCardProps) {
  const colors = scoreColors[score]
  const label = scoreLabels[score]

  const formattedValue = value !== undefined
    ? value < 1 ? value.toFixed(3) : value.toFixed(0)
    : '--'

  return (
    <div
      className={`
        relative overflow-hidden rounded-lg border p-6
        ${colors.bg} ${colors.border}
        transition-all duration-300 hover:shadow-lg
      `}
    >
      {/* 状态指示条 */}
      <div
        className={`absolute left-0 top-0 h-1 w-full ${
          score === 'good'
            ? 'bg-green-500'
            : score === 'needs-improvement'
            ? 'bg-yellow-500'
            : score === 'poor'
            ? 'bg-red-500'
            : 'bg-gray-400'
        }`}
      />

      {/* 指标名称 */}
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{name}</h3>
        <span
          className={`
            rounded-full px-2 py-0.5 text-xs font-medium
            ${colors.text}
          `}
        >
          {label}
        </span>
      </div>

      {/* 指标值 */}
      <div className={`mb-1 text-3xl font-bold ${colors.text}`}>
        {formattedValue}
        <span className="ml-1 text-lg font-normal">{unit}</span>
      </div>

      {/* 描述 */}
      <p className="text-xs text-gray-500 dark:text-gray-500">{description}</p>
    </div>
  )
}
