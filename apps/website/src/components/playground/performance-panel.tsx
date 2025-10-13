/**
 * @fileoverview Performance Panel - 性能监控面板
 * 显示渲染时间、更新次数等性能指标
 */

'use client'

import { useMemo, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'
import { usePerformanceMetrics } from '@/stores/playground.store'

// ===== 类型定义 =====

interface PerformanceHistory {
  timestamp: number
  renderTime: number
  updateCount: number
}

// ===== 主组件 =====

export function PerformancePanel() {
  const metrics = usePerformanceMetrics()
  const [history, setHistory] = useState<PerformanceHistory[]>([])

  // 记录性能历史
  useEffect(() => {
    if (metrics.lastUpdate) {
      setHistory((prev) => {
        const newHistory = [
          ...prev,
          {
            timestamp: metrics.lastUpdate,
            renderTime: metrics.renderTime,
            updateCount: metrics.updateCount,
          },
        ]

        // 只保留最近 100 条记录
        return newHistory.slice(-100)
      })
    }
  }, [metrics.lastUpdate])

  // 计算性能统计
  const stats = useMemo(() => {
    if (history.length === 0) {
      return {
        avgRenderTime: 0,
        maxRenderTime: 0,
        minRenderTime: 0,
        totalUpdates: 0,
        updatesPerMinute: 0,
      }
    }

    const renderTimes = history.map((h) => h.renderTime)
    const avgRenderTime =
      renderTimes.reduce((sum, t) => sum + t, 0) / renderTimes.length
    const maxRenderTime = Math.max(...renderTimes)
    const minRenderTime = Math.min(...renderTimes)

    // 计算每分钟更新次数
    const now = Date.now()
    const oneMinuteAgo = now - 60000
    const recentUpdates = history.filter((h) => h.timestamp >= oneMinuteAgo)
    const updatesPerMinute = recentUpdates.length

    return {
      avgRenderTime: avgRenderTime.toFixed(2),
      maxRenderTime: maxRenderTime.toFixed(2),
      minRenderTime: minRenderTime.toFixed(2),
      totalUpdates: metrics.updateCount,
      updatesPerMinute,
    }
  }, [history, metrics.updateCount])

  // 性能评级
  const performanceRating = useMemo(() => {
    const avg = parseFloat(stats.avgRenderTime)

    if (avg <= 16) return { level: 'excellent', label: '优秀', color: 'green' }
    if (avg <= 50) return { level: 'good', label: '良好', color: 'blue' }
    if (avg <= 100) return { level: 'fair', label: '一般', color: 'yellow' }
    return { level: 'poor', label: '较差', color: 'red' }
  }, [stats.avgRenderTime])

  return (
    <div className="h-full flex flex-col bg-background">
      {/* 头部 */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">性能监控</h3>
          <Badge
            variant={
              performanceRating.level === 'excellent' ||
              performanceRating.level === 'good'
                ? 'default'
                : 'secondary'
            }
            className="text-xs"
          >
            {performanceRating.label}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          实时监控组件渲染性能
        </p>
      </div>

      {/* 性能指标 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 当前指标 */}
        <Card>
          <CardHeader>
            <h4 className="text-sm font-semibold">当前指标</h4>
          </CardHeader>
          <CardContent className="space-y-3">
            <MetricItem
              label="最后渲染时间"
              value={`${metrics.renderTime.toFixed(2)} ms`}
              threshold={100}
              current={metrics.renderTime}
              icon={<ClockIcon className="w-4 h-4" />}
            />

            <MetricItem
              label="总更新次数"
              value={metrics.updateCount.toString()}
              icon={<ActivityIcon className="w-4 h-4" />}
            />

            <MetricItem
              label="最后更新时间"
              value={formatTimestamp(metrics.lastUpdate)}
              icon={<CalendarIcon className="w-4 h-4" />}
            />
          </CardContent>
        </Card>

        {/* 统计数据 */}
        <Card>
          <CardHeader>
            <h4 className="text-sm font-semibold">统计分析</h4>
          </CardHeader>
          <CardContent className="space-y-3">
            <MetricItem
              label="平均渲染时间"
              value={`${stats.avgRenderTime} ms`}
              threshold={100}
              current={parseFloat(stats.avgRenderTime)}
              icon={<TrendingUpIcon className="w-4 h-4" />}
            />

            <MetricItem
              label="最大渲染时间"
              value={`${stats.maxRenderTime} ms`}
              threshold={100}
              current={parseFloat(stats.maxRenderTime)}
              icon={<ArrowUpIcon className="w-4 h-4" />}
            />

            <MetricItem
              label="最小渲染时间"
              value={`${stats.minRenderTime} ms`}
              icon={<ArrowDownIcon className="w-4 h-4" />}
            />

            <MetricItem
              label="每分钟更新数"
              value={stats.updatesPerMinute.toString()}
              icon={<ZapIcon className="w-4 h-4" />}
            />
          </CardContent>
        </Card>

        {/* 性能建议 */}
        <Card>
          <CardHeader>
            <h4 className="text-sm font-semibold">性能建议</h4>
          </CardHeader>
          <CardContent className="space-y-2">
            {parseFloat(stats.avgRenderTime) > 100 && (
              <PerformanceTip
                type="warning"
                message="平均渲染时间超过 100ms，建议优化组件性能"
              />
            )}

            {parseFloat(stats.avgRenderTime) <= 16 && (
              <PerformanceTip
                type="success"
                message="渲染性能优秀，达到 60fps 标准"
              />
            )}

            {stats.updatesPerMinute > 60 && (
              <PerformanceTip
                type="info"
                message="更新频率较高，注意避免不必要的重渲染"
              />
            )}

            {history.length === 0 && (
              <PerformanceTip
                type="info"
                message="开始编辑属性后将显示性能数据"
              />
            )}
          </CardContent>
        </Card>

        {/* 性能目标 */}
        <Card>
          <CardHeader>
            <h4 className="text-sm font-semibold">性能目标</h4>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">属性更新:</span>
              <span className="font-medium">≤ 100ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">60 FPS:</span>
              <span className="font-medium">≤ 16.67ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">流畅体验:</span>
              <span className="font-medium">≤ 50ms</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ===== 指标项组件 =====

interface MetricItemProps {
  label: string
  value: string
  threshold?: number
  current?: number
  icon?: React.ReactNode
}

function MetricItem({ label, value, threshold, current, icon }: MetricItemProps) {
  const isOverThreshold = threshold && current ? current > threshold : false

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <span className="text-sm text-muted-foreground">{label}:</span>
      </div>
      <span
        className={`text-sm font-medium ${
          isOverThreshold ? 'text-destructive' : ''
        }`}
      >
        {value}
      </span>
    </div>
  )
}

// ===== 性能提示组件 =====

interface PerformanceTipProps {
  type: 'info' | 'success' | 'warning' | 'error'
  message: string
}

function PerformanceTip({ type, message }: PerformanceTipProps) {
  const config = {
    info: {
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      borderColor: 'border-blue-200 dark:border-blue-800',
      textColor: 'text-blue-700 dark:text-blue-300',
      icon: <InfoIcon className="w-4 h-4" />,
    },
    success: {
      bgColor: 'bg-green-50 dark:bg-green-950',
      borderColor: 'border-green-200 dark:border-green-800',
      textColor: 'text-green-700 dark:text-green-300',
      icon: <CheckCircleIcon className="w-4 h-4" />,
    },
    warning: {
      bgColor: 'bg-amber-50 dark:bg-amber-950',
      borderColor: 'border-amber-200 dark:border-amber-800',
      textColor: 'text-amber-700 dark:text-amber-300',
      icon: <AlertTriangleIcon className="w-4 h-4" />,
    },
    error: {
      bgColor: 'bg-red-50 dark:bg-red-950',
      borderColor: 'border-red-200 dark:border-red-800',
      textColor: 'text-red-700 dark:text-red-300',
      icon: <XCircleIcon className="w-4 h-4" />,
    },
  }

  const { bgColor, borderColor, textColor, icon } = config[type]

  return (
    <div
      className={`flex items-start space-x-2 p-3 rounded-md border ${bgColor} ${borderColor}`}
    >
      <span className={textColor}>{icon}</span>
      <p className={`text-xs ${textColor}`}>{message}</p>
    </div>
  )
}

// ===== 工具函数 =====

function formatTimestamp(timestamp: number): string {
  if (!timestamp) return '-'

  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

// ===== 图标组件 =====

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function ActivityIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  )
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function TrendingUpIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  )
}

function ArrowUpIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  )
}

function ArrowDownIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </svg>
  )
}

function ZapIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function AlertTriangleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function XCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  )
}
