/**
 * @fileoverview Compare Mode - 快照对比模式
 * 支持双栏对比、差异高亮和配置对比
 */

'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'
import { useCompareMode, useSnapshots, type Snapshot } from '@/stores/playground.store'

// ===== 主组件 =====

export function CompareMode() {
  const { compareMode, snapshotA, snapshotB, setCompareMode, setCompareSnapshots } =
    useCompareMode() as {
      compareMode: boolean
      snapshotA: Snapshot | null
      snapshotB: Snapshot | null
      setCompareMode: (enabled: boolean) => void
      setCompareSnapshots: (a: Snapshot | null, b: Snapshot | null) => void
    }
  const { snapshots } = useSnapshots() as { snapshots: Snapshot[] }

  const snapshotAData = useMemo(
    () => snapshotA ? snapshots.find((s) => s.id === snapshotA.id) : null,
    [snapshots, snapshotA]
  )

  const snapshotBData = useMemo(
    () => snapshotB ? snapshots.find((s) => s.id === snapshotB.id) : null,
    [snapshots, snapshotB]
  )

  // 计算差异
  const differences = useMemo(() => {
    if (!snapshotAData || !snapshotBData) return null

    return calculateDifferences(snapshotAData, snapshotBData)
  }, [snapshotAData, snapshotBData])

  const handleExit = () => {
    setCompareMode(false)
  }

  if (!compareMode) {
    return null
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* 头部 */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-lg">快照对比</h3>
            {differences && (
              <Badge variant="default" className="text-xs">
                {differences.propChanges.length} 项差异
              </Badge>
            )}
          </div>

          <Button variant="ghost" size="sm" onClick={handleExit}>
            <CloseIcon className="w-4 h-4 mr-1" />
            退出对比
          </Button>
        </div>

        {/* 快照选择器 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">快照 A</label>
            <select
              value={snapshotA?.id || ''}
              onChange={(e) => {
                const selectedSnapshot = snapshots.find(s => s.id === e.target.value) || null
                setCompareSnapshots(selectedSnapshot, snapshotB)
              }}
              className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background"
            >
              <option value="">选择快照</option>
              {snapshots.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">快照 B</label>
            <select
              value={snapshotB?.id || ''}
              onChange={(e) => {
                const selectedSnapshot = snapshots.find(s => s.id === e.target.value) || null
                setCompareSnapshots(snapshotA, selectedSnapshot)
              }}
              className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background"
            >
              <option value="">选择快照</option>
              {snapshots.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 对比视图 */}
      {snapshotAData && snapshotBData ? (
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-2 gap-4 p-4">
            {/* 左侧: 快照 A */}
            <div className="space-y-4">
              <SnapshotPanel snapshot={snapshotAData} label="快照 A" />
            </div>

            {/* 右侧: 快照 B */}
            <div className="space-y-4">
              <SnapshotPanel snapshot={snapshotBData} label="快照 B" />
            </div>
          </div>

          {/* 差异分析 */}
          {differences && (
            <div className="p-4 border-t border-border">
              <DifferencePanel differences={differences} />
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          请选择两个快照进行对比
        </div>
      )}
    </div>
  )
}

// ===== 快照面板组件 =====

interface SnapshotPanelProps {
  snapshot: Snapshot
  label: string
}

function SnapshotPanel({ snapshot, label }: SnapshotPanelProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h4 className="font-medium">{label}</h4>
          <Badge variant="outline" className="text-xs">
            {snapshot.componentState.name}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h5 className="font-semibold mb-2">{snapshot.name}</h5>
          {snapshot.description && (
            <p className="text-sm text-muted-foreground">{snapshot.description}</p>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          {formatDate(snapshot.timestamp)}
        </div>

        {/* 主题信息 */}
        <div>
          <h6 className="text-sm font-medium mb-2">主题配置</h6>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">模式:</span>
              <span className="font-medium">{snapshot.themeState.mode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">密度:</span>
              <span className="font-medium">{snapshot.themeState.density}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">色调:</span>
              <span className="font-medium">{snapshot.themeState.hue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">表面:</span>
              <span className="font-medium">{snapshot.themeState.surface}</span>
            </div>
          </div>
        </div>

        {/* 组件属性 */}
        <div>
          <h6 className="text-sm font-medium mb-2">组件属性</h6>
          <div className="space-y-1 text-sm max-h-40 overflow-y-auto">
            {Object.entries(snapshot.componentState.props).length === 0 ? (
              <p className="text-muted-foreground">无自定义属性</p>
            ) : (
              Object.entries(snapshot.componentState.props).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-muted-foreground">{key}:</span>
                  <span className="font-mono text-xs">{JSON.stringify(value)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ===== 差异面板组件 =====

interface Difference {
  propChanges: PropChange[]
  themeChanges: ThemeChange[]
}

interface PropChange {
  key: string
  valueA: any
  valueB: any
  type: 'added' | 'removed' | 'modified'
}

interface ThemeChange {
  key: keyof ThemeState
  valueA: any
  valueB: any
}

interface DifferencePanelProps {
  differences: Difference
}

function DifferencePanel({ differences }: DifferencePanelProps) {
  return (
    <Card>
      <CardHeader>
        <h4 className="font-medium">差异分析</h4>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 属性差异 */}
        {differences.propChanges.length > 0 && (
          <div>
            <h5 className="text-sm font-semibold mb-2">属性变更</h5>
            <div className="space-y-2">
              {differences.propChanges.map((change, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-md text-sm ${
                    change.type === 'added'
                      ? 'bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800'
                      : change.type === 'removed'
                      ? 'bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800'
                      : 'bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{change.key}</span>
                    <Badge
                      variant={
                        change.type === 'added'
                          ? 'success'
                          : change.type === 'removed'
                          ? 'danger'
                          : 'outline'
                      }
                      className="text-xs"
                    >
                      {change.type === 'added'
                        ? '新增'
                        : change.type === 'removed'
                        ? '移除'
                        : '修改'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div>
                      <span className="text-muted-foreground">A:</span>{' '}
                      {JSON.stringify(change.valueA)}
                    </div>
                    <div>
                      <span className="text-muted-foreground">B:</span>{' '}
                      {JSON.stringify(change.valueB)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 主题差异 */}
        {differences.themeChanges.length > 0 && (
          <div>
            <h5 className="text-sm font-semibold mb-2">主题变更</h5>
            <div className="space-y-2">
              {differences.themeChanges.map((change, index) => (
                <div
                  key={index}
                  className="p-3 rounded-md text-sm bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800"
                >
                  <div className="font-medium mb-1">{change.key}</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">A:</span> {change.valueA}
                    </div>
                    <div>
                      <span className="text-muted-foreground">B:</span> {change.valueB}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 无差异提示 */}
        {differences.propChanges.length === 0 &&
          differences.themeChanges.length === 0 && (
            <div className="text-center text-muted-foreground py-4">
              两个快照完全相同
            </div>
          )}
      </CardContent>
    </Card>
  )
}

// ===== 工具函数 =====

function calculateDifferences(
  snapshotA: Snapshot,
  snapshotB: Snapshot
): Difference {
  const propChanges: PropChange[] = []
  const themeChanges: ThemeChange[] = []

  // 计算属性差异
  const propsA = snapshotA.componentState.props
  const propsB = snapshotB.componentState.props
  const allKeys = new Set([...Object.keys(propsA), ...Object.keys(propsB)])

  allKeys.forEach((key) => {
    const valueA = propsA[key]
    const valueB = propsB[key]

    if (valueA === undefined && valueB !== undefined) {
      propChanges.push({ key, valueA, valueB, type: 'added' })
    } else if (valueA !== undefined && valueB === undefined) {
      propChanges.push({ key, valueA, valueB, type: 'removed' })
    } else if (JSON.stringify(valueA) !== JSON.stringify(valueB)) {
      propChanges.push({ key, valueA, valueB, type: 'modified' })
    }
  })

  // 计算主题差异
  const themeA = snapshotA.themeState
  const themeB = snapshotB.themeState
  const themeKeys: (keyof ThemeState)[] = ['mode', 'density', 'hue', 'surface', 'rtl']

  themeKeys.forEach((key) => {
    if (themeA[key] !== themeB[key]) {
      themeChanges.push({
        key,
        valueA: themeA[key],
        valueB: themeB[key],
      })
    }
  })

  return { propChanges, themeChanges }
}

// ===== 图标组件 =====

function CloseIcon({ className }: { className?: string }) {
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
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

import { ThemeState } from '@/stores/playground.store'
