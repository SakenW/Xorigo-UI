'use client'

import React from 'react'
import { Badge } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'
import type { ModeSwitcherProps, ViewMode } from '../workbench-types'

/**
 * 模式切换按钮配置
 */
const MODE_CONFIG = {
  gallery: {
    label: '画廊模式',
    icon: '🎨',
    description: '浏览组件库和配方',
  },
  editor: {
    label: '编辑器模式',
    icon: '✏️',
    description: '实时编辑和预览',
  },
  split: {
    label: '分屏模式',
    icon: '📱',
    description: '画廊 + 编辑器并排',
  },
} as const

/**
 * Workbench 模式切换器
 * 完全使用 @xorigo-ui/core 组件，遵循组件源规则
 */
export function ModeSwitcher({
  currentMode,
  availableModes,
  onModeChange,
  className = '',
  'data-testid': testId,
}: ModeSwitcherProps) {
  const handleModeChange = (mode: ViewMode) => {
    onModeChange(mode)
  }

  return (
    <div className={`flex items-center space-x-2 p-1 bg-muted rounded-lg ${className}`} data-testid={testId}>
      {availableModes.map((mode) => {
        const isActive = currentMode === mode
        const config = MODE_CONFIG[mode]

        return (
          <Button
            key={mode}
            variant={isActive ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleModeChange(mode)}
            className={`
              flex items-center space-x-2 transition-all duration-200
              ${isActive
                ? 'bg-primary-500 text-white shadow-md'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }
            `}
            data-testid={`mode-switcher-${mode}`}
            data-active={isActive}
            title={config.description}
          >
            <span className="text-base">{config.icon}</span>
            <span className="text-sm font-medium">{config.label}</span>
            {isActive && (
              <Badge variant="secondary" className="ml-1 text-xs">
                当前
              </Badge>
            )}
          </Button>
        )
      })}
    </div>
  )
}

/**
 * 紧凑模式切换器
 * 适用于较小的空间
 */
export function CompactModeSwitcher({
  currentMode,
  availableModes,
  onModeChange,
  className = '',
  'data-testid': testId,
}: ModeSwitcherProps) {
  return (
    <div className={`flex items-center space-x-1 p-1 bg-muted rounded-md ${className}`} data-testid={testId}>
      {availableModes.map((mode) => {
        const isActive = currentMode === mode
        const config = MODE_CONFIG[mode]

        return (
          <Button
            key={mode}
            variant={isActive ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onModeChange(mode)}
            className={`
              w-10 h-10 flex items-center justify-center transition-all duration-200
              ${isActive
                ? 'bg-primary-500 text-white shadow-md'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }
            `}
            data-testid={`compact-mode-switcher-${mode}`}
            data-active={isActive}
            title={config.description}
          >
            <span className="text-base">{config.icon}</span>
          </Button>
        )
      })}
    </div>
  )
}

/**
 * 模式信息显示
 */
export function ModeInfo({
  currentMode,
  className = '',
}: {
  currentMode: ViewMode
  className?: string
}) {
  const config = MODE_CONFIG[currentMode]

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-lg">{config.icon}</span>
      <div className="flex flex-col">
        <span className="text-sm font-medium">{config.label}</span>
        <span className="text-xs text-muted-foreground">{config.description}</span>
      </div>
    </div>
  )
}