/**
 * Workbench Theme Editor - Workbench编辑器模式的主题编辑器
 * 支持亮暗模式、密度、色调等主题参数调整
 * 遵循组件源规则：所有UI组件来自@xorigo-ui/core
 */

'use client'

import { Card, CardContent, CardHeader } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'

// ===== 类型定义 =====

export interface ThemeState {
  mode: 'light' | 'dark'
  density: 'comfortable' | 'compact' | 'spacious'
  hue: string
  surface: 'flat' | 'elevated'
  rtl: boolean
}

export interface WorkbenchThemeEditorProps {
  themeState: ThemeState
  onThemeChange: (theme: Partial<ThemeState>) => void
  onReset?: () => void
}

// ===== 主组件 =====

export function WorkbenchThemeEditor({
  themeState,
  onThemeChange,
  onReset,
}: WorkbenchThemeEditorProps) {
  const hueOptions = [
    'blue',
    'indigo',
    'violet',
    'purple',
    'pink',
    'red',
    'orange',
    'yellow',
    'green',
    'teal',
  ]

  const handleThemeChange = (updates: Partial<ThemeState>) => {
    onThemeChange(updates)
  }

  const handleReset = () => {
    const defaultTheme: ThemeState = {
      mode: 'light',
      density: 'comfortable',
      hue: 'blue',
      surface: 'flat',
      rtl: false,
    }
    onThemeChange(defaultTheme)
    onReset?.()
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* 头部 */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">主题编辑器</h3>
          <Badge variant="default" className="text-xs capitalize">
            {themeState.mode}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          调整主题参数查看实时效果
        </p>
      </div>

      {/* 主题设置 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* 亮暗模式 */}
        <Card>
          <CardHeader>
            <h4 className="text-sm font-semibold">亮暗模式</h4>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleThemeChange({ mode: 'light' })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  themeState.mode === 'light'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                    : 'border-border hover:border-primary-300'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <SunIcon className="w-8 h-8" />
                  <span className="text-sm font-medium">浅色</span>
                </div>
              </button>

              <button
                onClick={() => handleThemeChange({ mode: 'dark' })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  themeState.mode === 'dark'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                    : 'border-border hover:border-primary-300'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <MoonIcon className="w-8 h-8" />
                  <span className="text-sm font-medium">深色</span>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* 密度 */}
        <Card>
          <CardHeader>
            <h4 className="text-sm font-semibold">密度</h4>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              {['comfortable', 'compact', 'spacious'].map((density) => (
                <button
                  key={density}
                  onClick={() =>
                    handleThemeChange({
                      density: density as 'comfortable' | 'compact' | 'spacious',
                    })
                  }
                  className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                    themeState.density === density
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                      : 'border-border hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{density}</span>
                    {themeState.density === density && (
                      <CheckIcon className="w-4 h-4 text-primary-500" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {density === 'comfortable' && '适中的间距和尺寸'}
                    {density === 'compact' && '紧凑的布局,节省空间'}
                    {density === 'spacious' && '宽松的布局,提升可读性'}
                  </p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 色调 */}
        <Card>
          <CardHeader>
            <h4 className="text-sm font-semibold">色调</h4>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              {hueOptions.map((hue) => (
                <button
                  key={hue}
                  onClick={() => handleThemeChange({ hue })}
                  className={`aspect-square rounded-lg border-2 transition-all ${
                    themeState.hue === hue
                      ? 'border-primary-500 ring-2 ring-primary-200 dark:ring-primary-800'
                      : 'border-border hover:border-primary-300'
                  }`}
                  style={{
                    backgroundColor: getHueColor(hue),
                  }}
                  title={hue}
                  aria-label={`选择 ${hue} 色调`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 表面 */}
        <Card>
          <CardHeader>
            <h4 className="text-sm font-semibold">表面</h4>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleThemeChange({ surface: 'flat' })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  themeState.surface === 'flat'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                    : 'border-border hover:border-primary-300'
                }`}
              >
                <div className="text-sm font-medium">扁平</div>
                <div className="text-xs text-muted-foreground mt-1">
                  简洁的平面设计
                </div>
              </button>

              <button
                onClick={() => handleThemeChange({ surface: 'elevated' })}
                className={`p-4 rounded-lg border-2 shadow-md transition-all ${
                  themeState.surface === 'elevated'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                    : 'border-border hover:border-primary-300'
                }`}
              >
                <div className="text-sm font-medium">浮雕</div>
                <div className="text-xs text-muted-foreground mt-1">
                  带阴影的立体效果
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* RTL */}
        <Card>
          <CardHeader>
            <h4 className="text-sm font-semibold">文字方向</h4>
          </CardHeader>
          <CardContent>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <div className="text-sm font-medium">从右到左 (RTL)</div>
                <div className="text-xs text-muted-foreground mt-1">
                  适用于阿拉伯语、希伯来语等
                </div>
              </div>
              <input
                type="checkbox"
                checked={themeState.rtl}
                onChange={(e) => handleThemeChange({ rtl: e.target.checked })}
                className="w-5 h-5 rounded border-border text-primary-500 focus:ring-2 focus:ring-primary-500"
              />
            </label>
          </CardContent>
        </Card>
      </div>

      {/* 底部重置按钮 */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full"
          onClick={handleReset}
        >
          <RefreshIcon className="w-4 h-4 mr-2" />
          重置主题
        </Button>
      </div>
    </div>
  )
}

// ===== 工具函数 =====

function getHueColor(hue: string): string {
  const hueColors: Record<string, string> = {
    blue: '#3b82f6',
    indigo: '#6366f1',
    violet: '#8b5cf6',
    purple: '#a855f7',
    pink: '#ec4899',
    red: '#ef4444',
    orange: '#f97316',
    yellow: '#eab308',
    green: '#22c55e',
    teal: '#14b8a6',
  }

  return hueColors[hue] || '#3b82f6'
}

// ===== 图标组件 =====

function SunIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function MoonIcon({ className }: { className?: string }) {
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
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
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
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function RefreshIcon({ className }: { className?: string }) {
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
      <path d="M21 2v6h-6" />
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M3 22v-6h6" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    </svg>
  )
}