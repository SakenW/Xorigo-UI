/**
 * 组件性能指标组件
 */

'use client'

import React, { useMemo } from 'react'
import type { ComponentPerformance } from '../../lib/performance/types'

interface ComponentMetricsProps {
  metrics: ComponentPerformance[]
}

export function ComponentMetrics({ metrics }: ComponentMetricsProps) {
  // 按平均渲染时间排序
  const sortedMetrics = useMemo(() => {
    return [...metrics].sort((a, b) => b.averageRenderTime - a.averageRenderTime)
  }, [metrics])

  // 找出最慢的组件
  const slowestComponent = sortedMetrics[0]

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        组件性能统计
      </h3>

      {metrics.length === 0 ? (
        <div className="py-8 text-center text-gray-400">暂无组件性能数据</div>
      ) : (
        <div className="space-y-4">
          {/* 概览 */}
          <div className="grid grid-cols-3 gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-900/50">
            <div>
              <div className="text-xs text-gray-500">组件总数</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {metrics.length}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">总渲染次数</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {metrics.reduce((sum, m) => sum + m.renderCount, 0)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">最慢组件</div>
              <div className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                {slowestComponent?.name || '--'}
              </div>
              {slowestComponent && (
                <div className="text-xs text-gray-500">
                  {slowestComponent.averageRenderTime.toFixed(2)}ms
                </div>
              )}
            </div>
          </div>

          {/* 组件列表 */}
          <div className="space-y-2">
            {sortedMetrics.map((metric) => (
              <div
                key={metric.name}
                className="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:border-gray-200 dark:border-gray-800 dark:hover:border-gray-700"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {metric.name}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    渲染 {metric.renderCount} 次
                  </div>
                </div>

                <div className="flex gap-4 text-right">
                  <div>
                    <div className="text-xs text-gray-500">平均</div>
                    <div
                      className={`text-sm font-medium ${
                        metric.averageRenderTime < 16
                          ? 'text-green-600 dark:text-green-400'
                          : metric.averageRenderTime < 50
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {metric.averageRenderTime.toFixed(2)}ms
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500">最大</div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {metric.maxRenderTime.toFixed(2)}ms
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500">最近</div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {metric.lastRenderTime.toFixed(2)}ms
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 性能建议 */}
          {slowestComponent && slowestComponent.averageRenderTime > 50 && (
            <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-950/30">
              <div className="flex items-start gap-2">
                <span className="text-yellow-600 dark:text-yellow-400">⚠️</span>
                <div className="flex-1 text-sm">
                  <div className="font-medium text-yellow-900 dark:text-yellow-200">
                    性能警告
                  </div>
                  <div className="mt-1 text-yellow-700 dark:text-yellow-300">
                    组件 <code className="rounded bg-yellow-100 px-1 dark:bg-yellow-900">{slowestComponent.name}</code>{' '}
                    平均渲染时间超过 50ms，建议优化。
                  </div>
                  <div className="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
                    优化建议：使用 React.memo()、useMemo()、useCallback() 等优化手段
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
